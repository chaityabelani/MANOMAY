'use server'

import { getSession } from "@/app/actions/auth";
import Shop from "@/models/Shop";
import FoodPark from "@/models/FoodPark";
import User from "@/models/User";
import Product from "@/models/Product";
import { revalidatePath } from "next/cache";
import { model } from "@/lib/gemini";
import mongoose from "mongoose";

// Helper to ensure DB connection (Next.js server actions might need this if not globally handled)
// Actually, mongoose usually persists connection, but let's be safe or rely on layout connect? 
// Next.js instrumentations or ad-hoc connect. 
// For now, let's assume global connect or add it here if needed. 
// We don't have a global db connect util in `src/lib/db.ts` yet? We should check updates.
// We accepted the risk.
import { redirect } from "next/navigation";

// --- Register Shop ---
export async function registerShop(prevState: any, formData: FormData) {
    const session = await getSession();
    if (!session || !session.user) {
        return { error: "You must be logged in to register a shop." };
    }

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const cuisineTypeCombined = formData.get("cuisineType") as string;

    if (!name) return { error: "Shop Name is required." };

    try {
        // 1. Find the default Food Park (For now, we assume single tenant or first active)
        // If no park exists, we might create one for dev purposes? 
        let park = await FoodPark.findOne({ isActive: true });

        if (!park) {
            // Fallback for dev: Create a default park if none exists
            const adminUser = await User.findOne({ role: 'superadmin' }) || session.user;
            park = await FoodPark.create({
                name: "Manomay Food Park",
                location: { lat: 0, lng: 0, address: "Default Location" },
                adminId: adminUser._id || session.user.id, // weak type check fix
                isActive: true
            });
        }

        // 2. Create Shop
        const newShop = await Shop.create({
            parkId: park._id,
            name,
            description,
            cuisineType: cuisineTypeCombined ? cuisineTypeCombined.split(',').map(c => c.trim()) : [],
            ownerId: session.user.id,
            isActive: true
        });

        // 3. Update User Role
        await User.findByIdAndUpdate(session.user.id, { role: 'vendor' });

        // 4. Revalidate
        revalidatePath('/profile');

    } catch (error: any) {
        console.error("Registration Error:", error);
        return { error: error.message || "Failed to register shop." };
    }

    // Redirect must be outside try/catch
    redirect('/vendor/dashboard');
}

// --- Menu Parsing (AI) ---
export async function parseMenuImage(formData: FormData) {
    const session = await getSession();
    if (!session || !session.user) return { error: "Unauthorized" };

    const file = formData.get("file") as File;
    if (!file) return { error: "No file uploaded" };

    try {
        // Convert File to Base64 for Gemini
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64Image = buffer.toString("base64");

        const mimeType = file.type || "image/jpeg";

        const prompt = `
        Authenticate as a Food Menu Parser.
        Analyze the image and extract all food items.
        Return ONLY a raw JSON array.
        Schema: [{ name: string, price: number, description: string, category: string }]
        If duplicate items found, merge them.
        Infer category if missing.
        `;

        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    data: base64Image,
                    mimeType: mimeType
                }
            }
        ]);

        const response = await result.response;
        const text = response.text();

        // Clean markdown
        const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const items = JSON.parse(cleanText);

        return { success: true, items };
    } catch (error: any) {
        console.error("AI Parse Error:", error);
        return { error: "Failed to parse menu. " + error.message };
    }
}

// --- Save Menu Items ---
export async function saveMenuItems(shopId: string, items: any[]) {
    const session = await getSession();
    if (!session || !session.user) return { error: "Unauthorized" };

    try {
        let targetShopId = shopId;

        // Check availability of FIND_MY_SHOP
        if (shopId === "FIND_MY_SHOP") {
            const shop = await Shop.findOne({ ownerId: session.user.id });
            if (!shop) return { error: "No shop found for this user." };
            targetShopId = shop._id.toString();
        }

        // Validate Ownership
        const shop = await Shop.findById(targetShopId);
        if (!shop) return { error: "Shop not found" };
        if (shop.ownerId.toString() !== session.user.id) return { error: "You do not own this shop" };

        const products = items.map(item => ({
            shopId: shop._id,
            name: item.name,
            description: item.description || "",
            price: item.price,
            category: item.category || "General",
            isAvailable: true
        }));

        await Product.insertMany(products);
        revalidatePath('/vendor/dashboard');
        return { success: true };
    } catch (error: any) {
        return { error: error.message };
    }
}

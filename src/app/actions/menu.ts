'use server';

import { model } from '@/lib/gemini';
import { getSession } from './auth';
import Product from '@/models/Product';
import Shop from '@/models/Shop';
import connectDB from '@/lib/db';

export interface ParsedMenuItem {
    name: string;
    price: number;
    description: string;
    category: string;
}

export async function parseMenuImage(formData: FormData) {
    try {
        // Check authentication
        const session = await getSession();
        if (!session?.user) {
            return { success: false, error: 'Unauthorized' };
        }

        const file = formData.get('menuImage') as File;
        if (!file) {
            return { success: false, error: 'No file provided' };
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            return { success: false, error: 'File must be an image' };
        }

        // Convert File to Buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Prepare image for Gemini
        const base64Image = buffer.toString('base64');
        const mimeType = file.type;

        const imagePart = {
            inlineData: {
                data: base64Image,
                mimeType,
            },
        };

        const prompt = `
You are an AI Menu Parser. 
Analyze the provided menu image and extract all food items.
Return ONLY a valid JSON array of objects. Do not include markdown formatting (like \`\`\`json).
Each object should have:
- name (string): Name of the dish
- price (number): Price of the dish (extract number only, no currency symbols)
- description (string): Description if available, else empty string
- category (string): Infer category (e.g., Starter, Main, Dessert, Drink, Snack) based on context.

If the image is not a menu, return an empty array [].
Example output:
[
  {"name": "Margherita Pizza", "price": 12.99, "description": "Fresh tomatoes and mozzarella", "category": "Main"},
  {"name": "Caesar Salad", "price": 8.50, "description": "", "category": "Starter"}
]
    `;

        // Call Gemini API
        const result = await model.generateContent([prompt, imagePart]);
        const response = await result.response;
        const text = response.text();

        // Parse the response
        const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsedItems: ParsedMenuItem[] = JSON.parse(cleanText);

        return {
            success: true,
            items: parsedItems,
        };
    } catch (error: any) {
        console.error('Menu parsing error:', error);
        return {
            success: false,
            error: error.message || 'Failed to parse menu',
        };
    }
}

export async function saveMenuItems(shopId: string, items: ParsedMenuItem[]) {
    try {
        const session = await getSession();
        if (!session?.user) {
            return { success: false, error: 'Unauthorized' };
        }

        await connectDB();

        // Verify shop exists
        const shop = await Shop.findById(shopId);
        if (!shop) {
            return { success: false, error: 'Shop not found' };
        }

        // Create products in database
        const createdProducts = await Product.insertMany(
            items.map((item) => ({
                shopId,
                name: item.name,
                description: item.description,
                price: item.price,
                category: item.category,
                isAvailable: true,
            }))
        );

        return {
            success: true,
            message: `Successfully saved ${createdProducts.length} items`,
            count: createdProducts.length,
        };
    } catch (error: any) {
        console.error('Save menu items error:', error);
        return {
            success: false,
            error: error.message || 'Failed to save menu items',
        };
    }
}

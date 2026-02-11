
import { model, fileToGenerativePart } from "./src/lib/gemini";
import fs from "fs";
import path from "path";

async function scanMenu(imagePath: string) {
    try {
        const fullPath = path.resolve(imagePath);
        if (!fs.existsSync(fullPath)) {
            console.error(`❌ File not found: ${fullPath}`);
            process.exit(1);
        }

        console.log(`📸 Scanning menu from: ${fullPath}`);

        // Simple MIME type detection based on extension
        const ext = path.extname(fullPath).toLowerCase();
        let mimeType = "image/jpeg";
        if (ext === ".png") mimeType = "image/png";
        if (ext === ".webp") mimeType = "image/webp";

        const imagePart = await fileToGenerativePart(fullPath, mimeType);

        const prompt = `
    You are an AI Menu Parser. 
    Analyze the provided menu image and extract all food items.
    Return ONLY a valid JSON array of objects. Do not include markdown formatting (like \`\`\`json).
    Each object should have:
    - name (string): Name of the dish
    - price (number): Price of the dish (extract number only)
    - description (string): Description if available, else empty string
    - category (string): Infer category (e.g., Starter, Main, Dessert, Drink) based on context.
    
    If the image is not a menu, return an empty array [].
    `;

        const result = await model.generateContent([prompt, imagePart]);
        const response = await result.response;
        const text = response.text();

        console.log("🤖 AI Response Raw:");
        console.log(text);

        try {
            const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
            const json = JSON.parse(cleanText);
            console.log("\n✅ Parsed JSON:");
            console.log(JSON.stringify(json, null, 2));
        } catch (e) {
            console.error("❌ Failed to parse JSON response:", e);
        }

    } catch (error) {
        console.error("❌ Error scanning menu:", error);
    }
}

const imageArg = process.argv[2];
if (!imageArg) {
    console.log("Usage: npx tsx test-menu-scan.ts <path-to-image>");
    process.exit(1);
}

scanMenu(imageArg);

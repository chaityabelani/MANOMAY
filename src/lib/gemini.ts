import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Lazy-loaded Gemini model getter
 * Only checks for API key when actually needed (runtime), not during build
 */
export const getGeminiModel = () => {
    const apiKey = process.env.GOOGLE_API_KEY;

    if (!apiKey) {
        throw new Error("GOOGLE_API_KEY is not defined in environment variables");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    return genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
};

export async function fileToGenerativePart(path: string, mimeType: string) {
    const fs = require("fs");
    return {
        inlineData: {
            data: Buffer.from(fs.readFileSync(path)).toString("base64"),
            mimeType
        },
    };
}

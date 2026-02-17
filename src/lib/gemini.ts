import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.GOOGLE_API_KEY;

if (!API_KEY) {
  throw new Error("GOOGLE_API_KEY is not defined in environment variables");
}

const genAI = new GoogleGenerativeAI(API_KEY);

/**
 * Get Gemini model for menu scanning
 * Using stable v1 model
 */
export function getGeminiModel() {
  return genAI.getGenerativeModel({
    model: "gemini-1.5-flash", // ✅ FIXED (removed -latest)
    generationConfig: {
      temperature: 0.2, // Lower = better structured JSON
      topP: 1,
      topK: 1,
      maxOutputTokens: 2048,
    },
  });
}

/**
 * Scan menu image and extract products
 */
export async function scanMenuImage(
  imageBuffer: Buffer,
  mimeType: string
) {
  const model = getGeminiModel();

  const prompt = `
Extract all menu items from this image.

Return ONLY a valid JSON array with this exact structure:
[
  {
    "name": "dish name",
    "price": number,
    "description": "brief description"
  }
]

Rules:
- Extract ALL visible menu items
- Price must be number only (no ₹ $ etc)
- If no description visible, use empty string
- Do NOT return markdown
- Do NOT return explanations
`;

  const imagePart = {
    inlineData: {
      data: imageBuffer.toString("base64"),
      mimeType,
    },
  };

  // ✅ NEW structured format (recommended)
  const result = await model.generateContent({
    contents: [
      {
        role: "user",
        parts: [
          { text: prompt },
          imagePart,
        ],
      },
    ],
  });

  const response = await result.response;
  const text = response.text();

  // 🔥 Clean response safely
  const cleanText = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  try {
    return JSON.parse(cleanText);
  } catch (error) {
    console.error("❌ Failed to parse Gemini response:");
    console.error(cleanText);
    throw new Error(
      "Invalid response from AI - could not extract menu items"
    );
  }
}

export default genAI;

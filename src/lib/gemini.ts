import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.GOOGLE_API_KEY;

if (!API_KEY) {
    throw new Error('GOOGLE_API_KEY is not defined in environment variables');
}

// Initialize Gemini AI client
const genAI = new GoogleGenerativeAI(API_KEY);

/**
 * Get Gemini model for menu scanning
 * Using gemini-1.5-flash-001 (specific version) for reliable v1beta API compatibility
 */
export function getGeminiModel() {
    return genAI.getGenerativeModel({ model: 'gemini-1.5-flash-001' });
}

/**
 * Scan menu image and extract products
 * @param imageBuffer - Image file buffer
 * @param mimeType - Image MIME type (e.g., 'image/jpeg')
 * @returns Array of extracted products
 */
export async function scanMenuImage(imageBuffer: Buffer, mimeType: string) {
    const model = getGeminiModel();

    const prompt = `Extract all menu items from this image. Return ONLY a valid JSON array with this exact structure:
[
  {
    "name": "dish name",
    "price": number (no currency symbol),
    "description": "brief description"
  }
]

Rules:
- Extract ALL visible menu items
- Price must be a number only
- If no description visible, use empty string
- Return ONLY the JSON array, no extra text`;

    const imagePart = {
        inlineData: {
            data: imageBuffer.toString('base64'),
            mimeType,
        },
    };

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();

    // Parse JSON from response
    try {
        // Extract JSON from markdown code blocks if present
        const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/\[[\s\S]*\]/);
        const jsonText = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : text;
        return JSON.parse(jsonText);
    } catch (error) {
        console.error('Failed to parse Gemini response:', text);
        throw new Error('Invalid response from AI - could not extract menu items');
    }
}

export default genAI;

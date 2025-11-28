import { GoogleGenAI } from "@google/genai";
import { AnalysisResult, ProductData } from "../types";
import { cleanJsonString, processImage } from "../utils/helpers";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Retry helper for robust API calls
async function makeRequestWithRetry<T>(fn: () => Promise<T>, retries = 3, delay = 1000): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) throw error;
    console.warn(`API call failed, retrying... (${retries} attempts left)`, error);
    await new Promise(resolve => setTimeout(resolve, delay));
    return makeRequestWithRetry(fn, retries - 1, delay * 2);
  }
}

export const analyzeProduct = async (
  query: string, 
  imageFile?: File
): Promise<AnalysisResult> => {
  
  const parts: any[] = [];

  // Process and compress image if present
  if (imageFile) {
    try {
        const imagePart = await processImage(imageFile);
        parts.push(imagePart);
    } catch (e) {
        console.error("Image processing failed:", e);
        throw new Error("Failed to process the image. Please try a different photo.");
    }
  }

  // Construct the prompt
  const promptText = `
    ${query ? `User Query: "${query}"` : ''}
    ${imageFile ? 'Analyze the product shown in the image.' : 'Analyze the product mentioned in the query.'}

    Perform a comprehensive search using Google Search to find real-time details, prices, available offers, and reviews for this product specifically in the **INDIAN MARKET**.
    
    RETURN ONLY A VALID JSON OBJECT. Do not include markdown formatting or extra text outside the JSON.
    Escape all newlines in strings with \\n. Do not use control characters.
    
    The JSON structure must be exactly this:
    {
      "productName": "Concise product name for search (Brand + Model + Key Spec, max 5-6 words)",
      "brand": "Brand Name",
      "category": "Product Category",
      "description": "A detailed technical description of the product features.",
      "keyFeatures": ["Feature 1", "Feature 2", "Feature 3"],
      "sellers": [
        {
          "name": "Store Name",
          "price": "Price value in INR (e.g. 19999)",
          "currency": "INR",
          "link": "Direct URL to the product page (if found, otherwise leave blank)",
          "inStock": true,
          "offers": "Specific bank offers (HDFC/SBI/ICICI) or coupons"
        }
      ],
      "reviews": {
        "averageRating": 4.5,
        "totalReviews": "1,200+",
        "sentiment": "positive", 
        "pros": ["Pro 1", "Pro 2"],
        "cons": ["Con 1", "Con 2"],
        "summary": "A brief summary of what Indian users are saying."
      }
    }
    
    STRICT REQUIREMENTS:
    1. **REGION**: Search ONLY for India. Prices must be in Indian Rupees (₹).
    2. **SOURCES**: You MUST find prices from 6 to 8 DIFFERENT Indian sellers. 
       - Priority List: **Amazon.in, Flipkart, JioMart, Croma, Reliance Digital, Vijay Sales, Tata Cliq, Myntra, Ajio**.
       - Quick Commerce (if available): **Blinkit, Zepto, Swiggy Instamart**.
    3. **LINKS**: Try to find direct links, but if unsure, prioritize accurate store names so we can search for it.
    4. **ACCURACY**: Ensure the product model matches exactly across all sellers.
  `;

  parts.push({ text: promptText });

  try {
    // Wrap API call in retry logic
    const response = await makeRequestWithRetry(async () => {
        return await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts },
            config: {
                tools: [{ googleSearch: {} }],
                // responseSchema is NOT allowed with googleSearch
                temperature: 0.2, 
            },
        });
    });

    const textResponse = response.text;
    
    // Extract Grounding Metadata (Sources)
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.map((chunk: any) => chunk.web)
      .filter((web: any) => web && web.uri) || [];

    // Parse JSON
    let productData: ProductData | null = null;
    try {
      const cleanedJson = cleanJsonString(textResponse);
      productData = JSON.parse(cleanedJson);
    } catch (e) {
      console.error("Failed to parse JSON from Gemini response", e);
      // Fallback logic could be added here, but returning null triggers the raw text view
    }

    return {
      productData,
      sources,
      rawText: textResponse
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
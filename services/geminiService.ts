
import { GoogleGenAI } from "@google/genai";
import { AnalysisResult, ProductData } from "../types";
import { cleanJsonString, processImage } from "../utils/helpers";

export const analyzeProduct = async (
  query: string, 
  imageFile?: File
): Promise<AnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const parts: any[] = [];

  if (imageFile) {
    try {
        const imagePart = await processImage(imageFile);
        parts.push(imagePart);
    } catch (e) {
        throw new Error("IMAGE_PROCESSING_FAILED: Unable to optimize image for analysis.");
    }
  }

  const promptText = `
    PERSISTENT_INSTRUCTION: ACT AS VAB_CORE_INTELLIGENCE.
    
    FORENSIC_MISSION: 
    1. Scan Indian retail nodes (Amazon, Flipkart, Croma, Reliance Digital, Vijay Sales).
    2. Retrieve SKU identification for request: "${query}".
    3. Generate forensic price health report in INR (₹).
    
    JSON_SCHEMA_REQUIREMENT (RETURN ONLY RAW JSON):
    {
      "productName": "FULL_MODEL_NAME",
      "brand": "BRAND_NAME",
      "category": "CATEGORY",
      "description": "DEEP_TECHNICAL_FORENSIC_SUMMARY",
      "keyFeatures": ["SPEC_A", "SPEC_B", "SPEC_C", "SPEC_D"],
      "sellers": [
        { "name": "STORE_ID", "price": "19999", "currency": "INR", "link": "DIRECT_LINK", "inStock": true, "offers": "BANK_OFFERS" }
      ],
      "reviews": {
        "averageRating": 4.5,
        "totalReviews": "1200+",
        "sentiment": "positive", 
        "pros": ["WIN_A"],
        "cons": ["FAIL_A"],
        "summary": "USER_CONSENSUS_SUMMARY",
        "consensusScore": 92
      },
      "intelligence": {
        "priceConfidence": 98,
        "volatility": "low",
        "buyRecommendation": "buy_now",
        "expectedPriceDrop": "MARKET_FORECAST",
        "last30DaysTrend": "FORENSIC_TREND_ANALYSIS"
      }
    }
  `;

  parts.push({ text: promptText });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ parts }],
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.1, 
      },
    });

    if (!response || !response.text) {
      throw new Error("EMPTY_RESPONSE: The intelligence engine returned no data.");
    }

    const textResponse = response.text;
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.map((chunk: any) => chunk.web)
      .filter((web: any) => web && web.uri) || [];

    let productData: ProductData | null = null;
    try {
      const cleanedJson = cleanJsonString(textResponse);
      productData = JSON.parse(cleanedJson);
    } catch (e) {
      console.error("PARSING_FAILURE", e);
      throw new Error("DATA_CORRUPTION: Received malformed intelligence data.");
    }

    return { productData, sources };
  } catch (error: any) {
    console.error("VAB_API_ERROR:", error);
    
    // Categorize errors for better user feedback
    const message = error?.message || "";
    
    if (message.includes("API_KEY_INVALID") || message.includes("401") || message.includes("unauthorized")) {
      throw new Error("AUTH_FAILURE: Your API Key is invalid or expired. Check environment configuration.");
    } else if (message.includes("429") || message.includes("quota") || message.includes("Rate limit")) {
      throw new Error("CAPACITY_REACHED: System overloaded. Please wait 60 seconds for node cooldown.");
    } else if (message.includes("403") || message.includes("permission")) {
      throw new Error("ACCESS_DENIED: Your key lacks permissions for this model (Gemini 3 Flash).");
    } else if (message.includes("fetch") || message.includes("network") || message.includes("Failed to fetch")) {
      throw new Error("LINK_SEVERED: Network connection failed. Verify internet uplink.");
    } else if (message.includes("model not found") || message.includes("404")) {
      throw new Error("MODEL_UNAVAILABLE: The requested intelligence core is offline.");
    }

    // Default error
    throw new Error(error.message || "SYSTEM_CRITICAL: An unknown failure occurred in VAB_CORE.");
  }
};

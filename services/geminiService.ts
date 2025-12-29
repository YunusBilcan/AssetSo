
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateProductDescription = async (productName: string, category: string, attributes: any) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a compelling e-commerce description for a product named "${productName}" in the "${category}" category.
      Key attributes: ${JSON.stringify(attributes)}.
      Keep it professional, engaging, and highlight the technical value. Format in markdown.`,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Failed to generate description. Please try again.";
  }
};

export const suggestAttributes = async (productName: string, category: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Based on the product "${productName}" and category "${category}", suggest 5-8 relevant technical specifications or attributes (e.g., Material, Dimensions, Weight, Battery Life). Return only a JSON array of strings.`,
      config: {
        responseMimeType: "application/json",
      }
    });
    return JSON.parse(response.text || "[]") as string[];
  } catch (error) {
    console.error("Gemini Error:", error);
    return [];
  }
};

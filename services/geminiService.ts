
import { GoogleGenAI } from "@google/genai";

/**
 * Calls Gemini API using the recommended @google/genai patterns.
 * Always initializes a fresh client to ensure the latest API key from the environment is used.
 */
export const callGemini = async (
  prompt: string,
  systemInstruction: string,
  history: { role: 'user' | 'model'; text: string }[],
  _apiKey?: string // Ignored to strictly follow process.env.API_KEY guidelines
): Promise<string> => {
  try {
    // Always use process.env.API_KEY directly as a named parameter.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
    
    // Using gemini-3-flash-preview as recommended for general text/RAG tasks
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...history.map(h => ({
          role: h.role,
          parts: [{ text: h.text }]
        })),
        { role: 'user', parts: [{ text: prompt }] }
      ],
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.3,
      }
    });

    // Access the .text property directly (not a method).
    return response.text || "";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
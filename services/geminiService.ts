
import { GoogleGenAI } from "@google/genai";

let aiClient: GoogleGenAI | null = null;

const getAiClient = (apiKey?: string): GoogleGenAI => {
  // If a custom key is provided, always create a new instance to ensure we use the correct credentials
  if (apiKey) {
    return new GoogleGenAI({ apiKey: apiKey });
  }

  // Fallback to singleton with env variable if no key provided
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }
  return aiClient;
};

/**
 * Direct call to Gemini SDK
 */
export const callGemini = async (
  prompt: string,
  systemInstruction: string,
  history: { role: 'user' | 'model'; text: string }[],
  apiKey?: string
): Promise<string> => {
  try {
    const ai = getAiClient(apiKey);
    
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.3,
      },
      history: history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }]
      }))
    });

    const result = await chat.sendMessage({ message: prompt });
    return result.text || "";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

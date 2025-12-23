
import { AIProvider, DocumentChunk, UploadedFile, OpenRouterModel } from "../types";
import { callGemini } from "./geminiService";

// Helper for RAG Retrieval
export const retrieveRelevantChunks = (query: string, files: UploadedFile[], topK: number = 5): DocumentChunk[] => {
  const allChunks = files.flatMap(f => f.chunks || []);
  if (allChunks.length === 0) return [];

  const queryTerms = query.toLowerCase().split(/\s+/).filter(w => w.length > 3);
  
  if (queryTerms.length === 0) return allChunks.slice(0, topK);

  const scoredChunks = allChunks.map(chunk => {
    const textLower = chunk.text.toLowerCase();
    let score = 0;
    queryTerms.forEach(term => {
      const regex = new RegExp(term, 'g');
      const count = (textLower.match(regex) || []).length;
      score += count;
    });
    return { ...chunk, score };
  });

  const relevant = scoredChunks
    .sort((a, b) => (b.score || 0) - (a.score || 0))
    .slice(0, topK);

  if (relevant.length > 0 && relevant[0].score === 0) {
     return allChunks.slice(0, topK);
  }

  return relevant;
};

export const fetchOpenRouterModels = async (apiKey: string): Promise<OpenRouterModel[]> => {
  if (!apiKey || !apiKey.trim()) throw new Error("API Key requerida para cargar modelos");

  try {
    const response = await fetch("https://openrouter.ai/api/v1/models", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${apiKey.trim()}`,
        "Content-Type": "application/json",
        "HTTP-Referer": typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000',
        "X-Title": 'BizBot AI'
      }
    });

    if (!response.ok) {
      const errorBody = await response.text();
      let errorMessage = `Error ${response.status}`;
      try {
          const jsonError = JSON.parse(errorBody);
          if (jsonError.error?.message) errorMessage += `: ${jsonError.error.message}`;
          else if (jsonError.message) errorMessage += `: ${jsonError.message}`;
          else errorMessage += `: ${errorBody.substring(0, 100)}`;
      } catch(e) { 
          errorMessage += `: ${errorBody.substring(0, 100)}`;
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data.data.sort((a: OpenRouterModel, b: OpenRouterModel) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error("Error fetching OpenRouter models:", error);
    throw error;
  }
};

// Generic OpenAI/OpenRouter fetcher
const callOpenAICompatible = async (
  provider: AIProvider,
  modelId: string,
  prompt: string,
  systemInstruction: string,
  history: { role: 'user' | 'model'; text: string }[],
  apiKey?: string
): Promise<string> => {
  
  if (!apiKey || !apiKey.trim()) {
    throw new Error(`Por favor ingresa tu API Key para ${provider === AIProvider.OPENROUTER ? 'OpenRouter' : 'OpenAI'} en la pestaña de Configuración.`);
  }

  let baseUrl = '';
  if (provider === AIProvider.OPENAI) {
    baseUrl = 'https://api.openai.com/v1/chat/completions';
  } else if (provider === AIProvider.OPENROUTER) {
    baseUrl = 'https://openrouter.ai/api/v1/chat/completions';
  }

  // Map history to provider format
  const messages = [
    { role: 'system', content: systemInstruction },
    ...history.map(h => ({ role: h.role === 'model' ? 'assistant' : 'user', content: h.text })),
    { role: 'user', content: prompt }
  ];

  try {
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey.trim()}`,
        ...(provider === AIProvider.OPENROUTER ? { 
            'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000',
            'X-Title': 'BizBot AI'
        } : {})
      },
      body: JSON.stringify({
        model: modelId,
        messages: messages,
        temperature: 0.3
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMsg = `API Request failed (${response.status})`;
      
      try {
        const err = JSON.parse(errorText);
        if (err.error?.message) {
            errorMsg = `${err.error.message}`;
        } else if (err.message) {
            errorMsg = `${err.message}`;
        } else {
            // If valid JSON but unknown structure, stringify it
            errorMsg = `(${response.status}) ${JSON.stringify(err)}`;
        }
      } catch (e) {
         // Not JSON, use text directly
         if (errorText) errorMsg = `Error (${response.status}): ${errorText.substring(0, 200)}`;
      }
      throw new Error(errorMsg);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || "";

  } catch (error: any) {
    console.error(`${provider} API Error:`, error);
    throw error;
  }
};

// Main Orchestrator
export const sendMessageToAI = async (
  provider: AIProvider,
  modelId: string,
  userMessage: string,
  files: UploadedFile[],
  baseSystemInstruction: string,
  history: { role: 'user' | 'model'; text: string }[] = [],
  apiKey?: string
): Promise<string> => {
  
  // 1. RAG Retrieval
  const relevantChunks = retrieveRelevantChunks(userMessage, files, 8);
  const contextString = relevantChunks.map((chunk, i) => 
    `[NODO DE CONOCIMIENTO ${i + 1}]:\n${chunk.text}`
  ).join('\n\n');

  const ragSystemInstruction = `
${baseSystemInstruction}

--- INSTRUCCIONES DE LA RED NEURONAL (RAG) ---
Utiliza EXCLUSIVAMENTE los siguientes "Nodos de Conocimiento" recuperados para responder a la consulta del usuario.
Si la información no está en estos nodos, indica que no tienes esa información específica en tu base de datos.

BASE DE CONOCIMIENTO RECUPERADA:
${contextString ? contextString : "No se encontró contexto relevante para esta consulta en los documentos."}
--- FIN DEL CONTEXTO ---
`;

  // 2. Provider Routing
  try {
    switch (provider) {
      case AIProvider.GEMINI:
        return await callGemini(userMessage, ragSystemInstruction, history, apiKey);
      case AIProvider.OPENAI:
      case AIProvider.OPENROUTER:
        return await callOpenAICompatible(provider, modelId, userMessage, ragSystemInstruction, history, apiKey);
      default:
        return "Proveedor no soportado.";
    }
  } catch (error: any) {
    // Return cleaner error message for UI
    return `Error conectando con ${provider}: ${error.message || 'Error desconocido'}`;
  }
};

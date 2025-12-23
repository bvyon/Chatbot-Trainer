
export enum AppView {
  DASHBOARD = 'DASHBOARD',
  TRAINING = 'TRAINING',
  CHAT = 'CHAT',
  SETTINGS = 'SETTINGS'
}

export enum AIProvider {
  GEMINI = 'GEMINI',
  OPENAI = 'OPENAI',
  OPENROUTER = 'OPENROUTER'
}

// Added missing ConnectionStatus enum used in WhatsAppConnect component
export enum ConnectionStatus {
  CONNECTED = 'CONNECTED',
  DISCONNECTED = 'DISCONNECTED'
}

export interface ApiKeys {
  [AIProvider.GEMINI]: string;
  [AIProvider.OPENAI]: string;
  [AIProvider.OPENROUTER]: string;
}

export interface OpenRouterModel {
  id: string;
  name: string;
  description?: string;
  context_length?: number;
  pricing?: {
    prompt: string;
    completion: string;
  };
}

export interface DocumentChunk {
  id: string;
  text: string;
  tokenCount: number;
  score?: number; // Relevance score for RAG simulation
}

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  content: string; // Raw full content
  chunks: DocumentChunk[]; // Vectorized/Chunked parts
  uploadDate: Date;
  status: 'processing' | 'vectorizing' | 'ready' | 'error';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

// Declaration for the global PDF.js library loaded via CDN
declare global {
  interface Window {
    pdfjsLib: any;
  }
}
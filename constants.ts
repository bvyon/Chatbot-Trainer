
import { MessageCircle, FileText, Settings, LayoutDashboard } from 'lucide-react';
import { AppView } from './types';

export const APP_NAME = "BizBot AI";

export const NAV_ITEMS = [
  { id: AppView.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
  { id: AppView.TRAINING, label: 'Entrenamiento & Exportación', icon: FileText },
  { id: AppView.CHAT, label: 'Test Chatbot', icon: MessageCircle },
  { id: AppView.SETTINGS, label: 'Configuración', icon: Settings },
];

export const DEFAULT_SYSTEM_INSTRUCTION = `Eres un asistente virtual inteligente diseñado para ayudar a los clientes de una empresa.
Tu base de conocimiento proviene estrictamente de los documentos proporcionados en el contexto.
Si la respuesta no se encuentra en el contexto proporcionado, responde amablemente que no tienes esa información y sugiere contactar a un humano.
Mantén un tono profesional, amable y conciso.`;

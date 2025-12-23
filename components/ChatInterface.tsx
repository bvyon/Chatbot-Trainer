
import React, { useState, useEffect, useRef } from 'react';
import { UploadedFile, ChatMessage, AIProvider, ApiKeys } from '../types';
import { sendMessageToAI } from '../services/aiService';
import { Send, Bot, User, RefreshCcw, Database, Zap, MessageSquare, Sparkles } from 'lucide-react';
import { DEFAULT_SYSTEM_INSTRUCTION } from '../constants';
import ReactMarkdown from 'react-markdown';

interface ChatInterfaceProps {
  files: UploadedFile[];
  provider: AIProvider;
  apiKeys: ApiKeys;
  activeModel: string;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ files, provider, apiKeys, activeModel }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: `Hola. Soy tu asistente virtual potenciado por ${provider === AIProvider.GEMINI ? 'Google Gemini' : provider === AIProvider.OPENAI ? 'OpenAI' : 'OpenRouter'}. He analizado tus documentos y estoy listo para responder.`,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Reset chat when provider changes
  useEffect(() => {
    handleReset();
  }, [provider, activeModel]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: inputText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    const historyForApi = messages.map(m => ({ role: m.role, text: m.text }));
    
    const responseText = await sendMessageToAI(
      provider,
      activeModel, // Pass the specific model ID
      userMsg.text, 
      files, 
      DEFAULT_SYSTEM_INSTRUCTION,
      historyForApi,
      apiKeys[provider] // Pass the specific key for the current provider
    );

    const botMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, botMsg]);
    setIsTyping(false);
  };

  const handleReset = () => {
    setMessages([{
      id: Date.now().toString(),
      role: 'model',
      text: `Sesión reiniciada con motor ${provider} (${activeModel}). ¿En qué puedo ayudarte con tus documentos?`,
      timestamp: new Date()
    }]);
  };

  const totalChunks = files.reduce((acc, f) => acc + (f.chunks ? f.chunks.length : 0), 0);

  return (
    <div className="flex flex-col h-full bg-slate-50 relative rounded-tl-3xl overflow-hidden animate-fade-in">
      {/* Modern Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-sm z-20 sticky top-0">
        <div className="flex items-center space-x-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg relative ${
                provider === AIProvider.GEMINI ? 'bg-gradient-to-br from-emerald-500 to-teal-600 shadow-emerald-500/30' :
                provider === AIProvider.OPENAI ? 'bg-gradient-to-br from-blue-500 to-indigo-600 shadow-blue-500/30' :
                'bg-gradient-to-br from-purple-500 to-fuchsia-600 shadow-purple-500/30'
            }`}>
                <Bot className="text-white w-6 h-6" />
                <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white bg-green-400"></span>
            </div>
            <div>
                <h3 className="font-bold text-slate-800 text-lg leading-none mb-1">BizBot Preview</h3>
                <div className="flex items-center text-xs text-slate-500 space-x-2">
                    <span className="flex items-center bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-medium">
                        <Sparkles size={10} className="mr-1 text-amber-500" />
                        {provider}
                    </span>
                    <span className="hidden md:flex items-center bg-slate-50 border border-slate-200 px-2 py-0.5 rounded text-slate-500 font-mono truncate max-w-[150px]">
                        {activeModel}
                    </span>
                    {totalChunks > 0 ? (
                        <span className="flex items-center text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded-full">
                             <Database size={10} className="mr-1" />
                             {totalChunks} Nodos
                        </span>
                    ) : (
                        <span className="flex items-center text-slate-400">
                            <Zap size={10} className="mr-1" />
                            Sin Contexto
                        </span>
                    )}
                </div>
            </div>
        </div>
        <button 
            onClick={handleReset} 
            className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors" 
            title="Reiniciar Chat"
        >
            <RefreshCcw size={20} />
        </button>
      </div>

      {/* Chat Area with Pattern */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-tech-grid relative">
        
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in-up`}>
              <div className={`flex max-w-[85%] md:max-w-[75%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-end space-x-2 space-x-reverse`}>
                
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs shadow-sm mb-1 ${
                    isUser ? 'bg-slate-800 ml-2' : 
                    provider === AIProvider.GEMINI ? 'bg-emerald-600 mr-2' :
                    provider === AIProvider.OPENAI ? 'bg-blue-600 mr-2' :
                    'bg-purple-600 mr-2'
                }`}>
                    {isUser ? <User size={14} /> : <Bot size={14} />}
                </div>

                {/* Bubble */}
                <div 
                  className={`rounded-2xl px-5 py-3.5 shadow-sm relative text-sm leading-relaxed ${
                    isUser 
                      ? 'bg-slate-800 text-white rounded-br-none' 
                      : 'bg-white text-slate-700 border border-slate-100 rounded-bl-none shadow-slate-200'
                  }`}
                >
                  <div className="markdown-body">
                    {isUser ? msg.text : <ReactMarkdown>{msg.text}</ReactMarkdown>}
                  </div>
                  
                  <div className={`text-[10px] mt-2 flex ${isUser ? 'justify-end text-slate-400' : 'justify-end text-slate-400'}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        
        {isTyping && (
          <div className="flex justify-start animate-fade-in">
             <div className="flex flex-row items-end space-x-2">
                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white shadow-sm ${
                    provider === AIProvider.GEMINI ? 'bg-emerald-600' :
                    provider === AIProvider.OPENAI ? 'bg-blue-600' :
                    'bg-purple-600'
                }`}>
                    <Bot size={14} />
                </div>
                <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-none px-5 py-4 shadow-sm flex space-x-1.5 items-center">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white p-4 border-t border-slate-200 z-20">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-3 max-w-4xl mx-auto">
            <div className="flex-1 relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400">
                    <MessageSquare size={18} />
                </div>
                <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={`Preguntar a ${provider}...`}
                    className="w-full bg-slate-100 text-slate-800 pl-11 pr-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:bg-white transition-all border border-transparent focus:border-slate-300 placeholder-slate-400 shadow-inner"
                />
            </div>
            <button 
                type="submit" 
                disabled={!inputText.trim() || isTyping}
                className={`p-3.5 rounded-xl shadow-lg transition-all transform duration-200 ${
                    inputText.trim() && !isTyping
                    ? 'bg-slate-800 text-white hover:bg-slate-900 hover:-translate-y-1' 
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
            >
            <Send size={20} className={inputText.trim() && !isTyping ? 'ml-0.5' : ''} />
            </button>
        </form>
        <div className="text-center mt-2">
            <p className="text-[10px] text-slate-400">AI puede cometer errores. Verifica la información importante.</p>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { TrainingPanel } from './components/TrainingPanel';
import { ChatInterface } from './components/ChatInterface';
import { SettingsPanel } from './components/SettingsPanel';
import { AppView, UploadedFile, AIProvider, ApiKeys } from './types';
import { Activity, CheckCircle2, Files, Users, ArrowRight, Zap, Settings, Brain } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  
  // Provider & Model State
  const [aiProvider, setAiProvider] = useState<AIProvider>(AIProvider.GEMINI);
  const [activeModel, setActiveModel] = useState<string>('gemini-2.5-flash');
  
  // State for dynamic API Keys
  const [apiKeys, setApiKeys] = useState<ApiKeys>({
    [AIProvider.GEMINI]: '',
    [AIProvider.OPENAI]: '',
    [AIProvider.OPENROUTER]: ''
  });

  // Dashboard Component
  const Dashboard = () => (
    <div className="p-8 max-w-7xl mx-auto animate-fade-in">
      <div className="mb-10 flex justify-between items-end">
        <div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">Panel de Control</h1>
            <p className="text-slate-500 text-lg">Resumen de actividad de tu cerebro de inteligencia artificial.</p>
        </div>
        <div className="flex flex-col items-end">
            <div className="flex items-center bg-slate-100 rounded-lg px-3 py-1.5 mb-1">
                <Settings size={14} className="text-slate-500 mr-2" />
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Engine: {aiProvider}</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">{activeModel}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {/* Stats Cards */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="absolute right-0 top-0 w-24 h-24 bg-green-50 rounded-bl-full -mr-4 -mt-4 z-0"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider">Nodos de Conocimiento</h3>
                <Brain className="w-5 h-5 text-emerald-500" />
            </div>
            <p className="text-3xl font-bold text-emerald-600">
                {files.reduce((acc, f) => acc + (f.chunks?.length || 0), 0)}
            </p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="absolute right-0 top-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-4 -mt-4 z-0"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider">Fuentes de Datos</h3>
                <Files className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-3xl font-bold text-slate-900">{files.length} <span className="text-sm text-slate-400 font-normal">PDFs</span></p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="absolute right-0 top-0 w-24 h-24 bg-purple-50 rounded-bl-full -mr-4 -mt-4 z-0"></div>
          <div className="relative z-10">
             <div className="flex items-center justify-between mb-4">
                <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider">Tokens Estimados</h3>
                <Users className="w-5 h-5 text-purple-500" />
            </div>
            <p className="text-3xl font-bold text-slate-900">
                {(files.reduce((acc, f) => acc + f.content.length, 0) / 4).toFixed(0)}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="absolute right-0 top-0 w-24 h-24 bg-amber-50 rounded-bl-full -mr-4 -mt-4 z-0"></div>
          <div className="relative z-10">
             <div className="flex items-center justify-between mb-4">
                <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider">Estado Motor</h3>
                <CheckCircle2 className="w-5 h-5 text-amber-500" />
            </div>
            <p className="text-3xl font-bold text-slate-900">Listo</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-bold text-lg text-slate-800">Guía de Configuración Portátil</h3>
                <span className="text-xs font-mono text-slate-400">v3.0.0</span>
            </div>
            <div className="p-8 space-y-8">
                <div className="flex items-start group cursor-pointer" onClick={() => setCurrentView(AppView.TRAINING)}>
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg shrink-0 transition-colors mr-5">1</div>
                    <div className="flex-1">
                        <h4 className="font-bold text-slate-900 text-lg mb-1 group-hover:text-blue-600 transition-colors flex items-center">
                            Entrenar Cerebro
                            <ArrowRight size={16} className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2" />
                        </h4>
                        <p className="text-slate-500">Sube tus manuales en PDF para procesar el conocimiento semántico.</p>
                    </div>
                </div>
                
                <div className="flex items-start group cursor-pointer" onClick={() => setCurrentView(AppView.CHAT)}>
                    <div className="w-12 h-12 rounded-2xl bg-purple-50 group-hover:bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-lg shrink-0 transition-colors mr-5">2</div>
                    <div className="flex-1">
                        <h4 className="font-bold text-slate-900 text-lg mb-1 group-hover:text-purple-600 transition-colors flex items-center">
                            Validar Respuestas
                            <ArrowRight size={16} className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2" />
                        </h4>
                        <p className="text-slate-500">Prueba cómo el bot utiliza tu base de conocimiento en tiempo real.</p>
                    </div>
                </div>
                
                 <div className="flex items-start group cursor-pointer" onClick={() => setCurrentView(AppView.TRAINING)}>
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 group-hover:bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-lg shrink-0 transition-colors mr-5">3</div>
                    <div className="flex-1">
                        <h4 className="font-bold text-slate-900 text-lg mb-1 group-hover:text-emerald-600 transition-colors flex items-center">
                            Exportar para Multicanal
                            <ArrowRight size={16} className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2" />
                        </h4>
                        <p className="text-slate-500">Descarga el brain_config.json para usarlo en Python o integraciones personalizadas.</p>
                    </div>
                </div>
            </div>
        </div>

        <div className="bg-slate-900 rounded-2xl shadow-2xl text-white p-8 flex flex-col justify-between relative overflow-hidden border border-slate-800">
            {/* Gradient Orbs */}
            <div className={`absolute top-0 right-0 w-64 h-64 rounded-full filter blur-[100px] opacity-20 ${
                aiProvider === AIProvider.GEMINI ? 'bg-emerald-500' : aiProvider === AIProvider.OPENAI ? 'bg-blue-500' : 'bg-purple-500'
            }`}></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500 rounded-full filter blur-[100px] opacity-20"></div>

            <div className="relative z-10">
                <div className={`inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium mb-6 border border-white/10 ${
                    aiProvider === AIProvider.GEMINI ? 'text-emerald-300' : 'text-blue-300'
                }`}>
                    <Zap size={12} fill="currentColor" />
                    <span>AI ENGINE: {aiProvider}</span>
                </div>
                <h3 className="font-bold text-3xl mb-2 leading-tight">
                    {aiProvider === AIProvider.GEMINI ? 'Gemini 2.5 Flash' : aiProvider === AIProvider.OPENAI ? 'GPT-4o Mini' : 'OpenRouter AI'}
                </h3>
                <p className="font-mono text-xs text-slate-400 mb-6 truncate">{activeModel}</p>
                
                <p className="text-slate-300 mb-8 leading-relaxed text-sm">
                    {aiProvider === AIProvider.GEMINI 
                     ? "Arquitectura optimizada para alta velocidad y baja latencia. Contexto masivo."
                     : aiProvider === AIProvider.OPENAI 
                     ? "Motor de razonamiento avanzado estándar de la industria."
                     : "Conectado a un ecosistema descentralizado de modelos LLM."}
                </p>
                <button 
                  onClick={() => setCurrentView(AppView.SETTINGS)}
                  className="w-full bg-white text-slate-900 py-3 rounded-xl font-bold hover:bg-slate-100 transition-colors shadow-lg text-sm"
                >
                    Configurar Cerebro
                </button>
            </div>
        </div>
      </div>
    </div>
  );

  const renderView = () => {
    switch (currentView) {
      case AppView.DASHBOARD: return <Dashboard />;
      case AppView.TRAINING: return <TrainingPanel files={files} setFiles={setFiles} />;
      case AppView.CHAT: 
        return <ChatInterface files={files} provider={aiProvider} apiKeys={apiKeys} activeModel={activeModel} />;
      case AppView.SETTINGS: 
        return <SettingsPanel 
            currentProvider={aiProvider} 
            setProvider={setAiProvider} 
            apiKeys={apiKeys} 
            setApiKeys={setApiKeys}
            activeModel={activeModel}
            setActiveModel={setActiveModel}
        />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      <Sidebar currentView={currentView} onNavigate={setCurrentView} />
      <main className="flex-1 overflow-hidden relative flex flex-col">
        {/* Subtle header gradient/shine */}
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-white to-transparent pointer-events-none z-0"></div>
        <div className="flex-1 overflow-auto z-10 relative">
            {renderView()}
        </div>
      </main>
    </div>
  );
};

export default App;

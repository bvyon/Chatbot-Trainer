
import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { TrainingPanel } from './components/TrainingPanel';
import { ChatInterface } from './components/ChatInterface';
import { SettingsPanel } from './components/SettingsPanel';
import { AppView, UploadedFile, AIProvider, ApiKeys } from './types';
import { CheckCircle2, Files, Users, ArrowRight, Zap, Settings, Brain } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  
  const [aiProvider, setAiProvider] = useState<AIProvider>(AIProvider.GEMINI);
  const [activeModel, setActiveModel] = useState<string>('gemini-3-flash-preview');
  
  const [apiKeys, setApiKeys] = useState<ApiKeys>({
    [AIProvider.GEMINI]: '',
    [AIProvider.OPENAI]: '',
    [AIProvider.OPENROUTER]: ''
  });

  const Dashboard = () => (
    <div className="p-8 max-w-7xl mx-auto animate-fade-in">
      <div className="mb-10 flex justify-between items-end">
        <div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">Panel de Control</h1>
            <p className="text-slate-500 text-lg">Gestiona el cerebro de tu asistente inteligente.</p>
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
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider">Conocimiento</h3>
                <Brain className="w-5 h-5 text-emerald-500" />
            </div>
            <p className="text-3xl font-bold text-emerald-600">
                {files.reduce((acc, f) => acc + (f.chunks?.length || 0), 0)} <span className="text-sm font-normal text-slate-400">nodos</span>
            </p>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider">Documentos</h3>
                <Files className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-3xl font-bold text-slate-900">{files.length}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider">Tokens Extraídos</h3>
                <Users className="w-5 h-5 text-purple-500" />
            </div>
            <p className="text-3xl font-bold text-slate-900">
                {(files.reduce((acc, f) => acc + f.content.length, 0) / 4).toFixed(0)}
            </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider">Estado RAG</h3>
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            </div>
            <p className="text-3xl font-bold text-slate-900">Activo</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-bold text-lg text-slate-800">Flujo de Trabajo Multicanal</h3>
            </div>
            <div className="p-8 space-y-8">
                <div className="flex items-start group cursor-pointer" onClick={() => setCurrentView(AppView.TRAINING)}>
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 font-bold flex items-center justify-center shrink-0 mr-5">1</div>
                    <div className="flex-1">
                        <h4 className="font-bold text-slate-900 text-lg group-hover:text-blue-600 transition-colors flex items-center">
                            Subir & Procesar PDFs
                            <ArrowRight size={16} className="ml-2" />
                        </h4>
                        <p className="text-slate-500">Convierte tus manuales en una red neuronal de datos.</p>
                    </div>
                </div>
                
                <div className="flex items-start group cursor-pointer" onClick={() => setCurrentView(AppView.CHAT)}>
                    <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 font-bold flex items-center justify-center shrink-0 mr-5">2</div>
                    <div className="flex-1">
                        <h4 className="font-bold text-slate-900 text-lg group-hover:text-purple-600 transition-colors flex items-center">
                            Testear Comportamiento
                            <ArrowRight size={16} className="ml-2" />
                        </h4>
                        <p className="text-slate-500">Valida que la IA responda correctamente basándose en tus documentos.</p>
                    </div>
                </div>
                
                 <div className="flex items-start group cursor-pointer" onClick={() => setCurrentView(AppView.TRAINING)}>
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 font-bold flex items-center justify-center shrink-0 mr-5">3</div>
                    <div className="flex-1">
                        <h4 className="font-bold text-slate-900 text-lg group-hover:text-emerald-600 transition-colors flex items-center">
                            Exportar Cerebro
                            <ArrowRight size={16} className="ml-2" />
                        </h4>
                        <p className="text-slate-500">Descarga el JSON para usarlo en Python o integraciones externas.</p>
                    </div>
                </div>
            </div>
        </div>

        <div className="bg-slate-900 rounded-2xl shadow-2xl text-white p-8 relative overflow-hidden border border-slate-800">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full filter blur-[80px]"></div>
            <div className="relative z-10">
                <div className="inline-flex items-center space-x-2 bg-emerald-500/10 text-emerald-400 rounded-full px-3 py-1 text-xs font-medium mb-6">
                    <Zap size={12} fill="currentColor" />
                    <span>IA ACTIVA</span>
                </div>
                <h3 className="font-bold text-2xl mb-2">{aiProvider}</h3>
                <p className="font-mono text-[10px] text-slate-400 mb-6">{activeModel}</p>
                <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                    Motor listo para procesar consultas en lenguaje natural usando tu base de conocimiento local.
                </p>
                <button 
                  onClick={() => setCurrentView(AppView.SETTINGS)}
                  className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-lg"
                >
                    Ajustes de API
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
      <main className="flex-1 overflow-auto relative">
        {renderView()}
      </main>
    </div>
  );
};

export default App;

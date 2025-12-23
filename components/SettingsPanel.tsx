
import React, { useState, useEffect } from 'react';
import { AIProvider, ApiKeys, OpenRouterModel } from '../types';
import { fetchOpenRouterModels } from '../services/aiService';
import { Bot, Cpu, Globe, Zap, Shield, Check, Lock, KeyRound, RefreshCw, ChevronDown, AlertCircle } from 'lucide-react';
import { Button } from './Button';

interface SettingsPanelProps {
  currentProvider: AIProvider;
  setProvider: (provider: AIProvider) => void;
  apiKeys: ApiKeys;
  setApiKeys: React.Dispatch<React.SetStateAction<ApiKeys>>;
  activeModel: string;
  setActiveModel: (model: string) => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ 
  currentProvider, 
  setProvider, 
  apiKeys, 
  setApiKeys,
  activeModel,
  setActiveModel
}) => {
  const [availableModels, setAvailableModels] = useState<OpenRouterModel[]>([]);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [modelError, setModelError] = useState<string | null>(null);

  const providers = [
    {
      id: AIProvider.GEMINI,
      name: 'Google Gemini',
      description: 'Modelo nativo optimizado para alta velocidad y gran ventana de contexto.',
      icon: Bot,
      color: 'emerald',
      defaultModel: 'gemini-2.5-flash'
    },
    {
      id: AIProvider.OPENAI,
      name: 'OpenAI',
      description: 'Estándar de la industria. Alta capacidad de razonamiento.',
      icon: Zap,
      color: 'blue',
      defaultModel: 'gpt-4o-mini'
    },
    {
      id: AIProvider.OPENROUTER,
      name: 'OpenRouter',
      description: 'Agregador de modelos open source (Llama 3, Mistral, DeepSeek, etc).',
      icon: Globe,
      color: 'purple',
      // Using Gemini Flash Lite via OpenRouter as a very stable free default
      defaultModel: 'google/gemini-2.0-flash-lite-preview-02-05:free'
    }
  ];

  // Effect to load models if OpenRouter key is present on mount and valid
  useEffect(() => {
    const key = apiKeys[AIProvider.OPENROUTER];
    if (currentProvider === AIProvider.OPENROUTER && key && key.trim().length > 5 && availableModels.length === 0) {
        loadOpenRouterModels();
    }
  }, [currentProvider]);

  const handleProviderChange = (providerId: AIProvider) => {
    setProvider(providerId);
    const providerData = providers.find(p => p.id === providerId);
    
    if (providerId !== AIProvider.OPENROUTER) {
       // For Gemini/OpenAI, revert to their default fixed model
       if (providerData) setActiveModel(providerData.defaultModel);
    } else {
       // Switching to OpenRouter
       if (availableModels.length > 0) {
          // If we have models loaded, check if current is valid, else pick first
          const currentIsAvailable = availableModels.find(m => m.id === activeModel);
          if (!currentIsAvailable) {
             setActiveModel(availableModels[0].id);
          }
       } else {
          // No models loaded yet, set safe default string
          setActiveModel(providerData?.defaultModel || '');
       }
    }
  };

  const handleKeyChange = (provider: AIProvider, value: string) => {
    setApiKeys(prev => ({
      ...prev,
      [provider]: value
    }));
  };

  const loadOpenRouterModels = async () => {
    const key = apiKeys[AIProvider.OPENROUTER];
    if (!key || !key.trim()) {
        setModelError("Ingresa una API Key válida primero.");
        return;
    }

    setIsLoadingModels(true);
    setModelError(null);
    try {
        const models = await fetchOpenRouterModels(key);
        setAvailableModels(models);
        // Auto-select first model if current active model is not in the new list
        if (models.length > 0) {
            const currentInList = models.find(m => m.id === activeModel);
            if (!currentInList) {
                setActiveModel(models[0].id);
            }
        }
    } catch (err: any) {
        console.error(err);
        setModelError(err.message || "Error al cargar modelos");
    } finally {
        setIsLoadingModels(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto animate-fade-in">
      <header className="mb-8 border-b border-slate-200/60 pb-6">
        <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-slate-900 rounded-lg text-white">
                <Cpu size={24} />
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Configuración del Motor</h2>
        </div>
        <p className="text-slate-500 max-w-2xl">Selecciona el proveedor de Inteligencia Artificial y configura tus credenciales de acceso para habilitar el procesamiento.</p>
      </header>

      <div className="grid grid-cols-1 gap-6 mb-10">
        {providers.map((p) => {
            const Icon = p.icon;
            const isSelected = currentProvider === p.id;
            const colorClass = isSelected 
                ? (p.color === 'emerald' ? 'border-emerald-500 bg-emerald-50/30' : p.color === 'blue' ? 'border-blue-500 bg-blue-50/30' : 'border-purple-500 bg-purple-50/30')
                : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50';

            return (
                <div 
                    key={p.id}
                    className={`relative rounded-2xl border-2 p-6 transition-all duration-300 group ${colorClass} shadow-sm`}
                >
                    <div className="flex items-start justify-between mb-4 cursor-pointer" onClick={() => handleProviderChange(p.id)}>
                        <div className="flex items-start space-x-4">
                            <div className={`p-3 rounded-xl ${isSelected ? `bg-${p.color}-100 text-${p.color}-600` : 'bg-slate-100 text-slate-500'}`}>
                                <Icon size={28} />
                            </div>
                            <div>
                                <h3 className="font-bold text-xl text-slate-800 mb-1">{p.name}</h3>
                                <p className="text-slate-500 text-sm mb-3 leading-relaxed max-w-xl">{p.description}</p>
                                {isSelected && (
                                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-mono font-medium ${isSelected ? `bg-${p.color}-100 text-${p.color}-700` : 'bg-slate-100 text-slate-500'}`}>
                                        MODEL ID: {activeModel}
                                    </span>
                                )}
                            </div>
                        </div>
                        
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? `border-${p.color}-500 bg-${p.color}-500 text-white` : 'border-slate-300 text-transparent'}`}>
                            <Check size={14} strokeWidth={3} />
                        </div>
                    </div>

                    {/* Configuration Section */}
                    {isSelected && (
                        <div className="mt-4 pt-4 border-t border-slate-200/50 animate-fade-in">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1">
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center">
                                        <KeyRound size={14} className="mr-1.5" />
                                        API Key {p.name}
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="h-4 w-4 text-slate-400" />
                                        </div>
                                        <input
                                            type="password"
                                            value={apiKeys[p.id]}
                                            onChange={(e) => handleKeyChange(p.id, e.target.value)}
                                            placeholder={`sk-... (Requerido)`}
                                            className="w-full bg-white border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 block pl-10 p-2.5 shadow-inner font-mono transition-all"
                                        />
                                    </div>
                                    <p className="text-[11px] text-slate-500 mt-1.5 ml-1">
                                        La clave se almacena localmente en tu navegador durante esta sesión.
                                    </p>
                                </div>

                                {/* OpenRouter Specific Model Selector */}
                                {p.id === AIProvider.OPENROUTER && (
                                    <div className="flex-1">
                                         <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center justify-between">
                                            <span>Modelo Seleccionado</span>
                                            <button 
                                                onClick={loadOpenRouterModels}
                                                className={`text-[10px] flex items-center px-2 py-0.5 rounded cursor-pointer border transition-colors ${isLoadingModels ? 'bg-slate-100 text-slate-500' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border-emerald-100'}`}
                                                disabled={isLoadingModels}
                                            >
                                                {isLoadingModels ? <RefreshCw size={10} className="animate-spin mr-1" /> : <RefreshCw size={10} className="mr-1" />}
                                                {isLoadingModels ? 'Cargando...' : 'Cargar Lista de Modelos'}
                                            </button>
                                        </label>
                                        <div className="relative">
                                            <select
                                                value={activeModel}
                                                onChange={(e) => setActiveModel(e.target.value)}
                                                className="w-full bg-white border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 block p-2.5 shadow-inner font-mono appearance-none truncate pr-8"
                                                disabled={availableModels.length === 0 && !isLoadingModels}
                                            >
                                                {availableModels.length > 0 ? (
                                                    availableModels.map(m => (
                                                        <option key={m.id} value={m.id}>
                                                            {m.name}
                                                        </option>
                                                    ))
                                                ) : (
                                                    <option value={p.defaultModel}>{isLoadingModels ? "Obteniendo modelos..." : `Por defecto: ${p.defaultModel}`}</option>
                                                )}
                                            </select>
                                            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                                <ChevronDown className="h-4 w-4 text-slate-500" />
                                            </div>
                                        </div>
                                        
                                        {modelError ? (
                                            <div className="flex items-center mt-2 text-red-500 text-[11px]">
                                                <AlertCircle size={12} className="mr-1" />
                                                {modelError}
                                            </div>
                                        ) : (
                                             <p className="text-[11px] text-slate-500 mt-1.5 ml-1">
                                                {availableModels.length > 0 ? `${availableModels.length} modelos cargados.` : 'Haz clic en "Cargar Lista" para sincronizar.'}
                                             </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            );
        })}
      </div>

      <div className="bg-amber-50 border border-amber-100 rounded-xl p-5 flex items-start space-x-3 text-amber-800/80 text-sm">
        <Shield className="shrink-0 mt-0.5" size={18} />
        <div>
            <p className="font-bold mb-1">Seguridad de Credenciales</p>
            <p>
                Para <strong>Google Gemini</strong>, el sistema puede usar la clave integrada si no proporcionas una.<br/>
                Para <strong>OpenAI</strong> y <strong>OpenRouter</strong>, es obligatorio ingresar tu propia API Key aquí para evitar errores de autenticación.
            </p>
        </div>
      </div>
    </div>
  );
};


import React, { useState, useRef } from 'react';
import { UploadedFile } from '../types';
import { processPdfDocument } from '../services/pdfService';
import { Button } from './Button';
import { 
  UploadCloud, 
  FileText, 
  Trash2, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  Database, 
  Network, 
  Layers, 
  Cpu, 
  Activity,
  Download,
  FileJson
} from 'lucide-react';

interface TrainingPanelProps {
  files: UploadedFile[];
  setFiles: React.Dispatch<React.SetStateAction<UploadedFile[]>>;
}

export const TrainingPanel: React.FC<TrainingPanelProps> = ({ files, setFiles }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await processFiles(Array.from(e.target.files));
    }
  };

  const processFiles = async (fileList: File[]) => {
    setIsProcessing(true);
    
    for (const file of fileList) {
      if (file.type !== 'application/pdf') {
        alert(`El archivo ${file.name} no es un PDF.`);
        continue;
      }

      const fileId = Math.random().toString(36).substring(7);
      const tempFile: UploadedFile = {
        id: fileId,
        name: file.name,
        size: file.size,
        content: '',
        chunks: [],
        uploadDate: new Date(),
        status: 'processing'
      };
      
      setFiles(prev => [...prev, tempFile]);

      try {
        const { fullText, chunks } = await processPdfDocument(file, fileId);
        
        setFiles(prev => prev.map(f => 
            f.id === fileId ? { ...f, status: 'vectorizing' } : f
        ));
        
        await new Promise(resolve => setTimeout(resolve, 800));

        setFiles(prev => prev.map(f => 
          f.id === fileId ? { ...f, content: fullText, chunks: chunks, status: 'ready' } : f
        ));
      } catch (error) {
        console.error(error);
        setFiles(prev => prev.map(f => 
          f.id === fileId ? { ...f, status: 'error' } : f
        ));
      }
    }
    
    setIsProcessing(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await processFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleDelete = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleExportKnowledge = () => {
    const readyFiles = files.filter(f => f.status === 'ready');
    if (readyFiles.length === 0) {
      alert("No hay documentos procesados para exportar.");
      return;
    }

    const exportData = {
      project: "BizBot AI - Neural Brain",
      exportDate: new Date().toISOString(),
      totalFiles: readyFiles.length,
      totalChunks: readyFiles.reduce((acc, f) => acc + (f.chunks?.length || 0), 0),
      knowledgeBase: readyFiles.map(f => ({
        fileName: f.name,
        fileSize: f.size,
        processedAt: f.uploadDate,
        fullText: f.content,
        chunks: f.chunks?.map(c => ({
          id: c.id,
          text: c.text,
          tokens: c.tokenCount
        }))
      }))
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bizbot-brain-config-${new Date().getTime()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getTotalNodes = () => {
    return files.reduce((acc, f) => acc + (f.chunks ? f.chunks.length : 0), 0);
  };

  const hasReadyFiles = files.some(f => f.status === 'ready');

  return (
    <div className="p-8 max-w-7xl mx-auto h-full flex flex-col animate-fade-in">
      <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end border-b border-slate-200/60 pb-6 gap-4">
        <div>
            <div className="flex items-center space-x-2 mb-2">
                <Cpu className="text-emerald-600" size={28} />
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Centro de Entrenamiento</h2>
            </div>
            <p className="text-slate-500 max-w-2xl">Sube tus documentos PDF. El sistema Neural Engine los procesará y convertirá en vectores semánticos para el modelo RAG.</p>
        </div>
        
        <div className="flex items-center space-x-3">
            {hasReadyFiles && (
              <Button 
                variant="outline" 
                onClick={handleExportKnowledge}
                icon={Download}
                className="bg-white text-emerald-600 border-emerald-200 hover:bg-emerald-50 shadow-sm"
              >
                Exportar Cerebro (JSON)
              </Button>
            )}
            <div className="bg-white border border-slate-200 shadow-sm px-6 py-3 rounded-xl flex items-center text-slate-700">
                <div className="relative">
                    <Network className="mr-3 w-6 h-6 text-emerald-500" />
                    {files.length > 0 && <span className="absolute -top-1 -right-0 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                    </span>}
                </div>
                <div className="flex flex-col">
                    <span className="font-bold text-2xl leading-none">{getTotalNodes()}</span>
                    <span className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">Nodos Activos</span>
                </div>
            </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 min-h-0">
        {/* Left Column: Upload Area */}
        <div className="lg:col-span-7 flex flex-col space-y-6 overflow-y-auto pr-2">
            <div 
                className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-300 group cursor-pointer relative overflow-hidden ${
                isDragging 
                    ? 'border-emerald-500 bg-emerald-50/50' 
                    : 'border-slate-300 hover:border-emerald-400 bg-white hover:bg-slate-50/50 hover:shadow-lg'
                }`}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
            >
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-emerald-50/0 group-hover:to-emerald-50/30 transition-all duration-500"></div>
                
                <div className="relative z-10 flex flex-col items-center">
                    <div className="w-20 h-20 bg-slate-100 group-hover:bg-emerald-100 text-slate-400 group-hover:text-emerald-600 rounded-full flex items-center justify-center mb-6 transition-colors duration-300 shadow-inner">
                        <UploadCloud size={40} strokeWidth={1.5} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-emerald-700 transition-colors">Subir Base de Conocimiento</h3>
                    <p className="text-slate-500 mb-6 max-w-sm mx-auto">Arrastra tus archivos PDF aquí o haz clic para explorar. Máximo 10MB por archivo.</p>
                    
                    <input 
                        type="file" 
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        className="hidden" 
                        accept="application/pdf"
                        multiple
                    />
                    
                    <Button variant="primary" disabled={isProcessing} className="shadow-lg shadow-emerald-500/20">
                        {isProcessing ? 'Procesando Red...' : 'Explorar Archivos'}
                    </Button>
                </div>
            </div>

            {hasReadyFiles && (
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <FileJson className="text-emerald-600" size={20} />
                  <div>
                    <p className="text-sm font-bold text-emerald-900 leading-tight">Portabilidad del Cerebro</p>
                    <p className="text-xs text-emerald-700">Puedes exportar los nodos procesados para usarlos en Python, LangChain o aplicaciones personalizadas.</p>
                  </div>
                </div>
              </div>
            )}

            <div>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center">
                    <Database className="w-4 h-4 mr-2" />
                    Fuentes Ingestadas ({files.length})
                </h3>
                <div className="space-y-3">
                {files.length === 0 && (
                    <div className="text-center py-12 bg-slate-50 rounded-xl border border-slate-200 border-dashed">
                        <div className="opacity-20 mb-3">
                            <FileText size={48} className="mx-auto" />
                        </div>
                        <p className="text-slate-400 font-medium">Esperando datos para inicializar...</p>
                    </div>
                )}
                
                {files.map((file) => (
                    <div key={file.id} className="bg-white rounded-xl border border-slate-200 p-4 transition-all hover:shadow-md hover:border-emerald-200 group animate-fade-in-up">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-4">
                                <div className={`p-3 rounded-xl shadow-sm ${
                                    file.status === 'ready' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
                                }`}>
                                    <FileText size={24} strokeWidth={1.5} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800 text-sm truncate max-w-[200px] group-hover:text-emerald-700 transition-colors">{file.name}</h4>
                                    <p className="text-xs text-slate-400 mt-0.5 font-mono">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                </div>
                            </div>
                             <button 
                                onClick={(e) => { e.stopPropagation(); handleDelete(file.id); }}
                                className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                <Trash2 size={18} />
                            </button>
                        </div>

                        {/* Modern Status Bar */}
                        <div className="mt-3 flex items-center justify-between">
                             <div className="flex items-center space-x-2">
                                {file.status === 'processing' && (
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100">
                                        <Loader2 className="animate-spin mr-1.5 w-3 h-3" /> Extrayendo
                                    </span>
                                )}
                                {file.status === 'vectorizing' && (
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-purple-50 text-purple-700 border border-purple-100">
                                        <Layers className="animate-pulse mr-1.5 w-3 h-3" /> Vectorizando
                                    </span>
                                )}
                                {file.status === 'ready' && (
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                                        <CheckCircle className="mr-1.5 w-3 h-3" /> Indexado
                                    </span>
                                )}
                                {file.status === 'error' && (
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-red-50 text-red-700 border border-red-100">
                                        <AlertCircle className="mr-1.5 w-3 h-3" /> Error
                                    </span>
                                )}
                            </div>
                            {file.status === 'ready' && (
                                <div className="flex items-center text-[10px] font-mono text-slate-400">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5"></span>
                                    {file.chunks?.length || 0} vectors
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                </div>
            </div>
        </div>

        {/* Right Column: Neural Network Visualization (HUD Style) */}
        <div className="lg:col-span-5 bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden relative flex flex-col h-[600px] lg:h-auto">
            {/* Tech Header */}
            <div className="px-5 py-4 border-b border-slate-800 bg-slate-900/50 backdrop-blur flex justify-between items-center z-20">
                <div className="flex items-center space-x-2">
                    <Activity className="text-emerald-400 animate-pulse" size={18} />
                    <h3 className="font-bold text-slate-100 text-sm tracking-wide">MEMORY_CORE_V2</h3>
                </div>
                <div className="flex space-x-1">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    <div className="w-2 h-2 rounded-full bg-slate-700"></div>
                    <div className="w-2 h-2 rounded-full bg-slate-700"></div>
                </div>
            </div>
            
            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide z-10 bg-black/20 relative">
                {/* Grid Overlay */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9IiMzMzMiLz48L3N2Zz4=')] opacity-20 pointer-events-none fixed"></div>

                {files.flatMap(f => f.chunks || []).length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-600 opacity-50">
                        <div className="relative">
                            <div className="absolute inset-0 bg-emerald-500 blur-3xl opacity-10"></div>
                            <Network size={80} strokeWidth={1} className="mb-6 relative z-10" />
                        </div>
                        <p className="font-mono text-xs tracking-widest">SYSTEM_IDLE // WAITING_FOR_DATA</p>
                    </div>
                ) : (
                    files.flatMap(f => f.chunks || []).map((chunk, idx) => (
                        <div key={chunk.id} className="bg-slate-800/40 border border-slate-700/50 hover:border-emerald-500/50 p-3 rounded lg:rounded-r-none lg:border-r-0 relative group transition-all duration-300 hover:bg-slate-800/80 hover:translate-x-1">
                            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-emerald-500/30 group-hover:bg-emerald-400 transition-colors"></div>
                            <div className="flex justify-between items-center mb-1.5">
                                <span className="text-[10px] font-mono text-emerald-400 tracking-wider">
                                    NODE_{idx.toString().padStart(4, '0')}
                                </span>
                                <span className="text-[9px] text-slate-500 border border-slate-700 px-1 rounded">
                                    {chunk.tokenCount} TKS
                                </span>
                            </div>
                            <p className="text-[11px] text-slate-300 leading-relaxed line-clamp-2 font-mono opacity-70 group-hover:opacity-100 group-hover:text-white transition-all">
                                {chunk.text}
                            </p>
                        </div>
                    ))
                )}
            </div>

            {/* Sci-fi Footer */}
            <div className="px-4 py-3 border-t border-slate-800 bg-slate-900 z-20 text-[10px] font-mono text-slate-500 flex justify-between">
                <span>STATUS: {files.length > 0 ? 'ACTIVE' : 'STANDBY'}</span>
                <span>MEM: {(getTotalNodes() * 0.02).toFixed(2)}%</span>
            </div>

            {/* Background glowing orbs */}
            <div className="absolute top-1/4 -right-20 w-64 h-64 bg-emerald-600/20 rounded-full filter blur-[80px] pointer-events-none"></div>
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-indigo-600/20 rounded-full filter blur-[100px] pointer-events-none"></div>
        </div>
      </div>
    </div>
  );
};

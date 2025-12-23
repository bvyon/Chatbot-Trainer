import React, { useState, useEffect } from 'react';
import { ConnectionStatus } from '../types';
import { QrCode, Check, Smartphone, RefreshCw, ShieldCheck, Wifi } from 'lucide-react';
import { Button } from './Button';

interface WhatsAppConnectProps {
  status: ConnectionStatus;
  setStatus: (status: ConnectionStatus) => void;
}

export const WhatsAppConnect: React.FC<WhatsAppConnectProps> = ({ status, setStatus }) => {
  const [qrData, setQrData] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setQrData(Math.random().toString(36).substring(7));
  }, [status]);

  const handleSimulateScan = () => {
    setLoading(true);
    setTimeout(() => {
      setStatus(ConnectionStatus.CONNECTED);
      setLoading(false);
    }, 2000);
  };

  const handleDisconnect = () => {
    setStatus(ConnectionStatus.DISCONNECTED);
  };

  if (status === ConnectionStatus.CONNECTED) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 animate-fade-in bg-white/50 backdrop-blur-sm">
        <div className="w-32 h-32 bg-gradient-to-tr from-emerald-400 to-teal-300 rounded-full flex items-center justify-center mb-8 shadow-2xl shadow-emerald-500/30 animate-bounce">
          <Check className="w-16 h-16 text-white" strokeWidth={3} />
        </div>
        <h2 className="text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">Sincronización Completa</h2>
        <p className="text-slate-500 mb-10 text-center max-w-md text-lg">
          El bot ahora está escuchando mensajes entrantes en WhatsApp.
        </p>
        
        <div className="p-8 bg-white border border-slate-200 rounded-2xl shadow-xl w-full max-w-md mb-10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>
            <div className="flex justify-between items-center mb-6 pb-6 border-b border-slate-100">
                <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Estado de Red</span>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full uppercase flex items-center">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></span>
                    En línea
                </span>
            </div>
            <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                        <Smartphone size={20} />
                    </div>
                    <span className="text-sm text-slate-500">Número Vinculado</span>
                </div>
                <span className="font-mono font-bold text-slate-800 text-lg">+52 55 1234 ****</span>
            </div>
        </div>
        
        <Button variant="outline" onClick={handleDisconnect} className="border-red-200 text-red-600 hover:bg-red-50 px-8 py-3 rounded-xl transition-all hover:shadow-lg">
          Desconectar Sesión
        </Button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col items-center justify-center p-8 animate-fade-in">
      <div className="max-w-5xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-slate-200/60">
        
        {/* Left Side: Instructions */}
        <div className="p-10 md:p-14 md:w-1/2 flex flex-col justify-center bg-gradient-to-b from-white to-slate-50">
          <div className="flex items-center space-x-2 text-emerald-600 font-bold mb-6 uppercase tracking-widest text-xs">
             <ShieldCheck size={16} />
             <span>Conexión Segura</span>
          </div>
          
          <h2 className="text-4xl font-bold text-slate-900 mb-8 leading-tight">Vincular WhatsApp Business</h2>
          
          <div className="space-y-6">
             <div className="flex items-start group">
                <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 font-bold flex items-center justify-center mr-4 group-hover:bg-emerald-500 group-hover:text-white transition-colors">1</div>
                <p className="text-slate-600 text-lg">Abre WhatsApp en tu dispositivo móvil.</p>
             </div>
             <div className="flex items-start group">
                <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 font-bold flex items-center justify-center mr-4 group-hover:bg-emerald-500 group-hover:text-white transition-colors">2</div>
                <p className="text-slate-600 text-lg">Ve a <span className="font-bold text-slate-800">Configuración</span> &gt; <span className="font-bold text-slate-800">Dispositivos Vinculados</span>.</p>
             </div>
             <div className="flex items-start group">
                <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 font-bold flex items-center justify-center mr-4 group-hover:bg-emerald-500 group-hover:text-white transition-colors">3</div>
                <p className="text-slate-600 text-lg">Escanea el código QR que aparece a la derecha.</p>
             </div>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-200">
             <p className="text-slate-400 text-sm">La conexión utiliza cifrado de extremo a extremo. BizBot no almacena tus mensajes personales.</p>
          </div>
        </div>

        {/* Right Side: QR Code */}
        <div className="p-10 md:p-14 md:w-1/2 bg-slate-900 flex flex-col items-center justify-center relative overflow-hidden">
            {/* Background effects */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 blur-[80px] rounded-full"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/20 blur-[80px] rounded-full"></div>

            <div className="relative bg-white p-1 rounded-2xl shadow-2xl z-10">
                <div className="bg-white p-6 rounded-xl border border-slate-100">
                    <div className="w-64 h-64 bg-white flex items-center justify-center overflow-hidden relative">
                        <QrCode size={220} className="text-slate-900" />
                        
                        {/* Laser Scan Animation */}
                        {!loading && (
                            <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.8)] animate-scan opacity-80"></div>
                        )}
                        
                        {/* Logo Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-white z-20">
                               <Smartphone className="text-emerald-600" size={32} />
                            </div>
                        </div>
                    </div>
                </div>
                
                {loading && (
                     <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center z-30">
                        <RefreshCw className="animate-spin text-emerald-400 w-12 h-12 mb-4" />
                        <span className="text-lg font-bold text-white tracking-wide">Autenticando...</span>
                     </div>
                )}
            </div>

            <div className="mt-10 relative z-10 w-full max-w-xs">
                <Button 
                    onClick={handleSimulateScan} 
                    disabled={loading}
                    className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-500/20 transition-all transform hover:-translate-y-1"
                >
                   {loading ? 'Estableciendo conexión...' : 'Simular Escaneo'}
                </Button>
            </div>
            
            <div className="mt-6 flex items-center space-x-2 text-emerald-400/70 text-xs font-mono relative z-10">
                <Wifi size={14} className="animate-pulse" />
                <span>SOCKET_CONNECTION: STANDBY</span>
            </div>
        </div>
      </div>
    </div>
  );
};
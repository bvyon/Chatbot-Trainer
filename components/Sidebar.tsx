
import React from 'react';
import { AppView } from '../types';
import { NAV_ITEMS, APP_NAME } from '../constants';
import { Bot, Sparkles } from 'lucide-react';

interface SidebarProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate }) => {
  return (
    <div className="w-72 bg-slate-900 border-r border-slate-800 flex flex-col h-full shadow-2xl relative z-20 transition-all duration-300">
      {/* Logo Area */}
      <div className="p-8 flex items-center space-x-3 border-b border-slate-800/50 bg-slate-900/50 backdrop-blur-xl">
        <div className="w-10 h-10 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
          <Bot size={24} />
        </div>
        <div>
          <span className="font-bold text-xl text-white tracking-tight">{APP_NAME}</span>
          <div className="flex items-center text-[10px] text-emerald-400 font-medium uppercase tracking-wider mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse"></span>
            Online
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider px-4 mb-2">Menú Principal</div>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                isActive 
                  ? 'bg-emerald-600/10 text-emerald-400' 
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 rounded-r-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
              )}
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} className={`transition-transform group-hover:scale-110 ${isActive ? 'drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]' : ''}`} />
              <span className="font-medium tracking-wide">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer / Plan Status */}
      <div className="p-6 border-t border-slate-800/50 bg-slate-900/50 backdrop-blur-sm">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-4 border border-slate-700/50 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 bg-emerald-500/20 w-16 h-16 rounded-full blur-2xl group-hover:bg-emerald-500/30 transition-all duration-500"></div>
          
          <div className="flex items-center justify-between mb-2 relative z-10">
            <span className="text-xs font-bold text-white flex items-center">
               <Sparkles size={12} className="mr-1 text-amber-400" /> Pro Plan
            </span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">Activo</span>
          </div>
          
          <p className="text-xs text-slate-400 mb-3 relative z-10">Gemini 3 Flash Preview</p>
          
          <div className="w-full bg-slate-700 rounded-full h-1.5 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-1.5 rounded-full w-3/4 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
import React from 'react';
import { Bot, Database, ShieldCheck, FileText, RefreshCw, LayoutDashboard, MessageSquare } from 'lucide-react';
import { MondayConfig, DataHygieneAudit } from '../types';

interface HeaderProps {
  config: MondayConfig;
  audit: DataHygieneAudit;
  activeView: 'chat' | 'dashboard';
  setActiveView: (view: 'chat' | 'dashboard') => void;
  onOpenMondayConfig: () => void;
  onOpenDataQuality: () => void;
  onOpenLeadership: () => void;
  onResetChat: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  config,
  audit,
  activeView,
  setActiveView,
  onOpenMondayConfig,
  onOpenDataQuality,
  onOpenLeadership,
  onResetChat
}) => {
  return (
    <header className="sticky top-0 z-40 p-3 md:px-6">
      <div className="floating-window px-4 py-2.5 flex items-center justify-between shadow-2xl backdrop-blur-xl border border-gray-800/80">
        
        {/* Left Section: App Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-md shadow-brand-500/20">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-sm tracking-tight text-white">Skylark BI Agent</h1>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30">
                FLOATING OS
              </span>
            </div>
            <p className="text-[11px] text-gray-400 hidden md:block">Monday.com Business Intelligence & Operations Assistant</p>
          </div>
        </div>

        {/* Center Section: Navigation View Selector Dock */}
        <div className="flex items-center gap-1.5 bg-gray-950/80 p-1 rounded-2xl border border-gray-800/80 shadow-inner">
          <button
            onClick={() => setActiveView('chat')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeView === 'chat'
                ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-md shadow-brand-600/30'
                : 'text-gray-400 hover:text-white hover:bg-gray-900/60'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>AI Assistant</span>
          </button>

          <button
            onClick={() => setActiveView('dashboard')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeView === 'dashboard'
                ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-md shadow-brand-600/30'
                : 'text-gray-400 hover:text-white hover:bg-gray-900/60'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Analytics Dashboard</span>
          </button>
        </div>

        {/* Right Section: Action Controls & Status Badges */}
        <div className="flex items-center gap-2">
          {/* Data Hygiene Score Pill */}
          <button
            onClick={onOpenDataQuality}
            className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-900/80 hover:bg-gray-800 border border-gray-800 transition-all text-xs"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-gray-400 font-medium">Hygiene:</span>
            <span className="font-extrabold text-emerald-400">{audit.qualityScore}%</span>
          </button>

          {/* Monday.com API Connection Status Button */}
          <button
            onClick={onOpenMondayConfig}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
              config.apiToken
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{config.apiToken ? 'Monday.com Connected' : 'Offline Demo'}</span>
          </button>

          {/* Leadership Briefing Purple Action Button */}
          <button
            onClick={onOpenLeadership}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-purple-600/30 transition-all"
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Leadership Briefing</span>
          </button>

          {/* Reset Session Icon */}
          <button
            onClick={onResetChat}
            title="Reset Session"
            className="p-1.5 rounded-xl bg-gray-900/80 hover:bg-gray-800 border border-gray-800 text-gray-400 hover:text-white transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </header>
  );
};

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
    <header className="sticky top-0 z-40 p-2 md:p-3 md:px-6">
      <div className="floating-window p-2.5 md:px-4 md:py-2.5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 shadow-2xl backdrop-blur-xl border border-gray-800/80">
        
        {/* Top Row / Left Section: App Logo, Title & Mobile Action Buttons */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 md:w-8 md:h-8 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-md shadow-brand-500/20 shrink-0">
              <Bot className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-extrabold text-xs md:text-sm tracking-tight text-white whitespace-nowrap">Skylark BI Agent</h1>
                <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30">
                  FLOATING OS
                </span>
              </div>
              <p className="text-[10px] md:text-[11px] text-gray-400 hidden lg:block">Monday.com Business Intelligence Assistant</p>
            </div>
          </div>

          {/* Quick Action Badges on Mobile */}
          <div className="flex items-center gap-1.5 sm:hidden">
            <button
              onClick={onOpenDataQuality}
              title="Data Hygiene Audit"
              className="p-1.5 rounded-xl bg-gray-900/80 border border-gray-800 text-emerald-400 text-xs font-bold flex items-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{audit.qualityScore}%</span>
            </button>

            <button
              onClick={onOpenMondayConfig}
              title="Monday.com API"
              className="p-1.5 rounded-xl bg-gray-900/80 border border-gray-800 text-brand-400"
            >
              <Database className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onOpenLeadership}
              title="Leadership Briefing"
              className="p-1.5 rounded-xl bg-purple-600 text-white"
            >
              <FileText className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Center Section: Navigation View Selector Dock */}
        <div className="flex items-center gap-1 bg-gray-950/80 p-1 rounded-2xl border border-gray-800/80 shadow-inner w-full sm:w-auto justify-center">
          <button
            onClick={() => setActiveView('chat')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 md:px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
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
            className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 md:px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeView === 'dashboard'
                ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-md shadow-brand-600/30'
                : 'text-gray-400 hover:text-white hover:bg-gray-900/60'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Analytics Dashboard</span>
          </button>
        </div>

        {/* Right Section: Desktop Action Controls */}
        <div className="hidden sm:flex items-center gap-2">
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
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
              config.apiToken
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>{config.apiToken ? 'Monday.com Connected' : 'Offline Demo'}</span>
          </button>

          {/* Leadership Briefing Purple Action Button */}
          <button
            onClick={onOpenLeadership}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-purple-600/30 transition-all"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Leadership Briefing</span>
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

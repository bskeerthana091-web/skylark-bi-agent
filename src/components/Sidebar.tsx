import React from 'react';
import { Flame, AlertTriangle, PlayCircle, FileText, ChevronRight, ShieldCheck } from 'lucide-react';
import { DataHygieneAudit } from '../types';

interface SidebarProps {
  onSelectPrompt: (promptText: string) => void;
  audit: DataHygieneAudit;
  onOpenDataQuality: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  onSelectPrompt,
  audit,
  onOpenDataQuality
}) => {
  const quickQueries = [
    {
      id: 'pipeline-energy',
      icon: Flame,
      title: 'Energy Pipeline Query',
      subtitle: "How's our pipeline looking for energy sector this quarter?",
      prompt: "How's our pipeline looking for energy sector this quarter?",
      color: 'text-amber-400 bg-amber-400/10 border-amber-400/20'
    },
    {
      id: 'unbilled-ar',
      icon: AlertTriangle,
      title: 'Unbilled Work Orders & AR',
      subtitle: 'What is our unbilled work order amount and top receivable...',
      prompt: 'What is our unbilled work order amount and top receivable accounts?',
      color: 'text-rose-400 bg-rose-400/10 border-rose-400/20'
    },
    {
      id: 'execution-bottlenecks',
      icon: PlayCircle,
      title: 'Execution Bottlenecks',
      subtitle: 'Which deals are stuck in execution?',
      prompt: 'Which deals are stuck in execution?',
      color: 'text-purple-400 bg-purple-400/10 border-purple-400/20'
    },
    {
      id: 'leadership-digest',
      icon: FileText,
      title: 'Leadership Board Digest',
      subtitle: 'Generate a leadership update for the board',
      prompt: 'Generate a leadership update for the board',
      color: 'text-brand-400 bg-brand-400/10 border-brand-400/20'
    }
  ];

  const sectorBadges = [
    { name: 'Renewables', prompt: 'Show performance summary for Renewables sector' },
    { name: 'Mining', prompt: 'Give me a deep dive into Mining sector deals and work orders' },
    { name: 'Railways', prompt: 'Show Railways sector pipeline performance' },
    { name: 'Powerline', prompt: 'Show Powerline sector pipeline health' },
    { name: 'DSP', prompt: 'Show DSP & Software sector deals' }
  ];

  return (
    <aside className="hidden lg:flex flex-col w-72 shrink-0 p-3 space-y-4 font-sans h-full">
      {/* Floating Window Widget: Executive Query Shortcuts */}
      <div className="floating-window p-4 space-y-3 flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-gray-800 pb-2.5">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></span>
              Executive Queries
            </span>
            <span className="text-[10px] font-mono text-gray-400">Presets</span>
          </div>

          <div className="space-y-2">
            {quickQueries.map((query) => {
              const IconComponent = query.icon;
              return (
                <button
                  key={query.id}
                  onClick={() => onSelectPrompt(query.prompt)}
                  className="w-full text-left p-3 rounded-xl bg-gray-900/60 hover:bg-gray-900 border border-gray-800/80 hover:border-brand-500/40 transition-all duration-200 group flex items-start justify-between shadow-sm"
                >
                  <div className="space-y-1 pr-2">
                    <div className="flex items-center gap-2">
                      <div className={`p-1 rounded-md border ${query.color}`}>
                        <IconComponent className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-bold text-gray-200 group-hover:text-white transition-colors">
                        {query.title}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400 line-clamp-2 pl-6 leading-tight">
                      {query.subtitle}
                    </p>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-500 group-hover:text-brand-400 transition-transform group-hover:translate-x-0.5 shrink-0 mt-1" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Sector Quick Shortcuts */}
        <div className="pt-3 border-t border-gray-800 space-y-2">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
            Sector Analysis
          </span>
          <div className="flex flex-wrap gap-1.5">
            {sectorBadges.map((s, idx) => (
              <button
                key={idx}
                onClick={() => onSelectPrompt(s.prompt)}
                className="px-2.5 py-1 rounded-xl text-[11px] font-semibold bg-gray-900/80 hover:bg-brand-600/20 hover:text-brand-300 text-gray-300 border border-gray-800 transition-all"
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Window Widget: Data Quality Audit Pill */}
      <div
        onClick={onOpenDataQuality}
        className="floating-window p-3.5 flex items-center justify-between cursor-pointer hover:border-emerald-500/40 transition-all group"
      >
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-white block">Data Hygiene</span>
            <span className="text-[10px] text-gray-400">{audit.qualityScore}% Resilience Score</span>
          </div>
        </div>
        <span className="text-xs font-extrabold text-emerald-400 px-2 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
          {audit.qualityScore}%
        </span>
      </div>
    </aside>
  );
};

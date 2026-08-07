import React from 'react';
import { MessageSquare, Flame, AlertCircle, PieChart, Sparkles, Layers, ShieldCheck, ArrowRight, LayoutGrid } from 'lucide-react';
import { DataHygieneAudit } from '../types';

interface SidebarProps {
  onSelectPrompt: (prompt: string) => void;
  audit: DataHygieneAudit;
  onOpenDataQuality: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  onSelectPrompt,
  audit,
  onOpenDataQuality
}) => {
  const PRESET_QUESTIONS = [
    {
      title: "Energy Pipeline Query",
      prompt: "How's our pipeline looking for energy sector this quarter?",
      icon: Flame,
      color: "text-amber-400 bg-amber-500/10 border-amber-500/20"
    },
    {
      title: "Unbilled Work Orders & AR",
      prompt: "What is our unbilled work order amount and top receivable accounts?",
      icon: AlertCircle,
      color: "text-rose-400 bg-rose-500/10 border-rose-500/20"
    },
    {
      title: "Execution Bottlenecks",
      prompt: "Which deals are stuck in execution?",
      icon: Layers,
      color: "text-purple-400 bg-purple-500/10 border-purple-500/20"
    },
    {
      title: "Leadership Board Digest",
      prompt: "Generate a leadership update for the board",
      icon: Sparkles,
      color: "text-brand-400 bg-brand-500/10 border-brand-500/20"
    }
  ];

  const SECTORS = ['Renewables', 'Mining', 'Railways', 'Powerline', 'DSP'];

  return (
    <aside className="w-80 p-3 hidden lg:flex flex-col gap-4 h-[calc(100vh-6rem)] overflow-y-auto">
      {/* Widget 1: Floating Founder Quick Questions Panel */}
      <div className="floating-window p-4 space-y-3">
        <div className="window-titlebar -mx-4 -mt-4 p-3 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-2">
            <LayoutGrid className="w-4 h-4 text-brand-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-300">Executive Queries</h2>
          </div>
          <span className="w-2 h-2 rounded-full bg-brand-400 animate-ping"></span>
        </div>

        <div className="space-y-2 pt-1">
          {PRESET_QUESTIONS.map((q, idx) => {
            const IconComp = q.icon;
            return (
              <button
                key={idx}
                onClick={() => onSelectPrompt(q.prompt)}
                className="w-full text-left p-3 rounded-xl bg-gray-900/60 hover:bg-gray-800/90 border border-gray-800/80 hover:border-brand-500/40 transition-all group shadow-sm"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg border ${q.color}`}>
                      <IconComp className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold text-gray-200 group-hover:text-white">{q.title}</span>
                  </div>
                  <ArrowRight className="w-3 h-3 text-gray-500 group-hover:text-brand-400 transition-transform group-hover:translate-x-0.5" />
                </div>
                <p className="text-[11px] text-gray-400 font-mono line-clamp-2 pl-7">{q.prompt}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Widget 2: Floating Sector Shortcuts */}
      <div className="floating-window p-4 space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <PieChart className="w-4 h-4 text-purple-400" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-300">Sector Analysis</h2>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {SECTORS.map((sec, idx) => (
            <button
              key={idx}
              onClick={() => onSelectPrompt(`Show performance summary for ${sec} sector`)}
              className="px-3 py-1.5 rounded-xl text-xs font-medium bg-gray-900/80 hover:bg-brand-600/30 text-gray-300 hover:text-white border border-gray-800 hover:border-brand-500/40 transition-all shadow-xs"
            >
              {sec}
            </button>
          ))}
        </div>
      </div>

      {/* Widget 3: Data Quality Hygiene Widget */}
      <div className="floating-window p-4 mt-auto space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-gray-200 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Data Hygiene
          </span>
          <span className="text-xs font-extrabold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            {audit.qualityScore}%
          </span>
        </div>
        <p className="text-[11px] text-gray-400">
          {audit.dealsCaveatsCount + audit.workOrdersCaveatsCount} records cleaned with audit caveats.
        </p>
        <button
          onClick={onOpenDataQuality}
          className="w-full text-center py-2 rounded-xl text-xs font-semibold bg-gray-800/90 hover:bg-gray-700 text-gray-200 border border-gray-700/80 transition-all shadow-sm"
        >
          Inspect Audit Log
        </button>
      </div>
    </aside>
  );
};

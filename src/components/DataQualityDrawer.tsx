import React from 'react';
import { X, ShieldCheck, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';
import { DataHygieneAudit } from '../types';

interface DataQualityDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  audit: DataHygieneAudit;
}

export const DataQualityDrawer: React.FC<DataQualityDrawerProps> = ({
  isOpen,
  onClose,
  audit
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-md h-full bg-dark-card border-l border-gray-800 p-6 flex flex-col justify-between shadow-2xl overflow-y-auto">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-800 pb-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white">Data Hygiene & Quality Audit</h3>
                <p className="text-xs text-gray-400">Monday.com Board Resilience Engine</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quality Score Meter */}
          <div className="p-4 rounded-xl bg-gray-900/80 border border-gray-800 mb-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-300">Overall Data Resilience Score</span>
              <span className="text-lg font-extrabold text-emerald-400">{audit.qualityScore}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-gray-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                style={{ width: `${audit.qualityScore}%` }}
              ></div>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2 text-center text-xs">
              <div className="p-2 rounded-lg bg-gray-950/60 border border-gray-800/80">
                <span className="text-gray-400 block text-[10px]">Deals Board Records</span>
                <span className="font-bold text-white">{audit.totalDeals}</span>
              </div>
              <div className="p-2 rounded-lg bg-gray-950/60 border border-gray-800/80">
                <span className="text-gray-400 block text-[10px]">Work Orders Records</span>
                <span className="font-bold text-white">{audit.totalWorkOrders}</span>
              </div>
            </div>
          </div>

          {/* Issues Audit Log */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              Detected Caveats & Hygiene Actions ({audit.issuesList.length})
            </h4>
            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {audit.issuesList.map((issue, i) => (
                <div key={i} className="p-3 rounded-xl bg-gray-900/60 border border-gray-800 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-200">{issue.category}</span>
                    <span className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded ${
                      issue.severity === 'high' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {issue.severity}
                    </span>
                  </div>
                  <p className="text-gray-400 text-[11px] leading-relaxed">{issue.description}</p>
                  <span className="text-[10px] font-mono text-gray-500 block">Record ID: {issue.affectedRecord}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-4 border-t border-gray-800 text-[11px] text-gray-500 flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-brand-400 shrink-0" />
          <span>Caveats communicate data hygiene without breaking calculations.</span>
        </div>
      </div>
    </div>
  );
};

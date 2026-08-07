import React, { useState } from 'react';
import { X, FileText, Presentation, Mail, Copy, Download, Check, Sparkles, AlertCircle } from 'lucide-react';
import { LeadershipUpdate } from '../types';

interface LeadershipModalProps {
  isOpen: boolean;
  onClose: () => void;
  update: LeadershipUpdate;
}

export const LeadershipModal: React.FC<LeadershipModalProps> = ({
  isOpen,
  onClose,
  update
}) => {
  const [activeTab, setActiveTab] = useState<'digest' | 'slides' | 'email'>('digest');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    let content = '';
    if (activeTab === 'digest') {
      content = `# ${update.quarterPeriod} - Founder Briefing (${update.generatedAt})\n\n## Executive Summary\n${update.founderBriefing.executiveSummary}\n\n## Key Wins\n${update.founderBriefing.keyWins.map(w => `- ${w}`).join('\n')}\n\n## Operational & Financial Risks\n${update.founderBriefing.topRisks.map(r => `- ${r}`).join('\n')}\n\n## Strategic Action Items\n${update.founderBriefing.strategicActionItems.map(a => `- ${a}`).join('\n')}`;
    } else if (activeTab === 'slides') {
      content = update.slideDeck.map(s => `--- ${s.title} ---\n${s.bullets.map(b => `* ${b}`).join('\n')}\nMetrics Summary: ${s.metricsText}`).join('\n\n');
    } else {
      content = update.emailDigest;
    }

    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    const text = `# Skylark Drones - ${update.quarterPeriod} (${update.generatedAt})\n\n## Executive Briefing\n${update.founderBriefing.executiveSummary}\n\n### Key Commercial Wins\n${update.founderBriefing.keyWins.map(w => `- ${w}`).join('\n')}\n\n### Operational Bottlenecks & Risks\n${update.founderBriefing.topRisks.map(r => `- ${r}`).join('\n')}\n\n### Action Plan\n${update.founderBriefing.strategicActionItems.map(a => `- ${a}`).join('\n')}\n\n---\n\n## 3-Slide Leadership Outline\n${update.slideDeck.map(s => `### ${s.title}\n${s.bullets.map(b => `- ${b}`).join('\n')}`).join('\n\n')}`;
    
    const blob = new Blob([text], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Skylark_Leadership_Update_${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-4xl max-h-[90vh] bg-dark-card border border-gray-800 rounded-2xl flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-gray-800 flex items-center justify-between bg-gray-900/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">Leadership Update Synthesizer</h3>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {update.quarterPeriod}
                </span>
              </div>
              <p className="text-xs text-gray-400">Generated for Founders, Executives & Board Members • {update.generatedAt}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center justify-between px-6 py-2.5 border-b border-gray-800 bg-gray-950/60">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('digest')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'digest'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              1-Page Founder Briefing
            </button>
            <button
              onClick={() => setActiveTab('slides')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'slides'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <Presentation className="w-3.5 h-3.5" />
              3-Slide Deck Outline
            </button>
            <button
              onClick={() => setActiveTab('email')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'email'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              Email Digest Format
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 flex items-center gap-1.5 transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Content'}</span>
            </button>
            <button
              onClick={handleDownloadMarkdown}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white flex items-center gap-1.5 shadow-md transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export .MD</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          {/* TAB 1: Founder Briefing */}
          {activeTab === 'digest' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-200 leading-relaxed font-sans">
                <span className="font-bold text-purple-300 block mb-1 uppercase tracking-wider text-[11px]">Executive Summary</span>
                {update.founderBriefing.executiveSummary}
              </div>

              <div>
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-400" />
                  Key Commercial Wins
                </h4>
                <ul className="space-y-1.5">
                  {update.founderBriefing.keyWins.map((w, i) => (
                    <li key={i} className="text-xs text-gray-300 bg-gray-900/60 p-2.5 rounded-lg border border-gray-800/80">
                      {w}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                  Execution & Financial Risks
                </h4>
                <ul className="space-y-1.5">
                  {update.founderBriefing.topRisks.map((r, i) => (
                    <li key={i} className="text-xs text-gray-300 bg-gray-900/60 p-2.5 rounded-lg border border-gray-800/80">
                      {r}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-bold text-brand-400 uppercase tracking-wider mb-2">
                  Strategic Action Items
                </h4>
                <ul className="space-y-1.5">
                  {update.founderBriefing.strategicActionItems.map((a, i) => (
                    <li key={i} className="text-xs text-gray-200 bg-brand-500/10 p-2.5 rounded-lg border border-brand-500/20 font-medium">
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* TAB 2: Slide Deck Cards */}
          {activeTab === 'slides' && (
            <div className="grid grid-cols-1 gap-4">
              {update.slideDeck.map((slide) => (
                <div key={slide.slideNumber} className="p-5 rounded-2xl bg-gray-900/80 border border-gray-800 shadow-lg space-y-3">
                  <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                    <h4 className="text-sm font-bold text-white">{slide.title}</h4>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gray-800 text-gray-400">
                      Slide {slide.slideNumber} of 3
                    </span>
                  </div>
                  <ul className="space-y-1.5 list-disc list-inside text-xs text-gray-300">
                    {slide.bullets.map((b, idx) => (
                      <li key={idx} className="leading-relaxed">{b}</li>
                    ))}
                  </ul>
                  <div className="mt-3 pt-2 border-t border-gray-800/60 text-xs font-semibold text-purple-400 font-mono">
                    {slide.metricsText}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: Email Digest */}
          {activeTab === 'email' && (
            <div className="p-4 rounded-xl bg-gray-900 font-mono text-xs text-gray-200 border border-gray-800 whitespace-pre-wrap leading-relaxed select-all">
              {update.emailDigest}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

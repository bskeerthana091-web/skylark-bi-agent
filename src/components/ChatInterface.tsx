import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, TrendingUp, TrendingDown, AlertTriangle, ArrowRight, HelpCircle } from 'lucide-react';
import { ChatMessage } from '../types';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  isThinking: boolean;
  onOpenLeadership: () => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  onSendMessage,
  isThinking,
  onOpenLeadership
}) => {
  const [inputText, setInputText] = useState('');
  const latestMessageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    latestMessageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [messages, isThinking]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isThinking) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  /**
   * Helper to parse bold markdown syntax **text** into <strong> elements
   */
  const parseInlineBold = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-bold text-white">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  /**
   * Render rich formatted text (converting ### headers and bullet points)
   */
  const renderFormattedText = (content: string) => {
    const lines = content.split('\n');
    return (
      <div className="space-y-1.5 font-sans">
        {lines.map((line, idx) => {
          if (!line.trim()) return <div key={idx} className="h-1" />;
          
          if (line.startsWith('### ')) {
            return (
              <h3 key={idx} className="text-sm font-bold text-brand-300 flex items-center gap-1.5 mt-2 mb-1">
                {line.replace('### ', '')}
              </h3>
            );
          }

          if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
            const cleanLine = line.trim().replace(/^[*|-]\s+/, '');
            return (
              <div key={idx} className="flex items-start gap-2 text-xs text-gray-200 my-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-400 shrink-0 mt-1.5"></span>
                <span className="leading-relaxed">{parseInlineBold(cleanLine)}</span>
              </div>
            );
          }

          return <p key={idx} className="text-xs text-gray-200 leading-relaxed">{parseInlineBold(line)}</p>;
        })}
      </div>
    );
  };

  return (
    <div className="flex-1 p-3 flex flex-col h-[calc(100vh-6rem)]">
      {/* Floating AI Window Frame */}
      <div className="floating-window flex-1 flex flex-col overflow-hidden relative">
        {/* Floating Window Title Bar */}
        <div className="window-titlebar px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center shadow-md">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-xs text-white">Conversational BI Window</h3>
              <p className="text-[10px] text-gray-400">Monday.com Deals & Work Orders Assistant</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-500/10 text-brand-300 border border-brand-500/20">
              Active Session
            </span>
          </div>
        </div>

        {/* Messages Feed Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {messages.map((msg, index) => {
            const isLatest = index === messages.length - 1;
            return (
              <div
                key={msg.id}
                ref={isLatest ? latestMessageRef : null}
                className={`flex gap-3 md:gap-4 max-w-4xl mx-auto ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.sender === 'agent' && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center shrink-0 shadow-md shadow-brand-500/20 mt-1">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}

                {/* Message Glass Bubble */}
                <div
                  className={`rounded-2xl p-4 md:p-5 max-w-[88%] md:max-w-[82%] ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white rounded-tr-none shadow-lg shadow-brand-600/20 border border-brand-400/20'
                      : 'bg-gray-900/90 border border-gray-800 text-gray-100 rounded-tl-none backdrop-blur-md shadow-xl'
                  }`}
                >
                  {/* Header info */}
                  <div className="flex items-center justify-between gap-4 mb-2 pb-2 border-b border-gray-800/50 text-[11px] text-gray-400">
                    <span className="font-semibold flex items-center gap-1.5">
                      {msg.sender === 'user' ? 'Founder / Executive' : 'Skylark BI Agent'}
                      {msg.intent && (
                        <span className="px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30">
                          {msg.intent}
                        </span>
                      )}
                    </span>
                    <span>{msg.timestamp}</span>
                  </div>

                  {/* Formatted Text Output */}
                  <div>
                    {renderFormattedText(msg.text)}
                  </div>

                  {/* Floating Metric Cards */}
                  {msg.metrics && msg.metrics.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 my-4">
                      {msg.metrics.map((metric, idx) => (
                        <div key={idx} className="p-3.5 rounded-xl bg-gray-950/80 border border-gray-800 flex flex-col justify-between shadow-inner">
                          <span className="text-[11px] text-gray-400 font-medium">{metric.label}</span>
                          <div className="flex items-baseline gap-2 my-1">
                            <span className="text-lg font-extrabold text-white tracking-tight">{metric.value}</span>
                            {metric.trend === 'up' && <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />}
                            {metric.trend === 'down' && <TrendingDown className="w-3.5 h-3.5 text-rose-400" />}
                          </div>
                          {metric.subtext && <span className="text-[10px] text-gray-400 font-mono">{metric.subtext}</span>}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Floating Visualization Chart */}
                  {msg.chartData && (
                    <div className="my-4 p-4 rounded-xl bg-gray-950/90 border border-gray-800 shadow-md">
                      <h4 className="text-xs font-bold text-gray-300 mb-3 flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-brand-400" />
                        {msg.chartData.title}
                      </h4>
                      <div className="h-60 w-full flex flex-col items-center justify-between">
                        {msg.chartData.type === 'bar' && (
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={msg.chartData.data} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                              <XAxis dataKey="name" stroke="#9CA3AF" fontSize={11} />
                              <YAxis stroke="#9CA3AF" fontSize={11} />
                              <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px', color: '#FFF' }} />
                              <Bar dataKey="value" fill="#3B82F6" radius={[6, 6, 0, 0]} name="Won / Primary" />
                              {msg.chartData.data[0]?.secondary !== undefined && (
                                <Bar dataKey="secondary" fill="#8B5CF6" radius={[6, 6, 0, 0]} name="Open / Secondary" />
                              )}
                            </BarChart>
                          </ResponsiveContainer>
                        )}
                        {msg.chartData.type === 'pie' && (
                          <div className="w-full h-full flex flex-col items-center justify-between">
                            <div className="h-44 w-full">
                              <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                  <Pie
                                    data={msg.chartData.data}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={35}
                                    outerRadius={65}
                                    paddingAngle={4}
                                  >
                                    {msg.chartData.data.map((entry, index) => (
                                      <Cell key={`cell-${index}`} fill={entry.color || ['#34D399', '#38BDF8', '#F87171', '#FBBF24'][index % 4]} />
                                    ))}
                                  </Pie>
                                  <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px', color: '#FFF' }} />
                                </PieChart>
                              </ResponsiveContainer>
                            </div>
                            {/* Highlighted Badges Legend */}
                            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                              {msg.chartData.data.map((item, i) => (
                                <div key={i} className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gray-900 border border-gray-800 shadow-sm">
                                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color || '#38BDF8' }}></span>
                                  <span className="text-xs font-bold text-gray-200">{item.name}:</span>
                                  <span className="text-xs font-extrabold" style={{ color: item.color || '#38BDF8' }}>{item.value}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Table */}
                  {msg.tableData && (
                    <div className="my-4 overflow-x-auto rounded-xl border border-gray-800 bg-gray-950/60">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-gray-900 text-gray-400 font-semibold border-b border-gray-800">
                          <tr>
                            {msg.tableData.headers.map((h, i) => (
                              <th key={i} className="px-3 py-2">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800/60 font-mono">
                          {msg.tableData.rows.map((row, rIdx) => (
                            <tr key={rIdx} className="hover:bg-gray-900/60">
                              {row.map((cell, cIdx) => (
                                <td key={cIdx} className="px-3 py-2 text-gray-300">{cell}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Leadership Update Snippet Button */}
                  {msg.leadershipUpdateSnippet && (
                    <div className="my-3 p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-purple-300">{msg.leadershipUpdateSnippet.title}</span>
                        <p className="text-xs text-gray-300">{msg.leadershipUpdateSnippet.summary}</p>
                      </div>
                      <button
                        onClick={onOpenLeadership}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white flex items-center gap-1.5 shadow-md transition-all"
                      >
                        <span>Open Briefing</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* Caveats */}
                  {msg.caveats && msg.caveats.length > 0 && (
                    <div className="mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300 flex items-start gap-2">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">Data Quality Caveats:</span>
                        <ul className="list-disc list-inside mt-0.5 space-y-0.5">
                          {msg.caveats.map((c, i) => (
                            <li key={i}>{c}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* Clarifying Questions Buttons */}
                  {msg.clarifyingQuestions && msg.clarifyingQuestions.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-gray-800/80">
                      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                        <HelpCircle className="w-3.5 h-3.5 text-brand-400" />
                        Suggested Next Steps & Clarifications:
                      </span>
                      <div className="flex flex-col gap-1.5">
                        {msg.clarifyingQuestions.map((cq, i) => (
                          <button
                            key={i}
                            onClick={() => onSendMessage(cq)}
                            className="text-left text-xs font-medium px-3.5 py-2 rounded-xl bg-gray-950/80 hover:bg-brand-600/20 hover:text-brand-300 text-gray-300 border border-gray-800 hover:border-brand-500/40 transition-all flex items-center justify-between group shadow-xs"
                          >
                            <span>{cq}</span>
                            <ArrowRight className="w-3.5 h-3.5 text-gray-500 group-hover:text-brand-400 transition-transform group-hover:translate-x-0.5" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {msg.sender === 'user' && (
                  <div className="w-8 h-8 rounded-xl bg-gray-800 border border-gray-700 flex items-center justify-center shrink-0 shadow-md mt-1">
                    <User className="w-4 h-4 text-gray-300" />
                  </div>
                )}
              </div>
            );
          })}

          {isThinking && (
            <div className="flex gap-3 max-w-4xl mx-auto items-center">
              <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center shadow-md animate-pulse">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="p-3 rounded-2xl bg-gray-900 border border-gray-800 text-xs text-gray-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-brand-400 animate-ping"></span>
                Analyzing monday.com Deals & Work Orders boards...
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 md:p-4 border-t border-gray-800/80 bg-gray-950/80 backdrop-blur-md">
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask executive business query (e.g. 'How is pipeline looking for energy sector this quarter?')..."
              className="flex-1 bg-gray-900/90 border border-gray-800 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all font-sans"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isThinking}
              className="bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-5 py-3 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-brand-600/25"
            >
              <span>Send</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

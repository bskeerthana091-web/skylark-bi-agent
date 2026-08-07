import React, { useState } from 'react';
import { CleanDeal, CleanWorkOrder } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { DollarSign, TrendingUp, AlertCircle, Layers, Search } from 'lucide-react';

interface AnalyticsDashboardProps {
  deals: CleanDeal[];
  workOrders: CleanWorkOrder[];
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ deals, workOrders }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'deals' | 'workOrders'>('overview');
  const [searchTerm, setSearchTerm] = useState('');

  const openDeals = deals.filter(d => d.status === 'Open');
  const wonDeals = deals.filter(d => d.status === 'Won');
  const openValue = openDeals.reduce((sum, d) => sum + d.dealValue, 0);
  const wonValue = wonDeals.reduce((sum, d) => sum + d.dealValue, 0);

  const totalUnbilled = workOrders.reduce((sum, w) => sum + w.amountToBeBilledExclGst, 0);
  const totalReceivable = workOrders.reduce((sum, w) => sum + w.amountReceivable, 0);

  // Sector stats
  const sectorMap: { [sec: string]: number } = {};
  deals.forEach(d => {
    sectorMap[d.sector] = (sectorMap[d.sector] || 0) + d.dealValue;
  });
  const sectorData = Object.keys(sectorMap).map(s => ({
    name: s,
    value: Math.round(sectorMap[s] / 100000)
  })).sort((a, b) => b.value - a.value);

  // Filtered tables
  const filteredDeals = deals.filter(d =>
    d.dealName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.sector.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.ownerCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.clientCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.dealStage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredWorkOrders = workOrders.filter(w =>
    w.dealName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.sector.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.serialNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.customerCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.executionStatus.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pieChartData = [
    { name: 'Completed', value: workOrders.filter(w => w.executionStatus === 'Completed').length, color: '#10B981' },
    { name: 'Ongoing Operations', value: workOrders.filter(w => w.executionStatus === 'Ongoing').length, color: '#0EA5E9' },
    { name: 'Paused / Struck', value: workOrders.filter(w => w.executionStatus === 'Pause / struck').length, color: '#F43F5E' },
    { name: 'Not Started', value: workOrders.filter(w => w.executionStatus === 'Not Started').length, color: '#F59E0B' }
  ];

  return (
    <div className="w-full max-w-full space-y-4 md:space-y-6 p-2 md:p-4 font-sans">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <div className="floating-window p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-400">Closed Won Revenue</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <span className="text-xl md:text-2xl font-extrabold text-white">₹{(wonValue / 10000000).toFixed(2)} Cr</span>
          <span className="text-[11px] text-emerald-400 block mt-1">{wonDeals.length} won contracts</span>
        </div>

        <div className="floating-window p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-400">Open Sales Pipeline</span>
            <div className="p-1.5 rounded-lg bg-brand-500/10 text-brand-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <span className="text-xl md:text-2xl font-extrabold text-white">₹{(openValue / 10000000).toFixed(2)} Cr</span>
          <span className="text-[11px] text-brand-400 block mt-1">{openDeals.length} open opportunities</span>
        </div>

        <div className="floating-window p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-400">Unbilled Contract Value</span>
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <span className="text-xl md:text-2xl font-extrabold text-white">₹{(totalUnbilled / 10000000).toFixed(2)} Cr</span>
          <span className="text-[11px] text-amber-400 block mt-1">Pending invoice issuance</span>
        </div>

        <div className="floating-window p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-400">Total Receivables</span>
            <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <span className="text-xl md:text-2xl font-extrabold text-white">₹{(totalReceivable / 10000000).toFixed(2)} Cr</span>
          <span className="text-[11px] text-purple-400 block mt-1">Outstanding collections</span>
        </div>
      </div>

      {/* Tabs & Search Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-gray-800 pb-3">
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 sm:flex-none px-3 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'overview' ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-md' : 'text-gray-400 hover:text-white bg-gray-900/80 border border-gray-800'
            }`}
          >
            Overview Visualizations
          </button>
          <button
            onClick={() => setActiveTab('deals')}
            className={`flex-1 sm:flex-none px-3 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'deals' ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-md' : 'text-gray-400 hover:text-white bg-gray-900/80 border border-gray-800'
            }`}
          >
            Deals Board ({filteredDeals.length})
          </button>
          <button
            onClick={() => setActiveTab('workOrders')}
            className={`flex-1 sm:flex-none px-3 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'workOrders' ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-md' : 'text-gray-400 hover:text-white bg-gray-900/80 border border-gray-800'
            }`}
          >
            Work Orders Board ({filteredWorkOrders.length})
          </button>
        </div>

        {activeTab !== 'overview' && (
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by deal, sector, client, stage..."
              className="w-full bg-gray-900/90 border border-gray-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-500"
            />
          </div>
        )}
      </div>

      {/* TAB CONTENT: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="floating-window p-4 md:p-5 space-y-3">
            <h4 className="text-xs md:text-sm font-bold text-white">Sector Revenue Distribution (₹ Lakhs)</h4>
            <div className="h-60 md:h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sectorData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                  <XAxis dataKey="name" stroke="#9CA3AF" fontSize={10} />
                  <YAxis stroke="#9CA3AF" fontSize={10} />
                  <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px', color: '#FFF' }} />
                  <Bar dataKey="value" fill="#3B82F6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="floating-window p-4 md:p-5 space-y-3">
            <h4 className="text-xs md:text-sm font-bold text-white">Work Order Execution Status</h4>
            <div className="h-60 md:h-64 w-full flex flex-col items-center justify-between">
              <div className="h-44 md:h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={35}
                      outerRadius={70}
                      paddingAngle={4}
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px', color: '#FFF' }}
                      formatter={(val: any, name: any) => [`${val} Work Orders`, name]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* High-Contrast Badges */}
              <div className="flex flex-wrap items-center justify-center gap-1.5 pt-2">
                {pieChartData.map((item, i) => (
                  <div key={i} className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-xl bg-gray-900 border border-gray-800 shadow-sm">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></span>
                    <span className="text-[10px] md:text-xs font-bold text-gray-200">{item.name}:</span>
                    <span className="text-[10px] md:text-xs font-extrabold" style={{ color: item.color }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Deals Table */}
      {activeTab === 'deals' && (
        <div className="floating-window flex flex-col w-full max-w-full overflow-hidden">
          <div className="p-3 border-b border-gray-800 bg-gray-950/60 flex items-center justify-between text-xs text-gray-400 font-mono">
            <span>Showing all {filteredDeals.length} records</span>
            <span className="text-[10px] md:text-[11px] text-brand-400">Swipe to inspect all records</span>
          </div>

          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-xs text-left relative border-collapse min-w-[600px]">
              <thead className="bg-gray-900/95 text-gray-300 font-semibold border-b border-gray-800 sticky top-0 backdrop-blur-md z-10">
                <tr>
                  <th className="px-3.5 py-2.5 bg-gray-900/95">Deal Name</th>
                  <th className="px-3.5 py-2.5 bg-gray-900/95">Client Code</th>
                  <th className="px-3.5 py-2.5 bg-gray-900/95">Status</th>
                  <th className="px-3.5 py-2.5 bg-gray-900/95">Sector</th>
                  <th className="px-3.5 py-2.5 bg-gray-900/95">Stage</th>
                  <th className="px-3.5 py-2.5 bg-gray-900/95 text-right">Deal Value (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60 font-mono">
                {filteredDeals.map((d) => (
                  <tr key={d.id} className="hover:bg-brand-500/10 even:bg-gray-900/40 odd:bg-gray-950/40 transition-colors">
                    <td className="px-3.5 py-2 font-bold text-white whitespace-nowrap">{d.dealName}</td>
                    <td className="px-3.5 py-2 text-gray-400 whitespace-nowrap">{d.clientCode}</td>
                    <td className="px-3.5 py-2 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase inline-flex items-center gap-1 ${
                        d.status === 'Won' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        d.status === 'Open' ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          d.status === 'Won' ? 'bg-emerald-400' : d.status === 'Open' ? 'bg-sky-400' : 'bg-rose-400'
                        }`}></span>
                        <span>{d.status}</span>
                      </span>
                    </td>
                    <td className="px-3.5 py-2 text-gray-300 whitespace-nowrap">{d.sector}</td>
                    <td className="px-3.5 py-2 text-gray-400 whitespace-nowrap">{d.dealStage}</td>
                    <td className="px-3.5 py-2 text-right font-bold text-emerald-400 whitespace-nowrap">
                      ₹{d.dealValue.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Work Orders Table */}
      {activeTab === 'workOrders' && (
        <div className="floating-window flex flex-col w-full max-w-full overflow-hidden">
          <div className="p-3 border-b border-gray-800 bg-gray-950/60 flex items-center justify-between text-xs text-gray-400 font-mono">
            <span>Showing all {filteredWorkOrders.length} work order records</span>
            <span className="text-[10px] md:text-[11px] text-brand-400">Swipe to inspect all records</span>
          </div>

          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-xs text-left relative border-collapse min-w-[650px]">
              <thead className="bg-gray-900/95 text-gray-300 font-semibold border-b border-gray-800 sticky top-0 backdrop-blur-md z-10">
                <tr>
                  <th className="px-3.5 py-2.5 bg-gray-900/95">WO Serial</th>
                  <th className="px-3.5 py-2.5 bg-gray-900/95">Deal Name</th>
                  <th className="px-3.5 py-2.5 bg-gray-900/95">Execution Status</th>
                  <th className="px-3.5 py-2.5 bg-gray-900/95">Sector</th>
                  <th className="px-3.5 py-2.5 bg-gray-900/95 text-right">Unbilled Amount (₹)</th>
                  <th className="px-3.5 py-2.5 bg-gray-900/95 text-right">Receivable (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60 font-mono">
                {filteredWorkOrders.map((w) => (
                  <tr key={w.id} className="hover:bg-brand-500/10 even:bg-gray-900/40 odd:bg-gray-950/40 transition-colors">
                    <td className="px-3.5 py-2 font-bold text-brand-400 whitespace-nowrap">{w.serialNo}</td>
                    <td className="px-3.5 py-2 font-bold text-white whitespace-nowrap">{w.dealName}</td>
                    <td className="px-3.5 py-2 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase inline-flex items-center gap-1 ${
                        w.executionStatus === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        w.executionStatus === 'Ongoing' ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20' :
                        w.executionStatus === 'Pause / struck' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                        'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          w.executionStatus === 'Completed' ? 'bg-emerald-400' :
                          w.executionStatus === 'Ongoing' ? 'bg-sky-400 animate-ping' :
                          w.executionStatus === 'Pause / struck' ? 'bg-rose-400' : 'bg-amber-400'
                        }`}></span>
                        <span>{w.executionStatus}</span>
                      </span>
                    </td>
                    <td className="px-3.5 py-2 text-gray-300 whitespace-nowrap">{w.sector}</td>
                    <td className="px-3.5 py-2 text-right font-bold text-amber-400 whitespace-nowrap">
                      ₹{w.amountToBeBilledExclGst.toLocaleString('en-IN')}
                    </td>
                    <td className="px-3.5 py-2 text-right font-bold text-purple-400 whitespace-nowrap">
                      ₹{w.amountReceivable.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

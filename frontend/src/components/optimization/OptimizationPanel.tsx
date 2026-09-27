import React, { useState } from 'react';
import { OptimizationResult } from '@/types';
import { RecommendationCard } from '@/components/dashboard/RecommendationCard';
import { 
  Cpu, 
  Play, 
  CheckCircle2, 
  AlertCircle, 
  TrendingDown, 
  Layers, 
  ShieldCheck, 
  Calendar,
  Sliders,
  Zap,
  Sparkles,
  Percent,
  IndianRupee,
  Download
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';
import clsx from 'clsx';

interface OptimizationPanelProps {
  currentResult: OptimizationResult | null;
  onRunOptimization: (params: any) => Promise<void>;
  isLoading: boolean;
}

export const OptimizationPanel: React.FC<OptimizationPanelProps> = ({
  currentResult,
  onRunOptimization,
  isLoading
}) => {
  const [horizonHours, setHorizonHours] = useState<number>(24);
  const [initialSoc, setInitialSoc] = useState<number>(65);
  const [gridLimit, setGridLimit] = useState<number>(500);
  const [loadFlex, setLoadFlex] = useState<number>(15);

  const handleRun = () => {
    onRunOptimization({
      horizon_hours: horizonHours,
      initial_soc_pct: initialSoc,
      grid_limit_kw: gridLimit,
      load_flexibility_pct: loadFlex
    });
  };

  const handleExportCSV = () => {
    if (!currentResult) return;
    const headers = ['Time', 'Solar (kW)', 'Demand (kW)', 'Grid Import (kW)', 'BESS Charge (kW)', 'BESS Discharge (kW)', 'SOC (%)', 'Tariff (₹)', 'Cost (₹)'];
    const rows = currentResult.schedule.map(s => [
      s.time,
      s.renewable_gen,
      s.load_demand,
      s.grid_import,
      s.battery_charge,
      s.battery_discharge,
      s.battery_soc,
      s.tariff,
      s.cost
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `energiq_dispatch_schedule_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Parameter Controls & Trigger Card */}
      <div className="bg-slate-900/80 light:bg-white rounded-2xl border border-slate-800/90 light:border-slate-200 p-6 shadow-2xl shadow-black/30 backdrop-blur-2xl relative overflow-hidden transition-colors">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-500" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-sm">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-base font-extrabold text-white light:text-slate-900 tracking-tight">
                    Mixed-Integer Linear Programming (MILP) Optimizer
                  </h2>
                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 uppercase">
                    PuLP CBC Engine
                  </span>
                </div>
                <p className="text-xs text-slate-400 light:text-slate-500 mt-1">
                  Multi-objective mathematical dispatch minimizing tariffs, demand charges, BESS degradation, and load disruption
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={handleRun}
            disabled={isLoading}
            className="flex items-center justify-center gap-2.5 px-6 py-2.5 bg-gradient-to-r from-cyan-500 via-sky-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 disabled:from-slate-700 disabled:to-slate-800 text-white text-xs font-extrabold rounded-xl shadow-lg shadow-cyan-500/25 transition-all cursor-pointer shrink-0 hover:scale-102"
          >
            <Play className={`w-4 h-4 fill-white ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'Solving MILP Constraints...' : 'Solve Optimal Dispatch'}</span>
          </button>
        </div>

        {/* Inputs Slider Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4.5 bg-slate-950/60 light:bg-slate-50 rounded-xl border border-slate-800/80 light:border-slate-200 text-xs">
          <div>
            <div className="flex justify-between mb-1.5 font-mono">
              <span className="text-slate-400 light:text-slate-600 font-sans text-xs font-semibold">Forecast Horizon</span>
              <strong className="text-cyan-400 light:text-cyan-700 font-bold">{horizonHours} Hours</strong>
            </div>
            <input
              type="range"
              min="6"
              max="48"
              step="6"
              value={horizonHours}
              onChange={(e) => setHorizonHours(Number(e.target.value))}
              className="w-full accent-cyan-500"
            />
          </div>

          <div>
            <div className="flex justify-between mb-1.5 font-mono">
              <span className="text-slate-400 light:text-slate-600 font-sans text-xs font-semibold">Initial BESS SOC</span>
              <strong className="text-indigo-400 light:text-indigo-700 font-bold">{initialSoc}%</strong>
            </div>
            <input
              type="range"
              min="20"
              max="90"
              step="5"
              value={initialSoc}
              onChange={(e) => setInitialSoc(Number(e.target.value))}
              className="w-full accent-indigo-500"
            />
          </div>

          <div>
            <div className="flex justify-between mb-1.5 font-mono">
              <span className="text-slate-400 light:text-slate-600 font-sans text-xs font-semibold">Grid Import Ceiling</span>
              <strong className="text-amber-400 light:text-amber-700 font-bold">{gridLimit} kW</strong>
            </div>
            <input
              type="range"
              min="300"
              max="650"
              step="25"
              value={gridLimit}
              onChange={(e) => setGridLimit(Number(e.target.value))}
              className="w-full accent-amber-500"
            />
          </div>

          <div>
            <div className="flex justify-between mb-1.5 font-mono">
              <span className="text-slate-400 light:text-slate-600 font-sans text-xs font-semibold">Load Flexibility</span>
              <strong className="text-emerald-400 light:text-emerald-700 font-bold">±{loadFlex}%</strong>
            </div>
            <input
              type="range"
              min="0"
              max="30"
              step="5"
              value={loadFlex}
              onChange={(e) => setLoadFlex(Number(e.target.value))}
              className="w-full accent-emerald-500"
            />
          </div>
        </div>
      </div>

      {currentResult && (
        <>
          {/* Solution KPI Summary Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
            <div className="bg-slate-900/80 light:bg-white p-4 rounded-xl border border-slate-800/90 light:border-slate-200 shadow-xl">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Solver Status</span>
              <span className="text-base font-extrabold text-emerald-400 light:text-emerald-600 flex items-center gap-1.5 mt-1 font-mono">
                <CheckCircle2 className="w-4 h-4" />
                {currentResult.status}
              </span>
              <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">Time: {currentResult.solve_time_ms} ms</span>
            </div>

            <div className="bg-slate-900/80 light:bg-white p-4 rounded-xl border border-slate-800/90 light:border-slate-200 shadow-xl">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Estimated Savings</span>
              <span className="text-base font-extrabold text-emerald-400 light:text-emerald-600 mt-1 block font-mono tabular-nums">
                ₹{currentResult.summary.cost_savings.toLocaleString()}
              </span>
              <span className="text-[10px] font-semibold text-emerald-500 light:text-emerald-700">
                {currentResult.summary.cost_savings_pct}% vs. baseline
              </span>
            </div>

            <div className="bg-slate-900/80 light:bg-white p-4 rounded-xl border border-slate-800/90 light:border-slate-200 shadow-xl">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Peak Grid Demand</span>
              <span className="text-base font-extrabold text-cyan-400 light:text-cyan-700 mt-1 block font-mono tabular-nums">
                {currentResult.summary.peak_demand_kw} kW
              </span>
              <span className="text-[10px] text-slate-400">
                Shaved: {currentResult.summary.peak_reduction_kw} kW
              </span>
            </div>

            <div className="bg-slate-900/80 light:bg-white p-4 rounded-xl border border-slate-800/90 light:border-slate-200 shadow-xl">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Renewable Utilization</span>
              <span className="text-base font-extrabold text-white light:text-slate-900 mt-1 block font-mono">
                {currentResult.summary.renewable_utilized_pct}%
              </span>
              <span className="text-[10px] text-slate-400">
                Curtailment: {currentResult.summary.curtailed_energy_kwh} kWh
              </span>
            </div>

            <div className="bg-slate-900/80 light:bg-white p-4 rounded-xl border border-slate-800/90 light:border-slate-200 shadow-xl">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Production Target</span>
              <span className="text-base font-extrabold text-emerald-400 light:text-emerald-700 mt-1 block font-mono">
                {currentResult.summary.production_feasibility}
              </span>
              <span className="text-[10px] text-slate-400">100% Critical Loads Met</span>
            </div>
          </div>

          {/* Explainable Recommendation Card */}
          <RecommendationCard data={currentResult.explanation} />

          {/* Schedule Visualization Chart */}
          <div className="bg-slate-900/80 light:bg-white rounded-2xl border border-slate-800/90 light:border-slate-200 p-6 shadow-2xl backdrop-blur-2xl transition-colors">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-extrabold text-white light:text-slate-900 tracking-tight">
                Optimal Multi-Period Energy Dispatch Schedule
              </h3>
              <span className="text-xs font-mono font-normal text-slate-400">Values in kW per interval</span>
            </div>

            <div className="h-76 w-full p-2 bg-slate-950/40 light:bg-slate-50/50 rounded-xl border border-slate-800/50 light:border-slate-200/50">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={currentResult.schedule} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} vertical={false} />
                  <XAxis dataKey="time" stroke="#64748b" fontSize={10} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={10} tickLine={false} unit=" kW" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderRadius: '10px',
                      borderColor: '#334155',
                      color: '#f8fafc',
                      fontSize: '11px',
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)'
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />

                  {/* Solar Gen */}
                  <Area
                    type="monotone"
                    dataKey="renewable_gen"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.2}
                    name="Solar PV (kW)"
                  />

                  {/* Grid Import */}
                  <Bar
                    dataKey="grid_import"
                    fill="#f59e0b"
                    radius={[3, 3, 0, 0]}
                    name="Grid Import (kW)"
                  />

                  {/* Battery Discharge */}
                  <Bar
                    dataKey="battery_discharge"
                    fill="#818cf8"
                    radius={[3, 3, 0, 0]}
                    name="BESS Discharge (kW)"
                  />

                  {/* Load Demand */}
                  <Line
                    type="monotone"
                    dataKey="load_demand"
                    stroke="#38bdf8"
                    strokeWidth={2.5}
                    dot={false}
                    name="Industrial Demand (kW)"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Schedule Data Table */}
          <div className="bg-slate-900/80 light:bg-white rounded-2xl border border-slate-800/90 light:border-slate-200 p-6 shadow-2xl backdrop-blur-2xl overflow-hidden transition-colors">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-extrabold text-white light:text-slate-900 tracking-tight">
                Detailed Numerical Dispatch Matrix
              </h3>
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 light:bg-slate-100 light:hover:bg-slate-200 text-slate-200 light:text-slate-700 border border-slate-700 light:border-slate-200 text-xs font-bold rounded-xl transition-all cursor-pointer font-mono"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            </div>
            <div className="overflow-x-auto rounded-xl border border-slate-800/80 light:border-slate-200">
              <table className="w-full text-xs text-left font-mono">
                <thead className="bg-slate-950/80 light:bg-slate-100 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800 light:border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Time</th>
                    <th className="py-2.5 px-3">Solar (kW)</th>
                    <th className="py-2.5 px-3">Demand (kW)</th>
                    <th className="py-2.5 px-3">Grid Imp (kW)</th>
                    <th className="py-2.5 px-3">BESS Chg (kW)</th>
                    <th className="py-2.5 px-3">BESS Dis (kW)</th>
                    <th className="py-2.5 px-3">SOC (%)</th>
                    <th className="py-2.5 px-3">Tariff (₹)</th>
                    <th className="py-2.5 px-3">Cost (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 light:divide-slate-200">
                  {currentResult.schedule.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/40 light:hover:bg-slate-50 transition-colors">
                      <td className="py-2 px-3 font-semibold text-slate-200 light:text-slate-800">{item.time}</td>
                      <td className="py-2 px-3 text-emerald-400 light:text-emerald-600">{item.renewable_gen}</td>
                      <td className="py-2 px-3 text-slate-100 light:text-slate-900">{item.load_demand}</td>
                      <td className="py-2 px-3 text-amber-400 light:text-amber-600">{item.grid_import}</td>
                      <td className="py-2 px-3 text-indigo-400 light:text-indigo-600">{item.battery_charge}</td>
                      <td className="py-2 px-3 text-sky-400 light:text-sky-600">{item.battery_discharge}</td>
                      <td className="py-2 px-3 text-slate-300 light:text-slate-700">{item.battery_soc}%</td>
                      <td className="py-2 px-3 text-slate-400">₹{item.tariff.toFixed(2)}</td>
                      <td className="py-2 px-3 font-semibold text-slate-100 light:text-slate-900">₹{item.cost.toFixed(0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

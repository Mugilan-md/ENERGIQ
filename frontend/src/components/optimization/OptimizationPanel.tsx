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
  Sliders
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

  return (
    <div className="space-y-6">
      {/* Parameter Controls & Trigger Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Mixed-Integer Linear Programming (MILP) Energy Optimizer
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-100 text-sky-800 border border-sky-200">
                PuLP CBC Solver
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Multi-objective optimization minimizing operational cost, grid peak penalty, degradation, and curtailment
            </p>
          </div>

          <button
            onClick={handleRun}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-700 disabled:bg-slate-300 text-white text-xs font-bold rounded-xl shadow-sm shadow-sky-600/20 transition-all cursor-pointer shrink-0"
          >
            <Play className={`w-4 h-4 fill-white ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'Solving MILP Matrix...' : 'Solve Optimal Dispatch'}</span>
          </button>
        </div>

        {/* Inputs Slider Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-slate-50/80 rounded-xl border border-slate-200/70 text-xs">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-slate-500 font-medium">Optimization Horizon</span>
              <strong className="text-slate-900 font-mono">{horizonHours} Hours</strong>
            </div>
            <input
              type="range"
              min="6"
              max="48"
              step="6"
              value={horizonHours}
              onChange={(e) => setHorizonHours(Number(e.target.value))}
              className="w-full accent-sky-600"
            />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span className="text-slate-500 font-medium">Initial Battery SOC</span>
              <strong className="text-slate-900 font-mono">{initialSoc}%</strong>
            </div>
            <input
              type="range"
              min="20"
              max="90"
              step="5"
              value={initialSoc}
              onChange={(e) => setInitialSoc(Number(e.target.value))}
              className="w-full accent-sky-600"
            />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span className="text-slate-500 font-medium">Grid Import Cap</span>
              <strong className="text-slate-900 font-mono">{gridLimit} kW</strong>
            </div>
            <input
              type="range"
              min="300"
              max="650"
              step="25"
              value={gridLimit}
              onChange={(e) => setGridLimit(Number(e.target.value))}
              className="w-full accent-sky-600"
            />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span className="text-slate-500 font-medium">Allowed Load Flexibility</span>
              <strong className="text-slate-900 font-mono">±{loadFlex}%</strong>
            </div>
            <input
              type="range"
              min="0"
              max="30"
              step="5"
              value={loadFlex}
              onChange={(e) => setLoadFlex(Number(e.target.value))}
              className="w-full accent-sky-600"
            />
          </div>
        </div>
      </div>

      {currentResult && (
        <>
          {/* Solution KPI Summary Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Solver Status</span>
              <span className="text-base font-extrabold text-emerald-600 flex items-center gap-1.5 mt-1 font-mono">
                <CheckCircle2 className="w-4 h-4" />
                {currentResult.status}
              </span>
              <span className="text-[10px] text-slate-400">Time: {currentResult.solve_time_ms} ms</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Estimated Savings</span>
              <span className="text-base font-extrabold text-emerald-600 mt-1 block font-mono">
                ₹{currentResult.summary.cost_savings.toLocaleString()}
              </span>
              <span className="text-[10px] font-semibold text-emerald-700">
                {currentResult.summary.cost_savings_pct}% vs. uncoordinated
              </span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Peak Grid Demand</span>
              <span className="text-base font-extrabold text-sky-700 mt-1 block font-mono">
                {currentResult.summary.peak_demand_kw} kW
              </span>
              <span className="text-[10px] text-slate-500">
                Shaved: {currentResult.summary.peak_reduction_kw} kW
              </span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Renewable Utilized</span>
              <span className="text-base font-extrabold text-slate-900 mt-1 block font-mono">
                {currentResult.summary.renewable_utilized_pct}%
              </span>
              <span className="text-[10px] text-slate-500">
                Curtailment: {currentResult.summary.curtailed_energy_kwh} kWh
              </span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Production Target</span>
              <span className="text-base font-extrabold text-emerald-700 mt-1 block font-mono">
                {currentResult.summary.production_feasibility}
              </span>
              <span className="text-[10px] text-slate-500">100% Critical Loads Met</span>
            </div>
          </div>

          {/* Explainable Recommendation Card */}
          <RecommendationCard data={currentResult.explanation} />

          {/* Schedule Visualization Chart */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900 tracking-tight mb-4 flex items-center justify-between">
              <span>Optimal Multi-Period Energy Dispatch Schedule</span>
              <span className="text-xs font-normal text-slate-400">Values in kW per interval</span>
            </h3>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={currentResult.schedule} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="time" stroke="#94a3b8" fontSize={10} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} unit=" kW" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderRadius: '8px',
                      borderColor: '#cbd5e1',
                      fontSize: '11px'
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />

                  {/* Solar Gen */}
                  <Area
                    type="monotone"
                    dataKey="renewable_gen"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.15}
                    name="Solar PV (kW)"
                  />

                  {/* Grid Import */}
                  <Bar
                    dataKey="grid_import"
                    fill="#f59e0b"
                    radius={[2, 2, 0, 0]}
                    name="Grid Import (kW)"
                  />

                  {/* Battery Discharge */}
                  <Bar
                    dataKey="battery_discharge"
                    fill="#6366f1"
                    radius={[2, 2, 0, 0]}
                    name="BESS Discharge (kW)"
                  />

                  {/* Load Demand */}
                  <Line
                    type="monotone"
                    dataKey="load_demand"
                    stroke="#0f172a"
                    strokeWidth={2}
                    dot={false}
                    name="Industrial Demand (kW)"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Schedule Data Table */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs overflow-hidden">
            <h3 className="text-sm font-bold text-slate-900 tracking-tight mb-4">
              Detailed Numerical Dispatch Matrix
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left font-mono">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Time</th>
                    <th className="py-2.5 px-3">Solar (kW)</th>
                    <th className="py-2.5 px-3">Demand (kW)</th>
                    <th className="py-2.5 px-3">Grid Import (kW)</th>
                    <th className="py-2.5 px-3">BESS Chg (kW)</th>
                    <th className="py-2.5 px-3">BESS Dis (kW)</th>
                    <th className="py-2.5 px-3">SOC (%)</th>
                    <th className="py-2.5 px-3">Tariff (₹/kWh)</th>
                    <th className="py-2.5 px-3">Cost (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {currentResult.schedule.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-2 px-3 font-semibold text-slate-800">{item.time}</td>
                      <td className="py-2 px-3 text-emerald-600">{item.renewable_gen}</td>
                      <td className="py-2 px-3 text-slate-900">{item.load_demand}</td>
                      <td className="py-2 px-3 text-amber-600">{item.grid_import}</td>
                      <td className="py-2 px-3 text-indigo-600">{item.battery_charge}</td>
                      <td className="py-2 px-3 text-sky-600">{item.battery_discharge}</td>
                      <td className="py-2 px-3 text-slate-700">{item.battery_soc}%</td>
                      <td className="py-2 px-3 text-slate-500">₹{item.tariff.toFixed(2)}</td>
                      <td className="py-2 px-3 font-semibold text-slate-900">₹{item.cost.toFixed(0)}</td>
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

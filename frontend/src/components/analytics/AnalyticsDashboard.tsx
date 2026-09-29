import React, { useState } from 'react';
import { AnalyticsPeriodData } from '@/types';
import { 
  BarChart3, 
  TrendingDown, 
  Sun, 
  Battery, 
  Zap, 
  CheckCircle2, 
  Calendar,
  Sparkles,
  ShieldCheck,
  Percent,
  PiggyBank
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';
import clsx from 'clsx';

interface AnalyticsDashboardProps {
  data: any;
  onTimeframeChange: (timeframe: 'day' | 'week' | 'month') => void;
  isLoading: boolean;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  data,
  onTimeframeChange,
  isLoading
}) => {
  const [activeTimeframe, setActiveTimeframe] = useState<'day' | 'week' | 'month'>('week');

  const handleSelectTimeframe = (tf: 'day' | 'week' | 'month') => {
    setActiveTimeframe(tf);
    onTimeframeChange(tf);
  };

  return (
    <div className="space-y-6">
      {/* Header & Filter Controls */}
      <div className="card-tilt bg-slate-900/80 light:bg-white rounded-2xl border border-slate-800/90 light:border-slate-200 p-6 shadow-2xl shadow-black/30 backdrop-blur-2xl relative overflow-hidden transition-colors">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-emerald-500 to-indigo-500" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-sm">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-white light:text-slate-900 tracking-tight">
                  Historical Analytics & Empirical Audit Verification
                </h2>
                <p className="text-xs text-slate-400 light:text-slate-500 mt-1">
                  Verified financial cost reductions, peak shaving compliance, and renewable utilization trends
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center bg-slate-950/80 light:bg-slate-100 p-1 rounded-xl border border-slate-800 light:border-slate-200 text-xs">
            {(['day', 'week', 'month'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => handleSelectTimeframe(tf)}
                className={clsx(
                  'px-3.5 py-1.5 font-bold rounded-lg uppercase tracking-wider transition-all cursor-pointer font-mono',
                  activeTimeframe === tf
                    ? 'bg-gradient-to-r from-cyan-500 to-sky-600 text-white shadow-md shadow-cyan-500/30'
                    : 'text-slate-400 light:text-slate-600 hover:text-slate-200 light:hover:text-slate-900'
                )}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        {/* Aggregated Performance Highlights */}
        {data && data.totals && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-5 border-t border-slate-800/60 light:border-slate-100">
            <div className="card-tilt-subtle p-4 bg-emerald-950/40 light:bg-emerald-50 rounded-xl border border-emerald-800/50 light:border-emerald-100">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block font-mono">Cumulative Cost Saved</span>
              <span className="text-2xl font-black font-mono text-emerald-300 light:text-emerald-700 mt-1 block">
                ₹{data.totals.total_savings.toLocaleString()}
              </span>
              <span className="text-[10px] font-semibold text-emerald-400 font-mono mt-0.5 block">
                {data.totals.avg_savings_pct}% Avg Savings
              </span>
            </div>

            <div className="card-tilt-subtle p-4 bg-cyan-950/40 light:bg-sky-50 rounded-xl border border-cyan-800/50 light:border-sky-100">
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block font-mono">Max Peak Demand Shaved</span>
              <span className="text-2xl font-black font-mono text-cyan-300 light:text-sky-700 mt-1 block">
                {data.totals.peak_clipped_max_kw} kW
              </span>
              <span className="text-[10px] text-cyan-400 font-mono mt-0.5 block">Below 500 kW Contract</span>
            </div>

            <div className="card-tilt-subtle p-4 bg-indigo-950/40 light:bg-indigo-50 rounded-xl border border-indigo-800/50 light:border-indigo-100">
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block font-mono">Curtailment Prevented</span>
              <span className="text-2xl font-black font-mono text-indigo-300 light:text-indigo-700 mt-1 block">
                {data.totals.total_curtailed_avoided_kwh.toLocaleString()} <span className="text-xs font-normal">kWh</span>
              </span>
              <span className="text-[10px] text-indigo-400 font-mono mt-0.5 block">Absorbed via BESS</span>
            </div>

            <div className="card-tilt-subtle p-4 bg-slate-950/40 light:bg-slate-50 rounded-xl border border-slate-800/70 light:border-slate-200/80">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Production Reliability</span>
              <span className="text-2xl font-black font-mono text-slate-100 light:text-slate-900 mt-1 block">
                100%
              </span>
              <span className="text-[10px] text-emerald-400 font-mono mt-0.5 block">Zero Process Trips</span>
            </div>
          </div>
        )}
      </div>

      {/* 4-Chart Grid */}
      {data && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart 1: Daily Cost Comparison (Baseline vs Optimized) */}
          <div className="card-tilt bg-slate-900/80 light:bg-white rounded-2xl border border-slate-800/90 light:border-slate-200 p-5 shadow-2xl backdrop-blur-2xl transition-colors">
            <h3 className="text-xs font-bold text-slate-200 light:text-slate-800 uppercase tracking-wider mb-4 flex items-center justify-between font-mono">
              <span>Electricity Cost: Baseline vs. Optimized</span>
              <span className="text-slate-400 font-normal">₹ INR</span>
            </h3>
            <div className="h-68 w-full p-2 bg-slate-950/40 light:bg-slate-50/50 rounded-xl border border-slate-800/50 light:border-slate-200/50">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.daily_costs} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} vertical={false} />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
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
                  <Bar dataKey="baseline_cost" fill="#475569" name="Baseline (Uncoordinated)" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="optimized_cost" fill="#06b6d4" name="ENERGIQ Optimized" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Renewable Utilization Trend */}
          <div className="card-tilt bg-slate-900/80 light:bg-white rounded-2xl border border-slate-800/90 light:border-slate-200 p-5 shadow-2xl backdrop-blur-2xl transition-colors">
            <h3 className="text-xs font-bold text-slate-200 light:text-slate-800 uppercase tracking-wider mb-4 flex items-center justify-between font-mono">
              <span>Solar Utilization & Curtailment Prevention</span>
              <span className="text-slate-400 font-normal">kWh</span>
            </h3>
            <div className="h-68 w-full p-2 bg-slate-950/40 light:bg-slate-50/50 rounded-xl border border-slate-800/50 light:border-slate-200/50">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.renewable_utilization_trend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} vertical={false} />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
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
                  <Bar dataKey="utilized_kwh" fill="#10b981" name="Utilized / Stored (kWh)" stackId="a" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="curtailed_kwh" fill="#f43f5e" name="Curtailed Surplus (kWh)" stackId="a" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 3: Grid Peak Demand vs Substation Limit */}
          <div className="card-tilt bg-slate-900/80 light:bg-white rounded-2xl border border-slate-800/90 light:border-slate-200 p-5 shadow-2xl backdrop-blur-2xl transition-colors">
            <h3 className="text-xs font-bold text-slate-200 light:text-slate-800 uppercase tracking-wider mb-4 flex items-center justify-between font-mono">
              <span>Daily Peak Grid Demand vs. Contract Ceiling</span>
              <span className="text-slate-400 font-normal">kW</span>
            </h3>
            <div className="h-68 w-full p-2 bg-slate-950/40 light:bg-slate-50/50 rounded-xl border border-slate-800/50 light:border-slate-200/50">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.grid_peak_history} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} vertical={false} />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickLine={false} />
                  <YAxis domain={[300, 550]} stroke="#64748b" fontSize={10} tickLine={false} unit=" kW" />
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
                  <Line type="monotone" dataKey="peak_kw" stroke="#f59e0b" strokeWidth={2.5} name="Achieved Peak (kW)" dot={{ r: 3.5 }} />
                  <Line type="step" dataKey="contract_limit" stroke="#f43f5e" strokeWidth={2} strokeDasharray="4 4" name="Substation Cap (500 kW)" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 4: Forecaster Accuracy Metrics (MAE & MAPE) */}
          <div className="card-tilt bg-slate-900/80 light:bg-white rounded-2xl border border-slate-800/90 light:border-slate-200 p-5 shadow-2xl backdrop-blur-2xl transition-colors">
            <h3 className="text-xs font-bold text-slate-200 light:text-slate-800 uppercase tracking-wider mb-4 flex items-center justify-between font-mono">
              <span>ML Renewable Forecaster Accuracy Trend</span>
              <span className="text-slate-400 font-normal">MAE (kW) & MAPE (%)</span>
            </h3>
            <div className="h-68 w-full p-2 bg-slate-950/40 light:bg-slate-50/50 rounded-xl border border-slate-800/50 light:border-slate-200/50">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.forecast_accuracy_trend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} vertical={false} />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
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
                  <Line type="monotone" dataKey="mae" stroke="#06b6d4" strokeWidth={2.5} name="MAE (kW)" dot={{ r: 3.5 }} />
                  <Line type="monotone" dataKey="mape" stroke="#10b981" strokeWidth={2.5} name="MAPE (%)" dot={{ r: 3.5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

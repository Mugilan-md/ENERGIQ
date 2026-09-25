import React, { useState } from 'react';
import { AnalyticsPeriodData } from '@/types';
import { 
  BarChart3, 
  TrendingDown, 
  Sun, 
  Battery, 
  Zap, 
  CheckCircle2, 
  Calendar 
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
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-sky-600" />
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Historical Analytics & Optimization Performance
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Empirical cost reductions, peak shaving verification, and renewable utilization trends
            </p>
          </div>

          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            {(['day', 'week', 'month'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => handleSelectTimeframe(tf)}
                className={clsx(
                  'px-3.5 py-1.5 font-bold rounded-lg uppercase tracking-wider transition-all',
                  activeTimeframe === tf
                    ? 'bg-white text-sky-700 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                )}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        {/* Aggregated Highlights */}
        {data && data.totals && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-5 border-t border-slate-100">
            <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-100">
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">Cumulative Savings</span>
              <span className="text-xl font-extrabold font-mono text-emerald-700 mt-1 block">
                ₹{data.totals.total_savings.toLocaleString()}
              </span>
              <span className="text-[10px] font-semibold text-emerald-600">
                {data.totals.avg_savings_pct}% Avg Savings
              </span>
            </div>

            <div className="p-3.5 bg-sky-50 rounded-xl border border-sky-100">
              <span className="text-[10px] font-bold text-sky-800 uppercase tracking-wider block">Max Peak Shaved</span>
              <span className="text-xl font-extrabold font-mono text-sky-700 mt-1 block">
                {data.totals.peak_clipped_max_kw} kW
              </span>
              <span className="text-[10px] text-sky-600">Below 500 kW Contract</span>
            </div>

            <div className="p-3.5 bg-indigo-50 rounded-xl border border-indigo-100">
              <span className="text-[10px] font-bold text-indigo-800 uppercase tracking-wider block">Curtailment Prevented</span>
              <span className="text-xl font-extrabold font-mono text-indigo-700 mt-1 block">
                {data.totals.total_curtailed_avoided_kwh.toLocaleString()} kWh
              </span>
              <span className="text-[10px] text-indigo-600">Absorbed via BESS</span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Production Reliability</span>
              <span className="text-xl font-extrabold font-mono text-slate-900 mt-1 block">
                100%
              </span>
              <span className="text-[10px] text-emerald-600 font-semibold">Zero Trip Interruptions</span>
            </div>
          </div>
        )}
      </div>

      {/* Charts Grid */}
      {data && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart 1: Daily Cost Comparison (Baseline vs Optimized) */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center justify-between">
              <span>Electricity Cost: Baseline vs. Optimized</span>
              <span className="text-slate-400 font-normal">₹ INR</span>
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.daily_costs} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderRadius: '8px',
                      borderColor: '#cbd5e1',
                      fontSize: '11px'
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Bar dataKey="baseline_cost" fill="#cbd5e1" name="Baseline (Grid Only)" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="optimized_cost" fill="#0284c7" name="ENERGIQ Optimized" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Renewable Utilization Trend */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center justify-between">
              <span>Solar Utilization & Curtailment Prevention</span>
              <span className="text-slate-400 font-normal">kWh</span>
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.renewable_utilization_trend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderRadius: '8px',
                      borderColor: '#cbd5e1',
                      fontSize: '11px'
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Bar dataKey="utilized_kwh" fill="#10b981" name="Directly Utilized / Stored" stackId="a" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="curtailed_kwh" fill="#f43f5e" name="Curtailed Surplus" stackId="a" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 3: Grid Peak Demand vs Substation Limit */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center justify-between">
              <span>Daily Peak Grid Demand Tracking</span>
              <span className="text-slate-400 font-normal">kW</span>
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.grid_peak_history} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} tickLine={false} />
                  <YAxis domain={[300, 550]} stroke="#94a3b8" fontSize={10} tickLine={false} unit=" kW" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderRadius: '8px',
                      borderColor: '#cbd5e1',
                      fontSize: '11px'
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Line type="monotone" dataKey="peak_kw" stroke="#f59e0b" strokeWidth={2.5} name="Achieved Peak (kW)" dot={{ r: 3 }} />
                  <Line type="step" dataKey="contract_limit" stroke="#e11d48" strokeWidth={2} strokeDasharray="4 4" name="Substation Contract Ceiling (500 kW)" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 4: Forecaster Accuracy Metrics (MAE & MAPE) */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center justify-between">
              <span>ML Renewable Forecaster Accuracy Trend</span>
              <span className="text-slate-400 font-normal">MAE (kW) & MAPE (%)</span>
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.forecast_accuracy_trend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderRadius: '8px',
                      borderColor: '#cbd5e1',
                      fontSize: '11px'
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Line type="monotone" dataKey="mae" stroke="#0284c7" strokeWidth={2} name="MAE (kW)" dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="mape" stroke="#10b981" strokeWidth={2} name="MAPE (%)" dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

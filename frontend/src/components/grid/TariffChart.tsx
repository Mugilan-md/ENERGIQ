import React from 'react';
import { GridTariffInfo } from '@/types';
import { Zap, Clock, AlertTriangle, ShieldCheck, TrendingUp, IndianRupee, ArrowRight, Info } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';

interface TariffChartProps {
  gridInfo: GridTariffInfo;
}

export const TariffChart: React.FC<TariffChartProps> = ({ gridInfo }) => {
  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'PEAK':
      case 'CRITICAL_PEAK':
        return '#f43f5e'; // Rose
      case 'STANDARD':
        return '#06b6d4'; // Cyan
      case 'OFF_PEAK':
      default:
        return '#10b981'; // Emerald
    }
  };

  return (
    <div className="card-tilt bg-slate-900/80 light:bg-white rounded-2xl border border-slate-800/90 light:border-slate-200 p-6 shadow-2xl shadow-black/30 backdrop-blur-2xl relative overflow-hidden transition-colors">
      {/* Top Gradient Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-rose-500 to-orange-500" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-sm">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base font-extrabold text-white light:text-slate-900 tracking-tight">
                  Grid & Dynamic Time-of-Use (ToU) Tariff Intelligence
                </h2>
                <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 uppercase">
                  Arbitrage Active
                </span>
              </div>
              <p className="text-xs text-slate-400 light:text-slate-500 mt-1">
                24-hour tariff schedule, demand-charge penalty exposure, and substation import constraints
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono font-bold">
          <div className="flex items-center gap-2 px-3.5 py-1.5 bg-amber-500/15 border border-amber-500/30 text-amber-300 rounded-xl shadow-xs">
            <IndianRupee className="w-4 h-4 text-amber-400" />
            <span>Active Rate: ₹{gridInfo.current_tariff.toFixed(2)} / kWh</span>
          </div>
        </div>
      </div>

      {/* KPI Overview Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="card-tilt-subtle p-4 bg-slate-950/60 light:bg-slate-50 rounded-xl border border-slate-800/80 light:border-slate-200">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Current Tariff Tier</span>
          <div className="flex items-center gap-2 mt-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full animate-pulse"
              style={{ backgroundColor: getTierColor(gridInfo.current_tier) }}
            />
            <span className="text-sm font-extrabold text-white light:text-slate-900 font-mono">{gridInfo.current_tier}</span>
          </div>
        </div>

        <div className="card-tilt-subtle p-4 bg-slate-950/60 light:bg-slate-50 rounded-xl border border-slate-800/80 light:border-slate-200">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Next Shift</span>
          <div className="flex items-center gap-1.5 mt-1.5 text-sm font-extrabold text-white light:text-slate-900 font-mono">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>{gridInfo.next_tier} @ {gridInfo.next_tier_time}</span>
          </div>
        </div>

        <div className="card-tilt-subtle p-4 bg-slate-950/60 light:bg-slate-50 rounded-xl border border-slate-800/80 light:border-slate-200">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Substation Contract Cap</span>
          <span className="text-sm font-extrabold font-mono text-cyan-400 light:text-cyan-700 mt-1.5 block">
            {gridInfo.import_limit_kw} kW Limit
          </span>
        </div>

        <div className="card-tilt-subtle p-4 bg-slate-950/60 light:bg-slate-50 rounded-xl border border-slate-800/80 light:border-slate-200">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Monthly Demand Charge</span>
          <span className="text-sm font-extrabold font-mono text-rose-400 light:text-rose-700 mt-1.5 block">
            ₹{gridInfo.demand_charge_exposure.toLocaleString()}
          </span>
        </div>
      </div>

      {/* 24-Hour Tariff Bar Chart */}
      <div className="h-68 w-full p-3 bg-slate-950/50 light:bg-slate-50 rounded-xl border border-slate-800/60 light:border-slate-200">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={gridInfo.schedule} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} vertical={false} />
            <XAxis dataKey="time_label" stroke="#64748b" fontSize={10} tickLine={false} />
            <YAxis stroke="#64748b" fontSize={10} tickLine={false} unit=" ₹" />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-slate-900 border border-slate-700 p-3.5 rounded-xl shadow-2xl text-xs text-slate-100 font-mono">
                      <div className="font-bold text-white border-b border-slate-800 pb-1 mb-1.5">{data.time_label}</div>
                      <div className="mt-1 flex items-center justify-between gap-5">
                        <span className="text-slate-400">Tariff:</span>
                        <strong className="font-mono text-amber-400">₹{data.tariff.toFixed(2)}/kWh</strong>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">Tier: <span className="font-semibold text-slate-200">{data.tier}</span></div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="tariff" radius={[4, 4, 0, 0]}>
              {gridInfo.schedule.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={getTierColor(entry.tier)}
                  fillOpacity={entry.is_current ? 1.0 : 0.65}
                  stroke={entry.is_current ? '#ffffff' : 'none'}
                  strokeWidth={entry.is_current ? 2 : 0}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend & Advice */}
      <div className="mt-4 pt-4 border-t border-slate-800/60 light:border-slate-100 flex flex-wrap items-center justify-between text-xs gap-3">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
            <span className="text-slate-300 light:text-slate-600 font-mono text-xs">Off-Peak (₹4.50)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-cyan-500 shadow-sm shadow-cyan-500/50" />
            <span className="text-slate-300 light:text-slate-600 font-mono text-xs">Standard (₹7.80)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500 shadow-sm shadow-rose-500/50" />
            <span className="text-slate-300 light:text-slate-600 font-mono text-xs">Peak (₹12.50)</span>
          </div>
        </div>

        <span className="text-[11px] text-slate-400 font-mono">
          Demand Charge Rate: ₹{gridInfo.demand_charge_rate}/kW/month for peak monthly half-hour
        </span>
      </div>
    </div>
  );
};

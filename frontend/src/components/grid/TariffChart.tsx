import React from 'react';
import { GridTariffInfo } from '@/types';
import { Zap, Clock, AlertTriangle, ShieldCheck, TrendingUp } from 'lucide-react';
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
        return '#0284c7'; // Sky
      case 'OFF_PEAK':
      default:
        return '#10b981'; // Emerald
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Grid & Dynamic Time-of-Use Tariff Intelligence
            </h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
              ToU Arbitrage
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            24-hour tariff schedule, demand-charge penalty exposure, and substation import constraints
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono font-bold">
          <span className="px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg">
            Current Rate: ₹{gridInfo.current_tariff.toFixed(2)}/kWh
          </span>
        </div>
      </div>

      {/* KPI Overview Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Current Tier</span>
          <div className="flex items-center gap-1.5 mt-1">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: getTierColor(gridInfo.current_tier) }}
            />
            <span className="text-sm font-bold text-slate-800">{gridInfo.current_tier}</span>
          </div>
        </div>

        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Next Tier Switch</span>
          <div className="flex items-center gap-1.5 mt-1 text-sm font-bold text-slate-800">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>{gridInfo.next_tier} @ {gridInfo.next_tier_time}</span>
          </div>
        </div>

        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Substation Limit</span>
          <span className="text-sm font-bold font-mono text-slate-800 mt-1 block">
            {gridInfo.import_limit_kw} kW Contract
          </span>
        </div>

        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Monthly Peak Exposure</span>
          <span className="text-sm font-bold font-mono text-rose-700 mt-1 block">
            ₹{gridInfo.demand_charge_exposure.toLocaleString()}
          </span>
        </div>
      </div>

      {/* 24-Hour Tariff Bar Chart */}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={gridInfo.schedule} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="time_label" stroke="#94a3b8" fontSize={10} tickLine={false} />
            <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} unit=" ₹" />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-sm text-xs">
                      <div className="font-bold text-slate-800">{data.time_label}</div>
                      <div className="mt-1 flex items-center justify-between gap-3">
                        <span className="text-slate-500">Tariff:</span>
                        <strong className="font-mono text-slate-900">₹{data.tariff.toFixed(2)}/kWh</strong>
                      </div>
                      <div className="text-[11px] text-slate-500">Tier: {data.tier}</div>
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
                  fillOpacity={entry.is_current ? 1.0 : 0.75}
                  stroke={entry.is_current ? '#0f172a' : 'none'}
                  strokeWidth={entry.is_current ? 2 : 0}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend & Advice */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs gap-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-emerald-500" />
            <span className="text-slate-600">Off-Peak (₹4.50)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-sky-600" />
            <span className="text-slate-600">Standard (₹7.80)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-rose-500" />
            <span className="text-slate-600">Peak (₹12.50)</span>
          </div>
        </div>

        <span className="text-[11px] text-slate-400">
          Demand Charge Rate: ₹{gridInfo.demand_charge_rate}/kW/month for peak monthly half-hour
        </span>
      </div>
    </div>
  );
};

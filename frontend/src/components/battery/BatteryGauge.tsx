import React from 'react';
import { BatteryState } from '@/types';
import { BatteryCharging, Battery, ShieldAlert, Sparkles, Thermometer, RefreshCw, Zap, Cpu, Activity, ShieldCheck } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import clsx from 'clsx';

interface BatteryGaugeProps {
  battery: BatteryState;
}

export const BatteryGauge: React.FC<BatteryGaugeProps> = ({ battery }) => {
  const soc = battery.current_soc;
  const isCharging = battery.current_power < 0;
  const isDischarging = battery.current_power > 0;

  // Circular gauge calculations
  const radius = 72;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (soc / 100) * circumference;

  return (
    <div className="bg-slate-900/80 light:bg-white rounded-2xl border border-slate-800/90 light:border-slate-200 p-6 shadow-2xl shadow-black/30 backdrop-blur-2xl relative overflow-hidden transition-colors">
      {/* Top Gradient Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 shadow-sm">
              <BatteryCharging className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base font-extrabold text-white light:text-slate-900 tracking-tight">
                  BESS Telemetry & Battery Intelligence
                </h2>
                <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 uppercase">
                  LFP Cell Pack
                </span>
              </div>
              <p className="text-xs text-slate-400 light:text-slate-500 mt-1">
                Real-time State of Charge (SOC), thermal dissipation, and cyclic degradation management
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-3 py-1.5 bg-slate-950/70 light:bg-slate-100 border border-slate-800 light:border-slate-200 text-slate-300 light:text-slate-700 font-semibold rounded-xl">
            SOH: <strong className="text-emerald-400 light:text-emerald-600">{battery.health_soh}%</strong>
          </span>
          <span className="px-3 py-1.5 bg-slate-950/70 light:bg-slate-100 border border-slate-800 light:border-slate-200 text-slate-300 light:text-slate-700 font-semibold rounded-xl">
            Cycles: <strong className="text-white light:text-slate-900">{battery.cycle_count}</strong>
          </span>
        </div>
      </div>

      {/* Grid: Circular Gauge + Metrics + Projected Curve */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
        {/* SVG Circular Gauge */}
        <div className="flex flex-col items-center justify-center p-5 bg-slate-950/70 light:bg-slate-50 rounded-2xl border border-slate-800/80 light:border-slate-200 relative">
          <div className="relative w-48 h-48 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 170 170">
              <defs>
                <linearGradient id="socGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="50%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
                <filter id="gaugeGlow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>

              {/* Background Track */}
              <circle
                cx="85"
                cy="85"
                r={radius}
                className="text-slate-800/60 light:text-slate-200"
                strokeWidth="12"
                stroke="currentColor"
                fill="transparent"
              />
              {/* Progress Track */}
              <circle
                cx="85"
                cy="85"
                r={radius}
                stroke={soc < 25 ? '#f43f5e' : 'url(#socGradient)'}
                strokeWidth="12"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                filter="url(#gaugeGlow)"
                className="transition-all duration-1000 ease-out"
              />
            </svg>

            {/* Inner Content Display */}
            <div className="absolute flex flex-col items-center text-center">
              {isCharging ? (
                <div className="flex items-center gap-1 text-cyan-400 animate-pulse">
                  <BatteryCharging className="w-6 h-6" />
                </div>
              ) : (
                <Battery className="w-6 h-6 text-indigo-400" />
              )}
              <span className="text-3xl font-black font-mono text-white light:text-slate-900 mt-1 tracking-tight tabular-nums">
                {soc.toFixed(1)}<span className="text-lg font-normal text-slate-400">%</span>
              </span>
              <span className={clsx(
                "text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full mt-1 border",
                isCharging ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40" :
                isDischarging ? "bg-amber-500/20 text-amber-300 border-amber-500/40" :
                "bg-slate-800 text-slate-400 border-slate-700"
              )}>
                {battery.state}
              </span>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3 text-xs font-mono text-slate-400 light:text-slate-600">
            <span>Min: {battery.min_soc}%</span>
            <span className="text-slate-700">•</span>
            <span className="font-bold text-amber-400 light:text-amber-600">Reserve Lock: {battery.reserve_soc}%</span>
            <span className="text-slate-700">•</span>
            <span>Max: {battery.max_soc}%</span>
          </div>
        </div>

        {/* Technical Specs & Metrics */}
        <div className="space-y-2.5">
          <div className="p-3 bg-slate-950/60 light:bg-slate-50 rounded-xl border border-slate-800/80 light:border-slate-200 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 light:text-slate-600">Usable Storage Available</span>
            <span className="text-sm font-bold font-mono text-slate-100 light:text-slate-900">
              {battery.available_energy_kwh} / {battery.capacity_kwh} <span className="text-xs text-slate-400 font-normal">kWh</span>
            </span>
          </div>

          <div className="p-3 bg-slate-950/60 light:bg-slate-50 rounded-xl border border-slate-800/80 light:border-slate-200 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 light:text-slate-600">Bi-directional Inverter</span>
            <span className="text-sm font-bold font-mono text-slate-100 light:text-slate-900">
              ±{battery.max_charge_kw} <span className="text-xs text-slate-400 font-normal">kW Rating</span>
            </span>
          </div>

          <div className="p-3 bg-slate-950/60 light:bg-slate-50 rounded-xl border border-slate-800/80 light:border-slate-200 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 light:text-slate-600">Round-Trip Efficiency (RTE)</span>
            <span className="text-sm font-bold font-mono text-emerald-400 light:text-emerald-600">
              {(battery.charge_efficiency * battery.discharge_efficiency * 100).toFixed(1)}%
            </span>
          </div>

          <div className="p-3 bg-slate-950/60 light:bg-slate-50 rounded-xl border border-slate-800/80 light:border-slate-200 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 light:text-slate-600">Degradation Cost Model</span>
            <span className="text-sm font-bold font-mono text-amber-400 light:text-amber-600">
              ₹{battery.degradation_cost_per_kwh.toFixed(2)} / kWh
            </span>
          </div>

          <div className="p-3 bg-slate-950/60 light:bg-slate-50 rounded-xl border border-slate-800/80 light:border-slate-200 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 light:text-slate-600 flex items-center gap-1.5">
              <Thermometer className="w-3.5 h-3.5 text-amber-400" />
              Thermal Core Temp
            </span>
            <span className="text-sm font-bold font-mono text-slate-100 light:text-slate-900">
              {battery.temperature_c} °C <span className="text-xs font-normal text-emerald-400">(Nominal)</span>
            </span>
          </div>
        </div>

        {/* 24-Hour Projected SOC Curve */}
        <div className="p-4 bg-slate-950/60 light:bg-slate-50 rounded-2xl border border-slate-800/80 light:border-slate-200">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2 font-mono">
            24-Hour Trajectory Projection
          </span>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={battery.projected_soc_curve}>
                <defs>
                  <linearGradient id="socAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#818cf8" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#818cf8" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} vertical={false} />
                <XAxis dataKey="time" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis domain={[0, 100]} stroke="#64748b" fontSize={10} tickLine={false} unit="%" />
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
                <Area
                  type="monotone"
                  dataKey="soc"
                  stroke="#818cf8"
                  strokeWidth={2.5}
                  fill="url(#socAreaGrad)"
                  name="Projected SOC (%)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Autonomous Strategy Recommendation Strip */}
      <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-slate-900 border border-indigo-500/35 flex items-start gap-3.5 shadow-lg">
        <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-xl shrink-0 mt-0.5 shadow-md shadow-indigo-500/30">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block font-mono">
            BESS Autonomous Dynamic Strategy
          </span>
          <p className="text-xs text-slate-300 light:text-slate-700 mt-1 leading-relaxed">
            Charge battery at 180 kW for the next 45 minutes because renewable generation exceeds current production demand and grid prices are scheduled to surge to ₹12.50/kWh at 18:00.
          </p>
        </div>
      </div>
    </div>
  );
};

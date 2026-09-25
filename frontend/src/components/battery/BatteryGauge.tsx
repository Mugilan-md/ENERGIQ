import React from 'react';
import { BatteryState } from '@/types';
import { BatteryCharging, Battery, ShieldAlert, Sparkles, Thermometer, RefreshCw } from 'lucide-react';
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
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (soc / 100) * circumference;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Battery Energy Storage System (BESS) Intelligence
            </h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 border border-indigo-200">
              LFP Chemistry
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time State of Charge (SOC), thermal dissipation, and cyclic degradation management
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 bg-slate-50 border border-slate-200 text-slate-700 font-semibold rounded-lg">
            Health (SOH): {battery.health_soh}%
          </span>
          <span className="px-2.5 py-1 bg-slate-50 border border-slate-200 text-slate-700 font-semibold rounded-lg">
            Cycles: {battery.cycle_count}
          </span>
        </div>
      </div>

      {/* Grid of Gauge + Primary Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
        {/* SVG Circular Gauge */}
        <div className="flex flex-col items-center justify-center p-4 bg-slate-50/70 rounded-2xl border border-slate-100">
          <div className="relative w-44 h-44 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
              {/* Background circle */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                className="text-slate-200"
                strokeWidth="12"
                stroke="currentColor"
                fill="transparent"
              />
              {/* Progress circle */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke={soc < 25 ? '#e11d48' : soc > 80 ? '#10b981' : '#0284c7'}
                strokeWidth="12"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-700 ease-out"
              />
            </svg>

            {/* Inner Content */}
            <div className="absolute flex flex-col items-center text-center">
              {isCharging ? (
                <BatteryCharging className="w-6 h-6 text-sky-600 animate-pulse" />
              ) : (
                <Battery className="w-6 h-6 text-slate-700" />
              )}
              <span className="text-3xl font-extrabold font-mono text-slate-900 mt-1">
                {soc.toFixed(1)}%
              </span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                {battery.state}
              </span>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-4 text-xs font-mono text-slate-600">
            <span>Min: {battery.min_soc}%</span>
            <span className="text-slate-300">•</span>
            <span className="font-bold text-amber-600">Reserve: {battery.reserve_soc}%</span>
            <span className="text-slate-300">•</span>
            <span>Max: {battery.max_soc}%</span>
          </div>
        </div>

        {/* Technical Specs & Metrics */}
        <div className="space-y-3">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Available Energy</span>
            <span className="text-sm font-bold font-mono text-slate-900">
              {battery.available_energy_kwh} / {battery.capacity_kwh} kWh
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Charge / Discharge Rating</span>
            <span className="text-sm font-bold font-mono text-slate-900">
              ±{battery.max_charge_kw} kW Max
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Round-Trip Efficiency</span>
            <span className="text-sm font-bold font-mono text-emerald-600">
              {(battery.charge_efficiency * battery.discharge_efficiency * 100).toFixed(1)}%
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Degradation Cost Penalty</span>
            <span className="text-sm font-bold font-mono text-slate-900">
              ₹{battery.degradation_cost_per_kwh.toFixed(2)} / kWh throughput
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
              <Thermometer className="w-3.5 h-3.5 text-amber-500" />
              Cell Temperature
            </span>
            <span className="text-sm font-bold font-mono text-slate-900">
              {battery.temperature_c} °C (Normal)
            </span>
          </div>
        </div>

        {/* 24-Hour Projected SOC Trajectory Chart */}
        <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-200/70">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
            24-Hour Projected SOC Curve
          </span>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={battery.projected_soc_curve}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={10} tickLine={false} unit="%" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '8px',
                    borderColor: '#cbd5e1',
                    fontSize: '11px'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="soc"
                  stroke="#4f46e5"
                  strokeWidth={2}
                  fill="#818cf8"
                  fillOpacity={0.2}
                  name="Projected SOC (%)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* AI Recommendation Banner */}
      <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-sky-50 rounded-xl border border-indigo-200/80 flex items-start gap-3">
        <div className="p-2 bg-indigo-600 text-white rounded-lg shrink-0 mt-0.5 shadow-2xs">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <span className="text-xs font-bold text-indigo-900 uppercase tracking-wider block">
            BESS Autonomous Strategy Recommendation
          </span>
          <p className="text-xs text-slate-700 mt-1 leading-relaxed">
            Charge battery at 180 kW for the next 45 minutes because renewable generation exceeds current production demand and grid prices are scheduled to surge to ₹12.50/kWh at 18:00.
          </p>
        </div>
      </div>
    </div>
  );
};

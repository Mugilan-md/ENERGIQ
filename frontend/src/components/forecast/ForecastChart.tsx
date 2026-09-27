import React, { useState } from 'react';
import { ForecastData, ForecastPoint } from '@/types';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';
import { Sun, CloudSun, Thermometer, Wind, CheckCircle2, Sliders, Radio, Sparkles, CloudRain, Gauge } from 'lucide-react';
import clsx from 'clsx';

interface ForecastChartProps {
  data: ForecastData;
  onHorizonChange: (horizon: '15m' | '30m' | '1h' | '6h' | '24h') => void;
  isLoading?: boolean;
}

export const ForecastChart: React.FC<ForecastChartProps> = ({
  data,
  onHorizonChange,
  isLoading
}) => {
  const [showConfidence, setShowConfidence] = useState(true);
  const [showDemand, setShowDemand] = useState(true);

  const horizons: Array<'15m' | '30m' | '1h' | '6h' | '24h'> = ['15m', '30m', '1h', '6h', '24h'];

  // Current weather telemetry metrics from latest point
  const currentPt = data.points[0] || {
    solar_irradiance: 820,
    temperature: 29.4,
    cloud_cover: 18
  };

  return (
    <div className="bg-slate-900/80 light:bg-white rounded-2xl border border-slate-800/90 light:border-slate-200 p-6 shadow-2xl shadow-black/30 backdrop-blur-2xl relative overflow-hidden transition-colors">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-sky-500 to-indigo-500" />

      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h2 className="text-base font-extrabold text-white light:text-slate-900 tracking-tight flex items-center gap-2">
              <Sun className="w-5 h-5 text-cyan-400 light:text-sky-600 animate-spin-slow" />
              Renewable Generation & Industrial Demand Forecast
            </h2>
            <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 uppercase">
              GradientBoosting ML
            </span>
            {!data.is_simulated ? (
              <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 uppercase">
                <Radio className="w-2.5 h-2.5 animate-pulse" />
                Open-Meteo Live API Synced
              </span>
            ) : (
              <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 uppercase">
                Synthetic Telemetry Fallback
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 light:text-slate-500 mt-1">
            Real-time weather-aware time-series predictions with 10%–90% quantile confidence intervals
          </p>
        </div>

        {/* Horizon Selector */}
        <div className="flex items-center flex-wrap gap-3">
          <div className="flex items-center bg-slate-950/80 light:bg-slate-100 p-1 rounded-xl border border-slate-800/80 light:border-slate-200">
            {horizons.map((h) => (
              <button
                key={h}
                onClick={() => onHorizonChange(h)}
                className={clsx(
                  'px-3.5 py-1 text-xs font-mono font-bold rounded-lg transition-all cursor-pointer',
                  data.horizon === h
                    ? 'bg-gradient-to-r from-cyan-500 to-sky-600 text-white shadow-md shadow-cyan-500/30'
                    : 'text-slate-400 light:text-slate-600 hover:text-white light:hover:text-slate-900'
                )}
              >
                {h}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3.5 pl-2 border-l border-slate-800 light:border-slate-200 text-xs">
            <label className="flex items-center gap-2 cursor-pointer text-slate-300 light:text-slate-600 select-none">
              <input
                type="checkbox"
                checked={showConfidence}
                onChange={(e) => setShowConfidence(e.target.checked)}
                className="rounded border-slate-700 text-cyan-500 focus:ring-cyan-500"
              />
              <span className="font-semibold text-xs">Confidence Band</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-slate-300 light:text-slate-600 select-none">
              <input
                type="checkbox"
                checked={showDemand}
                onChange={(e) => setShowDemand(e.target.checked)}
                className="rounded border-slate-700 text-purple-500 focus:ring-purple-500"
              />
              <span className="font-semibold text-xs">Factory Demand</span>
            </label>
          </div>
        </div>
      </div>

      {/* Weather Telemetry Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 p-3.5 bg-slate-950/50 light:bg-slate-50/70 rounded-xl border border-slate-800/60 light:border-slate-200/80">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Sun className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 font-mono block">Solar GHI</span>
            <span className="text-sm font-extrabold font-mono text-slate-100 light:text-slate-900">
              {currentPt.solar_irradiance} <span className="text-xs font-normal text-slate-400">W/m²</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <Thermometer className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 font-mono block">Ambient Temp</span>
            <span className="text-sm font-extrabold font-mono text-slate-100 light:text-slate-900">
              {currentPt.temperature} <span className="text-xs font-normal text-slate-400">°C</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <CloudSun className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 font-mono block">Cloud Cover</span>
            <span className="text-sm font-extrabold font-mono text-slate-100 light:text-slate-900">
              {currentPt.cloud_cover}% <span className="text-[10px] text-emerald-400 font-normal">(Low)</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Wind className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 font-mono block">Wind Velocity</span>
            <span className="text-sm font-extrabold font-mono text-slate-100 light:text-slate-900">
              5.2 <span className="text-xs font-normal text-slate-400">m/s</span>
            </span>
          </div>
        </div>
      </div>

      {/* Model Evaluation Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="p-3.5 bg-slate-950/60 light:bg-slate-50 rounded-xl border border-slate-800/80 light:border-slate-200">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">MAE (Error)</span>
          <span className="text-lg font-black font-mono text-cyan-400 light:text-sky-700 mt-0.5 block">{data.mae} kW</span>
        </div>
        <div className="p-3.5 bg-slate-950/60 light:bg-slate-50 rounded-xl border border-slate-800/80 light:border-slate-200">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">RMSE</span>
          <span className="text-lg font-black font-mono text-white light:text-slate-800 mt-0.5 block">{data.rmse} kW</span>
        </div>
        <div className="p-3.5 bg-slate-950/60 light:bg-slate-50 rounded-xl border border-slate-800/80 light:border-slate-200">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">MAPE</span>
          <span className="text-lg font-black font-mono text-amber-400 light:text-amber-700 mt-0.5 block">{data.mape}%</span>
        </div>
        <div className="p-3.5 bg-slate-950/60 light:bg-slate-50 rounded-xl border border-slate-800/80 light:border-slate-200">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">R² Score</span>
          <span className="text-lg font-black font-mono text-emerald-400 light:text-emerald-700 mt-0.5 block">{data.r2}</span>
        </div>
      </div>

      {/* Forecast Chart Canvas */}
      <div className="w-full h-84 relative">
        {isLoading && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs z-10 flex items-center justify-center rounded-2xl">
            <span className="text-xs font-mono font-bold text-cyan-400 animate-pulse flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
              Recomputing Machine Learning Horizon...
            </span>
          </div>
        )}

        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data.points} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="solarGlowGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.35}/>
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis
              dataKey="time_label"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
            />
            <YAxis
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              unit=" kW"
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const pt = payload[0].payload as ForecastPoint;
                  return (
                    <div className="bg-slate-900/95 light:bg-white/95 backdrop-blur-2xl p-4 rounded-xl border border-slate-700/80 light:border-slate-200 shadow-2xl text-xs font-mono">
                      <div className="font-bold text-white light:text-slate-900 border-b border-slate-800 light:border-slate-100 pb-1.5 mb-2.5 flex items-center justify-between">
                        <span>Time Interval: {label}</span>
                        <span className="text-[10px] text-cyan-400 font-normal">Prediction</span>
                      </div>
                      <div className="space-y-2">
                        {pt.actual_generation !== undefined && pt.actual_generation !== null && (
                          <div className="flex justify-between gap-6 text-emerald-400 light:text-emerald-700">
                            <span>Actual Solar:</span>
                            <span className="font-bold">{pt.actual_generation} kW</span>
                          </div>
                        )}
                        <div className="flex justify-between gap-6 text-cyan-400 light:text-sky-700">
                          <span>Forecast Solar:</span>
                          <span className="font-bold">{pt.forecast_generation} kW</span>
                        </div>
                        {showConfidence && (
                          <div className="flex justify-between gap-6 text-slate-400 text-[11px]">
                            <span>Confidence (10-90%):</span>
                            <span>{pt.confidence_lower} – {pt.confidence_upper} kW</span>
                          </div>
                        )}
                        {showDemand && (
                          <div className="flex justify-between gap-6 text-purple-400 light:text-indigo-700 pt-1.5 border-t border-slate-800">
                            <span>Predicted Demand:</span>
                            <span className="font-bold">{pt.forecast_demand} kW</span>
                          </div>
                        )}
                        <div className="text-[10px] text-slate-400 pt-2 mt-1.5 border-t border-slate-800 flex gap-4">
                          <span>GHI: {pt.solar_irradiance} W/m²</span>
                          <span>Temp: {pt.temperature}°C</span>
                          <span>Cloud: {pt.cloud_cover}%</span>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
              iconType="circle"
            />

            {/* Confidence Interval Band */}
            {showConfidence && (
              <Area
                type="monotone"
                dataKey="confidence_upper"
                stroke="none"
                fill="#06b6d4"
                fillOpacity={0.12}
                name="Confidence Range (90%)"
              />
            )}

            {/* Forecast Solar Generation with Area Glow */}
            <Area
              type="monotone"
              dataKey="forecast_generation"
              stroke="#06b6d4"
              strokeWidth={2.5}
              fill="url(#solarGlowGrad)"
              name="Forecast Solar (kW)"
            />

            {/* Actual Solar Generation */}
            <Line
              type="monotone"
              dataKey="actual_generation"
              stroke="#10b981"
              strokeWidth={2.5}
              strokeDasharray="4 4"
              dot={{ r: 3.5, fill: '#10b981' }}
              name="Actual Solar (kW)"
              connectNulls={false}
            />

            {/* Industrial Demand Curve */}
            {showDemand && (
              <Line
                type="monotone"
                dataKey="forecast_demand"
                stroke="#a855f7"
                strokeWidth={2.5}
                dot={false}
                name="Factory Demand (kW)"
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

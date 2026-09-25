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
import { Sun, CloudSun, Thermometer, Wind, CheckCircle2, Sliders } from 'lucide-react';
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

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Renewable Generation & Industrial Demand Forecast
            </h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
              GradientBoosting ML
            </span>
            {data.is_simulated && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                Simulated Telemetry
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Weather-aware time-series predictions with 10%–90% quantile confidence intervals
          </p>
        </div>

        {/* Horizon Selector */}
        <div className="flex items-center flex-wrap gap-2">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            {horizons.map((h) => (
              <button
                key={h}
                onClick={() => onHorizonChange(h)}
                className={clsx(
                  'px-3 py-1 text-xs font-bold rounded-lg transition-all',
                  data.horizon === h
                    ? 'bg-white text-sky-700 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                )}
              >
                {h}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 pl-2 border-l border-slate-200 text-xs">
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-600 select-none">
              <input
                type="checkbox"
                checked={showConfidence}
                onChange={(e) => setShowConfidence(e.target.checked)}
                className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
              />
              <span>Confidence Band</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-600 select-none">
              <input
                type="checkbox"
                checked={showDemand}
                onChange={(e) => setShowDemand(e.target.checked)}
                className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
              />
              <span>Load Demand</span>
            </label>
          </div>
        </div>
      </div>

      {/* Model Quality Metric Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">MAE (Error)</span>
          <span className="text-base font-extrabold font-mono text-slate-800">{data.mae} kW</span>
        </div>
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">RMSE</span>
          <span className="text-base font-extrabold font-mono text-slate-800">{data.rmse} kW</span>
        </div>
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">MAPE</span>
          <span className="text-base font-extrabold font-mono text-slate-800">{data.mape}%</span>
        </div>
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">R² Score</span>
          <span className="text-base font-extrabold font-mono text-emerald-600">{data.r2}</span>
        </div>
      </div>

      {/* Chart */}
      <div className="w-full h-80 relative">
        {isLoading && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-2xs z-10 flex items-center justify-center">
            <span className="text-xs font-bold text-slate-600">Recomputing forecast...</span>
          </div>
        )}

        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data.points} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="time_label"
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0' }}
            />
            <YAxis
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0' }}
              unit=" kW"
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const pt = payload[0].payload as ForecastPoint;
                  return (
                    <div className="bg-white/95 backdrop-blur-md p-3 rounded-xl border border-slate-200 shadow-md text-xs">
                      <div className="font-bold text-slate-900 border-b pb-1 mb-2">
                        Time: {label}
                      </div>
                      <div className="space-y-1">
                        {pt.actual_generation !== undefined && pt.actual_generation !== null && (
                          <div className="flex justify-between gap-4 text-emerald-700">
                            <span>Actual Solar:</span>
                            <span className="font-mono font-bold">{pt.actual_generation} kW</span>
                          </div>
                        )}
                        <div className="flex justify-between gap-4 text-sky-700">
                          <span>Forecast Solar:</span>
                          <span className="font-mono font-bold">{pt.forecast_generation} kW</span>
                        </div>
                        {showConfidence && (
                          <div className="flex justify-between gap-4 text-slate-500 text-[11px]">
                            <span>Confidence (10-90%):</span>
                            <span className="font-mono">{pt.confidence_lower} – {pt.confidence_upper} kW</span>
                          </div>
                        )}
                        {showDemand && (
                          <div className="flex justify-between gap-4 text-indigo-700 pt-1 border-t">
                            <span>Predicted Demand:</span>
                            <span className="font-mono font-bold">{pt.forecast_demand} kW</span>
                          </div>
                        )}
                        <div className="text-[10px] text-slate-400 pt-1 mt-1 border-t flex gap-3">
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
              wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
              iconType="circle"
            />

            {/* Confidence Interval Band */}
            {showConfidence && (
              <Area
                type="monotone"
                dataKey="confidence_upper"
                stroke="none"
                fill="#38bdf8"
                fillOpacity={0.15}
                name="Confidence Range (90%)"
              />
            )}
            {showConfidence && (
              <Area
                type="monotone"
                dataKey="confidence_lower"
                stroke="none"
                fill="#ffffff"
                fillOpacity={1.0}
                name="Confidence Range (10%)"
              />
            )}

            {/* Forecast Solar Generation */}
            <Line
              type="monotone"
              dataKey="forecast_generation"
              stroke="#0284c7"
              strokeWidth={2.5}
              dot={false}
              name="Forecast Solar (kW)"
            />

            {/* Actual Solar Generation */}
            <Line
              type="monotone"
              dataKey="actual_generation"
              stroke="#059669"
              strokeWidth={2.5}
              strokeDasharray="4 4"
              dot={{ r: 3, fill: '#059669' }}
              name="Actual Solar (kW)"
              connectNulls={false}
            />

            {/* Industrial Demand Curve */}
            {showDemand && (
              <Line
                type="monotone"
                dataKey="forecast_demand"
                stroke="#6366f1"
                strokeWidth={2}
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

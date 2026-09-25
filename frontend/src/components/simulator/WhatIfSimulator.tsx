import React, { useState } from 'react';
import { WhatIfSimulationParams, SimulationResult, PredefinedScenario } from '@/types';
import { 
  SlidersHorizontal, 
  Play, 
  ArrowRight, 
  TrendingDown, 
  Sparkles, 
  Zap, 
  Sun, 
  Layers, 
  CheckCircle2,
  Info
} from 'lucide-react';
import clsx from 'clsx';

interface WhatIfSimulatorProps {
  scenarios: PredefinedScenario[];
  onRunSimulation: (params: WhatIfSimulationParams) => Promise<void>;
  currentResult: SimulationResult | null;
  isLoading: boolean;
}

export const WhatIfSimulator: React.FC<WhatIfSimulatorProps> = ({
  scenarios,
  onRunSimulation,
  currentResult,
  isLoading
}) => {
  const [params, setParams] = useState<WhatIfSimulationParams>({
    renewable_multiplier: 1.0,
    demand_multiplier: 1.0,
    initial_battery_soc: 65.0,
    tariff_multiplier: 1.0,
    grid_limit_kw: 500.0,
    battery_reserve_pct: 20.0,
    load_flexibility_pct: 15.0
  });

  const handleApplyScenario = (sc: PredefinedScenario) => {
    setParams(sc.params);
    onRunSimulation(sc.params);
  };

  const handleRun = () => {
    onRunSimulation(params);
  };

  return (
    <div className="space-y-6">
      {/* Predefined Scenarios Carousel / Badges */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-sky-600" />
              Predefined Industrial Stress Scenarios
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Instant one-click stress tests modeling extreme weather, market tariffs, and plant surges
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {scenarios.map((sc) => (
            <button
              key={sc.id}
              onClick={() => handleApplyScenario(sc)}
              className="text-left p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-sky-50/60 hover:border-sky-300 transition-all group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-slate-700 border border-slate-200 uppercase tracking-wider group-hover:border-sky-200">
                  {sc.tag}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-sky-600 group-hover:translate-x-0.5 transition-all" />
              </div>
              <h3 className="text-xs font-bold text-slate-800 group-hover:text-sky-900 mb-1">
                {sc.name}
              </h3>
              <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                {sc.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Parameter Controls */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-sky-600" />
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Interactive What-If Simulation Knobs
            </h2>
          </div>

          <button
            onClick={handleRun}
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-2.5 bg-sky-600 hover:bg-sky-700 disabled:bg-slate-300 text-white text-xs font-bold rounded-xl shadow-sm shadow-sky-600/20 transition-all cursor-pointer"
          >
            <Play className={`w-4 h-4 fill-white ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'Simulating Dispatch...' : 'Run Simulation'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
          {/* Renewable Multiplier */}
          <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/70">
            <div className="flex justify-between mb-1.5">
              <span className="text-slate-600 font-semibold">Renewable Generation</span>
              <span className="font-mono font-bold text-emerald-700">{(params.renewable_multiplier * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="2.0"
              step="0.1"
              value={params.renewable_multiplier}
              onChange={(e) => setParams({ ...params, renewable_multiplier: Number(e.target.value) })}
              className="w-full accent-emerald-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>20% (Heavy Clouds)</span>
              <span>200% (High Solar)</span>
            </div>
          </div>

          {/* Demand Multiplier */}
          <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/70">
            <div className="flex justify-between mb-1.5">
              <span className="text-slate-600 font-semibold">Industrial Demand</span>
              <span className="font-mono font-bold text-slate-900">{(params.demand_multiplier * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="1.8"
              step="0.05"
              value={params.demand_multiplier}
              onChange={(e) => setParams({ ...params, demand_multiplier: Number(e.target.value) })}
              className="w-full accent-sky-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>50% (Ramp-down)</span>
              <span>180% (Surge)</span>
            </div>
          </div>

          {/* Initial Battery SOC */}
          <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/70">
            <div className="flex justify-between mb-1.5">
              <span className="text-slate-600 font-semibold">Initial Battery SOC</span>
              <span className="font-mono font-bold text-indigo-700">{params.initial_battery_soc}%</span>
            </div>
            <input
              type="range"
              min="15"
              max="95"
              step="5"
              value={params.initial_battery_soc}
              onChange={(e) => setParams({ ...params, initial_battery_soc: Number(e.target.value) })}
              className="w-full accent-indigo-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>15% (Low)</span>
              <span>95% (Full)</span>
            </div>
          </div>

          {/* Tariff Multiplier */}
          <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/70">
            <div className="flex justify-between mb-1.5">
              <span className="text-slate-600 font-semibold">Grid Tariff Scale</span>
              <span className="font-mono font-bold text-amber-700">{(params.tariff_multiplier * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.5"
              step="0.1"
              value={params.tariff_multiplier}
              onChange={(e) => setParams({ ...params, tariff_multiplier: Number(e.target.value) })}
              className="w-full accent-amber-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>50% (Subsidy)</span>
              <span>250% (Crisis Spike)</span>
            </div>
          </div>
        </div>

        {/* Notice of Simulation Estimate */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5" />
            <span>Clearly labeled as a <strong>simulation estimate</strong> based on mathematical optimization constraints.</span>
          </div>
          <span>CBC MILP Solver Engine</span>
        </div>
      </div>

      {/* Side-by-Side Comparison: BEFORE vs AFTER */}
      {currentResult && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Optimization Impact Comparison
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Uncoordinated Baseline Dispatch vs. ENERGIQ AI Orchestrated Dispatch
              </p>
            </div>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold">
              {currentResult.comparison.savings_pct}% Energy Cost Saved
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* BEFORE (Baseline) */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-200">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Before Optimization (Baseline)
                </span>
                <span className="text-[10px] font-semibold text-slate-400">Uncoordinated Grid Feed</span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Electricity Cost:</span>
                  <strong className="font-mono text-sm text-slate-800">
                    ₹{currentResult.baseline.total_cost.toLocaleString()}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Peak Substation Import:</span>
                  <strong className="font-mono text-slate-800">
                    {currentResult.baseline.peak_grid_kw} kW
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Renewable Energy Utilized:</span>
                  <span className="font-mono text-slate-700">
                    {currentResult.baseline.renewable_utilization_pct}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Renewable Curtailment:</span>
                  <span className="font-mono text-rose-600 font-semibold">
                    {currentResult.baseline.curtailment_kwh} kWh
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">BESS Cycles Utilization:</span>
                  <span className="font-mono text-slate-700">
                    {currentResult.baseline.battery_cycles} Cycles (Underutilized)
                  </span>
                </div>
              </div>
            </div>

            {/* AFTER (AI Optimized) */}
            <div className="p-5 rounded-2xl border-2 border-sky-300 bg-sky-50/30 shadow-xs">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-sky-200/60">
                <span className="text-xs font-bold uppercase tracking-wider text-sky-800 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                  After ENERGIQ Optimization
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Feasibility Guaranteed
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-600">Total Electricity Cost:</span>
                  <strong className="font-mono text-sm text-emerald-700">
                    ₹{currentResult.optimized.total_cost.toLocaleString()}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Peak Substation Import:</span>
                  <strong className="font-mono text-sky-800">
                    {currentResult.optimized.peak_grid_kw} kW
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Renewable Energy Utilized:</span>
                  <strong className="font-mono text-emerald-700">
                    {currentResult.optimized.renewable_utilization_pct}%
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Renewable Curtailment:</span>
                  <strong className="font-mono text-emerald-700">
                    {currentResult.optimized.curtailment_kwh} kWh (Zero Waste)
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">BESS Cycles Utilization:</span>
                  <span className="font-mono text-slate-800 font-semibold">
                    {currentResult.optimized.battery_cycles} Cycles (Arbitrage Active)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quantified Gain Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-5 border-t border-slate-100 text-center">
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">Net Cost Saved</span>
              <span className="text-lg font-extrabold font-mono text-emerald-700 mt-1 block">
                ₹{currentResult.comparison.cost_saved.toLocaleString()}
              </span>
            </div>
            <div className="p-3 bg-sky-50 rounded-xl border border-sky-100">
              <span className="text-[10px] font-bold text-sky-800 uppercase tracking-wider block">Peak Demand Shaved</span>
              <span className="text-lg font-extrabold font-mono text-sky-700 mt-1 block">
                {currentResult.comparison.peak_shaved_kw} kW
              </span>
            </div>
            <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100">
              <span className="text-[10px] font-bold text-indigo-800 uppercase tracking-wider block">Renewable Recovered</span>
              <span className="text-lg font-extrabold font-mono text-indigo-700 mt-1 block">
                {currentResult.comparison.renewable_recovered_kwh} kWh
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">Production Target</span>
              <span className="text-sm font-bold text-slate-800 mt-1.5 block">
                {currentResult.comparison.feasibility}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

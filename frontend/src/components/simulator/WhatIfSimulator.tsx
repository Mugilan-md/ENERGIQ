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
  Info,
  Sliders,
  BatteryCharging,
  IndianRupee,
  ShieldCheck
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
      <div className="card-tilt bg-slate-900/80 light:bg-white rounded-2xl border border-slate-800/90 light:border-slate-200 p-6 shadow-2xl shadow-black/30 backdrop-blur-2xl relative overflow-hidden transition-colors">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500" />

        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-purple-500/15 text-purple-400 border border-purple-500/30 shadow-sm">
                <Sparkles className="w-5 h-5 animate-pulse-glow" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-white light:text-slate-900 tracking-tight">
                  Predefined Industrial Stress Scenarios
                </h2>
                <p className="text-xs text-slate-400 light:text-slate-500 mt-0.5">
                  Instant one-click stress tests modeling extreme weather, market tariffs, and plant surges
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {scenarios.map((sc) => (
            <button
              key={sc.id}
              onClick={() => handleApplyScenario(sc)}
              className="text-left p-4 rounded-xl border border-slate-800/80 light:border-slate-200 bg-slate-950/60 light:bg-slate-50/70 hover:bg-purple-950/30 light:hover:bg-purple-50/80 hover:border-purple-500/50 light:hover:border-purple-300 transition-all group cursor-pointer shadow-xs"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-400 border border-purple-500/30 uppercase tracking-wider group-hover:border-purple-400/50 font-mono">
                  {sc.tag}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="text-xs font-bold text-slate-100 light:text-slate-800 group-hover:text-purple-300 light:group-hover:text-purple-900 mb-1">
                {sc.name}
              </h3>
              <p className="text-[11px] text-slate-400 light:text-slate-500 line-clamp-2 leading-relaxed">
                {sc.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Parameter Knobs */}
      <div className="card-tilt bg-slate-900/80 light:bg-white rounded-2xl border border-slate-800/90 light:border-slate-200 p-6 shadow-2xl shadow-black/30 backdrop-blur-2xl relative overflow-hidden transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-sm">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white light:text-slate-900 tracking-tight">
                Parametric What-If Simulation Knobs
              </h2>
              <p className="text-xs text-slate-400 light:text-slate-500 mt-0.5">
                Simulate weather anomalies, peak tariff spikes, and production load flexibilities
              </p>
            </div>
          </div>

          <button
            onClick={handleRun}
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 disabled:from-slate-700 disabled:to-slate-800 text-white text-xs font-extrabold rounded-xl shadow-lg shadow-purple-600/25 transition-all cursor-pointer hover:scale-102"
          >
            <Play className={`w-4 h-4 fill-white ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'Simulating Dispatch...' : 'Run Simulation'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* Renewable Multiplier */}
          <div className="p-4 bg-slate-950/60 light:bg-slate-50 rounded-xl border border-slate-800/80 light:border-slate-200">
            <div className="flex justify-between mb-2 font-mono">
              <span className="text-slate-400 light:text-slate-600 font-sans font-semibold">Renewable Output</span>
              <span className="font-bold text-emerald-400 light:text-emerald-700">{(params.renewable_multiplier * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="2.0"
              step="0.1"
              value={params.renewable_multiplier}
              onChange={(e) => setParams({ ...params, renewable_multiplier: Number(e.target.value) })}
              className="w-full accent-emerald-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1.5 font-mono">
              <span>20% (Heavy Cloud)</span>
              <span>200% (High Solar)</span>
            </div>
          </div>

          {/* Demand Multiplier */}
          <div className="p-4 bg-slate-950/60 light:bg-slate-50 rounded-xl border border-slate-800/80 light:border-slate-200">
            <div className="flex justify-between mb-2 font-mono">
              <span className="text-slate-400 light:text-slate-600 font-sans font-semibold">Industrial Demand</span>
              <span className="font-bold text-cyan-400 light:text-cyan-700">{(params.demand_multiplier * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="1.8"
              step="0.05"
              value={params.demand_multiplier}
              onChange={(e) => setParams({ ...params, demand_multiplier: Number(e.target.value) })}
              className="w-full accent-cyan-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1.5 font-mono">
              <span>50% (Ramp)</span>
              <span>180% (Overdrive)</span>
            </div>
          </div>

          {/* Initial Battery SOC */}
          <div className="p-4 bg-slate-950/60 light:bg-slate-50 rounded-xl border border-slate-800/80 light:border-slate-200">
            <div className="flex justify-between mb-2 font-mono">
              <span className="text-slate-400 light:text-slate-600 font-sans font-semibold">Initial BESS SOC</span>
              <span className="font-bold text-indigo-400 light:text-indigo-700">{params.initial_battery_soc}%</span>
            </div>
            <input
              type="range"
              min="15"
              max="95"
              step="5"
              value={params.initial_battery_soc}
              onChange={(e) => setParams({ ...params, initial_battery_soc: Number(e.target.value) })}
              className="w-full accent-indigo-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1.5 font-mono">
              <span>15% (Depleted)</span>
              <span>95% (Fully Charged)</span>
            </div>
          </div>

          {/* Tariff Multiplier */}
          <div className="p-4 bg-slate-950/60 light:bg-slate-50 rounded-xl border border-slate-800/80 light:border-slate-200">
            <div className="flex justify-between mb-2 font-mono">
              <span className="text-slate-400 light:text-slate-600 font-sans font-semibold">Tariff Scale Factor</span>
              <span className="font-bold text-amber-400 light:text-amber-700">{(params.tariff_multiplier * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.5"
              step="0.1"
              value={params.tariff_multiplier}
              onChange={(e) => setParams({ ...params, tariff_multiplier: Number(e.target.value) })}
              className="w-full accent-amber-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1.5 font-mono">
              <span>50% (Off-Peak)</span>
              <span>250% (Critical Spike)</span>
            </div>
          </div>
        </div>

        {/* Notice of Simulation Estimate */}
        <div className="mt-4 pt-3 border-t border-slate-800/60 light:border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <div className="flex items-center gap-1.5 font-sans">
            <Info className="w-3.5 h-3.5 text-cyan-400" />
            <span>Simulation estimate calculated using CBC mixed-integer programming solver.</span>
          </div>
          <span>CBC Engine Active</span>
        </div>
      </div>

      {/* Side-by-Side Comparison: BEFORE vs AFTER */}
      {currentResult && (
        <div className="card-tilt bg-slate-900/80 light:bg-white rounded-2xl border border-slate-800/90 light:border-slate-200 p-6 shadow-2xl shadow-black/30 backdrop-blur-2xl relative transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h3 className="text-base font-extrabold text-white light:text-slate-900 tracking-tight">
                Simulated Impact Verification: Baseline vs. Optimized
              </h3>
              <p className="text-xs text-slate-400 light:text-slate-500 mt-0.5">
                Uncoordinated Baseline Feed vs. ENERGIQ Autonomous Decision Engine
              </p>
            </div>
            <span className="px-3.5 py-1.5 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold font-mono">
              {currentResult.comparison.savings_pct}% Cost Reduction
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* BEFORE (Baseline) */}
            <div className="card-tilt-subtle p-5 rounded-2xl border border-slate-800 light:border-slate-200 bg-slate-950/60 light:bg-slate-50/60">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800 light:border-slate-200">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                  Before Optimization (Baseline)
                </span>
                <span className="text-[10px] font-semibold text-slate-500 font-mono">Uncoordinated Grid Feed</span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Total Electricity Cost:</span>
                  <strong className="font-mono text-sm text-slate-200 light:text-slate-800">
                    ₹{currentResult.baseline.total_cost.toLocaleString()}
                  </strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Peak Substation Import:</span>
                  <strong className="font-mono text-slate-200 light:text-slate-800">
                    {currentResult.baseline.peak_grid_kw} kW
                  </strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Renewable Energy Utilized:</span>
                  <span className="font-mono text-slate-300 light:text-slate-700">
                    {currentResult.baseline.renewable_utilization_pct}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Renewable Curtailment:</span>
                  <span className="font-mono text-rose-400 font-semibold">
                    {currentResult.baseline.curtailment_kwh} kWh
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">BESS Cycles Utilization:</span>
                  <span className="font-mono text-slate-400">
                    {currentResult.baseline.battery_cycles} Cycles (Underutilized)
                  </span>
                </div>
              </div>
            </div>

            {/* AFTER (AI Optimized) */}
            <div className="card-tilt-subtle p-5 rounded-2xl border-2 border-cyan-500/60 light:border-cyan-400 bg-cyan-950/20 light:bg-cyan-50/40 shadow-lg shadow-cyan-500/10">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-cyan-500/30">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-300 light:text-cyan-800 flex items-center gap-1.5 font-mono">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  After ENERGIQ Optimization
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono">
                  Feasibility Guaranteed
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300 light:text-slate-700">Total Electricity Cost:</span>
                  <strong className="font-mono text-sm text-emerald-400 light:text-emerald-700">
                    ₹{currentResult.optimized.total_cost.toLocaleString()}
                  </strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300 light:text-slate-700">Peak Substation Import:</span>
                  <strong className="font-mono text-cyan-300 light:text-cyan-800">
                    {currentResult.optimized.peak_grid_kw} kW
                  </strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300 light:text-slate-700">Renewable Energy Utilized:</span>
                  <strong className="font-mono text-emerald-400 light:text-emerald-700">
                    {currentResult.optimized.renewable_utilization_pct}%
                  </strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300 light:text-slate-700">Renewable Curtailment:</span>
                  <strong className="font-mono text-emerald-400 light:text-emerald-700">
                    {currentResult.optimized.curtailment_kwh} kWh (Zero Waste)
                  </strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300 light:text-slate-700">BESS Cycles Utilization:</span>
                  <span className="font-mono text-slate-100 light:text-slate-800 font-semibold">
                    {currentResult.optimized.battery_cycles} Cycles (Arbitrage Active)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quantified Gain Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-5 border-t border-slate-800/60 light:border-slate-100 text-center">
            <div className="p-4 bg-emerald-950/40 light:bg-emerald-50 rounded-xl border border-emerald-800/50 light:border-emerald-100">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block font-mono">Net Cost Saved</span>
              <span className="text-xl font-black font-mono text-emerald-300 light:text-emerald-700 mt-1 block">
                ₹{currentResult.comparison.cost_saved.toLocaleString()}
              </span>
            </div>
            <div className="p-4 bg-cyan-950/40 light:bg-sky-50 rounded-xl border border-cyan-800/50 light:border-sky-100">
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block font-mono">Peak Demand Shaved</span>
              <span className="text-xl font-black font-mono text-cyan-300 light:text-sky-700 mt-1 block">
                {currentResult.comparison.peak_shaved_kw} kW
              </span>
            </div>
            <div className="p-4 bg-indigo-950/40 light:bg-indigo-50 rounded-xl border border-indigo-800/50 light:border-indigo-100">
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block font-mono">Renewable Recovered</span>
              <span className="text-xl font-black font-mono text-indigo-300 light:text-indigo-700 mt-1 block">
                {currentResult.comparison.renewable_recovered_kwh} kWh
              </span>
            </div>
            <div className="p-4 bg-slate-950/40 light:bg-slate-50 rounded-xl border border-slate-800/70 light:border-slate-200/80">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Production Target</span>
              <span className="text-sm font-bold text-slate-200 light:text-slate-800 mt-1.5 block">
                {currentResult.comparison.feasibility}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { EnergyFlowData } from '@/types';
import { 
  Sun, 
  Battery, 
  Zap, 
  Factory, 
  AlertCircle, 
  ArrowRight, 
  Activity, 
  ShieldCheck, 
  Gauge, 
  Radio,
  Sparkles,
  Info
} from 'lucide-react';
import clsx from 'clsx';

interface EnergyFlowDiagramProps {
  data: EnergyFlowData;
}

export const EnergyFlowDiagram: React.FC<EnergyFlowDiagramProps> = ({ data }) => {
  const { flows } = data;
  const [activeNode, setActiveNode] = useState<string | null>(null);

  // Power balance check
  const totalIn = data.total_renewable + data.grid_import + (data.battery_power > 0 ? data.battery_power : 0);
  const totalOut = data.total_demand + (data.battery_power < 0 ? Math.abs(data.battery_power) : 0) + data.curtailment;
  const isBalanced = Math.abs(totalIn - totalOut) < 1.0;

  return (
    <div className="bg-slate-900/80 light:bg-white rounded-2xl border border-slate-800/90 light:border-slate-200 p-6 shadow-2xl shadow-black/30 light:shadow-slate-200/50 backdrop-blur-2xl relative overflow-hidden transition-colors">
      {/* Background Cyber Grid Accent */}
      <div className="absolute inset-0 bg-cyber-grid opacity-35 pointer-events-none" />

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 relative z-10">
        <div>
          <h2 className="text-base font-extrabold text-white light:text-slate-900 tracking-tight flex items-center gap-2.5">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
            </span>
            <span>Live Industrial Energy Flow Topology</span>
            <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 uppercase">
              SCADA Synchronized
            </span>
          </h2>
          <p className="text-xs text-slate-400 light:text-slate-500 mt-1">
            Dynamic nodal dispatch routing: Solar PV array, BESS energy buffer, Substation import, and Factory workcells
          </p>
        </div>

        <div className="flex items-center gap-2.5 text-xs font-mono font-bold">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 text-emerald-400 light:bg-emerald-50 light:text-emerald-700 border border-emerald-500/25 light:border-emerald-200 rounded-xl shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Gen: {data.total_renewable.toFixed(1)} kW</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500/10 text-cyan-400 light:bg-sky-50 light:text-sky-700 border border-cyan-500/25 light:border-sky-200 rounded-xl shadow-xs">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>Demand: {data.total_demand.toFixed(1)} kW</span>
          </div>
          <div className={clsx(
            "hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-[11px]",
            isBalanced ? "bg-emerald-950/40 text-emerald-300 border-emerald-800/40" : "bg-amber-950/40 text-amber-300 border-amber-800/40"
          )}>
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{isBalanced ? "Busbar Balanced" : "Transient Sync"}</span>
          </div>
        </div>
      </div>

      {/* SVG Canvas with Glowing Animated Energy Conduits */}
      <div className="relative w-full overflow-x-auto py-2 z-10 select-none">
        <div className="min-w-[800px] max-w-[940px] mx-auto relative h-80">
          <svg className="w-full h-full" viewBox="0 0 900 320" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="solarToHubGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
              <linearGradient id="gridToHubGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
              <linearGradient id="batToHubGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
              <linearGradient id="hubToLoadsGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
              
              {/* Glow filter */}
              <filter id="glowFilter" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Base Wireframe Conduits */}
            {/* Solar -> Hub */}
            <path d="M 230 80 C 330 80, 360 160, 400 160" stroke="rgba(255,255,255,0.06)" strokeWidth="8" strokeLinecap="round" />
            {flows.renewable_to_load + flows.renewable_to_battery > 0 && (
              <>
                <path d="M 230 80 C 330 80, 360 160, 400 160" stroke="#10b981" strokeWidth="8" opacity="0.3" filter="url(#glowFilter)" strokeLinecap="round" />
                <path d="M 230 80 C 330 80, 360 160, 400 160" stroke="url(#solarToHubGrad)" strokeWidth="4.5" strokeDasharray="10 6" className="animate-flow-dash" strokeLinecap="round" />
              </>
            )}

            {/* Grid -> Hub */}
            <path d="M 230 240 C 330 240, 360 160, 400 160" stroke="rgba(255,255,255,0.06)" strokeWidth="8" strokeLinecap="round" />
            {flows.grid_to_load > 0 && (
              <>
                <path d="M 230 240 C 330 240, 360 160, 400 160" stroke="#f59e0b" strokeWidth="8" opacity="0.3" filter="url(#glowFilter)" strokeLinecap="round" />
                <path d="M 230 240 C 330 240, 360 160, 400 160" stroke="url(#gridToHubGrad)" strokeWidth="4.5" strokeDasharray="10 6" className="animate-flow-dash" strokeLinecap="round" />
              </>
            )}

            {/* Battery <-> Hub */}
            <path d="M 450 65 L 450 115" stroke="rgba(255,255,255,0.06)" strokeWidth="8" strokeLinecap="round" />
            {flows.battery_to_load > 0 && (
              <>
                <path d="M 450 65 L 450 115" stroke="#8b5cf6" strokeWidth="8" opacity="0.3" filter="url(#glowFilter)" strokeLinecap="round" />
                <path d="M 450 65 L 450 115" stroke="#8b5cf6" strokeWidth="4.5" strokeDasharray="8 6" className="animate-flow-dash" strokeLinecap="round" />
              </>
            )}
            {flows.renewable_to_battery > 0 && (
              <path d="M 450 115 L 450 65" stroke="#10b981" strokeWidth="4.5" strokeDasharray="8 6" className="animate-flow-dash" strokeLinecap="round" />
            )}

            {/* Hub -> Industrial Loads */}
            <path d="M 500 160 L 660 160" stroke="rgba(255,255,255,0.06)" strokeWidth="10" strokeLinecap="round" />
            <path d="M 500 160 L 660 160" stroke="#06b6d4" strokeWidth="10" opacity="0.25" filter="url(#glowFilter)" strokeLinecap="round" />
            <path d="M 500 160 L 660 160" stroke="url(#hubToLoadsGrad)" strokeWidth="6" strokeDasharray="12 6" className="animate-flow-dash" strokeLinecap="round" />

            {/* Curtailment Spill Path */}
            {flows.renewable_to_curtailment > 0 && (
              <path d="M 150 40 L 150 12" stroke="#f43f5e" strokeWidth="3" strokeDasharray="5 5" className="animate-flow-dash" strokeLinecap="round" />
            )}
          </svg>

          {/* Node 1: Renewable Solar / Wind (Top Left) */}
          <div
            onMouseEnter={() => setActiveNode('solar')}
            onMouseLeave={() => setActiveNode(null)}
            className="absolute top-6 left-2 w-56 bg-slate-900/90 light:bg-white rounded-2xl p-4 border border-emerald-500/40 light:border-emerald-200 shadow-xl shadow-black/45 backdrop-blur-xl group hover:border-emerald-400 hover:scale-102 transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 bg-emerald-500/15 light:bg-emerald-50 text-emerald-400 light:text-emerald-600 rounded-xl border border-emerald-500/30 shadow-sm">
                  <Sun className="w-5 h-5 animate-spin-slow" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white light:text-slate-900 tracking-tight">Renewable Solar</h4>
                  <span className="text-[10px] font-mono text-slate-400">650 kWp PV Array</span>
                </div>
              </div>
              <span className="text-sm font-mono font-extrabold text-emerald-400 light:text-emerald-600 tabular-nums">
                {data.total_renewable.toFixed(0)} <span className="text-[10px] font-normal">kW</span>
              </span>
            </div>
            {flows.renewable_to_curtailment > 0 && (
              <div className="mt-2 text-[10px] bg-rose-500/15 light:bg-rose-50 text-rose-300 light:text-rose-700 px-2.5 py-1 rounded-lg border border-rose-500/30 flex items-center justify-between font-mono">
                <span>Curtailed Spill:</span>
                <strong>{flows.renewable_to_curtailment.toFixed(1)} kW</strong>
              </div>
            )}
          </div>

          {/* Node 2: Grid Substation (Bottom Left) */}
          <div
            onMouseEnter={() => setActiveNode('grid')}
            onMouseLeave={() => setActiveNode(null)}
            className="absolute top-48 left-2 w-56 bg-slate-900/90 light:bg-white rounded-2xl p-4 border border-amber-500/40 light:border-amber-200 shadow-xl shadow-black/45 backdrop-blur-xl group hover:border-amber-400 hover:scale-102 transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 bg-amber-500/15 light:bg-amber-50 text-amber-400 light:text-amber-600 rounded-xl border border-amber-500/30 shadow-sm">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white light:text-slate-900 tracking-tight">Grid Substation</h4>
                  <span className="text-[10px] font-mono text-slate-400">11 kV Utility Feeder</span>
                </div>
              </div>
              <span className="text-sm font-mono font-extrabold text-amber-400 light:text-amber-600 tabular-nums">
                {data.grid_import.toFixed(0)} <span className="text-[10px] font-normal">kW</span>
              </span>
            </div>
            <div className="mt-2.5 text-[10px] font-mono text-slate-400 light:text-slate-500 flex justify-between pt-1.5 border-t border-slate-800/80 light:border-slate-100">
              <span>Cap: 500 kW</span>
              <span className="text-slate-300 light:text-slate-700 font-semibold">Margin: {(500 - data.grid_import).toFixed(0)} kW</span>
            </div>
          </div>

          {/* Node 3: Battery Energy Storage BESS (Top Center) */}
          <div
            onMouseEnter={() => setActiveNode('battery')}
            onMouseLeave={() => setActiveNode(null)}
            className="absolute -top-3 left-[350px] w-54 bg-slate-900/90 light:bg-white rounded-2xl p-3.5 border border-purple-500/40 light:border-indigo-200 shadow-xl shadow-black/45 backdrop-blur-xl group hover:border-purple-400 hover:scale-102 transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-purple-500/15 light:bg-indigo-50 text-purple-400 light:text-indigo-600 rounded-xl border border-purple-500/30 shadow-sm">
                  <Battery className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white light:text-slate-900 tracking-tight">BESS System</h4>
                  <span className="text-[10px] font-mono text-slate-400">800 kWh LFP Storage</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-mono font-extrabold text-purple-400 light:text-indigo-600">
                  {data.battery_soc}%
                </div>
                <div className="text-[10px] font-mono text-slate-400 font-semibold">
                  {data.battery_power < 0 ? `+${Math.abs(data.battery_power).toFixed(0)} kW` : data.battery_power > 0 ? `-${data.battery_power.toFixed(0)} kW` : 'Idle'}
                </div>
              </div>
            </div>
          </div>

          {/* Node 4: Central Energy Hub (Center Busbar) */}
          <div
            onMouseEnter={() => setActiveNode('hub')}
            onMouseLeave={() => setActiveNode(null)}
            className="absolute top-[120px] left-[375px] w-38 bg-gradient-to-b from-cyan-950/90 to-slate-900/95 light:from-sky-50 light:to-white rounded-2xl p-3.5 border-2 border-cyan-400/90 light:border-sky-400 shadow-2xl shadow-cyan-500/30 text-center backdrop-blur-2xl hover:scale-105 transition-all cursor-pointer"
          >
            <div className="flex items-center justify-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest text-cyan-300 light:text-sky-700 font-mono">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              Main Busbar
            </div>
            <div className="text-xl font-black font-mono text-white light:text-slate-900 mt-1 tracking-tight">
              415 V
            </div>
            <div className="text-[10px] font-mono text-cyan-400 light:text-sky-600 font-bold mt-0.5">
              50.0 Hz • Phase A/B/C
            </div>
          </div>

          {/* Node 5: Industrial Factory Loads (Right) */}
          <div
            onMouseEnter={() => setActiveNode('loads')}
            onMouseLeave={() => setActiveNode(null)}
            className="absolute top-24 right-2 w-60 bg-slate-900/90 light:bg-white rounded-2xl p-4 border border-cyan-500/40 light:border-sky-200 shadow-xl shadow-black/45 backdrop-blur-xl group hover:border-cyan-400 hover:scale-102 transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 bg-cyan-500/15 light:bg-sky-50 text-cyan-400 light:text-sky-600 rounded-xl border border-cyan-500/30 shadow-sm">
                  <Factory className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white light:text-slate-900 tracking-tight">Industrial Facility</h4>
                  <span className="text-[10px] font-mono text-slate-400">6 Critical Workcells</span>
                </div>
              </div>
              <span className="text-base font-mono font-extrabold text-cyan-300 light:text-sky-700 tabular-nums">
                {data.total_demand.toFixed(0)} <span className="text-xs font-normal">kW</span>
              </span>
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-800/80 light:border-slate-100 flex items-center justify-between text-[10px]">
              <span className="text-slate-400">Production Feasibility</span>
              <span className="font-extrabold text-emerald-400 light:text-emerald-600 flex items-center gap-1 font-mono">
                <ShieldCheck className="w-3.5 h-3.5" /> 100% SATISFIED
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Numerical Routing Flow Breakdown Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-4 pt-4 border-t border-slate-800/80 light:border-slate-100 relative z-10">
        <div className="p-3.5 bg-slate-950/60 light:bg-slate-50 rounded-xl border border-slate-800/80 light:border-slate-200 hover:border-emerald-500/40 transition-colors group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Solar → Loads</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 opacity-60 group-hover:opacity-100" />
          </div>
          <div className="text-lg font-black font-mono text-emerald-400 light:text-emerald-700 mt-1 tabular-nums">
            {flows.renewable_to_load.toFixed(1)} <span className="text-xs font-normal text-slate-400">kW</span>
          </div>
        </div>

        <div className="p-3.5 bg-slate-950/60 light:bg-slate-50 rounded-xl border border-slate-800/80 light:border-slate-200 hover:border-purple-500/40 transition-colors group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Solar → BESS</span>
            <span className="w-2 h-2 rounded-full bg-purple-400 opacity-60 group-hover:opacity-100" />
          </div>
          <div className="text-lg font-black font-mono text-purple-400 light:text-indigo-700 mt-1 tabular-nums">
            {flows.renewable_to_battery.toFixed(1)} <span className="text-xs font-normal text-slate-400">kW</span>
          </div>
        </div>

        <div className="p-3.5 bg-slate-950/60 light:bg-slate-50 rounded-xl border border-slate-800/80 light:border-slate-200 hover:border-amber-500/40 transition-colors group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Grid → Loads</span>
            <span className="w-2 h-2 rounded-full bg-amber-400 opacity-60 group-hover:opacity-100" />
          </div>
          <div className="text-lg font-black font-mono text-amber-400 light:text-amber-700 mt-1 tabular-nums">
            {flows.grid_to_load.toFixed(1)} <span className="text-xs font-normal text-slate-400">kW</span>
          </div>
        </div>

        <div className="p-3.5 bg-slate-950/60 light:bg-slate-50 rounded-xl border border-slate-800/80 light:border-slate-200 hover:border-cyan-500/40 transition-colors group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">BESS → Loads</span>
            <span className="w-2 h-2 rounded-full bg-cyan-400 opacity-60 group-hover:opacity-100" />
          </div>
          <div className="text-lg font-black font-mono text-cyan-400 light:text-blue-700 mt-1 tabular-nums">
            {flows.battery_to_load.toFixed(1)} <span className="text-xs font-normal text-slate-400">kW</span>
          </div>
        </div>

        <div className="p-3.5 bg-slate-950/60 light:bg-slate-50 rounded-xl border border-slate-800/80 light:border-slate-200 hover:border-rose-500/40 transition-colors group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Curtailment</span>
            <span className="w-2 h-2 rounded-full bg-rose-400 opacity-60 group-hover:opacity-100" />
          </div>
          <div className="text-lg font-black font-mono text-rose-400 light:text-rose-700 mt-1 tabular-nums">
            {flows.renewable_to_curtailment.toFixed(1)} <span className="text-xs font-normal text-slate-400">kW</span>
          </div>
        </div>
      </div>
    </div>
  );
};

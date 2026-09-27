import React, { useState } from 'react';
import { EnergyFlowData } from '@/types';
import { 
  Sun, 
  Battery, 
  Zap, 
  Factory, 
  ShieldCheck
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
    <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 sm:p-5 shadow-sm relative overflow-hidden select-none">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-4 relative z-10">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-[#0F172A] tracking-tight flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]"></span>
            </span>
            <span>Live Industrial Energy Flow Topology</span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-sky-50 text-[#0EA5E9] border border-sky-200 uppercase">
              SCADA
            </span>
          </h2>
          <p className="text-[11px] text-[#64748B] mt-0.5 font-sans">
            Nodal dispatch routing: Solar PV array, BESS storage buffer, Substation import, and Factory workcells
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-mono font-semibold flex-wrap">
          <div className="flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
            <span>Solar: {data.total_renewable.toFixed(0)} kW</span>
          </div>
          <div className="flex items-center gap-1 px-2 py-0.5 bg-sky-50 text-[#0EA5E9] border border-sky-200 rounded-md text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0EA5E9] animate-pulse" />
            <span>Demand: {data.total_demand.toFixed(0)} kW</span>
          </div>
          <div className={clsx(
            "hidden md:flex items-center gap-1 px-2 py-0.5 rounded-md border text-[11px]",
            isBalanced ? "bg-slate-50 text-slate-700 border-slate-200" : "bg-amber-50 text-amber-700 border-amber-200"
          )}>
            <ShieldCheck className="w-3 h-3 text-[#10B981]" />
            <span>{isBalanced ? "Balanced" : "Transient"}</span>
          </div>
        </div>
      </div>

      {/* SVG Canvas with Clean Animated Energy Conduits - Fully Responsive, No Overflow */}
      <div className="relative w-full h-[290px] bg-[#F8FAFC] rounded-xl border border-slate-100 overflow-hidden select-none">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 290" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="solarToHubGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#0EA5E9" />
            </linearGradient>
            <linearGradient id="gridToHubGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#0EA5E9" />
            </linearGradient>
          </defs>

          {/* Base Neutral Conduits */}
          {/* Solar -> Hub */}
          <path d="M 175 70 C 225 70, 235 145, 255 145" stroke="#E2E8F0" strokeWidth="5" strokeLinecap="round" />
          {flows.renewable_to_load + flows.renewable_to_battery > 0 && (
            <path d="M 175 70 C 225 70, 235 145, 255 145" stroke="#10B981" strokeWidth="3" strokeDasharray="8 5" className="animate-flow-dash" strokeLinecap="round" />
          )}

          {/* Grid -> Hub */}
          <path d="M 175 220 C 225 220, 235 145, 255 145" stroke="#E2E8F0" strokeWidth="5" strokeLinecap="round" />
          {flows.grid_to_load > 0 && (
            <path d="M 175 220 C 225 220, 235 145, 255 145" stroke="#F59E0B" strokeWidth="3" strokeDasharray="8 5" className="animate-flow-dash" strokeLinecap="round" />
          )}

          {/* Battery <-> Hub */}
          <path d="M 300 55 L 300 110" stroke="#E2E8F0" strokeWidth="5" strokeLinecap="round" />
          {flows.battery_to_load > 0 && (
            <path d="M 300 55 L 300 110" stroke="#8B5CF6" strokeWidth="3" strokeDasharray="8 5" className="animate-flow-dash" strokeLinecap="round" />
          )}
          {flows.renewable_to_battery > 0 && (
            <path d="M 300 110 L 300 55" stroke="#10B981" strokeWidth="3" strokeDasharray="8 5" className="animate-flow-dash" strokeLinecap="round" />
          )}

          {/* Hub -> Industrial Loads */}
          <path d="M 345 145 L 420 145" stroke="#E2E8F0" strokeWidth="6" strokeLinecap="round" />
          <path d="M 345 145 L 420 145" stroke="#0EA5E9" strokeWidth="4" strokeDasharray="9 5" className="animate-flow-dash" strokeLinecap="round" />

          {/* Curtailment Spill Path */}
          {flows.renewable_to_curtailment > 0 && (
            <path d="M 90 35 L 90 10" stroke="#EF4444" strokeWidth="2" strokeDasharray="4 4" className="animate-flow-dash" strokeLinecap="round" />
          )}
        </svg>

        {/* Node 1: Renewable Solar (Top Left) */}
        <div
          onMouseEnter={() => setActiveNode('solar')}
          onMouseLeave={() => setActiveNode(null)}
          className="absolute top-3 left-2.5 w-[28%] min-w-[155px] max-w-[190px] bg-white rounded-xl p-2.5 border border-[#E2E8F0] shadow-xs hover:border-[#10B981] transition-all cursor-pointer z-10"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 overflow-hidden">
              <div className="p-1.5 bg-emerald-50 text-[#10B981] rounded-md border border-emerald-200 shrink-0">
                <Sun className="w-3.5 h-3.5" />
              </div>
              <div className="truncate">
                <h4 className="text-[11px] font-bold text-[#0F172A] tracking-tight truncate">Solar Gen</h4>
                <span className="text-[9px] font-mono text-[#64748B] block truncate">650 kWp Array</span>
              </div>
            </div>
            <span className="text-xs font-mono font-extrabold text-[#10B981] tabular-nums shrink-0 ml-1">
              {data.total_renewable.toFixed(0)} <span className="text-[9px] font-normal">kW</span>
            </span>
          </div>
          {flows.renewable_to_curtailment > 0 && (
            <div className="mt-1 text-[9px] bg-red-50 text-[#EF4444] px-1 py-0.2 rounded border border-red-200 flex items-center justify-between font-mono">
              <span>Curtailed:</span>
              <strong>{flows.renewable_to_curtailment.toFixed(0)} kW</strong>
            </div>
          )}
        </div>

        {/* Node 2: Grid Substation (Bottom Left) */}
        <div
          onMouseEnter={() => setActiveNode('grid')}
          onMouseLeave={() => setActiveNode(null)}
          className="absolute bottom-3 left-2.5 w-[28%] min-w-[155px] max-w-[190px] bg-white rounded-xl p-2.5 border border-[#E2E8F0] shadow-xs hover:border-[#F59E0B] transition-all cursor-pointer z-10"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 overflow-hidden">
              <div className="p-1.5 bg-amber-50 text-[#F59E0B] rounded-md border border-amber-200 shrink-0">
                <Zap className="w-3.5 h-3.5" />
              </div>
              <div className="truncate">
                <h4 className="text-[11px] font-bold text-[#0F172A] tracking-tight truncate">Grid Import</h4>
                <span className="text-[9px] font-mono text-[#64748B] block truncate">11 kV Feeder</span>
              </div>
            </div>
            <span className="text-xs font-mono font-extrabold text-[#F59E0B] tabular-nums shrink-0 ml-1">
              {data.grid_import.toFixed(0)} <span className="text-[9px] font-normal">kW</span>
            </span>
          </div>
          <div className="mt-1 text-[9px] font-mono text-[#64748B] flex justify-between pt-0.5 border-t border-slate-100">
            <span>500 kW Limit</span>
            <span className="text-slate-700 font-semibold">Margin: {(500 - data.grid_import).toFixed(0)} kW</span>
          </div>
        </div>

        {/* Node 3: Battery Energy Storage BESS (Top Center) */}
        <div
          onMouseEnter={() => setActiveNode('battery')}
          onMouseLeave={() => setActiveNode(null)}
          className="absolute top-2 left-1/2 -translate-x-1/2 w-[26%] min-w-[145px] max-w-[175px] bg-white rounded-xl p-2.5 border border-[#E2E8F0] shadow-xs hover:border-[#8B5CF6] transition-all cursor-pointer z-10"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 overflow-hidden">
              <div className="p-1.5 bg-purple-50 text-[#8B5CF6] rounded-md border border-purple-200 shrink-0">
                <Battery className="w-3.5 h-3.5" />
              </div>
              <div className="truncate">
                <h4 className="text-[11px] font-bold text-[#0F172A] tracking-tight truncate">BESS Storage</h4>
                <span className="text-[9px] font-mono text-[#64748B] block truncate">800 kWh LFP</span>
              </div>
            </div>
            <div className="text-right shrink-0 ml-1">
              <div className="text-xs font-mono font-extrabold text-[#8B5CF6]">
                {data.battery_soc}%
              </div>
              <div className="text-[9px] font-mono text-[#64748B] font-semibold">
                {data.battery_power < 0 ? `+${Math.abs(data.battery_power).toFixed(0)} kW` : data.battery_power > 0 ? `-${data.battery_power.toFixed(0)} kW` : 'Idle'}
              </div>
            </div>
          </div>
        </div>

        {/* Node 4: Central Energy Hub (Center Busbar) */}
        <div
          onMouseEnter={() => setActiveNode('hub')}
          onMouseLeave={() => setActiveNode(null)}
          className="absolute top-[115px] left-1/2 -translate-x-1/2 w-[20%] min-w-[115px] max-w-[135px] bg-white rounded-xl p-2 border-2 border-[#0EA5E9] shadow-xs text-center transition-all cursor-pointer z-10"
        >
          <div className="flex items-center justify-center gap-1 text-[8px] font-bold uppercase tracking-wider text-[#0EA5E9] font-mono">
            <span className="w-1 h-1 rounded-full bg-[#0EA5E9] animate-pulse" />
            Main Busbar
          </div>
          <div className="text-sm font-bold font-mono text-[#0F172A] mt-0.5">
            415 V
          </div>
          <div className="text-[8px] font-mono text-[#64748B]">
            50.0 Hz • 3-Phase
          </div>
        </div>

        {/* Node 5: Industrial Factory Loads (Right) */}
        <div
          onMouseEnter={() => setActiveNode('loads')}
          onMouseLeave={() => setActiveNode(null)}
          className="absolute top-22 right-2.5 w-[28%] min-w-[155px] max-w-[190px] bg-white rounded-xl p-2.5 border border-[#E2E8F0] shadow-xs hover:border-[#0EA5E9] transition-all cursor-pointer z-10"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 overflow-hidden">
              <div className="p-1.5 bg-sky-50 text-[#0EA5E9] rounded-md border border-sky-200 shrink-0">
                <Factory className="w-3.5 h-3.5" />
              </div>
              <div className="truncate">
                <h4 className="text-[11px] font-bold text-[#0F172A] tracking-tight truncate">Facility Demand</h4>
                <span className="text-[9px] font-mono text-[#64748B] block truncate">6 Workcells</span>
              </div>
            </div>
            <span className="text-xs font-mono font-extrabold text-[#0EA5E9] tabular-nums shrink-0 ml-1">
              {data.total_demand.toFixed(0)} <span className="text-[9px] font-normal">kW</span>
            </span>
          </div>
          <div className="mt-1 pt-0.5 border-t border-slate-100 flex items-center justify-between text-[8px] font-mono">
            <span className="text-[#64748B]">Status:</span>
            <span className="font-bold text-[#10B981] flex items-center gap-0.5">
              <ShieldCheck className="w-2.5 h-2.5" /> 100% OK
            </span>
          </div>
        </div>
      </div>

      {/* Numerical Routing Flow Breakdown Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 mt-3.5 pt-3.5 border-t border-[#E2E8F0] relative z-10">
        <div className="p-2 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-bold text-[#64748B] uppercase tracking-wider block font-mono">Solar → Loads</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
          </div>
          <div className="text-xs font-bold font-mono text-[#10B981] mt-0.5 tabular-nums">
            {flows.renewable_to_load.toFixed(1)} <span className="text-[9px] font-normal text-[#64748B]">kW</span>
          </div>
        </div>

        <div className="p-2 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-bold text-[#64748B] uppercase tracking-wider block font-mono">Solar → BESS</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]" />
          </div>
          <div className="text-xs font-bold font-mono text-[#8B5CF6] mt-0.5 tabular-nums">
            {flows.renewable_to_battery.toFixed(1)} <span className="text-[9px] font-normal text-[#64748B]">kW</span>
          </div>
        </div>

        <div className="p-2 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-bold text-[#64748B] uppercase tracking-wider block font-mono">Grid → Loads</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
          </div>
          <div className="text-xs font-bold font-mono text-[#F59E0B] mt-0.5 tabular-nums">
            {flows.grid_to_load.toFixed(1)} <span className="text-[9px] font-normal text-[#64748B]">kW</span>
          </div>
        </div>

        <div className="p-2 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-bold text-[#64748B] uppercase tracking-wider block font-mono">BESS → Loads</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#0EA5E9]" />
          </div>
          <div className="text-xs font-bold font-mono text-[#0EA5E9] mt-0.5 tabular-nums">
            {flows.battery_to_load.toFixed(1)} <span className="text-[9px] font-normal text-[#64748B]">kW</span>
          </div>
        </div>

        <div className="p-2 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-bold text-[#64748B] uppercase tracking-wider block font-mono">Curtailment</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
          </div>
          <div className="text-xs font-bold font-mono text-[#EF4444] mt-0.5 tabular-nums">
            {flows.renewable_to_curtailment.toFixed(1)} <span className="text-[9px] font-normal text-[#64748B]">kW</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnergyFlowDiagram;

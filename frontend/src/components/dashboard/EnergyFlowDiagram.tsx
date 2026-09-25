import React from 'react';
import { EnergyFlowData } from '@/types';
import { Sun, Battery, Zap, Factory, AlertCircle, ArrowRight } from 'lucide-react';
import clsx from 'clsx';

interface EnergyFlowDiagramProps {
  data: EnergyFlowData;
}

export const EnergyFlowDiagram: React.FC<EnergyFlowDiagramProps> = ({ data }) => {
  const { flows } = data;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-pulse" />
            Live Industrial Energy Flow Topology
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time multi-source generation routing, battery buffer, and load distribution
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono font-semibold">
          <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg">
            Generation: {data.total_renewable.toFixed(1)} kW
          </span>
          <span className="px-2.5 py-1 bg-sky-50 text-sky-700 border border-sky-200 rounded-lg">
            Demand: {data.total_demand.toFixed(1)} kW
          </span>
        </div>
      </div>

      {/* SVG Canvas with Animated Flow Pipes */}
      <div className="relative w-full overflow-x-auto py-2">
        <div className="min-w-[720px] max-w-[900px] mx-auto relative">
          <svg className="w-full h-80" viewBox="0 0 900 320" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="solarToHubGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#0ea5e9" />
              </linearGradient>
              <linearGradient id="gridToHubGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#0ea5e9" />
              </linearGradient>
              <linearGradient id="batToHubGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#0ea5e9" />
              </linearGradient>
            </defs>

            {/* Path: Solar PV (150, 70) -> Hub (450, 160) */}
            <path
              d="M 230 80 C 340 80, 360 160, 410 160"
              stroke="#e2e8f0"
              strokeWidth="5"
              strokeLinecap="round"
            />
            {flows.renewable_to_load + flows.renewable_to_battery > 0 && (
              <path
                d="M 230 80 C 340 80, 360 160, 410 160"
                stroke="url(#solarToHubGrad)"
                strokeWidth="4"
                strokeDasharray="8 6"
                className="animate-flow-dash"
                strokeLinecap="round"
              />
            )}

            {/* Path: Grid (150, 240) -> Hub (450, 160) */}
            <path
              d="M 230 240 C 340 240, 360 160, 410 160"
              stroke="#e2e8f0"
              strokeWidth="5"
              strokeLinecap="round"
            />
            {flows.grid_to_load > 0 && (
              <path
                d="M 230 240 C 340 240, 360 160, 410 160"
                stroke="url(#gridToHubGrad)"
                strokeWidth="4"
                strokeDasharray="8 6"
                className="animate-flow-dash"
                strokeLinecap="round"
              />
            )}

            {/* Path: Battery (450, 20) <-> Hub (450, 160) */}
            <path
              d="M 450 60 L 450 120"
              stroke="#e2e8f0"
              strokeWidth="5"
              strokeLinecap="round"
            />
            {flows.battery_to_load > 0 && (
              <path
                d="M 450 60 L 450 120"
                stroke="#6366f1"
                strokeWidth="4"
                strokeDasharray="8 6"
                className="animate-flow-dash"
                strokeLinecap="round"
              />
            )}
            {flows.renewable_to_battery > 0 && (
              <path
                d="M 450 120 L 450 60"
                stroke="#10b981"
                strokeWidth="4"
                strokeDasharray="8 6"
                className="animate-flow-dash"
                strokeLinecap="round"
              />
            )}

            {/* Path: Hub (450, 160) -> Industrial Loads (720, 160) */}
            <path
              d="M 490 160 L 670 160"
              stroke="#e2e8f0"
              strokeWidth="7"
              strokeLinecap="round"
            />
            <path
              d="M 490 160 L 670 160"
              stroke="#0ea5e9"
              strokeWidth="5"
              strokeDasharray="8 6"
              className="animate-flow-dash"
              strokeLinecap="round"
            />

            {/* Path: Solar -> Curtailment (Solar 150, 70 -> Curtailment 150, 0) */}
            {flows.renewable_to_curtailment > 0 && (
              <path
                d="M 150 40 L 150 10"
                stroke="#e11d48"
                strokeWidth="3"
                strokeDasharray="4 4"
                className="animate-flow-dash"
                strokeLinecap="round"
              />
            )}
          </svg>

          {/* Node: Renewable Solar/Wind (Top Left) */}
          <div className="absolute top-8 left-4 w-52 bg-white rounded-xl p-3.5 border border-emerald-200 shadow-md shadow-emerald-500/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                  <Sun className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Renewable Solar</h4>
                  <span className="text-[10px] text-slate-400">650 kWp PV + Wind</span>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-600">
                {data.total_renewable.toFixed(0)} kW
              </span>
            </div>
            {flows.renewable_to_curtailment > 0 && (
              <div className="mt-2 text-[10px] bg-rose-50 text-rose-700 px-2 py-0.5 rounded border border-rose-200 flex items-center justify-between">
                <span>Curtailment:</span>
                <strong>{flows.renewable_to_curtailment.toFixed(1)} kW</strong>
              </div>
            )}
          </div>

          {/* Node: Grid Substation (Bottom Left) */}
          <div className="absolute top-48 left-4 w-52 bg-white rounded-xl p-3.5 border border-amber-200 shadow-md shadow-amber-500/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Grid Substation</h4>
                  <span className="text-[10px] text-slate-400">11kV Import Line</span>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-amber-600">
                {data.grid_import.toFixed(0)} kW
              </span>
            </div>
            <div className="mt-2 text-[10px] text-slate-500 flex justify-between">
              <span>Cap Limit: 500 kW</span>
              <span>Headroom: {(500 - data.grid_import).toFixed(0)} kW</span>
            </div>
          </div>

          {/* Node: Battery Storage BESS (Top Center) */}
          <div className="absolute -top-3 left-[370px] w-48 bg-white rounded-xl p-3 border border-indigo-200 shadow-md shadow-indigo-500/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
                  <Battery className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">BESS Storage</h4>
                  <span className="text-[10px] text-slate-400">800 kWh LFP Rack</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-mono font-bold text-indigo-600">
                  {data.battery_soc}%
                </div>
                <div className="text-[10px] text-slate-500">
                  {data.battery_power < 0 ? `Chg: ${Math.abs(data.battery_power).toFixed(0)} kW` : data.battery_power > 0 ? `Dis: ${data.battery_power.toFixed(0)} kW` : 'Idle'}
                </div>
              </div>
            </div>
          </div>

          {/* Node: Central Energy Hub (Center) */}
          <div className="absolute top-[125px] left-[390px] w-32 bg-sky-50 rounded-2xl p-3 border-2 border-sky-300 shadow-lg shadow-sky-500/10 text-center">
            <div className="text-[10px] font-bold uppercase tracking-wider text-sky-700">Hub Busbar</div>
            <div className="text-base font-extrabold font-mono text-slate-900 mt-0.5">
              415 V
            </div>
            <div className="text-[10px] font-medium text-sky-600">50.0 Hz</div>
          </div>

          {/* Node: Industrial Factory Loads (Right) */}
          <div className="absolute top-28 right-4 w-56 bg-white rounded-xl p-4 border border-sky-200 shadow-md shadow-sky-500/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-sky-50 text-sky-600 rounded-lg">
                  <Factory className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Industrial Facility</h4>
                  <span className="text-[10px] text-slate-400">6 Active Workcells</span>
                </div>
              </div>
              <span className="text-sm font-mono font-extrabold text-sky-700">
                {data.total_demand.toFixed(0)} kW
              </span>
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
              <span>Production: 100% Satisfied</span>
              <span className="font-semibold text-emerald-600">Locked</span>
            </div>
          </div>
        </div>
      </div>

      {/* Numerical Routing Flow Breakdown Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-6 pt-4 border-t border-slate-100">
        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80">
          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">Renewable → Loads</span>
          <div className="text-sm font-bold font-mono text-emerald-700 mt-1">
            {flows.renewable_to_load.toFixed(1)} kW
          </div>
        </div>
        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80">
          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">Renewable → BESS</span>
          <div className="text-sm font-bold font-mono text-indigo-700 mt-1">
            {flows.renewable_to_battery.toFixed(1)} kW
          </div>
        </div>
        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80">
          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">Grid → Loads</span>
          <div className="text-sm font-bold font-mono text-amber-700 mt-1">
            {flows.grid_to_load.toFixed(1)} kW
          </div>
        </div>
        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80">
          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">BESS → Loads</span>
          <div className="text-sm font-bold font-mono text-blue-700 mt-1">
            {flows.battery_to_load.toFixed(1)} kW
          </div>
        </div>
        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80">
          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">Curtailment</span>
          <div className="text-sm font-bold font-mono text-rose-700 mt-1">
            {flows.renewable_to_curtailment.toFixed(1)} kW
          </div>
        </div>
      </div>
    </div>
  );
};

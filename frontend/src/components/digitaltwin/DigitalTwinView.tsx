import React from 'react';
import { DigitalTwinState, DigitalTwinNode } from '@/types';
import { StatusBadge } from '@/components/common/StatusBadge';
import { 
  Box, 
  Sun, 
  Battery, 
  Zap, 
  Factory, 
  Activity, 
  ShieldCheck, 
  Cpu, 
  Layers,
  Gauge,
  Radio,
  Workflow,
  Sparkles
} from 'lucide-react';
import clsx from 'clsx';

interface DigitalTwinViewProps {
  twinState: DigitalTwinState;
}

export const DigitalTwinView: React.FC<DigitalTwinViewProps> = ({ twinState }) => {
  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'SOURCE':
        return Sun;
      case 'STORAGE':
        return Battery;
      case 'GRID':
        return Zap;
      case 'HUB':
        return Cpu;
      case 'SINK':
      default:
        return Factory;
    }
  };

  return (
    <div className="space-y-6">
      {/* Real-time Busbar Telemetry & Health */}
      <div className="card-tilt bg-slate-900/80 light:bg-white rounded-2xl border border-slate-800/90 light:border-slate-200 p-6 shadow-2xl shadow-black/30 backdrop-blur-2xl relative overflow-hidden transition-colors">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-cyan-500 to-indigo-500" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-sm">
                <Box className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-base font-extrabold text-white light:text-slate-900 tracking-tight">
                    Industrial Microgrid Digital Twin
                  </h2>
                  <StatusBadge status={twinState.operating_mode} size="sm" />
                </div>
                <p className="text-xs text-slate-400 light:text-slate-500 mt-1">
                  High-fidelity cyber-physical model synchronized with live busbars, inverters, and machining cells
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-950/70 light:bg-slate-100 px-3.5 py-1.5 rounded-xl border border-slate-800 light:border-slate-200">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>Telemetry Synced: {twinState.timestamp}</span>
          </div>
        </div>

        {/* Busbar Electrical Telemetry Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4.5 bg-slate-950/60 light:bg-slate-50 rounded-xl border border-slate-800/80 light:border-slate-200">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Grid Frequency</span>
            <div className="text-xl font-black font-mono text-slate-100 light:text-slate-900 mt-1 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>{twinState.hub_frequency_hz.toFixed(2)} Hz</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-mono mt-0.5 block">Nominal (50.0 Hz ±0.2)</span>
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Busbar Line Voltage</span>
            <div className="text-xl font-black font-mono text-slate-100 light:text-slate-900 mt-1 flex items-center gap-1.5">
              <Gauge className="w-4 h-4 text-cyan-400" />
              <span>{twinState.hub_voltage_v.toFixed(1)} V</span>
            </div>
            <span className="text-[10px] text-cyan-400 font-mono mt-0.5 block">3-Phase 415V RMS</span>
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Power Factor</span>
            <div className="text-xl font-black font-mono text-slate-100 light:text-slate-900 mt-1 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              <span>{twinState.power_factor.toFixed(3)}</span>
            </div>
            <span className="text-[10px] text-indigo-400 font-mono mt-0.5 block">PF Correction Active</span>
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Active Supervisory Alarms</span>
            <div className="text-xl font-black font-mono text-slate-100 light:text-slate-900 mt-1 flex items-center gap-2">
              <span className={clsx("w-2.5 h-2.5 rounded-full", twinState.active_alerts_count > 0 ? "bg-amber-400 animate-ping" : "bg-emerald-400")} />
              <span>{twinState.active_alerts_count} Active</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">SCADA Telemetry Healthy</span>
          </div>
        </div>
      </div>

      {/* Synchronized Component Nodes Matrix */}
      <div className="card-tilt bg-slate-900/80 light:bg-white rounded-2xl border border-slate-800/90 light:border-slate-200 p-6 shadow-2xl backdrop-blur-2xl transition-colors">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-extrabold text-white light:text-slate-900 tracking-tight flex items-center gap-2">
            <Workflow className="w-4 h-4 text-cyan-400" />
            <span>Synchronized Microgrid Asset Hierarchy</span>
          </h3>
          <span className="text-xs font-mono text-slate-400">{twinState.nodes.length} Synchronized Nodes</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {twinState.nodes.map((node) => {
            const Icon = getNodeIcon(node.type);

            return (
              <div
                key={node.id}
                className="card-tilt-subtle p-5 rounded-xl border border-slate-800 light:border-slate-200 bg-slate-950/60 light:bg-white hover:border-cyan-500/50 light:hover:border-cyan-300 transition-all shadow-md group"
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2.5 bg-slate-900 light:bg-slate-50 rounded-xl border border-slate-800 light:border-slate-100 text-cyan-400 group-hover:text-cyan-300 transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-100 light:text-slate-900 leading-tight">{node.name}</h4>
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                        {node.type} • {node.id}
                      </span>
                    </div>
                  </div>
                  <span className={clsx(
                    "text-[10px] font-bold px-2 py-0.5 rounded-full border font-mono",
                    node.status === 'OPTIMAL' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                    node.status === 'ACTIVE' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' :
                    node.status === 'WARNING' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                    'bg-slate-800 text-slate-400 border-slate-700'
                  )}>
                    {node.status}
                  </span>
                </div>

                <div className="flex items-baseline justify-between pt-2.5 border-t border-slate-800/80 light:border-slate-100 font-mono">
                  <span className="text-xs text-slate-400">Live Power:</span>
                  <strong className="text-base font-bold text-slate-100 light:text-slate-900">{node.power_kw.toFixed(1)} kW</strong>
                </div>

                <div className="flex items-baseline justify-between text-xs font-mono mt-1">
                  <span className="text-slate-400">Efficiency:</span>
                  <span className="font-semibold text-emerald-400 light:text-emerald-600">{node.efficiency_pct}%</span>
                </div>

                {/* Subsystem Telemetry Details */}
                <div className="mt-3 pt-2.5 border-t border-slate-800/60 light:border-slate-100 space-y-1 text-[11px] text-slate-400 light:text-slate-600 font-mono">
                  {Object.entries(node.details).map(([k, v]) => (
                    <div key={k} className="flex justify-between">
                      <span className="text-slate-500">{k}:</span>
                      <span className="font-medium text-slate-300 light:text-slate-800">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

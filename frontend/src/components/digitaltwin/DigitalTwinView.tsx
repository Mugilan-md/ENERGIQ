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
  Gauge
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
      {/* Real-time Telemetry & Microgrid Health Strip */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <Box className="w-5 h-5 text-sky-600" />
                Industrial Microgrid Digital Twin
              </h2>
              <StatusBadge status={twinState.operating_mode} size="sm" />
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              High-fidelity virtual model synchronized with physical busbars, inverters, and machining lines
            </p>
          </div>

          <div className="text-right text-xs font-mono text-slate-400">
            Last Synced: {twinState.timestamp}
          </div>
        </div>

        {/* Busbar Electrical Telemetry */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50/80 rounded-xl border border-slate-200/70">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Grid Frequency</span>
            <div className="text-lg font-extrabold font-mono text-slate-900 mt-1 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-emerald-600" />
              <span>{twinState.hub_frequency_hz.toFixed(2)} Hz</span>
            </div>
            <span className="text-[10px] text-emerald-600 font-semibold">Nominal (50.0 Hz ±0.2)</span>
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Busbar Line Voltage</span>
            <div className="text-lg font-extrabold font-mono text-slate-900 mt-1 flex items-center gap-1.5">
              <Gauge className="w-4 h-4 text-sky-600" />
              <span>{twinState.hub_voltage_v.toFixed(1)} V</span>
            </div>
            <span className="text-[10px] text-sky-600 font-semibold">3-Phase 415V RMS</span>
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Power Factor</span>
            <div className="text-lg font-extrabold font-mono text-slate-900 mt-1 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>{twinState.power_factor.toFixed(3)}</span>
            </div>
            <span className="text-[10px] text-indigo-600 font-semibold">PF Correction Active</span>
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Active System Alarms</span>
            <div className="text-lg font-extrabold font-mono text-slate-900 mt-1 flex items-center gap-1.5">
              <span className={clsx("w-2 h-2 rounded-full", twinState.active_alerts_count > 0 ? "bg-amber-500 animate-ping" : "bg-emerald-500")} />
              <span>{twinState.active_alerts_count} Active</span>
            </div>
            <span className="text-[10px] text-slate-500">Supervisory SCADA</span>
          </div>
        </div>
      </div>

      {/* Synchronized Component Nodes Matrix */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs">
        <h3 className="text-sm font-bold text-slate-900 tracking-tight mb-4">
          Synchronized Microgrid Asset Hierarchy
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {twinState.nodes.map((node) => {
            const Icon = getNodeIcon(node.type);

            return (
              <div
                key={node.id}
                className="p-4 rounded-xl border border-slate-200/80 bg-white hover:border-sky-300 transition-all shadow-2xs"
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-slate-50 rounded-lg border border-slate-100 text-slate-700">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 leading-tight">{node.name}</h4>
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                        {node.type} • {node.id}
                      </span>
                    </div>
                  </div>
                  <span className={clsx(
                    "text-[10px] font-bold px-2 py-0.5 rounded-full border",
                    node.status === 'OPTIMAL' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    node.status === 'ACTIVE' ? 'bg-sky-50 text-sky-700 border-sky-200' :
                    node.status === 'WARNING' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                    'bg-slate-50 text-slate-600 border-slate-200'
                  )}>
                    {node.status}
                  </span>
                </div>

                <div className="flex items-baseline justify-between pt-2 border-t border-slate-100 font-mono">
                  <span className="text-xs text-slate-500">Live Power:</span>
                  <strong className="text-base font-bold text-slate-900">{node.power_kw.toFixed(1)} kW</strong>
                </div>

                <div className="flex items-baseline justify-between text-xs font-mono mt-1">
                  <span className="text-slate-500">Efficiency:</span>
                  <span className="font-semibold text-emerald-600">{node.efficiency_pct}%</span>
                </div>

                {/* Subsystem Telemetry Details */}
                <div className="mt-3 pt-2.5 border-t border-slate-100/80 space-y-1 text-[11px] text-slate-600 font-mono">
                  {Object.entries(node.details).map(([k, v]) => (
                    <div key={k} className="flex justify-between">
                      <span className="text-slate-400">{k}:</span>
                      <span className="font-medium text-slate-800">{v}</span>
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

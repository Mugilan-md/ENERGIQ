import React, { useState } from 'react';
import { IndustrialLoad } from '@/types';
import { StatusBadge } from '@/components/common/StatusBadge';
import { 
  Factory, 
  Lock, 
  Unlock, 
  Sliders, 
  Power, 
  AlertTriangle,
  Info,
  CheckCircle2
} from 'lucide-react';
import clsx from 'clsx';

interface LoadMatrixProps {
  loads: IndustrialLoad[];
  onUpdateLoad: (loadId: string, status: string) => Promise<void>;
}

export const LoadMatrix: React.FC<LoadMatrixProps> = ({ loads, onUpdateLoad }) => {
  const [filterCriticality, setFilterCriticality] = useState<string>('ALL');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const filtered = loads.filter((l) =>
    filterCriticality === 'ALL' ? true : l.criticality === filterCriticality
  );

  const totalCurrent = loads.reduce((acc, l) => acc + l.current_power, 0);
  const totalMin = loads.reduce((acc, l) => acc + l.min_power, 0);
  const totalMax = loads.reduce((acc, l) => acc + l.max_power, 0);

  const handleToggle = async (load: IndustrialLoad) => {
    if (load.criticality === 'CRITICAL') {
      setFeedback(`Safety Lock Engaged: ${load.name} is designated CRITICAL and cannot be disconnected.`);
      setTimeout(() => setFeedback(null), 3500);
      return;
    }

    const nextStatus = load.status === 'RUNNING' ? 'SHED' : 'RUNNING';
    setUpdatingId(load.id);
    try {
      await onUpdateLoad(load.id, nextStatus);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs">
      {/* Header & High-Level Metrics */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Configurable Industrial Load Centers
            </h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              {loads.length} Subsystems
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Granular priority control, operational bounds, and safety-locked critical lines
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
          {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'FLEXIBLE'].map((c) => (
            <button
              key={c}
              onClick={() => setFilterCriticality(c)}
              className={clsx(
                'px-2.5 py-1 font-bold rounded-lg transition-all',
                filterCriticality === c
                  ? 'bg-white text-sky-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {feedback && (
        <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Aggregate Capacity Bar */}
      <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/70 mb-6 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div>
          <span className="text-slate-500">Total Factory Consumption:</span>{' '}
          <strong className="text-slate-900 font-mono text-sm">{totalCurrent.toFixed(1)} kW</strong>
        </div>
        <div>
          <span className="text-slate-500">Operational Bound Range:</span>{' '}
          <span className="font-mono text-slate-700">{totalMin.toFixed(0)} kW – {totalMax.toFixed(0)} kW</span>
        </div>
        <div>
          <span className="text-slate-500">Flexibility Potential:</span>{' '}
          <span className="font-mono font-bold text-sky-700">±{(totalMax - totalCurrent).toFixed(0)} kW</span>
        </div>
      </div>

      {/* Load Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((load) => {
          const isCritical = load.criticality === 'CRITICAL';
          const pctOfMax = (load.current_power / load.max_power) * 100;

          return (
            <div
              key={load.id}
              className={clsx(
                'rounded-xl border p-4 transition-all relative flex flex-col justify-between',
                load.status === 'SHED'
                  ? 'bg-slate-50/60 border-slate-200 opacity-60'
                  : 'bg-white border-slate-200/80 shadow-2xs hover:shadow-xs'
              )}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 leading-snug">
                      {load.name}
                    </h3>
                    <span className="text-[11px] font-mono text-slate-400">
                      ID: {load.id} • {load.category}
                    </span>
                  </div>
                  <StatusBadge status={load.criticality} size="sm" />
                </div>

                <div className="mt-3 flex items-baseline justify-between font-mono">
                  <span className="text-xl font-bold text-slate-900">
                    {load.current_power.toFixed(1)} <span className="text-xs font-normal text-slate-500">kW</span>
                  </span>
                  <span className="text-xs text-slate-500">
                    Rating: {load.min_power} – {load.max_power} kW
                  </span>
                </div>

                {/* Progress bar of current power */}
                <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
                  <div
                    className={clsx(
                      'h-1.5 rounded-full transition-all duration-500',
                      isCritical ? 'bg-rose-500' : 'bg-sky-500'
                    )}
                    style={{ width: `${Math.min(100, Math.max(0, pctOfMax))}%` }}
                  />
                </div>

                {/* Details */}
                <div className="mt-3 space-y-1 text-[11px] text-slate-600 border-t border-slate-100 pt-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Schedule:</span>
                    <span className="font-medium truncate max-w-[170px] text-right">{load.operating_schedule}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Flexibility:</span>
                    <span className="font-medium truncate max-w-[170px] text-right">{load.flexibility_type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Dependency:</span>
                    <span className="font-medium truncate max-w-[170px] text-right">{load.production_dependency}</span>
                  </div>
                </div>
              </div>

              {/* Action row */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  {isCritical ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                      <Lock className="w-3 h-3" />
                      Locked (Safety)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      <Unlock className="w-3 h-3" />
                      Controllable
                    </span>
                  )}
                </div>

                <button
                  onClick={() => handleToggle(load)}
                  disabled={updatingId === load.id}
                  className={clsx(
                    'px-2.5 py-1 text-xs font-bold rounded-lg border transition-all flex items-center gap-1',
                    isCritical
                      ? 'bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed'
                      : load.status === 'RUNNING'
                      ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                  )}
                >
                  <Power className="w-3 h-3" />
                  {load.status === 'RUNNING' ? 'Shed Load' : 'Restore'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

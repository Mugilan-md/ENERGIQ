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
  CheckCircle2,
  Cpu,
  Layers,
  Zap,
  ShieldCheck,
  Search
} from 'lucide-react';
import clsx from 'clsx';

interface LoadMatrixProps {
  loads: IndustrialLoad[];
  onUpdateLoad: (loadId: string, status: string) => Promise<void>;
}

export const LoadMatrix: React.FC<LoadMatrixProps> = ({ loads, onUpdateLoad }) => {
  const [filterCriticality, setFilterCriticality] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const filtered = loads.filter((l) => {
    const matchesFilter = filterCriticality === 'ALL' ? true : l.criticality === filterCriticality;
    const matchesSearch = l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          l.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          l.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalCurrent = loads.reduce((acc, l) => acc + l.current_power, 0);
  const totalMin = loads.reduce((acc, l) => acc + l.min_power, 0);
  const totalMax = loads.reduce((acc, l) => acc + l.max_power, 0);
  const criticalCount = loads.filter(l => l.criticality === 'CRITICAL').length;

  const handleToggle = async (load: IndustrialLoad) => {
    if (load.criticality === 'CRITICAL') {
      setFeedback(`Safety Interlock Engaged: ${load.name} is designated as CRITICAL production equipment and cannot be shed.`);
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
    <div className="space-y-6">
      {/* Top Header & Subsystem Overview */}
      <div className="bg-slate-900/80 light:bg-white rounded-2xl border border-slate-800/90 light:border-slate-200 p-6 shadow-2xl shadow-black/30 backdrop-blur-2xl relative overflow-hidden transition-colors">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-sm">
                <Factory className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-base font-extrabold text-white light:text-slate-900 tracking-tight">
                    Industrial Load Disaggregation Matrix
                  </h2>
                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                    {loads.length} Subsystems
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30">
                    {criticalCount} Critical Hard-Locked
                  </span>
                </div>
                <p className="text-xs text-slate-400 light:text-slate-500 mt-1">
                  Granular multi-busbar load modeling, machine modulation bounds, and safety-locked non-sheddable lines
                </p>
              </div>
            </div>
          </div>

          {/* Search & Filter Controls */}
          <div className="flex items-center flex-wrap gap-2.5">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Filter loads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-slate-950/70 light:bg-slate-100 text-xs text-slate-200 light:text-slate-800 rounded-xl border border-slate-800/80 light:border-slate-200 focus:outline-hidden focus:border-cyan-500 transition-colors"
              />
            </div>

            <div className="flex items-center gap-1 bg-slate-950/80 light:bg-slate-100 p-1 rounded-xl border border-slate-800/80 light:border-slate-200 text-xs">
              {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'FLEXIBLE'].map((c) => (
                <button
                  key={c}
                  onClick={() => setFilterCriticality(c)}
                  className={clsx(
                    'px-3 py-1 font-bold rounded-lg transition-all text-xs cursor-pointer font-mono',
                    filterCriticality === c
                      ? 'bg-gradient-to-r from-cyan-500 to-sky-600 text-white shadow-md shadow-cyan-500/30'
                      : 'text-slate-400 light:text-slate-600 hover:text-slate-200 light:hover:text-slate-900'
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        {feedback && (
          <div className="mb-5 p-3.5 bg-rose-950/60 light:bg-rose-50 border border-rose-800/80 light:border-rose-200 text-rose-300 light:text-rose-700 rounded-xl text-xs flex items-center gap-2 animate-shake">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400 light:text-rose-600" />
            <span className="font-medium">{feedback}</span>
          </div>
        )}

        {/* Telemetry Summary Ribbon */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-slate-950/50 light:bg-slate-50 rounded-xl border border-slate-800/70 light:border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-semibold font-mono">Total Factory Demand</span>
              <div className="text-xl font-black font-mono text-slate-100 light:text-slate-900">
                {totalCurrent.toFixed(1)} <span className="text-xs font-normal text-slate-400">kW</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-semibold font-mono">Operational Bounds Range</span>
              <div className="text-base font-bold font-mono text-slate-200 light:text-slate-700">
                {totalMin.toFixed(0)} kW – {totalMax.toFixed(0)} kW
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-semibold font-mono">Modulation Headroom</span>
              <div className="text-base font-bold font-mono text-emerald-400 light:text-emerald-700">
                ±{(totalMax - totalCurrent).toFixed(0)} kW Available
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Disaggregated Load Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((load) => {
          const isCritical = load.criticality === 'CRITICAL';
          const isRunning = load.status === 'RUNNING';
          const pctOfMax = (load.current_power / load.max_power) * 100;

          return (
            <div
              key={load.id}
              className={clsx(
                'rounded-2xl border p-5 transition-all relative flex flex-col justify-between group backdrop-blur-xl',
                !isRunning
                  ? 'bg-slate-900/40 light:bg-slate-100/60 border-slate-800/60 light:border-slate-300 opacity-60'
                  : isCritical
                  ? 'bg-slate-900/80 light:bg-white border-rose-900/40 light:border-rose-200 hover:border-rose-500/60 shadow-xl shadow-black/20'
                  : 'bg-slate-900/80 light:bg-white border-slate-800/90 light:border-slate-200 hover:border-cyan-500/50 light:hover:border-cyan-400 shadow-xl shadow-black/20'
              )}
            >
              {/* Card Accent Top Bar */}
              <div
                className={clsx(
                  'absolute top-0 left-0 right-0 h-1 rounded-t-2xl transition-all',
                  !isRunning
                    ? 'bg-slate-700'
                    : isCritical
                    ? 'bg-gradient-to-r from-rose-500 to-amber-500'
                    : 'bg-gradient-to-r from-cyan-500 to-blue-500'
                )}
              />

              <div>
                {/* Title & Status */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-100 light:text-slate-900 leading-snug group-hover:text-cyan-400 light:group-hover:text-cyan-600 transition-colors">
                      {load.name}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[10px] font-mono text-slate-400 light:text-slate-500">
                        {load.id}
                      </span>
                      <span className="text-slate-600 dark:text-slate-700">•</span>
                      <span className="text-[10px] font-mono text-cyan-400 light:text-cyan-700 uppercase font-semibold">
                        {load.category}
                      </span>
                    </div>
                  </div>
                  <StatusBadge status={load.criticality} size="sm" />
                </div>

                {/* Power Output Readout */}
                <div className="mt-4 flex items-baseline justify-between font-mono">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-slate-100 light:text-slate-900 tabular-nums">
                      {load.current_power.toFixed(1)}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">kW</span>
                  </div>
                  <span className="text-xs font-mono text-slate-400 light:text-slate-500">
                    Rating: {load.min_power} – {load.max_power} kW
                  </span>
                </div>

                {/* Live Output Bar */}
                <div className="w-full bg-slate-950/70 light:bg-slate-200 rounded-full h-2 mt-2.5 overflow-hidden p-0.5 border border-slate-800/80 light:border-slate-300">
                  <div
                    className={clsx(
                      'h-full rounded-full transition-all duration-700',
                      !isRunning
                        ? 'bg-slate-600'
                        : isCritical
                        ? 'bg-gradient-to-r from-rose-500 to-amber-500 shadow-sm shadow-rose-500/50'
                        : 'bg-gradient-to-r from-cyan-500 to-blue-500 shadow-sm shadow-cyan-500/50'
                    )}
                    style={{ width: `${Math.min(100, Math.max(0, pctOfMax))}%` }}
                  />
                </div>

                {/* Technical Parameters */}
                <div className="mt-4 space-y-1.5 text-[11px] text-slate-400 light:text-slate-600 border-t border-slate-800/60 light:border-slate-100 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-sans">Operating Schedule:</span>
                    <span className="font-mono font-medium text-slate-300 light:text-slate-800 truncate max-w-[170px]">{load.operating_schedule}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-sans">Flexibility Type:</span>
                    <span className="font-mono font-medium text-slate-300 light:text-slate-800 truncate max-w-[170px]">{load.flexibility_type}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-sans">Process Dependency:</span>
                    <span className="font-mono font-medium text-slate-300 light:text-slate-800 truncate max-w-[170px]">{load.production_dependency}</span>
                  </div>
                </div>
              </div>

              {/* Action Controls */}
              <div className="mt-5 pt-3 border-t border-slate-800/60 light:border-slate-100 flex items-center justify-between">
                <div>
                  {isCritical ? (
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-lg border border-rose-500/20 font-mono">
                      <Lock className="w-3 h-3" />
                      Interlock Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 font-mono">
                      <Unlock className="w-3 h-3" />
                      MILP Dispatchable
                    </span>
                  )}
                </div>

                <button
                  onClick={() => handleToggle(load)}
                  disabled={updatingId === load.id}
                  className={clsx(
                    'px-3.5 py-1.5 text-xs font-bold rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer',
                    isCritical
                      ? 'bg-slate-800/50 light:bg-slate-100 text-slate-500 border-slate-700/50 light:border-slate-200 cursor-not-allowed'
                      : isRunning
                      ? 'bg-rose-500/15 text-rose-300 hover:bg-rose-500/25 border-rose-500/35 hover:scale-102'
                      : 'bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25 border-emerald-500/35 hover:scale-102'
                  )}
                >
                  <Power className="w-3.5 h-3.5" />
                  {isRunning ? 'Shed Load' : 'Restore'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

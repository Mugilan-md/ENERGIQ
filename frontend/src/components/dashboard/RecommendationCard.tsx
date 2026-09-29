import React, { useState } from 'react';
import { ExplainableMetadata } from '@/types';
import { Sparkles, CheckCircle2, ChevronRight, HelpCircle, ShieldAlert, Cpu, ArrowUpRight, Check, Radio } from 'lucide-react';
import clsx from 'clsx';

interface RecommendationCardProps {
  data: ExplainableMetadata;
  onApply?: () => void;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({ data, onApply }) => {
  const [approved, setApproved] = useState(false);
  const [isDispatching, setIsDispatching] = useState(false);

  const handleApprove = () => {
    setIsDispatching(true);
    setTimeout(() => {
      setIsDispatching(false);
      setApproved(true);
      if (onApply) onApply();
    }, 900);
  };

  return (
    <div className="card-tilt bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-indigo-950/40 light:from-white light:via-sky-50/50 light:to-indigo-50/40 rounded-2xl border border-indigo-500/35 light:border-sky-200 p-6 shadow-2xl shadow-black/25 backdrop-blur-2xl relative overflow-hidden transition-colors">
      {/* Top glowing ambient gradient */}
      <div className="absolute top-0 right-0 w-96 h-36 bg-gradient-to-bl from-purple-500/15 via-cyan-500/15 to-transparent blur-3xl pointer-events-none" />

      {/* Header with AI Badge & Confidence Score */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80 light:border-sky-100 relative z-10">
        <div className="flex items-center gap-3.5">
          <div className="relative p-2.5 bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-500 text-white rounded-2xl shadow-lg shadow-purple-500/30 shrink-0">
            <Sparkles className="w-5 h-5 animate-pulse-glow" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-extrabold text-white light:text-slate-900 tracking-tight">
                Explainable AI Orchestration Strategy
              </h3>
              <span className="text-[10px] font-mono font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/15 light:bg-emerald-100 text-emerald-300 light:text-emerald-800 border border-emerald-500/30 light:border-emerald-200">
                {(data.confidence * 100).toFixed(0)}% Confidence
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30 uppercase">
                MILP Optimal
              </span>
            </div>
            <p className="text-xs text-slate-400 light:text-slate-500 mt-1 font-mono">
              Target Component: <span className="font-bold text-cyan-400 light:text-sky-700">{data.target_component}</span> • Timestamp: {data.timestamp}
            </p>
          </div>
        </div>

        {approved ? (
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/15 light:bg-emerald-50 text-emerald-300 light:text-emerald-700 border border-emerald-500/40 light:border-emerald-200 rounded-xl text-xs font-bold shadow-sm animate-in fade-in zoom-in-95">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Authorized & Dispatched to SCADA</span>
          </div>
        ) : (
          <button
            onClick={handleApprove}
            disabled={isDispatching}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500 via-sky-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-extrabold rounded-xl shadow-lg shadow-cyan-500/25 transition-all cursor-pointer hover:scale-102 disabled:opacity-75"
          >
            {isDispatching ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Issuing Modbus Commands...</span>
              </>
            ) : (
              <>
                <span>Authorize & Dispatch</span>
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        )}
      </div>

      {/* Main Recommended Action Callout */}
      <div className="mt-4 p-4.5 bg-slate-800/90 light:bg-white rounded-xl border border-slate-700/80 light:border-slate-200 shadow-md relative z-10">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-cyan-400 light:text-sky-700 block">
            Recommended Action:
          </span>
          <span className="text-[10px] font-mono text-slate-500">Autonomous Supervisory Directive</span>
        </div>
        <p className="text-sm font-semibold text-slate-100 light:text-slate-800 leading-relaxed">
          {data.recommended_action}
        </p>
      </div>

      {/* Structured Columns: Causal Rationale vs Expected Impacts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 relative z-10">
        {/* Why / Rationale */}
        <div className="p-4 bg-slate-800/50 light:bg-white/80 rounded-xl border border-slate-700/60 light:border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300 light:text-slate-700 uppercase tracking-wider mb-3 font-mono">
            <HelpCircle className="w-4 h-4 text-cyan-400 light:text-sky-600" />
            <span>Why (Causal Rationale):</span>
          </div>
          <ul className="space-y-2.5 text-xs text-slate-300 light:text-slate-600">
            {data.why.map((reason, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0 shadow-sm shadow-cyan-400/50" />
                <span className="leading-relaxed">{reason}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Expected Operational Impact */}
        <div className="p-4 bg-slate-800/50 light:bg-white/80 rounded-xl border border-slate-700/60 light:border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300 light:text-slate-700 uppercase tracking-wider mb-3 font-mono">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 light:text-emerald-600" />
            <span>Expected Financial & Production Impact:</span>
          </div>
          <ul className="space-y-2.5 text-xs text-slate-300 light:text-slate-600">
            {data.expected_impact.map((impact, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0 shadow-sm shadow-emerald-400/50" />
                <span className="leading-relaxed">{impact}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

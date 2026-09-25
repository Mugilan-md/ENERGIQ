import React, { useState } from 'react';
import { ExplainableMetadata } from '@/types';
import { Sparkles, CheckCircle2, ChevronRight, HelpCircle, ShieldAlert } from 'lucide-react';
import clsx from 'clsx';

interface RecommendationCardProps {
  data: ExplainableMetadata;
  onApply?: () => void;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({ data, onApply }) => {
  const [approved, setApproved] = useState(false);

  const handleApprove = () => {
    setApproved(true);
    if (onApply) onApply();
  };

  return (
    <div className="bg-gradient-to-br from-white to-sky-50/40 rounded-2xl border border-sky-200/80 p-6 shadow-xs relative overflow-hidden">
      {/* Decorative subtle badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-sky-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-sky-500 text-white rounded-xl shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                Explainable AI Orchestration Recommendation
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                {(data.confidence * 100).toFixed(0)}% Confidence
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 font-mono">
              Target Component: <span className="font-semibold text-slate-700">{data.target_component}</span> • Generated {data.timestamp}
            </p>
          </div>
        </div>

        {approved ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Approved & Dispatched
          </span>
        ) : (
          <button
            onClick={handleApprove}
            className="flex items-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl shadow-sm shadow-sky-600/20 transition-all cursor-pointer"
          >
            <span>Authorize Action</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Main Decision Highlight */}
      <div className="mt-4 p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
        <span className="text-[11px] font-bold uppercase tracking-wider text-sky-700">
          Recommended Action:
        </span>
        <p className="text-sm font-semibold text-slate-800 mt-1 leading-relaxed">
          {data.recommended_action}
        </p>
      </div>

      {/* Why & Expected Impact Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {/* Why / Rationale */}
        <div className="p-3.5 bg-white/80 rounded-xl border border-slate-200/60">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            <HelpCircle className="w-3.5 h-3.5 text-sky-600" />
            Why (Underlying Rationale):
          </div>
          <ul className="space-y-1.5 text-xs text-slate-600">
            {data.why.map((reason, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-1.5 shrink-0" />
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Expected Impact */}
        <div className="p-3.5 bg-white/80 rounded-xl border border-slate-200/60">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Expected Operational Impact:
          </div>
          <ul className="space-y-1.5 text-xs text-slate-600">
            {data.expected_impact.map((impact, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <span>{impact}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

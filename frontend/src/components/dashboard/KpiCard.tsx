import React from 'react';
import { KpiMetric } from '@/types';
import { MetricTrend } from '@/components/common/StatusBadge';
import clsx from 'clsx';

interface KpiCardProps {
  metric: KpiMetric;
  icon: React.ElementType;
  accentColor?: 'sky' | 'emerald' | 'amber' | 'rose' | 'indigo' | 'slate';
  tooltip?: string;
  secondaryInfo?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  metric,
  icon: Icon,
  accentColor = 'sky',
  tooltip,
  secondaryInfo
}) => {
  const accentStyles = {
    sky: {
      bar: 'from-cyan-400 to-blue-500',
      iconBox: 'bg-cyan-500/10 text-cyan-400 light:text-cyan-600 border-cyan-500/20',
      hoverGlow: 'hover:border-cyan-500/30'
    },
    emerald: {
      bar: 'from-emerald-400 to-teal-500',
      iconBox: 'bg-emerald-500/10 text-emerald-400 light:text-emerald-600 border-emerald-500/20',
      hoverGlow: 'hover:border-emerald-500/30'
    },
    amber: {
      bar: 'from-amber-400 to-orange-500',
      iconBox: 'bg-amber-500/10 text-amber-400 light:text-amber-600 border-amber-500/20',
      hoverGlow: 'hover:border-amber-500/30'
    },
    rose: {
      bar: 'from-rose-400 to-pink-500',
      iconBox: 'bg-rose-500/10 text-rose-400 light:text-rose-600 border-rose-500/20',
      hoverGlow: 'hover:border-rose-500/30'
    },
    indigo: {
      bar: 'from-purple-400 to-indigo-500',
      iconBox: 'bg-indigo-500/10 text-indigo-400 light:text-indigo-600 border-indigo-500/20',
      hoverGlow: 'hover:border-indigo-500/30'
    },
    slate: {
      bar: 'from-slate-400 to-slate-500',
      iconBox: 'bg-slate-700/20 text-slate-300 light:text-slate-600 border-slate-700/30',
      hoverGlow: 'hover:border-slate-500/30'
    }
  };

  const style = accentStyles[accentColor];

  return (
    <div
      className={clsx(
        'bg-slate-900/60 light:bg-white rounded-2xl p-4.5 border border-slate-800/80 light:border-slate-200/90 shadow-sm backdrop-blur-md transition-all duration-200 relative group overflow-hidden hover:shadow-md hover:-translate-y-0.5',
        style.hoverGlow
      )}
      title={tooltip}
    >
      {/* Refined subtle top indicator line */}
      <div className={clsx('absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r opacity-70 group-hover:opacity-100 transition-opacity', style.bar)} />

      {/* Header: Label + Minimal Icon Box */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold text-slate-400 light:text-slate-500 uppercase tracking-wider font-mono truncate">
          {metric.label}
        </span>
        <div className={clsx('p-1.5 rounded-lg border shrink-0 transition-transform duration-200 group-hover:scale-105', style.iconBox)}>
          <Icon className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Metric Numerical Readout */}
      <div className="mt-2.5 flex items-baseline gap-1.5">
        <span className="text-2xl font-bold tracking-tight text-white light:text-slate-900 font-mono tabular-nums">
          {typeof metric.value === 'number' ? metric.value.toLocaleString(undefined, { maximumFractionDigits: 1 }) : metric.value}
        </span>
        <span className="text-xs font-medium text-slate-400 light:text-slate-500 uppercase font-mono">
          {metric.unit}
        </span>
      </div>

      {/* Subtext and Trend Indicator */}
      <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-slate-800/60 light:border-slate-100 text-[11px]">
        <MetricTrend
          trend={metric.trend}
          direction={metric.trend_direction}
          isPositive={metric.is_positive_trend}
        />
        <span className="text-slate-400 light:text-slate-500 truncate max-w-[170px] text-right font-sans">
          {secondaryInfo || metric.context}
        </span>
      </div>
    </div>
  );
};

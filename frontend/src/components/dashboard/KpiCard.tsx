import React from 'react';
import { KpiMetric } from '@/types';
import { MetricTrend } from '@/components/common/StatusBadge';
import clsx from 'clsx';

interface KpiCardProps {
  metric: KpiMetric;
  icon: React.ElementType;
  accentColor?: 'sky' | 'emerald' | 'amber' | 'rose' | 'indigo' | 'slate';
  tooltip?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  metric,
  icon: Icon,
  accentColor = 'sky',
  tooltip
}) => {
  const colorStyles = {
    sky: 'bg-sky-50 text-sky-600 border-sky-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    rose: 'bg-rose-50 text-rose-600 border-rose-100',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    slate: 'bg-slate-50 text-slate-600 border-slate-200'
  };

  return (
    <div
      className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs hover:shadow-md transition-all duration-200 relative group"
      title={tooltip}
    >
      <div className="flex items-start justify-between">
        <span className="text-xs font-semibold text-slate-500 tracking-wide uppercase">
          {metric.label}
        </span>
        <div className={clsx('p-2.5 rounded-xl border shrink-0', colorStyles[accentColor])}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900 font-mono">
          {typeof metric.value === 'number' ? metric.value.toLocaleString() : metric.value}
        </span>
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          {metric.unit}
        </span>
      </div>

      <div className="mt-3 flex items-center justify-between pt-3 border-t border-slate-100">
        <MetricTrend
          trend={metric.trend}
          direction={metric.trend_direction}
          isPositive={metric.is_positive_trend}
        />
        <span className="text-[11px] font-medium text-slate-400 truncate max-w-[150px] text-right">
          {metric.context}
        </span>
      </div>
    </div>
  );
};

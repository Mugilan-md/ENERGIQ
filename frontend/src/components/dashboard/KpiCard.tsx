import React from 'react';
import { KpiMetric } from '@/types';
import { MoreHorizontal } from 'lucide-react';
import clsx from 'clsx';

interface KpiCardProps {
  metric: KpiMetric;
  icon?: React.ElementType;
  accentColor?: 'sky' | 'emerald' | 'amber' | 'rose' | 'indigo' | 'purple' | 'slate';
  tooltip?: string;
  secondaryInfo?: string;
  progressPercent?: string;
  progressLabel?: string;
  countdownText?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  metric,
  icon: Icon,
  accentColor = 'sky',
  tooltip,
  secondaryInfo,
  progressPercent: customProgress,
  progressLabel = 'Capacity',
  countdownText: customCountdown
}) => {
  // Map accentColor to semantic colorClass
  // Solar: green (#10B981)
  // Battery: purple (#8B5CF6)
  // Grid: orange (#F59E0B)
  // Industrial Loads: blue (#0EA5E9)
  // Critical: red (#EF4444)
  const colorClassMap: Record<string, string> = {
    emerald: 'green',
    sky: 'blue',
    amber: 'orange',
    rose: 'red',
    indigo: 'purple',
    purple: 'purple',
    slate: 'blue'
  };

  const colorClass = colorClassMap[accentColor] || 'blue';

  // Compute realistic progress percent based on industrial metrics
  const getProgressData = () => {
    if (customProgress) return customProgress;
    const val = typeof metric.value === 'number' ? metric.value : parseFloat(String(metric.value).replace(/[^0-9.]/g, '')) || 50;
    const labelUpper = metric.label.toUpperCase();

    if (labelUpper.includes('BATTERY') || labelUpper.includes('SOC')) {
      return `${Math.min(100, Math.max(0, val)).toFixed(0)}%`;
    }
    if (labelUpper.includes('RENEWABLE') || labelUpper.includes('SOLAR')) {
      // 650 kWp installed PV capacity
      return `${Math.min(100, Math.max(0, (val / 650) * 100)).toFixed(0)}%`;
    }
    if (labelUpper.includes('DEMAND') || labelUpper.includes('LOAD')) {
      // 800 kW max plant load rating
      return `${Math.min(100, Math.max(0, (val / 800) * 100)).toFixed(0)}%`;
    }
    if (labelUpper.includes('GRID') || labelUpper.includes('CONSUMPTION') || labelUpper.includes('PEAK') || labelUpper.includes('IMPORT')) {
      // 500 kW grid sanction limit
      return `${Math.min(100, Math.max(0, (val / 500) * 100)).toFixed(0)}%`;
    }
    if (labelUpper.includes('CURTAILMENT')) {
      return `${Math.min(100, Math.max(0, val)).toFixed(0)}%`;
    }
    if (labelUpper.includes('SAVINGS') || labelUpper.includes('COST')) {
      return '84%';
    }
    return '68%';
  };

  const progressPercent = getProgressData();

  // Countdown / Tag string
  const countdownText = customCountdown || (
    metric.trend ? `${metric.trend_direction === 'up' ? '↑' : metric.trend_direction === 'down' ? '↓' : '→'} ${metric.trend}` : 'LIVE'
  );

  return (
    <div className={clsx('card bg-white border border-[#E2E8F0] shadow-xs', colorClass)} title={tooltip}>
      {/* Card Header: Label & Action Icon */}
      <div className="card-header">
        <div className="flex items-center gap-1.5 min-w-0">
          {Icon && <Icon className="w-3.5 h-3.5 text-[#64748B] shrink-0" />}
          <div className="date font-mono text-xs font-semibold text-[#64748B] uppercase tracking-wider truncate">
            {metric.label}
          </div>
        </div>
        <MoreHorizontal className="w-4 h-4 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer shrink-0" />
      </div>

      {/* Card Body: Metric Value, Description, Progress */}
      <div className="card-body">
        <h3 className="flex items-baseline gap-1.5">
          <span className="tabular-nums font-mono font-extrabold text-2xl lg:text-3xl tracking-tight text-[#0F172A]">
            {typeof metric.value === 'number' ? metric.value.toLocaleString(undefined, { maximumFractionDigits: 1 }) : metric.value}
          </span>
          <span className="text-xs font-bold text-[#64748B] uppercase font-mono">
            {metric.unit}
          </span>
        </h3>
        <p className="line-clamp-1 text-xs text-[#64748B] mt-1 mb-3">
          {secondaryInfo || metric.context}
        </p>

        {/* Progress bar container */}
        <div className="progress">
          <span className="text-[11px] font-medium text-[#64748B]">{progressLabel}</span>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: progressPercent }}
            />
          </div>
          <span className="text-[11px] font-mono font-bold text-[#0F172A]">{progressPercent}</span>
        </div>
      </div>

      {/* Card Footer: Live Telemetry Indicator & Trend Tag */}
      <div className="card-footer pt-3 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-mono font-medium text-[#64748B] tracking-wide uppercase">
            Live Telemetry
          </span>
        </div>

        <span className="btn-countdown text-[11px] font-mono font-bold">
          {countdownText}
        </span>
      </div>
    </div>
  );
};

export default KpiCard;

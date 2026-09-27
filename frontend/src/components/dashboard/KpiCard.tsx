import React from 'react';
import { KpiMetric } from '@/types';
import { MoreHorizontal, Plus } from 'lucide-react';
import clsx from 'clsx';

interface KpiCardProps {
  metric: KpiMetric;
  icon?: React.ElementType;
  accentColor?: 'sky' | 'emerald' | 'amber' | 'rose' | 'indigo' | 'purple' | 'slate';
  tooltip?: string;
  secondaryInfo?: string;
  progressPercent?: string;
  progressLabel?: string;
  imgSrc1?: string;
  imgAlt1?: string;
  imgSrc2?: string;
  imgAlt2?: string;
  countdownText?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  metric,
  accentColor = 'sky',
  tooltip,
  secondaryInfo,
  progressPercent: customProgress,
  progressLabel = 'Capacity',
  imgSrc1,
  imgAlt1,
  imgSrc2,
  imgAlt2,
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

  // Curated Unsplash engineer / operator avatars
  const defaultAvatars: Record<string, { src1: string; alt1: string; src2: string; alt2: string }> = {
    green: {
      src1: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      alt1: 'Solar PV Lead',
      src2: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      alt2: 'Array Specialist'
    },
    blue: {
      src1: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
      alt1: 'Plant Operations Manager',
      src2: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
      alt2: 'SCADA Dispatcher'
    },
    orange: {
      src1: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
      alt1: 'Substation Control Lead',
      src2: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80',
      alt2: 'Feeder Specialist'
    },
    purple: {
      src1: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      alt1: 'BESS Battery Specialist',
      src2: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      alt2: 'Thermal Engineer'
    },
    red: {
      src1: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      alt1: 'Safety Auditor',
      src2: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      alt2: 'Interconnect Officer'
    }
  };

  const avatars = defaultAvatars[colorClass] || defaultAvatars.blue;
  const avatar1 = imgSrc1 || avatars.src1;
  const avatar2 = imgSrc2 || avatars.src2;

  // Countdown / Tag string
  const countdownText = customCountdown || (
    metric.trend ? `${metric.trend_direction === 'up' ? '↑' : metric.trend_direction === 'down' ? '↓' : '→'} ${metric.trend}` : 'LIVE'
  );

  return (
    <div className={clsx('card bg-white border border-[#E2E8F0] shadow-xs', colorClass)} title={tooltip}>
      {/* Card Header: Label & Action Icon */}
      <div className="card-header">
        <div className="date font-mono text-xs font-semibold text-[#64748B] uppercase tracking-wider">
          {metric.label}
        </div>
        <MoreHorizontal className="w-4 h-4 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer" />
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

      {/* Card Footer: Operators, Add, Countdown/Status Tag */}
      <div className="card-footer pt-3 border-t border-slate-100 flex items-center justify-between">
        <ul className="flex items-center">
          {avatar1 && (
            <li>
              <img src={avatar1} alt={imgAlt1 || 'operator 1'} className="w-6 h-6 rounded-full border-2 border-white object-cover shadow-2xs" />
            </li>
          )}
          {avatar2 && (
            <li>
              <img src={avatar2} alt={imgAlt2 || 'operator 2'} className="w-6 h-6 rounded-full border-2 border-white object-cover shadow-2xs" />
            </li>
          )}
          <li>
            <button
              onClick={(e) => e.preventDefault()}
              className="btn-add"
              title="Add dispatch threshold"
            >
              <Plus className="w-3 h-3" />
            </button>
          </li>
        </ul>

        <span className="btn-countdown text-[11px] font-mono font-bold">
          {countdownText}
        </span>
      </div>
    </div>
  );
};

export default KpiCard;

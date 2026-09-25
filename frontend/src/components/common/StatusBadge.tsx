import React from 'react';
import clsx from 'clsx';
import { OperatingMode, LoadCriticality, AlertSeverity } from '@/types';

interface StatusBadgeProps {
  status: OperatingMode | LoadCriticality | AlertSeverity | 'OPTIMAL' | 'DEGRADED' | 'RUNNING' | 'MODULATED' | 'IDLE' | 'SHED' | 'CHARGING' | 'DISCHARGING';
  className?: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className, size = 'sm' }) => {
  const getBadgeStyle = () => {
    switch (status) {
      case 'OPTIMAL':
      case 'NORMAL':
      case 'RUNNING':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'CHARGING':
      case 'HIGH':
      case 'HIGH DEMAND':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'MODULATED':
      case 'MEDIUM':
      case 'WARNING':
      case 'PEAK RISK':
      case 'HIGH TARIFF':
      case 'LOW RENEWABLE':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'CRITICAL':
      case 'DEGRADED':
      case 'SHED':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'FLEXIBLE':
      case 'DISCHARGING':
      case 'BATTERY RESERVE':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'IDLE':
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  const getDotStyle = () => {
    switch (status) {
      case 'OPTIMAL':
      case 'NORMAL':
      case 'RUNNING':
        return 'bg-emerald-500';
      case 'CHARGING':
      case 'HIGH':
      case 'HIGH DEMAND':
        return 'bg-blue-500';
      case 'MODULATED':
      case 'MEDIUM':
      case 'WARNING':
      case 'PEAK RISK':
      case 'HIGH TARIFF':
      case 'LOW RENEWABLE':
        return 'bg-amber-500';
      case 'CRITICAL':
      case 'DEGRADED':
      case 'SHED':
        return 'bg-rose-500';
      case 'FLEXIBLE':
      case 'DISCHARGING':
      case 'BATTERY RESERVE':
        return 'bg-indigo-500';
      case 'IDLE':
      default:
        return 'bg-slate-400';
    }
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 font-medium border rounded-full uppercase tracking-wider',
        size === 'sm' ? 'px-2.5 py-0.5 text-[11px]' : 'px-3 py-1 text-xs',
        getBadgeStyle(),
        className
      )}
    >
      <span className={clsx('w-1.5 h-1.5 rounded-full animate-pulse', getDotStyle())} />
      {status}
    </span>
  );
};

export const MetricTrend: React.FC<{
  trend: number;
  direction: 'up' | 'down' | 'neutral';
  isPositive: boolean;
}> = ({ trend, direction, isPositive }) => {
  const isGood = isPositive;
  const colorClass = isGood ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50';

  return (
    <span className={clsx('inline-flex items-center text-xs font-semibold px-1.5 py-0.5 rounded', colorClass)}>
      {direction === 'up' ? '↑' : direction === 'down' ? '↓' : '→'} {Math.abs(trend)}%
    </span>
  );
};

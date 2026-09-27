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
        return 'bg-emerald-500/10 light:bg-emerald-50 text-emerald-400 light:text-emerald-700 border-emerald-500/30 light:border-emerald-200';
      case 'CHARGING':
      case 'HIGH':
      case 'HIGH DEMAND':
        return 'bg-cyan-500/10 light:bg-blue-50 text-cyan-400 light:text-blue-700 border-cyan-500/30 light:border-blue-200';
      case 'MODULATED':
      case 'MEDIUM':
      case 'WARNING':
      case 'PEAK RISK':
      case 'HIGH TARIFF':
      case 'LOW RENEWABLE':
        return 'bg-amber-500/10 light:bg-amber-50 text-amber-400 light:text-amber-700 border-amber-500/30 light:border-amber-200';
      case 'CRITICAL':
      case 'DEGRADED':
      case 'SHED':
        return 'bg-rose-500/10 light:bg-rose-50 text-rose-400 light:text-rose-700 border-rose-500/30 light:border-rose-200';
      case 'FLEXIBLE':
      case 'DISCHARGING':
      case 'BATTERY RESERVE':
        return 'bg-indigo-500/10 light:bg-indigo-50 text-indigo-400 light:text-indigo-700 border-indigo-500/30 light:border-indigo-200';
      case 'IDLE':
      default:
        return 'bg-slate-800 light:bg-slate-50 text-slate-300 light:text-slate-600 border-slate-700 light:border-slate-200';
    }
  };

  const getDotStyle = () => {
    switch (status) {
      case 'OPTIMAL':
      case 'NORMAL':
      case 'RUNNING':
        return 'bg-emerald-400 shadow-sm shadow-emerald-400/50';
      case 'CHARGING':
      case 'HIGH':
      case 'HIGH DEMAND':
        return 'bg-cyan-400 shadow-sm shadow-cyan-400/50';
      case 'MODULATED':
      case 'MEDIUM':
      case 'WARNING':
      case 'PEAK RISK':
      case 'HIGH TARIFF':
      case 'LOW RENEWABLE':
        return 'bg-amber-400 shadow-sm shadow-amber-400/50';
      case 'CRITICAL':
      case 'DEGRADED':
      case 'SHED':
        return 'bg-rose-400 shadow-sm shadow-rose-400/50';
      case 'FLEXIBLE':
      case 'DISCHARGING':
      case 'BATTERY RESERVE':
        return 'bg-indigo-400 shadow-sm shadow-indigo-400/50';
      case 'IDLE':
      default:
        return 'bg-slate-400';
    }
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 font-bold border rounded-full uppercase tracking-wider font-mono',
        size === 'sm' ? 'px-2.5 py-0.5 text-[10px]' : 'px-3 py-1 text-xs',
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
  const colorClass = isGood 
    ? 'text-emerald-400 light:text-emerald-700 bg-emerald-500/10 light:bg-emerald-50 border border-emerald-500/20' 
    : 'text-rose-400 light:text-rose-700 bg-rose-500/10 light:bg-rose-50 border border-rose-500/20';

  return (
    <span className={clsx('inline-flex items-center text-[11px] font-bold font-mono px-2 py-0.5 rounded-lg', colorClass)}>
      {direction === 'up' ? '↑' : direction === 'down' ? '↓' : '→'} {Math.abs(trend)}%
    </span>
  );
};

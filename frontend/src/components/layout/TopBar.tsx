import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Clock, 
  Bell, 
  RefreshCw,
  Search,
  Sparkles
} from 'lucide-react';
import { PlantSummary, SystemAlert } from '@/types';
import clsx from 'clsx';

interface TopBarProps {
  plant: PlantSummary | null;
  alerts: SystemAlert[];
  currentRole: 'ADMIN' | 'ENERGY_MANAGER' | 'OPERATOR';
  onRoleChange: (role: 'ADMIN' | 'ENERGY_MANAGER' | 'OPERATOR') => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  onOpenAlerts: () => void;
  onOpenCommandPalette?: () => void;
  onTriggerOptimize?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  plant,
  alerts,
  currentRole,
  onRoleChange,
  onRefresh,
  isRefreshing,
  onOpenAlerts,
  onOpenCommandPalette,
  onTriggerOptimize
}) => {
  const [timeStr, setTimeStr] = useState<string>('');
  const unacknowledgedCount = alerts.filter(a => !a.acknowledged).length;

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-[#E2E8F0] px-5 sm:px-6 flex items-center justify-between text-[#0F172A] transition-colors shadow-xs gap-4">
      {/* Left: Clean Plant Identity & Telemetry Status */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-9 h-9 rounded-xl bg-sky-50 border border-sky-200 text-[#0EA5E9] flex items-center justify-center shadow-xs shrink-0">
          <Building2 className="w-4.5 h-4.5" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-bold text-[#0F172A] tracking-tight font-sans truncate">
              {plant ? plant.name : 'ELCOT Advanced Precision Manufacturing Hub'}
            </h1>
            <span className="shrink-0 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-mono font-semibold whitespace-nowrap leading-none">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Telemetry
            </span>
          </div>
          <p className="text-[11px] text-[#64748B] font-mono truncate">
            {plant ? plant.location : 'Chennai Zone 4'} • 50.0 Hz Nominal
          </p>
        </div>
      </div>

      {/* Center: Clean Search Bar Centered with Equal Margins */}
      <div className="flex-1 hidden md:flex justify-center max-w-md mx-2">
        {onOpenCommandPalette && (
          <button
            onClick={onOpenCommandPalette}
            className="w-full flex items-center justify-between gap-2 px-3.5 h-9 bg-[#F4F7FA] hover:bg-slate-100 border border-[#E2E8F0] hover:border-slate-300 rounded-lg text-xs text-[#64748B] transition-all cursor-pointer shadow-2xs"
          >
            <div className="flex items-center gap-2 min-w-0">
              <Search className="w-3.5 h-3.5 text-[#0EA5E9] shrink-0" />
              <span className="font-sans text-xs truncate">Search assets, commands...</span>
            </div>
            <kbd className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-white text-[#64748B] border border-[#E2E8F0] shadow-2xs shrink-0">
              ⌘K
            </kbd>
          </button>
        )}
      </div>

      {/* Right: Clean Action Controls with Uniform Heights (h-9) and Balanced Spacing */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Live Clock Chip */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 h-9 bg-[#F4F7FA] border border-[#E2E8F0] rounded-lg text-xs font-mono text-[#0F172A] shadow-2xs">
          <Clock className="w-3.5 h-3.5 text-[#0EA5E9]" />
          <span>{timeStr || '12:00'}</span>
        </div>

        {/* Quick Optimize Action */}
        {onTriggerOptimize && (
          <button
            onClick={onTriggerOptimize}
            className="flex items-center gap-1.5 px-3.5 h-9 bg-[#0EA5E9] hover:bg-[#0284C7] text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer shrink-0"
            title="Solve Automated MILP Optimization"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Optimize</span>
          </button>
        )}

        {/* Sync Button */}
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="w-9 h-9 flex items-center justify-center text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100 rounded-lg border border-transparent hover:border-[#E2E8F0] transition-colors cursor-pointer shrink-0"
          title="Sync Telemetry"
        >
          <RefreshCw className={clsx('w-4 h-4', isRefreshing && 'animate-spin text-[#0EA5E9]')} />
        </button>

        {/* Alerts Bell */}
        <button
          onClick={onOpenAlerts}
          className="relative w-9 h-9 flex items-center justify-center text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100 rounded-lg border border-transparent hover:border-[#E2E8F0] transition-colors cursor-pointer shrink-0"
          title="System Alerts"
        >
          <Bell className="w-4 h-4" />
          {unacknowledgedCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#EF4444] ring-2 ring-white animate-pulse" />
          )}
        </button>

        {/* Divider */}
        <div className="h-5 w-px bg-[#E2E8F0] mx-0.5 shrink-0" />

        {/* User Role Selector */}
        <div className="flex items-center gap-1.5 bg-[#F4F7FA] border border-[#E2E8F0] rounded-lg px-2.5 h-9 shadow-2xs shrink-0">
          <div className="w-5 h-5 rounded-full bg-[#0EA5E9] text-white flex items-center justify-center text-[10px] font-bold shrink-0">
            {currentRole === 'ADMIN' ? 'AD' : currentRole === 'OPERATOR' ? 'OP' : 'EM'}
          </div>
          <select
            value={currentRole}
            onChange={(e) => onRoleChange(e.target.value as any)}
            className="bg-transparent text-xs font-medium text-[#0F172A] focus:outline-hidden cursor-pointer"
          >
            <option value="ENERGY_MANAGER" className="bg-white text-[#0F172A]">Energy Manager</option>
            <option value="OPERATOR" className="bg-white text-[#0F172A]">Plant Operator</option>
            <option value="ADMIN" className="bg-white text-[#0F172A]">System Admin</option>
          </select>
        </div>
      </div>
    </header>
  );
};

export default TopBar;

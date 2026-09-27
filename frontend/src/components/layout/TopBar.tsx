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
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-[#E2E8F0] px-6 flex items-center justify-between text-[#0F172A] transition-colors shadow-xs">
      {/* Left: Clean Plant Identity & SCADA Status */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-sky-50 border border-sky-200 text-[#0EA5E9] flex items-center justify-center shadow-xs">
            <Building2 className="w-4.5 h-4.5" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-sm font-bold text-[#0F172A] tracking-tight font-sans">
                {plant ? plant.name : 'ELCOT Advanced Precision Manufacturing Hub'}
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-mono font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                Live SCADA
              </span>
            </div>
            <p className="text-[11px] text-[#64748B] font-mono">
              {plant ? plant.location : 'Chennai Zone 4'} • 50.0 Hz Nominal
            </p>
          </div>
        </div>
      </div>

      {/* Center: Clean Light Search Bar */}
      {onOpenCommandPalette && (
        <button
          onClick={onOpenCommandPalette}
          className="hidden md:flex items-center gap-2.5 px-4 py-1.5 bg-[#F4F7FA] hover:bg-slate-100 border border-[#E2E8F0] hover:border-slate-300 rounded-full text-xs text-[#64748B] transition-all cursor-pointer w-72 justify-between"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-[#0EA5E9]" />
            <span className="font-sans text-xs">Search assets, commands...</span>
          </div>
          <kbd className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-white text-[#64748B] border border-[#E2E8F0] shadow-2xs">
            ⌘K
          </kbd>
        </button>
      )}

      {/* Right: Clean SaaS Action Controls */}
      <div className="flex items-center gap-2.5">
        {/* Live Clock Chip */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 bg-[#F4F7FA] border border-[#E2E8F0] rounded-lg text-xs font-mono text-[#0F172A]">
          <Clock className="w-3.5 h-3.5 text-[#0EA5E9]" />
          <span>{timeStr || '12:00'}</span>
        </div>

        {/* Quick Optimize Action */}
        {onTriggerOptimize && (
          <button
            onClick={onTriggerOptimize}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#0EA5E9] hover:bg-[#0284C7] text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
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
          className="p-2 text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          title="Sync Telemetry"
        >
          <RefreshCw className={clsx('w-4 h-4', isRefreshing && 'animate-spin text-[#0EA5E9]')} />
        </button>

        {/* Alerts Bell */}
        <button
          onClick={onOpenAlerts}
          className="relative p-2 text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          title="System Alerts"
        >
          <Bell className="w-4 h-4" />
          {unacknowledgedCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#EF4444] ring-2 ring-white animate-pulse" />
          )}
        </button>

        {/* User Role Pill */}
        <div className="h-5 w-px bg-[#E2E8F0] mx-1" />
        <div className="flex items-center gap-1.5 bg-[#F4F7FA] border border-[#E2E8F0] rounded-lg px-2.5 py-1">
          <div className="w-5 h-5 rounded-full bg-[#0EA5E9] text-white flex items-center justify-center text-[10px] font-bold">
            EM
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

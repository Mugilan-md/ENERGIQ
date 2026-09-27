import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Activity, 
  Clock, 
  Bell, 
  UserCheck, 
  ShieldCheck, 
  RefreshCw,
  Sun,
  Moon,
  Search,
  Sparkles,
  ChevronDown
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
  isDarkMode?: boolean;
  onToggleTheme?: () => void;
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
  isDarkMode = true,
  onToggleTheme,
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
    <header className="sticky top-0 z-30 h-16 bg-slate-900/80 light:bg-white/80 backdrop-blur-xl border-b border-slate-800/60 light:border-slate-200/80 px-6 flex items-center justify-between transition-colors">
      {/* Left: Clean Plant Identity & SCADA Status */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500/20 via-sky-500/10 to-indigo-500/20 border border-cyan-500/25 light:border-cyan-300 text-cyan-400 light:text-cyan-700 flex items-center justify-center shadow-xs">
            <Building2 className="w-4.5 h-4.5" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-sm font-bold text-slate-100 light:text-slate-900 tracking-tight font-sans">
                {plant ? plant.name : 'ELCOT Advanced Manufacturing Hub'}
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 light:bg-emerald-50 text-emerald-400 light:text-emerald-700 border border-emerald-500/20 text-[10px] font-mono font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live SCADA
              </span>
            </div>
            <p className="text-[11px] text-slate-400 light:text-slate-500 font-mono">
              {plant ? plant.location : 'Chennai Zone 4'} • 50.0 Hz Nominal
            </p>
          </div>
        </div>
      </div>

      {/* Center: Sleek Quick Command Bar */}
      {onOpenCommandPalette && (
        <button
          onClick={onOpenCommandPalette}
          className="hidden md:flex items-center gap-2.5 px-4 py-1.5 bg-slate-950/40 hover:bg-slate-950/60 light:bg-slate-100 light:hover:bg-slate-200/70 border border-slate-800/80 light:border-slate-200 rounded-full text-xs text-slate-400 light:text-slate-500 transition-all cursor-pointer shadow-inner w-72 justify-between"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-cyan-400 light:text-cyan-600" />
            <span className="font-sans text-xs">Search assets, commands...</span>
          </div>
          <kbd className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-slate-800 light:bg-white text-slate-400 light:text-slate-600 border border-slate-700 light:border-slate-200">
            ⌘K
          </kbd>
        </button>
      )}

      {/* Right: Clean, Evenly Spaced Action Controls */}
      <div className="flex items-center gap-2.5">
        {/* Live Clock Chip */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 bg-slate-950/40 light:bg-slate-100 border border-slate-800/70 light:border-slate-200 rounded-lg text-xs font-mono text-slate-300 light:text-slate-600">
          <Clock className="w-3.5 h-3.5 text-cyan-400 light:text-cyan-600" />
          <span>{timeStr || '12:00'}</span>
        </div>

        {/* Quick Optimize Action */}
        {onTriggerOptimize && (
          <button
            onClick={onTriggerOptimize}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-all cursor-pointer hover:shadow-cyan-500/20 hover:scale-102"
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
          className="p-2 text-slate-400 hover:text-slate-200 light:text-slate-500 light:hover:text-slate-800 hover:bg-slate-800/60 light:hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          title="Sync Telemetry"
        >
          <RefreshCw className={clsx('w-4 h-4', isRefreshing && 'animate-spin text-cyan-400')} />
        </button>

        {/* Alerts Bell */}
        <button
          onClick={onOpenAlerts}
          className="relative p-2 text-slate-400 hover:text-slate-200 light:text-slate-500 light:hover:text-slate-800 hover:bg-slate-800/60 light:hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          title="System Alerts"
        >
          <Bell className="w-4 h-4" />
          {unacknowledgedCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-slate-900 light:ring-white animate-pulse" />
          )}
        </button>

        {/* Theme Switcher */}
        {onToggleTheme && (
          <button
            onClick={onToggleTheme}
            className="p-2 text-slate-400 hover:text-slate-200 light:text-slate-500 light:hover:text-slate-800 hover:bg-slate-800/60 light:hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600" />
            )}
          </button>
        )}

        {/* User Role Pill */}
        <div className="h-5 w-px bg-slate-800 light:bg-slate-200 mx-1" />
        <div className="flex items-center gap-1.5 bg-slate-950/50 light:bg-slate-100 border border-slate-800/80 light:border-slate-200 rounded-lg px-2.5 py-1">
          <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-cyan-600 to-indigo-600 text-white flex items-center justify-center text-[10px] font-bold">
            EM
          </div>
          <select
            value={currentRole}
            onChange={(e) => onRoleChange(e.target.value as any)}
            className="bg-transparent text-xs font-medium text-slate-300 light:text-slate-700 focus:outline-hidden cursor-pointer"
          >
            <option value="ENERGY_MANAGER">Energy Manager</option>
            <option value="OPERATOR">Plant Operator</option>
            <option value="ADMIN">System Admin</option>
          </select>
        </div>
      </div>
    </header>
  );
};

import React from 'react';
import { 
  Building2, 
  Activity, 
  Clock, 
  Bell, 
  UserCheck, 
  ShieldCheck, 
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { PlantSummary, SystemAlert } from '@/types';
import { StatusBadge } from '@/components/common/StatusBadge';

interface TopBarProps {
  plant: PlantSummary | null;
  alerts: SystemAlert[];
  currentRole: 'ADMIN' | 'ENERGY_MANAGER' | 'OPERATOR';
  onRoleChange: (role: 'ADMIN' | 'ENERGY_MANAGER' | 'OPERATOR') => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  onOpenAlerts: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  plant,
  alerts,
  currentRole,
  onRoleChange,
  onRefresh,
  isRefreshing,
  onOpenAlerts
}) => {
  const unacknowledgedCount = alerts.filter(a => !a.acknowledged).length;

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-6 py-3 transition-all">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Plant Selector & Identity */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-sky-50 text-sky-600 rounded-lg border border-sky-100 shadow-xs">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold text-slate-900 tracking-tight">
                  {plant ? plant.name : 'ENERGIQ Industrial Hub'}
                </h1>
                <span className="text-[10px] font-semibold tracking-wider px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                  {plant ? plant.location : 'Chennai Zone 4'}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                <span>Solar: <strong className="text-slate-700">650 kWp</strong></span>
                <span className="text-slate-300">•</span>
                <span>BESS: <strong className="text-slate-700">800 kWh</strong></span>
                <span className="text-slate-300">•</span>
                <span>Grid Limit: <strong className="text-slate-700">500 kW</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Status Indicators & Controls */}
        <div className="flex items-center flex-wrap gap-3">
          {/* Operating Mode */}
          {plant && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Mode:</span>
              <StatusBadge status={plant.current_mode} size="sm" />
            </div>
          )}

          {/* System Health */}
          {plant && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg">
              <Activity className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-xs font-semibold text-slate-700">{plant.system_health}</span>
            </div>
          )}

          {/* Last Update & Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-2xs transition-colors"
            title="Refresh Live Telemetry"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-sky-600' : 'text-slate-400'}`} />
            <span className="hidden sm:inline">Telemetry Sync</span>
          </button>

          {/* Alerts Bell */}
          <button
            onClick={onOpenAlerts}
            className="relative p-2 text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-2xs transition-colors"
            aria-label="View system alerts"
          >
            <Bell className="w-4 h-4" />
            {unacknowledgedCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-xs">
                {unacknowledgedCount}
              </span>
            )}
          </button>

          {/* User Role Switcher */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="p-1.5 bg-slate-100 text-slate-600 rounded-full">
              <UserCheck className="w-4 h-4" />
            </div>
            <select
              value={currentRole}
              onChange={(e) => onRoleChange(e.target.value as any)}
              className="text-xs font-semibold bg-white border border-slate-200 text-slate-700 rounded-md px-2 py-1 shadow-2xs focus:outline-hidden focus:ring-1 focus:ring-sky-500"
            >
              <option value="ENERGY_MANAGER">Energy Manager</option>
              <option value="OPERATOR">Plant Operator</option>
              <option value="ADMIN">System Admin</option>
            </select>
          </div>
        </div>
      </div>

      {/* Safety Notice Sub-strip */}
      <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-sky-600 shrink-0" />
          <span>
            <strong>DECISION SUPPORT BOUNDARY:</strong> Operational recommendations and schedules require authorized human approval before SCADA dispatch.
          </span>
        </div>
        <span className="hidden md:inline font-mono text-[10px] text-slate-400">
          MILP CBC Solver Active • High-Fidelity Twin Link
        </span>
      </div>
    </header>
  );
};

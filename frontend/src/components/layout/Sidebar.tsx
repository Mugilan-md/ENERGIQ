import React from 'react';
import {
  LayoutDashboard,
  SunMedium,
  GitFork,
  Factory,
  BatteryCharging,
  Zap,
  Cpu,
  SlidersHorizontal,
  Box,
  BarChart3,
  BellRing,
  Settings,
  Flame,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import clsx from 'clsx';

export type NavSection =
  | 'dashboard'
  | 'forecast'
  | 'energyflow'
  | 'loads'
  | 'battery'
  | 'grid'
  | 'optimization'
  | 'simulator'
  | 'digitaltwin'
  | 'analytics'
  | 'alerts'
  | 'settings';

interface SidebarProps {
  currentSection: NavSection;
  onSelectSection: (section: NavSection) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentSection,
  onSelectSection,
  collapsed,
  onToggleCollapse
}) => {
  const navItems: Array<{
    id: NavSection;
    label: string;
    icon: React.ElementType;
    badge?: string;
  }> = [
    { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
    { id: 'forecast', label: 'Renewable Forecast', icon: SunMedium, badge: 'ML' },
    { id: 'energyflow', label: 'Live Energy Flow', icon: GitFork },
    { id: 'loads', label: 'Industrial Loads', icon: Factory },
    { id: 'battery', label: 'Battery Intelligence', icon: BatteryCharging },
    { id: 'grid', label: 'Grid & Tariffs', icon: Zap },
    { id: 'optimization', label: 'AI Optimization', icon: Cpu, badge: 'MILP' },
    { id: 'simulator', label: 'What-If Simulator', icon: SlidersHorizontal },
    { id: 'digitaltwin', label: 'Digital Twin', icon: Box },
    { id: 'analytics', label: 'Historical Analytics', icon: BarChart3 },
    { id: 'alerts', label: 'Alerts & Actions', icon: BellRing },
    { id: 'settings', label: 'System Settings', icon: Settings },
  ];

  return (
    <aside
      className={clsx(
        'relative flex flex-col bg-white border-r border-slate-200 transition-all duration-300 z-40 select-none shadow-xs',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Brand Identity Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-slate-200">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-teal-500 text-white shadow-md shadow-sky-500/20 shrink-0">
            <Flame className="w-5 h-5 fill-white/20" />
          </div>
          {!collapsed && (
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg text-slate-900 tracking-tight">ENERGIQ</span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-sky-100 text-sky-700">AI</span>
              </div>
              <p className="text-[10px] font-medium text-slate-400 tracking-wider uppercase">Energy Orchestrator</p>
            </div>
          )}
        </div>
        
        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentSection === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectSection(item.id)}
              className={clsx(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all group',
                isActive
                  ? 'bg-sky-50 text-sky-700 font-semibold shadow-xs border border-sky-100'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon
                className={clsx(
                  'w-5 h-5 shrink-0 transition-colors',
                  isActive ? 'text-sky-600' : 'text-slate-400 group-hover:text-slate-600'
                )}
              />
              {!collapsed && (
                <div className="flex-1 flex items-center justify-between text-left">
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 uppercase">
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer System Badge */}
      {!collapsed && (
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 m-3 rounded-xl border">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold text-slate-700">Platform Status</span>
            <span className="flex items-center gap-1 text-[11px] text-emerald-600 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              ONLINE
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            PuLP MILP Model v1.4 <br />
            ELCOT Industrial Microgrid
          </p>
        </div>
      )}
    </aside>
  );
};

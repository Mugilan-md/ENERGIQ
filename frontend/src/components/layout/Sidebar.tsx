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
  ChevronLeft,
  ChevronRight,
  Flame,
  Sparkles
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

interface NavGroup {
  groupTitle: string;
  items: Array<{
    id: NavSection;
    label: string;
    icon: React.ElementType;
    badge?: string;
    badgeColor?: string;
  }>;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentSection,
  onSelectSection,
  collapsed,
  onToggleCollapse
}) => {
  const navGroups: NavGroup[] = [
    {
      groupTitle: 'Operations',
      items: [
        { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
        { id: 'energyflow', label: 'Live Energy Flow', icon: GitFork, badge: 'Live', badgeColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
        { id: 'digitaltwin', label: 'Digital Twin Model', icon: Box },
      ]
    },
    {
      groupTitle: 'AI & Dispatch',
      items: [
        { id: 'forecast', label: 'Renewable Forecast', icon: SunMedium, badge: 'ML', badgeColor: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30' },
        { id: 'optimization', label: 'AI Optimization', icon: Cpu, badge: 'MILP', badgeColor: 'bg-purple-500/15 text-purple-400 border-purple-500/30' },
        { id: 'simulator', label: 'What-If Simulator', icon: SlidersHorizontal, badge: 'MPC', badgeColor: 'bg-amber-500/15 text-amber-400 border-amber-500/30' },
      ]
    },
    {
      groupTitle: 'Facility Assets',
      items: [
        { id: 'loads', label: 'Industrial Loads', icon: Factory },
        { id: 'battery', label: 'Battery Storage', icon: BatteryCharging },
        { id: 'grid', label: 'Grid & Tariffs', icon: Zap },
      ]
    },
    {
      groupTitle: 'System & Audit',
      items: [
        { id: 'analytics', label: 'Historical Analytics', icon: BarChart3 },
        { id: 'alerts', label: 'Alerts & Actions', icon: BellRing },
        { id: 'settings', label: 'Settings', icon: Settings },
      ]
    }
  ];

  return (
    <aside
      className={clsx(
        'relative flex flex-col bg-slate-900/95 light:bg-white border-r border-slate-800/70 light:border-slate-200 transition-all duration-300 z-40 select-none shadow-xl shadow-black/20 light:shadow-slate-200/50',
        collapsed ? 'w-18' : 'w-60'
      )}
    >
      {/* Brand Identity Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-slate-800/60 light:border-slate-200">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white flex items-center justify-center shadow-md shadow-cyan-500/20 shrink-0">
            <Flame className="w-4 h-4 fill-white/20 animate-pulse-glow" />
          </div>
          {!collapsed && (
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base text-white light:text-slate-900 tracking-tight font-sans">
                ENERGIQ
              </span>
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-400 light:text-cyan-700 font-mono">
                AI
              </span>
            </div>
          )}
        </div>
        
        <button
          onClick={onToggleCollapse}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-200 light:hover:text-slate-700 hover:bg-slate-800/60 light:hover:bg-slate-100 transition-colors cursor-pointer"
          title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1 overflow-y-auto px-2.5 py-3 space-y-3.5">
        {navGroups.map((group, groupIdx) => (
          <div key={groupIdx} className="space-y-0.5">
            {!collapsed && (
              <div className="px-3 pt-1.5 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-500 light:text-slate-400 font-mono">
                {group.groupTitle}
              </div>
            )}
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = currentSection === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => onSelectSection(item.id)}
                  className={clsx(
                    'w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all group relative cursor-pointer',
                    isActive
                      ? 'bg-cyan-500/10 light:bg-slate-100 text-cyan-400 light:text-cyan-700 font-semibold shadow-xs'
                      : 'text-slate-400 light:text-slate-600 hover:text-slate-200 light:hover:text-slate-900 hover:bg-slate-800/40 light:hover:bg-slate-50'
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  {/* Subtle active left highlight */}
                  {isActive && (
                    <div className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-cyan-400 light:bg-cyan-600 shadow-sm shadow-cyan-400/50" />
                  )}
                  
                  <Icon
                    className={clsx(
                      'w-4 h-4 shrink-0 transition-transform duration-150 group-hover:scale-105',
                      isActive ? 'text-cyan-400 light:text-cyan-600' : 'text-slate-400'
                    )}
                  />

                  {!collapsed && (
                    <div className="flex-1 flex items-center justify-between text-left overflow-hidden">
                      <span className="truncate tracking-tight font-sans">{item.label}</span>
                      {item.badge && (
                        <span className={clsx(
                          'text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border uppercase shrink-0',
                          item.badgeColor || 'bg-slate-800 text-slate-400 border-slate-700'
                        )}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer System Telemetry Diagnostic Badge */}
      <div className="p-3 border-t border-slate-800/60 light:border-slate-200 bg-slate-950/40 light:bg-slate-50/50">
        {!collapsed ? (
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>CBC Solver</span>
            </span>
            <span className="text-cyan-400 light:text-cyan-600 font-semibold">&lt;12ms</span>
          </div>
        ) : (
          <div className="flex justify-center" title="System Online: PuLP CBC Engine (<12ms)">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        )}
      </div>
    </aside>
  );
};

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
  Flame
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
        { id: 'energyflow', label: 'Live Energy Flow', icon: GitFork, badge: 'Live', badgeColor: 'bg-emerald-50 text-[#10B981] border-emerald-200' },
        { id: 'digitaltwin', label: 'Digital Twin Model', icon: Box },
      ]
    },
    {
      groupTitle: 'AI & Dispatch',
      items: [
        { id: 'forecast', label: 'Renewable Forecast', icon: SunMedium, badge: 'ML', badgeColor: 'bg-sky-50 text-[#0EA5E9] border-sky-200' },
        { id: 'optimization', label: 'AI Optimization', icon: Cpu, badge: 'MILP', badgeColor: 'bg-purple-50 text-[#8B5CF6] border-purple-200' },
        { id: 'simulator', label: 'What-If Simulator', icon: SlidersHorizontal, badge: 'MPC', badgeColor: 'bg-amber-50 text-[#F59E0B] border-amber-200' },
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
        'relative flex flex-col bg-white border-r border-[#E2E8F0] transition-all duration-300 z-40 select-none shadow-xs',
        collapsed ? 'w-18' : 'w-60'
      )}
    >
      {/* Brand Identity Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-8 h-8 rounded-xl bg-[#0EA5E9] text-white flex items-center justify-center shadow-xs shrink-0">
            <Flame className="w-4.5 h-4.5 fill-white/20" />
          </div>
          {!collapsed && (
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base text-[#0F172A] tracking-tight font-sans">
                ENERGIQ
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-sky-50 text-[#0EA5E9] font-mono border border-sky-200">
                SCADA
              </span>
            </div>
          )}
        </div>
        
        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100 transition-colors cursor-pointer"
          title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1 overflow-y-auto px-2.5 py-3 space-y-3">
        {navGroups.map((group, groupIdx) => (
          <div key={groupIdx} className="space-y-0.5">
            {!collapsed && (
              <div className="px-3 pt-1.5 pb-1 text-[11px] font-bold uppercase tracking-wider text-[#64748B] font-mono">
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
                    'w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all group relative cursor-pointer border border-transparent',
                    isActive
                      ? 'bg-[#F0F9FF] text-[#0F172A] font-semibold'
                      : 'text-[#64748B] hover:text-[#0F172A] hover:bg-slate-50'
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  {/* Clean thin blue left indicator (no glowing cyan pill) */}
                  {isActive && (
                    <div className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-[#0EA5E9]" />
                  )}
                  
                  <Icon
                    className={clsx(
                      'w-4 h-4 shrink-0 transition-transform duration-150',
                      isActive ? 'text-[#0EA5E9]' : 'text-[#64748B] group-hover:text-[#0F172A]'
                    )}
                  />

                  {!collapsed && (
                    <div className="flex-1 flex items-center justify-between text-left overflow-hidden">
                      <span className="truncate tracking-tight font-sans">{item.label}</span>
                      {item.badge && (
                        <span className={clsx(
                          'text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border uppercase shrink-0',
                          item.badgeColor || 'bg-slate-100 text-slate-600 border-slate-200'
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
      <div className="p-3 border-t border-[#E2E8F0] bg-[#F8FAFC]">
        {!collapsed ? (
          <div className="flex items-center justify-between text-[11px] font-mono text-[#64748B]">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
              <span>CBC Solver</span>
            </span>
            <span className="text-[#0EA5E9] font-bold">&lt;12ms</span>
          </div>
        ) : (
          <div className="flex justify-center" title="CBC Solver Online (<12ms)">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;

import React, { useState, useEffect } from 'react';
import {
  Search,
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
  Moon,
  Sun,
  X,
  Play,
  ArrowRight
} from 'lucide-react';
import { NavSection } from '@/components/layout/Sidebar';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSection: (section: NavSection) => void;
  onToggleTheme: () => void;
  isDarkMode: boolean;
  onRunOptimization: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectSection,
  onToggleTheme,
  isDarkMode,
  onRunOptimization
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open handled by parent or toggle
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const actions = [
    { id: 'dashboard', label: 'Executive Dashboard', category: 'Navigation', icon: LayoutDashboard, action: () => { onSelectSection('dashboard'); onClose(); } },
    { id: 'energyflow', label: 'Live Energy Flow Topology', category: 'Navigation', icon: GitFork, action: () => { onSelectSection('energyflow'); onClose(); } },
    { id: 'forecast', label: 'Renewable Forecast & Irradiance', category: 'AI & Dispatch', icon: SunMedium, action: () => { onSelectSection('forecast'); onClose(); } },
    { id: 'optimization', label: 'MILP Optimization Engine', category: 'AI & Dispatch', icon: Cpu, action: () => { onSelectSection('optimization'); onClose(); } },
    { id: 'simulator', label: 'What-If Simulation Sandbox', category: 'AI & Dispatch', icon: SlidersHorizontal, action: () => { onSelectSection('simulator'); onClose(); } },
    { id: 'loads', label: 'Industrial Loads & Machine Workcells', category: 'Facility Assets', icon: Factory, action: () => { onSelectSection('loads'); onClose(); } },
    { id: 'battery', label: 'BESS Battery Intelligence & Degradation', category: 'Facility Assets', icon: BatteryCharging, action: () => { onSelectSection('battery'); onClose(); } },
    { id: 'grid', label: 'Grid Tariffs & Time-of-Use Schedule', category: 'Facility Assets', icon: Zap, action: () => { onSelectSection('grid'); onClose(); } },
    { id: 'digitaltwin', label: 'Digital Twin Cyber-Physical Model', category: 'Operations', icon: Box, action: () => { onSelectSection('digitaltwin'); onClose(); } },
    { id: 'analytics', label: 'Historical Audit Analytics & Costs', category: 'Audit', icon: BarChart3, action: () => { onSelectSection('analytics'); onClose(); } },
    { id: 'alerts', label: 'System Alarms & Operator Alerts', category: 'Audit', icon: BellRing, action: () => { onSelectSection('alerts'); onClose(); } },
    { id: 'settings', label: 'System Configuration & Solver Limits', category: 'Settings', icon: Settings, action: () => { onSelectSection('settings'); onClose(); } },
    { id: 'run-opt', label: 'Trigger MILP Optimization Solve', category: 'Quick Action', icon: Play, action: () => { onRunOptimization(); onClose(); } },
    { id: 'theme-toggle', label: isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Command Center', category: 'Appearance', icon: isDarkMode ? Sun : Moon, action: () => { onToggleTheme(); onClose(); } }
  ];

  const filtered = actions.filter(a =>
    a.label.toLowerCase().includes(query.toLowerCase()) ||
    a.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-md transition-opacity">
      <div
        className="w-full max-w-2xl bg-slate-900 light:bg-white rounded-2xl border border-slate-700/80 light:border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-800 light:border-slate-200 gap-3">
          <Search className="w-5 h-5 text-cyan-400 light:text-cyan-600 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Type a command, asset name, or jump to section... (ESC to close)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-slate-100 light:text-slate-900 placeholder:text-slate-500 focus:outline-hidden"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-slate-400 hover:text-slate-200">
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-800 light:bg-slate-100 text-slate-400 border border-slate-700 light:border-slate-200">
            ESC
          </span>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">
              No actions or assets found matching "{query}"
            </div>
          ) : (
            filtered.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={item.action}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs hover:bg-slate-800/80 light:hover:bg-slate-100 text-slate-200 light:text-slate-800 transition-colors group cursor-pointer text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-800 light:bg-slate-100 text-cyan-400 light:text-cyan-600 group-hover:scale-105 transition-transform">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-semibold">{item.label}</span>
                      <span className="text-[10px] text-slate-500 block font-mono">
                        {item.category}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </button>
              );
            })
          )}
        </div>

        {/* Footer Shortcut Hints */}
        <div className="px-4 py-2.5 bg-slate-950/60 light:bg-slate-50 border-t border-slate-800/80 light:border-slate-200 text-[11px] text-slate-400 flex items-center justify-between font-mono">
          <span>Navigate with arrow keys</span>
          <span>ENTER to select</span>
        </div>
      </div>
    </div>
  );
};

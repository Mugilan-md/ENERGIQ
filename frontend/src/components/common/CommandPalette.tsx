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
  X,
  Play,
  ArrowRight
} from 'lucide-react';
import { NavSection } from '@/components/layout/Sidebar';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSection: (section: NavSection) => void;
  onRunOptimization: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectSection,
  onRunOptimization
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
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
    {
      id: 'opt',
      label: 'Execute MILP Optimization Dispatch',
      category: 'Autonomous Control',
      icon: Play,
      action: () => {
        onRunOptimization();
        onClose();
      }
    },
    {
      id: 'dash',
      label: 'Executive Command Center',
      category: 'Navigation',
      icon: LayoutDashboard,
      action: () => {
        onSelectSection('dashboard');
        onClose();
      }
    },
    {
      id: 'flow',
      label: 'Live Energy Flow Topology',
      category: 'Telemetry',
      icon: GitFork,
      action: () => {
        onSelectSection('energyflow');
        onClose();
      }
    },
    {
      id: 'forecast',
      label: '24h Generation & Load Forecast',
      category: 'Analytics & AI',
      icon: SunMedium,
      action: () => {
        onSelectSection('forecast');
        onClose();
      }
    },
    {
      id: 'loads',
      label: 'Industrial Workcell Loads',
      category: 'Facility Assets',
      icon: Factory,
      action: () => {
        onSelectSection('loads');
        onClose();
      }
    },
    {
      id: 'bess',
      label: 'BESS 800 kWh Storage Telemetry',
      category: 'Facility Assets',
      icon: BatteryCharging,
      action: () => {
        onSelectSection('battery');
        onClose();
      }
    },
    {
      id: 'grid',
      label: '11 kV Utility Substation & Tariffs',
      category: 'Grid Interconnect',
      icon: Zap,
      action: () => {
        onSelectSection('grid');
        onClose();
      }
    },
    {
      id: 'twin',
      label: '3D SCADA Digital Twin Model',
      category: 'Operations',
      icon: Box,
      action: () => {
        onSelectSection('digitaltwin');
        onClose();
      }
    },
    {
      id: 'sim',
      label: 'Parametric What-If Simulator',
      category: 'Optimization',
      icon: SlidersHorizontal,
      action: () => {
        onSelectSection('simulator');
        onClose();
      }
    },
    {
      id: 'alerts',
      label: 'System Alarms & Interlocks',
      category: 'Safety',
      icon: BellRing,
      action: () => {
        onSelectSection('alerts');
        onClose();
      }
    }
  ];

  const filtered = actions.filter(
    (a) =>
      a.label.toLowerCase().includes(query.toLowerCase()) ||
      a.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-md transition-opacity">
      <div
        className="w-full max-w-2xl bg-slate-950/85 backdrop-blur-2xl rounded-2xl border border-white/15 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-white/10 gap-3">
          <Search className="w-5 h-5 text-cyan-400 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Type a command, asset name, or jump to section... (ESC to close)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-white placeholder:text-slate-400 focus:outline-hidden"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-white/10 text-slate-300 border border-white/10">
            ESC
          </span>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No actions or assets found matching "{query}"
            </div>
          ) : (
            filtered.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={item.action}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs hover:bg-white/10 text-slate-200 transition-colors group cursor-pointer text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white/5 text-cyan-400 border border-white/10 group-hover:scale-105 transition-transform">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-semibold text-white">{item.label}</span>
                      <span className="text-[10px] text-slate-400 block font-mono">
                        {item.category}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </button>
              );
            })
          )}
        </div>

        {/* Footer Shortcut Hints */}
        <div className="px-4 py-2.5 bg-slate-950/60 border-t border-white/10 text-[11px] text-slate-400 flex items-center justify-between font-mono">
          <span>Navigate with arrow keys</span>
          <span>ENTER to select</span>
        </div>
      </div>
    </div>
  );
};

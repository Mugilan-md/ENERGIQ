import React, { useState } from 'react';
import { SystemAlert } from '@/types';
import { StatusBadge } from '@/components/common/StatusBadge';
import { 
  BellRing, 
  AlertTriangle, 
  Info, 
  CheckCircle2, 
  Check, 
  ShieldAlert,
  ArrowRight,
  ShieldCheck,
  Filter
} from 'lucide-react';
import clsx from 'clsx';

interface AlertsPanelProps {
  alerts: SystemAlert[];
  onAcknowledge: (alertId: string) => Promise<void>;
}

export const AlertsPanel: React.FC<AlertsPanelProps> = ({ alerts, onAcknowledge }) => {
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
  const unackCount = alerts.filter(a => !a.acknowledged).length;

  const filteredAlerts = alerts.filter(a => 
    filterSeverity === 'ALL' ? true : a.severity === filterSeverity
  );

  return (
    <div className="card-tilt bg-slate-900/80 light:bg-white rounded-2xl border border-slate-800/90 light:border-slate-200 p-6 shadow-2xl shadow-black/30 backdrop-blur-2xl relative overflow-hidden transition-colors">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 via-amber-500 to-cyan-500" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-rose-500/15 text-rose-400 border border-rose-500/30 shadow-sm">
              <BellRing className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base font-extrabold text-white light:text-slate-900 tracking-tight">
                  Intelligent Operational Alarms & Safety Alerts
                </h2>
                <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {alerts.length} Total
                </span>
                {unackCount > 0 && (
                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse">
                    {unackCount} Unacknowledged
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 light:text-slate-500 mt-1">
                Active threshold breaches, grid contract risks, and recommended human operator actions
              </p>
            </div>
          </div>
        </div>

        {/* Severity Filter Pills */}
        <div className="flex items-center bg-slate-950/80 light:bg-slate-100 p-1 rounded-xl border border-slate-800 light:border-slate-200 text-xs font-mono">
          {['ALL', 'CRITICAL', 'WARNING', 'INFO'].map((sev) => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={clsx(
                'px-3 py-1 font-bold rounded-lg uppercase tracking-wider transition-all cursor-pointer',
                filterSeverity === sev
                  ? sev === 'CRITICAL' ? 'bg-rose-600 text-white shadow-md' :
                    sev === 'WARNING' ? 'bg-amber-600 text-white shadow-md' :
                    sev === 'INFO' ? 'bg-cyan-600 text-white shadow-md' :
                    'bg-slate-700 text-white shadow-md'
                  : 'text-slate-400 light:text-slate-600 hover:text-white light:hover:text-slate-900'
              )}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl font-mono">
            No active alerts matching severity filter "{filterSeverity}"
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={clsx(
                'card-tilt-subtle p-4.5 rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 backdrop-blur-xl',
                alert.acknowledged
                  ? 'bg-slate-950/40 light:bg-slate-50/50 border-slate-800/60 light:border-slate-200 opacity-60'
                  : alert.severity === 'CRITICAL'
                  ? 'bg-rose-950/25 light:bg-rose-50/50 border-rose-500/40 light:border-rose-200 shadow-lg shadow-rose-950/20'
                  : alert.severity === 'WARNING'
                  ? 'bg-amber-950/25 light:bg-amber-50/50 border-amber-500/40 light:border-amber-200 shadow-lg shadow-amber-950/20'
                  : 'bg-cyan-950/25 light:bg-cyan-50/40 border-cyan-500/40 light:border-cyan-200 shadow-lg shadow-cyan-950/20'
              )}
            >
              <div className="flex items-start gap-3.5">
                <div
                  className={clsx(
                    'p-2.5 rounded-xl shrink-0 mt-0.5 shadow-sm',
                    alert.severity === 'CRITICAL'
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      : alert.severity === 'WARNING'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  )}
                >
                  {alert.severity === 'CRITICAL' ? (
                    <ShieldAlert className="w-5 h-5" />
                  ) : alert.severity === 'WARNING' ? (
                    <AlertTriangle className="w-5 h-5" />
                  ) : (
                    <Info className="w-5 h-5" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1.5">
                    <h3 className="text-sm font-extrabold text-white light:text-slate-900">{alert.title}</h3>
                    <StatusBadge status={alert.severity} size="sm" />
                    <span className="text-[10px] font-mono text-slate-400">
                      [{alert.component}] • {alert.timestamp}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 light:text-slate-600 mb-2.5 leading-relaxed">
                    {alert.description}
                  </p>

                  {/* Recommended Operator Action */}
                  <div className="text-xs bg-slate-950/70 light:bg-white p-2.5 rounded-lg border border-slate-800/80 light:border-slate-200 text-slate-300 light:text-slate-700 flex items-start gap-2 shadow-xs">
                    <strong className="text-cyan-400 light:text-cyan-700 shrink-0 font-mono">Action Directive:</strong>
                    <span>{alert.recommended_action}</span>
                  </div>
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-2">
                {alert.acknowledged ? (
                  <span className="inline-flex items-center gap-1.5 text-xs text-slate-400 font-mono px-3.5 py-1.5 bg-slate-800/60 light:bg-slate-100 rounded-xl border border-slate-700 light:border-slate-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Acknowledged
                  </span>
                ) : (
                  <button
                    onClick={() => onAcknowledge(alert.id)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-100 light:bg-white light:hover:bg-slate-50 light:text-slate-700 border border-slate-700 light:border-slate-300 text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer hover:scale-102 font-mono"
                  >
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Acknowledge</span>
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

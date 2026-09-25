import React from 'react';
import { SystemAlert } from '@/types';
import { StatusBadge } from '@/components/common/StatusBadge';
import { 
  BellRing, 
  AlertTriangle, 
  Info, 
  CheckCircle2, 
  Check, 
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import clsx from 'clsx';

interface AlertsPanelProps {
  alerts: SystemAlert[];
  onAcknowledge: (alertId: string) => Promise<void>;
}

export const AlertsPanel: React.FC<AlertsPanelProps> = ({ alerts, onAcknowledge }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <BellRing className="w-5 h-5 text-sky-600" />
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Intelligent Operational Alarms & Safety Alerts
            </h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              {alerts.length} Total
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Active threshold breaches, grid contract risks, and recommended human operator actions
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={clsx(
              'p-4 rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4',
              alert.acknowledged
                ? 'bg-slate-50/50 border-slate-200 opacity-60'
                : alert.severity === 'CRITICAL'
                ? 'bg-rose-50/40 border-rose-200 shadow-2xs'
                : alert.severity === 'WARNING'
                ? 'bg-amber-50/40 border-amber-200 shadow-2xs'
                : 'bg-sky-50/30 border-sky-200 shadow-2xs'
            )}
          >
            <div className="flex items-start gap-3">
              <div
                className={clsx(
                  'p-2 rounded-lg shrink-0 mt-0.5',
                  alert.severity === 'CRITICAL'
                    ? 'bg-rose-100 text-rose-700'
                    : alert.severity === 'WARNING'
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-sky-100 text-sky-700'
                )}
              >
                {alert.severity === 'CRITICAL' ? (
                  <ShieldAlert className="w-4 h-4" />
                ) : alert.severity === 'WARNING' ? (
                  <AlertTriangle className="w-4 h-4" />
                ) : (
                  <Info className="w-4 h-4" />
                )}
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h3 className="text-sm font-bold text-slate-900">{alert.title}</h3>
                  <StatusBadge status={alert.severity} size="sm" />
                  <span className="text-[10px] font-mono text-slate-400">
                    [{alert.component}] • {alert.timestamp}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mb-2 leading-relaxed">
                  {alert.description}
                </p>

                {/* Recommended Operator Action */}
                <div className="text-xs bg-white/90 p-2.5 rounded-lg border border-slate-200/70 text-slate-700 flex items-start gap-1.5">
                  <strong className="text-slate-900 shrink-0">Recommended Action:</strong>
                  <span>{alert.recommended_action}</span>
                </div>
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-2">
              {alert.acknowledged ? (
                <span className="inline-flex items-center gap-1 text-xs text-slate-500 font-medium px-3 py-1.5 bg-slate-100 rounded-lg">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Acknowledged
                </span>
              ) : (
                <button
                  onClick={() => onAcknowledge(alert.id)}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-bold rounded-lg shadow-2xs transition-all cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5 text-slate-600" />
                  <span>Acknowledge</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

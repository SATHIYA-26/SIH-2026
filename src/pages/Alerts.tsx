import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUIStore } from '../stores/uiStore';
import { useFieldStore } from '../stores/fieldStore';
import { Bell, AlertTriangle, CheckCircle, ArrowRight, CheckCheck, MapPin } from 'lucide-react';

export const Alerts: React.FC = () => {
  const navigate = useNavigate();
  const { alerts, markAlertRead, markAllAlertsRead } = useUIStore();
  const { setSelectedFieldId } = useFieldStore();

  const getSeverityStyle = (sev: string) => {
    switch (sev) {
      case 'critical':
        return 'bg-rose-50 border-rose-200 text-rose-800';
      case 'warning':
        return 'bg-amber-50 border-amber-200 text-amber-800';
      case 'success':
        return 'bg-emerald-50 border-emerald-200 text-emerald-800';
      default:
        return 'bg-sky-50 border-sky-200 text-sky-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Field Outbreak & Scouting Alerts
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Automated notifications for risk escalation, follow-up windows, and symptom changes
          </p>
        </div>

        <button
          onClick={markAllAlertsRead}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <CheckCheck className="w-4 h-4 text-slate-500" />
          <span>Mark All as Read</span>
        </button>
      </div>

      {/* Alert List */}
      <div className="space-y-3">
        {alerts.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500 text-xs">
            No active alerts at this time.
          </div>
        ) : (
          alerts.map((alt) => (
            <div
              key={alt.id}
              className={`bg-white border rounded-xl p-4 shadow-xs transition-all ${
                alt.isRead ? 'border-slate-200 opacity-80' : 'border-slate-300 ring-1 ring-slate-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg shrink-0 ${getSeverityStyle(alt.severity)}`}>
                    <Bell className="w-4 h-4" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{alt.fieldName}</span>
                      <span className="text-slate-300">·</span>
                      <span className="text-[11px] text-slate-400">{alt.timestamp}</span>
                      {!alt.isRead && (
                        <span className="text-[10px] font-bold bg-rose-100 text-rose-800 px-1.5 py-0.2 rounded-full">
                          NEW
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-semibold text-slate-900 mt-0.5">{alt.title}</h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{alt.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    onClick={() => {
                      markAlertRead(alt.id);
                      setSelectedFieldId(alt.fieldId);
                      navigate(alt.actionPath);
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                  >
                    <span>{alt.actionLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

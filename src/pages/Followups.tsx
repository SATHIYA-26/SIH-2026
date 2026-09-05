import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFieldStore } from '../stores/fieldStore';
import { StatusBadge } from '../components/common/StatusBadge';
import { Calendar, Clock, CheckCircle2, AlertTriangle, PlusCircle, ArrowRight, MapPin } from 'lucide-react';

export const Followups: React.FC = () => {
  const navigate = useNavigate();
  const { fields, setSelectedFieldId } = useFieldStore();

  const schedules = fields.map((f) => ({
    fieldId: f.id,
    fieldName: f.name,
    crop: f.crop,
    areaAcres: f.areaAcres,
    location: f.locationName,
    riskLevel: f.riskLevel,
    riskPercent: Math.round(f.riskProbability * 100),
    condition: f.currentConditionStatus,
    targetDate: f.latestAnalysis?.followup?.targetDate || 'September 9, 2026',
    daysRemaining: f.nextCheckDays,
    reason: f.latestAnalysis?.followup?.reason || 'Standard risk-based interval',
    isDue: f.nextCheckDays <= 2,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Field Follow-up Schedules
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Dynamic risk-calibrated scouting schedules (High risk: 2–4 days, Moderate: 5–7 days, Low: 7–14 days)
          </p>
        </div>

        <button
          onClick={() => navigate('/check-field')}
          className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>START SCHEDULED CHECK</span>
        </button>
      </div>

      {/* Schedule Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {schedules.map((sch) => (
          <div
            key={sch.fieldId}
            className={`bg-white border rounded-xl p-5 shadow-xs flex flex-col justify-between transition-colors ${
              sch.isDue ? 'border-amber-300 ring-1 ring-amber-200' : 'border-slate-200'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">{sch.fieldName}</h3>
                  <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{sch.location}</span>
                  </div>
                </div>

                <StatusBadge type="risk" riskLevel={sch.riskLevel} size="sm" />
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-md ${sch.isDue ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{sch.targetDate}</div>
                    <div className="text-slate-500">{sch.daysRemaining} days remaining</div>
                  </div>
                </div>

                <span className={`px-2 py-0.5 rounded font-semibold text-[11px] ${sch.isDue ? 'bg-amber-100 text-amber-900' : 'bg-slate-200 text-slate-700'}`}>
                  {sch.isDue ? 'CHECK DUE SOON' : 'ON TRACK'}
                </span>
              </div>

              <div className="text-xs text-slate-600 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Current condition:</span>
                  <span className="font-medium text-slate-800">{sch.condition}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">7-Day Outbreak Risk:</span>
                  <span className="font-bold text-slate-900">{sch.riskPercent}%</span>
                </div>
                <div className="text-[11px] text-slate-500 pt-1 italic">
                  Note: {sch.reason}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => {
                  setSelectedFieldId(sch.fieldId);
                  navigate('/');
                }}
                className="text-xs text-slate-600 hover:text-slate-900 font-medium"
              >
                View Field Dashboard
              </button>

              <button
                onClick={() => navigate(`/check-field?fieldId=${sch.fieldId}`)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                <span>Check Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

import React from 'react';
import { FollowupSchedule } from '../../types/analysis';
import { RiskLevel } from '../../types/risk';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, CheckSquare, PlusCircle, ArrowRight } from 'lucide-react';
import { computeTargetDate, formatCalendarDate } from '../../utils/dateUtils';

interface NextCheckPanelProps {
  followup: FollowupSchedule;
  riskLevel?: RiskLevel;
  fieldId?: string;
}

export const NextCheckPanel: React.FC<NextCheckPanelProps> = ({
  followup,
  riskLevel = 'HIGH',
  fieldId = 'field-cotton-a',
}) => {
  const navigate = useNavigate();
  const daysRemaining = followup.daysRemaining ?? 4;
  const targetDateDisplay = computeTargetDate(daysRemaining);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-700" />
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-tight font-mono">
              NEXT FIELD CHECK REMINDER
            </h3>
          </div>
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
              riskLevel === 'HIGH'
                ? 'bg-rose-100 text-rose-900'
                : 'bg-emerald-100 text-emerald-900'
            }`}
          >
            {riskLevel === 'HIGH' ? 'Early Check Recommended' : 'Regular Routine Check'}
          </span>
        </div>

        {/* Countdown Module */}
        <div className="mt-3.5 p-3.5 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-between">
          <div>
            <div className="text-xl sm:text-2xl font-extrabold font-mono text-slate-900">
              {daysRemaining} Days Remaining
            </div>
            <div className="text-xs text-slate-600 mt-0.5 font-medium">
              Next Check Date: <strong>{targetDateDisplay}</strong>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase tracking-wider font-mono text-slate-400 block">Status</span>
            <span className="text-xs font-bold text-emerald-700">Scheduled</span>
          </div>
        </div>

        {/* Scannable Recheck Protocol */}
        <div className="mt-3 space-y-1.5 text-xs text-slate-600">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono">
            WHAT TO CHECK ON NEXT VISIT:
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="bg-white border border-slate-200 rounded p-2">
              <span className="text-slate-400 block">Leaf Spots:</span>
              <strong className="text-slate-900">Check if spots stopped</strong>
            </div>
            <div className="bg-white border border-slate-200 rounded p-2">
              <span className="text-slate-400 block">Insects on Leaves:</span>
              <strong className="text-slate-900">Count bugs under leaves</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
        <div className="text-[11px] text-slate-500">
          Reason: {followup.reason || 'Routine field check'}
        </div>

        <button
          type="button"
          onClick={() => navigate(`/check-field?fieldId=${fieldId}&mode=followup`)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-800 transition-colors cursor-pointer shadow-2xs"
        >
          <span>Schedule Reminder</span>
          <ArrowRight className="w-3 h-3 text-slate-500" />
        </button>
      </div>
    </div>
  );
};

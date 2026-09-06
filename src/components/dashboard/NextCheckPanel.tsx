import React from 'react';
import { FollowupSchedule } from '../../types/analysis';
import { RiskLevel } from '../../types/risk';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, CheckSquare, PlusCircle, ArrowRight } from 'lucide-react';

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

  // Dynamic interval guidelines based on risk
  const getIntervalText = (risk: RiskLevel) => {
    switch (risk) {
      case 'HIGH':
        return 'High Risk: Check again in 2–4 days';
      case 'MODERATE':
        return 'Moderate Risk: Check again in 5–7 days';
      case 'LOW':
        return 'Low Risk: Routine check in 7–14 days';
      default:
        return 'Regular 5–7 day scouting window';
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-semibold text-slate-900 uppercase tracking-tight">
              NEXT FIELD CHECK
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Recommended check schedule based on crop condition</p>
          </div>
          <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded">
            {followup.status === 'due' ? 'CHECK DUE NOW' : 'SCHEDULED'}
          </span>
        </div>

        {/* Days Countdown Display */}
        <div className="mt-4 p-4 rounded-lg bg-emerald-50/50 border border-emerald-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-700 text-white flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">
                {followup.daysRemaining} days remaining
              </div>
              <div className="text-xs font-semibold text-emerald-800">
                Target Date: {followup.targetDate || 'September 9, 2026'}
              </div>
            </div>
          </div>
        </div>

        {/* Checklist of what to recheck */}
        <div className="mt-4 space-y-2">
          <div className="text-xs font-bold text-slate-600 uppercase tracking-wider font-mono">
            Key items to check:
          </div>
          <ul className="text-xs text-slate-600 space-y-1.5 pl-1">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              <span><strong>Crop condition:</strong> Check if leaf spots are healing or spreading.</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              <span><strong>Pest count:</strong> Count pests on leaf undersides.</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              <span><strong>Weather trend:</strong> Note recent rain and humidity levels.</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              <span><strong>7-Day risk:</strong> View updated forecast score.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Footer & Action */}
      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
        <div className="text-[11px] text-slate-500 font-medium">
          {getIntervalText(riskLevel)}
        </div>

        <button
          onClick={() => navigate(`/check-field?fieldId=${fieldId}`)}
          className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>CHECK FIELD</span>
        </button>
      </div>
    </div>
  );
};

import React from 'react';
import { ActionRecommendation } from '../../types/analysis';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ChevronRight, Eye, PlusCircle, BookOpen } from 'lucide-react';

interface RecommendedActionsPanelProps {
  actions: ActionRecommendation[];
  fieldId?: string;
}

export const RecommendedActionsPanel: React.FC<RecommendedActionsPanelProps> = ({
  actions,
  fieldId = 'field-cotton-a',
}) => {
  const navigate = useNavigate();

  const defaultActions = [
    {
      id: '1',
      stepNumber: 1,
      action: 'Inspect affected plants in Zone NE-2',
      detail: 'Examine leaf undersides and tag representative symptomatic leaves.',
    },
    {
      id: '2',
      stepNumber: 2,
      action: 'Check nearby plants for similar symptoms',
      detail: 'Scout a 5-meter radius around the identified hotspot to monitor localized spread.',
    },
    {
      id: '3',
      stepNumber: 3,
      action: 'Monitor aphid population',
      detail: 'Count pest population on 20 random plants across the field transect.',
    },
    {
      id: '4',
      stepNumber: 4,
      action: 'Recheck the field according to recommended schedule',
      detail: 'Follow up in 2–4 days to track symptom progression and risk change.',
    },
  ];

  const actionList = actions && actions.length > 0 ? actions : defaultActions;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-semibold text-slate-900 uppercase tracking-tight">
              WHAT SHOULD I DO?
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Agronomist-approved scouting and mitigation recommendations
            </p>
          </div>
          <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
            Immediate Steps
          </span>
        </div>

        {/* Numbered Action List */}
        <div className="space-y-3 mt-4">
          {actionList.map((act, index) => (
            <div
              key={act.id || index}
              className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors"
            >
              <div className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 shadow-xs">
                {act.stepNumber || index + 1}
              </div>
              <div className="flex-1">
                <div className="text-xs sm:text-sm font-bold text-slate-900">
                  {act.action}
                </div>
                {act.detail && (
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                    {act.detail}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 mt-5 pt-4 border-t border-slate-100">
        <div className="text-[11px] text-slate-500 italic">
          * Follow certified integrated pest management (IPM) guidelines.
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/reports')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-slate-500" />
            <span>VIEW GUIDANCE</span>
          </button>

          <button
            onClick={() => navigate(`/check-field?fieldId=${fieldId}`)}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>CHECK FIELD</span>
          </button>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { ActionRecommendation } from '../../types/analysis';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ChevronRight, Eye, PlusCircle, ArrowRight, MapPin, Calendar, ClipboardCheck } from 'lucide-react';

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
      action: 'Check Damaged Leaves in North-East Area',
      detail: 'Walk around affected plants and check if leaf spots are spreading.',
    },
    {
      id: '2',
      stepNumber: 2,
      action: 'Check Insect Count on Edge Rows',
      detail: 'Turn over 20 leaves to check if bugs/aphids are increasing.',
    },
    {
      id: '3',
      stepNumber: 3,
      action: 'Remove Fallen Diseased Leaves & Clear Water',
      detail: 'Clear dry/rotted leaves and keep water channels flowing smoothly.',
    },
    {
      id: '4',
      stepNumber: 4,
      action: 'Take a Follow-Up Photo in 2 to 3 Days',
      detail: 'Take a fresh crop photo to confirm if the crops are recovering.',
    },
  ];

  const actionList = actions && actions.length > 0 ? actions : defaultActions;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <ClipboardCheck className="w-4 h-4 text-emerald-800" />
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-tight font-mono">
              4. WHAT SHOULD I DO NEXT? (RECOMMENDED STEPS)
            </h3>
          </div>
          <span className="text-[10px] font-bold text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded">
            Simple Action Steps
          </span>
        </div>

        {/* Operational Checklist */}
        <div className="space-y-2.5 mt-3.5">
          {actionList.map((act, index) => (
            <div
              key={act.id || index}
              className="flex items-start gap-3 p-3 rounded-lg bg-slate-50/80 border border-slate-200/80 hover:border-slate-300 transition-colors"
            >
              <div className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                {act.stepNumber || index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-slate-900">
                  {act.action}
                </div>
                {act.detail && (
                  <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                    {act.detail}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Direct Action CTAs (Inspect Spot & Start Follow-up) */}
      <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t border-slate-100">
        <div className="text-[11px] text-slate-500 font-medium">
          Field Safety Guide · Sathiya Verified
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              // Scroll to map or focus hotspot
              const mapElem = document.getElementById('field-map-section');
              if (mapElem) {
                mapElem.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-800 bg-white hover:bg-slate-50 transition-colors cursor-pointer shadow-2xs"
          >
            <MapPin className="w-3.5 h-3.5 text-slate-600" />
            <span>View on Map</span>
          </button>

          <button
            type="button"
            onClick={() => navigate(`/check-field?fieldId=${fieldId}&mode=followup`)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Start Follow-Up</span>
          </button>
        </div>
      </div>
    </div>
  );
};

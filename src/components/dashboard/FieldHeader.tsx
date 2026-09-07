import React from 'react';
import { Field } from '../../types/field';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Clock, GitCompare, History, PlusCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { computeTargetDate, formatRelativeDays } from '../../utils/dateUtils';

interface FieldHeaderProps {
  field: Field;
}

export const FieldHeader: React.FC<FieldHeaderProps> = ({ field }) => {
  const navigate = useNavigate();
  const followUpCount = field.followUpCount || 0;
  const nextFollowUpNum = followUpCount + 1;
  const daysRemaining = field.nextCheckDays ?? field.latestAnalysis?.followup?.daysRemaining ?? 4;
  const relativeDays = formatRelativeDays(daysRemaining);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-heading">
            {field.name}
          </h1>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium border border-slate-200">
            {field.variety || 'Bt Hybrid'}
          </span>
          {/* Active Follow-Up Milestone Badge */}
          <span
            className={`text-xs px-3 py-0.5 rounded-full font-bold border flex items-center gap-1.5 ${
              followUpCount === 0
                ? 'bg-slate-100 text-slate-700 border-slate-300'
                : 'bg-blue-100 text-blue-900 border-blue-200'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-700" />
            <span>
              {followUpCount === 0
                ? 'Baseline Check Active (0 Follow-ups)'
                : `Active View: Follow-Up #${followUpCount} (${followUpCount} Recorded)`}
            </span>
          </span>
        </div>

        <div className="text-xs text-slate-600 font-medium flex flex-wrap items-center gap-x-2.5 gap-y-1">
          <span className="font-bold text-slate-800">{field.crop}</span>
          <span className="text-slate-300">·</span>
          <span>{field.areaAcres} acres</span>
          <span className="text-slate-300">·</span>
          <span>Day {field.daysSincePlanting} ({field.estimatedGrowthStage})</span>
          <span className="text-slate-300">·</span>
          <span className="text-emerald-800 font-semibold">
            Next Recheck: {relativeDays} ({computeTargetDate(daysRemaining)})
          </span>
          <span className="text-slate-300">·</span>
          <span className="text-slate-500 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            {field.locationName}
          </span>
        </div>
      </div>

      {/* Structured, Non-Redundant Action Hub */}
      <div className="flex flex-wrap items-center gap-2.5 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
        <button
          onClick={() => navigate('/followups')}
          className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
        >
          <History className="w-3.5 h-3.5 text-blue-700" />
          <span>Follow-Up Progression</span>
        </button>

        <button
          onClick={() => navigate('/compare')}
          className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
        >
          <GitCompare className="w-3.5 h-3.5 text-slate-600" />
          <span>Compare Checkpoints</span>
        </button>

        <button
          onClick={() => navigate(`/check-field?fieldId=${field.id}&mode=followup`)}
          className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-xs transition-all cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>
            {followUpCount === 0 ? 'Run First Follow-Up #1' : `Perform Follow-Up #${nextFollowUpNum}`}
          </span>
          <ArrowRight className="w-3.5 h-3.5 opacity-80" />
        </button>
      </div>
    </div>
  );
};

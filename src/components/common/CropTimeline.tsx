import React from 'react';
import { CropGrowthStageInfo } from '../../types/analysis';
import { CheckCircle2, Circle } from 'lucide-react';

interface CropTimelineProps {
  stageInfo?: CropGrowthStageInfo;
  daysSincePlanting?: number;
  plantingDate?: string;
  className?: string;
}

export const CropTimeline: React.FC<CropTimelineProps> = ({
  stageInfo,
  daysSincePlanting = 73,
  plantingDate = '23 June 2026',
  className = '',
}) => {
  const defaultStages = [
    { name: 'Planting', day: 'Day 0', completed: daysSincePlanting > 0, current: false },
    { name: 'Germination', day: 'Day 1–15', completed: daysSincePlanting > 15, current: false },
    { name: 'Vegetative Growth', day: 'Day 16–45', completed: daysSincePlanting > 45, current: false },
    { name: 'Squaring / Bud Formation', day: 'Day 46–65', completed: daysSincePlanting > 65, current: false },
    { name: 'Flowering & Boll Development', day: 'Day 66–120', completed: daysSincePlanting > 120, current: daysSincePlanting >= 66 && daysSincePlanting <= 120 },
    { name: 'Maturity / Harvest', day: 'Day 121–160', completed: false, current: daysSincePlanting > 120 },
  ];

  const currentStageName = stageInfo?.stageName || 'Flowering & Boll Development';
  const totalDays = stageInfo?.totalCycleDays || 160;

  return (
    <div className={`bg-white border border-slate-200 rounded-lg p-5 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-slate-900">Crop Growth Lifecycle</h3>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">Estimated</span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Planted on {plantingDate} · Day {daysSincePlanting} of approximately {totalDays} days
          </p>
        </div>
        <div className="text-left sm:text-right">
          <span className="text-xs text-slate-500 block">Current Estimated Stage</span>
          <span className="text-sm font-semibold text-emerald-800">{currentStageName}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 h-2 rounded-full mb-6 overflow-hidden">
        <div
          className="bg-emerald-700 h-full rounded-full transition-all duration-500"
          style={{ width: `${Math.min(100, Math.round((daysSincePlanting / totalDays) * 100))}%` }}
        />
      </div>

      {/* Stage Nodes */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        {defaultStages.map((st, idx) => {
          const isCurrent = st.current;
          const isDone = st.completed;

          return (
            <div
              key={idx}
              className={`p-2.5 rounded-md border text-center transition-colors ${
                isCurrent
                  ? 'bg-emerald-50/80 border-emerald-300 ring-1 ring-emerald-300'
                  : isDone
                  ? 'bg-slate-50 border-slate-200'
                  : 'bg-white border-slate-100 opacity-60'
              }`}
            >
              <div className="flex items-center justify-center mb-1">
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : isCurrent ? (
                  <div className="w-3.5 h-3.5 rounded-full bg-emerald-600 ring-4 ring-emerald-100 animate-pulse" />
                ) : (
                  <Circle className="w-3.5 h-3.5 text-slate-300" />
                )}
              </div>
              <div className={`text-xs font-semibold line-clamp-2 leading-snug ${isCurrent ? 'text-emerald-950 font-bold' : isDone ? 'text-slate-800' : 'text-slate-500'}`}>
                {st.name}
              </div>
              <div className="text-[11px] text-slate-400 mt-1 font-mono">{st.day}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

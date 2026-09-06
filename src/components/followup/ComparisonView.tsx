import React from 'react';
import { FullFieldAnalysis } from '../../types/analysis';
import { GitCompare, ArrowDownRight, ArrowUpRight, Minus, CheckCircle, AlertTriangle } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';

interface ComparisonViewProps {
  previous: FullFieldAnalysis;
  current: FullFieldAnalysis;
  status?: 'IMPROVING' | 'STABLE' | 'WORSENING';
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({
  previous,
  current,
  status = 'IMPROVING',
}) => {
  const prevRiskPercent = Math.round(previous.risk.probability * 100);
  const currRiskPercent = Math.round(current.risk.probability * 100);
  const riskDelta = currRiskPercent - prevRiskPercent;

  const prevPest = previous.pest.currentCount;
  const currPest = current.pest.currentCount;
  const pestDelta = currPest - prevPest;

  const getStatusBadge = () => {
    if (status === 'IMPROVING' || riskDelta < 0) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 font-extrabold text-xs uppercase border border-emerald-300">
          <ArrowDownRight className="w-4 h-4 text-emerald-700" />
          <span>IMPROVING</span>
        </span>
      );
    }
    if (status === 'WORSENING' || riskDelta > 0) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-900 font-extrabold text-xs uppercase border border-rose-300">
          <ArrowUpRight className="w-4 h-4 text-rose-700" />
          <span>WORSENING</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 font-extrabold text-xs uppercase border border-slate-300">
        <Minus className="w-4 h-4 text-slate-600" />
        <span>STABLE</span>
      </span>
    );
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <GitCompare className="w-5 h-5 text-emerald-700" />
          <div>
            <h3 className="text-base font-semibold text-slate-900 uppercase tracking-tight">
              BEFORE VS AFTER COMPARISON
            </h3>
            <p className="text-xs text-slate-500">
              Comparison between your previous check and today
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Overall Status:</span>
          {getStatusBadge()}
        </div>
      </div>

      {/* Comparison Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {/* Previous Observation */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider font-mono">
              PREVIOUS CHECK
            </span>
            <span className="text-xs text-slate-500 font-medium">Last Visit</span>
          </div>

          <div className="space-y-3">
            <div>
              <span className="text-xs text-slate-500 block">7-Day Outbreak Risk</span>
              <div className="text-2xl font-extrabold text-slate-800 mt-0.5">
                {prevRiskPercent}%
              </div>
            </div>

            <div>
              <span className="text-xs text-slate-500 block">Pest Count</span>
              <div className="text-sm font-bold text-slate-800 mt-0.5">
                {prevPest} {previous.pest.pestType || 'Aphids'}
              </div>
            </div>

            <div>
              <span className="text-xs text-slate-500 block">Identified Condition</span>
              <div className="text-sm font-semibold text-slate-800 mt-0.5">
                {previous.condition.status}
              </div>
            </div>
          </div>
        </div>

        {/* Current Observation */}
        <div className="bg-emerald-50/40 rounded-xl p-4 border border-emerald-200 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-emerald-100">
            <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider font-mono">
              CURRENT CHECK
            </span>
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
              Today
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <span className="text-xs text-emerald-800 block">7-Day Outbreak Risk</span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-extrabold text-emerald-900">{currRiskPercent}%</span>
                <span
                  className={`text-xs font-bold ${
                    riskDelta < 0 ? 'text-emerald-700' : riskDelta > 0 ? 'text-rose-700' : 'text-slate-600'
                  }`}
                >
                  {riskDelta < 0 ? `${riskDelta}% (Improved)` : riskDelta > 0 ? `+${riskDelta}% (Increased)` : 'No change'}
                </span>
              </div>
            </div>

            <div>
              <span className="text-xs text-emerald-800 block">Pest Count</span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-sm font-bold text-emerald-950">
                  {currPest} {current.pest.pestType || 'Aphids'}
                </span>
                <span
                  className={`text-xs font-bold ${
                    pestDelta < 0 ? 'text-emerald-700' : pestDelta > 0 ? 'text-rose-700' : 'text-slate-600'
                  }`}
                >
                  {pestDelta < 0 ? `(${pestDelta} lower)` : pestDelta > 0 ? `(+${pestDelta} higher)` : '(same)'}
                </span>
              </div>
            </div>

            <div>
              <span className="text-xs text-emerald-800 block">Identified Condition</span>
              <div className="text-sm font-semibold text-emerald-950 mt-0.5">
                {current.condition.status}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 rounded-lg bg-slate-50 text-xs text-slate-600 border border-slate-200">
        <strong>Field Insight:</strong>{' '}
        {status === 'IMPROVING' || riskDelta < 0
          ? 'Crop health is improving. Disease spread has slowed down and leaves are recovering well. Keep following your regular check schedule.'
          : 'Disease risk is still elevated due to moisture. Inspect affected spots closely and ensure good field drainage.'}
      </div>
    </div>
  );
};

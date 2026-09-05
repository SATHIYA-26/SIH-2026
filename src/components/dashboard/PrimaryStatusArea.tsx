import React from 'react';
import { DiseaseCondition } from '../../types/analysis';
import { RiskResult } from '../../types/risk';
import { StatusBadge } from '../common/StatusBadge';
import { AlertTriangle, ShieldCheck, Activity, TrendingUp, Info } from 'lucide-react';

interface PrimaryStatusAreaProps {
  condition: DiseaseCondition;
  risk: RiskResult;
}

export const PrimaryStatusArea: React.FC<PrimaryStatusAreaProps> = ({ condition, risk }) => {
  const riskPercentage = Math.round(risk.probability * 100);
  const conditionConfidence = (condition.confidence * 100).toFixed(1);

  const isHighRisk = risk.level === 'HIGH';
  const isModerateRisk = risk.level === 'MODERATE';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* 1. CURRENT CONDITION BOX (What is happening NOW from leaf analysis) */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors">
        <div>
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                CURRENT CONDITION
              </span>
            </div>
            <span className="text-xs text-slate-400 font-medium">Visual Leaf Analysis</span>
          </div>

          <div className="mt-3.5">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              {condition.status}
            </h2>

            <div className="flex items-center gap-3 mt-2">
              <div className="text-xs text-slate-600">
                AI confidence: <span className="font-semibold text-slate-900">{conditionConfidence}%</span>
              </div>
              <span className="text-slate-300">·</span>
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded ${
                  condition.needsAttention
                    ? 'bg-amber-50 text-amber-900 border border-amber-200'
                    : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                }`}
              >
                {condition.needsAttention ? 'Needs Attention' : 'Normal / Stable'}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
          <span>Identified from leaf inspection</span>
          <span className="text-slate-400">Class: {condition.topClass === 'healthy' ? 'Healthy Foliage' : condition.topClass}</span>
        </div>
      </div>

      {/* 2. 7-DAY OUTBREAK RISK BOX (What could happen in the NEXT FEW DAYS from structured risk model) */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors">
        <div>
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                7-DAY RISK
              </span>
            </div>
            <span className="text-xs text-slate-400 font-medium">Next {risk.horizonDays || 7} Days Outlook</span>
          </div>

          <div className="mt-3.5 flex items-baseline gap-3">
            <div
              className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${
                isHighRisk
                  ? 'text-rose-700'
                  : isModerateRisk
                  ? 'text-amber-700'
                  : 'text-emerald-700'
              }`}
            >
              {riskPercentage}%
            </div>

            <StatusBadge type="risk" riskLevel={risk.level} size="lg" />
          </div>

          <p className="text-xs text-slate-600 mt-2 font-medium leading-relaxed">
            {risk.summary || 'Increased chance of disease or pest problems over the next 7 days.'}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
          <span>Multi-factor field risk calculation</span>
          <span className="font-medium text-slate-700">Horizon: 7 Days</span>
        </div>
      </div>
    </div>
  );
};

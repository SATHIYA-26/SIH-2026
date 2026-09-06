import React from 'react';
import { DiseaseCondition } from '../../types/analysis';
import { RiskResult } from '../../types/risk';
import { StatusBadge } from '../common/StatusBadge';
import { AlertTriangle, ShieldCheck, Activity, TrendingUp, Droplets, CloudRain, Bug, Eye, Sparkles } from 'lucide-react';
import { COTTON_LEAF_BACTERIAL_IMAGE, COTTON_LEAF_HEALTHY_IMAGE } from '../../data/mockData';

interface PrimaryStatusAreaProps {
  condition: DiseaseCondition;
  risk: RiskResult;
  zoneName?: string;
}

export const PrimaryStatusArea: React.FC<PrimaryStatusAreaProps> = ({
  condition,
  risk,
  zoneName = 'Zone NE-2 (Hotspot)',
}) => {
  const riskPercentage = Math.round(risk.probability * 100);
  const conditionConfidence = (condition.confidence * 100).toFixed(1);
  const isHighRisk = risk.level === 'HIGH';
  const isModerateRisk = risk.level === 'MODERATE';
  const isHealthy = condition.topClass === 'healthy';

  const defaultImg = isHealthy ? COTTON_LEAF_HEALTHY_IMAGE : COTTON_LEAF_BACTERIAL_IMAGE;
  const leafImg = condition.leafImageUrl || defaultImg;

  // Extract top drivers
  const drivers = risk.drivers || [];
  const humidityDriver = drivers.find(d => d.title.toLowerCase().includes('humidity'))?.value || '86% RH';
  const rainDriver = drivers.find(d => d.title.toLowerCase().includes('rain'))?.value || '12 mm';
  const pestDriver = drivers.find(d => d.title.toLowerCase().includes('pest') || d.title.toLowerCase().includes('aphid'))?.value || '18 Aphids (↑80%)';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      {/* 1. CURRENT CONDITION (What is happening NOW) - 6 cols */}
      <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                1. CURRENT VISUAL FINDING
              </span>
              <span className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                {zoneName}
              </span>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              Confidence {conditionConfidence}%
            </span>
          </div>

          {/* Body: Thumbnail + Core Finding */}
          <div className="flex items-start gap-4 mt-3.5">
            {/* Leaf Image Thumbnail */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-slate-900 border border-slate-200 shrink-0 relative group">
              <img
                src={leafImg}
                alt="Field leaf evidence"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = defaultImg;
                }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
              <span className="absolute bottom-1 right-1 bg-slate-900/80 text-[9px] text-white font-mono px-1 py-0.5 rounded">
                LEAF
              </span>
            </div>

            {/* Finding Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                  {condition.status}
                </h2>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                    condition.needsAttention
                      ? 'bg-amber-100 text-amber-900 border border-amber-200'
                      : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                  }`}
                >
                  {condition.needsAttention ? 'Needs Attention' : 'Healthy Foliage'}
                </span>
              </div>

              {/* Detected Evidence */}
              <div className="mt-2 space-y-1 text-xs text-slate-600">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
                  <span className="truncate">
                    <strong>Evidence:</strong> {isHealthy ? 'Clean leaf lamina, normal transpiration' : 'Angular water-soaked spots along veins'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
                  <span className="truncate">
                    <strong>Class:</strong> {condition.topClass === 'healthy' ? 'Healthy Bt Cotton' : `${condition.topClass} pathogen detected`}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Meta */}
        <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>Field Observation · High Clarity</span>
          <span className="font-medium text-slate-700">Verified by Sathiya (Agronomist)</span>
        </div>
      </div>

      {/* 2. 7-DAY OUTBREAK RISK (How serious is it & Why) - 6 cols */}
      <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                2. 7-DAY OUTBREAK RISK
              </span>
              <span className="text-[10px] font-medium text-slate-500">
                Horizon: 7 Days
              </span>
            </div>

            <StatusBadge type="risk" riskLevel={risk.level} size="sm" />
          </div>

          {/* Primary Metric & Delta */}
          <div className="flex items-baseline justify-between gap-4 mt-3">
            <div className="flex items-baseline gap-3">
              <span
                className={`text-3xl sm:text-4xl font-extrabold tracking-tight font-mono ${
                  isHighRisk
                    ? 'text-rose-700'
                    : isModerateRisk
                    ? 'text-amber-700'
                    : 'text-emerald-700'
                }`}
              >
                {riskPercentage}%
              </span>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded ${
                  risk.trendDirection === 'increasing' || riskPercentage >= 60
                    ? 'bg-rose-50 text-rose-800 border border-rose-200'
                    : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                }`}
              >
                {risk.trendDirection === 'increasing' || riskPercentage >= 60 ? '↑ 13% vs last check' : '↓ Steady / Low'}
              </span>
            </div>

            <div className="text-right">
              <span className="text-xs font-semibold text-slate-700 block">
                {isHighRisk ? 'High Outbreak Risk' : isModerateRisk ? 'Moderate Outbreak Risk' : 'Low Outbreak Risk'}
              </span>
              <span className="text-[11px] text-slate-400">
                {isHighRisk ? 'Immediate scouting due' : 'Routine monitoring'}
              </span>
            </div>
          </div>

          {/* Risk Drivers Chips (Concise, Scannable) */}
          <div className="mt-3.5 pt-3 border-t border-slate-100">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono mb-2">
              PRIMARY DRIVERS:
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-2 text-center">
                <div className="flex items-center justify-center gap-1 text-slate-500 text-[10px] font-medium">
                  <Droplets className="w-3 h-3 text-sky-600" />
                  <span>Humidity</span>
                </div>
                <div className="font-bold text-slate-900 mt-0.5">{humidityDriver}</div>
              </div>

              <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-2 text-center">
                <div className="flex items-center justify-center gap-1 text-slate-500 text-[10px] font-medium">
                  <CloudRain className="w-3 h-3 text-indigo-600" />
                  <span>Rainfall</span>
                </div>
                <div className="font-bold text-slate-900 mt-0.5">{rainDriver}</div>
              </div>

              <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-2 text-center">
                <div className="flex items-center justify-center gap-1 text-slate-500 text-[10px] font-medium">
                  <Bug className="w-3 h-3 text-rose-600" />
                  <span>Pests</span>
                </div>
                <div className="font-bold text-slate-900 mt-0.5 truncate">{pestDriver}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Meta */}
        <div className="mt-3 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Multi-factor XGBoost model</span>
          <span className="text-slate-400">Data Freshness: &lt; 1 hour</span>
        </div>
      </div>
    </div>
  );
};

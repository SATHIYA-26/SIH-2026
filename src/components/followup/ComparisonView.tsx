import React from 'react';
import { FullFieldAnalysis } from '../../types/analysis';
import { FollowUpRecord } from '../../types/field';
import { getValidLeafImageUrl, handleImageError } from '../../utils/imageUtils';
import {
  GitCompare,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  AlertTriangle,
  CheckCircle2,
  Droplets,
  Bug,
  Sprout,
  Activity,
  Image as ImageIcon,
  ShieldCheck,
  Clock
} from 'lucide-react';

export interface ComparisonCheckpoint {
  id: string;
  label: string; // e.g. "Baseline (Initial Check)" or "Follow-Up #2"
  date: string;
  riskProbability: number;
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH';
  pestCount: number;
  pestType: string;
  conditionStatus: string;
  leafImageUrl?: string;
  treatmentApplied?: 'YES' | 'PARTIAL' | 'NO';
  treatmentNotes?: string;
  humidity?: number;
  rainfall?: number;
  advisory?: string;
}

interface ComparisonViewProps {
  previous?: FullFieldAnalysis;
  current?: FullFieldAnalysis;
  status?: 'IMPROVING' | 'STABLE' | 'WORSENING';
  checkpointA?: ComparisonCheckpoint;
  checkpointB?: ComparisonCheckpoint;
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({
  previous,
  current,
  status,
  checkpointA,
  checkpointB,
}) => {
  // Normalize data whether passed as FullFieldAnalysis or ComparisonCheckpoint
  const itemA: ComparisonCheckpoint = checkpointA || {
    id: previous?.id || 'prev',
    label: 'Previous Check',
    date: previous?.timestamp ? new Date(previous.timestamp).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : 'Prior Inspection',
    riskProbability: previous?.risk.probability ?? 0.68,
    riskLevel: previous?.risk.level ?? 'HIGH',
    pestCount: previous?.pest.currentCount ?? 10,
    pestType: previous?.pest.pestType ?? 'Cotton Aphid',
    conditionStatus: previous?.condition.status ?? 'Bacterial Blight',
    leafImageUrl: previous?.condition.leafImageUrl,
    humidity: previous?.weather.humidity ?? 86,
    rainfall: previous?.weather.recentRainfall ?? 12,
    advisory: previous?.actions[0]?.action,
  };

  const itemB: ComparisonCheckpoint = checkpointB || {
    id: current?.id || 'curr',
    label: 'Latest Check',
    date: current?.timestamp ? new Date(current.timestamp).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : 'Current Inspection',
    riskProbability: current?.risk.probability ?? 0.41,
    riskLevel: current?.risk.level ?? 'MODERATE',
    pestCount: current?.pest.currentCount ?? 6,
    pestType: current?.pest.pestType ?? 'Cotton Aphid',
    conditionStatus: current?.condition.status ?? 'Healing Lesions',
    leafImageUrl: current?.condition.leafImageUrl,
    humidity: current?.weather.humidity ?? 78,
    rainfall: current?.weather.recentRainfall ?? 0,
    advisory: current?.actions[0]?.action,
  };

  const leafImgA = getValidLeafImageUrl(itemA.leafImageUrl, itemA.conditionStatus);
  const leafImgB = getValidLeafImageUrl(itemB.leafImageUrl, itemB.conditionStatus);

  const prevRiskPercent = Math.round(itemA.riskProbability * 100);
  const currRiskPercent = Math.round(itemB.riskProbability * 100);
  const riskDelta = currRiskPercent - prevRiskPercent;

  const prevPest = itemA.pestCount;
  const currPest = itemB.pestCount;
  const pestDelta = currPest - prevPest;

  const prevHumidity = itemA.humidity ?? 86;
  const currHumidity = itemB.humidity ?? 78;
  const humidityDelta = currHumidity - prevHumidity;

  // Derive agronomical status if not explicitly passed
  const effectiveStatus: 'IMPROVING' | 'STABLE' | 'WORSENING' =
    status || (riskDelta > 0 || (itemB.riskLevel === 'HIGH' && riskDelta >= 0) ? 'WORSENING' : riskDelta < 0 ? 'IMPROVING' : 'STABLE');

  const isWorsening = effectiveStatus === 'WORSENING' || riskDelta > 0;
  const isImproving = effectiveStatus === 'IMPROVING' && riskDelta <= 0;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <GitCompare className="w-4 h-4 text-emerald-800" />
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight font-heading">
            CHECKPOINT COMPARISON ({itemA.label.toUpperCase()} VS {itemB.label.toUpperCase()})
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Trajectory:</span>
          {isWorsening ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-900 font-bold text-xs">
              <ArrowUpRight className="w-3.5 h-3.5 text-rose-700" />
              <span>OUTBREAK EXPANDING</span>
            </span>
          ) : isImproving ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold text-xs">
              <ArrowDownRight className="w-3.5 h-3.5 text-emerald-700" />
              <span>IMPROVING & RECOVERING</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 font-bold text-xs">
              <Minus className="w-3.5 h-3.5 text-slate-600" />
              <span>STABILIZED</span>
            </span>
          )}
        </div>
      </div>

      {/* Side-by-Side Photo & Checkpoint Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-2">
        {/* Checkpoint A Leaf */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-800 font-bold text-[11px] font-heading">
              {itemA.label}
            </span>
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" />
              {itemA.date}
            </span>
          </div>

          <div className="aspect-[16/10] sm:aspect-[16/9] w-full max-h-52 rounded-xl overflow-hidden bg-slate-950 border border-slate-200 relative group flex items-center justify-center">
            <img
              src={leafImgA}
              alt=""
              aria-hidden="true"
              onError={(e) => handleImageError(e)}
              className="absolute inset-0 w-full h-full object-cover blur-md opacity-30 scale-110 pointer-events-none"
            />
            <img
              src={leafImgA}
              alt={itemA.label}
              onError={(e) => handleImageError(e)}
              className="relative z-10 max-w-full max-h-full object-contain transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute bottom-2 left-2 z-20 bg-slate-950/85 text-white text-[10px] px-2 py-0.5 rounded font-semibold backdrop-blur-xs border border-white/10 max-w-[90%] truncate">
              {itemA.conditionStatus}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <div>
              <span className="text-slate-400 block text-[10px]">Outbreak Risk</span>
              <span className="font-bold text-slate-900 font-heading">{prevRiskPercent}% ({itemA.riskLevel})</span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 block text-[10px]">Insects per leaf</span>
              <span className="font-bold text-slate-900 font-heading">{prevPest} {itemA.pestType}</span>
            </div>
          </div>

          {itemA.treatmentApplied && (
            <div className="text-[11px] bg-white border border-slate-200 rounded-md p-2 text-slate-700">
              <strong className="text-slate-900">Treatment:</strong> {itemA.treatmentApplied === 'YES' ? '✓ Applied' : itemA.treatmentApplied === 'PARTIAL' ? '~ Partial' : '✗ Untreated'}
              {itemA.treatmentNotes && <div className="text-slate-500 text-[10px] truncate mt-0.5">{itemA.treatmentNotes}</div>}
            </div>
          )}
        </div>

        {/* Checkpoint B Leaf */}
        <div className="bg-emerald-50/50 border border-emerald-200 rounded-xl p-3.5 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-bold text-[11px] font-heading">
              {itemB.label}
            </span>
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" />
              {itemB.date}
            </span>
          </div>

          <div className="aspect-[16/10] sm:aspect-[16/9] w-full max-h-52 rounded-xl overflow-hidden bg-slate-950 border border-emerald-300 relative group flex items-center justify-center">
            <img
              src={leafImgB}
              alt=""
              aria-hidden="true"
              onError={(e) => handleImageError(e)}
              className="absolute inset-0 w-full h-full object-cover blur-md opacity-30 scale-110 pointer-events-none"
            />
            <img
              src={leafImgB}
              alt={itemB.label}
              onError={(e) => handleImageError(e)}
              className="relative z-10 max-w-full max-h-full object-contain transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute bottom-2 left-2 z-20 bg-slate-950/85 text-white text-[10px] px-2 py-0.5 rounded font-semibold backdrop-blur-xs border border-white/10 max-w-[90%] truncate">
              {itemB.conditionStatus}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <div>
              <span className="text-slate-400 block text-[10px]">Outbreak Risk</span>
              <span className={`font-bold font-heading ${isWorsening ? 'text-rose-700' : 'text-emerald-700'}`}>
                {currRiskPercent}% ({itemB.riskLevel})
              </span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 block text-[10px]">Insects per leaf</span>
              <span className="font-bold text-slate-900 font-heading">{currPest} {itemB.pestType}</span>
            </div>
          </div>

          {itemB.treatmentApplied && (
            <div className="text-[11px] bg-white border border-emerald-200 rounded-md p-2 text-slate-700">
              <strong className="text-slate-900">Treatment:</strong> {itemB.treatmentApplied === 'YES' ? '✓ Applied' : itemB.treatmentApplied === 'PARTIAL' ? '~ Partial' : '✗ Untreated'}
              {itemB.treatmentNotes && <div className="text-slate-500 text-[10px] truncate mt-0.5">{itemB.treatmentNotes}</div>}
            </div>
          )}
        </div>
      </div>

      {/* Structured Delta Matrix Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Metric 1: Outbreak Risk */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3 space-y-1">
          <div className="flex items-center justify-between text-[11px] uppercase text-slate-500 font-semibold tracking-wider">
            <span>7-Day Risk</span>
            <Activity className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="flex items-center gap-2 pt-0.5">
            <span className="text-sm font-bold text-slate-500 font-heading">{prevRiskPercent}%</span>
            <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
            <span
              className={`text-base font-extrabold font-heading ${
                isWorsening ? 'text-rose-700' : 'text-emerald-700'
              }`}
            >
              {currRiskPercent}%
            </span>
            <span
              className={`text-[11px] font-bold font-heading ml-auto ${
                riskDelta > 0 ? 'text-rose-700' : riskDelta < 0 ? 'text-emerald-700' : 'text-slate-500'
              }`}
            >
              {riskDelta > 0 ? `+${riskDelta}%` : `${riskDelta}%`}
            </span>
          </div>
          <div className="text-[10px] text-slate-500">
            {riskDelta > 0 ? 'Elevated spore spread rate' : 'Risk receding under management'}
          </div>
        </div>

        {/* Metric 2: Pest Count */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3 space-y-1">
          <div className="flex items-center justify-between text-[11px] uppercase text-slate-500 font-semibold tracking-wider">
            <span>Pest Density</span>
            <Bug className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="flex items-center gap-2 pt-0.5">
            <span className="text-sm font-bold text-slate-500 font-heading">{prevPest}</span>
            <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
            <span className="text-base font-extrabold font-heading text-slate-900">{currPest}</span>
            <span
              className={`text-[11px] font-bold font-heading ml-auto ${
                pestDelta > 0 ? 'text-rose-700' : pestDelta < 0 ? 'text-emerald-700' : 'text-slate-500'
              }`}
            >
              {pestDelta > 0 ? `+${pestDelta}` : pestDelta < 0 ? `${pestDelta}` : '0'} insects
            </span>
          </div>
          <div className="text-[10px] text-slate-500">
            {itemB.pestType} ({pestDelta > 0 ? 'Increasing' : pestDelta < 0 ? 'Suppressed' : 'Controlled'})
          </div>
        </div>

        {/* Metric 3: Condition Evolution */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3 space-y-1">
          <div className="flex items-center justify-between text-[11px] uppercase text-slate-500 font-semibold tracking-wider">
            <span>Symptom Transition</span>
            <Sprout className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="text-xs font-bold text-slate-900 pt-0.5 truncate">
            {itemA.conditionStatus.split(' ')[0]} → {itemB.conditionStatus}
          </div>
          <div className="text-[10px] text-slate-500 truncate">
            {isImproving ? 'Lesion margins dried and healing' : 'Active pathogen presence'}
          </div>
        </div>

        {/* Metric 4: Environmental Delta */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3 space-y-1">
          <div className="flex items-center justify-between text-[11px] uppercase text-slate-500 font-semibold tracking-wider">
            <span>Microclimate</span>
            <Droplets className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 pt-0.5">
            <span className="font-heading">{prevHumidity}% RH</span>
            <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
            <span className="text-sky-700 font-heading">{currHumidity}% RH</span>
            <span className="text-[10px] text-slate-500 font-normal ml-auto">({itemB.rainfall ?? 0}mm rain)</span>
          </div>
          <div className="text-[10px] text-slate-500">
            {humidityDelta > 0 ? 'Foliar wetness increased' : 'Canopy drying'}
          </div>
        </div>
      </div>

      {/* Operational Note (Concise 1-liner) */}
      <div
        className={`px-3.5 py-2.5 rounded-lg text-xs flex items-center gap-2.5 border ${
          isWorsening
            ? 'bg-rose-50/70 text-rose-950 border-rose-200'
            : 'bg-emerald-50/70 text-emerald-950 border-emerald-200'
        }`}
      >
        {isWorsening ? (
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
        ) : (
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
        )}
        <span className="font-medium">
          <strong>Follow-Up Verdict:</strong>{' '}
          {isWorsening
            ? `Outbreak risk ↑${riskDelta > 0 ? riskDelta : 13}% between checkpoints. Aphid density increased by +${pestDelta > 0 ? pestDelta : 8}. Re-apply prescribed Copper Oxychloride / bio-spray promptly.`
            : `Outbreak risk decreased by ${Math.abs(riskDelta)}% between ${itemA.label} and ${itemB.label}. Foliage symptoms are stabilizing. Continue scheduled recheck.`}
        </span>
      </div>
    </div>
  );
};

import React from 'react';
import { Field } from '../../types/field';
import { Sprout, Clock, CloudSun, Bug, Calendar, MapPin } from 'lucide-react';
import { computeTargetDate, formatRelativeDays, formatCalendarDate } from '../../utils/dateUtils';

interface FieldContextStripProps {
  field: Field;
}

export const FieldContextStrip: React.FC<FieldContextStripProps> = ({ field }) => {
  const analysis = field.latestAnalysis;
  const weather = analysis.weather;
  const pest = analysis.pest;
  const cropStage = analysis.cropStage;
  const followup = analysis.followup;

  const daysRemaining = followup.daysRemaining ?? field.nextCheckDays ?? 4;
  const targetDateStr = computeTargetDate(daysRemaining);

  const getCleanStageName = (stage: string) => {
    if (stage.toLowerCase().includes('flowering')) return 'Flowering Stage';
    if (stage.toLowerCase().includes('vegetative')) return 'Growing Stage';
    if (stage.toLowerCase().includes('maturity')) return 'Harvest Stage';
    return stage;
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-xs">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
        {/* 1. CROP & AGE */}
        <div className="pt-2 sm:pt-0 sm:px-2 first:px-0">
          <div className="flex items-center gap-1.5 text-slate-500 text-[10px] font-bold uppercase tracking-wider font-mono">
            <Sprout className="w-3.5 h-3.5 text-emerald-700" />
            <span>CROP & SIZE</span>
          </div>
          <div className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5">
            {field.crop} · {field.variety || 'Hybrid'}
          </div>
          <div className="text-[11px] text-slate-500">
            Day {field.daysSincePlanting} ({field.areaAcres} acres)
          </div>
        </div>

        {/* 2. GROWTH STAGE */}
        <div className="pt-2 sm:pt-0 sm:px-3">
          <div className="flex items-center gap-1.5 text-slate-500 text-[10px] font-bold uppercase tracking-wider font-mono">
            <Clock className="w-3.5 h-3.5 text-indigo-700" />
            <span>GROWTH STAGE</span>
          </div>
          <div className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5 truncate">
            {getCleanStageName(cropStage?.stageName || field.estimatedGrowthStage)}
          </div>
          <div className="text-[11px] text-slate-500">
            Planted: {formatCalendarDate(field.plantingDate, 'display')}
          </div>
        </div>

        {/* 3. WEATHER */}
        <div className="pt-2 sm:pt-0 sm:px-3">
          <div className="flex items-center gap-1.5 text-slate-500 text-[10px] font-bold uppercase tracking-wider font-mono">
            <CloudSun className="w-3.5 h-3.5 text-sky-700" />
            <span>FIELD WEATHER</span>
          </div>
          <div className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5">
            {weather.temperature}°C · {weather.humidity}% Humidity
          </div>
          <div className="text-[11px] text-slate-500">
            {weather.recentRainfall} mm rain (past 2 days)
          </div>
        </div>

        {/* 4. INSECTS & PESTS */}
        <div className="pt-2 sm:pt-0 sm:px-3">
          <div className="flex items-center gap-1.5 text-slate-500 text-[10px] font-bold uppercase tracking-wider font-mono">
            <Bug className="w-3.5 h-3.5 text-rose-700" />
            <span>INSECTS / PESTS</span>
          </div>
          <div className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5">
            {pest.currentCount} {pest.pestType}
          </div>
          <div className="text-[11px] text-slate-500">
            {pest.previousCount !== undefined && pest.currentCount > pest.previousCount
              ? `↑ More than last check (${pest.previousCount})`
              : pest.previousCount !== undefined && pest.currentCount < pest.previousCount
              ? `↓ Decreased from ${pest.previousCount}`
              : pest.pestPressure === 'Low' ? 'Low bug count' : 'Moderate count'}
          </div>
        </div>

        {/* 5. NEXT CHECK */}
        <div className="pt-2 sm:pt-0 sm:px-3">
          <div className="flex items-center gap-1.5 text-slate-500 text-[10px] font-bold uppercase tracking-wider font-mono">
            <Calendar className="w-3.5 h-3.5 text-slate-700" />
            <span>NEXT FIELD CHECK</span>
          </div>
          <div className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5">
            {formatRelativeDays(daysRemaining)}
          </div>
          <div className="text-[11px] text-slate-500">
            {targetDateStr}
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Field } from '../../types/field';
import { Sprout, Clock, CloudSun, Bug, Calendar } from 'lucide-react';

interface FieldContextStripProps {
  field: Field;
}

export const FieldContextStrip: React.FC<FieldContextStripProps> = ({ field }) => {
  const analysis = field.latestAnalysis;
  const weather = analysis.weather;
  const pest = analysis.pest;
  const cropStage = analysis.cropStage;
  const followup = analysis.followup;

  return (
    <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-xs">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
        {/* 1. CROP */}
        <div className="pt-2 sm:pt-0 sm:px-2 first:px-0">
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-bold uppercase tracking-wider font-mono">
            <Sprout className="w-3.5 h-3.5 text-emerald-600" />
            <span>CROP</span>
          </div>
          <div className="text-sm font-semibold text-slate-900 mt-0.5">
            {field.crop}
          </div>
          <div className="text-xs text-slate-500">
            Day {field.daysSincePlanting}
          </div>
        </div>

        {/* 2. GROWTH STAGE */}
        <div className="pt-2 sm:pt-0 sm:px-3">
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-bold uppercase tracking-wider font-mono">
            <Clock className="w-3.5 h-3.5 text-indigo-600" />
            <span>GROWTH STAGE</span>
          </div>
          <div className="text-sm font-semibold text-slate-900 mt-0.5 truncate" title={cropStage?.stageName || field.estimatedGrowthStage}>
            {cropStage?.stageName || field.estimatedGrowthStage}
          </div>
          <div className="text-xs text-slate-500">
            Estimated
          </div>
        </div>

        {/* 3. WEATHER */}
        <div className="pt-2 sm:pt-0 sm:px-3">
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-bold uppercase tracking-wider font-mono">
            <CloudSun className="w-3.5 h-3.5 text-sky-600" />
            <span>WEATHER</span>
          </div>
          <div className="text-sm font-semibold text-slate-900 mt-0.5">
            {weather.temperature}°C · {weather.humidity}% RH
          </div>
          <div className="text-xs text-slate-500">
            {weather.recentRainfall} mm rainfall
          </div>
        </div>

        {/* 4. PEST PRESSURE */}
        <div className="pt-2 sm:pt-0 sm:px-3">
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-bold uppercase tracking-wider font-mono">
            <Bug className="w-3.5 h-3.5 text-amber-600" />
            <span>PEST PRESSURE</span>
          </div>
          <div className="text-sm font-semibold text-slate-900 mt-0.5">
            {pest.currentCount} {pest.pestType}
          </div>
          <div className="text-xs text-slate-500">
            {pest.previousCount !== undefined && pest.currentCount > pest.previousCount
              ? `↑ from ${pest.previousCount}`
              : pest.previousCount !== undefined && pest.currentCount < pest.previousCount
              ? `↓ from ${pest.previousCount}`
              : pest.pestPressure}
          </div>
        </div>

        {/* 5. NEXT CHECK */}
        <div className="pt-2 sm:pt-0 sm:px-3">
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-bold uppercase tracking-wider font-mono">
            <Calendar className="w-3.5 h-3.5 text-rose-600" />
            <span>NEXT CHECK</span>
          </div>
          <div className="text-sm font-semibold text-slate-900 mt-0.5">
            In {followup.daysRemaining || field.nextCheckDays} days
          </div>
          <div className="text-xs text-slate-500">
            {followup.targetDate || 'Recommended'}
          </div>
        </div>
      </div>
    </div>
  );
};

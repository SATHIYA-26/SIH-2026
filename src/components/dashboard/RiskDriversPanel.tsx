import React from 'react';
import { RiskResult } from '../../types/risk';
import { Droplets, CloudRain, Bug, AlertCircle, Clock, Thermometer, ShieldCheck, Sprout, Activity } from 'lucide-react';

interface RiskDriversPanelProps {
  risk: RiskResult;
}

export const RiskDriversPanel: React.FC<RiskDriversPanelProps> = ({ risk }) => {
  const drivers = risk.drivers || [];

  const getDriverIcon = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes('humidity') || t.includes('wetness')) return Droplets;
    if (t.includes('rain')) return CloudRain;
    if (t.includes('pest') || t.includes('aphid') || t.includes('whitefly') || t.includes('vector')) return Bug;
    if (t.includes('temp')) return Thermometer;
    if (t.includes('disease') || t.includes('signal') || t.includes('pathogen') || t.includes('lesion')) return Activity;
    if (t.includes('stage') || t.includes('crop') || t.includes('growth')) return Sprout;
    if (t.includes('treatment') || t.includes('mitigation') || t.includes('response')) return ShieldCheck;
    return AlertCircle;
  };

  const getImpactBadge = (impact: string) => {
    switch (impact?.toLowerCase()) {
      case 'high':
        return (
          <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider bg-rose-100 text-rose-800 border border-rose-200">
            High Impact
          </span>
        );
      case 'medium':
      case 'moderate':
        return (
          <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200">
            Medium Impact
          </span>
        );
      default:
        return (
          <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
            Low / Mitigating
          </span>
        );
    }
  };

  const getCardBorderClass = (impact: string) => {
    switch (impact?.toLowerCase()) {
      case 'high':
        return 'border-l-4 border-l-rose-500 border-slate-200 bg-white';
      case 'medium':
      case 'moderate':
        return 'border-l-4 border-l-amber-500 border-slate-200 bg-white';
      default:
        return 'border-l-4 border-l-emerald-500 border-slate-200 bg-white';
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-slate-700" />
          <h3 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-tight font-heading">
            4. WHY DID IT HAPPEN? (ROOT-CAUSE RISK CONTRIBUTORS)
          </h3>
        </div>
        <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded self-start sm:self-auto">
          {drivers.length} Factors Monitored
        </span>
      </div>

      {/* Spacious, Uncongested Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {drivers.map((drv) => {
          const Icon = getDriverIcon(drv.title);

          return (
            <div
              key={drv.id}
              className={`p-4 rounded-xl border shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between ${getCardBorderClass(
                drv.impact
              )}`}
            >
              <div>
                {/* Header Row: Icon + Title on left, Impact badge on right (no overlapping) */}
                <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-6 h-6 rounded-md bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold text-slate-800 truncate" title={drv.title}>
                      {drv.title}
                    </span>
                  </div>

                  {getImpactBadge(drv.impact)}
                </div>

                {/* Metric Value */}
                <div className="mt-2.5">
                  <div className="text-base font-bold text-slate-900 font-heading tracking-tight">
                    {drv.value}
                  </div>
                </div>

                {/* Explanation */}
                {drv.description && (
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    {drv.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Insight Note */}
      <div className="pt-2 text-[11px] text-slate-500 flex items-center justify-between border-t border-slate-100">
        <span>Drivers weighted by multi-factor epidemiological model</span>
        <span className="font-medium text-slate-700">Updated per scouting check</span>
      </div>
    </div>
  );
};

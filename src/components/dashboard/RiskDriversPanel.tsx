import React from 'react';
import { RiskResult } from '../../types/risk';
import { Droplets, CloudRain, Bug, AlertCircle, Clock, CheckCircle } from 'lucide-react';

interface RiskDriversPanelProps {
  risk: RiskResult;
}

export const RiskDriversPanel: React.FC<RiskDriversPanelProps> = ({ risk }) => {
  const drivers = risk.drivers || [];

  const getDriverIcon = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes('humidity')) return Droplets;
    if (t.includes('rain')) return CloudRain;
    if (t.includes('pest') || t.includes('aphid')) return Bug;
    if (t.includes('stage') || t.includes('crop')) return Clock;
    return AlertCircle;
  };

  const isHighRisk = risk.level === 'HIGH';

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-base font-semibold text-slate-900 uppercase tracking-tight">
            {isHighRisk ? 'WHY IS THE RISK HIGH?' : 'MAIN RISK FACTORS'}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Key field and microclimate conditions influencing outbreak probability
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 text-slate-700">
          7-Day Forecast Horizon
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 mt-4">
        {drivers.map((drv) => {
          const Icon = getDriverIcon(drv.title);
          const isHighImpact = drv.impact === 'high';

          return (
            <div
              key={drv.id}
              className={`p-3.5 rounded-lg border transition-all ${
                isHighImpact
                  ? 'bg-rose-50/40 border-rose-200/90 hover:bg-rose-50/70'
                  : 'bg-slate-50/80 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`p-2 rounded-md ${
                    isHighImpact
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-slate-200/80 text-slate-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                <div className="flex-1">
                  <div className="text-xs text-slate-500 font-bold uppercase tracking-wider font-mono">
                    {drv.title}
                  </div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">
                    {drv.value}
                  </div>
                  {drv.description && (
                    <p className="text-xs text-slate-600 mt-1 leading-snug">
                      {drv.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

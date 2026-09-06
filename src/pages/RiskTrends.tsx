import React from 'react';
import { useFieldStore } from '../stores/fieldStore';
import { getFieldTrendData } from '../utils/trendGenerator';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { TrendingUp, ShieldAlert, AlertCircle, MapPin } from 'lucide-react';

export const RiskTrends: React.FC = () => {
  const { getSelectedField, fields } = useFieldStore();
  const field = getSelectedField();

  const data = getFieldTrendData(field, '30 Days');
  const currentRisk = Math.round(field.riskProbability * 100);

  // Average risk across all fields
  const avgRisk = Math.round(
    fields.reduce((acc, f) => acc + f.riskProbability, 0) / fields.length * 100
  );

  return (
    <div className="space-y-6">
      <div className="pb-2 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Risk Trends & Forecast Horizon
            </h1>
            <span
              className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                field.riskLevel === 'HIGH'
                  ? 'bg-rose-100 text-rose-800'
                  : field.riskLevel === 'MODERATE'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              {field.riskLevel} RISK
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span>Temporal risk evolution and 7-day forecast horizon for <strong>{field.name}</strong></span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-xs text-slate-500">Current 7-Day Outbreak Risk</span>
          <div
            className={`text-2xl font-extrabold mt-1 ${
              field.riskLevel === 'HIGH'
                ? 'text-rose-700'
                : field.riskLevel === 'MODERATE'
                ? 'text-amber-700'
                : 'text-emerald-700'
            }`}
          >
            {currentRisk}%
          </div>
          <span className="text-[11px] text-slate-500">{field.name} ({field.crop})</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-xs text-slate-500">Average Portfolio Risk</span>
          <div className="text-2xl font-extrabold text-slate-800 mt-1">{avgRisk}%</div>
          <span className="text-[11px] text-slate-500">Across {fields.length} monitored plots</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-xs text-slate-500">Primary Risk Driver</span>
          <div className="text-sm font-bold text-slate-900 mt-1">
            {field.latestAnalysis?.risk?.drivers?.[0]?.title || 'Canopy Microclimate'} (
            {field.latestAnalysis?.risk?.drivers?.[0]?.value || `${field.latestAnalysis.weather.humidity}% RH`})
          </div>
          <span className="text-[11px] text-slate-500">
            {field.latestAnalysis.weather.recentRainfall} mm rainfall · {field.latestAnalysis.pest.currentCount} {field.latestAnalysis.pest.pestType}
          </span>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">
            Risk Probability Trajectory & Outbreak Horizon (%) — {field.name}
          </h3>
          <span className="text-xs text-slate-500">{field.locationName}</span>
        </div>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={field.riskLevel === 'HIGH' ? '#dc2626' : '#166534'}
                    stopOpacity={0.35}
                  />
                  <stop
                    offset="95%"
                    stopColor={field.riskLevel === 'HIGH' ? '#dc2626' : '#166534'}
                    stopOpacity={0.0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 100]} unit="%" tick={{ fontSize: 11 }} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="riskProbability"
                name="Outbreak Risk"
                stroke={field.riskLevel === 'HIGH' ? '#dc2626' : '#166534'}
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#riskGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  Legend,
  Area,
  AreaChart,
} from 'recharts';
import { useFieldStore } from '../../stores/fieldStore';
import { getFieldTrendData } from '../../utils/trendGenerator';
import { TrendingUp, AlertTriangle, Bug, Activity, ShieldCheck } from 'lucide-react';

interface RiskTrendChartProps {
  className?: string;
}

export const RiskTrendChart: React.FC<RiskTrendChartProps> = ({ className = '' }) => {
  const { getSelectedField } = useFieldStore();
  const field = getSelectedField();

  const [metricTab, setMetricTab] = useState<'risk' | 'disease' | 'pest'>('risk');
  const [range, setRange] = useState<'7 Days' | '14 Days' | '30 Days'>('7 Days');

  // Dynamic series computed for the selected field
  const data = getFieldTrendData(field, range);

  const startRisk = data[0]?.riskProbability || 0;
  const endRisk = data[data.length - 1]?.riskProbability || Math.round(field.riskProbability * 100);
  const riskDelta = endRisk - startRisk;

  const currentPest = field.latestAnalysis?.pest?.currentCount || 0;
  const pestType = field.latestAnalysis?.pest?.pestType || 'Aphids';

  return (
    <div className={`bg-white border border-slate-200 rounded-xl p-5 shadow-xs ${className}`}>
      {/* Chart Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-slate-900 uppercase tracking-tight">
              {metricTab === 'risk'
                ? 'HEALTH RISK TREND'
                : metricTab === 'disease'
                  ? 'DISEASE SPREAD HISTORY'
                  : 'INSECT COUNT TREND'}
            </h3>
            <span
              className={`text-[11px] font-bold px-2 py-0.5 rounded border ${field.riskLevel === 'HIGH'
                  ? 'text-rose-800 bg-rose-50 border-rose-200'
                  : field.riskLevel === 'MODERATE'
                    ? 'text-amber-800 bg-amber-50 border-amber-200'
                    : 'text-emerald-800 bg-emerald-50 border-emerald-200'
                }`}
            >
              {field.name} · {riskDelta > 0 ? `+${riskDelta}% Trend` : riskDelta < 0 ? `${riskDelta}% Trend` : 'Stable'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {metricTab === 'risk'
              ? `7-day overall risk changes for ${field.name}`
              : metricTab === 'disease'
                ? `Crop condition changes over recent field checks`
                : `Insect count (${pestType}) compared with air humidity`}
          </p>
        </div>

        {/* Metric Switcher & Time Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Metric Selector */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
            <button
              type="button"
              onClick={() => setMetricTab('risk')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${metricTab === 'risk'
                  ? 'bg-white text-emerald-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
                }`}
            >
              Risk Trend
            </button>
            <button
              type="button"
              onClick={() => setMetricTab('disease')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${metricTab === 'disease'
                  ? 'bg-white text-emerald-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
                }`}
            >
              Disease
            </button>
            <button
              type="button"
              onClick={() => setMetricTab('pest')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${metricTab === 'pest'
                  ? 'bg-white text-emerald-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
                }`}
            >
              Insects
            </button>
          </div>

          {/* Time Range */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
            {(['7 Days', '14 Days', '30 Days'] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRange(r)}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${range === r
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                  }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart Viewport */}
      <div className="h-64 sm:h-72 w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          {metricTab === 'risk' ? (
            <LineChart data={data} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: '#64748b' }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={false}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 11, fill: '#64748b' }}
                axisLine={false}
                tickLine={false}
                unit="%"
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const val = payload[0].value;
                    const item = payload[0].payload;
                    return (
                      <div className="bg-slate-900 text-white text-xs rounded-lg p-2.5 shadow-lg border border-slate-800 space-y-1">
                        <div className="font-bold text-slate-200">{label} · {field.name}</div>
                        <div className="text-emerald-400 font-semibold">
                          7-Day Risk Level: <span className="text-white text-sm font-bold">{val}%</span>
                        </div>
                        <div className="text-slate-400 text-[11px]">
                          {pestType} Count: {item.pestCount} · Air Humidity: {item.humidity}% RH
                        </div>
                        {item.eventLabel && (
                          <div className="text-amber-400 font-medium text-[10px] pt-1 border-t border-slate-800">
                            {item.eventLabel}
                          </div>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <ReferenceLine y={60} stroke="#f43f5e" strokeDasharray="3 3" label={{ value: 'High Risk (60%)', fill: '#e11d48', fontSize: 10, position: 'right' }} />
              <ReferenceLine y={35} stroke="#f59e0b" strokeDasharray="3 3" label={{ value: 'Moderate (35%)', fill: '#d97706', fontSize: 10, position: 'right' }} />

              <Line
                type="monotone"
                dataKey="riskProbability"
                name="7-Day Risk Level"
                stroke={field.riskLevel === 'HIGH' ? '#dc2626' : field.riskLevel === 'MODERATE' ? '#d97706' : '#166534'}
                strokeWidth={3}
                dot={{ r: 4, fill: field.riskLevel === 'HIGH' ? '#dc2626' : '#166534', strokeWidth: 2, stroke: '#ffffff' }}
                activeDot={{ r: 6, fill: '#0f172a', stroke: '#ffffff', strokeWidth: 2 }}
              />
            </LineChart>
          ) : metricTab === 'disease' ? (
            <LineChart data={data} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis domain={[0, 100]} unit="%" tick={{ fontSize: 11, fill: '#64748b' }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="healthyProb" name="Healthy Leaves" stroke="#16a34a" strokeWidth={2.5} />
              <Line type="monotone" dataKey="bacterialProb" name="Leaf Blight (Spotted)" stroke="#dc2626" strokeWidth={2.5} />
              <Line type="monotone" dataKey="curlVirusProb" name="Leaf Curl" stroke="#d97706" strokeWidth={2} />
              <Line type="monotone" dataKey="fusariumProb" name="Wilt / Root Rot" stroke="#6366f1" strokeWidth={2} />
            </LineChart>
          ) : (
            <LineChart data={data} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis yAxisId="right" orientation="right" unit="%" tick={{ fontSize: 11, fill: '#64748b' }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line yAxisId="left" type="monotone" dataKey="pestCount" name={`${pestType} Count`} stroke="#e11d48" strokeWidth={2.5} dot={{ r: 4 }} />
              <Line yAxisId="right" type="monotone" dataKey="humidity" name="Air Humidity %" stroke="#0284c7" strokeWidth={2} strokeDasharray="4 4" />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 mt-2 pt-3 border-t border-slate-100 text-xs text-slate-500">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span
              className={`w-3 h-0.5 rounded-full ${field.riskLevel === 'HIGH' ? 'bg-rose-600' : 'bg-emerald-700'
                }`}
            />
            <span>Selected Field: <strong>{field.name}</strong> ({field.locationName})</span>
          </span>
        </div>
        <span className="text-[11px] text-slate-400">
          Updates automatically with each field check
        </span>
      </div>
    </div>
  );
};

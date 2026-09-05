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
} from 'recharts';
import { MOCK_TREND_DATA } from '../../data/mockData';
import { TrendingUp, AlertTriangle } from 'lucide-react';

interface RiskTrendChartProps {
  className?: string;
}

export const RiskTrendChart: React.FC<RiskTrendChartProps> = ({ className = '' }) => {
  const [range, setRange] = useState<'7 Days' | '14 Days' | '30 Days'>('7 Days');

  // Adjust data according to range
  const data = MOCK_TREND_DATA;

  return (
    <div className={`bg-white border border-slate-200 rounded-xl p-5 shadow-xs ${className}`}>
      {/* Chart Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-slate-900 uppercase tracking-tight">
              RISK TREND
            </h3>
            <span className="text-[11px] font-bold text-rose-800 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
              Trend: +26% in 7 days
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            7-day outbreak risk probability evolution over recent scouting checks
          </p>
        </div>

        {/* Time Filters */}
        <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
          {(['7 Days', '14 Days', '30 Days'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                range === r
                  ? 'bg-white text-emerald-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Viewport */}
      <div className="h-64 sm:h-72 w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
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
                      <div className="font-bold text-slate-200">{label}</div>
                      <div className="text-emerald-400 font-semibold">
                        7-Day Outbreak Risk: <span className="text-white text-sm font-bold">{val}%</span>
                      </div>
                      <div className="text-slate-400 text-[11px]">
                        Aphid Count: {item.pestCount} · Humidity: {item.humidity}% RH
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
            {/* 60% High Risk threshold line */}
            <ReferenceLine y={60} stroke="#f43f5e" strokeDasharray="3 3" label={{ value: 'High Risk (60%)', fill: '#e11d48', fontSize: 10, position: 'right' }} />
            <ReferenceLine y={35} stroke="#f59e0b" strokeDasharray="3 3" label={{ value: 'Moderate (35%)', fill: '#d97706', fontSize: 10, position: 'right' }} />
            
            <Line
              type="monotone"
              dataKey="riskProbability"
              name="7-Day Outbreak Risk"
              stroke="#166534"
              strokeWidth={3}
              dot={{ r: 4, fill: '#166534', strokeWidth: 2, stroke: '#ffffff' }}
              activeDot={{ r: 6, fill: '#dc2626', stroke: '#ffffff', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 mt-2 pt-3 border-t border-slate-100 text-xs text-slate-500">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-emerald-700 rounded-full" />
            <span>Outbreak Risk Probability (%)</span>
          </span>
        </div>
        <span className="text-[11px] text-slate-400">
          Updated on every scouting observation
        </span>
      </div>
    </div>
  );
};

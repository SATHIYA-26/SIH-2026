import React from 'react';
import { MOCK_TREND_DATA } from '../data/mockData';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, AreaChart, Area } from 'recharts';
import { TrendingUp, ShieldAlert, AlertCircle } from 'lucide-react';

export const RiskTrends: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="pb-2 border-b border-slate-200">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Risk Trends & Forecast Horizon
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Temporal risk variance, confidence envelopes, and cross-field risk distribution
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-xs text-slate-500">Current 7-Day Peak Risk</span>
          <div className="text-2xl font-extrabold text-rose-700 mt-1">68%</div>
          <span className="text-[11px] text-slate-400">Cotton Field A (Zone NE-2)</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-xs text-slate-500">Average Portfolio Risk</span>
          <div className="text-2xl font-extrabold text-amber-700 mt-1">38%</div>
          <span className="text-[11px] text-slate-400">Across 4 monitored parcels</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-xs text-slate-500">Primary Risk Driver</span>
          <div className="text-sm font-bold text-slate-900 mt-1">Canopy Humidity (86%)</div>
          <span className="text-[11px] text-emerald-700 font-medium">12 mm recent rainfall</span>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight mb-4">
          Risk Probability Trajectory & Outbreak Horizon (%)
        </h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={MOCK_TREND_DATA}>
              <defs>
                <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#166534" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#166534" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 100]} unit="%" tick={{ fontSize: 11 }} />
              <Tooltip />
              <Area type="monotone" dataKey="riskProbability" name="Outbreak Risk" stroke="#166534" strokeWidth={2.5} fillOpacity={1} fill="url(#riskGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

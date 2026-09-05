import React, { useState } from 'react';
import { MOCK_FIELD_HISTORY, MOCK_TREND_DATA } from '../data/mockData';
import { useFieldStore } from '../stores/fieldStore';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { Sprout, CheckCircle2, AlertTriangle, Clock, TrendingUp, Bug, Filter } from 'lucide-react';

export const History: React.FC = () => {
  const { getSelectedField } = useFieldStore();
  const field = getSelectedField();
  const [activeTab, setActiveTab] = useState<'timeline' | 'trends'>('timeline');

  const history = MOCK_FIELD_HISTORY;
  const trendData = MOCK_TREND_DATA;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Field History & Progression
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Chronological audit log and multi-dimensional trend charts for {field.name}
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
          <button
            onClick={() => setActiveTab('timeline')}
            className={`px-3.5 py-1.5 rounded-md font-semibold transition-colors cursor-pointer ${
              activeTab === 'timeline'
                ? 'bg-white text-emerald-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Chronological Timeline
          </button>
          <button
            onClick={() => setActiveTab('trends')}
            className={`px-3.5 py-1.5 rounded-md font-semibold transition-colors cursor-pointer ${
              activeTab === 'trends'
                ? 'bg-white text-emerald-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Multi-Trend Graphs
          </button>
        </div>
      </div>

      {activeTab === 'timeline' ? (
        /* Chronological Timeline */
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
          <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {history.map((entry, idx) => (
              <div key={entry.id} className="relative group">
                {/* Node marker */}
                <div
                  className={`absolute -left-6 sm:-left-8 top-1 w-6 h-6 rounded-full border-2 bg-white flex items-center justify-center ${
                    entry.category === 'planting'
                      ? 'border-emerald-600 text-emerald-700'
                      : entry.category === 'detection' || entry.riskProbability >= 0.6
                      ? 'border-rose-600 text-rose-700'
                      : 'border-slate-400 text-slate-600'
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full ${
                      entry.category === 'planting'
                        ? 'bg-emerald-600'
                        : entry.category === 'detection' || entry.riskProbability >= 0.6
                        ? 'bg-rose-600'
                        : 'bg-slate-400'
                    }`}
                  />
                </div>

                <div className="bg-slate-50/80 border border-slate-200 rounded-lg p-4 hover:border-slate-300 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-slate-200/60">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-900">
                        {entry.displayDate}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900">{entry.title}</h3>
                    </div>

                    <div className="text-xs text-slate-500 font-medium">
                      7-Day Risk: <strong className="text-slate-900">{Math.round(entry.riskProbability * 100)}%</strong>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 mt-2.5 leading-relaxed">
                    {entry.conditionSummary}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 mt-3 pt-2 text-[11px] text-slate-500 border-t border-slate-100">
                    <span>Weather: {entry.weatherSummary}</span>
                    <span>·</span>
                    <span>Pest Count: {entry.pestCount} insects / leaf</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Multi-Trend Combined View */
        <div className="space-y-6">
          {/* 1. Risk Trend Chart */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight mb-1">
              Outbreak Risk (%) vs Time
            </h3>
            <div className="h-60 w-full mt-3">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 100]} unit="%" tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="riskProbability" name="Outbreak Risk" stroke="#166534" strokeWidth={2.5} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 2. Pest Population & Humidity Trend */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight mb-1">
              Pest Count vs Relative Humidity (%)
            </h3>
            <div className="h-60 w-full mt-3">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
                  <YAxis yAxisId="right" orientation="right" unit="%" tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Line yAxisId="left" type="monotone" dataKey="pestCount" name="Aphid Count" stroke="#e11d48" strokeWidth={2} />
                  <Line yAxisId="right" type="monotone" dataKey="humidity" name="Humidity %" stroke="#0284c7" strokeWidth={2} strokeDasharray="4 4" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

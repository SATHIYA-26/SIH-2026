import React from 'react';
import { useFieldStore } from '../stores/fieldStore';
import { getFieldTrendData } from '../utils/trendGenerator';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Bug, MapPin } from 'lucide-react';

export const PestTrends: React.FC = () => {
  const { getSelectedField } = useFieldStore();
  const field = getSelectedField();

  const data = getFieldTrendData(field, '30 Days');
  const pestType = field.latestAnalysis?.pest?.pestType || 'Aphids';

  return (
    <div className="space-y-6">
      <div className="pb-2 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Pest Population & Pressure Metrics
            </h1>
            <span className="text-xs font-bold bg-rose-100 text-rose-900 px-2.5 py-0.5 rounded-full">
              {pestType}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span>Scouted insect density and threshold tracking for <strong>{field.name}</strong></span>
          </p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">
            {pestType} Count per 20 Sampled Leaves — {field.name}
          </h3>
          <span className="text-xs text-slate-500">
            Current Count: <strong>{field.latestAnalysis.pest.currentCount} insects/leaf</strong> ({field.pestPressureSummary})
          </span>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="pestCount" name={`${pestType} Count`} fill="#e11d48" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

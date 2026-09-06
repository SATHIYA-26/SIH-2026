import React from 'react';
import { useFieldStore } from '../stores/fieldStore';
import { getFieldTrendData } from '../utils/trendGenerator';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { Activity, ShieldCheck, MapPin } from 'lucide-react';

export const DiseaseTrends: React.FC = () => {
  const { getSelectedField } = useFieldStore();
  const field = getSelectedField();

  const data = getFieldTrendData(field, '30 Days');

  return (
    <div className="space-y-6">
      <div className="pb-2 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Disease Occurrence & Class Probabilities
            </h1>
            <span className="text-xs font-bold bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-full">
              {field.crop}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span>Temporal shifts in condition classification for <strong>{field.name}</strong></span>
          </p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">
            Disease Class Probability Distribution Over Time (%) — {field.name}
          </h3>
          <span className="text-xs text-slate-500">Current Diagnosis: <strong>{field.currentConditionStatus}</strong></span>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 100]} unit="%" tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="healthyProb" name="Healthy Foliage" stroke="#16a34a" strokeWidth={2.5} />
              <Line type="monotone" dataKey="bacterialProb" name="Bacterial Blight" stroke="#dc2626" strokeWidth={2.5} />
              <Line type="monotone" dataKey="curlVirusProb" name="Leaf Curl Virus" stroke="#d97706" strokeWidth={2} />
              <Line type="monotone" dataKey="fusariumProb" name="Fusarium Wilt" stroke="#6366f1" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

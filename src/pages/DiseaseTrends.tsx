import React from 'react';
import { MOCK_TREND_DATA } from '../data/mockData';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { Activity, ShieldCheck } from 'lucide-react';

export const DiseaseTrends: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="pb-2 border-b border-slate-200">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Disease Occurrence & Class Probabilities
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Temporal shifts in visual disease detection across the 4 crop conditions
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight mb-4">
          Disease Class Probability Distribution Over Time (%)
        </h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={MOCK_TREND_DATA}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 100]} unit="%" tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="healthyProb" name="Healthy Foliage" stroke="#16a34a" strokeWidth={2} />
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

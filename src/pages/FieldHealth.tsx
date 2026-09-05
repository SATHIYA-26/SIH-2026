import React from 'react';
import { useFieldStore } from '../stores/fieldStore';
import { StatusBadge } from '../components/common/StatusBadge';
import { HeartPulse, CheckCircle2, AlertTriangle, ShieldCheck, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const FieldHealth: React.FC = () => {
  const navigate = useNavigate();
  const { fields, setSelectedFieldId } = useFieldStore();

  return (
    <div className="space-y-6">
      <div className="pb-2 border-b border-slate-200">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Field Health Overview
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Holistic portfolio view of vegetative vigor, disease presence, and risk ratings
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {fields.map((f) => {
          const riskPercent = Math.round(f.riskProbability * 100);
          return (
            <div
              key={f.id}
              onClick={() => {
                setSelectedFieldId(f.id);
                navigate('/');
              }}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:border-slate-300 transition-colors cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{f.name}</h3>
                    <p className="text-xs text-slate-500">{f.crop} · {f.areaAcres} ac</p>
                  </div>
                  <StatusBadge type="risk" riskLevel={f.riskLevel} size="sm" />
                </div>

                <div className="space-y-1.5 text-xs bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Condition:</span>
                    <span className="font-semibold text-slate-900 truncate max-w-36">{f.currentConditionStatus}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">7-Day Risk:</span>
                    <span className="font-bold text-slate-900">{riskPercent}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Growth Stage:</span>
                    <span className="font-medium text-slate-700 truncate max-w-32">{f.estimatedGrowthStage}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-emerald-800 font-semibold">
                <span>View Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

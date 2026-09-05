import React from 'react';
import { useFieldStore } from '../stores/fieldStore';
import { ComparisonView } from '../components/followup/ComparisonView';
import { DEMO_SCENARIO_HIGH_RISK, DEMO_SCENARIO_IMPROVING } from '../data/mockData';
import { GitCompare, PlusCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Compare: React.FC = () => {
  const navigate = useNavigate();
  const { getSelectedField } = useFieldStore();
  const field = getSelectedField();

  const previous = field.previousAnalysis || DEMO_SCENARIO_HIGH_RISK.latestAnalysis;
  const current = field.latestAnalysis;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Field Follow-up Comparison
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Evaluate field health evolution between consecutive scouting visits for {field.name}
          </p>
        </div>

        <button
          onClick={() => navigate(`/check-field?fieldId=${field.id}`)}
          className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>RUN NEW RECHECK</span>
        </button>
      </div>

      <ComparisonView
        previous={previous}
        current={current}
        status={current.comparisonStatus || 'IMPROVING'}
      />

      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">
          How Continuous Comparison Works
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          Instead of treating disease detection as an isolated one-time photo event, AgroPulse AI evaluates 
          the <strong>temporal delta</strong> across disease symptoms, aphid/pest pressure counts, and microclimate humidity.
          This enables farmers to objectively verify if containment measures and natural drying are succeeding (<strong>IMPROVING</strong>)
          or if high pathogen pressure requires immediate intervention (<strong>WORSENING</strong>).
        </p>
      </div>
    </div>
  );
};

import React from 'react';
import { useFieldStore, DemoScenarioKey } from '../../stores/fieldStore';
import { Sliders, Sparkles } from 'lucide-react';

export const ScenarioSelector: React.FC = () => {
  const { activeScenario, setScenario } = useFieldStore();

  const scenarios: { key: DemoScenarioKey; label: string; desc: string }[] = [
    { key: 'HIGH_RISK', label: '1. High Risk (Default)', desc: 'Bacterial Blight 91.3% · 68% Risk' },
    { key: 'IMPROVING', label: '2. Improving After Follow-up', desc: '41% Risk · 10 Aphids · Stabilizing' },
    { key: 'LOW_RISK', label: '3. Normal / Low Risk', desc: 'Healthy 94.5% · 18% Risk' },
    { key: 'MODERATE_RISK', label: '4. Moderate Risk', desc: 'Curl Virus · 44% Risk' },
    { key: 'WORSENING', label: '5. Outbreak / Worsening', desc: '89% Risk · 28 Aphids · Urgent' },
  ];

  return (
    <div className="flex items-center gap-2 bg-emerald-950 text-white px-3 py-1.5 rounded-lg border border-emerald-800 text-xs shadow-sm">
      <div className="flex items-center gap-1.5 text-emerald-300 font-semibold uppercase tracking-wider text-[11px] whitespace-nowrap">
        <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
        <span>Demo Scenario:</span>
      </div>
      <select
        value={activeScenario}
        onChange={(e) => setScenario(e.target.value as DemoScenarioKey)}
        className="bg-emerald-900/90 text-white text-xs rounded border border-emerald-700/60 px-2 py-1 focus:outline-none focus:ring-1 focus:ring-emerald-400 cursor-pointer"
      >
        {scenarios.map((s) => (
          <option key={s.key} value={s.key} className="bg-slate-900 text-white">
            {s.label} — {s.desc}
          </option>
        ))}
      </select>
    </div>
  );
};

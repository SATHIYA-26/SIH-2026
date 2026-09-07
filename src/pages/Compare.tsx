import React, { useState } from 'react';
import { useFieldStore } from '../stores/fieldStore';
import { ComparisonView, ComparisonCheckpoint } from '../components/followup/ComparisonView';
import { StatusBadge } from '../components/common/StatusBadge';
import {
  GitCompare,
  PlusCircle,
  ArrowRight,
  Sparkles,
  Layers,
  MapPin,
  Calendar,
  Activity,
  Bug,
  Sprout,
  Droplets,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatCalendarDate } from '../utils/dateUtils';
import { COTTON_LEAF_BACTERIAL_IMAGE, COTTON_LEAF_HEALTHY_IMAGE } from '../data/mockData';
import { getValidLeafImageUrl } from '../utils/imageUtils';

export const Compare: React.FC = () => {
  const navigate = useNavigate();
  const { fields, selectedFieldId, setSelectedFieldId } = useFieldStore();
  const [compareMode, setCompareMode] = useState<'followup' | 'field_to_field'>('followup');

  // Follow-up mode state
  const [activeFieldId, setActiveFieldId] = useState<string>(selectedFieldId || fields[0]?.id || 'field-cotton-a');
  const targetField = fields.find((f) => f.id === activeFieldId) || fields[0];

  // Build checkpoints for the selected field
  const baselineCheckpoint: ComparisonCheckpoint = {
    id: `chk-base-${targetField.id}`,
    label: 'Baseline Check',
    date: targetField.plantingDate ? `Sown ${formatCalendarDate(targetField.plantingDate, 'short')}` : 'Initial Sowing',
    riskProbability: targetField.previousAnalysis?.risk.probability ?? 0.55,
    riskLevel: targetField.previousAnalysis?.risk.level ?? 'MODERATE',
    pestCount: targetField.previousAnalysis?.pest.currentCount ?? 10,
    pestType: targetField.previousAnalysis?.pest.pestType ?? 'Cotton Aphid',
    conditionStatus: targetField.previousAnalysis?.condition.status ?? 'Bacterial Blight Detected',
    leafImageUrl: getValidLeafImageUrl(targetField.previousAnalysis?.condition.leafImageUrl, targetField.previousAnalysis?.condition.status),
    treatmentApplied: 'PARTIAL',
    treatmentNotes: 'Baseline scouting check',
    humidity: targetField.previousAnalysis?.weather.humidity ?? 86,
    rainfall: targetField.previousAnalysis?.weather.recentRainfall ?? 12,
    advisory: 'Initial baseline assessment',
  };

  const followUpCheckpoints: ComparisonCheckpoint[] = (targetField.followUpHistory || [])
    .slice()
    .reverse()
    .map((rec) => ({
      id: rec.id,
      label: `Follow-Up #${rec.followUpNumber}`,
      date: rec.displayDate,
      riskProbability: rec.riskProbability,
      riskLevel: rec.riskLevel,
      pestCount: rec.currentPestCount,
      pestType: rec.pestType,
      conditionStatus: rec.symptomObserved,
      leafImageUrl: getValidLeafImageUrl(rec.leafImageUrl, rec.symptomObserved),
      treatmentApplied: rec.treatmentApplied,
      treatmentNotes: rec.treatmentNotes,
      humidity: 86,
      rainfall: 12,
      advisory: rec.agronomicAdvisory,
    }));

  const allCheckpoints = [baselineCheckpoint, ...followUpCheckpoints];

  const [checkpointIdxA, setCheckpointIdxA] = useState<number>(0);
  const [checkpointIdxB, setCheckpointIdxB] = useState<number>(Math.max(0, allCheckpoints.length - 1));

  const checkA = allCheckpoints[checkpointIdxA] || allCheckpoints[0];
  const checkB = allCheckpoints[checkpointIdxB] || allCheckpoints[allCheckpoints.length - 1];

  // Field-to-field mode state
  const [fieldAId, setFieldAId] = useState<string>(fields[0]?.id || 'field-cotton-a');
  const [fieldBId, setFieldBId] = useState<string>(fields[1]?.id || fields[0]?.id || 'field-cotton-b');

  const fieldA = fields.find((f) => f.id === fieldAId) || fields[0];
  const fieldB = fields.find((f) => f.id === fieldBId) || fields[1] || fields[0];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-heading">
              Field & Follow-Up Comparison
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-900">
              Comparative Telemetry
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Compare progression between consecutive follow-up checks or benchmark two monitored field plots.
          </p>
        </div>

        {/* Mode Toggle Switcher */}
        <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 self-start sm:self-auto text-xs">
          <button
            type="button"
            onClick={() => setCompareMode('followup')}
            className={`px-3 py-1.5 rounded-md font-bold transition-all cursor-pointer ${
              compareMode === 'followup'
                ? 'bg-white text-emerald-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Follow-Up Checkpoints
          </button>
          <button
            type="button"
            onClick={() => setCompareMode('field_to_field')}
            className={`px-3 py-1.5 rounded-md font-bold transition-all cursor-pointer ${
              compareMode === 'field_to_field'
                ? 'bg-blue-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Field-to-Field Comparison
          </button>
        </div>
      </div>

      {/* MODE 1: FOLLOW-UP PROGRESSION COMPARATOR */}
      {compareMode === 'followup' && (
        <div className="space-y-6">
          {/* Field Selection Bar */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700 uppercase font-heading">Select Plot:</span>
              <select
                value={activeFieldId}
                onChange={(e) => {
                  setActiveFieldId(e.target.value);
                  setSelectedFieldId(e.target.value);
                  setCheckpointIdxA(0);
                  setCheckpointIdxB(1);
                }}
                className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-900 focus:ring-1 focus:ring-emerald-600 cursor-pointer"
              >
                {fields.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name} ({f.crop} · {f.followUpCount || 0} follow-ups)
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500">Comparing Checkpoint:</span>
              <select
                value={checkpointIdxA}
                onChange={(e) => setCheckpointIdxA(parseInt(e.target.value))}
                className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs font-bold text-slate-800 cursor-pointer"
              >
                {allCheckpoints.map((c, i) => (
                  <option key={i} value={i}>
                    A: {c.label} ({c.date})
                  </option>
                ))}
              </select>
              <span className="text-slate-400">vs</span>
              <select
                value={checkpointIdxB}
                onChange={(e) => setCheckpointIdxB(parseInt(e.target.value))}
                className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs font-bold text-slate-800 cursor-pointer"
              >
                {allCheckpoints.map((c, i) => (
                  <option key={i} value={i}>
                    B: {c.label} ({c.date})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Comparison View Component */}
          <ComparisonView
            checkpointA={checkA}
            checkpointB={checkB}
          />
        </div>
      )}

      {/* MODE 2: FIELD-TO-FIELD BENCHMARK COMPARATOR */}
      {compareMode === 'field_to_field' && (
        <div className="space-y-6">
          {/* Select Field A & Field B */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2 shadow-xs">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider font-heading">
                Plot A (Benchmark Baseline)
              </label>
              <select
                value={fieldAId}
                onChange={(e) => setFieldAId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-600 cursor-pointer"
              >
                {fields.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name} ({f.crop} · {f.areaAcres} ac)
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2 shadow-xs">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider font-heading">
                Plot B (Comparison Target)
              </label>
              <select
                value={fieldBId}
                onChange={(e) => setFieldBId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-600 cursor-pointer"
              >
                {fields.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name} ({f.crop} · {f.areaAcres} ac)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Field Comparison Table */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-heading">
                Side-by-Side Field Health Matrix
              </h3>
              <span className="text-xs text-slate-500 font-medium">
                {fieldA.name} vs {fieldB.name}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px] font-heading">
                    <th className="py-3 px-4 w-1/3">Agricultural Parameter</th>
                    <th className="py-3 px-4 w-1/3 font-bold text-slate-900">{fieldA.name}</th>
                    <th className="py-3 px-4 w-1/3 font-bold text-slate-900">{fieldB.name}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-3 px-4 text-slate-500 font-medium">Crop & Variety</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{fieldA.crop} ({fieldA.variety || 'Standard'})</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{fieldB.crop} ({fieldB.variety || 'Standard'})</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-slate-500 font-medium">7-Day Outbreak Risk</td>
                    <td className="py-3 px-4">
                      <span className={`font-bold font-heading ${fieldA.riskLevel === 'HIGH' ? 'text-rose-700' : 'text-emerald-700'}`}>
                        {Math.round(fieldA.riskProbability * 100)}% ({fieldA.riskLevel})
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`font-bold font-heading ${fieldB.riskLevel === 'HIGH' ? 'text-rose-700' : 'text-emerald-700'}`}>
                        {Math.round(fieldB.riskProbability * 100)}% ({fieldB.riskLevel})
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-slate-500 font-medium">Visual Leaf Status</td>
                    <td className="py-3 px-4 font-medium text-slate-800">{fieldA.currentConditionStatus}</td>
                    <td className="py-3 px-4 font-medium text-slate-800">{fieldB.currentConditionStatus}</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-slate-500 font-medium">Pest Pressure</td>
                    <td className="py-3 px-4 font-medium text-slate-800">{fieldA.pestPressureSummary}</td>
                    <td className="py-3 px-4 font-medium text-slate-800">{fieldB.pestPressureSummary}</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-slate-500 font-medium">Follow-Up Inspections Completed</td>
                    <td className="py-3 px-4 font-heading font-bold">{fieldA.followUpCount || 0} checks recorded</td>
                    <td className="py-3 px-4 font-heading font-bold">{fieldB.followUpCount || 0} checks recorded</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-slate-500 font-medium">Plot Area & Location</td>
                    <td className="py-3 px-4 text-slate-600">{fieldA.areaAcres} acres · {fieldA.locationName}</td>
                    <td className="py-3 px-4 text-slate-600">{fieldB.areaAcres} acres · {fieldB.locationName}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

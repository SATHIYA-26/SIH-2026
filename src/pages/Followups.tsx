import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFieldStore } from '../stores/fieldStore';
import { StatusBadge } from '../components/common/StatusBadge';
import { ComparisonView, ComparisonCheckpoint } from '../components/followup/ComparisonView';
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  PlusCircle,
  ArrowRight,
  MapPin,
  GitCompare,
  Check,
  X,
  History,
  ShieldCheck,
  Search,
  Filter,
  Eye,
  Layers,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Activity,
  Bug,
  Sprout,
  Image as ImageIcon
} from 'lucide-react';
import { Field, FollowUpRecord } from '../types/field';
import { computeTargetDate, formatRelativeDays, formatCalendarDate } from '../utils/dateUtils';
import { COTTON_LEAF_BACTERIAL_IMAGE, COTTON_LEAF_HEALTHY_IMAGE } from '../data/mockData';
import { getValidLeafImageUrl } from '../utils/imageUtils';

export const Followups: React.FC = () => {
  const navigate = useNavigate();
  const { fields, selectedFieldId, setSelectedFieldId } = useFieldStore();

  // Active field selected for progression inspection
  const activeField = fields.find((f) => f.id === selectedFieldId) || fields[0];

  // Build complete chronological checkpoint list for the active field:
  // Checkpoint 0: Baseline Check
  // Checkpoint 1..N: Follow-Up #1, Follow-Up #2, ...
  const baselineCheckpoint: ComparisonCheckpoint = {
    id: `chk-baseline-${activeField.id}`,
    label: 'Baseline (Initial Check)',
    date: activeField.plantingDate ? `Sown ${formatCalendarDate(activeField.plantingDate, 'short')}` : 'Initial Sowing',
    riskProbability: activeField.previousAnalysis?.risk.probability ?? 0.55,
    riskLevel: activeField.previousAnalysis?.risk.level ?? 'MODERATE',
    pestCount: activeField.previousAnalysis?.pest.currentCount ?? 10,
    pestType: activeField.previousAnalysis?.pest.pestType ?? 'Cotton Aphid',
    conditionStatus: activeField.previousAnalysis?.condition.status ?? 'Bacterial Blight Detected',
    leafImageUrl: getValidLeafImageUrl(activeField.previousAnalysis?.condition.leafImageUrl, activeField.previousAnalysis?.condition.status),
    treatmentApplied: 'PARTIAL',
    treatmentNotes: 'Baseline scouting inspection',
    humidity: activeField.previousAnalysis?.weather.humidity ?? 86,
    rainfall: activeField.previousAnalysis?.weather.recentRainfall ?? 12,
    advisory: 'Initial baseline assessment',
  };

  const followUpCheckpoints: ComparisonCheckpoint[] = (activeField.followUpHistory || [])
    .slice()
    .reverse() // Sort chronological: #1, #2, #3...
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

  const allCheckpoints: ComparisonCheckpoint[] = [baselineCheckpoint, ...followUpCheckpoints];

  // Selected checkpoints for comparison
  const [selectedIdxA, setSelectedIdxA] = useState<number>(0); // Baseline default
  const [selectedIdxB, setSelectedIdxB] = useState<number>(Math.max(0, allCheckpoints.length - 1)); // Latest default
  const [comparisonTab, setComparisonTab] = useState<'comparator' | 'timeline'>('comparator');

  const checkpointA = allCheckpoints[selectedIdxA] || allCheckpoints[0];
  const checkpointB = allCheckpoints[selectedIdxB] || allCheckpoints[allCheckpoints.length - 1];

  // Collect all history records across all fields for the audit table
  const allHistoryRecords: { fieldName: string; crop: string; fieldId: string; record: FollowUpRecord }[] = [];
  fields.forEach((f) => {
    (f.followUpHistory || []).forEach((rec) => {
      allHistoryRecords.push({
        fieldName: f.name,
        crop: f.crop,
        fieldId: f.id,
        record: rec,
      });
    });
  });

  const [tableFieldFilter, setTableFieldFilter] = useState<string>('ALL');
  const filteredHistory = allHistoryRecords.filter(
    (item) => tableFieldFilter === 'ALL' || item.fieldId === tableFieldFilter
  );

  const schedules = fields.map((f) => {
    const daysRemaining = f.nextCheckDays ?? f.latestAnalysis?.followup?.daysRemaining ?? 4;
    const targetDate = computeTargetDate(daysRemaining);

    return {
      fieldId: f.id,
      fieldName: f.name,
      crop: f.crop,
      areaAcres: f.areaAcres,
      location: f.locationName,
      riskLevel: f.riskLevel,
      riskPercent: Math.round(f.riskProbability * 100),
      condition: f.currentConditionStatus,
      targetDate,
      daysRemaining,
      relativeDaysText: formatRelativeDays(daysRemaining),
      reason: f.latestAnalysis?.followup?.reason || 'Standard risk-based interval',
      isDue: daysRemaining <= 2,
      followUpCount: f.followUpCount || 0,
      nextFollowUpSequence: (f.followUpCount || 0) + 1,
    };
  });

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-heading">
              Field Follow-Up Checks & Comparisons
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-900">
              Multi-Check Tracker
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            Compare consecutive follow-up checks, inspect symptom recovery, and monitor upcoming recheck schedules.
          </p>
        </div>

        <button
          onClick={() => navigate(`/check-field?fieldId=${activeField.id}&mode=followup`)}
          className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2.5 rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>PERFORM FOLLOW-UP #{ (activeField.followUpCount || 0) + 1 }</span>
        </button>
      </div>

      {/* SECTION 1: INTERACTIVE MULTI-CHECKPOINT PROGRESSION & COMPARISON ENGINE */}
      <div className="bg-slate-50/80 border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-6 shadow-xs">
        {/* Field Selector & Mode Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-800" />
              <h2 className="text-base font-bold text-slate-900 uppercase font-heading tracking-wide">
                1. FIELD FOLLOW-UP PROGRESSION & COMPARISON
              </h2>
            </div>
            <p className="text-xs text-slate-500">
              Select any monitored field to inspect its full sequence of follow-ups and compare before/after states.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Field Dropdown */}
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-xs">
              <span className="text-xs font-semibold text-slate-500">Active Field:</span>
              <select
                value={activeField.id}
                onChange={(e) => {
                  setSelectedFieldId(e.target.value);
                  setSelectedIdxA(0);
                  setSelectedIdxB(1);
                }}
                className="text-xs font-bold text-slate-900 bg-transparent focus:outline-none cursor-pointer"
              >
                {fields.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name} ({f.followUpCount || 0} follow-up{(f.followUpCount || 0) === 1 ? '' : 's'})
                  </option>
                ))}
              </select>
            </div>

            {/* View Mode Tabs */}
            <div className="flex items-center bg-slate-200/80 p-1 rounded-lg border border-slate-300/60 text-xs">
              <button
                onClick={() => setComparisonTab('comparator')}
                className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                  comparisonTab === 'comparator'
                    ? 'bg-white text-emerald-950 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Compare Checkpoints
              </button>
              <button
                onClick={() => setComparisonTab('timeline')}
                className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                  comparisonTab === 'timeline'
                    ? 'bg-white text-emerald-950 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Full Progression History ({allCheckpoints.length})
              </button>
            </div>
          </div>
        </div>

        {/* Checkpoint Sequence Stepper Bar */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px] font-heading">
              CHECKPOINT MILESTONES ({activeField.name})
            </span>
            <span className="text-slate-500">
              Total Checkpoints: <strong>{allCheckpoints.length}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
            {allCheckpoints.map((chk, idx) => {
              const isSelectedA = selectedIdxA === idx;
              const isSelectedB = selectedIdxB === idx;
              const riskPct = Math.round(chk.riskProbability * 100);

              return (
                <div
                  key={chk.id || idx}
                  className={`p-3 rounded-xl border transition-all relative ${
                    isSelectedA || isSelectedB
                      ? 'bg-white border-emerald-600 ring-2 ring-emerald-500/30 shadow-xs'
                      : 'bg-white/80 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[11px] font-bold text-slate-900 truncate font-heading">
                      {chk.label}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">{chk.date}</span>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Risk</span>
                      <span
                        className={`font-bold font-heading ${
                          chk.riskLevel === 'HIGH'
                            ? 'text-rose-700'
                            : chk.riskLevel === 'MODERATE'
                            ? 'text-amber-700'
                            : 'text-emerald-700'
                        }`}
                      >
                        {riskPct}%
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 block">Pest</span>
                      <span className="font-bold text-slate-800 font-heading">{chk.pestCount} insects</span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">Treatment</span>
                      <span
                        className={`text-[10px] font-bold ${
                          chk.treatmentApplied === 'YES'
                            ? 'text-emerald-700'
                            : chk.treatmentApplied === 'PARTIAL'
                            ? 'text-amber-700'
                            : 'text-slate-500'
                        }`}
                      >
                        {chk.treatmentApplied === 'YES' ? 'Applied' : chk.treatmentApplied === 'PARTIAL' ? 'Partial' : 'None'}
                      </span>
                    </div>
                  </div>

                  {/* Selection Action Buttons */}
                  <div className="flex items-center gap-1.5 mt-2.5 pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setSelectedIdxA(idx)}
                      className={`flex-1 py-1 rounded text-[10.5px] font-bold transition-colors cursor-pointer ${
                        isSelectedA
                          ? 'bg-emerald-800 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {isSelectedA ? '✓ Set as A' : 'Set as A'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedIdxB(idx)}
                      className={`flex-1 py-1 rounded text-[10.5px] font-bold transition-colors cursor-pointer ${
                        isSelectedB
                          ? 'bg-blue-800 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {isSelectedB ? '✓ Set as B' : 'Set as B'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* COMPARATOR VIEW */}
        {comparisonTab === 'comparator' ? (
          <div className="space-y-4">
            {/* Quick selector control */}
            <div className="bg-white border border-slate-200 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold text-slate-500">Comparing:</span>
                <span className="px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-900 font-bold font-heading">
                  Checkpoint A: {checkpointA.label} ({checkpointA.date})
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                <span className="px-2.5 py-1 rounded-md bg-blue-100 text-blue-900 font-bold font-heading">
                  Checkpoint B: {checkpointB.label} ({checkpointB.date})
                </span>
              </div>

              <div className="text-slate-500 text-[11px]">
                Click any milestone card above to swap Checkpoint A or B
              </div>
            </div>

            {/* Comparison Visualizer Component */}
            <ComparisonView
              checkpointA={checkpointA}
              checkpointB={checkpointB}
            />
          </div>
        ) : (
          /* FULL PROGRESSION TIMELINE VIEW */
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-heading">
              Complete Scouting Timeline & Health Evolution ({activeField.name})
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-2.5 px-3">Milestone</th>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Symptom Observed</th>
                    <th className="py-2.5 px-3">Treatment</th>
                    <th className="py-2.5 px-3">7-Day Risk</th>
                    <th className="py-2.5 px-3">Pest Count</th>
                    <th className="py-2.5 px-3">Action Plan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {allCheckpoints.map((chk, idx) => (
                    <tr key={chk.id || idx} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-3 font-bold text-slate-900 font-heading">
                        {chk.label}
                      </td>
                      <td className="py-3 px-3 text-slate-600 font-medium">{chk.date}</td>
                      <td className="py-3 px-3 font-medium text-slate-800">{chk.conditionStatus}</td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            chk.treatmentApplied === 'YES'
                              ? 'bg-emerald-100 text-emerald-900'
                              : chk.treatmentApplied === 'PARTIAL'
                              ? 'bg-amber-100 text-amber-900'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {chk.treatmentApplied === 'YES' ? '✓ Applied' : chk.treatmentApplied === 'PARTIAL' ? '~ Partial' : 'None'}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-bold font-heading">
                        <span
                          className={
                            chk.riskLevel === 'HIGH'
                              ? 'text-rose-700'
                              : chk.riskLevel === 'MODERATE'
                              ? 'text-amber-700'
                              : 'text-emerald-700'
                          }
                        >
                          {Math.round(chk.riskProbability * 100)}%
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-800 font-heading font-medium">
                        {chk.pestCount} {chk.pestType}
                      </td>
                      <td className="py-3 px-3 text-[11px] text-slate-500 max-w-xs truncate">
                        {chk.advisory || 'Standard continuous scouting'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 2: SCHEDULED UPCOMING FOLLOW-UP CHECKS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-700" />
            <h2 className="text-base font-bold text-slate-900 uppercase font-heading tracking-wider">
              2. UPCOMING FIELD CHECKS ({schedules.length} MONITORED PLOTS)
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-medium">Automated dynamic intervals</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {schedules.map((sch) => (
            <div
              key={sch.fieldId}
              className={`bg-white border rounded-xl p-5 shadow-xs flex flex-col justify-between transition-colors ${
                sch.isDue ? 'border-amber-300 ring-1 ring-amber-200' : 'border-slate-200'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900 font-heading">{sch.fieldName}</h3>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        {sch.followUpCount === 0
                          ? 'Baseline (0 follow-ups)'
                          : `${sch.followUpCount} Follow-up${sch.followUpCount > 1 ? 's' : ''} Done`}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{sch.location}</span>
                    </div>
                  </div>

                  <StatusBadge type="risk" riskLevel={sch.riskLevel} size="sm" />
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`p-2 rounded-md ${
                        sch.isDue ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 font-heading">{sch.targetDate}</div>
                      <div className="text-slate-500 font-medium">{sch.relativeDaysText}</div>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded font-semibold text-[11px] ${
                      sch.isDue ? 'bg-amber-100 text-amber-900' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {sch.isDue ? 'RECHECK DUE' : 'ON TRACK'}
                  </span>
                </div>

                <div className="text-xs text-slate-600 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Current condition:</span>
                    <span className="font-medium text-slate-800">{sch.condition}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">7-Day Risk Level:</span>
                    <span className="font-bold text-slate-900 font-heading">{sch.riskPercent}%</span>
                  </div>
                  <div className="text-[11px] text-slate-500 pt-1 italic">
                    Reason: {sch.reason}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => {
                    setSelectedFieldId(sch.fieldId);
                    navigate('/dashboard');
                  }}
                  className="text-xs text-slate-600 hover:text-slate-900 font-medium cursor-pointer"
                >
                  View Field Details
                </button>

                <button
                  onClick={() => navigate(`/check-field?fieldId=${sch.fieldId}&mode=followup`)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  <span>Perform Follow-Up #{sch.nextFollowUpSequence}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 3: CUMULATIVE PAST CHECKS AUDIT LOG */}
      <div className="space-y-4 pt-4 border-t border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-blue-700" />
            <h2 className="text-base font-bold text-slate-900 uppercase font-heading tracking-wider">
              3. PAST CHECKS & TREATMENT AUDIT LOG ({filteredHistory.length} RECORDS)
            </h2>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">Filter Field:</span>
            <select
              value={tableFieldFilter}
              onChange={(e) => setTableFieldFilter(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-emerald-600 cursor-pointer"
            >
              <option value="ALL">All Monitored Fields</option>
              {fields.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {filteredHistory.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
              <History className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">No Follow-Up Records Yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Follow-up checks completed on fields will automatically log here with before/after comparisons and treatment verification metrics.
            </p>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">Field Name</th>
                    <th className="py-3 px-4">Check Number</th>
                    <th className="py-3 px-4">Date Checked</th>
                    <th className="py-3 px-4">Treatment Applied</th>
                    <th className="py-3 px-4">7-Day Risk & Change</th>
                    <th className="py-3 px-4">Insects Count</th>
                    <th className="py-3 px-4">Crop Health Status</th>
                    <th className="py-3 px-4">Recommended Action</th>
                    <th className="py-3 px-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredHistory.map((item, idx) => {
                    const rec = item.record;
                    const riskPercent = Math.round(rec.riskProbability * 100);
                    const riskDeltaPercent = rec.riskDelta ? Math.round(rec.riskDelta * 100) : 0;

                    return (
                      <tr key={rec.id || idx} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-slate-900 font-heading">
                          {item.fieldName}
                          <div className="text-[11px] text-slate-400 font-normal">{item.crop}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-900 font-semibold text-[11px]">
                            Follow-Up #{rec.followUpNumber}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-medium text-slate-700">{rec.displayDate}</td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                              rec.treatmentApplied === 'YES'
                                ? 'bg-emerald-100 text-emerald-900'
                                : rec.treatmentApplied === 'PARTIAL'
                                ? 'bg-amber-100 text-amber-900'
                                : 'bg-rose-100 text-rose-900'
                            }`}
                          >
                            {rec.treatmentApplied === 'YES'
                              ? '✓ Applied'
                              : rec.treatmentApplied === 'PARTIAL'
                              ? '~ Partial'
                              : '✗ Untreated'}
                          </span>
                          {rec.treatmentNotes && (
                            <div className="text-[10px] text-slate-500 mt-0.5 max-w-40 truncate">
                              {rec.treatmentNotes}
                            </div>
                          )}
                        </td>
                        <td className="py-3.5 px-4 font-heading font-bold">
                          <span
                            className={
                              rec.riskLevel === 'HIGH'
                                ? 'text-rose-700'
                                : rec.riskLevel === 'MODERATE'
                                ? 'text-amber-700'
                                : 'text-emerald-700'
                            }
                          >
                            {riskPercent}%
                          </span>
                          {riskDeltaPercent !== 0 && (
                            <span
                              className={`text-[10px] ml-1.5 font-semibold ${
                                riskDeltaPercent < 0 ? 'text-emerald-700' : 'text-rose-700'
                              }`}
                            >
                              ({riskDeltaPercent < 0 ? `${riskDeltaPercent}%` : `+${riskDeltaPercent}%`})
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 font-medium text-slate-800">
                          <span className="font-heading font-bold">{rec.currentPestCount}</span> {rec.pestType}
                          {rec.pestDelta !== undefined && rec.pestDelta !== 0 && (
                            <span
                              className={`text-[10px] ml-1 font-semibold ${
                                rec.pestDelta < 0 ? 'text-emerald-700' : 'text-rose-700'
                              }`}
                            >
                              ({rec.pestDelta < 0 ? `${rec.pestDelta}` : `+${rec.pestDelta}`})
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`font-semibold text-xs ${
                              rec.statusVerdict.includes('Fine') || rec.statusVerdict.includes('Improving')
                                ? 'text-emerald-800'
                                : rec.statusVerdict.includes('Critical') || rec.statusVerdict.includes('High')
                                ? 'text-rose-800'
                                : 'text-slate-800'
                            }`}
                          >
                            {rec.statusVerdict}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-[11px] text-slate-600 max-w-48 truncate">
                          {rec.agronomicAdvisory}
                        </td>
                        <td className="py-3.5 px-4">
                          <button
                            onClick={() => {
                              setSelectedFieldId(item.fieldId);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="px-2.5 py-1 rounded bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-900 font-semibold text-[11px] transition-colors cursor-pointer"
                          >
                            Inspect
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

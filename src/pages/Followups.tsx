import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFieldStore } from '../stores/fieldStore';
import { StatusBadge } from '../components/common/StatusBadge';
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
  Filter
} from 'lucide-react';
import { FollowUpRecord } from '../types/field';
import { computeTargetDate, formatRelativeDays, formatCalendarDate } from '../utils/dateUtils';

export const Followups: React.FC = () => {
  const navigate = useNavigate();
  const { fields, setSelectedFieldId } = useFieldStore();
  const [selectedFieldFilter, setSelectedFieldFilter] = useState<string>('ALL');

  // Collect all historical follow-up records across all fields
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

  // Filter history records
  const filteredHistory = allHistoryRecords.filter(
    (item) => selectedFieldFilter === 'ALL' || item.fieldId === selectedFieldFilter
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Field Follow-Up Checks
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Scheduled field check dates and complete history of past treatments
          </p>
        </div>

        <button
          onClick={() => navigate('/check-field?mode=followup')}
          className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>START NEW FOLLOW-UP</span>
        </button>
      </div>

      {/* SECTION 1: ACTIVE & SCHEDULED FOLLOW-UP RECHECKS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-700" />
            <h2 className="text-base font-bold text-slate-900 uppercase font-heading tracking-wider">
              1. UPCOMING FIELD CHECKS
            </h2>
          </div>
          <span className="text-xs text-slate-500">{fields.length} Monitored Fields</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {schedules.map((sch) => (
            <div
              key={sch.fieldId}
              className={`bg-white border rounded-xl p-5 shadow-xs flex flex-col justify-between transition-colors ${sch.isDue ? 'border-amber-300 ring-1 ring-amber-200' : 'border-slate-200'
                }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900">{sch.fieldName}</h3>
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
                      className={`p-2 rounded-md ${sch.isDue ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
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
                    className={`px-2 py-0.5 rounded font-semibold text-[11px] ${sch.isDue ? 'bg-amber-100 text-amber-900' : 'bg-slate-200 text-slate-700'
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

      {/* SECTION 2: CUMULATIVE FOLLOW-UP HISTORY & AUDIT LOG */}
      <div className="space-y-4 pt-4 border-t border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-blue-700" />
            <h2 className="text-base font-bold text-slate-900 uppercase font-heading tracking-wider">
              2. PAST CHECKS & TREATMENT HISTORY ({filteredHistory.length} RECORDS)
            </h2>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">Filter Field:</span>
            <select
              value={selectedFieldFilter}
              onChange={(e) => setSelectedFieldFilter(e.target.value)}
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
            <h3 className="text-sm font-bold text-slate-800">No Follow-Up Records Yet for this Selection</h3>
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
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredHistory.map((item, idx) => {
                    const rec = item.record;
                    const riskPercent = Math.round(rec.riskProbability * 100);
                    const riskDeltaPercent = rec.riskDelta ? Math.round(rec.riskDelta * 100) : 0;

                    return (
                      <tr key={rec.id || idx} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-slate-900">
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
                            className={`px-2 py-0.5 rounded text-[11px] font-bold ${rec.treatmentApplied === 'YES'
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
                              className={`text-[10px] ml-1.5 font-semibold ${riskDeltaPercent < 0 ? 'text-emerald-700' : 'text-rose-700'
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
                              className={`text-[10px] ml-1 font-semibold ${rec.pestDelta < 0 ? 'text-emerald-700' : 'text-rose-700'
                                }`}
                            >
                              ({rec.pestDelta < 0 ? `${rec.pestDelta}` : `+${rec.pestDelta}`})
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`font-semibold text-xs ${rec.statusVerdict.includes('Fine') || rec.statusVerdict.includes('Improving')
                                ? 'text-emerald-800'
                                : rec.statusVerdict.includes('Critical')
                                  ? 'text-rose-800'
                                  : 'text-slate-800'
                              }`}
                          >
                            {rec.statusVerdict}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-[11px] text-slate-600 max-w-56 truncate">
                          {rec.agronomicAdvisory}
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

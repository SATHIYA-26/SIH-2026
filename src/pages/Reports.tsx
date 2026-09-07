import React from 'react';
import { useFieldStore } from '../stores/fieldStore';
import { useUserStore } from '../stores/userStore';
import { FileText, Printer, Download, Share2, Sprout, CheckCircle2, AlertTriangle, Calendar, MapPin, User, ShieldCheck } from 'lucide-react';
import { formatCalendarDate, getAppCurrentDate } from '../utils/dateUtils';

export const Reports: React.FC = () => {
  const { getSelectedField, fields, setSelectedFieldId } = useFieldStore();
  const { profile } = useUserStore();
  const field = getSelectedField();
  const analysis = field.latestAnalysis;

  const handlePrint = () => {
    window.print();
  };

  const riskPercent = Math.round(analysis.risk.probability * 100);
  const reportId = `RPT-2026-${field.id.replace('field-', '').toUpperCase()}-${Date.now().toString().slice(-4)}`;
  const formattedToday = formatCalendarDate(getAppCurrentDate(), 'display');

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 no-print">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Field Health & Advisory Report
            </h1>
            <span className="text-xs font-bold bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-full">
              {field.name}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Official agronomic summary and precision early-warning dossier for {field.name} ({field.locationName})
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick parcel switcher in report page */}
          <select
            value={field.id}
            onChange={(e) => setSelectedFieldId(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-2.5 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-600 cursor-pointer"
          >
            {fields.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print Report</span>
          </button>

          <button
            type="button"
            onClick={() => {
              window.print();
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Report Document Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-8 sm:p-10 shadow-xs space-y-8 print:p-0 print:border-none print:shadow-none">
        {/* Document Header */}
        <div className="flex items-start justify-between pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-800 flex items-center justify-center text-white font-bold text-xs">
                AP
              </div>
              <span className="text-lg font-bold tracking-tight text-slate-900">APOCALYPSE AI</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Precision Crop Disease, Pest & Outbreak Risk Management Dossier
            </p>
            <div className="text-xs text-slate-600 mt-1 flex items-center gap-2">
              <span><strong>Agronomist:</strong> {profile.name} ({profile.location})</span>
              <span className="text-slate-300">·</span>
              <span><strong>ID:</strong> {profile.officerId}</span>
            </div>
          </div>

          <div className="text-right text-xs text-slate-600 space-y-0.5">
            <div><strong>Report Date:</strong> {formattedToday}</div>
            <div><strong>Evaluation Period:</strong> Last 30 Days</div>
            <div><strong>Dossier ID:</strong> {reportId}</div>
            <div><strong>Follow-up Status:</strong> {field.followUpCount || 0} checks completed</div>
          </div>
        </div>

        {/* Section 1: Parcel & Crop Info */}
        <div>
          <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider font-heading mb-3">
            1. PARCEL & CROP IDENTIFICATION
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs">
            <div>
              <span className="text-slate-400 block">Field Parcel:</span>
              <strong className="text-slate-900">{field.name}</strong>
              <div className="text-[10px] text-slate-500">{field.locationName}</div>
            </div>
            <div>
              <span className="text-slate-400 block">Crop & Variety:</span>
              <strong className="text-slate-900">{field.crop}</strong>
              <div className="text-[10px] text-slate-500">{field.variety}</div>
            </div>
            <div>
              <span className="text-slate-400 block">Total Area:</span>
              <strong className="text-slate-900 font-heading">{field.areaAcres} acres</strong>
              <div className="text-[10px] text-slate-500">{field.inspectionPoints?.length || 3} scouting points</div>
            </div>
            <div>
              <span className="text-slate-400 block">Crop Age & Stage:</span>
              <strong className="text-slate-900 font-heading">Day {field.daysSincePlanting}</strong>
              <div className="text-[10px] text-slate-500">{field.estimatedGrowthStage}</div>
            </div>
          </div>
        </div>

        {/* Section 2: Health & Risk Evaluation */}
        <div>
          <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider font-heading mb-3">
            2. HEALTH STATUS & 7-DAY OUTBREAK RISK FORECAST
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg border border-slate-200 space-y-1.5 text-xs bg-white">
              <span className="text-slate-500 font-medium">Visual Leaf Diagnosis:</span>
              <div className="text-base font-bold text-slate-900">{analysis.condition.status}</div>
              <div className="text-slate-600">
                AI Confidence Rating: <strong className="font-heading">{(analysis.condition.confidence * 100).toFixed(1)}%</strong>
              </div>
              <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                Top Identified Class: <strong className="capitalize">{analysis.condition.topClass}</strong>
              </div>
            </div>

            <div
              className={`p-4 rounded-lg border space-y-1.5 text-xs ${field.riskLevel === 'HIGH'
                  ? 'bg-rose-50/50 border-rose-200'
                  : field.riskLevel === 'MODERATE'
                    ? 'bg-amber-50/50 border-amber-200'
                    : 'bg-emerald-50/50 border-emerald-200'
                }`}
            >
              <span className="text-slate-600 font-medium">7-Day Outbreak Risk Forecast:</span>
              <div
                className={`text-xl font-extrabold font-heading ${field.riskLevel === 'HIGH'
                    ? 'text-rose-700'
                    : field.riskLevel === 'MODERATE'
                      ? 'text-amber-700'
                      : 'text-emerald-700'
                  }`}
              >
                {riskPercent}% ({field.riskLevel} RISK)
              </div>
              <div className="text-slate-700 leading-snug">{analysis.risk.summary}</div>
            </div>
          </div>
        </div>

        {/* Section 3: Weather & Pest Dynamics */}
        <div>
          <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider font-heading mb-3">
            3. MICROCLIMATE & PEST DYNAMICS
          </h3>
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-2">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <span className="text-slate-500">Canopy Temperature:</span>{' '}
                <strong className="text-slate-900 font-heading">{analysis.weather.temperature}°C</strong>
              </div>
              <div>
                <span className="text-slate-500">Relative Humidity:</span>{' '}
                <strong className="text-slate-900 font-heading">{analysis.weather.humidity}% RH</strong>
              </div>
              <div>
                <span className="text-slate-500">Recent Rain (48h):</span>{' '}
                <strong className="text-slate-900 font-heading">{analysis.weather.recentRainfall} mm</strong>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-200 text-slate-700">
              <strong>Pest Scouting Note:</strong> {analysis.pest.currentCount} {analysis.pest.pestType} recorded per 20 leaves ({field.pestPressureSummary}).
            </div>
          </div>
        </div>

        {/* Section 4: Key Risk Drivers */}
        {analysis.risk.drivers && analysis.risk.drivers.length > 0 && (
          <div>
            <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider font-heading mb-3">
              4. RISK CONTRIBUTORS & EXPLANATION
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {analysis.risk.drivers.map((drv) => (
                <div key={drv.id} className="p-3 rounded-lg border border-slate-200 bg-white space-y-1">
                  <div className="flex items-center justify-between">
                    <strong className="text-slate-900">{drv.title}</strong>
                    <span className="text-xs font-bold text-slate-700 font-heading">{drv.value}</span>
                  </div>
                  <p className="text-[11px] text-slate-600">{drv.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 5: Recommended Agronomic Actions */}
        <div>
          <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider font-heading mb-3">
            5. RECOMMENDED ACTION PLAN
          </h3>
          <div className="space-y-2 text-xs">
            {analysis.actions.map((act) => (
              <div key={act.id} className="p-3 rounded-lg border border-slate-200 bg-white flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                  {act.stepNumber}
                </div>
                <div>
                  <div className="font-bold text-slate-900">{act.action}</div>
                  <div className="text-slate-600 mt-0.5">{act.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 6: Follow-up Requirement */}
        <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-xs flex items-center justify-between">
          <div>
            <div className="font-bold text-emerald-950">Recommended Recheck Schedule:</div>
            <div className="text-emerald-800 mt-0.5">
              Target Date: <strong>{analysis.followup.targetDate}</strong> ({analysis.followup.daysRemaining} days remaining) · Reason: {analysis.followup.reason}
            </div>
          </div>
          <span className="text-xs font-bold text-emerald-900 bg-white border border-emerald-300 px-3 py-1.5 rounded shadow-2xs">
            Next Field Check
          </span>
        </div>
      </div>
    </div>
  );
};

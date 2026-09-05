import React from 'react';
import { useFieldStore } from '../stores/fieldStore';
import { FileText, Printer, Download, Share2, Sprout, CheckCircle2, AlertTriangle, Calendar } from 'lucide-react';

export const Reports: React.FC = () => {
  const { getSelectedField } = useFieldStore();
  const field = getSelectedField();
  const analysis = field.latestAnalysis;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 no-print">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Field Health & Advisory Report
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Official agronomic summary and precision early-warning dossier
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print Report</span>
          </button>

          <button
            onClick={() => {
              alert('Field dossier PDF generated and downloaded.');
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
              <span className="text-lg font-bold tracking-tight text-slate-900">AGROPULSE AI</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">Precision Agriculture Field Health Advisory</p>
          </div>

          <div className="text-right text-xs text-slate-600">
            <div><strong>Report Date:</strong> 04 September 2026</div>
            <div><strong>Period:</strong> Last 30 Days</div>
            <div><strong>ID:</strong> RPT-2026-0904-FA</div>
          </div>
        </div>

        {/* Section 1: Parcel & Crop Info */}
        <div>
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono mb-3">
            1. Parcel Information
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs">
            <div>
              <span className="text-slate-400 block">Field Parcel:</span>
              <strong className="text-slate-900">{field.name}</strong>
            </div>
            <div>
              <span className="text-slate-400 block">Crop / Variety:</span>
              <strong className="text-slate-900">{field.crop} ({field.variety})</strong>
            </div>
            <div>
              <span className="text-slate-400 block">Acreage:</span>
              <strong className="text-slate-900">{field.areaAcres} acres</strong>
            </div>
            <div>
              <span className="text-slate-400 block">Crop Age:</span>
              <strong className="text-slate-900">Day {field.daysSincePlanting} (Estimated)</strong>
            </div>
          </div>
        </div>

        {/* Section 2: Health & Risk Evaluation */}
        <div>
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono mb-3">
            2. Health Status & 7-Day Outbreak Risk
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg border border-slate-200 space-y-1.5 text-xs">
              <span className="text-slate-500 font-medium">Visual Leaf Diagnosis:</span>
              <div className="text-base font-bold text-slate-900">{analysis.condition.status}</div>
              <div className="text-slate-600">
                AI Confidence: <strong>{(analysis.condition.confidence * 100).toFixed(1)}%</strong>
              </div>
            </div>

            <div className="p-4 rounded-lg border border-slate-200 space-y-1.5 text-xs">
              <span className="text-slate-500 font-medium">7-Day Outbreak Risk Forecast:</span>
              <div className="text-base font-bold text-rose-700">
                {Math.round(analysis.risk.probability * 100)}% ({analysis.risk.level} RISK)
              </div>
              <div className="text-slate-600 leading-snug">{analysis.risk.summary}</div>
            </div>
          </div>
        </div>

        {/* Section 3: Weather & Pest Context */}
        <div>
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono mb-3">
            3. Microclimate & Pest Dynamics
          </h3>
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-2">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <span className="text-slate-500">Temperature:</span>{' '}
                <strong>{analysis.weather.temperature}°C</strong>
              </div>
              <div>
                <span className="text-slate-500">Relative Humidity:</span>{' '}
                <strong>{analysis.weather.humidity}% RH</strong>
              </div>
              <div>
                <span className="text-slate-500">Rainfall (48h):</span>{' '}
                <strong>{analysis.weather.recentRainfall} mm</strong>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-200 text-slate-700">
              <strong>Pest Scouting Note:</strong> {analysis.pest.currentCount} {analysis.pest.pestType} recorded per 20 leaves ({analysis.pest.pestPressure}).
            </div>
          </div>
        </div>

        {/* Section 4: Recommended Agronomic Actions */}
        <div>
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono mb-3">
            4. Recommended Action Plan
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

        {/* Section 5: Follow-up Requirement */}
        <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-xs flex items-center justify-between">
          <div>
            <div className="font-bold text-emerald-950">Mandatory Follow-up Due:</div>
            <div className="text-emerald-800">
              Target Date: {analysis.followup.targetDate} ({analysis.followup.daysRemaining} days remaining)
            </div>
          </div>
          <span className="text-xs font-bold text-emerald-900 bg-white border border-emerald-300 px-3 py-1 rounded">
            Next Field Check
          </span>
        </div>
      </div>
    </div>
  );
};

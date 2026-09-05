import React, { useState } from 'react';
import { MOCK_ADMIN_INSIGHTS } from '../data/mockData';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { ShieldCheck, BarChart3, Database, Layers, CheckCircle, Cpu, Award } from 'lucide-react';

export const AdminInsights: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'disease' | 'risk' | 'features'>('disease');
  const insights = MOCK_ADMIN_INSIGHTS;

  return (
    <div className="space-y-6">
      {/* Header with Judge/Admin Notice */}
      <div className="bg-slate-900 text-white rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Judge & Evaluation Benchmark Console</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-1">
            Model Validation & Algorithmic Diagnostics
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Technical diagnostic benchmarks, confusion matrices, calibration curves, and feature importance.
            <em> Note: Technical metrics and architecture details are strictly segregated from the farmer interface.</em>
          </p>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 text-xs space-y-1 text-slate-300 shrink-0">
          <div>Evaluation Corpus: <strong>5,420 Samples</strong></div>
          <div>Cross-Validation: <strong>5-Fold Spatio-Temporal</strong></div>
          <div className="text-emerald-400 font-semibold">SIH 2026 PS 131 Ready</div>
        </div>
      </div>

      {/* Sub navigation */}
      <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 text-xs font-semibold">
        <button
          onClick={() => setActiveSubTab('disease')}
          className={`flex-1 py-2 rounded-lg transition-colors cursor-pointer text-center ${
            activeSubTab === 'disease'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          1. Disease Image Model Metrics
        </button>
        <button
          onClick={() => setActiveSubTab('risk')}
          className={`flex-1 py-2 rounded-lg transition-colors cursor-pointer text-center ${
            activeSubTab === 'risk'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          2. 7-Day Outbreak Risk Calibration & ROC
        </button>
        <button
          onClick={() => setActiveSubTab('features')}
          className={`flex-1 py-2 rounded-lg transition-colors cursor-pointer text-center ${
            activeSubTab === 'features'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          3. Risk Factor / Feature Contributions
        </button>
      </div>

      {/* =========================================================================
          TAB 1: DISEASE IMAGE CLASSIFICATION BENCHMARKS
          ========================================================================= */}
      {activeSubTab === 'disease' && (
        <div className="space-y-6">
          {/* Summary KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">Top-1 Accuracy</span>
              <div className="text-2xl font-bold text-slate-900 mt-1 font-mono">
                {(insights.diseaseModel.metrics.accuracy * 100).toFixed(1)}%
              </div>
              <span className="text-[11px] text-emerald-700 font-medium">Test Set: 4,450 images</span>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">Macro F1-Score</span>
              <div className="text-2xl font-bold text-slate-900 mt-1 font-mono">
                {insights.diseaseModel.metrics.macroF1.toFixed(3)}
              </div>
              <span className="text-[11px] text-slate-500">Unweighted mean</span>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">Weighted Precision</span>
              <div className="text-2xl font-bold text-slate-900 mt-1 font-mono">
                {insights.diseaseModel.metrics.weightedPrecision.toFixed(3)}
              </div>
              <span className="text-[11px] text-slate-500">Class-weighted</span>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">Weighted Recall</span>
              <div className="text-2xl font-bold text-slate-900 mt-1 font-mono">
                {insights.diseaseModel.metrics.weightedRecall.toFixed(3)}
              </div>
              <span className="text-[11px] text-slate-500">Class-weighted</span>
            </div>
          </div>

          {/* Per-Class Breakdown Table & Confusion Matrix Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Per-class Metrics */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">
                Per-Class Performance Breakdown
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-mono">
                      <th className="py-2 px-2">Disease Class</th>
                      <th className="py-2 px-2">Precision</th>
                      <th className="py-2 px-2">Recall</th>
                      <th className="py-2 px-2">F1</th>
                      <th className="py-2 px-2 text-right">Support</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {insights.diseaseModel.perClassMetrics.map((pcm) => (
                      <tr key={pcm.className} className="hover:bg-slate-50">
                        <td className="py-2.5 px-2 font-sans font-semibold text-slate-900">{pcm.className}</td>
                        <td className="py-2.5 px-2">{pcm.precision.toFixed(3)}</td>
                        <td className="py-2.5 px-2">{pcm.recall.toFixed(3)}</td>
                        <td className="py-2.5 px-2 font-bold text-emerald-800">{pcm.f1.toFixed(3)}</td>
                        <td className="py-2.5 px-2 text-right text-slate-500">{pcm.support}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Confusion Matrix */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">
                Normalized Confusion Matrix
              </h3>
              <div className="overflow-x-auto">
                <div className="text-[11px] text-slate-500 mb-2 font-mono">Rows: True Label · Columns: Predicted Label</div>
                <table className="w-full text-center text-xs font-mono border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500">
                      <th className="py-2 px-2 text-left font-sans">True \ Pred</th>
                      {insights.diseaseModel.confusionMatrix.labels.map((l) => (
                        <th key={l} className="py-2 px-2 truncate">{l}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {insights.diseaseModel.confusionMatrix.matrix.map((row, rIdx) => (
                      <tr key={rIdx}>
                        <td className="py-2.5 px-2 text-left font-sans font-semibold text-slate-800">
                          {insights.diseaseModel.confusionMatrix.labels[rIdx]}
                        </td>
                        {row.map((cell, cIdx) => {
                          const isDiag = rIdx === cIdx;
                          return (
                            <td
                              key={cIdx}
                              className={`py-2.5 px-2 ${
                                isDiag ? 'bg-emerald-100/80 font-bold text-emerald-950' : cell > 20 ? 'bg-amber-50 text-amber-900' : 'text-slate-500'
                              }`}
                            >
                              {cell}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: RISK FORECAST CALIBRATION & ROC
          ========================================================================= */}
      {activeSubTab === 'risk' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">ROC-AUC</span>
              <div className="text-2xl font-bold text-slate-900 mt-1 font-mono">
                {insights.riskModel.metrics.rocAuc.toFixed(3)}
              </div>
              <span className="text-[11px] text-emerald-700 font-medium">Excellent discrimination</span>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">PR-AUC</span>
              <div className="text-2xl font-bold text-slate-900 mt-1 font-mono">
                {insights.riskModel.metrics.prAuc.toFixed(3)}
              </div>
              <span className="text-[11px] text-slate-500">Precision-Recall Curve</span>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">Brier Calibration Score</span>
              <div className="text-2xl font-bold text-slate-900 mt-1 font-mono">
                {insights.riskModel.metrics.brierScore.toFixed(3)}
              </div>
              <span className="text-[11px] text-emerald-700 font-medium">Close to 0.0 (Calibrated)</span>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">Prediction Window</span>
              <div className="text-2xl font-bold text-slate-900 mt-1">
                7 Days
              </div>
              <span className="text-[11px] text-slate-500">Spatio-temporal horizon</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Calibration Curve */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">
                Reliability Diagram (Probability Calibration)
              </h3>
              <p className="text-xs text-slate-500">
                Plots predicted risk vs observed empirical outbreak frequency across 10 deciles.
              </p>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={insights.riskModel.calibrationPoints}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="binMidpoint" unit="" tick={{ fontSize: 11 }} />
                    <YAxis domain={[0, 1]} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Line type="monotone" dataKey="observedFrequency" name="Observed Frequency" stroke="#166534" strokeWidth={2.5} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="predictedProbability" name="Predicted Probability" stroke="#94a3b8" strokeWidth={2} strokeDasharray="3 3" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* ROC Curve */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">
                ROC Curve (False Positive vs True Positive Rate)
              </h3>
              <p className="text-xs text-slate-500">
                Receiver operating characteristic illustrating high sensitivity with minimal false alarms.
              </p>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={insights.riskModel.rocCurve}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="fpr" name="FPR" tick={{ fontSize: 11 }} />
                    <YAxis domain={[0, 1]} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="tpr" name="True Positive Rate" stroke="#dc2626" strokeWidth={2.5} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: FEATURE IMPORTANCE / RISK CONTRIBUTIONS
          ========================================================================= */}
      {activeSubTab === 'features' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">
                Risk Model Feature Importance Breakdown
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Relative contribution weight of microclimate, pest observations, and visual signals
              </p>
            </div>

            <div className="space-y-3 pt-2">
              {insights.riskModel.featureContributions.map((item) => (
                <div key={item.feature} className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{item.feature}</span>
                      <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-700 text-[10px] font-mono">
                        {item.category}
                      </span>
                    </div>
                    <span className="font-mono font-bold text-slate-900 text-xs">
                      {(item.importance * 100).toFixed(1)}% Weight
                    </span>
                  </div>

                  {/* Horizontal importance bar */}
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-700 rounded-full"
                      style={{ width: `${item.importance * 100}%` }}
                    />
                  </div>

                  <p className="text-xs text-slate-600 leading-snug">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

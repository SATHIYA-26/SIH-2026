import React, { useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAnalysisStore } from '../stores/analysisStore';
import { useFieldStore } from '../stores/fieldStore';
import { Field } from '../types/field';
import {
  Camera,
  UploadCloud,
  RefreshCw,
  Trash2,
  Bug,
  Calendar,
  CloudSun,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Image as ImageIcon,
  Sparkles,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { DiagnosisPanel } from '../components/diagnosis/DiagnosisPanel';
import { PrimaryStatusArea } from '../components/dashboard/PrimaryStatusArea';
import { RiskDriversPanel } from '../components/dashboard/RiskDriversPanel';
import { RecommendedActionsPanel } from '../components/dashboard/RecommendedActionsPanel';
import { NextCheckPanel } from '../components/dashboard/NextCheckPanel';
import { ComparisonView } from '../components/followup/ComparisonView';

export const CheckField: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const urlFieldId = searchParams.get('fieldId');

  const { fields, getSelectedField, setSelectedFieldId } = useFieldStore();
  const {
    currentStep,
    setStep,
    formState,
    updateForm,
    resetForm,
    startAnalysis,
    isAnalyzing,
    analyzingProgressIndex,
    latestResult,
    previousResult,
    isLowConfidenceResult,
    setLowConfidence,
  } = useAnalysisStore();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const selectedField = fields.find((f: Field) => f.id === (urlFieldId || formState.fieldId)) || getSelectedField();

  // Progress step titles for stepped analysis screen
  const analysisSteps = [
    'Checking leaf image resolution and quality...',
    'Analyzing visual crop disease symptoms...',
    'Retrieving local microclimate & weather trends...',
    'Evaluating pest population & pressure metrics...',
    'Estimating 7-day outbreak risk forecast...',
  ];

  // Handle image upload from file or camera
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      updateForm({ imageFile: file, imagePreviewUrl: url });
    }
  };

  // Calculate days since planting dynamically
  const calculateDaysSincePlanting = (dateStr: string) => {
    const planted = new Date(dateStr);
    const now = new Date('2026-09-04'); // current system local date
    const diffTime = Math.abs(now.getTime() - planted.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 73;
  };

  const daysSincePlanting = calculateDaysSincePlanting(formState.plantingDate);

  // Derived pest pressure
  const getPestPressure = () => {
    if (!formState.previousPestCount) return 'Initial Assessment';
    if (formState.currentPestCount > formState.previousPestCount) return 'Increasing (↑)';
    if (formState.currentPestCount < formState.previousPestCount) return 'Decreasing (↓)';
    return 'Stable (—)';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Title & Breadcrumb */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Check Field Observation
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Step-by-step crop condition diagnosis and 7-day risk forecasting
          </p>
        </div>

        {currentStep < 4 && (
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
            <span>Step {currentStep} of 3</span>
          </div>
        )}
      </div>

      {/* Stepper Progress Header (Steps 1 to 3) */}
      {currentStep <= 3 && (
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          {[
            { step: 1, title: 'Leaf Photo', desc: 'Leaf image' },
            { step: 2, title: 'Pest Observation', desc: 'Count & species' },
            { step: 3, title: 'Field Details', desc: 'Crop & weather' },
          ].map((s) => (
            <div
              key={s.step}
              onClick={() => {
                if (currentStep > s.step) setStep(s.step);
              }}
              className={`p-3 rounded-lg border text-left transition-all ${
                currentStep === s.step
                  ? 'bg-emerald-50/80 border-emerald-500 ring-1 ring-emerald-500'
                  : currentStep > s.step
                  ? 'bg-white border-slate-200 cursor-pointer hover:bg-slate-50'
                  : 'bg-slate-50 border-slate-200 opacity-60'
              }`}
            >
              <div className="flex items-center gap-2">
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
                    currentStep === s.step
                      ? 'bg-emerald-700 text-white'
                      : currentStep > s.step
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {currentStep > s.step ? '✓' : s.step}
                </div>
                <span className="text-xs font-bold text-slate-900 truncate">{s.title}</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1 hidden sm:block">{s.desc}</div>
            </div>
          ))}
        </div>
      )}

      {/* STEP 1: LEAF PHOTO */}
      {currentStep === 1 && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Step 1: Crop / Leaf Photo</h2>
            <p className="text-xs text-slate-600 mt-1">
              Take a clear photo of an affected leaf in good natural lighting. Avoid heavy shadows or extreme blur.
            </p>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          {formState.imagePreviewUrl ? (
            <div className="space-y-4">
              <div className="w-full h-64 sm:h-80 rounded-xl overflow-hidden bg-slate-900 border border-slate-200 relative group">
                <img
                  src={formState.imagePreviewUrl}
                  alt="Captured leaf preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-slate-900/80 text-white text-xs px-2.5 py-1 rounded backdrop-blur-xs font-mono">
                  READY FOR DIAGNOSIS
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-xs text-slate-500">
                  Image ready for AI disease analysis.
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Retake Photo</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => updateForm({ imageFile: null, imagePreviewUrl: null })}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-200 text-xs font-semibold text-rose-700 hover:bg-rose-50 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 sm:p-12 text-center space-y-4 bg-slate-50/50 hover:bg-slate-50 transition-colors">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-xs">
                <Camera className="w-7 h-7" />
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900">Upload or Capture Leaf Photo</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Hold camera 15–20 cm above the affected leaf surface in natural light.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2.5 rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  <Camera className="w-4 h-4" />
                  <span>Take / Select Photo</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    updateForm({
                      imagePreviewUrl:
                        'https://images.unsplash.com/photo-1599427303058-f04cbcf4756f?auto=format&fit=crop&w=800&q=80',
                    });
                  }}
                  className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                >
                  <ImageIcon className="w-4 h-4 text-slate-500" />
                  <span>Use Sample Cotton Leaf</span>
                </button>
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs bg-slate-50/70 p-3 rounded-lg">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="low-conf-toggle"
                checked={formState.simulateLowConfidence}
                onChange={(e) => updateForm({ simulateLowConfidence: e.target.checked })}
                className="rounded border-slate-300 text-emerald-700 focus:ring-emerald-600 cursor-pointer"
              />
              <label htmlFor="low-conf-toggle" className="text-slate-700 font-medium cursor-pointer">
                Simulate low image quality / low AI confidence response
              </label>
            </div>
            <span className="text-[11px] text-slate-400">Demo Testing</span>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              disabled={!formState.imagePreviewUrl}
              onClick={() => setStep(2)}
              className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-lg text-xs font-semibold shadow-xs transition-all cursor-pointer"
            >
              <span>Continue to Pest Observation</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: PEST OBSERVATION */}
      {currentStep === 2 && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Step 2: Pest Observation</h2>
            <p className="text-xs text-slate-600 mt-1">
              Enter scouted insects or pest counts observed on plant stems and leaf undersides.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
                Pest Type
              </label>
              <select
                value={formState.pestType}
                onChange={(e) => updateForm({ pestType: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white cursor-pointer"
              >
                <option value="Cotton Aphid">Cotton Aphid (Aphis gossypii)</option>
                <option value="Whitefly">Whitefly (Bemisia tabaci)</option>
                <option value="Thrips">Thrips (Thrips tabaci)</option>
                <option value="American Bollworm">American Bollworm (Helicoverpa armigera)</option>
                <option value="Jassid">Jassid / Leafhopper (Amrasca biguttula)</option>
                <option value="No Visible Pests">No Visible Pests Observed</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
                Current Pest Count (per 20 leaves)
              </label>
              <input
                type="number"
                min="0"
                value={formState.currentPestCount}
                onChange={(e) => updateForm({ currentPestCount: parseInt(e.target.value) || 0 })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
                Previous Pest Count (Optional Follow-up reference)
              </label>
              <input
                type="number"
                min="0"
                value={formState.previousPestCount || ''}
                onChange={(e) =>
                  updateForm({
                    previousPestCount: e.target.value ? parseInt(e.target.value) : undefined,
                  })
                }
                placeholder="e.g. 10"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
                Derived Pest Pressure
              </label>
              <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-800 flex items-center justify-between">
                <span>{getPestPressure()}</span>
                <Bug className="w-4 h-4 text-amber-600" />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              type="button"
              onClick={() => setStep(3)}
              className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2.5 rounded-lg text-xs font-semibold shadow-xs transition-all cursor-pointer"
            >
              <span>Continue to Field Details</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: FIELD & WEATHER */}
      {currentStep === 3 && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Step 3: Field & Weather Details</h2>
            <p className="text-xs text-slate-600 mt-1">
              Select field parcel and confirm planting date. Microclimate weather is automatically retrieved.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
                Select Field
              </label>
              <select
                value={formState.fieldId}
                onChange={(e) => {
                  updateForm({ fieldId: e.target.value });
                  setSelectedFieldId(e.target.value);
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white cursor-pointer"
              >
                {fields.map((f: Field) => (
                  <option key={f.id} value={f.id}>
                    {f.name} ({f.crop} · {f.areaAcres} acres)
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
                Planting Date
              </label>
              <input
                type="date"
                value={formState.plantingDate}
                onChange={(e) => updateForm({ plantingDate: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white"
              />
              <div className="text-[11px] text-slate-500 font-medium">
                Days since planting: <strong>{daysSincePlanting} days</strong> · Estimated: Flowering & Boll Development
              </div>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CloudSun className="w-4 h-4 text-sky-600" />
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
                  AUTOMATIC LOCAL WEATHER
                </span>
              </div>
              <span className="text-[10px] text-emerald-800 bg-emerald-100 font-semibold px-2 py-0.5 rounded">
                Live Sensor Feed
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-2 text-xs">
              <div className="bg-white p-2.5 rounded border border-slate-200">
                <div className="text-slate-500 text-[11px]">Temperature</div>
                <div className="text-base font-bold text-slate-900 mt-0.5">29°C</div>
              </div>
              <div className="bg-white p-2.5 rounded border border-slate-200">
                <div className="text-slate-500 text-[11px]">Relative Humidity</div>
                <div className="text-base font-bold text-slate-900 mt-0.5">86% RH</div>
              </div>
              <div className="bg-white p-2.5 rounded border border-slate-200">
                <div className="text-slate-500 text-[11px]">Recent Rainfall</div>
                <div className="text-base font-bold text-slate-900 mt-0.5">12 mm</div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              type="button"
              onClick={() => startAnalysis(() => {})}
              className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white px-6 py-3 rounded-lg text-xs font-bold uppercase tracking-wider shadow-md shadow-emerald-900/20 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>ANALYZE FIELD</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: ANALYZING SCREEN */}
      {currentStep === 4 && (
        <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-xs text-center space-y-6">
          <div className="max-w-md mx-auto space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto animate-pulse">
              <RefreshCw className="w-6 h-6 animate-spin text-emerald-700" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900 uppercase tracking-tight">
                ANALYZING FIELD
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Synthesizing leaf image diagnosis with pest records and microclimate weather
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left space-y-2.5 text-xs">
              {analysisSteps.map((stepDesc, idx) => {
                const isCompleted = idx < analyzingProgressIndex;
                const isCurrent = idx === analyzingProgressIndex;

                return (
                  <div key={idx} className="flex items-center gap-2.5 transition-colors">
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : isCurrent ? (
                      <div className="w-4 h-4 rounded-full border-2 border-emerald-600 border-t-transparent animate-spin shrink-0" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-slate-300 ml-1 shrink-0" />
                    )}
                    <span
                      className={`${
                        isCurrent
                          ? 'font-bold text-slate-900'
                          : isCompleted
                          ? 'text-slate-700 line-through'
                          : 'text-slate-400'
                      }`}
                    >
                      {stepDesc}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* STEP 5: LOW CONFIDENCE */}
      {currentStep === 5 && isLowConfidenceResult && (
        <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-xs text-center space-y-6 max-w-lg mx-auto">
          <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-7 h-7 text-amber-700" />
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">
              Unable to confidently identify the crop condition.
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              The leaf image quality or lighting is insufficient for a reliable diagnostic classification.
              Try taking a clearer, well-lit photo of an affected leaf without shadows.
            </p>
          </div>

          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={() => {
                setLowConfidence(false);
                setStep(1);
              }}
              className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2.5 rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>RETAKE PHOTO</span>
            </button>

            <button
              onClick={() => {
                setLowConfidence(false);
                updateForm({ simulateLowConfidence: false });
                startAnalysis(() => {});
              }}
              className="px-4 py-2.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              Simulate High-Quality Image
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: SUCCESSFUL RESULT */}
      {currentStep === 5 && !isLowConfidenceResult && latestResult && (
        <div className="space-y-6 animate-in fade-in-50">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-700" />
              <div>
                <h3 className="text-sm font-bold text-emerald-950">Field Analysis Complete</h3>
                <p className="text-xs text-emerald-800">
                  Observation logged for {selectedField.name} on {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate('/')}
              className="px-3 py-1.5 rounded-lg bg-white border border-emerald-300 text-xs font-semibold text-emerald-900 hover:bg-emerald-100 transition-colors cursor-pointer"
            >
              Return to Dashboard
            </button>
          </div>

          <PrimaryStatusArea
            condition={latestResult.condition}
            risk={latestResult.risk}
          />

          {previousResult && (
            <ComparisonView
              previous={previousResult}
              current={latestResult}
              status={latestResult.comparisonStatus || 'IMPROVING'}
            />
          )}

          <DiagnosisPanel condition={latestResult.condition} />

          <RiskDriversPanel risk={latestResult.risk} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RecommendedActionsPanel
              actions={latestResult.actions}
              fieldId={selectedField.id}
            />
            <NextCheckPanel
              followup={latestResult.followup}
              riskLevel={latestResult.risk.level}
              fieldId={selectedField.id}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200">
            <button
              onClick={resetForm}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Start Another Check</span>
            </button>

            <button
              onClick={() => navigate('/history')}
              className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2 rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <span>View Updated Field History</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

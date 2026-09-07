import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAnalysisStore, CheckMode, TreatmentStatus } from '../stores/analysisStore';
import { useFieldStore } from '../stores/fieldStore';
import { Field, FollowUpRecord } from '../types/field';
import { FullFieldAnalysis } from '../types/analysis';
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
  GitCompare,
  Sprout,
  Check,
  X,
  PlusCircle,
  Clock,
  History as HistoryIcon,
  ScanLine
} from 'lucide-react';
import { DiagnosisPanel } from '../components/diagnosis/DiagnosisPanel';
import { PrimaryStatusArea } from '../components/dashboard/PrimaryStatusArea';
import { RiskDriversPanel } from '../components/dashboard/RiskDriversPanel';
import { RecommendedActionsPanel } from '../components/dashboard/RecommendedActionsPanel';
import { NextCheckPanel } from '../components/dashboard/NextCheckPanel';
import { ComparisonView } from '../components/followup/ComparisonView';
import { COTTON_LEAF_BACTERIAL_IMAGE, COTTON_LEAF_HEALTHY_IMAGE } from '../data/mockData';
import { calculateDaysSincePlanting, formatCalendarDate, getAppCurrentDate } from '../utils/dateUtils';

export const CheckField: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const urlFieldId = searchParams.get('fieldId');
  const urlMode = searchParams.get('mode') as CheckMode | null;

  const { fields, selectedFieldId, getSelectedField, setSelectedFieldId, updateFieldAnalysis, recordFieldFollowUp, addField } = useFieldStore();
  const {
    currentStep,
    setStep,
    formState,
    updateForm,
    initializeForField,
    startAnalysis,
    isAnalyzing,
    analyzingProgressIndex,
    latestResult,
    previousResult,
    isLowConfidenceResult,
    resetAnalysisSession,
  } = useAnalysisStore();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Determine active field: prioritize URL if explicitly passed, otherwise use store's selectedFieldId
  const targetField =
    (urlFieldId ? fields.find((f: Field) => f.id === urlFieldId) : null) ||
    fields.find((f: Field) => f.id === selectedFieldId) ||
    getSelectedField();

  // Initialize form state whenever active field or mode changes
  useEffect(() => {
    const isNewUnchecked = targetField.lastCheckedDate === 'Never';
    const effectiveMode: CheckMode = urlMode || (isNewUnchecked ? 'initial' : 'followup');

    if (selectedFieldId !== targetField.id) {
      setSelectedFieldId(targetField.id);
    }

    initializeForField(
      targetField.id,
      effectiveMode,
      targetField.latestAnalysis,
      targetField.crop,
      targetField.variety,
      targetField.plantingDate
    );
  }, [urlFieldId, targetField.id, urlMode, selectedFieldId]);

  // Progress step titles for analysis screen
  const analysisSteps = [
    'Checking photo clarity and quality...',
    `Scanning leaf for disease signs on ${formState.isNewFieldCreation ? formState.crop : targetField.crop}...`,
    'Checking local weather and humidity in Chennai...',
    'Checking pest numbers and risk...',
    'Calculating 7-day crop health forecast...',
  ];

  // Handle image upload from file or camera
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      updateForm({ imageFile: file, imagePreviewUrl: url });
    }
  };

  const daysSincePlanting = calculateDaysSincePlanting(formState.plantingDate);

  const handleRunAnalysis = () => {
    startAnalysis((result) => {
      if (formState.isNewFieldCreation && formState.newFieldName) {
        // Create brand new field with permanent ID
        const generatedId = `field-${Date.now()}`;
        const finalResult: FullFieldAnalysis = {
          ...result,
          fieldId: generatedId,
        };

        const newFieldObj: Field = {
          id: generatedId,
          name: formState.newFieldName,
          crop: formState.crop,
          variety: formState.variety,
          areaAcres: parseFloat(formState.newAcreage) || 3.0,
          plantingDate: formState.plantingDate,
          daysSincePlanting: daysSincePlanting,
          estimatedGrowthStage: daysSincePlanting > 60 ? 'Flowering & Boll Development' : 'Vegetative Stage',
          currentConditionStatus: finalResult.condition.status,
          riskProbability: finalResult.risk.probability,
          riskLevel: finalResult.risk.level,
          pestPressureSummary: `${finalResult.pest.currentCount} ${finalResult.pest.pestType} (${finalResult.pest.pestPressure})`,
          lastCheckedDate: 'Today',
          nextCheckDays: finalResult.followup.daysRemaining,
          locationName: formState.newLocation || 'Chennai Agritech Sector, Tamil Nadu',
          polygon: {
            center: [13.0827, 80.2707],
            bounds: [
              [13.0850, 80.2680],
              [13.0860, 80.2740],
              [13.0800, 80.2730],
              [13.0795, 80.2675]
            ]
          },
          inspectionPoints: [],
          latestAnalysis: finalResult,
          followUpCount: 0,
          followUpHistory: []
        };
        addField(newFieldObj);
        setSelectedFieldId(newFieldObj.id);
        updateForm({
          isNewFieldCreation: false,
          fieldId: newFieldObj.id,
          newFieldName: '',
        });
        setSearchParams({ fieldId: newFieldObj.id, mode: 'initial' }, { replace: true });
        return;
      }

      if (formState.mode === 'followup') {
        const nextFuNumber = (targetField.followUpCount || 0) + 1;
        const priorProb = targetField.latestAnalysis?.risk.probability || 0.68;
        const riskDelta = parseFloat((result.risk.probability - priorProb).toFixed(2));
        const pestDelta = (result.pest.currentCount || 0) - (formState.previousPestCount || 0);

        const newFollowUpRecord: FollowUpRecord = {
          id: `fu-rec-${Date.now()}`,
          followUpNumber: nextFuNumber,
          date: '2026-09-06',
          displayDate: formatCalendarDate(getAppCurrentDate(), 'display'),
          treatmentApplied: formState.treatmentApplied,
          treatmentNotes: formState.treatmentNotes,
          leafImageUrl: result.condition.leafImageUrl || COTTON_LEAF_BACTERIAL_IMAGE,
          symptomObserved: result.condition.status,
          pestType: result.pest.pestType,
          currentPestCount: result.pest.currentCount,
          previousPestCount: formState.previousPestCount,
          pestDelta: pestDelta,
          riskProbability: result.risk.probability,
          previousRiskProbability: priorProb,
          riskDelta: riskDelta,
          riskLevel: result.risk.level,
          statusVerdict:
            result.comparisonStatus === 'IMPROVING'
              ? 'Fine / Improving'
              : result.comparisonStatus === 'WORSENING'
              ? 'Critical Outbreak'
              : 'Stabilized',
          agronomicAdvisory: result.actions[0]?.action || 'Continue prescribed monitoring',
          nextCheckDays: result.followup.daysRemaining,
        };

        recordFieldFollowUp(targetField.id, newFollowUpRecord, result);
        setSelectedFieldId(targetField.id);
      } else {
        // Initial check update
        const updatedField: Field = {
          ...targetField,
          latestAnalysis: result,
          previousAnalysis: undefined,
          riskProbability: result.risk.probability,
          riskLevel: result.risk.level,
          currentConditionStatus: result.condition.status,
          nextCheckDays: result.followup?.daysRemaining || 7,
          pestPressureSummary: `${result.pest.currentCount} ${result.pest.pestType} (${result.pest.pestPressure})`,
          lastCheckedDate: 'Today',
        };
        updateFieldAnalysis(targetField.id, updatedField);
        setSelectedFieldId(targetField.id);
      }
    });
  };

  const isFollowupMode = formState.mode === 'followup';
  const currentFollowUpSequence = (targetField.followUpCount || 0) + 1;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header & Mode Switcher */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-0.5 rounded text-[10.5px] font-bold uppercase tracking-wider ${
                isFollowupMode
                  ? 'bg-blue-100 text-blue-800 border border-blue-200'
                  : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
              }`}
            >
              {isFollowupMode
                ? `FOLLOW-UP CHECK #${currentFollowUpSequence}`
                : 'FIRST-TIME CROP CHECK'}
            </span>
            <span className="text-xs text-slate-400 font-medium">· {targetField.crop}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mt-1 font-heading">
            {formState.isNewFieldCreation ? (formState.newFieldName || 'Register & Check New Field') : targetField.name}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {isFollowupMode
              ? `Follow-up Check #${currentFollowUpSequence} to check if treatments worked and how the crop is recovering`
              : 'Upload leaf photo and enter insect counts to get an instant disease and risk report'}
          </p>
        </div>

        {/* Mode Toggle Buttons */}
        {currentStep <= 3 && (
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => {
                initializeForField(targetField.id, 'initial', targetField.latestAnalysis, targetField.crop, targetField.variety, targetField.plantingDate);
                setSearchParams({ fieldId: targetField.id, mode: 'initial' });
              }}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                !isFollowupMode
                  ? 'bg-white text-emerald-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              First-Time Upload
            </button>
            <button
              type="button"
              onClick={() => {
                initializeForField(targetField.id, 'followup', targetField.latestAnalysis, targetField.crop, targetField.variety, targetField.plantingDate);
                setSearchParams({ fieldId: targetField.id, mode: 'followup' });
              }}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                isFollowupMode
                  ? 'bg-blue-800 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Follow-up Check
            </button>
          </div>
        )}
      </div>

      {/* PRIOR BASELINE REFERENCE BANNER (Shown in Follow-up Mode) */}
      {isFollowupMode && targetField.latestAnalysis && currentStep <= 3 && (
        <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-blue-100">
            <div className="flex items-center gap-2">
              <GitCompare className="w-4 h-4 text-blue-700" />
              <span className="text-xs font-bold text-blue-900 uppercase font-heading tracking-wider">
                PREVIOUS CHECK SUMMARY ({targetField.name.toUpperCase()})
              </span>
            </div>
            <span className="text-[11px] font-semibold text-blue-700">
              Completed Checks: {targetField.followUpCount || 0}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 text-xs">
            <div>
              <span className="text-slate-500 text-[11px] block">Previous Disease</span>
              <span className="font-bold text-slate-900 mt-0.5 block truncate">
                {targetField.latestAnalysis.condition.status}
              </span>
            </div>
            <div>
              <span className="text-slate-500 text-[11px] block">Previous 7-Day Risk</span>
              <span className="font-bold font-heading text-rose-700 mt-0.5 block">
                {Math.round(targetField.latestAnalysis.risk.probability * 100)}% (
                {targetField.latestAnalysis.risk.level})
              </span>
            </div>
            <div>
              <span className="text-slate-500 text-[11px] block">Previous Pest Count</span>
              <span className="font-bold text-slate-900 mt-0.5 block font-heading">
                {targetField.latestAnalysis.pest.currentCount} {targetField.latestAnalysis.pest.pestType}
              </span>
            </div>
            <div>
              <span className="text-slate-500 text-[11px] block">Recommended Action</span>
              <span className="font-medium text-slate-800 mt-0.5 block truncate">
                {targetField.latestAnalysis.actions[0]?.action || 'Copper spray'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Stepper Progress Header (Steps 1 to 3) */}
      {currentStep <= 3 && (
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          {[
            { step: 1, title: 'Leaf Photo', desc: 'Upload crop photo' },
            {
              step: 2,
              title: isFollowupMode ? 'Treatment & Pests' : 'Pest Count',
              desc: isFollowupMode ? 'Treatment status & pests' : 'Insects per leaf',
            },
            { step: 3, title: 'Field & Weather', desc: 'Crop age & weather' },
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

      {/* STEP 1: LEAF PHOTO UPLOAD */}
      {currentStep === 1 && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Step 1: {isFollowupMode ? 'Upload Latest Leaf Photo' : 'Upload Crop Leaf Photo'}
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                Upload or take a photo of the affected leaf from {formState.isNewFieldCreation ? (formState.newFieldName || 'new field') : targetField.name} ({targetField.crop}).
              </p>
            </div>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          {/* Photo Preview or Clean Upload Dropzone */}
          {formState.imagePreviewUrl ? (
            <div className="space-y-4">
              <div className="w-full h-64 sm:h-80 rounded-xl overflow-hidden bg-slate-900 border border-slate-200 relative group">
                <img
                  src={formState.imagePreviewUrl}
                  alt="Captured crop leaf preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-slate-900/85 text-white text-xs px-2.5 py-1 rounded backdrop-blur-xs font-semibold flex items-center gap-1.5">
                  <ScanLine className="w-3.5 h-3.5 text-emerald-400" />
                  <span>PHOTO LOADED</span>
                </div>
              </div>

              {/* Photo Ready Badge */}
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs">
                <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-emerald-950">Photo Ready for Analysis</div>
                  <div className="text-emerald-800 text-[11px] mt-0.5">
                    Our scanner will check this photo for diseases, pest risks, and overall health condition.
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="text-xs text-slate-500">
                  Ready to proceed to pest check.
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Change Photo</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => updateForm({ imageFile: null, imagePreviewUrl: null })}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-200 text-xs font-semibold text-rose-700 hover:bg-rose-50 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 sm:p-12 text-center space-y-4 bg-slate-50/50 hover:bg-slate-50 transition-colors">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-xs">
                <Camera className="w-7 h-7" />
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900">Upload or Take Leaf Photo</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Take a clear photo of the leaf in daylight or choose a picture from your phone/computer.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2.5 rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  <Camera className="w-4 h-4" />
                  <span>Choose Photo / Take Picture</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    updateForm({
                      imagePreviewUrl: COTTON_LEAF_BACTERIAL_IMAGE,
                    });
                  }}
                  className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                >
                  <ImageIcon className="w-4 h-4 text-slate-500" />
                  <span>Use Sample Affected Leaf</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    updateForm({
                      imagePreviewUrl: COTTON_LEAF_HEALTHY_IMAGE,
                    });
                  }}
                  className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                >
                  <ImageIcon className="w-4 h-4 text-emerald-600" />
                  <span>Use Sample Healthy Leaf</span>
                </button>
              </div>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              type="button"
              disabled={!formState.imagePreviewUrl}
              onClick={() => setStep(2)}
              className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-lg text-xs font-semibold shadow-xs transition-all cursor-pointer"
            >
              <span>Continue to {isFollowupMode ? 'Treatment & Pests' : 'Pest Count'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: PEST SCOUTING & TREATMENT STATUS */}
      {currentStep === 2 && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Step 2: {isFollowupMode ? 'Treatment Verification & Pest Recheck' : 'Pest Observation & Scouting'}
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              {isFollowupMode
                ? `Recording Follow-up Check #${currentFollowUpSequence} data for ${targetField.name}`
                : `Enter insect counts and scouting observations for ${formState.isNewFieldCreation ? (formState.newFieldName || 'new field') : targetField.name}.`}
            </p>
          </div>

          {/* Follow-up Treatment Verification Input */}
          {isFollowupMode && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block font-heading">
                Did you apply the recommended treatment / action?
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {[
                  {
                    val: 'YES' as TreatmentStatus,
                    label: 'Yes, Fully Applied',
                    desc: 'Applied recommended spray/action on schedule',
                    border: 'border-emerald-500 bg-emerald-50 text-emerald-900',
                  },
                  {
                    val: 'PARTIAL' as TreatmentStatus,
                    label: 'Partially Applied',
                    desc: 'Delayed or applied partial dose',
                    border: 'border-amber-500 bg-amber-50 text-amber-900',
                  },
                  {
                    val: 'NO' as TreatmentStatus,
                    label: 'No / Untreated',
                    desc: 'Treatment was not applied or missed',
                    border: 'border-rose-500 bg-rose-50 text-rose-900',
                  },
                ].map((opt) => (
                  <button
                    key={opt.val}
                    type="button"
                    onClick={() => updateForm({ treatmentApplied: opt.val })}
                    className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                      formState.treatmentApplied === opt.val
                        ? `${opt.border} ring-1`
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="font-bold text-xs">{opt.label}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{opt.desc}</div>
                  </button>
                ))}
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Treatment / Field Notes (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sprayed Copper Oxychloride 50 WP 3 days ago along North quadrant"
                  value={formState.treatmentNotes}
                  onChange={(e) => updateForm({ treatmentNotes: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>
            </div>
          )}

          {/* Pest Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Primary Pest Observed
              </label>
              <select
                value={formState.pestType}
                onChange={(e) => updateForm({ pestType: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white cursor-pointer"
              >
                <option value="Cotton Aphid">Cotton Aphid (Aphis gossypii)</option>
                <option value="Whitefly">Whitefly (Bemisia tabaci)</option>
                <option value="Thrips">Thrips (Thrips tabaci)</option>
                <option value="American Bollworm">American Bollworm (Helicoverpa)</option>
                <option value="Jassid">Jassid / Leafhopper (Amrasca)</option>
                <option value="No Visible Pests">No Visible Pests Observed</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Current Pest Count (per 20 leaves)
              </label>
              <input
                type="number"
                min="0"
                value={formState.currentPestCount}
                onChange={(e) => updateForm({ currentPestCount: Math.max(0, parseInt(e.target.value) || 0) })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white"
              />
            </div>

            {isFollowupMode && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Prior Baseline Count
                </label>
                <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-600">
                  {formState.previousPestCount ?? 10} {formState.pestType}
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Derived Population Trend
              </label>
              <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-800 flex items-center justify-between">
                <span>
                  {formState.previousPestCount !== undefined
                    ? formState.currentPestCount < formState.previousPestCount
                      ? `Decreasing (${formState.currentPestCount - formState.previousPestCount} aphids)`
                      : formState.currentPestCount > formState.previousPestCount
                      ? `Increasing (+${formState.currentPestCount - formState.previousPestCount} aphids)`
                      : 'Stable'
                    : formState.currentPestCount <= 4
                    ? 'Low Population'
                    : formState.currentPestCount > 15
                    ? 'Elevated Population'
                    : 'Moderate Population'}
                </span>
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
              <span>Continue to Field & Weather</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: FIELD & WEATHER CONFIRMATION */}
      {currentStep === 3 && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Step 3: Field & Weather Details</h2>
            <p className="text-xs text-slate-600 mt-1">
              Confirming field information for {formState.isNewFieldCreation ? (formState.newFieldName || 'New Field') : targetField.name} and current Chennai weather.
            </p>
          </div>

          {/* New Field vs Existing Field Selector */}
          {!isFollowupMode && (
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider font-heading">
                  Field Selection
                </label>
                <label className="flex items-center gap-2 text-xs font-semibold text-emerald-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formState.isNewFieldCreation}
                    onChange={(e) => updateForm({ isNewFieldCreation: e.target.checked })}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Create New Field Plot</span>
                </label>
              </div>

              {formState.isNewFieldCreation ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">Field Plot Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Madhavaram Cotton Zone 5"
                      value={formState.newFieldName}
                      onChange={(e) => updateForm({ newFieldName: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">Acreage</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formState.newAcreage}
                      onChange={(e) => updateForm({ newAcreage: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-600"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <select
                    value={targetField.id}
                    onChange={(e) => {
                      updateForm({ fieldId: e.target.value });
                      setSelectedFieldId(e.target.value);
                    }}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-600 cursor-pointer"
                  >
                    {fields.map((f: Field) => (
                      <option key={f.id} value={f.id}>
                        {f.name} ({f.crop} · {f.areaAcres} ac) · {f.followUpCount || 0} follow-ups completed
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Planting Date & Crop Age
              </label>
              <input
                type="date"
                value={formState.plantingDate}
                onChange={(e) => updateForm({ plantingDate: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white"
              />
              <div className="text-[11px] text-slate-500 font-medium">
                Crop Age: <strong className="font-heading">{daysSincePlanting} days</strong> · Stage:{' '}
                {daysSincePlanting > 60 ? 'Flowering & Boll Development' : 'Vegetative Stage'}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Crop Variety
              </label>
              <input
                type="text"
                value={formState.variety}
                onChange={(e) => updateForm({ variety: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white"
              />
            </div>
          </div>

          {/* Live Chennai Sensor Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CloudSun className="w-4 h-4 text-sky-600" />
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider font-heading">
                  LOCAL CHENNAI WEATHER
                </span>
              </div>
              <span className="text-[10px] text-emerald-800 bg-emerald-100 font-semibold px-2 py-0.5 rounded">
                Live Weather Data
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-2 text-xs">
              <div className="bg-white p-2.5 rounded border border-slate-200">
                <div className="text-slate-500 text-[11px]">Temperature</div>
                <div className="text-base font-bold text-slate-900 mt-0.5">29°C</div>
              </div>
              <div className="bg-white p-2.5 rounded border border-slate-200">
                <div className="text-slate-500 text-[11px]">Humidity</div>
                <div className="text-base font-bold text-slate-900 mt-0.5">86% RH</div>
              </div>
              <div className="bg-white p-2.5 rounded border border-slate-200">
                <div className="text-slate-500 text-[11px]">Recent Rain</div>
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
              onClick={handleRunAnalysis}
              className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-6 py-2.5 rounded-lg text-xs font-semibold shadow-xs transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>
                {isFollowupMode
                  ? `RUN FOLLOW-UP #${currentFollowUpSequence} CHECK`
                  : 'RUN CROP HEALTH CHECK'}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: PROCESSING SCREEN */}
      {currentStep === 4 && (
        <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-xs text-center space-y-6 max-w-lg mx-auto">
          <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto animate-spin">
            <RefreshCw className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-900">
              {isFollowupMode ? `Checking Follow-Up #${currentFollowUpSequence}...` : 'Analyzing Crop Health...'}
            </h2>
            <p className="text-xs text-slate-500">
              Apocalypse Crop Health System · {targetField.name}
            </p>
          </div>

          <div className="space-y-3 pt-2 text-left bg-slate-50 p-4 rounded-lg border border-slate-200">
            {analysisSteps.map((stepDesc, idx) => {
              const isCompleted = analyzingProgressIndex > idx;
              const isCurrent = analyzingProgressIndex === idx;

              return (
                <div key={idx} className="flex items-center gap-2.5 text-xs">
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${
                      isCompleted
                        ? 'bg-emerald-600 text-white'
                        : isCurrent
                        ? 'bg-emerald-100 text-emerald-800 animate-pulse'
                        : 'bg-slate-200 text-slate-400'
                    }`}
                  >
                    {isCompleted ? '✓' : idx + 1}
                  </div>
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
      )}

      {/* STEP 5: SUCCESSFUL RESULT */}
      {currentStep === 5 && !isLowConfidenceResult && latestResult && (
        <div className="space-y-6 animate-in fade-in-50">
          {/* Top Success Banner */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
              <div>
                <h3 className="text-sm font-bold text-emerald-950">
                  {isFollowupMode
                    ? `Follow-Up #${currentFollowUpSequence} Recorded Successfully!`
                    : 'Baseline Observation Established!'}
                </h3>
                <p className="text-xs text-emerald-800">
                  Field records and follow-up timeline updated for <strong>{targetField.name}</strong> ({targetField.crop}) on{' '}
                  {formatCalendarDate(getAppCurrentDate(), 'display')}
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate('/dashboard')}
              className="px-3.5 py-1.5 rounded-lg bg-white border border-emerald-300 text-xs font-semibold text-emerald-900 hover:bg-emerald-100 transition-colors cursor-pointer self-start sm:self-auto"
            >
              Open Dashboard
            </button>
          </div>

          {/* Primary Status Area (Condition + 7-Day Risk) */}
          <PrimaryStatusArea
            condition={latestResult.condition}
            risk={latestResult.risk}
          />

          {/* Side-by-Side Comparison (If Follow-up mode or previous check exists) */}
          {previousResult && (
            <ComparisonView
              previous={previousResult}
              current={latestResult}
              status={latestResult.comparisonStatus || 'IMPROVING'}
            />
          )}

          {/* Diagnosis & Probabilities */}
          <DiagnosisPanel condition={latestResult.condition} />

          {/* Risk Drivers */}
          <RiskDriversPanel risk={latestResult.risk} />

          {/* Recommended Actions & Next Check Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RecommendedActionsPanel
              actions={latestResult.actions}
              fieldId={targetField.id}
            />
            <NextCheckPanel
              followup={latestResult.followup}
              riskLevel={latestResult.risk.level}
              fieldId={targetField.id}
            />
          </div>

          {/* Bottom Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200">
            <button
              onClick={() => {
                resetAnalysisSession(targetField.id);
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Start Another Inspection</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/followups')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                <HistoryIcon className="w-3.5 h-3.5" />
                <span>View Follow-up History Log</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

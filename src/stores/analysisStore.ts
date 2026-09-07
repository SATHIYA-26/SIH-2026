import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FullFieldAnalysis, DiseaseClass, DiseaseProbabilities } from '../types/analysis';
import { RiskLevel } from '../types/risk';
import { COTTON_LEAF_BACTERIAL_IMAGE, COTTON_LEAF_HEALTHY_IMAGE } from '../data/mockData';
import { computeTargetDate, calculateDaysSincePlanting, getAppCurrentDate } from '../utils/dateUtils';

export type CheckMode = 'initial' | 'followup';
export type TreatmentStatus = 'YES' | 'PARTIAL' | 'NO';

export interface CheckFieldFormState {
  fieldId: string;
  mode: CheckMode;
  isNewFieldCreation: boolean;
  newFieldName: string;
  newAcreage: string;
  newLocation: string;
  crop: string;
  variety: string;
  plantingDate: string;
  pestType: string;
  currentPestCount: number;
  previousPestCount?: number;
  treatmentApplied: TreatmentStatus;
  treatmentNotes: string;
  imageFile: File | null;
  imagePreviewUrl: string | null;
  simulateLowConfidence: boolean;
}

interface AnalysisState {
  currentStep: number; // 1: Photo, 2: Pest & Treatment, 3: Field & Weather, 4: Processing, 5: Result
  formState: CheckFieldFormState;
  isAnalyzing: boolean;
  analyzingProgressIndex: number;
  latestResult: FullFieldAnalysis | null;
  previousResult: FullFieldAnalysis | null;
  isLowConfidenceResult: boolean;

  // Actions
  setStep: (step: number) => void;
  updateForm: (updates: Partial<CheckFieldFormState>) => void;
  initializeForField: (fieldId: string, mode: CheckMode, priorAnalysis?: FullFieldAnalysis | null, cropName?: string, varietyName?: string, plantDate?: string) => void;
  startAnalysis: (onComplete: (result: FullFieldAnalysis) => void) => void;
  setLatestResult: (result: FullFieldAnalysis) => void;
  setLowConfidence: (low: boolean) => void;
  resetAnalysisSession: (fieldId?: string) => void;
}

const initialFormState: CheckFieldFormState = {
  fieldId: 'field-cotton-a',
  mode: 'initial',
  isNewFieldCreation: false,
  newFieldName: '',
  newAcreage: '3.0',
  newLocation: 'Ambattur Sector 4, Chennai, Tamil Nadu',
  crop: 'Cotton',
  variety: 'Bt Cotton RCH-659',
  plantingDate: '2026-06-23',
  pestType: 'Cotton Aphid',
  currentPestCount: 0,
  previousPestCount: undefined,
  treatmentApplied: 'YES',
  treatmentNotes: '',
  imageFile: null,
  imagePreviewUrl: null,
  simulateLowConfidence: false,
};

export const useAnalysisStore = create<AnalysisState>()(
  persist(
    (set, get) => ({
      currentStep: 1,
      formState: initialFormState,
      isAnalyzing: false,
      analyzingProgressIndex: 0,
      latestResult: null,
      previousResult: null,
      isLowConfidenceResult: false,

      setStep: (step) => set({ currentStep: step }),

      updateForm: (updates) => {
        set((state) => ({
          formState: { ...state.formState, ...updates },
        }));
      },

      initializeForField: (fieldId, mode, priorAnalysis = null, cropName = 'Cotton', varietyName = 'Bt Cotton RCH-659', plantDate = '2026-06-23') => {
        const isFollowup = mode === 'followup';
        const current = get();

        // If user already has an active completed result for this field, preserve it on load unless switching mode
        if (current.latestResult && current.latestResult.fieldId === fieldId && current.currentStep === 5) {
          return;
        }

        set({
          currentStep: 1,
          previousResult: isFollowup ? priorAnalysis : null,
          isAnalyzing: false,
          analyzingProgressIndex: 0,
          isLowConfidenceResult: false,
          formState: {
            ...initialFormState,
            fieldId,
            mode,
            isNewFieldCreation: false,
            crop: cropName,
            variety: varietyName,
            plantingDate: plantDate,
            imageFile: null,
            imagePreviewUrl: null,
            pestType: priorAnalysis?.pest.pestType || 'Cotton Aphid',
            previousPestCount: isFollowup ? (priorAnalysis?.pest.currentCount || 10) : undefined,
            currentPestCount: isFollowup ? Math.max(2, Math.floor((priorAnalysis?.pest.currentCount || 10) / 2)) : 0,
            treatmentApplied: 'YES',
            treatmentNotes: isFollowup ? 'Applied recommended Copper Oxychloride treatment on schedule' : '',
          },
        });
      },

      resetAnalysisSession: (fieldId) => {
        set({
          currentStep: 1,
          latestResult: null,
          previousResult: null,
          isAnalyzing: false,
          analyzingProgressIndex: 0,
          isLowConfidenceResult: false,
          formState: {
            ...initialFormState,
            fieldId: fieldId || 'field-cotton-a',
          },
        });
      },

      startAnalysis: (onComplete) => {
        set({ isAnalyzing: true, currentStep: 4, analyzingProgressIndex: 0 });

        const stepIntervals = [300, 600, 900, 1200, 1500];

        stepIntervals.forEach((delay, index) => {
          setTimeout(() => {
            set({ analyzingProgressIndex: index });

            if (index === stepIntervals.length - 1) {
              const { formState, previousResult } = get();

              if (formState.simulateLowConfidence) {
                set({
                  isAnalyzing: false,
                  isLowConfidenceResult: true,
                  currentStep: 5,
                });
                return;
              }

              // Compute Dynamic Real-World Diagnosis & Risk
              const crop = formState.crop || 'Cotton';
              const isFollowup = formState.mode === 'followup';
              const treatment = formState.treatmentApplied;
              const pestCount = formState.currentPestCount;
              const pestType = formState.pestType;
              const imgUrl = formState.imagePreviewUrl || COTTON_LEAF_BACTERIAL_IMAGE;

              // AI Automated Visual Classification
              const isHealthyVisual = imgUrl.includes('cotton_healthy') || (pestCount <= 2 && !isFollowup && !imgUrl.includes('bacterial'));
              const isViralVector = pestType.toLowerCase().includes('whitefly');

              let statusTitle = 'Healthy Crop Foliage';
              let topClass: DiseaseClass = 'healthy';
              let conf = 0.945;
              let probs: DiseaseProbabilities = { healthy: 0.945, bacterial: 0.021, curl_virus: 0.018, fusarium: 0.016 };
              let needsAttn = false;

              if (isHealthyVisual) {
                topClass = 'healthy';
                conf = 0.958;
                probs = { healthy: 0.958, bacterial: 0.02, curl_virus: 0.012, fusarium: 0.010 };
                statusTitle = `Healthy ${crop} Foliage (Normal Growth)`;
                needsAttn = false;
              } else if (isViralVector) {
                topClass = 'curl_virus';
                needsAttn = true;
                statusTitle = `${crop} Leaf Curl Virus Detected`;
                conf = 0.894;
                probs = { healthy: 0.035, bacterial: 0.041, curl_virus: 0.894, fusarium: 0.03 };
              } else {
                // Bacterial Blight
                topClass = 'bacterial';
                needsAttn = true;
                if (isFollowup && treatment === 'YES' && pestCount <= 8) {
                  statusTitle = 'Leaf Blight Spots Stabilized (Crop Recovering)';
                  conf = 0.885;
                  probs = { healthy: 0.65, bacterial: 0.25, curl_virus: 0.06, fusarium: 0.04 };
                  needsAttn = false;
                } else if (isFollowup && treatment === 'NO') {
                  statusTitle = 'Severe Spreading Leaf Blight Outbreak';
                  conf = 0.952;
                  probs = { healthy: 0.008, bacterial: 0.952, curl_virus: 0.022, fusarium: 0.018 };
                } else {
                  statusTitle = `${crop} Leaf Blight (Spotted Leaves)`;
                  conf = 0.913;
                  probs = { healthy: 0.021, bacterial: 0.913, curl_virus: 0.041, fusarium: 0.025 };
                }
              }

              // 2. Risk Calculation Engine
              let baseRisk = 0.12;
              if (topClass === 'healthy') baseRisk = 0.10;
              else if (topClass === 'bacterial') baseRisk = 0.58;
              else if (topClass === 'curl_virus') baseRisk = 0.50;

              // Pest modifier
              if (pestCount > 15) baseRisk += 0.20;
              else if (pestCount > 8) baseRisk += 0.10;
              else if (pestCount <= 3) baseRisk -= 0.04;

              // Follow-up treatment modifier
              if (isFollowup) {
                if (treatment === 'YES') baseRisk -= 0.25;
                else if (treatment === 'PARTIAL') baseRisk -= 0.06;
                else if (treatment === 'NO') baseRisk += 0.24;
              }

              const calculatedProb = Math.max(0.08, Math.min(0.95, parseFloat(baseRisk.toFixed(2))));
              const riskLevel: RiskLevel = calculatedProb >= 0.60 ? 'HIGH' : calculatedProb >= 0.35 ? 'MODERATE' : 'LOW';

              // 3. Comparison Status
              let compStatus: 'IMPROVING' | 'STABLE' | 'WORSENING' = 'STABLE';
              const prevProb = previousResult ? previousResult.risk.probability : 0.68;
              if (isFollowup) {
                if (calculatedProb < prevProb - 0.08) compStatus = 'IMPROVING';
                else if (calculatedProb > prevProb + 0.08) compStatus = 'WORSENING';
                else compStatus = 'STABLE';
              }

              // 4. Follow-up Interval
              const intervalDays = riskLevel === 'HIGH' ? 3 : riskLevel === 'MODERATE' ? 5 : 10;
              const targetDateFormatted = computeTargetDate(intervalDays);

              // 5. Actions synthesizer
              const actions = [];
              if (riskLevel === 'HIGH') {
                actions.push(
                  {
                    id: `act-${Date.now()}-1`,
                    stepNumber: 1,
                    action: topClass === 'curl_virus' ? 'Spray Neem Extract or Insect Medicine' : 'Apply Copper Oxychloride 50 WP (2.5g/L)',
                    detail: 'Spray affected plants and surrounding 5-meter area to prevent spots from spreading.',
                    type: 'isolation' as const
                  },
                  {
                    id: `act-${Date.now()}-2`,
                    stepNumber: 2,
                    action: 'Check Insect Numbers under Leaves',
                    detail: `Count bugs under leaves. Current count is ${pestCount} ${formState.pestType}. Keep under safe threshold.`,
                    type: 'monitoring' as const
                  },
                  {
                    id: `act-${Date.now()}-3`,
                    stepNumber: 3,
                    action: 'Recheck Field in 2 to 3 Days',
                    detail: 'Take a new leaf photo to confirm if spots and insects stopped spreading.',
                    type: 'followup' as const
                  }
                );
              } else if (riskLevel === 'MODERATE') {
                actions.push(
                  {
                    id: `act-${Date.now()}-1`,
                    stepNumber: 1,
                    action: 'Remove Heavily Diseased Leaves & Waterlogging',
                    detail: 'Clear yellow or spotted leaves from lower branches and keep drainage lines clear.',
                    type: 'inspection' as const
                  },
                  {
                    id: `act-${Date.now()}-2`,
                    stepNumber: 2,
                    action: 'Spray Micronutrient Booster',
                    detail: 'Spray Zinc Sulphate (0.5%) + Boron (0.2%) to help strengthen plant leaves.',
                    type: 'advisory' as const
                  },
                  {
                    id: `act-${Date.now()}-3`,
                    stepNumber: 3,
                    action: 'Routine Check in 5 Days',
                    detail: 'Verify that leaf condition remains stable.',
                    type: 'followup' as const
                  }
                );
              } else {
                actions.push(
                  {
                    id: `act-${Date.now()}-1`,
                    stepNumber: 1,
                    action: 'Continue Routine Field Monitoring',
                    detail: 'Walk across the field twice a week and inspect border rows for pests.',
                    type: 'inspection' as const
                  },
                  {
                    id: `act-${Date.now()}-2`,
                    stepNumber: 2,
                    action: 'Next Regular Check in 10 Days',
                    detail: 'Crops are healthy. Maintain regular watering and standard fertilizers.',
                    type: 'followup' as const
                  }
                );
              }

              // 6. Drivers synthesizer
              const drivers = [];
              if (topClass !== 'healthy') {
                drivers.push({
                  id: 'd1',
                  title: 'Leaf Spots / Infection',
                  value: statusTitle,
                  impact: riskLevel === 'HIGH' ? ('high' as const) : ('medium' as const),
                  description: 'Visible spots or virus symptoms observed on field samples.'
                });
              }
              if (pestCount > 6) {
                drivers.push({
                  id: 'd2',
                  title: 'Insect Count',
                  value: `${pestCount} ${formState.pestType}`,
                  impact: pestCount > 15 ? ('high' as const) : ('medium' as const),
                  description: 'Insects feed on leaf sap and can transmit plant infections.'
                });
              }
              drivers.push({
                id: 'd3',
                title: 'Weather & Moisture',
                value: '86% Humidity',
                impact: 'high' as const,
                description: 'High air humidity and damp leaves create favorable conditions for leaf spots.'
              });
              if (isFollowup && treatment === 'YES') {
                drivers.push({
                  id: 'd4',
                  title: 'Treatment Effect',
                  value: 'Medicine Spray Applied',
                  impact: 'low' as const,
                  description: 'Applied treatment actively stops leaf spots from multiplying.'
                });
              }

              // Build full analysis result
              const result: FullFieldAnalysis = {
                id: `ana-${Date.now()}`,
                fieldId: formState.fieldId,
                timestamp: getAppCurrentDate().toISOString(),
                condition: {
                  status: statusTitle,
                  confidence: conf,
                  topClass,
                  probabilities: probs,
                  needsAttention: needsAttn,
                  leafImageUrl: imgUrl,
                  isLowConfidence: false,
                },
                pest: {
                  pestType: formState.pestType,
                  currentCount: pestCount,
                  previousCount: formState.previousPestCount,
                  pestPressure: pestCount > (formState.previousPestCount || 0)
                    ? 'Increasing'
                    : pestCount < (formState.previousPestCount || 0)
                    ? 'Decreasing'
                    : pestCount <= 4
                    ? 'Low'
                    : 'Stable',
                },
                weather: {
                  temperature: 29,
                  humidity: 86,
                  recentRainfall: 12,
                  rainfallTrend: '12 mm recently',
                  daysSinceRain: 1,
                  conditionDescription: 'Warm coastal weather with high morning humidity',
                  forecast: [
                    { day: 'Today', temp: 29, humidity: 86, rainProbability: 60 },
                    { day: 'Tomorrow', temp: 30, humidity: 82, rainProbability: 40 },
                    { day: 'In 2 Days', temp: 31, humidity: 78, rainProbability: 30 }
                  ],
                },
                cropStage: {
                  cropName: crop,
                  plantingDate: formState.plantingDate,
                  daysSincePlanting: calculateDaysSincePlanting(formState.plantingDate),
                  stageName: 'Flowering Stage',
                  stageProgressPercent: 55,
                  totalCycleDays: 160,
                  stages: [],
                },
                risk: {
                  probability: calculatedProb,
                  level: riskLevel,
                  horizonDays: 7,
                  summary:
                    riskLevel === 'HIGH'
                      ? `Elevated risk for ${crop} due to high humidity and active leaf spots.`
                      : riskLevel === 'MODERATE'
                      ? `Moderate risk for ${crop}. Disease condition is stabilizing under management.`
                      : `Low risk for ${crop}. Crops are healthy, strong, and growing normally.`,
                  trendDirection: compStatus === 'IMPROVING' ? 'decreasing' : compStatus === 'WORSENING' ? 'increasing' : 'stable',
                  previousProbability: prevProb,
                  drivers,
                },
                actions,
                followup: {
                  daysRemaining: intervalDays,
                  recommendedIntervalDays: intervalDays,
                  targetDate: targetDateFormatted,
                  status: 'pending',
                  reason:
                    riskLevel === 'HIGH'
                      ? 'High risk alert requires 2–3 day follow-up check'
                      : riskLevel === 'MODERATE'
                      ? 'Moderate risk requires 5-day check'
                      : 'Low risk permits regular 10-day routine check',
                },
                comparisonStatus: compStatus,
              };

              set({
                isAnalyzing: false,
                latestResult: result,
                previousResult: isFollowup ? previousResult : null,
                isLowConfidenceResult: false,
                currentStep: 5,
              });

              onComplete(result);
            }
          }, delay);
        });
      },

      setLatestResult: (result) => set({ latestResult: result }),
      setLowConfidence: (low) => set({ isLowConfidenceResult: low }),
    }),
    {
      name: 'apocalypse_ai_analysis_storage_v2',
      partialize: (state) => ({
        currentStep: state.currentStep,
        latestResult: state.latestResult,
        previousResult: state.previousResult,
        formState: state.formState,
      }),
    }
  )
);


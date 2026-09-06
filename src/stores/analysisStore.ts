import { create } from 'zustand';
import { FullFieldAnalysis, DiseaseClass, DiseaseProbabilities } from '../types/analysis';
import { RiskLevel } from '../types/risk';
import { COTTON_LEAF_BACTERIAL_IMAGE, COTTON_LEAF_HEALTHY_IMAGE } from '../data/mockData';

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

export const useAnalysisStore = create<AnalysisState>((set, get) => ({
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
    set({
      currentStep: 1,
      latestResult: null,
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
        imagePreviewUrl: isFollowup ? (priorAnalysis?.condition.leafImageUrl || COTTON_LEAF_BACTERIAL_IMAGE) : null,
        pestType: priorAnalysis?.pest.pestType || 'Cotton Aphid',
        previousPestCount: isFollowup ? (priorAnalysis?.pest.currentCount || 10) : undefined,
        currentPestCount: isFollowup ? Math.max(2, Math.floor((priorAnalysis?.pest.currentCount || 10) / 2)) : 0,
        treatmentApplied: 'YES',
        treatmentNotes: isFollowup ? 'Applied recommended Copper Oxychloride treatment on schedule' : '',
      },
    });
  },

  startAnalysis: (onComplete) => {
    set({ isAnalyzing: true, currentStep: 4, analyzingProgressIndex: 0 });

    const stepIntervals = [450, 900, 1350, 1800, 2250];

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
          const isHealthyVisual = imgUrl.includes('cotton_healthy') || (pestCount <= 2 && !isFollowup);
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
            statusTitle = `Healthy ${crop} Foliage (Optimal Canopy)`;
            needsAttn = false;
          } else if (isViralVector) {
            topClass = 'curl_virus';
            needsAttn = true;
            statusTitle = `${crop} Leaf Curl Geminivirus Detected`;
            conf = 0.894;
            probs = { healthy: 0.035, bacterial: 0.041, curl_virus: 0.894, fusarium: 0.03 };
          } else {
            // Bacterial Blight
            topClass = 'bacterial';
            needsAttn = true;
            if (isFollowup && treatment === 'YES' && pestCount <= 8) {
              statusTitle = 'Bacterial Lesions Stabilized / Desiccating (Recovering)';
              conf = 0.825;
              probs = { healthy: 0.60, bacterial: 0.30, curl_virus: 0.06, fusarium: 0.04 };
              needsAttn = false;
            } else if (isFollowup && treatment === 'NO') {
              statusTitle = 'Severe Spreading Bacterial Blight Outbreak';
              conf = 0.952;
              probs = { healthy: 0.008, bacterial: 0.952, curl_virus: 0.022, fusarium: 0.018 };
            } else {
              statusTitle = `${crop} Bacterial Blight Detected (Angular Spots)`;
              conf = 0.913;
              probs = { healthy: 0.021, bacterial: 0.913, curl_virus: 0.041, fusarium: 0.025 };
            }
          }

          // 2. Risk Calculation (XGBoost logic engine)
          let baseRisk = 0.15;
          if (topClass === 'healthy') baseRisk = 0.14;
          else if (topClass === 'bacterial') baseRisk = 0.62;
          else if (topClass === 'curl_virus') baseRisk = 0.54;

          // Pest modifier
          if (pestCount > 15) baseRisk += 0.18;
          else if (pestCount > 8) baseRisk += 0.08;
          else if (pestCount <= 3) baseRisk -= 0.05;

          // Follow-up treatment modifier
          if (isFollowup) {
            if (treatment === 'YES') baseRisk -= 0.28;
            else if (treatment === 'PARTIAL') baseRisk -= 0.08;
            else if (treatment === 'NO') baseRisk += 0.22;
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
          const intervalDays = riskLevel === 'HIGH' ? 3 : riskLevel === 'MODERATE' ? 6 : 10;
          const targetDateObj = new Date();
          targetDateObj.setDate(targetDateObj.getDate() + intervalDays);
          const targetDateFormatted = targetDateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

          // 5. Actions synthesizer
          const actions = [];
          if (riskLevel === 'HIGH') {
            actions.push(
              {
                id: `act-${Date.now()}-1`,
                stepNumber: 1,
                action: topClass === 'curl_virus' ? 'Apply Acetamiprid 20% SP / Neem Extract' : 'Apply Copper Oxychloride 50 WP @ 2.5g/L + Streptocycline 100ppm',
                detail: 'Target affected foliage zones and maintain 5-meter buffer perimeter to stop secondary spore dispersal.',
                type: 'isolation' as const
              },
              {
                id: `act-${Date.now()}-2`,
                stepNumber: 2,
                action: 'Suppress sucking pest vector population',
                detail: `Scout plant undersides. Current count is ${pestCount} ${formState.pestType}. Keep below economic threshold.`,
                type: 'monitoring' as const
              },
              {
                id: `act-${Date.now()}-3`,
                stepNumber: 3,
                action: 'Urgent follow-up recheck in 3 days',
                detail: 'Confirm that lesions have stopped expanding and no fresh water-soaked margins appear.',
                type: 'followup' as const
              }
            );
          } else if (riskLevel === 'MODERATE') {
            actions.push(
              {
                id: `act-${Date.now()}-1`,
                stepNumber: 1,
                action: 'Targeted spot monitoring and foliage aeration',
                detail: 'Inspect canopy airflow. Prune severely diseased lower leaves to reduce relative humidity.',
                type: 'inspection' as const
              },
              {
                id: `act-${Date.now()}-2`,
                stepNumber: 2,
                action: 'Foliar micronutrient booster',
                detail: 'Spray Zinc Sulphate (0.5%) + Boron (0.2%) to bolster cell wall resistance against pathogen entry.',
                type: 'advisory' as const
              },
              {
                id: `act-${Date.now()}-3`,
                stepNumber: 3,
                action: 'Scheduled 6-day follow-up inspection',
                detail: 'Verify symptom stabilization across monitored transect.',
                type: 'followup' as const
              }
            );
          } else {
            actions.push(
              {
                id: `act-${Date.now()}-1`,
                stepNumber: 1,
                action: 'Maintain standard precision scouting routine',
                detail: 'Walk diagonal field transect twice weekly to check perimeter rows.',
                type: 'inspection' as const
              },
              {
                id: `act-${Date.now()}-2`,
                stepNumber: 2,
                action: 'Standard 10–14 day health check',
                detail: 'Field condition is optimal and fine. Continue balanced nutrition and routine irrigation.',
                type: 'followup' as const
              }
            );
          }

          // 6. Drivers synthesizer
          const drivers = [];
          if (topClass !== 'healthy') {
            drivers.push({
              id: 'd1',
              title: 'Active Pathogen Signal',
              value: statusTitle,
              impact: riskLevel === 'HIGH' ? ('high' as const) : ('medium' as const),
              description: 'Visible leaf symptoms and active pathogen pressure identified in field.'
            });
          }
          if (pestCount > 8) {
            drivers.push({
              id: 'd2',
              title: 'Pest Pressure',
              value: `${pestCount} ${formState.pestType}`,
              impact: pestCount > 15 ? ('high' as const) : ('medium' as const),
              description: 'Vector feeding punctures facilitate secondary fungal and bacterial entry.'
            });
          }
          drivers.push({
            id: 'd3',
            title: 'Canopy Humidity',
            value: '86% RH (Chennai)',
            impact: 'high' as const,
            description: 'Canopy wetness duration accelerates bacterial and fungal spore propagation.'
          });
          if (isFollowup && treatment === 'YES') {
            drivers.push({
              id: 'd4',
              title: 'Treatment Response',
              value: 'Bactericide / Spray Applied',
              impact: 'low' as const,
              description: 'Applied treatment actively suppresses pathogen reproduction rate.'
            });
          }

          // Build full analysis result
          const result: FullFieldAnalysis = {
            id: `ana-${Date.now()}`,
            fieldId: formState.fieldId,
            timestamp: new Date().toISOString(),
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
              rainfallTrend: '12 mm in last 48h',
              daysSinceRain: 1,
              conditionDescription: 'Humid coastal weather with high leaf wetness index',
              forecast: [
                { day: 'Today', temp: 29, humidity: 86, rainProbability: 60 },
                { day: 'Tomorrow', temp: 30, humidity: 82, rainProbability: 40 },
                { day: 'In 2 Days', temp: 31, humidity: 78, rainProbability: 30 }
              ],
            },
            cropStage: {
              cropName: crop,
              plantingDate: formState.plantingDate,
              daysSincePlanting: Math.ceil(Math.abs(new Date().getTime() - new Date(formState.plantingDate).getTime()) / (1000 * 60 * 60 * 24)) || 70,
              stageName: 'Flowering & Boll Development',
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
                  ? `Critical outbreak risk for ${crop} driven by high humidity and observed symptoms.`
                  : riskLevel === 'MODERATE'
                  ? `Moderate risk for ${crop}. Disease condition stabilizing under active management.`
                  : `Optimal low-risk status for ${crop}. Field foliage is healthy and fine.`,
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
                  ? 'High risk alert requires 2–4 day scouting recheck'
                  : riskLevel === 'MODERATE'
                  ? 'Moderate risk requires 5–7 day scouting recheck'
                  : 'Low risk profile permits standard 10–14 day cycle',
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
}));

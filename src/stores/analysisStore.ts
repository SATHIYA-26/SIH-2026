import { create } from 'zustand';
import { FullFieldAnalysis, PestObservation, DiseaseCondition } from '../types/analysis';
import { DEMO_SCENARIO_HIGH_RISK, DEMO_SCENARIO_IMPROVING } from '../data/mockData';

export interface CheckFieldFormState {
  fieldId: string;
  plantingDate: string;
  pestType: string;
  currentPestCount: number;
  previousPestCount?: number;
  imageFile: File | null;
  imagePreviewUrl: string | null;
  simulateLowConfidence: boolean;
  simulateImproving: boolean;
}

interface AnalysisState {
  currentStep: number; // 1: Photo, 2: Pest, 3: Field Info, 4: Analyzing, 5: Result
  formState: CheckFieldFormState;
  isAnalyzing: boolean;
  analyzingProgressIndex: number; // 0 to 4
  latestResult: FullFieldAnalysis | null;
  previousResult: FullFieldAnalysis | null;
  isLowConfidenceResult: boolean;

  // Actions
  setStep: (step: number) => void;
  updateForm: (updates: Partial<CheckFieldFormState>) => void;
  resetForm: () => void;
  startAnalysis: (onComplete: (result: FullFieldAnalysis) => void) => void;
  setLatestResult: (result: FullFieldAnalysis) => void;
  setLowConfidence: (low: boolean) => void;
}

const initialFormState: CheckFieldFormState = {
  fieldId: 'field-cotton-a',
  plantingDate: '2026-06-23',
  pestType: 'Cotton Aphid',
  currentPestCount: 18,
  previousPestCount: 10,
  imageFile: null,
  imagePreviewUrl: 'https://images.unsplash.com/photo-1599427303058-f04cbcf4756f?auto=format&fit=crop&w=800&q=80',
  simulateLowConfidence: false,
  simulateImproving: false,
};

export const useAnalysisStore = create<AnalysisState>((set, get) => ({
  currentStep: 1,
  formState: initialFormState,
  isAnalyzing: false,
  analyzingProgressIndex: 0,
  latestResult: DEMO_SCENARIO_HIGH_RISK.latestAnalysis,
  previousResult: DEMO_SCENARIO_HIGH_RISK.previousAnalysis || null,
  isLowConfidenceResult: false,

  setStep: (step) => set({ currentStep: step }),

  updateForm: (updates) => {
    set(state => ({
      formState: { ...state.formState, ...updates }
    }));
  },

  resetForm: () => {
    set({
      currentStep: 1,
      formState: initialFormState,
      isAnalyzing: false,
      analyzingProgressIndex: 0,
      isLowConfidenceResult: false
    });
  },

  startAnalysis: (onComplete) => {
    set({ isAnalyzing: true, currentStep: 4, analyzingProgressIndex: 0 });

    const stepIntervals = [600, 1200, 1800, 2400, 3000];

    stepIntervals.forEach((delay, index) => {
      setTimeout(() => {
        set({ analyzingProgressIndex: index });

        if (index === stepIntervals.length - 1) {
          const { formState } = get();
          
          if (formState.simulateLowConfidence) {
            set({
              isAnalyzing: false,
              isLowConfidenceResult: true,
              currentStep: 5
            });
            return;
          }

          // Build realistic result
          const isImproving = formState.simulateImproving || formState.currentPestCount < (formState.previousPestCount || 10);
          const baseField = isImproving ? DEMO_SCENARIO_IMPROVING : DEMO_SCENARIO_HIGH_RISK;
          
          const result: FullFieldAnalysis = {
            ...baseField.latestAnalysis,
            id: `ana-${Date.now()}`,
            fieldId: formState.fieldId,
            timestamp: new Date().toISOString(),
            pest: {
              pestType: formState.pestType,
              currentCount: formState.currentPestCount,
              previousCount: formState.previousPestCount,
              pestPressure: formState.currentPestCount > (formState.previousPestCount || 0)
                ? 'Increasing'
                : formState.currentPestCount < (formState.previousPestCount || 0)
                ? 'Decreasing'
                : 'Stable'
            },
            comparisonStatus: isImproving ? 'IMPROVING' : 'STABLE'
          };

          set({
            isAnalyzing: false,
            latestResult: result,
            previousResult: DEMO_SCENARIO_HIGH_RISK.latestAnalysis,
            isLowConfidenceResult: false,
            currentStep: 5
          });

          onComplete(result);
        }
      }, delay);
    });
  },

  setLatestResult: (result) => set({ latestResult: result }),
  setLowConfidence: (low) => set({ isLowConfidenceResult: low })
}));

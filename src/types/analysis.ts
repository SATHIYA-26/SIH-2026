import { RiskResult } from './risk';
import { WeatherCondition } from './weather';

export type DiseaseClass = 'healthy' | 'bacterial' | 'curl_virus' | 'fusarium';

export interface DiseaseProbabilities {
  healthy: number; // e.g. 0.021
  bacterial: number; // e.g. 0.913
  curl_virus: number; // e.g. 0.041
  fusarium: number; // e.g. 0.025
}

export interface DiseaseCondition {
  status: string; // "Bacterial Blight Detected", "Healthy Crop", etc.
  confidence: number; // e.g. 0.913
  topClass: DiseaseClass;
  probabilities: DiseaseProbabilities;
  needsAttention: boolean;
  leafImageUrl?: string;
  isLowConfidence?: boolean;
}

export interface PestObservation {
  pestType: string; // e.g. "Cotton Aphid"
  currentCount: number; // e.g. 18
  previousCount?: number; // e.g. 10
  pestPressure: 'Increasing' | 'Stable' | 'Decreasing' | 'Low';
}

export interface CropGrowthStageInfo {
  cropName: string;
  plantingDate: string; // ISO date or "23 June 2026"
  daysSincePlanting: number;
  stageName: string; // "Flowering & Boll Development"
  stageProgressPercent: number;
  totalCycleDays: number; // e.g. 160
  stages: {
    name: string;
    startDay: number;
    endDay: number;
    isCurrent: boolean;
    isCompleted: boolean;
  }[];
}

export interface ActionRecommendation {
  id: string;
  stepNumber: number;
  action: string;
  detail: string;
  type: 'inspection' | 'isolation' | 'monitoring' | 'followup' | 'advisory';
}

export interface FollowupSchedule {
  daysRemaining: number;
  recommendedIntervalDays: number; // 2-4 (High), 5-7 (Moderate), 7-14 (Low)
  targetDate: string; // "September 9, 2026"
  status: 'pending' | 'due' | 'completed' | 'overdue';
  reason: string;
}

export interface FullFieldAnalysis {
  id: string;
  fieldId: string;
  timestamp: string;
  condition: DiseaseCondition;
  pest: PestObservation;
  weather: WeatherCondition;
  cropStage: CropGrowthStageInfo;
  risk: RiskResult;
  actions: ActionRecommendation[];
  followup: FollowupSchedule;
  comparisonStatus?: 'IMPROVING' | 'STABLE' | 'WORSENING';
}

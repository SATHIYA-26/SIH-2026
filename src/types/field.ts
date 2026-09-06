import { FullFieldAnalysis } from './analysis';

export interface InspectionPoint {
  id: string;
  lat: number;
  lng: number;
  label: string;
  type: 'disease' | 'pest' | 'healthy' | 'warning';
  diseaseName?: string;
  pestCount?: number;
  severity: 'high' | 'moderate' | 'low';
  lastChecked: string;
}

export interface FieldPolygon {
  center: [number, number];
  bounds: [number, number][];
}

export interface FollowUpRecord {
  id: string;
  followUpNumber: number; // e.g. 1, 2, 3
  date: string;
  displayDate: string;
  treatmentApplied: 'YES' | 'PARTIAL' | 'NO';
  treatmentNotes?: string;
  leafImageUrl: string;
  symptomObserved: string;
  pestType: string;
  currentPestCount: number;
  previousPestCount?: number;
  pestDelta?: number;
  riskProbability: number;
  previousRiskProbability?: number;
  riskDelta?: number;
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH';
  statusVerdict: string; // "Fine / Recovered", "Improving", "Critical Outbreak", etc.
  agronomicAdvisory: string;
  nextCheckDays: number;
}

export interface Field {
  id: string;
  name: string; // "Cotton Field A"
  crop: string; // "Cotton"
  variety?: string; // "Bt Cotton RCH-659"
  areaAcres: number; // 3.5
  plantingDate: string; // "2026-06-23"
  daysSincePlanting: number;
  estimatedGrowthStage: string; // "Flowering & Boll Development"
  currentConditionStatus: string; // "Bacterial Blight Detected"
  riskProbability: number; // 0.68
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH';
  pestPressureSummary: string; // "18 aphids ↑ from 10"
  lastCheckedDate: string; // "Today", "2026-09-04"
  nextCheckDays: number; // 5
  locationName: string; // "Plot 4B, Vidarbha Ag Zone"
  polygon: FieldPolygon;
  inspectionPoints: InspectionPoint[];
  latestAnalysis: FullFieldAnalysis;
  previousAnalysis?: FullFieldAnalysis;
  followUpCount: number; // e.g. 2
  followUpHistory: FollowUpRecord[];
}

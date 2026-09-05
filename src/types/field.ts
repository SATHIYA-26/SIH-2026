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
}

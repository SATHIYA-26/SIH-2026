export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH';

export interface RiskDriver {
  id: string;
  title: string;
  value: string;
  impact: 'high' | 'medium' | 'low';
  description?: string;
}

export interface RiskResult {
  probability: number; // 0.0 - 1.0 (e.g. 0.68)
  level: RiskLevel;
  horizonDays: number; // typically 7
  summary: string;
  drivers: RiskDriver[];
  trendDirection: 'increasing' | 'stable' | 'decreasing';
  previousProbability?: number;
}

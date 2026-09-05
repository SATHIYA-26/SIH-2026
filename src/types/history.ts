export interface HistoryTimelineEntry {
  id: string;
  fieldId: string;
  date: string; // e.g. "2026-09-04"
  displayDate: string; // e.g. "04 SEP"
  title: string;
  category: 'planting' | 'check' | 'detection' | 'risk_change' | 'followup' | 'treatment_scouting';
  conditionSummary: string;
  riskProbability: number;
  pestCount: number;
  weatherSummary: string;
  notes?: string;
}

export interface TrendDataPoint {
  date: string;
  timestamp: string;
  riskProbability: number; // 0-100
  pestCount: number;
  healthyProb: number;
  bacterialProb: number;
  curlVirusProb: number;
  fusariumProb: number;
  humidity: number;
  rainfall: number;
  temperature: number;
  eventLabel?: string;
}

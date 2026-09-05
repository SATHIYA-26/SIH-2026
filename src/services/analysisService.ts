import { FullFieldAnalysis } from '../types/analysis';
import { DEMO_SCENARIO_HIGH_RISK } from '../data/mockData';
import { apiClient } from './api';

export interface AnalysisRequestPayload {
  fieldId: string;
  image?: File | null;
  pestType: string;
  currentPestCount: number;
  previousPestCount?: number;
  plantingDate: string;
}

export const analysisService = {
  async submitAnalysis(payload: AnalysisRequestPayload): Promise<FullFieldAnalysis> {
    try {
      const formData = new FormData();
      formData.append('fieldId', payload.fieldId);
      formData.append('pestType', payload.pestType);
      formData.append('currentPestCount', String(payload.currentPestCount));
      if (payload.previousPestCount) {
        formData.append('previousPestCount', String(payload.previousPestCount));
      }
      formData.append('plantingDate', payload.plantingDate);
      if (payload.image) {
        formData.append('image', payload.image);
      }

      const res = await apiClient.post<FullFieldAnalysis>('/analysis', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return res.data;
    } catch {
      // Return realistic structure
      return DEMO_SCENARIO_HIGH_RISK.latestAnalysis;
    }
  }
};

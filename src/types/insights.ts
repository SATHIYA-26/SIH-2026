export interface ModelMetricSummary {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  rocAuc: number;
  prAuc: number;
  brierScore: number;
  testSetSize: number;
  validationScheme: string;
}

export interface ConfusionMatrixData {
  labels: string[];
  matrix: number[][]; // normalized or raw counts
}

export interface CalibrationCurvePoint {
  binMidpoint: number; // e.g. 0.1, 0.2 ...
  observedFrequency: number;
  predictedProbability: number;
  sampleCount: number;
}

export interface FeatureImportanceItem {
  feature: string;
  category: 'Weather' | 'Pest' | 'Disease Signal' | 'Crop Phenology' | 'Temporal History';
  importance: number; // 0.0 - 1.0
  description: string;
}

export interface AdminModelInsights {
  diseaseModel: {
    name: string;
    classes: string[];
    metrics: {
      accuracy: number;
      macroF1: number;
      weightedPrecision: number;
      weightedRecall: number;
    };
    perClassMetrics: {
      className: string;
      precision: number;
      recall: number;
      f1: number;
      support: number;
    }[];
    confusionMatrix: ConfusionMatrixData;
  };
  riskModel: {
    name: string;
    targetHorizon: string;
    metrics: ModelMetricSummary;
    calibrationPoints: CalibrationCurvePoint[];
    rocCurve: { fpr: number; tpr: number }[];
    featureContributions: FeatureImportanceItem[];
  };
}

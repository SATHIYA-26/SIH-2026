import { Field } from '../types/field';
import { FieldAlert } from '../types/alert';
import { HistoryTimelineEntry, TrendDataPoint } from '../types/history';

export const COTTON_LEAF_BACTERIAL_IMAGE = '/src/assets/cotton_bacterial_blight.jpg';
export const COTTON_LEAF_HEALTHY_IMAGE = '/src/assets/cotton_healthy.jpg';

export const DEMO_SCENARIO_HIGH_RISK: Field = {
  id: 'field-cotton-a',
  name: 'Chennai North Cotton Field A',
  crop: 'Cotton',
  variety: 'Bt Cotton RCH-659',
  areaAcres: 3.5,
  plantingDate: '2026-06-23',
  daysSincePlanting: 73,
  estimatedGrowthStage: 'Flowering & Boll Development',
  currentConditionStatus: 'Bacterial Blight Detected',
  riskProbability: 0.68,
  riskLevel: 'HIGH',
  pestPressureSummary: '18 aphids ↑ from 10',
  lastCheckedDate: 'Today',
  nextCheckDays: 4,
  followUpCount: 1,
  followUpHistory: [
    {
      id: 'fu-hist-001',
      followUpNumber: 1,
      date: '2026-08-30',
      displayDate: '30 Aug 2026',
      treatmentApplied: 'PARTIAL',
      treatmentNotes: 'Spot rogueing of infected leaves done in Zone NE-2',
      leafImageUrl: COTTON_LEAF_BACTERIAL_IMAGE,
      symptomObserved: 'Bacterial Blight Lesions',
      pestType: 'Cotton Aphid',
      currentPestCount: 10,
      previousPestCount: 6,
      pestDelta: 4,
      riskProbability: 0.55,
      previousRiskProbability: 0.38,
      riskDelta: 0.17,
      riskLevel: 'MODERATE',
      statusVerdict: 'Moderate Risk / Partial Response',
      agronomicAdvisory: 'Maintain aphid trap monitoring and prepare Copper Oxychloride foliar spray.',
      nextCheckDays: 5
    }
  ],
  locationName: 'Ambattur Valley Sector 4, Chennai, Tamil Nadu',
  polygon: {
    center: [13.1143, 80.1548],
    bounds: [
      [13.1170, 80.1520],
      [13.1180, 80.1580],
      [13.1110, 80.1590],
      [13.1105, 80.1525],
    ]
  },
  inspectionPoints: [
    {
      id: 'pt-1',
      lat: 13.1150,
      lng: 13.1160,
      label: 'Zone NE-2 (Hotspot)',
      type: 'disease',
      diseaseName: 'Bacterial Blight',
      pestCount: 18,
      severity: 'high',
      lastChecked: 'Today 09:30 AM'
    },
    {
      id: 'pt-2',
      lat: 13.1135,
      lng: 80.1530,
      label: 'Zone SW-1',
      type: 'pest',
      pestCount: 12,
      severity: 'moderate',
      lastChecked: 'Today 09:50 AM'
    },
    {
      id: 'pt-3',
      lat: 13.1160,
      lng: 80.1525,
      label: 'Zone NW-4',
      type: 'healthy',
      pestCount: 4,
      severity: 'low',
      lastChecked: 'Today 10:15 AM'
    },
    {
      id: 'pt-4',
      lat: 13.1120,
      lng: 80.1565,
      label: 'Zone SE-3',
      type: 'warning',
      diseaseName: 'Suspected lesions',
      pestCount: 9,
      severity: 'moderate',
      lastChecked: 'Today 10:35 AM'
    }
  ],
  latestAnalysis: {
    id: 'ana-001',
    fieldId: 'field-cotton-a',
    timestamp: '2026-09-04T09:30:00Z',
    condition: {
      status: 'Bacterial Blight Detected',
      confidence: 0.913,
      topClass: 'bacterial',
      probabilities: {
        healthy: 0.021,
        bacterial: 0.913,
        curl_virus: 0.041,
        fusarium: 0.025
      },
      needsAttention: true,
      leafImageUrl: COTTON_LEAF_BACTERIAL_IMAGE,
      isLowConfidence: false
    },
    pest: {
      pestType: 'Cotton Aphid',
      currentCount: 18,
      previousCount: 10,
      pestPressure: 'Increasing'
    },
    weather: {
      temperature: 29,
      humidity: 86,
      recentRainfall: 12,
      rainfallTrend: '12 mm in last 48h',
      daysSinceRain: 1,
      conditionDescription: 'Humid coastal monsoon, overcast with intermittent showers',
      forecast: [
        { day: 'Fri', temp: 29, humidity: 86, rainProbability: 70 },
        { day: 'Sat', temp: 30, humidity: 84, rainProbability: 60 },
        { day: 'Sun', temp: 28, humidity: 88, rainProbability: 75 },
        { day: 'Mon', temp: 29, humidity: 82, rainProbability: 40 },
        { day: 'Tue', temp: 31, humidity: 79, rainProbability: 30 }
      ]
    },
    cropStage: {
      cropName: 'Cotton',
      plantingDate: '23 June 2026',
      daysSincePlanting: 73,
      stageName: 'Flowering & Boll Development',
      stageProgressPercent: 46,
      totalCycleDays: 160,
      stages: [
        { name: 'Planting & Germination', startDay: 0, endDay: 15, isCurrent: false, isCompleted: true },
        { name: 'Vegetative Growth', startDay: 16, endDay: 45, isCurrent: false, isCompleted: true },
        { name: 'Squaring / Bud Formation', startDay: 46, endDay: 65, isCurrent: false, isCompleted: true },
        { name: 'Flowering & Boll Development', startDay: 66, endDay: 120, isCurrent: true, isCompleted: false },
        { name: 'Maturity / Harvest', startDay: 121, endDay: 160, isCurrent: false, isCompleted: false }
      ]
    },
    risk: {
      probability: 0.68,
      level: 'HIGH',
      horizonDays: 7,
      summary: 'Increased chance of disease or pest problems over the next 7 days in Chennai North plot.',
      trendDirection: 'increasing',
      previousProbability: 0.55,
      drivers: [
        { id: 'd1', title: 'High Humidity', value: '86% RH', impact: 'high', description: 'Prolonged coastal leaf wetness promotes bacterial propagation' },
        { id: 'd2', title: 'Recent Rainfall', value: '12 mm', impact: 'high', description: 'Rain splash can disperse bacterial blight spores across nearby foliage' },
        { id: 'd3', title: 'Rising Pest Pressure', value: '18 aphids (↑ from 10)', impact: 'medium', description: 'Piercing-sucking feeding creates entry wounds for secondary pathogens' },
        { id: 'd4', title: 'Current Disease Signal', value: 'Bacterial symptoms detected', impact: 'high', description: 'Active inoculum present in the canopy' },
        { id: 'd5', title: 'Crop Growth Stage', value: 'Flowering & Boll Development', impact: 'medium', description: 'High canopy density and physiological demand increase vulnerability' }
      ]
    },
    actions: [
      {
        id: 'act-1',
        stepNumber: 1,
        action: 'Inspect affected plants in Zone NE-2',
        detail: 'Verify symptom boundaries and tag symptomatic leaves without tearing healthy tissue.',
        type: 'inspection'
      },
      {
        id: 'act-2',
        stepNumber: 2,
        action: 'Check nearby plants for similar water-soaked lesions',
        detail: 'Scout a 5-meter radius around the identified hotspot to map disease spread.',
        type: 'scouting' as any
      },
      {
        id: 'act-3',
        stepNumber: 3,
        action: 'Monitor aphid population closely',
        detail: 'Check leaf undersides on 20 random plants across the transect.',
        type: 'monitoring'
      },
      {
        id: 'act-4',
        stepNumber: 4,
        action: 'Recheck the field according to the recommended schedule',
        detail: 'Schedule follow-up within 4 days to determine whether leaf spots are stabilizing.',
        type: 'followup'
      }
    ],
    followup: {
      daysRemaining: 4,
      recommendedIntervalDays: 4,
      targetDate: 'September 9, 2026',
      status: 'pending',
      reason: 'High risk status requires 2–4 day scouting check'
    }
  },
  previousAnalysis: {
    id: 'ana-000',
    fieldId: 'field-cotton-a',
    timestamp: '2026-08-30T10:15:00Z',
    condition: {
      status: 'Mild Bacterial Lesions',
      confidence: 0.842,
      topClass: 'bacterial',
      probabilities: {
        healthy: 0.08,
        bacterial: 0.842,
        curl_virus: 0.045,
        fusarium: 0.033
      },
      needsAttention: true,
      leafImageUrl: COTTON_LEAF_BACTERIAL_IMAGE,
      isLowConfidence: false
    },
    pest: {
      pestType: 'Cotton Aphid',
      currentCount: 10,
      pestPressure: 'Moderate' as any
    },
    weather: {
      temperature: 31,
      humidity: 78,
      recentRainfall: 4,
      rainfallTrend: '4 mm',
      daysSinceRain: 3,
      conditionDescription: 'Partly cloudy',
      forecast: []
    },
    cropStage: {
      cropName: 'Cotton',
      plantingDate: '23 June 2026',
      daysSincePlanting: 68,
      stageName: 'Flowering & Boll Development',
      stageProgressPercent: 42,
      totalCycleDays: 160,
      stages: []
    },
    risk: {
      probability: 0.55,
      level: 'MODERATE',
      horizonDays: 7,
      summary: 'Moderate risk outlook with building humidity.',
      trendDirection: 'increasing',
      drivers: []
    },
    actions: [],
    followup: {
      daysRemaining: 0,
      recommendedIntervalDays: 5,
      targetDate: 'September 4, 2026',
      status: 'completed',
      reason: 'Regular 5-day cycle'
    }
  }
};

export const DEMO_SCENARIO_IMPROVING: Field = {
  ...DEMO_SCENARIO_HIGH_RISK,
  currentConditionStatus: 'Symptoms Stabilized / Healing',
  riskProbability: 0.41,
  riskLevel: 'MODERATE',
  pestPressureSummary: '10 aphids ↓ from 18',
  lastCheckedDate: 'Today',
  nextCheckDays: 7,
  latestAnalysis: {
    ...DEMO_SCENARIO_HIGH_RISK.latestAnalysis,
    condition: {
      status: 'Symptoms Stabilized (Low Active Pathogen)',
      confidence: 0.785,
      topClass: 'healthy',
      probabilities: {
        healthy: 0.62,
        bacterial: 0.28,
        curl_virus: 0.06,
        fusarium: 0.04
      },
      needsAttention: false,
      leafImageUrl: COTTON_LEAF_HEALTHY_IMAGE,
      isLowConfidence: false
    },
    pest: {
      pestType: 'Cotton Aphid',
      currentCount: 10,
      previousCount: 18,
      pestPressure: 'Decreasing'
    },
    weather: {
      temperature: 30,
      humidity: 68,
      recentRainfall: 0,
      rainfallTrend: '0 mm in last 72h',
      daysSinceRain: 4,
      conditionDescription: 'Sunny and dry with pleasant sea breeze',
      forecast: [
        { day: 'Today', temp: 30, humidity: 68, rainProbability: 10 },
        { day: 'Tomorrow', temp: 31, humidity: 65, rainProbability: 5 }
      ]
    },
    risk: {
      probability: 0.41,
      level: 'MODERATE',
      horizonDays: 7,
      summary: 'Risk is receding due to lower humidity and reduced pest pressure.',
      trendDirection: 'decreasing',
      previousProbability: 0.68,
      drivers: [
        { id: 'd1', title: 'Declining Humidity', value: '68% RH', impact: 'low', description: 'Canopy is drying out effectively' },
        { id: 'd2', title: 'Reduced Pest Pressure', value: '10 aphids (↓ from 18)', impact: 'low', description: 'Foliage injury rate has slowed' },
        { id: 'd3', title: 'No Recent Rainfall', value: '0 mm past 4 days', impact: 'low', description: 'Reduced water splash transmission' }
      ]
    },
    comparisonStatus: 'IMPROVING',
    followup: {
      daysRemaining: 7,
      recommendedIntervalDays: 7,
      targetDate: 'September 12, 2026',
      status: 'pending',
      reason: 'Condition improving; moderate 7-day check scheduled'
    }
  },
  previousAnalysis: DEMO_SCENARIO_HIGH_RISK.latestAnalysis
};

export const DEMO_SCENARIO_LOW_RISK: Field = {
  id: 'field-cotton-b',
  name: 'Guindy Research Cotton Plot B',
  crop: 'Cotton',
  variety: 'Bt Cotton DCH-32',
  areaAcres: 2.8,
  plantingDate: '2026-07-02',
  daysSincePlanting: 64,
  estimatedGrowthStage: 'Squaring / Bud Formation',
  currentConditionStatus: 'Healthy Foliage',
  riskProbability: 0.18,
  riskLevel: 'LOW',
  pestPressureSummary: '3 aphids (Low)',
  lastCheckedDate: 'Yesterday',
  nextCheckDays: 10,
  followUpCount: 0,
  followUpHistory: [],
  locationName: 'Guindy Agro Research Complex, Chennai, Tamil Nadu',
  polygon: {
    center: [13.0067, 80.2206],
    bounds: [
      [13.0090, 80.2180],
      [13.0095, 80.2230],
      [13.0040, 80.2225],
      [13.0035, 80.2175],
    ]
  },
  inspectionPoints: [
    {
      id: 'pt-b1',
      lat: 13.0070,
      lng: 80.2210,
      label: 'Center Plot',
      type: 'healthy',
      pestCount: 3,
      severity: 'low',
      lastChecked: 'Yesterday'
    }
  ],
  latestAnalysis: {
    id: 'ana-002',
    fieldId: 'field-cotton-b',
    timestamp: '2026-09-03T11:00:00Z',
    condition: {
      status: 'Healthy Foliage',
      confidence: 0.945,
      topClass: 'healthy',
      probabilities: {
        healthy: 0.945,
        bacterial: 0.021,
        curl_virus: 0.018,
        fusarium: 0.016
      },
      needsAttention: false,
      leafImageUrl: COTTON_LEAF_HEALTHY_IMAGE
    },
    pest: {
      pestType: 'Cotton Aphid',
      currentCount: 3,
      previousCount: 4,
      pestPressure: 'Low'
    },
    weather: {
      temperature: 28,
      humidity: 62,
      recentRainfall: 0,
      rainfallTrend: '0 mm in last 5 days',
      daysSinceRain: 5,
      conditionDescription: 'Clear coastal skies and dry air',
      forecast: []
    },
    cropStage: {
      cropName: 'Cotton',
      plantingDate: '02 July 2026',
      daysSincePlanting: 64,
      stageName: 'Squaring / Bud Formation',
      stageProgressPercent: 88,
      totalCycleDays: 160,
      stages: []
    },
    risk: {
      probability: 0.18,
      level: 'LOW',
      horizonDays: 7,
      summary: 'Optimal field environment with negligible disease risk in the next 7 days.',
      trendDirection: 'stable',
      drivers: [
        { id: 'd1', title: 'Low Relative Humidity', value: '62% RH', impact: 'low', description: 'Unfavorable for fungal and bacterial spores' },
        { id: 'd2', title: 'Minimal Pest Count', value: '3 aphids', impact: 'low', description: 'Below economic scouting threshold' }
      ]
    },
    actions: [
      {
        id: 'act-b1',
        stepNumber: 1,
        action: 'Maintain standard visual inspection routine',
        detail: 'Check perimeter rows for early pest entry during morning walks.',
        type: 'inspection'
      }
    ],
    followup: {
      daysRemaining: 10,
      recommendedIntervalDays: 10,
      targetDate: 'September 15, 2026',
      status: 'pending',
      reason: 'Low risk profile permits extended 7–14 day cycle'
    }
  }
};

export const DEMO_SCENARIO_WORSENING: Field = {
  ...DEMO_SCENARIO_HIGH_RISK,
  currentConditionStatus: 'Bacterial Blight & Vascular Spread',
  riskProbability: 0.89,
  riskLevel: 'HIGH',
  pestPressureSummary: '28 aphids ↑ from 18',
  lastCheckedDate: 'Today',
  nextCheckDays: 2,
  latestAnalysis: {
    ...DEMO_SCENARIO_HIGH_RISK.latestAnalysis,
    condition: {
      status: 'Severe Bacterial Blight & Vascular Symptoms',
      confidence: 0.942,
      topClass: 'bacterial',
      probabilities: {
        healthy: 0.008,
        bacterial: 0.942,
        curl_virus: 0.022,
        fusarium: 0.028
      },
      needsAttention: true,
      leafImageUrl: COTTON_LEAF_BACTERIAL_IMAGE
    },
    pest: {
      pestType: 'Cotton Aphid',
      currentCount: 28,
      previousCount: 18,
      pestPressure: 'Increasing'
    },
    weather: {
      temperature: 28,
      humidity: 93,
      recentRainfall: 34,
      rainfallTrend: '34 mm in last 24h',
      daysSinceRain: 0,
      conditionDescription: 'Continuous heavy rainfall and saturated coastal soil',
      forecast: []
    },
    risk: {
      probability: 0.89,
      level: 'HIGH',
      horizonDays: 7,
      summary: 'High risk of acute canopy outbreak within 48–72 hours.',
      trendDirection: 'increasing',
      previousProbability: 0.68,
      drivers: [
        { id: 'd1', title: 'Very High Humidity', value: '93% RH', impact: 'high', description: 'Constant free water on foliage' },
        { id: 'd2', title: 'Heavy Rainfall', value: '34 mm', impact: 'high', description: 'Intense rain splash accelerating dispersion' },
        { id: 'd3', title: 'Surging Pest Pressure', value: '28 aphids (↑ from 18)', impact: 'high', description: 'Rapid honeydew secretion and vector transmission' }
      ]
    },
    comparisonStatus: 'WORSENING',
    followup: {
      daysRemaining: 2,
      recommendedIntervalDays: 2,
      targetDate: 'September 6, 2026',
      status: 'pending',
      reason: 'Urgent check due to acute worsening risk'
    }
  },
  previousAnalysis: DEMO_SCENARIO_HIGH_RISK.latestAnalysis
};

export const ALL_FIELDS: Field[] = [
  DEMO_SCENARIO_HIGH_RISK,
  DEMO_SCENARIO_LOW_RISK,
  {
    id: 'field-cotton-c',
    name: 'Tambaram Green Cotton Parcel C',
    crop: 'Cotton',
    variety: 'Bt Cotton Bunny',
    areaAcres: 4.2,
    plantingDate: '2026-06-15',
    daysSincePlanting: 81,
    estimatedGrowthStage: 'Flowering & Boll Development',
    currentConditionStatus: 'Mild Curl Virus Observed',
    riskProbability: 0.44,
    riskLevel: 'MODERATE',
    pestPressureSummary: '8 Whiteflies (Moderate)',
    lastCheckedDate: '2 days ago',
    nextCheckDays: 5,
    followUpCount: 0,
    followUpHistory: [],
    locationName: 'Tambaram Agritech Zone, Chennai, Tamil Nadu',
    polygon: {
      center: [12.9249, 80.1000],
      bounds: [
        [12.9270, 80.0970],
        [12.9280, 80.1030],
        [12.9220, 80.1020],
        [12.9215, 80.0965],
      ]
    },
    inspectionPoints: [],
    latestAnalysis: {
      ...DEMO_SCENARIO_HIGH_RISK.latestAnalysis,
      fieldId: 'field-cotton-c',
      condition: {
        status: 'Suspected Leaf Curl Virus',
        confidence: 0.764,
        topClass: 'curl_virus',
        probabilities: {
          healthy: 0.12,
          bacterial: 0.08,
          curl_virus: 0.764,
          fusarium: 0.036
        },
        needsAttention: true,
        leafImageUrl: COTTON_LEAF_BACTERIAL_IMAGE
      },
      pest: {
        pestType: 'Whitefly',
        currentCount: 8,
        previousCount: 6,
        pestPressure: 'Increasing'
      },
      risk: {
        probability: 0.44,
        level: 'MODERATE',
        horizonDays: 7,
        summary: 'Moderate risk driven by whitefly vector presence and warm coastal temperatures.',
        trendDirection: 'increasing',
        drivers: [
          { id: 'c1', title: 'Whitefly Population', value: '8 count', impact: 'medium', description: 'Active vector for geminivirus' },
          { id: 'c2', title: 'Warm Canopy Temp', value: '32°C', impact: 'medium', description: 'Accelerates vector reproduction' }
        ]
      },
      followup: {
        daysRemaining: 5,
        recommendedIntervalDays: 5,
        targetDate: 'September 10, 2026',
        status: 'pending',
        reason: 'Moderate risk 5-day cycle'
      }
    }
  },
  {
    id: 'field-cotton-d',
    name: 'Avadi Agro Cotton Field D',
    crop: 'Cotton',
    variety: 'Suraj Cotton',
    areaAcres: 3.0,
    plantingDate: '2026-06-28',
    daysSincePlanting: 68,
    estimatedGrowthStage: 'Squaring / Bud Formation',
    currentConditionStatus: 'Healthy Foliage',
    riskProbability: 0.22,
    riskLevel: 'LOW',
    pestPressureSummary: '4 Aphids (Low)',
    lastCheckedDate: '3 days ago',
    nextCheckDays: 8,
    followUpCount: 0,
    followUpHistory: [],
    locationName: 'Avadi Precision Sector 4, Chennai, Tamil Nadu',
    polygon: {
      center: [13.1180, 80.1000],
      bounds: [
        [13.1200, 80.0980],
        [13.1210, 80.1020],
        [13.1160, 80.1015],
        [13.1155, 80.0975],
      ]
    },
    inspectionPoints: [],
    latestAnalysis: {
      ...DEMO_SCENARIO_LOW_RISK.latestAnalysis,
      fieldId: 'field-cotton-d',
      condition: {
        ...DEMO_SCENARIO_LOW_RISK.latestAnalysis.condition,
        leafImageUrl: COTTON_LEAF_HEALTHY_IMAGE
      },
      risk: {
        probability: 0.22,
        level: 'LOW',
        horizonDays: 7,
        summary: 'Low risk with good aeration across Avadi parcel.',
        trendDirection: 'stable',
        drivers: []
      },
      followup: {
        daysRemaining: 8,
        recommendedIntervalDays: 8,
        targetDate: 'September 13, 2026',
        status: 'pending',
        reason: 'Low risk 8-day inspection cycle'
      }
    }
  }
];

export const MOCK_ALERTS: FieldAlert[] = [
  {
    id: 'alt-1',
    fieldId: 'field-cotton-a',
    fieldName: 'Chennai North Cotton Field A',
    type: 'HIGH_RISK',
    title: 'High Risk Alert: 7-Day Outbreak Risk Reached 68%',
    description: 'High coastal humidity (86%) and recent rainfall (12mm) have increased bacterial blight propagation risk.',
    severity: 'critical',
    timestamp: 'Today, 09:35 AM',
    isRead: false,
    actionLabel: 'Check Field',
    actionPath: '/check-field?fieldId=field-cotton-a'
  },
  {
    id: 'alt-2',
    fieldId: 'field-cotton-c',
    fieldName: 'Tambaram Green Cotton Parcel C',
    type: 'FOLLOWUP_DUE',
    title: 'Follow-up Due: Whitefly & Curl Virus Check',
    description: 'Recommended 5-day scouting window is approaching in 2 days.',
    severity: 'warning',
    timestamp: 'Yesterday, 04:15 PM',
    isRead: false,
    actionLabel: 'Schedule Scout',
    actionPath: '/followups'
  },
  {
    id: 'alt-3',
    fieldId: 'field-cotton-b',
    fieldName: 'Guindy Research Cotton Plot B',
    type: 'RISK_IMPROVING',
    title: 'Field Health Steady: Low Risk Confirmed',
    description: 'Dry conditions and low pest pressure keep 7-day risk at 18%.',
    severity: 'success',
    timestamp: '2 days ago',
    isRead: true,
    actionLabel: 'View Field',
    actionPath: '/fields'
  }
];

export const MOCK_FIELD_HISTORY: HistoryTimelineEntry[] = [
  {
    id: 'hist-1',
    fieldId: 'field-cotton-a',
    date: '2026-06-23',
    displayDate: '23 JUN',
    title: 'Field Planted',
    category: 'planting',
    conditionSummary: 'Bt Cotton RCH-659 sown across 3.5 acres in Ambattur',
    riskProbability: 0.05,
    pestCount: 0,
    weatherSummary: 'Pre-monsoon sowing, 32°C, dry'
  },
  {
    id: 'hist-2',
    fieldId: 'field-cotton-a',
    date: '2026-08-01',
    displayDate: '01 AUG',
    title: 'Routine Field Check #1',
    category: 'check',
    conditionSummary: 'Healthy canopy, uniform vegetative growth',
    riskProbability: 0.15,
    pestCount: 2,
    weatherSummary: '28°C, 65% RH'
  },
  {
    id: 'hist-3',
    fieldId: 'field-cotton-a',
    date: '2026-08-08',
    displayDate: '08 AUG',
    title: 'Bacterial Symptoms Detected',
    category: 'detection',
    conditionSummary: 'Isolated angular water-soaked spots in Zone NE-2',
    riskProbability: 0.38,
    pestCount: 6,
    weatherSummary: '29°C, 75% RH, 8 mm rain'
  },
  {
    id: 'hist-4',
    fieldId: 'field-cotton-a',
    date: '2026-08-15',
    displayDate: '15 AUG',
    title: 'Risk Increased to 55%',
    category: 'risk_change',
    conditionSummary: 'Aphid population doubled to 10; leaf wetness elevated',
    riskProbability: 0.55,
    pestCount: 10,
    weatherSummary: '30°C, 82% RH, intermittent showers'
  },
  {
    id: 'hist-5',
    fieldId: 'field-cotton-a',
    date: '2026-08-30',
    displayDate: '30 AUG',
    title: 'Follow-up Completed',
    category: 'followup',
    conditionSummary: 'Targeted scouting completed. Spot rogueing executed.',
    riskProbability: 0.55,
    pestCount: 10,
    weatherSummary: '31°C, 78% RH'
  },
  {
    id: 'hist-6',
    fieldId: 'field-cotton-a',
    date: '2026-09-04',
    displayDate: '04 SEP',
    title: 'Current Check: High Outbreak Risk',
    category: 'check',
    conditionSummary: 'Bacterial Blight confidence 91.3%, Aphids 18. 7-day risk 68%.',
    riskProbability: 0.68,
    pestCount: 18,
    weatherSummary: '29°C, 86% RH, 12 mm rainfall'
  }
];

export const MOCK_TREND_DATA: TrendDataPoint[] = [
  { date: 'Aug 20', timestamp: '2026-08-20', riskProbability: 24, pestCount: 4, healthyProb: 88, bacterialProb: 8, curlVirusProb: 2, fusariumProb: 2, humidity: 65, rainfall: 0, temperature: 31 },
  { date: 'Aug 24', timestamp: '2026-08-24', riskProbability: 31, pestCount: 6, healthyProb: 76, bacterialProb: 18, curlVirusProb: 3, fusariumProb: 3, humidity: 72, rainfall: 4, temperature: 30 },
  { date: 'Aug 28', timestamp: '2026-08-28', riskProbability: 42, pestCount: 8, healthyProb: 55, bacterialProb: 38, curlVirusProb: 4, fusariumProb: 3, humidity: 78, rainfall: 6, temperature: 30 },
  { date: 'Aug 30', timestamp: '2026-08-30', riskProbability: 55, pestCount: 10, healthyProb: 32, bacterialProb: 61, curlVirusProb: 4, fusariumProb: 3, humidity: 82, rainfall: 8, temperature: 29 },
  { date: 'Sep 01', timestamp: '2026-09-01', riskProbability: 59, pestCount: 14, healthyProb: 18, bacterialProb: 75, curlVirusProb: 4, fusariumProb: 3, humidity: 84, rainfall: 10, temperature: 29 },
  { date: 'Sep 04', timestamp: '2026-09-04', riskProbability: 68, pestCount: 18, healthyProb: 2, bacterialProb: 91, curlVirusProb: 4, fusariumProb: 3, humidity: 86, rainfall: 12, temperature: 29, eventLabel: 'Current Check' }
];

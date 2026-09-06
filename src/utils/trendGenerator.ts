import { Field } from '../types/field';
import { TrendDataPoint } from '../types/history';

export function getFieldTrendData(
  field: Field,
  range: '7 Days' | '14 Days' | '30 Days' = '7 Days'
): TrendDataPoint[] {
  const currentRisk = Math.round((field.riskProbability || 0.3) * 100);
  const currentPest = field.latestAnalysis?.pest?.currentCount || 4;
  const currentTemp = field.latestAnalysis?.weather?.temperature || 29;
  const currentHumidity = field.latestAnalysis?.weather?.humidity || 75;
  const currentRain = field.latestAnalysis?.weather?.recentRainfall || 0;

  const probs = field.latestAnalysis?.condition?.probabilities || {
    healthy: 0.85,
    bacterial: 0.05,
    curl_virus: 0.05,
    fusarium: 0.05,
  };

  const healthyPct = Math.round(probs.healthy * 100);
  const bacterialPct = Math.round(probs.bacterial * 100);
  const curlPct = Math.round(probs.curl_virus * 100);
  const fusariumPct = Math.round(probs.fusarium * 100);

  // Field-specific tailored series
  if (field.id === 'field-cotton-a') {
    const fullSeries: TrendDataPoint[] = [
      { date: 'Aug 20', timestamp: '2026-08-20', riskProbability: 24, pestCount: 4, healthyProb: 88, bacterialProb: 8, curlVirusProb: 2, fusariumProb: 2, humidity: 65, rainfall: 0, temperature: 31 },
      { date: 'Aug 24', timestamp: '2026-08-24', riskProbability: 31, pestCount: 6, healthyProb: 76, bacterialProb: 18, curlVirusProb: 3, fusariumProb: 3, humidity: 72, rainfall: 4, temperature: 30 },
      { date: 'Aug 28', timestamp: '2026-08-28', riskProbability: 42, pestCount: 8, healthyProb: 55, bacterialProb: 38, curlVirusProb: 4, fusariumProb: 3, humidity: 78, rainfall: 6, temperature: 30 },
      { date: 'Aug 30', timestamp: '2026-08-30', riskProbability: 55, pestCount: 10, healthyProb: 32, bacterialProb: 61, curlVirusProb: 4, fusariumProb: 3, humidity: 82, rainfall: 8, temperature: 29 },
      { date: 'Sep 01', timestamp: '2026-09-01', riskProbability: 59, pestCount: 14, healthyProb: 18, bacterialProb: 75, curlVirusProb: 4, fusariumProb: 3, humidity: 84, rainfall: 10, temperature: 29 },
      { date: 'Sep 04', timestamp: '2026-09-04', riskProbability: currentRisk, pestCount: currentPest, healthyProb: healthyPct, bacterialProb: bacterialPct, curlVirusProb: curlPct, fusariumProb: fusariumPct, humidity: currentHumidity, rainfall: currentRain, temperature: currentTemp, eventLabel: 'Current Check' }
    ];
    if (range === '7 Days') return fullSeries.slice(-4);
    if (range === '14 Days') return fullSeries.slice(-5);
    return fullSeries;
  }

  if (field.id === 'field-cotton-b') {
    const fullSeries: TrendDataPoint[] = [
      { date: 'Aug 20', timestamp: '2026-08-20', riskProbability: 12, pestCount: 2, healthyProb: 96, bacterialProb: 2, curlVirusProb: 1, fusariumProb: 1, humidity: 58, rainfall: 0, temperature: 30 },
      { date: 'Aug 24', timestamp: '2026-08-24', riskProbability: 14, pestCount: 2, healthyProb: 95, bacterialProb: 2, curlVirusProb: 2, fusariumProb: 1, humidity: 60, rainfall: 0, temperature: 29 },
      { date: 'Aug 28', timestamp: '2026-08-28', riskProbability: 15, pestCount: 3, healthyProb: 94, bacterialProb: 3, curlVirusProb: 2, fusariumProb: 1, humidity: 61, rainfall: 0, temperature: 28 },
      { date: 'Aug 30', timestamp: '2026-08-30', riskProbability: 16, pestCount: 3, healthyProb: 95, bacterialProb: 2, curlVirusProb: 2, fusariumProb: 1, humidity: 62, rainfall: 0, temperature: 28 },
      { date: 'Sep 01', timestamp: '2026-09-01', riskProbability: 17, pestCount: 3, healthyProb: 94, bacterialProb: 2, curlVirusProb: 2, fusariumProb: 2, humidity: 62, rainfall: 0, temperature: 28 },
      { date: 'Sep 04', timestamp: '2026-09-04', riskProbability: currentRisk, pestCount: currentPest, healthyProb: healthyPct, bacterialProb: bacterialPct, curlVirusProb: curlPct, fusariumProb: fusariumPct, humidity: currentHumidity, rainfall: currentRain, temperature: currentTemp, eventLabel: 'Current Check' }
    ];
    if (range === '7 Days') return fullSeries.slice(-4);
    if (range === '14 Days') return fullSeries.slice(-5);
    return fullSeries;
  }

  if (field.id === 'field-cotton-c') {
    const fullSeries: TrendDataPoint[] = [
      { date: 'Aug 20', timestamp: '2026-08-20', riskProbability: 22, pestCount: 2, healthyProb: 88, bacterialProb: 4, curlVirusProb: 6, fusariumProb: 2, humidity: 68, rainfall: 0, temperature: 33 },
      { date: 'Aug 24', timestamp: '2026-08-24', riskProbability: 28, pestCount: 4, healthyProb: 74, bacterialProb: 5, curlVirusProb: 18, fusariumProb: 3, humidity: 70, rainfall: 2, temperature: 33 },
      { date: 'Aug 28', timestamp: '2026-08-28', riskProbability: 34, pestCount: 5, healthyProb: 55, bacterialProb: 6, curlVirusProb: 35, fusariumProb: 4, humidity: 74, rainfall: 2, temperature: 32 },
      { date: 'Aug 30', timestamp: '2026-08-30', riskProbability: 38, pestCount: 6, healthyProb: 35, bacterialProb: 7, curlVirusProb: 54, fusariumProb: 4, humidity: 75, rainfall: 0, temperature: 32 },
      { date: 'Sep 01', timestamp: '2026-09-01', riskProbability: 41, pestCount: 7, healthyProb: 22, bacterialProb: 8, curlVirusProb: 66, fusariumProb: 4, humidity: 76, rainfall: 0, temperature: 32 },
      { date: 'Sep 04', timestamp: '2026-09-04', riskProbability: currentRisk, pestCount: currentPest, healthyProb: healthyPct, bacterialProb: bacterialPct, curlVirusProb: curlPct, fusariumProb: fusariumPct, humidity: currentHumidity, rainfall: currentRain, temperature: currentTemp, eventLabel: 'Current Check' }
    ];
    if (range === '7 Days') return fullSeries.slice(-4);
    if (range === '14 Days') return fullSeries.slice(-5);
    return fullSeries;
  }

  if (field.id === 'field-cotton-d') {
    const fullSeries: TrendDataPoint[] = [
      { date: 'Aug 20', timestamp: '2026-08-20', riskProbability: 15, pestCount: 2, healthyProb: 95, bacterialProb: 2, curlVirusProb: 2, fusariumProb: 1, humidity: 64, rainfall: 0, temperature: 30 },
      { date: 'Aug 24', timestamp: '2026-08-24', riskProbability: 16, pestCount: 2, healthyProb: 94, bacterialProb: 2, curlVirusProb: 2, fusariumProb: 2, humidity: 66, rainfall: 0, temperature: 30 },
      { date: 'Aug 28', timestamp: '2026-08-28', riskProbability: 18, pestCount: 3, healthyProb: 92, bacterialProb: 3, curlVirusProb: 3, fusariumProb: 2, humidity: 68, rainfall: 0, temperature: 29 },
      { date: 'Aug 30', timestamp: '2026-08-30', riskProbability: 19, pestCount: 3, healthyProb: 92, bacterialProb: 3, curlVirusProb: 3, fusariumProb: 2, humidity: 70, rainfall: 0, temperature: 29 },
      { date: 'Sep 01', timestamp: '2026-09-01', riskProbability: 20, pestCount: 4, healthyProb: 91, bacterialProb: 4, curlVirusProb: 3, fusariumProb: 2, humidity: 70, rainfall: 0, temperature: 29 },
      { date: 'Sep 04', timestamp: '2026-09-04', riskProbability: currentRisk, pestCount: currentPest, healthyProb: healthyPct, bacterialProb: bacterialPct, curlVirusProb: curlPct, fusariumProb: fusariumPct, humidity: currentHumidity, rainfall: currentRain, temperature: currentTemp, eventLabel: 'Current Check' }
    ];
    if (range === '7 Days') return fullSeries.slice(-4);
    if (range === '14 Days') return fullSeries.slice(-5);
    return fullSeries;
  }

  // Dynamic series generation for any user-registered or edited fields
  const baseRisk = Math.max(10, currentRisk - 20);
  const basePest = Math.max(1, currentPest - 5);

  const series: TrendDataPoint[] = [
    {
      date: 'Aug 20',
      timestamp: '2026-08-20',
      riskProbability: baseRisk,
      pestCount: basePest,
      healthyProb: Math.min(95, healthyPct + 30),
      bacterialProb: Math.max(2, bacterialPct - 20),
      curlVirusProb: Math.max(2, curlPct - 15),
      fusariumProb: fusariumPct,
      humidity: Math.max(50, currentHumidity - 15),
      rainfall: 0,
      temperature: currentTemp + 1,
    },
    {
      date: 'Aug 26',
      timestamp: '2026-08-26',
      riskProbability: Math.round((baseRisk + currentRisk) / 2),
      pestCount: Math.round((basePest + currentPest) / 2),
      healthyProb: Math.round((healthyPct + 95) / 2),
      bacterialProb: Math.round(bacterialPct * 0.6),
      curlVirusProb: Math.round(curlPct * 0.6),
      fusariumProb: fusariumPct,
      humidity: Math.round((currentHumidity + 60) / 2),
      rainfall: Math.round(currentRain * 0.5),
      temperature: currentTemp,
    },
    {
      date: 'Aug 30',
      timestamp: '2026-08-30',
      riskProbability: Math.round(currentRisk * 0.85),
      pestCount: Math.round(currentPest * 0.8),
      healthyProb: Math.round(healthyPct * 1.1),
      bacterialProb: Math.round(bacterialPct * 0.85),
      curlVirusProb: Math.round(curlPct * 0.85),
      fusariumProb: fusariumPct,
      humidity: Math.round(currentHumidity * 0.95),
      rainfall: currentRain,
      temperature: currentTemp,
    },
    {
      date: 'Sep 04',
      timestamp: '2026-09-04',
      riskProbability: currentRisk,
      pestCount: currentPest,
      healthyProb: healthyPct,
      bacterialProb: bacterialPct,
      curlVirusProb: curlPct,
      fusariumProb: fusariumPct,
      humidity: currentHumidity,
      rainfall: currentRain,
      temperature: currentTemp,
      eventLabel: 'Current Check',
    },
  ];

  return series;
}

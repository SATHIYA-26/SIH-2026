export interface WeatherCondition {
  temperature: number; // in °C (e.g. 29)
  humidity: number; // in % (e.g. 86)
  recentRainfall: number; // in mm (e.g. 12)
  rainfallTrend: string; // e.g. "12 mm in last 48h"
  daysSinceRain: number;
  conditionDescription: string;
  forecast: {
    day: string;
    temp: number;
    humidity: number;
    rainProbability: number;
  }[];
}

/**
 * WeatherService — integrazione Open-Meteo API (gratuita, no API key).
 * Analizza condizioni meteo e rileva rischi per i motociclisti.
 */

import { WeatherCondition, WeatherPoint, WeatherRisk, RiskSeverity } from '@types/index';

const BASE_URL = 'https://api.open-meteo.com/v1/forecast';
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minuti

interface CacheEntry {
  data: WeatherPoint[];
  timestamp: number;
}

const cache = new Map<string, CacheEntry>();

// ─── Mapping WMO weather codes → condizione ────────────────────────────────

function wmoToCondition(code: number): WeatherCondition {
  if (code === 0) return 'clear';
  if (code <= 3)  return 'partly_cloudy';
  if (code <= 49) return 'fog';
  if (code <= 57) return 'rain';
  if (code <= 67) return 'rain';
  if (code <= 77) return 'snow';
  if (code <= 82) return 'heavy_rain';
  if (code <= 86) return 'snow';
  return 'thunderstorm';
}

// ─── Analisi rischi ────────────────────────────────────────────────────────

export function analyzeRisks(
  temp: number,
  precipitation: number,
  windSpeed: number,
  windGust: number,
  visibility: number,
  wmoCode: number,
): { risks: WeatherRisk[]; severity: RiskSeverity } {
  const risks: WeatherRisk[] = [];

  if (temp <= 2 && precipitation > 0.2) risks.push('ice');
  if (precipitation > 5)               risks.push('heavy_rain');
  if (windSpeed > 50 || windGust > 70) risks.push('strong_wind');
  if (visibility < 1)                  risks.push('fog');
  if (wmoCode >= 70 && wmoCode <= 77)  risks.push('snow');
  if (wmoCode >= 95)                   risks.push('thunderstorm');

  let severity: RiskSeverity = 'none';
  if (risks.includes('thunderstorm') || risks.includes('ice')) severity = 'extreme';
  else if (risks.includes('snow') || risks.includes('heavy_rain')) severity = 'high';
  else if (risks.includes('strong_wind') || risks.includes('fog')) severity = 'medium';
  else if (risks.length > 0) severity = 'low';

  return { risks, severity };
}

// ─── Fetch ─────────────────────────────────────────────────────────────────

export const WeatherService = {
  async getForecast(lat: number, lng: number, hours = 24): Promise<WeatherPoint[]> {
    const key = `${lat.toFixed(3)},${lng.toFixed(3)}`;
    const cached = cache.get(key);

    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return cached.data;
    }

    const params = new URLSearchParams({
      latitude:  lat.toString(),
      longitude: lng.toString(),
      hourly:    'temperature_2m,precipitation,windspeed_10m,windgusts_10m,visibility,weathercode',
      forecast_days: '2',
      timezone:  'auto',
    });

    const response = await fetch(`${BASE_URL}?${params}`);
    if (!response.ok) throw new Error(`Weather API error: ${response.status}`);

    const json = await response.json();
    const points: WeatherPoint[] = json.hourly.time.map((t: string, i: number) => {
      const temp          = json.hourly.temperature_2m[i];
      const precipitation = json.hourly.precipitation[i];
      const windSpeed     = json.hourly.windspeed_10m[i];
      const windGust      = json.hourly.windgusts_10m[i];
      const visibility    = (json.hourly.visibility[i] ?? 10000) / 1000; // m → km
      const wmoCode       = json.hourly.weathercode[i];

      const { risks, severity } = analyzeRisks(temp, precipitation, windSpeed, windGust, visibility, wmoCode);

      return {
        lat, lng,
        time: new Date(t),
        condition: wmoToCondition(wmoCode),
        temperatureCelsius: temp,
        precipitationMmH: precipitation,
        windSpeedKmh: windSpeed,
        windGustKmh: windGust,
        visibilityKm: visibility,
        risks,
        severity,
      } satisfies WeatherPoint;
    });

    cache.set(key, { data: points, timestamp: Date.now() });
    return points;
  },

  /** Restituisce le condizioni per l'ora più vicina a `time`. */
  getPointAtTime(points: WeatherPoint[], time: Date): WeatherPoint | null {
    if (points.length === 0) return null;
    return points.reduce((prev, curr) =>
      Math.abs(curr.time.getTime() - time.getTime()) <
      Math.abs(prev.time.getTime() - time.getTime())
        ? curr : prev,
    );
  },

  clearCache(): void {
    cache.clear();
  },
};

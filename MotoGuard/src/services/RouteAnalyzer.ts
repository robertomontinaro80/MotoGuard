/**
 * RouteAnalyzer — calcola il punteggio meteo di un percorso e
 * suggerisce l'orario di partenza ottimale.
 */

import { WeatherPoint, RouteWeatherAnalysis, RiskSeverity, WeatherRisk } from '@types/index';
import { WeatherService } from './WeatherService';

// ─── Scoring ───────────────────────────────────────────────────────────────

const SEVERITY_PENALTY: Record<RiskSeverity, number> = {
  none:    0,
  low:    10,
  medium: 25,
  high:   45,
  extreme: 80,
};

export function scorePoints(points: WeatherPoint[]): number {
  if (points.length === 0) return 100;
  const worstPenalty = Math.max(...points.map((p) => SEVERITY_PENALTY[p.severity]));
  const avgPenalty = points.reduce((s, p) => s + SEVERITY_PENALTY[p.severity], 0) / points.length;
  // 70% peso al punto peggiore, 30% alla media
  const combined = worstPenalty * 0.7 + avgPenalty * 0.3;
  return Math.max(0, Math.round(100 - combined));
}

export function verdictFromScore(score: number): RouteWeatherAnalysis['verdict'] {
  if (score >= 70) return 'go';
  if (score >= 45) return 'caution';
  return 'no_go';
}

// ─── Campionamento percorso ────────────────────────────────────────────────

export interface RouteCoordinate {
  lat: number;
  lng: number;
}

/** Campiona N punti equidistanti lungo una lista di coordinate. */
export function sampleRoute(coords: RouteCoordinate[], maxSamples = 8): RouteCoordinate[] {
  if (coords.length <= maxSamples) return coords;
  const step = Math.floor(coords.length / maxSamples);
  return coords.filter((_, i) => i % step === 0).slice(0, maxSamples);
}

// ─── Best departure window ─────────────────────────────────────────────────

/** Trova l'ora (0-23) di partenza con il punteggio migliore nelle prossime 12h. */
export function findBestDeparture(
  pointsByHour: Map<number, WeatherPoint[]>,
  currentScore: number,
): { hour: number; score: number } | null {
  if (currentScore >= 70) return null; // È già buono adesso

  let best: { hour: number; score: number } | null = null;

  for (const [hour, points] of pointsByHour.entries()) {
    const s = scorePoints(points);
    if (!best || s > best.score) {
      best = { hour, score: s };
    }
  }

  return best && best.score > currentScore ? best : null;
}

// ─── Main analyzer ─────────────────────────────────────────────────────────

export const RouteAnalyzer = {
  async analyze(
    coords: RouteCoordinate[],
    departureTime: Date = new Date(),
  ): Promise<RouteWeatherAnalysis> {
    const sampled = sampleRoute(coords);

    // Fetch meteo per ogni punto in parallelo
    const forecastsPerPoint = await Promise.all(
      sampled.map((c) => WeatherService.getForecast(c.lat, c.lng)),
    );

    // Prendi il punto orario più vicino all'orario di partenza per ogni coordinata
    const currentPoints = forecastsPerPoint.map((points) =>
      WeatherService.getPointAtTime(points, departureTime),
    ).filter(Boolean) as WeatherPoint[];

    const score = scorePoints(currentPoints);
    const verdict = verdictFromScore(score);

    // Raccoglie tutti i rischi unici
    const allRisks = [...new Set(currentPoints.flatMap((p) => p.risks))] as WeatherRisk[];
    const worstSeverity = currentPoints.reduce<RiskSeverity>((worst, p) => {
      const order: RiskSeverity[] = ['none', 'low', 'medium', 'high', 'extreme'];
      return order.indexOf(p.severity) > order.indexOf(worst) ? p.severity : worst;
    }, 'none');

    // Calcola punteggi per le prossime 12h (finestra di partenza alternativa)
    const now = new Date();
    const pointsByHour = new Map<number, WeatherPoint[]>();
    for (let h = 1; h <= 12; h++) {
      const t = new Date(now.getTime() + h * 3600_000);
      const pts = forecastsPerPoint
        .map((points) => WeatherService.getPointAtTime(points, t))
        .filter(Boolean) as WeatherPoint[];
      pointsByHour.set(t.getHours(), pts);
    }

    const bestDeparture = findBestDeparture(pointsByHour, score);

    return {
      score,
      verdict,
      risks: allRisks,
      worstSeverity,
      points: currentPoints,
      bestDepartureHour: bestDeparture?.hour,
      bestDepartureLabel: bestDeparture
        ? `Parti alle ${String(bestDeparture.hour).padStart(2, '0')}:00 (score ${bestDeparture.score})`
        : undefined,
    };
  },
};

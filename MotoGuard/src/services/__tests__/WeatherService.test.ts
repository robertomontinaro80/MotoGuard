import { analyzeRisks, WeatherService } from '../WeatherService';
import { scorePoints, verdictFromScore, sampleRoute, findBestDeparture } from '../RouteAnalyzer';
import { WeatherPoint } from '@types/index';

// ─── Helpers ───────────────────────────────────────────────────────────────

const makePoint = (overrides: Partial<WeatherPoint> = {}): WeatherPoint => ({
  lat: 45.46, lng: 9.19,
  time: new Date(),
  condition: 'clear',
  temperatureCelsius: 20,
  precipitationMmH: 0,
  windSpeedKmh: 10,
  windGustKmh: 15,
  visibilityKm: 20,
  risks: [],
  severity: 'none',
  ...overrides,
});

// ─── analyzeRisks ──────────────────────────────────────────────────────────

describe('analyzeRisks', () => {
  it('detects ice risk below 2°C with precipitation', () => {
    const { risks, severity } = analyzeRisks(1.5, 0.8, 10, 15, 20, 61);
    expect(risks).toContain('ice');
    expect(severity).toBe('extreme');
  });

  it('detects heavy rain', () => {
    const { risks } = analyzeRisks(15, 8, 20, 25, 5, 65);
    expect(risks).toContain('heavy_rain');
  });

  it('detects strong wind above 50km/h', () => {
    const { risks } = analyzeRisks(20, 0, 55, 80, 20, 0);
    expect(risks).toContain('strong_wind');
  });

  it('detects fog below 1km visibility', () => {
    const { risks } = analyzeRisks(10, 0, 5, 8, 0.4, 45);
    expect(risks).toContain('fog');
  });

  it('detects thunderstorm for WMO code >= 95', () => {
    const { risks, severity } = analyzeRisks(18, 10, 40, 60, 3, 95);
    expect(risks).toContain('thunderstorm');
    expect(severity).toBe('extreme');
  });

  it('returns none severity for perfect conditions', () => {
    const { risks, severity } = analyzeRisks(22, 0, 15, 20, 30, 0);
    expect(risks).toHaveLength(0);
    expect(severity).toBe('none');
  });
});

// ─── scorePoints ──────────────────────────────────────────────────────────

describe('scorePoints', () => {
  it('returns 100 for empty points', () => {
    expect(scorePoints([])).toBe(100);
  });

  it('returns high score for clear conditions', () => {
    const pts = [makePoint(), makePoint(), makePoint()];
    expect(scorePoints(pts)).toBeGreaterThan(90);
  });

  it('returns low score for extreme conditions', () => {
    const pts = [makePoint({ severity: 'extreme', risks: ['thunderstorm'] })];
    expect(scorePoints(pts)).toBeLessThan(40);
  });

  it('matches roadmap spec: score > 90 for sunny route', () => {
    const pts = Array(5).fill(null).map(() => makePoint({ severity: 'none' }));
    expect(scorePoints(pts)).toBeGreaterThan(90);
  });

  it('matches roadmap spec: score < 40 for stormy route', () => {
    const pts = Array(5).fill(null).map(() =>
      makePoint({ severity: 'extreme', risks: ['thunderstorm', 'heavy_rain'] }),
    );
    expect(scorePoints(pts)).toBeLessThan(40);
  });
});

// ─── verdictFromScore ──────────────────────────────────────────────────────

describe('verdictFromScore', () => {
  it('returns go for score >= 70', () => {
    expect(verdictFromScore(85)).toBe('go');
    expect(verdictFromScore(70)).toBe('go');
  });

  it('returns caution for score 45-69', () => {
    expect(verdictFromScore(60)).toBe('caution');
    expect(verdictFromScore(45)).toBe('caution');
  });

  it('returns no_go for score < 45', () => {
    expect(verdictFromScore(30)).toBe('no_go');
    expect(verdictFromScore(0)).toBe('no_go');
  });
});

// ─── sampleRoute ──────────────────────────────────────────────────────────

describe('sampleRoute', () => {
  it('returns all coords if fewer than maxSamples', () => {
    const coords = [{ lat: 1, lng: 1 }, { lat: 2, lng: 2 }];
    expect(sampleRoute(coords, 8)).toHaveLength(2);
  });

  it('returns maxSamples points for long route', () => {
    const coords = Array(100).fill(null).map((_, i) => ({ lat: i, lng: i }));
    expect(sampleRoute(coords, 8)).toHaveLength(8);
  });
});

// ─── findBestDeparture ────────────────────────────────────────────────────

describe('findBestDeparture', () => {
  it('returns null when current score is already good', () => {
    const map = new Map();
    expect(findBestDeparture(map, 80)).toBeNull();
  });

  it('suggests better hour when available', () => {
    const map = new Map<number, WeatherPoint[]>([
      [14, [makePoint({ severity: 'none' })]],
      [16, [makePoint({ severity: 'extreme', risks: ['thunderstorm'] })]],
    ]);
    const result = findBestDeparture(map, 40);
    expect(result).not.toBeNull();
    expect(result?.hour).toBe(14);
  });
});

// ─── WeatherService cache ─────────────────────────────────────────────────

describe('WeatherService cache', () => {
  beforeEach(() => WeatherService.clearCache());

  it('clearCache removes all entries', () => {
    WeatherService.clearCache();
    // Non crasha — cache è vuota
    expect(() => WeatherService.clearCache()).not.toThrow();
  });

  it('getPointAtTime returns null for empty array', () => {
    const result = WeatherService.getPointAtTime([], new Date());
    expect(result).toBeNull();
  });

  it('getPointAtTime returns closest point', () => {
    const now = new Date();
    const p1 = makePoint({ time: new Date(now.getTime() - 3600_000) });
    const p2 = makePoint({ time: new Date(now.getTime() + 600_000) });
    const result = WeatherService.getPointAtTime([p1, p2], now);
    expect(result).toBe(p2);
  });
});

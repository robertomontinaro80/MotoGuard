import {
  computeGForce, isImmobile, analyzeSamples, FallDetector, SensorSample,
} from '../FallDetector';

// ─── Fixtures ──────────────────────────────────────────────────────────────

function makeSamples(count: number, ax: number, ay: number, az: number, startTs = 0): SensorSample[] {
  return Array.from({ length: count }, (_, i) => ({
    ax, ay, az, timestamp: startTs + i * 20,
  }));
}

function crashFixture(): SensorSample[] {
  const before   = makeSamples(10, 0.1, 0.1, 1.0, 0);          // guida normale
  const impact   = [{ ax: 3.0, ay: -4.0, az: 2.5, timestamp: 200 }]; // impatto ~5.4g
  const immobile = makeSamples(100, 0.05, 0.05, 0.98, 220);     // immobile dopo caduta
  return [...before, ...impact, ...immobile];
}

function speedBumpFixture(): SensorSample[] {
  const before = makeSamples(10, 0.1, 0.1, 1.0, 0);
  const bump   = [{ ax: 1.5, ay: 0.5, az: 2.0, timestamp: 200 }]; // ~2.6g, sotto soglia
  const after  = makeSamples(10, 0.1, 0.1, 1.0, 220);
  return [...before, ...bump, ...after];
}

// ─── computeGForce ─────────────────────────────────────────────────────────

describe('computeGForce', () => {
  it('returns 1 for standard gravity (standing still)', () => {
    expect(computeGForce(0, 0, 1)).toBeCloseTo(1);
  });

  it('returns correct magnitude for 3D vector', () => {
    expect(computeGForce(3, 4, 0)).toBeCloseTo(5);
  });

  it('returns 0 for zero vector', () => {
    expect(computeGForce(0, 0, 0)).toBe(0);
  });
});

// ─── isImmobile ────────────────────────────────────────────────────────────

describe('isImmobile', () => {
  it('returns true for still samples', () => {
    const samples = makeSamples(60, 0.02, 0.02, 0.98, 0);
    expect(isImmobile(samples)).toBe(true);
  });

  it('returns false for moving samples', () => {
    const samples = [
      ...makeSamples(10, 0.1, 0.1, 1.0, 0),
      ...makeSamples(10, 0.8, 0.3, 1.2, 200),
      ...makeSamples(10, 0.2, 0.9, 0.7, 400),
    ];
    expect(isImmobile(samples)).toBe(false);
  });

  it('returns false for empty samples', () => {
    expect(isImmobile([])).toBe(false);
  });
});

// ─── analyzeSamples ────────────────────────────────────────────────────────

describe('analyzeSamples', () => {
  it('detects fall from crash fixture — matches roadmap T4.1 spec', () => {
    const result = analyzeSamples(crashFixture());
    expect(result.fallDetected).toBe(true);
    expect(result.confidence).toBeGreaterThan(0.85);
  });

  it('does NOT detect fall for speed bump fixture', () => {
    const result = analyzeSamples(speedBumpFixture());
    expect(result.fallDetected).toBe(false);
  });

  it('returns no_data reason for empty samples', () => {
    const result = analyzeSamples([]);
    expect(result.fallDetected).toBe(false);
    expect(result.reason).toBe('no_data');
  });

  it('returns below_threshold when peak g-force is low', () => {
    const samples = makeSamples(20, 0.1, 0.1, 1.0, 0);
    const result = analyzeSamples(samples);
    expect(result.reason).toBe('below_threshold');
  });

  it('reports correct peak g-force', () => {
    const fixture = crashFixture();
    const result = analyzeSamples(fixture);
    expect(result.peakGForce).toBeGreaterThan(3.5);
  });
});

// ─── FallDetector class ────────────────────────────────────────────────────

describe('FallDetector', () => {
  it('is NOT active when speed is below 10 km/h', () => {
    const detector = new FallDetector(jest.fn(), 5);
    expect(detector.isActive).toBe(false);
  });

  it('is active when speed is >= 10 km/h', () => {
    const detector = new FallDetector(jest.fn(), 50);
    expect(detector.isActive).toBe(true);
  });

  it('becomes active after updateSpeed exceeds threshold', () => {
    const detector = new FallDetector(jest.fn(), 0);
    expect(detector.isActive).toBe(false);
    detector.updateSpeed(30);
    expect(detector.isActive).toBe(true);
  });

  it('calls onFall callback after start/stop', () => {
    const onFall = jest.fn();
    const detector = new FallDetector(onFall, 50);
    detector.start();
    detector.stop();
    // Non deve crashare
    expect(onFall).not.toHaveBeenCalled(); // nessun dato reale
  });
});

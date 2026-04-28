/**
 * FallDetector — rileva cadute usando accelerometro e giroscopio.
 *
 * Algoritmo:
 *  1. Monitora G-force in continuo (soglia impatto: > 3.5g)
 *  2. Dopo l'impatto, controlla immobilità per 2 secondi
 *  3. Se immobile E velocità era > 10km/h → caduta confermata
 */

import { Accelerometer, Gyroscope } from 'expo-sensors';

export interface SensorSample {
  ax: number; ay: number; az: number;   // accelerometro (g)
  gx?: number; gy?: number; gz?: number; // giroscopio (rad/s)
  timestamp: number;
}

export interface FallAnalysisResult {
  fallDetected: boolean;
  confidence: number;  // 0–1
  peakGForce: number;
  reason?: string;
}

// ─── Calcoli fisici ────────────────────────────────────────────────────────

export function computeGForce(ax: number, ay: number, az: number): number {
  return Math.sqrt(ax * ax + ay * ay + az * az);
}

export function isImmobile(samples: SensorSample[], windowMs = 2000): boolean {
  if (samples.length < 2) return false;
  const recent = samples.filter(
    (s) => s.timestamp >= samples[samples.length - 1].timestamp - windowMs,
  );
  if (recent.length < 3) return false;

  const gForces = recent.map((s) => computeGForce(s.ax, s.ay, s.az));
  const avg = gForces.reduce((a, b) => a + b, 0) / gForces.length;
  const variance = gForces.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / gForces.length;

  return variance < 0.05 && avg < 1.3; // quasi fermo
}

// ─── Analisi batch (per test con fixture) ─────────────────────────────────

export function analyzeSamples(samples: SensorSample[]): FallAnalysisResult {
  if (samples.length === 0) {
    return { fallDetected: false, confidence: 0, peakGForce: 0, reason: 'no_data' };
  }

  const IMPACT_THRESHOLD = 3.5;
  const gForces = samples.map((s) => computeGForce(s.ax, s.ay, s.az));
  const peakGForce = Math.max(...gForces);

  if (peakGForce < IMPACT_THRESHOLD) {
    return { fallDetected: false, confidence: 0, peakGForce, reason: 'below_threshold' };
  }

  // Trova indice del picco
  const peakIdx = gForces.indexOf(peakGForce);
  const postImpact = samples.slice(peakIdx + 1);

  if (!isImmobile(postImpact)) {
    return { fallDetected: false, confidence: 0.3, peakGForce, reason: 'no_immobility' };
  }

  // Confidence in base all'entità dell'impatto
  const confidence = Math.min(1, (peakGForce - IMPACT_THRESHOLD) / 4 + 0.7);

  return { fallDetected: true, confidence, peakGForce };
}

// ─── Detector in tempo reale ───────────────────────────────────────────────

type FallCallback = (result: FallAnalysisResult) => void;

export class FallDetector {
  private samples: SensorSample[] = [];
  private accelSub: ReturnType<typeof Accelerometer.addListener> | null = null;
  private onFall: FallCallback;
  private currentSpeedKmh: number;
  private alreadyTriggered = false;

  constructor(onFall: FallCallback, initialSpeedKmh = 0) {
    this.onFall  = onFall;
    this.currentSpeedKmh = initialSpeedKmh;
  }

  get isActive(): boolean {
    return this.currentSpeedKmh >= 10;
  }

  updateSpeed(kmh: number) {
    this.currentSpeedKmh = kmh;
  }

  start() {
    Accelerometer.setUpdateInterval(20); // 50Hz

    this.accelSub = Accelerometer.addListener(({ x, y, z }) => {
      if (!this.isActive) return;

      const sample: SensorSample = { ax: x, ay: y, az: z, timestamp: Date.now() };
      this.samples.push(sample);

      // Mantieni solo gli ultimi 5 secondi
      const cutoff = Date.now() - 5000;
      this.samples = this.samples.filter((s) => s.timestamp >= cutoff);

      if (this.alreadyTriggered) return;

      const result = analyzeSamples(this.samples);
      if (result.fallDetected && result.confidence > 0.7) {
        this.alreadyTriggered = true;
        this.onFall(result);
      }
    });
  }

  stop() {
    this.accelSub?.remove();
    this.accelSub = null;
    this.samples = [];
    this.alreadyTriggered = false;
  }

  reset() {
    this.alreadyTriggered = false;
    this.samples = [];
  }
}

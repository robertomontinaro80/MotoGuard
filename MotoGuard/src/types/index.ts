/**
 * Tipi globali dell'applicazione MotoGuard.
 * Centralizza le definizioni condivise tra moduli.
 */

// ─── Moto ──────────────────────────────────────────────────────────────────

export interface Motorcycle {
  id: string;
  brand: string;
  model: string;
  year: number;
  licensePlate: string;
  currentKm: number;
  engineCC: number;
  color?: string;
  photo?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Manutenzione ─────────────────────────────────────────────────────────

export type MaintenanceType =
  | 'oil_change'
  | 'chain'
  | 'front_brake_pads'
  | 'rear_brake_pads'
  | 'tires'
  | 'air_filter'
  | 'spark_plugs'
  | 'coolant'
  | 'brake_fluid'
  | 'revision'        // Revisione periodica (libretto)
  | 'insurance'       // Assicurazione
  | 'road_tax'        // Bollo
  | 'other';

export type ReminderStatus = 'ok' | 'warning' | 'due' | 'overdue';

export interface MaintenanceRecord {
  id: string;
  motorcycleId: string;
  type: MaintenanceType;
  km: number;
  date: Date;
  cost?: number;
  notes?: string;
  receiptPhoto?: string;
  workshop?: string;
  createdAt: Date;
}

export interface MaintenanceReminder {
  type: MaintenanceType;
  status: ReminderStatus;
  lastKm?: number;
  lastDate?: Date;
  nextKm?: number;
  nextDate?: Date;
  /** km rimanenti (negativo = scaduto) */
  kmLeft?: number;
  /** giorni rimanenti (negativo = scaduto) */
  daysLeft?: number;
}

// ─── Meteo ────────────────────────────────────────────────────────────────

export type WeatherCondition =
  | 'clear'
  | 'partly_cloudy'
  | 'cloudy'
  | 'rain'
  | 'heavy_rain'
  | 'thunderstorm'
  | 'snow'
  | 'fog'
  | 'wind';

export type WeatherRisk = 'ice' | 'heavy_rain' | 'strong_wind' | 'fog' | 'snow' | 'thunderstorm';
export type RiskSeverity = 'none' | 'low' | 'medium' | 'high' | 'extreme';

export interface WeatherPoint {
  lat: number;
  lng: number;
  time: Date;
  condition: WeatherCondition;
  temperatureCelsius: number;
  precipitationMmH: number;
  windSpeedKmh: number;
  windGustKmh: number;
  visibilityKm: number;
  risks: WeatherRisk[];
  severity: RiskSeverity;
}

export interface RouteWeatherAnalysis {
  /** Punteggio 0–100: 100 = perfetto, 0 = pericoloso */
  score: number;
  verdict: 'go' | 'caution' | 'no_go';
  risks: WeatherRisk[];
  worstSeverity: RiskSeverity;
  points: WeatherPoint[];
  /** Ora di partenza ottimale (null se è già buono adesso) */
  bestDepartureHour?: number;
  bestDepartureLabel?: string;
}

// ─── Emergenza ────────────────────────────────────────────────────────────

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship?: string;
}

export interface FallEvent {
  id: string;
  timestamp: Date;
  lat: number;
  lng: number;
  gForce: number;
  alertSent: boolean;
  canceledByUser: boolean;
}

// ─── Navigazione ──────────────────────────────────────────────────────────

export type RootTabParamList = {
  Home: undefined;
  Maintenance: undefined;
  Weather: undefined;
  Emergency: undefined;
  Settings: undefined;
};

export type RootStackParamList = {
  Tabs: undefined;
  AddMotorcycle: { motorcycleId?: string };
  AddMaintenance: { motorcycleId: string; type?: MaintenanceType };
  MaintenanceDetail: { recordId: string };
  WeatherBriefing: { routeId?: string };
  EmergencyCountdown: { fallEventId: string };
  Onboarding: undefined;
  Profile: undefined;
};

/**
 * Intervalli di manutenzione standard per tipo di intervento.
 * Valori conservativi — meglio un reminder in anticipo che perderlo.
 */

import { MaintenanceType } from '@types/index';

export interface MaintenanceInterval {
  type: MaintenanceType;
  label: string;
  icon: string;
  intervalKm?: number;
  intervalDays?: number;
  description: string;
}

export const MAINTENANCE_INTERVALS: Record<MaintenanceType, MaintenanceInterval> = {
  oil_change: {
    type: 'oil_change',
    label: 'Cambio olio',
    icon: '🛢️',
    intervalKm: 6000,
    intervalDays: 365,
    description: 'Olio motore e filtro olio',
  },
  chain: {
    type: 'chain',
    label: 'Catena',
    icon: '⛓️',
    intervalKm: 10000,
    intervalDays: undefined,
    description: 'Pulizia, lubrificazione o sostituzione catena',
  },
  front_brake_pads: {
    type: 'front_brake_pads',
    label: 'Pastiglie ant.',
    icon: '🔴',
    intervalKm: 20000,
    intervalDays: undefined,
    description: 'Pastiglie freno anteriore',
  },
  rear_brake_pads: {
    type: 'rear_brake_pads',
    label: 'Pastiglie post.',
    icon: '🔴',
    intervalKm: 25000,
    intervalDays: undefined,
    description: 'Pastiglie freno posteriore',
  },
  tires: {
    type: 'tires',
    label: 'Pneumatici',
    icon: '🏁',
    intervalKm: 15000,
    intervalDays: 1825, // 5 anni
    description: 'Sostituzione pneumatici',
  },
  air_filter: {
    type: 'air_filter',
    label: 'Filtro aria',
    icon: '💨',
    intervalKm: 12000,
    intervalDays: 730,
    description: 'Sostituzione filtro aria',
  },
  spark_plugs: {
    type: 'spark_plugs',
    label: 'Candele',
    icon: '⚡',
    intervalKm: 12000,
    intervalDays: 730,
    description: 'Sostituzione candele',
  },
  coolant: {
    type: 'coolant',
    label: 'Liquido raffr.',
    icon: '🌡️',
    intervalKm: undefined,
    intervalDays: 730,
    description: 'Sostituzione liquido raffreddamento',
  },
  brake_fluid: {
    type: 'brake_fluid',
    label: 'Liquido freni',
    icon: '💧',
    intervalKm: undefined,
    intervalDays: 730,
    description: 'Sostituzione liquido freni',
  },
  revision: {
    type: 'revision',
    label: 'Revisione',
    icon: '📋',
    intervalKm: undefined,
    intervalDays: 730, // ogni 2 anni
    description: 'Revisione periodica al Motorizzazione',
  },
  insurance: {
    type: 'insurance',
    label: 'Assicurazione',
    icon: '📄',
    intervalKm: undefined,
    intervalDays: 365,
    description: 'Rinnovo polizza RC moto',
  },
  road_tax: {
    type: 'road_tax',
    label: 'Bollo',
    icon: '🏛️',
    intervalKm: undefined,
    intervalDays: 365,
    description: 'Pagamento tassa di circolazione',
  },
  other: {
    type: 'other',
    label: 'Altro',
    icon: '🔩',
    intervalKm: undefined,
    intervalDays: undefined,
    description: 'Intervento generico',
  },
};

export const MAINTENANCE_TYPES_ORDERED: MaintenanceType[] = [
  'oil_change', 'chain', 'front_brake_pads', 'rear_brake_pads',
  'tires', 'air_filter', 'spark_plugs', 'coolant', 'brake_fluid',
  'revision', 'insurance', 'road_tax', 'other',
];

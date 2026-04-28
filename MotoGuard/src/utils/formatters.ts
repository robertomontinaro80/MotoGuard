/**
 * Utility di formattazione condivise nell'app.
 */

import { MaintenanceType } from '@types/index';

/** Formatta km con separatore migliaia */
export function formatKm(km: number): string {
  return `${km.toLocaleString('it-IT')} km`;
}

/** Formatta costo in Euro */
export function formatCost(cost: number): string {
  return `€${cost.toFixed(2).replace('.', ',')}`;
}

/** Formatta data in italiano */
export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('it-IT', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

/** Formatta giorni rimanenti in testo leggibile */
export function formatDaysLeft(days: number): string {
  if (days < 0)  return `${Math.abs(days)} giorni fa`;
  if (days === 0) return 'oggi';
  if (days === 1) return 'domani';
  if (days <= 7)  return `tra ${days} giorni`;
  if (days <= 30) return `tra ${Math.round(days / 7)} settimane`;
  return `tra ${Math.round(days / 30)} mesi`;
}

/** Tronca stringa con ellissi */
export function truncate(str: string, maxLen = 30): string {
  return str.length > maxLen ? `${str.slice(0, maxLen - 1)}…` : str;
}

/** Formatta numero di telefono italiano */
export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('39') && digits.length === 12) {
    return `+39 ${digits.slice(2, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`;
  }
  return phone;
}

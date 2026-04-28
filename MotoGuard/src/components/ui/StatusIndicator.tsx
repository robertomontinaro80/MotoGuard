/**
 * StatusIndicator — semaforo visivo per lo stato di una scadenza manutenzione.
 * Verde (ok) → Giallo (warning) → Arancione (due) → Rosso (overdue).
 *
 * Corrisponde al test T2.3 della roadmap:
 * it('should show %s indicator', ...)
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { Colors, Spacing, Radius } from '@theme/index';
import { ReminderStatus } from '@types/index';

export interface StatusIndicatorProps {
  status: ReminderStatus;
  /** Giorni rimanenti (negativo = già scaduto). Opzionale — mostra etichetta. */
  daysLeft?: number;
  /** Km rimanenti (negativo = già scaduto). Opzionale. */
  kmLeft?: number;
  showLabel?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

const statusConfig: Record<ReminderStatus, { color: string; label: string }> = {
  ok:      { color: Colors.status.ok,      label: 'OK' },
  warning: { color: Colors.status.warning, label: 'In scadenza' },
  due:     { color: Colors.accent.primary, label: 'Da fare' },
  overdue: { color: Colors.status.danger,  label: 'Scaduto' },
};

/** Calcola lo status in base ai giorni/km rimanenti */
export function computeStatus(daysLeft?: number, kmLeft?: number): ReminderStatus {
  const days = daysLeft ?? Infinity;
  const km   = kmLeft   ?? Infinity;
  const min  = Math.min(days, km);

  if (min < 0)   return 'overdue';
  if (min <= 14) return 'due';
  if (min <= 30) return 'warning';
  return 'ok';
}

export function StatusIndicator({
  status,
  daysLeft,
  kmLeft,
  showLabel = false,
  style,
  testID,
}: StatusIndicatorProps) {
  const cfg = statusConfig[status];

  return (
    <View testID={testID ?? 'status-indicator'} style={[styles.container, style]}>
      <View
        testID="status-dot"
        style={[styles.dot, { backgroundColor: cfg.color }]}
      />
      {showLabel && (
        <Text testID="status-label" style={[styles.label, { color: cfg.color }]}>
          {cfg.label}
          {daysLeft !== undefined && daysLeft >= 0 && ` · ${daysLeft}gg`}
          {daysLeft !== undefined && daysLeft < 0 && ` · ${Math.abs(daysLeft)}gg fa`}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: Radius.full,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
  },
});

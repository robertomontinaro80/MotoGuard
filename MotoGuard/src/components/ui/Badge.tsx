/**
 * Badge — etichetta compatta per stato, tipo o contatore.
 * Usato nei reminder (ok/warning/due/overdue) e nei tag tipo manutenzione.
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { Colors, Spacing, Radius } from '@theme/index';

export type BadgeStatus = 'ok' | 'warning' | 'danger' | 'info' | 'neutral';

export interface BadgeProps {
  label: string;
  status?: BadgeStatus;
  dot?: boolean;        // Mostra solo pallino colorato senza testo
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

const statusConfig: Record<BadgeStatus, { bg: string; text: string }> = {
  ok:      { bg: Colors.status.ok + '22',      text: Colors.status.ok },
  warning: { bg: Colors.status.warning + '22', text: Colors.status.warning },
  danger:  { bg: Colors.status.danger + '22',  text: Colors.status.danger },
  info:    { bg: Colors.status.info + '22',    text: Colors.status.info },
  neutral: { bg: Colors.bg.tertiary,           text: Colors.text.secondary },
};

export function Badge({ label, status = 'neutral', dot = false, style, testID }: BadgeProps) {
  const cfg = statusConfig[status];

  if (dot) {
    return (
      <View
        testID={testID ?? 'badge-dot'}
        style={[styles.dot, { backgroundColor: cfg.text }, style]}
      />
    );
  }

  return (
    <View
      testID={testID ?? `badge-${status}`}
      style={[styles.container, { backgroundColor: cfg.bg }, style]}
    >
      <Text style={[styles.text, { color: cfg.text }]} testID="badge-label">
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radius.full,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: Radius.full,
  },
});

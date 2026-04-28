/**
 * EmptyState — schermata vuota con icona, messaggio e CTA opzionale.
 * Usato quando non ci sono moto aggiunte, nessun record manutenzione, ecc.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, Typography } from '@theme/index';
import { Button } from './Button';

export interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  testID?: string;
}

export function EmptyState({
  icon = '🏍️',
  title,
  description,
  actionLabel,
  onAction,
  testID,
}: EmptyStateProps) {
  return (
    <View testID={testID ?? 'empty-state'} style={styles.container}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.title}>{title}</Text>
      {description && (
        <Text style={styles.description} testID="empty-state-description">
          {description}
        </Text>
      )}
      {actionLabel && onAction && (
        <Button
          label={actionLabel}
          onPress={onAction}
          style={styles.action}
          testID="empty-state-action"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
    gap: Spacing.md,
  },
  icon: {
    fontSize: 52,
    marginBottom: Spacing.sm,
  },
  title: {
    ...(Typography.h3 as object),
    color: Colors.text.primary,
    textAlign: 'center',
  },
  description: {
    ...(Typography.bodyS as object),
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  action: {
    marginTop: Spacing.sm,
  },
});

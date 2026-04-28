/**
 * Card — contenitore con sfondo elevato, bordo e ombra.
 * Varianti: default, accent (bordo arancione), danger, flat (senza ombra).
 */

import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { Colors, Spacing, Radius, Shadows } from '@theme/index';

export type CardVariant = 'default' | 'accent' | 'danger' | 'info' | 'flat';

export interface CardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  padding?: keyof typeof Spacing;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

const variantBorder: Record<CardVariant, string> = {
  default: Colors.border.default,
  accent:  Colors.accent.primary,
  danger:  Colors.status.danger,
  info:    Colors.status.info,
  flat:    Colors.border.subtle,
};

export function Card({
  children,
  variant = 'default',
  padding = 'md',
  style,
  testID,
}: CardProps) {
  return (
    <View
      testID={testID ?? 'card'}
      style={[
        styles.base,
        { padding: Spacing[padding], borderColor: variantBorder[variant] },
        variant !== 'flat' && Shadows.card,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: Colors.bg.secondary,
    borderRadius: Radius.lg,
    borderWidth: 1,
  },
});

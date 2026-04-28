/**
 * Componenti di layout utility: Divider e Spacer.
 */

import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { Colors, Spacing } from '@theme/index';

// ─── Divider ───────────────────────────────────────────────────────────────

export interface DividerProps {
  vertical?: boolean;
  color?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function Divider({ vertical = false, color, style, testID }: DividerProps) {
  return (
    <View
      testID={testID ?? 'divider'}
      style={[
        vertical ? styles.vertical : styles.horizontal,
        color ? { backgroundColor: color } : undefined,
        style,
      ]}
    />
  );
}

// ─── Spacer ────────────────────────────────────────────────────────────────

export interface SpacerProps {
  size?: keyof typeof Spacing;
  horizontal?: boolean;
}

export function Spacer({ size = 'md', horizontal = false }: SpacerProps) {
  const value = Spacing[size];
  return (
    <View
      style={horizontal ? { width: value } : { height: value }}
      testID="spacer"
    />
  );
}

const styles = StyleSheet.create({
  horizontal: {
    height: 1,
    backgroundColor: Colors.border.subtle,
    width: '100%',
  },
  vertical: {
    width: 1,
    backgroundColor: Colors.border.subtle,
    alignSelf: 'stretch',
  },
});

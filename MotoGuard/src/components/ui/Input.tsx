/**
 * Input — campo di testo con label, icona opzionale ed error state.
 * Ottimizzato per uso con guanti (altezza minima 52px).
 */

import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet,
  ViewStyle, StyleProp, TextInputProps,
} from 'react-native';
import { Colors, Spacing, Radius, Typography } from '@theme/index';

export interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  hint?: string;
  containerStyle?: StyleProp<ViewStyle>;
  testID?: string;
}

export function Input({
  label,
  error,
  hint,
  containerStyle,
  testID,
  ...textInputProps
}: InputProps) {
  const [focused, setFocused] = useState(false);

  const borderColor = error
    ? Colors.status.danger
    : focused
    ? Colors.border.focused
    : Colors.border.default;

  return (
    <View testID={testID ? `${testID}-container` : 'input-container'} style={[styles.container, containerStyle]}>
      {label && (
        <Text style={styles.label} testID={testID ? `${testID}-label` : 'input-label'}>
          {label}
        </Text>
      )}

      <TextInput
        testID={testID ?? 'input'}
        placeholderTextColor={Colors.text.muted}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={[styles.input, { borderColor }]}
        {...textInputProps}
      />

      {error && (
        <Text style={styles.error} testID={testID ? `${testID}-error` : 'input-error'}>
          {error}
        </Text>
      )}
      {hint && !error && (
        <Text style={styles.hint} testID={testID ? `${testID}-hint` : 'input-hint'}>
          {hint}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.xs,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: Colors.text.secondary,
  },
  input: {
    backgroundColor: Colors.bg.tertiary,
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
    fontSize: 15,
    color: Colors.text.primary,
    minHeight: 52,
  },
  error: {
    fontSize: 12,
    color: Colors.status.danger,
    fontWeight: '500',
  },
  hint: {
    fontSize: 12,
    color: Colors.text.muted,
  },
});

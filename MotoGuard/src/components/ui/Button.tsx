/**
 * Button — componente base riutilizzabile.
 * Supporta varianti: primary, secondary, danger, ghost.
 * Grande abbastanza per essere usato con i guanti da moto.
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
  StyleProp,
} from 'react-native';
import { Colors, Spacing, Radius, Typography, Shadows, Animation } from '@theme/index';

// ─── Tipi ──────────────────────────────────────────────────────────────────

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

// ─── Stili per variante ────────────────────────────────────────────────────

const variantStyles: Record<ButtonVariant, { container: ViewStyle; text: TextStyle }> = {
  primary: {
    container: {
      backgroundColor: Colors.accent.primary,
      ...Shadows.accent,
    },
    text: { color: Colors.text.inverse },
  },
  secondary: {
    container: {
      backgroundColor: Colors.bg.tertiary,
      borderWidth: 1,
      borderColor: Colors.border.default,
    },
    text: { color: Colors.text.primary },
  },
  danger: {
    container: {
      backgroundColor: Colors.status.danger,
      ...Shadows.danger,
    },
    text: { color: Colors.white },
  },
  ghost: {
    container: {
      backgroundColor: 'transparent',
    },
    text: { color: Colors.accent.primary },
  },
};

const sizeStyles: Record<ButtonSize, { container: ViewStyle; text: TextStyle }> = {
  sm: {
    container: { paddingVertical: Spacing.xs, paddingHorizontal: Spacing.md, borderRadius: Radius.sm },
    text: { fontSize: 13 },
  },
  md: {
    container: { paddingVertical: 14, paddingHorizontal: Spacing.lg, borderRadius: Radius.md },
    text: { fontSize: 15 },
  },
  lg: {
    // Largo per uso con guanti
    container: { paddingVertical: 18, paddingHorizontal: Spacing.xl, borderRadius: Radius.lg },
    text: { fontSize: 17 },
  },
};

// ─── Componente ────────────────────────────────────────────────────────────

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  testID,
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const vStyle = variantStyles[variant];
  const sStyle = sizeStyles[size];

  return (
    <TouchableOpacity
      testID={testID ?? `button-${label.toLowerCase().replace(/\s+/g, '-')}`}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={Animation.fast / 1000 + 0.7}
      style={[
        styles.base,
        vStyle.container,
        sStyle.container,
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        style,
      ]}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      accessibilityLabel={label}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' || variant === 'danger' ? Colors.white : Colors.accent.primary}
          testID="button-spinner"
        />
      ) : (
        <Text
          style={[styles.text, vStyle.text, sStyle.text, isDisabled && styles.disabledText]}
          testID="button-label"
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

// ─── Stili ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    minHeight: 48, // Accessibilità — target minimo 48px
  },
  text: {
    ...(Typography.body as TextStyle),
    fontWeight: '600',
  } as TextStyle,
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.4,
  },
  disabledText: {
    // opacity ereditata dal container
  },
});

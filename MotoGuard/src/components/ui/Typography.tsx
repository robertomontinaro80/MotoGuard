/**
 * Typography — componente testo unificato.
 * Usa i token del design system per garantire coerenza visiva.
 */

import React from 'react';
import { Text, StyleSheet, TextStyle, StyleProp } from 'react-native';
import { Typography as T, Colors } from '@theme/index';

export type TypographyVariant =
  | 'display'
  | 'h1' | 'h2' | 'h3'
  | 'body' | 'bodyS'
  | 'label' | 'labelS'
  | 'caption';

export interface TypographyProps {
  variant?: TypographyVariant;
  children: React.ReactNode;
  color?: string;
  align?: 'left' | 'center' | 'right';
  numberOfLines?: number;
  style?: StyleProp<TextStyle>;
  testID?: string;
}

export function Typography({
  variant = 'body',
  children,
  color,
  align,
  numberOfLines,
  style,
  testID,
}: TypographyProps) {
  return (
    <Text
      testID={testID ?? `text-${variant}`}
      numberOfLines={numberOfLines}
      style={[
        T[variant] as TextStyle,
        color ? { color } : undefined,
        align ? { textAlign: align } : undefined,
        style,
      ]}
    >
      {children}
    </Text>
  );
}

// ─── Shorthand components ─────────────────────────────────────────────────
// Uso: <Heading2>Titolo</Heading2> invece di <Typography variant="h2">

export const Display  = (p: Omit<TypographyProps, 'variant'>) => <Typography variant="display"  {...p} />;
export const Heading1 = (p: Omit<TypographyProps, 'variant'>) => <Typography variant="h1"       {...p} />;
export const Heading2 = (p: Omit<TypographyProps, 'variant'>) => <Typography variant="h2"       {...p} />;
export const Heading3 = (p: Omit<TypographyProps, 'variant'>) => <Typography variant="h3"       {...p} />;
export const Body     = (p: Omit<TypographyProps, 'variant'>) => <Typography variant="body"     {...p} />;
export const BodyS    = (p: Omit<TypographyProps, 'variant'>) => <Typography variant="bodyS"    {...p} />;
export const Label    = (p: Omit<TypographyProps, 'variant'>) => <Typography variant="label"    {...p} />;
export const Caption  = (p: Omit<TypographyProps, 'variant'>) => <Typography variant="caption"  {...p} />;

/**
 * ProgressBar — barra di avanzamento animata.
 * Usata per: score meteo (0–100), completamento profilo, km al prossimo tagliando.
 */

import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { Colors, Radius, Animation } from '@theme/index';

export interface ProgressBarProps {
  /** Valore 0–100 */
  value: number;
  /** Colore custom (default: accent primario) */
  color?: string;
  height?: number;
  animated?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function ProgressBar({
  value,
  color = Colors.accent.primary,
  height = 6,
  animated = true,
  style,
  testID,
}: ProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value));
  const widthAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (animated) {
      Animated.timing(widthAnim, {
        toValue: clampedValue,
        duration: Animation.slow,
        useNativeDriver: false,
      }).start();
    } else {
      widthAnim.setValue(clampedValue);
    }
  }, [clampedValue, animated, widthAnim]);

  const widthInterpolated = widthAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View
      testID={testID ?? 'progress-bar'}
      style={[styles.track, { height }, style]}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: clampedValue }}
    >
      <Animated.View
        testID="progress-fill"
        style={[
          styles.fill,
          { width: widthInterpolated, backgroundColor: color, height },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    backgroundColor: Colors.bg.tertiary,
    borderRadius: Radius.full,
    overflow: 'hidden',
    width: '100%',
  },
  fill: {
    borderRadius: Radius.full,
  },
});

/**
 * VerdictCard — mostra il verdetto meteo go/caution/no_go con score.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, Radius, Shadows } from '@theme/index';
import { RouteWeatherAnalysis } from '@types/index';
import { ProgressBar } from '@components/ui/ProgressBar';
import { Badge } from '@components/ui/Badge';

interface VerdictCardProps {
  analysis: RouteWeatherAnalysis;
  testID?: string;
}

const VERDICT_CONFIG = {
  go:      { label: 'VAI!',      color: Colors.status.ok,      emoji: '✅', badgeStatus: 'ok' as const },
  caution: { label: 'ATTENZIONE',color: Colors.status.warning,  emoji: '⚠️', badgeStatus: 'warning' as const },
  no_go:   { label: 'NO GO',     color: Colors.status.danger,   emoji: '🚫', badgeStatus: 'danger' as const },
};

const RISK_LABELS: Record<string, string> = {
  ice:          '🧊 Rischio ghiaccio',
  heavy_rain:   '🌧️ Pioggia intensa',
  strong_wind:  '💨 Vento forte',
  fog:          '🌫️ Nebbia',
  snow:         '❄️ Neve',
  thunderstorm: '⛈️ Temporale',
};

export function VerdictCard({ analysis, testID }: VerdictCardProps) {
  const cfg = VERDICT_CONFIG[analysis.verdict];

  return (
    <View
      testID={testID ?? 'verdict-card'}
      style={[styles.card, { borderColor: cfg.color }]}
    >
      {/* Score */}
      <View style={styles.header}>
        <Text style={styles.emoji}>{cfg.emoji}</Text>
        <View style={styles.scoreBlock}>
          <Text testID="verdict-label" style={[styles.verdictLabel, { color: cfg.color }]}>
            {cfg.label}
          </Text>
          <Text style={styles.scoreText}>Score: {analysis.score}/100</Text>
        </View>
      </View>

      <ProgressBar value={analysis.score} color={cfg.color} animated testID="verdict-progress" />

      {/* Rischi */}
      {analysis.risks.length > 0 && (
        <View style={styles.risks} testID="verdict-risks">
          {analysis.risks.map((risk) => (
            <Badge
              key={risk}
              label={RISK_LABELS[risk] ?? risk}
              status={analysis.worstSeverity === 'extreme' ? 'danger' : 'warning'}
              testID={`risk-badge-${risk}`}
            />
          ))}
        </View>
      )}

      {/* Suggerimento partenza */}
      {analysis.bestDepartureLabel && (
        <View style={styles.suggestion} testID="verdict-suggestion">
          <Text style={styles.suggestionText}>
            💡 {analysis.bestDepartureLabel}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.bg.secondary,
    borderRadius: Radius.lg,
    borderWidth: 2,
    padding: Spacing.md,
    gap: Spacing.md,
    ...Shadows.card,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  emoji: { fontSize: 40 },
  scoreBlock: { flex: 1 },
  verdictLabel: {
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 1,
  },
  scoreText: {
    fontSize: 13,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  risks: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  suggestion: {
    backgroundColor: Colors.bg.tertiary,
    borderRadius: Radius.md,
    padding: Spacing.sm,
  },
  suggestionText: {
    fontSize: 13,
    color: Colors.text.primary,
    lineHeight: 18,
  },
});

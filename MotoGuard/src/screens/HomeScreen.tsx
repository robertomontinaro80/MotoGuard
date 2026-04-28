/**
 * HomeScreen — dashboard principale con moto attiva e riepilogo salute.
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ScreenShell } from '@components/ui/ScreenShell';
import { Card } from '@components/ui/Card';
import { Badge } from '@components/ui/Badge';
import { EmptyState } from '@components/ui/EmptyState';
import { ProgressBar } from '@components/ui/ProgressBar';
import { Colors, Spacing, Typography } from '@theme/index';
import { useAppStore, useSelectedMotorcycle } from '@store/appStore';
import { useAppNavigation } from '@hooks/useAppNavigation';

export function HomeScreen() {
  const nav = useAppNavigation();
  const moto = useSelectedMotorcycle();
  const { reminders, loadMotorcycles, loadMaintenance } = useAppStore();

  useEffect(() => { loadMotorcycles(); }, []);
  useEffect(() => { if (moto) loadMaintenance(moto.id); }, [moto?.id]);

  const overdueCount = reminders.filter((r) => r.status === 'overdue').length;
  const dueCount     = reminders.filter((r) => r.status === 'due').length;
  const okCount      = reminders.filter((r) => r.status === 'ok').length;
  const healthScore  = reminders.length > 0 ? Math.round((okCount / reminders.length) * 100) : 100;

  return (
    <ScreenShell testID="screen-home" scrollable>
      <View style={styles.brand}>
        <Text style={styles.brandText}>🏍️ MotoGuard</Text>
      </View>

      {!moto ? (
        <EmptyState icon="🏍️" title="Benvenuto in MotoGuard"
          description="Aggiungi la tua moto per iniziare."
          actionLabel="Aggiungi la tua moto"
          onAction={() => nav.navigate('AddMotorcycle', {})}
          testID="home-empty" />
      ) : (
        <>
          <TouchableOpacity onPress={() => nav.navigate('AddMotorcycle', { motorcycleId: moto.id })} testID="moto-card">
            <Card variant="accent" style={styles.motoCard}>
              <View style={styles.motoRow}>
                <View>
                  <Text style={styles.motoName}>{moto.brand} {moto.model}</Text>
                  <Text style={styles.motoYear}>{moto.year} · {moto.engineCC}cc</Text>
                </View>
                <Text style={styles.motoKm}>{moto.currentKm.toLocaleString()} km</Text>
              </View>
            </Card>
          </TouchableOpacity>

          <Card style={styles.healthCard} testID="health-card">
            <View style={styles.healthHeader}>
              <Text style={styles.healthTitle}>Salute moto</Text>
              <Text style={styles.healthScore}>{healthScore}%</Text>
            </View>
            <ProgressBar value={healthScore}
              color={healthScore > 70 ? Colors.status.ok : healthScore > 40 ? Colors.status.warning : Colors.status.danger}
              testID="health-bar" />
            <View style={styles.healthBadges}>
              {overdueCount > 0 && <Badge label={`${overdueCount} scadute`}  status="danger"  />}
              {dueCount > 0     && <Badge label={`${dueCount} in scadenza`}  status="warning" />}
              {overdueCount === 0 && dueCount === 0 && <Badge label="Tutto ok" status="ok" />}
            </View>
          </Card>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.actionBtn} onPress={() => nav.navigate('WeatherBriefing', {})} testID="quick-weather">
              <Text style={styles.actionEmoji}>🌦️</Text>
              <Text style={styles.actionLabel}>Meteo percorso</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn} onPress={() => nav.navigate('AddMaintenance', { motorcycleId: moto.id })} testID="quick-maintenance">
              <Text style={styles.actionEmoji}>🔧</Text>
              <Text style={styles.actionLabel}>Aggiungi intervento</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  brand:        { paddingHorizontal: Spacing.md, paddingTop: Spacing.lg, paddingBottom: Spacing.sm },
  brandText:    { ...(Typography.h1 as object) },
  motoCard:     { marginHorizontal: Spacing.md, marginBottom: Spacing.md },
  motoRow:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  motoName:     { ...(Typography.h2 as object) },
  motoYear:     { ...(Typography.caption as object) },
  motoKm:       { ...(Typography.h2 as object), color: Colors.accent.primary },
  healthCard:   { marginHorizontal: Spacing.md, marginBottom: Spacing.md, gap: Spacing.sm },
  healthHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  healthTitle:  { ...(Typography.h3 as object) },
  healthScore:  { ...(Typography.h2 as object), color: Colors.accent.primary },
  healthBadges: { flexDirection: 'row', gap: Spacing.xs, flexWrap: 'wrap' },
  actions:      { flexDirection: 'row', marginHorizontal: Spacing.md, gap: Spacing.md },
  actionBtn: {
    flex: 1, backgroundColor: Colors.bg.secondary, borderRadius: 12,
    padding: Spacing.md, alignItems: 'center', gap: Spacing.xs,
    borderWidth: 1, borderColor: Colors.border.default,
  },
  actionEmoji: { fontSize: 28 },
  actionLabel: { ...(Typography.caption as object), textAlign: 'center' },
});

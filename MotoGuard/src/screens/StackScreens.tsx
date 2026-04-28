/**
 * Schermate stack secondarie — AddMaintenance, MaintenanceDetail,
 * già usate come placeholder; qui la versione con contenuto reale.
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { ScreenShell } from '@components/ui/ScreenShell';
import { Card } from '@components/ui/Card';
import { Input } from '@components/ui/Input';
import { Button } from '@components/ui/Button';
import { Spacer } from '@components/ui/Divider';
import { Colors, Spacing, Typography } from '@theme/index';
import { useAppStore } from '@store/appStore';
import { useAppNavigation } from '@hooks/useAppNavigation';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList, MaintenanceType } from '@types/index';
import { MAINTENANCE_INTERVALS, MAINTENANCE_TYPES_ORDERED } from '@services/maintenanceIntervals';

// ─── AddMaintenanceScreen ──────────────────────────────────────────────────

export function AddMaintenanceScreen() {
  const nav = useAppNavigation();
  const route = useRoute<RouteProp<RootStackParamList, 'AddMaintenance'>>();
  const { motorcycleId, type: preselectedType } = route.params;
  const addMaintenanceRecord = useAppStore((s) => s.addMaintenanceRecord);

  const [type,  setType]  = useState<MaintenanceType>(preselectedType ?? 'oil_change');
  const [km,    setKm]    = useState('');
  const [cost,  setCost]  = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!km || isNaN(parseInt(km)) || parseInt(km) < 0) e.km = 'Inserisci i km attuali';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await addMaintenanceRecord({
        motorcycleId,
        type,
        km:    parseInt(km),
        date:  new Date(),
        cost:  cost ? parseFloat(cost) : undefined,
        notes: notes.trim() || undefined,
      });
      nav.goBack();
    } catch {
      Alert.alert('Errore', 'Impossibile salvare. Riprova.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenShell title="Registra intervento" showBack testID="screen-add-maintenance" scrollable>
      {/* Tipo intervento */}
      <Text style={styles.sectionLabel}>Tipo intervento</Text>
      <View style={styles.typeGrid}>
        {MAINTENANCE_TYPES_ORDERED.slice(0, 8).map((t) => {
          const interval = MAINTENANCE_INTERVALS[t];
          return (
            <Button
              key={t}
              label={`${interval.icon} ${interval.label}`}
              variant={type === t ? 'primary' : 'secondary'}
              size="sm"
              onPress={() => setType(t)}
              testID={`type-btn-${t}`}
            />
          );
        })}
      </View>
      <Spacer size="md" />

      <Input label="Chilometri" value={km} onChangeText={setKm}
        error={errors.km} placeholder="Es: 15800"
        keyboardType="numeric" testID="km-input" />
      <Spacer size="md" />

      <Input label="Costo (€) — opzionale" value={cost} onChangeText={setCost}
        placeholder="Es: 80" keyboardType="decimal-pad" testID="cost-input" />
      <Spacer size="md" />

      <Input label="Note — opzionale" value={notes} onChangeText={setNotes}
        placeholder="Es: Olio sintetico 10W-40" multiline
        testID="notes-input" />
      <Spacer size="xl" />

      <Button label="Salva intervento" onPress={handleSubmit}
        loading={loading} fullWidth testID="submit-btn" />
    </ScreenShell>
  );
}

// ─── MaintenanceDetailScreen ───────────────────────────────────────────────

export function MaintenanceDetailScreen() {
  const nav = useAppNavigation();
  const route = useRoute<RouteProp<RootStackParamList, 'MaintenanceDetail'>>();
  const { recordId } = route.params;
  const { maintenanceRecords, deleteMaintenanceRecord } = useAppStore();
  const record = maintenanceRecords.find((r) => r.id === recordId);

  if (!record) {
    return (
      <ScreenShell title="Dettaglio" showBack testID="screen-maintenance-detail">
        <Text style={styles.notFound}>Intervento non trovato.</Text>
      </ScreenShell>
    );
  }

  const interval = MAINTENANCE_INTERVALS[record.type];

  const handleDelete = () => {
    Alert.alert('Elimina intervento', 'Sei sicuro?', [
      { text: 'Annulla', style: 'cancel' },
      { text: 'Elimina', style: 'destructive', onPress: async () => {
        await deleteMaintenanceRecord(record.id);
        nav.goBack();
      }},
    ]);
  };

  return (
    <ScreenShell title="Dettaglio intervento" showBack testID="screen-maintenance-detail">
      <Card style={styles.detailCard}>
        <Text style={styles.detailEmoji}>{interval.icon}</Text>
        <Text style={styles.detailTitle}>{interval.label}</Text>
        <View style={styles.detailRows}>
          <View style={styles.detailRow}>
            <Text style={styles.detailKey}>Data</Text>
            <Text style={styles.detailVal}>{new Date(record.date).toLocaleDateString('it-IT')}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailKey}>Chilometri</Text>
            <Text style={styles.detailVal}>{record.km.toLocaleString()} km</Text>
          </View>
          {record.cost ? (
            <View style={styles.detailRow}>
              <Text style={styles.detailKey}>Costo</Text>
              <Text style={styles.detailVal}>€{record.cost}</Text>
            </View>
          ) : null}
          {record.workshop ? (
            <View style={styles.detailRow}>
              <Text style={styles.detailKey}>Officina</Text>
              <Text style={styles.detailVal}>{record.workshop}</Text>
            </View>
          ) : null}
          {record.notes ? (
            <View style={styles.detailRow}>
              <Text style={styles.detailKey}>Note</Text>
              <Text style={styles.detailVal}>{record.notes}</Text>
            </View>
          ) : null}
        </View>
      </Card>
      <Spacer size="lg" />
      <Button label="Elimina intervento" variant="danger" onPress={handleDelete}
        fullWidth testID="delete-btn" style={{ marginHorizontal: Spacing.md }} />
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  sectionLabel: { ...(Typography.label as object), paddingHorizontal: Spacing.md, paddingBottom: Spacing.sm },
  typeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, paddingHorizontal: Spacing.md },
  detailCard: { margin: Spacing.md, alignItems: 'center', gap: Spacing.md },
  detailEmoji: { fontSize: 48 },
  detailTitle: { ...(Typography.h2 as object) },
  detailRows: { width: '100%', gap: Spacing.sm },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between' },
  detailKey: { ...(Typography.bodyS as object) },
  detailVal: { ...(Typography.body as object), fontWeight: '600' },
  notFound: { ...(Typography.body as object), margin: Spacing.md, color: Colors.text.secondary },
});

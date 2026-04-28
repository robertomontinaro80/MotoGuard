/**
 * MaintenanceScreen — lista reminder e storico interventi.
 * Implementa T2.3 della roadmap.
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ScreenShell } from '@components/ui/ScreenShell';
import { Card } from '@components/ui/Card';
import { StatusIndicator } from '@components/ui/StatusIndicator';
import { Badge } from '@components/ui/Badge';
import { EmptyState } from '@components/ui/EmptyState';
import { Button } from '@components/ui/Button';
import { Colors, Spacing, Typography } from '@theme/index';
import { useAppStore, useSelectedMotorcycle } from '@store/appStore';
import { useAppNavigation } from '@hooks/useAppNavigation';
import { MAINTENANCE_INTERVALS } from '@services/maintenanceIntervals';
import { MaintenanceReminder } from '@types/index';

function ReminderRow({ reminder }: { reminder: MaintenanceReminder }) {
  const interval = MAINTENANCE_INTERVALS[reminder.type];
  return (
    <View style={styles.reminderRow} testID={`reminder-${reminder.type}`}>
      <Text style={styles.reminderIcon}>{interval.icon}</Text>
      <View style={styles.reminderInfo}>
        <Text style={styles.reminderLabel}>{interval.label}</Text>
        {reminder.nextKm && (
          <Text style={styles.reminderSub}>Prossimo: {reminder.nextKm.toLocaleString()} km</Text>
        )}
      </View>
      <StatusIndicator
        status={reminder.status}
        daysLeft={reminder.daysLeft}
        kmLeft={reminder.kmLeft}
        showLabel
        testID={`status-${reminder.type}`}
      />
    </View>
  );
}

export function MaintenanceScreen() {
  const nav = useAppNavigation();
  const moto = useSelectedMotorcycle();
  const { reminders, maintenanceRecords, loadMaintenance } = useAppStore();

  useEffect(() => {
    if (moto) loadMaintenance(moto.id);
  }, [moto?.id]);

  if (!moto) {
    return (
      <ScreenShell testID="screen-maintenance" title="Manutenzione">
        <EmptyState icon="🏍️" title="Nessuna moto"
          description="Aggiungi la tua moto dalla schermata Home." testID="maintenance-no-moto" />
      </ScreenShell>
    );
  }

  const dueCount = reminders.filter((r) => r.status === 'overdue' || r.status === 'due').length;

  return (
    <ScreenShell testID="screen-maintenance" title="Manutenzione" scrollable
      headerRight={
        <Button label="+ Intervento" size="sm"
          onPress={() => nav.navigate('AddMaintenance', { motorcycleId: moto.id })}
          testID="add-maintenance-btn" />
      }
    >
      <Card style={styles.motoCard} testID="selected-moto-card">
        <Text style={styles.motoName}>{moto.brand} {moto.model}</Text>
        <Text style={styles.motoKm}>{moto.currentKm.toLocaleString()} km</Text>
        {dueCount > 0 && <Badge label={`${dueCount} scadenze`} status="warning" testID="due-badge" />}
      </Card>

      <Text style={styles.sectionTitle}>Scadenze</Text>
      {reminders.length === 0 ? (
        <EmptyState icon="✅" title="Tutto in ordine" testID="reminders-empty" />
      ) : (
        <Card style={styles.remindersCard} testID="reminders-list">
          {reminders.map((r, i) => (
            <View key={r.type}>
              <ReminderRow reminder={r} />
              {i < reminders.length - 1 && <View style={styles.separator} />}
            </View>
          ))}
        </Card>
      )}

      {maintenanceRecords.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Storico interventi</Text>
          <Card style={styles.historyCard} testID="history-list">
            {maintenanceRecords.slice(0, 5).map((record) => (
              <TouchableOpacity key={record.id}
                onPress={() => nav.navigate('MaintenanceDetail', { recordId: record.id })}
                style={styles.historyRow} testID={`history-item-${record.id}`}>
                <Text style={styles.historyIcon}>{MAINTENANCE_INTERVALS[record.type]?.icon ?? '🔩'}</Text>
                <View style={styles.historyInfo}>
                  <Text style={styles.historyLabel}>{MAINTENANCE_INTERVALS[record.type]?.label ?? record.type}</Text>
                  <Text style={styles.historySub}>
                    {record.km.toLocaleString()} km · {new Date(record.date).toLocaleDateString('it-IT')}
                  </Text>
                </View>
                {record.cost ? <Text style={styles.historyCost}>€{record.cost}</Text> : null}
              </TouchableOpacity>
            ))}
          </Card>
        </>
      )}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  motoCard: { margin: Spacing.md, gap: Spacing.xs },
  motoName: { ...(Typography.h2 as object) },
  motoKm:   { ...(Typography.bodyS as object), color: Colors.accent.primary },
  sectionTitle: { ...(Typography.label as object), paddingHorizontal: Spacing.md, paddingTop: Spacing.md, paddingBottom: Spacing.xs },
  remindersCard: { marginHorizontal: Spacing.md },
  reminderRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.sm, gap: Spacing.sm },
  reminderIcon: { fontSize: 22, width: 28, textAlign: 'center' },
  reminderInfo: { flex: 1 },
  reminderLabel: { ...(Typography.body as object), fontWeight: '600' },
  reminderSub: { ...(Typography.caption as object) },
  separator: { height: 1, backgroundColor: Colors.border.subtle },
  historyCard: { marginHorizontal: Spacing.md },
  historyRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.sm, gap: Spacing.sm },
  historyIcon: { fontSize: 20, width: 28, textAlign: 'center' },
  historyInfo: { flex: 1 },
  historyLabel: { ...(Typography.body as object) },
  historySub: { ...(Typography.caption as object) },
  historyCost: { ...(Typography.bodyS as object), color: Colors.accent.primary, fontWeight: '700' },
});

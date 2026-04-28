/**
 * SettingsScreen — impostazioni app con sezione profilo utente.
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { ScreenShell } from '@components/ui/ScreenShell';
import { Divider } from '@components/ui/Divider';
import { Colors, Spacing, Typography, Radius } from '@theme/index';
import { useAuthContext } from '@services/AuthContext';
import { useAppNavigation } from '@hooks/useAppNavigation';

interface SettingsRowProps {
  label: string;
  value?: string;
  onPress?: () => void;
  testID?: string;
  destructive?: boolean;
}

function SettingsRow({ label, value, onPress, testID, destructive }: SettingsRowProps) {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress}
      testID={testID} disabled={!onPress} activeOpacity={0.7}>
      <Text style={[styles.rowLabel, destructive && { color: Colors.status.danger }]}>{label}</Text>
      {value && <Text style={styles.rowValue}>{value}</Text>}
      {onPress && <Text style={styles.chevron}>›</Text>}
    </TouchableOpacity>
  );
}

export function SettingsScreen() {
  const { user, signOut } = useAuthContext();
  const nav = useAppNavigation();

  return (
    <ScreenShell testID="screen-settings" title="Impostazioni" scrollable>
      {/* Profilo */}
      {user && (
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>ACCOUNT</Text>
          <TouchableOpacity style={[styles.group, styles.profileRow]}
            onPress={() => nav.navigate('Profile')} testID="profile-row">
            {user.avatarUrl ? (
              <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarFallback}>
                <Text style={styles.avatarInitial}>{user.name.charAt(0).toUpperCase()}</Text>
              </View>
            )}
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user.name}</Text>
              <Text style={styles.profileEmail}>{user.email}</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* App */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>APP</Text>
        <View style={styles.group}>
          <SettingsRow label="Versione" value="1.0.0" testID="settings-version" />
          <Divider />
          <SettingsRow label="Notifiche"       onPress={() => {}} testID="settings-notifications" />
          <Divider />
          <SettingsRow label="Unità di misura" value="km" onPress={() => {}} testID="settings-units" />
        </View>
      </View>

      {/* Sicurezza */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>SICUREZZA</Text>
        <View style={styles.group}>
          <SettingsRow label="Countdown SOS"              value="30 sec" onPress={() => {}} testID="settings-sos-timer" />
          <Divider />
          <SettingsRow label="Chiama il 112 automaticamente" onPress={() => {}} testID="settings-auto-call" />
        </View>
      </View>

      {/* Info */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>INFORMAZIONI</Text>
        <View style={styles.group}>
          <SettingsRow label="Privacy policy"    onPress={() => {}} testID="settings-privacy" />
          <Divider />
          <SettingsRow label="Termini di servizio" onPress={() => {}} testID="settings-terms" />
        </View>
      </View>

      {/* Logout */}
      {user && (
        <View style={styles.section}>
          <View style={styles.group}>
            <SettingsRow label="Esci dall'account" onPress={signOut}
              destructive testID="settings-signout" />
          </View>
        </View>
      )}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  section:       { marginBottom: Spacing.lg },
  sectionHeader: { ...(Typography.labelS as object), color: Colors.text.muted, paddingHorizontal: Spacing.md, paddingBottom: Spacing.xs, paddingTop: Spacing.sm },
  group:         { backgroundColor: Colors.bg.secondary, borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.border.default, marginHorizontal: Spacing.md, overflow: 'hidden' },
  row:           { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.md, paddingVertical: 14, minHeight: 52 },
  rowLabel:      { ...(Typography.body as object), flex: 1 },
  rowValue:      { ...(Typography.bodyS as object), color: Colors.text.secondary, marginRight: Spacing.xs },
  chevron:       { fontSize: 20, color: Colors.text.muted },
  profileRow:    { flexDirection: 'row', alignItems: 'center', padding: Spacing.md, gap: Spacing.md },
  avatar:        { width: 48, height: 48, borderRadius: 24 },
  avatarFallback:{ width: 48, height: 48, borderRadius: 24, backgroundColor: Colors.accent.primary, alignItems: 'center', justifyContent: 'center' },
  avatarInitial: { fontSize: 20, fontWeight: '800', color: Colors.white },
  profileInfo:   { flex: 1 },
  profileName:   { ...(Typography.body as object), fontWeight: '600' },
  profileEmail:  { ...(Typography.caption as object) },
});

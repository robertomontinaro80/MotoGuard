/**
 * ProfileScreen — profilo utente autenticato con opzione logout.
 * Accessibile dalle Impostazioni.
 */

import React from 'react';
import { View, Text, StyleSheet, Image, Alert } from 'react-native';
import { ScreenShell } from '@components/ui/ScreenShell';
import { Card } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { Badge } from '@components/ui/Badge';
import { Spacer } from '@components/ui/Divider';
import { Colors, Spacing, Typography, Radius } from '@theme/index';
import { useAuthContext } from '@services/AuthContext';

export function ProfileScreen() {
  const { user, signOut } = useAuthContext();

  const handleSignOut = () => {
    Alert.alert(
      'Esci dall\'account',
      'Sei sicuro di voler disconnetterti?',
      [
        { text: 'Annulla', style: 'cancel' },
        { text: 'Esci', style: 'destructive', onPress: signOut },
      ],
    );
  };

  if (!user) return null;

  const providerLabel = user.provider === 'google' ? '🔵 Google' : '📘 Facebook';
  const providerStatus = user.provider === 'google' ? 'info' : 'neutral';

  return (
    <ScreenShell title="Profilo" showBack testID="screen-profile">
      {/* Avatar + nome */}
      <Card style={styles.profileCard} testID="profile-card">
        <View style={styles.avatarWrapper}>
          {user.avatarUrl ? (
            <Image
              source={{ uri: user.avatarUrl }}
              style={styles.avatar}
              testID="profile-avatar"
            />
          ) : (
            <View style={styles.avatarFallback}>
              <Text style={styles.avatarInitial}>
                {user.name.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
        </View>

        <Text style={styles.name} testID="profile-name">{user.name}</Text>
        <Text style={styles.email} testID="profile-email">{user.email}</Text>

        <Badge
          label={providerLabel}
          status={providerStatus as any}
          testID="provider-badge"
        />
      </Card>

      <Spacer size="lg" />

      {/* Logout */}
      <Button
        label="Esci dall'account"
        variant="danger"
        fullWidth
        onPress={handleSignOut}
        testID="signout-btn"
        style={{ marginHorizontal: Spacing.md }}
      />

      <Spacer size="md" />

      <Text style={styles.note}>
        I tuoi dati (moto, manutenzioni, contatti SOS) rimangono salvati sul dispositivo
        anche dopo il logout.
      </Text>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  profileCard: {
    margin: Spacing.md,
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.xl,
  },
  avatarWrapper: {
    marginBottom: Spacing.sm,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 3,
    borderColor: Colors.accent.primary,
  },
  avatarFallback: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: Colors.accent.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontSize: 36,
    fontWeight: '800',
    color: Colors.white,
  },
  name: {
    ...(Typography.h2 as object),
    textAlign: 'center',
  },
  email: {
    ...(Typography.bodyS as object),
    textAlign: 'center',
  },
  note: {
    ...(Typography.caption as object),
    textAlign: 'center',
    paddingHorizontal: Spacing.xl,
    lineHeight: 18,
  },
});

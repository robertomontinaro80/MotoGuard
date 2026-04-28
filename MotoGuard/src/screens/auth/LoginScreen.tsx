/**
 * LoginScreen — schermata di login con Google e Facebook.
 * Mostrata se l'utente non è autenticato.
 */

import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ActivityIndicator, Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography, Radius, Shadows } from '@theme/index';
import { useAuthContext } from '@services/AuthContext';

// ─── Bottone social ────────────────────────────────────────────────────────

interface SocialButtonProps {
  label: string;
  icon: string;
  onPress: () => void;
  loading?: boolean;
  backgroundColor?: string;
  textColor?: string;
  testID?: string;
}

function SocialButton({
  label, icon, onPress, loading = false,
  backgroundColor = Colors.white,
  textColor = '#1A1A1A',
  testID,
}: SocialButtonProps) {
  return (
    <TouchableOpacity
      testID={testID}
      onPress={onPress}
      disabled={loading}
      activeOpacity={0.85}
      style={[styles.socialBtn, { backgroundColor }, Shadows.card]}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      {loading ? (
        <ActivityIndicator size="small" color={textColor} />
      ) : (
        <>
          <Text style={styles.socialIcon}>{icon}</Text>
          <Text style={[styles.socialLabel, { color: textColor }]}>{label}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

// ─── LoginScreen ───────────────────────────────────────────────────────────

export function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { signInWithGoogle, signInWithFacebook, authLoading, error } = useAuthContext();

  return (
    <View style={[styles.root, { paddingTop: insets.top, paddingBottom: insets.bottom }]}
      testID="screen-login">
      {/* Hero */}
      <View style={styles.hero}>
        <Text style={styles.heroEmoji}>🏍️</Text>
        <Text style={styles.heroTitle}>MotoGuard</Text>
        <Text style={styles.heroSub}>
          La tua app per manutenzione,{'\n'}meteo e sicurezza in moto
        </Text>
      </View>

      {/* Features preview */}
      <View style={styles.features}>
        {[
          { icon: '🔧', text: 'Reminder manutenzione automatici' },
          { icon: '🌦️', text: 'Briefing meteo pre-uscita' },
          { icon: '🚨', text: 'SOS automatico in caso di caduta' },
        ].map((f) => (
          <View key={f.text} style={styles.featureRow}>
            <Text style={styles.featureIcon}>{f.icon}</Text>
            <Text style={styles.featureText}>{f.text}</Text>
          </View>
        ))}
      </View>

      {/* Login buttons */}
      <View style={styles.buttons}>
        <Text style={styles.loginTitle}>Accedi per iniziare</Text>

        {error && (
          <Text style={styles.error} testID="login-error">{error}</Text>
        )}

        <SocialButton
          label="Continua con Google"
          icon="🔵"
          onPress={signInWithGoogle}
          loading={authLoading}
          backgroundColor={Colors.white}
          textColor="#1A1A1A"
          testID="google-login-btn"
        />

        <SocialButton
          label="Continua con Facebook"
          icon="📘"
          onPress={signInWithFacebook}
          loading={authLoading}
          backgroundColor="#1877F2"
          textColor={Colors.white}
          testID="facebook-login-btn"
        />

        <Text style={styles.disclaimer}>
          Accedendo accetti i{' '}
          <Text style={styles.link}>Termini di Servizio</Text>
          {' '}e la{' '}
          <Text style={styles.link}>Privacy Policy</Text>
        </Text>
      </View>
    </View>
  );
}

// ─── Stili ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.bg.primary,
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
  },
  hero: {
    alignItems: 'center',
    paddingTop: Spacing.xxl,
    gap: Spacing.sm,
  },
  heroEmoji: { fontSize: 72 },
  heroTitle: {
    fontSize: 36,
    fontWeight: '900',
    color: Colors.text.primary,
    letterSpacing: -1,
  },
  heroSub: {
    ...(Typography.body as object),
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  features: {
    gap: Spacing.md,
    paddingHorizontal: Spacing.sm,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.bg.secondary,
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border.default,
  },
  featureIcon: { fontSize: 24 },
  featureText: {
    ...(Typography.body as object),
    flex: 1,
  },
  buttons: {
    gap: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  loginTitle: {
    ...(Typography.h3 as object),
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  error: {
    color: Colors.status.danger,
    fontSize: 13,
    textAlign: 'center',
  },
  socialBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    borderRadius: Radius.md,
    paddingVertical: 16,
    paddingHorizontal: Spacing.lg,
    minHeight: 56,
  },
  socialIcon: { fontSize: 20 },
  socialLabel: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  disclaimer: {
    ...(Typography.caption as object),
    textAlign: 'center',
    lineHeight: 18,
  },
  link: {
    color: Colors.accent.primary,
    fontWeight: '600',
  },
});

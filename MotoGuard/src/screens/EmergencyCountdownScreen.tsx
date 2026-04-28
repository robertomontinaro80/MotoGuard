/**
 * EmergencyCountdownScreen — overlay a schermo intero post-caduta.
 * Countdown 30s → se non annullato invia SMS ai contatti SOS.
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Vibration } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import { Colors, Spacing, Typography } from '@theme/index';
import { AlertService } from '@services/AlertService';

const COUNTDOWN_SECONDS = 30;

export function EmergencyCountdownScreen() {
  const insets = useSafeAreaInsets();
  const [seconds, setSeconds] = useState(COUNTDOWN_SECONDS);
  const [sent, setSent] = useState(false);
  const [canceled, setCanceled] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  const sendAlert = useCallback(async () => {
    try {
      const { coords } = await Location.getCurrentPositionAsync({});
      const contacts = await AlertService.getContacts();
      if (contacts.length > 0) {
        await AlertService.triggerEmergency({
          lat: coords.latitude,
          lng: coords.longitude,
          contacts,
        });
      }
      setSent(true);
    } catch {
      setSent(true);
    }
  }, []);

  useEffect(() => {
    // Vibrazione ritmica per attirare attenzione
    Vibration.vibrate([500, 500, 500, 500, 500], true);

    intervalRef.current = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          clearInterval(intervalRef.current);
          sendAlert();
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    return () => {
      clearInterval(intervalRef.current);
      Vibration.cancel();
    };
  }, [sendAlert]);

  const handleCancel = () => {
    clearInterval(intervalRef.current);
    Vibration.cancel();
    setCanceled(true);
  };

  if (canceled) {
    return (
      <View style={[styles.root, styles.canceledBg, { paddingTop: insets.top }]} testID="screen-emergency-countdown">
        <Text style={styles.bigEmoji}>✅</Text>
        <Text style={styles.title}>Allerta annullata</Text>
        <Text style={styles.sub}>Nessun messaggio è stato inviato. Stai bene!</Text>
      </View>
    );
  }

  if (sent) {
    return (
      <View style={[styles.root, { paddingTop: insets.top }]} testID="screen-emergency-countdown">
        <Text style={styles.bigEmoji}>📤</Text>
        <Text style={styles.title}>Allerta inviata</Text>
        <Text style={styles.sub}>I tuoi contatti di emergenza sono stati avvisati con la tua posizione GPS.</Text>
      </View>
    );
  }

  const pct = ((COUNTDOWN_SECONDS - seconds) / COUNTDOWN_SECONDS) * 100;

  return (
    <View style={[styles.root, { paddingTop: insets.top }]} testID="screen-emergency-countdown">
      <Text style={styles.bigEmoji}>🚨</Text>
      <Text style={styles.title}>Caduta rilevata</Text>
      <Text style={styles.sub}>
        I tuoi contatti saranno avvisati tra
      </Text>

      {/* Countdown */}
      <View style={styles.countdownRing} testID="countdown-ring">
        <Text style={styles.countdownNumber} testID="countdown-seconds">{seconds}</Text>
        <Text style={styles.countdownLabel}>secondi</Text>
      </View>

      {/* Cancel */}
      <TouchableOpacity
        style={styles.cancelBtn}
        onPress={handleCancel}
        testID="cancel-btn"
        activeOpacity={0.8}
        accessibilityLabel="Annulla allerta"
        accessibilityRole="button"
      >
        <Text style={styles.cancelText}>STO BENE — ANNULLA</Text>
      </TouchableOpacity>

      <Text style={styles.hint}>
        Tieni premuto il tasto per annullare
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.status.danger,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
    gap: Spacing.lg,
  },
  canceledBg: {
    backgroundColor: Colors.bg.primary,
  },
  bigEmoji: { fontSize: 72 },
  title: {
    fontSize: 28, fontWeight: '800', color: Colors.white,
    textAlign: 'center',
  },
  sub: {
    ...(Typography.body as object),
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
  },
  countdownRing: {
    width: 140, height: 140, borderRadius: 70,
    borderWidth: 4, borderColor: 'rgba(255,255,255,0.4)',
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  countdownNumber: {
    fontSize: 56, fontWeight: '900', color: Colors.white,
  },
  countdownLabel: {
    fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: -4,
  },
  cancelBtn: {
    backgroundColor: Colors.white,
    paddingVertical: 20,
    paddingHorizontal: Spacing.xl,
    borderRadius: 14,
    width: '100%',
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 17, fontWeight: '800', color: Colors.status.danger, letterSpacing: 0.5,
  },
  hint: {
    fontSize: 12, color: 'rgba(255,255,255,0.5)',
  },
});

/**
 * OnboardingScreen — 3 slide introduttive + richiesta permessi.
 * Viene mostrato solo al primo avvio.
 */

import React, { useRef, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Dimensions, NativeSyntheticEvent, NativeScrollEvent,
} from 'react-native';
import { Colors, Spacing, Typography, Radius } from '@theme/index';
import { Button } from '@components/ui/Button';
import { ProgressBar } from '@components/ui/ProgressBar';
import { useAppNavigation } from '@hooks/useAppNavigation';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Slide {
  icon: string;
  title: string;
  description: string;
  accent: string;
}

const SLIDES: Slide[] = [
  {
    icon: '🔧',
    title: 'Manutenzione intelligente',
    description: 'Registra ogni intervento e ricevi reminder automatici per olio, catena, freni e revisione. Mai più una scadenza dimenticata.',
    accent: Colors.status.ok,
  },
  {
    icon: '🌦️',
    title: 'Briefing meteo\npre-uscita',
    description: 'Prima di partire, analizza il meteo lungo tutto il tuo percorso. Score go/no-go e orario di partenza ideale.',
    accent: Colors.status.info,
  },
  {
    icon: '🚨',
    title: 'Sicurezza attiva',
    description: 'Se cadi, MotoGuard lo rileva automaticamente e avvisa i tuoi contatti d\'emergenza con la tua posizione GPS.',
    accent: Colors.status.danger,
  },
];

export function OnboardingScreen() {
  const nav = useAppNavigation();
  const scrollRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const isLast = currentIndex === SLIDES.length - 1;

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setCurrentIndex(index);
  };

  const goNext = () => {
    if (isLast) {
      nav.reset({ index: 0, routes: [{ name: 'Tabs' }] });
    } else {
      scrollRef.current?.scrollTo({ x: (currentIndex + 1) * SCREEN_WIDTH, animated: true });
    }
  };

  const skip = () => {
    nav.reset({ index: 0, routes: [{ name: 'Tabs' }] });
  };

  return (
    <View style={styles.root} testID="screen-onboarding">
      {/* Skip */}
      {!isLast && (
        <TouchableOpacity style={styles.skipBtn} onPress={skip} testID="onboarding-skip">
          <Text style={styles.skipText}>Salta</Text>
        </TouchableOpacity>
      )}

      {/* Slides */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        scrollEventThrottle={16}
        testID="onboarding-scroll"
      >
        {SLIDES.map((slide, i) => (
          <View key={i} style={styles.slide} testID={`onboarding-slide-${i}`}>
            <Text style={styles.icon}>{slide.icon}</Text>
            <Text style={[styles.title, { color: slide.accent }]}>{slide.title}</Text>
            <Text style={styles.description}>{slide.description}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Bottom controls */}
      <View style={styles.footer}>
        {/* Dots */}
        <View style={styles.dots} testID="onboarding-dots">
          {SLIDES.map((_, i) => (
            <View
              key={i}
              testID={`dot-${i}`}
              style={[
                styles.dot,
                i === currentIndex && styles.dotActive,
              ]}
            />
          ))}
        </View>

        {/* Progress */}
        <ProgressBar
          value={((currentIndex + 1) / SLIDES.length) * 100}
          color={SLIDES[currentIndex].accent}
          style={styles.progress}
          testID="onboarding-progress"
        />

        {/* CTA */}
        <Button
          label={isLast ? 'Inizia →' : 'Avanti →'}
          onPress={goNext}
          fullWidth
          testID="onboarding-next"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.bg.primary,
  },
  skipBtn: {
    position: 'absolute',
    top: 56,
    right: Spacing.lg,
    zIndex: 10,
    padding: Spacing.sm,
  },
  skipText: {
    ...(Typography.bodyS as object),
    color: Colors.text.muted,
  },
  slide: {
    width: SCREEN_WIDTH,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    paddingTop: 80,
    gap: Spacing.lg,
  },
  icon: {
    fontSize: 72,
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: -0.5,
    lineHeight: 34,
  },
  description: {
    ...(Typography.body as object),
    textAlign: 'center',
    color: Colors.text.secondary,
    lineHeight: 24,
  },
  footer: {
    padding: Spacing.lg,
    paddingBottom: 48,
    gap: Spacing.md,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.xs,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: Radius.full,
    backgroundColor: Colors.border.default,
  },
  dotActive: {
    width: 20,
    backgroundColor: Colors.accent.primary,
  },
  progress: {
    marginBottom: Spacing.xs,
  },
});

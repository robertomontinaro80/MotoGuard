/**
 * useFallDetector — hook che collega FallDetector, location e AlertService.
 * Avvia il monitoraggio quando la velocità supera 10 km/h.
 */

import { useEffect, useRef, useCallback } from 'react';
import * as Location from 'expo-location';
import { FallDetector, FallAnalysisResult } from '@services/FallDetector';
import { AlertService } from '@services/AlertService';
import { useAppNavigation } from './useAppNavigation';

export function useFallDetector(enabled: boolean) {
  const nav = useAppNavigation();
  const detectorRef = useRef<FallDetector | null>(null);
  const locationSubRef = useRef<Location.LocationSubscription | null>(null);

  const handleFall = useCallback(async (_result: FallAnalysisResult) => {
    // Naviga alla schermata countdown
    nav.navigate('EmergencyCountdown', { fallEventId: 'auto' });
  }, [nav]);

  useEffect(() => {
    if (!enabled) {
      detectorRef.current?.stop();
      locationSubRef.current?.remove();
      return;
    }

    let detector: FallDetector;

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      detector = new FallDetector(handleFall, 0);
      detectorRef.current = detector;

      locationSubRef.current = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, timeInterval: 2000, distanceInterval: 5 },
        (location) => {
          const speedMs = location.coords.speed ?? 0;
          const speedKmh = speedMs * 3.6;
          detector.updateSpeed(speedKmh);
        },
      );

      detector.start();
    })();

    return () => {
      detectorRef.current?.stop();
      locationSubRef.current?.remove();
    };
  }, [enabled, handleFall]);
}

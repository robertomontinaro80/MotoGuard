/**
 * Performance utilities — lazy loading, memoization, bundle splitting.
 */

import React, { lazy, Suspense } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Colors } from '@theme/index';

// ─── Lazy screen loader ────────────────────────────────────────────────────

/**
 * Carica uno schermata in lazy loading con fallback spinner.
 * Usato per schermate pesanti (mappe, grafici) per ridurre il bundle iniziale.
 *
 * @example
 * const LazyWeatherBriefing = lazyScreen(() => import('@screens/WeatherBriefingScreen'));
 */
export function lazyScreen<T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
) {
  const LazyComponent = lazy(importFn);

  return function LazyWrapper(props: React.ComponentProps<T>) {
    return (
      <Suspense fallback={<LoadingFallback />}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
}

function LoadingFallback() {
  return (
    <View style={{ flex: 1, backgroundColor: Colors.bg.primary, alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator size="large" color={Colors.accent.primary} />
    </View>
  );
}

// ─── Debounce ──────────────────────────────────────────────────────────────

export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delayMs: number,
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delayMs);
  };
}

// ─── Throttle ─────────────────────────────────────────────────────────────

export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  limitMs: number,
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  return (...args) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => { inThrottle = false; }, limitMs);
    }
  };
}

// ─── Memoize (per funzioni pure costose) ──────────────────────────────────

export function memoize<T extends (...args: any[]) => any>(fn: T): T {
  const cache = new Map<string, ReturnType<T>>();
  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key)!;
    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

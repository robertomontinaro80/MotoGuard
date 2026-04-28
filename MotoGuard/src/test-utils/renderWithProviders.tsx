/**
 * Custom render wrapper per i test.
 * Avvolge i componenti con tutti i Provider necessari (navigation, theme, store).
 * Usare SEMPRE questa funzione al posto di render() di @testing-library/react-native.
 *
 * @example
 * import { renderWithProviders } from '@test-utils/renderWithProviders';
 * const { getByText } = renderWithProviders(<MyComponent />);
 */

import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// ─── Tipi ──────────────────────────────────────────────────────────────────

interface RenderWithProvidersOptions extends Omit<RenderOptions, 'wrapper'> {
  /** Stato iniziale dello store Zustand (opzionale) */
  initialStoreState?: Record<string, unknown>;
  /** Disabilita NavigationContainer (per componenti che non navigano) */
  withNavigation?: boolean;
}

// ─── Provider wrapper ──────────────────────────────────────────────────────

function AllProviders({ children }: { children: React.ReactNode }) {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider
        initialMetrics={{
          frame: { x: 0, y: 0, width: 375, height: 812 },
          insets: { top: 44, left: 0, right: 0, bottom: 34 },
        }}
      >
        <NavigationContainer>
          {children}
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

// ─── Export principale ─────────────────────────────────────────────────────

export function renderWithProviders(
  ui: ReactElement,
  options: RenderWithProvidersOptions = {},
) {
  const { withNavigation = true, ...renderOptions } = options;

  const Wrapper = withNavigation ? AllProviders : ({ children }: { children: React.ReactNode }) => <>{children}</>;

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

// Re-export tutto da @testing-library per comodità
export * from '@testing-library/react-native';
export { renderWithProviders as render };

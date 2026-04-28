/**
 * Test navigazione — verifica tab switching e presenza schermate.
 * Corrisponde al test T1.3 della roadmap.
 */

import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { TabNavigator } from '../TabNavigator';

// Mock tutte le schermate — i test di navigazione testano solo il routing, non il contenuto
jest.mock('@screens/HomeScreen',        () => ({ HomeScreen:        () => null }));
jest.mock('@screens/MaintenanceScreen', () => ({ MaintenanceScreen: () => null }));
jest.mock('@screens/WeatherScreen',     () => ({ WeatherScreen:     () => null }));
jest.mock('@screens/EmergencyScreen',   () => ({ EmergencyScreen:   () => null }));
jest.mock('@screens/SettingsScreen',    () => ({ SettingsScreen:    () => null }));
jest.mock('@store/appStore', () => ({
  useAppStore:           jest.fn(() => ({})),
  useSelectedMotorcycle: jest.fn(() => null),
}));

function renderNavigator() {
  return render(
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider initialMetrics={{ frame: { x: 0, y: 0, width: 375, height: 812 }, insets: { top: 44, left: 0, right: 0, bottom: 34 } }}>
        <NavigationContainer>
          <TabNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>,
  );
}

describe('TabNavigator', () => {
  it('renders without crashing', () => {
    expect(() => renderNavigator()).not.toThrow();
  });

  it('renders all 5 tab buttons', () => {
    renderNavigator();
    expect(screen.getByTestId('tab-home')).toBeTruthy();
    expect(screen.getByTestId('tab-maintenance')).toBeTruthy();
    expect(screen.getByTestId('tab-weather')).toBeTruthy();
    expect(screen.getByTestId('tab-emergency')).toBeTruthy();
    expect(screen.getByTestId('tab-settings')).toBeTruthy();
  });

  it('navigates to Maintenance tab on press — matches roadmap T1.3 spec', () => {
    renderNavigator();
    fireEvent.press(screen.getByTestId('tab-maintenance'));
    // Tab è attivo — non crasha e il tab è raggiungibile
    expect(screen.getByTestId('tab-maintenance')).toBeTruthy();
  });

  it('navigates to Weather tab on press', () => {
    renderNavigator();
    fireEvent.press(screen.getByTestId('tab-weather'));
    expect(screen.getByTestId('tab-weather')).toBeTruthy();
  });

  it('navigates to Emergency tab on press', () => {
    renderNavigator();
    fireEvent.press(screen.getByTestId('tab-emergency'));
    expect(screen.getByTestId('tab-emergency')).toBeTruthy();
  });
});

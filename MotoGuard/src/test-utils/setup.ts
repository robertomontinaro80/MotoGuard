/**
 * Setup globale per Jest — viene eseguito prima di ogni test suite.
 * Configura mock per i moduli nativi di Expo/React Native.
 */

import React from 'react';

// extend-expect is loaded via setupFilesAfterEnv in package.json

// ─── Mock moduli nativi ────────────────────────────────────────────────────

// expo-notifications
jest.mock('expo-notifications', () => ({
  scheduleNotificationAsync: jest.fn().mockResolvedValue('notification-id-123'),
  cancelScheduledNotificationAsync: jest.fn().mockResolvedValue(undefined),
  getAllScheduledNotificationsAsync: jest.fn().mockResolvedValue([]),
  requestPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  setNotificationHandler: jest.fn(),
  addNotificationReceivedListener: jest.fn(() => ({ remove: jest.fn() })),
  addNotificationResponseReceivedListener: jest.fn(() => ({ remove: jest.fn() })),
}));

// expo-location
jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  requestBackgroundPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  getCurrentPositionAsync: jest.fn().mockResolvedValue({
    coords: { latitude: 45.4642, longitude: 9.1900, accuracy: 5 },
  }),
  watchPositionAsync: jest.fn().mockReturnValue({ remove: jest.fn() }),
}));

// expo-sensors
jest.mock('expo-sensors', () => ({
  Accelerometer: {
    setUpdateInterval: jest.fn(),
    addListener: jest.fn(() => ({ remove: jest.fn() })),
    removeAllListeners: jest.fn(),
  },
  Gyroscope: {
    setUpdateInterval: jest.fn(),
    addListener: jest.fn(() => ({ remove: jest.fn() })),
    removeAllListeners: jest.fn(),
  },
}));

// expo-image-picker
jest.mock('expo-image-picker', () => ({
  requestMediaLibraryPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  launchImageLibraryAsync: jest.fn().mockResolvedValue({
    canceled: false,
    assets: [{ uri: 'file://test-image.jpg' }],
  }),
}));

// react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => {
  const insets = { top: 44, right: 0, bottom: 34, left: 0 };
  return {
    SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
    SafeAreaView: ({ children }: { children: React.ReactNode }) => children,
    useSafeAreaInsets: () => insets,
    useSafeAreaFrame: () => ({ x: 0, y: 0, width: 375, height: 812 }),
  };
});

// expo-linking
jest.mock('expo-linking', () => ({
  canOpenURL: jest.fn().mockResolvedValue(true),
  openURL: jest.fn().mockResolvedValue(undefined),
}));

// react-native-gesture-handler
jest.mock('react-native-gesture-handler', () => {
  const View = require('react-native').View;
  return {
    GestureHandlerRootView: View,
    TouchableOpacity: require('react-native').TouchableOpacity,
  };
});

// react-native-reanimated
jest.mock('react-native-reanimated', () =>
  require('react-native-reanimated/mock'),
);

// Mock services/database (in-memory)
jest.mock('@services/database', () => ({
  db: {
    load: jest.fn().mockResolvedValue(undefined),
    getMotorcycles:      jest.fn().mockResolvedValue([]),
    getMotorcycle:       jest.fn().mockResolvedValue(null),
    saveMotorcycle:      jest.fn().mockImplementation(async (m) => m),
    deleteMotorcycle:    jest.fn().mockResolvedValue(undefined),
    getMaintenanceByMoto:jest.fn().mockResolvedValue([]),
    getLastMaintenance:  jest.fn().mockResolvedValue(null),
    saveMaintenance:     jest.fn().mockImplementation(async (r) => r),
    deleteMaintenance:   jest.fn().mockResolvedValue(undefined),
    getContacts:         jest.fn().mockResolvedValue([]),
    saveContact:         jest.fn().mockImplementation(async (c) => c),
    deleteContact:       jest.fn().mockResolvedValue(undefined),
    saveFallEvent:       jest.fn().mockImplementation(async (e) => e),
  },
  generateId: jest.fn(() => 'mock-id-' + Math.random().toString(36).slice(2, 7)),
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);
jest.mock('@react-navigation/native', () => {
  const actual = jest.requireActual('@react-navigation/native');
  return {
    ...actual,
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
      reset: jest.fn(),
    }),
    useRoute: () => ({ params: {} }),
    useFocusEffect: jest.fn(),
  };
});

// AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

// ─── Utility globali ───────────────────────────────────────────────────────

// Sopprime warning noti nei test (non errori)
const originalWarn = console.warn;
beforeAll(() => {
  console.warn = (message: string, ...args: unknown[]) => {
    const suppressed = [
      'ReactDOM.render is no longer supported',
      'Warning: An update to',
      'Warning: Can\'t perform a React state update',
    ];
    if (suppressed.some((s) => message?.includes?.(s))) return;
    originalWarn(message, ...args);
  };
});

afterAll(() => {
  console.warn = originalWarn;
});

// Reset mock tra i test
afterEach(() => {
  jest.clearAllMocks();
});

// expo-secure-store
jest.mock('expo-secure-store', () => ({
  setItemAsync:    jest.fn().mockResolvedValue(undefined),
  getItemAsync:    jest.fn().mockResolvedValue(null),
  deleteItemAsync: jest.fn().mockResolvedValue(undefined),
}));

// expo-auth-session
jest.mock('expo-auth-session', () => ({
  makeRedirectUri: jest.fn(() => 'motoguard://redirect'),
  useAutoDiscovery: jest.fn(),
}));
jest.mock('expo-auth-session/providers/google', () => ({
  useAuthRequest: jest.fn(() => [null, null, jest.fn()]),
}));
jest.mock('expo-auth-session/providers/facebook', () => ({
  useAuthRequest: jest.fn(() => [null, null, jest.fn()]),
}));

// expo-web-browser
jest.mock('expo-web-browser', () => ({
  maybeCompleteAuthSession: jest.fn(),
  openBrowserAsync: jest.fn().mockResolvedValue({ type: 'cancel' }),
}));

// expo-constants
jest.mock('expo-constants', () => ({
  default: { expoConfig: { extra: { googleClientIdExpo: '', facebookAppId: '' } } },
  expoConfig: { extra: {} },
}));

// AuthContext — default mock (overrideable per-test)
jest.mock('@services/AuthContext', () => ({
  AuthProvider:    ({ children }: { children: React.ReactNode }) => children,
  useAuthContext: () => ({
    user: null,
    loading: false,
    authLoading: false,
    error: null,
    signInWithGoogle:   jest.fn(),
    signInWithFacebook: jest.fn(),
    signOut:            jest.fn(),
  }),
}));

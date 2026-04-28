/**
 * Root component — configura provider globali.
 * Se l'utente non è autenticato mostra LoginScreen,
 * altrimenti mostra l'app completa.
 */

import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { Colors } from '@theme/index';
import { RootNavigator } from '@navigation/RootNavigator';
import { AuthProvider, useAuthContext } from '@services/AuthContext';
import { LoginScreen } from '@screens/auth/LoginScreen';

function AppGate() {
  const { user, loading } = useAuthContext();

  if (loading) {
    return (
      <View style={styles.splash}>
        <ActivityIndicator size="large" color={Colors.accent.primary} />
      </View>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <NavigationContainer>
      <StatusBar style="light" backgroundColor={Colors.bg.primary} />
      <RootNavigator />
    </NavigationContainer>
  );
}

export function App() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <AuthProvider>
          <AppGate />
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root:   { flex: 1, backgroundColor: Colors.bg.primary },
  splash: { flex: 1, backgroundColor: Colors.bg.primary, alignItems: 'center', justifyContent: 'center' },
});

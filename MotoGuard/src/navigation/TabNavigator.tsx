/**
 * TabNavigator — bottom tab bar principale dell'app.
 * 5 tab: Home, Manutenzione, Meteo, Emergenza, Impostazioni.
 */

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors, Spacing, Radius } from '@theme/index';
import { RootTabParamList } from '@types/index';

import {
  HomeIcon, WrenchIcon, CloudIcon, ShieldIcon, SettingsIcon,
} from '@components/ui/TabIcons';

// Schermate (skeleton per ora, implementate nelle fasi successive)
import { HomeScreen }        from '@screens/HomeScreen';
import { MaintenanceScreen } from '@screens/MaintenanceScreen';
import { WeatherScreen }     from '@screens/WeatherScreen';
import { EmergencyScreen }   from '@screens/EmergencyScreen';
import { SettingsScreen }    from '@screens/SettingsScreen';

const Tab = createBottomTabNavigator<RootTabParamList>();

export function TabNavigator() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: [
          styles.tabBar,
          { paddingBottom: Math.max(insets.bottom, Spacing.sm) },
        ],
        tabBarActiveTintColor:   Colors.accent.primary,
        tabBarInactiveTintColor: Colors.text.muted,
        tabBarShowLabel: true,
        tabBarLabelStyle: styles.label,
        tabBarBackground: () => <View style={styles.tabBarBg} />,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarTestID: 'tab-home',
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => <HomeIcon color={color} size={size - 2} />,
        }}
      />
      <Tab.Screen
        name="Maintenance"
        component={MaintenanceScreen}
        options={{
          tabBarTestID: 'tab-maintenance',
          tabBarLabel: 'Manutenzione',
          tabBarIcon: ({ color, size }) => <WrenchIcon color={color} size={size - 2} />,
        }}
      />
      <Tab.Screen
        name="Weather"
        component={WeatherScreen}
        options={{
          tabBarTestID: 'tab-weather',
          tabBarLabel: 'Meteo',
          tabBarIcon: ({ color, size }) => <CloudIcon color={color} size={size - 2} />,
        }}
      />
      <Tab.Screen
        name="Emergency"
        component={EmergencyScreen}
        options={{
          tabBarTestID: 'tab-emergency',
          tabBarLabel: 'SOS',
          tabBarIcon: ({ color, size }) => (
            <View style={styles.sosWrapper}>
              <ShieldIcon color={color} size={size - 2} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarTestID: 'tab-settings',
          tabBarLabel: 'Impostazioni',
          tabBarIcon: ({ color, size }) => <SettingsIcon color={color} size={size - 2} />,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.bg.secondary,
    borderTopColor: Colors.border.default,
    borderTopWidth: 1,
    height: Platform.OS === 'ios' ? 88 : 68,
    paddingTop: Spacing.xs,
  },
  tabBarBg: {
    flex: 1,
    backgroundColor: Colors.bg.secondary,
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.3,
    marginBottom: 2,
  },
  sosWrapper: {
    // Il tab SOS ha un trattamento visivo speciale
    borderRadius: Radius.full,
  },
});

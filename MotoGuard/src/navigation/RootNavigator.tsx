/**
 * RootNavigator — stack principale.
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Colors } from '@theme/index';
import { RootStackParamList } from '@types/index';

import { TabNavigator }            from './TabNavigator';
import { OnboardingScreen }        from '@screens/OnboardingScreen';
import { AddMotorcycleScreen }     from '@screens/AddMotorcycleScreen';
import { WeatherBriefingScreen }   from '@screens/WeatherBriefingScreen';
import { EmergencyCountdownScreen} from '@screens/EmergencyCountdownScreen';
import { ProfileScreen }           from '@screens/auth/ProfileScreen';
import { AddMaintenanceScreen, MaintenanceDetailScreen } from '@screens/StackScreens';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{
      headerShown: false,
      contentStyle: { backgroundColor: Colors.bg.primary },
      animation: 'slide_from_right',
    }}>
      <Stack.Screen name="Tabs"              component={TabNavigator} />
      <Stack.Screen name="Onboarding"        component={OnboardingScreen}
        options={{ animation: 'fade', gestureEnabled: false }} />
      <Stack.Screen name="AddMotorcycle"     component={AddMotorcycleScreen} />
      <Stack.Screen name="AddMaintenance"    component={AddMaintenanceScreen} />
      <Stack.Screen name="MaintenanceDetail" component={MaintenanceDetailScreen} />
      <Stack.Screen name="WeatherBriefing"   component={WeatherBriefingScreen}
        options={{ animation: 'slide_from_bottom' }} />
      <Stack.Screen name="EmergencyCountdown" component={EmergencyCountdownScreen}
        options={{ animation: 'fade', gestureEnabled: false }} />
      <Stack.Screen name="Profile"           component={ProfileScreen} />
    </Stack.Navigator>
  );
}

/**
 * useAppNavigation — wrapper tipizzato attorno a useNavigation.
 * Evita di importare i tipi in ogni schermata.
 *
 * @example
 * const nav = useAppNavigation();
 * nav.navigate('AddMotorcycle', { motorcycleId: '123' });
 */

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@types/index';

export type AppNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function useAppNavigation() {
  return useNavigation<AppNavigationProp>();
}

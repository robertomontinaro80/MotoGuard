/**
 * WeatherBriefingScreen — analisi meteo completa del percorso.
 * Implementa T3.3 della roadmap.
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { ScreenShell } from '@components/ui/ScreenShell';
import { Input } from '@components/ui/Input';
import { Button } from '@components/ui/Button';
import { VerdictCard } from '@components/ui/VerdictCard';
import { Spacer } from '@components/ui/Divider';
import { Colors, Spacing, Typography } from '@theme/index';
import { RouteAnalyzer } from '@services/RouteAnalyzer';
import { RouteWeatherAnalysis } from '@types/index';

// Coordinate città italiane di esempio per il geocoding semplificato
const CITY_COORDS: Record<string, { lat: number; lng: number }> = {
  'milano':    { lat: 45.4642, lng: 9.1900 },
  'roma':      { lat: 41.9028, lng: 12.4964 },
  'firenze':   { lat: 43.7696, lng: 11.2558 },
  'bologna':   { lat: 44.4949, lng: 11.3426 },
  'venezia':   { lat: 45.4408, lng: 12.3155 },
  'torino':    { lat: 45.0703, lng: 7.6869 },
  'napoli':    { lat: 40.8518, lng: 14.2681 },
  'genova':    { lat: 44.4056, lng: 8.9463 },
  'verona':    { lat: 45.4384, lng: 10.9916 },
  'trento':    { lat: 46.0748, lng: 11.1217 },
};

function resolveCoords(city: string) {
  return CITY_COORDS[city.toLowerCase().trim()] ?? null;
}

function interpolateRoute(
  from: { lat: number; lng: number },
  to: { lat: number; lng: number },
  steps = 5,
) {
  return Array.from({ length: steps }, (_, i) => ({
    lat: from.lat + (to.lat - from.lat) * (i / (steps - 1)),
    lng: from.lng + (to.lng - from.lng) * (i / (steps - 1)),
  }));
}

export function WeatherBriefingScreen() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<RouteWeatherAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setError(null);
    const fromCoords = resolveCoords(from);
    const toCoords   = resolveCoords(to);

    if (!fromCoords) { setError(`Città di partenza non trovata: "${from}"`); return; }
    if (!toCoords)   { setError(`Città di destinazione non trovata: "${to}"`); return; }

    setLoading(true);
    try {
      const coords = interpolateRoute(fromCoords, toCoords);
      const result = await RouteAnalyzer.analyze(coords);
      setAnalysis(result);
    } catch {
      setError('Impossibile recuperare i dati meteo. Controlla la connessione.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenShell title="Analisi percorso" showBack testID="screen-weather-briefing" scrollable>
      <View style={styles.form}>
        <Input
          label="Partenza"
          value={from}
          onChangeText={setFrom}
          placeholder="Es: Milano"
          testID="from-input"
        />
        <Spacer size="md" />
        <Input
          label="Destinazione"
          value={to}
          onChangeText={setTo}
          placeholder="Es: Firenze"
          testID="to-input"
        />
        <Spacer size="md" />

        {error && (
          <Text style={styles.error} testID="weather-error">{error}</Text>
        )}

        <Button
          label="Analizza percorso"
          onPress={handleAnalyze}
          loading={loading}
          fullWidth
          testID="analyze-btn"
        />
      </View>

      {loading && (
        <View style={styles.loadingContainer} testID="weather-loading">
          <ActivityIndicator size="large" color={Colors.accent.primary} />
          <Text style={styles.loadingText}>Analisi meteo in corso…</Text>
        </View>
      )}

      {analysis && !loading && (
        <View style={styles.result} testID="weather-result">
          <Text style={styles.sectionTitle}>Risultato analisi</Text>
          <VerdictCard analysis={analysis} testID="verdict-card" />

          {/* Timeline punti */}
          {analysis.points.length > 0 && (
            <View style={styles.timeline} testID="weather-timeline">
              <Text style={styles.sectionTitle}>Condizioni lungo il percorso</Text>
              {analysis.points.map((point, i) => (
                <View key={i} style={styles.timelineRow}>
                  <Text style={styles.timelineCondition}>
                    {point.condition === 'clear' ? '☀️' :
                     point.condition === 'rain' || point.condition === 'heavy_rain' ? '🌧️' :
                     point.condition === 'thunderstorm' ? '⛈️' :
                     point.condition === 'snow' ? '❄️' :
                     point.condition === 'fog' ? '🌫️' : '⛅'}
                  </Text>
                  <Text style={styles.timelineText}>
                    {`${point.temperatureCelsius.toFixed(0)}°C  💨${point.windSpeedKmh.toFixed(0)}km/h  🌧${point.precipitationMmH.toFixed(1)}mm/h`}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      )}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  form: {
    padding: Spacing.md,
  },
  error: {
    color: Colors.status.danger,
    fontSize: 13,
    marginBottom: Spacing.sm,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: Spacing.xl,
    gap: Spacing.md,
  },
  loadingText: {
    ...(Typography.bodyS as object),
    color: Colors.text.secondary,
  },
  result: {
    padding: Spacing.md,
    gap: Spacing.lg,
  },
  sectionTitle: {
    ...(Typography.h3 as object),
    marginBottom: Spacing.sm,
  },
  timeline: { gap: Spacing.sm },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.bg.secondary,
    borderRadius: 8,
    padding: Spacing.sm,
  },
  timelineCondition: { fontSize: 20 },
  timelineText: {
    ...(Typography.bodyS as object),
    flex: 1,
  },
});

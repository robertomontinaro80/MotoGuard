/**
 * WeatherScreen — briefing meteo pre-uscita.
 * Implementazione completa: T3.2, T3.3
 */

import React from 'react';
import { ScreenShell } from '@components/ui/ScreenShell';
import { EmptyState } from '@components/ui/EmptyState';
import { useAppNavigation } from '@hooks/useAppNavigation';

export function WeatherScreen() {
  const nav = useAppNavigation();

  return (
    <ScreenShell testID="screen-weather" title="Meteo Percorso">
      <EmptyState
        icon="🌦️"
        title="Controlla il meteo del tuo percorso"
        description="Inserisci destinazione e partenza per ricevere un briefing completo: score, rischi e orario ideale di partenza."
        actionLabel="Analizza percorso"
        onAction={() => nav.navigate('WeatherBriefing', {})}
        testID="weather-empty"
      />
    </ScreenShell>
  );
}

# 🏍️ MotoGuard

App mobile React Native (Expo) per motociclisti:
- **Manutenzione intelligente** — diario interventi, reminder automatici, storico costi
- **Briefing meteo pre-uscita** — score go/no-go per il percorso, finestra di partenza ottimale
- **Sicurezza attiva** — rilevamento caduta con accelerometro, countdown SOS, SMS con GPS ai contatti

---

## Quick Start

```bash
# Prerequisiti: Node.js 20+, Expo CLI
npm install -g expo-cli

# Clona e installa
git clone https://github.com/your-org/motoguard.git
cd motoguard
npm install

# Avvia
npm start          # Expo Go
npm run ios        # iOS Simulator
npm run android    # Android Emulator
```

## Test

```bash
npm test                 # tutti i test
npm run test:watch       # watch mode
npm run test:coverage    # report coverage
```

Coverage target: **≥80% lines/statements**, **≥75% functions**, **≥70% branches**

---

## Struttura

```
src/
├── components/ui/      # Design system (Button, Card, Badge, StatusIndicator…)
├── screens/            # Schermate app
├── navigation/         # Stack + Tab navigator
├── services/           # Business logic
│   ├── database.ts          # WatermelonDB schema + modelli
│   ├── MotorcycleRepository # CRUD moto
│   ├── MaintenanceRepository+ ReminderService
│   ├── WeatherService       # Open-Meteo API + cache
│   ├── RouteAnalyzer        # Score percorso + best departure
│   ├── FallDetector         # Algoritmo caduta (accelerometro)
│   └── AlertService         # SMS SOS + gestione contatti
├── store/              # Zustand global store
├── hooks/              # useAppNavigation, useFallDetector
├── theme/              # Colori, spacing, tipografia
├── types/              # TypeScript types
└── utils/              # formatters, helpers
```

## Fasi completate

| Task | Titolo | Stato |
|------|--------|-------|
| T1.1 | Setup & architettura | ✅ |
| T1.2 | Design system & theme | ✅ |
| T1.3 | Navigazione e screen skeleton | ✅ |
| T2.1 | Data layer manutenzione | ✅ |
| T2.2 | UI aggiunta moto | ✅ |
| T2.3 | Diario manutenzioni & reminder | ✅ |
| T3.1 | Integrazione API meteo | ✅ |
| T3.2 | Logica analisi percorso | ✅ |
| T3.3 | UI briefing meteo | ✅ |
| T4.1 | Rilevamento caduta | ✅ |
| T4.2 | Countdown e allerta SOS | ✅ |
| T4.3 | Gestione contatti emergenza | ✅ |
| T5.1 | Test suite completa | ✅ |

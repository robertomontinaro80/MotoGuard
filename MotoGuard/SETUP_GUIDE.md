# 🔑 Guida Setup MotoGuard

## 1. Autenticazione Social

### Google OAuth

1. Vai su [console.cloud.google.com](https://console.cloud.google.com)
2. Crea un nuovo progetto → **APIs & Services → Credentials**
3. Crea **OAuth 2.0 Client ID** per questi tre tipi:
   - **Web** (per Expo Go durante sviluppo) → copia in `extra.googleClientIdExpo`
   - **iOS** → Bundle ID: `com.yourcompany.motoguard` → copia in `extra.googleClientIdIos`
   - **Android** → Package: `com.yourcompany.motoguard` → copia in `extra.googleClientIdAndroid`
4. Scarica `GoogleService-Info.plist` (iOS) e `google-services.json` (Android)
5. Mettili nella root del progetto

### Facebook OAuth

1. Vai su [developers.facebook.com](https://developers.facebook.com) → **My Apps → Create App**
2. Aggiungi prodotto **Facebook Login**
3. In **Settings → Basic**: copia **App ID** in `extra.facebookAppId`
4. In **Facebook Login → Settings** aggiungi redirect URI:
   ```
   https://auth.expo.io/@your-expo-username/motoguard
   ```
5. Aggiungi in `app.json` → `ios.infoPlist`:
   ```json
   "FacebookAppID": "YOUR_FACEBOOK_APP_ID",
   "FacebookClientToken": "YOUR_CLIENT_TOKEN",
   "FacebookDisplayName": "MotoGuard"
   ```

### Aggiorna app.json

Sostituisci i placeholder in `app.json → extra`:

```json
"extra": {
  "googleClientIdExpo":    "123456789-xxxx.apps.googleusercontent.com",
  "googleClientIdIos":     "123456789-yyyy.apps.googleusercontent.com",
  "googleClientIdAndroid": "123456789-zzzz.apps.googleusercontent.com",
  "facebookAppId":         "9876543210"
}
```

---

## 2. EAS Build & Store Submission

### Setup iniziale

```bash
npm install -g eas-cli
eas login
eas init   # genera projectId
```

### Build

```bash
# Development build (Simulator)
eas build --profile development --platform ios

# Preview (TestFlight / Firebase)
eas build --profile preview --platform all

# Production
eas build --profile production --platform all
```

### Submission

```bash
# App Store (iOS)
eas submit --platform ios --profile production

# Play Store (Android)
eas submit --platform android --profile production
```

### Configura eas.json

Sostituisci i placeholder in `eas.json → submit → production`:
- `your@apple.id` → tuo Apple ID
- `YOUR_ASC_APP_ID` → App Store Connect App ID
- `YOUR_TEAM_ID` → Apple Developer Team ID
- Scarica `google-play-service-account.json` da Google Play Console

---

## 3. Test E2E con Detox

```bash
# Installa Detox CLI
npm install -g detox-cli

# Build app per test
npm run e2e:build

# Esegui test
npm run e2e:test
```

---

## 4. Permessi richiesti

| Permesso | Motivo |
|---|---|
| Location (foreground) | Posizione GPS per allerte SOS |
| Location (background) | Rilevamento caduta mentre guidi |
| Motion/Accelerometer | Algoritmo fall detection |
| Notifications | Reminder manutenzione |
| Photo Library | Foto scontrini interventi |

---

## 5. Variabili d'ambiente sensibili

Non committare mai nel repo:
- `GoogleService-Info.plist`
- `google-services.json`
- `google-play-service-account.json`
- Chiavi API nel codice

Usare sempre `app.json → extra` o variabili EAS Secrets:
```bash
eas secret:create --scope project --name GOOGLE_CLIENT_ID --value "xxx"
```

# Avtale

Avtale er en lokal iPhone-app for rask registrering og visning av avtaler. Appen har to separate kalendere: **Privat** og **En Ny Dag**.

## Funksjoner

- månedsvisning med avtaleprikker
- egen, rullbar dagsvisning
- filtrert oversikt over alle avtaler i valgt måned
- opprette, redigere og slette lokale avtaler
- lokale varsler med valgbar varslingstid og lyd
- valgfri haptisk tilbakemelding
- Face ID eller enhetskode for En Ny Dag
- automatisk låsing og skjuling i appveksleren
- lokal PC-synk på privat nettverk
- import av tidspunkt og maksimalt tre initialer
- paringstoken lagret i iOS Keychain

## Teknologi

- Expo SDK 57
- React Native 0.86
- TypeScript
- Expo Router med typed routes
- AsyncStorage for validerte lokale kalenderdata
- Expo SecureStore for paringstoken
- Expo Notifications
- Expo Local Authentication

## Utvikling

```powershell
git checkout feature/local-calendar-sync
git pull origin feature/local-calendar-sync
npm install
npm run typecheck
npx expo start --dev-client --clear
```

Ny development build ved native endringer:

```powershell
eas build --profile development --platform ios
```

## Produksjonskontroll

```powershell
npx expo install expo-secure-store
npm run release:check
```

Produksjonsbygget skal først startes når kontrollen består:

```powershell
eas build --platform ios
```

## Dokumentasjon

- [`docs/STATUS.md`](docs/STATUS.md) – teknisk status
- [`docs/TESTING.md`](docs/TESTING.md) – komplett testplan
- [`docs/SECURITY.md`](docs/SECURITY.md) – sikkerhetsmodell og risikoer
- [`docs/RELEASE.md`](docs/RELEASE.md) – utgivelsessjekkliste
- [`docs/PRIVACY_POLICY.md`](docs/PRIVACY_POLICY.md) – utkast til personvernerklæring

`package.json` og `package-lock.json` skal alltid committes sammen når versjon eller avhengigheter endres.

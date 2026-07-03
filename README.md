# Avtale

En enkel iPhone-app for avtaler, laget for rask registrering, stor tekst og lite friksjon.

Appen skal være enklere enn standard kalenderappen. Hovedmålet er at en avtale kan legges inn raskt ved å trykke på dato, skrive hva avtalen gjelder, velge klokkeslett og lagre.

## Teknologi

- Expo SDK 57
- React Native
- TypeScript
- Expo Router
- AsyncStorage
- lokale varsler
- Face ID / enhetskode
- development build på fysisk iPhone

## Produktretning

- Kalender først.
- Stor skrift som standard.
- Få valg.
- To kalenderområder: **Privat** og **En Ny Dag**.
- **En Ny Dag** låses med Face ID eller enhetskode.
- Avtaler får fast varsel 2 timer før.
- Tale/diktering skal senere være et raskt alternativ til skriving.

## Nåværende status

Privatkalenderen er ferdig med oppretting, redigering, sletting, Mine avtaler, lokal lagring og varsler. Face ID-flyten for En Ny Dag fungerer. Arbeidskalenderens grønne månedsvisning er opprettet, men arbeidsavtaler er ennå ikke koblet ferdig.

Se [`docs/STATUS.md`](docs/STATUS.md) for nøyaktig status, neste steg og viktige filer.

## Dokumentasjon

- [`docs/STATUS.md`](docs/STATUS.md) – nåværende status og neste steg
- [`docs/APP_PLAN.md`](docs/APP_PLAN.md) – overordnet app-plan
- [`docs/MVP_SCOPE.md`](docs/MVP_SCOPE.md) – første versjon
- [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md) – farger, typografi og layout
- [`docs/FEATURES.md`](docs/FEATURES.md) – funksjonskrav
- [`docs/TECHNICAL_PLAN.md`](docs/TECHNICAL_PLAN.md) – teknisk retning

## Lokal kjøring

```powershell
git pull
npm install
npx expo start --dev-client --clear
```

TypeScript-kontroll:

```powershell
npm run typecheck
```

Ny development build ved native endringer:

```powershell
eas build --profile development --platform ios
```

# Avtale

En enkel iPhone-app for avtaler, laget for rask registrering, stor tekst og lite friksjon.

Appen er kalenderstyrt: velg dato, skriv avtalen, velg klokkeslett og lagre. Data lagres lokalt på telefonen.

## Teknologi

- Expo SDK 57
- React Native 0.86
- TypeScript
- Expo Router med typed routes
- AsyncStorage
- lokale varsler med standard iPhone-lyd
- Face ID / enhetskode
- haptisk tilbakemelding
- development build på fysisk iPhone

## Funksjoner

- To separate kalendere: **Privat** og **En Ny Dag**
- **En Ny Dag** beskyttes med Face ID eller enhetskode
- Månedsvisning med markering av dagens dato og avtaleprikker
- Opprette, vise, redigere og slette avtaler
- Fast lokalt varsel 2 timer før avtalen
- Skriveforslag fra vanlige og tidligere brukte avtaletitler
- Haptisk respons på sentrale valg og tidsvelger
- Ingen konto, server eller synkronisering

## Status

MVP-funksjonene er implementert for begge kalendere og løsningen er klar for strukturert testing på fysisk iPhone.

Se:

- [`docs/STATUS.md`](docs/STATUS.md) – teknisk status
- [`docs/TESTING.md`](docs/TESTING.md) – testplan og feilrapportering
- [`docs/MVP_SCOPE.md`](docs/MVP_SCOPE.md) – avgrensning
- [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md) – visuell retning

## Lokal kjøring

```powershell
git pull
npm install
npm run typecheck
npx expo start --dev-client --clear
```

Ny development build kreves ved native endringer:

```powershell
eas build --profile development --platform ios
```

## Før commit

```powershell
npm install
npm run typecheck
git status
```

`package.json` og `package-lock.json` skal alltid committes sammen når avhengigheter endres.

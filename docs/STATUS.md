# Prosjektstatus

Sist oppdatert: 2026-07-08

## Teknisk løsning

- Expo SDK 57 og React Native 0.86
- TypeScript og Expo Router med typed routes
- AsyncStorage for validerte kalenderdata og vanlige innstillinger
- Expo SecureStore / iOS Keychain for paringstoken
- `expo-notifications` for lokale varsler
- `expo-local-authentication` for Face ID og enhetskode
- `expo-haptics` for valgfri fysisk tilbakemelding
- Lokal PC-bro på port 8788

## Implementert

### Start og innstillinger

- Tidsstyrt hilsen og valg mellom **Privat** og **En Ny Dag**
- Felles varslingstid for begge kalendere
- Standard iPhone-lyd av/på
- Haptikk av/på
- Testvarsel
- Sikker frakobling av PC etter Face ID eller kode

### Kalendere

- Månedsvisning, månedsbytte og markering av dagens dato
- Prikker på datoer med avtaler
- Dagsliste når en dato velges
- Opprette, redigere og slette lokale avtaler
- Skriveforslag fra standardvalg og tidligere avtaler
- Kronologisk avtaleliste
- Lokal lagring med validering før data brukes

### Varslinger

- Valg: av, 5, 15 eller 30 minutter, 1 eller 2 timer, eller 1 dag
- Gjelder private, lokale arbeidsavtaler og importerte perioder
- Eksisterende avtaler planlegges på nytt når innstillingen endres
- Arbeidsvarsler viser bare **En Ny Dag**, ikke tittel eller initialer
- Fokus, lydløs bryter og iOS-varslingsvalg kan påvirke levering og lyd

### En Ny Dag

- Åpnes med Face ID eller telefonens kode
- Alle arbeidsruter krever en aktiv autentisert sesjon
- Direkte lenker uten aktiv sesjon sendes til låseskjermen
- Innhold skjules umiddelbart i appveksleren
- Sesjonen låses etter 2 minutter i bakgrunnen
- Tilbake til startskjermen låser sesjonen umiddelbart

### PC-synk

- Lokal synk på samme private nettverk
- Importerer avtale-ID, starttid, sluttid og maksimalt tre initialer
- Fullt navn, notater og kontaktdata importeres ikke
- Initialer vises bare inne i den opplåste arbeidskalenderen
- Sist synkroniserte kalender beholdes når PC-en er utilgjengelig
- Bare lokale HTTP-adresser godtas
- 10 sekunders nettverkstidsavbrudd
- Responsstørrelse, antall avtaler, datoer og varighet valideres
- Paringstoken lagres i iOS Keychain

## Automatisk kontroll

Pull requests kjører:

```text
TypeScript-kontroll
Expo-konfigurasjonskontroll
npm audit for høye og kritiske produksjonssårbarheter
```

Siste sikkerhetsgjennomgang er dokumentert i [`SECURITY.md`](SECURITY.md).

## Før neste enhetstest

```powershell
git checkout feature/local-calendar-sync
git pull origin feature/local-calendar-sync
npx expo install expo-secure-store
npm run typecheck
npm audit --omit=dev --audit-level=high
eas build --profile development --platform ios
```

`npx expo install expo-secure-store` må kjøres lokalt slik at `package-lock.json` oppdateres og committes.

## Før produksjon

- Installer sikkerhetsoppdatering v3 for PC-portalen.
- Bytt paringstoken dersom et tidligere token kan ha blitt eksponert.
- Gjennomfør hele [`TESTING.md`](TESTING.md) på fysisk iPhone.
- Test via TestFlight før App Store-innsending.
- Opprett personvernerklæring og fyll ut App Privacy-svarene ut fra faktisk databehandling.

## Kjente begrensninger

- Lokal PC-trafikk bruker HTTP med token, ikke TLS. Bruk bare et privat og betrodd nettverk.
- Kalenderdata ligger i appens iOS-sandbox, men databasen har ikke egen applikasjonskryptering.
- Initialer er personopplysninger når de kan knyttes til en person.
- Systemtoner på iPhone kan ikke listes og velges fritt fra appen.

## Viktige filer

- `app/_layout.tsx` – rutebeskyttelse, appvekslerskjul og automatisk låsing
- `app/settings.tsx` – innstillinger
- `src/components/SettingsCards.tsx` – innstillingskomponenter
- `src/components/SelectedDayAppointments.tsx` – dagsliste
- `src/services/notificationService.ts` – lokale varsler
- `src/services/workCalendarConnectionStore.ts` – sikker paring
- `src/services/workCalendarSync.ts` – synkronisering
- `src/services/workCalendarSyncValidation.ts` – nettverks- og responsvalidering
- `src/services/appointmentPersistence.ts` – validering av lagrede avtaler
- `src/services/workSession.ts` – aktiv arbeidsøkt
- `docs/SECURITY.md` – sikkerhetsmodell og produksjonssjekkliste

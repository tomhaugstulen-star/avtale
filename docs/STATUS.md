# Prosjektstatus

Sist oppdatert: 2026-07-08

## Utgivelseskandidat

- Appversjon: **1.0.0**
- iOS bundle ID: `no.haugstulen.avtale`
- Produksjonsprofil: App Store-distribusjon med automatisk buildnummer
- Endelig byggkommando: `eas build --platform ios`

Produksjonsbygget skal først startes når `npm run release:check` består.

## Teknisk løsning

- Expo SDK 57 og React Native 0.86
- TypeScript og Expo Router med typed routes
- AsyncStorage for validerte kalenderdata og vanlige innstillinger
- Expo SecureStore / iOS Keychain for paringstoken
- lokale varsler med Expo Notifications
- Face ID og enhetskode med Expo Local Authentication
- valgfri haptisk tilbakemelding
- lokal PC-bro på port 8788

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
- Egen, rullbar side for valgt dato
- Egen knapp for dagens avtaler
- Filtrert liste over alle avtaler i valgt måned
- Opprette, redigere og slette lokale avtaler
- Skriveforslag fra standardvalg og tidligere avtaler
- Lokal lagring med validering før data brukes

### Varslinger

- Valg: av, 5, 15 eller 30 minutter, 1 eller 2 timer, eller 1 dag
- Gjelder private, lokale arbeidsavtaler og importerte perioder
- Eksisterende avtaler planlegges på nytt når innstillingen endres
- Arbeidsvarsler viser bare **En Ny Dag**, ikke tittel eller initialer

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

Lokal produksjonskontroll:

```powershell
npm run release:check
```

## Gjenstående før produksjonsbygg

`package-lock.json` må oppdateres lokalt etter SecureStore- og versjonsendringene:

```powershell
npx expo install expo-secure-store
npm install
git add package.json package-lock.json
git commit -m "Update production dependency lockfile"
git push origin feature/local-calendar-sync
```

Deretter:

```powershell
npm run release:check
eas build --platform ios
```

## Før App Store-innsending

- Installer sikkerhetsoppdatering v3 for PC-portalen.
- Roter paringstoken dersom det kan ha blitt eksponert.
- Gjennomfør hele [`TESTING.md`](TESTING.md) på fysisk iPhone.
- Test produksjonsbygget via TestFlight.
- Publiser [`PRIVACY_POLICY.md`](PRIVACY_POLICY.md) på en offentlig URL.
- Legg inn supportadresse og korrekte App Privacy-svar.

## Kjente begrensninger

- Lokal PC-trafikk bruker HTTP med token, ikke TLS. Bruk bare et privat og betrodd nettverk.
- Kalenderdata ligger i appens iOS-sandbox, men databasen har ikke egen applikasjonskryptering.
- Initialer er personopplysninger når de kan knyttes til en person.
- Systemtoner på iPhone kan ikke listes og velges fritt fra appen.

## Viktige filer

- `app/_layout.tsx` – rutebeskyttelse, appvekslerskjul og automatisk låsing
- `app/day-appointments.tsx` – privat dagsvisning
- `app/work-day-appointments.tsx` – beskyttet dagsvisning for En Ny Dag
- `src/components/DayAppointmentsView.tsx` – felles dagsliste
- `app/settings.tsx` – innstillinger
- `src/services/notificationService.ts` – lokale varsler
- `src/services/workCalendarConnectionStore.ts` – sikker paring
- `src/services/workCalendarSync.ts` – synkronisering
- `src/services/workCalendarSyncValidation.ts` – nettverks- og responsvalidering
- `src/services/appointmentPersistence.ts` – validering av lagrede avtaler
- `scripts/release-check.mjs` – lokal produksjonskontroll
- `docs/SECURITY.md` – sikkerhetsmodell
- `docs/RELEASE.md` – utgivelsessjekkliste

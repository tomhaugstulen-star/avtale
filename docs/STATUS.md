# Prosjektstatus

Sist oppdatert: 2026-07-04

## Nåværende teknisk løsning

- Expo SDK 57
- React Native 0.86
- TypeScript og Expo Router med typed routes
- AsyncStorage for lokal lagring
- `expo-notifications` for lokale varsler
- `expo-local-authentication` for Face ID / enhetskode
- `expo-haptics` for fysisk tilbakemelding
- Development build på fysisk iPhone

## Implementert

### Startskjerm

- Tidsstyrt hilsen
- Valg mellom **Privat** og **En Ny Dag**
- Haptisk respons på begge kalenderkort
- Privat åpnes direkte
- En Ny Dag åpnes via Face ID eller enhetskode

### Begge kalendere

- Månedsvisning og månedsbytte
- Markering av dagens og valgt dato
- Prikker på datoer med avtaler
- Opprette avtale med dato, tittel og klokkeslett
- Skriveforslag fra standardvalg og tidligere avtaler
- Egen skjerm for alle avtaler
- Redigering og sletting
- Lokal lagring
- Lokalt varsel 2 timer før med standard iPhone-lyd
- Avbryting og ny planlegging av varsel ved sletting eller endring
- Haptisk respons på sentrale knapper og tidsvelger

### Personvern og avgrensning

- Ingen konto eller innlogging
- Ingen server eller skytjeneste
- Privat- og arbeidsavtaler lagres separat
- En Ny Dag er beskyttet av enhetens autentisering

## Testfase

MVP-en er funksjonelt ferdig og klar for systematisk testing på fysisk iPhone. Testplanen ligger i [`TESTING.md`](TESTING.md).

Før hver testrunde:

```powershell
git pull
npm install
npm run typecheck
npx expo start --dev-client --clear
```

Ny development build er bare nødvendig ved endringer i native avhengigheter eller app-konfigurasjon:

```powershell
eas build --profile development --platform ios
```

## Kjente vedlikeholdspunkter

- `package-lock.json` må oppdateres og committes lokalt sammen med `package.json` etter avhengighetsendringer.
- Varsler må testes med lyd, Fokus-modus og lydløs bryter i ulike stillinger.
- Face ID må testes både ved godkjenning, avvisning og bruk av enhetskode.
- Data må testes etter lukking, omstart og reinstallasjon av appen.

## Viktige filer

- `app/index.tsx` – startskjerm
- `app/calendar.tsx` og `app/work-calendar.tsx` – kalendere
- `app/new-appointment.tsx` og `app/work-new-appointment.tsx` – nye avtaler
- `app/appointments.tsx` og `app/work-appointments.tsx` – avtalelister
- `src/components/AppointmentSuggestions.tsx` – skriveforslag
- `src/components/TimePickerModal.tsx` – tidsvelger
- `src/services/appointmentStorage.ts` – privat lagring
- `src/services/workAppointmentStorage.ts` – arbeidslagring
- `src/services/notificationService.ts` – lokale varsler

## Kodekrav

- Hold kildefiler under 150 linjer.
- Skill skjerm, lagring og varsler i egne filer.
- Ikke legg til konto eller server i MVP.
- Privat- og arbeidsavtaler skal holdes separat.
- Kjør TypeScript-kontroll før commit.

# Prosjektstatus

Sist oppdatert: 2026-07-04

## Nåværende teknisk løsning

- Expo SDK 57
- React Native 0.86
- TypeScript
- Expo Router med typed routes
- AsyncStorage for lokal lagring
- `expo-notifications` for lokale varsler
- `expo-local-authentication` for Face ID / enhetskode
- Development build på fysisk iPhone

## Ferdig og testet

### Startskjerm

- Tidsstyrt hilsen: morgen, dag og kveld
- Valg mellom **Privat** og **En Ny Dag**
- Privat åpnes direkte
- En Ny Dag åpnes via Face ID eller enhetskode

### Privat kalender

- Månedsvisning med månedsbytte
- Markering av dagens dato
- Valgt dato
- Prikker på datoer med avtaler
- Ny avtale med dato, tittel og klokkeslett
- Redigering og sletting
- Egen scrollbar skjerm for **Mine avtaler**
- Lokale data i AsyncStorage
- Lokalt varsel 2 timer før
- Gammelt varsel avbrytes ved endring eller sletting

### En Ny Dag

- Face ID / enhetskode fungerer i development build
- Egen grønn kalenderflate er opprettet
- Månedsbytte og valgt dato fungerer
- Separat datamodell og lagring for arbeidsavtaler er forberedt

## Påbegynt, men ikke ferdig

Arbeidskalenderen viser kalenderen, men disse delene er ikke koblet ferdig:

- opprette arbeidsavtale
- vise prikker fra lagrede arbeidsavtaler
- Mine avtaler for arbeid
- redigere og slette arbeidsavtaler
- varsler for arbeidsavtaler

## Neste anbefalte steg

1. Koble **Ny avtale** i `WorkCalendarView` til en egen arbeidsavtaleskjerm.
2. Lagre med `calendarType: 'work'` via `workAppointmentStorage`.
3. Last arbeidsavtaler ved fokus og vis prikker i arbeidskalenderen.
4. Lag **Mine avtaler** for arbeid.
5. Koble redigering, sletting og varsler.
6. Test hele arbeidsflyten på fysisk iPhone.
7. Start deretter på diktering.

## Viktige filer

- `app/index.tsx` – startskjerm
- `app/calendar.tsx` – privat kalender
- `app/appointments.tsx` – private avtaler
- `app/new-appointment.tsx` – ny privat avtale
- `app/edit-appointment.tsx` – redigering av privat avtale
- `app/work-lock.tsx` – Face ID / enhetskode
- `app/work-calendar.tsx` – arbeidskalenderens skjerm
- `src/components/WorkCalendarView.tsx` – arbeidskalenderens innhold
- `src/services/appointmentStorage.ts` – privat lagring
- `src/services/workAppointmentStorage.ts` – arbeidslagring
- `src/services/notificationService.ts` – lokale varsler

## Kjøring lokalt

```powershell
git pull
npm install
npx expo start --dev-client --clear
```

TypeScript-kontroll:

```powershell
npm run typecheck
```

Ved nye native avhengigheter eller endringer i app-konfigurasjonen:

```powershell
eas build --profile development --platform ios
```

## Kodekrav

- Hold kildefiler under 150 linjer.
- Skill skjerm, lagring og varsler i egne filer.
- Ikke legg til konto eller server i MVP.
- Privat- og arbeidsavtaler skal holdes separat.

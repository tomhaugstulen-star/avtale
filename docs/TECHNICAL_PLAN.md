# Teknisk plan

## Plattform

Første versjon bygges som en Expo-app for iPhone-testing i Expo Dev / development build.

Målet er rask prototyping av design, flyt og brukervennlighet før eventuell App Store-/TestFlight-distribusjon.

## Anbefalt teknologi

- Expo
- React Native
- TypeScript
- Expo Router eller enkel React Navigation
- AsyncStorage eller SQLite for lokal lagring i første prototype
- `expo-notifications` for lokale varsler
- `expo-local-authentication` for Face ID / kode
- tale/diktering vurderes separat, fordi full talegjenkjenning kan kreve native modul eller development build

## Viktig om Expo Go vs development build

Appen kan starte i Expo Go for ren UI-prototype.

Funksjoner som bør testes i development build på fysisk iPhone:

- lokale varsler
- Face ID / kode
- eventuell talegjenkjenning
- App Store-lignende oppførsel

## Arkitektur

Start enkelt med denne strukturen:

```text
avtale/
  app/
    index.tsx
    calendar.tsx
    new-appointment.tsx
  src/
    components/
      CalendarMonth.tsx
      AppointmentCard.tsx
      PrimaryButton.tsx
      SecondaryButton.tsx
    constants/
      colors.ts
      typography.ts
    models/
      Appointment.ts
      CalendarType.ts
    services/
      appointmentStorage.ts
      notificationService.ts
      authenticationService.ts
      speechService.ts
    hooks/
      useAppointments.ts
```

## Data

### Appointment

Felter:

```ts
export type CalendarType = 'private' | 'enNyDag';

export type Appointment = {
  id: string;
  calendarType: CalendarType;
  title: string;
  startDate: string; // ISO string
  createdAt: string;
  updatedAt: string;
};
```

Dato og klokkeslett lagres som én ISO-dato i `startDate`.

## Lokal lagring

Første prototype kan bruke AsyncStorage.

Når modellen stabiliseres, vurder SQLite hvis vi trenger bedre spørringer på datoer.

Krav:

- ingen server
- ingen konto
- privat og En Ny Dag holdes separat med `calendarType`

## Varsler

Bruk lokale varsler.

Plan:

1. Be om varslingstillatelse første gang en avtale lagres.
2. Når avtale lagres, beregn `appointmentDate - 2 hours`.
3. Hvis varslingsdato er i fremtiden, planlegg varsel.
4. Hvis avtalen endres, slett gammelt varsel og opprett nytt.
5. Hvis avtalen slettes, slett tilhørende varsel.

Varseltekst:

```text
Tannlege kl. 14:30
```

## Face ID / kode

Bruk lokal autentisering gjennom Expo.

Krav:

- **En Ny Dag** krever autentisering før visning.
- Appen skal ikke lagre egen PIN-kode.
- Bruk systemets Face ID eller enhetskode der dette er tilgjengelig.
- Hvis autentisering feiler eller avbrytes, bli værende på startskjermen.

## Tale/diktering

Tale deles i to nivåer.

### Første nivå

- Manuell skriving fungerer alltid.
- Taleknapp kan ligge i UI fra starten.
- Dersom talegjenkjenning ikke er klar, kan knappen midlertidig vise: «Tale kommer senere».

### Andre nivå

- tale til tekst
- fyll inn tittelfeltet

### Tredje nivå

- enkel parsing av dato og tid
- eksempel: «neste tirsdag klokka halv to»

Resultat:

- tittel
- dato
- klokkeslett

## Personvern

Første versjon skal lagre data lokalt.

- Ingen konto.
- Ingen server.
- Ingen tredjepartsanalyse.
- Ingen reklame.
- Ingen deling av data.

For **En Ny Dag** er lokal autentisering kun en lås inn i appområdet. Den krypterer ikke nødvendigvis egne data separat. Dersom arbeidsdata senere blir mer sensitive, må dette vurderes på nytt.

## Distribusjon og testing

Første test:

- Expo Dev / development build på fysisk iPhone

Senere:

- TestFlight
- unlisted App Store-app
- privat distribusjon via Apple Business Manager dersom firmaet trenger det

## Prioritert teknisk rekkefølge

1. Opprett Expo-prosjekt med TypeScript.
2. Bygg statisk startskjerm.
3. Implementer kalenderområdevalg.
4. Implementer låsing for En Ny Dag.
5. Implementer lokal avtalemodell og lagring.
6. Implementer kalenderliste og valgt dato.
7. Implementer ny avtale.
8. Implementer lokale varsler.
9. Legg inn taleknapp.
10. Test i Expo Dev på fysisk iPhone.

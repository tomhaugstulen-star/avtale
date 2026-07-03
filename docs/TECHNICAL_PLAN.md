# Teknisk plan

## Plattform

Første versjon bygges for iPhone.

Anbefalt teknologi:

- Swift
- SwiftUI
- SwiftData for lokal lagring
- UserNotifications for lokale varsler
- LocalAuthentication for Face ID/kode
- Speech framework for diktering/talegjenkjenning

## Arkitektur

Start enkelt med en ryddig SwiftUI-struktur:

```text
Avtale/
  App/
    AvtaleApp.swift
  Models/
    Appointment.swift
    CalendarType.swift
  Views/
    WelcomeView.swift
    CalendarView.swift
    NewAppointmentView.swift
    AppointmentListView.swift
  Services/
    NotificationService.swift
    AuthenticationService.swift
    SpeechService.swift
  ViewModels/
    CalendarViewModel.swift
    NewAppointmentViewModel.swift
```

## Data

### Appointment

Felter:

- id
- calendarType
- title
- startDate
- createdAt
- updatedAt

Dato og klokkeslett kan lagres som én `Date` for avtaletidspunktet.

## Lokal lagring

Bruk SwiftData i første versjon.

Fordeler:

- enkel lokal lagring
- god SwiftUI-integrasjon
- kan senere migreres eller suppleres med iCloud/CloudKit

## Varsler

Bruk `UNUserNotificationCenter`.

Ved første oppstart må appen be om tillatelse til varsler.

Plan:

1. Be om varslingstillatelse på en rolig forklaringsskjerm eller første gang avtale lagres.
2. Når avtale lagres, beregn `appointmentDate - 2 hours`.
3. Hvis varslingsdato er i fremtiden, planlegg varsel.
4. Hvis avtalen endres, slett gammelt varsel og opprett nytt.
5. Hvis avtalen slettes, slett tilhørende varsel.

## Face ID / kode

Bruk `LocalAuthentication`.

Krav:

- **En Ny Dag** krever autentisering før visning.
- Appen skal ikke lagre egen PIN-kode.
- Bruk systemets Face ID eller enhetskode.
- Hvis autentisering feiler, bli værende på startskjermen.

## Tale/diktering

Bruk iOS Speech framework.

Første nivå:

- tale til tekst
- fyll inn tittelfeltet

Senere nivå:

- enkel parsing av dato og tid
- eksempel: «neste tirsdag klokka halv to»

## Personvern

Første versjon skal lagre data lokalt.

- Ingen konto.
- Ingen server.
- Ingen tredjepartsanalyse.
- Ingen reklame.
- Ingen deling av data.

For **En Ny Dag** er lokal autentisering kun en lås inn i appområdet. Den krypterer ikke nødvendigvis egne data separat. Dersom arbeidsdata senere blir mer sensitive, må dette vurderes på nytt.

## TestFlight

Første distribusjon bør skje via TestFlight.

Når appen er stabil, kan den vurderes som:

- unlisted App Store-app
- privat distribusjon via Apple Business Manager dersom firmaet trenger det

## Prioritert teknisk rekkefølge

1. Opprett SwiftUI-prosjekt.
2. Bygg statisk startskjerm.
3. Implementer kalenderområdevalg.
4. Implementer LocalAuthentication for En Ny Dag.
5. Implementer lokal modell og SwiftData.
6. Implementer kalenderliste og valgt dato.
7. Implementer ny avtale.
8. Implementer lokale varsler.
9. Implementer tale til tekst.
10. Test på fysisk iPhone.

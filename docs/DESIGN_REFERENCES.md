# Designreferanser

Dette prosjektet bruker to opplastede designbilder som visuell referanse.

## Referanse 1: Startskjerm

Beskrivelse:

- rolig morgenstemning
- varm bakgrunn
- stor tekst: «God morgen!»
- undertittel: «Hvilken kalender vil du se i dag?»
- to store valgkort:
  - **Privat**
  - **En Ny Dag**
- diskret personverntekst nederst

Brukes som referanse for:

- `WelcomeView`
- fargevalg for Privat og En Ny Dag
- kortlayout på startskjermen
- generell stemning i appen

Foreslått filnavn i repo dersom bildet legges inn senere:

```text
docs/design/welcome-reference.png
```

## Referanse 2: Kalender og ny avtale

Beskrivelse:

- månedskalender med stor tekst
- valgt dato i lilla sirkel
- prikker under datoer med avtaler
- kort med dagens avtaler
- stor knapp: **Ny avtale**
- sekundærknapp: **Snakk**
- ny avtale-skjerm med:
  - dato
  - tittel
  - klokkeslett
  - varselkort
  - lagreknapp
  - snakkeknapp

Brukes som referanse for:

- `CalendarView`
- `NewAppointmentView`
- knappedesign
- typografi
- fargebalanse

Foreslått filnavn i repo dersom bildet legges inn senere:

```text
docs/design/calendar-new-appointment-reference.png
```

## Viktig

Bildene er designreferanser, ikke eksakte spesifikasjoner. Implementasjonen skal følge samme retning, men kan justeres for faktisk iOS-layout, tilgjengelighet og SwiftUI-komponenter.

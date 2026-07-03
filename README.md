# Avtale

En enkel iPhone-app for avtaler, laget for rask registrering, stor tekst og lite friksjon.

Appen skal være enklere enn standard kalenderappen. Hovedmålet er at en avtale kan legges inn raskt ved å trykke på dato, skrive hva avtalen gjelder, velge klokkeslett og lagre.

## Produktretning

- Kalender først.
- Stor skrift som standard.
- Få valg.
- To kalenderområder: **Privat** og **En Ny Dag**.
- **En Ny Dag** skal låses med Face ID eller kode.
- Avtaler får fast varsel 2 timer før.
- Tale/diktering skal være tilgjengelig som et raskt alternativ til skriving.
- Forslag til avtaletekst skal ikke vises før appen har lært av faktisk bruk.

## Dokumentasjon

- [`docs/APP_PLAN.md`](docs/APP_PLAN.md) – overordnet app-plan
- [`docs/MVP_SCOPE.md`](docs/MVP_SCOPE.md) – første versjon
- [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md) – farger, typografi og layout
- [`docs/FEATURES.md`](docs/FEATURES.md) – funksjonskrav
- [`docs/TECHNICAL_PLAN.md`](docs/TECHNICAL_PLAN.md) – teknisk retning

## Første utviklingsmål

Bygg en lokal iOS-prototype i SwiftUI med:

1. Startskjerm med valgene **Privat** og **En Ny Dag**.
2. Face ID/kode for **En Ny Dag**.
3. Kalender med måned, valgt dato og avtaler for valgt dag.
4. Ny avtale med kun to felter: tittel og klokkeslett.
5. Fast varsel 2 timer før avtalen.
6. Diktering som alternativ registrering.

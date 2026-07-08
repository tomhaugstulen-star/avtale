# Testplan for Avtale

Test på fysisk iPhone med development build. Gjennomfør hele planen for både **Privat** og **En Ny Dag** der det er relevant.

## Før testing

```powershell
git pull
npm install
npm run typecheck
npx expo start --dev-client --clear
```

Noter iPhone-modell, iOS-versjon, app-build og commit ved hver testrunde.

## 1. Startskjerm

- Riktig hilsen vises for tidspunktet.
- Privat-kortet åpner privat kalender.
- En Ny Dag-kortet starter autentisering.
- Begge kort gir merkbar, men kort haptisk respons.
- Innstillinger åpnes fra øverst på startskjermen.
- Tekst og knapper er lesbare med stor tekststørrelse i iOS.

## 2. Face ID og enhetskode

- Godkjent Face ID åpner En Ny Dag.
- Avvist Face ID gir kontrollert resultat uten krasj.
- Enhetskode kan brukes når Face ID ikke er tilgjengelig.
- Tilbakeknappen returnerer til startskjermen.

## 3. Kalender

- Dagens dato er markert.
- Valgt dato er tydelig.
- Forrige og neste måned fungerer over årsskifte.
- Datoer med avtaler viser prikk.
- Mine avtaler åpner riktig kalenderliste.

## 4. Ny avtale

- Valgt dato følger med til skjemaet.
- Tittel kan skrives og redigeres.
- Forslag vises over feltet når teksten matcher.
- Forslag forsvinner når teksten ikke matcher.
- Valgt forslag fyller tittelfeltet og gir haptisk respons.
- Tidsvelger åpnes og gir respons på pluss, minus og Ferdig.
- Lagre er deaktivert uten tittel.
- Valgt varslingstid vises i skjemaet.
- Lagring returnerer til kalenderen og viser avtaleprikk.

## 5. Avtaleliste og redigering

- Avtaler vises i kronologisk rekkefølge.
- Riktig dato, klokkeslett og tittel vises.
- Redigering oppdaterer kalender og liste.
- Sletting krever tydelig bekreftelse.
- Slettet avtale forsvinner fra liste og kalender.

## 6. Lokal lagring

- Avtaler finnes etter at appen lukkes helt.
- Avtaler finnes etter omstart av iPhone.
- Privat- og arbeidsavtaler blandes ikke.
- Reinstallasjon fjerner lokale data som forventet.

## 7. Varslinger og innstillinger

- Alle varslingstidene kan velges og lagres.
- Valgt varslingstid gjelder både Privat og En Ny Dag.
- Valget Av kansellerer eksisterende planlagte varsler.
- Endret varslingstid planlegger eksisterende lokale avtaler på nytt.
- Importerte Opptatt-perioder fra PC får ikke varsler.
- Testvarsel vises.
- Standardlyd kan slås av og på.
- Snarveien til iPhone-varsler åpner appens systeminnstillinger.
- Varsel viser riktig tittel.
- Test med lydløs bryter og Fokus-modus i ulike stillinger.
- Test med appen åpen, i bakgrunnen og avsluttet.

## 8. Lokal PC-synk

- Appen kobler til PC-en på samme private nettverk.
- Bare tidspunkt vises som Opptatt.
- Privatkalenderen påvirkes ikke.
- Endrede og slettede perioder oppdateres ved ny synk.
- Sist lagrede arbeidskalender vises når PC-en er av.
- Feil adresse eller token gir kontrollert feilmelding.

## 9. Stabilitet og grenseverdier

- Tom tittel kan ikke lagres.
- Lange titler ødelegger ikke layouten.
- Norske bokstaver fungerer.
- Klokkeslett rundt 00:00 og 23:55 fungerer.
- Avtaler på månedens første og siste dag fungerer.
- Mange avtaler på samme dato gir stabil visning.
- Rask gjentatt trykking oppretter ikke duplikater.

## Feilrapport

Bruk denne formen:

```text
Område:
Telefon og iOS:
Build/commit:
Steg for å gjenskape:
Forventet resultat:
Faktisk resultat:
Skjermbilde eller video:
Skjer hver gang: Ja/Nei
```

Prioritet:

- **P0:** appen krasjer eller data går tapt
- **P1:** sentral funksjon virker ikke
- **P2:** funksjonen virker delvis eller gir feil resultat
- **P3:** visuelt problem eller mindre friksjon

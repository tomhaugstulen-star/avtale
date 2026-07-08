# Testplan for Avtale

Test på fysisk iPhone med en ny development build. Gjennomfør planen for både **Privat** og **En Ny Dag** der det er relevant.

## Før testing

```powershell
git checkout feature/local-calendar-sync
git pull origin feature/local-calendar-sync
npx expo install expo-secure-store
npm run typecheck
npm audit --omit=dev --audit-level=high
eas build --profile development --platform ios
```

Installer sikkerhetsoppdatering v3 i PC-portalen. Noter iPhone-modell, iOS-versjon, app-build og commit ved hver testrunde.

## 1. Startskjerm og innstillinger

- Riktig hilsen vises.
- Privat åpnes direkte.
- En Ny Dag starter autentisering.
- Innstillinger åpnes.
- Varslingstid, lyd og haptikk kan lagres.
- Haptikk av fjerner respons på kalenderkort, forslag og tidsvelger.
- Testvarsel vises med valgt lydinnstilling.
- Koble fra PC krever Face ID eller kode.
- Avbrutt autentisering kobler ikke fra PC-en.

## 2. Beskyttelse av En Ny Dag

- Godkjent Face ID eller kode åpner kalenderen.
- Avvist eller avbrutt autentisering åpner ikke kalenderen.
- Direkte lenke til hver `work-*`-rute uten aktiv sesjon går til låseskjermen.
- Arbeidsinnhold er skjult i appveksleren med en gang appen blir inaktiv.
- Retur etter mindre enn 2 minutter beholder aktiv sesjon.
- Retur etter minst 2 minutter krever ny autentisering.
- Tilbakeknappen fra arbeidskalenderen låser sesjonen umiddelbart.
- Appen låses korrekt etter omstart.

## 3. Kalender og dagsliste

- Dagens og valgt dato er tydelig markert.
- Forrige og neste måned fungerer over årsskifte.
- Datoer med avtaler viser prikk.
- Trykk på dato viser bare avtalene den dagen.
- Dagslisten er sortert etter klokkeslett.
- Dagslisten kan rulles når dagen har mange avtaler.
- Lokale avtaler kan åpnes for redigering.
- Importerte avtaler kan ikke redigeres via dagsliste, avtaleliste eller direkte lenke.

## 4. Ny avtale, redigering og sletting

- Valgt dato følger med til skjemaet.
- Tom tittel kan ikke lagres.
- Tittel, klokkeslett og forslag fungerer.
- Valgt varslingstid vises i skjemaet.
- Lagring oppretter bare én avtale ved raske trykk.
- Redigering oppdaterer kalender, dagsliste og avtaleliste.
- Sletting krever bekreftelse og avbryter planlagt varsel.
- Norske bokstaver og lange titler ødelegger ikke layouten.

## 5. Varslinger og låseskjerm

- Alle varslingstidene kan velges.
- Valget **Av** kansellerer eksisterende planlagte varsler.
- Endret tid planlegger private, lokale arbeidsavtaler og importerte perioder på nytt.
- Privat varsel viser privat avtaletittel.
- Arbeidsvarsel viser **En Ny Dag**, ikke tittel eller initialer.
- Importert periode gir varsel uten klientinitialer.
- Test med telefonen låst, appen åpen, i bakgrunnen og avsluttet.
- Test med lydløs bryter, Fokus og planlagt sammendrag.
- Slettet eller endret importert periode gir ikke et gammelt varsel.

## 6. Lokal PC-synk

- Korrekt lokal adresse og token kobler til.
- Privatkalenderen påvirkes ikke.
- Tidspunkt og maksimalt tre initialer vises i En Ny Dag.
- Fullt navn, notater, telefonnummer og andre klientopplysninger finnes ikke i appen.
- Endrede og slettede perioder oppdateres ved ny synk.
- Sist lagrede arbeidskalender vises når PC-en er av.
- To raske synkforsøk lager ikke doble avtaler eller varsler.
- Synk stopper med kontrollert feil etter omtrent 10 sekunder når PC-en ikke svarer.
- Feil token gir kontrollert melding om avvist token.
- Offentlig IP, HTTPS, URL med `/api/calendar`, brukernavn, passord, søk eller fragment avvises.
- Ugyldig JSON, svært stor respons, ugyldige datoer og urimelig lang avtale avvises.
- Etter frakobling er token, importerte perioder og tilhørende varsler borte.
- Paring fungerer fortsatt etter migrering fra en tidligere appversjon.

## 7. Lokal lagring og stabilitet

- Avtaler finnes etter full lukking og omstart av iPhone.
- Privat- og arbeidsavtaler blandes ikke.
- Ødelagte eller feilformede lagringsdata krasjer ikke appen.
- Reinstallasjon fjerner lokale kalenderdata som forventet.
- Klokkeslett rundt 00:00 og 23:55 fungerer.
- Månedens første og siste dag fungerer.
- Mange avtaler på samme dag gir stabil visning.
- Appen fungerer med stor tekststørrelse i iOS.

## 8. PC-portalens sikkerhetskontroll

Kjør fra klientportal-mappen:

```powershell
.\SJEKK-SYNKSIKKERHET.ps1
```

Kontroller at:

- helsesjekken svarer
- forespørsel uten token avvises
- feil Origin avvises
- kalenderdata valideres
- serveren annonserer bare private nettverksadresser
- konsollen skriver ikke ut paringstokenet

Bytt token ved behov:

```powershell
.\NYTT-PARINGSTOKEN.ps1
```

## 9. Før App Store

- GitHub-kontrollen er grønn på endelig commit.
- `package-lock.json` inneholder SecureStore-avhengigheten og er committet.
- Produksjonsbygg installeres via TestFlight.
- Hele planen kjøres på TestFlight-versjonen.
- Appikon, appnavn, buildnummer, versjon og skjermbilder er endelige.
- Personvernerklæring er publisert.
- App Privacy-svar samsvarer med faktisk datalagring og lokal synk.
- Paringstoken brukt under utvikling er rotert.

## Feilrapport

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

- **P0:** appen krasjer, data går tapt eller beskyttet innhold åpnes uten autentisering
- **P1:** sentral funksjon eller sikkerhetskontroll virker ikke
- **P2:** funksjonen virker delvis eller gir feil resultat
- **P3:** visuelt problem eller mindre friksjon

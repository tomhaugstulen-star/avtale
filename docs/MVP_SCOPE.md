# MVP-scope

Dette dokumentet definerer første byggbare versjon av appen.

## Målet med MVP

MVP skal bevise at appen er raskere og enklere enn vanlig kalenderapp for enkel avtaleregistrering.

## Status

- [x] Startskjerm med Privat og En Ny Dag
- [x] Face ID / enhetskode for En Ny Dag
- [x] Privat kalender med månedsvisning og markeringer
- [x] Privat oppretting, redigering og sletting
- [x] Privat Mine avtaler
- [x] Lokalt varsel 2 timer før
- [x] Lokal lagring
- [x] Grunnskjerm for arbeidskalender
- [ ] Full arbeidsavtaleflyt
- [ ] Tale/diktering

Detaljert status finnes i [`STATUS.md`](STATUS.md).

## Må være med

### 1. Startskjerm

Startskjermen skal ha to store, men diskrete valg:

- **Privat**
- **En Ny Dag**

Layout:

- rolig bakgrunn
- stor tidsstyrt hilsen
- undertittel: «Hvilken kalender vil du se i dag?»
- to store kort med ikon og tittel

### 2. Låsing av En Ny Dag

Når brukeren trykker **En Ny Dag**, skal appen kreve autentisering:

- Face ID hvis tilgjengelig
- enhetskode som fallback

Det skal ikke lages eget passordsystem i appen.

### 3. Kalender

Begge kalendere skal vise:

- måned og år
- ukedager
- datoer
- prikk på datoer med avtaler
- valgt dato
- knapp for **Ny avtale**
- knapp for **Mine avtaler**

Avtalelisten ligger på egen scrollbar skjerm for å holde kalenderen ryddig.

### 4. Ny avtale

Skjermen skal kun ha:

- valgt dato
- felt: «Hva skal du gjøre?»
- felt: «Klokkeslett»
- informasjonskort: «Du får varsel 2 timer før avtalen»
- knapp: «Lagre avtale»

Ikke med:

- sted
- notat
- kategori
- gjentakelse
- valg for varsel

### 5. Varsel

Når avtalen lagres, skal appen automatisk planlegge ett lokalt varsel:

- tidspunkt: 2 timer før avtalen
- lyd: standardlyd
- tekst: avtaletittel

Ved redigering avbrytes gammelt varsel og et nytt planlegges. Ved sletting avbrytes varselet.

### 6. Tale/diktering

MVP skal ha støtte for tale som alternativ til skriving.

Første akseptable nivå:

- brukeren trykker en mikrofonknapp
- appen bruker iOS talegjenkjenning
- tekst settes inn i tittelfeltet

Senere kan tale også tolke dato og klokkeslett.

### 7. Lokal lagring

Avtaler lagres lokalt på telefonen uten konto eller server.

Minimumsdata:

- id
- `calendarType`: `private` eller `work`
- title
- startDate
- createdAt
- notificationId ved planlagt varsel

Privat- og arbeidsavtaler holdes i separate lagringsnøkler.

## Bør vente

Dette skal ikke bygges før MVP fungerer godt:

- iCloud/CloudKit-synk
- App Store-lansering
- delt tilgang
- forslag basert på historikk
- automatisk tolkning av hele talesetninger
- gjentakende avtaler

## Akseptansekriterier

MVP er god nok når:

1. En privat avtale kan legges inn på under 15 sekunder.
2. En arbeidsavtale krever Face ID/kode før kalenderen åpnes.
3. Avtaler vises med prikk på riktig dato etter lagring.
4. Mine avtaler viser en scrollbar og sortert liste.
5. Varsel 2 timer før planlegges automatisk.
6. Tekst og knapper er store nok til å brukes uten briller.
7. Appen kan brukes uten å åpne noen innstillingsskjerm.

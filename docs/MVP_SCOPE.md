# MVP-scope

Dette dokumentet definerer første byggbare versjon av appen.

## Målet med MVP

MVP skal bevise at appen er raskere og enklere enn vanlig kalenderapp for enkel avtaleregistrering.

## Må være med

### 1. Startskjerm

Startskjermen skal ha to store, men diskrete valg:

- **Privat**
- **En Ny Dag**

Layout:

- rolig bakgrunn
- stor hilsen, for eksempel «God morgen!»
- undertittel: «Hvilken kalender vil du se i dag?»
- to store kort med ikon og tittel

### 2. Låsing av En Ny Dag

Når brukeren trykker **En Ny Dag**, skal appen kreve autentisering:

- Face ID hvis tilgjengelig
- enhetskode som fallback

Det skal ikke lages eget passordsystem i appen.

### 3. Kalender

Kalenderskjermen skal vise:

- måned og år
- ukedager
- datoer
- markering på datoer med avtaler
- valgt dato
- liste med avtaler for valgt dato
- knapp for **Ny avtale**
- knapp for **Snakk**

### 4. Ny avtale

Skjermen skal kun ha:

- valgt dato
- felt: «Hva skal du gjøre?»
- felt: «Klokkeslett»
- informasjonskort: «Du får varsel 2 timer før avtalen»
- knapp: «Lagre avtale»
- sekundærknapp: «Snakk i stedet»

Ikke med:

- sted
- notat
- kategori
- gjentakelse
- valg for varsel

### 5. Varsel

Når avtalen lagres, skal appen automatisk planlegge ett lokalt varsel:

- tidspunkt: 2 timer før avtalen
- lyd: én fast varslingslyd
- tekst: avtaletittel og klokkeslett

Eksempel:

```text
Tannlege kl. 14:30
```

### 6. Tale/diktering

MVP skal ha støtte for tale som alternativ til skriving.

Første akseptable nivå:

- brukeren trykker **Snakk**
- appen bruker iOS talegjenkjenning
- tekst settes inn i tittelfeltet

Senere kan tale også tolke dato og klokkeslett.

### 7. Lokal lagring

Avtaler lagres lokalt på telefonen.

Minimumsdata:

- id
- calendarType: `private` eller `enNyDag`
- title
- date
- time
- createdAt
- updatedAt

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
3. En avtale vises på riktig dato etter lagring.
4. Varsel 2 timer før planlegges automatisk.
5. Tekst og knapper er store nok til å brukes uten briller.
6. Appen kan brukes uten å åpne noen innstillingsskjerm.

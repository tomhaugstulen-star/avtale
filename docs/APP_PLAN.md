# App-plan: Avtale

## Formål

Appen skal erstatte lapper og en tungvint kalenderflyt med en rolig, tydelig og rask avtalebok.

Appen skal ikke forsøke å være en full kalenderapp. Den skal gjøre få ting godt:

- vise kalenderen tydelig
- gjøre det raskt å legge inn avtaler
- skille mellom privat kalender og arbeidskalender
- gi automatisk varsel 2 timer før
- fungere godt uten briller ved hjelp av stor tekst og store trykkflater

## Målgruppe

Primærbrukeren er én konkret bruker som vil ha en enklere måte å skrive inn avtaler på. Appen skal designes for hverdagsbruk, ikke for avanserte kalenderbehov.

## Grunnprinsipper

1. **Kalenderen er hovedskjermen.**
2. **Ingen unødvendige valg ved opprettelse av avtale.**
3. **Stor skrift og tydelig kontrast.**
4. **Privat kalender skal være rask å åpne.**
5. **En Ny Dag skal være låst med Face ID eller kode.**
6. **Forslag skal først vises når appen har nok historikk til at forslagene er relevante.**
7. **Appen skal bli smartere over tid uten at brukeren må konfigurere den.**

## Kalenderområder

### Privat

- Åpnes direkte fra startskjermen.
- Brukes til private avtaler.
- Ingen ekstra autentisering.

### En Ny Dag

- Arbeidskalender for firmaet.
- Krever Face ID eller kode før bruk.
- Skal visuelt være diskret på startskjermen, ikke markedsføres som noe hemmelig.

## Hovedflyt

### Legge inn avtale manuelt

1. Velg **Privat** eller **En Ny Dag**.
2. Trykk på dato i kalenderen.
3. Trykk **Ny avtale**.
4. Skriv hva avtalen gjelder.
5. Velg klokkeslett.
6. Trykk **Lagre avtale**.

### Legge inn avtale med tale

1. Trykk **Snakk**.
2. Si for eksempel: «Tannlege neste tirsdag klokka halv to».
3. Appen fyller inn tittel, dato og klokkeslett.
4. Brukeren bekrefter med **Lagre avtale**.

## Varsling

Alle avtaler skal automatisk få ett varsel:

- **2 timer før avtalen**

Det skal ikke vises varslingsvalg i første versjon.

## Forslag og læring

Appen skal ikke vise forslag fra starten av. Forslag kommer først når appen har nok data fra tidligere avtaler.

Regel for første versjon:

- Ingen forslag før minst 5 lagrede avtaler finnes.
- Ingen forslag før samme eller lignende tittel er brukt minst 2 ganger.
- Forslag skal bare vises når brukeren begynner å skrive eller trykker i feltet.

Eksempel:

- Brukeren har skrevet «Tannlege» flere ganger.
- Neste gang hun skriver «Tan», kan appen vise «Tannlege» som forslag.

## Ikke med i første versjon

- Sted
- Notat
- Mange lydvalg
- Mange påminnelsesvalg
- Gjentakende avtaler
- Deling mellom brukere
- Synkronisering med eksterne kalendere
- Avansert AI
- Mange innstillinger

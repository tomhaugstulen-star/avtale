# Sikkerhet og personvern

Sist gjennomgått: 2026-07-08

Dette dokumentet beskriver sikkerhetsmodellen for Avtale og den lokale kalenderbroen. Det er en kode- og konfigurasjonsgjennomgang, ikke en uavhengig penetrasjonstest.

## Beskyttelse som er implementert

### En Ny Dag

- Arbeidsruter krever en aktiv, autentisert sesjon.
- Face ID eller telefonens kode brukes ved opplåsing.
- Direkte lenker til arbeidsruter sendes til låseskjermen når sesjonen ikke er åpnet.
- Arbeidskalenderen låses etter 2 minutter i bakgrunnen.
- Sensitivt innhold skjules i appveksleren så snart appen blir inaktiv.
- Når brukeren forlater arbeidskalenderen via tilbakeknappen, låses sesjonen umiddelbart.

### Varslinger

- Varslinger for En Ny Dag viser ikke avtaletittel eller initialer på låseskjermen.
- Importerte og manuelt opprettede arbeidsavtaler vises generisk som En Ny Dag.
- Initialer brukes bare inne i den opplåste arbeidskalenderen.

### PC-paring

- Paringstokenet lagres i iOS Keychain via `expo-secure-store`.
- Tokenet er bundet til enheten og er bare tilgjengelig mens enheten er låst opp.
- Gamle tokenverdier i AsyncStorage flyttes automatisk til Keychain.
- Appen godtar bare lokale HTTP-adresser: privat IPv4, loopback, lokal IPv6 eller `.local`.
- URL med brukernavn, passord, søk, fragment eller API-sti avvises.
- Nettverksforespørsler avbrytes etter 10 sekunder.
- Kalenderdata valideres og størrelsesbegrenses før lagring og varsling.
- Samtidige synkroniseringer slås sammen til én forespørsel.

### Lokal lagring

- Privat- og arbeidskalender lagres med separate nøkler.
- Lagrede avtaler valideres før de brukes.
- Importerte oppføringer fjernes når PC-en kobles fra.
- Varsler knyttet til fjernede oppføringer avbrytes.

### Automatisk kontroll

GitHub Actions kjører:

- TypeScript-kontroll
- validering av Expo-konfigurasjonen
- `npm audit` for produksjonsavhengigheter med høy eller kritisk alvorlighetsgrad

## Gjenværende risikoer

### Lokal HTTP-trafikk

Trafikken mellom iPhone og PC er autentisert med et sterkt token, men er ikke TLS-kryptert. Appen skal derfor bare brukes på et privat og betrodd nettverk. Ikke bruk PC-synk på åpne gjestenettverk, hotellnettverk eller offentlig Wi-Fi.

### Data på telefonen

Avtaler og initialer lagres i appens lokale sandbox. De er beskyttet av iOS og telefonens kode, men er ikke applikasjonskryptert med en egen database-nøkkel. Face ID-skjermen er en tilgangskontroll i appen, ikke kryptering av hele databasen.

### Paringsfilen på PC-en

`KALENDER-PARING.txt` inneholder et hemmelig token. Filen må ikke sendes på e-post, lastes opp i en delt skylagringsmappe eller legges ved en feilrapport. Bytt token med `NYTT-PARINGSTOKEN.ps1` dersom det kan ha blitt eksponert.

### Initialer

Initialer er fortsatt personopplysninger dersom de kan knyttes til en bestemt person. De skal begrenses til det som er nødvendig, og fullt navn, telefonnummer, notater og andre klientopplysninger skal ikke overføres til appen.

## Sjekkliste før produksjonsbygg

1. Kjør `npx expo install expo-secure-store` slik at `package-lock.json` oppdateres.
2. Kjør `npm install`, `npm run typecheck` og `npm audit --omit=dev --audit-level=high`.
3. Installer sikkerhetsoppdatering v3 for klientportalen.
4. Bytt paringstoken før slutt-test dersom et tidligere token har vært delt eller vist offentlig.
5. Lag en ny EAS development build og test på fysisk iPhone.
6. Test direkte lenke til alle `work-*`-ruter uten aktiv sesjon.
7. Test appveksleren, bakgrunn i under 2 minutter og bakgrunn i over 2 minutter.
8. Test varsler med telefonen låst og bekreft at arbeidsdetaljer ikke vises.
9. Test feil token, offentlig adresse, ugyldig JSON, PC av og tregt nettverk.
10. Kjør en produksjonsbygging og TestFlight-test før App Store-innsending.
11. Opprett personvernerklæring og fyll ut App Privacy-svarene ut fra faktisk databehandling.

## Sikkerhetsgrense

Appen beskytter mot vanlig utilsiktet innsyn, direkte navigasjon uten aktiv sesjon, feilformede synkdata og lagring av paringstoken i klartekst. Den er ikke utformet for bruk på en kompromittert eller jailbreaket telefon, en kompromittert PC eller et fiendtlig lokalnettverk.

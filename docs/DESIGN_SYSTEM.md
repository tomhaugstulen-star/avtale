# Designsystem

Designet bygger på de to referansebildene som er valgt i samtalen:

1. Startskjerm med rolig morgen-/soloppgangsfølelse, to kort: **Privat** og **En Ny Dag**.
2. Kalender- og avtaleskjerm med stor tekst, lyse flater, lilla hovedfarge, grønn lagreknapp og myke kort.

## Visuell retning

Appen skal føles:

- enkel
- rolig
- innbydende
- tydelig
- ikke teknisk
- ikke overlesset

## Fargepalett

### Grunnfarger

| Bruk | Farge | Hex |
|---|---:|---:|
| Hovedbakgrunn | Varm hvit | `#FBFAF7` |
| Kortbakgrunn | Hvit | `#FFFFFF` |
| Sekundær bakgrunn | Lys lavendel | `#F3EEFF` |
| Arbeidsbakgrunn | Lys grønn | `#EEF8F2` |
| Tekst primær | Mørk blå/sort | `#10172F` |
| Tekst sekundær | Gråblå | `#6B7280` |

### Aksentfarger

| Bruk | Farge | Hex |
|---|---:|---:|
| Primærknapp / valgt dato | Lilla | `#6D4BEF` |
| Privat | Lilla | `#7B5CE1` |
| En Ny Dag | Grønn | `#59A37F` |
| Lagre | Grønn | `#2FB98E` |
| Snakk | Lys blå | `#EAF3FF` |
| Varsel | Varm gul | `#FFF3D8` |
| Varsel ikon | Gul/oransje | `#F5B83D` |

## Typografi

Bruk systemfont på iOS: San Francisco.

Anbefalte størrelser:

| Element | Størrelse | Vekt |
|---|---:|---:|
| Stor hilsen | 48–56 pt | Regular/Semibold |
| Skjermtittel | 34–40 pt | Bold |
| Seksjonstittel | 26–30 pt | Semibold |
| Avtaletittel | 24–28 pt | Semibold |
| Klokkeslett | 22–26 pt | Regular |
| Felttekst | 28–34 pt | Semibold |
| Knappetekst | 24–28 pt | Semibold |
| Sekundærtekst | 18–22 pt | Regular |

Appen skal støtte Dynamic Type, men standardopplevelsen skal allerede ha stor tekst.

## Layout

### Generelt

- Store luftige flater.
- Runde hjørner: 20–32 pt.
- Store trykkflater: minimum 56 pt høyde, helst 64–80 pt.
- Maks én primærhandling per skjerm.
- Ikke bruk små ikonknapper uten tekst for viktige handlinger.

### Startskjerm

Komponenter:

1. Statusfelt.
2. Sol-ikon eller enkel illustrasjon.
3. Stor hilsen: «God morgen!»
4. Undertittel: «Hvilken kalender vil du se i dag?»
5. To store kort:
   - **Privat**
   - **En Ny Dag**
6. Diskré personverntekst nederst.

Kortene skal være store nok til enkel trykking, men visuelt rolige.

### Kalender

Komponenter:

1. Toppfelt med måned og år.
2. Månedskalender.
3. Prikk under datoer med avtaler.
4. Valgt dato som stor sirkel.
5. Dagens avtaler i kort.
6. Stor knapp: **Ny avtale**.
7. Sekundær knapp: **Snakk**.

### Ny avtale

Komponenter:

1. Lukk-knapp.
2. Tittel: **Ny avtale**.
3. Enkel illustrasjon øverst.
4. Dato-kort.
5. Tekstfelt: **Hva skal du gjøre?**
6. Tid-felt: **Klokkeslett**
7. Varselkort: **Du får varsel 2 timer før avtalen**
8. Primærknapp: **Lagre avtale**
9. Sekundærknapp: **Snakk i stedet**

## Ikoner

Bruk få og tydelige ikoner:

- person: Privat
- koffert: En Ny Dag
- kalender: dato
- klokke: klokkeslett
- mikrofon: tale
- bjelle: varsel
- pluss: ny avtale
- kryss: lukk

Unngå ikon for hver avtaletype i første versjon. Teksten skal bære innholdet.

## Knapper

### Primærknapp

- Høyde: 72–84 pt
- Bredde: full bredde i innholdsflaten
- Bakgrunn: lilla eller grønn
- Tekst: hvit
- Radius: 20–24 pt

### Sekundærknapp

- Høyde: 64–76 pt
- Lys bakgrunn
- Tydelig ikon + tekst
- Ikke konkurrere visuelt med primærknappen

## Tilgjengelighet

- Alle viktige knapper skal ha tekstlig tilgjengelighetslabel.
- Farge skal aldri være eneste meningsbærer.
- Høy kontrast mellom tekst og bakgrunn.
- Trykkflater minimum 44 x 44 pt, helst større.
- Støtte for VoiceOver.
- Støtte for Dynamic Type.
- Ikke bruk raske animasjoner eller nødvendige sveipegester.

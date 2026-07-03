# Funksjonskrav

## Kalenderområder

### Privat

- Skal kunne åpnes direkte fra startskjermen.
- Skal vise private avtaler.
- Skal ikke kreve autentisering.

### En Ny Dag

- Skal åpnes fra startskjermen.
- Skal kreve Face ID eller kode før kalenderen vises.
- Skal ha egne avtaler separat fra Privat.

## Avtalemodell

En avtale skal minimum ha:

```swift
struct Appointment {
    let id: UUID
    var calendarType: CalendarType
    var title: String
    var date: Date
    var time: DateComponents
    var createdAt: Date
    var updatedAt: Date
}

enum CalendarType {
    case privateCalendar
    case enNyDag
}
```

## Opprette avtale

Brukeren skal kunne opprette avtale fra valgt dato.

Felter:

- Hva skal du gjøre?
- Klokkeslett

Regler:

- Tittel er påkrevd.
- Klokkeslett er påkrevd.
- Dato hentes fra valgt dato i kalenderen.
- Varsel settes automatisk til 2 timer før.

## Redigere avtale

MVP bør støtte enkel redigering:

- trykk på avtale
- endre tittel
- endre klokkeslett
- lagre

## Slette avtale

MVP bør støtte sletting etter bekreftelse:

```text
Slette avtalen?
[Avbryt] [Slett]
```

## Varsel

Alle avtaler får automatisk ett varsel.

- Tid: 2 timer før avtale
- Lyd: fast systemlyd eller én valgt app-lyd
- Ingen valg i UI i første versjon

Varseltekst:

```text
[Tittel] kl. [HH:mm]
```

Eksempel:

```text
Tannlege kl. 14:30
```

## Tale/diktering

### Første versjon

- Brukeren trykker **Snakk**.
- Appen starter talegjenkjenning.
- Resultatet settes i tittelfeltet.

### Senere versjon

- Appen kan tolke dato og tid fra setningen.

Eksempel:

```text
Frisør fredag klokka ti
```

Resultat:

- Tittel: Frisør
- Dato: førstkommende fredag
- Tid: 10:00

## Forslag basert på historikk

Forslag skal ikke vises før appen har lært nok.

Første versjon kan lagre historikk uten å vise forslag.

Senere regel:

- minst 5 avtaler totalt før forslag aktiveres
- samme tittel må være brukt minst 2 ganger
- forslag vises først når brukeren begynner å skrive

Eksempel:

```text
Tan
```

Forslag:

```text
Tannlege
```

## Innstillinger

MVP skal helst ikke trenge innstillingsskjerm.

Eventuelle senere innstillinger:

- tekststørrelse: Stor / Ekstra stor
- slå av/på tale
- slå av/på varsler

Ikke legg inn mange valg i første versjon.

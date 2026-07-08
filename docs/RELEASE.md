# Utgivelse av Avtale for iOS

Denne sjekklisten brukes før produksjonsbygget.

## 1. Hent siste kode

```powershell
git checkout feature/local-calendar-sync
git pull origin feature/local-calendar-sync
```

## 2. Oppdater avhengighetslåsen

SecureStore må finnes både i `package.json` og `package-lock.json`.

```powershell
npx expo install expo-secure-store
npm install
```

Commit den oppdaterte låsefilen:

```powershell
git add package.json package-lock.json
git commit -m "Update production dependency lockfile"
git push origin feature/local-calendar-sync
```

## 3. Kjør produksjonskontrollen

```powershell
npm run release:check
```

Kontrollen må avsluttes med:

```text
Produksjonskontrollen besto. Appen er klar for EAS production build.
```

## 4. Test på fysisk iPhone

Kjør hele `docs/TESTING.md`, spesielt:

- Face ID og direkte lenker til arbeidsrutene
- appveksleren og automatisk låsing etter 2 minutter
- dagsvisning og månedsfiltrering
- varslinger på låst telefon
- importerte initialer
- frakobling fra PC
- PC av, feil token og ugyldig adresse

## 5. Kontroller PC-portalen

- Installer sikkerhetsoppdatering v3.
- Kjør `SJEKK-SYNKSIKKERHET.ps1`.
- Roter paringstokenet dersom det har vært vist eller delt under utvikling.
- Bekreft at telefon og PC bruker samme private nettverk.

## 6. Kontroller App Store-informasjon

Følgende må være klart før innsending:

- appnavn: Avtale
- versjon: 1.0.0
- bundle ID: `no.haugstulen.avtale`
- appikon og skjermbilder
- supportadresse eller supportside
- offentlig URL til personvernerklæringen
- App Privacy-svar som samsvarer med faktisk databehandling

## 7. Bygg produksjonsappen

Når alle kontroller er bestått:

```powershell
eas build --platform ios
```

Kommandoen bruker `production`-profilen i `eas.json`. Profilen er konfigurert for App Store-distribusjon og automatisk økning av iOS-buildnummeret.

## 8. Etter bygget

Installer eller distribuer først via TestFlight. Gjennomfør en siste full test på den faktiske produksjonsbygningen før innsending til App Store.

Produksjonsbygget skal ikke sendes inn dersom `npm run release:check` eller GitHub-kontrollen feiler.

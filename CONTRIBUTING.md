# Bidragsregler

## Filstørrelse

Alle kildekodefiler skal som hovedregel være på maksimum **150 linjer**.

Dette gjelder spesielt:

- React Native-komponenter
- skjermer
- hooks
- services
- hjelpefunksjoner
- modeller

## Når en fil nærmer seg grensen

Del opp etter ansvar:

- flytt gjenbrukbar UI til `src/components/`
- flytt logikk til `src/hooks/`
- flytt lagring og native-integrasjoner til `src/services/`
- flytt konstanter til `src/constants/`
- flytt typer til `src/models/`

## Unntak

Unntak skal være sjeldne og begrunnes i en kommentar eller pull request.

Genererte filer, lock-filer og konfigurasjonsfiler kan overstige 150 linjer dersom verktøyet krever det.

## Mål

Regelen skal holde filene enkle å lese, teste og endre uten at én fil får for mange ansvarsområder.

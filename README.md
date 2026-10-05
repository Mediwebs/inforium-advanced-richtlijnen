# Inforium CHIPboard v0.8

[Open Oncologie Groningen](https://mediwebs.github.io/inforium-advanced-richtlijnen/#groningen): 4.627 metadata-verwijzingen uit de eerdere inventaris van 3 oktober 2026. Geen nieuwe inhoudelijke hercontrole. [Integratie en herkomst](docs/V0.3.md).

Vier vakgebieden: KNO, cardiologie, oncologie en radiotherapie. [Actuele uitbreiding en verificatie](docs/V0.2.md).

[Open het klikbare prototype](https://mediwebs.github.io/inforium-advanced-richtlijnen/).

Klikbare bronnenwerkplek voor richtlijnen en uitbreidbare bronlagen. Zoeken met algemene trefwoorden; geen dossiers of gegenereerde medische antwoorden.

[Algemeen zoeken](https://mediwebs.github.io/inforium-advanced-richtlijnen/#zoeken) doorzoekt 4.701 bronkaarten. Alle trefwoorden gaan vóór gedeeltelijke overeenkomsten; elke kaart toont waarom hij gevonden is. [Werking en beperkingen v0.4](docs/V0.4.md).

## PZNL en bronselectie v0.5

61 PZNL-bronkaarten toegevoegd: 54 richtlijnen/handreikingen uit het officiële Palliaweb-overzicht, 2 praktijkbronnen en 5 ingangen voor patiënten en naasten. Selecteer bovenaan één of meerdere broncollecties. De selectie geldt voor algemeen zoeken; de bestaande vakbibliotheek blijft apart. [Werking, bronherkomst en verificatie](docs/V0.5.md).

## Resultaten verfijnen v0.6

Filter op soort informatie, doelgroep, vakgebied en toegangsstatus. Alle aanvullende trefwoorden moeten binnen het bestaande resultaat voorkomen. Sorteer op overeenkomst, broncollectie, alfabet of geopende bronkaarten in deze sessie. Deze gebruikstelling is niet algemeen, wordt niet bewaard of verzonden en reset bij herladen. [Werking en verificatie](docs/V0.6.md).

## Parallelle compacte versie

[Open CHIPboard Compact](https://mediwebs.github.io/inforium-advanced-richtlijnen/compact.html#zoeken). De uitgebreide versie blijft beschikbaar op index.html. Beide gebruiken dezelfde bronbestanden en zoeklogica; sessieselecties worden niet tussen vensters overgedragen. De compacte variant toont bronlinks bovenaan, korte kaarten en details op aanvraag. [Ontwerp en aansluitroute voor Inforium Advanced](docs/COMPACT.md).

## Geïntegreerde Inforium-werkplek

[Open Inforium Advanced × CHIPboard](https://mediwebs.github.io/inforium-advanced-richtlijnen/integrated.html#start). Een derde prototype in de groene Inforium-stijl, met gezamenlijk zoeken, patiënteninformatie, nieuws en een werkmap. Bevat dezelfde 4.701 bronkaarten plus 15 expliciet gemarkeerde ontwerpvoorbeelden. Een informatiepakket toont uitsluitend echte patiëntenbronlinks; er wordt niets verzonden. [Werking, herkomst en vervolgintegratie](docs/INTEGRATED.md).

## Gebruiken

Selecteer vakgebied, onderwerp, taak en brontype. Open een bronkaart voor herkomst en brondata. Voeg kaarten toe aan Mijn Chipboard om ze naast elkaar te bekijken. Zet de demonstratie van andere bronlagen aan om lokale, regionale/transmurale, patiënten- en sociaal-domeinkaarten te proberen. Deze vier kaarten bevatten **geen echte afspraken of informatie**.

Modules & koppelingen toont het modulecontract en een vaste link naar het bestaande oncologieprototype. Bronnen & updates demonstreert de route van wijziging naar gecontroleerde release. Deze demonstratie is geen beheersysteem en wijzigt geen data.

## Starten en testen

Vereist Node.js 22 en pnpm 11.19.0.

```sh
pnpm install --frozen-lockfile
pnpm test
pnpm run build
pnpm start
```

Open http://127.0.0.1:4173. De relatieve assets en hash-navigatie werken ook onder een GitHub Pages-projectpad. Geen frontendgeheimen of productie-API nodig.

## Inhoud en beperkingen

- 15 bronverwijzingen: 3 algemene, 7 richtlijnoverzichten en 5 afzonderlijke modules. 13 unieke bronkaarten: 3 oorspronkelijke voorbeelden en 10 nieuwe navigatiekaarten.
- 0 professioneel goedgekeurde afgeleide records; 0 echte lokale of regionale afspraken gekoppeld; PZNL-patiënteninformatie is beschikbaar via de algemene zoekfunctie.
- Bronmetadata van de twee inhoudelijke modules opnieuw geraadpleegd op 2026-10-04; dit is geen medische validatie.
- Filters en geselecteerde kaarten leven alleen in paginageheugen. Herladen wist het bord.
- Geen generatieve AI, tracking, patiëntkenmerken, EPD-koppeling of verzending van zoektrefwoorden. Hosting en geopende externe sites verwerken gewone webverzoeken.
- Geen diagnose, triage, behandelkeuze, geschiktheidsscore of MDR-vrijstellingsclaim.

De aangeleverde toepasbaarheidslogica blijft uitsluitend in `research/logic.js` voor reproduceerbare tests, buiten de gepubliceerde website. De openbare UI filtert bibliotheekmetadata en gebruikt die logica niet.

## Bestanden en uitbreiden

| Bestand | Functie |
|---|---|
| data/catalogus.json | Tien aanvullende, gedeelde navigatiekaarten voor vier vakgebieden |
| schema/catalogus.schema.json | Contract voor catalogusmetadata |
| data/bronnen.json | Originele URL's en afzonderlijke brondata |
| data/voorbeeldacties.json | Ongewijzigde drie overdrachtsrecords |
| schema/actie.schema.json | Aangeleverd JSON Schema 2020-12 |
| data/modules.json | Versiebeheerde modulemanifesten |
| src/search.js | Lokale trefwoordindex, uitlegbare rangschikking en zoekverwanten |
| src/core.js | Pure metadatafilters, manifestcontrole, demostatus |
| src/app.js | Schermen en expliciete demonstratiekaarten |
| research/logic.js | Niet gedeployde logische onderzoeksfixtures |
| scripts/build.mjs | Schemavalidatie, referentiecontrole en statische build |
| scripts/check-sources.mjs | Handmatige HTTP-controle; geen inhoudelijke goedkeuring |
| docs/ARCHITECTUUR.md | Integratie, beheerroute en juridische afbakening |
| docs/VERIFICATIE.md | Testresultaten en afwijkingen van het pakket |

## Publicatie en updates

GitHub Actions valideert, test en bouwt bij een push naar main, en publiceert dist via GitHub Pages. Pages moet op GitHub Actions staan. Wijzigingen in inhoud via een aparte branch en pull request laten beoordelen; een groene technische check is geen inhoudelijke autorisatie. Er is in v0.1 geen beschermde branch of redactierol ingericht.

`pnpm check:sources` schrijft lokaal source-check.json (niet in Git). Een foutcode vraagt technische hercontrole, niet automatisch intrekken van medisch materiaal. Het script detecteert nog geen inhoudelijke wijzigingen. Er is geen periodieke controle ingepland.

## Centrale documentatie

[Bouwdocument in het AI-documentenarchief](https://docs.google.com/document/d/1EbProqNrQdAepnqv-9Iahd9nGj1eqGr9E45ijb6NO-k/edit).

## Herkomst

- Aangemaakt: 2026-10-04; laatst bijgewerkt: 2026-10-05.
- AI-omgeving: Codex; project: Inforium CHIP / Chipboard.
- Lokale Codex-projectmap: richtlijnen en lokale afspraken integratie.
- Sessie-ID: 01a105b5-7b3f-7b10-8500-2b07574e5156. Chatnaam niet afzonderlijk vastgesteld.
- Basis: Inforium_Richtlijnen_Codex_Overdracht.zip (versie 2026-10-04), inclusief bronregister, drie records, JSON-schema en acceptatiegevallen.
- Repositorybestemming: Mediwebs/inforium-advanced-richtlijnen.
- Status: werkdocument bij prototype v0.6; niet klinisch gevalideerd.

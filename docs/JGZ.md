# Inforium CHIPboard — Jeugdgezondheidszorg

Losstaande editie v0.13 met een eigen URL, startpagina, zoekfunctie, bronselectie, werkmap en bronnenoverzicht. De Inforium-look-and-feel blijft behouden. De bestaande algemene versies zijn apart beschikbaar.

## Bronselectie

NCJ: 37 JGZ-richtlijnen. NHG: 200 verwijzingen. Richtlijnendatabase: de bestaande beperkte selectie van 13 kaarten, niet de volledige landelijke database.
Patiënteninformatie: GroeiGids 1.081, Thuisarts 2.090, Voedingscentrum 801, RIVM 330, Kinderveiligheid 184 en Pharos 279 kaarten.
Totaal: 5.015 kaarten, waarvan 250 kennisbronnen en 4.765 patiënteninformatiekaarten. De bronselectie betekent niet dat iedere kaart geschikt is voor iedere JGZ-vraag; geen beoordeling van patiëntgeschiktheid.

## Werking

De JGZ-pagina laadt uitsluitend haar eigen catalogus met deze negen collecties. Geen Groningen-, Kanker.nl-, AUMC- of NVOG-collecties en geen Inforium-ontwerpvoorbeelden. Bronregister toont aantallen, herkomstbestanden, linkstatus en dekking. Zoekfilters, aanvullende trefwoorden, sortering, details en werkmap werken zoals in de compacte versie. Bronselectie en werkmap zijn alleen in paginageheugen aanwezig.
Patiëntenlinks kunnen worden gekopieerd en als lokaal gegenereerde QR-code getoond. Het voorbeeldpakket bevat uitsluitend patiëntenlinks. De echte Inforium-verzendkoppeling blijft niet ingesteld; de knop meldt dat niets is verzonden. Geen patiënt- of ontvangerinvoer.

## Importcontrole

Kinderveiligheid: 184 regels. Pharos: 279 regels. RIVM: 331 regels, samengevoegd tot 330 kaarten doordat twee verwijzingen naar dezelfde eindbestemming leiden. Alle originele rijverwijzingen blijven bewaard.
112 oude RIVM-HTTP-links zijn technisch gecontroleerd. Voor 106 is een bereikbare HTTPS-eindbestemming vastgesteld en overgenomen. Zes RIVM-links en één onvolledig Pharos-adres blijven gemarkeerd als te controleren; geen actieve deelacties. Dit is geen inhoudelijke medische beoordeling. Andere links zijn niet volledig opnieuw gecontroleerd.
De Pharos-export bevat aantoonbare titel/trefwoord-mismatches. Daarom zijn alle aangeleverde Pharos-trefwoorden buiten de zoekindex gehouden; zoeken gebruikt de titels en collectie. Dit voorkomt dat bijvoorbeeld een diabeteskaart op foutief gekoppelde HPV-trefwoorden wordt gevonden. Geen zelfbedachte vervangende trefwoorden.
De eerdere 44 te controleren GroeiGids- en Thuisarts-kaarten blijven ook gemarkeerd. In de JGZ-editie zijn daarmee 51 kaarten met een te controleren link. Exportdatum 5 oktober 2026 is geen publicatie- of geldigheidsdatum.

## Beheer en controle

De build genereert jgz.html en data/jgz-library.json uit de gedeelde catalogi en data/jgz-additions.json. src/jgz.js valideert de selectie. Bronupdates worden via een gecontroleerde nieuwe release verwerkt; er is geen live synchronisatie of automatische medische herbeoordeling.
50 geautomatiseerde tests. Browsercontrole: negen collecties, slechts één JGZ-databestand geladen, Pharos zoeken, QR, informatiepakket, bronnenoverzicht, RIVM-aantallen, mobiel, afgeschermde routes en behoud van de algemene versie.

## Herkomst

Aangemaakt en laatst bijgewerkt: 2026-10-05. AI-omgeving: Codex. Project: Inforium CHIP / JGZ. Taak: losstaande Jeugdgezondheidszorg-versie, inclusief Pharos op expliciet verzoek.
Repository: Mediwebs/inforium-advanced-richtlijnen. Codex-projectmap: richtlijnen en lokale afspraken integratie. Sessie-ID: 01a105b5-7b3f-7b10-8500-2b07574e5156.
Nieuwe bronnen: data_Kinderveiligheid_05-10-2026.csv, data_Pharos_05-10-2026.csv en data_RIVM_05-10-2026.csv, door gebruiker aangeleverd vanuit Mijn Drive/000temp. Originelen ongewijzigd; SHA-256 en rijherkomst in data/jgz-additions.json. Kinderveiligheid en RIVM UTF-8; Pharos Windows-1252.
Voortbouwend op docs/INTEGRATED.md, data/primary-guidelines.json, data/patient-sources.json en de bestaande Richtlijnendatabase-catalogus. Status: werkdocument bij klikbaar prototype; niet klinisch gevalideerd.

[Open JGZ](https://mediwebs.github.io/inforium-advanced-richtlijnen/jgz.html#start)

[Native archiefdocument](https://docs.google.com/document/d/1hy2AwdkHDc9rS1YYJHA4t6JJZYiMQ7wNUnknAj4ftw0/edit)

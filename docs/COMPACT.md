# CHIPboard Compact — parallelle versie

Doel en bereik

Een tweede presentatie naast de bestaande uitgebreide versie. Compact gebruikt dezelfde 4.701 bronkaarten, zoeklogica, filters en sessietelling. De build maakt compact.html naast index.html; gegevens worden niet gedupliceerd. Een link bovenaan wisselt tussen de versies. Bij het openen van de andere pagina begint een nieuwe sessie; bordselecties en zoektermen worden niet overgedragen.

Compacte bediening

Korte kaarten in twee kolommen op een gangbaar desktopscherm, drie op brede schermen en één op mobiel. Bronselectie, kenmerkfilters en uitleg klappen open wanneer nodig. Zonder zoekterm kan de gebruiker door de bestaande catalogus bladeren.

De brontitel bovenaan is de directe externe bronlink. Klikken op het kaartvak of Details opent herkomst, datums, inhoudelijke status en de beschikbare uitleg Waarom gevonden. Ook in het detailvenster staat Open oorspronkelijke bron bovenaan. De knop + Chipboard bewaart de kaart in de huidige sessie.

Voorbereiding Inforium Advanced

De indeling biedt afzonderlijke ingangen voor kennisbronnen, patiënteninformatie en nieuws. Deze tonen uitsluitend bestaande CHIPboard-catalogusrecords. Inforium Advanced is als openbare ontwerpverwijzing bekeken: een JGZ-werkplek met ouderinformatie, collecties en illustratieve nieuwsberichten. Er is geen nieuwsfeed, accountkoppeling of patiënteninformatiesynchronisatie aangelegd.

src/compact.js bevat contentTypeOf, met knowledge, patient en news als presentatiecategorieën. Een toekomstige adapter kan contentType expliciet aanleveren; huidige records worden ingedeeld volgens bestaande doelgroep- en soortmetadata. De oorspronkelijke broncollectie blijft apart herkenbaar.

Aansluitroute voor de volgende stap

Leg per toekomstige collectie eigenaar, gebruiksrechten en actualisatie vast. Maak een adapter voor bron-ID, titel, vaste bron-URL, collectie, doelgroep, type, herkomst en afzonderlijke publicatie-, wijzigings- en raadpleegdatums. Registreer de collectie in SOURCE_COLLECTIONS en voeg haar metadata toe aan de gedeelde zoekindex. Een link naar een applicatie maakt de inhoud daarvan niet automatisch doorzoekbaar.

Voor nieuws blijft publicatiedatum gescheiden van medische geldigheid; een nieuwsbericht wordt geen richtlijn. Voor patiënteninformatie blijft de doelgroep zichtbaar. Bij ontbrekende velden wordt geen medische geschiktheid afgeleid. Dit ontwerp bereidt de interface voor; de toekomstige koppeling vraagt nog een adapter, rechtencontrole en tests.

Techniek en verificatie

src/compact.js en src/compact.css verzorgen de afzonderlijke presentatie. src/app.js deelt data, zoeken, filters, bord en dialogen. scripts/build.mjs genereert compact.html met dezelfde relatieve assets, zodat beide versies onder het GitHub Pages-projectpad werken.

34 geautomatiseerde tests geslaagd. De browsercontrole verifieert acht volledige kaarten zonder scrollen bij 1440 × 1000 pixels, bronlinks bovenaan, klikken op kaart en Details, toetsenbordbediening, bronselectie, filters, bewaren, inhoudstypen en mobiel/tablet zonder horizontale pagina-overloop. De uitgebreide resultaatfilters zijn opnieuw getest.

Herkomst

Aangemaakt en laatst bijgewerkt: 2026-10-05.

AI-omgeving: Codex. Project: Inforium CHIP / Chipboard.

Repository: Mediwebs/inforium-advanced-richtlijnen.

Codex-projectmap: richtlijnen en lokale afspraken integratie.

Sessie-ID: 01a105b5-7b3f-7b10-8500-2b07574e5156.

Voortbouwend op docs/V0.6.md en de bestaande broncatalogi. Ontwerpverwijzing: de door gebruiker opgegeven openbare Inforium Advanced-website.

Status: werkdocument bij compact prototype; toekomstige integratie nog niet uitgevoerd.



[Compact prototype](https://mediwebs.github.io/inforium-advanced-richtlijnen/compact.html#zoeken)

[Inforium Advanced — ontwerpverwijzing](https://mediwebs.github.io/Inforium-advanced/)

[Native archiefdocument](https://docs.google.com/document/d/1dlu68qgPFXwasu3osGXoF0K6GKVS2yo-ng2JbrkDZ3Y/edit)

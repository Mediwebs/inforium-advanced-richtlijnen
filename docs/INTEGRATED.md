# Inforium Advanced × CHIPboard — geïntegreerde werkplek



## Doel en bediening

Derde, parallelle versie naast CHIPboard uitgebreid en compact. Mintgroene navigatie, warme oranje accenten, compacte bronkaarten en iconen volgen de uitstraling van Inforium Advanced. Start, Alle informatie, Patiënteninformatie, Nieuws & inspiratie en Mijn werkmap bieden één ingang voor de zorgverlener.
Zoeken doorzoekt lokale metadata. Bronselectie, extra trefwoorden, kenmerken en sorteervolgorde blijven beschikbaar. Overeenkomst is trefwoordovereenkomst, geen medische geschiktheid. Details tonen de herkomst; echte bronlinks staan bovenaan.

## Inhoud en grenzen

12.221 bestaande bronkaarten: 13 landelijke kaarten, 4.627 Groningen-verwijzingen, 61 PZNL-verwijzingen, 200 NHG-verwijzingen 37 NCJ/JGZ-richtlijnen en 4.363 eerdere patiënteninformatiekaarten en 2.920 aanvullende Amsterdam UMC-, NVOG-, Kanker.nl- en transmurale kaarten. Daarnaast 12 patiënteninformatievoorbeelden en 3 nieuwsvoorbeelden uit het Inforium Advanced-ontwerp. Deze 15 kaarten hebben geen gecontroleerde artikel-URL en zijn zichtbaar als ontwerpvoorbeeld gemarkeerd. Nieuws uit de bestaande inventaris is geen actuele nieuwsfeed.
Mijn werkmap bewaart kaarten uitsluitend in deze sessie. Het voorbeeld van een informatiepakket toont alleen geselecteerde echte patiëntenbronlinks; professionele bronnen, nieuws en ontwerpvoorbeelden worden uitgesloten. Er is geen verzending, ontvangerinvoer, patiëntdossier, generatieve beantwoording of automatische behandelkeuze. Dit prototype doet geen juridische MDR-vrijstellingsclaim.

## Vervolg voor echte integratie

Vervang ontwerpvoorbeelden via een afzonderlijke bronadapter door geautoriseerde Inforium-metadata met stabiele ID, contentType, titel, originele URL, eigenaar, doelgroep, onderwerp, versie en afzonderlijke actualiteits- en controledatum. Behoud bronidentiteit en rechten; ken een onbekende datum geen geldigheid toe.
Koppel nieuws als eigen collectie met publicatiedatum, redactionele status en bronlink. Laat nieuwe adapters eerst valideren en redactioneel controleren voordat ze in een release worden opgenomen. De huidige gedeelde zoekindex, kaartcomponenten en modulemanifesten vormen de aansluiting. Er is nog geen live Inforium-API of CMS gekoppeld.

## Controle

48 geautomatiseerde tests geslaagd. Browsercontrole van zoeken, echte bronnen versus voorbeelden, leeftijdslabels, patiënten- en nieuwsingangen, gemengde werkmap, informatiepakket, bronlinks bovenaan en mobiele weergave. Bestaande compacte versie eveneens gecontroleerd.

## Uitbreiding NHG en NCJ — v0.9

Op 5 oktober 2026 toegevoegd vanuit de officiële richtlijnoverzichten: 200 NHG-verwijzingen en 37 NCJ/JGZ-richtlijnen. NHG omvat standaarden, behandelrichtlijnen, standpunten, LESA’s, LTA’s, multidisciplinaire verwijzingen, een praktijkorganisatorische richtlijn en professionele zelfzorgadviezen. Beide collecties zijn afzonderlijk selecteerbaar en doorzoekbaar in alle drie interfaces; informatietypen zijn filterbaar. Alleen titels en bronlinks geïmporteerd. Geen inhoudelijke geldigheidsbeoordeling of live synchronisatie.

Bronnen: [NHG-richtlijnen](https://richtlijnen.nhg.org/) en [NCJ/JGZ-richtlijnen](https://www.jgzrichtlijnen.nl/richtlijnen/). De NHG-overzichten zijn via de browser gelezen; directe HTTP-aanvragen kregen een browsercontrole. NCJ regisseert de JGZ-richtlijnen; beroepsverenigingen zijn eigenaar.

## Patiënteninformatie uit CSV — v0.10

De vijf aangeleverde exports van 5 oktober 2026 zijn toegevoegd als afzonderlijke broncollecties in alle drie interfaces. 4.654 exportregels zijn samengevoegd tot 4.363 kaarten op basis van dezelfde URL binnen dezelfde collectie; 291 dubbele vermeldingen behouden hun oorspronkelijke titels, bron-ID's en zoektrefwoorden. Geen samenvoeging tussen verschillende uitgevers.

| Collectie | Exportregels | Kaarten | Link controleren |
|---|---:|---:|---:|
| GroeiGids | 1.103 | 1.081 | 43 |
| Kanker.nl | 285 | 284 | 0 |
| KNO (V2) | 111 | 107 | 0 |
| Thuisarts | 2.354 | 2.090 | 1 |
| Voedingscentrum | 801 | 801 | 0 |

De 44 gemarkeerde kaarten blijven zoekbaar, maar hebben geen actieve bronlink en worden niet opgenomen in informatiepakketten: één ontbrekende GroeiGids-link, 42 unieke GroeiGids-links met een vraagteken in het artikelpad en één afwijkend Thuisarts-domein. Andere links zijn uit de export overgenomen; er is geen volledige bereikbaarheids- of inhoudscontrole uitgevoerd.

CSV zonder kopregels: kolom 1 bron-ID, 3 URL, 4 titel, 5 bronlabel, 11 zoektrefwoorden en 18 oorspronkelijk taallabel. Onbekende numerieke categorieën zijn niet vertaald naar medische kenmerken. Taalmetadata is alleen als oorspronkelijke variant bewaard, omdat sommige Engelstalige labels Nederlandse titels en links hebben. GroeiGids, KNO en Voedingscentrum zijn als Windows-1252 gelezen; de andere twee als UTF-8. Eén onbeschermde HTML-entiteit &apos; in een Voedingscentrum-PDF-link veroorzaakte 28 kolommen en is hersteld naar het apostrofteken. Oorspronkelijke linkwaarde blijft bewaard. Interne importnotities en beheertags zijn niet gepubliceerd.

Bronbestanden: data_Groeigids_05-10-2026.csv, data_Kanker.nl_05-10-2026.csv, data_KNO (V2)_05-10-2026.csv, data_Thuisarts_05-10-2026.csv en data_Voedingscentrum_05-10-2026.csv. Aangeleverd door de gebruiker vanuit Mijn Drive/000temp. Bestandshashes, aantallen en rijherkomst staan in data/patient-sources.json; validatie in src/patient-sources.js. Exportdatum en importdatum zijn geen publicatie- of geldigheidsdatum. Originele bestanden blijven ongewijzigd.

## Patiënteninformatie delen — v0.11

Patiëntenkaarten met een bruikbare bronlink bieden Verzenden met Inforium, QR-code en Link kopiëren. Dezelfde acties zijn beschikbaar in Details en de werkmap. QR en kopiëren verwijzen naar de oorspronkelijke bron, met behoud van query en fragment. QR wordt lokaal gegenereerd; geen externe QR-service. Bij geblokkeerde klembordtoegang wordt de link selecteerbaar getoond. Voorbeelden, professionele richtlijnen en te controleren links krijgen geen deelacties.

De Inforium-verzendroute is nog niet aangeleverd. Die knop toont expliciet dat de koppeling ontbreekt en er niets is verzonden; alleen de link kan worden gekopieerd voor gebruik in de bestaande Inforium-omgeving. Geen ontvanger- of patiëntinvoer toegevoegd. De echte verzendintegratie blijft afhankelijk van de juiste URL/API en authenticatieafspraken.

QR-bibliotheek: qrcode-generator 1.4.4, Kazuhiko Arase, MIT; lokaal opgenomen in src/vendor/qrcode.js met ESM-export. Herkomst: https://github.com/kazuhikoarase/qrcode-generator en de vastgepinde npm-distributie. Browsercontrole: QR onafhankelijk gedecodeerd met jsQR, klembord en terugval getest, mobiel en geen netwerkverkeer tijdens delen.

## Aanvullende Amsterdam UMC-, NVOG- en radiotherapiebronnen — v0.12

Zeven aangeleverde CSV-bestanden bevatten 2.923 regels. Na samenvoegen van één dubbele link binnen de nieuwe import en twee bestaande Kanker.nl-links zijn 2.887 nieuwe patiënteninformatiekaarten en 33 professionele werkafspraken toegevoegd. De volledige catalogus bevat nu 12.221 bronkaarten plus 15 Inforium-ontwerpvoorbeelden.

- Amsterdam UMC: 2.659 kaarten uit de algemene patiënteninformatie, beide Hartcentrum-bestanden en Radiotherapie.
- NVOG: 134 videokaarten, met taal en bronpagina uit de export. Nederlands, Engels en Arabisch komen voor; er zijn geen nieuwe vertalingen gemaakt.
- Kanker.nl Radiotherapie: 96 vermeldingen, waarvan 94 nieuwe kaarten. De collectie Kanker.nl bevat nu 378 kaarten.
- Transmuraal Amsterdam: 33 werkafspraken voor zorgverleners, op expliciete bevestiging van de gebruiker gescheiden van patiënteninformatie. Geen patiënten-deelacties of opname in informatiepakketten.

Taalcodes worden behouden en zichtbaar gemaakt; zoeken op bijvoorbeeld Arabisch vindt die taalmetadata. Amsterdam UMC bevat ook Turks, Frans, Tigrinya en Somalisch. Specifieke Hartcentrum- en Radiotherapie-bestanden houden hun vakgebied; overige onbekende categorieën worden niet ingevuld. Video's worden via de oorspronkelijke link geopend, niet automatisch ingebed of afgespeeld.

Een Kanker.nl-exporttitel L77: is na broncontrole vervangen door Gevolgen van bestraling, met type Lotgenoten · gespreksgroep. Oorspronkelijke titel blijft in de rijherkomst staan. Titelbron: https://www.kanker.nl/ervaringen-van-anderen/gespreksgroepen/gevolgen-van-bestraling. Overige links zijn overgenomen, zonder volledige hercontrole van bereikbaarheid of inhoud. Exportdatum ontbreekt in deze bestanden; importdatum is 5 oktober 2026. Notities over eerdere raadpleging zijn geen nieuwe medische controle.

Bronbestanden: AUMC_Hartcentrum_aanvullend_CHIP_import.csv; Transmuraal_Amsterdam_CHIP_import.csv; AUMC_Hartcentrum_CHIP_import (1).csv; NVOG_Videos_Alle_talen_CHIP_import.csv; Kanker_nl_Radiotherapie_CHIP_import.csv; AUMC_Alle_patienteninformatie_CHIP_import.csv; AUMC_Radiotherapie_CHIP_import.csv. Aangeleverd vanuit Mijn Drive/000temp, ongewijzigd behouden. SHA-256-bestandshashes en rijherkomst: data/extra-sources.json. Validatie en samenvoegen: src/extra-sources.js. Alle bestanden UTF-8; Radiotherapie bevat 24 kolommen, de overige 27. Ontbrekende eindkolommen worden niet geïnterpreteerd.

48 tests geslaagd. Browsercontrole in alle drie interfaces: bronselectie, aantallen, Arabisch zoeken, bronpagina bij video, professionele uitsluiting, AUMC-snelkeuze en mobiele weergave.

## Herkomst

Datum aangemaakt en laatst bijgewerkt: 2026-10-05.
AI-omgeving: Codex. Project: Inforium CHIP / Chipboard.
Taak: geïntegreerd prototype Inforium Advanced × CHIPboard.
Repository: Mediwebs/inforium-advanced-richtlijnen.
Codex-projectmap: richtlijnen en lokale afspraken integratie.
Sessie-ID: 01a105b5-7b3f-7b10-8500-2b07574e5156.
Voortbouwend op docs/COMPACT.md en de bestaande broncatalogi.
Ontwerpbron: Mediwebs/Inforium-advanced, commit e2ccdfeb290bc3d339415fad2b74e8f35b3e5c22; geraadpleegd 2026-10-05. Groningen-inventaris: 2026-10-03. PZNL-overzicht: gecontroleerd 2026-10-05; geen inhoudelijke medische herbeoordeling.
Status: werkdocument bij klikbaar prototype v0.12.

[Klikbaar prototype](https://mediwebs.github.io/inforium-advanced-richtlijnen/integrated.html#start)

[Native archiefdocument](https://docs.google.com/document/d/1AMngZ-_kPyzl9RyLoeyIYCjeNlwgMNBGlWPPhBEdKws/edit)

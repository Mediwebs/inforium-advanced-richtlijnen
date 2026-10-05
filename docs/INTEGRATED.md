# Inforium Advanced × CHIPboard — geïntegreerde werkplek



## Doel en bediening

Derde, parallelle versie naast CHIPboard uitgebreid en compact. Mintgroene navigatie, warme oranje accenten, compacte bronkaarten en iconen volgen de uitstraling van Inforium Advanced. Start, Alle informatie, Patiënteninformatie, Nieuws & inspiratie en Mijn werkmap bieden één ingang voor de zorgverlener.
Zoeken doorzoekt lokale metadata. Bronselectie, extra trefwoorden, kenmerken en sorteervolgorde blijven beschikbaar. Overeenkomst is trefwoordovereenkomst, geen medische geschiktheid. Details tonen de herkomst; echte bronlinks staan bovenaan.

## Inhoud en grenzen

9.301 bestaande bronkaarten: 13 landelijke kaarten, 4.627 Groningen-verwijzingen, 61 PZNL-verwijzingen, 200 NHG-verwijzingen 37 NCJ/JGZ-richtlijnen en 4.363 patiënteninformatiekaarten uit de aangeleverde exports. Daarnaast 12 patiënteninformatievoorbeelden en 3 nieuwsvoorbeelden uit het Inforium Advanced-ontwerp. Deze 15 kaarten hebben geen gecontroleerde artikel-URL en zijn zichtbaar als ontwerpvoorbeeld gemarkeerd. Nieuws uit de bestaande inventaris is geen actuele nieuwsfeed.
Mijn werkmap bewaart kaarten uitsluitend in deze sessie. Het voorbeeld van een informatiepakket toont alleen geselecteerde echte patiëntenbronlinks; professionele bronnen, nieuws en ontwerpvoorbeelden worden uitgesloten. Er is geen verzending, ontvangerinvoer, patiëntdossier, generatieve beantwoording of automatische behandelkeuze. Dit prototype doet geen juridische MDR-vrijstellingsclaim.

## Vervolg voor echte integratie

Vervang ontwerpvoorbeelden via een afzonderlijke bronadapter door geautoriseerde Inforium-metadata met stabiele ID, contentType, titel, originele URL, eigenaar, doelgroep, onderwerp, versie en afzonderlijke actualiteits- en controledatum. Behoud bronidentiteit en rechten; ken een onbekende datum geen geldigheid toe.
Koppel nieuws als eigen collectie met publicatiedatum, redactionele status en bronlink. Laat nieuwe adapters eerst valideren en redactioneel controleren voordat ze in een release worden opgenomen. De huidige gedeelde zoekindex, kaartcomponenten en modulemanifesten vormen de aansluiting. Er is nog geen live Inforium-API of CMS gekoppeld.

## Controle

43 geautomatiseerde tests geslaagd. Browsercontrole van zoeken, echte bronnen versus voorbeelden, leeftijdslabels, patiënten- en nieuwsingangen, gemengde werkmap, informatiepakket, bronlinks bovenaan en mobiele weergave. Bestaande compacte versie eveneens gecontroleerd.

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

## Herkomst

Datum aangemaakt en laatst bijgewerkt: 2026-10-05.
AI-omgeving: Codex. Project: Inforium CHIP / Chipboard.
Taak: geïntegreerd prototype Inforium Advanced × CHIPboard.
Repository: Mediwebs/inforium-advanced-richtlijnen.
Codex-projectmap: richtlijnen en lokale afspraken integratie.
Sessie-ID: 01a105b5-7b3f-7b10-8500-2b07574e5156.
Voortbouwend op docs/COMPACT.md en de bestaande broncatalogi.
Ontwerpbron: Mediwebs/Inforium-advanced, commit e2ccdfeb290bc3d339415fad2b74e8f35b3e5c22; geraadpleegd 2026-10-05. Groningen-inventaris: 2026-10-03. PZNL-overzicht: gecontroleerd 2026-10-05; geen inhoudelijke medische herbeoordeling.
Status: werkdocument bij klikbaar prototype v0.10.

[Klikbaar prototype](https://mediwebs.github.io/inforium-advanced-richtlijnen/integrated.html#start)

[Native archiefdocument](https://docs.google.com/document/d/1AMngZ-_kPyzl9RyLoeyIYCjeNlwgMNBGlWPPhBEdKws/edit)

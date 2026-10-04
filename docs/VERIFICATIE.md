# Verificatie prototype v0.1

Datum: 2026-10-04. Status: technische prototypecontrole; geen medische, juridische of volledige toegankelijkheidscertificering.

## Uitgevoerd

- 11 Node-tests geslaagd: AND/OR met onbekend, geen kruismatching van alternatieven, expliciete ontkenning, onbekend versus afwezig, uitsluitingen, navigatierecords, metadatafilters, modulecontract, volgorde van de updatedemo en afwezigheid van vrije patiëntinvoer/browseropslag.
- Alle 3 actierecords gevalideerd tegen het oorspronkelijke JSON Schema, bronverwijzingen gecontroleerd, 2 modulemanifesten gevalideerd.
- Browsercontrole met Edge/Playwright: desktop 1440 px, mobiel 390 px, geen horizontale pagina-overloop; visueel bekeken via screenshots.
- Bronpaneel met Enter geopend, met Escape gesloten, focus keert terug naar de opener.
- Filters, lege resultaten, demo opt-in, twee bronlagen op bord, drie opvolgende demoupdatestappen, modulecontract, routeherladen en fout bij geblokkeerde JSON-download gecontroleerd.
- Tekstvergroting tot 200% op 768 px gecontroleerd op pagina-overloop. Geen volledige WCAG-audit uitgevoerd.
- De twee inhoudelijke richtlijn-URL's via webraadpleging geopend; publicatie- en geldigheidsdata bevestigd. Geen professionele beoordeling van afgeleide inhoud.

## Relatie met de meegeleverde acceptatiegevallen

context-unknown, context-complete, adult, unknown-not-absent, negation, grouping, exclusion en navigation worden waar relevant met pure logische tests afgedekt. De logica staat in research/ en wordt niet gepubliceerd. Geen NLP-parser of patiëntcontextinterface; de actuele gebruikerswens zonder patiëntgegevens heeft voorrang. no-diagnosis-inference wordt in de UI voorkomen door geen vrije tekst of diagnostische interpretatie toe te voegen. empty en accessibility zijn met de browser gecontroleerd. deployment is na publicatie op de openbare Pages-URL gecontroleerd; dezelfde browsercontroles slagen daar.

## Openbare publicatie

- Live: https://mediwebs.github.io/inforium-advanced-richtlijnen/
- Repository: https://github.com/Mediwebs/inforium-advanced-richtlijnen
- Eerste publicatierun: https://github.com/Mediwebs/inforium-advanced-richtlijnen/actions/runs/37186613580 (geslaagd).
- Openbare browsercontrole geslaagd op 2026-10-04; vijf bronlinks geven HTTP 200. Bereikbaarheid is geen medische actualiteitsbeoordeling.

## Niet gerealiseerd of niet bewezen

Automatische inhoudsupdates, medische validatie, echte lokale/regionale/transmurale/patiënten/sociale inhoud, redactionele autorisatie, data-uitwisseling met externe applicaties, volledige toegankelijkheidsaudit, penetratietest en definitieve MDR-kwalificatie. De updateknoppen zijn een simulatie. Gebruikersprestaties zijn niet gemeten.

## Herkomst

- Aangemaakt en laatst bijgewerkt: 2026-10-04.
- AI-omgeving: Codex; project: Inforium CHIP / Chipboard.
- Lokale Codex-projectmap: richtlijnen en lokale afspraken integratie.
- Sessie-ID: 01a105b5-7b3f-7b10-8500-2b07574e5156. Chatnaam niet afzonderlijk vastgesteld.
- Basis: Inforium_Richtlijnen_Codex_Overdracht.zip (versie 2026-10-04), inclusief bronregister, drie records, JSON-schema en acceptatiegevallen.
- Repositorybestemming: Mediwebs/inforium-advanced-richtlijnen.
- Status: werkdocument bij prototype v0.1; niet klinisch gevalideerd.

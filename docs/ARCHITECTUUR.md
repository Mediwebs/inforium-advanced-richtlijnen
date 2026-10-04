# Chipboard: modulaire integratie en beheer

## Doel en gerealiseerde doorsnede

Eén werkplek waarin zorgverleners generieke kennis en procesinformatie vinden, naast elkaar zetten en in de oorspronkelijke bron openen. Het prototype bouwt voort op de richtlijnendatabase, maar houdt nationale, lokale, regionale/transmurale, patiënten- en sociale bronnen gescheiden. Het doet geen uitspraak over wat bij een individuele patiënt passend is.

De gebruikersopdracht heeft voorrang op de bijgevoegde bouwbeschrijving. De vrije patiëntcontextzoeker, NLP-parser en toepasselijkheidsrangschikking uit het pakket zijn daarom niet in de openbare website opgenomen. De bronrecords en hun schema zijn behouden. De pure driewaardige logica wordt alleen buiten de productie-uitvoer getest voor traceerbaarheid.

## Huidige architectuur

Statische ES-modules zonder framework of productieafhankelijkheden. Frontend, inhoud en pure logica zijn gescheiden. AJV valideert tijdens de build alle actierecords tegen het aangeleverde schema. De bouw stopt bij ontbrekende bronreferenties, dubbele actie-ID's of ongeldige modulemanifesten. UI-waarden worden ge-escaped. Externe links hebben noreferrer/noopener. CSP sluit externe scripts, verbindingen en formulieren uit. Gebruik GitHub Pages uitsluitend voor openbaar gemaakte bibliotheekinhoud, niet voor vertrouwelijke afspraken.

De twee manifesten geven een bronbibliotheek en een bestaande externe toepassing weer. De oncologielink is uitsluitend een launcher, geen API- of inhoudskoppeling. Overige Inforium- en CHIP-modules zijn nog niet geïnventariseerd of gekoppeld.

## Uniform toekomstig broncontract

Elke toekomstige bronadapter moet onderstaande metadata leveren, zonder patiëntvelden:

| Veld | Betekenis |
|---|---|
| id, module_id, version | Stabiele identiteit en onveranderlijke versiereferentie |
| source_type | national / local / regional / transmural / patient / social |
| title, topic_ids, task_ids | Gecontroleerde bibliotheekmetadata |
| canonical_url, source_section | Exacte oorspronkelijke vindplaats |
| owner, organisation, region | Wie inhoudelijk verantwoordelijk is en welk bereik geldt |
| published_at | Datum publicatie, niet datum medische beoordeling |
| validity_assessed_at | Alleen indien expliciet door de bron genoemd |
| checked_at, checksum | Feitelijke controle en veranderingdetectie |
| valid_from, valid_until | Alleen wanneer de afspraak deze expliciet vastlegt |
| editorial_status, reviewed_by, reviewed_at | Aparte redactionele beoordeling |
| rights, reuse_scope | Vastgelegde hergebruiktoestemming |
| relations | related_to / supplements / differs_from / supersedes |
| supersedes_version | Voorgaande versie, behoud historie |

Dit uitgebreide contract is een ontwerp voor vervolgbouw, niet een reeds geïmplementeerde database. Het huidige actiecontract staat in schema/actie.schema.json; modulemanifestcontrole staat in src/core.js.

## Combineren zonder betekenisverlies

Het Chipboard toont losse bronkaarten naast elkaar. Het genereert geen samengestelde aanbeveling. Een relatie tussen een lokale afspraak en landelijke richtlijn moet een redacteur expliciet vastleggen. Regio, setting, doelgroep en status blijven zichtbaar per bron. Een conflict wordt als verschil gemarkeerd en aan de verantwoordelijke voorgelegd; geen automatische voorrang, gemiddelde of AI-oplossing.

Patiënteninformatie wordt pas echte inhoud nadat een specifieke bron en doelgroep zijn gecontroleerd. Hetzelfde geldt voor gemeentelijke voorzieningen, toegangsvoorwaarden en contactgegevens in het sociaal domein. De huidige demo's laten de plek in de interface zien zonder deze feiten te verzinnen.

## Bronupdates en publicatie

1. Adapter leest alleen toegestane bronmetadata of via licentie toegestane inhoud. HTTP-status en inhoudshash apart registreren.
2. Wijziging wordt conceptversie; de huidige vrijgegeven versie blijft beschikbaar met haar eigen controledatum.
3. Vergelijking toont wijzigingen en afhankelijke bronkaarten, afspraken en moduleverwijzingen.
4. Bevoegde redactie controleert inhoud, toepassingsgebied, relaties, bronrechten en actualiteitsmetadata. Identiteit, datum en besluit in auditlog vastleggen.
5. Technische validatie en tests slagen; dan gecontroleerde publicatie van een onveranderlijke catalogusversie.
6. Fout herstellen via vorige release of een revert-commit, met behoud van audittrail en zichtbare correctiestatus.

In v0.1 is stap 1 alleen als handmatige bereikbaarheidscontrole aanwezig; stappen 2–5 zijn een expliciete schermsimulatie. Git en de publicatieworkflow leveren versiebeheer en technische releases. Er zijn nog geen echte redactierechten, goedkeuringsworkflow, periodieke monitoring, inhoudsdiffs of herstelknoppen. Een productie-inrichting vereist rollen en verplichte reviews, gescheiden van de vrijblijvende demo.

## Andere modules en externe applicaties aansluiten

Begin met vaste launcherlinks zonder URL-parameters. Modulemanifesten accepteren alleen HTTPS-bestemmingen zonder query, fragment of credentials; patientData moet false zijn. Onbekende manifestvelden en niet-toegestane capabilities worden afgewezen. Geen generieke URL-invoer door eindgebruikers.

Volgende bouwstap: een versieerbare, alleen-lezen catalogus-API met bronrecords, onderwerp-taxonomie en redactionele relaties. Voeg adapters per bronhouder toe; geen algemene scraper zonder toestemming. Inforium Notes wordt dan een brongebonden professionele informatielaag. Widgets kunnen dezelfde catalogus gebruiken; externe apps krijgen alleen vaste module- of onderwerp-ID's na een expliciete beoordeling van privacy en doelbinding. Patiënt-, dossier- en consult-ID's blijven uitgesloten.

SSO, backend, API-uitwisseling, afgeschermde organisatie-inhoud en modulemarketplace zijn niet in dit prototype gebouwd. Een externe toepassing kan zelf patiëntgegevens verwerken; die werking wordt niet onderdeel van de claim over dit Chipboard.

## Juridische ontwerpgrens

Deze versie positioneert zich als bibliotheek- en navigatiefunctie. Geen patiëntdata verwerken en geen LLM gebruiken zijn op zichzelf geen garantie voor uitsluiting van de MDR. Beoogd gebruik en feitelijke functies, ook in combinatie, bepalen de kwalificatie. De ruime werkruimte zit in herleidbaar vinden, tonen, organiseren en openen van generieke bronnen. Patiëntspecifieke interpretatie, triage, risicoscores of behandelprioritering vereisen een nieuwe beoordeling. Een disclaimer kan medische functionaliteit niet ongedaan maken.

Voor pilotgebruik: leg intended purpose en gebruikersclaims vast, laat een gekwalificeerde MDR-deskundige de concrete functies en modulegrenzen beoordelen en controleer auteursrecht en bronlicenties. Geen juridisch oordeel of vrijstelling is met dit prototype gegeven. Grijze gebieden worden als te beoordelen wijziging geregistreerd, niet als stilzwijgende vrijbrief.

Bron: [MDCG 2019-11 rev.1, juni 2025](https://health.ec.europa.eu/document/download/b45335c5-1679-4c71-a91c-fc7a4d37f12b_en?filename=md_mdcg_2019_11_guidance_qualification_classification_software_en.pdf), in het bijzonder §3.1, §3.2 en §7; geraadpleegd 2026-10-04. Deze niet-bindende guidance vervangt geen beoordeling van dit product.

## Eerstvolgende pilot

Laat één regionale eigenaar één echte lokale afspraak, één transmurale afspraak, één gecontroleerde patiëntenbron en één sociale bron aanleveren. Leg eigenaarschap, rechten en revisie vast. Bouw daarna de echte redactieworkflow en een eerste bronadapter. Test met professionals vindbaarheid, tijd tot de juiste passage en begrijpelijkheid van bronverschillen. Er zijn nog geen gebruikersmetingen uitgevoerd.

## Herkomst

- Aangemaakt en laatst bijgewerkt: 2026-10-04.
- AI-omgeving: Codex; project: Inforium CHIP / Chipboard.
- Lokale Codex-projectmap: richtlijnen en lokale afspraken integratie.
- Sessie-ID: 01a105b5-7b3f-7b10-8500-2b07574e5156. Chatnaam niet afzonderlijk vastgesteld.
- Basis: Inforium_Richtlijnen_Codex_Overdracht.zip (versie 2026-10-04), inclusief bronregister, drie records, JSON-schema en acceptatiegevallen.
- Repositorybestemming: Mediwebs/inforium-advanced-richtlijnen.
- Status: werkdocument bij prototype v0.1; niet klinisch gevalideerd.

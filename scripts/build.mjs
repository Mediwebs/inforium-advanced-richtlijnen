import {validateOncology} from '../src/oncology.js';
import {mergeSourceImports} from '../src/extra-sources.js';
import {decodeJgzAdditions,JGZ_COLLECTIONS,validateJgzLibrary} from '../src/jgz.js';
import {decodeExtraSources} from '../src/extra-sources.js';
import {decodePatientSources} from '../src/patient-sources.js';
import {decodePrimaryGuidelines} from '../src/primary-guidelines.js';
import {decodePznl} from '../src/pznl.js';
import {decodeInforium} from '../src/integrated.js';
import {integratedShell} from './integrated-shell.mjs';
import {decodeGroningen} from '../src/groningen.js';
import fs from 'node:fs/promises';
import Ajv from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import {validateManifest} from '../src/core.js';
const read=async p=>JSON.parse(await fs.readFile(p,'utf8'));
const ajv=new Ajv({allErrors:true,allowUnionTypes:true});addFormats(ajv);
const validate=ajv.compile(await read('schema/actie.schema.json'));
const actions=await read('data/voorbeeldacties.json'),sources=await read('data/bronnen.json'),modules=await read('data/modules.json');
const catalog=await read('data/catalogus.json');
const validateCatalog=ajv.compile(await read('schema/catalogus.schema.json'));
if(!validateCatalog(catalog))throw new Error(JSON.stringify(validateCatalog.errors));
for(const key of ['id','url'])if(new Set(catalog.map(c=>c[key])).size!==catalog.length)throw new Error('Dubbele catalogusidentiteit');
if(catalog.some(c=>sources.some(s=>s.id===c.id)))throw new Error('Dubbel bron-ID');
const ids=new Set();
for(const a of actions){if(!validate(a))throw new Error(JSON.stringify(validate.errors));if(ids.has(a.id))throw new Error('Dubbel record');ids.add(a.id);if(!sources.some(s=>s.id===a.source_id))throw new Error('Bron ontbreekt');}
for(const s of sources){if(new URL(s.url).protocol!=='https:')throw new Error('Onveilige bronlink');}
modules.forEach(validateManifest);
console.log('NHG / NCJ:',decodePrimaryGuidelines(await read('data/primary-guidelines.json')).length,'bronverwijzingen');
console.log('Patiënteninformatie:',decodePatientSources(await read('data/patient-sources.json')).length,'kaarten');
console.log('Aanvullende bronnen:',decodeExtraSources(await read('data/extra-sources.json')).length,'kaarten');
const pznl=decodePznl(await read('data/pznl.json'));console.log('PZNL:',pznl.length,'metadatarecords');
console.log('Inforium:',decodeInforium(await read('data/inforium-examples.json')).length,'gemarkeerde ontwerpvoorbeelden');
const groningen=decodeGroningen(await read('data/groningen.json'));
if(groningen.length!==4627)throw new Error('Inventarisaantal wijkt af van geimporteerde versie');
console.log('Groningen:',groningen.length,'metadatarecords uit 2026-10-03');
await fs.mkdir('dist',{recursive:true});
for(const p of ['index.html','favicon.svg','src','data'])await fs.cp(p,'dist/'+p,{recursive:true});
const compact=(await fs.readFile('index.html','utf8'))
 .replace('<body>','<body data-view="compact">')
 .replace('</head>','<link rel="stylesheet" href="./src/compact.css"></head>')
 .replace('<title>CHIPboard · Inforium bronnenwerkplek</title>','<title>CHIPboard Compact · Inforium</title>')
 .replace('PROTOTYPE · V0.6','COMPACT · PARALLEL')
 .replace('<fieldset id="source-collections"></fieldset>','<details class="compact-sources"><summary id="compact-sources-label">Bronnen kiezen</summary><fieldset id="source-collections"></fieldset></details>')
 .replace('Bronnavigatie · zonder patiëntinvoer','Compact · geen patiëntgegevens')
 .replace('class="compact-version-link" href="./compact.html#zoeken">Compacte versie','class="compact-version-link" href="./index.html#zoeken">Uitgebreide versie');
await fs.writeFile('dist/compact.html',compact);
await fs.writeFile('dist/integrated.html',integratedShell(compact));
const jgzPatients=decodePatientSources(await read('data/patient-sources.json')).filter(r=>['groeigids','thuisarts','voedingscentrum'].includes(r.collection));
const jgzNational=[...catalog.map(c=>({...c,source:c,collection:'national',navigation:true,description:'Verwijzing naar de oorspronkelijke richtlijn.',layer:'national',demo:false,owner:'Richtlijnendatabase'})),...actions.map(a=>({id:a.id,title:a.title,collection:'national',layer:'national',demo:false,source:sources.find(s=>s.id===a.source_id),record:a,owner:'Richtlijnendatabase',topics:[],specialties:['kno'],tasks:[a.action],version:'Overdracht 04-10-2026',description:'Bronverwijzing uit de bestaande catalogus.'}))];
const jgzRows=validateJgzLibrary([...jgzNational,...decodePrimaryGuidelines(await read('data/primary-guidelines.json')),...jgzPatients,...decodeJgzAdditions(await read('data/jgz-additions.json'))]);
await fs.writeFile('dist/data/jgz-library.json',JSON.stringify(jgzRows));
const jgz=integratedShell(compact).replace('data-experience="inforium"','data-experience="inforium" data-edition="jgz"').replace('<title>Inforium Advanced × CHIPboard · Werkplek</title>','<title>Inforium CHIPboard · Jeugdgezondheidszorg</title>').replace('ADVANCED × CHIPBOARD','JEUGDGEZONDHEIDSZORG').replace('Inforium werkplek','Inforium JGZ').replace('Voor zorgprofessionals','Voor de jeugdgezondheidszorg').replace('GEÏNTEGREERD PROTOTYPE','JGZ · EIGEN WERKPLEK').replace('href="#modules" data-nav="modules"','href="#bronnen" data-nav="bronnen"').replace('Modules & bronnen','Bronnenoverzicht').replace('Zoek richtlijnen, patiënteninformatie of nieuws','Zoek richtlijnen, informatie voor ouders of jongeren');
await fs.writeFile('dist/jgz.html',jgz.replace('<a href="#board"', '<a href="#favorieten" data-nav="favorieten">☆ Mijn Favorieten</a><a href="#board"')); 
console.log('JGZ:',jgzRows.length,'bronkaarten in',Object.keys(JGZ_COLLECTIONS).length,'collecties');
console.log('Build OK:',sources.length,'bronnen;',actions.length,'records;',new Set(actions.map(a=>a.source_id)).size,'oorspronkelijke modules;',catalog.length,'aanvullende bronkaarten.');

const umcg=await read('data/umcg.json');
if(umcg.records.length!==umcg.rows||umcg.records.some(r=>!r.title||new URL(r.url).hostname!=='www.umcg.nl'||new URL(r.url).protocol!=='https:'||r.audience!=='patient'))throw Error('UMCG import ongeldig');
const oncoPatients=mergeSourceImports(decodePatientSources(await read('data/patient-sources.json')),decodeExtraSources(await read('data/extra-sources.json'))).filter(r=>['kankernl','thuisarts'].includes(r.collection));
const oncoRows=validateOncology([...jgzNational,...decodePrimaryGuidelines(await read('data/primary-guidelines.json')).filter(r=>r.collection==='nhg'),...groningen.map(r=>({...r,collection:'groningen'})),...(await read('data/groningen-sections.json')),...pznl,...oncoPatients,...umcg.records,...(await read('data/radiotherapy-groningen.json')).records]);
await fs.writeFile('dist/data/oncology-library.json',JSON.stringify(oncoRows));
const onco=jgz.replace('data-edition="jgz"','data-edition="oncology"').replaceAll('Jeugdgezondheidszorg','Medische Oncologie Groningen').replaceAll('JEUGDGEZONDHEIDSZORG','ONCOLOGIE GRONINGEN').replaceAll('Inforium JGZ','Inforium Oncologie').replaceAll('Voor de jeugdgezondheidszorg','Voor oncologie en palliatieve zorg').replaceAll('JGZ · EIGEN WERKPLEK','ONCOLOGIE · EIGEN WERKPLEK').replaceAll('Zoek richtlijnen, informatie voor ouders of jongeren','Zoek oncologie, palliatie en patiënteninformatie').replace('<a href="#board"','<a href="#favorieten" data-nav="favorieten">☆ Mijn Favorieten</a><a href="#board"');
await fs.writeFile('dist/oncologie.html',onco);console.log('Oncologie:',oncoRows.length,'bronkaarten');

const chatShell=(await fs.readFile('dist/jgz.html','utf8')).replace('data-edition="jgz"','data-edition="jgz" data-chat="true"').replace('<title>Inforium CHIPboard · Jeugdgezondheidszorg</title>','<title>Inforium JGZ · Chatprototype</title>').replace('Inforium JGZ','Inforium JGZ · Chat').replace('JGZ · EIGEN WERKPLEK','JGZ · CHATFORK').replace('</head>','<link rel="stylesheet" href="./src/jgz-chat.css"></head>');
await fs.writeFile('dist/jgz-chat.html',chatShell);

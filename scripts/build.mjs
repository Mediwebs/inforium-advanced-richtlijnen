import {decodePznl} from '../src/pznl.js';
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
const pznl=decodePznl(await read('data/pznl.json'));console.log('PZNL:',pznl.length,'metadatarecords');
const groningen=decodeGroningen(await read('data/groningen.json'));
if(groningen.length!==4627)throw new Error('Inventarisaantal wijkt af van geimporteerde versie');
console.log('Groningen:',groningen.length,'metadatarecords uit 2026-10-03');
await fs.mkdir('dist',{recursive:true});
for(const p of ['index.html','favicon.svg','src','data'])await fs.cp(p,'dist/'+p,{recursive:true});
console.log('Build OK:',sources.length,'bronnen;',actions.length,'records;',new Set(actions.map(a=>a.source_id)).size,'oorspronkelijke modules;',catalog.length,'aanvullende bronkaarten.');

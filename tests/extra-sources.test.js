import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {decodeExtraSources,mergeSourceImports} from '../src/extra-sources.js';
import {decodePatientSources} from '../src/patient-sources.js';
import {buildSearchIndex,searchResources} from '../src/search.js';
import {patientActions} from '../src/patient-sharing.js';
import {packagePreview} from '../src/integrated.js';
const payload=JSON.parse(fs.readFileSync('data/extra-sources.json'));
const extra=decodeExtraSources(payload);
const base=decodePatientSources(JSON.parse(fs.readFileSync('data/patient-sources.json')));
test('seven additional CSV files reconcile, preserving languages and title correction',()=>{
 assert.equal(extra.length,2922);assert.equal(extra.reduce((n,r)=>n+r.variants.length,0),2923);
 assert.equal(extra.filter(r=>r.collection==='aumc').length,2659);
 assert.equal(extra.filter(r=>r.collection==='nvog').length,134);
 assert.ok(extra.some(r=>r.title==='Gevolgen van bestraling'&&r.title_correction));
 const arabic=searchResources(buildSearchIndex(extra),'Arabisch',{collections:['nvog']}).results;
 assert.ok(arabic.length>0&&arabic.every(h=>h.record.languages.includes('ar')));
});
test('overlap with Kanker.nl merges only matching publisher and URL while retaining every variant',()=>{
 const merged=mergeSourceImports(base,extra);assert.equal(merged.length,7283);
 assert.equal(merged.filter(r=>r.collection==='kankernl').length,378);
 assert.equal(merged.reduce((n,r)=>n+r.variants.length,0),4654+2923);
 assert.ok(base.every(r=>merged.some(m=>m.id===r.id)));
});
test('all 33 transmurale agreements remain professional and excluded from sharing',()=>{
 const agreements=extra.filter(r=>r.collection==='transmuraal-amsterdam');assert.equal(agreements.length,33);
 assert.ok(agreements.every(r=>r.contentType==='knowledge'&&r.audience==='professional'&&!patientActions(r)));
 assert.ok(!packagePreview(agreements,new Set(agreements.map(r=>r.id))).includes('class="ia-package"'));
 const invalid=structuredClone(payload);invalid.records.find(r=>r.collection==='transmuraal-amsterdam').audience='patient';assert.throws(()=>decodeExtraSources(invalid));
});

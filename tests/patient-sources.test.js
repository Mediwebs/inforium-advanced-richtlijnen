import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {decodePatientSources} from '../src/patient-sources.js';
import {buildSearchIndex,searchResources} from '../src/search.js';
import {packagePreview} from '../src/integrated.js';
const payload=JSON.parse(fs.readFileSync('data/patient-sources.json','utf8'));
test('patient import reconciles all 4654 CSV rows and preserves provenance',()=>{
 const rows=decodePatientSources(payload);
 assert.equal(rows.length,4363);
 assert.equal(rows.reduce((n,r)=>n+r.variants.length,0),4654);
 assert.equal(rows.filter(r=>r.link_review).length,44);
 assert.ok(rows.every(r=>r.contentType==='patient'&&r.audience==='patient'&&r.checked_at===null));
 assert.ok(rows.find(r=>r.id==='patient-kno-patient-620878').keywords.includes('allergieën'));
 assert.ok(rows.find(r=>r.id==='patient-voedingscentrum-622114').url.includes("baby's.pdf"));
});
test('patient search includes supplied titles and keywords, scoped to selected sources',()=>{
 const rows=decodePatientSources(payload),index=buildSearchIndex(rows);
 const hits=searchResources(index,'allergie',{collections:['kno-patient']}).results;
 assert.ok(hits.some(h=>h.record.title==='Allergie'));
 assert.ok(hits.every(h=>h.record.collection==='kno-patient'));
 const variant=rows.find(r=>r.variants.some(v=>v.title!==r.title));
 assert.ok(searchResources(index,variant.variants.find(v=>v.title!==variant.title).title).results.some(h=>h.record.id===variant.id));
});
test('unusable patient links stay out of packages; foreign links and invented verification are rejected',()=>{
 const rows=decodePatientSources(payload),good=rows.find(r=>r.url),bad=rows.find(r=>r.link_review);
 const html=packagePreview([good,bad],new Set([good.id,bad.id]));
 assert.equal((html.match(/<li>/g)||[]).length,1);
 for(const patch of [{url:'https://example.com/'},{checked_at:'2026-10-05'}]){
 const copy=structuredClone(payload);Object.assign(copy.records.find(r=>r.url),patch);assert.throws(()=>decodePatientSources(copy));
 }
});

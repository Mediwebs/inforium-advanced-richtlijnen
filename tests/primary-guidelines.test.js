import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {decodePrimaryGuidelines} from '../src/primary-guidelines.js';
import {buildSearchIndex,searchResources} from '../src/search.js';
import {refineResults} from '../src/refine.js';
import {packagePreview} from '../src/integrated.js';
const raw=JSON.parse(fs.readFileSync('data/primary-guidelines.json','utf8'));
test('NHG and NCJ snapshot preserves types and unassessed clinical dates',()=>{
 const rows=decodePrimaryGuidelines(raw);
 assert.equal(rows.filter(r=>r.collection==='nhg').length,200);
 assert.equal(rows.filter(r=>r.collection==='ncj').length,37);
 assert.equal(rows.filter(r=>r.kind==='NHG-Standaard').length,94);
 assert.equal(rows.filter(r=>r.kind==='NHG-Behandelrichtlijn').length,45);
 assert.ok(rows.every(r=>r.audience==='professional'&&r.contentType==='knowledge'&&r.validity_assessed_at===null));
 assert.ok(!packagePreview(rows,new Set(rows.map(r=>r.id))).includes('class="ia-package"'));
});
test('NHG and NCJ source selection, matching and type refinement combine',()=>{
 const index=buildSearchIndex(decodePrimaryGuidelines(raw));
 const all=searchResources(index,'astma',{collections:['nhg','ncj']}).results;
 assert.ok(all.some(h=>h.record.collection==='ncj'));
 assert.ok(all.some(h=>h.record.collection==='nhg'));
 const only=searchResources(index,'astma',{collections:['ncj']}).results;
 assert.equal(only.length,1);assert.equal(only[0].record.title,'JGZ-richtlijn Astma');
 assert.ok(only[0].matches.some(m=>m.field==='Titel'||m.label==='Titel'));
 const standard=refineResults(index,all,{kind:'NHG-Standaard'}).results;
 assert.ok(standard.length>0&&standard.every(h=>h.record.kind==='NHG-Standaard'));
});
test('primary sources reject external URLs, wrong kinds, duplicates and invented validity',()=>{
 for(const patch of [{url:'https://example.com/richtlijn/astma'},{kind:'Patiëntenfolder'},{validity_assessed_at:'2026-10-05'},{provenance_url:'https://example.com/'}])assert.throws(()=>decodePrimaryGuidelines([{...raw[0],...patch}]));
 assert.throws(()=>decodePrimaryGuidelines([raw[0],raw[0]]));
});

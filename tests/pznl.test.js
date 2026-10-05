import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {decodePznl} from '../src/pznl.js';
import {buildSearchIndex,searchResources,collectionOf} from '../src/search.js';
const raw=JSON.parse(fs.readFileSync(new URL('../data/pznl.json',import.meta.url)));
const rows=decodePznl(raw);
test('PZNL inventory preserves original overview dates without promoting validity',()=>{
 assert.equal(rows.length,61);assert.equal(rows.filter(r=>r.collection==='palliaweb').length,56);
 assert.equal(rows.filter(r=>r.collection==='pznl-patient').length,5);
 assert.equal(rows.filter(r=>r.index_updated_at).length,54);
 assert.ok(rows.every(r=>r.published_at===null&&r.validity_assessed_at===null));
 assert.ok(rows.some(r=>r.title==='Palliatieve zorg bij hartfalen'));
});
test('multiple collections use union; deselecting all gives no results',()=>{
 const index=buildSearchIndex([...rows,{id:'a',title:'Palliatieve zorg',groningen:true},{id:'b',title:'Palliatieve zorg'}]);
 const result=c=>searchResources(index,'palliatieve zorg',{collections:c}).results;
 assert.equal(result([]).length,0);assert.equal(result(['palliaweb']).length,56);
 assert.equal(result(['palliaweb','pznl-patient']).length,61);
 assert.equal(result(['national','groningen']).length,2);
 assert.ok(result(['pznl-patient']).every(x=>collectionOf(x.record)==='pznl-patient'));
});
test('PZNL duplicates, unsafe links and invented validity rejected',()=>{
 for(const change of [{url:'javascript:alert(1)'},{url:'https://evil.example/test'},{provenance_url:'javascript:alert(1)'},{validity_assessed_at:'2026-10-05'}])assert.throws(()=>decodePznl([{...raw[0],...change}]));
 assert.throws(()=>decodePznl([raw[0],raw[0]]));
});
test('symptom query finds the guideline with explained title match',()=>{
 const hits=searchResources(buildSearchIndex(rows),'palliatieve sedatie',{collections:['palliaweb']}).results;
 assert.equal(hits[0].record.title,'Palliatieve sedatie');assert.equal(hits[0].matched,2);
 assert.ok(hits[0].matches.every(m=>m.field==='Titel'));
});
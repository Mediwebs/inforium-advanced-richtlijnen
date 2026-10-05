import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import {decodeInforium,packagePreview} from '../src/integrated.js';import {buildSearchIndex,searchResources,SOURCE_COLLECTIONS} from '../src/search.js';
const payload=JSON.parse(fs.readFileSync(new URL('../data/inforium-examples.json',import.meta.url))),records=decodeInforium(payload);
test('Inforium imported examples preserve provenance and stay nonclinical demos',()=>{
 assert.equal(records.length,15);assert.equal(records.filter(r=>r.contentType==='patient').length,12);
 assert.ok(records.every(r=>r.demo&&!r.url&&r.provenance===payload.source));
 assert.throws(()=>decodeInforium({...payload,records:payload.records.map((r,i)=>i? r:{...r,url:'https://example.org/'})}));
});
test('examples only searchable with explicit adapter inclusion',()=>{
 assert.equal(buildSearchIndex(records).length,0);SOURCE_COLLECTIONS.inforium='Inforium Advanced · voorbeelden';
 const index=buildSearchIndex(records,{}, {includeDemos:true});
 const result=searchResources(index,'borstvoeding',{collections:['inforium']}).results;
 assert.equal(result.length,1);assert.equal(result[0].record.demo,true);
 assert.equal(searchResources(index,'borstvoeding',{collections:['national']}).results.length,0);
});
test('package preview excludes examples, professional knowledge and news',()=>{
 const real={id:'real',title:'Patiëntenbron',audience:'patient',url:'https://example.org/patient',owner:'Bron'};
 const professional={id:'pro',title:'Richtlijn',audience:'professional',url:'https://example.org/pro'};
 const html=packagePreview([...records,real,professional],new Set([records[0].id,'real','pro']));
 assert.ok(html.includes('https://example.org/patient'));assert.ok(!html.includes('https://example.org/pro'));assert.ok(html.includes('2 andere kaart'));assert.ok(html.includes('niets verzonden'));
});
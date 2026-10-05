import test from 'node:test';import assert from 'node:assert/strict';import {buildSearchIndex,searchResources} from '../src/search.js';import {refineResults} from '../src/refine.js';
const records=[{id:'a',title:'Pijn zorg',groningen:true,kind:'patient',audience:'patient',locked:true,specialties:['oncologie']},{id:'b',title:'Zorg pijn naasten',pznl:true,collection:'pznl-patient',kind:'Patiënteninformatie',audience:'patient',specialties:[]},{id:'c',title:'Algemene zorg',navigation:true,source_kind:'overview',specialties:['kno']}];
const index=buildSearchIndex(records),hits=searchResources(index,'zorg').results;
test('additional terms narrow by intersection and require every additional term',()=>{
 assert.deepEqual(refineResults(index,hits,{extra:'pijn naasten'}).results.map(h=>h.record.id),['b']);
 assert.equal(refineResults(index,searchResources(index,'algemene').results,{extra:'pijn'}).results.length,0);
 assert.equal(refineResults(index,hits,{extra:'de het'}).results.length,0);
 assert.ok(refineResults(index,hits,{extra:'de het'}).error);
 assert.ok(refineResults(index,hits,{extra:'a'.repeat(201)}).error);
});
test('combined facets preserve unknown metadata semantics',()=>{
 assert.deepEqual(refineResults(index,hits,{audience:'patient',access:'locked',specialty:'oncologie'}).results.map(h=>h.record.id),['a']);
 assert.deepEqual(refineResults(index,hits,{specialty:'unknown'}).results.map(h=>h.record.id),['b']);
 assert.equal(refineResults(index,hits,{kind:'Richtlijnoverzicht'}).results[0].record.id,'c');
 assert.equal(refineResults(index,hits,{access:'unflagged'}).results.length,0);
});
test('sort alphabet and source are independent of relevance; usage uses actual counts',()=>{
 assert.deepEqual(refineResults(index,hits,{sort:'alphabet'}).results.map(h=>h.record.id),['c','a','b']);
 assert.deepEqual(refineResults(index,hits,{sort:'source'}).results.map(h=>h.record.id),['a','b','c']);
 assert.equal(refineResults(index,hits,{sort:'used'},new Map([['b',3]])).results[0].record.id,'b');
 assert.equal(refineResults(index,hits,{sort:'used'}).results.every(h=>h.uses===0),true);
 assert.deepEqual(refineResults(index,hits,{}).results.map(h=>h.record.id),hits.map(h=>h.record.id));
});
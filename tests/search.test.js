import test from 'node:test';
import assert from 'node:assert/strict';
import {buildSearchIndex,searchResources,parseQuery} from '../src/search.js';
const run=(rows,q,o)=>searchResources(buildSearchIndex(rows),q,o).results;
test('coverage outranks strong single-term title',()=>{
 const r=run([{id:'a',title:'alpha',topics:[]},{id:'b',title:'Other',topics:['alpha','beta']}],'alpha beta');
 assert.equal(r[0].record.id,'b');assert.equal(r[0].matched,2);assert.deepEqual(r[1].missing,['beta']);
});
test('title phrase outranks context, deterministic tie',()=>{
 const rows=[{id:'z',title:'Other',topics:['alpha beta']},{id:'b',title:'Alpha beta'},{id:'a',title:'Alpha beta'}];
 assert.deepEqual(run(rows,'alpha beta').map(x=>x.record.id),['a','b','z']);
});
test('alias and prefix are explained; short codes do not prefix match',()=>{
 const rows=[{id:'a',title:'Mammacarcinoom bestraling'},{id:'b',title:'Radiotherapie'}];
 const hit=run(rows,'borstkanker bestraling')[0];
 assert.equal(hit.matched,2);assert.equal(hit.matches[0].mode,'alias');
 assert.equal(run(rows,'radioth')[0].matches[0].mode,'prefix');
 assert.equal(run(rows,'ra').length,0);
});
test('diacritics, duplicate terms and stopwords',()=>{
 assert.deepEqual(parseQuery('de patiënt patiënt').terms,['patient']);
 assert.equal(run([{id:'a',title:'Patiënt'}],'patient')[0].matched,1);
 assert.deepEqual(parseQuery('de het en').terms,[]);
 assert.ok(parseQuery('a '.repeat(101)).error);
 assert.ok(parseQuery('a b c d e f g h j k l m n').error);
});
test('scope, complete-only, demo exclusion',()=>{
 const rows=[{id:'a',title:'alpha beta'},{id:'b',title:'alpha',groningen:true},{id:'c',title:'alpha beta',demo:true}];
 assert.equal(run(rows,'alpha beta').length,2);
 assert.equal(run(rows,'alpha beta',{completeOnly:true}).length,1);
 assert.equal(run(rows,'alpha',{provider:'groningen'})[0].record.id,'b');
 assert.equal(run(rows,'alpha',{provider:'national'}).length,1);
});
test('related matches carry their source field',()=>{
 const r=run([{id:'a',title:'First',related:['b']},{id:'b',title:'Target'}],'target');
 assert.equal(r[0].record.id,'b');assert.equal(r[1].matches[0].field,'Titel van gekoppelde bron');
});

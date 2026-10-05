import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {decodeJgzAdditions,validateJgzLibrary,JGZ_COLLECTIONS} from '../src/jgz.js';
import {buildSearchIndex,searchResources} from '../src/search.js';
import {patientActions} from '../src/patient-sharing.js';
const raw=JSON.parse(fs.readFileSync('data/jgz-additions.json'));
test('JGZ additions preserve all rows, link status and Pharos keyword exclusion',()=>{
 const rows=decodeJgzAdditions(raw);assert.equal(rows.length,793);
 assert.equal(rows.filter(r=>r.collection==='pharos').length,279);
 assert.equal(rows.filter(r=>r.collection==='rivm').length,330);
 assert.equal(rows.filter(r=>r.collection==='kinderveiligheid').length,184);
 assert.equal(rows.filter(r=>r.link_checked_at).length,106);
 assert.equal(rows.filter(r=>r.link_review).length,7);
 assert.ok(rows.filter(r=>r.link_review).every(r=>!patientActions(r)));
 assert.ok(rows.filter(r=>r.collection==='pharos').every(r=>r.keywords.length===0));
 assert.ok(searchResources(buildSearchIndex(rows),'diabetes',{collections:['pharos']}).results.length>0);
});
test('standalone JGZ scope rejects other collections and demonstrations',()=>{
 const rows=decodeJgzAdditions(raw);assert.equal(Object.keys(JGZ_COLLECTIONS).length,9);assert.equal(validateJgzLibrary(rows).length,793);
 assert.throws(()=>validateJgzLibrary([{...rows[0],collection:'groningen'}]));
 assert.throws(()=>validateJgzLibrary([{...rows[0],demo:true}]));
 assert.throws(()=>validateJgzLibrary([rows[0],rows[0]]));
});

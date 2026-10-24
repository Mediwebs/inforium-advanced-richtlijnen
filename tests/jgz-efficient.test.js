import {test} from 'node:test';
import assert from 'node:assert/strict';
import {demoResources,shareable,packageText,readWorkspace} from '../src/jgz-efficient-workspace.js';
import {buildSearchIndex,searchResources} from '../src/search.js';
test('Consult package includes fictional parent information and excludes internal protocols and broken links',()=>{
 const broken={id:'broken',audience:'patient',title:'Broken',url:'https://example.org',link_review:'check'};
 const real={id:'real',audience:'patient',title:'Existing source',url:'https://example.org/source'};
 const text=packageText([...demoResources,broken,real]);
 assert.match(text,/FICTIEF VOORBEELD/);assert.match(text,/Existing source/);
 assert.ok(!text.includes('FICTIEF WERKPROCES'));assert.ok(!text.includes('Broken'));
 assert.equal(demoResources.filter(shareable).length,3);
 assert.equal(packageText(demoResources.filter(r=>r.audience==='professional')),'');
});
test('Local examples remain explicit and searchable only when demos are enabled',()=>{
 assert.ok(demoResources.every(r=>r.demo&&r.url===null&&r.validity_assessed_at===null));
 assert.equal(searchResources(buildSearchIndex(demoResources),'protocol').results.length,0);
 const matches=searchResources(buildSearchIndex(demoResources,{}, {includeDemos:true}),'protocol',{collections:['local-jgz']}).results;
 assert.equal(matches.length,3);assert.ok(matches.every(x=>x.record.audience==='professional'));
});
test('Saved favorites and collections survive valid restore and discard stale source IDs',()=>{
 const ids=new Set(['one','two']);
 const result=readWorkspace(JSON.stringify({favorites:['one','stale'],groups:[{id:'g',name:'Consult',ids:['two','stale']},{id:'bad',name:3}]}),ids);
 assert.deepEqual(result,{favorites:['one'],groups:[{id:'g',name:'Consult',ids:['two']}]});
 assert.deepEqual(readWorkspace('broken',ids),{favorites:[],groups:[]});
});

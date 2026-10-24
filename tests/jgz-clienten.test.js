import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {clientResources} from '../src/jgz-clienten.js';
import {demoResources,readWorkspace} from '../src/jgz-efficient-workspace.js';
import {clientShell} from '../scripts/jgz-clienten-shell.mjs';
test('Client edition excludes professional and unknown records, including local protocols',()=>{
 const rows=clientResources([...demoResources,{id:'unknown'},{id:'patient',audience:'patient'},{id:'professional',audience:'professional'}]);
 assert.equal(rows.length,4);assert.ok(rows.every(r=>r.audience==='patient'));
 assert.ok(rows.every(r=>!r.id.includes('protocol')));
 const saved=readWorkspace(JSON.stringify({favorites:['demo-duindreef-protocol-delen','patient'],groups:[{id:'g',name:'Group',ids:['professional','patient']}]}),new Set(rows.map(r=>r.id)));
 assert.deepEqual(saved.favorites,['patient']);assert.deepEqual(saved.groups[0].ids,['patient']);
});
test('Separate shell identifies client edition and links only its dedicated catalogue',()=>{
 const html=clientShell(fs.readFileSync('jgz-efficient.html','utf8'));
 assert.match(html,/data-edition="clienten"/);
 assert.match(html,/jgz-clienten-library.json/);
 assert.ok(!html.includes('./data/jgz-library.json'));
 assert.match(html,/<div hidden id="audiences"/);
 assert.ok(!html.includes('<h3>Intern voor de professional</h3>'));
});

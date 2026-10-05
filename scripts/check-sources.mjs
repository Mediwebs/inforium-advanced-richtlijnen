import fs from 'node:fs/promises';
const sources=[...JSON.parse(await fs.readFile('data/pznl.json','utf8')),...JSON.parse(await fs.readFile('data/bronnen.json','utf8')),...JSON.parse(await fs.readFile('data/catalogus.json','utf8'))];
const report=[];
for(const source of sources){try{const r=await fetch(source.url,{method:'GET',signal:AbortSignal.timeout(15000)});await r.body?.cancel();report.push({id:source.id,checked_at:new Date().toISOString(),http_status:r.status,reachable:r.ok,clinical_status:'not_assessed'});}catch(e){report.push({id:source.id,reachable:false,error:e.name,clinical_status:'unknown'});}}
await fs.writeFile('source-check.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
if(report.some(r=>!r.reachable))process.exitCode=1;

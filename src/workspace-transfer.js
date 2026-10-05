export function exportWorkspace(edition,favorites,workmap){return {format:'inforium-chipboard',version:1,edition,exportedAt:new Date().toISOString(),favorites:{cards:[...favorites.cards],packages:favorites.packages.map(p=>({id:p.id,name:p.name||'Werkpakket',cards:[...p.cards]}))},workmap:[...workmap]};}
export function readWorkspace(text,known){
 if(text.length>2000000)throw Error('Bestand te groot (maximaal 2 MB).');
 let p;try{p=JSON.parse(text);}catch{throw Error('Dit is geen geldig JSON-bestand.');}
 const ids=v=>Array.isArray(v)&&v.length<=10000&&v.every(x=>typeof x==='string'&&x.length>0&&x.length<=200);
 if(!p||p.format!=='inforium-chipboard'||p.version!==1||!['jgz','oncology'].includes(p.edition)||!p.favorites||!ids(p.favorites.cards)||!ids(p.workmap)||!Array.isArray(p.favorites.packages)||p.favorites.packages.length>500||!p.favorites.packages.every(x=>x&&typeof x.id==='string'&&x.id.length<=200&&typeof x.name==='string'&&x.name.length<=80&&ids(x.cards)))throw Error('Onbekend of ongeldig CHIPboard-bestand.');
 const missing=new Set(),clean=v=>[...new Set(v)].filter(id=>{if(known.has(id))return true;missing.add(id);return false;});
 const cards=clean(p.favorites.cards),workmap=clean(p.workmap);let skipped=0;
 const packages=p.favorites.packages.map(x=>({id:x.id,name:x.name,cards:clean(x.cards)})).filter(x=>{if(x.cards.length)return true;skipped++;return false;});
 return {edition:p.edition,favorites:{cards,packages},workmap,missing:[...missing],skipped};
}
export function combineWorkspace(current,incoming,mode){
 if(!['add','replace'].includes(mode))throw Error('Kies toevoegen of vervangen.');
 const prior=mode==='replace'?{favorites:{cards:[],packages:[]},workmap:[]}:current;
 const packages=prior.favorites.packages.map(p=>({...p,cards:[...p.cards]}));
 const signature=p=>JSON.stringify([p.name||'Werkpakket',[...new Set(p.cards)].sort()]);
 for(const p of incoming.favorites.packages){if(packages.some(x=>signature(x)===signature(p)))continue;packages.push({...p,id:crypto.randomUUID()});}
 return {favorites:{cards:[...new Set([...prior.favorites.cards,...incoming.favorites.cards])],packages},workmap:[...new Set([...prior.workmap,...incoming.workmap])]};
}

// Deterministic bibliographic search. Scores express text overlap only.
export const SEARCH_ALIASES = {
 borstkanker:['mamma','mammacarcinoom'],
 mammacarcinoom:['borstkanker','mamma'],
 radiotherapie:['bestraling'],
 bestraling:['radiotherapie'],
 chemotherapie:['chemo'],
 chemo:['chemotherapie']
};
const stopwords=new Set(['de','het','een','en','of','van','voor','bij','met','in','op','over','ik','zoek','naar']);
export const normalize=s=>String(s??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('nl').replace(/[^\p{L}\p{N}]+/gu,' ').trim().replace(/\s+/g,' ');
export function parseQuery(query){
 if(query.length>200)return {terms:[],error:'Gebruik maximaal 200 tekens.'};
 const terms=[...new Set(normalize(query).split(' ').filter(t=>t&&!stopwords.has(t)))];
 if(terms.length>12)return {terms:[],error:'Gebruik maximaal 12 verschillende trefwoorden.'};
 return {terms,error:''};
}
export function buildSearchIndex(resources,labels={}){
 const byId=new Map(resources.map(r=>[r.id,r]));
 return resources.filter(r=>!r.demo).map(record=>{
  const fields=[];
  const add=(label,text,weight)=>{if(text){const value=String(text);fields.push({label,text:value,normalized:normalize(value),words:normalize(value).split(' '),weight});}};
  add('Titel',record.title,12);add('Broncode',record.code,15);
  if(record.source?.title!==record.title)add('Oorspronkelijke brontitel',record.source?.title,8);
  (record.topics||[]).forEach(x=>add('Onderwerp',labels.topics?.[x]||x,7));
  (record.specialties||[]).forEach(x=>add('Vakgebied',labels.specialties?.[x]||x,3));
  (record.tasks||[]).forEach(x=>add('Taak',labels.tasks?.[x]||x,5));
  add('Soort informatie',labels.kinds?.[record.kind]||record.kind,5);
  add('Doelgroep',{patient:'Patiënteninformatie patiënt',professional:'Zorgprofessional',unknown:''}[record.audience],4);
  (record.record?.symptoms||[]).forEach(x=>add('Klachttrefwoord in bronrecord',x,7));
  (record.record?.synonyms||[]).forEach(x=>add('Zoektrefwoord in bronrecord',x,7));
  (record.contexts||[]).forEach(c=>add('Broncontext (inventaris)',[c.group,c.pathology,c.phase].filter(Boolean).join(' · '),6));
  (record.themes||[]).forEach(x=>add('Voorgesteld thema (inventaris)',x,2));
  (record.related||[]).forEach(id=>add('Titel van gekoppelde bron',byId.get(id)?.title,2));
  return {record,fields};
 });
}
function termMatch(term,field){
 if(field.words.includes(term))return {strength:3,found:term,mode:'exact'};
 // Prefix matching only on substantive terms, not tiny codes such as RT.
 if(term.length>=4){const found=field.words.find(w=>w.startsWith(term));if(found)return {strength:2,found,mode:'prefix'};}
 for(const alias of SEARCH_ALIASES[term]||[]){
  const found=field.words.find(w=>w===alias||(alias.length>=4&&w.startsWith(alias)));
  if(found)return {strength:1,found,mode:'alias',alias};
 }
 return null;
}
function excerpt(field,found){
 const at=field.normalized.indexOf(found),start=Math.max(0,at-45);
 return (start?'…':'')+field.text.slice(start,start+150)+(field.text.length>start+150?'…':'');
}
export function searchResources(index,query,{provider='',completeOnly=false}={}){
 const parsed=parseQuery(query);if(parsed.error||!parsed.terms.length)return {...parsed,results:[]};
 const {terms}=parsed,phrase=terms.join(' '),results=[];
 for(const item of index){
  if(provider==='national'&&item.record.groningen||provider==='groningen'&&!item.record.groningen)continue;
  const matches=[];
  for(const term of terms){
   let best=null;
   for(const field of item.fields){
    const match=termMatch(term,field);if(!match)continue;
    const points=field.weight*match.strength;
    if(!best||points>best.points)best={term,points,field:field.label,snippet:excerpt(field,match.found),...match};
   }
   if(best)matches.push(best);
  }
  if(!matches.length||completeOnly&&matches.length!==terms.length)continue;
  const title=normalize(item.record.title);
  const phraseBonus=title===phrase?60:(' '+title+' ').includes(' '+phrase+' ')?30:0;
  results.push({record:item.record,matches,missing:terms.filter(t=>!matches.some(m=>m.term===t)),matched:matches.length,total:terms.length,score:matches.reduce((s,m)=>s+m.points,0)+phraseBonus,phraseBonus});
 }
 results.sort((a,b)=>b.matched-a.matched||b.score-a.score||a.record.title.localeCompare(b.record.title,'nl')||a.record.id.localeCompare(b.record.id));
 return {...parsed,results};
}

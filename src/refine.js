import {searchResources,collectionOf,SOURCE_COLLECTIONS} from './search.js';
import {groningenKinds} from './groningen.js';
export const kindOf=r=>r.inforium||r.pznl||r.primaryGuideline?r.kind:r.groningen?groningenKinds[r.kind]:r.navigation?(r.source_kind==='overview'?'Richtlijnoverzicht':'Richtlijnmodule'):'Bronpassage';
export const audienceOf=r=>r.audience||(r.groningen?'unknown':'professional');
export const accessOf=r=>r.groningen?(r.locked?'locked':'unflagged'):'unknown';
export function refineResults(index,hits,{extra='',kind='',audience='',specialty='',access='',sort='relevance'}={},usage=new Map()){
 let extraResult=null;
 if(extra.trim()){
  extraResult=searchResources(index,extra,{completeOnly:true});
  if(extraResult.error)return {results:[],error:extraResult.error};
  if(!extraResult.terms.length)return {results:[],error:'Vul ten minste één aanvullend trefwoord in, of maak het veld leeg.'};
 }
 const extraById=new Map((extraResult?.results||[]).map(h=>[h.record.id,h]));
 const results=hits.filter(h=>{
  const r=h.record;
  return (!extraResult||extraById.has(r.id))&&(!kind||kindOf(r)===kind)&&(!audience||audienceOf(r)===audience)&&(!specialty||(specialty==='unknown'?!(r.specialties||[]).length:r.specialties?.includes(specialty)))&&(!access||accessOf(r)===access);
 }).map(h=>({...h,refinementMatches:extraById.get(h.record.id)?.matches||[],uses:usage.get(h.record.id)||0}));
 const alpha=(a,b)=>a.record.title.localeCompare(b.record.title,'nl')||a.record.id.localeCompare(b.record.id);
 const relevance=(a,b)=>b.matched-a.matched||b.score-a.score||alpha(a,b);
 results.sort(sort==='alphabet'?alpha:sort==='source'?(a,b)=>SOURCE_COLLECTIONS[collectionOf(a.record)].localeCompare(SOURCE_COLLECTIONS[collectionOf(b.record)],'nl')||alpha(a,b):sort==='used'?(a,b)=>b.uses-a.uses||relevance(a,b):relevance);
 return {results,error:''};
}

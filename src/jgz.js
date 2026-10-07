import {icon} from './icons.js';
import {familyArt,newsArt} from './jgz-art.js';
import {integratedCard} from './integrated.js';
export const JGZ_COLLECTIONS={ncj:'NCJ · JGZ-richtlijnen',nhg:'NHG · Richtlijnen',national:'Richtlijnendatabase',groeigids:'GroeiGids',thuisarts:'Thuisarts.nl',voedingscentrum:'Voedingscentrum',rivm:'RIVM',kinderveiligheid:'Kinderveiligheid.nl',pharos:'Pharos'};
const collectionIcons={ncj:'knowledge',nhg:'knowledge',national:'layers',groeigids:'patient',thuisarts:'patient',voedingscentrum:'food',rivm:'health',kinderveiligheid:'shield',pharos:'communication'};
export const JGZ_KNOWLEDGE=['ncj','nhg','national'];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const hosts={rivm:['www.rivm.nl','rivm.nl','www.pns.nl','chemischestoffengoedgeregeld.nl','rijksvaccinatieprogramma.nl'],kinderveiligheid:['www.kinderveiligheid.nl','youtu.be'],pharos:['www.pharos.nl','youtu.be','www.youtube.com']};
export function decodeJgzAdditions(payload){
 const ids=new Set();
 const rows=payload.records.map(r=>{
  if(!hosts[r.collection]||ids.has(r.id)||!r.id.startsWith('patient-'+r.collection+'-')||!r.title||r.checked_at!==null||r.validity_assessed_at!==null)throw Error('Ongeldige JGZ-import');
  if(r.url){const u=new URL(r.url);if(u.protocol!=='https:'||!hosts[r.collection].includes(u.hostname)||u.username||u.password||r.link_review)throw Error('Onveilige JGZ-link');}else if(!r.link_review)throw Error('Linkstatus ontbreekt');
  if(r.collection==='pharos'&&r.keywords.length)throw Error('Niet-gecontroleerde Pharos-trefwoorden');
  ids.add(r.id);return {...r,patientImport:true,demo:false,contentType:'patient',audience:'patient',kind:'Patiënteninformatie',layer:'patient',owner:JGZ_COLLECTIONS[r.collection],specialties:[],topics:[],tasks:[],version:'Export '+r.export_date,description:'Bronverwijzing uit de aangeleverde export. Geen inhoudelijke actualiteitsbeoordeling.'};
 });
 for(const s of payload.sources)if(rows.filter(r=>r.collection===s.collection).reduce((n,r)=>n+r.variants.length,0)!==s.rows)throw Error('JGZ-importtelling wijkt af');
 return rows;
}
export function validateJgzLibrary(rows){
 if(!Array.isArray(rows)||!rows.length||rows.some(r=>r.demo||!Object.hasOwn(JGZ_COLLECTIONS,r.collection)))throw Error('Bron buiten JGZ-selectie');
 if(new Set(rows.map(r=>r.id)).size!==rows.length)throw Error('Dubbel JGZ-bron-ID');
 return rows;
}
export function jgzHome(rows,selected){
 const count=rows.filter(r=>r.audience==='patient').length;
 return '<div class="ia-welcome"><div><p class="ia-eyebrow">INFORIUM × CHIPBOARD · JGZ</p><h1>Alles bij de hand voor de jeugdgezondheidszorg</h1><p>Richtlijnen voor jou. Informatie om met ouders en jongeren te delen.</p></div><div class="jgz-family-art">'+familyArt+'</div></div><div class="ia-shortcuts jgz-shortcuts"><a href="#zoeken"><span class="jgz-source-icon">'+icon('search')+'</span>Alle informatie<small>'+rows.length.toLocaleString('nl-NL')+' bronkaarten</small></a><a href="#patienten"><span class="jgz-source-icon">'+icon('patient')+'</span>Ouders & jongeren<small>'+count.toLocaleString('nl-NL')+' kaarten</small></a><a href="#board"><span class="jgz-source-icon">'+icon('bookmark')+'</span>Mijn consultmap<small>'+selected.size+' bewaard</small></a><a href="#bronnen"><span class="jgz-source-icon">'+icon('layers')+'</span>Bronnenoverzicht<small>9 geselecteerde collecties</small></a></div>'+[true,false].map(knowledge=>'<div class="ia-section-title"><h2>'+(knowledge?'Richtlijnen & kennis':'Patiënteninformatie')+'</h2></div><div class="ia-shortcuts">'+Object.entries(JGZ_COLLECTIONS).filter(([id])=>JGZ_KNOWLEDGE.includes(id)===knowledge).map(([id,label])=>'<button data-jgz-collection="'+id+'"><span class="jgz-source-icon jgz-icon-'+id+'">'+icon(collectionIcons[id])+'</span>'+esc(label)+' <small>'+rows.filter(r=>r.collection===id).length+' kaarten</small></button>').join('')+'</div>').join('')+'<div class="ia-section-title"><h2>'+icon('star')+'Uitgelicht</h2><span class="ia-caption">Selectie uit de NCJ-richtlijnen</span><a href="#bronnen">Herkomst en dekking</a></div><div class="compact-grid">'+rows.filter(r=>r.collection==='ncj').slice(0,4).map(r=>integratedCard(r,selected)).join('')+'</div>'+jgzNews();
}
export function jgzRegister(rows){
 return '<h1>Bronnenoverzicht JGZ</h1><p>Alleen deze negen collecties worden in deze versie geladen en doorzocht. Dit is een bronselectie, geen beoordeling dat iedere kaart voor elke JGZ-vraag geschikt is.</p><div class="compact-grid">'+Object.entries(JGZ_COLLECTIONS).map(([id,label])=>{const subset=rows.filter(r=>r.collection===id),files=[...new Set(subset.map(r=>r.source_file).filter(Boolean))];return '<article class="compact-card"><h2>'+esc(label)+'</h2><p>'+subset.length+' kaarten · '+(JGZ_KNOWLEDGE.includes(id)?'Kennisbronnen':'Patiënteninformatie')+'</p><p>'+subset.filter(r=>r.link_review).length+' links te controleren</p><details><summary>Herkomst & dekking</summary><p>'+ (id==='national'?'Bestaande beperkte selectie van 13 bronkaarten; niet de volledige Richtlijnendatabase.':id==='nhg'?'200 NHG-verwijzingen uit de bestaande inventaris.':id==='ncj'?'37 JGZ-richtlijnen uit het officiële overzicht.':files.map(esc).join('<br>'))+'</p><p>Import of inventaris geraadpleegd: oktober 2026. Dit is geen inhoudelijke geldigheidsbeoordeling.</p>'+(id==='pharos'?'<p>Zoeken op titel. Onbetrouwbare trefwoorden uit de export zijn niet gebruikt.</p>':'')+'</details><button data-jgz-collection="'+id+'">Doorzoek '+esc(label)+'</button></article>';}).join('')+'</div>';
}

export function jgzNews(){
 return '<section><div class="ia-section-title"><h2>'+icon('news')+'Nieuws</h2></div><p class="ia-caption">Open de actuele berichten bij de bron. Deze nieuwsvensters worden niet automatisch ingelezen.</p><div class="ia-shortcuts jgz-news-cards"><a href="https://www.ncj.nl/nieuws/" target="_blank" rel="noopener noreferrer"><span class="jgz-news-art">'+newsArt('growth')+'</span>NCJ · Nieuws ↗<small>Jeugdgezondheid en de JGZ-praktijk</small></a><a href="https://kansrijkestart.pharos.nl/nieuws/" target="_blank" rel="noopener noreferrer"><span class="jgz-news-art">'+newsArt('language')+'</span>Pharos · Kansrijke Start ↗<small>Gezond opgroeien en gelijke kansen</small></a></div></section>';
}

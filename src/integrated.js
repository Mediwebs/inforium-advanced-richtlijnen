import {icon} from './icons.js';
import {compactCard,contentTypeOf,sourceUrl} from './compact.js';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function decodeInforium(payload){
 if(payload.status!=='demonstration'||payload.source!=='https://mediwebs.github.io/Inforium-advanced/'||payload.records.length!==15)throw Error('Onbekende Inforium-voorbeeldset');
 const ids=new Set();
 return payload.records.map(r=>{
  if(!r.id.startsWith('inforium-')||ids.has(r.id)||!['patient','news'].includes(r.contentType)||typeof r.title!=='string'||r.url)throw Error('Ongeldig Inforium-voorbeeld');
  ids.add(r.id);
  return {...r,inforium:true,demo:true,collection:'inforium',kind:r.contentType==='news'?'Nieuwsvoorbeeld':'Patiënteninformatie · voorbeeld',audience:r.contentType==='patient'?'patient':'professional',layer:'inforium',specialties:[],topics:[],tasks:[],owner:'Inforium Advanced · ontwerpvoorbeeld',version:payload.sourceCommit,provenance:payload.source,checked_at:payload.checkedAt,description:r.description||'Voorbeeldkaart uit het Inforium Advanced-ontwerp. Er is nog geen gecontroleerde patiëntenfolder of artikel-URL gekoppeld.'};
 });
}
const artIcons={food:'knowledge',growth:'patient',baby:'patient',vaccine:'info',sleep:'patient',language:'patient',regional:'layers'};
export function integratedCard(r,selected,hit){
 if(!r.inforium)return compactCard(r,selected,hit,{boardLabel:'Werkmap'});
 return '<article class="compact-card inforium-example" data-detail-card="'+esc(r.id)+'"><div class="example-label">'+icon(r.contentType==='news'?'news':artIcons[r.art]||'patient')+'Ontwerpvoorbeeld · geen bronartikel</div><h3><button class="example-title" data-open="'+esc(r.id)+'">'+esc(r.title)+'</button></h3><div class="example-tags"><span>'+esc(r.topic)+'</span>'+(r.age?'<span>'+esc(r.age)+'</span>':'')+'</div><p class="example-origin">Bronlabel in ontwerp: '+esc(r.sourceLabel)+'</p><div class="compact-card-bottom"><span class="compact-status">Nog geen artikel gekoppeld</span><div class="actions"><button data-open="'+esc(r.id)+'">'+icon('info')+'Details</button><button data-pin="'+esc(r.id)+'">'+icon(selected.has(r.id)?'check':'bookmark')+(selected.has(r.id)?'Bewaard':'Werkmap')+'</button></div></div></article>';
}
export function integratedHome(resources,selected){
 const examples=resources.filter(r=>r.inforium&&r.contentType==='patient'),news=resources.filter(r=>r.inforium&&r.contentType==='news');
 const patients=resources.filter(r=>r.pznl&&r.audience==='patient').slice(0,4);
 const guides=resources.filter(r=>r.navigation).slice(0,3);
 return '<div class="ia-welcome"><div><p class="ia-eyebrow">INFORIUM ADVANCED × CHIPBOARD</p><h1>Alles voor je volgende zorgmoment.</h1><p>Vind kennis voor jezelf en begrijpelijke informatie om samen te bekijken.</p></div><div class="ia-welcome-mark" aria-hidden="true">'+icon('knowledge')+icon('patient')+'</div></div>'+
 '<div class="ia-shortcuts"><a href="#zoeken">'+icon('search')+'Alle bronnen <small>'+resources.filter(r=>!r.demo).length.toLocaleString('nl-NL')+' bronkaarten</small></a><a href="#patienten">'+icon('patient')+'Patiënteninformatie <small>Bronnen & ontwerpvoorbeelden</small></a><a href="#nieuws">'+icon('news')+'Nieuws <small>Inventaris & voorbeelden</small></a><a href="#board">'+icon('bookmark')+'Mijn werkmap <small>'+selected.size+' bewaard in deze sessie</small></a></div>'+
 '<div class="ia-section-title"><h2>Informatie voor patiënten en naasten</h2><a href="#patienten">Alles bekijken →</a></div><div class="compact-grid">'+patients.map(r=>integratedCard(r,selected)).join('')+'</div>'+
 '<div class="ia-section-title"><h2>Ouderinformatie · Inforium Advanced</h2><button data-ia-examples="patient">Alle 12 voorbeelden →</button></div><p class="ia-caption">Overgenomen ontwerpkaarten; bronlabels zijn nog geen geverifieerde artikellinks.</p><div class="ia-age-pills" role="group" aria-label="Voorbeelden per leeftijd"><button data-ia-age="0–4 jaar">0–4 jaar</button><button data-ia-age="4–12 jaar">4–12 jaar</button><button data-ia-examples="patient">Alle leeftijden</button></div><div class="compact-grid ia-patient-grid">'+examples.slice(0,4).map(r=>integratedCard(r,selected)).join('')+'</div>'+
 '<div class="ia-section-title"><h2>Richtlijnen binnen handbereik</h2><button data-ia-knowledge>Zoek in kennisbronnen →</button></div><div class="compact-grid">'+guides.map(r=>integratedCard(r,selected)).join('')+'</div>'+
 '<div class="ia-section-title"><h2>Nieuws & inspiratie</h2><a href="#nieuws">Alles bekijken →</a></div><p class="ia-caption">Illustratieve nieuwskaarten uit het Inforium-ontwerp; geen actuele berichtgeving.</p><div class="ia-news-grid">'+news.map(r=>integratedCard(r,selected)).join('')+'</div>';
}
export function inforiumDetails(r){
 return '<div class="notice">Ontwerpvoorbeeld. Geen gekoppeld bronartikel, medisch advies of verzendbare patiëntenfolder.</div><dl><dt>Oorspronkelijk bronlabel</dt><dd>'+esc(r.sourceLabel)+'</dd><dt>Thema</dt><dd>'+esc(r.topic)+'</dd><dt>Leeftijdslabel in ontwerp</dt><dd>'+esc(r.age||'Niet vastgelegd')+'</dd><dt>Herkomst</dt><dd><a href="https://mediwebs.github.io/Inforium-advanced/" target="_blank" rel="noopener noreferrer">Bekijk het oorspronkelijke Inforium-ontwerp ↗</a></dd></dl><p>Bewaar deze kaart in je werkmap om de gecombineerde bediening te proberen. Deze kaart komt niet in het voorbeeldpakket met echte patiëntenlinks.</p>';
}
export function packagePreview(resources,selected){
 const picked=resources.filter(r=>selected.has(r.id)),patient=picked.filter(r=>!r.demo&&contentTypeOf(r)==='patient'&&sourceUrl(r));
 return '<div class="dialog-top"><span class="badge">Klikbaar prototype</span><button data-close>Sluiten ✕</button></div><h2 id="detail-title">Voorbeeld van een informatiepakket</h2><p>Deze voorvertoning bevat alleen bewaarde patiëntenbronlinks. Er wordt niets verzonden en er worden geen ontvanger- of patiëntgegevens gevraagd.</p>'+(patient.length?'<ul class="ia-package">'+patient.map(r=>'<li><a href="'+esc(sourceUrl(r))+'" target="_blank" rel="noopener noreferrer">'+esc(r.title)+' ↗</a><small>'+esc(r.owner)+(r.locked?' · mogelijk inloggen':'')+'</small></li>').join('')+'</ul>':'<div class="empty">Bewaar eerst een echte patiëntenbron via Patiënteninformatie.</div>')+'<p>'+ (picked.length-patient.length)+' andere kaart(en) niet opgenomen: professionele bronnen, nieuws of ontwerpvoorbeelden.</p>';
}

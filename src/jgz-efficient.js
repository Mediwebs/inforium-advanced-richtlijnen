import {buildSearchIndex,searchResources} from './search.js';
const $=s=>document.querySelector(s);
const labels={ncj:'NCJ · JGZ',nhg:'NHG',national:'Richtlijnendatabase',groeigids:'GroeiGids',thuisarts:'Thuisarts',voedingscentrum:'Voedingscentrum',rivm:'RIVM',kinderveiligheid:'Kinderveiligheid',pharos:'Pharos'};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=n=>n.toLocaleString('nl-NL');
const date=s=>s?new Date(s).toLocaleDateString('nl-NL'):'Niet beoordeeld';
function url(r){const value=r.url||r.source?.url;try{return !r.link_review&&new URL(value).protocol==='https:'?value:null;}catch{return null;}}
const audience=r=>r.audience==='patient'?'patient':'professional';
let rows=[],index=[],found=[],current=null,selected=new Set(),collections=new Set(Object.keys(labels)),target='all',page=0,selectionOnly=false,view='library',lastResponse=null;
const pageSize=12;
let toastTimer;
function toast(message){$('#toast').textContent=message;$('#toast').style.display='block';clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').style.display='none',3300);}
async function copy(text){if(!text){toast('Selecteer eerst één of meer bronnen.');return;}try{await navigator.clipboard.writeText(text);toast('Gekopieerd naar het klembord.');}catch{toast('Kopiëren niet beschikbaar. Download de JSON via API & integratie.');}}
function persist(){try{sessionStorage.setItem('jgz-efficient-selection',JSON.stringify([...selected]));}catch{}}
function toggle(id){selected.has(id)?selected.delete(id):selected.add(id);persist();refresh(false);}
function select(id){current=rows.find(r=>r.id===id)||null;renderDetails();renderRows();if(matchMedia('(max-width:1150px)').matches)$('#detail').scrollIntoView({behavior:'smooth',block:'start'});}
function matching(){let result;
 if($('#query').value.trim()){const search=searchResources(index,$('#query').value,{collections:[...collections],completeOnly:$('#complete').checked});if(search.error){$('#result-count').textContent=search.error;return [];}result=search.results.map(x=>({...x.record,match:x}));}
 else result=rows.filter(r=>collections.has(r.collection));
 result=result.filter(r=>(target==='all'||audience(r)===target)&&(!$('#usable').checked||url(r))&&(!selectionOnly||selected.has(r.id)));
 const sort=$('#sort').value;
 if(sort==='title'||!$('#query').value.trim())result.sort((a,b)=>a.title.localeCompare(b.title,'nl'));
 if(sort==='relevance'&&!$('#query').value.trim())result.sort((a,b)=>(a.collection==='ncj'?0:audience(a)==='professional'?1:2)-(b.collection==='ncj'?0:audience(b)==='professional'?1:2));
 if(sort==='collection')result.sort((a,b)=>labels[a.collection].localeCompare(labels[b.collection],'nl')||a.title.localeCompare(b.title,'nl'));
 return result;
}
function refresh(resetPage=true){if(resetPage)page=0;const start=performance.now();found=matching();page=Math.min(page,Math.max(0,Math.ceil(found.length/pageSize)-1));$('#selection-count').textContent=selected.size;
 $('#result-count').textContent=`${fmt(found.length)} resultaten · ${Math.max(1,Math.round(performance.now()-start))} ms${selectionOnly?' · filters gelden ook voor je selectie':''}`;
 $('#copy-selection').disabled=!rows.some(r=>selected.has(r.id)&&url(r));
 if(!current||resetPage&&!found.some(r=>r.id===current.id))current=found[0]||null;
 renderRows();renderDetails();renderApi();
 const params=new URLSearchParams();if($('#query').value)params.set('q',$('#query').value);if(view==='api')params.set('view','api');history.replaceState(null,'',location.pathname+(params.size?'?'+params:''));
}
function renderRows(){const subset=found.slice(page*pageSize,(page+1)*pageSize);
 $('#rows').innerHTML=subset.length?subset.map(r=>`<article class="row ${current?.id===r.id?'selected':''}"><div class="row-main"><button class="row-title" data-detail="${esc(r.id)}">${esc(r.title)}</button><div class="row-info"><span class="source-pill">${esc(labels[r.collection])}</span><span>${audience(r)==='patient'?'Ouders & jongeren':'Professionals'}</span>${!url(r)?'<span class="warning">Link te controleren</span>':''}${r.match?`<span>${r.match.matched}/${r.match.total} trefwoorden</span>`:''}</div></div><div class="row-actions"><button data-toggle="${esc(r.id)}" aria-label="${selected.has(r.id)?'Verwijder uit':'Voeg toe aan'} consultselectie: ${esc(r.title)}" aria-pressed="${selected.has(r.id)}">${selected.has(r.id)?'✓':'+'}</button>${url(r)?`<a href="${esc(url(r))}" target="_blank" rel="noopener noreferrer" aria-label="Open bron: ${esc(r.title)}">↗</a>`:''}</div></article>`).join(''):`<div class="empty"><strong>${selectionOnly?'Geen geselecteerde bronnen in deze weergave':'Geen bronnen gevonden'}</strong>${selectionOnly?'Voeg bronnen toe met +, of herstel je filters.':'Probeer minder zoekwoorden, andere trefwoorden of meer broncollecties.'}<br><button id="empty-reset">Filters herstellen</button></div>`;
 $('#previous').disabled=page===0;$('#next').disabled=(page+1)*pageSize>=found.length;$('#page-count').textContent=found.length?`${page*pageSize+1}–${Math.min((page+1)*pageSize,found.length)} van ${fmt(found.length)}`:'0 resultaten';
}
function renderDetails(){const r=current;if(!r){$('#detail').innerHTML='<p class="eyebrow">BRONDETAILS</p><h2>Kies een bron</h2><p>Klik op een titel om herkomst en brongegevens te bekijken.</p>';return;}
 const link=url(r),match=found.find(x=>x.id===r.id)?.match;
 $('#detail').innerHTML=`<p class="eyebrow">BRONDETAILS ${found.some(x=>x.id===r.id)?'':'· BUITEN HUIDIGE FILTERS'}</p><span class="source-pill">${esc(labels[r.collection])}</span><h2>${esc(r.title)}</h2><p>${esc(r.description||'Verwijzing naar de oorspronkelijke bron. Open de bron voor de volledige inhoud.')}</p>${link?`<a class="primary-link" href="${esc(link)}" target="_blank" rel="noopener noreferrer">Open oorspronkelijke bron ↗</a><button class="wide" data-copy="${esc(r.id)}">Kopieer bronlink</button>`:'<p class="warning">Link te controleren. Openen en delen zijn voor deze kaart uitgeschakeld.</p>'}<button class="wide" data-toggle="${esc(r.id)}" aria-pressed="${selected.has(r.id)}">${selected.has(r.id)?'✓ In consultselectie · verwijderen':'+ Voeg toe aan consultselectie'}</button><dl><dt>Soort informatie</dt><dd>${esc(r.kind||(audience(r)==='patient'?'Patiënteninformatie':'Richtlijnverwijzing'))}</dd><dt>Inventaris / export</dt><dd>${esc(r.version||r.export_date||'Oktober 2026')}</dd><dt>Bronverwijzing gecontroleerd</dt><dd>${date(r.link_checked_at||r.checked_at)}</dd><dt>Medische geldigheid beoordeeld</dt><dd>${date(r.validity_assessed_at)}</dd></dl>${match?`<details><summary>Waarom gevonden?</summary>${match.matches.map(m=>`<p><strong>${esc(m.term)}</strong> · ${esc(m.field)}<br>${esc(m.snippet)}</p>`).join('')}</details>`:''}<details><summary>Technische brongegevens</summary><p>ID: <code>${esc(r.id)}</code></p><p>${esc(r.source_file||r.provenance_url||'Bestaande projectcatalogus')}</p>${r.metadata_note?`<p>${esc(r.metadata_note)}</p>`:''}</details><small>Titel en metadata uit de broninventaris. Raadpleeg de oorspronkelijke bron voor de actuele inhoud.</small><button class="api-link" data-api="true">Bekijk als API-integratie →</button>`;
}
function apiRecord(r){return {id:r.id,title:r.title,collection:r.collection,audience:audience(r),url:url(r),link_status:url(r)?'source_link_present':'review_required',source_checked_at:r.checked_at||null,link_checked_at:r.link_checked_at||null,validity_assessed_at:r.validity_assessed_at||null,source_file:r.source_file||null};}
function renderApi(){const params=new URLSearchParams({q:$('#query').value,collections:[...collections].join(','),audience:target,all_terms:String($('#complete').checked),usable_links:String($('#usable').checked),sort:$('#sort').value,limit:'3'});if(selectionOnly)params.set('ids',[...selected].join(','));
 $('#request').textContent='GET /api/v1/resources?'+params;
 const sample=found.slice(0,3);lastResponse={demo:true,contract_version:'example-1',catalogue_snapshot:'2026-10',total:found.length,limit:3,items:sample.map(apiRecord)};
 $('#response').textContent=JSON.stringify(lastResponse,null,2);$('#embed-query').textContent=$('#query').value?`Onderwerp: ${$('#query').value}`:'Bronnen uit de huidige selectie';
 $('#embed-results').innerHTML=sample.length?sample.map(r=>url(r)?`<a href="${esc(url(r))}" target="_blank" rel="noopener noreferrer">${esc(r.title)} ↗<small>${esc(labels[r.collection])} · ${audience(r)==='patient'?'Ouders & jongeren':'Professionals'}</small></a>`:`<p>${esc(r.title)} · Link te controleren</p>`).join(''):'<p>Geen bronnen voor deze zoekopdracht.</p>';
}
function setView(next){view=next;$('#library-view').hidden=view!=='library';$('#api-view').hidden=view!=='api';document.querySelectorAll('[data-view]').forEach(b=>b.classList.toggle('active',b.dataset.view===view));refresh(false);}
function reset(){collections=new Set(Object.keys(labels));target='all';$('#usable').checked=false;$('#complete').checked=true;$('#sort').value='relevance';document.querySelectorAll('#collections input').forEach(c=>c.checked=true);document.querySelectorAll('[data-audience]').forEach(b=>b.classList.toggle('active',b.dataset.audience==='all'));refresh();}
document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
 if(b.dataset.detail)select(b.dataset.detail);
 if(b.dataset.toggle)toggle(b.dataset.toggle);
 if(b.dataset.copy){const r=rows.find(r=>r.id===b.dataset.copy);if(r&&url(r))copy(url(r));}
 if(b.dataset.view)setView(b.dataset.view);
 if(b.dataset.api)setView('api');
 if(b.dataset.query){$('#query').value=b.dataset.query;selectionOnly=false;setTabs();setView('library');refresh();}
 if(b.dataset.audience){target=b.dataset.audience;document.querySelectorAll('[data-audience]').forEach(x=>x.classList.toggle('active',x===b));refresh();}
 if(b.id==='empty-reset')reset();
});
function setTabs(){$('#all-tab').classList.toggle('active',!selectionOnly);$('#selection-tab').classList.toggle('active',selectionOnly);}
$('#all-tab').onclick=()=>{selectionOnly=false;setTabs();refresh();};$('#selection-tab').onclick=()=>{selectionOnly=true;setTabs();refresh();};
let debounce;$('#query').addEventListener('input',()=>{clearTimeout(debounce);debounce=setTimeout(()=>refresh(),100);});
$('#clear-query').onclick=()=>{$('#query').value='';refresh();$('#query').focus();};
$('#collections').addEventListener('change',e=>{if(e.target.checked)collections.add(e.target.value);else collections.delete(e.target.value);refresh();});
for(const selector of ['#usable','#complete','#sort'])$(selector).addEventListener('change',()=>refresh());
$('#reset').onclick=reset;$('#previous').onclick=()=>{page--;renderRows();};$('#next').onclick=()=>{page++;renderRows();};
$('#copy-selection').onclick=()=>copy(rows.filter(r=>selected.has(r.id)&&url(r)).map(r=>`${r.title}\n${url(r)}`).join('\n\n'));
$('#copy-json').onclick=()=>copy(JSON.stringify(lastResponse,null,2));
$('#download-json').onclick=()=>{const blob=new Blob([JSON.stringify(lastResponse,null,2)],{type:'application/json'}),link=document.createElement('a');link.href=URL.createObjectURL(blob);link.download='2026-10-24-inforium-jgz-api-voorbeeld.json';link.click();setTimeout(()=>URL.revokeObjectURL(link.href),1000);};
for(const selector of ['#about','#provenance'])$(selector).onclick=()=>$('#source-dialog').showModal();
$('.close').onclick=()=>$('#source-dialog').close();
document.addEventListener('keydown',e=>{if(e.key==='/'&&!['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)&&!$('#source-dialog').open){e.preventDefault();$('#query').focus();}});
async function init(){try{const response=await fetch('./data/jgz-library.json');if(!response.ok)throw Error('HTTP '+response.status);rows=await response.json();index=buildSearchIndex(rows);$('#total').textContent=fmt(rows.length);
 try{const saved=JSON.parse(sessionStorage.getItem('jgz-efficient-selection')||'[]');selected=new Set((Array.isArray(saved)?saved:[]).filter(id=>rows.some(r=>r.id===id)));}catch{}
 $('#collections').innerHTML=Object.entries(labels).map(([id,label])=>`<label class="collection"><input type="checkbox" value="${id}" checked><span>${esc(label)}</span><small>${fmt(rows.filter(r=>r.collection===id).length)}</small></label>`).join('');
 $('#source-summary').innerHTML=Object.entries(labels).map(([id,label])=>`<div>${esc(label)} <strong>${fmt(rows.filter(r=>r.collection===id).length)}</strong></div>`).join('');
 const params=new URLSearchParams(location.search);$('#query').value=(params.get('q')||'').slice(0,200);setView(params.get('view')==='api'?'api':'library');
 }catch(error){$('#result-count').textContent='Catalogus niet geladen';$('#rows').innerHTML='<div class="empty"><strong>Brongegevens niet beschikbaar</strong>Controleer je verbinding en herlaad deze pagina.<br><button id="reload">Opnieuw proberen</button></div>';$('#reload').onclick=()=>location.reload();console.error(error);}}
init();

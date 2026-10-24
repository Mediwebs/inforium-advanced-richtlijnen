import {buildSearchIndex,searchResources} from './search.js';
import {demoResources,shareable,packageText,readWorkspace} from './jgz-efficient-workspace.js';
const $=s=>document.querySelector(s);
const labels={'local-jgz':'JGZ Duin & Dreef · fictief',ncj:'NCJ · JGZ',nhg:'NHG',national:'Richtlijnendatabase',groeigids:'GroeiGids',thuisarts:'Thuisarts',voedingscentrum:'Voedingscentrum',rivm:'RIVM',kinderveiligheid:'Kinderveiligheid',pharos:'Pharos'};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=n=>n.toLocaleString('nl-NL');
const date=s=>s?new Date(s).toLocaleDateString('nl-NL'):'Niet beoordeeld';
function url(r){const value=r.url||r.source?.url;try{return !r.link_review&&new URL(value).protocol==='https:'?value:null;}catch{return null;}}
const audience=r=>r.audience==='patient'?'patient':'professional';
let rows=[],index=[],found=[],current=null,selected=new Set(),collections=new Set(Object.keys(labels)),target='all',page=0,selectionOnly=false,view='library',lastResponse=null;
let favorites=new Set(),groups=[],scope='all',activeGroup='';
const pageSize=12;
function saveWorkspace(){try{localStorage.setItem('jgz-efficient-workspace',JSON.stringify({favorites:[...favorites],groups}));}catch{toast('Opslag niet beschikbaar; wijzigingen blijven alleen in dit venster.');}}
function download(text,name,type='text/plain'){const link=document.createElement('a');link.href=URL.createObjectURL(new Blob([text],{type}));link.download=name;link.click();setTimeout(()=>URL.revokeObjectURL(link.href),1000);}
function groupOptions(){const picker=$('#group-picker');picker.innerHTML='<option value="">Kies een eigen collectie…</option>'+groups.map(g=>'<option value="'+esc(g.id)+'">'+esc(g.name)+' ('+g.ids.length+')</option>').join('');picker.value=activeGroup;$('#group-delete').disabled=!activeGroup;$('#save-group').disabled=!activeGroup||!selected.size;}
function setScope(next){scope=next;selectionOnly=next==='selection';setTabs();refresh();}
function showPackage(){const chosen=rows.filter(r=>selected.has(r.id));$('#package-text').value=packageText(chosen);$('#package-summary').textContent=chosen.filter(shareable).length+' deelbare items · '+chosen.filter(r=>!shareable(r)).length+' interne of niet-deelbare items blijven buiten het ouderpakket.';$('#internal-items').innerHTML=chosen.filter(r=>!shareable(r)).map(r=>'<li>'+esc(r.title)+(r.demo?' · FICTIEF':'')+'</li>').join('');for(const id of ['copy-package','download-package','email-package'])$('#'+id).disabled=!chosen.some(shareable);$('#package-dialog').showModal();}

let toastTimer;
function toast(message){$('#toast').textContent=message;$('#toast').style.display='block';clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').style.display='none',3300);}
async function copy(text){if(!text){toast('Selecteer eerst één of meer bronnen.');return;}try{await navigator.clipboard.writeText(text);toast('Gekopieerd naar het klembord.');}catch{toast('Kopiëren niet beschikbaar. Download de JSON via API & integratie.');}}
function persist(){try{sessionStorage.setItem('jgz-efficient-selection',JSON.stringify([...selected]));}catch{}}
function toggle(id){selected.has(id)?selected.delete(id):selected.add(id);persist();refresh(false);}
function select(id){current=rows.find(r=>r.id===id)||null;renderDetails();renderRows();if(matchMedia('(max-width:1150px)').matches)$('#detail').scrollIntoView({behavior:'smooth',block:'start'});}
function matching(){let result;
 if(selectionOnly)return rows.filter(r=>selected.has(r.id));
 if(scope==='collection')return rows.filter(r=>(groups.find(g=>g.id===activeGroup)?.ids||[]).includes(r.id));
 if(scope==='favorites')return rows.filter(r=>favorites.has(r.id));
 if($('#query').value.trim()){const search=searchResources(index,$('#query').value,{collections:[...collections],completeOnly:$('#complete').checked});if(search.error){$('#result-count').textContent=search.error;return [];}result=search.results.map(x=>({...x.record,match:x}));}
 else result=rows.filter(r=>collections.has(r.collection));
 result=result.filter(r=>(target==='all'||audience(r)===target)&&(!$('#usable').checked||url(r)||r.demo)&&(!selectionOnly||selected.has(r.id)));
 const sort=$('#sort').value;
 if(sort==='title'||!$('#query').value.trim())result.sort((a,b)=>a.title.localeCompare(b.title,'nl'));
 if(sort==='relevance'&&!$('#query').value.trim())result.sort((a,b)=>(a.demo?-1:a.collection==='ncj'?0:audience(a)==='professional'?1:2)-(b.demo?-1:b.collection==='ncj'?0:audience(b)==='professional'?1:2));
 if(sort==='collection')result.sort((a,b)=>labels[a.collection].localeCompare(labels[b.collection],'nl')||a.title.localeCompare(b.title,'nl'));
 return result;
}
function refresh(resetPage=true){if(resetPage)page=0;const start=performance.now();found=matching();page=Math.min(page,Math.max(0,Math.ceil(found.length/pageSize)-1));$('#selection-count').textContent=selected.size;
 $('#result-count').textContent=`${fmt(found.length)} resultaten · ${Math.max(1,Math.round(performance.now()-start))} ms${scope!=='all'?' · volledige bewaarde lijst, zonder zoekfilters':''}`;
 $('#copy-selection').disabled=!rows.some(r=>selected.has(r.id)&&shareable(r));
 $('#continue-selection').disabled=!selected.size;$('#selection-tools').hidden=!selectionOnly;
 $('#favorite-count').textContent=favorites.size;groupOptions();
 const checks=[...document.querySelectorAll('#collections input')];$('#collections-all').checked=checks.length>0&&checks.every(c=>c.checked);$('#collections-all').indeterminate=checks.some(c=>c.checked)&&!$('#collections-all').checked;
 $('#results-all').checked=found.length>0&&found.every(r=>selected.has(r.id));$('#results-all').indeterminate=found.some(r=>selected.has(r.id))&&!$('#results-all').checked;
 $('#results-all').disabled=!found.length;$('#clear-selection').disabled=!selected.size;
 if(!current||resetPage&&!found.some(r=>r.id===current.id))current=found[0]||null;
 renderRows();renderDetails();renderApi();
 const params=new URLSearchParams();if($('#query').value)params.set('q',$('#query').value);if(view==='api')params.set('view','api');history.replaceState(null,'',location.pathname+(params.size?'?'+params:''));
}
function renderRows(){const subset=found.slice(page*pageSize,(page+1)*pageSize);
 $('#rows').innerHTML=subset.length?subset.map(r=>`<article class="row ${current?.id===r.id?'selected':''}"><div class="row-main"><button class="row-title" data-detail="${esc(r.id)}">${esc(r.title)}</button><div class="row-info"><span class="source-pill">${esc(labels[r.collection])}</span><span>${audience(r)==='patient'?'Ouders & jongeren':'Professionals'}</span>${r.demo?'<span class="warning">FICTIEF · '+esc(r.kind)+'</span>':!url(r)?'<span class="warning">Link te controleren</span>':''}${r.match?`<span>${r.match.matched}/${r.match.total} trefwoorden</span>`:''}</div></div><div class="row-actions"><button data-favorite="${esc(r.id)}" aria-label="${favorites.has(r.id)?'Verwijder favoriet':'Bewaar favoriet'}: ${esc(r.title)}" aria-pressed="${favorites.has(r.id)}">${favorites.has(r.id)?'★':'☆'}</button>${scope==='collection'?'<button data-remove-group="'+esc(r.id)+'" aria-label="Verwijder uit collectie: '+esc(r.title)+'">−</button>':''}<button data-toggle="${esc(r.id)}" aria-label="${selected.has(r.id)?'Verwijder uit':'Voeg toe aan'} consultselectie: ${esc(r.title)}" aria-pressed="${selected.has(r.id)}">${selected.has(r.id)?'✓':'+'}</button>${url(r)?`<a href="${esc(url(r))}" target="_blank" rel="noopener noreferrer" aria-label="Open bron: ${esc(r.title)}">↗</a>`:''}</div></article>`).join(''):`<div class="empty"><strong>${selectionOnly?'Geen geselecteerde bronnen in deze weergave':'Geen bronnen gevonden'}</strong>${selectionOnly?'Voeg bronnen toe met +, of herstel je filters.':'Probeer minder zoekwoorden, andere trefwoorden of meer broncollecties.'}<br><button id="empty-reset">Filters herstellen</button></div>`;
 $('#previous').disabled=page===0;$('#next').disabled=(page+1)*pageSize>=found.length;$('#page-count').textContent=found.length?`${page*pageSize+1}–${Math.min((page+1)*pageSize,found.length)} van ${fmt(found.length)}`:'0 resultaten';
}
function renderDetails(){const r=current;if(!r){$('#detail').innerHTML='<p class="eyebrow">BRONDETAILS</p><h2>Kies een bron</h2><p>Klik op een titel om herkomst en brongegevens te bekijken.</p>';return;}
 const link=url(r),match=found.find(x=>x.id===r.id)?.match;
 $('#detail').innerHTML=`<p class="eyebrow">BRONDETAILS ${found.some(x=>x.id===r.id)?'':'· BUITEN HUIDIGE FILTERS'}</p><span class="source-pill">${esc(labels[r.collection])}</span><h2>${esc(r.title)}</h2><p>${esc(r.description||'Verwijzing naar de oorspronkelijke bron. Open de bron voor de volledige inhoud.')}</p>${r.demo?'<div class="demo-body"><strong>FICTIEF ORGANISATIEVOORBEELD</strong><p>'+esc(r.body).replaceAll('\n','<br>')+'</p></div>':link?`<a class="primary-link" href="${esc(link)}" target="_blank" rel="noopener noreferrer">Open oorspronkelijke bron ↗</a><button class="wide" data-copy="${esc(r.id)}">Kopieer bronlink</button>`:'<p class="warning">Link te controleren. Openen en delen zijn voor deze kaart uitgeschakeld.</p>'}<button class="wide" data-toggle="${esc(r.id)}" aria-pressed="${selected.has(r.id)}">${selected.has(r.id)?'✓ In consultselectie · verwijderen':'+ Voeg toe aan consultselectie'}</button><dl><dt>Soort informatie</dt><dd>${esc(r.kind||(audience(r)==='patient'?'Patiënteninformatie':'Richtlijnverwijzing'))}</dd><dt>Inventaris / export</dt><dd>${esc(r.version||r.export_date||'Oktober 2026')}</dd><dt>Bronverwijzing gecontroleerd</dt><dd>${date(r.link_checked_at||r.checked_at)}</dd><dt>Medische geldigheid beoordeeld</dt><dd>${date(r.validity_assessed_at)}</dd></dl>${match?`<details><summary>Waarom gevonden?</summary>${match.matches.map(m=>`<p><strong>${esc(m.term)}</strong> · ${esc(m.field)}<br>${esc(m.snippet)}</p>`).join('')}</details>`:''}<details><summary>Technische brongegevens</summary><p>ID: <code>${esc(r.id)}</code></p><p>${esc(r.source_file||r.provenance_url||'Bestaande projectcatalogus')}</p>${r.metadata_note?`<p>${esc(r.metadata_note)}</p>`:''}</details><small>Titel en metadata uit de broninventaris. Raadpleeg de oorspronkelijke bron voor de actuele inhoud.</small><button class="api-link" data-api="true">Bekijk als API-integratie →</button>`;
}
function apiRecord(r){return {demo:!!r.demo,body:r.demo?r.body:null,shareable:shareable(r),id:r.id,title:r.title,collection:r.collection,audience:audience(r),url:url(r),link_status:r.demo?'fictional_inline_example':url(r)?'source_link_present':'review_required',source_checked_at:r.checked_at||null,link_checked_at:r.link_checked_at||null,validity_assessed_at:r.validity_assessed_at||null,source_file:r.source_file||null};}
function renderApi(){const params=new URLSearchParams({q:$('#query').value,collections:[...collections].join(','),audience:target,all_terms:String($('#complete').checked),usable_links:String($('#usable').checked),sort:$('#sort').value,limit:'3'});if(scope!=='all'){params.set('scope',scope);params.set('ids',found.map(r=>r.id).join(','));}
 $('#request').textContent='GET /api/v1/resources?'+params;
 const sample=found.slice(0,3);lastResponse={demo:true,contract_version:'example-1',catalogue_snapshot:'2026-10',total:found.length,limit:3,items:sample.map(apiRecord)};
 $('#response').textContent=JSON.stringify(lastResponse,null,2);$('#embed-query').textContent=$('#query').value?`Onderwerp: ${$('#query').value}`:'Bronnen uit de huidige selectie';
 $('#embed-results').innerHTML=sample.length?sample.map(r=>r.demo?`<p><strong>FICTIEF · ${esc(r.title)}</strong><br>${esc(r.body)}</p>`:url(r)?`<a href="${esc(url(r))}" target="_blank" rel="noopener noreferrer">${esc(r.title)} ↗<small>${esc(labels[r.collection])} · ${audience(r)==='patient'?'Ouders & jongeren':'Professionals'}</small></a>`:`<p>${esc(r.title)} · Link te controleren</p>`).join(''):'<p>Geen bronnen voor deze zoekopdracht.</p>';
}
function setView(next){view=next;$('#library-view').hidden=view!=='library';$('#api-view').hidden=view!=='api';document.querySelectorAll('[data-view]').forEach(b=>b.classList.toggle('active',b.dataset.view===view));refresh(false);}
function reset(){collections=new Set(Object.keys(labels));target='all';$('#usable').checked=false;$('#complete').checked=true;$('#sort').value='relevance';document.querySelectorAll('#collections input').forEach(c=>c.checked=true);document.querySelectorAll('[data-audience]').forEach(b=>b.classList.toggle('active',b.dataset.audience==='all'));refresh();}
document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
 if(b.dataset.detail)select(b.dataset.detail);
 if(b.dataset.toggle)toggle(b.dataset.toggle);
 if(b.dataset.favorite){favorites.has(b.dataset.favorite)?favorites.delete(b.dataset.favorite):favorites.add(b.dataset.favorite);saveWorkspace();refresh(false);}
 if(b.dataset.removeGroup){const g=groups.find(g=>g.id===activeGroup);if(g){g.ids=g.ids.filter(id=>id!==b.dataset.removeGroup);saveWorkspace();refresh(false);}}
 if(b.dataset.copy){const r=rows.find(r=>r.id===b.dataset.copy);if(r&&url(r))copy(url(r));}
 if(b.dataset.view)setView(b.dataset.view);
 if(b.dataset.api)setView('api');
 if(b.dataset.query){$('#query').value=b.dataset.query;scope='all';selectionOnly=false;setTabs();setView('library');refresh();}
 if(b.dataset.audience){target=b.dataset.audience;document.querySelectorAll('[data-audience]').forEach(x=>x.classList.toggle('active',x===b));refresh();}
 if(b.id==='empty-reset')reset();
});
function setTabs(){$('#all-tab').classList.toggle('active',scope==='all');$('#selection-tab').classList.toggle('active',selectionOnly);$('#favorites-tab').classList.toggle('active',scope==='favorites');$('#groups-tab').classList.toggle('active',scope==='collection');}
$('#all-tab').onclick=()=>setScope('all');$('#selection-tab').onclick=()=>setScope('selection');
$('#favorites-tab').onclick=()=>setScope('favorites');$('#groups-tab').onclick=()=>{if(!activeGroup)activeGroup=groups[0]?.id||'';setScope('collection');};
$('#group-picker').onchange=()=>{activeGroup=$('#group-picker').value;setScope(activeGroup?'collection':'all');};
$('#new-group').onclick=()=>{$('#group-name').value='';$('#group-dialog').showModal();$('#group-name').focus();};
$('#group-form').onsubmit=e=>{e.preventDefault();const name=$('#group-name').value.trim();if(!name)return;const g={id:'group-'+crypto.randomUUID(),name,ids:[...selected]};groups.push(g);activeGroup=g.id;saveWorkspace();$('#group-dialog').close();setScope('collection');toast('Collectie gemaakt met '+g.ids.length+' geselecteerde bronnen.');};
$('#save-group').onclick=()=>{const g=groups.find(g=>g.id===activeGroup);if(!g)return;g.ids=[...new Set([...g.ids,...selected])];saveWorkspace();refresh(false);toast('Consultselectie toegevoegd aan '+g.name);};
$('#group-delete').onclick=()=>{const g=groups.find(g=>g.id===activeGroup);if(!g)return;$('#delete-group-name').textContent=g.name;$('#delete-group-dialog').showModal();};
$('#confirm-delete-group').onclick=()=>{groups=groups.filter(g=>g.id!==activeGroup);activeGroup='';saveWorkspace();$('#delete-group-dialog').close();setScope('all');};
$('#collections-all').onchange=e=>{collections=new Set(e.target.checked?Object.keys(labels):[]);document.querySelectorAll('#collections input').forEach(c=>c.checked=e.target.checked);setScope('all');};
$('#results-all').onchange=e=>{for(const r of found)e.target.checked?selected.add(r.id):selected.delete(r.id);persist();refresh(false);};
$('#clear-selection').onclick=()=>{selected.clear();persist();refresh(false);};
$('#continue-selection').onclick=showPackage;
$('#copy-package').onclick=()=>copy($('#package-text').value);
$('#download-package').onclick=()=>download($('#package-text').value,'2026-10-24-inforium-jgz-informatiepakket.txt');
$('#email-package').onclick=()=>{const text=$('#package-text').value;if(text.length>6000){toast('Dit pakket is te groot voor een e-mailconcept. Download of kopieer het pakket.');return;}location.href='mailto:?subject='+encodeURIComponent('Informatiepakket JGZ')+'&body='+encodeURIComponent(text);toast('E-mailconcept aangevraagd bij je mailprogramma; er is niets verstuurd.');};
document.querySelectorAll('[data-close-dialog]').forEach(b=>b.onclick=()=>b.closest('dialog').close());

let debounce;$('#query').addEventListener('input',()=>{clearTimeout(debounce);debounce=setTimeout(()=>refresh(),100);});
$('#clear-query').onclick=()=>{$('#query').value='';refresh();$('#query').focus();};
$('#collections').addEventListener('change',e=>{if(e.target.checked)collections.add(e.target.value);else collections.delete(e.target.value);setScope('all');});
for(const selector of ['#usable','#complete','#sort'])$(selector).addEventListener('change',()=>refresh());
$('#reset').onclick=reset;$('#previous').onclick=()=>{page--;renderRows();};$('#next').onclick=()=>{page++;renderRows();};
$('#copy-selection').onclick=()=>copy(packageText(rows.filter(r=>selected.has(r.id))));
$('#copy-json').onclick=()=>copy(JSON.stringify(lastResponse,null,2));
$('#download-json').onclick=()=>{const blob=new Blob([JSON.stringify(lastResponse,null,2)],{type:'application/json'}),link=document.createElement('a');link.href=URL.createObjectURL(blob);link.download='2026-10-24-inforium-jgz-api-voorbeeld.json';link.click();setTimeout(()=>URL.revokeObjectURL(link.href),1000);};
for(const selector of ['#about','#provenance'])$(selector).onclick=()=>$('#source-dialog').showModal();
$('.close').onclick=()=>$('#source-dialog').close();
document.addEventListener('keydown',e=>{if(e.key==='/'&&!['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)&&!$('#source-dialog').open){e.preventDefault();$('#query').focus();}});
async function init(){try{const response=await fetch('./data/jgz-library.json');if(!response.ok)throw Error('HTTP '+response.status);rows=[...demoResources,...await response.json()];index=buildSearchIndex(rows,{}, {includeDemos:true});$('#total').textContent=fmt(rows.length);
 let stored=null;try{stored=localStorage.getItem('jgz-efficient-workspace');}catch{}
 const savedWorkspace=readWorkspace(stored,new Set(rows.map(r=>r.id)));favorites=new Set(savedWorkspace.favorites);groups=savedWorkspace.groups;
 if(!stored)groups=[{id:'example-welcome',name:'Voorbeeld · Kennismakingsconsult',ids:['demo-duindreef-welkom','demo-duindreef-voorbereiden','demo-duindreef-protocol-consult']},{id:'example-sleep',name:'Voorbeeld · Slapen & ouderinformatie',ids:['demo-duindreef-slaap','demo-duindreef-protocol-delen','ncj-jgz-richtlijn-slaap']}];
 try{const saved=JSON.parse(sessionStorage.getItem('jgz-efficient-selection')||'[]');selected=new Set((Array.isArray(saved)?saved:[]).filter(id=>rows.some(r=>r.id===id)));}catch{}
 $('#collections').innerHTML=Object.entries(labels).map(([id,label])=>`<label class="collection"><input type="checkbox" value="${id}" checked><span>${esc(label)}</span><small>${fmt(rows.filter(r=>r.collection===id).length)}</small></label>`).join('');
 $('#source-summary').innerHTML=Object.entries(labels).map(([id,label])=>`<div>${esc(label)} <strong>${fmt(rows.filter(r=>r.collection===id).length)}</strong></div>`).join('');
 const params=new URLSearchParams(location.search);$('#query').value=(params.get('q')||'').slice(0,200);setView(params.get('view')==='api'?'api':'library');
 }catch(error){$('#result-count').textContent='Catalogus niet geladen';$('#rows').innerHTML='<div class="empty"><strong>Brongegevens niet beschikbaar</strong>Controleer je verbinding en herlaad deze pagina.<br><button id="reload">Opnieuw proberen</button></div>';$('#reload').onclick=()=>location.reload();console.error(error);}}
init();

export const EXTRA_COLLECTIONS={aumc:'Amsterdam UMC',nvog:'NVOG · Video’s','transmuraal-amsterdam':'Transmuraal Amsterdam'};
export const LANGUAGE_LABELS={nl:'Nederlands',en:'Engels',ar:'Arabisch',tr:'Turks',fr:'Frans',ti:'Tigrinya',so:'Somalisch'};
const hosts={aumc:['www.amsterdamumc.nl','www.youtube.com'],nvog:['www.youtube.com','animaties.behandelingbegrepen.nl','www.degynaecoloog.nl','player.vimeo.com'],kankernl:['www.kanker.nl'],'transmuraal-amsterdam':['transmuraalplatformamsterdam.nl']};
export function decodeExtraSources(payload){
 const ids=new Set(),urls=new Set();
 if(!Array.isArray(payload.sources)||payload.sources.length!==7||!Array.isArray(payload.records))throw Error('Aanvullende import ontbreekt');
 const rows=payload.records.map(r=>{
  const u=new URL(r.url),professional=r.collection==='transmuraal-amsterdam';
  if(!hosts[r.collection]?.includes(u.hostname)||u.protocol!=='https:'||u.username||u.password||urls.has(r.collection+'|'+r.url)||ids.has(r.id)||!/^extra-[a-f0-9]{16}$/.test(r.id)||!r.title)throw Error('Ongeldige bronlink of identiteit');
  if(r.audience!==(professional?'professional':'patient')||r.checked_at!==null||r.published_at!==null||r.validity_assessed_at!==null||!r.languages.every(l=>LANGUAGE_LABELS[l]))throw Error('Ongeldige doelgroep of bronmetadata');
  for(const v of r.variants){if(!payload.sources.some(s=>s.file===v.file)||!Number.isInteger(v.row)||v.row<1)throw Error('Herkomst ontbreekt');if(v.source_page){const p=new URL(v.source_page);if(p.protocol!=='https:'||p.hostname!=='www.degynaecoloog.nl'||p.username||p.password)throw Error('Onveilige bronpagina');}}
  ids.add(r.id);urls.add(r.collection+'|'+r.url);
  return {...r,patientImport:true,extraImport:true,demo:false,contentType:professional?'knowledge':'patient',layer:professional?'regional':'patient',owner:EXTRA_COLLECTIONS[r.collection]||'Kanker.nl',topics:[],tasks:[],version:'Import '+r.imported_at,source_file:[...new Set(r.variants.map(v=>v.file))].join('; '),description:professional?'Werkafspraak voor zorgverleners. Geen patiëntenfolder. Lees de volledige afspraak bij de bron.':'Patiënteninformatie uit de aangeleverde inventaris. Actualiteit en bereikbaarheid niet opnieuw vastgesteld.'};
 });
 for(const s of payload.sources)if(rows.reduce((n,r)=>n+r.variants.filter(v=>v.file===s.file).length,0)!==s.rows)throw Error('Importtelling wijkt af');
 return rows;
}
export function mergeSourceImports(base,extra){
 const key=r=>r.url?r.collection+'|'+new URL(r.url).href.replace(/#show-menu$/,''):r.id;
 const out=base.map(r=>({...r})),byKey=new Map(out.map(r=>[key(r),r]));
 for(const r of extra){const prior=byKey.get(key(r));if(!prior){out.push(r);byKey.set(key(r),r);continue;}
  prior.variants=[...prior.variants.map(v=>({...v,file:v.file||prior.source_file})),...r.variants];
  prior.keywords=[...new Set([...(prior.keywords||[]),...r.keywords])];
  prior.specialties=[...new Set([...(prior.specialties||[]),...r.specialties])];
  prior.languages=[...new Set([...(prior.languages||[]),...r.languages])];
  prior.source_file=[...new Set(prior.variants.map(v=>v.file))].join('; ');
 }
 return out;
}

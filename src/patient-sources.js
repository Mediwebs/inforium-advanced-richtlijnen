export const PATIENT_COLLECTIONS={groeigids:'GroeiGids',kankernl:'Kanker.nl','kno-patient':'KNO · Patiënteninformatie',thuisarts:'Thuisarts.nl',voedingscentrum:'Voedingscentrum'};
const hosts={groeigids:['groeigids.nl','www.groeigids.nl','youtu.be'],kankernl:['www.kanker.nl'],'kno-patient':['www.kno.nl'],thuisarts:['www.thuisarts.nl','thuisarts.nl','media.thuisarts.nl'],voedingscentrum:['www.voedingscentrum.nl']};
export function decodePatientSources(payload){
 if(!Array.isArray(payload.sources)||payload.sources.length!==5||!Array.isArray(payload.records))throw Error('Patiëntenimport ontbreekt');
 const ids=new Set(),urls=new Set();
 const rows=payload.records.map(r=>{
  if(!hosts[r.collection]||!r.id?.startsWith('patient-'+r.collection+'-')||ids.has(r.id)||!r.title||!Array.isArray(r.keywords)||!r.keywords.every(k=>typeof k==='string')||!Array.isArray(r.variants)||!r.variants.length)throw Error('Ongeldige patiëntenmetadata');
  if(r.checked_at!==null||r.published_at!==null||r.validity_assessed_at!==null)throw Error('Niet gecontroleerde brondatum');
  if(r.url){const u=new URL(r.url);if(r.link_review||u.protocol!=='https:'||u.username||u.password||!hosts[r.collection].includes(u.hostname)||urls.has(r.collection+'|'+r.url))throw Error('Onveilige of dubbele patiëntenlink');urls.add(r.collection+'|'+r.url);}else if(!r.link_review)throw Error('Ontbrekende linkstatus');
  ids.add(r.id);
  return {...r,patientImport:true,demo:false,contentType:'patient',audience:'patient',kind:'Patiënteninformatie',layer:'patient',owner:PATIENT_COLLECTIONS[r.collection],specialties:r.collection==='kno-patient'?['kno']:[],topics:[],tasks:[],version:'Aangeleverde export '+r.export_date,description:'Patiënteninformatie uit de aangeleverde broninventaris. Open de oorspronkelijke bron voor de inhoud. Actualiteit en bereikbaarheid niet opnieuw vastgesteld.',source_file:payload.sources.find(s=>s.collection===r.collection)?.file};
 });
 for(const s of payload.sources){const subset=rows.filter(r=>r.collection===s.collection);if(subset.length!==s.cards||subset.reduce((n,r)=>n+r.variants.length,0)!==s.rows||s.rows-s.cards!==s.merged)throw Error('Importaantallen sluiten niet aan');}
 return rows;
}

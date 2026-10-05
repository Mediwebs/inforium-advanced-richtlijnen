// Index update dates are not validity assessments.
export function decodePznl(rows){
 if(!Array.isArray(rows)||!rows.length)throw Error('PZNL-catalogus ontbreekt');
 const ids=new Set(),urls=new Set();
 return rows.map(r=>{
  const url=new URL(r.url);
  if(url.protocol!=='https:'||!['palliaweb.nl','overpalliatievezorg.nl'].includes(url.hostname)||url.username||url.password||url.search||url.hash)throw Error('Onveilige PZNL-bron');
  if(!r.id?.startsWith('pznl-')||ids.has(r.id)||urls.has(r.url)||!r.title||!['palliaweb','pznl-patient'].includes(r.collection)||!/^\d{4}-\d{2}-\d{2}$/.test(r.checked_at))throw Error('Ongeldige PZNL-metadata');
  if(r.published_at!==null||r.validity_assessed_at!==null)throw Error('Niet gecontroleerde publicatie- of geldigheidsdatum');
  const provenance=new URL(r.provenance_url);if(provenance.protocol!=='https:'||!['palliaweb.nl','overpalliatievezorg.nl'].includes(provenance.hostname)||provenance.username||provenance.password)throw Error('Onveilige herkomstlink');
  if(r.index_updated_at!==null&&!/^\d{4}-\d{2}-\d{2}$/.test(r.index_updated_at))throw Error('Ongeldige overzichtsdatum');
  ids.add(r.id);urls.add(r.url);
  return {...r,pznl:true,demo:false,layer:r.audience==='patient'?'patient':'pznl',specialties:[],topics:[],tasks:[],keywords:['palliatieve zorg',...(r.index_category?[r.index_category]:[])],owner:r.audience==='patient'?'PZNL · Overpalliatievezorg':'PZNL · Palliaweb / Pallialine',description:r.audience==='patient'?'Ingang voor patiënten en naasten. Open de oorspronkelijke website voor de informatie.':'Bronverwijzing voor professionals. Lees de volledige inhoud en voorwaarden bij de bron.'};
 });
}

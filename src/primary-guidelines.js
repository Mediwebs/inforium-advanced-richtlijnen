const nhgKinds={standaarden:'NHG-Standaard',behandelrichtlijnen:'NHG-Behandelrichtlijn','medisch-inhoudelijke-nhg-standpunten':'NHG-Standpunt','landelijke-eerstelijns-samenwerkingsafspraken':'LESA','landelijke-transmurale-afspraken':'LTA','multidisciplinaire-richtlijnen':'Multidisciplinaire richtlijn via NHG','praktijkorganisatorische-richtlijnen':'Praktijkorganisatorische richtlijn','nhg-zelfzorgadvies':'NHG-Zelfzorgadvies'};
const origins={nhg:'https://richtlijnen.nhg.org',ncj:'https://www.jgzrichtlijnen.nl'};
export function decodePrimaryGuidelines(rows){
 if(!Array.isArray(rows)||!rows.length)throw Error('Richtlijnencatalogus ontbreekt');
 const ids=new Set(),urls=new Set();
 return rows.map(r=>{
  if(!origins[r.collection])throw Error('Onbekende broncollectie');
  const url=new URL(r.url),provenance=new URL(r.provenance_url);
  if([url,provenance].some(u=>u.origin!==origins[r.collection]||u.username||u.password||u.search||u.hash))throw Error('Onveilige bronlink');
  const parts=url.pathname.split('/').filter(Boolean);
  if(parts.length!==2||(r.collection==='nhg'?nhgKinds[parts[0]]!==r.kind:parts[0]!=='richtlijn'||r.kind!=='JGZ-richtlijn'))throw Error('Onbekend richtlijntype');
  if(typeof r.id!=='string'||!r.id.startsWith(r.collection+'-')||ids.has(r.id)||urls.has(r.url)||typeof r.title!=='string'||!r.title.trim()||!/^\d{4}-\d{2}-\d{2}$/.test(r.checked_at))throw Error('Ongeldige richtlijnmetadata');
  if(r.published_at!==null||r.validity_assessed_at!==null||r.index_updated_at!==null)throw Error('Niet gecontroleerde inhoudsdatum');
  ids.add(r.id);urls.add(r.url);
  return {...r,primaryGuideline:true,demo:false,layer:r.collection,contentType:'knowledge',audience:'professional',specialties:[],topics:[],tasks:[],keywords:r.collection==='nhg'?['huisarts','huisartsgeneeskunde']:['jeugdgezondheidszorg','JGZ','NCJ'],owner:r.collection==='nhg'?'NHG · Nederlands Huisartsen Genootschap':'JGZ-richtlijnen · NCJ (regie)',version:'Overzicht geraadpleegd '+r.checked_at,description:'Titel en bronlink uit het officiële overzicht. Open de oorspronkelijke bron voor de volledige inhoud en actuele status.'};
 });
}

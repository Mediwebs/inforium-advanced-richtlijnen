export const groningenKinds={patient:'Patiënteninformatie',standard:'Standaardbeleid UMCG',study:'Studie',document:'Document',overview:'Tumoroverzicht',practical:'Praktische informatie',page:'Webpagina',tool:'Extern hulpmiddel',news:'Nieuws'};
export function decodeGroningen(payload){
 const s=payload.s;
 if(!Array.isArray(s)||!s.every(v=>typeof v==='string')||!Array.isArray(payload.r)||!Array.isArray(payload.c))throw new Error('Ongeldige inventaris');
 const str=i=>{if(!Number.isInteger(i)||i<0||i>=s.length)throw new Error('Ongeldige tekstverwijzing');return s[i];};
 const contexts=payload.c.map(list=>list.map(c=>({group:str(c[0]),pathology:str(c[1]),path:str(c[2]),phase:str(c[3]),status:str(c[4])})));
 return payload.r.map((r,i)=>{
 const raw=str(r[1]),url=new URL(raw,'https://medischeoncologiegroningen.nl');
 if(!['http:','https:'].includes(url.protocol)||url.username||url.password)throw new Error('Onveilige bronlink');
 if(!contexts[r[9]]||r[10].some(id=>!Number.isInteger(id)||id<0||id>=payload.r.length))throw new Error('Ongeldige bronrelatie');
 const kind=str(r[2]);if(!groningenKinds[kind])throw new Error('Onbekende categorie');
 return {id:'groningen-'+i,title:str(r[0]),url:url.href,kind,audience:str(r[3]),locked:!!(r[4]&1),external:!!(r[4]&2),linked:!!(r[4]&4),status:str(r[5]),code:str(r[6]),sourceVersion:str(r[7]),modified:str(r[8]),contexts:contexts[r[9]],related:r[10].map(id=>'groningen-'+id),themes:r[11].map(str),filetype:str(r[12]),phases:r[13].map(str),
 groningen:true,specialties:['oncologie'],topics:[],tasks:[],layer:'groningen',demo:false,owner:'Inventaris Medische Oncologie Groningen',version:'Inventaris 03-10-2026',description:groningenKinds[kind]+' · '+((r[4]&1)?'Alleen metadata; inloggen kan nodig zijn.':'Bronverwijzing; lees de inhoud bij de oorspronkelijke bron.')};
 });
}
export function filterGroningen(records,filters){
 return records.filter(r=>(!filters.audience||r.audience===filters.audience)&&(!filters.kind||r.kind===filters.kind)&&
 ((!filters.group&&!filters.path)||r.contexts.some(c=>(!filters.group||c.group===filters.group)&&(!filters.path||c.path===filters.path))));
}

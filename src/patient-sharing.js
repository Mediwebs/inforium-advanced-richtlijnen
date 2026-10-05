import {icon} from './icons.js';
import qrcode from './vendor/qrcode.js';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function patientLink(r){
 if(!r||r.demo||r.link_review||(r.contentType!=='patient'&&r.audience!=='patient'))return null;
 try{const u=new URL(r.url||r.source?.url);return u.protocol==='https:'&&!u.username&&!u.password?u.href:null;}catch{return null;}
}
export function patientActions(r){
 if(!patientLink(r))return '';
 return '<div class="patient-actions" role="group" aria-label="Patiënteninformatie delen: '+esc(r.title)+'">'+[['send','send','Verzenden met Inforium'],['qr','qr','QR-code'],['copy','copy','Link kopiëren']].map(([action,i,label])=>'<button type="button" data-patient-action="'+action+'" data-resource="'+esc(r.id)+'">'+icon(i)+label+'</button>').join('')+'</div>';
}
export function qrSvg(url){
 const qr=qrcode(0,'M');qr.addData(new URL(url).href);qr.make();return qr.createSvgTag({cellSize:6,margin:24,scalable:true});
}
export function sharingDialog(r,mode){
 const url=patientLink(r);if(!url)return '';
 return '<div class="dialog-top"><span class="badge">Patiënteninformatie</span><button data-close>Sluiten ✕</button></div><h2 id="detail-title">'+(mode==='qr'?'Scan de bronlink':mode==='send'?'Verzenden met Inforium':'Link kopiëren')+'</h2><p>'+esc(r.title)+'</p>'+(mode==='qr'?'<div class="patient-qr" role="img" aria-label="QR-code naar '+esc(r.title)+'">'+qrSvg(url)+'</div><p>Scan met de camera van een telefoon om de oorspronkelijke bron te openen.</p>':mode==='send'?'<div class="notice">De Inforium-verzendkoppeling is nog niet ingesteld. Er is niets verzonden. Kopieer de link om deze in je bestaande Inforium-omgeving te gebruiken.</div>':'<p>Automatisch kopiëren is niet beschikbaar. Selecteer en kopieer de link hieronder.</p>')+'<label class="share-link-label">Bronlink<input id="patient-share-link" readonly value="'+esc(url)+'"></label><div class="actions"><button data-patient-action="copy" data-resource="'+esc(r.id)+'">'+icon('copy')+'Link kopiëren</button></div>';
}

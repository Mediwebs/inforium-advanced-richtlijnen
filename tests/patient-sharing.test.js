import test from 'node:test';
import assert from 'node:assert/strict';
import {patientLink,patientActions,qrSvg,sharingDialog} from '../src/patient-sharing.js';
const r={id:'test',title:'Patiënteninformatie',audience:'patient',url:'https://example.org/één folder?q=zorg#informatie'};
test('sharing exposes only valid patient source links and encodes the original destination',()=>{
 assert.equal(patientLink(r),'https://example.org/%C3%A9%C3%A9n%20folder?q=zorg#informatie');
 for(const change of [{demo:true},{link_review:'Controleren'},{audience:'professional'},{url:'javascript:alert(1)'},{url:'https://user:pass@example.org/'}])assert.equal(patientActions({...r,...change}),'');
 assert.equal((patientActions(r).match(/data-patient-action=/g)||[]).length,3);
 assert.match(qrSvg(patientLink(r)),/<svg/);
});
test('unconfigured Inforium action never claims that a message was sent',()=>{
 assert.match(sharingDialog(r,'send'),/Er is niets verzonden/);
 assert.ok(!sharingDialog(r,'send').includes('type="email"'));
 assert.equal(sharingDialog({...r,demo:true},'qr'),'');
});

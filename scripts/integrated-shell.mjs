import {icon} from '../src/icons.js';
export function integratedShell(compact){
 const nav=[['start','all','Start'],['zoeken','search','Alle informatie'],['patienten','patient','Patiënteninformatie'],['nieuws','news','Nieuws & inspiratie'],['board','bookmark','Mijn werkmap'],['modules','layers','Modules & bronnen']];
 return compact
 .replace('<body data-view="compact">','<body data-view="compact" data-experience="inforium">')
 .replace('</head>','<link rel="stylesheet" href="./src/integrated.css"></head>')
 .replace('<title>CHIPboard Compact · Inforium</title>','<title>Inforium Advanced × CHIPboard · Werkplek</title>')
 .replace(/<a class="brand"[\s\S]*?<\/a>/,'<a class="brand ia-brand" href="#start"><span class="ia-brandmark">i</span><span>Inforium<small>ADVANCED × CHIPBOARD</small></span></a>')
 .replace('KENNIS & SAMENWERKING','JOUW WERKPLEK')
 .replace(/<nav aria-label="Hoofdnavigatie">[\s\S]*?<\/nav>/,'<nav aria-label="Hoofdnavigatie">'+nav.map(([id,i,label])=>'<a href="#'+id+'" data-nav="'+id+'">'+icon(i)+'<span>'+label+'</span>'+(id==='board'?'<b id="board-count">0</b>':'')+'</a>').join('')+'</nav><div class="ia-sidebar-note"><strong>Kennis en informatie samen.</strong><p>Bewaar richtlijnen en patiëntenbronnen in één werkmap.</p><small>Prototype · geen patiëntgegevens</small></div>')
 .replace('COMPACT · PARALLEL','GEÏNTEGREERD PROTOTYPE')
 .replace(/<header class="topbar">[\s\S]*?<\/header>/,'<header class="topbar"><span><strong>Inforium werkplek</strong><small>Voor zorgprofessionals</small></span><div class="ia-version-links"><a href="./compact.html#zoeken">CHIPboard Compact ↗</a><a href="./index.html#zoeken">Uitgebreid ↗</a></div></header>')
 .replace('Zoek in CHIPboard-bronnen','Wat wil je vinden voor je zorgmoment?')
 .replace('Bijvoorbeeld borstkanker radiotherapie','Zoek richtlijnen, patiënteninformatie of nieuws')
 .replace('Inforium × CHIP · 2026','Inforium Advanced × CHIPboard · interfaceprototype');
}

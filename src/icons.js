// Local, decorative SVGs: labels remain the accessible names.
const paths={
 star:'<path d="m12 3 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z"/>',
 food:'<path d="M5 10h14a7 7 0 0 1-14 0ZM8 3v4M12 2v5M16 3v4M8 21h8"/>',
 health:'<rect x="4" y="3" width="16" height="18" rx="3"/><path d="M12 7v10M7 12h10"/>',
 shield:'<path d="m12 2 8 4v6q0 6-8 10-8-4-8-10V6zM8 12l3 3 5-6"/>',
 communication:'<path d="M3 4h18v13H9l-6 4zM7 8h10M7 12h7"/>',

 send:'<path d="m3 3 18 9-18 9 4-9-4-9ZM7 12h14"/>',
 copy:'<rect x="8" y="8" width="12" height="13" rx="2"/><path d="M15 8V3H3v13h5"/>',
 qr:'<path d="M3 3h6v6H3zM15 3h6v6h-6zM3 15h6v6H3zM15 15h3v3h3v3h-6zM12 3v3M12 9v3H9M3 12h3M12 18v3M21 12h-6v3"/>',
 all:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
 knowledge:'<path d="M12 5v16M3 3h5a4 4 0 0 1 4 2 4 4 0 0 1 4-2h5v16h-5a4 4 0 0 0-4 2 4 4 0 0 0-4-2H3z"/>',
 patient:'<circle cx="9" cy="7" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3M16 4a3 3 0 0 1 0 6M18 14a5 5 0 0 1 3 4v3"/>',
 news:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 8h4v4H7zM15 8h3M15 12h3M7 16h11"/>',
 search:'<circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/>',
 filter:'<path d="M3 5h18l-7 8v6l-4 2v-8z"/>',
 sort:'<path d="M8 3v18m-4-4 4 4 4-4M15 5h6M15 10h4M15 15h2"/>',
 info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7h.01"/>',
 bookmark:'<path d="M6 3h12v18l-6-4-6 4z"/>',
 check:'<path d="m5 12 4 4L20 5"/>',
 reset:'<path d="M3 10a9 9 0 1 1 2 8M3 4v6h6"/>',
 external:'<path d="M14 3h7v7m0-7L10 14M10 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5"/>',
 lock:'<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3"/>',
 layers:'<path d="m12 3 10 5-10 5L2 8zm-9 10 9 5 9-5M3 18l9 5 9-5"/>',
 left:'<path d="m14 5-7 7 7 7"/>',
 right:'<path d="m10 5 7 7-7 7"/>'
};
export function icon(name){return '<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">'+(paths[name]||paths.info)+'</svg>';}
export function decorateCompact(){
 const selectors={'#global-search button[type="submit"]':'search','#compact-sources-label':'layers','.compact-source-top':'external'};
 for(const [selector,name]of Object.entries(selectors)){
  document.querySelectorAll(selector).forEach(el=>{if(!el.querySelector('.ui-icon'))el.insertAdjacentHTML('afterbegin',icon(name));});
 }
}

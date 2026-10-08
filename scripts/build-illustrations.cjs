/* Build the inline BrandFlow illustration family. Run from the repository root:
   node scripts/build-illustrations.cjs
   Geometry stays vector-based; animation lives in css/illustrations.css. */
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const pages = {
 'services': ['stack', 'Connected by design', 'A layered platform connecting interfaces, applications and infrastructure.'],
 'full-stack-development': ['stack', 'Every layer, considered', 'Three dimensional application layers, from data to the user interface.'],
 'pricing-full-stack': ['stack', 'From foundation to interface', 'A complete application architecture with connected layers.'],
 'web-development': ['web', 'Designed to make an impression', 'A dimensional browser window and mobile screen on a shared platform.'],
 'pricing-web-development': ['web', 'Your next digital experience', 'A responsive website displayed across desktop and mobile interfaces.'],
 'ai-ml-engineering': ['ai', 'Intelligence, engineered', 'A neural processing core with connected data nodes and an orbital path.'],
 'pricing-ai-ml': ['ai', 'Make intelligence practical', 'Data connections converge on a dimensional AI processing core.'],
 'api-development': ['api', 'Built to connect', 'An API hub routes information between four connected systems.'],
 'pricing-api-development': ['api', 'One connected ecosystem', 'Four service nodes connect through a central integration platform.'],
 'process-automation': ['automation', 'Turn processes into progress', 'Three dimensional workflow stages connect a trigger, a process and a completed action.'],
 'pricing-process-automation': ['automation', 'Make work flow', 'A connected workflow moves from an input to processing and completion.'],
 'contact': ['contact', 'Great work starts with a conversation', 'A dimensional envelope, a message card and a reply bubble.'],
 'why-us': ['trust', 'Built on a stronger foundation', 'A dimensional shield with a checkmark stands on a stable layered foundation.'],
 'automation-advisor': ['advisor', 'Find your next opportunity', 'An analysis lens reveals opportunities in an ascending set of workflow blocks.']
};
const esc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;');
function scene(slug, type, title, description) {
 const id='bf-'+slug;
 const u=n=>`url(#${id}-${n})`;
 const prism=(x,y,w,d,h,tone='navy')=>`<g><path d="M${x-w} ${y+d-h}L${x} ${y+2*d-h}V${y+2*d}L${x-w} ${y+d}Z" fill="${tone==='white'?'#cbd5e1':tone==='orange'?'#c9510b':'#0f2744'}"/><path d="M${x} ${y+2*d-h}L${x+w} ${y+d-h}V${y+d}L${x} ${y+2*d}Z" fill="${tone==='white'?'#e2e8f0':tone==='orange'?'#ea580c':'#24476d'}"/><path d="M${x} ${y-h}L${x+w} ${y+d-h}L${x} ${y+2*d-h}L${x-w} ${y+d-h}Z" fill="${u(tone)}" stroke="${tone==='white'?'#dce4ed':tone==='orange'?'#fdba74':'#466583'}" stroke-width="1.3" stroke-linejoin="round"/></g>`;
 const float=(s,delay='')=>`<g class="bf-art-float${delay?' bf-art-float--'+delay:''}">${s}</g>`;
 const circuit=d=>`<path d="${d}" fill="none" stroke="#e2e8f0" stroke-width="3"/><path class="bf-art-signal" d="${d}" fill="none" stroke="#f97316" stroke-width="2" stroke-linecap="round" stroke-dasharray="5 20 2 100"/>`;
 const label=(x,y,s)=>`<text x="${x}" y="${y}" font-size="10" font-family="Inter,Arial,sans-serif" font-weight="600" letter-spacing="1.2" fill="#64748b" text-anchor="middle">${esc(s)}</text>`;
 const badge=(x,y,s)=>`<g transform="translate(${x} ${y})"><rect width="100" height="30" rx="8" fill="#fff" stroke="#e2e8f0"/><circle cx="14" cy="15" r="3" fill="#f97316"/><text x="25" y="19" font-family="Inter,Arial,sans-serif" font-size="10" fill="#1e3a5f">${s}</text></g>`;
 const tick=(x,y)=>`<path d="M${x-10} ${y}l7 7 16-18" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`;
 let art='';
 if(type==='stack'){
  art=prism(300,226,153,55,15,'navy')+float(prism(300,166,153,55,14,'white')+`<path d="M196 207l70 25 52-19 86 30" fill="none" stroke="#f97316" stroke-width="3" stroke-linecap="round"/>`,'slow')+float(prism(300,101,153,55,16,'navy')+`<g transform="matrix(1 .36 -1 .36 300 110)"><rect x="-66" y="-52" width="132" height="104" rx="13" fill="${u('orange')}" stroke="#fdba74"/><path d="M-25-18l-19 18 19 18M25-18L44 0 25 18M10-26L-9 26" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></g>`)+`<g stroke="#cbd5e1" stroke-dasharray="3 6"><path d="M147 163v123M453 163v123M300 218v126"/></g>`+float(badge(397,101,'Application'),'late')+badge(94,303,'Infrastructure');
 }
 if(type==='web'){
  art=float(`<g transform="matrix(.96 .13 -.18 .96 159 62)"><rect x="7" y="9" width="280" height="210" rx="14" fill="#0f2744"/><rect width="280" height="210" rx="14" fill="${u('white')}" stroke="#bcccdc"/><path d="M0 14Q0 0 14 0H266Q280 0 280 14V34H0Z" fill="#1e3a5f"/><g fill="#f97316"><circle cx="17" cy="17" r="3"/><circle cx="29" cy="17" r="3" opacity=".6"/><circle cx="41" cy="17" r="3" opacity=".3"/></g><rect x="77" y="12" width="123" height="10" rx="5" fill="#ffffff20"/><rect x="20" y="55" width="116" height="9" rx="4" fill="#1e3a5f"/><rect x="20" y="73" width="88" height="7" rx="3" fill="#cbd5e1"/><rect x="20" y="90" width="101" height="7" rx="3" fill="#e2e8f0"/><rect x="20" y="113" width="72" height="22" rx="5" fill="${u('orange')}"/><rect x="155" y="53" width="106" height="88" rx="10" fill="#fff7ed"/><path d="M177 119l21-45 17 25 20-12 13 32Z" fill="${u('orange')}"/><circle cx="238" cy="70" r="8" fill="#1e3a5f"/><rect x="20" y="156" width="73" height="33" rx="6" fill="#e2e8f0"/><rect x="103" y="156" width="73" height="33" rx="6" fill="#e2e8f0"/><rect x="186" y="156" width="73" height="33" rx="6" fill="#e2e8f0"/></g>`)+float(`<g transform="translate(398 203) rotate(9)"><rect x="5" y="5" width="75" height="133" rx="14" fill="#0f2744"/><rect width="75" height="133" rx="14" fill="#1e3a5f" stroke="#4b6b89"/><rect x="6" y="8" width="63" height="117" rx="10" fill="#fff"/><rect x="25" y="11" width="25" height="4" rx="2" fill="#1e3a5f"/><rect x="13" y="30" width="49" height="46" rx="5" fill="${u('orange')}"/><path d="M14 88h44M14 98h34" stroke="#cbd5e1" stroke-width="5" stroke-linecap="round"/><rect x="14" y="109" width="31" height="8" rx="3" fill="#1e3a5f"/></g>`,'late')+badge(91,304,'Responsive');
 }
 if(type==='ai'){
  art=`<g opacity=".7">${circuit('M105 272L213 222 388 292 493 239')}</g>`+prism(300,215,125,48,20,'navy')+float(prism(300,158,93,40,48,'orange')+`<g transform="matrix(1 .43 -1 .43 300 136)"><rect x="-42" y="-42" width="84" height="84" rx="12" fill="#fff7ed"/><g stroke="#f97316" stroke-width="2"><path d="M-25-20L0-8 24-24M0-8L-22 22M0-8L25 21M-22 22L25 21"/></g><g fill="#1e3a5f"><circle cx="-25" cy="-20" r="6"/><circle cy="-8" r="8"/><circle cx="24" cy="-24" r="6"/><circle cx="-22" cy="22" r="6"/><circle cx="25" cy="21" r="6"/></g></g>`)+`<ellipse cx="300" cy="204" rx="183" ry="69" transform="rotate(-26 300 204)" fill="none" stroke="#cbd5e1"/><ellipse class="bf-art-signal" cx="300" cy="204" rx="183" ry="69" transform="rotate(-26 300 204)" fill="none" stroke="#f97316" stroke-width="3" stroke-dasharray="30 700"/>`+float(`<circle cx="155" cy="265" r="16" fill="${u('orange')}"/><circle cx="430" cy="125" r="11" fill="${u('navy')}"/>`,'late')+badge(374,315,'Inference')+label(209,112,'DATA → DECISIONS');
 }
 if(type==='api'){
  art=circuit('M156 167L300 236 442 169M151 307L300 236 442 307')+prism(300,202,81,35,32,'navy')+float(`<g transform="translate(260 163)"><rect width="80" height="64" rx="15" fill="${u('white')}" stroke="#cbd5e1"/><path d="M25 21L13 32 25 43M55 21L67 32 55 43M45 18L35 46" stroke="#f97316" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>`)+float(prism(150,117,49,22,33,'white')+`<path d="M137 124h26M137 131h20" stroke="#1e3a5f" stroke-width="3" stroke-linecap="round"/>`,'slow')+float(prism(447,117,49,22,33,'orange'),'late')+prism(150,265,49,22,30,'navy')+prism(447,265,49,22,30,'white')+label(150,199,'APPLICATIONS')+label(447,199,'SERVICES')+label(150,348,'DATA')+label(447,348,'PLATFORMS');
 }
 if(type==='automation'){
  art=circuit('M147 243L267 295 450 211')+prism(147,181,62,28,38,'white')+float(prism(298,224,74,31,54,'navy')+`<g transform="translate(298 216)"><circle r="21" fill="#fff"/><path d="M0-12L-7 2H2L-3 13 10-3H2L7-12Z" fill="#f97316"/></g>`)+float(prism(450,150,62,28,53,'orange')+tick(450,146),'late')+label(147,291,'01 / TRIGGER')+label(298,337,'02 / PROCESS')+label(450,262,'03 / COMPLETE')+badge(223,97,'Work in flow');
 }
 if(type==='contact'){
  art=float(`<g transform="translate(184 126) rotate(-8 120 80)"><rect x="9" y="12" width="239" height="156" rx="16" fill="#0f2744"/><rect width="239" height="156" rx="16" fill="${u('navy')}" stroke="#537696"/><path d="M5 145l104-80q11-8 22 0l103 80" fill="#2d4a6f" stroke="#537696"/><path d="M4 8l105 83q11 9 22 0L234 8" fill="${u('orange')}" stroke="#fdba74"/><rect x="26" y="-51" width="187" height="70" rx="12" fill="${u('white')}" stroke="#cbd5e1"/><path d="M46-27h141M46-10h89" stroke="#cbd5e1" stroke-width="6" stroke-linecap="round"/></g>`)+float(`<g transform="translate(411 242)"><path d="M0 0h79q12 0 12 12v34q0 12-12 12H28L9 76V58H0q-12 0-12-12V12Q-12 0 0 0Z" fill="${u('white')}" stroke="#cbd5e1"/><g fill="#f97316"><circle cx="16" cy="29" r="4"/><circle cx="36" cy="29" r="4"/><circle cx="56" cy="29" r="4"/></g></g>`,'late')+badge(96,305,'Let’s talk');
 }
 if(type==='trust'){
  art=prism(300,230,127,45,19,'navy')+float(`<g transform="translate(233 84)"><path d="M11 16l63-19 63 19v93q0 46-63 81-63-35-63-81Z" fill="#0f2744"/><path d="M0 8L63-11 126 8v93q0 46-63 81Q0 147 0 101Z" fill="${u('navy')}" stroke="#507391" stroke-width="2"/><path d="M16 20L63 6 110 20v80q0 34-47 63-47-29-47-63Z" fill="none" stroke="#f97316" stroke-width="2"/><circle cx="63" cy="78" r="28" fill="${u('orange')}"/>${tick(63,80)}</g>`)+float(badge(386,175,'Built with care'),'late')+`<path d="M133 274l24 12M448 274l24-12" stroke="#f97316" stroke-width="3" stroke-linecap="round"/>`;
 }
 if(type==='advisor'){
  art=prism(212,258,44,20,37,'white')+prism(300,227,44,20,60,'navy')+prism(388,196,44,20,87,'orange')+float(`<g transform="translate(291 166) rotate(-24)"><path d="M40 45l54 64" stroke="#0f2744" stroke-width="22" stroke-linecap="round"/><path d="M39 43l48 59" stroke="#2d4a6f" stroke-width="13" stroke-linecap="round"/><circle r="69" fill="#ffffffa8" stroke="#1e3a5f" stroke-width="13"/><circle r="58" fill="none" stroke="#94a3b8" stroke-width="2"/><path d="M-38-23a45 45 0 0 1 52-19" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round"/><path d="M-27 16l19-22 17 9 21-30" fill="none" stroke="#f97316" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></g>`)+badge(391,314,'Opportunity');
 }
 return `<figure class="bf-art" data-art="${type}" data-motion="paused"><div class="bf-art-stage"><svg class="bf-illustration" viewBox="0 0 600 450" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="${id}-title ${id}-desc"><title id="${id}-title">${esc(title)}</title><desc id="${id}-desc">${esc(description)}</desc><defs><linearGradient id="${id}-navy" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#355b80"/><stop offset="1" stop-color="#1e3a5f"/></linearGradient><linearGradient id="${id}-orange" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ffac58"/><stop offset=".55" stop-color="#f97316"/><stop offset="1" stop-color="#ea580c"/></linearGradient><linearGradient id="${id}-white" x1="0" y1="0" x2=".8" y2="1"><stop stop-color="#fff"/><stop offset="1" stop-color="#eef3f8"/></linearGradient><radialGradient id="${id}-halo"><stop stop-color="#ffedd5" stop-opacity=".7"/><stop offset="1" stop-color="#fff7ed" stop-opacity="0"/></radialGradient><radialGradient id="${id}-shadow"><stop stop-color="#1e3a5f" stop-opacity=".15"/><stop offset="1" stop-color="#1e3a5f" stop-opacity="0"/></radialGradient><pattern id="${id}-grid" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".8" fill="#cbd5e1"/></pattern></defs><ellipse cx="315" cy="220" rx="258" ry="204" fill="${u('halo')}"/><path d="M300 68L564 225 300 409 36 225Z" fill="${u('grid')}" opacity=".55"/><ellipse cx="302" cy="386" rx="228" ry="32" fill="${u('shadow')}"/>${prism(300,251,222,74,15,'white')}<path d="M79 310l220 74 223-74" stroke="#fff" stroke-width="2" fill="none"/>${art}<circle cx="88" cy="175" r="4" fill="#f97316" opacity=".6"/><circle cx="505" cy="100" r="3" fill="#cbd5e1"/></svg></div><figcaption><span>${esc(title)}</span><button class="bf-motion-toggle" type="button" aria-label="Pause illustration animation" aria-pressed="false" hidden>Pause motion</button></figcaption></figure>`;
}
for(const [slug,[type,title,description]] of Object.entries(pages)){
 const file=path.join(root,slug+'.html');let html=fs.readFileSync(file,'utf8');
 const next=scene(slug,type,title,description);
 html=html.replace(/(<div class="page-hero__svg-container") aria-hidden="true"/g,'$1');
 if(html.includes('<figure class="bf-art"'))html=html.replace(/<figure class="bf-art"[\s\S]*?<\/figure>/,next);
 else html=html.replace(/<svg class="page-hero__svg"[\s\S]*?<\/svg>/,next);
 if(!html.includes('css/illustrations.css'))html=html.replace('</head>','    <link rel="stylesheet" href="css/illustrations.css">\n</head>');
 if(!html.includes('js/illustrations.js'))html=html.replace('</body>','    <script src="js/illustrations.js" defer></script>\n</body>');
 fs.writeFileSync(file,html);
}
console.log('Built 14 accessible dimensional hero illustrations across 8 scene families.');

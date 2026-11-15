/* Load section styles in a fixed cascade order; keep inactive sheets disabled. */
function syncRouteStyles(route) {
 const study=['courses','programme','planner','path','tutor','advisor','dashboard','certificate-lesson','certificate-enrol','certificate-enrolled','learning-path','enrolled-lesson','degree-workspace','social-assessment','social-quiz','social-certificate'];
 const admission=['apply','payment','welcome','dashboard','degree-workspace','community'];
 const active={home:!route||route==='home',admissions:admission.includes(route),research:route&&route.startsWith('research'),study:study.includes(route)};
 // Unknown routes render the homepage in the existing router.
 if(!active.home&&!active.admissions&&!active.research&&!active.study&&!['about'].includes(route))active.home=true;
 for(const name of ['home','admissions','research','study']) {
  let link=document.getElementById('section-style-'+name);
  if(!link){link=document.createElement('link');link.id='section-style-'+name;link.rel='stylesheet';link.disabled=true;document.head.appendChild(link);}
  if(active[name]&&!link.hasAttribute('href'))link.href=name+'.css?v=20261007';
  link.disabled=!active[name];
 }
}
try { syncRouteStyles(JSON.parse(localStorage.getItem('ldc-state')||'{}').route); } catch(e) { syncRouteStyles('home'); }

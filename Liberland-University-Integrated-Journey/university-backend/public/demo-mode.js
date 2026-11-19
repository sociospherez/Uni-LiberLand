(() => {
 fetch('/api/config').then(r=>r.ok?r.json():null).then(config=>{
  if(!config?.demoMode)return;
  const banner=document.createElement('aside');banner.className='campus-demo-banner';banner.setAttribute('aria-label','Demonstration mode');
  const text=document.createElement('span');text.textContent='DEMO MODE · Separate demo records';
  const link=document.createElement('a');link.href='/portal.html?tab=login';link.textContent='Open staff demo';banner.append(text,link);document.body.append(banner);
 }).catch(()=>{});
})();

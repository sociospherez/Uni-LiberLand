(function(){
  const root=document.documentElement;
  const storageKey='ldcTheme';
  root.dataset.themeEngine='ldds-2';
  const media=window.matchMedia('(prefers-color-scheme: dark)');

  function preferred(){
    const saved=localStorage.getItem(storageKey);
    return saved==='light'||saved==='dark' ? saved : (media.matches?'dark':'light');
  }

  function apply(theme, persist){
    root.dataset.theme=theme;
    root.style.colorScheme=theme;
    if(persist) localStorage.setItem(storageKey,theme);
    document.querySelectorAll('[data-theme-toggle]').forEach(btn=>{
      const dark=theme==='dark';
      btn.classList.add('theme-toggle--switch');
      btn.setAttribute('role','switch');
      btn.removeAttribute('aria-pressed');
      btn.setAttribute('aria-checked',String(dark));
      btn.setAttribute('aria-label','Dark appearance');
      btn.setAttribute('title',dark?'Switch to light appearance':'Switch to dark appearance');
      if(!btn.querySelector('.theme-toggle__track')) btn.innerHTML='<span class="theme-toggle__track" aria-hidden="true"><span class="theme-toggle__icon"></span></span><span class="theme-toggle__label"></span>';
      const icon=btn.querySelector('.theme-toggle__icon');
      const label=btn.querySelector('.theme-toggle__label');
      if(icon) icon.innerHTML=dark
        ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.9 13.1A9 9 0 0 1 10.9 3.1a9 9 0 1 0 10 10Z"/></svg>'
        : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
      if(label) label.textContent=dark?'Dark':'Light';
    });
  }

  function bind(){
    apply(preferred(),false);
    document.querySelectorAll('[data-theme-toggle]').forEach(btn=>{
      if(btn.dataset.themeBound==='true') return;
      btn.dataset.themeBound='true';
      btn.addEventListener('click',()=>{
        const next=root.dataset.theme==='dark'?'light':'dark';
        apply(next,true);
        window.dispatchEvent(new CustomEvent('ldcthemechange',{detail:{theme:next}}));
      });
    });
  }

  media.addEventListener?.('change',()=>{
    if(!localStorage.getItem(storageKey)) apply(media.matches?'dark':'light',false);
  });

  window.LDCTheme={apply,bind,get:()=>root.dataset.theme||preferred()};
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',bind);
  else bind();
})();

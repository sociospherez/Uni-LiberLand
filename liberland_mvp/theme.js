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
      btn.setAttribute('aria-pressed',String(dark));
      btn.setAttribute('aria-label',dark?'Switch to day theme':'Switch to night theme');
      btn.setAttribute('title',dark?'Switch to day theme':'Switch to night theme');
      const icon=btn.querySelector('.theme-toggle__icon');
      const label=btn.querySelector('.theme-toggle__label');
      if(icon) icon.textContent=dark?'🔆':'🌙';
      if(label) label.textContent=dark?'Day':'Night';
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

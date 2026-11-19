(() => {
 const root = document.documentElement;
 const media = matchMedia('(prefers-color-scheme: dark)');
 let saved; try { saved = localStorage.getItem('ldcTheme'); } catch {}
 function apply(dark) {
  root.dataset.theme = dark ? 'dark' : 'light';
  document.getElementById('appearance').setAttribute('aria-checked', String(dark));
  document.getElementById('appearanceLabel').textContent = dark ? 'Dark' : 'Light';
 }
 apply(saved === 'dark' || (saved !== 'light' && media.matches));
 document.getElementById('appearance').addEventListener('click', () => {
  const dark = root.dataset.theme !== 'dark'; apply(dark);
  saved = dark ? 'dark' : 'light'; try { localStorage.setItem('ldcTheme', saved); } catch {}
 });
 media.addEventListener('change', () => { if (!saved) apply(media.matches); });
 fetch('/api/me', {credentials:'same-origin'}).then(r => r.ok ? r.json() : null).then(data => {
  const user = data?.user; if (!user) return;
  const a = document.getElementById('accountLink');
  a.textContent = 'Signed in · ' + user.name; a.href = 'portal.html'; a.title = a.textContent;
 }).catch(() => {});
})();

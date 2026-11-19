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
  const form = document.getElementById('recognitionEnquiry');
  form.elements.name.value = user.name; form.elements.email.value = user.email;
  a.textContent = 'Signed in · ' + user.name; a.href = 'portal.html'; a.title = a.textContent;
 }).catch(() => {});
})();

(() => {
 const form = document.getElementById('recognitionEnquiry');
 const result = document.getElementById('enquiryResult');
 form.addEventListener('submit', async event => {
  event.preventDefault(); const button = form.querySelector('[type=submit]');
  button.disabled = true; result.textContent = 'Saving your enquiry…'; delete result.dataset.error;
  const values = Object.fromEntries(new FormData(form));
  try {
   const response = await fetch('/api/enquiries', {method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify({
    name:values.name,email:values.email,website:values.website,course:'',
    subject:'Honorary Recognition · ' + values.kind + ' · ' + values.recognition,
    message:'Request: ' + values.kind + '\nRecognition of interest: ' + values.recognition + '\n\n' + values.message
   })});
   const data = await response.json(); if (!response.ok) throw Error(data.error || 'Unable to save your enquiry. Please try again.');
   result.textContent = 'Thank you. Your enquiry has been saved for staff review. Reference: ' + data.id + '. This is an initial conversation and does not guarantee an award. Email notifications are preview-only in this sandbox.';
   form.reset();
  } catch (err) { result.dataset.error = 'true'; result.textContent = err.message || 'Unable to save your enquiry. Please try again.'; }
  finally {button.disabled = false;}
 });
})();

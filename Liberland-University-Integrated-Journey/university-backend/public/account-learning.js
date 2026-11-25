// Adapter between the approved lesson demonstrator and the account API.
// Server timestamps, approvals, quiz results and sample award IDs are authoritative.
(async()=>{
 if(location.protocol==='file:'){document.getElementById('app').innerHTML='<section class="page"><h1>Start the student backend.</h1><p>Open this campus using the address printed by npm start. Account-based learning needs the server.</p></section>';return;}
 let user=null,revision={},pending=0,blocked=false,chain=Promise.resolve();
 const portal=()=>{location.href='/portal.html';};
 async function request(url,method='GET',body){const r=await fetch('/api'+url,{method,headers:body?{'Content-Type':'application/json'}:{},body:body?JSON.stringify(body):undefined});const data=await r.json();if(!r.ok)throw Error(data.error||'Unable to save.');return data;}
 function status(message,error=false){let el=document.getElementById('account-save-status');if(!el){el=document.createElement('div');el.id='account-save-status';el.setAttribute('role','status');document.body.appendChild(el);}el.textContent=message;el.style.background=error?'#842d29':'#1b3026';}
 function enqueue(slug,action,payload){pending++;status('Saving to your account…');chain=chain.then(async()=>{if(blocked)throw Error('Saving is paused. Reload this page before continuing.');const data=await request('/learning/'+slug+(action?'/'+action:''),'PUT',{...payload,revision:revision[slug]||0});revision[slug]=data.revision;return data;}).catch(err=>{blocked=true;status(err.message+' Your latest changes have not been saved. Copy any written work before reloading.',true);throw err;}).finally(()=>{pending--;if(!pending&&!blocked)status('Saved to your account.');});chain.catch(()=>{});return chain;}
 function snapshotSocial(){return {activities:[...socialProgress.activities],project:{...socialProgress.project},checks:[...socialProgress.checks],projectSubmitted:socialProgress.projectSubmitted,answers:[...socialProgress.answers]};}
 function hydrateSocial(s){Object.assign(socialProgress,freshSocialProgress(),s||{});}
 function clearLocalWork(){learningStore.enrolments={};learningStore.lastCourse=null;hydrateSocial();}
 clearLocalWork();
 persistLearning=function(){if(!user)return false;const slug=learningStore.lastCourse,r=learningStore.enrolments[slug],id=r?.activeLesson,p=r?.lessons?.[id];if(p)enqueue(slug,'',{lesson:id,step:p.step,answer:p.answer});return !blocked;};
 saveSocial=function(){if(!user)return false;if(socialProgress.award)return true;enqueue('social-media','assessment',snapshotSocial());return !blocked;};
 learningNotice=function(){return '<p class="ml-storage">'+(user?'Signed in as '+escapeHtml(user.name)+' · Active enrolment · Progress saved to your account.':'Sign in to request enrolment and save your progress.')+'</p>';};
 socialNote=function(){return '<p class="ml-storage" id="social-save">Self-paced · 24 hours is an indicative estimate · Account-based saving.</p>';};
 socialSaveFeedback=function(){const el=document.getElementById('social-save');if(el)el.textContent=blocked?'Saving paused — check the message below.':'Changes queued for account saving.';const r=socialRequirements();document.querySelectorAll('[data-social-requirement]').forEach(el=>{const ok=r[el.dataset.socialRequirement];el.querySelector('span').textContent=ok?'✓':'○';el.querySelector('strong').textContent=ok?'Done':'To do';});const b=document.getElementById('social-award-action');if(b)b.disabled=!socialEligible();};
 enrolDemo=slug=>{location.href='/portal.html?course='+encodeURIComponent(slug);};renderEnrolment=()=>enrolDemo(currentCourse().certificate?.slug||'');renderEnrolled=portal;renderMyLearning=portal;renderDashboard=portal;
 renderApply=function(){if(currentCourse().certificate)return enrolDemo(currentCourse().certificate.slug);page('<div class="cert-shell"><p class="cert-kicker">Admissions</p><h1>Start with your student account.</h1><p>Certificate enrolments are managed in the student space. For degree programme questions, send an enquiry. Degree applications and payments are not connected in this first release.</p><a class="btn btn-primary" href="/portal.html">Open student space</a> <a class="btn btn-secondary" href="/portal.html?tab=enquiries">Ask admissions</a></div>');};
 renderPayment=renderApply;renderWelcome=portal;
 enrolmentAction=c=>enrolled(c)?`<button class="btn btn-primary" onclick="openLearningPath('${c.slug}')">Open my learning path →</button>`:`<a class="btn btn-primary" href="/portal.html?course=${encodeURIComponent(c.slug)}">Enrol on this course →</a>`;
 submitSocialQuiz=async function(){try{if(!requireSocialEnrolment()||socialProgress.answers.some(a=>a===null))return;const button=document.getElementById('social-submit-quiz');if(button)button.disabled=true;const data=await enqueue('social-media','quiz',{answers:[...socialProgress.answers]});hydrateSocial(data.social);renderSocialQuiz();}catch{}};
 const originalRetry=retrySocialQuiz;retrySocialQuiz=function(){if(socialProgress.award)return showToast('Your issued sample award locks this assessment. You can still review your answers.');originalRetry();};
 issueSocialCertificate=async function(){try{await chain;if(blocked)return;const data=await enqueue('social-media','award',{});hydrateSocial(data.social);renderSocialCertificate();}catch{}};
 const originalLesson=renderEnrolledLesson;
 const originalCertificate=renderSocialCertificate;
 renderSocialCertificate=function(){originalCertificate();const name=document.getElementById('certificate-name');if(name&&user){name.value=user.name;name.readOnly=true;const info=document.createElement('p');info.textContent='The sample certificate uses your saved profile name. Update it in your student space before issuing.';name.parentNode.appendChild(info);}};
 renderEnrolledLesson=function(){originalLesson();const note=document.getElementById('ml-save');if(note&&note.textContent.includes('browser'))note.textContent='Your answer is saved to your account.';};
 const originalChoose=enrolledChoose;enrolledChoose=function(answer){originalChoose(answer);const note=document.getElementById('ml-save');if(note)note.textContent='Saving your answer to your account…';};
 addEventListener('beforeunload',e=>{if(pending||blocked){e.preventDefault();e.returnValue='';}});
 try{
  const me=await request('/me');user=me.user;
  const records=await Promise.all(me.enrolments.filter(e=>e.status==='active'&&e.available_lessons>0).map(async e=>[e,await request('/learning/'+e.course)]));
  for(const [e,data]of records){revision[e.course]=data.revision;learningStore.enrolments[e.course]={status:'demo-enrolled',enrolledAt:e.created_at,updatedAt:e.updated_at,activeLesson:data.activeLesson||availableLessons(certificateProgrammes.find(c=>c.slug===e.course))[0].id,lessons:data.lessons||{}};if(e.course==='social-media')hydrateSocial(data.social);}
 }catch(err){if(!err.message.includes('sign in'))status(err.message,true);}
 const top=document.createElement('a');top.className='text-button';top.href='/portal.html';top.textContent=user?'Student & staff space':'Sign in';document.querySelector('.header-actions').prepend(top);
 const footer=document.createElement('a');footer.href='/portal.html?tab=enquiries';footer.textContent='Contact / enquiries';document.querySelector('.footer-links').appendChild(footer);
 document.documentElement.classList.remove('account-loading');
 const slug=new URLSearchParams(location.search).get('learn');
 if(slug){if(!certificateProgrammes.some(c=>c.slug===slug))return enrolDemo(slug);if(!user||!learningStore.enrolments[slug])return enrolDemo(slug);openLearningPath(slug);}else render();
})();

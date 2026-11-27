// Adapter between the approved lesson demonstrator and the account API.
// Server timestamps, approvals, quiz results and sample award IDs are authoritative.
(async()=>{
 if(location.protocol==='file:'){document.getElementById('app').innerHTML='<section class="page"><h1>Start the student backend.</h1><p>Open this campus using the address printed by npm start. Account-based learning needs the server.</p></section>';return;}
 const journey=await import('./enrolment-journey.js?v=20261117-journey');
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
 learningNotice=function(){return '<p class="ml-storage">'+(user?'Your progress is saved automatically to your account.':'Sign in to enrol and save your progress.')+'</p>';};
 socialNote=function(){return '<p class="ml-storage" id="social-save">Self-paced · 24 hours is an indicative estimate · Account-based saving.</p>';};
 socialSaveFeedback=function(){const el=document.getElementById('social-save');if(el)el.textContent=blocked?'Saving paused — check the message below.':'Changes queued for account saving.';const r=socialRequirements();document.querySelectorAll('[data-social-requirement]').forEach(el=>{const ok=r[el.dataset.socialRequirement];el.querySelector('span').textContent=ok?'✓':'○';el.querySelector('strong').textContent=ok?'Done':'To do';});const b=document.getElementById('social-award-action');if(b)b.disabled=!socialEligible();};
 enrolDemo=slug=>{location.href=journey.enrolmentUrl(slug);};renderEnrolment=()=>enrolDemo(currentCourse().certificate?.slug||'');renderEnrolled=portal;renderMyLearning=portal;renderDashboard=portal;
 renderApply=function(){page('<div class="cert-shell"><p class="cert-kicker">Admissions</p><h1>Start with your student account.</h1><p>Choose a professional certificate to see its duration and tuition, or contact admissions for help.</p><a class="btn btn-primary" href="/index.html?catalogue=certificates">Browse certificates</a> <a class="btn btn-secondary" href="/portal.html?tab=enquiries">Ask admissions</a></div>');};
 renderPayment=renderApply;renderWelcome=portal;
 enrolmentAction=c=>enrolled(c)?`<button class="btn btn-primary" onclick="openLearningPath('${c.slug}')">Continue learning →</button>`:`<a class="btn btn-primary" href="${journey.enrolmentUrl(c.slug)}">Enrol now →</a>`;
 const originalPage=page;
 page=function(content){
  originalPage(content);
  const learning=!!user&&journey.isLearningRoute(state.route);
  document.body.dataset.campusSpace=learning?'learning':'public';
  document.querySelector('.brand').setAttribute('aria-label',learning?'Return to the university website':'Liberland University home');
  if(learning){
   const banner=document.createElement('div');banner.className='learning-account-status';banner.setAttribute('role','status');
   const identity=document.createElement('p');identity.textContent='Signed in as '+user.name+' · Enrolled';
   const note=document.createElement('small');note.textContent='Your progress is saved automatically.';identity.appendChild(note);
   const back=document.createElement('a');back.href='/portal.html';back.textContent='My learning';banner.append(identity,back);
   document.querySelector('#app > .page').prepend(banner);
  }
 };
 const originalRender=render;
 render=function(){
  const params=new URLSearchParams(location.search),c=currentCourse().certificate;
  params.delete('learn');params.delete('programme');params.delete('catalogue');
  if(journey.isLearningRoute(state.route)&&c)params.set('learn',c.slug);
  else if(state.route==='programme'&&c)params.set('programme',c.slug);
  const query=params.toString();history.replaceState(null,'',location.pathname+(query?'?'+query:'')+location.hash);
  const signIn=document.querySelector('.account-sign-in');if(signIn)signIn.href=c&&['programme','certificate-lesson'].includes(state.route)?journey.enrolmentUrl(c.slug)+'&tab=login':'/portal.html?tab=login';
  originalRender();
 };

 submitSocialQuiz=async function(){try{if(!requireSocialEnrolment()||socialProgress.answers.some(a=>a===null))return;const button=document.getElementById('social-submit-quiz');if(button)button.disabled=true;const data=await enqueue('social-media','quiz',{answers:[...socialProgress.answers]});hydrateSocial(data.social);renderSocialQuiz();}catch{}};
 const originalRetry=retrySocialQuiz;retrySocialQuiz=function(){if(socialProgress.award)return showToast('Your issued sample award locks this assessment. You can still review your answers.');originalRetry();};
 issueSocialCertificate=async function(){try{while(pending)await chain;if(blocked)return;const data=await enqueue('social-media','award',{});hydrateSocial(data.social);renderSocialCertificate();}catch{}};
 const originalLesson=renderEnrolledLesson;
 const originalCertificate=renderSocialCertificate;
 renderSocialCertificate=function(){originalCertificate();const name=document.getElementById('certificate-name');if(name&&user){name.value=user.name;name.readOnly=true;const info=document.createElement('p');info.textContent='The sample certificate uses your saved profile name. Update it in your student space before issuing.';name.parentNode.appendChild(info);}};
 renderEnrolledLesson=function(){originalLesson();const note=document.getElementById('ml-save');if(note&&note.textContent.includes('browser'))note.textContent='Your answer is saved to your account.';};
 const originalChoose=enrolledChoose;enrolledChoose=function(answer){originalChoose(answer);const note=document.getElementById('ml-save');if(note)note.textContent='Saving your answer to your account…';};
 addEventListener('beforeunload',e=>{if(pending||blocked){e.preventDefault();e.returnValue='';}});
 let accountRoutesOpen=true;
 try{
  const response=await fetch('/api/me');
  if(response.status===404){
   accountRoutesOpen=false;
   // The public catalogue can run with account routes closed at IIS.
   document.querySelectorAll('.header-actions a[href^="/portal.html"],.mobile-contact,[data-route="dashboard"]').forEach(link=>link.remove());
   enrolmentAction=()=>'<p>Online enrolment is currently unavailable.</p>';
   renderApply=()=>go('courses');
  }else{
  if(!response.ok)throw Error('Unable to load your account.');
  const me=await response.json();user=me.user;
  const records=await Promise.all(me.enrolments.filter(e=>e.status==='active'&&e.available_lessons>0).map(async e=>[e,await request('/learning/'+e.course)]));
  for(const [e,data]of records){revision[e.course]=data.revision;learningStore.enrolments[e.course]={status:'demo-enrolled',enrolledAt:e.created_at,updatedAt:e.updated_at,activeLesson:data.activeLesson||availableLessons(certificateProgrammes.find(c=>c.slug===e.course))[0].id,lessons:data.lessons||{}};if(e.course==='social-media')hydrateSocial(data.social);}
  }
  if(response.status!==404){
 CampusAccount.mount(document.querySelector('.header-actions'),user,{prepend:true,beforeSignOut:async()=>{
  while(pending)await chain;if(blocked)throw Error('Saving is paused. Copy any unsaved work before reloading or signing out.');
 }});
 if(user?.role==='staff')document.querySelectorAll('[data-route="dashboard"]').forEach(el=>el.textContent='Staff dashboard');
 const footer=document.createElement('a');footer.href='/portal.html?tab=enquiries';footer.textContent='Contact / enquiries';document.querySelector('.footer-links').appendChild(footer);
  }
 }catch(err){if(!err.message.includes('sign in'))status(err.message,true);}
 document.documentElement.classList.remove('account-loading');
 const params=new URLSearchParams(location.search),slug=params.get('learn'),programme=params.get('programme');
 if(slug&&accountRoutesOpen){if(!certificateProgrammes.some(c=>c.slug===slug)){location.replace('/portal.html?course='+encodeURIComponent(slug));return;}if(!user||!learningStore.enrolments[slug])return enrolDemo(slug);openLearningPath(slug);}
 else if(programme&&globalThis.professionalCertificates.some(c=>c.slug===programme))go('programme',{course:'cert-'+programme});
 else if(params.get('catalogue')==='certificates')openCertificateCatalogue();
 else render();
})();

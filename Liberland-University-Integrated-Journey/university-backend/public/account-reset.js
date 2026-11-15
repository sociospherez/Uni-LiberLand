// Account work is loaded from the server; never import untrusted, anonymous demo progress.
if(location.protocol!=='file:'){
 document.documentElement.classList.add('account-loading');
 for(const key of ['ldc-learning-v1','ldc-social-journey-v1'])localStorage.removeItem(key);
}

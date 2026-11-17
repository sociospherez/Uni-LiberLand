// Shared, session-backed account identity. Never put names or session data in storage.
(function () {
  function link(text, href) {
    const a = document.createElement('a');
    a.textContent = text;
    a.href = href;
    return a;
  }
  function mount(container, user, {prepend = false, signInHref = '/portal.html?tab=login', beforeSignOut = async () => {}} = {}) {
    if (!container) return;
    container.querySelector('.campus-account')?.remove();
    const account = document.createElement(user ? 'details' : 'a');
    account.className = 'campus-account';
    if (!user) {
      account.classList.add('account-sign-in');
      account.href = signInHref;
      account.textContent = 'Sign in';
    } else {
      const summary = document.createElement('summary');
      summary.setAttribute('aria-label', 'Account: ' + user.name + ', ' + user.role);
      const avatar = document.createElement('span');
      avatar.className = 'account-avatar';
      avatar.setAttribute('aria-hidden', 'true');
      avatar.textContent = user.name.trim().split(/\s+/).slice(0, 2).map(s => s[0]).join('').toUpperCase();
      const labels = document.createElement('span');
      labels.className = 'account-labels';
      const name = document.createElement('strong');
      name.className = 'account-name';
      name.textContent = user.name;
      const role = document.createElement('small');
      role.className = 'account-role';
      role.textContent = 'Signed in · ' + (user.role === 'staff' ? 'Staff' : 'Student');
      labels.append(name, role);
      summary.append(avatar, labels);
      const menu = document.createElement('div');
      menu.className = 'account-popover';
      menu.append(link(user.role === 'staff' ? 'Staff dashboard' : 'My learning', '/portal.html'),
        link('My account', '/portal.html?tab=profile'), link('Contact admissions', '/portal.html?tab=enquiries'));
      const signOut = document.createElement('button');
      signOut.type = 'button';
      signOut.textContent = 'Sign out';
      const error = document.createElement('p');
      error.className = 'account-menu-error';
      error.setAttribute('role', 'alert');
      error.hidden = true;
      signOut.addEventListener('click', async () => {
        signOut.disabled = true;
        try {
          await beforeSignOut();
          const response = await fetch('/api/logout', {method: 'POST'});
          if (!response.ok) throw Error('Sign out failed. Please try again.');
          location.replace('/index.html');
        } catch (err) {
          error.textContent = err.message || 'Unable to sign out.';
          error.hidden = false;
          signOut.disabled = false;
        }
      });
      menu.append(signOut, error);
      account.append(summary, menu);
      account.addEventListener('keydown', event => { if (event.key === 'Escape') { account.open = false; summary.focus(); } });
    }
    prepend ? container.prepend(account) : container.append(account);
  }
  window.CampusAccount = {mount};
  addEventListener('pageshow', event => { if (event.persisted) location.reload(); });
})();

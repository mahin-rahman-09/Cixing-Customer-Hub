// ============================================================
// AUTH
// Handles real login/logout against Supabase Auth, and loads the
// matching user_profiles row so the rest of the app knows who's
// signed in and what role they have.
// ============================================================

let currentUserProfile = null; // { id, full_name, role, phone, is_active }

// ---- Login ----
async function handleLogin(){
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-pass').value;
  const errorEl = document.getElementById('login-error');
  const btn = document.getElementById('login-btn');
  errorEl.textContent = '';

  if(!email || !password){
    errorEl.textContent = 'Please enter both email and password.';
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Logging in...';

  try{
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if(error){
      errorEl.textContent = friendlyAuthError(error.message);
      return;
    }

    await enterAppWithUser(data.user);
  } catch(err){
    console.error('Login failed:', err);
    errorEl.textContent = 'Something went wrong connecting to the server. Check the browser console for details.';
  } finally {
    btn.disabled = false;
    btn.textContent = 'Log in';
  }
}

function friendlyAuthError(message){
  if(message.includes('Invalid login credentials')) return 'Incorrect email or password.';
  if(message.includes('Email not confirmed')) return 'This account has not been confirmed yet — ask your admin.';
  return message;
}

// ---- Load profile, then show the app ----
async function enterAppWithUser(user){
  const { data: profile, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if(error || !profile){
    document.getElementById('login-error').textContent =
      'Your login worked, but no profile was found for this account. Ask your admin to set one up.';
    await supabase.auth.signOut();
    return;
  }

  if(profile.is_active === false){
    document.getElementById('login-error').textContent = 'This account has been deactivated.';
    await supabase.auth.signOut();
    return;
  }

  currentUserProfile = profile;

  // make dashboards/avatars reflect the real person
  document.getElementById('user-initials').textContent = initials(profile.full_name);
  document.getElementById('user-name').textContent = profile.full_name;
  document.getElementById('user-role').textContent = roleLabel(profile.role);
  currentRole = (profile.role === 'admin' || profile.role === 'manager') ? 'manager' : 'sales';

  // so this person shows up in the follow-up "assigned to" dropdown, etc.
  if(typeof sampleEmployees !== 'undefined' && !sampleEmployees.includes(profile.full_name)){
    sampleEmployees.unshift(profile.full_name);
  }

  document.getElementById('login-view').classList.add('hidden');
  document.getElementById('app-view').classList.add('active');
  renderPage('home');
  updateFollowUpBadge();
}

function roleLabel(role){
  return { admin:'Admin', manager:'Sales manager', sales_exec:'Sales exec', service_engineer:'Service engineer', viewer:'Viewer' }[role] || role;
}

// ---- Logout ----
async function handleLogout(){
  await supabase.auth.signOut();
  currentUserProfile = null;
  document.getElementById('app-view').classList.remove('active');
  document.getElementById('login-view').classList.remove('hidden');
  document.getElementById('login-email').value = '';
  document.getElementById('login-pass').value = '';
  document.getElementById('login-error').textContent = '';
}

// ---- On page load: if there's already a valid session, skip the login screen ----
(async function checkExistingSession(){
  try{
    const { data: { session } } = await supabase.auth.getSession();
    if(session && session.user){
      await enterAppWithUser(session.user);
    }
  } catch(err){
    console.error('Session check failed:', err);
  }
})();

// Allow pressing Enter in the password field to submit
document.addEventListener('DOMContentLoaded', ()=>{
  const passField = document.getElementById('login-pass');
  if(passField){
    passField.addEventListener('keydown', (e)=>{
      if(e.key === 'Enter') handleLogin();
    });
  }
});

// ============================================================
// PROFILE PAGE
// Personal info (editable), photo upload, and this person's own
// activity stats. Reached by clicking the name/avatar in the sidebar
// — it's deliberately not a normal nav item since it's about "me,"
// not a business-data module.
// ============================================================

function openProfilePage(){
  document.querySelectorAll('.nav-item').forEach(i=>i.classList.remove('active'));
  renderProfilePage();
}

function renderProfilePage(){
  const p = currentUserProfile;
  if(!p) return;

  const stats = computeMyStats(p);

  const c = document.getElementById('content');
  c.innerHTML = `
    <div class="breadcrumb" onclick="renderPage('home')"><i class="ti ti-arrow-left"></i> Back to home</div>

    <div class="profile-head">
      <div class="profile-avatar-wrap">
        <div class="profile-avatar" id="profile-avatar-display">${avatarInnerHtml(p)}</div>
        <button class="profile-photo-btn" onclick="document.getElementById('avatar-file-input').click()">
          <i class="ti ti-camera"></i>
        </button>
        <input type="file" id="avatar-file-input" accept="image/*" style="display:none;" onchange="onAvatarFileSelected(event)">
      </div>
      <div>
        <h1>${p.full_name}</h1>
        <div class="profile-sub">${roleLabel(p.role)}${p.designation ? ' · '+p.designation : ''}</div>
      </div>
    </div>

    <div class="tiles" style="margin-top:22px;">
      <div class="tile">
        <div class="label">Factories visited</div>
        <div class="value">${stats.factoriesVisited}</div>
      </div>
      <div class="tile">
        <div class="label">Active follow-ups</div>
        <div class="value">${stats.activeFollowUps}</div>
      </div>
      <div class="tile" style="opacity:.55;">
        <div class="label">Deals ongoing</div>
        <div class="value" style="font-size:15px;">Coming in V2</div>
      </div>
    </div>

    <div class="panel" style="margin-top:20px;">
      <div class="panel-head"><h2>Personal information</h2></div>
      <div class="overview-grid">
        <div>
          <div class="ov-label">Full name</div>
          <div class="ov-value ov-editable" data-field="full_name" onclick="editProfileField(this,'full_name',false)">${p.full_name}</div>
        </div>
        <div>
          <div class="ov-label">Email</div>
          <div class="ov-value" style="color:var(--ink-soft);">${currentAuthEmail || '—'}</div>
        </div>
        <div>
          <div class="ov-label">Phone</div>
          <div class="ov-value ov-editable" data-field="phone" onclick="editProfileField(this,'phone',false)">${p.phone || '<span class="ov-empty">Click to add...</span>'}</div>
        </div>
        <div>
          <div class="ov-label">Designation</div>
          <div class="ov-value ov-editable" data-field="designation" onclick="editProfileField(this,'designation',false)">${p.designation || '<span class="ov-empty">Click to add...</span>'}</div>
        </div>
      </div>
      <div class="overview-notes">
        <div class="ov-label">Bio</div>
        <div class="ov-value ov-editable" data-field="bio" onclick="editProfileField(this,'bio',true)">${p.bio || '<span class="ov-empty">Click to add a short bio...</span>'}</div>
      </div>
    </div>
  `;
}

function avatarInnerHtml(p){
  return p.photo_url
    ? `<img src="${p.photo_url}" alt="${p.full_name}">`
    : initials(p.full_name);
}

function computeMyStats(profile){
  const myVisits = sampleVisits.filter(v => v.employee_id === profile.id);
  const uniqueFactories = new Set(myVisits.map(v => v.factory_id));
  const activeFollowUps = sampleFollowUps.filter(f => f.responsible_employee_id === profile.id && f.status !== 'Completed');
  return {
    factoriesVisited: uniqueFactories.size,
    activeFollowUps: activeFollowUps.length,
  };
}

// ---- Editable fields (same click-to-edit pattern as Factory Overview) ----
function editProfileField(el, key, isTextarea){
  if(el.querySelector('input, textarea')) return;
  const p = currentUserProfile;
  const currentVal = p[key] || '';
  el.classList.remove('ov-editable');
  el.innerHTML = isTextarea
    ? `<textarea class="ov-input" rows="3">${currentVal}</textarea>`
    : `<input class="ov-input" type="text" value="${currentVal}">`;
  const input = el.querySelector('input, textarea');
  input.focus();
  if(!isTextarea) input.select();

  const save = async () => {
    const newVal = input.value.trim();
    input.disabled = true;

    const { error } = await supabaseClient
      .from('user_profiles')
      .update({ [key]: newVal })
      .eq('id', p.id);

    if(error){
      console.error('Failed to save profile field:', error);
      customAlert('Could not save that change. Please try again.', {error:true});
    } else {
      p[key] = newVal;
      // keep the sidebar in sync if the name changed
      if(key === 'full_name'){
        document.getElementById('user-name').textContent = newVal;
        document.getElementById('user-initials').innerHTML = avatarInnerHtml(p);
      }
    }
    renderProfilePage();
  };
  input.addEventListener('blur', save);
  input.addEventListener('keydown', (e)=>{
    if(e.key === 'Enter' && !isTextarea){ e.preventDefault(); input.blur(); }
    if(e.key === 'Escape'){ input.value = currentVal; input.blur(); }
  });
}

// ---- Photo upload ----
async function onAvatarFileSelected(event){
  const file = event.target.files[0];
  event.target.value = ''; // allow selecting the same file again later
  if(!file) return;

  if(!file.type.startsWith('image/')){
    customAlert('Please choose an image file.');
    return;
  }
  if(file.size > 5 * 1024 * 1024){
    customAlert('That image is a bit large — please choose one under 5MB.');
    return;
  }

  const croppedBlob = await openImageCropModal(file);
  if(!croppedBlob) return; // cancelled

  const p = currentUserProfile;
  const display = document.getElementById('profile-avatar-display');
  display.innerHTML = `<i class="ti ti-loader-2 spin"></i>`;

  const path = `${p.id}.jpg`; // canvas export is always JPEG now, regardless of the original file type

  const { error: uploadError } = await supabaseClient.storage
    .from('avatars')
    .upload(path, croppedBlob, { upsert: true, contentType: 'image/jpeg' });

  if(uploadError){
    console.error('Failed to upload photo:', uploadError);
    customAlert('Could not upload that photo. Please try again.', {error:true});
    display.innerHTML = avatarInnerHtml(p);
    return;
  }

  const { data: urlData } = supabaseClient.storage.from('avatars').getPublicUrl(path);
  // cache-bust so the new photo shows immediately instead of a cached old one
  const photoUrl = `${urlData.publicUrl}?t=${Date.now()}`;

  const { error: dbError } = await supabaseClient
    .from('user_profiles')
    .update({ photo_url: photoUrl })
    .eq('id', p.id);

  if(dbError){
    console.error('Failed to save photo URL:', dbError);
    customAlert('Photo uploaded, but could not save it to your profile. Please try again.', {error:true});
    display.innerHTML = avatarInnerHtml(p);
    return;
  }

  p.photo_url = photoUrl;
  document.getElementById('user-initials').innerHTML = avatarInnerHtml(p);
  renderProfilePage();
  showToast('Profile photo updated.');
}

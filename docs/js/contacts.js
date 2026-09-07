// ============================================================
// CONTACT MODAL — add a new contact or edit an existing one.
// Same modal handles both; if a contactId is passed, it's edit mode.
// ============================================================

let contactModalFactoryId = null;
let contactModalEditingId = null;

function openContactModal(factoryId, contactId){
  contactModalFactoryId = factoryId;
  contactModalEditingId = contactId || null;
  const editing = !!contactId;
  const ct = editing ? getContact(contactId) : null;

  const root = document.getElementById('contact-modal-root') || (() => {
    const d = document.createElement('div');
    d.id = 'contact-modal-root';
    document.body.appendChild(d);
    return d;
  })();

  root.innerHTML = `
    <div class="modal-overlay" onclick="if(event.target===this) closeContactModal()">
      <div class="modal-card">
        <h3>${editing ? 'Edit contact' : 'Add contact'}</h3>
        <p class="modal-sub">${editing ? 'Update their details below.' : 'Just the essentials — you can fill in the rest later.'}</p>

        <div class="field">
          <label>Name *</label>
          <input id="ct-name" placeholder="e.g. Mohammad Karim" value="${ct ? escapeAttr(ct.name) : ''}">
        </div>
        <div class="field-row">
          <div class="field">
            <label>Designation</label>
            <input id="ct-designation" placeholder="e.g. General Manager" value="${ct ? escapeAttr(ct.designation||'') : ''}">
          </div>
          <div class="field">
            <label>Department</label>
            <input id="ct-department" placeholder="e.g. Production" value="${ct ? escapeAttr(ct.department||'') : ''}">
          </div>
        </div>
        <div class="field">
          <label>Phone</label>
          <input id="ct-phone" placeholder="+8801XXXXXXXXX" value="${ct ? escapeAttr(ct.phone||'') : ''}">
        </div>
        <div class="field">
          <label>WhatsApp</label>
          <input id="ct-whatsapp" placeholder="+8801XXXXXXXXX (if different)" value="${ct ? escapeAttr(ct.whatsapp||'') : ''}">
        </div>
        <div class="field">
          <label>Email</label>
          <input id="ct-email" type="email" placeholder="name@factory.com" value="${ct ? escapeAttr(ct.email||'') : ''}">
        </div>
        <div class="field checkbox-field">
          <label><input type="checkbox" id="ct-decision-maker" ${ct && ct.is_decision_maker ? 'checked' : ''}> This person is a decision maker</label>
        </div>

        <div class="modal-actions" style="justify-content:space-between;">
          ${editing && ct && ct.is_active===false ? `
            <div style="display:flex;gap:14px;align-items:center;">
              <button class="btn-tertiary" style="text-decoration:underline;padding:0;" onclick="restoreContact()">Restore</button>
              <button class="btn-tertiary" style="color:var(--danger);padding:0;" onclick="submitDeleteContact()"><i class="ti ti-trash"></i> Delete permanently</button>
            </div>
          ` : editing ? `<button class="btn-tertiary" style="color:var(--danger);" onclick="deactivateContact()"><i class="ti ti-trash"></i> Remove</button>` : `<span></span>`}
          <div style="display:flex;gap:8px;">
            <button class="btn-tertiary" onclick="closeContactModal()">Cancel</button>
            <button class="btn-primary" style="width:auto;padding:9px 18px;" onclick="submitContact()">${editing ? 'Save changes' : 'Add contact'}</button>
          </div>
        </div>
      </div>
    </div>
  `;
  document.getElementById('ct-name').focus();
}

function closeContactModal(){
  const root = document.getElementById('contact-modal-root');
  if(root) root.innerHTML = '';
  contactModalEditingId = null;
}

async function submitContact(){
  const name = document.getElementById('ct-name').value.trim();
  if(!name){ customAlert('Name is required.'); return; }

  const values = {
    name,
    designation: document.getElementById('ct-designation').value.trim(),
    department: document.getElementById('ct-department').value.trim(),
    phone: document.getElementById('ct-phone').value.trim(),
    whatsapp: document.getElementById('ct-whatsapp').value.trim(),
    email: document.getElementById('ct-email').value.trim(),
    is_decision_maker: document.getElementById('ct-decision-maker').checked,
  };

  const saveBtn = document.querySelector('#contact-modal-root .btn-primary');
  if(saveBtn){ saveBtn.disabled = true; saveBtn.textContent = 'Saving...'; }

  if(contactModalEditingId){
    const { error } = await supabaseClient
      .from('contacts')
      .update({ ...values, updated_at: new Date().toISOString() })
      .eq('id', contactModalEditingId);

    if(error){
      console.error('Failed to update contact:', error);
      customAlert('Could not save that contact. Please try again.', {error:true});
      if(saveBtn){ saveBtn.disabled = false; saveBtn.textContent = 'Save changes'; }
      return;
    }

    const ct = getContact(contactModalEditingId);
    Object.assign(ct, values);
  } else {
    const { data, error } = await supabaseClient
      .from('contacts')
      .insert({ factory_id: contactModalFactoryId, is_active: true, notes: '', created_by: currentUserProfile.id, ...values })
      .select()
      .single();

    if(error){
      console.error('Failed to create contact:', error);
      customAlert('Could not add that contact. Please try again.', {error:true});
      if(saveBtn){ saveBtn.disabled = false; saveBtn.textContent = 'Add contact'; }
      return;
    }

    sampleContacts.push(data);
  }

  closeContactModal();
  showToast(contactModalEditingId ? 'Contact updated.' : 'Contact added.');
  refreshFactory360IfOpen();
}

async function deactivateContact(){
  const ct = getContact(contactModalEditingId);
  if(!ct) return;

  const { error } = await supabaseClient
    .from('contacts')
    .update({ is_active: false, updated_at: new Date().toISOString() })
    .eq('id', contactModalEditingId);

  if(error){
    console.error('Failed to remove contact:', error);
    customAlert('Could not remove this contact. Please try again.', {error:true});
    return;
  }

  ct.is_active = false;
  closeContactModal();
  showToast('Contact removed.');
  refreshFactory360IfOpen();
}

async function restoreContact(){
  const ct = getContact(contactModalEditingId);
  if(!ct) return;

  const { error } = await supabaseClient
    .from('contacts')
    .update({ is_active: true, updated_at: new Date().toISOString() })
    .eq('id', contactModalEditingId);

  if(error){
    console.error('Failed to restore contact:', error);
    customAlert('Could not restore this contact. Please try again.', {error:true});
    return;
  }

  ct.is_active = true;
  closeContactModal();
  showToast('Contact restored.');
  refreshFactory360IfOpen();
}

async function submitDeleteContact(){
  const ct = getContact(contactModalEditingId);
  if(!ct) return;
  if(!(await customConfirm(`Permanently delete ${ct.name}? This can't be undone.`, { title:'Delete permanently', confirmLabel:'Delete permanently' }))) return;

  const { error } = await supabaseClient.from('contacts').delete().eq('id', contactModalEditingId);

  if(error){
    console.error('Failed to delete contact:', error);
    customAlert('Could not delete this contact. Please try again.', {error:true});
    return;
  }

  sampleContacts = sampleContacts.filter(c => c.id !== contactModalEditingId);
  closeContactModal();
  showToast('Contact deleted permanently.');
  refreshFactory360IfOpen();
}

function refreshFactory360IfOpen(){
  if(currentFactoryId && document.getElementById('f360-tab-content')){
    renderFactory360();
  }
}

function escapeAttr(str){
  return String(str).replace(/"/g, '&quot;');
}

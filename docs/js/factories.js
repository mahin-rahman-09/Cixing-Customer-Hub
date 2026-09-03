// ============================================================
// FACTORIES MODULE
// Factory list (searchable/sortable table) + Factory 360 detail page
// ============================================================

let factorySearch = '';
let factorySort = { key:'factory_name', dir:1 };
let currentFactoryId = null;
let currentFactoryTab = 'overview';

function renderFactoriesPage(){
  const c = document.getElementById('content');
  const locations = [...new Set(sampleFactories.map(f=>f.location).filter(Boolean))].sort();
  const types = [...new Set(sampleFactories.map(f=>f.factory_type).filter(Boolean))].sort();

  c.innerHTML = `
    <div class="page-head">
      <h1>Factories</h1>
      <button class="btn-secondary" onclick="openAddFactoryModal()"><i class="ti ti-plus"></i> Add factory</button>
    </div>
    <div class="list-toolbar">
      <div class="topbar-search" style="width:240px;">
        <i class="ti ti-search"></i>
        <input id="factory-search-input" placeholder="Search by name or group..." value="${factorySearch}">
      </div>
      <select id="filter-location" class="filter-select" onchange="onFactoryFilterChange()">
        <option value="">All locations</option>
        ${locations.map(l=>`<option value="${l}" ${factoryFilters.location===l?'selected':''}>${l}</option>`).join('')}
      </select>
      <select id="filter-type" class="filter-select" onchange="onFactoryFilterChange()">
        <option value="">All types</option>
        ${types.map(t=>`<option value="${t}" ${factoryFilters.type===t?'selected':''}>${t}</option>`).join('')}
      </select>
      <select id="filter-score" class="filter-select" onchange="onFactoryFilterChange()">
        <option value="">Any opportunity</option>
        <option value="4" ${factoryFilters.minScore==='4'?'selected':''}>4+ stars</option>
        <option value="3" ${factoryFilters.minScore==='3'?'selected':''}>3+ stars</option>
        <option value="2" ${factoryFilters.minScore==='2'?'selected':''}>2+ stars</option>
      </select>
      <label class="checkbox-inline">
        <input type="checkbox" id="filter-archived" ${factoryFilters.showArchived?'checked':''} onchange="onFactoryFilterChange()"> Show archived
      </label>
      <div class="result-count" id="factory-result-count"></div>
    </div>
    <div class="panel">
      <table class="ledger" id="factory-table">
        <thead>
          <tr>
            <th class="sortable" data-key="factory_name">Factory <i class="ti ti-arrows-sort"></i></th>
            <th class="sortable" data-key="group_name">Group <i class="ti ti-arrows-sort"></i></th>
            <th class="sortable" data-key="location">Location <i class="ti ti-arrows-sort"></i></th>
            <th class="sortable" data-key="factory_type">Type <i class="ti ti-arrows-sort"></i></th>
            <th class="sortable" data-key="opportunity_score">Opportunity <i class="ti ti-arrows-sort"></i></th>
            <th class="sortable" data-key="last_visit_date">Last visit <i class="ti ti-arrows-sort"></i></th>
          </tr>
        </thead>
        <tbody id="factory-table-body"></tbody>
      </table>
    </div>
    <div id="add-factory-modal-root"></div>
  `;

  document.getElementById('factory-search-input').addEventListener('input', (e)=>{
    factorySearch = e.target.value;
    renderFactoryTableBody();
  });

  document.querySelectorAll('#factory-table th.sortable').forEach(th=>{
    th.addEventListener('click', ()=>{
      const key = th.dataset.key;
      if(factorySort.key === key){ factorySort.dir *= -1; }
      else { factorySort = { key, dir:1 }; }
      renderFactoryTableBody();
    });
  });

  renderFactoryTableBody();
}

let factoryFilters = { location:'', type:'', minScore:'', showArchived:false };

function onFactoryFilterChange(){
  factoryFilters.location = document.getElementById('filter-location').value;
  factoryFilters.type = document.getElementById('filter-type').value;
  factoryFilters.minScore = document.getElementById('filter-score').value;
  factoryFilters.showArchived = document.getElementById('filter-archived').checked;
  renderFactoryTableBody();
}

function renderFactoryTableBody(){
  const term = factorySearch.trim().toLowerCase();
  let rows = sampleFactories.filter(f => {
    if(f.is_deleted && !factoryFilters.showArchived) return false;
    const matchesTerm = f.factory_name.toLowerCase().includes(term) ||
      (f.group_name||'').toLowerCase().includes(term) ||
      (f.location||'').toLowerCase().includes(term) ||
      (f.current_machine_brands||'').toLowerCase().includes(term);
    if(!matchesTerm) return false;
    if(factoryFilters.location && f.location !== factoryFilters.location) return false;
    if(factoryFilters.type && f.factory_type !== factoryFilters.type) return false;
    if(factoryFilters.minScore && (f.opportunity_score||0) < Number(factoryFilters.minScore)) return false;
    return true;
  });

  rows.sort((a,b)=>{
    let av = a[factorySort.key] ?? '';
    let bv = b[factorySort.key] ?? '';
    if(factorySort.key==='opportunity_score'){ av=Number(av); bv=Number(bv); }
    if(av < bv) return -1*factorySort.dir;
    if(av > bv) return 1*factorySort.dir;
    return 0;
  });

  document.getElementById('factory-result-count').textContent = `${rows.length} factor${rows.length===1?'y':'ies'}`;

  document.getElementById('factory-table-body').innerHTML = rows.map(f => `
    <tr onclick="openFactory('${f.id}')" style="${f.is_deleted ? 'opacity:.55;' : ''}">
      <td class="factory-name" data-label="Factory">${f.factory_name}${f.is_deleted ? ' <span class="stage-pill" style="margin-left:6px;">Archived</span>' : ''}</td>
      <td class="rec-id" data-label="Group">${f.group_name || '—'}</td>
      <td data-label="Location">${f.location || '—'}</td>
      <td data-label="Type">${f.factory_type || '—'}</td>
      <td data-label="Opportunity">${opportunityStars(f.opportunity_score)}</td>
      <td class="rec-id" data-label="Last visit">${formatDate(f.last_visit_date)}</td>
    </tr>
  `).join('') || `<tr><td colspan="6" style="text-align:center;color:var(--ink-soft);padding:32px;">No factories match your filters.</td></tr>`;
}

function opportunityStars(score){
  score = score || 0;
  let out = '<span class="score-stars">';
  for(let i=1;i<=5;i++){
    out += `<i class="ti ${i<=score ? 'ti-star-filled star-on' : 'ti-star star-off'}"></i>`;
  }
  return out + '</span>';
}

function formatDate(d){
  if(!d) return '—';
  const dt = new Date(d);
  return dt.toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'});
}

function openFactory(id){
  currentFactoryId = id;
  currentFactoryTab = 'overview';
  document.querySelectorAll('.nav-item').forEach(i=>i.classList.remove('active'));
  document.querySelectorAll('.nav-item[data-page="factories"]').forEach(i=>i.classList.add('active'));
  renderFactory360();
}

function renderFactory360(){
  const f = getFactory(currentFactoryId);
  if(!f){ renderFactoriesPage(); return; }
  const contacts = getContactsForFactory(f.id);
  const visits = getVisitsForFactory(f.id);

  const c = document.getElementById('content');
  c.innerHTML = `
    <div class="breadcrumb" onclick="renderFactoriesPage()"><i class="ti ti-arrow-left"></i> All factories</div>
    ${f.is_deleted ? `<div class="archived-banner"><i class="ti ti-archive"></i> This factory is archived and hidden from the main list. <button class="btn-tertiary" style="text-decoration:underline;padding:0;margin-left:6px;" onclick="restoreFactory('${f.id}')">Restore it</button></div>` : ''}
    <div class="f360-head">
      <div>
        <h1>${f.factory_name}</h1>
        <div class="f360-sub">${f.group_name && f.group_name!=='—' ? f.group_name+' · ' : ''}${f.location || ''} ${opportunityStars(f.opportunity_score)}</div>
      </div>
      <div class="f360-actions">
        <button class="btn-secondary" onclick="openVisitModal('${f.id}')"><i class="ti ti-clipboard-plus"></i> Log visit</button>
        <button class="btn-secondary" onclick="openContactModal('${f.id}')"><i class="ti ti-user-plus"></i> Add contact</button>
        ${!f.is_deleted ? `<button class="btn-tertiary" style="color:var(--danger);" onclick="archiveFactory('${f.id}')" title="Archive"><i class="ti ti-archive"></i></button>` : ''}
      </div>
    </div>

    <div class="tabs">
      <div class="tab ${currentFactoryTab==='overview'?'active':''}" data-tab="overview">Overview</div>
      <div class="tab ${currentFactoryTab==='contacts'?'active':''}" data-tab="contacts">Contacts <span class="tab-count">${contacts.length}</span></div>
      <div class="tab ${currentFactoryTab==='visits'?'active':''}" data-tab="visits">Visits <span class="tab-count">${visits.length}</span></div>
      <div class="tab ${currentFactoryTab==='quotations'?'active':''}" data-tab="quotations">Quotations <span class="tab-tag">V2</span></div>
      <div class="tab ${currentFactoryTab==='machines'?'active':''}" data-tab="machines">Machines <span class="tab-tag">V3</span></div>
      <div class="tab ${currentFactoryTab==='service'?'active':''}" data-tab="service">Service <span class="tab-tag">V4</span></div>
    </div>

    <div id="f360-tab-content"></div>
  `;

  document.querySelectorAll('.tab').forEach(t=>{
    t.addEventListener('click', ()=>{
      currentFactoryTab = t.dataset.tab;
      document.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));
      t.classList.add('active');
      renderFactoryTabContent(f, contacts, visits);
    });
  });

  renderFactoryTabContent(f, contacts, visits);
}

function renderFactoryTabContent(f, contacts, visits){
  const el = document.getElementById('f360-tab-content');
  if(currentFactoryTab==='overview'){
    el.innerHTML = `
      <div class="panel">
        <div class="overview-grid">
          ${overviewField('group_name','Group', f.group_name)}
          ${overviewField('location','Location', f.location)}
          ${overviewField('address','Address', f.address)}
          ${overviewField('website','Website', f.website)}
          ${overviewField('factory_type','Factory type', f.factory_type)}
          ${overviewField('total_employees','Total employees', f.total_employees)}
          ${overviewField('production_capacity','Production capacity', f.production_capacity)}
          ${overviewField('current_machine_brands','Current machine brands', f.current_machine_brands)}
          ${overviewField('existing_cixing_machines','Existing Cixing machines', f.existing_cixing_machines)}
          <div>
            <div class="ov-label">Opportunity score</div>
            <div class="ov-value">${editableStars(f)}</div>
          </div>
        </div>
        <div class="overview-notes">
          <div class="ov-label">Notes</div>
          <div class="ov-value ov-editable" onclick="editOverviewField(this,'notes',true)" data-field="notes">${f.notes || '<span class="ov-empty">Click to add notes...</span>'}</div>
        </div>
      </div>
    `;
  } else if(currentFactoryTab==='contacts'){
    el.innerHTML = `
      <div class="panel">
        ${contacts.filter(ct=>ct.is_active!==false).length ? contacts.filter(ct=>ct.is_active!==false).map(ct => `
          <div class="contact-card ${ct.is_decision_maker?'dm':''}">
            <div class="contact-avatar" onclick="openContactModal('${f.id}','${ct.id}')" style="cursor:pointer;">${initials(ct.name)}</div>
            <div class="contact-info" onclick="openContactModal('${f.id}','${ct.id}')" style="cursor:pointer;">
              <div class="contact-name">${ct.name} ${ct.is_decision_maker?'<span class="dm-badge">Decision maker</span>':''}</div>
              <div class="contact-role">${ct.designation || ''}${ct.department? ' · '+ct.department : ''}</div>
            </div>
            <div class="contact-links">
              ${ct.phone ? `<a href="tel:${ct.phone}" title="Call" onclick="event.stopPropagation()"><i class="ti ti-phone"></i></a>` : ''}
              ${ct.whatsapp ? `<a href="https://wa.me/${ct.whatsapp.replace('+','')}" target="_blank" title="WhatsApp" onclick="event.stopPropagation()"><i class="ti ti-brand-whatsapp"></i></a>` : ''}
              ${ct.email ? `<a href="mailto:${ct.email}" title="Email" onclick="event.stopPropagation()"><i class="ti ti-mail"></i></a>` : ''}
              <i class="ti ti-pencil" title="Edit" onclick="openContactModal('${f.id}','${ct.id}')" style="cursor:pointer;color:var(--ink-soft);"></i>
            </div>
          </div>
        `).join('') : `<div class="empty" style="border:none;"><p>No contacts saved yet for this factory.</p></div>`}
      </div>
    `;
  } else if(currentFactoryTab==='visits'){
    el.innerHTML = `
      <div class="panel">
        ${visits.length ? `<div class="visit-timeline">${visits.map(v => `
          <div class="visit-entry visit-entry-clickable" onclick="openVisitModal('${f.id}','${v.id}')">
            <div class="visit-entry-head">
              <span class="stage-pill">${v.visit_type}</span>
              <span class="rec-id">${formatDate(v.visit_date)} · ${v.employee}</span>
              <i class="ti ti-pencil visit-edit-icon"></i>
            </div>
            <p class="visit-summary">${v.discussion_summary || ''}</p>
            ${v.next_action ? `<p class="visit-next"><i class="ti ti-arrow-right"></i> ${v.next_action}${v.follow_up_date ? ' — by '+formatDate(v.follow_up_date) : ''}</p>` : ''}
          </div>
        `).join('')}</div>` : `<div class="empty" style="border:none;"><p>No visits logged yet for this factory.</p></div>`}
      </div>
    `;
  } else {
    const tag = currentFactoryTab==='quotations' ? 'Version 2' : currentFactoryTab==='machines' ? 'Version 3' : 'Version 4';
    el.innerHTML = `<div class="empty"><i class="ti ti-hammer"></i><h3>Coming later</h3><p>This tab fills in once we build that module.</p><span class="tag">${tag}</span></div>`;
  }
}

function overviewField(key, label, value){
  const display = (value===null || value===undefined || value==='') ? '<span class="ov-empty">Click to add...</span>' : value;
  return `<div><div class="ov-label">${label}</div><div class="ov-value ov-editable" data-field="${key}" onclick="editOverviewField(this,'${key}',false)">${display}</div></div>`;
}

function editOverviewField(el, key, isTextarea){
  if(el.querySelector('input, textarea')) return; // already editing
  const f = getFactory(currentFactoryId);
  const currentVal = f[key] || '';
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
      .from('factories')
      .update({ [key]: newVal, updated_by: currentUserProfile.id, updated_at: new Date().toISOString() })
      .eq('id', f.id);

    if(error){
      console.error('Failed to save field:', error);
      alert('Could not save that change. Please try again.');
    } else {
      f[key] = newVal;
    }
    renderFactoryTabContent(f, getContactsForFactory(f.id), getVisitsForFactory(f.id));
  };
  input.addEventListener('blur', save);
  input.addEventListener('keydown', (e)=>{
    if(e.key === 'Enter' && !isTextarea){ e.preventDefault(); input.blur(); }
    if(e.key === 'Escape'){ input.value = currentVal; input.blur(); }
  });
}

function editableStars(f){
  let out = '<span class="score-stars score-stars-editable">';
  for(let i=1;i<=5;i++){
    out += `<i class="ti ${i<=f.opportunity_score ? 'ti-star-filled star-on' : 'ti-star star-off'}" onclick="setOpportunityScore('${f.id}',${i})"></i>`;
  }
  return out + '</span>';
}

async function setOpportunityScore(factoryId, score){
  const f = getFactory(factoryId);
  if(!f) return;
  const reduced = score - 1;
  const newScore = (f.opportunity_score === score) ? (reduced || null) : score; // clicking the same star again clears it to "no rating" instead of an invalid 0

  const { error } = await supabaseClient
    .from('factories')
    .update({ opportunity_score: newScore, updated_by: currentUserProfile.id, updated_at: new Date().toISOString() })
    .eq('id', f.id);

  if(error){
    console.error('Failed to save opportunity score:', error);
    alert('Could not save that change. Please try again.');
    return;
  }

  f.opportunity_score = newScore;
  renderFactoryTabContent(f, getContactsForFactory(f.id), getVisitsForFactory(f.id));
}

function initials(name){
  return name.split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase();
}

// ---- Add Factory modal ----
function openAddFactoryModal(){
  document.getElementById('add-factory-modal-root').innerHTML = `
    <div class="modal-overlay" onclick="if(event.target===this) closeAddFactoryModal()">
      <div class="modal-card">
        <h3>Add factory</h3>
        <p class="modal-sub">Just the basics for now — everything else can be filled in later from the factory's page.</p>
        <div class="field">
          <label>Factory name *</label>
          <input id="new-factory-name" placeholder="e.g. Karnaphuli Sweaters Ltd.">
        </div>
        <div class="field">
          <label>Location</label>
          <input id="new-factory-location" placeholder="e.g. Gazipur">
        </div>
        <div class="modal-actions">
          <button class="btn-tertiary" onclick="closeAddFactoryModal()">Cancel</button>
          <button class="btn-primary" style="width:auto;padding:9px 18px;" onclick="submitAddFactory()">Add factory</button>
        </div>
      </div>
    </div>
  `;
}
function closeAddFactoryModal(){
  document.getElementById('add-factory-modal-root').innerHTML = '';
}
function submitAddFactory(){
  const name = document.getElementById('new-factory-name').value.trim();
  const location = document.getElementById('new-factory-location').value.trim();
  if(!name){ alert('Factory name is required.'); return; }

  const possibleDupe = sampleFactories.find(f => isSimilarName(f.factory_name, name));
  if(possibleDupe && !document.getElementById('new-factory-name').dataset.confirmed){
    const proceed = confirm(`A factory called "${possibleDupe.factory_name}" already exists. Add "${name}" as a separate factory anyway?`);
    if(!proceed) return;
  }

  createFactory(name, location);
}

async function createFactory(name, location){
  const saveBtn = document.querySelector('#add-factory-modal-root .btn-primary');
  if(saveBtn){ saveBtn.disabled = true; saveBtn.textContent = 'Adding...'; }

  const { data, error } = await supabaseClient
    .from('factories')
    .insert({ factory_name: name, location, created_by: currentUserProfile.id })
    .select()
    .single();

  if(error){
    console.error('Failed to create factory:', error);
    alert('Could not add that factory. Please try again.');
    if(saveBtn){ saveBtn.disabled = false; saveBtn.textContent = 'Add factory'; }
    return;
  }

  sampleFactories.push(data);
  closeAddFactoryModal();
  showToast('Factory added.');
  renderFactoryTableBody();
}

function isSimilarName(a, b){
  const na = a.trim().toLowerCase();
  const nb = b.trim().toLowerCase();
  if(na === nb) return true;
  if(na.length > 4 && nb.length > 4 && (na.includes(nb) || nb.includes(na))) return true;
  return false;
}

async function archiveFactory(id){
  const f = getFactory(id);
  if(!f) return;
  if(!confirm(`Archive "${f.factory_name}"? It'll be hidden from the main list but nothing is deleted — you can restore it anytime.`)) return;

  const { error } = await supabaseClient
    .from('factories')
    .update({ is_deleted: true, updated_by: currentUserProfile.id, updated_at: new Date().toISOString() })
    .eq('id', id);

  if(error){
    console.error('Failed to archive factory:', error);
    alert('Could not archive this factory. Please try again.');
    return;
  }

  f.is_deleted = true;
  showToast('Factory archived.');
  renderFactoriesPage();
}

async function restoreFactory(id){
  const f = getFactory(id);
  if(!f) return;

  const { error } = await supabaseClient
    .from('factories')
    .update({ is_deleted: false, updated_by: currentUserProfile.id, updated_at: new Date().toISOString() })
    .eq('id', id);

  if(error){
    console.error('Failed to restore factory:', error);
    alert('Could not restore this factory. Please try again.');
    return;
  }

  f.is_deleted = false;
  showToast('Factory restored.');
  renderFactory360();
}

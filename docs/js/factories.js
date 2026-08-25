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
  c.innerHTML = `
    <div class="page-head">
      <h1>Factories</h1>
      <button class="btn-secondary" onclick="openAddFactoryModal()"><i class="ti ti-plus"></i> Add factory</button>
    </div>
    <div class="list-toolbar">
      <div class="topbar-search" style="width:280px;">
        <i class="ti ti-search"></i>
        <input id="factory-search-input" placeholder="Search by name or group..." value="${factorySearch}">
      </div>
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

function renderFactoryTableBody(){
  const term = factorySearch.trim().toLowerCase();
  let rows = sampleFactories.filter(f =>
    f.factory_name.toLowerCase().includes(term) ||
    (f.group_name||'').toLowerCase().includes(term) ||
    (f.location||'').toLowerCase().includes(term)
  );

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
    <tr onclick="openFactory('${f.id}')">
      <td class="factory-name">${f.factory_name}</td>
      <td class="rec-id">${f.group_name || '—'}</td>
      <td>${f.location || '—'}</td>
      <td>${f.factory_type || '—'}</td>
      <td>${opportunityStars(f.opportunity_score)}</td>
      <td class="rec-id">${formatDate(f.last_visit_date)}</td>
    </tr>
  `).join('') || `<tr><td colspan="6" style="text-align:center;color:var(--ink-soft);padding:32px;">No factories match "${factorySearch}"</td></tr>`;
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
  document.querySelector('.nav-item[data-page="factories"]').classList.add('active');
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
    <div class="f360-head">
      <div>
        <h1>${f.factory_name}</h1>
        <div class="f360-sub">${f.group_name && f.group_name!=='—' ? f.group_name+' · ' : ''}${f.location || ''} ${opportunityStars(f.opportunity_score)}</div>
      </div>
      <div class="f360-actions">
        <button class="btn-secondary" onclick="alert('Visit form — built next step')"><i class="ti ti-clipboard-plus"></i> Log visit</button>
        <button class="btn-secondary" onclick="alert('Add contact — built next step')"><i class="ti ti-user-plus"></i> Add contact</button>
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
          ${overviewField('Group', f.group_name)}
          ${overviewField('Location', f.location)}
          ${overviewField('Address', f.address)}
          ${overviewField('Website', f.website)}
          ${overviewField('Factory type', f.factory_type)}
          ${overviewField('Total employees', f.total_employees)}
          ${overviewField('Production capacity', f.production_capacity)}
          ${overviewField('Current machine brands', f.current_machine_brands)}
          ${overviewField('Existing Cixing machines', f.existing_cixing_machines)}
          ${overviewField('Opportunity score', opportunityStars(f.opportunity_score))}
        </div>
        <div class="overview-notes">
          <div class="ov-label">Notes</div>
          <div class="ov-value">${f.notes || '—'}</div>
        </div>
      </div>
    `;
  } else if(currentFactoryTab==='contacts'){
    el.innerHTML = `
      <div class="panel">
        ${contacts.length ? contacts.map(ct => `
          <div class="contact-card ${ct.is_decision_maker?'dm':''}">
            <div class="contact-avatar">${initials(ct.name)}</div>
            <div class="contact-info">
              <div class="contact-name">${ct.name} ${ct.is_decision_maker?'<span class="dm-badge">Decision maker</span>':''}</div>
              <div class="contact-role">${ct.designation || ''}${ct.department? ' · '+ct.department : ''}</div>
            </div>
            <div class="contact-links">
              ${ct.phone ? `<a href="tel:${ct.phone}" title="Call"><i class="ti ti-phone"></i></a>` : ''}
              ${ct.whatsapp ? `<a href="https://wa.me/${ct.whatsapp.replace('+','')}" target="_blank" title="WhatsApp"><i class="ti ti-brand-whatsapp"></i></a>` : ''}
              ${ct.email ? `<a href="mailto:${ct.email}" title="Email"><i class="ti ti-mail"></i></a>` : ''}
            </div>
          </div>
        `).join('') : `<div class="empty" style="border:none;"><p>No contacts saved yet for this factory.</p></div>`}
      </div>
    `;
  } else if(currentFactoryTab==='visits'){
    el.innerHTML = `
      <div class="panel">
        ${visits.length ? `<div class="visit-timeline">${visits.map(v => `
          <div class="visit-entry">
            <div class="visit-entry-head">
              <span class="stage-pill">${v.visit_type}</span>
              <span class="rec-id">${formatDate(v.visit_date)} · ${v.employee}</span>
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

function overviewField(label, value){
  return `<div><div class="ov-label">${label}</div><div class="ov-value">${value || '—'}</div></div>`;
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
  const id = 'f' + (sampleFactories.length + 1) + '_' + Date.now();
  sampleFactories.push({ id, factory_name:name, group_name:'', location, factory_type:'', total_employees:null, opportunity_score:0, current_machine_brands:'', existing_cixing_machines:'', notes:'', last_visit_date:'' });
  closeAddFactoryModal();
  renderFactoryTableBody();
}

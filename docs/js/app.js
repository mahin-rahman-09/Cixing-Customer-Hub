document.querySelectorAll('.nav-item').forEach(item=>{
  item.addEventListener('click', ()=>{
    const page = item.dataset.page;
    document.querySelectorAll('.nav-item').forEach(i=>i.classList.remove('active'));
    document.querySelectorAll(`.nav-item[data-page="${page}"]`).forEach(i=>i.classList.add('active'));
    renderPage(page);
    closeMoreSheet();
  });
});

// currentRole drives which dashboard renders ('sales' or 'manager').
// Set for real by auth.js once the logged-in user's profile loads —
// this default only matters for the brief moment before that happens.
let currentRole = 'sales';

const today = new Date().toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long',year:'numeric'});

function renderPage(page){
  const c = document.getElementById('content');
  if(page==='home'){
    c.innerHTML = currentRole==='manager' ? managementDashboard() : salesDashboard();
  } else if(page==='factories'){
    renderFactoriesPage();
  } else if(page==='followups'){
    renderFollowUpsPage();
  } else {
    c.innerHTML = placeholder(page);
  }
}

function firstName(){
  const name = currentUserProfile ? currentUserProfile.full_name : 'there';
  return name.split(' ')[0];
}

function salesDashboard(){
  return `
    <div class="page-head">
      <h1>Good morning, ${firstName()}</h1>
      <div class="date">${today}</div>
    </div>
    <div class="tiles">
      <div class="tile"><div class="label">Today's follow-ups</div><div class="value">3</div></div>
      <div class="tile warn"><div class="label">Overdue</div><div class="value">1</div></div>
      <div class="tile"><div class="label">Upcoming visits (7 days)</div><div class="value">5</div></div>
      <div class="tile"><div class="label">Pending quotations</div><div class="value">2</div></div>
    </div>
    <div class="grid-2">
      <div class="panel">
        <div class="panel-head"><h2>Follow-ups due</h2><span class="see-all">See all</span></div>
        <table class="ledger">
          <thead><tr><th>Factory</th><th>Task</th><th>Due</th><th>Priority</th></tr></thead>
          <tbody>
            <tr><td class="factory-name">Anwar Sweaters Ltd.</td><td>Send revised quotation</td><td class="rec-id">Today</td><td><span class="priority-dot high"></span>High</td></tr>
            <tr><td class="factory-name">Delta Knitwear Group</td><td>Call re: financing terms</td><td class="rec-id">Today</td><td><span class="priority-dot medium"></span>Medium</td></tr>
            <tr><td class="factory-name">Padma Fashions</td><td>Confirm demo date</td><td class="rec-id">Tomorrow</td><td><span class="priority-dot medium"></span>Medium</td></tr>
            <tr><td class="factory-name">Sonar Bangla Textiles</td><td>Follow up on PO status</td><td class="rec-id" style="color:var(--danger)">2 days overdue</td><td><span class="priority-dot high"></span>High</td></tr>
          </tbody>
        </table>
      </div>
      <div class="panel">
        <div class="panel-head"><h2>Recent activity</h2></div>
        <div class="feed">
          <div class="feed-item"><div class="feed-avatar">NA</div><div class="feed-body"><p><span class="who">Nasrin Akter</span> logged a visit at Delta Knitwear Group</p><div class="when">2 hours ago</div></div></div>
          <div class="feed-item"><div class="feed-avatar">MK</div><div class="feed-body"><p><span class="who">Mahmud Kabir</span> sent a quotation to Anwar Sweaters Ltd.</p><div class="when">Yesterday</div></div></div>
          <div class="feed-item"><div class="feed-avatar">RH</div><div class="feed-body"><p><span class="who">You</span> added a new factory: Padma Fashions</p><div class="when">Yesterday</div></div></div>
          <div class="feed-item"><div class="feed-avatar">NA</div><div class="feed-body"><p><span class="who">Nasrin Akter</span> marked a follow-up complete at Sonar Bangla Textiles</p><div class="when">2 days ago</div></div></div>
        </div>
      </div>
    </div>
  `;
}

function managementDashboard(){
  return `
    <div class="page-head">
      <h1>Overview</h1>
      <div class="date">${today}</div>
    </div>
    <div class="tiles">
      <div class="tile"><div class="label">Total factories</div><div class="value">184</div></div>
      <div class="tile"><div class="label">Active opportunities</div><div class="value">27</div></div>
      <div class="tile warn"><div class="label">Pending follow-ups</div><div class="value">12</div></div>
      <div class="tile"><div class="label">Quotations sent</div><div class="value">9</div></div>
    </div>
    <div class="grid-2">
      <div class="panel">
        <div class="panel-head"><h2>Needs attention</h2></div>
        <table class="ledger">
          <thead><tr><th>Factory</th><th>Issue</th><th>Owner</th></tr></thead>
          <tbody>
            <tr><td class="factory-name">Sonar Bangla Textiles</td><td>Follow-up 2 days overdue</td><td class="rec-id">R. Haque</td></tr>
            <tr><td class="factory-name">Green Valley Apparels</td><td>No visit logged in 65 days</td><td class="rec-id">M. Kabir</td></tr>
            <tr><td class="factory-name">Anwar Sweaters Ltd.</td><td>Quotation stalled 16 days</td><td class="rec-id">R. Haque</td></tr>
          </tbody>
        </table>
      </div>
      <div class="panel">
        <div class="panel-head"><h2>Visits this month by employee</h2></div>
        <table class="ledger">
          <thead><tr><th>Employee</th><th>Visits</th></tr></thead>
          <tbody>
            <tr><td>Rafiqul Haque</td><td class="rec-id">14</td></tr>
            <tr><td>Mahmud Kabir</td><td class="rec-id">11</td></tr>
            <tr><td>Nasrin Akter</td><td class="rec-id">9</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function placeholder(page){
  const names = {
    visits:['Visit history','A logged, searchable list of every factory visit — the core habit this whole system is built around.','Step 3'],
    quotations:['Quotation management','Draft through accepted, with line items and full status history.','Version 2'],
    pipeline:['Sales pipeline','Stage-grouped view of every open opportunity, for management.','Version 2'],
    machines:['Machine ownership','Serial numbers, warranty status, and install history per factory.','Version 3'],
    service:['Service records','Requests, resolutions, and maintenance history per machine.','Version 4'],
  };
  const [title, body, tag] = names[page];
  return `
    <div class="page-head"><h1>${title}</h1></div>
    <div class="empty">
      <i class="ti ti-hammer"></i>
      <h3>Coming next</h3>
      <p>${body}</p>
      <span class="tag">${tag}</span>
    </div>
  `;
}

// ============================================================
// GLOBAL SEARCH (top bar) — searches factories + contacts by name/location/phone
// ============================================================
function onGlobalSearchInput(value){
  const dropdown = document.getElementById('global-search-dropdown');
  const term = value.trim().toLowerCase();
  if(!term){ dropdown.innerHTML=''; dropdown.classList.remove('open'); return; }

  const factoryMatches = sampleFactories
    .filter(f => !f.is_deleted)
    .filter(f => f.factory_name.toLowerCase().includes(term) || (f.location||'').toLowerCase().includes(term))
    .slice(0,5)
    .map(f => ({ type:'factory', id:f.id, label:f.factory_name, sub:f.location||'' }));

  const contactMatches = sampleContacts
    .filter(c => c.is_active !== false)
    .filter(c => c.name.toLowerCase().includes(term) || (c.phone||'').includes(term))
    .slice(0,5)
    .map(c => { const f = getFactory(c.factory_id); return { type:'contact', id:c.factory_id, label:c.name, sub:f ? f.factory_name : '' }; });

  const results = [...factoryMatches, ...contactMatches];

  if(results.length === 0){
    dropdown.innerHTML = `<div class="autocomplete-item" style="color:var(--ink-soft);">No matches for "${value}"</div>`;
  } else {
    dropdown.innerHTML = results.map(r => `
      <div class="autocomplete-item" onclick="goToGlobalSearchResult('${r.id}')">
        <i class="ti ${r.type==='factory' ? 'ti-building-factory-2' : 'ti-user'}" style="margin-right:8px;color:var(--ink-soft);"></i>
        ${r.label}<span class="rec-id"> · ${r.sub}</span>
      </div>
    `).join('');
  }
  dropdown.classList.add('open');
}

function goToGlobalSearchResult(factoryId){
  document.getElementById('global-search-input').value = '';
  document.getElementById('global-search-dropdown').classList.remove('open');
  document.querySelectorAll('.nav-item').forEach(i=>i.classList.remove('active'));
  document.querySelectorAll('.nav-item[data-page="factories"]').forEach(i=>i.classList.add('active'));
  openFactory(factoryId);
}

document.addEventListener('click', (e)=>{
  const wrap = document.getElementById('global-search-input');
  if(wrap && !wrap.closest('.autocomplete-wrap').contains(e.target)){
    const dd = document.getElementById('global-search-dropdown');
    if(dd) dd.classList.remove('open');
  }
});

// ============================================================
// MOBILE "MORE" SHEET — the modules that don't fit in the bottom nav
// ============================================================
function openMoreSheet(){
  const root = document.getElementById('more-sheet-root');
  root.innerHTML = `
    <div class="modal-overlay" onclick="if(event.target===this) closeMoreSheet()">
      <div class="more-sheet">
        <div class="more-sheet-handle"></div>
        <div class="more-sheet-item" data-page="visits"><i class="ti ti-clipboard-text"></i> Visits</div>
        <div class="more-sheet-item" data-page="quotations"><i class="ti ti-file-invoice"></i> Quotations <span class="tab-tag">V2</span></div>
        <div class="more-sheet-item" data-page="pipeline"><i class="ti ti-chart-funnel"></i> Pipeline <span class="tab-tag">V2</span></div>
        <div class="more-sheet-item" data-page="machines"><i class="ti ti-tool"></i> Machines <span class="tab-tag">V3</span></div>
        <div class="more-sheet-item" data-page="service"><i class="ti ti-settings"></i> Service <span class="tab-tag">V4</span></div>
        <div class="more-sheet-divider"></div>
        <div class="more-sheet-item" onclick="handleLogout()"><i class="ti ti-logout"></i> Log out</div>
      </div>
    </div>
  `;
  root.querySelectorAll('.more-sheet-item[data-page]').forEach(item=>{
    item.addEventListener('click', ()=>{
      const page = item.dataset.page;
      document.querySelectorAll('.nav-item').forEach(i=>i.classList.remove('active'));
      renderPage(page);
      closeMoreSheet();
    });
  });
}
function closeMoreSheet(){
  const root = document.getElementById('more-sheet-root');
  if(root) root.innerHTML = '';
}

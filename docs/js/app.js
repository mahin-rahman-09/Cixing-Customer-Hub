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

function timeAgo(dateStr){
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.round(diffMs / 60000);
  if(mins < 1) return 'Just now';
  if(mins < 60) return `${mins} minute${mins===1?'':'s'} ago`;
  const hours = Math.round(mins / 60);
  if(hours < 24) return `${hours} hour${hours===1?'':'s'} ago`;
  const days = Math.round(hours / 24);
  if(days === 1) return 'Yesterday';
  if(days < 7) return `${days} days ago`;
  return formatDate(dateStr);
}

function isThisMonth(dateStr){
  if(!dateStr) return false;
  const d = new Date(dateStr);
  const now = new Date();
  return d.getFullYear()===now.getFullYear() && d.getMonth()===now.getMonth();
}

function salesDashboard(){
  const myId = currentUserProfile ? currentUserProfile.id : null;
  const cats = categorizeFollowUps(); // company-wide categorized lists
  const myToday = cats.today.filter(f=>f.responsible_employee_id===myId);
  const myOverdue = cats.overdue.filter(f=>f.responsible_employee_id===myId);
  const myWeek = cats.week.filter(f=>f.responsible_employee_id===myId);
  const myVisitsThisMonth = sampleVisits.filter(v=>v.employee_id===myId && isThisMonth(v.visit_date));

  const dueRows = [...myOverdue, ...myToday].slice(0,6);
  const recentVisits = sampleVisits.slice().sort((a,b)=> new Date(b.created_at)-new Date(a.created_at)).slice(0,5);

  return `
    <div class="page-head">
      <h1>Good morning, ${firstName()}</h1>
      <div class="date">${today}</div>
    </div>
    <div class="tiles">
      <div class="tile" onclick="renderPage('followups')"><div class="label">Today's follow-ups</div><div class="value">${myToday.length}</div></div>
      <div class="tile ${myOverdue.length>0?'warn':''}" onclick="renderPage('followups')"><div class="label">Overdue</div><div class="value">${myOverdue.length}</div></div>
      <div class="tile" onclick="renderPage('followups')"><div class="label">Due this week</div><div class="value">${myWeek.length}</div></div>
      <div class="tile"><div class="label">Visits logged (this month)</div><div class="value">${myVisitsThisMonth.length}</div></div>
    </div>
    <div class="grid-2">
      <div class="panel">
        <div class="panel-head"><h2>Follow-ups due</h2><span class="see-all" onclick="renderPage('followups')">See all</span></div>
        ${dueRows.length ? `
        <table class="ledger">
          <thead><tr><th>Factory</th><th>Task</th><th>Due</th><th>Priority</th></tr></thead>
          <tbody>
            ${dueRows.map(fu => {
              const f = getFactory(fu.factory_id);
              const days = daysBetween(fu.due_date);
              const dueLabel = days < 0 ? `${Math.abs(days)} day${Math.abs(days)===1?'':'s'} overdue` : days===0 ? 'Today' : formatDate(fu.due_date);
              const dueStyle = days < 0 ? 'color:var(--danger)' : '';
              return `<tr onclick="openFollowUpModal('${fu.id}')" style="cursor:pointer;">
                <td class="factory-name">${f ? f.factory_name : '—'}</td>
                <td>${fu.task}</td>
                <td class="rec-id" style="${dueStyle}">${dueLabel}</td>
                <td><span class="priority-dot ${fu.priority.toLowerCase()}"></span>${fu.priority}</td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>` : `<div class="empty" style="border:none;"><p>Nothing due right now — nice work.</p></div>`}
      </div>
      <div class="panel">
        <div class="panel-head"><h2>Recent activity</h2></div>
        ${recentVisits.length ? `
        <div class="feed">
          ${recentVisits.map(v => {
            const f = getFactory(v.factory_id);
            const empName = getEmployeeName(v.employee_id);
            const isMe = v.employee_id === myId;
            return `<div class="feed-item"><div class="feed-avatar">${initials(empName)}</div><div class="feed-body"><p><span class="who">${isMe ? 'You' : empName}</span> logged a visit at ${f ? f.factory_name : 'a factory'}</p><div class="when">${timeAgo(v.created_at)}</div></div></div>`;
          }).join('')}
        </div>` : `<div class="empty" style="border:none;"><p>No visits logged yet. Once you log one, it'll show up here.</p></div>`}
      </div>
    </div>
  `;
}

function managementDashboard(){
  const activeFactories = sampleFactories.filter(f=>!f.is_deleted);
  const openFollowUps = sampleFollowUps.filter(f=>f.status!=='Completed');
  const overdueFollowUps = openFollowUps.filter(f=>daysBetween(f.due_date)<0);
  const visitsThisMonth = sampleVisits.filter(v=>isThisMonth(v.visit_date));

  // needs attention: overdue follow-ups + factories quiet for 60+ days
  const attentionRows = [];
  overdueFollowUps.slice(0,5).forEach(fu=>{
    const f = getFactory(fu.factory_id);
    const days = Math.abs(daysBetween(fu.due_date));
    attentionRows.push({ factory: f ? f.factory_name : '—', issue: `Follow-up ${days} day${days===1?'':'s'} overdue`, owner: getEmployeeName(fu.responsible_employee_id) });
  });
  activeFactories.forEach(f=>{
    const last = getLastVisitDate(f.id);
    if(last){
      const days = Math.abs(daysBetween(last));
      if(days >= 60) attentionRows.push({ factory: f.factory_name, issue: `No visit logged in ${days} days`, owner: '—' });
    }
  });

  // visits this month, grouped by employee
  const visitCounts = {};
  visitsThisMonth.forEach(v=>{ visitCounts[v.employee_id] = (visitCounts[v.employee_id]||0) + 1; });
  const visitLeaderboard = Object.entries(visitCounts)
    .map(([empId, count])=>({ name: getEmployeeName(empId), count }))
    .sort((a,b)=>b.count-a.count);

  return `
    <div class="page-head">
      <h1>Overview</h1>
      <div class="date">${today}</div>
    </div>
    <div class="tiles">
      <div class="tile" onclick="renderPage('factories')"><div class="label">Total factories</div><div class="value">${activeFactories.length}</div></div>
      <div class="tile" onclick="renderPage('followups')"><div class="label">Pending follow-ups</div><div class="value">${openFollowUps.length}</div></div>
      <div class="tile ${overdueFollowUps.length>0?'warn':''}" onclick="renderPage('followups')"><div class="label">Overdue follow-ups</div><div class="value">${overdueFollowUps.length}</div></div>
      <div class="tile"><div class="label">Visits this month</div><div class="value">${visitsThisMonth.length}</div></div>
    </div>
    <div class="grid-2">
      <div class="panel">
        <div class="panel-head"><h2>Needs attention</h2></div>
        ${attentionRows.length ? `
        <table class="ledger">
          <thead><tr><th>Factory</th><th>Issue</th><th>Owner</th></tr></thead>
          <tbody>
            ${attentionRows.slice(0,8).map(r=>`<tr><td class="factory-name">${r.factory}</td><td>${r.issue}</td><td class="rec-id">${r.owner}</td></tr>`).join('')}
          </tbody>
        </table>` : `<div class="empty" style="border:none;"><p>Nothing needs attention right now.</p></div>`}
      </div>
      <div class="panel">
        <div class="panel-head"><h2>Visits this month by employee</h2></div>
        ${visitLeaderboard.length ? `
        <table class="ledger">
          <thead><tr><th>Employee</th><th>Visits</th></tr></thead>
          <tbody>
            ${visitLeaderboard.map(r=>`<tr><td>${r.name}</td><td class="rec-id">${r.count}</td></tr>`).join('')}
          </tbody>
        </table>` : `<div class="empty" style="border:none;"><p>No visits logged yet this month.</p></div>`}
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
        <div class="more-sheet-item" onclick="openProfilePage(); closeMoreSheet();"><i class="ti ti-user-circle"></i> My Profile</div>
        <div class="more-sheet-divider"></div>
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

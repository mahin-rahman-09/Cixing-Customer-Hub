function doLogin(){
  document.getElementById('login-view').classList.add('hidden');
  document.getElementById('app-view').classList.add('active');
  renderPage('home');
  updateFollowUpBadge();
}

document.querySelectorAll('.nav-item').forEach(item=>{
  item.addEventListener('click', ()=>{
    document.querySelectorAll('.nav-item').forEach(i=>i.classList.remove('active'));
    item.classList.add('active');
    renderPage(item.dataset.page);
  });
});

let currentRole = 'sales';
function setRole(r){
  currentRole = r;
  if(r==='manager'){
    document.getElementById('user-initials').textContent='NA';
    document.getElementById('user-name').textContent='Nasrin Akter';
    document.getElementById('user-role').textContent='Sales manager';
  } else {
    document.getElementById('user-initials').textContent='RH';
    document.getElementById('user-name').textContent='Rafiqul Haque';
    document.getElementById('user-role').textContent='Sales exec';
  }
  const active = document.querySelector('.nav-item.active');
  renderPage(active ? active.dataset.page : 'home');
}

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

function salesDashboard(){
  return `
    <div class="page-head">
      <h1>Good morning, Rafiqul</h1>
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

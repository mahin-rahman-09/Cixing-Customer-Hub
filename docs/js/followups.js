// ============================================================
// FOLLOW-UP LIST
// The daily habit screen: Today / This Week / Overdue / All.
// One click to mark complete — this is the single interaction
// that most directly replaces "crossing it off a notebook."
// ============================================================

let followUpTab = 'today';

function todayStr(){ return new Date().toISOString().split('T')[0]; }

function daysBetween(dateStr){
  const d = new Date(dateStr);
  const t = new Date(todayStr());
  return Math.round((d - t) / (1000*60*60*24));
}

function categorizeFollowUps(){
  const open = sampleFollowUps.filter(f => f.status !== 'Completed');
  return {
    today: open.filter(f => daysBetween(f.due_date) === 0),
    week: open.filter(f => daysBetween(f.due_date) >= 0 && daysBetween(f.due_date) <= 7),
    overdue: open.filter(f => daysBetween(f.due_date) < 0),
    all: sampleFollowUps,
  };
}

function renderFollowUpsPage(){
  followUpTab = 'today';
  const c = document.getElementById('content');
  c.innerHTML = `
    <div class="page-head"><h1>Follow-ups</h1></div>
    <div class="tabs" id="followup-tabs">
      <div class="tab" data-ftab="today">Today</div>
      <div class="tab" data-ftab="week">This week</div>
      <div class="tab" data-ftab="overdue">Overdue</div>
      <div class="tab" data-ftab="all">All</div>
    </div>
    <div class="panel" id="followup-list-panel"></div>
  `;
  document.querySelectorAll('#followup-tabs .tab').forEach(t=>{
    t.addEventListener('click', ()=>{
      followUpTab = t.dataset.ftab;
      renderFollowUpTabs();
      renderFollowUpList();
    });
  });
  renderFollowUpTabs();
  renderFollowUpList();
}

function renderFollowUpTabs(){
  const cats = categorizeFollowUps();
  const counts = { today: cats.today.length, week: cats.week.length, overdue: cats.overdue.length, all: cats.all.length };
  document.querySelectorAll('#followup-tabs .tab').forEach(t=>{
    const key = t.dataset.ftab;
    t.classList.toggle('active', key===followUpTab);
    t.innerHTML = `${labelFor(key)} <span class="tab-count" style="${key==='overdue' && counts.overdue>0 ? 'background:var(--danger-light);color:var(--danger);' : ''}">${counts[key]}</span>`;
  });
}
function labelFor(key){
  return { today:'Today', week:'This week', overdue:'Overdue', all:'All' }[key];
}

function renderFollowUpList(){
  const cats = categorizeFollowUps();
  let rows = cats[followUpTab].slice().sort((a,b)=> new Date(a.due_date) - new Date(b.due_date));

  const panel = document.getElementById('followup-list-panel');
  if(rows.length === 0){
    panel.innerHTML = `<div class="empty" style="border:none;"><i class="ti ti-checklist"></i><h3>Nothing here</h3><p>${followUpTab==='overdue' ? "No overdue follow-ups — nice work." : "No follow-ups in this view right now."}</p></div>`;
    return;
  }

  panel.innerHTML = `
    <table class="ledger">
      <thead><tr><th>Factory</th><th>Task</th><th>Due</th><th>Priority</th><th>Status</th><th></th></tr></thead>
      <tbody>
        ${rows.map(fu => followUpRow(fu)).join('')}
      </tbody>
    </table>
  `;
}

function followUpRow(fu){
  const f = getFactory(fu.factory_id);
  const days = daysBetween(fu.due_date);
  let dueLabel, dueStyle = '';
  if(fu.status==='Completed'){ dueLabel = formatDate(fu.due_date); }
  else if(days < 0){ dueLabel = `${Math.abs(days)} day${Math.abs(days)===1?'':'s'} overdue`; dueStyle='color:var(--danger);'; }
  else if(days === 0){ dueLabel = 'Today'; dueStyle='color:var(--steel-dark);font-weight:500;'; }
  else if(days === 1){ dueLabel = 'Tomorrow'; }
  else { dueLabel = formatDate(fu.due_date); }

  const priorityClass = fu.priority.toLowerCase();
  const isDone = fu.status === 'Completed';

  return `
    <tr style="${isDone ? 'opacity:.55;' : ''}">
      <td class="factory-name">${f ? f.factory_name : '—'}</td>
      <td style="${isDone ? 'text-decoration:line-through;' : ''}">${fu.task}</td>
      <td class="rec-id" style="${dueStyle}">${dueLabel}</td>
      <td><span class="priority-dot ${priorityClass}"></span>${fu.priority}</td>
      <td><span class="stage-pill ${isDone ? 'success' : ''}">${fu.status}</span></td>
      <td style="text-align:right;white-space:nowrap;">
        ${!isDone ? `
          <button class="row-action" title="Mark complete" onclick="completeFollowUp('${fu.id}')"><i class="ti ti-check"></i></button>
          <button class="row-action" title="Log a visit" onclick="openVisitModal('${fu.factory_id}')"><i class="ti ti-clipboard-plus"></i></button>
        ` : ''}
      </td>
    </tr>
  `;
}

function completeFollowUp(id){
  const fu = sampleFollowUps.find(f=>f.id===id);
  if(fu){
    fu.status = 'Completed';
    fu.completed_at = new Date().toISOString();
  }
  renderFollowUpTabs();
  renderFollowUpList();
  updateFollowUpBadge();
  showToast('Follow-up marked complete.');
}

function updateFollowUpBadge(){
  const badge = document.getElementById('followup-badge');
  if(!badge) return;
  const cats = categorizeFollowUps();
  const count = cats.today.length + cats.overdue.length;
  badge.textContent = count;
  badge.style.display = count > 0 ? 'inline-block' : 'none';
}

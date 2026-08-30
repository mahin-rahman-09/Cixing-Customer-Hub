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
      <thead><tr><th>Factory</th><th>Task</th><th>Due</th><th>Owner</th><th>Priority</th><th>Status</th><th></th></tr></thead>
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
      <td class="factory-name" data-label="Factory">${f ? f.factory_name : '—'}</td>
      <td data-label="Task" class="followup-task" style="${isDone ? 'text-decoration:line-through;' : ''}" onclick="openFollowUpModal('${fu.id}')">${fu.task}</td>
      <td class="rec-id" data-label="Due" style="${dueStyle}">${dueLabel}</td>
      <td data-label="Owner" class="rec-id">${fu.responsible_employee || '—'}</td>
      <td data-label="Priority"><span class="priority-dot ${priorityClass}"></span>${fu.priority}</td>
      <td data-label="Status"><span class="stage-pill ${isDone ? 'success' : ''}">${fu.status}</span></td>
      <td data-label="" style="text-align:right;white-space:nowrap;">
        <button class="row-action" title="Edit" onclick="openFollowUpModal('${fu.id}')"><i class="ti ti-pencil"></i></button>
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

// ---- Edit / reassign modal ----
function openFollowUpModal(id){
  const fu = sampleFollowUps.find(f=>f.id===id);
  if(!fu) return;
  const f = getFactory(fu.factory_id);

  const root = document.getElementById('followup-modal-root') || (() => {
    const d = document.createElement('div');
    d.id = 'followup-modal-root';
    document.body.appendChild(d);
    return d;
  })();

  root.innerHTML = `
    <div class="modal-overlay" onclick="if(event.target===this) closeFollowUpModal()">
      <div class="modal-card">
        <h3>Edit follow-up</h3>
        <p class="modal-sub">${f ? f.factory_name : ''}</p>

        <div class="field">
          <label>Task *</label>
          <input id="fu-task" value="${(fu.task||'').replace(/"/g,'&quot;')}">
        </div>
        <div class="field-row">
          <div class="field">
            <label>Due date</label>
            <input type="date" id="fu-due-date" value="${fu.due_date}">
          </div>
          <div class="field">
            <label>Priority</label>
            <select id="fu-priority">
              <option value="Low" ${fu.priority==='Low'?'selected':''}>Low</option>
              <option value="Medium" ${fu.priority==='Medium'?'selected':''}>Medium</option>
              <option value="High" ${fu.priority==='High'?'selected':''}>High</option>
            </select>
          </div>
        </div>
        <div class="field-row">
          <div class="field">
            <label>Assigned to</label>
            <select id="fu-employee">
              ${sampleEmployees.map(e=>`<option value="${e}" ${fu.responsible_employee===e?'selected':''}>${e}</option>`).join('')}
            </select>
          </div>
          <div class="field">
            <label>Status</label>
            <select id="fu-status">
              <option value="Pending" ${fu.status==='Pending'?'selected':''}>Pending</option>
              <option value="In Progress" ${fu.status==='In Progress'?'selected':''}>In Progress</option>
              <option value="Completed" ${fu.status==='Completed'?'selected':''}>Completed</option>
            </select>
          </div>
        </div>

        <div class="modal-actions">
          <button class="btn-tertiary" onclick="closeFollowUpModal()">Cancel</button>
          <button class="btn-primary" style="width:auto;padding:9px 18px;" onclick="submitFollowUpEdit('${id}')">Save changes</button>
        </div>
      </div>
    </div>
  `;
  document.getElementById('fu-task').focus();
}

function closeFollowUpModal(){
  const root = document.getElementById('followup-modal-root');
  if(root) root.innerHTML = '';
}

function submitFollowUpEdit(id){
  const fu = sampleFollowUps.find(f=>f.id===id);
  if(!fu) return;
  const task = document.getElementById('fu-task').value.trim();
  if(!task){ alert('Task is required.'); return; }

  fu.task = task;
  fu.due_date = document.getElementById('fu-due-date').value;
  fu.priority = document.getElementById('fu-priority').value;
  fu.responsible_employee = document.getElementById('fu-employee').value;
  const newStatus = document.getElementById('fu-status').value;
  if(newStatus === 'Completed' && fu.status !== 'Completed'){ fu.completed_at = new Date().toISOString(); }
  fu.status = newStatus;

  closeFollowUpModal();
  renderFollowUpTabs();
  renderFollowUpList();
  updateFollowUpBadge();
  showToast('Follow-up updated.');
}

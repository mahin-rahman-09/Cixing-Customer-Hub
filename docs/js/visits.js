// ============================================================
// VISIT LOGGING FORM
// The single most-used screen in the system. Opens as an overlay
// panel so it never requires leaving whatever page you were on.
// Pre-fills factory + contact when opened from a Factory 360 page.
// ============================================================

const VISIT_TYPES = [
  'New Prospect Introduction','Relationship Building','Requirement Gathering','Factory Assessment',
  'Technical Discussion','Machine Presentation','Sample Discussion','Demonstration',
  'Quotation Submission','Quotation Follow-Up','Price Negotiation','Decision-Maker Meeting',
  'Purchase Intent Confirmation','Order Finalization','Installation Coordination','Training Session',
  'Technical Support','Maintenance Visit','Expansion Discussion','General Follow-Up'
];

let visitFormFactoryId = null;
let visitFormContactId = null;
let visitFormFollowUpDate = '';

function openVisitModal(prefillFactoryId){
  visitFormFactoryId = prefillFactoryId || null;
  visitFormContactId = null;
  visitFormFollowUpDate = '';

  const root = document.getElementById('visit-modal-root') || (() => {
    const d = document.createElement('div');
    d.id = 'visit-modal-root';
    document.body.appendChild(d);
    return d;
  })();

  root.innerHTML = `
    <div class="modal-overlay" onclick="if(event.target===this) closeVisitModal()">
      <div class="modal-card visit-modal">
        <h3>Log a visit</h3>
        <p class="modal-sub">Takes under a minute. Fill what you know — you can always add more later.</p>

        <div class="field">
          <label>Factory *</label>
          <div class="autocomplete-wrap">
            <input id="visit-factory-input" placeholder="Search factory..." autocomplete="off"
              value="${visitFormFactoryId ? getFactory(visitFormFactoryId).factory_name : ''}"
              oninput="onVisitFactoryInput(this.value)">
            <div id="visit-factory-dropdown" class="autocomplete-dropdown"></div>
          </div>
        </div>

        <div class="field">
          <label>Contact met</label>
          <select id="visit-contact-select">
            <option value="">— Not specified —</option>
          </select>
        </div>

        <div class="field">
          <label>Visit type *</label>
          <select id="visit-type-select">
            ${VISIT_TYPES.map(t=>`<option value="${t}">${t}</option>`).join('')}
          </select>
        </div>

        <div class="field">
          <label>Discussion summary</label>
          <textarea id="visit-summary" rows="3" placeholder="What was discussed..."></textarea>
        </div>

        <div class="field">
          <label>Outcome</label>
          <input id="visit-outcome" placeholder="e.g. Positive, needs pricing follow-up">
        </div>

        <div class="field">
          <label>Next action</label>
          <input id="visit-next-action" placeholder="e.g. Send revised quotation">
        </div>

        <div class="field">
          <label>Follow-up date</label>
          <div class="date-chips">
            <button type="button" class="chip" onclick="setFollowUpChip(1,this)">Tomorrow</button>
            <button type="button" class="chip" onclick="setFollowUpChip(3,this)">+3 days</button>
            <button type="button" class="chip" onclick="setFollowUpChip(7,this)">+1 week</button>
            <button type="button" class="chip" onclick="setFollowUpChip(14,this)">+2 weeks</button>
            <input type="date" id="visit-followup-date" onchange="visitFormFollowUpDate=this.value; document.querySelectorAll('.chip').forEach(c=>c.classList.remove('chip-active'))">
          </div>
        </div>

        <div class="modal-actions">
          <button class="btn-tertiary" onclick="closeVisitModal()">Cancel</button>
          <button class="btn-primary" style="width:auto;padding:9px 20px;" onclick="submitVisit()">Save visit</button>
        </div>
      </div>
    </div>
  `;

  if(visitFormFactoryId){ populateContactSelect(visitFormFactoryId); }

  document.getElementById('visit-factory-input').focus();
}

function onVisitFactoryInput(value){
  visitFormFactoryId = null;
  const dropdown = document.getElementById('visit-factory-dropdown');
  const term = value.trim().toLowerCase();
  if(!term){ dropdown.innerHTML=''; dropdown.classList.remove('open'); return; }
  const matches = sampleFactories.filter(f => f.factory_name.toLowerCase().includes(term)).slice(0,6);
  dropdown.innerHTML = matches.map(f => `
    <div class="autocomplete-item" onclick="selectVisitFactory('${f.id}')">${f.factory_name}<span class="rec-id"> · ${f.location||''}</span></div>
  `).join('') + (matches.length===0 ? `<div class="autocomplete-item autocomplete-add" onclick="quickAddFactory('${value.replace(/'/g,"\\'")}')"><i class="ti ti-plus"></i> Add "${value}" as new factory</div>` : '');
  dropdown.classList.add('open');
}

function selectVisitFactory(id){
  visitFormFactoryId = id;
  document.getElementById('visit-factory-input').value = getFactory(id).factory_name;
  document.getElementById('visit-factory-dropdown').classList.remove('open');
  populateContactSelect(id);
}

function quickAddFactory(name){
  const id = 'f' + (sampleFactories.length + 1) + '_' + Date.now();
  sampleFactories.push({ id, factory_name:name, group_name:'', location:'', factory_type:'', opportunity_score:0, current_machine_brands:'', existing_cixing_machines:'', notes:'', last_visit_date:'' });
  selectVisitFactory(id);
}

function populateContactSelect(factoryId){
  const sel = document.getElementById('visit-contact-select');
  const contacts = getContactsForFactory(factoryId);
  sel.innerHTML = `<option value="">— Not specified —</option>` +
    contacts.map(c=>`<option value="${c.id}">${c.name}${c.is_decision_maker?' (Decision maker)':''}</option>`).join('');
}

function setFollowUpChip(daysFromNow, btn){
  document.querySelectorAll('.chip').forEach(c=>c.classList.remove('chip-active'));
  btn.classList.add('chip-active');
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  visitFormFollowUpDate = d.toISOString().split('T')[0];
  document.getElementById('visit-followup-date').value = visitFormFollowUpDate;
}

function closeVisitModal(){
  const root = document.getElementById('visit-modal-root');
  if(root) root.innerHTML = '';
}

function submitVisit(){
  if(!visitFormFactoryId){
    alert('Please select a factory (or add it as new) before saving.');
    return;
  }
  const visitType = document.getElementById('visit-type-select').value;
  const summary = document.getElementById('visit-summary').value.trim();
  const outcome = document.getElementById('visit-outcome').value.trim();
  const nextAction = document.getElementById('visit-next-action').value.trim();
  const followUpDate = document.getElementById('visit-followup-date').value;
  const contactId = document.getElementById('visit-contact-select').value || null;

  const today = new Date().toISOString().split('T')[0];
  const visitId = 'v' + Date.now();

  sampleVisits.push({
    id: visitId,
    factory_id: visitFormFactoryId,
    contact_id: contactId,
    employee: currentRole==='manager' ? 'Nasrin Akter' : 'Rafiqul Haque',
    visit_date: today,
    visit_type: visitType,
    discussion_summary: summary,
    outcome: outcome,
    next_action: nextAction,
    follow_up_date: followUpDate
  });

  // update the factory's last_visit_date
  const factory = getFactory(visitFormFactoryId);
  if(factory) factory.last_visit_date = today;

  // auto-create a follow-up if a next action + date were given
  if(nextAction && followUpDate){
    sampleFollowUps.push({
      id: 'fu' + Date.now(),
      factory_id: visitFormFactoryId,
      task: nextAction,
      responsible_employee: currentRole==='manager' ? 'Nasrin Akter' : 'Rafiqul Haque',
      due_date: followUpDate,
      priority: 'Medium',
      status: 'Pending'
    });
  }

  closeVisitModal();
  showToast(`Visit saved${followUpDate ? '. Follow-up set for ' + formatDate(followUpDate) + '.' : '.'}`);

  // refresh whatever's on screen
  if(currentFactoryId === visitFormFactoryId && document.getElementById('f360-tab-content')){
    currentFactoryTab = 'visits';
    renderFactory360();
  } else if(document.querySelector('.nav-item.active')?.dataset.page === 'home'){
    renderPage('home');
  }
}

function showToast(msg){
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(()=>t.classList.add('toast-show'), 10);
  setTimeout(()=>{ t.classList.remove('toast-show'); setTimeout(()=>t.remove(), 300); }, 3000);
}

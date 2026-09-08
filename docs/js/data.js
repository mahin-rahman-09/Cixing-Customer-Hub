// ============================================================
// DATA LAYER
// Factories, Contacts, Visits, and Follow-Ups all load from and
// write to Supabase now — this is the full V1 data layer, nothing
// left running on fake sample data.
//
// Employees (for "who logged this visit" / "who's this follow-up
// assigned to") load from the real user_profiles table too, so the
// list only ever shows people who actually have accounts.
// ============================================================

let sampleFactories = [];
let sampleContacts = [];
let sampleVisits = [];
let sampleFollowUps = [];
let sampleEmployees = []; // [{id, full_name, role}, ...] — real accounts, loaded at login
let dataLoaded = false;

// ---- Load everything real from Supabase ----
async function loadAllData(){
  const [factoriesRes, contactsRes, visitsRes, followUpsRes, employeesRes] = await Promise.all([
    supabaseClient.from('factories').select('*').order('factory_name'),
    supabaseClient.from('contacts').select('*'),
    supabaseClient.from('visits').select('*').order('visit_date', { ascending: false }),
    supabaseClient.from('follow_ups').select('*'),
    supabaseClient.from('user_profiles').select('id, full_name, role').eq('is_active', true).order('full_name'),
  ]);

  if(factoriesRes.error){ console.error('Failed to load factories:', factoriesRes.error); customAlert('Could not load factories. Check the console for details.', {error:true}); }
  else { sampleFactories = factoriesRes.data; }

  if(contactsRes.error){ console.error('Failed to load contacts:', contactsRes.error); }
  else { sampleContacts = contactsRes.data; }

  if(visitsRes.error){ console.error('Failed to load visits:', visitsRes.error); }
  else { sampleVisits = visitsRes.data; }

  if(followUpsRes.error){ console.error('Failed to load follow-ups:', followUpsRes.error); }
  else { sampleFollowUps = followUpsRes.data; }

  if(employeesRes.error){ console.error('Failed to load employees:', employeesRes.error); }
  else { sampleEmployees = employeesRes.data; }

  dataLoaded = true;
}

// kept for backward compatibility with any older call sites
async function loadFactoriesAndContacts(){ return loadAllData(); }

// ---- small helpers other files rely on ----
function getFactory(id){ return sampleFactories.find(f=>f.id===id); }
function getContactsForFactory(id){ return sampleContacts.filter(c=>c.factory_id===id); }
function getVisitsForFactory(id){ return sampleVisits.filter(v=>v.factory_id===id).sort((a,b)=> new Date(b.visit_date)-new Date(a.visit_date)); }
function getFollowUpsForFactory(id){ return sampleFollowUps.filter(f=>f.factory_id===id); }
function getContact(id){ return sampleContacts.find(c=>c.id===id); }
function getEmployee(id){ return sampleEmployees.find(e=>e.id===id); }
function getEmployeeName(id){ const e = getEmployee(id); return e ? e.full_name : '—'; }
function getLastVisitDate(factoryId){
  const visits = getVisitsForFactory(factoryId); // already sorted newest-first
  return visits.length ? visits[0].visit_date : null;
}

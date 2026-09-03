// ============================================================
// DATA LAYER
// Factories and Contacts now load from and write to Supabase —
// this is the first real database wiring. Visits and Follow-Ups
// are still local sample data for now; that's the next step.
//
// Everything else in the app reads through sampleFactories /
// sampleContacts and the helper functions below, so the rendering
// code in factories.js / contacts.js didn't need to change shape —
// only *where the data comes from* changed.
// ============================================================

let sampleFactories = [];
let sampleContacts = [];
let dataLoaded = false;

// Visits and Follow-Ups: still sample data, wired to Supabase in the next step.
let sampleVisits = [];
let sampleEmployees = ['Rafiqul Haque', 'Nasrin Akter', 'Mahmud Kabir']; // placeholder until real employee list is wired
let sampleFollowUps = [];

// ---- Load real data from Supabase ----
async function loadFactoriesAndContacts(){
  const [factoriesRes, contactsRes] = await Promise.all([
    supabaseClient.from('factories').select('*').order('factory_name'),
    supabaseClient.from('contacts').select('*'),
  ]);

  if(factoriesRes.error){
    console.error('Failed to load factories:', factoriesRes.error);
    alert('Could not load factories from the database. Check the browser console for details.');
  } else {
    sampleFactories = factoriesRes.data;
  }

  if(contactsRes.error){
    console.error('Failed to load contacts:', contactsRes.error);
  } else {
    sampleContacts = contactsRes.data;
  }

  dataLoaded = true;
}

// small helpers other files rely on
function getFactory(id){ return sampleFactories.find(f=>f.id===id); }
function getContactsForFactory(id){ return sampleContacts.filter(c=>c.factory_id===id); }
function getVisitsForFactory(id){ return sampleVisits.filter(v=>v.factory_id===id).sort((a,b)=> new Date(b.visit_date)-new Date(a.visit_date)); }
function getContact(id){ return sampleContacts.find(c=>c.id===id); }

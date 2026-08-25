// ============================================================
// SAMPLE DATA
// This file stands in for the database until Supabase is wired up.
// Every function elsewhere reads from these arrays. When we connect
// Supabase, this file gets deleted and replaced with real queries —
// nothing else should need to change if we keep function names the same.
// ============================================================

let sampleFactories = [
  { id:'f1', factory_name:'Anwar Sweaters Ltd.', group_name:'Anwar Group', location:'Gazipur', factory_type:'Sweater', total_employees:1200, opportunity_score:5, current_machine_brands:'Stoll, Shima Seiki', existing_cixing_machines:'—', notes:'Long-standing prospect, strong relationship with GM.', last_visit_date:'2026-08-20' },
  { id:'f2', factory_name:'Delta Knitwear Group', group_name:'Delta Group', location:'Narayanganj', factory_type:'Composite Knitwear', total_employees:2400, opportunity_score:4, current_machine_brands:'Stoll', existing_cixing_machines:'6 units (CX-252)', notes:'Existing customer, evaluating expansion.', last_visit_date:'2026-08-23' },
  { id:'f3', factory_name:'Padma Fashions', group_name:'—', location:'Savar', factory_type:'Sweater', total_employees:650, opportunity_score:3, current_machine_brands:'Flying Tiger', existing_cixing_machines:'—', notes:'New prospect from trade fair introduction.', last_visit_date:'2026-08-22' },
  { id:'f4', factory_name:'Sonar Bangla Textiles', group_name:'Sonar Bangla Group', location:'Chattogram', factory_type:'Sweater', total_employees:1800, opportunity_score:4, current_machine_brands:'Stoll, Cixing', existing_cixing_machines:'3 units (CX-201)', notes:'PO discussed, awaiting confirmation.', last_visit_date:'2026-08-18' },
  { id:'f5', factory_name:'Green Valley Apparels', group_name:'—', location:'Ashulia', factory_type:'Knitwear', total_employees:900, opportunity_score:2, current_machine_brands:'Local brands', existing_cixing_machines:'—', notes:'Relationship gone quiet, needs a check-in visit.', last_visit_date:'2026-06-15' },
  { id:'f6', factory_name:'Meghna Knit Composite', group_name:'Meghna Group', location:'Gazipur', factory_type:'Composite Knitwear', total_employees:3100, opportunity_score:5, current_machine_brands:'Shima Seiki', existing_cixing_machines:'—', notes:'Large opportunity, technical team engaged.', last_visit_date:'2026-08-10' },
  { id:'f7', factory_name:'Bengal Fine Sweaters', group_name:'—', location:'Narayanganj', factory_type:'Sweater', total_employees:420, opportunity_score:2, current_machine_brands:'Flying Tiger', existing_cixing_machines:'—', notes:'', last_visit_date:'2026-07-02' },
  { id:'f8', factory_name:'Jamuna Textile Mills', group_name:'Jamuna Group', location:'Dhaka', factory_type:'Sweater', total_employees:1500, opportunity_score:3, current_machine_brands:'Stoll', existing_cixing_machines:'1 unit (CX-252)', notes:'First unit installed, watching for expansion signal.', last_visit_date:'2026-08-05' },
];

let sampleContacts = [
  { id:'c1', factory_id:'f1', name:'Mohammad Anwar Hossain', designation:'General Manager', department:'Management', phone:'+8801711000001', whatsapp:'+8801711000001', email:'anwar@anwarsweaters.com', is_decision_maker:true },
  { id:'c2', factory_id:'f1', name:'Shafiq Rahman', designation:'Production Manager', department:'Production', phone:'+8801711000002', whatsapp:'+8801711000002', email:'', is_decision_maker:false },
  { id:'c3', factory_id:'f2', name:'Tanvir Ahmed', designation:'Director', department:'Management', phone:'+8801811000003', whatsapp:'+8801811000003', email:'tanvir@deltaknitwear.com', is_decision_maker:true },
  { id:'c4', factory_id:'f2', name:'Kamal Uddin', designation:'Maintenance Head', department:'Engineering', phone:'+8801811000004', whatsapp:'+8801811000004', email:'', is_decision_maker:false },
  { id:'c5', factory_id:'f3', name:'Farhana Islam', designation:'Owner', department:'Management', phone:'+8801911000005', whatsapp:'+8801911000005', email:'', is_decision_maker:true },
  { id:'c6', factory_id:'f4', name:'Ripon Chowdhury', designation:'CEO', department:'Management', phone:'+8801611000006', whatsapp:'+8801611000006', email:'ripon@sonarbangla.com', is_decision_maker:true },
  { id:'c7', factory_id:'f5', name:'Nasima Begum', designation:'Merchandising Manager', department:'Merchandising', phone:'+8801511000007', whatsapp:'', email:'', is_decision_maker:false },
  { id:'c8', factory_id:'f6', name:'Iqbal Karim', designation:'Managing Director', department:'Management', phone:'+8801311000008', whatsapp:'+8801311000008', email:'iqbal@meghnaknit.com', is_decision_maker:true },
];

let sampleVisits = [
  { id:'v1', factory_id:'f2', contact_id:'c3', employee:'Nasrin Akter', visit_date:'2026-08-23', visit_type:'Expansion Discussion', discussion_summary:'Discussed adding 4 more CX-252 units for the new floor. Tanvir wants a formal quotation by next week.', outcome:'Positive, high interest', next_action:'Prepare quotation for 4 units', follow_up_date:'2026-08-27' },
  { id:'v2', factory_id:'f3', contact_id:'c5', employee:'Rafiqul Haque', visit_date:'2026-08-22', visit_type:'Machine Presentation', discussion_summary:'Presented CX-201 and CX-252 lineup. Farhana is comparing against Flying Tiger pricing.', outcome:'Needs more time to decide', next_action:'Confirm demo date at our showroom', follow_up_date:'2026-08-25' },
  { id:'v3', factory_id:'f1', contact_id:'c1', employee:'Rafiqul Haque', visit_date:'2026-08-20', visit_type:'Price Negotiation', discussion_summary:'Anwar pushed back on pricing, asked for a 5% reduction on bulk order of 10 units.', outcome:'Negotiation ongoing', next_action:'Send revised quotation', follow_up_date:'2026-08-25' },
  { id:'v4', factory_id:'f4', contact_id:'c6', employee:'Rafiqul Haque', visit_date:'2026-08-18', visit_type:'Order Finalization', discussion_summary:'Ripon confirmed verbal agreement, PO expected this week pending board sign-off.', outcome:'Very positive', next_action:'Follow up on PO status', follow_up_date:'2026-08-25' },
  { id:'v5', factory_id:'f6', contact_id:'c8', employee:'Mahmud Kabir', visit_date:'2026-08-10', visit_type:'Technical Discussion', discussion_summary:'Technical team reviewed factory floor layout for machine placement feasibility.', outcome:'Technical fit confirmed', next_action:'Schedule decision-maker meeting', follow_up_date:'2026-08-28' },
  { id:'v6', factory_id:'f1', contact_id:'c2', employee:'Rafiqul Haque', visit_date:'2026-08-05', visit_type:'Factory Assessment', discussion_summary:'Assessed floor capacity and power supply for new machine installation.', outcome:'Suitable for installation', next_action:'', follow_up_date:'' },
  { id:'v7', factory_id:'f8', contact_id:null, employee:'Nasrin Akter', visit_date:'2026-08-05', visit_type:'Technical Support', discussion_summary:'Resolved a calibration issue on the installed CX-252 unit.', outcome:'Resolved', next_action:'', follow_up_date:'' },
];

// small helpers other files rely on
function getFactory(id){ return sampleFactories.find(f=>f.id===id); }
function getContactsForFactory(id){ return sampleContacts.filter(c=>c.factory_id===id); }
function getVisitsForFactory(id){ return sampleVisits.filter(v=>v.factory_id===id).sort((a,b)=> new Date(b.visit_date)-new Date(a.visit_date)); }
function getContact(id){ return sampleContacts.find(c=>c.id===id); }

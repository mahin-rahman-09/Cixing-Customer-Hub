// ============================================================
// SUPABASE CLIENT
// Single shared connection used by every other module.
// The anon key below is meant to be public — it has no special
// power on its own. Row-Level Security policies on each table
// (see db/01_v1_schema.sql and any later policy files) are what
// actually decide who can read or write what. Never put the
// service_role key here or anywhere in frontend code.
// ============================================================

const SUPABASE_URL = 'https://fjdjtkkawphndfoikhxf.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZqZGp0a2thd3BobmRmb2lraHhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgwODU1MTAsImV4cCI6MjEwMzY2MTUxMH0.HopnQ8xQxGpvJionh6wx0xcQC_fpr8zEBHeAqPdXBcM';

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

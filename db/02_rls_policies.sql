-- =====================================================
-- Cixing Customer Hub — V1 Row-Level Security Policies
-- Run this AFTER 01_v1_schema.sql, in the same SQL Editor.
-- =====================================================
--
-- Design intent (matches the PRD's role model, Section 4):
-- This is a small, trusted team (5-20 people). The goal of RLS
-- here is NOT complex per-role restriction — it's to make sure
-- nobody outside the app (i.e. without a valid logged-in session)
-- can touch the data at all, even though the anon key is public.
--
-- Every table below: only a signed-in user can read or write
-- anything. There are no hard-delete policies anywhere — the app
-- only ever soft-deletes (is_deleted = true), so even a logged-in
-- user calling the API directly cannot destroy a row.
--
-- Tightening this further (e.g. "salespeople can only edit their
-- own visits") is a reasonable later hardening step once the team
-- is using this daily and we know it won't just cause confusing
-- permission errors mid-rollout — deliberately deferred for now.
-- =====================================================

-- ---------------------------------------------------
-- USER PROFILES
-- ---------------------------------------------------
alter table user_profiles enable row level security;

create policy "Signed-in users can view all profiles"
  on user_profiles for select
  using (auth.role() = 'authenticated');

create policy "Users can update their own profile"
  on user_profiles for update
  using (auth.uid() = id);

-- Note: no insert policy here on purpose. New employee accounts are
-- created by an admin directly in the Supabase dashboard (Authentication
-- tab), then the matching user_profiles row is inserted manually via
-- the SQL Editor. There's no self-signup in this app.

-- ---------------------------------------------------
-- FACTORIES
-- ---------------------------------------------------
alter table factories enable row level security;

create policy "Signed-in users can view factories"
  on factories for select
  using (auth.role() = 'authenticated');

create policy "Signed-in users can add factories"
  on factories for insert
  with check (auth.role() = 'authenticated');

create policy "Signed-in users can edit factories"
  on factories for update
  using (auth.role() = 'authenticated');

-- ---------------------------------------------------
-- CONTACTS
-- ---------------------------------------------------
alter table contacts enable row level security;

create policy "Signed-in users can view contacts"
  on contacts for select
  using (auth.role() = 'authenticated');

create policy "Signed-in users can add contacts"
  on contacts for insert
  with check (auth.role() = 'authenticated');

create policy "Signed-in users can edit contacts"
  on contacts for update
  using (auth.role() = 'authenticated');

-- ---------------------------------------------------
-- VISITS
-- ---------------------------------------------------
alter table visits enable row level security;

create policy "Signed-in users can view visits"
  on visits for select
  using (auth.role() = 'authenticated');

create policy "Signed-in users can add visits"
  on visits for insert
  with check (auth.role() = 'authenticated');

create policy "Signed-in users can edit visits"
  on visits for update
  using (auth.role() = 'authenticated');

-- ---------------------------------------------------
-- FOLLOW-UPS
-- ---------------------------------------------------
alter table follow_ups enable row level security;

create policy "Signed-in users can view follow-ups"
  on follow_ups for select
  using (auth.role() = 'authenticated');

create policy "Signed-in users can add follow-ups"
  on follow_ups for insert
  with check (auth.role() = 'authenticated');

create policy "Signed-in users can edit follow-ups"
  on follow_ups for update
  using (auth.role() = 'authenticated');

-- =====================================================
-- Done. Every table now requires a valid login for any access,
-- and nothing can be hard-deleted through the API.
-- =====================================================

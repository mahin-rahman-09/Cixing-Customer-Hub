-- =====================================================
-- Cixing Customer Hub — Profile fields + avatar storage
-- Run this AFTER 01/02/03.
-- =====================================================

-- ---------------------------------------------------
-- New personal-info columns on user_profiles
-- ---------------------------------------------------
alter table user_profiles add column if not exists photo_url text;
alter table user_profiles add column if not exists designation text;
alter table user_profiles add column if not exists bio text;

-- ---------------------------------------------------
-- Storage bucket for profile photos
-- ---------------------------------------------------
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- Anyone signed in can upload/replace their own avatar file.
-- (Small trusted team — this mirrors the same "authenticated = allowed"
-- philosophy used everywhere else in this schema, not per-user file locking.)
create policy "Signed-in users can upload avatars"
  on storage.objects for insert
  with check (bucket_id = 'avatars' and auth.role() = 'authenticated');

create policy "Signed-in users can update avatars"
  on storage.objects for update
  using (bucket_id = 'avatars' and auth.role() = 'authenticated');

-- Public bucket, so anyone (even logged out) can view a photo via its URL —
-- needed for the photo to actually display as an <img src="..."> in the app.
create policy "Anyone can view avatars"
  on storage.objects for select
  using (bucket_id = 'avatars');

-- =====================================================
-- Done. Profile page is ready to store real data once this runs.
-- =====================================================

-- =====================================================
-- Cixing Customer Hub — Admin-only permanent delete
-- Run this AFTER 01_v1_schema.sql and 02_rls_policies.sql.
-- =====================================================
--
-- By design, nothing could be hard-deleted before this — the app
-- only ever archives (is_deleted = true). That's still the right
-- default for real business data. This adds a narrow exception:
-- an actual admin (checked against user_profiles.role, not just
-- "logged in") can permanently delete a factory or contact —
-- mainly for cleaning up test/junk entries, not everyday use.
-- =====================================================

create policy "Admins can permanently delete factories"
  on factories for delete
  using (
    exists (
      select 1 from user_profiles
      where user_profiles.id = auth.uid()
      and user_profiles.role = 'admin'
    )
  );

create policy "Admins can permanently delete contacts"
  on contacts for delete
  using (
    exists (
      select 1 from user_profiles
      where user_profiles.id = auth.uid()
      and user_profiles.role = 'admin'
    )
  );

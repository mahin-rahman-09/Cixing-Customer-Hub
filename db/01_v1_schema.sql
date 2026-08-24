-- =====================================================
-- Cixing Customer Hub — V1 Schema
-- Run this in Supabase SQL Editor (SQL Editor > New Query)
-- =====================================================

-- Needed for gen_random_uuid()
create extension if not exists pgcrypto;

-- ---------------------------------------------------
-- USER PROFILES (extends Supabase's built-in auth.users)
-- ---------------------------------------------------
create table user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role text not null check (role in ('admin','manager','sales_exec','service_engineer','viewer')),
  phone text,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- ---------------------------------------------------
-- FACTORIES
-- ---------------------------------------------------
create table factories (
  id uuid primary key default gen_random_uuid(),
  factory_name text not null,
  group_name text,
  address text,
  location text,
  website text,
  factory_type text,
  total_employees integer,
  production_capacity text,
  current_machine_brands text,
  existing_cixing_machines text,
  opportunity_score integer check (opportunity_score between 1 and 5),
  notes text,
  is_deleted boolean default false,
  created_by uuid references user_profiles(id),
  created_at timestamptz default now(),
  updated_by uuid references user_profiles(id),
  updated_at timestamptz default now()
);
create index idx_factories_name on factories (factory_name);
create index idx_factories_group on factories (group_name);

-- ---------------------------------------------------
-- CONTACTS
-- ---------------------------------------------------
create table contacts (
  id uuid primary key default gen_random_uuid(),
  factory_id uuid not null references factories(id) on delete cascade,
  name text not null,
  designation text,
  department text,
  phone text,
  whatsapp text,
  email text,
  is_decision_maker boolean default false,
  is_active boolean default true,
  notes text,
  is_deleted boolean default false,
  created_by uuid references user_profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index idx_contacts_factory on contacts (factory_id);

-- ---------------------------------------------------
-- VISITS
-- ---------------------------------------------------
create table visits (
  id uuid primary key default gen_random_uuid(),
  factory_id uuid not null references factories(id) on delete cascade,
  contact_id uuid references contacts(id),
  employee_id uuid not null references user_profiles(id),
  visit_date date not null default current_date,
  visit_type text not null,
  discussion_summary text,
  outcome text,
  next_action text,
  follow_up_date date,
  is_deleted boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index idx_visits_factory on visits (factory_id);
create index idx_visits_employee on visits (employee_id);
create index idx_visits_date on visits (visit_date);

-- ---------------------------------------------------
-- FOLLOW-UPS
-- ---------------------------------------------------
create table follow_ups (
  id uuid primary key default gen_random_uuid(),
  factory_id uuid not null references factories(id) on delete cascade,
  visit_id uuid references visits(id),
  task text not null,
  responsible_employee_id uuid not null references user_profiles(id),
  due_date date not null,
  priority text not null check (priority in ('Low','Medium','High')) default 'Medium',
  status text not null check (status in ('Pending','In Progress','Completed','Overdue')) default 'Pending',
  completed_at timestamptz,
  is_deleted boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index idx_followups_employee on follow_ups (responsible_employee_id);
create index idx_followups_due on follow_ups (due_date);

-- =====================================================
-- Done. Next: we'll enable Row-Level Security (Step 2).
-- =====================================================

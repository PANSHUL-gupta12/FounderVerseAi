-- FounderVerse AI Database Schema
-- Run this in your Supabase SQL Editor to set up the database.

-- 1. Create Organizations Table
CREATE TABLE organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create Members Table
CREATE TABLE organization_members (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references organizations(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  role text check (role in ('admin', 'member')) default 'member',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (org_id, user_id)
);

-- 3. Create Startups Table
CREATE TABLE startups (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  org_id uuid references organizations(id),
  idea text not null,
  initial_budget numeric,
  marketing_budget numeric,
  target_audience text,
  pricing_model text,
  timeline text,
  risk_appetite integer,
  analysis_data jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Create Decisions Table
CREATE TABLE decisions (
  id uuid primary key default gen_random_uuid(),
  startup_id uuid references startups(id) on delete cascade,
  current_state text,
  revenue numeric,
  team_size integer,
  stage text,
  decision_text text,
  outcomes jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE startups ENABLE ROW LEVEL SECURITY;
ALTER TABLE decisions ENABLE ROW LEVEL SECURITY;

-- 6. Security Policies
CREATE POLICY "Users can view their orgs" ON organizations FOR SELECT USING (id IN (SELECT org_id FROM organization_members WHERE user_id = auth.uid()));
CREATE POLICY "Users can view their organization_members" ON organization_members FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can view org startups" ON startups FOR SELECT USING (user_id = auth.uid() OR org_id IN (SELECT org_id FROM organization_members WHERE user_id = auth.uid()));
CREATE POLICY "Users can insert startups" ON startups FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view decisions" ON decisions FOR SELECT USING (startup_id IN (SELECT id FROM startups WHERE user_id = auth.uid() OR org_id IN (SELECT org_id FROM organization_members WHERE user_id = auth.uid())));
CREATE POLICY "Users can insert decisions" ON decisions FOR INSERT WITH CHECK (startup_id IN (SELECT id FROM startups WHERE user_id = auth.uid() OR org_id IN (SELECT org_id FROM organization_members WHERE user_id = auth.uid())));

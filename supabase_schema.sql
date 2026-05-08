-- Run this in your Supabase SQL Editor

-- Emergency Contacts
create table if not exists contacts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade,
  name text not null,
  phone text,
  email text,
  created_at timestamptz default now()
);
alter table contacts enable row level security;
create policy "Users manage own contacts" on contacts for all using (auth.uid() = user_id);

-- Vehicles for Project Suraksha
create table if not exists vehicles (
  id uuid default gen_random_uuid() primary key,
  driver_name text not null,
  vehicle_number text not null,
  qr_code text unique not null,
  created_at timestamptz default now()
);

-- Trip Sessions (Black Box)
create table if not exists trips (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade,
  vehicle_id uuid references vehicles(id),
  start_location jsonb,
  route_data jsonb,
  status text default 'active',
  created_at timestamptz default now()
);
alter table trips enable row level security;
create policy "Users manage own trips" on trips for all using (auth.uid() = user_id);

-- SOS Alerts (already exists, ensure it has correct shape)
create table if not exists sos_alerts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade,
  location jsonb,
  status text default 'active',
  created_at timestamptz default now()
);
alter table sos_alerts enable row level security;
create policy "Users manage own sos_alerts" on sos_alerts for all using (auth.uid() = user_id);

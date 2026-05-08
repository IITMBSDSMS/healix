-- Supabase Schema for Dynamic BioLabs Content

-- 1. Announcements (Scrolling Ticker)
create table if not exists biolab_announcements (
  id uuid default gen_random_uuid() primary key,
  content text not null,
  is_active boolean default true,
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table biolab_announcements enable row level security;
create policy "Anyone can view active announcements" 
  on biolab_announcements for select using (is_active = true);

-- Insert dummy data based on previous mockup
insert into biolab_announcements (content) values 
('Important Announcement: Proposal submission for 2026 BioLabs Incubator will start from 15th June.'),
('Advertisement No. 04/2026: Healix BioLabs invites applications for Junior Research Fellows (JRF).'),
('High Performance Computing (HPC) Workshop scheduled for 10th-12th July 2026. Apply Here.'),
('Online Registration Open for Summer Training Programme - 2026 at Healix BioLabs.');

-- 2. Events (Overlapping Card)
create table if not exists biolab_events (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text not null,
  image_url text not null,
  start_date timestamp with time zone not null,
  end_date timestamp with time zone not null,
  is_active boolean default true,
  created_at timestamp with time zone default now()
);

alter table biolab_events enable row level security;
create policy "Anyone can view active events" 
  on biolab_events for select using (is_active = true);

insert into biolab_events (title, description, image_url, start_date, end_date) values 
('School on Characterization of AI Models in Healthcare: Structure and Diagnostics', 
'AI Models have proven to be a strong tool to engineer predictive pathways for potential clinical applications. This school will focus on the deployment of generative algorithms with specific attention to ethics.', 
'/biolabs/ai_medical.png', 
'2026-05-12 09:00:00+05:30', 
'2026-05-15 17:30:00+05:30');


-- 3. News (What's New Section)
create table if not exists biolab_news (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  link_url text,
  file_size text, -- e.g., "308.81 KB" if it's a document
  is_document boolean default false,
  is_active boolean default true,
  created_at timestamp with time zone default now()
);

alter table biolab_news enable row level security;
create policy "Anyone can view active news" 
  on biolab_news for select using (is_active = true);

insert into biolab_news (title, link_url, is_document, file_size) values 
('Director Interview on Health Tech Morning Show | BioLabs India 2026', '#', false, null),
('BioLabs PhD Course Module, Semester II (January–June 2026)', '#', true, '308.81 KB'),
('National Workshop on Data Interoperability and Clinical Workflows', '#', true, '1.27 MB'),
('Workshop on In-Silico Quantum Modeling Studies - 2026', '#', false, null);


-- 4. Photos (Media Left Column)
create table if not exists biolab_photos (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  image_url text not null,
  is_active boolean default true,
  created_at timestamp with time zone default now()
);

alter table biolab_photos enable row level security;
create policy "Anyone can view active photos" 
  on biolab_photos for select using (is_active = true);

insert into biolab_photos (title, image_url) values 
('Healix BioLabs Foundation Day 2026', '/biolabs/hero_dna.png');

-- 5. Outreach Programs (Ph.D. / Summer Training / etc)
create table if not exists biolab_programs (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text not null,
  is_active boolean default true,
  created_at timestamp with time zone default now()
);

alter table biolab_programs enable row level security;
create policy "Anyone can view active programs" 
  on biolab_programs for select using (is_active = true);

insert into biolab_programs (title, description) values 
('Ph.D. Training Programme', 'For doctoral candidates exploring AI-driven medical tech.'),
('Summer Training Programme', '4-week intensive project training for B.Sc/B.Tech students.'),
('Facilities Visit', 'Guided tours of our HPC and AI Modeling clusters for institutions.');

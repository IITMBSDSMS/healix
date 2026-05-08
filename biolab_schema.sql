-- Run this in your Supabase SQL Editor for the BioLabs module

-- Applications Table
create table if not exists biolab_applications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade,
  name text not null,
  email text not null,
  idea_title text not null,
  description text not null,
  category text not null,
  status text default 'pending',
  created_at timestamptz default now()
);

alter table biolab_applications enable row level security;
create policy "Users can insert their own applications" on biolab_applications for insert with check (auth.uid() = user_id);
create policy "Users can view their own applications" on biolab_applications for select using (auth.uid() = user_id);

-- Accepted Projects Showcase
create table if not exists biolab_projects (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text not null,
  category text not null,
  status text default 'idea',
  progress integer default 0,
  created_at timestamptz default now()
);

alter table biolab_projects enable row level security;
create policy "Anyone can view biolab projects" on biolab_projects for select using (true);

-- Insert some mock projects for the showcase
insert into biolab_projects (title, description, category, status, progress) values
('CRISPR Target Mapping', 'Advanced mapping of potential off-target effects in novel CRISPR-Cas9 therapies using AI prediction models.', 'Healthcare', 'Research', 65),
('Synthetic Antibody Gen', 'Generating synthetic antibodies for emerging viral strains using generative adversarial networks.', 'AI', 'Prototype', 85),
('Neural Link Biomaterials', 'Developing biocompatible materials for safe, long-term neural implant integration.', 'Healthcare', 'Idea', 20)
on conflict do nothing;

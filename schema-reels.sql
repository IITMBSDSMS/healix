-- Supabase Schema for Community Reels (Homepage Telemetry Logs)

create table if not exists community_reels (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  user_handle text not null,
  thumbnail_url text not null,
  video_url text not null,
  is_active boolean default true,
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table community_reels enable row level security;
create policy "Anyone can view active reels" 
  on community_reels for select using (is_active = true);

-- Note: In a production environment, you would also want to create a policy 
-- that allows only authenticated admins to INSERT/UPDATE/DELETE. 
-- For this prototype, we'll keep it simple.

-- Insert initial dummy data (these match the 4 placeholders we currently have)
insert into community_reels (title, user_handle, thumbnail_url, video_url) values 
('Emergency SOS Response Test', '@sarah_j', '/reel-1-thumb.webp', 'https://www.w3schools.com/html/mov_bbb.mp4'),
('Healix AI Symptom Checker Review', '@marcus_tech', '/reel-2-thumb.webp', 'https://www.w3schools.com/html/mov_bbb.mp4'),
('Night Travel with SheSecure', '@priya_travels', '/reel-3-thumb.webp', 'https://www.w3schools.com/html/mov_bbb.mp4'),
('BioLabs Student Tour', '@uni_science', '/reel-4-thumb.webp', 'https://www.w3schools.com/html/mov_bbb.mp4');

-- SQL to run in Supabase SQL Editor

-- 1. Create the table for hero banners
CREATE TABLE IF NOT EXISTS public.hero_banners (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    subtitle TEXT NOT NULL,
    media_url TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('image', 'video')),
    is_active BOOLEAN DEFAULT true,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Set up Row Level Security (RLS) for the table
ALTER TABLE public.hero_banners ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active banners
CREATE POLICY "Public can view active banners" ON public.hero_banners
    FOR SELECT USING (is_active = true);

-- Allow authenticated users (admins) to manage banners
CREATE POLICY "Authenticated users can insert banners" ON public.hero_banners
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update banners" ON public.hero_banners
    FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete banners" ON public.hero_banners
    FOR DELETE USING (auth.role() = 'authenticated');

-- 3. Create a storage bucket for media uploads
INSERT INTO storage.buckets (id, name, public) 
VALUES ('public_media', 'public_media', true)
ON CONFLICT (id) DO NOTHING;

-- 4. Set up Storage Policies
-- Allow public to read media
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'public_media' );

-- Allow authenticated users to upload media
CREATE POLICY "Authenticated users can upload media"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'public_media' AND auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can update media"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'public_media' AND auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can delete media"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'public_media' AND auth.role() = 'authenticated'
);

-- 5. Insert initial default data
INSERT INTO public.hero_banners (title, subtitle, media_url, type, order_index)
VALUES 
    ('Building the Future of Care', 'Unifying predictive medical diagnostics and high-performance labs.', '/og-image.png', 'image', 1),
    ('AI Genomic Sequencing Pipeline', 'Next-generation research division and compute clusters.', 'https://www.w3schools.com/html/mov_bbb.mp4', 'video', 2),
    ('Project Suraksha Expansion', 'Securing the community with real-time IoT safety networks.', '/shesecure-hero.png', 'image', 3);

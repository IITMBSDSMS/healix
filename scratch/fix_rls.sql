-- Ensure the table exists with the correct columns
CREATE TABLE IF NOT EXISTS public.shesecure_session_photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    caption TEXT NOT NULL,
    image_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.shesecure_session_photos ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Enable read for all" ON public.shesecure_session_photos;
DROP POLICY IF EXISTS "Enable all for authenticated users" ON public.shesecure_session_photos;

-- Create Policies
-- 1. Anyone can view session photos
CREATE POLICY "Enable read for all" ON public.shesecure_session_photos
FOR SELECT USING (true);

-- 2. Authenticated users (Admins) can manage session photos
CREATE POLICY "Enable all for authenticated users" ON public.shesecure_session_photos
FOR ALL USING (auth.role() = 'authenticated');

-- Also check other related tables to ensure they are consistent
ALTER TABLE public.community_reels ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable read for all" ON public.community_reels;
DROP POLICY IF EXISTS "Enable all for authenticated users" ON public.community_reels;
CREATE POLICY "Enable read for all" ON public.community_reels FOR SELECT USING (true);
CREATE POLICY "Enable all for authenticated users" ON public.community_reels FOR ALL USING (auth.role() = 'authenticated');

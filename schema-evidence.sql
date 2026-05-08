-- 1. Update Trips Table for Privacy Controls
ALTER TABLE public.trips 
ADD COLUMN IF NOT EXISTS recording_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS iot_override BOOLEAN DEFAULT false;

-- 2. Create Evidence Logs Table
CREATE TABLE IF NOT EXISTS public.evidence_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    trip_id UUID REFERENCES public.trips(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- e.g., 'audio', 'video', 'image'
    file_url TEXT NOT NULL, -- The base64 buffer or the Supabase Storage URL
    encrypted BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Set up RLS for evidence_logs
ALTER TABLE public.evidence_logs ENABLE ROW LEVEL SECURITY;

-- Allow insert via API/Service Role
CREATE POLICY "Enable insert for all" ON public.evidence_logs FOR INSERT WITH CHECK (true);

-- Allow reading only by the user who owns the trip
-- (Requires a join with trips, but for simplicity in MVP we can allow authenticated reads,
--  in production we would use `auth.uid() = (select user_id from trips where id = trip_id)`)
CREATE POLICY "Enable read for trip owner" ON public.evidence_logs FOR SELECT 
USING (auth.uid() = (SELECT user_id FROM trips WHERE id = evidence_logs.trip_id));

-- 4. Data Minimization (Cron Job Script)
-- Note: Requires pg_cron extension to be enabled in Supabase
-- CREATE EXTENSION IF NOT EXISTS pg_cron;
-- SELECT cron.schedule('cleanup_old_trips', '0 * * * *', $$
--   DELETE FROM public.trips WHERE created_at < NOW() - INTERVAL '72 hours';
-- $$);

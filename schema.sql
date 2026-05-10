-- =================================================================================
-- HEALIX ENTERPRISE CONSOLIDATED SCHEMA
-- Modules: Project Suraksha (IoT/Safety), BioLabs (Research), Community Reels
-- Version: 2.0.0 (Production Grade)
-- =================================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. VEHICLES TABLE (Suraksha)
CREATE TABLE IF NOT EXISTS public.vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    driver_name TEXT NOT NULL,
    vehicle_number TEXT NOT NULL UNIQUE,
    status TEXT DEFAULT 'active', -- 'active', 'maintenance', 'retired'
    qr_data_url TEXT,
    qr_code TEXT UNIQUE,
    iot_device_id TEXT UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. TRIPS TABLE (Suraksha)
CREATE TABLE IF NOT EXISTS public.trips (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE CASCADE,
    start_location JSONB,
    route_data JSONB, -- For storing historical path segments
    status TEXT DEFAULT 'active', -- 'active', 'completed', 'cancelled', 'iot_override'
    recording_enabled BOOLEAN DEFAULT false,
    iot_override BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. TRIP LOCATIONS (Live tracking table - High velocity)
CREATE TABLE IF NOT EXISTS public.trip_locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id UUID REFERENCES public.trips(id) ON DELETE CASCADE,
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_trip_locations_trip_id ON public.trip_locations(trip_id);
CREATE INDEX IF NOT EXISTS idx_trip_locations_timestamp ON public.trip_locations USING BRIN(timestamp);

-- 5. IOT TELEMETRY (Hardware Black Box - High velocity)
CREATE TABLE IF NOT EXISTS public.iot_telemetry (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    device_id TEXT NOT NULL,
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    speed DOUBLE PRECISION DEFAULT 0,
    battery DOUBLE PRECISION DEFAULT 100,
    signal INTEGER DEFAULT 4,
    route_state TEXT DEFAULT 'in_progress',
    status TEXT DEFAULT 'active',
    audio_buffer TEXT, -- Base64 encoded short audio snippet for emergency streaming
    is_emergency BOOLEAN DEFAULT false,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    request_id UUID
);
-- Patch existing table just in case it was created without these columns
ALTER TABLE public.iot_telemetry ADD COLUMN IF NOT EXISTS speed DOUBLE PRECISION DEFAULT 0;
ALTER TABLE public.iot_telemetry ADD COLUMN IF NOT EXISTS battery DOUBLE PRECISION DEFAULT 100;
ALTER TABLE public.iot_telemetry ADD COLUMN IF NOT EXISTS signal INTEGER DEFAULT 4;
ALTER TABLE public.iot_telemetry ADD COLUMN IF NOT EXISTS route_state TEXT DEFAULT 'in_progress';
ALTER TABLE public.iot_telemetry ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';

CREATE INDEX IF NOT EXISTS idx_iot_telemetry_device_id ON public.iot_telemetry(device_id);
CREATE INDEX IF NOT EXISTS idx_iot_telemetry_timestamp ON public.iot_telemetry USING BRIN(timestamp);

-- 6. EVIDENCE LOGS (Encryption & Privacy)
CREATE TABLE IF NOT EXISTS public.evidence_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    trip_id UUID REFERENCES public.trips(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- 'audio', 'video', 'image'
    file_url TEXT NOT NULL, -- Storage URL or encrypted buffer
    encrypted BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. SOS ALERTS
CREATE TABLE IF NOT EXISTS public.sos_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    location JSONB,
    status TEXT DEFAULT 'active', -- 'active', 'resolved', 'false_alarm'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. CONTACTS (Emergency)
CREATE TABLE IF NOT EXISTS public.contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. COMMUNITY REELS (Marketing/Engagement)
CREATE TABLE IF NOT EXISTS public.community_reels (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    user_handle TEXT NOT NULL,
    thumbnail_url TEXT NOT NULL,
    video_url TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. BIOLABS: ANNOUNCEMENTS
CREATE TABLE IF NOT EXISTS public.biolab_announcements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    content TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. BIOLABS: EVENTS
CREATE TABLE IF NOT EXISTS public.biolab_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT NOT NULL,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. BIOLABS: NEWS
CREATE TABLE IF NOT EXISTS public.biolab_news (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    link_url TEXT,
    file_size TEXT, 
    is_document BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 13. BIOLABS: PHOTOS
CREATE TABLE IF NOT EXISTS public.biolab_photos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    image_url TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 14. BIOLABS: PROGRAMS
CREATE TABLE IF NOT EXISTS public.biolab_programs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 15. BIOLABS: APPLICATIONS
CREATE TABLE IF NOT EXISTS public.biolab_applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    idea_title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 16. BIOLABS: PROJECTS (Showcase)
CREATE TABLE IF NOT EXISTS public.biolab_projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    status TEXT DEFAULT 'idea',
    progress INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE public.biolab_projects ADD COLUMN IF NOT EXISTS progress INTEGER DEFAULT 0;

-- 17. AUDIT LOGS (Security & Governance)
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES auth.users(id),
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT,
    payload JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 18. SHE-SECURE SESSION PHOTOS (Marketing/Demo)
CREATE TABLE IF NOT EXISTS public.shesecure_session_photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    caption TEXT NOT NULL,
    image_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 19. IOT DEVICES REGISTRY
CREATE TABLE IF NOT EXISTS public.iot_devices (
    id TEXT PRIMARY KEY,
    vehicle_reg TEXT,
    driver_name TEXT,
    vehicle_type TEXT DEFAULT 'CAB',
    qr_code TEXT,
    battery_level DOUBLE PRECISION DEFAULT 100,
    signal_strength INTEGER DEFAULT 4,
    device_health TEXT DEFAULT 'optimal',
    online_state BOOLEAN DEFAULT true,
    last_heartbeat TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    firmware_version TEXT DEFAULT 'v2.4.1',
    encryption_status BOOLEAN DEFAULT true,
    status TEXT DEFAULT 'active',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Patch existing table
ALTER TABLE public.iot_devices ADD COLUMN IF NOT EXISTS vehicle_reg TEXT;
ALTER TABLE public.iot_devices ADD COLUMN IF NOT EXISTS driver_name TEXT;
ALTER TABLE public.iot_devices ADD COLUMN IF NOT EXISTS vehicle_type TEXT DEFAULT 'CAB';
ALTER TABLE public.iot_devices ADD COLUMN IF NOT EXISTS qr_code TEXT;
ALTER TABLE public.iot_devices ADD COLUMN IF NOT EXISTS battery_level DOUBLE PRECISION DEFAULT 100;
ALTER TABLE public.iot_devices ADD COLUMN IF NOT EXISTS signal_strength INTEGER DEFAULT 4;
ALTER TABLE public.iot_devices ADD COLUMN IF NOT EXISTS device_health TEXT DEFAULT 'optimal';
ALTER TABLE public.iot_devices ADD COLUMN IF NOT EXISTS online_state BOOLEAN DEFAULT true;
ALTER TABLE public.iot_devices ADD COLUMN IF NOT EXISTS last_heartbeat TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE public.iot_devices ADD COLUMN IF NOT EXISTS firmware_version TEXT DEFAULT 'v2.4.1';
ALTER TABLE public.iot_devices ADD COLUMN IF NOT EXISTS encryption_status BOOLEAN DEFAULT true;

-- 20. FAILSAFE EVENTS
CREATE TABLE IF NOT EXISTS public.failsafe_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id UUID REFERENCES public.trips(id) ON DELETE CASCADE,
    device_id TEXT REFERENCES public.iot_devices(id),
    trigger_reason TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 21. TAMPER LOGS
CREATE TABLE IF NOT EXISTS public.tamper_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id TEXT REFERENCES public.iot_devices(id),
    severity TEXT DEFAULT 'high',
    description TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 22. INCIDENT REPORTS
CREATE TABLE IF NOT EXISTS public.incident_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id TEXT REFERENCES public.iot_devices(id),
    trip_id UUID REFERENCES public.trips(id) ON DELETE SET NULL,
    type TEXT NOT NULL, -- e.g., 'SOS', 'Crash', 'Route Deviation'
    status TEXT DEFAULT 'open', -- 'open', 'resolved'
    description TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =================================================================================
-- SECURITY: ROW LEVEL SECURITY (RLS) POLICIES
-- =================================================================================

-- Enable RLS on all tables
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.iot_telemetry ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evidence_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sos_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_reels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.biolab_announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.biolab_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.biolab_news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.biolab_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.biolab_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.biolab_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.biolab_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shesecure_session_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.iot_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.failsafe_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tamper_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incident_reports ENABLE ROW LEVEL SECURITY;

-- 1. VEHICLES: Read-only for public, Full for authenticated (Admins)
CREATE POLICY "Public read vehicles" ON public.vehicles FOR SELECT USING (true);
CREATE POLICY "Admin manage vehicles" ON public.vehicles FOR ALL USING (auth.role() = 'authenticated');

-- 2. TRIPS: Users manage own
CREATE POLICY "Users manage own trips" ON public.trips FOR ALL USING (auth.uid() = user_id);

-- 3. TRIP LOCATIONS: Owner of trip can see/insert
CREATE POLICY "Trip owner view locations" ON public.trip_locations FOR SELECT 
    USING (EXISTS (SELECT 1 FROM public.trips WHERE trips.id = trip_locations.trip_id AND trips.user_id = auth.uid()));
CREATE POLICY "Trip owner insert locations" ON public.trip_locations FOR INSERT 
    WITH CHECK (EXISTS (SELECT 1 FROM public.trips WHERE trips.id = trip_locations.trip_id AND trips.user_id = auth.uid()));

-- 4. IOT TELEMETRY: Insert for API/Service, Read for all (for tracking)
CREATE POLICY "Enable insert for hardware" ON public.iot_telemetry FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read telemetry" ON public.iot_telemetry FOR SELECT USING (true);

-- 5. EVIDENCE LOGS: Trip owner only
CREATE POLICY "Trip owner view evidence" ON public.evidence_logs FOR SELECT 
    USING (EXISTS (SELECT 1 FROM public.trips WHERE trips.id = evidence_logs.trip_id AND trips.user_id = auth.uid()));
CREATE POLICY "Enable insert evidence via API" ON public.evidence_logs FOR INSERT WITH CHECK (true);

-- 6. SOS ALERTS: User manage own
CREATE POLICY "Users manage own SOS" ON public.sos_alerts FOR ALL USING (auth.uid() = user_id);

-- 7. CONTACTS: User manage own
CREATE POLICY "Users manage own contacts" ON public.contacts FOR ALL USING (auth.uid() = user_id);

-- 8. MARKETING/RESEARCH (Public Read)
CREATE POLICY "Public read community reels" ON public.community_reels FOR SELECT USING (is_active = true);
CREATE POLICY "Public read announcements" ON public.biolab_announcements FOR SELECT USING (is_active = true);
CREATE POLICY "Public read events" ON public.biolab_events FOR SELECT USING (is_active = true);
CREATE POLICY "Public read news" ON public.biolab_news FOR SELECT USING (is_active = true);
CREATE POLICY "Public read photos" ON public.biolab_photos FOR SELECT USING (is_active = true);
CREATE POLICY "Public read programs" ON public.biolab_programs FOR SELECT USING (is_active = true);
CREATE POLICY "Public read projects" ON public.biolab_projects FOR SELECT USING (true);
CREATE POLICY "Public read session photos" ON public.shesecure_session_photos FOR SELECT USING (true);

-- 9. BIOLABS APPLICATIONS: User manage own
CREATE POLICY "Users manage own applications" ON public.biolab_applications FOR ALL USING (auth.uid() = user_id);

-- 10. AUDIT LOGS: Admin only
CREATE POLICY "Admins view audit logs" ON public.audit_logs FOR SELECT USING (auth.role() = 'authenticated');

-- 11. SESSION PHOTOS ADMIN
CREATE POLICY "Admin manage session photos" ON public.shesecure_session_photos FOR ALL USING (auth.role() = 'authenticated');

-- 12. IOT DEVICES
CREATE POLICY "Public read iot devices" ON public.iot_devices FOR SELECT USING (true);
CREATE POLICY "Admin manage iot devices" ON public.iot_devices FOR ALL USING (auth.role() = 'authenticated');

-- 13. FAILSAFE EVENTS
CREATE POLICY "Public read failsafe events" ON public.failsafe_events FOR SELECT USING (true);
CREATE POLICY "Admin manage failsafe events" ON public.failsafe_events FOR ALL USING (auth.role() = 'authenticated');

-- 14. TAMPER LOGS
CREATE POLICY "Public read tamper logs" ON public.tamper_logs FOR SELECT USING (true);
CREATE POLICY "Admin manage tamper logs" ON public.tamper_logs FOR ALL USING (auth.role() = 'authenticated');

-- 15. INCIDENT REPORTS
CREATE POLICY "Public read incident reports" ON public.incident_reports FOR SELECT USING (true);
CREATE POLICY "Admin manage incident reports" ON public.incident_reports FOR ALL USING (auth.role() = 'authenticated');

-- =================================================================================
-- INITIAL SEED DATA
-- =================================================================================

INSERT INTO public.community_reels (title, user_handle, thumbnail_url, video_url) VALUES 
('Emergency SOS Response Test', '@sarah_j', '/reel-1-thumb.webp', 'https://www.w3schools.com/html/mov_bbb.mp4'),
('Healix AI Symptom Checker Review', '@marcus_tech', '/reel-2-thumb.webp', 'https://www.w3schools.com/html/mov_bbb.mp4'),
('Night Travel with SheSecure', '@priya_travels', '/reel-3-thumb.webp', 'https://www.w3schools.com/html/mov_bbb.mp4'),
('BioLabs Student Tour', '@uni_science', '/reel-4-thumb.webp', 'https://www.w3schools.com/html/mov_bbb.mp4')
ON CONFLICT DO NOTHING;

INSERT INTO public.biolab_projects (title, description, category, status, progress) VALUES
('CRISPR Target Mapping', 'Advanced mapping of potential off-target effects in novel CRISPR-Cas9 therapies using AI prediction models.', 'Healthcare', 'Research', 65),
('Synthetic Antibody Gen', 'Generating synthetic antibodies for emerging viral strains using generative adversarial networks.', 'AI', 'Prototype', 85),
('Neural Link Biomaterials', 'Developing biocompatible materials for safe, long-term neural implant integration.', 'Healthcare', 'Idea', 20)
ON CONFLICT DO NOTHING;

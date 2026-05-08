-- =================================================================================
-- PROJECT SURAKSHA - SUPABASE SCHEMA SETUP
-- Instructions: Copy and paste this script into your Supabase SQL Editor and hit RUN.
-- =================================================================================

-- 1. VEHICLES TABLE
CREATE TABLE IF NOT EXISTS public.vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    driver_name TEXT NOT NULL,
    vehicle_number TEXT NOT NULL UNIQUE,
    status TEXT DEFAULT 'active',
    qr_data_url TEXT,
    qr_code TEXT UNIQUE, -- Optional string identifier
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. TRIPS TABLE
CREATE TABLE IF NOT EXISTS public.trips (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE CASCADE,
    start_location JSONB,
    status TEXT DEFAULT 'active', -- 'active' or 'completed'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. TRIP LOCATIONS (Live tracking table)
CREATE TABLE IF NOT EXISTS public.trip_locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id UUID REFERENCES public.trips(id) ON DELETE CASCADE,
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. SOS ALERTS
CREATE TABLE IF NOT EXISTS public.sos_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    location JSONB,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. CONTACTS
CREATE TABLE IF NOT EXISTS public.contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =================================================================================
-- SECURITY: ROW LEVEL SECURITY (RLS) POLICIES
-- =================================================================================

-- Enable RLS on all tables
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sos_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- VEHICLES: Anyone can read (for QR scans), only authenticated (Admin ideally) can insert
CREATE POLICY "Vehicles are viewable by everyone" ON public.vehicles FOR SELECT USING (true);
CREATE POLICY "Admins can insert vehicles" ON public.vehicles FOR ALL USING (auth.role() = 'authenticated');

-- TRIPS: Users can only see and manage their own trips
CREATE POLICY "Users can insert their own trips" ON public.trips FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view their own trips" ON public.trips FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own trips" ON public.trips FOR UPDATE USING (auth.uid() = user_id);

-- TRIP LOCATIONS: Users can only add/see locations for their own trips
CREATE POLICY "Users can view locations of their trips" ON public.trip_locations FOR SELECT 
    USING (EXISTS (SELECT 1 FROM public.trips WHERE trips.id = trip_locations.trip_id AND trips.user_id = auth.uid()));
CREATE POLICY "Users can insert locations to their trips" ON public.trip_locations FOR INSERT 
    WITH CHECK (EXISTS (SELECT 1 FROM public.trips WHERE trips.id = trip_locations.trip_id AND trips.user_id = auth.uid()));

-- SOS ALERTS: Users can insert and read their own
CREATE POLICY "Users can view their own SOS" ON public.sos_alerts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert SOS alerts" ON public.sos_alerts FOR INSERT WITH CHECK (auth.uid() = user_id);

-- CONTACTS: Users can manage their own emergency contacts
CREATE POLICY "Users can manage own contacts" ON public.contacts FOR ALL USING (auth.uid() = user_id);

-- NOTE: Ensure that in the Supabase UI -> Authentication -> Policies, you have enabled these.
-- For a production app, the "Admins can insert vehicles" policy should check against a custom 'admin' role or email table.

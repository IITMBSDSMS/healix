-- 1. Add IoT device assignment to vehicles
ALTER TABLE public.vehicles 
ADD COLUMN IF NOT EXISTS iot_device_id TEXT UNIQUE;

-- 2. Create the IoT telemetry table (Hardware Black Box)
CREATE TABLE IF NOT EXISTS public.iot_telemetry (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    device_id TEXT NOT NULL,
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    audio_buffer TEXT, -- Base64 encoded short audio snippet for emergency streaming
    is_emergency BOOLEAN DEFAULT false,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Set up RLS for iot_telemetry
ALTER TABLE public.iot_telemetry ENABLE ROW LEVEL SECURITY;

-- Allow public insertion (hardware devices don't have user auth, they just post to API)
-- In production, the API should verify a secret device key before inserting.
CREATE POLICY "Enable insert for all via service role or api" ON public.iot_telemetry FOR INSERT WITH CHECK (true);

-- Allow reading telemetry
CREATE POLICY "Enable read for all" ON public.iot_telemetry FOR SELECT USING (true);

-- 4. Add IoT Override state to trips
-- (We use the existing 'status' column but we can just use 'iot_override' as a status)
-- Let's update the existing 'status' text field in trips to support 'iot_override'
-- since it's just TEXT, no schema change is technically needed, but let's make sure it's clear.

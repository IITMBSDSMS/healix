-- =================================================================================
-- HEALIX IOT SYSTEM MIGRATION (2024-05-09)
-- Aligning schema for robust flat telemetry writes and device registry.
-- =================================================================================

-- 1. Create IoT Devices Registry (The "Hardware Catalog")
CREATE TABLE IF NOT EXISTS public.iot_devices (
    id TEXT PRIMARY KEY, -- e.g. 'IOT-CAB-001'
    status TEXT DEFAULT 'active',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create/Align IoT Telemetry (The "Live Data Stream")
-- Dropping and recreating to ensure column order and constraints align with flat writes.
DROP TABLE IF EXISTS public.iot_telemetry;
CREATE TABLE public.iot_telemetry (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id TEXT REFERENCES public.iot_devices(id) ON DELETE CASCADE,
    lat DOUBLE PRECISION, -- Nullable to prevent break on partial packets
    lng DOUBLE PRECISION, -- Nullable to prevent break on partial packets
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    location JSONB, -- Legacy compatibility (nullable)
    audio_buffer TEXT, -- Base64 emergency audio
    is_emergency BOOLEAN DEFAULT false
);

-- 3. Security: Enable RLS and permissive policies for IoT API access
ALTER TABLE public.iot_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.iot_telemetry ENABLE ROW LEVEL SECURITY;

-- Devices Policy
CREATE POLICY "Enable read/write for IoT devices" ON public.iot_devices FOR ALL USING (true);

-- Telemetry Policy
CREATE POLICY "Enable read/write for IoT telemetry" ON public.iot_telemetry FOR ALL USING (true);

-- 4. Sample Device Initialization
INSERT INTO public.iot_devices (id, status, is_active) 
VALUES ('IOT-CAB-001', 'active', true)
ON CONFLICT (id) DO NOTHING;

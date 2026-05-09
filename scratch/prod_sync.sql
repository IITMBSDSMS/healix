-- 1. Vehicles Table Fix
ALTER TABLE public.vehicles ALTER COLUMN qr_code DROP NOT NULL;
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS iot_device_id TEXT UNIQUE;

-- 2. IoT Devices Registry
CREATE TABLE IF NOT EXISTS public.iot_devices (
    id TEXT PRIMARY KEY,
    status TEXT DEFAULT 'active',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. IoT Telemetry (Flat Structure)
-- We drop if exists to ensure we have the correct flat structure as requested
DROP TABLE IF EXISTS public.iot_telemetry;
CREATE TABLE public.iot_telemetry (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id TEXT REFERENCES public.iot_devices(id) ON DELETE CASCADE,
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    location JSONB,
    audio_buffer TEXT,
    is_emergency BOOLEAN DEFAULT false
);

-- 4. RLS and Policies
ALTER TABLE public.iot_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.iot_telemetry ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all for everyone on iot_devices" ON public.iot_devices FOR ALL USING (true);
CREATE POLICY "Enable all for everyone on iot_telemetry" ON public.iot_telemetry FOR ALL USING (true);

-- 5. Data Initialization
INSERT INTO public.iot_devices (id, status, is_active) 
VALUES ('IOT-CAB-001', 'active', true)
ON CONFLICT (id) DO NOTHING;

-- Ensure IOT-CAB-001 exists as a vehicle too
INSERT INTO public.vehicles (driver_name, vehicle_number, iot_device_id, status, qr_code)
VALUES ('System Simulator', 'CAB-001', 'IOT-CAB-001', 'active', 'IOT-CAB-001')
ON CONFLICT (vehicle_number) DO UPDATE SET iot_device_id = 'IOT-CAB-001';

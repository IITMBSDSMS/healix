-- ════════════════════════════════════════════════════════════════
--  Healix Global Network — Supabase Schema
--  Run this in your Supabase SQL editor
-- ════════════════════════════════════════════════════════════════

-- 1. HEALTHCARE PROFESSIONALS TABLE
CREATE TABLE IF NOT EXISTS global_professionals (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name             TEXT NOT NULL,
  role             TEXT NOT NULL,
  institution      TEXT NOT NULL,
  photo_url        TEXT,        -- Supabase Storage public URL
  description      TEXT NOT NULL,
  display_order    INT DEFAULT 0,
  active           BOOLEAN DEFAULT TRUE,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- 2. AUTO-UPDATE updated_at
CREATE OR REPLACE FUNCTION update_updated_at_professionals()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS global_professionals_updated_at ON global_professionals;
CREATE TRIGGER global_professionals_updated_at
  BEFORE UPDATE ON global_professionals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_professionals();

-- 3. ROW LEVEL SECURITY
ALTER TABLE global_professionals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active professionals"
  ON global_professionals FOR SELECT USING (active = true);

CREATE POLICY "Service role can manage professionals"
  ON global_professionals FOR ALL USING (true) WITH CHECK (true);

-- 4. SEED DATA
INSERT INTO global_professionals (name, role, institution, photo_url, description, display_order)
VALUES
  (
    'Dr. Rajesh Kumar',
    'Senior Cardiologist',
    'AIIMS Delhi',
    'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=400&auto=format&fit=crop',
    'Leading cardiovascular specialist with over 15 years of experience in clinical diagnostics and edge safety telemetry integration for rural health outreach programs.',
    0
  ),
  (
    'Dr. Priya Sharma',
    'Professor of Genomics',
    'IIT Madras Research Park',
    'https://images.unsplash.com/photo-1594824813573-246434de83fb?q=80&w=400&auto=format&fit=crop',
    'Academic researcher specializing in CRISPR gene drive modeling and distributed laboratory sequence analysis frameworks for predicting genetic mutation metrics.',
    1
  ),
  (
    'Dr. Amit Patel',
    'Director of Public Health',
    'IIT Bombay Health Center',
    'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=400&auto=format&fit=crop',
    'Pioneering researcher focused on low-latency IoT health monitoring streams and developing indigenous community safety systems in collaboration with municipal corporations.',
    2
  )
ON CONFLICT DO NOTHING;

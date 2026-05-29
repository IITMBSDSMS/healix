-- ════════════════════════════════════════════════════════════════
--  Healix Brands Section — Supabase Schema
--  Run this in your Supabase SQL editor
-- ════════════════════════════════════════════════════════════════

-- 1. BRANDS TABLE
CREATE TABLE IF NOT EXISTS brands (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name             TEXT NOT NULL,
  role             TEXT NOT NULL,
  description      TEXT NOT NULL,
  logo_text        TEXT NOT NULL,
  color            TEXT DEFAULT '#ea580c',
  accent           TEXT DEFAULT 'text-[#ea580c] bg-[#ea580c]/10 border-[#ea580c]/20',
  icon_name        TEXT DEFAULT 'Shield',
  logo_url         TEXT,         -- Supabase Storage public URL (optional custom image)
  display_order    INT DEFAULT 0,
  active           BOOLEAN DEFAULT TRUE,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- 2. AUTO-UPDATE updated_at
CREATE OR REPLACE FUNCTION update_brands_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS brands_updated_at ON brands;
CREATE TRIGGER brands_updated_at
  BEFORE UPDATE ON brands
  FOR EACH ROW EXECUTE FUNCTION update_brands_updated_at();

-- 3. ROW LEVEL SECURITY
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active brands"
  ON brands FOR SELECT USING (active = true);

CREATE POLICY "Service role can manage brands"
  ON brands FOR ALL USING (true) WITH CHECK (true);

-- 4. SEED DATA
INSERT INTO brands (name, role, description, logo_text, color, accent, icon_name, display_order)
VALUES
  (
    'Avennix Pharma',
    'Clinical Research & Digital Care',
    'Developing indigenous digital twin software pipelines and therapeutics networks to standardize clinical trial metrics across leading institutional networks.',
    'AVENNIX',
    '#3b82f6',
    'text-blue-500 bg-blue-500/10 border-blue-500/20',
    'Shield',
    0
  ),
  (
    'SheSecure System',
    'Women Travel & Community Safety',
    'Low-latency telemetry tracking, encrypted hardware beacons, and one-tap emergency SOS broadcasts connected to localized responder networks.',
    'SHE-SECURE',
    '#ef4444',
    'text-red-500 bg-red-500/10 border-red-500/20',
    'Heart',
    1
  ),
  (
    'BioLabs Genomics',
    'High-Performance Sequence Modeling',
    'Running distributed high-performance computing pools to execute molecular alignment diagnostics, mapping CRISPR outcomes with precision.',
    'BIOLABS',
    '#06b6d4',
    'text-cyan-500 bg-cyan-500/10 border-cyan-500/20',
    'Activity',
    2
  ),
  (
    'Healix Academy',
    'Systems Architecture Training',
    'Educating developers and clinical researchers on high-reliability distributed databases, secure cryptographic APIs, and responsive edge apps.',
    'ACADEMY',
    '#ea580c',
    'text-[#ea580c] bg-[#ea580c]/10 border-[#ea580c]/20',
    'GraduationCap',
    3
  )
ON CONFLICT DO NOTHING;

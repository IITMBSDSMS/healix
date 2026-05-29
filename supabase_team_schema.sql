-- ════════════════════════════════════════════════════════════════
--  Healix Engineering Team — Supabase Schema
--  Run this in your Supabase SQL editor
-- ════════════════════════════════════════════════════════════════

-- 1. TEAM MEMBERS TABLE
CREATE TABLE IF NOT EXISTS team_members (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name             TEXT NOT NULL,
  role             TEXT NOT NULL,
  focus            TEXT NOT NULL,
  photo_url        TEXT,        -- Supabase Storage public URL
  display_order    INT DEFAULT 0,
  active           BOOLEAN DEFAULT TRUE,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- 2. AUTO-UPDATE updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS team_members_updated_at ON team_members;
CREATE TRIGGER team_members_updated_at
  BEFORE UPDATE ON team_members
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 3. ROW LEVEL SECURITY
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active team members"
  ON team_members FOR SELECT USING (active = true);

CREATE POLICY "Service role can manage team members"
  ON team_members FOR ALL USING (true) WITH CHECK (true);

-- 4. SEED DATA
INSERT INTO team_members (name, role, focus, photo_url, display_order)
VALUES
  (
    'AI Engineer',
    'AI Infrastructure Engineer',
    'Distributed Systems Architect',
    'https://images.unsplash.com/photo-1519085186480-b8553f4b2a44?q=80&w=400&auto=format&fit=crop',
    0
  ),
  (
    'Data Systems Lead',
    'Healthcare Data Systems Lead',
    'FHIR / HL7 / EHR EHR EHR',
    'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=400&auto=format&fit=crop',
    1
  ),
  (
    'Clinical Advisor',
    'Clinical Intelligence Advisor',
    'Medical workflows + interoperability',
    'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=400&auto=format&fit=crop',
    2
  ),
  (
    'Systems Engineer',
    'Product Systems Engineer',
    'Platform reliability + scale',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&auto=format&fit=crop',
    3
  )
ON CONFLICT DO NOTHING;

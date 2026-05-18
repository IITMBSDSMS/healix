-- ════════════════════════════════════════════════════════════════
--  Healix Mentors & Leadership Team — Supabase Schema
--  Run this in your Supabase SQL editor
-- ════════════════════════════════════════════════════════════════

-- 1. MENTORS TABLE
CREATE TABLE IF NOT EXISTS mentors (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name             TEXT NOT NULL,
  role             TEXT NOT NULL,
  organization     TEXT,
  bio              TEXT,
  quote            TEXT,
  photo_url        TEXT,        -- Supabase Storage public URL
  linkedin_url     TEXT DEFAULT '#',
  twitter_url      TEXT DEFAULT '#',
  github_url       TEXT DEFAULT '#',
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

DROP TRIGGER IF EXISTS mentors_updated_at ON mentors;
CREATE TRIGGER mentors_updated_at
  BEFORE UPDATE ON mentors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 3. ROW LEVEL SECURITY
ALTER TABLE mentors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active mentors"
  ON mentors FOR SELECT USING (active = true);

CREATE POLICY "Service role can manage mentors"
  ON mentors FOR ALL USING (true) WITH CHECK (true);

-- 4. STORAGE BUCKET (run separately or via Supabase dashboard)
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('mentor-photos', 'mentor-photos', true)
-- ON CONFLICT DO NOTHING;

-- 5. SEED DATA
INSERT INTO mentors (name, role, organization, bio, quote, photo_url, linkedin_url, display_order)
VALUES
  (
    'Avnish',
    'Founder & CEO',
    'IIT Madras',
    'Avnish is a 20-year-old builder and engineer from IIT Madras with a deep conviction that healthcare infrastructure in India is fundamentally broken. He started Healix to fix it — not with a single product, but with a unified operating layer for health data.',
    'Healthcare data doesn''t need to be a black box. It needs to be a shared language.',
    '/founder-photo-1.jpg',
    'https://linkedin.com',
    0
  ),
  (
    'Dr. Priya Nair',
    'Head of BioInformatics',
    'AIIMS Delhi',
    'Dr. Priya brings 12 years of clinical genomics experience from AIIMS, leading Healix BioLabs research initiatives and genomic pipeline architecture.',
    'Precision medicine starts with precise data engineering.',
    '/founder-photo-3.jpg',
    'https://linkedin.com',
    1
  ),
  (
    'Rahul Mehta',
    'VP Engineering',
    'IIT Bombay',
    'Rahul leads the core infrastructure team at Healix, previously scaling systems at Razorpay and CRED to handle millions of concurrent transactions.',
    'Reliability isn''t a feature. It''s the foundation.',
    '/founder-photo-2.jpg',
    'https://linkedin.com',
    2
  )
ON CONFLICT DO NOTHING;

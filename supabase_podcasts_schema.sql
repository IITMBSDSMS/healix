-- ════════════════════════════════════════════════════════════════
--  Healix Podcasts Section — Supabase Schema
--  Run this in your Supabase SQL editor
-- ════════════════════════════════════════════════════════════════

-- 1. PODCASTS TABLE
CREATE TABLE IF NOT EXISTS podcasts (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title            TEXT NOT NULL,
  description      TEXT NOT NULL,
  youtube_url      TEXT NOT NULL,
  thumbnail_url    TEXT,        -- Supabase Storage public URL
  duration         TEXT DEFAULT '15:00',
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

DROP TRIGGER IF EXISTS podcasts_updated_at ON podcasts;
CREATE TRIGGER podcasts_updated_at
  BEFORE UPDATE ON podcasts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 3. ROW LEVEL SECURITY
ALTER TABLE podcasts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active podcasts"
  ON podcasts FOR SELECT USING (active = true);

CREATE POLICY "Service role can manage podcasts"
  ON podcasts FOR ALL USING (true) WITH CHECK (true);

-- 4. SEED DATA
INSERT INTO podcasts (title, description, youtube_url, thumbnail_url, duration, display_order)
VALUES
  (
    'BioLabs Sequence Modeling & Genetic Compute Failsafes',
    'Deep dive with our research fellows on leveraging high-performance compute clusters to map CRISPR off-target genetic mutation metrics safely.',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600&auto=format&fit=crop',
    '18:45',
    0
  ),
  (
    'SheSecure IoT Protocols & GPS Failsafe Telemetry Systems',
    'Explaining the low-latency socket streams, emergency SOS overrides, and client-side web dashboards that secure community tracking networks.',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://images.unsplash.com/photo-1581092921461-eab62e97a780?q=80&w=600&auto=format&fit=crop',
    '24:12',
    1
  ),
  (
    'Building Indigenous Clinical Data Infrastructure at IIT Madras',
    'Discussion with our board advisors on bridging the gap between clinical systems and emergency response models inside the indian healthcare stack.',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop',
    '15:30',
    2
  )
ON CONFLICT DO NOTHING;

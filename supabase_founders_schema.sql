-- ════════════════════════════════════════════════════════════════
--  Healix Founders Corner — Supabase Schema
--  Run this in your Supabase SQL editor to enable DB-backed founders!
-- ════════════════════════════════════════════════════════════════

-- 1. FOUNDERS TABLE
CREATE TABLE IF NOT EXISTS founders (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name             TEXT NOT NULL,
  role             TEXT NOT NULL,
  quote            TEXT NOT NULL,
  photo_url        TEXT,         -- Supabase Storage public URL
  linkedin_url     TEXT,
  institution      TEXT,
  display_order    INT DEFAULT 0,
  active           BOOLEAN DEFAULT TRUE,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- 2. AUTO-UPDATE updated_at
CREATE OR REPLACE FUNCTION update_founders_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS founders_updated_at ON founders;
CREATE TRIGGER founders_updated_at
  BEFORE UPDATE ON founders
  FOR EACH ROW EXECUTE FUNCTION update_founders_updated_at();

-- 3. ROW LEVEL SECURITY
ALTER TABLE founders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active founders"
  ON founders FOR SELECT USING (active = true);

CREATE POLICY "Service role can manage founders"
  ON founders FOR ALL USING (true) WITH CHECK (true);

-- 4. SEED DATA (The 7 Healix Team Members)
INSERT INTO founders (name, role, quote, photo_url, linkedin_url, institution, display_order)
VALUES
  (
    'Avnish Verma',
    'Founder & CEO',
    'Precision health data infrastructure is the foundation of modern clinical safety and AI diagnostics. At Healix, we are commoditizing the complex engineering required to unify fragmented health datasets so innovators can build clinical products at scale.',
    'https://images.unsplash.com/photo-1519085186480-b8553f4b2a44?q=80&w=400&auto=format&fit=crop',
    'https://www.linkedin.com/company/quick-healix/',
    'Healix Technologies',
    0
  ),
  (
    'Mahima Sharma',
    'Chief Operating Officer',
    'Reliability is not a feature; it is the core foundation. Scaling operations, securing strategic partnerships, and building sustainable ecosystem networks are key to translating Healix''s clinical tech into tangible community outcomes.',
    'https://chdujpvwawaqgaenrgms.supabase.co/storage/v1/object/public/mentor-photos/7dbf680f-f5d2-4967-b1bb-1bdc40edd29c-1779985889408.png',
    'https://www.linkedin.com/company/quick-healix/',
    'Healix Technologies',
    1
  ),
  (
    'Debarghya Bag',
    'Chief Medical Officer',
    'Precision medicine starts with precise data engineering. Ensuring scientific credibility, medical correctness, and healthcare system reliability is not a post-hoc check—it is built into every telemetry model we run at Healix.',
    'https://chdujpvwawaqgaenrgms.supabase.co/storage/v1/object/public/mentor-photos/2354710c-6edf-459f-9e26-09a96d274a9d-1779985736208.png',
    'https://www.linkedin.com/company/quick-healix/',
    'AIIMS New Delhi',
    2
  ),
  (
    'Sudiksha Sharma',
    'Mental Health & Psychology',
    'Technology must serve the human experience. Designing healthcare systems that people emotionally trust, feel safe using, and find reassuring is critical for securing widespread public health adoption.',
    'https://chdujpvwawaqgaenrgms.supabase.co/storage/v1/object/public/mentor-photos/9e91e2a2-6910-4254-aeca-5fdc074ebb05-1779985539265.png',
    'https://www.linkedin.com/company/quick-healix/',
    'Healix Technologies',
    3
  ),
  (
    'Chaavi Sharma',
    'Mental Health & Human Development',
    'Human-centric development and mental health support must be integrated into modern healthcare systems to build long-term trust and community resilience.',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
    'https://www.linkedin.com/company/quick-healix/',
    'Healix Technologies',
    4
  ),
  (
    'Swaranjali Sonje',
    'Biomedical Engineering',
    'Bridging the gap between engineering and clinical application allows us to build robust hardware telemetry and biosensors that save lives in real-time.',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop',
    'https://www.linkedin.com/company/quick-healix/',
    'Healix Technologies',
    5
  ),
  (
    'Dhruv Advani',
    'Clinical Research & Medical Innovation',
    'Clinical research is the bedrock of medical innovation. By combining AI diagnostics with rigorous validation, we ensure the safety of digital health deployments.',
    'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=400&auto=format&fit=crop',
    'https://www.linkedin.com/company/quick-healix/',
    'AIIMS New Delhi',
    6
  )
ON CONFLICT DO NOTHING;

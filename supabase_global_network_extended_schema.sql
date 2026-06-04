-- ════════════════════════════════════════════════════════════════
--  Healix Global Network Extended — Supabase Schema
--  Run this in your Supabase SQL editor
-- ════════════════════════════════════════════════════════════════

-- 1. GLOBAL FACILITIES TABLE
CREATE TABLE IF NOT EXISTS global_facilities (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name             TEXT NOT NULL,
  city             TEXT NOT NULL,
  facility         TEXT NOT NULL,
  image_url        TEXT NOT NULL,
  description      TEXT NOT NULL,
  mentors          JSONB DEFAULT '[]'::jsonb, -- array of {name, role, photo}
  projects         JSONB DEFAULT '[]'::jsonb, -- array of strings
  display_order    INT DEFAULT 0,
  active           BOOLEAN DEFAULT TRUE,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for global_facilities
ALTER TABLE global_facilities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read active facilities" ON global_facilities;
CREATE POLICY "Public can read active facilities" ON global_facilities
  FOR SELECT USING (active = true);

DROP POLICY IF EXISTS "Service role can manage facilities" ON global_facilities;
CREATE POLICY "Service role can manage facilities" ON global_facilities
  FOR ALL USING (true) WITH CHECK (true);

-- Auto-update updated_at for facilities
CREATE OR REPLACE FUNCTION update_updated_at_facilities()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS global_facilities_updated_at ON global_facilities;
CREATE TRIGGER global_facilities_updated_at
  BEFORE UPDATE ON global_facilities
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_facilities();


-- 2. GLOBAL ENGINEERS TABLE
CREATE TABLE IF NOT EXISTS global_engineers (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name             TEXT NOT NULL,
  logo_url         TEXT,
  fallback_text    TEXT NOT NULL,
  team_name        TEXT NOT NULL,
  specialization   TEXT NOT NULL,
  display_order    INT DEFAULT 0,
  active           BOOLEAN DEFAULT TRUE,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for global_engineers
ALTER TABLE global_engineers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read active engineers" ON global_engineers;
CREATE POLICY "Public can read active engineers" ON global_engineers
  FOR SELECT USING (active = true);

DROP POLICY IF EXISTS "Service role can manage engineers" ON global_engineers;
CREATE POLICY "Service role can manage engineers" ON global_engineers
  FOR ALL USING (true) WITH CHECK (true);

-- Auto-update updated_at for engineers
CREATE OR REPLACE FUNCTION update_updated_at_engineers()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS global_engineers_updated_at ON global_engineers;
CREATE TRIGGER global_engineers_updated_at
  BEFORE UPDATE ON global_engineers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_engineers();


-- 3. SEED DATA
-- Seed Facilities
INSERT INTO global_facilities (name, city, facility, image_url, description, mentors, projects, display_order)
VALUES
  (
    'AIIMS Delhi',
    'New Delhi',
    'Healix Clinical Diagnostics Hub',
    'https://upload.wikimedia.org/wikipedia/commons/b/b2/AIIMS_DELHI.jpg',
    'Serves as the primary clinical validation center. Focuses on real-time telemetry analytics, cardiovascular risk profiling, and patient diagnostics testing workflows.',
    '[
      {"name": "Dr. Amitabha Bandyopadhyay", "role": "Clinical Genetics Consultant", "photo": "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=200&auto=format&fit=crop"},
      {"name": "Dr. Randeep Guleria", "role": "Pulmonology Lead & Telemetry Advisor", "photo": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=200&auto=format&fit=crop"}
    ]'::jsonb,
    '["Cardio Diagnostics AI", "Rural Outreach Telemetry Node", "Low-latency SOS Integration"]'::jsonb,
    0
  ),
  (
    'IIT Delhi',
    'New Delhi',
    'Genomics Compute Center',
    'https://upload.wikimedia.org/wikipedia/commons/e/ee/IIT_Delhi_Main_building.jpg',
    'Hosts the distributed genomic sequence compute cluster. Drives explainable machine learning models for risk analysis and DNA sequence validation.',
    '[
      {"name": "Prof. James Gomes", "role": "Biomedical Engineering Chair", "photo": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"},
      {"name": "Dr. Sonia Gandhi", "role": "Neurogenomics Research Fellow", "photo": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop"}
    ]'::jsonb,
    '["Distributed DNA Sequence Models", "Explainable Risk Prediction Pipeline", "HPC Clusters Cluster-1"]'::jsonb,
    1
  ),
  (
    'IIT Madras',
    'Chennai',
    'Clinical Systems Research Lab',
    'https://upload.wikimedia.org/wikipedia/commons/2/23/IIT_Madras_campus_main_gate.jpg',
    'Specializes in clinical IoT hardware architecture. Integrates hardware sensory fail-safes and edge network coordinates tracking arrays.',
    '[
      {"name": "Prof. Guhan Jayaraman", "role": "Biotechnology Director", "photo": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop"},
      {"name": "Dr. K. VijayRaghavan", "role": "Computational Biology Advisor", "photo": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop"}
    ]'::jsonb,
    '["Sensor Failsafe Telemetry Systems", "Low-latency Edge Sockets", "SheSecure Emergency Gateway"]'::jsonb,
    2
  ),
  (
    'IIT Bombay',
    'Mumbai',
    'Public Health Biosensors Hub',
    'https://upload.wikimedia.org/wikipedia/commons/5/50/Main_building_in_IIT_Bombay.jpg',
    'Develops bio-sensory diagnostic hardware. Specializes in low-cost paper diagnostic sensors and secure telemetry transmitters.',
    '[
      {"name": "Prof. Rohit Srivastava", "role": "Biosensors Innovation Chair", "photo": "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=200&auto=format&fit=crop"},
      {"name": "Dr. Deepa Bhartiya", "role": "Stem Cell Biology Fellow", "photo": "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&auto=format&fit=crop"}
    ]'::jsonb,
    '["Paper Biosensor Transmitters", "Autonomous Health Sync Protocol", "Urban Telemetry Hubs"]'::jsonb,
    3
  ),
  (
    'IISc Bangalore',
    'Bengaluru',
    'Molecular Dynamics & Biochemistry Hub',
    'https://upload.wikimedia.org/wikipedia/commons/e/e4/IISc_main_building.jpg',
    'Focuses on advanced biochemical dynamics, CRISPR off-target mutation models, and high-reliability data integration failsafes.',
    '[
      {"name": "Prof. Sandeep Verma", "role": "Chemical Biology Lead", "photo": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200&auto=format&fit=crop"},
      {"name": "Dr. G. Padmanaban", "role": "Biochemistry Advisor", "photo": "https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=200&auto=format&fit=crop"}
    ]'::jsonb,
    '["CRISPR Mutation Analytics", "Molecular Simulation Telemetry", "High-reliability DB Failsafes"]'::jsonb,
    4
  )
ON CONFLICT DO NOTHING;

-- Seed Engineers
INSERT INTO global_engineers (name, logo_url, fallback_text, team_name, specialization, display_order)
VALUES
  (
    'IIT Delhi',
    'https://upload.wikimedia.org/wikipedia/en/f/fd/IIT_Delhi_Logo.svg',
    'IITD',
    'Genomics Systems Group',
    'AI Diagnostics & Genomics Arrays',
    0
  ),
  (
    'IIT Bombay',
    'https://upload.wikimedia.org/wikipedia/en/1/1d/Indian_Institute_of_Technology_Bombay_Logo.svg',
    'IITB',
    'Sensors & Telemetry Labs',
    'IoT Systems & Emergency Telemetry',
    1
  ),
  (
    'IIT Madras',
    'https://upload.wikimedia.org/wikipedia/en/8/81/Indian_Institute_of_Technology_Madras_Logo.svg',
    'IITM',
    'Distributed Hardware Unit',
    'Edge Node Security & Socket Protocols',
    2
  ),
  (
    'IISc Bangalore',
    'https://upload.wikimedia.org/wikipedia/en/thumb/f/f9/Indian_Science_logo.svg/440px-Indian_Science_logo.svg.png',
    'IISc',
    'Bio-Computation Center',
    'Molecular Modeling & Failsafe DBs',
    3
  )
ON CONFLICT DO NOTHING;

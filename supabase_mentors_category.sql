-- ════════════════════════════════════════════════════════════════
--  Healix Ecosystem Advisory — Mentors Schema & Seed Data
--  Run this in your Supabase SQL editor!
-- ════════════════════════════════════════════════════════════════

-- Ensure category column exists in mentors table
ALTER TABLE mentors ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'clinical';

-- Safely add UNIQUE constraint to name in mentors if not already present
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'mentors_name_key'
    ) THEN
        -- Delete any duplicate names first to ensure constraint creation succeeds
        DELETE FROM mentors f1
        USING mentors f2
        WHERE f1.name = f2.name AND f1.id::text > f2.id::text;
        
        ALTER TABLE mentors ADD CONSTRAINT mentors_name_key UNIQUE (name);
    END IF;
END $$;

-- Seed data for the 12 advisors and mentors
INSERT INTO mentors (name, role, organization, bio, photo_url, linkedin_url, category, display_order, active)
VALUES
  -- Clinical Advisors
  (
    'Dr. Partha Pratim',
    'MD',
    'AIIMS New Delhi',
    'Genomics sequencing diagnostics & risk profiling',
    'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=400&auto=format&fit=crop',
    'https://www.linkedin.com/company/quick-healix/',
    'clinical',
    0,
    true
  ),
  (
    'Dr. Sarah Chen',
    'MD, PhD',
    'Stanford Medicine',
    'Clinical decision support & triaging pipelines',
    'https://images.unsplash.com/photo-1594824813573-246434de83fb?q=80&w=400&auto=format&fit=crop',
    'https://www.linkedin.com/company/quick-healix/',
    'clinical',
    1,
    true
  ),
  (
    'Dr. A. C. Roy',
    'MD, FACC',
    'Mayo Clinic',
    'Cardiovascular telemetry & remote monitoring',
    'https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=400&auto=format&fit=crop',
    'https://www.linkedin.com/company/quick-healix/',
    'clinical',
    2,
    true
  ),
  -- Research Advisors
  (
    'Dr. Rajesh K. Sharma',
    'PhD',
    'IISc Bangalore',
    'Distributed algorithms & database reliability',
    'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=400&auto=format&fit=crop',
    'https://www.linkedin.com/company/quick-healix/',
    'research',
    3,
    true
  ),
  (
    'Prof. Michael Sterling',
    'PhD',
    'MIT Media Lab',
    'Wearable biosensors & edge compute arrays',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop',
    'https://www.linkedin.com/company/quick-healix/',
    'research',
    4,
    true
  ),
  (
    'Dr. Ananya Ray',
    'PhD',
    'IIT Madras',
    'In-silico molecular modeling & cancer targets',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop',
    'https://www.linkedin.com/company/quick-healix/',
    'research',
    5,
    true
  ),
  -- Academic Mentors
  (
    'Prof. R. Sharma',
    'Senior Faculty',
    'IIT Delhi',
    'Telemetry synchronization & network protocols',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop',
    'https://www.linkedin.com/company/quick-healix/',
    'academic',
    6,
    true
  ),
  (
    'Dr. Vikram Sen',
    'Professor',
    'AIIMS New Delhi',
    'Community health diagnostics & survey design',
    'https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=400&auto=format&fit=crop',
    'https://www.linkedin.com/company/quick-healix/',
    'academic',
    7,
    true
  ),
  (
    'Dr. Helen Rostova',
    'Faculty',
    'Cambridge University',
    'Explainable deep learning models in healthcare',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop',
    'https://www.linkedin.com/company/quick-healix/',
    'academic',
    8,
    true
  ),
  -- Industry Experts
  (
    'Sudiksha Sharma',
    'Human Systems Strategist',
    'CU Delhi',
    'Behavioral psychology & interface trust dynamics',
    'https://chdujpvwawaqgaenrgms.supabase.co/storage/v1/object/public/mentor-photos/9e91e2a2-6910-4254-aeca-5fdc074ebb05-1779985539265.png',
    'https://www.linkedin.com/company/quick-healix/',
    'industry',
    9,
    true
  ),
  (
    'Siddharth Bose',
    'Partner',
    'Biotech Capital',
    'Commercialization & intellectual property structures',
    'https://images.unsplash.com/photo-1519085186480-b8553f4b2a44?q=80&w=400&auto=format&fit=crop',
    'https://www.linkedin.com/company/quick-healix/',
    'industry',
    10,
    true
  ),
  (
    'Elena Petrova',
    'Director',
    'Global Pharma Solutions',
    'Clinical trial designs & regulatory compliance',
    'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?q=80&w=400&auto=format&fit=crop',
    'https://www.linkedin.com/company/quick-healix/',
    'industry',
    11,
    true
  )
ON CONFLICT (name) DO UPDATE SET
  role = EXCLUDED.role,
  organization = EXCLUDED.organization,
  bio = EXCLUDED.bio,
  photo_url = EXCLUDED.photo_url,
  linkedin_url = EXCLUDED.linkedin_url,
  category = EXCLUDED.category,
  display_order = EXCLUDED.display_order,
  active = EXCLUDED.active;

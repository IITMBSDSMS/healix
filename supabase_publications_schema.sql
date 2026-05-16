-- Run this in your Supabase SQL editor to enable the Research Papers section

CREATE TABLE IF NOT EXISTS biolab_publications (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,
  subtitle    TEXT,
  description TEXT,
  image_url   TEXT NOT NULL,
  label       TEXT NOT NULL DEFAULT 'Edition',       -- e.g. "June 26", "Featured"
  ribbon_color TEXT DEFAULT 'from-green-600 to-emerald-900', -- Tailwind gradient classes
  is_featured BOOLEAN DEFAULT FALSE,                 -- TRUE = big left poster card
  link_url    TEXT DEFAULT '#',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Allow public read access
ALTER TABLE biolab_publications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read publications"
  ON biolab_publications FOR SELECT USING (true);

CREATE POLICY "Service role can manage publications"
  ON biolab_publications FOR ALL USING (true)
  WITH CHECK (true);

-- Seed with defaults (optional)
INSERT INTO biolab_publications (title, subtitle, description, image_url, label, ribbon_color, is_featured, link_url)
VALUES
  (
    'INCUBATING DEEP TECH',
    'National Hub for Deep Tech Startups - Economic Times feature on 30.05.2026',
    'With 240 startups valued at ₹10.5k cr incubated over 8 years, Healix is India''s hi-tech haven.',
    'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?q=80&w=800&auto=format&fit=crop',
    'Featured',
    '',
    TRUE,
    '#'
  ),
  (
    'June 2026 Newsletter',
    'Latest Research Edition',
    'Quarterly update on our genomics research and AI diagnostics breakthroughs.',
    'https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=600&auto=format&fit=crop',
    'June 26',
    'from-green-600 to-emerald-900',
    FALSE,
    '#'
  ),
  (
    'April 2026 Edition',
    'BioLabs Research Digest',
    'Highlights from our quarterly AI health research program.',
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=600&auto=format&fit=crop',
    'Apr 26',
    'from-[#ca8a04] to-amber-900',
    FALSE,
    '#'
  ),
  (
    'February 2026 Edition',
    'BioLabs Research Digest',
    'Highlights from our quarterly AI health research program.',
    'https://images.unsplash.com/photo-1614947942704-5827be95b369?q=80&w=600&auto=format&fit=crop',
    'Feb 26',
    'from-blue-600 to-indigo-900',
    FALSE,
    '#'
  );

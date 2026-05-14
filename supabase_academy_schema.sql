-- Run this SQL in your Supabase SQL Editor to create the Academy tables

CREATE TABLE IF NOT EXISTS public.academy_mentors (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    institution TEXT NOT NULL,
    specialization TEXT NOT NULL,
    experience TEXT NOT NULL,
    "photoUrl" TEXT NOT NULL,
    "linkedinUrl" TEXT,
    companies JSONB DEFAULT '[]'::jsonb,
    bio TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.academy_courses (
    id TEXT PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    "shortDescription" TEXT NOT NULL,
    "longDescription" TEXT NOT NULL,
    price INTEGER NOT NULL,
    "originalPrice" INTEGER NOT NULL,
    duration TEXT NOT NULL,
    difficulty TEXT NOT NULL,
    "seatsRemaining" INTEGER NOT NULL,
    mentors JSONB DEFAULT '[]'::jsonb,
    thumbnail TEXT NOT NULL,
    modules JSONB DEFAULT '[]'::jsonb,
    outcomes JSONB DEFAULT '[]'::jsonb,
    projects JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Note: The application will automatically fallback to the static `src/lib/academy/data.ts` 
-- if these tables do not exist or are empty, preventing any production downtime.

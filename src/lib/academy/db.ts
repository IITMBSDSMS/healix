import { createClient } from "@/utils/supabase/client";
import { courses as defaultCourses, mentors as defaultMentors } from "./data";

// Fallback to static data if Supabase tables don't exist yet
export async function getCourses() {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.from('academy_courses').select('*').order('created_at', { ascending: false });
    
    if (error || !data || data.length === 0) {
      console.warn("Using fallback courses data:", error?.message);
      return defaultCourses;
    }
    
    // Parse JSON fields if they come back as strings (depending on Supabase setup)
    return data.map(course => ({
      ...course,
      mentors: typeof course.mentors === 'string' ? JSON.parse(course.mentors) : course.mentors,
      modules: typeof course.modules === 'string' ? JSON.parse(course.modules) : course.modules,
      outcomes: typeof course.outcomes === 'string' ? JSON.parse(course.outcomes) : course.outcomes,
      projects: typeof course.projects === 'string' ? JSON.parse(course.projects) : course.projects,
    }));
  } catch (err) {
    return defaultCourses;
  }
}

export async function getMentors() {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.from('academy_mentors').select('*').order('created_at', { ascending: false });
    
    if (error || !data || data.length === 0) {
      console.warn("Using fallback mentors data:", error?.message);
      return defaultMentors;
    }
    
    return data.map(mentor => ({
      ...mentor,
      companies: typeof mentor.companies === 'string' ? JSON.parse(mentor.companies) : mentor.companies,
    }));
  } catch (err) {
    return defaultMentors;
  }
}

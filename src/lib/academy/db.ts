import { createClient } from "@/utils/supabase/client";
import { courses as defaultCourses, mentors as defaultMentors } from "./data";

export async function getCourses() {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.from('academy_courses').select('*').order('created_at', { ascending: false });
    
    if (error || !data || data.length === 0) {
      return defaultCourses;
    }
    
    return data.map(course => ({
      ...course,
      shortDescription: course.shortDescription || course.short_description || "",
      longDescription: course.longDescription || course.long_description || "",
      originalPrice: course.originalPrice !== undefined ? course.originalPrice : course.original_price,
      seatsRemaining: course.seatsRemaining !== undefined ? course.seatsRemaining : course.seats_remaining,
      modules: typeof course.modules === 'string' ? JSON.parse(course.modules) : course.modules,
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
      return defaultMentors;
    }
    
    return data.map(mentor => ({
      ...mentor,
      photoUrl: mentor.photoUrl || mentor.photo_url || "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=400&q=80",
      linkedinUrl: mentor.linkedinUrl || mentor.linkedin_url || "https://linkedin.com",
    }));
  } catch (err) {
    return defaultMentors;
  }
}

export async function getCourseBySlug(slug: string) {
  try {
    const supabase = createClient();
    // Use .maybeSingle() to avoid error if not found
    const { data: course, error } = await supabase
      .from('academy_courses')
      .select('*, mentor:academy_mentors(*)')
      .eq('slug', slug)
      .maybeSingle();
    
    if (error || !course) {
      const staticCourse = defaultCourses.find(c => c.slug === slug);
      if (staticCourse) {
        const mentor = defaultMentors.find(m => staticCourse.mentors.includes(m.id));
        return { ...staticCourse, mentor };
      }
      return null;
    }
    
    return {
      ...course,
      modules: typeof course.modules === 'string' ? JSON.parse(course.modules) : course.modules,
      projects: typeof course.projects === 'string' ? JSON.parse(course.projects) : course.projects,
    };
  } catch (err) {
    const staticCourse = defaultCourses.find(c => c.slug === slug);
    if (staticCourse) {
      const mentor = defaultMentors.find(m => staticCourse.mentors.includes(m.id));
      return { ...staticCourse, mentor };
    }
    return null;
  }
}

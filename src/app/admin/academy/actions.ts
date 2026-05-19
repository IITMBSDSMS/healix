"use server";

import { createClient } from "@/utils/supabase/server";
import { checkIsAdmin } from "@/app/admin/actions";
import { revalidatePath } from "next/cache";

export async function addCourse(formData: FormData) {
  const isAdmin = await checkIsAdmin();
  if (!isAdmin) return { error: "Unauthorized" };

  const supabase = await createClient();

  const price = Number(formData.get("price")) || 4999;
  const shortDescription = formData.get("shortDescription")?.toString() || "Build production-grade applications.";

  const course = {
    id: "c" + Math.floor(Math.random() * 1000000),
    slug: formData.get("title")?.toString().toLowerCase().replace(/[^a-z0-9]+/g, "-") || "course-" + Math.floor(Math.random() * 1000),
    title: formData.get("title")?.toString() || "New Cohort Course",
    shortDescription,
    longDescription: formData.get("longDescription")?.toString() || shortDescription,
    price,
    originalPrice: Number(formData.get("originalPrice")) || Math.round(price * 1.5),
    duration: formData.get("duration")?.toString() || "10 Weeks",
    difficulty: formData.get("difficulty")?.toString() || "Intermediate",
    seatsRemaining: Number(formData.get("seatsRemaining")) || 25,
    mentors: JSON.parse(formData.get("mentors")?.toString() || '["m1"]'),
    thumbnail: formData.get("thumbnail")?.toString() || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
    modules: JSON.parse(formData.get("modules")?.toString() || '["Intro", "Development", "Deployment"]'),
    outcomes: JSON.parse(formData.get("outcomes")?.toString() || '["Build Apps", "Deploy to Edge"]'),
    projects: JSON.parse(formData.get("projects")?.toString() || '["SaaS MVP"]'),
  };

  const { error } = await supabase.from('academy_courses').insert([course]);
  
  if (error) {
    console.error("Supabase Error:", error);
    return { error: "Failed to add course. Please ensure the 'academy_courses' table exists in Supabase." };
  }

  revalidatePath("/academy");
  revalidatePath("/admin/academy");
  return { success: true };
}

export async function deleteCourse(id: string) {
  const isAdmin = await checkIsAdmin();
  if (!isAdmin) return { error: "Unauthorized" };

  const supabase = await createClient();
  const { error } = await supabase.from('academy_courses').delete().eq('id', id);
  
  if (error) return { error: error.message };

  revalidatePath("/academy");
  revalidatePath("/admin/academy");
  return { success: true };
}

export async function addMentor(formData: FormData) {
  const isAdmin = await checkIsAdmin();
  if (!isAdmin) return { error: "Unauthorized" };

  const supabase = await createClient();

  const mentor = {
    id: "m" + Math.floor(Math.random() * 1000000),
    name: formData.get("name")?.toString() || "Unknown Instructor",
    role: formData.get("role")?.toString() || "Instructor",
    institution: formData.get("institution")?.toString() || "Healix Academy",
    specialization: formData.get("specialization")?.toString() || "Engineering & Instruction",
    experience: formData.get("experience")?.toString() || "5+ Years",
    photoUrl: formData.get("photoUrl")?.toString() || "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=400&q=80",
    linkedinUrl: formData.get("linkedinUrl")?.toString() || "https://linkedin.com",
    companies: JSON.parse(formData.get("companies")?.toString() || '["Healix"]'),
    bio: formData.get("bio")?.toString() || "Expert systems architect and educator.",
  };

  const { error } = await supabase.from('academy_mentors').insert([mentor]);
  
  if (error) {
    console.error("Supabase Error:", error);
    return { error: "Failed to add mentor. Please ensure the 'academy_mentors' table exists in Supabase." };
  }

  revalidatePath("/academy/mentors");
  revalidatePath("/admin/academy");
  return { success: true };
}

export async function deleteMentor(id: string) {
  const isAdmin = await checkIsAdmin();
  if (!isAdmin) return { error: "Unauthorized" };

  const supabase = await createClient();
  const { error } = await supabase.from('academy_mentors').delete().eq('id', id);
  
  if (error) return { error: error.message };

  revalidatePath("/academy/mentors");
  revalidatePath("/admin/academy");
  return { success: true };
}

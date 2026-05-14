"use server";

import { createClient } from "@/utils/supabase/server";
import { checkIsAdmin } from "@/app/admin/actions";
import { revalidatePath } from "next/cache";

export async function addCourse(formData: FormData) {
  const isAdmin = await checkIsAdmin();
  if (!isAdmin) return { error: "Unauthorized" };

  const supabase = await createClient();

  const course = {
    id: "c" + Math.floor(Math.random() * 1000000),
    slug: formData.get("title")?.toString().toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    title: formData.get("title"),
    shortDescription: formData.get("shortDescription"),
    longDescription: formData.get("longDescription"),
    price: Number(formData.get("price")),
    originalPrice: Number(formData.get("originalPrice")),
    duration: formData.get("duration"),
    difficulty: formData.get("difficulty"),
    seatsRemaining: Number(formData.get("seatsRemaining")),
    mentors: JSON.parse(formData.get("mentors")?.toString() || "[]"),
    thumbnail: formData.get("thumbnail") || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
    modules: JSON.parse(formData.get("modules")?.toString() || "[]"),
    outcomes: JSON.parse(formData.get("outcomes")?.toString() || "[]"),
    projects: JSON.parse(formData.get("projects")?.toString() || "[]"),
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
    name: formData.get("name"),
    role: formData.get("role"),
    institution: formData.get("institution"),
    specialization: formData.get("specialization"),
    experience: formData.get("experience"),
    photoUrl: formData.get("photoUrl") || "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=400&q=80",
    linkedinUrl: formData.get("linkedinUrl"),
    companies: JSON.parse(formData.get("companies")?.toString() || "[]"),
    bio: formData.get("bio"),
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

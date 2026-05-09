"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import QRCode from "qrcode";

export async function checkIsAdmin() {
  const isMock = process.env.NEXT_PUBLIC_SUPABASE_URL === "https://dummy.supabase.co" || !process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (isMock) return true; // Allow admin access in demo/mock mode

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  const adminEmail = process.env.ADMIN_EMAIL;
  if (adminEmail && user.email !== adminEmail) return false;
  return true;
}

export async function getAdminData() {
  const isAdmin = await checkIsAdmin();
  if (!isAdmin) return { error: "Unauthorized" };

  const supabase = await createClient();

  const isMock = process.env.NEXT_PUBLIC_SUPABASE_URL === "https://dummy.supabase.co" || !process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (isMock) {
    return {
      applications: [
        { id: "app-1", name: "Avnish", idea_title: "AI Cancer Detection", category: "AI", status: "pending", created_at: new Date().toISOString() }
      ],
      projects: [
        { id: "proj-1", title: "CRISPR Target Mapping", category: "Healthcare", status: "Research", progress: 65 }
      ],
      vehicles: [
        { id: "demo-vehicle-id", driver_name: "Ramesh Kumar (Demo)", vehicle_number: "DL 01 AB 1234", qr_code: "DL-01-AB-1234" }
      ],
      trips: [],
      announcements: [],
      events: [],
      news: [],
      photos: [],
      programs: [],
      reels: [],
      session_photos: []
    };
  }

  const [appsRes, projRes, vehRes, tripRes, annRes, evtRes, newsRes, photoRes, progRes, reelsRes, sessionPhotoRes] = await Promise.all([
    supabase.from("biolab_applications").select("*").order("created_at", { ascending: false }),
    supabase.from("biolab_projects").select("*").order("created_at", { ascending: false }),
    supabase.from("vehicles").select("*").order("created_at", { ascending: false }),
    supabase.from("trips").select("*, vehicles(vehicle_number)").order("created_at", { ascending: false }).limit(10),
    supabase.from("biolab_announcements").select("*").order("created_at", { ascending: false }),
    supabase.from("biolab_events").select("*").order("created_at", { ascending: false }),
    supabase.from("biolab_news").select("*").order("created_at", { ascending: false }),
    supabase.from("biolab_photos").select("*").order("created_at", { ascending: false }),
    supabase.from("biolab_programs").select("*").order("created_at", { ascending: true }),
    supabase.from("community_reels").select("*").order("created_at", { ascending: false }),
    supabase.from("shesecure_session_photos").select("*").order("created_at", { ascending: false })
  ]);

  return {
    applications: appsRes.data || [],
    projects: projRes.data || [],
    vehicles: vehRes.data || [],
    trips: tripRes.data || [],
    announcements: annRes.data || [],
    events: evtRes.data || [],
    news: newsRes.data || [],
    photos: photoRes.data || [],
    programs: progRes.data || [],
    reels: reelsRes.data || [],
    session_photos: sessionPhotoRes.data || []
  };
}

// === BioLabs Admin Actions ===
export async function updateApplicationStatus(id: string, status: 'accepted' | 'rejected') {
  if (!(await checkIsAdmin())) return { error: "Unauthorized" };
  const supabase = await createClient();
  
  const { error } = await supabase.from("biolab_applications").update({ status }).eq("id", id);
  if (error) return { error: error.message };

  // If accepted, auto-create a project
  if (status === 'accepted') {
    const { data: app } = await supabase.from("biolab_applications").select("*").eq("id", id).single();
    if (app) {
      await supabase.from("biolab_projects").insert({
        title: app.idea_title,
        description: app.description,
        category: app.category,
        status: "idea",
        progress: 0
      });
    }
  }

  revalidatePath("/admin");
  revalidatePath("/biolabs");
  return { success: true };
}

export async function deleteProject(id: string) {
  if (!(await checkIsAdmin())) return { error: "Unauthorized" };
  const supabase = await createClient();
  const { error } = await supabase.from("biolab_projects").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin");
  revalidatePath("/biolabs");
  return { success: true };
}

export async function updateProjectProgress(id: string, progress: number) {
  if (!(await checkIsAdmin())) return { error: "Unauthorized" };
  const supabase = await createClient();
  const { error } = await supabase.from("biolab_projects").update({ progress }).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin");
  revalidatePath("/biolabs");
  return { success: true };
}

// --- Content Management Actions ---

export async function addBiolabPhoto(formData: FormData) {
  if (!(await checkIsAdmin())) return { error: "Unauthorized" };
  const supabase = await createClient();
  const title = formData.get("title") as string;
  const image_url = formData.get("image_url") as string;
  if (!title || !image_url) return { error: "Title and Image URL required" };
  const { error } = await supabase.from("biolab_photos").insert({ title, image_url });
  if (error) return { error: error.message };
  revalidatePath("/admin");
  revalidatePath("/biolabs");
  return { success: true };
}

export async function deleteBiolabPhoto(id: string) {
  if (!(await checkIsAdmin())) return { error: "Unauthorized" };
  const supabase = await createClient();
  const { error } = await supabase.from("biolab_photos").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin");
  revalidatePath("/biolabs");
  return { success: true };
}

export async function addBiolabEvent(formData: FormData) {
  if (!(await checkIsAdmin())) return { error: "Unauthorized" };
  const supabase = await createClient();
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const image_url = formData.get("image_url") as string;
  const start_date = formData.get("start_date") as string;
  const end_date = formData.get("end_date") as string;
  
  if (!title || !description || !image_url || !start_date || !end_date) 
    return { error: "All fields required" };
    
  const { error } = await supabase.from("biolab_events").insert({ 
    title, description, image_url, 
    start_date: new Date(start_date).toISOString(), 
    end_date: new Date(end_date).toISOString() 
  });
  if (error) return { error: error.message };
  revalidatePath("/admin");
  revalidatePath("/biolabs");
  return { success: true };
}

export async function deleteBiolabEvent(id: string) {
  if (!(await checkIsAdmin())) return { error: "Unauthorized" };
  const supabase = await createClient();
  const { error } = await supabase.from("biolab_events").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin");
  revalidatePath("/biolabs");
  return { success: true };
}

export async function addBiolabAnnouncement(formData: FormData) {
  if (!(await checkIsAdmin())) return { error: "Unauthorized" };
  const supabase = await createClient();
  const content = formData.get("content") as string;
  if (!content) return { error: "Content required" };
  const { error } = await supabase.from("biolab_announcements").insert({ content });
  if (error) return { error: error.message };
  revalidatePath("/admin");
  revalidatePath("/biolabs");
  return { success: true };
}

export async function deleteBiolabAnnouncement(id: string) {
  if (!(await checkIsAdmin())) return { error: "Unauthorized" };
  const supabase = await createClient();
  const { error } = await supabase.from("biolab_announcements").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin");
  revalidatePath("/biolabs");
  return { success: true };
}

export async function addBiolabNews(formData: FormData) {
  if (!(await checkIsAdmin())) return { error: "Unauthorized" };
  const supabase = await createClient();
  const title = formData.get("title") as string;
  const link_url = formData.get("link_url") as string || "#";
  const is_document = formData.get("is_document") === "on";
  const file_size = formData.get("file_size") as string || null;
  if (!title) return { error: "Title required" };
  const { error } = await supabase.from("biolab_news").insert({ title, link_url, is_document, file_size });
  if (error) return { error: error.message };
  revalidatePath("/admin");
  revalidatePath("/biolabs");
  return { success: true };
}

export async function deleteBiolabNews(id: string) {
  if (!(await checkIsAdmin())) return { error: "Unauthorized" };
  const supabase = await createClient();
  const { error } = await supabase.from("biolab_news").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin");
  revalidatePath("/biolabs");
  return { success: true };
}

export async function addBiolabProgram(formData: FormData) {
  if (!(await checkIsAdmin())) return { error: "Unauthorized" };
  const supabase = await createClient();
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  if (!title || !description) return { error: "Title and description required" };
  const { error } = await supabase.from("biolab_programs").insert({ title, description });
  if (error) return { error: error.message };
  revalidatePath("/admin");
  revalidatePath("/biolabs");
  return { success: true };
}

export async function deleteBiolabProgram(id: string) {
  if (!(await checkIsAdmin())) return { error: "Unauthorized" };
  const supabase = await createClient();
  const { error } = await supabase.from("biolab_programs").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin");
  revalidatePath("/biolabs");
  return { success: true };
}

// === SheSecure Admin Actions ===
export async function addVehicle(formData: FormData) {
  if (!(await checkIsAdmin())) return { error: "Unauthorized" };
  const supabase = await createClient();
  
  const driver_name = formData.get("driver_name") as string;
  const vehicle_number = formData.get("vehicle_number") as string;
  const iot_device_id = formData.get("iot_device_id") as string;

  if (!driver_name || !vehicle_number) return { error: "Driver name and Vehicle number are required" };

  const id = crypto.randomUUID();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const trackingUrl = `${siteUrl}/suraksha/start?vid=${id}`;

  try {
    const qr_data_url = await QRCode.toDataURL(trackingUrl, {
      width: 400,
      margin: 2,
      color: { dark: '#000000', light: '#ffffff' }
    });

    const { error } = await supabase.from("vehicles").insert({ 
      id,
      driver_name, 
      vehicle_number, 
      qr_data_url,
      qr_code: id.substring(0, 8).toUpperCase(),
      iot_device_id: iot_device_id || null
    });
    
    if (error) return { error: error.message };
  } catch (err: any) {
    console.error(err);
    return { error: "Failed to generate QR code" };
  }
  
  revalidatePath("/admin");
  return { success: true };
}

export async function deleteVehicle(id: string) {
  if (!(await checkIsAdmin())) return { error: "Unauthorized" };
  const supabase = await createClient();
  const { error } = await supabase.from("vehicles").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin");
  return { success: true };
}

// === Community Reels Actions ===
export async function addReel(data: { title: string; user_handle: string; thumbnail_url: string; video_url: string; }) {
  if (!(await checkIsAdmin())) return { error: "Unauthorized" };
  const supabase = await createClient();
  const { error } = await supabase.from("community_reels").insert([data]);
  if (error) return { error: error.message };
  revalidatePath("/admin");
  revalidatePath("/");
  return { success: true };
}

export async function deleteReel(id: string) {
  if (!(await checkIsAdmin())) return { error: "Unauthorized" };
  const supabase = await createClient();
  const { error } = await supabase.from("community_reels").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin");
  revalidatePath("/");
  return { success: true };
}

// === SheSecure Session Photos ===
export async function addSessionPhoto(formData: FormData) {
  if (!(await checkIsAdmin())) return { error: "Unauthorized" };
  const isMock = process.env.NEXT_PUBLIC_SUPABASE_URL === "https://dummy.supabase.co" || !process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (isMock) return { success: true };

  const supabase = await createClient();
  const caption = formData.get("caption") as string;
  const image_url = formData.get("image_url") as string;
  if (!caption || !image_url) return { error: "Caption and Image URL are required" };
  const { error } = await supabase.from("shesecure_session_photos").insert({ caption, image_url });
  if (error) return { error: error.message };
  revalidatePath("/admin");
  revalidatePath("/shesecure");
  return { success: true };
}

export async function deleteSessionPhoto(id: string) {
  if (!(await checkIsAdmin())) return { error: "Unauthorized" };
  const isMock = process.env.NEXT_PUBLIC_SUPABASE_URL === "https://dummy.supabase.co" || !process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (isMock) return { success: true };

  const supabase = await createClient();
  const { error } = await supabase.from("shesecure_session_photos").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin");
  revalidatePath("/shesecure");
  return { success: true };
}

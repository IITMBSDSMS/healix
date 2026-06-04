"use server";

import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { revalidatePath } from "next/cache";
import QRCode from "qrcode";
import { recordAuditLog } from "@/lib/infrastructure/audit";

export async function checkIsAdmin() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    
    // In a real production app, check against an 'admins' table or a custom claim.
    // For now, we'll use an environment variable for the primary admin.
    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail && user.email !== adminEmail) return false;
    
    return true;
  } catch (err) {
    console.error("Exception in checkIsAdmin:", err);
    return false;
  }
}

export async function getAdminData() {
  try {
    const isAdmin = await checkIsAdmin();
    if (!isAdmin) return { error: "Unauthorized" };

    const supabase = await createClient();

    const [
      appsRes, projRes, vehRes, tripRes, 
      annRes, evtRes, newsRes, photoRes, 
      progRes, reelsRes, evidenceRes, sosRes, sessionRes, pubsRes, innovatorsRes
    ] = await Promise.all([
      supabase.from("biolab_applications").select("*").order("created_at", { ascending: false }),
      supabase.from("biolab_projects").select("*").order("created_at", { ascending: false }),
      supabase.from("vehicles").select("*").order("created_at", { ascending: false }),
      supabase.from("trips").select("*, vehicles(vehicle_number)").order("created_at", { ascending: false }).limit(20),
      supabase.from("biolab_announcements").select("*").order("created_at", { ascending: false }),
      supabase.from("biolab_events").select("*").order("created_at", { ascending: false }),
      supabase.from("biolab_news").select("*").order("created_at", { ascending: false }),
      supabase.from("biolab_photos").select("*").order("created_at", { ascending: false }),
      supabase.from("biolab_programs").select("*").order("created_at", { ascending: true }),
      supabase.from("community_reels").select("*").order("created_at", { ascending: false }),
      supabase.from("evidence_logs").select("*, trips(user_id)").order("created_at", { ascending: false }).limit(10),
      supabase.from("sos_alerts").select("*").order("created_at", { ascending: false }).limit(10),
      supabase.from("shesecure_session_photos").select("*").order("created_at", { ascending: false }),
      supabase.from("biolab_publications").select("*").order("created_at", { ascending: false }),
      supabase.from("biolab_innovators").select("*").order("created_at", { ascending: false })
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
      evidence: evidenceRes.data || [],
      sos_alerts: sosRes.data || [],
      session_photos: sessionRes.data || [],
      publications: pubsRes.data || [],
      innovators: innovatorsRes.data || []
    };
  } catch (err: any) {
    console.error("Exception in getAdminData:", err);
    return { error: `Server error: ${err.message || String(err)}` };
  }
}

// === BioLabs Admin Actions ===
export async function updateApplicationStatus(id: string, status: 'accepted' | 'rejected') {
  if (!(await checkIsAdmin())) return { error: "Unauthorized" };
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  const { error } = await supabase.from("biolab_applications").update({ status }).eq("id", id);
  if (error) return { error: error.message };

  await recordAuditLog({
    actor_id: user?.id,
    action: `APPLICATION_${status.toUpperCase()}`,
    entity_type: 'biolab_application',
    entity_id: id
  });

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
  const { data: { user } } = await supabase.auth.getUser();

  const { error } = await supabase.from("biolab_projects").delete().eq("id", id);
  if (error) return { error: error.message };

  await recordAuditLog({
    actor_id: user?.id,
    action: 'DELETE_PROJECT',
    entity_type: 'biolab_project',
    entity_id: id
  });

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
  const supabase = createAdminClient();
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
  const supabase = createAdminClient();
  const { error } = await supabase.from("biolab_photos").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin");
  revalidatePath("/biolabs");
  return { success: true };
}

export async function addBiolabEvent(formData: FormData) {
  if (!(await checkIsAdmin())) return { error: "Unauthorized" };
  const supabase = createAdminClient();
  const title = formData.get("title") as string;
  const rawDescription = formData.get("description") as string;
  const image_url = formData.get("image_url") as string;
  const start_date = formData.get("start_date") as string;
  const end_date = formData.get("end_date") as string;
  const category = formData.get("category") as string || "Academic Workshops";
  const speaker = formData.get("speaker") as string || "Research Fellow";
  const speaker_role = formData.get("speaker_role") as string || "BioLabs Faculty Advisor";
  const seats_left = parseInt(formData.get("seats_left") as string || "15", 10);
  
  if (!title || !rawDescription || !image_url || !start_date || !end_date) 
    return { error: "All fields required" };
    
  const descObj = {
    description: rawDescription,
    category,
    speaker,
    speaker_role,
    seats_left
  };
  const description = JSON.stringify(descObj);
    
  const { error } = await supabase.from("biolab_events").insert({ 
    title, description, image_url, 
    start_date: new Date(start_date).toISOString(), 
    end_date: new Date(end_date).toISOString() 
  });
  if (error) return { error: error.message };
  revalidatePath("/admin");
  revalidatePath("/biolabs");
  revalidatePath("/events");
  return { success: true };
}

export async function deleteBiolabEvent(id: string) {
  if (!(await checkIsAdmin())) return { error: "Unauthorized" };
  const supabase = createAdminClient();
  const { error } = await supabase.from("biolab_events").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin");
  revalidatePath("/biolabs");
  revalidatePath("/events");
  return { success: true };
}

export async function addBiolabAnnouncement(formData: FormData) {
  if (!(await checkIsAdmin())) return { error: "Unauthorized" };
  const supabase = createAdminClient();
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
  const supabase = createAdminClient();
  const { error } = await supabase.from("biolab_announcements").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin");
  revalidatePath("/biolabs");
  return { success: true };
}

export async function addBiolabNews(formData: FormData) {
  if (!(await checkIsAdmin())) return { error: "Unauthorized" };
  const supabase = createAdminClient();
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
  const supabase = createAdminClient();
  const { error } = await supabase.from("biolab_news").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin");
  revalidatePath("/biolabs");
  return { success: true };
}

export async function addBiolabProgram(formData: FormData) {
  if (!(await checkIsAdmin())) return { error: "Unauthorized" };
  const supabase = createAdminClient();
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
  const supabase = createAdminClient();
  const { error } = await supabase.from("biolab_programs").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin");
  revalidatePath("/biolabs");
  return { success: true };
}

// === Research Publications Actions ===
export async function addBiolabPublication(formData: FormData) {
  if (!(await checkIsAdmin())) return { error: "Unauthorized" };
  const supabase = createAdminClient();
  const title = formData.get("title") as string;
  const subtitle = formData.get("subtitle") as string;
  const description = formData.get("description") as string;
  const image_url = formData.get("image_url") as string;
  const label = formData.get("label") as string || "June 26";
  const ribbon_color = formData.get("ribbon_color") as string || "from-green-600 to-emerald-900";
  const is_featured = formData.get("is_featured") === "on";
  const link_url = formData.get("link_url") as string || "#";

  if (!title || !image_url) return { error: "Title and image URL are required." };

  const pubData = { title, subtitle: subtitle || null, description: description || null, image_url, label, ribbon_color, is_featured, link_url };

  const { error } = await supabase.from("biolab_publications").insert(pubData);
  if (error) {
    console.error("[addBiolabPublication] Supabase error:", error.message);
    // Return a localFallback flag so the client can persist to localStorage
    return { error: error.message, localFallback: true, data: pubData };
  }
  revalidatePath("/admin");
  revalidatePath("/biolabs");
  return { success: true };
}

export async function deleteBiolabPublication(id: string) {
  if (!(await checkIsAdmin())) return { error: "Unauthorized" };
  const supabase = createAdminClient();
  const { error } = await supabase.from("biolab_publications").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin");
  revalidatePath("/biolabs");
  return { success: true };
}

// === SheSecure Admin Actions ===
export async function addVehicle(formData: FormData) {
  if (!(await checkIsAdmin())) return { error: "Unauthorized" };
  const supabase = createAdminClient();
  const { data: { user } } = await supabase.auth.getUser();
  
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

    await recordAuditLog({
      actor_id: user?.id,
      action: 'ADD_VEHICLE',
      entity_type: 'vehicle',
      entity_id: id,
      payload: { driver_name, vehicle_number }
    });

  } catch (err: any) {
    console.error(err);
    return { error: "Failed to generate QR code" };
  }
  
  revalidatePath("/admin");
  return { success: true };
}

export async function deleteVehicle(id: string) {
  if (!(await checkIsAdmin())) return { error: "Unauthorized" };
  const supabase = createAdminClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { error } = await supabase.from("vehicles").delete().eq("id", id);
  if (error) return { error: error.message };

  await recordAuditLog({
    actor_id: user?.id,
    action: 'DELETE_VEHICLE',
    entity_type: 'vehicle',
    entity_id: id
  });

  revalidatePath("/admin");
  return { success: true };
}

// === Community Reels Actions ===
export async function addReel(data: { title: string; user_handle: string; thumbnail_url: string; video_url: string; }) {
  if (!(await checkIsAdmin())) return { error: "Unauthorized" };
  const supabase = createAdminClient();
  const { error } = await supabase.from("community_reels").insert([data]);
  if (error) return { error: error.message };
  revalidatePath("/admin");
  revalidatePath("/");
  return { success: true };
}

export async function deleteReel(id: string) {
  if (!(await checkIsAdmin())) return { error: "Unauthorized" };
  const supabase = createAdminClient();
  const { error } = await supabase.from("community_reels").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin");
  revalidatePath("/");
  return { success: true };
}

// === SheSecure Session Photos ===
export async function addSessionPhoto(formData: FormData) {
  if (!(await checkIsAdmin())) return { error: "Unauthorized" };

  const supabase = createAdminClient(); // Use admin client to bypass RLS issues
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

  const supabase = createAdminClient(); // Use admin client
  const { error } = await supabase.from("shesecure_session_photos").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin");
  revalidatePath("/shesecure");
  return { success: true };
}

// === Research & Innovation Scholars Actions ===
export async function addBiolabInnovator(formData: FormData) {
  if (!(await checkIsAdmin())) return { error: "Unauthorized" };
  const supabase = createAdminClient();

  const name = formData.get("name") as string;
  const projectTitle = formData.get("projectTitle") as string;
  const description = formData.get("description") as string;
  const collegeName = formData.get("collegeName") as string;
  const year = (formData.get("year") as string) || "2026";
  const image = formData.get("image") as string;
  const collegeLogo = formData.get("collegeLogo") as string;

  if (!name || !projectTitle || !description || !collegeName) {
    return { error: "All required fields must be filled." };
  }

  const record = {
    name,
    project_title: projectTitle,
    description,
    college_name: collegeName,
    year,
    image_url: image || null,
    college_logo: collegeLogo || "custom",
  };

  const { data, error } = await supabase.from("biolab_innovators").insert(record).select().single();
  if (error) {
    // Return local fallback data so the client can persist to localStorage
    return { error: error.message, localFallback: true, data: { id: Date.now().toString(), ...record } };
  }

  revalidatePath("/admin");
  revalidatePath("/biolabs");
  return { success: true, data };
}

export async function deleteBiolabInnovator(id: string) {
  if (!(await checkIsAdmin())) return { error: "Unauthorized" };
  const supabase = createAdminClient();
  const { error } = await supabase.from("biolab_innovators").delete().eq("id", id);
  if (error) return { error: error.message, localFallback: true };
  revalidatePath("/admin");
  revalidatePath("/biolabs");
  return { success: true };
}

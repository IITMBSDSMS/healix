"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

// ─── SOS ────────────────────────────────────────────────────────────────────

export async function saveSosAlert(location: { lat: number; lng: number } | null) {
  const supabase = await createClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const isMock =
    process.env.NEXT_PUBLIC_SUPABASE_URL === "https://dummy.supabase.co" ||
    !process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (isMock) {
    console.log("[MOCK DB] SOS Alert Saved:", { location });
    try {
      await fetch(`${siteUrl}/api/send-sos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Mock User", location, timestamp: new Date().toISOString(), contacts: [] }),
      });
    } catch (e) {}
    return { success: true };
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in to send an SOS alert." };

  // Save to DB
  await supabase.from("sos_alerts").insert({
    user_id: user.id,
    location: location ? location : null,
    status: "active",
  });

  // Fetch saved emergency contacts
  const { data: contacts } = await supabase
    .from("contacts")
    .select("*")
    .eq("user_id", user.id);

  try {
    await fetch(`${siteUrl}/api/send-sos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: user.user_metadata?.name || user.email,
        location,
        timestamp: new Date().toISOString(),
        contacts: contacts || [],
      }),
    });
  } catch (err) {
    console.error("Failed to trigger SOS email:", err);
  }

  return { success: true };
}

// ─── SESSION PHOTOS ──────────────────────────────────────────────────────────

export async function getSessionPhotos() {
  const isMock = process.env.NEXT_PUBLIC_SUPABASE_URL === "https://dummy.supabase.co" || !process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (isMock) return [];

  const supabase = await createClient();
  const { data } = await supabase
    .from("shesecure_session_photos")
    .select("*")
    .order("created_at", { ascending: false });

  return data || [];
}

// ─── EMERGENCY CONTACTS ──────────────────────────────────────────────────────


export async function getContacts() {
  const isMock = process.env.NEXT_PUBLIC_SUPABASE_URL === "https://dummy.supabase.co" || !process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (isMock) return [];

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("contacts")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  return data || [];
}

export async function saveContact(formData: FormData) {
  const isMock = process.env.NEXT_PUBLIC_SUPABASE_URL === "https://dummy.supabase.co" || !process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (isMock) return { success: true };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const email = formData.get("email") as string;

  if (!name) return { error: "Name is required" };

  const { error } = await supabase.from("contacts").insert({
    user_id: user.id,
    name,
    phone: phone || null,
    email: email || null,
  });

  if (error) return { error: error.message };
  revalidatePath("/shesecure");
  return { success: true };
}

export async function deleteContact(id: string) {
  const isMock = process.env.NEXT_PUBLIC_SUPABASE_URL === "https://dummy.supabase.co" || !process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (isMock) return { success: true };

  const supabase = await createClient();
  const { error } = await supabase.from("contacts").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/shesecure");
  return { success: true };
}

// ─── PROJECT SURAKSHA ────────────────────────────────────────────────────────

export async function lookupVehicle(qrCode: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("vehicles")
    .select("*")
    .or(`qr_code.eq.${qrCode},vehicle_number.ilike.%${qrCode}%`)
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    return { error: "Vehicle not found for this code." };
  }
  
  return { vehicle: data };
}

export async function startTrip(
  vehicleId: string,
  location: { lat: number; lng: number } | null,
  recordingEnabled: boolean = false
) {
  const isMock = process.env.NEXT_PUBLIC_SUPABASE_URL === "https://dummy.supabase.co" || !process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (isMock) {
    console.log("[MOCK] startTrip called", { vehicleId, location });
    return { success: true, tripId: "mock-trip-" + Date.now() };
  }

  const supabase = await createClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { data: trip, error } = await supabase
    .from("trips")
    .insert({
      user_id: user.id,
      vehicle_id: vehicleId,
      start_location: location,
      status: "active",
      recording_enabled: recordingEnabled,
    })
    .select()
    .single();

  if (error) return { error: error.message };

  // Fetch contacts and send trip start alert
  const { data: contacts } = await supabase
    .from("contacts")
    .select("*")
    .eq("user_id", user.id);

  try {
    await fetch(`${siteUrl}/api/send-trip-alert`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userName: user.user_metadata?.name || user.email,
        vehicleId,
        location,
        contacts: contacts || [],
        timestamp: new Date().toISOString(),
      }),
    });
  } catch (e) {}

  revalidatePath("/shesecure");
  return { success: true, tripId: trip.id };
}

export async function endTrip(tripId: string) {
  const isMock = process.env.NEXT_PUBLIC_SUPABASE_URL === "https://dummy.supabase.co" || !process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (isMock) return { success: true };

  const supabase = await createClient();
  const { error } = await supabase
    .from("trips")
    .update({ status: "completed" })
    .eq("id", tripId);

  if (error) return { error: error.message };
  revalidatePath("/shesecure");
  return { success: true };
}

export async function getTripHistory() {
  const isMock = process.env.NEXT_PUBLIC_SUPABASE_URL === "https://dummy.supabase.co" || !process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (isMock) return [];

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("trips")
    .select("*, vehicles(driver_name, vehicle_number)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5);

  return data || [];
}

export async function updateTripLocation(tripId: string, location: { lat: number; lng: number }) {

  const supabase = await createClient();
  const timestamp = new Date().toISOString();

  // Fetch current route_data
  const { data: trip, error: fetchError } = await supabase
    .from("trips")
    .select("route_data")
    .eq("id", tripId)
    .single();

  if (fetchError || !trip) return { error: "Trip not found" };

  const routeData = trip.route_data || [];
  const updatedRoute = [...routeData, { lat: location.lat, lng: location.lng, timestamp }];

  const { error } = await supabase
    .from("trips")
    .update({ route_data: updatedRoute })
    .eq("id", tripId);

  if (error) return { error: error.message };
  return { success: true };
}

export async function getTripData(tripId: string) {

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("trips")
    .select(`
      id,
      status,
      start_location,
      route_data,
      created_at,
      user_id,
      vehicles (driver_name, vehicle_number, iot_device_id)
    `)
    .eq("id", tripId)
    .single();

  if (error || !data) return { error: "Trip not found" };

  // Fetch the user's name separately since auth.users doesn't directly join easily in all setups
  const { data: userData } = await supabase.auth.admin.getUserById(data.user_id).catch(() => ({ data: null }));

  return {
    trip: {
      ...data,
      user: { name: userData?.user?.user_metadata?.name || "Healix User" }
    }
  };
}

export async function triggerIotOverride(tripId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("trips")
    .update({ status: "iot_override" })
    .eq("id", tripId);
  if (error) return { error: error.message };
  return { success: true };
}

export async function getIotTelemetry(deviceId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("iot_telemetry")
    .select("*")
    .eq("device_id", deviceId)
    .order("timestamp", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) return { error: "No telemetry found" };
  return { telemetry: data };
}

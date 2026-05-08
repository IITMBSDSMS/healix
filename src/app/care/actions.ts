"use server";

import { createClient } from "@/utils/supabase/server";

export async function bookAppointment(formData: FormData) {
  const type = formData.get("type") as string;
  const date = formData.get("date") as string;
  const notes = formData.get("notes") as string;

  if (!type || !date) {
    return { error: "Service type and date are required." };
  }

  const supabase = await createClient();

  if (process.env.NEXT_PUBLIC_SUPABASE_URL === "https://dummy.supabase.co" || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
    console.log("[MOCK DB] Appointment Booked:", { type, date, notes });
    return { success: true };
  }

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to book an appointment." };
  }

  const { error } = await supabase.from("appointments").insert({
    user_id: user.id,
    type,
    date,
    status: "pending",
  });

  if (error) {
    console.error("Failed to book appointment:", error);
    return { error: error.message };
  }

  return { success: true };
}

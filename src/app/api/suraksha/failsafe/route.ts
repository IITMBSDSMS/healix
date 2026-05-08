import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { tripId } = await req.json();
    if (!tripId || typeof tripId !== "string" || !/^[0-9a-f-]{36}$/i.test(tripId)) {
      return NextResponse.json({ error: "Invalid tripId" }, { status: 400 });
    }

    // Fetch the trip with vehicle and user
    const { data: trip, error } = await supabase
      .from("trips")
      .select(`id, user_id, status, vehicles(vehicle_number, driver_name)`)
      .eq("id", tripId)
      .single();

    if (error || !trip) return NextResponse.json({ error: "Trip not found" }, { status: 404 });

    // Fetch contacts
    const { data: contacts } = await supabase
      .from("contacts")
      .select("name, email")
      .eq("user_id", trip.user_id);

    if (!contacts || contacts.length === 0) {
      return NextResponse.json({ success: true, message: "No contacts to alert" });
    }

    // Send failsafe alert emails
    const v = trip.vehicles as any;
    for (const contact of contacts) {
      await resend.emails.send({
        from: "SheSecure <alerts@resend.dev>",
        to: contact.email,
        subject: "⚠️ ALERT: GPS Signal Lost — SheSecure Failsafe Triggered",
        html: `
          <div style="font-family: sans-serif; max-width: 520px; margin: auto; background: #111; color: #eee; padding: 32px; border-radius: 12px; border: 1px solid #333;">
            <h2 style="color: #f97316;">⚠️ Tracking Signal Lost</h2>
            <p>Hi ${contact.name},</p>
            <p>This is an automated safety alert from <strong>SheSecure by Healix</strong>.</p>
            <p>The GPS signal for your trusted contact was <strong>lost for over 60 seconds</strong> during an active trip.</p>
            <table style="width:100%; border-collapse: collapse; margin: 16px 0;">
              <tr><td style="padding:8px; color:#aaa;">Vehicle</td><td style="padding:8px; font-weight:bold;">${v?.vehicle_number || "Unknown"}</td></tr>
              <tr><td style="padding:8px; color:#aaa;">Driver</td><td style="padding:8px;">${v?.driver_name || "Unknown"}</td></tr>
              <tr><td style="padding:8px; color:#aaa;">Time</td><td style="padding:8px;">${new Date().toLocaleString()}</td></tr>
              <tr><td style="padding:8px; color:#aaa;">Status</td><td style="padding:8px; color:#f87171;"><strong>IoT Failsafe Activated</strong></td></tr>
            </table>
            <p style="color:#aaa; font-size:12px;">If you are concerned about safety, please contact local emergency services. Healix provides safety assistance tools and does not replace emergency services.</p>
          </div>
        `,
      });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Failsafe API Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

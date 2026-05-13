import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

export async function POST(req: Request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dummy.supabase.co',
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy_key'
  );
  const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy');
  try {
    const { tripId, location } = await req.json();

    // Strict validation
    if (!tripId || typeof tripId !== "string" || !/^[0-9a-f-]{36}$/i.test(tripId)) {
      return NextResponse.json({ error: "Invalid tripId" }, { status: 400 });
    }
    if (location && (typeof location.lat !== "number" || typeof location.lng !== "number" ||
      location.lat < -90 || location.lat > 90 || location.lng < -180 || location.lng > 180)) {
      return NextResponse.json({ error: "Invalid location coordinates" }, { status: 400 });
    }

    // Fetch the trip
    const { data: trip, error } = await supabase
      .from("trips")
      .select(`id, user_id, vehicles(vehicle_number, driver_name)`)
      .eq("id", tripId)
      .single();

    if (error || !trip) return NextResponse.json({ error: "Trip not found" }, { status: 404 });

    // Log SOS event
    await supabase.from("sos_alerts").insert({
      user_id: trip.user_id,
      location,
    });

    // Fetch contacts
    const { data: contacts } = await supabase
      .from("contacts")
      .select("name, email")
      .eq("user_id", trip.user_id);

    if (!contacts || contacts.length === 0) {
      return NextResponse.json({ success: true, message: "SOS logged, no contacts to alert" });
    }

    const v = trip.vehicles as any;
    const mapsLink = location
      ? `https://maps.google.com/?q=${location.lat},${location.lng}`
      : null;

    for (const contact of contacts) {
      await resend.emails.send({
        from: "SheSecure <alerts@resend.dev>",
        to: contact.email,
        subject: "🚨 SOS EMERGENCY — Immediate Attention Required",
        html: `
          <div style="font-family: sans-serif; max-width: 520px; margin: auto; background: #111; color: #eee; padding: 32px; border-radius: 12px; border: 2px solid #ef4444;">
            <h2 style="color: #ef4444;">🚨 SOS EMERGENCY ALERT</h2>
            <p>Hi ${contact.name},</p>
            <p>Your trusted contact has pressed the <strong>SOS Emergency Button</strong> on their SheSecure app. Please check on them immediately.</p>
            <table style="width:100%; border-collapse: collapse; margin: 16px 0;">
              <tr><td style="padding:8px; color:#aaa;">Vehicle</td><td style="padding:8px; font-weight:bold;">${v?.vehicle_number || "Unknown"}</td></tr>
              <tr><td style="padding:8px; color:#aaa;">Driver</td><td style="padding:8px;">${v?.driver_name || "Unknown"}</td></tr>
              <tr><td style="padding:8px; color:#aaa;">Time</td><td style="padding:8px; color:#f87171; font-weight: bold;">${new Date().toLocaleString()}</td></tr>
              ${location ? `<tr><td style="padding:8px; color:#aaa;">GPS Location</td><td style="padding:8px; font-family:monospace;">${location.lat?.toFixed(5)}, ${location.lng?.toFixed(5)}</td></tr>` : ""}
            </table>
            ${mapsLink ? `<a href="${mapsLink}" style="display:block; padding: 12px 24px; background: #ef4444; color: white; text-align:center; border-radius: 8px; font-weight: bold; text-decoration: none; margin-bottom: 16px;">📍 View Location in Google Maps</a>` : ""}
            <p style="color:#aaa; font-size:12px;">If you believe this is an emergency, contact local police immediately. Healix provides safety assistance tools and does not replace emergency services.</p>
          </div>
        `,
      });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("SOS API Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

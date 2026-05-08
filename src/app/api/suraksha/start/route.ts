import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { Resend } from "resend";

export async function POST(req: Request) {
  try {
    const { vid, location } = await req.json();

    if (!vid || !location) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized. Please log in." }, { status: 401 });
    }

    // Verify vehicle
    const { data: vehicle, error: vehicleError } = await supabase
      .from("vehicles")
      .select("*")
      .eq("id", vid)
      .single();

    if (vehicleError || !vehicle) {
      return NextResponse.json({ success: false, error: "Invalid vehicle" }, { status: 400 });
    }

    // Create Trip
    const { data: trip, error: tripError } = await supabase
      .from("trips")
      .insert({
        user_id: user.id,
        vehicle_id: vid,
        start_location: location,
        status: "active"
      })
      .select()
      .single();

    if (tripError) {
      console.error("Trip creation error:", tripError);
      return NextResponse.json({ success: false, error: "Failed to create trip" }, { status: 500 });
    }

    // Fetch Emergency Contacts
    const { data: contacts } = await supabase
      .from("contacts")
      .select("*")
      .eq("user_id", user.id);

    // Send emails if contacts exist
    if (contacts && contacts.length > 0 && process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const emailAddresses = contacts.map((c: any) => c.email).filter(Boolean);
      
      if (emailAddresses.length > 0) {
        const userName = user.user_metadata?.name || user.email;
        const mapsLink = `https://maps.google.com/?q=${location.lat},${location.lng}`;
        
        await resend.emails.send({
          from: "Suraksha Alerts <onboarding@resend.dev>", // Using Resend testing domain
          to: emailAddresses,
          subject: `Security Alert: ${userName} has started a trip`,
          html: `
            <div style="font-family: sans-serif; padding: 20px; background-color: #f9f9f9;">
              <h2 style="color: #ea580c;">Project Suraksha Tracking Started</h2>
              <p><strong>${userName}</strong> has just started a trip and added you as an emergency contact.</p>
              <div style="background: white; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p style="margin-bottom: 5px;"><strong>Vehicle:</strong> ${vehicle.vehicle_number}</p>
                <p style="margin-top: 0;"><strong>Driver:</strong> ${vehicle.driver_name}</p>
              </div>
              <p><strong>Starting Location:</strong> <a href="${mapsLink}" style="color: #ea580c;">View on Google Maps</a></p>
              <p style="font-size: 12px; color: #666; margin-top: 30px;">This is an automated safety alert from Healix Technologies.</p>
            </div>
          `
        }).catch(err => console.error("Resend error:", err));
      }
    }

    return NextResponse.json({ success: true, tripId: trip.id });
  } catch (err: any) {
    console.error("API error:", err);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

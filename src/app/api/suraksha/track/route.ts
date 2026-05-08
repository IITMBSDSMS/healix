import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
  try {
    const { tripId, location } = await req.json();

    if (!tripId || !location) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // Insert location
    const { error: insertError } = await supabase
      .from("trip_locations")
      .insert({
        trip_id: tripId,
        lat: location.lat,
        lng: location.lng
      });

    if (insertError) {
      console.error("Location insert error:", insertError);
      return NextResponse.json({ success: false, error: "Failed to save location" }, { status: 500 });
    }

    // Optional: Keep `trips.route_data` in sync for legacy code backwards compatibility
    // In a fully normalized system, we just query `trip_locations`.
    // But since `getTripData` might rely on `route_data` JSON array:
    const { data: trip } = await supabase.from("trips").select("route_data").eq("id", tripId).single();
    if (trip) {
      const routeData = trip.route_data || [];
      routeData.push({ lat: location.lat, lng: location.lng, timestamp: new Date().toISOString() });
      await supabase.from("trips").update({ route_data: routeData }).eq("id", tripId);
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Track API error:", err);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

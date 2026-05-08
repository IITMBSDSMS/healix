import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: Request) {
  try {
    // Double-layer secret key check (middleware also validates this)
    const iotSecret = req.headers.get("x-iot-secret");
    if (process.env.IOT_API_SECRET && iotSecret !== process.env.IOT_API_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { deviceId, lat, lng, audioBase64, isEmergency } = body;

    // Strict input validation
    if (!deviceId || typeof deviceId !== "string" || deviceId.length > 64) {
      return NextResponse.json({ error: "Invalid deviceId" }, { status: 400 });
    }
    if (typeof lat !== "number" || typeof lng !== "number" || isNaN(lat) || isNaN(lng)) {
      return NextResponse.json({ error: "lat and lng must be valid numbers" }, { status: 400 });
    }
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return NextResponse.json({ error: "lat/lng out of valid range" }, { status: 400 });
    }

    // Validate device exists in fleet
    const { data: vehicle } = await supabase
      .from("vehicles")
      .select("id")
      .eq("iot_device_id", deviceId)
      .maybeSingle();
    if (!vehicle) {
      return NextResponse.json({ error: "Unknown IoT device ID" }, { status: 403 });
    }

    const { error } = await supabase.from("iot_telemetry").insert({
      device_id: deviceId,
      location: { lat, lng },
      audio_buffer: audioBase64 || null,
      is_emergency: isEmergency === true,
    });

    if (error) {
      console.error("IoT Insert Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("IoT API Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

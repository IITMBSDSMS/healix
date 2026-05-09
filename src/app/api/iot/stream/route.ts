import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  try {
    const body = await req.json();
    const { deviceId, lat, lng, timestamp, audioBase64, isEmergency } = body;

    // 1. Secret Key Validation
    const iotSecret = req.headers.get("x-iot-secret");
    const systemSecret = process.env.IOT_API_SECRET;
    if (systemSecret && iotSecret !== systemSecret) {
      return NextResponse.json({ error: "Unauthorized Secret" }, { status: 401 });
    }

    // 2. Strict Input Validation
    if (!deviceId || typeof deviceId !== "string") {
      return NextResponse.json({ error: "Missing or invalid deviceId" }, { status: 400 });
    }
    if (typeof lat !== "number" || typeof lng !== "number") {
      return NextResponse.json({ error: "lat and lng must be valid numbers" }, { status: 400 });
    }

    const isMock = process.env.NEXT_PUBLIC_SUPABASE_URL === "https://dummy.supabase.co" || !process.env.NEXT_PUBLIC_SUPABASE_URL;

    if (isMock) {
      console.log("Mock IoT Telemetry:", { deviceId, lat, lng, timestamp });
      return NextResponse.json({ success: true, mock: true });
    }

    // 3. Device Validation (Must exist in iot_devices)
    const { data: device, error: deviceError } = await supabase
      .from("iot_devices")
      .select("*")
      .eq("id", deviceId)
      .single();

    if (deviceError || !device) {
      return NextResponse.json({ error: "Unknown IoT device ID: " + deviceId }, { status: 403 });
    }

    // 4. Flat Telemetry Insertion
    const { error } = await supabase.from("iot_telemetry").insert({
      device_id: deviceId,
      lat,
      lng,
      timestamp: timestamp || new Date().toISOString(),
      audio_buffer: audioBase64 || null,
      is_emergency: isEmergency === true,
    });

    if (error) {
      console.error("Telemetry Write Failed:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("IoT Gateway Error:", err);
    return NextResponse.json({ error: "Internal Gateway Error" }, { status: 500 });
  }
}

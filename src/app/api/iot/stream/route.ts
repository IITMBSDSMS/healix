import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { systemLogger } from '@/lib/infrastructure/logger';
import { rateLimit } from '@/lib/infrastructure/rate-limiter';
import { pushToList } from '@/lib/infrastructure/cache';
import { pushToDlq } from '@/lib/infrastructure/dlq';
import { verifySignature } from '@/lib/infrastructure/crypto';

export async function POST(req: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  const requestId = crypto.randomUUID();
  const timestampHeader = req.headers.get("x-healix-timestamp");
  const signature = req.headers.get("x-healix-signature");
  
  systemLogger.info('Received IoT stream request', { requestId });

  try {
    // Clone request to read body twice (once for signature, once for parsing)
    const rawBody = await req.text();
    const body = JSON.parse(rawBody);
    const { deviceId, lat, lng, timestamp, audioBase64, isEmergency } = body;

    // 1. Zero-Trust Signature Validation (Phase 5)
    const systemSecret = process.env.IOT_API_SECRET;
    
    // In production, we require signatures. For dev, we might allow bypass if secret is missing.
    if (systemSecret) {
      // We verify the signature against the raw body + timestamp to prevent replay attacks
      const isValid = verifySignature(rawBody + (timestampHeader || ''), signature || '', systemSecret);
      
      if (!isValid) {
        systemLogger.warn('Invalid HMAC signature', { requestId, deviceId });
        
        await pushToDlq({
          queue: 'iot-security',
          event: body,
          error: 'Invalid HMAC Signature'
        });

        return NextResponse.json({ error: "Invalid Signature" }, { status: 403 });
      }
    }

    // 2. Strict Input Validation
    if (!deviceId || typeof deviceId !== "string") {
      systemLogger.warn('Invalid deviceId', { requestId, deviceId });
      return NextResponse.json({ error: "Missing or invalid deviceId" }, { status: 400 });
    }
    
    // Rate Limiting (60 requests per 60 seconds per device)
    const rateLimitResult = await rateLimit(deviceId, 60, 60);
    if (!rateLimitResult.success) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }

    const isMock = process.env.NEXT_PUBLIC_SUPABASE_URL === "https://dummy.supabase.co" || !process.env.NEXT_PUBLIC_SUPABASE_URL;

    if (isMock) {
      systemLogger.info("Mock IoT Telemetry Processed", { requestId, deviceId, lat, lng });
      return NextResponse.json({ success: true, mock: true });
    }

    // 3. Device Validation
    const { data: device, error: deviceError } = await supabase
      .from("iot_devices")
      .select("id")
      .eq("id", deviceId)
      .single();

    if (deviceError || !device) {
      systemLogger.warn('Unknown IoT device ID', { requestId, deviceId });
      return NextResponse.json({ error: "Unknown IoT device ID" }, { status: 403 });
    }

    // 4. Push to Redis Buffer
    const telemetryPayload = {
      device_id: deviceId,
      lat: lat || 0,
      lng: lng || 0,
      timestamp: timestamp || new Date().toISOString(),
      audio_buffer: audioBase64 || null,
      is_emergency: isEmergency === true,
      request_id: requestId
    };

    await pushToList("iot-telemetry-buffer", telemetryPayload);

    systemLogger.info("Telemetry buffered successfully", { requestId, deviceId });
    return NextResponse.json({ success: true, buffered: true });
    
  } catch (err: any) {
    systemLogger.error("IoT Gateway Error", err, { requestId });
    return NextResponse.json({ error: "Internal Gateway Error" }, { status: 500 });
  }
}

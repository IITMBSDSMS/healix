import { NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/admin';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { deviceId, lat, lng, speed, battery, signal } = body;

    if (!deviceId || lat === undefined || lng === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabase = createAdminClient();

    const { error } = await supabase
      .from('iot_telemetry')
      .insert({
        device_id: deviceId,
        lat,
        lng,
        speed,
        battery,
        signal,
        status: 'active',
        route_state: 'in_progress',
        timestamp: new Date().toISOString()
      });

    if (error) {
      console.error("Telemetry Insertion Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Also update the device's battery/signal and last_heartbeat
    await supabase
      .from('iot_devices')
      .update({
        battery_level: battery,
        signal_strength: signal,
        last_heartbeat: new Date().toISOString()
      })
      .eq('id', deviceId);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

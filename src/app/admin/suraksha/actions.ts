"use server";

import { createClient } from "@/utils/supabase/server";
import { checkIsAdmin } from "@/app/admin/actions";
import { revalidatePath } from "next/cache";
import QRCode from "qrcode";
import { Resend } from "resend";

export async function getSurakshaData() {
  const isAdmin = await checkIsAdmin();
  if (!isAdmin) return { error: "Unauthorized" };

  const supabase = await createClient();

  const [devicesRes, telemetryRes, failsafeRes, tamperRes, incidentsRes] = await Promise.all([
    supabase.from("iot_devices").select("*").order("created_at", { ascending: false }),
    supabase.from("iot_telemetry").select("*").order("timestamp", { ascending: false }).limit(50),
    supabase.from("failsafe_events").select("*").order("timestamp", { ascending: false }).limit(20),
    supabase.from("tamper_logs").select("*").order("timestamp", { ascending: false }).limit(20),
    supabase.from("incident_reports").select("*").order("timestamp", { ascending: false }).limit(20),
  ]);

  return {
    devices: devicesRes.data || [],
    telemetry: telemetryRes.data || [],
    failsafeEvents: failsafeRes.data || [],
    tamperLogs: tamperRes.data || [],
    incidents: incidentsRes.data || [],
  };
}

export async function createVirtualDevice(formData: FormData) {
  const isAdmin = await checkIsAdmin();
  if (!isAdmin) return { error: "Unauthorized" };

  const vehicleType = formData.get("vehicle_type") as string;
  const vehicleReg = formData.get("vehicle_reg") as string;
  const driverName = formData.get("driver_name") as string;

  // Generate an ID like IOT-CAB-042
  const randomNum = Math.floor(Math.random() * 900) + 100;
  const deviceId = `IOT-${vehicleType.toUpperCase()}-${randomNum}`;

  // Generate QR code pointing to the passenger ride flow
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const rideUrl = `${baseUrl}/ride/${deviceId}`;
  const qrCodeDataUrl = await QRCode.toDataURL(rideUrl, { errorCorrectionLevel: 'H' });

  const supabase = await createClient();

  const { error } = await supabase.from("iot_devices").insert({
    id: deviceId,
    vehicle_reg: vehicleReg,
    driver_name: driverName,
    vehicle_type: vehicleType,
    qr_code: qrCodeDataUrl,
    battery_level: 100,
    signal_strength: 4,
    device_health: "optimal",
    online_state: true,
    firmware_version: "v3.0.0-sim",
  });

  if (error) return { error: error.message };

  revalidatePath("/admin/suraksha");
  return { success: true, deviceId };
}

export async function triggerSimulationEvent(deviceId: string, type: 'failsafe' | 'tamper' | 'sos', details: string) {
  const isAdmin = await checkIsAdmin();
  if (!isAdmin) return { error: "Unauthorized" };

  const supabase = await createClient();

  if (type === 'failsafe') {
    await supabase.from("failsafe_events").insert({
      device_id: deviceId,
      trigger_reason: details,
    });
  } else if (type === 'tamper') {
    await supabase.from("tamper_logs").insert({
      device_id: deviceId,
      severity: 'high',
      description: details,
    });
    // Downgrade trust status
    await supabase.from("iot_devices").update({ device_health: 'tampered', encryption_status: false }).eq('id', deviceId);
  } else if (type === 'sos') {
    await supabase.from("incident_reports").insert({
      device_id: deviceId,
      type: 'SOS',
      description: details,
      status: 'open'
    });
    
    // Trigger simulated emergency email via Resend
    if (process.env.RESEND_API_KEY && process.env.ADMIN_EMAIL) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: "Suraksha Operations <alerts@resend.dev>",
        to: process.env.ADMIN_EMAIL,
        subject: `🚨 CRITICAL SOS: Vehicle ${deviceId}`,
        html: `
          <div style="font-family: sans-serif; background: #111; color: #fff; padding: 30px; border-radius: 10px; border-top: 5px solid #ef4444;">
            <h2 style="color: #ef4444;">Project Suraksha Emergency Alert</h2>
            <p>An SOS has been manually triggered from the hardware in device <strong>${deviceId}</strong>.</p>
            <p>Failsafe tracking is active. Incident report has been opened in the Device Operations Center.</p>
            <a href="http://localhost:3000/admin/suraksha" style="display:inline-block; padding: 10px 20px; background: #3b82f6; color: white; text-decoration: none; border-radius: 5px;">Open Operations Center</a>
          </div>
        `
      });
    }
  }

  revalidatePath("/admin/suraksha");
  return { success: true };
}

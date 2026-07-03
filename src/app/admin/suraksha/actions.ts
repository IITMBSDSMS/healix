"use server";

import { createClient } from "@/utils/supabase/server";
import { checkIsAdmin } from "@/app/admin/actions";
import { revalidatePath } from "next/cache";
import QRCode from "qrcode";
import { Resend } from "resend";
import { getEmailTemplateHtml } from "@/utils/emailTemplate";

export async function getSurakshaData() {
  try {
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
  } catch (err: any) {
    console.error("Exception in getSurakshaData:", err);
    return { error: `Suraksha server error: ${err.message || String(err)}` };
  }
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
      const subject = `🚨 CRITICAL SOS: Vehicle ${deviceId}`;
      
      await resend.emails.send({
        from: "Suraksha Operations <alerts@resend.dev>",
        to: process.env.ADMIN_EMAIL,
        subject: subject,
        html: getEmailTemplateHtml({
          subjectTitle: subject,
          recipientName: "Operations Security Administrator",
          bodyHtml: `
            <p style="margin-top: 0; margin-bottom: 16px;">
              A critical security alarm has been manually triggered from the onboard hardware of device/vehicle <strong>${deviceId}</strong>.
            </p>
            <div style="background-color: #fef2f2; border: 1.5px solid #fecaca; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h4 style="margin-top: 0; margin-bottom: 10px; color: #dc2626; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">🚨 Simulation Alert Incident</h4>
              <p style="margin: 0 0 10px 0; font-size: 13.5px; color: #09090b;"><strong>Device ID:</strong> ${deviceId}</p>
              <p style="margin: 0 0 10px 0; font-size: 13.5px; color: #09090b;"><strong>Details:</strong> Failsafe tracking is active. Incident report has been registered in the Device Operations Center.</p>
              
              <div style="margin-top: 15px;">
                <a href="http://localhost:3000/admin/suraksha" style="display: inline-block; background-color: #dc2626; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Open Operations Center</a>
              </div>
            </div>
          `,
          senderName: "Project Suraksha Sentinel",
          senderRole: "Hardware Failsafe Engine",
          senderEmail: "alerts@healix-technologies.com"
        })
      });
    }
  }

  revalidatePath("/admin/suraksha");
  return { success: true };
}

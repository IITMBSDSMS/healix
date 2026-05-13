import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import axios from "axios";

export async function GET() {
  const healthStatus: any = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    services: {
      database: "unknown",
      genomic_engine: "unknown",
    },
  };

  // 1. Check Supabase Database
  try {
    const supabase = await createClient();
    const { error } = await supabase.from("iot_devices").select("id").limit(1);
    if (error) throw error;
    healthStatus.services.database = "healthy";
  } catch (err: any) {
    healthStatus.status = "degraded";
    healthStatus.services.database = "offline";
    console.error("[Health Check] Database offline:", err.message);
  }

  // 2. Check Genomic Engine (Flask)
  try {
    const flaskUrl = process.env.FLASK_API_URL ?? "https://healix-biolabs.onrender.com";
    const response = await axios.get(`${flaskUrl}/health`, { timeout: 3000 });
    if (response.status === 200) {
      healthStatus.services.genomic_engine = "healthy";
    } else {
      throw new Error(`Status ${response.status}`);
    }
  } catch (err: any) {
    healthStatus.status = "degraded";
    healthStatus.services.genomic_engine = "offline";
    console.error("[Health Check] Genomic Engine offline:", err.message);
  }

  const statusCode = healthStatus.status === "healthy" ? 200 : 207; // 207 Multi-Status if degraded
  return NextResponse.json(healthStatus, { status: statusCode });
}

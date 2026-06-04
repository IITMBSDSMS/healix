const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");

let supabaseUrl = "";
let supabaseKey = "";

if (fs.existsSync(".env.local")) {
  const content = fs.readFileSync(".env.local", "utf8");
  content.split("\n").forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const parts = trimmed.split("=");
    const key = parts[0].trim();
    const value = parts.slice(1).join("=").trim().replace(/^['"]|['"]$/g, "");
    if (key === "NEXT_PUBLIC_SUPABASE_URL") {
      supabaseUrl = value;
    }
    if (key === "SUPABASE_SERVICE_ROLE_KEY" || key === "NEXT_PUBLIC_SUPABASE_ANON_KEY") {
      if (!supabaseKey || key === "SUPABASE_SERVICE_ROLE_KEY") {
        supabaseKey = value;
      }
    }
  });
}

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in env.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const queries = {
  biolab_applications: () => supabase.from("biolab_applications").select("*").order("created_at", { ascending: false }),
  biolab_projects: () => supabase.from("biolab_projects").select("*").order("created_at", { ascending: false }),
  vehicles: () => supabase.from("vehicles").select("*").order("created_at", { ascending: false }),
  trips: () => supabase.from("trips").select("*, vehicles(vehicle_number)").order("created_at", { ascending: false }).limit(20),
  biolab_announcements: () => supabase.from("biolab_announcements").select("*").order("created_at", { ascending: false }),
  biolab_events: () => supabase.from("biolab_events").select("*").order("created_at", { ascending: false }),
  biolab_news: () => supabase.from("biolab_news").select("*").order("created_at", { ascending: false }),
  biolab_photos: () => supabase.from("biolab_photos").select("*").order("created_at", { ascending: false }),
  biolab_programs: () => supabase.from("biolab_programs").select("*").order("created_at", { ascending: true }),
  community_reels: () => supabase.from("community_reels").select("*").order("created_at", { ascending: false }),
  evidence_logs: () => supabase.from("evidence_logs").select("*, trips(user_id)").order("created_at", { ascending: false }).limit(10),
  sos_alerts: () => supabase.from("sos_alerts").select("*").order("created_at", { ascending: false }).limit(10),
  shesecure_session_photos: () => supabase.from("shesecure_session_photos").select("*").order("created_at", { ascending: false }),
  biolab_publications: () => supabase.from("biolab_publications").select("*").order("created_at", { ascending: false }),
  biolab_innovators: () => supabase.from("biolab_innovators").select("*").order("created_at", { ascending: false }),
  iot_devices: () => supabase.from("iot_devices").select("*").order("created_at", { ascending: false }),
  iot_telemetry: () => supabase.from("iot_telemetry").select("*").order("timestamp", { ascending: false }).limit(50),
  failsafe_events: () => supabase.from("failsafe_events").select("*").order("timestamp", { ascending: false }).limit(20),
  tamper_logs: () => supabase.from("tamper_logs").select("*").order("timestamp", { ascending: false }).limit(20),
  incident_reports: () => supabase.from("incident_reports").select("*").order("timestamp", { ascending: false }).limit(20),
  academy_courses: () => supabase.from("academy_courses").select("*").order("created_at", { ascending: false }),
  academy_mentors: () => supabase.from("academy_mentors").select("*").order("created_at", { ascending: false })
};

async function run() {
  console.log("Testing individual Supabase table queries...");
  for (const [name, fn] of Object.entries(queries)) {
    try {
      const { data, error } = await fn();
      if (error) {
        console.error(`❌ Table "${name}" query failed: ${error.message} (${error.code})`);
      } else {
        console.log(`✅ Table "${name}" query succeeded. Rows: ${data?.length}`);
      }
    } catch (e) {
      console.error(`💥 Table "${name}" query threw exception:`, e.message);
    }
  }
}

run();

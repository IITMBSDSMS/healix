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

async function check() {
  console.log("Checking academy_mentors table...");
  const { data, error } = await supabase.from("academy_mentors").select("*").limit(2);
  if (error) {
    console.error("Error fetching academy_mentors:", error.message);
  } else {
    console.log("Fetched academy_mentors records:", data);
  }

  console.log("Checking academy_courses table...");
  const { data: cData, error: cError } = await supabase.from("academy_courses").select("*").limit(2);
  if (cError) {
    console.error("Error fetching academy_courses:", cError.message);
  } else {
    console.log("Fetched academy_courses records:", cData);
  }
}

check();

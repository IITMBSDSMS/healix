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
  console.log("Checking Supabase tables...");
  
  const { data: facs, error: facErr } = await supabase.from("global_facilities").select("*");
  if (facErr) {
    console.error("Error fetching facilities:", facErr.message);
  } else {
    console.log(`Facilities count: ${facs?.length}`);
    console.log(JSON.stringify(facs, null, 2));
  }

  const { data: engs, error: engErr } = await supabase.from("global_engineers").select("*");
  if (engErr) {
    console.error("Error fetching engineers:", engErr.message);
  } else {
    console.log(`Engineers count: ${engs?.length}`);
    console.log(JSON.stringify(engs, null, 2));
  }
}

check();

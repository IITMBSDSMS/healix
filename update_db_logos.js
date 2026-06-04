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

async function run() {
  console.log("Updating engineering node logos in database...");

  const updates = [
    { name: "IIT Delhi", logo: "https://logo.clearbit.com/iitd.ac.in" },
    { name: "IIT Bombay", logo: "https://logo.clearbit.com/iitb.ac.in" },
    { name: "IIT Madras", logo: "https://logo.clearbit.com/iitm.ac.in" },
    { name: "IISc Bangalore", logo: "https://logo.clearbit.com/iisc.ac.in" }
  ];

  for (const item of updates) {
    const { data, error } = await supabase
      .from("global_engineers")
      .update({ logo_url: item.logo })
      .eq("name", item.name)
      .select();

    if (error) {
      console.error(`Failed to update ${item.name}:`, error.message);
    } else {
      console.log(`Updated ${item.name} successfully. Rows:`, data?.length);
    }
  }

  console.log("Done database updates!");
}

run();

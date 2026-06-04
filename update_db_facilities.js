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
  console.log("Updating default facilities images in database to Unsplash CDN URLs...");

  const updates = [
    {
      name: "AIIMS Delhi",
      image_url: "https://images.unsplash.com/photo-1586773860418-d3b969c73059?q=80&w=1200&auto=format&fit=crop"
    },
    {
      name: "IIT Delhi",
      image_url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1200&auto=format&fit=crop"
    },
    {
      name: "IIT Madras",
      image_url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1200&auto=format&fit=crop"
    },
    {
      name: "IIT Bombay",
      image_url: "https://images.unsplash.com/photo-1532187643603-ba119ca4109e?q=80&w=1200&auto=format&fit=crop"
    },
    {
      name: "IISc Bangalore",
      image_url: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?q=80&w=1200&auto=format&fit=crop"
    }
  ];

  for (const item of updates) {
    const { data, error } = await supabase
      .from("global_facilities")
      .update({ image_url: item.image_url })
      .eq("name", item.name)
      .select();

    if (error) {
      console.error(`Failed to update ${item.name}:`, error.message);
    } else {
      console.log(`Updated ${item.name} successfully. Rows:`, data?.length);
    }
  }

  console.log("Database migration complete!");
}

run();

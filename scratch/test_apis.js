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

const APIS = [
  "/api/mentors?all=true",
  "/api/team?all=true",
  "/api/podcasts?all=true",
  "/api/brands?all=true",
  "/api/founders?all=true",
  "/api/professionals?all=true",
  "/api/facilities?all=true",
  "/api/engineers?all=true"
];

const BASE_URL = "https://healix-technologies.com";

async function test() {
  console.log("Testing API responses local...");
  for (const api of APIS) {
    try {
      const url = `${BASE_URL}${api}`;
      const res = await fetch(url);
      const text = await res.text();
      console.log(`API ${api} -> Status: ${res.status}`);
      if (res.status !== 200) {
        console.log(`Error Response: ${text.substring(0, 200)}`);
      } else {
        try {
          const json = JSON.parse(text);
          console.log(`Success JSON. Count: ${Array.isArray(json) ? json.length : 'Object'}`);
        } catch {
          console.log(`Failed to parse JSON. Content: ${text.substring(0, 200)}`);
        }
      }
    } catch (e) {
      console.log(`API ${api} -> Failed to fetch: ${e.message}`);
    }
  }
}

test();

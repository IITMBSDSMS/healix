const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Manually parse env file
let envVars = {};
try {
  const envPath = path.join(__dirname, '../.env.local');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        let key = match[1];
        let value = match[2] || '';
        if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
        if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
        envVars[key] = value.trim();
      }
    }
  }
} catch (e) {
  console.error("Failed to parse env file:", e.message);
}

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = envVars.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log("Supabase URL:", supabaseUrl);
console.log("Anon Key present:", !!supabaseAnonKey);
console.log("Service Key present:", !!supabaseServiceKey);

async function run() {
  if (!supabaseUrl) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL");
    return;
  }

  // 1. Test with Anon client
  console.log("\n--- Testing with Anon client ---");
  const anonClient = createClient(supabaseUrl, supabaseAnonKey || 'dummy');
  const { data: anonData, error: anonError } = await anonClient
    .from('mentors')
    .select('*');

  if (anonError) {
    console.error("Anon query failed:", anonError.message, anonError.details || "");
  } else {
    console.log("Anon query returned:", anonData ? anonData.length : 0, "rows.");
    if (anonData) console.log(JSON.stringify(anonData, null, 2));
  }

  // 2. Test with Admin client (Service role)
  if (supabaseServiceKey) {
    console.log("\n--- Testing with Admin client ---");
    const adminClient = createClient(supabaseUrl, supabaseServiceKey);
    const { data: adminData, error: adminError } = await adminClient
      .from('mentors')
      .select('*');

    if (adminError) {
      console.error("Admin query failed:", adminError.message, adminError.details || "");
    } else {
      console.log("Admin query returned:", adminData ? adminData.length : 0, "rows.");
      if (adminData) console.log(JSON.stringify(adminData, null, 2));
    }
  }
}

run();

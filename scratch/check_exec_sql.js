const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load env
const envPath = path.join(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    let value = match[2] ? match[2].trim() : '';
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.substring(1, value.length - 1);
    }
    env[match[1]] = value;
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function run() {
  console.log('Testing RPC exec_sql...');
  const { data, error } = await supabase.rpc('exec_sql', {
    sql_query: 'CREATE TABLE IF NOT EXISTS founders (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name TEXT, role TEXT, quote TEXT, photo_url TEXT, display_order INT, active BOOLEAN DEFAULT TRUE, created_at TIMESTAMPTZ DEFAULT NOW());'
  });
  console.log('RPC exec_sql result:', { data, error });
}

run();

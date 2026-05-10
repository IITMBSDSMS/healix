const { createClient } = require('@supabase/supabase-js');

async function checkPolicies() {
  const supabaseUrl = 'https://chdujpvwawaqgaenrgms.supabase.co';
  const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNoZHVqcHZ3YXdhcWdhZW5yZ21zIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Nzk5NjQ4MSwiZXhwIjoyMDkzNTcyNDgxfQ.skglg0NjNO6LoBxbPwgU8Qja7ODSNHoZOewQRvMj8a8';
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  console.log('--- Checking RLS Policies for shesecure_session_photos ---');
  const { data, error } = await supabase.rpc('get_policies', { table_name: 'shesecure_session_photos' }).catch(() => ({ data: null, error: 'RPC not found' }));
  
  if (error) {
    console.log('Could not use RPC, trying direct query on pg_policies...');
    const { data: pgData, error: pgError } = await supabase.from('pg_policies').select('*').eq('tablename', 'shesecure_session_photos').catch(() => ({ data: null, error: 'Query failed' }));
    console.log('Policies:', pgData || pgError);
  } else {
    console.log('Policies:', data);
  }
}

checkPolicies();

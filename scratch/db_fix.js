const { createClient } = require('@supabase/supabase-js');

async function fixProduction() {
  const supabaseUrl = 'https://chdujpvwawaqgaenrgms.supabase.co';
  const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNoZHVqcHZ3YXdhcWdhZW5yZ21zIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Nzk5NjQ4MSwiZXhwIjoyMDkzNTcyNDgxfQ.skglg0NjNO6LoBxbPwgU8Qja7ODSNHoZOewQRvMj8a8';
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  console.log('--- 1. Auditing Tables ---');
  
  // Check vehicles table
  const { data: vehicles, error: vError } = await supabase.from('vehicles').select('*');
  if (vError) console.error('Vehicles Error:', vError);
  
  // 1. Ensure IOT-CAB-001 exists in vehicles
  let targetVehicle = vehicles?.find(v => v.iot_device_id === 'IOT-CAB-001');
  if (!targetVehicle) {
    console.log('Creating vehicle IOT-CAB-001...');
    const { data: newVehicle, error: nvError } = await supabase.from('vehicles').insert({
      driver_name: 'System Simulator',
      vehicle_number: 'CAB-001',
      iot_device_id: 'IOT-CAB-001',
      qr_code: 'IOT-CAB-001' // Bypassing not-null constraint
    }).select().single();
    
    if (nvError) {
      console.error('Insert Vehicle Error:', nvError);
    } else {
      targetVehicle = newVehicle;
    }
  }

  // 2. Ensure IOT-CAB-001 exists in iot_devices (if table exists)
  try {
    await supabase.from('iot_devices').insert({ id: 'IOT-CAB-001', status: 'active', is_active: true });
  } catch (e) {
    console.log('iot_devices insertion failed or table missing');
  }

  // 3. Create Active Trip
  if (targetVehicle) {
    const { data: users } = await supabase.auth.admin.listUsers();
    const userId = users?.users[0]?.id || '00000000-0000-0000-0000-000000000000';

    const { data: trip, error: tError } = await supabase.from('trips').insert({
      user_id: userId,
      vehicle_id: targetVehicle.id,
      status: 'active',
      start_location: { lat: 28.539, lng: 77.202 }
    }).select().single();

    if (tError) console.error('Trip Creation Error:', tError);
    else console.log('✅ Active Trip Created:', trip.id);
  } else {
    console.error('❌ Could not establish target vehicle.');
  }

  console.log('--- 4. Verifying Telemetry ---');
  const { data: tel, error: telError } = await supabase.from('iot_telemetry').select('*').eq('device_id', 'IOT-CAB-001').limit(1);
  console.log('Latest Telemetry:', tel);
}

fixProduction();

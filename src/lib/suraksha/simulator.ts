// Utility for generating realistic IoT telemetry data for Project Suraksha

// Base coordinates for Bangalore
const BASE_LAT = 12.9716;
const BASE_LNG = 77.5946;

export interface TelemetryState {
  lat: number;
  lng: number;
  speed: number;
  battery: number;
  signal: number;
}

export function generateInitialState(): TelemetryState {
  // Random offset within ~5km
  const latOffset = (Math.random() - 0.5) * 0.1;
  const lngOffset = (Math.random() - 0.5) * 0.1;

  return {
    lat: BASE_LAT + latOffset,
    lng: BASE_LNG + lngOffset,
    speed: 0,
    battery: 100,
    signal: 4,
  };
}

export function generateNextState(current: TelemetryState): TelemetryState {
  // Movement: simulate driving
  // roughly 0.0001 deg is ~11 meters. 
  // If we ping every 5 seconds, 11m/5s = 2.2m/s (about 8km/h)
  // Let's do random heading, mostly forward
  
  const heading = Math.random() * 2 * Math.PI;
  // Speed in km/h, max ~60, min ~0
  const speedTarget = Math.random() > 0.8 ? 0 : 20 + Math.random() * 40;
  
  // Smooth speed transition
  const speed = current.speed + (speedTarget - current.speed) * 0.2;
  
  // Distance in degrees per 5 sec (approx)
  // 60km/h = 16m/s -> 80m per 5 sec -> ~0.0007 deg
  const dist = (speed / 60) * 0.0007;

  const dLat = Math.cos(heading) * dist;
  const dLng = Math.sin(heading) * dist;

  // Battery drain
  const batteryDrain = Math.random() > 0.9 ? 0.1 : 0;
  const battery = Math.max(0, current.battery - batteryDrain);

  // Signal fluctuation
  let signal = current.signal;
  if (Math.random() > 0.9) {
    signal = Math.max(1, Math.min(5, signal + (Math.random() > 0.5 ? 1 : -1)));
  }

  return {
    lat: current.lat + dLat,
    lng: current.lng + dLng,
    speed: Math.round(speed),
    battery: Number(battery.toFixed(1)),
    signal,
  };
}

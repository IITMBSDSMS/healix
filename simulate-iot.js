/**
 * IoT Hardware Simulator (Failsafe Tester)
 * 
 * Run this script to simulate an onboard IoT Tracker sending GPS and Audio buffers
 * to the Healix backend API.
 * 
 * Usage: node simulate-iot.js <DEVICE_ID>
 */

const DEVICE_ID = process.argv[2] || "IOT-CAB-001";
const API_URL = process.argv[3] || "http://localhost:3000/api/iot/stream";

console.log(`Starting IoT Simulator for Device: ${DEVICE_ID}`);
console.log(`Targeting: ${API_URL}`);

// Initial coordinates (Delhi)
let currentLat = 28.539;
let currentLng = 77.202;

// Fake a tiny 1-second silent audio buffer for demonstration (a real device sends actual microphone chunks)
const FAKE_AUDIO_WAV_BASE64 = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=";

setInterval(async () => {
  // Move the car slightly
  currentLat += 0.0001;
  currentLng += 0.0001;

  const payload = {
    deviceId: DEVICE_ID,
    lat: currentLat,
    lng: currentLng,
    timestamp: new Date().toISOString(),
    audioBase64: FAKE_AUDIO_WAV_BASE64,
    isEmergency: true,
  };

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "x-iot-secret": "change-me-to-a-strong-random-secret" 
      },
      body: JSON.stringify(payload),
    });
    
    if (res.ok) {
      console.log(`[${new Date().toLocaleTimeString()}] Sent IoT Telemetry -> Lat: ${currentLat.toFixed(5)}, Lng: ${currentLng.toFixed(5)}`);
    } else {
      console.error(`[${new Date().toLocaleTimeString()}] API Error:`, await res.text());
    }
  } catch (err) {
    console.error("Failed to reach Healix API. Ensure the API URL is correct and reachable.");
  }
}, 5000); // Pulse every 5 seconds

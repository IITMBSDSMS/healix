/**
 * Healix Enterprise IoT Hardware Simulator (v2.0)
 * 
 * Implements HMAC-SHA256 Zero-Trust Signature Protocol.
 * 
 * Usage: 
 *   IOT_API_SECRET=your_secret node simulate-iot.js <DEVICE_ID>
 */

const crypto = require('crypto');

const DEVICE_ID = process.argv[2] || "IOT-CAB-001";
const API_URL = process.argv[3] || "http://localhost:3000/api/iot/stream";
const SECRET = process.env.IOT_API_SECRET || "change-me-to-a-strong-random-secret";

console.log(`--- Healix IoT Hardware Simulator ---`);
console.log(`Device ID: ${DEVICE_ID}`);
console.log(`Target:    ${API_URL}`);
console.log(`Security:  HMAC-SHA256 (Secret: ${SECRET.substring(0, 4)}***)`);

let currentLat = 28.539;
let currentLng = 77.202;

const FAKE_AUDIO_WAV_BASE64 = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=";

async function pulse() {
  currentLat += (Math.random() - 0.5) * 0.001;
  currentLng += (Math.random() - 0.5) * 0.001;

  const timestamp = new Date().toISOString();
  const payload = {
    deviceId: DEVICE_ID,
    lat: currentLat,
    lng: currentLng,
    timestamp: timestamp,
    audioBase64: FAKE_AUDIO_WAV_BASE64,
    isEmergency: Math.random() > 0.9, // 10% chance of emergency pulse
  };

  const bodyString = JSON.stringify(payload);
  
  // Zero-Trust Signature Generation
  const signature = crypto
    .createHmac('sha256', SECRET)
    .update(bodyString + timestamp)
    .digest('hex');

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "x-healix-signature": signature,
        "x-healix-timestamp": timestamp
      },
      body: bodyString,
    });
    
    if (res.ok) {
      const result = await res.json();
      console.log(`[${new Date().toLocaleTimeString()}] Pulse Sent | Status: ${res.status} | Buffered: ${result.buffered}`);
    } else {
      console.error(`[${new Date().toLocaleTimeString()}] Security/API Rejection:`, await res.text());
    }
  } catch (err) {
    console.error("Transmission Failure: Ensure the Healix Gateway is active.");
  }
}

// Start pulsing
setInterval(pulse, 3000);
pulse();

"use client";

import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Battery, Signal, Zap } from "lucide-react";

// Fix for default Leaflet icons in Next.js
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Custom glowing marker for active vehicles
const createVehicleIcon = (isSOS: boolean) => L.divIcon({
  className: "",
  html: `
    <div style="position:relative;width:32px;height:32px;">
      <div style="
        position:absolute;inset:0;border-radius:50%;
        background:${isSOS ? 'rgba(220,38,38,0.3)' : 'rgba(37,99,235,0.3)'};
        animation:ping 1.5s cubic-bezier(0,0,0.2,1) infinite;
      "></div>
      <div style="
        position:absolute;inset:4px;border-radius:50%;
        background:${isSOS ? '#dc2626' : '#2563eb'};
        border:2px solid ${isSOS ? '#f87171' : '#60a5fa'};
        box-shadow:0 0 12px ${isSOS ? '#dc2626' : '#2563eb'};
      "></div>
    </div>
    <style>@keyframes ping{75%,100%{transform:scale(2);opacity:0}}</style>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

// Component to smoothly pan the map to the latest marker
function MapPanner({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  const prevPos = useRef<[number, number] | null>(null);

  useEffect(() => {
    const newPos: [number, number] = [lat, lng];
    if (prevPos.current) {
      const [prevLat, prevLng] = prevPos.current;
      // Only pan if there's a meaningful movement (avoid micro-jitter)
      const dist = Math.abs(lat - prevLat) + Math.abs(lng - prevLng);
      if (dist > 0.0001) {
        map.flyTo(newPos, map.getZoom(), { animate: true, duration: 2.5 });
      }
    }
    prevPos.current = newPos;
  }, [lat, lng, map]);

  return null;
}

interface VehicleMapProps {
  telemetryData: any[];
  sosActive?: boolean;
  playAlarm?: boolean;
}

export default function VehicleMap({ telemetryData, sosActive = false, playAlarm = false }: VehicleMapProps) {
  const [mounted, setMounted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Feature 1: Audio SOS Alarm
  useEffect(() => {
    if (!playAlarm) return;
    // Web Audio API — generate an alarm tone without needing an audio file
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    
    const ctx = new AudioCtx();
    let oscillatorCount = 0;
    const maxBeeps = 6;

    const beep = () => {
      if (oscillatorCount >= maxBeeps) return;
      oscillatorCount++;

      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.type = "square";
      oscillator.frequency.setValueAtTime(880, ctx.currentTime);
      oscillator.frequency.setValueAtTime(660, ctx.currentTime + 0.15);
      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.3);
      
      setTimeout(beep, 500);
    };

    beep();
    return () => { ctx.close(); };
  }, [playAlarm]);

  if (!mounted) return (
    <div className="w-full h-full flex items-center justify-center text-gray-500 font-mono text-sm">
      Initializing Map Engine...
    </div>
  );

  // Group latest telemetry by device
  const latestByDevice = telemetryData.reduce((acc, curr) => {
    if (!acc[curr.device_id] || new Date(curr.timestamp) > new Date(acc[curr.device_id].timestamp)) {
      acc[curr.device_id] = curr;
    }
    return acc;
  }, {} as Record<string, any>);

  const activeMarkers = Object.values(latestByDevice);

  // Center on latest telemetry or Bangalore
  const centerLat = activeMarkers.length > 0 ? (activeMarkers[0] as any).lat : 12.9716;
  const centerLng = activeMarkers.length > 0 ? (activeMarkers[0] as any).lng : 77.5946;

  return (
    <MapContainer
      center={[centerLat, centerLng]}
      zoom={14}
      style={{ height: "100%", width: "100%", zIndex: 10 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"
      />

      {/* Feature 3: Smooth map panning to latest position */}
      {activeMarkers.length > 0 && (
        <MapPanner
          lat={(activeMarkers[0] as any).lat}
          lng={(activeMarkers[0] as any).lng}
        />
      )}

      {activeMarkers.map((marker: any) => (
        <Marker
          key={marker.device_id}
          position={[marker.lat, marker.lng]}
          icon={createVehicleIcon(sosActive)}
        >
          <Popup>
            <div className="p-1 bg-[#0a0a0a] text-white rounded" style={{ minWidth: 160 }}>
              <div className="font-mono text-xs text-blue-400 mb-1">{marker.device_id}</div>
              <div className="text-sm font-semibold mb-2">Live Telemetry</div>
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-300">
                <div className="flex items-center gap-1"><Zap className="w-3 h-3 text-yellow-400"/> {marker.speed} km/h</div>
                <div className="flex items-center gap-1"><Battery className="w-3 h-3 text-green-400"/> {marker.battery}%</div>
                <div className="flex items-center gap-1"><Signal className="w-3 h-3 text-blue-400"/> {marker.signal} Bars</div>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}

      {activeMarkers.length === 0 && (
        // Demo fallback pin for Bangalore
        <Marker position={[12.9716, 77.5946]} icon={createVehicleIcon(false)}>
          <Popup>
            <div style={{ color: "#ccc", fontSize: 12 }}>No active vehicles. Start a simulation.</div>
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
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

interface VehicleMapProps {
  telemetryData: any[];
}

export default function VehicleMap({ telemetryData }: VehicleMapProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="w-full h-full flex items-center justify-center text-gray-500">Loading Map Engine...</div>;

  // Center on Bangalore or latest telemetry
  const centerLat = telemetryData.length > 0 ? telemetryData[0].lat : 12.9716;
  const centerLng = telemetryData.length > 0 ? telemetryData[0].lng : 77.5946;

  // Group latest telemetry by device
  const latestByDevice = telemetryData.reduce((acc, curr) => {
    if (!acc[curr.device_id] || new Date(curr.timestamp) > new Date(acc[curr.device_id].timestamp)) {
      acc[curr.device_id] = curr;
    }
    return acc;
  }, {} as Record<string, any>);

  const activeMarkers = Object.values(latestByDevice);

  return (
    <MapContainer
      center={[centerLat, centerLng]}
      zoom={13}
      style={{ height: "100%", width: "100%", zIndex: 10 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      
      {activeMarkers.map((marker: any) => (
        <Marker 
          key={marker.device_id} 
          position={[marker.lat, marker.lng]} 
          icon={icon}
        >
          <Popup className="bg-[#050505] text-white border-0">
            <div className="p-1">
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
    </MapContainer>
  );
}

"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams } from "next/navigation";
import { getTripData, triggerIotOverride, getIotTelemetry } from "@/app/shesecure/actions";
import {
  MapPin, Navigation, Car, User, Clock, ShieldCheck,
  AlertTriangle, CheckCircle, BatteryMedium, Wifi, WifiOff, Siren
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { motion, AnimatePresence } from "framer-motion";

type TripData = {
  id: string;
  status: string;
  start_location: { lat: number; lng: number } | null;
  route_data: { lat: number; lng: number; timestamp: string }[];
  created_at: string;
  recording_enabled: boolean;
  iot_override: boolean;
  user: { name: string };
  vehicles: { driver_name: string; vehicle_number: string; iot_device_id?: string };
};

type SignalState = "active" | "weak" | "lost" | "iot_override" | "completed";

export default function LiveTrackingPage() {
  const params = useParams();
  const tripId = params.tripId as string;

  const [trip, setTrip] = useState<TripData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [signalState, setSignalState] = useState<SignalState>("active");
  const [iotTelemetry, setIotTelemetry] = useState<any>(null);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [sosPressed, setSosPressed] = useState(false);
  const [sosLoading, setSosLoading] = useState(false);

  // Heartbeat tracking
  const lastSuccessRef = useRef<number>(Date.now());
  const heartbeatFiredRef = useRef(false);

  // ─── Fetch Trip Data ───────────────────────────────────────────────────────
  const fetchTrip = useCallback(async () => {
    const data = await getTripData(tripId);
    if ("error" in data) {
      setError(data.error as string);
      return null;
    }
    if ("trip" in data) {
      const t = data.trip as any;
      setTrip(t as TripData);
      if (t.status === "iot_override") {
        setSignalState("iot_override");
        const deviceId = t.vehicles?.iot_device_id;
        if (deviceId) {
          const tel = await getIotTelemetry(deviceId);
          if (tel.telemetry) {
            setIotTelemetry(tel.telemetry);
            setCurrentLocation(tel.telemetry.location);
          }
        }
      } else if (t.status === "completed") {
        setSignalState("completed");
      }
    }
    setLoading(false);
    return data;
  }, [tripId]);

  // ─── Push GPS Location ─────────────────────────────────────────────────────
  const pushLocation = useCallback(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setCurrentLocation(loc);
        lastSuccessRef.current = Date.now();
        heartbeatFiredRef.current = false; // Reset failsafe

        // Update signal to active
        setSignalState(prev => prev === "iot_override" || prev === "completed" ? prev : "active");

        try {
          await fetch("/api/suraksha/track", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tripId, location: loc }),
          });
        } catch (_) {}
      },
      () => {
        // GPS denied / unavailable - don't update lastSuccess
      }
    );
  }, [tripId]);

  // ─── Heartbeat Monitor ─────────────────────────────────────────────────────
  const checkHeartbeat = useCallback(async () => {
    if (signalState === "iot_override" || signalState === "completed") return;

    const elapsed = (Date.now() - lastSuccessRef.current) / 1000; // seconds

    if (elapsed > 60 && !heartbeatFiredRef.current) {
      heartbeatFiredRef.current = true;
      setSignalState("lost");
      // Trigger server-side failsafe alert
      try {
        await fetch("/api/suraksha/failsafe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tripId }),
        });
      } catch (_) {}

      // Also switch to IoT override
      await triggerIotOverride(tripId);
      await fetchTrip();
    } else if (elapsed > 30) {
      setSignalState("weak");
    }
  }, [signalState, tripId, fetchTrip]);

  // ─── SOS Handler ───────────────────────────────────────────────────────────
  const handleSos = async () => {
    if (sosPressed || sosLoading) return;
    setSosLoading(true);
    try {
      await fetch("/api/suraksha/sos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tripId, location: currentLocation }),
      });
      setSosPressed(true);
    } catch (_) {}
    setSosLoading(false);
  };

  // ─── Simulate Phone Death (Testing) ────────────────────────────────────────
  const handlePhoneDeathSim = async () => {
    if (!confirm("Simulate Phone Battery Death? This will trigger the IoT hardware override for testing.")) return;
    await triggerIotOverride(tripId);
    setSignalState("iot_override");
    await fetchTrip();
  };

  // ─── Polling Setup ─────────────────────────────────────────────────────────
  useEffect(() => {
    fetchTrip();

    // Push GPS every 10 seconds
    const gpsInterval = setInterval(pushLocation, 10000);
    // Check heartbeat every 5 seconds
    const heartbeatInterval = setInterval(checkHeartbeat, 5000);

    // Push initial location immediately
    pushLocation();

    return () => {
      clearInterval(gpsInterval);
      clearInterval(heartbeatInterval);
    };
  }, [fetchTrip, pushLocation, checkHeartbeat]);

  // ─── Loading / Error states ─────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin mb-4" />
        <p className="text-orange-400 font-medium animate-pulse">Establishing secure connection...</p>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
        <AlertTriangle className="h-16 w-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Trip Not Found</h1>
        <p className="text-white/50 max-w-md">The tracking link is invalid, or the trip has been permanently archived.</p>
      </div>
    );
  }

  const googleMapsUrl = currentLocation
    ? `https://maps.google.com/?q=${currentLocation.lat},${currentLocation.lng}`
    : "#";

  // ─── Signal State Config ───────────────────────────────────────────────────
  const signalConfig = {
    active: {
      label: "LIVE GPS ACTIVE",
      color: "text-green-400",
      bg: "bg-green-500/10",
      border: "border-green-500/30",
      dot: "bg-green-400",
      radarColor: "rgba(34, 197, 94, 0.4)",
      borderColor: "border-green-500/30",
      Icon: Wifi,
    },
    weak: {
      label: "WEAK SIGNAL",
      color: "text-yellow-400",
      bg: "bg-yellow-500/10",
      border: "border-yellow-500/30",
      dot: "bg-yellow-400",
      radarColor: "rgba(234, 179, 8, 0.4)",
      borderColor: "border-yellow-500/30",
      Icon: Wifi,
    },
    lost: {
      label: "TRACKING LOST",
      color: "text-red-400",
      bg: "bg-red-500/10",
      border: "border-red-500/30",
      dot: "bg-red-500",
      radarColor: "rgba(239, 68, 68, 0.6)",
      borderColor: "border-red-500/40",
      Icon: WifiOff,
    },
    iot_override: {
      label: "IoT FAILSAFE ACTIVE",
      color: "text-red-400",
      bg: "bg-red-500/10",
      border: "border-red-500/40",
      dot: "bg-red-500",
      radarColor: "rgba(239, 68, 68, 0.7)",
      borderColor: "border-red-500/50",
      Icon: AlertTriangle,
    },
    completed: {
      label: "TRIP COMPLETED",
      color: "text-white/40",
      bg: "bg-white/5",
      border: "border-white/10",
      dot: "bg-white/30",
      radarColor: "rgba(255,255,255,0.1)",
      borderColor: "border-white/10",
      Icon: CheckCircle,
    },
  };

  const cfg = signalConfig[signalState];

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 w-full">
      {/* Header */}
      <div className="flex items-center justify-center gap-3 mb-10">
        <ShieldCheck className="h-8 w-8 text-green-500" />
        <h1 className="text-3xl font-bold">Healix Live Tracking</h1>
      </div>

      {/* Radar Visualization */}
      <GlassCard className="p-0 overflow-hidden mb-8 shadow-[0_0_50px_rgba(249,115,22,0.1)]">
        <div className="relative h-64 bg-[#0a0a0a] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

          {signalState !== "completed" ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: signalState === "iot_override" || signalState === "lost" ? 2 : 4, repeat: Infinity, ease: "linear" }}
                className={`absolute w-64 h-64 rounded-full border ${cfg.borderColor}`}
                style={{ background: `conic-gradient(from 0deg, transparent 70%, ${cfg.radarColor} 100%)` }}
              />
              {/* Concentric rings */}
              <div className={`absolute w-40 h-40 rounded-full border ${cfg.borderColor} opacity-40`} />
              <div className={`absolute w-20 h-20 rounded-full border ${cfg.borderColor} opacity-60`} />

              <div className={`absolute w-3 h-3 ${cfg.dot} rounded-full shadow-[0_0_15px_8px] animate-pulse`} />

              <div className={`absolute top-4 left-4 ${cfg.bg} border ${cfg.border} ${cfg.color} text-xs px-3 py-1.5 rounded-full flex items-center gap-2 backdrop-blur-md font-semibold`}>
                <cfg.Icon className="h-3 w-3" />
                {cfg.label}
              </div>
            </>
          ) : (
            <div className="text-center text-white/40">
              <CheckCircle className="h-10 w-10 mx-auto mb-2 text-green-500 opacity-50" />
              <p>Trip Completed</p>
            </div>
          )}
        </div>

        <div className="p-6 md:p-8">
          {/* Trip Header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold mb-1">{trip.user.name}&apos;s Trip</h2>
              <p className="text-white/50 text-sm flex items-center gap-1">
                <Clock className="h-4 w-4" />
                Started {new Date(trip.created_at).toLocaleTimeString()}
              </p>
            </div>
            <div className={`px-4 py-1.5 rounded-full text-sm font-semibold border ${cfg.border} ${cfg.bg} ${cfg.color}`}>
              {trip.status.replace("_", " ").toUpperCase()}
            </div>
          </div>

          {/* Vehicle & Driver Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <User className="h-5 w-5 text-white/70" />
              </div>
              <div>
                <p className="text-xs text-white/40 uppercase font-bold tracking-wider mb-0.5">Driver</p>
                <p className="font-medium text-white/90">{trip.vehicles.driver_name}</p>
              </div>
            </div>
            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <Car className="h-5 w-5 text-white/70" />
              </div>
              <div>
                <p className="text-xs text-white/40 uppercase font-bold tracking-wider mb-0.5">Vehicle</p>
                <p className="font-medium text-white/90">{trip.vehicles.vehicle_number}</p>
              </div>
            </div>
          </div>

          {/* Recording badge */}
          <div className={`mb-6 px-4 py-2 rounded-xl border flex items-center gap-2 text-sm ${trip.recording_enabled ? "bg-red-500/10 border-red-500/30 text-red-400" : "bg-white/5 border-white/10 text-white/40"}`}>
            <div className={`w-2 h-2 rounded-full ${trip.recording_enabled ? "bg-red-500 animate-pulse" : "bg-white/20"}`} />
            {trip.recording_enabled ? "Safety Recording ENABLED — activates on SOS or Failsafe" : "Recording DISABLED — tracking only"}
          </div>

          {/* Weak Signal Warning */}
          <AnimatePresence>
            {signalState === "weak" && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl mb-6 flex items-center gap-3">
                <Wifi className="h-5 w-5 text-yellow-400 shrink-0" />
                <div>
                  <p className="font-semibold text-yellow-400 text-sm">Weak Signal Detected</p>
                  <p className="text-white/50 text-xs">No location update in 30 seconds. Ensure your GPS and network are enabled.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* IoT Override Panel */}
          <AnimatePresence>
            {signalState === "iot_override" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="p-5 bg-red-500/10 border border-red-500/30 rounded-2xl mb-6">
                <div className="flex items-center gap-2 text-red-400 mb-2">
                  <AlertTriangle className="h-5 w-5" />
                  <h3 className="font-bold">CRITICAL: PHONE DISCONNECTED</h3>
                </div>
                <p className="text-white/60 text-sm mb-2">
                  Live phone GPS has stopped. The system has automatically activated the onboard IoT hardware device in vehicle <strong>{trip.vehicles.vehicle_number}</strong>.
                </p>
                {iotTelemetry && (
                  <p className="text-xs font-mono text-orange-400">
                    IoT GPS: {iotTelemetry.location?.lat?.toFixed(6)}, {iotTelemetry.location?.lng?.toFixed(6)}
                  </p>
                )}
                <p className="text-[10px] text-white/30 mt-2">Device ID: {trip.vehicles.iot_device_id || "Unknown"}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Location */}
          <div className="p-5 bg-blue-500/5 border border-blue-500/20 rounded-2xl mb-6">
            <p className="text-xs text-blue-400 uppercase font-bold tracking-wider mb-3">Current Coordinates</p>
            {currentLocation ? (
              <div className="flex items-center justify-between">
                <div className="font-mono text-white/80 text-sm">
                  {currentLocation.lat.toFixed(6)}, {currentLocation.lng.toFixed(6)}
                </div>
                <div className={`text-xs animate-pulse ${cfg.color}`}>
                  {signalState === "iot_override" ? "IoT Feed" : "Updating..."}
                </div>
              </div>
            ) : (
              <p className="text-white/50 text-sm">Acquiring location...</p>
            )}
          </div>

          {/* Action buttons */}
          <div className="space-y-3">
            <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer"
              className="w-full py-4 bg-white text-black font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-white/90 transition-colors">
              <Navigation className="h-5 w-5" /> Open in Google Maps
            </a>

            {/* SOS */}
            {trip.status === "active" && !sosPressed && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleSos}
                disabled={sosLoading}
                className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(239,68,68,0.5)] transition-all disabled:opacity-70"
              >
                <Siren className="h-6 w-6" />
                {sosLoading ? "Sending Emergency Alert..." : "🚨 SOS — Send Emergency Alert"}
              </motion.button>
            )}

            {sosPressed && (
              <div className="w-full py-4 bg-red-500/20 border border-red-500/40 text-red-400 font-bold rounded-xl flex items-center justify-center gap-2">
                <CheckCircle className="h-5 w-5" /> Emergency Alert Sent to Contacts
              </div>
            )}

            {/* Phone Death Sim (Testing) */}
            {trip.status === "active" && (
              <button onClick={handlePhoneDeathSim}
                className="w-full py-2 bg-transparent border border-white/10 text-white/30 rounded-xl text-xs font-medium hover:text-white/50 transition-colors flex items-center justify-center gap-2">
                <BatteryMedium className="h-4 w-4" /> [Test] Simulate Phone Disconnect
              </button>
            )}
          </div>
        </div>
      </GlassCard>

      {/* Legal Disclaimer */}
      <p className="text-center text-xs text-white/20 leading-relaxed">
        Healix provides safety assistance tools and does not replace emergency services. <br />
        Recording activates only during SOS events when enabled by the user.
      </p>
    </div>
  );
}

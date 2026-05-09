"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ShieldCheck, MapPin, AlertTriangle, Car } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { createClient } from "@/utils/supabase/client";

function SurakshaStartContent() {
  const searchParams = useSearchParams();
  const vid = searchParams.get("vid");
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [vehicle, setVehicle] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    if (!vid) {
      setError("Invalid QR Code: No vehicle ID provided.");
      setLoading(false);
      return;
    }

    const checkAuthAndVehicle = async () => {
      const supabase = createClient();
      await supabase.auth.getSession();

      // Fetch vehicle
      const { data, error } = await supabase.from("vehicles").select("*").eq("id", vid).single();
      if (error || !data) {
        setError("Invalid QR Code: Vehicle not found or inactive.");
      } else {
        setVehicle(data);
      }
      setLoading(false);
    };

    checkAuthAndVehicle();
  }, [vid, router]);

  const handleStartTrip = () => {
    setStarting(true);
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser. Cannot start trip.");
      setStarting(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;

      try {
        const res = await fetch("/api/suraksha/start", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            vid,
            location: { lat: latitude, lng: longitude }
          })
        });

        const result = await res.json();
        if (res.ok && result.success) {
          // Redirect to live tracking page for this trip
          router.push(`/track/${result.tripId}`);
        } else {
          setError(result.error || "Failed to start trip.");
          setStarting(false);
        }
      } catch (err) {
        setError("Network error. Please try again.");
        setStarting(false);
      }
    }, (err) => {
      setError("Failed to get location. Please allow location access to start the trip.");
      setStarting(false);
    }, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#050505]">
        <div className="w-12 h-12 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin mb-4" />
        <p className="text-orange-400 font-medium animate-pulse">Establishing Secure Connection...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#050505] p-4 text-center">
        <AlertTriangle className="h-16 w-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Security Alert</h1>
        <p className="text-white/50 max-w-md">{error}</p>
        <button onClick={() => router.push("/")} className="mt-8 px-6 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors">Return Home</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] p-4 relative overflow-hidden">
      {/* Background glowing effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-500/10 blur-[100px] rounded-full pointer-events-none" />

      <GlassCard className="w-full max-w-md border-orange-500/20 shadow-[0_0_50px_rgba(249,115,22,0.1)] relative z-10 p-8 text-center">
        <ShieldCheck className="h-16 w-16 text-orange-500 mx-auto mb-6 drop-shadow-[0_0_15px_rgba(249,115,22,0.8)]" />
        <h1 className="text-3xl font-bold mb-2">Project Suraksha</h1>
        <p className="text-white/50 text-sm mb-8">You are about to enter a secure tracking zone. Your journey will be monitored and your emergency contacts will be notified.</p>
        
        <div className="p-4 bg-black/40 border border-white/5 rounded-2xl mb-8 flex items-center gap-4 text-left">
          <div className="p-3 bg-orange-500/10 rounded-xl border border-orange-500/20">
            <Car className="h-6 w-6 text-orange-400" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-0.5">Vehicle Confirmed</p>
            <p className="font-bold text-lg leading-tight">{vehicle?.vehicle_number}</p>
            <p className="text-xs text-white/50 mt-1">Driver: {vehicle?.driver_name}</p>
          </div>
        </div>

        <button 
          onClick={handleStartTrip}
          disabled={starting}
          className="w-full py-4 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(249,115,22,0.4)] disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
        >
          {starting ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Initializing Tracker...
            </>
          ) : (
            <>
              <MapPin className="h-5 w-5" /> Start Secured Trip
            </>
          )}
        </button>

        <p className="text-[10px] text-white/30 mt-6 flex items-center justify-center gap-1">
          <ShieldCheck className="h-3 w-3" /> Encrypted & Monitored by Healix AI
        </p>
      </GlassCard>
    </div>
  );
}

export default function SurakshaStartPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#050505]">
        <div className="w-12 h-12 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin mb-4" />
        <p className="text-orange-400 font-medium animate-pulse">Loading Suraksha Zone...</p>
      </div>
    }>
      <SurakshaStartContent />
    </Suspense>
  )
}

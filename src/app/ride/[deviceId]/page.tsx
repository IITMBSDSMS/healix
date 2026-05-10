"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Shield, MapPin, AlertCircle, Clock, CheckCircle2, ChevronRight, Phone, AlertTriangle } from "lucide-react";
import dynamic from "next/dynamic";
import { generateInitialState, generateNextState } from "@/lib/suraksha/simulator";

const VehicleMap = dynamic(() => import("@/components/ui/VehicleMap"), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-48 bg-black/50 text-xs font-mono text-gray-500 rounded-xl">Initializing Tracking...</div>
});

export default function PassengerRidePage() {
  const { deviceId } = useParams();
  const [device, setDevice] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<"verify" | "active">("verify");
  
  // Realtime State
  const [telemetry, setTelemetry] = useState<any[]>([]);
  const [failsafeActive, setFailsafeActive] = useState(false);
  const [sosActive, setSosActive] = useState(false);
  const [tripTime, setTripTime] = useState(0);

  useEffect(() => {
    const fetchDevice = async () => {
      const supabase = createClient();
      const { data } = await supabase.from('iot_devices').select('*').eq('id', deviceId).single();
      if (data) {
        setDevice(data);
        
        // Initial telemetry fetch
        const { data: tel } = await supabase.from('iot_telemetry').select('*').eq('device_id', deviceId).order('timestamp', { ascending: false }).limit(1);
        if (tel) setTelemetry(tel);
      }
      setLoading(false);
    };

    fetchDevice();
  }, [deviceId]);

  useEffect(() => {
    if (step !== "active") return;

    // Timer
    const timer = setInterval(() => setTripTime(t => t + 1), 60000); // 1 min

    // Passenger Side Telemetry Pulse (Client Simulator)
    let currentSimState = generateInitialState();
    const telemetryInterval = setInterval(async () => {
      // If hardware override engaged or SOS is active, stop simulating from passenger phone
      // The admin interface or hardware takes over in real-world scenarios.
      if (failsafeActive || sosActive) return;

      currentSimState = generateNextState(currentSimState);
      
      try {
        await fetch('/api/suraksha/telemetry', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            deviceId: deviceId,
            ...currentSimState
          })
        });
      } catch (e) {
        console.error("Passenger telemetry push failed:", e);
      }
    }, 5000);

    // Realtime Subs
    const supabase = createClient();
    const channel = supabase
      .channel(`ride_${deviceId}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "iot_telemetry", filter: `device_id=eq.${deviceId}` }, (payload) => {
        setTelemetry(prev => [payload.new, ...prev]);
      })
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "failsafe_events", filter: `device_id=eq.${deviceId}` }, () => {
        setFailsafeActive(true);
      })
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "incident_reports", filter: `device_id=eq.${deviceId}` }, (payload) => {
        if (payload.new.type === 'SOS') setSosActive(true);
      })
      .subscribe();

    return () => {
      clearInterval(timer);
      clearInterval(telemetryInterval);
      supabase.removeChannel(channel);
    };
  }, [step, deviceId, failsafeActive, sosActive]);

  const triggerSOS = async () => {
    if (confirm("Trigger Emergency SOS? This will alert Healix Response Centers immediately.")) {
      setSosActive(true);
      // Simulate API call to backend
      const supabase = createClient();
      await supabase.from('incident_reports').insert({
        device_id: deviceId,
        type: 'SOS',
        description: 'Passenger manually triggered SOS from mobile UI.',
      });
    }
  };

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Verifying...</div>;
  if (!device) return <div className="min-h-screen bg-black flex items-center justify-center text-red-500">Invalid QR Code</div>;

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans max-w-md mx-auto relative shadow-2xl overflow-hidden sm:border-x sm:border-white/10">
      
      {/* Header */}
      <div className="pt-12 pb-6 px-6 bg-gradient-to-b from-blue-900/20 to-transparent">
        <div className="flex items-center gap-2 text-blue-400 mb-6">
          <Shield className="w-5 h-5" />
          <span className="font-semibold tracking-wide">Project Suraksha</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Trip Verification</h1>
      </div>

      <div className="px-6 space-y-6">
        
        {/* Device Info Card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-md relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <Shield className="w-24 h-24" />
          </div>
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="text-sm text-gray-400">Vehicle</div>
              <div className="text-xl font-bold tracking-wider">{device.vehicle_reg}</div>
            </div>
            <div className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-xs font-mono font-medium">
              {device.id}
            </div>
          </div>
          
          <div className="flex items-center gap-4 py-4 border-y border-white/10">
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-xl font-medium">
              {device.driver_name.charAt(0)}
            </div>
            <div>
              <div className="text-sm text-gray-400">Driver</div>
              <div className="font-medium text-lg">{device.driver_name}</div>
            </div>
            <div className="ml-auto">
              <CheckCircle2 className="w-6 h-6 text-green-500" />
            </div>
          </div>
          
          <div className="pt-4 flex items-center gap-2 text-sm text-gray-400">
            <Shield className="w-4 h-4 text-green-500" />
            End-to-end encrypted telemetry active
          </div>
        </div>

        {step === "verify" ? (
          <div className="space-y-4 pt-4">
            <p className="text-gray-400 text-sm leading-relaxed">
              By starting this trip, your live location and vehicle telemetry will be monitored by the Healix AI Safety Engine.
            </p>
            <button 
              onClick={() => setStep("active")}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-xl py-4 font-semibold text-lg flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all"
            >
              Start Monitored Trip <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="space-y-6 animate-in slide-in-from-bottom-8 duration-500">
            
            {/* Status Banner */}
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
              <div className="flex-1">
                <div className="text-green-400 font-semibold text-sm">Suraksha Active</div>
                <div className="text-xs text-green-500/70">Continuous monitoring enabled</div>
              </div>
              <div className="text-right">
                <div className="text-gray-400 text-xs">Trip Time</div>
                <div className="font-mono">{tripTime}m</div>
              </div>
            </div>

            {failsafeActive && (
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 flex items-start gap-3 animate-in fade-in zoom-in duration-300">
                <AlertTriangle className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-purple-400 font-semibold text-sm">Failsafe Engaged</div>
                  <div className="text-xs text-purple-300/80 leading-relaxed mt-1">
                    Your phone connection dropped. Tracking has seamlessly shifted to the vehicle's Healix IoT Hardware.
                  </div>
                </div>
              </div>
            )}

            {/* Live Map */}
            <div className="h-64 rounded-2xl overflow-hidden border border-white/10 relative shadow-inner">
               <VehicleMap telemetryData={telemetry} />
               <div className="absolute top-2 left-2 z-[9999] bg-black/60 backdrop-blur px-2 py-1 rounded text-[10px] font-mono text-gray-300 flex items-center gap-1">
                 <MapPin className="w-3 h-3" /> LIVE
               </div>
            </div>

            {/* SOS Button */}
            <div className="pt-6 relative z-10">
              <button 
                onClick={triggerSOS}
                disabled={sosActive || failsafeActive}
                className={`w-full py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
                  sosActive || failsafeActive
                    ? "bg-red-500/20 text-red-500 border border-red-500/50 cursor-not-allowed" 
                    : "bg-red-600 hover:bg-red-500 text-white shadow-[0_0_30px_rgba(220,38,38,0.3)]"
                }`}
              >
                <AlertCircle className={`w-6 h-6 ${sosActive ? 'animate-pulse' : ''}`} />
                {sosActive ? "EMERGENCY PROTOCOL ENGAGED" : "SLIDE TO SOS"}
              </button>
            </div>

            {/* Failsafe Overlay */}
            {failsafeActive && (
              <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-500">
                <div className="bg-purple-900/40 border border-purple-500/50 rounded-2xl p-8 text-center max-w-sm">
                  <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-purple-500/50">
                    <Shield className="w-8 h-8 text-purple-400 animate-pulse" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Hardware Override</h2>
                  <p className="text-purple-200/80 text-sm mb-6">
                    Connection with this device has been superseded by the vehicle's Healix IoT System due to a system failsafe trigger.
                  </p>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-black/50 rounded-lg border border-white/10 text-xs font-mono text-gray-400">
                    <CheckCircle2 className="w-4 h-4 text-green-500" /> Secure Link Established
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}

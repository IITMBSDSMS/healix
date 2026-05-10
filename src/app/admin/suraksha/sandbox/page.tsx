"use client";

import React, { useState, useEffect, useRef } from "react";
import { Shield, AlertCircle, Play, Square, CheckCircle2, AlertTriangle } from "lucide-react";
import { generateInitialState, generateNextState } from "@/lib/suraksha/simulator";
import dynamic from "next/dynamic";

const VehicleMap = dynamic(() => import("@/components/ui/VehicleMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-black/50 text-gray-500 text-xs font-mono">
      Loading Map...
    </div>
  ),
});

/**
 * InteractiveSandbox — Feature 4
 * A split-screen demo that shows the Passenger UI and Admin reaction side-by-side.
 * No real backend needed — uses local state to simulate the connection.
 */
export default function InteractiveSandbox() {
  const [running, setRunning] = useState(false);
  const [simState, setSimState] = useState(generateInitialState());
  const [telemetryLog, setTelemetryLog] = useState<any[]>([]);
  const [passengerStep, setPassengerStep] = useState<"verify" | "active">("verify");
  const [sosTriggered, setSosTriggered] = useState(false);
  const [failsafeTriggered, setFailsafeTriggered] = useState(false);
  const [adminAlert, setAdminAlert] = useState<string | null>(null);
  const [alarmActive, setAlarmActive] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [tripTime, setTripTime] = useState(0);

  // Start/stop simulation loop
  useEffect(() => {
    if (!running || passengerStep !== "active") return;

    const timer = setInterval(() => setTripTime(t => t + 1), 60000);
    intervalRef.current = setInterval(() => {
      setSimState(prev => {
        const next = generateNextState(prev);
        setTelemetryLog(log => [
          { ...next, device_id: "SANDBOX-01", timestamp: new Date().toISOString() },
          ...log.slice(0, 9),
        ]);
        return next;
      });
    }, 3000);

    return () => {
      clearInterval(intervalRef.current!);
      clearInterval(timer);
    };
  }, [running, passengerStep]);

  const handleStartTrip = () => {
    setPassengerStep("active");
    setRunning(true);
    setSosTriggered(false);
    setFailsafeTriggered(false);
    setAdminAlert(null);
  };

  const handleSOS = () => {
    setSosTriggered(true);
    // Admin reacts instantly
    setAdminAlert("SANDBOX-01 — Passenger manually triggered SOS.");
    setAlarmActive(true);
    setTimeout(() => setAlarmActive(false), 4000);
  };

  const handleFailsafe = () => {
    setFailsafeTriggered(true);
  };

  const handleReset = () => {
    setRunning(false);
    setPassengerStep("verify");
    setSosTriggered(false);
    setFailsafeTriggered(false);
    setAdminAlert(null);
    setAlarmActive(false);
    setTelemetryLog([]);
    setTripTime(0);
    setSimState(generateInitialState());
  };

  return (
    <div className="min-h-screen bg-[#030303] text-white font-sans">
      {/* Header */}
      <div className="border-b border-white/10 p-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-blue-400 mb-1">
            <Shield className="w-5 h-5" />
            <span className="font-mono text-sm tracking-wider uppercase">Project Suraksha</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Live Demo Sandbox</h1>
          <p className="text-gray-500 text-sm mt-1">Interactive split-screen simulation. No backend required.</p>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all text-sm"
        >
          <Square className="w-4 h-4" /> Reset Demo
        </button>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto">

        {/* LEFT: Passenger Phone View */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 text-sm font-mono text-gray-400 uppercase tracking-widest">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Passenger Mobile View
          </div>

          <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 min-h-[600px] relative overflow-hidden shadow-2xl">
            {/* Phone frame accent */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-1 bg-white/20 rounded-full mt-2" />

            {passengerStep === "verify" ? (
              <div className="flex flex-col h-full pt-8">
                <div className="flex items-center gap-2 text-blue-400 mb-6">
                  <Shield className="w-5 h-5" />
                  <span className="font-semibold">Project Suraksha</span>
                </div>
                <h2 className="text-2xl font-bold mb-2">Trip Verification</h2>
                <p className="text-gray-400 text-sm mb-8">This is a sandbox demo. Click below to simulate a passenger starting a monitored trip.</p>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="text-xs text-gray-500">Vehicle</div>
                      <div className="text-lg font-bold">KA-05-HX-2024</div>
                    </div>
                    <div className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-xs font-mono">SANDBOX-01</div>
                  </div>
                  <div className="flex items-center gap-3 py-3 border-y border-white/10">
                    <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-lg font-medium">R</div>
                    <div>
                      <div className="text-xs text-gray-500">Driver</div>
                      <div className="font-medium">Rajesh Kumar</div>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-green-500 ml-auto" />
                  </div>
                  <div className="pt-3 flex items-center gap-2 text-sm text-gray-400">
                    <Shield className="w-4 h-4 text-green-500" />
                    End-to-end encrypted telemetry active
                  </div>
                </div>

                <button
                  onClick={handleStartTrip}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-xl py-4 font-semibold text-lg flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all mt-auto"
                >
                  <Play className="w-5 h-5" /> Start Monitored Trip
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4 pt-8 relative">
                {/* Status Banner */}
                <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                  <div className="flex-1">
                    <div className="text-green-400 font-semibold text-sm">Suraksha Active</div>
                    <div className="text-xs text-green-500/70">Telemetry broadcasting every 3s</div>
                  </div>
                  <div className="text-right">
                    <div className="text-gray-400 text-xs">Trip Time</div>
                    <div className="font-mono">{tripTime}m</div>
                  </div>
                </div>

                {/* Live speed/battery */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Speed", value: `${simState.speed} km/h`, color: "text-yellow-400" },
                    { label: "Battery", value: `${simState.battery}%`, color: "text-green-400" },
                    { label: "Signal", value: `${simState.signal} bars`, color: "text-blue-400" },
                  ].map(s => (
                    <div key={s.label} className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
                      <div className={`text-lg font-bold ${s.color}`}>{s.value}</div>
                      <div className="text-xs text-gray-500">{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* Mini map */}
                <div className="h-48 rounded-xl overflow-hidden border border-white/10 relative">
                  <VehicleMap telemetryData={telemetryLog} sosActive={sosTriggered} />
                  <div className="absolute top-2 left-2 z-[9999] bg-black/60 backdrop-blur px-2 py-1 rounded text-[10px] font-mono text-gray-300">
                    ● LIVE
                  </div>
                </div>

                {/* Failsafe overlay */}
                {failsafeTriggered && (
                  <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-6 rounded-3xl animate-in fade-in duration-500">
                    <div className="bg-purple-900/40 border border-purple-500/50 rounded-2xl p-8 text-center">
                      <Shield className="w-12 h-12 text-purple-400 animate-pulse mx-auto mb-4" />
                      <h2 className="text-xl font-bold text-white mb-2">Hardware Override</h2>
                      <p className="text-purple-200/80 text-sm">
                        Connection superseded by Healix IoT Hardware. You are still being tracked safely.
                      </p>
                      <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 bg-black/50 rounded-lg border border-white/10 text-xs font-mono text-gray-400">
                        <CheckCircle2 className="w-3 h-3 text-green-500" /> Secure Link Established
                      </div>
                    </div>
                  </div>
                )}

                {/* SOS button */}
                <button
                  onClick={handleSOS}
                  disabled={sosTriggered || failsafeTriggered}
                  className={`w-full py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
                    sosTriggered
                      ? "bg-red-500/20 text-red-500 border border-red-500/50 cursor-not-allowed"
                      : "bg-red-600 hover:bg-red-500 text-white shadow-[0_0_30px_rgba(220,38,38,0.3)]"
                  }`}
                >
                  <AlertCircle className={`w-6 h-6 ${sosTriggered ? "animate-pulse" : ""}`} />
                  {sosTriggered ? "EMERGENCY PROTOCOL ENGAGED" : "SLIDE TO SOS"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Admin Operations View */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 text-sm font-mono text-gray-400 uppercase tracking-widest">
            <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            Admin Operations Center
          </div>

          <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 min-h-[600px] flex flex-col gap-4 relative">

            {/* SOS Global Alert */}
            {adminAlert && (
              <div className="bg-red-600 border-2 border-red-400 text-white p-4 rounded-xl shadow-[0_0_30px_rgba(220,38,38,0.5)] flex items-center gap-3 animate-in slide-in-from-top duration-300">
                <AlertTriangle className="w-8 h-8 animate-pulse shrink-0" />
                <div>
                  <div className="font-bold tracking-widest text-sm">CRITICAL SOS ENGAGED</div>
                  <div className="text-red-100 text-xs font-mono mt-0.5">DEVICE: {adminAlert}</div>
                </div>
                <button onClick={() => setAdminAlert(null)} className="ml-auto bg-black/20 hover:bg-black/40 px-3 py-1 rounded text-xs font-bold">ACK</button>
              </div>
            )}

            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-400" /> Fleet Operations
              </h2>
              <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs font-mono text-green-400">SYSTEM OPERATIONAL</span>
              </div>
            </div>

            {/* Live Fleet Map */}
            <div className="flex-1 rounded-xl overflow-hidden border border-white/10 min-h-[300px] relative">
              <VehicleMap telemetryData={telemetryLog} sosActive={sosTriggered} playAlarm={alarmActive} />
              {!running && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                  <div className="text-center text-gray-400">
                    <Play className="w-10 h-10 mx-auto mb-2 opacity-40" />
                    <p className="text-sm">Start the demo on the passenger side to see live tracking here.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Admin Controls */}
            <div className="space-y-3">
              <h3 className="text-xs font-mono text-gray-500 uppercase tracking-widest">Admin Triggers</h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleFailsafe}
                  disabled={!running || failsafeTriggered}
                  className="px-4 py-3 bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 border border-purple-500/30 text-sm rounded-xl font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Trigger Failsafe
                </button>
                <button
                  onClick={handleSOS}
                  disabled={!running || sosTriggered}
                  className="px-4 py-3 bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30 text-sm rounded-xl font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Force SOS Alert
                </button>
              </div>
            </div>

            {/* Telemetry log */}
            {telemetryLog.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-mono text-gray-500 uppercase tracking-widest">Live Telemetry Feed</h3>
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {telemetryLog.slice(0, 5).map((t, i) => (
                    <div key={i} className="flex items-center gap-3 text-xs font-mono text-gray-400 py-1 border-b border-white/5">
                      <span className="text-green-400">●</span>
                      <span>{new Date(t.timestamp).toLocaleTimeString()}</span>
                      <span className="text-yellow-400">{t.speed}km/h</span>
                      <span className="text-green-400">BAT:{t.battery}%</span>
                      <span className="text-blue-400">SIG:{t.signal}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Explainer */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-6 text-sm text-gray-400 leading-relaxed">
          <strong className="text-blue-400">How this works:</strong> This sandbox is fully self-contained — no internet or database needed. It runs the same simulator engine used in production. 
          Click <strong className="text-white">"Start Monitored Trip"</strong> on the left, watch the Admin map track in real-time on the right. Trigger <strong className="text-white">SOS</strong> from either side to see instant cross-communication. Click <strong className="text-white">Failsafe</strong> from the Admin side to lock the passenger screen.
        </div>
      </div>
    </div>
  );
}

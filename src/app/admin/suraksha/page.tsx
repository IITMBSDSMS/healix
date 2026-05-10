"use client";

import React, { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Shield, Server, Activity, AlertTriangle, MapPin, 
  Battery, Signal, CheckCircle, Zap, ShieldAlert, Play, Square, ExternalLink
} from "lucide-react";
import { getSurakshaData, createVirtualDevice, triggerSimulationEvent } from "./actions";
import { createClient } from "@/utils/supabase/client";
import { motion } from "framer-motion";
import Image from "next/image";
import dynamic from "next/dynamic";
import { generateInitialState, generateNextState, TelemetryState } from "@/lib/suraksha/simulator";

const VehicleMap = dynamic(() => import("@/components/ui/VehicleMap"), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full w-full text-gray-500 font-mono text-sm">Initializing Tracking Subsystem...</div>
});

const BrandedQRCard = dynamic(() => import("@/components/ui/BrandedQRCard"), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-64 text-gray-500 text-sm font-mono">Rendering QR Card...</div>
});

export default function SurakshaAdminPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"registry" | "map" | "incidents">("registry");
  const [globalAlert, setGlobalAlert] = useState<{deviceId: string, description: string} | null>(null);
  const [alarmPlaying, setAlarmPlaying] = useState(false);

  // Simulation Engine State
  const [activeSimulations, setActiveSimulations] = useState<Record<string, TelemetryState>>({});
  const [qrModal, setQrModal] = useState<{ deviceId: string; vehicleReg: string; driverName: string } | null>(null);

  const fetchData = async () => {
    setLoading(true);
    const res = await getSurakshaData();
    if (!res.error) {
      setData(res);
    }
    setLoading(false);
  };

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(() => {
      fetchData();
    });

    // Sub to changes
    const channel = supabase
      .channel("suraksha_admin_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "iot_devices" }, fetchData)
      .on("postgres_changes", { event: "*", schema: "public", table: "failsafe_events" }, fetchData)
      .on("postgres_changes", { event: "*", schema: "public", table: "incident_reports" }, (payload) => {
        fetchData();
        if (payload.eventType === 'INSERT' && payload.new.type === 'SOS') {
          setGlobalAlert({ deviceId: payload.new.device_id, description: payload.new.description });
          setAlarmPlaying(true);
          setTimeout(() => setAlarmPlaying(false), 4000); // reset after 4s
          setActiveTab("map"); // auto-switch to map to track them
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Simulation Loop
  useEffect(() => {
    const interval = setInterval(() => {
      const activeIds = Object.keys(activeSimulations);
      if (activeIds.length === 0) return;

      activeIds.forEach(async (id) => {
        const current = activeSimulations[id];
        const next = generateNextState(current);
        
        // Update local state
        setActiveSimulations(prev => ({ ...prev, [id]: next }));

        // Push to backend
        try {
          await fetch('/api/suraksha/telemetry', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              deviceId: id,
              ...next
            })
          });
        } catch (e) {
          console.error("Simulation pulse failed:", e);
        }
      });
    }, 5000); // Pulse every 5 seconds

    return () => clearInterval(interval);
  }, [activeSimulations]);

  const toggleSimulation = (deviceId: string) => {
    if (activeSimulations[deviceId]) {
      // Stop
      const newSims = { ...activeSimulations };
      delete newSims[deviceId];
      setActiveSimulations(newSims);
    } else {
      // Start
      setActiveSimulations(prev => ({
        ...prev,
        [deviceId]: generateInitialState()
      }));
    }
  };

  const handleCreateDevice = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const res = await createVirtualDevice(formData);
    if (res.error) alert(res.error);
    else {
      form.reset();
      fetchData();
    }
  };

  const handleSimulateEvent = async (deviceId: string, type: 'failsafe' | 'tamper' | 'sos') => {
    let details = "";
    if (type === 'failsafe') details = "Passenger device failed. IoT override engaged.";
    if (type === 'tamper') details = "Physical tampering detected on device casing.";
    if (type === 'sos') details = "Manual SOS triggered from hardware.";
    
    if (confirm(`Trigger ${type} for ${deviceId}?`)) {
      const res = await triggerSimulationEvent(deviceId, type, details);
      if (res.error) alert(res.error);
    }
  };

  if (loading && !data) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center">Initializing Operations Center...</div>;
  }

  return (
    <div className="min-h-screen bg-[#050505] text-gray-200 p-8 font-sans selection:bg-blue-500/30">
      
      {/* Global SOS Alert */}
      {globalAlert && (
        <motion.div 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] w-full max-w-3xl bg-red-600 border-2 border-red-400 text-white p-4 rounded-xl shadow-[0_0_50px_rgba(220,38,38,0.6)] flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <AlertTriangle className="w-8 h-8 animate-pulse" />
            <div>
              <h2 className="text-xl font-bold tracking-widest">CRITICAL SOS ENGAGED</h2>
              <p className="text-sm text-red-100 font-mono">DEVICE: {globalAlert.deviceId} — {globalAlert.description}</p>
            </div>
          </div>
          <button 
            onClick={() => setGlobalAlert(null)}
            className="bg-black/20 hover:bg-black/40 px-4 py-2 rounded-lg text-sm font-bold transition-colors"
          >
            ACKNOWLEDGE
          </button>
        </motion.div>
      )}

      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-3 text-blue-500 mb-2">
              <Shield className="w-6 h-6" />
              <span className="font-mono text-sm tracking-wider uppercase">Project Suraksha</span>
            </div>
            <h1 className="text-3xl font-light tracking-tight text-white">Device Operations Center</h1>
            <p className="text-gray-500 mt-1">Enterprise digital twin simulation and hardware telemetry control.</p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/admin/suraksha/sandbox"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/30 text-blue-400 hover:bg-blue-500/20 rounded-full text-xs font-medium transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Open Sandbox
            </a>
            <div className="flex items-center gap-4 bg-white/5 px-4 py-2 rounded-full border border-white/10">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-mono text-green-400">SYSTEM OPERATIONAL</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex gap-4">
          {[
            { id: "registry", label: "Virtual Registry", icon: Server },
            { id: "map", label: "Live Fleet Map", icon: MapPin },
            { id: "incidents", label: "Incident Reports", icon: AlertTriangle }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === tab.id 
                  ? "bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)]" 
                  : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="mt-8">
          {activeTab === "registry" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 space-y-6">
                <GlassCard className="p-6">
                  <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-blue-400" />
                    Provision Device
                  </h2>
                  <form onSubmit={handleCreateDevice} className="space-y-4">
                    <div>
                      <label className="block text-xs font-mono text-gray-400 mb-1">Vehicle Type</label>
                      <select name="vehicle_type" className="w-full bg-black border border-white/10 rounded-md p-2 text-white">
                        <option value="CAB">Cab / Taxi</option>
                        <option value="AUTO">Auto Rickshaw</option>
                        <option value="BUS">School Bus</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-gray-400 mb-1">Vehicle Registration</label>
                      <input name="vehicle_reg" required placeholder="e.g., MH-01-AB-1234" className="w-full bg-black border border-white/10 rounded-md p-2 text-white" />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-gray-400 mb-1">Driver Name</label>
                      <input name="driver_name" required placeholder="e.g., Rajesh Kumar" className="w-full bg-black border border-white/10 rounded-md p-2 text-white" />
                    </div>
                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 rounded-md transition-colors">
                      Deploy Virtual Hardware
                    </button>
                  </form>
                </GlassCard>
              </div>

              <div className="lg:col-span-2 space-y-6">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Server className="w-5 h-5 text-gray-400" />
                  Active Fleet Registry
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data?.devices?.map((device: any) => (
                    <GlassCard key={device.id} className="p-5 flex flex-col gap-4 border border-white/5 hover:border-white/20 transition-all">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-xs font-mono text-gray-500 mb-1">DEVICE ID</div>
                          <div className="text-lg font-semibold text-white tracking-wide">{device.id}</div>
                        </div>
                        <div className={`px-2 py-1 rounded text-xs font-mono ${device.online_state ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                          {device.online_state ? 'ONLINE' : 'OFFLINE'}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-gray-500">Vehicle</div>
                          <div className="text-gray-200">{device.vehicle_reg}</div>
                        </div>
                        <div>
                          <div className="text-gray-500">Driver</div>
                          <div className="text-gray-200">{device.driver_name}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 border-t border-white/5 pt-4 mt-2">
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <Battery className="w-4 h-4 text-green-400" />
                          {device.battery_level}%
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <Signal className="w-4 h-4 text-blue-400" />
                          {device.signal_strength} Bars
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          {device.encryption_status ? <Shield className="w-4 h-4 text-green-400"/> : <ShieldAlert className="w-4 h-4 text-red-400" />}
                          {device.encryption_status ? "Secured" : "Compromised"}
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-t border-white/5 pt-4">
                        {device.qr_code && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setQrModal({ deviceId: device.id, vehicleReg: device.vehicle_reg, driverName: device.driver_name })}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 border border-blue-500/30 text-blue-400 hover:bg-blue-500/20 text-xs font-medium rounded-lg transition-all"
                            >
                              🏷 Branded QR Card
                            </button>
                            <a href={`/ride/${device.id}`} target="_blank" className="text-xs text-gray-500 hover:text-blue-400 transition-colors">Open Trip ↗</a>
                          </div>
                        )}
                        <div className="flex gap-2">
                          <button 
                            onClick={() => toggleSimulation(device.id)} 
                            className={`px-3 py-1 text-xs rounded transition-colors flex items-center gap-1 ${activeSimulations[device.id] ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' : 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'}`}
                            title={activeSimulations[device.id] ? "Stop Simulation" : "Start Simulation"}
                          >
                            {activeSimulations[device.id] ? <Square className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                            {activeSimulations[device.id] ? "Stop Engine" : "Simulate"}
                          </button>
                          <button onClick={() => handleSimulateEvent(device.id, 'failsafe')} className="px-2 py-1 bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 text-xs rounded transition-colors" title="Simulate passenger phone failure">Failsafe</button>
                          <button onClick={() => handleSimulateEvent(device.id, 'tamper')} className="px-2 py-1 bg-red-500/20 text-red-400 hover:bg-red-500/30 text-xs rounded transition-colors" title="Simulate hardware tampering">Tamper</button>
                        </div>
                      </div>
                    </GlassCard>
                  ))}
                  {data?.devices?.length === 0 && (
                    <div className="col-span-2 p-8 text-center text-gray-500 border border-dashed border-white/10 rounded-xl">
                      No virtual devices deployed. Provision a new device to begin simulation.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "map" && (
            <GlassCard className="p-6 h-[700px] flex flex-col">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-400" />
                Live Fleet Telemetry Map
              </h2>
              <div className="flex-1 bg-black/50 rounded-xl border border-white/10 overflow-hidden relative flex items-center justify-center">
                 <VehicleMap telemetryData={data?.telemetry || []} sosActive={!!globalAlert} playAlarm={alarmPlaying} />
              </div>
            </GlassCard>
          )}

          {activeTab === "incidents" && (
            <GlassCard className="p-6">
               <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                System Incident Logs
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-white/5 text-gray-400">
                    <tr>
                      <th className="p-3 rounded-tl-lg">Timestamp</th>
                      <th className="p-3">Device ID</th>
                      <th className="p-3">Type</th>
                      <th className="p-3">Description</th>
                      <th className="p-3 rounded-tr-lg">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {data?.incidents?.map((inc: any) => (
                      <tr key={inc.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-3 text-gray-400">{new Date(inc.timestamp).toLocaleString()}</td>
                        <td className="p-3 font-mono text-blue-400">{inc.device_id}</td>
                        <td className="p-3"><span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs font-medium">{inc.type}</span></td>
                        <td className="p-3 text-gray-300">{inc.description}</td>
                        <td className="p-3 text-gray-500 uppercase text-xs">{inc.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          )}

        </div>
      </div>

      {/* Branded QR Card Modal */}
      {qrModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
          onClick={() => setQrModal(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="bg-[#0a0a0f] border border-white/10 rounded-3xl p-8 shadow-2xl flex flex-col items-center gap-6 max-w-sm w-full"
            onClick={e => e.stopPropagation()}
          >
            <div className="text-center">
              <div className="flex items-center gap-2 justify-center text-blue-400 mb-1">
                <Shield className="w-4 h-4" />
                <span className="font-mono text-xs tracking-wider uppercase">Project Suraksha</span>
              </div>
              <h2 className="text-lg font-bold text-white">Branded QR Card</h2>
              <p className="text-xs text-gray-500 mt-1">
                Print or display this for <span className="text-blue-400 font-mono">{qrModal.deviceId}</span>
              </p>
            </div>

            <BrandedQRCard
              deviceId={qrModal.deviceId}
              vehicleReg={qrModal.vehicleReg}
              driverName={qrModal.driverName}
              rideUrl={`${typeof window !== 'undefined' ? window.location.origin : ''}/ride/${qrModal.deviceId}`}
              downloadable={true}
            />

            <button
              onClick={() => setQrModal(null)}
              className="text-sm text-gray-500 hover:text-white transition-colors"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

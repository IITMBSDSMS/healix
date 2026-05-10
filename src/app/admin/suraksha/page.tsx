"use client";

import React, { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Shield, Server, Activity, AlertTriangle, MapPin, 
  Battery, Signal, CheckCircle, Zap, ShieldAlert, Play, Square
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

export default function SurakshaAdminPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"registry" | "map" | "incidents">("registry");

  // Simulation Engine State
  const [activeSimulations, setActiveSimulations] = useState<Record<string, TelemetryState>>({});

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
      .on("postgres_changes", { event: "*", schema: "public", table: "incident_reports" }, fetchData)
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
          <div className="flex items-center gap-4 bg-white/5 px-4 py-2 rounded-full border border-white/10">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-mono text-green-400">SYSTEM OPERATIONAL</span>
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
                            <Image src={device.qr_code} alt="QR" width={40} height={40} className="rounded-md" />
                            <a href={`/ride/${device.id}`} target="_blank" className="text-xs text-blue-400 hover:underline">Scan / Open Trip</a>
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
                 <VehicleMap telemetryData={data?.telemetry || []} />
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
    </div>
  );
}

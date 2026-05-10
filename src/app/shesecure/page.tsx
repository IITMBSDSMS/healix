"use client";

import React, { useState, useEffect, useRef } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Shield, AlertTriangle, MapPin, X, Users, Calendar, Phone, Mail, Trash2, Plus, QrCode, Car, CheckCircle, Clock, ShieldCheck, Play, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { saveSosAlert, saveContact, deleteContact, lookupVehicle, startTrip, endTrip, updateTripLocation, getContacts, getTripHistory, getSessionPhotos } from "./actions";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import dynamic from "next/dynamic";
import { generateInitialState, generateNextState } from "@/lib/suraksha/simulator";

const VehicleMap = dynamic(() => import("@/components/ui/VehicleMap"), {
  ssr: false,
  loading: () => <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">Loading radar...</div>,
});

const initiatives = [
  { id: 1, title: "Women's Safety Awareness Seminar", description: "A comprehensive seminar covering self-defense techniques, legal rights, and digital safety for women in urban environments.", date: "October 15, 2025", image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop" },
  { id: 2, title: "Community Defense Workshop", description: "Interactive workshop teaching practical physical defense maneuvers led by professional martial artists.", date: "November 5, 2025", image: "https://images.unsplash.com/photo-1555597673-b21d5c935865?q=80&w=800&auto=format&fit=crop" },
  { id: 3, title: "Digital Security Training", description: "Learn how to protect your personal data, secure your devices, and identify online threats in this expert-led session.", date: "December 12, 2025", image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=800&auto=format&fit=crop" },
];

const sessionPhotos = [
  { id: 1, src: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop", caption: "Self-Defence Workshop, Delhi" },
  { id: 2, src: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=800&auto=format&fit=crop", caption: "Community Safety Seminar" },
  { id: 3, src: "https://images.unsplash.com/photo-1607748862156-7c548e7e98f4?q=80&w=800&auto=format&fit=crop", caption: "Digital Safety Training" },
  { id: 4, src: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800&auto=format&fit=crop", caption: "Awareness Drive 2024" },
  { id: 5, src: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=800&auto=format&fit=crop", caption: "Legal Rights Workshop" },
  { id: 6, src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop", caption: "Group Discussion Session" },
];

type Contact = { id: string; name: string; phone?: string; email?: string };
type Vehicle = { id: string; driver_name: string; vehicle_number: string; qr_code: string };

export default function SheSecurePage() {
  const router = useRouter();
  const [sosStatus, setSosStatus] = useState<"idle" | "locating" | "sending" | "active">("idle");
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [sosError, setSosError] = useState<string | null>(null);
  const [selectedInitiative, setSelectedInitiative] = useState<typeof initiatives[0] | null>(null);

  // Live Radar Demo state (Feature 2)
  const [radarRunning, setRadarRunning] = useState(false);
  const [radarState, setRadarState] = useState(generateInitialState());
  const [radarTelemetry, setRadarTelemetry] = useState<any[]>([]);

  // Contacts
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [showAddContact, setShowAddContact] = useState(false);
  const [contactLoading, setContactLoading] = useState(false);
  const [contactError, setContactError] = useState<string | null>(null);

  // Suraksha
  const [qrInput, setQrInput] = useState("");
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [vehicleError, setVehicleError] = useState<string | null>(null);
  const [tripStatus, setTripStatus] = useState<"idle" | "active" | "completed">("idle");
  const [tripId, setTripId] = useState<string | null>(null);
  const [tripLoading, setTripLoading] = useState(false);
  const [tripError, setTripError] = useState<string | null>(null);
  
  // Trip History
  const [tripHistory, setTripHistory] = useState<any[]>([]);

  // Session Photos (from DB, falls back to hardcoded)
  const [dbSessionPhotos, setDbSessionPhotos] = useState<{id: string; image_url: string; caption: string}[]>([]);

  // Scanner Modal State
  const [showScanner, setShowScanner] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  // Initial Data Fetch
  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      await supabase.auth.getSession();
      const fetchedContacts = await getContacts();
      const fetchedTrips = await getTripHistory();
      const fetchedPhotos = await getSessionPhotos();
      setContacts(fetchedContacts);
      setTripHistory(fetchedTrips);
      
      // Merge local storage photos for mock/demo mode
      let allPhotos = [...fetchedPhotos];
      if (typeof window !== 'undefined') {
        const localPhotos = JSON.parse(localStorage.getItem('healix_mock_photos') || '[]');
        allPhotos = [...localPhotos, ...allPhotos];
      }
      
      if (allPhotos.length > 0) setDbSessionPhotos(allPhotos);
    };
    fetchData();
  }, [router]);

  // Radar Demo simulation loop
  useEffect(() => {
    if (!radarRunning) return;
    const interval = setInterval(() => {
      setRadarState(prev => {
        const next = generateNextState(prev);
        setRadarTelemetry(log => [
          { ...next, device_id: "DEMO-VEHICLE", timestamp: new Date().toISOString() },
          ...log.slice(0, 4),
        ]);
        return next;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [radarRunning]);

  // Background Location Polling for Live Tracking
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (tripStatus === "active" && tripId) {
      interval = setInterval(() => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (pos) => {
              const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
              setLocation(loc);
              await updateTripLocation(tripId, loc);
              console.log("Trip location updated:", loc);
            },
            (err) => console.error("Error polling location:", err),
            { enableHighAccuracy: true }
          );
        }
      }, 10000); // Poll every 10 seconds
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [tripStatus, tripId]);

  const handleSOS = async () => {
    setSosStatus("locating");
    setSosError(null);
    if (!navigator.geolocation) { await sendAlert(null); return; }
    navigator.geolocation.getCurrentPosition(
      async (pos) => { const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude }; setLocation(loc); await sendAlert(loc); },
      async () => { await sendAlert(null); },
      { timeout: 10000 }
    );
  };

  const sendAlert = async (loc: { lat: number; lng: number } | null) => {
    setSosStatus("sending");
    const result = await saveSosAlert(loc);
    if (result.error) { setSosError(result.error); setSosStatus("idle"); } else { setSosStatus("active"); }
  };

  const handleAddContact = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setContactLoading(true);
    setContactError(null);
    const formData = new FormData(e.currentTarget);
    const result = await saveContact(formData);
    if (result.error) { setContactError(result.error); } else {
      const name = formData.get("name") as string;
      const phone = formData.get("phone") as string;
      const email = formData.get("email") as string;
      setContacts(prev => [...prev, { id: Date.now().toString(), name, phone, email }]);
      setShowAddContact(false);
      (e.target as HTMLFormElement).reset();
    }
    setContactLoading(false);
  };

  const handleDeleteContact = async (id: string) => {
    await deleteContact(id);
    setContacts(prev => prev.filter(c => c.id !== id));
  };

  const handleLookupVehicle = async (code: string) => {
    if (!code) return;
    setVehicleError(null);
    const result = await lookupVehicle(code);
    if (result.error) { setVehicleError(result.error); setVehicle(null); }
    else { setVehicle(result.vehicle as Vehicle); }
  };

  const handleManualLookup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const code = formData.get("qr_code") as string;
    if (!code) return;
    
    setVehicleError(null);
    setQrInput(code.toUpperCase());
    const result = await lookupVehicle(code.toUpperCase());
    if (result.error) { 
      setVehicleError(result.error); 
      setVehicle(null); 
    } else { 
      setVehicle(result.vehicle as Vehicle); 
    }
  };

  const handleStartTrip = async (recordingEnabled: boolean) => {
    if (!vehicle) return;
    setTripLoading(true);
    setTripError(null);
    const result = await startTrip(vehicle.id, location, recordingEnabled);
    setTripLoading(false);
    if (result.error) {
      setTripError(result.error);
    } else {
      setTripStatus("active");
      if (result.tripId) setTripId(result.tripId);
    }
  };

  const handleEndTrip = async () => {
    if (tripId) await endTrip(tripId);
    setTripStatus("completed");
    setTimeout(() => { setTripStatus("idle"); setVehicle(null); setQrInput(""); setTripId(null); }, 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-8">

      {/* Hero */}
      <div className="mb-16 relative overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-br from-[#0a0010] via-[#050008] to-black min-h-[420px] flex items-stretch">
        <style>{`
          @keyframes arc-draw { from { stroke-dashoffset: 600; } to { stroke-dashoffset: 0; } }
          @keyframes node-pop { 0%,100%{opacity:.3;r:3} 50%{opacity:.9;r:5} }
          .arc-line { stroke-dasharray: 600; animation: arc-draw 3s ease forwards; }
          .stat-card { backdrop-filter:blur(16px); background:rgba(255,255,255,.04); border:1px solid rgba(239,68,68,.15); }
        `}</style>

        {/* Left column — text + features */}
        <div className="relative z-10 flex-1 p-10 flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/25 rounded-full text-red-400 text-xs font-semibold mb-7 tracking-wider uppercase w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
            A Free Initiative for Women Safety
          </div>

          <h1 className="text-4xl md:text-5xl font-black mb-3 leading-tight">
            <span className="text-white">A </span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-orange-300">FREE</span>
            <span className="text-white"> Initiative</span>
            <br />
            <span className="text-white">for Women Safety</span>
          </h1>
          <div className="w-10 h-0.5 bg-gradient-to-r from-red-500 to-orange-400 mb-8 rounded-full" />

          {/* Feature list — like image 2 */}
          <div className="space-y-5 mb-10">
            {[
              { icon: <Shield className="h-5 w-5" />, label: "PROTECT", color: "text-red-400", bg: "bg-red-500/10 border-red-500/20" },
              { icon: <MapPin className="h-5 w-5" />, label: "EMPOWER", color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/20" },
              { icon: <Users className="h-5 w-5" />, label: "SUPPORT", color: "text-pink-400", bg: "bg-pink-500/10 border-pink-500/20" },
            ].map(f => (
              <div key={f.label} className="flex items-center gap-4 group">
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${f.bg} ${f.color} shrink-0`}>
                  {f.icon}
                </div>
                <span className={`text-lg font-bold tracking-widest ${f.color}`}>{f.label}</span>
                <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent" />
              </div>
            ))}
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { val: "1-tap", label: "SOS Alert" },
              { val: "24/7", label: "Protection" },
              { val: "10s", label: "Response" },
            ].map(s => (
              <div key={s.label} className="stat-card rounded-2xl p-3 text-center">
                <p className="text-xl font-black text-red-400">{s.val}</p>
                <p className="text-white/50 text-xs mt-0.5 font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right column — illustration panel */}
        <div className="relative hidden lg:block w-[420px] shrink-0 overflow-hidden">
          {/* Hero image as full background */}
          <img
            src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=1200&auto=format&fit=crop"
            alt="SheSecure"
            className="absolute inset-0 w-full h-full object-cover object-center opacity-70"
          />
          {/* Gradient overlay to blend left edge into dark bg */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#050008] via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          {/* SVG constellation/network overlay — like image 2 */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 420 420" preserveAspectRatio="xMidYMid slice">
            {/* Subtle arc rings — NOT spinning */}
            <circle cx="310" cy="140" r="120" fill="none" stroke="#c026d3" strokeWidth="0.6" opacity="0.25" />
            <circle cx="310" cy="140" r="80" fill="none" stroke="#c026d3" strokeWidth="0.4" opacity="0.2" />

            {/* Network constellation lines */}
            <line x1="310" y1="140" x2="230" y2="200" stroke="#e879f9" strokeWidth="0.8" opacity="0.4"/>
            <line x1="310" y1="140" x2="360" y2="210" stroke="#e879f9" strokeWidth="0.8" opacity="0.3"/>
            <line x1="310" y1="140" x2="280" y2="80" stroke="#e879f9" strokeWidth="0.8" opacity="0.4"/>
            <line x1="230" y1="200" x2="180" y2="280" stroke="#e879f9" strokeWidth="0.6" opacity="0.3"/>
            <line x1="360" y1="210" x2="380" y2="300" stroke="#e879f9" strokeWidth="0.6" opacity="0.25"/>
            <line x1="280" y1="80" x2="350" y2="50" stroke="#f9a8d4" strokeWidth="0.6" opacity="0.3"/>

            {/* Glowing nodes */}
            <circle cx="310" cy="140" r="5" fill="#e879f9" opacity="0.9"/>
            <circle cx="230" cy="200" r="3" fill="#e879f9" opacity="0.7"/>
            <circle cx="360" cy="210" r="3" fill="#f9a8d4" opacity="0.6"/>
            <circle cx="280" cy="80" r="2.5" fill="#e879f9" opacity="0.7"/>
            <circle cx="180" cy="280" r="2" fill="#e879f9" opacity="0.5"/>
            <circle cx="380" cy="300" r="2" fill="#f9a8d4" opacity="0.4"/>
            <circle cx="350" cy="50" r="2" fill="#f9a8d4" opacity="0.5"/>

            {/* City skyline silhouette at bottom */}
            <path d="M0,380 L30,380 L30,340 L50,340 L50,320 L70,320 L70,310 L80,310 L80,340 L100,340 L100,300 L120,300 L120,340 L140,340 L140,350 L160,350 L160,330 L180,330 L180,350 L200,350 L200,360 L220,360 L220,340 L240,340 L240,300 L260,300 L260,340 L280,340 L280,310 L300,310 L300,340 L320,340 L320,360 L340,360 L340,340 L360,340 L360,350 L380,350 L380,370 L420,370 L420,420 L0,420 Z"
              fill="url(#skyline-g)" opacity="0.25"/>
            <defs>
              <linearGradient id="skyline-g" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7e22ce" stopOpacity="0.6"/>
                <stop offset="100%" stopColor="#1a0030" stopOpacity="0.9"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
        {/* SOS */}
        <GlassCard className={`text-center py-10 transition-colors duration-500 relative overflow-hidden ${sosStatus === "active" ? "bg-red-500/10 border-red-500/50 shadow-[0_0_50px_rgba(239,68,68,0.2)]" : "border-red-500/20"}`}>
          {/* SVG decorative background */}
          <svg className="absolute inset-0 w-full h-full opacity-5 pointer-events-none" viewBox="0 0 400 400">
            <circle cx="200" cy="200" r="180" fill="none" stroke="#ef4444" strokeWidth="0.5" strokeDasharray="6 4"/>
            <circle cx="200" cy="200" r="140" fill="none" stroke="#ef4444" strokeWidth="0.5" strokeDasharray="4 6"/>
            <circle cx="200" cy="200" r="100" fill="none" stroke="#f97316" strokeWidth="0.5"/>
            <line x1="20" y1="200" x2="380" y2="200" stroke="#ef4444" strokeWidth="0.5" opacity="0.5"/>
            <line x1="200" y1="20" x2="200" y2="380" stroke="#ef4444" strokeWidth="0.5" opacity="0.5"/>
          </svg>
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-60" />
          <h2 className="text-2xl font-bold mb-2">Emergency SOS</h2>
          <p className="text-white/50 text-sm mb-8">One tap sends your location to emergency contacts</p>
          <div className="flex justify-center mb-8 relative">
            {sosStatus === "active" && (
              <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }} transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-red-500 rounded-full blur-2xl z-0" />
            )}
            {/* SVG radar rings around SOS button */}
            {sosStatus === "idle" && (
              <svg className="absolute w-64 h-64 opacity-20 pointer-events-none" viewBox="0 0 200 200" style={{top:"50%",left:"50%",transform:"translate(-50%,-50%)"}}>
                <circle cx="100" cy="100" r="90" fill="none" stroke="#ef4444" strokeWidth="0.8" strokeDasharray="8 4"/>
                <circle cx="100" cy="100" r="70" fill="none" stroke="#ef4444" strokeWidth="0.8" strokeDasharray="5 5"/>
              </svg>
            )}
            <button onClick={handleSOS} disabled={sosStatus !== "idle"}
              className={`relative z-10 w-44 h-44 rounded-full flex flex-col items-center justify-center text-white font-bold text-2xl transition-all duration-300 ${sosStatus === "idle" ? "bg-gradient-to-b from-red-500 to-red-700 hover:scale-105 shadow-[0_0_30px_rgba(239,68,68,0.5)] cursor-pointer" : sosStatus === "active" ? "bg-red-600 shadow-[0_0_50px_rgba(239,68,68,0.8)] cursor-not-allowed" : "bg-red-500/50 cursor-wait"}`}>
              {sosStatus === "idle" && <><AlertTriangle className="h-10 w-10 mb-2" /><span>SOS</span></>}
              {sosStatus === "locating" && <span className="text-lg">Locating...</span>}
              {sosStatus === "sending" && <span className="text-lg">Sending...</span>}
              {sosStatus === "active" && <><Shield className="h-10 w-10 mb-2" /><span className="text-base">ALERT ACTIVE</span></>}
            </button>
          </div>
          {sosStatus === "active" && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 font-medium mb-2">Emergency contacts notified!</motion.p>}
          {location && <p className="text-white/40 text-xs flex items-center justify-center gap-1"><MapPin className="h-3 w-3" />{location.lat.toFixed(4)}, {location.lng.toFixed(4)}</p>}
          {sosError && <p className="text-red-400 text-sm mt-2">{sosError}</p>}
          {sosStatus === "active" && <button onClick={() => { setSosStatus("idle"); setLocation(null); }} className="mt-6 px-5 py-2 border border-white/20 rounded-full text-sm hover:bg-white/10 transition-colors">Cancel Alert</button>}
          <div className="mt-6 p-3 rounded-xl bg-red-500/5 border border-red-500/20">
            <p className="text-xs text-white/50"><strong className="text-white/70">Safety Disclaimer:</strong> This system assists in emergencies but does not replace official services. Always contact local authorities when necessary.</p>
          </div>
        </GlassCard>

        {/* Emergency Contacts */}
        <GlassCard glowOnHover={false}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-red-400" />
              <h2 className="text-xl font-bold">Emergency Contacts</h2>
            </div>
            <button onClick={() => setShowAddContact(!showAddContact)} className="flex items-center gap-1 text-sm text-red-400 hover:text-red-300 transition-colors">
              <Plus className="h-4 w-4" />{showAddContact ? "Cancel" : "Add"}
            </button>
          </div>

          <AnimatePresence>
            {showAddContact && (
              <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                onSubmit={handleAddContact} className="mb-6 space-y-3 overflow-hidden">
                <input name="name" required placeholder="Full Name *" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-red-500 transition-colors" />
                <input name="phone" placeholder="Phone Number" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-red-500 transition-colors" />
                <input name="email" type="email" placeholder="Email Address" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-red-500 transition-colors" />
                {contactError && <p className="text-red-400 text-xs">{contactError}</p>}
                <Button type="submit" isLoading={contactLoading} className="w-full bg-red-600 hover:bg-red-700 text-sm py-2">Save Contact</Button>
              </motion.form>
            )}
          </AnimatePresence>

          {contacts.length === 0 ? (
            <div className="text-center py-8 text-white/40">
              <Users className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No emergency contacts added yet.</p>
              <p className="text-xs mt-1">Add trusted contacts who'll be alerted during SOS.</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {contacts.map(c => (
                <li key={c.id} className="flex items-start justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                  <div>
                    <p className="font-medium text-sm">{c.name}</p>
                    {c.phone && <p className="text-white/50 text-xs flex items-center gap-1 mt-0.5"><Phone className="h-3 w-3" />{c.phone}</p>}
                    {c.email && <p className="text-white/50 text-xs flex items-center gap-1 mt-0.5"><Mail className="h-3 w-3" />{c.email}</p>}
                  </div>
                  <button onClick={() => handleDeleteContact(c.id)} className="p-1.5 text-white/30 hover:text-red-400 transition-colors"><Trash2 className="h-4 w-4" /></button>
                </li>
              ))}
            </ul>
          )}
        </GlassCard>
      </div>

      {/* Feature 2: Live Radar Demo */}
      <div className="mb-16">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-blue-500/20 border border-blue-500/30">
            <Shield className="h-6 w-6 text-blue-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">See It Work — Live Demo</h2>
          </div>
          <span className="text-xs px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded-full border border-blue-500/30 animate-pulse">Interactive</span>
        </div>
        <p className="text-white/50 text-sm mb-6 ml-14">
          This is a real-time simulation of Healix Suraksha tracking a vehicle. Watch it move across the map.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map */}
          <div className="lg:col-span-2 h-80 rounded-2xl overflow-hidden border border-white/10 relative">
            <VehicleMap telemetryData={radarTelemetry} />
            {!radarRunning && (
              <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-10">
                <button
                  onClick={() => setRadarRunning(true)}
                  className="flex items-center gap-3 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl shadow-[0_0_25px_rgba(37,99,235,0.4)] transition-all"
                >
                  <Play className="w-5 h-5" /> Launch Live Radar
                </button>
              </div>
            )}
            {radarRunning && (
              <div className="absolute top-3 left-3 z-10 flex items-center gap-2 bg-black/60 backdrop-blur px-3 py-1.5 rounded-full">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs font-mono text-green-400">LIVE TRACKING</span>
              </div>
            )}
          </div>

          {/* Sidebar stats + CTA */}
          <div className="flex flex-col gap-4">
            <GlassCard className="p-5 flex-1">
              <h3 className="text-sm font-semibold text-white mb-4">Vehicle Telemetry</h3>
              {radarRunning ? (
                <div className="space-y-3">
                  {[
                    { label: "Speed", value: `${radarState.speed} km/h`, color: "text-yellow-400" },
                    { label: "Battery", value: `${radarState.battery}%`, color: "text-green-400" },
                    { label: "Signal", value: `${radarState.signal} bars`, color: "text-blue-400" },
                    { label: "Status", value: "ACTIVE", color: "text-green-400" },
                  ].map(s => (
                    <div key={s.label} className="flex justify-between items-center">
                      <span className="text-xs text-gray-500 font-mono">{s.label}</span>
                      <span className={`text-sm font-bold ${s.color}`}>{s.value}</span>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-white/10">
                    <button
                      onClick={() => { setRadarRunning(false); setRadarTelemetry([]); }}
                      className="text-xs text-gray-500 hover:text-white transition-colors"
                    >
                      Stop demo
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-xs leading-relaxed">
                  Click "Launch Live Radar" to watch a simulated Healix-protected vehicle broadcast its location in real-time.
                </p>
              )}
            </GlassCard>

            <a
              href="/admin/suraksha/sandbox"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 bg-white/5 border border-white/10 hover:border-blue-500/30 hover:bg-blue-500/5 rounded-xl transition-all group"
            >
              <div>
                <p className="text-sm font-semibold text-white">Open Full Sandbox</p>
                <p className="text-xs text-gray-500 mt-0.5">Split-screen interactive demo</p>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-blue-400 transition-colors" />
            </a>
          </div>
        </div>
      </div>

      {/* Project Suraksha */}
      <div className="mb-16">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-orange-500/20 border border-orange-500/30">
            <QrCode className="h-6 w-6 text-orange-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Project Suraksha</h2>
          </div>
          <span className="text-xs px-2 py-0.5 bg-orange-500/20 text-orange-400 rounded-full border border-orange-500/30 animate-pulse">QR Travel Safety</span>
        </div>
        <p className="text-white/50 text-sm mb-8 ml-14">Scan or enter the vehicle QR code before your ride. Your trip is tracked and your contacts are alerted automatically.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <GlassCard glowOnHover={false}>
            <h3 className="font-semibold mb-4 flex items-center gap-2"><QrCode className="h-5 w-5 text-orange-400" />Enter Vehicle ID</h3>
            
            {!vehicle && tripStatus === "idle" && (
              <form onSubmit={handleManualLookup} className="mb-4">
                <div className="flex gap-2">
                  <input 
                    name="qr_code" 
                    required 
                    placeholder="e.g. A1B2C3D4 or DL-01-AB-1234" 
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500/50 transition-colors uppercase font-mono tracking-widest" 
                  />
                  <button type="submit" className="px-6 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition-colors">
                    Look Up
                  </button>
                </div>
                <p className="text-xs text-white/40 mt-3">Enter the 8-character ID found under the vehicle's QR code.</p>
              </form>
            )}

            {vehicleError && <p className="text-red-400 text-sm mb-3">{vehicleError}</p>}

            {vehicle && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-xl mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <Car className="h-5 w-5 text-orange-400" />
                  <p className="font-semibold text-orange-300">Vehicle Found</p>
                </div>
                <p className="text-sm text-white/70"><span className="text-white/40">Driver:</span> {vehicle.driver_name}</p>
                <p className="text-sm text-white/70"><span className="text-white/40">Vehicle No:</span> {vehicle.vehicle_number}</p>
              </motion.div>
            )}

            {tripStatus === "idle" && vehicle && (
              <div className="space-y-4">
                <div className="p-3 bg-red-500/5 border border-red-500/20 rounded-xl">
                  <h4 className="text-sm font-bold text-red-400 mb-1 flex items-center gap-1"><ShieldCheck className="h-4 w-4" /> Legal Consent Required</h4>
                  <p className="text-xs text-white/50 leading-relaxed">
                    By starting this trip, you agree to live location tracking to ensure your safety. 
                    Safety recording will ONLY activate during emergencies or if you explicitly enable it below.
                  </p>
                </div>
                
                <button onClick={() => handleStartTrip(false)} disabled={tripLoading}
                  className="w-full py-3 bg-white/5 border border-white/10 text-white font-semibold rounded-xl hover:bg-white/10 transition-all disabled:opacity-50 flex flex-col items-center justify-center">
                  <span>Start Trip (Tracking Only)</span>
                  <span className="text-[10px] text-white/40 font-normal mt-0.5">Microphone remains completely disabled.</span>
                </button>

                <button onClick={() => handleStartTrip(true)} disabled={tripLoading}
                  className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-xl hover:opacity-90 shadow-[0_0_15px_rgba(249,115,22,0.4)] transition-all disabled:opacity-50 flex flex-col items-center justify-center">
                  <span>Start Trip + Safety Recording</span>
                  <span className="text-[10px] text-white/80 font-normal mt-0.5">Records 10s audio loops if SOS or Failsafe triggers.</span>
                </button>
                {tripLoading && <p className="text-center text-xs text-orange-400 animate-pulse">Starting trip & alerting contacts...</p>}
                {tripError && <p className="text-center text-xs text-red-400">{tripError}</p>}
              </div>
            )}

            {tripStatus === "active" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/30 rounded-xl">
                  <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-2.5 h-2.5 rounded-full bg-green-400" />
                  <p className="text-green-400 font-medium text-sm">Trip Active — Contacts Alerted</p>
                </div>
                {location && <p className="text-white/40 text-xs flex items-center gap-1"><MapPin className="h-3 w-3" />Start: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}</p>}
                
                <a 
                  href={`/track/${tripId}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full py-2.5 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-xl text-sm font-medium flex justify-center items-center gap-2 hover:bg-blue-500/30 transition-colors"
                >
                  <MapPin className="h-4 w-4" /> Open Live Tracking Dashboard
                </a>

                <button onClick={handleEndTrip} className="w-full py-2.5 border border-white/20 text-white/70 rounded-xl text-sm hover:bg-white/5 transition-colors">End Trip Safely</button>
              </motion.div>
            )}

            {tripStatus === "completed" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 p-3 bg-white/5 border border-white/10 rounded-xl">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <p className="text-green-400 text-sm font-medium">Trip completed safely!</p>
              </motion.div>
            )}
          </GlassCard>

          <GlassCard glowOnHover={false}>
            <h3 className="font-semibold mb-4 flex items-center gap-2"><Clock className="h-5 w-5 text-orange-400" />How It Works</h3>
            <ol className="space-y-4">
              {[
                { step: "1", title: "Scan QR Code", desc: "Every vehicle has a unique QR code linked to the driver and vehicle details." },
                { step: "2", title: "Trip Starts", desc: "Your location is captured and the trip is logged as a Safety Black Box." },
                { step: "3", title: "Contacts Alerted", desc: "Your emergency contacts receive an email with vehicle details and your start location." },
                { step: "4", title: "End Trip", desc: "Mark trip complete when you arrive safely. Full route history is stored." },
              ].map(item => (
                <li key={item.step} className="flex gap-4">
                  <div className="w-7 h-7 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400 text-xs font-bold shrink-0">{item.step}</div>
                  <div><p className="font-medium text-sm">{item.title}</p><p className="text-white/50 text-xs mt-0.5">{item.desc}</p></div>
                </li>
              ))}
            </ol>
          </GlassCard>
        </div>

        {/* Trip History */}
        {tripHistory.length > 0 && (
          <div className="mt-8">
            <GlassCard glowOnHover={false}>
              <h3 className="font-semibold mb-4 flex items-center gap-2"><MapPin className="h-5 w-5 text-orange-400" />Recent Trips</h3>
              <div className="space-y-3">
                {tripHistory.map(trip => (
                  <div key={trip.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
                    <div className="flex items-center gap-3 mb-3 md:mb-0">
                      <div className={`p-2 rounded-lg ${trip.status === 'active' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-white/5 text-white/50 border border-white/10'}`}>
                        <Car className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium text-sm text-white/90">{trip.vehicles?.vehicle_number || "Unknown Vehicle"}</p>
                        <p className="text-xs text-white/50">{trip.vehicles?.driver_name}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs">
                      <div className="text-white/40">
                        {new Date(trip.created_at).toLocaleDateString()}
                      </div>
                      <div className={`px-2 py-1 rounded-md border font-medium ${trip.status === 'active' ? 'bg-green-500/10 text-green-400 border-green-500/20 animate-pulse' : 'bg-white/5 text-white/40 border-white/10'}`}>
                        {trip.status.toUpperCase()}
                      </div>
                      <a href={`/track/${trip.id}`} className="text-blue-400 hover:text-blue-300 font-medium">View</a>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        )}
      </div>

      {/* Previous Sessions Marquee */}
      <div className="mb-16">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-red-500/15 border border-red-500/25">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold">Our Previous Sessions on Women Safety</h2>
          <span className="text-xs px-2 py-0.5 bg-white/5 border border-white/10 text-white/50 rounded-full">Hover to pause</span>
        </div>
        <p className="text-white/50 text-sm mb-6 ml-14">A glimpse of our on-ground workshops and community events.</p>
        <div className="relative overflow-hidden rounded-2xl border border-white/5" style={{ maskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)" }}>
          <style>{`@keyframes marquee-scroll{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}.marquee-track{display:flex;gap:1.25rem;width:max-content;animation:marquee-scroll 30s linear infinite}.marquee-track:hover{animation-play-state:paused}`}</style>
          <div className="marquee-track py-3">
            {[...(dbSessionPhotos.length > 0 ? dbSessionPhotos.map(p => ({ src: p.image_url, caption: p.caption })) : sessionPhotos), ...(dbSessionPhotos.length > 0 ? dbSessionPhotos.map(p => ({ src: p.image_url, caption: p.caption })) : sessionPhotos)].map((photo, idx) => (
              <div key={idx} className="relative group shrink-0 w-72 h-52 rounded-xl overflow-hidden border border-white/10 shadow-lg">
                <img src={photo.src} alt={photo.caption} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-red-500/10 border border-red-500/30 rounded-xl" />
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="text-white text-sm font-semibold drop-shadow-lg">{photo.caption}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Community Programs */}
      <div className="relative">
        {/* SVG dot-grid decoration */}
        <svg className="absolute -top-8 -right-8 w-48 h-48 opacity-5 pointer-events-none" viewBox="0 0 100 100">
          {Array.from({length:10}).map((_,row) => Array.from({length:10}).map((_,col) => (
            <circle key={`${row}-${col}`} cx={col*10+5} cy={row*10+5} r="1" fill="#ef4444"/>
          )))}
        </svg>
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 rounded-xl bg-red-500/15 border border-red-500/25">
            <Users className="h-5 w-5 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold">Community Awareness & Safety Programs</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {initiatives.map(initiative => (
            <GlassCard key={initiative.id} className="overflow-hidden group cursor-pointer p-0 border-white/10 hover:border-red-500/40 transition-all duration-300 hover:shadow-[0_0_30px_rgba(239,68,68,0.1)]" onClick={() => setSelectedInitiative(initiative)}>
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-red-500/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="h-52 overflow-hidden relative">
                <img src={initiative.image} alt={initiative.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                <div className="absolute top-3 right-3">
                  <span className="text-[10px] px-2 py-0.5 bg-black/60 border border-white/10 text-white/60 rounded-full backdrop-blur-md">Event</span>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center gap-1.5 text-red-300 text-xs font-medium mb-1.5">
                    <Calendar className="h-3 w-3" />{initiative.date}
                  </div>
                  <h3 className="font-bold text-base line-clamp-2 leading-snug">{initiative.title}</h3>
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm text-white/55 line-clamp-2 leading-relaxed">{initiative.description}</p>
                <div className="flex items-center gap-1 text-red-400 text-sm font-semibold mt-4 group-hover:gap-2 transition-all">
                  <span>Read more</span>
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* SVG CTA Banner */}
        <div className="mt-16 relative overflow-hidden rounded-3xl border border-red-500/20 bg-gradient-to-br from-red-950/40 via-black to-orange-950/30 p-10 text-center">
          <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" viewBox="0 0 800 200" preserveAspectRatio="xMidYMid slice">
            <path d="M0,100 Q200,20 400,100 T800,100" fill="none" stroke="#ef4444" strokeWidth="1.5"/>
            <path d="M0,130 Q200,50 400,130 T800,130" fill="none" stroke="#f97316" strokeWidth="1"/>
            <circle cx="100" cy="100" r="3" fill="#ef4444" opacity="0.5"/>
            <circle cx="400" cy="100" r="3" fill="#f97316" opacity="0.5"/>
            <circle cx="700" cy="100" r="3" fill="#ef4444" opacity="0.5"/>
          </svg>
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent"/>
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent"/>
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-red-500/20 border border-red-500/30 mb-5 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
              <Shield className="h-7 w-7 text-red-400" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Together, We Build Safer Communities</h3>
            <p className="text-white/50 text-sm max-w-xl mx-auto mb-6">Join thousands of women across India who use SheSecure for real-time protection, emergency response, and community safety.</p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <div className="flex items-center gap-2 text-white/40 text-xs">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"/>
                <span>Active Protection Network</span>
              </div>
              <div className="flex items-center gap-2 text-white/40 text-xs">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" style={{animationDelay:'0.5s'}}/>
                <span>Live GPS Monitoring</span>
              </div>
              <div className="flex items-center gap-2 text-white/40 text-xs">
                <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" style={{animationDelay:'1s'}}/>
                <span>Instant SOS Dispatch</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedInitiative && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedInitiative(null)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="bg-[#111] border border-white/10 rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl"
              onClick={e => e.stopPropagation()}>
              <div className="relative h-64">
                <img src={selectedInitiative.image} alt={selectedInitiative.title} className="w-full h-full object-cover" />
                <button onClick={() => setSelectedInitiative(null)} className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/80 rounded-full text-white backdrop-blur-md transition-colors"><X className="h-5 w-5" /></button>
              </div>
              <div className="p-8">
                <div className="flex items-center gap-2 text-red-400 text-sm font-medium mb-3"><Calendar className="h-4 w-4" />{selectedInitiative.date}</div>
                <h2 className="text-2xl font-bold mb-4">{selectedInitiative.title}</h2>
                <p className="text-white/70 leading-relaxed mb-8">{selectedInitiative.description}<br /><br />This initiative is part of Healix's ongoing commitment to building safer communities through education, awareness, and technology.</p>
                <button className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors" onClick={() => { alert("Registration flow coming soon."); setSelectedInitiative(null); }}>Register for Event</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

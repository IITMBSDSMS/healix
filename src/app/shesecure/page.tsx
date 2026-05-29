"use client";

import React, { useState, useEffect, useRef } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Shield, AlertTriangle, MapPin, X, Users, Calendar, Phone, Mail, Trash2, Plus, QrCode, Car, CheckCircle, Clock, ShieldCheck, Play, ExternalLink, GraduationCap, ChevronLeft, ChevronRight, BookOpen, Heart, Microscope, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { saveSosAlert, saveContact, deleteContact, lookupVehicle, startTrip, endTrip, updateTripLocation, getContacts, getTripHistory, getSessionPhotos } from "./actions";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import dynamic from "next/dynamic";
import { generateInitialState, generateNextState } from "@/lib/suraksha/simulator";
import { getCourses } from "@/lib/academy/db";

const VehicleMap = dynamic(() => import("@/components/ui/VehicleMap"), {
  ssr: false,
  loading: () => <div className="w-full h-full flex items-center justify-center text-zinc-500 text-xs">Loading radar...</div>,
});

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
  const [academyCourses, setAcademyCourses] = useState<any[]>([]);

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
  
  // Cinematic Lightbox State
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);

  // Initial Data Fetch
  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      await supabase.auth.getSession();
      const fetchedContacts = await getContacts();
      const fetchedTrips = await getTripHistory();
      const fetchedPhotos = await getSessionPhotos();
      const courses = await getCourses();
      setContacts(fetchedContacts);
      setTripHistory(fetchedTrips);
      setAcademyCourses(courses);
      
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

  const galleryPhotos = dbSessionPhotos.length > 0 
    ? dbSessionPhotos.map(p => ({ src: p.image_url, caption: p.caption })) 
    : sessionPhotos.map(p => ({ src: p.src, caption: p.caption }));

  // Cinematic Slideshow State
  const [slideshowIndex, setSlideshowIndex] = useState(0);

  // Auto-cycle shesecure campaigns gallery
  useEffect(() => {
    if (galleryPhotos.length === 0) return;
    const timer = setInterval(() => {
      setSlideshowIndex(prev => (prev + 1) % galleryPhotos.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [galleryPhotos.length]);

  return (
    <div className="relative min-h-screen bg-white text-zinc-900 font-sans pb-24 selection:bg-[#eab308]/20">
      
      {/* Cinematic background grids */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.01] pointer-events-none" />
      <div className="absolute inset-0 bg-dot-pattern opacity-[0.02] pointer-events-none" />
      
      <div className="max-w-[94%] mx-auto px-4 sm:px-6 lg:px-8 pt-12 relative z-10">

        {/* Hero Banner Panel */}
        <div className="mb-16 flex flex-col border border-zinc-200 rounded-2xl overflow-hidden bg-white shadow-sm">
          {/* Main Horizontal Row */}
          <div className="flex flex-col md:flex-row items-stretch min-h-[420px]">
            {/* Left Branding Column */}
            <div className="flex flex-col items-center justify-center p-8 text-center bg-white border-b md:border-b-0 md:border-r border-zinc-200/80 shrink-0 w-full md:w-[280px]">
              {/* HSF Logo */}
              <div className="relative w-24 h-24 mb-4 select-none flex items-center justify-center">
                <img 
                  src="/hsf-official-logo.png" 
                  alt="Healix Sahyog Foundation Logo" 
                  className="w-full h-full object-contain filter drop-shadow-sm animate-fade-in" 
                />
              </div>
              
              <h2 className="text-3xl font-extrabold tracking-tight text-zinc-950 font-sans leading-none">HEALIX</h2>
              <p className="text-[10px] font-bold tracking-[0.25em] text-zinc-800 uppercase mt-1">SAHYOG FOUNDATION</p>
              
              {/* Thin colored line */}
              <div className="w-40 h-[2px] bg-gradient-to-r from-pink-500 via-yellow-400 via-green-500 to-blue-500 my-4" />
              
              <p className="text-[11px] text-zinc-650 font-medium font-sans">
                An Initiative by <span className="font-bold text-zinc-900">Healix Technologies</span>
              </p>
            </div>

            {/* Middle Main Content Column */}
            <div className="flex-1 p-8 md:p-10 flex flex-col justify-between bg-white relative z-10">
              <div className="flex-1 flex flex-col justify-center">
                <h1 className="text-3xl md:text-[2.5rem] font-extrabold leading-tight tracking-tight text-zinc-950 mb-4 select-none">
                  INNOVATING TODAY,<br />
                  <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">IMPACTING</span>{" "}
                  <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">TOMORROW.</span>
                </h1>
                
                <p className="text-zinc-600 text-xs md:text-sm leading-relaxed max-w-2xl font-sans font-medium">
                  Healix Sahyog Foundation is dedicated to creating a better, safer, and healthier future through{" "}
                  <span className="text-pink-500 font-semibold">innovation</span>,{" "}
                  <span className="text-amber-500 font-semibold">education</span>,{" "}
                  <span className="text-emerald-500 font-semibold">healthcare</span>, and{" "}
                  <span className="text-cyan-500 font-semibold">community empowerment</span>.
                </p>
              </div>

              {/* 5 Focus Areas Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 pt-6 mt-8 border-t border-zinc-200/85">
                {[
                  {
                    icon: <Shield className="h-6 w-6 text-pink-500" />,
                    title: "WOMEN SAFETY",
                    desc: "Building safer communities"
                  },
                  {
                    icon: <BookOpen className="h-6 w-6 text-amber-500" />,
                    title: "EDUCATION & MENTORSHIP",
                    desc: "Empowering students, shaping futures"
                  },
                  {
                    icon: <Heart className="h-6 w-6 text-emerald-500" />,
                    title: "HEALTHCARE AWARENESS",
                    desc: "Promoting health, saving lives"
                  },
                  {
                    icon: <Microscope className="h-6 w-6 text-cyan-500" />,
                    title: "BIOMEDICAL INNOVATION",
                    desc: "Research today for a healthier tomorrow"
                  },
                  {
                    icon: <Users className="h-6 w-6 text-indigo-500" />,
                    title: "COMMUNITY EMPOWERMENT",
                    desc: "Together for sustainable impact"
                  }
                ].map((item, idx) => (
                  <div 
                    key={item.title} 
                    className={`flex flex-col items-center text-center px-1 ${
                      idx < 4 ? "md:border-r border-zinc-200" : ""
                    }`}
                  >
                    <div className="mb-2 transition-transform duration-300 hover:scale-110">
                      {item.icon}
                    </div>
                    <h4 className="text-[9px] font-extrabold tracking-wider text-zinc-900 uppercase">
                      {item.title}
                    </h4>
                    <p className="text-[8px] sm:text-[9px] text-zinc-500 mt-1 max-w-[130px] leading-tight">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Illustration Column */}
            <div className="relative hidden lg:block w-[350px] xl:w-[420px] shrink-0 overflow-hidden border-l border-zinc-200 bg-zinc-50">
              <Image
                src="/hsf-banner-collage.png"
                alt="Healix Sahyog Foundation Impact Banner"
                fill
                style={{ objectFit: "cover" }}
                className="transition-all duration-700 hover:scale-105"
                priority
              />
              {/* Fade out mask */}
              <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white via-white/40 to-transparent z-10" />
            </div>
          </div>

          {/* Dark Blue Base Bar */}
          <div className="bg-[#0b1329] text-white px-8 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium tracking-wide border-t border-zinc-800">
            <div className="flex items-center gap-2">
              {/* Mini hand-flower logo */}
              <img 
                src="/hsf-official-logo.png" 
                alt="HSF Logo" 
                className="w-5 h-5 object-contain" 
              />
              <span className="text-zinc-300">
                <span className="text-[#f97316] font-semibold">Together for Change.</span>{" "}
                <span className="text-cyan-400 font-semibold">Together for Humanity.</span>
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-emerald-400" style={{ animation: "spin 12s linear infinite" }} />
              <span className="text-zinc-200">Creating Impact. Building Futures.</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          
          {/* SOS Panel */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-8 relative overflow-hidden flex flex-col justify-between shadow-sm">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#ea580c]/30 to-transparent" />
            
            <div className="text-center">
              <h2 className="text-lg font-bold font-mono tracking-tight text-zinc-900 mb-1">Emergency SOS Channel</h2>
              <p className="text-xs text-zinc-650 mb-8">One tap broadcasts coordinates to emergency contacts and dispatch loops.</p>
            </div>

            <div className="flex justify-center my-6 relative">
              {sosStatus === "active" && (
                <div className="absolute inset-0 bg-[#ea580c]/10 rounded-full blur-3xl" />
              )}
              
              <button 
                onClick={handleSOS} 
                disabled={sosStatus !== "idle"}
                className={`relative z-10 w-44 h-44 rounded-full border-4 flex flex-col items-center justify-center text-zinc-900 font-bold transition-all duration-300 ${
                  sosStatus === "idle" 
                    ? "bg-zinc-50 border-[#ea580c] hover:bg-black hover:text-white hover:border-[#eab308] hover:scale-105 hover:shadow-[0_0_30px_rgba(234,88,12,0.2)] cursor-pointer" 
                    : sosStatus === "active" 
                      ? "bg-[#ea580c] border-[#eab308] text-white animate-pulse cursor-not-allowed" 
                      : "bg-zinc-100 border-zinc-300 cursor-wait text-zinc-400"
                }`}
              >
                {sosStatus === "idle" && (
                  <>
                    <AlertTriangle className="h-8 w-8 text-[#ea580c] mb-2 group-hover:text-white" />
                    <span className="text-sm font-mono tracking-wider">TRIGGER SOS</span>
                  </>
                )}
                {sosStatus === "locating" && <span className="text-xs font-mono text-zinc-500 animate-pulse">LOCATING...</span>}
                {sosStatus === "sending" && <span className="text-xs font-mono text-zinc-500 animate-pulse">BROADCASTING...</span>}
                {sosStatus === "active" && (
                  <>
                    <Shield className="h-8 w-8 text-white mb-2" />
                    <span className="text-xs font-mono text-white tracking-wider">SOS ACTIVE</span>
                  </>
                )}
              </button>
            </div>

            <div className="space-y-4">
              {sosStatus === "active" && (
                <p className="text-[#ea580c] text-xs font-mono text-center font-bold">Alert packet dispatched successfully.</p>
              )}
              {location && (
                <p className="text-[10px] text-zinc-600 font-mono flex items-center justify-center gap-1">
                  <MapPin className="h-3 w-3 text-zinc-400" />
                  {location.lat.toFixed(5)}, {location.lng.toFixed(5)}
                </p>
              )}
              {sosError && <p className="text-[#ea580c] text-xs text-center font-mono font-bold">{sosError}</p>}
              
              {sosStatus === "active" && (
                <div className="flex justify-center">
                  <button 
                    onClick={() => { setSosStatus("idle"); setLocation(null); }} 
                    className="h-8 px-4 border border-zinc-200 hover:border-zinc-450 hover:bg-zinc-50 text-xs font-mono rounded-lg transition-colors text-zinc-700"
                  >
                    Cancel Alert
                  </button>
                </div>
              )}
              
              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 text-center">
                <p className="text-[10px] leading-relaxed text-zinc-650">
                  <strong className="text-zinc-800 font-bold">Safety Disclaimer:</strong> This system assists in tracking and routing but does not replace national emergency response numbers. Always dial police forces directly when immediate physical assistance is needed.
                </p>
              </div>
            </div>
          </div>

          {/* Emergency Contacts List */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-8 flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-zinc-200">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-[#ea580c]" />
                  <h2 className="text-sm font-bold font-mono tracking-tight text-zinc-900">Guardian Directory</h2>
                </div>
                <button 
                  onClick={() => setShowAddContact(!showAddContact)} 
                  className="h-8 px-3 border border-zinc-200 rounded-lg text-xs font-mono text-[#ea580c] hover:bg-[#ea580c] hover:text-white transition-colors flex items-center gap-1"
                >
                  <Plus className="h-3.5 w-3.5" />
                  {showAddContact ? "Close" : "Add"}
                </button>
              </div>

              <AnimatePresence>
                {showAddContact && (
                  <motion.form 
                    initial={{ opacity: 0, height: 0 }} 
                    animate={{ opacity: 1, height: "auto" }} 
                    exit={{ opacity: 0, height: 0 }}
                    onSubmit={handleAddContact} 
                    className="mb-6 space-y-3 overflow-hidden"
                  >
                    <input name="name" required placeholder="Full Name *" className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-2.5 text-zinc-800 text-xs focus:outline-none focus:border-[#ea580c] transition-all font-mono" />
                    <input name="phone" placeholder="Phone Number" className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-2.5 text-zinc-800 text-xs focus:outline-none focus:border-[#ea580c] transition-all font-mono" />
                    <input name="email" type="email" placeholder="Email Address" className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-2.5 text-zinc-800 text-xs focus:outline-none focus:border-[#ea580c] transition-all font-mono" />
                    {contactError && <p className="text-[#ea580c] text-[10px] font-mono font-bold">{contactError}</p>}
                    <Button type="submit" isLoading={contactLoading} className="w-full bg-black hover:bg-[#ea580c] text-white text-xs py-2 rounded-lg font-bold transition-all">Save Contact</Button>
                  </motion.form>
                )}
              </AnimatePresence>

              {contacts.length === 0 ? (
                <div className="text-center py-12 text-zinc-400">
                  <Users className="h-8 w-8 mx-auto mb-3 opacity-25" />
                  <p className="text-xs">No emergency contacts added yet.</p>
                  <p className="text-[10px] mt-1">{"Add trusted contacts who'll be alerted during SOS."}</p>
                </div>
              ) : (
                <ul className="space-y-3">
                  {contacts.map(c => (
                    <li key={c.id} className="flex items-start justify-between p-4 bg-zinc-50/50 rounded-xl border border-zinc-200">
                      <div>
                        <p className="font-bold text-xs text-zinc-800">{c.name}</p>
                        {c.phone && <p className="text-zinc-650 text-[10px] flex items-center gap-1 mt-1 font-mono"><Phone className="h-3 w-3 text-zinc-400" />{c.phone}</p>}
                        {c.email && <p className="text-zinc-650 text-[10px] flex items-center gap-1 mt-1 font-mono"><Mail className="h-3 w-3 text-zinc-400" />{c.email}</p>}
                      </div>
                      <button onClick={() => handleDeleteContact(c.id)} className="p-1.5 text-zinc-400 hover:text-[#ea580c] transition-colors cursor-pointer"><Trash2 className="h-4 w-4" /></button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            
            <div className="text-[10px] text-zinc-650 font-mono mt-4 text-center">
              Total Active Guardian Registrations: {contacts.length}
            </div>
          </div>
        </div>

        {/* Feature 2: Live Radar Demo */}
        <div className="mb-16 border-t border-zinc-200 pt-16">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-zinc-50 border border-zinc-200">
              <Shield className="h-5 w-5 text-[#ea580c]" />
            </div>
            <h2 className="text-lg font-bold font-mono tracking-tight text-zinc-900">Live Telemetry Simulation Radar</h2>
            <span className="text-[9px] font-mono px-2 py-0.5 bg-[#eab308]/15 text-[#ea580c] rounded-full border border-[#ea580c]/20 animate-pulse uppercase font-bold">Active</span>
          </div>
          <p className="text-zinc-650 text-xs mb-8 ml-12">
            Simulates raw hardware coordinate stream broadcasts using client-side network socket signals.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Map wrapper */}
            <div className="lg:col-span-2 h-80 rounded-xl overflow-hidden border border-zinc-200 relative bg-zinc-50">
              <VehicleMap telemetryData={radarTelemetry} />
              {!radarRunning && (
                <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-10">
                  <button
                    onClick={() => setRadarRunning(true)}
                    className="flex items-center gap-2 px-5 h-11 bg-black hover:bg-[#ea580c] text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-md transition-all border border-zinc-800"
                  >
                    <Play className="w-4 h-4 text-[#eab308]" /> Launch Live Radar
                  </button>
                </div>
              )}
              {radarRunning && (
                <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-black border border-zinc-700 px-3 py-1.5 rounded-lg shadow-md text-white">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ea580c] animate-pulse" />
                  <span className="text-[10px] font-mono text-[#eab308] font-bold tracking-wider">LIVE TELEMETRY STREAM</span>
                </div>
              )}
            </div>

            {/* Sidebar stats */}
            <div className="flex flex-col gap-4">
              <div className="bg-white border border-zinc-200 p-5 rounded-xl flex-1 flex flex-col justify-between shadow-sm">
                <div>
                  <h3 className="text-xs font-mono font-bold text-zinc-800 mb-4 border-b border-zinc-100 pb-2">Vehicle Diagnostics</h3>
                  {radarRunning ? (
                    <div className="space-y-3 font-mono text-xs">
                      {[
                        { label: "Velocity", value: `${radarState.speed} km/h`, color: "text-[#ea580c]" },
                        { label: "Battery Charge", value: `${radarState.battery}%`, color: "text-zinc-800" },
                        { label: "Signal strength", value: `${radarState.signal} bars`, color: "text-zinc-800" },
                        { label: "Failsafe Flag", value: "OK", color: "text-[#ea580c]" },
                      ].map(s => (
                        <div key={s.label} className="flex justify-between items-center">
                          <span className="text-zinc-600 text-[10px]">{s.label}</span>
                          <span className={`font-bold ${s.color}`}>{s.value}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-zinc-600 text-xs leading-relaxed">
                      Initialize stream tracking to process live coordinate diagnostic packages.
                    </p>
                  )}
                </div>

                {radarRunning && (
                  <div className="pt-4 border-t border-zinc-200 mt-4">
                    <button
                      onClick={() => { setRadarRunning(false); setRadarTelemetry([]); }}
                      className="text-[10px] font-mono text-zinc-650 hover:text-zinc-800 transition-colors uppercase tracking-wider"
                    >
                      Disable Socket Stream
                    </button>
                  </div>
                )}
              </div>

              <a
                href="/admin/suraksha/sandbox"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 bg-zinc-50 border border-zinc-200 hover:border-[#ea580c]/30 rounded-xl transition-all group shadow-sm hover:bg-zinc-100/50"
              >
                <div>
                  <p className="text-xs font-bold text-zinc-800">Diagnostics Sandbox</p>
                  <p className="text-[10px] text-zinc-600 mt-0.5">Simulate custom socket failures</p>
                </div>
                <ExternalLink className="w-4 h-4 text-zinc-400 group-hover:text-[#ea580c] transition-colors" />
              </a>
            </div>
          </div>
        </div>

        {/* HSF Suraksha QR */}
        <div className="mb-16 border-t border-zinc-200 pt-16">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-zinc-50 border border-zinc-200">
              <QrCode className="h-5 w-5 text-[#ea580c]" />
            </div>
            <h2 className="text-lg font-bold font-mono tracking-tight text-zinc-900 font-bold">HSF Suraksha QR</h2>
            <span className="text-[9px] font-mono px-2 py-0.5 bg-[#eab308]/15 text-[#ea580c] rounded-full border border-[#ea580c]/20 uppercase font-bold">Failsafe active</span>
          </div>
          <p className="text-zinc-650 text-xs mb-8 ml-12">Register public transit identifiers to establish active loop tracking matrices before boarding.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Input card */}
            <div className="bg-white border border-zinc-200 rounded-2xl p-6 flex flex-col justify-between shadow-sm">
              <div>
                <h3 className="font-bold text-xs font-mono text-zinc-850 mb-4 flex items-center gap-2">
                  <QrCode className="h-4.5 w-4.5 text-[#ea580c]" /> Verify Transit Identity
                </h3>
                
                {!vehicle && tripStatus === "idle" && (
                  <form onSubmit={handleManualLookup} className="mb-4">
                    <div className="flex gap-2">
                      <input 
                        name="qr_code" 
                        required 
                        placeholder="e.g. A1B2C3D4" 
                        className="flex-1 bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-2.5 text-xs text-zinc-800 focus:outline-none focus:border-[#ea580c] transition-colors uppercase font-mono tracking-widest" 
                      />
                      <button type="submit" className="h-9 px-4 bg-black hover:bg-[#ea580c] text-white rounded-lg text-xs font-bold font-mono uppercase tracking-wider transition-all">
                        Search
                      </button>
                    </div>
                    <p className="text-[10px] text-zinc-600 mt-3 font-mono">Verify transit registration index to begin.</p>
                  </form>
                )}

                {vehicleError && <p className="text-[#ea580c] text-xs font-mono mb-4 font-bold">{vehicleError}</p>}

                {vehicle && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-zinc-50 border border-zinc-200 rounded-lg mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Car className="h-4.5 w-4.5 text-[#ea580c]" />
                      <p className="text-xs font-bold text-[#ea580c] font-mono uppercase tracking-wider">Registration Verified</p>
                    </div>
                    <p className="text-xs text-zinc-800 mt-1 font-mono"><span className="text-zinc-600">Driver Name:</span> {vehicle.driver_name}</p>
                    <p className="text-xs text-zinc-800 mt-1 font-mono"><span className="text-zinc-600">License Plate:</span> {vehicle.vehicle_number}</p>
                  </motion.div>
                )}
              </div>

              {tripStatus === "idle" && vehicle && (
                <div className="space-y-3">
                  <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-lg">
                    <h4 className="text-xs font-bold text-zinc-800 font-mono mb-1 flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-[#ea580c]" /> Tracking Consents</h4>
                    <p className="text-[10px] leading-relaxed text-zinc-600">
                      By initiating the tracking logs, you authorize coordinates broadcasting. safety microphones are fully encrypted.
                    </p>
                  </div>
                  
                  <button onClick={() => handleStartTrip(false)} disabled={tripLoading}
                    className="w-full py-2.5 bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-800 font-bold rounded-lg text-xs uppercase tracking-wider font-mono transition-all">
                    Activate GPS Tracking
                  </button>

                  <button onClick={() => handleStartTrip(true)} disabled={tripLoading}
                    className="w-full py-2.5 bg-[#ea580c] hover:bg-black text-white font-bold rounded-lg text-xs uppercase tracking-wider font-mono flex flex-col items-center justify-center transition-all border border-[#ea580c]">
                    <span>Activate GPS + Audio Loop</span>
                  </button>
                  {tripLoading && <p className="text-center text-[10px] text-[#ea580c] font-mono animate-pulse font-bold">Initializing log channels...</p>}
                  {tripError && <p className="text-center text-xs text-[#ea580c] font-mono font-bold">{tripError}</p>}
                </div>
              )}

              {tripStatus === "active" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  <div className="flex items-center gap-2 p-3 bg-[#eab308]/10 border border-[#eab308]/20 rounded-lg text-xs">
                    <div className="w-2 h-2 rounded-full bg-[#ea580c] animate-pulse" />
                    <p className="text-[#ea580c] font-mono font-bold">GPS Loop active — guardians synced</p>
                  </div>
                  
                  <a 
                    href={`/track/${tripId}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full py-2.5 bg-black hover:bg-[#ea580c] border border-zinc-850 rounded-lg text-xs text-white font-mono font-bold flex justify-center items-center gap-2 transition-all"
                  >
                    <MapPin className="h-4 w-4 text-[#eab308]" /> Open Coordinates Console
                  </a>

                  <button onClick={handleEndTrip} className="w-full py-2 border border-zinc-200 text-zinc-600 hover:text-zinc-800 text-xs font-mono rounded-lg transition-colors">Terminate GPS Log</button>
                </motion.div>
              )}

              {tripStatus === "completed" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 p-3 bg-zinc-50 border border-zinc-200 rounded-lg text-xs">
                  <CheckCircle className="h-4 w-4 text-[#ea580c]" />
                  <p className="text-[#ea580c] font-mono font-bold">GPS Loop completed successfully.</p>
                </motion.div>
              )}
            </div>

            {/* How it works card */}
            <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-xs font-mono text-zinc-800 mb-6 flex items-center gap-2">
                <Clock className="h-4.5 w-4.5 text-[#ea580c]" /> Protocol Steps
              </h3>
              <ol className="space-y-5">
                {[
                  { step: "01", title: "Scan Vehicle QR", desc: "Verifies the physical identifier registration index." },
                  { step: "02", title: "Establish Connection", desc: "Coordinates start point mapping vectors." },
                  { step: "03", title: "Alert Guardian Directory", desc: "Dispatches location status logs to directories." },
                  { step: "04", title: "Safe Arrival Termination", desc: "Ends tracking safely once destination vectors match." },
                ].map(item => (
                  <li key={item.step} className="flex gap-4">
                     <div className="w-6 h-6 rounded-lg bg-zinc-50 border border-zinc-200 flex items-center justify-center text-[#ea580c] text-[10px] font-mono font-bold shrink-0 shadow-sm">{item.step}</div>
                     <div>
                       <p className="font-bold text-xs text-zinc-800 font-mono">{item.title}</p>
                       <p className="text-zinc-650 text-[10px] mt-1 leading-relaxed">{item.desc}</p>
                     </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Trip History Grid */}
          {tripHistory.length > 0 && (
            <div className="mt-8">
              <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
                <h3 className="font-semibold text-xs font-mono text-zinc-800 mb-4 flex items-center gap-2"><MapPin className="h-4.5 w-4.5 text-[#ea580c]" /> Database GPS Logs</h3>
                <div className="space-y-3">
                  {tripHistory.map(trip => (
                    <div key={trip.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-zinc-50/50 border border-zinc-200 rounded-xl">
                      <div className="flex items-center gap-3 mb-3 md:mb-0">
                        <div className={`p-2 rounded-lg ${trip.status === 'active' ? 'bg-[#ea580c]/10 text-[#ea580c] border border-[#ea580c]/20' : 'bg-zinc-50 text-zinc-600 border border-zinc-200'}`}>
                          <Car className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-bold text-xs text-zinc-800 font-mono">{trip.vehicles?.vehicle_number || "INDEX NOT VERIFIED"}</p>
                          <p className="text-[10px] text-zinc-650 mt-0.5">{trip.vehicles?.driver_name}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-[10px] font-mono">
                        <div className="text-zinc-650">
                          {new Date(trip.created_at).toLocaleDateString()}
                        </div>
                        <div className={`px-2.5 py-0.5 rounded-md border font-medium uppercase tracking-wider text-[9px] ${trip.status === 'active' ? 'bg-[#ea580c]/10 text-[#ea580c] border-[#ea580c]/20 animate-pulse' : 'bg-zinc-50 text-zinc-600 border-zinc-200'}`}>
                          {trip.status}
                        </div>
                        <a href={`/track/${trip.id}`} className="text-[#ea580c] hover:text-[#eab308] font-bold">Details →</a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Previous Sessions & Campaigns Slider */}
        <div className="mb-16 border-t border-zinc-200 pt-16">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-zinc-50 border border-zinc-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#ea580c]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-lg font-bold font-mono tracking-tight text-zinc-900">Previous Sessions & Campaigns</h2>
            <span className="text-[9px] font-mono px-2 py-0.5 bg-zinc-50 border border-zinc-200 text-zinc-650 rounded-full uppercase">Interactive</span>
          </div>
          <p className="text-zinc-650 text-xs mb-8 ml-12 font-sans font-medium text-zinc-600">On-ground safety awareness workshops led by the Healix Sahyog Foundation.</p>
          
          <div className="relative rounded-2xl border border-zinc-200 bg-zinc-950 overflow-hidden shadow-xl aspect-video md:aspect-[21/9] min-h-[380px] md:min-h-[460px] flex flex-col justify-end">
            {/* Grid Backdrop Mesh */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none z-10" />

            {/* Cinematic slideshow image wrapper */}
            <div className="absolute inset-0 z-0">
              <AnimatePresence mode="wait">
                {galleryPhotos[slideshowIndex] && (
                  <motion.div
                    key={slideshowIndex}
                    initial={{ opacity: 0, scale: 1.04, filter: "blur(6px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, scale: 0.98, filter: "blur(6px)" }}
                    transition={{ duration: 0.7, ease: "easeInOut" }}
                    className="w-full h-full relative"
                  >
                    <img 
                      src={galleryPhotos[slideshowIndex].src} 
                      alt={galleryPhotos[slideshowIndex].caption} 
                      className="w-full h-full object-cover opacity-85"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Gradient shadow overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-transparent z-10 pointer-events-none" />

            {/* Action buttons (Left / Right chevrons) */}
            <div className="absolute top-1/2 -translate-y-1/2 left-4 z-20">
              <button 
                onClick={() => setSlideshowIndex(prev => (prev - 1 + galleryPhotos.length) % galleryPhotos.length)}
                className="w-10 h-10 rounded-full bg-black/60 hover:bg-black border border-white/10 hover:border-[#ea580c] flex items-center justify-center text-white transition-all cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>
            <div className="absolute top-1/2 -translate-y-1/2 right-4 z-20">
              <button 
                onClick={() => setSlideshowIndex(prev => (prev + 1) % galleryPhotos.length)}
                className="w-10 h-10 rounded-full bg-black/60 hover:bg-black border border-white/10 hover:border-[#ea580c] flex items-center justify-center text-white transition-all cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Campaign text info */}
            <div className="relative z-25 p-6 md:p-10 text-left max-w-2xl select-none">
              <div className="inline-flex px-2 py-0.5 border border-[#ea580c]/30 text-[#ea580c] font-mono text-[9px] font-bold uppercase tracking-widest bg-[#ea580c]/10 rounded mb-3">
                HSF Safety Campaign
              </div>
              <h3 className="text-xl md:text-3xl font-black font-mono text-white uppercase tracking-wide leading-tight mb-4 drop-shadow-md">
                {galleryPhotos[slideshowIndex]?.caption}
              </h3>
              
              <button
                onClick={() => setActivePhotoIndex(slideshowIndex)}
                className="h-8 px-4 bg-[#ea580c]/25 hover:bg-[#ea580c] text-white border border-[#ea580c]/40 text-[10px] font-bold uppercase tracking-wider flex items-center justify-center transition-all duration-300 rounded cursor-pointer"
              >
                Inspect High Fidelity Photo
              </button>
            </div>

            {/* Interactive Thumbnail Strip */}
            <div className="absolute bottom-6 right-6 hidden md:flex gap-3.5 z-25">
              {galleryPhotos.map((photo, i) => (
                <button
                  key={i}
                  onClick={() => setSlideshowIndex(i)}
                  className={`w-16 h-11 rounded-lg overflow-hidden border-2 transition-all relative cursor-pointer ${
                    i === slideshowIndex ? "border-[#ea580c] scale-110 shadow-[0_0_12px_rgba(234,88,12,0.4)]" : "border-white/15 opacity-40 hover:opacity-100"
                  }`}
                >
                  <img src={photo.src} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Mobile indicator dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 md:hidden z-25">
              {galleryPhotos.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSlideshowIndex(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    i === slideshowIndex ? "bg-[#ea580c] w-4" : "bg-white/40 w-1.5"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Community Programs */}
        <div className="relative border-t border-zinc-200 pt-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-zinc-50 border border-[#eab308]/30">
              <GraduationCap className="h-5 w-5 text-[#ea580c]" />
            </div>
            <h2 className="text-lg font-bold font-mono tracking-tight text-zinc-900">Empowering Communities with Knowledge</h2>
          </div>
          <p className="text-zinc-650 text-xs mb-8 ml-12">Special 50% discount on all Healix Academy engineering courses for HSF community members.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {academyCourses.slice(0, 3).map(course => (
              <div 
                key={course.id} 
                className="bg-white border border-zinc-250 rounded-xl overflow-hidden group cursor-pointer hover:border-[#ea580c]/30 hover:shadow-md transition-all duration-300 flex flex-col justify-between shadow-sm" 
                onClick={() => router.push(`/academy/course/${course.slug}?discount=shesecure`)}
              >
                <div className="h-48 overflow-hidden relative border-b border-zinc-200 bg-zinc-50">
                  <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover opacity-85 group-hover:opacity-100 group-hover:scale-102 transition-all duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  <div className="absolute top-3 right-3 flex flex-col items-end gap-1">
                    <span className="text-[9px] font-mono px-2 py-0.5 bg-black border border-zinc-700 text-white rounded-full font-bold shadow-sm">50% OFF</span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 z-10">
                    <div className="flex items-center gap-2 mb-2 font-mono">
                      <span className="text-zinc-300 line-through text-[10px]">₹{course.originalPrice}</span>
                      <span className="text-[#eab308] font-bold text-xs">₹{Math.floor(course.price / 2)}</span>
                    </div>
                    <h3 className="font-bold text-xs text-white line-clamp-2 leading-snug font-mono">{course.title}</h3>
                  </div>
                </div>
                <div className="p-4 space-y-4">
                  <p className="text-[11px] text-zinc-650 line-clamp-2 leading-relaxed">{course.shortDescription}</p>
                  <div className="flex items-center gap-1 text-[#ea580c] text-xs font-bold font-mono tracking-wider uppercase group-hover:gap-1.5 transition-all">
                    <span>Enroll Program</span>
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* SVG CTA Banner */}
          <div className="mt-20 relative overflow-hidden rounded-2xl border border-zinc-800 bg-black p-8 md:p-12 shadow-2xl text-white">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#ea580c]/40 to-transparent"/>
            
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column — Content */}
              <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
                <h3 className="text-2xl md:text-4xl font-extrabold font-mono tracking-tight text-white mb-4">
                  Together, We Build Safer Communities
                </h3>
                
                <p className="text-zinc-400 text-xs md:text-sm max-w-xl mb-8 leading-relaxed font-sans">
                  Join thousands of users across India who use HSF for real-time protection, emergency response, and community safety.
                </p>
                
                {/* Dot points list */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-[10px] text-zinc-300 font-mono uppercase tracking-widest mb-8">
                  <div className="flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ea580c] animate-pulse" />
                    <span className="group-hover:text-[#ea580c] transition-colors">Active Network</span>
                  </div>
                  <div className="flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#eab308] animate-pulse" />
                    <span className="group-hover:text-[#eab308] transition-colors">GPS Telemetry</span>
                  </div>
                  <div className="flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    <span className="group-hover:text-zinc-100 transition-colors">SOS Response Dispatch</span>
                  </div>
                </div>

                {/* CTA Button */}
                <a 
                  href="https://www.healix-sahyog.org" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#ea580c] hover:bg-[#ea580c]/90 text-white font-mono text-[11px] font-bold uppercase tracking-wider rounded-xl transition-all duration-300 hover:scale-105 shadow-[0_4px_20px_rgba(234,88,12,0.25)] cursor-pointer select-none"
                >
                  <span>Collab with Us</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>

              {/* Right Column — SVG Illustration */}
              <div className="lg:col-span-5 flex items-center justify-center">
                <svg viewBox="0 0 400 400" className="w-full max-w-[320px] md:max-w-[360px] h-auto select-none drop-shadow-[0_10px_25px_rgba(0,0,0,0.5)]">
                  {/* Background circles */}
                  <circle cx="200" cy="200" r="165" fill="#0891b2" fillOpacity="0.1" />
                  <circle cx="200" cy="200" r="145" fill="#06b6d4" fillOpacity="0.15" />
                  
                  {/* Yellow decorative clouds */}
                  <path d="M85 85c0-10 8-18 18-18s18 8 18 18c0 1.5-.2 3-.5 4.5 3.5-.8 7.5.5 9.5 3.5 2.5 4 1.5 9.5-2.5 12-2 1.5-4.5 2-7 2H85V85z" fill="#eab308" fillOpacity="0.8" />
                  <path d="M285 75c0-10 8-18 18-18s18 8 18 18c0 1.5-.2 3-.5 4.5 3.5-.8 7.5.5 9.5 3.5 2.5 4 1.5 9.5-2.5 12-2 1.5-4.5 2-7 2h-35.5V75z" fill="#eab308" fillOpacity="0.8" />
                  
                  {/* Gear Icon (Right) */}
                  <g transform="translate(335, 145) scale(0.9)" className="text-cyan-400 fill-none stroke-current" strokeWidth="2.5">
                    <circle cx="15" cy="15" r="8" />
                    <path d="M15 2v3M15 25v3M2 15h3M25 15h3" strokeLinecap="round" />
                  </g>
                  
                  {/* Sprig / Leaf Branch (Top Left) */}
                  <path d="M110 85q15 15 25 35" stroke="#10b981" strokeWidth="2" fill="none" strokeLinecap="round" />
                  <circle cx="118" cy="93" r="3" fill="#10b981" />
                  <circle cx="125" cy="102" r="3" fill="#10b981" />
                  <circle cx="131" cy="112" r="3" fill="#10b981" />
                  
                  {/* Pink sprig (Top Right) */}
                  <path d="M270 95q-15 15-25 35" stroke="#ec4899" strokeWidth="2" fill="none" strokeLinecap="round" />
                  <circle cx="262" cy="103" r="3" fill="#ec4899" />
                  <circle cx="255" cy="112" r="3" fill="#ec4899" />
                  <circle cx="249" cy="122" r="3" fill="#ec4899" />

                  {/* Floating dots & plus signs */}
                  <circle cx="180" cy="65" r="3" fill="#ec4899" />
                  <circle cx="245" cy="60" r="4" fill="#eab308" />
                  <circle cx="95" cy="115" r="3" fill="#3b82f6" />
                  <circle cx="310" cy="100" r="2.5" fill="#10b981" />
                  <circle cx="75" cy="190" r="4.5" fill="#0891b2" opacity="0.6" />
                  <circle cx="325" cy="205" r="4" fill="#0891b2" opacity="0.6" />
                  <circle cx="340" cy="275" r="3.5" fill="#a855f7" opacity="0.5" />
                  <circle cx="65" cy="295" r="4.5" fill="#10b981" opacity="0.5" />
                  <path d="M85 260h6m-3-3v6" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M315 250h6m-3-3v6" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                  
                  {/* Center House Element */}
                  {/* Roof */}
                  <path d="M140 185 L200 135 L260 185 Z" fill="#1e3a8a" stroke="#1e3a8a" strokeWidth="2" strokeLinejoin="round" />
                  {/* Left Side */}
                  <path d="M145 185 H200 V245 H145 Z" fill="#0284c7" />
                  {/* Right Side */}
                  <path d="M200 185 H255 V245 H200 Z" fill="#eab308" />
                  {/* Heart circle */}
                  <circle cx="200" cy="210" r="21" fill="white" />
                  {/* Heart shape */}
                  <path d="M200 220c-6-5-10.5-9.5-10.5-13.5 0-3 2-5 5-5 1.7 0 3 1 3.8 2.3.8-1.3 2.1-2.3 3.8-2.3 3 0 5 2 5 5 0 4-4.5 8.5-10.5 13.5z" fill="#ef4444" />

                  {/* --- Characters --- */}
                  
                  {/* 1. Top Person (centered x=200, y=108) */}
                  {/* Shirt */}
                  <path d="M172 142a25 25 0 0 1 56 0l-5 12h-46z" fill="white" />
                  {/* Face & neck */}
                  <rect x="194" y="115" width="12" height="10" fill="#fed7aa" />
                  <circle cx="200" cy="108" r="16" fill="#fed7aa" />
                  {/* Eyes & Smile */}
                  <circle cx="195" cy="105" r="1.2" fill="#1e293b" />
                  <circle cx="205" cy="105" r="1.2" fill="#1e293b" />
                  <path d="M196 112s2 3 4 3 4-3 4-3" stroke="#1e293b" strokeWidth="1.2" fill="none" strokeLinecap="round" />
                  {/* Hair */}
                  <path d="M182 104c3-12 10-24 18-24s15 12 18 24c-5-4-10-6-18-6s-13 2-18 6z" fill="#1e293b" />

                  {/* 2. Left Person (Girl with afro, x=112, y=174) */}
                  {/* Hair background clouds */}
                  <circle cx="95" cy="155" r="16" fill="#0f172a" />
                  <circle cx="125" cy="155" r="16" fill="#0f172a" />
                  <circle cx="110" cy="140" r="18" fill="#0f172a" />
                  <circle cx="90" cy="172" r="15" fill="#0f172a" />
                  <circle cx="130" cy="172" r="15" fill="#0f172a" />
                  {/* Shirt */}
                  <path d="M85 220a22 22 0 0 1 44 0l-4 12H89z" fill="#10b981" />
                  {/* Face & neck */}
                  <rect x="106" y="180" width="8" height="8" fill="#854d0e" />
                  <circle cx="110" cy="174" r="14" fill="#854d0e" />
                  {/* Eyes & Smile */}
                  <circle cx="106" cy="172" r="1.2" fill="white" />
                  <circle cx="114" cy="172" r="1.2" fill="white" />
                  <path d="M106 178s2 2.5 4 2.5 4-2.5 4-2.5" stroke="white" strokeWidth="1.2" fill="none" strokeLinecap="round" />

                  {/* 3. Right Person (Red/pink hair girl, x=288, y=174) */}
                  {/* Hair background */}
                  <circle cx="275" cy="165" r="15" fill="#db2777" />
                  <circle cx="305" cy="165" r="15" fill="#db2777" />
                  <circle cx="290" cy="150" r="17" fill="#db2777" />
                  <path d="M270 172c-5 15 5 40 20 40s25-25 20-40z" fill="#db2777" />
                  {/* Shirt */}
                  <path d="M260 220a22 22 0 0 1 44 0l-4 12h-36z" fill="#f59e0b" />
                  {/* Face & neck */}
                  <rect x="284" y="180" width="8" height="8" fill="#fed7aa" />
                  <circle cx="288" cy="174" r="14" fill="#fed7aa" />
                  {/* Eyes & Smile */}
                  <circle cx="284" cy="172" r="1.2" fill="#1e293b" />
                  <circle cx="292" cy="172" r="1.2" fill="#1e293b" />
                  <path d="M284 178s2 2.5 4 2.5 4-2.5 4-2.5" stroke="#1e293b" strokeWidth="1.2" fill="none" strokeLinecap="round" />

                  {/* 4. Bottom-Left Person (Elderly man with glasses, x=122, y=266) */}
                  {/* Shirt */}
                  <path d="M98 310a22 22 0 0 1 44 0l-4 15h-36z" fill="#93c5fd" />
                  {/* Face & neck */}
                  <rect x="118" y="272" width="8" height="8" fill="#fed7aa" />
                  <circle cx="122" cy="266" r="14" fill="#fed7aa" />
                  {/* White Hair */}
                  <path d="M108 260c0-10 28-10 28 0v2H108z" fill="#e2e8f0" />
                  {/* Glasses */}
                  <circle cx="115" cy="266" r="4.5" stroke="#2563eb" strokeWidth="1.5" fill="none" />
                  <circle cx="129" cy="266" r="4.5" stroke="#2563eb" strokeWidth="1.5" fill="none" />
                  <line x1="120" y1="266" x2="124" y2="266" stroke="#2563eb" strokeWidth="1.5" />
                  {/* Smile */}
                  <path d="M118 272s2 2 4 2 4-2 4-2" stroke="#1e293b" strokeWidth="1" fill="none" strokeLinecap="round" />

                  {/* 5. Bottom-Center Person (Long hair girl, x=200, y=282) */}
                  {/* Back Hair */}
                  <path d="M178 288c-10 15-5 45 10 50s28-10 24-50z" fill="#1e293b" />
                  {/* Shirt */}
                  <path d="M176 325a24 24 0 0 1 48 0l-4 15h-40z" fill="#facc15" />
                  <circle cx="200" cy="327" r="5" fill="#ef4444" />
                  {/* Face & neck */}
                  <rect x="196" y="288" width="8" height="8" fill="#fed7aa" />
                  <circle cx="200" cy="282" r="14" fill="#fed7aa" />
                  {/* Front Hair */}
                  <path d="M186 278c0-8 28-8 28 0v2H186z" fill="#1e293b" />
                  {/* Cheeks & Eyes & Smile */}
                  <circle cx="196" cy="280" r="1" fill="#1e293b" />
                  <circle cx="204" cy="280" r="1" fill="#1e293b" />
                  <circle cx="192" cy="284" r="2" fill="#f43f5e" fillOpacity="0.5" />
                  <circle cx="208" cy="284" r="2" fill="#f43f5e" fillOpacity="0.5" />
                  <path d="M196 286s2 2 4 2 4-2 4-2" stroke="#1e293b" strokeWidth="1.2" fill="none" strokeLinecap="round" />

                  {/* 6. Bottom-Right Person (Purple shirt boy, x=278, y=266) */}
                  {/* Shirt */}
                  <path d="M254 310a22 22 0 0 1 44 0l-4 15h-36z" fill="#c084fc" />
                  {/* Face & neck */}
                  <rect x="274" y="272" width="8" height="8" fill="#fed7aa" />
                  <circle cx="278" cy="266" r="14" fill="#fed7aa" />
                  {/* Hair */}
                  <path d="M264 260c0-10 28-10 28 0v2H264z" fill="#1e293b" />
                  {/* Cheeks & Eyes & Smile */}
                  <circle cx="274" cy="264" r="1" fill="#1e293b" />
                  <circle cx="282" cy="264" r="1" fill="#1e293b" />
                  <circle cx="270" cy="268" r="1.8" fill="#f43f5e" fillOpacity="0.5" />
                  <circle cx="286" cy="268" r="1.8" fill="#f43f5e" fillOpacity="0.5" />
                  <path d="M274 270s2 2 4 2 4-2 4-2" stroke="#1e293b" strokeWidth="1.2" fill="none" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cinematic Gallery Lightbox */}
      <AnimatePresence>
        {activePhotoIndex !== null && galleryPhotos[activePhotoIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/95 backdrop-blur-md p-4 sm:p-8"
            onClick={() => setActivePhotoIndex(null)}
          >
            {/* Close button */}
            <button
              onClick={() => setActivePhotoIndex(null)}
              className="absolute top-4 right-4 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-20"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Slider container */}
            <div className="relative w-full max-w-4xl aspect-[4/3] max-h-[70vh] flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
              
              {/* Previous button */}
              <button
                onClick={() => setActivePhotoIndex((prev) => (prev !== null ? (prev - 1 + galleryPhotos.length) % galleryPhotos.length : null))}
                className="absolute left-2 sm:left-4 p-3 rounded-full bg-black/50 border border-white/10 hover:bg-black hover:border-[#ea580c] text-white transition-colors z-10"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* Active Image */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activePhotoIndex}
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full relative flex items-center justify-center"
                >
                  <img
                    src={galleryPhotos[activePhotoIndex].src}
                    alt={galleryPhotos[activePhotoIndex].caption}
                    className="max-w-full max-h-full object-contain rounded-xl select-none"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Next button */}
              <button
                onClick={() => setActivePhotoIndex((prev) => (prev !== null ? (prev + 1) % galleryPhotos.length : null))}
                className="absolute right-2 sm:right-4 p-3 rounded-full bg-black/50 border border-white/10 hover:bg-black hover:border-[#ea580c] text-white transition-colors z-10"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Caption & Indicators */}
            <div className="text-center mt-6 max-w-xl px-4 z-10" onClick={(e) => e.stopPropagation()}>
              <p className="text-white text-base font-bold font-mono tracking-wide uppercase mb-2">
                {galleryPhotos[activePhotoIndex].caption}
              </p>
              <div className="flex justify-center gap-2 mt-4">
                {galleryPhotos.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActivePhotoIndex(i)}
                    className={`w-2 h-2 rounded-full transition-all duration-355 ${
                      i === activePhotoIndex ? "bg-[#ea580c] w-6" : "bg-white/30 hover:bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

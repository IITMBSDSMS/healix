"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Globe, Building2, Heart, Cpu, Layers, Award, ArrowRight, 
  ChevronLeft, ChevronRight, Play, Pause, User, MapPin, Activity, ShieldAlert
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

// Cinematic preloaded institutions data
const INSTITUTIONS = [
  {
    id: "aiims-delhi",
    name: "AIIMS Delhi",
    city: "New Delhi",
    facility: "Healix Clinical Diagnostics Hub",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1200&auto=format&fit=crop",
    description: "Serves as the primary clinical validation center. Focuses on real-time telemetry analytics, cardiovascular risk profiling, and patient diagnostics testing workflows.",
    mentors: [
      { name: "Dr. Amitabha Bandyopadhyay", role: "Clinical Genetics Consultant", photo: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=200&auto=format&fit=crop" },
      { name: "Dr. Randeep Guleria", role: "Pulmonology Lead & Telemetry Advisor", photo: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=200&auto=format&fit=crop" }
    ],
    projects: ["Cardio Diagnostics AI", "Rural Outreach Telemetry Node", "Low-latency SOS Integration"]
  },
  {
    id: "iit-delhi",
    name: "IIT Delhi",
    city: "New Delhi",
    facility: "Genomics Compute Center",
    image: "https://images.unsplash.com/photo-1590012314607-cda9d9b6a9a9?q=80&w=1200&auto=format&fit=crop",
    description: "Hosts the distributed genomic sequence compute cluster. Drives explainable machine learning models for risk analysis and DNA sequence validation.",
    mentors: [
      { name: "Prof. James Gomes", role: "Biomedical Engineering Chair", photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop" },
      { name: "Dr. Sonia Gandhi", role: "Neurogenomics Research Fellow", photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop" }
    ],
    projects: ["Distributed DNA Sequence Models", "Explainable Risk Prediction Pipeline", "HPC Clusters Cluster-1"]
  },
  {
    id: "iit-madras",
    name: "IIT Madras",
    city: "Chennai",
    facility: "Clinical Systems Research Lab",
    image: "https://images.unsplash.com/photo-1562774053-4ab90860b27e?q=80&w=1200&auto=format&fit=crop",
    description: "Specializes in clinical IoT hardware architecture. Integrates hardware sensory fail-safes and edge network coordinates tracking arrays.",
    mentors: [
      { name: "Prof. Guhan Jayaraman", role: "Biotechnology Director", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop" },
      { name: "Dr. K. VijayRaghavan", role: "Computational Biology Advisor", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop" }
    ],
    projects: ["Sensor Failsafe Telemetry Systems", "Low-latency Edge Sockets", "SheSecure Emergency Gateway"]
  },
  {
    id: "iit-bombay",
    name: "IIT Bombay",
    city: "Mumbai",
    facility: "Public Health Biosensors Hub",
    image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1200&auto=format&fit=crop",
    description: "Develops bio-sensory diagnostic hardware. Specializes in low-cost paper diagnostic sensors and secure telemetry transmitters.",
    mentors: [
      { name: "Prof. Rohit Srivastava", role: "Biosensors Innovation Chair", photo: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=200&auto=format&fit=crop" },
      { name: "Dr. Deepa Bhartiya", role: "Stem Cell Biology Fellow", photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&auto=format&fit=crop" }
    ],
    projects: ["Paper Biosensor Transmitters", "Autonomous Health Sync Protocol", "Urban Telemetry Hubs"]
  },
  {
    id: "iisc-bangalore",
    name: "IISc Bangalore",
    city: "Bengaluru",
    facility: "Molecular Dynamics & Biochemistry Hub",
    image: "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?q=80&w=1200&auto=format&fit=crop",
    description: "Focuses on advanced biochemical dynamics, CRISPR off-target mutation models, and high-reliability data integration failsafes.",
    mentors: [
      { name: "Prof. Sandeep Verma", role: "Chemical Biology Lead", photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200&auto=format&fit=crop" },
      { name: "Dr. G. Padmanaban", role: "Biochemistry Advisor", photo: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=200&auto=format&fit=crop" }
    ],
    projects: ["CRISPR Mutation Analytics", "Molecular Simulation Telemetry", "High-reliability DB Failsafes"]
  }
];

// Top Engineering Institutions logos and details
const ENGINEERING_INSTITUTIONS = [
  {
    name: "IIT Delhi",
    logo: "https://upload.wikimedia.org/wikipedia/en/f/fd/IIT_Delhi_Logo.svg",
    fallbackText: "IITD",
    teamName: "Genomics Systems Group",
    specialization: "AI Diagnostics & Genomics Arrays"
  },
  {
    name: "IIT Bombay",
    logo: "https://upload.wikimedia.org/wikipedia/en/1/1d/Indian_Institute_of_Technology_Bombay_Logo.svg",
    fallbackText: "IITB",
    teamName: "Sensors & Telemetry Labs",
    specialization: "IoT Systems & Emergency Telemetry"
  },
  {
    name: "IIT Madras",
    logo: "https://upload.wikimedia.org/wikipedia/en/8/81/Indian_Institute_of_Technology_Madras_Logo.svg",
    fallbackText: "IITM",
    teamName: "Distributed Hardware Unit",
    specialization: "Edge Node Security & Socket Protocols"
  },
  {
    name: "IISc Bangalore",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/f/f9/Indian_Institute_of_Science_logo.svg/440px-Indian_Institute_of_Science_logo.svg.png",
    fallbackText: "IISc",
    teamName: "Bio-Computation Center",
    specialization: "Molecular Modeling & Failsafe DBs"
  }
];

export default function GlobalNetworkPage() {
  const [professionals, setProfessionals] = useState<any[]>([]);
  const [loadingProfs, setLoadingProfs] = useState(true);

  // Cinematic Institutional Section State
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const slideTimer = useRef<NodeJS.Timeout | null>(null);

  // Load dynamic professionals list
  useEffect(() => {
    const fetchProfs = async () => {
      try {
        const res = await fetch("/api/professionals");
        if (res.ok) {
          const data = await res.json();
          setProfessionals(data);
        }
      } catch (err) {
        console.error("Failed to load healthcare professionals:", err);
      } finally {
        setLoadingProfs(false);
      }
    };
    fetchProfs();
  }, []);

  // Cinematic Slide Auto-Rotation Effect
  useEffect(() => {
    if (isPlaying) {
      slideTimer.current = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % INSTITUTIONS.length);
      }, 6000);
    }
    return () => {
      if (slideTimer.current) clearInterval(slideTimer.current);
    };
  }, [isPlaying]);

  const handleNextSlide = () => {
    setIsPlaying(false);
    setActiveIndex((prev) => (prev + 1) % INSTITUTIONS.length);
  };

  const handlePrevSlide = () => {
    setIsPlaying(false);
    setActiveIndex((prev) => (prev - 1 + INSTITUTIONS.length) % INSTITUTIONS.length);
  };

  const currentInstitution = INSTITUTIONS[activeIndex];

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#ea580c]/20 py-20 overflow-x-hidden font-sans">
      
      {/* Background radial spotlights & mesh grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(234,88,12,0.04)_0%,transparent_50%)] pointer-events-none" />
      
      <div className="max-w-[94%] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-24">
        
        {/* HEADER */}
        <div className="text-center pt-8 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 mb-6 animate-pulse">
            <Globe className="h-4 w-4 text-[#ea580c]" />
            <span className="text-[10px] font-mono text-[#ea580c] uppercase tracking-widest font-bold">Collaborative Network</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black font-mono uppercase tracking-tight mb-6 bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent">
            Global <span className="text-[#ea580c]">Network</span>
          </h1>
          <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
            Connecting Healix's medical diagnostic systems, distributed edge telemetry, and genomic accelerator pipelines with premium clinical professionals and research institutions across India.
          </p>
        </div>

        {/* SECTION 1: HEALTHCARE PROFESSIONALS (Editable/Server-driven) */}
        <div>
          <div className="flex items-end justify-between border-b border-zinc-800 pb-4 mb-10">
            <div>
              <p className="text-[10px] font-mono text-[#ea580c] uppercase tracking-widest font-bold flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-[#ea580c]" /> Medical Board
              </p>
              <h2 className="text-xl md:text-3xl font-black font-mono uppercase mt-1 text-white">Healthcare Professionals</h2>
            </div>
            <span className="text-[10px] font-mono text-zinc-500 uppercase font-bold tracking-wider hidden sm:block">
              Server-Verified Registry
            </span>
          </div>

          {loadingProfs ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-10 h-10 border-2 border-orange-500/30 border-t-[#ea580c] rounded-full animate-spin mb-3" />
              <p className="text-zinc-500 text-xs font-mono uppercase tracking-widest">Accessing Professional Registry...</p>
            </div>
          ) : professionals.length === 0 ? (
            <div className="text-center py-16 bg-white/[0.01] border border-zinc-800/60 rounded-2xl">
              <User className="w-8 h-8 text-zinc-600 mx-auto mb-3" />
              <p className="text-sm font-mono text-zinc-400 uppercase font-bold">No Professionals Registered</p>
              <p className="text-xs text-zinc-650 mt-1">Please register professionals in the admin panel.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {professionals.map((p, idx) => (
                <GlassCard 
                  key={p.id || idx} 
                  className="p-6 flex flex-col justify-between border border-zinc-800/80 bg-zinc-950/60 rounded-2xl shadow-lg hover:border-[#ea580c]/30 hover:shadow-orange-500/[0.02] hover:-translate-y-1 transition-all group duration-300"
                >
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl border border-zinc-800 bg-[#111] overflow-hidden relative shrink-0">
                        {p.photo_url ? (
                          <img src={p.photo_url} alt={p.name} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#ea580c] font-black text-xl bg-orange-500/5">{p.name?.[0]}</div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-mono text-[#ea580c] uppercase font-bold tracking-wider">{p.role}</p>
                        <h3 className="text-base font-bold text-white uppercase truncate font-mono mt-0.5">{p.name}</h3>
                        <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-wide truncate flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-[#ea580c]" /> {p.institution}
                        </p>
                      </div>
                    </div>
                    <div className="bg-white/[0.02] p-4 rounded-xl border border-white/[0.04]">
                      <p className="text-xs text-zinc-400 leading-relaxed font-sans line-clamp-4">
                        {p.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-zinc-900 text-[10px] font-mono text-zinc-500">
                    <span className="uppercase font-bold tracking-widest flex items-center gap-1 text-emerald-500">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" /> Active Consultant
                    </span>
                    <span className="uppercase tracking-wider">Node Verified</span>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}
        </div>

        {/* SECTION 2: BIOLABS RESEARCH FACILITIES (Mentors & Researchers - Cinematic Mode) */}
        <div>
          <div className="flex items-end justify-between border-b border-zinc-800 pb-4 mb-10">
            <div>
              <p className="text-[10px] font-mono text-[#ea580c] uppercase tracking-widest font-bold flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-[#ea580c]" /> BioLabs Subsystems
              </p>
              <h2 className="text-xl md:text-3xl font-black font-mono uppercase mt-1 text-white">Research Facilities</h2>
            </div>
            
            {/* Cinematic slide toggles */}
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800 transition-colors text-zinc-400 hover:text-white cursor-pointer"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>
              <button 
                onClick={handlePrevSlide}
                className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800 transition-colors text-zinc-400 hover:text-white cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={handleNextSlide}
                className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800 transition-colors text-zinc-400 hover:text-white cursor-pointer"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Cinematic Wide Viewer */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Left: Tab Selectors */}
            <div className="lg:col-span-4 flex flex-col gap-3 justify-center">
              {INSTITUTIONS.map((inst, idx) => {
                const isActive = idx === activeIndex;
                return (
                  <button
                    key={inst.id}
                    onClick={() => {
                      setIsPlaying(false);
                      setActiveIndex(idx);
                    }}
                    className={`text-left px-5 py-4 border rounded-xl transition-all duration-300 flex items-center justify-between ${
                      isActive 
                        ? "bg-gradient-to-r from-orange-500/10 to-transparent border-[#ea580c] translate-x-2 shadow-[0_0_15px_rgba(234,88,12,0.05)]" 
                        : "bg-zinc-950/40 border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-900/30"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg border ${isActive ? "text-[#ea580c] border-[#ea580c]/30 bg-[#ea580c]/10" : "text-zinc-600 border-zinc-850"}`}>
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className={`font-mono text-sm uppercase tracking-wide ${isActive ? "text-white font-bold" : "text-zinc-400"}`}>{inst.name}</h3>
                        <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mt-0.5">{inst.facility}</p>
                      </div>
                    </div>
                    <ArrowRight className={`w-4 h-4 transition-transform duration-300 ${isActive ? "text-[#ea580c] translate-x-1" : "text-zinc-700"}`} />
                  </button>
                );
              })}
            </div>

            {/* Right: Full Cinematic Frame */}
            <div className="lg:col-span-8 relative rounded-2xl overflow-hidden border border-zinc-800/80 bg-zinc-950 shadow-2xl flex flex-col justify-end min-h-[500px]">
              
              {/* Institution Backdrop Image with Zoom transition (Ken Burns effect) */}
              <div className="absolute inset-0 z-0">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentInstitution.id}
                    initial={{ opacity: 0, scale: 1.08 }}
                    animate={{ opacity: 0.35, scale: 1.02 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${currentInstitution.image})` }}
                  />
                </AnimatePresence>
                {/* Visual grid backdrop & dark gradient scanlines overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent pointer-events-none" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_0%,#050505_95%)] pointer-events-none" />
                <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:100%_4px] opacity-40 pointer-events-none" />
              </div>

              {/* Institution Showcase Info */}
              <div className="relative z-10 p-8 space-y-6 max-w-4xl text-left">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[10px] font-mono font-bold tracking-wider text-[#ea580c] uppercase">
                    <MapPin className="w-3.5 h-3.5" /> {currentInstitution.city}
                    <span>•</span>
                    <Activity className="w-3.5 h-3.5 animate-pulse" /> Facility Active
                  </div>
                  <h3 className="text-2xl md:text-4xl font-mono font-black uppercase text-white tracking-tight">{currentInstitution.name}</h3>
                  <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest">{currentInstitution.facility}</p>
                </div>

                <p className="text-zinc-300 text-xs md:text-sm leading-relaxed max-w-2xl font-sans">
                  {currentInstitution.description}
                </p>

                {/* Sub Section: Mentors & Researchers */}
                <div className="border-t border-zinc-800 pt-5">
                  <p className="text-[10px] font-mono text-[#ea580c] uppercase tracking-widest font-bold mb-4">Affiliated Mentors & Researchers</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {currentInstitution.mentors.map((m, idx) => (
                      <div key={idx} className="flex items-center gap-3 bg-white/[0.02] border border-white/[0.04] p-3 rounded-xl hover:bg-white/[0.04] transition-colors">
                        <div className="w-10 h-10 rounded-lg overflow-hidden border border-zinc-800 shrink-0">
                          <img src={m.photo} alt={m.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-xs text-white uppercase font-mono truncate">{m.name}</h4>
                          <p className="text-[9px] text-zinc-500 truncate mt-0.5">{m.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Active BioLabs Research Projects */}
                <div className="flex flex-wrap gap-2 pt-2 border-t border-zinc-900">
                  {currentInstitution.projects.map((proj, idx) => (
                    <span key={idx} className="px-2.5 py-1 bg-[#ea580c]/10 border border-[#ea580c]/20 text-[#ea580c] font-mono text-[9px] font-bold uppercase tracking-wider rounded">
                      {proj}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: ENGINEERS SECTION (IITs and IISc Logos & active streams) */}
        <div>
          <div className="flex items-end justify-between border-b border-zinc-800 pb-4 mb-10">
            <div>
              <p className="text-[10px] font-mono text-[#ea580c] uppercase tracking-widest font-bold flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-[#ea580c]" /> Technical Infrastructure
              </p>
              <h2 className="text-xl md:text-3xl font-black font-mono uppercase mt-1 text-white">Engineers Section</h2>
            </div>
            <span className="text-[10px] font-mono text-zinc-500 uppercase font-bold tracking-wider hidden sm:block">
              Distributed Hardware Nodes
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ENGINEERING_INSTITUTIONS.map((eng, idx) => (
              <GlassCard 
                key={idx} 
                className="p-6 bg-zinc-950/40 border border-zinc-800/80 rounded-2xl flex flex-col justify-between min-h-[220px] hover:border-zinc-700 transition-colors group cursor-pointer"
              >
                {/* Logo Frame rendering online logos with fallback */}
                <div className="w-16 h-16 border border-zinc-850 bg-white flex flex-col items-center justify-center rounded-xl shadow-sm relative group overflow-hidden mb-5">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.01)_0%,transparent_70%)]" />
                  {eng.logo ? (
                    <img 
                      src={eng.logo} 
                      alt={eng.name} 
                      className="w-11 h-11 object-contain p-1"
                      onError={(e) => {
                        // Image load fallback helper
                        e.currentTarget.style.display = "none";
                        const sib = e.currentTarget.nextElementSibling as HTMLElement;
                        if (sib) sib.style.display = "flex";
                      }}
                    />
                  ) : null}
                  <div className="absolute inset-0 hidden items-center justify-center bg-orange-600 text-white font-mono font-black text-sm uppercase">
                    {eng.fallbackText}
                  </div>
                </div>

                <div>
                  <h3 className="font-mono text-sm font-bold uppercase text-white group-hover:text-[#ea580c] transition-colors">{eng.name}</h3>
                  <p className="text-xs text-[#ea580c] font-mono uppercase font-bold mt-1 tracking-wider">{eng.teamName}</p>
                  <p className="text-[10px] text-zinc-500 leading-relaxed mt-2.5 font-sans">
                    {eng.specialization}
                  </p>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

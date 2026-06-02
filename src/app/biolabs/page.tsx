"use client";

import React, { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { 
  ChevronLeft, ChevronRight, Activity, Cpu, Shield, Database, 
  Microscope, BookOpen, GraduationCap, Users, Network, Dna
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { getBiolabsContent } from "./actions";

// Research Areas (IUAC style)
const researchAreas = [
  { title: "AI in Healthcare", icon: <Cpu className="h-5 w-5 text-[#ea580c]" />, desc: "Predictive diagnostics and generative models for oncology and rare diseases." },
  { title: "Genomics & Sequencing", icon: <Dna className="h-5 w-5 text-[#ea580c]" />, desc: "High-throughput sequencing and personalized genetic medicine profiling." },
  { title: "Safety Systems (IoT)", icon: <Shield className="h-5 w-5 text-[#ea580c]" />, desc: "IoT and behavioral analysis for real-time personal security monitoring." },
  { title: "Data Intelligence", icon: <Database className="h-5 w-5 text-[#ea580c]" />, desc: "Secure interoperability and scalable health data lakes for ML training." },
];

// Facilities
const facilities = [
  "High Performance Computing Lab", "Advanced AI Modeling Clusters", 
  "Predictive Diagnostics Lab", "IoT Device Fabrication Unit",
  "Bio-Informatics Data Center", "Secure Cloud Interoperability Node"
];

export default function BioLabsPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentEvent, setCurrentEvent] = useState(0);

  // Dynamic Data State
  const [dynamicAnnouncements, setDynamicAnnouncements] = useState<any[]>([]);
  const [dynamicEvents, setDynamicEvents] = useState<any[]>([]);
  const [dynamicNews, setDynamicNews] = useState<any[]>([]);
  const [dynamicPhotos, setDynamicPhotos] = useState<any[]>([]);
  const [dynamicPrograms, setDynamicPrograms] = useState<any[]>([]);
  const [dynamicPublications, setDynamicPublications] = useState<any[]>([]);

  useEffect(() => {
    async function fetchDynamicContent() {
      const content = await getBiolabsContent();
      setDynamicAnnouncements(content.announcements);
      setDynamicEvents(content.events);
      setDynamicNews(content.news);
      setDynamicPhotos(content.photos);
      setDynamicPrograms(content.programs);
      
      const serverPubs = (content as any).publications || [];
      let finalPubs = serverPubs;
      
      if (typeof window !== 'undefined') {
        const localPubs = JSON.parse(localStorage.getItem('healix_publications') || '[]');
        if (localPubs.length > 0) {
          finalPubs = [...localPubs, ...serverPubs];
        }
      }
      setDynamicPublications(finalPubs);
    }
    fetchDynamicContent();
  }, []);

  useEffect(() => {
    if (dynamicPhotos.length === 0) return;
    const slideInterval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % dynamicPhotos.length);
    }, 6000);
    return () => clearInterval(slideInterval);
  }, [dynamicPhotos]);

  return (
    <div className="relative min-h-screen bg-white text-zinc-900 font-sans pb-24 selection:bg-yellow-500/20">
      
      {/* Background Grids */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none" />
      <div className="absolute inset-0 bg-dot-pattern opacity-[0.02] pointer-events-none" />

      {/* 1. Announcements Ticker (Bright Orange/Yellow Style) */}
      <div className="relative z-20 w-full bg-zinc-50 border-b border-zinc-200 py-2.5 overflow-hidden flex items-center shadow-sm">
        <div className="flex items-center gap-2 px-5 border-r border-zinc-200 shrink-0 z-10 bg-[#ea580c] text-white py-1 font-mono font-bold text-xs uppercase tracking-wider shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          <span>Announcements</span>
        </div>
        <div className="flex-1 overflow-hidden relative h-5">
          <div className="animate-marquee flex gap-16 text-xs text-zinc-700 font-mono">
            {dynamicAnnouncements.map((announcement, idx) => (
              <span key={idx} className="whitespace-nowrap flex items-center gap-2">
                <span className="text-[#ea580c] font-bold">•</span>
                {announcement.content}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[94%] mx-auto px-4 sm:px-6 lg:px-8 mt-16 relative z-10">
        
        {/* 2. Formal Header */}
        <div className="flex flex-col items-center justify-center text-center mb-16">
          {/* 3D Spinning Logo */}
          <div className="relative flex items-center justify-center mb-8" style={{ width: 180, height: 180 }}>
            {/* Outer orbit ring — rotates on Y axis in 3D */}
            <div
              className="absolute inset-0 rounded-full border-2 border-dashed border-[#ea580c]/25"
              style={{
                animation: "orbitY 6s linear infinite",
                transformStyle: "preserve-3d",
              }}
            />
            {/* Inner orbit ring — counter-rotate */}
            <div
              className="absolute rounded-full border border-[#ea580c]/15"
              style={{
                width: 140,
                height: 140,
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                animation: "orbitY 4s linear infinite reverse",
                transformStyle: "preserve-3d",
              }}
            />
            {/* Glow pulse */}
            <div
              className="absolute rounded-full bg-[#ea580c]/8"
              style={{
                width: 160,
                height: 160,
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                animation: "glowPulse 3s ease-in-out infinite",
              }}
            />
            {/* Logo circle — spins on Y axis */}
            <div
              className="relative z-10 rounded-full bg-white border-2 border-zinc-200 shadow-xl flex items-center justify-center overflow-hidden"
              style={{
                width: 130,
                height: 130,
                animation: "spin3D 8s linear infinite",
                transformStyle: "preserve-3d",
                perspective: "600px",
                boxShadow: "0 0 40px rgba(234,88,12,0.15), 0 8px 32px rgba(0,0,0,0.12)",
              }}
            >
              <Image
                src="/biolabs-logo.png"
                alt="Healix BioLabs"
                width={100}
                height={100}
                className="object-contain p-2"
                style={{ animation: "spin3DCounter 8s linear infinite" }}
              />
            </div>
            {/* Orbiting dot */}
            <div
              className="absolute w-3 h-3 rounded-full bg-[#ea580c] shadow-lg"
              style={{
                top: "50%",
                left: "50%",
                transformOrigin: "0 0",
                animation: "orbitDot 3s linear infinite",
              }}
            />
          </div>

          <style>{`
            @keyframes spin3D {
              0%   { transform: perspective(600px) rotateY(0deg); }
              100% { transform: perspective(600px) rotateY(360deg); }
            }
            @keyframes spin3DCounter {
              0%   { transform: perspective(600px) rotateY(0deg); }
              100% { transform: perspective(600px) rotateY(-360deg); }
            }
            @keyframes orbitY {
              0%   { transform: perspective(400px) rotateY(0deg) rotateX(70deg); }
              100% { transform: perspective(400px) rotateY(360deg) rotateX(70deg); }
            }
            @keyframes glowPulse {
              0%, 100% { opacity: 0.4; transform: translate(-50%, -50%) scale(1); }
              50%       { opacity: 1;   transform: translate(-50%, -50%) scale(1.08); }
            }
            @keyframes orbitDot {
              0%   { transform: translate(-50%, -50%) rotate(0deg)   translateX(88px) rotate(0deg); }
              100% { transform: translate(-50%, -50%) rotate(360deg) translateX(88px) rotate(-360deg); }
            }
          `}</style>

          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#ea580c]/10 border border-[#ea580c]/20 rounded-full text-[#ea580c] text-[10px] font-mono tracking-wider uppercase mb-3">
            Research Accelerator
          </div>
          <h1 className="text-3xl md:text-5xl font-black mb-3 tracking-tight font-mono text-zinc-950 uppercase">Healix BioLabs Accelerator</h1>
          <p className="text-zinc-600 max-w-3xl text-xs md:text-sm uppercase tracking-[0.2em] font-mono">
            Inter-Disciplinary Centre for Advanced Healthcare AI & Safety Systems
          </p>
        </div>

        {/* 3. Hero Slider */}
        <div className="relative w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden mb-20 border border-zinc-200 bg-zinc-50 shadow-lg group/slider">
          {dynamicPhotos.length > 0 && (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0"
              >
                <img 
                  src={dynamicPhotos[currentSlide]?.image_url || '/placeholder.png'} 
                  alt={dynamicPhotos[currentSlide]?.title || 'Photo'} 
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-8 md:p-10 flex flex-col justify-end">
                  <motion.h2 
                    initial={{ y: 15, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-white font-bold text-xl md:text-2xl tracking-tight border-l-3 border-[#ea580c] pl-4 font-mono uppercase"
                  >
                    {dynamicPhotos[currentSlide]?.title}
                  </motion.h2>
                </div>
              </motion.div>
            </AnimatePresence>
          )}
          
          <button 
            onClick={() => setCurrentSlide(prev => {
              const max = Math.max(0, dynamicPhotos.length - 1);
              return prev <= 0 ? max : prev - 1;
            })} 
            className="absolute left-6 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/60 hover:bg-[#ea580c] border border-zinc-800 text-white hover:text-white transition-all rounded-lg flex items-center justify-center cursor-pointer z-20"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button 
            onClick={() => setCurrentSlide(prev => (prev + 1) % Math.max(1, dynamicPhotos.length))} 
            className="absolute right-6 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/60 hover:bg-[#ea580c] border border-zinc-800 text-white hover:text-white transition-all rounded-lg flex items-center justify-center cursor-pointer z-20"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          
          <div className="absolute bottom-6 right-8 flex gap-1.5 z-20">
            {dynamicPhotos.map((_, idx) => (
              <button 
                key={idx} 
                onClick={() => setCurrentSlide(idx)} 
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${idx === currentSlide ? 'bg-yellow-500 w-6' : 'bg-white/40 hover:bg-white/70'}`} 
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-8">
          
          {/* Main Content (Left Column) */}
          <div className="lg:col-span-8 space-y-16">
            
            {/* About Section */}
            <section className="prose max-w-none">
              <div>
                <h2 className="text-lg font-black tracking-tight text-zinc-950 font-mono uppercase flex items-center gap-2">
                  <span className="w-1.5 h-4.5 bg-[#ea580c] inline-block" />
                  About Healix BioLabs
                </h2>
                <div className="w-16 h-1 bg-[#ea580c] mt-2 rounded-full" />
              </div>
              
              <p className="text-zinc-700 leading-relaxed text-justify mb-4 text-xs sm:text-sm mt-6">
                Healix BioLabs was established as a premier inter-disciplinary research centre to provide front-ranking, technology-driven research facilities. Its primary objective is to create possibilities for internationally competitive research in Artificial Intelligence, predictive healthcare, and advanced personal safety systems.
              </p>
              <p className="text-zinc-700 leading-relaxed text-justify text-xs sm:text-sm">
                The Centre has been playing a pivotal role within the innovation ecosystem, where the scientific community and technology visionaries work together in a genuinely multidisciplinary environment. From its founding, Healix BioLabs has been committed to open, rigorous, and intense inquiry.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
                <div className="bg-zinc-50 border border-zinc-200 p-6 rounded-xl hover:shadow-sm transition-all duration-300">
                  <h3 className="text-sm font-bold text-[#ea580c] mb-2 flex items-center gap-2 font-mono uppercase">
                    <span className="w-1.5 h-3 bg-[#ea580c] rounded-full" />
                    Our Vision
                  </h3>
                  <p className="text-xs leading-relaxed text-zinc-600">
                    We open new windows to young minds and strengthen the pool of scientists by building a brighter future through technological understanding and AI-driven biological research.
                  </p>
                </div>
                <div className="bg-zinc-50 border border-zinc-200 p-6 rounded-xl hover:shadow-sm transition-all duration-300">
                  <h3 className="text-sm font-bold text-[#ea580c] mb-2 flex items-center gap-2 font-mono uppercase">
                    <span className="w-1.5 h-3 bg-[#ea580c] rounded-full" />
                    Our Mission
                  </h3>
                  <p className="text-xs leading-relaxed text-zinc-600">
                    In the quest for innovation and capacity building, our mission is to provide necessary powerful computing tools used by scientists to understand the complexities of modern healthcare data.
                  </p>
                </div>
              </div>
            </section>

            {/* Research Areas */}
            <section>
              <div>
                <h2 className="text-lg font-black tracking-tight text-zinc-950 font-mono uppercase flex items-center gap-2">
                  <span className="w-1.5 h-4.5 bg-[#ea580c] inline-block" />
                  Core Research Areas
                </h2>
                <div className="w-16 h-1 bg-[#ea580c] mt-2 rounded-full" />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
                {researchAreas.map((area, idx) => (
                  <div key={idx} className="flex gap-4 p-5 bg-white border border-zinc-200 rounded-xl hover:border-[#ea580c]/30 hover:shadow-sm transition-all duration-300 group">
                    <div className="mt-0.5 p-2 bg-zinc-50 rounded-lg border border-zinc-150 shrink-0 flex items-center justify-center h-10 w-10">{area.icon}</div>
                    <div>
                      <h3 className="font-bold text-xs text-zinc-900 group-hover:text-[#ea580c] transition-colors font-mono uppercase tracking-wide">{area.title}</h3>
                      <p className="text-[11px] text-zinc-700 mt-2 leading-relaxed">{area.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Outreach & Training */}
            <section>
              <div>
                <h2 className="text-lg font-black tracking-tight text-zinc-950 font-mono uppercase flex items-center gap-2">
                  <span className="w-1.5 h-4.5 bg-[#ea580c] inline-block" />
                  Outreach Programs
                </h2>
                <div className="w-16 h-1 bg-[#ea580c] mt-2 rounded-full" />
              </div>
              
              <div className="space-y-4 mt-8">
                {dynamicPrograms.map((prog, idx) => (
                  <div key={idx} className="p-6 border border-zinc-200 bg-zinc-50/50 rounded-xl flex justify-between items-center group hover:bg-zinc-50 hover:border-zinc-300 transition-all duration-300">
                    <div>
                      <h3 className="font-bold text-xs text-zinc-900 group-hover:text-[#ea580c] transition-colors font-mono uppercase">{prog.title}</h3>
                      <p className="text-[11px] text-zinc-700 mt-1.5 leading-relaxed">{prog.description}</p>
                    </div>
                    <Link href="/biolabs/dashboard" className="h-9 px-4 text-[10px] font-mono uppercase tracking-wider bg-[#ea580c] text-white hover:bg-[#c2410c] rounded-lg transition-all duration-300 flex items-center">
                      Apply / Details
                    </Link>
                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* Sidebar (Right Column) */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Director's Message */}
            <div className="bg-white border border-zinc-200 p-6 rounded-xl relative overflow-hidden shadow-sm">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-[#ea580c]" />
              <h3 className="font-bold text-xs text-zinc-950 mb-4 flex items-center gap-2 font-mono uppercase tracking-wider">
                <Users className="h-4.5 w-4.5 text-[#ea580c]" /> Director's Message
              </h3>
              <div className="flex gap-4 mb-4 items-center">
                <div className="w-11 h-11 bg-zinc-100 rounded-lg border border-zinc-200 shrink-0 flex items-center justify-center text-zinc-400">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-xs text-zinc-900 font-mono">Dr. A. C. Research Director</p>
                  <p className="text-[9px] font-mono text-[#ea580c] uppercase">Head of Healix BioLabs</p>
                </div>
              </div>
              <p className="text-[11px] text-zinc-700 italic leading-relaxed text-justify mb-4">
                "With experience in the field of AI-driven science, Healix BioLabs has earned its reputation of excellence. Our primary objective is to establish world-class facilities for accelerator-based research, promoting group activities and human research development."
              </p>
              <Link href="/about" className="h-8 text-[10px] text-[#ea580c] hover:text-[#c2410c] font-bold uppercase tracking-wider inline-flex items-center gap-1 font-mono">
                Read Full Message <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Research Facilities */}
            <div className="bg-white border border-zinc-200 p-6 rounded-xl shadow-sm">
              <h3 className="font-bold text-xs text-zinc-950 mb-4 flex items-center gap-2 font-mono uppercase tracking-wider">
                <Network className="h-4.5 w-4.5 text-[#ea580c]" /> Research Facilities
              </h3>
              <ul className="space-y-1.5">
                {facilities.map((fac, idx) => (
                  <li key={idx} className="text-xs text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 p-2 rounded-lg cursor-pointer transition-all duration-200 border-b border-zinc-100 last:border-0 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#ea580c] rounded-full inline-block" />
                    {fac}
                  </li>
                ))}
              </ul>
            </div>

            {/* Application Portal Link */}
            <div className="bg-zinc-950 p-6 rounded-xl border border-zinc-900 text-center shadow-md relative overflow-hidden">
              <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none" />
              <GraduationCap className="h-8 w-8 text-zinc-400 mx-auto mb-3" />
              <h3 className="font-bold text-xs text-white mb-1 font-mono uppercase tracking-wider">Join The Network</h3>
              <p className="text-[11px] text-zinc-400 mb-4 leading-relaxed">Be part of India&apos;s leading biomedical research and innovation network. Apply to collaborate, learn, and grow.</p>
              <a
                href="https://biomedical-network.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 bg-[#ea580c] hover:bg-[#c2410c] active:bg-[#9a3412] text-white font-bold text-xs uppercase tracking-wider transition-all rounded-lg flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <span>Start Your Journey With Us</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>

          </div>

        </div>

        {/* --- CUSTOM 3-COLUMN SECTION (Bright Theme Unification) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 mt-28 rounded-2xl border border-zinc-200 overflow-hidden shadow-md relative bg-white">
          
          {/* Left Column: Photos / Videos */}
          <div className="lg:col-span-5 bg-zinc-50 p-8 text-zinc-900 min-h-[450px] flex flex-col justify-between border-r border-zinc-200">
            <div className="flex gap-6 mb-6 border-b border-zinc-200 pb-3">
              <h3 className="text-sm font-black text-zinc-950 border-b-2 border-[#ea580c] pb-3 translate-y-[13px] font-mono uppercase tracking-wider">Photos</h3>
              <h3 className="text-sm font-bold text-zinc-400 hover:text-zinc-700 cursor-pointer pb-3 translate-y-[13px] transition-colors font-mono uppercase tracking-wider">Videos</h3>
            </div>
            
            <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden flex-1 flex flex-col shadow-sm">
              <div className="h-44 bg-zinc-100 relative">
                {dynamicPhotos.length > 0 && (
                  <Image src={dynamicPhotos[0]?.image_url || '/placeholder.png'} alt={dynamicPhotos[0]?.title || 'Photo'} fill style={{ objectFit: 'cover' }} className="opacity-90" />
                )}
              </div>
              <div className="p-4 flex-1 font-bold text-xs text-zinc-800 flex items-center font-mono">
                {dynamicPhotos.length > 0 ? dynamicPhotos[0]?.title : "Healix BioLabs Foundation Day"}
              </div>
            </div>

            <div className="flex justify-between items-center mt-6">
              <button className="h-8 px-4 border border-zinc-300 rounded-lg hover:bg-zinc-100 text-xs font-mono uppercase font-bold tracking-wider">View All</button>
              <div className="flex gap-1.5">
                <button className="w-8 h-8 rounded-lg border border-zinc-300 hover:bg-zinc-100 transition-colors flex items-center justify-center cursor-pointer"><ChevronLeft className="h-4 w-4" /></button>
                <button className="w-8 h-8 rounded-lg border border-zinc-300 hover:bg-zinc-100 transition-colors flex items-center justify-center cursor-pointer"><ChevronRight className="h-4 w-4" /></button>
              </div>
            </div>
          </div>

          {/* Middle Column: Events */}
          <div className="lg:col-span-3 bg-zinc-50 text-zinc-900 flex flex-col border-r border-zinc-200">
            {dynamicEvents.length > 0 && (
              <>
                <div className="h-32 bg-zinc-100 relative shrink-0 border-b border-zinc-200">
                  <Image src={dynamicEvents[currentEvent]?.image_url || '/placeholder.png'} alt="Event" fill style={{ objectFit: 'cover' }} />
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3 border-b border-zinc-200 pb-2">
                      <h3 className="text-[10px] font-mono font-bold tracking-wider text-[#ea580c] uppercase">Events</h3>
                      <span className="text-[10px] text-zinc-400 font-mono">{currentEvent + 1} / {dynamicEvents.length}</span>
                    </div>
                    <h4 className="font-bold text-xs text-zinc-800 mb-2 leading-snug font-mono">{dynamicEvents[currentEvent]?.title}</h4>
                    <p className="text-[11px] text-zinc-600 mb-4 leading-relaxed line-clamp-4">
                      {dynamicEvents[currentEvent]?.description}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-[9px] font-mono text-[#ea580c] mb-4 font-bold">
                      {dynamicEvents[currentEvent]?.start_date && new Date(dynamicEvents[currentEvent].start_date).toLocaleDateString()} to {dynamicEvents[currentEvent]?.end_date && new Date(dynamicEvents[currentEvent].end_date).toLocaleDateString()}
                    </p>
                    
                    <div className="flex justify-between items-center">
                      <button className="h-7 px-3 border border-[#ea580c] text-[#ea580c] rounded-lg hover:bg-orange-50 transition-colors text-[9px] font-mono uppercase tracking-wider font-bold">View All</button>
                      <div className="flex gap-1">
                        <button
                          onClick={() => setCurrentEvent(prev => (prev === 0 ? dynamicEvents.length - 1 : prev - 1))}
                          className="w-7 h-7 rounded-lg border border-zinc-300 text-zinc-500 hover:bg-zinc-100 transition-colors flex items-center justify-center cursor-pointer"
                        >
                          <ChevronLeft className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => setCurrentEvent(prev => (prev + 1) % dynamicEvents.length)}
                          className="w-7 h-7 rounded-lg border border-zinc-300 text-zinc-500 hover:bg-zinc-100 transition-colors flex items-center justify-center cursor-pointer"
                        >
                          <ChevronRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Right Column: What's New */}
          <div className="lg:col-span-4 bg-zinc-50 p-8 text-zinc-900 min-h-[450px] flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-6 border-b border-zinc-200 pb-3">
                <h3 className="text-sm font-black text-zinc-950 font-mono uppercase tracking-wider">What&apos;s New</h3>
                <button className="text-[9px] font-mono tracking-wider text-zinc-500 hover:text-zinc-800 flex items-center gap-1 uppercase">PAUSE <span className="text-xs">||</span></button>
              </div>
              
              <div className="space-y-4">
                {dynamicNews.map((newsItem, idx) => (
                  <div key={idx} className={idx < dynamicNews.length - 1 ? "border-b border-zinc-200 pb-3" : "pb-3"}>
                    <p className="text-xs text-zinc-700 hover:text-[#ea580c] cursor-pointer transition-colors leading-relaxed">
                      {newsItem.title} {newsItem.is_document && <span className="text-[10px] text-zinc-400 font-mono">📄 ({newsItem.file_size})</span>}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <button className="h-8 px-4 border border-zinc-300 rounded-lg hover:bg-zinc-100 text-xs font-mono uppercase font-bold tracking-wider">View All</button>
            </div>
          </div>

        </div>

        {/* --- GENOMIC INTELLIGENCE ENGINE SECTION --- */}
        <section className="mt-28">
          <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-gradient-to-br from-zinc-50 via-white to-zinc-50 p-8 md:p-12 shadow-md">
            <div className="absolute top-0 left-0 w-full h-1 bg-[#ea580c]" />
            
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-[#ea580c]/10 rounded-lg border border-[#ea580c]/20">
                    <Activity className="h-5 w-5 text-[#ea580c]" />
                  </div>
                  <span className="text-[#ea580c] font-bold uppercase tracking-widest text-[9px] font-mono">AI Research Platform</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-black mb-4 tracking-tight font-mono text-zinc-950 uppercase">Genomic Intelligence Engine</h2>
                <p className="text-zinc-600 max-w-2xl text-xs md:text-sm leading-relaxed">
                  Unlock the power of AI-driven genomic analysis. Our high-performance engine provides deep insights into genetic markers, enabling precision medicine and accelerated research in oncology and rare diseases.
                </p>
              </div>
              
              <div className="shrink-0">
                <Link 
                  href="/genomics-research" 
                  className="h-12 px-6 bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-all shadow-md flex items-center gap-2"
                >
                  <span>Access Engine</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* --- RESEARCH PAPERS & PUBLICATIONS SECTION --- */}
        {dynamicPublications.length > 0 && (() => {
          const featured = dynamicPublications.find((p: any) => p.is_featured);
          const editions = dynamicPublications.filter((p: any) => !p.is_featured);
          return (
            <section className="mt-28 mb-16 pt-16 border-t border-zinc-200 relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-px bg-gradient-to-r from-transparent via-[#ea580c]/30 to-transparent" />
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
                
                {/* Featured Left Column */}
                {featured && (
                  <div className="lg:col-span-4">
                    <a href={featured.link_url || "#"} className="block relative w-full aspect-[3/4] bg-zinc-100 rounded-2xl overflow-hidden border border-zinc-200 shadow-md group cursor-pointer">
                      <Image 
                        src={featured?.image_url || '/placeholder.png'} 
                        alt={featured?.title || 'Featured'} 
                        fill 
                        className="object-cover opacity-90 group-hover:scale-102 transition-all duration-700" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute bottom-6 left-6 right-6 z-10">
                        <p className="text-yellow-400 text-[9px] font-bold uppercase tracking-widest mb-2 border-l-2 border-yellow-500 pl-2 font-mono">{featured.label}</p>
                        <h3 className="font-bold text-white text-lg leading-tight mb-2 font-mono uppercase">{featured.title}</h3>
                        {featured.description && (
                          <p className="text-[11px] text-white/90 line-clamp-3 leading-relaxed">{featured.description}</p>
                        )}
                      </div>
                    </a>
                  </div>
                )}

                {/* Content Right Column */}
                <div className={featured ? "lg:col-span-8 flex flex-col justify-center" : "lg:col-span-12 flex flex-col"}>
                  
                  {featured?.subtitle && (
                    <h2 className="text-xl md:text-2xl font-black mb-4 tracking-tight text-zinc-950 leading-tight font-mono uppercase">
                      <span className="text-[#ea580c]">{featured.subtitle.split(' - ')[0]}</span>
                      {featured.subtitle.includes(' - ') && ` - ${featured.subtitle.split(' - ')[1]}`}
                    </h2>
                  )}
                  
                  <p className="text-zinc-700 mb-10 text-xs md:text-sm leading-relaxed max-w-3xl">
                    <span className="text-[#ea580c] font-bold font-mono">Newsletter - </span> 
                    aims to share our work, keep you informed of research milestones and invite you to be part of this dynamic ecosystem.
                  </p>

                  {/* Tab Headers */}
                  <div className="flex gap-8 mb-8 border-b border-zinc-200 pb-0">
                    <h3 className="text-[#ea580c] font-bold text-xs px-4 pb-3 border-b-2 border-[#ea580c] translate-y-[1px] font-mono uppercase tracking-wider">Latest Edition</h3>
                    <h3 className="text-zinc-400 font-bold text-xs hover:text-zinc-700 transition-colors cursor-pointer px-4 pb-3 font-mono uppercase tracking-wider">Previous Editions</h3>
                  </div>

                  {/* Grid of Edition Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8 mt-4 relative">
                    {editions.slice(0, 3).map((item: any) => (
                      <a key={item.id} href={item.link_url || "#"} className="relative group cursor-pointer z-10 block">
                        {/* Ribbon Bookmark */}
                        <div className="absolute -top-3 left-4 z-20 w-8 md:w-10 drop-shadow-sm">
                          <div 
                            className={`h-16 md:h-20 w-full bg-gradient-to-b ${item.ribbon_color || 'from-zinc-700 to-zinc-900'} relative border-x border-white/10`} 
                            style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 85%, 0 100%)' }}
                          >
                            <div className="absolute inset-0 flex items-center justify-center pt-1 pb-3">
                              <span className="text-white text-[8px] font-mono font-bold -rotate-90 whitespace-nowrap tracking-wider">
                                {item.label}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Card Thumbnail */}
                        <div className="relative w-full aspect-[3/4] bg-zinc-100 rounded-xl overflow-hidden border border-zinc-200 group-hover:border-[#ea580c]/40 transition-all duration-300 shadow-md">
                          <Image 
                            src={item?.image_url || '/placeholder.png'}
                            alt={item?.title || 'Edition'}
                            fill
                            className="object-cover opacity-80 group-hover:scale-102 transition-all duration-500 grayscale group-hover:grayscale-0"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4 z-10">
                            <p className="text-white text-[11px] font-bold line-clamp-2 leading-snug font-mono">{item.title}</p>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          );
        })()}
      </div>
    </div>
  );
}

function UserAvatarIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-zinc-400">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  );
}

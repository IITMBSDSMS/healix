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

// Formal Announcements Data
const announcements = [
  "Important Announcement: Proposal submission for 2026 BioLabs Incubator will start from 15th June.",
  "Advertisement No. 04/2026: Healix BioLabs invites applications for Junior Research Fellows (JRF).",
  "High Performance Computing (HPC) Workshop scheduled for 10th-12th July 2026. Apply Here.",
  "Online Registration Open for Summer Training Programme - 2026 at Healix BioLabs."
];

// Slider Images
const sliderImages = [
  { id: 1, src: "/biolabs/hero_dna.png", caption: "Next-Gen Genomics & CRISPR Sequencing Facilities" },
  { id: 2, src: "/biolabs/ai_medical.png", caption: "AI Diagnostics & Predictive Modeling Center" },
  { id: 3, src: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=1200&auto=format&fit=crop", caption: "Advanced Laboratory Research & Micro-analysis" }
];

// Research Areas (IUAC style)
const researchAreas = [
  { title: "AI in Healthcare", icon: <Cpu className="h-6 w-6 text-blue-400" />, desc: "Predictive diagnostics and generative models for oncology and rare diseases." },
  { title: "Genomics & Sequencing", icon: <Dna className="h-6 w-6 text-purple-400" />, desc: "High-throughput sequencing and personalized genetic medicine profiling." },
  { title: "Safety Systems (IoT)", icon: <Shield className="h-6 w-6 text-orange-400" />, desc: "IoT and behavioral analysis for real-time personal security monitoring." },
  { title: "Data Intelligence", icon: <Database className="h-6 w-6 text-green-400" />, desc: "Secure interoperability and scalable health data lakes for ML training." },
];

// Facilities (Kept static as it wasn't moved to DB)
const facilities = [
  "High Performance Computing Lab", "Advanced AI Modeling Clusters", 
  "Predictive Diagnostics Lab", "IoT Device Fabrication Unit",
  "Bio-Informatics Data Center", "Secure Cloud Interoperability Node"
];

export default function BioLabsPage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Dynamic Data State
  const [dynamicAnnouncements, setDynamicAnnouncements] = useState<any[]>([]);
  const [dynamicEvents, setDynamicEvents] = useState<any[]>([]);
  const [dynamicNews, setDynamicNews] = useState<any[]>([]);
  const [dynamicPhotos, setDynamicPhotos] = useState<any[]>([]);
  const [dynamicPrograms, setDynamicPrograms] = useState<any[]>([]);

  useEffect(() => {
    async function fetchDynamicContent() {
      const content = await getBiolabsContent();
      setDynamicAnnouncements(content.announcements);
      setDynamicEvents(content.events);
      setDynamicNews(content.news);
      setDynamicPhotos(content.photos);
      setDynamicPrograms(content.programs);
    }
    fetchDynamicContent();
  }, []);

  useEffect(() => {
    // Only cycle slides if we have photos to show
    if (dynamicPhotos.length === 0) return;
    const slideInterval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % dynamicPhotos.length);
    }, 6000);
    return () => clearInterval(slideInterval);
  }, [dynamicPhotos]);

  return (
    <div className="min-h-screen bg-[#050505] text-white/90 font-sans pb-24">
      
      {/* 1. Announcements Ticker (IUAC Style) */}
      <div className="bg-purple-900/40 border-b border-purple-500/20 py-2 overflow-hidden flex items-center">
        <div className="bg-purple-600 px-4 py-1 text-xs font-bold uppercase tracking-wider shrink-0 z-10 relative shadow-[5px_0_15px_rgba(0,0,0,0.5)]">
          Announcements
        </div>
        <div className="flex-1 overflow-hidden relative h-6">
          <style>{`
            @keyframes marquee {
              0% { transform: translateX(100%); }
              100% { transform: translateX(-100%); }
            }
            .animate-marquee {
              animation: marquee 35s linear infinite;
              display: inline-block;
              white-space: nowrap;
            }
            .animate-marquee:hover {
              animation-play-state: paused;
            }
          `}</style>
          <div className="animate-marquee text-sm text-purple-200 absolute w-full flex">
            {dynamicAnnouncements.map((announcement, idx) => (
              <span key={idx} className="mx-8 whitespace-nowrap">
                • {announcement.content}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        
        {/* 2. Formal Header */}
        <div className="flex flex-col items-center justify-center text-center mb-12">
          <div className="inline-flex items-center justify-center rounded-full mb-6 border border-white/20 bg-[#0a0a0a] overflow-hidden h-20 w-20">
            <Image src="/biolabs-logo.png" alt="Healix BioLabs" width={80} height={80} className="object-cover" />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-3 tracking-tight font-mono">Healix BioLabs Accelerator</h1>
          <p className="text-white/40 max-w-3xl text-xs md:text-sm uppercase tracking-[0.2em] font-mono">
            Inter-Disciplinary Centre for Advanced Healthcare AI & Safety Systems
          </p>
        </div>

        {/* 3. Hero Slider */}
        <div className="relative w-full h-[400px] md:h-[500px] rounded-sm overflow-hidden mb-16 border border-white/10 bg-[#0a0a0a]">
          {dynamicPhotos.length > 0 && (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
                className="absolute inset-0"
              >
                <img 
                  src={dynamicPhotos[currentSlide].image_url} 
                  alt={dynamicPhotos[currentSlide].title} 
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/80 to-transparent pt-32 pb-8 px-8">
                  <motion.h2 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-white font-bold text-2xl tracking-wide border-l-4 border-purple-500 pl-4"
                  >
                    {dynamicPhotos[currentSlide].title}
                  </motion.h2>
                </div>
              </motion.div>
            </AnimatePresence>
          )}
          
          <button onClick={() => setCurrentSlide(prev => (prev === 0 ? dynamicPhotos.length - 1 : prev - 1))} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-purple-600 transition-colors text-white rounded">
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button onClick={() => setCurrentSlide(prev => (prev + 1) % dynamicPhotos.length)} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-purple-600 transition-colors text-white rounded">
            <ChevronRight className="h-6 w-6" />
          </button>
          
          <div className="absolute bottom-4 right-8 flex gap-2">
            {dynamicPhotos.map((_, idx) => (
              <button key={idx} onClick={() => setCurrentSlide(idx)} className={`w-3 h-3 transition-colors ${idx === currentSlide ? 'bg-purple-500' : 'bg-white/30 hover:bg-white/60'}`} />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-8">
          
          {/* Main Content (Left Column) */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* About Section */}
            <section className="prose prose-invert max-w-none">
              <h2 className="text-2xl font-bold border-b border-white/10 pb-4 mb-6 text-purple-400">About Healix BioLabs</h2>
              <p className="text-white/70 leading-relaxed text-justify mb-4">
                Healix BioLabs was established as a premier inter-disciplinary research centre to provide front-ranking, technology-driven research facilities. Its primary objective is to create possibilities for internationally competitive research in Artificial Intelligence, predictive healthcare, and advanced personal safety systems.
              </p>
              <p className="text-white/70 leading-relaxed text-justify">
                The Centre has been playing a pivotal role within the innovation ecosystem, where the scientific community and technology visionaries work together in a genuinely multidisciplinary environment. From its founding, Healix BioLabs has been committed to open, rigorous, and intense inquiry.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                <GlassCard className="p-6 border-blue-500/20 bg-blue-900/10 rounded-sm">
                  <h3 className="text-lg font-bold text-blue-400 mb-2">Our Vision</h3>
                  <p className="text-sm text-white/70">
                    We open new windows to young minds and strengthen the pool of scientists by building a brighter future through technological understanding and AI-driven biological research.
                  </p>
                </GlassCard>
                <GlassCard className="p-6 border-purple-500/20 bg-purple-900/10 rounded-sm">
                  <h3 className="text-lg font-bold text-purple-400 mb-2">Our Mission</h3>
                  <p className="text-sm text-white/70">
                    In the quest for innovation and capacity building, our mission is to provide necessary powerful computing tools used by scientists to understand the complexities of modern healthcare data.
                  </p>
                </GlassCard>
              </div>
            </section>

            {/* Research Areas */}
            <section>
              <h2 className="text-2xl font-bold border-b border-white/10 pb-4 mb-6 text-purple-400">Core Research Areas</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {researchAreas.map((area, idx) => (
                  <div key={idx} className="flex gap-4 p-4 bg-white/5 border border-white/5 hover:border-purple-500/30 transition-colors rounded-sm group">
                    <div className="mt-1 p-2 bg-black rounded shrink-0">{area.icon}</div>
                    <div>
                      <h3 className="font-bold text-base group-hover:text-purple-300 transition-colors">{area.title}</h3>
                      <p className="text-sm text-white/60 mt-2 leading-relaxed">{area.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Outreach & Training */}
            <section>
              <h2 className="text-2xl font-bold border-b border-white/10 pb-4 mb-6 text-purple-400">Outreach Programs</h2>
              <div className="space-y-4">
                {dynamicPrograms.map((prog, idx) => (
                  <div key={idx} className="p-5 border-l-4 border-blue-500 bg-white/5 flex justify-between items-center group hover:bg-white/10 transition-colors">
                    <div>
                      <h3 className="font-bold text-lg group-hover:text-blue-400 transition-colors">{prog.title}</h3>
                      <p className="text-sm text-white/60 mt-1">{prog.description}</p>
                    </div>
                    <Link href="/biolabs/dashboard" className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-blue-600/20 text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
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
            <GlassCard className="p-6 border-white/10 rounded-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500" />
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-400" /> Director's Message
              </h3>
              <div className="flex gap-4 mb-4">
                <div className="w-16 h-16 bg-white/10 rounded border border-white/20 shrink-0 flex items-center justify-center">
                  <UserAvatarIcon />
                </div>
                <div>
                  <p className="font-bold text-sm">Dr. A. C. Research Director</p>
                  <p className="text-xs text-blue-400">Head of Healix BioLabs</p>
                </div>
              </div>
              <p className="text-xs text-white/70 italic leading-relaxed text-justify mb-4">
                "With experience in the field of AI-driven science, Healix BioLabs has earned its reputation of excellence. Our primary objective is to establish world-class facilities for accelerator-based research, promoting group activities and human research development."
              </p>
              <Link href="/about" className="text-xs text-purple-400 hover:text-purple-300 font-bold uppercase tracking-wider">Read Full Message →</Link>
            </GlassCard>

            {/* Quick Links / Facilities */}
            <GlassCard className="p-6 border-white/10 rounded-sm">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Network className="h-5 w-5 text-blue-400" /> Research Facilities
              </h3>
              <ul className="space-y-2">
                {facilities.map((fac, idx) => (
                  <li key={idx} className="text-sm text-white/70 hover:text-white hover:bg-white/5 p-2 rounded cursor-pointer transition-colors border-b border-white/5 last:border-0 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full inline-block" />
                    {fac}
                  </li>
                ))}
              </ul>
            </GlassCard>

            {/* Application Portal Link */}
            <div className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 p-6 rounded-sm border border-purple-500/30 text-center">
              <GraduationCap className="h-10 w-10 text-white/80 mx-auto mb-3" />
              <h3 className="font-bold text-lg mb-2">User Application Portal</h3>
              <p className="text-xs text-white/60 mb-4">Access the user dashboard to submit research proposals and view facility schedules.</p>
              <Link href="/biolabs/dashboard" className="block w-full py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm uppercase tracking-wider transition-colors shadow-lg rounded-sm">
                Login to Dashboard
              </Link>
            </div>

          </div>

        </div>

        {/* --- CUSTOM 3-COLUMN SECTION (IUAC Inspired) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 mt-20 shadow-2xl relative">
          
          {/* Left Column: Photos / Videos */}
          <div className="lg:col-span-5 bg-[#0b2341] p-8 text-white min-h-[450px] flex flex-col justify-between">
            <div className="flex gap-6 mb-6">
              <h3 className="text-2xl font-bold border-b-2 border-white pb-1">Photos</h3>
              <h3 className="text-2xl font-bold text-white/50 hover:text-white/80 cursor-pointer pb-1 transition-colors">Videos</h3>
            </div>
            
            <div className="bg-white text-black rounded-sm overflow-hidden flex-1 flex flex-col shadow-lg">
              <div className="h-48 bg-slate-200 relative">
                {dynamicPhotos.length > 0 && (
                  <Image src={dynamicPhotos[0].image_url} alt={dynamicPhotos[0].title} layout="fill" objectFit="cover" className="opacity-90" />
                )}
              </div>
              <div className="p-4 flex-1 font-bold text-lg flex items-center">
                {dynamicPhotos.length > 0 ? dynamicPhotos[0].title : "Healix BioLabs Foundation Day"}
              </div>
            </div>

            <div className="flex justify-between items-center mt-6">
              <button className="px-6 py-2 border border-white/30 rounded-full hover:bg-white/10 transition-colors text-sm">View All</button>
              <div className="flex gap-2">
                <button className="p-2 rounded-full border border-white/30 hover:bg-white/10 transition-colors"><ChevronLeft className="h-4 w-4" /></button>
                <button className="p-2 rounded-full border border-white/30 hover:bg-white/10 transition-colors"><ChevronRight className="h-4 w-4" /></button>
              </div>
            </div>
          </div>

          {/* Middle Column: Events (Overlapping Card) */}
          <div className="lg:col-span-3 relative lg:-mt-6 lg:-mb-6 z-10 bg-white text-slate-900 rounded-sm shadow-[0_10px_40px_rgba(0,0,0,0.5)] flex flex-col border border-slate-200">
            {dynamicEvents.length > 0 && (
              <>
                <div className="h-32 bg-slate-200 relative shrink-0">
                  <Image src={dynamicEvents[0].image_url} alt="Event" layout="fill" objectFit="cover" />
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-2xl font-black mb-4 tracking-tight">Events</h3>
                  <h4 className="font-bold text-sm mb-3">{dynamicEvents[0].title}</h4>
                  <p className="text-xs text-slate-600 mb-6 leading-relaxed flex-1">
                    {dynamicEvents[0].description}
                  </p>
                  <p className="text-xs font-semibold text-orange-600 mb-6">
                    {new Date(dynamicEvents[0].start_date).toLocaleDateString()} to {new Date(dynamicEvents[0].end_date).toLocaleDateString()}
                  </p>
                  
                  <div className="flex justify-between items-center">
                    <button className="px-5 py-1.5 border border-orange-500 text-orange-600 rounded-full hover:bg-orange-50 transition-colors text-xs font-semibold">View All</button>
                    <div className="flex gap-2">
                      <button className="p-1.5 rounded-full border border-orange-200 text-orange-400 hover:bg-orange-50 transition-colors"><ChevronLeft className="h-4 w-4" /></button>
                      <button className="p-1.5 rounded-full border border-orange-200 text-orange-400 hover:bg-orange-50 transition-colors"><ChevronRight className="h-4 w-4" /></button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Right Column: What's New */}
          <div className="lg:col-span-4 bg-slate-50 p-8 text-slate-900 min-h-[450px] flex flex-col border border-slate-200 lg:border-l-0">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-black tracking-tight">What&apos;s New</h3>
              <button className="text-xs font-semibold text-orange-600 flex items-center gap-1 hover:text-orange-700">PAUSE <span className="text-lg">||</span></button>
            </div>
            
            <div className="space-y-4 flex-1">
              {dynamicNews.map((newsItem, idx) => (
                <div key={idx} className={idx < dynamicNews.length - 1 ? "border-b border-slate-200 pb-4" : "pb-4"}>
                  <p className="text-sm text-slate-700 hover:text-blue-600 cursor-pointer transition-colors">
                    {newsItem.title} {newsItem.is_document && `📄 ( ${newsItem.file_size} )`}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <button className="px-6 py-2 border border-orange-500 text-orange-600 rounded-full hover:bg-orange-50 transition-colors text-sm font-semibold">View All</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function UserAvatarIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-white/40">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  );
}

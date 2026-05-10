"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { HealixLogo } from "@/components/ui/HealixLogo";
import { ArrowRight, Shield, Activity, Server, Database, MessageSquareQuote, X, Smartphone, Bell } from "lucide-react";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

export default function Home() {
  const [reels, setReels] = useState<any[]>([]);
  const [activeVideo, setActiveVideo] = useState<{url: string, title: string} | null>(null);

  useEffect(() => {
    const fetchReels = async () => {
      const supabase = createClient();
      const { data, error } = await supabase.from("community_reels").select("*").eq("is_active", true).order("created_at", { ascending: false });
      if (data && data.length > 0) {
        setReels(data);
      } else {
        // Fallback dummy data if no DB rows
        setReels([
          { id: 1, title: "Emergency SOS Response Test", user_handle: "@sarah_j", thumbnail_url: "/reel-1-thumb.webp", video_url: "https://www.w3schools.com/html/mov_bbb.mp4" },
          { id: 2, title: "Healix AI Symptom Checker Review", user_handle: "@marcus_tech", thumbnail_url: "/reel-2-thumb.webp", video_url: "https://www.w3schools.com/html/mov_bbb.mp4" },
          { id: 3, title: "Night Travel with SheSecure", user_handle: "@priya_travels", thumbnail_url: "/reel-3-thumb.webp", video_url: "https://www.w3schools.com/html/mov_bbb.mp4" },
          { id: 4, title: "BioLabs Student Tour", user_handle: "@uni_science", thumbnail_url: "/reel-4-thumb.webp", video_url: "https://www.w3schools.com/html/mov_bbb.mp4" },
        ]);
      }
    };
    fetchReels();
  }, []);
  const testimonials = [
    {
      name: "Sarah Jenkins",
      role: "Student",
      quote: "The SheSecure SOS feature makes me feel so much safer when walking home late from campus. The response system is incredibly fast."
    },
    {
      name: "Marcus T.",
      role: "Early User",
      quote: "I wasn't sure if I needed to see a doctor for my symptoms. The Healix smart guidance helped me understand my next steps clearly and securely."
    },
    {
      name: "Dr. A. Patel",
      role: "Consultant Physician",
      quote: "A responsible platform that correctly emphasizes guidance over diagnosis, pointing patients in the right direction when they need professional care."
    }
  ];



  return (
    <div className="relative isolate min-h-[calc(100vh-100px)] flex flex-col justify-center pb-20 bg-grid-pattern">
      <div className="absolute inset-0 bg-[#050505]/90 mask-image:linear-gradient(to_bottom,transparent,black)" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8 pt-24 sm:pt-32">
        <div className="flex justify-center mb-8">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-2 px-3 py-1 rounded-full border border-green-500/30 bg-green-500/10"
          >
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-mono text-green-400 uppercase tracking-widest">All Systems Operational</span>
          </motion.div>
        </div>
        
        <div className="mx-auto max-w-3xl text-center">
          <motion.h1 
            initial={{ opacity: 0, filter: "blur(8px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-5xl font-bold tracking-tight sm:text-7xl text-white mb-6"
          >
            Healthcare & Security <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40">Infrastructure</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-6 text-lg leading-8 text-white/50 font-medium"
          >
            Engineered for scale. Healix unifies predictive medical diagnostics, high-performance research labs, and live IoT security ecosystems into one seamless platform.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-10 flex items-center justify-center gap-x-6"
          >
            <Link href="/dashboard">
              <button className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-white/90 transition-colors">
                Enter Dashboard <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
            <Link href="/ai-check" className="text-sm font-semibold leading-6 text-white/70 hover:text-white transition-colors">
              Try Healix AI <span aria-hidden="true">→</span>
            </Link>
          </motion.div>
        </div>

        {/* Modules Cards */}
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          >
          <Link href="/ai-check">
            <GlassCard className="h-full flex flex-col justify-between group cursor-pointer hover:border-purple-500/30">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <div className="p-2 bg-black rounded-full border border-white/10">
                    <HealixLogo size={24} />
                  </div>
                  <span className="text-[10px] font-mono text-purple-400 uppercase">Live Node</span>
                </div>
                <h3 className="text-lg font-bold mb-2">Healix AI Engine</h3>
                <p className="text-xs text-white/50 mb-6">Predictive symptom pipeline and diagnostic guidance models.</p>
              </div>
              <div className="pt-4 border-t border-white/5 flex justify-between items-center text-xs font-mono text-white/40">
                <span>v2.4.1</span>
                <span className="group-hover:text-purple-400 transition-colors flex items-center gap-1">Access <ArrowRight className="h-3 w-3" /></span>
              </div>
            </GlassCard>
          </Link>
          <Link href="/care">
            <GlassCard className="h-full flex flex-col justify-between group cursor-pointer hover:border-blue-500/30">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <div className="p-2 bg-black rounded-full border border-white/10 w-10 h-10 overflow-hidden">
                    <Image src="/care-logo-new.png" alt="Care" width={24} height={24} className="object-contain" />
                  </div>
                  <span className="text-[10px] font-mono text-blue-400 uppercase">Active</span>
                </div>
                <h3 className="text-lg font-bold mb-2">Healix Care Network</h3>
                <p className="text-xs text-white/50 mb-6">Encrypted medical scheduling and practitioner interoperability.</p>
              </div>
              <div className="pt-4 border-t border-white/5 flex justify-between items-center text-xs font-mono text-white/40">
                <span>Routing</span>
                <span className="group-hover:text-blue-400 transition-colors flex items-center gap-1">Access <ArrowRight className="h-3 w-3" /></span>
              </div>
            </GlassCard>
          </Link>
          <Link href="/biolabs">
            <GlassCard className="h-full flex flex-col justify-between group cursor-pointer hover:border-green-500/30">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <div className="p-2 bg-black rounded-full border border-white/10 w-10 h-10 overflow-hidden">
                    <Image src="/biolabs-logo.png" alt="BioLabs" width={24} height={24} className="object-contain" />
                  </div>
                  <span className="text-[10px] font-mono text-green-400 uppercase">Operational</span>
                </div>
                <h3 className="text-lg font-bold mb-2">HPC BioLabs</h3>
                <p className="text-xs text-white/50 mb-6">High-performance computing clusters for genomic sequencing and modeling.</p>
              </div>
              <div className="pt-4 border-t border-white/5 flex justify-between items-center text-xs font-mono text-white/40">
                <span>Cluster A</span>
                <span className="group-hover:text-green-400 transition-colors flex items-center gap-1">Access <ArrowRight className="h-3 w-3" /></span>
              </div>
            </GlassCard>
          </Link>
          <Link href="/shesecure">
            <GlassCard className="h-full flex flex-col justify-between group cursor-pointer hover:border-red-500/30">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <div className="p-2 bg-black rounded-full border border-white/10 w-10 h-10 overflow-hidden">
                    <Image src="/shesecure-logo-new.png" alt="SheSecure" width={24} height={24} className="object-contain" />
                  </div>
                  <span className="text-[10px] font-mono text-red-400 uppercase">Monitoring</span>
                </div>
                <h3 className="text-lg font-bold mb-2">SheSecure IoT Layer</h3>
                <p className="text-xs text-white/50 mb-6">Encrypted travel safety pipelines and QR telemetry tracking.</p>
              </div>
              <div className="pt-4 border-t border-white/5 flex justify-between items-center text-xs font-mono text-white/40">
                <span>Telemetry</span>
                <span className="group-hover:text-red-400 transition-colors flex items-center gap-1">Access <ArrowRight className="h-3 w-3" /></span>
              </div>
            </GlassCard>
          </Link>
        </motion.div>

        {/* Infrastructure Architecture Flow */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mt-32 border-t border-white/10 pt-20"
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 font-mono tracking-tight">System Architecture</h2>
            <p className="text-white/50 max-w-2xl mx-auto text-sm">
              Operational transparency. Our distributed infrastructure operates within strictly defined failsafe parameters to ensure 99.9% uptime and uncompromised privacy.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative max-w-5xl mx-auto">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-[44px] left-[16%] right-[16%] h-px bg-gradient-to-r from-purple-500/20 via-blue-500/50 to-green-500/20 z-0" />
            
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded bg-[#0a0a0a] border border-white/10 flex items-center justify-center mb-6 shadow-xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <Activity className="h-8 w-8 text-blue-400" />
              </div>
              <h3 className="text-lg font-bold mb-2 font-mono text-white/90">Node 01: Telemetry Input</h3>
              <p className="text-white/40 text-xs">User devices securely transmit encrypted health or GPS telemetry to our edge nodes. Payload is validated against strict schema parameters.</p>
            </div>
            
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded bg-[#0a0a0a] border border-white/10 flex items-center justify-center mb-6 shadow-xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <Server className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-lg font-bold mb-2 font-mono text-white/90">Node 02: AI Analysis Engine</h3>
              <p className="text-white/40 text-xs">Data is processed through our high-performance computing clusters. <strong>Zero-knowledge proofs</strong> ensure raw data is never exposed to external models.</p>
            </div>
            
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded bg-[#0a0a0a] border border-white/10 flex items-center justify-center mb-6 shadow-xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <Shield className="h-8 w-8 text-green-400" />
              </div>
              <h3 className="text-lg font-bold mb-2 font-mono text-white/90">Node 03: Secure Routing</h3>
              <p className="text-white/40 text-xs">Based on deterministic rule engines, packets are routed to appropriate emergency response APIs or medical scheduling interoperability layers.</p>
            </div>
          </div>
        </motion.div>

        {/* Testimonials */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mt-32 border-t border-white/10 pt-20"
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Trusted by Our Community</h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              Hear from people who use Healix to manage their health and stay secure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((test, index) => (
              <GlassCard key={index} className="flex flex-col justify-between" glowOnHover={false}>
                <MessageSquareQuote className="h-8 w-8 text-white/20 mb-4" />
                <p className="text-white/80 italic mb-6">"{test.quote}"</p>
                <div>
                  <p className="font-semibold">{test.name}</p>
                  <p className="text-sm text-primary">{test.role}</p>
                </div>
              </GlassCard>
            ))}
          </div>
        </motion.div>

        {/* Community Reels / Video Section */}
        <div className="mt-32 border-t border-white/10 pt-20 overflow-hidden">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Community Stories</h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              Real-world experiences from people who use Healix every day.
            </p>
          </div>

          <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-6 animate-marquee" style={{ animationDirection: 'reverse', width: 'max-content' }}>
              {[...reels, ...reels, ...reels].map((reel, idx) => (
                <div 
                  key={`${reel.id}-${idx}`} 
                  onClick={() => setActiveVideo({ url: reel.video_url, title: reel.title })}
                  className="group relative rounded-xl overflow-hidden bg-black border border-white/10 w-64 aspect-[9/16] shrink-0 cursor-pointer shadow-xl"
                >
                  {/* Thumbnail */}
                  <img src={reel.thumbnail_url} alt={reel.title} className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-black/50 group-hover:bg-black/20 transition-colors duration-500" />
                  
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/90 group-hover:bg-white group-hover:text-black group-hover:scale-110 transition-all">
                      <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                    </div>
                  </div>

                  {/* Info Overlay */}
                  <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-black via-black/80 to-transparent">
                    <p className="text-sm text-white/70 mb-1">{reel.user_handle}</p>
                    <p className="font-semibold text-white leading-tight">{reel.title}</p>
                  </div>
                </div>
              ))}
            </div>
            {/* Fade Edges */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#050505] to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#050505] to-transparent" />
          </div>
        </div>

        {/* ── Mobile App Launching Soon ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mt-32 border-t border-white/10 pt-20 pb-12"
        >
          <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-[#0a0a0a] via-[#0d0a1a] to-[#050505] p-10 md:p-16 flex flex-col lg:flex-row items-center gap-12">
            {/* Ambient glow */}
            <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-purple-600/10 blur-[120px] pointer-events-none" />
            <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-teal-600/10 blur-[120px] pointer-events-none" />

            {/* Left: Text + CTAs */}
            <div className="relative z-10 flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 mb-6">
                <Smartphone className="h-3 w-3 text-purple-400" />
                <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest">iOS &amp; Android</span>
              </div>

              <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
                The Healix App
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-teal-300 to-blue-400">
                  Launching Soon
                </span>
              </h2>
              <p className="text-white/50 text-base max-w-md mb-8 mx-auto lg:mx-0">
                Your entire health &amp; safety ecosystem — AI diagnostics, BioLab reports, SheSecure SOS, and more — distilled into a single native experience.
              </p>

              {/* Store Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
                <button id="app-store-btn" className="flex items-center gap-3 px-6 py-3.5 rounded-xl bg-white text-black font-semibold hover:bg-white/90 active:scale-95 transition-all shadow-lg shadow-white/10">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                  <div className="text-left">
                    <div className="text-[10px] opacity-70 leading-none mb-0.5">Download on the</div>
                    <div className="text-sm font-bold leading-none">App Store</div>
                  </div>
                </button>
                <button id="play-store-btn" className="flex items-center gap-3 px-6 py-3.5 rounded-xl border border-white/20 bg-white/5 text-white font-semibold hover:bg-white/10 active:scale-95 transition-all backdrop-blur-sm">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M3 20.5v-17c0-.83 1-.97 1.45-.42l11 8.5c.39.3.39.86 0 1.16l-11 8.5C3.97 21.47 3 21.33 3 20.5z" opacity=".3"/><path d="M3.23 20.93 13.36 12 3.23 3.07A.99.99 0 003 3.7v16.6c0 .32.16.62.23.63zM4.16 3.27l9.08 5.24-1.96 1.96L4.16 3.27zm0 17.46 7.12-7.12 1.96 1.96-9.08 5.16zM20.84 12l-3.86 2.23-2.17-2.17 2.17-2.17L20.84 12z"/></svg>
                  <div className="text-left">
                    <div className="text-[10px] opacity-70 leading-none mb-0.5">Get it on</div>
                    <div className="text-sm font-bold leading-none">Google Play</div>
                  </div>
                </button>
              </div>

              {/* Notify Form */}
              <div className="flex items-center gap-2 max-w-sm mx-auto lg:mx-0">
                <div className="relative flex-1">
                  <Bell className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                  <input
                    id="mobile-notify-email"
                    type="email"
                    placeholder="your@email.com"
                    className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-white/5 border border-white/15 text-white placeholder-white/30 text-sm focus:outline-none focus:border-purple-500/60 focus:bg-white/8 transition-all"
                  />
                </div>
                <button id="mobile-notify-btn" className="px-4 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold transition-colors shrink-0">
                  Notify Me
                </button>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap gap-4 mt-8 justify-center lg:justify-start">
                {[
                  { label: "Zero-Knowledge Encryption", color: "text-green-400" },
                  { label: "HIPAA Aligned", color: "text-blue-400" },
                  { label: "Offline-First", color: "text-purple-400" },
                ].map((badge) => (
                  <span key={badge.label} className={`flex items-center gap-1.5 text-xs font-mono ${badge.color} opacity-80`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    {badge.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Right: Mockup Image */}
            <div className="relative z-10 flex-1 flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                className="relative"
              >
                {/* Glow behind mockup */}
                <div className="absolute inset-0 scale-75 rounded-full bg-gradient-to-tr from-purple-500/30 via-teal-500/20 to-blue-500/20 blur-3xl" />
                <Image
                  src="/mobile-mockup.png"
                  alt="Healix mobile app mockup showing health dashboard and SheSecure safety map"
                  width={520}
                  height={520}
                  className="relative drop-shadow-2xl w-full h-auto max-w-[520px]"
                  priority
                />
              </motion.div>
            </div>
          </div>
        </motion.div>

      </div>

      {/* Video Player Modal */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4"
            onClick={() => setActiveVideo(null)}
          >
            <button 
              className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
              onClick={(e) => { e.stopPropagation(); setActiveVideo(null); }}
            >
              <X className="h-6 w-6" />
            </button>
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm aspect-[9/16] bg-black border border-white/20 rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <video 
                src={activeVideo.url} 
                autoPlay 
                controls 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-0 inset-x-0 p-4 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
                <p className="text-white font-mono text-sm shadow-black drop-shadow-md">{activeVideo.title}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

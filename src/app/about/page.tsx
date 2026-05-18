"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { 
  Shield, Activity, Server, Database, Lock, Code, Microscope, 
  ArrowRight, Brain, Zap, Globe, FileText,
  Stethoscope, Fingerprint, Layers, GraduationCap
} from "lucide-react";
import Image from "next/image";
import { IDCard } from "@/components/ui/IDCard";

// ─── Sub-Components ───

const MedicalMesh = () => {
  return (
    <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
      <svg width="100%" height="100%" className="w-full h-full">
        <pattern id="mesh-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1" fill="#eab308" opacity="0.5" />
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#eab308" strokeWidth="0.2" opacity="0.2" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#mesh-pattern)" />
        <motion.circle 
          animate={{ 
            cx: ["10%", "90%", "10%"],
            cy: ["20%", "80%", "20%"],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          r="100" 
          fill="url(#grad1)" 
          className="blur-3xl opacity-30"
        />
        <defs>
          <radialGradient id="grad1" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stopColor="#eab308" stopOpacity="1" />
            <stop offset="100%" stopColor="#eab308" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
};

const SectionHeader = ({ badge, title, subtitle, align = "center" }: { badge: string, title: string, subtitle?: string, align?: "center" | "left" }) => (
  <div className={`mb-16 ${align === "center" ? "text-center" : "text-left"}`}>
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#eab308]/30 bg-[#eab308]/10 mb-6"
    >
      <div className="w-1 h-1 rounded-full bg-[#eab308] animate-pulse" />
      <span className="text-[10px] font-mono text-[#eab308] uppercase tracking-widest">{badge}</span>
    </motion.div>
    <motion.h2 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-4xl md:text-5xl font-bold tracking-tight mb-6"
    >
      {title}
    </motion.h2>
    {subtitle && (
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={`text-lg text-white/50 max-w-2xl leading-relaxed ${align === "center" ? "mx-auto" : "mx-auto lg:mx-0"}`}
      >
        {subtitle}
      </motion.p>
    )}
  </div>
);

// ─── Dynamic Leadership Section ───

type Mentor = {
  id: string;
  name: string;
  role: string;
  organization?: string;
  bio?: string;
  quote?: string;
  photo_url?: string;
  linkedin_url?: string;
  twitter_url?: string;
  github_url?: string;
};

function LeadershipFounderCard() {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    fetch("/api/mentors")
      .then((r) => r.json())
      .then((data) => { setMentors(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const next = useCallback(() => {
    setActiveIdx((i) => (i + 1) % Math.max(mentors.length, 1));
  }, [mentors.length]);

  const prev = useCallback(() => {
    setActiveIdx((i) => (i - 1 + mentors.length) % Math.max(mentors.length, 1));
  }, [mentors.length]);

  useEffect(() => {
    if (!isHovered && mentors.length > 1) {
      intervalRef.current = setInterval(next, 4000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isHovered, next, mentors.length]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto py-20 text-center text-white/20 font-mono text-sm animate-pulse">
        Loading leadership team...
      </div>
    );
  }

  if (mentors.length === 0) {
    return (
      <div className="max-w-5xl mx-auto py-20 text-center text-white/20 font-mono text-sm">
        No mentors added yet.
      </div>
    );
  }

  const mentor = mentors[activeIdx];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="max-w-5xl mx-auto"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

        {/* ── Left: Animated Photo ── */}
        <div className="lg:col-span-5 relative">
          <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-white/10 bg-[#0a0a0a] group">
            {mentors.map((m, i) => (
              <motion.div
                key={m.id}
                className="absolute inset-0"
                initial={false}
                animate={{ opacity: i === activeIdx ? 1 : 0, scale: i === activeIdx ? 1 : 1.04 }}
                transition={{ duration: 0.7, ease: "easeInOut" }}
              >
                {m.photo_url ? (
                  <Image src={m.photo_url} alt={m.name} fill className="object-cover object-top" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#eab308] text-[120px] font-bold">
                    {m.name[0]}
                  </div>
                )}
              </motion.div>
            ))}

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent pointer-events-none z-10" />

            {/* Mentor name badge at bottom */}
            <div className="absolute bottom-5 left-5 right-5 z-20">
              <motion.div key={mentor.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <p className="text-base font-bold text-white">{mentor.name}</p>
                <p className="text-xs font-semibold text-[#eab308]">{mentor.role}</p>
              </motion.div>
            </div>

            {/* Dot indicators */}
            {mentors.length > 1 && (
              <div className="absolute top-4 right-4 z-20 flex gap-1.5">
                {mentors.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIdx(i)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      i === activeIdx ? "bg-[#eab308] scale-125" : "bg-white/20 hover:bg-white/40"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Progress bar */}
          <div className="mt-4 h-0.5 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              key={activeIdx}
              className="h-full bg-[#eab308] rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 4, ease: "linear" }}
            />
          </div>

          {/* Prev / Next + Counter */}
          {mentors.length > 1 && (
            <div className="flex items-center justify-between mt-5">
              <div className="flex gap-2">
                <button onClick={prev} className="w-9 h-9 rounded-full border border-white/10 bg-white/5 hover:bg-[#eab308]/10 hover:border-[#eab308]/40 flex items-center justify-center text-white/60 hover:text-white transition-all">
                  ‹
                </button>
                <button onClick={next} className="w-9 h-9 rounded-full border border-white/10 bg-white/5 hover:bg-[#eab308]/10 hover:border-[#eab308]/40 flex items-center justify-center text-white/60 hover:text-white transition-all">
                  ›
                </button>
              </div>
              <p className="text-xs font-mono text-white/30">
                {String(activeIdx + 1).padStart(2, "0")} / {String(mentors.length).padStart(2, "0")}
              </p>
            </div>
          )}
        </div>

        {/* ── Right: Mentor Details ── */}
        <div className="lg:col-span-7 space-y-8 pt-2">
          <motion.div key={mentor.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>

            {/* Name & Role */}
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#eab308]/30 bg-[#eab308]/10 mb-5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#eab308] animate-pulse" />
                <span className="text-[10px] font-mono text-[#eab308] uppercase tracking-widest">{mentor.role}</span>
              </div>
              <h3 className="text-5xl md:text-6xl font-bold tracking-tighter mb-2">{mentor.name}</h3>
              {mentor.organization && (
                <p className="text-white/40 font-mono text-sm uppercase tracking-wider">{mentor.organization}</p>
              )}
            </div>

            {/* Bio */}
            {mentor.bio && (
              <div className="space-y-3 text-white/60 leading-relaxed mb-6">
                <p>{mentor.bio}</p>
              </div>
            )}

            {/* Quote */}
            {mentor.quote && (
              <blockquote className="border-l-2 border-[#eab308] pl-6 py-2 mb-6">
                <p className="text-xl font-light text-white italic leading-relaxed">
                  &ldquo;{mentor.quote}&rdquo;
                </p>
              </blockquote>
            )}

            {/* Social Links */}
            <div className="flex items-center gap-3 flex-wrap">
              {mentor.linkedin_url && mentor.linkedin_url !== "#" && (
                <a href={mentor.linkedin_url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-white/5 hover:border-[#eab308]/40 hover:bg-[#eab308]/5 transition-all text-sm font-semibold text-white/50 hover:text-white">
                  <span className="text-base leading-none">in</span>
                  <span>LinkedIn</span>
                </a>
              )}
              {mentor.twitter_url && mentor.twitter_url !== "#" && (
                <a href={mentor.twitter_url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-white/5 hover:border-[#eab308]/40 hover:bg-[#eab308]/5 transition-all text-sm font-semibold text-white/50 hover:text-white">
                  <span className="text-base leading-none">𝕏</span>
                  <span>Twitter</span>
                </a>
              )}
              {mentor.github_url && mentor.github_url !== "#" && (
                <a href={mentor.github_url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-white/5 hover:border-[#eab308]/40 hover:bg-[#eab308]/5 transition-all text-sm font-semibold text-white/50 hover:text-white">
                  <span className="text-base leading-none">gh</span>
                  <span>GitHub</span>
                </a>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Page ───

export default function AboutPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="relative isolate w-full bg-[#050505] overflow-hidden selection:bg-[#eab308]/30">
      {/* ── Background Global ── */}
      <div className="fixed inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.02] pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,_#eab30805_0%,_transparent_50%)] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        
        {/* ── 1. HERO SECTION ── */}
        <section className="min-h-screen flex flex-col justify-center pt-20 pb-40">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-7 relative z-20">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 mb-8">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-[10px] font-mono text-white/60 uppercase tracking-[0.2em]">Founded 2024 · Private Alpha</span>
                </div>
                
                <h1 className="text-5xl md:text-8xl font-bold leading-[0.95] tracking-tighter mb-8">
                  Building the <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#eab308] via-[#fde047] to-[#eab308] animate-gradient-x">infrastructure layer</span> for the future of healthcare intelligence.
                </h1>
                
                <p className="text-xl text-white/50 max-w-xl mb-12 leading-relaxed">
                  Healix exists to unify fragmented health data into secure, actionable intelligence that helps healthcare products make faster and smarter care decisions.
                </p>
                
                <div className="flex flex-wrap items-center gap-6">
                  <Button size="lg" className="px-10">
                    Join Private Beta
                  </Button>
                  <button 
                    onClick={() => document.getElementById('founder-story')?.scrollIntoView({ behavior: 'smooth' })}
                    className="group flex items-center gap-3 text-sm font-semibold text-white/70 hover:text-white transition-all"
                  >
                    <span>Meet the Founder</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[#eab308]" />
                  </button>
                </div>
              </motion.div>
            </div>
            
            <div className="lg:col-span-5 relative overflow-hidden rounded-[2.5rem]">
              <MedicalMesh />
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="relative z-10"
              >
                <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden border border-white/10 group bg-[#0a0a0a] flex items-center justify-center">
                  {/* Subtle Background Pattern */}
                  <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]" />
                  
                  {/* Glowing Initial */}
                  <div className="relative z-0 group-hover:scale-105 transition-transform duration-700">
                    <div className="absolute inset-0 bg-[#eab308] blur-[80px] opacity-20 rounded-full" />
                    <span className="text-[200px] font-serif font-bold italic text-white/90 drop-shadow-2xl select-none pr-8">
                      A
                    </span>
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent opacity-90 pointer-events-none" />
                  
                  {/* Founder Badge */}
                  <div className="absolute bottom-8 left-8 z-10">
                    <p className="text-xs font-mono text-[#eab308] uppercase tracking-widest mb-2">Avnish</p>
                    <p className="text-2xl font-bold text-white tracking-tight">Founder & CEO</p>
                  </div>
                </div>
                
                {/* Floating Metrics */}
                <div className="absolute -bottom-6 -right-6 md:-right-10 z-20">
                  <GlassCard className="p-5 border-[#eab308]/20 bg-black/80 backdrop-blur-2xl">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-[#eab308]/10 rounded-xl">
                        <Fingerprint className="w-5 h-5 text-[#eab308]" />
                      </div>
                      <div>
                        <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest">Protocol</p>
                        <p className="text-sm font-bold text-white">Zero-Trust ID-v4</p>
                      </div>
                    </div>
                  </GlassCard>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── 2. FOUNDER STORY ── */}
        <section id="founder-story" className="py-40 border-t border-white/5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
            <div className="lg:col-span-5">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="sticky top-32"
              >
                <div className="w-20 h-1 bg-[#eab308] mb-12 rounded-full" />
                <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8 italic">“Why Healix <br/>exists”</h2>
                <div className="flex items-center gap-4 mt-12">
                  <div>
                    <p className="font-serif text-2xl text-white italic tracking-tighter">Avnish</p>
                    <p className="text-[10px] font-mono text-[#eab308] uppercase tracking-widest">Founder & CEO</p>
                  </div>
                </div>
              </motion.div>
            </div>
            
            <div className="lg:col-span-7">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="space-y-12 text-2xl text-white/70 leading-relaxed font-light"
              >
                <p>
                  While modern healthcare generates enormous amounts of patient data, most of it remains trapped across disconnected systems.
                </p>
                
                <div className="space-y-4 py-8 border-y border-white/5">
                  <div className="flex items-center gap-6 group">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#eab308]/10 transition-colors">
                      <Zap className="w-5 h-5 text-white/40 group-hover:text-[#eab308] transition-colors" />
                    </div>
                    <p className="text-white/90">Wearables track movement.</p>
                  </div>
                  <div className="flex items-center gap-6 group">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-blue-500/10 transition-colors">
                      <Stethoscope className="w-5 h-5 text-white/40 group-hover:text-blue-400 transition-colors" />
                    </div>
                    <p className="text-white/90">Hospitals store clinical records.</p>
                  </div>
                  <div className="flex items-center gap-6 group">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-purple-500/10 transition-colors">
                      <Microscope className="w-5 h-5 text-white/40 group-hover:text-purple-400 transition-colors" />
                    </div>
                    <p className="text-white/90">Labs produce diagnostics.</p>
                  </div>
                </div>

                <p className="text-white font-normal">
                  But none of it speaks the same language.
                </p>
                
                <p className="text-3xl font-bold text-white leading-tight">
                  Healix was created to solve that fragmentation.
                </p>
                
                <p className="text-xl">
                  We are building the universal intelligence layer that allows healthcare products to reason over complex patient datasets in real-time, without the months of engineering overhead.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── 2.7 LEADERSHIP TEAM ── */}
        <section id="leadership" className="py-40 border-t border-white/5">
          <SectionHeader
            badge="Our People"
            title="Leadership Team."
            subtitle="The minds behind Healix — builders, researchers, and healthcare innovators united by a single mission."
          />

          {/* Founder Card */}
          <LeadershipFounderCard />
        </section>

        {/* ── 2.5 THE SYSTEMIC ADVANTAGE ── */}
        <section className="py-40 bg-gradient-to-b from-transparent via-[#eab308]/5 to-transparent">
          <SectionHeader 
            badge="Unified Intelligence"
            title="Systemic Healthcare Infrastructure."
            subtitle="Healix isn't a collection of features; it's a unified ecosystem where data flows seamlessly between research, safety, and care."
          />
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { title: "BioLabs", desc: "Genomic research fuels clinical models.", icon: Microscope },
              { title: "SheSecure", desc: "Live safety telemetry secures patients.", icon: Shield },
              { title: "Healix AI", desc: "Diagnostic reasoning unified by FHIR.", icon: Brain },
              { title: "Academy", desc: "Training the next generation of staff engineers.", icon: GraduationCap }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <GlassCard className="p-8 border-white/5 text-center group hover:border-[#eab308]/20 transition-all">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <item.icon className="w-6 h-6 text-[#eab308]" />
                  </div>
                  <h4 className="text-lg font-bold mb-2">{item.title}</h4>
                  <p className="text-xs text-white/40 leading-relaxed">{item.desc}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── 3. MISSION + VISION ── */}
        <section className="py-40">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <GlassCard className="p-12 h-full relative group overflow-hidden border-[#eab308]/10">
                <div className="absolute -top-12 -right-12 p-12 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Layers className="h-64 w-64 text-[#eab308]" />
                </div>
                <p className="text-[10px] font-mono text-[#eab308] uppercase tracking-[0.4em] mb-8">The Mission</p>
                <h3 className="text-5xl font-bold mb-8 text-white tracking-tighter">Make health data universally usable.</h3>
                <p className="text-lg text-white/50 leading-relaxed">
                  We are commoditizing the complex engineering required to fetch, clean, and normalize healthcare data so that innovators can focus on care delivery, not data plumbing.
                </p>
              </GlassCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <GlassCard className="p-12 h-full relative group overflow-hidden border-blue-500/10">
                <div className="absolute -top-12 -right-12 p-12 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Brain className="h-64 w-64 text-blue-400" />
                </div>
                <p className="text-[10px] font-mono text-blue-400 uppercase tracking-[0.4em] mb-8">The Vision</p>
                <h3 className="text-5xl font-bold mb-8 text-white tracking-tighter">Real-time patient reasoning for all.</h3>
                <p className="text-lg text-white/50 leading-relaxed">
                  Enable a future where every healthcare product—from a small wellness app to a massive clinical system—can reason on real-time patient intelligence instantly.
                </p>
              </GlassCard>
            </motion.div>
          </div>
        </section>

        {/* ── 4. OUR APPROACH ── */}
        <section className="py-40 border-y border-white/5">
          <SectionHeader 
            badge="Engineering Approach"
            title="Smarter, faster, more secure."
            subtitle="Engineered for builders, trusted by clinicians. Our approach focuses on the intersection of scale and clinical accuracy."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                title: "Unified Intelligence Layer", 
                desc: "Turn fragmented systems into one standardized patient graph via our universal FHIR-v4 intelligence proxy.", 
                icon: Database, 
                color: "text-[#eab308]" 
              },
              { 
                title: "Developer First", 
                desc: "Deploy HIPAA-compliant integrations in hours, not months. We handle the edge cases, you build the experience.", 
                icon: Code, 
                color: "text-blue-400" 
              },
              { 
                title: "Privacy by Architecture", 
                desc: "Security and compliance aren't checkboxes; they are the bedrock. End-to-end encryption for every single request.", 
                icon: Lock, 
                color: "text-emerald-400" 
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <GlassCard className="p-10 h-full group hover:bg-white/[0.02] transition-all">
                  <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-8 ${item.color} group-hover:scale-110 transition-transform`}>
                    <item.icon className="h-7 w-7" />
                  </div>
                  <h4 className="text-2xl font-bold mb-4 tracking-tight">{item.title}</h4>
                  <p className="text-white/50 leading-relaxed">{item.desc}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── 5. THE TEAM ── */}
        <section className="py-40">
          <SectionHeader 
            badge="The Team"
            title="The engineers behind the mesh."
            align="left"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { role: "AI Infrastructure Engineer", focus: "Distributed Systems Architect", img: "https://images.unsplash.com/photo-1519085186480-b8553f4b2a44?q=80&w=400&auto=format&fit=crop" },
              { role: "Healthcare Data Systems Lead", focus: "FHIR / HL7 / EHR Integrations", img: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=400&auto=format&fit=crop" },
              { role: "Clinical Intelligence Advisor", focus: "Medical workflows + interoperability", img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=400&auto=format&fit=crop" },
              { role: "Product Systems Engineer", focus: "Platform reliability + scale", img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&auto=format&fit=crop" },
            ].map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <GlassCard className="p-0 overflow-hidden border-white/5 group h-full hover:border-[#eab308]/20 transition-all">
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <Image src={member.img} alt={member.role} fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-80" />
                    <div className="absolute bottom-6 left-6 right-6">
                      <p className="text-sm font-bold text-white tracking-tight mb-1">{member.role}</p>
                      <p className="text-[10px] font-mono text-[#eab308] uppercase tracking-widest">{member.focus}</p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── 6. INSTITUTIONAL CREDENTIALS ── */}
        <section className="py-40">
          <SectionHeader 
            badge="Institutional Proof"
            title="Authenticated credentials for every researcher."
            subtitle="Our team and students carry cryptographically verifiable institutional IDs, ensuring secure access to clinical-grade environments."
          />
          <div className="flex flex-col items-center">
            <IDCard />
            <p className="mt-12 text-[10px] font-mono text-white/20 uppercase tracking-[0.4em]">Healix Research & Engineering Credential · Prototype v4.2</p>
          </div>
        </section>

        {/* ── 7. MENTORS + BACKING ── */}
        <section className="py-40 bg-white/[0.01] rounded-[3rem] border border-white/5 px-12">
          <SectionHeader 
            badge="Strategic Advisory"
            title="Backed by world-class systems expertise."
            subtitle="Guidance from veteran builders and researchers from top institutions."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "IIT Systems Mentor", focus: "Systems Reliability" },
              { label: "Healthcare AI Advisor", focus: "ML Governance" },
              { label: "Cloud Architecture Specialist", focus: "Infrastructure Security" },
              { label: "Product Strategy Mentor", focus: "Growth & Scale" },
            ].map((item, i) => (
              <GlassCard key={i} className="p-8 text-center border-white/5 group hover:border-[#eab308]/20 transition-all">
                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-[#eab308]/10 transition-colors">
                  <Server className="w-5 h-5 text-white/30 group-hover:text-[#eab308] transition-colors" />
                </div>
                <p className="text-base font-bold text-white mb-2">{item.label}</p>
                <p className="text-[10px] font-mono text-[#eab308] uppercase tracking-widest">{item.focus}</p>
              </GlassCard>
            ))}
          </div>
          <div className="mt-16 text-center">
            <span className="px-4 py-2 rounded-full border border-white/10 bg-white/5 text-[10px] font-mono text-white/30 uppercase tracking-[0.4em]">Supported by expert builders and advisors</span>
          </div>
        </section>

        {/* ── 8. ROADMAP TIMELINE ── */}
        <section className="py-40">
          <SectionHeader 
            badge="The Roadmap"
            title="The road to unified intelligence."
          />
          
          <div className="relative max-w-4xl mx-auto">
            {/* Vertical Line */}
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-[#eab308] via-purple-500/20 to-transparent" />
            
            <div className="space-y-32">
              {[
                { date: "2026 Q1", title: "Private Alpha", desc: "Limited access for selected health-tech startups to test the foundational data mesh.", icon: Activity },
                { date: "2026 Q2", title: "Wearable API Expansion", desc: "Native support for continuous telemetry from 15+ major wearable platforms.", icon: Zap },
                { date: "2026 Q3", title: "Enterprise Sandbox Release", desc: "Full simulation environment for hospital-grade EHR integration testing.", icon: Server },
                { date: "2026 Q4", title: "Healthcare Developer Marketplace", desc: "Enabling third-party developers to build intelligence apps on top of Healix.", icon: Code },
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className={`relative flex items-center gap-12 ${i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                >
                  <div className="flex-1">
                    <GlassCard className={`p-8 border-white/5 group hover:border-[#eab308]/20 transition-all ${i % 2 === 0 ? 'text-right' : 'text-left'}`}>
                      <p className="text-[#eab308] font-mono text-[10px] uppercase tracking-[0.3em] mb-4">{item.date}</p>
                      <h4 className="text-2xl font-bold mb-4 tracking-tighter">{item.title}</h4>
                      <p className="text-sm text-white/50 leading-relaxed">{item.desc}</p>
                    </GlassCard>
                  </div>
                  
                  {/* Timeline Point */}
                  <div className="relative z-10 w-12 h-12 rounded-full bg-black border border-[#eab308] flex items-center justify-center shadow-[0_0_20px_rgba(234,179,8,0.2)]">
                    <item.icon className="h-5 w-5 text-[#eab308]" />
                  </div>
                  
                  <div className="flex-1" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 9. TRUST SECTION ── */}
        <section className="py-40 border-t border-white/5">
          <div className="flex flex-wrap justify-center items-center gap-16 opacity-30 grayscale hover:grayscale-0 transition-all duration-1000">
            {[
              { label: "HIPAA-ready", icon: Shield },
              { label: "FHIR compatible", icon: Activity },
              { label: "End-to-end encryption", icon: Lock },
              { label: "Audit logging", icon: FileText },
              { label: "Scalable cloud infra", icon: Globe },
            ].map((badge, i) => (
              <div key={i} className="flex flex-col items-center gap-4">
                <badge.icon className="h-10 w-10 text-white" />
                <p className="text-[10px] font-mono uppercase tracking-[0.2em]">{badge.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 10. FINAL CTA ── */}
        <section className="pb-40">
          <GlassCard className="p-20 md:p-32 text-center relative overflow-hidden bg-gradient-to-br from-[#0a0a0a] via-[#050505] to-black border-[#eab308]/10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_#eab30805_0%,_transparent_50%)]" />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-12 leading-[0.95]">Help build the future <br /> health infrastructure layer.</h2>
              <div className="flex flex-wrap justify-center gap-6 mb-12">
                <Button size="lg" className="px-12">
                  Join Beta
                </Button>
                <Button variant="outline" size="lg" className="px-12">
                  Schedule Demo
                </Button>
              </div>
              <p className="text-xs font-mono text-white/20 uppercase tracking-[0.4em]">Launching private beta in 2026. Secure your node.</p>
            </motion.div>
          </GlassCard>
        </section>

      </div>
    </div>
  );
}

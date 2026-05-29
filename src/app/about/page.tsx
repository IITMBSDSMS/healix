"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { 
  Shield, Activity, Server, Database, Lock, Code, Microscope, 
  ArrowRight, Brain, Zap, Globe, FileText,
  Stethoscope, Fingerprint, Layers, GraduationCap, Users, Mail, Phone, Calendar
} from "lucide-react";
import Image from "next/image";
import { IDCard } from "@/components/ui/IDCard";
import { DnaHelix3D } from "@/components/ui/DnaHelix3D";

// ─── Sub-Components ───

const MedicalMesh = () => {
  return (
    <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
      <svg width="100%" height="100%" className="w-full h-full">
        <pattern id="mesh-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1" fill="#ea580c" opacity="0.5" />
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#ea580c" strokeWidth="0.2" opacity="0.2" />
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
            <stop offset="0%" stopColor="#ea580c" stopOpacity="1" />
            <stop offset="100%" stopColor="#ea580c" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
};

const BiotechBackground = () => {
  return (
    <div className="absolute inset-0 z-0 opacity-[0.06] pointer-events-none select-none">
      <svg width="100%" height="100%" className="w-full h-full text-[#ea580c]">
        {/* Hexagonal grid pattern for biochemistry feeling */}
        <pattern id="hex-grid" width="56" height="97" patternUnits="userSpaceOnUse" patternTransform="scale(1.2)">
          <path d="M28 0 L56 16.16 L56 48.48 L28 64.64 L0 48.48 L0 16.16 Z" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
          <path d="M28 97 L56 80.84 L56 48.48 L28 64.64 L0 48.48 L0 80.84 Z" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#hex-grid)" />
        
        {/* Floating animated molecules / chemical bonds */}
        <motion.g
          animate={{
            y: [0, -15, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="origin-center"
        >
          {/* Molecule left */}
          <circle cx="8%" cy="25%" r="6" fill="currentColor" opacity="0.6" />
          <circle cx="12%" cy="20%" r="4" fill="currentColor" opacity="0.4" />
          <circle cx="15%" cy="30%" r="5" fill="currentColor" opacity="0.5" />
          <line x1="8%" y1="25%" x2="12%" y2="20%" stroke="currentColor" strokeWidth="1.2" opacity="0.4" />
          <line x1="8%" y1="25%" x2="15%" y2="30%" stroke="currentColor" strokeWidth="1.2" opacity="0.4" />
        </motion.g>

        <motion.g
          animate={{
            y: [0, 20, 0],
            rotate: [0, -8, 0]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="origin-center"
        >
          {/* Molecule right */}
          <circle cx="92%" cy="65%" r="7" fill="currentColor" opacity="0.5" />
          <circle cx="96%" cy="58%" r="5" fill="currentColor" opacity="0.4" />
          <circle cx="88%" cy="72%" r="4" fill="currentColor" opacity="0.3" />
          <line x1="92%" y1="65%" x2="96%" y2="58%" stroke="currentColor" strokeWidth="1.2" opacity="0.4" />
          <line x1="92%" y1="65%" x2="88%" y2="72%" stroke="currentColor" strokeWidth="1.2" opacity="0.4" />
        </motion.g>

        {/* Dynamic double helix curve details */}
        <motion.path
          animate={{
            d: [
              "M -50 400 Q 100 350, 250 400 T 550 400 T 850 400 T 1150 400 T 1450 400",
              "M -50 400 Q 100 450, 250 400 T 550 400 T 850 400 T 1150 400 T 1450 400",
              "M -50 400 Q 100 350, 250 400 T 550 400 T 850 400 T 1150 400 T 1450 400"
            ]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.3"
        />
        <motion.path
          animate={{
            d: [
              "M -50 400 Q 100 450, 250 400 T 550 400 T 850 400 T 1150 400 T 1450 400",
              "M -50 400 Q 100 350, 250 400 T 550 400 T 850 400 T 1150 400 T 1450 400",
              "M -50 400 Q 100 450, 250 400 T 550 400 T 850 400 T 1150 400 T 1450 400"
            ]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="4 4"
          opacity="0.2"
        />
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
      className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#ea580c]/30 bg-[#ea580c]/10 mb-6"
    >
      <div className="w-1.5 h-1.5 rounded-full bg-[#ea580c] animate-pulse" />
      <span className="text-[10px] font-mono text-[#ea580c] uppercase tracking-widest font-bold">{badge}</span>
    </motion.div>
    <motion.h2 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-4xl md:text-5xl font-black tracking-tight mb-6 text-zinc-950 font-mono uppercase"
    >
      {title}
    </motion.h2>
    {subtitle && (
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={`text-sm md:text-base text-zinc-600 max-w-2xl leading-relaxed ${align === "center" ? "mx-auto" : "mx-auto lg:mx-0"}`}
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
      <div className="max-w-5xl mx-auto py-20 text-center text-zinc-400 font-mono text-xs animate-pulse">
        Loading leadership team...
      </div>
    );
  }

  if (mentors.length === 0) {
    return (
      <div className="max-w-5xl mx-auto py-20 text-center text-zinc-400 font-mono text-xs">
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
          <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-zinc-200 bg-zinc-50 group shadow-md">
            <AnimatePresence mode="wait">
              <motion.div
                key={mentor.id}
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 1.08, filter: "blur(8px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.94, filter: "blur(4px)" }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                {mentor.photo_url ? (
                  <Image src={mentor.photo_url} alt={mentor.name} fill className="object-cover object-top" unoptimized />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#ea580c] text-[120px] font-bold font-mono">
                    {mentor.name[0]}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none z-10" />

            {/* Mentor name badge at bottom */}
            <div className="absolute bottom-5 left-5 right-5 z-20 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={mentor.id} 
                  initial={{ opacity: 0, y: 15, filter: "blur(2px)" }} 
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} 
                  exit={{ opacity: 0, y: -15, filter: "blur(1px)" }} 
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <p className="text-base font-bold text-white font-mono uppercase">{mentor.name}</p>
                  <p className="text-xs font-semibold text-[#ea580c] font-mono uppercase">{mentor.role}</p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Dot indicators */}
            {mentors.length > 1 && (
              <div className="absolute top-4 right-4 z-20 flex gap-1.5">
                {mentors.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIdx(i)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      i === activeIdx ? "bg-[#ea580c] scale-125" : "bg-white/40 hover:bg-white/70"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Progress bar */}
          <div className="mt-4 h-0.5 bg-zinc-200 rounded-full overflow-hidden">
            <motion.div
              key={activeIdx}
              className="h-full bg-[#ea580c] rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 4, ease: "linear" }}
            />
          </div>

          {/* Prev / Next + Counter */}
          {mentors.length > 1 && (
            <div className="flex items-center justify-between mt-5">
              <div className="flex gap-2">
                <button onClick={prev} className="w-9 h-9 rounded-full border border-zinc-200 bg-zinc-50 hover:bg-[#ea580c]/10 hover:border-[#ea580c]/40 flex items-center justify-center text-zinc-600 hover:text-[#ea580c] transition-all cursor-pointer">
                  ‹
                </button>
                <button onClick={next} className="w-9 h-9 rounded-full border border-zinc-200 bg-zinc-50 hover:bg-[#ea580c]/10 hover:border-[#ea580c]/40 flex items-center justify-center text-zinc-600 hover:text-[#ea580c] transition-all cursor-pointer">
                  ›
                </button>
              </div>
              <p className="text-xs font-mono text-zinc-500">
                {String(activeIdx + 1).padStart(2, "0")} / {String(mentors.length).padStart(2, "0")}
              </p>
            </div>
          )}
        </div>

        {/* ── Right: Mentor Details ── */}
        <div className="lg:col-span-7 space-y-8 pt-2">
          <AnimatePresence mode="wait">
            <motion.div 
              key={mentor.id} 
              initial={{ opacity: 0, x: 20, filter: "blur(4px)" }} 
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }} 
              exit={{ opacity: 0, x: -20, filter: "blur(2px)" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >

            {/* Name & Role */}
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#ea580c]/30 bg-[#ea580c]/10 mb-5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ea580c] animate-pulse" />
                <span className="text-[10px] font-mono text-[#ea580c] uppercase tracking-widest font-bold">{mentor.role}</span>
              </div>
              <h3 className="text-4xl md:text-5xl font-black tracking-tight mb-2 text-zinc-950 font-mono uppercase">{mentor.name}</h3>
              {mentor.organization && (
                <p className="text-zinc-500 font-mono text-xs uppercase tracking-wider">{mentor.organization}</p>
              )}
            </div>

            {/* Bio */}
            {mentor.bio && (
              <div className="space-y-3 text-zinc-700 leading-relaxed mb-6 text-sm">
                <p>{mentor.bio}</p>
              </div>
            )}

            {/* Quote */}
            {mentor.quote && (
              <blockquote className="border-l-4 border-[#ea580c] pl-6 py-2 mb-6">
                <p className="text-lg font-medium text-zinc-800 italic leading-relaxed">
                  &ldquo;{mentor.quote}&rdquo;
                </p>
              </blockquote>
            )}

            {/* Social Links */}
            <div className="flex items-center gap-3 flex-wrap">
              {mentor.linkedin_url && mentor.linkedin_url !== "#" && (
                <a href={mentor.linkedin_url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-zinc-200 bg-zinc-50 hover:border-[#ea580c]/40 hover:bg-[#ea580c]/5 transition-all text-xs font-bold font-mono uppercase text-zinc-600 hover:text-[#ea580c]">
                  <span className="text-sm leading-none">in</span>
                  <span>LinkedIn</span>
                </a>
              )}
              {mentor.twitter_url && mentor.twitter_url !== "#" && (
                <a href={mentor.twitter_url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-zinc-200 bg-zinc-50 hover:border-[#ea580c]/40 hover:bg-[#ea580c]/5 transition-all text-xs font-bold font-mono uppercase text-zinc-600 hover:text-[#ea580c]">
                  <span className="text-sm leading-none">𝕏</span>
                  <span>Twitter</span>
                </a>
              )}
              {mentor.github_url && mentor.github_url !== "#" && (
                <a href={mentor.github_url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-zinc-200 bg-zinc-50 hover:border-[#ea580c]/40 hover:bg-[#ea580c]/5 transition-all text-xs font-bold font-mono uppercase text-zinc-600 hover:text-[#ea580c]">
                  <span className="text-sm leading-none">gh</span>
                  <span>GitHub</span>
                </a>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      </div>
    </motion.div>
  );
}

// ─── Main Page ───

export default function AboutPage() {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("[SYSTEM] Initializing Healix Node Gateway...");
  const [teamMembers, setTeamMembers] = useState<any[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    fetch("/api/team")
      .then((r) => {
        if (!r.ok) throw new Error("API error");
        return r.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setTeamMembers(data);
        } else {
          throw new Error("Invalid format");
        }
      })
      .catch(() => {
        setTeamMembers([
          { id: "t1", role: "AI Infrastructure Engineer", focus: "Distributed Systems Architect", photo_url: "https://images.unsplash.com/photo-1519085186480-b8553f4b2a44?q=80&w=400&auto=format&fit=crop" },
          { id: "t2", role: "Healthcare Data Systems Lead", focus: "FHIR / HL7 / EHR EHR EHR", photo_url: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=400&auto=format&fit=crop" },
          { id: "t3", role: "Clinical Intelligence Advisor", focus: "Medical workflows + interoperability", photo_url: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=400&auto=format&fit=crop" },
          { id: "t4", role: "Product Systems Engineer", focus: "Platform reliability + scale", photo_url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&auto=format&fit=crop" }
        ]);
      });
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;

    // Organic loading telemetry progress loop
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setLoading(false), 300); // 300ms buffer on completion for exit ease
          return 100;
        }
        
        // Random organic increment values for natural telemetry feel
        const increment = Math.floor(Math.random() * 8) + 4;
        const next = Math.min(100, prev + increment);

        // Map percentage to specific high-tech healthcare intelligence logs
        if (next < 25) {
          setLoadingText("[SYSTEM] Bootstrapping FHIR-v4 Edge Gateways...");
        } else if (next < 50) {
          setLoadingText("[AUTH] Establishing Zero-Trust Telemetry Handshake...");
        } else if (next < 75) {
          setLoadingText("[GRAPHICS] Calibrating 3D Canvas Molecular Model...");
        } else if (next < 95) {
          setLoadingText("[DATABASE] Indexing BRCA1/TP53 Genomic Sequence...");
        } else {
          setLoadingText("[READY] Healix Platform Online. Loading interfaces...");
        }

        return next;
      });
    }, 45);

    return () => clearInterval(interval);
  }, [mounted]);

  if (!mounted) return null;

  return (
    <AnimatePresence mode="wait">
      {loading ? (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 bg-white z-[9999] flex flex-col items-center justify-center select-none px-6"
        >
          {/* Subtle clinical backgrounds */}
          <div className="fixed inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.02] pointer-events-none" />
          <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,rgba(234,88,12,0.015)_0%,transparent_70%)] pointer-events-none" />
          
          <div className="relative flex flex-col items-center max-w-sm w-full text-center">
            {/* Double concentric high-contrast animated loops */}
            <div className="relative w-20 h-20 mb-8 flex items-center justify-center">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-2 border-dashed border-[#ea580c] rounded-full opacity-70"
              />
              <motion.div 
                animate={{ rotate: -360 }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
                className="absolute w-14 h-14 border border-zinc-200 border-t-2 border-t-[#ea580c] rounded-full"
              />
              <div className="w-2.5 h-2.5 rounded-full bg-[#ea580c] animate-pulse" />
            </div>

            {/* Brand HUD subtitle */}
            <h3 className="font-mono text-zinc-950 font-black text-sm uppercase tracking-[0.4em] mb-4">
              HEALIX INTELLIGENCE
            </h3>

            {/* Responsive tech progress bar */}
            <div className="w-64 h-1 bg-zinc-100 rounded-full overflow-hidden mb-6 relative">
              <motion.div 
                className="h-full bg-[#ea580c]"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.05 }}
              />
            </div>

            {/* Large high-contrast counter */}
            <div className="font-mono text-zinc-950 font-black text-3xl mb-3 tracking-wider">
              {progress}%
            </div>

            {/* Real-time telemetry log feed */}
            <div className="font-mono text-[9.5px] uppercase tracking-widest text-[#ea580c] h-5 font-bold max-w-xs leading-relaxed">
              {loadingText}
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative isolate w-full bg-white text-zinc-900 overflow-hidden selection:bg-yellow-500/20"
        >
      {/* ── Background Global ── */}
      <div className="fixed inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.02] pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(234,88,12,0.02)_0%,_transparent_50%)] pointer-events-none" />
      
      <div className="max-w-[94%] mx-auto px-6 lg:px-8 relative z-10">
        
        {/* ── 1. HERO SECTION ── */}
        <section className="min-h-screen flex flex-col justify-center pt-20 pb-40">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-7 relative z-20">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-200 bg-zinc-50 mb-8">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-[0.2em] font-bold">Founded 2024 · Private Alpha</span>
                </div>
                
                <h1 className="text-5xl md:text-8xl font-black leading-[0.95] tracking-tight mb-8 font-mono uppercase text-zinc-950">
                  Building the <span className="text-[#ea580c]">infrastructure layer</span> for the future of healthcare intelligence.
                </h1>
                
                <p className="text-base md:text-lg text-zinc-650 max-w-xl mb-12 leading-relaxed">
                  Healix exists to unify fragmented health data into secure, actionable intelligence that helps healthcare products make faster and smarter care decisions.
                </p>
                
                <div className="flex flex-wrap items-center gap-6">
                  <Button size="lg" className="px-10 bg-[#ea580c] hover:bg-[#c2410c] text-white font-mono uppercase tracking-wider font-bold">
                    Join Private Beta
                  </Button>
                  <button 
                    onClick={() => document.getElementById('founder-story')?.scrollIntoView({ behavior: 'smooth' })}
                    className="group flex items-center gap-3 text-xs font-bold font-mono uppercase text-zinc-700 hover:text-[#ea580c] transition-all cursor-pointer"
                  >
                    <span>Meet the Founder</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[#ea580c]" />
                  </button>
                </div>
              </motion.div>
            </div>
            
            <div className="lg:col-span-5 relative flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="relative w-full flex items-center justify-center"
              >
                {/* ── 3D Revolving Canvas DNA Helix ── */}
                <DnaHelix3D />
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── 2. FOUNDER STORY ── */}
        <section id="founder-story" className="py-40 border-t border-zinc-200">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
            <div className="lg:col-span-5">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="sticky top-32"
              >
                <div className="w-20 h-1 bg-[#ea580c] mb-12 rounded-full" />
                <h2 className="text-5xl md:text-7xl font-black font-mono tracking-tight text-zinc-950 uppercase mb-8 leading-none">Why Healix <br/>exists</h2>
                <div className="flex items-center gap-4 mt-12">
                  <div>
                    <p className="font-mono text-xl text-zinc-800 font-bold uppercase">Avnish</p>
                    <p className="text-[10px] font-mono text-[#ea580c] uppercase tracking-widest font-bold">Founder & CEO</p>
                  </div>
                </div>
              </motion.div>
            </div>
            
            <div className="lg:col-span-7">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="space-y-12 text-lg text-zinc-700 leading-relaxed font-light"
              >
                <p className="text-xl text-zinc-800 font-medium">
                  While modern healthcare generates enormous amounts of patient data, most of it remains trapped across disconnected systems.
                </p>
                
                <div className="space-y-4 py-8 border-y border-zinc-200">
                  <div className="flex items-center gap-6 group">
                    <div className="w-12 h-12 rounded-full bg-zinc-50 border border-zinc-200 flex items-center justify-center group-hover:bg-[#ea580c]/10 transition-colors">
                      <Zap className="w-5 h-5 text-zinc-400 group-hover:text-[#ea580c] transition-colors" />
                    </div>
                    <p className="text-zinc-900 font-mono text-xs uppercase font-bold tracking-wide">Wearables track movement.</p>
                  </div>
                  <div className="flex items-center gap-6 group">
                    <div className="w-12 h-12 rounded-full bg-zinc-50 border border-zinc-200 flex items-center justify-center group-hover:bg-[#ea580c]/10 transition-colors">
                      <Stethoscope className="w-5 h-5 text-zinc-400 group-hover:text-[#ea580c] transition-colors" />
                    </div>
                    <p className="text-zinc-900 font-mono text-xs uppercase font-bold tracking-wide">Hospitals store clinical records.</p>
                  </div>
                  <div className="flex items-center gap-6 group">
                    <div className="w-12 h-12 rounded-full bg-zinc-50 border border-zinc-200 flex items-center justify-center group-hover:bg-[#ea580c]/10 transition-colors">
                      <Microscope className="w-5 h-5 text-zinc-400 group-hover:text-[#ea580c] transition-colors" />
                    </div>
                    <p className="text-zinc-900 font-mono text-xs uppercase font-bold tracking-wide">Labs produce diagnostics.</p>
                  </div>
                </div>

                <p className="text-zinc-900 font-bold font-mono uppercase text-sm">
                  But none of it speaks the same language.
                </p>
                
                <p className="text-3xl font-black text-zinc-950 font-mono uppercase leading-tight">
                  Healix was created to solve that fragmentation.
                </p>
                
                <p className="text-base text-zinc-650 leading-relaxed">
                  We are building the universal intelligence layer that allows healthcare products to reason over complex patient datasets in real-time, without the months of engineering overhead.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── 2.7 LEADERSHIP TEAM ── */}
        <section id="leadership" className="py-40 border-t border-zinc-200 relative overflow-hidden">
          <BiotechBackground />
          <div className="relative z-10">
            <SectionHeader
              badge="Our People"
              title="Leadership Team."
              subtitle="The minds behind Healix — builders, researchers, and healthcare innovators united by a single mission."
            />

            {/* Founder Card */}
            <LeadershipFounderCard />
          </div>
        </section>

        {/* ── 2.5 THE SYSTEMIC ADVANTAGE ── */}
        <section className="py-40 bg-zinc-50 rounded-[2.5rem] border border-zinc-200 px-8 my-10 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(234,88,12,0.015)_0%,transparent_70%)] pointer-events-none" />
          <SectionHeader 
            badge="Unified Intelligence"
            title="Systemic Healthcare Infrastructure."
            subtitle="Healix isn't a collection of features; it's a unified ecosystem where data flows seamlessly between research, safety, and care."
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {[
              { title: "BioLabs", desc: "Genomic research fuels clinical models.", icon: Microscope },
              { title: "HSF Portal", desc: "Live safety telemetry secures patients.", icon: Shield },
              { title: "Healix AI", desc: "Diagnostic reasoning unified by FHIR.", icon: Brain },
              { title: "Mentorship", desc: "Training the next generation of staff engineers.", icon: GraduationCap }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <GlassCard variant="light" className="p-8 border-zinc-200 bg-white text-center group hover:border-[#ea580c]/30 hover:shadow-md transition-all h-full">
                  <div className="w-12 h-12 rounded-full bg-zinc-50 border border-zinc-150 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <item.icon className="w-6 h-6 text-[#ea580c]" />
                  </div>
                  <h4 className="text-base font-bold mb-2 text-zinc-900 font-mono uppercase">{item.title}</h4>
                  <p className="text-xs text-zinc-600 leading-relaxed">{item.desc}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── 3. MISSION + VISION ── */}
        <section className="py-40 border-t border-zinc-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <GlassCard variant="light" className="p-12 h-full relative group overflow-hidden border-zinc-200 bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="absolute -top-12 -right-12 p-12 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Layers className="h-64 w-64 text-[#ea580c]" />
                </div>
                <p className="text-[10px] font-mono text-[#ea580c] uppercase tracking-[0.4em] mb-8 font-bold">The Mission</p>
                <h3 className="text-4xl font-black mb-8 text-zinc-950 tracking-tight font-mono uppercase">Make health data universally usable.</h3>
                <p className="text-sm md:text-base text-zinc-650 leading-relaxed">
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
              <GlassCard variant="light" className="p-12 h-full relative group overflow-hidden border-zinc-200 bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="absolute -top-12 -right-12 p-12 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Brain className="h-64 w-64 text-[#ea580c]" />
                </div>
                <p className="text-[10px] font-mono text-[#ea580c] uppercase tracking-[0.4em] mb-8 font-bold">The Vision</p>
                <h3 className="text-4xl font-black mb-8 text-zinc-950 tracking-tight font-mono uppercase">Real-time patient reasoning for all.</h3>
                <p className="text-sm md:text-base text-zinc-650 leading-relaxed">
                  Enable a future where every healthcare product—from a small wellness app to a massive clinical system—can reason on real-time patient intelligence instantly.
                </p>
              </GlassCard>
            </motion.div>
          </div>
        </section>

        {/* ── 4. OUR APPROACH ── */}
        <section className="py-40 border-y border-zinc-200">
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
                color: "text-[#ea580c]" 
              },
              { 
                title: "Developer First", 
                desc: "Deploy HIPAA-compliant integrations in hours, not months. We handle the edge cases, you build the experience.", 
                icon: Code, 
                color: "text-zinc-900" 
              },
              { 
                title: "Privacy by Architecture", 
                desc: "Security and compliance aren't checkboxes; they are the bedrock. End-to-end encryption for every single request.", 
                icon: Lock, 
                color: "text-[#ea580c]" 
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <GlassCard variant="light" className="p-10 h-full group bg-white border border-zinc-200 hover:shadow-md transition-shadow">
                  <div className={`w-14 h-14 rounded-2xl bg-zinc-50 border border-zinc-150 flex items-center justify-center mb-8 ${item.color} group-hover:scale-110 transition-transform`}>
                    <item.icon className="h-7 w-7" />
                  </div>
                  <h4 className="text-xl font-bold mb-4 tracking-tight text-zinc-950 font-mono uppercase">{item.title}</h4>
                  <p className="text-xs md:text-sm text-zinc-600 leading-relaxed">{item.desc}</p>
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
            {teamMembers.map((member, i) => (
              <motion.div
                key={member.id || i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <GlassCard variant="light" className="p-0 overflow-hidden border-zinc-200 group h-full hover:border-[#ea580c]/30 hover:shadow-md transition-all bg-white">
                  <div className="relative aspect-[4/5] overflow-hidden">
                    {member.photo_url ? (
                      <Image src={member.photo_url} alt={member.role} fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100" unoptimized />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#ea580c] text-7xl font-bold font-mono bg-zinc-50">
                        {member.name ? member.name[0] : member.role[0]}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-80 pointer-events-none" />
                    <div className="absolute bottom-6 left-6 right-6 z-10 pointer-events-none">
                      <p className="text-sm font-bold text-white tracking-tight mb-1 font-mono uppercase">{member.role}</p>
                      <p className="text-[10px] font-mono text-[#ea580c] uppercase tracking-widest font-bold">{member.focus}</p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── 6. INSTITUTIONAL CREDENTIALS ── */}
        <section className="py-40 border-t border-zinc-200">
          <SectionHeader 
            badge="Institutional Proof"
            title="Authenticated credentials for every researcher."
            subtitle="Our team and students carry cryptographically verifiable institutional IDs, ensuring secure access to clinical-grade environments."
          />
          <div className="flex flex-col items-center">
            <IDCard />
            <p className="mt-12 text-[10px] font-mono text-zinc-500 uppercase tracking-[0.4em] font-bold">Healix Research & Engineering Credential · Prototype v4.2</p>
          </div>
        </section>

        {/* ── 7. MENTORS + BACKING ── */}
        <section className="py-40 bg-zinc-50 rounded-[3rem] border border-zinc-200 px-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(234,88,12,0.01)_0%,transparent_70%)] pointer-events-none" />
          <SectionHeader 
            badge="Strategic Advisory"
            title="Backed by world-class systems expertise."
            subtitle="Guidance from veteran builders and researchers from top institutions."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {[
              { label: "IIT Systems Mentor", focus: "Systems Reliability" },
              { label: "Healthcare AI Advisor", focus: "ML Governance" },
              { label: "Cloud Architecture Specialist", focus: "Infrastructure Security" },
              { label: "Product Strategy Mentor", focus: "Growth & Scale" },
            ].map((item, i) => (
              <GlassCard variant="light" key={i} className="p-8 text-center border-zinc-200 bg-white shadow-sm group hover:border-[#ea580c]/30 hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-zinc-50 border border-zinc-150 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-[#ea580c]/10 transition-colors">
                  <Server className="w-5 h-5 text-zinc-400 group-hover:text-[#ea580c] transition-colors" />
                </div>
                <p className="text-base font-bold text-zinc-900 mb-2 font-mono uppercase">{item.label}</p>
                <p className="text-[10px] font-mono text-[#ea580c] uppercase tracking-widest font-bold">{item.focus}</p>
              </GlassCard>
            ))}
          </div>
          <div className="mt-16 text-center relative z-10">
            <span className="px-4 py-2 rounded-full border border-zinc-250 bg-white text-[10px] font-mono text-zinc-500 uppercase tracking-[0.4em] font-bold">Supported by expert builders and advisors</span>
          </div>
        </section>


        {/* ── 9. TRUST SECTION ── */}
        <section className="py-40 border-t border-zinc-200">
          <div className="flex flex-wrap justify-center items-center gap-16 opacity-60 hover:opacity-100 transition-all duration-700">
            {[
              { label: "HIPAA-ready", icon: Shield },
              { label: "FHIR compatible", icon: Activity },
              { label: "End-to-end encryption", icon: Lock },
              { label: "Audit logging", icon: FileText },
              { label: "Scalable cloud infra", icon: Globe },
            ].map((badge, i) => (
              <div key={i} className="flex flex-col items-center gap-4 text-zinc-700">
                <badge.icon className="h-10 w-10 text-zinc-800" />
                <p className="text-[10px] font-mono uppercase tracking-[0.2em] font-bold">{badge.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 10. FINAL CTA ── */}
        <section className="pb-40">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="p-20 md:p-32 text-center relative overflow-hidden bg-zinc-950 text-white border border-zinc-800 shadow-2xl rounded-[2.5rem]"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(234,88,12,0.12)_0%,transparent_60%)]" />
            
            <div className="relative z-10">
              <h2 className="text-5xl md:text-7xl font-black font-mono uppercase tracking-tight mb-12 leading-[0.95] text-white">
                Help build the future <br /> health infrastructure layer.
              </h2>
              <div className="flex flex-wrap justify-center gap-6 mb-12">
                <Button size="lg" className="px-12 bg-[#ea580c] hover:bg-[#c2410c] text-white font-mono font-bold uppercase tracking-wider">
                  Join Beta
                </Button>
                <Button variant="outline" size="lg" className="px-12 border-zinc-700 text-zinc-350 hover:text-white hover:bg-zinc-900 font-mono font-bold uppercase tracking-wider">
                  Schedule Demo
                </Button>
              </div>
              <p className="text-xs font-mono text-zinc-400 uppercase tracking-[0.4em] font-bold">
                Launching private beta in 2026. Secure your node.
              </p>
            </div>
          </motion.div>
        </section>

        </div>
      </motion.div>
    )}
  </AnimatePresence>
  );
}

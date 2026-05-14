"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { 
  Shield, Activity, Server, Database, Users, CheckCircle, 
  ChevronRight, Calendar, Lock, Code, Microscope, 
  ArrowRight, Heart, Brain, Zap, Globe, FileText
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
  };

  return (
    <div className="relative isolate w-full bg-[#050505] overflow-x-hidden">
      {/* ── Background Elements ── */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-[600px] h-[600px] bg-[#eab308]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24 relative z-10">
        
        {/* ── 1. HERO SECTION ── */}
        <section className="min-h-[80vh] flex flex-col lg:flex-row items-center justify-between gap-16 mb-40">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="flex-1 text-center lg:text-left"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#eab308]/30 bg-[#eab308]/10 mb-6">
              <CheckCircle className="h-3.5 w-3.5 text-[#eab308]" />
              <span className="text-[10px] font-mono text-[#eab308] uppercase tracking-widest">Our Genesis</span>
            </motion.div>
            
            <motion.h1 
              variants={itemVariants}
              className="text-5xl md:text-7xl font-bold leading-[1.1] mb-8"
            >
              Building the <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#eab308] via-[#fde047] to-[#ca8a04]">infrastructure layer</span> for the future of health intelligence.
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              className="text-xl text-white/50 max-w-2xl mb-10 leading-relaxed"
            >
              Healix exists to unify fragmented health data into secure, actionable intelligence that helps healthcare products make faster and smarter care decisions.
            </motion.p>
            
            <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <Link href="/auth" className="px-8 py-4 bg-[#eab308] text-black font-bold rounded-xl hover:bg-[#ca8a04] transition-all transform hover:scale-105 shadow-xl shadow-[#eab308]/20">
                Join Private Beta
              </Link>
              <button onClick={() => document.getElementById('founder-story')?.scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 bg-white/5 text-white font-bold rounded-xl border border-white/10 hover:bg-white/10 transition-all backdrop-blur-md">
                Meet the Founder
              </button>
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="flex-1 relative"
          >
            {/* Medical Data Mesh Simulation */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 to-teal-500/10 blur-3xl opacity-50" />
            </div>
            
            <div className="relative z-10">
              <GlassCard className="p-2 border-white/10 overflow-hidden group">
                <div className="relative aspect-[4/5] rounded-lg overflow-hidden">
                  <Image 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1200&auto=format&fit=crop" 
                    alt="Founder Portrait"
                    fill
                    className="object-cover grayscale hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                  <div className="absolute bottom-6 left-6 text-left">
                    <p className="text-xs font-mono text-[#eab308] uppercase tracking-widest mb-1">Founder & CEO</p>
                    <p className="text-xl font-bold text-white">Avnish J.</p>
                  </div>
                </div>
              </GlassCard>
              
              {/* Floating Stat Card */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-6 -left-6 md:-left-12 z-20"
              >
                <GlassCard className="p-4 flex items-center gap-4 bg-black/80 backdrop-blur-xl border-[#eab308]/20">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-mono text-white/40 uppercase">System Integrity</p>
                    <p className="text-sm font-bold text-white">SOC2 Type II Aligned</p>
                  </div>
                </GlassCard>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* ── 2. FOUNDER STORY ── */}
        <section id="founder-story" className="mb-40">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-2 lg:order-1"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 mb-8">
                <Heart className="h-3.5 w-3.5 text-purple-400" />
                <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest">Vision Statement</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-10">Why Healix exists</h2>
              
              <div className="space-y-6 text-lg text-white/60 leading-relaxed">
                <p>
                  While modern healthcare generates enormous amounts of patient data, most of it remains trapped across disconnected systems.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                    <p className="text-[#eab308] font-bold mb-1">Wearables</p>
                    <p className="text-xs">Track continuous movement & vitals.</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                    <p className="text-blue-400 font-bold mb-1">Hospitals</p>
                    <p className="text-xs">Store dense clinical records.</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                    <p className="text-purple-400 font-bold mb-1">Labs</p>
                    <p className="text-xs">Produce biological diagnostics.</p>
                  </div>
                </div>
                <p>
                  But none of it speaks the same language. Healthcare products are forced to build expensive, redundant integrations just to understand a single patient.
                </p>
                <p className="text-white font-medium italic">
                  "Healix was created to solve that fragmentation. We are building the universal translator for healthcare intelligence."
                </p>
              </div>
              
              <div className="mt-12 pt-12 border-t border-white/10">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden border border-white/10">
                    <Image src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop" width={64} height={64} alt="Avnish" className="object-cover" />
                  </div>
                  <div>
                    <p className="font-serif text-3xl text-white italic tracking-tighter opacity-80 mb-1 font-light">Avnish J.</p>
                    <p className="text-xs font-mono text-[#eab308] uppercase tracking-widest">Founder &amp; CEO, Healix</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2"
            >
              <div className="relative rounded-2xl overflow-hidden border border-white/10 group shadow-2xl">
                <Image 
                  src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop" 
                  alt="Visionary environment"
                  width={800}
                  height={600}
                  className="object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-[#050505] via-transparent to-transparent" />
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── 3. MISSION + VISION ── */}
        <section className="mb-40">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <GlassCard className="p-12 relative group overflow-hidden border-[#eab308]/10">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <Zap className="h-24 w-24 text-[#eab308]" />
              </div>
              <p className="text-xs font-mono text-[#eab308] uppercase tracking-[0.3em] mb-4">The Mission</p>
              <h3 className="text-4xl font-bold mb-6 text-white">Make health data universally usable.</h3>
              <p className="text-white/50 leading-relaxed">
                We are commoditizing the complex engineering required to fetch, clean, and normalize healthcare data so that innovators can focus on care, not plumbing.
              </p>
            </GlassCard>

            <GlassCard className="p-12 relative group overflow-hidden border-purple-500/10">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <Brain className="h-24 w-24 text-purple-400" />
              </div>
              <p className="text-xs font-mono text-purple-400 uppercase tracking-[0.3em] mb-4">The Vision</p>
              <h3 className="text-4xl font-bold mb-6 text-white">Real-time reasoning for every product.</h3>
              <p className="text-white/50 leading-relaxed">
                We enable a future where every healthcare product—from a small app to a massive clinical system—can reason on real-time patient intelligence instantly.
              </p>
            </GlassCard>
          </div>
        </section>

        {/* ── 4. OUR APPROACH ── */}
        <section className="mb-40">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Our Approach</h2>
            <p className="text-white/40 max-w-xl mx-auto italic font-mono text-sm">Engineered for builders, trusted by clinicians.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                title: "Unified Intelligence Layer", 
                desc: "Turn fragmented systems into one standardized patient graph.", 
                icon: Database, 
                color: "text-[#eab308]" 
              },
              { 
                title: "Developer First", 
                desc: "Deploy integrations in hours, not months via our robust SDKs.", 
                icon: Code, 
                color: "text-blue-400" 
              },
              { 
                title: "Privacy by Architecture", 
                desc: "Security and compliance built into every request at the infrastructure level.", 
                icon: Lock, 
                color: "text-green-400" 
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <GlassCard className="p-8 h-full group hover:border-[#eab308]/20 transition-colors">
                  <item.icon className={`h-10 w-10 ${item.color} mb-6 group-hover:scale-110 transition-transform`} />
                  <h4 className="text-xl font-bold mb-4">{item.title}</h4>
                  <p className="text-sm text-white/50 leading-relaxed">{item.desc}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── 5. THE TEAM ── */}
        <section className="mb-40">
          <div className="flex items-end justify-between mb-16">
            <div className="text-left">
              <h2 className="text-4xl font-bold mb-4">The Builders</h2>
              <p className="text-white/50 max-w-md">The engineers and advisors turning fragmented data into intelligence.</p>
            </div>
            <div className="hidden md:block h-[1px] flex-1 mx-12 bg-white/10" />
            <Link href="/auth" className="px-6 py-2 rounded-lg border border-white/10 text-xs font-mono hover:bg-white/5 transition-colors uppercase tracking-widest">Join the Team</Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { role: "AI Infrastructure Engineer", focus: "Distributed Systems Architect", img: "https://images.unsplash.com/photo-1519085186480-b8553f4b2a44?q=80&w=400&auto=format&fit=crop" },
              { role: "Healthcare Data Systems Lead", focus: "FHIR / HL7 / EHR Integrations", img: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=400&auto=format&fit=crop" },
              { role: "Clinical Intelligence Advisor", focus: "Medical Workflows + Interoperability", img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=400&auto=format&fit=crop" },
              { role: "Product Systems Engineer", focus: "Platform Reliability + Scale", img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&auto=format&fit=crop" },
            ].map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <GlassCard className="p-0 overflow-hidden border-white/5 group h-full">
                  <div className="relative aspect-square overflow-hidden">
                    <Image src={member.img} alt={member.role} fill className="object-cover grayscale hover:grayscale-0 transition-all duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/20 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="text-xs font-mono text-[#eab308] uppercase tracking-widest mb-1">{member.role}</p>
                      <p className="text-[10px] text-white/40">{member.focus}</p>
                    </div>
                  </div>
                  <div className="p-4 bg-white/[0.02] flex justify-between items-center">
                    <div className="flex gap-3">
                      <div className="w-6 h-6 rounded-md bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#eab308] hover:text-black transition-colors cursor-pointer">
                        <Globe className="h-3 w-3" />
                      </div>
                      <div className="w-6 h-6 rounded-md bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#eab308] hover:text-black transition-colors cursor-pointer">
                        <Globe className="h-3 w-3" />
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-white/20 group-hover:text-[#eab308] transition-colors" />
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── 6. MENTORS + BACKING ── */}
        <section className="mb-40">
          <div className="relative p-1 bg-gradient-to-r from-transparent via-[#eab308]/20 to-transparent rounded-3xl overflow-hidden mb-16">
            <div className="bg-[#050505] rounded-[22px] p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 justify-between">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#eab308]/30 bg-[#eab308]/10 mb-4">
                  <CheckCircle className="h-3.5 w-3.5 text-[#eab308]" />
                  <span className="text-[10px] font-mono text-[#eab308] uppercase tracking-widest">Expert Backed</span>
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">Supported by expert builders and advisors</h2>
                <p className="text-white/40 text-sm">Guided by veterans from elite engineering and medical institutions.</p>
              </div>
              <div className="flex -space-x-4">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-12 h-12 rounded-full border-2 border-black bg-white/10 overflow-hidden ring-4 ring-black/50">
                    <Image src={`https://i.pravatar.cc/150?u=${i+10}`} alt="Advisor" width={48} height={48} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: "IIT Systems Mentor", focus: "Architecture Scalability" },
              { label: "Healthcare AI Advisor", focus: "Clinical Diagnostics" },
              { label: "Cloud Architecture Specialist", focus: "Enterprise Security" },
              { label: "Product Strategy Mentor", focus: "Market Penetration" },
            ].map((item, i) => (
              <GlassCard key={i} className="p-6 text-center border-white/5 hover:border-[#eab308]/10 transition-colors">
                <p className="text-sm font-bold text-white/80 mb-1">{item.label}</p>
                <p className="text-[10px] font-mono text-[#eab308] uppercase tracking-widest">{item.focus}</p>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* ── 7. ROADMAP TIMELINE ── */}
        <section className="mb-40">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold mb-4">The Road to 2026</h2>
            <p className="text-white/40 max-w-xl mx-auto">Building the foundation of clinical-grade intelligence, one milestone at a time.</p>
          </div>
          
          <div className="relative max-w-4xl mx-auto">
            {/* Timeline Line */}
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-[#eab308] via-purple-500/50 to-transparent" />
            
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
                    <GlassCard className={`p-8 border-white/5 hover:border-white/10 transition-all ${i % 2 === 0 ? 'text-right' : 'text-left'}`}>
                      <p className="text-[#eab308] font-mono text-xs uppercase tracking-[0.2em] mb-2">{item.date}</p>
                      <h4 className="text-xl font-bold mb-3">{item.title}</h4>
                      <p className="text-sm text-white/50 leading-relaxed">{item.desc}</p>
                    </GlassCard>
                  </div>
                  
                  {/* Timeline Point */}
                  <div className="relative z-10 w-12 h-12 rounded-full bg-black border-2 border-[#eab308] flex items-center justify-center shadow-[0_0_20px_rgba(234,179,8,0.3)]">
                    <item.icon className="h-5 w-5 text-[#eab308]" />
                  </div>
                  
                  <div className="flex-1" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 8. TRUST SECTION ── */}
        <section className="mb-40 border-t border-white/5 pt-24">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center justify-items-center opacity-40 grayscale hover:grayscale-0 transition-all duration-1000">
            {[
              { label: "HIPAA-ready", icon: Shield },
              { label: "FHIR compatible", icon: Activity },
              { label: "E2E Encryption", icon: Lock },
              { label: "Audit Logging", icon: FileText },
              { label: "Cloud Native", icon: Globe },
            ].map((badge, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <badge.icon className="h-8 w-8 mb-2" />
                <p className="text-[10px] font-mono uppercase tracking-widest">{badge.label}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <p className="text-[10px] font-mono text-white/20 uppercase tracking-[0.5em]">No compromised security. No fake certifications. Clinical Grade Architecture.</p>
          </div>
        </section>

        {/* ── 9. FINAL CTA ── */}
        <section className="mb-20">
          <GlassCard className="p-16 md:p-24 text-center relative overflow-hidden bg-gradient-to-br from-[#0a0a0a] via-[#0d0a1a] to-[#050505] border-white/10">
             {/* Ambient glow */}
            <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-purple-600/10 blur-[120px] pointer-events-none" />
            <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[#eab308]/5 blur-[120px] pointer-events-none" />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-6xl font-bold mb-8">Help build the future <br /> health infrastructure layer.</h2>
              <div className="flex flex-wrap justify-center gap-6 mb-10">
                <Link href="/auth" className="px-10 py-5 bg-[#eab308] text-black font-bold rounded-xl hover:bg-[#ca8a04] transition-all transform hover:scale-105 shadow-xl shadow-[#eab308]/20">
                  Join Private Beta
                </Link>
                <Link href="/contact" className="px-10 py-5 bg-white/5 text-white font-bold rounded-xl border border-white/10 hover:bg-white/10 transition-all backdrop-blur-md">
                  Schedule Demo
                </Link>
              </div>
              <p className="text-xs font-mono text-white/30 uppercase tracking-[0.3em]">Launching private beta in 2026. Secure your node.</p>
            </motion.div>
          </GlassCard>
        </section>

      </div>
    </div>
  );
}

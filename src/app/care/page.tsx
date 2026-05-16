"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, ArrowRight, ShieldAlert, Stethoscope, Beaker, Pill, 
  Smartphone, Map, Dna, Brain, ChevronRight, CheckCircle2, Play
} from 'lucide-react';
import Image from 'next/image';

const GlassCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-white/[0.02] border border-white/5 backdrop-blur-md rounded-2xl ${className}`}>
    {children}
  </div>
);

export default function HealixCare() {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#eab308]/30 overflow-hidden font-sans">
      
      {/* BACKGROUND EFFECTS */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/20 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#eab308]/10 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
      </div>

      {/* HERO SECTION */}
      <section className="relative z-10 min-h-screen flex items-center pt-20 pb-20">
        <div className="max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm font-medium tracking-wide">
              <span className="w-2 h-2 rounded-full bg-[#eab308] animate-pulse" />
              HEALIX CARE
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight">
              Predict.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50">Prevent.</span><br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#eab308] to-[#ca8a04]">Protect.</span>
            </h1>
            
            <p className="text-lg text-white/60 max-w-xl leading-relaxed">
              AI-powered precision healthcare combining predictive diagnostics, expert doctor consultations, emergency intelligence, medicine delivery, and genomic risk assessment.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <button className="px-8 py-4 bg-white text-black font-semibold rounded-full hover:scale-105 transition-transform flex items-center gap-2">
                Get Started <ArrowRight className="w-4 h-4" />
              </button>
              <button className="px-8 py-4 bg-white/5 border border-white/10 font-semibold rounded-full hover:bg-white/10 transition-colors">
                Check Health Risk
              </button>
              <button className="px-8 py-4 bg-red-500/10 text-red-500 border border-red-500/20 font-semibold rounded-full hover:bg-red-500/20 transition-colors flex items-center gap-2">
                <ShieldAlert className="w-4 h-4" /> Emergency Care
              </button>
            </div>

            <div className="pt-8 border-t border-white/10 flex flex-wrap gap-6 text-sm text-white/40 font-medium">
              {['AI Powered', 'Research Driven', 'Preventive Intelligence', 'Clinical Precision'].map(badge => (
                <div key={badge} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#eab308]" /> {badge}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Dashboard Preview */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.2 }} className="relative h-[600px] hidden lg:block">
            {/* Holographic glowing lines in bg */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(234,179,8,0.1)_0%,transparent_70%)]" />
            
            <div className="absolute inset-0 grid grid-cols-2 gap-4 animate-[spin_120s_linear_infinite] opacity-20">
              <div className="border border-[#eab308]/20 rounded-full w-full h-full" />
              <div className="border border-blue-500/20 rounded-full w-full h-full" />
            </div>

            {/* Floating Widgets */}
            <GlassCard className="absolute top-10 left-0 p-4 border-[#eab308]/20 shadow-2xl shadow-[#eab308]/10 animate-pulse">
              <div className="flex items-center gap-3">
                <Dna className="text-[#eab308] w-6 h-6" />
                <div>
                  <div className="text-xs text-white/50">Genomic Risk Score</div>
                  <div className="text-xl font-bold text-[#eab308]">Low Risk (12%)</div>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="absolute top-40 right-0 p-4 border-blue-500/20 shadow-2xl w-64 translate-y-[-20px]">
              <div className="text-xs text-white/50 mb-2">Live Availability</div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="font-semibold">Dr. Sarah Chen</span>
                </div>
                <span className="text-xs bg-white/10 px-2 py-1 rounded">Cardiology</span>
              </div>
            </GlassCard>

            <GlassCard className="absolute bottom-32 left-10 p-4 border-red-500/20 shadow-2xl w-56">
              <div className="flex items-center gap-3">
                <Map className="text-red-500 w-6 h-6" />
                <div>
                  <div className="text-xs text-white/50">Ambulance ETA</div>
                  <div className="text-xl font-bold text-red-500">4 Mins Away</div>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="absolute bottom-10 right-10 p-4 shadow-2xl w-48">
              <div className="flex items-center gap-3">
                <Pill className="text-white/80 w-6 h-6" />
                <div>
                  <div className="text-xs text-white/50">Meds Delivery</div>
                  <div className="text-sm font-bold">Dispatched</div>
                </div>
              </div>
            </GlassCard>
            
            {/* Center piece */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="relative w-48 h-48 rounded-full border border-white/10 flex items-center justify-center bg-black/50 backdrop-blur-xl shadow-2xl shadow-blue-900/50">
                <Brain className="w-16 h-16 text-white/80" />
                <div className="absolute inset-0 border border-[#eab308]/30 rounded-full animate-ping opacity-20" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 2: CORE SERVICES */}
      <section className="py-24 relative z-10 border-t border-white/5 bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Core Services</h2>
            <p className="text-white/50 max-w-2xl mx-auto">An integrated ecosystem designed for speed, precision, and care.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Doctor Consultation", icon: Stethoscope, color: "text-blue-400", features: ["Video consult", "AI-assisted triage", "Prescription generation"], cta: "Consult Now" },
              { title: "Home Diagnostics", icon: Beaker, color: "text-[#eab308]", features: ["Book lab tests", "At-home collection", "AI interpretation"], cta: "Book Test" },
              { title: "Emergency Intelligence", icon: ShieldAlert, color: "text-red-500", glow: "hover:shadow-[0_0_30px_rgba(239,68,68,0.15)]", border: "hover:border-red-500/30", features: ["Ambulance dispatch", "Hospital routing", "Family alert automation"], cta: "Emergency SOS" },
              { title: "30-Min Medicine", icon: Pill, color: "text-emerald-400", features: ["Prescription verification", "Pharmacy automation", "Live route tracking"], cta: "Order Medicines" }
            ].map((s, i) => (
              <GlassCard key={i} className={`p-8 group hover:-translate-y-2 transition-all duration-300 ${s.glow || 'hover:shadow-[0_0_30px_rgba(255,255,255,0.05)]'} ${s.border || 'hover:border-white/20'}`}>
                <s.icon className={`w-8 h-8 ${s.color} mb-6`} />
                <h3 className="text-xl font-bold mb-4">{s.title}</h3>
                <ul className="space-y-3 mb-8">
                  {s.features.map(f => (
                    <li key={f} className="text-sm text-white/50 flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-white/20 mt-1.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-3 rounded-xl border border-white/10 text-sm font-semibold transition-colors flex items-center justify-center gap-2 group-hover:bg-white group-hover:text-black ${s.title.includes('Emergency') ? 'group-hover:bg-red-500 group-hover:text-white group-hover:border-red-500' : ''}`}>
                  {s.cta} <ArrowRight className="w-4 h-4" />
                </button>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: WHY HEALIX */}
      <section className="py-32 relative z-10 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold mb-6">Reactive vs Predictive</h2>
              <p className="text-white/50 text-lg mb-12">Healthcare is broken. It waits for you to get sick. Healix Care anticipates risk before symptoms appear, shifting the paradigm from reaction to prevention.</p>
              
              <div className="space-y-8">
                <div className="flex gap-4 opacity-50 grayscale">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center shrink-0">
                    <Activity className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-1 text-white">Traditional Healthcare</h4>
                    <p className="text-sm text-white/60">Reactive treatment only after severe illness escalation.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#eab308]/10 border border-[#eab308]/20 flex items-center justify-center shrink-0">
                    <Brain className="w-6 h-6 text-[#eab308]" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-1 text-[#eab308]">Healix Care</h4>
                    <p className="text-sm text-white/60">Predictive prevention and early intervention before escalation.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative h-[400px]">
              <GlassCard className="absolute inset-0 p-8 flex items-end">
                {/* Simulated Graph */}
                <div className="w-full h-full relative border-l border-b border-white/10 flex items-end gap-4 p-4">
                  <div className="absolute top-4 left-4 text-xs text-white/30 font-mono">Disease Severity</div>
                  <div className="absolute bottom-4 right-4 text-xs text-white/30 font-mono">Time</div>
                  
                  {/* Traditional Curve */}
                  <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                    <path d="M 0 100 C 40 100, 60 20, 100 10" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeDasharray="4 4" />
                    <text x="70" y="30" fill="rgba(255,255,255,0.4)" fontSize="4">Traditional Path</text>
                  </svg>
                  
                  {/* Healix Curve */}
                  <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                    <path d="M 0 100 C 20 80, 40 85, 100 90" fill="none" stroke="#eab308" strokeWidth="3" />
                    <circle cx="20" cy="88" r="2" fill="#eab308" />
                    <text x="25" y="86" fill="#eab308" fontSize="4">Healix Intervention</text>
                  </svg>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: HEALIX INTELLIGENCE ENGINE */}
      <section className="py-32 relative z-10 bg-[#020202] border-y border-white/5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-16">Intelligence Pipeline</h2>
          
          <div className="relative max-w-4xl mx-auto">
            {/* Flow Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#eab308] to-transparent -translate-x-1/2 opacity-30" />
            <div className="absolute left-1/2 top-0 w-px h-32 bg-[#eab308] -translate-x-1/2 shadow-[0_0_10px_#eab308] animate-[slide-down_3s_linear_infinite]" />

            <div className="flex flex-col gap-12 relative z-10">
              {['Patient Symptoms', 'AI Analysis', 'Risk Detection', 'Genomic Interpretation', 'Specialist Match', 'Preventive Action Plan'].map((step, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  key={step} 
                  className="flex justify-center"
                >
                  <div className="px-6 py-3 bg-black border border-white/10 rounded-full text-sm font-semibold tracking-wide shadow-xl flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#eab308]" />
                    {step}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mt-20">
            {['Explainable AI', 'Clinical Intelligence', 'Real-Time Support', 'Predictive Prevention'].map(badge => (
              <div key={badge} className="px-4 py-2 rounded-lg bg-white/5 text-xs font-mono text-white/50 border border-white/5">
                {badge}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: BIOLABS SHOWCASE */}
      <section className="py-32 relative z-10 bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Powered by Healix BioLabs</h2>
            <p className="text-white/50 max-w-2xl mx-auto">Real-time genomic intelligence for early breast cancer risk prediction.</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <GlassCard className="lg:col-span-1 p-8 flex flex-col justify-center items-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1)_0%,transparent_70%)]" />
              <Dna className="w-24 h-24 text-blue-500 animate-[spin_10s_linear_infinite]" />
              <div className="mt-8 text-center relative z-10">
                <div className="text-xs font-mono text-blue-400 mb-2">DNA HOLOGRAM ACTIVE</div>
                <div className="text-2xl font-bold">BRCA1 / BRCA2</div>
                <div className="text-sm text-white/50">Mutation Analysis</div>
              </div>
            </GlassCard>

            <GlassCard className="lg:col-span-2 p-8 grid grid-cols-2 gap-8">
              <div>
                <div className="text-sm text-white/50 mb-2">Confidence Score</div>
                <div className="text-5xl font-light text-[#eab308]">98.4<span className="text-2xl">%</span></div>
                <div className="mt-4 h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="w-[98.4%] h-full bg-[#eab308] shadow-[0_0_10px_#eab308]" />
                </div>
              </div>
              <div>
                <div className="text-sm text-white/50 mb-2">Risk Status</div>
                <div className="text-2xl font-bold text-green-400">Benign</div>
                <div className="mt-2 text-xs font-mono text-white/30">SHAP Value: -2.41</div>
              </div>
              <div className="col-span-2">
                <div className="text-sm text-white/50 mb-4">Explainability Heatmap</div>
                <div className="flex gap-2 h-12">
                  {[40, 20, 60, 10, 80, 30, 50, 90].map((v, i) => (
                    <div key={i} className="flex-1 bg-white/5 rounded relative overflow-hidden">
                      <div className="absolute bottom-0 w-full bg-blue-500/50" style={{ height: `${v}%` }} />
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* SECTION 6: DIGITAL TWIN */}
      <section className="py-32 relative z-10 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Health Digital Twin</h2>
            <p className="text-white/50 max-w-2xl">A real-time, AI-driven dashboard reflecting your complete biological state.</p>
          </div>

          <div className="w-full bg-[#111] rounded-[2rem] border border-white/10 p-4 shadow-2xl">
            <div className="w-full bg-black rounded-3xl overflow-hidden border border-white/5">
              {/* Mac Header */}
              <div className="h-10 bg-[#1a1a1a] flex items-center px-4 gap-2 border-b border-white/5">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
              </div>
              
              {/* Dashboard Content */}
              <div className="p-8 grid md:grid-cols-3 gap-6">
                <div className="space-y-6">
                  <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-white/5">
                    <div className="text-sm text-white/50 mb-2">Overall Health Score</div>
                    <div className="text-6xl font-bold text-white mb-2">92</div>
                    <div className="text-xs text-green-400">+4 pts since last month</div>
                  </div>
                  <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-white/5">
                    <div className="text-sm font-semibold mb-4">Upcoming Interventions</div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-white/60">Annual Blood Panel</span>
                        <span className="text-[#eab308]">Tomorrow</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-white/60">Cardio Check</span>
                        <span className="text-white/30">Next Week</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="md:col-span-2 bg-[#1a1a1a] p-6 rounded-2xl border border-white/5 flex flex-col">
                  <div className="text-sm font-semibold mb-6">Risk Progression Timeline</div>
                  <div className="flex-1 flex items-end gap-2">
                    {[10, 12, 11, 15, 14, 18, 22, 20, 18, 15, 12, 10].map((v, i) => (
                      <div key={i} className="flex-1 bg-white/5 rounded-t hover:bg-white/10 transition-colors relative group">
                        <div className="absolute bottom-0 w-full bg-[#eab308] rounded-t transition-all duration-500" style={{ height: `${v * 3}%` }} />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-black text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap">
                          Risk: {v}%
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-white/30 mt-4 font-mono">
                    <span>JAN</span><span>JUN</span><span>DEC</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: EMERGENCY INTELLIGENCE */}
      <section className="py-32 relative z-10 bg-[#0a0202] border-y border-red-900/30 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.05)_0%,transparent_100%)]" />
        
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 text-red-500 text-sm font-bold mb-8">
              <ShieldAlert className="w-4 h-4" /> SECONDS MATTER
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Emergency Intelligence</h2>
            <p className="text-white/50 text-lg mb-8">Auto-dispatch ambulances, map fastest hospital routes, and alert family members instantly with our SOS matrix.</p>
            
            <ul className="space-y-4 mb-8">
              {['Live Ambulance Tracking', 'Traffic-Optimized Routing', 'Hospital Bed Availability Sync', 'Automated Family Notifications'].map(item => (
                <li key={item} className="flex items-center gap-3 text-sm text-white/70">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full" /> {item}
                </li>
              ))}
            </ul>
            
            <button className="px-8 py-4 bg-red-600 text-white font-bold rounded-xl hover:bg-red-500 transition-colors shadow-[0_0_30px_rgba(220,38,38,0.3)]">
              Activate Demo
            </button>
          </div>

          <div className="relative h-[500px] bg-[#110505] rounded-[2rem] border border-red-500/20 overflow-hidden shadow-2xl p-6 flex flex-col justify-between">
            {/* Map lines simulation */}
            <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M10 90 L 40 60 L 60 70 L 90 20" fill="none" stroke="white" strokeWidth="0.5" />
              <path d="M10 90 L 40 60 L 60 70 L 90 20" fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="5 5" className="animate-[dash_2s_linear_infinite]" />
            </svg>
            
            <div className="flex justify-between items-start relative z-10">
              <div className="bg-black/80 backdrop-blur border border-white/10 px-4 py-2 rounded-lg text-xs font-mono">
                <div className="text-white/50">DESTINATION</div>
                <div className="text-white font-bold">Central Hospital</div>
              </div>
              <div className="bg-red-500/20 text-red-500 border border-red-500/30 px-4 py-2 rounded-lg text-xs font-bold animate-pulse">
                ETA: 4 MIN
              </div>
            </div>

            <div className="bg-black/80 backdrop-blur border border-white/10 p-4 rounded-xl relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center animate-bounce">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-sm font-bold">Ambulance #402</div>
                  <div className="text-xs text-white/50">En Route to Patient</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8: PATIENT JOURNEY */}
      <section className="py-32 relative z-10 bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">The Patient Journey</h2>
            <p className="text-white/50 max-w-2xl mx-auto">A seamless continuum of care.</p>
          </div>

          <div className="relative">
            {/* Horizontal Line */}
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/5 -translate-y-1/2 hidden md:block" />
            <div className="absolute top-1/2 left-0 w-1/3 h-0.5 bg-gradient-to-r from-[#eab308] to-transparent -translate-y-1/2 hidden md:block" />

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {['Signup', 'AI Assessment', 'Consultation', 'Diagnostics', 'Prediction', 'Action Plan', 'Monitoring'].map((step, i) => (
                <div key={step} className="relative flex flex-col items-center text-center group">
                  <div className={`w-4 h-4 rounded-full border-2 border-black mb-4 relative z-10 transition-colors ${i < 3 ? 'bg-[#eab308]' : 'bg-white/20 group-hover:bg-white/50'}`} />
                  <div className="text-xs font-bold uppercase tracking-wider text-white/80">{step}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 10: MOBILE APP (Skipped 9 to save space, App is cooler) */}
      <section className="py-32 relative z-10 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Care in your pocket.</h2>
            <p className="text-white/50 text-lg mb-8">Download the Healix app to access your digital twin, book instantaneous consultations, and order 30-minute medicine delivery.</p>
            
            <div className="flex gap-4">
              <button className="flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
                <div className="text-left">
                  <div className="text-[10px] text-white/50">Download on the</div>
                  <div className="text-sm font-bold">App Store</div>
                </div>
              </button>
              <button className="flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
                <div className="text-left">
                  <div className="text-[10px] text-white/50">GET IT ON</div>
                  <div className="text-sm font-bold">Google Play</div>
                </div>
              </button>
            </div>
          </div>

          <div className="flex justify-center gap-6">
            <div className="w-48 h-96 bg-black rounded-[2.5rem] border-4 border-[#222] shadow-2xl overflow-hidden relative translate-y-8">
              <div className="absolute top-0 inset-x-0 h-6 bg-[#222] rounded-b-xl w-24 mx-auto" />
              <div className="p-4 pt-10">
                <div className="w-full h-32 bg-white/5 rounded-xl mb-4" />
                <div className="w-full h-12 bg-white/5 rounded-xl mb-2" />
                <div className="w-full h-12 bg-white/5 rounded-xl" />
              </div>
            </div>
            <div className="w-48 h-96 bg-black rounded-[2.5rem] border-4 border-[#222] shadow-2xl overflow-hidden relative -translate-y-8">
              <div className="absolute top-0 inset-x-0 h-6 bg-[#222] rounded-b-xl w-24 mx-auto" />
              <div className="p-4 pt-10">
                <div className="flex justify-between items-end mb-8">
                  <div className="w-16 h-16 rounded-full bg-[#eab308]/20 border border-[#eab308]/30" />
                  <div className="text-right">
                    <div className="text-[10px] text-white/50">Score</div>
                    <div className="text-2xl font-bold">96</div>
                  </div>
                </div>
                <div className="w-full h-20 bg-blue-500/10 border border-blue-500/20 rounded-xl mb-2" />
                <div className="w-full h-20 bg-green-500/10 border border-green-500/20 rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 11: FINAL CTA & FOOTER */}
      <section className="pt-32 pb-16 relative z-10 bg-black overflow-hidden text-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(234,179,8,0.1)_0%,transparent_50%)]" />
        
        <div className="max-w-4xl mx-auto px-6 relative z-10 mb-32">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Healthcare Should Predict Problems — <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white/50 to-white/20">Not Just Treat Them</span>
          </h2>
          <p className="text-white/50 text-xl mb-12">The future of preventive intelligence is here.</p>
          
          <button className="px-10 py-5 bg-[#eab308] text-black font-bold text-lg rounded-full hover:bg-[#fef08a] hover:scale-105 transition-all shadow-[0_0_40px_rgba(234,179,8,0.3)]">
            Launch Healix Care
          </button>
        </div>

        {/* Footer */}
        <footer className="border-t border-white/10 pt-16 relative z-10">
          <div className="flex flex-col items-center justify-center mb-8">
            <h3 className="text-2xl font-bold tracking-widest mb-2 flex items-center gap-2">
              <span className="w-3 h-3 bg-[#eab308] rounded-full" /> HEALIX
            </h3>
            <p className="text-sm font-semibold text-white/60">Healix Technologies Pvt. Ltd.</p>
            <p className="text-xs text-white/40 mt-1 font-serif tracking-widest opacity-80">
              जैव-चिकित्सीय अनुसंधान एवं अभियांत्रिकी केंद्र
            </p>
          </div>
          <div className="text-[10px] text-white/20 uppercase tracking-widest">
            © 2026 Healix Intelligence. All rights reserved.
          </div>
        </footer>
      </section>

    </div>
  );
}

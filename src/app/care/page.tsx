"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, ArrowRight, ShieldAlert, Stethoscope, Beaker, Pill, 
  Smartphone, Map, Dna, Brain, ChevronRight, CheckCircle2, Play
} from 'lucide-react';
import Image from 'next/image';

const GlassCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-white border border-zinc-200 rounded-xl shadow-sm transition-all duration-350 ${className}`}>
    {children}
  </div>
);

export default function HealixCare() {
  return (
    <div className="relative min-h-screen bg-white text-zinc-900 selection:bg-yellow-500/20 overflow-hidden font-sans pb-20">
      
      {/* BACKGROUND EFFECTS */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
        <div className="absolute inset-0 bg-dot-pattern opacity-[0.02]" />
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-500/5 blur-[140px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-yellow-500/5 blur-[140px] rounded-full" />
      </div>

      {/* HERO SECTION */}
      <section className="relative z-10 min-h-screen flex items-center pt-20 pb-20">
        <div className="max-w-[94%] mx-auto px-6 w-full grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-50 border border-zinc-200 text-xs font-mono tracking-wider uppercase text-zinc-600">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ea580c] animate-pulse" />
              AVENNIX PHARMA
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black leading-[1.05] tracking-tight text-zinc-950 font-mono uppercase">
              Predict.<br />
              Prevent.<br />
              <span className="text-[#ea580c]">Protect.</span>
            </h1>
            
            <p className="text-sm md:text-base text-zinc-700 max-w-xl leading-relaxed">
              AI-powered precision healthcare combining predictive diagnostics, expert doctor consultations, emergency intelligence, medicine delivery, and genomic risk assessment.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <button className="h-12 px-6 bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center gap-2 shadow-md cursor-pointer">
                Get Started <ArrowRight className="w-4 h-4" />
              </button>
              <button className="h-12 px-6 bg-white border border-zinc-300 text-zinc-700 font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-zinc-50 transition-all cursor-pointer">
                Check Health Risk
              </button>
              <button className="h-12 px-6 bg-red-50 text-red-650 border border-red-200 font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-red-100 transition-colors flex items-center gap-2 cursor-pointer">
                <ShieldAlert className="w-4 h-4" /> Emergency Care
              </button>
            </div>

            <div className="pt-8 border-t border-zinc-200 flex flex-wrap gap-6 text-[10px] text-zinc-600 font-mono uppercase tracking-widest">
              {['AI Powered', 'Research Driven', 'Preventive Intelligence', 'Clinical Precision'].map(badge => (
                <div key={badge} className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#ea580c]" /> {badge}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Dashboard Preview */}
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.2 }} className="relative h-[600px] hidden lg:block">
            {/* Holographic glowing lines in bg */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(234,88,12,0.03)_0%,transparent_70%)]" />
            
            <div className="absolute inset-0 grid grid-cols-2 gap-4 animate-[spin_180s_linear_infinite] opacity-10">
              <div className="border border-[#ea580c]/25 rounded-full w-full h-full" />
              <div className="border border-blue-500/25 rounded-full w-full h-full" />
            </div>

            {/* Floating Widgets */}
            <GlassCard className="absolute top-10 left-0 p-5 border-zinc-200 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-50 border border-orange-100 rounded-lg">
                  <Dna className="text-[#ea580c] w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] text-zinc-600 font-mono uppercase tracking-wider">Genomic Risk Score</div>
                  <div className="text-lg font-bold text-[#ea580c] font-mono">Low Risk (12%)</div>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="absolute top-40 right-0 p-5 border-zinc-200 shadow-lg w-64 translate-y-[-20px]">
              <div className="text-[10px] text-zinc-600 font-mono uppercase tracking-wider mb-2">Live Availability</div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="font-bold text-xs text-zinc-800">Dr. Sarah Chen</span>
                </div>
                <span className="text-[9px] font-mono bg-zinc-50 border border-zinc-200 px-2 py-0.5 rounded text-zinc-600">Cardiology</span>
              </div>
            </GlassCard>

            <GlassCard className="absolute bottom-32 left-10 p-5 border-zinc-200 shadow-lg w-56">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-50 border border-red-100 rounded-lg">
                  <Map className="text-red-500 w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] text-zinc-600 font-mono uppercase tracking-wider">Ambulance ETA</div>
                  <div className="text-lg font-bold text-red-500 font-mono">4 Mins Away</div>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="absolute bottom-10 right-10 p-5 shadow-lg w-48 border-zinc-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-zinc-50 border border-zinc-200 rounded-lg">
                  <Pill className="text-zinc-600 w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] text-zinc-600 font-mono uppercase tracking-wider">Meds Delivery</div>
                  <div className="text-xs font-bold text-zinc-700">Dispatched</div>
                </div>
              </div>
            </GlassCard>
            
            {/* Center piece */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="relative w-44 h-44 rounded-full border border-zinc-200 flex items-center justify-center bg-zinc-50/90 backdrop-blur-xl shadow-lg">
                <Brain className="w-12 h-12 text-[#ea580c]" />
                <div className="absolute inset-0 border border-orange-500/10 rounded-full animate-ping opacity-20" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 2: CORE SERVICES */}
      <section className="py-24 relative z-10 border-t border-zinc-200 bg-zinc-50">
        <div className="max-w-[94%] mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-4xl font-bold mb-4 font-mono tracking-tight text-zinc-950 uppercase">Core Services</h2>
            <div className="w-16 h-1 bg-[#ea580c] mx-auto mt-2 rounded-full" />
            <p className="text-xs md:text-sm text-zinc-600 max-w-2xl mx-auto uppercase tracking-wider font-mono mt-3">An integrated ecosystem designed for speed, precision, and care.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Doctor Consultation", icon: Stethoscope, color: "text-blue-600", bg: "bg-blue-50 border-blue-100", features: ["Video consult", "AI-assisted triage", "Prescription generation"], cta: "Consult Now" },
              { title: "Home Diagnostics", icon: Beaker, color: "text-[#ea580c]", bg: "bg-orange-50 border-orange-100", features: ["Book lab tests", "At-home collection", "AI interpretation"], cta: "Book Test" },
              { title: "Emergency Intelligence", icon: ShieldAlert, color: "text-red-500", bg: "bg-red-50 border-red-100", features: ["Ambulance dispatch", "Hospital routing", "Family alert automation"], cta: "Emergency SOS" },
              { title: "30-Min Medicine", icon: Pill, color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100", features: ["Prescription verification", "Pharmacy automation", "Live route tracking"], cta: "Order Medicines" }
            ].map((s, i) => (
              <GlassCard key={i} className={`p-8 bg-white border border-zinc-200 group hover:-translate-y-1 hover:shadow-md hover:border-zinc-300`}>
                <div className={`w-12 h-12 rounded-lg border ${s.bg} flex items-center justify-center mb-6`}>
                  <s.icon className={`w-6 h-6 ${s.color}`} />
                </div>
                <h3 className="text-base font-bold mb-4 text-zinc-900 font-mono uppercase">{s.title}</h3>
                <ul className="space-y-3 mb-8">
                  {s.features.map(f => (
                    <li key={f} className="text-xs text-zinc-600 flex items-start gap-2 leading-relaxed">
                      <div className="w-1 h-1 rounded-full bg-[#ea580c] mt-1.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <button className="w-full h-10 rounded-lg border border-zinc-300 hover:border-[#ea580c] text-xs font-mono font-bold uppercase transition-all flex items-center justify-center gap-2 group-hover:bg-[#ea580c] group-hover:text-white group-hover:border-[#ea580c] cursor-pointer">
                  {s.cta} <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: WHY HEALIX */}
      <section className="py-32 relative z-10 bg-white">
        <div className="max-w-[94%] mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-2xl md:text-4xl font-bold mb-6 font-mono tracking-tight text-zinc-950 uppercase">Reactive vs Predictive</h2>
              <p className="text-zinc-600 text-sm md:text-base leading-relaxed mb-12">Healthcare is broken. It waits for you to get sick. Healix Care anticipates risk before symptoms appear, shifting the paradigm from reaction to prevention.</p>
              
              <div className="space-y-8">
                <div className="flex gap-4 opacity-50">
                  <div className="w-10 h-10 rounded-lg bg-zinc-50 border border-zinc-200 flex items-center justify-center shrink-0">
                    <Activity className="w-5 h-5 text-zinc-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-700 font-mono mb-1 uppercase">Traditional Healthcare</h4>
                    <p className="text-xs text-zinc-600">Reactive treatment only after severe illness escalation.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0">
                    <Brain className="w-5 h-5 text-[#ea580c]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#ea580c] font-mono mb-1 uppercase">Healix Care</h4>
                    <p className="text-xs text-zinc-600 font-medium">Predictive prevention and early intervention before escalation.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative h-[400px]">
              <GlassCard className="absolute inset-0 p-8 flex items-end border-zinc-200 bg-zinc-50/50">
                {/* Simulated Graph */}
                <div className="w-full h-full relative border-l border-b border-zinc-300 flex items-end gap-4 p-4">
                  <div className="absolute top-4 left-4 text-[9px] text-zinc-600 font-mono uppercase tracking-wider">Disease Severity</div>
                  <div className="absolute bottom-4 right-4 text-[9px] text-zinc-600 font-mono uppercase tracking-wider">Time</div>
                  
                  {/* Traditional Curve */}
                  <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                    <path d="M 0 100 C 40 100, 60 20, 100 10" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="1.5" strokeDasharray="3 3" />
                    <text x="70" y="30" fill="rgba(0,0,0,0.35)" fontSize="3.5" fontFamily="monospace">Traditional Path</text>
                  </svg>
                  
                  {/* Healix Curve */}
                  <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                    <path d="M 0 100 C 20 80, 40 85, 100 90" fill="none" stroke="#ea580c" strokeWidth="2" />
                    <circle cx="20" cy="88" r="1.5" fill="#ea580c" />
                    <text x="25" y="86" fill="#ea580c" fontSize="3.5" fontFamily="monospace">Healix Intervention</text>
                  </svg>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: HEALIX INTELLIGENCE ENGINE */}
      <section className="py-32 relative z-10 bg-zinc-50 border-y border-zinc-200 overflow-hidden">
        <div className="max-w-[94%] mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-4xl font-bold mb-16 font-mono tracking-tight text-zinc-950 uppercase">Intelligence Pipeline</h2>
          
          <div className="relative max-w-4xl mx-auto">
            {/* Flow Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#ea580c] to-transparent -translate-x-1/2" />

            <div className="flex flex-col gap-12 relative z-10">
              {['Patient Symptoms', 'AI Analysis', 'Risk Detection', 'Genomic Interpretation', 'Specialist Match', 'Preventive Action Plan'].map((step, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  key={step} 
                  className="flex justify-center"
                >
                  <div className="px-5 py-2.5 bg-white border border-zinc-200 rounded-full text-xs font-mono font-bold tracking-wider uppercase shadow-sm flex items-center gap-3 text-zinc-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ea580c]" />
                    {step}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mt-20">
            {['Explainable AI', 'Clinical Intelligence', 'Real-Time Support', 'Predictive Prevention'].map(badge => (
              <div key={badge} className="px-4 py-2 rounded-lg bg-white text-[10px] font-mono text-zinc-600 border border-zinc-200">
                {badge}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: BIOLABS SHOWCASE */}
      <section className="py-32 relative z-10 bg-white">
        <div className="max-w-[94%] mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-4xl font-bold mb-4 font-mono tracking-tight text-zinc-950 uppercase">Powered by Healix BioLabs</h2>
            <div className="w-16 h-1 bg-[#ea580c] mx-auto mt-2 rounded-full" />
            <p className="text-xs md:text-sm text-zinc-600 max-w-2xl mx-auto uppercase tracking-wider font-mono mt-3">Real-time genomic intelligence for early breast cancer risk prediction.</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <GlassCard className="lg:col-span-1 p-8 flex flex-col justify-center items-center relative overflow-hidden border-zinc-200 bg-zinc-50/50">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(234,88,12,0.03)_0%,transparent_70%)]" />
              <Dna className="w-20 h-20 text-[#ea580c] animate-[spin_15s_linear_infinite]" />
              <div className="mt-8 text-center relative z-10">
                <div className="text-[9px] font-mono text-[#ea580c] mb-2 uppercase tracking-widest font-bold">DNA Hologram Active</div>
                <div className="text-xl font-bold font-mono text-zinc-800">BRCA1 / BRCA2</div>
                <div className="text-xs text-zinc-600 mt-1">Mutation Analysis</div>
              </div>
            </GlassCard>

            <GlassCard className="lg:col-span-2 p-8 grid grid-cols-2 gap-8 border-zinc-200 bg-zinc-50/50">
              <div>
                <div className="text-[10px] text-zinc-600 font-mono uppercase tracking-wider mb-2">Confidence Score</div>
                <div className="text-4xl font-bold text-[#ea580c] font-mono">98.4<span className="text-xl font-medium">%</span></div>
                <div className="mt-4 h-1.5 bg-zinc-200 rounded-full overflow-hidden border border-zinc-150">
                  <div className="w-[98.4%] h-full bg-[#ea580c]" />
                </div>
              </div>
              <div>
                <div className="text-[10px] text-zinc-600 font-mono uppercase tracking-wider mb-2">Risk Status</div>
                <div className="text-xl font-bold text-green-600 font-mono">Benign</div>
                <div className="mt-2.5 text-[9px] font-mono text-zinc-400">SHAP Value: -2.41</div>
              </div>
              <div className="col-span-2">
                <div className="text-[10px] text-zinc-600 font-mono uppercase tracking-wider mb-4">Explainability Heatmap</div>
                <div className="flex gap-2 h-10">
                  {[40, 20, 60, 10, 80, 30, 50, 90].map((v, i) => (
                    <div key={i} className="flex-1 bg-zinc-200 rounded border border-zinc-150 relative overflow-hidden">
                      <div className="absolute bottom-0 w-full bg-[#ea580c]/50" style={{ height: `${v}%` }} />
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* SECTION 6: DIGITAL TWIN */}
      <section className="py-32 relative z-10 bg-zinc-50 border-t border-zinc-200">
        <div className="max-w-[94%] mx-auto px-6">
          <div className="mb-16">
            <h2 className="text-2xl md:text-4xl font-bold mb-4 font-mono tracking-tight text-zinc-950 uppercase">Health Digital Twin</h2>
            <div className="w-16 h-1 bg-[#ea580c] mt-2 rounded-full" />
            <p className="text-xs md:text-sm text-zinc-600 uppercase tracking-wider font-mono mt-3">A real-time, AI-driven dashboard reflecting your complete biological state.</p>
          </div>

          <div className="w-full bg-zinc-100 rounded-2xl border border-zinc-200 p-3 shadow-sm">
            <div className="w-full bg-white rounded-xl overflow-hidden border border-zinc-200">
              {/* Mac Header */}
              <div className="h-10 bg-zinc-50 flex items-center px-4 gap-1.5 border-b border-zinc-150">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-300" />
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-300" />
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-300" />
                </div>
              </div>
              
              {/* Dashboard Content */}
              <div className="p-6 md:p-8 grid md:grid-cols-3 gap-6">
                <div className="space-y-6">
                  <div className="bg-zinc-50 p-6 rounded-xl border border-zinc-200">
                    <div className="text-[10px] text-zinc-600 font-mono uppercase tracking-wider mb-2">Overall Health Score</div>
                    <div className="text-5xl font-bold text-zinc-900 mb-2 font-mono">92</div>
                    <div className="text-[9px] text-green-600 font-mono font-medium">+4 pts since last month</div>
                  </div>
                  <div className="bg-zinc-50 p-6 rounded-xl border border-zinc-200">
                    <div className="text-xs font-bold text-zinc-800 font-mono uppercase tracking-wider mb-4 border-b border-zinc-200 pb-2">Upcoming Interventions</div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-zinc-650">Annual Blood Panel</span>
                        <span className="text-[#ea580c] font-mono font-bold">Tomorrow</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-zinc-650">Cardio Check</span>
                        <span className="text-zinc-400 font-mono">Next Week</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="md:col-span-2 bg-zinc-50 p-6 rounded-xl border border-zinc-200 flex flex-col justify-between">
                  <div className="text-xs font-bold text-zinc-800 font-mono uppercase tracking-wider mb-6">Risk Progression Timeline</div>
                  <div className="flex-1 flex items-end gap-2 h-36">
                    {[10, 12, 11, 15, 14, 18, 22, 20, 18, 15, 12, 10].map((v, i) => (
                      <div key={i} className="flex-1 bg-zinc-200 rounded-t hover:bg-zinc-350 transition-all duration-200 relative group h-full flex items-end">
                        <div className="w-full bg-[#ea580c]/60 rounded-t transition-all duration-300 group-hover:bg-[#ea580c]" style={{ height: `${v * 4}%` }} />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white border border-zinc-200 text-[9px] font-mono px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-20 text-zinc-700 shadow-md">
                          Risk: {v}%
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between text-[10px] text-zinc-400 mt-4 font-mono">
                    <span>JAN</span><span>JUN</span><span>DEC</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: EMERGENCY INTELLIGENCE */}
      <section className="py-32 relative z-10 bg-white border-y border-zinc-200 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.02)_0%,transparent_100%)]" />
        
        <div className="max-w-[94%] mx-auto px-6 grid md:grid-cols-2 gap-16 items-center relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-650 border border-red-200 text-[10px] font-mono uppercase tracking-wider mb-8">
              <ShieldAlert className="w-3.5 h-3.5" /> Seconds Matter
            </div>
            <h2 className="text-2xl md:text-4xl font-bold mb-6 font-mono tracking-tight text-zinc-950 uppercase">Emergency Intelligence</h2>
            <p className="text-zinc-700 text-sm md:text-base leading-relaxed mb-8">Auto-dispatch ambulances, map fastest hospital routes, and alert family members instantly with our SOS matrix.</p>
            
            <ul className="space-y-4 mb-8">
              {['Live Ambulance Tracking', 'Traffic-Optimized Routing', 'Hospital Bed Availability Sync', 'Automated Family Notifications'].map(item => (
                <li key={item} className="flex items-center gap-3 text-xs text-zinc-600 leading-relaxed font-mono">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full" /> {item}
                </li>
              ))}
            </ul>
            
            <button className="h-12 px-6 bg-red-600 hover:bg-red-750 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors shadow-md">
              Activate Demo
            </button>
          </div>

          <div className="relative h-[500px] bg-zinc-50 rounded-2xl border border-zinc-200 overflow-hidden shadow-sm p-6 flex flex-col justify-between">
            {/* Map lines simulation */}
            <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M10 90 L 40 60 L 60 70 L 90 20" fill="none" stroke="#18181b" strokeWidth="0.5" />
              <path d="M10 90 L 40 60 L 60 70 L 90 20" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3 3" />
            </svg>
            
            <div className="flex justify-between items-start relative z-10">
              <div className="bg-white/90 backdrop-blur border border-zinc-200 px-4 py-2.5 rounded-lg text-[10px] font-mono">
                <div className="text-zinc-400 uppercase tracking-wider">Destination</div>
                <div className="text-zinc-800 font-bold mt-0.5">Central Hospital</div>
              </div>
              <div className="bg-red-50 text-red-500 border border-red-200 px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold animate-pulse">
                ETA: 4 MIN
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur border border-zinc-200 p-4 rounded-xl relative z-10 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-50 border border-red-200 rounded-lg flex items-center justify-center text-red-500">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-zinc-800 font-mono">Ambulance #402</div>
                  <div className="text-[10px] text-zinc-600 mt-0.5 font-mono">En Route to Patient</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8: PATIENT JOURNEY */}
      <section className="py-32 relative z-10 bg-white">
        <div className="max-w-[94%] mx-auto px-6">
          <div className="text-center mb-24">
            <h2 className="text-2xl md:text-4xl font-bold mb-4 font-mono tracking-tight text-zinc-950 uppercase">The Patient Journey</h2>
            <div className="w-16 h-1 bg-[#ea580c] mx-auto mt-2 rounded-full" />
            <p className="text-xs md:text-sm text-zinc-600 max-w-2xl mx-auto uppercase tracking-wider font-mono mt-3">A seamless continuum of care.</p>
          </div>

          <div className="relative">
            {/* Horizontal Line */}
            <div className="absolute top-1/2 left-0 w-full h-px bg-zinc-200 -translate-y-1/2 hidden md:block" />
            <div className="absolute top-1/2 left-0 w-1/3 h-px bg-gradient-to-r from-orange-500/60 to-transparent -translate-y-1/2 hidden md:block" />

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6 relative z-10">
              {['Signup', 'AI Assessment', 'Consultation', 'Diagnostics', 'Prediction', 'Action Plan', 'Monitoring'].map((step, i) => (
                <div key={step} className="relative flex flex-col items-center text-center group">
                  <div className={`w-3.5 h-3.5 rounded-full border-2 border-zinc-200 mb-4 transition-colors ${i < 3 ? 'bg-[#ea580c]' : 'bg-zinc-200 group-hover:bg-zinc-400'}`} />
                  <div className="text-[10px] font-bold font-mono uppercase tracking-wider text-zinc-600 group-hover:text-zinc-800 transition-colors">{step}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 10: MOBILE APP */}
      <section className="py-32 relative z-10 bg-zinc-50">
        <div className="max-w-[94%] mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-5xl font-bold font-mono tracking-tight text-zinc-950 uppercase leading-tight">Care in your pocket.</h2>
            <p className="text-zinc-700 text-sm md:text-base leading-relaxed">Download the Healix app to access your digital twin, book instantaneous consultations, and order 30-minute medicine delivery.</p>
            
            <div className="flex gap-4">
              <button className="flex items-center gap-3 h-12 px-5 bg-zinc-950 hover:bg-zinc-900 text-white rounded-lg transition-all text-left cursor-pointer">
                <Smartphone className="w-5 h-5 text-zinc-400" />
                <div>
                  <div className="text-[8px] text-zinc-400 font-mono uppercase tracking-widest">Download on the</div>
                  <div className="text-xs font-bold text-white">App Store</div>
                </div>
              </button>
              <button className="flex items-center gap-3 h-12 px-5 bg-zinc-950 hover:bg-zinc-900 text-white rounded-lg transition-all text-left cursor-pointer">
                <Smartphone className="w-5 h-5 text-zinc-400" />
                <div>
                  <div className="text-[8px] text-zinc-400 font-mono uppercase tracking-widest">GET IT ON</div>
                  <div className="text-xs font-bold text-white">Google Play</div>
                </div>
              </button>
            </div>
          </div>

          <div className="flex justify-center gap-6">
            <div className="w-48 h-96 bg-zinc-200 rounded-[2.25rem] border-[4px] border-zinc-300 shadow-lg overflow-hidden relative translate-y-8">
              <div className="absolute top-0 inset-x-0 h-4 bg-zinc-300 rounded-b-xl w-24 mx-auto" />
              <div className="p-4 pt-10 space-y-4">
                <div className="w-full h-32 bg-white border border-zinc-150 rounded-xl" />
                <div className="w-full h-10 bg-white border border-zinc-150 rounded-xl" />
                <div className="w-full h-10 bg-white border border-zinc-150 rounded-xl" />
              </div>
            </div>
            <div className="w-48 h-96 bg-zinc-200 rounded-[2.25rem] border-[4px] border-zinc-300 shadow-lg overflow-hidden relative -translate-y-8">
              <div className="absolute top-0 inset-x-0 h-4 bg-zinc-300 rounded-b-xl w-24 mx-auto" />
              <div className="p-4 pt-10 space-y-4">
                <div className="flex justify-between items-end mb-4 border-b border-zinc-150 pb-3">
                  <div className="w-10 h-10 rounded-full bg-orange-50 border border-orange-100" />
                  <div className="text-right">
                    <div className="text-[9px] text-zinc-600 font-mono uppercase">Score</div>
                    <div className="text-lg font-bold text-zinc-800 font-mono leading-none mt-1">96</div>
                  </div>
                </div>
                <div className="w-full h-16 bg-blue-50 border border-blue-100 rounded-xl" />
                <div className="w-full h-16 bg-green-50 border border-green-150 rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 11: FINAL CTA */}
      <section className="pt-32 pb-20 relative z-10 bg-white overflow-hidden text-center border-t border-zinc-200">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(234,88,12,0.03)_0%,transparent_50%)]" />
        
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold font-mono tracking-tight text-zinc-950 mb-6 leading-tight uppercase">
            Healthcare Should Predict Problems — <br />
            Not Just Treat Them
          </h2>
          <p className="text-zinc-700 text-sm md:text-base font-mono uppercase tracking-wider mb-12">The future of preventive intelligence is here.</p>
          
          <button className="h-14 px-8 bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-all shadow-md cursor-pointer">
            Launch Healix Care
          </button>
        </div>
      </section>

    </div>
  );
}

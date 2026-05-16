"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { 
  Stethoscope, FlaskConical, Pill, ShieldAlert, 
  ArrowRight, PhoneCall, MapPin, Hospital, 
  Activity, Smartphone, Play, CheckCircle, 
  Clock, Zap, Server, Database, Globe, Shield, X, AlertTriangle, Users
} from "lucide-react";

// Number Counter Hook
const useCounter = (end: number, duration: number = 2000) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [end, duration]);

  return count;
};

// Section Header Component
const SectionTitle = ({ title, subtitle, accent = "text-[#eab308]" }: { title: string, subtitle?: string, accent?: string }) => (
  <div className="text-center mb-16">
    <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">{title}</h2>
    {subtitle && <p className="text-white/50 text-lg max-w-2xl mx-auto">{subtitle}</p>}
    <div className={`w-20 h-1 mt-6 mx-auto rounded-full bg-gradient-to-r ${accent.replace('text-', 'from-').replace(']', ']/50')} to-transparent`} />
  </div>
);

export default function CarePage() {
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);

  // Counters for Dashboard
  const deliveries = useCounter(5420, 2500);
  const ambulances = useCounter(142, 2500);
  const doctors = useCounter(385, 2500);
  const tests = useCounter(2890, 2500);

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#eab308]/30 selection:text-white pb-24 overflow-hidden">
      
      {/* ── HERO SECTION ── */}
      <section className="pt-32 pb-20 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#eab308_0%,transparent_20%)] opacity-20 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#eab308]/10 border border-[#eab308]/20 mb-8">
            <Activity className="w-4 h-4 text-[#eab308] animate-pulse" />
            <span className="text-xs font-mono text-[#eab308] uppercase tracking-widest">Healix Care Network Live</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl md:text-7xl font-bold tracking-tighter mb-6">
            Clinical-Grade Care.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#eab308] to-[#fef08a]">Delivered Instantly.</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-lg text-white/50 max-w-2xl mx-auto mb-10">
            Advanced infrastructure connecting you to rapid medicine delivery, instant lab tests, and emergency response networks powered by AI routing.
          </motion.p>
        </div>
      </section>

      {/* ── SECTION 1: SERVICES GRID ── */}
      <section className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <SectionTitle title="Core Care Services" subtitle="Choose from our primary clinical-grade service networks." />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Medicine */}
            <GlassCard className="p-8 border-white/5 hover:border-[#eab308]/30 hover:bg-white/[0.02] transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#eab308]/5 rounded-full blur-3xl group-hover:bg-[#eab308]/10 transition-colors" />
              <div className="w-14 h-14 bg-[#eab308]/10 rounded-2xl flex items-center justify-center mb-6 border border-[#eab308]/20">
                <Pill className="w-7 h-7 text-[#eab308]" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Medicines in 30 Minutes</h3>
              <p className="text-white/50 mb-6 h-12">Instant doorstep delivery via our automated pharmacy network.</p>
              <ul className="space-y-3 mb-8">
                {['Nearby pharmacy automation', 'AI prescription validation', 'Route optimization', 'Live tracking'].map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-white/70">
                    <CheckCircle className="w-4 h-4 text-[#eab308]" /> {f}
                  </li>
                ))}
              </ul>
              <Button className="w-full justify-between group/btn">
                Order Now <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </GlassCard>

            {/* Labs */}
            <GlassCard className="p-8 border-white/5 hover:border-[#eab308]/30 hover:bg-white/[0.02] transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#eab308]/5 rounded-full blur-3xl group-hover:bg-[#eab308]/10 transition-colors" />
              <div className="w-14 h-14 bg-[#eab308]/10 rounded-2xl flex items-center justify-center mb-6 border border-[#eab308]/20">
                <FlaskConical className="w-7 h-7 text-[#eab308]" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Diagnostic Testing at Your Doorstep</h3>
              <p className="text-white/50 mb-6 h-12">Certified sample collection with AI-powered instant report analysis.</p>
              <ul className="space-y-3 mb-8">
                {['Certified phlebotomists', 'Slot scheduling', 'Instant report dashboard', 'AI interpretation engine'].map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-white/70">
                    <CheckCircle className="w-4 h-4 text-[#eab308]" /> {f}
                  </li>
                ))}
              </ul>
              <Button className="w-full justify-between group/btn">
                Book Test <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </GlassCard>

            {/* Doctor */}
            <GlassCard className="p-8 border-white/5 hover:border-[#eab308]/30 hover:bg-white/[0.02] transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#eab308]/5 rounded-full blur-3xl group-hover:bg-[#eab308]/10 transition-colors" />
              <div className="w-14 h-14 bg-[#eab308]/10 rounded-2xl flex items-center justify-center mb-6 border border-[#eab308]/20">
                <Stethoscope className="w-7 h-7 text-[#eab308]" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Consult Specialists Instantly</h3>
              <p className="text-white/50 mb-6 h-12">Connect with top clinical specialists in under 60 seconds.</p>
              <ul className="space-y-3 mb-8">
                {['Video consult', 'Chat consult', 'AI symptom pre-screening', 'Prescription generation'].map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-white/70">
                    <CheckCircle className="w-4 h-4 text-[#eab308]" /> {f}
                  </li>
                ))}
              </ul>
              <Button className="w-full justify-between group/btn">
                Consult Now <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </GlassCard>

            {/* Emergency */}
            <GlassCard className="p-8 border-white/5 hover:border-red-500/50 hover:shadow-[0_0_40px_rgba(239,68,68,0.15)] hover:bg-red-500/5 transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-3xl group-hover:bg-red-500/20 transition-colors" />
              <div className="w-14 h-14 bg-red-500/20 rounded-2xl flex items-center justify-center mb-6 border border-red-500/30">
                <ShieldAlert className="w-7 h-7 text-red-500" />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-white group-hover:text-red-100 transition-colors">Emergency Response Network</h3>
              <p className="text-white/50 mb-6 h-12">Immediate dispatch of critical care resources.</p>
              <ul className="space-y-3 mb-8">
                {['Instant ambulance dispatch', 'Nearest hospital routing', 'SOS family alerts', 'Real-time ETA tracking'].map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-white/70">
                    <CheckCircle className="w-4 h-4 text-red-500" /> {f}
                  </li>
                ))}
              </ul>
              <button onClick={() => setIsEmergencyModalOpen(true)} className="w-full flex items-center justify-between px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors group/btn">
                Emergency SOS <AlertTriangle className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
              </button>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: HOW IT WORKS ── */}
      <section className="py-32 relative border-y border-white/5 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-6">
          <SectionTitle title="How It Works" subtitle="The automated pipeline powering every Healix transaction." />
          
          <div className="relative mt-20 max-w-4xl mx-auto">
            {/* Animated Path Line */}
            <div className="absolute left-[27px] md:left-1/2 top-0 bottom-0 w-0.5 bg-white/10 md:-translate-x-1/2">
              <motion.div 
                className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-[#eab308] to-transparent"
                animate={{ y: ["-100%", "100%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
            </div>

            {[
              { title: "User Request", desc: "Patient initiates a service via the Healix App." },
              { title: "AI Routing Engine", desc: "Neural logic categorizes and prioritizes the request instantly." },
              { title: "Smart Provider Matching", desc: "Locates the nearest optimal pharmacy, lab, or doctor." },
              { title: "Real-Time Dispatch", desc: "Service agents deployed with optimized GPS tracking." },
              { title: "Completion Verification", desc: "Cryptographic proof of service completion." },
              { title: "Feedback Intelligence Loop", desc: "Data fed back to models to improve future routing." },
            ].map((step, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`relative flex items-center gap-8 mb-12 md:mb-20 last:mb-0 ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
              >
                {/* Node */}
                <div className="absolute left-0 md:left-1/2 w-14 h-14 bg-[#050505] rounded-full border-2 border-[#eab308] flex items-center justify-center shadow-[0_0_20px_rgba(234,179,8,0.3)] md:-translate-x-1/2 z-10">
                  <div className="w-3 h-3 bg-[#eab308] rounded-full animate-ping opacity-50 absolute" />
                  <div className="w-3 h-3 bg-[#eab308] rounded-full relative z-10" />
                </div>
                
                {/* Content */}
                <div className="ml-20 md:ml-0 md:w-1/2 p-6 md:px-12">
                  <GlassCard className="p-6 border-white/10 hover:border-[#eab308]/30 transition-colors relative overflow-hidden group">
                     <div className="absolute inset-0 bg-gradient-to-r from-[#eab308]/0 to-[#eab308]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                     <h4 className="text-xl font-bold mb-2 text-[#eab308]">{step.title}</h4>
                     <p className="text-white/60 text-sm">{step.desc}</p>
                  </GlassCard>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 3: AUTOMATION PIPELINES ── */}
      <section className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <SectionTitle title="Automation Pipelines" subtitle="Micro-architecture routing for distinct care channels." />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[
              {
                title: "Medicine Delivery Pipeline",
                icon: Pill,
                steps: ["Patient Uploads Prescription", "OCR Extraction", "AI Drug Validation", "Pharmacy Match Engine", "Rider Dispatch", "GPS Tracking", "Delivery Confirmation"]
              },
              {
                title: "Lab Testing Pipeline",
                icon: FlaskConical,
                steps: ["Book Slot", "Smart Lab Assignment", "Technician Dispatch", "Sample Collection", "Lab Processing", "Report AI Analysis", "Dashboard Upload"]
              },
              {
                title: "Doctor Consultation Pipeline",
                icon: Stethoscope,
                steps: ["Symptom Input", "AI Triage", "Specialist Matching", "Video Session", "Prescription Engine", "Follow-Up Automation"]
              },
              {
                title: "Emergency Pipeline",
                icon: ShieldAlert,
                color: "text-red-500",
                steps: ["SOS Trigger", "Geo Detection", "Nearest Ambulance Locate", "Hospital Alert", "Route Clearance Logic", "ETA Broadcast"]
              }
            ].map((pipeline, i) => (
              <GlassCard key={i} className="p-8 border-white/5 hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center gap-4 mb-8">
                  <div className={`p-3 rounded-xl bg-white/5 border border-white/10`}>
                    <pipeline.icon className={`w-6 h-6 ${pipeline.color || 'text-[#eab308]'}`} />
                  </div>
                  <h3 className="text-xl font-bold">{pipeline.title}</h3>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {pipeline.steps.map((step, idx) => (
                    <React.Fragment key={idx}>
                      <div className="px-3 py-1.5 rounded-md bg-[#111] border border-white/10 text-xs font-mono text-white/70">
                        {step}
                      </div>
                      {idx < pipeline.steps.length - 1 && (
                        <div className="flex items-center justify-center text-white/30">
                          <ArrowRight className="w-3 h-3" />
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 4: SYSTEM ARCHITECTURE ── */}
      <section className="py-32 bg-[#0a0a0a] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <SectionTitle title="System Architecture" subtitle="The enterprise-grade tech stack behind Healix." />
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Frontend", value: "Next.js + React", icon: Globe },
              { label: "Backend", value: "Node.js + Express", icon: Server },
              { label: "Database", value: "PostgreSQL", icon: Database },
              { label: "Real-time", value: "Socket.io", icon: Zap },
              { label: "Maps", value: "Google Maps API", icon: MapPin },
              { label: "Notifications", value: "Twilio + Firebase", icon: Smartphone },
              { label: "AI Layer", value: "Healix Intelligence", icon: Activity },
              { label: "Cloud", value: "AWS / Vercel", icon: Server },
            ].map((tech, i) => (
              <GlassCard key={i} className="p-6 border-white/5 text-center hover:border-white/20 transition-colors group">
                <tech.icon className="w-8 h-8 mx-auto mb-4 text-white/30 group-hover:text-white transition-colors" />
                <p className="text-[10px] font-mono text-white/50 uppercase tracking-widest mb-2">{tech.label}</p>
                <p className="font-bold text-white group-hover:text-[#eab308] transition-colors">{tech.value}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 5: LIVE DASHBOARD PREVIEW ── */}
      <section className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <SectionTitle title="Live Operations" subtitle="Real-time metrics from the Healix network." />
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <GlassCard className="p-8 text-center border-white/5">
              <p className="text-4xl md:text-6xl font-bold text-[#eab308] font-mono mb-2">{deliveries}</p>
              <p className="text-sm text-white/50 uppercase tracking-widest">Orders Delivered</p>
            </GlassCard>
            <GlassCard className="p-8 text-center border-white/5">
              <p className="text-4xl md:text-6xl font-bold text-white font-mono mb-2">{ambulances}</p>
              <p className="text-sm text-white/50 uppercase tracking-widest">Active Ambulances</p>
            </GlassCard>
            <GlassCard className="p-8 text-center border-white/5">
              <p className="text-4xl md:text-6xl font-bold text-white font-mono mb-2">{doctors}</p>
              <p className="text-sm text-white/50 uppercase tracking-widest">Doctors Online</p>
            </GlassCard>
            <GlassCard className="p-8 text-center border-white/5">
              <p className="text-4xl md:text-6xl font-bold text-[#eab308] font-mono mb-2">{tests}</p>
              <p className="text-sm text-white/50 uppercase tracking-widest">Tests Processed</p>
            </GlassCard>
            <GlassCard className="p-8 text-center border-white/5">
              <p className="text-4xl md:text-6xl font-bold text-white font-mono mb-2">99.2%</p>
              <p className="text-sm text-white/50 uppercase tracking-widest">AI Accuracy</p>
            </GlassCard>
            <GlassCard className="p-8 text-center border-white/5 border-red-500/20 bg-red-500/5">
              <p className="text-4xl md:text-6xl font-bold text-red-500 font-mono mb-2">&lt;4m</p>
              <p className="text-sm text-white/50 uppercase tracking-widest">Response Time</p>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* ── SECTION 7: TRUST SECTION ── */}
      <section className="py-20 border-t border-white/5 bg-[#111]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-12 md:gap-20 opacity-70 grayscale">
            {[
              "50,000+ Deliveries", "500+ Doctors", "100+ Labs", "98.7% Response Accuracy", "Under 30 Min Delivery"
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-white/50" />
                <span className="font-bold text-white/80">{stat}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 8: APP DOWNLOAD CTA ── */}
      <section className="py-40 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#eab308]/10 pointer-events-none" />
        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8">Healthcare. Reimagined by Healix.</h2>
          <p className="text-xl text-white/50 mb-12 max-w-2xl mx-auto">Get the all-in-one healthcare infrastructure directly on your device. Instant access to clinical-grade care, anywhere.</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button size="lg" className="px-8 bg-white text-black hover:bg-white/90">
              Download for iOS
            </Button>
            <Button size="lg" variant="outline" className="px-8 border-white/20 hover:bg-white/5">
              Download for Android
            </Button>
          </div>
        </div>
      </section>

      {/* ── SECTION 6: EMERGENCY FLOATING BUTTON ── */}
      <button 
        onClick={() => setIsEmergencyModalOpen(true)}
        className="fixed bottom-8 right-8 z-50 w-16 h-16 rounded-full bg-red-600 flex items-center justify-center shadow-[0_0_30px_rgba(239,68,68,0.5)] hover:scale-110 transition-transform group"
      >
        <div className="absolute inset-0 rounded-full border-2 border-red-500 animate-ping opacity-50" />
        <span className="font-bold text-white tracking-widest text-sm relative z-10">SOS</span>
      </button>

      {/* EMERGENCY MODAL */}
      <AnimatePresence>
        {isEmergencyModalOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100]"
              onClick={() => setIsEmergencyModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-[101] p-4"
            >
              <GlassCard className="relative overflow-hidden border border-red-500/30 bg-[#110000] shadow-[0_0_100px_rgba(239,68,68,0.2)]">
                <button onClick={() => setIsEmergencyModalOpen(false)} className="absolute right-4 top-4 text-white/50 hover:text-white">
                  <X className="h-5 w-5" />
                </button>

                <div className="p-2 w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mb-6">
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                </div>
                
                <h2 className="text-2xl font-bold mb-2 text-white">Emergency Dispatch</h2>
                <p className="text-red-200/70 mb-8 text-sm">Initiating an SOS will instantly alert nearby critical care units. Use only in emergencies.</p>

                <div className="space-y-3">
                  <button className="w-full flex items-center justify-between p-4 rounded-xl bg-red-600 hover:bg-red-500 transition-colors text-left group">
                    <div>
                      <h4 className="font-bold text-white">Call Ambulance</h4>
                      <p className="text-xs text-red-200">Dispatch nearest vehicle</p>
                    </div>
                    <PhoneCall className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                  </button>
                  
                  <button className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-left group">
                    <div>
                      <h4 className="font-bold text-white">Notify Family</h4>
                      <p className="text-xs text-white/50">Send automated SMS with vital stats</p>
                    </div>
                    <Users className="w-5 h-5 text-white/50 group-hover:text-white transition-colors" />
                  </button>
                  
                  <button className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-left group">
                    <div>
                      <h4 className="font-bold text-white">Share Location</h4>
                      <p className="text-xs text-white/50">Broadcast live GPS to local network</p>
                    </div>
                    <MapPin className="w-5 h-5 text-white/50 group-hover:text-white transition-colors" />
                  </button>

                  <button className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-left group">
                    <div>
                      <h4 className="font-bold text-white">Call Nearby Hospital</h4>
                      <p className="text-xs text-white/50">Connect to emergency ward</p>
                    </div>
                    <Hospital className="w-5 h-5 text-white/50 group-hover:text-white transition-colors" />
                  </button>
                </div>
              </GlassCard>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

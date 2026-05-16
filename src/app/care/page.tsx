"use client";

import React, { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { 
  Stethoscope, FlaskConical, Pill, Calendar, CheckCircle, Heart, 
  Search, Shield, Activity, TrendingUp, ChevronRight, X, User, ArrowRight,
  ShieldAlert, PhoneCall, MapPin, Hospital, Smartphone, Play, 
  Clock, Zap, Server, Database, Globe, AlertTriangle, Users
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { bookAppointment } from "./actions";
import Image from "next/image";
import Link from "next/link";

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

const categories = [
  { id: "doctor", name: "Consult Doctor", icon: Stethoscope, color: "text-[#eab308]", bg: "bg-[#eab308]/15" },
  { id: "lab", name: "Lab Tests", icon: FlaskConical, color: "text-[#ca8a04]", bg: "bg-[#ca8a04]/15" },
  { id: "medicine", name: "Medicines", icon: Pill, color: "text-[#eab308]", bg: "bg-[#eab308]/15" },
  { id: "ayurveda", name: "Ayurveda", icon: Shield, color: "text-[#ca8a04]", bg: "bg-[#ca8a04]/15" },
  { id: "devices", name: "Health Devices", icon: Activity, color: "text-[#eab308]", bg: "bg-[#eab308]/15" },
];

const trendingMedicines = [
  { name: "Shelcal 500 Tablet", price: "₹119", desc: "Calcium Supplement", img: "💊" },
  { name: "Dolo 650 Tablet", price: "₹30", desc: "Pain Relief", img: "💊" },
  { name: "Supradyn Daily", price: "₹55", desc: "Multivitamins", img: "💊" },
  { name: "Pan 40 Tablet", price: "₹150", desc: "Acidity & Ulcer", img: "💊" },
  { name: "Evion 400mg Capsule", price: "₹35", desc: "Vitamin E", img: "💊" },
];

const popularChecks = [
  { name: "Comprehensive Full Body Checkup", price: "₹1,499", oldPrice: "₹2,999", parameters: 85, img: "🧪" },
  { name: "Advanced Heart Care Profile", price: "₹999", oldPrice: "₹1,500", parameters: 20, img: "❤️" },
  { name: "Women's Wellness Package", price: "₹1,299", oldPrice: "₹2,500", parameters: 60, img: "🧬" },
  { name: "Diabetes Screening Panel", price: "₹499", oldPrice: "₹800", parameters: 12, img: "🩸" },
];

export default function CarePage() {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<string>("doctor");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);

  // Counters for Dashboard
  const deliveries = useCounter(5420, 2500);
  const ambulances = useCounter(142, 2500);
  const doctors = useCounter(385, 2500);
  const tests = useCounter(2890, 2500);

  const openBooking = (serviceId: string) => {
    setSelectedService(serviceId);
    setSuccess(false);
    setError(null);
    setIsBookingModalOpen(true);
  };

  async function handleBooking(formData: FormData) {
    setLoading(true);
    setError(null);
    setSuccess(false);

    formData.append("type", selectedService);
    const result = await bookAppointment(formData);

    if (result?.error) {
      setError(result.error);
    } else {
      setSuccess(true);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-[#050505] pb-24">
      {/* Header / Hero Section */}
      <div className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8 border-b border-white/10 bg-gradient-to-b from-[#111] to-[#050505] overflow-hidden">
        
        {/* Animated Background Waves */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none flex items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute w-[600px] h-[600px] rounded-full border border-primary/30"
          />
          <motion.div
            animate={{ scale: [1.2, 1.5, 1.2], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute w-[800px] h-[800px] rounded-full border border-primary/20"
          />
          <motion.div
            animate={{ scale: [1.5, 1.8, 1.5], opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute w-[1000px] h-[1000px] rounded-full border border-primary/10"
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center text-center">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full overflow-hidden border border-white/10 shadow-lg shadow-white/5">
              <Image src="/care-logo-new.png" alt="Healix Care" width={64} height={64} className="w-full h-full object-cover" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold">Healix Care Portal</h1>
          </div>
          <p className="text-white/60 text-lg sm:text-xl max-w-2xl mb-12">
            Your one-stop destination for medicines, lab tests, and expert doctor consultations.
          </p>

          {/* Search Bar */}
          <div className="w-full relative group">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <Search className="h-6 w-6 text-white/40 group-focus-within:text-primary transition-colors" />
            </div>
            <input
              type="text"
              className="w-full bg-white/5 border border-white/10 rounded-full pl-14 pr-32 py-5 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-xl placeholder:text-white/30 text-lg sm:text-xl"
              placeholder="Search for Medicines, Lab Tests, Doctors..."
            />
            <div className="absolute inset-y-0 right-2 flex items-center">
              <Button className="rounded-full px-8 py-3 h-auto font-semibold">Search</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-16">
        
        {/* Quick Categories */}
        <section>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <GlassCard 
                  key={cat.id} 
                  className="cursor-pointer hover:bg-white/10 transition-all flex flex-col items-center justify-center text-center py-8 group"
                  onClick={() => openBooking(cat.id === 'doctor' || cat.id === 'lab' || cat.id === 'medicine' ? cat.id : 'doctor')}
                >
                  <div className={`${cat.bg} p-4 rounded-2xl mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className={`h-8 w-8 ${cat.color}`} />
                  </div>
                  <h3 className="font-semibold text-sm">{cat.name}</h3>
                </GlassCard>
              );
            })}
          </div>
        </section>

        {/* Promotional Banner */}
        <section>
          <div className="relative rounded-3xl overflow-hidden p-8 sm:p-12 border border-[#eab308]/20 shadow-[0_0_40px_rgba(234,179,8,0.1)] bg-gradient-to-r from-[#ca8a04]/20 via-[#eab308]/10 to-[#050505]">
            <div className="relative z-10 max-w-xl">
              <span className="inline-block py-1 px-3 rounded-full bg-[#eab308]/20 text-[#eab308] text-xs font-bold tracking-wider mb-4 border border-[#eab308]/30 uppercase">
                Limited Time Offer
              </span>
              <h2 className="text-3xl font-bold mb-4 leading-tight">Get 20% Off on Full Body Checkups</h2>
              <p className="text-white/70 mb-8">
                Early detection saves lives. Book a comprehensive health screen today with free home sample collection.
              </p>
              <Button onClick={() => openBooking('lab')} className="rounded-xl flex items-center gap-2">
                Book Now <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="absolute right-10 bottom-0 opacity-10 md:opacity-30 transform translate-y-10 md:translate-y-0">
              <Activity className="w-64 h-64 text-[#eab308]" strokeWidth={1} />
            </div>
          </div>
        </section>

        {/* Featured Popular Checks */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <FlaskConical className="h-6 w-6 text-[#eab308]" />
              Popular Health Checks
            </h2>
            <span className="text-white/50 text-sm font-medium flex items-center cursor-not-allowed" title="More packages coming soon">
              View All <ChevronRight className="h-4 w-4" />
            </span>
          </div>
          <div className="flex overflow-x-auto pb-6 -mx-4 px-4 sm:mx-0 sm:px-0 gap-6 snap-x hide-scrollbar">
            {popularChecks.map((check, i) => (
              <GlassCard key={i} className="min-w-[280px] max-w-[320px] flex-shrink-0 snap-start flex flex-col justify-between p-6">
                <div>
                  <div className="text-5xl mb-6">{check.img}</div>
                  <h3 className="font-semibold text-lg mb-2 leading-tight min-h-[3.5rem]">{check.name}</h3>
                  <p className="text-xs text-white/50 mb-6 bg-white/5 py-1.5 px-3 rounded-full w-fit border border-white/5">
                    Includes {check.parameters} parameters
                  </p>
                </div>
                <div className="mt-auto">
                  <div className="flex items-end gap-3 mb-5">
                    <span className="text-2xl font-bold text-white leading-none">{check.price}</span>
                    <span className="text-sm text-white/40 line-through mb-0.5">{check.oldPrice}</span>
                  </div>
                  <Button onClick={() => openBooking('lab')} variant="outline" className="w-full rounded-xl">Add to Cart</Button>
                </div>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* Trending Medicines */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-[#eab308]" />
              Trending Medicines
            </h2>
            <span className="text-white/50 text-sm font-medium flex items-center cursor-not-allowed" title="More medicines coming soon">
              View All <ChevronRight className="h-4 w-4" />
            </span>
          </div>
          <div className="flex overflow-x-auto pb-6 -mx-4 px-4 sm:mx-0 sm:px-0 gap-6 snap-x hide-scrollbar">
            {trendingMedicines.map((med, i) => (
              <GlassCard key={i} className="min-w-[220px] flex-shrink-0 snap-start flex flex-col justify-between p-5">
                <div>
                  <div className="w-16 h-16 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl flex items-center justify-center text-4xl mb-5 shadow-inner">
                    {med.img}
                  </div>
                  <h3 className="font-semibold mb-1 truncate text-base">{med.name}</h3>
                  <p className="text-xs text-white/50 mb-5">{med.desc}</p>
                </div>
                <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-4">
                  <span className="text-xl font-bold">{med.price}</span>
                  <button onClick={() => openBooking('medicine')} className="text-primary hover:text-white bg-primary/10 hover:bg-primary rounded-xl p-2.5 transition-colors shadow-sm">
                    <CheckCircle className="h-5 w-5" />
                  </button>
                </div>
              </GlassCard>
            ))}
          </div>
        </section>

      </div>

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

      {/* Booking Modal */}
      <AnimatePresence>
        {isBookingModalOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsBookingModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-[101] p-4"
            >
              <GlassCard className="relative overflow-hidden border border-white/20 shadow-2xl">
                <button 
                  onClick={() => setIsBookingModalOpen(false)}
                  className="absolute right-4 top-4 text-white/50 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>

                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Request Booking
                </h2>

                {success ? (
                  <div className="text-center py-8">
                    <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-green-500/20 mb-4">
                      <CheckCircle className="h-8 w-8 text-green-500" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Request Sent!</h3>
                    <p className="text-white/60 mb-6">Your request has been successfully submitted. We will contact you shortly.</p>
                    <Button onClick={() => setIsBookingModalOpen(false)} className="w-full">Done</Button>
                  </div>
                ) : (
                  <form action={handleBooking} className="space-y-4">
                    <div className="p-3 bg-white/5 border border-white/10 rounded-xl mb-6">
                      <p className="text-xs text-white/50 mb-1">Selected Service</p>
                      <p className="font-medium flex items-center gap-2">
                        {selectedService === "doctor" && <Stethoscope className="h-4 w-4 text-[#eab308]" />}
                        {selectedService === "lab" && <FlaskConical className="h-4 w-4 text-[#ca8a04]" />}
                        {selectedService === "medicine" && <Pill className="h-4 w-4 text-[#eab308]" />}
                        {categories.find(c => c.id === selectedService)?.name || "Doctor Consultation"}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-1" htmlFor="date">
                        Preferred Date & Time
                      </label>
                      <input
                        id="date"
                        name="date"
                        type="datetime-local"
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors [color-scheme:dark]"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-1" htmlFor="notes">
                        Additional Notes
                      </label>
                      <textarea
                        id="notes"
                        name="notes"
                        rows={3}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-none"
                        placeholder="Any specific requirements or prescriptions?"
                      />
                    </div>

                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

                    <div className="pt-4">
                      <Button type="submit" className="w-full" isLoading={loading}>
                        Confirm Request
                      </Button>
                    </div>
                  </form>
                )}
              </GlassCard>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

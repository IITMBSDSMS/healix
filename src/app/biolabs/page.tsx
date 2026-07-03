"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Mic, Check, X, Award, ChevronDown, Search, Megaphone, ExternalLink, Mail, User, Send, MessageSquare, MapPin, ShieldCheck, Phone } from "lucide-react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import IndiaMap from "./IndiaMap";

// ==========================================
// ANIMATION VARIANTS FOR ORGANIC SCROLLING
// ==========================================
const staggerContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08
    }
  }
};

const slideUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] }
  }
};

const revealVariants = {
  hidden: { clipPath: "inset(0 100% 0 0)" },
  visible: {
    clipPath: "inset(0 0% 0 0)",
    transition: { duration: 0.9, ease: [0.25, 1, 0.5, 1] }
  }
};

const pathDrawVariants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 2.0, ease: "easeInOut" }
  }
};

// ==========================================
// MOCK DATA
// ==========================================



function BeakerIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`${className} fill-none stroke-current`} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 2H8" />
      <path d="M9 2v6.5C9 9.3 8.3 10 7.5 11l-3.3 4.4c-.8 1.1-.3 2.6 1.1 2.6h13.4c1.4 0 1.9-1.5 1.1-2.6L16.5 11c-.8-1-1.5-1.7-1.5-2.5V2" />
      <path d="M6 14h12" />
    </svg>
  );
}

function BioLabsLogoGrid({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className}>
      <circle cx="20" cy="20" r="12" fill="#00a887" />
      <circle cx="50" cy="20" r="12" fill="#00a887" />
      <circle cx="80" cy="20" r="12" fill="#00a887" />
      <circle cx="20" cy="50" r="12" fill="#00a887" />
      <circle cx="50" cy="50" r="12" fill="#00a887" />
      <circle cx="80" cy="50" r="12" fill="#00a887" />
      <circle cx="20" cy="80" r="12" fill="#00a887" />
      <circle cx="50" cy="80" r="12" fill="#00a887" />
      <circle cx="80" cy="80" r="12" fill="#00a887" />
    </svg>
  );
}

const equipmentDetails = [
  {
    title: "PCR Thermal Cyclers",
    description: "High-throughput, fully programmable PCR systems and real-time qPCR machines to amplify DNA samples with maximum thermal accuracy and speed.",
    color: "border-[#00a887] text-[#00a887] bg-[#e6f6f3]",
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 fill-none stroke-current" strokeWidth="2">
        <rect x="3" y="6" width="18" height="12" rx="2" />
        <path d="M7 10h10M7 14h6" />
        <circle cx="17" cy="14" r="1" className="fill-current" />
      </svg>
    )
  },
  {
    title: "High-Speed Centrifuges",
    description: "Refrigerated and ventilated benchtop centrifuges with interchangeable rotors for quick, quiet, and reliable separation of cellular components.",
    color: "border-[#008cff] text-[#008cff] bg-[#e6f3ff]",
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 fill-none stroke-current" strokeWidth="2">
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="3" />
        <path d="M12 3v3M12 18v3M3 12h3M18 12h3" />
      </svg>
    )
  },
  {
    title: "Multi-Mode Plate Readers",
    description: "Multi-mode detection systems supporting absorbance, fluorescence, and luminescence for comprehensive cell-based and biochemical assays.",
    color: "border-[#a855f7] text-[#a855f7] bg-[#f5e6ff]",
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 fill-none stroke-current" strokeWidth="2">
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <line x1="8" y1="8" x2="16" y2="8" />
        <line x1="8" y1="12" x2="16" y2="12" />
        <line x1="8" y1="16" x2="12" y2="16" />
      </svg>
    )
  },
  {
    title: "Precision Incubators",
    description: "Precision-controlled environmental chambers with constant temperature, humidity, and CO2 monitoring for optimal cell culture growth.",
    color: "border-[#f97316] text-[#f97316] bg-[#fff0e6]",
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 fill-none stroke-current" strokeWidth="2">
        <rect x="4" y="3" width="16" height="18" rx="2" />
        <line x1="4" y1="9" x2="20" y2="9" />
        <circle cx="9" cy="6" r="1" className="fill-current" />
        <circle cx="15" cy="6" r="1" className="fill-current" />
        <rect x="7" y="12" width="10" height="7" rx="1" />
      </svg>
    )
  },
  {
    title: "Biosafety Cabinets",
    description: "Certified laminar flow hoods providing maximum protection for personnel, environment, and sensitive biological product samples.",
    color: "border-[#06b6d4] text-[#06b6d4] bg-[#e6f9ff]",
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 fill-none stroke-current" strokeWidth="2">
        <rect x="4" y="3" width="16" height="18" rx="1" />
        <line x1="4" y1="15" x2="20" y2="15" />
        <line x1="8" y1="3" x2="8" y2="15" />
        <line x1="16" y1="3" x2="16" y2="15" />
        <path d="M4 18h16" />
      </svg>
    )
  }
];

const councilMembers = [
  {
    name: "Swaranjali Sonje",
    role: "Biomedical Engineer & Researcher",
    lead: "IIT Delhi / M.Tech",
    image: "/biolabs/member_swaranjali.png",
    description: "Specializing in biomedical engineering and clinical research, developing advanced diagnostics and healthcare solutions at IIT Delhi.",
    linkedin: "#",
    email: "#"
  },
  {
    name: "Dr. Suresh Bangla",
    role: "MD in Community Medicine",
    lead: "Junior Resident, AIIMS Delhi",
    image: "/biolabs/member_suresh.png",
    description: "Leading projects in public health, community medicine, and epidemiology, with a focus on preventative healthcare solutions at AIIMS Delhi.",
    linkedin: "#",
    email: "#"
  },
  {
    name: "Dr. Samir Kalra",
    role: "Senior Consultant & Neurosurgeon",
    lead: "Sir Ganga Ram Hospital",
    image: "/biolabs/member_samir.png",
    description: "Senior consultant and neurosurgeon at Sir Ganga Ram Hospital, specializing in complex neurosurgical procedures, clinical neurology, and advanced brain research.",
    linkedin: "#",
    email: "#"
  }
];

export default function BioLabsPage() {
  const { scrollY, scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 800], ["0%", "25%"]);
  
  // Parallax background translations
  const parallaxVisionY = useTransform(scrollY, [0, 1200], [0, -60]);
  const parallaxDotsY = useTransform(scrollY, [800, 3000], [0, -80]);
  const parallaxHelixY = useTransform(scrollY, [1500, 4000], [0, 100]);

  const [cookieConsent, setCookieConsent] = useState(true);
  const [selectedEquipment, setSelectedEquipment] = useState<number | null>(null);
  
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formSubject, setFormSubject] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const consent = localStorage.getItem("biolabs_cookies_accepted");
      if (consent === "true") setCookieConsent(false);
    }
  }, []);

  const handleAcceptCookies = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("biolabs_cookies_accepted", "true");
    }
    setCookieConsent(false);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formEmail || !formMessage) {
      alert("Please fill in Name, Email, and Message.");
      return;
    }
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setFormName("");
      setFormEmail("");
      setFormSubject("");
      setFormMessage("");
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-white text-[#0f172a] font-sans selection:bg-[#00796b]/20 selection:text-[#00796b]">
      
      {/* Top Fixed Green Scroll Progress Indicator */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-[#00a887] origin-left z-[9999] pointer-events-none"
        style={{ scaleX: scrollYProgress }}
      />
      
      {/* ----------------- SECTION 1: Hero equipment config ----------------- */}
      <section id="biotech" className="relative min-h-[650px] flex flex-col justify-between overflow-hidden bg-slate-900">
        
        {/* Laboratory Background with premium vignette overlay */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <motion.img 
            src="/biolabs/hero_biotech.jpg" 
            alt="Lab Environment"
            className="absolute -top-[15%] left-0 w-full h-[130%] object-cover filter blur-[1px] brightness-75 contrast-105"
            style={{ y: backgroundY }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-900/40 to-slate-950/90" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full px-6 flex-1 flex items-center justify-center py-16">
          {/* Centered Floating Content (No Box wrapper) */}
          <div className="text-center max-w-3xl mx-auto flex-1 relative transform transition-all duration-300">
            
            {/* Circular Glowing Green Beaker Icon Header */}
            <div className="mx-auto w-16 h-16 rounded-full border border-[#00a887]/40 flex items-center justify-center text-[#00a887] bg-slate-950/50 shadow-[0_0_25px_rgba(0,168,135,0.3)] mb-6 animate-pulse">
              <BeakerIcon className="w-7 h-7" />
            </div>

            {/* Title & Description with smooth animation transitions and text dropshadows */}
            <div className="min-h-[160px] flex flex-col justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedEquipment !== null ? selectedEquipment : "default"}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="space-y-4"
                >
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight font-sans drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]">
                    {selectedEquipment !== null ? equipmentDetails[selectedEquipment].title : "Build Your Biotech"}
                  </h1>
                  <div className="mx-auto w-16 h-[3px] bg-[#00a887] rounded-full shadow-sm" />
                  <p className="text-slate-100 text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl mx-auto font-bold drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">
                    {selectedEquipment !== null ? equipmentDetails[selectedEquipment].description : "Find and configure the essential lab equipment you need to bring your science to life. From PCR machines and centrifuges to incubators and biosafety cabinets—build a lab that's ready for breakthrough discoveries."}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Switcher Row */}
            <div className="flex flex-wrap items-center justify-center gap-3.5 mt-10">
              {equipmentDetails.map((eq, idx) => {
                const isSelected = selectedEquipment === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedEquipment(isSelected ? null : idx)}
                    className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-300 transform active:scale-95 cursor-pointer relative ${
                      isSelected
                        ? "border-[#00a887] text-[#00a887] bg-slate-900/60 ring-4 ring-[#00a887]/30 scale-110 shadow-[0_0_15px_rgba(0,168,135,0.4)]"
                        : "border-slate-700 bg-slate-950/60 hover:bg-slate-950 text-slate-400 hover:text-white hover:scale-105 hover:border-slate-500 shadow-md"
                    }`}
                    title={eq.title}
                  >
                    {eq.icon}
                    {isSelected && (
                      <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00a887] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-[#00a887]"></span>
                      </span>
                    )}
                  </button>
                );
              })}
              
              {/* Plus/Reset Button */}
              <button 
                onClick={() => setSelectedEquipment(null)}
                className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-300 cursor-pointer ${
                  selectedEquipment === null
                    ? "border-[#00a887] text-[#00a887] bg-slate-900/60 ring-4 ring-[#00a887]/30 scale-110 shadow-[0_0_15px_rgba(0,168,135,0.4)]"
                    : "border-slate-700 bg-slate-950/60 hover:bg-slate-950 text-slate-400 hover:text-white hover:scale-105 hover:border-slate-500 shadow-md"
                }`}
                title="Reset View"
              >
                <span className="text-xl font-light font-sans">+</span>
              </button>
            </div>

            {/* CTA Button (Glowing lift transition) */}
            <div className="mt-10">
              <a
                href="https://www.biolabsresearch-healix.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 h-12 px-8 bg-gradient-to-r from-[#00a887] to-[#008f72] hover:from-[#008f72] hover:to-[#00735b] text-white font-extrabold text-sm tracking-wide rounded-xl transition-all shadow-[0_4px_20px_rgba(0,168,135,0.35)] hover:shadow-[0_6px_25px_rgba(0,168,135,0.5)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
              >
                Explore Equipment
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>
            
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="relative z-10 w-full bg-[#00a887] py-4.5 text-center px-4 flex items-center justify-center gap-2 hover:bg-[#009678] transition-colors shadow-[0_-4px_20px_rgba(0,168,135,0.15)]">
          <Megaphone className="w-4 h-4 text-white animate-bounce" />
          <a 
            href="#contact" 
            className="text-white font-extrabold text-xs sm:text-sm tracking-widest uppercase hover:opacity-90 transition-opacity flex items-center gap-1 font-sans"
          >
            BioLabs at BIO 2026 - Learn More
            <ChevronRight className="w-3.5 h-3.5" />
          </a>
        </div>

      </section>

      {/* ----------------- Our Vision for Research ----------------- */}
      <section className="py-24 px-6 sm:px-12 lg:px-20 bg-white relative overflow-hidden">
        
        {/* Subtle decorative glow circles in background */}
        <div className="absolute top-1/2 left-0 w-72 h-72 bg-[#008080]/5 rounded-full filter blur-[80px] pointer-events-none" />
        <div className="absolute top-1/3 right-0 w-72 h-72 bg-teal-500/5 rounded-full filter blur-[80px] pointer-events-none" />

        <div className="max-w-7xl mx-auto space-y-12 relative z-10 text-left">
          
          {/* Header Area */}
          <div className="space-y-4 max-w-4xl">
            <span className="text-xs sm:text-sm font-black tracking-widest text-[#00667a] uppercase block">
              OUR VISION FOR RESEARCH
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-[#0f2942] tracking-tight leading-[1.15] font-normal">
              Innovation Through <span className="text-[#008080] font-normal">Collaboration</span>,<br />
              <span className="text-[#008080] font-normal">Discovery</span>, and <span className="text-[#008080] font-normal">Mentorship</span>
            </h2>
            <p className="text-zinc-600 text-sm sm:text-base leading-relaxed max-w-3xl pt-2">
              At BioLabs, we believe that groundbreaking research happens at the intersection of diverse perspectives, innovative thinking, and guided expertise. Our vision is to create a dynamic research environment where ideas flourish and impact is realised.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6">
            
            {/* Card 1: Collaboration */}
            <div className="bg-white border border-slate-100 shadow-[0_10px_35px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgba(0,128,128,0.06)] hover:-translate-y-1 rounded-2xl overflow-hidden flex flex-col group transition-all duration-500">
              <div className="w-full aspect-[16/10] overflow-hidden bg-slate-50 relative">
                <img 
                  src="/biolabs/biolabs_collaboration_real.jpg" 
                  alt="Collaboration" 
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                />
              </div>
              <div className="p-6 sm:p-8 flex flex-col flex-1">
                <h3 className="text-2xl font-serif font-bold text-[#0f2942]">Collaboration</h3>
                <div className="w-12 h-[3px] bg-[#008080] my-4 rounded-full" />
                <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed flex-1">
                  We bring together researchers, clinicians, and partners across disciplines and borders to solve complex challenges and drive meaningful change.
                </p>
              </div>
            </div>

            {/* Card 2: Discovery */}
            <div className="bg-white border border-slate-100 shadow-[0_10px_35px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgba(0,128,128,0.06)] hover:-translate-y-1 rounded-2xl overflow-hidden flex flex-col group transition-all duration-500">
              <div className="w-full aspect-[16/10] overflow-hidden bg-slate-50 relative">
                <img 
                  src="/biolabs/biolabs_discovery_real.jpg" 
                  alt="Discovery" 
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                />
              </div>
              <div className="p-6 sm:p-8 flex flex-col flex-1">
                <h3 className="text-2xl font-serif font-bold text-[#0f2942]">Discovery</h3>
                <div className="w-12 h-[3px] bg-[#008080] my-4 rounded-full" />
                <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed flex-1">
                  We empower curiosity and invest in bold ideas to advance knowledge, develop new solutions, and improve lives.
                </p>
              </div>
            </div>

            {/* Card 3: Mentorship */}
            <div className="bg-white border border-slate-100 shadow-[0_10px_35px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgba(0,128,128,0.06)] hover:-translate-y-1 rounded-2xl overflow-hidden flex flex-col group transition-all duration-500">
              <div className="w-full aspect-[16/10] overflow-hidden bg-slate-50 relative">
                <img 
                  src="/biolabs/biolabs_mentorship_real.jpg" 
                  alt="Mentorship" 
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                />
              </div>
              <div className="p-6 sm:p-8 flex flex-col flex-1">
                <h3 className="text-2xl font-serif font-bold text-[#0f2942]">Mentorship</h3>
                <div className="w-12 h-[3px] bg-[#008080] my-4 rounded-full" />
                <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed flex-1">
                  We are committed to nurturing the next generation of researchers through guidance, support, and opportunities to grow.
                </p>
              </div>
            </div>

          </div>

          {/* Join the Movement CTA */}
          <div className="pt-8 space-y-4 text-center">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 h-12 px-8 bg-gradient-to-r from-[#008080] to-[#006666] hover:from-[#006666] hover:to-[#004d4d] text-white font-extrabold text-sm tracking-wide rounded-full transition-all shadow-md hover:shadow-lg active:scale-[0.98] transform hover:-translate-y-0.5"
            >
              Join the Movement
              <ChevronRight className="w-4 h-4" />
            </a>
            <p className="text-xs text-slate-400 font-bold max-w-md mx-auto">
              Be part of a mission to accelerate interdisciplinary innovation and improve lives.
            </p>
          </div>

        </div>
      </section>

      {/* ----------------- Why Join BioLabs as a Researcher? ----------------- */}
      <section className="py-24 px-6 bg-white border-t border-b border-slate-100/50 relative overflow-hidden flex flex-col justify-between">
        
        {/* Wavy dots background decoration in bottom-left */}
        <motion.div 
          style={{ y: parallaxVisionY }}
          className="absolute bottom-0 left-0 z-0 pointer-events-none opacity-[0.25] text-[#008a47]"
        >
          <svg width="320" height="240" viewBox="0 0 320 240" fill="none" xmlns="http://www.w3.org/2000/svg">
            {Array.from({ length: 10 }).map((_, r) =>
              Array.from({ length: 18 }).map((_, c) => {
                const cx = 10 + c * 16 + Math.sin(r * 0.4) * 8;
                const cy = 230 - (r * 12 + Math.cos(c * 0.35) * 25 + Math.sin((c + r) * 0.2) * 10);
                const opacity = 0.15 + (18 - c) * 0.04 - (r * 0.02);
                return (
                  <circle 
                    key={`${r}-${c}`} 
                    cx={cx} 
                    cy={cy} 
                    r="1.2" 
                    fill="currentColor" 
                    opacity={Math.max(0.05, Math.min(0.8, opacity))} 
                  />
                );
              })
            )}
          </svg>
        </motion.div>

        {/* Organic leaf decoration in bottom-right */}
        <div className="absolute bottom-0 right-0 z-0 pointer-events-none w-72 h-72 opacity-[0.25] text-[#008a47]">
          <svg viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path d="M240,240 Q180,170 130,140 T50,110" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.4" />
            <path d="M190,200 C165,185 155,160 160,145 C180,145 200,165 210,185 Z" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.3" />
            <path d="M140,165 C110,155 105,130 112,118 C130,118 145,135 152,150 Z" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.4" />
            <path d="M205,160 C185,135 188,115 198,108 C215,115 218,135 220,150 Z" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.3" />
            <path d="M110,130 C90,120 87,100 95,93 C110,97 115,113 117,123 Z" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.3" />
            <path d="M65,115 C50,105 48,91 54,85 C65,88 68,101 70,108 Z" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.2" />
            <path d="M175,172 C168,165 162,152 163,148" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.25" />
            <path d="M126,148 C118,142 113,132 115,128" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.25" />
            <path d="M196,134 C190,126 191,118 193,114" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.25" />
          </svg>
        </div>

        {/* Faded background scientist photo on the right half */}
        <div className="lg:absolute lg:right-0 lg:top-0 lg:w-[58%] w-full h-[300px] lg:h-[450px] z-0 overflow-hidden relative">
          <img 
            src="/biolabs/why_join_scientists.png" 
            alt="Scientists discussing research" 
            className="w-full h-full object-cover lg:object-right-top"
          />
          {/* Gradients to fade to white on the left (and bottom on mobile) */}
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/50 lg:via-white/30 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white lg:hidden z-10" />
        </div>

        <div className="max-w-7xl mx-auto space-y-16 relative z-10 w-full">
          
          {/* Header (Aligned left to slide past the scientists photo on desktop) */}
          <div className="lg:w-[48%] text-left space-y-6">
            
            {/* Collaborate Badge */}
            <div className="inline-flex items-center gap-2 text-xs font-black tracking-widest text-[#008a47] uppercase font-sans">
              <svg className="w-4.5 h-4.5 text-[#008a47]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4.5 10.5C8 6 16 6 19.5 10.5M4.5 13.5C8 18 16 18 19.5 13.5" />
                <line x1="8" y1="9" x2="8" y2="15" />
                <line x1="12" y1="7.5" x2="12" y2="16.5" />
                <line x1="16" y1="9" x2="16" y2="15" />
              </svg>
              Collaborate. Innovate. Impact.
            </div>

            <div className="space-y-4">
              <h2 className="text-5xl sm:text-6xl font-black text-slate-900 tracking-tight leading-[1.05] font-sans">
                Why Join<br />
                <span className="text-[#008a47]">BioLabs</span><br />
                as a Researcher?
              </h2>
              <div className="w-12 h-1 bg-[#008a47] rounded-full mt-4" />
            </div>

            <p className="text-slate-500 font-semibold text-sm leading-relaxed max-w-xl">
              BioLabs is more than a platform—it&apos;s a global community empowering researchers to collaborate, grow, and create meaningful impact.
            </p>
          </div>

          {/* 4 Cards Grid */}
          <motion.div 
            variants={staggerContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full pt-4"
          >
            {[
              {
                title: "Interdisciplinary Network",
                desc: "Connect with a diverse network of researchers, innovators, and experts across disciplines and borders.",
                icon: (
                  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-none stroke-current" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="6" r="2.2" />
                    <path d="M8 11.5c0-1.5 1.5-2.2 4-2.2s4 .7 4 2.2" />
                    <circle cx="6" cy="16.5" r="1.8" />
                    <path d="M2.5 20.5c0-1.2 1.2-1.8 3.5-1.8s3.5 .6 3.5 1.8" />
                    <circle cx="18" cy="16.5" r="1.8" />
                    <path d="M14.5 20.5c0-1.2 1.2-1.8 3.5-1.8s3.5 .6 3.5 1.8" />
                    <line x1="10" y1="10.5" x2="7.5" y2="14.2" strokeWidth="1.2" strokeDasharray="1.5,1.5" />
                    <line x1="14" y1="10.5" x2="16.5" y2="14.2" strokeWidth="1.2" strokeDasharray="1.5,1.5" />
                    <line x1="9" y1="17.5" x2="15" y2="17.5" strokeWidth="1.2" strokeDasharray="1.5,1.5" />
                  </svg>
                )
              },
              {
                title: "Mentorship & Guidance",
                desc: "Gain insights from experienced mentors who support your growth, challenge your ideas, and guide your journey.",
                icon: (
                  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-none stroke-current" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2.5c-1.8 0-3 1.2-3 2.8c0 1.2.6 1.8 1 2.2v1.5h4V7.5c.4-.4 1-1 1-2.2c0-1.6-1.2-2.8-3-2.8Z" />
                    <path d="M10.5 10.5h3" />
                    <line x1="12" y1="1" x2="12" y2="1.8" />
                    <line x1="7.8" y1="2.8" x2="8.5" y2="3.5" />
                    <line x1="16.2" y1="2.8" x2="15.5" y2="3.5" />
                    <path d="M3.5 16.5l3-3a1.5 1.5 0 0 1 2.1 0l1.9 1.9" />
                    <path d="M20.5 16.5l-3-3a1.5 1.5 0 0 0-2.1 0l-1.9 1.9" />
                    <path d="M9 16.5c.5-.5 1.5-.5 2 0l1 1" />
                    <path d="M15 16.5c-.5-.5-1.5-.5-2 0l-1 1" />
                  </svg>
                )
              },
              {
                title: "Project Visibility",
                desc: "Showcase your work to a global audience and amplify your research through greater exposure and recognition.",
                icon: (
                  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-none stroke-current" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M2 12h20" strokeWidth="1.2" opacity="0.4" />
                    <path d="M12 2v20" strokeWidth="1.2" opacity="0.4" />
                    <path d="M12.5 4.5c.8 .8 .8 2 0 2.5c-.8 .5-1.5 1.2-2 2c-.5 .8-1.5 .8-2 0c-.5-.8-1.2-1-2-.5c-.8 .5-1.2 0-1-1c.2-1 1.2-1.5 2-1.5s2.5-.8 3-1.5Z" />
                    <path d="M19.5 8c.5 .5 .2 1.5-.5 1.8c-.8 .3-1.2 1.2-1 2c.2 .8-.3 1.5-1 1.5s-1.2-.5-1.5-1.2c-.3-.8-.3-1.8 .5-2.2c.8-.5 1-.8 1-1.5c0-.8 1-1.2 1.5-.9Z" />
                    <path d="M7 16.5c1 .5 1.8 1.2 1.5 2c-.3 .8-1.5 .8-2 .2c-.5-.5-1-.2-1.2.5c-.2 .8-1 .8-1.2 0c-.2-.8 .5-1.5 1.2-2c.8-.5 1-.8 1.7-.7Z" />
                  </svg>
                )
              },
              {
                title: "Resource Access",
                desc: "Access cutting-edge tools, research materials, and resources to accelerate your discoveries and outcomes.",
                icon: (
                  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-none stroke-current" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 18h8" />
                    <path d="M3 22h18" />
                    <path d="M14 22a7 7 0 1 0-14 0" />
                    <path d="M9 14h2" />
                    <path d="M9 12a3 3 0 0 1-3-3V3h4v6a3 3 0 0 1-3 3Z" />
                    <path d="M12 5h4" />
                    <path d="M14 9h4" />
                  </svg>
                )
              }
            ].map((item, idx) => (
              <motion.div 
                key={idx} 
                variants={slideUpVariants}
                className="bg-white border border-slate-100 rounded-[32px] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_15px_45px_rgba(0,168,135,0.06)] hover:border-[#008a47]/20 transition-all duration-300 flex flex-col items-center text-center h-[290px] group"
              >
                {/* Rounded Icon Circle Badge */}
                <div className="w-16 h-16 rounded-full border border-slate-100 bg-slate-50/50 flex items-center justify-center text-[#008a47] group-hover:bg-[#e6f6f3] group-hover:border-[#008a47]/20 transition-colors duration-300 mb-6 shrink-0 shadow-sm">
                  {item.icon}
                </div>

                <h3 className="font-extrabold text-slate-900 text-sm sm:text-base leading-snug tracking-tight">
                  {item.title}
                </h3>
                
                {/* Card Divider Stroke */}
                <div className="w-6 h-[3px] bg-[#008a47] mt-3 mb-4 rounded-full" />
                
                <p className="text-xs font-semibold text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Centered CTA Button */}
          <div className="flex justify-center pt-4 w-full">
            <a
              href="#contact"
              className="inline-flex items-center justify-center gap-2.5 h-13 px-8 bg-[#008a47] hover:bg-[#00733a] text-white font-extrabold text-sm rounded-full transition-all shadow-[0_4px_15px_rgba(0,138,71,0.2)] hover:shadow-[0_6px_20px_rgba(0,138,71,0.3)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] cursor-pointer"
            >
              {/* Group Users Icon */}
              <svg viewBox="0 0 24 24" className="w-4.5 h-4.5 fill-none stroke-current" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <span>Join the Community</span>
              {/* Right Arrow */}
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current ml-0.5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </a>
          </div>

        </div>
      </section>

      {/* ----------------- SECTION 2: Locations ----------------- */}
      <section id="locations" className="py-24 px-6 bg-slate-50/50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto space-y-16">
          
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#004d40]/20 bg-[#004d40]/5 text-[#004d40] text-xs font-bold uppercase tracking-widest shadow-sm">
              National Footprint
            </div>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-[#004d40] tracking-tight">
              Locations & Facilities
            </h2>
            <div className="w-12 h-[3px] bg-[#004d40] mx-auto rounded-full" />
            <p className="text-slate-500 max-w-2xl mx-auto text-sm sm:text-base font-semibold leading-relaxed">
              Explore our state-of-the-art biological infrastructure across India&apos;s leading tech and healthcare hubs.
            </p>
          </div>

          {/* Two-Column Interactive Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Map Container */}
            <div className="lg:col-span-7 bg-white border border-slate-100 rounded-[32px] p-6 shadow-[0_15px_40px_rgba(0,0,0,0.02)] relative">
              <div className="absolute top-4 left-6 flex items-center gap-2 text-[10px] text-slate-400 font-mono font-bold">
                <span className="h-2 w-2 rounded-full bg-[#00a887] animate-ping" />
                <span>Live Biosystem Network: Operational</span>
              </div>
              <IndiaMap activeStates={["ka", "mh", "tg", "dl", "tn"]} />
            </div>

            {/* Hubs Directory Container */}
            <div className="lg:col-span-5 space-y-5 text-left">
              <div className="bg-[#004d40] text-white p-6.5 rounded-3xl shadow-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#00796b]/30 to-transparent pointer-events-none" />
                <h3 className="text-xl font-bold relative z-10">Active Innovation Hubs</h3>
                <p className="text-teal-100 text-xs mt-1.5 relative z-10 leading-relaxed font-semibold">
                  Our core facilities provide early-stage biotechs and researchers with clean-room access, high-throughput analytics, and diagnostic workstations.
                </p>
              </div>

              <div className="space-y-3.5">
                {[
                  { city: "New Delhi", state: "Delhi NCR", spec: "Next-Gen Sequencing & Advanced PCR Incubators" },
                  { city: "Mumbai", state: "Maharashtra", spec: "Bioinformatics Cloud Core & Clinical Trials Hub" },
                  { city: "Bengaluru", state: "Karnataka", spec: "Genomics Research Labs & Core Sequencing Suite" },
                  { city: "Hyderabad", state: "Telangana", spec: "Molecular Cell Diagnostics & Biosafety flow systems" },
                  { city: "Chennai", state: "Tamil Nadu", spec: "Proteomics Research Core & Bioinformatics Infrastructure" }
                ].map((hub, idx) => (
                  <div key={idx} className="bg-white hover:bg-slate-50/50 border border-slate-100 hover:border-[#00a887]/20 p-4.5 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex items-start gap-4 group">
                    <div className="w-9 h-9 rounded-xl bg-[#e6f6f3] text-[#00a887] group-hover:bg-[#00a887] group-hover:text-white transition-colors duration-300 flex items-center justify-center shrink-0 font-bold text-xs font-mono shadow-sm">
                      0{idx+1}
                    </div>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-slate-800 text-sm">{hub.city}</h4>
                        <span className="text-[10px] text-slate-400 font-mono font-bold uppercase">{hub.state}</span>
                      </div>
                      <p className="text-xs text-slate-500 font-semibold">{hub.spec}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom news link */}
          <div className="pt-4 text-center flex items-center justify-center gap-2">
            <Mic className="w-5 h-5 text-[#004d40] animate-pulse" />
            <a 
              href="#contact" 
              className="text-[#004d40] font-extrabold text-sm tracking-wider uppercase underline underline-offset-4 hover:opacity-85 transition-opacity"
            >
              SEE THE LATEST BIOLABS NEWS
            </a>
          </div>

        </div>
      </section>

      {/* ----------------- SECTION 3: Podcast Series ----------------- */}
      <section id="podcast" className="py-28 px-6 bg-white relative overflow-hidden">
        
        {/* SVG ClipPath Definition for scientists cover wave */}
        <svg className="absolute w-0 h-0 pointer-events-none">
          <defs>
            <clipPath id="podcast-clip" clipPathUnits="objectBoundingBox">
              <path d="M 0,0 L 0.85,0 C 0.94,0.20 0.80,0.40 0.90,0.58 C 0.95,0.72 0.78,0.88 0.52,1 L 0,1 Z" />
            </clipPath>
          </defs>
        </svg>

        {/* Faint scientific DNA helix decoration in the background */}
        <motion.div 
          style={{ y: parallaxHelixY }}
          className="absolute top-12 right-12 z-0 pointer-events-none opacity-[0.05] text-[#00a887]"
        >
          <svg width="180" height="300" viewBox="0 0 100 200" fill="none" stroke="currentColor" strokeWidth="1.5" xmlns="http://www.w3.org/2000/svg">
            <motion.path 
              variants={pathDrawVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              d="M20,10 C40,40 60,60 80,90 C100,120 100,140 80,170 C60,200 40,220 20,250" 
            />
            <motion.path 
              variants={pathDrawVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              d="M80,10 C60,40 40,60 20,90 C0,120 0,140 20,170 C40,200 60,220 80,250" 
            />
            {Array.from({ length: 13 }).map((_, idx) => {
              const y = 15 + idx * 18;
              const x1 = 30 + 35 * Math.sin(idx * 0.5);
              const x2 = 70 - 35 * Math.sin(idx * 0.5);
              return (
                <line key={idx} x1={x1} y1={y} x2={x2} y2={y} strokeDasharray="2,2" />
              );
            })}
          </svg>
        </motion.div>

        {/* Dot pattern under the cards */}
        <motion.div 
          style={{ y: parallaxDotsY }}
          className="absolute bottom-6 left-[38%] z-0 pointer-events-none opacity-40"
        >
          <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            {Array.from({ length: 5 }).map((_, r) =>
              Array.from({ length: 5 }).map((_, c) => (
                <circle key={`${r}-${c}`} cx={6 + c * 12} cy={6 + r * 12} r="1.5" fill="#00a887" />
              ))
            )}
          </svg>
        </motion.div>

        <div className="max-w-7xl mx-auto relative z-10">
          
          {/* Main Layout (Left curved cover image, right details and cards) */}
          <div className="relative min-h-[560px] flex flex-col lg:flex-row items-stretch gap-12 lg:gap-0">
            
            {/* Left curved team photo (Absolute on desktop, relative height on mobile) */}
            <motion.div 
              variants={revealVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="lg:absolute lg:left-0 lg:top-0 lg:bottom-0 lg:w-[46%] w-full h-[320px] sm:h-[450px] lg:h-auto rounded-[32px] lg:rounded-none overflow-hidden shadow-lg lg:shadow-none z-0 relative"
            >
              <img 
                src="/biolabs/podcast_scientists_team.jpg" 
                alt="BioLabs Podcast Team" 
                className="w-full h-full object-cover" 
                style={{ clipPath: "url(#podcast-clip)" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-transparent pointer-events-none" />
              
              {/* Floating Microphone Capsule in bottom-left */}
              <div className="absolute bottom-6 left-6 lg:left-12 lg:bottom-12 z-20 bg-white/95 backdrop-blur-md border border-slate-100 p-4.5 rounded-3xl shadow-xl flex items-center gap-3.5 max-w-[280px] sm:max-w-sm">
                <div className="w-11 h-11 rounded-full bg-[#e6f6f3] flex items-center justify-center text-[#00a887] shrink-0 shadow-inner">
                  <Mic className="w-5.5 h-5.5" strokeWidth={2.5} />
                </div>
                <div className="text-left">
                  <p className="text-[11px] font-black text-slate-800 tracking-tight leading-snug">Real conversations. Groundbreaking impact.</p>
                  <p className="text-[11px] font-extrabold text-[#00a887] mt-0.5">Powered by people.</p>
                </div>
              </div>
            </motion.div>

            {/* Right side: Branding, Title, Episode list, and CTA (Padded left on desktop to slide past the photo) */}
            <div className="lg:w-[58%] lg:ml-auto w-full text-left space-y-8 lg:pl-6 relative z-10">
              
              {/* Header & Sub-badge */}
              <div className="space-y-4">
                <h2 className="text-5xl sm:text-6xl font-black text-slate-900 tracking-tight leading-[1.05] font-sans">
                  <span className="text-[#005d4b]">b.</span>empowered<br />
                  <span className="text-slate-900">Podcast Series</span>
                </h2>

                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-slate-200 bg-slate-50 text-slate-600 text-xs font-bold tracking-normal shadow-sm">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 text-slate-400 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                  Human Stories Behind Breakthrough Science
                </div>
              </div>

              {/* Episode Cards Grid - Overlapping the curved image on desktop */}
              <motion.div 
                variants={staggerContainerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className="grid grid-cols-1 sm:grid-cols-3 gap-5 lg:-ml-16 relative z-20"
              >
                {[
                  {
                    ep: "EP. 01",
                    title: "Engineering Better Futures",
                    host: "Swaranjali Sonje",
                    role: "Biomedical Engineer & Researcher",
                    image: "/biolabs/member_swaranjali.png"
                  },
                  {
                    ep: "EP. 02",
                    title: "Data. Discovery. Impact.",
                    host: "Dr. Suresh Bangla",
                    role: "MD in Community Medicine",
                    image: "/biolabs/member_suresh.png"
                  },
                  {
                    ep: "EP. 03",
                    title: "The Next Frontier in Neurosurgery",
                    host: "Dr. Samir Kalra",
                    role: "Senior Consultant & Neurosurgeon",
                    image: "/biolabs/member_samir.png"
                  }
                ].map((episode, idx) => (
                  <motion.div 
                    key={idx} 
                    variants={slideUpVariants}
                    className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_45px_rgba(0,168,135,0.07)] hover:border-[#00a887]/25 transition-all duration-300 flex flex-col justify-between h-[310px] group relative"
                  >
                    {/* Host Thumbnail */}
                    <div className="w-full h-32 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100/50 mb-4 shadow-inner relative">
                      <img 
                        src={episode.image} 
                        alt={episode.host} 
                        className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                      />
                    </div>

                    {/* Content details */}
                    <div className="flex-1 flex flex-col justify-between text-left">
                      <div>
                        <span className="text-[9px] font-mono font-black text-[#00a887] uppercase tracking-wider">{episode.ep}</span>
                        <h4 className="font-extrabold text-slate-800 text-sm leading-snug line-clamp-2 mt-0.5 group-hover:text-[#005d4b] transition-colors">
                          {episode.title}
                        </h4>
                      </div>
                      
                      <div className="pt-2 flex items-end justify-between gap-2">
                        <div className="space-y-0.5">
                          <p className="text-[11px] font-black text-[#00a887] leading-none">{episode.host}</p>
                          <p className="text-[9px] text-slate-400 font-bold leading-none">{episode.role}</p>
                        </div>
                        
                        {/* Play button circle */}
                        <div className="w-8 h-8 rounded-full bg-[#e6f6f3] group-hover:bg-[#00a887] text-[#00a887] group-hover:text-white transition-all flex items-center justify-center shrink-0 shadow-sm hover:scale-105 active:scale-95 cursor-pointer">
                          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current ml-0.5" strokeWidth="0">
                            <polygon points="6,4 20,12 6,20" />
                          </svg>
                        </div>
                      </div>
                    </div>

                  </motion.div>
                ))}
              </motion.div>

              {/* Footer controls & handwritten tagline */}
              <div className="pt-6 flex flex-col sm:flex-row items-center gap-6 sm:gap-12 justify-start border-t border-slate-100 mt-2 relative z-20">
                
                {/* Listen Now Button */}
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center gap-2.5 h-12.5 px-8 bg-gradient-to-r from-[#00a887] to-[#008f72] hover:from-[#008f72] hover:to-[#00735b] text-white font-extrabold text-xs tracking-wider uppercase rounded-2xl transition-all shadow-[0_4px_15px_rgba(0,168,135,0.2)] hover:shadow-[0_6px_20px_rgba(0,168,135,0.35)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] shrink-0"
                >
                  <svg viewBox="0 0 24 24" className="w-4.5 h-4.5 fill-none stroke-current" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
                    <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
                  </svg>
                  Listen Now
                </a>

                {/* Tagline text and accent Arrow */}
                <div className="flex items-center gap-4 relative">
                  <svg className="w-12 h-10 text-[#00a887] shrink-0 rotate-[6deg]" viewBox="0 0 50 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 15C15 18 25 24 42 12M42 12C37 11 34 9 32 7M42 12C41 15 39 18 39 21" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  
                  <div className="relative rotate-[-2deg]">
                    <span className="font-caveat text-2xl sm:text-3xl text-[#00a887] font-semibold tracking-wide block leading-none pb-1">
                      Inspiring minds.<br />
                      <span className="relative inline-block mt-1">
                        Advancing science.
                        {/* Custom hand-drawn underline */}
                        <svg className="absolute -bottom-2.5 left-0 w-full h-2 text-[#00a887]/80" viewBox="0 0 120 10" fill="none" preserveAspectRatio="none">
                          <path d="M2 3 C 30 1, 60 1, 118 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                          <path d="M5 7 C 35 5, 75 4, 115 8" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
                        </svg>
                      </span>
                    </span>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ----------------- SECTION 5: Golden Tickets Banner ----------------- */}
      <div className="w-full bg-[#00796b] py-6 text-center px-4 flex items-center justify-center gap-2">
        <Award className="w-5 h-5 text-white" />
        <a 
          href="#contact" 
          className="text-white font-extrabold text-sm sm:text-base tracking-wider uppercase underline underline-offset-4 hover:opacity-90 transition-opacity"
        >
          LEARN MORE ABOUT BIOLABS&apos; GOLDEN TICKETS!
        </a>
      </div>

      {/* ----------------- Research Council Section ----------------- */}
      <section className="py-24 px-6 bg-slate-950 text-white relative overflow-hidden border-t border-b border-slate-900">
        
        {/* Background glows */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full filter blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full filter blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto space-y-16 relative z-10">
          
          {/* Header */}
          <div className="text-center space-y-4">
            <span className="inline-flex items-center gap-2 text-xs font-mono font-extrabold text-[#00a887] tracking-widest uppercase bg-[#0f172a] px-3.5 py-1.5 rounded-full border border-[#00a887]/20 shadow-sm">
              <img src="/biolabs/biolabs-logo.png" alt="Logo" className="w-4 h-4 rounded-full" />
              Guiding Innovation
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight pt-2">
              Research Council
            </h2>
            <div className="w-12 h-[3px] bg-[#00a887] mx-auto rounded-full" />
            <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base font-semibold leading-relaxed">
              Meet the distinguished scientists and innovators guiding BioLabs&apos; research direction and mentoring the next generation of life science leaders.
            </p>
          </div>

          {/* Profiles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
            {councilMembers.map((member, idx) => (
              <div key={idx} className="w-full h-[450px] [perspective:1000px] group">
                <div className="relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                  
                  {/* FRONT SIDE */}
                  <div className="absolute inset-0 w-full h-full bg-slate-900/50 border border-slate-800 hover:border-cyan-500/30 rounded-3xl p-6 flex flex-col justify-between items-center [backface-visibility:hidden] backdrop-blur-md shadow-2xl transition-colors duration-300">
                    {/* Double glowing border container for image */}
                    <div className="relative w-40 h-40 rounded-full p-1 bg-gradient-to-tr from-[#008cff]/50 to-[#00a887]/50 shadow-[0_0_20px_rgba(0,140,255,0.2)] flex items-center justify-center">
                      <div className="w-full h-full rounded-full p-1 bg-slate-950 flex items-center justify-center">
                        <img 
                          src={member.image} 
                          alt={member.name} 
                          className="w-full h-full rounded-full object-cover border-2 border-cyan-400/50 shadow-[0_0_15px_rgba(34,211,238,0.3)]" 
                        />
                      </div>
                    </div>

                    {/* Dark Name Card Below */}
                    <div className="w-full bg-slate-950/65 border border-slate-800/60 rounded-2xl p-5 text-center shadow-lg mt-4 flex-1 flex flex-col justify-center space-y-1.5">
                      <h3 className="text-lg font-sans font-extrabold text-white tracking-tight leading-tight">{member.name}</h3>
                      <p className="text-xs font-bold text-[#00a887] uppercase tracking-wider">{member.role}</p>
                      <p className="text-xs text-slate-400 font-semibold">{member.lead}</p>
                      
                      <div className="pt-2.5 text-[10px] text-slate-500 font-mono flex items-center justify-center gap-1.5 font-bold uppercase tracking-wider">
                        <span>Tap to view Bio</span>
                        <ChevronRight className="w-3.5 h-3.5 text-cyan-500 animate-pulse" />
                      </div>
                    </div>
                  </div>

                  {/* BACK SIDE */}
                  <div className="absolute inset-0 w-full h-full bg-slate-950/95 border border-slate-800 group-hover:border-[#00a887]/40 rounded-3xl p-8 flex flex-col justify-between [backface-visibility:hidden] [transform:rotateY(180deg)] shadow-[inset_0_0_30px_rgba(0,168,135,0.1),0_0_30px_rgba(0,168,135,0.15)] transition-all duration-300">
                    <div className="space-y-4 text-center">
                      <h4 className="font-sans text-[#00a887] text-xs uppercase tracking-widest font-extrabold">Biography</h4>
                      <div className="w-8 h-[2px] bg-[#00a887] mx-auto rounded-full" />
                      <p className="text-xs text-slate-350 leading-relaxed font-semibold">
                        {member.description}
                      </p>
                    </div>
                    
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-full h-px bg-slate-800" />
                      <div className="flex gap-4">
                        <a 
                          href={member.linkedin} 
                          className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 hover:bg-[#00a887]/20 hover:border-[#00a887]/50 hover:scale-105 transition-all flex items-center justify-center text-white shadow-sm"
                          aria-label="LinkedIn"
                        >
                          <ExternalLink className="w-4.5 h-4.5 text-[#00a887]" />
                        </a>
                        <a 
                          href={member.email} 
                          className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 hover:bg-[#00a887]/20 hover:border-[#00a887]/50 hover:scale-105 transition-all flex items-center justify-center text-white shadow-sm"
                          aria-label="Email"
                        >
                          <Mail className="w-4.5 h-4.5 text-[#00a887]" />
                        </a>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ----------------- Contact / Let's Connect Section ----------------- */}
      <section id="contact" className="py-28 px-6 bg-white relative overflow-hidden flex flex-col items-center justify-center">
        
        {/* Organic corner background shapes */}
        <div className="absolute -top-16 -right-16 z-0 pointer-events-none w-80 h-80 opacity-20 text-[#00a887]">
          <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path d="M100,0 C160,0 200,40 200,100 C200,160 160,200 100,200 C40,200 0,160 0,100 C0,40 40,0 100,0 Z" fill="currentColor" />
            <path d="M80,10 C130,30 180,80 190,130" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M50,30 C100,60 140,110 160,160" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
          </svg>
        </div>

        <div className="absolute -bottom-16 -left-16 z-0 pointer-events-none w-80 h-80 opacity-20 text-[#00a887]">
          <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path d="M100,0 C160,0 200,40 200,100 C200,160 160,200 100,200 C40,200 0,160 0,100 C0,40 40,0 100,0 Z" fill="currentColor" />
            <path d="M10,70 C50,120 100,170 150,190" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M30,40 C70,90 120,130 170,160" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
          </svg>
        </div>

        {/* SVG Definition for the organic scientist crop */}
        <svg className="absolute w-0 h-0 pointer-events-none">
          <defs>
            <clipPath id="scientist-clip" clipPathUnits="objectBoundingBox">
              <path d="M 0.5,0 C 0.75,-0.05 0.95,0.1 0.98,0.35 C 1.02,0.6 0.95,0.8 0.78,0.92 C 0.62,1.02 0.35,1.03 0.18,0.92 C 0.02,0.8 -0.05,0.55 0.04,0.35 C 0.12,0.15 0.28,0.05 0.5,0 Z" />
            </clipPath>
          </defs>
        </svg>

        <div className="max-w-7xl mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Organic Scientist Portrait */}
          <div className="lg:col-span-4 flex justify-center w-full">
            <motion.div 
              variants={revealVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="w-full max-w-[340px] lg:max-w-none aspect-[4/5] overflow-hidden drop-shadow-[0_10px_35px_rgba(0,0,0,0.04)]"
            >
              <img 
                src="/biolabs/lets_connect_scientist.jpg" 
                alt="Healix BioLabs Scientist" 
                className="w-full h-full object-cover"
                style={{ clipPath: "url(#scientist-clip)" }}
              />
            </motion.div>
          </div>

          {/* Middle Column: Let's Connect Details */}
          <div className="lg:col-span-4 text-left space-y-6 lg:px-4">
            
            {/* Get In Touch Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#e6f6f3] text-[#00a887] text-[10px] font-black uppercase tracking-wider shadow-inner font-sans">
              <svg className="w-3.5 h-3.5 text-[#00a887] fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 21 C 2 21, 6 15, 12 15 C 18 15, 22 11, 22 6 C 22 4, 20 2, 18 2 C 13 2, 9 6, 9 12 C 9 18, 2 21, 2 21 Z" />
              </svg>
              Get In Touch
            </div>

            <div className="space-y-3">
              <h3 className="text-5xl font-black text-slate-900 tracking-tight leading-none">
                Let&apos;s Connect
              </h3>
              <div className="w-12 h-1.2 bg-[#00a887] rounded-full" />
            </div>

            <p className="text-slate-500 font-medium text-sm leading-relaxed max-w-sm">
              We&apos;re here to answer your questions, discuss collaborations, and explore ways we can work together for a healthier tomorrow.
            </p>

            {/* Detailed Cards */}
            <div className="space-y-5.5 pt-2">
              
              {/* Location Detail */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#e6f6f3] border border-[#b2e2d9]/40 flex items-center justify-center text-[#00a887] shrink-0 shadow-sm">
                  <MapPin className="w-4.5 h-4.5" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-sm font-bold text-[#00a887] leading-none">IIT Madras Campus</h4>
                  <p className="text-[11px] font-bold text-slate-400 leading-normal">Chennai, Tamil Nadu 600036, India</p>
                </div>
              </div>

              {/* Email Detail */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#e6f6f3] border border-[#b2e2d9]/40 flex items-center justify-center text-[#00a887] shrink-0 shadow-sm">
                  <Mail className="w-4.5 h-4.5" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-sm font-bold text-[#00a887] leading-none">admin@biolabsresearch-healix.com</h4>
                  <p className="text-[11px] font-bold text-slate-400 leading-normal">We typically reply within 24 hours</p>
                </div>
              </div>

              {/* Phone Detail */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#e6f6f3] border border-[#b2e2d9]/40 flex items-center justify-center text-[#00a887] shrink-0 shadow-sm">
                  <Phone className="w-4.5 h-4.5" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-sm font-bold text-[#00a887] leading-none">+91 44 2457 1234</h4>
                  <p className="text-[11px] font-bold text-slate-400 leading-normal">Mon – Fri, 9:00 AM – 6:00 PM IST</p>
                </div>
              </div>

            </div>

          </div>

          {/* Right Column: Send Message Card */}
          <div className="lg:col-span-4 w-full">
            <div className="bg-white border border-slate-100 rounded-[36px] p-8 sm:p-10 shadow-[0_15px_50px_rgba(0,0,0,0.03)] space-y-6">
              
              <h4 className="text-xl font-black text-slate-800 text-left tracking-tight">Send us a message</h4>

              {formSubmitted ? (
                <div className="py-10 flex flex-col items-center text-center space-y-4 animate-scale-in">
                  <div className="w-14 h-14 rounded-full bg-[#e6f6f3] border border-[#00a887] flex items-center justify-center shadow-[0_4px_15px_rgba(0,168,135,0.2)] text-[#00a887]">
                    <Check className="w-6 h-6 stroke-[3]" />
                  </div>
                  <h5 className="font-extrabold text-lg text-slate-800">Inquiry Submitted</h5>
                  <p className="text-xs text-slate-400 font-bold max-w-[200px] leading-relaxed">
                    Thank you! We will get back to you shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-5">
                  
                  {/* Name field */}
                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Name</label>
                    <div className="relative flex items-center">
                      <User className="absolute left-4 w-4.5 h-4.5 text-slate-400" />
                      <input 
                        type="text" 
                        required
                        placeholder="Your full name" 
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        className="w-full h-12 bg-slate-50/50 text-slate-800 border border-slate-200 rounded-xl pl-11 pr-4 text-xs font-bold outline-none transition-all focus:border-[#00a887] focus:bg-white focus:ring-1 focus:ring-[#00a887]/20 placeholder-slate-400"
                      />
                    </div>
                  </div>

                  {/* Email field */}
                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Email</label>
                    <div className="relative flex items-center">
                      <Mail className="absolute left-4 w-4.5 h-4.5 text-slate-400" />
                      <input 
                        type="email" 
                        required
                        placeholder="Your email address" 
                        value={formEmail}
                        onChange={(e) => setFormEmail(e.target.value)}
                        className="w-full h-12 bg-slate-50/50 text-slate-800 border border-slate-200 rounded-xl pl-11 pr-4 text-xs font-bold outline-none transition-all focus:border-[#00a887] focus:bg-white focus:ring-1 focus:ring-[#00a887]/20 placeholder-slate-400"
                      />
                    </div>
                  </div>

                  {/* Message field */}
                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">How can we help?</label>
                    <div className="relative flex items-start">
                      <MessageSquare className="absolute left-4 top-3.5 w-4.5 h-4.5 text-slate-400" />
                      <textarea 
                        required
                        rows={4}
                        placeholder="Tell us more about your inquiry..." 
                        value={formMessage}
                        onChange={(e) => setFormMessage(e.target.value)}
                        className="w-full bg-slate-50/50 text-slate-800 border border-slate-200 rounded-xl pl-11 pr-4 pt-3.5 text-xs font-bold outline-none resize-none transition-all focus:border-[#00a887] focus:bg-white focus:ring-1 focus:ring-[#00a887]/20 placeholder-slate-400"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="h-12.5 w-full bg-[#008a47] hover:bg-[#00733a] text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl transition-all shadow-[0_4px_15px_rgba(0,138,71,0.2)] hover:shadow-[0_6px_20px_rgba(0,138,71,0.3)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      Send Message
                    </button>
                  </div>
                </form>
              )}

              {/* Privacy Shield */}
              <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 font-semibold pt-1 border-t border-slate-50">
                <ShieldCheck className="w-4 h-4 text-[#00a887] shrink-0" />
                <span>We respect your privacy. Your information is safe with us.</span>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ----------------- Footer ----------------- */}
      <footer className="bg-slate-50 border-t border-slate-200 py-10 px-6 text-center text-xs text-slate-500">
        <p className="font-semibold text-slate-700 mb-2">© {new Date().getFullYear()} BioLabs by Healix Technologies. All Rights Reserved.</p>
        <p className="max-w-md mx-auto leading-relaxed">Best-in-class laboratory equipment, prime spaces, and research ecosystems.</p>
      </footer>

      {/* ----------------- Cookie Consent Banner ----------------- */}
      <AnimatePresence>
        {cookieConsent && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="fixed bottom-0 inset-x-0 z-50 p-4"
          >
            <div className="max-w-5xl mx-auto bg-white border border-slate-200 p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-2xl relative">
              <button 
                onClick={() => setCookieConsent(false)}
                className="absolute top-2 right-2 text-slate-400 hover:text-slate-600"
                aria-label="Close cookie consent"
              >
                <X className="w-4 h-4" />
              </button>

              <p className="text-xs text-slate-600 pr-6 text-center md:text-left leading-normal">
                We use cookies on our website to see how you interact with it. By accepting, you agree to our use of such cookies. 
                <span className="text-slate-800 font-semibold underline ml-1 cursor-pointer hover:opacity-85">Privacy Policy</span>
              </p>
              
              <div className="flex items-center gap-3 shrink-0">
                <button 
                  onClick={handleAcceptCookies}
                  className="text-xs text-slate-500 hover:text-slate-700 underline font-semibold cursor-pointer"
                >
                  Settings
                </button>
                <button 
                  onClick={handleAcceptCookies}
                  className="h-8 px-4 border border-slate-350 hover:bg-slate-50 text-slate-800 font-bold text-[11px] uppercase tracking-wider rounded-sm transition-all"
                >
                  Decline All
                </button>
                <button 
                  onClick={handleAcceptCookies}
                  className="h-8 px-5 bg-black hover:bg-black/90 text-white font-bold text-[11px] uppercase tracking-wider rounded-sm transition-all"
                >
                  Accept
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

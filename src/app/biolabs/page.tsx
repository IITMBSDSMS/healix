"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Mic, Check, X, Award, ChevronDown, Search, Megaphone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import IndiaMap from "./IndiaMap";

// ==========================================
// MOCK DATA
// ==========================================

const galleryPhotos = [
  "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=400&auto=format&fit=crop", // Lab technician
  "https://images.unsplash.com/photo-1579154204601-01588f35116f?q=80&w=400&auto=format&fit=crop", // Equipment
  "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=400&auto=format&fit=crop", // Lounge
  "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=400&auto=format&fit=crop", // Server room
  "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=400&auto=format&fit=crop", // Bench area
  "https://images.unsplash.com/photo-1532187863486-abf9d39d66e8?q=80&w=400&auto=format&fit=crop", // Microscope work
  "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=400&auto=format&fit=crop", // Dining
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=400&auto=format&fit=crop", // Corridor
  "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=400&auto=format&fit=crop", // Meeting room
  "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=400&auto=format&fit=crop", // Discussion
  "https://images.unsplash.com/photo-1614947942704-5827be95b369?q=80&w=400&auto=format&fit=crop", // Fluidics
  "https://images.unsplash.com/photo-1576086213369-97a306d36557?q=80&w=400&auto=format&fit=crop"  // Benches
];

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

export default function BioLabsPage() {
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
      
      {/* ----------------- Navigation ----------------- */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <BioLabsLogoGrid className="w-6 h-6" />
            <span className="font-extrabold text-2xl tracking-tight text-[#0f172a] font-sans">BioLabs</span>
          </div>
          <div className="hidden lg:block h-6 w-px bg-slate-200" />
          <span className="hidden lg:block text-xs font-semibold text-slate-500 tracking-wide">
            Accelerating Interdisciplinary Innovation
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-700">
          <div className="relative group cursor-pointer flex items-center gap-1 hover:text-[#00a887] transition-colors">
            <span>Products</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </div>
          <div className="relative group cursor-pointer flex items-center gap-1 hover:text-[#00a887] transition-colors">
            <span>Services</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </div>
          <div className="relative group cursor-pointer flex items-center gap-1 hover:text-[#00a887] transition-colors">
            <span>Resources</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </div>
          <div className="relative group cursor-pointer flex items-center gap-1 hover:text-[#00a887] transition-colors">
            <span>About</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </div>
          <a href="#contact" className="hover:text-[#00a887] transition-colors">Contact</a>
        </nav>

        <div className="flex items-center gap-4">
          <button className="text-slate-600 hover:text-slate-900 transition-colors cursor-pointer" aria-label="Search">
            <Search className="w-5 h-5" />
          </button>
          <a
            href="#contact"
            className="flex items-center gap-2 h-10 px-5 bg-[#00a887] hover:bg-[#008f72] text-white font-bold text-sm tracking-wide rounded-lg transition-colors shadow-sm"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current" strokeWidth="2">
              <rect x="3" y="3" width="7" height="9" rx="1" />
              <rect x="14" y="3" width="7" height="5" rx="1" />
              <rect x="14" y="12" width="7" height="9" rx="1" />
              <rect x="3" y="16" width="7" height="5" rx="1" />
            </svg>
            Dashboard
          </a>
        </div>
      </header>

      {/* ----------------- SECTION 1: Hero equipment config ----------------- */}
      <section id="biotech" className="relative min-h-[600px] flex flex-col justify-between overflow-hidden bg-slate-100">
        
        {/* Laboratory Background */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1600&auto=format&fit=crop" 
            alt="Lab Environment"
            className="w-full h-full object-cover filter blur-[2px] scale-102 brightness-90"
          />
          <div className="absolute inset-0 bg-slate-900/10" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full px-6 flex-1 flex items-center justify-center py-12">
          {/* Main Beaker Card */}
          <div className="bg-white rounded-[32px] shadow-2xl border border-slate-100/50 p-8 sm:p-12 text-center max-w-2xl mx-auto flex-1 relative transform transition-all duration-300">
            
            {/* Circular Green Beaker Icon Header */}
            <div className="mx-auto w-14 h-14 rounded-full border border-[#00a887]/20 flex items-center justify-center text-[#00a887] bg-[#e6f6f3] mb-6">
              <BeakerIcon className="w-6 h-6" />
            </div>

            {/* Title & Description with switcher state */}
            <div className="space-y-4 min-h-[160px] flex flex-col justify-center">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0f172a] tracking-tight font-sans">
                {selectedEquipment !== null ? equipmentDetails[selectedEquipment].title : "Build Your Biotech"}
              </h1>
              <div className="mx-auto w-10 h-[2px] bg-[#00a887]" />
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-xl mx-auto font-medium">
                {selectedEquipment !== null ? equipmentDetails[selectedEquipment].description : "Find and configure the essential lab equipment you need to bring your science to life. From PCR machines and centrifuges to incubators and biosafety cabinets—build a lab that's ready for breakthrough discoveries."}
              </p>
            </div>

            {/* Switcher Row */}
            <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
              {equipmentDetails.map((eq, idx) => {
                const isSelected = selectedEquipment === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedEquipment(isSelected ? null : idx)}
                    className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-300 transform active:scale-95 cursor-pointer ${eq.color} ${
                      isSelected
                        ? "ring-4 ring-slate-200 scale-110 shadow-md"
                        : "opacity-80 hover:opacity-100 hover:scale-105"
                    }`}
                    title={eq.title}
                  >
                    {eq.icon}
                  </button>
                );
              })}
              
              {/* Plus Button */}
              <button 
                onClick={() => setSelectedEquipment(null)}
                className="w-12 h-12 rounded-full border border-slate-200 text-slate-500 bg-slate-50 hover:bg-slate-100 flex items-center justify-center transition-all duration-300 cursor-pointer"
                title="All Equipment"
              >
                <span className="text-xl font-light font-sans">+</span>
              </button>
            </div>

            {/* CTA Button */}
            <div className="mt-8">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 h-12 px-8 bg-[#00a887] hover:bg-[#008f72] text-white font-bold text-sm tracking-wide rounded-lg transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
              >
                Explore Equipment
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>
            
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="relative z-10 w-full bg-[#00a887] py-4.5 text-center px-4 flex items-center justify-center gap-2 hover:bg-[#009678] transition-colors">
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

      {/* ----------------- SECTION 2: Locations ----------------- */}
      <section id="locations" className="py-20 px-6 bg-[#f7f9fa] border-b border-slate-200">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center">
            <h2 className="text-4xl font-extrabold text-[#004d40] tracking-tight">Locations</h2>
          </div>

          {/* Real Interactive Map of India */}
          <div className="max-w-3xl mx-auto">
            <IndiaMap activeStates={["ka", "mh", "tg", "dl", "tn"]} />
          </div>

          {/* Bottom news link */}
          <div className="pt-8 text-center flex items-center justify-center gap-2">
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

      {/* ----------------- SECTION 3: Podcast Banner ----------------- */}
      <div className="w-full bg-[#004d40] py-6 text-center px-4 border-b border-slate-900/10">
        <a 
          href="#contact" 
          className="text-white font-extrabold text-sm sm:text-base tracking-wider uppercase underline underline-offset-4 hover:opacity-90 transition-opacity"
        >
          CHECK OUT OUR b.empowered PODCAST SERIES FROM BIO 2025!
        </a>
      </div>

      {/* ----------------- SECTION 4: Spaces Gallery Collage ----------------- */}
      <section id="gallery" className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {galleryPhotos.map((photoUrl, idx) => (
              <div 
                key={idx} 
                className="relative h-[160px] sm:h-[200px] overflow-hidden border border-slate-100 group shadow-md"
              >
                <img 
                  src={photoUrl} 
                  alt={`Lab Space ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors duration-300" />
              </div>
            ))}
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

      {/* ----------------- SECTION 6: Split Contact/Inquiry ----------------- */}
      <section id="contact" className="grid grid-cols-1 lg:grid-cols-2 items-stretch min-h-[450px]">
        
        {/* Left: Find Us */}
        <div className="relative p-12 sm:p-20 flex flex-col justify-center bg-slate-900 text-white overflow-hidden min-h-[350px]">
          <img 
            src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800&auto=format&fit=crop" 
            alt="Scientist background"
            className="absolute inset-0 w-full h-full object-cover filter blur-[4px] opacity-25 scale-105 pointer-events-none" 
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#004d40]/80 to-[#00796b]/60 pointer-events-none" />

          <div className="relative z-10 space-y-6 max-w-md">
            <h3 className="text-4xl font-extrabold tracking-tight">Find Us</h3>
            <p className="text-lg leading-relaxed font-medium">
              One Main Street, Suite 1100,<br />
              Cambridge, MA 02142
            </p>
          </div>
        </div>

        {/* Right: General Inquiries Form */}
        <div className="bg-gradient-to-br from-[#00796b] to-[#004d40] p-12 sm:p-20 flex flex-col justify-center text-white">
          <div className="max-w-md w-full space-y-8">
            
            <h3 className="text-3xl font-extrabold tracking-tight">General Inquiries</h3>

            {formSubmitted ? (
              <div className="py-8 flex flex-col items-center text-center space-y-4 animate-scale-in">
                <div className="w-10 h-10 rounded-full bg-white/10 border border-white flex items-center justify-center">
                  <Check className="w-5 h-5 text-white" />
                </div>
                <h4 className="font-bold text-lg">Inquiry Submitted</h4>
                <p className="text-xs text-teal-100">
                  Thank you! We will get back to you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <input 
                  type="text" 
                  required
                  placeholder="Name" 
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full h-11 bg-white text-slate-800 rounded-sm px-4 text-sm outline-none border-none placeholder-slate-400"
                />

                <input 
                  type="email" 
                  required
                  placeholder="Email" 
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="w-full h-11 bg-white text-slate-800 rounded-sm px-4 text-sm outline-none border-none placeholder-slate-400"
                />

                <input 
                  type="text" 
                  placeholder="Subject" 
                  value={formSubject}
                  onChange={(e) => setFormSubject(e.target.value)}
                  className="w-full h-11 bg-white text-slate-800 rounded-sm px-4 text-sm outline-none border-none placeholder-slate-400"
                />

                <textarea 
                  required
                  rows={4}
                  placeholder="Type your message here..." 
                  value={formMessage}
                  onChange={(e) => setFormMessage(e.target.value)}
                  className="w-full bg-white text-slate-800 rounded-sm p-4 text-sm outline-none border-none placeholder-slate-400 resize-none"
                />

                <button
                  type="submit"
                  className="h-11 px-8 bg-[#00332c] hover:bg-[#00211c] text-white font-bold text-xs uppercase tracking-wider rounded-sm transition-colors active:scale-[0.98] cursor-pointer"
                >
                  Submit
                </button>
              </form>
            )}

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

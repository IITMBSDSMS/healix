"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  GraduationCap, 
  ArrowRight, 
  Heart, 
  Building2, 
  Microscope, 
  Handshake, 
  ChevronLeft, 
  ChevronRight,
  Globe,
  Lightbulb
} from "lucide-react";
import Image from "next/image";
import { Footer } from "@/components/layout/Footer";

const DEFAULT_TEAM_MEMBERS = [
  {
    name: "Chhavi Gherwal",
    role: "Human & Development System",
    photo: "/member_chhavi.png"
  },
  {
    name: "Vanshika Sharma",
    role: "Human System Design & UI Design",
    photo: "/member_vanshika.png"
  },
  {
    name: "Vasudha Arora",
    role: "Teaching & Research Specialist",
    photo: "/member_vasudha.png"
  },
  {
    name: "Dr. Sakti Khanna",
    role: "Emotional & Wellness Department",
    photo: "/member_sakti.png"
  },
  {
    name: "Khushi Acharya",
    role: "Emotional & Wellness Department",
    photo: "/member_khushi.png"
  },
  {
    name: "Dr. Moses",
    role: "Emotional & Wellness Department",
    photo: "/member_moses.png"
  },
  {
    name: "Dr. Vinitha",
    role: "Emotional & Wellness Department",
    photo: "/member_vinitha.png"
  },
  {
    name: "Madhuri Jha",
    role: "Teaching Research",
    photo: "/member_madhuri.png"
  },
  {
    name: "Himanshi",
    role: "Peer Counselor",
    photo: "/member_himanshi.jpg"
  }
];

export default function MembersPage() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = React.useState(0);

  const [ambassadors, setAmbassadors] = React.useState<any[]>([]);
  const [doctors, setDoctors] = React.useState<any[]>([]);

  // Fetch from database on mount
  React.useEffect(() => {
    fetch("/api/ambassadors")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setAmbassadors(data.filter((a: any) => a.active));
        }
      })
      .catch((err) => console.error("Error fetching ambassadors:", err));

    fetch("/api/professionals")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setDoctors(data.filter((p: any) => p.active));
        }
      })
      .catch((err) => console.error("Error fetching professionals:", err));
  }, []);

  const activeAmbassadors = [
    "/ambassador_1.png",
    "/ambassador_2.png",
    "/ambassador_3.png",
    "/ambassador_4.png"
  ];

  const [currentAmbassadorIdx, setCurrentAmbassadorIdx] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentAmbassadorIdx((prev) => (prev + 1) % activeAmbassadors.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [activeAmbassadors.length]);

  const activeDoctors = doctors.length > 0
    ? doctors.map(d => d.photo_url || d.photo)
    : [
        "/dr_samir_kalra.png",
        "/healthcare_professional.png",
        "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=400&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1594824813573-246434de83fb?q=80&w=400&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=400&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=400&auto=format&fit=crop"
      ];

  const [currentDoctorIdx, setCurrentDoctorIdx] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDoctorIdx((prev) => (prev + 1) % activeDoctors.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [activeDoctors.length]);

  React.useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const scrollPos = containerRef.current.scrollTop;
      const height = containerRef.current.clientHeight || window.innerHeight;
      const index = Math.round(scrollPos / height);
      setActiveSection(index);

      // Dispatch custom scroll event to trigger header hide/show animation
      window.dispatchEvent(new CustomEvent("custom-scroll", {
        detail: { scrollTop: scrollPos }
      }));
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  const scrollToSection = (index: number) => {
    if (!containerRef.current) return;
    const height = containerRef.current.clientHeight || window.innerHeight;
    containerRef.current.scrollTo({
      top: index * height,
      behavior: "smooth"
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  // SVG Vector Logos for Partners
  const partners = [
    {
      name: "IIT Bombay",
      type: "IIT",
      logoUrl: "/iit_bombay_color.svg",
    },
    {
      name: "IIT Delhi",
      type: "IIT",
      logoUrl: "/iit_delhi_color.svg",
    },
    {
      name: "IIT Madras",
      type: "IIT",
      logoUrl: "/iit_madras_color.svg",
    },
    {
      name: "TATA",
      type: "TATA",
      logoUrl: "/tata_color.svg",
    },
    {
      name: "CORE-IND",
      type: "CORE-IND",
      logo: (
        <svg viewBox="0 0 100 100" fill="none" className="w-12 h-12 sm:w-14 sm:h-14 stroke-current stroke-[2.2]">
          <polygon points="50,15 85,35 85,75 50,95 15,75 15,35" strokeWidth="2.5" />
          <line x1="50" y1="15" x2="50" y2="55" strokeWidth="2.5" />
          <line x1="50" y1="55" x2="15" y2="35" strokeWidth="2.5" />
          <line x1="50" y1="55" x2="85" y2="35" strokeWidth="2.5" />
          <line x1="15" y1="35" x2="50" y2="95" opacity="0.4" />
          <line x1="85" y1="35" x2="50" y2="95" opacity="0.4" />
          <line x1="50" y1="15" x2="15" y2="75" opacity="0.4" />
          <line x1="50" y1="15" x2="85" y2="75" opacity="0.4" />
          <circle cx="50" cy="15" r="4" fill="currentColor" />
          <circle cx="85" cy="35" r="4" fill="currentColor" />
          <circle cx="85" cy="75" r="4" fill="currentColor" />
          <circle cx="50" cy="95" r="4" fill="currentColor" />
          <circle cx="15" cy="75" r="4" fill="currentColor" />
          <circle cx="15" cy="35" r="4" fill="currentColor" />
          <circle cx="50" cy="55" r="4" fill="currentColor" />
        </svg>
      ),
    },
  ];
  return (
    <div ref={containerRef} className="h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth bg-white selection:bg-orange-500/20 relative z-10">
      
      {/* Floating Dot Navigation (Right Side) */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-4">
        {[0, 1, 2, 3, 4].map((idx) => (
          <button
            key={idx}
            onClick={() => scrollToSection(idx)}
            className="w-3.5 h-3.5 rounded-full transition-all duration-300 relative group flex items-center justify-center"
            aria-label={`Go to section ${idx + 1}`}
          >
            {/* Ring shape */}
            <span className={`absolute inset-0 rounded-full border-2 transition-all duration-300 ${
              activeSection === idx 
                ? "border-[#ff7a00] scale-125" 
                : "border-transparent scale-75 group-hover:scale-100 group-hover:border-zinc-400"
            }`} />
            {/* Central dot */}
            <span className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              activeSection === idx 
                ? "bg-[#ff7a00]" 
                : "bg-zinc-400 group-hover:bg-zinc-600"
            }`} />
            
            {/* Label tooltip */}
            <span className="absolute right-6 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 bg-zinc-900 text-white text-[9px] font-mono font-bold uppercase tracking-wider py-1 px-2.5 rounded shadow-md pointer-events-none whitespace-nowrap">
              {idx === 0 ? "Ambassadors" : idx === 1 ? "Healthcare" : idx === 2 ? "Our Members" : idx === 3 ? "Partnerships" : "Footer"}
            </span>
          </button>
        ))}
      </div>
      
      {/* ── SECTION 1: CAMPUS AMBASSADORS ── */}
      <section className="min-h-[calc(100vh-220px)] lg:h-[calc(100vh-220px)] snap-start w-full relative flex items-center pt-8 lg:pt-0 bg-[#fdfbf7] overflow-hidden">
        
        {/* ── Background Ornaments from Mockup (Image 2) ── */}
        
        {/* Top-Left: 4x4 Dotted Grid */}
        <div className="absolute top-[8%] left-[8%] grid grid-cols-4 gap-2.5 opacity-25 pointer-events-none">
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={`dot-tl-${i}`} className="w-1.5 h-1.5 rounded-full bg-[#ea580c]" />
          ))}
        </div>

        {/* Top-Right: 4x4 Dotted Grid */}
        <div className="absolute top-[8%] right-[8%] grid grid-cols-4 gap-2.5 opacity-25 pointer-events-none">
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={`dot-tr-${i}`} className="w-1.5 h-1.5 rounded-full bg-[#ea580c]" />
          ))}
        </div>

        {/* Top-Center: Filled Orange Triangle (pointing down) */}
        <div className="absolute top-[6%] left-[45%] opacity-85 pointer-events-none">
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
            <path d="M10 18 L2 2 L18 2 Z" fill="#ff7a00" />
          </svg>
        </div>

        {/* Top-Right: Red/Orange Circular Outline */}
        <div className="absolute top-[18%] right-[6%] w-10 h-10 rounded-full border-2 border-[#ff7a00]/30 pointer-events-none" />

        {/* Bottom-Center: Triangle Dotted Grid */}
        <div className="absolute bottom-[12%] left-[46%] flex flex-col items-center gap-1.5 opacity-30 pointer-events-none">
          <div className="flex gap-2.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#ea580c]" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#ea580c]" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#ea580c]" />
          </div>
          <div className="flex gap-2.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#ea580c]" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#ea580c]" />
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-[#ea580c]" />
        </div>

        {/* Bottom-Left: Circular Outline */}
        <div className="absolute bottom-[16%] left-[34%] w-8 h-8 rounded-full border-2 border-[#ff7a00]/30 pointer-events-none" />

        {/* Bottom-Center: Yellow Plus Symbol */}
        <div className="absolute bottom-[10%] left-[38%] text-xl font-bold text-amber-500 opacity-80 pointer-events-none select-none">+</div>

        {/* Bottom-Right: Hollow Triangle Outline */}
        <div className="absolute bottom-[24%] right-[8%] opacity-65 pointer-events-none">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M12 4 L22 20 L2 20 Z" stroke="#ff7a00" strokeWidth="2" />
          </svg>
        </div>

        {/* Bottom-Right: Huge Orange Sphere (with white diagonal stripes) */}
        <div className="absolute bottom-[-50px] right-[-50px] w-48 h-48 rounded-full bg-[#ff7a00] shadow-lg overflow-hidden pointer-events-none z-0">
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: "linear-gradient(45deg, white 25%, transparent 25%, transparent 50%, white 50%, white 75%, transparent 75%, transparent)",
            backgroundSize: "24px 24px"
          }} />
        </div>

        {/* Bottom-Left: Sweeping Wave Background */}
        <div className="absolute bottom-0 left-0 w-64 h-32 opacity-10 pointer-events-none">
          <svg width="256" height="128" viewBox="0 0 256 128" fill="none">
            <path d="M-50 90 Q 60 10, 160 100 T 320 50" stroke="#ff7a00" strokeWidth="24" fill="none" opacity="0.3" />
          </svg>
        </div>

        <div className="max-w-[94%] mx-auto px-6 sm:px-8 lg:px-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
          
          {/* Left Column (Content) */}
          <motion.div 
            className="lg:col-span-6 space-y-6 text-left"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h1 
              variants={itemVariants}
              className="text-5xl md:text-6xl lg:text-7xl font-black font-sans tracking-tight text-zinc-950 uppercase leading-[0.9]"
            >
              Empower <br />
              Your <br />
              <span className="text-[#ff7a00]">Institution</span>
            </motion.h1>

            <motion.p 
              variants={itemVariants}
              className="text-sm md:text-base text-zinc-800 leading-relaxed max-w-xl font-sans"
            >
              Join the Healix Campus Ambassador Program and represent innovation at your institution. Lead impactful events, connect students with industry experts, build leadership skills, and create opportunities that shape the future of your campus.
            </motion.p>

            <motion.div variants={itemVariants} className="pt-2">
              <a 
                href="https://docs.google.com/forms/d/e/1FAIpQLSfYlYbXKn5iC3_wvdV0wTbkkM_LiNJdruzDIJZMVLORy5_DBA/viewform?usp=header" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-[#ff7a00] hover:bg-[#e06b00] text-white text-xs font-black uppercase tracking-wider transition-all duration-150 shadow-md hover:shadow-lg rounded-lg"
              >
                Become The Ambassador <ArrowRight className="w-4 h-4 text-white" />
              </a>
            </motion.div>
          </motion.div>

          {/* Right Column (Visual: Cutout Human & Concentric striped backdrop with floating badges) */}
          <div className="lg:col-span-6 flex justify-center relative py-6">
            
            {/* Circular background card matching the sketch and Image 2 */}
            <div className="relative w-[320px] h-[320px] sm:w-[420px] sm:h-[420px] lg:w-[470px] lg:h-[470px] rounded-full bg-[#fbe087] border-[6px] border-white shadow-xl flex items-center justify-center overflow-hidden">
              
              {/* Concentric rings and stripes background detail */}
              <div className="absolute inset-4 rounded-full border border-white/20 z-10" />
              <div className="absolute inset-10 rounded-full border border-dashed border-white/20 animate-[spin_100s_linear_infinite] z-10" />
              
              {/* Sweeping orange accent outline arc */}
              <div className="absolute inset-[-10px] rounded-full border-2 border-[#ff7a00]/30 border-t-transparent border-r-transparent pointer-events-none transform -rotate-45 z-10" />

              {/* Stack with Cinematic Crossfade Animation */}
              <AnimatePresence>
                <motion.div
                  key={currentAmbassadorIdx}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.0, ease: "easeInOut" }}
                  className="absolute inset-0"
                >
                  <div className="absolute inset-0 select-none">
                    <Image 
                      src={activeAmbassadors[currentAmbassadorIdx]} 
                      alt="Campus Ambassador" 
                      fill
                      priority
                      className="object-cover object-center"
                    />
                  </div>
                </motion.div>
              </AnimatePresence>
              
            </div>
            
          </div>

        </div>

        {/* Scroll Down Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 hidden md:block">
          <button 
            onClick={() => scrollToSection(1)}
            className="flex flex-col items-center gap-1.5 opacity-55 hover:opacity-90 transition-opacity duration-300 animate-bounce"
          >
            <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-zinc-500">Scroll Down</span>
            <ArrowRight className="w-3.5 h-3.5 text-zinc-400 transform rotate-90" />
          </button>
        </div>
      </section>

      {/* ── SECTION 2: HEALTHCARE PROFESSIONALS ── */}
      <section className="min-h-[calc(100vh-220px)] lg:h-[calc(100vh-220px)] snap-start w-full relative flex items-center pt-8 lg:pt-0 bg-white overflow-hidden">
        
        {/* ── Background Ornaments from Mockup (Image 1) ── */}
        
        {/* Top-Left: 4x6 Dotted Grid */}
        <div className="absolute top-[8%] left-[8%] grid grid-cols-4 gap-2.5 opacity-25 pointer-events-none">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={`dot-s2-tl-${i}`} className="w-1.5 h-1.5 rounded-full bg-[#ea580c]" />
          ))}
        </div>

        {/* Bottom-Left: 4x6 Dotted Grid */}
        <div className="absolute bottom-[8%] left-[24%] grid grid-cols-4 gap-2.5 opacity-25 pointer-events-none">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={`dot-s2-bl-${i}`} className="w-1.5 h-1.5 rounded-full bg-[#ea580c]" />
          ))}
        </div>

        {/* Right-Center: 2x6 Dotted Grid */}
        <div className="absolute right-[4%] top-[45%] grid grid-cols-2 gap-2.5 opacity-25 pointer-events-none">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={`dot-s2-rc-${i}`} className="w-1.5 h-1.5 rounded-full bg-[#ea580c]" />
          ))}
        </div>

        {/* Top-Center: Orange Circular Outline */}
        <div className="absolute top-[12%] left-[34%] w-9 h-9 rounded-full border-2 border-[#ff7a00]/30 pointer-events-none" />

        {/* Bottom-Left: Orange Plus Symbol */}
        <div className="absolute bottom-[8%] left-[16%] text-xl font-bold text-amber-500 opacity-80 pointer-events-none select-none">+</div>

        {/* Top-Right: Orange Plus Symbol */}
        <div className="absolute top-[8%] right-[4%] text-xl font-bold text-amber-500 opacity-80 pointer-events-none select-none">+</div>

        {/* Bottom-Left: Sweeping Wave Background */}
        <div className="absolute bottom-0 left-0 w-64 h-32 opacity-10 pointer-events-none">
          <svg width="256" height="128" viewBox="0 0 256 128" fill="none">
            <path d="M-50 90 Q 60 10, 160 100 T 320 50" stroke="#ff7a00" strokeWidth="24" fill="none" opacity="0.3" />
          </svg>
        </div>

        {/* Right-Center: Sweeping Orange Accent Arc */}
        <div className="absolute bottom-[8%] right-[-30px] w-64 h-64 opacity-15 pointer-events-none">
          <svg width="256" height="256" viewBox="0 0 256 256" fill="none">
            <circle cx="200" cy="200" r="180" stroke="#ff7a00" strokeWidth="2" strokeDasharray="6 6" />
          </svg>
        </div>

        <div className="max-w-[94%] mx-auto px-6 sm:px-8 lg:px-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
          
          {/* Left Column (Content) */}
          <motion.div 
            className="lg:col-span-6 space-y-6 text-left lg:order-2"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h2 
              variants={itemVariants}
              className="text-5xl md:text-6xl lg:text-7xl font-black font-sans tracking-tight text-zinc-950 uppercase leading-[0.9]"
            >
              Empowering <br />
              <span className="text-[#ff7a00]">Healthcare</span> <br />
              Professionals
            </motion.h2>

            <motion.p 
              variants={itemVariants}
              className="text-sm md:text-base text-zinc-800 leading-relaxed max-w-xl font-sans"
            >
              Providing advanced diagnostic support systems, low-latency telehealth tools, and integrated patient care coordinators to help medical experts deliver high-quality care.
            </motion.p>

            <motion.div variants={itemVariants} className="pt-2">
              <a 
                href="/contact?ref=healthcare" 
                className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-[#ff7a00] hover:bg-[#e06b00] text-white text-xs font-black uppercase tracking-wider transition-all duration-150 shadow-md hover:shadow-lg rounded-lg"
              >
                Learn More <ArrowRight className="w-4 h-4 text-white" />
              </a>
            </motion.div>
          </motion.div>

          {/* Right Column (Visual: Photo Frame Squircle & Overlapping Shapes) */}
          <div className="lg:col-span-6 flex justify-center relative py-6 lg:order-1">
            <div className="relative w-[320px] h-[320px] sm:w-[410px] sm:h-[410px] lg:w-[450px] lg:h-[450px] overflow-visible">
              
              {/* Top-Right Orange Capsule Backdrop */}
              <div className="absolute top-[-25px] right-[-25px] w-[140px] h-[260px] bg-gradient-to-b from-[#ff7a00] to-yellow-500 rounded-[50px] -z-10 transform rotate-12 opacity-95 shadow-md" />
              
              {/* Bottom-Left Yellow Overlapping Circle */}
              <div className="absolute bottom-[-15px] left-[-20px] w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#fbd85d] border-4 border-white shadow-xl z-20" />

              {/* Main Photo Squircle Frame */}
              <motion.div 
                className="w-full h-full overflow-hidden rounded-[40px] rounded-br-[90px] border-[6px] border-white shadow-2xl bg-orange-50 relative z-10"
                initial={{ scale: 0.95, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <AnimatePresence>
                  <motion.div
                    key={currentDoctorIdx}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.0, ease: "easeInOut" }}
                    className="absolute inset-0"
                  >
                    <Image 
                      src={activeDoctors[currentDoctorIdx]} 
                      alt="Healthcare Professional" 
                      fill
                      priority
                      className="object-cover object-center"
                    />
                  </motion.div>
                </AnimatePresence>
              </motion.div>
              
            </div>
          </div>

        </div>

        {/* Scroll Down Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 hidden md:block">
          <button 
            onClick={() => scrollToSection(2)}
            className="flex flex-col items-center gap-1.5 opacity-55 hover:opacity-90 transition-opacity duration-300 animate-bounce"
          >
            <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-zinc-500">Scroll Down</span>
            <ArrowRight className="w-3.5 h-3.5 text-zinc-400 transform rotate-90" />
          </button>
        </div>
      </section>
      {/* ── SECTION 3: OUR MEMBERS ── */}
      <section className="min-h-screen snap-start w-full relative flex flex-col justify-center py-20 bg-[#fdfbf7] overflow-hidden">
        
        {/* Background Ornaments */}
        
        {/* Top-Left Dotted Grid */}
        <div className="absolute top-[8%] left-[8%] grid grid-cols-4 gap-2.5 opacity-25 pointer-events-none">
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={`s3-dot-tl-${i}`} className="w-1.5 h-1.5 rounded-full bg-[#ea580c]" />
          ))}
        </div>

        {/* Bottom-Right Dotted Grid */}
        <div className="absolute bottom-[8%] right-[8%] grid grid-cols-4 gap-2.5 opacity-25 pointer-events-none">
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={`s3-dot-br-${i}`} className="w-1.5 h-1.5 rounded-full bg-[#ea580c]" />
          ))}
        </div>

        {/* Left Circle Outline */}
        <div className="absolute top-[30%] left-[4%] w-10 h-10 rounded-full border-2 border-[#ff7a00]/30 pointer-events-none" />

        {/* Right Circle Outline */}
        <div className="absolute bottom-[30%] right-[4%] w-12 h-12 rounded-full border-2 border-[#ff7a00]/30 pointer-events-none" />

        {/* Bottom-Left Hollow Triangle */}
        <div className="absolute bottom-[10%] left-[8%] opacity-65 pointer-events-none">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M12 4 L22 20 L2 20 Z" stroke="#ff7a00" strokeWidth="2" />
          </svg>
        </div>

        {/* Top-Right Peach Blob */}
        <div className="absolute top-[-50px] right-[-50px] w-64 h-64 rounded-full bg-gradient-to-br from-orange-200/40 to-orange-100/10 blur-2xl pointer-events-none -z-10" />

        {/* Bottom-Left Peach Blob */}
        <div className="absolute bottom-[-50px] left-[-50px] w-64 h-64 rounded-full bg-gradient-to-tr from-orange-200/40 to-orange-100/10 blur-2xl pointer-events-none -z-10" />

        <div className="max-w-[94%] mx-auto px-6 sm:px-8 lg:px-12 w-full relative z-10">
          
          {/* Header Title */}
          <motion.div 
            className="text-center mb-12 max-w-2xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h2 
              variants={itemVariants}
              className="text-5xl md:text-6xl font-black font-sans uppercase tracking-tight text-zinc-950"
            >
              OUR <span className="text-[#ff7a00]">MEMBERS</span>
            </motion.h2>
            <motion.div variants={itemVariants} className="w-20 h-1.5 bg-[#ff7a00] mx-auto mt-4 mb-4" />
            <motion.p 
              variants={itemVariants}
              className="text-zinc-600 text-base md:text-lg leading-relaxed"
            >
              A diverse team of experts dedicated to delivering excellence.
            </motion.p>
          </motion.div>

          {/* Cards Grid */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-3 gap-8 max-w-7xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {DEFAULT_TEAM_MEMBERS.map((member, i) => (
              <motion.div 
                key={i} 
                variants={itemVariants}
                className="bg-white rounded-3xl border border-zinc-100 p-8 flex flex-col items-center justify-center relative shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_36px_rgba(0,0,0,0.07)] transition-all duration-300 group"
              >
                
                {/* Dot pattern inside top right corner */}
                <div className="absolute top-5 right-5 grid grid-cols-2 gap-1 opacity-40">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#ff7a00]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-[#ff7a00]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-[#ff7a00]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-[#ff7a00]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-[#ff7a00]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-[#ff7a00]" />
                </div>

                {/* Circular portrait with double border */}
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-white ring-4 ring-[#ff7a00]/30 overflow-hidden mb-6">
                  <Image
                    src={member.photo}
                    alt={member.name}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Name & Designation */}
                <h3 className="text-lg sm:text-xl font-bold text-zinc-950 font-sans tracking-tight mb-1 text-center">
                  {member.name}
                </h3>
                <p className="text-zinc-500 text-xs sm:text-sm font-semibold text-center mb-4 min-h-[40px] flex items-center justify-center">
                  {member.role}
                </p>

                {/* Tiny orange accent line */}
                <div className="w-12 h-1 bg-[#ff7a00] opacity-80" />
              </motion.div>
            ))}
          </motion.div>

          {/* Bottom CTAs */}
          <motion.div 
            className="flex flex-wrap items-center justify-center gap-8 mt-14 relative max-w-md mx-auto"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {/* Dashed curve line */}
            <div className="absolute right-[115%] top-1/2 -translate-y-1/2 w-20 h-10 pointer-events-none hidden sm:block opacity-40">
              <svg width="80" height="40" viewBox="0 0 80 40" fill="none" className="rotate-12">
                <path d="M10,32 Q40,5 70,25" stroke="#ff7a00" strokeWidth="1.5" strokeDasharray="3 3" />
                <polygon points="70,25 64,21 64,27" fill="#ff7a00" />
              </svg>
            </div>

            <motion.div variants={itemVariants}>
              <a
                href="/contact"
                className="inline-flex items-center gap-3 px-10 py-4 bg-[#ff7a00] hover:bg-[#e06b00] text-white text-xs sm:text-sm font-black uppercase tracking-wider transition-all duration-150 shadow-md hover:shadow-lg rounded-xl"
              >
                VIEW ALL MEMBERS <ArrowRight className="w-4 h-4 text-white" />
              </a>
            </motion.div>

            {/* Dashed curve line */}
            <div className="absolute left-[115%] top-1/2 -translate-y-1/2 w-20 h-10 pointer-events-none hidden sm:block opacity-40">
              <svg width="80" height="40" viewBox="0 0 80 40" fill="none" className="scale-x-[-1] -rotate-12">
                <path d="M10,32 Q40,5 70,25" stroke="#ff7a00" strokeWidth="1.5" strokeDasharray="3 3" />
                <polygon points="70,25 64,21 64,27" fill="#ff7a00" />
              </svg>
            </div>

            <motion.div 
              variants={itemVariants}
              className="flex flex-col items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-orange-50 border-2 border-[#ff7a00] shadow-sm shrink-0"
            >
              <span className="text-base sm:text-lg font-black text-[#ff7a00] leading-none">20+</span>
              <span className="text-[7px] sm:text-[8px] font-bold text-zinc-500 uppercase tracking-widest leading-none mt-1">MEMBERS</span>
            </motion.div>
          </motion.div>

        </div>

        {/* Scroll Down Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 hidden md:block">
          <button 
            onClick={() => scrollToSection(3)}
            className="flex flex-col items-center gap-1.5 opacity-55 hover:opacity-90 transition-opacity duration-300 animate-bounce"
          >
            <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-zinc-500">Scroll Down</span>
            <ArrowRight className="w-3.5 h-3.5 text-zinc-400 transform rotate-90" />
          </button>
        </div>
      </section>

      {/* ── SECTION 4: STRATEGIC PARTNERSHIPS ── */}
      <section className="min-h-screen snap-start w-full relative flex flex-col justify-between pt-24 bg-zinc-950 overflow-hidden">
        
        {/* Full-bleed background photo from Mockup (Image 2) */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/strategic_partnerships.png" 
            alt="Strategic Partnerships Campus" 
            fill
            priority
            className="object-cover object-center opacity-85"
          />
          {/* Dark gradient overlay to make typography pop */}
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/95 via-zinc-950/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-90" />
        </div>

        {/* Main Content Area */}
        <div className="max-w-[94%] mx-auto px-6 sm:px-8 lg:px-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center flex-1 relative z-10">
          
          {/* Left Column (Content) */}
          <motion.div 
            className="lg:col-span-8 space-y-6 text-left"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div 
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-orange-500 bg-orange-500/10 text-xs font-bold text-[#ff7a00] uppercase tracking-wider"
            >
              <Handshake className="w-4 h-4 text-[#ff7a00]" />
              OUR PARTNERSHIPS
            </motion.div>

            <motion.h2 
              variants={itemVariants}
              className="text-5xl md:text-6xl lg:text-7xl font-black font-sans tracking-tight text-white uppercase leading-[0.9]"
            >
              Strategic <br />
              <span className="text-[#ff7a00]">Partnerships</span>
            </motion.h2>

            <motion.p 
              variants={itemVariants}
              className="text-sm md:text-base text-zinc-300 leading-relaxed max-w-2xl font-sans"
            >
              Collaborating with prestigious institutions of technology (IITs) and world-class universities to drive innovation, integration and seamless infrastructure rollout.
            </motion.p>

            {/* Features badges row from Mockup (Image 2) */}
            <motion.div 
              variants={itemVariants} 
              className="flex flex-wrap items-center gap-6 pt-4 text-xs font-mono font-bold text-white"
            >
              {/* Feature 1 */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full border-2 border-[#ff7a00] flex items-center justify-center shrink-0 bg-zinc-900/50">
                  <Handshake className="w-5 h-5 text-[#ff7a00]" />
                </div>
                <div className="text-[10px] leading-tight tracking-wider uppercase">
                  Stronger <br />
                  <span className="text-zinc-400">Collaboration</span>
                </div>
              </div>
              
              <div className="h-8 w-[1px] bg-zinc-800 hidden sm:block" />
              
              {/* Feature 2 */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full border-2 border-[#ff7a00] flex items-center justify-center shrink-0 bg-zinc-900/50">
                  <Globe className="w-5 h-5 text-[#ff7a00]" />
                </div>
                <div className="text-[10px] leading-tight tracking-wider uppercase">
                  Global <br />
                  <span className="text-zinc-400">Exposure</span>
                </div>
              </div>
              
              <div className="h-8 w-[1px] bg-zinc-800 hidden sm:block" />
              
              {/* Feature 3 */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full border-2 border-[#ff7a00] flex items-center justify-center shrink-0 bg-zinc-900/50">
                  <Lightbulb className="w-5 h-5 text-[#ff7a00]" />
                </div>
                <div className="text-[10px] leading-tight tracking-wider uppercase">
                  Innovation <br />
                  <span className="text-zinc-400">Leadership</span>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column (Visual: Clean & spacious to reveal the background campus) */}
          <div className="lg:col-span-4 hidden lg:block" />

        </div>

        {/* Bottom Partners Panel - Dark Semi-Transparent Bar matching Mockup (Image 2) */}
        <div className="w-full bg-black/60 backdrop-blur-md py-6 border-t border-white/10 relative z-10">
          <div className="max-w-[94%] mx-auto px-6 sm:px-8">
            <div className="flex items-center justify-between gap-4 overflow-x-auto pb-2 scrollbar-hide">
              
              {/* Center Logo Row with dividers */}
              <div className="flex-1 flex justify-between items-center gap-6 md:gap-8 px-2 min-w-[700px] md:min-w-0">
                {partners.map((partner, idx) => (
                  <React.Fragment key={idx}>
                    <div 
                      className="flex-1 flex flex-col items-center justify-center cursor-pointer text-center group"
                    >
                      {/* Logo container */}
                      <div className="flex items-center justify-center min-h-[56px]">
                        {partner.logoUrl ? (
                          <img 
                            src={partner.logoUrl} 
                            alt={partner.name}
                            className="w-12 h-12 sm:w-14 sm:h-14 object-contain transition-all duration-300 transform group-hover:scale-105"
                          />
                        ) : (
                          <div className="text-cyan-400 group-hover:text-[#ff7a00] transition-colors duration-300 transform group-hover:scale-105">
                            {partner.logo}
                          </div>
                        )}
                      </div>

                      {/* Name */}
                      <h4 className="text-[11px] font-black font-mono text-zinc-300 group-hover:text-white uppercase tracking-wider mt-2 transition-colors">
                        {partner.name}
                      </h4>
                    </div>
                    {idx < partners.length - 1 && (
                      <div className="h-12 w-[1px] bg-white/10 shrink-0" />
                    )}
                  </React.Fragment>
                ))}
              </div>

            </div>
          </div>
        </div>

      </section>

      {/* ── SECTION 4: FOOTER ── */}
      <section className="snap-start w-full bg-[#080808] border-t border-zinc-900 overflow-hidden shrink-0">
        <Footer />
      </section>

      {/* Hide the global footer for this full-page snap route */}
      <style dangerouslySetInnerHTML={{ __html: 'body > footer, #main-content + footer, main + footer { display: none !important; }' }}></style>

    </div>
  );
}

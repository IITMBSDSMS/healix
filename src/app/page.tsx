"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Shield, Activity, Server, MessageSquareQuote, X, Smartphone, Calendar, GraduationCap, Newspaper, Rocket, HelpCircle, ChevronDown, Play, Sparkles, Building2, Heart, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { HeroCarousel } from "@/components/ui/HeroCarousel";

const IconMap: Record<string, any> = {
  Shield,
  Activity,
  Server,
  GraduationCap,
  Smartphone,
  Sparkles,
  Building2,
  Heart,
  Play
};

const STATIC_BRANDS = [
  {
    id: "avennix",
    name: "Avennix Pharma",
    role: "Clinical Research & Digital Care",
    desc: "Developing indigenous digital twin software pipelines and therapeutics networks to standardize clinical trial metrics across leading institutional networks.",
    logoText: "AVENNIX",
    color: "#3b82f6",
    accent: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    icon_name: "Shield",
    logo_url: "/avennix-official-logo.png"
  },
  {
    id: "shesecure",
    name: "SheSecure System",
    role: "Women Travel & Community Safety",
    desc: "Low-latency telemetry tracking, encrypted hardware beacons, and one-tap emergency SOS broadcasts connected to localized responder networks.",
    logoText: "SHE-SECURE",
    color: "#ef4444",
    accent: "text-red-500 bg-red-500/10 border-red-500/20",
    icon_name: "Heart",
    logo_url: "/hsf-official-logo-web.png"
  },
  {
    id: "biolabs",
    name: "BioLabs Genomics",
    role: "High-Performance Sequence Modeling",
    desc: "Running distributed high-performance computing pools to execute molecular alignment diagnostics, mapping CRISPR outcomes with precision.",
    logoText: "BIOLABS",
    color: "#06b6d4",
    accent: "text-cyan-500 bg-cyan-500/10 border-cyan-500/20",
    icon_name: "Activity",
    logo_url: "/biolabs-logo-web.png"
  },
  {
    id: "academy",
    name: "Healix Academy",
    role: "Systems Architecture Training",
    desc: "Educating developers and clinical researchers on high-reliability distributed databases, secure cryptographic APIs, and responsive edge apps.",
    logoText: "ACADEMY",
    color: "#ea580c",
    accent: "text-[#ea580c] bg-[#ea580c]/10 border-[#ea580c]/20",
    icon_name: "GraduationCap",
    logo_url: "/official-logo-web.png"
  }
];

const DEFAULT_FOUNDERS = [
  {
    id: "f1",
    name: "Avnish",
    role: "Founder & CEO",
    quote: "Precision health data infrastructure is the foundation of modern clinical safety and AI diagnostics. At Healix, we are commoditizing the complex engineering required to unify fragmented health datasets so innovators can build clinical products at scale.",
    photo_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop",
    display_order: 0,
    active: true
  },
  {
    id: "f2",
    name: "Debraghya Bag",
    role: "Co-Founder & Chief Medical Officer (CMO)",
    quote: "Precision medicine starts with precise data engineering. Ensuring scientific credibility, medical correctness, and healthcare system reliability is not a post-hoc check—it is built into every telemetry model we run at Healix.",
    photo_url: "https://chdujpvwawaqgaenrgms.supabase.co/storage/v1/object/public/mentor-photos/2354710c-6edf-459f-9e26-09a96d274a9d-1779985736208.png",
    display_order: 1,
    active: true
  },
  {
    id: "f3",
    name: "Mahima Sharma",
    role: "COO",
    quote: "Reliability is not a feature; it is the core foundation. Scaling operations, securing strategic partnerships, and building sustainable ecosystem networks are key to translating Healix's clinical tech into tangible community outcomes.",
    photo_url: "https://chdujpvwawaqgaenrgms.supabase.co/storage/v1/object/public/mentor-photos/7dbf680f-f5d2-4967-b1bb-1bdc40edd29c-1779985889408.png",
    display_order: 2,
    active: true
  },
  {
    id: "f4",
    name: "Sudiksha Sharma",
    role: "Behavioral Psychology & Human Systems Strategist",
    quote: "Technology must serve the human experience. Designing healthcare systems that people emotionally trust, feel safe using, and find reassuring is critical for securing widespread public health adoption.",
    photo_url: "https://chdujpvwawaqgaenrgms.supabase.co/storage/v1/object/public/mentor-photos/9e91e2a2-6910-4254-aeca-5fdc074ebb05-1779985539265.png",
    display_order: 3,
    active: true
  }
];

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.96 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.08,
      duration: 0.55,
      ease: [0.21, 1.02, 0.43, 1.01] as [number, number, number, number]
    }
  })
};

export default function Home() {
  const [reels, setReels] = useState<any[]>([]);
  const [activeVideo, setActiveVideo] = useState<{ url: string, title: string } | null>(null);

  // Podcasts, Brands, and Founders states
  const [podcasts, setPodcasts] = useState<any[]>([]);
  const [activePodcast, setActivePodcast] = useState<{ youtube_url: string, title: string } | null>(null);
  const [activeBrandIndex, setActiveBrandIndex] = useState(0);
  const [brands, setBrands] = useState<any[]>(STATIC_BRANDS);
  const [founders, setFounders] = useState<any[]>(DEFAULT_FOUNDERS);
  const [activeFounderIndex, setActiveFounderIndex] = useState(0);
  const [selectedFounderForMsg, setSelectedFounderForMsg] = useState<any | null>(null);
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([
    { title: "Genomics Sequence Diagnostics", speaker: "Dr. Partha Pratim", date: "June 1, 2026" },
    { title: "Distributed Audio Failsafe Networks", speaker: "Prof. R. Sharma", date: "June 10, 2026" },
    { title: "Explainable AI Clinical Triaging", speaker: "Dr. Sarah Chen", date: "June 18, 2026" }
  ]);


  useEffect(() => {
    const fetchReels = async () => {
      const supabase = createClient();
      const { data, error } = await supabase.from("community_reels").select("*").eq("is_active", true).order("created_at", { ascending: false });
      if (data && data.length > 0) {
        setReels(data);
      } else {
        setReels([
          { id: 1, title: "Emergency SOS Response Test", user_handle: "@sarah_j", thumbnail_url: "/reel-1-thumb.webp", video_url: "https://www.w3schools.com/html/mov_bbb.mp4" },
          { id: 2, title: "Healix AI Symptom Checker Review", user_handle: "@marcus_tech", thumbnail_url: "/reel-2-thumb.webp", video_url: "https://www.w3schools.com/html/mov_bbb.mp4" },
          { id: 3, title: "Night Travel with HSF System", user_handle: "@priya_travels", thumbnail_url: "/reel-3-thumb.webp", video_url: "https://www.w3schools.com/html/mov_bbb.mp4" },
          { id: 4, title: "BioLabs Student Tour", user_handle: "@uni_science", thumbnail_url: "/reel-4-thumb.webp", video_url: "https://www.w3schools.com/html/mov_bbb.mp4" },
        ]);
      }
    };

    const fetchPodcasts = async () => {
      try {
        const res = await fetch("/api/podcasts");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setPodcasts(data);
            return;
          }
        }
      } catch (err) {
        console.warn("Error fetching podcasts:", err);
      }
      // Fallback seed data
      setPodcasts([
        {
          id: "1",
          title: "BioLabs Sequence Modeling & Genetic Compute Failsafes",
          description: "Deep dive with our research fellows on leveraging high-performance compute clusters to map CRISPR off-target genetic mutation metrics safely.",
          youtube_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          thumbnail_url: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600&auto=format&fit=crop",
          duration: "18:45"
        },
        {
          id: "2",
          title: "SheSecure IoT Protocols & GPS Failsafe Telemetry Systems",
          description: "Explaining the low-latency socket streams, emergency SOS overrides, and client-side web dashboards that secure community tracking networks.",
          youtube_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          thumbnail_url: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?q=80&w=600&auto=format&fit=crop",
          duration: "24:12"
        },
        {
          id: "3",
          title: "Building Indigenous Clinical Data Infrastructure at IIT Madras",
          description: "Discussion with our board advisors on bridging the gap between clinical systems and emergency response models inside the indian healthcare stack.",
          youtube_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          thumbnail_url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop",
          duration: "15:30"
        }
      ]);
    };

    const fetchBrands = async () => {
      try {
        const res = await fetch("/api/brands");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setBrands(data);
            return;
          }
        }
      } catch (err) {
        console.warn("Error fetching brands:", err);
      }
    };

    const fetchFounders = async () => {
      try {
        const res = await fetch("/api/founders");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setFounders(data);
          }
        }
      } catch (err) {
        console.warn("Error fetching founders:", err);
      }
    };

    const fetchEvents = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("biolab_events")
          .select("*")
          .eq("is_active", true)
          .order("start_date", { ascending: true })
          .limit(3);
        if (data && data.length > 0) {
          const mapped = data.map(e => {
            let speaker = "Research Fellow";
            try {
              if (e.description.startsWith("{") && e.description.endsWith("}")) {
                const parsed = JSON.parse(e.description);
                speaker = parsed.speaker || speaker;
              }
            } catch (err) {}
            
            const d = new Date(e.start_date);
            const formattedDate = d.toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric"
            });
            
            return {
              id: e.id,
              title: e.title,
              speaker: speaker,
              date: formattedDate
            };
          });
          setUpcomingEvents(mapped);
        }
      } catch (err) {
        console.warn("Error fetching events:", err);
      }
    };

    fetchReels();
    fetchPodcasts();
    fetchBrands();
    fetchFounders();
    fetchEvents();
  }, []);

  useEffect(() => {
    if (brands.length === 0) return;
    const timer = setInterval(() => {
      setActiveBrandIndex((prev) => (prev + 1) % brands.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [brands.length]);

  useEffect(() => {
    if (founders.length <= 1) return;
    const timer = setInterval(() => {
      setActiveFounderIndex((prev) => (prev + 1) % founders.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [founders.length]);

  const getEmbedUrl = (url: string) => {
    if (!url) return "";
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 12 || match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}`;
    }
    return url;
  };

  const announcements = [
    "Important: Proposal submission for the 2026 BioLabs Research Incubator starts June 15th.",
    "Notification No. 08/2026: HSF invites applications for field safety coordinators (Delhi NCR).",
    "High-Performance Computing (HPC) Genomic modeling workshop scheduled for July 10th-12th.",
    "Registration Open: Summer training sessions in Bio-Medical Diagnostics and IoT failsafes.",
    "Corrigendum to Advt. No. HSF/Apprentice (1) / 2026 for engagement of apprentices under the Apprentices Act.",
    "Call for Applications: Transformative Leadership in STEMM (TLS) Workshop by Healix Academy."
  ];

  return (
    <div className="relative min-h-screen flex flex-col w-full bg-[#fafafa] text-black pb-20 overflow-x-hidden">
      
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(#ea580c_0.5px,transparent_0.5px)] [background-size:16px_16px] opacity-[0.03] pointer-events-none" />

      {/* Hero Carousel Banner (IITD Style) */}
      <div className="w-full">
        <HeroCarousel />
      </div>

      <div className="relative mx-auto max-w-[94%] px-4 sm:px-6 lg:px-8 w-full mt-6 space-y-16">
        
        {/* --- SECTION 1: IMPORTANT ANNOUNCEMENTS (IITD Style) --- */}
        <div className="bg-white border border-zinc-200 shadow-sm rounded-none p-6 md:p-8">
          <div className="text-center mb-8">
            <h2 className="text-xl md:text-3xl font-extrabold tracking-tight text-[#ea580c] uppercase flex items-center justify-center gap-3">
              <Newspaper className="w-6 h-6 text-[#ea580c]" /> Important Announcements
            </h2>
            <div className="w-24 h-1 bg-[#ea580c] mx-auto mt-3" />
          </div>

          <div className="grid grid-cols-1 gap-4 max-w-5xl mx-auto">
            {announcements.map((ann, idx) => (
              <div key={idx} className="border-l-4 border-[#ea580c] pl-4 py-3 bg-[#fafafa] hover:bg-orange-50/20 transition-colors flex items-center justify-between">
                <Link href="/news" className="text-sm font-bold text-zinc-900 hover:text-[#ea580c] transition-colors leading-relaxed flex-1">
                  {ann}
                </Link>
                <span className="hidden sm:inline-flex ml-3 px-2 py-0.5 bg-red-600 text-white font-mono text-[9px] font-bold rounded uppercase">
                  New
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* --- SECTION 2: ABOUT HEALIX & LEADER'S CORNER (IITD Style) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left: About */}
          <div className="lg:col-span-7 bg-white border border-zinc-200 p-6 md:p-8 flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-black text-black tracking-tight mb-2 uppercase border-b-2 border-zinc-100 pb-3 flex items-center gap-2">
                About <span className="text-[#ea580c]">Healix</span>
              </h2>
              <p className="text-sm text-zinc-900 leading-relaxed mb-6 mt-4">
                Healix Technologies Pvt. Ltd. is India's premier biomedical research and engineering institution. Combining advanced digital twin telemetry, state-of-the-art BioLabs genomics sequence modeling, and emergency safety coordination platforms, we develop indigenous solutions addressing national clinical and community infrastructure safety metrics.
              </p>
              <p className="text-sm text-zinc-900 leading-relaxed mb-6">
                Established under the guidance of leading clinical advisors and tech councils, the organization bridges the gap between hardware computing arrays and emergency response systems to build a secure, tech-driven tomorrow.
              </p>
            </div>
            <div className="flex gap-3">
              <Link href="/about" className="h-10 px-6 bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold uppercase tracking-wider flex items-center transition-colors">
                Read More
              </Link>
              <Link href="/news" className="h-10 px-6 border border-zinc-300 hover:border-black text-black text-xs font-bold uppercase tracking-wider flex items-center transition-colors">
                Newsletter
              </Link>
            </div>
          </div>

          {/* Right: Leader's Corner */}
          <div className="lg:col-span-5 bg-white border border-zinc-200 p-6 md:p-8 flex flex-col justify-between relative overflow-hidden min-h-[360px]">
            <div>
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3 mb-2">
                <h2 className="text-2xl font-black text-black tracking-tight uppercase">
                  Founder's <span className="text-[#ea580c]">Corner</span>
                </h2>
                {founders.length > 1 && (
                  <div className="flex gap-1.5 items-center">
                    <button 
                      onClick={() => setActiveFounderIndex((prev) => (prev - 1 + founders.length) % founders.length)}
                      className="p-1 rounded-full border border-zinc-200 hover:border-black hover:bg-zinc-50 text-zinc-600 hover:text-black transition-all cursor-pointer"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => setActiveFounderIndex((prev) => (prev + 1) % founders.length)}
                      className="p-1 rounded-full border border-zinc-200 hover:border-black hover:bg-zinc-50 text-zinc-600 hover:text-black transition-all cursor-pointer"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {founders.length > 0 && (
                <div className="relative h-[180px] mt-4">
                  <AnimatePresence mode="wait">
                    {founders.map((f, idx) => idx === activeFounderIndex && (
                      <motion.div
                        key={f.id || idx}
                        initial={{ opacity: 0, x: 15 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -15 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0 flex flex-col sm:flex-row gap-4 items-start"
                      >
                        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-none border border-zinc-200 bg-zinc-50 relative overflow-hidden shrink-0 shadow-sm">
                          {f.photo_url ? (
                            <img 
                              src={f.photo_url} 
                              alt={f.name} 
                              className="w-full h-full object-cover object-top"
                            />
                          ) : (
                            <div className="absolute inset-0 bg-gradient-to-tr from-zinc-200 to-zinc-50 flex items-center justify-center text-zinc-400 font-bold text-lg uppercase font-mono">
                              {f.name?.[0]}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-extrabold text-base text-zinc-950 truncate font-mono uppercase tracking-tight">{f.name}</p>
                          <p className="text-xs text-[#ea580c] font-bold uppercase tracking-wider mt-0.5">{f.role}</p>
                          <p className="text-xs text-zinc-750 leading-relaxed mt-2.5 line-clamp-3 italic font-sans">
                            "{f.quote}"
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {founders.length > 0 && (
              <div className="flex items-center justify-between border-t border-zinc-100 pt-4 mt-6">
                <button 
                  onClick={() => setSelectedFounderForMsg(founders[activeFounderIndex])}
                  className="h-10 px-6 bg-zinc-950 hover:bg-zinc-900 text-white text-xs font-bold uppercase tracking-wider flex items-center transition-colors w-fit font-mono"
                >
                  Read Message
                </button>
                <div className="flex gap-1">
                  {founders.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveFounderIndex(i)}
                      className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                        i === activeFounderIndex ? "bg-[#ea580c] w-3" : "bg-zinc-200 hover:bg-zinc-400"
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* --- SECTION 3: ACADEMIC UNITS / MODULES (IITD Style) --- */}
        <div>
          <div className="text-center mb-8">
            <h2 className="text-xl md:text-3xl font-black tracking-tight text-black uppercase">
              Healix <span className="text-[#ea580c]">Academic & Research Units</span>
            </h2>
            <div className="w-24 h-1 bg-[#ea580c] mx-auto mt-3" />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Avennix Pharma", subtitle: "Clinical Research & Care", logo: "/avennix-official-logo.png", href: "/care" },
              { title: "HSF Safety", subtitle: "Community Support Portal", logo: "/hsf-official-logo-web.png", href: "/shesecure" },
              { title: "BioLabs Genomics", subtitle: "Genomics Sequence Labs", logo: "/biolabs-logo-web.png", href: "/biolabs" },
              { title: "Healix AI Check", subtitle: "Symptom Triaging Portal", logo: "/ai-logo.jpg", href: "/ai-check" }
            ].map((unit, i) => (
              <motion.div
                key={i}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={cardVariants}
                className="h-full"
              >
                <Link 
                  href={unit.href}
                  className="bg-white border border-zinc-200 p-6 flex flex-col justify-between min-h-[160px] hover:border-[#ea580c] transition-all group cursor-pointer h-full"
                >
                  <div className="w-10 h-10 border border-zinc-200/60 bg-white flex items-center justify-center mb-4 overflow-hidden rounded-lg shadow-sm">
                    <img src={unit.logo} alt={unit.title} className="w-full h-full object-contain p-1" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-zinc-950 group-hover:text-[#ea580c] transition-colors">{unit.title}</h3>
                    <p className="text-[10px] sm:text-xs text-zinc-500 font-mono mt-1 uppercase tracking-wider">{unit.subtitle}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* --- SECTION 4: STARTUPS@HEALIX (IITD Style) --- */}
        <div>
          <div className="flex justify-between items-center mb-8 border-b-2 border-zinc-150 pb-3">
            <h2 className="text-2xl font-black tracking-tight text-black uppercase">
              Startups<span className="text-[#ea580c]">@Healix</span>
            </h2>
            <Link href="/startups" className="h-8 px-4 bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold uppercase tracking-wider flex items-center transition-colors">
              View All
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "CRISPR Target Diagnostics",
                desc: "Advanced sequencing models predicting off-target genetic mutation metrics using high-performance computing pools.",
                src: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=600&auto=format&fit=crop",
                href: "/biolabs"
              },
              {
                title: "Live GPS Telemetry Sync",
                desc: "Low-latency socket streams transmitting secure coordinates to verified local authorities during emergency SOS checks.",
                src: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=600&auto=format&fit=crop",
                href: "/shesecure"
              },
              {
                title: "AI Symptom Checker Pipeline",
                desc: "Structured data pipelines matching user-reported symptoms to medical databases with transparent verification metrics.",
                src: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=600&auto=format&fit=crop",
                href: "/ai-check"
              }
            ].map((start, idx) => (
              <motion.div
                key={idx}
                custom={idx}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={cardVariants}
                className="h-full"
              >
                <div className="bg-white border border-zinc-200 flex flex-col justify-between hover:border-black transition-all group h-full">
                  <div className="h-44 bg-zinc-150 relative overflow-hidden">
                    <img src={start.src} alt={start.title} className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" />
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-extrabold text-base text-zinc-950 mb-2">{start.title}</h4>
                      <p className="text-xs text-zinc-700 leading-relaxed mb-4">{start.desc}</p>
                    </div>
                    <Link href={start.href} className="h-8 px-4 border border-zinc-300 hover:border-[#ea580c] hover:bg-orange-50/20 text-zinc-800 hover:text-[#ea580c] text-[10px] font-bold uppercase tracking-wider w-fit flex items-center justify-center transition-all">
                      Read More
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* --- SECTION 5: LATEST NEWS & EVENTS --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 border-t border-zinc-200 pt-12 items-start">
          {/* Left Column: News */}
          <div className="lg:col-span-8">
            <h2 className="text-2xl font-black tracking-tight text-black uppercase mb-6 pb-3 border-b border-zinc-200">
              Latest <span className="text-[#ea580c]">News</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                {
                  title: "In-Silico Breast Cancer Mutation Analysis",
                  desc: "Predictive BRCA1 genetic sequencing parameters mapped with 98.4% confidence rating.",
                  src: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=400"
                },
                {
                  title: "Distributed Edge Telemetry Failsafes",
                  desc: "Establishing decentralized failsafe socket buffers to capture SOS emergency coordinates.",
                  src: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=400"
                }
              ].map((res, idx) => (
                <motion.div
                  key={idx}
                  custom={idx}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  variants={cardVariants}
                  className="h-full"
                >
                  <div className="bg-white border border-zinc-200 flex flex-col justify-between hover:border-black transition-all group h-full">
                    <div className="h-36 bg-zinc-150 relative">
                      <img src={res.src} alt={res.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-extrabold text-sm text-zinc-950 mb-2 leading-snug">{res.title}</h4>
                        <p className="text-xs text-zinc-700 leading-relaxed mb-4">{res.desc}</p>
                      </div>
                      <Link href="/news" className="h-7 px-3 border border-zinc-200 hover:bg-zinc-50 text-zinc-800 text-[10px] font-bold uppercase tracking-wider w-fit flex items-center transition-colors">
                        Details
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Column: Events */}
          <div id="events" className="lg:col-span-4 bg-white border border-zinc-200 p-6 scroll-mt-20 flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-black tracking-tight text-black uppercase mb-6 pb-3 border-b border-zinc-200">
                Upcoming <span className="text-[#ea580c]">Events</span>
              </h2>
              <div className="space-y-4">
                {upcomingEvents.map((sem, idx) => (
                  <div key={idx} className="pb-3 border-b border-zinc-100 last:border-0 last:pb-0">
                    <Link 
                      href={`/events?search=${encodeURIComponent(sem.title)}`} 
                      className="text-sm font-bold text-zinc-900 hover:text-[#ea580c] transition-colors leading-relaxed block"
                    >
                      {sem.title}
                    </Link>
                    <div className="flex justify-between items-center mt-2 text-xs text-zinc-650 font-mono">
                      <span>{sem.speaker}</span>
                      <span>{sem.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-8">
              <Link 
                href="/events" 
                className="w-full py-3 bg-zinc-900 hover:bg-[#ea580c] text-white text-center text-xs font-bold uppercase tracking-wider block transition-colors duration-300 rounded-none shadow-sm"
              >
                View All Events
              </Link>
            </div>
          </div>
        </div>

        {/* --- SECTION 6: OUR BRANDS (Cinematic Slideshow) --- */}
        <div className="border-t border-zinc-200 pt-16 content-visibility-auto">
          <div className="text-center mb-10">
            <h2 className="text-xl md:text-3xl font-black tracking-tight text-black uppercase">
              Our <span className="text-[#ea580c]">Brands</span>
            </h2>
            <div className="w-24 h-1 bg-[#ea580c] mx-auto mt-3" />
          </div>

          <div className="bg-white border border-zinc-200 rounded-none p-6 md:p-12 relative overflow-hidden shadow-sm min-h-[300px] flex items-center">
            {/* Grid Backdrop Mesh */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full z-10">
              {/* Brand Navigation Indicators (Left) */}
              <div className="lg:col-span-4 flex flex-col gap-3">
                {brands.map((brand, idx) => {
                  const IconComponent = brand.icon || (IconMap[brand.icon_name] || Shield);
                  const isActive = idx === activeBrandIndex;
                  return (
                    <button
                      key={brand.id || idx}
                      onClick={() => setActiveBrandIndex(idx)}
                      className={`flex items-center gap-3 px-5 py-4 border text-left transition-all duration-300 ${
                        isActive 
                          ? "bg-[#ea580c]/5 border-[#ea580c] translate-x-2" 
                          : "bg-[#fafafa] border-zinc-200 hover:border-zinc-400"
                      }`}
                    >
                      <div className={`p-1.5 rounded border flex items-center justify-center ${isActive ? "text-[#ea580c] border-[#ea580c]/30 bg-[#ea580c]/10" : "text-zinc-400 border-zinc-250 bg-white"}`}>
                        {brand.logo_url ? (
                          <img src={brand.logo_url} alt="" className="w-4 h-4 object-contain" />
                        ) : (
                          <IconComponent className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <p className={`font-bold text-sm ${isActive ? "text-zinc-950 font-black" : "text-zinc-700"}`}>{brand.name}</p>
                        <p className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest">{brand.logoText || brand.logo_text}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Brand Details Card (Right) */}
              <div className="lg:col-span-8 flex justify-center items-center">
                <AnimatePresence mode="wait">
                  {brands[activeBrandIndex] && (
                    <motion.div
                      key={activeBrandIndex}
                      initial={{ opacity: 0, x: 20, filter: "blur(4px)" }}
                      animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, x: -20, filter: "blur(4px)" }}
                      transition={{ duration: 0.4 }}
                      className="w-full flex flex-col md:flex-row gap-8 items-center bg-zinc-50 border border-zinc-200 p-8 rounded-none"
                    >
                      {/* Big stylized logo frame */}
                      <div className="w-36 h-36 border border-zinc-200 bg-white flex flex-col items-center justify-center shrink-0 shadow-sm relative group overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.01)_0%,transparent_70%)]" />
                        {brands[activeBrandIndex].logo_url ? (
                          <img 
                            src={brands[activeBrandIndex].logo_url} 
                            alt={brands[activeBrandIndex].name} 
                            className="w-20 h-20 object-contain mb-2" 
                          />
                        ) : (
                          <div className="p-4 rounded-full border border-zinc-150 bg-zinc-50 text-zinc-600 mb-2">
                            {React.createElement(brands[activeBrandIndex].icon || (IconMap[brands[activeBrandIndex].icon_name] || Shield), { className: "w-8 h-8 text-[#ea580c]" })}
                          </div>
                        )}
                        <p className="font-mono font-black text-xs text-zinc-900 tracking-wider uppercase">{brands[activeBrandIndex].logoText || brands[activeBrandIndex].logo_text}</p>
                      </div>

                      {/* Brand descriptions */}
                      <div className="space-y-4 text-left">
                        <div className="inline-flex px-2 py-0.5 border border-zinc-200 text-zinc-500 font-mono text-[9px] font-bold uppercase tracking-widest bg-white">
                          Official Entity / Brand
                        </div>
                        <h3 className="text-2xl font-black font-mono text-zinc-950 uppercase">{brands[activeBrandIndex].name}</h3>
                        <p className="text-xs font-mono text-[#ea580c] uppercase font-bold tracking-wider">{brands[activeBrandIndex].role}</p>
                        <p className="text-sm text-zinc-650 leading-relaxed font-sans">{brands[activeBrandIndex].desc || brands[activeBrandIndex].description}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* --- SECTION 7: PODCASTS (Animated dynamic list) --- */}
        <div className="border-t border-zinc-200 pt-16 content-visibility-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-10 border-b border-zinc-200 pb-4 w-full">
            <div className="flex items-center gap-3">
              {/* Dancing soundwave animation */}
              <div className="flex items-end gap-0.5 h-6 w-8 pb-1">
                <div className="w-0.5 bg-[#ea580c] rounded-full audio-bar-1 h-3" />
                <div className="w-0.5 bg-[#ea580c] rounded-full audio-bar-2 h-5" />
                <div className="w-0.5 bg-[#ea580c] rounded-full audio-bar-3 h-2" />
                <div className="w-0.5 bg-[#ea580c] rounded-full audio-bar-4 h-6" />
                <div className="w-0.5 bg-[#ea580c] rounded-full audio-bar-5 h-4" />
              </div>
              <h2 className="text-xl md:text-3xl font-black tracking-tight text-black uppercase">
                Healix <span className="text-[#ea580c]">Podcasts</span>
              </h2>
            </div>
            
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#ea580c]/30 bg-[#ea580c]/10 text-[#ea580c] font-mono text-[9px] font-bold uppercase tracking-wider mt-3 sm:mt-0">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping" /> Broadcast Active
            </span>
          </div>

          {/* Embedded internal CSS for soundwave dancing */}
          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes soundwave-dancing {
              0%, 100% { height: 8px; }
              50% { height: 24px; }
            }
            .audio-bar-1 { animation: soundwave-dancing 0.8s ease-in-out infinite; }
            .audio-bar-2 { animation: soundwave-dancing 0.8s ease-in-out infinite 0.15s; }
            .audio-bar-3 { animation: soundwave-dancing 0.8s ease-in-out infinite 0.3s; }
            .audio-bar-4 { animation: soundwave-dancing 0.8s ease-in-out infinite 0.45s; }
            .audio-bar-5 { animation: soundwave-dancing 0.8s ease-in-out infinite 0.6s; }
          ` }} />

          {/* Grid list of podcasts */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {podcasts.map((pod, idx) => (
              <motion.div
                key={pod.id}
                custom={idx}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={cardVariants}
                className="h-full"
              >
                <div 
                  className="bg-white border border-zinc-200 rounded-none overflow-hidden hover:border-black transition-all group flex flex-col justify-between h-full"
                >
                  {/* Thumbnail with overlay play trigger */}
                  <div 
                    className="aspect-video bg-zinc-150 relative overflow-hidden cursor-pointer"
                    onClick={() => setActivePodcast({ youtube_url: pod.youtube_url, title: pod.title })}
                  >
                    {pod.thumbnail_url ? (
                      <img 
                        src={pod.thumbnail_url} 
                        alt={pod.title} 
                        className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500" 
                      />
                    ) : (
                      <div className="w-full h-full bg-zinc-950 flex items-center justify-center text-white/30 text-xs font-mono">
                        No Thumbnail
                      </div>
                    )}

                    {/* Play badge overlays */}
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full border-2 border-white bg-white/10 flex items-center justify-center text-white backdrop-blur-sm group-hover:scale-110 transition-transform duration-300 shadow-md">
                        <Play className="w-5 h-5 text-white fill-white translate-x-0.5" />
                      </div>
                    </div>

                    {/* Duration label */}
                    {pod.duration && (
                      <div className="absolute bottom-3 right-3 bg-black/80 px-2 py-0.5 rounded text-[10px] text-white font-mono font-bold tracking-wider">
                        {pod.duration}
                      </div>
                    )}
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div className="space-y-3">
                      <p className="text-[9px] font-mono text-[#ea580c] uppercase font-bold tracking-widest">Episode Broadcast</p>
                      <h4 className="font-extrabold text-base text-zinc-950 mb-2 group-hover:text-[#ea580c] transition-colors leading-snug">
                        {pod.title}
                      </h4>
                      <p className="text-xs text-zinc-650 leading-relaxed font-sans line-clamp-3">
                        {pod.description}
                      </p>
                    </div>

                    <div className="pt-6">
                      <button 
                        onClick={() => setActivePodcast({ youtube_url: pod.youtube_url, title: pod.title })}
                        className="h-8 px-4 bg-[#ea580c]/10 text-[#ea580c] border border-[#ea580c]/20 hover:bg-[#ea580c] hover:text-white text-[10px] font-bold uppercase tracking-wider flex items-center justify-center transition-all duration-300"
                      >
                        Watch Episode
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* --- CINEMATIC YOUTUBE PLAYER MODAL --- */}
        <AnimatePresence>
          {activePodcast && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 backdrop-blur-md p-4"
              onClick={() => setActivePodcast(null)}
            >
              <motion.div 
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-4xl bg-zinc-950 border border-zinc-800 rounded-none shadow-2xl relative"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header title */}
                <div className="flex items-center justify-between p-4 border-b border-zinc-900 bg-zinc-900/50">
                  <p className="text-xs font-mono text-[#ea580c] uppercase tracking-wider font-bold">Healix Cinema Broadcast</p>
                  <button 
                    onClick={() => setActivePodcast(null)}
                    className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Aspect video container */}
                <div className="aspect-video w-full relative bg-black">
                  <iframe 
                    src={getEmbedUrl(activePodcast.youtube_url) + "?autoplay=1"}
                    title={activePodcast.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full border-none"
                  />
                </div>

                <div className="p-4 bg-zinc-900/35">
                  <h3 className="font-extrabold text-sm text-white font-mono uppercase tracking-wide">{activePodcast.title}</h3>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- FOUNDER MESSAGE ENVELOPE MODAL --- */}
        <AnimatePresence>
          {selectedFounderForMsg && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
              onClick={() => setSelectedFounderForMsg(null)}
            >
              <motion.div 
                initial={{ scale: 0.95, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 15 }}
                transition={{ duration: 0.25 }}
                className="w-full max-w-lg bg-white border border-zinc-200 rounded-none shadow-2xl relative p-6 md:p-8"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button 
                  onClick={() => setSelectedFounderForMsg(null)}
                  className="absolute top-4 right-4 p-1.5 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-500 hover:text-black transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Message Header */}
                <div className="flex items-center gap-4 mb-6 border-b border-zinc-100 pb-5 mt-2">
                  <div className="w-16 h-16 rounded-none border border-zinc-200 bg-zinc-50 relative overflow-hidden shrink-0 shadow-sm">
                    {selectedFounderForMsg.photo_url ? (
                      <img 
                        src={selectedFounderForMsg.photo_url} 
                        alt={selectedFounderForMsg.name} 
                        className="w-full h-full object-cover object-top"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-tr from-zinc-200 to-zinc-50 flex items-center justify-center text-zinc-400 font-bold text-sm uppercase font-mono">
                        {selectedFounderForMsg.name?.[0]}
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-black font-mono uppercase tracking-tight">{selectedFounderForMsg.name}</h3>
                    <p className="text-xs text-[#ea580c] font-bold uppercase tracking-wider mt-0.5">{selectedFounderForMsg.role}</p>
                    <p className="text-[10px] text-zinc-400 font-mono uppercase mt-1">Healix Technologies Pvt. Ltd.</p>
                  </div>
                </div>

                {/* Letter Body */}
                <div className="relative font-serif text-zinc-800 text-sm leading-relaxed whitespace-pre-line py-2">
                  <Quote className="absolute -top-1 -left-2 w-8 h-8 text-orange-100 -z-10 rotate-180" />
                  <p className="italic font-medium text-zinc-900 text-base mb-4">"Greetings from the Leadership Team,"</p>
                  <p className="font-medium text-zinc-700 leading-relaxed font-sans">{selectedFounderForMsg.quote}</p>
                </div>

                {/* Signature/Footer */}
                <div className="mt-8 border-t border-zinc-100 pt-5 flex items-center justify-between text-xs font-mono">
                  <div>
                    <p className="text-zinc-400 uppercase">Status</p>
                    <p className="text-emerald-600 font-bold uppercase flex items-center gap-1.5 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Verified Leadership
                    </p>
                  </div>
                  <button 
                    onClick={() => setSelectedFounderForMsg(null)}
                    className="px-4 py-2 border border-zinc-300 hover:border-black text-black text-xs font-bold uppercase tracking-wider transition-colors font-mono"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}

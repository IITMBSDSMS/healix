"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Shield, Activity, Server, MessageSquareQuote, X, Smartphone, Calendar, GraduationCap, Newspaper, Rocket, HelpCircle, ChevronDown, Play, Sparkles, Building2, Heart, ChevronLeft, ChevronRight, Quote, ExternalLink, Award, Users, Target, BookOpen } from "lucide-react";
import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { HeroCarousel } from "@/components/ui/HeroCarousel";

const TEAM_MEMBERS = [
  {
    name: "Avnish Verma",
    role: "Founder & CEO",
    photo: "https://images.unsplash.com/photo-1519085186480-b8553f4b2a44?q=80&w=400&auto=format&fit=crop",
    linkedin: "https://www.linkedin.com/company/quick-healix/",
    quote: "Precision health data infrastructure is the foundation of modern clinical safety and AI diagnostics. At Healix, we are commoditizing the complex engineering required to unify fragmented health datasets so innovators can build clinical products at scale.",
    institution: "Healix Technologies"
  },
  {
    name: "Mahima Sharma",
    role: "Chief Operating Officer",
    photo: "https://chdujpvwawaqgaenrgms.supabase.co/storage/v1/object/public/mentor-photos/7dbf680f-f5d2-4967-b1bb-1bdc40edd29c-1779985889408.png",
    linkedin: "https://www.linkedin.com/company/quick-healix/",
    quote: "Reliability is not a feature; it is the core foundation. Scaling operations, securing strategic partnerships, and building sustainable ecosystem networks are key to translating Healix's clinical tech into tangible community outcomes.",
    institution: "Healix Technologies"
  },
  {
    name: "Debraghya Bag",
    role: "Chief Medical Officer",
    photo: "https://chdujpvwawaqgaenrgms.supabase.co/storage/v1/object/public/mentor-photos/2354710c-6edf-459f-9e26-09a96d274a9d-1779985736208.png",
    linkedin: "https://www.linkedin.com/company/quick-healix/",
    quote: "Precision medicine starts with precise data engineering. Ensuring scientific credibility, medical correctness, and healthcare system reliability is not a post-hoc check—it is built into every telemetry model we run at Healix.",
    institution: "AIIMS New Delhi"
  },
  {
    name: "Sudiksha Sharma",
    role: "Mental Health & Psychology",
    photo: "https://chdujpvwawaqgaenrgms.supabase.co/storage/v1/object/public/mentor-photos/9e91e2a2-6910-4254-aeca-5fdc074ebb05-1779985539265.png",
    linkedin: "https://www.linkedin.com/company/quick-healix/",
    quote: "Technology must serve the human experience. Designing healthcare systems that people emotionally trust, feel safe using, and find reassuring is critical for securing widespread public health adoption.",
    institution: "Healix Technologies"
  },
  {
    name: "Chaavi Sharma",
    role: "Mental Health & Human Development",
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop",
    linkedin: "https://www.linkedin.com/company/quick-healix/",
    quote: "Human-centric development and mental health support must be integrated into modern healthcare systems to build long-term trust and community resilience.",
    institution: "Healix Technologies"
  },
  {
    name: "Swaranjali Sonje",
    role: "Biomedical Engineering",
    photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop",
    linkedin: "https://www.linkedin.com/company/quick-healix/",
    quote: "Bridging the gap between engineering and clinical application allows us to build robust hardware telemetry and biosensors that save lives in real-time.",
    institution: "Healix Technologies"
  },
  {
    name: "Dhruv Advani",
    role: "Clinical Research & Medical Innovation",
    photo: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=400&auto=format&fit=crop",
    linkedin: "https://www.linkedin.com/company/quick-healix/",
    quote: "Clinical research is the bedrock of medical innovation. By combining AI diagnostics with rigorous validation, we ensure the safety of digital health deployments.",
    institution: "AIIMS New Delhi"
  }
];

const DEFAULT_ADVISORS = [
  // Clinical Advisors
  {
    name: "Dr. Partha Pratim",
    designation: "MD",
    institution: "AIIMS New Delhi",
    expertise: "Genomics sequencing diagnostics & risk profiling",
    category: "clinical",
    photo: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=400&auto=format&fit=crop",
    linkedin: "https://www.linkedin.com/company/quick-healix/"
  },
  {
    name: "Dr. Sarah Chen",
    designation: "MD, PhD",
    institution: "Stanford Medicine",
    expertise: "Clinical decision support & triaging pipelines",
    category: "clinical",
    photo: "https://images.unsplash.com/photo-1594824813573-246434de83fb?q=80&w=400&auto=format&fit=crop",
    linkedin: "https://www.linkedin.com/company/quick-healix/"
  },
  {
    name: "Dr. A. C. Roy",
    designation: "MD, FACC",
    institution: "Mayo Clinic",
    expertise: "Cardiovascular telemetry & remote monitoring",
    category: "clinical",
    photo: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=400&auto=format&fit=crop",
    linkedin: "https://www.linkedin.com/company/quick-healix/"
  },
  // Research Advisors
  {
    name: "Dr. Rajesh K. Sharma",
    designation: "PhD",
    institution: "IISc Bangalore",
    expertise: "Distributed algorithms & database reliability",
    category: "research",
    photo: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=400&auto=format&fit=crop",
    linkedin: "https://www.linkedin.com/company/quick-healix/"
  },
  {
    name: "Prof. Michael Sterling",
    designation: "PhD",
    institution: "MIT Media Lab",
    expertise: "Wearable biosensors & edge compute arrays",
    category: "research",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop",
    linkedin: "https://www.linkedin.com/company/quick-healix/"
  },
  {
    name: "Dr. Ananya Ray",
    designation: "PhD",
    institution: "IIT Madras",
    expertise: "In-silico molecular modeling & cancer targets",
    category: "research",
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop",
    linkedin: "https://www.linkedin.com/company/quick-healix/"
  },
  // Academic Mentors
  {
    name: "Prof. R. Sharma",
    designation: "Senior Faculty",
    institution: "IIT Delhi",
    expertise: "Telemetry synchronization & network protocols",
    category: "academic",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop",
    linkedin: "https://www.linkedin.com/company/quick-healix/"
  },
  {
    name: "Dr. Vikram Sen",
    designation: "Professor",
    institution: "AIIMS New Delhi",
    expertise: "Community health diagnostics & survey design",
    category: "academic",
    photo: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=400&auto=format&fit=crop",
    linkedin: "https://www.linkedin.com/company/quick-healix/"
  },
  {
    name: "Dr. Helen Rostova",
    designation: "Faculty",
    institution: "Cambridge University",
    expertise: "Explainable deep learning models in healthcare",
    category: "academic",
    photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop",
    linkedin: "https://www.linkedin.com/company/quick-healix/"
  },
  // Industry Experts
  {
    name: "Sudiksha Sharma",
    designation: "Human Systems Strategist",
    institution: "CU Delhi",
    expertise: "Behavioral psychology & interface trust dynamics",
    category: "industry",
    photo: "https://chdujpvwawaqgaenrgms.supabase.co/storage/v1/object/public/mentor-photos/9e91e2a2-6910-4254-aeca-5fdc074ebb05-1779985539265.png",
    linkedin: "https://www.linkedin.com/company/quick-healix/"
  },
  {
    name: "Siddharth Bose",
    designation: "Partner",
    institution: "Biotech Capital",
    expertise: "Commercialization & intellectual property structures",
    category: "industry",
    photo: "https://images.unsplash.com/photo-1519085186480-b8553f4b2a44?q=80&w=400&auto=format&fit=crop",
    linkedin: "https://www.linkedin.com/company/quick-healix/"
  },
  {
    name: "Elena Petrova",
    designation: "Director",
    institution: "Global Pharma Solutions",
    expertise: "Clinical trial designs & regulatory compliance",
    category: "industry",
    photo: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?q=80&w=400&auto=format&fit=crop",
    linkedin: "https://www.linkedin.com/company/quick-healix/"
  }
];

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

function Counter({ target, duration = 1.2 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = React.useRef(null);
  const inView = true; // Simple trigger on client mount

  useEffect(() => {
    let start = 0;
    const end = target;
    if (start === end) return;

    const totalMilliseconds = duration * 1000;
    const incrementTime = Math.abs(Math.floor(totalMilliseconds / end));

    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === end) clearInterval(timer);
    }, incrementTime);

    return () => clearInterval(timer);
  }, [target, duration]);

  return <span ref={ref}>{count}</span>;
}

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

function BigAdvisorCard({ advisor }: { advisor: any }) {
  const photo = advisor.photo || advisor.photo_url;
  const linkedin = advisor.linkedin || advisor.linkedin_url;

  return (
    <div className="bg-white border border-zinc-200/80 hover:border-zinc-950 transition-all duration-500 group p-8 flex flex-col items-center text-center shadow-sm hover:shadow-xl h-[320px] w-full rounded-2xl relative overflow-hidden">
      {advisor.categoryLabel && (
        <div 
          className="absolute top-0 left-0 w-full h-1" 
          style={{ backgroundColor: advisor.categoryColor || '#ea580c' }} 
        />
      )}
      
      {photo ? (
        <div className="w-24 h-24 rounded-full overflow-hidden border-[3px] border-zinc-100 shadow-sm mb-5 shrink-0 relative group-hover:scale-110 transition-transform duration-500">
          <img src={photo} alt={advisor.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
        </div>
      ) : (
        <div className="w-24 h-24 rounded-full bg-zinc-100 flex items-center justify-center border-[3px] border-white shadow-sm mb-5 shrink-0 text-zinc-400 group-hover:scale-110 transition-transform duration-500">
          <Users className="w-10 h-10" />
        </div>
      )}
      
      <h4 className="font-black text-lg text-zinc-950 font-mono uppercase tracking-tight leading-none mb-2 group-hover:text-[#ea580c] transition-colors">{advisor.name}</h4>
      <p className="text-[10px] text-[#ea580c] font-mono font-bold tracking-widest uppercase mb-3 line-clamp-1">{advisor.role || advisor.designation || advisor.expertise}</p>
      
      {advisor.institution && (
        <p className="text-xs text-zinc-500 font-medium leading-relaxed line-clamp-2">{advisor.institution}</p>
      )}

      {advisor.categoryLabel && (
        <span 
          className="mt-auto px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border"
          style={{ 
            color: advisor.categoryColor || '#ea580c', 
            borderColor: (advisor.categoryColor || '#ea580c') + '40',
            backgroundColor: (advisor.categoryColor || '#ea580c') + '05'
          }}
        >
          {advisor.categoryLabel}
        </span>
      )}

      {linkedin && (
        <a href={linkedin} target="_blank" rel="noopener noreferrer" className="absolute top-4 right-4 text-zinc-400 hover:text-[#0a66c2] transition-colors">
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
          </svg>
        </a>
      )}
    </div>
  );
}


function AdvisorCard({ advisor }: { advisor: any }) {
  if (advisor.isPlaceholder) {
    return (
      <div className="border border-dashed border-zinc-200 hover:border-[#ea580c] bg-zinc-50/50 p-4 transition-all duration-300 flex flex-col justify-between group min-h-[140px] rounded-lg">
        <div>
          <h4 className="font-extrabold text-xs text-zinc-800 font-mono uppercase tracking-tight leading-snug">{advisor.name}</h4>
          <p className="text-[9px] text-[#ea580c] font-mono uppercase font-bold tracking-wider mt-0.5">{advisor.institution}</p>
          <p className="text-[11px] text-zinc-500 leading-normal mt-2 font-sans">{advisor.expertise}</p>
        </div>
        <div className="mt-3">
          <Link 
            href="/contact" 
            className="inline-flex items-center gap-1 text-[9px] font-bold text-[#ea580c] group-hover:text-[#c2410c] font-mono uppercase tracking-wider transition-colors"
          >
            Join Ecosystem <ArrowRight className="w-2.5 h-2.5" />
          </Link>
        </div>
      </div>
    );
  }

  const photo = advisor.photo || advisor.photo_url;
  const linkedin = advisor.linkedin || advisor.linkedin_url;

  return (
    <div className="bg-white border border-zinc-200/80 hover:border-zinc-950 transition-all duration-300 group p-4 flex gap-4 shadow-sm hover:shadow-md min-h-[140px] rounded-lg text-left">
      {photo && (
        <div className="w-12 h-12 rounded-full overflow-hidden border border-zinc-100 shrink-0 bg-zinc-100 relative">
          <img 
            src={photo} 
            alt={advisor.name} 
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-[1.05] transition-all duration-500"
          />
        </div>
      )}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-extrabold text-sm text-zinc-950 font-mono uppercase tracking-tight truncate">{advisor.name}</h4>
            {linkedin && (
              <a 
                href={linkedin} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-zinc-400 hover:text-[#ea580c] transition-colors shrink-0"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                </svg>
              </a>
            )}
          </div>
          <p className="text-[10px] text-[#ea580c] font-bold uppercase tracking-wider mt-0.5 leading-none">
            {advisor.designation}
          </p>
          <p className="text-[9px] text-zinc-400 font-mono uppercase tracking-wider leading-none mt-1">
            {advisor.institution}
          </p>
          <p className="text-xs text-zinc-650 leading-snug mt-2 pt-2 border-t border-zinc-100 font-sans">
            {advisor.expertise}
          </p>
        </div>
      </div>
    </div>
  );
}

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
  const [dbMentors, setDbMentors] = useState<any[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);


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
          if (Array.isArray(data)) {
            const realPodcasts = data.filter(p => p.youtube_url && !p.youtube_url.includes("dQw4w9WgXcQ"));
            setPodcasts(realPodcasts);
            return;
          }
        }
      } catch (err) {
        console.warn("Error fetching podcasts:", err);
      }
      setPodcasts([]);
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

    const fetchMentors = async () => {
      try {
        const res = await fetch("/api/mentors");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setDbMentors(data);
          }
        }
      } catch (err) {
        console.warn("Error fetching mentors:", err);
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
    fetchMentors();
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
    "Healix Technologies Pvt. Ltd. incorporation process underway.",
    "BioLabs research and innovation ecosystem under development.",
    "Applications open for Founding Research Associates and Student Contributors.",
    "Advisory Board and Mentor Network formation in progress.",
    "Healthcare, research, and mental health initiatives being planned under Healix verticals.",
    "New collaborations and team onboarding updates to be announced soon."
  ];

  // If founders exist in the database, use ONLY the database founders to allow removal.
  // Sort them by display_order. If database is empty, fallback to TEAM_MEMBERS.
  const displayTeam = founders.length > 0
    ? [...founders]
        .filter(f => f.active !== false)
        .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
        .map(f => ({
          name: f.name,
          role: f.role,
          quote: f.quote,
          photo: f.photo_url || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop",
          linkedin: f.linkedin_url || "https://www.linkedin.com/company/quick-healix/",
          institution: f.institution || "Healix Technologies",
          active: true
        }))
    : TEAM_MEMBERS;

  // Map dynamic advisors (mentors) from database
  // Filter out core team members shown in Section 2
  const CORE_TEAM_NAMES = ["avnish verma", "mahima sharma", "debarghya bag", "debraghya bag", "sudiksha sharma", "chaavi sharma", "swaranjali sonje", "dhruv advani"];
  const filteredMentors = dbMentors.filter(m => !CORE_TEAM_NAMES.includes(m.name?.toLowerCase().trim()));

  // Normalize db mentor to advisor shape
  const normalizeDbMentor = (m: any) => ({
    name: m.name,
    designation: m.role,
    institution: m.organization || "Healix Advisory",
    expertise: m.bio || m.quote || "Clinical Research & Healthcare Mentorship",
    category: m.category || "clinical",
    photo: m.photo_url || "",
    linkedin: m.linkedin_url || "https://www.linkedin.com/company/quick-healix/"
  });

  // Use DB advisors if available, else fall back to DEFAULT_ADVISORS
  const sourceAdvisors = filteredMentors.length > 0 ? filteredMentors.map(normalizeDbMentor) : DEFAULT_ADVISORS;

  // Group by category
  const CATEGORY_CONFIG = [
    { key: "clinical", label: "Clinical Advisors", color: "#ea580c" },
    { key: "research", label: "Research Advisors", color: "#2563eb" },
    { key: "academic", label: "Academic Mentors",  color: "#059669" },
    { key: "industry", label: "Industry Experts",  color: "#7c3aed" },
  ];

  const groupedAdvisors = CATEGORY_CONFIG.map(cat => ({
    ...cat,
    members: sourceAdvisors.filter(a => (a.category || "clinical") === cat.key)
  })).filter(cat => cat.members.length > 0);

  // If no category has items (edge case), show all under clinical
  const finalGroupedAdvisors = groupedAdvisors.length > 0 ? groupedAdvisors : [
    { key: "clinical", label: "Clinical Advisors", color: "#ea580c", members: DEFAULT_ADVISORS.filter(a => a.category === "clinical") }
  ];

  return (
    <div className="relative min-h-screen flex flex-col w-full bg-white text-zinc-900 pb-20 overflow-x-hidden selection:bg-orange-500/20">
      
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(#ea580c_0.5px,transparent_0.5px)] [background-size:24px_24px] opacity-[0.02] pointer-events-none" />

      {/* 1. Hero Carousel Banner */}
      <div className="w-full">
        <HeroCarousel />
      </div>

      {/* 2. People Behind Healix */}
      <section id="leadership" className="py-24 bg-white border-b border-zinc-100 relative">
        <div className="max-w-[94%] mx-auto">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <p className="text-[10px] font-mono text-[#ea580c] uppercase tracking-widest font-bold mb-3">Core Leadership & Network</p>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-zinc-950 font-mono">
              People Behind Healix
            </h2>
            <div className="w-16 h-1 bg-[#ea580c] mx-auto mt-4 mb-5" />
            <p className="text-zinc-650 text-sm md:text-base leading-relaxed">
              An interdisciplinary network of clinicians, researchers, engineers, psychologists, and innovators.
            </p>
          </div>

          {/* Grid of Team Members */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {displayTeam.map((member, i) => (
              <div key={i} className="bg-zinc-50 border border-zinc-200/80 hover:border-zinc-950 transition-all duration-300 group flex flex-col justify-between shadow-sm hover:shadow-md">
                <div>
                  <div className="aspect-square bg-zinc-100 relative overflow-hidden">
                    <img 
                      src={member.photo} 
                      alt={member.name} 
                      className="w-full h-full object-cover object-top grayscale group-hover:grayscale-0 group-hover:scale-[1.02] transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4 justify-between">
                      <span className="text-[9px] font-mono text-white bg-zinc-950/80 border border-white/20 px-2 py-0.5 uppercase tracking-wider font-bold">
                        {member.institution}
                      </span>
                      <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 bg-[#ea580c] text-white hover:bg-orange-600 transition-colors rounded-none">
                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                        </svg>
                      </a>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-extrabold text-base text-zinc-950 font-mono uppercase tracking-tight">{member.name}</h3>
                    <p className="text-xs text-[#ea580c] font-bold uppercase tracking-wider mt-1">{member.role}</p>
                    <p className="text-[10px] text-zinc-400 font-mono uppercase tracking-wider mt-1">{member.institution}</p>
                  </div>
                </div>
                <div className="px-6 pb-6 pt-0">
                  <button 
                    onClick={() => setSelectedFounderForMsg(member)}
                    className="h-8 px-4 border border-zinc-300 hover:border-zinc-950 bg-white hover:bg-zinc-950 hover:text-white text-[10px] font-bold uppercase tracking-wider flex items-center transition-all w-full justify-center font-mono"
                  >
                    Read Message
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link 
              href="/about" 
              className="inline-flex items-center gap-2 px-8 py-3 bg-zinc-950 hover:bg-[#ea580c] text-white text-xs font-bold uppercase tracking-wider transition-colors font-mono"
            >
              View Full Team <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Healix Network */}
      <section className="bg-zinc-950 text-white py-20 px-6 sm:px-8 border-y border-zinc-900 relative overflow-hidden">
        {/* Grid Backdrop Mesh & radial glow */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:35px_35px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-orange-500/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-[94%] mx-auto relative z-10">
          <div className="text-center mb-16">
            <p className="text-[10px] font-mono text-[#ea580c] uppercase tracking-widest font-bold mb-3">Institutional Scope</p>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight font-mono">Healix Network</h2>
            <div className="w-16 h-1 bg-[#ea580c] mx-auto mt-4" />
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 text-center max-w-7xl mx-auto">
            {[
              { label: "AIIMS Contributors", value: 15, suffix: "+" },
              { label: "Clinical Advisors", value: 25, suffix: "+" },
              { label: "Research Associates", value: 40, suffix: "+" },
              { label: "Biomedical Researchers", value: 30, suffix: "+" },
              { label: "Psychology Professionals", value: 20, suffix: "+" },
              { label: "Innovation Programs", value: 8, suffix: "" },
              { label: "Healthcare Initiatives", value: 12, suffix: "" }
            ].map((stat, i) => (
              <div key={i} className="p-5 bg-zinc-900/40 border border-zinc-850 hover:border-[#ea580c]/30 hover:bg-zinc-900/80 transition-all duration-300 group flex flex-col justify-center">
                <p className="text-2xl md:text-3xl font-extrabold text-[#ea580c] font-mono tracking-tight group-hover:scale-105 transition-transform duration-300">
                  <Counter target={stat.value} />{stat.suffix}
                </p>
                <p className="text-[9px] md:text-[10px] text-zinc-400 font-mono font-bold uppercase tracking-wider mt-3 leading-relaxed">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Advisors & Mentors */}
      <section id="mentors" className="py-24 bg-zinc-50 border-b border-zinc-100 relative">
        <div className="max-w-[94%] mx-auto">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <p className="text-[10px] font-mono text-[#ea580c] uppercase tracking-widest font-bold mb-3">Ecosystem Advisory</p>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-zinc-950 font-mono">
              Advisors & Mentors
            </h2>
            <div className="w-16 h-1 bg-[#ea580c] mx-auto mt-4 mb-5" />
            <p className="text-zinc-500 text-sm leading-relaxed">
              An interdisciplinary advisory board guiding Healix across clinical, research, academic, and industry domains.
            </p>
          </div>

          {(() => {
            // Only real advisors (no placeholders) in the marquee
            const allAdvisors = finalGroupedAdvisors.flatMap(cat =>
              cat.members.map((member: any) => ({ ...member, categoryLabel: cat.label, categoryColor: cat.color }))
            );

            // Need at least a few to marquee — if empty show nothing
            if (allAdvisors.length === 0) return null;

            // Duplicate enough copies for infinite scroll
            const copies = Math.max(4, Math.ceil(16 / allAdvisors.length));
            const marqueeItems = Array.from({ length: copies }, () => allAdvisors).flat();

            // Split into two rows by alternating
            const row1 = marqueeItems.filter((_, i) => i % 2 === 0);
            const row2 = marqueeItems.filter((_, i) => i % 2 !== 0);

            return (
              <div className="relative w-full max-w-[100vw] flex flex-col gap-8 mt-10 overflow-hidden">
                {/* Row 1: Left to Right */}
                <div className="flex w-full overflow-hidden relative">
                  <motion.div
                    className="flex gap-6 min-w-max pr-6"
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{ ease: "linear", duration: 80, repeat: Infinity }}
                  >
                    {row1.map((adv, i) => (
                      <div key={i} className="w-[320px] shrink-0">
                        <BigAdvisorCard advisor={adv} />
                      </div>
                    ))}
                  </motion.div>
                </div>

                {/* Row 2: Right to Left */}
                {row2.length > 0 && (
                  <div className="flex w-full overflow-hidden relative">
                    <motion.div
                      className="flex gap-6 min-w-max pr-6"
                      animate={{ x: ["-50%", "0%"] }}
                      transition={{ ease: "linear", duration: 85, repeat: Infinity }}
                    >
                      {row2.map((adv, i) => (
                        <div key={i} className="w-[320px] shrink-0">
                          <BigAdvisorCard advisor={adv} />
                        </div>
                      ))}
                    </motion.div>
                  </div>
                )}

                {/* Fade overlays */}
                <div className="absolute top-0 left-0 w-20 md:w-40 h-full bg-gradient-to-r from-zinc-50 to-transparent pointer-events-none z-10" />
                <div className="absolute top-0 right-0 w-20 md:w-40 h-full bg-gradient-to-l from-zinc-50 to-transparent pointer-events-none z-10" />
              </div>
            );
          })()}

          {/* CTA Buttons — both together at the bottom */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-14">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-zinc-950 hover:bg-[#ea580c] text-white text-xs font-bold uppercase tracking-wider transition-all duration-300 font-mono rounded-lg"
            >
              Apply to Join <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-3.5 border-2 border-zinc-950 hover:border-[#ea580c] hover:text-[#ea580c] text-zinc-950 text-xs font-bold uppercase tracking-wider transition-all duration-300 font-mono rounded-lg"
            >
              Join Our Advisory Network <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Founder's Vision */}
      <section className="py-24 bg-white border-b border-zinc-100 relative overflow-hidden">
        <div className="max-w-[94%] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center max-w-7xl mx-auto">
            {/* Left Side: Founder Image Card */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative group w-full max-w-sm border border-zinc-200 p-3 bg-zinc-50 shadow-md">
                <div className="aspect-[3/4] bg-zinc-100 relative overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1519085186480-b8553f4b2a44?q=80&w=600&auto=format&fit=crop" 
                    alt="Avnish Verma" 
                    className="w-full h-full object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6">
                    <p className="text-xs font-mono text-[#ea580c] uppercase font-bold tracking-widest">Founder & CEO</p>
                    <h3 className="text-xl font-black text-white font-mono uppercase tracking-tight mt-1">Avnish Verma</h3>
                    <p className="text-[10px] text-zinc-300 font-mono mt-0.5">Healix Technologies</p>
                  </div>
                </div>
                {/* Decorative border */}
                <div className="absolute -bottom-2 -right-2 w-16 h-16 border-r-2 border-b-2 border-[#ea580c] pointer-events-none group-hover:translate-x-1 group-hover:translate-y-1 transition-transform duration-300" />
              </div>
            </div>

            {/* Right Side: Vision Details */}
            <div className="lg:col-span-7 space-y-8">
              <div className="space-y-3">
                <span className="text-[10px] font-mono text-[#ea580c] bg-orange-500/5 border border-orange-500/10 px-3 py-1 font-bold uppercase tracking-widest">
                  Leadership Directive
                </span>
                <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-zinc-950 font-mono">
                  Founder’s Vision
                </h2>
                <div className="w-12 h-1 bg-[#ea580c]" />
              </div>

              {/* Main Vision Statement */}
              <div className="relative font-serif py-2 pl-6 border-l-4 border-[#ea580c]">
                <Quote className="absolute -top-3 -left-3 w-8 h-8 text-orange-50 rotate-180 -z-10" />
                <p className="text-zinc-700 text-sm md:text-base leading-relaxed italic font-medium font-sans">
                  "Healix Technologies was founded to bridge the gap between healthcare, research, technology, and education by building an ecosystem where clinicians, researchers, engineers, psychologists, and innovators can collaborate to solve real-world healthcare challenges."
                </p>
              </div>

              {/* Mission & Vision 2030 grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-zinc-100">
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2 text-zinc-950">
                    <Target className="w-4 h-4 text-[#ea580c]" />
                    <h4 className="font-extrabold text-sm uppercase tracking-wider font-mono">Mission Statement</h4>
                  </div>
                  <p className="text-xs text-zinc-650 leading-relaxed font-sans">
                    To build high-reliability, open clinical data pipelines and secure IoT systems that connect engineers and researchers directly to responder networks.
                  </p>
                </div>
                
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2 text-zinc-950">
                    <Award className="w-4 h-4 text-[#ea580c]" />
                    <h4 className="font-extrabold text-sm uppercase tracking-wider font-mono">Vision 2030</h4>
                  </div>
                  <p className="text-xs text-zinc-650 leading-relaxed font-sans">
                    To standardise edge health intelligence and launch distributed computing workflows across AIIMS and IIT research divisions at national scale.
                  </p>
                </div>
              </div>

              {/* Action message envelope trigger */}
              <div className="pt-6">
                <button 
                  onClick={() => setSelectedFounderForMsg(displayTeam.length > 0 ? displayTeam[0] : TEAM_MEMBERS[0])}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-950 hover:bg-[#ea580c] text-white text-xs font-bold uppercase tracking-wider transition-colors font-mono"
                >
                  Read Founder Message <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Ecosystem */}
      <section id="ecosystem" className="py-24 bg-zinc-50 border-b border-zinc-100 relative">
        <div className="max-w-[94%] mx-auto">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <p className="text-[10px] font-mono text-[#ea580c] uppercase tracking-widest font-bold mb-3">Structured Segments</p>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-zinc-950 font-mono">Our Ecosystem</h2>
            <div className="w-16 h-1 bg-[#ea580c] mx-auto mt-4 mb-5" />
            <p className="text-zinc-650 text-sm leading-relaxed">
              Explore the core innovation verticals developing next-generation medical systems, genomics software, and community health networks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {[
              {
                title: "BioLabs Genomics",
                subtitle: "Research • Innovation • Mentorship",
                desc: "Building high-performance genomic sequence modeling tools, CRISPR outcome validation protocols, and elite research fellowships.",
                logo: "/biolabs-logo-web.png",
                href: "/biolabs",
                tag: "GENOMICS & RESEARCH"
              },
              {
                title: "Healix AI",
                subtitle: "Artificial Intelligence for Healthcare",
                desc: "Developing explainable deep learning diagnostic pipelines, medical twin simulations, and low-latency clinical triaging networks.",
                logo: "/ai-logo.jpg",
                href: "/ai-check",
                tag: "PREDICTIVE CLINICAL AI"
              },
              {
                title: "Avennix Pharma",
                subtitle: "Pharmaceutical & Healthcare Solutions",
                desc: "Standardizing clinical trial metrics, software-driven drug discovery pipelines, and secure IoT care networks.",
                logo: "/avennix-official-logo.png",
                href: "/care",
                tag: "DIGITAL THERAPEUTICS"
              },
              {
                title: "Healix Sahyog Foundation",
                subtitle: "Mental Health • Community Impact • Education",
                desc: "Empowering community health with active safety networks, Project Suraksha coordinates, and inclusive mental health support.",
                logo: "/hsf-official-logo-web.png",
                href: "/shesecure",
                tag: "COMMUNITY HEALTH & SAFETY"
              }
            ].map((eco, i) => (
              <div key={i} className="group relative flex flex-col justify-between p-6 bg-white border border-zinc-200 hover:border-zinc-950 transition-all duration-300 min-h-[290px] shadow-sm">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[8px] font-mono text-[#ea580c] bg-[#ea580c]/5 border border-[#ea580c]/20 px-2 py-0.5 font-bold uppercase tracking-wider">{eco.tag}</span>
                    <div className="w-8 h-8 rounded border border-zinc-200/60 bg-white flex items-center justify-center overflow-hidden shrink-0">
                      <img src={eco.logo} alt="" className="w-full h-full object-contain p-1" />
                    </div>
                  </div>
                  <h3 className="text-base font-black text-zinc-950 uppercase group-hover:text-[#ea580c] transition-colors font-mono tracking-tight mt-2">{eco.title}</h3>
                  <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-wide font-bold mt-1 leading-snug">{eco.subtitle}</p>
                  <p className="text-xs text-zinc-650 leading-relaxed mt-4">{eco.desc}</p>
                </div>
                <div className="mt-6">
                  <Link href={eco.href} className="inline-flex items-center gap-1.5 text-xs font-bold text-[#ea580c] hover:text-[#c2410c] font-mono uppercase tracking-wider transition-colors">
                    Explore Portal <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Current Projects */}
      <section id="initiatives" className="py-24 bg-white border-b border-zinc-100 relative">
        <div className="max-w-[94%] mx-auto">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <p className="text-[10px] font-mono text-[#ea580c] uppercase tracking-widest font-bold mb-3">Active Pursuits</p>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-zinc-950 font-mono">Current Projects</h2>
            <div className="w-16 h-1 bg-[#ea580c] mx-auto mt-4 mb-5" />
            <p className="text-zinc-650 text-sm leading-relaxed">
              Tracking our current scientific and biomedical developments undergoing institutional trials or pilot testing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {[
              {
                title: "Project Suraksha",
                desc: "Developing low-latency travel safety telemetry tracking, encrypted hardware beacons, and emergency SOS networks.",
                status: "DEVELOPING / FIELD TESTING",
                color: "text-amber-600 border-amber-600/20 bg-amber-500/5",
                href: "/shesecure"
              },
              {
                title: "BioLabs Research Fellowship",
                desc: "Providing research stipends and laboratory access for graduate researchers building sequence modeling models.",
                status: "APPLICATIONS OPEN",
                color: "text-emerald-600 border-emerald-600/20 bg-emerald-500/5",
                href: "/biolabs"
              },
              {
                title: "Healthcare Innovation Programs",
                desc: "Connecting engineers, psychologists, and clinicians to develop and test pilot systems in real-world environments.",
                status: "IN PROGRESS",
                color: "text-blue-600 border-blue-600/20 bg-blue-500/5",
                href: "/contact"
              },
              {
                title: "AI Healthcare Initiatives",
                desc: "Deploying deep learning triage models to remote clinics to assist local caregivers with diagnostic classifications.",
                status: "BETA TESTING",
                color: "text-purple-600 border-purple-600/20 bg-purple-500/5",
                href: "/ai-check"
              }
            ].map((init, i) => (
              <div key={i} className="bg-zinc-50 border border-zinc-200 p-6 flex flex-col justify-between hover:border-zinc-950 transition-all duration-300 min-h-[230px] shadow-sm">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className={`text-[8px] font-mono font-bold tracking-widest uppercase border px-2 py-0.5 ${init.color}`}>{init.status}</span>
                  </div>
                  <h3 className="font-extrabold text-sm text-zinc-950 font-mono uppercase tracking-tight leading-snug">{init.title}</h3>
                  <p className="text-xs text-zinc-650 leading-relaxed mt-4">{init.desc}</p>
                </div>
                <div className="mt-6">
                  <Link href={init.href} className="text-[10px] font-bold text-[#ea580c] hover:text-[#c2410c] font-mono uppercase tracking-wider flex items-center gap-1">
                    Learn More <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Events */}
      <section id="events-section" className="py-24 bg-zinc-50 border-b border-zinc-100 relative">
        <div className="max-w-[94%] mx-auto">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <p className="text-[10px] font-mono text-[#ea580c] uppercase tracking-widest font-bold mb-3">Academic Seminars</p>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-zinc-950 font-mono">Upcoming Events</h2>
            <div className="w-16 h-1 bg-[#ea580c] mx-auto mt-4 mb-5" />
            <p className="text-zinc-650 text-sm leading-relaxed">
              Register for academic panels, research presentations, and clinical informatics workshops hosted by our faculty.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map((sem, idx) => (
                <div key={idx} className="bg-white border border-zinc-200 hover:border-zinc-950 p-6 flex flex-col justify-between transition-all duration-300 min-h-[200px] shadow-sm group">
                  <div>
                    <div className="flex items-center gap-2 text-[#ea580c] mb-4">
                      <Calendar className="w-4 h-4" />
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider">{sem.date}</span>
                    </div>
                    <h3 className="text-base font-black text-zinc-950 uppercase font-mono tracking-tight leading-snug group-hover:text-[#ea580c] transition-colors">
                      {sem.title}
                    </h3>
                    <p className="text-xs text-zinc-550 mt-3 flex items-center gap-1.5 font-sans">
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 shrink-0" />
                      Speaker: <strong className="text-zinc-750 font-semibold">{sem.speaker}</strong>
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-zinc-100 flex justify-between items-center">
                    <Link 
                      href={`/events?search=${encodeURIComponent(sem.title)}`} 
                      className="text-[10px] font-bold text-[#ea580c] hover:text-[#c2410c] font-mono uppercase tracking-widest flex items-center gap-1"
                    >
                      Register Now <ArrowRight className="w-3 h-3" />
                    </Link>
                    <span className="text-[9px] font-mono text-zinc-400 bg-zinc-100 px-2 py-0.5 uppercase">Academic Session</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-zinc-650 font-mono text-sm">Upcoming events will be announced shortly.</p>
              </div>
            )}
          </div>

          <div className="text-center mt-12">
            <Link 
              href="/events" 
              className="inline-flex items-center gap-2 px-8 py-3 bg-zinc-950 hover:bg-[#ea580c] text-white text-xs font-bold uppercase tracking-wider transition-colors font-mono"
            >
              View All Seminars <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 9. News & Updates */}
      <section id="news" className="py-24 bg-white border-b border-zinc-100 relative">
        <div className="max-w-[94%] mx-auto">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <p className="text-[10px] font-mono text-[#ea580c] uppercase tracking-widest font-bold mb-3">Live Feed</p>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-zinc-950 font-mono">News & Updates</h2>
            <div className="w-16 h-1 bg-[#ea580c] mx-auto mt-4 mb-5" />
            <p className="text-zinc-650 text-sm leading-relaxed">
              Stay updated with structural developments, announcements, and research podcasts from the Healix network.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-7xl mx-auto">
            {/* Announcements (Left column) */}
            <div className="lg:col-span-8 bg-zinc-50 border border-zinc-200/80 p-6 md:p-8 shadow-sm">
              <h3 className="text-base font-black text-zinc-950 uppercase mb-6 flex items-center gap-2 border-b border-zinc-200 pb-3 font-mono">
                <Newspaper className="w-4.5 h-4.5 text-[#ea580c]" /> Important Announcements
              </h3>
              
              <div className="relative h-[320px] overflow-hidden group">
                {/* Gradient overlays for smooth fading effect */}
                <div className="absolute top-0 left-0 w-full h-12 bg-gradient-to-b from-zinc-50 to-transparent pointer-events-none z-10" />
                
                <motion.div 
                  className="flex flex-col gap-4 absolute w-full"
                  animate={{ y: ["-50%", "0%"] }}
                  transition={{ 
                    duration: 25, 
                    ease: "linear", 
                    repeat: Infinity 
                  }}
                >
                  {[...announcements, ...announcements].map((ann, idx) => (
                    <div key={idx} className="border-l-4 border-[#ea580c] pl-4 py-3 bg-white hover:bg-orange-50/20 transition-colors flex items-center justify-between shadow-sm">
                      <Link href="/news" className="text-xs font-bold text-zinc-900 hover:text-[#ea580c] transition-colors leading-relaxed flex-1 font-mono">
                        {ann}
                      </Link>
                      <span className="hidden sm:inline-flex ml-3 px-2 py-0.5 bg-red-650 text-white font-mono text-[8px] font-bold uppercase">
                        New
                      </span>
                    </div>
                  ))}
                </motion.div>

                <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-zinc-50 to-transparent pointer-events-none z-10" />
              </div>
            </div>

            {/* Podcasts Block (Right column) */}
            <div className="lg:col-span-4 bg-zinc-50 border border-zinc-200/80 p-6 shadow-sm">
              {podcasts.length > 0 ? (
                <>
                  <h3 className="text-base font-black text-zinc-950 uppercase mb-6 border-b border-zinc-200 pb-3 font-mono flex items-center gap-2">
                    <Play className="w-4 h-4 text-[#ea580c]" /> Podcast Broadcasts
                  </h3>
                  <div className="space-y-4">
                    {podcasts.slice(0, 3).map((pod, idx) => (
                      <div key={idx} className="flex gap-4 items-center pb-3 border-b border-zinc-200 last:border-0 last:pb-0">
                        <div 
                          className="w-16 h-12 bg-zinc-200 relative shrink-0 overflow-hidden cursor-pointer shadow-sm group/thumb" 
                          onClick={() => setActivePodcast({ youtube_url: pod.youtube_url, title: pod.title })}
                        >
                          <img src={pod.thumbnail_url} alt="" className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-300" />
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center text-white">
                            <Play className="w-4 h-4 fill-white" />
                          </div>
                        </div>
                        <div className="min-w-0">
                          <span 
                            className="text-xs font-bold text-zinc-900 truncate block hover:text-[#ea580c] cursor-pointer font-mono" 
                            onClick={() => setActivePodcast({ youtube_url: pod.youtube_url, title: pod.title })}
                          >
                            {pod.title}
                          </span>
                          <span className="text-[9px] font-mono text-[#ea580c] uppercase font-bold tracking-wider mt-1 block">{pod.duration}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-base font-black text-zinc-950 uppercase mb-6 border-b border-zinc-200 pb-3 font-mono flex items-center gap-2">
                    <Activity className="w-4 h-4 text-[#ea580c]" /> LATEST ORGANIZATION UPDATES
                  </h3>
                  <div className="space-y-4">
                    {["TEAM ONBOARDING", "ADVISOR NETWORK", "RESEARCH OPPORTUNITIES", "HEALTHCARE INITIATIVES"].map((update, idx) => (
                      <div key={idx} className="flex gap-4 items-center pb-3 border-b border-zinc-200 last:border-0 last:pb-0">
                        <span className="text-xs font-bold text-zinc-900 block font-mono hover:text-[#ea580c] cursor-pointer transition-colors">
                          {update}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 10. Join BioLabs */}
      <section className="bg-black text-white py-24 px-6 sm:px-8 border-t border-zinc-900 relative overflow-hidden text-center">
        {/* Grid Backdrop Mesh & radial glow */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-orange-600/10 rounded-full blur-[140px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto relative z-10 space-y-8">
          <p className="text-[10px] font-mono text-[#ea580c] uppercase tracking-widest font-bold">Collaborative Venture</p>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight leading-tight max-w-3xl mx-auto font-mono">
            Join India’s Next Generation Healthcare Innovation Ecosystem
          </h2>
          <p className="text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Whether you are an active clinician, a molecular researcher, a systems engineer, or an industry partner, we invite you to collaborate with us to develop healthcare safety systems at national scale.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Link href="/biolabs" className="px-8 py-3 bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold uppercase tracking-wider transition-all w-full sm:w-auto shadow-[0_0_20px_rgba(234,88,12,0.3)] font-mono">
              Apply for BioLabs
            </Link>
            <Link href="/academy/mentors" className="px-8 py-3 border border-white/20 hover:border-white hover:bg-white/5 text-white text-xs font-bold uppercase tracking-wider transition-all w-full sm:w-auto font-mono">
              Become a Mentor
            </Link>
            <Link href="/contact" className="px-8 py-3 bg-white hover:bg-zinc-150 text-black text-xs font-bold uppercase tracking-wider transition-all w-full sm:w-auto font-mono">
              Collaborate With Us
            </Link>
          </div>
        </div>
      </section>

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
                  {selectedFounderForMsg.photo ? (
                    <img 
                      src={selectedFounderForMsg.photo} 
                      alt={selectedFounderForMsg.name} 
                      className="w-full h-full object-cover object-top"
                    />
                  ) : selectedFounderForMsg.photo_url ? (
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
                  <p className="text-[10px] text-zinc-400 font-mono uppercase mt-1">{selectedFounderForMsg.institution || "Healix Technologies"}</p>
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
  );
}

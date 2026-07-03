"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Shield, Activity, Server, MessageSquareQuote, X, Smartphone, Calendar, GraduationCap, Newspaper, Rocket, HelpCircle, ChevronDown, Play, Sparkles, Building2, Heart, ChevronLeft, ChevronRight, Quote, ExternalLink, Award, Users, Target, BookOpen, MapPin } from "lucide-react";
import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { HeroCarousel } from "@/components/ui/HeroCarousel";


const TEAM_MEMBERS = [
  {
    name: "Avnish Verma",
    role: "Founder & CEO",
    photo: "/founder_avnish.jpg",
    linkedin: "https://www.linkedin.com/company/quick-healix/",
    quote: "Precision health data infrastructure is the foundation of modern clinical safety and AI diagnostics. At Healix, we are commoditizing the complex engineering required to unify fragmented health datasets so innovators can build clinical products at scale.",
    institution: "Healix Technologies"
  },
  {
    name: "Divya Pasam",
    role: "Chief Operating Officer",
    photo: "/coo_divya.png",
    linkedin: "https://www.linkedin.com/company/quick-healix/",
    quote: "Reliability is not a feature; it is the core foundation. Scaling operations, securing strategic partnerships, and building sustainable ecosystem networks are key to translating Healix's clinical tech into tangible community outcomes.",
    institution: "Healix Technologies"
  },
  {
    name: "Debraghya Bag",
    role: "Chief Medical Officer",
    photo: "/debarghya.png",
    linkedin: "https://www.linkedin.com/company/quick-healix/",
    quote: "Precision medicine starts with precise data engineering. Ensuring scientific credibility, medical correctness, and healthcare system reliability is not a post-hoc check—it is built into every telemetry model we run at Healix.",
    institution: "AIIMS New Delhi"
  },
  {
    name: "Kaveri Gupta",
    role: "Associate COO",
    photo: "/member_kaveri.png",
    linkedin: "https://www.linkedin.com/company/quick-healix/",
    quote: "Operational efficiency and strategic alignment are the backbones of healthcare innovation. We build robust workflows that allow clinical teams, engineers, and partners to execute our vision with speed and safety.",
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
  // Index 0: Row 1 - Card 1 (Swaranjali Sonje) [category: academic]
  {
    name: "Swaranjali Sonje",
    designation: "Biomedical Engineering",
    institution: "IIT Delhi",
    expertise: "Biosensors & telemetry interface synchronization",
    category: "academic",
    photo: "/mentor_swaranjali.jpg",
    linkedin: "https://www.linkedin.com/company/quick-healix/"
  },
  // Index 1: Row 2 - Card 1 (Dr. Samir K Kalra) [category: clinical]
  {
    name: "Dr. Samir K Kalra",
    designation: "Senior Neuro Surgeon",
    institution: "Shri Ganga Ram Hospital",
    expertise: "Edge clinical safety telemetry integration",
    category: "clinical",
    photo: "/mentor_samir.png",
    linkedin: "https://www.linkedin.com/company/quick-healix/"
  },
  // Index 2: Row 1 - Card 2 (Bristi Saha) [category: academic]
  {
    name: "Bristi Saha",
    designation: "Cognitive Science Researcher",
    institution: "IIT Delhi",
    expertise: "Cognitive model telemetry & deep learning studies",
    category: "academic",
    photo: "/mentor_bristi.jpg",
    linkedin: "https://www.linkedin.com/company/quick-healix/"
  },
  // Index 3: Row 2 - Card 2 (Dr. Simran Kauts) [category: research]
  {
    name: "Dr. Simran Kauts",
    designation: "PhD In Medical Science",
    institution: "AIIMS Delhi",
    expertise: "Molecular pathology & predictive diagnostic models",
    category: "research",
    photo: "/mentor_simran.jpg",
    linkedin: "https://www.linkedin.com/company/quick-healix/"
  },
  // Index 4: Row 1 - Card 3 (Dr. Suresh Bangla) [category: clinical]
  {
    name: "Dr. Suresh Bangla",
    designation: "Resident of Community Medicine",
    institution: "AIIMS Delhi",
    expertise: "Rural health outreach diagnostics & tracking",
    category: "clinical",
    photo: "/mentor_suresh.jpg",
    linkedin: "https://www.linkedin.com/company/quick-healix/"
  },
  // Index 5: Row 2 - Card 3 (Dr. Swati Bishnoi) [category: research]
  {
    name: "Dr. Swati Bishnoi",
    designation: "PhD Scientist",
    institution: "IIT Delhi",
    expertise: "Biomaterials, CRISPR drives & genetic assays",
    category: "research",
    photo: "/mentor_swati.png",
    linkedin: "https://www.linkedin.com/company/quick-healix/"
  },
  // Index 6: Row 1 - Card 4 (Afsha Mirza Faisal) [category: industry]
  {
    name: "Afsha Mirza Faisal",
    designation: "Business Mentor",
    institution: "Healix Technologies",
    expertise: "Medical technology incubation & growth strategy",
    category: "industry",
    photo: "/mentor_afsha.png",
    linkedin: "https://www.linkedin.com/company/quick-healix/"
  },
  // Index 7: Row 2 - Card 4 (Dr. Nafrasha Khan) [category: clinical]
  {
    name: "Dr. Nafrasha Khan",
    designation: "PhD In Medical Science",
    institution: "AIIMS Delhi",
    expertise: "Pharmacological telemetry & safety protocols",
    category: "clinical",
    photo: "/mentor_nafrasha.png",
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
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = target;
    if (start === end) return;

    const totalMilliseconds = duration * 1000;
    const incrementTime = Math.max(10, Math.abs(Math.floor(totalMilliseconds / end)));
    let timeoutId: NodeJS.Timeout | null = null;

    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === end) {
        clearInterval(timer);
        // Pause for 4 seconds, then reset and trigger loop again
        timeoutId = setTimeout(() => {
          setCount(0);
          setResetKey((prev) => prev + 1);
        }, 4000);
      }
    }, incrementTime);

    return () => {
      clearInterval(timer);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [target, duration, resetKey]);

  return <span>{count}</span>;
}

const STATIC_BRANDS = [
  {
    id: "avennix",
    name: "Lupens & Co.",
    role: "Clinical Research & Digital Care",
    desc: "Developing indigenous digital twin software pipelines and therapeutics networks to standardize clinical trial metrics across leading institutional networks.",
    logoText: "LUPENS",
    color: "#3b82f6",
    accent: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    icon_name: "Shield",
    logo_url: "/lupens/lupens_logo.png"
  },
  {
    id: "shesecure",
    name: "Belongs",
    role: "Women Travel & Community Safety",
    desc: "Low-latency telemetry tracking, encrypted hardware beacons, and one-tap emergency SOS broadcasts connected to localized responder networks.",
    logoText: "BELONG",
    color: "#ef4444",
    accent: "text-red-500 bg-red-500/10 border-red-500/20",
    icon_name: "Heart",
    logo_url: "/belong_logo.png"
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
];

const DEFAULT_FOUNDERS = [
  {
    id: "f1",
    name: "Avnish",
    role: "Founder & CEO",
    quote: "Precision health data infrastructure is the foundation of modern clinical safety and AI diagnostics. At Healix, we are commoditizing the complex engineering required to unify fragmented health datasets so innovators can build clinical products at scale.",
    photo_url: "/founder_avnish.jpg",
    display_order: 0,
    active: true
  },
  {
    id: "f2",
    name: "Debraghya Bag",
    role: "Co-Founder & Chief Medical Officer (CMO)",
    quote: "Precision medicine starts with precise data engineering. Ensuring scientific credibility, medical correctness, and healthcare system reliability is not a post-hoc check—it is built into every telemetry model we run at Healix.",
    photo_url: "/debarghya.png",
    display_order: 1,
    active: true
  },
  {
    id: "f3",
    name: "Divya Pasam",
    role: "COO",
    quote: "Reliability is not a feature; it is the core foundation. Scaling operations, securing strategic partnerships, and building sustainable ecosystem networks are key to translating Healix's clinical tech into tangible community outcomes.",
    photo_url: "/coo_divya.png",
    display_order: 2,
    active: true
  },
  {
    id: "f4",
    name: "Kaveri Gupta",
    role: "Associate COO",
    quote: "Operational efficiency and strategic alignment are the backbones of healthcare innovation. We build robust workflows that allow clinical teams, engineers, and partners to execute our vision with speed and safety.",
    photo_url: "/member_kaveri.png",
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
          <img src={photo} alt={advisor.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" loading="lazy" decoding="async" />
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
            loading="lazy"
            decoding="async"
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
const PAST_EVENT_ROW_1 = [
  { src: "/reel-1-thumb.webp", alt: "Systems Architecture Onsite Workshop", tag: "Academy Workshop" },
  { src: "/pipeline-labs.png", alt: "BioLabs Hardware Testing Panel", tag: "BioLabs Panel" },
  { src: "/founder-photo-1.jpg", alt: "Healix Foundation Inaugural Meeting", tag: "Inaugural Meet" },
  { src: "/hsf-banner-collage.png", alt: "Student Developers Collaborative Hackathon", tag: "Collaboration Hack" },
  { src: "/shesecure-hero.png", alt: "Women in STEM Cybersecurity Panel", tag: "SheSecure Session" },
  { src: "/pipeline-doc.png", alt: "Healix Documentation & Research Symposium", tag: "Research Symposium" },
];

const PAST_EVENT_ROW_2 = [
  { src: "/reel-2-thumb.webp", alt: "Healix Clinical Mentorship Program Launch", tag: "Mentorship Launch" },
  { src: "/pipeline-meds.png", alt: "Explainable AI Diagnostics Demonstration", tag: "AI Demo" },
  { src: "/founder-photo-2.jpg", alt: "Annual Board of Advisors Review", tag: "Annual Board Review" },
  { src: "/reel-3-thumb.webp", alt: "Distributed Audio Failsafe Telemetry Lab", tag: "Telemetry Lab" },
  { src: "/reel-4-thumb.webp", alt: "Systems Architecture Coding Bootcamp", tag: "Coding Bootcamp" },
  { src: "/founder-photo-3.jpg", alt: "Advisory Council Roundtable Discussion", tag: "Roundtable Discussion" },
];

function FounderVisionTypewriter({ text }: { text: string }) {
  const [displayText, setDisplayText] = useState("");
  const [index, setIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const typingSpeed = 30;
    const deletingSpeed = 10;
    const pauseDuration = 4000;

    if (!isDeleting && index < text.length) {
      timer = setTimeout(() => {
        setDisplayText((prev) => prev + text.charAt(index));
        setIndex((prev) => prev + 1);
      }, typingSpeed);
    } else if (isDeleting && index > 0) {
      timer = setTimeout(() => {
        setDisplayText((prev) => prev.slice(0, -1));
        setIndex((prev) => prev - 1);
      }, deletingSpeed);
    } else if (!isDeleting && index === text.length) {
      timer = setTimeout(() => {
        setIsDeleting(true);
      }, pauseDuration);
    } else if (isDeleting && index === 0) {
      setIsDeleting(false);
    }

    return () => clearTimeout(timer);
  }, [index, isDeleting, text]);

  return (
    <span>
      &ldquo;{displayText}
      <span className="inline-block w-[3px] h-[1em] bg-[#ea580c] align-middle ml-1 animate-[pulse_1s_infinite] shadow-[0_0_8px_#ea580c]" />
      &rdquo;
    </span>
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
  const [liveFeed, setLiveFeed] = useState<{
    tag: string;
    title: string;
    subtitle: string;
    image_url: string;
  }>({
    tag: "Live Session • Healix Academy",
    title: "Interactive Research & learning Discussion in Progress",
    subtitle: "Healix main auditorium / Session ID: HSF-ACAD-2026",
    image_url: "/academy-classroom.jpg"
  });

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

  useEffect(() => {
    const supabase = createClient();

    // Fetch all homepage data in parallel to eliminate waterfall blocking
    const fetchAll = async () => {
      await Promise.allSettled([
        // Reels
        supabase.from("community_reels").select("*").eq("is_active", true).order("created_at", { ascending: false }).then(({ data }) => {
          if (data && data.length > 0) setReels(data);
          else setReels([
            { id: 1, title: "Emergency SOS Response Test", user_handle: "@sarah_j", thumbnail_url: "/reel-1-thumb.webp", video_url: "https://www.w3schools.com/html/mov_bbb.mp4" },
            { id: 2, title: "Healix AI Symptom Checker Review", user_handle: "@marcus_tech", thumbnail_url: "/reel-2-thumb.webp", video_url: "https://www.w3schools.com/html/mov_bbb.mp4" },
            { id: 3, title: "Night Travel with HSF System", user_handle: "@priya_travels", thumbnail_url: "/reel-3-thumb.webp", video_url: "https://www.w3schools.com/html/mov_bbb.mp4" },
            { id: 4, title: "BioLabs Student Tour", user_handle: "@uni_science", thumbnail_url: "/reel-4-thumb.webp", video_url: "https://www.w3schools.com/html/mov_bbb.mp4" },
          ]);
        }),

        // Podcasts
        fetch("/api/podcasts").then(r => r.ok ? r.json() : []).then(data => {
          if (Array.isArray(data)) {
            const real = data.filter((p: any) => p.youtube_url && !p.youtube_url.includes("dQw4w9WgXcQ"));
            setPodcasts(real);
          }
        }).catch(() => {}),

        // Brands
        fetch("/api/brands").then(r => r.ok ? r.json() : []).then(data => {
          if (Array.isArray(data) && data.length > 0) setBrands(data);
        }).catch(() => {}),

        // Founders
        fetch("/api/founders").then(r => r.ok ? r.json() : []).then(data => {
          if (Array.isArray(data) && data.length > 0) setFounders(data);
        }).catch(() => {}),

        // Mentors
        fetch("/api/mentors").then(r => r.ok ? r.json() : []).then(data => {
          if (Array.isArray(data)) setDbMentors(data);
        }).catch(() => {}),

        // Events — include rows where is_active is true OR null (not explicitly hidden)
        supabase.from("biolab_events").select("*").neq("is_active", false).order("start_date", { ascending: true }).limit(3).then(({ data }) => {
          if (data && data.length > 0) {
            const mapped = data.map(e => {
              let speaker = "Research Fellow";
              let register_url = "";
              try {
                if (e.description && e.description.startsWith("{") && e.description.endsWith("}")) {
                  const parsed = JSON.parse(e.description);
                  speaker = parsed.speaker || speaker;
                  register_url = parsed.register_url || "";
                }
              } catch (err) {}
              const d = new Date(e.start_date);
              const formattedDate = d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
              return {
                id: e.id,
                title: e.title,
                speaker,
                date: formattedDate,
                register_url,
                // Carry the actual event banner image from DB
                image_url: e.image_url || "",
              };
            });
            setUpcomingEvents(mapped);
          }
        }),

        // Live Feed
        fetch("/api/academy/live-feed").then(r => r.ok ? r.json() : null).then(data => {
          if (data && !data.error) setLiveFeed(data);
        }).catch(() => {}),
      ]);
    };

    fetchAll();
  }, []);

  useEffect(() => {
    if (brands.length === 0) return;
    const timer = setInterval(() => {
      setActiveBrandIndex((prev) => (prev + 1) % brands.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [brands.length]);

  useEffect(() => {
    if (displayTeam.length <= 1) return;
    const timer = setInterval(() => {
      setActiveFounderIndex((prev) => (prev + 1) % displayTeam.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [displayTeam.length]);

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

  // displayTeam moved to top of component to prevent TDZ ReferenceError

  // Map dynamic advisors (mentors) from database
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
  const sourceAdvisors = dbMentors.length > 0 ? dbMentors.map(normalizeDbMentor) : DEFAULT_ADVISORS;

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
      <div className="w-full" data-tour="hero">
        <HeroCarousel />
      </div>

      {/* 2. People Behind Healix */}
      <section id="leadership" className="py-24 bg-white border-b border-zinc-100 relative">
        <div className="max-w-[94%] mx-auto">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <p className="text-[10px] font-mono text-[#ea580c] uppercase tracking-widest font-bold mb-3">Core Leadership &amp; Network</p>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-zinc-950 font-mono">
              People Behind Healix
            </h2>
            <div className="w-16 h-1 bg-[#ea580c] mx-auto mt-4 mb-5" />
            <p className="text-zinc-500 text-sm md:text-base leading-relaxed">
              An interdisciplinary network of clinicians, researchers, engineers, psychologists, and innovators.
            </p>
          </div>

          {/* Slideshow panel matching the curve-cut photo style — auto cycles */}
          <div className="max-w-7xl mx-auto w-full relative overflow-hidden bg-white">
            <div className="grid md:grid-cols-[1fr_320px] gap-8 md:gap-12 items-center">

              {/* LEFT — Letter content with slide/fade animation */}
              <div className="py-6 pr-0 md:pr-12 min-h-[440px] flex flex-col justify-between relative">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeFounderIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                    className="flex-1 flex flex-col justify-between"
                  >
                    <div>
                      {/* Heading */}
                      <p className="text-xs text-zinc-400 uppercase tracking-widest font-mono mb-1">A message from</p>
                      <h3 className="text-2xl md:text-3xl font-black text-zinc-950 leading-tight mb-1">
                        Our <span className="text-[#ea580c]">{(displayTeam[activeFounderIndex % (displayTeam.length || 1)] || TEAM_MEMBERS[0]).role?.split(' ').slice(-2).join(' ') || 'Leader'}</span>
                      </h3>
                      <p className="text-sm text-zinc-500 mb-8 italic">Leading with a vision and compassion</p>

                      {/* Body */}
                      <div className="text-sm text-zinc-700 leading-[1.85] space-y-4 font-sans max-w-xl">
                        <p>{(displayTeam[activeFounderIndex % (displayTeam.length || 1)] || TEAM_MEMBERS[0]).quote || 'We are driven by a singular mission to make high-quality healthcare understandable, accessible, and affordable for millions across India.'}</p>
                        <p>We are proud to partner with institutions — both established and emerging — that share our passion for making a meaningful impact. Together, we are transforming lives by delivering exceptional healthcare services that drive positive change.</p>
                      </div>
                    </div>

                    {/* Signature */}
                    <div className="mt-10 text-sm text-zinc-700">
                      <p>Warm regards,</p>
                      <p className="font-bold text-zinc-950 mt-0.5">{(displayTeam[activeFounderIndex % (displayTeam.length || 1)] || TEAM_MEMBERS[0]).name}</p>
                      <p className="text-[#ea580c] font-semibold text-xs uppercase tracking-wide">{(displayTeam[activeFounderIndex % (displayTeam.length || 1)] || TEAM_MEMBERS[0]).role} at {(displayTeam[activeFounderIndex % (displayTeam.length || 1)] || TEAM_MEMBERS[0]).institution}</p>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Persistent Pagination Indicator / Navigation Dots */}
                <div className="flex gap-2.5 mt-8 justify-start z-30">
                  {displayTeam.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveFounderIndex(idx)}
                      className={`h-1.5 transition-all duration-300 rounded-full ${
                        activeFounderIndex === idx ? 'w-6 bg-[#ea580c]' : 'w-1.5 bg-zinc-200 hover:bg-zinc-400'
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>

              {/* RIGHT — Photo with curved wave and peach blob */}
              <div className="hidden md:flex flex-col bg-white relative overflow-hidden min-h-[440px] w-[320px]">
                {/* Coral blob — upper-right behind photo */}
                <div className="absolute top-8 right-0 w-64 h-64 opacity-90 pointer-events-none z-0">
                  <svg viewBox="0 0 200 200" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M 50,150 C 10,130 15,70 45,40 C 75,10 130,5 160,35 C 190,65 185,120 170,145 C 150,175 100,185 80,180 C 60,175 55,160 50,150 Z"
                      fill="#f4a58a"
                    />
                  </svg>
                </div>

                {/* Photo — full bleed, object-cover centered on face */}
                <div className="absolute inset-0 z-10 overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeFounderIndex}
                      initial={{ opacity: 0, scale: 1.04 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.97 }}
                      transition={{ duration: 0.45, ease: "easeInOut" }}
                      className="w-full h-full"
                    >
                      {(displayTeam[activeFounderIndex % (displayTeam.length || 1)] || TEAM_MEMBERS[0]).photo ? (
                        <img
                          src={(displayTeam[activeFounderIndex % (displayTeam.length || 1)] || TEAM_MEMBERS[0]).photo}
                          alt={(displayTeam[activeFounderIndex % (displayTeam.length || 1)] || TEAM_MEMBERS[0]).name}
                          className="w-full h-full object-cover object-top select-none"
                          loading="lazy"
                          decoding="async"
                        />
                      ) : (
                        <div className="w-full h-full bg-zinc-100 flex items-center justify-center text-5xl font-black text-[#ea580c] uppercase">
                          {(displayTeam[activeFounderIndex % (displayTeam.length || 1)] || TEAM_MEMBERS[0]).name?.[0]}
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* White curved wave mask at the bottom */}
                <div className="absolute bottom-0 left-0 w-full h-[150px] z-20 pointer-events-none select-none">
                  <svg
                    viewBox="0 0 320 150"
                    className="w-full h-full block"
                    preserveAspectRatio="none"
                    fill="white"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M 0 110 C 100 130, 200 80, 320 40 L 320 150 L 0 150 Z" />
                  </svg>
                </div>

                {/* Name + Title overlay at bottom-left */}
                <div className="absolute bottom-4 left-4 right-4 z-30 pointer-events-auto bg-white/95 backdrop-blur-sm border border-zinc-200/60 p-4 rounded-xl shadow-lg">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeFounderIndex}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.35 }}
                    >
                      <p className="text-zinc-950 font-extrabold text-base leading-tight tracking-tight">{(displayTeam[activeFounderIndex % (displayTeam.length || 1)] || TEAM_MEMBERS[0]).name}</p>
                      <p className="text-[#ea580c] text-[10px] font-mono uppercase tracking-widest mt-1.5 font-bold">{(displayTeam[activeFounderIndex % (displayTeam.length || 1)] || TEAM_MEMBERS[0]).role}</p>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

            </div>
          </div>

          <div className="text-center mt-10">
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
      <section className="bg-zinc-50 text-zinc-900 py-24 px-6 sm:px-8 border-y border-zinc-200 relative overflow-hidden">
        {/* Grid backdrop */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.015)_1px,transparent_1px)] bg-[size:35px_35px] pointer-events-none" />
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-[#ea580c]/3 rounded-full blur-[120px] pointer-events-none -translate-y-1/2" />

        <div className="max-w-[94%] mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 xl:gap-24 items-center">

            {/* LEFT: Content */}
            <div>
              <p className="text-[10px] font-mono text-[#ea580c] uppercase tracking-widest font-bold mb-4">Institutional Scope</p>
              <h2 className="text-4xl md:text-5xl xl:text-6xl font-black uppercase tracking-tight font-mono mb-3 leading-none text-zinc-950">
                Healix<br /><span className="text-[#ea580c]">Network</span>
              </h2>
              <div className="w-14 h-[3px] bg-[#ea580c] mb-6" />
              <p className="text-zinc-650 text-sm leading-relaxed mb-10 max-w-md">
                A growing interdisciplinary ecosystem of clinicians, researchers, engineers, psychologists, and innovators spanning top institutions across India.
              </p>

              {/* Stats Grid 3-col */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-10">
                {[
                  { label: "AIIMS Contributors", value: 15, suffix: "+" },
                  { label: "Clinical Advisors", value: 25, suffix: "+" },
                  { label: "Research Associates", value: 40, suffix: "+" },
                  { label: "Biomedical Researchers", value: 30, suffix: "+" },
                  { label: "Psychology Professionals", value: 20, suffix: "+" },
                  { label: "Innovation Programs", value: 8, suffix: "" },
                  { label: "Healthcare Initiatives", value: 12, suffix: "" },
                ].map((stat, i) => (
                  <div key={i} className="p-4 border border-zinc-200 bg-white/70 hover:border-[#ea580c]/50 hover:bg-white hover:shadow-sm transition-all duration-300 group relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#ea580c]/0 group-hover:from-[#ea580c]/5 to-transparent transition-all duration-500" />
                    <p className="text-2xl font-black text-[#ea580c] font-mono tracking-tight relative z-10 group-hover:scale-105 transition-transform duration-300 inline-block">
                      <Counter target={stat.value} />{stat.suffix}
                    </p>
                    <p className="text-[9px] text-zinc-550 font-mono font-bold uppercase tracking-widest mt-1 leading-snug relative z-10">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex gap-4 flex-wrap">
                <Link href="/biolabs" className="inline-flex items-center gap-2 px-6 py-3 bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-[0_0_24px_rgba(234,88,12,0.25)] hover:shadow-[0_0_36px_rgba(234,88,12,0.4)]">
                  Explore BioLabs <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link href="/about" className="inline-flex items-center gap-2 px-6 py-3 border border-zinc-300 bg-white hover:border-[#ea580c] hover:text-[#ea580c] text-zinc-700 hover:bg-zinc-50 text-xs font-bold uppercase tracking-wider transition-all duration-300">
                  Meet Our Team <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* RIGHT: Globe Illustration */}
            <div className="hidden lg:flex items-center justify-center relative min-h-[480px]">
              {/* Ambient glow */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[380px] h-[380px] rounded-full bg-[#ea580c]/5 blur-[90px]" />
              </div>
              {/* Decorative rings */}
              <div className="absolute w-[480px] h-[480px] border border-zinc-200/80 rounded-full animate-[spin_40s_linear_infinite]" />
              <div className="absolute w-[380px] h-[380px] border border-[#ea580c]/10 rounded-full animate-[spin_30s_linear_infinite_reverse]" />

              {/* Main illustration */}
              <div className="relative z-10">
                <img
                  src="/network-illustration-light.png"
                  alt="Healix Network Ecosystem Illustration"
                  className="w-[440px] xl:w-[500px] object-contain select-none"
                  style={{ filter: "drop-shadow(0 0 28px rgba(234,88,12,0.18))" }}
                  loading="lazy"
                  decoding="async"
                />

                {/* Floating badge — top right */}
                <div className="absolute top-8 -right-4 bg-white/95 backdrop-blur border border-zinc-200 px-3 py-2 rounded-lg shadow-md">
                  <p className="text-[8px] font-mono text-[#ea580c] uppercase tracking-widest font-bold">Live Network</p>
                  <p className="text-sm font-black text-zinc-900 font-mono">150+ Members</p>
                </div>

                {/* Floating badge — top left */}
                <div className="absolute top-28 -left-4 bg-white/95 backdrop-blur border border-zinc-200 px-3 py-2 rounded-lg shadow-md">
                  <p className="text-[8px] font-mono text-[#ea580c] uppercase tracking-widest font-bold">Institutions</p>
                  <p className="text-sm font-black text-zinc-900 font-mono">AIIMS · IIT · HSF</p>
                </div>

                {/* Pulse indicator */}
                <span className="absolute top-5 right-12 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ea580c] opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#ea580c]" />
                </span>
              </div>
            </div>

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
            const allAdvisors = sourceAdvisors.map((member: any) => {
              const cat = CATEGORY_CONFIG.find(c => c.key === member.category) || CATEGORY_CONFIG[0];
              return { ...member, categoryLabel: cat.label, categoryColor: cat.color };
            });

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
                  {(() => {
                    const founder = displayTeam.length > 0 ? displayTeam[0] : TEAM_MEMBERS[0];
                    return founder?.photo ? (
                      <img
                        src={founder.photo}
                        alt={founder.name || "Avnish Verma"}
                        className="w-full h-full object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-700"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <div className="w-full h-full bg-zinc-200 flex items-center justify-center">
                        <span className="text-7xl font-black text-[#ea580c] uppercase select-none">
                          {(founder?.name || "A")[0]}
                        </span>
                      </div>
                    );
                  })()}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6">
                    <p className="text-xs font-mono text-[#ea580c] uppercase font-bold tracking-widest">Founder &amp; CEO</p>
                    <h3 className="text-xl font-black text-white font-mono uppercase tracking-tight mt-1">
                      {displayTeam.length > 0 ? displayTeam[0].name : "Avnish Verma"}
                    </h3>
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
                <p className="text-zinc-700 text-sm md:text-base leading-relaxed italic font-medium font-sans min-h-[7.5rem] md:min-h-[4.5rem]">
                  <FounderVisionTypewriter text="Healix Technologies was founded to bridge the gap between healthcare, research, technology, and education by building an ecosystem where clinicians, researchers, engineers, psychologists, and innovators can collaborate to solve real-world healthcare challenges." />
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

          <div className="flex flex-col gap-8 md:gap-0 max-w-6xl mx-auto">
            {(brands.length > 0 ? brands : [
              {
                name: "BioLabs Genomics",
                role: "Research • Innovation • Mentorship",
                description: "Building high-performance genomic sequence modeling tools, CRISPR outcome validation protocols, and elite research fellowships.",
                logo_url: "/biolabs-logo-web.png",
                href: "/biolabs",
                tag: "GENOMICS & RESEARCH"
              },
              {
                name: "Belongs",
                role: "Mental Health • Community Impact • Education",
                description: "Empowering community health with active safety networks, Project Suraksha coordinates, and inclusive mental health support.",
                logo_url: "/belong_logo.png",
                href: "/shesecure",
                tag: "COMMUNITY HEALTH & SAFETY"
              }
            ]).map((eco: any, i: number) => {
              const isEven = i % 2 === 0;
              const title = eco.name || eco.title || "";
              const subtitle = eco.role || eco.subtitle || "";
              const desc = eco.description || eco.desc || "";
              const logo = eco.logo_url || eco.logo || "";
              const href = eco.href || eco.link_url || "/";
              const tag = eco.tag || eco.category || eco.accent_label || "";
              return (
                <div 
                  key={eco.id || i} 
                  className={`group flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-center justify-between gap-12 md:gap-24 py-16 border-b border-zinc-200/60 last:border-b-0 max-w-5xl mx-auto w-full`}
                >
                  {/* Logo Container */}
                  <div className="relative shrink-0 select-none">
                    <div className="w-44 h-44 md:w-52 md:h-52 bg-white border border-zinc-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.01)] rounded flex items-center justify-center p-6 transition-all duration-300 group-hover:shadow-[0_10px_30px_rgba(234,88,12,0.06)] group-hover:border-zinc-300">
                      {logo ? (
                        <img src={logo} alt={`${title} logo`} className="w-full h-full object-contain filter group-hover:scale-105 transition-transform duration-500 ease-out" loading="lazy" decoding="async" />
                      ) : (
                        <span className="text-3xl font-black text-zinc-300 uppercase font-mono">{title[0]}</span>
                      )}
                    </div>
                    
                    {/* Animated Corner Brackets */}
                    <div className="absolute -top-1.5 -left-1.5 w-5 h-5 border-t-2 border-l-2 border-zinc-300 transition-all duration-300 ease-out group-hover:-top-3 group-hover:-left-3 group-hover:w-8 group-hover:h-8 group-hover:border-[#ea580c] group-hover:drop-shadow-[0_0_3px_rgba(234,88,12,0.4)]" />
                    <div className="absolute -bottom-1.5 -right-1.5 w-5 h-5 border-b-2 border-r-2 border-zinc-300 transition-all duration-300 ease-out group-hover:-bottom-3 group-hover:-right-3 group-hover:w-8 group-hover:h-8 group-hover:border-[#ea580c] group-hover:drop-shadow-[0_0_3px_rgba(234,88,12,0.4)]" />
                  </div>

                  {/* Information Column */}
                  <div className="flex-1 flex flex-col justify-center text-center md:text-left">
                    <div>
                      {tag && (
                        <span className="text-[9px] font-mono text-[#ea580c] bg-[#ea580c]/5 border border-[#ea580c]/20 px-2.5 py-0.5 font-bold uppercase tracking-wider inline-block mb-4">
                          {tag}
                        </span>
                      )}
                      
                      <div className="mb-2">
                        <h3 className="text-2xl md:text-3xl font-black text-zinc-950 uppercase font-mono tracking-tight transition-colors duration-300 group-hover:text-[#ea580c] relative inline-block">
                          {title}
                          <span className="absolute left-0 bottom-[-6px] w-full h-[1px] bg-zinc-200 transition-all duration-300 group-hover:bg-[#ea580c] group-hover:h-[2px]" />
                        </h3>
                      </div>
                      
                      {subtitle && (
                        <p className="text-xs font-mono text-zinc-500 uppercase tracking-wider font-semibold mt-3 mb-4">
                          {subtitle}
                        </p>
                      )}
                      
                      <p className="text-zinc-650 text-sm md:text-base leading-relaxed max-w-xl mx-auto md:mx-0">
                        {desc}
                      </p>
                    </div>

                    <div className="mt-8">
                      <Link 
                        href={href} 
                        className="inline-flex items-center gap-2 px-6 py-2.5 border border-zinc-300 hover:border-[#ea580c] hover:bg-[#ea580c]/5 text-zinc-800 hover:text-[#ea580c] font-mono text-xs uppercase tracking-widest font-bold transition-all duration-300 shadow-sm"
                      >
                        Explore <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. Current Projects */}
      <section id="initiatives" className="pt-24 pb-36 bg-white border-b border-zinc-100 relative">
        <div className="max-w-[94%] mx-auto">
          <div className="text-center mb-20 max-w-2xl mx-auto">
            <p className="text-[10px] font-mono text-[#ea580c] uppercase tracking-widest font-bold mb-3">Active Pursuits</p>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-zinc-950 font-mono">Current Projects</h2>
            <div className="w-16 h-1 bg-[#ea580c] mx-auto mt-4 mb-5" />
            <p className="text-zinc-650 text-sm leading-relaxed">
              Tracking our current scientific and biomedical developments undergoing institutional trials or pilot testing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12 max-w-7xl mx-auto">
            {[
              {
                title: "Project Suraksha",
                desc: "Developing low-latency travel safety telemetry tracking, encrypted hardware beacons, and emergency SOS networks.",
                status: "DEVELOPING / FIELD TESTING",
                color: "text-amber-600 border-amber-600/20 bg-amber-500/5",
                accentBorder: "border-amber-600",
                href: "/shesecure"
              },
              {
                title: "BioLabs Research Fellowship",
                desc: "Providing research stipends and laboratory access for graduate researchers building sequence modeling models.",
                status: "APPLICATIONS OPEN",
                color: "text-emerald-600 border-emerald-600/20 bg-emerald-500/5",
                accentBorder: "border-emerald-600",
                href: "/biolabs"
              },
              {
                title: "Healthcare Innovation Programs",
                desc: "Connecting engineers, psychologists, and clinicians to develop and test pilot systems in real-world environments.",
                status: "IN PROGRESS",
                color: "text-blue-600 border-blue-600/20 bg-blue-500/5",
                accentBorder: "border-blue-600",
                href: "/contact"
              },
              {
                title: "AI Healthcare Initiatives",
                desc: "Deploying deep learning triage models to remote clinics to assist local caregivers with diagnostic classifications.",
                status: "BETA TESTING",
                color: "text-purple-600 border-purple-600/20 bg-purple-500/5",
                accentBorder: "border-purple-600",
                href: "#"
              }
            ].map((init, i) => {
              // Alternating staggered translation offsets for visual wave effect on desktop
              const staggerClass = i % 2 === 0 ? "md:-translate-y-4" : "md:translate-y-8";

              return (
                <div 
                  key={i} 
                  className={`relative group bg-zinc-50 border border-zinc-200 p-6 flex flex-col justify-between hover:border-zinc-950 transition-all duration-500 ease-out min-h-[240px] shadow-sm hover:shadow-md ${staggerClass}`}
                >
                  {/* Decorative Corner Brackets (slide inwards to hug the card on hover) */}
                  {/* Top-Left Bracket */}
                  <span className={`absolute -top-1.5 -left-1.5 w-6 h-6 border-t-2 border-l-2 ${init.accentBorder} opacity-60 group-hover:opacity-100 group-hover:top-0 group-hover:left-0 transition-all duration-300 pointer-events-none`} />
                  
                  {/* Bottom-Right Bracket */}
                  <span className={`absolute -bottom-1.5 -right-1.5 w-6 h-6 border-b-2 border-r-2 ${init.accentBorder} opacity-60 group-hover:opacity-100 group-hover:bottom-0 group-hover:right-0 transition-all duration-300 pointer-events-none`} />

                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <span className={`text-[8px] font-mono font-bold tracking-widest uppercase border px-2 py-0.5 ${init.color}`}>{init.status}</span>
                    </div>
                    <h3 className="font-extrabold text-sm text-zinc-950 font-mono uppercase tracking-tight leading-snug">{init.title}</h3>
                    <p className="text-xs text-zinc-650 leading-relaxed mt-4">{init.desc}</p>
                  </div>
                  <div className="mt-6">
                    <Link href={init.href} className="text-[10px] font-bold text-[#ea580c] hover:text-[#c2410c] font-mono uppercase tracking-wider flex items-center gap-1">
                      Learn More <ArrowRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              );
            })}
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
            {(() => {
                const displayEvents = (() => {
                  const DEFAULT_EVENTS = [
                    {
                      id: "def-1",
                      title: "Women Safety Awareness Session — Project Suraksha",
                      speaker: "Healix Technologies",
                      date: "06 Aug 2026",
                      image_url: "",
                      register_url: "mailto:gupta.kaveri@healix-technologies.com",
                    },
                    {
                      id: "def-2",
                      title: "Reel Making Competition 2026",
                      speaker: "Healix Technologies",
                      date: "05 Aug 2026",
                      image_url: "",
                      register_url: "mailto:gupta.kaveri@healix-technologies.com",
                    },
                    {
                      id: "def-3",
                      title: "Doctor's Day — Honoring the Lifesavers Among Us",
                      speaker: "Healix Technologies",
                      date: "01 Jul 2026",
                      image_url: "",
                      register_url: "",
                    }
                  ];
                  if (upcomingEvents.length === 0) return DEFAULT_EVENTS;
                  // Always show 3 cards — pad with defaults if DB has fewer than 3
                  const padded = [...upcomingEvents];
                  let defIdx = 0;
                  while (padded.length < 3) {
                    padded.push({ ...DEFAULT_EVENTS[defIdx % DEFAULT_EVENTS.length], id: `pad-${defIdx}` });
                    defIdx++;
                  }
                  return padded;
                })();

                return displayEvents.map((sem: any, idx: number) => {
                  // Use DB image_url if present, else fall back to keyword-matched static image
                  const titleLower = sem.title.toLowerCase();
                  const fallbackImage = titleLower.includes("suraksha") || titleLower.includes("safety")
                    ? "/event_suraksha.jpg"
                    : titleLower.includes("reel") || titleLower.includes("competition")
                    ? "/event_reel.jpg"
                    : titleLower.includes("doctor") || titleLower.includes("lifesavers")
                    ? "/event_doctors_day.png"
                    : idx === 0
                    ? "/event_suraksha.jpg"
                    : idx === 1
                    ? "/event_reel.jpg"
                    : "/event_doctors_day.png";
                  const eventImage = sem.image_url && sem.image_url.trim() !== "" ? sem.image_url : fallbackImage;

                return (
                  <div 
                    key={sem.id || idx} 
                    className="relative overflow-hidden w-full aspect-[4/5] group border border-zinc-200 shadow-sm bg-zinc-900"
                  >
                    {/* Cover Image (zooms in slightly on hover) */}
                    <img 
                      src={eventImage} 
                      alt={sem.title} 
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" 
                    />

                    {/* Dark Tint Overlay to preserve initial contrast */}
                    <div className="absolute inset-0 bg-black/15 group-hover:bg-black/35 transition-colors duration-500" />

                    {/* Help indicator pill (fades out on hover) */}
                    <div className="absolute bottom-4 right-4 bg-zinc-950/80 backdrop-blur-sm px-2.5 py-1 text-[8px] font-mono font-bold text-white uppercase tracking-widest border border-white/10 group-hover:opacity-0 transition-opacity duration-300">
                      Hover for Info
                    </div>

                    {/* Sliding Details Panel (slides in from the right) */}
                    <div 
                      className="absolute inset-y-0 right-0 w-[85%] sm:w-[78%] bg-zinc-950/95 backdrop-blur-md p-6 flex flex-col justify-between translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out border-l-2 border-[#ea580c] shadow-2xl z-10"
                    >
                      <div>
                        {/* Event Date */}
                        <div className="flex items-center gap-2 text-[#ea580c] mb-3">
                          <Calendar className="w-3.5 h-3.5" />
                          <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-orange-400">{sem.date}</span>
                        </div>
                        
                        {/* Event Title */}
                        <h3 className="text-xs font-black text-white uppercase font-mono tracking-tight leading-snug">
                          {sem.title}
                        </h3>

                        {/* Speaker info */}
                        <p className="text-[11px] text-zinc-400 mt-3 flex items-center gap-1.5 font-sans">
                          <span className="w-1.5 h-1.5 rounded-full bg-zinc-600 shrink-0" />
                          Speaker: <strong className="text-zinc-250 font-semibold">{sem.speaker}</strong>
                        </p>
                      </div>

                      {/* Footer Actions */}
                      <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
                        {sem.register_url ? (
                          <a 
                            href={sem.register_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] font-bold text-[#ea580c] hover:text-[#ff782c] font-mono uppercase tracking-widest flex items-center gap-1"
                          >
                            Register Now <ArrowRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1" />
                          </a>
                        ) : (
                          <Link 
                            href={`/events?search=${encodeURIComponent(sem.title)}`} 
                            className="text-[10px] font-bold text-[#ea580c] hover:text-[#ff782c] font-mono uppercase tracking-widest flex items-center gap-1"
                          >
                            Register Now <ArrowRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1" />
                          </Link>
                        )}
                        <span className="text-[8px] font-mono text-zinc-400 bg-white/5 px-2 py-0.5 uppercase border border-white/5">Academic Session</span>
                      </div>
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        </div>

          {/* Cinematic Full Bleed Past Events Photo Reel (Moved outside the restricted container) */}
          <div className="mt-16 relative py-12 bg-transparent w-full max-w-[99%] mx-auto px-4 md:px-6 overflow-visible">
            {/* Ambient Background Glows */}
            <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-[#0066ff]/5 rounded-full blur-[130px] pointer-events-none" />
            <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/5 rounded-full blur-[130px] pointer-events-none" />

            {/* Projected Screen Container (Cinematic Full Bleed) */}
            <div className="w-full relative z-10 flex justify-center items-center py-4">
              <div className="relative w-full max-w-7xl transition-all duration-500">
                {/* Floating inner wrapper */}
                <div className="animate-float relative aspect-[16/10] md:aspect-[21/9] rounded-2xl overflow-hidden shadow-[0_25px_70px_rgba(0,102,255,0.35)] border border-white/10 bg-zinc-950/40 backdrop-blur-sm group">
                  
                  {/* The Classroom Image */}
                  <img 
                    src={liveFeed.image_url} 
                    alt="Healix Academy Classroom" 
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-102" 
                  />
                  
                  {/* Cinematic lens flare / projection glare overlays */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#0066ff]/5 to-white/15 opacity-70 group-hover:opacity-90 transition-opacity pointer-events-none" />
                  
                  {/* Movie projection beam sweep / flicker overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0066ff]/0 via-[#0066ff]/8 to-[#0066ff]/0 animate-flicker pointer-events-none" />
                  
                  {/* Interactive hover glow frame */}
                  <div className="absolute inset-0 border border-white/20 group-hover:border-[#0066ff]/40 transition-colors duration-500 rounded-2xl pointer-events-none" />
                  
                  {/* Glowing corner brackets for cinematic camera frame look */}
                  <div className="absolute top-5 left-5 w-6 h-6 border-t-2 border-l-2 border-white/60 pointer-events-none" />
                  <div className="absolute top-5 right-5 w-6 h-6 border-t-2 border-r-2 border-white/60 pointer-events-none" />
                  <div className="absolute bottom-5 left-5 w-6 h-6 border-b-2 border-l-2 border-white/60 pointer-events-none" />
                  <div className="absolute bottom-5 right-5 w-6 h-6 border-b-2 border-r-2 border-white/60 pointer-events-none" />

                  {/* Rec indicator */}
                  <div className="absolute top-6 left-8 flex items-center gap-2 bg-black/70 px-3 py-1.5 rounded-md border border-white/15 pointer-events-none shadow-md">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-mono text-white tracking-widest uppercase font-bold">REC</span>
                  </div>

                  {/* Frame resolution label */}
                  <div className="absolute top-6 right-8 bg-black/70 px-3 py-1.5 rounded-md border border-white/15 pointer-events-none shadow-md">
                    <span className="text-[10px] font-mono text-zinc-300 tracking-wider font-semibold">4K UHD 23.976 fps</span>
                  </div>

                  {/* Bottom overlay with description */}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-6 md:p-10 pt-20 md:pt-32 text-left">
                    <p className="text-[10px] font-mono text-[#0066ff] font-bold uppercase tracking-widest mb-2 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0066ff] animate-ping" />
                      {liveFeed.tag}
                    </p>
                    <h4 className="text-white font-sans text-xl md:text-3xl lg:text-4xl font-extrabold leading-tight uppercase tracking-wider">
                      {liveFeed.title}
                    </h4>
                    <div className="flex items-center gap-1.5 text-zinc-400 font-mono text-[10px] md:text-xs mt-3 uppercase font-semibold">
                      <MapPin className="w-3.5 h-3.5 text-[#0066ff] shrink-0" />
                      <span>{liveFeed.subtitle}</span>
                    </div>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-[94%] mx-auto">
            <div className="text-center mt-12">
              <Link 
                href="/events" 
                className="inline-flex items-center gap-2 px-8 py-3 bg-zinc-950 hover:bg-[#ea580c] text-white text-xs font-bold uppercase tracking-wider transition-colors font-mono"
              >
                View All Seminars <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
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
                          <img src={pod.thumbnail_url} alt="" className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-300" loading="lazy" decoding="async" />
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
      <section className="bg-black text-white border-t border-zinc-900 relative overflow-hidden">
        {/* Grid backdrop */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none" />
        {/* Radial orange glow */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-orange-600/8 rounded-full blur-[160px] pointer-events-none" />
        {/* Bottom-right corner accent */}
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-orange-500/5 rounded-tl-full pointer-events-none" />

        <div className="max-w-[94%] mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-end min-h-[480px]">

            {/* LEFT: Text Content */}
            <div className="flex flex-col justify-center py-20 pr-0 lg:pr-16 space-y-8">
              {/* Tag */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-px bg-[#ea580c]" />
                <p className="text-[10px] font-mono text-[#ea580c] uppercase tracking-[0.3em] font-bold">Collaborative Venture</p>
              </div>

              {/* Headline */}
              <h2 className="text-4xl sm:text-5xl xl:text-6xl font-black uppercase tracking-tight leading-[1.0] font-mono text-white">
                Join India's<br />
                <span className="text-[#ea580c]">Next Generation</span><br />
                Healthcare<br />
                Innovation<br />
                Ecosystem
              </h2>

              {/* Body text */}
              <p className="text-sm text-zinc-400 leading-relaxed max-w-md">
                Whether you are an active clinician, a molecular researcher, a systems engineer, or an industry partner, we invite you to collaborate with us to develop healthcare safety systems at national scale.
              </p>

              {/* Stats row */}
              <div className="flex gap-8 pt-2 border-t border-white/5">
                {[
                  { val: "10+", label: "Research Domains" },
                  { val: "50+", label: "Expert Advisors" },
                  { val: "∞", label: "Impact Potential" },
                ].map(s => (
                  <div key={s.label}>
                    <p className="text-2xl font-black text-white font-mono">{s.val}</p>
                    <p className="text-[9px] text-zinc-500 font-mono uppercase tracking-widest mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-3 pt-2">
                <Link href="/biolabs" className="px-7 py-3.5 bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_24px_rgba(234,88,12,0.35)] hover:shadow-[0_0_36px_rgba(234,88,12,0.5)] font-mono flex items-center gap-2">
                  Apply for BioLabs <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link href="/contact" className="px-7 py-3.5 border border-white/20 hover:border-[#ea580c] hover:text-[#ea580c] text-white text-xs font-bold uppercase tracking-wider transition-all font-mono flex items-center gap-2">
                  Become a Mentor <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link href="/contact" className="px-7 py-3.5 bg-white/5 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-wider transition-all font-mono flex items-center gap-2">
                  Collaborate With Us <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* RIGHT: Illustration anchored to bottom-right */}
            <div className="hidden lg:flex items-end justify-end h-full relative">
              {/* Decorative ring behind illustration */}
              <div className="absolute bottom-12 right-8 w-80 h-80 border border-white/5 rounded-full" />
              <div className="absolute bottom-16 right-12 w-60 h-60 border border-[#ea580c]/10 rounded-full" />

              {/* Illustration */}
              <div className="relative z-10 self-end">
                <img
                  src="/collaboration-handshake.png"
                  alt="Collaboration - two professionals shaking hands"
                  className="w-[420px] xl:w-[500px] object-contain drop-shadow-2xl select-none"
                  style={{ filter: "drop-shadow(0 0 40px rgba(234,88,12,0.15))" }}
                  loading="lazy"
                  decoding="async"
                />
                {/* Floating badge */}
                <div className="absolute top-8 left-0 bg-zinc-900 border border-white/10 px-4 py-2.5 rounded-xl shadow-xl">
                  <p className="text-[9px] font-mono text-[#ea580c] uppercase tracking-widest font-bold">Partnership</p>
                  <p className="text-sm font-black text-white font-mono">Open to Collaborate</p>
                </div>
                {/* Spark dots */}
                <div className="absolute top-6 right-6 w-2 h-2 rounded-full bg-[#ea580c] animate-ping" />
                <div className="absolute top-10 right-2 w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
              </div>
            </div>

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

      {/* --- FOUNDER MESSAGE MODAL — Tata 1mg style two-column --- */}
      <AnimatePresence>
        {selectedFounderForMsg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() => setSelectedFounderForMsg(null)}
          >
            <motion.div
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 24, opacity: 0 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
              className="w-full max-w-4xl bg-white shadow-2xl relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close */}
              <button
                onClick={() => setSelectedFounderForMsg(null)}
                className="absolute top-4 right-4 z-10 p-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-500 hover:text-black transition-colors rounded-full"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="grid md:grid-cols-[1fr_300px]">

                {/* LEFT — Letter */}
                <div className="p-8 md:p-12">
                  {/* Heading */}
                  <p className="text-xs text-zinc-400 uppercase tracking-widest font-mono mb-1">A message from</p>
                  <h2 className="text-2xl md:text-3xl font-black text-zinc-950 leading-tight mb-1">
                    Our{' '}
                    <span className="text-[#ea580c]">{selectedFounderForMsg.role?.split(' ').slice(-2).join(' ') || 'Leader'}</span>
                  </h2>
                  <p className="text-sm text-zinc-500 mb-8 italic">Leading with a vision and compassion</p>

                  {/* Body */}
                  <div className="text-sm text-zinc-700 leading-[1.85] space-y-4 font-sans">
                    <p>{selectedFounderForMsg.quote || 'We are driven by a singular mission to make high-quality healthcare understandable, accessible, and affordable for millions across India.'}</p>
                    <p>We are proud to partner with institutions — both established and emerging — that share our passion for making a meaningful impact. Together, we are transforming lives by delivering exceptional healthcare services that drive positive change.</p>
                    <p>To our current and future collaborators — your trust in Healix is what inspires us. Together, we can empower communities and revolutionise healthcare accessibility for a healthier tomorrow.</p>
                  </div>

                  {/* Signature */}
                  <div className="mt-10 text-sm text-zinc-700">
                    <p>Warm regards,</p>
                    <p className="font-bold text-zinc-950 mt-0.5">{selectedFounderForMsg.name}</p>
                    <p className="text-[#ea580c] font-semibold text-xs uppercase tracking-wide">{selectedFounderForMsg.role}</p>
                  </div>
                </div>

                {/* RIGHT — Floating photo panel */}
                <div className="hidden md:flex flex-col bg-white relative overflow-hidden min-h-[420px]">
                  {/* Coral blob — upper-right behind photo */}
                  <div className="absolute top-8 right-0 w-64 h-64 opacity-90 pointer-events-none z-0">
                    <svg viewBox="0 0 200 200" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M 50,150 C 10,130 15,70 45,40 C 75,10 130,5 160,35 C 190,65 185,120 170,145 C 150,175 100,185 80,180 C 60,175 55,160 50,150 Z"
                        fill="#f4a58a"
                      />
                    </svg>
                  </div>

                  {/* Photo — full bleed object-cover, wave mask clips the bottom */}
                  <div className="absolute inset-0 z-10 overflow-hidden">
                    {(selectedFounderForMsg.photo || selectedFounderForMsg.photo_url) ? (
                      <img
                        src={selectedFounderForMsg.photo || selectedFounderForMsg.photo_url}
                        alt={selectedFounderForMsg.name}
                        className="w-full h-full object-cover object-top select-none"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <div className="w-44 h-52 bg-zinc-100 flex items-center justify-center text-3xl font-black text-[#ea580c] uppercase rounded-2xl border border-zinc-200 mr-8 mb-20 pointer-events-auto">
                        {selectedFounderForMsg.name?.[0]}
                      </div>
                    )}
                  </div>

                  {/* White curved wave mask at the bottom */}
                  <div className="absolute bottom-0 left-0 w-full h-[150px] z-20 pointer-events-none select-none">
                    <svg
                      viewBox="0 0 300 150"
                      className="w-full h-full block"
                      preserveAspectRatio="none"
                      fill="white"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M 0 110 C 90 130, 180 80, 300 40 L 300 150 L 0 150 Z" />
                    </svg>
                  </div>

                  {/* Name + Title overlay at bottom-left */}
                  <div className="absolute bottom-6 left-6 z-30 pointer-events-auto">
                    <p className="text-zinc-950 font-bold text-base leading-tight tracking-tight">{selectedFounderForMsg.name}</p>
                    <p className="text-zinc-500 text-xs mt-1 font-medium">{selectedFounderForMsg.role}</p>
                  </div>
                </div>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

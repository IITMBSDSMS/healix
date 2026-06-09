"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, FlaskConical, Rocket, Newspaper, Building2 } from "lucide-react";
import Image from "next/image";

import { createClient } from "@/utils/supabase/client";

const quickLinks = [
  { title: "RESEARCH", icon: FlaskConical, href: "/biolabs", bg: "bg-[#f5f5f5] text-black hover:bg-white" },
  { title: "STARTUPS", icon: Rocket, href: "/startups", bg: "bg-[#ea580c] text-white hover:bg-[#c2410c]" },
  { title: "NEWS", icon: Newspaper, href: "/news", bg: "bg-[#f5f5f5] text-black hover:bg-white" },
  { title: "GLOBAL NETWORK", icon: Building2, href: "/global-network", bg: "bg-[#ea580c] text-white hover:bg-[#c2410c]" },
];

const fallbackItems = [
  {
    id: "1",
    type: "image",
    title: "Building the Future of Care",
    subtitle: "Unifying predictive medical diagnostics and high-performance labs.",
    media_url: "/og-image.png",
  },
  {
    id: "2",
    type: "video",
    title: "AI Genomic Sequencing Pipeline",
    subtitle: "Next-generation research division and compute clusters.",
    media_url: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    id: "3",
    type: "image",
    title: "Project Suraksha Expansion",
    subtitle: "Securing the community with real-time IoT safety networks.",
    media_url: "/shesecure-hero.png",
  }
];

export function HeroCarousel() {
  const [carouselItems, setCarouselItems] = useState<any[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const { data, error } = await supabase
          .from("hero_banners")
          .select("*")
          .eq("is_active", true)
          .order("order_index", { ascending: true });

        if (error) {
          console.warn("Banners table not found or query error, using fallback:", error.message);
          setCarouselItems(fallbackItems);
        } else if (data && data.length > 0) {
          setCarouselItems(data);
        } else {
          setCarouselItems(fallbackItems);
        }
      } catch (error: any) {
        console.warn("Error fetching banners:", error?.message || error);
        setCarouselItems(fallbackItems); // Use fallback if DB is not set up yet
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  const nextSlide = () => {
    if (carouselItems.length === 0) return;
    setActiveIndex((prev) => (prev + 1) % carouselItems.length);
  };

  const prevSlide = () => {
    if (carouselItems.length === 0) return;
    setActiveIndex((prev) => (prev - 1 + carouselItems.length) % carouselItems.length);
  };

  useEffect(() => {
    if (isHovered || carouselItems.length <= 1) return;
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [isHovered, carouselItems.length]);

  if (loading) {
    return <div className="h-[80vh] min-h-[600px] w-full bg-[#050505] animate-pulse" />;
  }

  return (
    <div className="relative w-full overflow-hidden">
      {/* Full-width Carousel Area */}
      <div 
        className="relative h-[80vh] min-h-[600px] w-full group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            {activeIndex === 0 ? (
              <div className="absolute inset-0 bg-[#050505] flex items-center justify-center overflow-hidden">
                {/* Glowing Background Blobs */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-600/10 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />
                
                {/* DNA Double Helix Wave Animation */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden select-none opacity-20 lg:opacity-40 z-0">
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-full lg:w-[50%] h-[400px] flex items-center justify-center">
                    <svg viewBox="0 0 450 400" className="w-full h-full text-orange-500">
                      <defs>
                        <linearGradient id="dnaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#ea580c" />
                          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.2" />
                        </linearGradient>
                        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                          <feGaussianBlur stdDeviation="5" result="blur" />
                          <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                      </defs>
                      <g filter="url(#glow)">
                        {Array.from({ length: 15 }).map((_, i) => {
                          const x = 40 + i * 26;
                          const offset = i * 0.4;
                          return (
                            <g key={i}>
                              <line 
                                x1={x} 
                                y1={140 + Math.sin(offset) * 45} 
                                x2={x} 
                                y2={260 - Math.sin(offset) * 45} 
                                stroke="url(#dnaGrad)" 
                                strokeWidth="1.5" 
                                strokeDasharray="3 3"
                              >
                                <animate 
                                  attributeName="y1" 
                                  values={`${140 + Math.sin(offset) * 45};${260 - Math.sin(offset) * 45};${140 + Math.sin(offset) * 45}`} 
                                  dur="5s" 
                                  repeatCount="indefinite" 
                                />
                                <animate 
                                  attributeName="y2" 
                                  values={`${260 - Math.sin(offset) * 45};${140 + Math.sin(offset) * 45};${260 - Math.sin(offset) * 45}`} 
                                  dur="5s" 
                                  repeatCount="indefinite" 
                                />
                              </line>
                              <circle cx={x} cy={140 + Math.sin(offset) * 45} r="5.5" fill="#ea580c">
                                <animate 
                                  attributeName="cy" 
                                  values={`${140 + Math.sin(offset) * 45};${260 - Math.sin(offset) * 45};${140 + Math.sin(offset) * 45}`} 
                                  dur="5s" 
                                  repeatCount="indefinite" 
                                />
                              </circle>
                              <circle cx={x} cy={260 - Math.sin(offset) * 45} r="5.5" fill="#3b82f6">
                                <animate 
                                  attributeName="cy" 
                                  values={`${260 - Math.sin(offset) * 45};${140 + Math.sin(offset) * 45};${260 - Math.sin(offset) * 45}`} 
                                  dur="5s" 
                                  repeatCount="indefinite" 
                                />
                              </circle>
                            </g>
                          );
                        })}
                      </g>
                    </svg>
                  </div>
                </div>

                {/* Content Overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 pb-20 z-10 max-w-5xl mx-auto">
                  <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-500/30 bg-orange-500/10 mb-6"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ea580c] animate-pulse" />
                    <span className="text-[10px] font-mono text-orange-400 uppercase tracking-widest font-bold">Healix Innovation Ecosystem</span>
                  </motion.div>
                  
                  <motion.h1 
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="text-3xl sm:text-5xl md:text-6xl font-black text-white mb-6 uppercase tracking-tight max-w-4xl leading-tight"
                  >
                    Building the Future of Healthcare Through <span className="text-[#ea580c] bg-clip-text">Research, AI & Innovation</span>
                  </motion.h1>
                  
                  <motion.p 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="text-sm sm:text-base md:text-lg text-zinc-300 font-medium max-w-2xl leading-relaxed mb-8"
                  >
                    Healix Technologies connects clinicians, researchers, engineers, psychologists, and innovators to solve real-world healthcare challenges.
                  </motion.p>

                  {/* Buttons */}
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                    className="flex flex-col sm:flex-row gap-4 items-center justify-center"
                  >
                    <a 
                      href="/biolabs" 
                      className="px-8 py-3 bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(234,88,12,0.3)]"
                    >
                      Explore BioLabs
                    </a>
                    <a 
                      href="#leadership" 
                      className="px-8 py-3 border border-white/20 hover:border-white hover:bg-white/5 text-white text-xs font-bold uppercase tracking-wider transition-all"
                    >
                      Meet Our Team
                    </a>
                  </motion.div>
                </div>
              </div>
            ) : (
              <>
                {carouselItems[activeIndex].type === "video" ? (
                  <video 
                    src={carouselItems[activeIndex].media_url}
                    autoPlay muted loop playsInline
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Image 
                    src={carouselItems[activeIndex].media_url} 
                    alt={carouselItems[activeIndex].title}
                    fill
                    className="object-cover object-top"
                    priority
                  />
                )}
                {/* Gradient Overlay for Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                
                {/* Center Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 pb-20">
                  <motion.h2 
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg max-w-4xl"
                  >
                    {carouselItems[activeIndex].title}
                  </motion.h2>
                  <motion.p 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="text-lg md:text-xl text-white/90 font-medium drop-shadow-md max-w-2xl"
                  >
                    {carouselItems[activeIndex].subtitle}
                  </motion.p>
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <button 
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-black/20 text-white/70 hover:bg-black/50 hover:text-white backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
        <button 
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-black/20 text-white/70 hover:bg-black/50 hover:text-white backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
        
        {/* Dot Indicators */}
        <div className="absolute bottom-32 left-0 right-0 flex justify-center gap-2 z-20">
          {carouselItems.map((_, idx) => (
            <button 
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`!min-w-0 !min-h-0 !p-0 rounded-full transition-all duration-300 ${
                idx === activeIndex 
                  ? "bg-white w-5 h-1.5" 
                  : "bg-white/35 hover:bg-white/60 w-1.5 h-1.5"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Quick Links — transparent, simple wave */}
      <div className="relative z-30 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 md:-mt-24 mb-16">
        <div className="relative w-full h-[180px] md:h-[220px] flex items-center justify-between px-6 md:px-16 overflow-hidden">

          {/* Simple sine wave SVG — single clean line */}
          <div className="absolute inset-0 pointer-events-none flex items-center">
            <svg
              viewBox="0 0 1200 120"
              preserveAspectRatio="none"
              className="w-full"
              style={{ height: "80px" }}
            >
              <defs>
                <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ea580c" stopOpacity="0.15" />
                  <stop offset="50%" stopColor="#ea580c" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.15" />
                </linearGradient>
              </defs>
              <path
                d="M0,60 C150,20 300,100 450,60 C600,20 750,100 900,60 C1050,20 1150,80 1200,60"
                fill="none"
                stroke="url(#waveGrad)"
                strokeWidth="1.5"
              >
                <animate
                  attributeName="d"
                  values="
                    M0,60 C150,20 300,100 450,60 C600,20 750,100 900,60 C1050,20 1150,80 1200,60;
                    M0,60 C150,100 300,20 450,60 C600,100 750,20 900,60 C1050,100 1150,40 1200,60;
                    M0,60 C150,20 300,100 450,60 C600,20 750,100 900,60 C1050,20 1150,80 1200,60
                  "
                  dur="6s"
                  repeatCount="indefinite"
                />
              </path>
            </svg>
          </div>

          {/* Quick Link Icons — float on the wave */}
          <div className="relative z-10 w-full flex justify-between items-center">
            {quickLinks.map((link, idx) => {
              const Icon = link.icon;
              const isEven = idx % 2 === 0;
              return (
                <motion.a
                  key={idx}
                  href={link.href}
                  animate={{ y: [isEven ? -10 : 10, isEven ? 10 : -10, isEven ? -10 : 10] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: idx * 0.4 }}
                  className={`group relative flex flex-col items-center justify-center w-[70px] h-[70px] md:w-[120px] md:h-[120px] rounded-full transition-all duration-500 hover:scale-110 shadow-lg ${
                    idx % 2 === 1
                      ? "bg-gradient-to-br from-[#ea580c] to-[#9a3604] text-white shadow-[#ea580c]/30"
                      : "bg-gradient-to-br from-zinc-50 to-zinc-300 text-zinc-950 shadow-white/10 hover:shadow-[#ea580c]/30"
                  }`}
                >
                  <div className={`absolute inset-0 rounded-full border-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-110 ${idx % 2 === 1 ? "border-[#ea580c]/50" : "border-white/40"}`} />
                  <Icon className="w-6 h-6 md:w-9 md:h-9 mb-1 md:mb-2" strokeWidth={1.5} />
                  <span className="text-[7px] md:text-[10px] font-black tracking-widest text-center uppercase px-2 leading-tight">
                    {link.title}
                  </span>
                </motion.a>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

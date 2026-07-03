"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, FlaskConical, Rocket, Newspaper, Building2, Globe } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { createClient } from "@/utils/supabase/client";
import { InteractivePlexus } from "./InteractivePlexus";

const quickLinks = [
  { title: "RESEARCH", icon: FlaskConical, href: "/biolabs", bg: "bg-[#f5f7fa] text-black hover:bg-white" },
  { title: "BRANDS", icon: Building2, href: "#ecosystem", bg: "bg-[#F56A00] text-white hover:bg-[#d45b00]" },
  { title: "NEWS", icon: Newspaper, href: "/news", bg: "bg-[#f5f7fa] text-black hover:bg-white" },
  { title: "SURAKSHA", icon: Rocket, href: "/suraksha", bg: "bg-[#F56A00] text-white hover:bg-[#d45b00]" },
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
    type: "image",
    title: "",
    subtitle: "",
    media_url: "/ghana_banner.png",
  },
  {
    id: "3",
    type: "image",
    title: "",
    subtitle: "",
    media_url: "/team_banner.png",
    cta_url: "/our-members"
  }
];

export function HeroCarousel() {
  // Initialize with fallback items immediately — no loading skeleton shown
  const [carouselItems, setCarouselItems] = useState<any[]>(fallbackItems);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const { data, error } = await supabase
          .from("hero_banners")
          .select("*")
          .eq("is_active", true)
          .order("order_index", { ascending: true });

        if (!error && data && data.length > 0) {
          setCarouselItems(data);
          setActiveIndex(0);
        }
        // If error or empty — fallbackItems already shown, no change needed
      } catch (error: any) {
        // Fallback already rendered, silently ignore
        console.warn("Banner fetch failed, keeping fallback:", error?.message || error);
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

  return (
    <div className="relative w-full overflow-hidden">
      {/* Full-width Carousel Area */}
      <div 
        className="relative h-[80vh] min-h-[600px] w-full group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {carouselItems.map((item, idx) => {
          const isActive = idx === activeIndex;
          return (
            <div
              key={item.id || idx}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              {idx === 0 ? (
                <div className="absolute inset-0 bg-[#060b18] flex items-center justify-center overflow-hidden">
                  {/* Glowing Background Blobs */}
                  <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#0B4A9E]/20 rounded-full blur-[120px] pointer-events-none" />
                  <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#F56A00]/10 rounded-full blur-[120px] pointer-events-none" />
                  
                  {/* Interactive Plexus Particle Field Background */}
                  <div className="absolute inset-0 pointer-events-auto select-none opacity-40 lg:opacity-75 z-0">
                    <InteractivePlexus />
                  </div>
   
                  {/* Content Overlay */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 pb-20 z-10 max-w-5xl mx-auto pointer-events-none">
                    <motion.div
                      initial={false}
                      animate={isActive ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
                      transition={{ delay: 0.2, duration: 0.8 }}
                      className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#0B4A9E]/30 bg-[#0B4A9E]/10 mb-6 pointer-events-auto"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#F56A00] animate-pulse" />
                      <span className="text-[10px] font-mono text-[#0B4A9E] uppercase tracking-widest font-extrabold">Healix Technologies Incorporated</span>
                    </motion.div>
                    
                    <motion.h1 
                      initial={false}
                      animate={isActive ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
                      transition={{ delay: 0.4, duration: 0.8 }}
                      className="text-4xl sm:text-6xl md:text-7xl font-black text-white mb-6 uppercase tracking-tight max-w-4xl leading-none pointer-events-auto select-text"
                    >
                      Engineering the <span className="text-[#F56A00]">Future</span> of Healthcare
                    </motion.h1>
                    
                    <motion.p 
                      initial={false}
                      animate={isActive ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
                      transition={{ delay: 0.6, duration: 0.8 }}
                      className="text-sm sm:text-base md:text-lg text-zinc-300 font-medium max-w-3xl leading-relaxed mb-8 font-sans pointer-events-auto select-text"
                    >
                      Healix is on a mission to build AI-powered healthcare solutions, biotechnology innovations, research collaborations, diagnostics, and clinical technologies through a nationwide network of doctors, researchers, engineers, students, and innovators.
                    </motion.p>
   
                    {/* Buttons */}
                    <motion.div 
                      initial={false}
                      animate={isActive ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
                      transition={{ delay: 0.8, duration: 0.8 }}
                      className="flex flex-col sm:flex-row gap-4 items-center justify-center pointer-events-auto"
                    >
                      <a 
                        href="/contact?ref=partnership" 
                        className="px-8 py-3.5 bg-[#F56A00] hover:bg-[#d45b00] text-white text-xs font-extrabold uppercase tracking-widest transition-all duration-300 shadow-[0_0_20px_rgba(245,106,0,0.3)] hover:shadow-[0_0_30px_rgba(245,106,0,0.5)] transform hover:-translate-y-0.5"
                      >
                        Partner With Us
                      </a>
                      <a 
                        href="/biolabs" 
                        className="px-8 py-3.5 border border-white/20 hover:border-white hover:bg-white/5 text-white text-xs font-bold uppercase tracking-wider transition-all"
                      >
                        BioLabs Research
                      </a>
                    </motion.div>
                  </div>
                </div>
              ) : (
                <>
                  {/* Media: full-screen image or video */}
                  {item.type === "video" ? (
                    isActive ? (
                      <video
                        src={item.media_url}
                        autoPlay muted loop playsInline
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#050505]" />
                    )
                  ) : (
                    item.cta_url ? (
                      <Link href={item.cta_url} className="block w-full h-full relative cursor-pointer">
                        <Image
                          src={item.media_url}
                          alt={item.title || "Hero Banner"}
                          fill
                          unoptimized={true}
                          className="object-cover object-center"
                          priority={idx === 0 || idx === 1}
                        />
                      </Link>
                    ) : (
                      <Image
                        src={item.media_url}
                        alt={item.title || "Hero Banner"}
                        fill
                        unoptimized={true}
                        className="object-cover object-center"
                        priority={idx === 0 || idx === 1}
                      />
                    )
                  )}

                  {/* Overlay + text */}
                  {(item.title || item.subtitle) && (
                    <>
                      {/* Dark gradient — left-heavy, like the reference banner */}
                      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/30 to-transparent" />

                      {/* Text block — bottom-left, matching uploaded banner style */}
                      <div className="absolute inset-0 flex flex-col justify-end px-10 md:px-20 pb-32 md:pb-36 max-w-3xl">
                        {item.title && (
                          <motion.h2
                            initial={false}
                            animate={isActive ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                            className="text-4xl md:text-6xl font-black text-white mb-4 drop-shadow-lg leading-tight"
                          >
                            {item.title}
                          </motion.h2>
                        )}
                        {item.subtitle && (
                          <motion.p
                            initial={false}
                            animate={isActive ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            className="text-lg md:text-xl text-white/85 font-medium drop-shadow-md"
                          >
                            {item.subtitle}
                          </motion.p>
                        )}
                        {item.cta_label && item.cta_url && (
                          <motion.a
                            initial={false}
                            animate={isActive ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
                            transition={{ delay: 0.7, duration: 0.8 }}
                            href={item.cta_url}
                            className="mt-6 inline-block px-8 py-3 bg-[#eab308] hover:bg-[#ca8a04] text-black text-sm font-black uppercase tracking-wider transition-colors w-fit"
                          >
                            {item.cta_label}
                          </motion.a>
                        )}
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          );
        })}

        {/* Navigation Arrows */}
        <button 
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-black/20 text-white/70 hover:bg-black/50 hover:text-white backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 z-20"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
        <button 
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-black/20 text-white/70 hover:bg-black/50 hover:text-white backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 z-20"
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
                  <stop offset="0%" stopColor="#F56A00" stopOpacity="0.15" />
                  <stop offset="50%" stopColor="#F56A00" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#0B4A9E" stopOpacity="0.15" />
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
                      ? "bg-gradient-to-br from-[#F56A00] to-[#b04d00] text-white shadow-[#F56A00]/30"
                      : "bg-gradient-to-br from-zinc-50 to-zinc-300 text-zinc-950 shadow-white/10 hover:shadow-[#F56A00]/30"
                  }`}
                >
                  <div className={`absolute inset-0 rounded-full border-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-110 ${idx % 2 === 1 ? "border-[#F56A00]/50" : "border-white/40"}`} />
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

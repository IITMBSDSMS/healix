"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, FlaskConical, Rocket, Newspaper, Building2 } from "lucide-react";
import Image from "next/image";

import { createClient } from "@/utils/supabase/client";

const quickLinks = [
  { title: "RESEARCH", icon: FlaskConical, href: "/biolabs", bg: "bg-[#f5f5f5] text-black hover:bg-white" },
  { title: "STARTUPS", icon: Rocket, href: "/startups", bg: "bg-[#eab308] text-black hover:bg-[#ca8a04]" },
  { title: "NEWS", icon: Newspaper, href: "/news", bg: "bg-[#f5f5f5] text-black hover:bg-white" },
  { title: "GLOBAL NETWORK", icon: Building2, href: "/global-network", bg: "bg-[#eab308] text-black hover:bg-[#ca8a04]" },
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

        if (error) throw error;
        
        if (data && data.length > 0) {
          setCarouselItems(data);
        } else {
          setCarouselItems(fallbackItems);
        }
      } catch (error) {
        console.error("Error fetching banners:", error);
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
                className="object-cover"
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
              className={`w-2.5 h-2.5 rounded-full transition-all ${idx === activeIndex ? "bg-white w-8" : "bg-white/40 hover:bg-white/70"}`}
            />
          ))}
        </div>
      </div>

      {/* Overlapping Quick Links Block (IITD Style) */}
      <div className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 md:-mt-24 mb-16">
        <div className="grid grid-cols-2 md:flex md:flex-row w-full shadow-2xl">
          {quickLinks.map((link, idx) => {
            const Icon = link.icon;
            return (
              <a 
                key={idx} 
                href={link.href}
                className={`flex-1 flex flex-col items-center justify-center py-6 md:py-10 px-2 md:px-4 transition-colors duration-300 cursor-pointer ${link.bg}`}
              >
                <span className="text-xs md:text-sm font-bold tracking-widest mb-3 md:mb-4 text-center">{link.title}</span>
                <Icon className="w-8 h-8 md:w-12 md:h-12" strokeWidth={1.5} />
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}

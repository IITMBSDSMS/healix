"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";

interface Mentor {
  id: string;
  name: string;
  role: string;
  institution: string;
  photoUrl: string;
}

interface MentorMarqueeProps {
  mentors: Mentor[];
}

const DEFAULT_MESSAGES = [
  "We are driven by a singular mission to make high-quality healthcare and engineering education understandable, accessible, and affordable for millions. Education is not just limited to theory—it's about practical, proactive engagement that transforms lives.",
  "Our commitment to excellence and integrity remains steadfast. We partner with emerging engineers who share our passion for making a meaningful impact in clinical technology and biomedical innovation.",
  "Together, we can empower communities and revolutionise biomedical engineering for a healthier tomorrow. Your trust in Healix is what inspires us to keep pushing boundaries.",
];

const FALLBACK_MENTORS = [
  { name: "Dr. Priya Patel", image: "https://i.pravatar.cc/600?img=47", role: "Lead Hardware Systems Engineer", institution: "IIT Delhi", message: DEFAULT_MESSAGES[0] },
  { name: "Dr. Arvind Rao", image: "https://i.pravatar.cc/600?img=3",  role: "AI Systems Architect",         institution: "IIT Bombay",  message: DEFAULT_MESSAGES[1] },
  { name: "Dr. Sarah Chen",  image: "https://i.pravatar.cc/600?img=1",  role: "Head of Bioinformatics",       institution: "AIIMS Delhi",  message: DEFAULT_MESSAGES[2] },
];

export const MentorMarquee = ({ mentors = [] }: MentorMarqueeProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const displayItems = mentors.length > 0
    ? mentors.map((m, i) => ({
        name: m.name,
        image: m.photoUrl || `https://i.pravatar.cc/600?img=${i + 1}`,
        role: m.role || m.institution,
        institution: m.institution,
        message: DEFAULT_MESSAGES[i % DEFAULT_MESSAGES.length],
      }))
    : FALLBACK_MENTORS;

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % displayItems.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [displayItems.length]);

  const go = (dir: number) => {
    setDirection(dir);
    setCurrentIndex((prev) => (prev + dir + displayItems.length) % displayItems.length);
  };

  const variants = {
    enter:  (d: number) => ({ opacity: 0, x: d > 0 ?  60 : -60 }),
    center: { opacity: 1, x: 0 },
    exit:   (d: number) => ({ opacity: 0, x: d > 0 ? -60 :  60 }),
  };

  const item = displayItems[currentIndex];

  return (
    <section className="relative py-16 md:py-28 overflow-hidden bg-white">
      {/* ── Decorative background blobs ── */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-[#5a4bda]/5 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-[#ff5500]/5 blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">

        {/* ── Section label ── */}
        <div className="flex items-center gap-3 mb-16">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-gray-200" />
          <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-slate-400 px-4">From Our Mentors</span>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-gray-200" />
        </div>

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-10 md:gap-16 items-center"
          >
            {/* ── LEFT: Text content ── */}
            <div className="relative">
              {/* Giant decorative quote mark */}
              <Quote className="absolute -top-4 md:-top-6 -left-2 md:-left-4 w-14 md:w-20 h-14 md:h-20 text-[#5a4bda]/10 fill-[#5a4bda]/10" />

              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 mb-3 tracking-tight leading-tight">
                A message from{" "}
                <span className="relative inline-block">
                  <span className="text-[#ff5500]">Our Mentors</span>
                  <motion.span
                    layoutId="underline"
                    className="absolute -bottom-1 left-0 right-0 h-[3px] bg-gradient-to-r from-[#ff5500] to-[#ff8c00] rounded-full"
                  />
                </span>
              </h2>

              <p className="text-base md:text-lg text-slate-500 mb-8 md:mb-10 font-medium italic">
                &ldquo;Leading with vision and compassion&rdquo;
              </p>

              <blockquote className="text-slate-600 text-base md:text-lg leading-relaxed mb-8 md:mb-10 pl-4 md:pl-5 border-l-4 border-[#5a4bda]/30">
                {item.message}
              </blockquote>

              <p className="text-slate-500 mb-2 text-sm">
                To our current and future engineers—your drive is what inspires us. Together, we are transforming lives by delivering exceptional healthcare services that drive positive change.
              </p>

              {/* Signature block */}
              <div className="mt-10 flex items-center gap-5">
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#ff5500]/30 shadow-md shrink-0">
                  <Image src={item.image} alt={item.name} width={56} height={56} className="object-cover w-full h-full" />
                </div>
                <div>
                  <p className="font-extrabold text-slate-900 text-lg leading-tight">{item.name}</p>
                  <p className="text-[#ff5500] font-bold text-sm mt-0.5">{item.role}</p>
                  {item.institution && (
                    <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mt-0.5">{item.institution}</p>
                  )}
                </div>
              </div>
            </div>

            {/* ── RIGHT: Photo ── */}
            <div className="hidden lg:flex justify-center items-end lg:justify-end">
              {/* Blob behind image */}
              <motion.div
                animate={{ scale: [1, 1.04, 1], rotate: [0, 3, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 m-auto w-[360px] h-[420px] bg-gradient-to-br from-[#ffc3ad] via-[#ffd5c5] to-[#ffe0d5] rounded-[40%_60%_60%_40%/40%_40%_60%_60%] -z-10"
              />

              {/* Photo frame */}
              <div className="relative w-[300px] h-[420px] rounded-[30px] overflow-hidden shadow-2xl shadow-[#5a4bda]/20 border-4 border-white">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover object-top"
                  sizes="300px"
                />
                {/* Bottom gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                {/* Floating name card inside photo */}
                <div className="absolute bottom-5 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                  <p className="font-extrabold text-slate-900 text-base leading-tight">{item.name}</p>
                  <p className="text-[#ff5500] font-bold text-xs mt-1">{item.role}</p>
                </div>
              </div>

              {/* Floating accent badge */}
              <motion.div
                animate={{ y: [-4, 4, -4] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-4 -left-4 bg-[#5a4bda] text-white text-xs font-black px-4 py-2 rounded-2xl shadow-lg shadow-[#5a4bda]/40"
              >
                ✦ Top Mentor
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* ── Controls ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-12 md:mt-16">
          {/* Prev / Next arrows */}
          <div className="flex gap-3">
            <button
              onClick={() => go(-1)}
              className="w-11 h-11 rounded-full border-2 border-slate-200 hover:border-[#5a4bda] hover:bg-[#5a4bda] hover:text-white text-slate-500 flex items-center justify-center transition-all group"
              aria-label="Previous mentor"
            >
              <ChevronLeft className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>
            <button
              onClick={() => go(1)}
              className="w-11 h-11 rounded-full border-2 border-slate-200 hover:border-[#5a4bda] hover:bg-[#5a4bda] hover:text-white text-slate-500 flex items-center justify-center transition-all group"
              aria-label="Next mentor"
            >
              <ChevronRight className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>
          </div>

          {/* Progress dots */}
          <div className="flex gap-2.5 items-center">
            {displayItems.map((_, idx) => (
              <button
                key={idx}
                onClick={() => { setDirection(idx > currentIndex ? 1 : -1); setCurrentIndex(idx); }}
                className={`rounded-full transition-all duration-400 ${
                  idx === currentIndex
                    ? "bg-[#ff5500] w-8 h-2.5 shadow-[0_0_12px_rgba(255,85,0,0.5)]"
                    : "bg-slate-200 w-2.5 h-2.5 hover:bg-slate-300"
                }`}
                aria-label={`Go to mentor ${idx + 1}`}
              />
            ))}
          </div>

          {/* Counter */}
          <p className="text-sm font-bold text-slate-400 tabular-nums">
            <span className="text-slate-700">{String(currentIndex + 1).padStart(2, "0")}</span>
            {" / "}
            {String(displayItems.length).padStart(2, "0")}
          </p>
        </div>
      </div>
    </section>
  );
};

"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

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
  "We are driven by a singular mission to make high-quality healthcare and engineering education understandable, accessible, and affordable for millions. In today's fast-paced world, education is not just limited to theory; it's about practical, proactive engagement.",
  "Our commitment to excellence and integrity remains steadfast. We are proud to partner with emerging engineers who share our passion for making a meaningful impact in clinical tech.",
  "Together, we can empower communities and revolutionise biomedical engineering for a healthier tomorrow. Your trust in Healix is what inspires us.",
];

export const MentorMarquee = ({ mentors = [] }: MentorMarqueeProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const displayItems = mentors.length > 0 
    ? mentors.map((m, i) => ({ 
        name: m.name, 
        image: m.photoUrl || "https://i.pravatar.cc/300?img=" + (i + 1), 
        role: m.role || m.institution,
        message: DEFAULT_MESSAGES[i % DEFAULT_MESSAGES.length]
      }))
    : [
        { name: "Dr. Sarah Chen", image: "https://i.pravatar.cc/400?img=1", role: "Head of Bioinformatics", message: DEFAULT_MESSAGES[0] },
        { name: "Vikram Sharma", image: "https://i.pravatar.cc/400?img=11", role: "Staff Product Engineer", message: DEFAULT_MESSAGES[1] },
        { name: "Dr. Arvind Rao", image: "https://i.pravatar.cc/400?img=3", role: "AI Systems Architect", message: DEFAULT_MESSAGES[2] },
      ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayItems.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [displayItems.length]);

  return (
    <div className="py-24 bg-[#fafafa] overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row items-center gap-16"
          >
            {/* Left Content */}
            <div className="flex-1 md:pr-12">
              <h2 className="text-4xl md:text-5xl font-extrabold text-[#111] mb-2 tracking-tight">
                A message from <span className="text-[#ff5500]">Our Mentors</span>
              </h2>
              <p className="text-xl md:text-2xl text-[#333] mb-8 font-medium">
                Leading with vision and compassion
              </p>
              
              <div className="text-[#555] space-y-6 text-base md:text-lg leading-relaxed">
                <p>{displayItems[currentIndex].message}</p>
                <p>
                  To our current and future engineers—your drive is what inspires us. Together, we are transforming lives by delivering exceptional healthcare services that drive positive change.
                </p>
              </div>

              <div className="mt-12 text-[#333]">
                <p className="mb-1 text-gray-500 font-medium">Warm regards,</p>
                <p className="font-bold text-xl">{displayItems[currentIndex].name}</p>
                <p className="text-sm text-gray-500 font-medium uppercase tracking-wide mt-1">{displayItems[currentIndex].role}</p>
              </div>
            </div>

            {/* Right Content - Photo */}
            <div className="w-full md:w-[450px] shrink-0 relative flex justify-center items-end mt-12 md:mt-0">
               {/* Background Blob/Shape */}
               <div className="absolute right-0 bottom-12 w-[350px] h-[400px] bg-[#ffc3ad] rounded-t-[150px] rounded-bl-[50px] rounded-br-[120px] -z-10 shadow-inner" />
               
               {/* Image Container */}
               <div className="relative w-[320px] h-[450px] overflow-hidden rounded-t-[140px] rounded-bl-[40px] rounded-br-[100px] shadow-2xl">
                 <Image 
                   src={displayItems[currentIndex].image}
                   alt={displayItems[currentIndex].name}
                   fill
                   className="object-cover object-center"
                 />
               </div>
               
               {/* Floating Tag */}
               <div className="absolute -bottom-6 right-4 md:right-10 bg-white p-5 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.12)] border border-gray-100 z-20 min-w-[220px]">
                 <p className="font-extrabold text-gray-900 text-lg">{displayItems[currentIndex].name}</p>
                 <p className="text-[#ff5500] font-bold text-sm mt-1">{displayItems[currentIndex].role}</p>
               </div>
            </div>
          </motion.div>
        </AnimatePresence>
        
        {/* Navigation Dots */}
        <div className="flex gap-3 justify-center mt-20">
          {displayItems.map((_, idx) => (
            <button 
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'bg-[#ff5500] w-10 shadow-[0_0_10px_rgba(255,85,0,0.4)]' : 'bg-gray-300 w-2.5 hover:bg-gray-400'}`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

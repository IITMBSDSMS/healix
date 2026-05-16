import React from "react";
import { motion } from "framer-motion";
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

const STATIC_MENTORS = [
  { name: "IIT Madras", logo: "/logos/iitm.svg", role: "AI Research Partners" },
  { name: "Google Cloud", logo: "/logos/google-cloud.svg", role: "Infrastructure Mentor" },
  { name: "YC W24", logo: "/logos/yc.svg", role: "Startup Fellowship" },
  { name: "Stanford", logo: "/logos/stanford.svg", role: "Clinical Advisor" },
];

export const MentorMarquee = ({ mentors = [] }: MentorMarqueeProps) => {
  // Use dynamic mentors if available, otherwise fallback
  const displayItems = mentors.length > 0 
    ? mentors.map(m => ({ name: m.name, image: m.photoUrl, role: m.role || m.institution }))
    : STATIC_MENTORS.map(m => ({ name: m.name, image: "https://i.pravatar.cc/100", role: m.role }));

  return (
    <div className="py-12 bg-white/[0.02] border-y border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-8 text-center">
        <p className="text-[10px] font-mono text-white/30 uppercase tracking-[0.5em]">
          Learn directly from industry leaders
        </p>
      </div>
      
      <div className="flex relative">
        <motion.div
          animate={{ x: [0, -1035] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="flex gap-20 items-center whitespace-nowrap"
        >
          {[...displayItems, ...displayItems, ...displayItems].map((item, i) => (
            <div key={i} className="flex items-center gap-4 group">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-2 border-white/10 bg-white/5 flex items-center justify-center grayscale group-hover:grayscale-0 transition-all shrink-0">
                <Image 
                  src={item.image} 
                  alt={item.name} 
                  width={80} 
                  height={80} 
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-white/80">{item.name}</p>
                <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest">{item.role}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

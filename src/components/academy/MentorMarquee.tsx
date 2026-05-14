import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const MENTORS = [
  { name: "IIT Madras", logo: "/logos/iitm.svg", role: "AI Research Partners" },
  { name: "Google Cloud", logo: "/logos/google-cloud.svg", role: "Infrastructure Mentor" },
  { name: "YC W24", logo: "/logos/yc.svg", role: "Startup Fellowship" },
  { name: "NVIDIA", logo: "/logos/nvidia.svg", role: "Compute Advisor" },
  { name: "Microsoft", logo: "/logos/microsoft.svg", role: "Enterprise Partner" },
  { name: "Stanford", logo: "/logos/stanford.svg", role: "Clinical Advisor" },
];

export const MentorMarquee = () => {
  return (
    <div className="py-12 bg-white/[0.02] border-y border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-8 text-center">
        <p className="text-[10px] font-mono text-white/30 uppercase tracking-[0.5em]">
          Institutional Authority & Industry Backing
        </p>
      </div>
      
      <div className="flex relative">
        <motion.div
          animate={{ x: [0, -1035] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="flex gap-20 items-center whitespace-nowrap"
        >
          {[...MENTORS, ...MENTORS].map((item, i) => (
            <div key={i} className="flex items-center gap-4 group">
              <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center grayscale group-hover:grayscale-0 transition-all">
                <span className="font-bold text-lg text-white/40 group-hover:text-[#eab308]">{item.name[0]}</span>
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

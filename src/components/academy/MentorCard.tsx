import React from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { ExternalLink, GraduationCap, ArrowUpRight } from "lucide-react";
import Image from "next/image";

interface MentorCardProps {
  mentor: {
    id: string;
    name: string;
    role: string;
    institution: string;
    specialization: string;
    experience: string;
    photoUrl: string;
    linkedinUrl?: string;
    companies?: string[];
    bio?: string;
  };
}

export const MentorCard = ({ mentor }: MentorCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.5 }}
      className="h-full"
    >
      <GlassCard variant="light" className="p-0 overflow-hidden border-zinc-200 group h-full hover:border-[#ea580c]/30 hover:shadow-md transition-all bg-white flex flex-col justify-between">
        <div className="relative aspect-[4/5] overflow-hidden bg-zinc-50">
          <Image 
            src={mentor.photoUrl} 
            alt={mentor.name} 
            fill 
            className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100" 
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />
          
          {/* Institution Badge */}
          <div className="absolute top-4 left-4 z-10">
            <div className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-zinc-200 flex items-center gap-2 shadow-sm">
              <GraduationCap className="w-3 h-3 text-[#ea580c]" />
              <span className="text-[10px] font-mono text-zinc-800 uppercase tracking-widest font-bold">{mentor.institution}</span>
            </div>
          </div>

          <div className="absolute bottom-6 left-6 right-6 z-10 pointer-events-none">
            <p className="text-sm font-bold text-white tracking-tight mb-1 font-mono uppercase">{mentor.name}</p>
            <p className="text-[10px] font-mono text-[#ea580c] uppercase tracking-widest mb-3 font-bold">{mentor.role}</p>
            <p className="text-[11px] text-zinc-300 line-clamp-2 leading-relaxed">{mentor.specialization}</p>
          </div>
        </div>
        
        <div className="p-4 bg-zinc-50/50 flex justify-between items-center border-t border-zinc-150 mt-auto">
          <div className="flex gap-4 items-center w-full justify-between">
            {mentor.linkedinUrl && mentor.linkedinUrl !== "#" ? (
              <a href={mentor.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-[#ea580c] transition-colors flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider">
                <span>LinkedIn</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            ) : (
              <span className="text-zinc-400 text-[10px] font-mono uppercase tracking-wider">{mentor.experience || "5+ Years Exp"}</span>
            )}
            <button className="text-zinc-650 hover:text-[#ea580c] transition-colors flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-widest">
              Book Session <ArrowUpRight className="w-3.5 h-3.5 text-[#ea580c]" />
            </button>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
};

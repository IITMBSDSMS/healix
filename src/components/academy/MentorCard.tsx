import React from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { ExternalLink, Globe, GraduationCap, ArrowUpRight } from "lucide-react";
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
    >
      <GlassCard className="p-0 overflow-hidden border-white/5 group h-full hover:border-[#eab308]/20 transition-all">
        <div className="relative aspect-[4/5] overflow-hidden bg-[#0a0a0a]">
          <Image 
            src={mentor.photoUrl} 
            alt={mentor.name} 
            fill 
            className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-80" />
          
          {/* Institution Badge */}
          <div className="absolute top-4 left-4">
            <div className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center gap-2">
              <GraduationCap className="w-3 h-3 text-[#eab308]" />
              <span className="text-[10px] font-mono text-white/80 uppercase tracking-widest">{mentor.institution}</span>
            </div>
          </div>

          <div className="absolute bottom-6 left-6 right-6">
            <p className="text-sm font-bold text-white tracking-tight mb-1">{mentor.name}</p>
            <p className="text-[10px] font-mono text-[#eab308] uppercase tracking-widest mb-3">{mentor.role}</p>
            <p className="text-[11px] text-white/40 line-clamp-2">{mentor.specialization}</p>
          </div>
        </div>
        
        <div className="p-4 bg-white/[0.02] flex justify-between items-center border-t border-white/5">
          <div className="flex gap-4">
            {mentor.linkedinUrl && (
              <a href={mentor.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-[#eab308] transition-colors">
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
            <button className="text-white/30 hover:text-[#eab308] transition-colors flex items-center gap-1 text-[10px] font-mono uppercase tracking-widest">
              Book Session <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
};

"use client";

import { mentors } from "@/lib/academy/data";
import { ShieldCheck } from "lucide-react";

export function MentorMarquee() {
  const duplicatedMentors = [...mentors, ...mentors, ...mentors];

  return (
    <div className="w-full overflow-hidden bg-[#050505] py-10 border-y border-white/5 relative">
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#050505] to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#050505] to-transparent z-10 pointer-events-none" />
      
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused] gap-8 pr-8">
        {duplicatedMentors.map((mentor, idx) => (
          <div key={`${mentor.id}-${idx}`} className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-4 pr-8 shrink-0">
            <img 
              src={mentor.photoUrl} 
              alt={mentor.name} 
              className="w-16 h-16 rounded-full object-cover border-2 border-[#eab308]/50"
            />
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-white font-bold">{mentor.name}</h4>
                <ShieldCheck className="w-4 h-4 text-blue-400" />
              </div>
              <p className="text-xs text-white/60 mb-1">{mentor.role}</p>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#eab308]/10 text-[#eab308] border border-[#eab308]/20">
                  {mentor.institution}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

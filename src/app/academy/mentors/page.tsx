"use client";

import { useState, useEffect } from "react";
import { getMentors } from "@/lib/academy/db";
import { motion } from "framer-motion";
import { ShieldCheck, ExternalLink, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function MentorsPage() {
  const [mentors, setMentors] = useState<any[]>([]);

  useEffect(() => {
    getMentors().then(setMentors);
  }, []);
  return (
    <div className="min-h-screen bg-[#050505] text-white pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h1 className="text-5xl font-bold mb-6 tracking-tight">Our Elite Mentors</h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Learn directly from the engineers and researchers who are building the future of healthcare, AI, and systems engineering.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {mentors.map((mentor, i) => (
            <motion.div 
              key={mentor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-[#0a0a0f] border border-white/10 rounded-3xl p-8 flex flex-col sm:flex-row gap-8 hover:border-[#eab308]/30 transition-colors group"
            >
              <div className="w-32 h-32 sm:w-48 sm:h-48 shrink-0 relative rounded-2xl overflow-hidden border border-white/10">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10" />
                <img src={mentor.photoUrl} alt={mentor.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
              </div>

              <div className="flex-1 flex flex-col">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                      {mentor.name}
                      <ShieldCheck className="w-5 h-5 text-blue-400" />
                    </h2>
                    <p className="text-[#eab308] font-medium">{mentor.role}</p>
                  </div>
                  <a href={mentor.linkedinUrl} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 hover:bg-[#eab308] hover:text-black rounded-lg transition-colors text-white/50">
                    <ExternalLink className="w-5 h-5" />
                  </a>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="text-[10px] font-mono px-2 py-1 bg-white/5 rounded border border-white/10 text-white/70">{mentor.institution}</span>
                  <span className="text-[10px] font-mono px-2 py-1 bg-white/5 rounded border border-white/10 text-white/70">{mentor.experience}</span>
                </div>

                <p className="text-sm text-white/50 mb-6 flex-1">{mentor.bio}</p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {mentor.companies.map((co: string) => (
                    <span key={co} className="text-xs font-bold text-white/30">{co}</span>
                  ))}
                </div>

                <Link href="/register">
                  <button className="w-full sm:w-auto px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2">
                    Book Mentorship Session <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

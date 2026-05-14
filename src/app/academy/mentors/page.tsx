"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MentorCard } from "@/components/academy/MentorCard";
import { getMentors } from "@/lib/academy/db";
import { Button } from "@/components/ui/Button";
import { 
  Users, Search, Filter, Sparkles, 
  MessageSquare, Globe, ArrowRight 
} from "lucide-react";

export default function MentorsPage() {
  const [mentors, setMentors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getMentors().then(data => {
      setMentors(data);
      setIsLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#eab308]/30 bg-[#eab308]/10 mb-6">
              <Users className="h-4 w-4 text-[#eab308]" />
              <span className="text-[10px] font-mono text-[#eab308] uppercase tracking-widest">Expert Faculty</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6">
              Learn from the <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#eab308] to-[#fde047]">Systems Architects</span>.
            </h1>
            <p className="text-white/50 text-xl max-w-3xl mx-auto leading-relaxed">
              Our mentors are staff engineers, researchers, and technical founders from the world's most innovative institutions.
            </p>
          </motion.div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col md:flex-row gap-6 mb-16">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
            <input 
              type="text" 
              placeholder="Search by name, role, or institution..." 
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white focus:outline-none focus:border-[#eab308]/50 transition-all"
            />
          </div>
          <div className="flex gap-4">
            <Button variant="outline" className="px-8 rounded-2xl flex items-center gap-2">
              <Filter className="w-4 h-4" /> Filter
            </Button>
            <Button className="px-8 rounded-2xl flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Recommended
            </Button>
          </div>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="aspect-[4/5] bg-white/5 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {mentors.map((mentor, i) => (
              <MentorCard key={mentor.id} mentor={mentor} />
            ))}
          </div>
        )}

        {/* Call to Action */}
        <section className="mt-40">
          <div className="p-12 md:p-20 rounded-[3rem] bg-gradient-to-br from-[#0a0a0a] to-transparent border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-5">
              <Globe className="h-64 w-64 text-[#eab308]" />
            </div>
            <div className="relative z-10 max-w-2xl">
              <h2 className="text-4xl font-bold mb-6 tracking-tight">Become a Mentor</h2>
              <p className="text-white/50 text-lg mb-10 leading-relaxed">
                Join our elite faculty and help shape the next generation of systems engineers. We're looking for architects from top tech firms and research labs.
              </p>
              <Button size="lg" variant="outline" className="px-10 gap-3">
                Apply to Teach <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}

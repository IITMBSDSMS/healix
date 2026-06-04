"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MentorCard } from "@/components/academy/MentorCard";
import { getMentors } from "@/lib/academy/db";
import { Button } from "@/components/ui/Button";
import { ScientistReaction3D } from "@/components/ui/ScientistReaction3D";
import { 
  Users, Search, Filter, Sparkles, 
  Globe, ArrowRight, X 
} from "lucide-react";

export default function MentorsPage() {
  const [mentors, setMentors] = useState<any[]>([]);
  const [filteredMentors, setFilteredMentors] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDirectoryOpen, setIsDirectoryOpen] = useState(false);

  useEffect(() => {
    getMentors().then(data => {
      const list = Array.isArray(data) ? data : [];
      setMentors(list);
      setFilteredMentors(list);
      setIsLoading(false);
    });
  }, []);

  // Filter handler
  useEffect(() => {
    if (!searchTerm) {
      setFilteredMentors(mentors);
      return;
    }
    const term = searchTerm.toLowerCase();
    const filtered = mentors.filter(m => 
      m.name?.toLowerCase().includes(term) ||
      m.role?.toLowerCase().includes(term) ||
      m.institution?.toLowerCase().includes(term) ||
      m.specialization?.toLowerCase().includes(term)
    );
    setFilteredMentors(filtered);
  }, [searchTerm, mentors]);

  return (
    <div className="min-h-screen bg-white text-zinc-900 pt-32 pb-20 selection:bg-orange-500/20 relative overflow-hidden">
      {/* Subtle clinical backgrounds */}
      <div className="fixed inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.02] pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(234,88,12,0.02)_0%,transparent_50%)] pointer-events-none" />

      <div className="max-w-[94%] mx-auto px-6 lg:px-8 relative z-10">
        
        {/* Header section with 2 columns: Text + 3D DNA Helix */}
        <section className="mb-20 min-h-[60vh] flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 w-full items-center">
            
            {/* Left Info Column */}
            <div className="lg:col-span-7 space-y-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#ea580c]/30 bg-[#ea580c]/10 mb-6">
                  <Users className="h-4 w-4 text-[#ea580c] animate-pulse" />
                  <span className="text-[10px] font-mono text-[#ea580c] uppercase tracking-widest font-bold">Expert Faculty</span>
                </div>
                
                <h1 className="text-5xl md:text-8xl font-black leading-[0.95] tracking-tight mb-8 font-mono uppercase text-zinc-950">
                  Learn from the <span className="text-[#ea580c]">Systems Architects</span>.
                </h1>
                
                <p className="text-base md:text-lg text-zinc-600 max-w-xl mb-12 leading-relaxed">
                  Our academy mentors are staff engineers, research fellows, and clinical founders from the world's most innovative healthcare and distributed systems networks.
                </p>

                {/* Filter and Search Bar */}
                <div className="flex flex-col sm:flex-row gap-4 max-w-2xl">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                    <input 
                      type="text" 
                      placeholder="Search by name, role, or institution..." 
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-4 pl-14 pr-6 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-[#ea580c]/50 focus:bg-white transition-all shadow-sm text-sm"
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" className="px-6 rounded-2xl border-zinc-250 hover:bg-[#ea580c]/5 hover:border-[#ea580c]/30 hover:text-[#ea580c] flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider">
                      <Filter className="w-3.5 h-3.5" /> Filter
                    </Button>
                    <Button onClick={() => setIsDirectoryOpen(true)} className="px-6 rounded-2xl bg-[#ea580c] hover:bg-[#c2410c] text-white flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider shadow-lg shadow-orange-500/10">
                      <Sparkles className="w-3.5 h-3.5" /> Launch Directory
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right 3D Scientist Column */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="w-full h-full"
              >
                <ScientistReaction3D />
              </motion.div>
            </div>

          </div>
        </section>

        {/* Mentors Grid */}
        <section className="py-20 border-t border-zinc-200">
          <div className="mb-12">
            <h2 className="text-2xl font-black font-mono uppercase tracking-tight text-zinc-950">Active Faculty Directory</h2>
            <p className="text-zinc-500 text-xs font-mono mt-1 uppercase tracking-widest">{filteredMentors.length} mentors matching search</p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="aspect-[4/5] bg-zinc-50 border border-zinc-100 rounded-3xl animate-pulse" />
              ))}
            </div>
          ) : filteredMentors.length === 0 ? (
            <div className="text-center py-20 text-zinc-500 font-mono text-sm border border-dashed border-zinc-200 rounded-[2rem] bg-zinc-50/50">
              No mentors match your search query. Try broadening your terms.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredMentors.map((mentor) => (
                <MentorCard key={mentor.id} mentor={mentor} />
              ))}
            </div>
          )}
        </section>

        {/* Call to Action */}
        <section className="mt-20">
          <div className="p-12 md:p-24 rounded-[3.5rem] bg-zinc-950 text-white border border-zinc-800 relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(234,88,12,0.1)_0%,transparent_60%)]" />
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
              <Globe className="h-64 w-64 text-[#ea580c]" />
            </div>
            <div className="relative z-10 max-w-2xl space-y-6">
              <span className="px-3 py-1 rounded-full border border-[#ea580c]/30 bg-[#ea580c]/10 text-xs font-mono font-bold uppercase tracking-widest text-[#ea580c]">Join Faculty</span>
              <h2 className="text-4xl md:text-5xl font-black font-mono uppercase tracking-tight text-white leading-none">Become an Academy Mentor</h2>
              <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
                Join our elite systems faculty and help educate the next generation of platform architects. We are always looking for mentors from leading engineering and medical informatics teams.
              </p>
              <div className="pt-4">
                <Button size="lg" className="px-10 bg-[#ea580c] hover:bg-[#c2410c] text-white font-mono font-bold uppercase tracking-wider gap-3">
                  Apply to Teach <ArrowRight className="w-4 h-4 text-white" />
                </Button>
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* Interactive Faculty Directory Modal */}
      <AnimatePresence>
        {isDirectoryOpen && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6 lg:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDirectoryOpen(false)}
              className="absolute inset-0 bg-[#050505]/85 backdrop-blur-md cursor-pointer"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", bounce: 0.05, duration: 0.4 }}
              className="relative z-10 w-full max-w-7xl bg-white border border-zinc-200 rounded-[2rem] p-8 md:p-12 shadow-2xl overflow-y-auto max-h-[85vh] custom-scrollbar text-zinc-900"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setIsDirectoryOpen(false)}
                className="absolute top-6 right-6 bg-zinc-950 hover:bg-[#ea580c] hover:scale-105 active:scale-95 text-white rounded-full p-2.5 transition-all shadow-md flex items-center justify-center"
              >
                <X className="h-4.5 w-4.5" />
              </button>

              {/* Modal Header */}
              <div className="mb-10">
                <h2 className="text-3xl font-black font-mono uppercase tracking-tight text-zinc-950 leading-none">Active Faculty Directory</h2>
                <p className="text-zinc-500 text-xs font-mono mt-2 uppercase tracking-widest">{filteredMentors.length} mentors matching search</p>
              </div>

              {/* Mentors Grid inside Modal */}
              {filteredMentors.length === 0 ? (
                <div className="text-center py-20 text-zinc-500 font-mono text-sm border border-dashed border-zinc-200 rounded-[2rem] bg-zinc-50/50">
                  No mentors match your search query. Try broadening your terms.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {filteredMentors.map((mentor) => (
                    <MentorCard key={mentor.id} mentor={mentor} />
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

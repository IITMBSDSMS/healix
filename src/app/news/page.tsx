"use client";

import React from "react";
import { Newspaper, Calendar, ArrowRight, User } from "lucide-react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";

const newsArticles = [
  {
    id: "1",
    title: "Healix BioLabs Launches High-Performance Genomics Accelerator",
    category: "RESEARCH",
    date: "May 28, 2026",
    author: "Dr. A. C. Research Director",
    desc: "Healix BioLabs has officially inaugurated its new distributed genomic diagnostic compute cluster. The facility integrates real-time DNA sequencing workflows with explainable machine learning models to accelerate personal safety telemetry and cardiovascular disease risk profiling.",
    img: "https://images.unsplash.com/photo-1579152167368-f96c2db507f9?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "2",
    title: "AVENNIX PHARMA Partnership Combines AI Diagnostics with Instant Medicine Delivery",
    category: "ANNOUNCEMENT",
    date: "May 15, 2026",
    author: "Healix Press Team",
    desc: "Healix Care has finalized a logistics partnership under the AVENNIX PHARMA division to enable 30-minute delivery loops for critical care prescriptions in Hauz Khas. Patients can now trigger AI symptom triage checkups and order medications directly inside the unified console.",
    img: "https://images.unsplash.com/photo-1586015555751-63bb77f4322a?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "3",
    title: "HSF (Healix Sahyog Foundation) Launches Suraksha QR Campaign in Delhi Metro Transit Network",
    category: "COMMUNITY",
    date: "May 02, 2026",
    author: "HSF Outreach Loop",
    desc: "To strengthen women's travel safety, the Healix Sahyog Foundation has deployed public Suraksha QR code vectors across leading Delhi transit networks. Commuters can scan transit identifiers to start zero-knowledge GPS logs and sync active audio telemetry with trusted guardians.",
    img: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=600&auto=format&fit=crop"
  }
];

export default function NewsPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 selection:bg-yellow-500/20 py-20">
      <div className="max-w-[94%] mx-auto px-6 sm:px-8">
        
        {/* Header section */}
        <div className="mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#ea580c]/30 bg-[#ea580c]/10 mb-6">
            <Newspaper className="h-3.5 w-3.5 text-[#ea580c]" />
            <span className="text-[10px] font-mono text-[#ea580c] uppercase tracking-widest font-bold">Press Center</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 font-mono uppercase text-zinc-950">Latest Announcements</h1>
          <p className="text-zinc-650 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            Stay updated with the latest breakthroughs, announcements, and press releases from Healix Technologies and our global partners.
          </p>
        </div>

        {/* Featured Article */}
        <div className="mb-16">
          <GlassCard className="overflow-hidden border border-zinc-200 rounded-2xl shadow-sm bg-white hover:shadow-md transition-shadow group grid md:grid-cols-12 gap-0">
            <div className="md:col-span-7 relative aspect-video md:aspect-auto h-full min-h-[300px] overflow-hidden">
              <img 
                src={newsArticles[0].img} 
                alt={newsArticles[0].title}
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-750"
              />
              <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-black border border-zinc-700 text-white rounded text-[10px] font-bold font-mono tracking-wider">
                FEATURED
              </div>
            </div>
            
            <div className="md:col-span-5 p-8 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-[10px] font-mono text-zinc-500 uppercase tracking-wider font-bold">
                  <span className="text-[#ea580c]">{newsArticles[0].category}</span>
                  <span>•</span>
                  <span>{newsArticles[0].date}</span>
                </div>
                
                <h2 className="text-xl md:text-2xl font-black font-mono tracking-tight text-zinc-950 uppercase leading-snug group-hover:text-[#ea580c] transition-colors">
                  {newsArticles[0].title}
                </h2>
                
                <p className="text-xs md:text-sm text-zinc-600 leading-relaxed line-clamp-4">
                  {newsArticles[0].desc}
                </p>
              </div>

              <div className="pt-6 border-t border-zinc-150 mt-6 flex justify-between items-center">
                <span className="text-[10px] text-zinc-500 font-mono flex items-center gap-1.5 font-bold uppercase">
                  <User className="w-3.5 h-3.5 text-[#ea580c]" /> {newsArticles[0].author}
                </span>
                
                <span className="text-xs font-bold text-[#ea580c] font-mono uppercase tracking-wider flex items-center gap-1">
                  Read Article <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Other articles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {newsArticles.slice(1).map(article => (
            <GlassCard key={article.id} className="overflow-hidden border border-zinc-200 rounded-2xl shadow-sm bg-white hover:shadow-md transition-shadow group flex flex-col justify-between h-full">
              <div>
                <div className="relative aspect-video w-full overflow-hidden border-b border-zinc-200 bg-zinc-50">
                  <img 
                    src={article.img} 
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-750"
                  />
                  <div className="absolute top-4 left-4 z-10 px-2 py-0.5 bg-[#ea580c] border border-orange-600 text-white rounded text-[9px] font-bold font-mono tracking-wider">
                    {article.category}
                  </div>
                </div>
                
                <div className="p-6 space-y-3">
                  <span className="text-[9px] font-mono text-zinc-500 tracking-wider font-bold">{article.date}</span>
                  <h3 className="text-base font-bold font-mono tracking-tight text-zinc-950 uppercase leading-snug group-hover:text-[#ea580c] transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-xs text-zinc-600 leading-relaxed line-clamp-3">
                    {article.desc}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-4 border-t border-zinc-100 flex justify-between items-center">
                <span className="text-[9px] text-zinc-500 font-mono flex items-center gap-1 font-bold uppercase">
                  <User className="w-3 h-3 text-[#ea580c]" /> {article.author}
                </span>
                
                <span className="text-[10px] font-bold text-[#ea580c] font-mono uppercase tracking-wider flex items-center gap-0.5">
                  Read More <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </GlassCard>
          ))}
        </div>

      </div>
    </div>
  );
}

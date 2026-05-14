"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Code2, GraduationCap, Laptop, Sparkles, Terminal } from "lucide-react";
import { MentorMarquee } from "@/components/academy/MentorMarquee";
import { CourseCard } from "@/components/academy/CourseCard";
import { courses } from "@/lib/academy/data";

export default function AcademyLanding() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.03]" />
        
        {/* Animated Background Elements */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#eab308]/10 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#ca8a04]/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#eab308]/30 bg-[#eab308]/10 mb-6">
                <Sparkles className="h-4 w-4 text-[#eab308]" />
                <span className="text-[10px] font-mono text-[#eab308] uppercase tracking-widest">Healix Academy</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
                Build <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#eab308] to-[#fde047]">Production-Grade</span> <br/>
                Engineering Skills
              </h1>
              
              <p className="text-lg text-white/60 mb-10 max-w-xl leading-relaxed">
                Personal mentorship from elite engineers and researchers shaping real systems. Learn by building scalable, enterprise-ready architectures.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/register">
                  <button className="w-full sm:w-auto px-8 py-4 bg-[#eab308] text-black font-bold rounded-xl hover:bg-[#ca8a04] transition-all shadow-[0_0_30px_rgba(234,179,8,0.3)] hover:scale-105 active:scale-95 flex items-center justify-center gap-2">
                    Apply Now <ArrowRight className="w-5 h-5" />
                  </button>
                </Link>
                <Link href="#courses">
                  <button className="w-full sm:w-auto px-8 py-4 bg-white/5 text-white font-bold rounded-xl hover:bg-white/10 transition-all border border-white/10 flex items-center justify-center gap-2">
                    Explore Tracks <Terminal className="w-5 h-5" />
                  </button>
                </Link>
              </div>
            </motion.div>

            {/* Right side abstract visual */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative w-full aspect-square max-w-[500px] mx-auto">
                <div className="absolute inset-0 border border-[#eab308]/20 rounded-full animate-[spin_20s_linear_infinite]" />
                <div className="absolute inset-8 border border-dashed border-[#eab308]/20 rounded-full animate-[spin_30s_linear_infinite_reverse]" />
                
                {/* Floating Tech Cards */}
                <motion.div 
                  animate={{ y: [0, -20, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-10 right-10 bg-black/80 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex items-center gap-3 shadow-2xl"
                >
                  <div className="p-2 bg-blue-500/20 rounded-lg"><Code2 className="w-5 h-5 text-blue-400" /></div>
                  <div>
                    <div className="text-xs text-white/50">Stack</div>
                    <div className="text-sm font-bold">Next.js + TS</div>
                  </div>
                </motion.div>

                <motion.div 
                  animate={{ y: [0, 20, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute bottom-20 left-0 bg-black/80 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex items-center gap-3 shadow-2xl"
                >
                  <div className="p-2 bg-green-500/20 rounded-lg"><Terminal className="w-5 h-5 text-green-400" /></div>
                  <div>
                    <div className="text-xs text-white/50">Infrastructure</div>
                    <div className="text-sm font-bold">K8s & Docker</div>
                  </div>
                </motion.div>

                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-48 h-48 bg-gradient-to-br from-[#eab308]/20 to-black rounded-full border border-[#eab308]/40 flex items-center justify-center backdrop-blur-xl shadow-[0_0_50px_rgba(234,179,8,0.2)]">
                    <GraduationCap className="w-20 h-20 text-[#eab308]" />
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Marquee Section */}
      <MentorMarquee />

      {/* Courses Section */}
      <section id="courses" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Our Elite Programs</h2>
            <p className="text-white/60 max-w-2xl mx-auto text-lg">
              Rigorous, project-based curriculums designed to bridge the gap between academic theory and production-grade engineering.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {courses.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </section>
      
    </div>
  );
}

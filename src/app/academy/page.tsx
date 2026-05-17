"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { 
  ArrowRight, Terminal, Users, Play, 
  Zap, Shield, Globe, Star,
  MessageSquare, BarChart, Rocket, Award
} from "lucide-react";
import { MentorMarquee } from "@/components/academy/MentorMarquee";
import { CourseCard } from "@/components/academy/CourseCard";
import { getCourses, getMentors } from "@/lib/academy/db";
import { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";

export default function AcademyLanding() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [courses, setCourses] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [mentors, setMentors] = useState<any[]>([]);

  useEffect(() => {
    getCourses().then(setCourses);
    getMentors().then(setMentors);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#eab308]/30">
      
      {/* ── 1. HERO SECTION ── */}
      <section className="relative pt-32 pb-24 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#eab308]/30 bg-[#eab308]/10 mb-8 mx-auto">
            <span className="w-2 h-2 rounded-full bg-[#eab308] animate-pulse" />
            <span className="text-[10px] font-mono text-[#eab308] uppercase tracking-widest">Applications open for 2026 Cohort</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 max-w-4xl mx-auto">
            Master production-grade <br className="hidden md:block"/> engineering and research.
          </h1>
          
          <p className="text-xl text-white/60 mb-12 max-w-2xl mx-auto leading-relaxed">
            Intensive, mentor-led programs taught by engineers from top institutions. 
            Build real systems, master modern stacks, and accelerate your career.
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="px-8 h-14 text-base">
                Apply Now <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link href="#courses">
              <Button variant="outline" size="lg" className="px-8 h-14 text-base bg-white/5">
                Explore Programs
              </Button>
            </Link>
          </div>

          <div className="mt-20 pt-10 border-t border-white/5 flex flex-wrap justify-center gap-12 sm:gap-24 opacity-60">
            <div className="text-center">
              <p className="text-3xl font-bold text-white mb-1">1.2k+</p>
              <p className="text-[10px] font-mono uppercase tracking-widest text-white/50">Alumni Network</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-white mb-1">94%</p>
              <p className="text-[10px] font-mono uppercase tracking-widest text-white/50">Placement Rate</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-white mb-1">1:1</p>
              <p className="text-[10px] font-mono uppercase tracking-widest text-white/50">Mentorship</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. MARQUEE SECTION ── */}
      <MentorMarquee mentors={mentors} />

      {/* ── 3. METHODOLOGY ── */}
      <section className="py-40 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6">Built by practitioners, <br/> not instructors.</h2>
            <p className="text-white/50 text-xl max-w-2xl mx-auto">We don't teach from slides. We teach from real system architectures and production codebases.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                title: "Project-First", 
                desc: "Every module culminates in a live capstone project. Build real systems, not toy examples.", 
                icon: Rocket,
                color: "text-[#eab308]" 
              },
              { 
                title: "1:1 Mentorship", 
                desc: "Direct access to staff engineers from Stripe, Google, and IIT. No teaching assistants.", 
                icon: MessageSquare,
                color: "text-blue-400" 
              },
              { 
                title: "Vetted Network", 
                desc: "Join an elite community of builders. Lifetime access to our private engineering Slack.", 
                icon: Users,
                color: "text-purple-400" 
              }
            ].map((item, i) => (
              <GlassCard key={i} className="p-12 border-white/5 group hover:bg-white/[0.02] transition-all h-full">
                <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-8 ${item.color}`}>
                  <item.icon className="w-7 h-7" />
                </div>
                <h4 className="text-2xl font-bold mb-4 tracking-tight">{item.title}</h4>
                <p className="text-white/50 leading-relaxed">{item.desc}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. COURSES SECTION ── */}
      <section id="courses" className="py-40 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-20">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6">Choose your track.</h2>
              <p className="text-white/50 text-lg">Specialized programs for different career trajectories. Every track is clinical-grade and industry-validated.</p>
            </div>
            <Link href="/academy/courses">
              <Button variant="outline" className="px-8 h-14 rounded-xl gap-2">
                All Programs <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {courses.map(course => {
              const mentorId = Array.isArray(course.mentors) ? course.mentors[0] : null;
              const mentor = mentors.find(m => m.id === mentorId) || null;
              return <CourseCard key={course.id} course={{ ...course, mentor }} />;
            })}
          </div>
        </div>
      </section>

      {/* ── 5. MENTOR TEASER ── */}
      <section className="py-40">
        <div className="max-w-7xl mx-auto px-6">
          <GlassCard className="p-16 md:p-24 border-white/5 bg-white/[0.02] relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-8">Mentors from <br/> top institutions.</h2>
                <p className="text-white/60 text-lg mb-12 leading-relaxed">
                  Learn directly from those who built the infrastructure you use every day. Our mentors are vetted for both technical excellence and pedagogical skill.
                </p>
                <Link href="/academy/mentors">
                  <Button size="lg" className="px-8 h-14">
                    Meet the Faculty <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-6">
                {mentors.slice(0, 4).map((mentor, i) => (
                  <GlassCard key={i} className="p-6 text-center border-white/5 hover:border-white/20 transition-all flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full overflow-hidden border border-white/10 mb-4">
                      <Image 
                        src={mentor.photoUrl || "https://i.pravatar.cc/150"} 
                        alt={mentor.name} 
                        width={64} 
                        height={64} 
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <p className="text-sm font-bold text-white mb-1">{mentor.name}</p>
                    <p className="text-[10px] font-mono text-white/50 uppercase tracking-widest">{mentor.institution}</p>
                  </GlassCard>
                ))}
              </div>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* ── 5.5 EXAMS MARQUEE ── */}
      <section className="py-24 overflow-hidden relative bg-black">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay pointer-events-none" />
        <div className="text-center mb-16 relative z-10">
          <p className="text-[12px] font-mono text-white/50 uppercase tracking-[0.4em]">Preparing students for top medical institutions</p>
        </div>
        
        {/* Marquee Container */}
        <div className="relative w-full overflow-hidden flex flex-col gap-12 whitespace-nowrap">
          {/* Gradient Masks */}
          <div className="absolute left-0 top-0 bottom-0 w-32 md:w-64 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 md:w-64 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />
          
          {/* Row 1 (Leftwards) */}
          <motion.div 
            className="flex gap-20 min-w-max"
            animate={{ x: [0, -1800] }}
            transition={{ repeat: Infinity, ease: "linear", duration: 40 }}
          >
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex gap-20 items-center">
                {[
                  { name: 'NEET PG', color: 'text-blue-500' },
                  { name: 'USMLE', color: 'text-red-500' },
                  { name: 'PLAB', color: 'text-purple-500' },
                  { name: 'INICET', color: 'text-emerald-500' },
                  { name: 'FMGE', color: 'text-yellow-500' }
                ].map((exam, idx) => (
                  <div key={idx} className="flex items-center justify-center opacity-50 hover:opacity-100 transition-all duration-300 grayscale hover:grayscale-0 scale-95 hover:scale-105 cursor-pointer">
                    <span className={`text-4xl md:text-5xl font-black tracking-tighter ${exam.color}`}>
                      {exam.name}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </motion.div>

          {/* Row 2 (Rightwards) */}
          <motion.div 
            className="flex gap-20 min-w-max ml-[-800px]"
            animate={{ x: [-1800, 0] }}
            transition={{ repeat: Infinity, ease: "linear", duration: 45 }}
          >
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex gap-20 items-center">
                {[
                  { name: 'MRCP', color: 'text-indigo-500' },
                  { name: 'MRCS', color: 'text-cyan-500' },
                  { name: 'AIIMS', color: 'text-amber-500' },
                  { name: 'JIPMER', color: 'text-rose-500' },
                  { name: 'NEXT', color: 'text-teal-500' }
                ].map((exam, idx) => (
                  <div key={idx} className="flex items-center justify-center opacity-50 hover:opacity-100 transition-all duration-300 grayscale hover:grayscale-0 scale-95 hover:scale-105 cursor-pointer">
                    <span className={`text-4xl md:text-5xl font-black tracking-tighter ${exam.color}`}>
                      {exam.name}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── 6. FINAL CTA ── */}
      <section className="pb-40 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-12">Apply for the <br/> 2026 cohort.</h2>
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            <Link href="/register">
              <Button size="lg" className="px-12 h-16 text-lg">
                Start Application
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg" className="px-12 h-16 text-lg">
                Book Intro Call
              </Button>
            </Link>
          </div>
          <p className="text-xs font-mono text-white/20 uppercase tracking-[0.5em]">Selective Admission · Limited Seats · Unlimited Impact</p>
        </div>
      </section>
      
    </div>
  );
}

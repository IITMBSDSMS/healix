"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { 
  ArrowRight, Code2, GraduationCap, Laptop, 
  Sparkles, Terminal, Users, Play, 
  Zap, ShieldCheck, Globe, Star,
  MessageSquare, BarChart, Rocket
} from "lucide-react";
import { MentorMarquee } from "@/components/academy/MentorMarquee";
import { CourseCard } from "@/components/academy/CourseCard";
import { getCourses } from "@/lib/academy/db";
import { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";

export default function AcademyLanding() {
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    getCourses().then(setCourses);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#eab308]/30">
      
      {/* ── 1. HERO SECTION ── */}
      <section className="relative pt-40 pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.03]" />
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#eab308]/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-7"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#eab308]/30 bg-[#eab308]/10 mb-8">
                <Sparkles className="h-4 w-4 text-[#eab308]" />
                <span className="text-[10px] font-mono text-[#eab308] uppercase tracking-widest">Enrollment Open for 2026</span>
              </div>
              
              <h1 className="text-5xl md:text-8xl font-bold tracking-tighter mb-8 leading-[0.95]">
                Build <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#eab308] to-[#fde047]">Production-Grade</span> <br/>
                Engineering Skills.
              </h1>
              
              <p className="text-xl text-white/50 mb-12 max-w-2xl leading-relaxed font-light">
                Personal mentorship from elite staff engineers and researchers. Bridge the gap between theory and industry-scale systems.
              </p>
              
              <div className="flex flex-wrap items-center gap-6">
                <Link href="/register">
                  <Button size="lg" className="px-10 h-16 text-lg">
                    Apply Now <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="#courses" className="flex items-center gap-3 text-sm font-semibold text-white/70 hover:text-white transition-all group">
                  Explore Tracks <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[#eab308]" />
                </Link>
              </div>

              <div className="mt-16 flex items-center gap-8 grayscale opacity-40">
                <div className="flex flex-col">
                  <span className="text-2xl font-bold">1.2k+</span>
                  <span className="text-[10px] font-mono uppercase tracking-widest">Alumni</span>
                </div>
                <div className="w-px h-10 bg-white/10" />
                <div className="flex flex-col">
                  <span className="text-2xl font-bold">94%</span>
                  <span className="text-[10px] font-mono uppercase tracking-widest">Hire Rate</span>
                </div>
                <div className="w-px h-10 bg-white/10" />
                <div className="flex flex-col">
                  <span className="text-2xl font-bold">1:1</span>
                  <span className="text-[10px] font-mono uppercase tracking-widest">Mentorship</span>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="lg:col-span-5 relative"
            >
              <GlassCard className="p-8 border-white/10 bg-white/[0.01] backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <Terminal className="h-64 w-64 text-[#eab308]" />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500/50" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                      <div className="w-3 h-3 rounded-full bg-green-500/50" />
                    </div>
                    <span className="text-[10px] font-mono text-white/20 uppercase tracking-widest">main.ts — healix-os</span>
                  </div>
                  <pre className="text-sm font-mono text-white/70 space-y-2 overflow-x-auto">
                    <code>{`class Infrastructure {
  static async deploy(service) {
    const mesh = await Healix.init();
    return await mesh.scale(service, {
      nodes: 'auto',
      intelligence: true
    });
  }
}`}</code>
                  </pre>
                  <div className="mt-12 p-4 rounded-xl bg-[#eab308]/10 border border-[#eab308]/20 flex items-center gap-4">
                    <div className="p-2 bg-[#eab308] rounded-lg text-black">
                      <Zap className="w-4 h-4" />
                    </div>
                    <p className="text-xs font-bold text-[#eab308] uppercase tracking-widest italic">Optimizing for 2026 Batch</p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 2. MARQUEE SECTION ── */}
      <MentorMarquee />

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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {courses.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. MENTOR TEASER ── */}
      <section className="py-40">
        <div className="max-w-7xl mx-auto px-6">
          <GlassCard className="p-16 md:p-24 border-[#eab308]/20 bg-gradient-to-br from-[#eab308]/5 to-transparent relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-5">
              <Users className="h-96 w-96 text-[#eab308]" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div>
                <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-8 leading-[0.95]">Mentors from <br/> top institutions.</h2>
                <p className="text-white/50 text-xl mb-12 leading-relaxed">
                  Learn directly from those who built the infrastructure you use every day. Our mentors are vetted for both technical excellence and pedagogical skill.
                </p>
                <Link href="/academy/mentors">
                  <Button size="lg" className="px-10 h-16">
                    Meet the Faculty <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { name: "IIT Madras", role: "AI Partners" },
                  { name: "Stanford", role: "Clinical AI" },
                  { name: "Google Cloud", role: "Infra Mentors" },
                  { name: "YC Fellows", role: "Startup Scale" },
                ].map((item, i) => (
                  <GlassCard key={i} className="p-8 text-center border-white/5 group hover:border-[#eab308]/20 transition-all">
                    <p className="text-base font-bold text-white mb-1">{item.name}</p>
                    <p className="text-[10px] font-mono text-[#eab308] uppercase tracking-widest">{item.role}</p>
                  </GlassCard>
                ))}
              </div>
            </div>
          </GlassCard>
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

"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { getCourseBySlug } from "@/lib/academy/db";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { 
  Clock, BarChart, Users, CheckCircle2, 
  ArrowRight, Play, BookOpen, GraduationCap,
  Award, Zap, ChevronDown, MessageSquare,
  ExternalLink, Star, Shield, Monitor
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function CourseDetailPage() {
  const { slug } = useParams();
  const [course, setCourse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeModule, setActiveModule] = useState<number | null>(0);
  const router = useRouter();

  useEffect(() => {
    if (slug) {
      getCourseBySlug(slug as string).then(data => {
        setCourse(data);
        setIsLoading(false);
      });
    }
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#eab308]/20 border-t-[#eab308] rounded-full animate-spin" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center gap-4">
        <h1 className="text-4xl font-bold">Course Not Found</h1>
        <Link href="/academy">
          <Button variant="outline">Back to Academy</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* ── Hero Section ── */}
      <section className="relative pt-40 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.03]" />
        <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-[#eab308]/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            
            <div className="lg:col-span-7">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#eab308]/30 bg-[#eab308]/10 mb-6">
                  <Shield className="h-4 w-4 text-[#eab308]" />
                  <span className="text-[10px] font-mono text-[#eab308] uppercase tracking-widest">Healix Certified Program</span>
                </div>
                
                <h1 className="text-4xl md:text-7xl font-bold tracking-tighter mb-6 leading-tight">
                  {course.title}
                </h1>
                
                <p className="text-xl text-white/60 mb-10 leading-relaxed max-w-2xl">
                  {course.longDescription || course.description}
                </p>
                
                <div className="flex flex-wrap gap-6 mb-12">
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10">
                    <Clock className="w-4 h-4 text-[#eab308]" />
                    <span className="text-sm font-medium">{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10">
                    <BarChart className="w-4 h-4 text-[#eab308]" />
                    <span className="text-sm font-medium">{course.difficulty}</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10">
                    <Users className="w-4 h-4 text-[#eab308]" />
                    <span className="text-sm font-medium">{course.seatsRemaining} seats left</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="px-10" onClick={() => router.push("/register")}>
                    Enroll in Cohort <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                  <Button variant="outline" size="lg" className="px-10">
                    Download Syllabus
                  </Button>
                </div>
              </motion.div>
            </div>

            <div className="lg:col-span-5">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
              >
                <GlassCard className="p-2 border-white/10 overflow-hidden group shadow-2xl relative">
                  <div className="relative aspect-video rounded-xl overflow-hidden">
                    <Image 
                      src={course.thumbnail} 
                      alt={course.title}
                      fill
                      className="object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-16 h-16 bg-[#eab308] rounded-full flex items-center justify-center text-black">
                        <Play className="w-8 h-8 fill-current" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-8">
                    <div className="flex items-baseline gap-3 mb-6">
                      <span className="text-4xl font-bold">₹{course.price.toLocaleString()}</span>
                      <span className="text-white/30 line-through text-lg">₹{course.originalPrice.toLocaleString()}</span>
                      <span className="text-emerald-400 text-sm font-bold">Save 40%</span>
                    </div>

                    <div className="space-y-4 mb-8">
                      {[
                        "1:1 Weekly Mentorship",
                        "Live Capstone Projects",
                        "Career Networking Access",
                        "Official Certification",
                        "Lifetime Community Access"
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3 text-sm text-white/70">
                          <CheckCircle2 className="w-4 h-4 text-[#eab308]" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>

                    <Button className="w-full h-14 text-lg" onClick={() => router.push("/register")}>
                      Secure My Seat
                    </Button>
                    <p className="text-center text-[10px] font-mono text-white/30 uppercase tracking-widest mt-4">
                      Launching Early 2026 · Limited Intake
                    </p>
                  </div>
                </GlassCard>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Curriculum Section ── */}
      <section className="py-32 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
            <div className="lg:col-span-5">
              <h2 className="text-4xl font-bold mb-8 tracking-tight">The Curriculum</h2>
              <p className="text-white/50 text-lg mb-12">
                A rigorous, project-first approach to learning. Each module is designed to give you hands-on experience with industry-standard tools and architectures.
              </p>
              
              <div className="space-y-4">
                {course.modules?.map((module: string, idx: number) => (
                  <div 
                    key={idx}
                    onClick={() => setActiveModule(idx === activeModule ? null : idx)}
                    className={`p-6 rounded-2xl border transition-all cursor-pointer ${
                      activeModule === idx 
                        ? 'bg-[#eab308]/5 border-[#eab308]/30' 
                        : 'bg-white/5 border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono text-xs ${
                          activeModule === idx ? 'bg-[#eab308] text-black' : 'bg-white/10 text-white/60'
                        }`}>
                          0{idx + 1}
                        </div>
                        <h4 className="font-bold">{module}</h4>
                      </div>
                      <ChevronDown className={`w-5 h-5 transition-transform ${activeModule === idx ? 'rotate-180 text-[#eab308]' : 'text-white/20'}`} />
                    </div>
                    
                    <AnimatePresence>
                      {activeModule === idx && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="pt-6 pl-12 space-y-3">
                            <p className="text-sm text-white/40 leading-relaxed">
                              Deep dive into the core concepts, implementation details, and architecture patterns associated with {module}. Includes 2 live build sessions.
                            </p>
                            <div className="flex items-center gap-4 text-[10px] font-mono text-[#eab308] uppercase tracking-widest">
                              <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" /> 4 Lessons</span>
                              <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> 1 Lab</span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-7">
              {/* Mentor Profile */}
              <GlassCard className="p-10 border-white/5 mb-8">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="relative w-24 h-24 rounded-2xl overflow-hidden shrink-0 border border-[#eab308]/20">
                    <Image 
                      src={course.mentor?.photoUrl || "https://i.pravatar.cc/200"} 
                      alt={course.mentor?.name}
                      fill
                      className="object-cover grayscale"
                    />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-1">{course.mentor?.name}</h3>
                    <p className="text-[#eab308] font-mono text-xs uppercase tracking-widest mb-4">
                      {course.mentor?.role} · {course.mentor?.institution}
                    </p>
                    <p className="text-white/50 leading-relaxed mb-6">
                      {course.mentor?.bio}
                    </p>
                    <div className="flex gap-4">
                      <Link href={course.mentor?.linkedinUrl || "#"} className="p-2 bg-white/5 rounded-lg hover:bg-[#eab308]/10 hover:text-[#eab308] transition-all">
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                      <Link href="#" className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg text-xs font-bold hover:bg-white/10 transition-all">
                        <MessageSquare className="w-4 h-4" /> Book Intro Call
                      </Link>
                    </div>
                  </div>
                </div>
              </GlassCard>

              {/* Career Outcomes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <GlassCard className="p-8 border-[#eab308]/10 bg-gradient-to-br from-[#eab308]/5 to-transparent">
                  <Award className="w-8 h-8 text-[#eab308] mb-6" />
                  <h4 className="text-xl font-bold mb-4">Career Outcomes</h4>
                  <ul className="space-y-3">
                    {course.outcomes?.map((outcome: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-white/60">
                        <CheckCircle2 className="w-4 h-4 text-[#eab308] shrink-0 mt-0.5" />
                        <span>{outcome}</span>
                      </li>
                    ))}
                  </ul>
                </GlassCard>
                
                <GlassCard className="p-8 border-blue-500/10 bg-gradient-to-br from-blue-500/5 to-transparent">
                  <Monitor className="w-8 h-8 text-blue-400 mb-6" />
                  <h4 className="text-xl font-bold mb-4">Capstone Projects</h4>
                  <ul className="space-y-3">
                    {course.projects?.map((project: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-white/60">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0 mt-2" />
                        <span>{project}</span>
                      </li>
                    ))}
                  </ul>
                </GlassCard>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials Section ── */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Voices of the Cohort</h2>
            <p className="text-white/40">Real results from engineers at top tech institutions.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((_, i) => (
              <GlassCard key={i} className="p-8 border-white/5 hover:border-white/10 transition-all">
                <div className="flex gap-1 mb-6">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star key={star} className="w-4 h-4 fill-[#eab308] text-[#eab308]" />
                  ))}
                </div>
                <p className="text-white/60 mb-8 italic leading-relaxed">
                  "The mentorship here is unlike anything else. You're not just watching videos; you're building production systems alongside staff engineers."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10" />
                  <div>
                    <p className="text-sm font-bold">Elite Graduate {i + 1}</p>
                    <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest">SDE-2 · Top Tech</p>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="pb-32 px-6">
        <GlassCard className="max-w-5xl mx-auto p-16 text-center border-[#eab308]/20 bg-gradient-to-br from-[#eab308]/5 to-transparent">
          <h2 className="text-4xl md:text-6xl font-bold mb-8 tracking-tighter">Ready to build the future?</h2>
          <p className="text-white/50 text-lg mb-12 max-w-xl mx-auto">
            Applications for the 2026 cohort are now open. Secure your mentorship spot today.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <Button size="lg" className="px-12" onClick={() => router.push("/register")}>
              Apply Now
            </Button>
            <Button variant="outline" size="lg" className="px-12" onClick={() => router.back()}>
              Back to Courses
            </Button>
          </div>
        </GlassCard>
      </section>
      
    </div>
  );
}

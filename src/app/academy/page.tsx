"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { 
  ArrowRight, Users, MessageSquare, Rocket
} from "lucide-react";
import { MentorMarquee } from "@/components/academy/MentorMarquee";
import { CourseCard } from "@/components/academy/CourseCard";
import { getCourses, getMentors } from "@/lib/academy/db";
import { useState, useEffect } from "react";
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
    <div className="min-h-screen bg-white text-slate-900 selection:bg-[#ff5500]/30">
      
      {/* ── 1. HERO SECTION (Physics Wallah Style) ── */}
      <section className="relative pt-32 pb-40 bg-[#f4f7fc] text-slate-900 border-b-0 overflow-visible">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Side: Text & CTA */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-left space-y-6"
            >
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-[1.1] text-slate-900">
                India&apos;s <span className="text-[#5a4bda]">Premier & <br/> JEE/NEET Oriented</span> <br/>
                Competitive Exams Academy
              </h1>
              
              <p className="text-lg text-slate-600 max-w-md leading-relaxed">
                Unlock your potential by signing up with Healix Academy— The ultimate learning solution for competitive exams.
              </p>
              
              <div className="pt-4">
                <Button size="lg" className="px-8 h-12 text-base font-semibold bg-[#5a4bda] hover:bg-[#4a3bc0] hover:scale-105 transition-all text-white rounded shadow-lg shadow-[#5a4bda]/30 border-0">
                  Get Started
                </Button>
              </div>
            </motion.div>

            {/* Right Side: Circular Avatars & Bubbles */}
            <div className="relative h-[400px] hidden lg:block">
              {/* Dashed background circles */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] border-[1.5px] border-dashed border-blue-300 rounded-full animate-[spin_60s_linear_infinite]">
                 <div className="absolute -top-1.5 left-1/2 w-3 h-3 bg-blue-400 rounded-full" />
                 <div className="absolute top-1/2 -left-1.5 w-3 h-3 bg-orange-400 rounded-full" />
                 <div className="absolute top-3/4 right-0 w-3 h-3 bg-pink-400 rounded-full" />
              </div>

              {/* Student Avatar (Top Right) */}
              <motion.div 
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-8 right-8 z-20 group"
              >
                <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl overflow-hidden bg-blue-100 flex items-end justify-center hover:scale-105 transition-transform cursor-pointer">
                  <Image src="https://i.pravatar.cc/300?img=5" alt="Student" width={128} height={128} className="object-cover" />
                </div>
                {/* Chat Bubble Student */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1, duration: 0.5 }}
                  className="absolute top-12 -left-48 bg-white px-4 py-3 rounded-xl rounded-tr-none shadow-[0_10px_30px_rgba(0,0,0,0.1)] border border-gray-100 text-[13px] font-semibold text-slate-700 w-48 text-center group-hover:scale-110 transition-transform origin-top-right"
                >
                  Dr. Sarah, What is Healix?
                </motion.div>
              </motion.div>

              {/* Teacher Avatar (Bottom Left) */}
              <motion.div 
                animate={{ y: [0, 15, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-8 left-16 z-20 group"
              >
                <div className="w-40 h-40 rounded-full border-4 border-white shadow-xl overflow-hidden bg-blue-100 flex items-end justify-center hover:scale-105 transition-transform cursor-pointer">
                  <Image src="https://i.pravatar.cc/300?img=11" alt="Teacher" width={160} height={160} className="object-cover" />
                </div>
                {/* Chat Bubble Teacher */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 2, duration: 0.5 }}
                  className="absolute top-8 left-36 bg-[#1e155c] px-5 py-4 rounded-xl rounded-tl-none shadow-[0_10px_30px_rgba(30,21,92,0.3)] text-sm text-white w-64 font-medium leading-relaxed group-hover:scale-105 transition-transform origin-top-left"
                >
                  Healix is where engineers build real clinical systems with mentorship.
                </motion.div>
              </motion.div>

            </div>
          </div>
        </div>

        {/* Bottom overlapping Banner */}
        <div className="absolute bottom-0 left-0 w-full translate-y-1/2 z-30 px-6">
          <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-gray-100 py-8 px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 divide-x divide-gray-100">
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-center px-4 flex flex-col items-center group cursor-pointer"
              >
                <div className="group-hover:-translate-y-1 transition-transform duration-300 w-full flex flex-col items-center">
                  <div className="bg-red-500 text-white font-bold text-[10px] inline-flex px-2 py-1 rounded mb-3 items-center justify-center gap-1 w-max shadow-sm shadow-red-500/20 group-hover:shadow-md group-hover:shadow-red-500/40 transition-shadow">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" /> LIVE
                  </div>
                  <h4 className="font-bold text-slate-900 text-base group-hover:text-red-500 transition-colors">Daily Live</h4>
                  <p className="text-[11px] text-slate-500 mt-1">Interactive classes</p>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-center px-4 group cursor-pointer"
              >
                <div className="group-hover:-translate-y-1 transition-transform duration-300 w-full flex flex-col items-center">
                  <div className="text-2xl mb-2 flex justify-center text-blue-500 group-hover:scale-110 transition-transform">📝</div>
                  <h4 className="font-bold text-slate-900 text-base group-hover:text-blue-600 transition-colors">10 Million +</h4>
                  <p className="text-[11px] text-slate-500 mt-1">Tests, sample papers & notes</p>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="text-center px-4 group cursor-pointer"
              >
                <div className="group-hover:-translate-y-1 transition-transform duration-300 w-full flex flex-col items-center">
                  <div className="text-2xl mb-2 flex justify-center text-purple-500 group-hover:scale-110 transition-transform">🧠</div>
                  <h4 className="font-bold text-slate-900 text-base group-hover:text-purple-600 transition-colors">24 x 7</h4>
                  <p className="text-[11px] text-slate-500 mt-1">Doubt solving sessions</p>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="text-center px-4 group cursor-pointer"
              >
                <div className="group-hover:-translate-y-1 transition-transform duration-300 w-full flex flex-col items-center">
                  <div className="text-2xl mb-2 flex justify-center text-yellow-500 group-hover:scale-110 transition-transform">🏆</div>
                  <h4 className="font-bold text-slate-900 text-base group-hover:text-yellow-600 transition-colors">100 +</h4>
                  <p className="text-[11px] text-slate-500 mt-1">Offline centres</p>
                </div>
              </motion.div>

            </div>
          </div>
        </div>
      </section>

      {/* Spacer to account for the overlapping banner */}
      <div className="h-24 bg-transparent"></div>
      
      {/* ── 2. MARQUEE SECTION ── */}
      <MentorMarquee mentors={mentors} />

      {/* ── 3. METHODOLOGY ── */}
      <section className="py-24 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-slate-900">Built by practitioners, <br/> not instructors.</h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto font-medium">We don&apos;t teach from slides. We teach from real system architectures and production codebases.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                title: "Project-First", 
                desc: "Every module culminates in a live capstone project. Build real systems, not toy examples.", 
                icon: Rocket,
                color: "text-[#ff5500]",
                bg: "bg-[#ff5500]/10"
              },
              { 
                title: "1:1 Mentorship", 
                desc: "Direct access to staff engineers from Stripe, Google, and IIT. No teaching assistants.", 
                icon: MessageSquare,
                color: "text-blue-600",
                bg: "bg-blue-600/10"
              },
              { 
                title: "Vetted Network", 
                desc: "Join an elite community of builders. Lifetime access to our private engineering Slack.", 
                icon: Users,
                color: "text-purple-600",
                bg: "bg-purple-600/10"
              }
            ].map((item, i) => (
              <div key={i} className="p-10 rounded-2xl bg-white shadow-[0_10px_40px_rgba(0,0,0,0.06)] border border-gray-100 hover:-translate-y-2 transition-transform duration-300 h-full flex flex-col">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${item.bg} ${item.color}`}>
                  <item.icon className="w-7 h-7" />
                </div>
                <h4 className="text-2xl font-bold mb-3 tracking-tight text-slate-900">{item.title}</h4>
                <p className="text-slate-500 leading-relaxed font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. COURSES SECTION ── */}
      <section id="courses" className="py-24 bg-[#f2b992]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-4xl md:text-5xl font-extrabold text-black tracking-tight mb-4">Our Courses</h2>
            <p className="text-black/90 font-bold text-lg md:text-xl max-w-4xl mx-auto leading-snug">
              Being true Mentors, our objective is to guide the students on the track of their academic growth by bringing out their latent potential
            </p>
          </div>

          <div className="flex justify-center mb-12">
            <div className="flex bg-[#ff5500] rounded overflow-hidden shadow-lg border border-[#ff5500]">
               <button className="px-8 py-3 text-white font-bold bg-[#ff7b3a] transition-colors border-r border-[#ff7b3a]">Foundation</button>
               <button className="px-8 py-3 text-white font-bold hover:bg-[#ff7b3a] transition-colors border-r border-[#ff7b3a]">Engineering</button>
               <button className="px-8 py-3 text-white font-bold hover:bg-[#ff7b3a] transition-colors">Medical</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {courses.map(course => {
              const mentorId = Array.isArray(course.mentors) ? course.mentors[0] : null;
              const mentor = mentors.find(m => m.id === mentorId) || null;
              return <CourseCard key={course.id} course={{ ...course, mentor }} />;
            })}
          </div>
          
          <div className="flex justify-center gap-4 mt-12">
             <button className="w-10 h-10 rounded-full bg-[#ff5500] text-white flex items-center justify-center font-bold text-xl hover:scale-110 transition-transform shadow-lg shadow-[#ff5500]/40">&lt;</button>
             <button className="w-10 h-10 rounded-full bg-[#ff5500] text-white flex items-center justify-center font-bold text-xl hover:scale-110 transition-transform shadow-lg shadow-[#ff5500]/40">&gt;</button>
          </div>
        </div>
      </section>

      {/* ── 5. MENTOR TEASER ── */}
      <section className="py-24 bg-[#f8f9fc]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="p-12 md:p-16 rounded-3xl border border-gray-200 bg-white shadow-xl relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
              <div>
                <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 text-slate-900">Mentors from <br/> top institutions.</h2>
                <p className="text-slate-600 text-lg mb-10 leading-relaxed font-medium">
                  Learn directly from those who built the infrastructure you use every day. Our mentors are vetted for both technical excellence and pedagogical skill.
                </p>
                <Link href="/academy/mentors">
                  <Button size="lg" className="px-8 h-14 bg-[#5a4bda] hover:bg-[#4a3bc0] text-white">
                    Meet the Faculty <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-6">
                {mentors.slice(0, 4).map((mentor, i) => (
                  <div key={i} className="p-6 rounded-2xl text-center border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col items-center bg-white">
                    <div className="w-16 h-16 rounded-full overflow-hidden mb-4 shadow-sm border border-gray-100">
                      <Image 
                        src={mentor.photoUrl || "https://i.pravatar.cc/150"} 
                        alt={mentor.name} 
                        width={64} 
                        height={64} 
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <p className="text-sm font-bold text-slate-900 mb-1">{mentor.name}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{mentor.institution}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5.5 EXAMS MARQUEE ── */}
      <section className="py-24 overflow-hidden relative bg-white border-y border-gray-100">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.01] mix-blend-overlay pointer-events-none" />
        <div className="text-center mb-16 relative z-10">
          <p className="text-[12px] font-bold text-slate-400 uppercase tracking-[0.4em]">Preparing students for top institutions & competitive exams</p>
        </div>
        
        {/* Marquee Container */}
        <div className="relative w-full overflow-hidden flex flex-col gap-12 whitespace-nowrap">
          {/* Gradient Masks */}
          <div className="absolute left-0 top-0 bottom-0 w-32 md:w-64 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 md:w-64 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
          
          {/* Row 1 (Leftwards) */}
          <motion.div 
            className="flex gap-20 min-w-max"
            animate={{ x: [0, -2200] }}
            transition={{ repeat: Infinity, ease: "linear", duration: 45 }}
          >
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex gap-20 items-center">
                {[
                  { name: 'NEET PG', color: 'text-blue-500' },
                  { name: 'JEE MAIN', color: 'text-yellow-500' },
                  { name: 'USMLE', color: 'text-red-500' },
                  { name: 'MHCET', color: 'text-orange-500' },
                  { name: 'PLAB', color: 'text-purple-500' },
                  { name: 'CBSE BOARD', color: 'text-emerald-500' }
                ].map((exam, idx) => (
                  <div key={idx} className="flex items-center justify-center opacity-70 hover:opacity-100 transition-all duration-300 grayscale hover:grayscale-0 scale-95 hover:scale-105 cursor-pointer">
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
            className="flex gap-20 min-w-max ml-[-1200px]"
            animate={{ x: [-2200, 0] }}
            transition={{ repeat: Infinity, ease: "linear", duration: 50 }}
          >
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex gap-20 items-center">
                {[
                  { name: 'MRCP', color: 'text-indigo-500' },
                  { name: 'JEE ADVANCED', color: 'text-rose-500' },
                  { name: 'AIIMS', color: 'text-amber-500' },
                  { name: 'INICET', color: 'text-cyan-500' },
                  { name: 'FMGE', color: 'text-yellow-500' },
                  { name: 'JIPMER', color: 'text-teal-500' }
                ].map((exam, idx) => (
                  <div key={idx} className="flex items-center justify-center opacity-70 hover:opacity-100 transition-all duration-300 grayscale hover:grayscale-0 scale-95 hover:scale-105 cursor-pointer">
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
      <section className="py-24 bg-[#ff5500] text-white px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-8">Apply for the <br/> 2026 cohort.</h2>
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            <Link href="/register">
              <Button size="lg" className="px-12 h-16 text-lg bg-white text-[#ff5500] hover:bg-gray-100 hover:scale-105 transition-all shadow-xl font-bold">
                Start Application
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg" className="px-12 h-16 text-lg border-white text-white hover:bg-white hover:text-[#ff5500] hover:scale-105 transition-all font-bold">
                Book Intro Call
              </Button>
            </Link>
          </div>
          <p className="text-xs font-bold text-white/80 uppercase tracking-[0.3em]">Selective Admission · Limited Seats · Unlimited Impact</p>
        </div>
      </section>
      
    </div>
  );
}

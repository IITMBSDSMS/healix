"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { 
  Users, MessageSquare, Rocket
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
      <section className="relative pt-24 md:pt-32 pb-16 md:pb-40 bg-[#f4f7fc] text-slate-900 border-b-0 overflow-visible">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Side: Text & CTA */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left space-y-6"
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.15] text-slate-900">
                India&apos;s <span className="text-[#5a4bda]">Premier &amp; JEE/NEET Oriented</span>{" "}
                Competitive Exams Academy
              </h1>
              
              <p className="text-base md:text-lg text-slate-600 max-w-md leading-relaxed mx-auto lg:mx-0">
                Unlock your potential by signing up with Healix Academy— The ultimate learning solution for competitive exams.
              </p>
              
              <div className="pt-4 flex justify-center lg:justify-start gap-3 flex-wrap">
                <Button size="lg" className="px-8 h-12 text-base font-semibold bg-[#5a4bda] hover:bg-[#4a3bc0] hover:scale-105 transition-all text-white rounded shadow-lg shadow-[#5a4bda]/30 border-0">
                  Get Started
                </Button>
                <Link href="#courses">
                  <Button variant="outline" size="lg" className="px-8 h-12 text-base font-semibold border-slate-300 text-slate-700 hover:border-[#5a4bda] hover:text-[#5a4bda] rounded">
                    View Courses
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Right Side: Rich Interactive Visual */}
            <div className="relative h-[460px] hidden lg:flex items-center justify-center">

              {/* ── Outer glow ring ── */}
              <div className="absolute w-[420px] h-[420px] rounded-full border border-[#5a4bda]/15 animate-[spin_80s_linear_infinite]">
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#5a4bda] shadow-[0_0_12px_4px_rgba(90,75,218,0.5)]" />
                <div className="absolute top-1/2 -right-2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#ff5500] shadow-[0_0_10px_3px_rgba(255,85,0,0.5)]" />
              </div>

              {/* ── Inner ring ── */}
              <div className="absolute w-[280px] h-[280px] rounded-full border border-dashed border-blue-300/50 animate-[spin_40s_linear_infinite_reverse]">
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-pink-400 shadow-[0_0_8px_3px_rgba(244,114,182,0.6)]" />
                <div className="absolute top-1/4 -left-2 w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_3px_rgba(52,211,153,0.5)]" />
              </div>

              {/* ── Central glowing core ── */}
              <div className="absolute w-[140px] h-[140px] rounded-full bg-gradient-to-br from-[#5a4bda] to-[#8b5cf6] shadow-[0_0_60px_20px_rgba(90,75,218,0.25)] flex items-center justify-center z-10">
                <div className="text-center text-white">
                  <div className="text-3xl font-black leading-none">H</div>
                  <div className="text-[9px] font-bold tracking-[0.2em] uppercase mt-1 opacity-80">Healix</div>
                </div>
              </div>

              {/* ── Student avatar (top right, orbiting) ── */}
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                className="absolute w-[380px] h-[380px] rounded-full"
                style={{ transformOrigin: "center center" }}
              >
                <motion.div
                  animate={{ rotate: [0, -360] }}
                  transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                  className="absolute -top-16 left-1/2 -translate-x-1/2 group cursor-pointer"
                >
                  <div className="relative">
                    <div className="w-[70px] h-[70px] rounded-full border-3 border-white shadow-xl overflow-hidden ring-4 ring-[#5a4bda]/30">
                      <Image src="https://i.pravatar.cc/150?img=5" alt="Student" width={70} height={70} className="object-cover w-full h-full" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-400 border-2 border-white flex items-center justify-center text-[8px] font-black text-white shadow">✓</div>
                    <div className="absolute top-1/2 -translate-y-1/2 left-full ml-3 bg-white rounded-2xl rounded-tl-none px-4 py-2.5 shadow-xl border border-gray-100 whitespace-nowrap text-xs font-bold text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                      JEE 2025 Dropper 🎯
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              {/* ── Mentor avatar (bottom left, counter-orbiting) ── */}
              <motion.div
                animate={{ rotate: [0, -360] }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute w-[300px] h-[300px] rounded-full"
              >
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                  className="absolute -bottom-14 left-1/2 -translate-x-1/2 group cursor-pointer"
                >
                  <div className="relative">
                    <div className="w-[80px] h-[80px] rounded-full border-3 border-white shadow-xl overflow-hidden ring-4 ring-[#ff5500]/30">
                      <Image src="https://i.pravatar.cc/150?img=33" alt="Mentor" width={80} height={80} className="object-cover w-full h-full" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#ff5500] border-2 border-white flex items-center justify-center text-[8px] text-white font-black shadow">★</div>
                  </div>
                </motion.div>
              </motion.div>

              {/* ── Floating chat bubble (student question) ── */}
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: [0, -6, 0], scale: 1 }}
                transition={{ delay: 0.8, duration: 0.5, y: { delay: 1, duration: 4, repeat: Infinity, ease: "easeInOut" } }}
                className="absolute top-6 right-4 z-20 bg-white rounded-2xl rounded-tr-none shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-gray-100 px-4 py-3 max-w-[180px]"
              >
                <p className="text-xs font-bold text-slate-700 leading-snug">Which chapters are most important for NEET Physics? 📚</p>
                <div className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full overflow-hidden border-2 border-white shadow">
                  <Image src="https://i.pravatar.cc/40?img=5" alt="" width={24} height={24} className="object-cover" />
                </div>
              </motion.div>

              {/* ── Floating reply bubble (mentor answer) ── */}
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: [0, 6, 0], scale: 1 }}
                transition={{ delay: 1.6, duration: 0.5, y: { delay: 1.8, duration: 5, repeat: Infinity, ease: "easeInOut" } }}
                className="absolute bottom-14 left-0 z-20 bg-gradient-to-br from-[#1e155c] to-[#5a4bda] rounded-2xl rounded-bl-none shadow-[0_8px_30px_rgba(30,21,92,0.35)] px-4 py-3 max-w-[200px]"
              >
                <p className="text-xs font-bold text-white/90 leading-snug">Thermodynamics &amp; Laws of Motion — master these first! ⚡</p>
                <div className="mt-2 flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded-full overflow-hidden border border-white/30">
                    <Image src="https://i.pravatar.cc/40?img=33" alt="" width={16} height={16} className="object-cover" />
                  </div>
                  <span className="text-[9px] text-white/60 font-medium">Dr. Arvind Rao</span>
                </div>
              </motion.div>

              {/* ── Floating subject pills ── */}
              <motion.div
                animate={{ y: [-4, 4, -4] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/4 left-0 z-20 bg-white rounded-full px-3 py-1.5 shadow-lg border border-gray-100 text-[10px] font-black text-[#5a4bda] uppercase tracking-wide"
              >
                ⚗️ Chemistry
              </motion.div>
              <motion.div
                animate={{ y: [4, -4, 4] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute top-1/3 right-0 z-20 bg-white rounded-full px-3 py-1.5 shadow-lg border border-gray-100 text-[10px] font-black text-[#ff5500] uppercase tracking-wide"
              >
                🔢 Maths
              </motion.div>
              <motion.div
                animate={{ y: [-3, 5, -3] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-1/4 right-4 z-20 bg-white rounded-full px-3 py-1.5 shadow-lg border border-gray-100 text-[10px] font-black text-emerald-600 uppercase tracking-wide"
              >
                ⚡ Physics
              </motion.div>

            </div>
          </div>
        </div>

        {/* Bottom overlapping Banner */}
        <div className="absolute bottom-0 left-0 w-full translate-y-1/2 z-30 px-4 md:px-6">
          <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-gray-100 py-6 md:py-8 px-3 md:px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 md:divide-x md:divide-gray-100">
              
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
      <div className="h-20 md:h-24 bg-transparent"></div>
      
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
      <section id="courses" className="py-12 md:py-24 bg-gradient-to-b from-[#f2b992] to-[#e8ad85] relative overflow-hidden">
        
        {/* ── SVG Dotted Grid Overlay ── */}
        <svg className="absolute inset-0 w-full h-full opacity-35 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="courses-grid" width="36" height="36" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="#ffffff" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#courses-grid)" />
        </svg>

        {/* ── SVG Wavy Vector Path ── */}
        <svg className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" viewBox="0 0 1440 800" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M-100,200 C300,400 600,100 1000,300 C1300,450 1500,250 1600,350 L1600,900 L-100,900 Z" fill="#ffffff" />
          <path d="M-50,250 C350,450 650,150 1050,350 C1350,500 1550,300 1650,400 L1650,900 L-50,900 Z" fill="#ff5500" opacity="0.15" />
        </svg>

        {/* ── SVG Floating Accent Glows ── */}
        <div className="absolute top-12 left-[-10%] w-[45%] h-[45%] rounded-full bg-white/25 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-12 right-[-10%] w-[45%] h-[45%] rounded-full bg-[#ff5500]/20 blur-[120px] pointer-events-none" />

        {/* ── Floating Educational SVGs ── */}
        {/* Atom (Top Left) */}
        <svg className="absolute top-16 left-12 w-20 h-20 text-white/20 animate-[spin_30s_linear_infinite] pointer-events-none hidden md:block" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
          <ellipse cx="50" cy="50" rx="40" ry="12" transform="rotate(30, 50, 50)" />
          <ellipse cx="50" cy="50" rx="40" ry="12" transform="rotate(90, 50, 50)" />
          <ellipse cx="50" cy="50" rx="40" ry="12" transform="rotate(150, 50, 50)" />
          <circle cx="50" cy="50" r="6" fill="currentColor" />
        </svg>

        {/* Benzene Ring (Bottom Left) */}
        <svg className="absolute bottom-16 left-10 w-24 h-24 text-white/15 pointer-events-none hidden lg:block" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polygon points="50,10 85,30 85,70 50,90 15,70 15,30" />
          <polygon points="50,18 78,34 78,66 50,82 22,66 22,34" strokeDasharray="6 4" />
        </svg>

        {/* Integral Symbol (Top Right) */}
        <svg className="absolute top-10 right-20 w-16 h-28 text-white/20 pointer-events-none hidden md:block" viewBox="0 0 50 100" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
          <path d="M35,15 C30,10 20,10 20,25 L20,75 C20,90 10,90 5,85" />
          <text x="28" y="55" fill="currentColor" fontSize="12" fontWeight="bold" stroke="none">f(x)dx</text>
        </svg>

        {/* Trigonometry Wave (Bottom Right) */}
        <svg className="absolute bottom-12 right-12 w-36 h-20 text-white/20 pointer-events-none hidden lg:block" viewBox="0 0 150 60" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M10,30 Q30,5 50,30 T90,30 T130,30" />
          <line x1="10" y1="30" x2="140" y2="30" strokeDasharray="4 4" />
          <line x1="75" y1="10" x2="75" y2="50" strokeDasharray="4 4" />
        </svg>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-8 md:mb-10">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-black tracking-tight mb-3 md:mb-4">Our Courses</h2>
            <p className="text-black/90 font-bold text-base md:text-xl max-w-4xl mx-auto leading-snug px-2">
              Being true Mentors, our objective is to guide the students on the track of their academic growth by bringing out their latent potential
            </p>
          </div>

          <div className="flex justify-center mb-8 md:mb-12 px-2">
            <div className="flex flex-wrap justify-center bg-[#ff5500] rounded overflow-hidden shadow-lg border border-[#ff5500]">
               <button className="px-5 md:px-8 py-2.5 md:py-3 text-sm md:text-base text-white font-bold bg-[#ff7b3a] transition-colors border-r border-[#ff7b3a]">Foundation</button>
               <button className="px-5 md:px-8 py-2.5 md:py-3 text-sm md:text-base text-white font-bold hover:bg-[#ff7b3a] transition-colors border-r border-[#ff7b3a]">Engineering</button>
               <button className="px-5 md:px-8 py-2.5 md:py-3 text-sm md:text-base text-white font-bold hover:bg-[#ff7b3a] transition-colors">Medical</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {courses.map((course, idx) => {
              const mentorId = Array.isArray(course.mentors) ? course.mentors[0] : null;
              const mentor = mentors.find((m: { id: string }) => m.id === mentorId) || null;
              return <CourseCard key={course.id} course={{ ...course, mentor }} index={idx} />;
            })}
          </div>
          
          <div className="flex justify-center gap-4 mt-12">
             <button className="w-10 h-10 rounded-full bg-[#ff5500] text-white flex items-center justify-center font-bold text-xl hover:scale-110 transition-transform shadow-lg shadow-[#ff5500]/40">&lt;</button>
             <button className="w-10 h-10 rounded-full bg-[#ff5500] text-white flex items-center justify-center font-bold text-xl hover:scale-110 transition-transform shadow-lg shadow-[#ff5500]/40">&gt;</button>
          </div>
        </div>
      </section>

      {/* ── 5. TOP INSTITUTIONS MARQUEE ── */}
      <section className="py-24 overflow-hidden relative bg-[#f8f9fc]">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.01] mix-blend-overlay pointer-events-none" />
        <div className="text-center mb-16 relative z-10">
          <p className="text-[12px] font-bold text-slate-400 uppercase tracking-[0.4em]">Mentors from top institutions</p>
        </div>
        
        {/* Marquee Container */}
        <div className="relative w-full overflow-hidden flex flex-col gap-12 whitespace-nowrap">
          {/* Gradient Masks */}
          <div className="absolute left-0 top-0 bottom-0 w-32 md:w-64 bg-gradient-to-r from-[#f8f9fc] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 md:w-64 bg-gradient-to-l from-[#f8f9fc] to-transparent z-10 pointer-events-none" />
          
          {/* Row 1 (Rightwards / Left to Right) */}
          <motion.div 
            className="flex gap-20 min-w-max ml-[-1200px]"
            animate={{ x: [-2200, 0] }}
            transition={{ repeat: Infinity, ease: "linear", duration: 45 }}
          >
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex gap-20 items-center">
                {[
                  { name: 'IIT DELHI', color: 'text-slate-400' },
                  { name: 'IIT BOMBAY', color: 'text-slate-400' },
                  { name: 'AIIMS DELHI', color: 'text-slate-400' },
                  { name: 'AIIMS BHOPAL', color: 'text-slate-400' },
                  { name: "NIT's", color: 'text-slate-400' },
                  { name: 'IIT ROORKEE', color: 'text-slate-400' },
                  { name: 'IIT JODHPUR', color: 'text-slate-400' },
                  { name: 'IIT GUWAHATI', color: 'text-slate-400' },
                  { name: 'AIIMS KALYANI', color: 'text-slate-400' },
                  { name: 'AIIMS RAEBARELI', color: 'text-slate-400' },
                  { name: 'TOP GMC', color: 'text-slate-400' }
                ].map((inst, idx) => (
                  <div key={idx} className="flex items-center justify-center opacity-70 hover:opacity-100 transition-all duration-300 scale-95 hover:scale-105 cursor-pointer">
                    <span className={`text-4xl md:text-5xl font-black tracking-tighter ${inst.color} hover:text-[#5a4bda] transition-colors`}>
                      {inst.name}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </motion.div>
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
                    <span className={`text-2xl md:text-4xl lg:text-5xl font-black tracking-tighter ${exam.color}`}>
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
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tighter mb-6 md:mb-8">Apply for the <br/> 2026 cohort.</h2>
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 mb-8 md:mb-12">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto px-8 md:px-12 h-14 md:h-16 text-base md:text-lg bg-white text-[#ff5500] hover:bg-gray-100 hover:scale-105 transition-all shadow-xl font-bold">
                Start Application
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg" className="w-full sm:w-auto px-8 md:px-12 h-14 md:h-16 text-base md:text-lg border-white text-white hover:bg-white hover:text-[#ff5500] hover:scale-105 transition-all font-bold">
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

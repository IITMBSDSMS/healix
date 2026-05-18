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
  const [customName, setCustomName] = useState("Aman Sharma");
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [cardTheme, setCardTheme] = useState("indigo");

  useEffect(() => {
    getCourses().then(setCourses);
    getMentors().then(setMentors);
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-[#ff5500]/30">
      
      {/* ── 1. HERO SECTION (Ultra-Premium Tech Academy Style) ── */}
      <section className="relative pt-32 md:pt-48 pb-24 md:pb-44 bg-gradient-to-b from-[#f8fafc] via-[#f0f4ff] to-[#f8fafc] text-slate-900 overflow-hidden border-b-0">
        
        {/* Subtle Decorative Grid Pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1.5" fill="#000" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Beautiful Ambient Colorful Glows */}
        <div className="absolute top-1/4 left-0 w-[450px] h-[450px] rounded-full bg-gradient-to-br from-blue-400/10 to-indigo-400/5 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-10 right-0 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-violet-400/10 to-pink-400/5 blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Side: Elegant Headlines & Premium CTA */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left space-y-7"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100/80 text-xs font-black text-[#5a4bda] uppercase tracking-wider">
                ⚡ India&apos;s Premium JEE/NEET Hub
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-extrabold tracking-tight leading-[1.12] text-slate-900">
                Map your learning <br />
                journey with{" "}
                <span className="bg-gradient-to-r from-[#5a4bda] to-[#8b5cf6] bg-clip-text text-transparent">
                  Healix Experts!
                </span>
              </h1>
              
              <p className="text-base md:text-lg text-slate-600 max-w-lg leading-relaxed mx-auto lg:mx-0 font-medium">
                Experience India&apos;s most advanced interactive learning environment. Get live mentorship from top IITians and medical specialists tailored perfectly to your speed.
              </p>
              
              <div className="pt-4 flex justify-center lg:justify-start gap-4 flex-wrap items-center">
                <Button size="lg" className="px-8 h-13 text-base font-semibold bg-gradient-to-r from-[#5a4bda] to-[#7c3aed] hover:from-[#4b3cc0] hover:to-[#6d28d9] hover:scale-[1.03] transition-all text-white rounded-xl shadow-xl shadow-[#5a4bda]/20 border-0">
                  Start Free Trial
                </Button>
                <Link href="#courses">
                  <Button variant="outline" size="lg" className="px-8 h-13 text-base font-semibold border-slate-200 text-slate-700 bg-white hover:border-[#5a4bda] hover:text-[#5a4bda] hover:bg-slate-50 rounded-xl transition-all shadow-sm">
                    Explore Courses
                  </Button>
                </Link>
              </div>

              {/* Premium trust badges */}
              <div className="pt-6 flex items-center justify-center lg:justify-start gap-4 text-slate-500 text-sm font-semibold border-t border-slate-100 max-w-md">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full border-2 border-white overflow-hidden relative">
                    <Image src="https://i.pravatar.cc/100?img=12" alt="" fill className="object-cover" />
                  </div>
                  <div className="w-8 h-8 rounded-full border-2 border-white overflow-hidden relative">
                    <Image src="https://i.pravatar.cc/100?img=32" alt="" fill className="object-cover" />
                  </div>
                  <div className="w-8 h-8 rounded-full border-2 border-white overflow-hidden relative">
                    <Image src="https://i.pravatar.cc/100?img=47" alt="" fill className="object-cover" />
                  </div>
                </div>
                <div>
                  <p className="text-slate-800 font-extrabold leading-none">4.9/5 Rating</p>
                  <p className="text-xs text-slate-400 mt-1">from 15,000+ top rankers nationwide</p>
                </div>
              </div>
            </motion.div>

            {/* Right Side: Gigantic Real Model Cut-out & Minimalist Geometry */}
            <div className="relative h-[560px] hidden lg:flex items-center justify-center">
              
              {/* Sleek soft glowing geometry behind the model */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[460px] h-[460px] rounded-full bg-gradient-to-tr from-[#5a4bda]/10 via-[#8b5cf6]/5 to-transparent blur-[80px]" />
                <div className="w-[380px] h-[380px] rounded-full border border-slate-200/50 bg-white/40 backdrop-blur-3xl shadow-inner" />
                <div className="w-[300px] h-[300px] rounded-full border border-dashed border-slate-200/60 animate-[spin_120s_linear_infinite]" />
              </div>

              {/* ── Main Spokesperson Model: Real Scholar holding Tablet in Healix T-shirt ── */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="relative w-[480px] h-[520px] z-20"
              >
                <Image 
                  src="/academy-real-model-final.png" 
                  alt="Healix Academy Education Model" 
                  fill 
                  priority
                  className="object-contain object-bottom drop-shadow-[0_20px_40px_rgba(90,75,218,0.15)]" 
                />
              </motion.div>

              {/* Floating Rank Badge 1 */}
              <motion.div
                animate={{ y: [-6, 6, -6] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-8 left-[-5%] bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-[0_12px_24px_rgba(0,0,0,0.06)] border border-slate-100 flex items-center gap-3 z-30 select-none max-w-[190px]"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center text-xl shrink-0 font-extrabold shadow-sm">
                  🏆
                </div>
                <div className="text-left">
                  <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-wider leading-none">JEE MAIN 2026</h4>
                  <p className="text-xs font-black text-slate-800 mt-1 leading-tight">AIR 124 Secured</p>
                </div>
              </motion.div>

              {/* Floating Rank Badge 2 */}
              <motion.div
                animate={{ y: [6, -6, 6] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute bottom-12 right-[-5%] bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-[0_12px_24px_rgba(0,0,0,0.06)] border border-slate-100 flex items-center gap-3 z-30 select-none max-w-[190px]"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-xl shrink-0 font-extrabold shadow-sm">
                  ⚡
                </div>
                <div className="text-left">
                  <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-wider leading-none">NEET SCORE</h4>
                  <p className="text-xs font-black text-slate-800 mt-1 leading-tight">710 / 720 Marks</p>
                </div>
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


      {/* ── 5.3 CREDENTIALS SHOWCASE SECTION ── */}
      <section className="relative py-24 bg-gradient-to-br from-[#fafbff] to-[#f2f5fa] overflow-hidden border-t border-slate-100">
        {/* Background Vectors */}
        <div className="absolute top-1/3 left-[-15%] w-[45%] h-[45%] rounded-full bg-[#5a4bda]/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/3 right-[-15%] w-[45%] h-[45%] rounded-full bg-[#ff5500]/5 blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[#5a4bda] text-xs font-bold uppercase tracking-[0.3em] bg-[#5a4bda]/10 px-3.5 py-1.5 rounded-full">Academy Credentials</span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mt-4 mb-5">
              Official Admittance &amp; <br />
              <span className="text-[#ff5500]">Completion Credentials</span>
            </h2>
            <p className="text-slate-600 font-medium text-base md:text-lg">
              Every admitted student receives a personalized, secure official Institution ID Card, followed by a verified blockchain Certificate of Completion once course criteria are met.
            </p>
          </div>

          {/* Real-time Interactive Control Panel */}
          <div className="max-w-xl mx-auto bg-white rounded-2xl border border-slate-100 shadow-[0_10px_35px_rgba(0,0,0,0.04)] p-6 mb-16">
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">Customize Student Name:</label>
                <input 
                  type="text" 
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value.slice(0, 32))}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#5a4bda] text-slate-800 font-bold transition-all placeholder-slate-300"
                  placeholder="Enter full name..."
                />
              </div>
              
              <div>
                <label className="block text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">Choose ID Accent Theme:</label>
                <div className="flex gap-2">
                  {[
                    { id: 'indigo', name: 'Cobalt', color: 'bg-indigo-600' },
                    { id: 'orange', name: 'Solar', color: 'bg-[#ff5500]' },
                    { id: 'emerald', name: 'Emerald', color: 'bg-emerald-600' },
                    { id: 'dark', name: 'Obsidian', color: 'bg-slate-900' }
                  ].map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => setCardTheme(theme.id)}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border text-xs font-black transition-all ${cardTheme === theme.id ? 'border-slate-900 bg-slate-900 text-white shadow-md' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}
                    >
                      <span className={`w-2.5 h-2.5 rounded-full ${theme.color}`} />
                      {theme.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Showcase Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch max-w-6xl mx-auto">
            
            {/* LEFT SIDE: Interactive 3D Scholar ID Card (4 columns) */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center">
              <div className="text-center mb-6">
                <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-widest bg-slate-100 px-3 py-1 rounded-full">Interactive 3D ID Card</span>
                <p className="text-xs text-slate-500 font-medium mt-1.5">Click card below to flip and view signature panel</p>
              </div>

              {/* 3D Perspective Wrapper */}
              <div 
                className="w-[280px] h-[440px] cursor-pointer relative"
                onClick={() => setIsCardFlipped(!isCardFlipped)}
                style={{ perspective: 1200 }}
              >
                <motion.div 
                  className="w-full h-full relative"
                  style={{ transformStyle: "preserve-3d" }}
                  animate={{ rotateY: isCardFlipped ? 180 : 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                  
                  {/* FRONT OF ID CARD */}
                  <div 
                    className={`absolute inset-0 w-full h-full rounded-[24px] p-5 flex flex-col justify-between shadow-2xl border-4 border-white/10 text-white overflow-hidden`}
                    style={{ 
                      backfaceVisibility: "hidden",
                      background: cardTheme === 'indigo' 
                        ? 'linear-gradient(to bottom, #4f46e5, #312e81)' 
                        : cardTheme === 'orange'
                        ? 'linear-gradient(to bottom, #ff5500, #9a2000)'
                        : cardTheme === 'emerald'
                        ? 'linear-gradient(to bottom, #059669, #064e3b)'
                        : 'linear-gradient(to bottom, #1e293b, #020617)'
                    }}
                  >
                    {/* Hologram shine layer */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/20 pointer-events-none" />

                    {/* Card Top */}
                    <div className="flex justify-between items-start relative z-10">
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/70">Official Admittance</p>
                        <h4 className="text-xs font-black tracking-tighter">HEALIX ACADEMY</h4>
                      </div>
                      <span className="text-[9px] font-black bg-white/25 px-2 py-0.5 rounded-full">2026-27</span>
                    </div>

                    {/* Scholar profile */}
                    <div className="flex flex-col items-center text-center space-y-3.5 relative z-10">
                      <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white/20 shadow-lg relative bg-white/10 flex items-center justify-center">
                        <Image src="https://i.pravatar.cc/150?img=33" alt="Student" fill className="object-cover" />
                      </div>
                      <div>
                        <h3 className="text-lg font-black tracking-tight uppercase truncate max-w-[220px]">{customName || "Aman Sharma"}</h3>
                        <span className="text-[8px] font-extrabold uppercase bg-white/15 text-white tracking-[0.2em] px-3 py-1 rounded-full">Official Scholar</span>
                      </div>
                    </div>

                    {/* Metadata details */}
                    <div className="space-y-2 relative z-10 border-t border-white/15 pt-3.5 text-left">
                      <div className="grid grid-cols-2 gap-2 text-[9px]">
                        <div>
                          <p className="text-white/60 font-medium">SCHOLAR ID</p>
                          <p className="font-extrabold tracking-wider">HX-2026-9041</p>
                        </div>
                        <div>
                          <p className="text-white/60 font-medium">DISCIPLINE</p>
                          <p className="font-extrabold tracking-wider">IIT JEE CORE</p>
                        </div>
                      </div>

                      {/* Barcode representation */}
                      <div className="pt-2 flex justify-center">
                        <svg className="w-full h-8 opacity-75 text-white" viewBox="0 0 100 24" fill="currentColor">
                          <rect x="0" width="2" height="24" />
                          <rect x="3" width="1" height="24" />
                          <rect x="6" width="3" height="24" />
                          <rect x="11" width="1" height="24" />
                          <rect x="13" width="2" height="24" />
                          <rect x="17" width="1" height="24" />
                          <rect x="20" width="3" height="24" />
                          <rect x="25" width="2" height="24" />
                          <rect x="29" width="1" height="24" />
                          <rect x="32" width="2" height="24" />
                          <rect x="36" width="3" height="24" />
                          <rect x="41" width="1" height="24" />
                          <rect x="44" width="2" height="24" />
                          <rect x="48" width="1" height="24" />
                          <rect x="51" width="3" height="24" />
                          <rect x="56" width="2" height="24" />
                          <rect x="60" width="1" height="24" />
                          <rect x="63" width="2" height="24" />
                          <rect x="67" width="3" height="24" />
                          <rect x="72" width="1" height="24" />
                          <rect x="75" width="2" height="24" />
                          <rect x="79" width="1" height="24" />
                          <rect x="82" width="3" height="24" />
                          <rect x="87" width="2" height="24" />
                          <rect x="91" width="1" height="24" />
                          <rect x="94" width="2" height="24" />
                          <rect x="98" width="2" height="24" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* BACK OF ID CARD */}
                  <div 
                    className="absolute inset-0 w-full h-full rounded-[24px] p-5 flex flex-col justify-between shadow-2xl border-4 border-slate-800 text-slate-300 bg-slate-950"
                    style={{ 
                      backfaceVisibility: "hidden",
                      transform: "rotateY(180deg)"
                    }}
                  >
                    <div className="text-left space-y-4">
                      <div>
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-[#ff5500]">Institution Terms</h4>
                        <p className="text-[8px] text-slate-400 mt-1 leading-normal">
                          This smart admittance token certifies that the holder is registered in the official database of Healix Academy.
                        </p>
                      </div>
                      
                      <div className="space-y-1.5 text-[8px] text-slate-400 leading-normal border-t border-slate-800 pt-3">
                        <p>• Verification hash: <span className="font-mono text-slate-200">0x84a9...b411</span></p>
                        <p>• Access allowed: Live Classrooms &amp; Test Portals</p>
                        <p>• Support: reach out at connect@healix.ac</p>
                      </div>
                    </div>

                    <div className="border-t border-slate-800 pt-4 flex justify-between items-end">
                      <div className="text-left">
                        <p className="text-[6px] text-slate-500">REGISTRAR SIGNATURE</p>
                        <p className="font-serif text-slate-300 italic text-[11px] font-extrabold tracking-tight mt-0.5">Dr. Arvind Rao</p>
                      </div>
                      
                      {/* Custom styled QR box */}
                      <div className="w-12 h-12 bg-white rounded-lg p-1.5 flex items-center justify-center shrink-0">
                        <svg className="w-full h-full text-slate-900" viewBox="0 0 100 100" fill="currentColor">
                          <path d="M0 0h30v30H0zm40 0h20v20H40zm30 0h30v30H70zM0 40h20v20H0zm30 30h20v20H30zM0 70h30v30H0zm70 0h30v30H70zm20-30h10v20H90zm-40 0h20v10H50z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                </motion.div>
              </div>
            </div>

            {/* RIGHT SIDE: Premium Certificate of Completion (7 columns) */}
            <div className="lg:col-span-7 flex flex-col items-center justify-center">
              <div className="text-center mb-6">
                <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-widest bg-slate-100 px-3 py-1 rounded-full">Accredited Diploma</span>
                <p className="text-xs text-slate-500 font-medium mt-1.5">Official certificate issued upon curriculum graduation</p>
              </div>

              {/* Certificate Container */}
              <div className="w-full max-w-[580px] aspect-[1.58] bg-[#0c101d] rounded-2xl p-6 md:p-8 flex flex-col justify-between border-4 border-[#d4af37]/30 shadow-2xl relative overflow-hidden text-white font-serif">
                
                {/* Subtle border detailing */}
                <div className="absolute inset-2 border border-[#d4af37]/20 pointer-events-none rounded-lg" />
                
                {/* Background watermarked emblem */}
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                  <span className="text-[180px] font-bold">HX</span>
                </div>

                {/* Certificate Top */}
                <div className="text-center space-y-1 relative z-10">
                  <p className="text-[8px] md:text-[9px] font-sans font-black tracking-[0.35em] text-[#d4af37] uppercase">Certificate of Completion</p>
                  <p className="text-[6px] md:text-[7px] font-sans font-extrabold text-slate-400 tracking-widest uppercase">HEALIX ACADEMY COMPREHENSIVE CURRICULUM</p>
                </div>

                {/* Certificate Core Text */}
                <div className="text-center space-y-4 my-2 relative z-10">
                  <p className="text-[9px] md:text-[10px] text-slate-300 italic font-sans font-semibold">This document serves to certify that</p>
                  
                  {/* Dynamic Name Display */}
                  <h3 className="text-xl md:text-3xl font-extrabold text-white tracking-tight uppercase underline decoration-[#d4af37]/40 underline-offset-4 py-1 truncate max-w-full font-serif italic">
                    {customName || "Aman Sharma"}
                  </h3>
                  
                  <p className="text-[8px] md:text-[10px] text-slate-400 font-sans leading-relaxed max-w-md mx-auto">
                    has successfully qualified the advanced physical mechanics, organic biochemistry, and mathematical analysis modules for the competitive IIT JEE &amp; NEET entrance examinations.
                  </p>
                </div>

                {/* Certificate Bottom Signatures & Seal */}
                <div className="flex justify-between items-end border-t border-[#d4af37]/20 pt-4 relative z-10 font-sans">
                  
                  {/* Signature 1 */}
                  <div className="text-left space-y-1">
                    <p className="font-serif italic text-white/90 text-sm font-extrabold">Dr. Arvind Rao</p>
                    <div className="w-16 h-[1px] bg-slate-700" />
                    <p className="text-[6px] md:text-[7px] text-slate-500 font-bold uppercase tracking-wider">ACADEMY DIRECTOR</p>
                  </div>

                  {/* Golden Seal Emblem */}
                  <motion.div 
                    whileHover={{ scale: 1.08 }}
                    className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-[#ffd700] via-[#d4af37] to-[#aa7c11] flex items-center justify-center shadow-lg shadow-[#d4af37]/20 border-2 border-white/20 shrink-0 relative cursor-pointer"
                  >
                    {/* Seal Rays */}
                    <div className="absolute inset-0 rounded-full border border-dashed border-white/30 animate-[spin_20s_linear_infinite]" />
                    <span className="text-[9px] md:text-xs font-black text-slate-950 font-sans tracking-tighter">HX SEAL</span>
                  </motion.div>

                  {/* Signature 2 */}
                  <div className="text-right space-y-1">
                    <p className="font-serif italic text-white/90 text-sm font-extrabold">Dr. Sarah Chen</p>
                    <div className="w-16 h-[1px] bg-slate-700 ml-auto" />
                    <p className="text-[6px] md:text-[7px] text-slate-500 font-bold uppercase tracking-wider">CHIEF ADVISOR</p>
                  </div>

                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ── 5.4 STUDY RESOURCES SECTION ── */}
      <section className="relative py-24 bg-white overflow-hidden border-t border-slate-100">
        {/* Background decorative patterns */}
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.02] pointer-events-none bg-[radial-gradient(#5a4bda_1px,transparent_1px)] [background-size:24px_24px]" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
              Study Resources
            </h2>
            <p className="text-slate-600 font-medium text-base md:text-lg">
              A diverse array of learning materials to enhance your educational journey.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
            
            {/* CARD 1: Reference Books */}
            <div className="rounded-3xl bg-[#edf5ff] p-8 md:p-10 flex flex-col justify-between shadow-[0_10px_30px_rgba(0,0,0,0.02)] border border-blue-100/50 hover:shadow-[0_20px_45px_rgba(0,0,0,0.05)] transition-all duration-300 group">
              <div className="text-left">
                <h3 className="text-2xl font-black text-[#1e3a8a] tracking-tight mb-3">Reference Books</h3>
                <p className="text-[#1e3a8a]/70 font-semibold text-sm leading-relaxed mb-8">
                  Our experts have created thorough study materials that break down complicated concepts into easily understandable content.
                </p>
              </div>

              {/* 3D Book Display Stand */}
              <div className="relative w-full h-[220px] flex items-center justify-center mt-auto overflow-visible select-none pb-4">
                {/* Podium steps */}
                <div className="absolute bottom-2 left-[10%] w-[110px] h-[24px] rounded-full bg-gradient-to-b from-white to-slate-200 shadow-md border border-slate-300/30 z-10" />
                <div className="absolute bottom-2 right-[10%] w-[110px] h-[24px] rounded-full bg-gradient-to-b from-white to-slate-200 shadow-md border border-slate-300/30 z-10" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[140px] h-[30px] rounded-full bg-gradient-to-b from-white to-slate-100 shadow-lg border border-slate-300/25 z-20" />

                {/* Left Book: NCERT Exemplar (Red) */}
                <motion.div 
                  whileHover={{ y: -6, rotate: -12 }}
                  className="absolute bottom-7 left-[14%] w-[70px] h-[100px] bg-gradient-to-br from-red-600 via-red-500 to-red-700 rounded-md shadow-[5px_15px_25px_rgba(0,0,0,0.2)] border-l-4 border-red-800 z-30 transform rotate-[-8deg] flex flex-col justify-between p-2 text-white font-sans text-left transition-all duration-300"
                >
                  <div className="space-y-1">
                    <p className="text-[7px] font-black tracking-widest opacity-80 uppercase">NCERT</p>
                    <p className="text-[8px] font-black uppercase tracking-tight leading-none">Exemplar</p>
                  </div>
                  <div className="border-t border-white/20 pt-1 flex justify-between items-center">
                    <span className="text-[6px] font-bold opacity-60">PHYSICS</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                  </div>
                </motion.div>

                {/* Right Book: Punch Chemistry (Black/Neon Pink) */}
                <motion.div 
                  whileHover={{ y: -6, rotate: 12 }}
                  className="absolute bottom-7 right-[14%] w-[70px] h-[100px] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 rounded-md shadow-[-5px_15px_25px_rgba(0,0,0,0.2)] border-l-4 border-pink-600 z-30 transform rotate-[8deg] flex flex-col justify-between p-2 text-white font-sans text-left transition-all duration-300"
                >
                  <div className="space-y-1">
                    <p className="text-[7px] font-black tracking-widest text-pink-500 uppercase">PUNCH</p>
                    <p className="text-[8px] font-black uppercase tracking-tight leading-none">Chemistry</p>
                  </div>
                  <div className="border-t border-white/10 pt-1 flex justify-between items-center">
                    <span className="text-[6px] font-bold text-pink-400">ORGANIC</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-pink-500/40" />
                  </div>
                </motion.div>

                {/* Center Book: Main Featured Core Modules (Yellow/Green) */}
                <motion.div 
                  whileHover={{ y: -8, scale: 1.05 }}
                  className="absolute bottom-5 left-1/2 -translate-x-1/2 w-[85px] h-[120px] bg-gradient-to-br from-yellow-500 via-[#ff5500] to-orange-700 rounded-md shadow-[0_20px_35px_rgba(0,0,0,0.25)] border-l-4 border-orange-950 z-40 flex flex-col justify-between p-3 text-white font-sans text-left transition-all duration-300"
                >
                  <div className="space-y-1">
                    <p className="text-[7px] font-black tracking-wider text-yellow-300 uppercase">HEALIX CORE</p>
                    <p className="text-[9px] font-black uppercase tracking-tight leading-tight">Yakeen<br />JEE/NEET</p>
                  </div>
                  <div className="border-t border-white/20 pt-1.5 flex justify-between items-end">
                    <div>
                      <p className="text-[5px] font-medium opacity-60">SET OF 4</p>
                      <p className="text-[6px] font-bold">MODULES</p>
                    </div>
                    <span className="text-[7px] font-black bg-white/20 px-1 rounded">HX</span>
                  </div>
                </motion.div>
              </div>

              {/* Centered Explore Button */}
              <div className="flex justify-center mt-6">
                <button className="px-7 py-2.5 bg-slate-900 hover:bg-black text-white text-xs font-black rounded-lg transition-colors shadow-md shadow-slate-950/10 tracking-wider uppercase">
                  Explore
                </button>
              </div>
            </div>

            {/* CARD 2: NCERT Solutions */}
            <div className="rounded-3xl bg-[#fffbf0] p-8 md:p-10 flex flex-col justify-between shadow-[0_10px_30px_rgba(0,0,0,0.02)] border border-orange-100/50 hover:shadow-[0_20px_45px_rgba(0,0,0,0.05)] transition-all duration-300 group">
              <div className="text-left">
                <h3 className="text-2xl font-black text-[#7c2d12] tracking-tight mb-3">NCERT Solutions</h3>
                <p className="text-[#7c2d12]/70 font-semibold text-sm leading-relaxed mb-8">
                  Unlock academic excellence with Healix Academy&apos;s NCERT Solutions which provides you step-by-step solutions.
                </p>
              </div>

              {/* Fan of Mock Solutions Sheets */}
              <div className="relative w-full h-[220px] flex items-center justify-center mt-auto overflow-visible select-none pb-4">
                
                {/* Left sheet */}
                <motion.div 
                  whileHover={{ rotate: -18, y: -4 }}
                  className="absolute bottom-6 left-[10%] w-[115px] h-[155px] bg-white border border-slate-200/80 rounded-lg shadow-md transform rotate-[-12deg] origin-bottom-right p-3 text-slate-700 transition-all duration-300 z-10"
                >
                  <div className="border-b border-slate-100 pb-1.5 mb-1.5 flex justify-between items-center">
                    <span className="text-[6px] font-extrabold text-[#7c2d12]">MCQ GRID</span>
                    <span className="text-[5px] font-mono text-slate-400">PAGE 4</span>
                  </div>
                  {/* Mock content grid */}
                  <div className="space-y-1.5">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="flex items-center gap-1">
                        <span className="text-[5px] font-bold text-slate-400">Q{i+1}.</span>
                        <div className="w-12 h-1 bg-slate-100 rounded" />
                        <span className="text-[5px] font-bold text-emerald-500 ml-auto">✓</span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Right sheet */}
                <motion.div 
                  whileHover={{ rotate: 18, y: -4 }}
                  className="absolute bottom-6 right-[10%] w-[115px] h-[155px] bg-white border border-slate-200/80 rounded-lg shadow-md transform rotate-[12deg] origin-bottom-left p-3 text-slate-700 transition-all duration-300 z-20"
                >
                  <div className="border-b border-slate-100 pb-1.5 mb-1.5 flex justify-between items-center">
                    <span className="text-[6px] font-extrabold text-[#7c2d12]">CHEM CORE</span>
                    <span className="text-[5px] font-mono text-slate-400">P. 12</span>
                  </div>
                  {/* Benzene Ring Mock Vector drawing */}
                  <div className="flex flex-col items-center gap-1.5 py-1">
                    <svg className="w-8 h-8 text-[#7c2d12]/30" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="6">
                      <polygon points="50,5 90,28 90,72 50,95 10,72 10,28" />
                      <circle cx="50" cy="50" r="28" strokeDasharray="10 5" />
                    </svg>
                    <span className="text-[5px] font-mono text-slate-400">Fig 2.1: Benzene Resonance</span>
                  </div>
                </motion.div>

                {/* Center Main Sheet */}
                <motion.div 
                  whileHover={{ y: -8, scale: 1.03 }}
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[130px] h-[175px] bg-white border border-slate-200 rounded-lg shadow-[0_15px_30px_rgba(0,0,0,0.06)] p-3 text-slate-800 transition-all duration-300 z-30"
                >
                  {/* Sheet Header */}
                  <div className="border-b border-slate-100 pb-2 mb-2 flex justify-between items-center">
                    <span className="text-[7px] font-black text-[#ff5500] uppercase tracking-wider">NCERT Solution</span>
                    <span className="text-[6px] font-bold bg-[#ff5500]/10 text-[#ff5500] px-1 rounded">HX CLASS</span>
                  </div>
                  
                  {/* Physics Drawing inclined plane */}
                  <div className="space-y-2">
                    <p className="text-[6px] font-bold text-slate-700 leading-tight">Q1: Find critical velocity on inclined plane with coefficient of friction &mu;.</p>
                    
                    {/* Sketch vector */}
                    <div className="w-full h-12 bg-slate-50/80 rounded border border-slate-100/50 flex items-center justify-center relative">
                      <svg className="w-20 h-10 text-slate-400" viewBox="0 0 100 50" fill="none" stroke="currentColor" strokeWidth="1.5">
                        {/* Inclined plane */}
                        <line x1="10" y1="40" x2="90" y2="40" />
                        <line x1="10" y1="40" x2="90" y2="10" />
                        <line x1="90" y1="10" x2="90" y2="40" />
                        {/* Block */}
                        <rect x="45" y="16" width="12" height="8" transform="rotate(-20 45 16)" fill="currentColor" opacity="0.1" />
                        <rect x="45" y="16" width="12" height="8" transform="rotate(-20 45 16)" fill="none" stroke="currentColor" strokeWidth="1.5" />
                        {/* Gravity vector arrow */}
                        <path d="M50,22 L50,38 M50,38 L48,34 M50,38 L52,34" strokeWidth="1" />
                        <text x="53" y="36" fontSize="5" fill="currentColor">mg</text>
                      </svg>
                    </div>

                    {/* Equations list */}
                    <div className="space-y-1 font-mono text-[5.5px] text-slate-500">
                      <p className="">&bull; N = mg cos(&theta;)</p>
                      <p className="">&bull; F_fric = &mu; N = &mu; mg cos(&theta;)</p>
                      <p className="font-bold text-[#ff5500]">&bull; a_net = g(sin(&theta;) - &mu;cos(&theta;))</p>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Empty placeholder to align button perfectly */}
              <div className="h-10 mt-6" />
            </div>

            {/* CARD 3: Notes */}
            <div className="rounded-3xl bg-[#f0fdf4] p-8 md:p-10 flex flex-col justify-between shadow-[0_10px_30px_rgba(0,0,0,0.02)] border border-emerald-100/50 hover:shadow-[0_20px_45px_rgba(0,0,0,0.05)] transition-all duration-300 group">
              <div className="text-left">
                <h3 className="text-2xl font-black text-[#065f46] tracking-tight mb-3">Notes</h3>
                <p className="text-[#065f46]/70 font-semibold text-sm leading-relaxed mb-8">
                  Use Healix Academy&apos;s detailed study materials that simplify complex ideas into easily understandable language.
                </p>
              </div>

              {/* Fan of Mock Revision Notes */}
              <div className="relative w-full h-[220px] flex items-center justify-center mt-auto overflow-visible select-none pb-4">
                
                {/* Left sheet */}
                <motion.div 
                  whileHover={{ rotate: -18, y: -4 }}
                  className="absolute bottom-6 left-[10%] w-[115px] h-[155px] bg-white border border-slate-200/80 rounded-lg shadow-md transform rotate-[-10deg] origin-bottom-right p-3 text-slate-700 transition-all duration-300 z-10"
                >
                  <div className="border-b border-slate-100 pb-1.5 mb-1.5 flex justify-between items-center">
                    <span className="text-[6px] font-extrabold text-[#065f46]">FORMULA CHEAT</span>
                    <span className="text-[5px] font-mono text-slate-400">HX SHEETS</span>
                  </div>
                  <div className="space-y-1.5 font-mono text-[5px] text-slate-500">
                    <p className="font-bold text-slate-800">THERMODYNAMICS</p>
                    <p>&bull; dQ = dU + dW</p>
                    <p>&bull; W = &int; P dV</p>
                    <p>&bull; &eta; = 1 - T_c / T_h</p>
                    <div className="w-full h-[1.5px] bg-emerald-500/10 my-1" />
                    <p>&bull; PV^&gamma; = Constant</p>
                  </div>
                </motion.div>

                {/* Right-most sheet (layered on top right) */}
                <motion.div 
                  whileHover={{ rotate: 18, y: -4 }}
                  className="absolute bottom-6 right-[10%] w-[115px] h-[155px] bg-white border border-slate-200/80 rounded-lg shadow-md transform rotate-[14deg] origin-bottom-left p-3 text-slate-700 transition-all duration-300 z-30"
                >
                  <div className="border-b border-slate-100 pb-1.5 mb-1.5 flex justify-between items-center">
                    <span className="text-[6px] font-extrabold text-[#065f46]">MATH CORE</span>
                    <span className="text-[5px] font-mono text-slate-400">SEC A</span>
                  </div>
                  {/* Graph representation */}
                  <div className="space-y-2">
                    <p className="text-[5.5px] font-bold text-slate-700">Calculus &amp; Slopes of tangent curves:</p>
                    <div className="w-full h-12 bg-slate-50/80 rounded flex items-center justify-center">
                      <svg className="w-16 h-10 text-slate-400" viewBox="0 0 80 40" fill="none" stroke="currentColor" strokeWidth="1.2">
                        {/* Axes */}
                        <line x1="5" y1="35" x2="75" y2="35" />
                        <line x1="15" y1="5" x2="15" y2="38" />
                        {/* Curve */}
                        <path d="M15,35 C35,35 45,10 70,5" stroke="#065f46" strokeWidth="1.5" />
                        {/* Tangent line */}
                        <line x1="30" y1="30" x2="60" y2="5" stroke="#ff5500" strokeDasharray="2 2" />
                      </svg>
                    </div>
                    <p className="text-[5px] font-mono text-slate-400 text-center">dy/dx = Tan(&theta;)</p>
                  </div>
                </motion.div>

                {/* Center Main Revision sheet */}
                <motion.div 
                  whileHover={{ y: -8, scale: 1.03 }}
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[130px] h-[175px] bg-white border border-slate-200 rounded-lg shadow-[0_15px_30px_rgba(0,0,0,0.06)] p-3 text-slate-800 transition-all duration-300 z-20"
                >
                  {/* Sheet Header */}
                  <div className="border-b border-slate-100 pb-2 mb-2 flex justify-between items-center">
                    <span className="text-[7px] font-black text-[#5a4bda] uppercase tracking-wider">Revision Notes</span>
                    <span className="text-[5px] font-bold bg-[#5a4bda]/10 text-[#5a4bda] px-1.5 py-0.5 rounded-full">CORE</span>
                  </div>
                  
                  {/* Lecture summary notes mock text */}
                  <div className="space-y-2 text-left">
                    <span className="text-[6px] font-extrabold bg-[#065f46]/10 text-[#065f46] px-1 py-0.5 rounded">CLASS 11</span>
                    <p className="text-[7px] font-black text-slate-900 leading-tight">Key takeaways from Mechanics:</p>
                    
                    <div className="space-y-1.5">
                      <div className="flex items-start gap-1">
                        <span className="text-[6px] text-emerald-500 font-bold">&bull;</span>
                        <p className="text-[5.5px] text-slate-500 leading-tight">Conservation of momentum applies in all closed, isolated systems.</p>
                      </div>
                      <div className="flex items-start gap-1">
                        <span className="text-[6px] text-emerald-500 font-bold">&bull;</span>
                        <p className="text-[5.5px] text-slate-500 leading-tight">Elastic collisions preserve both kinetic energy and momentum.</p>
                      </div>
                      <div className="flex items-start gap-1">
                        <span className="text-[6px] text-emerald-500 font-bold">&bull;</span>
                        <p className="text-[5.5px] text-slate-500 leading-tight">Inelastic collisions lose kinetic energy to internal mechanical work.</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Empty placeholder to align button perfectly */}
              <div className="h-10 mt-6" />
            </div>

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

      {/* ── 5.5 APP DOWNLOAD PROMO SECTION ── */}
      <section className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-br from-[#fffbfa] to-[#fff5f0] border-t border-orange-100">
        {/* Background decorative vector */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-[#ff5500]/5 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 right-0 w-[500px] h-[500px] rounded-full bg-[#5a4bda]/5 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-8 text-center lg:text-left">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.15] tracking-tight">
                Learning At Your Pace<br />
                <span className="text-[#ff5500]">Anytime, Anywhere</span>
              </h2>
              
              <p className="text-lg md:text-xl text-slate-600 font-medium max-w-xl mx-auto lg:mx-0">
                Download the <span className="text-[#5a4bda] font-extrabold">Healix Academy App</span> — India&apos;s most popular &amp; comprehensive competitive exams prep platform.
              </p>

              {/* Google Play Store Badge (High-fidelity custom SVG) */}
              <div className="flex justify-center lg:justify-start">
                <a 
                  href="https://play.google.com/store" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-black text-white px-6 py-3.5 rounded-xl hover:bg-slate-900 transition-all hover:scale-[1.03] active:scale-95 shadow-xl shadow-black/15 border border-slate-800 group"
                >
                  {/* Google Play Icon */}
                  <svg className="w-8 h-8 group-hover:animate-pulse" viewBox="0 0 512 512" fill="currentColor">
                    <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58 33.2-60.7-60.7 60.1-60.1 58.6 33.6c15 8.6 25.6 23.8 25.6 41.6s-10.7 32.9-25.6 42.4zM325.3 277.7l60.1 60.1L104.6 499l220.7-221.3z" fill="url(#play-gradient)" />
                    <defs>
                      <linearGradient id="play-gradient" x1="25.3" y1="256" x2="486.8" y2="256" gradientUnits="userSpaceOnUse">
                        <stop offset="0" stopColor="#ea4335" />
                        <stop offset="0.33" stopColor="#fbbc05" />
                        <stop offset="0.66" stopColor="#34a853" />
                        <stop offset="1" stopColor="#4285f4" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="text-left">
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider leading-none">GET IT ON</p>
                    <p className="text-xl font-black font-sans leading-none mt-1">Google Play</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Right Content - Mockup display */}
            <div className="lg:col-span-6 relative flex justify-center items-center h-[520px]">
              
              {/* Phone Mockup 1 (Primary - Front/Left) */}
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
                className="absolute z-20 w-[240px] h-[480px] bg-slate-950 rounded-[36px] p-2.5 shadow-[0_25px_60px_-15px_rgba(255,85,0,0.3)] border-4 border-slate-800 scale-95 md:scale-100"
              >
                {/* Internal Screen Layout */}
                <div className="w-full h-full bg-white rounded-[28px] overflow-hidden flex flex-col font-sans relative">
                  {/* Top Notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-950 rounded-b-xl z-30" />
                  
                  {/* Mock App Header */}
                  <div className="bg-gradient-to-r from-[#ff5500] to-[#ff7b3a] text-white pt-6 pb-4 px-4 rounded-b-[20px] shadow-md z-10 flex flex-col gap-1">
                    <div className="flex justify-between items-center text-[10px] opacity-90 mt-1">
                      <span className="font-extrabold uppercase bg-white/20 px-2 py-0.5 rounded">Academic Pro ⚡</span>
                      <span className="w-6 h-6 rounded-full bg-white/30 flex items-center justify-center font-bold">A</span>
                    </div>
                    <p className="text-[11px] font-bold mt-1 opacity-90">Welcome back,</p>
                    <p className="text-sm font-black leading-none">Ayush Kumar! 👋</p>
                  </div>

                  {/* Scrollable content area */}
                  <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3.5 bg-slate-50 text-slate-800">
                    {/* Days tracker pill */}
                    <div className="flex justify-between items-center gap-1 bg-white p-2 rounded-xl shadow-sm border border-slate-100 text-[10px]">
                      {['Day 1', 'Day 2', 'Day 3', 'Day 4'].map((day, idx) => (
                        <span key={idx} className={`flex-1 text-center py-1 rounded font-bold ${idx === 1 ? 'bg-[#ff5500] text-white' : 'bg-slate-100 text-slate-600'}`}>{day}</span>
                      ))}
                    </div>

                    {/* Active Course Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-3 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-bold text-white bg-indigo-600 px-1.5 py-0.5 rounded-full uppercase">IIT JEE Core</span>
                        <span className="text-[9px] font-bold text-emerald-600">✓ Active</span>
                      </div>
                      <h4 className="text-xs font-black text-slate-900 leading-snug">Physics Booster Class</h4>
                      <p className="text-[9px] text-slate-500 font-medium">Topic: Mechanics &amp; Rotational Dynamics</p>
                      
                      {/* Teacher Live Preview Screen */}
                      <div className="relative h-24 rounded-lg overflow-hidden bg-slate-900 border border-slate-200">
                        <Image src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300" alt="Live Class" fill className="object-cover opacity-80" />
                        <div className="absolute top-1.5 left-1.5 bg-red-600 text-[8px] font-black text-white px-1.5 py-0.5 rounded flex items-center gap-1 shadow-sm">
                          <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" /> LIVE
                        </div>
                        <div className="absolute bottom-1 right-1 bg-black/60 backdrop-blur-sm text-[8px] text-white px-1.5 py-0.5 rounded font-bold">
                          Dr. Sarah Chen
                        </div>
                      </div>

                      <button className="w-full bg-[#ff5500] text-white py-1.5 rounded-lg text-[10px] font-black hover:bg-[#ff7b3a] transition-all flex items-center justify-center gap-1">
                        <span>▶</span> Join Live Session
                      </button>
                    </div>

                    {/* Subjects Grid */}
                    <div className="space-y-1.5">
                      <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">My Study Dashboard</p>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-white p-2.5 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center">
                          <span className="text-base mb-1">📐</span>
                          <span className="text-[9px] font-bold text-slate-800">Maths</span>
                        </div>
                        <div className="bg-white p-2.5 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center">
                          <span className="text-base mb-1">⚗️</span>
                          <span className="text-[9px] font-bold text-slate-800">Chemistry</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Phone Mockup 2 (Secondary - Back/Right) */}
              <motion.div 
                initial={{ opacity: 0, y: 80, x: 40 }}
                whileInView={{ opacity: 1, y: 40, x: 100 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, type: "spring", stiffness: 80, delay: 0.1 }}
                className="absolute z-10 w-[230px] h-[450px] bg-slate-950 rounded-[34px] p-2.5 shadow-[0_20px_50px_-20px_rgba(90,75,218,0.25)] border-4 border-slate-800 scale-90 md:scale-95 hidden sm:block"
              >
                {/* Internal Screen Layout */}
                <div className="w-full h-full bg-white rounded-[26px] overflow-hidden flex flex-col font-sans relative">
                  {/* Top Notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-4 bg-slate-950 rounded-b-xl z-30" />
                  
                  {/* Mock App Header */}
                  <div className="bg-gradient-to-r from-[#5a4bda] to-[#8b5cf6] text-white pt-6 pb-3 px-3 rounded-b-[18px] shadow-md z-10 flex flex-col gap-0.5">
                    <div className="flex justify-between items-center text-[9px] opacity-90 mt-1">
                      <span className="font-extrabold uppercase bg-white/20 px-1.5 py-0.5 rounded">Healix Connect 💬</span>
                    </div>
                    <p className="text-xs font-black">24/7 Doubt Desk</p>
                  </div>

                  {/* App Content */}
                  <div className="flex-1 overflow-y-auto px-2.5 py-2.5 space-y-3 bg-slate-50 text-slate-800">
                    
                    {/* Live doubt solving session */}
                    <div className="bg-white rounded-lg shadow-sm border border-slate-100 p-2.5 space-y-2">
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 bg-[#ff5500] rounded-full animate-ping" />
                        <span className="text-[8px] font-black text-slate-500 uppercase tracking-wide">Live doubt session</span>
                      </div>
                      <h4 className="text-[10px] font-black text-slate-900 leading-snug">Organic Chemistry Queries</h4>
                      
                      {/* Teacher Profile */}
                      <div className="flex items-center gap-2 bg-indigo-50/50 p-1.5 rounded-lg border border-indigo-100/50">
                        <div className="w-7 h-7 rounded-full overflow-hidden border border-indigo-200 shrink-0">
                          <Image src="https://i.pravatar.cc/100?img=47" alt="Priya Patel" width={28} height={28} className="object-cover" />
                        </div>
                        <div>
                          <p className="text-[9px] font-extrabold text-slate-900">Dr. Priya Patel</p>
                          <p className="text-[7px] text-[#ff5500] font-black">IIT Delhi Alumnus</p>
                        </div>
                      </div>

                      <button className="w-full bg-[#5a4bda] text-white py-1.5 rounded-lg text-[9px] font-black hover:bg-[#4a3bc0] transition-all">
                        Ask a Doubt 💬
                      </button>
                    </div>

                    {/* Progress Stats */}
                    <div className="bg-white rounded-lg shadow-sm border border-slate-100 p-2.5 space-y-2 text-[9px]">
                      <p className="font-extrabold text-slate-900">My Preparedness Metric</p>
                      <div className="space-y-1">
                        <div className="flex justify-between text-slate-500">
                          <span>Overall Progress</span>
                          <span className="font-bold text-slate-900">82%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-[#ff5500] to-[#5a4bda] rounded-full" style={{ width: '82%' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

            </div>

          </div>
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

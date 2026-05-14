"use client";

import { useParams } from "next/navigation";
import { getCourses, getMentors } from "@/lib/academy/db";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock, Code2, GraduationCap, ShieldCheck, Users } from "lucide-react";
import React from "react";

export default function CourseDetail() {
  const { slug } = useParams();
  const [course, setCourse] = React.useState<any>(null);
  const [mentors, setMentors] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function load() {
      setIsLoading(true);
      const [allCourses, allMentors] = await Promise.all([getCourses(), getMentors()]);
      setCourse(allCourses.find((c: any) => c.slug === slug));
      setMentors(allMentors);
      setIsLoading(false);
    }
    load();
  }, [slug]);

  if (isLoading) {
    return <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center">Loading...</div>;
  }

  if (!course) {
    return <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center">Course not found.</div>;
  }

  const courseMentors = course.mentors.map((mId: string) => mentors.find(m => m.id === mId)).filter(Boolean);

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-24 pb-32">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 mb-20">
        <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-black shadow-2xl">
          <div className="absolute inset-0">
            <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover opacity-30" />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
          </div>
          
          <div className="relative z-10 p-10 md:p-20 grid md:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#eab308]/30 bg-[#eab308]/10 mb-6">
                <span className="text-[10px] font-mono text-[#eab308] uppercase tracking-widest">{course.difficulty} Level</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">{course.title}</h1>
              <p className="text-lg text-white/60 mb-8 max-w-xl leading-relaxed">{course.longDescription}</p>
              
              <div className="flex flex-wrap gap-4 mb-10 text-sm font-mono text-white/50">
                <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg border border-white/10">
                  <Clock className="w-4 h-4 text-[#eab308]" /> {course.duration}
                </div>
                <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg border border-white/10">
                  <Users className="w-4 h-4 text-[#eab308]" /> {course.seatsRemaining} Seats Left
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div>
                  <div className="text-sm text-white/40 line-through">₹{course.originalPrice.toLocaleString()}</div>
                  <div className="text-3xl font-bold text-white">₹{course.price.toLocaleString()}</div>
                </div>
                <Link href={`/register?course=${course.id}`}>
                  <button className="px-8 py-4 bg-[#eab308] text-black font-bold rounded-xl hover:bg-[#ca8a04] transition-all shadow-[0_0_30px_rgba(234,179,8,0.3)] hover:scale-105 active:scale-95 flex items-center justify-center gap-2">
                    Enroll Now <ArrowRight className="w-5 h-5" />
                  </button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12">
        
        {/* Left Column (Curriculum & Projects) */}
        <div className="md:col-span-2 space-y-16">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
              <GraduationCap className="text-[#eab308] w-8 h-8" /> Curriculum
            </h2>
            <div className="space-y-4">
              {course.modules.map((mod: string, i: number) => (
                <div key={i} className="p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-[#eab308]/30 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-black border border-[#eab308]/50 flex items-center justify-center text-[#eab308] font-mono font-bold shrink-0">
                      {(i + 1).toString().padStart(2, '0')}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{mod}</h3>
                      <p className="text-sm text-white/50">In-depth technical deep dive with hands-on assignments and code reviews.</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
              <Code2 className="text-[#eab308] w-8 h-8" /> Live Projects
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {course.projects.map((proj: string, i: number) => (
                <div key={i} className="p-6 bg-gradient-to-br from-[#0a0a0f] to-[#111] border border-white/10 rounded-2xl">
                  <h3 className="font-bold text-lg mb-2">{proj}</h3>
                  <p className="text-sm text-white/50">Build from scratch and deploy to production.</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Column (Mentors & Outcomes) */}
        <div className="space-y-12">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <h2 className="text-2xl font-bold mb-6 border-b border-white/10 pb-4">Instructors</h2>
            <div className="space-y-6">
              {courseMentors.map((mentor: any) => (
                <div key={mentor.id} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <img src={mentor.photoUrl} alt={mentor.name} className="w-16 h-16 rounded-full object-cover border border-[#eab308]/50" />
                    <div>
                      <h3 className="font-bold">{mentor.name}</h3>
                      <p className="text-xs text-[#eab308]">{mentor.role}</p>
                    </div>
                  </div>
                  <p className="text-sm text-white/60 mb-4">{mentor.bio}</p>
                  <div className="flex flex-wrap gap-2">
                    {mentor.companies.map((co: string) => (
                      <span key={co} className="text-[10px] font-mono px-2 py-1 bg-black rounded border border-white/10 text-white/50">{co}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <h2 className="text-2xl font-bold mb-6 border-b border-white/10 pb-4">Career Outcomes</h2>
            <ul className="space-y-4">
              {course.outcomes.map((outcome: string, i: number) => (
                <li key={i} className="flex items-start gap-3 text-sm text-white/70">
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                  {outcome}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

      </section>
    </div>
  );
}

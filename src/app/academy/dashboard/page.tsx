"use client";

import React from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { 
  Play, BookOpen, Clock, Users, 
  ArrowRight, CheckCircle2, Zap, 
  Target, Calendar
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function AcademyDashboard() {
  const upcomingSessions = [
    { title: "Distributed Inference Architectures", time: "Tomorrow, 10:00 AM", mentor: "Dr. Arvind Rao" },
    { title: "Model Quantization Workshop", time: "Friday, 4:00 PM", mentor: "Vikram Sharma" },
  ];

  return (
    <div className="p-10 max-w-7xl mx-auto space-y-10">
      
      {/* Welcome Banner */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <GlassCard className="p-12 relative overflow-hidden bg-gradient-to-br from-[#eab308]/10 via-[#eab308]/5 to-transparent border-[#eab308]/20">
            <div className="absolute top-0 right-0 p-12 opacity-10">
              <Zap className="h-64 w-64 text-[#eab308]" />
            </div>
            <div className="relative z-10 max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">
                Welcome back, <span className="text-[#eab308]">Engineer</span>.
              </h1>
              <p className="text-white/60 text-lg mb-8">
                You've completed 45% of the AI Systems Engineering track. Your next milestone is the Capstone Project proposal.
              </p>
              <Link href="/academy/dashboard/courses">
                <button className="px-8 py-4 bg-[#eab308] text-black font-bold rounded-xl flex items-center gap-3 hover:shadow-[0_0_20px_rgba(234,179,8,0.4)] transition-all">
                  Resume Learning <Play className="w-4 h-4 fill-current" />
                </button>
              </Link>
            </div>
          </GlassCard>
        </motion.div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-10">
          
          {/* Continue Watching */}
          <section>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#eab308]" /> Continue Watching
              </h3>
              <Link href="/academy/dashboard/courses" className="text-xs font-mono text-white/30 hover:text-white uppercase tracking-widest transition-colors">
                View All Modules
              </Link>
            </div>
            <GlassCard className="p-0 border-white/5 group cursor-pointer overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-5 h-full">
                <div className="md:col-span-2 relative aspect-video md:aspect-auto">
                  <Image 
                    src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop" 
                    alt="Course" 
                    fill 
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700" 
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/0 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-white" />
                    </div>
                  </div>
                </div>
                <div className="md:col-span-3 p-8 flex flex-col justify-between">
                  <div>
                    <p className="text-[10px] font-mono text-[#eab308] uppercase tracking-widest mb-2">Module 4 · Lesson 2</p>
                    <h4 className="text-2xl font-bold mb-3">Model Quantization with TensorRT</h4>
                    <p className="text-sm text-white/40 mb-6 line-clamp-2">Learn how to optimize your ONNX models for high-performance inference on NVIDIA T4 GPUs.</p>
                  </div>
                  <div className="flex items-center justify-between pt-6 border-t border-white/5">
                    <div className="flex items-center gap-4 text-xs text-white/40">
                      <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> 45m left</span>
                      <span className="flex items-center gap-1.5"><Target className="w-3.5 h-3.5" /> Intermediate</span>
                    </div>
                    <ArrowRight className="w-5 h-5 text-white/20 group-hover:text-[#eab308] transition-colors" />
                  </div>
                </div>
              </div>
            </GlassCard>
          </section>

          {/* Progress Breakdown */}
          <section>
            <h3 className="text-xl font-bold mb-6">Learning Path</h3>
            <div className="space-y-4">
              {[
                { title: "MLOps Fundamentals", status: "completed", progress: 100 },
                { title: "API Design for Inference", status: "completed", progress: 100 },
                { title: "Cloud Deployment (AWS/Azure)", status: "completed", progress: 100 },
                { title: "Advanced Model Quantization", status: "in-progress", progress: 45 },
                { title: "Distributed Scaling with K8s", status: "locked", progress: 0 },
              ].map((m, i) => (
                <GlassCard key={i} className="p-6 border-white/5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        m.status === 'completed' ? 'bg-emerald-500/20 text-emerald-500' : 
                        m.status === 'in-progress' ? 'bg-[#eab308]/20 text-[#eab308]' : 
                        'bg-white/5 text-white/20'
                      }`}>
                        {m.status === 'completed' ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                      </div>
                      <div>
                        <p className={`font-bold ${m.status === 'locked' ? 'text-white/20' : 'text-white'}`}>{m.title}</p>
                        {m.status === 'in-progress' && <p className="text-[10px] text-[#eab308] font-mono mt-1">IN PROGRESS</p>}
                      </div>
                    </div>
                    {m.status !== 'locked' && (
                      <div className="w-24 bg-white/5 rounded-full h-1 overflow-hidden">
                        <div className={`h-full rounded-full ${m.status === 'completed' ? 'bg-emerald-500' : 'bg-[#eab308]'}`} style={{ width: `${m.progress}%` }} />
                      </div>
                    )}
                  </div>
                </GlassCard>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar Widgets */}
        <div className="lg:col-span-4 space-y-10">
          
          {/* Upcoming Sessions */}
          <section>
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#eab308]" /> Live Events
            </h3>
            <div className="space-y-4">
              {upcomingSessions.map((s, i) => (
                <GlassCard key={i} className="p-6 border-white/5 hover:border-[#eab308]/30 transition-all cursor-pointer">
                  <p className="text-[10px] font-mono text-[#eab308] uppercase tracking-widest mb-2">{s.time}</p>
                  <h4 className="font-bold mb-2">{s.title}</h4>
                  <p className="text-xs text-white/40">Mentor: {s.mentor}</p>
                </GlassCard>
              ))}
            </div>
          </section>

          {/* Community Feed Widget */}
          <section>
            <GlassCard className="p-8 border-[#eab308]/10 bg-[#eab308]/5">
              <h3 className="text-xl font-bold mb-6">Cohort Alpha</h3>
              <div className="space-y-6">
                {[1, 2, 3].map((_, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-white/10 shrink-0" />
                    <div>
                      <p className="text-xs font-bold mb-1">Student {i + 1} <span className="text-white/20 font-normal">shared a resource</span></p>
                      <p className="text-xs text-white/50 leading-relaxed">"Just found this amazing paper on low-rank adaptation. Worth checking out for module 5!"</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-8 py-3 rounded-xl border border-[#eab308]/30 text-[#eab308] text-xs font-bold hover:bg-[#eab308] hover:text-black transition-all">
                Join Slack Community
              </button>
            </GlassCard>
          </section>

        </div>

      </div>
    </div>
  );
}

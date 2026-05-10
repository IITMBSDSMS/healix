"use client";

import React from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { motion } from "framer-motion";
import { FileText, Scale, AlertCircle, Zap, ShieldCheck } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#050505] pt-32 pb-24">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto px-6"
      >
        <div className="mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-500/30 bg-orange-500/10 mb-6">
            <Scale className="w-3 h-3 text-orange-400" />
            <span className="text-[10px] font-mono text-orange-400 uppercase tracking-widest">Legal Framework</span>
          </div>
          <h1 className="text-4xl font-bold mb-4 text-white">Terms of Service</h1>
          <p className="text-white/40 max-w-xl mx-auto">
            Operating the intersection of technology and human safety requires clear protocols. These terms govern your use of the Healix platform.
          </p>
          <p className="text-white/20 text-xs mt-4 font-mono">Last updated: May 10, 2026</p>
        </div>

        <GlassCard className="p-10 space-y-12" glowOnHover={false}>
          <section>
            <div className="flex items-center gap-3 mb-4 text-orange-400">
              <ShieldCheck className="w-5 h-5" />
              <h2 className="text-xl font-semibold">1. Service Scope</h2>
            </div>
            <p className="text-white/70 leading-relaxed">
              Healix Technologies provides AI-driven healthcare guidance, laboratory management tools, and IoT-based security orchestration. By accessing these services, you agree to comply with all applicable local and international laws regarding digital safety and data ethics.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4 text-orange-400">
              <AlertCircle className="w-5 h-5" />
              <h2 className="text-xl font-semibold">2. Medical Disclaimer</h2>
            </div>
            <div className="bg-orange-500/5 border border-orange-500/20 p-6 rounded-2xl">
              <p className="text-sm text-orange-200/80 leading-relaxed font-medium">
                IMPORTANT: The BioLabs symptom checker and AI guidance modules are NOT diagnostic tools. They are designed for informational guidance and research purposes only. Always consult a licensed medical professional for clinical diagnosis and treatment. In an emergency, contact your local emergency services immediately.
              </p>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4 text-orange-400">
              <Zap className="w-5 h-5" />
              <h2 className="text-xl font-semibold">3. Suraksha Protocols</h2>
            </div>
            <p className="text-white/70 leading-relaxed">
              When using Project Suraksha, you authorize the platform to broadcast your location and device telemetry to designated emergency contacts or centralized operations centers during a triggered SOS event. Misuse of the SOS system (intentional false alerts) may result in account termination.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4 text-orange-400">
              <FileText className="w-5 h-5" />
              <h2 className="text-xl font-semibold">4. Intellectual Property</h2>
            </div>
            <p className="text-white/70 leading-relaxed">
              All proprietary algorithms, UI/UX designs, and the "Healix" name are the exclusive property of Healix Technologies. Users are granted a limited, non-exclusive license to use the platform for its intended purpose. Reverse engineering our telemetry protocols is strictly prohibited.
            </p>
          </section>

          <div className="pt-8 border-t border-white/5 flex flex-col items-center">
            <p className="text-xs text-white/30 text-center italic uppercase tracking-widest">
              Standard Agreement v4.2.0 // Healix Legal Dept.
            </p>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}

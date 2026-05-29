"use client";

import React from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { motion } from "framer-motion";
import { Shield, Lock, Eye, FileText, Globe, Scale, Database } from "lucide-react";

const MeshBackground = () => {
  return (
    <div className="absolute inset-0 z-0 opacity-15 pointer-events-none">
      <svg width="100%" height="100%" className="w-full h-full">
        <pattern id="mesh-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1" fill="#ea580c" opacity="0.5" />
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#ea580c" strokeWidth="0.2" opacity="0.2" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#mesh-pattern)" />
      </svg>
    </div>
  );
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-zinc-50 pt-32 pb-24 relative overflow-hidden">
      <MeshBackground />
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto px-6 relative z-10"
      >
        <div className="mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#ea580c]/30 bg-[#ea580c]/10 mb-6">
            <Lock className="w-3 h-3 text-[#ea580c]" />
            <span className="text-[10px] font-mono text-[#ea580c] uppercase tracking-widest font-bold">Compliance & Privacy</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black mb-4 text-zinc-950 font-mono uppercase tracking-tight">Privacy Policy</h1>
          <p className="text-zinc-650 max-w-xl mx-auto text-sm leading-relaxed">
            Your privacy is our priority. This document outlines how Healix Technologies handles data across medical, laboratory, and security subsystems.
          </p>
          <p className="text-zinc-400 text-xs mt-4 font-mono">Last updated: May 28, 2026</p>
        </div>

        <GlassCard className="p-10 space-y-12 bg-white border border-zinc-200" glowOnHover={false}>
          <section>
            <div className="flex items-center gap-3 mb-4 text-[#ea580c]">
              <Eye className="w-5 h-5" />
              <h2 className="text-xl font-bold font-mono tracking-tight text-zinc-900 uppercase">1. Data Sovereignty</h2>
            </div>
            <p className="text-zinc-700 leading-relaxed text-sm">
              At Healix, we adhere to a "Security by Design" philosophy. Personal data collected through the BioLabs diagnostic engine or the HSF SOS system is encrypted at rest and in transit using AES-256 and TLS 1.3 protocols. We do not sell, rent, or trade your data to third-party advertisers.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4 text-[#ea580c]">
              <Database className="w-5 h-5" />
              <h2 className="text-xl font-bold font-mono tracking-tight text-zinc-900 uppercase">2. Information Collection</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="bg-zinc-50 border border-zinc-200 p-5 rounded-2xl">
                <h3 className="text-sm font-black text-zinc-950 mb-2 uppercase tracking-tight font-mono">Medical & Lab Data</h3>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Symptom inputs and diagnostic telemetry from BioLabs are anonymized and used exclusively for generating health guidance. These records are purged after 90 days unless explicitly saved to your permanent health record.
                </p>
              </div>
              <div className="bg-zinc-50 border border-zinc-200 p-5 rounded-2xl">
                <h3 className="text-sm font-black text-zinc-950 mb-2 uppercase tracking-tight font-mono">Security Telemetry</h3>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  During an active Suraksha ride, real-time GPS coordinates, device velocity, and tamper logs are recorded to ensure passenger safety. This data is only accessible to authorized emergency response personnel.
                </p>
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4 text-[#ea580c]">
              <Globe className="w-5 h-5" />
              <h2 className="text-xl font-bold font-mono tracking-tight text-zinc-900 uppercase">3. Global Standards</h2>
            </div>
            <p className="text-zinc-700 leading-relaxed text-sm">
              Our infrastructure is designed to align with the General Data Protection Regulation (GDPR) and the Digital Personal Data Protection Act (DPDP). Users have the right to request a full export of their data or invoke the "Right to be Forgotten" via our support gateway.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4 text-[#ea580c]">
              <Shield className="w-5 h-5" />
              <h2 className="text-xl font-bold font-mono tracking-tight text-zinc-900 uppercase">4. Failsafe Protocols</h2>
            </div>
            <p className="text-zinc-700 leading-relaxed text-sm">
              In the event of a security breach, our automated Incident Response Subsystem (IRS) will isolate affected data partitions within 500ms and notify all potentially impacted users within 24 hours.
            </p>
          </section>

          <div className="pt-8 border-t border-zinc-200 flex flex-col items-center">
            <p className="text-xs text-zinc-500 text-center font-mono leading-relaxed">
              Healix Technologies Pvt Ltd. <br />
              Enterprise Security Division, HQ-1 <br />
              <span className="font-bold text-zinc-800">office@healix-technologies.com</span>
            </p>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}

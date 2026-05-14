"use client";

import React from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { motion } from "framer-motion";
import { Shield, Lock, Eye, FileText, Globe, Scale, Database } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#050505] pt-32 pb-24">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto px-6"
      >
        <div className="mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 mb-6">
            <Lock className="w-3 h-3 text-blue-400" />
            <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest">Compliance & Privacy</span>
          </div>
          <h1 className="text-4xl font-bold mb-4 text-white">Privacy Policy</h1>
          <p className="text-white/40 max-w-xl mx-auto">
            Your privacy is our priority. This document outlines how Healix Technologies handles data across medical, laboratory, and security subsystems.
          </p>
          <p className="text-white/20 text-xs mt-4 font-mono">Last updated: May 10, 2026</p>
        </div>

        <GlassCard className="p-10 space-y-12" glowOnHover={false}>
          <section>
            <div className="flex items-center gap-3 mb-4 text-blue-400">
              <Eye className="w-5 h-5" />
              <h2 className="text-xl font-semibold">1. Data Sovereignty</h2>
            </div>
            <p className="text-white/70 leading-relaxed">
              At Healix, we adhere to a "Security by Design" philosophy. Personal data collected through the BioLabs diagnostic engine or the SheSecure SOS system is encrypted at rest and in transit using AES-256 and TLS 1.3 protocols. We do not sell, rent, or trade your data to third-party advertisers.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4 text-blue-400">
              <Database className="w-5 h-5" />
              <h2 className="text-xl font-semibold">2. Information Collection</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
                <h3 className="text-sm font-bold text-white mb-2 uppercase tracking-tight">Medical & Lab Data</h3>
                <p className="text-xs text-white/50 leading-relaxed">
                  Symptom inputs and diagnostic telemetry from BioLabs are anonymized and used exclusively for generating health guidance. These records are purged after 90 days unless explicitly saved to your permanent health record.
                </p>
              </div>
              <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
                <h3 className="text-sm font-bold text-white mb-2 uppercase tracking-tight">Security Telemetry</h3>
                <p className="text-xs text-white/50 leading-relaxed">
                  During an active Suraksha ride, real-time GPS coordinates, device velocity, and tamper logs are recorded to ensure passenger safety. This data is only accessible to authorized emergency response personnel.
                </p>
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4 text-blue-400">
              <Globe className="w-5 h-5" />
              <h2 className="text-xl font-semibold">3. Global Standards</h2>
            </div>
            <p className="text-white/70 leading-relaxed">
              Our infrastructure is designed to align with the General Data Protection Regulation (GDPR) and the Digital Personal Data Protection Act (DPDP). Users have the right to request a full export of their data or invoke the "Right to be Forgotten" via our support gateway.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4 text-blue-400">
              <Shield className="w-5 h-5" />
              <h2 className="text-xl font-semibold">4. Failsafe Protocols</h2>
            </div>
            <p className="text-white/70 leading-relaxed">
              In the event of a security breach, our automated Incident Response Subsystem (IRS) will isolate affected data partitions within 500ms and notify all potentially impacted users within 24 hours.
            </p>
          </section>

          <div className="pt-8 border-t border-white/5 flex flex-col items-center">
            <p className="text-xs text-white/30 text-center italic">
              Healix Technologies Pvt Ltd. <br />
              Enterprise Security Division, HQ-1 <br />
              healixtechnologies@gmail.com
            </p>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}

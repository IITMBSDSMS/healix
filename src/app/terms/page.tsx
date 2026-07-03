"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FileText, Scale, AlertCircle, Zap, ShieldCheck } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-zinc-100/60 pt-28 pb-20 relative overflow-hidden flex items-center justify-center font-sans">
      
      {/* Background decoration grid */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none">
        <svg width="100%" height="100%" className="w-full h-full">
          <pattern id="grid-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="black" strokeWidth="1" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid-pattern)" />
        </svg>
      </div>

      <Link 
        href="/" 
        className="absolute top-8 left-8 text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500 hover:text-zinc-950 flex items-center gap-1.5 transition-colors z-20"
      >
        ← Return to Home
      </Link>

      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-4xl mx-auto px-6 relative z-10"
      >
        <div className="bg-white border border-zinc-200 shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-8 md:p-16 relative overflow-hidden">
          
          {/* Official Verification Stamp */}
          <div className="absolute top-12 right-12 w-28 h-28 border-4 border-dashed border-[#0066ff]/20 rounded-full flex items-center justify-center rotate-12 pointer-events-none select-none">
            <div className="text-center font-mono text-[9px] font-bold text-[#0066ff]/35 tracking-widest leading-tight">
              HEALIX<br />
              LEGAL DEPT<br />
              <span className="text-[7px]">VERIFIED</span>
            </div>
          </div>

          {/* Letterhead Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-8 border-b border-zinc-250 gap-6">
            <div className="flex items-center gap-4">
              <img 
                src="/official-favicon-logo.png" 
                alt="Healix Logo" 
                className="w-12 h-13 object-contain" 
              />
              <div>
                <h2 className="text-sm font-black tracking-[0.2em] text-zinc-950 uppercase font-mono leading-none">Healix Technologies</h2>
                <p className="text-[9px] font-mono tracking-widest text-[#ea580c] uppercase mt-2 font-bold">Systems & Healthcare Engineering</p>
              </div>
            </div>
            <div className="text-left md:text-right font-mono text-[9px] text-zinc-400 space-y-1">
              <p>DOC ID: HT-TOS-2026-V4</p>
              <p>CLASSIFICATION: PUBLIC SYSTEM AGREEMENT</p>
              <p>JURISDICTION: DELHI NCR, IN</p>
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8 border-b border-zinc-200 text-left">
            <div>
              <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider block">Document Type</span>
              <span className="text-[11px] font-mono font-bold text-zinc-800 uppercase block mt-1">Terms of Service</span>
            </div>
            <div>
              <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider block">Effective Date</span>
              <span className="text-[11px] font-mono font-bold text-zinc-800 uppercase block mt-1">May 10, 2026</span>
            </div>
            <div>
              <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider block">Authority</span>
              <span className="text-[11px] font-mono font-bold text-zinc-800 uppercase block mt-1">Board of Directors</span>
            </div>
            <div>
              <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider block">Legal Status</span>
              <span className="text-[11px] font-mono font-bold text-emerald-600 uppercase block mt-1">Legally Binding</span>
            </div>
          </div>

          {/* Document Content */}
          <div className="mt-12 space-y-10">
            <div className="pb-4">
              <h1 className="text-3xl font-black uppercase text-zinc-900 font-mono tracking-tight mb-2">Terms of Service</h1>
              <p className="text-zinc-600 text-xs leading-relaxed max-w-2xl font-mono">
                Operating at the intersection of systems technology and human safety requires strict operational protocols. By utilizing the Healix platform (including AI, BioLabs, and SheSecure), you agree to be bound by the clauses specified herein.
              </p>
            </div>

            <div className="space-y-8 text-zinc-850 text-sm leading-relaxed">
              <section className="border-l-2 border-[#0066ff] pl-6">
                <h3 className="font-bold font-mono text-zinc-950 uppercase tracking-wider text-xs mb-3 flex items-center gap-2">
                  <Scale className="w-3.5 h-3.5 text-[#0066ff]" /> 01 / Service Scope & Access
                </h3>
                <p className="text-zinc-700 text-xs leading-relaxed">
                  Healix Technologies Incorporated provides automated artificial intelligence triage guidance, molecular sequence laboratory tooling, and real-time cellular safety networks. By accessing these services, users agree to provide accurate registration parameters and comply fully with all applicable international and regional regulations regarding data transmission and safety.
                </p>
              </section>

              <section className="border-l-2 border-[#ea580c] pl-6">
                <h3 className="font-bold font-mono text-zinc-950 uppercase tracking-wider text-xs mb-3 flex items-center gap-2">
                  <AlertCircle className="w-3.5 h-3.5 text-[#ea580c]" /> 02 / Critical Medical Disclaimer
                </h3>
                <div className="bg-amber-500/5 border border-amber-600/10 p-5 rounded">
                  <p className="text-zinc-700 font-medium text-xs leading-relaxed">
                    <strong className="text-amber-800 uppercase tracking-widest font-mono text-[9px] block mb-2 font-black">Warning Label HT-MED-DISCLAIMER</strong>
                    The BioLabs diagnostics module, symptom analyzer, and research endpoints are designed for educational, informatics, and academic research purposes only. They are NOT clinical diagnostic engines. Users must always seek advice from qualified medical practitioners. Do not ignore professional clinical judgment in the event of an emergency.
                  </p>
                </div>
              </section>

              <section className="border-l-2 border-[#0066ff] pl-6">
                <h3 className="font-bold font-mono text-zinc-950 uppercase tracking-wider text-xs mb-3 flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-[#0066ff]" /> 03 / Suraksha Security Orchestration
                </h3>
                <p className="text-zinc-700 text-xs leading-relaxed">
                  During an active Suraksha or SheSecure monitoring session, you authorize the platform to log and transmit GPS, cellular signal strength, accelerometer velocity, and panic trigger telemetry to selected emergency contacts or regional authorities. False triggers or malicious tampering with the SOS protocols will result in immediate service suspension.
                </p>
              </section>

              <section className="border-l-2 border-zinc-300 pl-6">
                <h3 className="font-bold font-mono text-zinc-950 uppercase tracking-wider text-xs mb-3 flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-zinc-500" /> 04 / IP & Reverse Engineering
                </h3>
                <p className="text-zinc-700 text-xs leading-relaxed">
                  All proprietary algorithms, web layout models, and structural designs are owned solely by Healix Technologies. Copying, decompiling, or reverse engineering any core component (specifically data models and IoT handshake triggers) is prohibited and subject to civil prosecution.
                </p>
              </section>
            </div>

            {/* Signatures & Execution Block */}
            <div className="pt-12 mt-12 border-t border-zinc-200">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                <div>
                  <p className="text-[10px] font-mono text-zinc-400 uppercase">Document Authority Signature</p>
                  <div className="mt-4 font-mono text-xs text-zinc-800">
                    <span className="italic block text-sm text-[#0066ff] font-serif">Healix Legal Dept.</span>
                    <span className="block border-t border-zinc-200 mt-2 pt-1 w-48">Board-Approved Legal Counsel</span>
                  </div>
                </div>
                <div className="text-left md:text-right">
                  <p className="text-[9px] font-mono text-zinc-400 uppercase">Corporate Certification</p>
                  <p className="text-[10px] font-mono text-zinc-800 font-bold uppercase mt-2">Healix Technologies Inc.</p>
                  <p className="text-[9px] font-mono text-zinc-500 mt-1">Compliance Standard v4.2.0</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

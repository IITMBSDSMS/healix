"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Shield, Eye, Database, Globe, Lock } from "lucide-react";

export default function PrivacyPage() {
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
          <div className="absolute top-12 right-12 w-28 h-28 border-4 border-dashed border-[#ea580c]/20 rounded-full flex items-center justify-center -rotate-12 pointer-events-none select-none">
            <div className="text-center font-mono text-[9px] font-bold text-[#ea580c]/35 tracking-widest leading-tight">
              HEALIX<br />
              COMPLIANCE<br />
              <span className="text-[7px]">APPROVED</span>
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
              <p>DOC ID: HT-POL-PRIVACY-2026-V4</p>
              <p>CLASSIFICATION: PUBLIC SYSTEM POLICY</p>
              <p>JURISDICTION: DELHI NCR, IN</p>
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8 border-b border-zinc-200 text-left">
            <div>
              <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider block">Document Type</span>
              <span className="text-[11px] font-mono font-bold text-zinc-800 uppercase block mt-1">Privacy Policy</span>
            </div>
            <div>
              <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider block">Effective Date</span>
              <span className="text-[11px] font-mono font-bold text-zinc-800 uppercase block mt-1">May 28, 2026</span>
            </div>
            <div>
              <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider block">Authority</span>
              <span className="text-[11px] font-mono font-bold text-zinc-800 uppercase block mt-1">Compliance Director</span>
            </div>
            <div>
              <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider block">Legal Status</span>
              <span className="text-[11px] font-mono font-bold text-emerald-600 uppercase block mt-1">Regulatory Standard</span>
            </div>
          </div>

          {/* Document Content */}
          <div className="mt-12 space-y-10">
            <div className="pb-4">
              <h1 className="text-3xl font-black uppercase text-zinc-900 font-mono tracking-tight mb-2">Privacy Policy</h1>
              <p className="text-zinc-600 text-xs leading-relaxed max-w-2xl font-mono">
                Your data privacy is our baseline protocol. This document outlines how Healix Technologies processes, stores, and protects personal telemetry across our medical, laboratory, and security subsystems.
              </p>
            </div>

            <div className="space-y-8 text-zinc-850 text-sm leading-relaxed">
              <section className="border-l-2 border-[#ea580c] pl-6">
                <h3 className="font-bold font-mono text-zinc-950 uppercase tracking-wider text-xs mb-3 flex items-center gap-2">
                  <Eye className="w-3.5 h-3.5 text-[#ea580c]" /> 01 / Data Sovereignty & Security
                </h3>
                <p className="text-zinc-700 text-xs leading-relaxed">
                  We adhere to a strict Security by Design framework. Personal data collected via the BioLabs diagnostics panel or the Project Suraksha telemetry system is encrypted at rest and in transit using AES-256 and TLS 1.3 protocol standards. Healix never sells, leases, or handles your data for third-party commercial advertisements.
                </p>
              </section>

              <section className="border-l-2 border-[#0066ff] pl-6">
                <h3 className="font-bold font-mono text-zinc-950 uppercase tracking-wider text-xs mb-3 flex items-center gap-2">
                  <Database className="w-3.5 h-3.5 text-[#0066ff]" /> 02 / Information Registries
                </h3>
                <p className="text-zinc-700 text-xs leading-relaxed">
                  We partition and isolate data based on product classifications:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-left">
                  <div className="border border-zinc-200 p-4 rounded bg-zinc-50/50">
                    <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider block">BioLabs & Diagnostic Inputs</span>
                    <p className="text-[11px] text-zinc-650 leading-relaxed mt-2 font-mono">
                      Symptomatic indices and genetics telemetry inputs are fully anonymized. Records are automatically purged after 90 days unless explicitly saved to your permanent personal health journal.
                    </p>
                  </div>
                  <div className="border border-zinc-200 p-4 rounded bg-zinc-50/50">
                    <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider block">Suraksha Telemetry Files</span>
                    <p className="text-[11px] text-zinc-650 leading-relaxed mt-2 font-mono">
                      During active monitoring, GPS coordinate sweeps, transit velocities, and network logs are compiled to secure user transit. Access is limited strictly to authorized emergency dispatch operators.
                    </p>
                  </div>
                </div>
              </section>

              <section className="border-l-2 border-[#ea580c] pl-6">
                <h3 className="font-bold font-mono text-zinc-950 uppercase tracking-wider text-xs mb-3 flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5 text-[#ea580c]" /> 03 / Compliance & Sovereignty
                </h3>
                <p className="text-zinc-700 text-xs leading-relaxed">
                  Healix services operate in alignment with the General Data Protection Regulation (GDPR) and the Digital Personal Data Protection Act (DPDP). Users retain absolute authority to request a structured printout of their records or exercise their Right to Be Forgotten via our support dashboard.
                </p>
              </section>

              <section className="border-l-2 border-zinc-300 pl-6">
                <h3 className="font-bold font-mono text-zinc-950 uppercase tracking-wider text-xs mb-3 flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-zinc-500" /> 04 / Incident Mitigation Protocols
                </h3>
                <p className="text-zinc-700 text-xs leading-relaxed">
                  Our automated Incident Response Subsystem (IRS) continuously monitors system integrity. In the anomalous event of a data breach, impacted partitions are isolated within 500ms, and all affected users will receive telemetry reports and notifications within 24 hours.
                </p>
              </section>
            </div>

            {/* Signatures & Execution Block */}
            <div className="pt-12 mt-12 border-t border-zinc-200">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                <div>
                  <p className="text-[10px] font-mono text-zinc-400 uppercase">Document Authority Signature</p>
                  <div className="mt-4 font-mono text-xs text-zinc-800">
                    <span className="italic block text-sm text-[#ea580c] font-serif">Healix Compliance Division</span>
                    <span className="block border-t border-zinc-200 mt-2 pt-1 w-48">Board-Certified Officer</span>
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

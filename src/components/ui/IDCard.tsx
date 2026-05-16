"use client";

import React from "react";
import { motion } from "framer-motion";
import { Shield, Zap, Activity, Code, Fingerprint, Globe, Mail, Phone, ExternalLink } from "lucide-react";
import Image from "next/image";

interface IDCardProps {
  name?: string;
  designation?: string;
  idNumber?: string;
  division?: string;
  validity?: string;
  accessLevel?: string;
  photoUrl?: string;
}

const GearBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
    <svg className="absolute -right-20 -top-20 w-80 h-80 animate-[spin_20s_linear_infinite]" viewBox="0 0 100 100">
      <path
        fill="currentColor"
        d="M95,50c0-2.2-0.3-4.4-0.8-6.5l-6.2-1.1c-0.5-2.5-1.4-4.8-2.6-7.1l4.4-4.6c-2.4-3.6-5.4-6.6-9-9l-4.6,4.4c-2.3-1.2-4.6-2.1-7.1-2.6l-1.1-6.2C65.5,5.1,60.8,5,56,5h-12c-4.8,0-9.5,0.1-12,0.3l-1.1,6.2c-2.5,0.5-4.8,1.4-7.1,2.6l-4.6-4.4c-3.6,2.4-6.6,5.4-9,9l4.4,4.6c-1.2,2.3-2.1,4.6-2.6,7.1l-6.2,1.1C5.1,43.5,5,48.2,5,53v6c0,4.8,0.1,9.5,0.3,12l6.2,1.1c0.5,2.5,1.4,4.8,2.6,7.1l-4.4,4.6c2.4,3.6,5.4,6.6,9,9l4.6-4.4c2.3,1.2,4.6,2.1,7.1,2.6l1.1,6.2c2.5,0.2,7.2,0.3,12,0.3h12c4.8,0,9.5-0.1,12-0.3l1.1-6.2c2.5-0.5,4.8-1.4,7.1-2.6l4.6,4.4c3.6-2.4,6.6-5.4,9-9l-4.4-4.6c1.2-2.3,2.1-4.6,2.6-7.1l6.2-1.1c0.2-2.5,0.3-7.2,0.3-12V50z M50,65c-8.3,0-15-6.7-15-15s6.7-15,15-15s15,6.7,15,15S58.3,65,50,65z"
      />
    </svg>
    <svg className="absolute -left-20 bottom-10 w-64 h-64 animate-[spin_30s_linear_infinite_reverse] opacity-50" viewBox="0 0 100 100">
      <path
        fill="currentColor"
        d="M95,50c0-2.2-0.3-4.4-0.8-6.5l-6.2-1.1c-0.5-2.5-1.4-4.8-2.6-7.1l4.4-4.6c-2.4-3.6-5.4-6.6-9-9l-4.6,4.4c-2.3-1.2-4.6-2.1-7.1-2.6l-1.1-6.2C65.5,5.1,60.8,5,56,5h-12c-4.8,0-9.5,0.1-12,0.3l-1.1,6.2c-2.5,0.5-4.8,1.4-7.1,2.6l-4.6-4.4c-3.6,2.4-6.6,5.4-9,9l4.4,4.6c-1.2,2.3-2.1,4.6-2.6,7.1l-6.2,1.1C5.1,43.5,5,48.2,5,53v6c0,4.8,0.1,9.5,0.3,12l6.2,1.1c0.5,2.5,1.4,4.8,2.6,7.1l-4.4,4.6c2.4,3.6,5.4,6.6,9,9l4.6-4.4c2.3,1.2,4.6,2.1,7.1,2.6l1.1,6.2c2.5,0.2,7.2,0.3,12,0.3h12c4.8,0,9.5-0.1,12-0.3l1.1-6.2c2.5-0.5,4.8-1.4,7.1-2.6l4.6,4.4c3.6-2.4,6.6-5.4,9-9l-4.4-4.6c1.2-2.3,2.1-4.6,2.6-7.1l6.2-1.1c0.2-2.5,0.3-7.2,0.3-12V50z M50,65c-8.3,0-15-6.7-15-15s6.7-15,15-15s15,6.7,15,15S58.3,65,50,65z"
      />
    </svg>
  </div>
);

export const IDCard = ({
  name = "Dr. PRIYA SHARMA",
  designation = "RESEARCH LEAD",
  idNumber = "HX-RES-2026-001",
  division = "BioLabs",
  validity = "May 2026 – May 2027",
  accessLevel = "Authorized Research Access",
  photoUrl = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop"
}: IDCardProps) => {
  return (
    <div className="flex flex-col lg:flex-row gap-12 items-center justify-center p-8 bg-[#050505]">
      {/* Front Side */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="relative w-[450px] h-[280px] bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] rounded-2xl border border-white/10 shadow-2xl overflow-hidden text-white font-sans select-none group"
      >
        <GearBackground />
        
        {/* Header */}
        <div className="relative z-10 pt-4 pb-2 text-center border-b border-white/5">
          <h2 className="text-xl font-bold tracking-wider text-white">HEALIX TECHNOLOGIES PVT. LTD.</h2>
          <p className="text-[10px] font-medium text-[#eab308]/80 mt-0.5 font-hindi">जैव-चिकित्सकीय अनुसंधान एवं अभियांत्रिकी केंद्र</p>
        </div>

        <div className="flex px-6 py-4 gap-6">
          {/* Photo Section */}
          <div className="relative">
            <div className="w-32 h-36 rounded-xl border-2 border-[#eab308]/50 overflow-hidden bg-black/40">
              <Image 
                src={photoUrl} 
                alt="Profile" 
                fill 
                className="object-cover"
              />
            </div>
          </div>

          {/* Details Section */}
          <div className="flex-1 space-y-2">
            <div className="grid grid-cols-[85px_1fr] gap-x-2 items-baseline">
              <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Full Name:</span>
              <span className="text-sm font-bold text-white tracking-tight">{name}</span>
            </div>
            <div className="grid grid-cols-[85px_1fr] gap-x-2 items-baseline">
              <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Designation:</span>
              <span className="text-[11px] font-semibold text-white/90">{designation}</span>
            </div>
            <div className="grid grid-cols-[85px_1fr] gap-x-2 items-baseline">
              <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Unique ID:</span>
              <span className="text-[11px] font-mono text-white/80">{idNumber}</span>
            </div>
            <div className="grid grid-cols-[85px_1fr] gap-x-2 items-baseline">
              <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Division:</span>
              <span className="text-[11px] font-medium text-white/80">{division}</span>
            </div>
            <div className="grid grid-cols-[85px_1fr] gap-x-2 items-baseline">
              <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Validity:</span>
              <span className="text-[11px] font-medium text-white/80">{validity}</span>
            </div>
            <div className="grid grid-cols-[85px_1fr] gap-x-2 items-baseline">
              <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Access:</span>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-tight">{accessLevel}</span>
            </div>
          </div>

          {/* Side Logo Icon */}
          <div className="absolute right-6 top-24 opacity-20">
            <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center">
              <Activity className="w-8 h-8 text-[#eab308]" />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between z-10">
          <div className="flex items-center gap-4">
            <div className="p-1 bg-white rounded-md">
              <Image 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://healix-nu.vercel.app/verify/${idNumber}`}
                width={48}
                height={48}
                alt="Verification QR"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest">Verification profile:</span>
              <span className="text-[9px] font-mono text-[#eab308] opacity-60">healix-nu.vercel.app/verify/{idNumber}</span>
            </div>
          </div>
          
          <div className="relative">
            <div className="w-12 h-12 rounded-full border border-[#eab308]/30 flex items-center justify-center bg-black/40 shadow-[0_0_15px_rgba(234,179,8,0.1)]">
               <Fingerprint className="w-6 h-6 text-[#eab308]" />
            </div>
            {/* Cog Outline */}
            <div className="absolute -inset-1 border border-dashed border-white/10 rounded-full animate-[spin_10s_linear_infinite]" />
          </div>
        </div>
      </motion.div>

      {/* Back Side */}
      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="relative w-[450px] h-[280px] bg-gradient-to-br from-[#111111] to-[#050505] rounded-2xl border border-white/10 shadow-2xl overflow-hidden text-white font-sans select-none group"
      >
        <GearBackground />

        <div className="relative z-10 p-8 flex flex-col h-full">
          <h3 className="text-lg font-bold text-center tracking-[0.3em] uppercase mb-6 border-b border-white/5 pb-2">Institutional Credential</h3>

          <div className="grid grid-cols-1 gap-6 flex-1">
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-[#eab308] uppercase tracking-[0.2em]">Authorized Access Areas:</p>
              <ul className="text-[11px] text-white/60 space-y-1 pl-4 list-disc marker:text-[#eab308]">
                <li>Research Labs & Bio-Compute Clusters</li>
                <li>Bioinformatics Systems (Level 4)</li>
                <li>Clinical Intelligence Dashboard</li>
                <li>Internal Academic Network</li>
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-2">
              <div className="space-y-1">
                <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest">Emergency Contact:</p>
                <p className="text-xs font-mono font-bold text-white tracking-tighter">+91 9540694581</p>
              </div>
              <div className="space-y-1 text-right">
                <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest">Website:</p>
                <p className="text-xs font-mono text-[#eab308] underline underline-offset-2">healix-nu.vercel.app</p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/5">
              <p className="text-[9px] text-white/40 leading-relaxed italic text-center">
                "Engineering Biomedical Intelligence"
              </p>
            </div>
          </div>

          {/* Tech Badges */}
          <div className="flex justify-end items-center gap-3 mt-auto opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all">
             <div className="p-1.5 rounded-lg bg-white/5 border border-white/10">
                <Zap className="w-3.5 h-3.5" />
             </div>
             <div className="p-1.5 rounded-lg bg-white/5 border border-white/10">
                <Code className="w-3.5 h-3.5" />
             </div>
             <div className="p-1.5 rounded-lg bg-white/5 border border-white/10">
                <Globe className="w-3.5 h-3.5" />
             </div>
             <div className="p-1.5 rounded-lg bg-[#eab308]/10 border border-[#eab308]/20">
                <Shield className="w-3.5 h-3.5 text-[#eab308]" />
             </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

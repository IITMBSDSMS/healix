"use client";

import React from "react";
import { motion } from "framer-motion";
import { Shield, Zap, Activity, Code, Fingerprint, Globe } from "lucide-react";
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
    <div className="flex flex-col lg:flex-row gap-12 items-center justify-center p-8 bg-[#050505] w-full">
      {/* Front Side */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="relative w-[500px] h-[320px] bg-[#1c1c1c] rounded-xl border-t border-white/10 shadow-2xl overflow-hidden text-white font-sans select-none group border-x border-x-white/5 border-b border-b-black"
      >
        <GearBackground />
        
        {/* Header */}
        <div className="relative z-10 pt-5 pb-3 text-center">
          <h2 className="text-[22px] font-bold tracking-wider text-white">HEALIX TECHNOLOGIES PVT. LTD.</h2>
          <p className="text-[14px] font-medium text-[#eab308] mt-1 font-hindi">जैव-चिकित्सकीय अनुसंधान एवं अभियांत्रिकी केंद्र</p>
        </div>

        <div className="flex px-6 py-2 gap-6 items-start relative z-10">
          {/* Photo Section */}
          <div className="relative shrink-0 mt-1">
            <div className="w-[110px] h-[140px] rounded-xl border-2 border-[#eab308] overflow-hidden bg-black/40">
              <Image 
                src={photoUrl} 
                alt="Profile" 
                fill 
                className="object-cover"
              />
            </div>
          </div>

          {/* Details Section */}
          <div className="flex-1 space-y-3 pl-2">
            <div className="grid grid-cols-[100px_1fr] gap-x-2 items-center">
              <span className="text-[11px] font-bold text-white/70 uppercase tracking-wider">FULL NAME:</span>
              <span className="text-[14px] font-bold text-white tracking-wide">{name}</span>
            </div>
            <div className="grid grid-cols-[100px_1fr] gap-x-2 items-center">
              <span className="text-[11px] font-bold text-white/70 uppercase tracking-wider">DESIGNATION:</span>
              <span className="text-[12px] font-normal text-white">{designation}</span>
            </div>
            <div className="grid grid-cols-[100px_1fr] gap-x-2 items-center">
              <span className="text-[11px] font-bold text-white/70 uppercase tracking-wider">UNIQUE ID:</span>
              <span className="text-[12px] font-normal text-white">{idNumber}</span>
            </div>
            <div className="grid grid-cols-[100px_1fr] gap-x-2 items-center">
              <span className="text-[11px] font-bold text-white/70 uppercase tracking-wider">DIVISION:</span>
              <span className="text-[12px] font-normal text-white">{division}</span>
            </div>
            <div className="grid grid-cols-[100px_1fr] gap-x-2 items-center">
              <span className="text-[11px] font-bold text-white/70 uppercase tracking-wider">VALIDITY:</span>
              <span className="text-[12px] font-normal text-white">{validity}</span>
            </div>
            <div className="grid grid-cols-[100px_1fr] gap-x-2 items-center">
              <span className="text-[11px] font-bold text-white/70 uppercase tracking-wider">ACCESS LEVEL:</span>
              <span className="text-[12px] font-normal text-white">{accessLevel}</span>
            </div>
          </div>

          {/* Side Logo Icon faint in background */}
          <div className="absolute right-6 top-16 opacity-[0.15]">
            <div className="w-24 h-24 rounded-full border-[2px] border-dashed border-white/40 flex items-center justify-center">
              <Activity className="w-10 h-10 text-white" />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between z-10">
          <div className="flex items-center gap-3 bg-white p-1 rounded-md">
            <Image 
              src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://www.healix-technologies.com/verify/${idNumber}`}
              width={54}
              height={54}
              alt="Verification QR"
            />
          </div>
          
          <div className="flex flex-col items-end pb-1 pr-2">
            <div className="flex flex-col items-start bg-black/40 px-2 py-1 rounded">
              <span className="text-[10px] font-bold text-white uppercase tracking-widest">Verification profile:</span>
              <span className="text-[10px] font-mono text-white mt-0.5">healix-technologies.com/verify/{idNumber}</span>
            </div>
          </div>

          <div className="relative ml-2">
            <div className="w-14 h-14 rounded-full border-2 border-[#eab308] flex items-center justify-center bg-black/60 shadow-[0_0_15px_rgba(234,179,8,0.1)]">
               <Activity className="w-7 h-7 text-[#eab308]" />
            </div>
            {/* Cog Outline */}
            <div className="absolute -inset-1 border border-dashed border-[#eab308]/40 rounded-full animate-[spin_10s_linear_infinite]" />
          </div>
        </div>
      </motion.div>

      {/* Back Side */}
      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="relative w-[500px] h-[320px] bg-[#1c1c1c] rounded-xl border-t border-white/10 shadow-2xl overflow-hidden text-white font-sans select-none group border-x border-x-white/5 border-b border-b-black"
      >
        <GearBackground />

        <div className="relative z-10 p-8 flex flex-col h-full">
          <h3 className="text-xl font-bold text-center tracking-[0.3em] uppercase mb-6 border-b border-white/10 pb-3">Institutional Credential</h3>

          <div className="grid grid-cols-1 gap-6 flex-1">
            <div className="space-y-3">
              <p className="text-[12px] font-bold text-[#eab308] uppercase tracking-[0.2em]">Authorized Access Areas:</p>
              <ul className="text-[12px] text-white/80 space-y-1.5 pl-4 list-disc marker:text-[#eab308]">
                <li>Research Labs & Bio-Compute Clusters</li>
                <li>Bioinformatics Systems (Level 4)</li>
                <li>Clinical Intelligence Dashboard</li>
                <li>Internal Academic Network</li>
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-2">
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Emergency Contact:</p>
                <p className="text-sm font-mono font-bold text-white tracking-tighter">+91 9540694581</p>
              </div>
              <div className="space-y-1.5 text-right">
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Website:</p>
                <p className="text-sm font-mono text-[#eab308] underline underline-offset-2">healix-technologies.com</p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-[10px] text-white/50 leading-relaxed italic text-center">
                "Engineering Biomedical Intelligence"
              </p>
            </div>
          </div>

          {/* Tech Badges */}
          <div className="flex justify-end items-center gap-3 mt-auto opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all">
             <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                <Zap className="w-4 h-4 text-white" />
             </div>
             <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                <Code className="w-4 h-4 text-white" />
             </div>
             <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                <Globe className="w-4 h-4 text-white" />
             </div>
             <div className="p-2 rounded-lg bg-[#eab308]/10 border border-[#eab308]/30">
                <Shield className="w-4 h-4 text-[#eab308]" />
             </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Zap, Activity, Code, Fingerprint, Globe, QrCode } from "lucide-react";
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

export const IDCard = ({
  name = "RESEARCHER",
  designation = "RESEARCH FELLOW",
  idNumber = "HX-RES-2026-4255",
  division = "BIOLABS RESEARCH",
  validity = "MAY 2026 - MAY 2027",
  accessLevel = "AUTHORIZED",
  photoUrl = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop"
}: IDCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center py-12 bg-transparent w-full">
      {/* Title above the card */}
      <div className="text-center mb-8">
        <p className="text-white/40 font-mono text-sm tracking-wider">
          Click the card to flip and view the reverse side.
        </p>
      </div>

      {/* The Card Container with 3D perspective */}
      <div 
        className="relative w-[340px] h-[520px] cursor-pointer group"
        style={{ perspective: "1500px" }}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <motion.div
          className="w-full h-full relative"
          style={{ transformStyle: "preserve-3d" }}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 100, damping: 20 }}
        >
          {/* FRONT FACE */}
          <div 
            className="absolute inset-0 bg-[#050505] rounded-[24px] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden"
            style={{ backfaceVisibility: "hidden" }}
          >
            {/* Top gold accent line/glow */}
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#eab308]/70 to-transparent shadow-[0_0_15px_rgba(234,179,8,0.8)]" />
            
            {/* Header */}
            <div className="pt-8 pb-4 text-center border-b border-white/10 mx-6">
              <h3 className="text-sm font-bold tracking-widest text-white uppercase">HEALIX TECHNOLOGIES PVT. LTD.</h3>
              <p className="text-[10px] font-medium text-[#eab308] mt-1.5 font-hindi tracking-wider">जैव-चिकित्सकीय अनुसंधान एवं अभियांत्रिकी केंद्र</p>
            </div>

            {/* Photo */}
            <div className="mt-8 mx-auto relative z-10">
              <div className="w-[140px] h-[180px] rounded-2xl border-2 border-[#eab308] overflow-hidden bg-black shadow-[0_0_20px_rgba(234,179,8,0.15)] relative">
                <Image 
                  src={photoUrl} 
                  alt="Profile" 
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Name */}
            <div className="text-center mt-6 mx-8 border-b border-white/10 pb-5">
              <p className="text-[10px] font-mono text-white/40 uppercase tracking-[0.25em] mb-1">Full Name</p>
              <h4 className="text-[22px] font-bold text-white tracking-widest uppercase">{name}</h4>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-y-5 gap-x-4 mx-8 mt-5 flex-1">
              <div>
                <p className="text-[9px] font-mono text-white/40 uppercase tracking-widest mb-1">Designation</p>
                <p className="text-[11px] font-bold text-[#eab308] uppercase tracking-wide">{designation}</p>
              </div>
              <div>
                <p className="text-[9px] font-mono text-white/40 uppercase tracking-widest mb-1">Unique ID</p>
                <p className="text-[11px] font-bold text-white uppercase tracking-wider">{idNumber}</p>
              </div>
              <div>
                <p className="text-[9px] font-mono text-white/40 uppercase tracking-widest mb-1">Division</p>
                <p className="text-[11px] font-bold text-white uppercase tracking-wide">{division}</p>
              </div>
              <div>
                <p className="text-[9px] font-mono text-white/40 uppercase tracking-widest mb-1">Validity</p>
                <p className="text-[11px] font-bold text-white uppercase tracking-wide">{validity}</p>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="mx-8 mb-6 mt-4 flex justify-between items-end relative z-10">
              <div>
                <p className="text-[9px] font-mono text-white/40 uppercase tracking-widest mb-1.5">Access Level</p>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#eab308]" />
                  <span className="text-[13px] font-bold text-white tracking-widest uppercase">{accessLevel}</span>
                </div>
              </div>
              <div className="p-1.5 bg-white rounded-lg flex items-center justify-center shadow-lg">
                <QrCode className="w-8 h-8 text-black" strokeWidth={1.5} />
              </div>
            </div>
          </div>

          {/* BACK FACE */}
          <div 
            className="absolute inset-0 bg-[#050505] rounded-[24px] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col p-8" 
            style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}
          >
            <div className="relative z-10 flex flex-col h-full">
              <h3 className="text-sm font-bold text-center tracking-[0.3em] uppercase mb-8 border-b border-white/10 pb-4 text-white">Institutional Credential</h3>

              <div className="flex-1 space-y-8">
                <div className="space-y-3">
                  <p className="text-[11px] font-bold text-[#eab308] uppercase tracking-[0.2em]">Authorized Access Areas:</p>
                  <ul className="text-[12px] text-white/70 space-y-2 pl-4 list-disc marker:text-[#eab308]">
                    <li>Research Labs & Bio-Compute Clusters</li>
                    <li>Bioinformatics Systems (Level 4)</li>
                    <li>Clinical Intelligence Dashboard</li>
                    <li>Internal Academic Network</li>
                  </ul>
                </div>

                <div className="space-y-6">
                  <div className="space-y-1.5">
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Emergency Contact:</p>
                    <p className="text-sm font-mono font-bold text-white tracking-tighter">+91 9540694581</p>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Website:</p>
                    <p className="text-sm font-mono text-[#eab308] underline underline-offset-4">healix-nu.vercel.app</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 relative">
                <p className="text-[10px] text-white/50 leading-relaxed italic text-center font-serif">
                  "Engineering Biomedical Intelligence"
                </p>
                <div className="absolute -bottom-2 right-0 flex justify-end items-center gap-3 opacity-60">
                   <div className="p-1.5 rounded-lg bg-white/5 border border-white/10">
                      <Zap className="w-3.5 h-3.5 text-white" />
                   </div>
                   <div className="p-1.5 rounded-lg bg-white/5 border border-white/10">
                      <Code className="w-3.5 h-3.5 text-white" />
                   </div>
                   <div className="p-1.5 rounded-lg bg-white/5 border border-white/10">
                      <Globe className="w-3.5 h-3.5 text-white" />
                   </div>
                   <div className="p-1.5 rounded-lg bg-[#eab308]/10 border border-[#eab308]/20">
                      <Shield className="w-3.5 h-3.5 text-[#eab308]" />
                   </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer Below Card */}
      <div className="mt-10 flex items-center justify-center gap-3 opacity-40">
        <Fingerprint className="w-4 h-4 text-white" />
        <span className="text-[10px] sm:text-xs font-mono text-white tracking-[0.15em]">
          Verify at /verify/{idNumber}
        </span>
      </div>
    </div>
  );
};

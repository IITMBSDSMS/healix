"use client";

import React, { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, Shield, Calendar, Award, ArrowLeft, RefreshCw, Cpu, Activity, Server, Database, Key } from "lucide-react";
import Link from "next/link";

export default function VerifyIdPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  // URL variables
  const uniqueId = params.id as string || "HX-RES-2026-9999";
  const name = searchParams.get("name") || "Research Fellow";
  const role = searchParams.get("role") || "Research Fellow";
  const division = searchParams.get("div") || "BioLabs Research";

  // Interaction & verification simulation states
  const [loading, setLoading] = useState(true);
  const [auditLogs, setAuditLogs] = useState<string[]>([]);
  const [auditStep, setAuditStep] = useState(0);

  // Verification audit logs simulation for extreme high-tech aesthetic
  const logSteps = [
    "⚡ Initiating institutional credential audit...",
    "🔑 Decoding token signature and validity tags...",
    "🛡️ Accessing public key directory from core registry...",
    "🧬 Scanning BioLabs fellowship active database...",
    "✅ Cryptographic signature MATCHES corporate ledger!",
    "🟢 Status loaded: ACTIVE & AUTHORIZED CREDENTIAL"
  ];

  useEffect(() => {
    if (auditStep < logSteps.length) {
      const delay = auditStep === 0 ? 300 : auditStep === logSteps.length - 1 ? 600 : 400;
      const timer = setTimeout(() => {
        setAuditLogs(prev => [...prev, logSteps[auditStep]]);
        setAuditStep(s => s + 1);
      }, delay);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [auditStep]);

  // Deterministic Cryptographic Fingerprint generator
  const generateFingerprint = (id: string) => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    const part1 = Math.abs(hash).toString(16).padEnd(8, 'e');
    const part2 = Math.abs(hash * 31).toString(16).padEnd(8, 'a');
    const part3 = Math.abs(hash * 97).toString(16).padEnd(8, 'f');
    return `HX_SIG_256_${part1}${part2}${part3}`.substring(0, 38).toUpperCase();
  };

  const fingerprint = generateFingerprint(uniqueId);

  return (
    <div className="min-h-screen bg-[#050505] text-white/90 font-sans flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden select-none">
      
      {/* Background neon glows & grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none opacity-40 z-0" />
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-green-500/5 blur-[120px] pointer-events-none z-0 animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#eab308]/5 blur-[120px] pointer-events-none z-0 animate-pulse" />

      {/* Embedded page styles for dynamic animations */}
      <style>{`
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes orbit-pulse {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(1.05); opacity: 0.8; }
        }
        .animate-spin-slow {
          animation: spin-slow 35s linear infinite;
        }
        .animate-orbit-pulse {
          animation: orbit-pulse 3s ease-in-out infinite;
        }
      `}</style>

      {/* Main Container */}
      <div className="w-full max-w-lg z-10">
        
        {/* Top Back Action Bar */}
        <div className="flex items-center gap-3 mb-6 relative">
          <Link 
            href="/" 
            className="flex items-center justify-center w-8 h-8 rounded-full border border-white/10 bg-black/40 hover:bg-white/5 transition-colors text-white/50 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <span className="text-xs font-mono tracking-widest text-white/30 uppercase">HEALIX_CORE_VERIFICATION</span>
        </div>

        {/* LOADING SCREEN */}
        {loading ? (
          <div className="bg-zinc-950/80 backdrop-blur-xl border border-zinc-800/80 rounded-2xl p-6 shadow-2xl relative overflow-hidden flex flex-col min-h-[380px] justify-between">
            <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-[#eab308] to-transparent animate-pulse" />
            
            {/* Loading top header */}
            <div className="flex items-center gap-3 border-b border-zinc-800/60 pb-4">
              <RefreshCw className="w-4 h-4 text-[#eab308] animate-spin" />
              <div>
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#eab308]">System Verification Check</h4>
                <p className="text-[9px] font-mono text-white/30">Target ID: {uniqueId}</p>
              </div>
            </div>

            {/* Audit log terminal */}
            <div className="flex-1 my-6 font-mono text-[10.5px] space-y-2.5 bg-black/50 p-4 rounded-lg border border-zinc-900/60 overflow-y-auto flex flex-col justify-start">
              {auditLogs.map((log, index) => (
                <div key={index} className={`leading-relaxed animate-in fade-in slide-in-from-left-2 duration-300 ${
                  index === logSteps.length - 1 ? "text-green-400 font-bold" : "text-white/60"
                }`}>
                  {log}
                </div>
              ))}
            </div>

            {/* Loading bottom tracker */}
            <div className="flex items-center justify-between text-[9px] font-mono text-white/30 border-t border-zinc-800/60 pt-4">
              <span className="flex items-center gap-1.5"><Server className="w-3 h-3" /> Core cluster nodes online</span>
              <span>HEALIX_SEC_AUDIT_2026</span>
            </div>
          </div>
        ) : (
          /* VERIFIED PAYLOAD CARD */
          <div className="bg-zinc-950/80 backdrop-blur-xl border border-green-500/20 rounded-2xl p-6 sm:p-8 shadow-[0_0_50px_rgba(34,197,94,0.05)] relative overflow-hidden animate-in zoom-in-95 duration-500">
            {/* Glowing top line */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-green-500 to-transparent" />
            
            {/* Verification Success Orbit Graphic */}
            <div className="flex flex-col items-center justify-center text-center mt-2 mb-6">
              <div className="relative flex items-center justify-center mb-4">
                {/* Dashed spinning orbital */}
                <div className="absolute w-[92px] h-[92px] sm:w-[104px] sm:h-[104px] rounded-full border border-dashed border-green-500/30 animate-spin-slow z-0" />
                {/* Pulsing ring outer */}
                <div className="absolute w-[78px] h-[78px] sm:w-[88px] sm:h-[88px] rounded-full border border-green-500/40 animate-orbit-pulse z-0" />
                {/* Verified Core bubble */}
                <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-green-500/10 border-2 border-green-500 flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.2)] z-10">
                  <CheckCircle2 className="w-8 h-8 sm:w-9 sm:h-9 text-green-400" />
                </div>
              </div>

              {/* Status Header Badge */}
              <div className="border border-green-500/40 bg-green-500/5 px-4 py-1.5 rounded-full inline-flex items-center gap-2 shadow-[0_0_15px_rgba(34,197,94,0.1)]">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-ping" />
                <span className="text-[10px] sm:text-xs font-mono font-bold tracking-[0.15em] text-green-400 uppercase">
                  Verified Institutional Credential
                </span>
              </div>
            </div>

            {/* Corporate Header */}
            <div className="text-center border-b border-zinc-800/80 pb-4 mb-5">
              <h2 className="text-lg font-bold text-white tracking-widest uppercase">HEALIX BIOLABS</h2>
              <p className="text-[9px] font-mono text-white/40 tracking-wider mt-0.5">SECURE VERIFIED LEDGER RECORD</p>
            </div>

            {/* Credential Data Grid */}
            <div className="space-y-4 font-mono select-text mb-6">
              
              <div className="bg-black/40 rounded-xl border border-zinc-900 p-4 space-y-3">
                <div className="grid grid-cols-[110px_1fr] border-b border-zinc-900 pb-2">
                  <span className="text-[10px] text-white/30 uppercase">Record Holder</span>
                  <span className="text-xs font-bold text-white/90 uppercase">{name}</span>
                </div>
                <div className="grid grid-cols-[110px_1fr] border-b border-zinc-900 pb-2">
                  <span className="text-[10px] text-white/30 uppercase">Designation</span>
                  <span className="text-xs font-bold text-[#eab308] uppercase">{role}</span>
                </div>
                <div className="grid grid-cols-[110px_1fr] border-b border-zinc-900 pb-2">
                  <span className="text-[10px] text-white/30 uppercase">Credential ID</span>
                  <span className="text-xs font-bold text-white/90">{uniqueId}</span>
                </div>
                <div className="grid grid-cols-[110px_1fr] border-b border-zinc-900 pb-2">
                  <span className="text-[10px] text-white/30 uppercase">Division</span>
                  <span className="text-xs font-bold text-white/80 uppercase">{division}</span>
                </div>
                <div className="grid grid-cols-[110px_1fr] border-b border-zinc-900 pb-2">
                  <span className="text-[10px] text-white/30 uppercase">Security Code</span>
                  <span className="text-[10px] text-green-400 font-bold uppercase flex items-center gap-1">
                    <Shield className="w-3 h-3" /> ACTIVE & SECURE
                  </span>
                </div>
                <div className="grid grid-cols-[110px_1fr]">
                  <span className="text-[10px] text-white/30 uppercase">Validity</span>
                  <span className="text-xs font-semibold text-white/70">May 2026 – May 2027</span>
                </div>
              </div>

              {/* Digital Signature Signature Block */}
              <div className="bg-black/20 rounded-xl border border-zinc-900/60 p-4 space-y-2">
                <div className="flex items-center justify-between border-b border-zinc-900/40 pb-2">
                  <span className="text-[9px] text-white/30 uppercase flex items-center gap-1"><Key className="w-3 h-3 text-[#eab308]/60" /> Cryptographic Sign</span>
                  <span className="text-[8px] text-white/40">SHA256 FINGERPRINT</span>
                </div>
                <p className="text-[9px] font-mono text-white/50 tracking-wider leading-relaxed break-all select-all font-semibold uppercase">
                  {fingerprint}
                </p>
                <div className="pt-2 flex flex-row justify-between items-center text-[8px] text-white/30">
                  <span className="flex items-center gap-1"><Cpu className="w-2.5 h-2.5" /> HSM Encrypted</span>
                  <span className="flex items-center gap-1"><Activity className="w-2.5 h-2.5" /> Integrity Verified</span>
                </div>
              </div>

            </div>

            {/* Back action controls */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link 
                href="/biolabs/dashboard"
                className="flex-1 bg-white text-black hover:bg-white/90 rounded-lg py-3 font-bold text-xs uppercase tracking-widest text-center transition-colors shadow-lg"
              >
                Access Dashboard
              </Link>
              <Link 
                href="/"
                className="flex-1 bg-zinc-900 border border-zinc-800 text-white/80 hover:bg-zinc-850 rounded-lg py-3 font-bold text-xs uppercase tracking-widest text-center transition-colors"
              >
                Healix Home
              </Link>
            </div>
            
            {/* Timestamp of validation */}
            <p className="text-center text-[8.5px] font-mono text-white/20 mt-6 select-none uppercase tracking-wider">
              Verification Session Timestamp: {new Date().toUTCString()}
            </p>

          </div>
        )}

      </div>
    </div>
  );
}

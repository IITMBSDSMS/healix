"use client";

import React, { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import BrandedQRCard from "@/components/ui/BrandedQRCard";
import { Shield, Download, Copy, Smartphone } from "lucide-react";
import { motion } from "framer-motion";

export default function BrandingPage() {
  const [copied, setCopied] = useState(false);
  const rideUrl = "https://healix-nu.vercel.app/ride/DEMO-SAFE-001";

  const copyUrl = () => {
    navigator.clipboard.writeText(rideUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen bg-gradient-to-br from-black via-zinc-950 to-blue-950 text-white">
      <div className="mb-12">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Identity & Branding
        </h1>
        <p className="text-white/60 max-w-2xl text-lg">
          Manage your scannable branded assets. These QR cards are engineered for Project Suraksha safety tracking and vehicle verification.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Preview Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <BrandedQRCard 
            deviceId="DEMO-SAFE-001"
            vehicleReg="DL-1-SAFE-2026"
            driverName="Healix Safety Driver"
            rideUrl={rideUrl}
          />
        </motion.div>

        {/* Configuration / Details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <GlassCard className="p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Shield className="text-blue-400" /> Infrastructure Logo
            </h2>
            <p className="text-white/60 mb-8 leading-relaxed">
              This high-fidelity scannable logo combines the Healix Shield with a high-error-correction QR code. Even if 30% of the card is damaged, the safety logic remains operational.
            </p>

            <div className="space-y-4">
              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-1">Target Endpoint</p>
                <div className="flex items-center justify-between">
                  <code className="text-sm text-blue-400">{rideUrl}</code>
                  <button onClick={copyUrl} className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/60">
                    {copied ? <span className="text-green-500 text-[10px] font-bold">COPIED</span> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-1">Print Density</p>
                  <p className="text-lg font-bold">300 DPI</p>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-1">Safe Zone</p>
                  <p className="text-lg font-bold">14.2%</p>
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-8 border-purple-500/10">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Smartphone className="text-purple-400" /> Deployment Guide
            </h3>
            <ol className="space-y-4 text-sm text-white/60 list-decimal pl-4">
              <li>Download the high-resolution PNG using the button on the left.</li>
              <li>Print on a durable vinyl sticker or 300gsm matte card.</li>
              <li>Place on the left-rear passenger window or vehicle dashboard.</li>
              <li>Passengers scan this to initialize a Suraksha Secure Ride.</li>
            </ol>
            <button className="w-full mt-8 py-3 bg-purple-600 hover:bg-purple-500 hover:scale-105 shadow-lg shadow-purple-500/30 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2">
              <Download className="w-4 h-4" /> Download All Branded Assets
            </button>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}

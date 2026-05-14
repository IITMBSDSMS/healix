"use client";

import { useState } from "react";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { login } from "@/app/auth/actions";
import { HealixLogo } from "@/components/ui/HealixLogo";
import { motion } from "framer-motion";
import { Shield, Lock, Mail, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    const result = await login(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 overflow-hidden bg-[#050505]">
      {/* Background Cinematic Elements */}
      <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-[#eab308]/8 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 -right-1/4 w-[600px] h-[600px] bg-[#ca8a04]/8 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="flex flex-col items-center mb-10">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="mb-6"
          >
            <HealixLogo size={72} />
          </motion.div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Access Gateway</h1>
          <p className="text-white/40 text-sm mt-2 font-mono uppercase tracking-widest">Secure Infrastructure Login</p>
        </div>

        <GlassCard className="p-10 border-white/10" glowOnHover={true}>
          <form action={handleSubmit} className="space-y-6">
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest block pl-1">Protocol Identifier (Email)</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white focus:outline-none focus:border-[#eab308] focus:ring-1 focus:ring-[#eab308]/30 transition-all text-sm"
                  placeholder="name@agency.com"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest block pl-1">Security Credential (Password)</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white focus:outline-none focus:border-[#eab308] focus:ring-1 focus:ring-[#eab308]/30 transition-all text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-400 text-xs"
              >
                <Shield className="w-4 h-4" />
                <span>{error}</span>
              </motion.div>
            )}

            <Button type="submit" className="w-full py-6 text-sm font-bold uppercase tracking-widest group" isLoading={loading}>
              Establish Connection
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </form>

          <div className="mt-8 pt-8 border-t border-white/5 text-center">
            <p className="text-sm text-white/40">
              Unauthorized access is strictly prohibited. <br />
              Need credentials?{" "}
              <Link href="/signup" className="text-[#eab308] hover:text-[#fde047] font-bold transition-colors">
                Request Access
              </Link>
            </p>
          </div>
        </GlassCard>

        <div className="mt-12 flex justify-center gap-8 text-[10px] font-mono text-white/20 uppercase tracking-widest">
          <span className="flex items-center gap-1.5"><div className="w-1 h-1 rounded-full bg-white/20" /> AES-256</span>
          <span className="flex items-center gap-1.5"><div className="w-1 h-1 rounded-full bg-white/20" /> TLS 1.3</span>
          <span className="flex items-center gap-1.5"><div className="w-1 h-1 rounded-full bg-white/20" /> ISO/IEC 27001</span>
        </div>
      </motion.div>
    </div>
  );
}

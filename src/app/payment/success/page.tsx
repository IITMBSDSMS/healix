"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { CheckCircle2, ArrowRight, Download, Share2, Sparkles } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paymentId = searchParams.get("payment_id") || "PAY-" + Math.random().toString(36).substr(2, 9).toUpperCase();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#eab308]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-2xl w-full relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <GlassCard className="p-12 text-center border-emerald-500/20 bg-emerald-500/[0.02]">
            <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-10 shadow-[0_0_40px_rgba(16,185,129,0.2)]">
              <CheckCircle2 className="w-12 h-12 text-emerald-500" />
            </div>

            <h1 className="text-4xl font-bold tracking-tighter mb-4">Registration Successful!</h1>
            <p className="text-white/50 text-lg mb-10">
              Welcome to the cohort. Your seat is confirmed and your learning journey begins now.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-12">
              <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-left">
                <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest mb-1">Payment ID</p>
                <p className="text-sm font-bold truncate">{paymentId}</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-left">
                <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest mb-1">Status</p>
                <p className="text-sm font-bold text-emerald-400">Confirmed</p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <Button size="lg" className="h-14 text-lg" onClick={() => router.push("/academy/dashboard")}>
                Go to Student Dashboard <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <div className="flex gap-4">
                <Button variant="outline" className="flex-1 gap-2">
                  <Download className="w-4 h-4" /> Invoice
                </Button>
                <Button variant="outline" className="flex-1 gap-2">
                  <Share2 className="w-4 h-4" /> Share
                </Button>
              </div>
            </div>

            <div className="mt-12 pt-12 border-t border-white/5 flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-[#eab308]" />
              <p className="text-xs font-mono text-white/30 uppercase tracking-widest">
                Check your email for orientation details
              </p>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-12"
        >
          <Link href="/academy" className="text-sm font-mono text-white/20 hover:text-white transition-colors uppercase tracking-widest">
            Back to Academy Home
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

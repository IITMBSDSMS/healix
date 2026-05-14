"use client";

import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import confetti from "canvas-confetti";

export default function PaymentSuccess() {
  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#eab308', '#ffffff', '#ca8a04']
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#0a0a0f] border border-white/10 rounded-3xl p-10 max-w-md w-full text-center shadow-2xl relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#eab308]/10 to-transparent pointer-events-none" />
        
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/30">
          <CheckCircle2 className="w-10 h-10 text-green-500" />
        </div>
        
        <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
        <p className="text-white/60 mb-8">
          Welcome to Healix Academy. Your transaction has been verified and your student account is now active.
        </p>
        
        <div className="bg-black/50 border border-white/5 rounded-xl p-4 mb-8 text-left">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-white/50">Transaction ID</span>
            <span className="font-mono">HX-{Math.floor(Math.random() * 10000000)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-white/50">Status</span>
            <span className="text-green-400 font-bold">Verified</span>
          </div>
        </div>

        <Link href="/dashboard">
          <button className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2">
            Go to Dashboard <ArrowRight className="w-5 h-5" />
          </button>
        </Link>
      </motion.div>
    </div>
  );
}

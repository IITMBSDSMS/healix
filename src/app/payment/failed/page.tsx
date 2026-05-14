"use client";

import { motion } from "framer-motion";
import { AlertCircle, RotateCcw } from "lucide-react";
import Link from "next/link";

export default function PaymentFailed() {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#0a0a0f] border border-red-500/30 rounded-3xl p-10 max-w-md w-full text-center shadow-2xl relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-red-500/10 to-transparent pointer-events-none" />
        
        <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/30">
          <AlertCircle className="w-10 h-10 text-red-500" />
        </div>
        
        <h1 className="text-3xl font-bold mb-4">Payment Failed</h1>
        <p className="text-white/60 mb-8">
          We couldn't process your transaction. Please check your payment details and try again.
        </p>

        <Link href="/register">
          <button className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2">
            <RotateCcw className="w-5 h-5" /> Retry Payment
          </button>
        </Link>
      </motion.div>
    </div>
  );
}

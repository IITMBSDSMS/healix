"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { HealixLogo } from "./HealixLogo";

export function HealixIntro({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  const steps = [
    "INITIALIZING CORE SYSTEMS...",
    "ESTABLISHING SECURE GATEWAY...",
    "SYNCING BIOLABS TELEMETRY...",
    "ACTIVATING SURAKSHA PROTOCOLS...",
    "SYSTEM READY."
  ];

  useEffect(() => {
    // Check if we've already seen the intro this session
    const hasSeenIntro = sessionStorage.getItem("healix_intro_seen");
    if (hasSeenIntro) {
      onComplete();
      return;
    }

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setIsExiting(true);
            sessionStorage.setItem("healix_intro_seen", "true");
            setTimeout(onComplete, 800);
          }, 500);
          return 100;
        }
        return prev + 1;
      });
    }, 20);

    const stepTimer = setInterval(() => {
      setStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 600);

    return () => {
      clearInterval(timer);
      clearInterval(stepTimer);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(20px)" }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050505] text-white overflow-hidden"
        >
          {/* Ambient Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px]" />
          
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative mb-12"
          >
            <div className="w-24 h-24 text-white">
              <HealixLogo />
            </div>
            <motion.div
              animate={{ 
                opacity: [0.3, 0.6, 0.3],
                scale: [1, 1.05, 1]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full"
            />
          </motion.div>

          <div className="w-64 space-y-4">
            <div className="flex justify-between items-end mb-1">
              <motion.span 
                key={step}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[10px] font-mono text-blue-400 tracking-tighter"
              >
                {steps[step]}
              </motion.span>
              <span className="text-[10px] font-mono text-white/40">{progress}%</span>
            </div>
            
            <div className="h-[2px] w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-gradient-to-r from-blue-600 to-blue-400"
              />
            </div>
          </div>

          <div className="absolute bottom-12 left-12">
            <div className="flex items-center gap-3 text-white/20">
              <div className="w-1 h-1 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-[8px] font-mono tracking-widest uppercase">Production Environment v2.4.0</span>
            </div>
          </div>

          {/* Scanning lines effect */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

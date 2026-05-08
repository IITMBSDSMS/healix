"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HealixLogo } from "@/components/ui/HealixLogo";

export function SplashScreen() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const hasShown = sessionStorage.getItem("healix_splash_shown");
    if (hasShown) {
      setShow(false);
      return;
    }

    const timer = setTimeout(() => {
      setShow(false);
      sessionStorage.setItem("healix_splash_shown", "true");
    }, 3800); // Increased timeout slightly to give time to read the tagline

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050505]"
        >
          {/* Radial glow behind logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: 0.18, scale: 1.6 }}
            transition={{ duration: 1.4, ease: "easeOut" }}
            className="absolute w-72 h-72 rounded-full bg-primary blur-[80px]"
          />

          <motion.div
            initial={{ scale: 0.7, opacity: 0, filter: "blur(16px)" }}
            animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.9, ease: [0.34, 1.56, 0.64, 1] }}
            className="flex flex-col items-center relative z-10"
          >
            {/* Logo with spin-in */}
            <motion.div
              initial={{ rotate: -30, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.9, ease: [0.34, 1.56, 0.64, 1] }}
              className="mb-7"
            >
              <HealixLogo size={96} />
            </motion.div>

            {/* Brand name */}
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="text-3xl md:text-4xl font-bold tracking-[0.15em] text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70 uppercase"
            >
              Healix
            </motion.h1>

            <motion.p
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.65 }}
              className="mt-2 text-sm text-white/40 tracking-[0.35em] uppercase"
            >
              Technologies · Pvt. Ltd.
            </motion.p>

            {/* Tagline */}
            <motion.p
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.85 }}
              className="mt-6 text-sm text-white/60 tracking-widest italic"
            >
              Healing today. Exploring Tomorrow.
            </motion.p>

            {/* Loading bar */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 1.6, delay: 0.9, ease: "easeInOut" }}
              className="mt-10 w-40 h-[2px] rounded-full bg-gradient-to-r from-transparent via-primary to-transparent origin-left"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

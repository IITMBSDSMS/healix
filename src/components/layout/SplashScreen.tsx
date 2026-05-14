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
          {/* Radial glow behind logo matching new yellow brand */}
          <motion.div
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: 0.25, scale: 1.8 }}
            transition={{ duration: 1.8, ease: "easeOut" }}
            className="absolute w-80 h-80 rounded-full bg-[#eab308] blur-[100px]"
          />

          <motion.div
            initial={{ scale: 0.8, opacity: 0, filter: "blur(20px)" }}
            animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 1, ease: [0.34, 1.56, 0.64, 1] }}
            className="flex flex-col items-center relative z-10 w-full px-4"
          >
            {/* Logo with spin-in */}
            <motion.div
              initial={{ rotate: -180, scale: 0.5, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              transition={{ duration: 1.2, type: "spring", bounce: 0.4 }}
              className="mb-8"
            >
              <HealixLogo size={112} />
            </motion.div>

            {/* Brand name */}
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-[0.1em] text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/70 uppercase text-center"
            >
              HEALIX TECHNOLOGIES PVT. LTD.
            </motion.h1>

            <motion.p
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="mt-4 text-sm md:text-base lg:text-lg text-[#eab308]/90 tracking-widest text-center uppercase font-semibold"
            >
              Centre for Biomedical Research & Engineering
            </motion.p>

            {/* Hindi Tagline */}
            <motion.p
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              className="mt-2 text-xs md:text-sm text-white/60 text-center font-medium"
            >
              जैव-चिकित्सीय अनुसंधान एवं अभियांत्रिकी केंद्र
            </motion.p>

            {/* Loading bar */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 2, delay: 1, ease: "easeInOut" }}
              className="mt-12 w-64 h-[3px] rounded-full bg-gradient-to-r from-transparent via-[#eab308] to-transparent origin-center"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

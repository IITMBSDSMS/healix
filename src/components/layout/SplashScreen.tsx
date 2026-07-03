"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HealixLogo } from "@/components/ui/HealixLogo";

export function SplashScreen() {
  const [show, setShow] = useState(false);
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const phrases = [
    { text: "world of opportunities.", color: "text-[#e31b23]" },
    { text: "future of health tech.", color: "text-[#0070f3]" },
    { text: "hub of clinical care.", color: "text-[#e31b23]" }
  ];

  useEffect(() => {
    const hasShown = sessionStorage.getItem("healix_splash_shown");
    if (!hasShown) {
      setShow(true);
    }
  }, []);

  useEffect(() => {
    if (!show) return;

    const currentPhrase = phrases[currentPhraseIndex].text;
    let timer: NodeJS.Timeout;

    if (isDeleting) {
      // Deleting characters
      timer = setTimeout(() => {
        setTypedText(prev => prev.slice(0, -1));
      }, 35); // Faster deletion
    } else {
      // Typing characters
      timer = setTimeout(() => {
        setTypedText(currentPhrase.slice(0, typedText.length + 1));
      }, 70); // Regular typing speed
    }

    // Handle state transitions
    if (!isDeleting && typedText === currentPhrase) {
      // Completed typing, pause before deleting
      timer = setTimeout(() => {
        setIsDeleting(true);
      }, 2000); // 2-second pause when fully typed
    } else if (isDeleting && typedText === "") {
      // Completed deleting, switch to next phrase
      setIsDeleting(false);
      setCurrentPhraseIndex(prev => (prev + 1) % phrases.length);
    }

    return () => clearTimeout(timer);
  }, [show, typedText, isDeleting, currentPhraseIndex]);

  const handleLetsGo = () => {
    setShow(false);
    sessionStorage.setItem("healix_splash_shown", "true");
    window.dispatchEvent(new CustomEvent("start-healix-tour"));
  };

  const handleSkip = () => {
    setShow(false);
    sessionStorage.setItem("healix_splash_shown", "true");
  };

  const cursorBgColor = phrases[currentPhraseIndex].color === "text-[#e31b23]" ? "bg-[#e31b23]" : "bg-[#0070f3]";

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1, pointerEvents: "all" }}
          exit={{ opacity: 0, filter: "blur(10px)" }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-br from-[#1c1d1f] to-[#0a0a0b] overflow-hidden"
        >
          {/* Pulsing Brand Signature Background Glows (Optimized with hardware-accelerated radial-gradients, no CSS filters) */}
          <motion.div
            animate={{
              opacity: [0.15, 0.35, 0.15]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-[radial-gradient(circle_at_center,rgba(0,75,135,0.75)_0%,transparent_70%)] pointer-events-none"
          />
          <motion.div
            animate={{
              opacity: [0.12, 0.28, 0.12]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[radial-gradient(circle_at_center,rgba(227,27,35,0.6)_0%,transparent_70%)] pointer-events-none"
          />

          {/* Main content container */}
          <div className="w-full max-w-6xl mx-auto px-6 md:px-12 lg:px-20 flex flex-col justify-center h-full relative z-10">
            <div className="max-w-2xl text-center md:text-left flex flex-col items-center md:items-start">
              
              {/* Animated Heading */}
              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight font-sans tracking-tight"
              >
                Welcome to this{" "}
                <br className="sm:hidden" />
                <span className={`${phrases[currentPhraseIndex].color} inline-block min-h-[1.2em] relative transition-colors duration-300`}>
                  {typedText}
                  <span className={`inline-block w-[3px] h-[0.9em] ${cursorBgColor} ml-1 animate-pulse align-middle`} />
                </span>
              </motion.h1>

              {/* Subheading */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.8 }}
                transition={{ duration: 0.6, delay: 1.2 }}
                className="mt-4 text-base sm:text-lg md:text-xl text-zinc-350 font-medium tracking-wide"
              >
                Take a quick tour to explore....
              </motion.p>

              {/* Actions */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.6 }}
                className="mt-8 flex flex-row items-center gap-4"
              >
                <button
                  onClick={handleLetsGo}
                  className="px-8 py-3 rounded-full bg-[#e31b23] hover:bg-[#c1131a] active:scale-95 text-white font-semibold tracking-wide transition-all duration-300 transform hover:scale-105 shadow-lg shadow-red-900/30 cursor-pointer text-sm sm:text-base"
                >
                  Let's Go!
                </button>
                <button
                  onClick={handleSkip}
                  className="px-8 py-3 rounded-full border border-white/40 hover:bg-white/10 active:scale-95 text-white font-semibold tracking-wide transition-all duration-300 transform hover:scale-105 cursor-pointer text-sm sm:text-base"
                >
                  Skip Tour
                </button>
              </motion.div>
            </div>
          </div>

          {/* Official Logo at the bottom center */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 0.75, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col items-center"
            >
              <HealixLogo size={44} />
              <p className="text-[9px] font-mono text-white/30 tracking-[0.25em] mt-2.5 uppercase">
                Official Platform
              </p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

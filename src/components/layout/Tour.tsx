"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, X } from "lucide-react";

interface Step {
  target: string;
  title: string;
  description: string;
}

const STEPS: Step[] = [
  {
    target: '[data-tour="hero"]',
    title: "Welcome to Healix",
    description: "Explore India's most advanced healthcare & safety platform. We combine AI diagnostics, SheSecure safety systems, and elite systems engineering.",
  },
  {
    target: "#ecosystem",
    title: "Our Ecosystem",
    description: "Discover our core initiatives: Biolabs Genomics, Lupens & Co., and Healix Sahyog, structured as highly interactive, alternating sections.",
  },
  {
    target: "#mentors",
    title: "Advisory Board & Mentors",
    description: "Meet the elite network of clinical researchers, academics, and industry experts guiding Healix's research and validations.",
  },
  {
    target: "#initiatives",
    title: "Key Initiatives",
    description: "Learn about our student research programs, clinical validation workflows, and public health deployments.",
  },
];

export function Tour() {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleStartTour = () => {
      setIsActive(true);
      setCurrentStep(0);
    };

    window.addEventListener("start-healix-tour", handleStartTour);

    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("start-healix-tour", handleStartTour);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (!isActive) return;

    const updateRect = () => {
      const step = STEPS[currentStep];
      const element = document.querySelector(step.target);
      if (element) {
        setTargetRect(element.getBoundingClientRect());
      } else {
        setTargetRect(null);
      }
    };

    // Scroll to element
    const step = STEPS[currentStep];
    const element = document.querySelector(step.target);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    // Wait for scroll to settle, then update bounding rect
    const scrollTimer = setTimeout(updateRect, 500);

    window.addEventListener("resize", updateRect);
    window.addEventListener("scroll", updateRect);

    const interval = setInterval(updateRect, 150);

    return () => {
      clearTimeout(scrollTimer);
      window.removeEventListener("resize", updateRect);
      window.removeEventListener("scroll", updateRect);
      clearInterval(interval);
    };
  }, [isActive, currentStep]);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleEndTour();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleEndTour = () => {
    setIsActive(false);
    setTargetRect(null);
  };

  const getMaskPath = () => {
    if (!isActive || !targetRect || windowSize.width === 0) return "";
    const w = windowSize.width;
    const h = windowSize.height;
    
    const padding = 12;
    const x = Math.max(0, targetRect.left - padding);
    const y = Math.max(0, targetRect.top - padding);
    const width = Math.min(w - x, targetRect.width + padding * 2);
    const height = Math.min(h - y, targetRect.height + padding * 2);
    const r = 12; // rounded spotlight corners
    
    return `
      M 0,0 
      L ${w},0 
      L ${w},${h} 
      L 0,${h} 
      Z 
      M ${x + r},${y} 
      h ${width - r * 2} 
      a ${r},${r} 0 0 1 ${r},${r} 
      v ${height - r * 2} 
      a ${r},${r} 0 0 1 -${r},${r} 
      h -${width - r * 2} 
      a ${r},${r} 0 0 1 -${r},-${r} 
      v -${height - r * 2} 
      a ${r},${r} 0 0 1 ${r},-${r}
      Z
    `;
  };

  const getTooltipStyle = () => {
    if (!targetRect || windowSize.width === 0) {
      return {
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        position: "fixed" as const,
      };
    }

    const margin = 20;
    const tooltipWidth = 340;
    const isVeryTall = targetRect.height > windowSize.height * 0.7;

    let top = 0;
    let left = targetRect.left + (targetRect.width - tooltipWidth) / 2;

    if (isVeryTall) {
      top = windowSize.height - 240;
    } else {
      top = targetRect.bottom + margin;
      if (top + 180 > windowSize.height) {
        top = targetRect.top - 180 - margin;
      }
    }

    // Keep tooltip in bounds
    left = Math.max(margin, Math.min(left, windowSize.width - tooltipWidth - margin));
    top = Math.max(margin, Math.min(top, windowSize.height - 220));

    return {
      top: `${top}px`,
      left: `${left}px`,
      position: "fixed" as const,
      width: `${tooltipWidth}px`,
    };
  };

  if (!isActive) return null;

  const step = STEPS[currentStep];

  return (
    <div className="fixed inset-0 z-[9990] overflow-hidden pointer-events-none">
      {/* Spotlight Backdrop */}
      <svg className="absolute inset-0 w-full h-full pointer-events-auto">
        <motion.path
          d={getMaskPath()}
          fill="rgba(5, 5, 5, 0.75)"
          fillRule="evenodd"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        />
      </svg>

      {/* Glassmorphic Tooltip Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.25 }}
          style={getTooltipStyle()}
          className="bg-zinc-950/90 border border-white/10 rounded-2xl p-5 shadow-2xl pointer-events-auto backdrop-blur-md flex flex-col z-[9995]"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 text-[9px] font-mono font-black tracking-widest text-[#eab308] border border-[#eab308]/20 bg-[#eab308]/5 rounded-full">
              STEP {currentStep + 1} OF {STEPS.length}
            </span>
            <button
              onClick={handleEndTour}
              className="text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Title & Description */}
          <h3 className="text-sm font-black uppercase font-mono tracking-tight text-white mt-3.5">
            {step.title}
          </h3>
          <p className="text-xs text-zinc-300 leading-relaxed font-sans mt-2">
            {step.description}
          </p>

          {/* Footer Controls */}
          <div className="flex items-center justify-between mt-5 pt-4 border-t border-white/5">
            <button
              onClick={handleEndTour}
              className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500 hover:text-white transition-colors cursor-pointer"
            >
              Skip
            </button>

            <div className="flex items-center gap-2">
              {currentStep > 0 && (
                <button
                  onClick={handleBack}
                  className="px-3 py-1.5 border border-white/15 hover:bg-white/5 active:scale-95 text-[10px] font-mono font-bold uppercase tracking-wider rounded-lg transition-all text-white flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3 h-3" /> Back
                </button>
              )}
              <button
                onClick={handleNext}
                className="px-4 py-1.5 bg-red-600 hover:bg-red-700 active:scale-95 text-[10px] font-mono font-bold uppercase tracking-wider rounded-lg transition-all text-white flex items-center gap-1 shadow-lg shadow-red-950/20 cursor-pointer"
              >
                {currentStep === STEPS.length - 1 ? "Finish" : "Next"}{" "}
                {currentStep < STEPS.length - 1 && <ArrowRight className="w-3 h-3" />}
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

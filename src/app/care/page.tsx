"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { 
  Menu, 
  X, 
  ChevronRight, 
  Play, 
  ArrowRight, 
  Search,
  Globe, 
  Users, 
  Award, 
  BookOpen
} from "lucide-react";

function TypewriterContact() {
  const lines = [
    "CHENNAI (HEADQUARTERS)",
    "IIT Madras",
    "Chennai, Tamil Nadu",
    "Pincode: 660032",
    "office@healix-technologies.com"
  ];
  
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [completedLines, setCompletedLines] = useState<string[]>([]);
  
  useEffect(() => {
    let timer: NodeJS.Timeout;
    const fullText = lines[currentLineIndex];
    
    if (!fullText) {
      // Loop: restart after 5 seconds
      timer = setTimeout(() => {
        setCompletedLines([]);
        setCurrentLineIndex(0);
        setCurrentText("");
      }, 5000);
      return () => clearTimeout(timer);
    }
    
    if (currentText === fullText) {
      timer = setTimeout(() => {
        setCompletedLines((prev) => [...prev, fullText]);
        setCurrentText("");
        setCurrentLineIndex((prev) => prev + 1);
      }, 1000);
    } else {
      timer = setTimeout(() => {
        setCurrentText(fullText.slice(0, currentText.length + 1));
      }, 50);
    }
    
    return () => clearTimeout(timer);
  }, [currentText, currentLineIndex]);

  return (
    <div className="font-mono space-y-2.5">
      {completedLines.map((line, idx) => {
        const isHeader = idx === 0;
        const isEmail = idx === 4;
        return (
          <div key={idx} className={isHeader ? "text-lg font-bold text-[#002d72] tracking-wider uppercase" : isEmail ? "text-sm text-[#0066cc] font-semibold" : "text-sm text-zinc-650"}>
            {line}
          </div>
        );
      })}
      
      {currentLineIndex < lines.length && (
        <div className="flex items-center">
          <span className={currentLineIndex === 0 ? "text-lg font-bold text-[#002d72] tracking-wider uppercase" : currentLineIndex === 4 ? "text-sm text-[#0066cc] font-semibold" : "text-sm text-zinc-650"}>
            {currentText}
          </span>
          <span className="w-1.5 h-4 bg-[#0066cc] ml-1 cursor-blink" />
        </div>
      )}
    </div>
  );
}

function TypewriterQuotes() {
  const quotes = [
    {
      title: "Healthcare Strategy & Advisory",
      description: "We help healthcare organizations, hospitals, startups, and institutions develop sustainable growth strategies, operational excellence, and patient-centered solutions."
    },
    {
      title: "Research & Evidence-Based Innovation",
      description: "We conduct healthcare, biomedical, neuroscience, and public health research to transform scientific insights into real-world impact."
    },
    {
      title: "AI & Digital Health Solutions",
      description: "We support the design and implementation of AI-powered healthcare technologies, digital health platforms, and data-driven decision-making systems."
    },
    {
      title: "Healthcare Transformation & Impact",
      description: "We work with healthcare leaders, innovators, and policymakers to improve accessibility, outcomes, and the future of healthcare delivery."
    }
  ];

  const [index, setIndex] = useState(0);
  const [typedTitle, setTypedTitle] = useState("");
  const [typedDesc, setTypedDesc] = useState("");
  const [phase, setPhase] = useState<"typing-title" | "typing-desc" | "resting" | "exiting">("typing-title");

  useEffect(() => {
    const currentQuote = quotes[index];
    let timer: NodeJS.Timeout;

    if (phase === "typing-title") {
      if (typedTitle.length < currentQuote.title.length) {
        timer = setTimeout(() => {
          setTypedTitle(currentQuote.title.slice(0, typedTitle.length + 1));
        }, 38);
      } else {
        timer = setTimeout(() => setPhase("typing-desc"), 220);
      }
    } else if (phase === "typing-desc") {
      if (typedDesc.length < currentQuote.description.length) {
        timer = setTimeout(() => {
          setTypedDesc(currentQuote.description.slice(0, typedDesc.length + 1));
        }, 14);
      } else {
        setPhase("resting");
      }
    } else if (phase === "resting") {
      timer = setTimeout(() => setPhase("exiting"), 4200);
    } else if (phase === "exiting") {
      timer = setTimeout(() => {
        setTypedTitle("");
        setTypedDesc("");
        setIndex((prev) => (prev + 1) % quotes.length);
        setPhase("typing-title");
      }, 480);
    }

    return () => clearTimeout(timer);
  }, [phase, typedTitle, typedDesc, index]);

  return (
    <div style={{ minHeight: '140px' }} className="flex flex-col justify-start">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -6, transition: { duration: 0.38 } }}
          className="space-y-2"
        >
          {/* Category title — navy, uppercase, small tracking */}
          <div
            className="flex items-center"
            style={{ minHeight: '22px', fontFamily: 'Plus Jakarta Sans, system-ui, sans-serif', fontSize: '10.5px', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#002d72' }}
          >
            <span>{typedTitle}</span>
            {(phase === "typing-title") && (
              <span className="inline-block ml-1 cursor-blink" style={{ width: '2px', height: '13px', background: '#002d72', borderRadius: '1px' }} />
            )}
          </div>

          {/* Description body */}
          <div style={{ fontSize: '15px', color: '#374151', lineHeight: 1.75, maxWidth: '390px', minHeight: '110px', fontWeight: 400 }}>
            <span>{typedDesc}</span>
            {phase === "typing-desc" && (
              <span className="inline-block ml-1 cursor-blink" style={{ width: '2px', height: '16px', background: '#374151', borderRadius: '1px', verticalAlign: 'text-bottom' }} />
            )}
          </div>

          {/* Progress dots */}
          <div className="flex items-center gap-2" style={{ paddingTop: '6px' }}>
            {quotes.map((_, i) => (
              <div
                key={i}
                style={{
                  width: i === index ? '20px' : '6px',
                  height: '3px',
                  borderRadius: '2px',
                  background: i === index ? '#002d72' : '#d1d5db',
                  transition: 'all 0.4s ease'
                }}
              />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default function LupensCarePage() {
  const [activeSection, setActiveSection] = useState("overview");
  const [isScrolled, setIsScrolled] = useState(false);

  const { scrollY } = useScroll();
  // Hero background parallax & scale
  const heroBgY = useTransform(scrollY, [0, 800], [0, 240]);
  const heroBgScale = useTransform(scrollY, [0, 800], [1.0, 1.15]);
  
  // Hero text parallax & fade
  const heroTextY = useTransform(scrollY, [0, 500], [0, 120]);
  const heroTextOpacity = useTransform(scrollY, [0, 450], [1, 0]);

  // Smooth scroll with offset to prevent header overlap
  const handleScrollTo = (id: string) => {
    if (id === "overview") {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
      return;
    }
    const target = document.getElementById(id);
    if (target) {
      // Use 58px offset since sticky header will be in shrunken state (58px height) for any sub-section
      const headerOffset = 58;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  // Track scroll position for navbar style & active section
  useEffect(() => {
    const sections = ["overview", "about", "insights", "work", "people", "careers", "contact"];
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // If at the very bottom, force active section to contact to handle short pages / document end
      const isAtBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 50;
      if (isAtBottom) {
        setActiveSection("contact");
        return;
      }

      // Scroll spy logic
      const scrollPosition = window.scrollY + 120; // 120px offset to trigger active state early
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          const top = rect.top + window.scrollY;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Trigger initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: -45 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } 
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="lupens-sans min-h-screen bg-white text-zinc-900 overflow-x-hidden selection:bg-[#0066cc]/20 selection:text-[#002d72]">
      {/* 1. Global Font & Style Injection */}
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400..700;1,400..700&family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap');
        
        .lupens-serif {
          font-family: 'Lora', 'Playfair Display', Georgia, serif;
        }
        .lupens-sans {
          font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
        }
        /* Override global navbar and footer to keep this page completely standalone and branded */
        body > header, body > footer {
          display: none !important;
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .cursor-blink {
          animation: blink 1s step-end infinite;
        }
        /* Consulting style typography overlays */
        h1, .lupens-serif-h1 {
          font-family: 'Lora', 'Playfair Display', Georgia, serif;
          font-weight: 500 !important;
          letter-spacing: -0.02em !important;
          line-height: 1.08 !important;
        }
        h2, h3, h4, .lupens-serif-h {
          font-family: 'Lora', 'Playfair Display', Georgia, serif;
          font-weight: 500 !important;
          letter-spacing: -0.01em !important;
        }
        .category-tag {
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
          font-size: 10px !important;
          font-weight: 700 !important;
          text-transform: uppercase !important;
          letter-spacing: 0.25em !important;
        }
      `}} />

      {/* 2. Premium White Navbar matching Image 2 */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${isScrolled ? 'bg-white/90 backdrop-blur-md border-zinc-200/50 shadow-sm' : 'bg-white border-zinc-200/80'}`}>
        <div className="w-full px-4 lg:px-6">
          <div className={`flex justify-between items-center transition-all duration-300 ${isScrolled ? 'h-[58px]' : 'h-[68px]'}`}>
            {/* Logo */}
            <a href="#" className="flex items-center flex-shrink-0" onClick={(e) => { e.preventDefault(); handleScrollTo('overview'); }}>
              <img 
                src="/lupens/lupens_logo.png" 
                alt="Lupens &amp; Co. Logo" 
                className={`w-auto object-contain transition-all duration-300 ${isScrolled ? 'h-[42px]' : 'h-[54px]'}`} 
                style={{ mixBlendMode: 'multiply' }} 
              />
            </a>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-8 lg:gap-10">
              {[
                { label: "About Us", id: "about" },
                { label: "What We Do", id: "insights" },
                { label: "Careers", id: "careers" },
                { label: "Contact", id: "contact" }
              ].map((link) => {
                const isActive = activeSection === link.id || (link.id === "about" && activeSection === "overview") || (link.id === "insights" && (activeSection === "work" || activeSection === "people"));
                return (
                  <a
                    key={link.id}
                    href={`#${link.id}`}
                    className={`relative text-[14.5px] font-semibold tracking-wide transition-all duration-300 py-1.5 px-0.5
                      ${isActive ? 'text-[#002d72]' : 'text-zinc-650 hover:text-[#002d72]'}
                      after:content-[''] after:absolute after:bottom-[-2px] after:left-0 after:w-full after:h-[2px] after:bg-[#002d72]
                      after:transform after:origin-left after:transition-transform after:duration-300
                      ${isActive ? 'after:scale-x-100' : 'after:scale-x-0 hover:after:scale-x-100'}
                    `}
                    onClick={(e) => {
                      e.preventDefault();
                      handleScrollTo(link.id);
                    }}
                  >
                    {link.label}
                  </a>
                );
              })}
            </nav>

            {/* Right side: Let's Connect CTA (desktop) + Hamburger (mobile only) */}
            <div className="flex items-center gap-3">
              <a
                href="#contact"
                className="hidden md:inline-flex items-center gap-2 bg-[#002d72] text-white text-[13.5px] font-semibold px-5 py-2.5 rounded-[3px] hover:bg-[#001b47] transition-colors duration-200"
                onClick={(e) => {
                  e.preventDefault();
                  handleScrollTo('contact');
                }}
              >
                Let&apos;s Connect <ArrowRight className="h-3.5 w-3.5" />
              </a>
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 text-zinc-700 hover:bg-zinc-100 rounded-lg md:hidden"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-80 bg-white p-6 shadow-2xl flex flex-col z-10"
            >
              <div className="flex justify-between items-center mb-10">
                <span className="lupens-serif text-xl font-bold text-[#002d72]">Lupens India</span>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-lg text-zinc-500 hover:bg-zinc-100"
                  aria-label="Close menu"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="flex flex-col gap-6">
                {[
                  { label: "Overview", id: "overview" },
                  { label: "Our Work", id: "work" },
                  { label: "Our People", id: "people" },
                  { label: "Our Insights", id: "insights" },
                  { label: "Careers", id: "careers" },
                  { label: "Contact Us", id: "contact" }
                ].map((link) => (
                  <a 
                    key={link.id} 
                    href={`#${link.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      setMobileMenuOpen(false);
                      handleScrollTo(link.id);
                    }}
                    className="text-base font-medium text-zinc-800 hover:text-[#0066cc] flex justify-between items-center py-2 border-b border-zinc-100"
                  >
                    {link.label}
                    <ChevronRight className="h-4 w-4 text-zinc-400" />
                  </a>
                ))}
              </div>

              <div className="mt-auto border-t border-zinc-100 pt-6">
                <p className="text-xs text-zinc-400 font-medium">Lupens Consultants India</p>
                <p className="text-xs text-zinc-400 mt-1">Mumbai · Gurugram · Bengaluru</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. Hero Section — Full-bleed photo, sticky backdrop, parallax scroll & staggered animations */}
      <section id="overview" className="sticky top-[68px] z-10 w-full flex items-center overflow-hidden bg-white" style={{ height: 'calc(100vh - 68px)' }}>
        {/* Full-bleed background photo with parallax scroll & subtle zoom-out entrance */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <motion.div style={{ y: heroBgY, scale: heroBgScale }} className="w-full h-full">
            <motion.img
              src="/lupens/team_bright.png"
              alt="Lupens India team in strategic planning session"
              className="w-full h-full object-cover object-center"
              initial={{ scale: 1.07 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.8, ease: 'easeOut' }}
            />
          </motion.div>
        </div>

        {/* White gradient — solid left, fades into photo */}
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background: 'linear-gradient(to right, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 42%, rgba(255,255,255,0.88) 54%, rgba(255,255,255,0.3) 67%, rgba(255,255,255,0) 78%)'
          }}
        />

        {/* Text overlaid on left side with parallax fade */}
        <motion.div 
          className="relative z-20 w-full px-6 md:px-12 lg:pl-20 py-12 md:py-0" 
          style={{ y: heroTextY, opacity: heroTextOpacity }}
        >
          <div className="max-w-[540px]">

            {/* Lupens — large italic serif, slides from top-left */}
            <motion.p
              className="lupens-serif font-bold text-[#002d72] italic"
              style={{ fontSize: 'clamp(82px, 8.5vw, 112px)', lineHeight: 0.88, marginBottom: '16px', letterSpacing: '-0.025em' }}
              initial={{ opacity: 0, x: -24, y: -15 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
            >
              Lupens
            </motion.p>

            {/* Welcome subtitle */}
            <motion.p
              style={{ fontSize: '15.5px', color: '#6b7280', marginBottom: '20px', letterSpacing: '0.005em', fontWeight: 400 }}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            >
              Welcome to Lupens India
            </motion.p>

            {/* Main headline */}
            <motion.h1
              className="lupens-serif font-bold text-[#111827]"
              style={{ fontSize: 'clamp(40px, 4.2vw, 60px)', lineHeight: 1.07, marginBottom: '28px', letterSpacing: '-0.022em' }}
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
            >
              Transforming<br />
              Vision into Impact<span style={{ color: '#002d72' }}>.</span>
            </motion.h1>

            {/* Animated blue divider — expands from 0 */}
            <motion.div
              style={{ height: '3px', background: '#002d72', borderRadius: '2px', marginBottom: '24px' }}
              initial={{ width: 0 }}
              animate={{ width: '46px' }}
              transition={{ duration: 0.55, ease: 'easeOut', delay: 0.44 }}
            />

            {/* Animated typewriter quotes replacing static paragraph */}
            <motion.div
              style={{ marginBottom: '38px' }}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.45 }}
            >
              <TypewriterQuotes />
            </motion.div>

            {/* CTA Button — lifts on hover with shadow */}
            <motion.a
              href="#about"
              onClick={(e) => {
                e.preventDefault();
                handleScrollTo('about');
              }}
              className="inline-flex items-center gap-2.5 bg-[#002d72] text-white font-semibold transition-all duration-200"
              style={{ fontSize: '15px', padding: '13px 28px', borderRadius: '3px', marginBottom: '42px', letterSpacing: '0.01em' }}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.55 }}
              whileHover={{ y: -2, backgroundColor: '#001346', boxShadow: '0 8px 28px rgba(0,45,114,0.38)' }}
              whileTap={{ y: 0 }}
            >
              Discover Our Story <ArrowRight className="h-4 w-4" />
            </motion.a>

            {/* 30+ stat row — fades in last */}
            <motion.div
              className="flex items-center gap-5"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.68 }}
            >
              <div className="flex items-center justify-center rounded-full flex-shrink-0"
                   style={{ width: '46px', height: '46px', border: '1.5px solid #b8c8d8' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#7a8aa8" strokeWidth="1.5" style={{ width: '20px', height: '20px' }}>
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </div>
              <div className="w-px bg-zinc-300" style={{ height: '40px' }} />
              <div>
                <span className="font-bold text-[#111827]" style={{ fontSize: '24px', lineHeight: 1 }}>2026</span>
                <p style={{ fontSize: '12.5px', color: '#6b7280', marginTop: '4px', lineHeight: 1.45, fontWeight: 500 }}>
                  Founded to Transform Healthcare &<br />Consulting Through Innovation.
                </p>
              </div>
            </motion.div>

          </div>
        </motion.div>
      </section>

      {/* Scrollable container that slides up and over the sticky Hero section */}
      <div className="relative z-20 bg-white shadow-[0_-15px_40px_rgba(0,0,0,0.08)]">
        {/* 4. Introduction Section */}
        <section id="about" className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
          >
            <h2 className="lupens-serif text-3xl lg:text-4xl font-bold text-[#002d72] mb-6 leading-tight">
              A partner to India&apos;s growth and transformation
            </h2>
            <div className="w-16 h-1 bg-[#0066cc] mx-auto mb-8" />
            <p className="text-lg lg:text-xl text-zinc-650 leading-relaxed font-light mb-6">
              Since opening our doors in India, Lupens Consultants has worked alongside leading private corporations, public-sector enterprises, and government departments. We combine global perspective with deep local expertise to solve critical problems, build institutional capabilities, and accelerate national progress.
            </p>
            <p className="text-base text-zinc-500 leading-relaxed font-light">
              With offices in Mumbai, Gurugram, and Bengaluru, our teams are dedicated to building future-ready organizations, unlocking digital innovation, and driving green transitions across the subcontinent.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 5. Our Impact Section */}
      <section className="py-20 bg-zinc-50 border-y border-zinc-200/60">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#0066cc]">Proven Track Record</span>
            <h3 className="lupens-serif text-3xl lg:text-4xl font-bold text-[#002d72] mt-2">Lupens by the Numbers</h3>
          </div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center"
          >
            {/* Stat 1 */}
            <div className="bg-white p-8 rounded-lg border border-zinc-150 shadow-[0_2px_8px_rgba(0,0,0,0.015)] hover:border-zinc-300 hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)] hover:-translate-y-1.5 transition-all duration-300 relative group text-center">
              <p className="text-5xl lg:text-6xl font-black text-[#002d72] tracking-tight mb-3 group-hover:text-[#0066cc] transition-colors duration-300">01</p>
              <h4 className="font-bold text-sm uppercase tracking-wider text-zinc-800 mb-2">Research-Led</h4>
              <p className="text-xs text-zinc-500 leading-relaxed font-light">
                Every recommendation is backed by scientific evidence and data.
              </p>
            </div>

            {/* Stat 2 */}
            <div className="bg-white p-8 rounded-lg border border-zinc-150 shadow-[0_2px_8px_rgba(0,0,0,0.015)] hover:border-zinc-300 hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)] hover:-translate-y-1.5 transition-all duration-300 relative group text-center">
              <p className="text-5xl lg:text-6xl font-black text-[#002d72] tracking-tight mb-3 group-hover:text-[#0066cc] transition-colors duration-300">02</p>
              <h4 className="font-bold text-sm uppercase tracking-wider text-zinc-800 mb-2">Interdisciplinary</h4>
              <p className="text-xs text-zinc-500 leading-relaxed font-light">
                Experts across healthcare, psychology, AI, biomedical sciences, and innovation.
              </p>
            </div>

            {/* Stat 3 */}
            <div className="bg-white p-8 rounded-lg border border-zinc-150 shadow-[0_2px_8px_rgba(0,0,0,0.015)] hover:border-zinc-300 hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)] hover:-translate-y-1.5 transition-all duration-300 relative group text-center">
              <p className="text-5xl lg:text-6xl font-black text-[#002d72] tracking-tight mb-3 group-hover:text-[#0066cc] transition-colors duration-300">03</p>
              <h4 className="font-bold text-sm uppercase tracking-wider text-zinc-800 mb-2">Impact-Focused</h4>
              <p className="text-xs text-zinc-500 leading-relaxed font-light">
                Helping organizations improve outcomes, accessibility, and innovation.
              </p>
            </div>

            {/* Stat 4 */}
            <div className="bg-white p-8 rounded-lg border border-zinc-150 shadow-[0_2px_8px_rgba(0,0,0,0.015)] hover:border-zinc-300 hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)] hover:-translate-y-1.5 transition-all duration-300 relative group text-center">
              <p className="text-5xl lg:text-6xl font-black text-[#002d72] tracking-tight mb-3 group-hover:text-[#0066cc] transition-colors duration-300">04</p>
              <h4 className="font-bold text-sm uppercase tracking-wider text-zinc-800 mb-2">Future-Ready</h4>
              <p className="text-xs text-zinc-500 leading-relaxed font-light">
                Building solutions at the intersection of healthcare and technology.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 6. Featured Insights Section */}
      <section id="insights" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="border-b border-zinc-200 pb-6 mb-16 flex justify-between items-end">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#0066cc]">Knowledge & Perspectives</span>
              <h2 className="lupens-serif text-3xl lg:text-5xl font-bold text-[#002d72] mt-1">Featured Insights</h2>
            </div>
            <a href="#" className="hidden sm:flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#0066cc] hover:text-[#002d72] transition-colors">
              See all insights
              <ChevronRight className="h-4 w-4" />
            </a>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
            {/* Card Left: Mumbai Skyline Image */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeIn}
              className="lg:col-span-7 h-[400px] lg:h-[500px] relative rounded-xl overflow-hidden shadow-lg group"
            >
              <img 
                src="/lupens/mumbai_skyline.png" 
                alt="Mumbai skyline" 
                className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#0066cc] bg-white px-3 py-1 rounded-sm mb-4 inline-block">
                  Special Report
                </span>
                <h3 className="lupens-serif text-2xl lg:text-3xl font-bold leading-snug mb-3">
                  India Ahead: Capturing the growth momentum
                </h3>
                <p className="text-xs lg:text-sm text-zinc-300 font-light leading-relaxed max-w-xl">
                  An in-depth study of the structural transitions, digital ecosystems, and shifting consumer classes that will power India&apos;s next trillion-dollar market expansion.
                </p>
              </div>
            </motion.div>

            {/* Card Right: Text details & Editorial Links */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeIn}
              className="lg:col-span-5 flex flex-col justify-center"
            >
              <span className="text-xs font-bold uppercase tracking-widest text-[#0066cc] mb-2">Macroeconomic Outlook</span>
              <h3 className="lupens-serif text-3xl font-bold text-[#002d72] mb-6 leading-tight">
                India&apos;s decade: Navigating global disruption and domestic expansion
              </h3>
              <p className="text-zinc-650 leading-relaxed mb-6 font-light">
                Despite macro headwinds globally, India&apos;s economy shows structural resilience. We examine how local business leaders can transition from defensive optimization to high-value expansion in the post-pandemic landscape.
              </p>
              <div className="space-y-4 mb-8">
                <a href="#" className="group flex items-start gap-3 p-3 bg-zinc-50 hover:bg-[#0066cc]/5 rounded border border-zinc-150 transition-colors duration-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0066cc] mt-2 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-sm text-[#002d72] group-hover:text-[#0066cc] transition-colors font-sans">The Digital India Stack</h4>
                    <p className="text-xs text-zinc-500 mt-0.5 font-light">Capturing value through public digital goods and open ecosystems.</p>
                  </div>
                </a>
                <a href="#" className="group flex items-start gap-3 p-3 bg-zinc-50 hover:bg-[#0066cc]/5 rounded border border-zinc-150 transition-colors duration-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0066cc] mt-2 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-sm text-[#002d72] group-hover:text-[#0066cc] transition-colors font-sans">Decarbonization Pathways</h4>
                    <p className="text-xs text-zinc-500 mt-0.5 font-light">How India can leapfrog into green manufacturing and sustainable energy.</p>
                  </div>
                </a>
              </div>
              <a href="#" className="text-xs font-bold uppercase tracking-widest text-[#0066cc] hover:text-[#002d72] transition-colors inline-flex items-center gap-1.5 group">
                Read the publication
                <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
              </a>
            </motion.div>
          </div>
        </div>

        {/* 50/50 Split Tech Eye Banner (Mockup Styled - Full Screen Width, Zero Borders) */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeIn}
          className="w-full grid grid-cols-1 md:grid-cols-2 bg-[#051524] overflow-hidden"
        >
          {/* Left Text Side */}
          <div className="flex flex-col justify-center px-12 py-20 lg:px-24 lg:py-32 text-white">
            <h3 className="lupens-serif text-4xl lg:text-[3.25rem] font-normal leading-[1.1] mb-6">
              Tech that moves everything
            </h3>
            <p className="text-zinc-300 text-sm lg:text-base font-light leading-relaxed mb-8 max-w-md">
              There&apos;s tech. Then there&apos;s tech that reimagines and rewires organizations - powered by people, built with AI, and proven to create lasting value.
            </p>
            <a 
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                handleScrollTo("contact");
              }}
              className="text-xs font-bold uppercase tracking-widest text-white hover:text-[#66b2ff] transition-colors inline-flex items-center gap-2 group self-start"
            >
              Get started
              <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          {/* Right Image Side (Full Bleed) */}
          <div className="relative min-h-[350px] md:min-h-[450px]">
            <img 
              src="/lupens/tech_eye.png" 
              alt="Digital eye with light beams" 
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </motion.div>
      </section>

      {/* 7. Our View (Roundtable Dialog) */}
      <section id="work" className="py-24 bg-zinc-50 border-t border-zinc-200/60">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#0066cc]">Expert Dialogues</span>
            <h2 className="lupens-serif text-3xl lg:text-4xl font-bold text-[#002d72] mt-2">Our View</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Video Play Container */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeIn}
              className="relative rounded-xl overflow-hidden shadow-lg h-[350px] lg:h-[450px] group cursor-pointer"
              onClick={() => setVideoModalOpen(true)}
            >
              <img 
                src="/lupens/interview_roundtable.png" 
                alt="Roundtable interview" 
                className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/45 transition-colors duration-300 flex items-center justify-center" />
              
              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-white/20 scale-135 animate-ping" />
                  <div className="w-16 h-16 rounded-full bg-white text-[#002d72] shadow-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Play className="h-6 w-6 fill-current ml-1" />
                  </div>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent text-white">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#66b2ff] mb-1.5 inline-block">
                  Video Roundtable
                </span>
                <p className="font-semibold text-lg">What&apos;s ahead for India: A leadership dialogue</p>
              </div>
            </motion.div>

            {/* Right: Text Description */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeIn}
              className="flex flex-col justify-center"
            >
              <span className="text-xs font-bold uppercase tracking-widest text-[#0066cc] mb-2">Roundtable video</span>
              <h3 className="lupens-serif text-3xl font-bold text-[#002d72] mb-6 leading-tight">
                India&apos;s transition to sustainable leadership
              </h3>
              <p className="text-zinc-650 leading-relaxed mb-6 font-light">
                In this video discussion, senior partners from our Mumbai, Gurugram, and Bengaluru offices gather with external industry experts to address the critical agenda items facing corporate India today.
              </p>
              <div className="space-y-6 mb-8 text-sm">
                <div className="border-l-2 border-[#0066cc] pl-4">
                  <h4 className="font-bold text-[#002d72]">Green Growth & Transition</h4>
                  <p className="text-zinc-500 mt-1 font-light">Accelerating the path to carbon neutrality while unlocking new commercial value.</p>
                </div>
                <div className="border-l-2 border-[#0066cc] pl-4">
                  <h4 className="font-bold text-[#002d72]">Global Value Chain Integration</h4>
                  <p className="text-zinc-500 mt-1 font-light">How Indian manufacturers can leverage supply chain shifts to build regional hubs.</p>
                </div>
              </div>
              <button 
                onClick={() => setVideoModalOpen(true)}
                className="text-xs font-bold uppercase tracking-widest text-[#0066cc] hover:text-[#002d72] transition-colors inline-flex items-center gap-1.5 self-start group"
              >
                Watch the discussion
                <ChevronRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 8. In the Community */}
      <section id="people" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left: Community photo */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeIn}
              className="lg:col-span-6 rounded-xl overflow-hidden shadow-lg h-[350px] lg:h-[450px] group relative cursor-pointer"
            >
              <img 
                src="/lupens/community_collaboration.png" 
                alt="Community collaboration" 
                className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-700 ease-out"
              />
            </motion.div>

            {/* Right: Description & chevron link */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeIn}
              className="lg:col-span-6 flex flex-col justify-center"
            >
              <span className="text-xs font-bold uppercase tracking-widest text-[#0066cc] mb-2">Social Responsibility in India</span>
              <h3 className="lupens-serif text-3xl lg:text-4xl font-bold text-[#002d72] mb-6 leading-tight">
                Empowering communities, driving sustainable change
              </h3>
              <p className="text-zinc-650 leading-relaxed mb-6 font-light">
                Our commitment to India goes beyond corporate boardrooms. Through the Lupens Foundation and local partnership models, we actively invest in empowering the ecosystems where we work and live.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 text-sm">
                <div>
                  <h4 className="font-bold text-[#002d72] mb-1 font-sans">Digital Literacy Hubs</h4>
                  <p className="text-zinc-555 font-light">Establishing computer labs and programming resources for over 50 rural schools.</p>
                </div>
                <div>
                  <h4 className="font-bold text-[#002d72] mb-1 font-sans">Empowering Entrepreneurs</h4>
                  <p className="text-zinc-555 font-light">Mentorship programs to support women-led micro-enterprises across tier-2 cities.</p>
                </div>
              </div>
              <a href="#" className="text-xs font-bold uppercase tracking-widest text-[#0066cc] hover:text-[#002d72] transition-colors inline-flex items-center gap-1.5 self-start group">
                Learn about our social impact
                <ChevronRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 9. Careers (Working in India) */}
      <section id="careers" className="relative min-h-[500px] lg:min-h-[550px] flex items-end w-full overflow-hidden bg-zinc-50">
        {/* Background image (Full viewport bleed) */}
        <div className="absolute inset-0">
          <img 
            src="/lupens/careers_working.png" 
            alt="Careers portrait" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/25 to-transparent" />
        </div>

        {/* Floating White Card Overlay aligned with layout grid */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 py-12 md:py-16">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeIn}
            className="bg-white text-zinc-900 rounded-xl p-8 lg:p-10 shadow-2xl max-w-xl border border-zinc-200/60"
          >
            <span className="text-xs font-bold uppercase tracking-widest text-[#0066cc] mb-2 inline-block">Careers</span>
            <h3 className="lupens-serif text-3xl font-bold text-[#002d72] mb-4">Join our team in India</h3>
            <p className="text-zinc-650 text-sm leading-relaxed mb-6 font-light">
              Lupens Consultants is looking for outstanding graduates, technologists, and experienced industry practitioners. We provide an environment of continuous learning, client impact, and collaborative problem-solving.
            </p>
            <div className="flex flex-wrap gap-4">
              <a 
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  handleScrollTo("contact");
                }}
                className="px-5 py-3 bg-[#002d72] hover:bg-[#001e4d] text-white text-xs font-semibold uppercase tracking-wider rounded transition-colors duration-300 inline-flex items-center gap-2"
              >
                Search jobs
              </a>
              <a 
                href="#" 
                className="px-5 py-3 bg-white hover:bg-zinc-50 text-zinc-800 border border-zinc-300 text-xs font-semibold uppercase tracking-wider rounded transition-colors duration-300 inline-flex items-center gap-2"
              >
                Our culture
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 10. Contact Us Section */}
      <section id="contact" className="py-24 bg-white border-t border-zinc-250">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left: Contact Info */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <span className="text-xs font-bold uppercase tracking-widest text-[#0066cc]">Connect with Lupens</span>
              <h2 className="lupens-serif text-3xl lg:text-4xl font-bold text-[#002d72] mt-2 mb-6">Contact our offices</h2>
              <p className="text-zinc-600 font-light mb-8 max-w-md">
                Have an inquiry or interest in working with Lupens Consultants? Reach out to our India headquarters.
              </p>
              
              <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-8 shadow-sm min-h-[220px] flex items-center">
                <TypewriterContact />
              </div>
            </motion.div>

            {/* Right: Contact Form */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className="bg-zinc-50 p-8 rounded-xl border border-zinc-200"
            >
              <h3 className="lupens-serif text-xl font-bold text-[#002d72] mb-6 font-sans">Send us a message</h3>
              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert("Thank you! Your message has been sent."); }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-650 mb-1" htmlFor="name">Full Name</label>
                    <input className="w-full bg-white border border-zinc-300 rounded p-2.5 text-sm focus:outline-none focus:border-[#0066cc]" type="text" id="name" required />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-650 mb-1" htmlFor="email">Email Address</label>
                    <input className="w-full bg-white border border-zinc-300 rounded p-2.5 text-sm focus:outline-none focus:border-[#0066cc]" type="email" id="email" required />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-650 mb-1" htmlFor="subject">Subject</label>
                  <input className="w-full bg-white border border-zinc-300 rounded p-2.5 text-sm focus:outline-none focus:border-[#0066cc]" type="text" id="subject" required />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-650 mb-1" htmlFor="message">Message</label>
                  <textarea className="w-full bg-white border border-zinc-300 rounded p-2.5 text-sm h-32 focus:outline-none focus:border-[#0066cc] resize-none" id="message" required></textarea>
                </div>
                <button className="w-full bg-[#002d72] hover:bg-[#001e4d] text-white text-xs font-bold uppercase tracking-widest py-3 rounded transition-colors" type="submit">
                  Submit message
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 11. Footer — white, exact match to design */}
      <footer className="bg-white border-t border-zinc-200">
        {/* Top 3-column section */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-14 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

            {/* Col 1: Logo + tagline */}
            <div>
              <div className="mb-4">
                <img 
                  src="/lupens/lupens_logo.png" 
                  alt="Lupens &amp; Co. Logo" 
                  className="h-[72px] w-auto object-contain" 
                  style={{ mixBlendMode: 'multiply' }} 
                />
              </div>
              <div style={{ width: '32px', height: '3px', background: '#2563eb', borderRadius: '2px', margin: '14px 0 18px' }} />
              <p style={{ fontSize: '14.5px', color: '#52525b', lineHeight: 1.72 }}>
                Delivering clarity. Driving impact.<br />
                Partnering for sustainable growth<br />
                and lasting value.
              </p>
            </div>

            {/* Col 2: Quick Links */}
            <div className="flex flex-col items-start text-left">
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#111827', marginBottom: '18px' }}>Quick Links</h3>
              <div className="flex flex-col items-start w-full">
                {[
                  { label: 'About Us', id: 'about' },
                  { label: 'Our Services', id: 'work' },
                  { label: 'Insights', id: 'insights' },
                  { label: 'Careers', id: 'careers' },
                  { label: 'Contact Us', id: 'contact' },
                ].map((link, i) => (
                  <a
                    key={i}
                    href={`#${link.id}`}
                    onClick={(e) => { e.preventDefault(); handleScrollTo(link.id); }}
                    className="flex items-center justify-start gap-3 group w-full"
                    style={{ padding: '10px 0', borderBottom: '1px solid #e5e7eb', color: '#374151', fontSize: '14.5px', textDecoration: 'none', justifyContent: 'flex-start' }}
                  >
                    <svg viewBox="0 0 8 13" fill="none" style={{ width: '7px', height: '12px', flexShrink: 0 }}>
                      <path d="M1 1.5l5 5-5 5" stroke="#2563eb" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Col 3: Connect */}
            <div className="flex flex-col items-start text-left">
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#111827', marginBottom: '18px' }}>Connect</h3>
              <div className="flex flex-col items-start gap-0 w-full">
                {/* Email row */}
                <div className="flex items-center justify-start gap-4 w-full" style={{ paddingBottom: '18px', borderBottom: '1px solid #e5e7eb', justifyContent: 'flex-start' }}>
                  <div className="flex items-center justify-center flex-shrink-0" style={{ width: '42px', height: '42px', background: '#eff6ff', borderRadius: '10px' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="1.8" style={{ width: '20px', height: '20px' }}>
                      <rect x="2" y="4" width="20" height="16" rx="2"/>
                      <path d="M2 7l10 7 10-7"/>
                    </svg>
                  </div>
                  <span style={{ fontSize: '14px', color: '#374151' }}>office@healix-technologies.com</span>
                </div>
                {/* Website row */}
                <div className="flex items-center justify-start gap-4 w-full" style={{ paddingTop: '18px', justifyContent: 'flex-start' }}>
                  <div className="flex items-center justify-center flex-shrink-0" style={{ width: '42px', height: '42px', background: '#eff6ff', borderRadius: '10px' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="1.8" style={{ width: '20px', height: '20px' }}>
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                    </svg>
                  </div>
                  <span style={{ fontSize: '14px', color: '#374151' }}>www.healix-technologies.com</span>
                </div>
              </div>
            </div>
          </div>

          {/* Chennai HQ Card */}
          <div className="mt-10 relative overflow-hidden" style={{ border: '1.5px solid #e2e8f0', borderRadius: '14px', padding: '22px 26px', background: '#fff' }}>
            <div className="flex items-start gap-5 relative z-10">
              {/* Location pin icon */}
              <div className="flex items-center justify-center flex-shrink-0" style={{ width: '56px', height: '56px', background: '#eff6ff', borderRadius: '14px' }}>
                <svg viewBox="0 0 24 24" fill="#2563eb" style={{ width: '26px', height: '26px' }}>
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
              </div>
              {/* Address text */}
              <div>
                <p style={{ fontSize: '15.5px', fontWeight: 700, color: '#111827', marginBottom: '6px' }}>Chennai (Headquarters)</p>
                <div style={{ width: '28px', height: '2.5px', background: '#2563eb', borderRadius: '2px', marginBottom: '10px' }} />
                <div className="flex items-center gap-2" style={{ marginBottom: '5px' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.6" style={{ width: '14px', height: '14px', flexShrink: 0 }}>
                    <path d="M3 21h18M3 7v14M21 7v14M6 7V3h12v4M9 21v-4h6v4"/>
                  </svg>
                  <span style={{ fontSize: '13.5px', color: '#374151' }}>IIT Madras, Chennai</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.6" style={{ width: '14px', height: '14px', flexShrink: 0 }}>
                    <rect x="2" y="4" width="20" height="16" rx="2"/>
                    <path d="M2 7l10 7 10-7"/>
                  </svg>
                  <span style={{ fontSize: '13.5px', color: '#374151' }}>office@healix-technologies.com</span>
                </div>
              </div>
            </div>

            {/* Chennai Skyline — actual uploaded illustration */}
            <div className="absolute right-0 bottom-0 hidden md:block pointer-events-none" style={{ opacity: 0.95 }}>
              <img
                src="/lupens/chennai_skyline_illustration.png"
                alt="Chennai skyline illustration"
                style={{ height: '130px', width: 'auto', display: 'block', mixBlendMode: 'multiply' }}
              />
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid #e5e7eb', padding: '14px 0' }}>
          <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-3">
            <p style={{ fontSize: '13px', color: '#6b7280' }}>
              © 2026 Lupens Consultants India. All rights reserved.
            </p>
            <div className="flex items-center gap-2.5">
              {[
                { label: 'LinkedIn', href: 'https://www.linkedin.com/showcase/acuity-company/about/?viewAsMember=true', icon: <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/>, extra: <circle cx="4" cy="4" r="2"/> },
                { label: 'Twitter', href: '#', icon: <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/> },
                { label: 'Facebook', href: '#', icon: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/> },
                { label: 'YouTube', href: '#', icon: <><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white"/></> },
              ].map(({ label, href, icon, extra }) => (
                <a key={label} href={href} target={href !== '#' ? "_blank" : undefined} rel={href !== '#' ? "noopener noreferrer" : undefined} aria-label={label} className="flex items-center justify-center transition-colors hover:border-[#2563eb]" style={{ width: '34px', height: '34px', border: '1.5px solid #d1d5db', borderRadius: '50%', color: '#6b7280' }}>
                  <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '14px', height: '14px' }}>
                    {icon}{extra}
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
      </div>

      {/* 12. Video Modal Popup */}
      <AnimatePresence>
        {videoModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setVideoModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative z-10 w-full max-w-4xl bg-zinc-900 rounded-xl overflow-hidden shadow-2xl border border-zinc-800"
            >
              {/* Close Button */}
              <button 
                onClick={() => setVideoModalOpen(false)}
                className="absolute top-4 right-4 z-20 p-2 bg-black/40 hover:bg-black/60 text-white rounded-full transition-colors"
                aria-label="Close video player"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Video Player Placeholder Area */}
              <div className="relative aspect-video bg-[#020d20] flex flex-col justify-center items-center p-8 text-center text-white">
                {/* Background image of roundtable */}
                <div className="absolute inset-0 opacity-40">
                  <img 
                    src="/lupens/interview_roundtable.png" 
                    alt="Roundtable background" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-[#021029]/95 to-black/85" />
                </div>

                <div className="relative z-10 max-w-xl">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#66b2ff] bg-[#66b2ff]/10 border border-[#66b2ff]/20 px-3.5 py-1 rounded-full inline-block mb-4 font-sans">
                    Roundtable Dialogue
                  </span>
                  <h3 className="lupens-serif text-2xl lg:text-3xl font-bold mb-4">
                    What&apos;s ahead for India: A leadership conversation
                  </h3>
                  <p className="text-zinc-400 text-sm mb-6 leading-relaxed font-light">
                    Featuring Senior Partners from Mumbai, Gurugram, and Bengaluru discussing industrial decarbonization, tech ecosystem scale, and global supply chain integration.
                  </p>
                  
                  {/* Play State */}
                  <div className="w-20 h-20 bg-white/10 rounded-full border border-white/20 flex items-center justify-center mx-auto mb-6">
                    <Play className="h-8 w-8 text-white fill-current ml-1 animate-pulse" />
                  </div>
                  
                  <p className="text-xs text-zinc-500 font-mono">Simulated Player · 12 min 45 sec</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

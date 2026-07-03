"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LogOut, Menu, X, Heart, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import { logout } from "@/app/auth/actions";
import { HealixLogo } from "@/components/ui/HealixLogo";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "BioLabs", href: "/biolabs" },
  { name: "Our Members", href: "/our-members" },
  { name: "Events", href: "/events" },
  { name: "Careers", href: "/careers" },
  { name: "Contact", href: "/contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isHsfOpen, setIsHsfOpen] = useState(false);
  const [navHidden, setNavHidden] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navHideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const supabase = createClient();
  const headerRef = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
      } else {
        const hasMock = document.cookie.split(";").some((c) =>
          c.trim().startsWith("dummy-mock-token=")
        );
        if (hasMock) {
          setUser({ email: "demo@healix.tech", id: "mock-user" });
        }
      }
    };

    getUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
      } else {
        const hasMock = document.cookie.split(";").some((c) =>
          c.trim().startsWith("dummy-mock-token=")
        );
        setUser(hasMock ? { email: "demo@healix.tech", id: "mock-user" } : null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase.auth]);

  // Auto-hide navbar on biolabs & our-members pages
  const isAutohidePage = pathname.startsWith('/biolabs') || pathname.startsWith('/our-members');

  useEffect(() => {
    if (!isAutohidePage) {
      setNavHidden(false);
      return;
    }

    let lastScrollY = 0;

    const handleScroll = () => {
      if (pathname.startsWith('/our-members')) return; // handled by custom-scroll
      const currentScrollY = window.scrollY;
      
      // Filter out micro-scroll bounces (must scroll more than 15px to change state)
      if (Math.abs(currentScrollY - lastScrollY) > 15) {
        if (currentScrollY > lastScrollY && currentScrollY > 80) {
          setNavHidden(true);
        } else if (currentScrollY < lastScrollY) {
          setNavHidden(false);
        }
        lastScrollY = currentScrollY;
      }
    };

    const handleCustomScroll = (e: Event) => {
      const customEvent = e as CustomEvent;
      const currentScrollY = customEvent.detail.scrollTop;
      
      // Filter out micro-scroll bounces (must scroll more than 15px to change state)
      if (Math.abs(currentScrollY - lastScrollY) > 15) {
        if (currentScrollY > lastScrollY && currentScrollY > 80) {
          setNavHidden(true);
        } else if (currentScrollY < lastScrollY) {
          setNavHidden(false);
        }
        lastScrollY = currentScrollY;
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      // Reveal header when cursor is within the top 40px of screen
      if (e.clientY < 40) {
        setNavHidden(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('custom-scroll', handleCustomScroll);
    window.addEventListener('mousemove', handleMouseMove);

    // Hide immediately on mount for members snap viewport
    if (pathname.startsWith('/our-members')) {
      setNavHidden(true);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('custom-scroll', handleCustomScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [pathname, isAutohidePage]);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);



  return (
    <header
      ref={headerRef}
      className="w-full z-50 relative flex flex-col"
      style={{
        transform: isAutohidePage && navHidden ? 'translateY(-100%)' : 'translateY(0)',
        transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        position: isAutohidePage ? 'fixed' : 'relative',
        top: 0,
        left: 0,
        right: 0,
      }}
    >
      {/* 1. TOP UTILITY BAR (Redesigned Split Layout matching 2nd Image) */}
      <motion.div
        initial={{ 
          height: "auto", 
          opacity: 1, 
          clipPath: "inset(0% 0% 0% 0%)",
        }}
        animate={{
          height: isScrolled ? 0 : "auto",
          opacity: isScrolled ? 0 : 1,
          clipPath: isScrolled ? "inset(0% 100% 0% 0%)" : "inset(0% 0% 0% 0%)"
        }}
        transition={{
          duration: 0.4,
          ease: [0.4, 0, 0.2, 1]
        }}
        style={{ overflow: "hidden" }}
        className="hidden lg:flex w-full text-white text-xs font-sans tracking-wide"
      >
        {/* Left deep corporate navy blue block */}
        <div className="w-[70%] bg-[#002D62] py-2.5 px-6 lg:px-8 border-b border-[#001D40] flex items-center justify-center">
          <div className="flex items-center gap-3">
            <span className="font-extrabold uppercase tracking-widest text-[#F56A00]">HEALIX NATIONAL INNOVATION ECOSYSTEM</span>
            <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
            <span className="text-white/90 font-medium">HEALTHCARE · ARTIFICIAL INTELLIGENCE · BIOTECHNOLOGY · CLINICAL RESEARCH · MEDICAL INNOVATION</span>
          </div>
        </div>
        {/* Right rich red block */}
        <div className="w-[30%] bg-[#D10000] py-2.5 px-6 lg:px-8 border-b border-[#A00000] flex items-center justify-center">
          <div className="flex items-center gap-3 sm:gap-4 divide-x divide-white/20 text-xs">
            <a href="https://www.biolabsresearch-healix.com" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-200 transition-colors pl-0 font-medium">Research Portal</a>
            <Link href="/news" className="hover:text-zinc-200 transition-colors pl-3 font-medium">Press Release</Link>
          </div>
        </div>
      </motion.div>

      {/* 2. MAIN HEADER BLOCK (White Background, Black Text and Map Pin) */}
      <motion.div
        initial={{ 
          height: "auto", 
          opacity: 1, 
          clipPath: "inset(0% 0% 0% 0%)",
          paddingTop: "1.25rem",
          paddingBottom: "1.25rem",
          borderBottomWidth: "1px"
        }}
        animate={{
          height: isScrolled ? 0 : "auto",
          paddingTop: isScrolled ? 0 : "1.25rem",
          paddingBottom: isScrolled ? 0 : "1.25rem",
          borderBottomWidth: isScrolled ? 0 : "1px",
          opacity: isScrolled ? 0 : 1,
          clipPath: isScrolled ? "inset(0% 0% 0% 100%)" : "inset(0% 0% 0% 0%)"
        }}
        transition={{
          duration: 0.4,
          ease: [0.4, 0, 0.2, 1]
        }}
        style={{ overflow: "hidden", borderBottomStyle: "solid" }}
        className="bg-white border-zinc-200 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-[94%] mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center group">
            <div className="text-black group-hover:scale-102 transition-transform duration-300">
              <HealixLogo size={120} className="text-black" />
            </div>
          </Link>
        </div>
      </motion.div>

      {/* 3. NAVIGATION STRIP (Solid Black Background, White/Orange Highlights, Non-squished) */}
      <nav className="bg-black text-white px-4 sm:px-6 lg:px-8 border-b border-zinc-950 shadow-md">
        <div className="max-w-[94%] mx-auto flex justify-between items-center h-12">
          {/* Desktop Links */}
          <div className="hidden lg:flex items-center h-full divide-x divide-zinc-900">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "h-full px-5 text-xs font-bold tracking-wider uppercase transition-all flex items-center border-b-2",
                    isActive 
                      ? "border-[#F56A00] text-[#F56A00] bg-zinc-900/50" 
                      : "border-transparent text-zinc-300 hover:text-[#F56A00] hover:bg-zinc-900/30"
                  )}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* User control buttons */}
          <div className="flex items-center gap-3 ml-auto h-full">
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/dashboard"
                  className="h-8 px-4 bg-[#F56A00] hover:bg-[#d45b00] text-white rounded text-xs font-bold uppercase tracking-wider flex items-center justify-center transition-all duration-300 shadow-[0_0_15px_rgba(245,106,0,0.2)] hover:shadow-[0_0_20px_rgba(245,106,0,0.4)]"
                >
                  Dashboard
                </Link>
                <form action={logout} className="flex items-center">
                  <button type="submit" className="p-2 rounded-lg text-zinc-400 hover:text-white transition-colors" title="Log out">
                    <LogOut className="h-4.5 w-4.5" />
                  </button>
                </form>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-white transition-colors px-2.5"
                >
                  Sign In
                </Link>
                <Link
                  href="/contact?ref=partnership"
                  className="h-8 px-5 bg-[#F56A00] hover:bg-[#d45b00] text-white font-extrabold uppercase tracking-widest text-[10px] flex items-center justify-center transition-all duration-300 shadow-[0_0_15px_rgba(245,106,0,0.3)] hover:shadow-[0_0_25px_rgba(245,106,0,0.5)] transform hover:-translate-y-0.5"
                >
                  Partner With Us
                </Link>
              </div>
            )}

            {/* Mobile menu button (Enhanced Tap Target: 44x44px target box) */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden h-11 w-11 flex items-center justify-center rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900/30 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu overlay */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-zinc-900 bg-black overflow-hidden"
            >
              <div className="px-4 py-4 space-y-1">
                {navLinks.map((link) => {
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={cn(
                        "block px-4 py-2.5 text-xs font-bold tracking-wider uppercase transition-colors rounded-lg",
                        pathname === link.href ? "bg-zinc-900 text-[#F56A00]" : "text-zinc-355 hover:bg-zinc-900"
                      )}
                    >
                      {link.name}
                    </Link>
                  );
                })}

                {/* Secondary Portal Services for Mobile */}
                <div className="border-t border-zinc-800 pt-3.5 mt-3.5">
                  <p className="px-4 text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-bold mb-2">Portal Services</p>
                  <a 
                    href="https://www.biolabsresearch-healix.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="block px-4 py-2 text-xs font-bold text-zinc-400 hover:bg-zinc-900 hover:text-white uppercase transition-colors rounded-lg"
                  >
                    Research Portal
                  </a>
                  <Link 
                    href="/news" 
                    className="block px-4 py-2 text-xs font-bold text-zinc-400 hover:bg-zinc-900 hover:text-white uppercase transition-colors rounded-lg"
                  >
                    Press Release
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* HSF Modal Popup (Orange/White/Black Theme) */}
      <AnimatePresence>
        {isHsfOpen && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsHsfOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ type: "spring", bounce: 0.05, duration: 0.3 }}
              className="relative z-10 w-full max-w-md overflow-hidden rounded-xl border border-zinc-200 bg-white p-8 shadow-2xl text-zinc-900"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsHsfOpen(false)}
                className="absolute top-4 right-4 rounded-full p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex flex-col items-center text-center mt-2">
                <div className="relative flex h-14 w-14 items-center justify-center rounded-xl bg-white border border-zinc-200 shadow-sm mb-4 overflow-hidden">
                  <img src="/hsf-official-logo-web.png" alt="HSF Logo" className="w-full h-full object-contain p-1" />
                  <span className="absolute -top-1 -right-1 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400/50 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-[#ea580c] justify-center items-center">
                      <Sparkles className="h-2.5 w-2.5 text-white" />
                    </span>
                  </span>
                </div>
                
                <h3 className="text-2xl font-black tracking-tight text-zinc-950">
                  Healix Sahyog Foundation
                </h3>
                <span className="text-xs text-zinc-400 font-mono tracking-widest uppercase mt-1">ESTD. 2026</span>
                
                <div className="h-px w-20 bg-zinc-200 my-4" />
                
                <p className="text-xs leading-relaxed text-zinc-650 max-w-sm mt-1">
                  Healix Sahyog Foundation is dedicated to making healthcare accessible, equitable, and technology-driven for underserved communities across India. Through our community support programs, medical camps, and free digital health screenings, we strive to build a healthier tomorrow.
                </p>

                <div className="mt-8 flex w-full gap-3">
                  <button
                    onClick={() => setIsHsfOpen(false)}
                    className="w-full py-2 rounded-lg border border-zinc-250 bg-zinc-50 hover:bg-zinc-100 text-zinc-700 font-bold text-xs uppercase tracking-wider transition-all h-9"
                  >
                    Close
                  </button>
                  <Link
                    href="/shesecure"
                    onClick={() => setIsHsfOpen(false)}
                    className="w-full py-2 rounded-lg bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold text-xs uppercase tracking-wider transition-all text-center block h-9"
                  >
                    Enter Portal
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LogOut, Menu, X, Heart, Sparkles, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import { logout } from "@/app/auth/actions";
import { HealixLogo } from "@/components/ui/HealixLogo";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Healix AI", href: "/ai-check" },
  { name: "Avennix Pharma", href: "/care" },
  { name: "BioLabs", href: "/biolabs" },
  { name: "Events", href: "/events" },
  { name: "HSF", href: "#", isPopup: true },
  { name: "Contact", href: "/contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isHsfOpen, setIsHsfOpen] = useState(false);
  const supabase = createClient();

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

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  if (pathname.startsWith("/ai-check")) return null;

  return (
    <header className="w-full z-50 relative flex flex-col">
      {/* 1. TOP UTILITY BAR (Energetic Bright Orange Background, White Text) */}
      <div className="bg-[#ea580c] text-white text-xs sm:text-sm py-2 px-4 sm:px-6 lg:px-8 border-b border-orange-600 font-sans tracking-wide">
        <div className="max-w-[94%] mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline font-bold">HEALIX SERVICES PORTAL</span>
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span className="text-white font-bold">EMERGENCY LINE: +91 9540694581</span>
          </div>
          <div className="flex items-center gap-3 sm:gap-4 divide-x divide-white/20 text-xs">
            <a href="https://www.biolabsresearch-healix.com" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-200 transition-colors pl-0 font-medium">Research Portal</a>
            <Link href="/admin" className="hover:text-zinc-200 transition-colors pl-3 font-medium">Tenders & Administration</Link>
            <Link href="/news" className="hover:text-zinc-200 transition-colors pl-3 font-medium">Press Release</Link>
            <Link href="/academy/mentors" className="hover:text-zinc-200 transition-colors pl-3 font-medium">Mentorship Directory</Link>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER BLOCK (White Background, Black Text and Map Pin) */}
      <div className="bg-white border-b border-zinc-200 py-4 sm:py-5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[94%] mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="text-black group-hover:scale-105 transition-transform duration-300">
              <HealixLogo size={46} className="text-black" />
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-2xl font-black tracking-tight text-zinc-950 uppercase leading-none">
                Healix Technologies Pvt. Ltd.
              </span>
              <span className="text-[10px] sm:text-xs text-zinc-600 font-bold tracking-wide uppercase mt-1.5">
                जैव-चिकित्सीय अनुसंधान एवं अभियांत्रिकी केंद्र
              </span>
            </div>
          </Link>

          {/* Right Location Box */}
          <div className="hidden md:flex items-center text-left">
            <div className="flex items-center gap-2.5">
              <MapPin className="w-5 h-5 text-[#ea580c] shrink-0" />
              <div className="flex flex-col">
                <p className="font-black text-zinc-950 text-[13px] tracking-tight uppercase leading-none">
                  HEALIX RESEARCH HQ
                </p>
                <p className="text-zinc-500 text-[11px] font-semibold mt-1 leading-none">
                  IIT Madras Campus, Chennai - 600036, India
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. NAVIGATION STRIP (Solid Black Background, White/Yellow Text, Non-squished) */}
      <nav className="bg-black text-white px-4 sm:px-6 lg:px-8 border-b border-zinc-900 shadow-md">
        <div className="max-w-[94%] mx-auto flex justify-between items-center h-12">
          {/* Desktop Links */}
          <div className="hidden lg:flex items-center h-full divide-x divide-zinc-800">
            {navLinks.map((link) => {
              if (link.isPopup) {
                return (
                  <button
                    key={link.name}
                    onClick={() => setIsHsfOpen(true)}
                    className="h-full px-5 text-xs font-bold tracking-wider text-zinc-300 hover:text-[#ea580c] hover:bg-zinc-900/50 uppercase transition-colors focus:outline-none"
                  >
                    {link.name}
                  </button>
                );
              }
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "h-full px-5 text-xs font-bold tracking-wider uppercase transition-all flex items-center border-b-2",
                    isActive 
                      ? "border-orange-500 text-orange-400 bg-zinc-900/50" 
                      : "border-transparent text-zinc-300 hover:text-orange-400 hover:bg-zinc-900/30"
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
                  className="h-8 px-4 bg-[#ea580c] hover:bg-[#c2410c] text-white rounded text-xs font-bold uppercase tracking-wider flex items-center justify-center transition-all"
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
                  href="/signup"
                  className="h-8 px-4 bg-[#ea580c] hover:bg-[#c2410c] text-white rounded text-xs font-bold uppercase tracking-wider flex items-center justify-center transition-all"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-lg text-zinc-400 hover:text-white transition-colors"
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
                  if (link.isPopup) {
                    return (
                      <button
                        key={link.name}
                        onClick={() => {
                          setIsOpen(false);
                          setIsHsfOpen(true);
                        }}
                        className="block w-full text-left px-4 py-2.5 text-xs font-bold tracking-wider text-zinc-350 hover:bg-zinc-900 uppercase transition-colors focus:outline-none"
                      >
                        {link.name}
                      </button>
                    );
                  }
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={cn(
                        "block px-4 py-2.5 text-xs font-bold tracking-wider uppercase transition-colors rounded-lg",
                        pathname === link.href ? "bg-zinc-900 text-orange-400" : "text-zinc-350 hover:bg-zinc-900"
                      )}
                    >
                      {link.name}
                    </Link>
                  );
                })}
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
                  <img src="/hsf-official-logo.png" alt="HSF Logo" className="w-full h-full object-contain p-1" />
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

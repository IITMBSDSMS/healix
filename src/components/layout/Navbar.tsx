"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LogOut, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import { logout } from "@/app/auth/actions";
import { HealixLogo } from "@/components/ui/HealixLogo";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Healix AI", href: "/ai-check" },
  { name: "Care", href: "/care" },
  { name: "BioLabs", href: "/biolabs" },
  { name: "SheSecure", href: "/shesecure" },
  { name: "Contact", href: "/contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
      } else {
        // Fallback: check for mock session cookie (dummy-mock-token)
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
        // Re-check mock cookie on auth state changes (e.g. after logout)
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
    // Close mobile menu on route change
    setIsOpen(false);
  }, [pathname]);

  // Full-viewport pages that don't need the global nav
  // MUST be after all hooks to comply with React Rules of Hooks
  if (pathname.startsWith("/ai-check")) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2.5 group">
              <HealixLogo size={36} className="transition-transform duration-300 group-hover:scale-110" />
              <div className="flex flex-col overflow-hidden">
                <span className="text-xs sm:text-base font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70 leading-none tracking-wide truncate max-w-[160px] sm:max-w-none">
                  HEALIX TECHNOLOGIES PVT. LTD.
                </span>
                <div className="flex items-center gap-1.5 mt-1 sm:mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shrink-0" />
                  <span className="text-[8px] font-mono text-green-500/80 uppercase tracking-widest truncate">System Live</span>
                </div>
              </div>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="relative px-3 py-2 text-sm font-medium transition-colors hover:text-white"
                  >
                    <span className={cn("relative z-10", isActive ? "text-white" : "text-white/70")}>
                      {link.name}
                    </span>
                    {isActive && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className="absolute inset-0 bg-white/10 rounded-lg"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {user ? (
              <div className="hidden sm:flex items-center gap-4">
                <Link
                  href="/dashboard"
                  className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 glow-hover transition-all"
                >
                  Dashboard
                </Link>
                <form action={logout}>
                  <button type="submit" className="p-2 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors" title="Log out">
                    <LogOut className="h-5 w-5" />
                  </button>
                </form>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-4">
                <Link
                  href="/login"
                  className="text-sm font-medium text-white/70 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 glow-hover transition-all"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/10 bg-black/90 backdrop-blur-xl overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "block px-4 py-3 rounded-lg text-base font-medium transition-colors",
                    pathname === link.href ? "bg-white/10 text-white" : "text-white/60 hover:bg-white/5 hover:text-white"
                  )}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-white/5 space-y-2">
                {user ? (
                  <>
                    <Link
                      href="/dashboard"
                      className="block px-4 py-3 rounded-lg text-base font-medium bg-primary text-white text-center"
                    >
                      Dashboard
                    </Link>
                    <form action={logout}>
                      <button type="submit" className="w-full text-left px-4 py-3 rounded-lg text-base font-medium text-red-400 hover:bg-red-500/10 transition-colors">
                        Sign Out
                      </button>
                    </form>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="block px-4 py-3 rounded-lg text-base font-medium text-white/60 hover:bg-white/5 text-center"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/signup"
                      className="block px-4 py-3 rounded-lg text-base font-medium bg-primary text-white text-center"
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

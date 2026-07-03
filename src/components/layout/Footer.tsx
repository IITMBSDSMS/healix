"use client";

import React from "react";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { usePathname } from "next/navigation";
import { HealixLogo } from "@/components/ui/HealixLogo";

export function Footer() {
  const pathname = usePathname();

  return (
    <footer className={`relative border-t border-white/5 bg-[#0a0a0a] overflow-hidden ${pathname === "/contact" ? "mt-0" : "mt-8"}`}>
      {/* Subtle top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[1px] bg-gradient-to-r from-transparent via-[#ea580c]/30 to-transparent" />

      <div className="max-w-[94%] mx-auto px-2 sm:px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">

          {/* ── Logo + tagline ── */}
          <div className="col-span-1 lg:col-span-2">
            <Link href="/" className="flex items-center mb-6 group">
              <HealixLogo size={56} className="transition-transform duration-300 group-hover:scale-110" />
            </Link>
            <p className="text-sm text-white/60 mb-6 leading-relaxed max-w-sm">
              Intelligent human-care platform combining AI healthcare, BioLabs research, and SheSecure safety systems.
            </p>
          </div>

          {/* ── OUR GROUP ── */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-[#ea580c] mb-4 pb-2 border-b border-[#ea580c]/40">
              Our Group
            </h3>
            <ul className="space-y-3 text-sm text-white/55">
              <li>
                <Link href="#" className="hover:text-[#ea580c] transition-colors">
                  HLX Space
                </Link>
              </li>
              <li>
                <Link href="/biolabs" className="hover:text-[#ea580c] transition-colors">
                  BIOLABS Research
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-[#ea580c] transition-colors">
                  Belong
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <Link href="/shesecure" className="hover:text-[#ea580c] transition-colors">
                  Healix Sahyog
                </Link>
                <span className="text-[9px] font-black uppercase tracking-wider bg-[#ea580c] text-white px-1.5 py-0.5 rounded-sm">
                  Foundation
                </span>
              </li>
            </ul>
          </div>

          {/* ── COMPANY ── */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-[#ea580c] mb-4 pb-2 border-b border-[#ea580c]/40">
              Company
            </h3>
            <ul className="space-y-3 text-sm text-white/55">
              <li><Link href="/about" className="hover:text-[#ea580c] transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-[#ea580c] transition-colors">Contact Us</Link></li>
              <li><Link href="/privacy" className="hover:text-[#ea580c] transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-[#ea580c] transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* ── GLOBAL PRESENCE ── */}
          <div>
            <h3 className="text-base font-bold text-white mb-4">
              Global Presence
            </h3>
            <ul className="space-y-4 text-sm text-white/55">
              <li className="flex items-start gap-3 group hover:text-white transition-colors">
                <MapPin className="h-4 w-4 shrink-0 text-[#ea580c] mt-0.5 group-hover:scale-110 transition-transform" />
                <span className="leading-relaxed">
                  <span className="font-semibold text-white block">India HQ</span>
                  IIT Madras Campus<br />Chennai, India
                </span>
              </li>
              <li className="flex items-start gap-3 group hover:text-white transition-colors">
                <MapPin className="h-4 w-4 shrink-0 text-[#ea580c] mt-0.5 group-hover:scale-110 transition-transform" />
                <span className="leading-relaxed">
                  <span className="font-semibold text-white block">Africa Branch</span>
                  Regional Office, Nairobi<br />Kenya
                </span>
              </li>
              <li className="flex items-center gap-3 group hover:text-white transition-colors">
                <Phone className="h-4 w-4 shrink-0 text-[#ea580c] group-hover:scale-110 transition-transform" />
                <span>+91 9540694581</span>
              </li>
              <li className="flex items-center gap-3 group hover:text-white transition-colors">
                <Mail className="h-4 w-4 shrink-0 text-[#ea580c] group-hover:scale-110 transition-transform" />
                <span>office@healix-technologies.com</span>
              </li>
            </ul>

            {/* Social icons */}
            <div className="flex gap-4 mt-8">
              <a href="https://www.linkedin.com/company/quick-healix/" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-[#ea580c] transition-colors p-2.5 bg-white/5 rounded-full border border-white/5 hover:border-[#ea580c]/30">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a href="https://x.com/HealixTechqouc" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-[#ea580c] transition-colors p-2.5 bg-white/5 rounded-full border border-white/5 hover:border-[#ea580c]/30">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a href="https://www.instagram.com/healix_technologies/" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-[#ea580c] transition-colors p-2.5 bg-white/5 rounded-full border border-white/5 hover:border-[#ea580c]/30">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051C.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                </svg>
              </a>
            </div>
          </div>

        </div>

        {/* ── Bottom bar ── */}
        <div className="mt-16 pt-8 border-t border-white/5">
          <div className="bg-[#ea580c]/5 p-6 rounded-2xl border border-[#ea580c]/10 mb-8 backdrop-blur-sm">
            <p className="text-xs text-[#ea580c]/70 leading-relaxed text-center font-mono uppercase tracking-wider">
              <strong className="text-[#ea580c]">Medical Disclaimer:</strong> Healix AI provides guidance only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-white/40 text-xs font-mono uppercase tracking-widest">
              &copy; {new Date().getFullYear()} Healix Technologies Pvt Ltd. All rights reserved.
            </p>
            <div className="flex flex-col md:flex-row items-center gap-6 text-xs font-mono uppercase tracking-widest text-white/40">
              <div className="flex gap-6">
                <Link href="/privacy" className="hover:text-[#ea580c] transition-colors">Privacy</Link>
                <Link href="/terms" className="hover:text-[#ea580c] transition-colors">Terms</Link>
              </div>
              <span className="text-[10px] text-white/30 tracking-widest md:border-l md:border-white/10 md:pl-6 uppercase">
                designed by <span className="text-[#ea580c]">Healix Engineering Unit</span>
              </span>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}

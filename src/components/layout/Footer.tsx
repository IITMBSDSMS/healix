"use client";

import React from "react";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { usePathname } from "next/navigation";
import { HealixLogo } from "@/components/ui/HealixLogo";

export function Footer() {
  const pathname = usePathname();
  // Full-viewport pages that don't need the global footer
  if (pathname.startsWith("/ai-check")) return null;
  return (
    <footer className="relative border-t border-white/5 bg-[#0a0a0a] overflow-hidden mt-8">
      {/* Subtle top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[1px] bg-gradient-to-r from-transparent via-[#ea580c]/30 to-transparent" />
      
      <div className="max-w-[94%] mx-auto px-2 sm:px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          <div className="col-span-1 lg:col-span-2">
            <Link href="/" className="flex items-center gap-4 mb-6 group">
              <HealixLogo size={40} className="transition-transform duration-300 group-hover:scale-110" />
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70 uppercase">
                  HEALIX TECHNOLOGIES
                </span>
                <span className="text-[10px] text-white/50 tracking-widest uppercase">PVT. LTD.</span>
              </div>
            </Link>
            <p className="text-sm text-white/60 mb-6 leading-relaxed max-w-sm">
              Intelligent human-care platform combining AI healthcare, BioLabs research, and SheSecure safety systems.
            </p>
            <p className="text-sm text-[#ea580c]/90 font-medium tracking-widest">
              जैव-चिकित्सीय अनुसंधान एवं अभियांत्रिकी केंद्र
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-white/80 mb-6 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#ea580c]" /> Modules
            </h3>
            <ul className="space-y-3 text-sm text-white/50">
              <li><Link href="/ai-check" className="hover:text-[#ea580c] transition-colors">Healix AI</Link></li>
              <li><Link href="/care" className="hover:text-[#ea580c] transition-colors">Avennix Pharma</Link></li>
              <li><Link href="/biolabs" className="hover:text-[#ea580c] transition-colors">Healix BioLabs</Link></li>
              <li><Link href="/shesecure" className="hover:text-[#ea580c] transition-colors">HSF</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-white/80 mb-6 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#ea580c]" /> Company
            </h3>
            <ul className="space-y-3 text-sm text-white/50">
              <li><Link href="/about" className="hover:text-[#ea580c] transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-[#ea580c] transition-colors">Contact Us</Link></li>
              <li><Link href="/privacy" className="hover:text-[#ea580c] transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-[#ea580c] transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-white/80 mb-6 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#ea580c]" /> Contact
            </h3>
            <ul className="space-y-4 text-sm text-white/50">
              <li className="flex items-start gap-3 hover:text-white transition-colors group">
                <MapPin className="h-5 w-5 shrink-0 text-[#ea580c] group-hover:scale-110 transition-transform" /> 
                <span className="leading-relaxed">IIT Madras Campus<br />Chennai, India</span>
              </li>
              <li className="flex items-center gap-3 hover:text-white transition-colors group">
                <Phone className="h-5 w-5 shrink-0 text-[#ea580c] group-hover:scale-110 transition-transform" /> 
                <span>9540694581</span>
              </li>
              <li className="flex items-center gap-3 hover:text-white transition-colors group">
                <Mail className="h-5 w-5 shrink-0 text-[#ea580c] group-hover:scale-110 transition-transform" /> 
                <span>office@healix-technologies.com</span>
              </li>
            </ul>
            
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
            </div>
          </div>
        </div>
        
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

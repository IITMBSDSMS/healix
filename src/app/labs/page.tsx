"use client";

import React, { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { 
  Search, MapPin, ChevronRight, CheckCircle, 
  Clock, Activity, Shield, Percent, Beaker
} from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

const categories = [
  "Adult Women", "Senior Women", "Fitness", "Adult Men", "Senior Men", 
  "X-ray", "Ultrasound", "CT scan", "Habits & Diet", "Stress & Fatigue",
  "Weight Management", "Diabetes & Heart Health", "Vitamin Levels", "Thyroid"
];

const packages = [
  {
    title: "Comprehensive Gold Full Body Checkup with Smart Report",
    tests: 86,
    oldPrice: 4498,
    newPrice: 2249,
    discount: 50,
    tags: ["Best Seller", "Smart Report"]
  },
  {
    title: "Comprehensive Silver Full Body Checkup with Smart Report",
    tests: 80,
    oldPrice: 3798,
    newPrice: 1899,
    discount: 50,
    tags: ["Smart Report"]
  },
  {
    title: "Comprehensive Platinum Full Body Checkup with Smart Report",
    tests: 100,
    oldPrice: 7398,
    newPrice: 3699,
    discount: 50,
    tags: ["Premium", "Smart Report"]
  },
  {
    title: "Senior Citizen Health Checkup with Smart Report",
    tests: 83,
    oldPrice: 3998,
    newPrice: 1999,
    discount: 50,
    tags: ["Age 55+"]
  }
];

const individualTests = [
  {
    title: "CBC (Complete Blood Count)",
    tests: 21,
    reportTime: "7 hrs",
    oldPrice: 350,
    newPrice: 319,
    discount: 9
  },
  {
    title: "Thyroid Profile Total (T3, T4 & TSH)",
    tests: 3,
    reportTime: "7 hrs",
    oldPrice: 550,
    newPrice: 490,
    discount: 11
  },
  {
    title: "Lipid Profile",
    tests: 8,
    reportTime: "7 hrs",
    oldPrice: null,
    newPrice: 399,
    discount: null
  },
  {
    title: "LFT (Liver Function Test)",
    tests: 11,
    reportTime: "7 hrs",
    oldPrice: 710,
    newPrice: 399,
    discount: 44
  },
  {
    title: "HbA1c (Glycosylated Hemoglobin)",
    tests: 1,
    reportTime: "7 hrs",
    oldPrice: 440,
    newPrice: 379,
    discount: 14
  },
  {
    title: "FBS (Fasting Blood Sugar)",
    tests: 1,
    reportTime: "7 hrs",
    oldPrice: 120,
    newPrice: 79,
    discount: 34
  }
];

export default function LabsPage() {
  const [location, setLocation] = useState("San Francisco, CA");

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#eab308]/30 selection:text-white pb-32">
      
      {/* HEADER & SEARCH */}
      <div className="sticky top-0 z-50 bg-[#050505]/90 backdrop-blur-xl border-b border-white/10 pt-20 pb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3 text-[#eab308] hover:text-[#fef08a] cursor-pointer transition-colors w-fit bg-[#eab308]/10 px-4 py-2 rounded-full border border-[#eab308]/20">
              <MapPin className="w-5 h-5" />
              <span className="font-semibold text-sm">Delivering to {location}</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>

          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-white/40 group-focus-within:text-[#eab308] transition-colors" />
            </div>
            <input
              type="text"
              className="w-full bg-[#111] border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-[#eab308] focus:ring-1 focus:ring-[#eab308] transition-all shadow-lg placeholder:text-white/30 text-lg"
              placeholder="Find lab tests, health packages, or centers..."
            />
          </div>

          {/* HORIZONTAL CATEGORY SCROLL */}
          <div className="flex overflow-x-auto gap-3 py-4 mt-2 hide-scrollbar snap-x">
            {categories.map((cat, i) => (
              <button 
                key={i}
                className="whitespace-nowrap px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-sm font-medium hover:bg-[#eab308] hover:text-black hover:border-[#eab308] transition-all snap-start"
              >
                {cat}
              </button>
            ))}
          </div>

        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-16">
        
        {/* COMPREHENSIVE PACKAGES */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Activity className="h-6 w-6 text-[#eab308]" />
              Popular Health Packages
            </h2>
            <button className="text-[#eab308] hover:text-white text-sm font-bold flex items-center transition-colors">
              See All <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg, i) => (
              <GlassCard key={i} className="p-6 border-white/10 hover:border-[#eab308]/30 hover:bg-white/[0.02] transition-all flex flex-col justify-between group">
                <div>
                  <div className="flex gap-2 mb-4">
                    {pkg.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-[#eab308]/20 text-[#eab308] text-[10px] uppercase tracking-widest font-bold rounded-md border border-[#eab308]/30">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="font-bold text-lg mb-4 leading-tight group-hover:text-[#eab308] transition-colors">{pkg.title}</h3>
                  
                  <div className="flex items-center gap-2 text-sm text-white/50 mb-6 bg-white/5 w-fit px-3 py-1.5 rounded-lg border border-white/5">
                    <Beaker className="w-4 h-4 text-[#ca8a04]" />
                    Includes {pkg.tests} tests
                  </div>
                </div>

                <div className="mt-auto border-t border-white/10 pt-4">
                  <div className="flex items-end justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-2xl font-bold text-white">₹{pkg.newPrice}</span>
                        {pkg.oldPrice && <span className="text-sm text-white/40 line-through">₹{pkg.oldPrice}</span>}
                      </div>
                      {pkg.discount && (
                        <div className="flex items-center gap-1 text-green-400 text-xs font-bold">
                          <Percent className="w-3 h-3" /> {pkg.discount}% OFF
                        </div>
                      )}
                    </div>
                  </div>
                  <Button className="w-full font-bold group-hover:bg-white group-hover:text-black transition-colors">
                    BOOK NOW
                  </Button>
                </div>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* INDIVIDUAL TESTS */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Beaker className="h-6 w-6 text-[#ca8a04]" />
              Book Individual Tests
            </h2>
            <button className="text-[#eab308] hover:text-white text-sm font-bold flex items-center transition-colors">
              See All <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          
          <div className="flex overflow-x-auto pb-6 -mx-4 px-4 sm:mx-0 sm:px-0 gap-6 snap-x hide-scrollbar">
            {individualTests.map((test, i) => (
              <GlassCard key={i} className="min-w-[280px] max-w-[320px] flex-shrink-0 snap-start p-6 border-white/10 hover:border-[#eab308]/30 hover:bg-white/[0.02] transition-all flex flex-col justify-between group">
                <div>
                  <h3 className="font-bold text-base mb-4 leading-tight min-h-[3rem] group-hover:text-[#eab308] transition-colors">{test.title}</h3>
                  
                  <div className="flex flex-col gap-2 mb-6">
                    <div className="flex items-center gap-2 text-xs text-white/50">
                      <Beaker className="w-3.5 h-3.5" /> Contains {test.tests} test{test.tests > 1 ? 's' : ''}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#eab308]">
                      <Clock className="w-3.5 h-3.5" /> Report in {test.reportTime}
                    </div>
                  </div>
                </div>

                <div className="mt-auto border-t border-white/10 pt-4">
                  <div className="flex items-end justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl font-bold text-white">₹{test.newPrice}</span>
                        {test.oldPrice && <span className="text-xs text-white/40 line-through">₹{test.oldPrice}</span>}
                      </div>
                      {test.discount && (
                        <div className="text-green-400 text-xs font-bold">
                          {test.discount}% OFF
                        </div>
                      )}
                    </div>
                    <button className="px-5 py-2 bg-[#eab308]/10 text-[#eab308] hover:bg-[#eab308] hover:text-black font-bold text-sm rounded-xl transition-colors border border-[#eab308]/20 group-hover:border-[#eab308]">
                      ADD
                    </button>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* TRUST BANNER */}
        <section>
          <div className="bg-[#111] rounded-3xl border border-white/5 p-8 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-green-500/10 flex items-center justify-center border border-green-500/20">
                <Shield className="w-8 h-8 text-green-500" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1">100% Safe & Secure</h3>
                <p className="text-white/50 text-sm">All labs are highly certified and follow strict NABL guidelines.</p>
              </div>
            </div>
            
            <div className="hidden md:block w-px h-16 bg-white/10" />

            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-[#eab308]/10 flex items-center justify-center border border-[#eab308]/20">
                <CheckCircle className="w-8 h-8 text-[#eab308]" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1">Free Home Collection</h3>
                <p className="text-white/50 text-sm">Certified phlebotomists collect samples from your home.</p>
              </div>
            </div>
          </div>
        </section>

        {/* APP DOWNLOAD CTA */}
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#111] to-[#0a0a0a]">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,#eab308_0%,transparent_50%)] opacity-10 pointer-events-none" />
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-0">
            
            {/* LEFT: Text + Buttons */}
            <div className="p-10 md:p-14 flex flex-col justify-center">
              <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
                Download the <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#eab308] to-[#fef08a]">Healix</span> app.<br />
                Trusted healthcare,<br />at your fingertips.
              </h2>
              <p className="text-white/50 mb-8 text-base leading-relaxed">
                Book tests, track reports, and get AI-powered health insights from anywhere.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                {/* App Store */}
                <a href="#" className="flex items-center gap-3 px-5 py-3 bg-black border border-white/20 rounded-xl hover:border-[#eab308]/50 transition-colors group w-fit">
                  <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white group-hover:fill-[#eab308] transition-colors flex-shrink-0">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  <div>
                    <p className="text-[10px] text-white/50 leading-none mb-0.5">Download on the</p>
                    <p className="text-sm font-bold text-white leading-none">App Store</p>
                  </div>
                </a>

                {/* Play Store */}
                <a href="#" className="flex items-center gap-3 px-5 py-3 bg-black border border-white/20 rounded-xl hover:border-[#eab308]/50 transition-colors group w-fit">
                  <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white group-hover:fill-[#eab308] transition-colors flex-shrink-0">
                    <path d="M3 20.5v-17c0-.83.94-1.3 1.6-.8l14 8.5c.6.37.6 1.23 0 1.6l-14 8.5c-.66.5-1.6.03-1.6-.8z"/>
                  </svg>
                  <div>
                    <p className="text-[10px] text-white/50 leading-none mb-0.5">GET IT ON</p>
                    <p className="text-sm font-bold text-white leading-none">Google Play</p>
                  </div>
                </a>
              </div>

              {/* QR Code placeholder */}
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-white rounded-xl flex items-center justify-center p-1.5 flex-shrink-0">
                  <svg viewBox="0 0 21 21" className="w-full h-full">
                    <rect x="0" y="0" width="9" height="9" fill="#000"/>
                    <rect x="1" y="1" width="7" height="7" fill="#fff"/>
                    <rect x="2" y="2" width="5" height="5" fill="#000"/>
                    <rect x="12" y="0" width="9" height="9" fill="#000"/>
                    <rect x="13" y="1" width="7" height="7" fill="#fff"/>
                    <rect x="14" y="2" width="5" height="5" fill="#000"/>
                    <rect x="0" y="12" width="9" height="9" fill="#000"/>
                    <rect x="1" y="13" width="7" height="7" fill="#fff"/>
                    <rect x="2" y="14" width="5" height="5" fill="#000"/>
                    <rect x="12" y="12" width="2" height="2" fill="#000"/>
                    <rect x="15" y="12" width="2" height="2" fill="#000"/>
                    <rect x="18" y="12" width="2" height="2" fill="#000"/>
                    <rect x="12" y="15" width="2" height="2" fill="#000"/>
                    <rect x="15" y="15" width="4" height="4" fill="#000"/>
                    <rect x="18" y="18" width="2" height="2" fill="#000"/>
                    <rect x="9" y="0" width="2" height="2" fill="#000"/>
                    <rect x="9" y="3" width="2" height="5" fill="#000"/>
                    <rect x="9" y="9" width="12" height="2" fill="#000"/>
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-white/30">or</p>
                  <p className="text-xs text-white/50">Scan to download</p>
                </div>
              </div>
            </div>

            {/* RIGHT: Phone Mockup */}
            <div className="relative hidden md:flex items-end justify-center pt-8 px-8 overflow-hidden">
              {/* Glow behind phone */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#eab308] blur-[80px] opacity-10 rounded-full" />

              {/* Phone frame */}
              <div className="relative w-56 bg-[#0a0a0a] border-2 border-white/20 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-black/60 z-10 pb-0">
                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-[#0a0a0a] z-20 rounded-b-xl" />

                {/* Phone Screen Content */}
                <div className="bg-[#111] pt-8 pb-0">
                  {/* Status bar */}
                  <div className="flex justify-between items-center px-5 pb-3">
                    <p className="text-[10px] font-bold text-white/70 flex items-center gap-1">
                      <MapPin className="w-2.5 h-2.5 text-[#eab308]" /> Mumbai
                    </p>
                    <div className="flex gap-1">
                      <div className="w-3 h-1.5 bg-white/40 rounded-sm" />
                      <div className="w-3 h-1.5 bg-[#eab308] rounded-sm" />
                    </div>
                  </div>

                  {/* Search pill */}
                  <div className="mx-4 bg-[#222] rounded-xl px-3 py-2 flex items-center gap-2 mb-4 border border-white/5">
                    <Search className="w-3 h-3 text-white/30" />
                    <span className="text-[9px] text-white/30">Search tests, packages...</span>
                  </div>

                  {/* Quick action tiles */}
                  <div className="grid grid-cols-3 gap-2 px-4 mb-4">
                    {[
                      { label: "Book Test", icon: "🧪" },
                      { label: "Upload Rx", icon: "📋" },
                      { label: "Reports", icon: "📊" },
                    ].map((item, i) => (
                      <div key={i} className="bg-[#1a1a1a] rounded-xl p-2 text-center border border-white/5">
                        <div className="text-lg mb-1">{item.icon}</div>
                        <p className="text-[8px] text-white/60 font-medium">{item.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Report banner */}
                  <div className="mx-4 mb-4 rounded-xl bg-gradient-to-r from-[#eab308]/30 to-[#ca8a04]/20 border border-[#eab308]/20 p-3 flex items-center justify-between">
                    <div>
                      <p className="text-[9px] font-bold text-[#eab308] uppercase tracking-widest">Get lab reports</p>
                      <p className="text-xs font-black text-white">In 6 Hours</p>
                    </div>
                    <Activity className="w-6 h-6 text-[#eab308] opacity-60" />
                  </div>

                  {/* Test cards */}
                  {["CBC — ₹319", "Thyroid — ₹490"].map((t, i) => (
                    <div key={i} className="mx-4 mb-2 p-2.5 bg-[#1a1a1a] rounded-xl flex items-center justify-between border border-white/5">
                      <p className="text-[9px] font-semibold text-white/80">{t}</p>
                      <span className="text-[8px] px-2 py-0.5 bg-[#eab308]/20 text-[#eab308] rounded-md font-bold">ADD</span>
                    </div>
                  ))}
                  <div className="h-8" />
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}

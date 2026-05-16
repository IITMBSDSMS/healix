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

      </div>
    </div>
  );
}

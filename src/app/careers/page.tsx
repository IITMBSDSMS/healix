"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Users, Lightbulb, Heart, ArrowRight } from "lucide-react";

export default function CareersPage() {
  // Fade-in animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: custom * 0.15,
        ease: [0.25, 0.1, 0.25, 1.0],
      },
    }),
  };

  return (
    <main className="bg-white min-h-screen relative overflow-hidden font-sans text-zinc-900 pb-24">
      {/* Premium Background Accent Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 left-0 w-96 h-96 bg-[#ea580c]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Main Grid Wrapper */}
      <div className="max-w-[94%] mx-auto px-4 md:px-6 lg:px-8 pt-12 md:pt-16 lg:pt-20">
        
        {/* ROW 1: Heading Text (left) + Engineering Image (middle) + Quote 1 (right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-start">
          
          {/* Col 1-4: Left Text Block */}
          <motion.div 
            custom={0}
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="lg:col-span-4 flex flex-col justify-start pr-0 lg:pr-8"
          >
            {/* Life at Healix Label */}
            <div className="flex items-center gap-3 mb-6">
              <span className="h-[2px] w-8 bg-[#D10000]" />
              <span className="text-[#D10000] font-extrabold text-[11px] tracking-[0.25em] uppercase font-mono">
                Life at Healix
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-[#ea580c] leading-[1.05] tracking-tight mb-8">
              Meet the <br />
              People <br />
              Engineering <br />
              the Future
            </h1>

            {/* Subtext */}
            <div className="text-zinc-600 text-sm md:text-base leading-relaxed space-y-5 max-w-md mb-8">
              <p>
                At Healix, brilliant minds come together to solve the world's most complex healthcare challenges.
              </p>
              <p>
                We combine deep expertise with human-centered design to build technology that truly makes a difference.
              </p>
            </div>

            {/* Call to Action Link */}
            <div>
              <a 
                href="https://docs.google.com/forms/d/e/1FAIpQLSdJOTwtyF0b8yoYxH4cMQ_Fmm4HXsp2lRUE9ZCos2xAj9b_uQ/viewform?usp=publish-editor" 
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 text-[#ea580c] hover:text-[#c2410c] font-bold text-xs uppercase tracking-widest transition-all duration-300 transform hover:translate-x-1"
              >
                <span>Explore opportunities</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </div>
          </motion.div>

          {/* Col 5-9: Engineering Team Image */}
          <motion.div 
            custom={1}
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="lg:col-span-5 relative w-full aspect-[4/3] md:aspect-[16/10] lg:aspect-auto lg:h-[460px] rounded-3xl overflow-hidden shadow-lg border border-zinc-100"
          >
            <Image
              src="/careers/careers_engineering_future.png"
              alt="Healix Engineering Team"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 42vw"
              className="object-cover"
            />
          </motion.div>

          {/* Col 10-12: Quote Card 1 - Innovating with Purpose */}
          <motion.div 
            custom={2}
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="lg:col-span-3 bg-white border border-zinc-200 border-r-4 border-r-[#ea580c] shadow-lg shadow-zinc-200/50 rounded-2xl p-6 md:p-8 flex flex-col justify-between h-full lg:min-h-[380px] lg:-ml-6 lg:mt-10 relative z-10"
          >
            <div>
              {/* Quote Mark */}
              <span className="text-[#ea580c] text-6xl font-serif leading-none select-none block -mt-2 -mb-2">
                “
              </span>
              <h3 className="text-xl font-bold text-zinc-950 mt-1 mb-4 leading-tight">
                Innovating with Purpose
              </h3>
              <p className="text-zinc-650 text-xs md:text-sm leading-relaxed">
                We're here to build solutions that improve lives—today and for generations to come.
              </p>
            </div>
            {/* Bottom accent line */}
            <div className="w-12 h-0.5 bg-[#ea580c] mt-6" />
          </motion.div>

        </div>

        {/* ROW 2: Quote 2 (middle-left) + Collaboration Image (right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 mt-8 lg:-mt-8 items-start">
          
          {/* Spacer corresponding to Row 1 Left Text */}
          <div className="hidden lg:block lg:col-span-4" />

          {/* Col 5-7: Quote Card 2 - A Culture of Collaboration */}
          <motion.div 
            custom={3}
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="lg:col-span-3 bg-white border border-zinc-200 border-l-4 border-l-[#ea580c] shadow-lg shadow-zinc-200/50 rounded-2xl p-6 md:p-8 flex flex-col justify-between h-full lg:min-h-[360px] lg:-mr-6 lg:mt-6 relative z-10"
          >
            <div>
              <span className="text-[#ea580c] text-6xl font-serif leading-none select-none block -mt-2 -mb-2">
                “
              </span>
              <h3 className="text-xl font-bold text-zinc-950 mt-1 mb-4 leading-tight">
                A Culture of Collaboration
              </h3>
              <p className="text-zinc-650 text-xs md:text-sm leading-relaxed">
                The best ideas come from diverse perspectives and open minds.
              </p>
            </div>
            <div className="w-12 h-0.5 bg-[#ea580c] mt-6" />
          </motion.div>

          {/* Col 8-12: Collaboration Team Image */}
          <motion.div 
            custom={4}
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="lg:col-span-5 relative w-full aspect-[4/3] md:aspect-[16/10] lg:aspect-auto lg:h-[400px] rounded-3xl overflow-hidden shadow-lg border border-zinc-100"
          >
            <Image
              src="/careers/careers_collaboration.png"
              alt="Collaboration at Healix"
              fill
              sizes="(max-width: 1024px) 100vw, 42vw"
              className="object-cover"
            />
          </motion.div>

        </div>

        {/* ROW 3: Values Card (left) + Lab Image (middle) + Quote 3 (middle-right) + Cafe Image (right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 mt-12 lg:mt-16 items-stretch">
          
          {/* Col 1-4: Values Card (Orange Card with Rounded Top-Right) */}
          <motion.div 
            custom={5}
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="lg:col-span-4 bg-[#ea580c] text-white p-8 md:p-10 rounded-tr-[3.5rem] rounded-bl-3xl rounded-tl-3xl rounded-br-3xl flex flex-col justify-between shadow-xl"
          >
            <div className="space-y-8">
              
              {/* Value 1: People First */}
              <div className="flex gap-4">
                <div className="p-2.5 bg-white/10 rounded-xl h-fit border border-white/10 shadow-sm mt-0.5 animate-pulse">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-base tracking-wide mb-1">People First</h4>
                  <p className="text-orange-100 text-xs md:text-sm leading-relaxed">
                    We support each other to do the best work of our lives.
                  </p>
                </div>
              </div>

              {/* Value 2: Bold Thinking */}
              <div className="flex gap-4">
                <div className="p-2.5 bg-white/10 rounded-xl h-fit border border-white/10 shadow-sm mt-0.5 animate-pulse">
                  <Lightbulb className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-base tracking-wide mb-1">Bold Thinking</h4>
                  <p className="text-orange-100 text-xs md:text-sm leading-relaxed">
                    We challenge the status quo to create meaningful impact.
                  </p>
                </div>
              </div>

              {/* Value 3: Built on Values */}
              <div className="flex gap-4">
                <div className="p-2.5 bg-white/10 rounded-xl h-fit border border-white/10 shadow-sm mt-0.5 animate-pulse">
                  <Heart className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-base tracking-wide mb-1">Built on Values</h4>
                  <p className="text-orange-100 text-xs md:text-sm leading-relaxed">
                    Integrity, empathy, and excellence guide everything we do.
                  </p>
                </div>
              </div>

            </div>
          </motion.div>

          {/* Col 5-7: Lab Researcher Image */}
          <motion.div 
            custom={6}
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="lg:col-span-3 relative w-full aspect-[4/3] md:aspect-auto lg:h-auto rounded-3xl overflow-hidden shadow-lg border border-zinc-100"
          >
            <Image
              src="/careers/careers_lab_researcher.png"
              alt="Medical Research at Healix"
              fill
              sizes="(max-width: 1024px) 100vw, 25vw"
              className="object-cover"
            />
          </motion.div>

          {/* Col 8-10: Quote Card 3 - Empowered to Make an Impact */}
          <motion.div 
            custom={7}
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="lg:col-span-3 bg-white border border-zinc-200 border-l-4 border-l-[#ea580c] shadow-lg shadow-zinc-200/50 rounded-2xl p-6 md:p-8 flex flex-col justify-between h-full lg:-ml-6 lg:-mr-6 lg:mt-10 lg:mb-4 relative z-10"
          >
            <div>
              <span className="text-[#ea580c] text-6xl font-serif leading-none select-none block -mt-2 -mb-2">
                “
              </span>
              <h3 className="text-xl font-bold text-zinc-950 mt-1 mb-4 leading-tight">
                Empowered to Make an Impact
              </h3>
              <p className="text-zinc-650 text-xs md:text-sm leading-relaxed">
                We give you the autonomy, resources, and trust to bring your ideas to life.
              </p>
            </div>
            <div className="w-12 h-0.5 bg-[#ea580c] mt-6" />
          </motion.div>

          {/* Col 11-12: Cafe/Office Colleague Image */}
          <motion.div 
            custom={8}
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="lg:col-span-2 relative w-full aspect-[4/3] md:aspect-auto lg:h-auto rounded-3xl overflow-hidden shadow-lg border border-zinc-100"
          >
            <Image
              src="/careers/careers_empowered_impact.png"
              alt="Life at Healix Office"
              fill
              sizes="(max-width: 1024px) 100vw, 17vw"
              className="object-cover"
            />
          </motion.div>

        </div>

      </div>
    </main>
  );
}

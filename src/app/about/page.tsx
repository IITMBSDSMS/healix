"use client";

import React from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { Users, Target, MapPin, Building2 } from "lucide-react";
import Image from "next/image";

export default function AboutPage() {
  const team = [
    {
      name: "Dr. Sarah Chen",
      role: "Founder & Chief Medical Officer",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=800&auto=format&fit=crop",
      bio: "Former Head of AI Research at Stanford Medical. Passionate about democratizing healthcare access."
    },
    {
      name: "James Volkov",
      role: "Head of Engineering",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop",
      bio: "15+ years in secure distributed systems and machine learning infrastructure."
    },
    {
      name: "Elena Rodriguez",
      role: "Director of SheSecure",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop",
      bio: "Advocate for women's safety and community organizer leading our urban security initiatives."
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16">
      
      {/* Header */}
      <div className="text-center mb-16 relative">
        <div className="absolute inset-x-0 -top-20 -z-10 transform-gpu overflow-hidden blur-3xl" aria-hidden="true">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary to-[#9089fc] opacity-20" />
        </div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center justify-center p-3 bg-white/5 rounded-full mb-6 border border-white/10"
        >
          <Building2 className="h-6 w-6 text-white/70" />
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl font-bold mb-4"
        >
          Healix Technologies Pvt Ltd
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-white/60 max-w-2xl mx-auto"
        >
          Building the foundation for a safer, healthier, and more connected future.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
          <GlassCard className="h-full p-8" glowOnHover={false}>
            <div className="flex items-center gap-3 mb-4">
              <Target className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">Our Mission</h2>
            </div>
            <p className="text-white/70 leading-relaxed text-lg">
              At Healix Technologies, our mission is to harness the power of artificial intelligence and community-driven initiatives to provide accessible health guidance and robust safety systems. We believe technology should empower individuals to make informed decisions about their well-being and security.
            </p>
          </GlassCard>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
          <GlassCard className="h-full p-8" glowOnHover={false}>
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">Location</h2>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-white/90">Headquarters</h3>
                <p className="text-white/60">Ansari Nagar, New Delhi, India</p>
              </div>
              <a
                href="https://maps.google.com/?q=Ansari+Nagar+New+Delhi"
                target="_blank"
                rel="noopener noreferrer"
                className="h-32 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-primary text-sm hover:bg-white/10 transition-colors cursor-pointer"
              >
                📍 View on Google Maps →
              </a>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Team Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center justify-center gap-3 mb-10">
          <Users className="h-6 w-6 text-primary" />
          <h2 className="text-3xl font-bold text-center">Our Leadership</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <GlassCard key={index} className="p-0 overflow-hidden group">
              <div className="relative h-64 w-full">
                <Image 
                  src={member.image} 
                  alt={member.name} 
                  fill 
                  className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent opacity-80" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-bold">{member.name}</h3>
                  <p className="text-primary text-sm font-medium">{member.role}</p>
                </div>
              </div>
              <div className="p-6">
                <p className="text-sm text-white/60 leading-relaxed">{member.bio}</p>
              </div>
            </GlassCard>
          ))}
        </div>
      </motion.div>

    </div>
  );
}

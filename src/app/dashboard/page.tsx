"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { Activity, HeartPulse, ShieldAlert, FileText, ArrowRight, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";
import { DashboardCharts } from "@/components/ui/DashboardCharts";
import { createClient } from "@/utils/supabase/client";
import { isAdmin } from "@/lib/admin";

export default function DashboardPage() {
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const checkAdminStatus = async () => {
      // Check mock token fast path
      const hasMock = document.cookie.split(";").some((c) =>
        c.trim().startsWith("dummy-mock-token=")
      );
      
      if (hasMock) {
        setIsUserAdmin(isAdmin("demo@healix.tech"));
        return;
      }

      // Real auth check
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        setIsUserAdmin(isAdmin(user.email));
      }
    };
    
    checkAdminStatus();
  }, [supabase.auth]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Welcome to Healix</h1>
        <p className="text-white/60">Your central hub for intelligent healthcare and safety.</p>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {/* Quick Action: Check Symptoms */}
        <motion.div variants={item}>
          <Link href="/ai-check" className="block h-full">
            <GlassCard className="h-full flex flex-col justify-between hover:bg-white/5 transition-colors">
              <div>
                <div className="bg-primary/20 p-3 rounded-lg w-fit mb-4">
                  <Activity className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Check Symptoms</h3>
                <p className="text-sm text-white/60 mb-6">Use Healix AI to analyze your symptoms and get instant medical guidance.</p>
              </div>
              <span className="text-primary text-sm font-medium flex items-center gap-1">Start Check <ArrowRight className="h-4 w-4" /></span>
            </GlassCard>
          </Link>
        </motion.div>

        {/* Quick Action: Book Care */}
        <motion.div variants={item}>
          <Link href="/care" className="block h-full">
            <GlassCard className="h-full flex flex-col justify-between hover:bg-white/5 transition-colors">
              <div>
                <div className="bg-green-500/20 p-3 rounded-lg w-fit mb-4">
                  <HeartPulse className="h-6 w-6 text-green-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Book Care</h3>
                <p className="text-sm text-white/60 mb-6">Schedule appointments with healthcare professionals and labs.</p>
              </div>
              <span className="text-green-500 text-sm font-medium flex items-center gap-1">Find Doctors <ArrowRight className="h-4 w-4" /></span>
            </GlassCard>
          </Link>
        </motion.div>

        {/* Quick Action: Emergency SOS */}
        <motion.div variants={item}>
          <Link href="/shesecure" className="block h-full">
            <GlassCard className="h-full flex flex-col justify-between hover:bg-white/5 transition-colors" glowOnHover={false}>
              <div className="absolute inset-0 bg-red-500/5 group-hover:bg-red-500/10 transition-colors" />
              <div className="relative z-10">
                <div className="bg-red-500/20 p-3 rounded-lg w-fit mb-4">
                  <ShieldAlert className="h-6 w-6 text-red-500 animate-pulse" />
                </div>
                <h3 className="text-xl font-semibold text-red-400 mb-2">Emergency SOS</h3>
                <p className="text-sm text-white/60 mb-6">Quickly alert your emergency contacts with your live location.</p>
              </div>
              <span className="relative z-10 text-red-500 text-sm font-medium flex items-center gap-1">Configure Safety <ArrowRight className="h-4 w-4" /></span>
            </GlassCard>
          </Link>
        </motion.div>

        {/* Academy: Student Dashboard */}
        <motion.div variants={item}>
          <Link href="/academy" className="block h-full">
            <GlassCard className="h-full flex flex-col justify-between hover:bg-white/5 transition-colors border-[#eab308]/10 hover:border-[#eab308]/30">
              <div className="relative z-10">
                <div className="bg-[#eab308]/20 p-3 rounded-lg w-fit mb-4 border border-[#eab308]/30">
                  <GraduationCap className="h-6 w-6 text-[#eab308]" />
                </div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold">Healix Academy</h3>
                  <span className="text-[10px] bg-[#eab308]/20 text-[#eab308] px-2 py-1 rounded font-mono">ENROLLED</span>
                </div>
                <p className="text-sm text-white/60 mb-4">AI Systems Engineering cohort. Next session tomorrow at 10 AM.</p>
                <div className="w-full bg-white/10 rounded-full h-1.5 mb-4 overflow-hidden">
                  <div className="bg-[#eab308] h-1.5 rounded-full w-[45%]" />
                </div>
              </div>
              <span className="relative z-10 text-[#eab308] text-sm font-medium flex items-center gap-1">Continue Learning <ArrowRight className="h-4 w-4" /></span>
            </GlassCard>
          </Link>
        </motion.div>

        {/* Admin Action: Manage Hero Banners */}
        {isUserAdmin && (
          <motion.div variants={item}>
            <Link href="/dashboard/hero-manager" className="block h-full">
              <GlassCard className="h-full flex flex-col justify-between hover:bg-white/5 transition-colors border-[#eab308]/10 hover:border-[#eab308]/30">
                <div className="relative z-10">
                  <div className="bg-[#eab308]/20 p-3 rounded-lg w-fit mb-4">
                    <FileText className="h-6 w-6 text-[#eab308]" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Content Manager</h3>
                  <p className="text-sm text-white/60 mb-6">Upload photos and videos directly to the homepage Hero Carousel.</p>
                </div>
                <span className="relative z-10 text-[#eab308] text-sm font-medium flex items-center gap-1">Manage Banners <ArrowRight className="h-4 w-4" /></span>
              </GlassCard>
            </Link>
          </motion.div>
        )}
      </motion.div>

      {/* Analytics Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-12"
      >
        <DashboardCharts />
      </motion.div>

      {/* Recent Activity Section (Mock) */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-12"
      >
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <FileText className="h-6 w-6 text-white/50" />
          Recent Activity
        </h2>
        <GlassCard className="w-full overflow-hidden" glowOnHover={false}>
          <div className="divide-y divide-white/10">
            <div className="py-4 px-2 hover:bg-white/5 transition-colors flex justify-between items-center">
              <div>
                <p className="font-medium">Account created</p>
                <p className="text-sm text-white/50">Welcome to Healix</p>
              </div>
              <span className="text-sm text-white/40">Just now</span>
            </div>
            <div className="py-8 px-2 text-center text-white/50">
              No recent medical activity. Try checking your symptoms or booking an appointment.
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}

"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, BookOpen, MessageSquare, 
  Settings, Users, PlayCircle, Trophy,
  ChevronLeft, GraduationCap
} from "lucide-react";
import { motion } from "framer-motion";

export default function AcademyDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { name: "Overview", icon: LayoutDashboard, href: "/academy/dashboard" },
    { name: "My Courses", icon: BookOpen, href: "/academy/dashboard/courses" },
    { name: "Live Sessions", icon: PlayCircle, href: "/academy/dashboard/live" },
    { name: "Mentor Chat", icon: MessageSquare, href: "/academy/dashboard/chat" },
    { name: "Achievements", icon: Trophy, href: "/academy/dashboard/perks" },
  ];

  return (
    <div className="flex h-screen bg-[#050505] text-white overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 flex flex-col bg-[#080808]">
        <div className="p-8">
          <Link href="/academy" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-[#eab308] flex items-center justify-center text-black shadow-[0_0_15px_rgba(234,179,8,0.3)]">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold tracking-tighter">HEALIX</p>
              <p className="text-[10px] font-mono text-[#eab308] uppercase tracking-widest">Academy</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-2 py-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive 
                    ? "bg-[#eab308]/10 text-[#eab308] border border-[#eab308]/20" 
                    : "text-white/40 hover:text-white hover:bg-white/5"
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? "text-[#eab308]" : "text-white/30"}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 mt-auto">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
            <p className="text-xs font-mono text-white/30 uppercase tracking-widest mb-3">Enrolled In</p>
            <p className="text-sm font-bold mb-1">AI Systems Engineering</p>
            <div className="w-full bg-white/10 rounded-full h-1 mt-3">
              <div className="bg-[#eab308] h-1 rounded-full w-[45%]" />
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-10 bg-[#050505]/50 backdrop-blur-xl z-20">
          <div className="flex items-center gap-4 text-white/40 text-sm">
            <Link href="/academy" className="hover:text-white transition-colors">Academy</Link>
            <span>/</span>
            <span className="text-white">Dashboard</span>
          </div>
          
          <div className="flex items-center gap-6">
            <button className="relative w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors">
              <div className="absolute top-0 right-0 w-2 h-2 bg-[#eab308] rounded-full border-2 border-black" />
              <Users className="w-5 h-5 text-white/60" />
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-white/10">
              <div className="text-right">
                <p className="text-sm font-bold">Elite Student</p>
                <p className="text-[10px] font-mono text-[#eab308] uppercase tracking-widest">Level 12</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#eab308] to-amber-600 border border-[#eab308]/20" />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {children}
        </div>
      </main>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { 
  Users, DollarSign, BookOpen, Search, 
  Filter, MoreVertical, CheckCircle, Clock,
  ArrowUpRight, Download, Plus, Star
} from "lucide-react";
import Image from "next/image";

export default function AcademyAdmin() {
  const [searchTerm, setSearchTerm] = useState("");

  const stats = [
    { label: "Total Students", value: "1,284", icon: Users, color: "text-[#eab308]" },
    { label: "Gross Revenue", value: "₹84.2L", icon: DollarSign, color: "text-emerald-400" },
    { label: "Active Cohorts", value: "12", icon: BookOpen, color: "text-blue-400" },
    { label: "Avg. Completion", value: "92%", icon: Star, color: "text-purple-400" },
  ];

  const enrollments = [
    { id: "1", name: "Rahul Sharma", email: "rahul@iitm.ac.in", course: "AI Systems Engineering", status: "Paid", date: "Oct 12, 2025" },
    { id: "2", name: "Sneha Patel", email: "sneha@google.com", course: "Full Stack Product", status: "Paid", date: "Oct 14, 2025" },
    { id: "3", name: "Amit Kumar", email: "amit@startup.io", course: "Genomic AI Research", status: "Pending", date: "Oct 15, 2025" },
    { id: "4", name: "Priya Singh", email: "priya@stanford.edu", course: "AI Systems Engineering", status: "Paid", date: "Oct 15, 2025" },
    { id: "5", name: "Vikram Shah", email: "v@v.com", course: "Startup Fellowship", status: "Paid", date: "Oct 16, 2025" },
  ];

  return (
    <div className="min-h-screen bg-[#050505] p-8 md:p-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Academy Control Center</h1>
          <p className="text-white/40">Monitor enrollments, revenue, and educational performance.</p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" /> Export CSV
          </Button>
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Course
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, i) => (
          <GlassCard key={i} className="p-8 border-white/5">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl bg-white/5 ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className="text-emerald-400 text-xs font-mono">+12%</span>
            </div>
            <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-3xl font-bold">{stat.value}</p>
          </GlassCard>
        ))}
      </div>

      {/* Enrollments Table */}
      <GlassCard className="border-white/5 overflow-hidden">
        <div className="p-8 border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <h3 className="text-xl font-bold">Recent Enrollments</h3>
          <div className="flex w-full md:w-auto gap-4">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
              <input 
                type="text" 
                placeholder="Search students..." 
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-[#eab308]/50 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" className="px-4">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/[0.02] text-[10px] font-mono text-white/30 uppercase tracking-widest">
                <th className="px-8 py-5 font-medium">Student</th>
                <th className="px-8 py-5 font-medium">Program</th>
                <th className="px-8 py-5 font-medium">Status</th>
                <th className="px-8 py-5 font-medium">Date</th>
                <th className="px-8 py-5 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {enrollments.map((e) => (
                <tr key={e.id} className="group hover:bg-white/[0.01] transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/10" />
                      <div>
                        <p className="text-sm font-bold">{e.name}</p>
                        <p className="text-xs text-white/30">{e.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-sm font-medium">{e.course}</p>
                  </td>
                  <td className="px-8 py-6">
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      e.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-[#eab308]/10 text-[#eab308]'
                    }`}>
                      {e.status === 'Paid' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      {e.status}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-sm text-white/40">
                    {e.date}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="p-2 hover:bg-white/5 rounded-lg transition-colors text-white/20 hover:text-white">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-8 border-t border-white/5 text-center">
          <button className="text-sm font-bold text-[#eab308] hover:underline flex items-center gap-2 mx-auto">
            View All Transactions <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </GlassCard>

    </div>
  );
}

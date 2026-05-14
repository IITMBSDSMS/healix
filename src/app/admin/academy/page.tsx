"use client";

import { motion } from "framer-motion";
import { Users, IndianRupee, BookOpen, Clock, Download, Search, CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";
import { courses } from "@/lib/academy/data";

const dummyApplications = [
  { id: "APP-101", name: "Rajat Sharma", email: "rajat@iitd.ac.in", course: "AI Systems Engineering", status: "pending", date: "2026-05-14" },
  { id: "APP-102", name: "Priya Das", email: "priya.d@gmail.com", course: "Startup Engineering Fellowship", status: "approved", date: "2026-05-13" },
  { id: "APP-103", name: "Anand V.", email: "anand@bits.ac.in", course: "Full Stack Product Engineering", status: "pending", date: "2026-05-12" },
];

export default function AdminAcademyCRM() {
  const [searchTerm, setSearchTerm] = useState("");
  const [applications, setApplications] = useState(dummyApplications);

  const handleApprove = (id: string) => {
    setApplications(applications.map(app => app.id === id ? { ...app, status: "approved" } : app));
  };

  const handleReject = (id: string) => {
    setApplications(applications.map(app => app.id === id ? { ...app, status: "rejected" } : app));
  };

  const filteredApps = applications.filter(app => 
    app.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    app.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-4xl font-bold mb-2">Academy CRM</h1>
            <p className="text-white/50">Manage applications, students, and course metrics.</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-sm font-medium transition-colors">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>

        {/* Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-[#0a0a0f] border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-500/20 rounded-lg"><Users className="w-6 h-6 text-blue-400" /></div>
              <div className="text-white/50 text-sm">Total Students</div>
            </div>
            <div className="text-3xl font-bold">142</div>
          </div>
          <div className="bg-[#0a0a0f] border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-green-500/20 rounded-lg"><IndianRupee className="w-6 h-6 text-green-400" /></div>
              <div className="text-white/50 text-sm">Total Revenue</div>
            </div>
            <div className="text-3xl font-bold">₹11.2L</div>
          </div>
          <div className="bg-[#0a0a0f] border border-[#eab308]/20 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-[#eab308]/5 pointer-events-none" />
            <div className="flex items-center gap-4 mb-4 relative z-10">
              <div className="p-3 bg-[#eab308]/20 rounded-lg border border-[#eab308]/30"><Clock className="w-6 h-6 text-[#eab308]" /></div>
              <div className="text-white/50 text-sm">Pending Reviews</div>
            </div>
            <div className="text-3xl font-bold relative z-10">{applications.filter(a => a.status === 'pending').length}</div>
          </div>
          <div className="bg-[#0a0a0f] border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-purple-500/20 rounded-lg"><BookOpen className="w-6 h-6 text-purple-400" /></div>
              <div className="text-white/50 text-sm">Active Courses</div>
            </div>
            <div className="text-3xl font-bold">{courses.length}</div>
          </div>
        </div>

        {/* Applications Manager */}
        <div className="bg-[#0a0a0f] border border-white/10 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
            <h2 className="text-xl font-bold">Recent Applications</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input 
                type="text" 
                placeholder="Search applicants..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-black border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#eab308]/50 text-white w-64"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-black text-white/50 font-medium">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Applicant</th>
                  <th className="px-6 py-4">Program</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredApps.map((app) => (
                  <tr key={app.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-mono text-white/40">{app.id}</td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">{app.name}</div>
                      <div className="text-xs text-white/50">{app.email}</div>
                    </td>
                    <td className="px-6 py-4">{app.course}</td>
                    <td className="px-6 py-4 text-white/50">{app.date}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                        app.status === 'pending' ? 'bg-[#eab308]/20 text-[#eab308] border border-[#eab308]/30' :
                        app.status === 'approved' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                        'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      {app.status === 'pending' && (
                        <>
                          <button onClick={() => handleApprove(app.id)} className="p-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded transition-colors" title="Approve">
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleReject(app.id)} className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded transition-colors" title="Reject">
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

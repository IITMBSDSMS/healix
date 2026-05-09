"use client";

import React, { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { 
  FileText, Plus, Calendar, Clock, CheckCircle, 
  XCircle, AlertCircle, Cpu, Network, Database
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getUserApplications, submitApplication } from "../actions";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function UserDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"applications" | "new" | "schedules">("applications");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [appsData, setAppsData] = useState<{applications: any[], projects: any[]}>({ applications: [], projects: [] });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{type: 'error' | 'success', text: string} | null>(null);

  const fetchDashboardData = async () => {
    const res = await getUserApplications();
    if (res.error) {
      if (res.error === "Not authenticated") {
        router.push("/login?next=/biolabs/dashboard");
      }
    } else {
      setAppsData({ applications: res.applications || [], projects: res.projects || [] });
    }
    setLoading(false);
  };

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser(session.user);
      }
      fetchDashboardData();
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitLoading(true);
    setSubmitMessage(null);
    
    const formData = new FormData(e.currentTarget);
    const res = await submitApplication(formData);
    
    setSubmitLoading(false);
    if (res.error) {
      setSubmitMessage({ type: 'error', text: res.error });
    } else {
      setSubmitMessage({ type: 'success', text: "Proposal successfully submitted for review!" });
      e.currentTarget.reset();
      fetchDashboardData();
      setTimeout(() => setActiveTab("applications"), 2000);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#050505]">
      <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mb-4" />
      <p className="text-purple-400 font-medium animate-pulse">Authenticating User Portal...</p>
    </div>
  );

  const tabs = [
    { id: "applications", label: "My Applications", icon: FileText },
    { id: "new", label: "New Proposal", icon: Plus },
    { id: "schedules", label: "Facility Schedules", icon: Calendar },
  ] as const;

  return (
    <div className="min-h-screen bg-[#050505] text-white/90 font-sans flex">
      {/* SIDEBAR */}
      <div className="w-72 border-r border-white/5 bg-[#0a0a0a] flex flex-col h-screen sticky top-0">
        <div className="p-6 border-b border-white/5 bg-gradient-to-br from-purple-900/20 to-blue-900/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-1 bg-black rounded-xl border border-white/10 flex items-center justify-center h-10 w-10 overflow-hidden shrink-0">
              <Image src="/biolabs-logo.png" alt="BioLabs Logo" width={32} height={32} className="object-contain" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight tracking-tight text-white">BioLabs Portal</h1>
              <p className="text-[10px] text-white/40 uppercase tracking-widest font-mono">Researcher Space</p>
            </div>
          </div>
          <div className="p-3 bg-black/40 rounded-lg border border-white/5">
            <p className="text-xs text-white/50 mb-1">Logged in as</p>
            <p className="text-sm font-semibold truncate text-white/80">{user?.email}</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-sm transition-all relative overflow-hidden group ${isActive ? 'bg-white/10 text-white border border-white/10' : 'text-white/50 hover:bg-white/5 hover:text-white/80 border border-transparent'}`}
              >
                {isActive && (
                  <motion.div layoutId="activeTabIndicator" className="absolute left-0 top-0 bottom-0 w-0.5 bg-white" />
                )}
                <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-current transition-colors group-hover:text-white'}`} />
                <span className="font-mono text-xs uppercase tracking-wider">{tab.label}</span>
              </button>
            )
          })}
        </nav>
        
        <div className="p-4 border-t border-white/5">
          <button onClick={() => router.push('/biolabs')} className="w-full py-2 bg-white/5 hover:bg-white/10 rounded-sm text-[10px] font-bold text-white/50 uppercase tracking-widest transition-colors">
            ← Main
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 overflow-y-auto h-screen relative p-8">
        <div className="max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            
            {/* MY APPLICATIONS TAB */}
            {activeTab === "applications" && (
              <motion.div key="applications" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold mb-2 font-mono tracking-tight">APPLICATION_PORTAL</h2>
                  <p className="text-white/40 text-sm font-mono tracking-wide">Track the status of your research proposals and incubations.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {appsData.applications.map((app) => {
                    const project = appsData.projects.find(p => p.title === app.idea_title);
                    return (
                      <GlassCard key={app.id} className="border-white/10 p-6 relative overflow-hidden group hover:border-white/20 transition-colors">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <span className="text-[10px] font-mono text-white/40 mb-2 block uppercase tracking-wider">{app.category}</span>
                            <h3 className="font-bold text-lg text-white/90">{app.idea_title}</h3>
                          </div>
                          {app.status === 'pending' && <span className="flex items-center gap-1 px-2 py-1 bg-white/5 text-white/50 border border-white/10 rounded text-[10px] uppercase font-bold"><Clock className="h-3 w-3"/> Pending</span>}
                          {app.status === 'accepted' && <span className="flex items-center gap-1 px-2 py-1 bg-white/10 text-white border border-white/20 rounded text-[10px] uppercase font-bold"><CheckCircle className="h-3 w-3"/> Accepted</span>}
                          {app.status === 'rejected' && <span className="flex items-center gap-1 px-2 py-1 bg-white/5 text-white/40 border border-white/10 rounded text-[10px] uppercase font-bold"><XCircle className="h-3 w-3"/> Rejected</span>}
                        </div>
                        
                        <p className="text-sm text-white/50 mb-6 line-clamp-3">{app.description}</p>
                        
                        {project && (
                          <div className="mt-4 pt-4 border-t border-white/5">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-[10px] text-white/40 uppercase font-mono">Incubation Progress</span>
                              <span className="text-[10px] text-white font-bold">{project.progress}%</span>
                            </div>
                            <div className="w-full bg-white/5 rounded-none h-1 overflow-hidden">
                              <div className="bg-white h-full transition-all duration-1000" style={{ width: `${project.progress}%` }} />
                            </div>
                          </div>
                        )}
                        <p className="text-[10px] text-white/30 mt-4 text-right">Submitted on {new Date(app.created_at).toLocaleDateString()}</p>
                      </GlassCard>
                    )
                  })}
                  
                  {appsData.applications.length === 0 && (
                    <div className="col-span-full py-16 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-none">
                      <FileText className="h-12 w-12 text-white/10 mb-4" />
                      <h3 className="text-lg font-bold text-white/70">No Applications Found</h3>
                      <p className="text-sm text-white/40 mb-6">You haven't submitted any research proposals yet.</p>
                      <button onClick={() => setActiveTab("new")} className="px-6 py-2 bg-white text-black hover:bg-white/90 rounded-none font-bold text-xs uppercase tracking-widest transition-colors">
                        Submit New Proposal
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* NEW PROPOSAL TAB */}
            {activeTab === "new" && (
              <motion.div key="new" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8 max-w-3xl mx-auto">
                <div>
                  <h2 className="text-3xl font-bold mb-2 font-mono">RESEARCH_PROPOSAL_SUBMISSION</h2>
                  <p className="text-white/40 font-mono text-sm">Submit your idea for incubation. All proposals undergo strict review.</p>
                </div>

                <GlassCard className="p-8 border-white/10">
                  {submitMessage && (
                    <div className={`mb-6 p-4 rounded-none flex items-start gap-3 border ${submitMessage.type === 'error' ? 'bg-white/5 border-white/10 text-white' : 'bg-white/5 border-white/10 text-white'}`}>
                      {submitMessage.type === 'error' ? <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" /> : <CheckCircle className="h-5 w-5 shrink-0 mt-0.5" />}
                      <p className="text-xs font-mono">{submitMessage.text}</p>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold text-white/30 tracking-wider">Full Name</label>
                        <input name="name" required placeholder="Dr. Jane Doe" className="w-full bg-[#0a0a0a] border border-white/10 rounded-none px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold text-white/30 tracking-wider">Institutional Email</label>
                        <input name="email" type="email" required placeholder="jane.doe@university.edu" defaultValue={user?.email} className="w-full bg-[#0a0a0a] border border-white/10 rounded-none px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold text-white/30 tracking-wider">Research Domain / Category</label>
                      <select name="category" required className="w-full bg-[#0a0a0a] border border-white/10 rounded-none px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors appearance-none">
                        <option value="">Select Domain...</option>
                        <option value="AI in Healthcare">AI in Healthcare (Diagnostics, Generative Models)</option>
                        <option value="Genomics & Sequencing">Genomics & Sequencing</option>
                        <option value="IoT Safety Systems">IoT Safety Systems</option>
                        <option value="Data Intelligence">Data Intelligence & Interoperability</option>
                        <option value="Other">Other Interdisciplinary</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold text-white/30 tracking-wider">Proposal Title</label>
                      <input name="ideaTitle" required placeholder="e.g., Federated Learning for Oncology Imaging" className="w-full bg-[#0a0a0a] border border-white/10 rounded-none px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors" />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold text-white/30 tracking-wider">Detailed Description & Objectives</label>
                      <textarea name="description" required rows={6} placeholder="Provide an abstract of your proposed research, methodology, and how it leverages BioLabs computing facilities..." className="w-full bg-[#0a0a0a] border border-white/10 rounded-none px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors resize-none" />
                    </div>

                    <div className="pt-4">
                      <button type="submit" disabled={submitLoading} className="w-full py-4 bg-white text-black hover:bg-white/90 rounded-none font-bold uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                        {submitLoading ? "Submitting Application..." : "Submit Proposal"}
                      </button>
                    </div>
                  </form>
                </GlassCard>
              </motion.div>
            )}

            {/* SCHEDULES TAB */}
            {activeTab === "schedules" && (
              <motion.div key="schedules" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold mb-2 font-mono tracking-tight">INFRASTRUCTURE_SCHEDULES</h2>
                  <p className="text-white/40 text-sm font-mono tracking-wide">Real-time availability of BioLabs infrastructure for active incubations.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* HPC Cluster */}
                  <GlassCard className="border-white/5">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/20 rounded-lg"><Database className="h-5 w-5 text-blue-400" /></div>
                        <div>
                          <h3 className="font-bold">HPC Cluster Alpha</h3>
                          <p className="text-xs text-white/50">GPU Training Nodes</p>
                        </div>
                      </div>
                      <span className="px-2 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded text-[10px] uppercase font-bold">100% Load</span>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm p-2 bg-white/5 rounded">
                        <span className="text-white/70">Today, 09:00 - 18:00</span>
                        <span className="font-semibold text-blue-400">Reserved (Proj-AI-01)</span>
                      </div>
                      <div className="flex justify-between text-sm p-2 bg-white/5 rounded">
                        <span className="text-white/70">Tomorrow, 10:00 - 14:00</span>
                        <span className="font-semibold text-blue-400">Reserved (Genome-03)</span>
                      </div>
                      <div className="flex justify-between text-sm p-2 border border-green-500/30 bg-green-500/5 rounded">
                        <span className="text-white/70">Thursday, 08:00 - 20:00</span>
                        <span className="font-semibold text-green-400">Available</span>
                      </div>
                    </div>
                    <button className="w-full mt-6 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-semibold text-white/70 transition-colors">Request Timeslot</button>
                  </GlassCard>

                  {/* IoT Fabrication Lab */}
                  <GlassCard className="border-white/5">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-500/20 rounded-lg"><Network className="h-5 w-5 text-orange-400" /></div>
                        <div>
                          <h3 className="font-bold">IoT Fabrication Lab</h3>
                          <p className="text-xs text-white/50">Hardware & Sensors</p>
                        </div>
                      </div>
                      <span className="px-2 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded text-[10px] uppercase font-bold">Available</span>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm p-2 border border-green-500/30 bg-green-500/5 rounded">
                        <span className="text-white/70">Today, All Day</span>
                        <span className="font-semibold text-green-400">Available</span>
                      </div>
                      <div className="flex justify-between text-sm p-2 border border-green-500/30 bg-green-500/5 rounded">
                        <span className="text-white/70">Tomorrow, All Day</span>
                        <span className="font-semibold text-green-400">Available</span>
                      </div>
                      <div className="flex justify-between text-sm p-2 bg-white/5 rounded">
                        <span className="text-white/70">Thursday, 14:00 - 18:00</span>
                        <span className="font-semibold text-blue-400">Reserved (Maintenance)</span>
                      </div>
                    </div>
                    <button className="w-full mt-6 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-semibold text-white/70 transition-colors">Request Timeslot</button>
                  </GlassCard>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

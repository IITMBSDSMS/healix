"use client";

import React, { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { 
  Shield, TestTube, Car, Trash2, CheckCircle, XCircle, Plus, 
  LayoutDashboard, Activity, Server, Cpu, Database, MapPin, AlertTriangle, Users, Download, Link as LinkIcon, Image as ImageIcon, FileText, Megaphone, Calendar, GraduationCap, PlayCircle
} from "lucide-react";
import { 
  getAdminData, updateApplicationStatus, deleteProject, updateProjectProgress, addVehicle, deleteVehicle,
  addBiolabPhoto, deleteBiolabPhoto, addBiolabEvent, deleteBiolabEvent, 
  addBiolabAnnouncement, deleteBiolabAnnouncement, addBiolabNews, deleteBiolabNews,
  addBiolabProgram, deleteBiolabProgram, addReel, deleteReel,
  addSessionPhoto, deleteSessionPhoto
} from "./actions";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"overview" | "biolabs" | "shesecure" | "system" | "reels">("overview");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Session photo drag-drop state
  const [photoDragOver, setPhotoDragOver] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoCaption, setPhotoCaption] = useState("");
  const [photoAdding, setPhotoAdding] = useState(false);
  const photoFileRef = React.useRef<HTMLInputElement>(null);

  const fetchData = async () => {
    setLoading(true);
    const res = await getAdminData();
    if (res.error) {
      setError(res.error);
      if (res.error === "Unauthorized") {
        router.push("/login");
      }
    } else {
      // Merge local storage photos for mock/demo mode
      if (typeof window !== 'undefined') {
        const localPhotos = JSON.parse(localStorage.getItem('healix_mock_photos') || '[]');
        res.session_photos = [...localPhotos, ...(res.session_photos || [])];
      }
      setData(res);
    }
    setLoading(false);
  };

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(() => {
      fetchData();
    });
  }, []);

  const handleAppStatus = async (id: string, status: 'accepted' | 'rejected') => {
    const res = await updateApplicationStatus(id, status);
    if (res.error) alert(res.error);
    else fetchData();
  };

  const handleProjectProgress = async (id: string, progress: number) => {
    const res = await updateProjectProgress(id, progress);
    if (res.error) alert(res.error);
    else fetchData();
  };

  const handleDeleteProject = async (id: string) => {
    if(confirm("Delete this project?")) {
      const res = await deleteProject(id);
      if (res.error) alert(res.error);
      else fetchData();
    }
  };

  const handleAddVehicle = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const res = await addVehicle(formData);
    if (res.error) {
      alert("Failed to add vehicle: " + res.error);
    } else {
      form.reset();
      fetchData();
    }
  };

  const handleDeleteVehicle = async (id: string) => {
    if(confirm("Delete this vehicle?")) {
      const res = await deleteVehicle(id);
      if (res.error) alert(res.error);
      else fetchData();
    }
  };

  const handleAddContent = async (e: React.FormEvent<HTMLFormElement>, actionFunc: Function) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const res = await actionFunc(formData);
    if (res.error) alert(res.error);
    else { form.reset(); fetchData(); }
  };

  const handleDeleteContent = async (id: string, deleteFunc: Function) => {
    if(confirm("Delete this content?")) {
      // Also remove from local storage if it exists there
      if (typeof window !== 'undefined') {
        const localPhotos = JSON.parse(localStorage.getItem('healix_mock_photos') || '[]');
        const filtered = localPhotos.filter((p: any) => p.id !== id);
        localStorage.setItem('healix_mock_photos', JSON.stringify(filtered));
      }

      const res = await deleteFunc(id);
      if (res.error) alert(res.error);
      else fetchData();
    }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#050505]">
      <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mb-4" />
      <p className="text-purple-400 font-medium animate-pulse">Initializing Admin Core...</p>
    </div>
  );
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500 bg-[#050505]">Critical Error: {error}</div>;
  if (!data) return null;

  const tabs = [
    { id: "overview", label: "Overview", icon: LayoutDashboard, color: "text-blue-400", bg: "bg-blue-500/10" },
    { id: "biolabs", label: "BioLabs", icon: TestTube, color: "text-purple-400", bg: "bg-purple-500/10" },
    { id: "shesecure", label: "SheSecure", icon: Car, color: "text-orange-400", bg: "bg-orange-500/10" },
    { id: "reels", label: "Comm. Reels", icon: PlayCircle, color: "text-pink-400", bg: "bg-pink-500/10" },
    { id: "system", label: "System Health", icon: Server, color: "text-green-400", bg: "bg-green-500/10" }
  ] as const;

  const totalApps = data.applications.length;
  const pendingApps = data.applications.filter((a:any) => a.status === 'pending').length;
  const activeProjects = data.projects.length;
  const fleetSize = data.vehicles.length;
  const activeTrips = data.trips.filter((t:any) => t.status === 'active').length;

  return (
    <div className="min-h-screen bg-[#050505] flex font-sans">
      {/* SIDEBAR */}
      <div className="w-64 border-r border-white/10 bg-[#0a0a0a] flex flex-col h-screen sticky top-0">
        <div className="p-6 border-b border-white/10 flex items-center gap-3">
          <div className="p-1.5 bg-white/5 border border-white/10">
            <Server className="h-5 w-5 text-white/80" />
          </div>
          <div>
            <h1 className="font-mono font-bold text-sm leading-tight tracking-tighter text-white">HEALIX_CONSOLE</h1>
            <p className="text-[9px] text-white/40 uppercase tracking-[0.2em] font-mono">Root Access</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
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
                <Icon className={`h-4 w-4 ${isActive ? tab.color : 'text-current transition-colors group-hover:text-white'}`} />
                <span className="font-mono text-xs uppercase tracking-wider">{tab.label}</span>
              </button>
            )
          })}
        </nav>
        
        <div className="p-6 border-t border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.6)]" />
            <span className="text-xs text-white/50 font-mono">System Online</span>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 overflow-y-auto h-screen relative">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl pointer-events-none" aria-hidden="true">
          <div className={`relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem] transition-colors duration-1000 ${
            activeTab === 'biolabs' ? 'bg-gradient-to-tr from-purple-500 to-blue-500' :
            activeTab === 'shesecure' ? 'bg-gradient-to-tr from-orange-500 to-red-500' :
            activeTab === 'system' ? 'bg-gradient-to-tr from-green-500 to-emerald-500' :
            'bg-gradient-to-tr from-blue-500 to-indigo-500'
          }`} />
        </div>

        <main className="p-8 max-w-6xl mx-auto w-full">
          <AnimatePresence mode="wait">
            
            {/* OVERVIEW TAB */}
            {activeTab === "overview" && (
              <motion.div key="overview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold mb-2">Command Center</h2>
                  <p className="text-white/50">Real-time holistic view of Healix platforms.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <GlassCard className="border-purple-500/20 shadow-[0_0_30px_rgba(168,85,247,0.05)] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <TestTube className="h-24 w-24 text-purple-500" />
                    </div>
                    <p className="text-sm text-purple-400 font-semibold uppercase tracking-wider mb-2">BioLabs Active</p>
                    <p className="text-5xl font-bold text-white mb-2">{activeProjects}</p>
                    <p className="text-xs text-white/50">+{pendingApps} pending applications</p>
                  </GlassCard>

                  <GlassCard className="border-orange-500/20 shadow-[0_0_30px_rgba(249,115,22,0.05)] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Car className="h-24 w-24 text-orange-500" />
                    </div>
                    <p className="text-sm text-orange-400 font-semibold uppercase tracking-wider mb-2">SheSecure Live</p>
                    <p className="text-5xl font-bold text-white mb-2">{activeTrips}</p>
                    <p className="text-xs text-white/50">{fleetSize} total vehicles registered</p>
                  </GlassCard>

                  <GlassCard className="border-green-500/20 shadow-[0_0_30px_rgba(34,197,94,0.05)] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Activity className="h-24 w-24 text-green-500" />
                    </div>
                    <p className="text-sm text-green-400 font-semibold uppercase tracking-wider mb-2">System Load</p>
                    <p className="text-5xl font-bold text-white mb-2">12<span className="text-2xl text-white/50">%</span></p>
                    <p className="text-xs text-green-400/80">Optimal performance</p>
                  </GlassCard>
                </div>

                {/* Animated Global Map / Activity Chart */}
                <GlassCard className="p-0 overflow-hidden h-[400px] relative border-white/5">
                  <div className="absolute inset-0 p-6 z-10 pointer-events-none flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-lg">Global Activity Stream</h3>
                      <p className="text-xs text-white/40">Aggregated pipeline throughput</p>
                    </div>
                  </div>
                  
                  {/* Custom SVG Wave Animation representing activity */}
                  <div className="w-full h-full bg-[#0a0a0a] flex items-end relative overflow-hidden">
                    {/* Grid */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
                    
                    <svg viewBox="0 0 1000 300" preserveAspectRatio="none" className="w-full h-64 opacity-50 absolute bottom-0">
                      <motion.path 
                        d="M0,150 C150,150 200,50 400,100 C600,150 700,200 1000,100 L1000,300 L0,300 Z"
                        fill="url(#gradBlue)"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 2 }}
                      />
                      <motion.path 
                        d="M0,200 C200,200 300,100 500,150 C700,200 800,50 1000,150 L1000,300 L0,300 Z"
                        fill="url(#gradPurple)"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.8 }}
                        transition={{ duration: 2, delay: 0.5 }}
                      />
                      <defs>
                        <linearGradient id="gradBlue" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="rgba(59, 130, 246, 0.4)" />
                          <stop offset="100%" stopColor="rgba(59, 130, 246, 0)" />
                        </linearGradient>
                        <linearGradient id="gradPurple" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="rgba(168, 85, 247, 0.4)" />
                          <stop offset="100%" stopColor="rgba(168, 85, 247, 0)" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                </GlassCard>
              </motion.div>
            )}

            {/* BIOLABS TAB */}
            {activeTab === "biolabs" && (
              <motion.div key="biolabs" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">BioLabs Pipeline</h2>
                    <p className="text-white/50">Manage research applications and active incubations.</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/10 text-center">
                      <p className="text-2xl font-bold">{pendingApps}</p>
                      <p className="text-[10px] uppercase text-white/40 tracking-wider">Queue</p>
                    </div>
                    <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/10 text-center">
                      <p className="text-2xl font-bold text-purple-400">{activeProjects}</p>
                      <p className="text-[10px] uppercase text-white/40 tracking-wider">Active</p>
                    </div>
                  </div>
                </div>

                {/* Applications Queue */}
                <GlassCard className="border-white/5 shadow-xl">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><TestTube className="h-5 w-5 text-purple-400" /> Intake Queue</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="text-white/30 uppercase text-[10px] tracking-wider border-b border-white/5">
                        <tr>
                          <th className="pb-3 font-semibold">Applicant</th>
                          <th className="pb-3 font-semibold">Research Proposal</th>
                          <th className="pb-3 font-semibold">Category</th>
                          <th className="pb-3 font-semibold text-right">Decision</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        <AnimatePresence>
                          {data.applications.filter((a:any) => a.status === 'pending').map((app: any) => (
                            <motion.tr key={app.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, height: 0 }} className="hover:bg-white/[0.02] transition-colors group">
                              <td className="py-4 pr-4">
                                <p className="font-medium">{app.name}</p>
                                <p className="text-xs text-white/40">{app.email}</p>
                              </td>
                              <td className="py-4 pr-4 max-w-xs">
                                <p className="font-medium text-white/90">{app.idea_title}</p>
                                <p className="text-xs text-white/40 truncate mt-0.5">{app.description || "No description provided."}</p>
                              </td>
                              <td className="py-4 pr-4">
                                <span className="px-2 py-1 bg-white/5 border border-white/10 text-white/70 rounded-md text-xs">{app.category}</span>
                              </td>
                              <td className="py-4 text-right">
                                <div className="flex justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                                  <button onClick={() => handleAppStatus(app.id, 'accepted')} className="px-3 py-1.5 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 text-green-400 rounded-lg flex items-center gap-1 text-xs font-medium transition-colors">
                                    <CheckCircle className="h-3 w-3"/> Accept
                                  </button>
                                  <button onClick={() => handleAppStatus(app.id, 'rejected')} className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-lg flex items-center gap-1 text-xs font-medium transition-colors">
                                    <XCircle className="h-3 w-3"/> Reject
                                  </button>
                                </div>
                              </td>
                            </motion.tr>
                          ))}
                        </AnimatePresence>
                        {pendingApps === 0 && (
                          <tr><td colSpan={4} className="py-8 text-center text-white/30 italic">Intake queue is empty.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </GlassCard>

                {/* Active Projects */}
                <GlassCard className="border-white/5 shadow-xl">
                  <h3 className="text-lg font-bold mb-6 flex items-center gap-2"><Cpu className="h-5 w-5 text-blue-400" /> Active Incubations</h3>
                  <div className="space-y-4">
                    {data.projects.map((proj: any) => (
                      <div key={proj.id} className="p-4 bg-[#0a0a0a] border border-white/5 rounded-2xl flex flex-col md:flex-row gap-6 md:items-center relative overflow-hidden group">
                        
                        {/* Background Progress Fill Indicator */}
                        <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 pointer-events-none transition-all duration-500 ease-out" style={{ width: `${proj.progress || 0}%` }} />

                        <div className="flex-1 z-10">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-lg">{proj.title}</h4>
                            <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-md text-[10px] uppercase font-bold tracking-wider">{proj.status}</span>
                          </div>
                          <p className="text-xs text-white/40 mb-3">{proj.category}</p>
                          
                          {/* Progress Slider Custom UI */}
                          <div className="flex items-center gap-4">
                            <span className="text-xs font-mono text-white/50 w-8">{proj.progress || 0}%</span>
                            <div className="flex-1 relative h-2 bg-white/5 rounded-full overflow-hidden">
                              <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full" style={{ width: `${proj.progress || 0}%` }} />
                              <input 
                                type="range" min="0" max="100" value={proj.progress || 0} 
                                onChange={(e) => handleProjectProgress(proj.id, parseInt(e.target.value))}
                                className="absolute inset-0 w-full opacity-0 cursor-pointer"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="z-10 flex md:flex-col justify-end gap-2">
                          <button onClick={() => handleDeleteProject(proj.id)} className="p-2 text-white/30 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors border border-transparent hover:border-red-500/20">
                            <Trash2 className="h-4 w-4"/>
                          </button>
                        </div>
                      </div>
                    ))}
                    {activeProjects === 0 && (
                      <div className="py-8 text-center text-white/30 italic border border-dashed border-white/10 rounded-2xl">No active projects. Accept an application to begin incubation.</div>
                    )}
                  </div>
                </GlassCard>

                {/* --- CONTENT MANAGEMENT --- */}
                <GlassCard className="border-white/5 shadow-xl mt-8">
                  <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-purple-400">
                    <LayoutDashboard className="h-5 w-5" /> Page Content Management
                  </h3>
                  
                  <div className="space-y-12">
                    
                    {/* Photos */}
                    <div>
                      <h4 className="font-semibold flex items-center gap-2 mb-3 text-white/80"><ImageIcon className="h-4 w-4 text-blue-400"/> Hero Photos</h4>
                      <form onSubmit={(e) => handleAddContent(e, addBiolabPhoto)} className="flex gap-2 mb-4">
                        <input name="title" required placeholder="Image Title" className="flex-1 bg-[#0a0a0a] border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500/50" />
                        <input name="image_url" required placeholder="Image URL (/biolabs/hero.png)" className="flex-1 bg-[#0a0a0a] border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500/50" />
                        <button type="submit" className="px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl flex items-center gap-1 transition-colors text-sm font-bold"><Plus className="h-4 w-4"/> Add</button>
                      </form>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[200px] overflow-y-auto custom-scrollbar">
                        {data.photos?.map((p: any) => (
                          <div key={p.id} className="flex justify-between items-center p-3 bg-white/5 border border-white/5 rounded-xl">
                            <div className="flex items-center gap-3">
                              <img src={p.image_url} alt="thumb" className="w-10 h-10 object-cover rounded bg-black" />
                              <span className="text-sm font-medium">{p.title}</span>
                            </div>
                            <button onClick={() => handleDeleteContent(p.id, deleteBiolabPhoto)} className="text-white/30 hover:text-red-400 p-2"><Trash2 className="h-4 w-4"/></button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Events */}
                    <div>
                      <h4 className="font-semibold flex items-center gap-2 mb-3 text-white/80"><Calendar className="h-4 w-4 text-orange-400"/> Events</h4>
                      <form onSubmit={(e) => handleAddContent(e, addBiolabEvent)} className="space-y-3 mb-4">
                        <div className="flex gap-2">
                          <input name="title" required placeholder="Event Title" className="flex-1 bg-[#0a0a0a] border border-white/10 rounded-xl px-3 py-2 text-white text-sm" />
                          <input name="image_url" required placeholder="Image URL" className="flex-1 bg-[#0a0a0a] border border-white/10 rounded-xl px-3 py-2 text-white text-sm" />
                        </div>
                        <textarea name="description" required placeholder="Event Description..." className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-3 py-2 text-white text-sm h-20" />
                        <div className="flex gap-2">
                          <input type="datetime-local" name="start_date" required className="flex-1 bg-[#0a0a0a] border border-white/10 rounded-xl px-3 py-2 text-white/50 text-sm" />
                          <input type="datetime-local" name="end_date" required className="flex-1 bg-[#0a0a0a] border border-white/10 rounded-xl px-3 py-2 text-white/50 text-sm" />
                          <button type="submit" className="px-6 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-sm">Add Event</button>
                        </div>
                      </form>
                      <div className="space-y-2 max-h-[200px] overflow-y-auto custom-scrollbar">
                        {data.events?.map((e: any) => (
                          <div key={e.id} className="flex justify-between items-center p-3 bg-white/5 border border-white/5 rounded-xl">
                            <div>
                              <p className="text-sm font-medium">{e.title}</p>
                              <p className="text-xs text-white/40">{new Date(e.start_date).toLocaleDateString()}</p>
                            </div>
                            <button onClick={() => handleDeleteContent(e.id, deleteBiolabEvent)} className="text-white/30 hover:text-red-400 p-2"><Trash2 className="h-4 w-4"/></button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Announcements */}
                    <div>
                      <h4 className="font-semibold flex items-center gap-2 mb-3 text-white/80"><Megaphone className="h-4 w-4 text-green-400"/> Marquee Announcements</h4>
                      <form onSubmit={(e) => handleAddContent(e, addBiolabAnnouncement)} className="flex gap-2 mb-4">
                        <input name="content" required placeholder="Announcement Text" className="flex-1 bg-[#0a0a0a] border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none" />
                        <button type="submit" className="px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl flex items-center gap-1 transition-colors text-sm font-bold"><Plus className="h-4 w-4"/> Add</button>
                      </form>
                      <div className="space-y-2 max-h-[150px] overflow-y-auto custom-scrollbar">
                        {data.announcements?.map((a: any) => (
                          <div key={a.id} className="flex justify-between items-center p-3 bg-white/5 border border-white/5 rounded-xl">
                            <span className="text-sm text-white/70">{a.content}</span>
                            <button onClick={() => handleDeleteContent(a.id, deleteBiolabAnnouncement)} className="text-white/30 hover:text-red-400 p-2"><Trash2 className="h-4 w-4"/></button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* News */}
                    <div>
                      <h4 className="font-semibold flex items-center gap-2 mb-3 text-white/80"><FileText className="h-4 w-4 text-pink-400"/> What's New</h4>
                      <form onSubmit={(e) => handleAddContent(e, addBiolabNews)} className="flex gap-2 mb-4 items-center">
                        <input name="title" required placeholder="News Title" className="flex-1 bg-[#0a0a0a] border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none" />
                        <input name="link_url" placeholder="Link URL (opt)" className="w-1/4 bg-[#0a0a0a] border border-white/10 rounded-xl px-3 py-2 text-white text-sm" />
                        <input name="file_size" placeholder="File Size (e.g. 1.2 MB)" className="w-1/4 bg-[#0a0a0a] border border-white/10 rounded-xl px-3 py-2 text-white text-sm" />
                        <label className="flex items-center gap-1 text-xs text-white/50"><input type="checkbox" name="is_document" /> Doc</label>
                        <button type="submit" className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-sm"><Plus className="h-4 w-4"/></button>
                      </form>
                      <div className="space-y-2 max-h-[150px] overflow-y-auto custom-scrollbar">
                        {data.news?.map((n: any) => (
                          <div key={n.id} className="flex justify-between items-center p-3 bg-white/5 border border-white/5 rounded-xl">
                            <span className="text-sm text-white/70">{n.title} {n.is_document && `📄 (${n.file_size})`}</span>
                            <button onClick={() => handleDeleteContent(n.id, deleteBiolabNews)} className="text-white/30 hover:text-red-400 p-2"><Trash2 className="h-4 w-4"/></button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Outreach Programs */}
                    <div>
                      <h4 className="font-semibold flex items-center gap-2 mb-3 text-white/80"><GraduationCap className="h-4 w-4 text-blue-400"/> Outreach Programs</h4>
                      <form onSubmit={(e) => handleAddContent(e, addBiolabProgram)} className="space-y-3 mb-4">
                        <input name="title" required placeholder="Program Title (e.g. Winter Training 2026)" className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none" />
                        <div className="flex gap-2">
                          <input name="description" required placeholder="Short description..." className="flex-1 bg-[#0a0a0a] border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none" />
                          <button type="submit" className="px-6 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-sm">Add Program</button>
                        </div>
                      </form>
                      <div className="space-y-2 max-h-[150px] overflow-y-auto custom-scrollbar">
                        {data.programs?.map((p: any) => (
                          <div key={p.id} className="flex justify-between items-center p-3 bg-white/5 border border-white/5 rounded-xl">
                            <div>
                              <p className="text-sm font-medium">{p.title}</p>
                              <p className="text-xs text-white/40">{p.description}</p>
                            </div>
                            <button onClick={() => handleDeleteContent(p.id, deleteBiolabProgram)} className="text-white/30 hover:text-red-400 p-2"><Trash2 className="h-4 w-4"/></button>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                </GlassCard>

              </motion.div>
            )}

            {/* SHESECURE TAB */}
            {activeTab === "shesecure" && (
              <motion.div key="shesecure" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">Fleet Operations</h2>
                    <p className="text-white/50">Manage vehicles and monitor live emergency trips.</p>
                  </div>
                </div>

                {/* Animated Radar / Live Map */}
                <GlassCard className="p-0 overflow-hidden relative h-[350px] border-orange-500/20 shadow-[0_0_40px_rgba(249,115,22,0.1)]">
                  <div className="absolute inset-0 bg-[#0a0a0a] flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
                    
                    {/* Radar Circles */}
                    <div className="absolute w-[200px] h-[200px] rounded-full border border-orange-500/10" />
                    <div className="absolute w-[400px] h-[400px] rounded-full border border-orange-500/10" />
                    <div className="absolute w-[600px] h-[600px] rounded-full border border-orange-500/10" />
                    
                    {/* Radar Sweep */}
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                      className="absolute w-[600px] h-[600px] rounded-full"
                      style={{ background: "conic-gradient(from 0deg, transparent 70%, rgba(249, 115, 22, 0.2) 100%)" }}
                    />

                    {/* Simulated active trip blips */}
                    {data.trips.filter((t:any) => t.status === 'active').map((trip: any, i: number) => {
                      // Randomize position based on index for demo
                      const angle = (i * 137.5) * (Math.PI / 180);
                      const radius = 100 + (i * 30);
                      const top = `calc(50% + ${Math.sin(angle) * radius}px)`;
                      const left = `calc(50% + ${Math.cos(angle) * radius}px)`;

                      return (
                        <div key={trip.id} className="absolute" style={{ top, left }}>
                          <div className="relative">
                            <div className="w-3 h-3 bg-orange-500 rounded-full shadow-[0_0_15px_5px_rgba(249,115,22,0.6)] animate-pulse" />
                            <div className="absolute top-4 -left-10 bg-black/80 backdrop-blur-md border border-white/10 px-2 py-1 rounded-md text-[10px] text-white whitespace-nowrap">
                              {trip.vehicles?.vehicle_number || "Unknown"}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                    
                    {activeTrips === 0 && (
                      <div className="absolute z-10 text-white/30 flex items-center gap-2 font-mono text-sm">
                        <MapPin className="h-4 w-4" /> No Active Signals
                      </div>
                    )}
                  </div>
                  
                  <div className="absolute top-4 left-4 z-10">
                    <div className="px-3 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-full flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${activeTrips > 0 ? 'bg-orange-500 animate-pulse' : 'bg-white/20'}`} />
                      <span className="text-xs font-mono text-white/70">GPS RADAR {activeTrips > 0 ? 'ACTIVE' : 'STANDBY'}</span>
                    </div>
                  </div>
                </GlassCard>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Vehicle Management */}
                  <GlassCard className="border-white/5">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-bold flex items-center gap-2"><Car className="h-5 w-5 text-orange-400" /> Fleet Registry</h3>
                      <span className="px-2 py-1 bg-white/5 rounded-md text-xs text-white/50 font-mono">{fleetSize} total</span>
                    </div>
                    
                    <form onSubmit={handleAddVehicle} className="mb-6 flex gap-2">
                      <div className="flex-1 flex gap-2">
                        <input name="driver_name" required placeholder="Driver Name" className="w-1/3 bg-[#0a0a0a] border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500/50 transition-colors" />
                        <input name="vehicle_number" required placeholder="Plate No." className="w-1/3 bg-[#0a0a0a] border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500/50 transition-colors" />
                        <input name="iot_device_id" placeholder="IoT Device ID (Opt)" className="w-1/3 bg-[#0a0a0a] border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500/50 transition-colors" />
                      </div>
                      <button type="submit" className="px-4 bg-orange-600 hover:bg-orange-700 text-white rounded-xl flex flex-col items-center justify-center gap-1 transition-colors group">
                        <Plus className="h-5 w-5 group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] uppercase font-bold tracking-wider">Add</span>
                      </button>
                    </form>

                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                      {data.vehicles.map((v: any) => (
                        <div key={v.id} className="p-3 bg-white/[0.02] border border-white/5 rounded-xl flex flex-col gap-3 group hover:border-orange-500/20 transition-colors">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-white/5 rounded-lg text-white/40 group-hover:text-orange-400 transition-colors"><Car className="h-4 w-4"/></div>
                              <div>
                                <p className="font-bold text-sm text-white/90">{v.vehicle_number}</p>
                                <p className="text-xs text-white/50">
                                  {v.driver_name} <span className="mx-1">•</span> <span className="font-mono text-orange-400/80">{v.qr_code}</span>
                                  {v.iot_device_id && <><span className="mx-1">•</span><span className="font-mono text-blue-400/80">IoT: {v.iot_device_id}</span></>}
                                </p>
                              </div>
                            </div>
                            <button onClick={() => handleDeleteVehicle(v.id)} className="p-2 text-white/20 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"><Trash2 className="h-4 w-4" /></button>
                          </div>
                          {v.qr_data_url && (
                            <div className="flex items-center gap-4 bg-white/5 p-2 rounded-lg border border-white/5">
                              <img src={v.qr_data_url} alt="QR Code" className="w-12 h-12 rounded-md bg-white p-1" />
                              <div className="flex-1">
                                <p className="text-xs text-white/60">Scan to activate tracking</p>
                                <div className="flex items-center gap-4 mt-2">
                                  <a 
                                    href={v.qr_data_url} 
                                    download={`QR_${v.vehicle_number.replace(/\s+/g, '_')}.png`}
                                    className="text-xs text-orange-400 hover:text-orange-300 flex items-center gap-1 font-medium w-fit bg-orange-500/10 px-2 py-1 rounded-md"
                                  >
                                    <Download className="h-3 w-3" /> Download Sticker
                                  </a>
                                  <button
                                    onClick={() => {
                                      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
                                      navigator.clipboard.writeText(`${siteUrl}/suraksha/start?vid=${v.id}`);
                                      alert("Test link copied to clipboard!");
                                    }}
                                    className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium w-fit bg-blue-500/10 px-2 py-1 rounded-md"
                                  >
                                    <LinkIcon className="h-3 w-3" /> Copy Test Link
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                      {fleetSize === 0 && <div className="text-center py-4 text-xs text-white/30 italic">No vehicles registered.</div>}
                    </div>
                  </GlassCard>

                  {/* Trip Logs */}
                  <GlassCard className="border-white/5">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2"><Activity className="h-5 w-5 text-orange-400" /> Recent Trip Logs</h3>
                    <div className="relative pl-4 border-l border-white/10 space-y-6">
                      {data.trips.slice(0, 5).map((trip: any) => (
                        <div key={trip.id} className="relative">
                          <div className={`absolute -left-[21px] w-2.5 h-2.5 rounded-full border-2 border-[#111] ${trip.status === 'active' ? 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.8)] animate-pulse' : 'bg-white/20'}`} />
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-mono text-xs text-white/70">TRIP-{trip.id.substring(0, 6).toUpperCase()}</span>
                              <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider ${trip.status === 'active' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' : 'bg-white/5 text-white/40 border border-white/10'}`}>
                                {trip.status}
                              </span>
                            </div>
                            <p className="text-sm">{trip.vehicles?.vehicle_number || "Unknown Vehicle"}</p>
                            <p className="text-xs text-white/40 mt-1">{new Date(trip.created_at).toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                      {data.trips.length === 0 && <p className="text-xs text-white/30 italic pl-2">No trips recorded in the system.</p>}
                    </div>
                  </GlassCard>
                </div>

                {/* Session Photos Management */}
                <GlassCard className="border-white/5 mt-8">
                  <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <ImageIcon className="h-5 w-5 text-pink-400" /> Session Photos
                    <span className="text-xs text-white/40 font-normal ml-2">— displayed in the SheSecure photo marquee</span>
                  </h3>

                  {/* Drag-drop upload zone */}
                  <div
                    className={`relative rounded-2xl border-2 border-dashed transition-all duration-200 mb-4 cursor-pointer ${
                      photoDragOver
                        ? "border-pink-500 bg-pink-500/10"
                        : photoPreview
                        ? "border-pink-500/40 bg-[#0a0a0a]"
                        : "border-white/10 bg-[#0a0a0a] hover:border-pink-500/40 hover:bg-pink-500/5"
                    }`}
                    onDragOver={(e) => { e.preventDefault(); setPhotoDragOver(true); }}
                    onDragLeave={() => setPhotoDragOver(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setPhotoDragOver(false);
                      const file = e.dataTransfer.files?.[0];
                      if (file && file.type.startsWith("image/")) {
                        const reader = new FileReader();
                        reader.onload = (ev) => setPhotoPreview(ev.target?.result as string);
                        reader.readAsDataURL(file);
                      }
                    }}
                    onClick={() => photoFileRef.current?.click()}
                  >
                    <input
                      ref={photoFileRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (ev) => setPhotoPreview(ev.target?.result as string);
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    {photoPreview ? (
                      <div className="relative">
                        <img src={photoPreview} alt="Preview" className="w-full max-h-64 object-cover rounded-xl" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-xl" />
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setPhotoPreview(null); }}
                          className="absolute top-3 right-3 p-1.5 bg-black/60 text-white rounded-full hover:bg-red-500 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                        <p className="absolute bottom-3 left-3 text-xs text-white/60">Click to replace</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-10 px-4">
                        <div className={`p-4 rounded-2xl mb-3 transition-colors ${photoDragOver ? "bg-pink-500/20" : "bg-white/5"}`}>
                          <ImageIcon className={`h-8 w-8 transition-colors ${photoDragOver ? "text-pink-400" : "text-white/30"}`} />
                        </div>
                        <p className="text-sm font-semibold text-white/70">{photoDragOver ? "Drop to upload" : "Drag & drop an image here"}</p>
                        <p className="text-xs text-white/30 mt-1">or click to browse · PNG, JPG, WebP</p>
                      </div>
                    )}
                  </div>

                  {/* URL fallback + caption + submit */}
                  <div className="flex gap-2">
                    <input
                      value={photoCaption}
                      onChange={(e) => setPhotoCaption(e.target.value)}
                      placeholder="Caption (e.g. Digital Safety Training)"
                      className="flex-1 bg-[#0a0a0a] border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-pink-500/50"
                    />
                    {!photoPreview && (
                      <input
                        id="photo-url-fallback"
                        placeholder="Or paste image URL"
                        className="flex-1 bg-[#0a0a0a] border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-pink-500/50"
                      />
                    )}
                    <button
                      disabled={photoAdding || (!photoPreview && !(document?.getElementById("photo-url-fallback") as HTMLInputElement)?.value)}
                      onClick={async () => {
                        const urlInput = document?.getElementById("photo-url-fallback") as HTMLInputElement;
                        const imageUrl = photoPreview || urlInput?.value?.trim();
                        if (!imageUrl || !photoCaption.trim()) {
                          alert("Please add an image and a caption.");
                          return;
                        }
                        setPhotoAdding(true);

                        // In mock mode, we save to local storage for persistence
                        if (typeof window !== 'undefined') {
                          const localPhotos = JSON.parse(localStorage.getItem('healix_mock_photos') || '[]');
                          const newPhoto = {
                            id: 'mock-' + Date.now(),
                            caption: photoCaption.trim(),
                            image_url: imageUrl,
                            created_at: new Date().toISOString()
                          };
                          localStorage.setItem('healix_mock_photos', JSON.stringify([newPhoto, ...localPhotos]));
                        }

                        const fd = new FormData();
                        fd.append("caption", photoCaption.trim());
                        fd.append("image_url", imageUrl);
                        const res = await addSessionPhoto(fd);
                        if (res?.error) {
                          alert(res.error);
                        } else {
                          setPhotoPreview(null);
                          setPhotoCaption("");
                          if (urlInput) urlInput.value = "";
                          fetchData();
                        }
                        setPhotoAdding(false);
                      }}
                      className="px-4 bg-pink-600 hover:bg-pink-700 disabled:opacity-40 text-white rounded-xl flex items-center gap-1 transition-colors text-sm font-bold shrink-0"
                    >
                      {photoAdding ? (
                        <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <><Plus className="h-4 w-4" /> Add Photo</>
                      )}
                    </button>
                  </div>

                  {/* Photos grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-1 mt-6">
                    {(data.session_photos || []).map((p: any) => (
                      <div key={p.id} className="relative group rounded-xl overflow-hidden border border-white/10 aspect-video">
                        <img src={p.image_url} alt={p.caption} className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                        <p className="absolute bottom-2 left-2 right-8 text-xs text-white font-semibold truncate">{p.caption}</p>
                        <button
                          onClick={() => handleDeleteContent(p.id, deleteSessionPhoto)}
                          className="absolute top-2 right-2 p-1.5 bg-red-500/20 text-red-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                    {(data.session_photos || []).length === 0 && (
                      <div className="col-span-full py-8 text-center text-white/30 border border-dashed border-white/10 rounded-xl">
                        No session photos yet. Upload or paste a URL above.
                      </div>
                    )}
                  </div>
                </GlassCard>
              </motion.div>
            )}

            {/* SYSTEM TAB */}
            {activeTab === "system" && (
              <motion.div key="system" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">System Logs</h2>
                  <p className="text-white/50">Infrastructure health and automated diagnostics.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <GlassCard className="border-white/5">
                    <h3 className="font-bold flex items-center gap-2 mb-4"><Database className="h-5 w-5 text-green-400" /> Database Integrity</h3>
                    <div className="space-y-3 font-mono text-xs text-white/70">
                      <div className="flex justify-between border-b border-white/5 pb-2"><span>Connection</span> <span className="text-green-400">OK</span></div>
                      <div className="flex justify-between border-b border-white/5 pb-2"><span>Latency</span> <span>42ms</span></div>
                      <div className="flex justify-between border-b border-white/5 pb-2"><span>Users Table</span> <span>Synchronized</span></div>
                      <div className="flex justify-between border-b border-white/5 pb-2"><span>Storage Bucket</span> <span>2.1GB / 50GB</span></div>
                    </div>
                  </GlassCard>

                  <GlassCard className="border-white/5">
                    <h3 className="font-bold flex items-center gap-2 mb-4"><AlertTriangle className="h-5 w-5 text-yellow-400" /> Security Feed</h3>
                    <div className="space-y-3 font-mono text-[10px] text-white/50">
                      <p>[{new Date().toISOString().split('T')[1].substring(0,8)}] Admin session initiated.</p>
                      <p>[{new Date(Date.now() - 3600000).toISOString().split('T')[1].substring(0,8)}] Automated backup completed.</p>
                      <p className="text-yellow-400/80">[{new Date(Date.now() - 7200000).toISOString().split('T')[1].substring(0,8)}] Multiple failed login attempts blocked from IP 192.168.1.104</p>
                      <p>[{new Date(Date.now() - 86400000).toISOString().split('T')[1].substring(0,8)}] Database index rebuilt successfully.</p>
                    </div>
                  </GlassCard>
                </div>
              </motion.div>
            )}

            {/* === REELS TAB === */}
            {activeTab === "reels" && (
              <motion.div key="reels" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold font-mono tracking-tight mb-2">COMMUNITY_REELS_MANAGER</h2>
                  <p className="text-white/40 text-sm font-mono">Manage homepage user stories and telemetry logs.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Active Reels */}
                  <div className="lg:col-span-2 space-y-4">
                    <h3 className="font-mono text-sm uppercase text-white/50 tracking-wider">Active Reels</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {data.reels?.map((reel: any) => (
                        <div key={reel.id} className="relative aspect-[9/16] bg-[#0a0a0a] border border-white/10 rounded overflow-hidden group">
                          <img src={reel.thumbnail_url} alt={reel.title} className="w-full h-full object-cover opacity-60" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent p-4 flex flex-col justify-end">
                            <p className="text-xs text-white/50 font-mono mb-1">{reel.user_handle}</p>
                            <p className="text-sm font-bold leading-tight mb-4">{reel.title}</p>
                          </div>
                          <button 
                            onClick={async () => {
                              await deleteReel(reel.id);
                              fetchData();
                            }}
                            className="absolute top-2 right-2 p-2 bg-red-500/20 text-red-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Add New Reel */}
                  <div>
                    <h3 className="font-mono text-sm uppercase text-white/50 tracking-wider mb-4">Upload Reel</h3>
                    <form action={async (formData) => {
                      await addReel({
                        title: formData.get("title") as string,
                        user_handle: formData.get("user_handle") as string,
                        thumbnail_url: formData.get("thumbnail_url") as string,
                        video_url: formData.get("video_url") as string
                      });
                      fetchData();
                    }} className="space-y-4 bg-[#0a0a0a] border border-white/10 p-6 rounded-sm">
                      <div>
                        <label className="text-[10px] uppercase text-white/40 font-mono">Reel Title</label>
                        <input name="title" required className="w-full bg-black border border-white/10 rounded-sm px-3 py-2 text-sm mt-1 focus:border-white/30" placeholder="e.g. SOS Test" />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase text-white/40 font-mono">User Handle</label>
                        <input name="user_handle" required className="w-full bg-black border border-white/10 rounded-sm px-3 py-2 text-sm mt-1 focus:border-white/30" placeholder="@username" />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase text-white/40 font-mono">Thumbnail URL</label>
                        <input name="thumbnail_url" required className="w-full bg-black border border-white/10 rounded-sm px-3 py-2 text-sm mt-1 focus:border-white/30" placeholder="/reel-1-thumb.webp" />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase text-white/40 font-mono">Video URL</label>
                        <input name="video_url" required className="w-full bg-black border border-white/10 rounded-sm px-3 py-2 text-sm mt-1 focus:border-white/30" placeholder="https://..." defaultValue="https://www.w3schools.com/html/mov_bbb.mp4" />
                      </div>
                      <button type="submit" className="w-full py-2 bg-white text-black font-bold uppercase tracking-wider text-xs rounded-sm hover:bg-white/90">
                        Upload Reel
                      </button>
                    </form>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
      `}} />
    </div>
  );
}

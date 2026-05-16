"use client";

import React, { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { 
  FileText, Plus, Calendar, Clock, CheckCircle, 
  XCircle, AlertCircle, Cpu, Network, Database,
  CreditCard, Upload, Video, Users, Mail, ArrowRight, Shield, Fingerprint, Activity, Beaker
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getUserApplications, submitApplication } from "../actions";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function UserDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"applications" | "new" | "schedules" | "idcard" | "research" | "sessions" | "mentorship">("idcard");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [appsData, setAppsData] = useState<{applications: any[], projects: any[]}>({ applications: [], projects: [] });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{type: 'error' | 'success', text: string} | null>(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const [uniqueId, setUniqueId] = useState("");
  const [isFlipped, setIsFlipped] = useState(false);

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
        
        // Generate deterministic ID
        const email = session.user.email || "user@healix.tech";
        let hash = 0;
        for (let i = 0; i < email.length; i++) {
          hash = email.charCodeAt(i) + ((hash << 5) - hash);
        }
        const numericHash = Math.abs(hash).toString().padStart(4, '0').slice(0, 4);
        setUniqueId(`HX-RES-2026-${numericHash}`);
        
        // Show welcome if not seen
        if (!localStorage.getItem(`healix_welcome_seen_${email}`)) {
          setShowWelcome(true);
          localStorage.setItem(`healix_welcome_seen_${email}`, 'true');
        }
      } else {
        // Fallback for visual testing
        setUniqueId(`HX-RES-2026-9999`);
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
    { id: "idcard", label: "ID & Credentials", icon: CreditCard },
    { id: "research", label: "Submit Research", icon: Upload },
    { id: "applications", label: "My Applications", icon: FileText },
    { id: "new", label: "New Proposal", icon: Plus },
    { id: "sessions", label: "Upcoming Sessions", icon: Video },
    { id: "mentorship", label: "Mentorship", icon: Users },
    { id: "schedules", label: "Facility Schedules", icon: Calendar },
  ] as const;

  return (
    <div className="min-h-screen bg-[#050505] text-white/90 font-sans flex">
      {/* WELCOME MODAL */}
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ y: 50, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              className="bg-[#0a0a0a] border border-white/10 rounded-2xl max-w-2xl w-full p-8 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 via-[#eab308] to-blue-600" />
              <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-6">
                <Image src="/biolabs-logo.png" alt="BioLabs" width={48} height={48} />
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-white">HEALIX BIOLABS</h2>
                  <p className="text-[#eab308] font-mono text-xs tracking-widest uppercase">Official Welcome Packet</p>
                </div>
              </div>
              <div className="space-y-4 text-white/80 leading-relaxed font-serif">
                <p>Dear {user?.user_metadata?.full_name || "Researcher"},</p>
                <p>Welcome to the Healix BioLabs Institutional Portal. You have been granted authorized access to our secure research environment.</p>
                <p>Your unique institutional credential <span className="font-mono text-[#eab308] bg-[#eab308]/10 px-1 py-0.5 rounded">{uniqueId}</span> has been generated and is now available in your dashboard. This ID grants you access to our HPC clusters, IoT fabrication labs, and clinical intelligence dashboards.</p>
                <p>As a member of our research division, you are expected to adhere to the strictest protocols of data security and ethical biomedical research.</p>
                <p>We look forward to your contributions in engineering the future of healthcare.</p>
                <div className="pt-4">
                  <p className="font-bold text-white">Office of the Director</p>
                  <p className="text-sm text-white/50">Healix Technologies Pvt. Ltd.</p>
                </div>
              </div>
              <button
                onClick={() => setShowWelcome(false)}
                className="mt-8 w-full py-3 bg-white text-black hover:bg-white/90 rounded-lg font-bold text-sm uppercase tracking-widest transition-colors"
              >
                Access Dashboard
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
            
            {/* ID CARD TAB */}
            {activeTab === "idcard" && (
              <motion.div key="idcard" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8 flex flex-col items-center pb-20">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-2 font-mono tracking-tight text-white">INSTITUTIONAL_CREDENTIAL</h2>
                  <p className="text-white/40 text-sm font-mono tracking-wide">Click the card to flip and view the reverse side.</p>
                </div>

                {/* ID Card 3D Container */}
                <div className="group w-[340px] h-[540px] perspective-[2000px] cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
                  <motion.div 
                    className="w-full h-full relative transition-all duration-700 shadow-2xl"
                    style={{ transformStyle: 'preserve-3d' }}
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                  >
                    {/* FRONT SIDE */}
                    <div className="absolute w-full h-full bg-[#080808] border border-[#eab308]/40 rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(234,179,8,0.1)] flex flex-col" style={{ backfaceVisibility: 'hidden' }}>
                      {/* Subtle Noise Texture overlay */}
                      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-black pointer-events-none" />
                      
                      {/* Header */}
                      <div className="pt-6 pb-4 px-4 text-center border-b border-[#eab308]/20 bg-gradient-to-b from-[#eab308]/10 to-transparent relative z-10">
                        <h3 className="font-bold text-white tracking-widest text-[13px] leading-tight mb-1">HEALIX TECHNOLOGIES PVT. LTD.</h3>
                        <p className="text-[#eab308] font-mono text-[9px] tracking-wide">जैव-चिकित्सीय अनुसंधान एवं अभियांत्रिकी केंद्र</p>
                      </div>

                      {/* Content */}
                      <div className="flex-1 px-6 py-6 flex flex-col items-center relative z-10">
                        {/* Portrait */}
                        <div className="w-32 h-40 border-2 border-[#eab308] rounded-xl overflow-hidden mb-6 p-1 bg-black/50 shadow-inner">
                          <div className="w-full h-full bg-zinc-800 rounded-lg relative overflow-hidden flex items-center justify-center">
                            <Image src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop" alt="Profile" fill className="object-cover" unoptimized />
                          </div>
                        </div>

                        {/* Details */}
                        <div className="w-full space-y-4">
                          <div className="text-center border-b border-white/10 pb-3">
                            <p className="text-[10px] text-white/40 font-mono tracking-widest uppercase mb-1">Full Name</p>
                            <p className="text-lg font-bold text-white uppercase tracking-wider">{user?.user_metadata?.full_name || "RESEARCHER"}</p>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-[8px] text-white/40 font-mono tracking-widest uppercase mb-0.5">Designation</p>
                              <p className="text-xs font-bold text-[#eab308] uppercase">Research Fellow</p>
                            </div>
                            <div>
                              <p className="text-[8px] text-white/40 font-mono tracking-widest uppercase mb-0.5">Unique ID</p>
                              <p className="text-xs font-mono font-bold text-white">{uniqueId}</p>
                            </div>
                            <div>
                              <p className="text-[8px] text-white/40 font-mono tracking-widest uppercase mb-0.5">Division</p>
                              <p className="text-[10px] font-bold text-white uppercase tracking-wide">BioLabs Research</p>
                            </div>
                            <div>
                              <p className="text-[8px] text-white/40 font-mono tracking-widest uppercase mb-0.5">Validity</p>
                              <p className="text-[10px] font-bold text-white uppercase tracking-wide">May 2026 - May 2027</p>
                            </div>
                          </div>

                          <div className="pt-2 flex justify-between items-end">
                            <div>
                              <p className="text-[8px] text-[#eab308]/60 font-mono tracking-widest uppercase mb-0.5">Access Level</p>
                              <div className="flex items-center gap-1.5">
                                <Shield className="h-3 w-3 text-[#eab308]" />
                                <p className="text-xs font-bold text-white uppercase">Authorized</p>
                              </div>
                            </div>
                            <div className="p-1 bg-white rounded border-2 border-white/80">
                                {/* Simulated QR Code */}
                                <div className="grid grid-cols-4 grid-rows-4 gap-0.5 w-8 h-8">
                                  {Array.from({length: 16}).map((_, i) => (
                                    <div key={i} className={`bg-black ${Math.random() > 0.4 ? 'opacity-100' : 'opacity-0'}`} />
                                  ))}
                                  <div className="col-start-1 row-start-1 col-span-2 row-span-2 border-2 border-black bg-white" />
                                </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Footer border accent */}
                      <div className="h-2 w-full bg-gradient-to-r from-transparent via-[#eab308] to-transparent opacity-50 relative z-10" />
                    </div>

                    {/* BACK SIDE */}
                    <div className="absolute w-full h-full bg-[#080808] border border-white/20 rounded-2xl overflow-hidden p-6 flex flex-col" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                      {/* Large Watermark */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                        <Image src="/biolabs-logo.png" alt="Watermark" width={250} height={250} className="object-contain grayscale" />
                      </div>

                      <div className="relative z-10 flex-1 flex flex-col">
                        <div className="border-b border-white/10 pb-4 mb-4 text-center">
                          <h4 className="font-mono text-xs text-white/50 tracking-[0.2em] uppercase">Institutional Credential</h4>
                        </div>

                        <div className="space-y-6 flex-1">
                          <div>
                            <h5 className="text-[10px] text-[#eab308] font-bold uppercase tracking-wider mb-2">Authorized Access Areas:</h5>
                            <ul className="text-xs text-white/80 space-y-1.5 font-mono">
                              <li className="flex items-center gap-2"><div className="w-1 h-1 bg-[#eab308] rounded-full"/> Research Labs</li>
                              <li className="flex items-center gap-2"><div className="w-1 h-1 bg-[#eab308] rounded-full"/> Bioinformatics Systems</li>
                              <li className="flex items-center gap-2"><div className="w-1 h-1 bg-[#eab308] rounded-full"/> Clinical Intelligence Dashboard</li>
                              <li className="flex items-center gap-2"><div className="w-1 h-1 bg-[#eab308] rounded-full"/> Internal Academic Network</li>
                            </ul>
                          </div>

                          <div className="p-3 bg-red-500/5 border border-red-500/20 rounded-lg">
                            <h5 className="text-[10px] text-red-400 font-bold uppercase tracking-wider mb-1">Emergency Contact:</h5>
                            <p className="text-sm font-mono text-white">+91 9540694581</p>
                          </div>

                          <div>
                            <p className="text-[9px] text-white/40 leading-relaxed text-justify">
                              This credential certifies official affiliation with Healix Technologies Pvt. Ltd. Unauthorized duplication, transfer, or misuse is strictly prohibited and subject to legal action under corporate espionage laws. If found, please return to the nearest Healix facility.
                            </p>
                          </div>
                        </div>

                        <div className="mt-auto pt-4 border-t border-white/10 flex flex-col items-center text-center">
                          <div className="flex items-center gap-4 mb-3 text-white/30">
                            <Activity className="h-4 w-4" />
                            <Cpu className="h-4 w-4" />
                            <Shield className="h-4 w-4" />
                            <Fingerprint className="h-4 w-4" />
                          </div>
                          <p className="text-[10px] text-white/60 font-mono">https://healix-nu.vercel.app</p>
                          <p className="text-[8px] text-[#eab308]/50 uppercase tracking-widest mt-1">Engineering Biomedical Intelligence</p>
                        </div>
                      </div>
                    </div>

                  </motion.div>
                </div>
                
                <div className="flex items-center gap-2 text-white/30 text-xs font-mono">
                  <Fingerprint className="h-3 w-3" /> Verify at /verify/{uniqueId}
                </div>
              </motion.div>
            )}

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

            {/* SUBMIT RESEARCH TAB */}
            {activeTab === "research" && (
              <motion.div key="research" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8 max-w-3xl mx-auto">
                <div>
                  <h2 className="text-3xl font-bold mb-2 font-mono">UPLOAD_RESEARCH_PAPER</h2>
                  <p className="text-white/40 font-mono text-sm">Submit your latest findings to the BioLabs internal repository.</p>
                </div>
                <GlassCard className="p-8 border-white/10">
                  <div className="border-2 border-dashed border-white/10 rounded-xl p-12 flex flex-col items-center justify-center text-center hover:border-[#eab308]/50 hover:bg-[#eab308]/5 transition-colors cursor-pointer group">
                    <div className="p-4 bg-white/5 rounded-full mb-4 group-hover:bg-[#eab308]/20 transition-colors">
                      <Upload className="h-8 w-8 text-white/50 group-hover:text-[#eab308] transition-colors" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">Drag & Drop Research Paper</h3>
                    <p className="text-white/40 text-sm mb-6">Supports PDF, DOCX, and LaTeX zips up to 50MB.</p>
                    <button className="px-6 py-2 bg-white text-black hover:bg-white/90 rounded font-bold text-xs uppercase tracking-widest transition-colors">
                      Browse Files
                    </button>
                  </div>
                  <div className="mt-8 space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold text-white/30 tracking-wider">Paper Title</label>
                      <input placeholder="e.g., Novel Biomarkers in Early Oncology" className="w-full bg-[#0a0a0a] border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-[#eab308]/50 transition-colors" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold text-white/30 tracking-wider">DOI / Pre-print Link (Optional)</label>
                      <input placeholder="https://doi.org/..." className="w-full bg-[#0a0a0a] border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-[#eab308]/50 transition-colors" />
                    </div>
                    <button className="w-full py-4 mt-4 bg-[#eab308] text-black hover:bg-[#eab308]/90 rounded font-bold uppercase tracking-widest transition-all">
                      Submit for Internal Review
                    </button>
                  </div>
                </GlassCard>
              </motion.div>
            )}

            {/* UPCOMING SESSIONS TAB */}
            {activeTab === "sessions" && (
              <motion.div key="sessions" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold mb-2 font-mono tracking-tight">AI_PIPELINE_SESSIONS</h2>
                  <p className="text-white/40 text-sm font-mono tracking-wide">Join live seminars on genomic modeling and AI infrastructure.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <GlassCard className="border-white/10 p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-2 bg-red-500/20 rounded text-red-400"><Video className="h-5 w-5" /></div>
                      <span className="px-2 py-1 bg-red-500 text-white rounded text-[10px] uppercase font-bold animate-pulse">Live Now</span>
                    </div>
                    <h3 className="font-bold text-xl mb-2">Training Random Forests for Genomic Signatures</h3>
                    <p className="text-sm text-white/60 mb-4">Dr. Avnish Verma • BioLabs Alpha Cluster</p>
                    <button className="w-full py-2 bg-white/10 hover:bg-white/20 rounded font-semibold text-sm transition-colors">Join Webcast</button>
                  </GlassCard>
                  
                  <GlassCard className="border-white/5 p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-2 bg-blue-500/20 rounded text-blue-400"><Database className="h-5 w-5" /></div>
                      <span className="px-2 py-1 bg-white/5 text-white/50 border border-white/10 rounded text-[10px] uppercase font-bold">Starts in 2h</span>
                    </div>
                    <h3 className="font-bold text-xl mb-2">Supabase Vector Embeddings in Clinical Data</h3>
                    <p className="text-sm text-white/60 mb-4">Data Engineering Team • Room 402</p>
                    <button className="w-full py-2 bg-white/5 hover:bg-white/10 rounded font-semibold text-sm transition-colors text-white/50">Remind Me</button>
                  </GlassCard>
                </div>
              </motion.div>
            )}

            {/* MENTORSHIP TAB */}
            {activeTab === "mentorship" && (
              <motion.div key="mentorship" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold mb-2 font-mono tracking-tight">RESEARCH_MENTORSHIP</h2>
                  <p className="text-white/40 text-sm font-mono tracking-wide">Connect with senior scientists and engineers at Healix.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <GlassCard className="border-white/5 p-6 text-center group">
                    <div className="w-20 h-20 mx-auto rounded-full overflow-hidden mb-4 border-2 border-white/10 group-hover:border-[#eab308] transition-colors">
                      <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                        <Users className="h-8 w-8 text-white/30" />
                      </div>
                    </div>
                    <h3 className="font-bold text-lg">Dr. Sarah Chen</h3>
                    <p className="text-xs text-[#eab308] font-mono mb-4">Lead Bioinformatician</p>
                    <p className="text-xs text-white/50 mb-6">Expert in Next-Gen Sequencing and computational biology pipelines.</p>
                    <button className="w-full py-2 border border-white/10 hover:bg-white/5 rounded text-xs font-bold uppercase tracking-widest transition-colors">Request 1:1</button>
                  </GlassCard>
                  
                  <GlassCard className="border-white/5 p-6 text-center group">
                    <div className="w-20 h-20 mx-auto rounded-full overflow-hidden mb-4 border-2 border-white/10 group-hover:border-[#eab308] transition-colors">
                      <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                        <Cpu className="h-8 w-8 text-white/30" />
                      </div>
                    </div>
                    <h3 className="font-bold text-lg">Marcus Vance</h3>
                    <p className="text-xs text-[#eab308] font-mono mb-4">AI Infrastructure Head</p>
                    <p className="text-xs text-white/50 mb-6">Scaling distributed training workloads across our HPC clusters.</p>
                    <button className="w-full py-2 border border-white/10 hover:bg-white/5 rounded text-xs font-bold uppercase tracking-widest transition-colors">Request 1:1</button>
                  </GlassCard>

                  <GlassCard className="border-white/5 p-6 text-center border-dashed flex flex-col items-center justify-center opacity-50 hover:opacity-100 transition-opacity">
                    <Plus className="h-8 w-8 text-white/30 mb-2" />
                    <h3 className="font-bold text-sm">Become a Mentor</h3>
                    <p className="text-xs text-white/40 mt-2">Share your expertise with incoming research fellows.</p>
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

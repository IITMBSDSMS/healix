"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, User, Building, Compass, Sparkles, 
  ChevronRight, Search, Filter, X, CheckCircle, Mail, Briefcase
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { getBiolabsContent } from "@/app/biolabs/actions";

const CATEGORIES = ["All Seminars", "Healthcare AI", "Edge Telemetry", "Academic Workshops"];

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.96 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.08,
      duration: 0.55,
      ease: [0.21, 1.02, 0.43, 1.01] as [number, number, number, number]
    }
  })
};

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Seminars");
  
  // Registration Modal States
  const [registeringEvent, setRegisteringEvent] = useState<any | null>(null);
  const [regForm, setRegForm] = useState({ name: "", email: "", org: "", role: "" });
  const [regSuccess, setRegSuccess] = useState(false);
  const [submittingReg, setSubmittingReg] = useState(false);

  useEffect(() => {
    async function loadEvents() {
      try {
        const content = await getBiolabsContent();
        const serverEvents = (content.events || []).map((e: any, idx: number) => {
          let description = e.description;
          let category = "Academic Workshops";
          let speaker = "Research Fellow";
          let speaker_role = "BioLabs Faculty Advisor";
          let seats_left = 15;

          try {
            if (e.description.startsWith("{") && e.description.endsWith("}")) {
              const parsed = JSON.parse(e.description);
              description = parsed.description;
              category = parsed.category || "Academic Workshops";
              speaker = parsed.speaker || "Research Fellow";
              speaker_role = parsed.speaker_role || "BioLabs Faculty Advisor";
              seats_left = parsed.seats_left !== undefined ? parsed.seats_left : 15;
            } else {
              category = e.title.toLowerCase().includes("ai") || e.title.toLowerCase().includes("clinical") ? "Healthcare AI" : "Academic Workshops";
            }
          } catch (err) {}

          return {
            id: e.id || `server-ev-${idx}`,
            title: e.title,
            description,
            image_url: e.image_url,
            category,
            speaker,
            speaker_role,
            start_date: e.start_date,
            end_date: e.end_date,
            seats_left
          };
        });
        
        setEvents(serverEvents);
      } catch (err) {
        console.warn("Failed to load biolabs events:", err);
      } finally {
        setLoading(false);
      }
    }
    loadEvents();
  }, []);

  const formatDate = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric"
      }) + " · " + d.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch (e) {
      return isoStr;
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regForm.name || !regForm.email || !regForm.org) return;

    setSubmittingReg(true);
    // Simulate API registration delay
    setTimeout(() => {
      setSubmittingReg(false);
      setRegSuccess(true);
    }, 1000);
  };

  const closeRegModal = () => {
    setRegisteringEvent(null);
    setRegForm({ name: "", email: "", org: "", role: "" });
    setRegSuccess(false);
  };

  // Filter logic
  const filteredEvents = events.filter(e => {
    const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          e.speaker.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All Seminars" || e.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="relative min-h-screen flex flex-col w-full bg-[#fafafa] text-black pb-28 overflow-x-hidden">
      {/* Soundwave background vector dots */}
      <div className="absolute inset-0 bg-[radial-gradient(#ea580c_0.5px,transparent_0.5px)] [background-size:16px_16px] opacity-[0.03] pointer-events-none" />

      {/* Header Spotlight Blur */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-orange-400/5 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-indigo-400/5 blur-[140px] rounded-full pointer-events-none -z-10" />

      {/* Main Container */}
      <div className="relative mx-auto max-w-[92%] px-4 sm:px-6 lg:px-8 w-full mt-10 md:mt-16 space-y-12">
        
        {/* Header Hero Typographic Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-black font-mono uppercase tracking-tight text-slate-900">
            Healix <span className="text-[#ea580c]">Knowledge Hub</span>
          </h1>
          <p className="text-sm md:text-base text-slate-600 leading-relaxed font-sans">
            Access, engage, and register for premier academic workshops, medical AI triaging courses, and Edge failsafe mesh tutorials conducted at Healix Research HQ.
          </p>
        </div>

        {/* Dynamic Filters & Search Panel */}
        <div className="bg-white border border-slate-200 shadow-sm p-5 md:p-6 rounded-2xl flex flex-col md:flex-row gap-5 items-center justify-between">
          {/* Search bar */}
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search seminars, speakers, topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#ea580c] transition-colors"
            />
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {CATEGORIES.map((cat) => {
              const isActive = cat === selectedCategory;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-mono font-bold uppercase transition-all duration-300 cursor-pointer ${
                    isActive 
                      ? "bg-[#ea580c] text-white shadow-md" 
                      : "bg-[#fafafa] text-slate-500 border border-slate-200 hover:text-slate-900 hover:border-slate-350"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Grid Catalog */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-28">
            <div className="w-11 h-11 border-2 border-orange-500/20 border-t-[#ea580c] rounded-full animate-spin mb-4" />
            <p className="text-slate-400 text-xs font-mono uppercase tracking-widest">Opening Seminar Catalog...</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-20 bg-white/50 border border-slate-200/60 rounded-2xl max-w-xl mx-auto">
            <Calendar className="w-9 h-9 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-mono text-slate-500 uppercase font-bold">No Seminars Found</p>
            <p className="text-xs text-slate-400 mt-1">Try resetting filters or adjusting search queries.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredEvents.map((sem, idx) => (
              <motion.div
                key={sem.id}
                custom={idx}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={cardVariants}
                className="h-full"
              >
                <GlassCard 
                  variant="light"
                  className="p-6 bg-white border border-slate-200/80 rounded-2xl shadow-sm hover:border-[#ea580c]/30 hover:shadow-lg hover:shadow-slate-200/40 transition-all group flex flex-col justify-between h-full"
                >
                  <div className="space-y-5">
                    {/* Event Backdrop Image */}
                    <div className="w-full aspect-[21/9] rounded-xl overflow-hidden relative border border-slate-200 shadow-inner bg-slate-50">
                      {sem.image_url ? (
                        <img 
                          src={sem.image_url} 
                          alt={sem.title} 
                          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400 font-mono text-xs uppercase font-bold">
                          Seminar Lecture
                        </div>
                      )}
                      
                      {/* Floating Category Tag */}
                      <span className="absolute top-3 right-3 px-2 py-0.5 border border-white/20 bg-black/50 backdrop-blur-md text-white font-mono text-[8px] font-bold uppercase tracking-widest rounded-md">
                        {sem.category}
                      </span>
                    </div>

                    {/* Meta info */}
                    <div className="space-y-2 text-left">
                      <p className="text-[#ea580c] font-mono text-[9px] sm:text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 shrink-0" /> {formatDate(sem.start_date)}
                      </p>
                      
                      <h3 className="font-extrabold text-base sm:text-lg text-slate-900 font-mono uppercase group-hover:text-[#ea580c] transition-colors leading-snug">
                        {sem.title}
                      </h3>
                      
                      <p className="text-xs text-slate-600 leading-relaxed font-sans">
                        {sem.description}
                      </p>
                    </div>

                    {/* Speaker block */}
                    <div className="flex items-center gap-3 bg-[#fafafa] border border-slate-150 p-3 rounded-xl">
                      <div className="w-9 h-9 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-400 shrink-0 font-bold font-mono">
                        {sem.speaker[0]}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-xs text-slate-800 font-mono truncate">{sem.speaker}</p>
                        <p className="text-[9px] font-mono text-[#ea580c] uppercase truncate">{sem.speaker_role}</p>
                      </div>
                    </div>
                  </div>

                  {/* Actions footer */}
                  <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-6">
                    <span className="text-[10px] font-mono text-slate-500 uppercase font-semibold">
                      Seats Left: <span className="text-red-500 font-bold">{sem.seats_left}</span>
                    </span>
                    <button
                      onClick={() => setRegisteringEvent(sem)}
                      className="h-8.5 px-4 bg-[#ea580c] hover:bg-[#c2410c] text-white text-[10px] sm:text-xs font-bold font-mono uppercase tracking-wider rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      Register Now <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* --- REGISTRATION DIALOG MODAL --- */}
      <AnimatePresence>
        {registeringEvent && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeRegModal}
              className="absolute inset-0"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 12 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white p-7 shadow-2xl text-slate-900 flex flex-col"
            >
              {/* Close x */}
              <button
                onClick={closeRegModal}
                className="absolute top-4 right-4 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>

              {regSuccess ? (
                // SUCCESS STATE
                <div className="flex flex-col items-center text-center py-6 space-y-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-250 flex items-center justify-center text-emerald-600 mb-2">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black font-mono text-slate-900 uppercase">Registration Confirmed</h3>
                    <p className="text-xs text-slate-400 mt-1 uppercase font-mono tracking-widest">{registeringEvent.title.substring(0, 32)}...</p>
                  </div>
                  <p className="text-xs leading-relaxed text-slate-600 max-w-sm">
                    Thank you, <span className="font-bold text-slate-800">{regForm.name}</span>! We have reserved your seat and sent confirmation details + digital calendar invite to <span className="font-bold text-slate-800">{regForm.email}</span>.
                  </p>
                  <button
                    onClick={closeRegModal}
                    className="w-full py-2 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer mt-6"
                  >
                    Done
                  </button>
                </div>
              ) : (
                // REGISTRATION FORM
                <div className="space-y-5">
                  <div className="border-b border-slate-100 pb-3">
                    <span className="text-[#ea580c] font-mono text-[9px] font-bold uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                      <Calendar className="w-3.5 h-3.5" /> {formatDate(registeringEvent.start_date)}
                    </span>
                    <h3 className="text-base font-black font-mono text-slate-900 uppercase leading-snug">
                      Register: {registeringEvent.title}
                    </h3>
                  </div>

                  <form onSubmit={handleRegisterSubmit} className="space-y-4">
                    <div className="space-y-1 text-left">
                      <label className="text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase flex items-center gap-1">
                        <User className="w-3 h-3 text-[#ea580c]" /> Candidate Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. John Doe"
                        value={regForm.name}
                        onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                        className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#ea580c]"
                      />
                    </div>

                    <div className="space-y-1 text-left">
                      <label className="text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase flex items-center gap-1">
                        <Mail className="w-3 h-3 text-[#ea580c]" /> Institutional Email *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. john@university.edu"
                        value={regForm.email}
                        onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                        className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#ea580c]"
                      />
                    </div>

                    <div className="space-y-1 text-left">
                      <label className="text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase flex items-center gap-1">
                        <Building className="w-3 h-3 text-[#ea580c]" /> College / Organization *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. IIT Madras"
                        value={regForm.org}
                        onChange={(e) => setRegForm({ ...regForm, org: e.target.value })}
                        className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#ea580c]"
                      />
                    </div>

                    <div className="space-y-1 text-left">
                      <label className="text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase flex items-center gap-1">
                        <Briefcase className="w-3 h-3 text-[#ea580c]" /> Technical Role / Designation
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Student Research Fellow"
                        value={regForm.role}
                        onChange={(e) => setRegForm({ ...regForm, role: e.target.value })}
                        className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#ea580c]"
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        type="button"
                        onClick={closeRegModal}
                        className="flex-1 py-2.5 rounded-xl border border-slate-250 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={submittingReg}
                        className="flex-1 py-2.5 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-50"
                      >
                        {submittingReg ? "Confirming..." : "Confirm Seat"}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

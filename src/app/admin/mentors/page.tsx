"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Plus, Trash2, Upload, Edit3, X, Check, Users, ChevronUp, ChevronDown,
  Link2, MessageCircle, Code2, Eye, EyeOff, RefreshCw
} from "lucide-react";

type Mentor = {
  id: string;
  name: string;
  role: string;
  organization: string;
  bio: string;
  quote: string;
  photo_url: string;
  linkedin_url: string;
  twitter_url: string;
  github_url: string;
  display_order: number;
  active: boolean;
  created_at: string;
};

const EMPTY_FORM = {
  name: "",
  role: "",
  organization: "",
  bio: "",
  quote: "",
  photo_url: "",
  linkedin_url: "https://linkedin.com",
  twitter_url: "https://x.com",
  github_url: "https://github.com",
  display_order: 0,
  active: true,
};

export default function AdminMentorsPage() {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingFor, setUploadingFor] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "ok" | "err" } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string, type: "ok" | "err" = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchMentors = async () => {
    setLoading(true);
    try {
      // Use service-role capable endpoint (admin context)
      const res = await fetch("/api/mentors?all=true");
      const data = await res.json();
      setMentors(Array.isArray(data) ? data : []);
    } catch {
      showToast("Failed to load mentors", "err");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMentors(); }, []);

  const openAddForm = () => {
    setEditingId(null);
    setForm({ ...EMPTY_FORM, display_order: mentors.length });
    setShowForm(true);
  };

  const openEditForm = (m: Mentor) => {
    setEditingId(m.id);
    setForm({
      name: m.name, role: m.role, organization: m.organization ?? "",
      bio: m.bio ?? "", quote: m.quote ?? "", photo_url: m.photo_url ?? "",
      linkedin_url: m.linkedin_url ?? "", twitter_url: m.twitter_url ?? "",
      github_url: m.github_url ?? "", display_order: m.display_order,
      active: m.active,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingId) {
        await fetch(`/api/mentors/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        showToast("Mentor updated!");
      } else {
        await fetch("/api/mentors", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        showToast("Mentor added!");
      }
      setShowForm(false);
      fetchMentors();
    } catch {
      showToast("Failed to save", "err");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete ${name}? This cannot be undone.`)) return;
    try {
      await fetch(`/api/mentors/${id}`, { method: "DELETE" });
      showToast(`${name} removed`);
      fetchMentors();
    } catch {
      showToast("Delete failed", "err");
    }
  };

  const toggleActive = async (m: Mentor) => {
    await fetch(`/api/mentors/${m.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !m.active }),
    });
    showToast(`${m.name} ${m.active ? "hidden" : "shown"} on site`);
    fetchMentors();
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>, mentorId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingFor(mentorId);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("mentorId", mentorId);
      const res = await fetch("/api/mentors/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) {
        showToast("Photo uploaded!");
        fetchMentors();
      } else {
        showToast(data.error ?? "Upload failed", "err");
      }
    } catch {
      showToast("Upload failed", "err");
    } finally {
      setUploadingFor(null);
      e.target.value = "";
    }
  };

  const moveOrder = async (m: Mentor, dir: "up" | "down") => {
    const newOrder = dir === "up" ? m.display_order - 1 : m.display_order + 1;
    await fetch(`/api/mentors/${m.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ display_order: newOrder }),
    });
    fetchMentors();
  };

  return (
    <div className="min-h-screen bg-[#050505] text-gray-200 p-6 md:p-10 font-sans">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className={`fixed top-6 right-6 z-[9999] px-5 py-3 rounded-xl text-sm font-semibold shadow-2xl flex items-center gap-2 ${
              toast.type === "ok" ? "bg-emerald-600 text-white" : "bg-red-600 text-white"
            }`}
          >
            {toast.type === "ok" ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2 text-[#eab308] mb-2">
              <Users className="w-5 h-5" />
              <span className="text-xs font-mono uppercase tracking-widest">Admin Panel</span>
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Mentors & Leadership</h1>
            <p className="text-gray-500 text-sm mt-1">{mentors.length} mentor{mentors.length !== 1 ? "s" : ""} — manage who appears on the About page</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={fetchMentors} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white transition-all">
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={openAddForm}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#eab308] hover:bg-yellow-400 text-black font-bold rounded-xl transition-all shadow-lg shadow-yellow-500/20 text-sm"
            >
              <Plus className="w-4 h-4" /> Add Mentor
            </button>
          </div>
        </div>

        {/* Mentor Grid */}
        {loading ? (
          <div className="py-32 text-center text-gray-600 font-mono text-sm animate-pulse">Loading mentors...</div>
        ) : mentors.length === 0 ? (
          <div className="py-32 text-center border border-dashed border-white/10 rounded-2xl">
            <Users className="w-12 h-12 text-gray-700 mx-auto mb-4" />
            <p className="text-gray-500">No mentors yet. Click &quot;Add Mentor&quot; to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {mentors.map((m) => (
              <motion.div
                key={m.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`relative bg-[#0c0c0c] border rounded-2xl overflow-hidden transition-all ${
                  m.active ? "border-white/10 hover:border-[#eab308]/30" : "border-white/5 opacity-50"
                }`}
              >
                {/* Photo */}
                <div className="relative h-52 bg-[#111] group">
                  {m.photo_url ? (
                    <Image src={m.photo_url} alt={m.name} fill className="object-cover object-top" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-700 text-5xl font-bold">
                      {m.name[0]}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c] via-transparent to-transparent" />

                  {/* Upload overlay */}
                  <label className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-10">
                    <div className="flex flex-col items-center gap-2 text-white">
                      {uploadingFor === m.id ? (
                        <RefreshCw className="w-6 h-6 animate-spin" />
                      ) : (
                        <>
                          <Upload className="w-6 h-6" />
                          <span className="text-xs font-semibold">Replace Photo</span>
                        </>
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handlePhotoUpload(e, m.id)}
                    />
                  </label>

                  {/* Active badge */}
                  <div className={`absolute top-3 left-3 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                    m.active ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-red-500/20 text-red-400 border border-red-500/30"
                  }`}>
                    {m.active ? "LIVE" : "HIDDEN"}
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 space-y-3">
                  <div>
                    <p className="text-[10px] font-mono text-[#eab308] uppercase tracking-widest">{m.role}</p>
                    <h3 className="text-lg font-bold text-white">{m.name}</h3>
                    {m.organization && <p className="text-xs text-gray-500 mt-0.5">{m.organization}</p>}
                  </div>

                  {m.quote && (
                    <p className="text-xs text-gray-400 italic border-l-2 border-[#eab308]/40 pl-3 leading-relaxed line-clamp-2">
                      &ldquo;{m.quote}&rdquo;
                    </p>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => moveOrder(m, "up")} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all" title="Move up">
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs font-mono text-gray-600">#{m.display_order}</span>
                      <button onClick={() => moveOrder(m, "down")} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all" title="Move down">
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => toggleActive(m)} className={`p-1.5 rounded-lg transition-all ${m.active ? "bg-emerald-500/10 text-emerald-400 hover:bg-red-500/10 hover:text-red-400" : "bg-red-500/10 text-red-400 hover:bg-emerald-500/10 hover:text-emerald-400"}`} title={m.active ? "Hide from site" : "Show on site"}>
                        {m.active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </button>
                      <button onClick={() => openEditForm(m)} className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-all" title="Edit">
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDelete(m.id, m.name)} className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all" title="Delete">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", stiffness: 280, damping: 26 }}
              className="bg-[#0c0c0c] border border-white/10 rounded-2xl p-8 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-white">{editingId ? "Edit Mentor" : "Add New Mentor"}</h2>
                <button onClick={() => setShowForm(false)} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1.5 uppercase tracking-wider">Full Name *</label>
                    <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="Dr. Sarah Chen"
                      className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#eab308]/50 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1.5 uppercase tracking-wider">Role / Title *</label>
                    <input required value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                      placeholder="Head of Bioinformatics"
                      className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#eab308]/50 transition-colors" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-400 mb-1.5 uppercase tracking-wider">Organization</label>
                  <input value={form.organization} onChange={e => setForm(f => ({ ...f, organization: e.target.value }))}
                    placeholder="Stanford Research"
                    className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#eab308]/50 transition-colors" />
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-400 mb-1.5 uppercase tracking-wider">Bio</label>
                  <textarea rows={3} value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                    placeholder="Short professional biography..."
                    className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#eab308]/50 transition-colors resize-none" />
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-400 mb-1.5 uppercase tracking-wider">Quote</label>
                  <input value={form.quote} onChange={e => setForm(f => ({ ...f, quote: e.target.value }))}
                    placeholder="An inspiring quote from this mentor..."
                    className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#eab308]/50 transition-colors" />
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-400 mb-1.5 uppercase tracking-wider">Photo URL (or upload after saving)</label>
                  <input value={form.photo_url} onChange={e => setForm(f => ({ ...f, photo_url: e.target.value }))}
                    placeholder="https://... or /local-path.jpg"
                    className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#eab308]/50 transition-colors" />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="flex items-center gap-1 text-xs font-mono text-gray-400 mb-1.5 uppercase tracking-wider"><Link2 className="w-3 h-3" /> LinkedIn</label>
                    <input value={form.linkedin_url} onChange={e => setForm(f => ({ ...f, linkedin_url: e.target.value }))}
                      placeholder="https://linkedin.com/in/..."
                      className="w-full bg-[#111] border border-white/10 rounded-xl px-3 py-2.5 text-white text-xs focus:outline-none focus:border-[#eab308]/50 transition-colors" />
                  </div>
                  <div>
                    <label className="flex items-center gap-1 text-xs font-mono text-gray-400 mb-1.5 uppercase tracking-wider"><MessageCircle className="w-3 h-3" /> X / Twitter</label>
                    <input value={form.twitter_url} onChange={e => setForm(f => ({ ...f, twitter_url: e.target.value }))}
                      placeholder="https://x.com/..."
                      className="w-full bg-[#111] border border-white/10 rounded-xl px-3 py-2.5 text-white text-xs focus:outline-none focus:border-[#eab308]/50 transition-colors" />
                  </div>
                  <div>
                    <label className="flex items-center gap-1 text-xs font-mono text-gray-400 mb-1.5 uppercase tracking-wider"><Code2 className="w-3 h-3" /> GitHub</label>
                    <input value={form.github_url} onChange={e => setForm(f => ({ ...f, github_url: e.target.value }))}
                      placeholder="https://github.com/..."
                      className="w-full bg-[#111] border border-white/10 rounded-xl px-3 py-2.5 text-white text-xs focus:outline-none focus:border-[#eab308]/50 transition-colors" />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <label className="block text-xs font-mono text-gray-400 mb-1.5 uppercase tracking-wider">Display Order</label>
                    <input type="number" value={form.display_order} onChange={e => setForm(f => ({ ...f, display_order: parseInt(e.target.value) || 0 }))}
                      className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#eab308]/50 transition-colors" />
                  </div>
                  <div className="flex items-center gap-2 mt-5">
                    <button type="button" onClick={() => setForm(f => ({ ...f, active: !f.active }))}
                      className={`px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all ${form.active ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" : "bg-white/5 text-gray-500 border-white/10"}`}>
                      {form.active ? "Active (Visible)" : "Hidden"}
                    </button>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowForm(false)}
                    className="flex-1 py-3 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-all font-semibold text-sm">
                    Cancel
                  </button>
                  <button type="submit" disabled={submitting}
                    className="flex-1 py-3 rounded-xl bg-[#eab308] hover:bg-yellow-400 text-black font-bold transition-all shadow-lg shadow-yellow-500/20 text-sm disabled:opacity-50">
                    {submitting ? "Saving..." : editingId ? "Update Mentor" : "Add Mentor"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden file input for programmatic upload */}
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" />
    </div>
  );
}

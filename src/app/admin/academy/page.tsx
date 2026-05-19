"use client";

import React, { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { 
  Users, DollarSign, BookOpen, Search, 
  Filter, MoreVertical, CheckCircle, Clock,
  ArrowUpRight, Download, Plus, Star, Book, 
  UserPlus, Image as ImageIcon, Trash2, Upload, Loader2
} from "lucide-react";
import Image from "next/image";
import { getCourses, getMentors } from "@/lib/academy/db";
import { addMentor, deleteMentor, addCourse, deleteCourse } from "./actions";

export default function AcademyAdmin() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "courses" | "mentors">("dashboard");
  const [courses, setCourses] = useState<any[]>([]);
  const [mentors, setMentors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modals state
  const [showMentorModal, setShowMentorModal] = useState(false);
  const [showCourseModal, setShowCourseModal] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  
  // Dynamic Photo Upload States
  const [isUploading, setIsUploading] = useState<string | null>(null); // tracks 'new' or mentor.id
  const [newMentorPhotoUrl, setNewMentorPhotoUrl] = useState("");

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [coursesData, mentorsData] = await Promise.all([
        getCourses(),
        getMentors()
      ]);
      setCourses(coursesData);
      setMentors(mentorsData);
    } catch (e) {
      console.error("Failed to load academy data");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>, mentorId?: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const targetId = mentorId || 'new';
    setIsUploading(targetId);

    const formData = new FormData();
    formData.append("file", file);
    if (mentorId) {
      formData.append("mentorId", mentorId);
    }

    try {
      const res = await fetch("/api/admin/academy/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        if (mentorId) {
          // If we successfully updated in DB, reload the data to sync view!
          await loadData();
        } else {
          setNewMentorPhotoUrl(data.url);
        }
      } else {
        alert("Upload error: " + (data.error || "Unknown error"));
      }
    } catch (err: any) {
      alert("Failed to upload image: " + err.message);
    } finally {
      setIsUploading(null);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddMentor = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const res = await addMentor(formData);
    if (res && 'error' in res && res.error) {
      alert(res.error);
    } else {
      setShowMentorModal(false);
      loadData();
    }
  };

  const handleDeleteMentor = async (id: string) => {
    if(confirm("Are you sure you want to delete this instructor?")) {
      const res = await deleteMentor(id);
      if (res && 'error' in res && res.error) {
        alert(res.error);
      } else {
        loadData();
      }
    }
  };

  const handleAddCourse = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const res = await addCourse(formData);
    if (res && 'error' in res && res.error) {
      alert(res.error);
    } else {
      setShowCourseModal(false);
      loadData();
    }
  };

  const handleDeleteCourse = async (id: string) => {
    if(confirm("Are you sure you want to delete this course?")) {
      const res = await deleteCourse(id);
      if (res && 'error' in res && res.error) {
        alert(res.error);
      } else {
        loadData();
      }
    }
  };

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
  ];

  return (
    <div className="min-h-screen bg-[#050505] p-8 md:p-12 relative">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Academy Control Center</h1>
          <p className="text-white/40">Manage courses, instructors, and enrollments.</p>
        </div>
        <div className="flex gap-4">
          {activeTab === "mentors" && (
            <Button onClick={() => { setNewMentorPhotoUrl(""); setShowMentorModal(true); }} className="flex items-center gap-2">
              <UserPlus className="w-4 h-4" /> Add Mentor
            </Button>
          )}
          {activeTab === "courses" && (
            <Button onClick={() => setShowCourseModal(true)} className="flex items-center gap-2">
              <Book className="w-4 h-4" /> Add Course
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 border-b border-white/10 pb-4">
        {[
          { id: "dashboard", label: "Dashboard" },
          { id: "courses", label: "Courses" },
          { id: "mentors", label: "Instructors" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              activeTab === tab.id 
                ? "bg-white/10 text-white" 
                : "text-white/40 hover:text-white hover:bg-white/5"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Dashboard View */}
      {activeTab === "dashboard" && (
        <>
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
                      <td className="px-8 py-6 text-sm font-medium">{e.course}</td>
                      <td className="px-8 py-6">
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          e.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-[#eab308]/10 text-[#eab308]'
                        }`}>
                          {e.status === 'Paid' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                          {e.status}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-sm text-white/40">{e.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </>
      )}

      {/* Courses View */}
      {activeTab === "courses" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            <GlassCard key={course.id} className="p-6 border-white/5 relative group">
              <div className="aspect-video relative rounded-lg overflow-hidden mb-4 bg-white/5">
                {course.thumbnail && (
                  <Image src={course.thumbnail} alt={course.title} fill className="object-cover" />
                )}
              </div>
              <h3 className="font-bold text-lg mb-2">{course.title}</h3>
              <p className="text-sm text-white/50 line-clamp-2 mb-4">{course.shortDescription}</p>
              <div className="flex justify-between items-center text-sm">
                <span className="text-[#eab308] font-bold">₹{course.price}</span>
                <span className="text-white/40">{course.duration}</span>
              </div>
              <button onClick={() => handleDeleteCourse(course.id)} className="absolute top-4 right-4 p-2 bg-red-500/10 text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                <Trash2 className="w-4 h-4" />
              </button>
            </GlassCard>
          ))}
        </div>
      )}

      {/* Mentors View */}
      {activeTab === "mentors" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {mentors.map(mentor => (
            <GlassCard key={mentor.id} className="p-6 border-white/5 text-center relative group">
              <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 border-2 border-white/10 relative group/avatar cursor-pointer">
                {isUploading === mentor.id ? (
                  <div className="absolute inset-0 bg-black/75 flex items-center justify-center">
                    <Loader2 className="w-5 h-5 text-[#eab308] animate-spin" />
                  </div>
                ) : (
                  <>
                    <Image src={mentor.photoUrl || "https://i.pravatar.cc/150"} alt={mentor.name} width={96} height={96} className="object-cover w-full h-full group-hover/avatar:scale-110 transition-transform duration-300" />
                    <label className="absolute inset-0 bg-black/60 opacity-0 group-hover/avatar:opacity-100 flex flex-col items-center justify-center transition-opacity duration-200 text-[9px] font-mono font-bold text-white uppercase tracking-widest cursor-pointer">
                      <Upload className="w-4 h-4 mb-1 text-[#eab308]" />
                      Update
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => handlePhotoUpload(e, mentor.id)} 
                      />
                    </label>
                  </>
                )}
              </div>
              <h3 className="font-bold text-lg">{mentor.name}</h3>
              <p className="text-sm text-[#eab308] font-mono mt-1">{mentor.role}</p>
              <p className="text-xs text-white/40 mt-2 line-clamp-2">{mentor.bio}</p>
              
              <button onClick={() => handleDeleteMentor(mentor.id)} className="absolute top-4 right-4 p-2 bg-red-500/10 text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                <Trash2 className="w-4 h-4" />
              </button>
            </GlassCard>
          ))}
        </div>
      )}

      {/* Add Mentor Modal */}
      {showMentorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <GlassCard className="w-full max-w-xl p-8 border-white/10 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">Add New Instructor</h2>
            <form onSubmit={handleAddMentor} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-white/50 uppercase mb-2">Name</label>
                  <input name="name" required className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:border-[#eab308]" />
                </div>
                <div>
                  <label className="block text-xs font-mono text-white/50 uppercase mb-2">Role</label>
                  <input name="role" required className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:border-[#eab308]" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-white/50 uppercase mb-2">Institution / Company</label>
                  <input name="institution" required className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:border-[#eab308]" />
                </div>
                <div>
                  <label className="block text-xs font-mono text-white/50 uppercase mb-2">Experience</label>
                  <input name="experience" required className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:border-[#eab308]" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-white/50 uppercase mb-2 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" /> Instructor Portrait Photo
                </label>
                <div className="grid grid-cols-[112px_1fr] gap-4 items-center">
                  <div className="w-28 h-28 rounded-2xl border border-white/10 bg-white/5 relative overflow-hidden flex items-center justify-center">
                    {isUploading === 'new' ? (
                      <Loader2 className="w-6 h-6 text-[#eab308] animate-spin" />
                    ) : newMentorPhotoUrl ? (
                      <Image src={newMentorPhotoUrl} alt="Preview" fill className="object-cover" />
                    ) : (
                      <span className="text-[10px] font-mono text-white/30 text-center px-2">No Photo</span>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input 
                        name="photoUrl" 
                        value={newMentorPhotoUrl} 
                        onChange={(e) => setNewMentorPhotoUrl(e.target.value)} 
                        placeholder="Or paste direct image URL..." 
                        required 
                        className="flex-1 bg-white/5 border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:border-[#eab308] text-white/80" 
                      />
                      <label className="px-4 py-3 bg-[#eab308] text-black rounded-lg font-bold text-[10px] flex items-center gap-1.5 cursor-pointer hover:bg-[#eab308]/90 transition-colors uppercase tracking-wider shrink-0">
                        <Upload className="w-3.5 h-3.5" /> Upload File
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={(e) => handlePhotoUpload(e)} 
                        />
                      </label>
                    </div>
                    <p className="text-[10px] font-mono text-white/30">Drag-and-drop, browse files, or link directly to a CDN image.</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-white/50 uppercase mb-2">Short Bio</label>
                <textarea name="bio" rows={3} required className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:border-[#eab308]" />
              </div>

              <div className="flex justify-end gap-4 mt-8">
                <Button type="button" variant="outline" onClick={() => setShowMentorModal(false)}>Cancel</Button>
                <Button type="submit">Save Instructor</Button>
              </div>
            </form>
          </GlassCard>
        </div>
      )}

      {/* Add Course Modal */}
      {showCourseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <GlassCard className="w-full max-w-2xl p-8 border-white/10 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">Add New Course</h2>
            <form onSubmit={handleAddCourse} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-mono text-white/50 uppercase mb-2">Course Title</label>
                  <input name="title" required className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:border-[#eab308]" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-mono text-white/50 uppercase mb-2">Short Description</label>
                  <input name="shortDescription" required className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:border-[#eab308]" />
                </div>
                
                <div>
                  <label className="block text-xs font-mono text-white/50 uppercase mb-2">Price (₹)</label>
                  <input name="price" type="number" required className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:border-[#eab308]" />
                </div>
                <div>
                  <label className="block text-xs font-mono text-white/50 uppercase mb-2">Duration</label>
                  <input name="duration" placeholder="e.g. 12 Weeks" required className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:border-[#eab308]" />
                </div>
                
                <div className="col-span-2">
                  <label className="block text-xs font-mono text-white/50 uppercase mb-2">Thumbnail URL</label>
                  <input name="thumbnail" placeholder="https://..." required className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:border-[#eab308]" />
                </div>
                
                <div className="col-span-2">
                  <label className="block text-xs font-mono text-white/50 uppercase mb-2">Assign Mentors (JSON Array of Mentor IDs)</label>
                  <input name="mentors" defaultValue='["m1"]' className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm font-mono text-white/70 focus:outline-none focus:border-[#eab308]" />
                  <p className="text-[10px] text-white/40 mt-1">Available IDs: {mentors.map(m => m.id).join(', ')}</p>
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-8">
                <Button type="button" variant="outline" onClick={() => setShowCourseModal(false)}>Cancel</Button>
                <Button type="submit">Save Course</Button>
              </div>
            </form>
          </GlassCard>
        </div>
      )}

    </div>
  );
}

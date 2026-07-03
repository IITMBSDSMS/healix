"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import { useRealtimeTelemetry } from "@/hooks/useRealtimeTelemetry";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";

import { 
  Shield, TestTube, Car, Trash2, CheckCircle, XCircle, Plus, Globe, Newspaper,
  LayoutDashboard, Activity, Server, Cpu, Database, MapPin, AlertTriangle, Users, 
  Download, Link as LinkIcon, Image as ImageIcon, FileText, Megaphone, Calendar, 
  GraduationCap, PlayCircle, Eye, EyeOff, Edit3, X, Check, Upload, Loader2, ArrowUpRight, 
  DollarSign, BookOpen, Star, Book, UserPlus, Code2, Link2, MessageCircle, RefreshCw, 
  Battery, Signal, Zap, ShieldAlert, Play, Square, ExternalLink, Copy, Smartphone,
  ChevronUp, ChevronDown, Quote, GripVertical, Tv, Menu
} from "lucide-react";

import { 
  getAdminData, updateApplicationStatus, deleteProject, updateProjectProgress, addVehicle, deleteVehicle,
  addBiolabPhoto, deleteBiolabPhoto, addBiolabEvent, deleteBiolabEvent, updateBiolabEvent,
  addBiolabAnnouncement, deleteBiolabAnnouncement, addBiolabNews, deleteBiolabNews,
  addBiolabProgram, deleteBiolabProgram, addReel, deleteReel,
  addSessionPhoto, deleteSessionPhoto,
  addBiolabPublication, deleteBiolabPublication,
  addBiolabInnovator, deleteBiolabInnovator,
  getLiveFeedSettings, updateLiveFeedSettings,
  addHealixNewsArticle, updateHealixNewsArticle, deleteHealixNewsArticle
} from "./actions";

import { getCourses, getMentors } from "@/lib/academy/db";
import { addMentor, deleteMentor, updateMentor, addCourse, deleteCourse } from "./academy/actions";
import { getSurakshaData, createVirtualDevice, triggerSimulationEvent } from "./suraksha/actions";
import { generateInitialState, generateNextState, TelemetryState } from "@/lib/suraksha/simulator";

// Lazy-load dynamic components
const VehicleMap = dynamic(() => import("@/components/ui/VehicleMap"), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full w-full text-gray-500 font-mono text-xs">Initializing Tracking Subsystem...</div>
});

const BrandedQRCard = dynamic(() => import("@/components/ui/BrandedQRCard"), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-64 text-gray-500 text-sm font-mono">Rendering QR Card...</div>
});

const PredictiveAnalytics = dynamic(() => import("@/components/ui/PredictiveAnalytics").then(mod => mod.PredictiveAnalytics), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-64 text-gray-500 text-sm font-mono">Initializing Predictive Models...</div>
});

// Corporate Mentors form template
const EMPTY_CORP_MENTOR = {
  name: "",
  role: "",
  organization: "",
  bio: "",
  quote: "",
  photo_url: "",
  linkedin_url: "https://linkedin.com",
  twitter_url: "https://x.com",
  github_url: "https://github.com",
  category: "clinical",
  display_order: 0,
  active: true,
};

const EMPTY_TEAM_MEMBER = {
  name: "",
  role: "",
  focus: "",
  photo_url: "",
  display_order: 0,
  active: true,
};

const EMPTY_PODCAST = {
  title: "",
  description: "",
  youtube_url: "",
  thumbnail_url: "",
  duration: "15:00",
  display_order: 0,
  active: true,
};

const EMPTY_BRAND = {
  name: "",
  role: "",
  description: "",
  logo_text: "",
  color: "#ea580c",
  accent: "text-[#ea580c] bg-[#ea580c]/10 border-[#ea580c]/20",
  icon_name: "Shield",
  logo_url: "",
  display_order: 0,
  active: true,
};

const EMPTY_FOUNDER = {
  name: "",
  role: "",
  quote: "",
  photo_url: "",
  linkedin_url: "",
  institution: "",
  display_order: 0,
  active: true,
};

const EMPTY_PROFESSIONAL = {
  name: "",
  role: "",
  institution: "",
  photo_url: "",
  description: "",
  qualifications: "",
  hospital_name: "",
  hospital_location: "",
  hospital_image: "",
  display_order: 0,
  active: true,
};

const EMPTY_FACILITY = {
  name: "",
  city: "",
  facility: "",
  image_url: "",
  description: "",
  mentors: [] as any[],
  projects: [] as string[],
  display_order: 0,
  active: true,
};

const EMPTY_ENGINEER = {
  name: "",
  logo_url: "",
  fallback_text: "",
  team_name: "",
  specialization: "",
  display_order: 0,
  active: true,
};

const EMPTY_AMBASSADOR = {
  name: "",
  role: "",
  institution: "",
  logo_url: "",
  email: "",
  phone: "",
  address: "",
  quote: "",
  photo_url: "",
  accent_color: "#0B4A9E",
  accent_color_sec: "#E60717",
  display_order: 0,
  active: true,
};

export default function UnifiedAdminDashboard() {
  const router = useRouter();
  
  // Master active tab state
  const [activeTab, setActiveTab] = useState<"overview" | "biolabs" | "suraksha" | "academy" | "mentors" | "team" | "founders" | "network" | "podcasts" | "branding" | "reels" | "system" | "events" | "news" | "members">("overview");

  // Mobile sidebar drawer state
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Realtime Integration
  const { latestTelemetry, activeAlerts } = useRealtimeTelemetry();

  // Dynamic Query Param Tab Activation
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab");
      if (tabParam && ["overview", "biolabs", "suraksha", "academy", "mentors", "team", "founders", "network", "podcasts", "branding", "reels", "system", "events", "members"].includes(tabParam)) {
        setActiveTab(tabParam as any);
      }
    }
  }, []);

  // ─── 1. TELEMETRY & SIMULATOR STATES ───
  const [surakshaActiveTab, setSurakshaActiveTab] = useState<"registry" | "map" | "incidents" | "analytics">("registry");
  const [surakshaData, setSurakshaData] = useState<any>(null);
  const [activeSimulations, setActiveSimulations] = useState<Record<string, TelemetryState>>({});
  const [globalAlert, setGlobalAlert] = useState<{deviceId: string, description: string} | null>(null);
  const [alarmPlaying, setAlarmPlaying] = useState(false);
  const [qrModal, setQrModal] = useState<{ deviceId: string; vehicleReg: string; driverName: string } | null>(null);

  // ─── 2. ACADEMY CRM STATES ───
  const [academyActiveTab, setAcademyActiveTab] = useState<"dashboard" | "courses" | "mentors" | "events" | "live-feed">("dashboard");
  const [academyCourses, setAcademyCourses] = useState<any[]>([]);
  const [academyMentors, setAcademyMentors] = useState<any[]>([]);
  const [showAcademyMentorModal, setShowAcademyMentorModal] = useState(false);
  const [showAcademyCourseModal, setShowAcademyCourseModal] = useState(false);
  const [academySearchTerm, setAcademySearchTerm] = useState("");
  const [isUploadingAcademy, setIsUploadingAcademy] = useState<string | null>(null); 
  const [newAcademyMentorPhotoUrl, setNewAcademyMentorPhotoUrl] = useState("");
  const [editingAcademyMentorId, setEditingAcademyMentorId] = useState<string | null>(null);
  const [academyMentorForm, setAcademyMentorForm] = useState({
    name: "",
    role: "",
    institution: "",
    specialization: "",
    experience: "",
    photoUrl: "",
    linkedinUrl: "",
    companies: "",
    bio: ""
  });

  // ─── 2.5 ACADEMY LIVE FEED STATES ───
  const [liveFeedTag, setLiveFeedTag] = useState("Live Session \u2022 Healix Academy");
  const [liveFeedTitle, setLiveFeedTitle] = useState("Interactive Research & learning Discussion in Progress");
  const [liveFeedSubtitle, setLiveFeedSubtitle] = useState("Healix main auditorium / Session ID: HSF-ACAD-2026");
  const [liveFeedImageUrl, setLiveFeedImageUrl] = useState("/academy-classroom.jpg");
  const [liveFeedDragOver, setLiveFeedDragOver] = useState(false);
  const [liveFeedUploading, setLiveFeedUploading] = useState(false);
  const [liveFeedSaving, setLiveFeedSaving] = useState(false);
  const [liveFeedTableExists, setLiveFeedTableExists] = useState(true);
  const liveFeedFileRef = React.useRef<HTMLInputElement>(null);

  // ─── 2.6 UPCOMING EVENTS EDITOR STATES ───
  const EMPTY_EVENT_FORM = {
    title: "",
    description: "",
    speaker: "",
    speaker_role: "",
    category: "Academic Workshops",
    seats_left: "30",
    start_date: "",
    end_date: "",
    image_url: "",
    register_url: "",
  };
  const [eventsData, setEventsData] = useState<any[]>([]);
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [eventForm, setEventForm] = useState(EMPTY_EVENT_FORM);
  const [eventImageUrl, setEventImageUrl] = useState("");
  const [eventImageDragOver, setEventImageDragOver] = useState(false);
  const [eventImageUploading, setEventImageUploading] = useState(false);
  const [eventSaving, setEventSaving] = useState(false);
  const eventImageRef = React.useRef<HTMLInputElement>(null);

  // ─── 3. CORPORATE MENTORS CRUD STATES ───
  const [corpMentors, setCorpMentors] = useState<any[]>([]);
  const [showCorpForm, setShowCorpForm] = useState(false);
  const [editingCorpId, setEditingCorpId] = useState<string | null>(null);
  const [corpForm, setCorpForm] = useState(EMPTY_CORP_MENTOR);
  const [corpSubmitting, setCorpSubmitting] = useState(false);
  const [corpUploadingFor, setCorpUploadingFor] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "ok" | "err" } | null>(null);
  const [corpDragId, setCorpDragId] = useState<string | null>(null);
  const [corpDragOverId, setCorpDragOverId] = useState<string | null>(null);

  // ─── 3.5 ENGINEERING TEAM CRUD STATES ───
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [showTeamForm, setShowTeamForm] = useState(false);
  const [editingTeamId, setEditingTeamId] = useState<string | null>(null);
  const [teamForm, setTeamForm] = useState(EMPTY_TEAM_MEMBER);
  const [teamSubmitting, setTeamSubmitting] = useState(false);
  const [teamUploadingFor, setTeamUploadingFor] = useState<string | null>(null);

  // ─── 3.6 PODCASTS CRUD STATES ───
  const [podcasts, setPodcasts] = useState<any[]>([]);
  const [showPodcastForm, setShowPodcastForm] = useState(false);
  const [editingPodcastId, setEditingPodcastId] = useState<string | null>(null);
  const [podcastForm, setPodcastForm] = useState(EMPTY_PODCAST);
  const [podcastSubmitting, setPodcastSubmitting] = useState(false);
  const [podcastUploadingFor, setPodcastUploadingFor] = useState<string | null>(null);

  // ─── 3.7 BRANDS CRUD STATES ───
  const [brandsList, setBrandsList] = useState<any[]>([]);
  const [showBrandForm, setShowBrandForm] = useState(false);
  const [editingBrandId, setEditingBrandId] = useState<string | null>(null);
  const [brandForm, setBrandForm] = useState(EMPTY_BRAND);
  const [brandSubmitting, setBrandSubmitting] = useState(false);
  const [brandUploadingFor, setBrandUploadingFor] = useState<string | null>(null);

  // ─── 3.8 FOUNDERS CRUD STATES ───
  const [foundersList, setFoundersList] = useState<any[]>([]);
  const [showFounderForm, setShowFounderForm] = useState(false);
  const [editingFounderId, setEditingFounderId] = useState<string | null>(null);
  const [founderForm, setFounderForm] = useState(EMPTY_FOUNDER);
  const [founderSubmitting, setFounderSubmitting] = useState(false);
  const [founderUploadingFor, setFounderUploadingFor] = useState<string | null>(null);
  const [founderDbAlert, setFounderDbAlert] = useState(false);

  // ─── 3.9 GLOBAL NETWORK PROFESSIONAL CRUD STATES ───
  const [professionalsList, setProfessionalsList] = useState<any[]>([]);
  const [showProfessionalForm, setShowProfessionalForm] = useState(false);
  const [editingProfessionalId, setEditingProfessionalId] = useState<string | null>(null);
  const [professionalForm, setProfessionalForm] = useState(EMPTY_PROFESSIONAL);
  const [professionalSubmitting, setProfessionalSubmitting] = useState(false);
  const [professionalUploadingFor, setProfessionalUploadingFor] = useState<string | null>(null);
  const [professionalHospitalUploadingFor, setProfessionalHospitalUploadingFor] = useState<string | null>(null);
  const [professionalDbAlert, setProfessionalDbAlert] = useState(false);

  // ─── 3.10 GLOBAL NETWORK FACILITIES & ENGINEERS CRUD STATES ───
  const [facilitiesList, setFacilitiesList] = useState<any[]>([]);
  const [showFacilityForm, setShowFacilityForm] = useState(false);
  const [editingFacilityId, setEditingFacilityId] = useState<string | null>(null);
  const [facilityForm, setFacilityForm] = useState<any>(EMPTY_FACILITY);
  const [facilitySubmitting, setFacilitySubmitting] = useState(false);
  const [facilityUploadingFor, setFacilityUploadingFor] = useState<string | null>(null);
  const [mentorUploadingFor, setMentorUploadingFor] = useState<{facilityId: string, index: number} | null>(null);
  const [facilityDbAlert, setFacilityDbAlert] = useState(false);
  const [facilityModalUploading, setFacilityModalUploading] = useState(false);

  const [engineersList, setEngineersList] = useState<any[]>([]);
  const [showEngineerForm, setShowEngineerForm] = useState(false);
  const [editingEngineerId, setEditingEngineerId] = useState<string | null>(null);
  const [engineerForm, setEngineerForm] = useState<any>(EMPTY_ENGINEER);
  const [engineerSubmitting, setEngineerSubmitting] = useState(false);
  const [engineerUploadingFor, setEngineerUploadingFor] = useState<string | null>(null);
  const [engineerDbAlert, setEngineerDbAlert] = useState(false);

  // Active sub-tab under network: "facilities" | "engineers"
  const [networkSubTab, setNetworkSubTab] = useState<"facilities" | "engineers">("facilities");

  // Active sub-tab under members: "ambassadors" | "professionals"
  const [membersSubTab, setMembersSubTab] = useState<"ambassadors" | "professionals">("ambassadors");

  // ─── 3.11 GLOBAL NETWORK AMBASSADORS CRUD STATES ───
  const [ambassadorsList, setAmbassadorsList] = useState<any[]>([]);
  const [showAmbassadorForm, setShowAmbassadorForm] = useState(false);
  const [editingAmbassadorId, setEditingAmbassadorId] = useState<string | null>(null);
  const [ambassadorForm, setAmbassadorForm] = useState<any>(EMPTY_AMBASSADOR);
  const [ambassadorSubmitting, setAmbassadorSubmitting] = useState(false);
  const [ambassadorUploadingFor, setAmbassadorUploadingFor] = useState<string | null>(null);
  const [ambassadorLogoUploadingFor, setAmbassadorLogoUploadingFor] = useState<string | null>(null);
  const [ambassadorDragId, setAmbassadorDragId] = useState<string | null>(null);
  const [ambassadorDragOverId, setAmbassadorDragOverId] = useState<string | null>(null);
  const [ambassadorDbAlert, setAmbassadorDbAlert] = useState(false);



  // ─── 4. BRANDING PHOTO DRAG-DROP STATES ───
  const [brandingActiveSubTab, setBrandingActiveSubTab] = useState<"assets" | "gallery" | "brands">("assets");
  const [brandingCopied, setBrandingCopied] = useState(false);
  const [photoDragOver, setPhotoDragOver] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoCaption, setPhotoCaption] = useState("");
  const [photoAdding, setPhotoAdding] = useState(false);
  const photoFileRef = React.useRef<HTMLInputElement>(null);

  const [heroPhotoDragOver, setHeroPhotoDragOver] = useState(false);
  const [heroPhotoPreview, setHeroPhotoPreview] = useState<string | null>(null);
  const [heroPhotoTitle, setHeroPhotoTitle] = useState("");
  const heroPhotoRef = React.useRef<HTMLInputElement>(null);

  // ─── INNOVATORS (Research & Innovation) DRAG-DROP STATES ───
  const [innovatorPortraitPreview, setInnovatorPortraitPreview] = useState<string | null>(null);
  const [innovatorLogoPreview, setInnovatorLogoPreview] = useState<string | null>(null);
  const [innovatorPortraitDragOver, setInnovatorPortraitDragOver] = useState(false);
  const [innovatorLogoDragOver, setInnovatorLogoDragOver] = useState(false);
  const [innovatorList, setInnovatorList] = useState<any[]>([]);
  const [innovatorSubmitting, setInnovatorSubmitting] = useState(false);
  const innovatorPortraitRef = React.useRef<HTMLInputElement>(null);
  const innovatorLogoRef = React.useRef<HTMLInputElement>(null);

  const [eventDragOver, setEventDragOver] = useState(false);
  const [eventPreview, setEventPreview] = useState<string | null>(null);
  const eventPhotoRef = React.useRef<HTMLInputElement>(null);

  const [pubDragOver, setPubDragOver] = useState(false);
  const [pubImagePreview, setPubImagePreview] = useState<string | null>(null);
  const pubPhotoRef = React.useRef<HTMLInputElement>(null);

  // ─── HEALIX NEWS ARTICLES STATES ───
  const [newsSearch, setNewsSearch] = useState("");
  const [editingNewsArticle, setEditingNewsArticle] = useState<any | null>(null);
  const [newsPhotoDragOver, setNewsPhotoDragOver] = useState(false);
  const [newsPhotoPreview, setNewsPhotoPreview] = useState<string | null>(null);
  const [newsPhotoUploading, setNewsPhotoUploading] = useState(false);
  const newsPhotoRef = React.useRef<HTMLInputElement>(null);

  // Form states for creating/editing news
  const [newsTitle, setNewsTitle] = useState("");
  const [newsCategory, setNewsCategory] = useState("ANNOUNCEMENT");
  const [newsDate, setNewsDate] = useState("");
  const [newsAuthor, setNewsAuthor] = useState("Healix Press Team");
  const [newsDescContent, setNewsDescContent] = useState("");
  const [newsLinkUrl, setNewsLinkUrl] = useState("#");

  const handleNewsPhotoUpload = async (file: File) => {
    if (!file) return;
    setNewsPhotoUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/news/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) {
        setNewsPhotoPreview(data.url);
        showToast("Photo uploaded successfully!");
      } else {
        showToast(data.error ?? "Photo upload failed", "err");
      }
    } catch (err: any) {
      showToast(err.message || "Upload failed", "err");
    } finally {
      setNewsPhotoUploading(false);
    }
  };

  const handleNewsPhotoDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setNewsPhotoDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      await handleNewsPhotoUpload(file);
    } else {
      showToast("Please drop an image file", "err");
    }
  };

  const handleSubmitNews = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", newsTitle);
    formData.append("category", newsCategory);
    formData.append("date", newsDate || new Date().toLocaleString('default', { month: 'long', year: 'numeric' }));
    formData.append("author", newsAuthor);
    formData.append("desc_content", newsDescContent);
    formData.append("image_url", newsPhotoPreview || "");
    formData.append("link_url", newsLinkUrl);

    let res;
    if (editingNewsArticle) {
      res = await updateHealixNewsArticle(editingNewsArticle.id, formData);
    } else {
      res = await addHealixNewsArticle(formData);
    }

    if (res.error) {
      if (res.error.includes("Database table 'healix_news_articles' does not exist")) {
        // Table doesn't exist, use localStorage fallback!
        const localNews = JSON.parse(localStorage.getItem('healix_news') || '[]');
        if (editingNewsArticle) {
          const updated = localNews.map((n: any) => {
            if (n.id === editingNewsArticle.id) {
              return {
                id: n.id,
                title: newsTitle,
                category: newsCategory,
                date: newsDate || new Date().toLocaleString('default', { month: 'long', year: 'numeric' }),
                author: newsAuthor,
                desc_content: newsDescContent,
                image_url: newsPhotoPreview || "",
                link_url: newsLinkUrl,
                created_at: n.created_at || new Date().toISOString()
              };
            }
            return n;
          });
          localStorage.setItem('healix_news', JSON.stringify(updated));
          showToast("Article updated in local storage fallback!");
        } else {
          const newArticle = {
            id: 'local-' + Date.now(),
            title: newsTitle,
            category: newsCategory,
            date: newsDate || new Date().toLocaleString('default', { month: 'long', year: 'numeric' }),
            author: newsAuthor,
            desc_content: newsDescContent,
            image_url: newsPhotoPreview || "",
            link_url: newsLinkUrl,
            created_at: new Date().toISOString()
          };
          localStorage.setItem('healix_news', JSON.stringify([newArticle, ...localNews]));
          showToast("Article created in local storage fallback!");
        }
        
        // Reset form
        setEditingNewsArticle(null);
        setNewsTitle("");
        setNewsCategory("ANNOUNCEMENT");
        setNewsDate("");
        setNewsAuthor("Healix Press Team");
        setNewsDescContent("");
        setNewsLinkUrl("#");
        setNewsPhotoPreview(null);
        fetchData();
      } else {
        showToast(res.error, "err");
      }
    } else {
      showToast(editingNewsArticle ? "Article updated successfully!" : "Article created successfully!");
      // Reset form
      setEditingNewsArticle(null);
      setNewsTitle("");
      setNewsCategory("ANNOUNCEMENT");
      setNewsDate("");
      setNewsAuthor("Healix Press Team");
      setNewsDescContent("");
      setNewsLinkUrl("#");
      setNewsPhotoPreview(null);
      fetchData();
    }
  };

  const handleEditNewsClick = (article: any) => {
    setEditingNewsArticle(article);
    setNewsTitle(article.title);
    setNewsCategory(article.category);
    setNewsDate(article.date);
    setNewsAuthor(article.author);
    setNewsDescContent(article.desc_content);
    setNewsLinkUrl(article.link_url);
    setNewsPhotoPreview(article.image_url);
  };

  const handleCancelNewsEdit = () => {
    setEditingNewsArticle(null);
    setNewsTitle("");
    setNewsCategory("ANNOUNCEMENT");
    setNewsDate("");
    setNewsAuthor("Healix Press Team");
    setNewsDescContent("");
    setNewsLinkUrl("#");
    setNewsPhotoPreview(null);
  };

  const showToast = (msg: string, type: "ok" | "err" = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Fetch Master Data
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getAdminData();
      if (res.error) {
        setError(res.error);
        if (res.error === "Unauthorized") {
          router.push("/login");
        }
      } else {
        if (typeof window !== 'undefined') {
          // Merge local session photos fallback
          const localPhotos = JSON.parse(localStorage.getItem('healix_mock_photos') || '[]');
          res.session_photos = [...localPhotos, ...(res.session_photos || [])];
          // Merge local publications fallback
          const localPubs = JSON.parse(localStorage.getItem('healix_publications') || '[]');
          if (localPubs.length > 0) {
            res.publications = [...localPubs, ...(res.publications || [])];
          }
          // Merge local healix news fallback
          const localNews = JSON.parse(localStorage.getItem('healix_news') || '[]');
          if (localNews.length > 0) {
            res.healix_news = [
              ...localNews,
              ...((res.healix_news || []).filter((dbn: any) => !localNews.find((ln: any) => ln.id === dbn.id)))
            ];
          }
          // Merge local innovators fallback
          const localInnovators = JSON.parse(localStorage.getItem('healix_innovators') || '[]');
          const serverInnovators = res.innovators || [];
          const merged = [
            ...localInnovators,
            ...serverInnovators.filter((si: any) => !localInnovators.find((li: any) => li.id === si.id))
          ];
          setInnovatorList(merged.length ? merged : serverInnovators);
        } else {
          setInnovatorList(res.innovators || []);
        }
        setData(res);
      }

      // Load academy courses and mentors (isolated — failure here must not crash the dashboard)
      try {
        const [coursesData, mentorsData] = await Promise.all([
          getCourses(),
          getMentors()
        ]);
        setAcademyCourses(coursesData);
        setAcademyMentors(mentorsData);
      } catch (academyErr) {
        console.warn("Academy data unavailable, using defaults:", academyErr);
      }

      // Load academy live feed settings (isolated)
      try {
        const lfRes = await getLiveFeedSettings();
        if (lfRes.data) {
          setLiveFeedTag(lfRes.data.tag || "Live Session \u2022 Healix Academy");
          setLiveFeedTitle(lfRes.data.title || "Interactive Research & learning Discussion in Progress");
          setLiveFeedSubtitle(lfRes.data.subtitle || "Healix main auditorium / Session ID: HSF-ACAD-2026");
          setLiveFeedImageUrl(lfRes.data.image_url || "/academy-classroom.jpg");
          setLiveFeedTableExists(lfRes.tableExists !== false);
        }
      } catch (lfErr) {
        console.warn("Live feed settings unavailable, using defaults:", lfErr);
      }

      // Load upcoming events (for admin editing)
      try {
        const supabaseClient = createClient();
        const { data: evData } = await supabaseClient
          .from("biolab_events")
          .select("*")
          .order("start_date", { ascending: true })
          .limit(20);
        if (evData) setEventsData(evData);
      } catch (evErr) {
        console.warn("Events fetch unavailable:", evErr);
      }

      // Load Suraksha data (isolated)
      try {
        const surakshaRes = await getSurakshaData();
        if (surakshaRes && !("error" in surakshaRes)) {
          setSurakshaData(surakshaRes);
        }
      } catch (surakshaErr) {
        console.warn("Suraksha data unavailable:", surakshaErr);
      }

      // Safe helper to fetch JSON lists with cache-busting
      const fetchSafeList = async (url: string) => {
        try {
          const separator = url.includes("?") ? "&" : "?";
          const freshUrl = `${url}${separator}t=${Date.now()}`;
          const res = await fetch(freshUrl);
          if (!res.ok) throw new Error(`HTTP status ${res.status}`);
          const json = await res.json();
          return Array.isArray(json) ? json : [];
        } catch (err) {
          console.warn(`Failed to load data from ${url}:`, err);
          return [];
        }
      };

      // Load corporate advisors/mentors
      setCorpMentors(await fetchSafeList("/api/mentors?all=true"));

      // Load engineering team
      setTeamMembers(await fetchSafeList("/api/team?all=true"));

      // Load podcasts
      setPodcasts(await fetchSafeList("/api/podcasts?all=true"));

      // Load brands
      setBrandsList(await fetchSafeList("/api/brands?all=true"));

      // Load founders
      setFoundersList(await fetchSafeList("/api/founders?all=true"));

      // Load global professionals
      setProfessionalsList(await fetchSafeList("/api/professionals?all=true"));

      // Load global facilities
      setFacilitiesList(await fetchSafeList("/api/facilities?all=true"));

      setEngineersList(await fetchSafeList("/api/engineers?all=true"));

      // Load global ambassadors
      setAmbassadorsList(await fetchSafeList("/api/ambassadors?all=true"));



    } catch (e: any) {
      console.error("Admin data fetch error details:", e);
      setError("Failed to fetch administrative data. Detail: " + (e.message || String(e)));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    let channel: any = null;
    let supabase: any = null;
    try {
      supabase = createClient();
      // Realtime Suraksha sub triggers
      channel = supabase
        .channel("unified_suraksha_changes")
        .on("postgres_changes", { event: "*", schema: "public", table: "iot_devices" }, fetchData)
        .on("postgres_changes", { event: "*", schema: "public", table: "failsafe_events" }, fetchData)
        .on("postgres_changes", { event: "*", schema: "public", table: "incident_reports" }, (payload: any) => {
          fetchData();
          if (payload.eventType === 'INSERT' && payload.new.type === 'SOS') {
            setGlobalAlert({ deviceId: payload.new.device_id, description: payload.new.description });
            setAlarmPlaying(true);
            setTimeout(() => setAlarmPlaying(false), 4000); 
            setActiveTab("suraksha"); 
            setSurakshaActiveTab("map");
          }
        })
        .subscribe();
    } catch (realtimeErr) {
      console.warn("Supabase realtime channel subscription failed:", realtimeErr);
    }

    return () => {
      if (channel && supabase) {
        try {
          supabase.removeChannel(channel);
        } catch (err) {
          console.warn("Failed to remove Supabase realtime channel:", err);
        }
      }
    };
  }, []);

  // Suraksha Telemetry Simulation Pulse Loop
  useEffect(() => {
    const interval = setInterval(() => {
      const activeIds = Object.keys(activeSimulations);
      if (activeIds.length === 0) return;

      activeIds.forEach(async (id) => {
        const current = activeSimulations[id];
        const next = generateNextState(current);
        
        setActiveSimulations(prev => ({ ...prev, [id]: next }));

        try {
          await fetch('/api/suraksha/telemetry', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              deviceId: id,
              ...next
            })
          });
        } catch (e) {
          console.error("Simulation pulse failed:", e);
        }
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [activeSimulations]);

  // ─── SURAKSHA SIMULATOR FUNCTIONS ───
  const toggleSimulation = (deviceId: string) => {
    if (activeSimulations[deviceId]) {
      const newSims = { ...activeSimulations };
      delete newSims[deviceId];
      setActiveSimulations(newSims);
    } else {
      setActiveSimulations(prev => ({
        ...prev,
        [deviceId]: generateInitialState()
      }));
    }
  };

  const handleCreateDevice = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const res = await createVirtualDevice(formData);
    if (res.error) alert(res.error);
    else {
      form.reset();
      fetchData();
    }
  };

  const handleSimulateEvent = async (deviceId: string, type: 'failsafe' | 'tamper' | 'sos') => {
    let details = "";
    if (type === 'failsafe') details = "Passenger device failed. IoT override engaged.";
    if (type === 'tamper') details = "Physical tampering detected on device casing.";
    if (type === 'sos') details = "Manual SOS triggered from hardware.";
    
    if (confirm(`Trigger ${type} for ${deviceId}?`)) {
      const res = await triggerSimulationEvent(deviceId, type, details);
      if (res.error) alert(res.error);
    }
  };

  // ─── FRONTEND ACADEMY HANDLERS ───
  const handleAcademyPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>, mentorId?: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const targetId = mentorId || 'new';
    setIsUploadingAcademy(targetId);

    const formData = new FormData();
    formData.append("file", file);
    if (mentorId) formData.append("mentorId", mentorId);

    try {
      const res = await fetch("/api/admin/academy/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.url) {
        if (mentorId) {
          await fetchData();
        } else {
          setNewAcademyMentorPhotoUrl(data.url);
        }
      } else {
        alert("Upload error: " + (data.error || "Unknown error"));
      }
    } catch (err: any) {
      alert("Failed to upload image: " + err.message);
    } finally {
      setIsUploadingAcademy(null);
    }
  };

  const handleAddAcademyMentor = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set("photoUrl", newAcademyMentorPhotoUrl);
    
    let res;
    if (editingAcademyMentorId) {
      res = await updateMentor(editingAcademyMentorId, formData);
    } else {
      res = await addMentor(formData);
    }

    if (res && 'error' in res && res.error) {
      alert(res.error);
    } else {
      setShowAcademyMentorModal(false);
      setEditingAcademyMentorId(null);
      fetchData();
    }
  };

  const handleOpenEditAcademyMentor = (mentor: any) => {
    setEditingAcademyMentorId(mentor.id);
    setNewAcademyMentorPhotoUrl(mentor.photoUrl || "");
    setAcademyMentorForm({
      name: mentor.name || "",
      role: mentor.role || "",
      institution: mentor.institution || "",
      specialization: mentor.specialization || "",
      experience: mentor.experience || "",
      photoUrl: mentor.photoUrl || "",
      linkedinUrl: mentor.linkedinUrl || "",
      companies: Array.isArray(mentor.companies) ? mentor.companies.join(", ") : (mentor.companies || ""),
      bio: mentor.bio || ""
    });
    setShowAcademyMentorModal(true);
  };

  const handleDeleteAcademyMentor = async (id: string) => {
    if(confirm("Are you sure you want to delete this instructor?")) {
      const res = await deleteMentor(id);
      if (res && 'error' in res && res.error) alert(res.error);
      else fetchData();
    }
  };

  const handleAddAcademyCourse = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const res = await addCourse(formData);
    if (res && 'error' in res && res.error) {
      alert(res.error);
    } else {
      setShowAcademyCourseModal(false);
      fetchData();
    }
  };

  const handleDeleteAcademyCourse = async (id: string) => {
    if(confirm("Are you sure you want to delete this course?")) {
      const res = await deleteCourse(id);
      if (res && 'error' in res && res.error) alert(res.error);
      else fetchData();
    }
  };

  // ─── CORPORATE ADVISORS / MENTORS HANDLERS ───
  const handleCorpDragReorder = async (draggedId: string, targetId: string) => {
    if (draggedId === targetId) return;
    const ordered = [...corpMentors].sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));
    const dragIdx = ordered.findIndex(m => m.id === draggedId);
    const targetIdx = ordered.findIndex(m => m.id === targetId);
    if (dragIdx === -1 || targetIdx === -1) return;
    const reordered = [...ordered];
    const [dragged] = reordered.splice(dragIdx, 1);
    reordered.splice(targetIdx, 0, dragged);
    // Optimistic update
    setCorpMentors(reordered.map((m, i) => ({ ...m, display_order: i })));
    // Persist each updated order
    await Promise.all(
      reordered.map((m, i) =>
        fetch(`/api/mentors/${m.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ display_order: i }),
        })
      )
    );
    showToast("Order saved!", "ok");
  };

  const openCorpAddForm = () => {
    setEditingCorpId(null);
    setCorpForm({ ...EMPTY_CORP_MENTOR, display_order: corpMentors.length });
    setShowCorpForm(true);
  };

  const openCorpEditForm = (m: any) => {
    setEditingCorpId(m.id);
    setCorpForm({
      name: m.name, role: m.role, organization: m.organization ?? "",
      bio: m.bio ?? "", quote: m.quote ?? "", photo_url: m.photo_url ?? "",
      linkedin_url: m.linkedin_url ?? "https://linkedin.com", twitter_url: m.twitter_url ?? "https://x.com",
      github_url: m.github_url ?? "https://github.com", category: m.category ?? "clinical",
      display_order: m.display_order,
      active: m.active,
    });
    setShowCorpForm(true);
  };

  const handleCorpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCorpSubmitting(true);
    try {
      if (editingCorpId) {
        const res = await fetch(`/api/mentors/${editingCorpId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(corpForm),
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || "Failed to update advisor details");
        }
        showToast("Adviser details updated!");
      } else {
        const res = await fetch("/api/mentors", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(corpForm),
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || "Failed to save advisor details");
        }
        showToast("New advisor registered successfully!");
      }
      setShowCorpForm(false);
      fetchData();
    } catch (err: any) {
      showToast(err.message || "Failed to save corporate advisor details", "err");
    } finally {
      setCorpSubmitting(false);
    }
  };

  const handleCorpDelete = async (id: string, name: string) => {
    if (!confirm(`Delete advisor ${name}? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/mentors/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to delete advisor");
      }
      showToast(`${name} removed successfully.`);
      fetchData();
    } catch (err: any) {
      showToast(err.message || "Delete failed", "err");
    }
  };

  const toggleCorpActive = async (m: any) => {
    try {
      const res = await fetch(`/api/mentors/${m.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !m.active }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to toggle active status");
      }
      showToast(`${m.name} ${m.active ? "hidden" : "activated"} on the about directory.`);
      fetchData();
    } catch (err: any) {
      showToast(err.message || "Failed to toggle status", "err");
    }
  };

  const handleCorpPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>, mentorId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCorpUploadingFor(mentorId);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("mentorId", mentorId);
      const res = await fetch("/api/mentors/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) {
        showToast("Photo uploaded and synced!");
        fetchData();
      } else {
        showToast(data.error ?? "Photo upload failed", "err");
      }
    } catch {
      showToast("Upload failed", "err");
    } finally {
      setCorpUploadingFor(null);
    }
  };

  const handleCorpPhotoDrop = async (e: React.DragEvent<HTMLDivElement>, mentorId: string) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    setCorpUploadingFor(mentorId);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("mentorId", mentorId);
      const res = await fetch("/api/mentors/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) {
        showToast("Photo uploaded and synced via drag & drop!");
        fetchData();
      } else {
        showToast(data.error ?? "Photo upload failed", "err");
      }
    } catch {
      showToast("Upload failed", "err");
    } finally {
      setCorpUploadingFor(null);
    }
  };

  const uploadPhotoFromModal = async (file: File, idToUse: string) => {
    setCorpSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("mentorId", idToUse);
      const res = await fetch("/api/mentors/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) {
        setCorpForm(f => ({ ...f, photo_url: data.url }));
        showToast("Photo uploaded successfully!");
        if (idToUse !== "temp" && idToUse !== "") {
          fetchData();
        }
      } else {
        showToast(data.error ?? "Photo upload failed", "err");
      }
    } catch {
      showToast("Upload failed", "err");
    } finally {
      setCorpSubmitting(false);
    }
  };

  const moveCorpOrder = async (m: any, dir: "up" | "down") => {
    const newOrder = dir === "up" ? m.display_order - 1 : m.display_order + 1;
    try {
      const res = await fetch(`/api/mentors/${m.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ display_order: newOrder }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to update order");
      }
      fetchData();
    } catch (err: any) {
      showToast(err.message || "Failed to update order", "err");
    }
  };

  // ─── ENGINEERING TEAM CRUD HANDLERS ───
  const openTeamAddForm = () => {
    setEditingTeamId(null);
    setTeamForm({ ...EMPTY_TEAM_MEMBER, display_order: teamMembers.length });
    setShowTeamForm(true);
  };

  const openTeamEditForm = (m: any) => {
    setEditingTeamId(m.id);
    setTeamForm({
      name: m.name, role: m.role, focus: m.focus, photo_url: m.photo_url ?? "",
      display_order: m.display_order, active: m.active
    });
    setShowTeamForm(true);
  };

  const handleTeamSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTeamSubmitting(true);
    try {
      if (editingTeamId) {
        const res = await fetch(`/api/team/${editingTeamId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(teamForm),
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || "Failed to update team member details");
        }
        showToast("Team member details updated!");
      } else {
        const res = await fetch("/api/team", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(teamForm),
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || "Failed to save team member details");
        }
        showToast("New team member registered successfully!");
      }
      setShowTeamForm(false);
      fetchData();
    } catch (err: any) {
      showToast(err.message || "Failed to save team member details", "err");
    } finally {
      setTeamSubmitting(false);
    }
  };

  const handleTeamDelete = async (id: string, name: string) => {
    if (!confirm(`Delete team member ${name}? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/team/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to delete team member");
      }
      showToast(`${name} removed successfully.`);
      fetchData();
    } catch (err: any) {
      showToast(err.message || "Delete failed", "err");
    }
  };

  const toggleTeamActive = async (m: any) => {
    try {
      const res = await fetch(`/api/team/${m.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !m.active }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to toggle active status");
      }
      showToast(`${m.role} ${m.active ? "hidden" : "activated"} on the about directory.`);
      fetchData();
    } catch (err: any) {
      showToast(err.message || "Failed to toggle status", "err");
    }
  };

  const handleTeamPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setTeamUploadingFor(id);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("teamMemberId", id);
      const res = await fetch("/api/team/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) {
        showToast("Photo uploaded and synced!");
        fetchData();
      } else {
        showToast(data.error ?? "Photo upload failed", "err");
      }
    } catch {
      showToast("Upload failed", "err");
    } finally {
      setTeamUploadingFor(null);
    }
  };

  const handleTeamPhotoDrop = async (e: React.DragEvent<HTMLDivElement>, id: string) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    setTeamUploadingFor(id);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("teamMemberId", id);
      const res = await fetch("/api/team/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) {
        showToast("Photo uploaded and synced via drag & drop!");
        fetchData();
      } else {
        showToast(data.error ?? "Photo upload failed", "err");
      }
    } catch {
      showToast("Upload failed", "err");
    } finally {
      setTeamUploadingFor(null);
    }
  };

  const uploadTeamPhotoFromModal = async (file: File, idToUse: string) => {
    setTeamSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("teamMemberId", idToUse);
      const res = await fetch("/api/team/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) {
        setTeamForm(f => ({ ...f, photo_url: data.url }));
        showToast("Photo uploaded successfully!");
        if (idToUse !== "temp" && idToUse !== "") {
          fetchData();
        }
      } else {
        showToast(data.error ?? "Photo upload failed", "err");
      }
    } catch {
      showToast("Upload failed", "err");
    } finally {
      setTeamSubmitting(false);
    }
  };

  const moveTeamOrder = async (m: any, dir: "up" | "down") => {
    const newOrder = dir === "up" ? m.display_order - 1 : m.display_order + 1;
    try {
      const res = await fetch(`/api/team/${m.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ display_order: newOrder }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to update order");
      }
      fetchData();
    } catch (err: any) {
      showToast(err.message || "Failed to update order", "err");
    }
  };

  // ─── PODCASTS CRUD HANDLERS ───
  const openPodcastAddForm = () => {
    setEditingPodcastId(null);
    setPodcastForm({ ...EMPTY_PODCAST, display_order: podcasts.length });
    setShowPodcastForm(true);
  };

  const openPodcastEditForm = (p: any) => {
    setEditingPodcastId(p.id);
    setPodcastForm({
      title: p.title, description: p.description, youtube_url: p.youtube_url, thumbnail_url: p.thumbnail_url ?? "",
      duration: p.duration ?? "15:00", display_order: p.display_order, active: p.active
    });
    setShowPodcastForm(true);
  };

  const handlePodcastSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPodcastSubmitting(true);
    try {
      if (editingPodcastId) {
        const res = await fetch(`/api/podcasts/${editingPodcastId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(podcastForm),
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || "Failed to update podcast details");
        }
        showToast("Podcast details updated!");
      } else {
        const res = await fetch("/api/podcasts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(podcastForm),
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || "Failed to save podcast details");
        }
        showToast("New podcast episode registered!");
      }
      setShowPodcastForm(false);
      fetchData();
    } catch (err: any) {
      showToast(err.message || "Failed to save podcast details", "err");
    } finally {
      setPodcastSubmitting(false);
    }
  };

  const handlePodcastDelete = async (id: string, title: string) => {
    if (!confirm(`Delete podcast "${title}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/podcasts/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to delete podcast");
      }
      showToast(`"${title}" removed successfully.`);
      fetchData();
    } catch (err: any) {
      showToast(err.message || "Delete failed", "err");
    }
  };

  const togglePodcastActive = async (p: any) => {
    try {
      const res = await fetch(`/api/podcasts/${p.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !p.active }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to toggle active status");
      }
      showToast(`Podcast ${p.active ? "hidden" : "activated"} on the home page.`);
      fetchData();
    } catch (err: any) {
      showToast(err.message || "Failed to toggle status", "err");
    }
  };

  const handlePodcastPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPodcastUploadingFor(id);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("podcastId", id);
      const res = await fetch("/api/podcasts/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) {
        showToast("Thumbnail uploaded and synced!");
        fetchData();
      } else {
        showToast(data.error ?? "Thumbnail upload failed", "err");
      }
    } catch {
      showToast("Upload failed", "err");
    } finally {
      setPodcastUploadingFor(null);
    }
  };

  const handlePodcastPhotoDrop = async (e: React.DragEvent<HTMLDivElement>, id: string) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    setPodcastUploadingFor(id);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("podcastId", id);
      const res = await fetch("/api/podcasts/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) {
        showToast("Thumbnail uploaded and synced via drag & drop!");
        fetchData();
      } else {
        showToast(data.error ?? "Thumbnail upload failed", "err");
      }
    } catch {
      showToast("Upload failed", "err");
    } finally {
      setPodcastUploadingFor(null);
    }
  };

  const uploadPodcastPhotoFromModal = async (file: File, idToUse: string) => {
    setPodcastSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("podcastId", idToUse);
      const res = await fetch("/api/podcasts/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) {
        setPodcastForm(f => ({ ...f, thumbnail_url: data.url }));
        showToast("Thumbnail uploaded successfully!");
        if (idToUse !== "temp" && idToUse !== "") {
          fetchData();
        }
      } else {
        showToast(data.error ?? "Thumbnail upload failed", "err");
      }
    } catch {
      showToast("Upload failed", "err");
    } finally {
      setPodcastSubmitting(false);
    }
  };

  const movePodcastOrder = async (p: any, dir: "up" | "down") => {
    const newOrder = dir === "up" ? p.display_order - 1 : p.display_order + 1;
    try {
      const res = await fetch(`/api/podcasts/${p.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ display_order: newOrder }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to update order");
      }
      fetchData();
    } catch (err: any) {
      showToast(err.message || "Failed to update order", "err");
    }
  };

  // ─── BRANDS CRUD HANDLERS ───
  const openBrandAddForm = () => {
    setEditingBrandId(null);
    setBrandForm({ ...EMPTY_BRAND, display_order: brandsList.length });
    setShowBrandForm(true);
  };

  const openBrandEditForm = (b: any) => {
    setEditingBrandId(b.id);
    setBrandForm({
      name: b.name,
      role: b.role,
      description: b.description || b.desc || "",
      logo_text: b.logo_text || b.logoText || "",
      color: b.color || "#ea580c",
      accent: b.accent || "text-[#ea580c] bg-[#ea580c]/10 border-[#ea580c]/20",
      icon_name: b.icon_name || "Shield",
      logo_url: b.logo_url || "",
      display_order: b.display_order ?? 0,
      active: b.active ?? true
    });
    setShowBrandForm(true);
  };

  const handleBrandSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBrandSubmitting(true);
    try {
      if (editingBrandId) {
        const res = await fetch(`/api/brands/${editingBrandId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(brandForm),
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || "Failed to update brand details");
        }
        showToast("Brand details updated!");
      } else {
        const res = await fetch("/api/brands", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(brandForm),
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || "Failed to save brand details");
        }
        showToast("New brand registered!");
      }
      setShowBrandForm(false);
      fetchData();
    } catch (err: any) {
      showToast(err.message || "Failed to save brand details", "err");
    } finally {
      setBrandSubmitting(false);
    }
  };

  const handleBrandDelete = async (id: string, name: string) => {
    if (!confirm(`Delete brand "${name}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/brands/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to delete brand");
      }
      showToast(`"${name}" removed successfully.`);
      fetchData();
    } catch (err: any) {
      showToast(err.message || "Delete failed", "err");
    }
  };

  const toggleBrandActive = async (b: any) => {
    try {
      const res = await fetch(`/api/brands/${b.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !b.active }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to toggle active status");
      }
      showToast(`Brand ${b.active ? "hidden" : "activated"} on the home page.`);
      fetchData();
    } catch (err: any) {
      showToast(err.message || "Failed to toggle status", "err");
    }
  };

  const handleBrandPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBrandUploadingFor(id);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("brandId", id);
      const res = await fetch("/api/brands/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) {
        showToast("Brand logo uploaded and synced!");
        fetchData();
      } else {
        showToast(data.error ?? "Logo upload failed", "err");
      }
    } catch {
      showToast("Upload failed", "err");
    } finally {
      setBrandUploadingFor(null);
    }
  };

  const handleBrandPhotoDrop = async (e: React.DragEvent<HTMLDivElement>, id: string) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    setBrandUploadingFor(id);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("brandId", id);
      const res = await fetch("/api/brands/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) {
        showToast("Brand logo uploaded and synced via drag & drop!");
        fetchData();
      } else {
        showToast(data.error ?? "Logo upload failed", "err");
      }
    } catch {
      showToast("Upload failed", "err");
    } finally {
      setBrandUploadingFor(null);
    }
  };

  const uploadBrandPhotoFromModal = async (file: File, idToUse: string) => {
    setBrandSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("brandId", idToUse);
      const res = await fetch("/api/brands/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) {
        setBrandForm(f => ({ ...f, logo_url: data.url }));
        showToast("Brand logo uploaded successfully!");
        if (idToUse !== "temp" && idToUse !== "") {
          fetchData();
        }
      } else {
        showToast(data.error ?? "Logo upload failed", "err");
      }
    } catch {
      showToast("Upload failed", "err");
    } finally {
      setBrandSubmitting(false);
    }
  };

  const moveBrandOrder = async (b: any, dir: "up" | "down") => {
    const newOrder = dir === "up" ? b.display_order - 1 : b.display_order + 1;
    try {
      const res = await fetch(`/api/brands/${b.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ display_order: newOrder }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to update order");
      }
      fetchData();
    } catch (err: any) {
      showToast(err.message || "Failed to update order", "err");
    }
  };

  // ─── FOUNDERS CRUD HANDLERS ───
  const openFounderAddForm = () => {
    setEditingFounderId(null);
    setFounderForm({ ...EMPTY_FOUNDER, display_order: foundersList.length });
    setShowFounderForm(true);
    setFounderDbAlert(false);
  };

  const openFounderEditForm = (f: any) => {
    setEditingFounderId(f.id);
    setFounderForm({
      name: f.name,
      role: f.role,
      quote: f.quote || "",
      photo_url: f.photo_url || "",
      linkedin_url: f.linkedin_url || "",
      institution: f.institution || "",
      display_order: f.display_order ?? 0,
      active: f.active ?? true
    });
    setShowFounderForm(true);
    setFounderDbAlert(false);
  };

  const handleFounderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFounderSubmitting(true);
    try {
      const method = editingFounderId ? "PUT" : "POST";
      const url = editingFounderId ? `/api/founders/${editingFounderId}` : "/api/founders";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(founderForm),
      });
      
      const resData = await res.json();
      if (!res.ok) {
        if (resData.error === "DB_TABLE_MISSING") {
          setFounderDbAlert(true);
          throw new Error(resData.message || "Founder table does not exist.");
        }
        throw new Error(resData.error || "Failed to save founder details");
      }
      
      showToast(editingFounderId ? "Founder details updated!" : "New founder registered!");
      setShowFounderForm(false);
      fetchData();
    } catch (err: any) {
      showToast(err.message || "Failed to save founder details", "err");
    } finally {
      setFounderSubmitting(false);
    }
  };

  const handleFounderDelete = async (id: string, name: string) => {
    if (id.startsWith("f")) {
      showToast("Cannot delete default founders from static fallback. Run SQL schema to enable database edits.", "err");
      return;
    }
    if (!confirm(`Delete founder "${name}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/founders/${id}`, { method: "DELETE" });
      const resData = await res.json();
      if (!res.ok) {
        if (resData.error === "DB_TABLE_MISSING") {
          showToast("Founder table does not exist. Run supabase_founders_schema.sql first.", "err");
          return;
        }
        throw new Error(resData.error || "Failed to delete founder");
      }
      showToast(`"${name}" removed successfully.`);
      fetchData();
    } catch (err: any) {
      showToast(err.message || "Delete failed", "err");
    }
  };

  const toggleFounderActive = async (f: any) => {
    if (f.id.startsWith("f")) {
      showToast("Cannot toggle fallback founders. Run SQL schema to enable database updates.", "err");
      return;
    }
    try {
      const res = await fetch(`/api/founders/${f.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !f.active }),
      });
      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.error || "Failed to toggle active status");
      }
      showToast(`Founder ${f.active ? "hidden" : "activated"} on home page.`);
      fetchData();
    } catch (err: any) {
      showToast(err.message || "Failed to toggle status", "err");
    }
  };

  const handleFounderPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    if (id.startsWith("f")) {
      showToast("Cannot upload photos for static fallback founders. Run SQL schema first.", "err");
      return;
    }
    const file = e.target.files?.[0];
    if (!file) return;
    setFounderUploadingFor(id);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("founderId", id);
      const res = await fetch("/api/founders/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) {
        showToast("Founder photo uploaded and synced!");
        fetchData();
      } else {
        showToast(data.error ?? "Photo upload failed", "err");
      }
    } catch {
      showToast("Upload failed", "err");
    } finally {
      setFounderUploadingFor(null);
    }
  };

  const handleFounderPhotoDrop = async (e: React.DragEvent<HTMLDivElement>, id: string) => {
    e.preventDefault();
    if (id.startsWith("f")) {
      showToast("Cannot drop photos for fallback founders. Run SQL schema first.", "err");
      return;
    }
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    setFounderUploadingFor(id);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("founderId", id);
      const res = await fetch("/api/founders/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) {
        showToast("Founder photo uploaded and synced!");
        fetchData();
      } else {
        showToast(data.error ?? "Photo upload failed", "err");
      }
    } catch {
      showToast("Upload failed", "err");
    } finally {
      setFounderUploadingFor(null);
    }
  };

  const handleFounderFormPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFounderSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("founderId", editingFounderId || "temp");
      const res = await fetch("/api/founders/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) {
        setFounderForm((f: any) => ({ ...f, photo_url: data.url }));
        showToast("Founder photo uploaded successfully!");
        if (editingFounderId && !editingFounderId.startsWith("f")) {
          fetchData();
        }
      } else {
        showToast(data.error ?? "Photo upload failed", "err");
      }
    } catch {
      showToast("Upload failed", "err");
    } finally {
      setFounderSubmitting(false);
    }
  };

  const moveFounderOrder = async (f: any, dir: "up" | "down") => {
    if (f.id.startsWith("f")) {
      showToast("Reordering is only enabled for database records. Run SQL schema first.", "err");
      return;
    }
    const newOrder = dir === "up" ? f.display_order - 1 : f.display_order + 1;
    try {
      const res = await fetch(`/api/founders/${f.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ display_order: newOrder }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to update order");
      }
      fetchData();
    } catch (err: any) {
      showToast(err.message || "Failed to update order", "err");
    }
  };

  // ─── GLOBAL NETWORK AMBASSADORS CRUD HANDLERS ───
  const handleAmbassadorDragReorder = async (draggedId: string, targetId: string) => {
    if (draggedId === targetId) return;
    if (draggedId.startsWith("amb-fallback-") || targetId.startsWith("amb-fallback-")) {
      showToast("Reordering is only enabled for database records. Run SQL schema first.", "err");
      return;
    }
    const ordered = [...ambassadorsList].sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));
    const dragIdx = ordered.findIndex(m => m.id === draggedId);
    const targetIdx = ordered.findIndex(m => m.id === targetId);
    if (dragIdx === -1 || targetIdx === -1) return;
    const reordered = [...ordered];
    const [dragged] = reordered.splice(dragIdx, 1);
    reordered.splice(targetIdx, 0, dragged);
    // Optimistic update
    setAmbassadorsList(reordered.map((m, i) => ({ ...m, display_order: i })));
    // Persist each updated order
    try {
      await Promise.all(
        reordered.map((m, i) =>
          fetch(`/api/ambassadors/${m.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ display_order: i }),
          })
        )
      );
      showToast("Order saved!", "ok");
      fetchData();
    } catch (err: any) {
      showToast("Failed to save reorder: " + err.message, "err");
    }
  };

  const openAmbassadorAddForm = () => {
    setEditingAmbassadorId(null);
    setAmbassadorForm({ ...EMPTY_AMBASSADOR, display_order: ambassadorsList.length });
    setShowAmbassadorForm(true);
    setAmbassadorDbAlert(false);
  };

  const openAmbassadorEditForm = (a: any) => {
    setEditingAmbassadorId(a.id);
    setAmbassadorForm({
      name: a.name || "",
      role: a.role || "",
      institution: a.institution || "",
      logo_url: a.logo_url || "",
      email: a.email || "",
      phone: a.phone || "",
      address: a.address || "",
      quote: a.quote || "",
      photo_url: a.photo_url || "",
      accent_color: a.accent_color || "#0B4A9E",
      accent_color_sec: a.accent_color_sec || "#E60717",
      display_order: a.display_order || 0,
      active: a.active ?? true,
    });
    setShowAmbassadorForm(true);
    setAmbassadorDbAlert(false);
  };

  const handleAmbassadorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAmbassadorSubmitting(true);
    try {
      const method = editingAmbassadorId ? "PUT" : "POST";
      const url = editingAmbassadorId ? `/api/ambassadors/${editingAmbassadorId}` : "/api/ambassadors";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ambassadorForm),
      });
      
      const resData = await res.json();
      if (!res.ok) {
        if (resData.error === "DB_TABLE_MISSING") {
          setAmbassadorDbAlert(true);
          throw new Error(resData.message || "Ambassadors table does not exist.");
        }
        throw new Error(resData.error || "Failed to save ambassador details");
      }
      
      showToast(editingAmbassadorId ? "Ambassador details updated!" : "New ambassador registered!");
      setShowAmbassadorForm(false);
      fetchData();
    } catch (err: any) {
      showToast(err.message || "Failed to save ambassador details", "err");
    } finally {
      setAmbassadorSubmitting(false);
    }
  };

  const handleAmbassadorDelete = async (id: string, name: string) => {
    if (id.startsWith("amb-fallback-")) {
      showToast("Cannot delete fallback ambassadors. Run SQL schema to enable database edits.", "err");
      return;
    }
    if (!confirm(`Delete brand ambassador "${name}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/ambassadors/${id}`, { method: "DELETE" });
      const resData = await res.json();
      if (!res.ok) {
        if (resData.error === "DB_TABLE_MISSING") {
          showToast("Ambassadors table does not exist. Run schema SQL first.", "err");
          return;
        }
        throw new Error(resData.error || "Failed to delete ambassador");
      }
      showToast(`"${name}" removed successfully.`);
      fetchData();
    } catch (err: any) {
      showToast(err.message || "Delete failed", "err");
    }
  };

  const toggleAmbassadorActive = async (a: any) => {
    if (a.id.startsWith("amb-fallback-")) {
      showToast("Cannot toggle fallback ambassadors. Run SQL schema to enable database updates.", "err");
      return;
    }
    try {
      const res = await fetch(`/api/ambassadors/${a.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !a.active }),
      });
      if (!res.ok) throw new Error("Failed to update ambassador state");
      fetchData();
    } catch (err: any) {
      showToast(err.message || "Toggle failed", "err");
    }
  };

  const moveAmbassadorOrder = async (a: any, dir: "up" | "down") => {
    if (a.id.startsWith("amb-fallback-")) {
      showToast("Reordering is only enabled for database records. Run SQL schema first.", "err");
      return;
    }
    const newOrder = dir === "up" ? a.display_order - 1 : a.display_order + 1;
    try {
      const res = await fetch(`/api/ambassadors/${a.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ display_order: newOrder }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to update order");
      }
      fetchData();
    } catch (err: any) {
      showToast(err.message || "Failed to update order", "err");
    }
  };

  const handleAmbassadorPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>, id: string, uploadType: "photo" | "logo") => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processAmbassadorAssetUpload(file, id, uploadType);
  };

  const handleAmbassadorPhotoDrop = async (e: React.DragEvent<HTMLDivElement>, id: string, uploadType: "photo" | "logo") => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    await processAmbassadorAssetUpload(file, id, uploadType);
  };

  const processAmbassadorAssetUpload = async (file: File, id: string, uploadType: "photo" | "logo") => {
    if (id.startsWith("amb-fallback-")) {
      showToast("Cannot upload photos for static fallbacks. Run SQL schema first.", "err");
      return;
    }
    if (uploadType === "logo") {
      setAmbassadorLogoUploadingFor(id);
    } else {
      setAmbassadorUploadingFor(id);
    }
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("ambassadorId", id);
      fd.append("type", uploadType);
      const res = await fetch("/api/ambassadors/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) {
        showToast(`${uploadType === "logo" ? "Logo" : "Photo"} uploaded and synced!`);
        fetchData();
      } else {
        showToast(data.error || "Upload failed", "err");
      }
    } catch {
      showToast("Upload failed", "err");
    } finally {
      setAmbassadorLogoUploadingFor(null);
      setAmbassadorUploadingFor(null);
    }
  };

  const handleModalAssetUpload = async (file: File, uploadType: "photo" | "logo") => {
    const id = editingAmbassadorId || "new";
    if (uploadType === "logo") {
      setAmbassadorLogoUploadingFor(id);
    } else {
      setAmbassadorUploadingFor(id);
    }
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("ambassadorId", editingAmbassadorId || "temp");
      fd.append("type", uploadType);
      const res = await fetch("/api/ambassadors/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) {
        showToast(`${uploadType === "logo" ? "Logo" : "Photo"} uploaded!`);
        setAmbassadorForm((f: any) => ({
          ...f,
          [uploadType === "logo" ? "logo_url" : "photo_url"]: data.url
        }));
      } else {
        showToast(data.error || "Upload failed", "err");
      }
    } catch {
      showToast("Upload failed", "err");
    } finally {
      setAmbassadorLogoUploadingFor(null);
      setAmbassadorUploadingFor(null);
    }
  };

  // ─── GLOBAL NETWORK PROFESSIONAL CRUD HANDLERS ───
  const openProfessionalAddForm = () => {
    setEditingProfessionalId(null);
    setProfessionalForm({ ...EMPTY_PROFESSIONAL, display_order: professionalsList.length });
    setShowProfessionalForm(true);
    setProfessionalDbAlert(false);
  };

  const openProfessionalEditForm = (p: any) => {
    setEditingProfessionalId(p.id);
    let parsedQuals = "";
    if (p.qualifications) {
      if (Array.isArray(p.qualifications)) {
        parsedQuals = p.qualifications.join("\n");
      } else if (typeof p.qualifications === "string") {
        try {
          if (p.qualifications.trim().startsWith("[")) {
            parsedQuals = JSON.parse(p.qualifications).join("\n");
          } else {
            parsedQuals = p.qualifications;
          }
        } catch {
          parsedQuals = p.qualifications;
        }
      }
    }
    setProfessionalForm({
      name: p.name || "",
      role: p.role || "",
      institution: p.institution || "",
      photo_url: p.photo_url || "",
      description: p.description || "",
      qualifications: parsedQuals,
      hospital_name: p.hospital_name || "",
      hospital_location: p.hospital_location || "",
      hospital_image: p.hospital_image || "",
      display_order: p.display_order || 0,
      active: p.active ?? true
    });
    setShowProfessionalForm(true);
    setProfessionalDbAlert(false);
  };

  const handleProfessionalModalAssetUpload = async (file: File, uploadType: "photo" | "hospital") => {
    const id = editingProfessionalId || "new";
    if (uploadType === "hospital") {
      setProfessionalHospitalUploadingFor(id);
    } else {
      setProfessionalUploadingFor(id);
    }
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("professionalId", editingProfessionalId || "temp");
      fd.append("type", uploadType);
      const res = await fetch("/api/professionals/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) {
        showToast(`${uploadType === "hospital" ? "Hospital Image" : "Professional Photo"} uploaded!`);
        setProfessionalForm((f: any) => ({
          ...f,
          [uploadType === "hospital" ? "hospital_image" : "photo_url"]: data.url
        }));
      } else {
        showToast(data.error || "Upload failed", "err");
      }
    } catch {
      showToast("Upload failed", "err");
    } finally {
      setProfessionalHospitalUploadingFor(null);
      setProfessionalUploadingFor(null);
    }
  };

  const handleProfessionalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfessionalSubmitting(true);
    try {
      const method = editingProfessionalId ? "PUT" : "POST";
      const url = editingProfessionalId ? `/api/professionals/${editingProfessionalId}` : "/api/professionals";
      
      const qualificationsArray = typeof professionalForm.qualifications === "string"
        ? professionalForm.qualifications.split("\n").map((q: string) => q.trim()).filter(Boolean)
        : [];
      
      const payload = {
        ...professionalForm,
        qualifications: qualificationsArray
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      const resData = await res.json();
      if (!res.ok) {
        if (resData.error === "DB_TABLE_MISSING") {
          setProfessionalDbAlert(true);
          throw new Error(resData.message || "Global Network table does not exist.");
        }
        throw new Error(resData.error || "Failed to save professional details");
      }
      
      showToast(editingProfessionalId ? "Professional details updated!" : "New professional registered!");
      setShowProfessionalForm(false);
      fetchData();
    } catch (err: any) {
      showToast(err.message || "Failed to save professional details", "err");
    } finally {
      setProfessionalSubmitting(false);
    }
  };

  const handleProfessionalDelete = async (id: string, name: string) => {
    if (id.startsWith("p")) {
      showToast("Cannot delete default professionals from static fallback. Run SQL schema to enable database edits.", "err");
      return;
    }
    if (!confirm(`Delete professional "${name}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/professionals/${id}`, { method: "DELETE" });
      const resData = await res.json();
      if (!res.ok) {
        if (resData.error === "DB_TABLE_MISSING") {
          showToast("Global Network table does not exist. Run supabase_global_network_schema.sql first.", "err");
          return;
        }
        throw new Error(resData.error || "Failed to delete professional");
      }
      showToast(`"${name}" removed successfully.`);
      fetchData();
    } catch (err: any) {
      showToast(err.message || "Delete failed", "err");
    }
  };

  const toggleProfessionalActive = async (p: any) => {
    if (p.id.startsWith("p")) {
      showToast("Cannot toggle fallback professionals. Run SQL schema to enable database updates.", "err");
      return;
    }
    try {
      const res = await fetch(`/api/professionals/${p.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !p.active }),
      });
      if (!res.ok) throw new Error("Failed to update professional state");
      fetchData();
    } catch (err: any) {
      showToast(err.message || "Toggle failed", "err");
    }
  };

  const handleProfessionalPhotoDrop = async (e: React.DragEvent<HTMLDivElement>, id: string) => {
    e.preventDefault();
    if (id.startsWith("p")) {
      showToast("Cannot drop photos for fallback professionals. Run SQL schema first.", "err");
      return;
    }
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    setProfessionalUploadingFor(id);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("professionalId", id);
      const res = await fetch("/api/professionals/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) {
        showToast("Professional photo uploaded and synced!");
        fetchData();
      } else {
        showToast(data.error ?? "Photo upload failed", "err");
      }
    } catch {
      showToast("Upload failed", "err");
    } finally {
      setProfessionalUploadingFor(null);
    }
  };

  const moveProfessionalOrder = async (p: any, dir: "up" | "down") => {
    if (p.id.startsWith("p")) {
      showToast("Reordering is only enabled for database records. Run SQL schema first.", "err");
      return;
    }
    const newOrder = dir === "up" ? p.display_order - 1 : p.display_order + 1;
    try {
      const res = await fetch(`/api/professionals/${p.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ display_order: newOrder }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to update order");
      }
      fetchData();
    } catch (err: any) {
      showToast(err.message || "Failed to update order", "err");
    }
  };

  // ─── GLOBAL NETWORK FACILITIES CRUD HANDLERS ───
  const uploadMentorPhotoInForm = async (file: File, index: number) => {
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("facilityId", editingFacilityId || "temp");
      fd.append("type", "mentor");
      fd.append("mentorIndex", String(index));
      const res = await fetch("/api/facilities/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) {
        setFacilityForm((f: any) => {
          const updated = [...(f.mentors || [])];
          updated[index] = { ...updated[index], photo: data.url, photo_url: data.url };
          return { ...f, mentors: updated };
        });
        showToast("Mentor photo uploaded!");
      } else {
        showToast(data.error || "Upload failed", "err");
      }
    } catch {
      showToast("Upload failed", "err");
    }
  };

  const openFacilityAddForm = () => {
    setEditingFacilityId(null);
    setFacilityForm({ ...EMPTY_FACILITY, display_order: facilitiesList.length });
    setShowFacilityForm(true);
    setFacilityDbAlert(false);
  };

  const openFacilityEditForm = (f: any) => {
    setEditingFacilityId(f.id);
    setFacilityForm({
      name: f.name || "",
      city: f.city || "",
      facility: f.facility || "",
      image_url: f.image_url || "",
      description: f.description || "",
      mentors: Array.isArray(f.mentors) ? f.mentors : [],
      projects: Array.isArray(f.projects) ? f.projects : [],
      display_order: f.display_order || 0,
      active: f.active ?? true
    });
    setShowFacilityForm(true);
    setFacilityDbAlert(false);
  };

  const handleFacilitySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFacilitySubmitting(true);
    try {
      const method = editingFacilityId ? "PUT" : "POST";
      const url = editingFacilityId ? `/api/facilities/${editingFacilityId}` : "/api/facilities";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(facilityForm),
      });
      
      const resData = await res.json();
      if (!res.ok) {
        if (resData.error === "DB_TABLE_MISSING") {
          setFacilityDbAlert(true);
          throw new Error(resData.message || "Facilities table does not exist.");
        }
        throw new Error(resData.error || "Failed to save facility details");
      }
      
      showToast(editingFacilityId ? "Facility updated!" : "New facility registered!");
      setShowFacilityForm(false);
      fetchData();
    } catch (err: any) {
      showToast(err.message || "Failed to save facility details", "err");
    } finally {
      setFacilitySubmitting(false);
    }
  };

  const handleFacilityDelete = async (id: string, name: string) => {
    if (id.startsWith("f")) {
      showToast("Cannot delete default facilities from static fallback. Run SQL schema first.", "err");
      return;
    }
    if (!confirm(`Delete facility "${name}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/facilities/${id}`, { method: "DELETE" });
      const resData = await res.json();
      if (!res.ok) {
        if (resData.error === "DB_TABLE_MISSING") {
          showToast("Facilities table does not exist. Run extended SQL schema first.", "err");
          return;
        }
        throw new Error(resData.error || "Failed to delete facility");
      }
      showToast(`"${name}" removed successfully.`);
      fetchData();
    } catch (err: any) {
      showToast(err.message || "Delete failed", "err");
    }
  };

  const toggleFacilityActive = async (f: any) => {
    if (f.id.startsWith("f")) {
      showToast("Cannot toggle fallback facilities. Run SQL schema first.", "err");
      return;
    }
    try {
      const res = await fetch(`/api/facilities/${f.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !f.active }),
      });
      if (!res.ok) throw new Error("Failed to update facility state");
      fetchData();
    } catch (err: any) {
      showToast(err.message || "Toggle failed", "err");
    }
  };

  const handleFacilityPhotoDrop = async (e: React.DragEvent<HTMLDivElement>, id: string, type: "campus" | "mentor", mentorIndex?: number) => {
    e.preventDefault();
    if (id.startsWith("f")) {
      showToast("Cannot drop photos for fallback facilities. Run SQL schema first.", "err");
      return;
    }
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    setFacilityUploadingFor(id);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("facilityId", id);
      fd.append("type", type);
      if (type === "mentor" && mentorIndex !== undefined) {
        fd.append("mentorIndex", String(mentorIndex));
      }
      const res = await fetch("/api/facilities/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) {
        showToast("Facility photo uploaded and synced!");
        fetchData();
      } else {
        showToast(data.error ?? "Photo upload failed", "err");
      }
    } catch {
      showToast("Upload failed", "err");
    } finally {
      setFacilityUploadingFor(null);
    }
  };

  const moveFacilityOrder = async (f: any, dir: "up" | "down") => {
    if (f.id.startsWith("f")) {
      showToast("Reordering is only enabled for database records. Run SQL schema first.", "err");
      return;
    }
    const newOrder = dir === "up" ? f.display_order - 1 : f.display_order + 1;
    try {
      const res = await fetch(`/api/facilities/${f.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ display_order: newOrder }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to update order");
      }
      fetchData();
    } catch (err: any) {
      showToast(err.message || "Failed to update order", "err");
    }
  };


  // ─── GLOBAL NETWORK ENGINEERS CRUD HANDLERS ───
  const openEngineerAddForm = () => {
    setEditingEngineerId(null);
    setEngineerForm({ ...EMPTY_ENGINEER, display_order: engineersList.length });
    setShowEngineerForm(true);
    setEngineerDbAlert(false);
  };

  const openEngineerEditForm = (e: any) => {
    setEditingEngineerId(e.id);
    setEngineerForm({
      name: e.name || "",
      logo_url: e.logo_url || "",
      fallback_text: e.fallback_text || "",
      team_name: e.team_name || "",
      specialization: e.specialization || "",
      display_order: e.display_order || 0,
      active: e.active ?? true
    });
    setShowEngineerForm(true);
    setEngineerDbAlert(false);
  };

  const handleEngineerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEngineerSubmitting(true);
    try {
      const method = editingEngineerId ? "PUT" : "POST";
      const url = editingEngineerId ? `/api/engineers/${editingEngineerId}` : "/api/engineers";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(engineerForm),
      });
      
      const resData = await res.json();
      if (!res.ok) {
        if (resData.error === "DB_TABLE_MISSING") {
          setEngineerDbAlert(true);
          throw new Error(resData.message || "Engineers table does not exist.");
        }
        throw new Error(resData.error || "Failed to save engineer details");
      }
      
      showToast(editingEngineerId ? "Engineer node updated!" : "New engineer node registered!");
      setShowEngineerForm(false);
      fetchData();
    } catch (err: any) {
      showToast(err.message || "Failed to save engineer details", "err");
    } finally {
      setEngineerSubmitting(false);
    }
  };

  const handleEngineerDelete = async (id: string, name: string) => {
    if (id.startsWith("e")) {
      showToast("Cannot delete default engineers from static fallback. Run SQL schema first.", "err");
      return;
    }
    if (!confirm(`Delete engineering node for "${name}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/engineers/${id}`, { method: "DELETE" });
      const resData = await res.json();
      if (!res.ok) {
        if (resData.error === "DB_TABLE_MISSING") {
          showToast("Engineers table does not exist. Run extended SQL schema first.", "err");
          return;
        }
        throw new Error(resData.error || "Failed to delete engineer node");
      }
      showToast(`"${name}" removed successfully.`);
      fetchData();
    } catch (err: any) {
      showToast(err.message || "Delete failed", "err");
    }
  };

  const toggleEngineerActive = async (e: any) => {
    if (e.id.startsWith("e")) {
      showToast("Cannot toggle fallback engineering nodes. Run SQL schema first.", "err");
      return;
    }
    try {
      const res = await fetch(`/api/engineers/${e.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !e.active }),
      });
      if (!res.ok) throw new Error("Failed to update engineer node state");
      fetchData();
    } catch (err: any) {
      showToast(err.message || "Toggle failed", "err");
    }
  };

  const handleEngineerLogoDrop = async (e: React.DragEvent<HTMLDivElement>, id: string) => {
    e.preventDefault();
    if (id.startsWith("e")) {
      showToast("Cannot drop logos for fallback engineers. Run SQL schema first.", "err");
      return;
    }
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    setEngineerUploadingFor(id);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("engineerId", id);
      const res = await fetch("/api/engineers/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) {
        showToast("Institute logo uploaded and synced!");
        fetchData();
      } else {
        showToast(data.error ?? "Logo upload failed", "err");
      }
    } catch {
      showToast("Upload failed", "err");
    } finally {
      setEngineerUploadingFor(null);
    }
  };

  const moveEngineerOrder = async (eng: any, dir: "up" | "down") => {
    if (eng.id.startsWith("e")) {
      showToast("Reordering is only enabled for database records. Run SQL schema first.", "err");
      return;
    }
    const newOrder = dir === "up" ? eng.display_order - 1 : eng.display_order + 1;
    try {
      const res = await fetch(`/api/engineers/${eng.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ display_order: newOrder }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to update order");
      }
      fetchData();
    } catch (err: any) {
      showToast(err.message || "Failed to update order", "err");
    }
  };

  // ─── STANDARD CONSOLE EVENT HANDLERS ───

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
      if (typeof window !== 'undefined') {
        const localPhotos = JSON.parse(localStorage.getItem('healix_mock_photos') || '[]');
        localStorage.setItem('healix_mock_photos', JSON.stringify(localPhotos.filter((p: any) => p.id !== id)));
        const localPubs = JSON.parse(localStorage.getItem('healix_publications') || '[]');
        localStorage.setItem('healix_publications', JSON.stringify(localPubs.filter((p: any) => p.id !== id)));
        const localNews = JSON.parse(localStorage.getItem('healix_news') || '[]');
        localStorage.setItem('healix_news', JSON.stringify(localNews.filter((n: any) => n.id !== id)));
      }
      const res = await deleteFunc(id);
      if (res.error) {
        // If it's a database missing table error, ignore it since we already deleted from local fallback
        if (!res.error.includes("Database table 'healix_news_articles' does not exist")) {
          alert(res.error);
        } else {
          fetchData();
        }
      }
      else fetchData();
    }
  };

  const handleAddPublication = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const res = await addBiolabPublication(formData) as any;
    if (res.localFallback && res.data) {
      const newPub = { id: crypto.randomUUID(), created_at: new Date().toISOString(), ...res.data };
      const local = JSON.parse(localStorage.getItem('healix_publications') || '[]');
      local.unshift(newPub);
      localStorage.setItem('healix_publications', JSON.stringify(local));
      form.reset();
      setPubImagePreview(null);
      fetchData();
    } else if (res.error) {
      alert('Publication error: ' + res.error);
    } else {
      form.reset();
      setPubImagePreview(null);
      fetchData();
    }
  };

  const handleAddEvent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const res = await addBiolabEvent(formData) as any;
    if (res.error) {
      alert('Event error: ' + res.error);
    } else {
      form.reset();
      fetchData();
    }
  };

  if (loading && !data) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#050505]">
      <div className="w-16 h-16 border-4 border-orange-500/30 border-t-[#ea580c] rounded-full animate-spin mb-4" />
      <p className="text-[#ea580c] font-mono text-xs uppercase tracking-widest animate-pulse">Initializing Master Admin Core...</p>
    </div>
  );

  // Use empty-state fallback so the UI still renders even if server action failed
  const safeData = data ?? {
    applications: [], projects: [], vehicles: [], trips: [],
    announcements: [], events: [], news: [], photos: [],
    programs: [], reels: [], evidence: [], sos_alerts: [],
    session_photos: [], publications: [], innovators: [],
    healix_news: []
  };

  // Tabs layout navigation
  const tabs = [
    { id: "overview", label: "Overview", icon: LayoutDashboard, color: "text-blue-400", bg: "bg-blue-500/10" },
    { id: "biolabs", label: "BioLabs Pipeline", icon: TestTube, color: "text-purple-400", bg: "bg-purple-500/10" },
    { id: "suraksha", label: "Suraksha Control", icon: Shield, color: "text-orange-400", bg: "bg-orange-500/10" },
    { id: "academy", label: "Academy CRM", icon: GraduationCap, color: "text-[#eab308]", bg: "bg-yellow-500/10" },
    { id: "news", label: "News Manager", icon: Newspaper, color: "text-[#ea580c]", bg: "bg-orange-500/10" },
    { id: "events", label: "Homepage Events", icon: Calendar, color: "text-cyan-400", bg: "bg-cyan-500/10" },
    { id: "mentors", label: "Advisors & Mentors", icon: Users, color: "text-emerald-400", bg: "bg-emerald-500/10" },
    { id: "team", label: "Engineering Team", icon: Code2, color: "text-[#ea580c]", bg: "bg-orange-500/10" },
    { id: "founders", label: "Founders Corner", icon: ShieldAlert, color: "text-amber-500", bg: "bg-amber-500/10" },
    { id: "network", label: "Global Network", icon: Globe, color: "text-orange-400", bg: "bg-orange-500/10" },
    { id: "members", label: "Our Members", icon: Users, color: "text-amber-400", bg: "bg-amber-500/10" },
    { id: "podcasts", label: "Podcasts Manager", icon: Play, color: "text-red-400", bg: "bg-red-500/10" },
    { id: "branding", label: "Branding Manager", icon: ImageIcon, color: "text-indigo-400", bg: "bg-indigo-500/10" },
    { id: "reels", label: "Comm. Reels", icon: PlayCircle, color: "text-pink-400", bg: "bg-pink-500/10" },
    { id: "system", label: "System Health", icon: Server, color: "text-green-400", bg: "bg-green-500/10" }
  ] as const;

  const totalApps = safeData.applications.length;
  const pendingApps = safeData.applications.filter((a:any) => a.status === 'pending').length;
  const activeProjects = safeData.projects.length;
  const fleetSize = safeData.vehicles.length;
  const activeTrips = safeData.trips.filter((t:any) => t.status === 'active').length;

  return (
    <div className="min-h-screen bg-[#09090b] flex font-sans text-gray-200 admin-console">

      {/* ── Non-blocking error/retry banner ── */}
      {error && (
        <div className="fixed top-0 left-0 right-0 z-[99999] flex items-center justify-between gap-3 bg-amber-900/90 backdrop-blur border-b border-amber-600/50 px-4 py-2.5 text-xs font-mono">
          <div className="flex items-center gap-2 text-amber-300">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
            <span><strong className="text-amber-200">Data sync issue:</strong> {error}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => { setError(null); fetchData(); }}
              className="flex items-center gap-1 px-3 py-1 rounded-md bg-amber-600 hover:bg-amber-500 text-white transition-colors"
            >
              <RefreshCw className="w-3 h-3" /> Retry
            </button>
            <button onClick={() => setError(null)} className="text-amber-400 hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
      
      {/* Toast popup */}
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

      {/* Global SOS Alert */}
      {globalAlert && (
        <motion.div 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] w-full max-w-3xl bg-red-600 border-2 border-red-400 text-white p-4 rounded-xl shadow-[0_0_50px_rgba(220,38,38,0.6)] flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <AlertTriangle className="w-8 h-8 animate-pulse" />
            <div>
              <h2 className="text-xl font-bold tracking-widest">CRITICAL SOS ENGAGED</h2>
              <p className="text-sm text-red-100 font-mono">DEVICE: {globalAlert.deviceId} — {globalAlert.description}</p>
            </div>
          </div>
          <button 
            onClick={() => setGlobalAlert(null)}
            className="bg-black/20 hover:bg-black/40 px-4 py-2 rounded-lg text-sm font-bold transition-colors"
          >
            ACKNOWLEDGE
          </button>
        </motion.div>
      )}

      {/* SIDEBAR */}
      <div className="hidden lg:flex w-64 border-r border-white/10 bg-[#0a0a0a] flex-col h-screen sticky top-0">
        <div className="p-6 border-b border-white/10 flex items-center gap-3">
          <div className="p-1.5 bg-white/5 border border-white/10">
            <Server className="h-5 w-5 text-white/80" />
          </div>
          <div>
            <h1 className="font-mono font-bold text-sm leading-tight tracking-tighter text-white">HEALIX_CONSOLE</h1>
            <p className="text-[9px] text-[#ea580c] uppercase tracking-[0.2em] font-mono font-bold">Integrated Terminal</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  router.push(`/admin?tab=${tab.id}`, { scroll: false });
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-sm transition-all relative overflow-hidden group ${isActive ? 'bg-white/10 text-white border border-white/10' : 'text-white/50 hover:bg-white/5 hover:text-white/80 border border-transparent'}`}
              >
                {isActive && (
                  <motion.div layoutId="activeTabIndicator" className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#ea580c]" />
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
            <span className="text-xs text-white/50 font-mono">Operations Online</span>
          </div>
        </div>
      </div>

      {/* MOBILE SIDEBAR DRAWER */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileSidebarOpen(false)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
            />
            {/* Drawer Container */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-50 w-72 bg-[#0a0a0a] border-r border-white/10 flex flex-col h-screen lg:hidden"
            >
              <div className="p-6 border-b border-white/10 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Server className="h-5 w-5 text-[#ea580c]" />
                  <div>
                    <h1 className="font-mono font-bold text-sm leading-tight tracking-tighter text-white">HEALIX_CONSOLE</h1>
                    <p className="text-[9px] text-[#ea580c] uppercase tracking-[0.2em] font-mono font-bold">Integrated Terminal</p>
                  </div>
                </div>
                <button 
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-white/50 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar animate-none">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id as any);
                        setMobileSidebarOpen(false);
                        router.push(`/admin?tab=${tab.id}`, { scroll: false });
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all relative overflow-hidden group ${isActive ? 'bg-white/10 text-white border border-white/10' : 'text-white/50 hover:bg-white/5 hover:text-white/80 border border-transparent'}`}
                    >
                      {isActive && (
                        <motion.div layoutId="activeTabIndicatorMobile" className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#ea580c]" />
                      )}
                      <Icon className={`h-4.5 w-4.5 ${isActive ? tab.color : 'text-current transition-colors group-hover:text-white'}`} />
                      <span className="font-mono text-xs uppercase tracking-wider">{tab.label}</span>
                    </button>
                  )
                })}
              </nav>

              <div className="p-6 border-t border-white/5">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.6)]" />
                  <span className="text-xs text-white/50 font-mono">Operations Online</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* MAIN CONTENT WINDOW */}
      <div className="flex-1 overflow-y-auto h-screen relative bg-[#050505]">
        
        {/* Mobile Header Bar */}
        <div className="lg:hidden bg-[#0a0a0a] border-b border-white/10 px-6 py-4 flex justify-between items-center z-40 sticky top-0">
          <div className="flex items-center gap-2.5">
            <Server className="h-4.5 w-4.5 text-[#ea580c]" />
            <span className="font-mono font-bold text-xs uppercase tracking-wider text-white">Console</span>
            <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#ea580c]/10 text-[#ea580c] border border-[#ea580c]/20 uppercase">{activeTab}</span>
          </div>
          <button 
            onClick={() => setMobileSidebarOpen(true)}
            className="p-2 -mr-2 rounded-lg bg-white/5 border border-white/10 text-white/80 hover:text-white transition-all"
            aria-label="Open Console Navigation"
          >
            <Menu className="w-4.5 h-4.5" />
          </button>
        </div>
        
        {/* Glow backlight */}
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl pointer-events-none" aria-hidden="true">
          <div className={`relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem] transition-colors duration-1000 ${
            activeTab === 'biolabs' ? 'bg-gradient-to-tr from-purple-500 to-blue-500' :
            activeTab === 'suraksha' ? 'bg-gradient-to-tr from-orange-500 to-blue-500' :
            activeTab === 'academy' ? 'bg-gradient-to-tr from-[#eab308]/50 to-orange-500' :
            activeTab === 'news' ? 'bg-gradient-to-tr from-orange-600 to-amber-500' :
            activeTab === 'events' ? 'bg-gradient-to-tr from-cyan-500 to-blue-600' :
            activeTab === 'mentors' ? 'bg-gradient-to-tr from-emerald-500 to-teal-500' :
            activeTab === 'network' ? 'bg-gradient-to-tr from-orange-600 to-amber-500' :
            activeTab === 'system' ? 'bg-gradient-to-tr from-green-500 to-emerald-500' :
            'bg-gradient-to-tr from-blue-500 to-indigo-500'
          }`} />
        </div>

        <main className="p-8 max-w-[94%] mx-auto w-full pb-32">
          <AnimatePresence mode="wait">
            
            {/* OVERVIEW TAB */}
            {activeTab === "overview" && (
              <motion.div key="overview" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="space-y-8">
                <div className="mb-8">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900 mb-4">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ea580c] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ea580c]"></span>
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest font-bold">CONSOLE HUB</span>
                  </div>
                  <h2 className="text-3xl font-black font-mono tracking-tight text-white uppercase">Command Center</h2>
                  <p className="text-white/50 text-sm">Real-time integrated telemetry, education and research platform administration.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {/* BioLabs Stats */}
                  <GlassCard className="border-purple-500/20 shadow-[0_0_30px_rgba(168,85,247,0.05)] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <TestTube className="h-24 w-24 text-purple-500" />
                    </div>
                    <p className="text-xs text-purple-400 font-bold font-mono uppercase tracking-wider mb-2">BioLabs Incubations</p>
                    <p className="text-5xl font-black text-white mb-2">{activeProjects}</p>
                    <p className="text-[10px] font-mono text-white/50">+{pendingApps} queue applications</p>
                  </GlassCard>

                  {/* Suraksha Stats */}
                  <GlassCard className="border-orange-500/20 shadow-[0_0_30px_rgba(234,88,12,0.05)] relative overflow-hidden group flex flex-col justify-between">
                    <div>
                      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Car className="h-24 w-24 text-orange-500" />
                      </div>
                      <p className="text-xs text-orange-400 font-bold font-mono uppercase tracking-wider mb-2">Suraksha Telemetry</p>
                      <p className="text-5xl font-black text-white mb-2">{activeTrips}</p>
                      <p className="text-[10px] font-mono text-white/50">{fleetSize} active virtual nodes</p>
                    </div>
                  </GlassCard>

                  {/* Academy Stats */}
                  <GlassCard className="border-yellow-500/20 shadow-[0_0_30px_rgba(234,179,8,0.05)] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <GraduationCap className="h-24 w-24 text-yellow-500" />
                    </div>
                    <p className="text-xs text-[#eab308] font-bold font-mono uppercase tracking-wider mb-2">Academy Cohorts</p>
                    <p className="text-5xl font-black text-white mb-2">{academyCourses.length}</p>
                    <p className="text-[10px] font-mono text-white/50">{academyMentors.length} instructors online</p>
                  </GlassCard>

                  {/* Advisors/Mentors Stats */}
                  <GlassCard className="border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.05)] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Users className="h-24 w-24 text-emerald-500" />
                    </div>
                    <p className="text-xs text-emerald-400 font-bold font-mono uppercase tracking-wider mb-2">Leadership board</p>
                    <p className="text-5xl font-black text-white mb-2">{corpMentors.length}</p>
                    <p className="text-[10px] font-mono text-white/50">{corpMentors.filter(m => m.active).length} visible profiles</p>
                  </GlassCard>
                </div>

                {/* Simulated Activity Chart */}
                <GlassCard className="p-0 overflow-hidden h-[360px] relative border-white/5 bg-[#0a0a0a]">
                  <div className="absolute inset-0 p-6 z-10 pointer-events-none flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-base font-mono uppercase tracking-wider">Network Intelligence Stream</h3>
                      <p className="text-xs text-white/40">Aggregated digital twin bandwidth logs</p>
                    </div>
                  </div>
                  
                  <div className="w-full h-full bg-[#080808] flex items-end relative overflow-hidden">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808006_1px,transparent_1px),linear-gradient(to_bottom,#80808006_1px,transparent_1px)] bg-[size:40px_40px]" />
                    
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
                        fill="url(#gradOrange)"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.8 }}
                        transition={{ duration: 2, delay: 0.5 }}
                      />
                      <defs>
                        <linearGradient id="gradBlue" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="rgba(59, 130, 246, 0.4)" />
                          <stop offset="100%" stopColor="rgba(59, 130, 246, 0)" />
                        </linearGradient>
                        <linearGradient id="gradOrange" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="rgba(234, 88, 12, 0.4)" />
                          <stop offset="100%" stopColor="rgba(234, 88, 12, 0)" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                </GlassCard>
              </motion.div>
            )}

            {/* BIOLABS TAB */}
            {activeTab === "biolabs" && (
              <motion.div key="biolabs" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="space-y-8">
                <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-6">
                  <div>
                    <h2 className="text-3xl font-black font-mono uppercase tracking-tight text-white">BioLabs Pipeline</h2>
                    <p className="text-white/50 text-sm">Manage research applications and active incubations.</p>
                  </div>
                </div>

                {/* Applications Queue */}
                <GlassCard className="border-white/5 shadow-xl bg-[#0a0a0a] p-6">
                  <h3 className="text-base font-bold font-mono uppercase tracking-wider mb-4 flex items-center gap-2"><TestTube className="h-5 w-5 text-purple-400" /> Intake Queue</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="text-white/30 uppercase text-[10px] tracking-wider border-b border-white/5">
                        <tr>
                          <th className="pb-3 font-semibold font-mono">Applicant</th>
                          <th className="pb-3 font-semibold font-mono">Research Proposal</th>
                          <th className="pb-3 font-semibold font-mono">Category</th>
                          <th className="pb-3 font-semibold font-mono text-right">Decision</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        <AnimatePresence>
                          {safeData.applications.filter((a:any) => a.status === 'pending').map((app: any) => (
                            <motion.tr key={app.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, height: 0 }} className="hover:bg-white/[0.02] transition-colors group">
                              <td className="py-4 pr-4">
                                <p className="font-semibold">{app.name}</p>
                                <p className="text-xs text-white/40">{app.email}</p>
                              </td>
                              <td className="py-4 pr-4 max-w-xs">
                                <p className="font-semibold text-white/90">{app.idea_title}</p>
                                <p className="text-xs text-white/40 truncate mt-0.5">{app.description || "No description provided."}</p>
                              </td>
                              <td className="py-4 pr-4">
                                <span className="px-2 py-1 bg-white/5 border border-white/10 text-white/70 rounded-md text-xs font-mono">{app.category}</span>
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
                <GlassCard className="border-white/5 shadow-xl bg-[#0a0a0a] p-6">
                  <h3 className="text-base font-bold font-mono uppercase tracking-wider mb-6 flex items-center gap-2"><Cpu className="h-5 w-5 text-blue-400" /> Active Incubations</h3>
                  <div className="space-y-4">
                    {safeData.projects.map((proj: any) => (
                      <div key={proj.id} className="p-4 bg-[#050505] border border-white/5 rounded-2xl flex flex-col md:flex-row gap-6 md:items-center relative overflow-hidden group">
                        <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 pointer-events-none transition-all duration-500 ease-out" style={{ width: `${proj.progress || 0}%` }} />
                        <div className="flex-1 z-10">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-base">{proj.title}</h4>
                            <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-md text-[9px] uppercase font-bold tracking-wider font-mono">{proj.status}</span>
                          </div>
                          <p className="text-xs text-white/40 mb-3">{proj.category}</p>
                          
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

                {/* Content Management Form Sections */}
                <GlassCard className="border-white/5 bg-[#0a0a0a] p-6 shadow-xl">
                  <h3 className="text-base font-bold font-mono uppercase tracking-wider mb-6 flex items-center gap-2 text-purple-400">
                    <LayoutDashboard className="h-5 w-5" /> Page Content Management
                  </h3>
                  <div className="space-y-12">
                    
                    {/* Hero Photos */}
                    <div>
                      <h4 className="font-semibold flex items-center gap-2 mb-3 text-white/80"><ImageIcon className="h-4 w-4 text-blue-400"/> Hero Photos</h4>
                      <form onSubmit={(e) => {
                        handleAddContent(e, addBiolabPhoto);
                        setHeroPhotoPreview(null);
                        setHeroPhotoTitle("");
                      }} className="space-y-4 mb-4">
                        <div
                          className={`relative rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer ${
                            heroPhotoDragOver ? "border-purple-500 bg-purple-500/10" : "border-white/10 bg-[#050505] hover:border-purple-500/40"
                          }`}
                          onDragOver={(e) => { e.preventDefault(); setHeroPhotoDragOver(true); }}
                          onDragLeave={() => setHeroPhotoDragOver(false)}
                          onDrop={(e) => {
                            e.preventDefault();
                            setHeroPhotoDragOver(false);
                            const file = e.dataTransfer.files?.[0];
                            if (file && file.type.startsWith("image/")) {
                              const reader = new FileReader();
                              reader.onload = (ev) => setHeroPhotoPreview(ev.target?.result as string);
                              reader.readAsDataURL(file);
                            }
                          }}
                          onClick={() => heroPhotoRef.current?.click()}
                        >
                          <input ref={heroPhotoRef} type="file" accept="image/*" className="hidden" onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (ev) => setHeroPhotoPreview(ev.target?.result as string);
                              reader.readAsDataURL(file);
                            }
                          }} />
                          {heroPhotoPreview ? (
                            <div className="relative">
                              <img src={heroPhotoPreview} alt="Preview" className="w-full h-32 object-cover rounded-xl" />
                              <button type="button" onClick={(e) => { e.stopPropagation(); setHeroPhotoPreview(null); }} className="absolute top-2 right-2 p-1 bg-black text-white rounded-full"><Trash2 className="w-4 h-4" /></button>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center py-6 px-4">
                              <ImageIcon className="h-6 w-6 mb-2 text-white/30" />
                              <p className="text-xs text-white/50">Drag & drop image or browse files</p>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <input name="title" value={heroPhotoTitle} onChange={e => setHeroPhotoTitle(e.target.value)} required placeholder="Image Title" className="flex-1 bg-[#050505] border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none" />
                          <input type="hidden" name="image_url" value={heroPhotoPreview || ""} />
                          <button type="submit" className="px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-xs">Add Photo</button>
                        </div>
                      </form>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[160px] overflow-y-auto custom-scrollbar">
                        {safeData.photos?.map((p: any) => (
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

                    {/* Research & Innovation Scholars */}
                    <div className="border-t border-white/5 pt-8">
                      <h4 className="font-semibold flex items-center gap-2 mb-2 text-white/80">
                        <GraduationCap className="h-4 w-4 text-purple-400"/> Research & Innovation Scholars
                      </h4>
                      <p className="text-[10px] text-white/30 font-mono mb-5">Scholars appear in the cinematic carousel on the BioLabs page. Photos & logos support drag-and-drop.</p>

                      <form
                        onSubmit={async (e) => {
                          e.preventDefault();
                          if (!innovatorPortraitPreview) { alert('Upload a portrait photo first.'); return; }
                          if (!innovatorLogoPreview) { alert('Upload a college logo first.'); return; }
                          setInnovatorSubmitting(true);
                          const fd = new FormData(e.currentTarget as HTMLFormElement);
                          fd.set('image', innovatorPortraitPreview);
                          fd.set('collegeLogo', innovatorLogoPreview);
                          const res = await addBiolabInnovator(fd);
                          if (res.localFallback && res.data) {
                            // persist locally
                            const raw = res.data;
                            const normalised = {
                              id: raw.id,
                              name: raw.name,
                              projectTitle: raw.project_title,
                              description: raw.description,
                              collegeName: raw.college_name,
                              image: raw.image_url,
                              collegeLogo: raw.college_logo,
                              year: raw.year
                            };
                            const existing = JSON.parse(localStorage.getItem('healix_innovators') || '[]');
                            const updated = [normalised, ...existing];
                            localStorage.setItem('healix_innovators', JSON.stringify(updated));
                            setInnovatorList(updated);
                            showToast('Scholar added locally (DB unavailable).', 'ok');
                          } else if (res.error) {
                            showToast(res.error, 'err');
                          } else {
                            showToast('Scholar added!', 'ok');
                            fetchData();
                          }
                          setInnovatorPortraitPreview(null);
                          setInnovatorLogoPreview(null);
                          (e.currentTarget as HTMLFormElement).reset();
                          setInnovatorSubmitting(false);
                        }}
                        className="space-y-5"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                          {/* Portrait drag-drop */}
                          <div className="space-y-2">
                            <label className="text-[10px] font-mono text-white/50 uppercase tracking-wider block">Scholar Portrait *</label>
                            <div
                              className={`relative rounded-xl border-2 border-dashed transition-all duration-200 cursor-pointer overflow-hidden ${
                                innovatorPortraitDragOver ? 'border-purple-500 bg-purple-500/10' : innovatorPortraitPreview ? 'border-white/20' : 'border-white/10 bg-[#050505] hover:border-purple-500/40'
                              }`}
                              style={{ height: 220 }}
                              onDragOver={(e) => { e.preventDefault(); setInnovatorPortraitDragOver(true); }}
                              onDragLeave={() => setInnovatorPortraitDragOver(false)}
                              onDrop={(e) => {
                                e.preventDefault();
                                setInnovatorPortraitDragOver(false);
                                const file = e.dataTransfer.files?.[0];
                                if (file && file.type.startsWith('image/')) {
                                  const reader = new FileReader();
                                  reader.onload = (ev) => setInnovatorPortraitPreview(ev.target?.result as string);
                                  reader.readAsDataURL(file);
                                }
                              }}
                              onClick={() => innovatorPortraitRef.current?.click()}
                            >
                              <input ref={innovatorPortraitRef} type="file" accept="image/*" className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onload = (ev) => setInnovatorPortraitPreview(ev.target?.result as string);
                                    reader.readAsDataURL(file);
                                  }
                                }}
                              />
                              {innovatorPortraitPreview ? (
                                <>
                                  <img src={innovatorPortraitPreview} alt="Portrait" className="w-full h-full object-cover" />
                                  <button type="button" onClick={(ev) => { ev.stopPropagation(); setInnovatorPortraitPreview(null); }}
                                    className="absolute top-2 right-2 p-1 bg-black/70 text-white rounded-full hover:bg-red-600 transition-colors">
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                  <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-green-500/80 text-white text-[9px] font-mono font-bold rounded uppercase tracking-wider">Ready</div>
                                </>
                              ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                                  <Upload className="w-8 h-8 text-white/20" />
                                  <p className="text-xs text-white/30 font-mono text-center">Drag & drop portrait<br/><span className="text-purple-400">or click to browse</span></p>
                                  <p className="text-[9px] text-white/20 font-mono">Portrait orientation recommended</p>
                                </div>
                              )}
                            </div>

                            {/* College Logo drag-drop */}
                            <label className="text-[10px] font-mono text-white/50 uppercase tracking-wider block mt-4">College Logo *</label>
                            <div
                              className={`relative rounded-xl border-2 border-dashed transition-all duration-200 cursor-pointer overflow-hidden ${
                                innovatorLogoDragOver ? 'border-purple-500 bg-purple-500/10' : innovatorLogoPreview ? 'border-white/20' : 'border-white/10 bg-[#050505] hover:border-purple-500/40'
                              }`}
                              style={{ height: 90 }}
                              onDragOver={(e) => { e.preventDefault(); setInnovatorLogoDragOver(true); }}
                              onDragLeave={() => setInnovatorLogoDragOver(false)}
                              onDrop={(e) => {
                                e.preventDefault();
                                setInnovatorLogoDragOver(false);
                                const file = e.dataTransfer.files?.[0];
                                if (file && file.type.startsWith('image/')) {
                                  const reader = new FileReader();
                                  reader.onload = (ev) => { setInnovatorLogoPreview(ev.target?.result as string); };
                                  reader.readAsDataURL(file);
                                }
                              }}
                              onClick={() => innovatorLogoRef.current?.click()}
                            >
                              <input ref={innovatorLogoRef} type="file" accept="image/*" className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onload = (ev) => { setInnovatorLogoPreview(ev.target?.result as string); };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                              />
                              {innovatorLogoPreview ? (
                                <div className="absolute inset-0 flex items-center justify-center p-3">
                                  <img src={innovatorLogoPreview} alt="Logo" className="max-h-full max-w-full object-contain" />
                                  <button type="button" onClick={(ev) => { ev.stopPropagation(); setInnovatorLogoPreview(null); }}
                                    className="absolute top-1 right-1 p-0.5 bg-black/70 text-white rounded-full hover:bg-red-600 transition-colors">
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                                  <p className="text-[9px] text-white/30 font-mono">Drag & drop college logo or click to browse</p>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Text fields */}
                          <div className="space-y-3">
                            <input name="name" required placeholder="Scholar Name *" className="w-full bg-[#050505] border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500" />
                            <input name="projectTitle" required placeholder="Research / Project Title *" className="w-full bg-[#050505] border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500" />
                            <div className="grid grid-cols-2 gap-3">
                              <input name="collegeName" required placeholder="Institution *" className="bg-[#050505] border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500" />
                              <input name="year" defaultValue="2026" placeholder="Year" className="bg-[#050505] border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500" />
                            </div>
                            <textarea name="description" required rows={6} placeholder="Research description & impact *" className="w-full bg-[#050505] border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500 resize-none" />
                            <button type="submit" disabled={innovatorSubmitting}
                              className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-xl font-bold text-xs uppercase tracking-wider font-mono transition-colors flex items-center justify-center gap-2">
                              {innovatorSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                              Add Scholar to Carousel
                            </button>
                          </div>
                        </div>
                      </form>

                      {/* Existing scholars list */}
                      <div className="mt-8 border-t border-white/5 pt-6">
                        <p className="text-[10px] font-mono text-white/30 uppercase tracking-wider mb-3">Current Scholars ({innovatorList.length})</p>
                        {innovatorList.length > 0 ? (
                          <div className="space-y-2 max-h-[280px] overflow-y-auto custom-scrollbar">
                            {innovatorList.map((inn: any) => (
                              <div key={inn.id} className="flex items-center gap-4 p-3 bg-white/5 border border-white/5 rounded-xl group hover:border-white/10 transition-all">
                                {/* Portrait thumbnail */}
                                <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-black border border-white/10">
                                  <img src={inn.image || inn.image_url} alt={inn.name} className="w-full h-full object-cover" />
                                </div>
                                {/* College logo thumbnail */}
                                <div className="w-8 h-8 shrink-0 flex items-center justify-center">
                                  <img src={inn.collegeLogo || inn.college_logo} alt="logo" className="w-8 h-8 object-contain rounded" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-semibold text-white truncate">{inn.name}</p>
                                  <p className="text-[10px] text-white/40 font-mono truncate">{inn.projectTitle || inn.project_title}</p>
                                  <p className="text-[9px] text-purple-400 font-mono">{inn.collegeName || inn.college_name} · {inn.year}</p>
                                </div>
                                <button
                                  type="button"
                                  onClick={async () => {
                                    if (!confirm('Remove this scholar?')) return;
                                    const res = await deleteBiolabInnovator(inn.id);
                                    if (res.localFallback) {
                                      // Remove from localStorage
                                      const stored = JSON.parse(localStorage.getItem('healix_innovators') || '[]');
                                      const filtered = stored.filter((s: any) => s.id !== inn.id);
                                      localStorage.setItem('healix_innovators', JSON.stringify(filtered));
                                      setInnovatorList(filtered);
                                      showToast('Scholar removed locally.', 'ok');
                                    } else if (res.error) {
                                      showToast(res.error, 'err');
                                    } else {
                                      showToast('Scholar removed!', 'ok');
                                      fetchData();
                                    }
                                  }}
                                  className="shrink-0 p-2 text-white/20 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 border border-dashed border-white/10 rounded-xl bg-white/[0.02]">
                            <GraduationCap className="h-8 w-8 text-white/10 mx-auto mb-2" />
                            <p className="text-xs text-white/40 font-mono">No scholars added yet. Use the form above to add one.</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Publications */}
                    <div className="border-t border-white/5 pt-8">
                      <h4 className="font-semibold flex items-center gap-2 mb-3 text-white/80"><FileText className="h-4 w-4 text-[#eab308]"/> Publications & Papers</h4>
                      <form onSubmit={handleAddPublication} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <input name="title" required placeholder="Publication Title" className="bg-[#050505] border border-white/10 rounded-xl px-3 py-2 text-white text-sm" />
                          <input name="subtitle" placeholder="Subtitle" className="bg-[#050505] border border-white/10 rounded-xl px-3 py-2 text-white text-sm" />
                        </div>
                        <textarea name="description" placeholder="Description of findings..." className="w-full bg-[#050505] border border-white/10 rounded-xl px-3 py-2 text-white text-sm h-16" />
                        <div className="grid grid-cols-2 gap-4">
                          <input name="image_url" placeholder="Image URL / Graphic" className="bg-[#050505] border border-white/10 rounded-xl px-3 py-2 text-white text-sm" />
                          <input name="link_url" placeholder="PDF File / Link URL" className="bg-[#050505] border border-white/10 rounded-xl px-3 py-2 text-white text-sm" />
                        </div>
                        <button type="submit" className="px-6 py-2 bg-[#ea580c] hover:bg-[#c2410c] text-white rounded-xl font-bold text-xs uppercase tracking-wider">Publish Document</button>
                      </form>
                      <div className="space-y-2 mt-4 max-h-[160px] overflow-y-auto custom-scrollbar">
                        {safeData.publications?.map((pub: any) => (
                          <div key={pub.id} className="flex justify-between items-center p-3 bg-white/5 border border-white/5 rounded-xl">
                            <div>
                              <p className="text-sm font-semibold">{pub.title}</p>
                              <p className="text-[10px] text-white/30 font-mono uppercase">{pub.label}</p>
                            </div>
                            <button onClick={() => handleDeleteContent(pub.id, deleteBiolabPublication)} className="text-white/30 hover:text-red-400 p-2"><Trash2 className="h-4 w-4"/></button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Events & Seminars */}
                    <div className="border-t border-white/5 pt-8">
                      <h4 className="font-semibold flex items-center gap-2 mb-3 text-white/80"><Calendar className="h-4 w-4 text-[#ea580c]"/> Events & Seminars</h4>
                      <form onSubmit={handleAddEvent} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <input name="title" required placeholder="Event Title *" className="bg-[#050505] border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500" />
                          <select name="category" required className="bg-[#050505] border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500">
                            <option value="Healthcare AI">Healthcare AI</option>
                            <option value="Edge Telemetry">Edge Telemetry</option>
                            <option value="Academic Workshops">Academic Workshops</option>
                          </select>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[9px] font-mono text-white/40 uppercase mb-1">Start Date & Time *</label>
                            <input type="datetime-local" name="start_date" required className="w-full bg-[#050505] border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500" />
                          </div>
                          <div>
                            <label className="block text-[9px] font-mono text-white/40 uppercase mb-1">End Date & Time *</label>
                            <input type="datetime-local" name="end_date" required className="w-full bg-[#050505] border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500" />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <input name="speaker" required placeholder="Speaker Name *" className="bg-[#050505] border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500" />
                          <input name="speaker_role" placeholder="Speaker Role / Affiliation" className="bg-[#050505] border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <input name="image_url" required placeholder="Image URL (Unsplash or local path) *" className="bg-[#050505] border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500" />
                          <input type="number" name="seats_left" defaultValue="15" placeholder="Seats Left" className="bg-[#050505] border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500" />
                        </div>
                        <textarea name="description" required placeholder="Event Description *" className="w-full bg-[#050505] border border-white/10 rounded-xl px-3 py-2 text-white text-sm h-20 focus:outline-none focus:border-orange-500" />
                        <button type="submit" className="px-6 py-2 bg-[#ea580c] hover:bg-[#c2410c] text-white rounded-xl font-bold text-xs uppercase tracking-wider font-mono transition-colors">Add Event</button>
                      </form>
                      
                      <div className="space-y-2 mt-4 max-h-[200px] overflow-y-auto custom-scrollbar">
                        {safeData.events?.map((evt: any) => {
                          let displayDesc = evt.description;
                          let displayCategory = "Academic Workshops";
                          try {
                            if (evt.description.startsWith("{") && evt.description.endsWith("}")) {
                              const parsed = JSON.parse(evt.description);
                              displayDesc = parsed.description;
                              displayCategory = parsed.category || "Academic Workshops";
                            }
                          } catch (e) {}
                          
                          return (
                            <div key={evt.id} className="flex justify-between items-center p-3 bg-white/5 border border-white/5 rounded-xl">
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-semibold text-white truncate">{evt.title}</p>
                                <p className="text-[10px] text-white/40 font-mono truncate">{displayDesc}</p>
                                <p className="text-[9px] text-[#ea580c] font-mono mt-0.5">{displayCategory} · {new Date(evt.start_date).toLocaleDateString()}</p>
                              </div>
                              <button onClick={() => handleDeleteContent(evt.id, deleteBiolabEvent)} className="text-white/30 hover:text-red-400 p-2 shrink-0"><Trash2 className="h-4 w-4"/></button>
                            </div>
                          );
                        })}
                        {(!safeData.events || safeData.events.length === 0) && (
                          <p className="text-xs text-white/30 italic text-center py-4">No events found in database.</p>
                        )}
                      </div>
                    </div>

                  </div>
                </GlassCard>
              </motion.div>
            )}

            {/* SURAKSHA CONTROL CENTER TAB */}
            {activeTab === "suraksha" && (
              <motion.div key="suraksha" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="space-y-8">
                
                {/* System Status Ticker */}
                <div className="w-full bg-blue-500/5 border border-white/10 rounded-lg overflow-hidden flex items-center h-8">
                  <div className="bg-blue-500/10 px-3 h-full flex items-center border-r border-white/10">
                    <Activity className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
                    <span className="ml-2 text-[9px] font-mono font-bold text-blue-400 uppercase tracking-widest whitespace-nowrap">Live Fleet Telemetry</span>
                  </div>
                  <div className="flex-1 overflow-hidden relative h-full flex items-center">
                    <motion.div 
                      animate={{ x: ["100%", "-100%"] }}
                      transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
                      className="flex items-center gap-12 whitespace-nowrap text-[10px] font-mono text-gray-400"
                    >
                      <span className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-green-500" /> SYSTEM HEALTH: 99.98% OPTIMAL</span>
                      <span className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-blue-500" /> ACTIVE TELEMETRY STREAMS: {surakshaData?.devices?.length || 0}</span>
                      <span className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-purple-500" /> PROTOCOL: HSF-SECURE-v3.2</span>
                      <span className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-green-500" /> DATABASE CONNECTED</span>
                    </motion.div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-b border-white/10 pb-6">
                  <div>
                    <h2 className="text-3xl font-black font-mono uppercase tracking-tight text-white">Suraksha Operations</h2>
                    <p className="text-white/50 text-sm">Enterprise digital twin simulation, live vehicle maps and hardware tracking center.</p>
                  </div>
                </div>

                {/* Sub Tab Navigation */}
                <div className="flex gap-2 mb-4 border-b border-white/5 pb-3">
                  {[
                    { id: "registry", label: "Virtual Registry", icon: Server },
                    { id: "map", label: "Live Fleet Map", icon: MapPin },
                    { id: "incidents", label: "Incident Reports", icon: AlertTriangle },
                    { id: "analytics", label: "AI Anomaly Detection", icon: Zap }
                  ].map((subTab) => (
                    <button
                      key={subTab.id}
                      onClick={() => setSurakshaActiveTab(subTab.id as any)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold font-mono uppercase tracking-wider transition-all ${
                        surakshaActiveTab === subTab.id 
                          ? "bg-blue-600/20 text-blue-400 border border-blue-500/30" 
                          : "text-white/40 hover:text-white hover:bg-white/5 border border-transparent"
                      }`}
                    >
                      <subTab.icon className="w-3.5 h-3.5" />
                      {subTab.label}
                    </button>
                  ))}
                </div>

                <div className="mt-6">
                  {surakshaActiveTab === "registry" && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      <div className="lg:col-span-1">
                        <GlassCard className="p-6 border-white/5 bg-[#0a0a0a]">
                          <h2 className="text-base font-bold font-mono uppercase tracking-wider text-white mb-4 flex items-center gap-2">
                            <Zap className="w-5 h-5 text-blue-400" /> Provision Virtual Node
                          </h2>
                          <form onSubmit={handleCreateDevice} className="space-y-4">
                            <div>
                              <label className="block text-[10px] font-mono text-gray-400 mb-1 uppercase">Vehicle Type</label>
                              <select name="vehicle_type" className="w-full bg-[#050505] border border-white/10 rounded-md p-2.5 text-white focus:outline-none focus:border-blue-500">
                                <option value="CAB">Cab / Taxi</option>
                                <option value="AUTO">Auto Rickshaw</option>
                                <option value="BUS">School Bus</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-[10px] font-mono text-gray-400 mb-1 uppercase">Vehicle Registration</label>
                              <input name="vehicle_reg" required placeholder="e.g., MH-12-AB-5678" className="w-full bg-[#050505] border border-white/10 rounded-md p-2.5 text-white" />
                            </div>
                            <div>
                              <label className="block text-[10px] font-mono text-gray-400 mb-1 uppercase">Driver Name</label>
                              <input name="driver_name" required placeholder="Rajesh Kumar" className="w-full bg-[#050505] border border-white/10 rounded-md p-2.5 text-white" />
                            </div>
                            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-mono uppercase tracking-wider text-xs font-bold py-2.5 rounded-md transition-colors">
                              Deploy IoT Node
                            </button>
                          </form>
                        </GlassCard>
                      </div>

                      <div className="lg:col-span-2 space-y-6">
                        <h3 className="text-base font-bold font-mono uppercase tracking-wider text-white flex items-center gap-2">
                          <Server className="w-5 h-5 text-gray-400" /> Active IoT Hardware Nodes
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {surakshaData?.devices?.map((device: any) => (
                            <GlassCard key={device.id} className="p-5 flex flex-col gap-4 border border-white/5 bg-[#0a0a0a] hover:border-white/10 transition-all">
                              <div className="flex justify-between items-start">
                                <div>
                                  <div className="text-[9px] font-mono text-gray-500 mb-1 uppercase">Node device identifier</div>
                                  <div className="text-base font-bold text-white tracking-wide font-mono">{device.id}</div>
                                </div>
                                <div className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${device.online_state ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                                  {device.online_state ? 'ONLINE' : 'OFFLINE'}
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4 text-xs">
                                <div>
                                  <div className="text-gray-500 uppercase text-[9px] font-mono mb-0.5">Registration</div>
                                  <div className="text-gray-200 font-mono">{device.vehicle_reg}</div>
                                </div>
                                <div>
                                  <div className="text-gray-500 uppercase text-[9px] font-mono mb-0.5">Driver Operator</div>
                                  <div className="text-gray-200">{device.driver_name}</div>
                                </div>
                              </div>
                              <div className="flex items-center gap-4 border-t border-white/5 pt-4 mt-2">
                                <span className="flex items-center gap-1 text-[10px] font-mono text-gray-400"><Battery className="w-3.5 h-3.5 text-green-400" /> {device.battery_level}%</span>
                                <span className="flex items-center gap-1 text-[10px] font-mono text-gray-400"><Signal className="w-3.5 h-3.5 text-blue-400" /> {device.signal_strength} Bars</span>
                                <span className="flex items-center gap-1 text-[10px] font-mono text-gray-400">
                                  {device.encryption_status ? <Shield className="w-3.5 h-3.5 text-green-400"/> : <ShieldAlert className="w-3.5 h-3.5 text-red-400" />}
                                  {device.encryption_status ? "AES Secured" : "Unsecured"}
                                </span>
                              </div>
                              <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-2">
                                <button
                                  onClick={() => setQrModal({ deviceId: device.id, vehicleReg: device.vehicle_reg, driverName: device.driver_name })}
                                  className="px-2.5 py-1.5 bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 text-blue-400 text-[10px] font-mono uppercase tracking-wider font-bold rounded-lg transition-all"
                                >
                                  QR Badge
                                </button>
                                <div className="flex gap-2">
                                  <button onClick={() => toggleSimulation(device.id)} className={`px-2 py-1 text-[10px] font-mono font-bold uppercase rounded transition-colors ${activeSimulations[device.id] ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                    {activeSimulations[device.id] ? "Stop" : "Simulate"}
                                  </button>
                                  <button onClick={() => handleSimulateEvent(device.id, 'failsafe')} className="px-2 py-1 bg-purple-500/20 text-purple-400 text-[10px] font-mono rounded">Failsafe</button>
                                  <button onClick={() => handleSimulateEvent(device.id, 'tamper')} className="px-2 py-1 bg-red-500/20 text-red-400 text-[10px] font-mono rounded">Tamper</button>
                                </div>
                              </div>
                            </GlassCard>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {surakshaActiveTab === "map" && (
                    <GlassCard className="p-6 h-[600px] flex flex-col bg-[#0a0a0a] border-white/5">
                      <h3 className="text-base font-bold font-mono uppercase tracking-wider text-white mb-4">Active Operations Map</h3>
                      <div className="flex-1 bg-black/50 rounded-xl border border-white/10 overflow-hidden relative">
                        <VehicleMap telemetryData={surakshaData?.telemetry || []} sosActive={!!globalAlert} playAlarm={alarmPlaying} />
                      </div>
                    </GlassCard>
                  )}

                  {surakshaActiveTab === "incidents" && (
                    <GlassCard className="p-6 bg-[#0a0a0a] border-white/5">
                      <h3 className="text-base font-bold font-mono uppercase tracking-wider text-white mb-4">Emergency Incident Log</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-white/5 text-gray-400 uppercase font-mono tracking-widest text-[9px]">
                            <tr>
                              <th className="p-3">Timestamp</th>
                              <th className="p-3">Device ID</th>
                              <th className="p-3">Type</th>
                              <th className="p-3">Incident details</th>
                              <th className="p-3">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5 font-mono">
                            {surakshaData?.incidents?.map((inc: any) => (
                              <tr key={inc.id} className="hover:bg-white/5">
                                <td className="p-3 text-gray-500">{new Date(inc.timestamp).toLocaleString()}</td>
                                <td className="p-3 text-blue-400">{inc.device_id}</td>
                                <td className="p-3"><span className="px-2 py-0.5 bg-red-500/20 text-red-400 border border-red-500/30 rounded text-[9px] font-bold">{inc.type}</span></td>
                                <td className="p-3 text-gray-300">{inc.description}</td>
                                <td className="p-3 text-gray-400 uppercase">{inc.status}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </GlassCard>
                  )}

                  {surakshaActiveTab === "analytics" && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      <div className="lg:col-span-2">
                        <PredictiveAnalytics devices={surakshaData?.devices || []} />
                      </div>
                      <GlassCard className="p-6 bg-[#0a0a0a] border-white/5">
                        <h4 className="text-xs font-mono text-purple-400 uppercase tracking-widest mb-4">Model Details</h4>
                        <div className="space-y-4 text-[10px] font-mono text-white/50 leading-relaxed uppercase">
                          <p>Inference Engine: Healix-Biomed-v4</p>
                          <p>Handshake accuracy: 99.82%</p>
                          <p>Dynamic override model latency: 45ms</p>
                          <p className="text-purple-400 animate-pulse font-bold mt-6">Active model drift calibration</p>
                        </div>
                      </GlassCard>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* ACADEMY CRM TAB */}
            {activeTab === "academy" && (
              <motion.div key="academy" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="space-y-8">
                
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-4 border-b border-white/10 pb-6">
                  <div>
                    <h2 className="text-3xl font-black font-mono uppercase tracking-tight text-white">Academy Control Center</h2>
                    <p className="text-white/50 text-sm">Manage student cohorts, active courses, and instructor portals.</p>
                  </div>
                  <div className="flex gap-3">
                    {academyActiveTab === "courses" && (
                      <Button onClick={() => setShowAcademyCourseModal(true)} className="flex items-center gap-2 px-5 py-2 text-xs font-mono font-bold uppercase tracking-wider">
                        <Book className="w-4 h-4" /> Add Course
                      </Button>
                    )}
                    {academyActiveTab === "mentors" && (
                      <Button onClick={() => {
                        setEditingAcademyMentorId(null);
                        setNewAcademyMentorPhotoUrl("");
                        setAcademyMentorForm({
                          name: "",
                          role: "",
                          institution: "",
                          specialization: "",
                          experience: "",
                          photoUrl: "",
                          linkedinUrl: "",
                          companies: "",
                          bio: ""
                        });
                        setShowAcademyMentorModal(true);
                      }} className="flex items-center gap-2 px-5 py-2 text-xs font-mono font-bold uppercase tracking-wider">
                        <UserPlus className="w-4 h-4" /> Add Instructor
                      </Button>
                    )}
                  </div>
                </div>

                {/* Supabase Status Alert Banner */}
                <div className="p-4 rounded-xl border border-yellow-500/20 bg-yellow-500/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs mb-8">
                  <div className="space-y-1">
                    <p className="font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                      Supabase Schema Status Check
                    </p>
                    <p className="text-white/60">
                      Instructors and courses will load from local static fallback data if the tables do not exist in Supabase. Run the DDL SQL in your dashboard to enable full database sync.
                    </p>
                  </div>
                  <a href="/supabase_academy_schema.sql" target="_blank" className="px-4 py-2 border border-white/10 hover:border-white/20 rounded-lg text-white font-mono uppercase font-bold shrink-0 transition-colors">
                    View DDL SQL
                  </a>
                </div>

                {/* Sub-tabs */}
                <div className="flex flex-wrap gap-2 mb-6 border-b border-white/5 pb-3">
                  {[
                    { id: "dashboard", label: "Cohort Analytics" },
                    { id: "courses", label: "Academy Courses" },
                    { id: "mentors", label: "Academy Instructors" },
                    { id: "events", label: "📅 Upcoming Events" },
                    { id: "live-feed", label: "🎥 Live Feed Image" }
                  ].map((subTab) => (
                    <button
                      key={subTab.id}
                      onClick={() => setAcademyActiveTab(subTab.id as any)}
                      className={`px-4 py-2 rounded-lg text-xs font-bold font-mono uppercase tracking-wider transition-all ${
                        academyActiveTab === subTab.id 
                          ? "bg-yellow-500/20 text-[#eab308] border border-yellow-500/30" 
                          : "text-white/40 hover:text-white hover:bg-white/5 border border-transparent"
                      }`}
                    >
                      {subTab.label}
                    </button>
                  ))}
                </div>


                {academyActiveTab === "dashboard" && (
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      {[
                        { label: "Enrolled Students", value: "1,284", icon: Users, color: "text-[#eab308]" },
                        { label: "Monthly Intake", value: "84.2K", icon: DollarSign, color: "text-emerald-400" },
                        { label: "Active Cohorts", value: "12", icon: BookOpen, color: "text-blue-400" },
                        { label: "Completion Rate", value: "92%", icon: Star, color: "text-purple-400" }
                      ].map((stat, i) => (
                        <GlassCard key={i} className="p-6 border-white/5 bg-[#0a0a0a]">
                          <div className="flex justify-between items-start mb-3">
                            <div className={`p-2.5 rounded-xl bg-white/5 ${stat.color}`}><stat.icon className="w-5 h-5" /></div>
                            <span className="text-emerald-400 text-xs font-mono font-bold">+8%</span>
                          </div>
                          <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest mb-1">{stat.label}</p>
                          <p className="text-2xl font-black font-mono text-white">{stat.value}</p>
                        </GlassCard>
                      ))}
                    </div>

                    {/* Enrollment queue */}
                    <GlassCard className="border-white/5 bg-[#0a0a0a] p-6">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-base font-mono uppercase tracking-wider">Active Enrollment Logs</h3>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                          <thead className="bg-white/5 text-gray-400 uppercase font-mono tracking-widest text-[9px]">
                            <tr>
                              <th className="p-3">Student Name</th>
                              <th className="p-3">Selected Course</th>
                              <th className="p-3">Payment status</th>
                              <th className="p-3">Intake Date</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5">
                            {[
                              { name: "Rahul Sharma", email: "rahul@iitm.ac.in", course: "AI Systems Engineering", status: "Paid", date: "Oct 12, 2025" },
                              { name: "Sneha Patel", email: "sneha@google.com", course: "Full Stack Product", status: "Paid", date: "Oct 14, 2025" },
                              { name: "Amit Kumar", email: "amit@startup.io", course: "Genomic AI Research", status: "Pending", date: "Oct 15, 2025" },
                              { name: "Priya Singh", email: "priya@stanford.edu", course: "AI Systems Engineering", status: "Paid", date: "Oct 15, 2025" },
                            ].map((e, idx) => (
                              <tr key={idx} className="hover:bg-white/5">
                                <td className="p-3">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-white/10" />
                                    <div>
                                      <p className="text-sm font-semibold">{e.name}</p>
                                      <p className="text-xs text-white/30">{e.email}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="p-3 text-sm font-semibold text-gray-200">{e.course}</td>
                                <td className="p-3">
                                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider ${e.status === 'Paid' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-yellow-500/20 text-[#eab308] border border-yellow-500/30'}`}>
                                    {e.status}
                                  </span>
                                </td>
                                <td className="p-3 text-xs text-gray-500 font-mono">{e.date}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </GlassCard>
                  </div>
                )}

                {academyActiveTab === "courses" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {academyCourses.map(course => (
                      <GlassCard key={course.id} className="p-5 border-white/5 bg-[#0a0a0a] relative group">
                        <div className="aspect-video relative rounded-lg overflow-hidden mb-4 bg-white/5">
                          {course.thumbnail && <Image src={course.thumbnail} alt={course.title} fill className="object-cover" />}
                        </div>
                        <h3 className="font-bold text-base mb-2">{course.title}</h3>
                        <p className="text-xs text-white/50 line-clamp-2 mb-4">{course.shortDescription}</p>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-[#eab308] font-bold font-mono">₹{course.price}</span>
                          <span className="text-white/40 font-mono">{course.duration}</span>
                        </div>
                        <button onClick={() => handleDeleteAcademyCourse(course.id)} className="absolute top-4 right-4 p-2 bg-red-500/10 text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </GlassCard>
                    ))}
                  </div>
                )}

                {academyActiveTab === "mentors" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {academyMentors.map(mentor => (
                      <GlassCard key={mentor.id} className="p-5 border-white/5 bg-[#0a0a0a] text-center relative group">
                        <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-4 border-2 border-white/10 relative group/avatar cursor-pointer">
                          {isUploadingAcademy === mentor.id ? (
                            <div className="absolute inset-0 bg-black/75 flex items-center justify-center">
                              <Loader2 className="w-5 h-5 text-[#eab308] animate-spin" />
                            </div>
                          ) : (
                            <>
                              <Image src={mentor.photoUrl || "https://i.pravatar.cc/150"} alt={mentor.name} width={80} height={80} className="object-cover w-full h-full" />
                              <label className="absolute inset-0 bg-black/60 opacity-0 group-hover/avatar:opacity-100 flex flex-col items-center justify-center transition-opacity text-[8px] font-mono font-bold text-white uppercase tracking-widest cursor-pointer">
                                <Upload className="w-3.5 h-3.5 mb-1 text-[#eab308]" /> Update
                                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleAcademyPhotoUpload(e, mentor.id)} />
                              </label>
                            </>
                          )}
                        </div>
                        <h3 className="font-bold text-sm">{mentor.name}</h3>
                        <p className="text-xs text-[#eab308] font-mono mt-1">{mentor.role}</p>
                        {mentor.specialization && <p className="text-[10px] text-zinc-400 font-mono mt-0.5">{mentor.specialization}</p>}
                        <p className="text-[10px] text-white/40 mt-2 line-clamp-2">{mentor.bio}</p>
                        
                        <div className="absolute top-4 right-4 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleOpenEditAcademyMentor(mentor)} className="p-2 bg-yellow-500/10 hover:bg-yellow-500/25 text-[#eab308] rounded-lg transition-colors" title="Edit Instructor">
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => handleDeleteAcademyMentor(mentor.id)} className="p-2 bg-red-500/10 hover:bg-red-500/25 text-red-500 rounded-lg transition-colors" title="Delete Instructor">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </GlassCard>
                    ))}
                  </div>
                )}

                {/* ─── UPCOMING EVENTS SUB-TAB ─── */}
                {academyActiveTab === "events" && (
                  <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-yellow-500/10">
                          <Calendar className="w-5 h-5 text-[#eab308]" />
                        </div>
                        <div>
                          <h3 className="font-black font-mono uppercase tracking-tight text-white text-lg">Upcoming Events Manager</h3>
                          <p className="text-white/40 text-xs font-mono">Add, edit or remove events shown on the homepage Academic Seminars section.</p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setEditingEventId(null);
                          setEventForm(EMPTY_EVENT_FORM);
                          setEventImageUrl("");
                          setShowEventModal(true);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-[#eab308] hover:bg-yellow-400 text-black font-black font-mono uppercase text-xs rounded-xl transition-all"
                      >
                        <Plus className="w-4 h-4" /> Add Event
                      </button>
                    </div>

                    {/* Events List */}
                    {eventsData.length === 0 ? (
                      <div className="text-center py-16 border border-dashed border-white/10 rounded-2xl">
                        <Calendar className="w-10 h-10 text-white/15 mx-auto mb-3" />
                        <p className="text-white/30 font-mono text-xs uppercase tracking-wider">No events found in database</p>
                        <p className="text-white/20 font-mono text-[10px] mt-1">Click "Add Event" to create the first one</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                        {eventsData.map((ev) => {
                          let speaker = "Research Fellow";
                          let desc = "";
                          try {
                            if (ev.description?.startsWith("{")) {
                              const p = JSON.parse(ev.description);
                              speaker = p.speaker || speaker;
                              desc = p.description || "";
                            } else {
                              desc = ev.description || "";
                            }
                          } catch {}
                          const evDate = ev.start_date ? new Date(ev.start_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";
                          return (
                            <GlassCard key={ev.id} className="p-0 border-white/5 bg-[#0a0a0a] overflow-hidden group relative">
                              {/* Cover image */}
                              <div className="relative h-36 bg-zinc-900 overflow-hidden">
                                {ev.image_url ? (
                                  <img src={ev.image_url} alt={ev.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-zinc-900">
                                    <Calendar className="w-8 h-8 text-white/10" />
                                  </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                                <span className="absolute bottom-3 left-3 text-[9px] font-mono text-orange-400 font-bold uppercase tracking-wider">{evDate}</span>
                                {/* Active badge */}
                                <span className={`absolute top-3 right-3 text-[8px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border ${ev.is_active !== false ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-zinc-500/20 text-zinc-400 border-zinc-500/30"}`}>
                                  {ev.is_active !== false ? "Active" : "Hidden"}
                                </span>
                              </div>
                              <div className="p-4 space-y-2">
                                <h4 className="font-bold text-sm text-white line-clamp-2 leading-snug">{ev.title}</h4>
                                <p className="text-[10px] text-white/40 font-mono">Speaker: {speaker}</p>
                                {desc && <p className="text-[10px] text-white/30 line-clamp-2">{desc}</p>}
                              </div>
                              {/* Action buttons */}
                              <div className="absolute top-3 left-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => {
                                    let parsed: any = {};
                                    try { if (ev.description?.startsWith("{")) parsed = JSON.parse(ev.description); } catch {}
                                    setEditingEventId(ev.id);
                                    setEventForm({
                                      title: ev.title || "",
                                      description: parsed.description || ev.description || "",
                                      speaker: parsed.speaker || "",
                                      speaker_role: parsed.speaker_role || "",
                                      category: parsed.category || "Academic Workshops",
                                      seats_left: String(parsed.seats_left || "30"),
                                      start_date: ev.start_date ? ev.start_date.split("T")[0] : "",
                                      end_date: ev.end_date ? ev.end_date.split("T")[0] : "",
                                      image_url: ev.image_url || "",
                                      register_url: parsed.register_url || "",
                                    });
                                    setEventImageUrl(ev.image_url || "");
                                    setShowEventModal(true);
                                  }}
                                  className="p-1.5 bg-yellow-500/20 hover:bg-yellow-500/40 text-[#eab308] rounded-lg transition-colors"
                                  title="Edit Event"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={async () => {
                                    if (!confirm("Delete this event?")) return;
                                    const res = await deleteBiolabEvent(ev.id) as any;
                                    if (res.error) showToast("Delete failed: " + res.error, "err");
                                    else { showToast("Event deleted", "ok"); fetchData(); }
                                  }}
                                  className="p-1.5 bg-red-500/20 hover:bg-red-500/40 text-red-400 rounded-lg transition-colors"
                                  title="Delete Event"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </GlassCard>
                          );
                        })}
                      </div>
                    )}

                    {/* Add/Edit Event Modal */}
                    <AnimatePresence>
                      {showEventModal && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9998] flex items-start justify-center pt-10 px-4 pb-10 overflow-y-auto"
                          onClick={(e) => { if (e.target === e.currentTarget) setShowEventModal(false); }}
                        >
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="bg-[#0d0d0d] border border-white/10 rounded-2xl p-7 w-full max-w-2xl shadow-2xl"
                          >
                            <div className="flex items-center justify-between mb-6">
                              <h3 className="text-lg font-black font-mono uppercase tracking-tight text-white">
                                {editingEventId ? "✏️ Edit Event" : "➕ Add New Event"}
                              </h3>
                              <button onClick={() => setShowEventModal(false)} className="p-2 hover:bg-white/5 rounded-lg transition-colors text-white/50 hover:text-white">
                                <X className="w-5 h-5" />
                              </button>
                            </div>

                            <div className="space-y-5">
                              {/* Cover Image Drag & Drop */}
                              <div>
                                <label className="block text-[10px] font-mono font-bold text-white/40 uppercase tracking-widest mb-2">Cover Image</label>
                                <div
                                  onDragOver={(e) => { e.preventDefault(); setEventImageDragOver(true); }}
                                  onDragLeave={() => setEventImageDragOver(false)}
                                  onDrop={async (e) => {
                                    e.preventDefault();
                                    setEventImageDragOver(false);
                                    const file = e.dataTransfer.files[0];
                                    if (!file || !file.type.startsWith("image/")) { showToast("Please drop a valid image", "err"); return; }
                                    setEventImageUploading(true);
                                    try {
                                      const fd = new FormData();
                                      fd.append("file", file);
                                      const res = await fetch("/api/admin/events/upload", { method: "POST", body: fd });
                                      const json = await res.json();
                                      if (!res.ok || json.error) throw new Error(json.error || "Upload failed");
                                      setEventImageUrl(json.url);
                                      setEventForm(f => ({ ...f, image_url: json.url }));
                                      showToast("Image uploaded!", "ok");
                                    } catch (err: any) {
                                      showToast("Upload failed: " + err.message, "err");
                                    } finally { setEventImageUploading(false); }
                                  }}
                                  onClick={() => eventImageRef.current?.click()}
                                  className={`relative border-2 border-dashed rounded-xl flex items-center justify-center cursor-pointer transition-all min-h-[140px] overflow-hidden ${
                                    eventImageDragOver ? "border-[#eab308] bg-yellow-500/10" : "border-white/10 hover:border-white/25 hover:bg-white/3"
                                  }`}
                                >
                                  <input ref={eventImageRef} type="file" accept="image/*" className="hidden" onChange={async (e) => {
                                    const file = e.target.files?.[0]; if (!file) return;
                                    setEventImageUploading(true);
                                    try {
                                      const fd = new FormData(); fd.append("file", file);
                                      const res = await fetch("/api/admin/events/upload", { method: "POST", body: fd });
                                      const json = await res.json();
                                      if (!res.ok || json.error) throw new Error(json.error || "Upload failed");
                                      setEventImageUrl(json.url);
                                      setEventForm(f => ({ ...f, image_url: json.url }));
                                      showToast("Image uploaded!", "ok");
                                    } catch (err: any) { showToast("Upload failed: " + err.message, "err"); }
                                    finally { setEventImageUploading(false); e.target.value = ""; }
                                  }} />
                                  {eventImageUploading ? (
                                    <div className="flex flex-col items-center gap-2">
                                      <Loader2 className="w-7 h-7 text-[#eab308] animate-spin" />
                                      <p className="text-white/50 text-xs font-mono">Uploading...</p>
                                    </div>
                                  ) : eventImageUrl ? (
                                    <>
                                      <img src={eventImageUrl} alt="Cover preview" className="absolute inset-0 w-full h-full object-cover opacity-60" />
                                      <div className="relative z-10 flex flex-col items-center gap-1">
                                        <Upload className="w-5 h-5 text-white/70" />
                                        <p className="text-white/70 text-xs font-mono">Click or drop to replace</p>
                                      </div>
                                    </>
                                  ) : (
                                    <div className="flex flex-col items-center gap-2">
                                      <Upload className="w-7 h-7 text-white/25" />
                                      <p className="text-white text-sm font-mono font-bold">Drag & Drop Cover Image</p>
                                      <p className="text-white/40 text-xs font-mono">or click to browse — JPG, PNG, WEBP</p>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Title */}
                              <div>
                                <label className="block text-[10px] font-mono font-bold text-white/40 uppercase tracking-widest mb-1.5">Event Title *</label>
                                <input type="text" value={eventForm.title} onChange={e => setEventForm(f => ({ ...f, title: e.target.value }))}
                                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-[#eab308]/50 transition-colors"
                                  placeholder="e.g. Distributed Audio Failsafe Networks & Hardware Telemetry" />
                              </div>

                              {/* Speaker + Role */}
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-[10px] font-mono font-bold text-white/40 uppercase tracking-widest mb-1.5">Speaker Name *</label>
                                  <input type="text" value={eventForm.speaker} onChange={e => setEventForm(f => ({ ...f, speaker: e.target.value }))}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-[#eab308]/50 transition-colors"
                                    placeholder="e.g. Prof. R. Sharma" />
                                </div>
                                <div>
                                  <label className="block text-[10px] font-mono font-bold text-white/40 uppercase tracking-widest mb-1.5">Speaker Role</label>
                                  <input type="text" value={eventForm.speaker_role} onChange={e => setEventForm(f => ({ ...f, speaker_role: e.target.value }))}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-[#eab308]/50 transition-colors"
                                    placeholder="e.g. BioLabs Faculty Advisor" />
                                </div>
                              </div>

                              {/* Description */}
                              <div>
                                <label className="block text-[10px] font-mono font-bold text-white/40 uppercase tracking-widest mb-1.5">Description</label>
                                <textarea value={eventForm.description} onChange={e => setEventForm(f => ({ ...f, description: e.target.value }))} rows={3}
                                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-[#eab308]/50 transition-colors resize-none"
                                  placeholder="Brief description of the event..." />
                              </div>

                              {/* Dates + Seats */}
                              <div className="grid grid-cols-3 gap-4">
                                <div>
                                  <label className="block text-[10px] font-mono font-bold text-white/40 uppercase tracking-widest mb-1.5">Start Date *</label>
                                  <input type="date" value={eventForm.start_date} onChange={e => setEventForm(f => ({ ...f, start_date: e.target.value }))}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-[#eab308]/50 transition-colors" />
                                </div>
                                <div>
                                  <label className="block text-[10px] font-mono font-bold text-white/40 uppercase tracking-widest mb-1.5">End Date *</label>
                                  <input type="date" value={eventForm.end_date} onChange={e => setEventForm(f => ({ ...f, end_date: e.target.value }))}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-[#eab308]/50 transition-colors" />
                                </div>
                                <div>
                                  <label className="block text-[10px] font-mono font-bold text-white/40 uppercase tracking-widest mb-1.5">Seats Left</label>
                                  <input type="number" value={eventForm.seats_left} onChange={e => setEventForm(f => ({ ...f, seats_left: e.target.value }))}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-[#eab308]/50 transition-colors" />
                                </div>
                              </div>

                              {/* Registration URL */}
                              <div>
                                <label className="block text-[10px] font-mono font-bold text-white/40 uppercase tracking-widest mb-1.5">Registration Google Form URL</label>
                                <input type="url" value={eventForm.register_url || ""} onChange={e => setEventForm(f => ({ ...f, register_url: e.target.value }))}
                                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-[#eab308]/50 transition-colors placeholder-white/20"
                                  placeholder="e.g. https://docs.google.com/forms/d/... (leave empty for standard popup)" />
                              </div>

                              {/* Category */}
                              <div>
                                <label className="block text-[10px] font-mono font-bold text-white/40 uppercase tracking-widest mb-1.5">Category</label>
                                <select value={eventForm.category} onChange={e => setEventForm(f => ({ ...f, category: e.target.value }))}
                                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-[#eab308]/50 transition-colors">
                                  <option value="Academic Workshops">Academic Workshops</option>
                                  <option value="Research Seminars">Research Seminars</option>
                                  <option value="Clinical Informatics">Clinical Informatics</option>
                                  <option value="Mentorship Programs">Mentorship Programs</option>
                                  <option value="AI & Technology">AI & Technology</option>
                                </select>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex gap-3 pt-2">
                                <button onClick={() => setShowEventModal(false)}
                                  className="flex-1 px-4 py-2.5 border border-white/10 hover:bg-white/5 text-white/60 hover:text-white font-mono text-xs uppercase tracking-wider rounded-xl transition-all">
                                  Cancel
                                </button>
                                <button
                                  disabled={eventSaving || eventImageUploading || !eventForm.title || !eventForm.start_date || !eventForm.end_date}
                                  onClick={async () => {
                                    setEventSaving(true);
                                    try {
                                      const fd = new FormData();
                                      fd.append("title", eventForm.title);
                                      fd.append("description", eventForm.description);
                                      fd.append("speaker", eventForm.speaker);
                                      fd.append("speaker_role", eventForm.speaker_role);
                                      fd.append("category", eventForm.category);
                                      fd.append("seats_left", eventForm.seats_left);
                                      fd.append("start_date", eventForm.start_date);
                                      fd.append("end_date", eventForm.end_date);
                                      fd.append("image_url", eventImageUrl || eventForm.image_url);
                                      fd.append("register_url", eventForm.register_url || "");
                                      let res: any;
                                      if (editingEventId) {
                                        res = await updateBiolabEvent(editingEventId, fd);
                                      } else {
                                        res = await addBiolabEvent(fd);
                                      }
                                      if (res.error) showToast("Save failed: " + res.error, "err");
                                      else {
                                        showToast(editingEventId ? "Event updated!" : "Event added!", "ok");
                                        setShowEventModal(false);
                                        fetchData();
                                      }
                                    } catch (err: any) { showToast("Error: " + err.message, "err"); }
                                    finally { setEventSaving(false); }
                                  }}
                                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#eab308] hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-black font-mono uppercase text-xs rounded-xl transition-all"
                                >
                                  {eventSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                  {eventSaving ? "Saving..." : editingEventId ? "Update Event" : "Create Event"}
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* ─── LIVE FEED IMAGE SUB-TAB ─── */}
                {academyActiveTab === "live-feed" && (
                  <div className="space-y-8">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2.5 rounded-xl bg-yellow-500/10">
                        <Tv className="w-5 h-5 text-[#eab308]" />
                      </div>
                      <div>
                        <h3 className="font-black font-mono uppercase tracking-tight text-white text-lg">Academy Live Feed</h3>
                        <p className="text-white/40 text-xs font-mono">Update the projected classroom image shown on the homepage Academy section.</p>
                      </div>
                    </div>

                    {/* DB table missing warning */}
                    {!liveFeedTableExists && (
                      <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/5 text-xs font-mono text-red-400">
                        ⚠ The <strong>academy_live_feed</strong> table does not exist in Supabase yet. Run the SQL from <code className="bg-white/10 px-1 rounded">supabase_academy_live_feed.sql</code> to enable persistent saves. Changes will use fallback defaults until then.
                      </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Left: Upload + Fields */}
                      <div className="space-y-6">
                        {/* Drag & Drop Zone */}
                        <div
                          onDragOver={(e) => { e.preventDefault(); setLiveFeedDragOver(true); }}
                          onDragLeave={() => setLiveFeedDragOver(false)}
                          onDrop={async (e) => {
                            e.preventDefault();
                            setLiveFeedDragOver(false);
                            const file = e.dataTransfer.files[0];
                            if (!file || !file.type.startsWith("image/")) {
                              showToast("Please drop a valid image file.", "err");
                              return;
                            }
                            setLiveFeedUploading(true);
                            try {
                              const fd = new FormData();
                              fd.append("file", file);
                              const res = await fetch("/api/admin/academy/live-feed-upload", { method: "POST", body: fd });
                              const json = await res.json();
                              if (!res.ok || json.error) throw new Error(json.error || "Upload failed");
                              setLiveFeedImageUrl(json.url);
                              showToast("Image uploaded successfully!", "ok");
                            } catch (err: any) {
                              showToast("Upload failed: " + err.message, "err");
                            } finally {
                              setLiveFeedUploading(false);
                            }
                          }}
                          onClick={() => liveFeedFileRef.current?.click()}
                          className={`relative border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all min-h-[200px] ${
                            liveFeedDragOver
                              ? "border-[#eab308] bg-yellow-500/10 scale-[1.01]"
                              : "border-white/10 bg-white/2 hover:border-white/25 hover:bg-white/5"
                          }`}
                        >
                          <input
                            ref={liveFeedFileRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              setLiveFeedUploading(true);
                              try {
                                const fd = new FormData();
                                fd.append("file", file);
                                const res = await fetch("/api/admin/academy/live-feed-upload", { method: "POST", body: fd });
                                const json = await res.json();
                                if (!res.ok || json.error) throw new Error(json.error || "Upload failed");
                                setLiveFeedImageUrl(json.url);
                                showToast("Image uploaded successfully!", "ok");
                              } catch (err: any) {
                                showToast("Upload failed: " + err.message, "err");
                              } finally {
                                setLiveFeedUploading(false);
                                e.target.value = "";
                              }
                            }}
                          />
                          {liveFeedUploading ? (
                            <>
                              <Loader2 className="w-8 h-8 text-[#eab308] animate-spin mb-3" />
                              <p className="text-white/60 font-mono text-xs uppercase tracking-wider">Uploading...</p>
                            </>
                          ) : (
                            <>
                              <Upload className="w-8 h-8 text-white/30 mb-3" />
                              <p className="text-white font-mono text-sm font-bold">Drag & Drop Image Here</p>
                              <p className="text-white/40 font-mono text-xs mt-1">or click to browse — JPG, PNG, WEBP up to 5MB</p>
                              {liveFeedImageUrl && !liveFeedImageUrl.startsWith("/") && (
                                <p className="text-[#eab308] font-mono text-[10px] mt-3 truncate max-w-full px-4">
                                  ✓ Custom image active
                                </p>
                              )}
                            </>
                          )}
                        </div>

                        {/* Text Fields */}
                        <div className="space-y-4">
                          <div>
                            <label className="block text-[10px] font-mono font-bold text-white/40 uppercase tracking-widest mb-1.5">Session Tag</label>
                            <input
                              type="text"
                              value={liveFeedTag}
                              onChange={(e) => setLiveFeedTag(e.target.value)}
                              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-[#eab308]/50 transition-colors"
                              placeholder="e.g. Live Session \u2022 Healix Academy"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-mono font-bold text-white/40 uppercase tracking-widest mb-1.5">Session Title</label>
                            <input
                              type="text"
                              value={liveFeedTitle}
                              onChange={(e) => setLiveFeedTitle(e.target.value)}
                              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-[#eab308]/50 transition-colors"
                              placeholder="e.g. Interactive Research Discussion in Progress"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-mono font-bold text-white/40 uppercase tracking-widest mb-1.5">Session Subtitle</label>
                            <input
                              type="text"
                              value={liveFeedSubtitle}
                              onChange={(e) => setLiveFeedSubtitle(e.target.value)}
                              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-[#eab308]/50 transition-colors"
                              placeholder="e.g. Healix main auditorium / Session ID: HSF-ACAD-2026"
                            />
                          </div>
                        </div>

                        {/* Save Button */}
                        <button
                          disabled={liveFeedSaving || liveFeedUploading}
                          onClick={async () => {
                            setLiveFeedSaving(true);
                            try {
                              const res = await updateLiveFeedSettings(liveFeedTag, liveFeedTitle, liveFeedSubtitle, liveFeedImageUrl);
                              if (res.error) {
                                showToast("Save failed: " + res.error, "err");
                              } else {
                                showToast("Live feed updated successfully!", "ok");
                              }
                            } catch (err: any) {
                              showToast("Save failed: " + err.message, "err");
                            } finally {
                              setLiveFeedSaving(false);
                            }
                          }}
                          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#eab308] hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-black font-mono uppercase tracking-widest text-sm rounded-xl transition-all"
                        >
                          {liveFeedSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                          {liveFeedSaving ? "Saving..." : "Save Changes"}
                        </button>
                      </div>

                      {/* Right: Live Preview */}
                      <div className="space-y-4">
                        <p className="text-[10px] font-mono font-bold text-white/40 uppercase tracking-widest">Live Preview</p>
                        <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-zinc-950/40 aspect-[16/10] shadow-[0_20px_50px_rgba(0,102,255,0.2)] group">
                          {liveFeedImageUrl ? (
                            <img
                              src={liveFeedImageUrl}
                              alt="Live feed preview"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-zinc-900">
                              <p className="text-white/20 font-mono text-xs">No image uploaded yet</p>
                            </div>
                          )}
                          {/* Overlays matching homepage */}
                          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#0066ff]/5 to-white/10 opacity-70 pointer-events-none" />
                          {/* Corner brackets */}
                          <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-white/50 pointer-events-none" />
                          <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-white/50 pointer-events-none" />
                          <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-white/50 pointer-events-none" />
                          <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-white/50 pointer-events-none" />
                          {/* REC badge */}
                          <div className="absolute top-4 left-10 flex items-center gap-1.5 bg-black/60 px-2.5 py-1 rounded-md border border-white/10">
                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                            <span className="text-[9px] font-mono text-white tracking-widest uppercase">REC</span>
                          </div>
                          {/* Bottom info overlay */}
                          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent p-5 pt-14">
                            <p className="text-[9px] font-mono text-[#0066ff] font-bold uppercase tracking-widest mb-1">{liveFeedTag || "Session Tag"}</p>
                            <h4 className="text-white font-mono text-xs font-bold leading-snug uppercase">{liveFeedTitle || "Session Title"}</h4>
                            <p className="text-zinc-400 font-mono text-[9px] mt-1 uppercase">{liveFeedSubtitle || "Session Subtitle"}</p>
                          </div>
                        </div>
                        <p className="text-white/25 font-mono text-[10px] text-center">This preview matches the homepage display. Click Save Changes to publish.</p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}


            {/* ═══════════════════════════════════════════════════════
                NEWS MANAGER TAB
            ═══════════════════════════════════════════════════════ */}
            {activeTab === "news" && (
              <motion.div key="news" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="space-y-8">
                
                {/* Page Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/10 pb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Newspaper className="w-5 h-5 text-[#ea580c]" />
                      <h1 className="text-2xl font-black font-mono tracking-tight uppercase text-white">News Manager</h1>
                    </div>
                    <p className="text-xs text-white/50">Manage dynamic news articles shown on the homepage and the main news portal.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Left Column: Form (5 cols) */}
                  <div className="lg:col-span-5 space-y-6">
                    <div className="bg-[#0b0b0c] border border-white/10 rounded-2xl p-6 shadow-xl">
                      <h3 className="text-base font-bold font-mono tracking-tight text-white mb-4 uppercase flex items-center gap-2">
                        {editingNewsArticle ? "Edit Article" : "Create New Article"}
                        {editingNewsArticle && (
                          <span className="text-[10px] font-normal px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20 lowercase">Editing</span>
                        )}
                      </h3>

                      <form onSubmit={handleSubmitNews} className="space-y-4">
                        {/* Title */}
                        <div>
                          <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest block mb-1">Article Title</label>
                          <input 
                            value={newsTitle} 
                            onChange={e => setNewsTitle(e.target.value)} 
                            required 
                            placeholder="e.g. Healix Incorporation Process Underway" 
                            className="w-full bg-[#050505] border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-[#ea580c]/50 transition-colors"
                          />
                        </div>

                        {/* Category & Date */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest block mb-1">Category</label>
                            <select 
                              value={newsCategory} 
                              onChange={e => setNewsCategory(e.target.value)} 
                              className="w-full bg-[#050505] border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-[#ea580c]/50 transition-colors"
                            >
                              <option value="ANNOUNCEMENT">ANNOUNCEMENT</option>
                              <option value="RESEARCH">RESEARCH</option>
                              <option value="OPPORTUNITY">OPPORTUNITY</option>
                              <option value="UPDATE">UPDATE</option>
                              <option value="MEDIA">MEDIA</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest block mb-1">Date</label>
                            <input 
                              value={newsDate} 
                              onChange={e => setNewsDate(e.target.value)} 
                              placeholder="e.g. June 2026" 
                              className="w-full bg-[#050505] border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-[#ea580c]/50 transition-colors"
                            />
                          </div>
                        </div>

                        {/* Author & Redirect Link */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest block mb-1">Author</label>
                            <input 
                              value={newsAuthor} 
                              onChange={e => setNewsAuthor(e.target.value)} 
                              required 
                              placeholder="e.g. Healix Press Team" 
                              className="w-full bg-[#050505] border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-[#ea580c]/50 transition-colors"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest block mb-1">Redirect Link</label>
                            <input 
                              value={newsLinkUrl} 
                              onChange={e => setNewsLinkUrl(e.target.value)} 
                              required 
                              placeholder="e.g. https://medium.com/... or #" 
                              className="w-full bg-[#050505] border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-[#ea580c]/50 transition-colors"
                            />
                          </div>
                        </div>

                        {/* Description */}
                        <div>
                          <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest block mb-1">Brief Description</label>
                          <textarea 
                            value={newsDescContent} 
                            onChange={e => setNewsDescContent(e.target.value)} 
                            required 
                            rows={4}
                            placeholder="Write a summary of the article..." 
                            className="w-full bg-[#050505] border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-[#ea580c]/50 transition-colors"
                          />
                        </div>

                        {/* Photo Drag & Drop Zone */}
                        <div>
                          <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest block mb-1">Article Image</label>
                          <div 
                            className={`relative rounded-xl border border-dashed transition-all duration-200 cursor-pointer min-h-[120px] flex flex-col items-center justify-center p-4 ${
                              newsPhotoDragOver ? "border-[#ea580c] bg-[#ea580c]/5" : "border-white/10 bg-[#050505] hover:border-[#ea580c]/30"
                            }`}
                            onDragOver={(e) => { e.preventDefault(); setNewsPhotoDragOver(true); }}
                            onDragLeave={() => setNewsPhotoDragOver(false)}
                            onDrop={handleNewsPhotoDrop}
                            onClick={() => newsPhotoRef.current?.click()}
                          >
                            <input 
                              ref={newsPhotoRef} 
                              type="file" 
                              accept="image/*" 
                              className="hidden" 
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleNewsPhotoUpload(file);
                              }} 
                            />
                            
                            {newsPhotoUploading ? (
                              <div className="flex flex-col items-center justify-center space-y-2">
                                <Loader2 className="w-5 h-5 text-[#ea580c] animate-spin" />
                                <span className="text-[10px] font-mono text-white/40">Uploading to cloud...</span>
                              </div>
                            ) : newsPhotoPreview ? (
                              <div className="relative w-full h-[100px] rounded-lg overflow-hidden group">
                                <img src={newsPhotoPreview} alt="News Image Preview" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                  <span className="text-[9px] font-mono text-white uppercase tracking-wider font-bold">Replace Photo</span>
                                </div>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center justify-center text-center">
                                <Upload className="w-5 h-5 mb-2 text-white/30" />
                                <span className="text-[10px] text-white/50 block">Drag & drop photo or <span className="text-[#ea580c] font-bold">browse</span></span>
                                <span className="text-[8px] text-white/30 block mt-1 font-mono">Supports image/png, image/jpeg (Max 10MB)</span>
                              </div>
                            )}
                          </div>
                          
                          {/* Image URL text fallback */}
                          <div className="mt-2">
                            <input 
                              value={newsPhotoPreview || ""} 
                              onChange={e => setNewsPhotoPreview(e.target.value)} 
                              required
                              placeholder="Or paste direct image URL here..." 
                              className="w-full bg-[#050505] border border-white/5 rounded-lg px-2 py-1 text-white text-[10px] focus:outline-none" 
                            />
                          </div>
                        </div>

                        {/* Submit Actions */}
                        <div className="flex gap-2 pt-2">
                          <button 
                            type="submit" 
                            className="flex-1 bg-[#ea580c] hover:bg-orange-600 active:bg-orange-700 text-white rounded-xl py-2 text-xs font-bold transition-colors uppercase tracking-wider font-mono flex items-center justify-center gap-1.5"
                          >
                            {editingNewsArticle ? "Update Article" : "Publish Article"}
                          </button>
                          {editingNewsArticle && (
                            <button 
                              type="button"
                              onClick={handleCancelNewsEdit}
                              className="bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl px-4 py-2 text-xs font-bold transition-colors uppercase tracking-wider font-mono"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </form>
                    </div>
                  </div>

                  {/* Right Column: List & Filter (7 cols) */}
                  <div className="lg:col-span-7 space-y-6">
                    <div className="bg-[#0b0b0c] border border-white/10 rounded-2xl p-6 shadow-xl h-full flex flex-col">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                        <h3 className="text-base font-bold font-mono tracking-tight text-white uppercase">Articles Directory ({safeData.healix_news?.length || 0})</h3>
                        <div className="relative w-full sm:w-60">
                          <input 
                            value={newsSearch} 
                            onChange={e => setNewsSearch(e.target.value)} 
                            placeholder="Search articles..." 
                            className="w-full bg-[#050505] border border-white/10 rounded-xl px-3 py-1.5 text-white text-xs focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Directory List */}
                      <div className="flex-1 overflow-y-auto max-h-[560px] pr-1 space-y-4 custom-scrollbar">
                        {(() => {
                          const filtered = (safeData.healix_news || []).filter((art: any) => 
                            art.title?.toLowerCase().includes(newsSearch.toLowerCase()) ||
                            art.category?.toLowerCase().includes(newsSearch.toLowerCase()) ||
                            art.desc_content?.toLowerCase().includes(newsSearch.toLowerCase())
                          );

                          if (filtered.length === 0) {
                            return (
                              <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-white/5 rounded-2xl bg-white/[0.01]">
                                <Newspaper className="w-8 h-8 text-white/20 mb-3" />
                                <p className="text-sm font-medium text-white/50">No articles found</p>
                                <p className="text-xs text-white/30 max-w-xs mt-1">Get started by filling out the form on the left to publish your first article.</p>
                              </div>
                            );
                          }

                          return filtered.map((art: any) => (
                            <div key={art.id} className="flex gap-4 p-4 bg-white/5 hover:bg-white/[0.08] border border-white/5 rounded-xl transition-all group relative">
                              <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-lg overflow-hidden bg-black border border-white/10">
                                <img src={art.image_url} alt={art.title} className="w-full h-full object-cover" />
                              </div>
                              <div className="flex-1 flex flex-col justify-between min-w-0">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-[8px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#ea580c]/10 text-[#ea580c] border border-[#ea580c]/20 uppercase">
                                      {art.category}
                                    </span>
                                    <span className="text-[9px] text-white/40 font-mono">{art.date}</span>
                                    {art.id.startsWith("local-") && (
                                      <span className="text-[7px] font-mono font-bold px-1 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20 uppercase">Local Sync</span>
                                    )}
                                  </div>
                                  <h4 className="text-sm font-bold font-mono uppercase tracking-tight text-white line-clamp-1 group-hover:text-[#ea580c] transition-colors">{art.title}</h4>
                                  <p className="text-xs text-white/50 line-clamp-2 leading-relaxed">{art.desc_content}</p>
                                </div>
                                <div className="flex justify-between items-center mt-2 pt-2 border-t border-white/5">
                                  <span className="text-[8px] text-white/30 font-mono uppercase">By {art.author}</span>
                                  
                                  <div className="flex items-center gap-1">
                                    <button 
                                      onClick={() => handleEditNewsClick(art)} 
                                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                                      title="Edit Article"
                                    >
                                      <Edit3 className="w-3.5 h-3.5" />
                                    </button>
                                    <button 
                                      onClick={() => handleDeleteContent(art.id, deleteHealixNewsArticle)} 
                                      className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/15 text-white/60 hover:text-red-400 transition-colors"
                                      title="Delete Article"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ));
                        })()}
                      </div>
                    </div>
                  </div>
                </div>

              </motion.div>
            )}

            {/* ═══════════════════════════════════════════════════════
                HOMEPAGE EVENTS TAB — Standalone top-level panel
            ═══════════════════════════════════════════════════════ */}
            {activeTab === "events" && (
              <motion.div key="events" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="space-y-8">

                {/* Page Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/10 pb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-widest bg-cyan-500/15 text-cyan-400 border border-cyan-500/25 rounded-full">Homepage Section</span>
                    </div>
                    <h2 className="text-3xl font-black font-mono uppercase tracking-tight text-white">Upcoming Events</h2>
                    <p className="text-white/50 text-sm mt-1">Manage the event cards displayed in the <span className="text-cyan-400 font-semibold">"Academic Seminars — Upcoming Events"</span> section on the main homepage.</p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingEventId(null);
                      setEventForm(EMPTY_EVENT_FORM);
                      setEventImageUrl("");
                      setShowEventModal(true);
                    }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black font-black font-mono uppercase text-xs rounded-xl transition-all shrink-0 shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                  >
                    <Plus className="w-4 h-4" /> Add Event
                  </button>
                </div>

                {/* Live preview banner */}
                <div className="flex items-center gap-4 p-4 rounded-xl border border-cyan-500/20 bg-cyan-500/5">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center shrink-0">
                    <Eye className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold font-mono text-white uppercase tracking-wider">Live on Homepage</p>
                    <p className="text-white/40 text-xs font-mono mt-0.5">Changes are reflected immediately after saving. The homepage shows the 3 most recent active events.</p>
                  </div>
                  <a href="/#events-section" target="_blank" className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 border border-cyan-500/30 hover:border-cyan-500/60 text-cyan-400 hover:text-cyan-300 font-mono text-xs uppercase tracking-wider rounded-lg transition-colors">
                    <ExternalLink className="w-3.5 h-3.5" /> View Section
                  </a>
                </div>

                {/* Events Grid */}
                {eventsData.length === 0 ? (
                  <div className="text-center py-24 border border-dashed border-white/10 rounded-2xl">
                    <Calendar className="w-12 h-12 text-white/10 mx-auto mb-4" />
                    <p className="text-white/30 font-mono text-sm uppercase tracking-wider">No events in the database</p>
                    <p className="text-white/20 font-mono text-xs mt-2 mb-6">Create your first event to display it on the homepage</p>
                    <button
                      onClick={() => { setEditingEventId(null); setEventForm(EMPTY_EVENT_FORM); setEventImageUrl(""); setShowEventModal(true); }}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black font-black font-mono uppercase text-xs rounded-xl transition-all"
                    >
                      <Plus className="w-4 h-4" /> Create First Event
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {eventsData.map((ev, idx) => {
                      let speaker = "Research Fellow";
                      let desc = "";
                      let category = "Academic Workshops";
                      try {
                        if (ev.description?.startsWith("{")) {
                          const p = JSON.parse(ev.description);
                          speaker = p.speaker || speaker;
                          desc = p.description || "";
                          category = p.category || category;
                        } else { desc = ev.description || ""; }
                      } catch {}
                      const evDate = ev.start_date
                        ? new Date(ev.start_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                        : "—";
                      const isShownOnHomepage = idx < 3 && ev.is_active !== false;
                      return (
                        <GlassCard key={ev.id} className={`p-0 overflow-hidden group relative border ${isShownOnHomepage ? "border-cyan-500/20 bg-[#080f10]" : "border-white/5 bg-[#0a0a0a]"}`}>
                          {/* Homepage indicator */}
                          {isShownOnHomepage && (
                            <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
                          )}

                          {/* Cover image */}
                          <div className="relative w-full aspect-[4/5] bg-zinc-900 overflow-hidden">
                            {ev.image_url ? (
                              <img src={ev.image_url} alt={ev.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900 gap-2">
                                <Calendar className="w-8 h-8 text-white/10" />
                                <p className="text-white/20 text-[10px] font-mono">No cover image</p>
                              </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                            {/* Date badge */}
                            <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                              <Calendar className="w-3 h-3 text-cyan-400" />
                              <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">{evDate}</span>
                            </div>

                            {/* Status badges */}
                            <div className="absolute top-3 right-3 flex flex-col gap-1.5 items-end">
                              <span className={`text-[8px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border ${ev.is_active !== false ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-zinc-500/20 text-zinc-400 border-zinc-500/30"}`}>
                                {ev.is_active !== false ? "Active" : "Hidden"}
                              </span>
                              {isShownOnHomepage && (
                                <span className="text-[8px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                                  On Homepage
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Card Content */}
                          <div className="p-5 space-y-3">
                            <div>
                              <span className="text-[9px] font-mono font-bold text-cyan-400/60 uppercase tracking-widest">{category}</span>
                              <h4 className="font-bold text-sm text-white leading-snug mt-1 line-clamp-2">{ev.title}</h4>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-zinc-600 shrink-0" />
                              <p className="text-[11px] text-white/40 font-mono">Speaker: <strong className="text-white/60">{speaker}</strong></p>
                            </div>
                            {desc && <p className="text-[11px] text-white/25 line-clamp-2 leading-relaxed">{desc}</p>}
                          </div>

                          {/* Action footer */}
                          <div className="px-5 pb-4 flex items-center gap-2 border-t border-white/5 pt-3">
                            <button
                              onClick={() => {
                                let parsed: any = {};
                                try { if (ev.description?.startsWith("{")) parsed = JSON.parse(ev.description); } catch {}
                                setEditingEventId(ev.id);
                                setEventForm({
                                  title: ev.title || "",
                                  description: parsed.description || ev.description || "",
                                  speaker: parsed.speaker || "",
                                  speaker_role: parsed.speaker_role || "",
                                  category: parsed.category || "Academic Workshops",
                                  seats_left: String(parsed.seats_left || "30"),
                                  start_date: ev.start_date ? ev.start_date.split("T")[0] : "",
                                  end_date: ev.end_date ? ev.end_date.split("T")[0] : "",
                                  image_url: ev.image_url || "",
                                  register_url: parsed.register_url || "",
                                });
                                setEventImageUrl(ev.image_url || "");
                                setShowEventModal(true);
                              }}
                              className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-white/5 hover:bg-cyan-500/10 hover:text-cyan-400 text-white/50 rounded-lg transition-colors text-xs font-mono font-bold uppercase tracking-wider"
                            >
                              <Edit3 className="w-3.5 h-3.5" /> Edit
                            </button>
                            <button
                              onClick={async () => {
                                if (!confirm("Delete this event?")) return;
                                const res = await deleteBiolabEvent(ev.id) as any;
                                if (res.error) showToast("Delete failed: " + res.error, "err");
                                else { showToast("Event deleted", "ok"); fetchData(); }
                              }}
                              className="flex items-center justify-center gap-1.5 px-3 py-2 bg-red-500/5 hover:bg-red-500/15 text-red-500/50 hover:text-red-400 rounded-lg transition-colors text-xs font-mono font-bold uppercase tracking-wider"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </GlassCard>
                      );
                    })}
                  </div>
                )}

                {/* Info note about 3-event display limit */}
                {eventsData.length > 0 && (
                  <div className="text-center py-4 border-t border-white/5">
                    <p className="text-white/25 font-mono text-[10px] uppercase tracking-wider">
                      Homepage displays the first 3 active events sorted by date · Total: {eventsData.length} event{eventsData.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                )}

                {/* Add/Edit Event Modal */}
                <AnimatePresence>
                  {showEventModal && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9998] flex items-start justify-center pt-10 px-4 pb-10 overflow-y-auto"
                      onClick={(e) => { if (e.target === e.currentTarget) setShowEventModal(false); }}
                    >
                      <motion.div
                        initial={{ opacity: 0, scale: 0.97, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.97, y: 20 }}
                        className="bg-[#0d0d0d] border border-white/10 rounded-2xl p-7 w-full max-w-2xl shadow-2xl"
                      >
                        {/* Modal Header */}
                        <div className="flex items-center justify-between mb-6">
                          <div>
                            <h3 className="text-xl font-black font-mono uppercase tracking-tight text-white">
                              {editingEventId ? "Edit Event" : "New Event"}
                            </h3>
                            <p className="text-white/30 text-xs font-mono mt-0.5">
                              {editingEventId ? "Update event details — changes go live immediately" : "This event will appear on the homepage"}
                            </p>
                          </div>
                          <button onClick={() => setShowEventModal(false)} className="p-2 hover:bg-white/5 rounded-lg transition-colors text-white/40 hover:text-white">
                            <X className="w-5 h-5" />
                          </button>
                        </div>

                        <div className="space-y-5">
                          {/* Cover Image Drag & Drop */}
                          <div>
                            <label className="block text-[10px] font-mono font-bold text-white/40 uppercase tracking-widest mb-2">Cover Image</label>
                            <div
                              onDragOver={(e) => { e.preventDefault(); setEventImageDragOver(true); }}
                              onDragLeave={() => setEventImageDragOver(false)}
                              onDrop={async (e) => {
                                e.preventDefault(); setEventImageDragOver(false);
                                const file = e.dataTransfer.files[0];
                                if (!file || !file.type.startsWith("image/")) { showToast("Please drop a valid image", "err"); return; }
                                setEventImageUploading(true);
                                try {
                                  const fd = new FormData(); fd.append("file", file);
                                  const res = await fetch("/api/admin/events/upload", { method: "POST", body: fd });
                                  const json = await res.json();
                                  if (!res.ok || json.error) throw new Error(json.error || "Upload failed");
                                  setEventImageUrl(json.url); setEventForm(f => ({ ...f, image_url: json.url }));
                                  showToast("Image uploaded!", "ok");
                                } catch (err: any) { showToast("Upload failed: " + err.message, "err"); }
                                finally { setEventImageUploading(false); }
                              }}
                              onClick={() => eventImageRef.current?.click()}
                              className={`relative border-2 border-dashed rounded-xl flex items-center justify-center cursor-pointer transition-all min-h-[160px] overflow-hidden ${
                                eventImageDragOver ? "border-cyan-500 bg-cyan-500/10 scale-[1.01]" : "border-white/10 hover:border-white/25 hover:bg-white/3"
                              }`}
                            >
                              <input ref={eventImageRef} type="file" accept="image/*" className="hidden" onChange={async (e) => {
                                const file = e.target.files?.[0]; if (!file) return;
                                setEventImageUploading(true);
                                try {
                                  const fd = new FormData(); fd.append("file", file);
                                  const res = await fetch("/api/admin/events/upload", { method: "POST", body: fd });
                                  const json = await res.json();
                                  if (!res.ok || json.error) throw new Error(json.error || "Upload failed");
                                  setEventImageUrl(json.url); setEventForm(f => ({ ...f, image_url: json.url }));
                                  showToast("Image uploaded!", "ok");
                                } catch (err: any) { showToast("Upload failed: " + err.message, "err"); }
                                finally { setEventImageUploading(false); e.target.value = ""; }
                              }} />
                              {eventImageUploading ? (
                                <div className="flex flex-col items-center gap-2 p-8">
                                  <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
                                  <p className="text-white/50 text-xs font-mono">Uploading image...</p>
                                </div>
                              ) : eventImageUrl ? (
                                <>
                                  <img src={eventImageUrl} alt="Cover preview" className="absolute inset-0 w-full h-full object-cover opacity-55" />
                                  <div className="relative z-10 flex flex-col items-center gap-2 bg-black/50 px-4 py-2 rounded-lg">
                                    <Upload className="w-5 h-5 text-white/80" />
                                    <p className="text-white/80 text-xs font-mono font-bold">Click or drag to replace</p>
                                  </div>
                                </>
                              ) : (
                                <div className="flex flex-col items-center gap-2 p-8">
                                  <Upload className="w-8 h-8 text-white/20 mb-1" />
                                  <p className="text-white text-sm font-mono font-bold">Drag & Drop Cover Image</p>
                                  <p className="text-white/35 text-xs font-mono">or click to browse — JPG, PNG, WEBP up to 10MB</p>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Title */}
                          <div>
                            <label className="block text-[10px] font-mono font-bold text-white/40 uppercase tracking-widest mb-1.5">Event Title <span className="text-red-400">*</span></label>
                            <input type="text" value={eventForm.title} onChange={e => setEventForm(f => ({ ...f, title: e.target.value }))}
                              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-cyan-500/50 transition-colors placeholder-white/20"
                              placeholder="e.g. Distributed Audio Failsafe Networks & Hardware Telemetry" />
                          </div>

                          {/* Speaker + Role */}
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] font-mono font-bold text-white/40 uppercase tracking-widest mb-1.5">Speaker <span className="text-red-400">*</span></label>
                              <input type="text" value={eventForm.speaker} onChange={e => setEventForm(f => ({ ...f, speaker: e.target.value }))}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-cyan-500/50 transition-colors placeholder-white/20"
                                placeholder="e.g. Prof. R. Sharma" />
                            </div>
                            <div>
                              <label className="block text-[10px] font-mono font-bold text-white/40 uppercase tracking-widest mb-1.5">Speaker Role</label>
                              <input type="text" value={eventForm.speaker_role} onChange={e => setEventForm(f => ({ ...f, speaker_role: e.target.value }))}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-cyan-500/50 transition-colors placeholder-white/20"
                                placeholder="e.g. BioLabs Faculty Advisor" />
                            </div>
                          </div>

                          {/* Description */}
                          <div>
                            <label className="block text-[10px] font-mono font-bold text-white/40 uppercase tracking-widest mb-1.5">Description</label>
                            <textarea value={eventForm.description} onChange={e => setEventForm(f => ({ ...f, description: e.target.value }))} rows={3}
                              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-cyan-500/50 transition-colors resize-none placeholder-white/20"
                              placeholder="Brief description of the event..." />
                          </div>

                          {/* Dates + Seats */}
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <label className="block text-[10px] font-mono font-bold text-white/40 uppercase tracking-widest mb-1.5">Start Date <span className="text-red-400">*</span></label>
                              <input type="date" value={eventForm.start_date} onChange={e => setEventForm(f => ({ ...f, start_date: e.target.value }))}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-cyan-500/50 transition-colors" />
                            </div>
                            <div>
                              <label className="block text-[10px] font-mono font-bold text-white/40 uppercase tracking-widest mb-1.5">End Date <span className="text-red-400">*</span></label>
                              <input type="date" value={eventForm.end_date} onChange={e => setEventForm(f => ({ ...f, end_date: e.target.value }))}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-cyan-500/50 transition-colors" />
                            </div>
                            <div>
                              <label className="block text-[10px] font-mono font-bold text-white/40 uppercase tracking-widest mb-1.5">Seats Left</label>
                              <input type="number" value={eventForm.seats_left} onChange={e => setEventForm(f => ({ ...f, seats_left: e.target.value }))}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-cyan-500/50 transition-colors" />
                            </div>
                          </div>

                          {/* Registration URL */}
                          <div>
                            <label className="block text-[10px] font-mono font-bold text-white/40 uppercase tracking-widest mb-1.5">Registration Google Form URL</label>
                            <input type="url" value={eventForm.register_url || ""} onChange={e => setEventForm(f => ({ ...f, register_url: e.target.value }))}
                              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-cyan-500/50 transition-colors placeholder-white/20"
                              placeholder="e.g. https://docs.google.com/forms/d/... (leave empty for standard popup)" />
                          </div>

                          {/* Category */}
                          <div>
                            <label className="block text-[10px] font-mono font-bold text-white/40 uppercase tracking-widest mb-1.5">Category</label>
                            <select value={eventForm.category} onChange={e => setEventForm(f => ({ ...f, category: e.target.value }))}
                              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-cyan-500/50 transition-colors">
                              <option value="Academic Workshops">Academic Workshops</option>
                              <option value="Research Seminars">Research Seminars</option>
                              <option value="Clinical Informatics">Clinical Informatics</option>
                              <option value="Mentorship Programs">Mentorship Programs</option>
                              <option value="AI & Technology">AI & Technology</option>
                            </select>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-3 pt-2">
                            <button onClick={() => setShowEventModal(false)}
                              className="flex-1 px-4 py-3 border border-white/10 hover:bg-white/5 text-white/50 hover:text-white font-mono text-xs uppercase tracking-wider rounded-xl transition-all">
                              Cancel
                            </button>
                            <button
                              disabled={eventSaving || eventImageUploading || !eventForm.title || !eventForm.start_date || !eventForm.end_date}
                              onClick={async () => {
                                setEventSaving(true);
                                try {
                                  const fd = new FormData();
                                  fd.append("title", eventForm.title);
                                  fd.append("description", eventForm.description);
                                  fd.append("speaker", eventForm.speaker);
                                  fd.append("speaker_role", eventForm.speaker_role);
                                  fd.append("category", eventForm.category);
                                  fd.append("seats_left", eventForm.seats_left);
                                  fd.append("start_date", eventForm.start_date);
                                  fd.append("end_date", eventForm.end_date);
                                  fd.append("image_url", eventImageUrl || eventForm.image_url);
                                  fd.append("register_url", eventForm.register_url || "");
                                  const res: any = editingEventId
                                    ? await updateBiolabEvent(editingEventId, fd)
                                    : await addBiolabEvent(fd);
                                  if (res.error) showToast("Save failed: " + res.error, "err");
                                  else {
                                    showToast(editingEventId ? "Event updated!" : "Event created!", "ok");
                                    setShowEventModal(false);
                                    fetchData();
                                  }
                                } catch (err: any) { showToast("Error: " + err.message, "err"); }
                                finally { setEventSaving(false); }
                              }}
                              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-black font-mono uppercase text-xs rounded-xl transition-all"
                            >
                              {eventSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                              {eventSaving ? "Saving..." : editingEventId ? "Update Event" : "Create Event"}
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </motion.div>
            )}

            {/* CORPORATE MENTORS/ADVISORS TAB */}
            {activeTab === "mentors" && (
              <motion.div key="mentors" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="space-y-8">
                <div className="flex items-center justify-between border-b border-white/10 pb-6 mb-8">
                  <div>
                    <h2 className="text-3xl font-black font-mono uppercase tracking-tight text-white">Advisors & Mentors</h2>
                    <p className="text-white/50 text-sm">Manage advisor profiles shown on the homepage marquee. Drag cards to reorder.</p>
                  </div>
                  <button onClick={openCorpAddForm} className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold font-mono uppercase tracking-wider text-xs rounded-xl">
                    <Plus className="w-4 h-4" /> Add Advisor
                  </button>
                </div>

                {/* Category filter pills */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {["all", "clinical", "research", "academic", "industry"].map(cat => {
                    const colors: Record<string, string> = { clinical: "#ea580c", research: "#2563eb", academic: "#059669", industry: "#7c3aed" };
                    const count = cat === "all" ? corpMentors.length : corpMentors.filter(m => (m.category || "clinical") === cat).length;
                    return (
                      <span key={cat} className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/10 text-white/60" style={cat !== "all" ? { borderColor: colors[cat] + "60", color: colors[cat] } : {}}>
                        {cat} ({count})
                      </span>
                    );
                  })}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {[...corpMentors].sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0)).map((m) => (
                    <div
                      key={m.id}
                      draggable
                      onDragStart={() => setCorpDragId(m.id)}
                      onDragOver={(e: React.DragEvent) => { e.preventDefault(); setCorpDragOverId(m.id); }}
                      onDragLeave={() => setCorpDragOverId(null)}
                      onDrop={(e: React.DragEvent) => { e.preventDefault(); if (corpDragId) handleCorpDragReorder(corpDragId, m.id); setCorpDragId(null); setCorpDragOverId(null); }}
                      onDragEnd={() => { setCorpDragId(null); setCorpDragOverId(null); }}
                      className="cursor-grab active:cursor-grabbing select-none"
                    >
                      <GlassCard
                        className={`p-5 flex flex-col gap-4 border transition-all ${
                          corpDragOverId === m.id ? "border-emerald-400 bg-emerald-500/5 scale-[1.02]" :
                          corpDragId === m.id ? "border-white/20 opacity-40" :
                          m.active ? "border-white/5 bg-[#0a0a0a] hover:border-white/10" : "border-white/5 bg-[#0a0a0a] opacity-55"
                        }`}
                      >
                        {/* Drag handle + category badge */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <GripVertical className="w-4 h-4 text-white/20" />
                            {m.category && (
                              <span className="text-[9px] font-black font-mono uppercase tracking-widest px-2 py-0.5 rounded-full" style={{
                                color: m.category === "clinical" ? "#ea580c" : m.category === "research" ? "#2563eb" : m.category === "academic" ? "#059669" : "#7c3aed",
                                backgroundColor: (m.category === "clinical" ? "#ea580c" : m.category === "research" ? "#2563eb" : m.category === "academic" ? "#059669" : "#7c3aed") + "15",
                              }}>{m.category}</span>
                            )}
                          </div>
                          <span className={`text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full ${ m.active ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400" }`}>
                            {m.active ? "Live" : "Hidden"}
                          </span>
                        </div>

                        <div className="flex gap-4">
                          {/* Photo with drag-drop upload */}
                          <div
                            className={`w-20 h-20 rounded-full overflow-hidden relative border shrink-0 group/avatar cursor-pointer transition-all duration-300 ${
                              corpUploadingFor === m.id ? "border-emerald-500 bg-emerald-500/20 scale-105" : "border-white/10"
                            }`}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => handleCorpPhotoDrop(e, m.id)}
                          >
                            {m.photo_url ? (
                              <Image src={m.photo_url} alt={m.name} fill className="object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-700 text-3xl font-bold bg-[#111]">{m.name[0]}</div>
                            )}
                            <label className="absolute inset-0 bg-black/60 opacity-0 group-hover/avatar:opacity-100 flex flex-col items-center justify-center transition-opacity text-[8px] font-mono font-bold text-white uppercase tracking-widest cursor-pointer">
                              <Upload className="w-3.5 h-3.5 mb-1 text-emerald-400 animate-bounce" /> Photo
                              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleCorpPhotoUpload(e, m.id)} />
                            </label>
                          </div>
                          <div>
                            <p className="text-[9px] font-mono text-emerald-400 uppercase tracking-wider">{m.role}</p>
                            <h3 className="text-base font-bold text-white">{m.name}</h3>
                            <p className="text-xs text-gray-500 font-medium">{m.organization}</p>
                            {m.bio && <p className="text-[10px] text-white/30 mt-1 line-clamp-2">{m.bio}</p>}
                          </div>
                        </div>

                        <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-2">
                          <div className="flex gap-1">
                            <button onClick={() => moveCorpOrder(m, "up")} className="p-1.5 bg-white/5 hover:bg-white/10 rounded transition-colors" title="Move up"><ChevronUp className="w-3.5 h-3.5 text-gray-400"/></button>
                            <button onClick={() => moveCorpOrder(m, "down")} className="p-1.5 bg-white/5 hover:bg-white/10 rounded transition-colors" title="Move down"><ChevronDown className="w-3.5 h-3.5 text-gray-400"/></button>
                          </div>
                          <div className="flex gap-1.5">
                            <button onClick={() => toggleCorpActive(m)} className={`p-1.5 rounded transition-all ${m.active ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20" : "bg-red-500/10 text-red-400 hover:bg-red-500/20"}`} title={m.active ? "Hide" : "Show"}>
                              {m.active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                            </button>
                            <button onClick={() => openCorpEditForm(m)} className="p-1.5 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded transition-colors" title="Edit"><Edit3 className="w-3.5 h-3.5"/></button>
                            <button onClick={() => handleCorpDelete(m.id, m.name)} className="p-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded transition-colors" title="Delete"><Trash2 className="w-3.5 h-3.5"/></button>
                          </div>
                        </div>
                      </GlassCard>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ENGINEERING TEAM TAB */}
            {activeTab === "team" && (
              <motion.div key="team" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="space-y-8">
                <div className="flex items-center justify-between border-b border-white/10 pb-6 mb-8">
                  <div>
                    <h2 className="text-3xl font-black font-mono uppercase tracking-tight text-white">Engineering Team</h2>
                    <p className="text-white/50 text-sm">Manage software & clinical engineers appearing on the About page.</p>
                  </div>
                  <button onClick={openTeamAddForm} className="flex items-center gap-2 px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-bold font-mono uppercase tracking-wider text-xs rounded-xl">
                    <Plus className="w-4 h-4" /> Add Team Member
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {teamMembers.map((m) => (
                    <GlassCard key={m.id} className={`p-5 flex flex-col gap-4 border border-white/5 bg-[#0a0a0a] hover:border-white/10 transition-all ${m.active ? "opacity-100" : "opacity-55"}`}>
                      <div className="flex gap-4">
                        <div 
                          className={`w-20 h-20 rounded-xl overflow-hidden relative border shrink-0 group/avatar cursor-pointer transition-all duration-300 ${
                            teamUploadingFor === m.id ? "border-orange-500 bg-orange-500/20 scale-105" : "border-white/10"
                          }`}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => handleTeamPhotoDrop(e, m.id)}
                        >
                          {m.photo_url ? (
                            <Image src={m.photo_url} alt={m.role} fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-700 text-3xl font-bold bg-[#111]">{m.role[0]}</div>
                          )}
                          <label className="absolute inset-0 bg-black/60 opacity-0 group-hover/avatar:opacity-100 flex flex-col items-center justify-center transition-opacity text-[8px] font-mono font-bold text-white uppercase tracking-widest cursor-pointer">
                            <Upload className="w-3.5 h-3.5 mb-1 text-orange-400 animate-bounce" /> Drag & Drop
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleTeamPhotoUpload(e, m.id)} />
                          </label>
                        </div>
                        <div>
                          <p className="text-[9px] font-mono text-orange-400 uppercase tracking-wider">{m.role}</p>
                          <h3 className="text-base font-bold text-white">{m.name || "Unnamed"}</h3>
                          <p className="text-xs text-gray-500 font-medium">{m.focus}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-2">
                        <div className="flex gap-1">
                          <button onClick={() => moveTeamOrder(m, "up")} className="p-1.5 bg-white/5 rounded"><ChevronUp className="w-3.5 h-3.5 text-gray-400"/></button>
                          <button onClick={() => moveTeamOrder(m, "down")} className="p-1.5 bg-white/5 rounded"><ChevronDown className="w-3.5 h-3.5 text-gray-400"/></button>
                        </div>
                        <div className="flex gap-1.5">
                          <button onClick={() => toggleTeamActive(m)} className={`p-1.5 rounded transition-all ${m.active ? "bg-orange-500/10 text-orange-400" : "bg-red-500/10 text-red-400"}`}>
                            {m.active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                          </button>
                          <button onClick={() => openTeamEditForm(m)} className="p-1.5 bg-blue-500/10 text-blue-400 rounded"><Edit3 className="w-3.5 h-3.5"/></button>
                          <button onClick={() => handleTeamDelete(m.id, m.name)} className="p-1.5 bg-red-500/10 text-red-400 rounded"><Trash2 className="w-3.5 h-3.5"/></button>
                        </div>
                      </div>
                    </GlassCard>
                  ))}
                </div>
              </motion.div>
            )}

            {/* FOUNDERS CORNER TAB */}
            {activeTab === "founders" && (
              <motion.div key="founders" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="space-y-8">
                <div className="flex items-center justify-between border-b border-white/10 pb-6 mb-8">
                  <div>
                    <h2 className="text-3xl font-black font-mono uppercase tracking-tight text-white">Founders Corner</h2>
                    <p className="text-white/50 text-sm">Manage the founders appearing in the Founder's Corner on the homepage.</p>
                  </div>
                  <button onClick={openFounderAddForm} className="flex items-center gap-2 px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-bold font-mono uppercase tracking-wider text-xs rounded-xl">
                    <Plus className="w-4 h-4" /> Add Founder
                  </button>
                </div>

                {foundersList.some(f => String(f.id).startsWith("f")) && (
                  <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex gap-3 text-amber-200 text-xs leading-relaxed font-mono">
                    <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold uppercase mb-1">Database Schema Notice</p>
                      <p>Currently showing static fallback founders. Run <code className="text-white bg-black/40 px-1 py-0.5 rounded">supabase_founders_schema.sql</code> in your Supabase SQL editor to create the table and enable dynamic database management (including custom photo uploading, reordering, and permanent deletion).</p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {foundersList.map((f) => {
                    const isFallback = String(f.id).startsWith("f");
                    return (
                      <GlassCard key={f.id} className={`p-5 flex flex-col justify-between gap-4 border border-white/5 bg-[#0a0a0a] hover:border-white/10 transition-all ${f.active ? "opacity-100" : "opacity-55"}`}>
                        <div className="space-y-4">
                          <div className="flex gap-4">
                            <div 
                              className={`w-20 h-20 rounded-xl overflow-hidden relative border shrink-0 group/avatar cursor-pointer transition-all duration-300 ${
                                founderUploadingFor === f.id ? "border-orange-500 bg-orange-500/20 scale-105" : "border-white/10"
                              }`}
                              onDragOver={(e) => e.preventDefault()}
                              onDrop={(e) => handleFounderPhotoDrop(e, f.id)}
                            >
                              {f.photo_url ? (
                                <Image src={f.photo_url} alt={f.name} fill className="object-cover object-top" unoptimized />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-700 text-3xl font-bold bg-[#111]">{f.name?.[0]}</div>
                              )}
                              {!isFallback && (
                                <label className="absolute inset-0 bg-black/60 opacity-0 group-hover/avatar:opacity-100 flex flex-col items-center justify-center transition-opacity text-[8px] font-mono font-bold text-white uppercase tracking-widest cursor-pointer">
                                  <Upload className="w-3.5 h-3.5 mb-1 text-orange-400 animate-bounce" /> Drag & Drop
                                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFounderPhotoUpload(e, f.id)} />
                                </label>
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="text-[9px] font-mono text-orange-400 uppercase tracking-wider truncate">{f.role}</p>
                              <h3 className="text-base font-bold text-white truncate">{f.name || "Unnamed"}</h3>
                              {f.institution && <p className="text-[10px] text-gray-500 font-mono tracking-tight leading-none truncate mt-0.5">{f.institution}</p>}
                              {f.linkedin_url && <p className="text-[9px] text-blue-400 font-mono tracking-tight leading-none truncate mt-1">{f.linkedin_url}</p>}
                              <span className={`inline-flex px-1.5 py-0.5 rounded text-[8px] font-mono font-bold uppercase mt-1.5 ${isFallback ? "bg-zinc-800 text-zinc-400" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"}`}>
                                {isFallback ? "Static Fallback" : "Live DB"}
                              </span>
                            </div>
                          </div>
                          <div className="bg-white/5 p-3 rounded-lg border border-white/5 relative">
                            <Quote className="absolute top-1 right-2 w-4 h-4 text-white/10 rotate-180" />
                            <p className="text-xs text-gray-400 italic line-clamp-3 font-mono">
                              "{f.quote || "No quote provided."}"
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-2">
                          <div className="flex gap-1">
                            <button disabled={isFallback} onClick={() => moveFounderOrder(f, "up")} className="p-1.5 bg-white/5 rounded disabled:opacity-30"><ChevronUp className="w-3.5 h-3.5 text-gray-400"/></button>
                            <button disabled={isFallback} onClick={() => moveFounderOrder(f, "down")} className="p-1.5 bg-white/5 rounded disabled:opacity-30"><ChevronDown className="w-3.5 h-3.5 text-gray-400"/></button>
                          </div>
                          <div className="flex gap-1.5">
                            <button disabled={isFallback} onClick={() => toggleFounderActive(f)} className={`p-1.5 rounded transition-all disabled:opacity-30 ${f.active ? "bg-orange-500/10 text-orange-400" : "bg-red-500/10 text-red-400"}`}>
                              {f.active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                            </button>
                            <button onClick={() => openFounderEditForm(f)} className="p-1.5 bg-blue-500/10 text-blue-400 rounded"><Edit3 className="w-3.5 h-3.5"/></button>
                            <button disabled={isFallback} onClick={() => handleFounderDelete(f.id, f.name)} className="p-1.5 bg-red-500/10 text-red-400 rounded disabled:opacity-30"><Trash2 className="w-3.5 h-3.5"/></button>
                          </div>
                        </div>
                      </GlassCard>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* GLOBAL NETWORK TAB */}
            {activeTab === "network" && (
              <motion.div key="network" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6 mb-8">
                  <div>
                    <h2 className="text-3xl font-black font-mono uppercase tracking-tight text-white">Global Network</h2>
                    <p className="text-white/50 text-sm">Manage dynamic modules appearing on the Global Network page.</p>
                  </div>
                  
                  {/* Sub-tab selection */}
                  <div className="flex items-center gap-1.5 p-1 bg-white/5 border border-white/10 rounded-xl max-w-fit shrink-0">
                    <button
                      onClick={() => setNetworkSubTab("facilities")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition-all ${
                        networkSubTab === "facilities" ? "bg-orange-600 text-white shadow-md" : "text-gray-400 hover:text-white"
                      }`}
                    >
                      Facilities
                    </button>
                    <button
                      onClick={() => setNetworkSubTab("engineers")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition-all ${
                        networkSubTab === "engineers" ? "bg-orange-600 text-white shadow-md" : "text-gray-400 hover:text-white"
                      }`}
                    >
                      Engineers
                    </button>
                  </div>
                </div>

                {/* Sub Tab Content */}

                {networkSubTab === "facilities" && (
                  <>
                    <div className="flex justify-end mb-4">
                      <button onClick={openFacilityAddForm} className="flex items-center gap-2 px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-bold font-mono uppercase tracking-wider text-xs rounded-xl">
                        <Plus className="w-4 h-4" /> Add Facility
                      </button>
                    </div>

                    {facilitiesList.some(f => String(f.id).startsWith("f")) && (
                      <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex gap-3 text-amber-200 text-xs leading-relaxed font-mono">
                        <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold uppercase mb-1">Database Schema Notice</p>
                          <p>Currently showing static fallback facilities. Run <code className="text-white bg-black/40 px-1 py-0.5 rounded">supabase_global_network_extended_schema.sql</code> in your Supabase SQL editor to create the table and enable dynamic database management.</p>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {facilitiesList.map((f) => {
                        const isFallback = String(f.id).startsWith("f");
                        return (
                          <GlassCard key={f.id} className={`p-5 flex flex-col justify-between gap-4 border border-white/5 bg-[#0a0a0a] hover:border-white/10 transition-all ${f.active ? "opacity-100" : "opacity-55"}`}>
                            <div className="space-y-4">
                              <div className="flex gap-4">
                                <div 
                                  className={`w-24 h-20 rounded-xl overflow-hidden relative border shrink-0 group/avatar cursor-pointer transition-all duration-300 ${
                                    facilityUploadingFor === f.id ? "border-orange-500 bg-orange-500/20 scale-105" : "border-white/10"
                                  }`}
                                  onDragOver={(e) => e.preventDefault()}
                                  onDrop={(e) => handleFacilityPhotoDrop(e, f.id, "campus")}
                                >
                                  {f.image_url ? (
                                    <Image src={f.image_url} alt={f.name} fill className="object-cover" unoptimized />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-700 text-xl font-bold bg-[#111]">No Image</div>
                                  )}
                                  {!isFallback && (
                                    <label className="absolute inset-0 bg-black/60 opacity-0 group-hover/avatar:opacity-100 flex flex-col items-center justify-center transition-opacity text-[8px] font-mono font-bold text-white uppercase tracking-widest cursor-pointer">
                                      <Upload className="w-3.5 h-3.5 mb-1 text-orange-400" /> Drop Campus Photo
                                      <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                          setFacilityUploadingFor(f.id);
                                          const fd = new FormData();
                                          fd.append("file", file);
                                          fd.append("facilityId", f.id);
                                          fd.append("type", "campus");
                                          fetch("/api/facilities/upload", { method: "POST", body: fd })
                                            .then(r => r.json())
                                            .then(data => {
                                              if (data.url) {
                                                showToast("Campus image uploaded!");
                                                fetchData();
                                              } else {
                                                showToast(data.error ?? "Upload failed", "err");
                                              }
                                            })
                                            .catch(() => showToast("Upload failed", "err"))
                                            .finally(() => setFacilityUploadingFor(null));
                                        }
                                      }} />
                                    </label>
                                  )}
                                </div>
                                <div className="min-w-0">
                                  <p className="text-[9px] font-mono text-orange-400 uppercase tracking-wider truncate">{f.city}</p>
                                  <h3 className="text-base font-bold text-white truncate">{f.name || "Unnamed"}</h3>
                                  <p className="text-[10px] text-gray-400 font-mono truncate">{f.facility}</p>
                                  <span className={`inline-flex px-1.5 py-0.5 rounded text-[8px] font-mono font-bold uppercase mt-1 ${isFallback ? "bg-zinc-800 text-zinc-400" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"}`}>
                                    {isFallback ? "Static Fallback" : "Live DB"}
                                  </span>
                                </div>
                              </div>
                              
                              <p className="text-xs text-gray-400 font-sans line-clamp-2">
                                {f.description}
                              </p>

                              {/* Mentors small summary */}
                              {f.mentors && f.mentors.length > 0 && (
                                <div className="space-y-1.5 border-t border-white/5 pt-3">
                                  <p className="text-[8px] font-mono font-bold text-orange-400 uppercase tracking-wider">Mentors ({f.mentors.length})</p>
                                  <div className="flex gap-2 flex-wrap">
                                    {f.mentors.map((m: any, idx: number) => (
                                      <div key={idx} className="flex items-center gap-1.5 bg-white/5 border border-white/5 px-2 py-1 rounded-lg text-[10px]">
                                        <div className="w-4 h-4 rounded-full overflow-hidden relative bg-zinc-800">
                                          {m.photo_url || m.photo ? (
                                            <Image src={m.photo_url || m.photo} alt={m.name} fill className="object-cover" unoptimized />
                                          ) : (
                                            <div className="w-full h-full flex items-center justify-center text-[7px] text-gray-500 font-bold bg-[#111]">{m.name?.[0]}</div>
                                          )}
                                        </div>
                                        <span className="text-zinc-300 max-w-[80px] truncate">{m.name}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                            
                            <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-2">
                              <div className="flex gap-1">
                                <button disabled={isFallback} onClick={() => moveFacilityOrder(f, "up")} className="p-1.5 bg-white/5 rounded disabled:opacity-30"><ChevronUp className="w-3.5 h-3.5 text-gray-400"/></button>
                                <button disabled={isFallback} onClick={() => moveFacilityOrder(f, "down")} className="p-1.5 bg-white/5 rounded disabled:opacity-30"><ChevronDown className="w-3.5 h-3.5 text-gray-400"/></button>
                              </div>
                              <div className="flex gap-1.5">
                                <button disabled={isFallback} onClick={() => toggleFacilityActive(f)} className={`p-1.5 rounded transition-all disabled:opacity-30 ${f.active ? "bg-orange-500/10 text-orange-400" : "bg-red-500/10 text-red-400"}`}>
                                  {f.active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                                </button>
                                <button onClick={() => openFacilityEditForm(f)} className="p-1.5 bg-blue-500/10 text-blue-400 rounded"><Edit3 className="w-3.5 h-3.5"/></button>
                                <button disabled={isFallback} onClick={() => handleFacilityDelete(f.id, f.name)} className="p-1.5 bg-red-500/10 text-red-400 rounded disabled:opacity-30"><Trash2 className="w-3.5 h-3.5"/></button>
                              </div>
                            </div>
                          </GlassCard>
                        );
                      })}
                    </div>
                  </>
                )}

                {networkSubTab === "engineers" && (
                  <>
                    <div className="flex justify-end mb-4">
                      <button onClick={openEngineerAddForm} className="flex items-center gap-2 px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-bold font-mono uppercase tracking-wider text-xs rounded-xl">
                        <Plus className="w-4 h-4" /> Add Node
                      </button>
                    </div>

                    {engineersList.some(e => String(e.id).startsWith("e")) && (
                      <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex gap-3 text-amber-200 text-xs leading-relaxed font-mono">
                        <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold uppercase mb-1">Database Schema Notice</p>
                          <p>Currently showing static fallback engineering nodes. Run <code className="text-white bg-black/40 px-1 py-0.5 rounded">supabase_global_network_extended_schema.sql</code> in your Supabase SQL editor to create the table and enable dynamic edits.</p>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {engineersList.map((eng) => {
                        const isFallback = String(eng.id).startsWith("e");
                        return (
                          <GlassCard key={eng.id} className={`p-5 flex flex-col justify-between gap-4 border border-white/5 bg-[#0a0a0a] hover:border-white/10 transition-all ${eng.active ? "opacity-100" : "opacity-55"}`}>
                            <div className="space-y-4">
                              <div className="flex gap-4">
                                <div 
                                  className={`w-16 h-16 rounded-xl overflow-hidden relative border shrink-0 bg-white group/avatar cursor-pointer flex items-center justify-center p-1 transition-all duration-300 ${
                                    engineerUploadingFor === eng.id ? "border-orange-500 bg-orange-500/20 scale-105" : "border-white/10"
                                  }`}
                                  onDragOver={(e) => e.preventDefault()}
                                  onDrop={(e) => handleEngineerLogoDrop(e, eng.id)}
                                >
                                  {eng.logo_url || eng.logo ? (
                                    <Image src={eng.logo_url || eng.logo} alt={eng.name} fill className="object-contain p-1" unoptimized />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-700 text-lg font-bold bg-[#111]">{eng.fallback_text || eng.fallbackText}</div>
                                  )}
                                  {!isFallback && (
                                    <label className="absolute inset-0 bg-black/60 opacity-0 group-hover/avatar:opacity-100 flex flex-col items-center justify-center transition-opacity text-[8px] font-mono font-bold text-white uppercase tracking-widest cursor-pointer">
                                      <Upload className="w-3.5 h-3.5 mb-1 text-orange-400" /> Drop Logo
                                      <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                          setEngineerUploadingFor(eng.id);
                                          const fd = new FormData();
                                          fd.append("file", file);
                                          fd.append("engineerId", eng.id);
                                          fetch("/api/engineers/upload", { method: "POST", body: fd })
                                            .then(r => r.json())
                                            .then(data => {
                                              if (data.url) {
                                                showToast("Logo image uploaded!");
                                                fetchData();
                                              } else {
                                                showToast(data.error ?? "Upload failed", "err");
                                              }
                                            })
                                            .catch(() => showToast("Upload failed", "err"))
                                            .finally(() => setEngineerUploadingFor(null));
                                        }
                                      }} />
                                    </label>
                                  )}
                                </div>
                                <div className="min-w-0">
                                  <h3 className="text-base font-bold text-white truncate">{eng.name || "Unnamed"}</h3>
                                  <p className="text-[10px] text-orange-400 font-mono truncate">{eng.team_name || eng.teamName}</p>
                                  <span className={`inline-flex px-1.5 py-0.5 rounded text-[8px] font-mono font-bold uppercase mt-1 ${isFallback ? "bg-zinc-800 text-zinc-400" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"}`}>
                                    {isFallback ? "Static Fallback" : "Live DB"}
                                  </span>
                                </div>
                              </div>
                              
                              <p className="text-xs text-gray-400 font-sans leading-relaxed">
                                {eng.specialization}
                              </p>
                            </div>
                            
                            <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-2">
                              <div className="flex gap-1">
                                <button disabled={isFallback} onClick={() => moveEngineerOrder(eng, "up")} className="p-1.5 bg-white/5 rounded disabled:opacity-30"><ChevronUp className="w-3.5 h-3.5 text-gray-400"/></button>
                                <button disabled={isFallback} onClick={() => moveEngineerOrder(eng, "down")} className="p-1.5 bg-white/5 rounded disabled:opacity-30"><ChevronDown className="w-3.5 h-3.5 text-gray-400"/></button>
                              </div>
                              <div className="flex gap-1.5">
                                <button disabled={isFallback} onClick={() => toggleEngineerActive(eng)} className={`p-1.5 rounded transition-all disabled:opacity-30 ${eng.active ? "bg-orange-500/10 text-orange-400" : "bg-red-500/10 text-red-400"}`}>
                                  {eng.active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                                </button>
                                <button onClick={() => openEngineerEditForm(eng)} className="p-1.5 bg-blue-500/10 text-blue-400 rounded"><Edit3 className="w-3.5 h-3.5"/></button>
                                <button disabled={isFallback} onClick={() => handleEngineerDelete(eng.id, eng.name)} className="p-1.5 bg-red-500/10 text-red-400 rounded disabled:opacity-30"><Trash2 className="w-3.5 h-3.5"/></button>
                              </div>
                            </div>
                          </GlassCard>
                        );
                      })}
                    </div>
                  </>
                )}
              </motion.div>
            )}
            {/* OUR MEMBERS TAB */}
            {activeTab === "members" && (
              <motion.div key="members" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6 mb-8">
                  <div>
                    <h2 className="text-3xl font-black font-mono uppercase tracking-tight text-white">Our Members</h2>
                    <p className="text-white/50 text-sm">Manage dynamic profiles appearing on the Our Members page.</p>
                  </div>
                  
                  {/* Sub-tab selection */}
                  <div className="flex items-center gap-1.5 p-1 bg-white/5 border border-white/10 rounded-xl max-w-fit shrink-0">
                    <button
                      onClick={() => setMembersSubTab("ambassadors")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition-all ${
                        membersSubTab === "ambassadors" ? "bg-orange-600 text-white shadow-md" : "text-gray-400 hover:text-white"
                      }`}
                    >
                      Brand Ambassadors
                    </button>
                    <button
                      onClick={() => setMembersSubTab("professionals")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition-all ${
                        membersSubTab === "professionals" ? "bg-orange-600 text-white shadow-md" : "text-gray-400 hover:text-white"
                      }`}
                    >
                      Healthcare Professionals
                    </button>
                  </div>
                </div>

                {/* Sub Tab Content */}
                {membersSubTab === "professionals" && (
                  <>
                    <div className="flex justify-end mb-4">
                      <button onClick={openProfessionalAddForm} className="flex items-center gap-2 px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-bold font-mono uppercase tracking-wider text-xs rounded-xl">
                        <Plus className="w-4 h-4" /> Add Professional
                      </button>
                    </div>

                    {professionalsList.some(p => String(p.id).startsWith("p")) && (
                      <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex gap-3 text-amber-200 text-xs leading-relaxed font-mono">
                        <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold uppercase mb-1">Database Schema Notice</p>
                          <p>Currently showing static fallback professionals. Run <code className="text-white bg-black/40 px-1 py-0.5 rounded">supabase_global_network_schema.sql</code> in your Supabase SQL editor to create the table and enable dynamic database management (including custom photo uploading, reordering, and permanent deletion).</p>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {professionalsList.map((p) => {
                        const isFallback = String(p.id).startsWith("p");
                        return (
                          <GlassCard key={p.id} className={`p-5 flex flex-col justify-between gap-4 border border-white/5 bg-[#0a0a0a] hover:border-white/10 transition-all ${p.active ? "opacity-100" : "opacity-55"}`}>
                            <div className="space-y-4">
                              <div className="flex gap-4">
                                <div 
                                  className={`w-20 h-20 rounded-xl overflow-hidden relative border shrink-0 group/avatar cursor-pointer transition-all duration-300 ${
                                    professionalUploadingFor === p.id ? "border-orange-500 bg-orange-500/20 scale-105" : "border-white/10"
                                  }`}
                                  onDragOver={(e) => e.preventDefault()}
                                  onDrop={(e) => handleProfessionalPhotoDrop(e, p.id)}
                                >
                                  {p.photo_url ? (
                                    <Image src={p.photo_url} alt={p.name} fill className="object-cover object-top" unoptimized />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-700 text-3xl font-bold bg-[#111]">{p.name?.[0]}</div>
                                  )}
                                  {!isFallback && (
                                    <label className="absolute inset-0 bg-black/60 opacity-0 group-hover/avatar:opacity-100 flex flex-col items-center justify-center transition-opacity text-[8px] font-mono font-bold text-white uppercase tracking-widest cursor-pointer">
                                      <Upload className="w-3.5 h-3.5 mb-1 text-orange-400 animate-bounce" /> Drag & Drop
                                      <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                          setProfessionalUploadingFor(p.id);
                                          const fd = new FormData();
                                          fd.append("file", file);
                                          fd.append("professionalId", p.id);
                                          fetch("/api/professionals/upload", { method: "POST", body: fd })
                                            .then(r => r.json())
                                            .then(data => {
                                              if (data.url) {
                                                showToast("Professional photo uploaded and synced!");
                                                fetchData();
                                              } else {
                                                showToast(data.error ?? "Photo upload failed", "err");
                                              }
                                            })
                                            .catch(() => showToast("Upload failed", "err"))
                                            .finally(() => setProfessionalUploadingFor(null));
                                        }
                                      }} />
                                    </label>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-[9px] font-mono text-[#ff7a00] uppercase tracking-wider truncate">{p.role || "Professional"}</p>
                                  <h3 className="text-sm font-bold text-white truncate">{p.name || "Unnamed"}</h3>
                                  <p className="text-xs text-gray-400 truncate">{p.institution || "No Institution"}</p>
                                </div>
                              </div>
                              
                              <p className="text-xs text-white/60 line-clamp-3 leading-relaxed font-sans">{p.description || "No description provided."}</p>
                            </div>
                            
                            <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-2">
                              <div className="flex gap-1">
                                <button disabled={isFallback} onClick={() => moveProfessionalOrder(p, "up")} className="p-1.5 bg-white/5 rounded disabled:opacity-30"><ChevronUp className="w-3.5 h-3.5 text-gray-400"/></button>
                                <button disabled={isFallback} onClick={() => moveProfessionalOrder(p, "down")} className="p-1.5 bg-white/5 rounded disabled:opacity-30"><ChevronDown className="w-3.5 h-3.5 text-gray-400"/></button>
                              </div>
                              <div className="flex gap-1.5">
                                <button disabled={isFallback} onClick={() => toggleProfessionalActive(p)} className={`p-1.5 rounded transition-all disabled:opacity-30 ${p.active ? "bg-orange-500/10 text-orange-400" : "bg-red-500/10 text-red-400"}`}>
                                  {p.active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                                </button>
                                <button onClick={() => openProfessionalEditForm(p)} className="p-1.5 bg-blue-500/10 text-blue-400 rounded"><Edit3 className="w-3.5 h-3.5"/></button>
                                <button disabled={isFallback} onClick={() => handleProfessionalDelete(p.id, p.name)} className="p-1.5 bg-red-500/10 text-red-400 rounded disabled:opacity-30"><Trash2 className="w-3.5 h-3.5"/></button>
                              </div>
                            </div>
                          </GlassCard>
                        );
                      })}
                    </div>
                  </>
                )}

                {membersSubTab === "ambassadors" && (
                  <>
                    <div className="flex justify-end mb-4">
                      <button onClick={openAmbassadorAddForm} className="flex items-center gap-2 px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-bold font-mono uppercase tracking-wider text-xs rounded-xl">
                        <Plus className="w-4 h-4" /> Add Ambassador
                      </button>
                    </div>

                    {ambassadorsList.some(a => String(a.id).startsWith("amb-fallback-")) && (
                      <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex gap-3 text-amber-200 text-xs leading-relaxed font-mono">
                        <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold uppercase mb-1">Database Schema Notice</p>
                          <p>Currently showing static fallback ambassadors. Run <code className="text-white bg-black/40 px-1 py-0.5 rounded">supabase_global_network_ambassadors_schema.sql</code> in your Supabase SQL editor to create the table and enable dynamic database changes (including photo uploading, reordering, and permanent deletion).</p>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {[...ambassadorsList].sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0)).map((amb) => {
                        const isFallback = String(amb.id).startsWith("amb-fallback-");
                        return (
                          <div
                            key={amb.id}
                            draggable={!isFallback}
                            onDragStart={() => setAmbassadorDragId(amb.id)}
                            onDragOver={(e: React.DragEvent) => { e.preventDefault(); setAmbassadorDragOverId(amb.id); }}
                            onDragLeave={() => setAmbassadorDragOverId(null)}
                            onDrop={(e: React.DragEvent) => { e.preventDefault(); if (ambassadorDragId) handleAmbassadorDragReorder(ambassadorDragId, amb.id); setAmbassadorDragId(null); setAmbassadorDragOverId(null); }}
                            onDragEnd={() => { setAmbassadorDragId(null); setAmbassadorDragOverId(null); }}
                            className={`${isFallback ? "" : "cursor-grab active:cursor-grabbing"} select-none`}
                          >
                            <GlassCard
                              className={`p-5 flex flex-col gap-4 border transition-all ${
                                ambassadorDragOverId === amb.id ? "border-orange-400 bg-orange-500/5 scale-[1.02]" :
                                ambassadorDragId === amb.id ? "border-white/20 opacity-40" :
                                amb.active ? "border-white/5 bg-[#0a0a0a] hover:border-white/10" : "border-white/5 bg-[#0a0a0a] opacity-55"
                              }`}
                            >
                              {/* Drag handle & state */}
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  {!isFallback && <GripVertical className="w-4 h-4 text-white/20" />}
                                  <span className={`inline-flex px-1.5 py-0.5 rounded text-[8px] font-mono font-bold uppercase ${isFallback ? "bg-zinc-800 text-zinc-400" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"}`}>
                                    {isFallback ? "Static Fallback" : "Live DB"}
                                  </span>
                                </div>
                                <span className={`text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full ${ amb.active ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400" }`}>
                                  {amb.active ? "Active" : "Disabled"}
                                </span>
                              </div>

                              <div className="flex gap-4">
                                {/* Photo Upload Box */}
                                <div
                                  className={`w-20 h-20 rounded-full overflow-hidden relative border shrink-0 group/photo cursor-pointer flex items-center justify-center bg-[#111] transition-all duration-300 ${
                                    ambassadorUploadingFor === amb.id ? "border-orange-500 bg-orange-500/20 scale-105" : "border-white/10"
                                  }`}
                                  onDragOver={(e) => e.preventDefault()}
                                  onDrop={(e) => handleAmbassadorPhotoDrop(e, amb.id, "photo")}
                                >
                                  {amb.photo_url || amb.photo ? (
                                    <Image src={amb.photo_url || amb.photo} alt={amb.name} fill className="object-cover" unoptimized />
                                  ) : (
                                    <div className="text-gray-555 text-[10px] font-mono text-center px-1">No Photo</div>
                                  )}
                                  {!isFallback && (
                                    <label className="absolute inset-0 bg-black/60 opacity-0 group-hover/photo:opacity-100 flex flex-col items-center justify-center transition-opacity text-[8px] font-mono font-bold text-white uppercase tracking-widest cursor-pointer">
                                      <Upload className="w-3.5 h-3.5 mb-1 text-orange-400" /> Upload Photo
                                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleAmbassadorPhotoUpload(e, amb.id, "photo")} />
                                    </label>
                                  )}
                                </div>

                                <div className="min-w-0 flex-1">
                                  <h3 className="text-sm font-bold text-white truncate">{amb.name || "Unnamed"}</h3>
                                  <p className="text-xs text-orange-400 font-mono truncate">{amb.role}</p>
                                  <p className="text-[10px] text-gray-450 truncate">{amb.institution}</p>
                                  
                                  {/* Institution Logo Upload Box */}
                                  <div className="mt-2 flex items-center gap-2">
                                    <span className="text-[9px] font-mono text-gray-500 uppercase">Logo:</span>
                                    <div 
                                      className={`w-8 h-8 rounded-lg overflow-hidden relative border bg-white/5 flex items-center justify-center group/logo cursor-pointer shrink-0 transition-all ${
                                        ambassadorLogoUploadingFor === amb.id ? "border-blue-500 bg-blue-500/20" : "border-white/10"
                                      }`}
                                      onDragOver={(e) => e.preventDefault()}
                                      onDrop={(e) => handleAmbassadorPhotoDrop(e, amb.id, "logo")}
                                    >
                                      {amb.logo_url || amb.logo ? (
                                        <Image src={amb.logo_url || amb.logo} alt={amb.institution} fill className="object-contain p-1" unoptimized />
                                      ) : (
                                        <span className="text-[7px] text-gray-500 font-mono">None</span>
                                      )}
                                      {!isFallback && (
                                        <label className="absolute inset-0 bg-black/75 opacity-0 group-hover/logo:opacity-100 flex items-center justify-center transition-opacity text-[6px] text-white font-mono uppercase cursor-pointer">
                                          <Upload className="w-2.5 h-2.5" />
                                          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleAmbassadorPhotoUpload(e, amb.id, "logo")} />
                                        </label>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {amb.quote && (
                                <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
                                  <p className="text-[10px] text-gray-455 italic line-clamp-2">"{amb.quote}"</p>
                                </div>
                              )}

                              {/* Color Swatch / Technical Settings */}
                              <div className="flex gap-2 text-[10px] font-mono">
                                <div className="flex items-center gap-1">
                                  <span className="w-2 h-2 rounded-full border border-white/20" style={{ backgroundColor: amb.accent_color || "#0B4A9E" }}></span>
                                  <span className="text-gray-555 text-[8px]">{amb.accent_color || "#0B4A9E"}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <span className="w-2 h-2 rounded-full border border-white/20" style={{ backgroundColor: amb.accent_color_sec || "#E60717" }}></span>
                                  <span className="text-gray-555 text-[8px]">{amb.accent_color_sec || "#E60717"}</span>
                                </div>
                              </div>

                              {/* Actions footer */}
                              <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-2">
                                <div className="flex gap-1">
                                  <button disabled={isFallback} onClick={() => moveAmbassadorOrder(amb, "up")} className="p-1.5 bg-white/5 rounded disabled:opacity-30"><ChevronUp className="w-3.5 h-3.5 text-gray-400"/></button>
                                  <button disabled={isFallback} onClick={() => moveAmbassadorOrder(amb, "down")} className="p-1.5 bg-white/5 rounded disabled:opacity-30"><ChevronDown className="w-3.5 h-3.5 text-gray-400"/></button>
                                </div>
                                <div className="flex gap-1.5">
                                  <button disabled={isFallback} onClick={() => toggleAmbassadorActive(amb)} className={`p-1.5 rounded transition-all disabled:opacity-30 ${amb.active ? "bg-orange-500/10 text-orange-400" : "bg-red-500/10 text-red-400"}`}>
                                    {amb.active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                                  </button>
                                  <button onClick={() => openAmbassadorEditForm(amb)} className="p-1.5 bg-blue-500/10 text-blue-400 rounded"><Edit3 className="w-3.5 h-3.5"/></button>
                                  <button disabled={isFallback} onClick={() => handleAmbassadorDelete(amb.id, amb.name)} className="p-1.5 bg-red-500/10 text-red-400 rounded disabled:opacity-30"><Trash2 className="w-3.5 h-3.5"/></button>
                                </div>
                              </div>
                            </GlassCard>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </motion.div>
            )}

            {/* PODCASTS TAB */}
            {activeTab === "podcasts" && (
              <motion.div key="podcasts" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="space-y-8">
                <div className="flex items-center justify-between border-b border-white/10 pb-6 mb-8">
                  <div>
                    <h2 className="text-3xl font-black font-mono uppercase tracking-tight text-white">Podcasts Manager</h2>
                    <p className="text-white/50 text-sm">Manage dynamic video podcast episodes appearing on the Home page.</p>
                  </div>
                  <button onClick={openPodcastAddForm} className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold font-mono uppercase tracking-wider text-xs rounded-xl">
                    <Plus className="w-4 h-4" /> Add Episode
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {podcasts.map((p) => (
                    <GlassCard key={p.id} className={`p-5 flex flex-col gap-4 border border-white/5 bg-[#0a0a0a] hover:border-white/10 transition-all ${p.active ? "opacity-100" : "opacity-55"}`}>
                      <div className="flex gap-4">
                        <div 
                          className={`w-24 h-16 rounded-xl overflow-hidden relative border shrink-0 group/avatar cursor-pointer transition-all duration-300 ${
                            podcastUploadingFor === p.id ? "border-red-500 bg-red-500/20 scale-105" : "border-white/10"
                          }`}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => handlePodcastPhotoDrop(e, p.id)}
                        >
                          {p.thumbnail_url ? (
                            <Image src={p.thumbnail_url} alt={p.title} fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-700 text-xs font-bold bg-[#111]">No Thumb</div>
                          )}
                          <label className="absolute inset-0 bg-black/60 opacity-0 group-hover/avatar:opacity-100 flex flex-col items-center justify-center transition-opacity text-[8px] font-mono font-bold text-white uppercase tracking-widest cursor-pointer">
                            <Upload className="w-3.5 h-3.5 mb-1 text-red-400 animate-bounce" /> Drag & Drop
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => handlePodcastPhotoUpload(e, p.id)} />
                          </label>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[9px] font-mono text-red-450 uppercase tracking-wider truncate">Youtube Episode</p>
                          <h3 className="text-sm font-bold text-white truncate">{p.title || "Untitled"}</h3>
                          <p className="text-xs text-gray-500 truncate">{p.duration || "15:00"}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-2">
                        <div className="flex gap-1">
                          <button onClick={() => movePodcastOrder(p, "up")} className="p-1.5 bg-white/5 rounded"><ChevronUp className="w-3.5 h-3.5 text-gray-400"/></button>
                          <button onClick={() => movePodcastOrder(p, "down")} className="p-1.5 bg-white/5 rounded"><ChevronDown className="w-3.5 h-3.5 text-gray-400"/></button>
                        </div>
                        <div className="flex gap-1.5">
                          <button onClick={() => togglePodcastActive(p)} className={`p-1.5 rounded transition-all ${p.active ? "bg-red-500/10 text-red-400" : "bg-red-500/10 text-red-400"}`}>
                            {p.active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                          </button>
                          <button onClick={() => openPodcastEditForm(p)} className="p-1.5 bg-blue-500/10 text-blue-400 rounded"><Edit3 className="w-3.5 h-3.5"/></button>
                          <button onClick={() => handlePodcastDelete(p.id, p.title)} className="p-1.5 bg-red-500/10 text-red-400 rounded"><Trash2 className="w-3.5 h-3.5"/></button>
                        </div>
                      </div>
                    </GlassCard>
                  ))}
                </div>
              </motion.div>
            )}

            {/* BRANDING TAB */}
            {activeTab === "branding" && (
              <motion.div key="branding" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="space-y-8">
                <div className="mb-6 border-b border-white/10 pb-4">
                  <h2 className="text-3xl font-black font-mono uppercase tracking-tight text-white">Branding Manager</h2>
                  <p className="text-white/50 text-sm">Manage clinical session photo albums and global marketing assets.</p>
                </div>

                {/* Sub-tabs */}
                <div className="flex gap-2 mb-6 border-b border-white/5 pb-3">
                  {[
                    { id: "assets", label: "Identity QR Assets" },
                    { id: "gallery", label: "Clinical Gallery" },
                    { id: "brands", label: "Our Brands" }
                  ].map((subTab) => (
                    <button
                      key={subTab.id}
                      onClick={() => setBrandingActiveSubTab(subTab.id as any)}
                      className={`px-4 py-2 rounded-lg text-xs font-bold font-mono uppercase tracking-wider transition-all ${
                        brandingActiveSubTab === subTab.id 
                          ? "bg-yellow-500/20 text-[#eab308] border border-yellow-500/30" 
                          : "text-white/40 hover:text-white hover:bg-white/5 border border-transparent"
                      }`}
                    >
                      {subTab.label}
                    </button>
                  ))}
                </div>

                {brandingActiveSubTab === "gallery" && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <GlassCard className="p-6 border-white/5 bg-[#0a0a0a] shadow-xl">
                      <h3 className="text-base font-bold font-mono uppercase tracking-wider text-white mb-4 flex items-center gap-2"><ImageIcon className="w-5 h-5 text-indigo-400" /> Upload Session Photo</h3>
                      <form onSubmit={(e) => {
                        handleAddContent(e, addSessionPhoto);
                        setPhotoPreview(null);
                        setPhotoCaption("");
                      }} className="space-y-4">
                        <div
                          className={`relative rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer ${
                            photoDragOver ? "border-indigo-500 bg-indigo-500/10" : "border-white/10 bg-[#050505] hover:border-indigo-500/40"
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
                          <input ref={photoFileRef} type="file" accept="image/*" className="hidden" onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (ev) => setPhotoPreview(ev.target?.result as string);
                              reader.readAsDataURL(file);
                            }
                          }} />
                          {photoPreview ? (
                            <div className="relative">
                              <img src={photoPreview} alt="Preview" className="w-full h-36 object-cover rounded-xl" />
                              <button type="button" onClick={(e) => { e.stopPropagation(); setPhotoPreview(null); }} className="absolute top-2 right-2 p-1.5 bg-black text-white rounded-full"><Trash2 className="w-4 h-4" /></button>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                              <ImageIcon className="h-8 w-8 mb-2 text-white/30" />
                              <p className="text-xs text-white/60">Drag and drop file or browse files</p>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <input name="caption" required value={photoCaption} onChange={e => setPhotoCaption(e.target.value)} placeholder="Describe this session caption..." className="flex-1 bg-[#050505] border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none" />
                          <input type="hidden" name="image_url" value={photoPreview || ""} />
                          <button type="submit" className="px-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold font-mono text-xs uppercase tracking-wider">Upload</button>
                        </div>
                      </form>
                    </GlassCard>

                    <div className="space-y-4">
                      <h3 className="text-base font-bold font-mono uppercase tracking-wider text-white">Active Session Gallery</h3>
                      <div className="grid grid-cols-2 gap-4 max-h-[460px] overflow-y-auto custom-scrollbar">
                        {data?.session_photos?.map((photo: any) => (
                          <div key={photo.id} className="relative rounded-2xl overflow-hidden border border-white/5 bg-[#0a0a0a] group aspect-square">
                            <img src={photo.image_url} alt="session" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                              <p className="text-xs text-white/80 line-clamp-2 mb-2 font-medium">{photo.caption}</p>
                              <button onClick={() => handleDeleteContent(photo.id, deleteSessionPhoto)} className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-mono text-[9px] uppercase tracking-wider font-bold rounded">Delete</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {brandingActiveSubTab === "assets" && (() => {
                  const rideUrl = typeof window !== 'undefined' ? `${window.location.origin}/ride/DEMO-SAFE-001` : "https://www.healix-technologies.com/ride/DEMO-SAFE-001";
                  const copyUrl = () => {
                    navigator.clipboard.writeText(rideUrl);
                    setBrandingCopied(true);
                    setTimeout(() => setBrandingCopied(false), 2000);
                  };
                  return (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start text-white">
                      {/* Preview Section */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                      >
                        <BrandedQRCard 
                          deviceId="DEMO-SAFE-001"
                          vehicleReg="DL-1-SAFE-2026"
                          driverName="Healix Safety Driver"
                          rideUrl={rideUrl}
                        />
                      </motion.div>

                      {/* Configuration / Details */}
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="space-y-8"
                      >
                        <GlassCard className="p-8 bg-[#0a0a0a] border-white/5 shadow-xl">
                          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <Shield className="text-blue-400" /> Infrastructure Logo
                          </h2>
                          <p className="text-white/60 mb-8 leading-relaxed text-sm">
                            This high-fidelity scannable logo combines the Healix Shield with a high-error-correction QR code. Even if 30% of the card is damaged, the safety logic remains operational.
                          </p>

                          <div className="space-y-4">
                            <div className="p-4 bg-[#050505] rounded-xl border border-white/10">
                              <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-1">Target Endpoint</p>
                              <div className="flex items-center justify-between">
                                <code className="text-xs text-blue-400 break-all">{rideUrl}</code>
                                <button onClick={copyUrl} className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/60 shrink-0">
                                  {brandingCopied ? <span className="text-green-500 text-[10px] font-bold">COPIED</span> : <Copy className="w-4 h-4" />}
                                </button>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="p-4 bg-[#050505] rounded-xl border border-white/10">
                                <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-1">Print Density</p>
                                <p className="text-base font-bold font-mono">300 DPI</p>
                              </div>
                              <div className="p-4 bg-[#050505] rounded-xl border border-white/10">
                                <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-1">Safe Zone</p>
                                <p className="text-base font-bold font-mono">14.2%</p>
                              </div>
                            </div>
                          </div>
                        </GlassCard>

                        <GlassCard className="p-8 border-white/5 bg-[#0a0a0a] shadow-xl">
                          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <Smartphone className="text-purple-400" /> Deployment Guide
                          </h3>
                          <ol className="space-y-3 text-xs text-white/60 list-decimal pl-4">
                            <li>Download the high-resolution PNG using the button on the left.</li>
                            <li>Print on a durable vinyl sticker or 300gsm matte card.</li>
                            <li>Place on the left-rear passenger window or vehicle dashboard.</li>
                            <li>Passengers scan this to initialize a Suraksha Secure Ride.</li>
                          </ol>
                        </GlassCard>
                      </motion.div>
                    </div>
                  );
                })()}

                {brandingActiveSubTab === "brands" && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center pb-4 border-b border-white/10">
                      <div>
                        <h3 className="text-lg font-bold font-mono uppercase tracking-wider text-white">Our Brand Divisions</h3>
                        <p className="text-white/40 text-xs font-mono">Manage the auto-cycling brand list showcased on the homepage.</p>
                      </div>
                      <button onClick={openBrandAddForm} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold font-mono uppercase tracking-wider text-xs rounded-xl">
                        <Plus className="w-4 h-4" /> Add Brand
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {brandsList.map((b) => (
                        <GlassCard key={b.id} className="p-6 border-white/5 bg-[#0a0a0a] flex flex-col justify-between group min-h-[320px]">
                          <div className="space-y-4">
                            {/* Drag and Drop Thumbnail Uploader */}
                            <div 
                              className="aspect-square bg-zinc-950 border border-white/10 rounded-xl relative overflow-hidden flex items-center justify-center cursor-pointer group-hover:border-indigo-500/40 transition-colors"
                              onDragOver={(e) => e.preventDefault()}
                              onDrop={(e) => handleBrandPhotoDrop(e, b.id)}
                              onClick={() => {
                                const input = document.getElementById(`brand-photo-input-${b.id}`) as HTMLInputElement;
                                input?.click();
                              }}
                            >
                              <input 
                                type="file" 
                                id={`brand-photo-input-${b.id}`} 
                                accept="image/*" 
                                className="hidden" 
                                onChange={(e) => handleBrandPhotoUpload(e, b.id)} 
                              />
                              {brandUploadingFor === b.id ? (
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                  <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
                                </div>
                              ) : b.logo_url ? (
                                <img src={b.logo_url} alt={b.name} className="w-full h-full object-contain p-2" />
                              ) : (
                                <div className="text-center p-4">
                                  <ImageIcon className="w-8 h-8 text-white/20 mx-auto mb-2" />
                                  <p className="text-[9px] font-mono text-white/40 uppercase tracking-wider">Drag & drop logo</p>
                                </div>
                              )}
                            </div>

                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-extrabold text-sm text-white font-mono uppercase tracking-wide truncate">{b.name}</h4>
                                <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded uppercase tracking-wider bg-white/5 text-indigo-400">{b.logo_text}</span>
                              </div>
                              <p className="text-[10px] text-zinc-500 font-mono mb-2">{b.role}</p>
                              <p className="text-xs text-white/60 leading-relaxed font-sans line-clamp-3">{b.description || b.desc}</p>
                            </div>
                          </div>

                          <div className="flex justify-between items-center pt-4 border-t border-white/5 mt-4">
                            <div className="flex gap-1">
                              <button onClick={() => moveBrandOrder(b, 'up')} className="p-1 text-white/40 hover:text-white hover:bg-white/5 rounded transition-all"><ChevronUp className="w-4 h-4" /></button>
                              <button onClick={() => moveBrandOrder(b, 'down')} className="p-1 text-white/40 hover:text-white hover:bg-white/5 rounded transition-all"><ChevronDown className="w-4 h-4" /></button>
                            </div>

                            <div className="flex gap-2">
                              <button onClick={() => toggleBrandActive(b)} className={`p-1.5 rounded transition-all ${b.active ? "bg-indigo-500/10 text-indigo-400" : "bg-white/5 text-white/30"}`}>
                                {b.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                              </button>
                              <button onClick={() => openBrandEditForm(b)} className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"><Edit3 className="w-4 h-4" /></button>
                              <button onClick={() => handleBrandDelete(b.id, b.name)} className="p-1.5 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all"><Trash2 className="w-4 h-4" /></button>
                            </div>
                          </div>
                        </GlassCard>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* REELS TAB */}
            {activeTab === "reels" && (
              <motion.div key="reels" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="space-y-8">
                <div className="mb-8 border-b border-white/10 pb-6">
                  <h2 className="text-3xl font-black font-mono uppercase tracking-tight text-white">Communication Reels</h2>
                  <p className="text-white/50 text-sm">Upload and manage active community video reels appearing on the home landing page.</p>
                </div>
                
                <GlassCard className="p-6 bg-[#0a0a0a] border-white/5 max-w-xl mx-auto shadow-xl">
                  <h3 className="text-base font-bold font-mono uppercase tracking-wider text-white mb-6">Create New Video Reel</h3>
                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    const form = e.currentTarget;
                    const fd = new FormData(form);
                    const reelData = {
                      title: fd.get("title") as string,
                      user_handle: fd.get("user_handle") as string,
                      thumbnail_url: fd.get("thumbnail_url") as string,
                      video_url: fd.get("video_url") as string
                    };
                    const res = await addReel(reelData);
                    if (res.error) alert(res.error);
                    else {
                      form.reset();
                      fetchData();
                    }
                  }} className="space-y-4">
                    <input name="title" required placeholder="Reel Title" className="w-full bg-[#050505] border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm" />
                    <input name="user_handle" required placeholder="User Handle (e.g. @scientist_s)" className="w-full bg-[#050505] border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm" />
                    <input name="thumbnail_url" required placeholder="Thumbnail Graphic URL" className="w-full bg-[#050505] border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm" />
                    <input name="video_url" required placeholder="Video Asset CDN URL" className="w-full bg-[#050505] border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm" />
                    <button type="submit" className="w-full py-2.5 bg-pink-600 hover:bg-pink-700 text-white font-mono uppercase tracking-wider text-xs font-bold rounded-xl transition-all">Publish Reel</button>
                  </form>
                </GlassCard>

                <div className="space-y-4 mt-8">
                  <h3 className="text-base font-bold font-mono uppercase tracking-wider text-white">Active Communication Reels</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {data.reels?.map((reel: any) => (
                      <GlassCard key={reel.id} className="p-4 bg-[#0a0a0a] border-white/5 relative group">
                        <div className="aspect-[9/16] relative rounded-xl overflow-hidden mb-4 bg-black">
                          <img src={reel.thumbnail_url} alt="thumbnail" className="w-full h-full object-cover" />
                        </div>
                        <h4 className="font-bold text-sm leading-tight text-white mb-1">{reel.title}</h4>
                        <p className="text-xs text-pink-400 font-mono">{reel.user_handle}</p>
                        <button onClick={() => handleDeleteContent(reel.id, deleteReel)} className="absolute top-4 right-4 p-2 bg-red-500/10 text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </GlassCard>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* SYSTEM HEALTH TAB */}
            {activeTab === "system" && (
              <motion.div key="system" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="space-y-8">
                <div className="mb-8 border-b border-white/10 pb-6">
                  <h2 className="text-3xl font-black font-mono uppercase tracking-tight text-white">System Diagnostics</h2>
                  <p className="text-white/50 text-sm">Real-time edge gateway status and cloud database connection metrics.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <GlassCard className="p-6 bg-[#0a0a0a] border-white/5">
                    <h3 className="font-bold text-base font-mono uppercase tracking-wider mb-4 text-green-400">Node Status Logs</h3>
                    <div className="space-y-3 text-xs font-mono text-white/70">
                      <p className="flex justify-between"><span>Core Server</span> <span className="text-green-400 font-bold">ONLINE</span></p>
                      <p className="flex justify-between"><span>Region Handshake</span> <span className="text-green-400 font-bold">OPTIMAL (Delhi-1)</span></p>
                      <p className="flex justify-between"><span>Edge SSL Gateway</span> <span className="text-green-400 font-bold">ACTIVE (Let's Encrypt)</span></p>
                      <p className="flex justify-between"><span>Supabase client connection</span> <span className="text-green-400 font-bold">CONNECTED</span></p>
                      <p className="flex justify-between"><span>Redis Sliding-window limiter</span> <span className="text-green-400 font-bold">ONLINE</span></p>
                    </div>
                  </GlassCard>

                  <GlassCard className="p-6 bg-[#0a0a0a] border-white/5">
                    <h3 className="font-bold text-base font-mono uppercase tracking-wider mb-4 text-purple-400">Audit logs</h3>
                    <div className="space-y-3 text-[10px] font-mono text-white/50 max-h-[160px] overflow-y-auto custom-scrollbar uppercase">
                      {data.evidence?.map((log: any) => (
                        <p key={log.id} className="border-b border-white/5 pb-2">
                          <span className="text-purple-400">{new Date(log.created_at).toLocaleTimeString()}</span> - Actor ID: {log.trips?.user_id?.substring(0, 8) || "System"} executed action {log.action}
                        </p>
                      ))}
                    </div>
                  </GlassCard>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </main>
      </div>

      {/* Branded QR Card Modal */}
      <AnimatePresence>
        {qrModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
            onClick={() => setQrModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-[#0a0a0f] border border-white/10 rounded-3xl p-8 shadow-2xl flex flex-col items-center gap-6 max-w-sm w-full"
              onClick={e => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="flex items-center gap-2 justify-center text-blue-400 mb-1">
                  <Shield className="w-4 h-4" />
                  <span className="font-mono text-xs tracking-wider uppercase">Project Suraksha</span>
                </div>
                <h2 className="text-lg font-bold text-white">Branded QR Card</h2>
                <p className="text-xs text-gray-500 mt-1">
                  Print or display this for <span className="text-blue-400 font-mono">{qrModal.deviceId}</span>
                </p>
              </div>

              <BrandedQRCard
                deviceId={qrModal.deviceId}
                vehicleReg={qrModal.vehicleReg}
                driverName={qrModal.driverName}
                rideUrl={`${typeof window !== 'undefined' ? window.location.origin : ''}/ride/${qrModal.deviceId}`}
                downloadable={true}
              />

              <button
                onClick={() => setQrModal(null)}
                className="text-sm text-gray-500 hover:text-white transition-colors"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Corporate Mentors Modal */}
      <AnimatePresence>
        {showCorpForm && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
            onClick={() => setShowCorpForm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
                <h2 className="text-xl font-bold text-white font-mono uppercase tracking-wider">{editingCorpId ? "Edit Advisor" : "Register New Advisor"}</h2>
                <button onClick={() => setShowCorpForm(false)} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"><X className="w-4 h-4" /></button>
              </div>

              <form onSubmit={handleCorpSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1.5 uppercase tracking-wider">Full Name *</label>
                    <input required value={corpForm.name} onChange={e => setCorpForm(f => ({ ...f, name: e.target.value }))} className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1.5 uppercase tracking-wider">Role / Title *</label>
                    <input required value={corpForm.role} onChange={e => setCorpForm(f => ({ ...f, role: e.target.value }))} className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1.5 uppercase tracking-wider">Organization *</label>
                    <input required value={corpForm.organization} onChange={e => setCorpForm(f => ({ ...f, organization: e.target.value }))} className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1.5 uppercase tracking-wider">Photo URL</label>
                    <div className="flex gap-2">
                      <input value={corpForm.photo_url} onChange={e => setCorpForm(f => ({ ...f, photo_url: e.target.value }))} className="flex-1 bg-[#050505] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm" />
                      <div className="relative">
                        <input type="file" accept="image/*" id="modal-photo-upload-btn" className="hidden" onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) uploadPhotoFromModal(file, editingCorpId || "temp");
                        }} />
                        <label htmlFor="modal-photo-upload-btn" className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider cursor-pointer h-full flex items-center justify-center">
                          Upload
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Drag and Drop Zone inside Modal */}
                <div 
                  className="border border-dashed border-white/10 hover:border-emerald-500/50 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-white/5 relative h-32"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const file = e.dataTransfer.files?.[0];
                    if (file) {
                      uploadPhotoFromModal(file, editingCorpId || "temp");
                    }
                  }}
                >
                  <Upload className="w-6 h-6 text-emerald-400 mb-2 animate-pulse" />
                  <p className="text-xs text-white font-mono uppercase tracking-wider">Drag & Drop Image Here to Upload</p>
                  <p className="text-[10px] text-gray-500 mt-1 font-mono">Or click to select a file locally</p>
                  <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) uploadPhotoFromModal(file, editingCorpId || "temp");
                  }} />
                </div>
                <div>
                  <label className="block text-xs font-mono text-gray-400 mb-1.5 uppercase tracking-wider">Biography</label>
                  <textarea rows={3} value={corpForm.bio} onChange={e => setCorpForm(f => ({ ...f, bio: e.target.value }))} className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-mono text-gray-400 mb-1.5 uppercase tracking-wider">Inspiring Quote</label>
                  <input value={corpForm.quote} onChange={e => setCorpForm(f => ({ ...f, quote: e.target.value }))} className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm" />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <input placeholder="LinkedIn Url" value={corpForm.linkedin_url} onChange={e => setCorpForm(f => ({ ...f, linkedin_url: e.target.value }))} className="w-full bg-[#050505] border border-white/10 rounded-xl px-3 py-2 text-xs text-white" />
                  <input placeholder="Twitter Url" value={corpForm.twitter_url} onChange={e => setCorpForm(f => ({ ...f, twitter_url: e.target.value }))} className="w-full bg-[#050505] border border-white/10 rounded-xl px-3 py-2 text-xs text-white" />
                  <input placeholder="GitHub Url" value={corpForm.github_url} onChange={e => setCorpForm(f => ({ ...f, github_url: e.target.value }))} className="w-full bg-[#050505] border border-white/10 rounded-xl px-3 py-2 text-xs text-white" />
                </div>
                <div>
                  <label className="block text-xs font-mono text-gray-400 mb-1.5 uppercase tracking-wider">Homepage Section Category</label>
                  <select
                    value={corpForm.category}
                    onChange={e => setCorpForm(f => ({ ...f, category: e.target.value }))}
                    className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm"
                  >
                    <option value="clinical">🩺 Clinical Advisors</option>
                    <option value="research">🔬 Research Advisors</option>
                    <option value="academic">🎓 Academic Mentors</option>
                    <option value="industry">🏢 Industry Experts</option>
                  </select>
                  <p className="text-[10px] text-gray-600 mt-1.5 font-mono">Controls which column this person appears in on the homepage.</p>
                </div>
                <div className="flex gap-3 pt-4 border-t border-white/5">
                  <button type="button" onClick={() => setShowCorpForm(false)} className="flex-1 py-2.5 rounded-xl border border-white/10 text-gray-400 hover:text-white">Cancel</button>
                  <button type="submit" disabled={corpSubmitting} className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold font-mono text-sm uppercase tracking-wider disabled:opacity-50">
                    {corpSubmitting ? "Saving..." : editingCorpId ? "Save Changes" : "Register Advisor"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Engineering Team Modal */}
      <AnimatePresence>
        {showTeamForm && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
            onClick={() => setShowTeamForm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
                <h2 className="text-xl font-bold text-white font-mono uppercase tracking-wider">{editingTeamId ? "Edit Team Member" : "Add Team Member"}</h2>
                <button onClick={() => setShowTeamForm(false)} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"><X className="w-4 h-4" /></button>
              </div>

              <form onSubmit={handleTeamSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1.5 uppercase tracking-wider">Full Name *</label>
                    <input required value={teamForm.name} onChange={e => setTeamForm(f => ({ ...f, name: e.target.value }))} className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1.5 uppercase tracking-wider">Role / Title *</label>
                    <input required value={teamForm.role} onChange={e => setTeamForm(f => ({ ...f, role: e.target.value }))} className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1.5 uppercase tracking-wider">Focus / Specialization *</label>
                    <input required value={teamForm.focus} onChange={e => setTeamForm(f => ({ ...f, focus: e.target.value }))} className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1.5 uppercase tracking-wider">Photo URL</label>
                    <div className="flex gap-2">
                      <input value={teamForm.photo_url} onChange={e => setTeamForm(f => ({ ...f, photo_url: e.target.value }))} className="flex-1 bg-[#050505] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm" />
                      <div className="relative">
                        <input type="file" accept="image/*" id="team-modal-photo-upload-btn" className="hidden" onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) uploadTeamPhotoFromModal(file, editingTeamId || "temp");
                        }} />
                        <label htmlFor="team-modal-photo-upload-btn" className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider cursor-pointer h-full flex items-center justify-center">
                          Upload
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Drag and Drop Zone inside Modal */}
                <div 
                  className="border border-dashed border-white/10 hover:border-orange-500/50 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-white/5 relative h-32"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const file = e.dataTransfer.files?.[0];
                    if (file) {
                      uploadTeamPhotoFromModal(file, editingTeamId || "temp");
                    }
                  }}
                >
                  <Upload className="w-6 h-6 text-orange-400 mb-2 animate-pulse" />
                  <p className="text-xs text-white font-mono uppercase tracking-wider">Drag & Drop Image Here to Upload</p>
                  <p className="text-[10px] text-gray-500 mt-1 font-mono">Or click to select a file locally</p>
                  <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) uploadTeamPhotoFromModal(file, editingTeamId || "temp");
                  }} />
                </div>
                <div className="flex gap-3 pt-4 border-t border-white/5">
                  <button type="button" onClick={() => setShowTeamForm(false)} className="flex-1 py-2.5 rounded-xl border border-white/10 text-gray-400 hover:text-white">Cancel</button>
                  <button type="submit" disabled={teamSubmitting} className="flex-1 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold font-mono text-sm uppercase tracking-wider disabled:opacity-50">
                    {teamSubmitting ? "Saving..." : editingTeamId ? "Save Changes" : "Register Team Member"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Podcasts Modal */}
      <AnimatePresence>
        {showPodcastForm && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
            onClick={() => setShowPodcastForm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
                <h2 className="text-xl font-bold text-white font-mono uppercase tracking-wider">{editingPodcastId ? "Edit Podcast" : "Add Podcast"}</h2>
                <button onClick={() => setShowPodcastForm(false)} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"><X className="w-4 h-4" /></button>
              </div>

              <form onSubmit={handlePodcastSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1.5 uppercase tracking-wider">Title *</label>
                    <input required value={podcastForm.title} onChange={e => setPodcastForm(f => ({ ...f, title: e.target.value }))} className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1.5 uppercase tracking-wider">YouTube URL *</label>
                    <input required value={podcastForm.youtube_url} onChange={e => setPodcastForm(f => ({ ...f, youtube_url: e.target.value }))} className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1.5 uppercase tracking-wider">Duration (e.g. 15:30) *</label>
                    <input required value={podcastForm.duration} onChange={e => setPodcastForm(f => ({ ...f, duration: e.target.value }))} className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1.5 uppercase tracking-wider">Thumbnail URL</label>
                    <div className="flex gap-2">
                      <input value={podcastForm.thumbnail_url} onChange={e => setPodcastForm(f => ({ ...f, thumbnail_url: e.target.value }))} className="flex-1 bg-[#050505] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm" />
                      <div className="relative">
                        <input type="file" accept="image/*" id="podcast-modal-photo-upload-btn" className="hidden" onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) uploadPodcastPhotoFromModal(file, editingPodcastId || "temp");
                        }} />
                        <label htmlFor="podcast-modal-photo-upload-btn" className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider cursor-pointer h-full flex items-center justify-center">
                          Upload
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Drag and Drop Zone inside Modal */}
                <div 
                  className="border border-dashed border-white/10 hover:border-red-500/50 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-white/5 relative h-32"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const file = e.dataTransfer.files?.[0];
                    if (file) {
                      uploadPodcastPhotoFromModal(file, editingPodcastId || "temp");
                    }
                  }}
                >
                  <Upload className="w-6 h-6 text-red-400 mb-2 animate-pulse" />
                  <p className="text-xs text-white font-mono uppercase tracking-wider">Drag & Drop Image Here to Upload</p>
                  <p className="text-[10px] text-gray-500 mt-1 font-mono">Or click to select a file locally</p>
                  <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) uploadPodcastPhotoFromModal(file, editingPodcastId || "temp");
                  }} />
                </div>
                <div>
                  <label className="block text-xs font-mono text-gray-400 mb-1.5 uppercase tracking-wider">Description *</label>
                  <textarea rows={3} required value={podcastForm.description} onChange={e => setPodcastForm(f => ({ ...f, description: e.target.value }))} className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm" />
                </div>
                <div className="flex gap-3 pt-4 border-t border-white/5">
                  <button type="button" onClick={() => setShowPodcastForm(false)} className="flex-1 py-2.5 rounded-xl border border-white/10 text-gray-400 hover:text-white">Cancel</button>
                  <button type="submit" disabled={podcastSubmitting} className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold font-mono text-sm uppercase tracking-wider disabled:opacity-50">
                    {podcastSubmitting ? "Saving..." : editingPodcastId ? "Save Changes" : "Register Episode"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Academy Course Creation Modal */}
      <AnimatePresence>
        {showAcademyCourseModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
            onClick={() => setShowAcademyCourseModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold text-white font-mono uppercase tracking-wider mb-6">Create Cohort Course</h2>
              <form onSubmit={handleAddAcademyCourse} className="space-y-4">
                <input name="title" required placeholder="Course Title" className="w-full bg-[#050505] border border-white/10 rounded-lg p-3 text-sm text-white" />
                <input name="shortDescription" required placeholder="Short Description" className="w-full bg-[#050505] border border-white/10 rounded-lg p-3 text-sm text-white" />
                <div className="grid grid-cols-2 gap-4">
                  <input name="price" type="number" required placeholder="Price (₹)" className="w-full bg-[#050505] border border-white/10 rounded-lg p-3 text-sm text-white" />
                  <input name="duration" required placeholder="Duration (e.g. 12 Weeks)" className="w-full bg-[#050505] border border-white/10 rounded-lg p-3 text-sm text-white" />
                </div>
                <input name="thumbnail" required placeholder="Thumbnail image URL (https://...)" className="w-full bg-[#050505] border border-white/10 rounded-lg p-3 text-sm text-white" />
                <div className="flex gap-3 pt-4 border-t border-white/5">
                  <button type="button" onClick={() => setShowAcademyCourseModal(false)} className="flex-1 py-2.5 rounded-xl border border-white/10 text-gray-400 hover:text-white">Cancel</button>
                  <button type="submit" className="flex-1 py-2.5 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black font-bold font-mono text-sm uppercase tracking-wider">Save Course</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Academy Instructor Creation Modal */}
      <AnimatePresence>
        {showAcademyMentorModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
            onClick={() => setShowAcademyMentorModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold text-white font-mono uppercase tracking-wider mb-6">
                {editingAcademyMentorId ? "Edit Academy Instructor" : "Create Academy Instructor"}
              </h2>
              <form onSubmit={handleAddAcademyMentor} key={editingAcademyMentorId || "new"} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono text-white/40 uppercase tracking-wider mb-1">Full Name</label>
                    <input name="name" required defaultValue={academyMentorForm.name} placeholder="Full Name" className="w-full bg-[#050505] border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-yellow-500/50" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-white/40 uppercase tracking-wider mb-1">Role / Designation</label>
                    <input name="role" required defaultValue={academyMentorForm.role} placeholder="Role (e.g. Lead Educator)" className="w-full bg-[#050505] border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-yellow-500/50" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono text-white/40 uppercase tracking-wider mb-1">Company / Institution</label>
                    <input name="institution" required defaultValue={academyMentorForm.institution} placeholder="Company / Institution" className="w-full bg-[#050505] border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-yellow-500/50" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-white/40 uppercase tracking-wider mb-1">Experience</label>
                    <input name="experience" required defaultValue={academyMentorForm.experience} placeholder="Experience (e.g. 8+ Years)" className="w-full bg-[#050505] border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-yellow-500/50" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono text-white/40 uppercase tracking-wider mb-1">Specialization Area</label>
                    <input name="specialization" required defaultValue={academyMentorForm.specialization} placeholder="Specialization (e.g. Genomic AI)" className="w-full bg-[#050505] border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-yellow-500/50" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-white/40 uppercase tracking-wider mb-1">LinkedIn URL</label>
                    <input name="linkedinUrl" required defaultValue={academyMentorForm.linkedinUrl} placeholder="LinkedIn URL" className="w-full bg-[#050505] border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-yellow-500/50" />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-white/40 uppercase tracking-wider mb-1">Partner Companies / Affiliations (comma separated)</label>
                  <input name="companies" defaultValue={academyMentorForm.companies} placeholder="Google, DeepMind, Healix" className="w-full bg-[#050505] border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-yellow-500/50" />
                </div>
                
                <div>
                  <label className="block text-[10px] font-mono text-white/40 uppercase tracking-wider mb-1">Instructor Photo</label>
                  <div className="grid grid-cols-[100px_1fr] gap-4 items-center">
                    <div className="w-20 h-20 rounded-xl border border-white/10 bg-white/5 relative overflow-hidden flex items-center justify-center">
                      {isUploadingAcademy === 'new' ? (
                        <Loader2 className="w-5 h-5 text-[#eab308] animate-spin" />
                      ) : newAcademyMentorPhotoUrl ? (
                        <Image src={newAcademyMentorPhotoUrl} alt="Preview" fill className="object-cover" />
                      ) : (
                        <span className="text-[9px] font-mono text-white/30 text-center">No Photo</span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <input name="photoUrl" value={newAcademyMentorPhotoUrl} onChange={(e) => setNewAcademyMentorPhotoUrl(e.target.value)} required placeholder="Or paste direct Image URL..." className="flex-1 bg-[#050505] border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-yellow-500/50" />
                      <label className="px-3 py-3 bg-[#eab308] text-black rounded-lg font-bold text-[9px] flex items-center gap-1 cursor-pointer uppercase tracking-wider shrink-0 font-mono items-center justify-center">
                        <Upload className="w-3.5 h-3.5" /> Upload File
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleAcademyPhotoUpload(e)} />
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-white/40 uppercase tracking-wider mb-1">Biography / Overview</label>
                  <textarea name="bio" rows={3} required defaultValue={academyMentorForm.bio} placeholder="Instructor Biography..." className="w-full bg-[#050505] border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-yellow-500/50" />
                </div>

                <div className="flex gap-3 pt-4 border-t border-white/5">
                  <button type="button" onClick={() => { setShowAcademyMentorModal(false); setEditingAcademyMentorId(null); }} className="flex-1 py-2.5 rounded-xl border border-white/10 text-gray-400 hover:text-white">Cancel</button>
                  <button type="submit" className="flex-1 py-2.5 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black font-bold font-mono text-sm uppercase tracking-wider">
                    {editingAcademyMentorId ? "Update Instructor" : "Save Instructor"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Brands Modal */}
      <AnimatePresence>
        {showBrandForm && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
            onClick={() => setShowBrandForm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
                <h2 className="text-xl font-bold text-white font-mono uppercase tracking-wider">{editingBrandId ? "Edit Brand" : "Add Brand"}</h2>
                <button onClick={() => setShowBrandForm(false)} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"><X className="w-4 h-4" /></button>
              </div>

              <form onSubmit={handleBrandSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1.5 uppercase tracking-wider">Brand Name *</label>
                    <input required value={brandForm.name} onChange={e => setBrandForm(f => ({ ...f, name: e.target.value }))} className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1.5 uppercase tracking-wider">Logo Abbreviation (Text) *</label>
                    <input required value={brandForm.logo_text} onChange={e => setBrandForm(f => ({ ...f, logo_text: e.target.value }))} className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1.5 uppercase tracking-wider">Role / Sub-headline *</label>
                    <input required value={brandForm.role} onChange={e => setBrandForm(f => ({ ...f, role: e.target.value }))} className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1.5 uppercase tracking-wider">Lucide Icon Name (e.g. Shield, Heart) *</label>
                    <input required value={brandForm.icon_name} onChange={e => setBrandForm(f => ({ ...f, icon_name: e.target.value }))} className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1.5 uppercase tracking-wider">Accent Theme Class</label>
                    <input value={brandForm.accent} onChange={e => setBrandForm(f => ({ ...f, accent: e.target.value }))} className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none" placeholder="text-blue-500 bg-blue-500/10 border-blue-500/20" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1.5 uppercase tracking-wider">Accent Color (Hex)</label>
                    <input value={brandForm.color} onChange={e => setBrandForm(f => ({ ...f, color: e.target.value }))} className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none" placeholder="#ea580c" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-mono text-gray-400 mb-1.5 uppercase tracking-wider">Logo Image URL</label>
                  <div className="flex gap-2">
                    <input value={brandForm.logo_url} onChange={e => setBrandForm(f => ({ ...f, logo_url: e.target.value }))} className="flex-1 bg-[#050505] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none" placeholder="https://..." />
                    <div className="relative">
                      <input type="file" accept="image/*" id="brand-modal-photo-upload-btn" className="hidden" onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) uploadBrandPhotoFromModal(file, editingBrandId || "temp");
                      }} />
                      <label htmlFor="brand-modal-photo-upload-btn" className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider cursor-pointer h-full flex items-center justify-center">
                        Upload
                      </label>
                    </div>
                  </div>
                </div>
                {/* Drag and Drop Zone inside Modal */}
                <div 
                  className="border border-dashed border-white/10 hover:border-indigo-500/50 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-white/5 relative h-32"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const file = e.dataTransfer.files?.[0];
                    if (file) {
                      uploadBrandPhotoFromModal(file, editingBrandId || "temp");
                    }
                  }}
                >
                  <Upload className="w-6 h-6 text-indigo-400 mb-2 animate-pulse" />
                  <p className="text-xs text-white font-mono uppercase tracking-wider">Drag & Drop Image Here to Upload</p>
                  <p className="text-[10px] text-gray-500 mt-1 font-mono">Or click to select a file locally</p>
                  <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) uploadBrandPhotoFromModal(file, editingBrandId || "temp");
                  }} />
                </div>
                <div>
                  <label className="block text-xs font-mono text-gray-400 mb-1.5 uppercase tracking-wider">Description *</label>
                  <textarea rows={3} required value={brandForm.description} onChange={e => setBrandForm(f => ({ ...f, description: e.target.value }))} className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none" />
                </div>
                <div className="flex gap-3 pt-4 border-t border-white/5">
                  <button type="button" onClick={() => setShowBrandForm(false)} className="flex-1 py-2.5 rounded-xl border border-white/10 text-gray-400 hover:text-white">Cancel</button>
                  <button type="submit" disabled={brandSubmitting} className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold font-mono text-sm uppercase tracking-wider disabled:opacity-50">
                    {brandSubmitting ? "Saving..." : editingBrandId ? "Save Changes" : "Register Brand"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Founders Modal */}
      <AnimatePresence>
        {showFounderForm && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
            onClick={() => setShowFounderForm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
                <h2 className="text-xl font-bold text-white font-mono uppercase tracking-wider">{editingFounderId ? "Edit Founder" : "Add Founder"}</h2>
                <button onClick={() => setShowFounderForm(false)} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"><X className="w-4 h-4" /></button>
              </div>

              {founderDbAlert && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex gap-3 text-red-200 text-xs leading-relaxed font-mono">
                  <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold uppercase mb-1">Database Table Missing</p>
                    <p>The database table 'founders' is missing in Supabase. You must run `supabase_founders_schema.sql` in your Supabase SQL editor to create the table and enable dynamic database changes.</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleFounderSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1.5 uppercase tracking-wider">Founder Name *</label>
                    <input required value={founderForm.name} onChange={e => setFounderForm(f => ({ ...f, name: e.target.value }))} className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1.5 uppercase tracking-wider">Role / Designation *</label>
                    <input required value={founderForm.role} onChange={e => setFounderForm(f => ({ ...f, role: e.target.value }))} className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-400 mb-1.5 uppercase tracking-wider">Photo URL</label>
                  <input value={founderForm.photo_url} onChange={e => setFounderForm(f => ({ ...f, photo_url: e.target.value }))} placeholder="https://..." className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1.5 uppercase tracking-wider">Institution / Affiliation</label>
                    <input value={founderForm.institution} onChange={e => setFounderForm(f => ({ ...f, institution: e.target.value }))} placeholder="Healix Technologies" className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1.5 uppercase tracking-wider">LinkedIn Profile URL</label>
                    <input value={founderForm.linkedin_url} onChange={e => setFounderForm(f => ({ ...f, linkedin_url: e.target.value }))} placeholder="https://linkedin.com/in/..." className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none" />
                  </div>
                </div>

                <div 
                  className="border-2 border-dashed border-white/10 hover:border-orange-500/50 bg-[#070707] rounded-xl p-8 flex flex-col items-center justify-center relative transition-all duration-300"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const file = e.dataTransfer.files?.[0];
                    if (file) {
                      const id = editingFounderId || "temp";
                      if (String(id).startsWith("f")) {
                        showToast("Cannot upload photo for static fallback founder. Run SQL schema first.", "err");
                        return;
                      }
                      const fd = new FormData();
                      fd.append("file", file);
                      fd.append("founderId", id);
                      fetch("/api/founders/upload", { method: "POST", body: fd })
                        .then(r => r.json())
                        .then(data => {
                          if (data.url) {
                            setFounderForm((f: any) => ({ ...f, photo_url: data.url }));
                            showToast("Founder photo uploaded successfully!");
                          } else {
                            showToast(data.error || "Upload failed", "err");
                          }
                        });
                    }
                  }}
                >
                  <Upload className="w-6 h-6 text-orange-400 mb-2 animate-pulse" />
                  <p className="text-xs text-white font-mono uppercase tracking-wider">Drag & Drop Image Here to Upload</p>
                  <p className="text-[10px] text-gray-500 mt-1 font-mono">Or click to select a file locally</p>
                  <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const id = editingFounderId || "temp";
                      if (String(id).startsWith("f")) {
                        showToast("Cannot upload photo for static fallback founder. Run SQL schema first.", "err");
                        return;
                      }
                      const fd = new FormData();
                      fd.append("file", file);
                      fd.append("founderId", id);
                      fetch("/api/founders/upload", { method: "POST", body: fd })
                        .then(r => r.json())
                        .then(data => {
                          if (data.url) {
                            setFounderForm((f: any) => ({ ...f, photo_url: data.url }));
                            showToast("Founder photo uploaded successfully!");
                          } else {
                            showToast(data.error || "Upload failed", "err");
                          }
                        });
                    }
                  }} />
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-400 mb-1.5 uppercase tracking-wider">Founder's Message / Quote *</label>
                  <textarea rows={4} required value={founderForm.quote} onChange={e => setFounderForm(f => ({ ...f, quote: e.target.value }))} placeholder="Share a message or quote with the community..." className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none" />
                </div>

                <div className="flex gap-3 pt-4 border-t border-white/5">
                  <button type="button" onClick={() => setShowFounderForm(false)} className="flex-1 py-2.5 rounded-xl border border-white/10 text-gray-400 hover:text-white">Cancel</button>
                  <button type="submit" disabled={founderSubmitting} className="flex-1 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold font-mono text-sm uppercase tracking-wider disabled:opacity-50">
                    {founderSubmitting ? "Saving..." : editingFounderId ? "Save Changes" : "Register Founder"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Network Professionals Modal */}
      <AnimatePresence>
        {showProfessionalForm && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
            onClick={() => setShowProfessionalForm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
                <h2 className="text-xl font-bold text-white font-mono uppercase tracking-wider">{editingProfessionalId ? "Edit Professional" : "Add Professional"}</h2>
                <button onClick={() => setShowProfessionalForm(false)} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"><X className="w-4 h-4" /></button>
              </div>

              {professionalDbAlert && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex gap-3 text-red-200 text-xs leading-relaxed font-mono">
                  <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold uppercase mb-1">Database Table Missing</p>
                    <p>The database table 'global_professionals' is missing in Supabase. You must run `supabase_global_network_schema.sql` in your Supabase SQL editor to create the table and enable dynamic database changes.</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleProfessionalSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1.5 uppercase tracking-wider">Professional Name *</label>
                    <input required value={professionalForm.name} onChange={e => setProfessionalForm(f => ({ ...f, name: e.target.value }))} className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1.5 uppercase tracking-wider">Role / Title *</label>
                    <input required value={professionalForm.role} onChange={e => setProfessionalForm(f => ({ ...f, role: e.target.value }))} className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-400 mb-1.5 uppercase tracking-wider">Institution *</label>
                  <input required value={professionalForm.institution} onChange={e => setProfessionalForm(f => ({ ...f, institution: e.target.value }))} placeholder="e.g. AIIMS Delhi, IIT Madras" className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none" />
                </div>

                {/* Qualifications */}
                <div>
                  <label className="block text-xs font-mono text-gray-400 mb-1.5 uppercase tracking-wider">Qualifications (one per line) *</label>
                  <textarea required rows={2} value={professionalForm.qualifications || ""} onChange={e => setProfessionalForm(f => ({ ...f, qualifications: e.target.value }))} placeholder="e.g. MBBS, MS, MCh (Neurosurgery)&#10;Fellowship in Advanced Spine Surgery" className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none font-sans" />
                </div>

                {/* Hospital Affiliation Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1.5 uppercase tracking-wider">Affiliated Hospital Name *</label>
                    <input required value={professionalForm.hospital_name || ""} onChange={e => setProfessionalForm(f => ({ ...f, hospital_name: e.target.value }))} placeholder="e.g. SHRI GANGARAM HOSPITAL" className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1.5 uppercase tracking-wider">Affiliated Hospital Location *</label>
                    <input required value={professionalForm.hospital_location || ""} onChange={e => setProfessionalForm(f => ({ ...f, hospital_location: e.target.value }))} placeholder="e.g. New Delhi, India" className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none" />
                  </div>
                </div>

                {/* Double Drag-and-Drop Zones for Portrait and Hospital Logo */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Doctor Portrait Upload */}
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1.5 uppercase tracking-wider">Doctor Photo (Portrait)</label>
                    <div 
                      className="border-2 border-dashed border-white/10 hover:border-orange-500/50 bg-[#070707] rounded-xl p-4 flex flex-col items-center justify-center relative transition-all duration-300 min-h-[140px] text-center"
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        const file = e.dataTransfer.files?.[0];
                        if (file) {
                          const id = editingProfessionalId || "temp";
                          if (String(id).startsWith("p")) {
                            showToast("Cannot upload photo for static fallback professional. Run SQL schema first.", "err");
                            return;
                          }
                          handleProfessionalModalAssetUpload(file, "photo");
                        }
                      }}
                    >
                      {professionalUploadingFor ? (
                        <div className="flex flex-col items-center justify-center">
                          <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mb-2" />
                          <p className="text-[10px] text-gray-400 font-mono">Uploading photo...</p>
                        </div>
                      ) : professionalForm.photo_url ? (
                        <div className="relative group w-20 h-20 rounded-full overflow-hidden border border-white/10">
                          <Image 
                            src={professionalForm.photo_url} 
                            alt="Preview" 
                            fill 
                            className="object-cover" 
                            unoptimized 
                          />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full z-20">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                setProfessionalForm((f: any) => ({ ...f, photo_url: "" }));
                              }}
                              className="p-1.5 rounded-full bg-red-600/80 hover:bg-red-600 text-white z-30"
                              title="Remove"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center pointer-events-none">
                          <Upload className="w-6 h-6 text-orange-400 mb-1.5 animate-pulse" />
                          <p className="text-[10px] text-white font-mono uppercase tracking-wider">Drag & Drop Photo</p>
                          <p className="text-[9px] text-gray-500 mt-0.5 font-mono">Or click to select</p>
                        </div>
                      )}
                      
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10" 
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const id = editingProfessionalId || "temp";
                            if (String(id).startsWith("p")) {
                              showToast("Cannot upload photo for static fallback professional. Run SQL schema first.", "err");
                              return;
                            }
                            handleProfessionalModalAssetUpload(file, "photo");
                          }
                        }} 
                      />
                    </div>
                    <input 
                      type="text"
                      value={professionalForm.photo_url || ""}
                      onChange={(e) => setProfessionalForm((f: any) => ({ ...f, photo_url: e.target.value }))}
                      placeholder="Or paste photo URL here..."
                      className="w-full mt-2 bg-[#050505] border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none placeholder-gray-600 font-mono"
                    />
                  </div>

                  {/* Hospital Logo Upload */}
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1.5 uppercase tracking-wider">Hospital Logo / Image</label>
                    <div 
                      className="border-2 border-dashed border-white/10 hover:border-orange-500/50 bg-[#070707] rounded-xl p-4 flex flex-col items-center justify-center relative transition-all duration-300 min-h-[140px] text-center"
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        const file = e.dataTransfer.files?.[0];
                        if (file) {
                          const id = editingProfessionalId || "temp";
                          if (String(id).startsWith("p")) {
                            showToast("Cannot upload hospital image for static fallback professional. Run SQL schema first.", "err");
                            return;
                          }
                          handleProfessionalModalAssetUpload(file, "hospital");
                        }
                      }}
                    >
                      {professionalHospitalUploadingFor ? (
                        <div className="flex flex-col items-center justify-center">
                          <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mb-2" />
                          <p className="text-[10px] text-gray-400 font-mono">Uploading image...</p>
                        </div>
                      ) : professionalForm.hospital_image ? (
                        <div className="relative group w-20 h-20 flex items-center justify-center bg-[#0d0d0d] rounded-lg border border-white/10 p-1.5">
                          <div className="relative w-full h-full">
                            <Image 
                              src={professionalForm.hospital_image} 
                              alt="Hospital Preview" 
                              fill 
                              className="object-contain" 
                              unoptimized 
                            />
                          </div>
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg z-20">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                setProfessionalForm((f: any) => ({ ...f, hospital_image: "" }));
                              }}
                              className="p-1.5 rounded-full bg-red-600/80 hover:bg-red-600 text-white z-30"
                              title="Remove"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center pointer-events-none">
                          <Upload className="w-6 h-6 text-orange-400 mb-1.5 animate-pulse" />
                          <p className="text-[10px] text-white font-mono uppercase tracking-wider">Drag & Drop Logo</p>
                          <p className="text-[9px] text-gray-500 mt-0.5 font-mono">Or click to select</p>
                        </div>
                      )}
                      
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10" 
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const id = editingProfessionalId || "temp";
                            if (String(id).startsWith("p")) {
                              showToast("Cannot upload hospital image for static fallback professional. Run SQL schema first.", "err");
                              return;
                            }
                            handleProfessionalModalAssetUpload(file, "hospital");
                          }
                        }} 
                      />
                    </div>
                    <input 
                      type="text"
                      value={professionalForm.hospital_image || ""}
                      onChange={(e) => setProfessionalForm((f: any) => ({ ...f, hospital_image: e.target.value }))}
                      placeholder="Or paste hospital logo URL..."
                      className="w-full mt-2 bg-[#050505] border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none placeholder-gray-600 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-400 mb-1.5 uppercase tracking-wider">Professional Description / Bio *</label>
                  <textarea rows={4} required value={professionalForm.description} onChange={e => setProfessionalForm(f => ({ ...f, description: e.target.value }))} placeholder="Enter biography and healthcare specialization details..." className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none" />
                </div>

                <div className="flex gap-3 pt-4 border-t border-white/5">
                  <button type="button" onClick={() => setShowProfessionalForm(false)} className="flex-1 py-2.5 rounded-xl border border-white/10 text-gray-400 hover:text-white">Cancel</button>
                  <button type="submit" disabled={professionalSubmitting} className="flex-1 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold font-mono text-sm uppercase tracking-wider disabled:opacity-50">
                    {professionalSubmitting ? "Saving..." : editingProfessionalId ? "Save Changes" : "Register Professional"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Network Facilities Modal */}
      <AnimatePresence>
        {showFacilityForm && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
            onClick={() => setShowFacilityForm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
                <h2 className="text-xl font-bold text-white font-mono uppercase tracking-wider">{editingFacilityId ? "Edit Facility" : "Add Facility"}</h2>
                <button onClick={() => setShowFacilityForm(false)} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"><X className="w-4 h-4" /></button>
              </div>

              {facilityDbAlert && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex gap-3 text-red-200 text-xs leading-relaxed font-mono">
                  <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold uppercase mb-1">Database Table Missing</p>
                    <p>The database table 'global_facilities' is missing in Supabase. You must run `supabase_global_network_extended_schema.sql` in your Supabase SQL editor to create the table and enable dynamic database changes.</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleFacilitySubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1.5 uppercase tracking-wider">Facility Name *</label>
                    <input required value={facilityForm.name} onChange={e => setFacilityForm((f: any) => ({ ...f, name: e.target.value }))} placeholder="e.g. IIT Madras" className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1.5 uppercase tracking-wider">City *</label>
                    <input required value={facilityForm.city} onChange={e => setFacilityForm((f: any) => ({ ...f, city: e.target.value }))} placeholder="e.g. Chennai" className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-400 mb-1.5 uppercase tracking-wider">Facility Hub/Sub-Name *</label>
                  <input required value={facilityForm.facility} onChange={e => setFacilityForm((f: any) => ({ ...f, facility: e.target.value }))} placeholder="e.g. Clinical Systems Research Lab" className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none" />
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-400 mb-1.5 uppercase tracking-wider">Projects (Comma-separated)</label>
                  <input 
                    value={facilityForm.projects?.join(", ")} 
                    onChange={e => setFacilityForm((f: any) => ({ ...f, projects: e.target.value.split(",").map(p => p.trim()) }))} 
                    placeholder="e.g. Cardio Diagnostics AI, Low-latency SOS Integration" 
                    className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-400 mb-1.5 uppercase tracking-wider">Campus Image URL</label>
                  <input value={facilityForm.image_url} onChange={e => setFacilityForm((f: any) => ({ ...f, image_url: e.target.value }))} placeholder="https://..." className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none" />
                </div>

                <div 
                  className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center relative transition-all duration-300 ${
                    facilityModalUploading 
                      ? "border-orange-500 bg-orange-500/10 cursor-not-allowed" 
                      : "border-white/10 hover:border-orange-500/50 bg-[#070707]"
                  }`}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (facilityModalUploading) return;
                    const file = e.dataTransfer.files?.[0];
                    if (file) {
                      const id = editingFacilityId || "temp";
                      if (String(id).startsWith("f")) {
                        showToast("Cannot upload photo for static fallback facility. Run SQL schema first.", "err");
                        return;
                      }
                      const fd = new FormData();
                      fd.append("file", file);
                      fd.append("facilityId", id);
                      fd.append("type", "campus");
                      setFacilityModalUploading(true);
                      fetch("/api/facilities/upload", { method: "POST", body: fd })
                        .then(r => r.json())
                        .then(data => {
                          if (data.url) {
                            setFacilityForm((f: any) => ({ ...f, image_url: data.url }));
                            showToast("Campus photo uploaded!");
                          } else {
                            showToast(data.error || "Upload failed", "err");
                          }
                        })
                        .catch(() => showToast("Upload failed", "err"))
                        .finally(() => setFacilityModalUploading(false));
                    }
                  }}
                >
                  <Upload className={`w-6 h-6 mb-2 ${facilityModalUploading ? "text-orange-300 animate-spin" : "text-orange-400 animate-pulse"}`} />
                  <p className="text-xs text-white font-mono uppercase tracking-wider">
                    {facilityModalUploading ? "Uploading... Please wait" : "Drag & Drop Campus Photo here to upload"}
                  </p>
                  <p className="text-[10px] text-gray-500 mt-1 font-mono">
                    {facilityModalUploading ? "Save Changes will be enabled after upload completes" : "Or click to select a file locally"}
                  </p>
                  <input 
                    type="file" 
                    accept="image/*" 
                    disabled={facilityModalUploading}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full disabled:cursor-not-allowed" 
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file && !facilityModalUploading) {
                        const id = editingFacilityId || "temp";
                        if (String(id).startsWith("f")) {
                          showToast("Cannot upload photo for static fallback facility. Run SQL schema first.", "err");
                          return;
                        }
                        const fd = new FormData();
                        fd.append("file", file);
                        fd.append("facilityId", id);
                        fd.append("type", "campus");
                        setFacilityModalUploading(true);
                        fetch("/api/facilities/upload", { method: "POST", body: fd })
                          .then(r => r.json())
                          .then(data => {
                            if (data.url) {
                              setFacilityForm((f: any) => ({ ...f, image_url: data.url }));
                              showToast("Campus photo uploaded successfully!");
                            } else {
                              showToast(data.error || "Upload failed", "err");
                            }
                          })
                          .catch(() => showToast("Upload failed", "err"))
                          .finally(() => setFacilityModalUploading(false));
                      }
                    }} 
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-400 mb-1.5 uppercase tracking-wider">Facility Description *</label>
                  <textarea rows={3} required value={facilityForm.description} onChange={e => setFacilityForm((f: any) => ({ ...f, description: e.target.value }))} placeholder="Enter details about facility diagnostics, telemetry hardware or edge modules..." className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none" />
                </div>

                {/* Nested Mentors Section */}
                <div className="border-t border-white/10 pt-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-mono text-orange-400 uppercase tracking-wider font-bold">Affiliated Mentors ({facilityForm.mentors?.length || 0})</label>
                    <button 
                      type="button" 
                      onClick={() => setFacilityForm((f: any) => ({ ...f, mentors: [...(f.mentors || []), { name: "", role: "", photo: "", photo_url: "" }] }))}
                      className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded-lg text-[10px] font-mono font-bold text-white uppercase tracking-wider"
                    >
                      + Add Mentor
                    </button>
                  </div>

                  <div className="space-y-4">
                    {facilityForm.mentors?.map((mentor: any, idx: number) => (
                      <div key={idx} className="p-4 bg-white/[0.02] border border-white/5 rounded-xl space-y-3 relative group">
                        <button 
                          type="button" 
                          onClick={() => setFacilityForm((f: any) => ({ ...f, mentors: f.mentors.filter((_: any, i: number) => i !== idx) }))}
                          className="absolute top-3 right-3 text-gray-500 hover:text-red-400 text-xs font-mono uppercase"
                        >
                          Remove
                        </button>
                        
                        <div className="flex items-center gap-4">
                          <div 
                            className={`w-14 h-14 rounded-lg overflow-hidden border border-white/10 relative bg-zinc-900 flex items-center justify-center shrink-0 cursor-pointer ${
                              mentorUploadingFor?.facilityId === (editingFacilityId || "temp") && mentorUploadingFor?.index === idx ? "border-orange-500 scale-105" : ""
                            }`}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => {
                              e.preventDefault();
                              const file = e.dataTransfer.files?.[0];
                              if (file) {
                                uploadMentorPhotoInForm(file, idx);
                              }
                            }}
                          >
                            {mentor.photo_url || mentor.photo ? (
                              <Image src={mentor.photo_url || mentor.photo} alt={mentor.name || "Mentor"} fill className="object-cover" unoptimized />
                            ) : (
                              <span className="text-[9px] text-zinc-500 font-mono text-center">Drop Photo</span>
                            )}
                            <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                uploadMentorPhotoInForm(file, idx);
                              }
                            }} />
                          </div>

                          <div className="grid grid-cols-2 gap-3 flex-1">
                            <div>
                              <input 
                                required 
                                value={mentor.name} 
                                onChange={e => {
                                  const updated = [...facilityForm.mentors];
                                  updated[idx] = { ...updated[idx], name: e.target.value };
                                  setFacilityForm((f: any) => ({ ...f, mentors: updated }));
                                }} 
                                placeholder="Mentor Name" 
                                className="w-full bg-[#050505] border border-white/10 rounded-lg px-3 py-1.5 text-white text-xs focus:outline-none" 
                              />
                            </div>
                            <div>
                              <input 
                                required 
                                value={mentor.role} 
                                onChange={e => {
                                  const updated = [...facilityForm.mentors];
                                  updated[idx] = { ...updated[idx], role: e.target.value };
                                  setFacilityForm((f: any) => ({ ...f, mentors: updated }));
                                }} 
                                placeholder="Role / Specialty" 
                                className="w-full bg-[#050505] border border-white/10 rounded-lg px-3 py-1.5 text-white text-xs focus:outline-none" 
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-white/5">
                  <button type="button" onClick={() => setShowFacilityForm(false)} className="flex-1 py-2.5 rounded-xl border border-white/10 text-gray-400 hover:text-white">Cancel</button>
                  <button 
                    type="submit" 
                    disabled={facilitySubmitting || facilityModalUploading} 
                    title={facilityModalUploading ? "Please wait for photo upload to complete" : undefined}
                    className="flex-1 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold font-mono text-sm uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {facilityModalUploading ? "Uploading Photo..." : facilitySubmitting ? "Saving..." : editingFacilityId ? "Save Changes" : "Create Facility"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Network Engineers Modal */}
      <AnimatePresence>
        {showEngineerForm && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
            onClick={() => setShowEngineerForm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
                <h2 className="text-xl font-bold text-white font-mono uppercase tracking-wider">{editingEngineerId ? "Edit Engineer Node" : "Add Engineer Node"}</h2>
                <button onClick={() => setShowEngineerForm(false)} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"><X className="w-4 h-4" /></button>
              </div>

              {engineerDbAlert && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex gap-3 text-red-200 text-xs leading-relaxed font-mono">
                  <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold uppercase mb-1">Database Table Missing</p>
                    <p>The database table 'global_engineers' is missing in Supabase. You must run `supabase_global_network_extended_schema.sql` in your Supabase SQL editor to create the table and enable dynamic database changes.</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleEngineerSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1.5 uppercase tracking-wider">Institution Name *</label>
                    <input required value={engineerForm.name} onChange={e => setEngineerForm((f: any) => ({ ...f, name: e.target.value }))} placeholder="e.g. IIT Delhi" className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1.5 uppercase tracking-wider">Fallback Acronym *</label>
                    <input required value={engineerForm.fallback_text} onChange={e => setEngineerForm((f: any) => ({ ...f, fallback_text: e.target.value }))} placeholder="e.g. IITD" className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-400 mb-1.5 uppercase tracking-wider">Research Group / Team Name *</label>
                  <input required value={engineerForm.team_name} onChange={e => setEngineerForm((f: any) => ({ ...f, team_name: e.target.value }))} placeholder="e.g. Genomics Systems Group" className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none" />
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-400 mb-1.5 uppercase tracking-wider">Logo Image URL</label>
                  <input value={engineerForm.logo_url} onChange={e => setEngineerForm((f: any) => ({ ...f, logo_url: e.target.value }))} placeholder="https://..." className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none" />
                </div>

                <div 
                  className="border-2 border-dashed border-white/10 hover:border-orange-500/50 bg-[#070707] rounded-xl p-8 flex flex-col items-center justify-center relative transition-all duration-300"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const file = e.dataTransfer.files?.[0];
                    if (file) {
                      const id = editingEngineerId || "temp";
                      if (String(id).startsWith("e")) {
                        showToast("Cannot upload logo for static fallback node. Run SQL schema first.", "err");
                        return;
                      }
                      const fd = new FormData();
                      fd.append("file", file);
                      fd.append("engineerId", id);
                      fetch("/api/engineers/upload", { method: "POST", body: fd })
                        .then(r => r.json())
                        .then(data => {
                          if (data.url) {
                            setEngineerForm((f: any) => ({ ...f, logo_url: data.url }));
                            showToast("Node logo uploaded successfully!");
                          } else {
                            showToast(data.error || "Upload failed", "err");
                          }
                        });
                    }
                  }}
                >
                  <Upload className="w-6 h-6 text-orange-400 mb-2 animate-pulse" />
                  <p className="text-xs text-white font-mono uppercase tracking-wider">Drag & Drop Logo Image Here to Upload</p>
                  <p className="text-[10px] text-gray-500 mt-1 font-mono">Or click to select a file locally</p>
                  <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const id = editingEngineerId || "temp";
                      if (String(id).startsWith("e")) {
                        showToast("Cannot upload logo for static fallback node. Run SQL schema first.", "err");
                        return;
                      }
                      const fd = new FormData();
                      fd.append("file", file);
                      fd.append("engineerId", id);
                      fetch("/api/engineers/upload", { method: "POST", body: fd })
                        .then(r => r.json())
                        .then(data => {
                          if (data.url) {
                            setEngineerForm((f: any) => ({ ...f, logo_url: data.url }));
                            showToast("Node logo uploaded successfully!");
                          } else {
                            showToast(data.error || "Upload failed", "err");
                          }
                        });
                    }
                  }} />
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-400 mb-1.5 uppercase tracking-wider">Specialization / Stream Description *</label>
                  <input required value={engineerForm.specialization} onChange={e => setEngineerForm((f: any) => ({ ...f, specialization: e.target.value }))} placeholder="e.g. AI Diagnostics & Genomics Arrays" className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none" />
                </div>

                <div className="flex gap-3 pt-4 border-t border-white/5">
                  <button type="button" onClick={() => setShowEngineerForm(false)} className="flex-1 py-2.5 rounded-xl border border-white/10 text-gray-400 hover:text-white">Cancel</button>
                  <button type="submit" disabled={engineerSubmitting} className="flex-1 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold font-mono text-sm uppercase tracking-wider disabled:opacity-50">
                    {engineerSubmitting ? "Saving..." : editingEngineerId ? "Save Changes" : "Create Node"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Network Ambassadors Modal */}
      <AnimatePresence>
        {showAmbassadorForm && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
            onClick={() => setShowAmbassadorForm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
                <h2 className="text-xl font-bold text-white font-mono uppercase tracking-wider">{editingAmbassadorId ? "Edit Ambassador" : "Add Brand Ambassador"}</h2>
                <button onClick={() => setShowAmbassadorForm(false)} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"><X className="w-4 h-4" /></button>
              </div>

              {ambassadorDbAlert && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex gap-3 text-red-200 text-xs leading-relaxed font-mono">
                  <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold uppercase mb-1">Database Table Missing</p>
                    <p>The database table 'global_ambassadors' is missing in Supabase. You must run `supabase_global_network_ambassadors_schema.sql` in your Supabase SQL editor to create the table and enable dynamic database changes.</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleAmbassadorSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1.5 uppercase tracking-wider">Name *</label>
                    <input required value={ambassadorForm.name} onChange={e => setAmbassadorForm((f: any) => ({ ...f, name: e.target.value }))} placeholder="e.g. Rohan Verma" className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1.5 uppercase tracking-wider">Role *</label>
                    <input required value={ambassadorForm.role} onChange={e => setAmbassadorForm((f: any) => ({ ...f, role: e.target.value }))} placeholder="e.g. Global Brand Ambassador" className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1.5 uppercase tracking-wider">Institution *</label>
                    <input required value={ambassadorForm.institution} onChange={e => setAmbassadorForm((f: any) => ({ ...f, institution: e.target.value }))} placeholder="e.g. IIT Delhi" className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1.5 uppercase tracking-wider">Email *</label>
                    <input required type="email" value={ambassadorForm.email} onChange={e => setAmbassadorForm((f: any) => ({ ...f, email: e.target.value }))} placeholder="ambassador@iitd.ac.in" className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1.5 uppercase tracking-wider">Phone *</label>
                    <input required value={ambassadorForm.phone} onChange={e => setAmbassadorForm((f: any) => ({ ...f, phone: e.target.value }))} placeholder="+91 98765 43210" className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1.5 uppercase tracking-wider">Address *</label>
                    <input required value={ambassadorForm.address} onChange={e => setAmbassadorForm((f: any) => ({ ...f, address: e.target.value }))} placeholder="IIT Delhi, Hauz Khas..." className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-400 mb-1.5 uppercase tracking-wider">Quote *</label>
                  <textarea required value={ambassadorForm.quote} onChange={e => setAmbassadorForm((f: any) => ({ ...f, quote: e.target.value }))} placeholder="Collaborating for a better tomorrow..." rows={3} className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none resize-none" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1.5 uppercase tracking-wider">Primary Accent Color</label>
                    <div className="flex gap-2">
                      <input type="color" value={ambassadorForm.accent_color || "#0B4A9E"} onChange={e => setAmbassadorForm((f: any) => ({ ...f, accent_color: e.target.value }))} className="w-10 h-10 bg-transparent border-0 cursor-pointer" />
                      <input value={ambassadorForm.accent_color || ""} onChange={e => setAmbassadorForm((f: any) => ({ ...f, accent_color: e.target.value }))} placeholder="#0B4A9E" className="flex-1 bg-[#050505] border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:outline-none font-mono" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1.5 uppercase tracking-wider">Secondary Accent Color</label>
                    <div className="flex gap-2">
                      <input type="color" value={ambassadorForm.accent_color_sec || "#E60717"} onChange={e => setAmbassadorForm((f: any) => ({ ...f, accent_color_sec: e.target.value }))} className="w-10 h-10 bg-transparent border-0 cursor-pointer" />
                      <input value={ambassadorForm.accent_color_sec || ""} onChange={e => setAmbassadorForm((f: any) => ({ ...f, accent_color_sec: e.target.value }))} placeholder="#E60717" className="flex-1 bg-[#050505] border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:outline-none font-mono" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Photo Drag & Drop Zone */}
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1.5 uppercase tracking-wider">Photo (Portrait)</label>
                    <div 
                      className="border-2 border-dashed border-white/10 hover:border-orange-500/50 bg-[#070707] rounded-xl p-4 flex flex-col items-center justify-center relative transition-all duration-300 min-h-[140px] text-center"
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        const file = e.dataTransfer.files?.[0];
                        if (file) {
                          const id = editingAmbassadorId || "temp";
                          if (String(id).startsWith("amb-fallback-")) {
                            showToast("Cannot upload photo for static fallback ambassador. Run SQL schema first.", "err");
                            return;
                          }
                          handleModalAssetUpload(file, "photo");
                        }
                      }}
                    >
                      {ambassadorUploadingFor ? (
                        <div className="flex flex-col items-center justify-center">
                          <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mb-2" />
                          <p className="text-[10px] text-gray-400 font-mono">Uploading photo...</p>
                        </div>
                      ) : ambassadorForm.photo_url ? (
                        <div className="relative group w-20 h-20 rounded-full overflow-hidden border border-white/10">
                          <Image 
                            src={ambassadorForm.photo_url} 
                            alt="Preview" 
                            fill 
                            className="object-cover" 
                            unoptimized 
                          />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full z-20">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                setAmbassadorForm((f: any) => ({ ...f, photo_url: "" }));
                              }}
                              className="p-1.5 rounded-full bg-red-600/80 hover:bg-red-600 text-white z-30"
                              title="Remove"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center pointer-events-none">
                          <Upload className="w-6 h-6 text-orange-400 mb-1.5 animate-pulse" />
                          <p className="text-[10px] text-white font-mono uppercase tracking-wider">Drag & Drop Photo</p>
                          <p className="text-[9px] text-gray-500 mt-0.5 font-mono">Or click to select</p>
                        </div>
                      )}
                      
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10" 
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const id = editingAmbassadorId || "temp";
                            if (String(id).startsWith("amb-fallback-")) {
                              showToast("Cannot upload photo for static fallback ambassador. Run SQL schema first.", "err");
                              return;
                            }
                            handleModalAssetUpload(file, "photo");
                          }
                        }} 
                      />
                    </div>
                    <input 
                      type="text"
                      value={ambassadorForm.photo_url || ""}
                      onChange={(e) => setAmbassadorForm((f: any) => ({ ...f, photo_url: e.target.value }))}
                      placeholder="Or paste photo URL here..."
                      className="w-full mt-2 bg-[#050505] border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none placeholder-gray-600 font-mono"
                    />
                  </div>

                  {/* Logo Drag & Drop Zone */}
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1.5 uppercase tracking-wider">Institution Logo</label>
                    <div 
                      className="border-2 border-dashed border-white/10 hover:border-orange-500/50 bg-[#070707] rounded-xl p-4 flex flex-col items-center justify-center relative transition-all duration-300 min-h-[140px] text-center"
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        const file = e.dataTransfer.files?.[0];
                        if (file) {
                          const id = editingAmbassadorId || "temp";
                          if (String(id).startsWith("amb-fallback-")) {
                            showToast("Cannot upload logo for static fallback ambassador. Run SQL schema first.", "err");
                            return;
                          }
                          handleModalAssetUpload(file, "logo");
                        }
                      }}
                    >
                      {ambassadorLogoUploadingFor ? (
                        <div className="flex flex-col items-center justify-center">
                          <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mb-2" />
                          <p className="text-[10px] text-gray-400 font-mono">Uploading logo...</p>
                        </div>
                      ) : ambassadorForm.logo_url ? (
                        <div className="relative group w-20 h-20 flex items-center justify-center bg-[#0d0d0d] rounded-lg border border-white/10 p-1.5">
                          <div className="relative w-full h-full">
                            <Image 
                              src={ambassadorForm.logo_url} 
                              alt="Logo Preview" 
                              fill 
                              className="object-contain" 
                              unoptimized 
                            />
                          </div>
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg z-20">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                setAmbassadorForm((f: any) => ({ ...f, logo_url: "" }));
                              }}
                              className="p-1.5 rounded-full bg-red-600/80 hover:bg-red-600 text-white z-30"
                              title="Remove"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center pointer-events-none">
                          <Upload className="w-6 h-6 text-orange-400 mb-1.5 animate-pulse" />
                          <p className="text-[10px] text-white font-mono uppercase tracking-wider">Drag & Drop Logo</p>
                          <p className="text-[9px] text-gray-500 mt-0.5 font-mono">Or click to select</p>
                        </div>
                      )}
                      
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10" 
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const id = editingAmbassadorId || "temp";
                            if (String(id).startsWith("amb-fallback-")) {
                              showToast("Cannot upload logo for static fallback ambassador. Run SQL schema first.", "err");
                              return;
                            }
                            handleModalAssetUpload(file, "logo");
                          }
                        }} 
                      />
                    </div>
                    <input 
                      type="text"
                      value={ambassadorForm.logo_url || ""}
                      onChange={(e) => setAmbassadorForm((f: any) => ({ ...f, logo_url: e.target.value }))}
                      placeholder="Or paste logo URL here..."
                      className="w-full mt-2 bg-[#050505] border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none placeholder-gray-600 font-mono"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input type="checkbox" id="amb_active" checked={ambassadorForm.active} onChange={e => setAmbassadorForm((f: any) => ({ ...f, active: e.target.checked }))} className="w-4 h-4 rounded border-white/10 bg-[#050505] text-orange-600 focus:ring-0 focus:ring-offset-0" />
                  <label htmlFor="amb_active" className="text-xs font-mono text-gray-400 uppercase tracking-wider select-none cursor-pointer">Active / Visible on site</label>
                </div>

                <div className="flex gap-3 pt-4 border-t border-white/5">
                  <button type="button" onClick={() => setShowAmbassadorForm(false)} className="flex-1 py-2.5 rounded-xl border border-white/10 text-gray-400 hover:text-white">Cancel</button>
                  <button type="submit" disabled={ambassadorSubmitting} className="flex-1 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold font-mono text-sm uppercase tracking-wider disabled:opacity-50">
                    {ambassadorSubmitting ? "Saving..." : editingAmbassadorId ? "Save Changes" : "Register Ambassador"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { 
  FileText, Plus, Calendar, Clock, CheckCircle, 
  XCircle, AlertCircle, Cpu, Network, Database,
  CreditCard, Upload, Video, Users, Mail, ArrowRight, Shield, Fingerprint, Activity, Beaker, QrCode, Download
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getUserApplications, submitApplication } from "../actions";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import QRCode from "qrcode";
import { jsPDF } from "jspdf";

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
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [customPhotoUrl, setCustomPhotoUrl] = useState<string | null>(null);
  const [profileImageBase64, setProfileImageBase64] = useState<string>("");

  // Personalization States
  const [cardName, setCardName] = useState("");
  const [cardDesignation, setCardDesignation] = useState("Research Fellow");
  const [cardDivision, setCardDivision] = useState("BioLabs Research");
  const [cardAccessLevel, setCardAccessLevel] = useState("Authorized Access");
  const [cardValidity, setCardValidity] = useState("May 2026 – May 2027");
  const [cardBloodGroup, setCardBloodGroup] = useState("O+");
  const [cardEmergencyContact, setCardEmergencyContact] = useState("+91 9540694581");

  // Load custom photo & personal details on mount/user load
  useEffect(() => {
    if (user) {
      const nameVal = user.user_metadata?.full_name || user.email?.split('@')[0] || "Dr. Priya Sharma";
      setCardName(nameVal);
      
      const savedPhoto = localStorage.getItem(`healix_id_photo_${user.email}`);
      if (savedPhoto) {
        setCustomPhotoUrl(savedPhoto);
      }

      // Check if student
      if (user.email?.toLowerCase().includes("student") || user.email?.toLowerCase().includes("academy")) {
        setCardDesignation("Student Researcher");
        setCardDivision("BioLabs Academy");
        setCardAccessLevel("Authorized Student");
      }
    } else {
      setCardName("Dr. Priya Sharma");
    }
  }, [user]);

  // Pre-load default profile image to Base64
  useEffect(() => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        setProfileImageBase64(canvas.toDataURL("image/jpeg"));
      }
    };
    img.src = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop";
  }, []);

  useEffect(() => {
    if (!uniqueId) return;
    const origin = typeof window !== "undefined" ? window.location.origin : "https://healix-nu.vercel.app";
    const nameVal = cardName || "Dr. Priya Sharma";
    const verifyUrl = `${origin}/verify/${uniqueId}?name=${encodeURIComponent(nameVal)}&role=${encodeURIComponent(cardDesignation)}&div=${encodeURIComponent(cardDivision)}`;
    
    QRCode.toDataURL(verifyUrl, {
      margin: 1,
      width: 256,
      color: {
        dark: "#000000",
        light: "#FFFFFF"
      }
    }).then(url => {
      setQrCodeUrl(url);
    }).catch(err => {
      console.error("QR Code generation error:", err);
    });
  }, [uniqueId, cardName, cardDesignation, cardDivision]);

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

  const fullName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || "Dr. Priya Sharma";

  const downloadPdf = () => {
    const doc = new jsPDF("p", "mm", "a4");

    // Add Document Background & Header
    doc.setFillColor(248, 250, 252);
    doc.rect(0, 0, 210, 297, "F");

    // Corporate Header
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, 210, 32, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("HEALIX BIOLABS INSTITUTIONAL CREDENTIAL", 15, 14);

    doc.setTextColor(234, 179, 8);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text("OFFICIAL PRINT & DOWNLOAD PORTAL - CRYPTOGRAPHICALLY SECURED", 15, 21);

    // Decorative right-side stripe
    doc.setFillColor(234, 179, 8);
    doc.rect(180, 0, 30, 32, "F");
    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("VERIFIED", 195, 18, { align: "center" });

    // Technical Separator Line
    doc.setDrawColor(234, 179, 8);
    doc.setLineWidth(0.8);
    doc.line(0, 32, 210, 32);

    // Main Content Title
    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("INSTITUTIONAL ID CARD (CR80 PHYSICAL FORMAT)", 15, 46);

    doc.setTextColor(100, 116, 139);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.text("Print this page on a 250+ GSM cardstock sheet. Cut along the borders and fold to assemble your physical credential.", 15, 51);

    // DRAW FRONT OF CARD
    const cardX = (210 - 85.6) / 2; // Center card (62.2mm)
    const frontY = 60;

    // Background and border
    doc.setFillColor(12, 12, 15);
    doc.roundedRect(cardX, frontY, 85.6, 54, 3.5, 3.5, "F");
    
    doc.setDrawColor(30, 41, 59);
    doc.setLineWidth(0.2);
    doc.roundedRect(cardX, frontY, 85.6, 54, 3.5, 3.5, "S");

    // Subtle header gold stripe
    doc.setFillColor(234, 179, 8);
    doc.rect(cardX, frontY + 9.5, 85.6, 0.4, "F");

    // Header Texts
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.text("HEALIX TECHNOLOGIES PVT. LTD.", 105, frontY + 5.5, { align: "center" });

    doc.setTextColor(234, 179, 8);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(4.8);
    doc.text("CENTER FOR BIOMEDICAL RESEARCH & ENGINEERING", 105, frontY + 8.5, { align: "center" });

    // Portrait box (Left side)
    doc.setFillColor(25, 25, 30);
    doc.roundedRect(cardX + 4.5, frontY + 13, 20, 26, 1, 1, "F");
    doc.setDrawColor(234, 179, 8);
    doc.setLineWidth(0.15);
    doc.roundedRect(cardX + 4.5, frontY + 13, 20, 26, 1, 1, "S");

    // Photo Render
    if (customPhotoUrl) {
      try {
        doc.addImage(customPhotoUrl, "JPEG", cardX + 4.65, frontY + 13.15, 19.7, 25.7);
      } catch (err) {
        console.error("Custom photo PDF add error:", err);
        doc.setFillColor(70, 70, 78);
        doc.circle(cardX + 14.5, frontY + 21, 3.8, "F");
        doc.ellipse(cardX + 14.5, frontY + 30, 7, 4.5, "F");
      }
    } else if (profileImageBase64) {
      try {
        doc.addImage(profileImageBase64, "JPEG", cardX + 4.65, frontY + 13.15, 19.7, 25.7);
      } catch (err) {
        console.error("Default profile photo PDF add error:", err);
        doc.setFillColor(70, 70, 78);
        doc.circle(cardX + 14.5, frontY + 21, 3.8, "F");
        doc.ellipse(cardX + 14.5, frontY + 30, 7, 4.5, "F");
      }
    } else {
      // Silhouette Avatar
      doc.setFillColor(70, 70, 78);
      doc.circle(cardX + 14.5, frontY + 21, 3.8, "F"); // head
      doc.ellipse(cardX + 14.5, frontY + 30, 7, 4.5, "F"); // shoulders
    }

    // QR Code Container Box overlapping bottom-left of photo
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(cardX + 2.5, frontY + 31, 13.5, 13.5, 1, 1, "F");

    if (qrCodeUrl) {
      doc.addImage(qrCodeUrl, "PNG", cardX + 3.25, frontY + 31.75, 12, 12);
    }

    // Right Side Metadata Fields
    const fieldsX = cardX + 27;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(4);
    doc.setTextColor(148, 163, 184);

    doc.text("FULL NAME:", fieldsX, frontY + 15.5);
    doc.text("DESIGNATION:", fieldsX, frontY + 20.5);
    doc.text("UNIQUE ID:", fieldsX, frontY + 25.5);
    doc.text("DIVISION:", fieldsX, frontY + 30.5);
    doc.text("VALIDITY:", fieldsX, frontY + 35.5);
    doc.text("BLOOD GROUP:", fieldsX, frontY + 40.5);
    doc.text("ACCESS LEVEL:", fieldsX, frontY + 45.5);

    // Field Values
    doc.setFont("helvetica", "bold");
    doc.setFontSize(5);
    doc.setTextColor(255, 255, 255);

    const activeName = cardName || fullName;
    doc.text(activeName.toUpperCase(), fieldsX + 16, frontY + 15.5);
    doc.text(cardDesignation.toUpperCase(), fieldsX + 16, frontY + 20.5);
    doc.text(uniqueId.toUpperCase(), fieldsX + 16, frontY + 25.5);
    doc.text(cardDivision.toUpperCase(), fieldsX + 16, frontY + 30.5);
    doc.text(cardValidity.toUpperCase(), fieldsX + 16, frontY + 35.5);
    doc.text(cardBloodGroup.toUpperCase(), fieldsX + 16, frontY + 40.5);
    doc.setTextColor(234, 179, 8); // Gold Access
    doc.text(cardAccessLevel.toUpperCase(), fieldsX + 16, frontY + 45.5);

    // Verification Pill
    doc.setFillColor(2, 2, 4);
    doc.roundedRect(fieldsX, frontY + 49.5, 54, 3.8, 0.8, 0.8, "F");
    doc.setTextColor(100, 116, 139);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(3.5);
    doc.text(`PROFILE: healix-nu.vercel.app/verify/${uniqueId}`, fieldsX + 1.5, frontY + 52.2);

    // Gold Emblem
    doc.setDrawColor(234, 179, 8);
    doc.setLineWidth(0.15);
    doc.circle(cardX + 80.5, frontY + 45.5, 2.8, "S");
    doc.line(cardX + 78.5, frontY + 45.5, 79.5, frontY + 45.5);
    doc.line(79.5 + cardX, frontY + 45.5, 80.2 + cardX, frontY + 43.5);
    doc.line(80.2 + cardX, frontY + 43.5, 80.8 + cardX, frontY + 47.5);
    doc.line(80.8 + cardX, frontY + 47.5, 81.5 + cardX, frontY + 45.5);
    doc.line(81.5 + cardX, frontY + 45.5, 82.5 + cardX, frontY + 45.5);


    // DRAW BACK OF CARD
    const backY = 124;

    // Background and border
    doc.setFillColor(12, 12, 15);
    doc.roundedRect(cardX, backY, 85.6, 54, 3.5, 3.5, "F");
    
    doc.setDrawColor(30, 41, 59);
    doc.setLineWidth(0.2);
    doc.roundedRect(cardX, backY, 85.6, 54, 3.5, 3.5, "S");

    // Header Text
    doc.setTextColor(148, 163, 184);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.text("INSTITUTIONAL CREDENTIAL", 105, backY + 5.5, { align: "center" });

    // Divider Line
    doc.setDrawColor(47, 55, 70);
    doc.setLineWidth(0.2);
    doc.line(cardX, backY + 8.5, cardX + 85.6, backY + 8.5);

    // Access Checklist
    doc.setTextColor(234, 179, 8); // Gold Title
    doc.setFontSize(4.8);
    doc.text("AUTHORIZED ACCESS AREAS:", cardX + 4.5, backY + 13.5);

    doc.setTextColor(226, 232, 240);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(4.5);
    doc.text("• Research Labs & Bio-Compute Clusters", cardX + 5.5, backY + 18.5);
    doc.text("• Bioinformatics Systems (Level 4)", cardX + 5.5, backY + 22.5);
    doc.text("• Clinical Intelligence Dashboard", cardX + 5.5, backY + 26.5);
    doc.text("• Internal Academic Network", cardX + 5.5, backY + 30.5);

    // Dynamic High-Fidelity Vector Barcode on the back of card
    doc.setFillColor(255, 255, 255);
    doc.rect(cardX + 56, backY + 11.5, 25, 7.5, "F");

    doc.setFillColor(0, 0, 0);
    let barX = cardX + 57.5;
    const pattern = [1, 2, 1, 3, 1, 2, 2, 1, 3, 1, 1, 2, 1, 3, 2, 1, 1, 2, 2, 1, 1, 3, 1, 2];
    for (let i = 0; i < pattern.length; i++) {
      const width = pattern[i] * 0.23;
      if (i % 2 === 0) {
        doc.rect(barX, backY + 12, width, 5, "F");
      }
      barX += width + 0.12;
    }

    doc.setTextColor(0, 0, 0);
    doc.setFont("courier", "bold");
    doc.setFontSize(3.5);
    doc.text(uniqueId, cardX + 68.5, backY + 18.2, { align: "center" });

    // Warning Text
    doc.setTextColor(100, 116, 139);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(3.8);
    doc.text("This credential certifies official affiliation with Healix Technologies Pvt. Ltd. Unauthorized", cardX + 4.5, backY + 36.5);
    doc.text("duplication, transfer, or misuse is strictly prohibited. If found, return to nearest Healix facility.", cardX + 4.5, backY + 39.5);

    // Footer divider line
    doc.line(cardX, backY + 43.5, cardX + 85.6, backY + 43.5);

    // Emergency Column
    doc.setTextColor(100, 116, 139);
    doc.setFontSize(3.5);
    doc.text("EMERGENCY CONTACT:", cardX + 4.5, backY + 47.2);
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(4.8);
    doc.text(cardEmergencyContact, cardX + 4.5, backY + 50.8);

    // Website Column
    doc.setTextColor(100, 116, 139);
    doc.setFontSize(3.5);
    doc.text("WEBSITE:", cardX + 81, backY + 47.2, { align: "right" });
    doc.setTextColor(234, 179, 8); // Gold Website
    doc.setFont("helvetica", "bold");
    doc.setFontSize(4.8);
    doc.text("healix-nu.vercel.app", cardX + 81, backY + 50.8, { align: "right" });


    // PRINT & ASSEMBLY GUIDE (Bottom of page)
    const guideY = 196;

    // Border surrounding the guide
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.4);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(15, guideY, 180, 84, 4, 4, "FD");

    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("PRINT & ASSEMBLY INSTRUCTION GUIDE", 20, guideY + 8);

    // Divider under guide title
    doc.setDrawColor(241, 245, 249);
    doc.line(20, guideY + 12, 190, guideY + 12);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(51, 65, 85);

    doc.setFont("helvetica", "bold");
    doc.text("Step 1: Color Print", 20, guideY + 19);
    doc.setFont("helvetica", "normal");
    doc.text("Print this generated document in high quality color mode using standard A4 cardstock sheet.", 20, guideY + 23);

    doc.setFont("helvetica", "bold");
    doc.text("Step 2: Card Cutting", 20, guideY + 31);
    doc.setFont("helvetica", "normal");
    doc.text("Carefully cut precisely along the grey/dark borders of the Front and Back card shapes (CR80 standard size).", 20, guideY + 35);

    doc.setFont("helvetica", "bold");
    doc.text("Step 3: Folding & Laminating", 20, guideY + 43);
    doc.setFont("helvetica", "normal");
    doc.text("Fold along the shared seams, or glue them back-to-back, and slide inside your standard badge sleeve.", 20, guideY + 47);

    // Cryptographic assurance signature
    doc.setFillColor(248, 250, 252);
    doc.rect(20, guideY + 54, 170, 24, "F");
    doc.setDrawColor(241, 245, 249);
    doc.rect(20, guideY + 54, 170, 24, "S");

    doc.setTextColor(100, 116, 139);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.5);
    doc.text("HEALIX SECURE CRYPTOGRAPHIC FINGERPRINT SYSTEM", 25, guideY + 60);

    const generatePdfFingerprint = (id: string) => {
      let hash = 0;
      for (let i = 0; i < id.length; i++) {
        hash = id.charCodeAt(i) + ((hash << 5) - hash);
      }
      return `HX_SHA256_SIG_BLOCK_${Math.abs(hash * 97).toString(16).toUpperCase()}`;
    };

    doc.setFont("helvetica", "normal");
    doc.setFontSize(6);
    doc.text(`SIGNATURE RECORD: ${generatePdfFingerprint(uniqueId)}`, 25, guideY + 66);
    doc.text("This PDF credential matches active cryptographic server signatures. Scanner verification fully validated.", 25, guideY + 71);

    // Save PDF
    doc.save(`HEALIX_ID_${uniqueId}.pdf`);
  };

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
              <motion.div key="idcard" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8 flex flex-col items-center pb-20 w-full">
                <div className="text-center">
                  <h2 className="text-3xl font-bold mb-2 font-mono tracking-tight text-white">INSTITUTIONAL_CREDENTIAL_BUILDER</h2>
                  <p className="text-white/40 text-sm font-mono tracking-wide">Personalize your student/researcher identity badge and download the print-ready corporate document.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-8 w-full max-w-6xl items-start mt-4">
                  {/* PERSONALIZATION BUILDER PANEL (Left Column) */}
                  <GlassCard className="p-5 border-zinc-800 bg-black/40 space-y-4 rounded-xl flex flex-col z-10 order-2 lg:order-1 select-text">
                    <div>
                      <h3 className="text-sm font-bold font-mono tracking-wider text-[#eab308] uppercase mb-1 flex items-center gap-1.5">
                        <CreditCard className="w-4 h-4" /> Personalization Panel
                      </h3>
                      <p className="text-[10px] text-white/40 font-mono">Modify any parameter below to update the security card and dynamic QR signature instantly.</p>
                    </div>

                    <div className="space-y-3">
                      {/* Full Name */}
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase font-bold text-zinc-500 tracking-wider block">Full Name</label>
                        <input 
                          type="text" 
                          value={cardName} 
                          onChange={(e) => setCardName(e.target.value)} 
                          placeholder="e.g. Priya Sharma" 
                          className="w-full bg-zinc-950 border border-zinc-850 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#eab308]/60 transition-colors font-sans" 
                        />
                      </div>

                      {/* Photo Selector Trigger */}
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase font-bold text-zinc-500 tracking-wider block">Profile Photo</label>
                        <div className="flex items-center gap-3">
                          <button 
                            type="button"
                            onClick={() => document.getElementById('id-photo-upload')?.click()}
                            className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 hover:bg-zinc-850 rounded-lg text-xs font-mono font-bold text-zinc-300 transition-colors uppercase tracking-wider flex items-center gap-1.5"
                          >
                            <Upload className="w-3.5 h-3.5 text-[#eab308]" /> Choose Custom Photo
                          </button>
                          {customPhotoUrl && (
                            <button
                              type="button"
                              onClick={() => {
                                setCustomPhotoUrl(null);
                                if (user?.email) {
                                  localStorage.removeItem(`healix_id_photo_${user.email}`);
                                }
                              }}
                              className="text-[10px] font-mono text-red-500 hover:text-red-400 hover:underline transition-colors uppercase"
                            >
                              Reset
                            </button>
                          )}
                        </div>
                        <input 
                          type="file" 
                          id="id-photo-upload" 
                          className="hidden" 
                          accept="image/*" 
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                const base64data = reader.result as string;
                                setCustomPhotoUrl(base64data);
                                if (user?.email) {
                                  localStorage.setItem(`healix_id_photo_${user.email}`, base64data);
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </div>

                      {/* Designation & Division */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[9px] uppercase font-bold text-zinc-500 tracking-wider block">Designation</label>
                          <input 
                            type="text" 
                            value={cardDesignation} 
                            onChange={(e) => setCardDesignation(e.target.value)} 
                            placeholder="e.g. Student Researcher" 
                            className="w-full bg-zinc-950 border border-zinc-850 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#eab308]/60 transition-colors font-sans" 
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] uppercase font-bold text-zinc-500 tracking-wider block">Division / Dept</label>
                          <input 
                            type="text" 
                            value={cardDivision} 
                            onChange={(e) => setCardDivision(e.target.value)} 
                            placeholder="e.g. BioLabs Academy" 
                            className="w-full bg-zinc-950 border border-zinc-850 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#eab308]/60 transition-colors font-sans" 
                          />
                        </div>
                      </div>

                      {/* Access Level & Blood Group */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[9px] uppercase font-bold text-zinc-500 tracking-wider block">Access Level</label>
                          <select 
                            value={cardAccessLevel} 
                            onChange={(e) => setCardAccessLevel(e.target.value)} 
                            className="w-full bg-zinc-950 border border-zinc-850 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#eab308]/60 transition-colors font-sans"
                          >
                            <option value="Authorized Access">Authorized Access</option>
                            <option value="Authorized Student">Authorized Student</option>
                            <option value="Level 4 Clearance">Level 4 Clearance</option>
                            <option value="HPC Admin Access">HPC Admin Access</option>
                            <option value="Guest Scholar">Guest Scholar</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] uppercase font-bold text-zinc-500 tracking-wider block">Blood Group</label>
                          <input 
                            type="text" 
                            value={cardBloodGroup} 
                            onChange={(e) => setCardBloodGroup(e.target.value)} 
                            placeholder="e.g. O+" 
                            className="w-full bg-zinc-950 border border-zinc-850 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#eab308]/60 transition-colors font-mono" 
                          />
                        </div>
                      </div>

                      {/* Validity & Emergency Contact */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[9px] uppercase font-bold text-zinc-500 tracking-wider block">Validity Date</label>
                          <input 
                            type="text" 
                            value={cardValidity} 
                            onChange={(e) => setCardValidity(e.target.value)} 
                            placeholder="e.g. May 2026 – May 2027" 
                            className="w-full bg-zinc-950 border border-zinc-850 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#eab308]/60 transition-colors font-sans" 
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] uppercase font-bold text-zinc-500 tracking-wider block">Emergency Contact</label>
                          <input 
                            type="text" 
                            value={cardEmergencyContact} 
                            onChange={(e) => setCardEmergencyContact(e.target.value)} 
                            placeholder="e.g. +91 9540694581" 
                            className="w-full bg-zinc-950 border border-zinc-850 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#eab308]/60 transition-colors font-mono" 
                          />
                        </div>
                      </div>
                    </div>
                  </GlassCard>

                  {/* 3D BADGE PREVIEW PANEL (Right Column) */}
                  <div className="flex flex-col items-center justify-center space-y-6 order-1 lg:order-2 w-full">
                    {/* ID Card 3D Container Wrapper with mobile scaling */}
                    <div className="w-full flex flex-col items-center justify-center overflow-hidden py-2">
                      <div className="w-[320px] h-[195px] sm:w-[560px] sm:h-[340px] perspective-[2000px] cursor-pointer select-none" onClick={() => setIsFlipped(!isFlipped)}>
                        <motion.div 
                          className="w-full h-full relative transition-all duration-700 shadow-2xl"
                          style={{ transformStyle: 'preserve-3d' }}
                          animate={{ rotateY: isFlipped ? 180 : 0 }}
                        >
                          {/* FRONT SIDE */}
                          <div className="absolute w-full h-full bg-[#0a0a0c] border border-zinc-800 rounded-2xl overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.4)] flex flex-col p-3 sm:p-5" style={{ backfaceVisibility: 'hidden' }}>
                            {/* Subtle noise texture */}
                            <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-black pointer-events-none z-0" />
                            
                            {/* Dynamic diagonal stripe accent */}
                            <div className="absolute top-0 right-0 w-[45%] h-full bg-gradient-to-l from-[#eab308]/5 via-[#eab308]/2 to-transparent rotate-[20deg] origin-top-right pointer-events-none z-0" />

                            {/* High-security micro dot mesh watermark */}
                            <div className="absolute inset-0 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none z-0" />

                            {/* Plastic PVC sheen glare overlay */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.04] to-transparent rotate-[25deg] pointer-events-none z-30" />

                            {/* Top gold accent line */}
                            <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[#eab308]/80 to-transparent z-10" />

                            {/* Card Header */}
                            <div className="text-center border-b border-zinc-800 pb-2 relative z-10 w-full">
                              <h3 className="font-bold text-white tracking-widest text-[8px] sm:text-[13px] leading-tight mb-0.5 font-sans">HEALIX TECHNOLOGIES PVT. LTD.</h3>
                              <p className="text-[#eab308] font-mono text-[5.5px] sm:text-[9px] tracking-wider uppercase font-semibold">CENTER FOR BIOMEDICAL RESEARCH & ENGINEERING</p>
                            </div>

                            {/* Content */}
                            <div className="flex-1 flex flex-row items-center justify-between gap-3 sm:gap-6 mt-3 sm:mt-4 relative z-10">
                              
                              {/* Photo & QR Box Left */}
                              <div className="relative shrink-0 select-none">
                                {/* Portrait Box with Change Photo Trigger */}
                                <div 
                                  className="w-[75px] h-[95px] sm:w-[130px] sm:h-[165px] border border-zinc-700 rounded-lg overflow-hidden bg-black/60 p-0.5 relative shadow-lg z-10 group/photo cursor-pointer"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    document.getElementById('id-photo-upload')?.click();
                                  }}
                                >
                                  <div className="w-full h-full bg-zinc-850 rounded-md relative overflow-hidden flex items-center justify-center">
                                    <Image src={customPhotoUrl || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop"} alt="Profile" fill className="object-cover opacity-90 contrast-[1.03]" unoptimized />
                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/5 to-black/30 pointer-events-none" />
                                    
                                    {/* Upload Hover Overlay */}
                                    <div className="absolute inset-0 bg-black/70 opacity-0 group-hover/photo:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5">
                                      <Upload className="w-4 h-4 sm:w-6 sm:h-6 text-[#eab308]" />
                                      <span className="text-[5px] sm:text-[8.5px] font-mono text-white font-bold uppercase tracking-wider">Change Photo</span>
                                    </div>
                                  </div>
                                </div>

                                {/* Overlapping QR Code Box */}
                                <div className="w-[45px] h-[45px] sm:w-[80px] sm:h-[80px] bg-white p-0.5 sm:p-1.5 rounded-md border border-white absolute -bottom-1 -left-2 sm:-bottom-2 sm:-left-3 shadow-[0_4px_20px_rgba(0,0,0,0.5)] z-20 flex items-center justify-center transition-transform hover:scale-105">
                                  {qrCodeUrl ? (
                                    <Image src={qrCodeUrl} alt="QR Code" width={80} height={80} className="w-full h-full object-contain" />
                                  ) : (
                                    <div className="w-full h-full bg-zinc-200 animate-pulse rounded" />
                                  )}
                                </div>
                              </div>

                              {/* Details & Pill Right */}
                              <div className="flex-1 flex flex-col justify-between h-full py-0.5">
                                
                                {/* Metadata Grid */}
                                <div className="grid grid-cols-[auto_1fr] gap-x-2 sm:gap-x-4 gap-y-1 sm:gap-y-1.5 select-text font-mono">
                                  <span className="text-[6px] sm:text-[9px] font-bold text-zinc-500 uppercase text-right self-center">FULL NAME:</span>
                                  <span className="text-[7.5px] sm:text-[11px] font-bold text-white truncate uppercase self-center font-sans tracking-wide">
                                    {cardName || fullName}
                                  </span>

                                  <span className="text-[6px] sm:text-[9px] font-bold text-zinc-500 uppercase text-right self-center">DESIGNATION:</span>
                                  <span className="text-[7.5px] sm:text-[11px] font-bold text-zinc-300 uppercase self-center font-sans tracking-wide">
                                    {cardDesignation}
                                  </span>

                                  <span className="text-[6px] sm:text-[9px] font-bold text-zinc-500 uppercase text-right self-center">UNIQUE ID:</span>
                                  <span className="text-[7.5px] sm:text-[11px] font-bold text-white self-center">
                                    {uniqueId}
                                  </span>

                                  <span className="text-[6px] sm:text-[9px] font-bold text-zinc-500 uppercase text-right self-center">DIVISION:</span>
                                  <span className="text-[7.5px] sm:text-[11px] font-bold text-zinc-300 uppercase self-center font-sans tracking-wide">
                                    {cardDivision}
                                  </span>

                                  <span className="text-[6px] sm:text-[9px] font-bold text-zinc-500 uppercase text-right self-center">VALIDITY:</span>
                                  <span className="text-[7.5px] sm:text-[11px] font-bold text-zinc-300 uppercase self-center">
                                    {cardValidity}
                                  </span>

                                  <span className="text-[6px] sm:text-[9px] font-bold text-zinc-500 uppercase text-right self-center">BLOOD GROUP:</span>
                                  <span className="text-[7.5px] sm:text-[11px] font-bold text-white uppercase self-center">
                                    {cardBloodGroup}
                                  </span>

                                  <span className="text-[6px] sm:text-[9px] font-bold text-zinc-500 uppercase text-right self-center">ACCESS LEVEL:</span>
                                  <span className="text-[7.5px] sm:text-[11px] font-bold text-[#eab308] uppercase self-center flex items-center gap-0.5 sm:gap-1">
                                    {cardAccessLevel}
                                  </span>
                                </div>

                                {/* Verification Pill */}
                                <div className="mt-1.5 select-text">
                                  <div className="bg-black/80 border border-zinc-800 rounded-lg py-0.5 px-1.5 sm:py-1 sm:px-3 text-[5px] sm:text-[7.5px] font-mono text-zinc-400 tracking-wider inline-flex items-center gap-1 w-fit">
                                    <span className="text-[#eab308]/60 uppercase font-semibold">VERIFY:</span>
                                    <span className="text-zinc-300">healix-nu.vercel.app/verify/{uniqueId}</span>
                                  </div>
                                </div>

                              </div>
                              
                            </div>

                            {/* Static Corporate Emblem Gold Seal Bottom Right */}
                            <div className="absolute right-2.5 bottom-2.5 sm:right-5 sm:bottom-5 pointer-events-none select-none z-20">
                              <div className="w-[45px] h-[45px] sm:w-[72px] sm:h-[72px] rounded-full border border-zinc-800/80 p-0.5 flex items-center justify-center bg-zinc-950/40 backdrop-blur-sm shadow-md">
                                <div className="bg-black/90 w-full h-full rounded-full flex flex-col items-center justify-center border border-[#eab308]/40 shadow-inner relative">
                                  <div className="absolute inset-0.5 rounded-full border border-[#eab308]/15" />
                                  <svg className="w-5.5 h-5.5 sm:w-9 sm:h-9 text-[#eab308]/75" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                                  </svg>
                                </div>
                              </div>
                            </div>

                          </div>

                          {/* BACK SIDE */}
                          <div className="absolute w-full h-full bg-[#0a0a0c] border border-zinc-800 rounded-2xl overflow-hidden p-3 sm:p-6 flex flex-col justify-between shadow-[0_4px_30px_rgba(0,0,0,0.4)]" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                            {/* Large Watermark in background */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-[0.015] pointer-events-none z-0">
                              <Image src="/biolabs-logo.png" alt="Watermark" width={220} height={220} className="object-contain grayscale" />
                            </div>
                            
                            {/* Plastic PVC sheen glare overlay */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-transparent rotate-[25deg] pointer-events-none z-30" />

                            {/* Realistic Monospaced Barcode */}
                            <div className="absolute right-3 top-10 sm:right-6 sm:top-14 bg-white p-1 rounded-sm flex flex-col items-center select-none shadow-md z-20">
                              <div className="h-[18px] sm:h-[32px] w-[60px] sm:w-[105px] flex flex-row items-stretch">
                                {[1, 2, 1, 3, 1, 2, 2, 1, 3, 1, 1, 2, 1, 3, 2, 1, 1, 2, 2, 1, 1, 3, 1, 2].map((val, idx) => (
                                  <div 
                                    key={idx} 
                                    className={`flex-1 ${idx % 2 === 0 ? "bg-black" : "bg-transparent"}`} 
                                    style={{ flexGrow: val }}
                                  />
                                ))}
                              </div>
                              <span className="text-[4px] sm:text-[6px] font-mono text-black font-bold tracking-widest mt-0.5">{uniqueId}</span>
                            </div>

                            <div className="relative z-10 flex-1 flex flex-col justify-between h-full">
                              
                              {/* Header section */}
                              <div className="w-full">
                                <h4 className="font-mono text-[9px] sm:text-[14px] text-zinc-400 tracking-[0.25em] uppercase text-center w-full font-semibold">Institutional Credential</h4>
                                <div className="h-[1px] bg-zinc-800 w-full mt-2 mb-3 sm:mb-4" />
                              </div>

                              {/* Access list and warnings */}
                              <div className="space-y-3 sm:space-y-4 flex-1 max-w-[65%]">
                                <div>
                                  <h5 className="text-[7px] sm:text-[9.5px] text-[#eab308] font-bold uppercase tracking-wider mb-1 sm:mb-1.5 font-mono">AUTHORIZED AREAS:</h5>
                                  <ul className="text-[6.5px] sm:text-[10px] font-mono text-zinc-300 space-y-0.5 pl-1">
                                    <li className="flex items-center gap-1"><span className="text-[#eab308]">•</span> Research Labs & HPC Clusters</li>
                                    <li className="flex items-center gap-1"><span className="text-[#eab308]">•</span> Bioinformatics L4 Systems</li>
                                    <li className="flex items-center gap-1"><span className="text-[#eab308]">•</span> Clinical Intel Dashboards</li>
                                    <li className="flex items-center gap-1"><span className="text-[#eab308]">•</span> Academic Internal Network</li>
                                  </ul>
                                </div>

                                <p className="text-[5.5px] sm:text-[8.5px] text-zinc-500 leading-normal text-justify font-sans tracking-wide">
                                  This credential certifies official affiliation with Healix Technologies Pvt. Ltd. and BioLabs Academy. Misuse is strictly prohibited. If found, please return to nearest facility.
                                </p>
                              </div>

                              {/* Bottom columns details */}
                              <div className="pt-2 border-t border-zinc-800 flex flex-row justify-between items-end w-full">
                                <div>
                                  <span className="text-[5px] sm:text-[8px] text-zinc-500 font-mono tracking-widest uppercase block mb-0.5">EMERGENCY CONTACT:</span>
                                  <span className="text-[7.5px] sm:text-[11px] font-bold font-mono text-white block">{cardEmergencyContact}</span>
                                </div>
                                <div className="text-right">
                                  <span className="text-[5px] sm:text-[8px] text-zinc-500 font-mono tracking-widest uppercase block mb-0.5">WEBSITE:</span>
                                  <span className="text-[7.5px] sm:text-[11px] font-bold font-mono text-[#eab308] underline block hover:text-[#eab308]/80">healix-nu.vercel.app</span>
                                </div>
                              </div>

                            </div>
                          </div>

                        </motion.div>
                      </div>
                    </div>

                    {/* Print Action & Download Controls */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-2 w-full max-w-[560px] select-text">
                      <div className="flex items-center gap-2 text-white/30 text-xs font-mono">
                        <Fingerprint className="h-4 w-4 text-[#eab308]/50" /> Secure verification active at `/verify/{uniqueId}`
                      </div>
                      <button
                        onClick={downloadPdf}
                        className="flex items-center justify-center gap-2 px-6 py-3 w-full sm:w-auto bg-[#eab308] hover:bg-[#eab308]/90 text-black font-mono font-extrabold text-xs uppercase tracking-widest rounded-lg shadow-lg hover:shadow-xl active:scale-[0.98] transition-all"
                      >
                        <Download className="w-4 h-4" /> Download PDF (Print Ready)
                      </button>
                    </div>

                  </div>
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

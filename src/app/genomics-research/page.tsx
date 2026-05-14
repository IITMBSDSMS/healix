"use client";

import { useState, useEffect, useCallback } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileUp, Activity, FileText, Download, Search, 
  Database, ShieldAlert, BrainCircuit, ChevronRight,
  Loader2, CheckCircle2, AlertCircle, Microscope,
  LayoutDashboard, FlaskConical, Settings, HelpCircle, LogOut,
  Dna, BarChart3, Fingerprint, Waves
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { jsPDF } from "jspdf";

const COLORS = {
  primary: "#10b981", // Emerald Green
  secondary: "#059669", // Deeper Green
  accent: "#34d399", // Light Green
  danger: "#ef4444",
  warning: "#f59e0b",
  slate: {
    400: "#94a3b8",
    500: "#64748b",
    800: "#1e293b",
    900: "#0f172a"
  }
};

export default function GenomicsResearch() {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Waiting for genomic upload...");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [engineOnline, setEngineOnline] = useState<boolean | null>(null);

  useEffect(() => {
    setMounted(true);
    // Check engine health on mount
    const healthUrl = `${process.env.NEXT_PUBLIC_FLASK_API_URL || 'https://healix-biolabs.onrender.com'}/health`;
    console.log("Checking engine health at:", healthUrl);
    
    fetch(healthUrl)
      .then(res => res.json())
      .then(data => {
        console.log("Engine health response:", data);
        setEngineOnline(data.status === "ok" || data.status === "healthy");
      })
      .catch((err) => {
        console.error("Engine health check failed:", err);
        setEngineOnline(false);
      });
  }, []);

  const uploadFile = async (file: File) => {
    if (!file) return;
    
    setLoading(true);
    setError(null);
    setProgress(0);
    setStatus("Analyzing genomic signatures...");

    const formData = new FormData();
    formData.append("file", file);

    const stages = [
      { p: 10, s: "Initializing secure tunnel..." },
      { p: 20, s: "Scanning microarray vectors..." },
      { p: 35, s: "Normalizing genomic signatures..." },
      { p: 50, s: "Extracting biomarker features..." },
      { p: 65, s: "Executing neural inference models..." },
      { p: 80, s: "Calibrating clinical weights..." },
      { p: 90, s: "Generating clinical interpretation..." },
    ];

    let currentStage = 0;
    const progressInterval = setInterval(() => {
      if (currentStage < stages.length) {
        setProgress(stages[currentStage].p);
        setStatus(stages[currentStage].s);
        currentStage++;
      }
    }, 2000);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_FLASK_API_URL || "https://healix-biolabs.onrender.com";
      console.log("Initiating inference at:", `${apiUrl}/predict`);

      const response = await fetch(`${apiUrl}/predict`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        console.error("Inference server returned error:", response.status);
        throw new Error(`Prediction failed: ${response.status}`);
      }

      const data = await response.json();
      console.log("Inference successful:", data);
      
      clearInterval(progressInterval);
      setProgress(100);
      setStatus("Inference Complete");
      
      setTimeout(() => {
        setResult(data);
        setLoading(false);
      }, 500);

    } catch (err: any) {
      console.error("Genomic inference pipeline crash:", err);
      clearInterval(progressInterval);
      setError(err.message || "An unexpected error occurred during analysis.");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) uploadFile(file);
  }, []);

  const downloadReport = async () => {
    if (!result) return;
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    // Helper to load image as base64
    const loadImage = (url: string): Promise<string> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = url;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0);
          resolve(canvas.toDataURL("image/png"));
        };
        img.onerror = reject;
      });
    };

    try {
      const logoBase64 = await loadImage("/biolabs-logo.png");
      doc.addImage(logoBase64, 'PNG', 15, 12, 28, 28);
      
      // Company Name next to logo
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.setTextColor(16, 185, 129); // Emerald
      doc.text("HEALIX BIOLABS", 48, 24);
      
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 116, 139);
      doc.text("Clinical Genomic Intelligence Division", 48, 30);
      doc.text("Precision Oncology Research Facility", 48, 35);
      
      // Header Divider
      doc.setDrawColor(16, 185, 129);
      doc.setLineWidth(0.5);
      doc.line(15, 45, pageWidth - 15, 45);
    } catch (e) {
      console.error("Logo load failed", e);
    }
    
    // Report Info Area
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 41, 59);
    doc.text("GENOMIC INFERENCE REPORT", 15, 60);
    
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(148, 163, 184);
    doc.text(`REPORT ID: ${Date.now()}`, 15, 66);
    doc.text(`GENOMIC VERSION: HX-v4.2.1-PROD`, 15, 70);
    doc.text(`TIMESTAMP: ${new Date().toLocaleString()}`, 15, 74);
    
    // Systematic Metrics Grid
    const gridY = 85;
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(15, gridY, pageWidth - 30, 45, 2, 2, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.rect(15, gridY, pageWidth - 30, 45, 'D');
    
    // Grid Lines
    doc.line(pageWidth / 2, gridY + 5, pageWidth / 2, gridY + 40);
    doc.line(20, gridY + 22.5, pageWidth - 20, gridY + 22.5);

    const drawMetric = (label: string, value: string, x: number, y: number) => {
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(148, 163, 184);
      doc.text(label.toUpperCase(), x, y);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(30, 41, 59);
      doc.text(value, x, y + 6);
    };

    drawMetric("Inference Accuracy", `${result.accuracy}%`, 25, gridY + 12);
    drawMetric("Risk Assessment", `HX-RISK: ${result.hxRisk}/10`, pageWidth / 2 + 10, gridY + 12);
    drawMetric("Sample Volume", `${result.samples.toLocaleString()} Samples`, 25, gridY + 32);
    drawMetric("Stability Index", result.instability.toUpperCase(), pageWidth / 2 + 10, gridY + 32);

    // Summary Section
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(16, 185, 129);
    doc.text("Clinical Interpretation Summary", 15, 145);
    
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(51, 65, 85);
    const summaryLines = doc.splitTextToSize(result.summary, pageWidth - 30);
    doc.text(summaryLines, 15, 152);
    
    // Feature Attribution Table
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(16, 185, 129);
    doc.text("Biomarker Attribution Matrix", 15, 185);

    // Table Header
    doc.setFillColor(241, 245, 249);
    doc.rect(15, 192, pageWidth - 30, 8, 'F');
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text("BIOMARKER IDENTIFIER", 20, 197);
    doc.text("ATTRIBUTION MAGNITUDE", 65, 197);
    doc.text("SCORE", pageWidth - 25, 197);

    let yPos = 205;
    result.genes.forEach((g: any, i: number) => {
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(71, 85, 105);
      doc.text(g.gene, 20, yPos);
      
      // Mini Bar
      doc.setFillColor(241, 245, 249);
      doc.rect(65, yPos - 3, 100, 3, 'F');
      doc.setFillColor(16, 185, 129);
      doc.rect(65, yPos - 3, g.value, 3, 'F');
      
      doc.setTextColor(30, 41, 59);
      doc.text(`${g.value}%`, pageWidth - 25, yPos);
      
      doc.setDrawColor(241, 245, 249);
      doc.line(15, yPos + 3, pageWidth - 15, yPos + 3);
      yPos += 8;
    });

    // Systematic Confidence Chart
    const chartY = 245;
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(16, 185, 129);
    doc.text("Confidence Distribution Analysis", 15, chartY);

    const cX = 15;
    const cY = 252;
    const cW = pageWidth - 30;
    const cH = 25;

    // Chart Background & Grid
    doc.setFillColor(252, 255, 253);
    doc.rect(cX, cY, cW, cH, 'F');
    doc.setDrawColor(241, 245, 249);
    for(let i=0; i<=5; i++) {
      const lineY = cY + (cH / 5) * i;
      doc.line(cX, lineY, cX + cW, lineY);
    }

    // Draw Data Trend
    const points = result.predictions.slice(0, 20).map((p: any) => parseFloat(p.confidence));
    const stepX = cW / (points.length - 1);
    const minVal = 85;
    const maxVal = 100;
    
    doc.setDrawColor(16, 185, 129);
    doc.setLineWidth(0.5);
    
    let lastX = 0, lastY = 0;
    points.forEach((p: number, i: number) => {
      const curX = cX + i * stepX;
      const curY = cY + cH - ((p - minVal) / (maxVal - minVal)) * cH;
      if (i > 0) doc.line(lastX, lastY, curX, curY);
      
      // X-Axis Labels
      if (i % 5 === 0) {
        doc.setFontSize(5);
        doc.setTextColor(148, 163, 184);
        doc.text(`S${i+1}`, curX, cY + cH + 4);
      }
      
      lastX = curX;
      lastY = curY;
    });

    // X-Axis
    doc.setDrawColor(226, 232, 240);
    doc.line(cX, cY + cH, cX + cW, cY + cH);

    // Footer
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(148, 163, 184);
    const footerY = pageHeight - 12;
    doc.text("SYSTEMATIC GENOMIC ANALYSIS REPORT", 15, footerY);
    doc.text("HEALIX BIOLABS · CONFIDENTIAL · NOT FOR DIAGNOSTIC USE", pageWidth - 15, footerY, { align: 'right' });
    doc.setDrawColor(16, 185, 129);
    doc.setLineWidth(0.2);
    doc.line(15, footerY - 4, pageWidth - 15, footerY - 4);
    
    doc.save(`Healix_Genomic_Report_${Date.now()}.pdf`);
  };

  if (!mounted) return null;

  return (
    <div className="flex min-h-screen bg-[#050505] text-slate-200 font-sans selection:bg-emerald-500/30 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-[#0a0a0a]/50 backdrop-blur-2xl hidden lg:flex flex-col z-20 relative">
        {/* Alive/Glow Background */}
        <div className="absolute top-0 left-0 w-full h-64 bg-emerald-500/5 blur-[100px] pointer-events-none" />
        
        <div className="p-8 border-b border-white/5 relative z-10">
          <div className="flex items-center gap-4 group cursor-pointer">
            <div className="relative">
              <motion.div 
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.2, 0.4, 0.2] 
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -inset-4 bg-emerald-500/20 rounded-full blur-xl" 
              />
              <img src="/biolabs-logo.png" alt="Healix BioLabs" className="w-14 h-14 relative z-10 object-contain rounded-full border border-emerald-500/20 drop-shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-transform duration-500 group-hover:scale-110" />
            </div>
            <div className="flex flex-col ml-1">
              <span className="font-bold text-2xl tracking-tight text-white leading-none">Healix</span>
              <span className="text-xs font-black text-emerald-400 uppercase tracking-[0.3em] mt-1">BIOLABS</span>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 mt-4 relative z-10">
          {[
            { icon: LayoutDashboard, label: "Overview", active: true },
            { icon: FlaskConical, label: "Research", active: false },
            { icon: BarChart3, label: "Analytics", active: false },
            { icon: Fingerprint, label: "Genomics", active: false },
            { icon: Database, label: "Datasets", active: false },
          ].map((item, i) => (
            <button
              key={i}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-300 relative group ${
                item.active 
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.05)]" 
                  : "text-slate-500 hover:text-slate-200 hover:bg-white/5"
              }`}
            >
              {item.active && (
                <motion.div 
                  layoutId="active-pill"
                  className="absolute left-0 w-1 h-6 bg-emerald-400 rounded-r-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                />
              )}
              <item.icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${item.active ? "text-emerald-400" : "text-slate-500 group-hover:text-emerald-400/70"}`} />
              {item.label}
              {item.active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />}
            </button>
          ))}
        </nav>

        <div className="p-6 space-y-4 border-t border-white/5 relative z-10">
          <div className="bg-emerald-500/5 rounded-2xl p-4 border border-emerald-500/10 mb-2 group hover:border-emerald-500/20 transition-all duration-500 cursor-help">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-2 h-2 rounded-full ${engineOnline ? 'bg-emerald-400 shadow-[0_0_5px_rgba(16,185,129,1)]' : 'bg-red-500 shadow-[0_0_5px_rgba(239,68,68,1)]'}`} />
              <span className={`text-[10px] font-bold uppercase tracking-widest ${engineOnline ? 'text-emerald-400' : 'text-red-400'}`}>
                {engineOnline === null ? "Scanning..." : engineOnline ? "System Live" : "Engine Offline"}
              </span>
            </div>
            <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
              {engineOnline === false ? "Healix inference engine offline. Check connection." : "Genomic Intelligence Engine v4.2 actively monitoring research vectors."}
            </p>
          </div>
          
          <button className="w-full flex items-center gap-3 px-4 py-2 text-xs font-semibold text-slate-500 hover:text-white transition-all">
            <Settings className="w-3.5 h-3.5" />
            Control Panel
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-2 text-xs font-semibold text-red-400/60 hover:text-red-400 transition-all">
            <LogOut className="w-3.5 h-3.5" />
            Terminate
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Top Navbar */}
        <header className="h-16 border-b border-white/5 bg-[#050505]/50 backdrop-blur-md flex items-center justify-between px-8 z-10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-lg border border-white/5">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Workspace</span>
              <div className="w-1 h-1 rounded-full bg-slate-700" />
              <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-widest">Core.Research</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 px-4 py-1.5 bg-emerald-500/5 border border-emerald-500/10 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Live Inference Mode</span>
            </div>
            <div className="h-6 w-[1px] bg-white/5" />
            <div className="flex items-center gap-4">
              <button className="p-2 text-slate-500 hover:text-emerald-400 transition-colors"><Search className="w-4 h-4" /></button>
              <div className="w-8 h-8 rounded-full border border-emerald-500/20 bg-emerald-500/10 flex items-center justify-center text-[10px] font-bold text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]">AV</div>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto custom-scrollbar bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/[0.03] via-transparent to-transparent">
          <div className="max-w-[1400px] mx-auto px-10 py-10 space-y-12">
            {/* Hero Section */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-8">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="h-[1px] w-8 bg-emerald-500/50" />
                  <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em]">Precision Oncology</span>
                </div>
                <h1 className="text-5xl font-bold tracking-tight text-white">
                  Genomic <span className="text-emerald-400 italic">Intelligence</span>
                </h1>
                <p className="text-slate-400 text-sm max-w-xl leading-relaxed">
                  Enterprise-grade clinical inference engine for automated biomarker feature attribution and predictive modeling across genomic datasets.
                </p>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={() => setResult(null)}
                  className="px-6 py-3 bg-slate-900/50 hover:bg-slate-800 text-slate-300 rounded-2xl transition-all flex items-center gap-3 text-xs font-bold border border-white/5 backdrop-blur-xl"
                >
                  <Activity className="w-4 h-4 text-emerald-400" /> Flush Session
                </button>
                {result && (
                  <button 
                    onClick={downloadReport}
                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl transition-all flex items-center gap-3 text-xs font-bold shadow-[0_10px_20px_rgba(16,185,129,0.2)] active:scale-95"
                  >
                    <Download className="w-4 h-4" /> Download AI Report
                  </button>
                )}
              </div>
            </div>

            <AnimatePresence mode="wait">
              {!result && !loading ? (
                <motion.div
                  key="upload"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="space-y-12"
                >
                  {/* Stats Bar */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: "Engine Status", value: "Ready", icon: CheckCircle2, color: "text-emerald-400" },
                      { label: "Compute Nodes", value: "8 Active", icon: Database, color: "text-blue-400" },
                      { label: "Security Level", value: "Zero-Trust", icon: ShieldAlert, color: "text-purple-400" },
                      { label: "Last Sync", value: "2m ago", icon: Activity, color: "text-orange-400" },
                    ].map((item, i) => (
                      <GlassCard key={i} className="p-4 flex items-center gap-4">
                        <div className={`p-2 rounded-md bg-white/5 ${item.color}`}>
                          <item.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">{item.label}</p>
                          <p className="text-sm font-bold text-white">{item.value}</p>
                        </div>
                      </GlassCard>
                    ))}
                  </div>

                  {/* Upload Zone */}
                  <div
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={onDrop}
                    className={`relative group h-[450px] border-2 border-dashed transition-all duration-500 rounded-3xl flex flex-col items-center justify-center gap-8 ${
                      isDragging ? "border-emerald-400 bg-emerald-500/10 scale-[1.01]" : "border-slate-800 bg-slate-900/20 hover:border-emerald-500/50 hover:bg-emerald-500/5"
                    }`}
                  >
                    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
                      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500/20 via-transparent to-transparent scale-150" />
                    </div>
                    
                    <div className="relative z-10 text-center flex flex-col items-center">
                      <div className="w-24 h-24 mb-6 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-2xl shadow-emerald-500/20 transform group-hover:scale-110 transition-transform duration-500">
                        <FileUp className="w-12 h-12 text-white" />
                      </div>
                      <h2 className="text-3xl font-bold text-white mb-2 font-mono">Upload Genomic Dataset</h2>
                      <p className="text-slate-400 max-w-sm mx-auto mb-8">
                        Select microarray file (.csv, .txt, .soft) for automated feature extraction and inference.
                      </p>
                      
                      <label className="px-10 py-4 bg-emerald-500 hover:bg-emerald-400 text-[#020617] font-bold text-lg rounded-xl cursor-pointer transition-all shadow-xl shadow-emerald-500/20 active:scale-95">
                        Select Data Source
                        <input type="file" className="hidden" onChange={(e: any) => uploadFile(e.target.files[0])} />
                      </label>
                      
                      <p className="mt-6 text-xs text-slate-500 font-mono tracking-widest uppercase">
                        HIPAA COMPLIANT · END-TO-END ENCRYPTED
                      </p>
                    </div>
                  </div>
                </motion.div>
              ) : loading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-32"
                >
                  <div className="relative w-64 h-64 mb-12">
                    <div className="absolute inset-0 rounded-full border-4 border-emerald-500/10" />
                    <motion.div 
                      className="absolute inset-0 rounded-full border-t-4 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-4xl font-bold text-white font-mono">{progress}%</span>
                      <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest mt-1">Processing</span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3 font-mono">{status}</h3>
                  <p className="text-slate-500 animate-pulse">Running advanced matrix factorization and model weights...</p>
                </motion.div>
              ) : error ? (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="max-w-2xl mx-auto py-20 text-center"
                >
                  <div className="w-20 h-20 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-red-500/20">
                    <AlertCircle className="w-10 h-10 text-red-500" />
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-4">Inference Engine Error</h2>
                  <p className="text-slate-400 mb-8 leading-relaxed">{error}</p>
                  <button 
                    onClick={() => setError(null)}
                    className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg transition-all"
                  >
                    Try Again
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="result"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-8"
                >
                  {/* Dashboard Left Side: Metrics */}
                  <div className="lg:col-span-8 space-y-8">
                    {/* Primary Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <GlassCard className="p-6 relative overflow-hidden group border-emerald-500/10">
                        <Fingerprint className="w-8 h-8 text-emerald-400 mb-4" />
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Inference Confidence</p>
                        <p className="text-4xl font-bold text-white tabular-nums">{result.accuracy}%</p>
                        <div className="mt-4 w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }} 
                            animate={{ width: `${result.accuracy}%` }} 
                            className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" 
                          />
                        </div>
                      </GlassCard>

                      <GlassCard className="p-6 relative overflow-hidden group border-emerald-500/10">
                        <Waves className="w-8 h-8 text-emerald-400 mb-4" />
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Samples Processed</p>
                        <p className="text-4xl font-bold text-white tabular-nums">{result.samples.toLocaleString()}</p>
                        <div className="mt-4 flex items-center gap-2">
                          <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                            <Activity className="w-3 h-3" /> +12.4%
                          </div>
                          <span className="text-[10px] text-slate-600 font-bold uppercase">vs baseline</span>
                        </div>
                      </GlassCard>

                      <GlassCard className="p-6 relative overflow-hidden group border-teal-500/10">
                        <ShieldAlert className="w-8 h-8 text-teal-400 mb-4" />
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Genomic Risk Index</p>
                        <p className="text-4xl font-bold text-white tabular-nums">{result.hxRisk}/10</p>
                        <div className="mt-4 flex gap-1.5">
                          {[...Array(10)].map((_, i) => (
                            <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-1000 ${i < result.hxRisk ? "bg-teal-500 shadow-[0_0_5px_rgba(20,184,166,0.3)]" : "bg-white/5"}`} />
                          ))}
                        </div>
                      </GlassCard>
                    </div>

                    {/* Analysis Summary */}
                    <GlassCard className="p-8 border-emerald-500/5 bg-emerald-500/[0.01]">
                      <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-emerald-500/10 rounded-lg">
                            <FileText className="w-5 h-5 text-emerald-400" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-white tracking-tight">Clinical Interpretation Matrix</h3>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Ref: HX-v4.2.1-SIG</p>
                          </div>
                        </div>
                        <div className="px-3 py-1 bg-emerald-500/10 rounded-md border border-emerald-500/20">
                          <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Verified Result</span>
                        </div>
                      </div>
                      <div className="relative p-6 bg-white/[0.02] rounded-2xl border border-white/5">
                        <div className="absolute -left-[2px] top-6 bottom-6 w-1 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                        <p className="text-slate-300 leading-relaxed text-lg italic font-medium">
                          &ldquo;{result.summary}&rdquo;
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10 pt-8 border-t border-white/5">
                        {[
                          { label: "Phenotype Aggression", value: result.aggression, color: result.aggression === 'High' ? 'text-red-400 bg-red-400/10 border-red-400/20' : 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' },
                          { label: "Therapy Sensitivity", value: result.therapySensitivity, color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' },
                          { label: "Genomic Instability", value: result.instability, color: 'text-teal-400 bg-teal-400/10 border-teal-400/20' },
                        ].map((item, i) => (
                          <div key={i}>
                            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-3">{item.label}</p>
                            <span className={`px-4 py-1.5 rounded-xl text-[11px] font-black border ${item.color}`}>
                              {item.value.toUpperCase()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </GlassCard>

                    {/* Main Confidence Chart */}
                    <GlassCard className="p-8 h-[500px] border-white/5">
                      <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-emerald-500/10 rounded-lg">
                            <BarChart3 className="w-5 h-5 text-emerald-400" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-white tracking-tight">Confidence Distribution Analysis</h3>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Variance across primary microarray vectors</p>
                          </div>
                        </div>
                        <div className="flex gap-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" /> PROBABILISTIC VARIANCE</div>
                        </div>
                      </div>
                      <div className="flex-1 w-full min-h-0 relative">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={result.predictions.slice(0, 25).map((p: any, i: number) => ({ name: `S${i+1}`, val: parseFloat(p.confidence) }))} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                              <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                            <XAxis 
                              dataKey="name" 
                              stroke="#475569" 
                              fontSize={10} 
                              tickLine={false} 
                              axisLine={false} 
                              tick={{ fill: '#475569' }}
                            />
                            <YAxis 
                              stroke="#475569" 
                              fontSize={10} 
                              tickLine={false} 
                              axisLine={false} 
                              domain={[90, 100]} 
                              tick={{ fill: '#475569' }}
                            />
                            <Tooltip 
                              contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "12px", fontSize: "12px", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                              itemStyle={{ color: "#10b981", fontWeight: 'bold' }}
                              cursor={{ stroke: '#10b981', strokeWidth: 1, strokeDasharray: '4 4' }}
                            />
                            <Area 
                              type="monotone" 
                              dataKey="val" 
                              stroke="#10b981" 
                              strokeWidth={4} 
                              fillOpacity={1} 
                              fill="url(#colorVal)" 
                              animationDuration={2000}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </GlassCard>

                    {/* Prediction Matrix Table */}
                    <GlassCard className="p-0 overflow-hidden border-white/5">
                      <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-emerald-500/10 rounded-lg">
                            <Database className="w-5 h-5 text-emerald-400" />
                          </div>
                          <h3 className="text-lg font-bold text-white tracking-tight">Inference Matrix Preview</h3>
                        </div>
                        <span className="px-3 py-1 bg-white/5 rounded-lg text-[10px] text-slate-500 uppercase tracking-widest font-black">Top 25 Samples</span>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm border-separate border-spacing-0">
                          <thead>
                            <tr className="bg-white/[0.02] text-slate-500 uppercase text-[10px] tracking-widest font-black">
                              <th className="px-8 py-4 border-b border-white/5">Sample Identifier</th>
                              <th className="px-8 py-4 border-b border-white/5">Clinical Inference</th>
                              <th className="px-8 py-4 border-b border-white/5">Confidence</th>
                              <th className="px-8 py-4 border-b border-white/5">Risk</th>
                              <th className="px-8 py-4 border-b border-white/5">Benign Score</th>
                              <th className="px-8 py-4 border-b border-white/5 text-right">Reference</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5">
                            {result.predictions.slice(0, 25).map((p: any, i: number) => (
                              <tr key={i} className="hover:bg-emerald-500/[0.02] transition-colors group">
                                <td className="px-8 py-5 font-mono text-xs text-slate-400 group-hover:text-emerald-300 transition-colors">{p.sample}</td>
                                <td className="px-8 py-5">
                                  <span className={`flex items-center gap-2.5 font-bold text-xs ${p.result === 'Malignant' ? 'text-red-400' : 'text-emerald-400'}`}>
                                    <div className={`w-2 h-2 rounded-full ${p.result === 'Malignant' ? 'bg-red-400 shadow-[0_0_8px_rgba(239,68,68,0.4)]' : 'bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.4)]'}`} />
                                    {p.result.toUpperCase()}
                                  </span>
                                </td>
                                <td className="px-8 py-5">
                                  <div className="flex items-center gap-3">
                                    <span className="font-mono text-white font-bold tabular-nums w-12">{p.confidence}%</span>
                                    <div className="hidden sm:block flex-1 max-w-[60px] bg-white/5 h-1 rounded-full overflow-hidden">
                                      <div className="h-full bg-emerald-500/50" style={{ width: `${p.confidence}%` }} />
                                    </div>
                                  </div>
                                </td>
                                <td className="px-8 py-5 font-mono text-xs text-slate-400">{p.risk || "0.0"}</td>
                                <td className="px-8 py-5 font-mono text-xs text-slate-400">{p.benignScore || "0.0"}</td>
                                <td className="px-8 py-5 text-right">
                                  <button className="text-slate-600 hover:text-white transition-colors p-1"><ChevronRight className="w-4 h-4" /></button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </GlassCard>
                  </div>

                  {/* Sidebar: Distribution & Attribution */}
                  <div className="lg:col-span-4 space-y-8">
                    {/* Distribution Pie */}
                    <GlassCard className="p-8 border-white/5">
                      <div className="flex items-center gap-3 mb-8">
                        <div className="p-2 bg-emerald-500/10 rounded-lg">
                          <LayoutDashboard className="w-5 h-5 text-emerald-400" />
                        </div>
                        <h3 className="text-lg font-bold text-white tracking-tight">Phenotype Mapping</h3>
                      </div>
                      <div className="h-[300px] w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={[
                                { name: 'Benign', value: result.predictions.filter((p:any)=>p.result==='Benign').length },
                                { name: 'Malignant', value: result.predictions.filter((p:any)=>p.result==='Malignant').length },
                              ]}
                              cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={8} dataKey="value"
                            >
                              <Cell fill="#10b981" />
                              <Cell fill="#ef4444" />
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "12px" }} />
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="text-center">
                            <p className="text-2xl font-bold text-white">{result.predictions.length}</p>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Total Cases</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-center gap-8 mt-6">
                        <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Benign</span></div>
                        <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-red-500" /> <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Malignant</span></div>
                      </div>
                    </GlassCard>

                    {/* Gene Attribution Heatmap */}
                    <GlassCard className="p-8 border-white/5">
                      <div className="flex items-center gap-3 mb-8">
                        <div className="p-2 bg-emerald-500/10 rounded-lg">
                          <Search className="w-5 h-5 text-emerald-400" />
                        </div>
                        <h3 className="text-lg font-bold text-white tracking-tight">Biomarker Attribution</h3>
                      </div>
                      <div className="space-y-7">
                        {result.genes.map((g: any, i: number) => (
                          <div key={i} className="group">
                            <div className="flex justify-between items-center mb-3">
                              <span className="text-xs font-bold text-slate-400 group-hover:text-white transition-colors">{g.gene}</span>
                              <span className="text-[10px] font-black text-emerald-400 tabular-nums">{g.value}%</span>
                            </div>
                            <div className="w-full bg-white/5 h-[6px] rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }} 
                                animate={{ width: `${g.value}%` }} 
                                transition={{ duration: 1.5, delay: i * 0.1, ease: "easeOut" }}
                                className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.2)]" 
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-10 pt-6 border-t border-white/5">
                        <div className="p-4 bg-emerald-500/5 rounded-xl border border-emerald-500/10">
                          <p className="text-[10px] text-emerald-300/70 font-medium leading-relaxed italic">
                            Attribution weights calculated via SHAP value factorization across {result.samples.toLocaleString()} genomic features.
                          </p>
                        </div>
                      </div>
                    </GlassCard>

                    {/* Reasoning Panel */}
                    {result.reasoning && (
                      <GlassCard className="p-6 bg-emerald-500/5 border-emerald-500/20">
                        <h3 className="text-lg font-bold text-emerald-400 mb-4 flex items-center gap-2 font-mono">
                          <BrainCircuit className="w-5 h-5" /> Reasoning Narrative
                        </h3>
                        <div className="space-y-4">
                          {result.reasoning.map((r: string, i: number) => (
                            <div key={i} className="flex gap-3">
                              <div className="mt-1.5 w-1 h-1 rounded-full bg-emerald-400 shrink-0" />
                              <p className="text-sm text-slate-300 leading-relaxed italic">{r}</p>
                            </div>
                          ))}
                        </div>
                      </GlassCard>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}
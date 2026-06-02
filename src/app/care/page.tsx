"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, ShieldCheck, Stethoscope, Beaker, Pill, 
  ChevronRight, CheckCircle2, Upload, FileText, Activity, 
  MapPin, Heart, AlertCircle, RefreshCw, Award, Info, Sparkles,
  Layers
} from "lucide-react";
import Image from "next/image";

// Molecule Database for Price Comparison
const molecules = [
  { id: 1, name: "Paracetamol 650mg", chemical: "Acetaminophen", brandedPrice: 45, avenixPrice: 9, category: "Fever & Pain", manufacturer: "Cipla Ltd", savings: "80%", desc: "Standard antipyretic and analgesic for fever relief." },
  { id: 2, name: "Amoxicillin 500mg", chemical: "Amoxicillin", brandedPrice: 180, avenixPrice: 36, category: "Antibiotics", manufacturer: "GSK Pharmaceuticals", savings: "80%", desc: "Broad-spectrum antibiotic matching active molecular composition." },
  { id: 3, name: "Atorvastatin 10mg", chemical: "Atorvastatin", brandedPrice: 150, avenixPrice: 30, category: "Heart Health", manufacturer: "Abbott India", savings: "80%", desc: "Statin lipid-regulating agent for long-term arterial safety." },
  { id: 4, name: "Pantoprazole 40mg", chemical: "Pantoprazole", brandedPrice: 120, avenixPrice: 24, category: "Acidity & Gas", manufacturer: "Zydus Cadila", savings: "80%", desc: "Proton pump inhibitor (PPI) targeting gastric acidity." },
  { id: 5, name: "Cetirizine 10mg", chemical: "Cetirizine", brandedPrice: 60, avenixPrice: 12, category: "Allergy Care", manufacturer: "Abbott India", savings: "80%", desc: "Non-drowsy 24-hour antihistamine for seasonal allergy relief." },
];

export default function AvenixCarePage() {
  // Prescription Scan Simulator state
  const [scanState, setScanState] = useState<"idle" | "scanning" | "completed">("idle");
  const [scannedItems, setScannedItems] = useState<any[]>([]);
  const [progress, setProgress] = useState(0);

  // Generic Calculator states
  const [selectedMolecule, setSelectedMolecule] = useState(molecules[0]);
  const [quantity, setQuantity] = useState(30);

  // Auto-rotating highlights state
  const [activeHighlightIndex, setActiveHighlightIndex] = useState(0);

  // Hover states for interactive SVG elements
  const [hoveredSvgId, setHoveredSvgId] = useState<number | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveHighlightIndex((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Simulate scanning action
  const handleSimulateScan = () => {
    setScanState("scanning");
    setProgress(0);
    setScannedItems([]);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setScanState("completed");
          setScannedItems([
            { name: "Amoxicillin 500mg", qty: 15, unitPrice: 2.4, total: 36, brandedTotal: 180 },
            { name: "Paracetamol 650mg", qty: 10, unitPrice: 0.9, total: 9, brandedTotal: 45 }
          ]);
          return 100;
        }
        return prev + 8;
      });
    }, 150);
  };

  const totalScannedAvenix = scannedItems.reduce((acc, item) => acc + item.total, 0);
  const totalScannedBranded = scannedItems.reduce((acc, item) => acc + item.brandedTotal, 0);
  const totalScannedSavings = totalScannedBranded - totalScannedAvenix;

  return (
    <div className="relative min-h-screen bg-zinc-950 text-white selection:bg-orange-500/30 overflow-x-hidden font-sans pb-24">
      {/* Background radial spotlights */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-orange-600/5 blur-[160px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-amber-600/5 blur-[160px]" />
        <div className="absolute top-1/2 right-10 w-[300px] h-[300px] rounded-full bg-emerald-500/5 blur-[120px]" />
      </div>

      {/* --- HERO SECTION --- */}
      <section className="relative z-10 pt-24 pb-16 border-b border-zinc-900 bg-gradient-to-b from-zinc-950 via-zinc-950 to-zinc-900">
        <div className="max-w-[94%] mx-auto px-6 grid lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/25 text-xs font-mono tracking-widest uppercase text-orange-400">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
              Avenix Pharmaceuticals
            </div>
            
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.05] font-mono uppercase bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
              India's Intelligent <br />
              <span className="text-orange-500">Online Pharmacy</span>
            </h1>
            
            <p className="text-zinc-400 text-sm sm:text-base max-w-xl leading-relaxed">
              Democratizing healthcare access with up to 80% savings on generic medicines. CDSCO-compliant operations powered by WHO-GMP partner warehouses and state-of-the-art AI prescription verification.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <a 
                href="#rx-scanner"
                className="h-12 px-6 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-orange-600/20"
              >
                Scan Prescription <ArrowRight className="w-4 h-4" />
              </a>
              <a 
                href="#savings-calculator" 
                className="h-12 px-6 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-2"
              >
                Compare Medicine Prices
              </a>
            </div>

            {/* Verification highlights bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-10 border-t border-zinc-900/80">
              <div>
                <p className="text-2xl font-bold font-mono text-orange-500">WHO-GMP</p>
                <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider mt-1">Partner Warehouses</p>
              </div>
              <div>
                <p className="text-2xl font-bold font-mono text-white">CDSCO</p>
                <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider mt-1">Compliant Logistics</p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="text-2xl font-bold font-mono text-emerald-500">Up to 80%</p>
                <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider mt-1">Generic Savings</p>
              </div>
            </div>
          </div>

          {/* Right Hero Feature Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.08)_0%,transparent_70%)] pointer-events-none" />
            
            <div className="relative border border-zinc-800 bg-zinc-950/80 backdrop-blur-xl p-6 rounded-2xl shadow-2xl overflow-hidden">
              <div className="absolute top-0 right-0 p-3 text-[10px] font-mono text-orange-500/40 uppercase tracking-widest">
                SYSTEM STATUS // ACTIVE
              </div>
              
              <h3 className="text-sm font-bold font-mono text-white uppercase tracking-wider border-b border-zinc-900 pb-3 mb-4">
                INTELLIGENT FULFILLMENT
              </h3>

              <div className="space-y-4">
                <div className="p-3.5 bg-zinc-900/60 border border-zinc-800 rounded-xl flex gap-3.5 items-start">
                  <div className="p-2 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-500 shrink-0">
                    <Pill className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-white">Genuine Medicine Guarantee</h4>
                    <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">WHO-GMP certification checks, sealed packages, and active digital signatures verify drug integrity.</p>
                  </div>
                </div>

                <div className="p-3.5 bg-zinc-900/60 border border-zinc-800 rounded-xl flex gap-3.5 items-start">
                  <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 shrink-0">
                    <Beaker className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-white">NABL Home Diagnostics</h4>
                    <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">Book comprehensive diagnostic packages with automated NABL-certified laboratory reports sync.</p>
                  </div>
                </div>

                <div className="p-3.5 bg-zinc-900/60 border border-zinc-800 rounded-xl flex gap-3.5 items-start">
                  <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-white">R.Ph Pharmacist Gateways</h4>
                    <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">Dual check verification. AI digitizes prescriptions, and registered pharmacists authorize and sign release.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- SECTION 2: INTERACTIVE AI RX SCANNER SIMULATOR --- */}
      <section id="rx-scanner" className="py-20 border-b border-zinc-900">
        <div className="max-w-[94%] mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-[10px] font-mono text-orange-500 uppercase tracking-widest font-bold">Smart Intake</span>
            <h2 className="text-2xl md:text-4xl font-bold font-mono tracking-tight uppercase mt-2">AI Prescription Scanner</h2>
            <div className="w-12 h-0.5 bg-orange-600 mx-auto mt-3" />
            <p className="text-zinc-400 text-xs sm:text-sm mt-3 uppercase tracking-wider font-mono">
              Upload prescription in one-click. Our AI matches chemical molecules to affordable generics.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-stretch max-w-5xl mx-auto">
            {/* Left Box: Upload Console */}
            <div className="lg:col-span-5 bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-orange-500/5 to-transparent pointer-events-none" />
              
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-orange-500" />
                  <span className="text-xs font-mono text-zinc-400 uppercase font-bold tracking-wider">RX Scanning Terminal</span>
                </div>
                
                <p className="text-xs text-zinc-400 leading-relaxed font-mono">
                  Press the simulation button to see how Avenix AI analyzes handwriting, extracts chemical compounds, matches them against certified generic manufacturers, and completes R.Ph licensing checks.
                </p>
              </div>

              <div className="my-8">
                {scanState === "idle" && (
                  <button 
                    onClick={handleSimulateScan}
                    className="w-full py-8 border-2 border-dashed border-zinc-800 hover:border-orange-500/50 bg-zinc-900/60 rounded-xl flex flex-col items-center justify-center transition-all duration-300 group cursor-pointer"
                  >
                    <Upload className="w-8 h-8 text-zinc-500 group-hover:text-orange-500 mb-2 transition-colors animate-pulse" />
                    <p className="text-xs text-zinc-300 font-mono font-bold uppercase tracking-wider">Simulate Scanning Rx</p>
                    <p className="text-[10px] text-zinc-500 mt-1 font-mono">Click to begin analysis demo</p>
                  </button>
                )}

                {scanState === "scanning" && (
                  <div className="p-6 bg-zinc-950/80 border border-zinc-800 rounded-xl relative overflow-hidden flex flex-col items-center justify-center min-h-[140px]">
                    {/* Simulated laser scan bar */}
                    <div className="absolute left-0 right-0 h-[2px] bg-orange-500 top-0 animate-[bounce_2s_infinite] shadow-lg shadow-orange-500/50" />
                    
                    <RefreshCw className="w-7 h-7 text-orange-500 animate-spin mb-3" />
                    <p className="text-xs font-mono text-zinc-300 uppercase font-bold tracking-wider">Digitizing Handwriting...</p>
                    <div className="w-full bg-zinc-900 h-1.5 rounded-full mt-3 overflow-hidden">
                      <div className="bg-orange-500 h-full transition-all duration-150" style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                )}

                {scanState === "completed" && (
                  <div className="p-5 bg-zinc-950 border border-emerald-500/20 rounded-xl text-center">
                    <ShieldCheck className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                    <h4 className="text-xs font-bold font-mono text-white uppercase tracking-wider">Scanned Successfully</h4>
                    <p className="text-[10px] text-zinc-400 font-mono mt-1">2 compounds matched & verified by R.Ph.</p>
                    
                    <button 
                      onClick={() => setScanState("idle")} 
                      className="mt-4 px-4 py-1.5 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white text-[10px] font-mono uppercase tracking-wider rounded-lg transition-colors"
                    >
                      Reset Scanner
                    </button>
                  </div>
                )}
              </div>

              <div className="text-[9px] font-mono text-zinc-500 flex items-center justify-between border-t border-zinc-900/60 pt-3">
                <span>Compliance: CDSCO Section 142</span>
                <span className="text-emerald-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" /> Secure SSL
                </span>
              </div>
            </div>

            {/* Right Box: Results Panel */}
            <div className="lg:col-span-7 bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
                  <span className="text-xs font-mono text-zinc-400 uppercase font-bold tracking-wider">AI Molecule Output</span>
                  <span className="text-[10px] font-mono bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded text-zinc-500 uppercase">Interactive Preview</span>
                </div>

                {scanState === "idle" && (
                  <div className="h-64 flex flex-col items-center justify-center text-center text-zinc-500 font-mono space-y-2">
                    <AlertCircle className="w-8 h-8 text-zinc-650" />
                    <p className="text-xs">No active scan detected.</p>
                    <p className="text-[10px] text-zinc-600 max-w-xs">Use the simulator on the left to scan a sample medical script.</p>
                  </div>
                )}

                {scanState === "scanning" && (
                  <div className="h-64 flex flex-col items-center justify-center font-mono text-zinc-400 text-xs space-y-3">
                    <p className="animate-pulse">Loading OCR neural models...</p>
                    <div className="text-left w-full max-w-sm bg-zinc-950 p-3 rounded-lg border border-zinc-900 text-[10px] space-y-1">
                      <p className="text-orange-500">// STDOUT OUTPUT LOGS</p>
                      <p className="text-zinc-600">Initializing Tesseract OCR API...</p>
                      <p className="text-zinc-550">Processing image matrix (1200x800)...</p>
                      <p className="text-zinc-500">Detecting handwritten segments...</p>
                    </div>
                  </div>
                )}

                {scanState === "completed" && (
                  <div className="space-y-4">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left font-mono text-xs">
                        <thead>
                          <tr className="border-b border-zinc-800 text-zinc-500 text-[10px] uppercase tracking-wider">
                            <th className="pb-2">Detected Molecule</th>
                            <th className="pb-2">Qty</th>
                            <th className="pb-2 text-right">Branded Est.</th>
                            <th className="pb-2 text-right">Avenix Price</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-900/60">
                          {scannedItems.map((item, idx) => (
                            <tr key={idx} className="text-zinc-300">
                              <td className="py-3">
                                <div className="font-bold text-white">{item.name}</div>
                                <div className="text-[10px] text-zinc-500">Generic Substitute Match</div>
                              </td>
                              <td className="py-3 font-semibold">{item.qty} tabs</td>
                              <td className="py-3 text-right text-zinc-500 line-through font-semibold">₹{item.brandedTotal}</td>
                              <td className="py-3 text-right text-emerald-500 font-bold">₹{item.total}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl flex items-center justify-between">
                      <div className="text-left">
                        <p className="text-[10px] font-mono text-emerald-500 uppercase tracking-wider font-bold">Estimated Savings</p>
                        <p className="text-xl font-bold text-emerald-400 font-mono">₹{totalScannedSavings} Saved</p>
                      </div>
                      <div className="text-right">
                        <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/25 rounded-md text-emerald-450 text-[10px] font-mono font-black uppercase">
                          80% Cheaper
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-zinc-900 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-[10px] font-mono text-zinc-500 leading-snug">
                  * All substitutions are verified and signed off by certified R.Ph pharmacists.
                </span>
                {scanState === "completed" && (
                  <a 
                    href="https://www.avennixpharma.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white font-mono text-[10px] font-bold uppercase rounded-lg transition-colors inline-block"
                  >
                    Go to Store
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- SECTION 3: REDESIGNED COMPARE MEDICINE PRICE SECTION (INTERACTIVE SVG ILLUSTRATION + DASHBOARD) --- */}
      <section id="savings-calculator" className="py-20 border-b border-zinc-900 bg-zinc-900/15 relative">
        <div className="max-w-[94%] mx-auto px-6">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[10px] font-mono text-orange-500 uppercase tracking-widest font-black flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 animate-pulse text-orange-500" /> Interactive Pharmacy Cabinet
            </span>
            <h2 className="text-2xl md:text-4xl font-bold font-mono tracking-tight uppercase mt-2">Compare Medicine Prices</h2>
            <div className="w-12 h-0.5 bg-orange-600 mx-auto mt-3.5" />
            <p className="text-zinc-400 text-xs sm:text-sm mt-3 uppercase tracking-wider font-mono max-w-xl mx-auto leading-relaxed">
              Tap any item in the visual medicine collection below to automatically load its chemical details and calculate your generic savings.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-10 items-stretch max-w-[1200px] mx-auto">
            
            {/* Interactive Medicine SVG Container */}
            <div className="lg:col-span-6 bg-transparent border-0 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.02)_0%,transparent_80%)] pointer-events-none" />
              
              <div>
                <div className="flex items-center justify-between pb-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-orange-500" />
                    <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider font-bold">Cabinet Visualizer</span>
                  </div>
                  <span className="text-[9.5px] font-mono text-orange-400 flex items-center gap-1.5 uppercase tracking-wide bg-orange-500/10 border border-orange-500/20 px-2.5 py-1 rounded-full font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-ping" /> Interactive Vectors
                  </span>
                </div>

                {/* Main Vector Drawing Box - Fully Transparent & Borderless */}
                <div className="w-full bg-transparent flex items-center justify-center relative min-h-[360px] select-none">
                  
                  {/* Glowing Overlay Indicator */}
                  <div className="absolute top-0 left-0 bg-zinc-900/60 backdrop-blur-md border border-zinc-800/50 px-3.5 py-2 rounded-xl text-[10px] font-mono text-zinc-300 flex items-center gap-2 pointer-events-none z-20 shadow-lg">
                    <Info className="w-3.5 h-3.5 text-orange-500" />
                    <span>
                      {hoveredSvgId 
                        ? `Hovering: ${molecules.find(m => m.id === hoveredSvgId)?.name}` 
                        : `Selected: ${selectedMolecule.name}`
                      }
                    </span>
                  </div>

                  {/* SVG Illustration Vector matching medicine packaging collection */}
                  <svg viewBox="0 0 700 480" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto max-h-[380px] drop-shadow-2xl">
                    <defs>
                      <filter id="vectorGlow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="5" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>

                      <linearGradient id="coughSyrupGrad" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#4A1D0E"/>
                        <stop offset="50%" stopColor="#8F3E1B"/>
                        <stop offset="100%" stopColor="#2D0F05"/>
                      </linearGradient>

                      <linearGradient id="blueLiquidGrad" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#1E3A8A" stopOpacity="0.8"/>
                        <stop offset="60%" stopColor="#3B82F6" stopOpacity="0.75"/>
                        <stop offset="100%" stopColor="#1D4ED8" stopOpacity="0.9"/>
                      </linearGradient>

                      <linearGradient id="silverBlisterGrad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#F3F4F6"/>
                        <stop offset="40%" stopColor="#E5E7EB"/>
                        <stop offset="70%" stopColor="#D1D5DB"/>
                        <stop offset="100%" stopColor="#9CA3AF"/>
                      </linearGradient>

                      <linearGradient id="amberCapGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3A3A3C"/>
                        <stop offset="50%" stopColor="#6C6C70"/>
                        <stop offset="100%" stopColor="#1C1C1E"/>
                      </linearGradient>

                      <linearGradient id="yellowPillGrad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#FBBF24"/>
                        <stop offset="50%" stopColor="#F59E0B"/>
                        <stop offset="100%" stopColor="#D97706"/>
                      </linearGradient>

                      <linearGradient id="whiteJarGrad" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#FFFFFF"/>
                        <stop offset="60%" stopColor="#F3F4F6"/>
                        <stop offset="100%" stopColor="#D1D5DB"/>
                      </linearGradient>
                    </defs>

                    {/* Left Silver Blister (Cetirizine 10mg - ID 5) */}
                    <g 
                      onClick={() => setSelectedMolecule(molecules.find(m => m.id === 5)!)}
                      onMouseEnter={() => setHoveredSvgId(5)}
                      onMouseLeave={() => setHoveredSvgId(null)}
                      className={`cursor-pointer transition-all duration-300 origin-center ${
                        selectedMolecule.id === 5 
                          ? "filter drop-shadow-[0_0_8px_rgba(249,115,22,0.7)]" 
                          : "opacity-75 hover:opacity-100 hover:scale-[1.02]"
                      }`}
                    >
                      <rect x="30" y="160" width="110" height="210" rx="14" fill="url(#silverBlisterGrad)" stroke="#B0B5BC" strokeWidth="1.5" />
                      <rect x="38" y="168" width="94" height="194" rx="8" fill="none" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="3 2" strokeOpacity="0.5" />
                      {/* Grid of blister slots */}
                      {Array.from({ length: 5 }).map((_, r) => (
                        <g key={r}>
                          <circle cx="60" cy={195 + r * 35} r="12" fill="#E5E7EB" stroke="#FFFFFF" strokeWidth="1" />
                          <circle cx="60" cy={195 + r * 35} r="9" fill="#FFFFFF" fillOpacity="0.9" />
                          <circle cx="110" cy={195 + r * 35} r="12" fill="#E5E7EB" stroke="#FFFFFF" strokeWidth="1" />
                          <circle cx="110" cy={195 + r * 35} r="9" fill="#FFFFFF" fillOpacity="0.9" />
                        </g>
                      ))}
                    </g>

                    {/* Back Yellow Blister (Paracetamol 650mg - ID 1) */}
                    <g 
                      onClick={() => setSelectedMolecule(molecules.find(m => m.id === 1)!)}
                      onMouseEnter={() => setHoveredSvgId(1)}
                      onMouseLeave={() => setHoveredSvgId(null)}
                      className={`cursor-pointer transition-all duration-300 origin-center ${
                        selectedMolecule.id === 1 
                          ? "filter drop-shadow-[0_0_8px_rgba(249,115,22,0.7)]" 
                          : "opacity-75 hover:opacity-100 hover:scale-[1.02]"
                      }`}
                    >
                      <rect x="350" y="40" width="120" height="160" rx="10" fill="url(#silverBlisterGrad)" stroke="#B0B5BC" strokeWidth="1" />
                      {/* Bubble pill rows */}
                      <g>
                        <circle cx="390" cy="85" r="14" fill="#FCD34D" stroke="#FFFFFF" strokeWidth="1.2" />
                        <circle cx="390" cy="85" r="10" fill="url(#yellowPillGrad)" />
                        <circle cx="430" cy="85" r="14" fill="#FCD34D" stroke="#FFFFFF" strokeWidth="1.2" />
                        <circle cx="430" cy="85" r="10" fill="url(#yellowPillGrad)" />

                        <circle cx="390" cy="135" r="14" fill="#FCD34D" stroke="#FFFFFF" strokeWidth="1.2" />
                        <circle cx="390" cy="135" r="10" fill="url(#yellowPillGrad)" />
                        <circle cx="430" cy="135" r="14" fill="#FCD34D" stroke="#FFFFFF" strokeWidth="1.2" />
                        <circle cx="430" cy="135" r="10" fill="url(#yellowPillGrad)" />
                      </g>
                    </g>

                    {/* Tall Blue Glass Infusion Bottle (Atorvastatin 10mg - ID 3) */}
                    <g 
                      onClick={() => setSelectedMolecule(molecules.find(m => m.id === 3)!)}
                      onMouseEnter={() => setHoveredSvgId(3)}
                      onMouseLeave={() => setHoveredSvgId(null)}
                      className={`cursor-pointer transition-all duration-300 origin-center ${
                        selectedMolecule.id === 3 
                          ? "filter drop-shadow-[0_0_8px_rgba(249,115,22,0.7)]" 
                          : "opacity-75 hover:opacity-100 hover:scale-[1.02]"
                      }`}
                    >
                      {/* Bottle Body */}
                      <path d="M470 180 C470 140, 500 130, 505 100 L535 100 C540 130, 570 140, 570 180 L570 330 C570 340, 560 350, 550 350 L490 350 C480 350, 470 340, 470 330 Z" fill="url(#blueLiquidGrad)" stroke="#3B82F6" strokeWidth="1" />
                      {/* Waterline or Liquid highlight */}
                      <path d="M472 200 L568 200 L568 330 C568 338, 560 348, 550 348 L490 348 C480 348, 472 338, 472 330 Z" fill="#2563EB" fillOpacity="0.3" />
                      {/* Black Cap */}
                      <rect x="500" y="80" width="40" height="20" rx="4" fill="url(#amberCapGrad)" />
                      <line x1="504" y1="80" x2="504" y2="100" stroke="#1F2937" strokeWidth="1.5" />
                      <line x1="510" y1="80" x2="510" y2="100" stroke="#1F2937" strokeWidth="1.5" />
                      <line x1="516" y1="80" x2="516" y2="100" stroke="#1F2937" strokeWidth="1.5" />
                      <line x1="522" y1="80" x2="522" y2="100" stroke="#1F2937" strokeWidth="1.5" />
                      <line x1="528" y1="80" x2="528" y2="100" stroke="#1F2937" strokeWidth="1.5" />
                      <line x1="534" y1="80" x2="534" y2="100" stroke="#1F2937" strokeWidth="1.5" />
                      {/* Horizontal label band */}
                      <rect x="471" y="225" width="98" height="50" fill="#FFFFFF" fillOpacity="0.9" />
                      <rect x="471" y="245" width="98" height="15" fill="#3B82F6" />
                      <text x="520" y="237" fill="#0A0A0A" fontSize="7" fontWeight="bold" fontFamily="monospace" textAnchor="middle">ATORVASTATIN</text>
                      <text x="520" y="255" fill="#FFFFFF" fontSize="7" fontWeight="bold" fontFamily="monospace" textAnchor="middle">AVENIX LIPID</text>
                    </g>

                    {/* Amber Glass Syrup Bottle (Amoxicillin 500mg - ID 2) */}
                    <g 
                      onClick={() => setSelectedMolecule(molecules.find(m => m.id === 2)!)}
                      onMouseEnter={() => setHoveredSvgId(2)}
                      onMouseLeave={() => setHoveredSvgId(null)}
                      className={`cursor-pointer transition-all duration-300 origin-center ${
                        selectedMolecule.id === 2 
                          ? "filter drop-shadow-[0_0_8px_rgba(249,115,22,0.7)]" 
                          : "opacity-75 hover:opacity-100 hover:scale-[1.02]"
                      }`}
                    >
                      {/* Bottle Outline */}
                      <path d="M160 210 C160 170, 185 160, 190 130 L220 130 C225 160, 250 170, 250 210 L250 350 C250 360, 240 370, 230 370 L180 370 C170 370, 160 360, 160 350 Z" fill="url(#coughSyrupGrad)" stroke="#4A1D0E" strokeWidth="1.5" />
                      {/* White Ridge Cap */}
                      <rect x="186" y="110" width="38" height="20" rx="3" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="0.8" />
                      {Array.from({ length: 6 }).map((_, i) => (
                        <line key={i} x1={191 + i * 5} y1="110" x2={191 + i * 5} y2="130" stroke="#9CA3AF" strokeWidth="1.2" />
                      ))}
                      {/* Label */}
                      <rect x="168" y="210" width="74" height="90" rx="4" fill="#FFFFFF" stroke="#D1D5DB" strokeWidth="0.8" />
                      <rect x="168" y="210" width="74" height="4" fill="#EF4444" />
                      <rect x="174" y="235" width="62" height="45" rx="3" fill="#18181B" />
                      {/* Chest Lungs Graphic Symbol inside Label */}
                      <path d="M205 242 L205 247 C201 247, 195 249, 195 258 C195 264, 201 268, 203 268 C205 268, 205 264, 205 260 C205 264, 205 268, 207 268 C209 268, 215 264, 215 258 C215 249, 209 247, 205 247 Z" fill="#EF4444" fillOpacity="0.8" />
                      <circle cx="205" cy="242" r="1.5" fill="#EF4444" />
                      <rect x="178" y="290" width="54" height="5" fill="#EF4444" />
                    </g>

                    {/* Dropper Bottle (Front Left) */}
                    <g className="opacity-80 hover:opacity-100 transition-opacity">
                      <rect x="160" y="320" width="45" height="70" rx="8" fill="#F3F4F6" stroke="#D1D5DB" strokeWidth="1" />
                      <rect x="160" y="340" width="45" height="35" fill="#F97316" />
                      {/* Rubber bulb */}
                      <path d="M174 320 C174 308, 191 308, 191 320 Z" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="1" />
                      <rect x="171" y="316" width="23" height="4" rx="1" fill="#D1D5DB" />
                    </g>

                    {/* Round White Medicine Jar (Pantoprazole 40mg - ID 4) */}
                    <g 
                      onClick={() => setSelectedMolecule(molecules.find(m => m.id === 4)!)}
                      onMouseEnter={() => setHoveredSvgId(4)}
                      onMouseLeave={() => setHoveredSvgId(null)}
                      className={`cursor-pointer transition-all duration-300 origin-center ${
                        selectedMolecule.id === 4 
                          ? "filter drop-shadow-[0_0_8px_rgba(249,115,22,0.7)]" 
                          : "opacity-75 hover:opacity-100 hover:scale-[1.02]"
                      }`}
                    >
                      {/* White Jar Body */}
                      <path d="M260 250 C260 235, 270 230, 280 230 L380 230 C390 230, 400 235, 400 250 L400 330 C400 345, 390 350, 380 350 L280 350 C270 350, 260 345, 260 330 Z" fill="url(#whiteJarGrad)" stroke="#C8D6E5" strokeWidth="1.5" />
                      {/* White Cap */}
                      <path d="M272 210 L388 210 C395 210, 395 230, 388 230 L272 230 C265 230, 265 210, 272 210 Z" fill="#FFFFFF" stroke="#C8D6E5" strokeWidth="1" />
                      <line x1="270" y1="220" x2="390" y2="220" stroke="#E5E7EB" strokeWidth="1.5" />
                      {/* Red/Orange Label */}
                      <rect x="261" y="255" width="138" height="45" fill="#FF6B00" />
                      <rect x="261" y="270" width="138" height="15" fill="#FFFFFF" />
                      <text x="330" y="281" fill="#0A0A0A" fontSize="9" fontWeight="black" fontFamily="monospace" textAnchor="middle" letterSpacing="1px">PANTOPRAZOLE</text>
                    </g>

                    {/* Front Silver blister with yellow pills (Horizontal) */}
                    <g className="opacity-80">
                      <rect x="230" y="320" width="180" height="90" rx="10" fill="url(#silverBlisterGrad)" stroke="#BDC3C7" strokeWidth="1.2" />
                      {Array.from({ length: 4 }).map((_, c) => (
                        <g key={c}>
                          <ellipse cx={255 + c * 42} cy="345" rx="12" ry="7" fill="#FCD34D" stroke="#FFFFFF" strokeWidth="0.8" />
                          <ellipse cx={255 + c * 42} cy="385" rx="12" ry="7" fill="#FCD34D" stroke="#FFFFFF" strokeWidth="0.8" />
                        </g>
                      ))}
                    </g>

                    {/* Throat Spray Bottle (Right Side) */}
                    <g className="opacity-80 hover:opacity-100 transition-opacity">
                      <rect x="490" y="240" width="55" height="110" rx="6" fill="url(#coughSyrupGrad)" stroke="#4A1D0E" strokeWidth="1" />
                      <rect x="490" y="255" width="55" height="30" fill="#FFFFFF" stroke="#BDC3C7" strokeWidth="0.5" />
                      {/* Throat Spray Nozzle */}
                      <path d="M510 240 L510 220 L550 220 L550 226 L516 226 L516 240 Z" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="0.8" />
                      <circle cx="550" cy="223" r="2" fill="#9CA3AF" />
                    </g>

                    {/* Small Single Pill Blister Square (Far Right) */}
                    <g className="opacity-80 hover:opacity-100 transition-opacity">
                      <rect x="540" y="300" width="70" height="70" rx="8" fill="url(#silverBlisterGrad)" stroke="#BDC3C7" strokeWidth="1" />
                      <circle cx="575" cy="335" r="16" fill="#E5E7EB" stroke="#FFFFFF" strokeWidth="1" />
                      <circle cx="575" cy="335" r="10" fill="#FFFFFF" fillOpacity="0.9" />
                    </g>

                    {/* Scattered Pills in front foreground */}
                    {/* 1. Yellow Softgel Pill (Bottom Left) */}
                    <ellipse 
                      cx="120" cy="410" rx="20" ry="10" 
                      fill="url(#yellowPillGrad)" 
                      stroke="#FFFFFF" strokeWidth="0.5" 
                      transform="rotate(-15 120 410)"
                      className="filter drop-shadow-[0_2px_4px_rgba(245,158,11,0.3)]"
                    />

                    {/* 2. Red & White Capsule (Bottom Right) */}
                    <g transform="rotate(10 470 420)">
                      <rect x="450" y="415" width="16" height="12" rx="6" fill="#EF4444" />
                      <rect x="466" y="415" width="16" height="12" rx="6" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="0.5" />
                      <line x1="466" y1="415" x2="466" y2="427" stroke="#9CA3AF" strokeWidth="0.5" />
                    </g>

                    {/* 3. Gold Capsule (Bottom Center) */}
                    <rect 
                      x="370" y="430" width="26" height="11" rx="5.5" 
                      fill="#F59E0B" 
                      stroke="#FFFFFF" strokeWidth="0.5" 
                      transform="rotate(-5 370 430)" 
                    />
                  </svg>
                </div>
              </div>

              {/* Instructions / Active Guide - Transparent Box */}
              <div className="mt-6 p-5 bg-orange-500/5 border border-orange-500/10 rounded-2xl text-left">
                <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Active Selector Guide</p>
                <div className="flex gap-4 items-center mt-3">
                  <div className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-500 shrink-0">
                    <Pill className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-white font-mono uppercase tracking-wider">{selectedMolecule.name}</p>
                    <p className="text-xs text-zinc-405 mt-1 leading-relaxed">{selectedMolecule.desc}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Redesigned Price Comparison Engine Dashboard */}
            <div className="lg:col-span-6 bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6 md:p-8 flex flex-col justify-between relative overflow-hidden shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent pointer-events-none" />
              
              <div>
                <h3 className="text-xs font-bold font-mono text-zinc-400 uppercase tracking-wider mb-4 border-b border-zinc-900 pb-3">
                  Savings Engine Dashboard
                </h3>

                {/* Quick Molecule Selection Tabs */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6">
                  {molecules.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setSelectedMolecule(m)}
                      className={`px-3 py-2 rounded-xl text-[10.5px] font-mono text-left transition-all border ${
                        selectedMolecule.id === m.id
                          ? "bg-orange-600/10 border-orange-500 text-white font-bold"
                          : "bg-zinc-950 border-zinc-850 text-zinc-400 hover:border-zinc-700"
                      }`}
                    >
                      <div className="truncate">{m.name}</div>
                      <div className="text-[8px] text-zinc-500 uppercase truncate mt-0.5">{m.category}</div>
                    </button>
                  ))}
                </div>

                {/* Custom Quantity Slider */}
                <div className="mb-6 bg-zinc-950 border border-zinc-900 p-5 rounded-2xl">
                  <div className="flex items-center justify-between text-xs font-mono mb-2.5">
                    <span className="text-zinc-500 font-bold uppercase tracking-wider">Dosage Quantity</span>
                    <span className="text-orange-500 font-black text-sm">{quantity} Tablets / Pills</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="120"
                    step="10"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full accent-orange-500 cursor-pointer h-1.5 bg-zinc-800 rounded-lg appearance-none"
                  />
                  <div className="flex justify-between text-[9px] font-mono text-zinc-650 mt-1">
                    <span>10 Tabs (Intro Pack)</span>
                    <span>60 Tabs (Bi-Monthly)</span>
                    <span>120 Tabs (Quarterly)</span>
                  </div>
                </div>

                {/* Pricing Visual Metrics Meter */}
                <div className="space-y-4">
                  
                  {/* Traditional Pharmacy Bar */}
                  <div className="bg-zinc-950 border border-zinc-900 p-4 rounded-xl relative overflow-hidden">
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="text-zinc-500 uppercase font-bold">Traditional Pharmacy Price</span>
                      <span className="text-zinc-400 font-bold">₹{(selectedMolecule.brandedPrice * (quantity / 10)).toFixed(2)}</span>
                    </div>
                    <div className="w-full bg-zinc-900 h-2.5 rounded-full mt-2.5 overflow-hidden">
                      <div className="bg-zinc-700 h-full w-full" />
                    </div>
                    <span className="text-[8.5px] text-zinc-600 font-mono mt-1 block">Based on standard branded retail margins</span>
                  </div>

                  {/* Avenix Pharmacy Bar */}
                  <div className="bg-orange-500/5 border border-orange-500/20 p-4 rounded-xl relative overflow-hidden">
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="text-orange-500 uppercase font-black tracking-wide flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5" /> Avenix Generic Price
                      </span>
                      <span className="text-orange-500 font-black text-base">₹{(selectedMolecule.avenixPrice * (quantity / 10)).toFixed(2)}</span>
                    </div>
                    
                    {/* Animate-width container */}
                    <div className="w-full bg-zinc-900 h-2.5 rounded-full mt-2.5 overflow-hidden">
                      <motion.div 
                        className="bg-orange-500 h-full rounded-full"
                        initial={{ width: "100%" }}
                        animate={{ width: "20%" }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                      />
                    </div>
                    <div className="flex justify-between items-center mt-1.5 text-[9px] font-mono">
                      <span className="text-zinc-400">CDSCO-Certified WHO-GMP partners</span>
                      <span className="text-emerald-500 font-black">Save {selectedMolecule.savings}</span>
                    </div>
                  </div>

                  {/* Dynamic Savings Card */}
                  <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shrink-0">
                        <Activity className="w-4 h-4" />
                      </div>
                      <div className="text-left font-mono">
                        <p className="text-[10px] text-emerald-500 uppercase tracking-widest font-bold">Accumulated Value Saved</p>
                        <p className="text-xl font-black text-emerald-400 leading-tight">₹{((selectedMolecule.brandedPrice - selectedMolecule.avenixPrice) * (quantity / 10)).toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-450 text-[10px] font-mono font-black uppercase">
                      -{selectedMolecule.savings}
                    </div>
                  </div>

                </div>
              </div>

              {/* Redirection link actions */}
              <div className="border-t border-zinc-900 pt-6 mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-left font-mono text-[9px] text-zinc-500 max-w-sm">
                  * Avenix guarantees identical therapeutic performance by matching the active chemical ingredient of your prescription.
                </div>
                <a 
                  href="https://www.avennixpharma.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3 bg-orange-600 hover:bg-orange-500 text-white font-mono text-[11px] font-black uppercase rounded-xl transition-all shadow-lg shadow-orange-600/15 cursor-pointer flex items-center justify-center gap-2"
                >
                  Order Generic Molecule <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* --- SECTION 4: INTEGRATED MEDICAL ECOSYSTEM GRID --- */}
      <section className="py-20 border-b border-zinc-900">
        <div className="max-w-[94%] mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[10px] font-mono text-orange-500 uppercase tracking-widest font-bold">Healix Integration</span>
            <h2 className="text-2xl md:text-4xl font-bold font-mono tracking-tight uppercase mt-2">Integrated Medical Ecosystem</h2>
            <div className="w-12 h-0.5 bg-orange-600 mx-auto mt-3" />
            <p className="text-zinc-400 text-xs sm:text-sm mt-3 uppercase tracking-wider font-mono">
              Fusing Avenix inventory logistics with Healix health AI telemetry.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { 
                title: "Personal Health Portal", 
                desc: "An intuitive dashboard keeping track of your molecular requirements, digital prescriptions, and daily dosages.", 
                stat: "Telemetry Linked", 
                color: "text-blue-500" 
              },
              { 
                title: "Inventory & Verification", 
                desc: "WHO-GMP inventory nodes update batch codes live. Pharmacists cross-verify every batch to guarantee authentic delivery.", 
                stat: "100% Genuine Check", 
                color: "text-emerald-500" 
              },
              { 
                title: "Tele-Medicine Queue", 
                desc: "Get digital consultations within minutes. Our R.Ph network approves custom molecules and releases digital scripts.", 
                stat: "R.Ph Instant Review", 
                color: "text-orange-500" 
              },
              { 
                title: "Platform Command", 
                desc: "Failsafe telemetry tracks dispatch, route speed, and cold-chain temperature thresholds from warehouses to your door.", 
                stat: "CDSCO Audited Node", 
                color: "text-red-500" 
              }
            ].map((node, i) => (
              <div 
                key={i} 
                className="bg-zinc-900/35 border border-zinc-900 hover:border-zinc-800 rounded-2xl p-6 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">ECOSYSTEM UNIT 0{i + 1}</span>
                  </div>
                  <h3 className="text-sm font-bold font-mono text-white uppercase tracking-wider mb-2">{node.title}</h3>
                  <p className="text-zinc-400 text-xs leading-relaxed">{node.desc}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-zinc-900/60 flex items-center justify-between">
                  <span className={`text-[9.5px] font-mono uppercase tracking-widest font-bold ${node.color}`}>{node.stat}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-650" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- SECTION 5: HEALTH RESOURCE CENTER (GUIDES) --- */}
      <section className="py-24 border-b border-zinc-900 bg-zinc-900/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.015)_0%,transparent_70%)] pointer-events-none" />
        <div className="max-w-[94%] mx-auto px-6 grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headings and Stacked Clinical Resource Cards */}
          <div className="lg:col-span-7 space-y-8">
            <div className="text-left space-y-4">
              <span className="text-[10px] font-mono text-orange-500 uppercase tracking-widest font-black flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Avenix Health Resource
              </span>
              <h2 className="text-3xl md:text-5xl font-bold font-mono tracking-tight uppercase text-white">Clinical Insights & Guides</h2>
              <div className="w-16 h-0.5 bg-orange-600 mt-2" />
              <p className="text-zinc-400 text-xs sm:text-sm mt-3 uppercase tracking-wider font-mono max-w-xl">
                Empowering consumers with professional diagnostic, clinical, and metabolic safety guidelines.
              </p>
            </div>

            <div className="space-y-4 max-w-2xl">
              {[
                {
                  title: "5 Tips to Manage Blood Sugar Levels",
                  desc: "A comprehensive guide on managing glycemic metrics, understanding HbA1c screening intervals, and pre-diabetic telemetry tracking.",
                  category: "Diabetes & Metabolism",
                  date: "May 2026",
                  readTime: "4 Mins Read"
                },
                {
                  title: "Understanding Hypertension & Arterial Health",
                  desc: "Deconstructing blood pressure trends, cardiovascular risk profiles, and active arterial health checks for patients over 35.",
                  category: "Cardiovascular Care",
                  date: "April 2026",
                  readTime: "6 Mins Read"
                },
                {
                  title: "Managing Acidity: Antacids vs. Diet Control",
                  desc: "Exploring PPI pathways, Pantoprazole efficiency thresholds, and natural dietary solutions to reduce acid reflux triggers.",
                  category: "Gastroenterology",
                  date: "April 2026",
                  readTime: "5 Mins Read"
                }
              ].map((post, idx) => (
                <div 
                  key={idx} 
                  className="bg-zinc-900/40 border border-zinc-800/80 hover:border-zinc-700/80 rounded-2xl overflow-hidden flex flex-col justify-between shadow-lg group transition-all duration-300"
                >
                  <div className="p-6 space-y-3.5 text-left">
                    <div className="flex items-center justify-between text-[9px] font-mono text-zinc-500 uppercase">
                      <span className="px-2 py-0.5 bg-zinc-950 border border-zinc-900 rounded text-orange-500 font-bold">{post.category}</span>
                      <span>{post.readTime}</span>
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-white uppercase tracking-wide leading-snug group-hover:text-orange-500 transition-colors font-mono">
                      {post.title}
                    </h3>

                    <p className="text-zinc-400 text-xs leading-relaxed">
                      {post.desc}
                    </p>
                  </div>

                  <div className="p-6 pt-0 border-t border-zinc-900/40 mt-auto flex items-center justify-between text-[10px] font-mono text-zinc-500">
                    <span>Published: {post.date}</span>
                    <span className="text-orange-500 group-hover:translate-x-1 transition-transform flex items-center gap-1 font-bold">
                      Read Article <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Custom SVG Illustration matching user image exactly with Transparent Background */}
          <div className="lg:col-span-5 flex items-center justify-center relative select-none">
            
            {/* SVG Illustration Container - Transparent background, borderless */}
            <svg 
              viewBox="0 0 540 500" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg" 
              className="w-full h-auto max-h-[420px] drop-shadow-xl"
            >
              {/* Back Green Leaves (teal/green plants) */}
              <g id="back-leaves">
                {/* Leaf 1 (Leftmost Green) */}
                <path 
                  d="M340 180 C365 140, 395 120, 410 160 C420 180, 400 240, 380 290" 
                  fill="#2A7B76" 
                  opacity="0.85" 
                />
                
                {/* Leaf 2 (Center Green Leaf) */}
                <path 
                  d="M370 120 C400 110, 430 200, 440 310 C420 310, 390 280, 370 240" 
                  fill="#2C857D" 
                />
                
                {/* Leaf 3 (Rightmost Tall Green Leaf) */}
                <path 
                  d="M400 220 C440 205, 480 280, 460 350 C440 355, 420 300, 400 260" 
                  fill="#328E86" 
                />
              </g>

              {/* Character Base Body & Face */}
              <g id="character">
                {/* Back Hair */}
                <path 
                  d="M260 148 C250 120, 270 95, 310 90 C350 85, 370 105, 370 135 C370 150, 350 160, 340 160 C320 160, 310 140, 290 140 C270 140, 265 135, 260 148 Z" 
                  fill="#3A2449" 
                />

                {/* Ear */}
                <circle cx="325" cy="180" r="10" fill="#E06A6D" />
                <path d="M323 177 C326 177, 327 182, 323 183" stroke="#3A2449" strokeWidth="1.5" fill="none" />

                {/* Neck */}
                <path d="M290 200 L320 200 L305 240 L285 230 Z" fill="#C25357" />

                {/* Face Head */}
                <path 
                  d="M295 110 C265 110, 258 135, 258 165 C258 190, 275 210, 305 210 C335 210, 340 185, 340 160 C340 135, 325 110, 295 110 Z" 
                  fill="#E06A6D" 
                />
                
                {/* Smile & Eyes profile */}
                <path d="M265 160 L262 165 L268 167" stroke="#3A2449" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                <path d="M268 185 C275 192, 288 192, 295 185" stroke="#3A2449" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                <circle cx="280" cy="155" r="2.5" fill="#3A2449" />

                {/* White T-shirt */}
                <path 
                  d="M240 260 C240 220, 280 220, 320 220 C360 220, 410 225, 435 260 L445 350 L250 350 Z" 
                  fill="#FFFFFF" 
                />
                <path d="M280 220 C280 230, 300 230, 300 220" stroke="#E5E7EB" strokeWidth="2" fill="none" />

                {/* Heart on T-shirt Chest */}
                <path 
                  d="M320 260 C310 245, 290 245, 290 260 C290 275, 320 295, 320 295 C320 295, 350 275, 350 260 C350 245, 330 245, 320 260 Z" 
                  fill="#FFA1A9" 
                  stroke="#3A2449" 
                  strokeWidth="1.5" 
                />
                <path d="M295 260 H305 L310 250 L315 270 L320 255 L325 265 H345" stroke="#3A2449" strokeWidth="1.5" fill="none" />

                {/* Right Arm (Holding Smartphone) */}
                <path 
                  d="M240 260 C200 220, 160 180, 140 170 C130 165, 120 170, 115 185 L90 240 C105 285, 170 360, 240 365 Z" 
                  fill="#E06A6D" 
                />

                {/* Left Arm (Foreground Bottom) */}
                <path 
                  d="M380 260 C420 260, 475 280, 475 315 C475 340, 440 370, 380 395 C330 415, 280 425, 255 425 L230 425" 
                  fill="#E06A6D" 
                  stroke="#3A2449"
                  strokeWidth="0.5"
                />
                {/* Finger crease indicators */}
                <path d="M230 405 C240 405, 250 410, 260 415" stroke="#C25357" strokeWidth="1.5" fill="none" />
                <path d="M232 390 C242 390, 252 395, 262 400" stroke="#C25357" strokeWidth="1.5" fill="none" />
                <path d="M238 375 C248 375, 258 380, 268 385" stroke="#C25357" strokeWidth="1.5" fill="none" />
              </g>

              {/* Smartphone held in Hand */}
              <g id="smartphone" transform="rotate(-12 110 200)">
                <rect x="75" y="140" width="60" height="110" rx="10" fill="#3A2449" stroke="#E5E7EB" strokeWidth="2.5" />
                <rect x="80" y="145" width="50" height="100" rx="6" fill="#FFFFFF" />
                {/* Turquoise Medical Cross on screen */}
                <rect x="100" y="180" width="10" height="30" rx="2" fill="#2C857D" />
                <rect x="90" y="190" width="30" height="10" rx="2" fill="#2C857D" />
              </g>

              {/* Speech bubble overlay: "120/80" */}
              <g id="bp-bubble" transform="translate(120, 80)">
                <rect x="0" y="0" width="125" height="36" rx="8" fill="#D2EAE8" />
                {/* Triangle point */}
                <path d="M15 36 L20 44 L25 36 Z" fill="#D2EAE8" />
                
                {/* Red Heart */}
                <path 
                  d="M25 18 C22 13, 13 13, 13 21 C13 27, 25 32, 25 32 C25 32, 37 27, 37 21 C37 13, 28 13, 25 18 Z" 
                  fill="#EF4444" 
                  transform="translate(0, -5) scale(0.65)" 
                />
                
                <text x="50" y="22" fill="#3A2449" fontSize="13" fontWeight="bold" fontFamily="monospace">120/80</text>
              </g>

              {/* Floating Health Indicators */}
              <g id="floating-indicators">
                {/* 1. Yellow/Orange Kcal Flame (Top Center) */}
                <g transform="translate(190, 140)">
                  <path 
                    d="M25 0 C45 15, 45 45, 25 55 C5 45, 5 15, 25 0 Z" 
                    fill="#F8B84E" 
                    fillOpacity="0.85" 
                  />
                  <path 
                    d="M25 10 C35 20, 35 40, 25 45 C15 40, 15 20, 25 10 Z" 
                    fill="#FFA726" 
                  />
                  <text x="25" y="38" fill="#3A2449" fontSize="8.5" fontWeight="black" fontFamily="monospace" textAnchor="middle">Kcal</text>
                </g>

                {/* 2. Red Thermometer Icon (Left Bottom) */}
                <g transform="translate(100, 300)">
                  <rect x="5" y="0" width="8" height="35" rx="4" fill="#FFA1A9" />
                  <circle cx="9" cy="38" r="11" fill="#FFA1A9" />
                  
                  {/* Inner Fluid */}
                  <rect x="7" y="10" width="4" height="25" rx="2" fill="#EF4444" />
                  <circle cx="9" cy="38" r="7" fill="#EF4444" />
                  
                  {/* Graduations */}
                  <line x1="16" y1="8" x2="20" y2="8" stroke="#3A2449" strokeWidth="1.5" />
                  <line x1="16" y1="16" x2="20" y2="16" stroke="#3A2449" strokeWidth="1.5" />
                  <line x1="16" y1="24" x2="20" y2="24" stroke="#3A2449" strokeWidth="1.5" />
                </g>

                {/* 3. Dark Badge with Medical Cross (Bottom Center) */}
                <g transform="translate(140, 360)">
                  <circle cx="30" cy="30" r="28" fill="#3A2449" />
                  {/* Cross */}
                  <rect x="25" y="15" width="10" height="30" rx="2" fill="#2C857D" />
                  <rect x="15" y="25" width="30" height="10" rx="2" fill="#2C857D" />
                </g>
              </g>

              {/* Heartbeat linking phone and chest */}
              <path 
                d="M136 150 L160 150 L160 325 L210 325 L220 290 L230 350 L240 310 L250 340 L260 325 L300 325" 
                stroke="#3A2449" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                fill="none" 
              />
            </svg>

          </div>
          
        </div>
      </section>

      {/* --- SECTION 6: QUALITY STANDARDS & CDSCO COMPLIANCE --- */}
      <section className="py-20">
        <div className="max-w-[94%] mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.03)_0%,transparent_70%)] pointer-events-none" />
            
            <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
              <div className="flex justify-center gap-4 text-orange-500 mb-2">
                <Award className="w-10 h-10 stroke-[1.5]" />
              </div>
              
              <h2 className="text-xl md:text-3xl font-bold font-mono text-white uppercase tracking-tight leading-tight">
                WHO-GMP Certified Partner Warehouse Nodes
              </h2>
              
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-mono">
                Avenix Pharmaceuticals maintains stringent storage parameters compliant with the Drugs and Cosmetics Act of India. Standard cold chain telemetry is active on all insulin and temperature-sensitive biological structures.
              </p>

              <div className="flex flex-wrap justify-center gap-3 pt-4">
                <span className="px-3.5 py-1.5 bg-zinc-950 border border-zinc-850 rounded-xl text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                  CDSCO Compliant
                </span>
                <span className="px-3.5 py-1.5 bg-zinc-950 border border-zinc-850 rounded-xl text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                  WHO-GMP Partnered
                </span>
                <span className="px-3.5 py-1.5 bg-zinc-950 border border-zinc-850 rounded-xl text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                  NABL Laboratory Network
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- SECTION 7: REDESIGNED FINAL CALL TO ACTION WITH DELIVERY DRONE SVG --- */}
      <section className="py-24 border-t border-zinc-900 bg-gradient-to-b from-zinc-950 to-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(249,115,22,0.03)_0%,transparent_50%)] pointer-events-none" />
        
        <div className="max-w-[94%] mx-auto px-6 grid lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Left Column: Headlines & Call to Action button */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <span className="text-[10px] font-mono text-orange-500 uppercase tracking-widest font-black flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Express Generic Delivery
            </span>
            
            <h2 className="text-3xl md:text-5xl font-bold font-mono tracking-tight text-white uppercase leading-tight">
              Democratizing <br />
              <span className="text-orange-500">Clinical Savings</span>
            </h2>
            
            <p className="text-zinc-400 text-xs sm:text-sm font-mono uppercase tracking-wider max-w-xl leading-relaxed">
              Access authentic, certified molecules direct from India's intelligent online pharmacy. Same-day express rider dispatch from partner WHO-GMP nodes.
            </p>

            <div className="pt-2">
              <a 
                href="https://www.avennixpharma.in"
                target="_blank"
                rel="noopener noreferrer"
                className="h-14 px-8 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-orange-600/15 cursor-pointer inline-flex items-center gap-2"
              >
                Go to Medicine Store <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            <div className="flex flex-wrap gap-4 pt-6 border-t border-zinc-900/60 text-[10px] text-zinc-550 font-mono uppercase tracking-widest">
              {['Same-Day Dispatch', 'CDSCO Section 142 Approved', 'Pharmacist Dual-Checked'].map(tag => (
                <div key={tag} className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-orange-500" /> {tag}
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Custom SVG Illustration matching the community reference image exactly with Transparent Background */}
          <div className="lg:col-span-5 flex items-center justify-center relative select-none">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.015)_0%,transparent_70%)] pointer-events-none" />
            
            {/* Community People vector - Transparent background, borderless */}
            <svg 
              viewBox="0 0 620 440" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg" 
              className="w-full h-auto max-h-[380px] drop-shadow-xl"
            >
              {/* Back Green leaves from previous layout style for continuity */}
              <g opacity="0.15">
                <path d="M500 120 C540 100, 560 220, 570 330 C540 330, 515 280, 500 240 Z" fill="#2C857D" />
                <path d="M520 200 C550 180, 580 260, 570 320 C550 325, 530 290, 520 250 Z" fill="#328E86" />
              </g>

              {/* CHARACTER 1: Leftmost Woman holding speech bubble and magnifier */}
              <g id="char-left-magnifier">
                {/* Legs */}
                <rect x="150" y="310" width="10" height="75" rx="3" fill="#2E2E3A" />
                <rect x="168" y="310" width="10" height="75" rx="3" fill="#2E2E3A" />
                <path d="M148 380 H161 V385 H148 Z" fill="#2E2E3A" />
                <path d="M166 380 H179 V385 H166 Z" fill="#2E2E3A" />

                {/* Coat/Body */}
                <path d="M120 180 C120 160, 205 160, 205 180 L220 315 H125 Z" fill="#F9CEBA" />

                {/* Neck & Face */}
                <rect x="155" y="145" width="18" height="20" fill="#F7D2B6" />
                <circle cx="164" cy="140" r="18" fill="#F7D2B6" />

                {/* Hair */}
                <path d="M145 130 C140 145, 140 170, 160 170 C180 170, 185 145, 180 130 C175 115, 150 115, 145 130 Z" fill="#2E2E3A" />
                <circle cx="152" cy="130" r="10" fill="#2E2E3A" />
                <circle cx="174" cy="132" r="10" fill="#2E2E3A" />

                {/* Left Arm holding magnifier handle */}
                <path d="M128 200 C110 230, 130 270, 172 260" stroke="#F9CEBA" strokeWidth="15" strokeLinecap="round" fill="none" />

                {/* Magnifier glass handle & rim */}
                <path d="M172 250 L205 285" stroke="#112F4E" strokeWidth="14" strokeLinecap="round" />
                <circle cx="140" cy="225" r="38" fill="none" stroke="#3A5B69" strokeWidth="6" />
                <circle cx="140" cy="225" r="35" fill="#A5DBEC" fillOpacity="0.8" />
                <circle cx="125" cy="210" r="8" fill="#FFFFFF" fillOpacity="0.5" />
              </g>

              {/* Speech Bubble above left woman */}
              <g id="speech-bubble" transform="translate(100, 50)">
                <path d="M5 0 H105 V65 H35 L20 80 L20 65 H5 Z" fill="#528274" />
                {/* Horizontal lines representing text */}
                <line x1="15" y1="15" x2="95" y2="15" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
                <line x1="15" y1="30" x2="95" y2="30" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
                <line x1="15" y1="45" x2="65" y2="45" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
              </g>

              {/* CHARACTER 2: Curly-Haired Woman (Center-Left) */}
              <g id="char-curly-left">
                {/* Legs */}
                <rect x="210" y="320" width="10" height="70" rx="3" fill="#90C7E5" />
                <rect x="226" y="320" width="10" height="70" rx="3" fill="#90C7E5" />

                {/* Body/Coat */}
                <path d="M185 240 L250 240 L260 325 H180 Z" fill="#F8F9FA" />

                {/* Face & Hair */}
                <circle cx="218" cy="205" r="15" fill="#BD8650" />
                <path d="M200 190 C185 190, 180 220, 200 225 C215 230, 235 220, 235 200 C235 180, 215 180, 200 190 Z" fill="#2E2E3A" />
                <circle cx="218" cy="188" r="14" fill="#2E2E3A" />
                <circle cx="202" cy="202" r="12" fill="#2E2E3A" />
                <circle cx="230" cy="204" r="11" fill="#2E2E3A" />

                {/* Arms */}
                <path d="M190 240 C175 260, 200 280, 215 270" stroke="#F8F9FA" strokeWidth="12" strokeLinecap="round" fill="none" />
              </g>

              {/* CHARACTER 3: Center Man holding purple Hashtag above head */}
              <g id="char-center-hashtag">
                {/* Legs */}
                <path d="M260 270 L250 375 H262 L272 270 Z" fill="#1D4ED8" />
                <path d="M280 270 L290 375 H302 L288 270 Z" fill="#1D4ED8" />

                {/* Body/Shirt */}
                <path d="M240 170 C240 155, 310 155, 310 170 L320 275 H235 Z" fill="#90C7E5" />

                {/* Face & Hair */}
                <circle cx="275" cy="130" r="16" fill="#F7D2B6" />
                <path d="M255 120 C250 110, 290 90, 295 110 C300 120, 280 135, 255 120 Z" fill="#2E2E3A" />

                {/* Arms raised high */}
                <path d="M245 170 Q235 120, 248 100" stroke="#90C7E5" strokeWidth="13" strokeLinecap="round" fill="none" />
                <path d="M305 170 Q315 120, 328 100" stroke="#90C7E5" strokeWidth="13" strokeLinecap="round" fill="none" />

                {/* Purple Hashtag Symbol */}
                <g id="hashtag-icon" transform="translate(225, 20)">
                  <rect x="0" y="0" width="95" height="95" fill="none" />
                  {/* Vertical Bars */}
                  <rect x="25" y="5" width="12" height="85" rx="3" fill="#4A2E65" transform="rotate(-10 25 5)" />
                  <rect x="55" y="5" width="12" height="85" rx="3" fill="#4A2E65" transform="rotate(-10 55 5)" />
                  {/* Horizontal Bars */}
                  <rect x="5" y="25" width="85" height="12" rx="3" fill="#4A2E65" transform="rotate(-5 5 25)" />
                  <rect x="5" y="55" width="85" height="12" rx="3" fill="#4A2E65" transform="rotate(-5 5 55)" />
                </g>
              </g>

              {/* CHARACTER 4: Center-Front Woman holding Golden Star */}
              <g id="char-front-star">
                {/* Legs */}
                <rect x="305" y="325" width="10" height="70" rx="3" fill="#2E2E3A" />
                <rect x="323" y="325" width="10" height="70" rx="3" fill="#2E2E3A" />

                {/* Body/Shirt */}
                <path d="M285 245 L350 245 L355 330 H280 Z" fill="#FFFFFF" />

                {/* Face & Hair */}
                <circle cx="316" cy="205" r="14" fill="#F7D2B6" />
                <path d="M302 205 C302 180, 330 180, 330 205 Z" fill="#2E2E3A" />
                {/* Long side swoop/pigtails */}
                <path d="M300 205 C295 215, 290 240, 298 250" stroke="#2E2E3A" strokeWidth="5" strokeLinecap="round" fill="none" />
                <path d="M332 205 C337 215, 342 240, 334 250" stroke="#2E2E3A" strokeWidth="5" strokeLinecap="round" fill="none" />

                {/* Arms holding the giant star */}
                <path d="M290 260 C280 275, 300 300, 315 280" stroke="#FFFFFF" strokeWidth="12" strokeLinecap="round" fill="none" />

                {/* Giant Golden Star */}
                <g id="golden-star" transform="translate(265, 215)">
                  <path 
                    d="M50 0 L64 32 L98 35 L72 58 L80 92 L50 73 L20 92 L28 58 L2 35 L36 32 Z" 
                    fill="#FFC72C" 
                    stroke="#F59E0B"
                    strokeWidth="1.5"
                  />
                </g>
              </g>

              {/* CHARACTER 5: Center-Right Man holding Brown Avatar Avatar Badge */}
              <g id="char-right-avatar">
                {/* Legs */}
                <rect x="380" y="300" width="11" height="75" rx="3" fill="#2E2E3A" />
                <rect x="398" y="300" width="11" height="75" rx="3" fill="#2E2E3A" />

                {/* Body/Shirt */}
                <path d="M350 180 C350 160, 420 160, 420 180 L430 310 H345 Z" fill="#8EA0A6" />

                {/* Face & Hair */}
                <circle cx="388" cy="148" r="16" fill="#F7D2B6" />
                <path d="M370 135 C365 125, 405 110, 410 130 C415 140, 395 150, 370 135 Z" fill="#2E2E3A" />

                {/* Arm raised high holding avatar badge */}
                <path d="M410 190 Q425 150, 412 120" stroke="#8EA0A6" strokeWidth="13" strokeLinecap="round" fill="none" />

                {/* Brown Avatar Badge with Plus Icon */}
                <g id="avatar-badge" transform="translate(375, 45)">
                  {/* Avatar Shape */}
                  <path d="M10 50 C10 35, 60 35, 60 50 Z" fill="#AC5543" />
                  <circle cx="35" cy="22" r="14" fill="#AC5543" />
                  {/* Yellow Plus Circle badge */}
                  <circle cx="56" cy="34" r="10" fill="#FFC72C" />
                  <path d="M56 29 V39 M51 34 H61" stroke="#112F4E" strokeWidth="2.5" strokeLinecap="round" />
                </g>
              </g>

              {/* CHARACTER 6: Rightmost Woman holding Blue Share Node */}
              <g id="char-right-share">
                {/* Legs */}
                <rect x="442" y="315" width="10" height="75" rx="3" fill="#8EA0A6" />
                <rect x="460" y="315" width="10" height="75" rx="3" fill="#8EA0A6" />

                {/* Body/Coat */}
                <path d="M418 245 C418 220, 480 220, 480 245 L490 325 H412 Z" fill="#CCD5D9" />

                {/* Face & Hair */}
                <circle cx="452" cy="205" r="15" fill="#F7D2B6" />
                
                {/* Bright Orange Hair */}
                <path d="M440 190 C420 195, 415 240, 432 250 C445 260, 465 245, 465 220 C465 195, 455 185, 440 190 Z" fill="#FFA834" />
                <circle cx="452" cy="188" r="14" fill="#FFA834" />

                {/* Arm holding share node */}
                <path d="M472 245 C485 245, 502 260, 492 272" stroke="#CCD5D9" strokeWidth="12" strokeLinecap="round" fill="none" />

                {/* Large Blue Share Node Icon */}
                <g id="share-icon" transform="translate(470, 130)">
                  {/* Connecting lines */}
                  <line x1="28" y1="80" x2="80" y2="40" stroke="#026399" strokeWidth="8" strokeLinecap="round" />
                  <line x1="28" y1="80" x2="80" y2="105" stroke="#026399" strokeWidth="8" strokeLinecap="round" />
                  
                  {/* Nodes */}
                  <circle cx="28" cy="80" r="18" fill="#026399" stroke="#FFFFFF" strokeWidth="2.5" />
                  <circle cx="80" cy="40" r="14" fill="#026399" stroke="#FFFFFF" strokeWidth="2" />
                  <circle cx="80" cy="105" r="14" fill="#026399" stroke="#FFFFFF" strokeWidth="2" />
                </g>
              </g>
            </svg>
          </div>

        </div>
      </section>
    </div>
  );
}

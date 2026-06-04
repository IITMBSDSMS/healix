"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Globe, Building2, Heart, Cpu, ArrowRight, 
  ChevronLeft, ChevronRight, Play, Pause, User, MapPin, Activity
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

// Cinematic preloaded institutions data (used as static fallbacks)
const INSTITUTIONS = [
  {
    id: "aiims-delhi",
    name: "AIIMS Delhi",
    city: "New Delhi",
    facility: "Healix Clinical Diagnostics Hub",
    image: "https://upload.wikimedia.org/wikipedia/commons/b/b2/AIIMS_DELHI.jpg",
    description: "Serves as the primary clinical validation center. Focuses on real-time telemetry analytics, cardiovascular risk profiling, and patient diagnostics testing workflows.",
    mentors: [
      { name: "Dr. Amitabha Bandyopadhyay", role: "Clinical Genetics Consultant", photo: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=200&auto=format&fit=crop" },
      { name: "Dr. Randeep Guleria", role: "Pulmonology Lead & Telemetry Advisor", photo: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=200&auto=format&fit=crop" }
    ],
    projects: ["Cardio Diagnostics AI", "Rural Outreach Telemetry Node", "Low-latency SOS Integration"]
  },
  {
    id: "iit-delhi",
    name: "IIT Delhi",
    city: "New Delhi",
    facility: "Genomics Compute Center",
    image: "https://upload.wikimedia.org/wikipedia/commons/e/ee/IIT_Delhi_Main_building.jpg",
    description: "Hosts the distributed genomic sequence compute cluster. Drives explainable machine learning models for risk analysis and DNA sequence validation.",
    mentors: [
      { name: "Prof. James Gomes", role: "Biomedical Engineering Chair", photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop" },
      { name: "Dr. Sonia Gandhi", role: "Neurogenomics Research Fellow", photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop" }
    ],
    projects: ["Distributed DNA Sequence Models", "Explainable Risk Prediction Pipeline", "HPC Clusters Cluster-1"]
  },
  {
    id: "iit-madras",
    name: "IIT Madras",
    city: "Chennai",
    facility: "Clinical Systems Research Lab",
    image: "https://upload.wikimedia.org/wikipedia/commons/2/23/IIT_Madras_campus_main_gate.jpg",
    description: "Specializes in clinical IoT hardware architecture. Integrates hardware sensory fail-safes and edge network coordinates tracking arrays.",
    mentors: [
      { name: "Prof. Guhan Jayaraman", role: "Biotechnology Director", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop" },
      { name: "Dr. K. VijayRaghavan", role: "Computational Biology Advisor", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop" }
    ],
    projects: ["Sensor Failsafe Telemetry Systems", "Low-latency Edge Sockets", "SheSecure Emergency Gateway"]
  },
  {
    id: "iit-bombay",
    name: "IIT Bombay",
    city: "Mumbai",
    facility: "Public Health Biosensors Hub",
    image: "https://upload.wikimedia.org/wikipedia/commons/5/50/Main_building_in_IIT_Bombay.jpg",
    description: "Develops bio-sensory diagnostic hardware. Specializes in low-cost paper diagnostic sensors and secure telemetry transmitters.",
    mentors: [
      { name: "Prof. Rohit Srivastava", role: "Biosensors Innovation Chair", photo: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=200&auto=format&fit=crop" },
      { name: "Dr. Deepa Bhartiya", role: "Stem Cell Biology Fellow", photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&auto=format&fit=crop" }
    ],
    projects: ["Paper Biosensor Transmitters", "Autonomous Health Sync Protocol", "Urban Telemetry Hubs"]
  },
  {
    id: "iisc-bangalore",
    name: "IISc Bangalore",
    city: "Bengaluru",
    facility: "Molecular Dynamics & Biochemistry Hub",
    image: "https://upload.wikimedia.org/wikipedia/commons/e/e4/IISc_main_building.jpg",
    description: "Focuses on advanced biochemical dynamics, CRISPR off-target mutation models, and high-reliability data integration failsafes.",
    mentors: [
      { name: "Prof. Sandeep Verma", role: "Chemical Biology Lead", photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200&auto=format&fit=crop" },
      { name: "Dr. G. Padmanaban", role: "Biochemistry Advisor", photo: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=200&auto=format&fit=crop" }
    ],
    projects: ["CRISPR Mutation Analytics", "Molecular Simulation Telemetry", "High-reliability DB Failsafes"]
  }
];

// Top Engineering Institutions logos and details (used as static fallbacks)
const ENGINEERING_INSTITUTIONS = [
  {
    name: "IIT Delhi",
    logo: "https://upload.wikimedia.org/wikipedia/en/f/fd/IIT_Delhi_Logo.svg",
    fallbackText: "IITD",
    teamName: "Genomics Systems Group",
    specialization: "AI Diagnostics & Genomics Arrays"
  },
  {
    name: "IIT Bombay",
    logo: "https://upload.wikimedia.org/wikipedia/en/1/1d/Indian_Institute_of_Technology_Bombay_Logo.svg",
    fallbackText: "IITB",
    teamName: "Sensors & Telemetry Labs",
    specialization: "IoT Systems & Emergency Telemetry"
  },
  {
    name: "IIT Madras",
    logo: "https://upload.wikimedia.org/wikipedia/en/8/81/Indian_Institute_of_Technology_Madras_Logo.svg",
    fallbackText: "IITM",
    teamName: "Distributed Hardware Unit",
    specialization: "Edge Node Security & Socket Protocols"
  },
  {
    name: "IISc Bangalore",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/f/f9/Indian_Institute_of_Science_logo.svg/440px-Indian_Institute_of_Science_logo.svg.png",
    fallbackText: "IISc",
    teamName: "Bio-Computation Center",
    specialization: "Molecular Modeling & Failsafe DBs"
  }
];

// 3D Canvas Earth Globe Component
function RevolveGlobe() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = canvas.width;
    let height = canvas.height;

    // Handle resizing context
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        const size = Math.min(parent.clientWidth, 480);
        canvas.width = size;
        canvas.height = size;
        width = size;
        height = size;
      }
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    interface Point3D {
      x: number;
      y: number;
      z: number;
      isLand: boolean;
      color: string;
      size: number;
    }

    const points: Point3D[] = [];
    const totalPoints = 1500;
    const goldenRatio = (1 + Math.sqrt(5)) / 2;

    // Landmass check to draw a recognizable revolving Earth dot grid
    const isLandCoordinate = (lat: number, lon: number): { isLand: boolean; color: string; size: number } => {
      // 1. India and South Asia
      if (lat > 5 && lat < 38 && lon > 65 && lon < 98) {
        return { isLand: true, color: "#ea580c", size: 2.8 }; // Orange (Healix accent)
      }
      // 2. Rest of Asia
      if (lat > 8 && lat < 75 && lon > 35 && lon < 145) {
        return { isLand: true, color: "#4f46e5", size: 2.0 }; // Indigo
      }
      // 3. Europe
      if (lat > 35 && lat < 72 && lon > -12 && lon < 45) {
        return { isLand: true, color: "#4f46e5", size: 2.0 };
      }
      // 4. Africa
      if (lat > -35 && lat < 35 && lon > -20 && lon < 52) {
        return { isLand: true, color: "#4f46e5", size: 2.0 };
      }
      // 5. North America
      if (lat > 7 && lat < 75 && lon > -168 && lon < -52) {
        return { isLand: true, color: "#4f46e5", size: 2.0 };
      }
      // 6. South America
      if (lat > -56 && lat < 12 && lon > -85 && lon < -34) {
        return { isLand: true, color: "#4f46e5", size: 2.0 };
      }
      // 7. Australia
      if (lat > -42 && lat < -10 && lon > 112 && lon < 155) {
        return { isLand: true, color: "#ea580c", size: 2.4 };
      }
      // 8. Antarctica
      if (lat < -60) {
        return { isLand: true, color: "#94a3b8", size: 1.6 };
      }
      return { isLand: false, color: "#cbd5e1", size: 0.6 };
    };

    // Calculate spherical distribution
    for (let i = 0; i < totalPoints; i++) {
      const theta = 2 * Math.PI * i / goldenRatio;
      const phi = Math.acos(1 - 2 * (i + 0.5) / totalPoints);

      const x = Math.cos(theta) * Math.sin(phi);
      const y = Math.sin(theta) * Math.sin(phi);
      const z = Math.cos(phi);

      const lat = Math.asin(y) * 180 / Math.PI;
      const lon = Math.atan2(x, z) * 180 / Math.PI;

      const check = isLandCoordinate(lat, lon);
      if (check.isLand) {
        points.push({ x, y, z, isLand: true, color: check.color, size: check.size });
      } else {
        if (i % 6 === 0) {
          points.push({ x, y, z, isLand: false, color: "#94a3b8", size: 0.6 });
        }
      }
    }

    // Network Telemetry Hubs
    const hubs = [
      { name: "New Delhi", lat: 28.6, lon: 77.2, color: "#ea580c" },
      { name: "Bengaluru", lat: 12.9, lon: 77.5, color: "#ea580c" },
      { name: "Mumbai", lat: 19.0, lon: 72.8, color: "#ea580c" },
      { name: "Chennai", lat: 13.0, lon: 80.2, color: "#ea580c" },
      { name: "London", lat: 51.5, lon: -0.1, color: "#4f46e5" },
      { name: "New York", lat: 40.7, lon: -74.0, color: "#4f46e5" },
      { name: "Tokyo", lat: 35.6, lon: 139.6, color: "#4f46e5" },
      { name: "Sydney", lat: -33.8, lon: 151.2, color: "#4f46e5" }
    ].map(h => {
      const latRad = h.lat * Math.PI / 180;
      const lonRad = h.lon * Math.PI / 180;
      return {
        name: h.name,
        x: Math.cos(latRad) * Math.sin(lonRad),
        y: Math.sin(latRad),
        z: Math.cos(latRad) * Math.cos(lonRad),
        color: h.color
      };
    });

    let angleY = 0;
    const angleX = 0.32; // Earth tilt coordinate axis

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const radius = width * 0.38;
      const centerX = width / 2;
      const centerY = height / 2;
      const focalLength = width * 0.9;

      angleY += 0.003; // Rotation Speed

      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);
      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);

      // Atmospheric Glow Sphere Background
      const glowGrad = ctx.createRadialGradient(centerX, centerY, radius - 15, centerX, centerY, radius + 35);
      glowGrad.addColorStop(0, "rgba(99, 102, 241, 0.0)");
      glowGrad.addColorStop(0.4, "rgba(99, 102, 241, 0.02)");
      glowGrad.addColorStop(0.75, "rgba(234, 88, 12, 0.06)");
      glowGrad.addColorStop(0.9, "rgba(99, 102, 241, 0.1)");
      glowGrad.addColorStop(1.0, "rgba(99, 102, 241, 0.0)");
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius + 35, 0, 2 * Math.PI);
      ctx.fill();

      // Rotate and Project Hubs
      const projectedHubs = hubs.map(h => {
        const x1 = h.x * cosY - h.z * sinY;
        const z1 = h.x * sinY + h.z * cosY;
        const y1 = h.y;

        const y2 = y1 * cosX - z1 * sinX;
        const z2 = y1 * sinX + z1 * cosX;
        const x2 = x1;

        const zDepth = z2 * radius;
        const scale = focalLength / (focalLength + zDepth);
        const projX = centerX + x2 * radius * scale;
        const projY = centerY + y2 * radius * scale;

        return { x: projX, y: projY, z: z2, name: h.name, color: h.color };
      });

      // Draw global network connections
      projectedHubs.forEach((h1, idx) => {
        if (h1.z < -0.1) return;
        projectedHubs.forEach((h2, idx2) => {
          if (idx2 <= idx) return;
          if (h2.z < -0.1) return;

          const isIndia = (h1.name === "New Delhi" || h1.name === "Bengaluru" || h1.name === "Mumbai" || h1.name === "Chennai");
          const shouldConnect = (isIndia && (h2.name === "London" || h2.name === "New York" || h2.name === "Tokyo" || h2.name === "Sydney")) ||
                                (h1.name === "New Delhi" && (h2.name === "Bengaluru" || h2.name === "Mumbai" || h2.name === "Chennai"));

          if (shouldConnect) {
            ctx.beginPath();
            ctx.moveTo(h1.x, h1.y);

            const midX = (h1.x + h2.x) / 2;
            const midY = (h1.y + h2.y) / 2;
            const dx = h2.x - h1.x;
            const dy = h2.y - h1.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            const flex = dist * 0.18;
            const ctrlX = midX - (dy / dist) * flex;
            const ctrlY = midY + (dx / dist) * flex;

            ctx.quadraticCurveTo(ctrlX, ctrlY, h2.x, h2.y);

            const strokeGrad = ctx.createLinearGradient(h1.x, h1.y, h2.x, h2.y);
            strokeGrad.addColorStop(0, "rgba(234, 88, 12, 0.35)");
            strokeGrad.addColorStop(0.5, "rgba(99, 102, 241, 0.5)");
            strokeGrad.addColorStop(1, "rgba(234, 88, 12, 0.35)");

            ctx.strokeStyle = strokeGrad;
            ctx.lineWidth = 1.0;
            ctx.globalAlpha = Math.min(h1.z, h2.z) * 0.8;
            ctx.stroke();
            ctx.globalAlpha = 1.0;
          }
        });
      });

      // Map Points
      const renderedPoints = points.map(pt => {
        const x1 = pt.x * cosY - pt.z * sinY;
        const z1 = pt.x * sinY + pt.z * cosY;
        const y1 = pt.y;

        const y2 = y1 * cosX - z1 * sinX;
        const z2 = y1 * sinX + z1 * cosX;
        const x2 = x1;

        const zDepth = z2 * radius;
        const scale = focalLength / (focalLength + zDepth);
        const projX = centerX + x2 * radius * scale;
        const projY = centerY + y2 * radius * scale;

        return {
          x: projX,
          y: projY,
          zDepth: zDepth,
          z: z2,
          color: pt.color,
          size: pt.size * scale,
          isLand: pt.isLand
        };
      }).sort((a, b) => a.zDepth - b.zDepth);

      // Render points (Painter's algorithm)
      renderedPoints.forEach(p => {
        const opacity = (p.z + 1) / 2 * 0.75 + 0.15;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, 2 * Math.PI);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = opacity;
        ctx.fill();
      });

      ctx.globalAlpha = 1.0;

      // Draw pulses on active nodes
      projectedHubs.forEach(h => {
        if (h.z < 0) return;

        const pulse = 1 + Math.sin(Date.now() * 0.005) * 0.25;

        ctx.beginPath();
        ctx.arc(h.x, h.y, 4 * scaleMultiplier(h.z), 0, 2 * Math.PI);
        ctx.fillStyle = h.color;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(h.x, h.y, 8 * pulse * scaleMultiplier(h.z), 0, 2 * Math.PI);
        ctx.strokeStyle = h.color;
        ctx.lineWidth = 0.8;
        ctx.globalAlpha = 0.4 * (2 - pulse);
        ctx.stroke();

        ctx.globalAlpha = 0.75;
        ctx.fillStyle = "#1e293b";
        ctx.font = "bold 9px monospace";
        ctx.fillText(h.name, h.x + 6, h.y + 3);
        ctx.globalAlpha = 1.0;
      });

      function scaleMultiplier(z: number) {
        const zDepth = z * radius;
        return focalLength / (focalLength + zDepth);
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <div className="w-full flex items-center justify-center p-2 relative">
      <canvas ref={canvasRef} className="max-w-full aspect-square relative z-10" />
      {/* Dynamic graphic background ring */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-25 scale-105">
        <svg viewBox="0 0 100 100" fill="none" className="w-[85%] h-[85%] stroke-[#ea580c] stroke-[0.25] animate-spin" style={{ animationDuration: '30s' }}>
          <circle cx="50" cy="50" r="48" strokeDasharray="5 5" />
          <circle cx="50" cy="50" r="44" strokeDasharray="1 3" />
        </svg>
      </div>
    </div>
  );
}

function EngineeringLogo({ eng }: { eng: any }) {
  const [failed, setFailed] = useState(false);
  const logoSrc = eng.logo_url || eng.logo;
  return (
    <div className="w-16 h-16 border border-slate-200/80 bg-white flex flex-col items-center justify-center rounded-xl shadow-sm relative group overflow-hidden mb-5">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.01)_0%,transparent_70%)]" />
      {logoSrc && !failed ? (
        <img 
          src={logoSrc} 
          alt={eng.name} 
          referrerPolicy="no-referrer"
          className="w-11 h-11 object-contain p-1 relative z-10"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-[#ea580c] text-white font-mono font-black text-xs uppercase">
          {eng.fallback_text || eng.fallbackText}
        </div>
      )}
    </div>
  );
}

export default function GlobalNetworkPage() {
  const [professionals, setProfessionals] = useState<any[]>([]);
  const [loadingProfs, setLoadingProfs] = useState(true);

  // Dynamic states for Facilities and Engineers
  const [facilities, setFacilities] = useState<any[]>([]);
  const [engineers, setEngineers] = useState<any[]>([]);
  const [loadingFac, setLoadingFac] = useState(true);
  const [loadingEng, setLoadingEng] = useState(true);

  // Cinematic Institutional Section State
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const slideTimer = useRef<NodeJS.Timeout | null>(null);

  // Load all dynamic data from server
  useEffect(() => {
    const fetchProfs = async () => {
      try {
        const res = await fetch("/api/professionals");
        if (res.ok) {
          const data = await res.json();
          setProfessionals(data);
        }
      } catch (err) {
        console.error("Failed to load healthcare professionals:", err);
      } finally {
        setLoadingProfs(false);
      }
    };

    const fetchFacilities = async () => {
      try {
        const res = await fetch("/api/facilities");
        if (res.ok) {
          const data = await res.json();
          setFacilities(data);
        } else {
          setFacilities(INSTITUTIONS);
        }
      } catch (err) {
        console.error("Failed to load facilities:", err);
        setFacilities(INSTITUTIONS);
      } finally {
        setLoadingFac(false);
      }
    };

    const fetchEngineers = async () => {
      try {
        const res = await fetch("/api/engineers");
        if (res.ok) {
          const data = await res.json();
          setEngineers(data);
        } else {
          setEngineers(ENGINEERING_INSTITUTIONS);
        }
      } catch (err) {
        console.error("Failed to load engineers:", err);
        setEngineers(ENGINEERING_INSTITUTIONS);
      } finally {
        setLoadingEng(false);
      }
    };

    fetchProfs();
    fetchFacilities();
    fetchEngineers();
  }, []);

  const activeFacilities = facilities.length > 0 ? facilities : INSTITUTIONS;
  const activeEngineers = engineers.length > 0 ? engineers : ENGINEERING_INSTITUTIONS;

  // Auto-Rotation slide effect for BioLabs Showcase
  useEffect(() => {
    if (isPlaying && activeFacilities.length > 1) {
      slideTimer.current = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % activeFacilities.length);
      }, 6000);
    }
    return () => {
      if (slideTimer.current) clearInterval(slideTimer.current);
    };
  }, [isPlaying, activeFacilities]);

  const handleNextSlide = () => {
    setIsPlaying(false);
    setActiveIndex((prev) => (prev + 1) % activeFacilities.length);
  };

  const handlePrevSlide = () => {
    setIsPlaying(false);
    setActiveIndex((prev) => (prev - 1 + activeFacilities.length) % activeFacilities.length);
  };

  const currentInstitution = activeFacilities[activeIndex] || activeFacilities[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/20 to-orange-50/30 text-slate-800 selection:bg-[#ea580c]/10 py-20 overflow-x-hidden font-sans">
      
      {/* Background visual details (Subtle grids and colored blurs) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.015)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.06)_0%,transparent_50%)] pointer-events-none" />
      
      <div className="fixed -top-40 -right-40 w-[450px] h-[450px] rounded-full bg-orange-200/25 blur-3xl pointer-events-none" />
      <div className="fixed top-1/2 -left-40 w-[450px] h-[450px] rounded-full bg-indigo-200/20 blur-3xl pointer-events-none" />
      
      <div className="max-w-[94%] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-24">
        
        {/* HEADER SECTION - 2-Column Design with SVGs on Left and 3D Globe on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pt-8 pb-4">
          
          {/* Left Column: Typographic detail + connection SVGs */}
          <div className="lg:col-span-7 text-left space-y-6 relative">
            
            {/* Background SVG decorative net */}
            <div className="absolute -left-8 -top-8 w-32 h-32 opacity-25 pointer-events-none select-none">
              <svg viewBox="0 0 100 100" fill="none" className="w-full h-full stroke-orange-500/40 stroke-[0.5] animate-pulse">
                <circle cx="50" cy="50" r="40" strokeDasharray="3 3" />
                <circle cx="50" cy="50" r="25" />
                <line x1="50" y1="10" x2="50" y2="90" />
                <line x1="10" y1="50" x2="90" y2="50" />
                <circle cx="50" cy="10" r="1.8" fill="#ea580c" />
                <circle cx="50" cy="90" r="1.8" fill="#ea580c" />
                <circle cx="10" cy="50" r="1.8" fill="#ea580c" />
                <circle cx="90" cy="50" r="1.8" fill="#ea580c" />
              </svg>
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-orange-500/20 bg-orange-500/10">
              <Globe className="h-4 w-4 text-[#ea580c]" />
              <span className="text-[10px] font-mono text-[#ea580c] uppercase tracking-widest font-bold">Collaborative Network</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black font-mono uppercase tracking-tight leading-none bg-gradient-to-br from-slate-900 via-indigo-950 to-orange-700 bg-clip-text text-transparent">
              Global <br />
              <span className="text-[#ea580c] relative inline-block mt-1">
                Network
                <span className="absolute bottom-2 left-0 w-full h-3 bg-orange-500/15 rounded-md -z-10" />
              </span>
            </h1>

            <p className="text-slate-600 text-sm md:text-base leading-relaxed max-w-xl">
              Connecting Healix's medical diagnostic systems, distributed edge telemetry, and genomic accelerator pipelines with premium clinical professionals and research institutions across India.
            </p>

            {/* Quick stats elements */}
            <div className="flex flex-wrap gap-4 pt-2">
              <div className="bg-white/70 backdrop-blur-md border border-slate-200/80 px-4 py-3 rounded-xl shadow-sm flex items-center gap-3">
                <Building2 className="w-5 h-5 text-indigo-600" />
                <div>
                  <p className="text-[10px] font-mono uppercase font-bold text-slate-400">Compute Hubs</p>
                  <p className="text-sm font-bold text-slate-800">5 Premier Institutes</p>
                </div>
              </div>
              <div className="bg-white/70 backdrop-blur-md border border-slate-200/80 px-4 py-3 rounded-xl shadow-sm flex items-center gap-3">
                <Cpu className="w-5 h-5 text-orange-600" />
                <div>
                  <p className="text-[10px] font-mono uppercase font-bold text-slate-400">Hardware Nodes</p>
                  <p className="text-sm font-bold text-slate-800">4 Specializations</p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Revolving 3D Earth (canvas representation) */}
          <div className="lg:col-span-5 flex items-center justify-center relative min-h-[350px]">
            <RevolveGlobe />
          </div>

        </div>

        {/* SECTION 1: HEALTHCARE PROFESSIONALS (Bright Mode Update) */}
        <div>
          <div className="flex items-end justify-between border-b border-slate-200 pb-4 mb-10">
            <div>
              <p className="text-[10px] font-mono text-[#ea580c] uppercase tracking-widest font-bold flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-[#ea580c]" /> Medical Board
              </p>
              <h2 className="text-xl md:text-3xl font-black font-mono uppercase mt-1 text-slate-900">Healthcare Professionals</h2>
            </div>
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider hidden sm:block">
              Server-Verified Registry
            </span>
          </div>

          {loadingProfs ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-10 h-10 border-2 border-orange-500/20 border-t-[#ea580c] rounded-full animate-spin mb-3" />
              <p className="text-slate-400 text-xs font-mono uppercase tracking-widest">Accessing Professional Registry...</p>
            </div>
          ) : professionals.length === 0 ? (
            <div className="text-center py-16 bg-white/50 border border-slate-200/60 rounded-2xl">
              <User className="w-8 h-8 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-mono text-slate-500 uppercase font-bold">No Professionals Registered</p>
              <p className="text-xs text-slate-400 mt-1">Please register professionals in the admin panel.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {professionals.map((p, idx) => (
                <GlassCard 
                  key={p.id || idx} 
                  className="p-6 flex flex-col justify-between border border-slate-250/60 bg-white/70 backdrop-blur-md rounded-2xl shadow-md hover:border-[#ea580c]/30 hover:shadow-lg hover:shadow-slate-200/50 hover:-translate-y-1 transition-all group duration-300"
                >
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl border border-slate-200 bg-white overflow-hidden relative shrink-0 shadow-inner">
                        {p.photo_url ? (
                          <img src={p.photo_url} alt={p.name} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#ea580c] font-black text-xl bg-orange-500/5">{p.name?.[0]}</div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-mono text-[#ea580c] uppercase font-bold tracking-wider">{p.role}</p>
                        <h3 className="text-base font-bold text-slate-800 uppercase truncate font-mono mt-0.5">{p.name}</h3>
                        <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wide truncate flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-[#ea580c]" /> {p.institution}
                        </p>
                      </div>
                    </div>
                    <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                      <p className="text-xs text-slate-600 leading-relaxed font-sans line-clamp-4">
                        {p.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100 text-[10px] font-mono text-slate-450">
                    <span className="uppercase font-bold tracking-widest flex items-center gap-1 text-emerald-600">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" /> Active Consultant
                    </span>
                    <span className="uppercase tracking-wider">Node Verified</span>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}
        </div>

        {/* SECTION 2: BIOLABS RESEARCH FACILITIES (Redesigned as Full Width, Left side removed) */}
        <div>
          <div className="flex items-end justify-between border-b border-slate-200 pb-4 mb-10">
            <div>
              <p className="text-[10px] font-mono text-[#ea580c] uppercase tracking-widest font-bold flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-[#ea580c]" /> BioLabs Subsystems
              </p>
              <h2 className="text-xl md:text-3xl font-black font-mono uppercase mt-1 text-slate-900">Research Facilities</h2>
            </div>
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider hidden sm:block">
              Interactive BioLabs Showcase
            </span>
          </div>

          {/* Full Width Cinematic Showcase Frame */}
          <div className="col-span-12 relative rounded-2xl overflow-hidden border border-slate-200/80 bg-slate-950 shadow-xl flex flex-col justify-end min-h-[580px] group/showcase">
            
            {/* Top floating pill selectors */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 flex flex-wrap justify-center gap-1.5 p-1.5 bg-black/45 backdrop-blur-md rounded-full border border-white/10 max-w-[92%] shadow-lg">
              {activeFacilities.map((inst, idx) => {
                const isActive = idx === activeIndex;
                return (
                  <button
                    key={inst.id}
                    onClick={() => {
                      setIsPlaying(false);
                      setActiveIndex(idx);
                    }}
                    className={`px-4 py-2 rounded-full text-[10px] font-mono font-bold uppercase transition-all duration-300 cursor-pointer ${
                      isActive 
                        ? "bg-[#ea580c] text-white shadow-md" 
                        : "text-zinc-300 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {inst.name}
                  </button>
                );
              })}
            </div>

            {/* Left navigation arrow */}
            <button 
              onClick={handlePrevSlide}
              className="absolute left-6 top-1/2 -translate-y-1/2 z-20 p-3.5 rounded-full bg-black/35 hover:bg-black/55 backdrop-blur-md border border-white/10 text-white opacity-0 group-hover/showcase:opacity-100 transition-opacity duration-300 cursor-pointer shadow-lg"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Right navigation arrow */}
            <button 
              onClick={handleNextSlide}
              className="absolute right-6 top-1/2 -translate-y-1/2 z-20 p-3.5 rounded-full bg-black/35 hover:bg-black/55 backdrop-blur-md border border-white/10 text-white opacity-0 group-hover/showcase:opacity-100 transition-opacity duration-300 cursor-pointer shadow-lg"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Institution image backdrop container */}
            <div className="absolute inset-0 z-0">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentInstitution.id}
                  src={currentInstitution.image_url || currentInstitution.image}
                  alt={currentInstitution.name}
                  referrerPolicy="no-referrer"
                  initial={{ opacity: 0, scale: 1.06 }}
                  animate={{ opacity: 0.6, scale: 1.01 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.0, ease: "easeOut" }}
                  className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
                />
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_0%,rgba(0,0,0,0.75)_95%)] pointer-events-none" />
            </div>

            {/* Content Details Overlay */}
            <div className="relative z-10 p-8 sm:p-10 space-y-6 max-w-5xl text-left">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[10px] font-mono font-bold tracking-wider text-[#ea580c] uppercase">
                  <MapPin className="w-3.5 h-3.5" /> {currentInstitution.city}
                  <span>•</span>
                  <Activity className="w-3.5 h-3.5 animate-pulse" /> Facility Active
                </div>
                <h3 className="text-3xl md:text-5xl font-mono font-black uppercase text-white tracking-tight">{currentInstitution.name}</h3>
                <p className="text-xs font-mono text-zinc-400 uppercase tracking-widest">{currentInstitution.facility}</p>
              </div>

              <p className="text-zinc-200 text-xs md:text-sm leading-relaxed max-w-3xl font-sans">
                {currentInstitution.description}
              </p>

              {/* Sub Section: Mentors */}
              {currentInstitution.mentors && currentInstitution.mentors.length > 0 && (
                <div className="border-t border-white/10 pt-5">
                  <p className="text-[10px] font-mono text-[#ea580c] uppercase tracking-widest font-bold mb-4">Affiliated Mentors & Researchers</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl">
                    {currentInstitution.mentors.map((m: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-3 bg-white/5 border border-white/10 p-3 rounded-xl hover:bg-white/10 transition-colors">
                        <div className="w-10 h-10 rounded-lg overflow-hidden border border-white/10 shrink-0 bg-zinc-800">
                          <img src={m.photo_url || m.photo} alt={m.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-xs text-white uppercase font-mono truncate">{m.name}</h4>
                          <p className="text-[9px] text-zinc-400 truncate mt-0.5">{m.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Active BioLabs Research Projects */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5 items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {currentInstitution.projects?.map((proj: string, idx: number) => (
                    <span key={idx} className="px-2.5 py-1 bg-[#ea580c]/20 border border-[#ea580c]/30 text-[#ea580c] font-mono text-[9px] font-bold uppercase tracking-wider rounded">
                      {proj}
                    </span>
                  ))}
                </div>

                {/* Autoplay & progress dots */}
                <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 mt-3 sm:mt-0">
                  <button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="text-zinc-300 hover:text-white transition-colors cursor-pointer"
                  >
                    {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                  </button>
                  <div className="flex items-center gap-1.5">
                    {activeFacilities.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setIsPlaying(false);
                          setActiveIndex(idx);
                        }}
                        className={`w-1.5 h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                          idx === activeIndex ? "bg-[#ea580c] w-3.5" : "bg-zinc-500 hover:bg-zinc-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>

        {/* SECTION 3: ENGINEERS SECTION (Updated with Bright Mode styles) */}
        <div>
          <div className="flex items-end justify-between border-b border-slate-200 pb-4 mb-10">
            <div>
              <p className="text-[10px] font-mono text-[#ea580c] uppercase tracking-widest font-bold flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-[#ea580c]" /> Technical Infrastructure
              </p>
              <h2 className="text-xl md:text-3xl font-black font-mono uppercase mt-1 text-slate-900">Engineers Section</h2>
            </div>
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider hidden sm:block">
              Distributed Hardware Nodes
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {activeEngineers.map((eng, idx) => (
              <GlassCard 
                key={idx} 
                className="p-6 bg-white/70 backdrop-blur-md border border-slate-200/80 rounded-2xl flex flex-col justify-between min-h-[220px] hover:border-indigo-400 hover:shadow-lg hover:shadow-slate-200/40 transition-all group cursor-pointer"
              >
                <EngineeringLogo eng={eng} />

                <div>
                  <h3 className="font-mono text-sm font-bold uppercase text-slate-800 group-hover:text-[#ea580c] transition-colors">{eng.name}</h3>
                  <p className="text-xs text-[#ea580c] font-mono uppercase font-bold mt-1 tracking-wider">{eng.team_name || eng.teamName}</p>
                  <p className="text-[10px] text-slate-500 leading-relaxed mt-2.5 font-sans">
                    {eng.specialization}
                  </p>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

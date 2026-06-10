"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";

/* ─────────────────────────────────────────────────────────
   LATENCY LOGO
───────────────────────────────────────────────────────── */
function LatencyLogo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizes = { sm: "text-lg tracking-[0.4em]", md: "text-2xl tracking-[0.5em]", lg: "text-5xl tracking-[0.6em]" };
  return (
    <span className={`font-black text-white font-mono uppercase select-none ${sizes[size]}`}>
      LATENCY
    </span>
  );
}

/* ─────────────────────────────────────────────────────────
   DEEP SPACE CANVAS — stars + orbital rings + Earth glow
───────────────────────────────────────────────────────── */
function DeepSpaceCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = window.innerWidth, H = window.innerHeight;
    canvas.width = W; canvas.height = H;

    // Stars
    const stars = Array.from({ length: 400 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 1.2 + 0.2,
      speed: Math.random() * 0.04 + 0.01,
      alpha: Math.random() * 0.7 + 0.3,
      twinkleSpeed: Math.random() * 0.008 + 0.003,
      twinkleOffset: Math.random() * Math.PI * 2,
    }));

    // Orbital particles
    const orbitals = Array.from({ length: 3 }, (_, i) => ({
      cx: W * 0.72, cy: H * 0.5,
      rx: 180 + i * 90, ry: 60 + i * 30,
      angle: Math.random() * Math.PI * 2,
      speed: 0.0004 + i * 0.0002,
      dotCount: 2 + i,
    }));

    let t = 0;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      // Void background
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, W, H);

      // Nebula glow — far left
      const neb = ctx.createRadialGradient(W * 0.05, H * 0.3, 0, W * 0.05, H * 0.3, W * 0.45);
      neb.addColorStop(0, "rgba(0,60,140,0.08)");
      neb.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = neb;
      ctx.fillRect(0, 0, W, H);

      // Stars
      stars.forEach(s => {
        const alpha = s.alpha * (0.6 + 0.4 * Math.sin(t * s.twinkleSpeed + s.twinkleOffset));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.fill();
      });

      // Earth glow on right side
      const earthX = W * 0.72, earthY = H * 0.5;
      const earthR = Math.min(W, H) * 0.18;

      // Atmosphere halo
      const atmo = ctx.createRadialGradient(earthX, earthY, earthR * 0.85, earthX, earthY, earthR * 1.5);
      atmo.addColorStop(0, "rgba(0,80,200,0.18)");
      atmo.addColorStop(0.5, "rgba(0,40,120,0.06)");
      atmo.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = atmo;
      ctx.beginPath();
      ctx.arc(earthX, earthY, earthR * 1.5, 0, Math.PI * 2);
      ctx.fill();

      // Earth body
      const earthGrad = ctx.createRadialGradient(earthX - earthR * 0.25, earthY - earthR * 0.25, 0, earthX, earthY, earthR);
      earthGrad.addColorStop(0, "#1a4fa0");
      earthGrad.addColorStop(0.35, "#0a2d7a");
      earthGrad.addColorStop(0.65, "#061a4a");
      earthGrad.addColorStop(1, "#020b22");
      ctx.beginPath();
      ctx.arc(earthX, earthY, earthR, 0, Math.PI * 2);
      ctx.fillStyle = earthGrad;
      ctx.fill();

      // Earth continent-like patches
      ctx.save();
      ctx.beginPath();
      ctx.arc(earthX, earthY, earthR, 0, Math.PI * 2);
      ctx.clip();
      const patches = [
        { x: -0.1, y: -0.2, w: 0.3, h: 0.25 },
        { x: 0.15, y: 0.05, w: 0.2, h: 0.3 },
        { x: -0.3, y: 0.1, w: 0.15, h: 0.2 },
      ];
      patches.forEach(p => {
        ctx.beginPath();
        ctx.ellipse(earthX + p.x * earthR, earthY + p.y * earthR, p.w * earthR, p.h * earthR, Math.PI * 0.3, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(16,80,40,0.45)";
        ctx.fill();
      });
      ctx.restore();

      // Terminator shadow (night side)
      const termGrad = ctx.createRadialGradient(earthX + earthR * 0.3, earthY, 0, earthX + earthR * 0.3, earthY, earthR * 1.1);
      termGrad.addColorStop(0, "rgba(0,0,0,0)");
      termGrad.addColorStop(0.5, "rgba(0,0,0,0.15)");
      termGrad.addColorStop(1, "rgba(0,0,0,0.7)");
      ctx.beginPath();
      ctx.arc(earthX, earthY, earthR, 0, Math.PI * 2);
      ctx.fillStyle = termGrad;
      ctx.fill();

      // Orbital rings
      orbitals.forEach(orb => {
        // Ring itself
        ctx.save();
        ctx.translate(orb.cx, orb.cy);
        ctx.rotate(-0.25);
        ctx.beginPath();
        ctx.ellipse(0, 0, orb.rx, orb.ry, 0, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(0,102,255,0.12)";
        ctx.lineWidth = 1;
        ctx.stroke();

        // Moving dots on ring
        for (let d = 0; d < orb.dotCount; d++) {
          const angle = orb.angle + t * orb.speed + (d * Math.PI * 2) / orb.dotCount;
          const dx = Math.cos(angle) * orb.rx;
          const dy = Math.sin(angle) * orb.ry;
          ctx.beginPath();
          ctx.arc(dx, dy, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(0,140,255,0.8)";
          ctx.fill();
          // Trail
          for (let tr = 1; tr <= 6; tr++) {
            const ta = angle - tr * 0.04;
            const tx = Math.cos(ta) * orb.rx;
            const ty = Math.sin(ta) * orb.ry;
            ctx.beginPath();
            ctx.arc(tx, ty, 2.5 * (1 - tr / 7), 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0,120,255,${0.5 * (1 - tr / 7)})`;
            ctx.fill();
          }
        }
        ctx.restore();
      });

      t++;
      rafRef.current = requestAnimationFrame(draw);
    };

    draw();

    const onResize = () => {
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = W; canvas.height = H;
    };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener("resize", onResize); };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}

/* ─────────────────────────────────────────────────────────
   NEURAL NETWORK CANVAS — cells transforming
───────────────────────────────────────────────────────── */
function NeuralCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let W = canvas.offsetWidth, H = canvas.offsetHeight;
    canvas.width = W; canvas.height = H;

    const nodes = Array.from({ length: 40 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 3 + 1.5,
    }));

    let t = 0;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      nodes.forEach(n => {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
      });
      // Connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(0,102,255,${0.25 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }
      // Nodes
      nodes.forEach(n => {
        const pulse = 0.5 + 0.5 * Math.sin(t * 0.03 + n.x);
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * (0.8 + 0.2 * pulse), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,120,255,${0.6 + 0.4 * pulse})`;
        ctx.fill();
      });
      t++;
      rafRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-40" />;
}

/* ─────────────────────────────────────────────────────────
   FADE-IN ON SCROLL HOOK
───────────────────────────────────────────────────────── */
function RevealText({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1.1, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function RevealLine({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60, filter: "blur(8px)" }}
      animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 1.4, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────
   PILLAR CARD
───────────────────────────────────────────────────────── */
function PillarCard({ title, body, index }: { title: string; body: string; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1, delay: index * 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="relative border border-white/10 p-10 group hover:border-[#0066FF]/60 transition-colors duration-500 bg-black/40"
    >
      <div className="absolute top-0 left-0 w-12 h-px bg-[#0066FF] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute top-0 left-0 w-px h-12 bg-[#0066FF] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <p className="text-[10px] font-mono text-[#0066FF] tracking-[0.4em] uppercase mb-6">0{index + 1}</p>
      <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-wider font-mono mb-4">{title}</h3>
      <p className="text-zinc-500 text-sm leading-relaxed">{body}</p>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────
   WHAT WE ARE BUILDING CARD
───────────────────────────────────────────────────────── */
function BuildCard({ title, body, index }: { title: string; body: string; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.9, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
      className="border border-white/8 bg-white/[0.02] p-8 hover:bg-white/[0.05] hover:border-[#0066FF]/30 transition-all duration-500 group"
    >
      <div className="w-8 h-px bg-[#0066FF] mb-6 group-hover:w-16 transition-all duration-500" />
      <h3 className="text-base font-black text-white uppercase tracking-widest font-mono mb-3">{title}</h3>
      <p className="text-zinc-500 text-sm leading-relaxed">{body}</p>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────
   MARS JOURNEY CANVAS
───────────────────────────────────────────────────────── */
function MarsCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let W = canvas.offsetWidth, H = canvas.offsetHeight;
    canvas.width = W; canvas.height = H;

    const stars = Array.from({ length: 300 }, () => ({
      x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.2 + 0.2, alpha: Math.random() * 0.8 + 0.2,
    }));

    let t = 0;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, W, H);

      stars.forEach(s => {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${s.alpha})`;
        ctx.fill();
      });

      // Earth (fading left)
      const earthAlpha = Math.max(0, 1 - t / 400);
      if (earthAlpha > 0) {
        const ex = W * 0.15, ey = H * 0.5, er = Math.min(W, H) * 0.12;
        const eg = ctx.createRadialGradient(ex - er * 0.2, ey - er * 0.2, 0, ex, ey, er);
        eg.addColorStop(0, `rgba(30,80,200,${earthAlpha})`);
        eg.addColorStop(0.6, `rgba(10,30,100,${earthAlpha})`);
        eg.addColorStop(1, `rgba(2,5,30,${earthAlpha})`);
        ctx.beginPath(); ctx.arc(ex, ey, er, 0, Math.PI * 2);
        ctx.fillStyle = eg; ctx.fill();
        // Atmosphere
        const atmo = ctx.createRadialGradient(ex, ey, er * 0.85, ex, ey, er * 1.4);
        atmo.addColorStop(0, `rgba(0,80,200,${earthAlpha * 0.2})`);
        atmo.addColorStop(1, `rgba(0,0,0,0)`);
        ctx.beginPath(); ctx.arc(ex, ey, er * 1.4, 0, Math.PI * 2);
        ctx.fillStyle = atmo; ctx.fill();
      }

      // Mars (appearing right)
      const marsAlpha = Math.min(1, t / 300);
      const mx = W * 0.82, my = H * 0.5, mr = Math.min(W, H) * 0.15;
      const mg = ctx.createRadialGradient(mx - mr * 0.25, my - mr * 0.25, 0, mx, my, mr);
      mg.addColorStop(0, `rgba(200,80,40,${marsAlpha})`);
      mg.addColorStop(0.5, `rgba(140,45,20,${marsAlpha})`);
      mg.addColorStop(1, `rgba(60,15,5,${marsAlpha})`);
      ctx.beginPath(); ctx.arc(mx, my, mr, 0, Math.PI * 2);
      ctx.fillStyle = mg; ctx.fill();
      // Mars dust shadow
      const mShadow = ctx.createRadialGradient(mx + mr * 0.3, my, 0, mx + mr * 0.3, my, mr * 1.2);
      mShadow.addColorStop(0, `rgba(0,0,0,0)`);
      mShadow.addColorStop(1, `rgba(0,0,0,${marsAlpha * 0.65})`);
      ctx.beginPath(); ctx.arc(mx, my, mr, 0, Math.PI * 2);
      ctx.fillStyle = mShadow; ctx.fill();

      // Journey line
      if (marsAlpha > 0.1) {
        const progress = Math.min(1, t / 300);
        const dotX = W * 0.15 + (W * 0.82 - W * 0.15) * progress;
        ctx.beginPath();
        ctx.setLineDash([4, 8]);
        ctx.moveTo(W * 0.15, H * 0.5);
        ctx.lineTo(dotX, H * 0.5);
        ctx.strokeStyle = `rgba(0,102,255,${marsAlpha * 0.4})`;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.arc(dotX, H * 0.5, 3, 0, Math.PI * 2);
        ctx.fillStyle = "#0066FF";
        ctx.fill();
      }

      t++;
      rafRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}

/* ═══════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════ */
export default function LatencyPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.12], [0, -60]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = ["Mission", "Technology", "Research", "Future", "Contact"];

  return (
    <div className="bg-black text-white overflow-x-hidden font-sans" style={{ fontFamily: "'Inter', 'SF Pro Display', system-ui, sans-serif" }}>

      {/* ──────────── NAV ──────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-black/90 backdrop-blur-xl border-b border-white/5" : "bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
          <LatencyLogo size="sm" />

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map(l => (
              <a key={l} href={`#${l.toLowerCase()}`}
                className="text-[11px] font-mono uppercase tracking-[0.25em] text-zinc-400 hover:text-white transition-colors duration-300">
                {l}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <a href="#final"
              className="hidden md:inline-flex items-center px-5 py-2 border border-white/20 hover:border-[#0066FF] hover:text-[#0066FF] text-[10px] font-mono uppercase tracking-[0.3em] transition-all duration-300">
              Join The Mission
            </a>
            <button onClick={() => setMenuOpen(o => !o)} className="md:hidden p-2">
              <div className="space-y-1.5">
                <div className={`w-6 h-px bg-white transition-all ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
                <div className={`w-6 h-px bg-white transition-all ${menuOpen ? "opacity-0" : ""}`} />
                <div className={`w-6 h-px bg-white transition-all ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-black border-t border-white/5 px-6 py-6 space-y-4">
              {navLinks.map(l => (
                <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setMenuOpen(false)}
                  className="block text-[12px] font-mono uppercase tracking-[0.3em] text-zinc-400 hover:text-white transition-colors py-2">
                  {l}
                </a>
              ))}
              <a href="#final" className="block text-[10px] font-mono uppercase tracking-[0.3em] text-[#0066FF] pt-2">Join The Mission →</a>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ──────────── HERO ──────────── */}
      <section id="mission" className="relative h-screen min-h-[700px] overflow-hidden">
        <DeepSpaceCanvas />

        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.7)_100%)]" />

        {/* Hero Content */}
        <motion.div style={{ opacity: heroOpacity, y: heroY }}
          className="absolute inset-0 flex flex-col items-start justify-center px-8 md:px-20 lg:px-28 max-w-4xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 1 }}
            className="text-[10px] font-mono text-[#0066FF] tracking-[0.5em] uppercase mb-8 flex items-center gap-3">
            <span className="w-8 h-px bg-[#0066FF] inline-block" />
            Powered by AVENNIX
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-6xl sm:text-8xl md:text-[9rem] font-black text-white uppercase tracking-tight font-mono leading-none mb-6">
            LATENCY
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 1 }}
            className="text-sm md:text-base font-mono text-zinc-400 uppercase tracking-[0.4em] mb-10">
            When Earth Is Too Far Away
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1, duration: 1 }}
            className="space-y-1 mb-12 max-w-sm">
            {["Humanity is preparing for a future beyond Earth.", "The challenge is no longer reaching space.", "The challenge is surviving there."].map((line, i) => (
              <p key={i} className="text-zinc-500 text-xs md:text-sm leading-relaxed">{line}</p>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3, duration: 1 }}
            className="flex items-center gap-6">
            <a href="#section1"
              className="group flex items-center gap-3 px-8 py-3.5 bg-[#0066FF] hover:bg-[#0052cc] text-white text-[11px] font-mono uppercase tracking-[0.3em] transition-all duration-300">
              Explore
              <span className="w-4 h-px bg-white group-hover:w-8 transition-all duration-300" />
            </a>
            <div className="flex flex-col gap-1">
              <span className="w-px h-8 bg-white/20 ml-2 animate-bounce" />
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <p className="text-[9px] font-mono text-white/20 uppercase tracking-[0.4em]">Scroll</p>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }} className="w-px h-10 bg-gradient-to-b from-white/30 to-transparent" />
        </motion.div>
      </section>

      {/* ──────────── SECTION 1: 225M KM ──────────── */}
      <section id="section1" className="relative bg-black py-40 md:py-60 px-6">
        <div className="max-w-5xl mx-auto space-y-24 md:space-y-40 text-center">
          {[
            { text: "225 Million Kilometers.", delay: 0 },
            { text: "20 Minutes.", delay: 0 },
            { text: "Zero Immediate Help.", delay: 0 },
          ].map((item, i) => (
            <RevealLine key={i} delay={0} className="">
              <p className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-white font-mono leading-none">
                {item.text}
              </p>
            </RevealLine>
          ))}

          <RevealLine delay={0}>
            <p className="text-xl sm:text-2xl md:text-3xl font-light text-zinc-400 leading-relaxed max-w-3xl mx-auto">
              What Happens When A Medical Emergency Occurs On Mars?
            </p>
          </RevealLine>
        </div>
      </section>

      {/* ──────────── SECTION 2: DISTANCE ──────────── */}
      <section id="technology" className="relative min-h-screen bg-black overflow-hidden">
        {/* Astronaut silhouette */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <svg viewBox="0 0 400 600" className="h-full max-h-screen opacity-[0.04]" fill="white">
            <ellipse cx="200" cy="100" rx="70" ry="80" />
            <rect x="130" y="170" width="140" height="200" rx="30" />
            <rect x="60" y="180" width="70" height="140" rx="20" />
            <rect x="270" y="180" width="70" height="140" rx="20" />
            <rect x="140" y="360" width="55" height="160" rx="20" />
            <rect x="205" y="360" width="55" height="160" rx="20" />
            <ellipse cx="200" cy="100" rx="55" ry="65" fill="black" />
            <ellipse cx="200" cy="105" rx="35" ry="40" fill="rgba(0,102,255,0.3)" />
          </svg>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-10 py-40 md:py-60 flex flex-col justify-center min-h-screen">
          <RevealText className="mb-6">
            <p className="text-[10px] font-mono text-[#0066FF] tracking-[0.5em] uppercase mb-4 flex items-center gap-3">
              <span className="w-8 h-px bg-[#0066FF]" />
              02 / Distance
            </p>
          </RevealText>

          <RevealText delay={0.1}>
            <h2 className="text-5xl sm:text-7xl md:text-8xl font-black text-white uppercase font-mono leading-none tracking-tighter mb-12">
              Distance<br />Changes<br />Everything
            </h2>
          </RevealText>

          <RevealText delay={0.2}>
            <div className="max-w-xl space-y-5 border-l border-[#0066FF]/30 pl-8">
              <p className="text-zinc-400 text-base leading-relaxed">
                In deep space, communication delays make real-time support impossible.
              </p>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Future explorers must rely on intelligent systems capable of operating autonomously — systems that don't wait for Earth to respond.
              </p>
            </div>
          </RevealText>
        </div>
      </section>

      {/* ──────────── SECTION 3: BIOLOGY ──────────── */}
      <section id="research" className="relative min-h-screen bg-black overflow-hidden">
        <NeuralCanvas />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-10 py-40 md:py-60 flex flex-col justify-center min-h-screen">
          <RevealText className="mb-6">
            <p className="text-[10px] font-mono text-[#0066FF] tracking-[0.5em] uppercase mb-4 flex items-center gap-3">
              <span className="w-8 h-px bg-[#0066FF]" />
              03 / Biology
            </p>
          </RevealText>

          <RevealText delay={0.1}>
            <h2 className="text-5xl sm:text-7xl md:text-8xl font-black text-white uppercase font-mono leading-none tracking-tighter mb-12">
              Biology<br />Must<br />Evolve
            </h2>
          </RevealText>

          <RevealText delay={0.2}>
            <div className="max-w-xl space-y-5 border-l border-[#0066FF]/30 pl-8">
              <p className="text-zinc-400 text-base leading-relaxed">
                The next era of exploration requires new approaches to health, performance, and survival.
              </p>
              <p className="text-zinc-500 text-sm leading-relaxed">
                LATENCY is building autonomous technologies for human life beyond Earth. Systems that think, adapt, and act — without waiting for a signal from home.
              </p>
            </div>
          </RevealText>
        </div>
      </section>

      {/* ──────────── SECTION 4: THREE PILLARS ──────────── */}
      <section className="relative bg-black py-32 md:py-48 px-6">
        <div className="max-w-6xl mx-auto">
          <RevealLine className="text-center mb-24">
            <h2 className="text-5xl sm:text-7xl md:text-9xl font-black text-white uppercase font-mono leading-none tracking-tighter">
              The Future<br />of Survival
            </h2>
          </RevealLine>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5">
            {[
              { title: "Autonomous Medicine", body: "Healthcare when Earth cannot respond. Intelligent systems that diagnose, decide, and act." },
              { title: "Human Performance", body: "Understanding the limits of human physiology. Pushing them further. Building resilience for extreme environments." },
              { title: "Biological Intelligence", body: "Predicting health before symptoms appear. A living model of the human body, always learning." },
            ].map((p, i) => (
              <PillarCard key={i} {...p} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ──────────── SECTION 5: GENESIS ──────────── */}
      <section id="future" className="relative min-h-screen bg-black overflow-hidden flex items-center">
        {/* Digital human glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative w-[400px] h-[500px]">
            <motion.div
              animate={{ scale: [1, 1.04, 1], opacity: [0.06, 0.12, 0.06] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 bg-[#0066FF] rounded-full blur-[100px]"
            />
            <svg viewBox="0 0 300 420" className="w-full h-full opacity-[0.07]" fill="none" stroke="rgba(0,102,255,0.8)" strokeWidth="1">
              <ellipse cx="150" cy="70" rx="50" ry="55" />
              <line x1="150" y1="125" x2="150" y2="280" />
              <line x1="80" y1="160" x2="220" y2="160" />
              <line x1="150" y1="280" x2="95" y2="420" />
              <line x1="150" y1="280" x2="205" y2="420" />
              {Array.from({ length: 12 }, (_, i) => (
                <line key={i} x1="80" y1={140 + i * 12} x2="220" y2={140 + i * 12} strokeOpacity="0.3" strokeWidth="0.5" />
              ))}
            </svg>
          </div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-10 py-40 w-full">
          <RevealText className="mb-4">
            <p className="text-[10px] font-mono text-[#0066FF] tracking-[0.5em] uppercase flex items-center gap-3">
              <span className="w-8 h-px bg-[#0066FF]" />
              05 / Genesis
            </p>
          </RevealText>

          <RevealText delay={0.1}>
            <h2 className="text-6xl sm:text-8xl md:text-[9rem] font-black text-white uppercase font-mono leading-none tracking-tighter mb-4">
              GENESIS
            </h2>
          </RevealText>

          <RevealText delay={0.2}>
            <p className="text-lg font-mono text-[#0066FF] tracking-widest mb-10">The Biological Operating System.</p>
          </RevealText>

          <RevealText delay={0.3}>
            <div className="max-w-xl space-y-4 border-l border-[#0066FF]/30 pl-8">
              <p className="text-zinc-400 text-base leading-relaxed">
                A continuously evolving model of human health capable of predicting risks, optimizing performance, and supporting autonomous decision-making.
              </p>
              <p className="text-[10px] font-mono text-zinc-600 tracking-[0.4em] uppercase mt-4">Powered by AVENNIX</p>
            </div>
          </RevealText>
        </div>
      </section>

      {/* ──────────── SECTION 6: WHAT WE ARE BUILDING ──────────── */}
      <section className="relative bg-black py-32 md:py-48 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <RevealText className="mb-20">
            <p className="text-[10px] font-mono text-[#0066FF] tracking-[0.5em] uppercase flex items-center gap-3 mb-5">
              <span className="w-8 h-px bg-[#0066FF]" />
              06 / Build
            </p>
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-black text-white uppercase font-mono leading-none tracking-tighter">
              What We Are Building
            </h2>
          </RevealText>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-white/[0.04]">
            {[
              { title: "Autonomous Health Systems", body: "Future-ready medical technologies for remote and extreme environments. No doctors. No hospitals. Just intelligence." },
              { title: "Human Performance Intelligence", body: "Understanding cognitive readiness, fatigue, and resilience at the edge of human capability." },
              { title: "Space Medicine Research", body: "Preparing humanity for long-duration exploration. Solving problems that don't exist on Earth yet." },
              { title: "Biological Operating Systems", body: "Creating predictive models of human health that evolve, learn, and act before the body signals distress." },
            ].map((c, i) => (
              <BuildCard key={i} {...c} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ──────────── SECTION 7: MANIFESTO ──────────── */}
      <section className="relative bg-black py-48 md:py-72 px-6">
        <div className="max-w-5xl mx-auto space-y-20 text-center">
          <RevealLine>
            <p className="text-3xl sm:text-5xl md:text-6xl font-black text-white font-mono leading-tight uppercase">
              Every Great Era of Exploration<br />Required New Technologies.
            </p>
          </RevealLine>
          <RevealLine delay={0.3}>
            <p className="text-3xl sm:text-5xl md:text-6xl font-black text-[#0066FF] font-mono leading-tight uppercase">
              The Next Era Requires<br />New Biology.
            </p>
          </RevealLine>
        </div>
      </section>

      {/* ──────────── SECTION 8: EARTH TO MARS ──────────── */}
      <section className="relative min-h-screen bg-black overflow-hidden flex items-center">
        <MarsCanvas />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60 pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-10 w-full py-20">
          <div className="space-y-16 md:space-y-24">
            {["From Earth", "To The Moon", "To Mars", "And Beyond"].map((line, i) => (
              <RevealLine key={i} delay={i * 0.15}>
                <p className={`font-black font-mono uppercase tracking-tighter leading-none ${
                  i === 3 ? "text-5xl sm:text-7xl md:text-9xl text-[#0066FF]" : "text-4xl sm:text-6xl md:text-8xl text-white"
                }`}>
                  {line}
                </p>
              </RevealLine>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────── FINAL SECTION ──────────── */}
      <section id="final" className="relative min-h-screen bg-black flex flex-col items-center justify-center px-6 py-32 border-t border-white/5">
        {/* Subtle glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(0,50,150,0.08),transparent)] pointer-events-none" />

        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <RevealText className="mb-12">
            <LatencyLogo size="lg" />
          </RevealText>

          <RevealText delay={0.2} className="mb-6">
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-black text-white uppercase font-mono leading-tight tracking-tighter">
              Building The Future<br />of Human Survival
            </h2>
          </RevealText>

          <RevealText delay={0.35} className="mb-4">
            <p className="text-base font-mono text-zinc-400 tracking-[0.3em] uppercase">
              When Earth Is Too Far Away.
            </p>
          </RevealText>

          <RevealText delay={0.45} className="mb-16">
            <p className="text-[10px] font-mono text-zinc-600 tracking-[0.4em] uppercase">
              Powered by AVENNIX — Advancing Human Health, On Earth and Beyond.
            </p>
          </RevealText>

          <RevealText delay={0.55}>
            <a href="mailto:contact@healix.tech"
              className="group inline-flex items-center gap-4 px-10 py-4 border border-white/20 hover:border-[#0066FF] hover:bg-[#0066FF]/10 text-[11px] font-mono uppercase tracking-[0.4em] text-white hover:text-[#0066FF] transition-all duration-500">
              Join The Mission
              <span className="w-6 h-px bg-current group-hover:w-10 transition-all duration-300" />
            </a>
          </RevealText>
        </div>

        {/* Footer line */}
        <div className="absolute bottom-8 left-0 right-0 flex items-center justify-center gap-4">
          <div className="w-24 h-px bg-white/10" />
          <p className="text-[9px] font-mono text-white/15 tracking-[0.4em] uppercase">LATENCY × AVENNIX × 2025</p>
          <div className="w-24 h-px bg-white/10" />
        </div>
      </section>

    </div>
  );
}

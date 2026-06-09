"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";

/* ─────────────────────────────────────────────
   STAR FIELD (canvas-based, performant)
───────────────────────────────────────────── */
function StarField({ count = 220 }: { count?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const stars = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.2 + 0.2,
      a: Math.random(),
      speed: Math.random() * 0.004 + 0.001,
      phase: Math.random() * Math.PI * 2,
    }));

    let raf: number;
    const draw = (t: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach((s) => {
        const alpha = s.a * 0.6 + 0.4 * Math.sin(t * s.speed + s.phase);
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${alpha.toFixed(3)})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [count]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.55 }}
    />
  );
}

/* ─────────────────────────────────────────────
   ANIMATED EARTH SVG
───────────────────────────────────────────── */
function EarthOrb() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let gl: WebGLRenderingContext | null = null;
    try {
      gl =
        canvas.getContext("webgl", { alpha: true, antialias: true }) ||
        (canvas.getContext("experimental-webgl", {
          alpha: true,
          antialias: true,
        }) as WebGLRenderingContext | null);
    } catch (e) {
      console.error("WebGL support checking failed", e);
    }

    if (!gl) {
      console.warn("WebGL not supported. Fallback to simple globe.");
      return;
    }

    const vsSource = `
      attribute vec2 a_position;
      varying vec2 v_texCoord;
      void main() {
        v_texCoord = a_position * 0.5 + 0.5;
        v_texCoord.y = 1.0 - v_texCoord.y;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fsSource = `
      precision mediump float;
      varying vec2 v_texCoord;
      uniform sampler2D u_texture;
      uniform float u_rotation;
      uniform vec3 u_lightDirection;

      void main() {
        vec2 p = v_texCoord * 2.0 - 1.0;
        float r2 = dot(p, p);
        if (r2 > 1.0) {
          discard;
        }
        
        float z = sqrt(1.0 - r2);
        vec3 normal = vec3(p.x, p.y, z);
        
        float pi = 3.141592653589793;
        float lat = asin(normal.y);
        float lon = atan(normal.x, normal.z) - u_rotation;
        
        float u = (lon + pi) / (2.0 * pi);
        float v = (lat + pi / 2.0) / pi;
        u = fract(u);
        
        vec4 texColor = texture2D(u_texture, vec2(u, v));
        
        // Soft cinematic lighting
        vec3 lightDir = normalize(u_lightDirection);
        float diffuse = max(dot(normal, lightDir), 0.0);
        float ambient = 0.04;
        float intensity = ambient + diffuse * 0.96;
        
        // Atmosphere blue rim glow
        float rim = 1.0 - z;
        rim = pow(rim, 4.0) * 0.55;
        vec4 rimColor = vec4(0.3, 0.6, 1.0, 1.0) * rim;
        
        gl_FragColor = vec4(texColor.rgb * intensity, texColor.a) + rimColor * (diffuse * 0.7 + 0.3);
      }
    `;

    const compileShader = (source: string, type: number): WebGLShader | null => {
      const shader = gl!.createShader(type);
      if (!shader) return null;
      gl!.shaderSource(shader, source);
      gl!.compileShader(shader);
      if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)) {
        console.error("Shader compile error:", gl!.getShaderInfoLog(shader));
        gl!.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = compileShader(vsSource, gl.VERTEX_SHADER);
    const fs = compileShader(fsSource, gl.FRAGMENT_SHADER);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    const positionLoc = gl.getAttribLocation(program, "a_position");
    const rotationLoc = gl.getUniformLocation(program, "u_rotation");
    const lightDirLoc = gl.getUniformLocation(program, "u_lightDirection");

    const positions = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1,
    ]);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    // Create texture
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Temp 1x1 pixel while loading
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      1,
      1,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      new Uint8Array([5, 10, 25, 255])
    );

    const img = new Image();
    img.onload = () => {
      if (!gl) return;
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    };
    img.src = "/earth-map.jpg";

    let rotation = 0;
    let animId: number;

    const tick = () => {
      if (!gl) return;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.useProgram(program);
      rotation += 0.0006; // Slow rotation

      gl.uniform1f(rotationLoc, rotation);
      gl.uniform3f(lightDirLoc, -0.8, 0.4, 1.0); // Cinematic light source

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      animId = requestAnimationFrame(tick);
    };
    animId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animId);
      if (gl) {
        gl.deleteProgram(program);
        gl.deleteShader(vs);
        gl.deleteShader(fs);
        gl.deleteBuffer(buffer);
        gl.deleteTexture(texture);
      }
    };
  }, []);

  return (
    <div className="relative flex items-center justify-center select-none">
      {/* Outer glow ring */}
      <div
        className="absolute rounded-full"
        style={{
          width: 560,
          height: 560,
          background:
            "radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)",
          animation: "pulse 6s ease-in-out infinite",
        }}
      />
      {/* Orbit ring */}
      <div
        className="absolute rounded-full border border-blue-500/10"
        style={{ width: 500, height: 500 }}
      />
      <div
        className="absolute rounded-full border border-blue-500/5"
        style={{
          width: 580,
          height: 580,
          animation: "spin 80s linear infinite",
        }}
      >
        <div
          className="absolute w-2 h-2 rounded-full bg-blue-400/60"
          style={{ top: 0, left: "50%" }}
        />
      </div>

      {/* WebGL Real Earth Globe */}
      <div className="relative rounded-full overflow-hidden w-[300px] h-[300px] md:w-[380px] md:h-[380px] flex items-center justify-center">
        {/* Shadow Overlay for extra depth */}
        <div
          className="absolute inset-0 pointer-events-none rounded-full z-20"
          style={{
            boxShadow:
              "inset -20px -20px 40px rgba(0,0,0,0.8), inset 20px 20px 40px rgba(255,255,255,0.05)",
          }}
        />
        <canvas
          ref={canvasRef}
          width={600}
          height={600}
          className="w-full h-full relative z-10 block"
        />
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}

/* ─────────────────────────────────────────────
   SCROLL-TRIGGERED WORD REVEAL
───────────────────────────────────────────── */
function WordReveal({
  text,
  className,
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.7, delay: delay + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="inline-block mr-[0.25em]"
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

/* ─────────────────────────────────────────────
   ORBITAL LINE SVG BACKGROUND
───────────────────────────────────────────── */
function OrbitalLines() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none opacity-10"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
    >
      {[280, 380, 480, 600].map((r, i) => (
        <ellipse
          key={i}
          cx="720"
          cy="450"
          rx={r * 1.8}
          ry={r * 0.55}
          fill="none"
          stroke="white"
          strokeWidth="0.6"
          strokeDasharray={i % 2 === 0 ? "4 12" : "2 8"}
          transform={`rotate(${i * 18} 720 450)`}
          opacity={0.5 - i * 0.08}
        />
      ))}
    </svg>
  );
}

/* ─────────────────────────────────────────────
   PILLAR CARD
───────────────────────────────────────────── */
function PillarCard({
  index,
  icon,
  title,
  subtitle,
}: {
  index: number;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-15% 0px" }}
      transition={{ duration: 0.8, delay: index * 0.18, ease: [0.22, 1, 0.36, 1] }}
      className="group relative border border-white/8 bg-white/[0.03] backdrop-blur-sm p-10 flex flex-col gap-6 hover:border-blue-500/30 hover:bg-white/[0.06] transition-all duration-700 cursor-default"
    >
      <div className="text-blue-400 w-10 h-10">{icon}</div>
      <div>
        <p className="text-[10px] tracking-[0.25em] uppercase text-white/30 font-mono mb-3">
          0{index + 1}
        </p>
        <h3 className="text-2xl md:text-3xl font-black tracking-tighter text-white mb-3 leading-none">
          {title}
        </h3>
        <p className="text-white/40 text-sm leading-relaxed font-light">
          {subtitle}
        </p>
      </div>
      <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-blue-400 group-hover:w-full transition-all duration-700" />
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   RESEARCH STAT
───────────────────────────────────────────── */
function ResearchStat({
  label,
  index,
}: {
  label: string;
  index: number;
}) {
  const [active, setActive] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onHoverStart={() => setActive(true)}
      onHoverEnd={() => setActive(false)}
      className="flex items-center gap-5 py-6 border-b border-white/6 cursor-default group"
    >
      <motion.div
        animate={{ width: active ? 48 : 8 }}
        transition={{ duration: 0.4 }}
        className="h-[1px] bg-blue-400"
      />
      <span
        className={`text-lg md:text-2xl font-black tracking-tight transition-colors duration-300 ${
          active ? "text-white" : "text-white/40"
        }`}
      >
        {label}
      </span>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   NAV
───────────────────────────────────────────── */
function AvenixNav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.5 }}
      className={`fixed top-0 inset-x-0 z-50 flex items-center justify-between px-8 md:px-14 h-16 transition-all duration-500 ${
        scrolled ? "bg-black/70 backdrop-blur-xl border-b border-white/5" : ""
      }`}
    >
      <span className="text-white font-black tracking-[0.15em] text-sm uppercase">
        AVENNIX
      </span>
      <div className="hidden md:flex items-center gap-10">
        {["Mission", "Research", "Technology", "BioLabs", "Careers"].map(
          (item) => (
            <a
              key={item}
              href="#"
              className="text-[11px] tracking-[0.2em] uppercase text-white/40 hover:text-white transition-colors duration-300 font-medium"
            >
              {item}
            </a>
          )
        )}
      </div>
    </motion.nav>
  );
}

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
export default function AvenixCarePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div
      ref={containerRef}
      className="relative bg-[#030508] text-white overflow-x-hidden font-sans selection:bg-blue-500/30"
    >
      {/* Global star field */}
      {mounted && <StarField count={260} />}

      {/* Nav */}
      <AvenixNav />

      {/* ──────── SECTION 1 — HERO ──────── */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center overflow-hidden">
        {/* Radial spotlight */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 60% at 50% 40%, rgba(29,78,216,0.15) 0%, transparent 70%)",
          }}
        />

        {/* Earth */}
        <div className="absolute inset-0 flex items-center justify-center opacity-40 pointer-events-none">
          <EarthOrb />
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 inset-x-0 h-64 bg-gradient-to-t from-[#030508] to-transparent pointer-events-none z-10" />

        {/* Content */}
        <div className="relative z-20 flex flex-col items-center gap-6 px-6">
          <motion.p
            initial={{ opacity: 0, letterSpacing: "0.6em" }}
            animate={{ opacity: 1, letterSpacing: "0.35em" }}
            transition={{ duration: 1.8, delay: 0.2 }}
            className="text-[10px] md:text-xs tracking-[0.35em] text-white/30 uppercase font-mono"
          >
            Avenix Pharmaceuticals · Est. 2024
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="text-[clamp(3.5rem,10vw,9rem)] font-black tracking-[-0.04em] leading-none"
            style={{
              background:
                "linear-gradient(160deg, #ffffff 30%, rgba(255,255,255,0.45) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            AVENNIX
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.4, delay: 1 }}
            className="text-base md:text-lg text-white/40 tracking-[0.05em] font-light max-w-sm"
          >
            Advancing Human Health,{" "}
            <span className="text-white/70">On Earth and Beyond.</span>
          </motion.p>

          <motion.a
            href="#section2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="mt-6 text-[11px] tracking-[0.3em] uppercase text-white/60 hover:text-white border-b border-white/20 hover:border-white pb-1 transition-all duration-300"
          >
            EXPLORE
          </motion.a>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3"
        >
          <div className="w-[1px] h-14 bg-gradient-to-b from-transparent via-white/40 to-transparent animate-pulse" />
        </motion.div>
      </section>

      {/* ──────── SECTION 2 — BIG STATEMENT ──────── */}
      <section
        id="section2"
        className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 md:px-20"
      >
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5 }}
          >
            <p className="text-[clamp(2rem,5.5vw,5rem)] font-black tracking-[-0.03em] leading-[1.1] text-white/90">
              <WordReveal text="Humanity's next challenge" />
              <br />
              <WordReveal
                text="is not reaching space."
                delay={0.3}
                className="text-white/40"
              />
              <br />
              <WordReveal text="It is surviving there." delay={0.6} />
            </p>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 1.2 }}
            className="mt-16 text-sm text-white/25 tracking-[0.15em] uppercase font-mono"
          >
            The frontier of medicine · 2024 — ∞
          </motion.p>
        </div>
      </section>

      {/* ──────── SECTION 3 — BIOLOGY · INTELLIGENCE · EXPLORATION ──────── */}
      <section className="relative z-10 min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated mesh background */}
        <div className="absolute inset-0">
          <svg
            className="w-full h-full opacity-[0.04]"
            viewBox="0 0 1440 900"
            preserveAspectRatio="xMidYMid slice"
          >
            {/* Neural-like connected nodes */}
            {Array.from({ length: 40 }).map((_, i) => {
              const x = (i % 8) * 200 + 50;
              const y = Math.floor(i / 8) * 200 + 80;
              return (
                <g key={i}>
                  <circle cx={x} cy={y} r={2} fill="white" />
                  {i % 8 < 7 && (
                    <line
                      x1={x}
                      y1={y}
                      x2={x + 200}
                      y2={y}
                      stroke="white"
                      strokeWidth={0.4}
                    />
                  )}
                  {Math.floor(i / 8) < 4 && (
                    <line
                      x1={x}
                      y1={y}
                      x2={x}
                      y2={y + 200}
                      stroke="white"
                      strokeWidth={0.4}
                    />
                  )}
                </g>
              );
            })}
          </svg>
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 50% 50% at 50% 50%, #030508 30%, transparent 100%)",
            }}
          />
        </div>

        <div className="relative z-10 text-center px-6">
          {[
            { word: "Biology.", delay: 0, color: "text-white" },
            { word: "Intelligence.", delay: 0.25, color: "text-blue-400" },
            { word: "Exploration.", delay: 0.5, color: "text-white/50" },
          ].map(({ word, delay, color }) => (
            <motion.div
              key={word}
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
              className={`text-[clamp(3rem,8vw,8rem)] font-black tracking-[-0.04em] leading-tight ${color}`}
            >
              {word}
            </motion.div>
          ))}
        </div>
      </section>

      {/* ──────── SECTION 4 — FULL SCREEN STATEMENT ──────── */}
      <section className="relative z-10 min-h-screen flex items-center justify-center px-6 md:px-20">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(59,130,246,0.05) 0%, transparent 70%)",
          }}
        />
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5 }}
            className="text-[clamp(2.2rem,5vw,4.5rem)] font-black tracking-[-0.03em] leading-[1.1] text-white"
          >
            <WordReveal text="We are building technologies" />
            <br />
            <WordReveal
              text="for the future of"
              delay={0.2}
              className="text-white/40"
            />{" "}
            <WordReveal text="human health." delay={0.5} />
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.8 }}
            className="mx-auto mt-12 w-24 h-[1px] bg-gradient-to-r from-transparent via-blue-400 to-transparent"
          />
        </div>
      </section>

      {/* ──────── SECTION 5 — THREE PILLARS ──────── */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center py-24 px-6">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-[10px] tracking-[0.3em] text-white/25 uppercase font-mono mb-16"
        >
          Core Disciplines
        </motion.p>

        <div className="w-full max-w-6xl mx-auto grid md:grid-cols-3 gap-[1px] bg-white/5">
          <PillarCard
            index={0}
            title="Biotechnology"
            subtitle="Understanding life at its molecular foundation — from genomics to protein folding."
            icon={
              <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <circle cx="20" cy="20" r="4" />
                <path d="M20 4 C28 8, 32 14, 28 20 C24 26, 12 28, 8 24 C4 20, 8 12, 20 4Z" />
                <circle cx="20" cy="4" r="2" />
                <circle cx="28" cy="20" r="2" />
                <circle cx="8" cy="24" r="2" />
              </svg>
            }
          />
          <PillarCard
            index={1}
            title="Artificial Intelligence"
            subtitle="Transforming vast clinical data into precise, actionable health intelligence."
            icon={
              <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <rect x="8" y="8" width="24" height="24" rx="3" />
                <line x1="20" y1="2" x2="20" y2="8" />
                <line x1="20" y1="32" x2="20" y2="38" />
                <line x1="2" y1="20" x2="8" y2="20" />
                <line x1="32" y1="20" x2="38" y2="20" />
                <circle cx="20" cy="20" r="4" />
              </svg>
            }
          />
          <PillarCard
            index={2}
            title="Space Medicine"
            subtitle="Preparing the human body for the physiological extremes of deep-space exploration."
            icon={
              <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <circle cx="20" cy="20" r="10" />
                <ellipse cx="20" cy="20" rx="20" ry="7" />
                <circle cx="20" cy="6" r="2" fill="currentColor" />
              </svg>
            }
          />
        </div>
      </section>

      {/* ──────── SECTION 6 — FROM EARTH. TO ORBIT. TO MARS. ──────── */}
      <section className="relative z-10 min-h-screen flex items-center justify-center overflow-hidden">
        <OrbitalLines />

        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(29,78,216,0.08) 0%, transparent 70%)",
          }}
        />

        <div className="relative z-10 text-center px-6">
          {[
            { line: "FROM EARTH.", delay: 0 },
            { line: "TO ORBIT.", delay: 0.2 },
            { line: "TO MARS.", delay: 0.4 },
          ].map(({ line, delay }) => (
            <motion.div
              key={line}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay, ease: [0.22, 1, 0.36, 1] }}
              className="block text-[clamp(3.5rem,9vw,10rem)] font-black tracking-[-0.04em] leading-[0.95]"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.25) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {line}
            </motion.div>
          ))}
        </div>
      </section>

      {/* ──────── SECTION 7 — RESEARCH DOMAINS ──────── */}
      <section className="relative z-10 min-h-screen flex flex-col justify-center py-24 px-6 md:px-20">
        <div className="max-w-4xl mx-auto w-full">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <div>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="text-[10px] tracking-[0.3em] uppercase text-blue-400/70 font-mono mb-6"
              >
                Research Domains
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9 }}
                className="text-[clamp(2rem,4vw,4rem)] font-black tracking-[-0.03em] leading-none text-white"
              >
                Where science meets the impossible.
              </motion.h2>
            </div>

            <div className="pt-2">
              {[
                "Clinical Research",
                "Neuroscience",
                "Human Performance",
                "Aerospace Medicine",
                "Digital Health",
              ].map((label, i) => (
                <ResearchStat key={label} label={label} index={i} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ──────── SECTION 8 — THE MISSION ──────── */}
      <section className="relative z-10 min-h-[70vh] flex items-center justify-center px-6 md:px-20">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(59,130,246,0.06) 0%, transparent 70%)",
          }}
        />
        <div className="max-w-3xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="text-[10px] tracking-[0.3em] uppercase text-white/20 font-mono mb-10"
          >
            The Mission
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-[clamp(1.4rem,3.5vw,3rem)] font-light tracking-[-0.01em] leading-[1.4] text-white/70"
          >
            The future of medicine will not be confined by{" "}
            <span className="text-white font-medium">geography.</span>
            <br />
            It will travel wherever{" "}
            <span className="text-white font-medium">humanity goes.</span>
          </motion.p>
        </div>
      </section>

      {/* ──────── SECTION 9 — FINAL CTA ──────── */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Deep background fade */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 60% at 50% 40%, rgba(29,78,216,0.12) 0%, transparent 70%)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#030508]/80 pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 flex flex-col items-center gap-8 text-center px-6"
        >
          {/* Glowing logo */}
          <div className="relative">
            <div
              className="absolute inset-0 blur-[60px] opacity-40"
              style={{ background: "rgba(59,130,246,0.6)" }}
            />
            <h2
              className="relative text-[clamp(3rem,10vw,9rem)] font-black tracking-[-0.04em] leading-none"
              style={{
                background:
                  "linear-gradient(160deg, #ffffff 20%, rgba(147,197,253,0.6) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              AVENNIX
            </h2>
          </div>

          <p className="text-white/35 text-base md:text-lg tracking-[0.05em] font-light">
            Advancing Human Health,{" "}
            <span className="text-white/60">On Earth and Beyond.</span>
          </p>

          <motion.a
            href="https://www.avennixpharma.in"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="mt-4 inline-flex items-center gap-3 px-10 py-4 bg-white text-black text-[11px] tracking-[0.3em] uppercase font-black hover:bg-blue-50 transition-colors duration-300"
          >
            JOIN THE MISSION
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M1 7h12M7 1l6 6-6 6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.a>

          <p className="text-white/15 text-[10px] tracking-[0.2em] uppercase font-mono mt-4">
            avennixpharma.in
          </p>
        </motion.div>
      </section>

      {/* ──────── FOOTER ──────── */}
      <footer className="relative z-10 border-t border-white/5 px-8 md:px-14 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="text-white/20 text-[10px] tracking-[0.2em] uppercase font-mono">
          © 2024 Avenix Pharmaceuticals Ltd.
        </span>
        <span className="text-white/15 text-[10px] tracking-[0.15em] uppercase font-mono">
          CDSCO Compliant · WHO-GMP Certified
        </span>
      </footer>
    </div>
  );
}

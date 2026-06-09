"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";

/* ─────────────────────────────────────────────
   AESTHETIC AVENNIX LOGO
   Custom letter X representing an orbital trajectory
───────────────────────────────────────────── */
function AvennixLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 select-none ${className}`}>
      <span className="text-white font-extrabold tracking-[0.3em] text-lg md:text-xl font-mono">
        AVENNI
      </span>
      <svg
        width="22"
        height="22"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="inline-block"
      >
        {/* Straight trajectory line */}
        <line
          x1="15"
          y1="85"
          x2="85"
          y2="15"
          stroke="white"
          strokeWidth="10"
          strokeLinecap="round"
        />
        {/* Orbital curved path intersecting */}
        <path
          d="M 15 15 C 35 40 65 60 85 85"
          stroke="white"
          strokeWidth="10"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────────
   STAR FIELD (canvas-based, performant)
───────────────────────────────────────────── */
function StarField({ count = 280 }: { count?: number }) {
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
      speed: Math.random() * 0.003 + 0.001,
      phase: Math.random() * Math.PI * 2,
    }));

    let raf: number;
    const draw = (t: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach((s) => {
        const alpha = s.a * 0.5 + 0.5 * Math.sin(t * s.speed + s.phase);
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
      style={{ opacity: 0.45 }}
    />
  );
}

/* ─────────────────────────────────────────────
   WEBGL REAL EARTH GLOBE
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
      console.warn("WebGL not supported. Fallback.");
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
      uniform sampler2D u_dayTexture;
      uniform sampler2D u_nightTexture;
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
        
        vec4 dayColor = texture2D(u_dayTexture, vec2(u, v));
        vec4 nightColor = texture2D(u_nightTexture, vec2(u, v));
        
        vec3 lightDir = normalize(u_lightDirection);
        float dotNL = dot(normal, lightDir);
        
        // Dynamic day/night blending across terminator
        float dayWeight = smoothstep(-0.15, 0.15, dotNL);
        
        float ambient = 0.03;
        float intensity = ambient + max(dotNL, 0.0) * 0.97;
        vec3 litDay = dayColor.rgb * intensity;
        
        // Boost night city lights for high-end cinematic visibility
        vec3 litNight = nightColor.rgb * 1.8;
        
        vec3 finalColor = mix(litNight, litDay, dayWeight);
        
        // Atmosphere scattering rim glow
        float rim = 1.0 - z;
        rim = pow(rim, 4.0) * 0.65;
        float rimWeight = smoothstep(-0.3, 0.2, dotNL);
        vec4 rimColor = vec4(0.35, 0.65, 1.0, 1.0) * rim * (rimWeight * 0.8 + 0.2);
        
        gl_FragColor = vec4(finalColor + rimColor.rgb, dayColor.a);
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
    const dayTexLoc = gl.getUniformLocation(program, "u_dayTexture");
    const nightTexLoc = gl.getUniformLocation(program, "u_nightTexture");

    gl.uniform1i(dayTexLoc, 0); // Unit 0
    gl.uniform1i(nightTexLoc, 1); // Unit 1

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

    // Day Texture
    const dayTexture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, dayTexture);
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

    const dayImg = new Image();
    dayImg.onload = () => {
      if (!gl) return;
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, dayTexture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, dayImg);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    };
    dayImg.src = "/earth-map.jpg";

    // Night Texture
    const nightTexture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, nightTexture);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      1,
      1,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      new Uint8Array([2, 4, 8, 255])
    );

    const nightImg = new Image();
    nightImg.onload = () => {
      if (!gl) return;
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, nightTexture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, nightImg);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    };
    nightImg.src = "/earth-night.jpg";

    let rotation = 0;
    let animId: number;

    const tick = () => {
      if (!gl) return;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.useProgram(program);
      rotation += 0.0005; // Slower, more cinematic speed

      gl.uniform1f(rotationLoc, rotation);
      gl.uniform3f(lightDirLoc, -0.8, 0.4, 1.0); // Light from upper-left (matches sun position)

      // Bind active textures
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, dayTexture);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, nightTexture);

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
        gl.deleteTexture(dayTexture);
        gl.deleteTexture(nightTexture);
      }
    };
  }, []);

  return (
    <div className="relative flex items-center justify-center select-none w-[340px] h-[340px] sm:w-[480px] sm:h-[480px] md:w-[600px] md:h-[600px] lg:w-[680px] lg:h-[680px]">
      {/* Outer glow ring */}
      <div
        className="absolute rounded-full pointer-events-none w-[140%] h-[140%]"
        style={{
          background:
            "radial-gradient(circle, rgba(59,130,246,0.14) 0%, transparent 70%)",
          animation: "pulse 6s ease-in-out infinite",
        }}
      />
      {/* Orbit ring */}
      <div
        className="absolute rounded-full border border-blue-500/10 pointer-events-none w-[125%] h-[125%]"
      />
      <div
        className="absolute rounded-full border border-blue-500/5 pointer-events-none w-[135%] h-[135%] animate-[spin_80s_linear_infinite]"
      >
        <div
          className="absolute w-2 h-2 rounded-full bg-blue-400/60"
          style={{ top: 0, left: "50%", transform: "translate(-50%, -50%)" }}
        />
      </div>

      {/* WebGL Real Earth Globe */}
      <div className="relative rounded-full overflow-hidden w-full h-full flex items-center justify-center">
        {/* Shadow Overlay for extra depth */}
        <div
          className="absolute inset-0 pointer-events-none rounded-full z-20"
          style={{
            boxShadow:
              "inset -30px -30px 60px rgba(0,0,0,0.95), inset 25px 25px 50px rgba(255,255,255,0.06)",
          }}
        />
        <canvas
          ref={canvasRef}
          width={1024}
          height={1024}
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
   DYNAMIC BACKGROUND PATTERNS
───────────────────────────────────────────── */
function CellPattern() {
  return (
    <svg className="w-full h-full max-w-lg opacity-25" viewBox="0 0 400 400" fill="none">
      <defs>
        <radialGradient id="cellGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
        </radialGradient>
      </defs>
      <motion.circle
        cx="200"
        cy="200"
        r="110"
        stroke="#3b82f6"
        strokeWidth="1"
        strokeDasharray="6 6"
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      />
      <motion.circle
        cx="200"
        cy="200"
        r="75"
        stroke="#3b82f6"
        strokeWidth="0.5"
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i * Math.PI) / 4;
        const cx = 200 + Math.cos(angle) * 75;
        const cy = 200 + Math.sin(angle) * 75;
        return (
          <motion.circle
            key={i}
            cx={cx}
            cy={cy}
            r="7"
            fill="url(#cellGlow)"
            stroke="#3b82f6"
            strokeWidth="0.5"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 3.5, delay: i * 0.4, repeat: Infinity }}
          />
        );
      })}
      <circle cx="200" cy="200" r="18" fill="none" stroke="#3b82f6" strokeWidth="1.5" />
    </svg>
  );
}

function NeuralPattern() {
  return (
    <svg className="w-full h-full opacity-20" viewBox="0 0 800 600" fill="none">
      {[
        { id: 1, x: 200, y: 150 },
        { id: 2, x: 450, y: 120 },
        { id: 3, x: 620, y: 220 },
        { id: 4, x: 280, y: 380 },
        { id: 5, x: 520, y: 420 },
        { id: 6, x: 210, y: 480 },
        { id: 7, x: 580, y: 490 },
      ].map((node) => (
        <g key={node.id}>
          <motion.circle
            cx={node.x}
            cy={node.y}
            r="4"
            fill="#3b82f6"
            animate={{ r: [4, 7, 4], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 3.5 + (node.id % 2), repeat: Infinity, ease: "easeInOut" }}
          />
          <circle cx={node.x} cy={node.y} r="14" stroke="#3b82f6" strokeWidth="0.5" opacity="0.25" />
        </g>
      ))}
      <line x1="200" y1="150" x2="450" y2="120" stroke="#3b82f6" strokeWidth="0.5" opacity="0.3" />
      <line x1="450" y1="120" x2="620" y2="220" stroke="#3b82f6" strokeWidth="0.5" opacity="0.3" />
      <line x1="200" y1="150" x2="280" y2="380" stroke="#3b82f6" strokeWidth="0.5" opacity="0.3" />
      <line x1="450" y1="120" x2="280" y2="380" stroke="#3b82f6" strokeWidth="0.5" opacity="0.3" />
      <line x1="280" y1="380" x2="520" y2="420" stroke="#3b82f6" strokeWidth="0.5" opacity="0.3" />
      <line x1="620" y1="220" x2="520" y2="420" stroke="#3b82f6" strokeWidth="0.5" opacity="0.3" />
      <line x1="280" y1="380" x2="210" y2="480" stroke="#3b82f6" strokeWidth="0.5" opacity="0.3" />
      <line x1="520" y1="420" x2="580" y2="490" stroke="#3b82f6" strokeWidth="0.5" opacity="0.3" />
      <line x1="210" y1="480" x2="580" y2="490" stroke="#3b82f6" strokeWidth="0.5" opacity="0.3" />
    </svg>
  );
}

function HumanBodyPattern() {
  return (
    <svg className="w-full h-full max-w-sm opacity-25" viewBox="0 0 400 400" fill="none">
      <motion.circle
        cx="200"
        cy="200"
        r="140"
        stroke="#3b82f6"
        strokeWidth="0.8"
        strokeDasharray="12 45"
        animate={{ rotate: 360 }}
        transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
      />
      <motion.circle
        cx="200"
        cy="200"
        r="120"
        stroke="#3b82f6"
        strokeWidth="0.5"
        strokeDasharray="4 4"
        animate={{ rotate: -360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      />
      <circle cx="200" cy="200" r="95" stroke="#3b82f6" strokeWidth="0.5" opacity="0.4" />
      
      <g transform="translate(200, 200)">
        {Array.from({ length: 16 }).map((_, i) => {
          const y = -90 + i * 12;
          const width = Math.sin(i * 0.6) * 40;
          return (
            <g key={i}>
              <circle cx={width} cy={y} r="2" fill="#3b82f6" />
              <circle cx={-width} cy={y} r="2" fill="#93c5fd" />
              <line x1={-width} y1={y} x2={width} y2={y} stroke="#3b82f6" strokeWidth="0.4" opacity="0.25" />
            </g>
          );
        })}
      </g>

      <motion.line
        x1="60"
        y1="200"
        x2="340"
        y2="200"
        stroke="#3b82f6"
        strokeWidth="1"
        opacity="0.5"
        animate={{ y: [-90, 90, -90] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
    </svg>
  );
}

function OrbitalLines() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none opacity-20"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
    >
      {[300, 400, 500, 620].map((r, i) => (
        <ellipse
          key={i}
          cx="720"
          cy="450"
          rx={r * 1.8}
          ry={r * 0.55}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="0.7"
          strokeDasharray={i % 2 === 0 ? "5 15" : "2 10"}
          transform={`rotate(${i * 20} 720 450)`}
          opacity={0.4 - i * 0.08}
        />
      ))}
    </svg>
  );
}

/* ─────────────────────────────────────────────
   SCROLL-LINKED WORD/STATEMENT REVEAL
───────────────────────────────────────────── */
function ScrollSequence() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const opacity1 = useTransform(scrollYProgress, [0.0, 0.15, 0.28, 0.38], [0, 1, 1, 0]);
  const opacity2 = useTransform(scrollYProgress, [0.38, 0.48, 0.62, 0.72], [0, 1, 1, 0]);
  const opacity3 = useTransform(scrollYProgress, [0.72, 0.82, 0.95, 1.0], [0, 1, 1, 1]);

  const y1 = useTransform(scrollYProgress, [0.0, 0.15, 0.28, 0.38], [30, 0, 0, -30]);
  const y2 = useTransform(scrollYProgress, [0.38, 0.48, 0.62, 0.72], [30, 0, 0, -30]);
  const y3 = useTransform(scrollYProgress, [0.72, 0.82, 0.95, 1.0], [30, 0, 0, 0]);

  return (
    <div ref={containerRef} className="relative h-[250vh] bg-black">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden px-6">
        <div className="max-w-5xl mx-auto text-center relative w-full h-full flex items-center justify-center">
          <motion.div
            style={{ opacity: opacity1, y: y1 }}
            className="absolute w-full px-4"
          >
            <p className="text-[clamp(1.8rem,4.5vw,4.5rem)] font-light tracking-tight text-white leading-snug">
              Humanity is preparing to travel farther than ever before.
            </p>
          </motion.div>
          <motion.div
            style={{ opacity: opacity2, y: y2 }}
            className="absolute w-full px-4"
          >
            <p className="text-[clamp(1.8rem,4.5vw,4.5rem)] font-light tracking-tight text-white/50 leading-snug">
              The challenge is not reaching new frontiers.
            </p>
          </motion.div>
          <motion.div
            style={{ opacity: opacity3, y: y3 }}
            className="absolute w-full px-4"
          >
            <p className="text-[clamp(1.8rem,4.5vw,4.5rem)] font-extrabold tracking-tight text-white leading-snug">
              The challenge is surviving them.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   CELLS TO SPACE BACKGROUND TRANSITION
───────────────────────────────────────────── */
function CellsToSpaceSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-end justify-end overflow-hidden">
      {/* Full-screen astronaut background — positioned so astronaut is centered/visible */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/astronaut-hero.png')",
          backgroundSize: "cover",
          backgroundPosition: "center 30%",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* TOP fade — solid black bleeding in from above, fades to transparent */}
      <div
        className="absolute inset-x-0 top-0 z-10 pointer-events-none"
        style={{
          height: "35%",
          background: "linear-gradient(to bottom, #000000 0%, rgba(0,0,0,0) 100%)",
        }}
      />

      {/* BOTTOM fade — solid black bleeding up from below */}
      <div
        className="absolute inset-x-0 bottom-0 z-10 pointer-events-none"
        style={{
          height: "40%",
          background: "linear-gradient(to top, #000000 0%, rgba(0,0,0,0) 100%)",
        }}
      />

      {/* Left vignette — so text stays readable */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.3) 40%, transparent 70%)",
        }}
      />

      {/* Subtle center darkening so image doesn't overpower */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "rgba(0,0,0,0.15)" }}
      />

      {/* Text — bottom-left, cinematic, above all fades */}
      <div className="relative z-20 flex flex-col gap-5 px-10 md:px-20 pb-28 max-w-3xl">
        <motion.p
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-[10px] tracking-[0.4em] uppercase text-blue-400 font-mono"
        >
          Spectrum
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="text-[clamp(2.8rem,7vw,6.5rem)] font-extrabold tracking-tight leading-[0.92] text-white"
        >
          FROM CELLS<br />
          TO SPACE
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.4 }}
          className="text-white/60 text-base md:text-lg font-light leading-relaxed max-w-xl"
        >
          Avennix develops next-generation technologies at the intersection of biotechnology, intelligence, and human exploration.
        </motion.p>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   SECTION 4: THREE GIANT PILLARS
───────────────────────────────────────────── */
function PillarsSection() {
  const pillars = [
    {
      title: "BIOTECHNOLOGY",
      desc: "Understanding life at its foundation.",
      number: "01",
      glow: "group-hover:shadow-[0_0_50px_rgba(59,130,246,0.15)]",
    },
    {
      title: "ARTIFICIAL INTELLIGENCE",
      desc: "Transforming complexity into insight.",
      number: "02",
      glow: "group-hover:shadow-[0_0_50px_rgba(147,197,253,0.12)]",
    },
    {
      title: "SPACE MEDICINE",
      desc: "Preparing humanity for extreme environments.",
      number: "03",
      glow: "group-hover:shadow-[0_0_50px_rgba(59,130,246,0.15)]",
    },
  ];

  return (
    <section className="relative bg-black min-h-screen flex flex-col justify-center py-24 px-6 md:px-16 z-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid md:grid-cols-3 gap-6">
          {pillars.map((pillar, i) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.8, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="group relative border border-white/5 bg-white/[0.01] hover:border-blue-500/20 hover:bg-white/[0.03] transition-all duration-700 p-12 flex flex-col justify-between h-[380px] md:h-[450px] overflow-hidden"
            >
              <div className="flex justify-between items-start">
                <span className="font-mono text-xs tracking-widest text-white/20">
                  {pillar.number}
                </span>
                <div className={`w-2 h-2 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ${pillar.glow}`} />
              </div>

              <div>
                <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white mb-4 leading-none">
                  {pillar.title}
                </h3>
                <p className="text-white/45 text-sm md:text-base font-light leading-relaxed">
                  {pillar.desc}
                </p>
              </div>

              {/* Bottom active animation line */}
              <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-gradient-to-r from-blue-500 to-transparent group-hover:w-full transition-all duration-700" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   SECTION 5: ORBITAL TRAJECTORY STATEMENT
───────────────────────────────────────────── */
function FutureMedicineSection() {
  return (
    <section className="relative bg-black min-h-screen flex items-center justify-center overflow-hidden z-10 border-t border-white/5">
      {/* Background Orbital trajectory lines */}
      <div className="absolute inset-0 opacity-15 pointer-events-none flex items-center justify-center">
        <svg className="w-[120%] h-[120%] stroke-blue-500" viewBox="0 0 1000 600" fill="none">
          <motion.path
            d="M -50 400 C 300 200 700 200 1050 400"
            strokeWidth="0.8"
            strokeDasharray="4 8"
            animate={{ strokeDashoffset: [0, -40] }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          />
          <motion.path
            d="M -50 200 C 350 450 650 450 1050 200"
            strokeWidth="0.5"
            strokeDasharray="2 12"
            animate={{ strokeDashoffset: [0, 40] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
        </svg>
      </div>

      <div className="relative z-10 text-center px-6 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col gap-4"
        >
          <span className="text-[clamp(2.5rem,7vw,6.5rem)] font-extrabold tracking-tight leading-[0.95] text-white block">
            THE FUTURE OF MEDICINE
          </span>
          <span className="text-[clamp(2.5rem,7vw,6.5rem)] font-light tracking-tight leading-[0.95] text-white/40 block">
            WILL NOT BE CONFINED TO EARTH.
          </span>
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   SECTION 6: WHAT WE ARE BUILDING (RESEARCH)
───────────────────────────────────────────── */
function WhatWeAreBuildingSection() {
  const cards = [
    {
      title: "Human Performance Systems",
      desc: "Monitoring cognition, resilience, and physiological readiness.",
    },
    {
      title: "Autonomous Health Technologies",
      desc: "Supporting healthcare where immediate medical access is impossible.",
    },
    {
      title: "Precision Biotechnology",
      desc: "Advancing next-generation health solutions.",
    },
    {
      title: "Space Health Research",
      desc: "Studying the biological challenges of human exploration.",
    },
  ];

  return (
    <section className="relative bg-black min-h-screen flex flex-col justify-center py-28 px-6 md:px-16 z-10 border-t border-white/5">
      <div className="max-w-6xl mx-auto w-full">
        <div className="mb-20">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-[10px] tracking-[0.3em] uppercase text-blue-400 font-mono mb-4"
          >
            Research & Innovation
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold tracking-tight text-white"
          >
            WHAT WE ARE BUILDING
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-2 gap-[1px] bg-white/5">
          {cards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              className="bg-black hover:bg-white/[0.02] p-12 transition-colors duration-500 flex flex-col gap-4 border border-white/5"
            >
              <h3 className="text-xl md:text-2xl font-bold tracking-tight text-white">
                {card.title}
              </h3>
              <p className="text-white/45 text-sm md:text-base font-light leading-relaxed">
                {card.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   SECTION 7: VISION STATEMENT
───────────────────────────────────────────── */
function VisionStatementSection() {
  return (
    <section className="relative bg-black min-h-screen flex items-center justify-center px-6 z-10 border-t border-white/5">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
          className="flex flex-col gap-8 text-[clamp(1.5rem,4vw,3.2rem)] font-light leading-[1.3] text-white/50"
        >
          <p>
            "Every great era of exploration required{" "}
            <span className="text-white font-medium">new technologies.</span>"
          </p>
          <p className="text-white font-bold">
            "The next era will require{" "}
            <span className="text-blue-400">new biology.</span>"
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   SECTION 8: ABOUT AVENNIX
───────────────────────────────────────────── */
function AboutSection() {
  return (
    <section className="relative bg-black min-h-[80vh] flex items-center justify-center px-6 md:px-16 z-10 border-t border-white/5">
      <div className="max-w-3xl mx-auto text-center flex flex-col gap-10">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-[10px] tracking-[0.3em] uppercase text-white/30 font-mono"
        >
          About Avennix
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
          className="flex flex-col gap-6 text-base md:text-lg text-white/60 font-light leading-relaxed"
        >
          <p>
            We believe the future of human health will be shaped by the convergence of biotechnology, artificial intelligence, and space medicine.
          </p>
          <p>
            Our mission is to create technologies that enable healthier lives, stronger performance, and sustainable human exploration beyond Earth.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   FINAL SECTION & NAVIGATION
───────────────────────────────────────────── */
function AvennixNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
        className={`fixed top-0 inset-x-0 z-50 flex items-center justify-between px-8 md:px-14 h-20 transition-all duration-500 ${
          scrolled || mobileMenuOpen ? "bg-black/95 backdrop-blur-xl border-b border-white/5" : ""
        }`}
      >
        <AvennixLogo />
        
        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-10">
          {["Mission", "Research", "Technology", "BioLabs", "Careers"].map(
            (item) => (
              <a
                key={item}
                href="#"
                className="text-[10px] tracking-[0.25em] uppercase text-white/40 hover:text-white transition-colors duration-300 font-semibold font-mono"
              >
                {item}
              </a>
            )
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex md:hidden flex-col gap-1.5 justify-center items-center w-8 h-8 focus:outline-none z-50 relative"
          aria-label="Toggle mobile menu"
          id="mobile-menu-toggle-btn"
        >
          <span
            className={`w-5 h-[1px] bg-white transition-transform duration-300 ${
              mobileMenuOpen ? "rotate-45 translate-y-1" : ""
            }`}
          />
          <span
            className={`w-5 h-[1px] bg-white transition-opacity duration-300 ${
              mobileMenuOpen ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`w-5 h-[1px] bg-white transition-transform duration-300 ${
              mobileMenuOpen ? "-rotate-45 -translate-y-1" : ""
            }`}
          />
        </button>
      </motion.nav>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40 bg-black/98 backdrop-blur-2xl flex flex-col justify-center px-12 md:hidden"
          >
            <div className="flex flex-col gap-8">
              {["Mission", "Research", "Technology", "BioLabs", "Careers"].map(
                (item, index) => (
                  <motion.a
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.08, duration: 0.5 }}
                    key={item}
                    href="#"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-2xl tracking-[0.15em] uppercase text-white/50 hover:text-white transition-colors duration-300 font-light"
                    id={`mobile-nav-link-${item.toLowerCase()}`}
                  >
                    {item}
                  </motion.a>
                )
              )}
            </div>
            
            <div className="absolute bottom-12 left-12 right-12 border-t border-white/10 pt-8 flex flex-col gap-4">
              <span className="text-[9px] tracking-[0.15em] uppercase text-white/30 font-mono">
                © Avennix Pharmaceuticals Ltd.
              </span>
              <span className="text-[9px] tracking-[0.1em] uppercase text-white/20 font-mono">
                CDSCO Compliant · WHO-GMP Certified
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ─────────────────────────────────────────────
   SUN ORB — scroll-linked glow with animated corona
───────────────────────────────────────────── */
function SunOrb() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { scrollYProgress } = useScroll();
  const opacity   = useTransform(scrollYProgress, [0, 0.14], [1, 0]);
  const scale     = useTransform(scrollYProgress, [0, 0.14], [1, 0.3]);
  const glowScale = useTransform(scrollYProgress, [0, 0.09], [1, 0.5]);

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
      console.error("WebGL init failed for SunOrb", e);
    }
    if (!gl) return;

    const vsSource = `
      attribute vec2 a_position;
      varying vec2 v_uv;
      void main() {
        v_uv = a_position * 0.5 + 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fsSource = `
      precision highp float;
      varying vec2 v_uv;
      uniform float u_time;

      /* ── Hashing & Noise ── */
      float hash(vec3 p) {
        p  = fract(p * vec3(443.8975, 397.2973, 491.1871));
        p += dot(p.xyz, p.yzx + 19.19);
        return fract(p.x * p.y * p.z);
      }
      float hash2(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
      }

      float noise3(vec3 p) {
        vec3 i = floor(p), f = fract(p);
        vec3 u = f*f*(3.0-2.0*f);
        return mix(
          mix(mix(hash(i),             hash(i+vec3(1,0,0)),u.x),
              mix(hash(i+vec3(0,1,0)), hash(i+vec3(1,1,0)),u.x),u.y),
          mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),u.x),
              mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),u.x),u.y), u.z);
      }
      float noise2(vec2 p) {
        vec2 i = floor(p), f = fract(p);
        vec2 u = f*f*(3.0-2.0*f);
        return mix(mix(hash2(i),hash2(i+vec2(1,0)),u.x),
                   mix(hash2(i+vec2(0,1)),hash2(i+vec2(1,1)),u.x),u.y);
      }

      /* ── 6-octave FBM ── */
      float fbm3(vec3 p) {
        float v=0.,a=.5;
        for(int i=0;i<6;i++){v+=a*noise3(p);p*=2.03;a*=.48;}
        return v;
      }
      float fbm2(vec2 p) {
        float v=0.,a=.5;
        for(int i=0;i<5;i++){v+=a*noise2(p);p*=2.07;a*=.48;}
        return v;
      }

      /* ── Rotation helpers ── */
      mat2 rot2(float a){float c=cos(a),s=sin(a);return mat2(c,-s,s,c);}

      void main() {
        vec2 p  = v_uv * 2.0 - 1.0;         /* [-1,+1] NDC              */
        float d = length(p);

        /* ─── Sun disk radius in NDC ─── */
        float R = 0.58;
        float dn = d / R;                    /* 1.0 = edge of disk       */

        /* ─── Sharp anti-aliased disk mask ─── */
        float diskMask = smoothstep(1.02, 0.97, dn);

        /* ─────────────────────────────────────
           PHOTOSPHERE — 3-D sphere shading
        ───────────────────────────────────────*/
        vec3 diskColor = vec3(0.0);
        if (dn < 1.06) {
          /* reconstruct sphere normal */
          float zRaw = sqrt(max(0.0, 1.0 - min(1.0, dn*dn)));
          vec3 N = normalize(vec3(p.x/R, p.y/R, zRaw));

          /* differential rotation: equator faster (solar-like 25-35 day) */
          float latFade  = abs(N.y);
          float rotSpeed = mix(0.018, 0.011, latFade);
          float angle    = u_time * rotSpeed;
          mat3 rotY = mat3(cos(angle),0,sin(angle), 0,1,0, -sin(angle),0,cos(angle));
          vec3 rN = rotY * N;

          /* ── Plasma / granulation turbulence ── */
          float plasma = fbm3(rN * 5.5  + vec3(0, 0, u_time * 0.09));
          float gran   = fbm3(rN * 14.0 + vec3(u_time*0.07, 0, u_time*0.05));

          /* ── Limb darkening (physically based, 5-term) ── */
          float cosT   = N.z;
          float limb   = 1.0
                       - 0.47*(1.0-cosT)
                       - 0.23*(1.0-cosT)*(1.0-cosT)
                       - 0.06*pow(1.0-cosT,3.0)
                       - 0.03*pow(1.0-cosT,4.0);
          limb = clamp(limb, 0.0, 1.0);

          /* ── Sunspots ── */
          vec3 sN2 = rN * 4.2 + vec3(1.3, 0.7, u_time*0.005);
          float spotNoise = fbm3(sN2);
          float spotMask  = smoothstep(0.61, 0.54, spotNoise) * smoothstep(0.3, 0.7, cosT);
          float spotDepth = smoothstep(0.54, 0.45, spotNoise);
          vec3  umbraColor   = vec3(0.12, 0.05, 0.02);
          vec3  penumbraColor= vec3(0.45, 0.18, 0.04);
          vec3  spotColor    = mix(umbraColor, penumbraColor, spotDepth);

          /* ── Surface temperature field → colour ── */
          float temp = cosT * 1.3 + (plasma - 0.5)*0.45 + (gran - 0.5)*0.18;
          temp = clamp(temp, 0.0, 1.0);

          vec3 c_dark  = vec3(0.80, 0.06, 0.00);
          vec3 c_warm  = vec3(1.00, 0.55, 0.02);
          vec3 c_gold  = vec3(1.00, 0.82, 0.18);
          vec3 c_white = vec3(1.00, 0.98, 0.90);

          vec3 surfColor = mix(c_dark, c_warm,  smoothstep(0.00, 0.30, temp));
               surfColor = mix(surfColor, c_gold,  smoothstep(0.30, 0.65, temp));
               surfColor = mix(surfColor, c_white, smoothstep(0.65, 1.00, temp));

          /* ── Chromospheric spicules at limb (thin bright needles) ── */
          float limbEdge = smoothstep(0.72, 0.94, cosT < 0.001 ? 0.0 : cosT);
          limbEdge = 1.0 - limbEdge;  /* bright near edge */
          float spicule = pow(fbm3(rN * 22.0 + vec3(u_time * 0.14,0,0)), 3.0) * limbEdge * 0.8;
          surfColor += vec3(1.0, 0.92, 0.7) * spicule;

          /* ── Merge spots ── */
          surfColor = mix(surfColor, spotColor, spotMask * (1.0 - spicule));

          /* ── Apply limb darkening ── */
          surfColor *= limb;

          /* ── Photosphere hot core (blue-white centre) ── */
          float hotCore = smoothstep(0.45, 0.0, dn) * 0.22;
          surfColor    += vec3(0.18, 0.22, 0.30) * hotCore;

          diskColor = surfColor;
        }

        /* ─────────────────────────────────────
           CORONA — structured streamer rays
        ───────────────────────────────────────*/
        float angle2d    = atan(p.y, p.x);

        /* slow rotating wind streams */
        float streamerRot = u_time * 0.006;
        vec2  streamerUV  = vec2(
          (angle2d + streamerRot) / (2.0*3.14159),
          (dn - 0.90) * 2.2
        );
        float streamer = fbm2(streamerUV * vec2(8.0, 1.8));

        /* radial fast-wind plumes */
        vec2 plume1UV = vec2(angle2d*4.0/3.14159 + u_time*0.04, dn*2.5);
        vec2 plume2UV = vec2(angle2d*3.0/3.14159 - u_time*0.03, dn*1.8);
        float plume = mix(fbm2(plume1UV*2.0), fbm2(plume2UV*2.5), 0.45);

        float coronaFade = exp(-5.5*(dn - 0.88)) * step(0.88, dn) * (1.0 - step(3.0, dn));
        float coronaStr  = (0.28 + streamer*0.6 + plume*0.35) * coronaFade;
        coronaStr = clamp(coronaStr, 0.0, 1.0);

        vec3 cInner = vec3(1.00, 0.82, 0.22);
        vec3 cMid   = vec3(1.00, 0.35, 0.04);
        vec3 cOuter = vec3(0.60, 0.10, 0.02);
        vec3 coronaColor = mix(cOuter, cMid, smoothstep(1.3, 1.0, dn));
             coronaColor = mix(coronaColor, cInner, smoothstep(1.05, 0.92, dn));

        /* ─────────────────────────────────────
           SOLAR PROMINENCES — looping arcs
        ───────────────────────────────────────*/
        float prom = 0.0;
        for(int k=0;k<3;k++){
          float kf    = float(k);
          float pBase = 0.9 + kf*0.07;
          float aOff  = 1.05 + kf*2.09;
          float pAng  = angle2d - aOff - u_time*(0.008+kf*0.003);
          /* torus cross-section */
          vec2  torusP= vec2(pBase*cos(pAng)-d*cos(angle2d-aOff),
                             pBase*sin(pAng)-d*sin(angle2d-aOff));
          float torusD = length(vec2(length(vec2(d,0.))-pBase, p.y));
          float arc = smoothstep(0.12+kf*0.015, 0.0, torusD)
                    * smoothstep(0.88, 1.10, dn)
                    * (0.5+0.5*sin(u_time*0.4+kf*1.3));
          prom = max(prom, arc);
        }
        vec3 promColor = mix(vec3(1.0,0.55,0.1), vec3(1.0,0.9,0.5), prom);

        /* ─────────────────────────────────────
           COMPOSE
        ───────────────────────────────────────*/
        vec3 finalColor  = coronaColor * coronaStr;
             finalColor  = mix(finalColor, promColor, prom * 0.85);
             finalColor  = mix(finalColor, diskColor, diskMask);

        float finalAlpha = mix(coronaStr, 1.0, diskMask);
             finalAlpha += prom * 0.9;
             finalAlpha *= smoothstep(2.8, 0.9, dn);
             finalAlpha  = clamp(finalAlpha, 0.0, 1.0);

        gl_FragColor = vec4(finalColor, finalAlpha);
      }
    `;

    const compile = (src: string, type: number): WebGLShader | null => {
      const sh = gl!.createShader(type);
      if (!sh) return null;
      gl!.shaderSource(sh, src);
      gl!.compileShader(sh);
      if (!gl!.getShaderParameter(sh, gl!.COMPILE_STATUS)) {
        console.error("SunOrb shader error:", gl!.getShaderInfoLog(sh));
        gl!.deleteShader(sh);
        return null;
      }
      return sh;
    };

    const vs = compile(vsSource, gl.VERTEX_SHADER);
    const fs = compile(fsSource, gl.FRAGMENT_SHADER);
    if (!vs || !fs) return;

    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error("SunOrb link error:", gl.getProgramInfoLog(prog));
      return;
    }
    gl.useProgram(prog);

    const posLoc  = gl.getAttribLocation(prog, "a_position");
    const timeLoc = gl.getUniformLocation(prog, "u_time");

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    let t0 = Date.now(), raf: number;
    const tick = () => {
      if (!gl) return;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(timeLoc, (Date.now() - t0) / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      gl?.deleteProgram(prog);
      gl?.deleteShader(vs);
      gl?.deleteShader(fs);
      gl?.deleteBuffer(buf);
    };
  }, []);

  return (
    <motion.div
      style={{ opacity, scale, position: "relative" }}
      className="pointer-events-none select-none"
      aria-hidden
    >
      {/* ── Outer diffuse glow halo ── */}
      <motion.div
        style={{
          scale: glowScale,
          position: "absolute",
          top: 0,
          left: 0,
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,160,20,0.18) 0%, rgba(255,80,10,0.06) 40%, transparent 70%)",
          filter: "blur(28px)",
        }}
        className="w-[340px] h-[340px] md:w-[560px] md:h-[560px]"
      />

      {/* ── Breathing inner corona ── */}
      <motion.div
        animate={{ scale: [1, 1.12, 1], opacity: [0.55, 1.0, 0.55] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,220,60,0.22) 0%, rgba(255,140,10,0.10) 48%, transparent 72%)",
          filter: "blur(12px)",
        }}
        className="w-[220px] h-[220px] md:w-[340px] md:h-[340px]"
      />

      {/* ── WebGL hyper-realistic 3-D Sun ── */}
      <canvas
        ref={canvasRef}
        width={500}
        height={500}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          transform: "translate(-50%, -50%)",
        }}
        className="w-[260px] h-[260px] md:w-[400px] md:h-[400px]"
      />
    </motion.div>
  );
}


/* ─────────────────────────────────────────────
   SECTION REVEAL — scroll-triggered entrance
───────────────────────────────────────────── */
function SectionReveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 70 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.12 }}
      transition={{ duration: 1.1, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default function AvenixCarePage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="relative bg-black text-white overflow-x-hidden font-sans selection:bg-blue-500/20">
      {mounted && <StarField count={280} />}

      <AvennixNav />

      {/* ──────── SECTION 1: HERO ──────── */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center overflow-hidden">
        {/* Subtle radial spotlight */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 60% at 50% 45%, rgba(59,130,246,0.10) 0%, transparent 75%)",
          }}
        />

        {/* ☀️ Sun — top-left, scroll-linked glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div style={{ position: "absolute", top: "7%", left: "6%", zIndex: 6 }}>
            {mounted && <SunOrb />}
          </div>
        </div>

        {/* Warm sunlight tint — top-left radial matching sun position */}
        <div
          className="absolute inset-0 pointer-events-none z-[5]"
          style={{
            background:
              "radial-gradient(ellipse 55% 50% at 18% 12%, rgba(255,200,60,0.09) 0%, rgba(255,150,20,0.04) 40%, transparent 70%)",
          }}
        />

        {/* Real rotating Earth globe */}
        <div className="absolute inset-0 flex items-center justify-center opacity-55 pointer-events-none z-[4]">
          <EarthOrb />
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 inset-x-0 h-64 bg-gradient-to-t from-black to-transparent pointer-events-none z-10" />

        {/* Content */}
        <div className="relative z-20 flex flex-col items-center gap-6 px-6 mt-16">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-[clamp(2.5rem,7vw,7rem)] font-extrabold tracking-tight leading-none text-white max-w-4xl"
          >
            THE NEXT FRONTIER OF HUMAN HEALTH
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.4, delay: 0.7 }}
            className="text-base md:text-xl text-white/50 tracking-[0.05em] font-light max-w-xl"
          >
            Advancing Human Health, <span className="text-white">On Earth and Beyond.</span>
          </motion.p>

          <motion.a
            href="#sequence"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.1 }}
            className="mt-6 text-[10px] tracking-[0.3em] uppercase text-white hover:text-blue-300 border border-white/20 hover:border-blue-400 px-8 py-3.5 transition-all duration-300 font-mono font-semibold"
          >
            EXPLORE THE MISSION
          </motion.a>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 1.4 }}
            className="mt-12 text-[10px] tracking-[0.25em] text-white/30 uppercase font-mono"
          >
            Biotechnology • Artificial Intelligence • Space Medicine
          </motion.p>
        </div>

        {/* Scroll indicator line */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3">
          <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-blue-500/50 to-transparent animate-pulse" />
        </div>
      </section>

      {/* ──────── SECTION 2: CINEMATIC SEQUENCE ──────── */}
      <div id="sequence">
        <ScrollSequence />
      </div>

      {/* ──────── SECTION 3: CELLS TO SPACE ──────── */}
      <SectionReveal>
        <CellsToSpaceSection />
      </SectionReveal>

      {/* ──────── SECTION 4: THREE PILLARS ──────── */}
      <SectionReveal delay={0.05}>
        <PillarsSection />
      </SectionReveal>

      {/* ──────── SECTION 5: ORBITAL TRAJECTORY STATEMENT ──────── */}
      <SectionReveal delay={0.05}>
        <FutureMedicineSection />
      </SectionReveal>

      {/* ──────── SECTION 6: WHAT WE ARE BUILDING ──────── */}
      <SectionReveal delay={0.05}>
        <WhatWeAreBuildingSection />
      </SectionReveal>

      {/* ──────── SECTION 7: VISION STATEMENT ──────── */}
      <VisionStatementSection />

      {/* ──────── SECTION 8: ABOUT ──────── */}
      <AboutSection />

      {/* ──────── SECTION 9: FINAL CTA ──────── */}
      <section className="relative bg-black min-h-screen flex flex-col items-center justify-center overflow-hidden z-10 border-t border-white/5">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 65% 65% at 50% 45%, rgba(59,130,246,0.12) 0%, transparent 75%)",
          }}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 flex flex-col items-center gap-10 text-center px-6"
        >
          <AvennixLogo className="scale-125 mb-4" />

          <div className="flex flex-col gap-3">
            <h2 className="text-[clamp(2rem,5vw,4.5rem)] font-extrabold tracking-tight leading-none text-white">
              ADVANCING HUMAN HEALTH,
            </h2>
            <h2 className="text-[clamp(2rem,5vw,4.5rem)] font-light tracking-tight leading-none text-white/40">
              ON EARTH AND BEYOND.
            </h2>
          </div>

          <motion.a
            href="https://www.avennixpharma.in"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mt-6 inline-flex items-center gap-3 px-12 py-4.5 bg-white text-black text-[10px] tracking-[0.3em] uppercase font-black hover:bg-blue-50 transition-colors duration-300 font-mono"
          >
            JOIN THE MISSION
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
              <path
                d="M1 7h12M7 1l6 6-6 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.a>
        </motion.div>
      </section>

      {/* ──────── FOOTER ──────── */}
      <footer className="relative bg-black z-10 border-t border-white/5 px-8 md:px-14 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="text-white/20 text-[9px] tracking-[0.2em] uppercase font-mono">
          © 2024 Avennix Pharmaceuticals Ltd. All Rights Reserved.
        </span>
        <span className="text-white/15 text-[9px] tracking-[0.15em] uppercase font-mono">
          CDSCO Compliant · WHO-GMP Certified
        </span>
      </footer>
    </div>
  );
}

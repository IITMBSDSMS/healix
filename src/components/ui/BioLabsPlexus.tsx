"use client";

import React, { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
}

export function BioLabsPlexus() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    let paused = false;

    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    const particleCount = isMobile ? 30 : 65;
    const connectionDistance = isMobile ? 100 : 130;
    const mouseDistance = 180;

    const resizeCanvas = () => {
      if (containerRef.current && canvas) {
        canvas.width = containerRef.current.clientWidth;
        canvas.height = containerRef.current.clientHeight;
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas, { passive: true });

    const handleVisibilityChange = () => {
      paused = document.hidden;
      if (!paused) draw();
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Color theme matching Brand Accents: #00C27A, #14B8A6, #7C3AED
    const colors = [
      "rgba(0, 194, 122, 0.65)",  // Primary Accent (Green)
      "rgba(20, 184, 166, 0.65)", // Secondary Accent (Teal)
      "rgba(124, 58, 237, 0.55)", // Highlight Accent (Purple)
    ];

    particles = Array.from({ length: particleCount }, () => {
      const w = canvas.width || 500;
      const h = canvas.height || 400;
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 1.2,
        color: colors[Math.floor(Math.random() * colors.length)],
      };
    });

    const draw = () => {
      if (paused) return;
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const mouse = mouseRef.current;

      // Draw all particle connection lines
      ctx.beginPath();
      ctx.strokeStyle = "rgba(148, 163, 184, 0.08)"; // Very subtle slate lines
      ctx.lineWidth = 0.7;

      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
          }
        }
      }
      ctx.stroke();

      // Mouse interactive connections
      if (mouse.x > 0 && mouse.y > 0) {
        ctx.beginPath();
        ctx.strokeStyle = "rgba(20, 184, 166, 0.12)"; // Teal interactive lines
        ctx.lineWidth = 0.9;
        for (let i = 0; i < particles.length; i++) {
          const p1 = particles[i];
          const dx = p1.x - mouse.x;
          const dy = p1.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouseDistance) {
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(mouse.x, mouse.y);
          }
        }
        ctx.stroke();
      }

      // Update and draw particles
      particles.forEach((p) => {
        // Mouse gravity pull
        if (mouse.x > 0 && mouse.y > 0) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouseDistance && dist > 0) {
            const force = (mouseDistance - dist) / mouseDistance;
            p.vx += (dx / dist) * force * 0.012;
            p.vy += (dy / dist) * force * 0.012;
          }
        }

        // Limit speed to preserve smooth flow
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        const maxSpeed = 1.0;
        if (speed > maxSpeed) {
          p.vx = (p.vx / speed) * maxSpeed;
          p.vy = (p.vy / speed) * maxSpeed;
        }

        p.x += p.vx;
        p.y += p.vy;

        // Bounce on boundaries
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        p.x = Math.max(0, Math.min(canvas.width, p.x));
        p.y = Math.max(0, Math.min(canvas.height, p.y));

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const frameRef = useRef(0);
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    frameRef.current++;
    if (frameRef.current % 2 !== 0) return; // Throttled events
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleMouseLeave = () => {
    mouseRef.current = { x: -1000, y: -1000 };
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="w-full h-full relative overflow-hidden"
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}

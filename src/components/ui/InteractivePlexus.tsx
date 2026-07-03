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

export function InteractivePlexus() {
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

    // Fewer particles on mobile for performance
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 22 : 45;
    const connectionDistance = isMobile ? 90 : 110;
    const mouseDistance = 160;

    const resizeCanvas = () => {
      if (containerRef.current && canvas) {
        canvas.width = containerRef.current.clientWidth;
        canvas.height = containerRef.current.clientHeight;
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas, { passive: true });

    // Pause when tab is hidden — saves battery + CPU
    const handleVisibilityChange = () => {
      paused = document.hidden;
      if (!paused) draw();
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Initialize particles
    const colors = ["rgba(245, 106, 0, 0.7)", "rgba(11, 74, 158, 0.7)"];
    particles = Array.from({ length: particleCount }, () => {
      const w = canvas.width || 500;
      const h = canvas.height || 400;
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1.5,
        color: colors[Math.floor(Math.random() * colors.length)],
      };
    });

    const draw = () => {
      if (paused) return;
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const mouse = mouseRef.current;

      // Batch all connection lines into a single path — single stroke() call
      ctx.beginPath();
      ctx.strokeStyle = "rgba(139, 150, 169, 0.18)";
      ctx.lineWidth = 0.8;

      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy); // faster than Math.hypot

          if (dist < connectionDistance) {
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
          }
        }
      }
      ctx.stroke(); // one draw call for all lines

      // Mouse connections (separate path)
      if (mouse.x > 0 && mouse.y > 0) {
        ctx.beginPath();
        ctx.strokeStyle = "rgba(245, 106, 0, 0.2)";
        ctx.lineWidth = 1.0;
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

      // Update and draw particles — NO shadowBlur (most expensive canvas op)
      particles.forEach((p) => {
        // Mouse attraction
        if (mouse.x > 0 && mouse.y > 0) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouseDistance && dist > 0) {
            const force = (mouseDistance - dist) / mouseDistance;
            p.vx += (dx / dist) * force * 0.02;
            p.vy += (dy / dist) * force * 0.02;
          }
        }

        // Speed limit
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        const maxSpeed = 1.2;
        if (speed > maxSpeed) {
          p.vx = (p.vx / speed) * maxSpeed;
          p.vy = (p.vy / speed) * maxSpeed;
        }

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        p.x = Math.max(0, Math.min(canvas.width, p.x));
        p.y = Math.max(0, Math.min(canvas.height, p.y));

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
        // shadowBlur removed — saves ~40% GPU work per frame
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

  // Throttle mouse events — skip every other event
  const frameRef = useRef(0);
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    frameRef.current++;
    if (frameRef.current % 2 !== 0) return;
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
      className="w-full h-full relative"
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}

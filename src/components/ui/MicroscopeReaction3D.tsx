"use client";

import React, { useEffect, useRef, useState } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
}

interface Cell {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  size: number;
  pulseOffset: number;
  splitProgress: number; // 0 to 1 (mitosis)
  isSplitting: boolean;
  angle: number;
}

export function MicroscopeReaction3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 500, height: 680 });
  const mousePos = useRef({ x: 250, y: 340, active: false });

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth || 500,
          height: containerRef.current.clientHeight || 680,
        });
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    const timer = setTimeout(handleResize, 100);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    // High DPI support
    const dpr = window.devicePixelRatio || 1;
    canvas.width = dimensions.width * dpr;
    canvas.height = dimensions.height * dpr;
    ctx.scale(dpr, dpr);

    // Zoom reaction lens parameters
    const lensRadius = Math.min(dimensions.width * 0.28, 120);
    const lensX = dimensions.width * 0.72;
    const lensY = dimensions.height * 0.35;

    // Initialize cells for the ongoing reaction
    const cells: Cell[] = [
      { x: lensX - 40, y: lensY - 30, targetX: lensX - 45, targetY: lensY - 25, size: 16, pulseOffset: 0, splitProgress: 0, isSplitting: false, angle: 0 },
      { x: lensX + 35, y: lensY + 20, targetX: lensX + 30, targetY: lensY + 25, size: 14, pulseOffset: Math.PI / 3, splitProgress: 0, isSplitting: false, angle: Math.PI / 4 },
      { x: lensX - 10, y: lensY + 45, targetX: lensX - 15, targetY: lensY + 40, size: 18, pulseOffset: Math.PI / 1.5, splitProgress: 0, isSplitting: false, angle: Math.PI / 2 },
      { x: lensX + 10, y: lensY - 40, targetX: lensX, targetY: lensY - 45, size: 22, pulseOffset: 0, splitProgress: 0, isSplitting: false, angle: Math.PI / 6 },
    ];

    // Reactive chemical particles list
    let particles: Particle[] = [];

    // Helper to generate a realistic polished metallic/chrome gradient
    const getMetalGradient = (x1: number, y1: number, x2: number, y2: number, type: "dark" | "chrome" | "gold" = "dark") => {
      const grad = ctx.createLinearGradient(x1, y1, x2, y2);
      if (type === "dark") {
        grad.addColorStop(0, "#18181b");
        grad.addColorStop(0.2, "#3f3f46");
        grad.addColorStop(0.35, "#52525b"); // specular highlight
        grad.addColorStop(0.5, "#27272a");
        grad.addColorStop(0.8, "#18181b");
        grad.addColorStop(1, "#09090b");
      } else if (type === "chrome") {
        grad.addColorStop(0, "#71717a");
        grad.addColorStop(0.18, "#d4d4d8");
        grad.addColorStop(0.3, "#fafafa"); // bright glare
        grad.addColorStop(0.55, "#a1a1aa");
        grad.addColorStop(0.85, "#52525b");
        grad.addColorStop(1, "#27272a");
      } else { // gold / brass
        grad.addColorStop(0, "#78350f");
        grad.addColorStop(0.2, "#d97706");
        grad.addColorStop(0.4, "#fef08a"); // glare
        grad.addColorStop(0.65, "#b45309");
        grad.addColorStop(1, "#451a03");
      }
      return grad;
    };

    const drawMicroscope = (t: number) => {
      const cx = dimensions.width * 0.38;
      const cy = dimensions.height * 0.52;
      const scale = Math.min(dimensions.width / 500, 1);

      ctx.save();
      // Apply breathing float
      const bounce = Math.sin(t * 0.02) * 4;
      ctx.translate(0, bounce);

      // ─── 0. BASE PLINTH DROP SHADOW ───
      ctx.beginPath();
      ctx.ellipse(cx, cy + 185 * scale, 95 * scale, 18 * scale, 0, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(9, 9, 11, 0.28)";
      ctx.filter = "blur(10px)";
      ctx.fill();
      ctx.filter = "none"; // Reset filter

      // ─── 1. BASE PLINTH (Heavy textured block) ───
      // Bottom plinth rim
      ctx.beginPath();
      ctx.moveTo(cx - 82 * scale, cy + 180 * scale);
      ctx.lineTo(cx + 82 * scale, cy + 180 * scale);
      ctx.lineTo(cx + 70 * scale, cy + 168 * scale);
      ctx.lineTo(cx - 70 * scale, cy + 168 * scale);
      ctx.closePath();
      ctx.fillStyle = getMetalGradient(cx - 80 * scale, 0, cx + 80 * scale, 0, "dark");
      ctx.fill();
      ctx.strokeStyle = "#52525b";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Main base pedestal wedge
      ctx.beginPath();
      ctx.moveTo(cx - 70 * scale, cy + 168 * scale);
      ctx.lineTo(cx + 70 * scale, cy + 168 * scale);
      ctx.lineTo(cx + 42 * scale, cy + 144 * scale);
      ctx.lineTo(cx - 42 * scale, cy + 144 * scale);
      ctx.closePath();
      ctx.fillStyle = getMetalGradient(cx - 50 * scale, 0, cx + 50 * scale, 0, "dark");
      ctx.fill();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
      ctx.stroke();

      // SPECULAR BASE RING (Chrome pillar mount)
      ctx.beginPath();
      ctx.ellipse(cx, cy + 144 * scale, 22 * scale, 7 * scale, 0, 0, Math.PI * 2);
      ctx.fillStyle = getMetalGradient(cx - 20 * scale, 0, cx + 20 * scale, 0, "chrome");
      ctx.fill();
      ctx.stroke();

      // ─── 2. HEAVY ARM & FOCUS JOINT ───
      // Heavy curved support arm
      ctx.beginPath();
      ctx.moveTo(cx - 14 * scale, cy + 142 * scale);
      ctx.bezierCurveTo(
        cx - 75 * scale, cy + 70 * scale, 
        cx - 68 * scale, cy - 65 * scale, 
        cx + 10 * scale, cy - 85 * scale
      );
      ctx.lineTo(cx + 26 * scale, cy - 68 * scale);
      ctx.bezierCurveTo(
        cx - 40 * scale, cy - 50 * scale, 
        cx - 42 * scale, cy + 70 * scale, 
        cx + 14 * scale, cy + 142 * scale
      );
      ctx.closePath();
      
      const armGrad = ctx.createLinearGradient(cx - 60 * scale, cy - 50 * scale, cx + 20 * scale, cy + 100 * scale);
      armGrad.addColorStop(0, "#27272a");
      armGrad.addColorStop(0.3, "#3f3f46");
      armGrad.addColorStop(0.42, "#52525b"); // specular highlight reflection
      armGrad.addColorStop(0.55, "#27272a");
      armGrad.addColorStop(1, "#18181b");
      ctx.fillStyle = armGrad;
      ctx.fill();
      
      ctx.strokeStyle = "#52525b";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Edge highlight stroke to give 3D bevel to the arm
      ctx.beginPath();
      ctx.moveTo(cx - 14 * scale, cy + 140 * scale);
      ctx.bezierCurveTo(
        cx - 73 * scale, cy + 68 * scale, 
        cx - 66 * scale, cy - 63 * scale, 
        cx + 8 * scale, cy - 83 * scale
      );
      ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // ─── 3. METALLIC ADJUSTMENT DIALS ───
      // Large Coarse adjustment dial (textured cylinder)
      const knobX = cx - 32 * scale;
      const knobY = cy + 105 * scale;
      ctx.beginPath();
      ctx.ellipse(knobX, knobY, 20 * scale, 20 * scale, 0, 0, Math.PI * 2);
      ctx.fillStyle = getMetalGradient(knobX - 20 * scale, knobY, knobX + 20 * scale, knobY, "dark");
      ctx.fill();
      ctx.strokeStyle = "#3f3f46";
      ctx.stroke();

      // Draw dial ridged grips (textured lines)
      ctx.strokeStyle = "#18181b";
      ctx.lineWidth = 1.5;
      for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 8) {
        const xStart = knobX + Math.cos(angle) * 16 * scale;
        const yStart = knobY + Math.sin(angle) * 16 * scale;
        const xEnd = knobX + Math.cos(angle) * 20 * scale;
        const yEnd = knobY + Math.sin(angle) * 20 * scale;
        ctx.beginPath();
        ctx.moveTo(xStart, yStart);
        ctx.lineTo(xEnd, yEnd);
        ctx.stroke();
      }

      // Fine adjustment dial (layered on top)
      ctx.beginPath();
      ctx.ellipse(knobX, knobY, 11 * scale, 11 * scale, 0, 0, Math.PI * 2);
      ctx.fillStyle = getMetalGradient(knobX - 11 * scale, knobY, knobX + 11 * scale, knobY, "chrome");
      ctx.fill();
      ctx.strokeStyle = "#71717a";
      ctx.stroke();

      // ─── 4. MECHANICAL STAGE CALIPER ASSEMBLY ───
      // Condenser base support bracket under stage
      ctx.beginPath();
      ctx.rect(cx - 15 * scale, cy + 45 * scale, 45 * scale, 15 * scale);
      ctx.fillStyle = getMetalGradient(cx - 15 * scale, 0, cx + 30 * scale, 0, "dark");
      ctx.fill();
      ctx.stroke();

      // Stage support collar (chrome)
      ctx.beginPath();
      ctx.rect(cx - 8 * scale, cy + 32 * scale, 30 * scale, 13 * scale);
      ctx.fillStyle = getMetalGradient(cx - 8 * scale, 0, cx + 22 * scale, 0, "chrome");
      ctx.fill();
      ctx.stroke();

      // Main platform stage (3D rectangular plate)
      ctx.beginPath();
      ctx.moveTo(cx - 72 * scale, cy + 32 * scale);
      ctx.lineTo(cx + 62 * scale, cy + 20 * scale);
      ctx.lineTo(cx + 82 * scale, cy + 42 * scale);
      ctx.lineTo(cx - 52 * scale, cy + 54 * scale);
      ctx.closePath();
      
      const stageGrad = ctx.createLinearGradient(cx - 70 * scale, cy + 30 * scale, cx + 80 * scale, cy + 45 * scale);
      stageGrad.addColorStop(0, "#09090b");
      stageGrad.addColorStop(0.3, "#27272a");
      stageGrad.addColorStop(0.7, "#18181b");
      stageGrad.addColorStop(1, "#020202");
      ctx.fillStyle = stageGrad;
      ctx.fill();
      
      // Beveled stage edge highlight
      ctx.strokeStyle = "#52525b";
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Mechanical slide vernier scale (metallic slide guide)
      ctx.beginPath();
      ctx.moveTo(cx - 28 * scale, cy + 26 * scale);
      ctx.lineTo(cx + 40 * scale, cy + 20 * scale);
      ctx.lineTo(cx + 43 * scale, cy + 26 * scale);
      ctx.lineTo(cx - 25 * scale, cy + 32 * scale);
      ctx.closePath();
      ctx.fillStyle = getMetalGradient(cx - 25 * scale, 0, cx + 40 * scale, 0, "chrome");
      ctx.fill();
      ctx.stroke();

      // ─── 5. LENS REFRACTION LIGHT (Under-stage illumination) ───
      // Condenser collector lens housing
      ctx.beginPath();
      ctx.ellipse(cx + 10 * scale, cy + 58 * scale, 18 * scale, 6 * scale, 0, 0, Math.PI * 2);
      ctx.fillStyle = getMetalGradient(cx - 5 * scale, 0, cx + 25 * scale, 0, "chrome");
      ctx.fill();
      ctx.stroke();

      // Glowing lens element
      ctx.beginPath();
      ctx.ellipse(cx + 10 * scale, cy + 57 * scale, 12 * scale, 4 * scale, 0, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(234, 88, 12, 0.9)";
      ctx.fill();

      // Focused Volumetric Light Beam
      const lightBeamGrad = ctx.createLinearGradient(0, cy + 57 * scale, 0, cy - 25 * scale);
      lightBeamGrad.addColorStop(0, "rgba(234, 88, 12, 0.85)");
      lightBeamGrad.addColorStop(0.2, "rgba(234, 88, 12, 0.45)");
      lightBeamGrad.addColorStop(0.65, "rgba(234, 88, 12, 0.15)");
      lightBeamGrad.addColorStop(1, "rgba(234, 88, 12, 0)");

      ctx.beginPath();
      ctx.moveTo(cx + 2 * scale, cy + 57 * scale);
      ctx.lineTo(cx + 18 * scale, cy + 57 * scale);
      ctx.lineTo(cx + 24 * scale, cy - 10 * scale);
      ctx.lineTo(cx - 4 * scale, cy - 10 * scale);
      ctx.closePath();
      ctx.fillStyle = lightBeamGrad;
      ctx.fill();

      // ─── 6. GLASS SLIDE & SPECIMEN ───
      // Beveled glass slide
      ctx.beginPath();
      ctx.moveTo(cx - 35 * scale, cy + 30 * scale);
      ctx.lineTo(cx + 35 * scale, cy + 24 * scale);
      ctx.lineTo(cx + 40 * scale, cy + 32 * scale);
      ctx.lineTo(cx - 30 * scale, cy + 38 * scale);
      ctx.closePath();
      ctx.fillStyle = "rgba(244, 244, 245, 0.4)";
      ctx.fill();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
      ctx.lineWidth = 1.0;
      ctx.stroke();

      // Slide cover slip (smaller glass rectangle in center)
      ctx.beginPath();
      ctx.moveTo(cx - 2 * scale, cy + 27 * scale);
      ctx.lineTo(cx + 22 * scale, cy + 25 * scale);
      ctx.lineTo(cx + 24 * scale, cy + 31 * scale);
      ctx.lineTo(cx, cy + 33 * scale);
      ctx.closePath();
      ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
      ctx.fill();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
      ctx.stroke();

      // Glowing liquid reaction specimen under lens
      ctx.beginPath();
      ctx.arc(cx + 10 * scale, cy + 29 * scale, 5 * scale, 0, Math.PI * 2);
      ctx.fillStyle = "#ea580c";
      ctx.shadowColor = "#ea580c";
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.shadowBlur = 0; // Reset shadow

      // Specular glare on slide glass
      ctx.beginPath();
      ctx.moveTo(cx - 25 * scale, cy + 31 * scale);
      ctx.lineTo(cx + 15 * scale, cy + 27 * scale);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
      ctx.lineWidth = 0.8;
      ctx.stroke();

      // ─── 7. REVOLVING OBJECTIVE TURRET & LENSES ───
      const turretX = cx + 10 * scale;
      const turretY = cy - 25 * scale;

      // Chrome nosepiece bracket
      ctx.beginPath();
      ctx.ellipse(turretX, turretY - 5 * scale, 26 * scale, 8 * scale, 0.05, 0, Math.PI * 2);
      ctx.fillStyle = getMetalGradient(turretX - 25 * scale, 0, turretX + 25 * scale, 0, "chrome");
      ctx.fill();
      ctx.stroke();

      // Revolving dome (turret shell)
      ctx.beginPath();
      ctx.ellipse(turretX, turretY, 28 * scale, 15 * scale, 0.05, 0, Math.PI * 2);
      ctx.fillStyle = getMetalGradient(turretX - 28 * scale, 0, turretX + 28 * scale, 0, "dark");
      ctx.fill();
      ctx.strokeStyle = "#52525b";
      ctx.stroke();

      // Active Objective Lens (pointing straight down)
      ctx.beginPath();
      ctx.moveTo(turretX - 10 * scale, turretY + 6 * scale);
      ctx.lineTo(turretX + 10 * scale, turretY + 6 * scale);
      ctx.lineTo(turretX + 6 * scale, turretY + 44 * scale);
      ctx.lineTo(turretX - 6 * scale, turretY + 44 * scale);
      ctx.closePath();
      ctx.fillStyle = getMetalGradient(turretX - 10 * scale, 0, turretX + 10 * scale, 0, "dark");
      ctx.fill();
      ctx.stroke();

      // Gold band highlight
      ctx.beginPath();
      ctx.moveTo(turretX - 7.5 * scale, turretY + 32 * scale);
      ctx.lineTo(turretX + 7.5 * scale, turretY + 32 * scale);
      ctx.lineTo(turretX + 7.0 * scale, turret37_stage_temp_Y());
      ctx.lineTo(turretX - 7.0 * scale, turret37_stage_temp_Y());
      ctx.closePath();
      ctx.fillStyle = getMetalGradient(turretX - 7 * scale, 0, turretX + 7 * scale, 0, "gold");
      ctx.fill();

      function turret37_stage_temp_Y() {
        return turretY + 37 * scale;
      }

      // Chrome grip knurling ring on lens
      ctx.beginPath();
      ctx.rect(turretX - 9 * scale, turretY + 12 * scale, 18 * scale, 4 * scale);
      ctx.fillStyle = getMetalGradient(turretX - 9 * scale, 0, turretX + 9 * scale, 0, "chrome");
      ctx.fill();
      ctx.stroke();

      // Inactive Objective Lens 2 (Angled right)
      ctx.save();
      ctx.translate(turretX, turretY);
      ctx.rotate(0.55);
      
      ctx.beginPath();
      ctx.moveTo(8 * scale, 4 * scale);
      ctx.lineTo(24 * scale, 4 * scale);
      ctx.lineTo(21 * scale, 35 * scale);
      ctx.lineTo(11 * scale, 35 * scale);
      ctx.closePath();
      ctx.fillStyle = getMetalGradient(8 * scale, 0, 24 * scale, 0, "dark");
      ctx.fill();
      ctx.stroke();
      // Chrome tip
      ctx.beginPath();
      ctx.rect(12 * scale, 35 * scale, 8 * scale, 4 * scale);
      ctx.fillStyle = getMetalGradient(12 * scale, 0, 20 * scale, 0, "chrome");
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      // Inactive Objective Lens 3 (Angled left)
      ctx.save();
      ctx.translate(turretX, turretY);
      ctx.rotate(-0.55);
      ctx.beginPath();
      ctx.moveTo(-24 * scale, 4 * scale);
      ctx.lineTo(-8 * scale, 4 * scale);
      ctx.lineTo(-11 * scale, 35 * scale);
      ctx.lineTo(-21 * scale, 35 * scale);
      ctx.closePath();
      ctx.fillStyle = getMetalGradient(-24 * scale, 0, -8 * scale, 0, "dark");
      ctx.fill();
      ctx.stroke();
      // Gold band
      ctx.beginPath();
      ctx.rect(-20 * scale, 35 * scale, 8 * scale, 4 * scale);
      ctx.fillStyle = getMetalGradient(-20 * scale, 0, -12 * scale, 0, "gold");
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      // ─── 8. MAIN BRACKET & EYEPIECE HEAD ───
      const headX = turretX;
      const headY = turretY - 45 * scale;

      // Vertical focus slide bar (chrome sleeve)
      ctx.beginPath();
      ctx.rect(headX - 10 * scale, headY + 1 * scale, 20 * scale, 25 * scale);
      ctx.fillStyle = getMetalGradient(headX - 10 * scale, 0, headX + 10 * scale, 0, "chrome");
      ctx.fill();
      ctx.stroke();

      // Slide rack gear ridges (fine detail)
      ctx.strokeStyle = "#52525b";
      ctx.lineWidth = 1;
      for (let gy = headY + 5 * scale; gy < headY + 22 * scale; gy += 3 * scale) {
        ctx.beginPath();
        ctx.moveTo(headX - 4 * scale, gy);
        ctx.lineTo(headX + 4 * scale, gy);
        ctx.stroke();
      }

      // Upper prism head body (dark metal casing)
      ctx.beginPath();
      ctx.moveTo(headX - 18 * scale, headY);
      ctx.lineTo(headX + 18 * scale, headY);
      ctx.lineTo(headX + 26 * scale, headY - 32 * scale);
      ctx.lineTo(headX - 26 * scale, headY - 32 * scale);
      ctx.closePath();
      ctx.fillStyle = getMetalGradient(headX - 20 * scale, 0, headX + 20 * scale, 0, "dark");
      ctx.fill();
      ctx.stroke();

      // Beveled head contour lines (3D highlights)
      ctx.beginPath();
      ctx.moveTo(headX - 16 * scale, headY - 2 * scale);
      ctx.lineTo(headX + 16 * scale, headY - 2 * scale);
      ctx.lineTo(headX + 23 * scale, headY - 30 * scale);
      ctx.lineTo(headX - 23 * scale, headY - 30 * scale);
      ctx.closePath();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
      ctx.stroke();

      // Dual chrome eyepiece tubes
      // Left eyepiece tube
      ctx.beginPath();
      ctx.moveTo(headX - 20 * scale, headY - 32 * scale);
      ctx.lineTo(headX - 8 * scale, headY - 32 * scale);
      ctx.lineTo(headX - 11 * scale, headY - 58 * scale);
      ctx.lineTo(headX - 23 * scale, headY - 58 * scale);
      ctx.closePath();
      ctx.fillStyle = getMetalGradient(headX - 20 * scale, 0, headX - 8 * scale, 0, "chrome");
      ctx.fill();
      ctx.stroke();

      // Left eyepiece rubber cup
      ctx.beginPath();
      ctx.ellipse(headX - 17 * scale, headY - 58 * scale, 8 * scale, 4 * scale, -0.1, 0, Math.PI * 2);
      ctx.fillStyle = "#18181b";
      ctx.fill();
      ctx.stroke();

      // Left lens element reflection (clinical blue glare)
      ctx.beginPath();
      ctx.ellipse(headX - 17 * scale, headY - 58 * scale, 5 * scale, 2.2 * scale, -0.1, 0, Math.PI * 2);
      const leftLensGrad = ctx.createRadialGradient(headX - 18 * scale, headY - 59 * scale, 1, headX - 17 * scale, headY - 58 * scale, 5 * scale);
      leftLensGrad.addColorStop(0, "#fafafa");
      leftLensGrad.addColorStop(0.3, "#38bdf8"); // cyan/blue reflection
      leftLensGrad.addColorStop(0.85, "#1e3a8a"); // deep blue coating
      leftLensGrad.addColorStop(1, "#0f172a");
      ctx.fillStyle = leftLensGrad;
      ctx.fill();

      // Right eyepiece tube
      ctx.beginPath();
      ctx.moveTo(headX + 8 * scale, headY - 32 * scale);
      ctx.lineTo(headX + 20 * scale, headY - 32 * scale);
      ctx.lineTo(headX + 17 * scale, headY - 58 * scale);
      ctx.lineTo(headX + 5 * scale, headY - 58 * scale);
      ctx.closePath();
      ctx.fillStyle = getMetalGradient(headX + 5 * scale, 0, headX + 20 * scale, 0, "chrome");
      ctx.fill();
      ctx.stroke();

      // Right eyepiece rubber cup
      ctx.beginPath();
      ctx.ellipse(headX + 11 * scale, headY - 58 * scale, 8 * scale, 4 * scale, 0.1, 0, Math.PI * 2);
      ctx.fillStyle = "#18181b";
      ctx.fill();
      ctx.stroke();

      // Right lens element reflection
      ctx.beginPath();
      ctx.ellipse(headX + 11 * scale, headY - 58 * scale, 5 * scale, 2.2 * scale, 0.1, 0, Math.PI * 2);
      const rightLensGrad = ctx.createRadialGradient(headX + 10 * scale, headY - 59 * scale, 1, headX + 11 * scale, headY - 58 * scale, 5 * scale);
      rightLensGrad.addColorStop(0, "#fafafa");
      rightLensGrad.addColorStop(0.3, "#38bdf8");
      rightLensGrad.addColorStop(0.85, "#1e3a8a");
      rightLensGrad.addColorStop(1, "#0f172a");
      ctx.fillStyle = rightLensGrad;
      ctx.fill();

      ctx.restore();
    };

    const drawOngoingReaction = (t: number) => {
      // ─── 1. DRAW LENS CASING & GLOW EFFECTS ───
      // Outer shadow / glow
      ctx.beginPath();
      ctx.arc(lensX, lensY, lensRadius + 22, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(234, 88, 12, 0.045)";
      ctx.fill();

      // Brushed Steel Casing Ring
      const casingGrad = ctx.createRadialGradient(lensX, lensY, lensRadius - 6, lensX, lensY, lensRadius + 8);
      casingGrad.addColorStop(0, "#52525b");
      casingGrad.addColorStop(0.2, "#a1a1aa");
      casingGrad.addColorStop(0.4, "#f4f4f5"); // bright metal highlight
      casingGrad.addColorStop(0.65, "#71717a");
      casingGrad.addColorStop(0.9, "#3f3f46");
      casingGrad.addColorStop(1, "#18181b");

      ctx.beginPath();
      ctx.arc(lensX, lensY, lensRadius, 0, Math.PI * 2);
      ctx.lineWidth = 10;
      ctx.strokeStyle = casingGrad;
      ctx.stroke();

      // Inner thin copper/gold focus ring
      ctx.beginPath();
      ctx.arc(lensX, lensY, lensRadius - 6, 0, Math.PI * 2);
      ctx.lineWidth = 2.0;
      ctx.strokeStyle = getMetalGradient(lensX - lensRadius, 0, lensX + lensRadius, 0, "gold");
      ctx.stroke();

      // Clip drawing inside the circular view lens
      ctx.save();
      ctx.beginPath();
      ctx.arc(lensX, lensY, lensRadius - 7, 0, Math.PI * 2);
      ctx.clip();

      // Lens inner viewport glass background
      const glassGrad = ctx.createRadialGradient(lensX - lensRadius * 0.25, lensY - lensRadius * 0.25, 4, lensX, lensY, lensRadius);
      glassGrad.addColorStop(0, "#ffffff");
      glassGrad.addColorStop(0.5, "#fafafa");
      glassGrad.addColorStop(0.82, "#f4f4f5");
      glassGrad.addColorStop(1, "#e4e4e7");
      ctx.fillStyle = glassGrad;
      ctx.fill();

      // Biotech Grid mesh pattern inside lens
      ctx.strokeStyle = "rgba(234, 88, 12, 0.06)";
      ctx.lineWidth = 0.5;
      const gridSize = 25;
      for (let x = lensX - lensRadius; x < lensX + lensRadius; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, lensY - lensRadius);
        ctx.lineTo(x, lensY + lensRadius);
        ctx.stroke();
      }
      for (let y = lensY - lensRadius; y < lensY + lensRadius; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(lensX - lensRadius, y);
        ctx.lineTo(lensX + lensRadius, y);
        ctx.stroke();
      }

      // ─── 2. PARTICLE EMISSION AND REACTION SIMULATION ───
      if (Math.random() < 0.35 && particles.length < 65) {
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * (lensRadius - 25);
        particles.push({
          x: lensX + Math.cos(angle) * dist,
          y: lensY + Math.sin(angle) * dist,
          vx: (Math.random() - 0.5) * 0.65,
          vy: (Math.random() - 0.5) * 0.65,
          size: Math.random() * 2.2 + 1,
          color: Math.random() > 0.4 ? "#ea580c" : "#f97316",
          alpha: Math.random() * 0.6 + 0.3,
          life: 0,
          maxLife: Math.floor(Math.random() * 110) + 80,
        });
      }

      // Update and draw particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life += 1;

        if (mousePos.current.active) {
          const dx = mousePos.current.x - p.x;
          const dy = mousePos.current.y - p.y;
          const mouseDist = Math.sqrt(dx * dx + dy * dy);
          if (mouseDist < lensRadius + 20) {
            p.vx += (dx / mouseDist) * 0.05;
            p.vy += (dy / mouseDist) * 0.05;
          }
        }

        const dx = p.x - lensX;
        const dy = p.y - lensY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > lensRadius - 12) {
          const ux = dx / dist;
          const uy = dy / dist;
          p.x = lensX + ux * (lensRadius - 12);
          p.vx = -p.vx * 0.5;
          p.vy = -p.vy * 0.5;
        }

        const lifeRatio = 1 - p.life / p.maxLife;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha * lifeRatio;
        ctx.fill();
      });
      particles = particles.filter((p) => p.life < p.maxLife);
      ctx.globalAlpha = 1.0;

      // ─── 3. CELLULAR AND GENETIC REACTIONS (MITOSIS) ───
      cells.forEach((cell, idx) => {
        if (Math.abs(cell.x - cell.targetX) < 1 && Math.abs(cell.y - cell.targetY) < 1) {
          const angle = Math.random() * Math.PI * 2;
          const dist = Math.random() * 20 + 10;
          cell.targetX = lensX + Math.cos(angle) * dist * 1.5;
          cell.targetY = lensY + Math.sin(angle) * dist * 1.5;
        }
        cell.x += (cell.targetX - cell.x) * 0.01;
        cell.y += (cell.targetY - cell.y) * 0.01;
        cell.angle += 0.005;

        if (!cell.isSplitting && Math.random() < 0.0018 && idx === 3) {
          cell.isSplitting = true;
          cell.splitProgress = 0;
        }

        const pulse = Math.sin(t * 0.04 + cell.pulseOffset) * 1.2;
        const rad = cell.size + pulse;

        ctx.save();
        ctx.translate(cell.x, cell.y);
        ctx.rotate(cell.angle);

        if (cell.isSplitting) {
          cell.splitProgress += 0.008;
          if (cell.splitProgress >= 1) {
            cell.isSplitting = false;
            cell.splitProgress = 0;
          }

          const offset = cell.splitProgress * 15;
          
          // Left split half
          ctx.beginPath();
          ctx.arc(-offset, 0, rad * 0.85, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(234, 88, 12, 0.22)";
          ctx.fill();
          ctx.strokeStyle = "#ea580c";
          ctx.lineWidth = 1.8;
          ctx.stroke();
          
          // Right split half
          ctx.beginPath();
          ctx.arc(offset, 0, rad * 0.85, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(234, 88, 12, 0.22)";
          ctx.fill();
          ctx.stroke();

          // Connective bridge
          ctx.beginPath();
          ctx.moveTo(-offset, -rad * 0.4);
          ctx.quadraticCurveTo(0, -rad * (0.4 - cell.splitProgress * 0.3), offset, -rad * 0.4);
          ctx.lineTo(offset, rad * 0.4);
          ctx.quadraticCurveTo(0, rad * (0.4 - cell.splitProgress * 0.3), -offset, rad * 0.4);
          ctx.closePath();
          ctx.fillStyle = "rgba(234, 88, 12, 0.2)";
          ctx.fill();
          ctx.stroke();

        } else {
          ctx.beginPath();
          ctx.arc(0, 0, rad, 0, Math.PI * 2);
          
          const cellGrad = ctx.createRadialGradient(-rad * 0.25, -rad * 0.25, rad * 0.08, 0, 0, rad);
          cellGrad.addColorStop(0, "rgba(255, 255, 255, 0.95)");
          cellGrad.addColorStop(0.4, "rgba(251, 146, 60, 0.48)");
          cellGrad.addColorStop(0.85, "rgba(234, 88, 12, 0.25)");
          cellGrad.addColorStop(1, "rgba(234, 88, 12, 0.48)");

          ctx.fillStyle = cellGrad;
          ctx.fill();
          ctx.strokeStyle = "#ea580c";
          ctx.lineWidth = 2.0;
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(-rad * 0.08, -rad * 0.08, rad * 0.28, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(234, 88, 12, 0.72)";
          ctx.fill();
        }

        ctx.restore();
      });

      // ─── 4. CHROMATIN / MOLECULAR LINKING ───
      ctx.beginPath();
      ctx.lineWidth = 0.8;
      ctx.strokeStyle = "rgba(234, 88, 12, 0.25)";
      for (let i = 0; i < cells.length; i++) {
        for (let j = i + 1; j < cells.length; j++) {
          const dx = cells[i].x - cells[j].x;
          const dy = cells[i].y - cells[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 95) {
            ctx.moveTo(cells[i].x, cells[i].y);
            ctx.lineTo(cells[j].x, cells[j].y);
          }
        }
      }
      ctx.stroke();

      ctx.restore(); // Restore clipping bounds

      // ─── 5. LENS SPECULAR REFLECTION HIGHLIGHT ───
      const highlightGrad = ctx.createLinearGradient(lensX - lensRadius, lensY - lensRadius, lensX + lensRadius, lensY + lensRadius);
      highlightGrad.addColorStop(0, "rgba(255, 255, 255, 0.4)");
      highlightGrad.addColorStop(0.28, "rgba(255, 255, 255, 0.08)");
      highlightGrad.addColorStop(0.5, "rgba(255, 255, 255, 0)");
      highlightGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.beginPath();
      ctx.arc(lensX, lensY, lensRadius - 6, 0, Math.PI * 2);
      ctx.fillStyle = highlightGrad;
      ctx.fill();

      // Display HUD label
      ctx.font = "bold 9px ui-monospace, SFMono-Regular, monospace";
      ctx.fillStyle = "#ea580c";
      ctx.fillText("[MICRO-MAGNIFICATION: 40,000X]", lensX - 78, lensY + lensRadius + 22);

      // Pulse heartbeat telemetry line
      ctx.beginPath();
      ctx.lineWidth = 1.0;
      ctx.strokeStyle = "rgba(234, 88, 12, 0.4)";
      const plotY = lensY + lensRadius + 38;
      const length = 120;
      const startX = lensX - length / 2;
      ctx.moveTo(startX, plotY);
      for (let k = 0; k < length; k++) {
        const kX = startX + k;
        let kY = plotY;
        const cycle = (t + k * 1.5) % 80;
        if (cycle < 15) {
          kY = plotY - Math.sin((cycle / 15) * Math.PI) * 12;
        } else if (cycle < 30) {
          kY = plotY + Math.sin(((cycle - 15) / 15) * Math.PI) * 6;
        }
        ctx.lineTo(kX, kY);
      }
      ctx.stroke();
    };

    const render = () => {
      time += 1;
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);

      // Specimen slide link beam
      const slideSpecimenX = dimensions.width * 0.38 + 10;
      const bounceOffset = Math.sin(time * 0.02) * 4;
      const slideSpecimenY = dimensions.height * 0.52 + 29 + bounceOffset;

      const connectionGrad = ctx.createLinearGradient(slideSpecimenX, slideSpecimenY, lensX - lensRadius * 0.6, lensY);
      connectionGrad.addColorStop(0, "rgba(234, 88, 12, 0.85)");
      connectionGrad.addColorStop(0.5, "rgba(249, 115, 22, 0.2)");
      connectionGrad.addColorStop(1, "rgba(234, 88, 12, 0.05)");

      ctx.beginPath();
      ctx.moveTo(slideSpecimenX, slideSpecimenY);
      ctx.bezierCurveTo(
        slideSpecimenX + 60, slideSpecimenY - 100,
        lensX - lensRadius - 40, lensY + 50,
        lensX - lensRadius + 10, lensY
      );
      ctx.lineWidth = 1.8;
      ctx.strokeStyle = connectionGrad;
      ctx.stroke();

      // Render subparts
      drawMicroscope(time);
      drawOngoingReaction(time);

      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [dimensions]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      mousePos.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      };
    }
  };

  const handleMouseLeave = () => {
    mousePos.current.active = false;
  };

  return (
    <div ref={containerRef} className="w-full h-full min-h-[640px] md:min-h-[720px] flex items-center justify-center relative select-none">
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="w-full h-full max-w-[580px] max-h-[700px]"
      />
      {/* Framing backdrop */}
      <div className="absolute inset-0 border border-zinc-100 rounded-[3rem] pointer-events-none bg-[radial-gradient(circle_at_50%_50%,rgba(234,88,12,0.025)_0%,transparent_70%)]" />
    </div>
  );
}

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

interface Drop {
  x: number;
  y: number;
  vy: number;
  color: string;
  size: number;
}

interface Bubble {
  x: number; // offset from tube centerline
  y: number; // distance from bottom of tube (0 to liquidHeight)
  vy: number;
  size: number;
  wobbleSpeed: number;
  wobbleAmount: number;
  wobbleOffset: number;
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

export function ScientistReaction3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 500, height: 680 });
  const mousePos = useRef({ x: 250, y: 340, active: false });

  // Reaction state to boost animation speed/flares when drops land
  const reactionBoost = useRef(0); // 0 to 1 decay

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

    // Position coordinates scaled to fit dimensions
    const width = dimensions.width;
    const height = dimensions.height;

    // Test tube geometry
    const tubeAngle = 0.18; // slight tilt (approx 10 degrees)
    const tubePivotX = width * 0.36;
    const tubePivotY = height * 0.52;
    const tubeLength = 220;
    const tubeWidth = 42;
    const liquidMaxHeight = 130;

    // Hologram Viewport position
    const hologramX = width * 0.73;
    const hologramY = height * 0.35;
    const hologramRadius = Math.min(width * 0.28, 120);

    // Spring-based liquid wave simulation setup
    const numWavePoints = 12;
    const wavePoints: { y: number; vy: number }[] = [];
    for (let i = 0; i < numWavePoints; i++) {
      wavePoints.push({ y: 0, vy: 0 });
    }

    const kSpring = 0.08;
    const damping = 0.88;
    const spread = 0.12;

    // Pipette dropper position
    const pipetteX = tubePivotX - Math.sin(tubeAngle) * (tubeLength * 0.5) - 8;
    const pipetteY = tubePivotY - Math.cos(tubeAngle) * (tubeLength * 0.5) - 60;

    // Interactive drops
    let activeDrops: Drop[] = [];
    // Bubble arrays
    let bubbles: Bubble[] = [];
    // Reaction smoke particles rising from test tube
    let smokeParticles: Particle[] = [];
    // Holographic molecular reaction particles
    let holoParticles: Particle[] = [];

    // Initialize cells for the hologram reaction
    const cells: Cell[] = [
      { x: hologramX - 45, y: hologramY - 30, targetX: hologramX - 50, targetY: hologramY - 20, size: 17, pulseOffset: 0, splitProgress: 0, isSplitting: false, angle: 0 },
      { x: hologramX + 40, y: hologramY + 25, targetX: hologramX + 35, targetY: hologramY + 30, size: 15, pulseOffset: Math.PI / 3, splitProgress: 0, isSplitting: false, angle: Math.PI / 4 },
      { x: hologramX - 10, y: hologramY + 50, targetX: hologramX - 15, targetY: hologramY + 45, size: 19, pulseOffset: Math.PI / 1.5, splitProgress: 0, isSplitting: false, angle: Math.PI / 2 },
      { x: hologramX + 15, y: hologramY - 45, targetX: hologramX + 5, targetY: hologramY - 50, size: 24, pulseOffset: 0, splitProgress: 0, isSplitting: false, angle: Math.PI / 6 },
    ];

    // Helper to generate brushed metal gradients
    const getMetalGradient = (x1: number, y1: number, x2: number, y2: number, type: "dark" | "chrome" | "gold" = "dark") => {
      const grad = ctx.createLinearGradient(x1, y1, x2, y2);
      if (type === "dark") {
        grad.addColorStop(0, "#1c1c1f");
        grad.addColorStop(0.25, "#3f3f46");
        grad.addColorStop(0.4, "#52525b");
        grad.addColorStop(0.55, "#27272a");
        grad.addColorStop(0.85, "#18181b");
        grad.addColorStop(1, "#09090b");
      } else if (type === "chrome") {
        grad.addColorStop(0, "#8e9196");
        grad.addColorStop(0.2, "#e5e7eb");
        grad.addColorStop(0.35, "#ffffff"); // glare
        grad.addColorStop(0.6, "#9ca3af");
        grad.addColorStop(0.85, "#4b5563");
        grad.addColorStop(1, "#1f2937");
      } else {
        grad.addColorStop(0, "#7c2d12");
        grad.addColorStop(0.25, "#ea580c");
        grad.addColorStop(0.45, "#fed7aa"); // glare
        grad.addColorStop(0.7, "#c2410c");
        grad.addColorStop(1, "#431407");
      }
      return grad;
    };

    // Draw the Scientist Silhouette & lab coat
    const drawScientist = (t: number) => {
      const sx = width * 0.14;
      const sy = height * 0.54;
      const scale = Math.min(width / 500, 1.0);

      ctx.save();
      // Slow breathing movement
      const breathe = Math.sin(t * 0.015) * 3;
      ctx.translate(0, breathe);

      // ─── BACKGROUND GLOW ───
      // Ambient orange backlight glow behind the scientist
      const glowGrad = ctx.createRadialGradient(sx + 50 * scale, sy + 30 * scale, 50 * scale, sx + 60 * scale, sy + 30 * scale, 240 * scale);
      glowGrad.addColorStop(0, "rgba(234, 88, 12, 0.08)");
      glowGrad.addColorStop(0.5, "rgba(234, 88, 12, 0.03)");
      glowGrad.addColorStop(1, "rgba(234, 88, 12, 0)");
      ctx.beginPath();
      ctx.arc(sx + 60 * scale, sy + 30 * scale, 240 * scale, 0, Math.PI * 2);
      ctx.fillStyle = glowGrad;
      ctx.fill();

      // ─── SHOULDER & LAB COAT ───
      // Lab coat body silhouette
      ctx.beginPath();
      ctx.moveTo(sx - 150 * scale, height);
      ctx.quadraticCurveTo(sx - 100 * scale, sy + 180 * scale, sx - 40 * scale, sy + 160 * scale);
      ctx.bezierCurveTo(sx + 10 * scale, sy + 140 * scale, sx + 50 * scale, sy + 170 * scale, sx + 90 * scale, sy + 250 * scale);
      ctx.lineTo(sx + 120 * scale, height);
      ctx.closePath();

      const coatGrad = ctx.createLinearGradient(sx - 100 * scale, sy + 150 * scale, sx + 80 * scale, height);
      coatGrad.addColorStop(0, "#f8fafc");
      coatGrad.addColorStop(0.4, "#f1f5f9");
      coatGrad.addColorStop(0.75, "#e2e8f0");
      coatGrad.addColorStop(1, "#cbd5e1");
      ctx.fillStyle = coatGrad;
      ctx.fill();

      // Draw lab coat outline & seams
      ctx.strokeStyle = "rgba(148, 163, 184, 0.4)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Lab coat collar/lapel
      ctx.beginPath();
      ctx.moveTo(sx - 40 * scale, sy + 160 * scale);
      ctx.lineTo(sx - 15 * scale, sy + 220 * scale);
      ctx.lineTo(sx + 20 * scale, sy + 155 * scale);
      ctx.fillStyle = "#f8fafc";
      ctx.fill();
      ctx.stroke();

      // Inner shirt / tie neck area
      ctx.beginPath();
      ctx.moveTo(sx - 20 * scale, sy + 160 * scale);
      ctx.lineTo(sx - 10 * scale, sy + 195 * scale);
      ctx.lineTo(sx + 5 * scale, sy + 158 * scale);
      ctx.closePath();
      ctx.fillStyle = "#cbd5e1";
      ctx.fill();

      // Orange brand tie highlight
      ctx.beginPath();
      ctx.moveTo(sx - 12 * scale, sy + 172 * scale);
      ctx.lineTo(sx - 6 * scale, sy + 205 * scale);
      ctx.lineTo(sx + 1 * scale, sy + 170 * scale);
      ctx.closePath();
      ctx.fillStyle = "#ea580c";
      ctx.fill();

      // ─── NECK ───
      ctx.beginPath();
      ctx.moveTo(sx - 45 * scale, sy + 150 * scale);
      ctx.lineTo(sx - 40 * scale, sy + 105 * scale);
      ctx.quadraticCurveTo(sx - 15 * scale, sy + 120 * scale, sx + 5 * scale, sy + 100 * scale);
      ctx.lineTo(sx + 15 * scale, sy + 145 * scale);
      ctx.closePath();
      
      const skinGrad = ctx.createLinearGradient(sx - 40 * scale, sy + 100 * scale, sx + 15 * scale, sy + 150 * scale);
      skinGrad.addColorStop(0, "#fbcfe8"); // Stylized light pink/violet clinical profile shading
      skinGrad.addColorStop(0.6, "#fce7f3");
      skinGrad.addColorStop(1, "#f472b6");
      ctx.fillStyle = skinGrad;
      ctx.fill();

      // Neck shadow
      ctx.beginPath();
      ctx.moveTo(sx - 45 * scale, sy + 150 * scale);
      ctx.lineTo(sx - 40 * scale, sy + 125 * scale);
      ctx.quadraticCurveTo(sx - 20 * scale, sy + 135 * scale, sx + 10 * scale, sy + 128 * scale);
      ctx.lineTo(sx + 15 * scale, sy + 145 * scale);
      ctx.closePath();
      ctx.fillStyle = "rgba(244, 114, 182, 0.25)";
      ctx.fill();

      // ─── HEAD & STYLIZED PROFILE ───
      ctx.beginPath();
      // Back of head
      ctx.moveTo(sx - 55 * scale, sy + 105 * scale);
      ctx.bezierCurveTo(sx - 75 * scale, sy + 60 * scale, sx - 60 * scale, sy + 5 * scale, sx - 20 * scale, sy - 15 * scale);
      // Crown / hair
      ctx.bezierCurveTo(sx + 20 * scale, sy - 25 * scale, sx + 50 * scale, sy - 5 * scale, sx + 45 * scale, sy + 30 * scale);
      // Forehead
      ctx.lineTo(sx + 35 * scale, sy + 45 * scale);
      // Nose
      ctx.lineTo(sx + 52 * scale, sy + 62 * scale);
      ctx.lineTo(sx + 38 * scale, sy + 72 * scale);
      // Lips / mouth
      ctx.lineTo(sx + 44 * scale, sy + 80 * scale);
      ctx.lineTo(sx + 36 * scale, sy + 86 * scale);
      // Chin
      ctx.quadraticCurveTo(sx + 40 * scale, sy + 105 * scale, sx + 15 * scale, sy + 110 * scale);
      ctx.lineTo(sx - 45 * scale, sy + 105 * scale);
      ctx.closePath();
      ctx.fillStyle = skinGrad;
      ctx.fill();

      // ─── SCIENTIST HAIR / BENCH CAP ───
      ctx.beginPath();
      ctx.moveTo(sx - 35 * scale, sy - 10 * scale);
      ctx.bezierCurveTo(sx - 65 * scale, sy + 10 * scale, sx - 60 * scale, sy + 70 * scale, sx - 50 * scale, sy + 90 * scale);
      ctx.lineTo(sx - 38 * scale, sy + 80 * scale);
      ctx.bezierCurveTo(sx - 48 * scale, sy + 50 * scale, sx - 45 * scale, sy + 15 * scale, sx - 20 * scale, sy + 5 * scale);
      ctx.closePath();
      ctx.fillStyle = "#374151"; // Charcoal hair
      ctx.fill();

      // ─── VISOR / SAFETY GLASSES (Glowing clinical interface) ───
      ctx.beginPath();
      ctx.moveTo(sx + 10 * scale, sy + 28 * scale);
      ctx.lineTo(sx + 48 * scale, sy + 38 * scale);
      ctx.lineTo(sx + 42 * scale, sy + 64 * scale);
      ctx.lineTo(sx + 15 * scale, sy + 55 * scale);
      ctx.closePath();
      
      const visorGrad = ctx.createLinearGradient(sx + 10 * scale, sy + 30 * scale, sx + 45 * scale, sy + 60 * scale);
      visorGrad.addColorStop(0, "rgba(234, 88, 12, 0.95)"); // Neon brand orange visor
      visorGrad.addColorStop(1, "rgba(249, 115, 22, 0.45)");
      ctx.fillStyle = visorGrad;
      
      // Visor Glow
      ctx.shadowColor = "#ea580c";
      ctx.shadowBlur = 15;
      ctx.fill();
      ctx.shadowBlur = 0; // Reset shadow

      // Visor frame line
      ctx.strokeStyle = "#ffedd5";
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Visor specular glare reflection
      ctx.beginPath();
      ctx.moveTo(sx + 16 * scale, sy + 35 * scale);
      ctx.lineTo(sx + 36 * scale, sy + 40 * scale);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.75)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // ─── SCIENTIST'S ARM REACHING OUT ───
      // Forearm holding test tube
      ctx.beginPath();
      ctx.moveTo(sx - 20 * scale, sy + 250 * scale);
      ctx.bezierCurveTo(sx + 40 * scale, sy + 230 * scale, sx + 100 * scale, sy + 200 * scale, tubePivotX - 30, tubePivotY + 30);
      ctx.lineTo(tubePivotX - 10, tubePivotY + 50);
      ctx.bezierCurveTo(sx + 80 * scale, sy + 260 * scale, sx + 30 * scale, sy + 290 * scale, sx - 10 * scale, sy + 320 * scale);
      ctx.closePath();
      
      const armCoatGrad = ctx.createLinearGradient(sx - 20 * scale, sy + 240 * scale, tubePivotX - 20, tubePivotY + 40);
      armCoatGrad.addColorStop(0, "#f1f5f9");
      armCoatGrad.addColorStop(0.5, "#e2e8f0");
      armCoatGrad.addColorStop(1, "#cbd5e1");
      ctx.fillStyle = armCoatGrad;
      ctx.fill();
      ctx.strokeStyle = "rgba(148, 163, 184, 0.35)";
      ctx.stroke();

      // Hand/Glove gripping the tube
      ctx.beginPath();
      ctx.ellipse(tubePivotX - 15, tubePivotY + 25, 14 * scale, 10 * scale, 0.4, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(234, 88, 12, 0.2)"; // Semi-transparent clinical sterile glove
      ctx.fill();
      ctx.strokeStyle = "#ea580c";
      ctx.lineWidth = 1.0;
      ctx.stroke();

      // Gripping fingers wrapped around the tube
      ctx.beginPath();
      ctx.arc(tubePivotX - 12, tubePivotY + 16, 5 * scale, 0, Math.PI * 2);
      ctx.arc(tubePivotX - 6, tubePivotY + 26, 5 * scale, 0, Math.PI * 2);
      ctx.arc(tubePivotX - 10, tubePivotY + 36, 5 * scale, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(234, 88, 12, 0.45)";
      ctx.fill();
      ctx.stroke();

      ctx.restore();
    };

    // Draw the glass Pipette Dropper hovering above the tube mouth
    const drawPipette = (t: number) => {
      ctx.save();
      // Pipette hover breathing
      const wobble = Math.sin(t * 0.04) * 1.5;
      ctx.translate(wobble, wobble * 0.5);

      // Pipette Glass Tube Body
      ctx.beginPath();
      ctx.moveTo(pipetteX - 4, pipetteY - 120);
      ctx.lineTo(pipetteX + 4, pipetteY - 120);
      ctx.lineTo(pipetteX + 4, pipetteY - 30);
      ctx.lineTo(pipetteX + 1.2, pipetteY - 6);
      ctx.lineTo(pipetteX - 1.2, pipetteY - 6);
      ctx.lineTo(pipetteX - 4, pipetteY - 30);
      ctx.closePath();

      const glassGrad = ctx.createLinearGradient(pipetteX - 4, 0, pipetteX + 4, 0);
      glassGrad.addColorStop(0, "rgba(255, 255, 255, 0.35)");
      glassGrad.addColorStop(0.3, "rgba(255, 255, 255, 0.65)");
      glassGrad.addColorStop(0.6, "rgba(255, 255, 255, 0.15)");
      glassGrad.addColorStop(1, "rgba(200, 200, 200, 0.45)");
      ctx.fillStyle = glassGrad;
      ctx.fill();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.65)";
      ctx.lineWidth = 0.8;
      ctx.stroke();

      // Fluid columns inside pipette (glowing orange reactant ready to drop)
      ctx.beginPath();
      ctx.moveTo(pipetteX - 3.2, pipetteY - 68);
      ctx.lineTo(pipetteX + 3.2, pipetteY - 68);
      ctx.lineTo(pipetteX + 2.5, pipetteY - 18);
      ctx.lineTo(pipetteX - 2.5, pipetteY - 18);
      ctx.closePath();
      
      const pipFluidGrad = ctx.createLinearGradient(pipetteX - 3, 0, pipetteX + 3, 0);
      pipFluidGrad.addColorStop(0, "#ea580c");
      pipFluidGrad.addColorStop(0.5, "#ff7c3b");
      pipFluidGrad.addColorStop(1, "#c2410c");
      ctx.fillStyle = pipFluidGrad;
      ctx.fill();

      // Rubber Bulb at top of pipette (chrome/dark grip ring + rubber bulb)
      // Bulb collar
      ctx.beginPath();
      ctx.rect(pipetteX - 6, pipetteY - 123, 12, 6);
      ctx.fillStyle = getMetalGradient(pipetteX - 6, 0, pipetteX + 6, 0, "chrome");
      ctx.fill();
      ctx.stroke();

      // Rubber bulb itself
      ctx.beginPath();
      ctx.ellipse(pipetteX, pipetteY - 138, 9, 14, 0, 0, Math.PI * 2);
      const bulbGrad = ctx.createRadialGradient(pipetteX - 3, pipetteY - 143, 2, pipetteX, pipetteY - 138, 9);
      bulbGrad.addColorStop(0, "#4b5563");
      bulbGrad.addColorStop(0.6, "#1f2937");
      bulbGrad.addColorStop(1, "#111827");
      ctx.fillStyle = bulbGrad;
      ctx.fill();
      ctx.strokeStyle = "#374151";
      ctx.stroke();

      // Forming Droplet at tip of pipette
      const dropletSize = 3.5 + Math.sin(t * 0.08) * 0.8;
      ctx.beginPath();
      ctx.arc(pipetteX, pipetteY - 2, dropletSize, 0, Math.PI * 2);
      ctx.fillStyle = "#ea580c";
      ctx.shadowColor = "#ea580c";
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0; // reset

      ctx.restore();
    };

    // Calculate fluid surface points using wave equation
    const updateLiquidWaves = () => {
      // Internal wave physics updates
      for (let i = 0; i < numWavePoints; i++) {
        const force = -kSpring * wavePoints[i].y - damping * wavePoints[i].vy;
        wavePoints[i].vy += force;
        wavePoints[i].y += wavePoints[i].vy;
      }

      // Propagate wave forces left and right
      const leftDeltas = new Array(numWavePoints).fill(0);
      const rightDeltas = new Array(numWavePoints).fill(0);

      // Repeat a few times for smooth propagation
      for (let iteration = 0; iteration < 8; iteration++) {
        for (let i = 0; i < numWavePoints; i++) {
          if (i > 0) {
            leftDeltas[i] = spread * (wavePoints[i].y - wavePoints[i - 1].y);
            wavePoints[i - 1].vy += leftDeltas[i];
          }
          if (i < numWavePoints - 1) {
            rightDeltas[i] = spread * (wavePoints[i].y - wavePoints[i + 1].y);
            wavePoints[i + 1].vy += rightDeltas[i];
          }
        }

        for (let i = 0; i < numWavePoints; i++) {
          if (i > 0) wavePoints[i - 1].y += leftDeltas[i];
          if (i < numWavePoints - 1) wavePoints[i + 1].y += rightDeltas[i];
        }
      }
    };

    // Draw the glass test tube tilted on its axis, containing fluid, bubbles, reflections
    const drawTestTube = (t: number) => {
      const scale = Math.min(width / 500, 1.0);

      ctx.save();
      // Translate to pivot point and rotate
      const bounce = Math.sin(t * 0.015) * 3;
      ctx.translate(tubePivotX, tubePivotY + bounce);
      ctx.rotate(tubeAngle);

      // ─── TEST TUBE OUTER GLASS OUTLINE ───
      // Draw tube silhouette path (mouth at -tubeLength/2, bottom round at +tubeLength/2)
      const tyTop = -tubeLength / 2;
      const tyBot = tubeLength / 2 - tubeWidth / 2;

      ctx.beginPath();
      // Left side down
      ctx.moveTo(-tubeWidth / 2, tyTop);
      ctx.lineTo(-tubeWidth / 2, tyBot);
      // Bottom curved cap
      ctx.arc(0, tyBot, tubeWidth / 2, Math.PI, 0, true);
      // Right side up
      ctx.lineTo(tubeWidth / 2, tyTop);
      // Top flare lip
      ctx.lineTo(tubeWidth / 2 + 3, tyTop);
      ctx.lineTo(tubeWidth / 2 + 3, tyTop - 4);
      ctx.lineTo(-tubeWidth / 2 - 3, tyTop - 4);
      ctx.lineTo(-tubeWidth / 2 - 3, tyTop);
      ctx.closePath();

      // Back wall shadow
      ctx.fillStyle = "rgba(244, 244, 245, 0.08)";
      ctx.fill();

      // ─── LIQUID CONTENT ───
      ctx.save();
      // Clip drawing within the inner test tube boundary so liquid shape conforms perfectly
      ctx.beginPath();
      ctx.moveTo(-tubeWidth / 2 + 1.8, tyTop);
      ctx.lineTo(-tubeWidth / 2 + 1.8, tyBot);
      ctx.arc(0, tyBot, tubeWidth / 2 - 1.8, Math.PI, 0, true);
      ctx.lineTo(tubeWidth / 2 - 1.8, tyTop);
      ctx.closePath();
      ctx.clip();

      // Liquid depth parameters
      const liquidTopY = tyBot + tubeWidth / 2 - liquidMaxHeight;

      // Draw active liquid body (gradient from orange to pink/purple with reaction boost)
      const liquidGrad = ctx.createLinearGradient(0, tyBot + tubeWidth / 2, 0, liquidTopY - 20);
      
      // Color shifts dynamically based on reaction boost activity
      const baseColor = `rgba(234, 88, 12, ${0.48 + reactionBoost.current * 0.35})`; // brand orange
      const midColor = `rgba(249, 115, 22, ${0.62 + reactionBoost.current * 0.2})`;
      const topColor = reactionBoost.current > 0.3 
        ? `rgba(236, 72, 153, ${0.68 + reactionBoost.current * 0.2})` // flashes pink during reactions
        : `rgba(249, 115, 22, 0.58)`;

      liquidGrad.addColorStop(0, "rgba(59, 130, 246, 0.25)"); // subtle cool base blue
      liquidGrad.addColorStop(0.35, baseColor);
      liquidGrad.addColorStop(0.7, midColor);
      liquidGrad.addColorStop(1, topColor);

      // Construct liquid shape using spring wave vertices
      ctx.beginPath();
      ctx.moveTo(-tubeWidth / 2, tyBot + tubeWidth / 2);
      ctx.lineTo(-tubeWidth / 2, liquidTopY);

      // Plot wave points across surface width
      const step = tubeWidth / (numWavePoints - 1);
      for (let i = 0; i < numWavePoints; i++) {
        const wx = -tubeWidth / 2 + i * step;
        const wy = liquidTopY + wavePoints[i].y;
        ctx.lineTo(wx, wy);
      }
      ctx.lineTo(tubeWidth / 2, liquidTopY);
      ctx.lineTo(tubeWidth / 2, tyBot + tubeWidth / 2);
      ctx.closePath();
      ctx.fillStyle = liquidGrad;
      ctx.fill();

      // Liquid surface meniscus reflection line (sloshing curve)
      ctx.beginPath();
      ctx.moveTo(-tubeWidth / 2, liquidTopY + wavePoints[0].y);
      for (let i = 0; i < numWavePoints; i++) {
        const wx = -tubeWidth / 2 + i * step;
        const wy = liquidTopY + wavePoints[i].y;
        ctx.lineTo(wx, wy);
      }
      ctx.strokeStyle = reactionBoost.current > 0.4 ? "#fdf2f8" : "#ffedd5";
      ctx.lineWidth = 2.2;
      ctx.stroke();

      // Draw inside bubbles
      bubbles.forEach((b) => {
        // Compute canvas coordinates inside the tube
        const bx = b.x;
        // Y rises relative to bottom curve
        const by = tyBot + tubeWidth / 2 - b.y;

        // Skip if bubble floated above liquid surface
        const cellIndex = Math.min(
          numWavePoints - 1,
          Math.max(0, Math.floor(((bx + tubeWidth / 2) / tubeWidth) * numWavePoints))
        );
        const currentSurf = liquidTopY + wavePoints[cellIndex].y;
        if (by < currentSurf) return;

        ctx.beginPath();
        ctx.arc(bx, by, b.size, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.48)";
        ctx.fill();
        ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";
        ctx.lineWidth = 0.5;
        ctx.stroke();

        // Tiny highlight reflection spot inside bubble
        ctx.beginPath();
        ctx.arc(bx - b.size * 0.35, by - b.size * 0.35, b.size * 0.2, 0, Math.PI * 2);
        ctx.fillStyle = "#fff";
        ctx.fill();
      });

      ctx.restore(); // end of liquid clipping bounds

      // ─── GLASS GLOWS & GLASS REFLECTIONS ───
      // Tube specular reflection streak (brilliant white gradient highlight)
      const reflectionGrad = ctx.createLinearGradient(-tubeWidth / 2, 0, tubeWidth / 2, 0);
      reflectionGrad.addColorStop(0, "rgba(255, 255, 255, 0.3)");
      reflectionGrad.addColorStop(0.15, "rgba(255, 255, 255, 0.5)"); // left highlight
      reflectionGrad.addColorStop(0.3, "rgba(255, 255, 255, 0.15)");
      reflectionGrad.addColorStop(0.7, "rgba(255, 255, 255, 0)");
      reflectionGrad.addColorStop(0.85, "rgba(255, 255, 255, 0.25)"); // right reflection
      reflectionGrad.addColorStop(1, "rgba(255, 255, 255, 0.05)");

      ctx.beginPath();
      ctx.moveTo(-tubeWidth / 2 + 1.2, tyTop);
      ctx.lineTo(-tubeWidth / 2 + 1.2, tyBot);
      ctx.arc(0, tyBot, tubeWidth / 2 - 1.2, Math.PI, 0, true);
      ctx.lineTo(tubeWidth / 2 - 1.2, tyTop);
      ctx.closePath();
      ctx.fillStyle = reflectionGrad;
      ctx.fill();

      // Highlight strokes for glass edges
      ctx.strokeStyle = "rgba(255, 255, 255, 0.65)";
      ctx.lineWidth = 1.0;
      ctx.stroke();

      // Top lip reflection
      ctx.beginPath();
      ctx.ellipse(0, tyTop - 2, tubeWidth / 2 + 2, 4, 0, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.75)";
      ctx.stroke();

      ctx.restore();
    };

    // Draw the molecular holographic scanner HUD and telemetries on the right
    const drawHologram = (t: number) => {
      // ─── HUD OUTER RING (Holographic Projection) ───
      // Subtle pulse shadow / glow
      ctx.beginPath();
      ctx.arc(hologramX, hologramY, hologramRadius + 20, 0, Math.PI * 2);
      const ringGlow = 0.04 + reactionBoost.current * 0.06;
      ctx.fillStyle = `rgba(234, 88, 12, ${ringGlow})`;
      ctx.fill();

      // Brushed circular metal-like holo-ring casing
      const borderThickness = 8;
      ctx.beginPath();
      ctx.arc(hologramX, hologramY, hologramRadius, 0, Math.PI * 2);
      ctx.lineWidth = borderThickness;
      
      const ringGrad = ctx.createLinearGradient(hologramX - hologramRadius, hologramY - hologramRadius, hologramX + hologramRadius, hologramY + hologramRadius);
      ringGrad.addColorStop(0, "#ea580c");
      ringGrad.addColorStop(0.3, "#ffedd5"); // high highlight
      ringGrad.addColorStop(0.55, "#c2410c");
      ringGrad.addColorStop(0.8, "#f97316");
      ringGrad.addColorStop(1, "#431407");
      ctx.strokeStyle = ringGrad;
      ctx.stroke();

      // Inner thin scanner scale ring
      ctx.beginPath();
      ctx.arc(hologramX, hologramY, hologramRadius - 5, 0, Math.PI * 2);
      ctx.lineWidth = 1.0;
      ctx.strokeStyle = "rgba(234, 88, 12, 0.35)";
      ctx.stroke();

      // Technical tick marks around holographic lens
      ctx.save();
      ctx.translate(hologramX, hologramY);
      ctx.strokeStyle = "rgba(234, 88, 12, 0.28)";
      ctx.lineWidth = 1;
      const ticks = 36;
      for (let i = 0; i < ticks; i++) {
        ctx.rotate((Math.PI * 2) / ticks);
        ctx.beginPath();
        const start = hologramRadius - 10;
        const len = i % 9 === 0 ? 8 : 4;
        ctx.moveTo(start, 0);
        ctx.lineTo(start - len, 0);
        ctx.stroke();
      }
      ctx.restore();

      // Holographic clipping boundary
      ctx.save();
      ctx.beginPath();
      ctx.arc(hologramX, hologramY, hologramRadius - 6, 0, Math.PI * 2);
      ctx.clip();

      // Hologram background grid & color tint
      const glassGrad = ctx.createRadialGradient(hologramX, hologramY, 10, hologramX, hologramY, hologramRadius);
      glassGrad.addColorStop(0, "rgba(255, 255, 255, 0.95)");
      glassGrad.addColorStop(0.5, "rgba(255, 247, 237, 0.92)"); // light cream/orange hue
      glassGrad.addColorStop(0.85, "rgba(254, 215, 170, 0.7)");
      glassGrad.addColorStop(1, "rgba(253, 186, 116, 0.45)");
      ctx.fillStyle = glassGrad;
      ctx.fill();

      // Fine clinical grids
      ctx.strokeStyle = "rgba(234, 88, 12, 0.05)";
      ctx.lineWidth = 0.5;
      const grid = 22;
      for (let gx = hologramX - hologramRadius; gx < hologramX + hologramRadius; gx += grid) {
        ctx.beginPath();
        ctx.moveTo(gx, hologramY - hologramRadius);
        ctx.lineTo(gx, hologramY + hologramRadius);
        ctx.stroke();
      }
      for (let gy = hologramY - hologramRadius; gy < hologramY + hologramRadius; gy += grid) {
        ctx.beginPath();
        ctx.moveTo(hologramX - hologramRadius, gy);
        ctx.lineTo(hologramX + hologramRadius, gy);
        ctx.stroke();
      }

      // Draw cellular reaction structures (Mitosis animation)
      const divisionSpeed = 1.0 + reactionBoost.current * 2.8;

      cells.forEach((cell, idx) => {
        // Move towards target coordinates
        if (Math.abs(cell.x - cell.targetX) < 1 && Math.abs(cell.y - cell.targetY) < 1) {
          const angle = Math.random() * Math.PI * 2;
          const dist = Math.random() * 30 + 10;
          cell.targetX = hologramX + Math.cos(angle) * dist * 1.5;
          cell.targetY = hologramY + Math.sin(angle) * dist * 1.5;
        }
        cell.x += (cell.targetX - cell.x) * 0.008 * divisionSpeed;
        cell.y += (cell.targetY - cell.y) * 0.008 * divisionSpeed;
        cell.angle += 0.003 * divisionSpeed;

        // Trigger division trigger programmatically (boost speeds this up)
        if (!cell.isSplitting && Math.random() < 0.0018 + reactionBoost.current * 0.015 && idx === 3) {
          cell.isSplitting = true;
          cell.splitProgress = 0;
        }

        const pulse = Math.sin(t * 0.035 + cell.pulseOffset) * 1.0;
        const rad = cell.size + pulse;

        ctx.save();
        ctx.translate(cell.x, cell.y);
        ctx.rotate(cell.angle);

        if (cell.isSplitting) {
          cell.splitProgress += 0.006 * divisionSpeed;
          if (cell.splitProgress >= 1) {
            cell.isSplitting = false;
            cell.splitProgress = 0;
          }

          const offset = cell.splitProgress * 15;
          
          // Split left half
          ctx.beginPath();
          ctx.arc(-offset, 0, rad * 0.85, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(234, 88, 12, 0.22)";
          ctx.fill();
          ctx.strokeStyle = "#ea580c";
          ctx.lineWidth = 1.8;
          ctx.stroke();

          // Core Nucleolus left
          ctx.beginPath();
          ctx.arc(-offset - rad * 0.1, 0, rad * 0.22, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(234, 88, 12, 0.7)";
          ctx.fill();
          
          // Split right half
          ctx.beginPath();
          ctx.arc(offset, 0, rad * 0.85, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(234, 88, 12, 0.22)";
          ctx.fill();
          ctx.stroke();

          // Core Nucleolus right
          ctx.beginPath();
          ctx.arc(offset + rad * 0.1, 0, rad * 0.22, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(234, 88, 12, 0.7)";
          ctx.fill();

          // Connection chromatin bridge
          ctx.beginPath();
          ctx.moveTo(-offset, -rad * 0.4);
          ctx.quadraticCurveTo(0, -rad * (0.4 - cell.splitProgress * 0.3), offset, -rad * 0.4);
          ctx.lineTo(offset, rad * 0.4);
          ctx.quadraticCurveTo(0, rad * (0.4 - cell.splitProgress * 0.3), -offset, rad * 0.4);
          ctx.closePath();
          ctx.fillStyle = "rgba(234, 88, 12, 0.16)";
          ctx.fill();
          ctx.stroke();

        } else {
          // Normal unsplit cell
          ctx.beginPath();
          ctx.arc(0, 0, rad, 0, Math.PI * 2);
          
          const cellGrad = ctx.createRadialGradient(-rad * 0.2, -rad * 0.2, rad * 0.05, 0, 0, rad);
          cellGrad.addColorStop(0, "rgba(255, 255, 255, 0.95)");
          cellGrad.addColorStop(0.45, "rgba(251, 146, 60, 0.42)");
          cellGrad.addColorStop(0.85, "rgba(234, 88, 12, 0.25)");
          cellGrad.addColorStop(1, "rgba(234, 88, 12, 0.42)");

          ctx.fillStyle = cellGrad;
          ctx.fill();
          ctx.strokeStyle = "#ea580c";
          ctx.lineWidth = 1.8;
          ctx.stroke();

          // Floating Internal Organelles / Nucleolus
          ctx.beginPath();
          ctx.arc(-rad * 0.1, -rad * 0.1, rad * 0.26, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(234, 88, 12, 0.65)";
          ctx.fill();

          // Mitochondria details inside cell
          ctx.beginPath();
          ctx.ellipse(rad * 0.35, rad * 0.25, rad * 0.16, rad * 0.08, 0.5, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(249, 115, 22, 0.4)";
          ctx.fill();
        }

        ctx.restore();
      });

      // Chromatin bonds / interlinking atomic strings
      ctx.beginPath();
      ctx.lineWidth = 0.8;
      ctx.strokeStyle = "rgba(234, 88, 12, 0.24)";
      for (let i = 0; i < cells.length; i++) {
        for (let j = i + 1; j < cells.length; j++) {
          const dx = cells[i].x - cells[j].x;
          const dy = cells[i].y - cells[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.moveTo(cells[i].x, cells[i].y);
            ctx.lineTo(cells[j].x, cells[j].y);
          }
        }
      }
      ctx.stroke();

      // Render micro energy particles within hologram
      holoParticles.forEach((hp) => {
        ctx.beginPath();
        ctx.arc(hp.x, hp.y, hp.size, 0, Math.PI * 2);
        ctx.fillStyle = hp.color;
        ctx.globalAlpha = hp.alpha * (1 - hp.life / hp.maxLife);
        ctx.fill();
      });
      ctx.globalAlpha = 1.0;

      ctx.restore(); // end hologram clipping

      // ─── HOLOGRAM LENS CHROMATIC ABERRATION EDGE SHINE ───
      ctx.beginPath();
      ctx.arc(hologramX, hologramY, hologramRadius - 6, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(236, 72, 153, 0.28)"; // pink fringe highlight
      ctx.lineWidth = 2.0;
      ctx.stroke();

      // ─── GLASS REFLECTION SPECULAR GLARE ───
      const highlightGrad = ctx.createLinearGradient(hologramX - hologramRadius, hologramY - hologramRadius, hologramX + hologramRadius, hologramY + hologramRadius);
      highlightGrad.addColorStop(0, "rgba(255, 255, 255, 0.45)");
      highlightGrad.addColorStop(0.25, "rgba(255, 255, 255, 0.1)");
      highlightGrad.addColorStop(0.5, "rgba(255, 255, 255, 0)");
      highlightGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
      
      ctx.beginPath();
      ctx.arc(hologramX, hologramY, hologramRadius - 6, 0, Math.PI * 2);
      ctx.fillStyle = highlightGrad;
      ctx.fill();

      // ─── TELEMETRY HUD DATA DISPLAY ───
      ctx.font = "bold 9px ui-monospace, SFMono-Regular, monospace";
      ctx.fillStyle = "#ea580c";
      ctx.fillText("[HOLO-REACTANT SPECTROMETER]", hologramX - 70, hologramY + hologramRadius + 22);

      // Pulse telemetry status line
      ctx.beginPath();
      ctx.lineWidth = 1.0;
      ctx.strokeStyle = "rgba(234, 88, 12, 0.45)";
      const plotY = hologramY + hologramRadius + 38;
      const length = 130;
      const startX = hologramX - length / 2;
      ctx.moveTo(startX, plotY);
      for (let k = 0; k < length; k++) {
        const kX = startX + k;
        let kY = plotY;
        const speedFactor = 1.5 + reactionBoost.current * 4;
        const cycle = (t * speedFactor + k * 1.5) % 80;
        if (cycle < 15) {
          kY = plotY - Math.sin((cycle / 15) * Math.PI) * (10 + reactionBoost.current * 20);
        } else if (cycle < 30) {
          kY = plotY + Math.sin(((cycle - 15) / 15) * Math.PI) * (5 + reactionBoost.current * 10);
        }
        ctx.lineTo(kX, kY);
      }
      ctx.stroke();

      // Telemetry numeric display text
      ctx.font = "8px ui-monospace, SFMono-Regular, monospace";
      ctx.fillStyle = "rgba(120, 113, 108, 0.8)";
      const stability = (84.2 + Math.sin(t * 0.05) * 1.5 + reactionBoost.current * 10).toFixed(1);
      ctx.fillText(`STABILITY: ${stability}%`, startX, plotY + 12);
      const output = (1.2 + reactionBoost.current * 2.4 + Math.sin(t * 0.1) * 0.05).toFixed(2);
      ctx.fillText(`ENERGY: ${output}GW`, startX + 75, plotY + 12);
    };

    // Render loop
    const render = () => {
      time += 1;
      
      // Decay reaction boost
      reactionBoost.current *= 0.94;
      if (reactionBoost.current < 0.01) reactionBoost.current = 0;

      ctx.clearRect(0, 0, width, height);

      // Update liquid slosh wave values
      updateLiquidWaves();

      // Draw backdrop grid shadow
      ctx.fillStyle = "rgba(9, 9, 11, 0.01)";
      ctx.fillRect(0, 0, width, height);

      // ─── 1. SIMULATE AND UPDATE PARTICLES ───
      
      // Spawn new bubbles inside test tube liquid at bottom curve (pivot-centric)
      if (Math.random() < 0.28 && bubbles.length < 24) {
        bubbles.push({
          x: (Math.random() - 0.5) * (tubeWidth - 8),
          y: Math.random() * 10,
          vy: Math.random() * 0.6 + 0.4,
          size: Math.random() * 2 + 1,
          wobbleSpeed: Math.random() * 0.1 + 0.05,
          wobbleAmount: Math.random() * 1.2 + 0.3,
          wobbleOffset: Math.random() * Math.PI * 2,
        });
      }

      // Update test tube bubbles
      bubbles.forEach((b) => {
        b.y += b.vy;
        b.x += Math.sin(b.y * b.wobbleSpeed + b.wobbleOffset) * 0.08 * b.wobbleAmount;
      });
      // Filter out bubbles that popped (reached liquid surface)
      bubbles = bubbles.filter((b) => {
        const liquidTopY = tubeLength / 2 - tubeWidth / 2 - liquidMaxHeight;
        const by = tubeLength / 2 - tubeWidth / 2 - b.y;
        
        const cellIndex = Math.min(
          numWavePoints - 1,
          Math.max(0, Math.floor(((b.x + tubeWidth / 2) / tubeWidth) * numWavePoints))
        );
        const currentSurf = liquidTopY + wavePoints[cellIndex].y;
        
        // If bubble surface height is above current dynamic liquid wave height, pop it!
        const popped = by < currentSurf;
        if (popped) {
          // Trigger microscopic gas smoke ejection
          // Convert bubble coordinates back to tube space
          const cos = Math.cos(tubeAngle);
          const sin = Math.sin(tubeAngle);
          
          const tubeX = b.x;
          const tubeY = by;
          
          // Map to absolute canvas coordinates
          const bxAbs = tubePivotX + tubeX * cos - tubeY * sin;
          const byAbs = tubePivotY + Math.sin(time * 0.015) * 3 + tubeX * sin + tubeY * cos;

          if (Math.random() < 0.6) {
            smokeParticles.push({
              x: bxAbs,
              y: byAbs - 15,
              vx: (Math.random() - 0.5) * 0.8 + Math.sin(tubeAngle) * -0.5,
              vy: -Math.random() * 0.8 - 0.4,
              size: Math.random() * 3 + 2,
              color: Math.random() > 0.45 ? "#ea580c" : "#f472b6",
              alpha: Math.random() * 0.5 + 0.25,
              life: 0,
              maxLife: Math.floor(Math.random() * 60) + 40,
            });
          }
        }
        return !popped;
      });

      // Update and draw active falling drops
      activeDrops.forEach((drop) => {
        drop.y += drop.vy;
        drop.vy += 0.22; // gravity constant

        // Draw drop
        ctx.beginPath();
        ctx.arc(drop.x, drop.y, drop.size, 0, Math.PI * 2);
        ctx.fillStyle = drop.color;
        ctx.shadowColor = drop.color;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0; // reset

        // Collision check with test tube liquid surface
        // Map absolute droplet coordinate to local tube coordinates
        const cos = Math.cos(tubeAngle);
        const sin = Math.sin(tubeAngle);

        const dyLocal = (drop.y - (tubePivotY + Math.sin(time * 0.015) * 3));
        const dxLocal = (drop.x - tubePivotX);

        // Project onto angled centerline of tube
        const localTubeY = dyLocal * cos + dxLocal * sin;
        const localTubeX = -dyLocal * sin + dxLocal * cos;

        // Tube bottom curve
        const tyBot = tubeLength / 2 - tubeWidth / 2;
        const liquidTopY = tyBot + tubeWidth / 2 - liquidMaxHeight;

        // If droplet enters tube mouth and reaches liquid column surface
        if (Math.abs(localTubeX) < tubeWidth / 2 && localTubeY >= liquidTopY) {
          // Splash liquid reaction!
          const waveCell = Math.min(
            numWavePoints - 1,
            Math.max(0, Math.floor(((localTubeX + tubeWidth / 2) / tubeWidth) * numWavePoints))
          );
          
          // Apply kinetic force to spring wave grid
          wavePoints[waveCell].vy += 12.0;
          if (waveCell > 0) wavePoints[waveCell - 1].vy += 6;
          if (waveCell < numWavePoints - 1) wavePoints[waveCell + 1].vy += 6;

          // Trigger reaction boost flare
          reactionBoost.current = 1.0;

          // Spawn particle explosion!
          for (let sp = 0; sp < 15; sp++) {
            smokeParticles.push({
              x: drop.x,
              y: drop.y,
              vx: (Math.random() - 0.5) * 2.8 + Math.sin(tubeAngle) * -1,
              vy: -Math.random() * 1.8 - 0.8,
              size: Math.random() * 5 + 3,
              color: Math.random() > 0.4 ? "#ea580c" : "#ec4899",
              alpha: Math.random() * 0.8 + 0.2,
              life: 0,
              maxLife: Math.floor(Math.random() * 70) + 60,
            });
          }

          // Mark droplet for removal
          drop.y = height + 100;
        }
      });
      activeDrops = activeDrops.filter((d) => d.y < height);

      // Spawn new holo energy nodes randomly (speeds up during reactions)
      if (Math.random() < 0.22 + reactionBoost.current * 0.5 && holoParticles.length < 50) {
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * (hologramRadius - 20);
        holoParticles.push({
          x: hologramX + Math.cos(angle) * dist,
          y: hologramY + Math.sin(angle) * dist,
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() - 0.5) * 0.8,
          size: Math.random() * 2 + 1,
          color: Math.random() > 0.5 ? "#ea580c" : "#f97316",
          alpha: Math.random() * 0.6 + 0.4,
          life: 0,
          maxLife: Math.floor(Math.random() * 90) + 60,
        });
      }

      // Update holo energy particles
      holoParticles.forEach((hp) => {
        hp.x += hp.vx * (1.0 + reactionBoost.current * 2);
        hp.y += hp.vy * (1.0 + reactionBoost.current * 2);
        hp.life += 1;

        // Attract particles to mouse if active near hologram
        if (mousePos.current.active) {
          const mdx = mousePos.current.x - hp.x;
          const mdy = mousePos.current.y - hp.y;
          const dist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (dist < hologramRadius + 30) {
            hp.vx += (mdx / dist) * 0.04;
            hp.vy += (mdy / dist) * 0.04;
          }
        }

        // Clip boundary containment
        const dx = hp.x - hologramX;
        const dy = hp.y - hologramY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > hologramRadius - 10) {
          hp.x = hologramX + (dx / dist) * (hologramRadius - 10);
          hp.vx = -hp.vx * 0.5;
          hp.vy = -hp.vy * 0.5;
        }
      });
      holoParticles = holoParticles.filter((hp) => hp.life < hp.maxLife);

      // Update rising smoke particles
      smokeParticles.forEach((sp) => {
        sp.x += sp.vx;
        sp.y += sp.vy;
        // Float towards hologram projector cone slightly
        const deltaHoloX = hologramX - sp.x;
        const deltaHoloY = hologramY - sp.y;
        const dHolo = Math.sqrt(deltaHoloX * deltaHoloX + deltaHoloY * deltaHoloY);
        if (dHolo > 40) {
          sp.vx += (deltaHoloX / dHolo) * 0.015;
          sp.vy += (deltaHoloY / dHolo) * 0.005;
        }
        sp.life += 1;

        // Draw smoke
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, sp.size * (1 + sp.life / sp.maxLife), 0, Math.PI * 2);
        ctx.fillStyle = sp.color;
        
        const opacity = sp.alpha * (1 - sp.life / sp.maxLife);
        ctx.globalAlpha = opacity;
        ctx.fill();
      });
      ctx.globalAlpha = 1.0;
      smokeParticles = smokeParticles.filter((sp) => sp.life < sp.maxLife);

      // ─── 2. HOLOGRAPHIC LIGHT BEAM CONE (Connecting tube to hologram screen) ───
      // Projector base coordinates (angled test tube mouth center)
      const cos = Math.cos(tubeAngle);
      const sin = Math.sin(tubeAngle);
      const tubeMouthX = tubePivotX + (-tubeLength / 2) * -sin;
      const tubeMouthY = tubePivotY + Math.sin(time * 0.015) * 3 + (-tubeLength / 2) * cos;

      ctx.save();
      const beamGrad = ctx.createLinearGradient(tubeMouthX, tubeMouthY, hologramX - hologramRadius * 0.5, hologramY);
      beamGrad.addColorStop(0, "rgba(234, 88, 12, 0.75)"); // Intense orange laser source
      beamGrad.addColorStop(0.4, "rgba(249, 115, 22, 0.16)");
      beamGrad.addColorStop(1, "rgba(234, 88, 12, 0.02)");

      ctx.beginPath();
      ctx.moveTo(tubeMouthX - 10, tubeMouthY);
      ctx.bezierCurveTo(
        tubeMouthX + 40, tubeMouthY - 60,
        hologramX - hologramRadius - 50, hologramY + hologramRadius,
        hologramX - hologramRadius * 0.7, hologramY + hologramRadius * 0.7
      );
      ctx.lineTo(hologramX - hologramRadius * 0.7, hologramY - hologramRadius * 0.7);
      ctx.bezierCurveTo(
        hologramX - hologramRadius - 50, hologramY - hologramRadius,
        tubeMouthX + 20, tubeMouthY - 80,
        tubeMouthX + 10, tubeMouthY
      );
      ctx.closePath();
      ctx.fillStyle = beamGrad;
      ctx.fill();
      ctx.restore();

      // ─── 3. RENDER SUB-ASSEMBLIES ───
      drawScientist(time);
      drawTestTube(time);
      drawPipette(time);
      drawHologram(time);

      animationFrameId = requestAnimationFrame(render);
    };

    const handleCanvasClick = () => {
      activeDrops.push({
        x: pipetteX,
        y: pipetteY,
        vy: 1.0,
        color: "#ea580c",
        size: 4.5,
      });
    };
    canvas.addEventListener("click", handleCanvasClick);

    render();
    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener("click", handleCanvasClick);
    };
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
    <div ref={containerRef} className="w-full h-full min-h-[640px] md:min-h-[720px] flex items-center justify-center relative select-none cursor-pointer">
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="w-full h-full max-w-[580px] max-h-[700px]"
      />
      {/* Visual background wrapper HUD grid overlay */}
      <div className="absolute inset-0 border border-zinc-100 rounded-[3rem] pointer-events-none bg-[radial-gradient(circle_at_70%_35%,rgba(234,88,12,0.03)_0%,transparent_60%)]" />
      
      {/* Subtle floating click instruction label */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full border border-zinc-200 bg-white/70 backdrop-blur text-[10px] font-mono text-zinc-500 uppercase tracking-wider shadow-sm pointer-events-none">
        Click Canvas to Drop Reactant
      </div>
    </div>
  );
}

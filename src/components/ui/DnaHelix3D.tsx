"use client";

import React, { useEffect, useRef, useState } from "react";

interface Gene {
  name: string;
  angle: number;
  yFraction: number; // Vertical position as a fraction of DNA height (-0.5 to 0.5)
  color: string;
}

export function DnaHelix3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 500, height: 680 });

  // Refs for tracking interactive rotation
  const isDragging = useRef(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });
  const rotation = useRef({ x: 0.15, y: 0 }); // Current rotation state
  const targetRotation = useRef({ x: 0.15, y: 0 }); // Target rotation state (for smooth interpolation)
  const autoRotateSpeed = useRef(0.005); // Slow, premium automatic rotation speed

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
    // Extra timeout trigger to ensure parent layouts are fully computed
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

    // High DPI scaling
    const dpr = window.devicePixelRatio || 1;
    canvas.width = dimensions.width * dpr;
    canvas.height = dimensions.height * dpr;
    ctx.scale(dpr, dpr);

    // DYNAMIC MATHEMATICAL SCALING
    // All 3D parameters scale as direct percentages of the canvas size to prevent clipping!
    const dnaHeight = dimensions.height * 0.70; // Helix occupies exactly 70% of canvas height
    const radius = Math.min(dimensions.width * 0.16, 72); // Strands radius capped at 72px for perfect aspect ratio
    const orbitRadius = radius * 1.85; // Orbit radius scales proportionally with strand radius
    
    const numPoints = 36; // Dense premium connection nodes
    const maxTheta = 4.2 * Math.PI; // Coils/wraps
    const fov = 460;
    const distance = 350;

    // 9 genes distributed vertically by fraction (-0.45 to 0.45 of dnaHeight)
    const geneLabels: Gene[] = [
      { name: "BRCA1", angle: 0, yFraction: -0.44, color: "#ea580c" },
      { name: "TP53", angle: Math.PI * 0.4, yFraction: -0.33, color: "#d97706" },
      { name: "EGFR", angle: Math.PI * 0.8, yFraction: -0.22, color: "#ea580c" },
      { name: "CRISPR", angle: Math.PI * 1.2, yFraction: -0.11, color: "#d97706" },
      { name: "mRNA", angle: Math.PI * 1.6, yFraction: 0.02, color: "#ea580c" },
      { name: "VEGF", angle: Math.PI * 2.0, yFraction: 0.13, color: "#d97706" },
      { name: "PTEN", angle: Math.PI * 2.4, yFraction: 0.24, color: "#18181b" },
      { name: "MYC", angle: Math.PI * 2.8, yFraction: 0.34, color: "#18181b" },
      { name: "KRAS", angle: Math.PI * 3.2, yFraction: 0.44, color: "#18181b" },
    ];

    // Specular lighting shade generator
    const getShades = (color: string) => {
      if (color === "#ea580c") return { dark: "#9a3412", light: "#ff8c52" };
      if (color === "#d97706") return { dark: "#78350f", light: "#fbbf24" };
      if (color === "#eab308") return { dark: "#854d0e", light: "#fef08a" };
      return { dark: "#09090b", light: "#71717a" }; // charcoal / dark
    };

    // Helper functions for 3D rotation and projection
    const rotate3D = (x: number, y: number, z: number, tiltX: number, rotY: number) => {
      // Rotate around Y-axis (primary revolving rotation)
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const x1 = x * cosY - z * sinY;
      const z1 = x * sinY + z * cosY;

      // Rotate around X-axis (tilt)
      const cosX = Math.cos(tiltX);
      const sinX = Math.sin(tiltX);
      const y2 = y * cosX - z1 * sinX;
      const z2 = y * sinX + z1 * cosX;

      return { x: x1, y: y2, z: z2 };
    };

    const project = (pt: { x: number; y: number; z: number }, cx: number, cy: number) => {
      const depthScale = fov / (pt.z + distance);
      return {
        x: cx + pt.x * depthScale,
        y: cy + pt.y * depthScale,
        depthScale,
        z: pt.z,
      };
    };

    type DrawItem =
      | {
          type: "node";
          z: number;
          x: number;
          y: number;
          depthScale: number;
          color: string;
          lightColor: string;
          darkColor: string;
        }
      | {
          type: "rung";
          z: number;
          x1: number;
          y1: number;
          x2: number;
          y2: number;
          depthScale: number;
          colorA: string;
          lightColorA: string;
          darkColorA: string;
          colorB: string;
          lightColorB: string;
          darkColorB: string;
        }
      | {
          type: "strand";
          z: number;
          x1: number;
          y1: number;
          x2: number;
          y2: number;
          depthScale: number;
          color: string;
          lightColor: string;
          darkColor: string;
        }
      | {
          type: "label";
          z: number;
          x: number;
          y: number;
          depthScale: number;
          name: string;
          color: string;
        };

    const render = () => {
      time += 1;
      
      // Clear canvas
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);

      const cx = dimensions.width / 2;
      const cy = dimensions.height / 2;

      // Update rotation with smooth damping (lerp)
      if (!isDragging.current) {
        targetRotation.current.y += autoRotateSpeed.current;
        targetRotation.current.x += (0.15 - targetRotation.current.x) * 0.02;
      }

      rotation.current.x += (targetRotation.current.x - rotation.current.x) * 0.1;
      rotation.current.y += (targetRotation.current.y - rotation.current.y) * 0.1;

      const tiltX = rotation.current.x;
      const rotY = rotation.current.y;

      const drawItems: DrawItem[] = [];

      // 1. Generate DNA Strands and Rungs
      const prevPoints: { 
        A?: { x: number; y: number; z: number; ds: number }; 
        B?: { x: number; y: number; z: number; ds: number } 
      } = {};

      for (let i = 0; i < numPoints; i++) {
        const t = i / (numPoints - 1);
        const theta = t * maxTheta;
        const y = -dnaHeight / 2 + t * dnaHeight; // Fully responsive height layout

        // Nucleotide pairing shades mapping
        const colorA = i % 2 === 0 ? "#ea580c" : "#d97706";
        const colorB = i % 2 === 0 ? "#eab308" : "#ea580c";

        const shadesA = getShades(colorA);
        const shadesB = getShades(colorB);

        // Strand A Point
        const rawA = {
          x: radius * Math.cos(theta),
          y: y,
          z: radius * Math.sin(theta),
        };
        const rotA = rotate3D(rawA.x, rawA.y, rawA.z, tiltX, rotY);
        const projA = project(rotA, cx, cy);

        // Strand B Point (offset by PI)
        const rawB = {
          x: radius * Math.cos(theta + Math.PI),
          y: y,
          z: radius * Math.sin(theta + Math.PI),
        };
        const rotB = rotate3D(rawB.x, rawB.y, rawB.z, tiltX, rotY);
        const projB = project(rotB, cx, cy);

        // Add Molecular Joint Nodes
        drawItems.push({
          type: "node",
          z: projA.z,
          x: projA.x,
          y: projA.y,
          depthScale: projA.depthScale,
          color: colorA,
          lightColor: shadesA.light,
          darkColor: shadesA.dark,
        });

        drawItems.push({
          type: "node",
          z: projB.z,
          x: projB.x,
          y: projB.y,
          depthScale: projB.depthScale,
          color: colorB,
          lightColor: shadesB.light,
          darkColor: shadesB.dark,
        });

        // Add Rungs (connecting lines)
        drawItems.push({
          type: "rung",
          z: (projA.z + projB.z) / 2,
          x1: projA.x,
          y1: projA.y,
          x2: projB.x,
          y2: projB.y,
          depthScale: (projA.depthScale + projB.depthScale) / 2,
          colorA,
          lightColorA: shadesA.light,
          darkColorA: shadesA.dark,
          colorB,
          lightColorB: shadesB.light,
          darkColorB: shadesB.dark,
        });

        // Add Strand connecting lines to previous points
        if (i > 0 && prevPoints.A && prevPoints.B) {
          const strandShadesA = getShades("#ea580c");
          const strandShadesB = getShades("#eab308");

          drawItems.push({
            type: "strand",
            z: (projA.z + prevPoints.A.z) / 2,
            x1: projA.x,
            y1: projA.y,
            x2: prevPoints.A.x,
            y2: prevPoints.A.y,
            depthScale: (projA.depthScale + prevPoints.A.ds) / 2,
            color: "#ea580c",
            lightColor: strandShadesA.light,
            darkColor: strandShadesA.dark,
          });

          drawItems.push({
            type: "strand",
            z: (projB.z + prevPoints.B.z) / 2,
            x1: projB.x,
            y1: projB.y,
            x2: prevPoints.B.x,
            y2: prevPoints.B.y,
            depthScale: (projB.depthScale + prevPoints.B.ds) / 2,
            color: "#eab308",
            lightColor: strandShadesB.light,
            darkColor: strandShadesB.dark,
          });
        }

        prevPoints.A = { x: projA.x, y: projA.y, z: projA.z, ds: projA.depthScale };
        prevPoints.B = { x: projB.x, y: projB.y, z: projB.z, ds: projB.depthScale };
      }

      // 2. Generate Gene Orbiting Labels
      geneLabels.forEach((gene) => {
        const geneAngle = gene.angle + rotY * 0.38; // Orbit Y rate slower than helix spin
        const rawG = {
          x: orbitRadius * Math.cos(geneAngle),
          y: (gene.yFraction * dnaHeight) + Math.sin(time * 0.02 + gene.angle) * 10, // Organic floating scaled
          z: orbitRadius * Math.sin(geneAngle),
        };
        const rotG = rotate3D(rawG.x, rawG.y, rawG.z, tiltX, 0);
        const projG = project(rotG, cx, cy);

        drawItems.push({
          type: "label",
          z: projG.z,
          x: projG.x,
          y: projG.y,
          depthScale: projG.depthScale,
          name: gene.name,
          color: gene.color,
        });
      });

      // 3. Painter's Algorithm: Sort by depth (Z value descending)
      drawItems.sort((a, b) => b.z - a.z);

      // 4. Draw sorted items
      drawItems.forEach((item) => {
        const tDepth = Math.max(0, Math.min(1, (item.z + orbitRadius) / (orbitRadius * 2)));

        if (item.type === "strand") {
          // Robust thick cylindrical light backbones
          // Pass 1: Outer shadow depth layer
          ctx.beginPath();
          ctx.moveTo(item.x1, item.y1);
          ctx.lineTo(item.x2, item.y2);
          ctx.lineWidth = 11.0 * item.depthScale;
          ctx.strokeStyle = item.darkColor;
          ctx.globalAlpha = 0.85 - tDepth * 0.6;
          ctx.stroke();

          // Pass 2: Main tube color body
          ctx.beginPath();
          ctx.moveTo(item.x1, item.y1);
          ctx.lineTo(item.x2, item.y2);
          ctx.lineWidth = 7.0 * item.depthScale;
          ctx.strokeStyle = item.color;
          ctx.globalAlpha = 0.95 - tDepth * 0.65;
          ctx.stroke();

          // Pass 3: Specular glow highlighting
          ctx.beginPath();
          ctx.moveTo(item.x1, item.y1);
          ctx.lineTo(item.x2, item.y2);
          ctx.lineWidth = 2.4 * item.depthScale;
          ctx.strokeStyle = item.lightColor;
          ctx.globalAlpha = 1.0 - tDepth * 0.7;
          ctx.stroke();

        } else if (item.type === "rung") {
          // Calculate vector coordinates and length
          const dx = item.x2 - item.x1;
          const dy = item.y2 - item.y1;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const ux = dx / dist;
          const uy = dy / dist;

          const midpointX = (item.x1 + item.x2) / 2;
          const midpointY = (item.y1 + item.y2) / 2;

          // Split base pair rungs: Half A
          const halfScale = 8.0 * item.depthScale;
          const endA_x = midpointX - ux * halfScale;
          const endA_y = midpointY - uy * halfScale;

          // Split base pair rungs: Half B
          const endB_x = midpointX + ux * halfScale;
          const endB_y = midpointY + uy * halfScale;

          // Render Cylinder Half A
          ctx.beginPath();
          ctx.moveTo(item.x1, item.y1);
          ctx.lineTo(endA_x, endA_y);
          ctx.lineWidth = 6.8 * item.depthScale;
          ctx.strokeStyle = item.darkColorA;
          ctx.globalAlpha = 0.75 - tDepth * 0.5;
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(item.x1, item.y1);
          ctx.lineTo(endA_x, endA_y);
          ctx.lineWidth = 3.8 * item.depthScale;
          ctx.strokeStyle = item.colorA;
          ctx.globalAlpha = 0.85 - tDepth * 0.55;
          ctx.stroke();

          // Render Cylinder Half B
          ctx.beginPath();
          ctx.moveTo(item.x2, item.y2);
          ctx.lineTo(endB_x, endB_y);
          ctx.lineWidth = 6.8 * item.depthScale;
          ctx.strokeStyle = item.darkColorB;
          ctx.globalAlpha = 0.75 - tDepth * 0.5;
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(item.x2, item.y2);
          ctx.lineTo(endB_x, endB_y);
          ctx.lineWidth = 3.8 * item.depthScale;
          ctx.strokeStyle = item.colorB;
          ctx.globalAlpha = 0.85 - tDepth * 0.55;
          ctx.stroke();

          // Draw floating glowing Hydrogen Bond nodes in the center gap
          const dotRadius = 2.0 * item.depthScale;
          ctx.fillStyle = "#ffffff";
          ctx.globalAlpha = 0.95 - tDepth * 0.6;

          // 3 horizontal dots representing bonding
          [-3.0, 0, 3.0].forEach((offsetMultiplier) => {
            const bx = midpointX + ux * offsetMultiplier * item.depthScale;
            const by = midpointY + uy * offsetMultiplier * item.depthScale;
            ctx.beginPath();
            ctx.arc(bx, by, dotRadius, 0, 2 * Math.PI);
            ctx.fill();
          });

        } else if (item.type === "node") {
          // Monumental 3D glossy shaded sphere using radial gradients
          const nodeRadius = 9.8 * item.depthScale;
          
          const grad = ctx.createRadialGradient(
            item.x - nodeRadius * 0.25,
            item.y - nodeRadius * 0.25,
            nodeRadius * 0.05,
            item.x,
            item.y,
            nodeRadius
          );
          grad.addColorStop(0, "#ffffff"); // specular shiny highlight
          grad.addColorStop(0.2, item.lightColor);
          grad.addColorStop(0.7, item.color);
          grad.addColorStop(1, item.darkColor);

          ctx.beginPath();
          ctx.arc(item.x, item.y, nodeRadius, 0, 2 * Math.PI);
          ctx.fillStyle = grad;
          ctx.globalAlpha = 0.98 - tDepth * 0.6;
          ctx.fill();

          // Elegant outer glow envelope for front nodes
          if (tDepth < 0.35) {
            ctx.beginPath();
            ctx.arc(item.x, item.y, nodeRadius * 2.8, 0, 2 * Math.PI);
            ctx.fillStyle = item.color;
            ctx.globalAlpha = 0.16 * (1 - tDepth / 0.35);
            ctx.fill();
          }

        } else if (item.type === "label") {
          ctx.globalAlpha = 1.0 - tDepth * 0.75; // Fade labels in the background

          // Glassmorphic capsule tags
          const fontSize = Math.max(9.0, Math.round(11.0 * item.depthScale));
          ctx.font = `bold ${fontSize}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`;
          const textWidth = ctx.measureText(item.name).width;
          const paddingX = 11.0;
          const paddingY = 7.0;
          const pillW = textWidth + paddingX * 2;
          const pillH = fontSize + paddingY * 2;
          const rx = item.x - pillW / 2;
          const ry = item.y - pillH / 2;

          ctx.beginPath();
          ctx.roundRect(rx, ry, pillW, pillH, 8);
          ctx.fillStyle = "rgba(255, 255, 255, 0.90)";
          ctx.fill();

          // Edge border glow
          ctx.strokeStyle = tDepth > 0.5 ? "rgba(228, 228, 231, 0.4)" : "rgba(228, 228, 231, 0.85)";
          ctx.lineWidth = 1.4;
          ctx.stroke();

          // Capsule text
          ctx.fillStyle = item.color === "#18181b" ? "#27272a" : item.color;
          ctx.fillText(item.name, item.x - textWidth / 2, item.y + fontSize / 2.6);
        }
      });

      // Restore alpha
      ctx.globalAlpha = 1.0;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [dimensions]);

  // Interactivity Handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDragging.current = true;
    previousMousePosition.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging.current) return;
    const deltaX = e.clientX - previousMousePosition.current.x;
    const deltaY = e.clientY - previousMousePosition.current.y;

    targetRotation.current.y += deltaX * 0.007;
    targetRotation.current.x = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, targetRotation.current.x + deltaY * 0.007));

    previousMousePosition.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUpOrLeave = () => {
    isDragging.current = false;
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 1) {
      isDragging.current = true;
      previousMousePosition.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDragging.current || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - previousMousePosition.current.x;
    const deltaY = e.touches[0].clientY - previousMousePosition.current.y;

    targetRotation.current.y += deltaX * 0.007;
    targetRotation.current.x = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, targetRotation.current.x + deltaY * 0.007));

    previousMousePosition.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
  };

  return (
    <div ref={containerRef} className="w-full h-full min-h-[640px] md:min-h-[720px] flex items-center justify-center relative select-none">
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="cursor-grab active:cursor-grabbing w-full h-full max-w-[580px] max-h-[700px]"
        style={{ touchAction: "none" }}
      />
      {/* Dynamic tech HUD backdrop */}
      <div className="absolute inset-0 border border-zinc-100 rounded-[3rem] pointer-events-none bg-[radial-gradient(circle_at_50%_50%,rgba(234,88,12,0.025)_0%,transparent_70%)]" />
    </div>
  );
}

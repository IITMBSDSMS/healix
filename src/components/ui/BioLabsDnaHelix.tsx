"use client";

import React, { useEffect, useRef, useState } from "react";

interface Gene {
  name: string;
  angle: number;
  yFraction: number; // Vertical position as fraction (-0.5 to 0.5)
  color: string;
}

export function BioLabsDnaHelix() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 500, height: 680 });

  // Interactive rotation tracking
  const isDragging = useRef(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });
  const rotation = useRef({ x: 0.1, y: 0 });
  const targetRotation = useRef({ x: 0.1, y: 0 });
  const autoRotateSpeed = useRef(0.006);

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

    const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
    canvas.width = dimensions.width * dpr;
    canvas.height = dimensions.height * dpr;
    ctx.scale(dpr, dpr);

    const dnaHeight = dimensions.height * 0.72;
    const radius = Math.min(dimensions.width * 0.18, 76);
    const orbitRadius = radius * 1.8;
    
    const numPoints = 38;
    const maxTheta = 4.0 * Math.PI; // Helix wraps
    const fov = 480;
    const distance = 360;

    // Biological and scientific labels orbiting the strand
    const geneLabels: Gene[] = [
      { name: "BRCA1", angle: 0, yFraction: -0.42, color: "#00C27A" },
      { name: "TP53", angle: Math.PI * 0.4, yFraction: -0.32, color: "#14B8A6" },
      { name: "NeuroNet", angle: Math.PI * 0.8, yFraction: -0.21, color: "#7C3AED" },
      { name: "CRISPR", angle: Math.PI * 1.2, yFraction: -0.10, color: "#00C27A" },
      { name: "mRNA-Seq", angle: Math.PI * 1.6, yFraction: 0.02, color: "#14B8A6" },
      { name: "AI Health", angle: Math.PI * 2.0, yFraction: 0.13, color: "#7C3AED" },
      { name: "Cognitive", angle: Math.PI * 2.4, yFraction: 0.24, color: "#00C27A" },
      { name: "Genomics", angle: Math.PI * 2.8, yFraction: 0.35, color: "#14B8A6" },
      { name: "Bio-Eng", angle: Math.PI * 3.2, yFraction: 0.45, color: "#7C3AED" },
    ];

    const getShades = (color: string) => {
      if (color === "#00C27A") return { dark: "#064e3b", light: "#86efac" };
      if (color === "#14B8A6") return { dark: "#115e59", light: "#99f6e4" };
      if (color === "#7C3AED") return { dark: "#4c1d95", light: "#c084fc" };
      return { dark: "#0f172a", light: "#cbd5e1" };
    };

    const rotate3D = (x: number, y: number, z: number, tiltX: number, rotY: number) => {
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const x1 = x * cosY - z * sinY;
      const z1 = x * sinY + z * cosY;

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
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);

      const cx = dimensions.width / 2;
      const cy = dimensions.height / 2;

      if (!isDragging.current) {
        targetRotation.current.y += autoRotateSpeed.current;
        targetRotation.current.x += (0.1 - targetRotation.current.x) * 0.02;
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
        const y = -dnaHeight / 2 + t * dnaHeight;

        // Alternating colors between Green, Teal, and Purple
        const colorA = i % 3 === 0 ? "#00C27A" : i % 3 === 1 ? "#14B8A6" : "#7C3AED";
        const colorB = i % 3 === 0 ? "#14B8A6" : i % 3 === 1 ? "#7C3AED" : "#00C27A";

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

        // Strand B Point
        const rawB = {
          x: radius * Math.cos(theta + Math.PI),
          y: y,
          z: radius * Math.sin(theta + Math.PI),
        };
        const rotB = rotate3D(rawB.x, rawB.y, rawB.z, tiltX, rotY);
        const projB = project(rotB, cx, cy);

        // Add Nodes
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

        // Add Rungs
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

        // Add Strand lines connecting back
        if (i > 0 && prevPoints.A && prevPoints.B) {
          const strandColorA = "#00C27A";
          const strandColorB = "#14B8A6";
          const strandShadesA = getShades(strandColorA);
          const strandShadesB = getShades(strandColorB);

          drawItems.push({
            type: "strand",
            z: (projA.z + prevPoints.A.z) / 2,
            x1: projA.x,
            y1: projA.y,
            x2: prevPoints.A.x,
            y2: prevPoints.A.y,
            depthScale: (projA.depthScale + prevPoints.A.ds) / 2,
            color: strandColorA,
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
            color: strandColorB,
            lightColor: strandShadesB.light,
            darkColor: strandShadesB.dark,
          });
        }

        prevPoints.A = { x: projA.x, y: projA.y, z: projA.z, ds: projA.depthScale };
        prevPoints.B = { x: projB.x, y: projB.y, z: projB.z, ds: projB.depthScale };
      }

      // 2. Generate Gene Orbiting Labels
      geneLabels.forEach((gene) => {
        const geneAngle = gene.angle + rotY * 0.4;
        const rawG = {
          x: orbitRadius * Math.cos(geneAngle),
          y: (gene.yFraction * dnaHeight) + Math.sin(time * 0.02 + gene.angle) * 8,
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

      // 3. Depth Sort (Painter's Algorithm)
      drawItems.sort((a, b) => b.z - a.z);

      // 4. Render Items
      drawItems.forEach((item) => {
        const tDepth = Math.max(0, Math.min(1, (item.z + orbitRadius) / (orbitRadius * 2)));

        if (item.type === "strand") {
          ctx.beginPath();
          ctx.moveTo(item.x1, item.y1);
          ctx.lineTo(item.x2, item.y2);
          ctx.lineWidth = 9.0 * item.depthScale;
          ctx.strokeStyle = item.darkColor;
          ctx.globalAlpha = 0.8 - tDepth * 0.55;
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(item.x1, item.y1);
          ctx.lineTo(item.x2, item.y2);
          ctx.lineWidth = 5.0 * item.depthScale;
          ctx.strokeStyle = item.color;
          ctx.globalAlpha = 0.9 - tDepth * 0.6;
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(item.x1, item.y1);
          ctx.lineTo(item.x2, item.y2);
          ctx.lineWidth = 1.8 * item.depthScale;
          ctx.strokeStyle = item.lightColor;
          ctx.globalAlpha = 0.95 - tDepth * 0.65;
          ctx.stroke();

        } else if (item.type === "rung") {
          const dx = item.x2 - item.x1;
          const dy = item.y2 - item.y1;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const ux = dx / dist;
          const uy = dy / dist;

          const midpointX = (item.x1 + item.x2) / 2;
          const midpointY = (item.y1 + item.y2) / 2;

          const halfScale = 6.0 * item.depthScale;
          const endA_x = midpointX - ux * halfScale;
          const endA_y = midpointY - uy * halfScale;

          const endB_x = midpointX + ux * halfScale;
          const endB_y = midpointY + uy * halfScale;

          // Half A
          ctx.beginPath();
          ctx.moveTo(item.x1, item.y1);
          ctx.lineTo(endA_x, endA_y);
          ctx.lineWidth = 5.5 * item.depthScale;
          ctx.strokeStyle = item.darkColorA;
          ctx.globalAlpha = 0.7 - tDepth * 0.45;
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(item.x1, item.y1);
          ctx.lineTo(endA_x, endA_y);
          ctx.lineWidth = 3.0 * item.depthScale;
          ctx.strokeStyle = item.colorA;
          ctx.globalAlpha = 0.8 - tDepth * 0.5;
          ctx.stroke();

          // Half B
          ctx.beginPath();
          ctx.moveTo(item.x2, item.y2);
          ctx.lineTo(endB_x, endB_y);
          ctx.lineWidth = 5.5 * item.depthScale;
          ctx.strokeStyle = item.darkColorB;
          ctx.globalAlpha = 0.7 - tDepth * 0.45;
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(item.x2, item.y2);
          ctx.lineTo(endB_x, endB_y);
          ctx.lineWidth = 3.0 * item.depthScale;
          ctx.strokeStyle = item.colorB;
          ctx.globalAlpha = 0.8 - tDepth * 0.5;
          ctx.stroke();

          // Hydrogen bonds dots
          const dotRadius = 1.8 * item.depthScale;
          ctx.fillStyle = "rgba(255,255,255,0.8)";
          ctx.globalAlpha = 0.9 - tDepth * 0.55;

          [-2.5, 0, 2.5].forEach((offsetMultiplier) => {
            const bx = midpointX + ux * offsetMultiplier * item.depthScale;
            const by = midpointY + uy * offsetMultiplier * item.depthScale;
            ctx.beginPath();
            ctx.arc(bx, by, dotRadius, 0, 2 * Math.PI);
            ctx.fill();
          });

        } else if (item.type === "node") {
          const nodeRadius = 8.5 * item.depthScale;
          const grad = ctx.createRadialGradient(
            item.x - nodeRadius * 0.25,
            item.y - nodeRadius * 0.25,
            nodeRadius * 0.05,
            item.x,
            item.y,
            nodeRadius
          );
          grad.addColorStop(0, "#ffffff");
          grad.addColorStop(0.2, item.lightColor);
          grad.addColorStop(0.7, item.color);
          grad.addColorStop(1, item.darkColor);

          ctx.beginPath();
          ctx.arc(item.x, item.y, nodeRadius, 0, 2 * Math.PI);
          ctx.fillStyle = grad;
          ctx.globalAlpha = 0.95 - tDepth * 0.55;
          ctx.fill();

          // Glowing nodes
          if (tDepth < 0.3) {
            ctx.beginPath();
            ctx.arc(item.x, item.y, nodeRadius * 2.4, 0, 2 * Math.PI);
            ctx.fillStyle = item.color;
            ctx.globalAlpha = 0.12 * (1 - tDepth / 0.3);
            ctx.fill();
          }

        } else if (item.type === "label") {
          ctx.globalAlpha = 1.0 - tDepth * 0.7;

          const fontSize = Math.max(8.5, Math.round(10.5 * item.depthScale));
          ctx.font = `600 ${fontSize}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`;
          const textWidth = ctx.measureText(item.name).width;
          const paddingX = 9.0;
          const paddingY = 6.5;
          const pillW = textWidth + paddingX * 2;
          const pillH = fontSize + paddingY * 2;
          const rx = item.x - pillW / 2;
          const ry = item.y - pillH / 2;

          // Glass capsule
          ctx.beginPath();
          ctx.roundRect(rx, ry, pillW, pillH, 6);
          ctx.fillStyle = "rgba(11, 18, 32, 0.85)"; // Matches BioLabs background
          ctx.fill();

          ctx.strokeStyle = `rgba(20, 184, 166, ${tDepth > 0.5 ? "0.2" : "0.55"})`; // Teal border
          ctx.lineWidth = 1.0;
          ctx.stroke();

          ctx.fillStyle = item.color;
          ctx.fillText(item.name, item.x - textWidth / 2, item.y + fontSize / 2.8);
        }
      });

      ctx.globalAlpha = 1.0;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [dimensions]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDragging.current = true;
    previousMousePosition.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging.current) return;
    const deltaX = e.clientX - previousMousePosition.current.x;
    const deltaY = e.clientY - previousMousePosition.current.y;

    targetRotation.current.y += deltaX * 0.006;
    targetRotation.current.x = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, targetRotation.current.x + deltaY * 0.006));

    previousMousePosition.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUpOrLeave = () => {
    isDragging.current = false;
  };

  return (
    <div ref={containerRef} className="w-full h-full min-h-[500px] flex items-center justify-center relative select-none">
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        className="cursor-grab active:cursor-grabbing w-full h-full max-w-[480px] max-h-[640px]"
        style={{ touchAction: "none" }}
      />
      {/* Glow background */}
      <div className="absolute inset-0 border border-slate-800/10 rounded-[2.5rem] pointer-events-none bg-[radial-gradient(circle_at_50%_50%,rgba(0,194,122,0.02)_0%,transparent_65%)]" />
    </div>
  );
}

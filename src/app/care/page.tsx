"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";

/* ─────────────────────────────────────────────────────────
   OFFICIAL LATENCY LOGO
   Orbital globe mark (navy + silver rings) + bold wordmark
───────────────────────────────────────────────────────── */
function LatencyLogo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const iconW = size === "sm" ? 36 : size === "md" ? 48 : 88;
  const iconH = size === "sm" ? 36 : size === "md" ? 48 : 88;
  const textCls = size === "sm" ? "text-xl" : size === "md" ? "text-2xl" : "text-6xl";

  return (
    <div className="flex items-center gap-3 select-none">
      {/* ── Orbital mark ── */}
      <svg
        viewBox="0 0 100 100"
        width={iconW}
        height={iconH}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="lg-sphere" cx="36%" cy="32%" r="68%">
            <stop offset="0%" stopColor="#2f52b8" />
            <stop offset="50%" stopColor="#182d8a" />
            <stop offset="100%" stopColor="#0b1660" />
          </radialGradient>
          <radialGradient id="lg-silver" cx="30%" cy="25%" r="75%">
            <stop offset="0%" stopColor="#d0d8ec" />
            <stop offset="60%" stopColor="#8898c0" />
            <stop offset="100%" stopColor="#505e90" />
          </radialGradient>
          {/* Clip to sphere for layering */}
          <clipPath id="lg-sphere-front">
            <ellipse cx="50" cy="50" rx="31" ry="35" />
          </clipPath>
        </defs>

        {/* ── Back half: silver ring ── */}
        <path
          d="M 14 74 C 20 18 80 8 90 36"
          stroke="url(#lg-silver)"
          strokeWidth="9"
          strokeLinecap="round"
        />
        {/* ── Back half: navy ring ── */}
        <path
          d="M 16 22 C 44 -14 98 48 88 88"
          stroke="#1a2d82"
          strokeWidth="10.5"
          strokeLinecap="round"
        />

        {/* ── Sphere body ── */}
        <ellipse cx="50" cy="50" rx="31" ry="35" fill="url(#lg-sphere)" />
        {/* Subtle specular shine */}
        <ellipse cx="40" cy="34" rx="9" ry="7" fill="rgba(255,255,255,0.09)" />

        {/* ── Front half: silver ring ── */}
        <path
          d="M 14 74 C 24 94 76 97 90 36"
          stroke="url(#lg-silver)"
          strokeWidth="9"
          strokeLinecap="round"
        />
        {/* ── Front half: navy ring ── */}
        <path
          d="M 16 22 C -4 46 10 92 88 88"
          stroke="#1a2d82"
          strokeWidth="10.5"
          strokeLinecap="round"
        />
      </svg>

      {/* ── Wordmark ── */}
      <span
        className={`font-black uppercase select-none leading-none ${textCls}`}
        style={{
          fontFamily: "'Barlow Condensed', 'Arial Narrow', Arial, sans-serif",
          fontStyle: "italic",
          fontWeight: 800,
          color: "#ffffff",
          letterSpacing: "0.04em",
        }}
      >
        LATENCY
      </span>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   HYPER-REALISTIC PLANET RENDERER (procedural + 3D projected)
   Generates detailed texture maps on mount and projects them
   onto spheres using horizontal segments and Lambertian shading.
───────────────────────────────────────────────────────── */

// Seedable random number generator (mulberry32)
function mulberry32(a: number) {
  return function() {
    let t = a += 0x6D2B79F5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(101);
const noiseTable = Array.from({ length: 256 }, () => Math.floor(rand() * 256));
const p = new Uint8Array(512);
for (let i = 0; i < 256; i++) {
  p[i] = p[i + 256] = noiseTable[i];
}

function fade(t: number) {
  return t * t * t * (t * (t * 6 - 15) + 10);
}

function lerp(t: number, a: number, b: number) {
  return a + t * (b - a);
}

function noise3D(x: number, y: number, z: number) {
  const X = Math.floor(x) & 255;
  const Y = Math.floor(y) & 255;
  const Z = Math.floor(z) & 255;

  const xf = x - Math.floor(x);
  const yf = y - Math.floor(y);
  const zf = z - Math.floor(z);

  const u = fade(xf);
  const v = fade(yf);
  const w = fade(zf);

  const A = p[X] + Y;
  const AA = p[A] + Z;
  const AB = p[A + 1] + Z;
  const B = p[X + 1] + Y;
  const BA = p[B] + Z;
  const BB = p[B + 1] + Z;

  const val000 = p[AA] / 255;
  const val100 = p[BA] / 255;
  const val010 = p[AB] / 255;
  const val110 = p[BB] / 255;
  const val001 = p[AA + 1] / 255;
  const val101 = p[BA + 1] / 255;
  const val011 = p[AB + 1] / 255;
  const val111 = p[BB + 1] / 255;

  return lerp(w,
    lerp(v, lerp(u, val000, val100), lerp(u, val010, val110)),
    lerp(v, lerp(u, val001, val101), lerp(u, val011, val111))
  );
}

function fbm3D(x: number, y: number, z: number, octaves = 4) {
  let value = 0;
  let amplitude = 0.5;
  let frequency = 1.0;
  let maxValue = 0;
  for (let i = 0; i < octaves; i++) {
    value += amplitude * noise3D(x * frequency, y * frequency, z * frequency);
    maxValue += amplitude;
    frequency *= 2.0;
    amplitude *= 0.5;
  }
  return value / maxValue;
}

interface PlanetTextures {
  earthDay: HTMLCanvasElement;
  earthNight: HTMLCanvasElement;
  earthClouds: HTMLCanvasElement;
  earthCloudShadow: HTMLCanvasElement;
  mars: HTMLCanvasElement;
}

let globalTextures: PlanetTextures | null = null;

function generatePlanetTextures(): PlanetTextures {
  const earthDay = document.createElement('canvas');
  earthDay.width = 512; earthDay.height = 256;
  const ectx = earthDay.getContext('2d')!;

  const earthNight = document.createElement('canvas');
  earthNight.width = 512; earthNight.height = 256;
  const enctx = earthNight.getContext('2d')!;

  const earthClouds = document.createElement('canvas');
  earthClouds.width = 512; earthClouds.height = 256;
  const ecctx = earthClouds.getContext('2d')!;

  const earthCloudShadow = document.createElement('canvas');
  earthCloudShadow.width = 512; earthCloudShadow.height = 256;
  const ecsctx = earthCloudShadow.getContext('2d')!;

  const mars = document.createElement('canvas');
  mars.width = 512; mars.height = 256;
  const mctx = mars.getContext('2d')!;

  const eImg = ectx.createImageData(512, 256);
  const nImg = enctx.createImageData(512, 256);
  const cImg = ecctx.createImageData(512, 256);
  const csImg = ecsctx.createImageData(512, 256);
  const mImg = mctx.createImageData(512, 256);

  for (let y = 0; y < 256; y++) {
    const lat = (0.5 - y / 256) * Math.PI;
    const cosLat = Math.cos(lat);
    const sinLat = Math.sin(lat);

    for (let x = 0; x < 512; x++) {
      const lon = (x / 512) * Math.PI * 2;
      const cosLon = Math.cos(lon);
      const sinLon = Math.sin(lon);

      const nx = cosLat * sinLon;
      const ny = sinLat;
      const nz = cosLat * cosLon;

      // Earth height map
      const hEarth = fbm3D(nx * 2.2 + 10, ny * 2.2 + 20, nz * 2.2 + 30, 5);

      let er = 10, eg = 30, eb = 65; // deep ocean
      let nr = 0, ng = 0, nb = 0;

      if (hEarth > 0.46) {
        if (hEarth < 0.49) {
          // Beach
          er = 195; eg = 175; eb = 135;
        } else if (hEarth < 0.63) {
          // Lowland vegetation
          const f = (hEarth - 0.49) / 0.14;
          er = Math.round(25 * (1 - f) + 12 * f);
          eg = Math.round(85 * (1 - f) + 50 * f);
          eb = Math.round(35 * (1 - f) + 20 * f);
        } else if (hEarth < 0.76) {
          // Highlands
          const f = (hEarth - 0.63) / 0.13;
          er = Math.round(80 * (1 - f) + 65 * f);
          eg = Math.round(65 * (1 - f) + 50 * f);
          eb = Math.round(45 * (1 - f) + 35 * f);
        } else {
          // Peaks
          er = 230; eg = 230; eb = 235;
        }

        // City lights
        if (Math.abs(lat) < 1.15) {
          const lNoise = noise3D(nx * 24 + 100, ny * 24 + 200, nz * 24 + 300);
          if (lNoise > 0.63) {
            const intensity = (lNoise - 0.63) / 0.37;
            nr = Math.round(255 * intensity);
            ng = Math.round(210 * intensity);
            nb = Math.round(130 * intensity);
          }
        }
      } else if (hEarth > 0.43) {
        // Coastline
        const f = (hEarth - 0.43) / 0.03;
        er = Math.round(10 * (1 - f) + 20 * f);
        eg = Math.round(30 * (1 - f) + 65 * f);
        eb = Math.round(65 * (1 - f) + 110 * f);
      }

      // Ice caps
      const absLat = Math.abs(lat);
      if (absLat > 1.25) {
        const f = Math.min(1, (absLat - 1.25) / 0.18);
        er = Math.round(er * (1 - f) + 240 * f);
        eg = Math.round(eg * (1 - f) + 240 * f);
        eb = Math.round(eb * (1 - f) + 245 * f);
        nr = Math.round(nr * (1 - f));
        ng = Math.round(ng * (1 - f));
        nb = Math.round(nb * (1 - f));
      }

      // Earth clouds
      const hClouds = fbm3D(nx * 2.8 - 40, ny * 2.8 - 50, nz * 2.8 - 60, 5);
      let cr = 0, cg = 0, cb = 0, ca = 0;
      if (hClouds > 0.48) {
        ca = Math.round(Math.min(255, (hClouds - 0.48) * 2.8 * 255));
        cr = 255; cg = 255; cb = 255;
      }

      // Mars height map
      const hMars = fbm3D(nx * 2.5 + 40, ny * 2.5 + 50, nz * 2.5 + 60, 5);
      let mr = 150, mg = 60, mb = 35;

      if (hMars < 0.44) {
        // Volcanic lowlands
        const f = hMars / 0.44;
        mr = Math.round(75 * (1 - f) + 105 * f);
        mg = Math.round(35 * (1 - f) + 48 * f);
        mb = Math.round(22 * (1 - f) + 30 * f);
      } else {
        // Highlands
        const f = Math.min(1, (hMars - 0.44) / 0.56);
        mr = Math.round(105 * (1 - f) + 195 * f);
        mg = Math.round(48 * (1 - f) + 85 * f);
        mb = Math.round(30 * (1 - f) + 50 * f);
      }

      // Mars Ice Caps
      if (lat > 1.32) {
        const f = Math.min(1, (lat - 1.32) / 0.12);
        mr = Math.round(mr * (1 - f) + 245 * f);
        mg = Math.round(mg * (1 - f) + 245 * f);
        mb = Math.round(mb * (1 - f) + 250 * f);
      } else if (lat < -1.38) {
        const f = Math.min(1, (-lat - 1.38) / 0.1);
        mr = Math.round(mr * (1 - f) + 240 * f);
        mg = Math.round(mg * (1 - f) + 240 * f);
        mb = Math.round(mb * (1 - f) + 245 * f);
      }

      const idx = (y * 512 + x) * 4;

      eImg.data[idx] = er; eImg.data[idx + 1] = eg; eImg.data[idx + 2] = eb; eImg.data[idx + 3] = 255;
      nImg.data[idx] = nr; nImg.data[idx + 1] = ng; nImg.data[idx + 2] = nb; nImg.data[idx + 3] = 255;
      cImg.data[idx] = cr; cImg.data[idx + 1] = cg; cImg.data[idx + 2] = cb; cImg.data[idx + 3] = ca;
      csImg.data[idx] = 0; csImg.data[idx + 1] = 0; csImg.data[idx + 2] = 0; csImg.data[idx + 3] = ca;
      mImg.data[idx] = mr; mImg.data[idx + 1] = mg; mImg.data[idx + 2] = mb; mImg.data[idx + 3] = 255;
    }
  }

  ectx.putImageData(eImg, 0, 0);
  enctx.putImageData(nImg, 0, 0);
  ecctx.putImageData(cImg, 0, 0);
  ecsctx.putImageData(csImg, 0, 0);
  mctx.putImageData(mImg, 0, 0);

  return { earthDay, earthNight, earthClouds, earthCloudShadow, mars };
}

function getPlanetTextures(): PlanetTextures {
  if (typeof window === "undefined") {
    return {} as PlanetTextures;
  }
  if (!globalTextures) {
    globalTextures = generatePlanetTextures();
  }
  return globalTextures;
}

interface LightVector {
  x: number;
  y: number;
  z: number;
}

function drawPlanet(
  ctx: CanvasRenderingContext2D,
  type: "earth" | "mars",
  cx: number,
  cy: number,
  R: number,
  rotation: number,
  opacity: number,
  lightVector: LightVector,
  textures: PlanetTextures
) {
  if (opacity <= 0 || !textures.earthDay) return;

  ctx.save();
  ctx.globalAlpha = opacity;

  const lx = lightVector.x;
  const ly = lightVector.y;

  // 1. Draw outer atmosphere glow (back layer)
  if (type === "earth") {
    const atmoGlow = ctx.createRadialGradient(
      cx + lx * R * 0.15, cy - ly * R * 0.15, R * 0.85,
      cx + lx * R * 0.3, cy - ly * R * 0.3, R * 1.4
    );
    atmoGlow.addColorStop(0, "rgba(0,120,255,0.35)");
    atmoGlow.addColorStop(0.2, "rgba(0,80,220,0.2)");
    atmoGlow.addColorStop(0.6, "rgba(0,40,150,0.05)");
    atmoGlow.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = atmoGlow;
    ctx.beginPath();
    ctx.arc(cx, cy, R * 1.4, 0, Math.PI * 2);
    ctx.fill();
  } else {
    const atmoGlow = ctx.createRadialGradient(
      cx + lx * R * 0.15, cy - ly * R * 0.15, R * 0.85,
      cx + lx * R * 0.3, cy - ly * R * 0.3, R * 1.3
    );
    atmoGlow.addColorStop(0, "rgba(220,100,50,0.25)");
    atmoGlow.addColorStop(0.3, "rgba(180,60,30,0.12)");
    atmoGlow.addColorStop(0.7, "rgba(100,30,10,0.03)");
    atmoGlow.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = atmoGlow;
    ctx.beginPath();
    ctx.arc(cx, cy, R * 1.3, 0, Math.PI * 2);
    ctx.fill();
  }

  // 2. Setup sphere clipping path
  ctx.beginPath();
  ctx.arc(cx, cy, R, 0, Math.PI * 2);
  ctx.clip();

  // 3. Draw base dark sphere
  ctx.fillStyle = type === "earth" ? "#020614" : "#1f0d07";
  ctx.beginPath();
  ctx.arc(cx, cy, R, 0, Math.PI * 2);
  ctx.fill();

  // 4. Draw slices
  const W_map = 512;
  const H_map = 256;
  const N = 16; // Number of horizontal segments

  const dayCanvas = type === "earth" ? textures.earthDay : textures.mars;
  const nightCanvas = type === "earth" ? textures.earthNight : null;
  const cloudCanvas = type === "earth" ? textures.earthClouds : null;
  const cloudShadowCanvas = type === "earth" ? textures.earthCloudShadow : null;

  const step = 2;
  for (let y = -R; y < R; y += step) {
    const w = Math.sqrt(R * R - y * y);
    if (w <= 0) continue;

    const lat = Math.asin(y / R);
    const cosLat = Math.cos(lat);
    const sy = Math.round((0.5 - lat / Math.PI) * H_map);

    for (let i = 0; i < N; i++) {
      const u1 = -1 + (2 * i) / N;
      const u2 = -1 + (2 * (i + 1)) / N;

      const phi1 = Math.asin(u1);
      const phi2 = Math.asin(u2);

      const dx1 = cx + w * u1;
      const dx2 = cx + w * u2;
      const dw = dx2 - dx1;
      if (dw <= 0) continue;

      const phi = (phi1 + phi2) / 2;
      const nx = cosLat * Math.sin(phi);
      const ny = Math.sin(lat);
      const nz = cosLat * Math.cos(phi);

      const intensity = nx * lx + ny * ly + nz * lightVector.z;

      const lonOffset1 = phi1;
      const lonOffset2 = phi2;

      let sx1 = ((rotation + lonOffset1) / (2 * Math.PI)) * W_map;
      let sx2 = ((rotation + lonOffset2) / (2 * Math.PI)) * W_map;

      sx1 = (sx1 % W_map + W_map) % W_map;
      sx2 = (sx2 % W_map + W_map) % W_map;

      ctx.save();
      if (sx2 > sx1) {
        ctx.drawImage(
          dayCanvas,
          sx1, sy, sx2 - sx1, step,
          dx1, cy + y, dw + 0.5, step + 0.5
        );
      } else {
        const w1 = W_map - sx1;
        const dw1 = dw * (w1 / (w1 + sx2));
        ctx.drawImage(
          dayCanvas,
          sx1, sy, w1, step,
          dx1, cy + y, dw1 + 0.5, step + 0.5
        );
        ctx.drawImage(
          dayCanvas,
          0, sy, sx2, step,
          dx1 + dw1, cy + y, dw - dw1 + 0.5, step + 0.5
        );
      }

      // Shading overlay
      const shadowAlpha = Math.max(0, Math.min(1, 1 - (intensity + 0.15) * 1.2));
      ctx.fillStyle = `rgba(0, 0, 0, ${shadowAlpha})`;
      ctx.fillRect(dx1, cy + y, dw + 0.5, step + 0.5);
      ctx.restore();

      // Night lights
      if (type === "earth" && nightCanvas) {
        const nightAlpha = Math.max(0, Math.min(1, -intensity * 1.8));
        if (nightAlpha > 0.02) {
          ctx.save();
          ctx.globalAlpha = opacity * nightAlpha;
          ctx.globalCompositeOperation = "screen";
          if (sx2 > sx1) {
            ctx.drawImage(
              nightCanvas,
              sx1, sy, sx2 - sx1, step,
              dx1, cy + y, dw + 0.5, step + 0.5
            );
          } else {
            const w1 = W_map - sx1;
            const dw1 = dw * (w1 / (w1 + sx2));
            ctx.drawImage(
              nightCanvas,
              sx1, sy, w1, step,
              dx1, cy + y, dw1 + 0.5, step + 0.5
            );
            ctx.drawImage(
              nightCanvas,
              0, sy, sx2, step,
              dx1 + dw1, cy + y, dw - dw1 + 0.5, step + 0.5
            );
          }
          ctx.restore();
        }
      }

      // Clouds
      if (type === "earth" && cloudCanvas && cloudShadowCanvas) {
        const cloudRotation = rotation * 1.15 + 1.2;

        let csx1 = ((cloudRotation + lonOffset1) / (2 * Math.PI)) * W_map;
        let csx2 = ((cloudRotation + lonOffset2) / (2 * Math.PI)) * W_map;
        csx1 = (csx1 % W_map + W_map) % W_map;
        csx2 = (csx2 % W_map + W_map) % W_map;

        // Cloud Shadow
        const csdx = -lx * R * 0.03;
        const csdy = ly * R * 0.03;
        const cloudShadowAlpha = Math.max(0, Math.min(0.4, (intensity + 0.2) * 0.5));

        if (cloudShadowAlpha > 0.02) {
          ctx.save();
          ctx.globalAlpha = opacity * cloudShadowAlpha;
          ctx.globalCompositeOperation = "multiply";
          if (csx2 > csx1) {
            ctx.drawImage(
              cloudShadowCanvas,
              csx1, sy, csx2 - csx1, step,
              dx1 + csdx, cy + y + csdy, dw + 0.5, step + 0.5
            );
          } else {
            const w1 = W_map - csx1;
            const dw1 = dw * (w1 / (w1 + csx2));
            ctx.drawImage(
              cloudShadowCanvas,
              csx1, sy, w1, step,
              dx1 + csdx, cy + y + csdy, dw1 + 0.5, step + 0.5
            );
            ctx.drawImage(
              cloudShadowCanvas,
              0, sy, csx2, step,
              dx1 + dw1 + csdx, cy + y + csdy, dw - dw1 + 0.5, step + 0.5
            );
          }
          ctx.restore();
        }

        // Cloud Body
        const cloudIntensity = Math.max(0.05, Math.min(1.0, (intensity + 0.1) * 1.1));
        ctx.save();
        ctx.globalAlpha = opacity;
        if (csx2 > csx1) {
          ctx.drawImage(
            cloudCanvas,
            csx1, sy, csx2 - csx1, step,
            dx1, cy + y, dw + 0.5, step + 0.5
          );
        } else {
          const w1 = W_map - csx1;
          const dw1 = dw * (w1 / (w1 + csx2));
          ctx.drawImage(
            cloudCanvas,
            csx1, sy, w1, step,
            dx1, cy + y, dw1 + 0.5, step + 0.5
          );
          ctx.drawImage(
            cloudCanvas,
            0, sy, csx2, step,
            dx1 + dw1, cy + y, dw - dw1 + 0.5, step + 0.5
          );
        }
        ctx.fillStyle = `rgba(0, 0, 0, ${1 - cloudIntensity})`;
        ctx.fillRect(dx1, cy + y, dw + 0.5, step + 0.5);
        ctx.restore();
      }
    }
  }

  // 5. Specular atmosphere ring glow (front)
  if (type === "earth") {
    const limb = ctx.createRadialGradient(
      cx + lx * R * 0.1, cy - ly * R * 0.1, R * 0.95,
      cx + lx * R * 0.1, cy - ly * R * 0.1, R * 1.05
    );
    limb.addColorStop(0, "rgba(100,200,255,0.0)");
    limb.addColorStop(0.5, "rgba(100,200,255,0.45)");
    limb.addColorStop(0.8, "rgba(150,220,255,0.7)");
    limb.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = limb;
    ctx.beginPath();
    ctx.arc(cx, cy, R * 1.05, 0, Math.PI * 2);
    ctx.fill();
  } else {
    const limb = ctx.createRadialGradient(
      cx + lx * R * 0.1, cy - ly * R * 0.1, R * 0.95,
      cx + lx * R * 0.1, cy - ly * R * 0.1, R * 1.04
    );
    limb.addColorStop(0, "rgba(255,150,100,0.0)");
    limb.addColorStop(0.5, "rgba(255,130,80,0.3)");
    limb.addColorStop(0.8, "rgba(255,100,50,0.45)");
    limb.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = limb;
    ctx.beginPath();
    ctx.arc(cx, cy, R * 1.04, 0, Math.PI * 2);
    ctx.fill();
  }

  // 6. Specular reflection
  if (type === "earth") {
    const spec = ctx.createRadialGradient(
      cx + lx * R * 0.4, cy - ly * R * 0.4, 0,
      cx + lx * R * 0.4, cy - ly * R * 0.4, R * 0.6
    );
    spec.addColorStop(0, "rgba(255,255,255,0.25)");
    spec.addColorStop(0.4, "rgba(255,255,255,0.05)");
    spec.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = spec;
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

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

    const textures = getPlanetTextures();

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

      // Draw hyper-realistic Earth
      drawPlanet(
        ctx,
        "earth",
        earthX,
        earthY,
        earthR,
        t * 0.0008,
        1.0,
        { x: -0.5, y: 0.3, z: 0.8 },
        textures
      );

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

    const stars = Array.from({ length: 200 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.2 + 0.2,
      alpha: Math.random() * 0.8 + 0.2,
    }));

    let t = 0;
    const textures = getPlanetTextures();

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
        drawPlanet(
          ctx,
          "earth",
          ex,
          ey,
          er,
          t * 0.0008,
          earthAlpha,
          { x: -0.5, y: 0.3, z: 0.8 },
          textures
        );
      }

      // Mars (appearing right)
      const marsAlpha = Math.min(1, t / 300);
      const mx = W * 0.82, my = H * 0.5, mr = Math.min(W, H) * 0.15;
      drawPlanet(
        ctx,
        "mars",
        mx,
        my,
        mr,
        t * 0.0005,
        marsAlpha,
        { x: -0.5, y: 0.3, z: 0.8 },
        textures
      );

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

    const onResize = () => {
      W = canvas.offsetWidth; H = canvas.offsetHeight;
      canvas.width = W; canvas.height = H;
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}

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

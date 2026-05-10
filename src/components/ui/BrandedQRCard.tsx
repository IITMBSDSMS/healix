"use client";

import React, { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";

interface BrandedQRCardProps {
  deviceId: string;
  vehicleReg: string;
  driverName: string;
  rideUrl: string;
  downloadable?: boolean;
}

export default function BrandedQRCard({
  deviceId,
  vehicleReg,
  driverName,
  rideUrl,
  downloadable = true,
}: BrandedQRCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [rendering, setRendering] = useState(true);

  useEffect(() => {
    const draw = async () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      // ── Canvas Dimensions (print-safe @ 2x density) ──────────────
      const SCALE = 2;
      const W = 440 * SCALE;
      const H = 660 * SCALE;
      canvas.width = W;
      canvas.height = H;
      canvas.style.width = "440px";
      canvas.style.height = "660px";

      const ctx = canvas.getContext("2d")!;
      ctx.scale(SCALE, SCALE);
      const w = 440;
      const h = 660;

      // ── 1. Background ─────────────────────────────────────────────
      const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
      bgGrad.addColorStop(0, "#0C1020");
      bgGrad.addColorStop(0.5, "#080B14");
      bgGrad.addColorStop(1, "#060810");
      ctx.fillStyle = bgGrad;
      ctx.beginPath();
      rRect(ctx, 0, 0, w, h, 20);
      ctx.fill();

      // ── 2. Subtle hexagon grid background ─────────────────────────
      drawHexGrid(ctx, w, h);

      // ── 3. Orange left accent stripe ──────────────────────────────
      const stripe = ctx.createLinearGradient(0, 0, 0, h);
      stripe.addColorStop(0, "#F97316");
      stripe.addColorStop(0.5, "#EA580C");
      stripe.addColorStop(1, "#F97316");
      ctx.fillStyle = stripe;
      ctx.beginPath();
      rRect(ctx, 0, 0, 5, h, 20);
      ctx.fill();

      // ── 4. Top gradient bar (orange → blue) ──────────────────────
      const topBar = ctx.createLinearGradient(0, 0, w, 0);
      topBar.addColorStop(0, "#F97316");
      topBar.addColorStop(0.5, "#7C3AED");
      topBar.addColorStop(1, "#3B82F6");
      ctx.fillStyle = topBar;
      ctx.fillRect(0, 0, w, 4);

      // ── 5. Header section ─────────────────────────────────────────
      // HEALIX wordmark
      ctx.fillStyle = "rgba(255,255,255,0.35)";
      ctx.font = `600 ${11}px 'Arial', sans-serif`;
      ctx.textAlign = "left";
      ctx.letterSpacing = "4px";
      ctx.fillText("H E A L I X", 28, 42);

      // "Project Suraksha" title
      ctx.fillStyle = "#FFFFFF";
      ctx.font = `bold ${32}px 'Arial', sans-serif`;
      ctx.letterSpacing = "0px";
      ctx.fillText("Project Suraksha", 28, 82);

      // Shield icon (top-right)
      drawShieldIcon(ctx, 380, 52, 34);

      // ── 6. Thin divider ───────────────────────────────────────────
      const divGrad = ctx.createLinearGradient(28, 0, w - 28, 0);
      divGrad.addColorStop(0, "rgba(59,130,246,0.8)");
      divGrad.addColorStop(1, "rgba(59,130,246,0.1)");
      ctx.strokeStyle = divGrad;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(28, 102);
      ctx.lineTo(w - 28, 102);
      ctx.stroke();

      // Device ID chip
      ctx.fillStyle = "rgba(59,130,246,0.12)";
      ctx.strokeStyle = "rgba(59,130,246,0.35)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      rRect(ctx, 28, 114, 160, 26, 6);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#60A5FA";
      ctx.font = `600 ${10}px 'Courier New', monospace`;
      ctx.letterSpacing = "1.5px";
      ctx.textAlign = "left";
      ctx.fillText(deviceId, 38, 131);

      // ── 7. QR Code with shield logo overlay ──────────────────────
      const qrSize = 260;
      const qrX = (w - qrSize) / 2;
      const qrY = 158;

      // QR container card with glow
      ctx.save();
      ctx.shadowColor = "rgba(59,130,246,0.5)";
      ctx.shadowBlur = 28;
      ctx.fillStyle = "#111827";
      ctx.beginPath();
      rRect(ctx, qrX - 14, qrY - 14, qrSize + 28, qrSize + 28, 16);
      ctx.fill();
      ctx.restore();

      // Outer glowing border
      ctx.strokeStyle = "rgba(59,130,246,0.6)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      rRect(ctx, qrX - 14, qrY - 14, qrSize + 28, qrSize + 28, 16);
      ctx.stroke();

      // Generate actual QR
      const qrCanvas = document.createElement("canvas");
      await QRCode.toCanvas(qrCanvas, rideUrl, {
        errorCorrectionLevel: "H", // High — allows 30% damage for logo overlay
        width: qrSize,
        margin: 0,
        color: { dark: "#FFFFFF", light: "#111827" },
      });
      ctx.drawImage(qrCanvas, qrX, qrY, qrSize, qrSize);

      // Shield logo overlaid in QR center (safe with H error correction)
      const logoSize = 44;
      const lx = qrX + qrSize / 2;
      const ly = qrY + qrSize / 2;

      // White circle background for logo
      ctx.fillStyle = "#111827";
      ctx.beginPath();
      ctx.arc(lx, ly, logoSize / 2 + 4, 0, Math.PI * 2);
      ctx.fill();

      drawShieldIcon(ctx, lx, ly, logoSize / 2 - 2);

      // ── 8. "SCAN TO VERIFY VEHICLE" instruction ───────────────────
      ctx.fillStyle = "rgba(255,255,255,0.4)";
      ctx.font = `500 ${10}px 'Arial', sans-serif`;
      ctx.letterSpacing = "3px";
      ctx.textAlign = "center";
      ctx.fillText("SCAN TO VERIFY YOUR VEHICLE", w / 2, qrY + qrSize + 34);

      // ── 9. Divider before info block ──────────────────────────────
      const infoY = qrY + qrSize + 52;
      ctx.strokeStyle = "rgba(255,255,255,0.07)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(28, infoY - 12);
      ctx.lineTo(w - 28, infoY - 12);
      ctx.stroke();

      // ── 10. Two-column info block ─────────────────────────────────
      const col1X = 28 + (w / 2 - 28) / 2;
      const col2X = w / 2 + (w / 2 - 28) / 2;

      // Vertical divider between columns
      ctx.strokeStyle = "rgba(255,255,255,0.12)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(w / 2, infoY - 4);
      ctx.lineTo(w / 2, infoY + 52);
      ctx.stroke();

      // Column labels
      ctx.fillStyle = "rgba(255,255,255,0.35)";
      ctx.font = `600 ${9}px 'Arial', sans-serif`;
      ctx.letterSpacing = "2px";
      ctx.textAlign = "center";
      ctx.fillText("VEHICLE", col1X, infoY + 8);
      ctx.fillText("DRIVER", col2X, infoY + 8);

      // Column values
      ctx.fillStyle = "#FFFFFF";
      ctx.font = `bold ${14}px 'Courier New', monospace`;
      ctx.letterSpacing = "0.5px";
      ctx.textAlign = "center";
      // Truncate if too long
      const truncReg = vehicleReg.length > 12 ? vehicleReg.substring(0, 12) + "…" : vehicleReg;
      const truncDriver = driverName.split(" ")[0]; // first name only for space
      ctx.fillText(truncReg, col1X, infoY + 30);
      ctx.fillStyle = "#E2E8F0";
      ctx.fillText(truncDriver, col2X, infoY + 30);

      // Full driver name below (smaller)
      if (driverName.split(" ").length > 1) {
        ctx.fillStyle = "rgba(255,255,255,0.45)";
        ctx.font = `400 ${10}px 'Courier New', monospace`;
        ctx.letterSpacing = "0px";
        ctx.fillText(driverName.split(" ").slice(1).join(" "), col2X, infoY + 46);
      }

      // ── 11. Bottom footer ─────────────────────────────────────────
      const footerY = h - 26;

      // Footer divider
      ctx.strokeStyle = "rgba(255,255,255,0.06)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(28, footerY - 16);
      ctx.lineTo(w - 28, footerY - 16);
      ctx.stroke();

      // Shield tiny icon + text
      ctx.fillStyle = "rgba(255,255,255,0.22)";
      ctx.font = `400 ${9}px 'Arial', sans-serif`;
      ctx.letterSpacing = "0.5px";
      ctx.textAlign = "center";
      ctx.fillText("🛡  Protected by Healix Technologies", w / 2, footerY);

      // ── 12. Corner accent dots ────────────────────────────────────
      [[w - 28, 18], [w - 28, h - 18]].forEach(([x, y]) => {
        ctx.fillStyle = "rgba(249,115,22,0.5)";
        ctx.beginPath();
        ctx.arc(x, y, 2.5, 0, Math.PI * 2);
        ctx.fill();
      });
      [[28, h - 18]].forEach(([x, y]) => {
        ctx.fillStyle = "rgba(59,130,246,0.5)";
        ctx.beginPath();
        ctx.arc(x, y, 2.5, 0, Math.PI * 2);
        ctx.fill();
      });

      setDataUrl(canvas.toDataURL("image/png", 1.0));
      setRendering(false);
    };

    draw();
  }, [deviceId, vehicleReg, driverName, rideUrl]);

  const handleDownload = () => {
    if (!dataUrl) return;
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `suraksha-qr-${deviceId}.png`;
    a.click();
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        {rendering && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-2xl z-10">
            <div className="flex flex-col items-center gap-2">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs text-gray-400 font-mono">Rendering card...</span>
            </div>
          </div>
        )}
        <canvas
          ref={canvasRef}
          className="rounded-2xl shadow-[0_0_50px_rgba(59,130,246,0.2),0_0_0_1px_rgba(255,255,255,0.05)]"
          style={{ maxWidth: "100%", height: "auto", display: "block" }}
        />
      </div>

      {downloadable && !rendering && (
        <div className="flex gap-3">
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)]"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download PNG
          </button>
          <button
            onClick={() => window.open(`/ride/${deviceId}`, "_blank")}
            className="flex items-center gap-2 px-4 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 text-sm font-medium rounded-xl transition-all"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Test Scan
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function rRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawShieldIcon(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
  ctx.save();
  ctx.shadowColor = "#3B82F6";
  ctx.shadowBlur = 14;

  const s = r;
  ctx.beginPath();
  ctx.moveTo(cx, cy - s);
  ctx.bezierCurveTo(cx + s * 0.8, cy - s * 0.75, cx + s * 0.85, cy - s * 0.25, cx + s * 0.85, cy + s * 0.1);
  ctx.bezierCurveTo(cx + s * 0.85, cy + s * 0.65, cx + s * 0.4, cy + s, cx, cy + s * 1.1);
  ctx.bezierCurveTo(cx - s * 0.4, cy + s, cx - s * 0.85, cy + s * 0.65, cx - s * 0.85, cy + s * 0.1);
  ctx.bezierCurveTo(cx - s * 0.85, cy - s * 0.25, cx - s * 0.8, cy - s * 0.75, cx, cy - s);

  const g = ctx.createLinearGradient(cx - s, cy - s, cx + s, cy + s * 1.1);
  g.addColorStop(0, "#93C5FD");
  g.addColorStop(0.5, "#3B82F6");
  g.addColorStop(1, "#1D4ED8");
  ctx.fillStyle = g;
  ctx.fill();

  // Checkmark
  ctx.shadowBlur = 0;
  ctx.strokeStyle = "rgba(255,255,255,0.95)";
  ctx.lineWidth = s * 0.14;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(cx - s * 0.28, cy + s * 0.05);
  ctx.lineTo(cx - s * 0.05, cy + s * 0.35);
  ctx.lineTo(cx + s * 0.38, cy - s * 0.18);
  ctx.stroke();

  ctx.restore();
}

function drawHexGrid(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const hexR = 22;
  const hexH = hexR * Math.sqrt(3);
  ctx.strokeStyle = "rgba(59,130,246,0.05)";
  ctx.lineWidth = 0.8;

  for (let row = -1; row < h / hexH + 2; row++) {
    for (let col = -1; col < w / (hexR * 1.5) + 2; col++) {
      const x = col * hexR * 3 + (row % 2 === 0 ? 0 : hexR * 1.5);
      const y = row * hexH;
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 180) * (60 * i - 30);
        const px = x + hexR * Math.cos(angle);
        const py = y + hexR * Math.sin(angle);
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.stroke();
    }
  }
}

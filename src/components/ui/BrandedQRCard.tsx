"use client";

import React, { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";

interface BrandedQRCardProps {
  deviceId: string;
  vehicleReg: string;
  driverName: string;
  rideUrl: string;
  /** If true, shows a download button */
  downloadable?: boolean;
}

/**
 * BrandedQRCard
 * Renders a full, printable Healix / Project Suraksha branded QR card.
 * The card is drawn on an HTML <canvas> so it can be downloaded as PNG.
 */
export default function BrandedQRCard({
  deviceId,
  vehicleReg,
  driverName,
  rideUrl,
  downloadable = true,
}: BrandedQRCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    const draw = async () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      // ── Dimensions ────────────────────────────────────────────────
      const W = 420;
      const H = 640;
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext("2d")!;

      // ── Background ────────────────────────────────────────────────
      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, "#0a0a12");
      bg.addColorStop(1, "#050508");
      ctx.fillStyle = bg;
      roundRect(ctx, 0, 0, W, H, 24);
      ctx.fill();

      // ── Glowing border ────────────────────────────────────────────
      ctx.save();
      ctx.shadowColor = "#3b82f6";
      ctx.shadowBlur = 24;
      ctx.strokeStyle = "rgba(59,130,246,0.6)";
      ctx.lineWidth = 1.5;
      roundRect(ctx, 2, 2, W - 4, H - 4, 22);
      ctx.stroke();
      ctx.restore();

      // ── Inner subtle glow band at top ────────────────────────────
      const topGlow = ctx.createRadialGradient(W / 2, 0, 0, W / 2, 0, W * 0.8);
      topGlow.addColorStop(0, "rgba(59,130,246,0.12)");
      topGlow.addColorStop(1, "transparent");
      ctx.fillStyle = topGlow;
      roundRect(ctx, 0, 0, W, H / 2, 24);
      ctx.fill();

      // ── HEALIX wordmark ───────────────────────────────────────────
      ctx.fillStyle = "rgba(255,255,255,0.35)";
      ctx.font = "600 11px 'Arial', sans-serif";
      ctx.letterSpacing = "4px";
      ctx.textAlign = "center";
      ctx.fillText("HEALIX TECHNOLOGIES", W / 2, 38);

      // ── Shield icon (drawn in canvas) ─────────────────────────────
      const shieldX = W / 2;
      const shieldY = 80;
      drawShield(ctx, shieldX, shieldY, 28);

      // ── Title ─────────────────────────────────────────────────────
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 30px 'Arial', sans-serif";
      ctx.letterSpacing = "0px";
      ctx.textAlign = "center";
      ctx.fillText("Project Suraksha", W / 2, 148);

      // ── Divider line ──────────────────────────────────────────────
      const grad = ctx.createLinearGradient(60, 0, W - 60, 0);
      grad.addColorStop(0, "transparent");
      grad.addColorStop(0.3, "rgba(59,130,246,0.5)");
      grad.addColorStop(0.7, "rgba(59,130,246,0.5)");
      grad.addColorStop(1, "transparent");
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(60, 164);
      ctx.lineTo(W - 60, 164);
      ctx.stroke();

      // ── Generate actual scannable QR code ─────────────────────────
      const qrCanvas = document.createElement("canvas");
      await QRCode.toCanvas(qrCanvas, rideUrl, {
        errorCorrectionLevel: "H",
        width: 240,
        margin: 1,
        color: { dark: "#FFFFFF", light: "#0d0d1a" },
      });

      // QR container card
      const qrX = (W - 256) / 2;
      const qrY = 185;
      ctx.save();
      ctx.shadowColor = "rgba(59,130,246,0.3)";
      ctx.shadowBlur = 20;
      ctx.fillStyle = "#0d0d1a";
      roundRect(ctx, qrX - 8, qrY - 8, 256 + 16, 256 + 16, 16);
      ctx.fill();
      ctx.restore();

      // border around QR
      ctx.strokeStyle = "rgba(59,130,246,0.3)";
      ctx.lineWidth = 1;
      roundRect(ctx, qrX - 8, qrY - 8, 256 + 16, 256 + 16, 16);
      ctx.stroke();

      // Draw QR onto main canvas
      ctx.drawImage(qrCanvas, qrX, qrY, 240, 240);

      // ── Device info block ─────────────────────────────────────────
      const infoY = qrY + 240 + 28;

      // Vehicle badge
      ctx.fillStyle = "rgba(59,130,246,0.12)";
      roundRect(ctx, W / 2 - 110, infoY - 14, 220, 28, 8);
      ctx.fill();
      ctx.strokeStyle = "rgba(59,130,246,0.3)";
      ctx.lineWidth = 1;
      roundRect(ctx, W / 2 - 110, infoY - 14, 220, 28, 8);
      ctx.stroke();

      ctx.fillStyle = "#60a5fa";
      ctx.font = "600 11px 'Arial', sans-serif";
      ctx.letterSpacing = "2px";
      ctx.textAlign = "center";
      ctx.fillText(deviceId, W / 2, infoY + 5);

      ctx.fillStyle = "rgba(255,255,255,0.6)";
      ctx.font = "500 13px 'Arial', sans-serif";
      ctx.letterSpacing = "0px";
      ctx.fillText(`${vehicleReg}  ·  ${driverName}`, W / 2, infoY + 32);

      // ── Bottom instruction ────────────────────────────────────────
      ctx.fillStyle = "rgba(255,255,255,0.85)";
      ctx.font = "bold 15px 'Arial', sans-serif";
      ctx.fillText("Scan to verify your vehicle", W / 2, H - 72);

      ctx.fillStyle = "rgba(96,165,250,0.7)";
      ctx.font = "500 11px 'Arial', sans-serif";
      ctx.letterSpacing = "0.5px";
      ctx.fillText("Protected by Healix Technologies", W / 2, H - 52);

      // ── Circuit board decoration at bottom ────────────────────────
      drawCircuit(ctx, W, H);

      setDataUrl(canvas.toDataURL("image/png"));
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
      <canvas ref={canvasRef} className="rounded-2xl shadow-[0_0_40px_rgba(59,130,246,0.25)]" style={{ maxWidth: "100%", height: "auto" }} />
      {downloadable && (
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-all shadow-[0_0_15px_rgba(37,99,235,0.35)]"
        >
          ⬇ Download QR Card
        </button>
      )}
    </div>
  );
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
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

function drawShield(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number) {
  ctx.save();
  ctx.shadowColor = "#3b82f6";
  ctx.shadowBlur = 20;

  // Shield glow
  const glowGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, size * 1.5);
  glowGrad.addColorStop(0, "rgba(59,130,246,0.25)");
  glowGrad.addColorStop(1, "transparent");
  ctx.fillStyle = glowGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, size * 1.5, 0, Math.PI * 2);
  ctx.fill();

  // Shield path
  const s = size;
  ctx.beginPath();
  ctx.moveTo(cx, cy - s);
  ctx.bezierCurveTo(cx + s * 0.8, cy - s * 0.8, cx + s * 0.9, cy - s * 0.3, cx + s * 0.9, cy + s * 0.1);
  ctx.bezierCurveTo(cx + s * 0.9, cy + s * 0.7, cx + s * 0.4, cy + s * 1.1, cx, cy + s * 1.2);
  ctx.bezierCurveTo(cx - s * 0.4, cy + s * 1.1, cx - s * 0.9, cy + s * 0.7, cx - s * 0.9, cy + s * 0.1);
  ctx.bezierCurveTo(cx - s * 0.9, cy - s * 0.3, cx - s * 0.8, cy - s * 0.8, cx, cy - s);

  const shieldGrad = ctx.createLinearGradient(cx - s, cy - s, cx + s, cy + s);
  shieldGrad.addColorStop(0, "#60a5fa");
  shieldGrad.addColorStop(1, "#1d4ed8");
  ctx.fillStyle = shieldGrad;
  ctx.fill();

  // Checkmark inside shield
  ctx.strokeStyle = "rgba(255,255,255,0.9)";
  ctx.lineWidth = size * 0.12;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(cx - s * 0.3, cy + s * 0.1);
  ctx.lineTo(cx - s * 0.05, cy + s * 0.4);
  ctx.lineTo(cx + s * 0.4, cy - s * 0.2);
  ctx.stroke();

  ctx.restore();
}

function drawCircuit(ctx: CanvasRenderingContext2D, W: number, H: number) {
  ctx.save();
  ctx.strokeStyle = "rgba(59,130,246,0.12)";
  ctx.lineWidth = 1;

  const lines = [
    { x1: 20, y1: H - 30, x2: 80, y2: H - 30 },
    { x1: 80, y1: H - 30, x2: 80, y2: H - 55 },
    { x1: 80, y1: H - 55, x2: 130, y2: H - 55 },
    { x1: 130, y1: H - 55, x2: 130, y2: H - 40 },
    { x1: 130, y1: H - 40, x2: 175, y2: H - 40 },
    { x1: W - 20, y1: H - 30, x2: W - 80, y2: H - 30 },
    { x1: W - 80, y1: H - 30, x2: W - 80, y2: H - 55 },
    { x1: W - 80, y1: H - 55, x2: W - 130, y2: H - 55 },
    { x1: W - 130, y1: H - 55, x2: W - 130, y2: H - 40 },
    { x1: W - 130, y1: H - 40, x2: W - 175, y2: H - 40 },
  ];

  lines.forEach(({ x1, y1, x2, y2 }) => {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    // node dot
    ctx.fillStyle = "rgba(59,130,246,0.3)";
    ctx.beginPath();
    ctx.arc(x2, y2, 2, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.restore();
}

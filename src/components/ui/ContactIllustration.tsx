import React from "react";
import { motion } from "framer-motion";

export function ContactIllustration({ className }: { className?: string }) {
  return (
    <div className={className}>
      <svg
        viewBox="0 0 500 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto drop-shadow-lg"
      >
        {/* Background Grid Lines (matches the engineering/biomedical aesthetic exactly) */}
        <g stroke="#e4e4e7" strokeWidth="0.75">
          <line x1="0" y1="50" x2="500" y2="50" />
          <line x1="0" y1="110" x2="500" y2="110" />
          <line x1="0" y1="170" x2="500" y2="170" />
          <line x1="0" y1="230" x2="500" y2="230" />
          <line x1="0" y1="290" x2="500" y2="290" />
          <line x1="0" y1="350" x2="500" y2="350" />
          <line x1="0" y1="410" x2="500" y2="410" />
          <line x1="0" y1="470" x2="500" y2="470" />
          
          <line x1="50" y1="0" x2="50" y2="500" />
          <line x1="110" y1="0" x2="110" y2="500" />
          <line x1="170" y1="0" x2="170" y2="500" />
          <line x1="230" y1="0" x2="230" y2="500" />
          <line x1="290" y1="0" x2="290" y2="500" />
          <line x1="350" y1="0" x2="350" y2="500" />
          <line x1="410" y1="0" x2="410" y2="500" />
          <line x1="470" y1="0" x2="470" y2="500" />
        </g>

        {/* ── TOP LEFT: SEARCH BADGE ── */}
        <g stroke="#d4d4d8" strokeWidth="2.5" fill="none">
          <circle cx="65" cy="40" r="9" />
          <line x1="71.5" y1="46.5" x2="77" y2="52" strokeLinecap="round" />
        </g>

        {/* ── TOP LEFT: SPEECH BUBBLES ── */}
        {/* Gray Background Speech Bubble */}
        <path
          d="M 135 150 C 135 175, 105 190, 85 190 C 105 180, 110 170, 110 160 C 80 160, 65 135, 65 115 C 65 85, 95 70, 125 70 C 140 85, 135 125, 135 150 Z"
          stroke="#d4d4d8"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Main Front Speech Bubble */}
        <motion.path
          d="M 200 105 C 200 145, 185 170, 125 170 C 135 155, 140 145, 140 135 C 100 135, 90 100, 90 80 C 90 40, 140 20, 185 30 C 200 45, 200 85, 200 105 Z"
          stroke="#18181b"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="white"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
        />
        {/* Three orange chat dots */}
        <circle cx="120" cy="80" r="6" fill="#ea580c" />
        <circle cx="140" cy="80" r="6" fill="#ea580c" />
        <circle cx="160" cy="80" r="6" fill="#ea580c" />

        {/* Small crosshair/plus detail under chat bubble */}
        <g stroke="#18181b" strokeWidth="3" strokeLinecap="round">
          <line x1="55" y1="210" x2="55" y2="230" />
          <line x1="45" y1="220" x2="65" y2="220" />
        </g>

        {/* ── TOP RIGHT: AVATARS ── */}
        {/* Avatar 1: Long hair girl (Gray stroke background) */}
        <g stroke="#a1a1aa" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
          {/* Hair back */}
          <path d="M 235 160 C 235 110, 315 110, 315 160" />
          {/* Hair shoulders */}
          <path d="M 235 160 L 230 200 M 315 160 L 320 200" />
          {/* Face */}
          <path d="M 245 170 C 245 200, 305 200, 305 170 Z" fill="white" stroke="#18181b" strokeWidth="4" />
          {/* Eyes & Smile */}
          <circle cx="265" cy="170" r="2.5" fill="#18181b" stroke="none" />
          <circle cx="285" cy="170" r="2.5" fill="#18181b" stroke="none" />
          <path d="M 267 185 C 267 189, 283 189, 283 185" stroke="#18181b" strokeWidth="3" />
          {/* Shoulder/Collar */}
          <path d="M 220 240 C 230 205, 320 205, 330 240" />
          <path d="M 260 225 C 270 232, 280 232, 290 225" />
        </g>

        {/* Avatar 2: Boy with orange collar (Front-Right) */}
        <g stroke="#18181b" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none">
          {/* Hair */}
          <path d="M 340 145 C 340 125, 370 110, 400 115 C 410 125, 420 140, 410 155 Z" fill="#18181b" />
          {/* Face */}
          <path d="M 350 150 C 350 185, 400 185, 400 150 Z" fill="white" />
          {/* Eyes & Smile */}
          <circle cx="365" cy="155" r="2.5" fill="#18181b" stroke="none" />
          <circle cx="385" cy="155" r="2.5" fill="#18181b" stroke="none" />
          <path d="M 368 170 C 368 174, 382 174, 382 170" strokeWidth="3" />
          {/* Shirt / Shoulders */}
          <path d="M 315 275 C 325 230, 425 230, 435 275" />
          {/* Orange Collar Accent */}
          <path d="M 355 232 L 375 255 L 395 232" stroke="#ea580c" strokeWidth="4.5" />
        </g>

        {/* ── BOTTOM LEFT: COMMUNITY CIRCLE & SILHOUETTES ── */}
        {/* Large Coral Outer Circle */}
        <circle
          cx="175"
          cy="315"
          r="135"
          stroke="#ea580c"
          strokeWidth="5.5"
          strokeLinecap="round"
          strokeDasharray="720 80"
          fill="none"
        />

        {/* Silhouette Avatars inside circle */}
        {/* 1. Black silhouette (Top-Left) */}
        <g stroke="#18181b" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <circle cx="105" cy="235" r="14" fill="white" />
          <path d="M 80 275 C 85 260, 125 260, 130 275" />
        </g>
        {/* 2. Orange silhouette (Middle-Left) */}
        <g stroke="#ea580c" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <circle cx="75" cy="305" r="14" fill="white" />
          <path d="M 50 345 C 55 330, 95 330, 100 345" />
        </g>
        {/* 3. Orange silhouette (Middle-Right) */}
        <g stroke="#ea580c" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <circle cx="127" cy="305" r="14" fill="white" />
          <path d="M 102 345 C 107 330, 147 330, 152 345" />
        </g>
        {/* 4. Black silhouette (Bottom-Left) */}
        <g stroke="#18181b" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <circle cx="105" cy="360" r="14" fill="white" />
          <path d="M 80 400 C 85 385, 125 385, 130 400" />
        </g>

        {/* ── MIDDLE & BOTTOM CENTER: FRONT CHARACTER ── */}
        {/* Hair and Head of Front Figure */}
        <g stroke="#18181b" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none">
          {/* Hair block (Orange fills + black outlines) */}
          <path
            d="M 160 285 C 160 245, 230 225, 270 245 C 280 260, 275 285, 270 295 Z"
            fill="#ea580c"
          />
          <path d="M 160 285 C 165 260, 200 240, 225 250 C 250 230, 270 260, 270 285" />
          
          {/* Head & Neck */}
          <path
            d="M 170 295 C 170 340, 260 340, 260 295 Z"
            fill="white"
          />
          {/* Ears */}
          <circle cx="165" cy="300" r="5" fill="white" />
          <circle cx="265" cy="300" r="5" fill="white" />
          
          {/* Eyes, Nose, Mouth */}
          <circle cx="190" cy="302" r="3" fill="#18181b" stroke="none" />
          <circle cx="240" cy="302" r="3" fill="#18181b" stroke="none" />
          <path d="M 215 300 L 215 320 C 215 322, 210 325, 205 325" strokeWidth="3.5" />
          <path d="M 200 338 C 200 346, 230 346, 230 338" strokeWidth="3.5" />
          
          {/* Shoulders */}
          <path d="M 120 425 C 140 375, 290 375, 310 425" />
          {/* Collar */}
          <path d="M 190 380 C 200 390, 230 390, 240 380" />
        </g>

        {/* ── MIDDLE RIGHT: PRESENTATION BOARD ── */}
        <g stroke="#18181b" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none">
          {/* Easel Stand Top */}
          <path d="M 355 205 L 375 225 L 395 205" />
          {/* Whiteboard Card */}
          <rect x="325" y="225" width="100" height="70" rx="6" fill="white" />
          {/* Gray Text Lines on Board */}
          <line x1="345" y1="245" x2="405" y2="245" stroke="#a1a1aa" strokeWidth="3" />
          <line x1="345" y1="260" x2="405" y2="260" stroke="#a1a1aa" strokeWidth="3" />
          <line x1="345" y1="275" x2="385" y2="275" stroke="#a1a1aa" strokeWidth="3" />
          {/* Easel Stand Legs */}
          <path d="M 340 335 L 360 295 L 410 295 L 430 335" />
        </g>

        {/* ── BOTTOM RIGHT: ORANGE BADGE & PLUS BUTTON ── */}
        {/* Plus '+' Button on Front Avatar */}
        <motion.g
          whileHover={{ scale: 1.1, rotate: 90 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
          className="cursor-pointer"
        >
          <circle
            cx="290"
            cy="400"
            r="48"
            fill="#ea580c"
            stroke="#18181b"
            strokeWidth="4"
          />
          <line x1="270" y1="400" x2="310" y2="400" stroke="#18181b" strokeWidth="6" strokeLinecap="round" />
          <line x1="290" y1="380" x2="290" y2="420" stroke="#18181b" strokeWidth="6" strokeLinecap="round" />
        </motion.g>

        {/* Badge '1' Circle */}
        <motion.g
          animate={{ y: [-5, 5, -5] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <circle
            cx="420"
            cy="345"
            r="35"
            fill="white"
            stroke="#ea580c"
            strokeWidth="4"
          />
          {/* Number 1 inside */}
          <text
            x="420"
            y="357"
            fill="#ea580c"
            fontSize="36"
            fontFamily="monospace"
            fontWeight="black"
            textAnchor="middle"
          >
            1
          </text>
        </motion.g>

        {/* Small squares detail at bottom right */}
        <g stroke="#18181b" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <rect x="400" y="405" width="25" height="25" rx="3" />
          <rect x="370" y="420" width="45" height="45" rx="4" />
        </g>
      </svg>
    </div>
  );
}

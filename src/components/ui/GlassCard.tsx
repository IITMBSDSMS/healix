"use client";

import React, { useRef } from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  glowOnHover?: boolean;
  glowColor?: string;
}

export function GlassCard({
  children,
  className,
  glowOnHover = true,
  glowColor = "rgba(234,179,8,0.08)",
  ...props
}: GlassCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card || !glowOnHover) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={cn(
        "healix-card",
        glowOnHover && "healix-card-glow",
        className
      )}
      {...props}
    >
      {/* Gradient shimmer on hover */}
      {glowOnHover && <div className="healix-card-shine" aria-hidden />}
      {/* Subtle inner gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none rounded-2xl" aria-hidden />
      <div className="relative z-10 h-full flex flex-col">{children}</div>
    </div>
  );
}

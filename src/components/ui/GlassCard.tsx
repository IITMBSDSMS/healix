"use client";

import React, { useRef } from "react";
import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

interface GlassCardProps extends Omit<HTMLMotionProps<"div">, "onAnimationStart" | "onDragStart" | "onDragEnd" | "onDrag" | "ref"> {
  children: React.ReactNode;
  className?: string;
  glowOnHover?: boolean;
  glowColor?: string;
  delay?: number;
}

export function GlassCard({
  children,
  className,
  glowOnHover = true,
  glowColor = "rgba(234,179,8,0.08)",
  delay = 0,
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
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, delay, ease: "easeOut" }}
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
    </motion.div>
  );
}

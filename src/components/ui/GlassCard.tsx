"use client";

import React from "react";
import { cn } from "@/lib/utils";


interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  glowOnHover?: boolean;
}

export function GlassCard({ children, className, glowOnHover = true, ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        "bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6 relative overflow-hidden group transition-all duration-500 shadow-2xl",
        glowOnHover && "hover:border-white/10 hover:bg-[#0c0c0c]/90",
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
      <div className="relative z-10 h-full flex flex-col">{children}</div>
    </div>
  );
}

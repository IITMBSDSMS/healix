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
        "bg-[#0a0a0a] border border-white/10 rounded-xl p-6 relative overflow-hidden group transition-all duration-300",
        glowOnHover && "hover:border-white/20 hover:bg-[#0c0c0c]",
        className
      )}
      {...props}
    >
      <div className="relative z-10">{children}</div>
    </div>
  );
}

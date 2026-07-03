import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface HealixLogoProps {
  /** Size of the logo in pixels (it's square). Default: 40 */
  size?: number;
  /** Extra classes for the wrapper span */
  className?: string;
  /** Controls opacity of the subtle inner ring. Default true */
  showRing?: boolean;
}

/**
 * Image-based Healix logo.
 * Note: Place the new logo image file at `public/official-logo.png`
 */
export function HealixLogo({ size = 40, className }: HealixLogoProps) {
  // Trimmed logo has aspect ratio 3.523 (754x214)
  const width = Math.round(size * 3.523);
  const height = size;
  return (
    <span
      className={cn("inline-flex items-center justify-center shrink-0 relative", className)}
      style={{ width, height }}
    >
      <Image
        src="/healix-inc-logo-trimmed.png"
        alt="Healix Technologies Incorporated Logo"
        width={width}
        height={height}
        className="object-contain"
        priority
      />
    </span>
  );
}

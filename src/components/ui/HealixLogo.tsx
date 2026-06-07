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
  return (
    <span
      className={cn("inline-flex items-center justify-center shrink-0 relative", className)}
      style={{ width: size, height: size }}
    >
      <Image
        src="/official-logo-web.png"
        alt="Healix Official Logo"
        width={size}
        height={size}
        className="object-cover rounded-full overflow-hidden bg-white shadow-sm ring-2 ring-white/10"
        priority
      />
    </span>
  );
}

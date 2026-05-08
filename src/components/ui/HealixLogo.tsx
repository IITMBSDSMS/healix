import React from "react";
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
 * Inline-SVG Healix logo — circular DNA/helix symbol.
 * Using inline SVG keeps it crisp at any size and avoids
 * next/image layout-shift on the splash screen.
 */
export function HealixLogo({ size = 40, className, showRing = true }: HealixLogoProps) {
  return (
    <span
      className={cn("inline-flex items-center justify-center shrink-0", className)}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
      >
        {/* Outer circle ring */}
        <circle cx="50" cy="50" r="47" stroke="white" strokeWidth="3" fill="none" />

        {/* Subtle dashed inner ring */}
        {showRing && (
          <circle
            cx="50" cy="50" r="39"
            stroke="white" strokeWidth="1"
            strokeDasharray="4 3"
            fill="none"
            opacity="0.3"
          />
        )}

        {/* Left DNA strand */}
        <path
          d="M38 22 C34 30, 42 35, 38 44 C34 53, 42 57, 38 66 C34 75, 38 80, 38 80"
          stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none"
        />
        {/* Right DNA strand */}
        <path
          d="M62 22 C66 30, 58 35, 62 44 C66 53, 58 57, 62 66 C66 75, 62 80, 62 80"
          stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none"
        />

        {/* Horizontal rungs */}
        <line x1="38" y1="29" x2="62" y2="29" stroke="white" strokeWidth="2"   strokeLinecap="round" opacity="0.8" />
        <line x1="38" y1="38" x2="62" y2="38" stroke="white" strokeWidth="2"   strokeLinecap="round" opacity="0.8" />
        <line x1="38" y1="50" x2="62" y2="50" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
        <line x1="38" y1="62" x2="62" y2="62" stroke="white" strokeWidth="2"   strokeLinecap="round" opacity="0.8" />
        <line x1="38" y1="71" x2="62" y2="71" stroke="white" strokeWidth="2"   strokeLinecap="round" opacity="0.8" />

        {/* Centre node */}
        <circle cx="50" cy="50" r="3" fill="white" />

        {/* Strand-junction nodes */}
        <circle cx="38" cy="29" r="2" fill="white" />
        <circle cx="62" cy="29" r="2" fill="white" />
        <circle cx="38" cy="50" r="2" fill="white" />
        <circle cx="62" cy="50" r="2" fill="white" />
        <circle cx="38" cy="71" r="2" fill="white" />
        <circle cx="62" cy="71" r="2" fill="white" />
      </svg>
    </span>
  );
}

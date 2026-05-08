"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export function PageWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Full-viewport pages manage their own layout
  if (pathname.startsWith("/ai-check")) {
    return <>{children}</>;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="min-h-screen pt-24 pb-12 flex flex-col"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}


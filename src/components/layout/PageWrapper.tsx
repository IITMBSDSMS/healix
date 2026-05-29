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
        initial={{ opacity: 0, filter: "blur(4px)" }}
        animate={{ opacity: 1, filter: "blur(0px)" }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="min-h-screen pt-4 pb-12 flex flex-col"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}


"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Users } from "lucide-react";

export default function MentorsAdminRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin?tab=mentors");
  }, [router]);

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-6 text-center"
      >
        {/* Spinning ring */}
        <div className="relative w-20 h-20">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#ea580c] border-r-[#eab308]"
          />
          <div className="absolute inset-3 rounded-full bg-[#0a0a0a] flex items-center justify-center">
            <Users className="w-6 h-6 text-[#ea580c]" />
          </div>
        </div>

        <div>
          <p className="text-[10px] font-mono text-white/30 uppercase tracking-[0.3em] mb-2">
            Routing to Master Console
          </p>
          <h2 className="text-xl font-black font-mono text-white uppercase tracking-widest">
            Advisors &amp; Mentors
          </h2>
        </div>

        <div className="flex gap-1.5 mt-2">
          {[0, 0.2, 0.4].map((delay, i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ duration: 1, repeat: Infinity, delay }}
              className="w-1.5 h-1.5 rounded-full bg-[#ea580c]"
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}

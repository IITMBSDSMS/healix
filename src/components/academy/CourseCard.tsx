"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Clock, Users, Star, ArrowRight, BookOpen } from "lucide-react";

interface CourseCardProps {
  course: {
    id: string;
    slug: string;
    title: string;
    description?: string;
    shortDescription?: string;
    price: number;
    duration: string;
    difficulty: string;
    seatsRemaining: number;
    discount_tag?: string;
    thumbnail: string;
    mentor?: {
      name: string;
      photoUrl: string;
    };
  };
  index?: number;
}

const DIFFICULTY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  beginner:     { bg: "bg-emerald-50",  text: "text-emerald-700", border: "border-emerald-200" },
  intermediate: { bg: "bg-blue-50",     text: "text-blue-700",    border: "border-blue-200"    },
  advanced:     { bg: "bg-purple-50",   text: "text-purple-700",  border: "border-purple-200"  },
  expert:       { bg: "bg-rose-50",     text: "text-rose-700",    border: "border-rose-200"    },
};

export const CourseCard = ({ course, index = 0 }: CourseCardProps) => {
  const [hovered, setHovered] = useState(false);
  const diff = course.difficulty.toLowerCase();
  const diffStyle = DIFFICULTY_COLORS[diff] || DIFFICULTY_COLORS.intermediate;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="h-full"
    >
      <Link href={`/academy/course/${course.slug}`} className="block h-full">
        <motion.div
          onHoverStart={() => setHovered(true)}
          onHoverEnd={() => setHovered(false)}
          whileHover={{ y: -8, boxShadow: "0 30px 60px rgba(90,75,218,0.15)" }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="h-full bg-white rounded-2xl overflow-hidden flex flex-col shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-gray-100 group"
        >
          {/* ── THUMBNAIL ── */}
          <div className="relative h-52 overflow-hidden bg-gradient-to-br from-[#5a4bda] to-[#8b5cf6] shrink-0">
            {/* Thumbnail image */}
            <Image
              src={course.thumbnail || "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600"}
              alt={course.title}
              fill
              className="object-cover opacity-40 group-hover:opacity-60 group-hover:scale-110 transition-all duration-700"
            />
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            {/* Top badges */}
            <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
              {course.discount_tag && (
                <motion.div
                  animate={hovered ? { scale: 1.05 } : { scale: 1 }}
                  className="bg-[#ff5500] text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-lg"
                >
                  🔥 {course.discount_tag}
                </motion.div>
              )}
              <div className={`ml-auto px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${diffStyle.bg} ${diffStyle.text} ${diffStyle.border}`}>
                {course.difficulty}
              </div>
            </div>

            {/* Mentor avatar */}
            <div className="absolute bottom-4 left-4 flex items-center gap-2 z-10">
              <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white shadow-md">
                <Image
                  src={course.mentor?.photoUrl || "https://i.pravatar.cc/100"}
                  alt={course.mentor?.name || "Mentor"}
                  width={32}
                  height={32}
                  className="object-cover w-full h-full"
                />
              </div>
              <span className="text-white text-xs font-semibold drop-shadow">
                {course.mentor?.name || "Expert Mentor"}
              </span>
            </div>

            {/* Rating stars */}
            <div className="absolute bottom-4 right-4 flex items-center gap-1 z-10">
              {[1,2,3,4,5].map(s => (
                <Star key={s} className="w-3 h-3 fill-[#fbbf24] text-[#fbbf24]" />
              ))}
            </div>
          </div>

          {/* ── CONTENT ── */}
          <div className="flex flex-col flex-1 p-5">
            {/* Title */}
            <h3 className="text-base font-extrabold text-slate-900 mb-2 leading-snug line-clamp-2 group-hover:text-[#5a4bda] transition-colors">
              {course.title}
            </h3>

            {/* Description */}
            <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 mb-4 flex-1">
              {course.shortDescription || course.description}
            </p>

            {/* Meta row */}
            <div className="flex items-center gap-4 mb-4 text-[11px] text-slate-400 font-medium">
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#5a4bda]" />
                <span>{course.duration}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-[#ff5500]" />
                <span className="text-[#ff5500] font-bold">{course.seatsRemaining} seats left</span>
              </div>
              <div className="flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Live + Recorded</span>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
              {/* Price */}
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-0.5">Course Fee</p>
                <p className="text-xl font-black text-slate-900">
                  ₹{course.price.toLocaleString()}
                  <span className="text-xs text-slate-400 font-normal ml-1">/ course</span>
                </p>
              </div>

              {/* CTA */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 bg-[#5a4bda] hover:bg-[#4a3bc0] text-white text-sm font-bold px-5 py-2.5 rounded-xl shadow-md shadow-[#5a4bda]/30 transition-colors"
              >
                Enroll
                <motion.div
                  animate={hovered ? { x: 4 } : { x: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
};

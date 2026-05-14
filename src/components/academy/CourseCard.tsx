import React from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { Clock, BarChart, Users, ArrowRight, Sparkles, GraduationCap, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

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
}

export const CourseCard = ({ course }: CourseCardProps) => {
  return (
    <Link href={`/academy/course/${course.slug}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        whileHover={{ y: -8 }}
        transition={{ duration: 0.4 }}
        className="h-full"
      >
        <GlassCard className="p-0 overflow-hidden border-white/5 group h-full hover:border-[#eab308]/30 transition-all shadow-2xl bg-black/40">
          <div className="relative aspect-[16/10] overflow-hidden">
            <Image 
              src={course.thumbnail} 
              alt={course.title} 
              fill 
              className="object-cover transition-transform duration-1000 group-hover:scale-110 opacity-60 group-hover:opacity-100" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />
            
            {/* Badges */}
            <div className="absolute top-6 left-6 flex flex-wrap gap-2">
              <div className="px-3 py-1 rounded-full bg-[#eab308] text-black text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-[0_0_20px_rgba(234,179,8,0.3)]">
                <Sparkles className="w-3 h-3" />
                {course.discount_tag || "Enroll Now"}
              </div>
              <div className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono text-white/80 uppercase tracking-widest">
                {course.difficulty}
              </div>
            </div>

            <div className="absolute bottom-6 left-6 right-6">
              <h3 className="text-2xl font-bold text-white mb-2 tracking-tight group-hover:text-[#eab308] transition-colors line-clamp-1">
                {course.title}
              </h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full border border-white/20 overflow-hidden">
                    <Image 
                      src={course.mentor?.photoUrl || "https://i.pravatar.cc/100"} 
                      width={24} 
                      height={24} 
                      alt="Mentor" 
                      className="grayscale group-hover:grayscale-0 transition-all"
                    />
                  </div>
                  <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">with {course.mentor?.name || "Staff Engineer"}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8">
            <p className="text-sm text-white/50 mb-8 line-clamp-2 leading-relaxed h-10">
              {course.shortDescription || course.description}
            </p>

            <div className="flex items-center justify-between mb-8 pb-8 border-b border-white/5">
              <div className="space-y-1">
                <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest">Course Fee</p>
                <p className="text-2xl font-bold text-white tracking-tighter">₹{course.price.toLocaleString()}</p>
              </div>
              <div className="text-right space-y-3">
                <div className="flex items-center gap-2 text-[10px] font-mono text-white/40 uppercase tracking-widest justify-end">
                  <Clock className="w-3 h-3 text-[#eab308]" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-mono text-[#eab308] uppercase tracking-widest justify-end">
                  <Users className="w-3 h-3" />
                  <span>{course.seatsRemaining} seats left</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between group/btn">
              <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest group-hover:text-white transition-colors">
                View Curriculum
              </span>
              <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-[#eab308]/50 group-hover:bg-[#eab308]/10 transition-all">
                <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-[#eab308] transition-all" />
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </Link>
  );
};

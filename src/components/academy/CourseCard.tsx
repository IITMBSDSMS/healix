import React from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { Clock, BarChart, Users, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface CourseCardProps {
  course: {
    id: string;
    slug: string;
    title: string;
    description: string;
    price: number;
    duration: string;
    difficulty: string;
    seats_remaining: number;
    discount_tag?: string;
    thumbnail_url: string;
    mentor?: {
      name: string;
      photo_url: string;
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
        <GlassCard className="p-0 overflow-hidden border-white/5 group h-full hover:border-[#eab308]/30 transition-all shadow-2xl">
          <div className="relative aspect-video overflow-hidden">
            <Image 
              src={course.thumbnail_url} 
              alt={course.title} 
              fill 
              className="object-cover transition-transform duration-700 group-hover:scale-110" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-80" />
            
            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              <div className="px-3 py-1 rounded-full bg-[#eab308] text-black text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                {course.discount_tag || "Enroll Now"}
              </div>
              <div className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono text-white/80 uppercase tracking-widest">
                {course.difficulty}
              </div>
            </div>

            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full border-2 border-black bg-white/10 overflow-hidden">
                  <Image 
                    src={course.mentor?.photo_url || "https://i.pravatar.cc/100"} 
                    width={32} 
                    height={32} 
                    alt="Mentor" 
                  />
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Starts at</p>
                <p className="text-2xl font-bold text-white">₹{course.price.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            <h3 className="text-2xl font-bold text-white mb-3 tracking-tight group-hover:text-[#eab308] transition-colors">
              {course.title}
            </h3>
            <p className="text-sm text-white/50 mb-8 line-clamp-2 leading-relaxed">
              {course.description}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex items-center gap-2 text-xs text-white/40">
                <Clock className="w-4 h-4 text-[#eab308]" />
                <span>{course.duration}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-white/40">
                <Users className="w-4 h-4 text-[#eab308]" />
                <span>{course.seats_remaining} seats left</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-white/5">
              <div className="text-[10px] font-mono text-white/30 uppercase tracking-widest">
                Curriculum Access Included
              </div>
              <ArrowRight className="w-5 h-5 text-white/20 group-hover:text-[#eab308] group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </Link>
  );
};

import Link from "next/link";
import { ArrowRight, Clock, Users, Zap } from "lucide-react";
import { mentors } from "@/lib/academy/data";

export function CourseCard({ course }: { course: any }) {
  const mainMentor = mentors.find(m => m.id === course.mentors[0]);

  return (
    <div className="group relative bg-[#0a0a0f] border border-white/10 rounded-2xl overflow-hidden hover:border-[#eab308]/30 transition-all duration-500 flex flex-col h-full shadow-xl">
      <div className="relative h-48 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] to-transparent z-10" />
        <img 
          src={course.thumbnail} 
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
          {course.originalPrice > course.price && (
            <div className="px-3 py-1 bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-bold rounded-full backdrop-blur-md">
              Save ₹{(course.originalPrice - course.price).toLocaleString()}
            </div>
          )}
          <div className="px-3 py-1 bg-[#eab308]/20 border border-[#eab308]/30 text-[#eab308] text-xs font-bold rounded-full backdrop-blur-md">
            {course.difficulty}
          </div>
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col z-20 -mt-6">
        <div className="flex items-center gap-3 mb-4">
          {mainMentor && (
            <div className="flex items-center gap-2">
              <img src={mainMentor.photoUrl} alt={mainMentor.name} className="w-8 h-8 rounded-full border border-white/20 object-cover" />
              <span className="text-xs text-white/60">by {mainMentor.name}</span>
            </div>
          )}
        </div>

        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#eab308] transition-colors">{course.title}</h3>
        <p className="text-sm text-white/50 mb-6 flex-1">{course.shortDescription}</p>

        <div className="grid grid-cols-2 gap-4 mb-6 text-xs text-white/40 font-mono">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#eab308]" />
            {course.duration}
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#eab308]" />
            {course.seatsRemaining} Seats Left
          </div>
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-white/10 mt-auto">
          <div>
            <div className="text-xs text-white/40 line-through">₹{course.originalPrice.toLocaleString()}</div>
            <div className="text-lg font-bold text-white">₹{course.price.toLocaleString()}</div>
          </div>
          <Link href={`/academy/course/${course.slug}`}>
            <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-[#eab308] hover:text-black text-white rounded-lg transition-all text-sm font-semibold border border-white/10 hover:border-transparent">
              View Program <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

import React from "react";
import { motion } from "framer-motion";
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
    <Link href={`/academy/course/${course.slug}`} className="block h-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        whileHover={{ y: -5 }}
        transition={{ duration: 0.3 }}
        className="h-full bg-white flex flex-col shadow-xl"
      >
        {/* Top Header Graphic (Orange Polygon style) */}
        <div className="relative h-48 bg-[#ff2600] overflow-hidden shrink-0">
          {/* Diagonal overlay to create the polygon effect */}
          <div className="absolute top-0 right-0 bottom-0 left-1/3 bg-[#ff5500] transform skew-x-[-20deg] origin-bottom" />
          <div className="absolute top-0 right-0 bottom-0 left-2/3 bg-white transform skew-x-[-20deg] origin-bottom z-0" />
          
          <div className="absolute inset-0 p-4 flex z-10">
            {/* Text Information (Left side) */}
            <div className="w-2/3 flex flex-col justify-center">
               <div className="bg-white text-red-600 font-black italic px-3 py-1 inline-block w-max text-sm uppercase shadow-sm border border-red-600">
                  {course.title.substring(0, 15)}
               </div>
               
               <div className="mt-3">
                 <div className="bg-[#eab308] text-black text-[8px] font-bold px-2 py-0.5 inline-block italic w-max uppercase">Eligibility</div>
                 <div className="text-white font-bold italic text-lg mt-1 uppercase tracking-wider text-shadow-sm">
                   For {course.difficulty}
                 </div>
               </div>
               
               <div className="mt-3">
                 <div className="bg-[#eab308] text-black text-[8px] font-bold px-2 py-0.5 inline-block italic w-max uppercase mb-1">Aims & Objectives</div>
                 <ul className="text-white text-[7px] leading-tight font-medium list-disc pl-3">
                   <li>Master production-grade AI & systems</li>
                   <li>1:1 Mentorship with Top Engineers</li>
                   <li>Build scalable architectures</li>
                 </ul>
               </div>
            </div>
            
            {/* Student Image (Right side) */}
            <div className="w-1/3 relative flex items-end justify-center">
               {/* We use the mentor photo or a fallback for the "student" portrait */}
               <Image 
                 src={course.mentor?.photoUrl || "https://i.pravatar.cc/300"} 
                 alt="Student" 
                 width={100} 
                 height={150} 
                 className="object-cover h-[120%] w-auto absolute bottom-0 object-bottom drop-shadow-xl z-20"
               />
            </div>
          </div>
        </div>

        {/* Bottom Content Area */}
        <div className="p-4 flex flex-col flex-1 justify-between bg-white border-t-4 border-[#ffcc00]">
          <p className="text-sm text-gray-500 font-medium mb-4 line-clamp-2">
            {course.shortDescription || course.description}
          </p>

          <div className="flex justify-end mt-auto">
            <button className="bg-[#ff5500] hover:bg-[#e04a00] transition-colors text-white font-bold py-2 px-6 rounded shadow-md">
              Details
            </button>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

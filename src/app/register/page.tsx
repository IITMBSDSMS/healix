"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  User, Mail, Phone, GraduationCap, 
  Briefcase, Target, ArrowRight, CheckCircle2,
  Sparkles
} from "lucide-react";
import { useRouter } from "next/navigation";

const registerSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Valid phone number is required"),
  institution: z.string().min(2, "Institution/Company is required"),
  experienceLevel: z.string().min(1, "Please select an experience level"),
  preferredCourse: z.string().min(1, "Please select a course"),
  goals: z.string().min(10, "Please share a bit about your goals"),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log("Form Data:", data);
      setIsSuccess(true);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fafbff] to-[#f2f5fa] text-slate-900 selection:bg-[#ff5500]/30 pt-32 pb-20 px-6 relative overflow-hidden">
      
      {/* ── Vector Background Elements ── */}
      <div className="absolute top-0 right-[-10%] w-[500px] h-[500px] bg-[#5a4bda]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-[-10%] w-[500px] h-[500px] bg-[#ff5500]/5 blur-[120px] rounded-full pointer-events-none" />

      {/* ── SVG Dotted Grid Overlay ── */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.04] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="register-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.5" fill="#5a4bda" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#register-grid)" />
      </svg>

      {/* ── SVG Decorative Lines ── */}
      <svg className="absolute top-20 left-0 w-full h-full opacity-[0.03] pointer-events-none" viewBox="0 0 1440 800" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
        <path d="M-100,300 C300,500 600,200 1000,400 C1300,550 1500,350 1600,450" stroke="#5a4bda" strokeWidth="4" />
        <path d="M-50,350 C350,550 650,250 1050,450 C1350,600 1550,400 1650,500" stroke="#ff5500" strokeWidth="3" />
      </svg>

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#5a4bda]/20 bg-[#5a4bda]/5 mb-6 shadow-sm">
            <Sparkles className="h-4 w-4 text-[#5a4bda]" />
            <span className="text-[10px] font-mono text-[#5a4bda] uppercase tracking-widest font-black">Apply for 2026 Cohort</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-4">
            Join the <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5a4bda] to-[#ff5500]">Elite Engineering</span> Track
          </h1>
          <p className="text-slate-500 font-semibold text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Fill out your application details below. Our team reviews every application to ensure the highest quality cohort.
          </p>
        </motion.div>

        <GlassCard 
          className="p-8 md:p-12 border-slate-100/80 bg-white/80 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.04)] rounded-3xl"
          glowColor="rgba(90,75,218,0.05)"
        >
          {isSuccess ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-green-500/20">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-3xl font-black text-slate-900 mb-4">Application Received!</h2>
              <p className="text-slate-500 font-semibold mb-8 max-w-md mx-auto leading-relaxed">
                We&apos;ve sent a confirmation email to your inbox. You will be redirected to the payment portal shortly.
              </p>
              <Button 
                onClick={() => router.push("/academy")} 
                variant="outline"
                className="border-slate-300 text-slate-700 hover:border-[#5a4bda] hover:text-[#5a4bda]"
              >
                Back to Academy
              </Button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {/* Full Name */}
                <div className="space-y-2.5">
                  <label className="text-xs font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-[#5a4bda]" /> Full Name
                  </label>
                  <input
                    {...register("fullName")}
                    placeholder="Enter your full name"
                    className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-3.5 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#5a4bda] focus:ring-2 focus:ring-[#5a4bda]/10 transition-all font-semibold shadow-sm"
                  />
                  {errors.fullName && <p className="text-red-500 text-[10px] uppercase font-bold tracking-wider pt-1">{errors.fullName.message}</p>}
                </div>

                {/* Email */}
                <div className="space-y-2.5">
                  <label className="text-xs font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-[#5a4bda]" /> Professional Email
                  </label>
                  <input
                    {...register("email")}
                    placeholder="name@company.com"
                    className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-3.5 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#5a4bda] focus:ring-2 focus:ring-[#5a4bda]/10 transition-all font-semibold shadow-sm"
                  />
                  {errors.email && <p className="text-red-500 text-[10px] uppercase font-bold tracking-wider pt-1">{errors.email.message}</p>}
                </div>

                {/* Phone */}
                <div className="space-y-2.5">
                  <label className="text-xs font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-[#5a4bda]" /> Phone Number
                  </label>
                  <input
                    {...register("phone")}
                    placeholder="+91 XXXXX XXXXX"
                    className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-3.5 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#5a4bda] focus:ring-2 focus:ring-[#5a4bda]/10 transition-all font-semibold shadow-sm"
                  />
                  {errors.phone && <p className="text-red-500 text-[10px] uppercase font-bold tracking-wider pt-1">{errors.phone.message}</p>}
                </div>

                {/* Institution */}
                <div className="space-y-2.5">
                  <label className="text-xs font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <GraduationCap className="w-3.5 h-3.5 text-[#5a4bda]" /> Institution / Organization
                  </label>
                  <input
                    {...register("institution")}
                    placeholder="IIT, Google, Startup, etc."
                    className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-3.5 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#5a4bda] focus:ring-2 focus:ring-[#5a4bda]/10 transition-all font-semibold shadow-sm"
                  />
                  {errors.institution && <p className="text-red-500 text-[10px] uppercase font-bold tracking-wider pt-1">{errors.institution.message}</p>}
                </div>

                {/* Experience Level */}
                <div className="space-y-2.5">
                  <label className="text-xs font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <Briefcase className="w-3.5 h-3.5 text-[#5a4bda]" /> Experience Level
                  </label>
                  <div className="relative">
                    <select
                      {...register("experienceLevel")}
                      className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-3.5 text-slate-800 focus:outline-none focus:bg-white focus:border-[#5a4bda] focus:ring-2 focus:ring-[#5a4bda]/10 transition-all font-semibold shadow-sm appearance-none cursor-pointer"
                    >
                      <option value="">Select Level</option>
                      <option value="student">Undergrad / Student</option>
                      <option value="junior">Early Professional (1-2 years)</option>
                      <option value="mid">Mid-Level (3-5 years)</option>
                      <option value="senior">Senior / Lead (5+ years)</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 font-extrabold">▼</div>
                  </div>
                  {errors.experienceLevel && <p className="text-red-500 text-[10px] uppercase font-bold tracking-wider pt-1">{errors.experienceLevel.message}</p>}
                </div>

                {/* Preferred Course */}
                <div className="space-y-2.5">
                  <label className="text-xs font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <Target className="w-3.5 h-3.5 text-[#5a4bda]" /> Preferred Program
                  </label>
                  <div className="relative">
                    <select
                      {...register("preferredCourse")}
                      className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-3.5 text-slate-800 focus:outline-none focus:bg-white focus:border-[#5a4bda] focus:ring-2 focus:ring-[#5a4bda]/10 transition-all font-semibold shadow-sm appearance-none cursor-pointer"
                    >
                      <option value="">Select Track</option>
                      <option value="ai-systems">AI Systems Engineering (₹7,999)</option>
                      <option value="fullstack">Full Stack Product (₹5,999)</option>
                      <option value="genomics">Genomic AI Research (₹9,999)</option>
                      <option value="startup">Startup Engineering (₹4,999)</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 font-extrabold">▼</div>
                  </div>
                  {errors.preferredCourse && <p className="text-red-500 text-[10px] uppercase font-bold tracking-wider pt-1">{errors.preferredCourse.message}</p>}
                </div>
              </div>

              {/* Goals */}
              <div className="space-y-2.5">
                <label className="text-xs font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  What do you hope to achieve?
                </label>
                <textarea
                  {...register("goals")}
                  rows={4}
                  placeholder="Share your technical goals and what you want to build..."
                  className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-3.5 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#5a4bda] focus:ring-2 focus:ring-[#5a4bda]/10 transition-all font-semibold shadow-sm resize-none"
                />
                {errors.goals && <p className="text-red-500 text-[10px] uppercase font-bold tracking-wider pt-1">{errors.goals.message}</p>}
              </div>

              <Button
                type="submit"
                isLoading={isSubmitting}
                className="w-full h-14 text-base font-black bg-[#5a4bda] text-white hover:bg-[#4a3bc0] border-0 hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-[#5a4bda]/20 transition-all"
              >
                Submit Application <ArrowRight className="ml-2 w-5 h-5" />
              </Button>

              <p className="text-center text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                By submitting, you agree to our Terms of Service and Privacy Policy.
              </p>
            </form>
          )}
        </GlassCard>
      </div>
    </div>
  );
}

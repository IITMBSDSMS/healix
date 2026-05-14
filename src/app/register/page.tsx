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
      // In real app, redirect to payment
      // setTimeout(() => router.push("/payment/checkout"), 2000);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-32 pb-20 px-6 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#eab308]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#eab308]/30 bg-[#eab308]/10 mb-6">
            <Sparkles className="h-4 w-4 text-[#eab308]" />
            <span className="text-[10px] font-mono text-[#eab308] uppercase tracking-widest">Apply for 2026 Cohort</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">
            Join the <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#eab308] to-[#fde047]">Elite Engineering</span> Track
          </h1>
          <p className="text-white/50 text-lg max-w-2xl mx-auto">
            Fill out your application details below. Our team reviews every application to ensure the highest quality cohort.
          </p>
        </motion.div>

        <GlassCard className="p-8 md:p-12 border-white/5 bg-white/[0.01] backdrop-blur-3xl shadow-2xl">
          {isSuccess ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-8">
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Application Received!</h2>
              <p className="text-white/50 mb-8 max-w-md mx-auto">
                We've sent a confirmation email to your inbox. You will be redirected to the payment portal shortly.
              </p>
              <Button onClick={() => router.push("/academy")} variant="outline">
                Back to Academy
              </Button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Full Name */}
                <div className="space-y-2">
                  <label className="text-xs font-mono text-white/40 uppercase tracking-widest flex items-center gap-2">
                    <User className="w-3 h-3" /> Full Name
                  </label>
                  <input
                    {...register("fullName")}
                    placeholder="Enter your full name"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[#eab308]/50 transition-all"
                  />
                  {errors.fullName && <p className="text-red-400 text-[10px] uppercase font-mono">{errors.fullName.message}</p>}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-xs font-mono text-white/40 uppercase tracking-widest flex items-center gap-2">
                    <Mail className="w-3 h-3" /> Professional Email
                  </label>
                  <input
                    {...register("email")}
                    placeholder="name@company.com"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[#eab308]/50 transition-all"
                  />
                  {errors.email && <p className="text-red-400 text-[10px] uppercase font-mono">{errors.email.message}</p>}
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <label className="text-xs font-mono text-white/40 uppercase tracking-widest flex items-center gap-2">
                    <Phone className="w-3 h-3" /> Phone Number
                  </label>
                  <input
                    {...register("phone")}
                    placeholder="+91 XXXXX XXXXX"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[#eab308]/50 transition-all"
                  />
                  {errors.phone && <p className="text-red-400 text-[10px] uppercase font-mono">{errors.phone.message}</p>}
                </div>

                {/* Institution */}
                <div className="space-y-2">
                  <label className="text-xs font-mono text-white/40 uppercase tracking-widest flex items-center gap-2">
                    <GraduationCap className="w-3 h-3" /> Institution / Organization
                  </label>
                  <input
                    {...register("institution")}
                    placeholder="IIT, Google, Startup, etc."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[#eab308]/50 transition-all"
                  />
                  {errors.institution && <p className="text-red-400 text-[10px] uppercase font-mono">{errors.institution.message}</p>}
                </div>

                {/* Experience Level */}
                <div className="space-y-2">
                  <label className="text-xs font-mono text-white/40 uppercase tracking-widest flex items-center gap-2">
                    <Briefcase className="w-3 h-3" /> Experience Level
                  </label>
                  <select
                    {...register("experienceLevel")}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#eab308]/50 transition-all appearance-none"
                  >
                    <option value="" className="bg-[#050505]">Select Level</option>
                    <option value="student" className="bg-[#050505]">Undergrad / Student</option>
                    <option value="junior" className="bg-[#050505]">Early Professional (1-2 years)</option>
                    <option value="mid" className="bg-[#050505]">Mid-Level (3-5 years)</option>
                    <option value="senior" className="bg-[#050505]">Senior / Lead (5+ years)</option>
                  </select>
                  {errors.experienceLevel && <p className="text-red-400 text-[10px] uppercase font-mono">{errors.experienceLevel.message}</p>}
                </div>

                {/* Preferred Course */}
                <div className="space-y-2">
                  <label className="text-xs font-mono text-white/40 uppercase tracking-widest flex items-center gap-2">
                    <Target className="w-3 h-3" /> Preferred Program
                  </label>
                  <select
                    {...register("preferredCourse")}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#eab308]/50 transition-all appearance-none"
                  >
                    <option value="" className="bg-[#050505]">Select Track</option>
                    <option value="ai-systems" className="bg-[#050505]">AI Systems Engineering (₹7,999)</option>
                    <option value="fullstack" className="bg-[#050505]">Full Stack Product (₹5,999)</option>
                    <option value="genomics" className="bg-[#050505]">Genomic AI Research (₹9,999)</option>
                    <option value="startup" className="bg-[#050505]">Startup Engineering (₹4,999)</option>
                  </select>
                  {errors.preferredCourse && <p className="text-red-400 text-[10px] uppercase font-mono">{errors.preferredCourse.message}</p>}
                </div>
              </div>

              {/* Goals */}
              <div className="space-y-2">
                <label className="text-xs font-mono text-white/40 uppercase tracking-widest flex items-center gap-2">
                  What do you hope to achieve?
                </label>
                <textarea
                  {...register("goals")}
                  rows={4}
                  placeholder="Share your technical goals and what you want to build..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[#eab308]/50 transition-all resize-none"
                />
                {errors.goals && <p className="text-red-400 text-[10px] uppercase font-mono">{errors.goals.message}</p>}
              </div>

              <Button
                type="submit"
                isLoading={isSubmitting}
                className="w-full h-14 text-lg"
              >
                Submit Application <ArrowRight className="ml-2 w-5 h-5" />
              </Button>

              <p className="text-center text-[10px] font-mono text-white/20 uppercase tracking-widest">
                By submitting, you agree to our Terms of Service and Privacy Policy.
              </p>
            </form>
          )}
        </GlassCard>
      </div>
    </div>
  );
}

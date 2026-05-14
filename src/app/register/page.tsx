"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { useState, Suspense } from "react";
import { courses } from "@/lib/academy/data";
import { Shield, Loader2, ArrowRight } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";

const registerSchema = z.object({
  fullName: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Valid phone number is required"),
  institution: z.string().min(2, "Institution/Company is required"),
  experienceLevel: z.string().min(1, "Please select an experience level"),
  courseId: z.string().min(1, "Please select a program"),
  goals: z.string().min(10, "Please briefly describe your goals"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

function RegisterForm() {
  const searchParams = useSearchParams();
  const preselectedCourse = searchParams.get("course") || "";
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      courseId: preselectedCourse,
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsSubmitting(true);
    // Simulate DB save, email send, and payment redirect
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      // In a real app, redirect to Razorpay payment page here
      // For this demo, redirect to success page after 2s
      setTimeout(() => {
        router.push("/payment/success");
      }, 2000);
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className="text-center p-8">
        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Shield className="w-8 h-8 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold mb-4">Application Received</h2>
        <p className="text-white/60 mb-8">Redirecting to secure payment gateway...</p>
        <Loader2 className="w-6 h-6 text-[#eab308] animate-spin mx-auto" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">Full Name</label>
          <input
            {...register("fullName")}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#eab308]/50 transition-colors"
            placeholder="John Doe"
          />
          {errors.fullName && <p className="text-red-400 text-xs mt-1">{errors.fullName.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">Email Address</label>
          <input
            {...register("email")}
            type="email"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#eab308]/50 transition-colors"
            placeholder="john@example.com"
          />
          {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">Phone Number</label>
          <input
            {...register("phone")}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#eab308]/50 transition-colors"
            placeholder="+91 98765 43210"
          />
          {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">Institution / Company</label>
          <input
            {...register("institution")}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#eab308]/50 transition-colors"
            placeholder="IIT Bombay / Google"
          />
          {errors.institution && <p className="text-red-400 text-xs mt-1">{errors.institution.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">Experience Level</label>
          <select
            {...register("experienceLevel")}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#eab308]/50 transition-colors appearance-none"
          >
            <option value="" className="bg-[#111]">Select Level</option>
            <option value="student" className="bg-[#111]">Student</option>
            <option value="0-2" className="bg-[#111]">0-2 Years (Junior)</option>
            <option value="3-5" className="bg-[#111]">3-5 Years (Mid)</option>
            <option value="5+" className="bg-[#111]">5+ Years (Senior)</option>
          </select>
          {errors.experienceLevel && <p className="text-red-400 text-xs mt-1">{errors.experienceLevel.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">Program</label>
          <select
            {...register("courseId")}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#eab308]/50 transition-colors appearance-none"
          >
            <option value="" className="bg-[#111]">Select Program</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id} className="bg-[#111]">{c.title} (₹{c.price.toLocaleString()})</option>
            ))}
          </select>
          {errors.courseId && <p className="text-red-400 text-xs mt-1">{errors.courseId.message}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-white/70 mb-2">What are your goals for this program?</label>
        <textarea
          {...register("goals")}
          rows={4}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#eab308]/50 transition-colors resize-none"
          placeholder="I want to learn how to scale AI inference APIs..."
        />
        {errors.goals && <p className="text-red-400 text-xs mt-1">{errors.goals.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-4 bg-[#eab308] text-black font-bold rounded-xl hover:bg-[#ca8a04] transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(234,179,8,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>Processing <Loader2 className="w-5 h-5 animate-spin" /></>
        ) : (
          <>Proceed to Payment <ArrowRight className="w-5 h-5" /></>
        )}
      </button>
    </form>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white pt-32 pb-20 flex items-center justify-center">
      <div className="w-full max-w-3xl px-6">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-4">Academy Application</h1>
          <p className="text-white/60">Join the elite engineering fellowship. Spots are strictly limited.</p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#0a0a0f] border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#eab308]/5 rounded-full blur-[100px] pointer-events-none" />
          <Suspense fallback={<div className="h-96 flex items-center justify-center"><Loader2 className="w-8 h-8 text-[#eab308] animate-spin" /></div>}>
            <RegisterForm />
          </Suspense>
        </motion.div>
      </div>
    </div>
  );
}

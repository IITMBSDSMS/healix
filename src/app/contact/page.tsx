"use client";

import React, { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Mail, MapPin, Phone, Send, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
    };

    try {
      const response = await fetch("/api/send-contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok || result.error) {
        throw new Error(result.error?.message || "Failed to send message");
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-[94%] mx-auto px-6 sm:px-8 w-full py-20 min-h-screen bg-white text-zinc-900 selection:bg-yellow-500/20">
      <div className="mb-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#ea580c]/30 bg-[#ea580c]/10 mb-6">
          <div className="w-1.5 h-1.5 rounded-full bg-[#ea580c] animate-pulse" />
          <span className="text-[10px] font-mono text-[#ea580c] uppercase tracking-widest font-bold">Get In Touch</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 font-mono uppercase text-zinc-950">Contact Us</h1>
        <p className="text-zinc-650 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
          Have questions about Healix or the HSF initiative? We're here to help. Reach out to our team. We typically respond within 24 hours.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Contact Info */}
        <div className="lg:col-span-5 space-y-6">
          <GlassCard variant="light" className="flex items-start gap-4 p-6 bg-zinc-50 border border-zinc-200 rounded-2xl shadow-sm" glowOnHover={false}>
            <div className="p-3 bg-[#ea580c]/15 rounded-xl border border-[#ea580c]/20">
              <MapPin className="h-6 w-6 text-[#ea580c]" />
            </div>
            <div>
              <h3 className="text-sm font-bold font-mono uppercase text-zinc-900 mb-2">Our Office</h3>
              <p className="text-xs text-zinc-650 leading-relaxed">
                Healix Technologies Pvt Ltd.<br />
                IIT Madras Campus, Adyar<br />
                Chennai - 600036, India
              </p>
            </div>
          </GlassCard>

          <GlassCard variant="light" className="flex items-start gap-4 p-6 bg-zinc-50 border border-zinc-200 rounded-2xl shadow-sm" glowOnHover={false}>
            <div className="p-3 bg-[#ea580c]/15 rounded-xl border border-[#ea580c]/20">
              <Phone className="h-6 w-6 text-[#ea580c]" />
            </div>
            <div>
              <h3 className="text-sm font-bold font-mono uppercase text-zinc-900 mb-2">Phone</h3>
              <p className="text-xs text-zinc-650 leading-relaxed">
                +91 9540694581
              </p>
            </div>
          </GlassCard>

          <GlassCard variant="light" className="flex items-start gap-4 p-6 bg-zinc-50 border border-zinc-200 rounded-2xl shadow-sm" glowOnHover={false}>
            <div className="p-3 bg-[#ea580c]/15 rounded-xl border border-[#ea580c]/20">
              <Mail className="h-6 w-6 text-[#ea580c]" />
            </div>
            <div>
              <h3 className="text-sm font-bold font-mono uppercase text-zinc-900 mb-2">Email</h3>
              <p className="text-xs text-zinc-650 leading-relaxed">
                General: office@healix-technologies.com<br />
                Support: office@healix-technologies.com
              </p>
            </div>
          </GlassCard>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7">
          <GlassCard variant="light" className="p-8 bg-white border border-zinc-200 rounded-2xl shadow-sm">
            <h2 className="text-lg font-bold font-mono uppercase text-zinc-900 mb-6">Send us a message</h2>
            
            {success ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-green-100 border border-green-200 mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold mb-2 font-mono text-zinc-900">Message Sent!</h3>
                <p className="text-zinc-600 text-xs mb-6">Thank you for reaching out. Our team will get back to you shortly.</p>
                <Button onClick={() => setSuccess(false)} variant="outline" className="border-zinc-300 text-zinc-700 hover:bg-zinc-50 font-mono text-xs uppercase tracking-wider">Send Another Message</Button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold font-mono uppercase text-zinc-700 mb-1.5" htmlFor="name">
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-zinc-900 text-xs font-mono focus:outline-none focus:border-[#ea580c] transition-colors"
                    placeholder="Jane Doe"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold font-mono uppercase text-zinc-700 mb-1.5" htmlFor="email">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-zinc-900 text-xs font-mono focus:outline-none focus:border-[#ea580c] transition-colors"
                    placeholder="jane@example.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold font-mono uppercase text-zinc-700 mb-1.5" htmlFor="message">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-zinc-900 text-xs font-mono focus:outline-none focus:border-[#ea580c] transition-colors resize-none"
                    placeholder="How can we help you?"
                  />
                </div>

                {error && <p className="text-red-650 text-xs font-mono font-bold mt-2">{error}</p>}

                <Button type="submit" className="w-full mt-6 bg-black hover:bg-[#ea580c] text-white font-mono text-xs uppercase tracking-wider py-3 flex items-center justify-center gap-2" isLoading={loading}>
                  {!loading && <Send className="h-4 w-4 text-[#ea580c]" />}
                  Send Message
                </Button>
              </form>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

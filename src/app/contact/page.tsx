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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16">
      <div className="mb-16 text-center">
        <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
        <p className="text-white/70 max-w-2xl mx-auto text-lg">
          Have questions about Healix? We're here to help. Reach out to our team. We typically respond within 24 hours.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Info */}
        <div className="space-y-8">
          <GlassCard className="flex items-start gap-4 p-6" glowOnHover={false}>
            <div className="p-3 bg-primary/20 rounded-xl">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Our Office</h3>
              <p className="text-white/60">
                Healix Technologies Pvt Ltd.<br />
                Ansari Nagar<br />
                New Delhi, India
              </p>
            </div>
          </GlassCard>

          <GlassCard className="flex items-start gap-4 p-6" glowOnHover={false}>
            <div className="p-3 bg-green-500/20 rounded-xl">
              <Phone className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Phone</h3>
              <p className="text-white/60">
                Phone: +91 9540694581
              </p>
            </div>
          </GlassCard>

          <GlassCard className="flex items-start gap-4 p-6" glowOnHover={false}>
            <div className="p-3 bg-purple-500/20 rounded-xl">
              <Mail className="h-6 w-6 text-purple-500" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Email</h3>
              <p className="text-white/60">
                General: contact@healix.tech<br />
                Support: help@healix.tech
              </p>
            </div>
          </GlassCard>
        </div>

        {/* Contact Form */}
        <div>
          <GlassCard className="p-8">
            <h2 className="text-2xl font-bold mb-6">Send us a message</h2>
            
            {success ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-green-500/20 mb-4">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
                <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
                <p className="text-white/60 mb-6">Thank you for reaching out. Our team will get back to you shortly.</p>
                <Button onClick={() => setSuccess(false)} variant="outline">Send Another Message</Button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1" htmlFor="name">
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                    placeholder="Jane Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1" htmlFor="email">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                    placeholder="jane@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1" htmlFor="message">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-none"
                    placeholder="How can we help you?"
                  />
                </div>

                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

                <Button type="submit" className="w-full mt-6 gap-2" isLoading={loading}>
                  {!loading && <Send className="h-4 w-4" />}
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

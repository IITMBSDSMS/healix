"use client";

import React from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { motion } from "framer-motion";

export default function PrivacyPage() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16"
    >
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-white/60">Last updated: {new Date().getFullYear()}</p>
      </div>

      <GlassCard className="p-8 prose prose-invert prose-p:text-white/70 max-w-none" glowOnHover={false}>
        <h2>1. Introduction</h2>
        <p>
          Welcome to Healix Technologies Pvt Ltd. We respect your privacy and are committed to protecting your personal data. 
          This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
        </p>

        <h2>2. Data We Collect</h2>
        <p>
          We may collect, use, store and transfer different kinds of personal data about you, including:
        </p>
        <ul>
          <li className="text-white/70">Identity Data: First name, last name, username.</li>
          <li className="text-white/70">Contact Data: Email address, telephone numbers.</li>
          <li className="text-white/70">Health Data: Symptoms inputted into the Healix AI system (stored securely and anonymously where possible).</li>
          <li className="text-white/70">Location Data: GPS coordinates when using the SheSecure SOS feature.</li>
        </ul>

        <h2>3. How We Use Your Data</h2>
        <p>
          We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
        </p>
        <ul>
          <li className="text-white/70">Where we need to perform the contract we are about to enter into or have entered into with you (e.g., booking an appointment).</li>
          <li className="text-white/70">Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
          <li className="text-white/70">To protect your vital interests or those of another person (e.g., SheSecure SOS alerts).</li>
        </ul>

        <h2>4. Data Security</h2>
        <p>
          We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way, altered, or disclosed.
        </p>
      </GlassCard>
    </motion.div>
  );
}

"use client";

import React from "react";
import { GlassCard } from "@/components/ui/GlassCard";

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>
        <p className="text-white/60">Last updated: October 2025</p>
      </div>

      <GlassCard className="p-8 prose prose-invert prose-p:text-white/70 max-w-none" glowOnHover={false}>
        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing and using the Healix Technologies platform, you accept and agree to be bound by the terms and provision of this agreement.
        </p>

        <h2>2. Medical Disclaimer (Healix AI & Care)</h2>
        <p>
          <strong>Healix AI provides smart health guidance only and is not a substitute for professional medical advice, diagnosis, or treatment.</strong> 
          Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. 
          Never disregard professional medical advice or delay in seeking it because of something you have read on this platform.
        </p>

        <h2>3. Emergency Services Disclaimer (SheSecure)</h2>
        <p>
          <strong>The SheSecure system is designed to assist in emergency situations but does not replace official emergency services (such as 911).</strong> 
          Always contact local authorities directly when necessary. We do not guarantee immediate response times or uninterrupted service availability.
        </p>

        <h2>4. User Accounts</h2>
        <p>
          To use certain features of the platform, you must register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
        </p>

        <h2>5. Limitation of Liability</h2>
        <p>
          In no event shall Healix Technologies Pvt Ltd, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
        </p>
      </GlassCard>
    </div>
  );
}

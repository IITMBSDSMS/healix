"use client";

import { useState } from "react";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { login } from "@/app/auth/actions";
import { HealixLogo } from "@/components/ui/HealixLogo";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    const result = await login(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <GlassCard className="w-full max-w-md p-8" glowOnHover={false}>
        <div className="flex justify-center mb-8">
          <div className="shadow-[0_0_24px_rgba(99,102,241,0.25)]">
            <HealixLogo size={64} />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-center mb-6">Sign in to Healix Technologies Pvt Ltd</h2>
        
        <form action={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          <Button type="submit" className="w-full mt-6" isLoading={loading}>
            Sign In
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-white/60">
          Don't have an account?{" "}
          <Link href="/signup" className="text-primary hover:text-primary/80 font-medium">
            Sign up
          </Link>
        </p>
      </GlassCard>
    </div>
  );
}

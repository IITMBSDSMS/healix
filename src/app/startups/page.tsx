import React from 'react';
import { Rocket } from 'lucide-react';

export default function StartupsPage() {
  return (
    <div className="min-h-screen pt-24 px-4 bg-[#eab308] text-black">
      <div className="max-w-4xl mx-auto text-center">
        <Rocket className="h-24 w-24 mx-auto mb-8" />
        <h1 className="text-5xl font-black mb-6 uppercase tracking-widest">Startups</h1>
        <p className="text-lg font-medium">
          Welcome to the Healix Startups ecosystem. We empower cutting-edge health-tech and bio-tech startups with the infrastructure, capital, and mentorship needed to revolutionize global healthcare.
        </p>
      </div>
    </div>
  );
}

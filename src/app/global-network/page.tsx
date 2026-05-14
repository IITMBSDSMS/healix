import React from 'react';
import { Building2 } from 'lucide-react';

export default function GlobalNetworkPage() {
  return (
    <div className="min-h-screen pt-24 px-4 bg-[#eab308] text-black">
      <div className="max-w-4xl mx-auto text-center">
        <Building2 className="h-24 w-24 mx-auto mb-8" />
        <h1 className="text-5xl font-black mb-6 uppercase tracking-widest">Global Network</h1>
        <p className="text-lg font-medium">
          Connect with Healix's worldwide network of healthcare professionals, BioLabs research facilities, and IoT security hubs.
        </p>
      </div>
    </div>
  );
}

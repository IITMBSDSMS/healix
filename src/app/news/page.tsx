import React from 'react';
import { Newspaper } from 'lucide-react';

export default function NewsPage() {
  return (
    <div className="min-h-screen pt-24 px-4 bg-[#f5f5f5] text-black">
      <div className="max-w-4xl mx-auto text-center">
        <Newspaper className="h-24 w-24 mx-auto mb-8" />
        <h1 className="text-5xl font-black mb-6 uppercase tracking-widest">News</h1>
        <p className="text-lg font-medium text-black/70">
          Stay updated with the latest breakthroughs, announcements, and press releases from Healix Technologies and our global partners.
        </p>
      </div>
    </div>
  );
}

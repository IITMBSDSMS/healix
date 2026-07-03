"use client";

import React, { useState, useEffect } from "react";
import { Newspaper, Calendar, ArrowRight, User } from "lucide-react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { createClient } from "@/utils/supabase/client";

export default function NewsPage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadArticles() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("healix_news_articles")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.warn("DB fetch failed, checking localStorage fallback:", error.message);
          throw error;
        }
        
        if (data && data.length > 0) {
          setArticles(data);
        } else {
          loadLocalFallback();
        }
      } catch (err) {
        loadLocalFallback();
      } finally {
        setLoading(false);
      }
    }

    function loadLocalFallback() {
      // Check localStorage first
      if (typeof window !== 'undefined') {
        const local = JSON.parse(localStorage.getItem('healix_news') || '[]');
        if (local.length > 0) {
          setArticles(local);
          return;
        }
      }
      
      // Fallback to static defaults
      const defaultArticles = [
        {
          id: "1",
          title: "Healix Technologies Pvt. Ltd. incorporation process underway.",
          category: "ANNOUNCEMENT",
          date: "June 2026",
          author: "Healix Press Team",
          desc_content: "Healix Technologies is currently undergoing its formal incorporation process. This marks a significant milestone in our journey to build high-reliability clinical data pipelines.",
          image_url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop",
          link_url: "#"
        },
        {
          id: "2",
          title: "BioLabs research and innovation ecosystem under development.",
          category: "RESEARCH",
          date: "June 2026",
          author: "BioLabs Division",
          desc_content: "Our high-performance genomic diagnostic compute cluster and innovation ecosystem are actively under development, setting the foundation for future real-time DNA sequencing workflows.",
          image_url: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?q=80&w=600&auto=format&fit=crop",
          link_url: "#"
        },
        {
          id: "3",
          title: "Applications open for Founding Research Associates and Student Contributors.",
          category: "OPPORTUNITY",
          date: "June 2026",
          author: "Healix HR",
          desc_content: "We are actively seeking talented individuals to join our mission. Applications are now open for Founding Research Associates and Student Contributors across various engineering and medical verticals.",
          image_url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=600&auto=format&fit=crop",
          link_url: "#"
        }
      ];
      setArticles(defaultArticles);
    }

    loadArticles();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-zinc-900 selection:bg-yellow-500/20 py-20">
        <div className="max-w-[94%] mx-auto px-6 sm:px-8">
          {/* Header Skeleton */}
          <div className="mb-16 text-center animate-pulse">
            <div className="h-10 bg-zinc-200 rounded-lg w-64 mx-auto mb-4" />
            <div className="h-4 bg-zinc-200 rounded w-96 mx-auto" />
          </div>

          {/* Featured Article Skeleton */}
          <div className="mb-16 animate-pulse">
            <div className="border border-zinc-200 rounded-2xl bg-zinc-50 h-[380px] grid md:grid-cols-12 gap-0 overflow-hidden">
              <div className="md:col-span-7 bg-zinc-200 h-full" />
              <div className="md:col-span-5 p-8 flex flex-col justify-between h-full bg-white">
                <div className="space-y-4">
                  <div className="h-4 bg-zinc-200 rounded w-32" />
                  <div className="h-8 bg-zinc-200 rounded w-full" />
                  <div className="h-8 bg-zinc-250 rounded w-3/4" />
                  <div className="h-16 bg-zinc-200 rounded w-full" />
                </div>
                <div className="h-10 bg-zinc-200 rounded w-full mt-6" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "numberOfItems": articles.length,
    "itemListElement": articles.map((article, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "NewsArticle",
        "headline": article.title,
        "description": article.desc_content,
        "image": article.image_url,
        "datePublished": article.created_at || "2026-06-27T19:07:51Z",
        "author": {
          "@type": "Person",
          "name": article.author
        },
        "publisher": {
          "@type": "Organization",
          "name": "Healix Technologies",
          "logo": {
            "@type": "ImageObject",
            "url": "https://www.healix-technologies.com/icon.png"
          }
        },
        "url": article.link_url && article.link_url !== "#" ? article.link_url : `https://www.healix-technologies.com/news#${article.id}`
      }
    }))
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900 selection:bg-yellow-500/20 py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-[94%] mx-auto px-6 sm:px-8">
        
        {/* Header section - Removed "Press Center" badge */}
        <div className="mb-16 text-center">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 font-mono uppercase text-zinc-950">Latest Announcements</h1>
          <p className="text-zinc-650 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            Stay updated with the latest breakthroughs, announcements, and press releases from Healix Technologies and our global partners.
          </p>
        </div>

        {articles.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-zinc-200 rounded-2xl bg-zinc-50">
            <Newspaper className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
            <h2 className="text-lg font-bold font-mono uppercase text-zinc-700">No news articles found</h2>
            <p className="text-sm text-zinc-500 mt-1 max-w-md mx-auto">Please check back later or update news articles from the admin panel.</p>
          </div>
        ) : (
          <>
            {/* Featured Article */}
            <div className="mb-16">
              <GlassCard variant="light" className="overflow-hidden border border-zinc-200 rounded-2xl shadow-sm bg-white hover:shadow-md transition-shadow group p-0">
                <div className="grid md:grid-cols-12 gap-0 w-full h-full">
                  <div className="md:col-span-7 relative aspect-video md:aspect-auto h-full min-h-[300px] overflow-hidden">
                    <img 
                      src={articles[0].image_url} 
                      alt={articles[0].title}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-750"
                    />
                    <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-black border border-zinc-700 text-white rounded text-[10px] font-bold font-mono tracking-wider">
                      FEATURED
                    </div>
                  </div>
                  
                  <div className="md:col-span-5 p-8 flex flex-col justify-between h-full">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 text-[10px] font-mono text-zinc-500 uppercase tracking-wider font-bold">
                        <span className="text-[#ea580c]">{articles[0].category}</span>
                        <span>•</span>
                        <span>{articles[0].date}</span>
                      </div>
                      
                      <h2 className="text-xl md:text-2xl font-black font-mono tracking-tight text-zinc-950 uppercase leading-snug group-hover:text-[#ea580c] transition-colors">
                        {articles[0].title}
                      </h2>
                      
                      <p className="text-xs md:text-sm text-zinc-600 leading-relaxed line-clamp-4">
                        {articles[0].desc_content}
                      </p>
                    </div>

                    <div className="pt-6 border-t border-zinc-150 mt-6 flex justify-between items-center">
                      <span className="text-[10px] text-zinc-500 font-mono flex items-center gap-1.5 font-bold uppercase">
                        <User className="w-3.5 h-3.5 text-[#ea580c]" /> {articles[0].author}
                      </span>
                      
                      <a 
                        href={articles[0].link_url || "#"} 
                        target={articles[0].link_url && articles[0].link_url !== "#" ? "_blank" : undefined}
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-[#ea580c] font-mono uppercase tracking-wider flex items-center gap-1 hover:underline transition-all cursor-pointer shrink-0"
                      >
                        Read Article <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </div>

            {/* Other articles */}
            {articles.length > 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {articles.slice(1).map(article => (
                  <GlassCard key={article.id} variant="light" className="overflow-hidden border border-zinc-200 rounded-2xl shadow-sm bg-white hover:shadow-md transition-shadow group flex flex-col justify-between h-full">
                    <div>
                      <div className="relative aspect-video w-full overflow-hidden border-b border-zinc-200 bg-zinc-50">
                        <img 
                          src={article.image_url} 
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-750"
                        />
                        <div className="absolute top-4 left-4 z-10 px-2 py-0.5 bg-[#ea580c] border border-orange-600 text-white rounded text-[9px] font-bold font-mono tracking-wider">
                          {article.category}
                        </div>
                      </div>
                      
                      <div className="p-6 space-y-3">
                        <span className="text-[9px] font-mono text-zinc-500 tracking-wider font-bold">{article.date}</span>
                        <h3 className="text-base font-bold font-mono tracking-tight text-zinc-950 uppercase leading-snug group-hover:text-[#ea580c] transition-colors line-clamp-2">
                          {article.title}
                        </h3>
                        <p className="text-xs text-zinc-600 leading-relaxed line-clamp-3">
                          {article.desc_content}
                        </p>
                      </div>
                    </div>

                    <div className="px-6 pb-6 pt-4 border-t border-zinc-100 flex justify-between items-center">
                      <span className="text-[9px] text-zinc-500 font-mono flex items-center gap-1 font-bold uppercase">
                        <User className="w-3 h-3 text-[#ea580c]" /> {article.author}
                      </span>
                      
                      <a 
                        href={article.link_url || "#"} 
                        target={article.link_url && article.link_url !== "#" ? "_blank" : undefined}
                        rel="noopener noreferrer"
                        className="text-[10px] font-bold text-[#ea580c] font-mono uppercase tracking-wider flex items-center gap-0.5 hover:underline transition-all cursor-pointer shrink-0"
                      >
                        Read More <ArrowRight className="w-3 h-3" />
                      </a>
                    </div>
                  </GlassCard>
                ))}
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}

import { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://healix-nu.vercel.app";
const now = new Date();

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    // Core pages — highest priority
    { url: siteUrl,                            lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${siteUrl}/shesecure`,             lastModified: now, changeFrequency: "weekly",  priority: 0.95 },
    { url: `${siteUrl}/ai-check`,              lastModified: now, changeFrequency: "weekly",  priority: 0.95 },
    { url: `${siteUrl}/academy`,               lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${siteUrl}/biolabs`,               lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${siteUrl}/care`,                  lastModified: now, changeFrequency: "monthly", priority: 0.8 },

    // Academy sub-pages
    { url: `${siteUrl}/academy/mentors`,       lastModified: now, changeFrequency: "monthly", priority: 0.75 },
    { url: `${siteUrl}/register`,              lastModified: now, changeFrequency: "monthly", priority: 0.75 },

    // Company pages
    { url: `${siteUrl}/about`,                 lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/contact`,               lastModified: now, changeFrequency: "monthly", priority: 0.65 },
    { url: `${siteUrl}/news`,                  lastModified: now, changeFrequency: "weekly",  priority: 0.6 },
    { url: `${siteUrl}/global-network`,        lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/startups`,              lastModified: now, changeFrequency: "monthly", priority: 0.6 },

    // Legal
    { url: `${siteUrl}/privacy`,               lastModified: now, changeFrequency: "yearly",  priority: 0.4 },
    { url: `${siteUrl}/terms`,                 lastModified: now, changeFrequency: "yearly",  priority: 0.4 },
  ];
}

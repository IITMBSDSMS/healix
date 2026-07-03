import { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.healix-technologies.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // Allow all major crawlers full access to public content
        userAgent: "*",
        allow: [
          "/",
          "/about",
          "/shesecure",
          "/academy",
          "/biolabs",
          "/contact",
          "/news",
          "/events",
          "/our-members",
          "/startups",
          "/genomics-research",
          "/labs",
          "/suraksha",
          "/privacy",
          "/terms",
          "/register",
        ],
        disallow: [
          "/admin/",
          "/api/",
          "/auth/",
          "/dashboard/",
          "/payment/",
          "/biolabs/dashboard",
          "/suraksha/start",
          "/verify/",
          "/signup",
          "/login",
        ],
      },
      {
        // Slow down aggressive crawlers
        userAgent: ["AhrefsBot", "SemrushBot", "MJ12bot"],
        crawlDelay: 10,
        allow: "/",
        disallow: ["/admin/", "/api/", "/auth/", "/dashboard/", "/payment/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}

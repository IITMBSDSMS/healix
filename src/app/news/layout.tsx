import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.healix-technologies.com";

export const metadata: Metadata = {
  title: "Healix News & Updates — Latest in Healthcare AI & Innovation",
  description:
    "Stay updated with the latest news, press releases, research publications, and announcements from Healix Technologies — India's leading AI healthcare and women's safety technology company.",
  keywords: [
    "Healix Technologies news",
    "healthcare AI news India",
    "Healix press release",
    "health tech startup news India",
    "Healix announcements",
    "AI healthcare India updates",
    "women safety tech news India",
    "BioLabs research news India",
    "Healix updates 2024",
  ],
  alternates: {
    canonical: `${siteUrl}/news`,
    languages: { "en-IN": `${siteUrl}/news` },
  },
  openGraph: {
    type: "website",
    url: `${siteUrl}/news`,
    locale: "en_IN",
    siteName: "Healix Technologies",
    title: "Healix News & Updates — Latest in Healthcare AI & Innovation",
    description:
      "Latest news, press releases, and research from Healix Technologies — India's AI healthcare and women's safety innovator.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Healix Technologies News" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Healix News & Updates",
    description: "Latest news, press releases, and research from India's AI healthcare innovator.",
    images: ["/og-image.png"],
    creator: "@HealixTechqouc",
  },
};

export default function NewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

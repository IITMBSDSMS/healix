import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.healix-technologies.com";

export const metadata: Metadata = {
  title: "Healix Startup Hub — India Health-Tech Startup Ecosystem",
  description:
    "Explore startups and ventures backed by the Healix Technologies ecosystem. Discover India's emerging health-tech innovators building the future of care, diagnostics, safety, and biomedical research.",
  keywords: [
    "Healix startup hub",
    "health tech startups India",
    "healthcare startup India 2024",
    "medical startup India",
    "health innovation India",
    "biomedical startup India",
    "AI health startup India",
    "women safety startup India",
    "Healix ecosystem startups",
    "digital health startup incubator India",
  ],
  alternates: {
    canonical: `${siteUrl}/startups`,
    languages: { "en-IN": `${siteUrl}/startups` },
  },
  openGraph: {
    type: "website",
    url: `${siteUrl}/startups`,
    locale: "en_IN",
    siteName: "Healix Technologies",
    title: "Healix Startup Hub — India Health-Tech Ecosystem",
    description:
      "Discover India's emerging health-tech startups backed by Healix Technologies — building the future of care, diagnostics, safety, and research.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Healix Startup Hub — India" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Healix Startup Hub — India Health-Tech Ecosystem",
    description: "Emerging health-tech ventures in the Healix ecosystem — AI, genomics, safety, and care.",
    images: ["/og-image.png"],
    creator: "@HealixTechqouc",
  },
};

export default function StartupsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

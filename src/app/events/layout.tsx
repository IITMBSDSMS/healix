import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.healix-technologies.com";

export const metadata: Metadata = {
  title: "Healix Events — Upcoming Seminars, Workshops & Healthcare Innovation Events",
  description:
    "Join upcoming Healix BioLabs seminars, healthcare AI workshops, and innovation events across India. Register now to connect with researchers, clinicians, and engineers shaping the future of healthcare.",
  keywords: [
    "Healix events India",
    "healthcare seminar India",
    "biotech workshop India",
    "Healix BioLabs seminar",
    "healthcare innovation event India 2024",
    "health tech conference India",
    "AI healthcare workshop India",
    "genomics seminar India",
    "Healix Academy event",
    "medical innovation summit India",
  ],
  alternates: {
    canonical: `${siteUrl}/events`,
    languages: { "en-IN": `${siteUrl}/events` },
  },
  openGraph: {
    type: "website",
    url: `${siteUrl}/events`,
    locale: "en_IN",
    siteName: "Healix Technologies",
    title: "Healix Events — Upcoming Seminars & Healthcare Workshops India",
    description:
      "Join Healix BioLabs seminars, AI workshops, and healthcare innovation events across India. Register to attend.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Healix Events — Healthcare Workshops India" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Healix Events — Upcoming Healthcare Seminars & Workshops India",
    description: "BioLabs seminars, AI workshops & innovation events. Join India's growing health-tech community.",
    images: ["/og-image.png"],
    creator: "@HealixTechqouc",
  },
};

const jsonLdEvents = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": `${siteUrl}/events`,
  name: "Healix Events — Upcoming Seminars & Workshops",
  url: `${siteUrl}/events`,
  description: "Upcoming BioLabs seminars, AI workshops, and healthcare innovation events by Healix Technologies, India.",
  publisher: {
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
  },
};

export default function EventsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdEvents) }}
      />
      {children}
    </>
  );
}

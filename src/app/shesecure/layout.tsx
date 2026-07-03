import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.healix-technologies.com";

export const metadata: Metadata = {
  title: "SheSecure — Real-Time Women's Safety App India | GPS Tracking & SOS Alerts",
  description:
    "SheSecure by Healix Technologies is India's most advanced real-time women's safety platform. Scan a QR code to share live GPS location, trigger instant SOS alerts, and activate IoT safety failsafes. Free to use.",
  keywords: [
    "SheSecure",
    "women safety app India",
    "real-time GPS tracking women India",
    "SOS alert app India",
    "women travel safety app",
    "QR code safety tracking",
    "live location sharing safety",
    "personal safety app women",
    "IoT safety device India",
    "emergency alert app India",
    "women protection app India",
    "Healix SheSecure",
    "self-defense app India",
    "safe travel app women India",
  ],
  alternates: {
    canonical: `${siteUrl}/shesecure`,
    languages: { "en-IN": `${siteUrl}/shesecure` },
  },
  openGraph: {
    type: "website",
    url: `${siteUrl}/shesecure`,
    locale: "en_IN",
    siteName: "Healix Technologies",
    title: "SheSecure — Real-Time Women's Safety App India",
    description:
      "Scan QR, share live GPS, trigger SOS. SheSecure by Healix Technologies is India's most advanced women's travel safety platform.",
    images: [
      {
        url: "/shesecure-hero.png",
        width: 1200,
        height: 630,
        alt: "SheSecure — Women's Safety App by Healix Technologies",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SheSecure — Real-Time Women's Safety App India",
    description:
      "Scan QR, share live GPS, trigger SOS instantly. India's most advanced women's safety platform by Healix Technologies.",
    images: ["/shesecure-hero.png"],
    creator: "@HealixTechqouc",
  },
};

const jsonLdSheSecure = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "@id": `${siteUrl}/shesecure#app`,
  name: "SheSecure",
  alternateName: "SheSecure by Healix Technologies",
  applicationCategory: "HealthApplication",
  applicationSubCategory: "Personal Safety",
  operatingSystem: "Android, iOS, Web",
  url: `${siteUrl}/shesecure`,
  description:
    "SheSecure is India's real-time women's travel safety platform. Scan a QR code to share live GPS location, trigger SOS alerts, and activate IoT failsafes. Built by Healix Technologies.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "INR",
    availability: "https://schema.org/InStock",
  },
  publisher: {
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: "Healix Technologies",
  },
  screenshot: `${siteUrl}/shesecure-hero.png`,
  featureList: [
    "Real-time GPS location sharing",
    "Emergency SOS alerts",
    "QR code-based trip tracking",
    "IoT safety failsafe",
    "Instant family notifications",
    "Travel route monitoring",
  ],
  inLanguage: "en-IN",
};

const jsonLdFAQ = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is SheSecure?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "SheSecure is India's most advanced real-time women's travel safety platform by Healix Technologies. It allows women to share live GPS location with family, trigger SOS alerts, and activate IoT safety failsafes by scanning a QR code.",
      },
    },
    {
      "@type": "Question",
      name: "How does SheSecure work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A woman scans a QR code before her trip. This activates live GPS tracking visible to her trusted contacts. If she doesn't check in at a set time, automatic SOS alerts are sent to emergency contacts.",
      },
    },
    {
      "@type": "Question",
      name: "Is SheSecure free to use?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, SheSecure by Healix Technologies is free to use for women's safety tracking.",
      },
    },
    {
      "@type": "Question",
      name: "Is SheSecure available in India?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, SheSecure is designed and deployed specifically for women's safety across India, with IoT device support and 24/7 real-time GPS monitoring.",
      },
    },
  ],
};

export default function SheSecureLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSheSecure) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFAQ) }}
      />
      {children}
    </>
  );
}

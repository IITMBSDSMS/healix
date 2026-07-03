import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SplashScreen } from "@/components/layout/SplashScreen";
import { Tour } from "@/components/layout/Tour";
import ErrorBoundary from "@/components/ui/ErrorBoundary";

const geistSans = { variable: "--font-geist-sans" };
const geistMono = { variable: "--font-geist-mono" };

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.healix-technologies.com";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
  minimumScale: 1.0,
  maximumScale: 5.0,
  themeColor: "#ea580c",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Healix Technologies — AI Healthcare, Women's Safety & Engineering Academy",
    template: "%s | Healix Technologies",
  },
  description:
    "Healix Technologies is India's most advanced health & safety platform — AI-powered diagnostics, SheSecure real-time GPS safety for women, BioLabs genomics research, and Healix Academy elite engineering programs. Founded 2024.",
  keywords: [
    // Brand
    "Healix Technologies",
    "Healix",
    "quick healix",
    "healix india",
    "healix healthtech",
    // SheSecure / Women Safety
    "SheSecure women safety app India",
    "women safety app India",
    "real-time GPS safety women",
    "emergency SOS alert India",
    "live location tracking women",
    "women safety IoT device",
    "QR code tracking safety",
    "Project Suraksha vehicle tracking",
    "IoT safety system India",
    "personal safety app India",
    "SOS button app",
    // AI / Healthcare
    "AI symptom checker India",
    "AI healthcare platform India",
    "AI diagnostics India free",
    "online symptom analysis",
    "FHIR health data platform",
    "clinical AI India",
    "health data infrastructure",
    "digital health startup India",
    "telemedicine AI",
    "health intelligence platform",
    // BioLabs / Genomics
    "BioLabs genomics research India",
    "genomics research platform",
    "BRCA1 TP53 mutation analysis",
    "bioinformatics cloud India",
    "clinical genomics startup",
    "DNA sequencing analysis online",
    // Academy
    "Healix Academy engineering courses",
    "online engineering mentorship India",
    "healthcare engineering course India",
    "biotech course India",
    "AI course India online",
    "elite engineering academy India",
    // Global
    "health tech startup India 2024",
    "India healthcare innovation",
    "health AI company India",
    "health safety platform India",
  ],
  authors: [{ name: "Healix Technologies Pvt Ltd", url: siteUrl }],
  creator: "Healix Technologies Pvt Ltd",
  publisher: "Healix Technologies Pvt Ltd",
  category: "Healthcare Technology",
  applicationName: "Healix",
  generator: "Next.js",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    siteName: "Healix Technologies",
    title: "Healix Technologies — AI Healthcare & Women's Safety Platform",
    description:
      "India's most advanced women's travel safety system & AI health platform. SheSecure GPS tracking, BioLabs genomics, Healix Academy, and AI diagnostics — all in one ecosystem.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Healix Technologies — AI Healthcare & Women's Safety Platform",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Healix Technologies — AI Healthcare & Women's Safety Platform",
    description:
      "SheSecure GPS tracking, AI diagnostics, BioLabs genomics & Healix Academy. India's most advanced health & safety ecosystem.",
    images: ["/og-image.png"],
    creator: "@HealixTechqouc",
    site: "@HealixTechqouc",
  },
  alternates: {
    canonical: siteUrl,
    languages: {
      "en-IN": siteUrl,
    },
  },
  icons: {
    icon: [
      { url: "/favicon-32x32.png", type: "image/png" },
      { url: "/favicon.ico", type: "image/x-icon" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  verification: {
    // google: "ADD_YOUR_GOOGLE_SEARCH_CONSOLE_TOKEN_HERE",
    // yandex: "ADD_YOUR_YANDEX_TOKEN_HERE",
  },
  other: {
    "theme-color": "#ea580c",
    "color-scheme": "light",
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "Healix",
    "msapplication-TileColor": "#ea580c",
    "msapplication-TileImage": "/apple-touch-icon.png",
    // Geographic meta
    "geo.region": "IN",
    "geo.country": "IN",
    "geo.placename": "India",
    // Content language
    "content-language": "en-IN",
    // Revisit for bots
    revisit: "7 days",
  },
};

// ── JSON-LD: Organization ──────────────────────────────────────────────────
const jsonLdOrg = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${siteUrl}/#organization`,
  name: "Healix Technologies",
  legalName: "Healix Technologies Pvt Ltd",
  url: siteUrl,
  logo: {
    "@type": "ImageObject",
    url: `${siteUrl}/official-logo-web.png`,
    width: 512,
    height: 512,
  },
  image: `${siteUrl}/og-image.png`,
  description:
    "An intelligent human-care platform combining AI-powered diagnostics, BioLabs genomics research, SheSecure women's safety systems, Project Suraksha vehicle tracking, and Healix Academy elite engineering programs.",
  foundingDate: "2024",
  foundingLocation: {
    "@type": "Place",
    name: "India",
    address: {
      "@type": "PostalAddress",
      addressCountry: "IN",
    },
  },
  areaServed: "IN",
  sameAs: [
    "https://x.com/HealixTechqouc",
    "https://twitter.com/HealixTechqouc",
    "https://www.linkedin.com/company/quick-healix/",
    "https://www.instagram.com/healix_technologies",
    "https://medium.com/@bv567992/building-the-future-of-healthcare-the-vision-behind-healix-technologies-9a545aa5ce64",
  ],
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "Customer Support",
      email: "office@healix-technologies.com",
      availableLanguage: ["English", "Hindi"],
    },
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Healix Products & Services",
    itemListElement: [
      { "@type": "Offer", itemOffered: { "@type": "SoftwareApplication", name: "SheSecure" } },
      { "@type": "Offer", itemOffered: { "@type": "SoftwareApplication", name: "Healix AI Check" } },
      { "@type": "Offer", itemOffered: { "@type": "EducationalOrganization", name: "Healix Academy" } },
    ],
  },
};

// ── JSON-LD: WebSite with SearchAction ────────────────────────────────────
const jsonLdWebSite = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteUrl}/#website`,
  name: "Healix Technologies",
  url: siteUrl,
  publisher: { "@id": `${siteUrl}/#organization` },
  inLanguage: "en-IN",
  potentialAction: {
    "@type": "SearchAction",
    target: { "@type": "EntryPoint", urlTemplate: `${siteUrl}/ai-check?q={search_term_string}` },
    "query-input": "required name=search_term_string",
  },
};

// ── JSON-LD: SoftwareApplication — SheSecure ─────────────────────────────
const jsonLdSheSecure = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "@id": `${siteUrl}/shesecure#app`,
  name: "SheSecure",
  applicationCategory: "HealthApplication",
  applicationSubCategory: "Safety",
  operatingSystem: "Android, iOS, Web",
  url: `${siteUrl}/shesecure`,
  description:
    "SheSecure is India's real-time women's travel safety platform by Healix Technologies. Scan a QR code to share live GPS location, trigger SOS alerts, and activate IoT safety failsafes.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "INR",
  },
  publisher: { "@id": `${siteUrl}/#organization` },
  screenshot: `${siteUrl}/shesecure-hero.png`,
};

// ── JSON-LD: Founder / Person ─────────────────────────────────────────────
const jsonLdFounder = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${siteUrl}/about#founder`,
  name: "Avnish Verma",
  jobTitle: "Founder & CEO",
  worksFor: { "@id": `${siteUrl}/#organization` },
  sameAs: [
    "https://www.linkedin.com/company/quick-healix/",
    "https://medium.com/@bv567992",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN" className="light" suppressHydrationWarning>
      <head>
        {/* Preconnect to external origins for speed */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        {/* Preconnect to Supabase for faster API + storage responses */}
        <link rel="preconnect" href="https://chdujpvwawaqgaenrgms.supabase.co" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://chdujpvwawaqgaenrgms.supabase.co" />

        {/* rel="me" — social profile ownership verification for Knowledge Graph */}
        <link rel="me" href="https://x.com/HealixTechqouc" />
        <link rel="me" href="https://twitter.com/HealixTechqouc" />
        <link rel="me" href="https://www.linkedin.com/company/quick-healix/" />
        <link rel="me" href="https://www.instagram.com/healix_technologies" />
        <link rel="me" href="https://medium.com/@bv567992" />

        {/* hreflang — English targeting India */}
        <link rel="alternate" hrefLang="en-IN" href={siteUrl} />
        <link rel="alternate" hrefLang="x-default" href={siteUrl} />

        {/* Structured Data — Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrg) }}
        />
        {/* Structured Data — WebSite + SearchAction */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebSite) }}
        />
        {/* Structured Data — SoftwareApplication (SheSecure) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSheSecure) }}
        />
        {/* Structured Data — Founder Person */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFounder) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-white text-zinc-900 overflow-x-hidden`}
      >
        <SplashScreen />
        <Tour />
        <Navbar />
        <main className="flex-1 w-full" id="main-content">
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </main>
        <Footer />
      </body>
    </html>
  );
}

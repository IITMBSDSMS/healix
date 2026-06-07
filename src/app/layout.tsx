import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SplashScreen } from "@/components/layout/SplashScreen";
import ErrorBoundary from "@/components/ui/ErrorBoundary";

const geistSans = { variable: "--font-geist-sans" };
const geistMono = { variable: "--font-geist-mono" };

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://healix-nu.vercel.app";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
  minimumScale: 1.0,
  maximumScale: 5.0,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Healix Technologies — AI Healthcare, Women's Safety & Engineering Academy",
    template: "%s | Healix Technologies",
  },
  description:
    "Healix Technologies is India's most advanced health & safety platform — AI-powered diagnostics, SheSecure real-time GPS safety for women, BioLabs genomics research, and Healix Academy elite engineering programs.",
  keywords: [
    "Healix Technologies",
    "SheSecure women safety India",
    "Project Suraksha QR tracking",
    "AI symptom checker India",
    "women safety app India",
    "Healix Academy engineering courses",
    "BioLabs genomics research",
    "AI healthcare platform",
    "emergency SOS alert",
    "live GPS tracking India",
    "online engineering mentorship",
    "IoT safety system",
    "healix",
    "healix nu",
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
      "India's most advanced women's travel safety system. Scan QR, start tracking, stay protected. Powered by live GPS, IoT failsafe, and instant SOS alerts.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Healix Technologies — SheSecure Safety Platform",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Healix Technologies — AI Healthcare & Women's Safety Platform",
    description:
      "Scan QR, start tracking, stay protected. SheSecure by Healix Technologies.",
    images: ["/og-image.png"],
    creator: "@HealixTechqouc",
    site: "@HealixTechqouc",
  },
  alternates: {
    canonical: siteUrl,
  },
  icons: {
    icon: [
      { url: "/favicon-32x32.png", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  verification: {
    // google: "your-google-token",
  },
  other: {
    "theme-color": "#ffffff",
    "color-scheme": "light",
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "Healix",
    "msapplication-TileColor": "#ffffff",
  },
};

const jsonLdOrg = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Healix Technologies Pvt Ltd",
  url: siteUrl,
  logo: `${siteUrl}/logo.jpg`,
  description:
    "An intelligent human-care platform combining AI healthcare, BioLabs research, and SheSecure women's safety systems.",
  sameAs: [
    "https://x.com/HealixTechqouc",
    "https://www.linkedin.com/company/quick-healix/",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "Customer Support",
    email: "office@healix-technologies.com",
    availableLanguage: ["English", "Hindi"],
  },
  founder: {
    "@type": "Person",
    name: "Healix Technologies Team",
  },
  foundingLocation: {
    "@type": "Place",
    name: "India",
  },
};

const jsonLdWebSite = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Healix Technologies",
  url: siteUrl,
  potentialAction: {
    "@type": "SearchAction",
    target: { "@type": "EntryPoint", urlTemplate: `${siteUrl}/ai-check?q={search_term_string}` },
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <head>
        {/* Preconnect to external origins for speed */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />

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
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-white text-zinc-900 overflow-x-hidden`}
      >
        <SplashScreen />
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

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SplashScreen } from "@/components/layout/SplashScreen";
import ErrorBoundary from "@/components/ui/ErrorBoundary";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://healix.tech";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Healix Technologies — AI Healthcare, Safety & BioLabs Platform",
    template: "%s | Healix Technologies",
  },
  description:
    "Healix Technologies is an intelligent human-care platform combining AI-powered symptom checking, BioLabs research, and SheSecure — India's most advanced women's travel safety system with Project Suraksha QR-based live tracking.",
  keywords: [
    "Healix Technologies",
    "SheSecure",
    "Project Suraksha",
    "women safety India",
    "QR travel tracking",
    "AI healthcare",
    "symptom checker",
    "BioLabs research",
    "live GPS tracking",
    "emergency SOS alert",
    "women safety app India",
  ],
  authors: [{ name: "Healix Technologies Pvt Ltd", url: siteUrl }],
  creator: "Healix Technologies Pvt Ltd",
  publisher: "Healix Technologies Pvt Ltd",
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
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Healix Technologies — AI Healthcare & Women's Safety Platform",
    description:
      "Scan QR, start tracking, stay protected. SheSecure by Healix Technologies.",
    images: ["/og-image.png"],
    creator: "@HealixTech",
  },
  verification: {
    // Add your Google / Bing verification tokens here when deploying
    // google: "your-google-token",
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* Structured Data for Google — Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Healix Technologies Pvt Ltd",
              url: siteUrl,
              logo: `${siteUrl}/logo.jpg`,
              description:
                "An intelligent human-care platform combining AI healthcare, BioLabs research, and SheSecure women's safety systems.",
              sameAs: [
                "https://twitter.com/HealixTech",
                "https://www.linkedin.com/company/quick-healix/",
              ],
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "Customer Support",
                email: "healixtechnologies@gmail.com",
              },
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-[#050505] text-[#ededed] overflow-x-hidden`}
      >
        <SplashScreen />
        <Navbar />
        <main className="flex-1 w-full">
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </main>
        <Footer />
      </body>
    </html>
  );
}

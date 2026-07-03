import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.healix-technologies.com";

export const metadata: Metadata = {
  title: "Our Members: Campus Ambassadors & Healthcare Network | Healix",
  description:
    "Join the Healix Technologies Global Network. Connect with our campus ambassadors at IIT Bombay, IIT Delhi, and IIT Madras, world-class healthcare professionals, and corporate innovation partners driving the future of diagnostic care.",
  keywords: [
    "Healix Members",
    "Healix Campus Ambassador",
    "Healix Healthcare",
    "Campus Ambassador Program",
    "Healthcare Professional Network",
    "IIT Bombay Ambassador",
    "IIT Delhi Ambassador",
    "IIT Madras Ambassador",
    "Tata Group Partnerships",
    "Healix Technologies",
    "Medical IoT Ambassadors",
    "Student Leadership Program",
    "Clinical Research Network",
    "IoT Diagnostic Support",
    "IIT Innovation Program",
    "Apply Campus Ambassador",
    "Healix Careers",
    "Health-tech Collaborations"
  ],
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
  alternates: {
    canonical: `${siteUrl}/our-members`,
    languages: { "en-IN": `${siteUrl}/our-members` },
  },
  openGraph: {
    type: "website",
    url: `${siteUrl}/our-members`,
    locale: "en_IN",
    siteName: "Healix Technologies",
    title: "Our Members: Campus Ambassadors & Healthcare Network | Healix",
    description:
      "Join the Healix Technologies Global Network. Connect with our campus ambassadors at IIT Bombay, IIT Delhi, and IIT Madras, world-class healthcare professionals, and corporate innovation partners driving the future of diagnostic care.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Healix Technologies Members: Campus Ambassadors & Healthcare Professionals" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Our Members: Campus Ambassadors & Healthcare Network | Healix",
    description: "Meet our outstanding Campus Ambassadors at IITs, healthcare professionals, and research partners driving the future of medicine.",
    images: ["/og-image.png"],
  },
};

export default function MembersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

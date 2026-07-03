import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.healix-technologies.com";

export const metadata: Metadata = {
  title: "Lupens & Company — Premium Healthcare Strategy & Advisory India",
  description:
    "Lupens & Company (Lupens Consultants India) is a premium healthcare advisory, research, and strategy firm. We partner with hospitals, startups, and policymakers to deliver growth strategies, AI & digital health solutions, and evidence-based innovation.",
  keywords: [
    "Lupens & Company",
    "Lupens Consultants India",
    "Lupens India",
    "Healthcare consulting India",
    "Healthcare strategy and advisory",
    "Hospital growth strategy India",
    "Biomedical research consulting",
    "AI and digital health solutions India",
    "Healthcare transformation and impact",
    "Public health advisory India",
  ],
  alternates: {
    canonical: `${siteUrl}/care`,
    languages: { "en-IN": `${siteUrl}/care` },
  },
  openGraph: {
    type: "website",
    url: `${siteUrl}/care`,
    locale: "en_IN",
    siteName: "Lupens & Company",
    title: "Lupens & Company — Premium Healthcare Strategy & Advisory India",
    description:
      "Premium healthcare consulting, AI & digital health solutions, and evidence-based research advisory in India. Partnering for sustainable growth.",
    images: [{ url: "/lupens/team_bright.png", width: 1200, height: 630, alt: "Lupens & Company Healthcare Consulting" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lupens & Company — Premium Healthcare Strategy & Advisory India",
    description: "Healthcare consulting, AI & digital health solutions, and research advisory in India. Delivering clarity, driving impact.",
    images: ["/lupens/team_bright.png"],
    creator: "@LupensCo",
  },
};

export default function CareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

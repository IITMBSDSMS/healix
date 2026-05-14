import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Healix Academy — Elite Engineering Programs",
  description:
    "Join Healix Academy and get 1:1 mentorship from elite engineers building production-grade distributed systems, AI pipelines, and IoT platforms. Limited seats — apply now.",
  keywords: [
    "Healix Academy",
    "engineering courses India",
    "1:1 mentorship engineering",
    "AI engineering program",
    "IoT course India",
    "distributed systems course",
    "production engineering training",
    "elite engineering fellowship",
  ],
  openGraph: {
    title: "Healix Academy — Elite Engineering Programs",
    description: "1:1 mentorship from engineers at the frontier of AI, IoT, and distributed systems.",
    url: "https://healix-nu.vercel.app/academy",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Healix Academy — Elite Engineering Programs",
    description: "1:1 mentorship from engineers at the frontier of AI, IoT, and distributed systems.",
  },
};

export default function AcademyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Avennix Care — Advancing Human Health on Earth and Beyond",
  description:
    "Avennix Care is at the forefront of biotechnology, artificial intelligence, and space medicine. Developing next-generation medical systems and autonomous health technologies to sustain human exploration beyond Earth.",
  keywords: [
    "Avennix Care",
    "Space Medicine",
    "Biotechnology",
    "Artificial Intelligence in Healthcare",
    "Space Biology",
    "Autonomous Health Technologies",
    "Human Performance Systems",
    "Bio-intelligence",
    "Future of Medicine",
    "Healix Technologies Care",
  ],
  openGraph: {
    title: "Avennix Care — Advancing Human Health on Earth and Beyond",
    description: "Developing next-generation medical systems at the intersection of biotechnology, artificial intelligence, and space medicine.",
    url: "https://healix-nu.vercel.app/care",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Avennix Care — Advancing Human Health on Earth and Beyond",
    description: "Developing next-generation medical systems at the intersection of biotechnology, artificial intelligence, and space medicine.",
    images: ["/og-image.png"],
  },
};

export default function CareLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Healix BioLabs — Genomics & AI Research",
  description:
    "Explore Healix BioLabs: world-class genomic sequencing, AI diagnostic modelling, and HPC research. Upload your genomic dataset for instant AI-powered malignancy analysis.",
  keywords: [
    "Healix BioLabs",
    "genomics research India",
    "AI cancer detection",
    "malignancy prediction AI",
    "genomic sequencing platform",
    "bioinformatics",
    "HPC research platform",
  ],
  openGraph: {
    title: "Healix BioLabs — Genomics & AI Research",
    description: "Upload your genomic dataset for instant AI-powered malignancy analysis.",
    url: "https://healix-nu.vercel.app/biolabs",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

export default function BiolabsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

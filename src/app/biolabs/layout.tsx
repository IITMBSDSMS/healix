import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.healix-technologies.com";

export const metadata: Metadata = {
  title: "Healix BioLabs — Genomics Research & Clinical Bioinformatics India",
  description:
    "Healix BioLabs is India's advanced genomics research and clinical bioinformatics platform. Analyze BRCA1, TP53, and other mutations using our cloud-native sequencing pipeline. Join upcoming research seminars and events.",
  keywords: [
    "Healix BioLabs",
    "genomics research India",
    "bioinformatics platform India",
    "BRCA1 mutation analysis India",
    "TP53 genomic research",
    "clinical genomics India",
    "DNA sequencing analysis online India",
    "cloud genomics pipeline India",
    "genomics startup India",
    "genomics research platform India",
    "cancer genomics India",
    "precision medicine India",
    "biomedical research India",
    "next generation sequencing India",
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
    canonical: `${siteUrl}/biolabs`,
    languages: { "en-IN": `${siteUrl}/biolabs` },
  },
  openGraph: {
    type: "website",
    url: `${siteUrl}/biolabs`,
    locale: "en_IN",
    siteName: "Healix Technologies",
    title: "Healix BioLabs — Genomics Research & Clinical Bioinformatics India",
    description:
      "Advanced genomics research and bioinformatics. Analyze BRCA1, TP53 mutations with Healix's cloud-native pipeline. India's clinical genomics platform.",
    images: [
      {
        url: "/biolabs-logo.png",
        width: 1200,
        height: 630,
        alt: "Healix BioLabs — Genomics Research Platform India",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Healix BioLabs — Genomics Research & Bioinformatics India",
    description:
      "Cloud-native genomics pipeline for BRCA1, TP53 & more. India's premier clinical bioinformatics research platform.",
    images: ["/biolabs-logo.png"],
    creator: "@HealixTechqouc",
  },
};

const jsonLdBioLabs = {
  "@context": "https://schema.org",
  "@type": "ResearchOrganization",
  "@id": `${siteUrl}/biolabs#org`,
  name: "Healix BioLabs",
  url: `${siteUrl}/biolabs`,
  description:
    "Healix BioLabs is an advanced genomics research and clinical bioinformatics platform by Healix Technologies, India. Specializing in BRCA1, TP53, and multi-gene panel sequencing analysis.",
  parentOrganization: {
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
  },
  areaServed: "IN",
  knowsAbout: [
    "Genomics",
    "Bioinformatics",
    "Clinical Genomics",
    "BRCA1 mutation analysis",
    "TP53 mutations",
    "Next Generation Sequencing",
    "Precision Medicine",
    "Cancer Genomics",
  ],
  inLanguage: "en-IN",
};

export default function BioLabsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBioLabs) }}
      />
      {children}
    </>
  );
}

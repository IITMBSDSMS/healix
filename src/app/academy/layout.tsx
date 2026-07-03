import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.healix-technologies.com";

export const metadata: Metadata = {
  title: "Healix Academy — Elite Engineering & Healthcare Technology Courses India",
  description:
    "Join Healix Academy for industry-led engineering and healthcare technology courses with live mentorship and placement support. Learn AI, biotech, systems engineering, and clinical data science. Based in India, taught by experts.",
  keywords: [
    "Healix Academy",
    "engineering courses India online",
    "healthcare technology course India",
    "biotech course India online",
    "AI course India 2024",
    "systems engineering course India",
    "clinical data science course India",
    "live mentorship engineering India",
    "health tech training India",
    "online STEM courses India",
    "engineering placement India",
    "elite engineering academy India",
    "FHIR HL7 course India",
    "bioinformatics course India",
  ],
  alternates: {
    canonical: `${siteUrl}/academy`,
    languages: { "en-IN": `${siteUrl}/academy` },
  },
  openGraph: {
    type: "website",
    url: `${siteUrl}/academy`,
    locale: "en_IN",
    siteName: "Healix Technologies",
    title: "Healix Academy — Elite Engineering & Healthcare Technology Courses India",
    description:
      "Industry-led engineering and healthcare technology courses with live mentorship. Learn AI, biotech, systems engineering with Healix Academy, India.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Healix Academy — Engineering & Healthcare Courses India",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Healix Academy — Elite Engineering & Healthcare Courses India",
    description:
      "AI, biotech, systems engineering with live mentorship & placement support. Join India's premier health-tech engineering academy.",
    images: ["/og-image.png"],
    creator: "@HealixTechqouc",
  },
};

const jsonLdAcademy = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "@id": `${siteUrl}/academy#org`,
  name: "Healix Academy",
  url: `${siteUrl}/academy`,
  description:
    "Healix Academy offers elite engineering and healthcare technology courses with live industry mentorship and placement support across India.",
  parentOrganization: {
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
  },
  areaServed: "IN",
  inLanguage: "en-IN",
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Healix Academy Courses",
    itemListElement: [
      {
        "@type": "Course",
        name: "AI for Healthcare Engineering",
        description: "Learn how to build AI-powered clinical tools using FHIR, HL7, and modern ML frameworks.",
        provider: { "@type": "Organization", name: "Healix Academy" },
        offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
        inLanguage: "en-IN",
      },
      {
        "@type": "Course",
        name: "Bioinformatics & Genomics",
        description: "Applied bioinformatics course covering genomic data pipelines, BRCA1/TP53 analysis, and cloud genomics.",
        provider: { "@type": "Organization", name: "Healix Academy" },
        inLanguage: "en-IN",
      },
      {
        "@type": "Course",
        name: "Systems Engineering for Health Tech",
        description: "End-to-end systems engineering principles applied to healthcare infrastructure at scale.",
        provider: { "@type": "Organization", name: "Healix Academy" },
        inLanguage: "en-IN",
      },
    ],
  },
};

export default function AcademyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdAcademy) }}
      />
      {children}
    </>
  );
}

import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.healix-technologies.com";

export const metadata: Metadata = {
  title: "About Healix Technologies — Mission, Team & Vision",
  description:
    "Meet the team building India's AI healthcare infrastructure. Founded in 2024, Healix Technologies unifies genomics, AI diagnostics, SheSecure women's safety, and engineering education into one intelligent platform.",
  keywords: [
    "Healix Technologies about",
    "healix founder Avnish Verma",
    "Indian healthtech startup story",
    "healthcare AI company India 2024",
    "Healix team leadership",
    "healthcare infrastructure company India",
    "FHIR health data startup India",
  ],
  alternates: {
    canonical: `${siteUrl}/about`,
    languages: { "en-IN": `${siteUrl}/about` },
  },
  openGraph: {
    type: "website",
    url: `${siteUrl}/about`,
    locale: "en_IN",
    siteName: "Healix Technologies",
    title: "About Healix Technologies — Mission, Team & Vision",
    description:
      "Meet the team building India's AI healthcare infrastructure. Founded in 2024, Healix unifies genomics, AI diagnostics, and women's safety into one platform.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "About Healix Technologies — India's AI Healthcare Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Healix Technologies — Mission, Team & Vision",
    description:
      "Founded in 2024, Healix Technologies unifies AI diagnostics, women's safety, genomics & engineering education. Meet our team.",
    images: ["/og-image.png"],
    creator: "@HealixTechqouc",
  },
};

const jsonLdAbout = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "@id": `${siteUrl}/about`,
  name: "About Healix Technologies",
  url: `${siteUrl}/about`,
  description:
    "Healix Technologies is an Indian health-tech company founded in 2024, building AI healthcare infrastructure, women's safety systems, genomics research, and engineering education.",
  publisher: {
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
  },
  mainEntity: {
    "@type": "Person",
    "@id": `${siteUrl}/about#founder`,
    name: "Avnish Verma",
    jobTitle: "Founder & CEO",
    worksFor: {
      "@type": "Organization",
      name: "Healix Technologies",
      url: siteUrl,
    },
    sameAs: [
      "https://www.linkedin.com/company/quick-healix/",
      "https://medium.com/@bv567992",
    ],
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdAbout) }}
      />
      {children}
    </>
  );
}

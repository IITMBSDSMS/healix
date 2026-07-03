import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.healix-technologies.com";

export const metadata: Metadata = {
  title: "Contact Healix Technologies — Partnerships, Press & Support",
  description:
    "Get in touch with Healix Technologies for business partnerships, press inquiries, investor relations, or product support. India's leading AI healthcare and women's safety technology company. Email us at office@healix-technologies.com.",
  keywords: [
    "contact Healix Technologies",
    "Healix Technologies email",
    "Healix contact number",
    "Healix support email",
    "Healix Technologies office address",
    "health tech company India contact",
    "Healix investor relations",
    "Healix partnership India",
    "health AI startup contact India",
    "Healix press media inquiry",
    "office healix technologies",
  ],
  alternates: {
    canonical: `${siteUrl}/contact`,
    languages: { "en-IN": `${siteUrl}/contact` },
  },
  openGraph: {
    type: "website",
    url: `${siteUrl}/contact`,
    locale: "en_IN",
    siteName: "Healix Technologies",
    title: "Contact Healix Technologies — Location, Phone & Email",
    description:
      "Get in touch with Healix Technologies. Find our IIT Madras office location, contact phone number, and support email addresses.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Contact Healix Technologies" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Healix Technologies — Get In Touch",
    description: "Find our office location, phone number, and support email details.",
    images: ["/og-image.png"],
    creator: "@HealixTechqouc",
  },
};

const jsonLdContact = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  "@id": `${siteUrl}/contact`,
  name: "Contact Healix Technologies",
  description: "Contact information for Healix Technologies, including office location, telephone number, and customer support emails.",
  url: `${siteUrl}/contact`,
  mainEntity: {
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: "Healix Technologies",
    telephone: "+919540694581",
    email: "office@healix-technologies.com",
    address: {
      "@type": "PostalAddress",
      "streetAddress": "IIT Madras Campus, Adyar",
      "addressLocality": "Chennai",
      "addressRegion": "Tamil Nadu",
      "postalCode": "600036",
      "addressCountry": "IN"
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        "telephone": "+919540694581",
        "contactType": "Customer Support",
        "email": "office@healix-technologies.com",
        "areaServed": "IN",
        "availableLanguage": ["English", "Hindi"]
      }
    ],
    sameAs: [
      "https://x.com/HealixTechqouc",
      "https://www.linkedin.com/company/quick-healix/",
      "https://www.instagram.com/healix_technologies",
    ],
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdContact) }}
      />
      {children}
    </>
  );
}

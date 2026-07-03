import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.healix-technologies.com";

export const metadata: Metadata = {
  title: "AI Symptom Checker India — Free Health Assessment | Healix AI",
  description:
    "Get an instant AI-powered symptom analysis. Healix AI Check uses clinical intelligence to assess your health symptoms — free, fast, and accurate. Available 24/7 across India. Not a substitute for medical advice.",
  keywords: [
    "AI symptom checker India",
    "free symptom checker online India",
    "online health assessment India",
    "AI diagnosis India",
    "symptom analysis AI",
    "what disease do I have India",
    "health check AI India",
    "free medical AI India",
    "Healix AI check",
    "health symptom checker free",
    "digital health tool India",
    "AI doctor India free",
    "online medical checker India",
  ],
  alternates: {
    canonical: `${siteUrl}/ai-check`,
    languages: { "en-IN": `${siteUrl}/ai-check` },
  },
  openGraph: {
    type: "website",
    url: `${siteUrl}/ai-check`,
    locale: "en_IN",
    siteName: "Healix Technologies",
    title: "AI Symptom Checker India — Free Health Assessment | Healix AI",
    description:
      "Free AI-powered symptom checker by Healix Technologies. Get instant health assessment using clinical AI — available 24/7 across India.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Healix AI Symptom Checker — Free Health Assessment India",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Symptom Checker India — Free Health Assessment | Healix AI",
    description:
      "Free AI health symptom checker by Healix Technologies. Clinical AI assessment in seconds, 24/7 across India.",
    images: ["/og-image.png"],
    creator: "@HealixTechqouc",
  },
};

const jsonLdAICheck = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "@id": `${siteUrl}/ai-check#app`,
  name: "Healix AI Check",
  applicationCategory: "HealthApplication",
  applicationSubCategory: "Medical Diagnosis",
  operatingSystem: "Web",
  url: `${siteUrl}/ai-check`,
  description:
    "Free AI-powered symptom checker by Healix Technologies. Uses clinical intelligence to analyse health symptoms and provide instant assessments. Available 24/7 across India.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "INR",
  },
  publisher: {
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
  },
  inLanguage: "en-IN",
};

const jsonLdFAQ = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is Healix AI symptom checker free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, Healix AI Check is completely free to use. Simply describe your symptoms and get an AI-powered clinical assessment instantly.",
      },
    },
    {
      "@type": "Question",
      name: "How accurate is the Healix AI symptom checker?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Healix AI Check uses advanced clinical intelligence models to analyze symptoms. While highly accurate for general assessment, it is not a substitute for professional medical advice. Always consult a doctor for diagnosis.",
      },
    },
    {
      "@type": "Question",
      name: "Is Healix AI available in India?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, Healix AI Check is available 24/7 across India via web browser — no app download required.",
      },
    },
  ],
};

export default function AICheckLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdAICheck) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFAQ) }}
      />
      {children}
    </>
  );
}

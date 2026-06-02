import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Avenix Pharmaceuticals — India's Intelligent Online Pharmacy",
  description:
    "Order medicines online with up to 80% generic savings. Sourced from CDSCO-compliant, WHO-GMP certified partner warehouse nodes. Interactive AI prescription verification, NABL laboratory home diagnostic tests, and doctor teleconsultation.",
  keywords: [
    "Avenix Pharmaceuticals",
    "online pharmacy India",
    "buy generic medicines",
    "prescription scanner AI",
    "WHO-GMP certified generic drugs",
    "NABL home lab tests",
    "telemedicine doctor consultation",
    "express medicine delivery",
    "Healix Technologies Care",
  ],
  openGraph: {
    title: "Avenix Pharmaceuticals — India's Intelligent Online Pharmacy",
    description: "Order medicines online with up to 80% savings. CDSCO-compliant, WHO-GMP certified partner warehouses.",
    url: "https://healix-nu.vercel.app/care",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Avenix Pharmaceuticals — India's Intelligent Online Pharmacy",
    description: "Order medicines online with up to 80% savings. CDSCO-compliant, WHO-GMP certified partner warehouses.",
    images: ["/og-image.png"],
  },
};

export default function CareLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

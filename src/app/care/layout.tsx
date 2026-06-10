import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LATENCY — When Earth Is Too Far Away | Powered by AVENNIX",
  description:
    "LATENCY is building autonomous health technologies for human survival beyond Earth. Autonomous medicine, biological intelligence, and human performance systems for deep space exploration.",
  keywords: [
    "LATENCY", "AVENNIX", "Space Medicine", "Autonomous Medicine",
    "Biological Operating System", "Human Performance Intelligence",
    "Deep Space Health", "Mars Medicine", "Space Biology",
    "Autonomous Health Systems", "Future of Medicine", "Healix Technologies",
  ],
  openGraph: {
    title: "LATENCY — When Earth Is Too Far Away",
    description: "Building autonomous technologies for human life beyond Earth. When Earth cannot respond, LATENCY can.",
    url: "https://healix-nu.vercel.app/care",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "LATENCY — When Earth Is Too Far Away | AVENNIX",
    description: "Building autonomous health technologies for human survival beyond Earth.",
    images: ["/og-image.png"],
  },
};

export default function CareLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Barlow Condensed — for the LATENCY wordmark */}
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link
        rel="preconnect"
        href="https://fonts.googleapis.com"
        crossOrigin="anonymous"
      />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@1,700;1,800;1,900&display=swap"
        rel="stylesheet"
      />
      {children}
    </>
  );
}

// Page-level metadata — placed in a separate server component wrapper
// (shesecure/page.tsx is "use client" so we put the metadata in a layout.tsx)
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SheSecure — Women's Safety Dashboard",
  description:
    "SheSecure by Healix Technologies: India's most advanced women's travel safety platform. Add emergency contacts, scan QR codes, start live trip tracking, and trigger SOS alerts instantly.",
  keywords: [
    "SheSecure",
    "women safety app India",
    "Project Suraksha",
    "live trip tracking",
    "emergency contact alert",
    "SOS button",
    "QR code safety",
    "Healix women safety",
  ],
  openGraph: {
    title: "SheSecure — Women's Safety Dashboard | Healix Technologies",
    description:
      "Add trusted contacts, scan your vehicle QR, and start a protected trip. Your safety, tracked in real time.",
    url: "/shesecure",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  alternates: { canonical: "/shesecure" },
};

export default function SheSecureLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

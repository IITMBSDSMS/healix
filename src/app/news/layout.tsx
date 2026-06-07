import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Press Center & News",
  description: "Stay up to date with official press releases, product updates, and biomedical breakthroughs from Healix Technologies (जैव-चिकित्सीय अनुसंधान एवं अभियांत्रिकी केंद्र) and BioLabs.",
  keywords: [
    "Healix press releases",
    "BioLabs genomics accelerator",
    "Avennix Pharma medicine delivery",
    "Suraksha QR campaign Delhi Metro",
    "Healix announcements",
    "जैव-चिकित्सीय अनुसंधान एवं अभियांत्रिकी केंद्र"
  ],
};

export default function NewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

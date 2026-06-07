import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Healix Technologies (जैव-चिकित्सीय अनुसंधान एवं अभियांत्रिकी केंद्र) at the IIT Madras Campus, Chennai. Support is available for our AI healthcare diagnostics, SheSecure women's safety platforms, and Healix Academy engineering programs.",
  keywords: [
    "Contact Healix Technologies",
    "Healix Technologies Chennai address",
    "IIT Madras Research Park",
    "women safety helpdesk India",
    "Healix Academy support",
    "जैव-चिकित्सीय अनुसंधान एवं अभियांत्रिकी केंद्र"
  ],
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

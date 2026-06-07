import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Startups Incubator",
  description: "The Healix Startups ecosystem (जैव-चिकित्सीय अनुसंधान एवं अभियांत्रिकी केंद्र) empowers cutting-edge health-tech and bio-tech startups with the infrastructure, capital, and mentorship needed to revolutionize global healthcare.",
  keywords: [
    "Healix Startups",
    "health-tech incubation India",
    "biotech seed funding Chennai",
    "healthcare entrepreneurship",
    "IIT Madras startup incubator",
    "जैव-चिकित्सीय अनुसंधान एवं अभियांत्रिकी केंद्र"
  ],
};

export default function StartupsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

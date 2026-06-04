import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Healix Technologies",
  description: "Learn about India's leading inter-disciplinary biomedical research and engineering institution. Read messages from our founders, core vision, and collaborative research teams.",
  keywords: [
    "Healix founders",
    "Healix leadership",
    "medical AI history India",
    "biomedical tech vision",
    "Healix office",
    "about Healix Technologies"
  ],
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

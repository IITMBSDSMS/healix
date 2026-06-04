import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Global Research & Clinical Network",
  description: "Connect with India's premium clinical professionals, research hospitals, and academic nodes. Explore Healix's distributed computing clusters, telemetry pipelines, and real-time medical boards.",
  keywords: [
    "Healix global network",
    "biomedical nodes India",
    "clinical partners AIIMS",
    "IIT research center",
    "medical board telemetry",
    "Healix clinicians",
    "healthcare professionals list"
  ],
};

export default function GlobalNetworkLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

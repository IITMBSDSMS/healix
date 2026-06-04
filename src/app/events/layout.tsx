import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events, Seminars & Workshops | Healix Technologies",
  description: "Discover upcoming biomedical AI seminars, IoT safety workshops, and clinical diagnostic training programs at Healix Technologies.",
  keywords: [
    "Healix events",
    "biomedical seminars India",
    "healthcare AI workshops",
    "engineering training programs",
    "Healix webinars",
    "clinical diagnostics school"
  ],
};

export default function EventsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

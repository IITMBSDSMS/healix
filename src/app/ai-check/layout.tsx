import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Healix AI Symptom Checker",
  description:
    "Chat with Healix AI to get an instant, AI-powered preliminary health assessment and recommended next steps.",
};

/**
 * This layout intentionally renders children directly — without the
 * shared Navbar / Footer — so the AI chat page can occupy the full viewport
 * just like ChatGPT or Claude.
 */
export default function AICheckLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="ai-check-layout">
      {children}
    </div>
  );
}

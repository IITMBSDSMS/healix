import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Panel — Fleet & Vehicle Management",
  description:
    "Healix Technologies admin panel. Manage the registered fleet, generate QR sticker codes, assign IoT device IDs, and monitor all active trips and SOS alerts in real time.",
  robots: { index: false, follow: false }, // Admin pages must never be indexed
  alternates: { canonical: "/admin" },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

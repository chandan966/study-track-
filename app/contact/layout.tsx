import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us & Academic Support Desk — StudyTrack",
  description:
    "Get in touch with the StudyTrack educational team for inquiries regarding study session ledgers, student IDs, or certificate verification.",
  alternates: {
    canonical: "https://study-track-drab.vercel.app/contact",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

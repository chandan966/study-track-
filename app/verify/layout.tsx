import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verify Academic Certificate & Study Report Card — StudyTrack",
  description:
    "Official verification portal for parents, mentors, and academic institutions to validate StudyTrack student study certificates and tamper-evident ledger records.",
  alternates: {
    canonical: "https://study-track-drab.vercel.app/verify",
  },
  openGraph: {
    title: "Verify Academic Certificate — StudyTrack",
    description:
      "Verify student study credentials, logged hours, and course mastery against StudyTrack's authenticated educational database.",
    url: "https://study-track-drab.vercel.app/verify",
  },
};

export default function VerifyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

import React from "react";
import Link from "next/link";
import { GraduationCap, ArrowLeft, FileText, CheckCircle2, ShieldCheck } from "lucide-react";
import { PublicFooter } from "@/components/navigation/PublicFooter";

export const metadata = {
  title: "Terms of Service — StudyTrack",
  description:
    "Terms and conditions governing the use of StudyTrack educational productivity platform, student accounts, and certificate verification.",
  alternates: {
    canonical: "https://study-track-drab.vercel.app/terms",
  },
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-study-bg text-zinc-900 flex flex-col selection:bg-pink-200">
      {/* Header */}
      <header className="bg-white border-b border-pink-100 py-4 px-6 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-600 to-pink-500 flex items-center justify-center text-white shadow-xs">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="font-black text-xl tracking-tight text-zinc-900">
              Study<span className="text-pink-600">Track</span>
            </span>
          </Link>
          <Link
            href="/"
            className="text-xs font-bold text-pink-600 hover:text-pink-700 flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 flex-1 space-y-8">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-bold border border-pink-200">
            <FileText className="w-3.5 h-3.5" />
            <span>Academic User Agreement</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight">
            Terms of Service
          </h1>
          <p className="text-xs text-zinc-500">
            Effective Date: November 14, 2026 &bull; StudyTrack Educational Platform
          </p>
        </div>

        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-pink-100 shadow-sm space-y-6 text-sm text-zinc-700 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-zinc-900">1. Acceptance of Terms</h2>
            <p className="text-xs sm:text-sm text-zinc-600">
              By accessing, browsing, or registering on <strong>StudyTrack</strong> (&quot;Platform&quot;), you acknowledge that you have read, understood, and agreed to be legally bound by these Terms of Service and our Privacy Policy.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-zinc-900">2. Student Accounts &amp; 12-Digit Identification Numbers</h2>
            <p className="text-xs sm:text-sm text-zinc-600">
              Upon account creation, each student is issued an official 12-digit student identification number. You may authenticate into your account using either your registered email address or your 12-digit student ID. You are solely responsible for maintaining the confidentiality of your password and credentials.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-zinc-900">3. Authentic Study Session Logging</h2>
            <p className="text-xs sm:text-sm text-zinc-600">
              StudyTrack provides certified academic report cards and digitally authenticated session ledgers. Users agree to log genuine, honest study sessions. Fabricating study hours or intentionally falsifying records to forge unearned academic certificates violates our community integrity standards and may result in credential revocation.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-zinc-900">4. Advertising &amp; Third-Party Services</h2>
            <p className="text-xs sm:text-sm text-zinc-600">
              StudyTrack displays advertisements served by third-party advertising networks, including Google AdSense. We do not endorse or assume responsibility for the content, goods, or services offered in third-party advertisements. Any interactions with advertisers found on StudyTrack are solely between you and the respective advertiser.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-zinc-900">5. Intellectual Property Rights</h2>
            <p className="text-xs sm:text-sm text-zinc-600">
              All branding, interface designs, official seals, and certificate layouts are proprietary to StudyTrack and its founder, Chandan Ghanghav. Study notes, custom curriculum items, and user-generated notes remain the intellectual property of the student.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-zinc-900">6. Limitation of Liability &amp; Disclaimers</h2>
            <p className="text-xs sm:text-sm text-zinc-600">
              StudyTrack is an educational self-tracking utility. While we make every effort to maintain 100% service availability and data accuracy, the platform is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis without warranties of any kind.
            </p>
          </section>

          <section className="space-y-2 pt-2 border-t border-pink-100">
            <h2 className="text-base font-bold text-zinc-900">7. Contact &amp; Questions</h2>
            <p className="text-xs sm:text-sm text-zinc-600">
              Questions regarding these Terms of Service should be directed to:{" "}
              <a href="mailto:terms@studytrack.platform" className="text-pink-600 font-semibold underline">
                terms@studytrack.platform
              </a>
            </p>
          </section>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}

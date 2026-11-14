import React from "react";
import Link from "next/link";
import { GraduationCap, ArrowLeft, FileText, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Terms of Service — StudyTrack",
  description: "Terms and conditions governing the use of StudyTrack productivity platform and certificate verification.",
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-study-bg text-zinc-900 flex flex-col">
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
            Effective Date: November 14, 2026
          </p>
        </div>

        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-pink-100 shadow-sm space-y-6 text-sm text-zinc-700 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-zinc-900">1. Acceptance of Terms</h2>
            <p className="text-xs text-zinc-600">
              By accessing or using the <strong>StudyTrack</strong> application (&quot;Platform&quot;), you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please refrain from using the platform.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-zinc-900">2. Student Accounts &amp; 12-Digit Identification Numbers</h2>
            <p className="text-xs text-zinc-600">
              Upon registration, each student is assigned an official 12-digit identification number. You are responsible for safeguarding your login credentials. You may authenticate into your account using either your registered email address or your 12-digit student ID.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-zinc-900">3. Authentic Study Session Logging</h2>
            <p className="text-xs text-zinc-600">
              StudyTrack provides certified academic report cards and digitally authenticated session ledgers. Users agree to log genuine, honest study sessions. Fabricating study hours to forge unearned academic certificates violates our community integrity standards and may result in credential revocation.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-zinc-900">4. Intellectual Property</h2>
            <p className="text-xs text-zinc-600">
              All branding, interface designs, official seals, and certificate layouts are proprietary to StudyTrack and its founder, Chandan Ghanghav. Study notes and user-generated curriculum items remain the intellectual property of the student.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-zinc-900">5. Limitation of Liability</h2>
            <p className="text-xs text-zinc-600">
              StudyTrack is an educational productivity and self-tracking utility. While we strive for 100% uptime and database reliability, StudyTrack is provided &quot;as is&quot; without warranties of any kind.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}

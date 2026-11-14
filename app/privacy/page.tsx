import React from "react";
import Link from "next/link";
import { ShieldCheck, GraduationCap, ArrowLeft, Lock } from "lucide-react";

export const metadata = {
  title: "Privacy Policy — StudyTrack",
  description: "Learn how StudyTrack collects, protects, and handles student study data and privacy.",
};

export default function PrivacyPolicyPage() {
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
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>GDPR &amp; AdSense Compliant</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xs text-zinc-500">
            Last Updated: November 14, 2026 &bull; Effective Immediately
          </p>
        </div>

        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-pink-100 shadow-sm space-y-6 text-sm text-zinc-700 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-zinc-900">1. Information We Collect</h2>
            <p>
              At <strong>StudyTrack</strong>, we prioritize the privacy and security of student data. We collect:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs text-zinc-600">
              <li><strong>Account Credentials:</strong> Name, Email Address, and system-assigned 12-Digit Student Identification Number.</li>
              <li><strong>Academic Records:</strong> Subjects, topics, study session timestamps, revision logs, and self-assessment scores.</li>
              <li><strong>Verification Data:</strong> Unique cryptographic hashes generated for public certificate authentication.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-zinc-900">2. How We Use Your Information</h2>
            <p className="text-xs text-zinc-600">
              Your information is exclusively used to provide accurate study analytics, compute learning streaks, format official downloadable single-page academic certificates, and enable verified parents or institutions to authenticate study credentials.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-zinc-900">3. Cookies &amp; Third-Party Advertising (Google AdSense)</h2>
            <p className="text-xs text-zinc-600">
              StudyTrack may use cookies to authenticate user sessions and enhance user experience. Third-party vendors, including Google, use cookies to serve ads based on a user&apos;s prior visits to this website or other websites. Google&apos;s use of advertising cookies enables it and its partners to serve ads to users based on their visit to your sites and/or other sites on the Internet.
            </p>
            <p className="text-xs text-zinc-600">
              Users may opt out of personalized advertising by visiting Google&apos;s Ads Settings (<a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-pink-600 underline">adssettings.google.com</a>).
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-zinc-900">4. Data Security &amp; Encryption</h2>
            <p className="text-xs text-zinc-600">
              All passwords are cryptographically salted and hashed using bcrypt with 12 rounds. Database connections are strictly encrypted via TLS/SSL, and all web communications are enforced over secure HTTPS.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-zinc-900">5. Contact Information</h2>
            <p className="text-xs text-zinc-600">
              For any privacy inquiries or data requests, please contact our Data Protection Officer at:{" "}
              <a href="mailto:privacy@studytrack.platform" className="text-pink-600 font-bold underline">
                privacy@studytrack.platform
              </a>
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}

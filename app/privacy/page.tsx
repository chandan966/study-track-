import React from "react";
import Link from "next/link";
import { ShieldCheck, GraduationCap, ArrowLeft, Lock, CheckCircle2 } from "lucide-react";
import { PublicFooter } from "@/components/navigation/PublicFooter";

export const metadata = {
  title: "Privacy Policy — StudyTrack",
  description:
    "Learn how StudyTrack collects, protects, and handles student study data and privacy, including full Google AdSense, GDPR, CCPA, and COPPA compliance.",
  alternates: {
    canonical: "https://study-track-drab.vercel.app/privacy",
  },
};

export default function PrivacyPolicyPage() {
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
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>GDPR, CCPA &amp; Google AdSense Compliant</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xs text-zinc-500">
            Last Updated: November 14, 2026 &bull; Effective Immediately &bull; StudyTrack Educational Platform
          </p>
        </div>

        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-pink-100 shadow-sm space-y-8 text-sm text-zinc-700 leading-relaxed">
          {/* Introduction */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-zinc-900">1. Introduction &amp; Commitment to Privacy</h2>
            <p className="text-xs sm:text-sm text-zinc-600">
              Welcome to <strong>StudyTrack</strong> (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;), accessible from{" "}
              <a href="https://study-track-drab.vercel.app" className="text-pink-600 font-semibold underline">
                https://study-track-drab.vercel.app
              </a>
              . Founded by Chandan Ghanghav, StudyTrack provides an advanced academic productivity platform, spaced-repetition revision tracking, and tamper-evident study certification for competitive exam aspirants.
            </p>
            <p className="text-xs sm:text-sm text-zinc-600">
              This Privacy Policy explains what information we collect, how it is safeguarded, how third-party advertising partners (including Google AdSense) utilize cookies, and your full statutory rights under GDPR, CCPA, and international data protection laws.
            </p>
          </section>

          {/* Information Collected */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-zinc-900">2. Information We Collect</h2>
            <p className="text-xs sm:text-sm text-zinc-600">
              We collect information to provide, maintain, and secure our educational tracking services:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-zinc-600">
              <li>
                <strong>Student Account Information:</strong> Full name, verified email address, and an automatically generated unique 12-digit Student Identification Number. Passwords are never stored in plain text and are cryptographically hashed using bcrypt (12 rounds).
              </li>
              <li>
                <strong>Academic Records:</strong> Subjects, topics, study session start and stop timestamps, difficulty levels, revision schedule dates, and self-assessment notes.
              </li>
              <li>
                <strong>Digital Verification Data:</strong> Cryptographic verification hashes (e.g., <code>ST-REC-YYYYMMDD-NAME-XXXX</code>) published to allow parents, mentors, and academic institutions to verify the validity of generated certificates.
              </li>
              <li>
                <strong>Log Files &amp; Technical Analytics:</strong> Standard internet log files including IP addresses, browser types, Internet Service Providers (ISP), referring/exit pages, operating system, and date/time stamps. These are not linked to personally identifiable information and are strictly used to administer the site, prevent malicious bot attacks, and ensure system uptime.
              </li>
            </ul>
          </section>

          {/* Third-Party Advertising & Google AdSense */}
          <section className="space-y-3 p-5 rounded-2xl bg-pink-50/50 border border-pink-200">
            <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-pink-600" />
              3. Google AdSense &amp; Third-Party Advertising Disclosures
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600">
              StudyTrack partners with third-party advertising vendors, specifically <strong>Google AdSense</strong>, to serve advertisements when you visit our website.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-zinc-600">
              <li>
                <strong>Third-Party Vendors:</strong> Google, as a third-party vendor, uses cookies to serve ads on StudyTrack.
              </li>
              <li>
                <strong>DoubleClick DART Cookie:</strong> Google&apos;s use of the DoubleClick DART cookie enables it and its partners to serve targeted ads to our users based upon their visit to StudyTrack and other sites on the Internet.
              </li>
              <li>
                <strong>Opt-Out Options:</strong> Users may opt out of personalized advertising by visiting Google Ads Settings at{" "}
                <a
                  href="https://adssettings.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-600 font-semibold underline"
                >
                  https://adssettings.google.com
                </a>
                .
              </li>
              <li>
                <strong>Network Advertising Initiative (NAI):</strong> You may also opt out of third-party vendor&apos;s use of cookies for personalized advertising by visiting{" "}
                <a
                  href="https://optout.networkadvertising.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-600 font-semibold underline"
                >
                  https://optout.networkadvertising.org
                </a>{" "}
                and{" "}
                <a
                  href="https://www.aboutads.info/choices"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-600 font-semibold underline"
                >
                  https://www.aboutads.info/choices
                </a>
                .
              </li>
            </ul>
          </section>

          {/* Cookies & Web Beacons */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-zinc-900">4. Cookies and Web Beacons</h2>
            <p className="text-xs sm:text-sm text-zinc-600">
              Like any modern interactive platform, StudyTrack uses cookies to store information about visitors&apos; session state, authentication tokens, and user preferences (such as dark/light contrast or study timer preferences).
            </p>
            <p className="text-xs sm:text-sm text-zinc-600">
              You can choose to disable cookies through your individual browser options. Detailed information about cookie management with specific web browsers can be found at the browsers&apos; respective websites.
            </p>
          </section>

          {/* GDPR Rights */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-zinc-900">5. GDPR Privacy Rights (Data Protection Rights)</h2>
            <p className="text-xs sm:text-sm text-zinc-600">
              We would like to make sure you are fully aware of all of your data protection rights under the General Data Protection Regulation (GDPR). Every user is entitled to the following:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-zinc-600">
              <li><strong>The Right to Access:</strong> You have the right to request copies of your personal academic records and profile information.</li>
              <li><strong>The Right to Rectification:</strong> You have the right to request that we correct any information you believe is inaccurate or incomplete.</li>
              <li><strong>The Right to Erasure:</strong> You have the right to request that we erase your personal data under certain conditions.</li>
              <li><strong>The Right to Restrict Processing:</strong> You have the right to request that we restrict the processing of your personal data.</li>
              <li><strong>The Right to Object to Processing:</strong> You have the right to object to our processing of your personal data.</li>
              <li><strong>The Right to Data Portability:</strong> You have the right to export your study sessions, revision history, and report cards in structured formats (JSON / CSV / PDF).</li>
            </ul>
          </section>

          {/* CCPA / CPRA Rights */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-zinc-900">6. CCPA / CPRA Privacy Rights (Do Not Sell My Personal Information)</h2>
            <p className="text-xs sm:text-sm text-zinc-600">
              Under the California Consumer Privacy Act (CCPA), California consumers have specific rights regarding their personal information:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-zinc-600">
              <li>The right to know what personal data categories a business collects, uses, and discloses.</li>
              <li>The right to request the deletion of personal data collected by the business.</li>
              <li>
                <strong>No Sale of Personal Data:</strong> StudyTrack does <strong>not sell, rent, or trade</strong> student personal information or academic data to any third parties for monetary consideration.
              </li>
            </ul>
          </section>

          {/* Children's Privacy (COPPA) */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-zinc-900">7. Children&apos;s Information (COPPA Compliance)</h2>
            <p className="text-xs sm:text-sm text-zinc-600">
              Another part of our priority is adding protection for children while using the internet. StudyTrack is designed for high school, university, and competitive exam students (such as SSC, UPSC, Engineering, Medical). StudyTrack does not knowingly collect any Personal Identifiable Information from children under the age of 13.
            </p>
            <p className="text-xs sm:text-sm text-zinc-600">
              If you think that your child provided this kind of information on our website, we strongly encourage you to contact us immediately and we will do our best efforts to promptly remove such information from our records.
            </p>
          </section>

          {/* Security Measures */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-zinc-900">8. Cryptographic Security &amp; Infrastructure</h2>
            <p className="text-xs sm:text-sm text-zinc-600">
              StudyTrack employs industry-standard security measures to safeguard user data:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-zinc-600">
              <li>All web traffic is enforced strictly over <strong>HTTPS (TLS 1.3)</strong>.</li>
              <li>Passwords are salted and hashed using <strong>bcrypt</strong> with 12 computational rounds.</li>
              <li>Public verification uses tamper-resistant one-way cryptographic hashes.</li>
              <li>Database clusters are isolated with SSL/TLS encryption at rest and in transit.</li>
              <li>Anti-bot Captcha verification prevents brute-force account discovery.</li>
            </ul>
          </section>

          {/* Contact Information */}
          <section className="space-y-3 pt-4 border-t border-pink-100">
            <h2 className="text-base font-bold text-zinc-900">9. Data Controller &amp; Contact Us</h2>
            <p className="text-xs sm:text-sm text-zinc-600">
              If you have any questions, concerns, or requests regarding this Privacy Policy, please reach out directly:
            </p>
            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 text-xs sm:text-sm space-y-1">
              <p><strong>Platform:</strong> StudyTrack Educational Platform</p>
              <p><strong>Founder &amp; Data Officer:</strong> Chandan Ghanghav</p>
              <p>
                <strong>Official Email:</strong>{" "}
                <a href="mailto:privacy@studytrack.platform" className="text-pink-600 font-bold underline">
                  privacy@studytrack.platform
                </a>
              </p>
              <p>
                <strong>Instagram Creator:</strong>{" "}
                <a
                  href="https://www.instagram.com/trigger_toofan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-600 font-bold underline"
                >
                  @trigger_toofan (webdevchandna)
                </a>
              </p>
            </div>
          </section>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}

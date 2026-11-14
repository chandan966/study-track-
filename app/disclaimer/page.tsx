import React from "react";
import Link from "next/link";
import { GraduationCap, ArrowLeft, AlertTriangle, ShieldCheck, CheckCircle2 } from "lucide-react";
import { PublicFooter } from "@/components/navigation/PublicFooter";

export const metadata = {
  title: "Disclaimer & Academic Notice — StudyTrack",
  description:
    "Official disclaimer regarding educational productivity services, no government affiliation, study records, and third-party advertising on StudyTrack.",
  alternates: {
    canonical: "https://study-track-drab.vercel.app/disclaimer",
  },
};

export default function DisclaimerPage() {
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
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Official Legal &amp; Educational Notice</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight">
            Disclaimer
          </h1>
          <p className="text-xs text-zinc-500">
            Last Updated: November 14, 2026 &bull; StudyTrack Educational Platform
          </p>
        </div>

        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-pink-100 shadow-sm space-y-8 text-sm text-zinc-700 leading-relaxed">
          {/* Section 1: General Information Only */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-zinc-900">1. Educational &amp; Self-Tracking Nature</h2>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
              The information, timers, revision planners, and study analytics provided on <strong>StudyTrack</strong> (accessible at{" "}
              <a href="https://study-track-drab.vercel.app" className="text-pink-600 font-semibold underline">
                https://study-track-drab.vercel.app
              </a>
              ) are for educational, personal productivity, and self-assessment purposes only. While StudyTrack provides scientifically backed tools (such as the Pomodoro technique and spaced-repetition schedules), study outcomes and exam performance depend solely upon individual student dedication and preparation.
            </p>
          </section>

          {/* Section 2: No Government Affiliation */}
          <section className="space-y-3 p-5 rounded-2xl bg-amber-50/60 border border-amber-200">
            <h2 className="text-base font-bold text-amber-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              2. No Affiliation with Government Bodies or Examination Boards
            </h2>
            <p className="text-xs sm:text-sm text-amber-800 leading-relaxed">
              <strong>StudyTrack is an independent private educational technology platform</strong> founded by Chandan Ghanghav. StudyTrack is <strong>NOT affiliated, associated, authorized, endorsed by, or in any way officially connected with</strong> the Staff Selection Commission (SSC), Union Public Service Commission (UPSC), National Testing Agency (NTA), Railway Recruitment Boards (RRB), or any other central, state, or international government recruitment agency.
            </p>
            <p className="text-xs sm:text-sm text-amber-800 leading-relaxed">
              Any references to competitive exams (e.g., &quot;SSC CGL&quot;, &quot;General Studies&quot;, &quot;Quantitative Aptitude&quot;) are purely for syllabus categorization and student study planning convenience. Official notices, application forms, and results should always be accessed directly from official government portals.
            </p>
          </section>

          {/* Section 3: Study Certificates & Verification */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-zinc-900">3. Nature of Study Certificates &amp; Digital Ledgers</h2>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
              StudyTrack issues verifiable study report cards and digital certificates carrying unique ledger hashes (e.g., <code>ST-REC-YYYYMMDD-NAME-XXXX</code>). These documents authenticate that a specific student logged the recorded study hours, completed the listed topics, and achieved the calculated goals on our platform.
            </p>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
              These certificates do <strong>not</strong> confer academic university degrees, government diplomas, or public service employment guarantees. They serve as an internal motivational milestone and proof of self-disciplined effort for students, parents, and private mentors.
            </p>
          </section>

          {/* Section 4: Third-Party Advertising & External Links */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-zinc-900">4. Third-Party Advertisements (Google AdSense) &amp; Links</h2>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
              StudyTrack contains advertisements served by Google AdSense and may contain hyperlinks to third-party websites or services that are not owned or controlled by StudyTrack. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites or services.
            </p>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
              The inclusion of any commercial advertisement or external link does not imply endorsement by StudyTrack. Users are advised to review the terms and privacy practices of any third-party service they visit.
            </p>
          </section>

          {/* Section 5: &quot;As-Is&quot; Provision &amp; Contact */}
          <section className="space-y-3 pt-4 border-t border-pink-100">
            <h2 className="text-base font-bold text-zinc-900">5. &quot;As-Is&quot; and &quot;As-Available&quot; Disclaimer</h2>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
              All tools, timers, cloud backups, and digital services are provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis without warranties of any kind, whether express or implied. StudyTrack does not warrant that the website will operate uninterrupted or error-free.
            </p>
            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 text-xs sm:text-sm space-y-1">
              <p><strong>Platform:</strong> StudyTrack Platform</p>
              <p><strong>Legal &amp; Compliance Inquiries:</strong> <a href="mailto:legal@studytrack.platform" className="text-pink-600 font-bold underline">legal@studytrack.platform</a></p>
              <p><strong>Founder:</strong> Chandan Ghanghav</p>
            </div>
          </section>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}

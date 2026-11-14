import React from "react";
import Link from "next/link";
import { GraduationCap, ArrowLeft, Award, Sparkles, ShieldCheck, Heart } from "lucide-react";

export const metadata = {
  title: "About Us — StudyTrack",
  description: "Learn about the mission, architecture, and creators behind the StudyTrack educational productivity platform.",
};

export default function AboutPage() {
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
        <div className="space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-bold border border-pink-200">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Our Educational Mission</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight">
            About StudyTrack
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500">
            Empowering students to build lifelong study habits, authenticate genuine effort, and conquer competitive exams.
          </p>
        </div>

        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-pink-100 shadow-sm space-y-8 text-sm text-zinc-700 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-zinc-900">Who We Are</h2>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
              <strong>StudyTrack</strong> was founded by <strong>Chandan Ghanghav</strong> with a singular vision: to give ambitious students a rigorous, trustworthy, and distraction-free academic environment.
            </p>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
              Unlike generic productivity apps, StudyTrack is built specifically for high-stakes exam preparation—such as SSC CGL, UPSC, Engineering, Medical, and University degrees. Every study session logged on StudyTrack is cryptographically recorded, allowing learners to export verified, single-page A4 report cards that mentors and parents can authenticate in real-time.
            </p>
          </section>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-pink-50/60 border border-pink-100 space-y-1.5 text-center sm:text-left">
              <div className="w-8 h-8 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center mx-auto sm:mx-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-zinc-900">Verified Ledgers</h3>
              <p className="text-[11px] text-zinc-500">Tamper-evident 12-digit student credentials and certificate verification.</p>
            </div>

            <div className="p-4 rounded-2xl bg-pink-50/60 border border-pink-100 space-y-1.5 text-center sm:text-left">
              <div className="w-8 h-8 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center mx-auto sm:mx-0">
                <Award className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-zinc-900">Spaced Repetition</h3>
              <p className="text-[11px] text-zinc-500">Automated revision intervals to ensure concepts remain active in long-term memory.</p>
            </div>

            <div className="p-4 rounded-2xl bg-pink-50/60 border border-pink-100 space-y-1.5 text-center sm:text-left">
              <div className="w-8 h-8 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center mx-auto sm:mx-0">
                <Heart className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-zinc-900">Student First</h3>
              <p className="text-[11px] text-zinc-500">Clean, aesthetic pink-and-white theme designed for long, fatigue-free study hours.</p>
            </div>
          </div>

          <section className="space-y-3 pt-4 border-t border-pink-100">
            <h2 className="text-lg font-bold text-zinc-900">Leadership &amp; Founder</h2>
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-pink-50 via-white to-pink-50 border border-pink-200">
              <div className="w-14 h-14 rounded-2xl bg-pink-500 text-white flex items-center justify-center font-black text-xl shadow-md shrink-0">
                CG
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-zinc-900">Chandan Ghanghav</h3>
                <p className="text-xs text-pink-700 font-bold">Founder &amp; CEO, StudyTrack</p>
                <p className="text-[11px] text-zinc-500 mt-1">
                  Connect on Instagram:{" "}
                  <a
                    href="https://www.instagram.com/trigger_toofan"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-pink-600 font-bold underline"
                  >
                    @trigger_toofan
                  </a>{" "}
                  (webdevchandna)
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

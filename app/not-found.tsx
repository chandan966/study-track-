import React from "react";
import Link from "next/link";
import { GraduationCap, ArrowLeft, Home, Search, ShieldCheck } from "lucide-react";
import { PublicFooter } from "@/components/navigation/PublicFooter";

export const metadata = {
  title: "Page Not Found (404) — StudyTrack",
  description: "The page you requested could not be found on StudyTrack. Return to home or browse educational study tools.",
};

export default function NotFoundPage() {
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

      {/* Main 404 Container */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-20 flex-1 flex flex-col items-center justify-center text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-pink-100 text-pink-600 flex items-center justify-center font-black text-3xl shadow-lg shadow-pink-500/10 border-2 border-pink-200">
          404
        </div>

        <div className="space-y-2 max-w-lg">
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight">
            Study Record or Page Not Found
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
            The page, study topic, or certificate hash you were searching for might have been moved, updated, or does not exist on our servers.
          </p>
        </div>

        {/* Helpful Recovery Navigation */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <Link
            href="/"
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-700 hover:to-pink-600 text-white text-xs font-bold shadow-md shadow-pink-500/20 flex items-center gap-2 transition-all transform active:scale-95"
          >
            <Home className="w-4 h-4" />
            <span>Return to Home</span>
          </Link>

          <Link
            href="/verify"
            className="px-5 py-2.5 rounded-2xl bg-white border-2 border-pink-200 hover:bg-pink-50 text-pink-700 text-xs font-bold flex items-center gap-2 transition-all"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Verify a Certificate</span>
          </Link>

          <Link
            href="/login"
            className="px-5 py-2.5 rounded-2xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold flex items-center gap-2 transition-all"
          >
            <span>Student Login</span>
          </Link>
        </div>

        <div className="pt-8 text-xs text-zinc-400">
          <span>Need help finding a specific study feature? </span>
          <Link href="/contact" className="text-pink-600 font-semibold underline">
            Contact Support
          </Link>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}

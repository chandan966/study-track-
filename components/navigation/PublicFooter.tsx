import React from "react";
import Link from "next/link";
import { GraduationCap, ShieldCheck, Heart, Sparkles } from "lucide-react";

export function PublicFooter() {
  return (
    <footer className="no-print bg-white border-t border-pink-100 py-12 text-xs text-zinc-500 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-pink-600 to-pink-500 flex items-center justify-center text-white shadow-xs">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="font-black text-lg tracking-tight text-zinc-900">
                Study<span className="text-pink-600">Track</span>
              </span>
            </Link>
            <p className="text-[12px] text-zinc-500 leading-relaxed">
              Advanced academic productivity platform for competitive exam aspirants. Track study hours, maintain streaks, and generate verified educational credentials.
            </p>
            <p className="text-[11px] text-zinc-400">
              Founded by <strong>Chandan Ghanghav</strong>
            </p>
          </div>

          {/* Column 2: Platform Links */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-zinc-900">
              Platform
            </h4>
            <ul className="space-y-2 text-[12px]">
              <li>
                <Link href="/" className="hover:text-pink-600 transition-colors">
                  Home Overview
                </Link>
              </li>
              <li>
                <Link href="/verify" className="hover:text-pink-600 transition-colors font-medium text-pink-600 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verify Certificate
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-pink-600 transition-colors">
                  Student Sign In
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-pink-600 transition-colors">
                  Create Free Account
                </Link>
              </li>
              <li>
                <Link href="/forgot-password" className="hover:text-pink-600 transition-colors">
                  Reset Password (12-Digit ID)
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Features & Study Prep */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-zinc-900">
              Study Methodology
            </h4>
            <ul className="space-y-2 text-[12px] text-zinc-500">
              <li>SSC CGL &amp; Govt Exam Syllabus Tracking</li>
              <li>Pomodoro &amp; Deep Work Timer</li>
              <li>Spaced Repetition (Interval Revision)</li>
              <li>Single-Page A4 Academic Report Cards</li>
              <li>Tamper-Evident Ledger Hashes</li>
            </ul>
          </div>

          {/* Column 4: Legal & Policies (Google AdSense Required) */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-zinc-900">
              Trust &amp; Legal
            </h4>
            <ul className="space-y-2 text-[12px]">
              <li>
                <Link href="/privacy" className="hover:text-pink-600 transition-colors">
                  Privacy Policy (GDPR / CCPA)
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-pink-600 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="hover:text-pink-600 transition-colors font-semibold text-pink-700">
                  Disclaimer &amp; Academic Notice
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-pink-600 transition-colors">
                  About Us &amp; Mission
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-pink-600 transition-colors">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-pink-100 flex flex-wrap items-center justify-between gap-4 text-[11px] text-zinc-400">
          <div className="flex items-center gap-2">
            <span>&copy; {new Date().getFullYear()} StudyTrack Platform. All rights reserved.</span>
          </div>

          <p>
            <a
              href="https://www.instagram.com/trigger_toofan"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="webdevchandna Instagram (opens in new tab)"
              className="font-semibold text-pink-600 hover:text-pink-700 hover:underline transition-colors"
            >
              webdevchandna
            </a>
          </p>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              <ShieldCheck className="w-3 h-3" />
              AdSense Ready &bull; SSL Secured
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

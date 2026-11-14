"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie, ShieldCheck, X } from "lucide-react";

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already set cookie preference
    const consent = localStorage.getItem("studytrack_cookie_consent");
    if (!consent) {
      // Show banner after brief delay
      const timer = setTimeout(() => setIsVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem("studytrack_cookie_consent", "accepted_all");
    setIsVisible(false);
  };

  const handleAcceptEssential = () => {
    localStorage.setItem("studytrack_cookie_consent", "essential_only");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent banner"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 bg-white/95 backdrop-blur-md p-5 rounded-3xl border-2 border-pink-200 shadow-2xl shadow-pink-500/15 animate-in slide-in-from-bottom-5 duration-300 text-zinc-900"
    >
      <div className="flex items-start gap-3.5">
        <div className="w-9 h-9 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center shrink-0">
          <Cookie className="w-5 h-5" />
        </div>
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 flex items-center gap-1.5">
              <span>Privacy &amp; Cookie Consent</span>
            </h4>
            <button
              onClick={handleAcceptEssential}
              className="text-zinc-400 hover:text-zinc-600 p-1 -mr-1"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-zinc-600 leading-relaxed">
            StudyTrack uses essential cookies for secure login and performance analytics. Google AdSense and third-party partners also use cookies to serve personalized ads. Read our{" "}
            <Link
              href="/privacy"
              className="text-pink-600 font-semibold underline hover:text-pink-700"
            >
              Privacy Policy
            </Link>{" "}
            for details.
          </p>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-pink-100 flex items-center justify-end gap-2">
        <button
          onClick={handleAcceptEssential}
          className="px-3.5 py-1.5 rounded-xl border border-zinc-200 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors"
        >
          Essential Only
        </button>
        <button
          onClick={handleAcceptAll}
          className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-700 hover:to-pink-600 text-white text-xs font-bold shadow-md shadow-pink-500/20 transition-all active:scale-95"
        >
          Accept All
        </button>
      </div>
    </div>
  );
}

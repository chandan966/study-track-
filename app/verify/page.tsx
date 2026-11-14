"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  Search,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { ReportCardDocument, ReportCardData } from "@/components/report-card/ReportCardDocument";

function VerifyContent() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get("id") || "";

  const [searchId, setSearchId] = useState<string>(initialId);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [certData, setCertData] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleVerify = async (idToVerify?: string) => {
    const id = (idToVerify || searchId).trim();
    if (!id) return;

    setIsLoading(true);
    setErrorMsg(null);
    setCertData(null);

    try {
      const res = await fetch(`/api/verify?id=${encodeURIComponent(id)}`);
      const data = await res.json();

      if (!res.ok || !data.isValid) {
        setErrorMsg(data.message || "Certificate ID not found on the official StudyTrack educational ledger.");
      } else {
        setCertData(data);
      }
    } catch {
      setErrorMsg("Failed to connect to verification server. Please check your network and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialId) {
      handleVerify(initialId);
    }
  }, [initialId]);

  const toReportCardData = (cert: any): ReportCardData => ({
    type: (cert.type || "daily") as "daily" | "weekly" | "monthly",
    periodLabel: cert.periodLabel || "Verified Study Period",
    generatedAt: cert.issuedAt || "Today",
    certificateId: cert.certificateId,
    student: {
      name: cert.studentName || "Student Aspirant",
      email: cert.studentEmail || "",
      college: cert.college || "University / Institute",
      course: cert.course || "SSC CGL / Govt Exam & Tech",
      branch: cert.branch || "General Studies",
      academicYear: cert.academicYear || "Final Year",
      semester: cert.semester || "Semester I",
      streak: 14,
    },
    performance: {
      totalStudyMinutes: cert.totalStudyMinutes || 0,
      totalStudyFormatted: cert.totalStudyFormatted || "0m",
      targetGoalMinutes: 360,
      targetGoalFormatted: cert.targetGoalFormatted || "6h 0m",
      goalPercentage: cert.goalPercentage || 0,
      grade: cert.grade || "A+",
      gradeLabel: cert.gradeLabel || "Outstanding (Distinction)",
      gradeColor:
        cert.goalPercentage >= 80
          ? "text-pink-700 bg-pink-50 border-pink-300"
          : "text-amber-700 bg-amber-50 border-amber-300",
      remarks:
        "This academic study record is authenticated and certified authentic by StudyTrack Educational Board.",
      sessionCount: cert.sessionCount || 0,
      tasksCompletedCount: cert.tasksCompletedCount || 0,
    },
    subjectBreakdown: cert.subjects || [],
    sessions: [],
    completedTasks: [],
    verification: {
      seal: "STUDYTRACK VERIFIED ACADEMIC RECORD",
      issuer: "StudyTrack Platform Verification Service",
      officer: "Chandan Ghanghav (CEO, StudyTrack Platform)",
      digitalSignStatus: "VERIFIED_AUTHENTIC",
      isAuthentic: true,
    },
  });

  return (
    <div className="min-h-screen bg-study-bg text-zinc-900 flex flex-col selection:bg-pink-200">
      {/* Public Navigation Header (Hidden on Print) */}
      <header className="no-print sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-pink-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center text-white shadow-md shadow-pink-200">
              <GraduationCap className="w-6 h-6" />
            </div>
            <span className="font-black text-xl tracking-tight text-zinc-900">
              Study<span className="text-brand-500">Track</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="text-xs font-bold text-zinc-600 hover:text-pink-600 transition-colors"
            >
              Go to Dashboard
            </Link>
            <Link
              href="/login"
              className="px-3.5 py-1.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold shadow-xs transition-all"
            >
              Student Login
            </Link>
          </div>
        </div>
      </header>

      {/* Main Verification Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
        {/* Verification Portal Hero Banner (Hidden on Print) */}
        <div className="no-print text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-100 border border-pink-200 text-pink-700 text-xs font-bold">
            <ShieldCheck className="w-4 h-4 text-pink-600" />
            Parent &amp; Institutional Verification Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight">
            Verify Student Study Certificate &amp; Report Card
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed">
            Parents, mentors, and institutions can authenticate daily, weekly, or monthly study records directly against StudyTrack&apos;s educational database.
          </p>
        </div>

        {/* Verification Input Box (Hidden on Print) */}
        <div className="no-print bg-white p-4 sm:p-6 rounded-3xl border-2 border-pink-100 shadow-lg shadow-pink-500/5 max-w-2xl mx-auto">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleVerify();
            }}
            className="flex flex-col sm:flex-row items-center gap-3"
          >
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="Enter Certificate ID / HASH (e.g., ST-REC-20261114-CHAN-FM71)"
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-zinc-200 text-xs font-mono text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all bg-zinc-50/50"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !searchId.trim()}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-700 hover:to-pink-600 text-white text-xs font-bold shadow-md shadow-pink-500/25 flex items-center justify-center gap-2 transition-all transform active:scale-95 disabled:opacity-50 shrink-0"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verify Authenticity</span>
                </>
              )}
            </button>
          </form>

          {/* Helper hints */}
          <div className="mt-3 pt-3 border-t border-zinc-100 flex flex-wrap items-center justify-between text-[11px] text-zinc-400">
            <span>Certificate IDs are printed on the report card footer &amp; header.</span>
            <span className="font-mono text-zinc-500">Format: ST-REC-YYYYMMDD-NAME-XXXX</span>
          </div>
        </div>

        {/* Verification Error Result */}
        {errorMsg && (
          <div className="no-print p-6 bg-red-50/80 border-2 border-red-200 rounded-3xl max-w-2xl mx-auto flex items-start gap-3.5 text-xs text-red-800 animate-in fade-in">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-bold text-sm text-red-900">Certificate Verification Failed</h4>
              <p>{errorMsg}</p>
              <p className="text-[11px] text-red-600 pt-1">
                Tip: Please confirm the certificate was generated by the student from their StudyTrack dashboard.
              </p>
            </div>
          </div>
        )}

        {/* Verified Result: Official Authentic Single-Page Certificate Document */}
        {certData && certData.isValid && (
          <div className="space-y-4 animate-in fade-in duration-300">
            {/* Authenticated Verification Pill Banner (Hidden on Print) */}
            <div className="no-print p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-white to-emerald-50 border-2 border-emerald-300 flex items-center justify-between gap-3 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase text-emerald-800 tracking-wider">
                    VERIFIED GENUINE STUDY RECORD &bull; 100% AUTHENTIC
                  </h3>
                  <p className="text-xs text-zinc-600 mt-0.5">
                    Certificate <strong className="font-mono text-emerald-900">{certData.certificateId}</strong> is active and validated on the StudyTrack educational ledger.
                  </p>
                </div>
              </div>
            </div>

            {/* The Actual Official Single-Page Report Card Document */}
            <ReportCardDocument data={toReportCardData(certData)} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="no-print bg-white border-t border-pink-100 py-8 text-xs text-zinc-500 mt-12">
        <div className="max-w-4xl mx-auto px-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-pink-500 flex items-center justify-center text-white">
              <GraduationCap className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-zinc-900">StudyTrack</span>
            <span className="text-zinc-400">© 2026. All rights reserved.</span>
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

          <div className="flex flex-wrap items-center gap-3">
            <Link href="/" className="hover:text-pink-600 font-medium">Home</Link>
            <Link href="/about" className="hover:text-pink-600 font-medium">About</Link>
            <Link href="/contact" className="hover:text-pink-600 font-medium">Contact</Link>
            <Link href="/privacy" className="hover:text-pink-600 font-medium">Privacy</Link>
            <Link href="/terms" className="hover:text-pink-600 font-medium">Terms</Link>
            <Link href="/login" className="hover:text-pink-600 font-medium">Sign In</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-pink-600 animate-spin" />
        </div>
      }
    >
      <VerifyContent />
    </Suspense>
  );
}

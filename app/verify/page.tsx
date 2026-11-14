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
  Clock,
  Sparkles,
  BookOpen,
  Layers,
  Award,
  Medal,
  Printer,
  ArrowRight,
  Loader2,
  Calendar,
  Building,
} from "lucide-react";

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

  return (
    <div className="min-h-screen bg-study-bg text-zinc-900 flex flex-col selection:bg-pink-200">
      {/* Public Navigation Header */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-pink-100">
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
        {/* Verification Portal Hero Banner */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
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

        {/* Verification Input Box */}
        <div className="bg-white p-4 sm:p-6 rounded-3xl border-2 border-pink-100 shadow-lg shadow-pink-500/5 max-w-2xl mx-auto">
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

        {/* Verification Result Area */}
        {errorMsg && (
          <div className="p-6 bg-red-50/80 border-2 border-red-200 rounded-3xl max-w-2xl mx-auto flex items-start gap-3.5 text-xs text-red-800 animate-in fade-in">
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

        {certData && certData.isValid && (
          <div className="bg-white p-6 sm:p-9 rounded-3xl border-2 border-emerald-300 shadow-xl max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300 relative overflow-hidden">
            {/* Background Seal Watermark */}
            <div className="absolute right-[-30px] top-[-30px] w-64 h-64 bg-emerald-50/40 rounded-full blur-2xl pointer-events-none" />

            {/* Official Verification Header Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-white to-emerald-50 border border-emerald-200 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase text-emerald-800 tracking-wider">
                      OFFICIAL STUDYTRACK VERIFIED RECORD
                    </span>
                    <span className="px-2 py-0.2 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      GENUINE &bull; 100% AUTHENTIC
                    </span>
                  </div>
                  <p className="text-xs text-zinc-600 mt-0.5">
                    This student record is digitally signed and validated in the StudyTrack academic ledger.
                  </p>
                </div>
              </div>

              <button
                onClick={() => window.print()}
                className="px-3 py-1.5 rounded-xl border border-emerald-200 text-xs font-bold text-emerald-800 bg-white hover:bg-emerald-50 flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Record</span>
              </button>
            </div>

            {/* Student & Period Credentials */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-zinc-50 border border-zinc-200 text-xs">
              <div>
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                  Student Name
                </span>
                <p className="font-extrabold text-zinc-900 text-sm truncate">{certData.studentName}</p>
                <p className="text-[11px] text-zinc-500 truncate">{certData.studentEmail}</p>
              </div>

              <div>
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                  Target Preparation
                </span>
                <p className="font-bold text-zinc-900 truncate">{certData.course}</p>
                <p className="text-[11px] text-zinc-500 truncate">{certData.college}</p>
              </div>

              <div>
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                  Study Period
                </span>
                <p className="font-bold text-zinc-900 truncate">{certData.periodLabel}</p>
                <p className="text-[11px] text-zinc-500">{certData.type.toUpperCase()} Record</p>
              </div>

              <div>
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                  Academic Grade
                </span>
                <p className="text-base font-black text-pink-600">{certData.grade}</p>
                <p className="text-[10px] font-bold text-emerald-700">{certData.gradeLabel}</p>
              </div>
            </div>

            {/* Performance Metrics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-pink-50/50 border border-pink-200">
                <span className="text-[10px] font-bold text-zinc-500 uppercase block">Verified Study Time</span>
                <p className="text-xl font-black text-pink-600 mt-0.5">{certData.totalStudyFormatted}</p>
                <p className="text-[10px] text-zinc-500">Target Goal: {certData.targetGoalFormatted}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-200">
                <span className="text-[10px] font-bold text-zinc-500 uppercase block">Goal Achievement</span>
                <p className="text-xl font-black text-emerald-600 mt-0.5">{certData.goalPercentage}%</p>
                <p className="text-[10px] text-zinc-500">
                  {certData.goalPercentage >= 100 ? "Daily target exceeded 🎉" : "Daily target in progress"}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-blue-50/50 border border-blue-200">
                <span className="text-[10px] font-bold text-zinc-500 uppercase block">Study Sessions</span>
                <p className="text-xl font-black text-blue-600 mt-0.5">{certData.sessionCount} Sessions</p>
                <p className="text-[10px] text-zinc-500">{certData.tasksCompletedCount} Tasks Completed</p>
              </div>
            </div>

            {/* Subject Distribution Breakdown */}
            <div className="rounded-2xl border border-zinc-200 overflow-hidden">
              <div className="px-4 py-2.5 bg-zinc-50 border-b border-zinc-200 flex items-center justify-between text-xs font-bold text-zinc-700">
                <span className="flex items-center gap-1.5 uppercase text-[10px] tracking-wider">
                  <Layers className="w-3.5 h-3.5 text-pink-600" />
                  Curriculum &amp; Subject Distribution
                </span>
                <span className="text-[11px] text-pink-600 font-bold">
                  {certData.subjects?.length || 0} Subjects Studied
                </span>
              </div>

              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-50/50 border-b border-zinc-100 text-zinc-500 font-bold text-[10px]">
                  <tr>
                    <th className="py-2 px-4">Subject</th>
                    <th className="py-2 px-3 text-center">Sessions</th>
                    <th className="py-2 px-3 text-center">Topics</th>
                    <th className="py-2 px-4 text-right">Hours Logged</th>
                    <th className="py-2 px-4 text-right">Share (%)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 text-xs">
                  {certData.subjects?.map((sub: any, idx: number) => (
                    <tr key={idx} className="hover:bg-zinc-50/50">
                      <td className="py-2 px-4 font-bold text-zinc-900 flex items-center gap-2">
                        <div
                          className="w-2.5 h-2.5 rounded-md"
                          style={{ backgroundColor: sub.color || "#EC4899" }}
                        />
                        <span>{sub.name}</span>
                      </td>
                      <td className="py-2 px-3 text-center text-zinc-600">{sub.sessionCount}</td>
                      <td className="py-2 px-3 text-center text-zinc-600">{sub.uniqueTopicsCount}</td>
                      <td className="py-2 px-4 text-right font-bold text-zinc-900">
                        {Math.floor(sub.duration / 60)}h {sub.duration % 60}m
                      </td>
                      <td className="py-2 px-4 text-right font-bold text-pink-600">{sub.percentage}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Bottom Verification Seal & HASH */}
            <div className="pt-4 border-t-2 border-pink-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-16 h-16 rounded-full border-[3px] border-[#EC4899] bg-white flex flex-col items-center justify-center text-center p-1 shadow-sm shrink-0">
                  <Medal className="w-5 h-5 text-[#EC4899]" />
                  <span className="text-[7px] font-black uppercase text-[#DB2777] tracking-tight leading-tight mt-0.5">
                    STUDYTRACK
                    <br />
                    VERIFIED
                  </span>
                </div>

                <div className="space-y-1">
                  <h4 className="text-sm font-extrabold text-zinc-900 leading-tight">
                    Official StudyTrack Record
                  </h4>
                  <p className="text-[11px] text-zinc-500">
                    Digitally authenticated study session ledger
                  </p>
                  <div className="inline-block px-3 py-0.5 rounded-full bg-[#FFF1F7] border border-[#FBCFE8] font-mono text-xs font-bold text-[#BE185D]">
                    HASH: {certData.certificateId}
                  </div>
                </div>
              </div>

              {/* Dean Signature */}
              <div className="space-y-0.5 text-center">
                <div className="h-7 border-b border-zinc-400 flex items-end justify-center px-4 min-w-[130px]">
                  <span className="font-serif italic text-xs font-semibold text-pink-700">
                    Dr. A. Verma
                  </span>
                </div>
                <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block">
                  Academic Dean, StudyTrack
                </span>
              </div>
            </div>
          </div>
        )}
      </main>
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

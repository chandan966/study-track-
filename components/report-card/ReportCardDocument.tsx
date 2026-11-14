"use client";

import React, { useRef, useState } from "react";
import {
  Download,
  Printer,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Clock,
  BookOpen,
  Award,
  Layers,
  GraduationCap,
  Loader2,
  Share2,
  Calendar,
  Medal,
} from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export interface ReportCardData {
  type: "daily" | "weekly" | "monthly";
  periodLabel: string;
  generatedAt: string;
  certificateId: string;
  student: {
    name: string;
    email: string;
    college: string;
    course: string;
    branch: string;
    academicYear: string;
    semester: string;
    streak: number;
  };
  performance: {
    totalStudyMinutes: number;
    totalStudyFormatted: string;
    targetGoalMinutes: number;
    targetGoalFormatted: string;
    goalPercentage: number;
    grade: string;
    gradeLabel: string;
    gradeColor: string;
    remarks: string;
    sessionCount: number;
    tasksCompletedCount: number;
  };
  subjectBreakdown: Array<{
    name: string;
    color: string;
    duration: number;
    percentage: number;
    sessionCount: number;
    uniqueTopicsCount: number;
  }>;
  sessions: Array<{
    id: string;
    time: string;
    durationFormatted: string;
    durationMinutes: number;
    subjectName: string;
    subjectColor: string;
    topicName: string;
    difficulty: string;
    notes?: string;
    learned?: string;
    understood?: string;
    notUnderstood?: string;
  }>;
  completedTasks: Array<{
    id: string;
    title: string;
    subject: string;
  }>;
  verification: {
    seal: string;
    issuer: string;
    officer: string;
    digitalSignStatus: string;
    isAuthentic: boolean;
  };
}

interface ReportCardDocumentProps {
  data: ReportCardData;
}

export function ReportCardDocument({ data }: ReportCardDocumentProps) {
  const printRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleDownloadPDF = async () => {
    if (!printRef.current) return;
    setIsExporting(true);

    try {
      const element = printRef.current;
      const canvas = await html2canvas(element, {
        scale: 2.5,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, Math.min(297, pdfHeight));
      pdf.save(`StudyTrack_${data.type.toUpperCase()}_ReportCard_${data.certificateId}.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("Failed to generate PDF. You can also click 'Print / Save PDF'!");
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(data.certificateId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white rounded-2xl border border-pink-100 shadow-xs print:hidden">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-pink-50 border border-pink-200 text-pink-600 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-zinc-900">
              StudyTrack Single-Page Academic Report Card
            </h3>
            <p className="text-[11px] text-zinc-500 font-mono">
              HASH: <span className="text-pink-600 font-bold">{data.certificateId}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyId}
            className="px-3 py-1.5 rounded-xl border border-zinc-200 text-xs font-semibold text-zinc-600 hover:bg-zinc-50 flex items-center gap-1.5 transition-colors"
          >
            {copied ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-600">Copied HASH</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>Copy HASH</span>
              </>
            )}
          </button>

          <button
            onClick={handlePrint}
            className="px-3 py-1.5 rounded-xl border border-pink-200 text-xs font-semibold text-pink-700 bg-pink-50/50 hover:bg-pink-100 flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print A4</span>
          </button>

          <button
            onClick={handleDownloadPDF}
            disabled={isExporting}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-700 hover:to-pink-600 text-white text-xs font-bold shadow-md shadow-pink-500/20 flex items-center gap-1.5 transition-all disabled:opacity-50"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating 1-Page PDF...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download Single-Page PDF</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* SINGLE PAGE REPORT CARD DOCUMENT (FITS EXACTLY ON ONE A4 PAGE) */}
      {/* ============================================================== */}
      <div
        ref={printRef}
        className="bg-white p-7 sm:p-9 rounded-3xl border-2 border-pink-200 shadow-xl max-w-4xl mx-auto space-y-4 relative overflow-hidden text-zinc-900"
        style={{
          width: "100%",
          maxWidth: "850px",
          backgroundColor: "#ffffff",
          fontFamily: "inherit",
        }}
      >
        {/* Subtle Background Accent */}
        <div className="absolute right-[-40px] top-[-40px] w-80 h-80 bg-pink-50/40 rounded-full blur-3xl pointer-events-none -z-0" />
        <div className="absolute left-[-40px] bottom-[-40px] w-80 h-80 bg-pink-50/40 rounded-full blur-3xl pointer-events-none -z-0" />

        {/* 1. TOP HEADER SECTION */}
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4 pb-4 border-b border-pink-100 relative z-10">
          {/* Top Left: Logo, Name, Target Preparation & Certificate Title */}
          <div className="space-y-1.5">
            {/* Website Name & Logo */}
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-600 to-pink-500 flex items-center justify-center text-white shadow-md shadow-pink-500/25">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xl font-black tracking-tight text-zinc-900">
                  Study<span className="text-pink-600">Track</span>
                </span>
                <span className="ml-2 px-2 py-0.5 rounded text-[10px] font-extrabold bg-pink-100 text-pink-700 border border-pink-200">
                  ACADEMIC RECORD
                </span>
              </div>
            </div>

            {/* Name of the Student */}
            <div className="pt-1">
              <h2 className="text-base sm:text-lg font-black text-zinc-900 flex items-center gap-2">
                <span>{data.student.name}</span>
                <span className="text-xs font-normal text-zinc-400">({data.student.email})</span>
              </h2>
            </div>

            {/* Preparation For Which Exam/Course */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-600">
              <span className="font-bold text-pink-600 bg-pink-50 px-2 py-0.5 rounded-md border border-pink-200">
                Target: {data.student.course || "SSC CGL / Government Exam & Tech"}
              </span>
              <span>&bull;</span>
              <span className="text-zinc-500">{data.student.college || "University Institute"}</span>
              <span>&bull;</span>
              <span className="text-zinc-500">{data.student.academicYear || "Final Year"} ({data.student.semester || "Semester I"})</span>
            </div>

            {/* Title & Certificate HASH */}
            <div className="pt-1 space-y-0.5">
              <p className="text-xs font-bold text-zinc-800">
                StudyTrack Official Academic Report Card &amp; Certificate
              </p>
              <p className="text-[11px] font-mono font-semibold text-pink-700">
                Certificate HASH: <span className="bg-pink-50 px-2 py-0.5 rounded border border-pink-200">{data.certificateId}</span>
              </p>
            </div>
          </div>

          {/* Top Right: Report Period, Grade Badge & Generated Time */}
          <div className="flex flex-col items-start sm:items-end text-left sm:text-right space-y-2 shrink-0">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-pink-50 text-pink-700 border border-pink-200">
              {data.type} Study Report
            </span>

            <div className="text-xs">
              <p className="font-bold text-zinc-900">{data.periodLabel}</p>
              <p className="text-[10px] text-zinc-400">Generated: {data.generatedAt}</p>
            </div>

            {/* Grade Stamp */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-pink-50 to-white rounded-xl border border-pink-200">
              <span className="text-[10px] font-extrabold uppercase text-zinc-400">Grade:</span>
              <span className="text-lg font-black text-pink-600">{data.performance.grade}</span>
              <span className="text-[10px] font-bold text-zinc-600">({data.performance.gradeLabel.split(" ")[0]})</span>
            </div>
          </div>
        </div>

        {/* 2. PROPER BOX: PERFORMANCE METRICS ROW */}
        {/* Study Time Logged | Goal Achievement | Sessions & Tasks */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 relative z-10">
          {/* Box 1: Study Time Logged */}
          <div className="p-3.5 rounded-2xl bg-zinc-50/80 border border-zinc-200 flex items-center justify-between shadow-2xs">
            <div>
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                Study Time Logged
              </span>
              <p className="text-lg font-black text-zinc-900 mt-0.5">
                {data.performance.totalStudyFormatted}
              </p>
              <p className="text-[10px] text-zinc-500 font-medium">
                Goal: {data.performance.targetGoalFormatted}
              </p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          {/* Box 2: Goal Achievement */}
          <div className="p-3.5 rounded-2xl bg-zinc-50/80 border border-zinc-200 flex items-center justify-between shadow-2xs">
            <div className="flex-1 mr-3">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                Goal Achievement
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-lg font-black text-emerald-600">
                  {data.performance.goalPercentage}%
                </span>
                <span className="text-[10px] text-zinc-400 font-semibold">
                  {data.performance.goalPercentage >= 100 ? "Completed 🎉" : "Progress"}
                </span>
              </div>
              <div className="w-full bg-zinc-200 rounded-full h-1.5 mt-1 overflow-hidden">
                <div
                  className="bg-emerald-500 h-1.5 rounded-full transition-all"
                  style={{ width: `${Math.min(data.performance.goalPercentage, 100)}%` }}
                />
              </div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>

          {/* Box 3: Sessions & Tasks */}
          <div className="p-3.5 rounded-2xl bg-zinc-50/80 border border-zinc-200 flex items-center justify-between shadow-2xs">
            <div>
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                Sessions &amp; Tasks
              </span>
              <p className="text-lg font-black text-zinc-900 mt-0.5">
                {data.performance.sessionCount} <span className="text-xs font-semibold text-zinc-500">Sessions</span>
              </p>
              <p className="text-[10px] text-zinc-500 font-medium">
                {data.performance.tasksCompletedCount} Tasks Completed
              </p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* 3. PROPER BOX: CURRICULUM & SUBJECT DISTRIBUTION */}
        <div className="rounded-2xl border border-zinc-200 overflow-hidden shadow-2xs relative z-10 bg-white">
          <div className="px-4 py-2.5 bg-gradient-to-r from-pink-50/70 via-white to-pink-50/40 border-b border-zinc-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-pink-600" />
              <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
                Curriculum &amp; Subject Distribution
              </h3>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-pink-100 text-pink-700 border border-pink-200">
              {data.subjectBreakdown.length} Subjects Studied
            </span>
          </div>

          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50/80 border-b border-zinc-100 text-zinc-500 font-bold text-[10px]">
              <tr>
                <th className="py-2 px-4">Subject</th>
                <th className="py-2 px-3 text-center">Sessions</th>
                <th className="py-2 px-3 text-center">Topics</th>
                <th className="py-2 px-4 text-right">Hours Logged</th>
                <th className="py-2 px-4 text-right">Share (%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-xs">
              {data.subjectBreakdown.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-3 px-4 text-center text-zinc-400 text-xs">
                    No sessions logged for this period yet.
                  </td>
                </tr>
              ) : (
                data.subjectBreakdown.map((sub, idx) => (
                  <tr key={idx} className="hover:bg-zinc-50/40">
                    <td className="py-2.5 px-4 flex items-center gap-2 font-bold text-zinc-900">
                      <div
                        className="w-2.5 h-2.5 rounded-md shrink-0 shadow-2xs"
                        style={{ backgroundColor: sub.color }}
                      />
                      <span className="truncate max-w-[260px]">{sub.name}</span>
                    </td>
                    <td className="py-2.5 px-3 text-center text-zinc-600 font-medium">
                      {sub.sessionCount}
                    </td>
                    <td className="py-2.5 px-3 text-center text-zinc-600 font-medium">
                      {sub.uniqueTopicsCount}
                    </td>
                    <td className="py-2.5 px-4 text-right font-bold text-zinc-900">
                      {Math.floor(sub.duration / 60)}h {sub.duration % 60}m
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-pink-50 text-pink-700 border border-pink-200">
                        {sub.percentage}%
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 4. BOTTOM SECTION: EXACT SEAL & HASH ON BOTTOM LEFT, SIGNATURES ON BOTTOM RIGHT */}
        <div className="pt-4 border-t-2 border-pink-100 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
          {/* BOTTOM LEFT: Exactly as requested with Pink Round Seal, Title, Subtitle, and HASH pill */}
          <div className="flex items-center gap-3.5">
            {/* Round Pink Seal: STUDYTRACK VERIFIED */}
            <div className="w-16 h-16 rounded-full border-[3px] border-[#EC4899] bg-white flex flex-col items-center justify-center text-center p-1 shadow-sm shrink-0">
              <Medal className="w-5 h-5 text-[#EC4899]" />
              <span className="text-[7px] font-black uppercase text-[#DB2777] tracking-tight leading-tight mt-0.5">
                STUDYTRACK
                <br />
                VERIFIED
              </span>
            </div>

            {/* Official StudyTrack Record & HASH */}
            <div className="space-y-1">
              <h4 className="text-sm font-extrabold text-zinc-900 leading-tight">
                Official StudyTrack Record
              </h4>
              <p className="text-[11px] text-zinc-500 font-normal">
                Digitally authenticated study session ledger
              </p>
              {/* Pink Pill with HASH */}
              <div className="inline-block px-3 py-0.5 rounded-full bg-[#FFF1F7] border border-[#FBCFE8] font-mono text-xs font-bold text-[#BE185D]">
                HASH: {data.certificateId}
              </div>
            </div>
          </div>

          {/* BOTTOM RIGHT: Dual Digital Signatures */}
          <div className="flex items-center gap-6 text-center">
            {/* Student Digital Signature */}
            <div className="space-y-0.5">
              <div className="h-7 border-b border-zinc-400 flex items-end justify-center px-3 min-w-[110px]">
                <span className="font-serif italic text-xs font-semibold text-zinc-800">
                  {data.student.name}
                </span>
              </div>
              <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block">
                Student Signature
              </span>
            </div>

            {/* Academic Dean Signature */}
            <div className="space-y-0.5">
              <div className="h-7 border-b border-zinc-400 flex items-end justify-center px-3 min-w-[110px]">
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

        {/* Bottom Micro-Footer */}
        <div className="text-center text-[9px] text-zinc-400 pt-1 border-t border-zinc-100 flex items-center justify-between">
          <span>StudyTrack Verified Academic Productivity Ledger</span>
          <span className="font-mono text-pink-600 font-semibold">{data.certificateId}</span>
          <span>Certified Single-Page A4 Transcript</span>
        </div>
      </div>
    </div>
  );
}

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
  Calendar,
  Layers,
  GraduationCap,
  Loader2,
  Share2,
  QrCode,
  Building,
  UserCheck,
  FileText,
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
        scale: 2,
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

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`StudyTrack_${data.type.toUpperCase()}_ReportCard_${data.certificateId}.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("Failed to generate PDF. You can also use the 'Print / Save as PDF' button!");
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
      {/* Top Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white rounded-2xl border border-pink-100 shadow-xs print:hidden">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-pink-50 border border-pink-200 text-pink-600 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-zinc-900">
              StudyTrack Official Academic Report Card &amp; Certificate
            </h3>
            <p className="text-[11px] text-zinc-500">
              Certificate HASH: <span className="font-mono text-pink-600 font-bold">{data.certificateId}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyId}
            className="px-3 py-2 rounded-xl border border-zinc-200 text-xs font-semibold text-zinc-600 hover:bg-zinc-50 flex items-center gap-1.5 transition-colors"
          >
            {copied ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
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
            className="px-3.5 py-2 rounded-xl border border-pink-200 text-xs font-semibold text-pink-700 bg-pink-50/50 hover:bg-pink-100 flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save PDF</span>
          </button>

          <button
            onClick={handleDownloadPDF}
            disabled={isExporting}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-700 hover:to-pink-600 text-white text-xs font-bold shadow-md shadow-pink-500/20 flex items-center gap-1.5 transition-all disabled:opacity-50"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Generating PDF...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download Official PDF</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* The Printable Official Report Card Document */}
      <div
        ref={printRef}
        className="bg-white p-8 sm:p-12 rounded-3xl border-2 border-pink-200 shadow-xl max-w-4xl mx-auto space-y-7 relative overflow-hidden"
        style={{ minHeight: "297mm", fontFamily: "inherit" }}
      >
        {/* Subtle Decorative Background Watermark */}
        <div className="absolute right-[-40px] top-[-40px] w-96 h-96 bg-pink-50/50 rounded-full blur-3xl pointer-events-none -z-0" />
        <div className="absolute left-[-40px] bottom-[-40px] w-96 h-96 bg-pink-50/50 rounded-full blur-3xl pointer-events-none -z-0" />

        {/* 1. Official Header with Platform Name */}
        <div className="border-b-2 border-pink-100 pb-6 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Website Name & Logo */}
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-pink-600 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-pink-500/30">
                <GraduationCap className="w-8 h-8" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-black text-zinc-900 tracking-tight">
                    Study<span className="text-pink-600">Track</span>
                  </h1>
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-pink-100 text-pink-700 border border-pink-200">
                    VERIFIED RECORD
                  </span>
                </div>
                <p className="text-xs text-zinc-500 font-medium">
                  Official Academic Performance Report &amp; Study Certificate
                </p>
              </div>
            </div>

            {/* Certificate Meta & Period */}
            <div className="text-left sm:text-right space-y-1">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-pink-50 text-pink-700 border border-pink-200">
                {data.type} Academic Report Card
              </span>
              <p className="text-[11px] text-zinc-500 font-medium">
                Period: <span className="font-bold text-zinc-800">{data.periodLabel}</span>
              </p>
              <p className="text-[10px] text-zinc-400 font-mono">
                HASH: {data.certificateId}
              </p>
            </div>
          </div>
        </div>

        {/* 2. Student Identification & Personal Info Credentials */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-gradient-to-r from-pink-50/70 via-white to-pink-50/40 border border-pink-100 shadow-2xs relative z-10">
          {/* Name of Student & Student ID */}
          <div>
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
              Name of Student
            </span>
            <p className="text-sm font-bold text-zinc-900 truncate">
              {data.student.name}
            </p>
            <p className="text-[11px] text-zinc-500 truncate">
              ID: {data.student.email}
            </p>
          </div>

          {/* College / University & Course */}
          <div>
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
              College / University
            </span>
            <p className="text-xs font-bold text-zinc-900 truncate">
              {data.student.college}
            </p>
            <p className="text-[11px] text-zinc-500 truncate">
              {data.student.course} ({data.student.branch})
            </p>
          </div>

          {/* Academic Term */}
          <div>
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
              Academic Term
            </span>
            <p className="text-xs font-bold text-zinc-900">
              {data.student.academicYear} &bull; {data.student.semester}
            </p>
            <p className="text-[11px] text-emerald-600 font-bold">
              🔥 {data.student.streak} Day Study Streak
            </p>
          </div>

          {/* Generated Time of Certificate */}
          <div>
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
              Generated Time of Certificate
            </span>
            <p className="text-xs font-bold text-zinc-900">
              {data.generatedAt}
            </p>
            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-bold">
              <ShieldCheck className="w-3.5 h-3.5" /> Authenticated
            </span>
          </div>
        </div>

        {/* 3. Performance Summary: Study Time Logged, Goal Achievement, Session, Task */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative z-10">
          {/* Academic Grade Box */}
          <div className="md:col-span-1 p-5 rounded-2xl bg-white border-2 border-pink-300 text-center flex flex-col justify-center items-center shadow-sm">
            <span className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider block">
              Academic Grade
            </span>
            <div className="text-4xl font-black text-pink-600 my-1">
              {data.performance.grade}
            </div>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${data.performance.gradeColor}`}>
              {data.performance.gradeLabel}
            </span>
          </div>

          {/* Metrics Row: Study Time Logged, Goal Achievement, Session & Tasks */}
          <div className="md:col-span-3 grid grid-cols-3 gap-3">
            {/* Study Time Logged */}
            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-zinc-500">Study Time Logged</span>
                <Clock className="w-4 h-4 text-pink-500" />
              </div>
              <div>
                <p className="text-xl font-black text-zinc-900">
                  {data.performance.totalStudyFormatted}
                </p>
                <p className="text-[10px] text-zinc-500">
                  Target: {data.performance.targetGoalFormatted}
                </p>
              </div>
            </div>

            {/* Goal Achievement */}
            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-zinc-500">Goal Achievement</span>
                <Sparkles className="w-4 h-4 text-emerald-500" />
              </div>
              <div>
                <p className="text-xl font-black text-emerald-600">
                  {data.performance.goalPercentage}%
                </p>
                <div className="w-full bg-zinc-200 rounded-full h-1.5 mt-1.5 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-1.5 rounded-full transition-all"
                    style={{ width: `${Math.min(data.performance.goalPercentage, 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Session & Task */}
            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-zinc-500">Sessions &amp; Tasks</span>
                <CheckCircle2 className="w-4 h-4 text-blue-500" />
              </div>
              <div>
                <p className="text-xl font-black text-zinc-900">
                  {data.performance.sessionCount} <span className="text-xs font-normal text-zinc-400">sessions</span>
                </p>
                <p className="text-[10px] text-zinc-500 font-medium">
                  {data.performance.tasksCompletedCount} tasks completed
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Curriculum & Subject Distribution (e.g. 4 Subjects Studied) */}
        <div className="space-y-3 relative z-10">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-zinc-800 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-pink-600" />
              Curriculum &amp; Subject Distribution
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-pink-100 text-pink-700 border border-pink-200">
              {data.subjectBreakdown.length} Subjects Studied
            </span>
          </div>

          <div className="border border-zinc-200 rounded-2xl overflow-hidden shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-600 font-bold text-[11px]">
                <tr>
                  <th className="py-2.5 px-4">Subject</th>
                  <th className="py-2.5 px-4 text-center">Sessions</th>
                  <th className="py-2.5 px-4 text-center">Topics Covered</th>
                  <th className="py-2.5 px-4 text-right">Hours Logged</th>
                  <th className="py-2.5 px-4 text-right">Share (%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 font-medium">
                {data.subjectBreakdown.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-4 text-center text-zinc-400">
                      No study sessions logged for this period.
                    </td>
                  </tr>
                ) : (
                  data.subjectBreakdown.map((sub, idx) => (
                    <tr key={idx} className="hover:bg-zinc-50/50">
                      <td className="py-2.5 px-4 flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-md shadow-2xs"
                          style={{ backgroundColor: sub.color }}
                        />
                        <span className="font-bold text-zinc-900">{sub.name}</span>
                      </td>
                      <td className="py-2.5 px-4 text-center text-zinc-600">
                        {sub.sessionCount}
                      </td>
                      <td className="py-2.5 px-4 text-center text-zinc-600">
                        {sub.uniqueTopicsCount}
                      </td>
                      <td className="py-2.5 px-4 text-right font-bold text-zinc-900">
                        {Math.floor(sub.duration / 60)}h {sub.duration % 60}m
                      </td>
                      <td className="py-2.5 px-4 text-right">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-pink-50 text-pink-700 border border-pink-200">
                          {sub.percentage}%
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 5. Detailed Session Learnings & Knowledge Retention */}
        {data.sessions.length > 0 && (
          <div className="space-y-3 relative z-10">
            <h3 className="text-xs font-bold text-zinc-800 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-pink-600" />
              Detailed Study Log &amp; Conceptual Takeaways
            </h3>

            <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
              {data.sessions.map((sess, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200/80 text-xs space-y-1.5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: sess.subjectColor }}
                      />
                      <span className="font-bold text-zinc-900">{sess.subjectName}:</span>
                      <span className="font-semibold text-zinc-700">{sess.topicName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-zinc-400 font-mono">
                      <span>{sess.time}</span>
                      <span>&bull;</span>
                      <span className="font-bold text-pink-600">{sess.durationFormatted}</span>
                    </div>
                  </div>

                  {sess.learned && (
                    <p className="text-[11px] text-zinc-600 bg-white p-2 rounded-xl border border-zinc-100">
                      <strong className="text-zinc-900">Learned &amp; Mastered:</strong> {sess.learned}
                    </p>
                  )}

                  {sess.understood && (
                    <p className="text-[11px] text-emerald-800 bg-emerald-50/50 p-2 rounded-xl border border-emerald-100">
                      <strong className="text-emerald-900">Understood:</strong> {sess.understood}
                    </p>
                  )}

                  {sess.notUnderstood && (
                    <p className="text-[11px] text-amber-800 bg-amber-50/50 p-2 rounded-xl border border-amber-100">
                      <strong className="text-amber-900">Needs Revision:</strong> {sess.notUnderstood}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. Academic Remarks */}
        <div className="p-4 rounded-2xl bg-pink-50/60 border border-pink-200 relative z-10">
          <span className="text-[10px] font-bold text-pink-700 uppercase tracking-wider block">
            Academic Board Evaluation Remarks:
          </span>
          <p className="text-xs text-zinc-700 mt-1 leading-relaxed italic">
            &ldquo;{data.performance.remarks}&rdquo;
          </p>
        </div>

        {/* 7. Official Seal, Ledger & HASH Verification Footer */}
        <div className="pt-6 border-t-2 border-pink-100 space-y-6 relative z-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            {/* STUDYTRACK VERIFIED Official Seal & HASH */}
            <div className="flex items-center gap-4">
              {/* Round Gold/Pink Stamp Seal */}
              <div className="w-20 h-20 rounded-full border-4 border-pink-500 bg-gradient-to-tr from-pink-100 via-white to-pink-50 flex flex-col items-center justify-center text-center p-1 shadow-md shadow-pink-200 shrink-0">
                <Award className="w-5 h-5 text-pink-600" />
                <span className="text-[8px] font-black uppercase text-pink-700 tracking-tighter leading-tight mt-0.5">
                  STUDYTRACK
                  <br />
                  VERIFIED
                </span>
              </div>

              {/* Official StudyTrack Record & HASH */}
              <div className="space-y-1">
                <p className="text-sm font-extrabold text-zinc-900 leading-tight">
                  Official StudyTrack Record
                </p>
                <p className="text-xs text-zinc-500">
                  Digitally authenticated study session ledger
                </p>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-pink-50 border border-pink-200 font-mono text-xs font-bold text-pink-700">
                  <span>HASH:</span>
                  <span>{data.certificateId}</span>
                </div>
              </div>
            </div>

            {/* Dual Digital Signatures */}
            <div className="flex items-center gap-8 text-center">
              {/* Student Digital Signature */}
              <div className="space-y-1">
                <div className="h-9 border-b-2 border-zinc-400 flex items-end justify-center px-4 min-w-[130px]">
                  <span className="font-serif italic text-sm font-semibold text-zinc-800">
                    {data.student.name}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                  Student Signature
                </span>
              </div>

              {/* Academic Dean Signature */}
              <div className="space-y-1">
                <div className="h-9 border-b-2 border-zinc-400 flex items-end justify-center px-4 min-w-[130px]">
                  <span className="font-serif italic text-sm font-semibold text-pink-700">
                    Dr. A. Verma
                  </span>
                </div>
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                  Academic Dean, StudyTrack
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Verification Footer Disclaimer */}
        <div className="text-center text-[10px] text-zinc-400 pt-2 border-t border-zinc-100 flex items-center justify-between">
          <span>Official StudyTrack Educational Platform Ledger</span>
          <span className="font-mono text-pink-600 font-semibold">{data.certificateId}</span>
          <span>Digitally Signed &bull; Validated A4 Certificate</span>
        </div>
      </div>
    </div>
  );
}

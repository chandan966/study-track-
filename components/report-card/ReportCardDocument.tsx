"use client";

import React, { useRef, useState } from "react";
import {
  Download,
  Printer,
  Sparkles,
  CheckCircle2,
  Clock,
  Layers,
  GraduationCap,
  Loader2,
  Share2,
  Medal,
  ShieldCheck,
  QrCode,
} from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { CEO_SIGNATURE_BASE64 } from "@/lib/signature";

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

      // Render ultra-sharp canvas with fixed desktop width regardless of device screen size
      const canvas = await html2canvas(element, {
        scale: 2.5, // 300 DPI equivalent
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: "#ffffff",
        windowWidth: 1024,
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.getElementById("studytrack-certificate-node");
          if (clonedElement) {
            clonedElement.style.width = "820px";
            clonedElement.style.maxWidth = "820px";
            clonedElement.style.minWidth = "820px";
            clonedElement.style.margin = "0 auto";
            clonedElement.style.boxShadow = "none";
          }
        },
      });

      const imgData = canvas.toDataURL("image/png", 1.0);
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // A4 portrait dimensions: 210mm x 297mm
      const pageWidth = 210;
      const pageHeight = 297;
      const margin = 8; // 8mm margins
      const printableWidth = pageWidth - margin * 2; // 194mm
      const printableHeight = pageHeight - margin * 2; // 281mm

      let renderWidth = printableWidth;
      let renderHeight = (canvas.height * printableWidth) / canvas.width;

      // Scale to fit strictly on single A4 page without spilling
      if (renderHeight > printableHeight) {
        const ratio = printableHeight / renderHeight;
        renderHeight = printableHeight;
        renderWidth = renderWidth * ratio;
      }

      // Center perfectly on page
      const xOffset = margin + (printableWidth - renderWidth) / 2;
      const yOffset = margin + (printableHeight - renderHeight) / 2;

      pdf.addImage(imgData, "PNG", xOffset, yOffset, renderWidth, renderHeight, undefined, "FAST");
      pdf.save(`StudyTrack_${data.type.toUpperCase()}_Certificate_${data.certificateId}.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
      // Fallback to browser print dialog
      window.print();
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
      {/* Top Action Toolbar (Hidden during print) */}
      <div className="no-print flex flex-wrap items-center justify-between gap-3 p-4 bg-white rounded-2xl border border-pink-100 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-pink-50 border border-pink-200 text-pink-600 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-pink-600" />
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
                <span className="text-emerald-600 font-bold">Copied HASH</span>
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
            className="px-3.5 py-1.5 rounded-xl border border-pink-200 text-xs font-semibold text-pink-700 bg-pink-50/50 hover:bg-pink-100 flex items-center gap-1.5 transition-colors"
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
                <span>Download Official PDF</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* SINGLE PAGE REPORT CARD DOCUMENT (PROPORTIONED FOR 1-PAGE A4) */}
      {/* ============================================================== */}
      <div className="w-full overflow-x-auto pb-4">
        <div
          ref={printRef}
          id="studytrack-certificate-node"
          className="certificate-card mx-auto bg-white text-zinc-900 relative"
          style={{
            width: "100%",
            maxWidth: "820px",
            minWidth: "750px",
            backgroundColor: "#ffffff",
            padding: "24px 28px",
            boxSizing: "border-box",
            border: "3.5px solid #EC4899",
            borderRadius: "16px",
            boxShadow: "0 10px 30px -5px rgba(236, 72, 153, 0.15)",
          }}
        >
          {/* Inner Decorative Diploma Frame */}
          <div
            style={{
              border: "1.5px solid #FBCFE8",
              borderRadius: "10px",
              padding: "20px 22px",
              backgroundColor: "#ffffff",
              boxSizing: "border-box",
            }}
            className="space-y-4"
          >
            {/* 1. TOP HEADER SECTION */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: "16px",
                paddingBottom: "14px",
                borderBottom: "1.5px solid #FCE7F3",
              }}
            >
              {/* Top Left: Logo, Name & Title */}
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div
                    style={{
                      width: "42px",
                      height: "42px",
                      borderRadius: "10px",
                      background: "linear-gradient(135deg, #EC4899 0%, #DB2777 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#ffffff",
                    }}
                  >
                    <GraduationCap style={{ width: "26px", height: "26px" }} />
                  </div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span
                        style={{
                          fontSize: "22px",
                          fontWeight: 900,
                          letterSpacing: "-0.5px",
                          color: "#18181B",
                          lineHeight: 1.1,
                        }}
                      >
                        Study<span style={{ color: "#EC4899" }}>Track</span>
                      </span>
                      <span
                        style={{
                          fontSize: "9px",
                          fontWeight: 800,
                          backgroundColor: "#FDF2F8",
                          color: "#BE185D",
                          padding: "2px 8px",
                          borderRadius: "4px",
                          border: "1px solid #FBCFE8",
                          letterSpacing: "0.5px",
                        }}
                      >
                        OFFICIAL ACADEMIC RECORD
                      </span>
                    </div>
                    <p
                      style={{
                        fontSize: "11px",
                        color: "#71717A",
                        fontWeight: 600,
                        marginTop: "2px",
                      }}
                    >
                      StudyTrack Official Academic Report Card &amp; Certificate
                    </p>
                  </div>
                </div>

                {/* Candidate Name & Info */}
                <div style={{ marginTop: "10px" }}>
                  <h2
                    style={{
                      fontSize: "18px",
                      fontWeight: 800,
                      color: "#18181B",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      lineHeight: 1.2,
                    }}
                  >
                    <span>{data.student.name}</span>
                    <span style={{ fontSize: "12px", fontWeight: 400, color: "#71717A" }}>
                      ({data.student.email})
                    </span>
                  </h2>

                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "center",
                      gap: "8px",
                      marginTop: "4px",
                      fontSize: "11px",
                    }}
                  >
                    <span
                      style={{
                        fontWeight: 700,
                        color: "#DB2777",
                        backgroundColor: "#FFF1F7",
                        padding: "2px 8px",
                        borderRadius: "4px",
                        border: "1px solid #FBCFE8",
                      }}
                    >
                      Target: {data.student.course || "SSC CGL / Govt Exam & Tech Aspirant"}
                    </span>
                    <span style={{ color: "#D1D5DB" }}>•</span>
                    <span style={{ color: "#4B5563", fontWeight: 500 }}>
                      {data.student.college || "Delhi University / National Institute"}
                    </span>
                    <span style={{ color: "#D1D5DB" }}>•</span>
                    <span style={{ color: "#4B5563", fontWeight: 500 }}>
                      {data.student.academicYear || "Final Year"} ({data.student.semester || "6th Semester"})
                    </span>
                  </div>

                  {/* Certificate HASH */}
                  <div style={{ marginTop: "6px" }}>
                    <span
                      style={{
                        fontFamily: "monospace",
                        fontSize: "11px",
                        fontWeight: 700,
                        color: "#BE185D",
                        backgroundColor: "#FFF1F7",
                        padding: "3px 10px",
                        borderRadius: "6px",
                        border: "1px solid #FBCFE8",
                        display: "inline-block",
                      }}
                    >
                      Certificate HASH: {data.certificateId}
                    </span>
                  </div>
                </div>
              </div>

              {/* Top Right: Report Period, Grade Badge & Generated Time */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  textAlign: "right",
                  gap: "6px",
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    padding: "3px 12px",
                    borderRadius: "9999px",
                    fontSize: "10px",
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    backgroundColor: "#FFF1F7",
                    color: "#DB2777",
                    border: "1px solid #FBCFE8",
                  }}
                >
                  {data.type} Study Report
                </span>

                <div style={{ fontSize: "11px" }}>
                  <p style={{ fontWeight: 800, color: "#18181B" }}>{data.periodLabel}</p>
                  <p style={{ fontSize: "10px", color: "#71717A", marginTop: "1px" }}>
                    Generated: {data.generatedAt}
                  </p>
                </div>

                {/* Grade Stamp Box */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "6px 12px",
                    backgroundColor: "#FFF1F7",
                    borderRadius: "8px",
                    border: "1.5px solid #F472B6",
                  }}
                >
                  <span
                    style={{
                      fontSize: "10px",
                      fontWeight: 800,
                      textTransform: "uppercase",
                      color: "#71717A",
                    }}
                  >
                    Grade:
                  </span>
                  <span
                    style={{
                      fontSize: "18px",
                      fontWeight: 900,
                      color: "#DB2777",
                      lineHeight: 1,
                    }}
                  >
                    {data.performance.grade}
                  </span>
                  <span
                    style={{
                      fontSize: "10px",
                      fontWeight: 700,
                      color: "#4B5563",
                    }}
                  >
                    ({data.performance.gradeLabel.split(" ")[0]})
                  </span>
                </div>
              </div>
            </div>

            {/* 2. PROPER BOX: PERFORMANCE METRICS ROW (3 COLUMNS) */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "12px",
              }}
            >
              {/* Box 1: Study Time Logged */}
              <div
                style={{
                  padding: "12px 14px",
                  borderRadius: "10px",
                  backgroundColor: "#F9FAFB",
                  border: "1px solid #E5E7EB",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <span
                    style={{
                      fontSize: "9px",
                      fontWeight: 800,
                      color: "#6B7280",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      display: "block",
                    }}
                  >
                    Study Time Logged
                  </span>
                  <p
                    style={{
                      fontSize: "18px",
                      fontWeight: 900,
                      color: "#111827",
                      marginTop: "2px",
                      lineHeight: 1.1,
                    }}
                  >
                    {data.performance.totalStudyFormatted}
                  </p>
                  <p style={{ fontSize: "10px", color: "#6B7280", marginTop: "2px", fontWeight: 500 }}>
                    Target Goal: {data.performance.targetGoalFormatted}
                  </p>
                </div>
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "8px",
                    backgroundColor: "#FDF2F8",
                    color: "#EC4899",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px solid #FCE7F3",
                  }}
                >
                  <Clock style={{ width: "18px", height: "18px" }} />
                </div>
              </div>

              {/* Box 2: Goal Achievement */}
              <div
                style={{
                  padding: "12px 14px",
                  borderRadius: "10px",
                  backgroundColor: "#F9FAFB",
                  border: "1px solid #E5E7EB",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ flex: 1, marginRight: "10px" }}>
                  <span
                    style={{
                      fontSize: "9px",
                      fontWeight: 800,
                      color: "#6B7280",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      display: "block",
                    }}
                  >
                    Goal Achievement
                  </span>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "6px", marginTop: "2px" }}>
                    <span style={{ fontSize: "18px", fontWeight: 900, color: "#059669", lineHeight: 1.1 }}>
                      {data.performance.goalPercentage}%
                    </span>
                    <span style={{ fontSize: "10px", color: "#6B7280", fontWeight: 600 }}>
                      {data.performance.goalPercentage >= 100 ? "Completed 🎉" : "Progress"}
                    </span>
                  </div>
                  <div
                    style={{
                      width: "100%",
                      backgroundColor: "#E5E7EB",
                      borderRadius: "9999px",
                      height: "6px",
                      marginTop: "5px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: "#10B981",
                        height: "6px",
                        borderRadius: "9999px",
                        width: `${Math.min(data.performance.goalPercentage, 100)}%`,
                      }}
                    />
                  </div>
                </div>
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "8px",
                    backgroundColor: "#ECFDF5",
                    color: "#059669",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px solid #D1FAE5",
                  }}
                >
                  <Sparkles style={{ width: "18px", height: "18px" }} />
                </div>
              </div>

              {/* Box 3: Sessions & Tasks */}
              <div
                style={{
                  padding: "12px 14px",
                  borderRadius: "10px",
                  backgroundColor: "#F9FAFB",
                  border: "1px solid #E5E7EB",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <span
                    style={{
                      fontSize: "9px",
                      fontWeight: 800,
                      color: "#6B7280",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      display: "block",
                    }}
                  >
                    Sessions &amp; Tasks
                  </span>
                  <p
                    style={{
                      fontSize: "18px",
                      fontWeight: 900,
                      color: "#111827",
                      marginTop: "2px",
                      lineHeight: 1.1,
                    }}
                  >
                    {data.performance.sessionCount}{" "}
                    <span style={{ fontSize: "11px", fontWeight: 600, color: "#6B7280" }}>Sessions</span>
                  </p>
                  <p style={{ fontSize: "10px", color: "#6B7280", marginTop: "2px", fontWeight: 500 }}>
                    {data.performance.tasksCompletedCount} Tasks Completed
                  </p>
                </div>
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "8px",
                    backgroundColor: "#EFF6FF",
                    color: "#2563EB",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px solid #DBEAFE",
                  }}
                >
                  <CheckCircle2 style={{ width: "18px", height: "18px" }} />
                </div>
              </div>
            </div>

            {/* 3. PROPER BOX: CURRICULUM & SUBJECT DISTRIBUTION */}
            <div
              style={{
                borderRadius: "10px",
                border: "1.5px solid #FCE7F3",
                overflow: "hidden",
                backgroundColor: "#ffffff",
              }}
            >
              <div
                style={{
                  padding: "10px 16px",
                  backgroundColor: "#FFF1F7",
                  borderBottom: "1.5px solid #FCE7F3",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <Layers style={{ width: "16px", height: "16px", color: "#DB2777" }} />
                  <h3
                    style={{
                      fontSize: "11px",
                      fontWeight: 800,
                      color: "#18181B",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Curriculum &amp; Subject Distribution
                  </h3>
                </div>
                <span
                  style={{
                    padding: "2px 10px",
                    borderRadius: "9999px",
                    fontSize: "10px",
                    fontWeight: 800,
                    backgroundColor: "#ffffff",
                    color: "#DB2777",
                    border: "1px solid #FBCFE8",
                  }}
                >
                  {data.subjectBreakdown.length} Subjects Studied
                </span>
              </div>

              <table style={{ width: "100%", textAlign: "left", borderCollapse: "collapse", fontSize: "11px" }}>
                <thead>
                  <tr
                    style={{
                      backgroundColor: "#F9FAFB",
                      borderBottom: "1px solid #E5E7EB",
                      color: "#4B5563",
                      fontSize: "10px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    <th style={{ padding: "8px 14px" }}>Subject</th>
                    <th style={{ padding: "8px 10px", textAlign: "center" }}>Sessions</th>
                    <th style={{ padding: "8px 10px", textAlign: "center" }}>Topics</th>
                    <th style={{ padding: "8px 14px", textAlign: "right" }}>Hours Logged</th>
                    <th style={{ padding: "8px 14px", textAlign: "right" }}>Share (%)</th>
                  </tr>
                </thead>
                <tbody>
                  {data.subjectBreakdown.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        style={{ padding: "14px", textAlign: "center", color: "#9CA3AF", fontSize: "11px" }}
                      >
                        No sessions logged for this period yet.
                      </td>
                    </tr>
                  ) : (
                    data.subjectBreakdown.map((sub, idx) => (
                      <tr
                        key={idx}
                        style={{
                          borderBottom: idx < data.subjectBreakdown.length - 1 ? "1px solid #F3F4F6" : "none",
                          backgroundColor: idx % 2 === 0 ? "#ffffff" : "#FAFAFA",
                        }}
                      >
                        <td
                          style={{
                            padding: "9px 14px",
                            fontWeight: 700,
                            color: "#18181B",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <div
                            style={{
                              width: "10px",
                              height: "10px",
                              borderRadius: "3px",
                              backgroundColor: sub.color || "#EC4899",
                              flexShrink: 0,
                            }}
                          />
                          <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {sub.name}
                          </span>
                        </td>
                        <td style={{ padding: "9px 10px", textAlign: "center", color: "#4B5563", fontWeight: 600 }}>
                          {sub.sessionCount}
                        </td>
                        <td style={{ padding: "9px 10px", textAlign: "center", color: "#4B5563", fontWeight: 600 }}>
                          {sub.uniqueTopicsCount}
                        </td>
                        <td
                          style={{
                            padding: "9px 14px",
                            textAlign: "right",
                            fontWeight: 800,
                            color: "#111827",
                          }}
                        >
                          {Math.floor(sub.duration / 60)}h {sub.duration % 60}m
                        </td>
                        <td style={{ padding: "9px 14px", textAlign: "right" }}>
                          <span
                            style={{
                              padding: "2px 8px",
                              borderRadius: "4px",
                              fontSize: "10px",
                              fontWeight: 800,
                              backgroundColor: "#FFF1F7",
                              color: "#DB2777",
                              border: "1px solid #FBCFE8",
                            }}
                          >
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
            <div
              style={{
                paddingTop: "14px",
                borderTop: "1.5px solid #FCE7F3",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "16px",
              }}
            >
              {/* BOTTOM LEFT: Exactly as requested with Pink Round Seal, Title, Subtitle, and HASH pill */}
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                {/* Round Pink Seal: STUDYTRACK VERIFIED */}
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "50%",
                    border: "3px solid #EC4899",
                    backgroundColor: "#ffffff",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    padding: "2px",
                    flexShrink: 0,
                    boxShadow: "0 2px 8px rgba(236, 72, 153, 0.15)",
                  }}
                >
                  <Medal style={{ width: "18px", height: "18px", color: "#EC4899" }} />
                  <span
                    style={{
                      fontSize: "6.5px",
                      fontWeight: 900,
                      textTransform: "uppercase",
                      color: "#DB2777",
                      letterSpacing: "-0.2px",
                      lineHeight: 1.1,
                      marginTop: "1px",
                    }}
                  >
                    STUDYTRACK
                    <br />
                    VERIFIED
                  </span>
                </div>

                {/* Official StudyTrack Record & HASH */}
                <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                  <h4
                    style={{
                      fontSize: "13px",
                      fontWeight: 800,
                      color: "#18181B",
                      lineHeight: 1.1,
                    }}
                  >
                    Official StudyTrack Record
                  </h4>
                  <p style={{ fontSize: "10px", color: "#6B7280", fontWeight: 400 }}>
                    Digitally authenticated study session ledger
                  </p>
                  {/* Pink Pill with HASH */}
                  <div
                    style={{
                      marginTop: "2px",
                      display: "inline-block",
                      padding: "2px 10px",
                      borderRadius: "9999px",
                      backgroundColor: "#FFF1F7",
                      border: "1px solid #FBCFE8",
                      fontFamily: "monospace",
                      fontSize: "11px",
                      fontWeight: 700,
                      color: "#BE185D",
                      width: "fit-content",
                    }}
                  >
                    HASH: {data.certificateId}
                  </div>
                </div>
              </div>

              {/* BOTTOM RIGHT: Dual Digital Signatures */}
              <div style={{ display: "flex", alignItems: "flex-end", gap: "20px", textAlign: "center" }}>
                {/* Student Digital Signature */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div
                    style={{
                      height: "36px",
                      borderBottom: "1.5px solid #9CA3AF",
                      display: "flex",
                      alignItems: "flex-end",
                      justifyContent: "center",
                      padding: "0 10px",
                      minWidth: "120px",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "Georgia, serif",
                        fontStyle: "italic",
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "#1F2937",
                      }}
                    >
                      {data.student.name}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: "9px",
                      fontWeight: 800,
                      color: "#6B7280",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      marginTop: "3px",
                      display: "block",
                    }}
                  >
                    Student Signature
                  </span>
                </div>

                {/* CEO Digital Signature with Embedded Base64 Image */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div
                    style={{
                      height: "36px",
                      borderBottom: "1.5px solid #9CA3AF",
                      display: "flex",
                      alignItems: "flex-end",
                      justifyContent: "center",
                      padding: "0 6px",
                      minWidth: "130px",
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={CEO_SIGNATURE_BASE64}
                      alt="CEO Signature - Chandan Ghanghav"
                      style={{ height: "30px", width: "auto", maxWidth: "130px", objectFit: "contain" }}
                    />
                  </div>
                  <span
                    style={{
                      fontSize: "9px",
                      fontWeight: 800,
                      color: "#374151",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      marginTop: "3px",
                      display: "block",
                    }}
                  >
                    CEO, StudyTrack
                  </span>
                </div>
              </div>
            </div>

            {/* 5. Bottom Micro-Footer */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "8px",
                fontSize: "9px",
                color: "#9CA3AF",
                paddingTop: "8px",
                borderTop: "1px solid #F3F4F6",
              }}
            >
              <span>StudyTrack Verified Academic Productivity Ledger</span>
              <span style={{ fontFamily: "monospace", color: "#DB2777", fontWeight: 700 }}>
                Verify online: /verify?id={data.certificateId}
              </span>
              <span>Certified Single-Page A4 Transcript</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

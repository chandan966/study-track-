"use client";

import React, { useState, useEffect } from "react";
import {
  Award,
  Calendar,
  CalendarDays,
  BarChart2,
  Sparkles,
  Loader2,
  FileCheck2,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { ReportCardDocument, ReportCardData } from "@/components/report-card/ReportCardDocument";
import { format } from "date-fns";

export default function ReportCardPage() {
  const [reportType, setReportType] = useState<"daily" | "weekly" | "monthly">("daily");
  const [selectedDate, setSelectedDate] = useState<string>(
    format(new Date(), "yyyy-MM-dd")
  );
  const [reportData, setReportData] = useState<ReportCardData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReport = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/report-card?type=${reportType}&date=${selectedDate}`
      );
      if (!res.ok) {
        throw new Error("Failed to load report card data");
      }
      const data = await res.json();
      setReportData(data);
    } catch (err: any) {
      setError(err.message || "Failed to load report card");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [reportType, selectedDate]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-zinc-900 tracking-tight">
              Academic Report Card &amp; Certificates
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-pink-100 text-pink-700 border border-pink-200">
              Verified PDF Export
            </span>
          </div>
          <p className="text-xs text-zinc-500 mt-1">
            Generate and download official PDF report cards for your whole day, weekly velocity, or monthly academic progress.
          </p>
        </div>

        {/* Filter Controls Row */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Period Selector Tabs */}
          <div className="flex items-center p-1 rounded-2xl bg-white border border-pink-100 shadow-2xs text-xs font-semibold">
            <button
              onClick={() => setReportType("daily")}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                reportType === "daily"
                  ? "bg-gradient-to-r from-pink-600 to-pink-500 text-white shadow-xs font-bold"
                  : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              📅 Daily
            </button>
            <button
              onClick={() => setReportType("weekly")}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                reportType === "weekly"
                  ? "bg-gradient-to-r from-pink-600 to-pink-500 text-white shadow-xs font-bold"
                  : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              📊 Weekly
            </button>
            <button
              onClick={() => setReportType("monthly")}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                reportType === "monthly"
                  ? "bg-gradient-to-r from-pink-600 to-pink-500 text-white shadow-xs font-bold"
                  : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              🏆 Monthly
            </button>
          </div>

          {/* Date Picker */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl border border-pink-100 bg-white shadow-2xs text-xs">
            <Calendar className="w-3.5 h-3.5 text-pink-500" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent text-xs text-zinc-700 outline-hidden font-medium"
            />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <div className="min-h-[450px] bg-white rounded-3xl border border-pink-100 flex flex-col items-center justify-center gap-3 shadow-xs">
          <Loader2 className="w-8 h-8 text-pink-600 animate-spin" />
          <p className="text-xs font-semibold text-zinc-500">
            Compiling Academic Ledger &amp; Generating Report Card...
          </p>
        </div>
      ) : error ? (
        <div className="p-6 bg-red-50 border border-red-200 text-red-700 rounded-3xl text-xs text-center">
          {error}
        </div>
      ) : reportData ? (
        <ReportCardDocument data={reportData} />
      ) : null}
    </div>
  );
}

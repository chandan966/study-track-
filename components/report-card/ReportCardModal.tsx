"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Calendar,
  Sparkles,
  Award,
  Loader2,
  CalendarDays,
  BarChart2,
  Clock,
} from "lucide-react";
import { ReportCardDocument, ReportCardData } from "./ReportCardDocument";
import { format } from "date-fns";

interface ReportCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: "daily" | "weekly" | "monthly";
}

export function ReportCardModal({
  isOpen,
  onClose,
  defaultType = "daily",
}: ReportCardModalProps) {
  const [reportType, setReportType] = useState<"daily" | "weekly" | "monthly">(defaultType);
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
        throw new Error("Failed to fetch report card data");
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
    if (isOpen) {
      fetchReport();
    }
  }, [isOpen, reportType, selectedDate]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-zinc-50 rounded-3xl w-full max-w-5xl max-h-[94vh] flex flex-col shadow-2xl border border-pink-100 overflow-hidden">
        {/* Modal Top Bar */}
        <div className="px-6 py-4 bg-white border-b border-zinc-100 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-600 to-pink-500 text-white flex items-center justify-center shadow-md shadow-pink-500/20">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-zinc-900">
                Study Report Card &amp; Academic Certificate
              </h2>
              <p className="text-xs text-zinc-500">
                Generate and download your verified daily, weekly, or monthly academic progress report.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Period Type Selector Pills */}
            <div className="flex items-center p-1 rounded-xl bg-zinc-100 border border-zinc-200 text-xs font-semibold">
              <button
                onClick={() => setReportType("daily")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  reportType === "daily"
                    ? "bg-white text-pink-600 shadow-xs font-bold"
                    : "text-zinc-600 hover:text-zinc-900"
                }`}
              >
                Daily
              </button>
              <button
                onClick={() => setReportType("weekly")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  reportType === "weekly"
                    ? "bg-white text-pink-600 shadow-xs font-bold"
                    : "text-zinc-600 hover:text-zinc-900"
                }`}
              >
                Weekly
              </button>
              <button
                onClick={() => setReportType("monthly")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  reportType === "monthly"
                    ? "bg-white text-pink-600 shadow-xs font-bold"
                    : "text-zinc-600 hover:text-zinc-900"
                }`}
              >
                Monthly
              </button>
            </div>

            {/* Date Input */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-200 bg-white text-xs">
              <Calendar className="w-3.5 h-3.5 text-zinc-400" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent text-xs text-zinc-700 outline-hidden font-medium"
              />
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {isLoading ? (
            <div className="min-h-[400px] flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 text-pink-600 animate-spin" />
              <p className="text-xs font-semibold text-zinc-500">
                Compiling Academic Report Card &amp; Generating Certificate...
              </p>
            </div>
          ) : error ? (
            <div className="p-6 text-center text-xs text-red-600 bg-red-50 rounded-2xl border border-red-200">
              {error}
            </div>
          ) : reportData ? (
            <ReportCardDocument data={reportData} />
          ) : null}
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  CalendarDays,
  BarChart3,
  ArrowRight,
  Clock,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, parseISO } from "date-fns";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatMinutes } from "@/lib/utils";

const MULTI_COLORS = [
  "#EC4899", // Vibrant Pink
  "#8B5CF6", // Electric Violet
  "#0284C7", // Sky Blue
  "#10B981", // Emerald
  "#F59E0B", // Amber Gold
  "#6366F1", // Indigo
  "#F43F5E", // Rose
];

export function DashboardVisualHub() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 10, 1)); // November 2026 default
  const [calendarDays, setCalendarDays] = useState<Record<string, any>>({});
  const [selectedDayKey, setSelectedDayKey] = useState<string>(format(new Date(2026, 10, 14), "yyyy-MM-dd"));
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadVisualData = async () => {
      try {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        const [calRes, anaRes] = await Promise.all([
          fetch(`/api/calendar?year=${year}&month=${month}`),
          fetch(`/api/analytics?range=7d`),
        ]);
        if (calRes.ok) {
          const calJson = await calRes.json();
          setCalendarDays(calJson.days || {});
        }
        if (anaRes.ok) {
          const anaJson = await anaRes.json();
          setAnalyticsData(anaJson);
        }
      } catch (e) {
        console.error("Failed to load visual hub data", e);
      } finally {
        setIsLoading(false);
      }
    };
    loadVisualData();
  }, [currentDate]);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDayOfWeek = getDay(monthStart);

  const selectedData = calendarDays[selectedDayKey];
  const selectedDateObj = selectedDayKey ? parseISO(selectedDayKey) : new Date();

  const dailyChart = analyticsData?.dailyChartData || [];
  const subjectDistribution = analyticsData?.subjectDistribution || [];

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-500 via-pink-500 to-purple-600 text-white flex items-center justify-center shadow-md shadow-pink-200">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black tracking-tight text-zinc-900">
              Interactive Calendar &amp; Visual Analytics Hub
            </h2>
            <p className="text-xs text-zinc-500">
              Live multi-colored heatmaps, subject dots, and 7-day velocity charts.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/calendar"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-pink-200 text-xs font-bold text-brand-600 hover:bg-brand-50 shadow-2xs"
          >
            <CalendarDays className="w-3.5 h-3.5" /> Full Calendar
          </Link>
          <Link
            href="/analytics"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-pink-200 text-xs font-bold text-purple-600 hover:bg-purple-50 shadow-2xs"
          >
            <BarChart3 className="w-3.5 h-3.5" /> Full Analytics
          </Link>
        </div>
      </div>

      {/* Grid: Calendar on Left (7 cols), Analytics on Right (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ============================================================== */}
        {/* 1. INTERACTIVE MULTI-COLOR CALENDAR WIDGET (7 Cols)           */}
        {/* ============================================================== */}
        <div className="lg:col-span-7">
          <Card className="border-pink-100 shadow-md bg-white overflow-hidden h-full flex flex-col justify-between">
            <CardHeader className="bg-gradient-to-r from-brand-50 via-pink-50/40 to-white py-3.5 px-5 border-b border-pink-100 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-brand-500" />
                <CardTitle className="text-sm font-black text-zinc-900">
                  {format(currentDate, "MMMM yyyy")} Heatmap
                </CardTitle>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    const prev = new Date(currentDate);
                    prev.setMonth(prev.getMonth() - 1);
                    setCurrentDate(prev);
                  }}
                  className="p-1 rounded-lg border border-pink-200 hover:bg-brand-50 text-zinc-600"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    const next = new Date(currentDate);
                    next.setMonth(next.getMonth() + 1);
                    setCurrentDate(next);
                  }}
                  className="p-1 rounded-lg border border-pink-200 hover:bg-brand-50 text-zinc-600"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </CardHeader>

            <CardContent className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-1.5 mb-1.5 text-center text-[11px] font-extrabold text-zinc-400">
                <span className="text-rose-400">Su</span>
                <span>Mo</span>
                <span>Tu</span>
                <span>We</span>
                <span>Th</span>
                <span>Fr</span>
                <span className="text-brand-500">Sa</span>
              </div>

              {/* Grid of Days */}
              <div className="grid grid-cols-7 gap-1.5">
                {Array.from({ length: startDayOfWeek }).map((_, i) => (
                  <div key={`emp-${i}`} className="h-14 rounded-xl bg-zinc-50/30 opacity-20" />
                ))}

                {monthDays.map((day) => {
                  const dateKey = format(day, "yyyy-MM-dd");
                  const info = calendarDays[dateKey];
                  const isSelected = selectedDayKey === dateKey;
                  const totalMins = info?.totalMinutes || 0;
                  const subjects = info?.subjectSummary ? Object.values(info.subjectSummary) : [];

                  let cellStyle = "bg-white text-zinc-700 border-zinc-100";
                  if (info?.intensity === "high") {
                    cellStyle = "bg-gradient-to-br from-brand-500 to-rose-500 text-white font-extrabold shadow-2xs";
                  } else if (info?.intensity === "medium") {
                    cellStyle = "bg-brand-100/90 text-brand-900 font-bold border-brand-200";
                  } else if (info?.intensity === "low") {
                    cellStyle = "bg-brand-50/70 text-brand-800 font-semibold border-brand-100";
                  }

                  return (
                    <button
                      key={dateKey}
                      onClick={() => setSelectedDayKey(dateKey)}
                      className={`h-14 p-1.5 rounded-xl border flex flex-col justify-between text-left transition-all relative ${cellStyle} ${
                        isSelected ? "ring-2 ring-brand-500 ring-offset-1 scale-105 z-10 shadow-sm" : "hover:border-pink-200"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-xs font-black">{format(day, "d")}</span>
                        {info?.isGoalCompleted && (
                          <span className="w-1.5 h-1.5 rounded-full bg-white ring-1 ring-pink-300" />
                        )}
                      </div>

                      {/* Multi-Color Subject Dots */}
                      <div className="flex items-center gap-0.5 flex-wrap overflow-hidden">
                        {subjects.slice(0, 3).map((sub: any, idx: number) => (
                          <span
                            key={sub.name + idx}
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: sub.color || MULTI_COLORS[idx % MULTI_COLORS.length] }}
                          />
                        ))}
                      </div>

                      <div className="text-[9px] font-bold truncate">
                        {totalMins > 0 ? formatMinutes(totalMins) : ""}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Selected Day Quick Inspector Pill */}
              <div className="mt-4 p-3 rounded-xl bg-gradient-to-r from-zinc-50 via-white to-pink-50/40 border border-pink-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-zinc-900">{format(selectedDateObj, "dd MMM yyyy")}:</span>
                  <span className="font-black text-brand-600 font-mono">
                    {selectedData ? formatMinutes(selectedData.totalMinutes) : "0m studied"}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {selectedData && Object.values(selectedData.subjectSummary).slice(0, 3).map((sub: any) => (
                    <span
                      key={sub.name}
                      className="px-2 py-0.5 rounded-md text-[10px] font-bold text-white shadow-2xs"
                      style={{ backgroundColor: sub.color || "#EC4899" }}
                    >
                      {sub.name}
                    </span>
                  ))}
                  {selectedData?.isGoalCompleted && (
                    <Badge variant="pink" className="text-[10px] font-bold">Goal Met 🎉</Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ============================================================== */}
        {/* 2. VIBRANT MULTI-COLOR ANALYTICS WIDGET (5 Cols)              */}
        {/* ============================================================== */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="border-pink-100 shadow-md bg-white overflow-hidden h-full flex flex-col justify-between">
            <CardHeader className="bg-gradient-to-r from-purple-50/40 via-white to-brand-50/80 py-3.5 px-5 border-b border-pink-100 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-purple-600" />
                <CardTitle className="text-sm font-black text-zinc-900">
                  Subject &amp; Weekly Analytics
                </CardTitle>
              </div>
              <Badge variant="pink" className="text-[10px] font-bold">
                Live Data
              </Badge>
            </CardHeader>

            <CardContent className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
              {/* Donut Chart */}
              <div className="flex items-center gap-4">
                <div className="h-36 w-36 shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={subjectDistribution}
                        dataKey="minutes"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={36}
                        outerRadius={56}
                        paddingAngle={3}
                      >
                        {subjectDistribution.map((entry: any, index: number) => (
                          <Cell
                            key={`hub-cell-${index}`}
                            fill={entry.color || MULTI_COLORS[index % MULTI_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: any) => [formatMinutes(Number(value)), "Study Time"]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-1.5 flex-1 max-h-36 overflow-y-auto pr-1">
                  {subjectDistribution.slice(0, 4).map((sub: any, idx: number) => {
                    const color = sub.color || MULTI_COLORS[idx % MULTI_COLORS.length];
                    return (
                      <div key={sub.name} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5 line-clamp-1">
                          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                          <span className="font-bold text-zinc-800 truncate text-[11px]">{sub.name}</span>
                        </div>
                        <span className="font-black text-brand-600 font-mono text-[11px] whitespace-nowrap ml-1">
                          {sub.formattedTime}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 7-Day Velocity Mini Bar Chart with Pink-to-Purple Gradient */}
              <div className="pt-2 border-t border-pink-50 space-y-1">
                <div className="flex justify-between items-center text-[11px] font-extrabold text-zinc-500">
                  <span>Past 7 Days Velocity</span>
                  <span className="text-purple-600 font-mono">
                    {analyticsData?.summary?.totalHours || 0} hrs total
                  </span>
                </div>

                <div className="h-28 w-full pt-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dailyChart} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                      <defs>
                        <linearGradient id="hubGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#EC4899" stopOpacity={1} />
                          <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0.85} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="#FCE7F3" />
                      <XAxis dataKey="date" tick={{ fontSize: 9, fill: "#71717A" }} tickLine={false} />
                      <YAxis tick={{ fontSize: 9, fill: "#71717A" }} tickLine={false} unit="h" />
                      <Tooltip formatter={(value: any) => [`${value} hrs`, "Study Duration"]} />
                      <Bar dataKey="hours" fill="url(#hubGradient)" radius={[4, 4, 0, 0]} maxBarSize={28} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import {
  Calendar,
  Clock,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Flame,
  Layers,
  Sparkles,
  ChevronRight,
  Brain,
  Lightbulb,
  HelpCircle,
  FileText,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { formatMinutes } from "@/lib/utils";

interface ProgressPerspectiveViewerProps {
  todaySessions: any[];
  weeklyProgress: any;
  monthlyProgress: any;
  todayStudyFormatted: string;
  dailyGoalFormatted: string;
}

export function ProgressPerspectiveViewer({
  todaySessions = [],
  weeklyProgress,
  monthlyProgress,
  todayStudyFormatted,
  dailyGoalFormatted,
}: ProgressPerspectiveViewerProps) {
  const [activeTab, setActiveTab] = useState<"daily" | "weekly" | "monthly">("daily");

  const weeklyData = weeklyProgress?.dailyChart || [];
  const weeklySubjects = weeklyProgress?.subjectBreakdown || [];
  const monthlySubjects = monthlyProgress?.subjectBreakdown || [];

  return (
    <Card className="border-pink-100 bg-white shadow-sm overflow-hidden">
      {/* 3D-styled Interactive Navigation Tabs */}
      <div className="bg-gradient-to-r from-brand-50/90 via-pink-50/50 to-white px-5 pt-4 pb-0 border-b border-pink-100 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-500" />
            <h2 className="text-base font-extrabold tracking-tight text-zinc-900">
              Study Progress &amp; Takeaways
            </h2>
          </div>
          <p className="text-xs text-zinc-500 mt-0.5">
            Switch between Daily, Weekly, and Monthly 3D perspective breakdowns.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-pink-200/80 shadow-xs mb-2 sm:mb-0">
          <button
            onClick={() => setActiveTab("daily")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "daily"
                ? "bg-brand-500 text-white shadow-sm shadow-pink-200"
                : "text-zinc-600 hover:text-brand-600 hover:bg-brand-50/50"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            Daily ({todaySessions.length})
          </button>

          <button
            onClick={() => setActiveTab("weekly")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "weekly"
                ? "bg-brand-500 text-white shadow-sm shadow-pink-200"
                : "text-zinc-600 hover:text-brand-600 hover:bg-brand-50/50"
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            Weekly ({weeklyProgress?.totalHours || 0}h)
          </button>

          <button
            onClick={() => setActiveTab("monthly")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "monthly"
                ? "bg-brand-500 text-white shadow-sm shadow-pink-200"
                : "text-zinc-600 hover:text-brand-600 hover:bg-brand-50/50"
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            Monthly ({monthlyProgress?.totalHours || 0}h)
          </button>
        </div>
      </div>

      <CardContent className="p-5 sm:p-6">
        {/* ============================================================== */}
        {/* TAB 1: DAILY PROGRESS - WHAT DID HE STUDY TODAY?               */}
        {/* ============================================================== */}
        {activeTab === "daily" && (
          <div className="space-y-6">
            {/* Daily Overview Ribbon */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-gradient-to-r from-pink-50/80 via-white to-brand-50/80 border border-pink-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-500 text-white flex items-center justify-center shadow-xs">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">
                    Total Studied Today
                  </span>
                  <p className="text-base font-black text-brand-600">{todayStudyFormatted}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">
                    Sessions Logged
                  </span>
                  <p className="text-base font-black text-zinc-800">
                    {todaySessions.length} Focus Sessions
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">
                    Target Daily Goal
                  </span>
                  <p className="text-base font-black text-zinc-800">{dailyGoalFormatted}</p>
                </div>
              </div>
            </div>

            {/* Detailed Sessions: What Did He Study? */}
            <div>
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-1.5">
                <Brain className="w-4 h-4 text-brand-500" />
                Detailed Session Logs &amp; Conceptual Takeaways
              </h3>

              {todaySessions.length === 0 ? (
                <div className="text-center py-10 bg-zinc-50/60 rounded-2xl border border-dashed border-pink-200">
                  <BookOpen className="w-8 h-8 text-pink-300 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-zinc-700">No sessions recorded yet today.</p>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    Start a focus timer above to log your first takeaways for the day!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {todaySessions.map((session, index) => (
                    <div
                      key={session.id}
                      className="p-4 sm:p-5 rounded-2xl border border-zinc-100 bg-white hover:border-pink-200 hover:shadow-sm transition-all space-y-3"
                    >
                      {/* Top Header of Session */}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-pink-50/80 pb-3">
                        <div className="flex items-center gap-2.5">
                          <span className="w-6 h-6 rounded-lg bg-brand-50 text-brand-700 font-extrabold text-xs flex items-center justify-center font-mono">
                            #{index + 1}
                          </span>
                          <span
                            className="px-2.5 py-1 rounded-md text-xs font-extrabold text-white shadow-2xs"
                            style={{ backgroundColor: session.subjectColor || "#EC4899" }}
                          >
                            {session.subjectName}
                          </span>
                          <span className="font-bold text-sm text-zinc-900">
                            {session.topicName}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-brand-600 bg-brand-50/80 px-2.5 py-1 rounded-lg border border-pink-200">
                            {session.durationFormatted} ({session.time} - {session.endTime})
                          </span>
                          {session.difficulty && (
                            <Badge
                              variant={
                                session.difficulty === "EASY"
                                  ? "success"
                                  : session.difficulty === "HARD"
                                  ? "danger"
                                  : "warning"
                              }
                              className="text-[10px]"
                            >
                              {session.difficulty}
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* 4 Multi-Dimension Cards: What He Studied, Learned, Understood, Doubts */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        {/* What did he study? */}
                        {session.whatStudied && (
                          <div className="p-3 rounded-xl bg-pink-50/30 border border-pink-100 space-y-1">
                            <span className="font-extrabold text-brand-700 flex items-center gap-1.5 text-[11px]">
                              <BookOpen className="w-3.5 h-3.5 text-brand-500" /> What He Studied:
                            </span>
                            <p className="text-zinc-700 leading-relaxed font-medium">
                              {session.whatStudied}
                            </p>
                          </div>
                        )}

                        {/* What did he learn? */}
                        {session.whatLearned && (
                          <div className="p-3 rounded-xl bg-purple-50/30 border border-purple-100 space-y-1">
                            <span className="font-extrabold text-purple-700 flex items-center gap-1.5 text-[11px]">
                              <Lightbulb className="w-3.5 h-3.5 text-purple-500" /> What He Learned:
                            </span>
                            <p className="text-zinc-700 leading-relaxed font-medium">
                              {session.whatLearned}
                            </p>
                          </div>
                        )}

                        {/* What did he understand? */}
                        {session.whatUnderstood && (
                          <div className="p-3 rounded-xl bg-emerald-50/30 border border-emerald-100 space-y-1">
                            <span className="font-extrabold text-emerald-700 flex items-center gap-1.5 text-[11px]">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> What Clicked &amp; Understood:
                            </span>
                            <p className="text-zinc-700 leading-relaxed font-medium">
                              {session.whatUnderstood}
                            </p>
                          </div>
                        )}

                        {/* What was difficult / doubts */}
                        {session.whatNotUnderstood && (
                          <div className="p-3 rounded-xl bg-amber-50/40 border border-amber-100 space-y-1">
                            <span className="font-extrabold text-amber-800 flex items-center gap-1.5 text-[11px]">
                              <HelpCircle className="w-3.5 h-3.5 text-amber-600" /> Difficulties / Doubts:
                            </span>
                            <p className="text-zinc-700 leading-relaxed font-medium">
                              {session.whatNotUnderstood}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Personal Notes */}
                      {session.personalNotes && (
                        <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-100 text-xs text-zinc-500 flex items-start gap-2 italic">
                          <FileText className="w-3.5 h-3.5 text-zinc-400 mt-0.5 shrink-0" />
                          <span>&ldquo;{session.personalNotes}&rdquo;</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: WEEKLY PROGRESS - 7-DAY VELOCITY                        */}
        {/* ============================================================== */}
        {activeTab === "weekly" && (
          <div className="space-y-6">
            {/* Weekly Metrics Banner */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-gradient-to-r from-brand-50/80 via-white to-pink-50/60 border border-pink-100">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">
                  Total Weekly Hours
                </span>
                <p className="text-xl font-black text-brand-600 mt-0.5">
                  {weeklyProgress?.formattedTotalTime || "0h"}
                </p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">
                  Goal Target Met
                </span>
                <p className="text-xl font-black text-zinc-800 mt-0.5">
                  {weeklyProgress?.weeklyGoalMetDaysCount || 0} / 7 Days
                </p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">
                  Unique Topics
                </span>
                <p className="text-xl font-black text-zinc-800 mt-0.5">
                  {weeklyProgress?.uniqueTopicsCount || 0} Covered
                </p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">
                  Daily Consistency
                </span>
                <p className="text-xl font-black text-emerald-600 mt-0.5">
                  {Math.round(((weeklyProgress?.weeklyGoalMetDaysCount || 0) / 7) * 100)}%
                </p>
              </div>
            </div>

            {/* Weekly Daily Hours Chart */}
            <div className="p-4 sm:p-5 rounded-2xl border border-pink-100 bg-white shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-zinc-700">
                  7-Day Study Hours Velocity
                </h4>
                <span className="text-[11px] font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-md">
                  Goal: {dailyGoalFormatted}/day
                </span>
              </div>

              <div className="h-60 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#FCE7F3" />
                    <XAxis
                      dataKey="day"
                      tick={{ fontSize: 11, fill: "#71717A" }}
                      axisLine={{ stroke: "#F3E8EE" }}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: "#71717A" }}
                      axisLine={{ stroke: "#F3E8EE" }}
                      tickLine={false}
                      unit="h"
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const d = payload[0].payload;
                          return (
                            <div className="bg-white p-3 rounded-xl border border-pink-200 shadow-lg text-xs">
                              <p className="font-extrabold text-zinc-800">{d.day} ({d.date})</p>
                              <p className="text-brand-600 font-bold mt-1">Study Time: {d.formattedDuration}</p>
                              <p className="text-zinc-500">Sessions: {d.sessionsCount}</p>
                              <p className="text-zinc-400 mt-0.5">
                                Goal: {d.isGoalMet ? "✅ Target Reached" : "⏳ Below Target"}
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="hours" fill="#EC4899" radius={[6, 6, 0, 0]} maxBarSize={45} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Weekly Subject Breakdown */}
            <div>
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-zinc-400 mb-3">
                Subjects Studied This Week
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {weeklySubjects.map((sub: any) => (
                  <div
                    key={sub.name}
                    className="p-3.5 rounded-xl border border-pink-100 bg-white shadow-2xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: sub.color || "#EC4899" }}
                        />
                        <span className="text-xs font-bold text-zinc-800">{sub.name}</span>
                      </div>
                      <span className="text-xs font-extrabold text-brand-600 font-mono">
                        {sub.formattedTime}
                      </span>
                    </div>
                    <Progress value={sub.percentage} className="h-1.5" />
                    <div className="text-right text-[10px] text-zinc-400 font-semibold">
                      {sub.percentage}% of weekly study
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: MONTHLY PROGRESS - CURRICULUM MASTERY                   */}
        {/* ============================================================== */}
        {activeTab === "monthly" && (
          <div className="space-y-6">
            {/* Monthly Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-gradient-to-r from-pink-50 via-white to-brand-50 border border-pink-100">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">
                  Month of {monthlyProgress?.monthName}
                </span>
                <p className="text-2xl font-black text-brand-600 mt-0.5">
                  {monthlyProgress?.formattedTotalTime || "0h"}
                </p>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">
                  Active Study Days
                </span>
                <p className="text-2xl font-black text-zinc-800 mt-0.5">
                  {monthlyProgress?.activeStudyDaysCount || 0} Days
                </p>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">
                  Total Monthly Sessions
                </span>
                <p className="text-2xl font-black text-zinc-800 mt-0.5">
                  {monthlyProgress?.sessionsCount || 0} Sessions
                </p>
              </div>
            </div>

            {/* Monthly Target Completion Meter */}
            <div className="p-5 rounded-2xl border border-pink-100 bg-white shadow-2xs space-y-2.5">
              <div className="flex justify-between items-center text-xs font-extrabold">
                <span className="text-zinc-700 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-brand-500" /> Monthly Target Fulfillment
                </span>
                <span className="text-brand-600 font-mono text-sm">
                  {monthlyProgress?.monthlyGoalPercent || 0}% Completed
                </span>
              </div>
              <Progress value={monthlyProgress?.monthlyGoalPercent || 0} className="h-3" />
              <p className="text-[11px] text-zinc-400">
                Calculated against a benchmark of 25 active study days at your configured daily goal rate.
              </p>
            </div>

            {/* Monthly Subject Distribution */}
            <div>
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-zinc-400 mb-3">
                Monthly Subject Allocation
              </h4>
              <div className="space-y-3">
                {monthlySubjects.map((sub: any) => (
                  <div
                    key={sub.name}
                    className="p-3.5 rounded-xl border border-zinc-100 bg-white shadow-2xs space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: sub.color || "#EC4899" }}
                        />
                        <span className="font-bold text-zinc-900">{sub.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-brand-600 font-mono">
                          {sub.formattedTime}
                        </span>
                        <span className="text-[10px] text-zinc-400">({sub.percentage}%)</span>
                      </div>
                    </div>
                    <Progress value={sub.percentage} className="h-2" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

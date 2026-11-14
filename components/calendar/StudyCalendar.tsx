"use client";

import React, { useState, useEffect } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, parseISO } from "date-fns";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Sparkles } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatMinutes } from "@/lib/utils";

interface DayData {
  date: string;
  totalMinutes: number;
  sessionsCount: number;
  isGoalCompleted: boolean;
  intensity: "none" | "low" | "medium" | "high";
  sessions: any[];
  tasksCompletedCount: number;
  notesCount: number;
  subjectSummary: Record<string, { name: string; color: string; minutes: number }>;
}

export function StudyCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 10, 1)); // November 2026 default
  const [daysData, setDaysData] = useState<Record<string, DayData>>({});
  const [selectedDayKey, setSelectedDayKey] = useState<string>(format(new Date(2026, 10, 14), "yyyy-MM-dd"));
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState(360);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCalendar = async (date: Date) => {
    setIsLoading(true);
    try {
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const res = await fetch(`/api/calendar?year=${year}&month=${month}`);
      if (res.ok) {
        const data = await res.json();
        setDaysData(data.days || {});
        setDailyGoalMinutes(data.dailyGoalMinutes || 360);
      }
    } catch (err) {
      console.error("Failed to load calendar", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCalendar(currentDate);
  }, [currentDate]);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDayOfWeek = getDay(monthStart);

  const handlePrevMonth = () => {
    const prev = new Date(currentDate);
    prev.setMonth(prev.getMonth() - 1);
    setCurrentDate(prev);
  };

  const handleNextMonth = () => {
    const next = new Date(currentDate);
    next.setMonth(next.getMonth() + 1);
    setCurrentDate(next);
  };

  const selectedData: DayData | undefined = daysData[selectedDayKey];
  const selectedDateObj = selectedDayKey ? parseISO(selectedDayKey) : new Date();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Calendar Grid (2 cols) */}
      <div className="lg:col-span-2 space-y-4">
        <Card className="border-pink-100 shadow-md bg-white overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-brand-50 via-pink-50/40 to-white flex flex-row items-center justify-between py-4 px-6 border-b border-pink-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-brand-500 text-white flex items-center justify-center shadow-xs">
                <CalendarIcon className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-base sm:text-lg font-black text-zinc-900 tracking-tight">
                  {format(currentDate, "MMMM yyyy")}
                </CardTitle>
                <p className="text-[11px] text-zinc-400 font-medium">Multi-Subject Heatmap &amp; Logs</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-pink-200/80 shadow-xs">
              <button
                onClick={handlePrevMonth}
                className="p-1.5 rounded-lg text-zinc-600 hover:bg-brand-50 hover:text-brand-600 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextMonth}
                className="p-1.5 rounded-lg text-zinc-600 hover:bg-brand-50 hover:text-brand-600 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </CardHeader>

          <CardContent className="p-4 sm:p-6">
            {/* Weekday Headers */}
            <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-bold text-zinc-400">
              <span className="text-rose-400">Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span className="text-brand-500">Sat</span>
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: startDayOfWeek }).map((_, i) => (
                <div key={`empty-${i}`} className="h-20 sm:h-24 rounded-2xl bg-zinc-50/40 border border-transparent opacity-30" />
              ))}

              {monthDays.map((day) => {
                const dateKey = format(day, "yyyy-MM-dd");
                const info = daysData[dateKey];
                const isSelected = selectedDayKey === dateKey;
                const totalMins = info?.totalMinutes || 0;
                const isGoalMet = info?.isGoalCompleted;
                const subjectsStudied = info?.subjectSummary ? Object.values(info.subjectSummary) : [];

                // Multi-tier background styling with subtle colored gradients
                let cellStyle = "bg-white text-zinc-700 border-zinc-100 hover:border-pink-200 hover:shadow-xs";
                if (info?.intensity === "high") {
                  cellStyle = "bg-gradient-to-br from-brand-500 via-pink-500 to-rose-500 text-white font-bold border-brand-500 shadow-sm shadow-pink-200";
                } else if (info?.intensity === "medium") {
                  cellStyle = "bg-gradient-to-br from-brand-100/90 to-pink-100/90 text-brand-900 font-bold border-brand-200";
                } else if (info?.intensity === "low") {
                  cellStyle = "bg-gradient-to-br from-brand-50 to-pink-50/60 text-brand-800 font-semibold border-brand-100";
                }

                return (
                  <button
                    key={dateKey}
                    type="button"
                    onClick={() => setSelectedDayKey(dateKey)}
                    className={`h-20 sm:h-24 p-2 sm:p-2.5 rounded-2xl border flex flex-col justify-between text-left transition-all relative group ${cellStyle} ${
                      isSelected
                        ? "ring-2 ring-brand-500 ring-offset-2 scale-[1.03] z-10 shadow-md"
                        : "hover:scale-[1.01]"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs sm:text-sm font-extrabold">{format(day, "d")}</span>
                      {isGoalMet && (
                        <span className="w-2 h-2 rounded-full bg-white ring-2 ring-pink-300 animate-pulse" />
                      )}
                    </div>

                    {/* Multiple Color Subject Dots */}
                    {subjectsStudied.length > 0 && (
                      <div className="flex items-center gap-1 my-0.5 flex-wrap">
                        {subjectsStudied.slice(0, 4).map((sub, idx) => (
                          <span
                            key={sub.name + idx}
                            className="w-2 h-2 rounded-full shadow-2xs border border-white"
                            style={{ backgroundColor: sub.color || "#EC4899" }}
                            title={`${sub.name}: ${formatMinutes(sub.minutes)}`}
                          />
                        ))}
                        {subjectsStudied.length > 4 && (
                          <span className="text-[9px] font-bold opacity-75">+{subjectsStudied.length - 4}</span>
                        )}
                      </div>
                    )}

                    {totalMins > 0 ? (
                      <div className="text-[10px] sm:text-[11px] font-black truncate">
                        {formatMinutes(totalMins)}
                      </div>
                    ) : (
                      <div className="text-[10px] text-zinc-300">-</div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Heatmap & Multi-Color Legend */}
            <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-4 border-t border-pink-50 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-zinc-400 font-semibold">Subject Dots:</span>
                <div className="flex items-center gap-1.5 text-[11px] text-zinc-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-pink-500" /> Quant
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500 ml-1.5" /> Reasoning
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 ml-1.5" /> GS
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 ml-1.5" /> Tech
                </div>
              </div>

              <div className="flex items-center gap-2 text-zinc-500 font-medium">
                <span className="text-zinc-400">Intensity:</span>
                <div className="flex items-center gap-1">
                  <div className="w-3.5 h-3.5 rounded bg-white border border-zinc-200" title="No Study" />
                  <div className="w-3.5 h-3.5 rounded bg-brand-50 border border-brand-100" title="Low" />
                  <div className="w-3.5 h-3.5 rounded bg-brand-200 border border-brand-300" title="Medium" />
                  <div className="w-3.5 h-3.5 rounded bg-gradient-to-tr from-brand-500 to-rose-500 text-white" title="Goal Met" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Selected Date Inspector Sidebar (1 col) */}
      <div className="space-y-4">
        <Card className="border-pink-100 shadow-md bg-white overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-brand-50 via-pink-50/30 to-white py-4 px-5 border-b border-pink-100">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-extrabold text-zinc-900">
                {format(selectedDateObj, "dd MMMM yyyy")}
              </CardTitle>
              {selectedData?.isGoalCompleted ? (
                <Badge variant="pink" className="gap-1 font-bold">
                  <Sparkles className="w-3 h-3 text-brand-500" /> Goal Reached
                </Badge>
              ) : (
                <Badge variant="outline" className="font-semibold text-zinc-500">
                  {selectedData?.totalMinutes ? "In Progress" : "No Activity"}
                </Badge>
              )}
            </div>
          </CardHeader>

          <CardContent className="p-5 space-y-4">
            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-gradient-to-br from-brand-50 to-pink-50/50 rounded-2xl border border-brand-100">
                <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">Total Time</span>
                <p className="text-lg font-black text-brand-600 mt-0.5">
                  {selectedData ? formatMinutes(selectedData.totalMinutes) : "0m"}
                </p>
              </div>

              <div className="p-3 bg-zinc-50 rounded-2xl border border-zinc-100">
                <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">Sessions</span>
                <p className="text-lg font-black text-zinc-800 mt-0.5">
                  {selectedData?.sessionsCount || 0}
                </p>
              </div>

              <div className="p-3 bg-zinc-50 rounded-2xl border border-zinc-100">
                <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">Tasks Done</span>
                <p className="text-lg font-black text-zinc-800 mt-0.5">
                  {selectedData?.tasksCompletedCount || 0}
                </p>
              </div>

              <div className="p-3 bg-zinc-50 rounded-2xl border border-zinc-100">
                <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">Notes Taken</span>
                <p className="text-lg font-black text-zinc-800 mt-0.5">
                  {selectedData?.notesCount || 0}
                </p>
              </div>
            </div>

            {/* Multiple Color Subject Breakdown */}
            <div>
              <h4 className="text-xs font-extrabold text-zinc-700 mb-2.5 uppercase tracking-wider">
                Subjects Studied on this Day
              </h4>
              {selectedData && Object.keys(selectedData.subjectSummary).length > 0 ? (
                <div className="space-y-2">
                  {Object.values(selectedData.subjectSummary).map((sub) => (
                    <div
                      key={sub.name}
                      className="flex items-center justify-between p-3 rounded-xl border border-pink-50 bg-gradient-to-r from-zinc-50/60 to-white"
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-3.5 h-3.5 rounded-full shadow-2xs"
                          style={{ backgroundColor: sub.color || "#EC4899" }}
                        />
                        <span className="text-xs font-bold text-zinc-800">{sub.name}</span>
                      </div>
                      <span className="text-xs font-black text-brand-600 font-mono">
                        {formatMinutes(sub.minutes)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-zinc-400 italic py-2">
                  No subject study logged on this day.
                </p>
              )}
            </div>

            {/* Sessions Detail List */}
            {selectedData && selectedData.sessions.length > 0 && (
              <div>
                <h4 className="text-xs font-extrabold text-zinc-700 mb-2.5 uppercase tracking-wider">
                  Detailed Session Log
                </h4>
                <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                  {selectedData.sessions.map((sess: any) => (
                    <div
                      key={sess.id}
                      className="p-3 rounded-xl border border-zinc-100 bg-white shadow-2xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: sess.subject.color || "#EC4899" }}
                          />
                          <span className="font-extrabold text-xs text-zinc-900">{sess.subject.name}</span>
                        </div>
                        <span className="font-black text-brand-600 font-mono text-xs">
                          {formatMinutes(sess.durationMinutes)}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-zinc-600">{sess.topic?.name || "General Study"}</p>
                      {sess.whatStudied && (
                        <p className="text-[11px] text-zinc-500 bg-zinc-50 p-2 rounded-lg italic">
                          &ldquo;{sess.whatStudied}&rdquo;
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

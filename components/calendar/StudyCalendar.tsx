"use client";

import React, { useState, useEffect } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameDay, parseISO } from "date-fns";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, BookOpen, CheckSquare, FileText, Sparkles } from "lucide-react";
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
  const startDayOfWeek = getDay(monthStart); // 0 = Sun

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

  // Selected Day Details
  const selectedData: DayData | undefined = daysData[selectedDayKey];
  const selectedDateObj = selectedDayKey ? parseISO(selectedDayKey) : new Date();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Calendar Grid (2 cols) */}
      <div className="lg:col-span-2 space-y-4">
        <Card className="border-pink-100 shadow-sm bg-white">
          <CardHeader className="flex flex-row items-center justify-between py-4 px-6 border-b border-pink-50">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-brand-500" />
              <CardTitle className="text-base sm:text-lg font-bold text-zinc-900">
                {format(currentDate, "MMMM yyyy")}
              </CardTitle>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handlePrevMonth}
                className="p-1.5 rounded-lg border border-zinc-200 text-zinc-600 hover:bg-brand-50 hover:text-brand-600 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextMonth}
                className="p-1.5 rounded-lg border border-zinc-200 text-zinc-600 hover:bg-brand-50 hover:text-brand-600 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </CardHeader>

          <CardContent className="p-4 sm:p-6">
            {/* Weekday Headers */}
            <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-semibold text-zinc-400">
              <span>Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-2">
              {/* Padding empty slots */}
              {Array.from({ length: startDayOfWeek }).map((_, i) => (
                <div key={`empty-${i}`} className="h-16 sm:h-20 rounded-xl bg-zinc-50/50 opacity-40" />
              ))}

              {/* Month Days */}
              {monthDays.map((day) => {
                const dateKey = format(day, "yyyy-MM-dd");
                const info = daysData[dateKey];
                const isSelected = selectedDayKey === dateKey;
                const totalMins = info?.totalMinutes || 0;
                const isGoalMet = info?.isGoalCompleted;

                // Color styles based on intensity
                let bgStyle = "bg-white hover:bg-brand-50/40 text-zinc-700 border-zinc-100";
                if (info?.intensity === "high") {
                  bgStyle = "bg-brand-500 text-white font-bold border-brand-500 shadow-sm";
                } else if (info?.intensity === "medium") {
                  bgStyle = "bg-brand-200/80 text-brand-900 font-semibold border-brand-300";
                } else if (info?.intensity === "low") {
                  bgStyle = "bg-brand-50 text-brand-800 border-brand-100";
                }

                return (
                  <button
                    key={dateKey}
                    type="button"
                    onClick={() => setSelectedDayKey(dateKey)}
                    className={`h-16 sm:h-20 p-2 rounded-xl border flex flex-col justify-between text-left transition-all relative ${bgStyle} ${
                      isSelected ? "ring-2 ring-brand-500 ring-offset-2 scale-[1.02] z-10" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs sm:text-sm font-semibold">{format(day, "d")}</span>
                      {isGoalMet && (
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      )}
                    </div>

                    {totalMins > 0 ? (
                      <div className="text-[10px] sm:text-xs truncate font-medium">
                        {formatMinutes(totalMins)}
                      </div>
                    ) : (
                      <div className="text-[10px] text-zinc-300">-</div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Heatmap Legend */}
            <div className="flex flex-wrap items-center justify-end gap-3 mt-6 pt-4 border-t border-pink-50 text-xs text-zinc-500">
              <span className="text-zinc-400">Study Intensity:</span>
              <div className="flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 rounded bg-white border border-zinc-200" />
                <span>None</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 rounded bg-brand-50 border border-brand-100" />
                <span>Low</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 rounded bg-brand-200 border border-brand-300" />
                <span>Medium</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 rounded bg-brand-500 text-white" />
                <span>Goal Met</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Selected Date Inspector Sidebar (1 col) */}
      <div className="space-y-4">
        <Card className="border-pink-100 shadow-sm bg-white">
          <CardHeader className="py-4 px-5 border-b border-pink-50">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold text-zinc-900">
                {format(selectedDateObj, "dd MMMM yyyy")}
              </CardTitle>
              {selectedData?.isGoalCompleted ? (
                <Badge variant="pink" className="gap-1">
                  <Sparkles className="w-3 h-3 text-brand-500" /> Goal Reached
                </Badge>
              ) : (
                <Badge variant="outline">
                  {selectedData?.totalMinutes ? "In Progress" : "No Activity"}
                </Badge>
              )}
            </div>
          </CardHeader>

          <CardContent className="p-5 space-y-4">
            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-brand-50/60 rounded-xl border border-pink-100">
                <span className="text-[11px] text-zinc-400 font-medium">Total Study Time</span>
                <p className="text-lg font-bold text-brand-600 mt-0.5">
                  {selectedData ? formatMinutes(selectedData.totalMinutes) : "0m"}
                </p>
              </div>

              <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                <span className="text-[11px] text-zinc-400 font-medium">Study Sessions</span>
                <p className="text-lg font-bold text-zinc-800 mt-0.5">
                  {selectedData?.sessionsCount || 0}
                </p>
              </div>

              <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                <span className="text-[11px] text-zinc-400 font-medium">Tasks Done</span>
                <p className="text-lg font-bold text-zinc-800 mt-0.5">
                  {selectedData?.tasksCompletedCount || 0}
                </p>
              </div>

              <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                <span className="text-[11px] text-zinc-400 font-medium">Notes Taken</span>
                <p className="text-lg font-bold text-zinc-800 mt-0.5">
                  {selectedData?.notesCount || 0}
                </p>
              </div>
            </div>

            {/* Subject Breakdown */}
            <div>
              <h4 className="text-xs font-bold text-zinc-800 mb-2.5 uppercase tracking-wider">
                Subjects Studied
              </h4>
              {selectedData && Object.keys(selectedData.subjectSummary).length > 0 ? (
                <div className="space-y-2">
                  {Object.values(selectedData.subjectSummary).map((sub) => (
                    <div
                      key={sub.name}
                      className="flex items-center justify-between p-2.5 rounded-lg border border-pink-50 bg-white"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: sub.color || "#EC4899" }}
                        />
                        <span className="text-xs font-semibold text-zinc-800">{sub.name}</span>
                      </div>
                      <span className="text-xs font-bold text-brand-600">
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

            {/* Sessions List */}
            {selectedData && selectedData.sessions.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-zinc-800 mb-2.5 uppercase tracking-wider">
                  Session Log
                </h4>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {selectedData.sessions.map((sess: any) => (
                    <div
                      key={sess.id}
                      className="p-2.5 rounded-lg border border-zinc-100 bg-zinc-50/50 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-zinc-800">{sess.subject.name}</span>
                        <span className="font-bold text-brand-600">{formatMinutes(sess.durationMinutes)}</span>
                      </div>
                      <p className="text-[11px] text-zinc-500">{sess.topic?.name || "General Study"}</p>
                      {sess.whatStudied && (
                        <p className="text-[11px] text-zinc-400 italic line-clamp-1">&ldquo;{sess.whatStudied}&rdquo;</p>
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

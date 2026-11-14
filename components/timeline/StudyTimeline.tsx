"use client";

import React, { useState, useEffect } from "react";
import { Clock, Calendar, BookOpen, Filter, Sparkles } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatMinutes } from "@/lib/utils";

interface TimelineDayGroup {
  dateKey: string;
  formattedDate: string;
  totalMinutes: number;
  sessions: {
    id: string;
    time: string;
    endTime: string;
    subjectName: string;
    subjectColor: string;
    topicName: string;
    durationMinutes: number;
    difficulty?: string;
    whatStudied?: string;
    whatLearned?: string;
    personalNotes?: string;
    mode: string;
  }[];
}

interface StudyTimelineProps {
  subjects?: { id: string; name: string }[];
}

export function StudyTimeline({ subjects = [] }: StudyTimelineProps) {
  const [filter, setFilter] = useState<"all" | "today" | "week" | "month">("all");
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("");
  const [timeline, setTimeline] = useState<TimelineDayGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTimeline = async () => {
    setIsLoading(true);
    try {
      let url = `/api/timeline?filter=${filter}`;
      if (selectedSubjectId) url += `&subjectId=${selectedSubjectId}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setTimeline(data);
      }
    } catch (err) {
      console.error("Failed to load timeline", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTimeline();
  }, [filter, selectedSubjectId]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Filter Header */}
      <Card className="border-pink-100 shadow-sm bg-white">
        <CardContent className="p-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 bg-brand-50/70 p-1 rounded-xl border border-pink-100">
            {(
              [
                { id: "all", label: "All Time" },
                { id: "today", label: "Today" },
                { id: "week", label: "This Week" },
                { id: "month", label: "This Month" },
              ] as const
            ).map((item) => (
              <button
                key={item.id}
                onClick={() => setFilter(item.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  filter === item.id
                    ? "bg-white text-brand-600 shadow-xs border border-pink-200"
                    : "text-zinc-600 hover:text-zinc-900"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {subjects.length > 0 && (
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-zinc-400" />
              <select
                value={selectedSubjectId}
                onChange={(e) => setSelectedSubjectId(e.target.value)}
                className="h-8 px-2.5 text-xs font-medium bg-white rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="">All Subjects</option>
                {subjects.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Timeline Stream */}
      {timeline.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-pink-100 shadow-sm">
          <Clock className="w-12 h-12 text-brand-300 mx-auto mb-3" />
          <h3 className="font-semibold text-zinc-800 text-sm">No study sessions recorded</h3>
          <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
            Start a timer session to begin tracking your study chronology!
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {timeline.map((group) => (
            <div key={group.dateKey} className="space-y-4">
              {/* Day Header Pill */}
              <div className="flex items-center justify-between sticky top-20 z-10 bg-white/95 backdrop-blur-md p-3 rounded-xl border border-pink-100 shadow-xs">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-brand-500" />
                  <span className="font-bold text-xs sm:text-sm text-zinc-900">
                    {group.formattedDate}
                  </span>
                </div>
                <Badge variant="pink" className="font-semibold text-xs">
                  {formatMinutes(group.totalMinutes)} Total
                </Badge>
              </div>

              {/* Sessions List */}
              <div className="relative pl-6 sm:pl-8 space-y-4 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-pink-100">
                {group.sessions.map((session) => (
                  <div
                    key={session.id}
                    className="relative bg-white rounded-xl border border-zinc-100 p-4 shadow-xs hover:border-pink-200 hover:shadow-sm transition-all"
                  >
                    {/* Timeline bullet dot */}
                    <div
                      className="absolute -left-[19px] sm:-left-[23px] top-4 w-3.5 h-3.5 rounded-full border-2 border-white ring-2 ring-brand-300"
                      style={{ backgroundColor: session.subjectColor || "#EC4899" }}
                    />

                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-zinc-700 bg-zinc-50 px-2 py-0.5 rounded border border-zinc-200">
                          {session.time}
                        </span>
                        <h4 className="text-sm font-bold text-zinc-900">{session.subjectName}</h4>
                        <span className="text-zinc-300">•</span>
                        <span className="text-xs font-medium text-brand-600 bg-brand-50 px-2 py-0.5 rounded-md">
                          {session.topicName}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {session.difficulty && (
                          <Badge
                            variant={
                              session.difficulty === "EASY"
                                ? "success"
                                : session.difficulty === "HARD"
                                ? "danger"
                                : "warning"
                            }
                          >
                            {session.difficulty}
                          </Badge>
                        )}
                        <span className="text-xs font-bold text-zinc-800">
                          {formatMinutes(session.durationMinutes)}
                        </span>
                      </div>
                    </div>

                    {/* What Studied & Key Takeaways */}
                    {session.whatStudied && (
                      <p className="text-xs text-zinc-600 mb-1">
                        <span className="font-semibold text-zinc-700">Studied: </span>
                        {session.whatStudied}
                      </p>
                    )}

                    {session.whatLearned && (
                      <p className="text-xs text-zinc-600 mb-1">
                        <span className="font-semibold text-zinc-700">Learned: </span>
                        {session.whatLearned}
                      </p>
                    )}

                    {session.personalNotes && (
                      <div className="mt-2 text-xs text-zinc-500 bg-pink-50/40 p-2.5 rounded-lg border border-pink-100 italic">
                        &ldquo;{session.personalNotes}&rdquo;
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

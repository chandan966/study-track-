"use client";

import React from "react";
import { StudyCalendar } from "@/components/calendar/StudyCalendar";

export default function CalendarPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-zinc-900 tracking-tight">
          Monthly Study Calendar
        </h1>
        <p className="text-xs text-zinc-500">
          Visualize your daily study volume, goal achievements, and daily session breakdown.
        </p>
      </div>

      <StudyCalendar />
    </div>
  );
}

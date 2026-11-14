"use client";

import React from "react";
import { AnalyticsCharts } from "@/components/analytics/AnalyticsCharts";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-zinc-900 tracking-tight">
          Study Performance &amp; Analytics
        </h1>
        <p className="text-xs text-zinc-500">
          Monitor your daily study hours, weekly consistency, subject distributions, and streaks.
        </p>
      </div>

      <AnalyticsCharts />
    </div>
  );
}

"use client";

import React from "react";
import { AchievementGrid } from "@/components/achievements/AchievementGrid";

export default function AchievementsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-zinc-900 tracking-tight">
          Academic Badges &amp; Achievements
        </h1>
        <p className="text-xs text-zinc-500">
          Earn real achievements as you rack up study sessions, maintain streaks, and complete courses.
        </p>
      </div>

      <AchievementGrid />
    </div>
  );
}

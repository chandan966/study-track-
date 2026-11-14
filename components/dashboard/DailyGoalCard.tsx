"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, Trophy, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { getGreeting } from "@/lib/utils";

interface DailyGoalCardProps {
  userName: string;
  todayDate: string;
  todayStudyMinutes: number;
  todayStudyFormatted: string;
  dailyGoalMinutes: number;
  dailyGoalFormatted: string;
  goalPercentage: number;
  isGoalCompleted: boolean;
  currentStreak: number;
}

export function DailyGoalCard({
  userName,
  todayDate,
  todayStudyFormatted,
  dailyGoalFormatted,
  goalPercentage,
  isGoalCompleted,
  currentStreak,
}: DailyGoalCardProps) {
  const greeting = getGreeting();

  return (
    <Card className="border-pink-100 bg-gradient-to-r from-white via-brand-50/40 to-white shadow-sm overflow-hidden relative">
      <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-brand-100/30 to-transparent pointer-events-none" />

      <CardContent className="p-6 sm:p-8 relative z-10">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-zinc-900">
              {greeting}, {userName} 👋
            </h1>
            <p className="text-xs text-zinc-500 mt-1 font-medium">{todayDate}</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-pink-100 shadow-xs">
              <span className="text-xl">🔥</span>
              <div>
                <p className="text-[10px] text-zinc-400 font-medium leading-none">Streak</p>
                <p className="text-xs font-bold text-zinc-900">{currentStreak} Days</p>
              </div>
            </div>

            <Link href="/timer">
              <Button size="sm" className="bg-brand-500 hover:bg-brand-600 text-white shadow-sm shadow-pink-200">
                Start Studying <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Daily Goal Progress Bar Section */}
        <div className="space-y-2.5 bg-white/90 p-4 rounded-xl border border-pink-100">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-zinc-700 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-brand-500" />
              Daily Study Goal
            </span>
            <span className="font-bold text-zinc-900">
              <span className="text-brand-600 font-extrabold">{todayStudyFormatted}</span> / {dailyGoalFormatted}
              <span className="text-zinc-400 font-normal ml-2">({goalPercentage}%)</span>
            </span>
          </div>

          <Progress value={goalPercentage} className="h-3" />

          {isGoalCompleted && (
            <div className="flex items-center gap-2 pt-1 text-xs font-bold text-brand-600 animate-in fade-in">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>Daily goal completed 🎉 Keep shining!</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

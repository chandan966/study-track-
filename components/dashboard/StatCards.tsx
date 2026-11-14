import React from "react";
import { Clock, Target, Flame, Layers, CheckSquare, ListTodo } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardsProps {
  todayStudyFormatted: string;
  dailyGoalFormatted: string;
  currentStreak: number;
  sessionsToday: number;
  completedTasksTodayCount: number;
  pendingTasksCount: number;
}

export function StatCards({
  todayStudyFormatted,
  dailyGoalFormatted,
  currentStreak,
  sessionsToday,
  completedTasksTodayCount,
  pendingTasksCount,
}: StatCardsProps) {
  const cards = [
    {
      title: "Today's Study Time",
      value: todayStudyFormatted,
      icon: Clock,
      color: "text-brand-500",
      bg: "bg-brand-50",
    },
    {
      title: "Daily Goal",
      value: dailyGoalFormatted,
      icon: Target,
      color: "text-brand-600",
      bg: "bg-brand-50",
    },
    {
      title: "Current Streak",
      value: `${currentStreak} days`,
      icon: Flame,
      color: "text-amber-500",
      bg: "bg-amber-50",
    },
    {
      title: "Sessions Today",
      value: sessionsToday.toString(),
      icon: Layers,
      color: "text-purple-500",
      bg: "bg-purple-50",
    },
    {
      title: "Tasks Completed",
      value: completedTasksTodayCount.toString(),
      icon: CheckSquare,
      color: "text-emerald-500",
      bg: "bg-emerald-50",
    },
    {
      title: "Pending Tasks",
      value: pendingTasksCount.toString(),
      icon: ListTodo,
      color: "text-rose-500",
      bg: "bg-rose-50",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <Card key={c.title} className="border-pink-100 bg-white shadow-xs hover:border-pink-200 transition-all">
            <CardContent className="p-3.5 sm:p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-medium text-zinc-400 line-clamp-1">{c.title}</span>
                <div className={`p-1.5 rounded-lg ${c.bg} ${c.color}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>
              <p className="text-base sm:text-lg font-bold text-zinc-900">{c.value}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

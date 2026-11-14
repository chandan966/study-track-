"use client";

import React, { useState, useEffect } from "react";
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
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Flame, CheckCircle2, BookOpen, Target, Sparkles, TrendingUp } from "lucide-react";
import { formatMinutes } from "@/lib/utils";

// Vibrant, beautiful multi-color palette
const MULTI_COLORS = [
  "#EC4899", // Vivid Pink
  "#8B5CF6", // Electric Violet
  "#0284C7", // Sky Blue
  "#10B981", // Emerald
  "#F59E0B", // Amber Gold
  "#6366F1", // Indigo
  "#F43F5E", // Rose
  "#14B8A6", // Teal
];

export function AnalyticsCharts() {
  const [range, setRange] = useState<"7d" | "30d" | "90d">("7d");
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/analytics?range=${range}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error("Failed to load analytics", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [range]);

  const summary = data?.summary;
  const dailyData = data?.dailyChartData || [];
  const subjectData = data?.subjectDistribution || [];

  return (
    <div className="space-y-6">
      {/* Time Range Filter Bar with Multi-Color Accent */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-brand-50/90 via-pink-50/50 to-white p-4 rounded-2xl border border-pink-100 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-500 to-purple-600 text-white flex items-center justify-center shadow-xs">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black text-zinc-900 tracking-tight">
              Academic Analytics &amp; Visual Progress
            </h2>
            <p className="text-[11px] text-zinc-500 font-medium">Multi-Subject velocity and curriculum distribution</p>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-pink-200/80 shadow-xs">
          {(
            [
              { id: "7d", label: "Last 7 Days" },
              { id: "30d", label: "Last 30 Days" },
              { id: "90d", label: "Last 3 Months" },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              onClick={() => setRange(item.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                range === item.id
                  ? "bg-brand-500 text-white shadow-sm shadow-pink-200"
                  : "text-zinc-600 hover:text-zinc-900 hover:bg-brand-50/50"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Multiple Color Accent Metric Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Study Time - Pink Accent */}
        <Card className="border-pink-100 bg-gradient-to-br from-white to-pink-50/40 shadow-xs hover:border-pink-300 transition-all">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-brand-500 text-white flex items-center justify-center shadow-xs">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Total Studied</p>
              <h3 className="text-lg font-black text-zinc-900">
                {summary ? summary.formattedTotalTime : "0m"}
              </h3>
            </div>
          </CardContent>
        </Card>

        {/* Daily Average - Violet Accent */}
        <Card className="border-purple-100 bg-gradient-to-br from-white to-purple-50/40 shadow-xs hover:border-purple-300 transition-all">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-xs">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Daily Average</p>
              <h3 className="text-lg font-black text-zinc-900">
                {summary ? summary.formattedAvgDailyTime : "0m"}
              </h3>
            </div>
          </CardContent>
        </Card>

        {/* Current Streak - Amber Accent */}
        <Card className="border-amber-100 bg-gradient-to-br from-white to-amber-50/40 shadow-xs hover:border-amber-300 transition-all">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Active Streak</p>
              <h3 className="text-lg font-black text-zinc-900">
                {summary?.currentStreak || 0} <span className="text-xs font-normal text-zinc-400">days</span>
              </h3>
            </div>
          </CardContent>
        </Card>

        {/* Tasks Completed - Emerald Accent */}
        <Card className="border-emerald-100 bg-gradient-to-br from-white to-emerald-50/40 shadow-xs hover:border-emerald-300 transition-all">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Tasks Conquered</p>
              <h3 className="text-lg font-black text-zinc-900">
                {summary?.completedTasksCount || 0} Tasks
              </h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Study Hours Bar Chart (2 cols) */}
        <Card className="lg:col-span-2 border-pink-100 bg-white shadow-md overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-brand-50/80 via-white to-purple-50/40 py-4 px-6 border-b border-pink-100">
            <CardTitle className="text-base font-black text-zinc-900 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-500" />
                <span>Study Velocity ({range === "7d" ? "Past 7 Days" : range === "30d" ? "Past 30 Days" : "Past 3 Months"})</span>
              </div>
              <Badge variant="pink" className="text-xs font-bold">
                {summary ? `${summary.totalHours} hrs total` : "0 hrs"}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5">
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="barColorGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#EC4899" stopOpacity={1} />
                      <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0.85} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#FCE7F3" />
                  <XAxis
                    dataKey="date"
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
                          <div className="bg-white p-3.5 rounded-2xl border border-pink-200 shadow-xl text-xs space-y-1">
                            <p className="font-black text-zinc-900">{d.fullDate}</p>
                            <p className="text-brand-600 font-extrabold">Study Time: {formatMinutes(d.minutes)}</p>
                            <p className="text-zinc-500">Sessions Logged: {d.sessions}</p>
                            <p className="text-zinc-400 pt-0.5">
                              Daily Goal: {d.goalHours}h ({d.isGoalMet ? "✅ Goal Completed" : "⏳ Below Target"})
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar
                    dataKey="hours"
                    fill="url(#barColorGradient)"
                    radius={[8, 8, 0, 0]}
                    maxBarSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Multi-Color Subject Breakdown Donut Chart (1 col) */}
        <Card className="border-pink-100 bg-white shadow-md overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-purple-50/40 via-white to-brand-50/80 py-4 px-6 border-b border-pink-100">
            <CardTitle className="text-base font-black text-zinc-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-500" />
              Subject Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5">
            {subjectData.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-center text-xs text-zinc-400">
                <BookOpen className="w-8 h-8 text-pink-200 mb-2" />
                <p>No study hours recorded for this period.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="h-44 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={subjectData}
                        dataKey="minutes"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={70}
                        paddingAngle={4}
                      >
                        {subjectData.map((entry: any, index: number) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.color || MULTI_COLORS[index % MULTI_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: any) => [formatMinutes(Number(value)), "Study Time"]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Colorful Subject Badges List */}
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {subjectData.map((sub: any, idx: number) => {
                    const badgeColor = sub.color || MULTI_COLORS[idx % MULTI_COLORS.length];
                    return (
                      <div
                        key={sub.name}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-50/70 border border-zinc-100 text-xs hover:border-pink-200 transition-all"
                      >
                        <div className="flex items-center gap-2.5">
                          <span
                            className="w-3 h-3 rounded-full shadow-2xs"
                            style={{ backgroundColor: badgeColor }}
                          />
                          <span className="font-extrabold text-zinc-800 line-clamp-1">{sub.name}</span>
                        </div>
                        <div className="text-right whitespace-nowrap ml-2">
                          <span className="font-black text-brand-600 font-mono">{sub.formattedTime}</span>
                          <span className="text-[10px] text-zinc-400 ml-1 font-bold">({sub.percentage}%)</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

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
  Legend,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Flame, CheckCircle2, BookOpen, Target, Calendar } from "lucide-react";
import { formatMinutes } from "@/lib/utils";

const PINK_PALETTE = ["#EC4899", "#DB2777", "#F472B6", "#BE185D", "#F9A8D4", "#9D174D"];

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
      {/* Time Range Filter Bar */}
      <div className="flex items-center justify-between bg-white p-3 rounded-2xl border border-pink-100 shadow-sm">
        <h2 className="text-sm font-bold text-zinc-900">Study Analytics & Performance</h2>
        <div className="flex items-center gap-1 bg-brand-50/70 p-1 rounded-xl border border-pink-100">
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
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                range === item.id
                  ? "bg-white text-brand-600 shadow-xs border border-pink-200"
                  : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-pink-100 bg-white shadow-xs">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-500">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-zinc-400">Total Study Time</p>
              <h3 className="text-lg font-bold text-zinc-900">
                {summary ? summary.formattedTotalTime : "0m"}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-pink-100 bg-white shadow-xs">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-500">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-zinc-400">Daily Average</p>
              <h3 className="text-lg font-bold text-zinc-900">
                {summary ? summary.formattedAvgDailyTime : "0m"}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-pink-100 bg-white shadow-xs">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-500">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-zinc-400">Current Streak</p>
              <h3 className="text-lg font-bold text-zinc-900">
                {summary?.currentStreak || 0} <span className="text-xs font-normal text-zinc-400">days</span>
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-pink-100 bg-white shadow-xs">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-500">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-zinc-400">Tasks Completed</p>
              <h3 className="text-lg font-bold text-zinc-900">
                {summary?.completedTasksCount || 0}
              </h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Study Hours Bar Chart (2 cols) */}
        <Card className="lg:col-span-2 border-pink-100 bg-white shadow-sm">
          <CardHeader className="py-4 px-6 border-b border-pink-50">
            <CardTitle className="text-base font-bold text-zinc-900 flex items-center justify-between">
              <span>Study Hours ({range === "7d" ? "Daily" : range === "30d" ? "30 Days" : "90 Days"})</span>
              <Badge variant="pink" className="text-xs">
                {summary ? `${summary.totalHours} hrs total` : "0 hrs"}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5">
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                          <div className="bg-white p-3 rounded-xl border border-pink-100 shadow-md text-xs">
                            <p className="font-bold text-zinc-800">{d.fullDate}</p>
                            <p className="text-brand-600 font-semibold mt-1">
                              Duration: {formatMinutes(d.minutes)}
                            </p>
                            <p className="text-zinc-500">Sessions: {d.sessions}</p>
                            <p className="text-zinc-400 mt-1">Goal: {d.goalHours}h ({d.isGoalMet ? "✅ Met" : "❌ Incomplete"})</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar
                    dataKey="hours"
                    fill="#EC4899"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Subject Breakdown Pie Chart (1 col) */}
        <Card className="border-pink-100 bg-white shadow-sm">
          <CardHeader className="py-4 px-6 border-b border-pink-50">
            <CardTitle className="text-base font-bold text-zinc-900">
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
                            fill={entry.color || PINK_PALETTE[index % PINK_PALETTE.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: any) => [formatMinutes(Number(value)), "Study Time"]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {subjectData.map((sub: any, idx: number) => (
                    <div
                      key={sub.name}
                      className="flex items-center justify-between p-2 rounded-lg bg-zinc-50/60 border border-zinc-100 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: sub.color || PINK_PALETTE[idx % PINK_PALETTE.length] }}
                        />
                        <span className="font-semibold text-zinc-800">{sub.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-brand-600">{sub.formattedTime}</span>
                        <span className="text-[10px] text-zinc-400 ml-1.5">({sub.percentage}%)</span>
                      </div>
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

import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import prisma from "@/lib/prisma";
import { calculateStreaks, formatMinutes } from "@/lib/utils";
import { subDays, startOfDay, endOfDay, format, eachDayOfInterval } from "date-fns";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const range = searchParams.get("range") || "7d"; // 7d, 30d, 90d

    const daysCount = range === "90d" ? 90 : range === "30d" ? 30 : 7;
    const now = new Date();
    const startDate = startOfDay(subDays(now, daysCount - 1));
    const endDate = endOfDay(now);

    const userProfile = await prisma.user.findUnique({
      where: { id: user.id },
      select: { dailyGoalMinutes: true },
    });
    const dailyGoalMinutes = userProfile?.dailyGoalMinutes || 360;

    // Fetch sessions in range
    const sessions = await prisma.studySession.findMany({
      where: {
        userId: user.id,
        startTime: { gte: startDate, lte: endDate },
      },
      include: {
        subject: { select: { id: true, name: true, color: true } },
      },
      orderBy: { startTime: "asc" },
    });

    // Fetch all sessions for overall streak
    const allSessions = await prisma.studySession.findMany({
      where: { userId: user.id },
      select: { startTime: true, durationMinutes: true },
      orderBy: { startTime: "asc" },
    });

    const { currentStreak, longestStreak } = calculateStreaks(allSessions, dailyGoalMinutes);

    // Counts
    const [completedTasksCount, completedTopicsCount] = await Promise.all([
      prisma.task.count({
        where: {
          userId: user.id,
          status: "COMPLETED",
          updatedAt: { gte: startDate, lte: endDate },
        },
      }),
      prisma.topic.count({
        where: {
          userId: user.id,
          status: "COMPLETED",
        },
      }),
    ]);

    const totalMinutes = sessions.reduce((acc, s) => acc + s.durationMinutes, 0);
    const totalHours = Number((totalMinutes / 60).toFixed(1));
    const totalSessions = sessions.length;
    const avgDailyMinutes = Math.round(totalMinutes / daysCount);

    // 1. Daily Study Hours Chart Data
    const daysInterval = eachDayOfInterval({ start: startDate, end: endDate });
    const dailyMap: Record<string, { minutes: number; sessions: number }> = {};

    daysInterval.forEach((d) => {
      const key = format(d, "yyyy-MM-dd");
      dailyMap[key] = { minutes: 0, sessions: 0 };
    });

    sessions.forEach((s) => {
      const key = format(s.startTime, "yyyy-MM-dd");
      if (dailyMap[key]) {
        dailyMap[key].minutes += s.durationMinutes;
        dailyMap[key].sessions += 1;
      }
    });

    const dailyChartData = daysInterval.map((d) => {
      const key = format(d, "yyyy-MM-dd");
      const mins = dailyMap[key].minutes;
      const hours = Number((mins / 60).toFixed(1));
      return {
        date: format(d, daysCount <= 7 ? "EEE (dd)" : "MMM dd"),
        fullDate: key,
        hours,
        minutes: mins,
        sessions: dailyMap[key].sessions,
        goalHours: Number((dailyGoalMinutes / 60).toFixed(1)),
        isGoalMet: mins >= dailyGoalMinutes,
      };
    });

    // 2. Subject Distribution Data
    const subjectMap: Record<string, { name: string; color: string; minutes: number; sessions: number }> = {};
    sessions.forEach((s) => {
      const sub = s.subject;
      if (!subjectMap[sub.id]) {
        subjectMap[sub.id] = {
          name: sub.name,
          color: sub.color || "#EC4899",
          minutes: 0,
          sessions: 0,
        };
      }
      subjectMap[sub.id].minutes += s.durationMinutes;
      subjectMap[sub.id].sessions += 1;
    });

    const subjectDistribution = Object.values(subjectMap).map((item) => ({
      name: item.name,
      hours: Number((item.minutes / 60).toFixed(1)),
      minutes: item.minutes,
      formattedTime: formatMinutes(item.minutes),
      sessions: item.sessions,
      color: item.color,
      percentage: totalMinutes > 0 ? Math.round((item.minutes / totalMinutes) * 100) : 0,
    }));

    return NextResponse.json({
      range,
      summary: {
        totalMinutes,
        totalHours,
        formattedTotalTime: formatMinutes(totalMinutes),
        avgDailyMinutes,
        formattedAvgDailyTime: formatMinutes(avgDailyMinutes),
        totalSessions,
        completedTasksCount,
        completedTopicsCount,
        currentStreak,
        longestStreak,
      },
      dailyChartData,
      subjectDistribution,
    });
  } catch (error) {
    console.error("Analytics GET error:", error);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}

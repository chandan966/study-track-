import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import prisma from "@/lib/prisma";
import { startOfMonth, endOfMonth, parseISO, format } from "date-fns";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const yearParam = searchParams.get("year");
    const monthParam = searchParams.get("month"); // 1-12

    const now = new Date();
    const year = yearParam ? parseInt(yearParam) : now.getFullYear();
    const month = monthParam ? parseInt(monthParam) - 1 : now.getMonth();

    const targetDate = new Date(year, month, 1);
    const monthStart = startOfMonth(targetDate);
    const monthEnd = endOfMonth(targetDate);

    // Fetch user dailyGoalMinutes
    const userProfile = await prisma.user.findUnique({
      where: { id: user.id },
      select: { dailyGoalMinutes: true },
    });
    const dailyGoalMinutes = userProfile?.dailyGoalMinutes || 360;

    // Fetch sessions in month
    const sessions = await prisma.studySession.findMany({
      where: {
        userId: user.id,
        startTime: { gte: monthStart, lte: monthEnd },
      },
      include: {
        subject: { select: { id: true, name: true, color: true } },
        topic: { select: { id: true, name: true } },
      },
      orderBy: { startTime: "asc" },
    });

    // Fetch tasks completed in month
    const tasks = await prisma.task.findMany({
      where: {
        userId: user.id,
        status: "COMPLETED",
        updatedAt: { gte: monthStart, lte: monthEnd },
      },
      select: { id: true, title: true, updatedAt: true },
    });

    // Fetch notes created in month
    const notes = await prisma.studyNote.findMany({
      where: {
        userId: user.id,
        createdAt: { gte: monthStart, lte: monthEnd },
      },
      select: { id: true, title: true, createdAt: true },
    });

    // Group by date (yyyy-MM-dd)
    const dayDataMap: Record<
      string,
      {
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
    > = {};

    sessions.forEach((s) => {
      const dateKey = format(s.startTime, "yyyy-MM-dd");
      if (!dayDataMap[dateKey]) {
        dayDataMap[dateKey] = {
          date: dateKey,
          totalMinutes: 0,
          sessionsCount: 0,
          isGoalCompleted: false,
          intensity: "none",
          sessions: [],
          tasksCompletedCount: 0,
          notesCount: 0,
          subjectSummary: {},
        };
      }

      dayDataMap[dateKey].totalMinutes += s.durationMinutes;
      dayDataMap[dateKey].sessionsCount += 1;
      dayDataMap[dateKey].sessions.push(s);

      const subName = s.subject.name;
      if (!dayDataMap[dateKey].subjectSummary[subName]) {
        dayDataMap[dateKey].subjectSummary[subName] = {
          name: subName,
          color: s.subject.color,
          minutes: 0,
        };
      }
      dayDataMap[dateKey].subjectSummary[subName].minutes += s.durationMinutes;
    });

    // Add tasks
    tasks.forEach((t) => {
      const dateKey = format(t.updatedAt, "yyyy-MM-dd");
      if (dayDataMap[dateKey]) {
        dayDataMap[dateKey].tasksCompletedCount += 1;
      }
    });

    // Add notes
    notes.forEach((n) => {
      const dateKey = format(n.createdAt, "yyyy-MM-dd");
      if (dayDataMap[dateKey]) {
        dayDataMap[dateKey].notesCount += 1;
      }
    });

    // Determine intensities & goal completion
    Object.keys(dayDataMap).forEach((dateKey) => {
      const day = dayDataMap[dateKey];
      day.isGoalCompleted = day.totalMinutes >= dailyGoalMinutes;

      if (day.totalMinutes === 0) {
        day.intensity = "none";
      } else if (day.isGoalCompleted) {
        day.intensity = "high";
      } else if (day.totalMinutes >= dailyGoalMinutes * 0.5) {
        day.intensity = "medium";
      } else {
        day.intensity = "low";
      }
    });

    return NextResponse.json({
      year,
      month: month + 1,
      dailyGoalMinutes,
      days: dayDataMap,
    });
  } catch (error) {
    console.error("Calendar GET error:", error);
    return NextResponse.json({ error: "Failed to fetch calendar data" }, { status: 500 });
  }
}

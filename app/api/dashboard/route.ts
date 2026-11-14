import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import prisma from "@/lib/prisma";
import { calculateStreaks, formatMinutes } from "@/lib/utils";
import { startOfDay, endOfDay, format } from "date-fns";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = user.id;
    const now = new Date();
    const todayStart = startOfDay(now);
    const todayEnd = endOfDay(now);

    // Fetch user profile settings
    const userProfile = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        dailyGoalMinutes: true,
      },
    });

    const dailyGoalMinutes = userProfile?.dailyGoalMinutes || 360;

    // Fetch today's study sessions
    const todaySessions = await prisma.studySession.findMany({
      where: {
        userId,
        startTime: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
      include: {
        subject: { select: { id: true, name: true, color: true } },
        topic: { select: { id: true, name: true } },
      },
      orderBy: { startTime: "desc" },
    });

    const todayStudyMinutes = todaySessions.reduce((acc, s) => acc + s.durationMinutes, 0);

    // Fetch all sessions for streak calculation
    const allSessions = await prisma.studySession.findMany({
      where: { userId },
      select: { startTime: true, durationMinutes: true },
      orderBy: { startTime: "asc" },
    });

    const { currentStreak, longestStreak } = calculateStreaks(allSessions, dailyGoalMinutes);

    // Fetch tasks count
    const [pendingTasksCount, completedTasksTodayCount] = await Promise.all([
      prisma.task.count({
        where: { userId, status: "PENDING" },
      }),
      prisma.task.count({
        where: {
          userId,
          status: "COMPLETED",
          updatedAt: { gte: todayStart, lte: todayEnd },
        },
      }),
    ]);

    // Fetch recent 5 study sessions
    const recentSessions = await prisma.studySession.findMany({
      where: { userId },
      include: {
        subject: { select: { id: true, name: true, color: true } },
        topic: { select: { id: true, name: true } },
      },
      orderBy: { startTime: "desc" },
      take: 5,
    });

    // Fetch weak topics (< 50% understanding)
    const weakTopics = await prisma.topic.findMany({
      where: {
        userId,
        understanding: { lt: 50 },
      },
      include: {
        subject: { select: { id: true, name: true, color: true } },
      },
      orderBy: { understanding: "asc" },
      take: 4,
    });

    // Fetch pending revisions due today or earlier
    const dueRevisions = await prisma.revision.findMany({
      where: {
        userId,
        isCompleted: false,
        scheduledFor: { lte: todayEnd },
      },
      include: {
        topic: {
          select: {
            id: true,
            name: true,
            subject: { select: { name: true, color: true } },
          },
        },
      },
      take: 3,
    });

    // Goal calculation
    const goalPercentage = Math.min(100, Math.round((todayStudyMinutes / dailyGoalMinutes) * 100));

    return NextResponse.json({
      user: {
        name: userProfile?.name || "Student",
        email: userProfile?.email,
      },
      todayDate: format(now, "EEEE, dd MMMM yyyy"),
      stats: {
        todayStudyMinutes,
        todayStudyFormatted: formatMinutes(todayStudyMinutes),
        dailyGoalMinutes,
        dailyGoalFormatted: formatMinutes(dailyGoalMinutes),
        goalPercentage,
        isGoalCompleted: todayStudyMinutes >= dailyGoalMinutes,
        currentStreak,
        longestStreak,
        sessionsToday: todaySessions.length,
        pendingTasksCount,
        completedTasksTodayCount,
        totalSessionsOverall: allSessions.length,
        totalStudyMinutesOverall: allSessions.reduce((acc, s) => acc + s.durationMinutes, 0),
      },
      recentSessions,
      weakTopics,
      dueRevisions,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    return NextResponse.json({ error: "Failed to load dashboard data" }, { status: 500 });
  }
}

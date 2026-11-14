import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import prisma from "@/lib/prisma";
import { calculateStreaks, formatMinutes } from "@/lib/utils";
import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  format,
  eachDayOfInterval,
  subDays,
} from "date-fns";

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

    // Profile settings
    const userProfile = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        dailyGoalMinutes: true,
        college: true,
        course: true,
      },
    });

    const dailyGoalMinutes = userProfile?.dailyGoalMinutes || 360;

    // 1. TODAY'S SESSIONS (Detailed)
    const todaySessions = await prisma.studySession.findMany({
      where: {
        userId,
        startTime: { gte: todayStart, lte: todayEnd },
      },
      include: {
        subject: { select: { id: true, name: true, color: true } },
        topic: { select: { id: true, name: true, understanding: true } },
      },
      orderBy: { startTime: "asc" },
    });

    const todayStudyMinutes = todaySessions.reduce((acc, s) => acc + s.durationMinutes, 0);

    // 2. WEEKLY PROGRESS (Past 7 Days)
    const weekStartDate = startOfDay(subDays(now, 6));
    const weekEndDate = endOfDay(now);

    const weekSessions = await prisma.studySession.findMany({
      where: {
        userId,
        startTime: { gte: weekStartDate, lte: weekEndDate },
      },
      include: {
        subject: { select: { id: true, name: true, color: true } },
        topic: { select: { id: true, name: true } },
      },
      orderBy: { startTime: "asc" },
    });

    const totalWeeklyMinutes = weekSessions.reduce((acc, s) => acc + s.durationMinutes, 0);

    // Group weekly by day
    const weekInterval = eachDayOfInterval({ start: weekStartDate, end: weekEndDate });
    const weekDayMap: Record<string, { minutes: number; sessions: number; subjects: Set<string> }> = {};

    weekInterval.forEach((d) => {
      const key = format(d, "yyyy-MM-dd");
      weekDayMap[key] = { minutes: 0, sessions: 0, subjects: new Set() };
    });

    weekSessions.forEach((s) => {
      const key = format(s.startTime, "yyyy-MM-dd");
      if (weekDayMap[key]) {
        weekDayMap[key].minutes += s.durationMinutes;
        weekDayMap[key].sessions += 1;
        weekDayMap[key].subjects.add(s.subject.name);
      }
    });

    let weeklyGoalMetDaysCount = 0;
    const weeklyChartData = weekInterval.map((d) => {
      const key = format(d, "yyyy-MM-dd");
      const mins = weekDayMap[key].minutes;
      const isGoalMet = mins >= dailyGoalMinutes;
      if (isGoalMet) weeklyGoalMetDaysCount += 1;

      return {
        day: format(d, "EEE"),
        date: format(d, "dd MMM"),
        fullDate: key,
        hours: Number((mins / 60).toFixed(1)),
        minutes: mins,
        formattedDuration: formatMinutes(mins),
        sessionsCount: weekDayMap[key].sessions,
        subjectsCount: weekDayMap[key].subjects.size,
        isGoalMet,
      };
    });

    // Subject breakdown for this week
    const weeklySubjectMap: Record<string, { name: string; color: string; minutes: number }> = {};
    weekSessions.forEach((s) => {
      if (!weeklySubjectMap[s.subject.name]) {
        weeklySubjectMap[s.subject.name] = {
          name: s.subject.name,
          color: s.subject.color,
          minutes: 0,
        };
      }
      weeklySubjectMap[s.subject.name].minutes += s.durationMinutes;
    });

    // 3. MONTHLY PROGRESS
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    const monthSessions = await prisma.studySession.findMany({
      where: {
        userId,
        startTime: { gte: monthStart, lte: monthEnd },
      },
      include: {
        subject: { select: { id: true, name: true, color: true } },
      },
    });

    const totalMonthlyMinutes = monthSessions.reduce((acc, s) => acc + s.durationMinutes, 0);
    const totalMonthlyHours = Number((totalMonthlyMinutes / 60).toFixed(1));

    // Active days this month
    const activeDaysSet = new Set<string>();
    const monthlySubjectMap: Record<string, { name: string; color: string; minutes: number }> = {};

    monthSessions.forEach((s) => {
      activeDaysSet.add(format(s.startTime, "yyyy-MM-dd"));
      if (!monthlySubjectMap[s.subject.name]) {
        monthlySubjectMap[s.subject.name] = {
          name: s.subject.name,
          color: s.subject.color,
          minutes: 0,
        };
      }
      monthlySubjectMap[s.subject.name].minutes += s.durationMinutes;
    });

    const monthlyGoalMinutes = dailyGoalMinutes * 25; // 25 study days/month target
    const monthlyGoalPercent = Math.min(100, Math.round((totalMonthlyMinutes / monthlyGoalMinutes) * 100));

    // 4. OVERALL CURRICULUM & STREAKS
    const allSessions = await prisma.studySession.findMany({
      where: { userId },
      select: { startTime: true, durationMinutes: true },
      orderBy: { startTime: "asc" },
    });

    const { currentStreak, longestStreak } = calculateStreaks(allSessions, dailyGoalMinutes);

    const [allSubjects, allTopics, pendingTasksCount, completedTasksTodayCount] = await Promise.all([
      prisma.subject.findMany({
        where: { userId },
        include: {
          _count: { select: { topics: true, studySessions: true } },
        },
      }),
      prisma.topic.findMany({
        where: { userId },
        select: { id: true, status: true, understanding: true },
      }),
      prisma.task.count({ where: { userId, status: "PENDING" } }),
      prisma.task.count({
        where: {
          userId,
          status: "COMPLETED",
          updatedAt: { gte: todayStart, lte: todayEnd },
        },
      }),
    ]);

    const completedTopicsCount = allTopics.filter((t) => t.status === "COMPLETED").length;
    const avgUnderstanding =
      allTopics.length > 0
        ? Math.round(allTopics.reduce((acc, t) => acc + t.understanding, 0) / allTopics.length)
        : 0;

    // 5. WEAK TOPICS (< 50%)
    const weakTopics = await prisma.topic.findMany({
      where: { userId, understanding: { lt: 50 } },
      include: { subject: { select: { id: true, name: true, color: true } } },
      orderBy: { understanding: "asc" },
      take: 5,
    });

    // 6. DUE REVISIONS
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
      take: 4,
    });

    const goalPercentage = Math.min(100, Math.round((todayStudyMinutes / dailyGoalMinutes) * 100));

    return NextResponse.json({
      user: {
        name: userProfile?.name || "Student",
        email: userProfile?.email,
        college: userProfile?.college,
        course: userProfile?.course,
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
        totalSubjectsCount: allSubjects.length,
        totalTopicsCount: allTopics.length,
        completedTopicsCount,
        averageUnderstanding: avgUnderstanding,
      },
      // Daily breakdown
      todaySessions: todaySessions.map((s) => ({
        id: s.id,
        time: format(s.startTime, "hh:mm a"),
        endTime: format(s.endTime, "hh:mm a"),
        subjectName: s.subject.name,
        subjectColor: s.subject.color,
        topicName: s.topic?.name || "General Topic Study",
        durationMinutes: s.durationMinutes,
        durationFormatted: formatMinutes(s.durationMinutes),
        mode: s.mode,
        difficulty: s.difficulty,
        whatStudied: s.whatStudied,
        whatLearned: s.whatLearned,
        whatUnderstood: s.whatUnderstood,
        whatNotUnderstood: s.whatNotUnderstood,
        personalNotes: s.personalNotes,
      })),
      // Weekly breakdown
      weeklyProgress: {
        totalMinutes: totalWeeklyMinutes,
        totalHours: Number((totalWeeklyMinutes / 60).toFixed(1)),
        formattedTotalTime: formatMinutes(totalWeeklyMinutes),
        weeklyGoalMetDaysCount,
        dailyChart: weeklyChartData,
        subjectBreakdown: Object.values(weeklySubjectMap).map((item) => ({
          ...item,
          hours: Number((item.minutes / 60).toFixed(1)),
          formattedTime: formatMinutes(item.minutes),
          percentage: totalWeeklyMinutes > 0 ? Math.round((item.minutes / totalWeeklyMinutes) * 100) : 0,
        })),
        uniqueTopicsCount: new Set(weekSessions.map((s) => s.topicId).filter(Boolean)).size,
      },
      // Monthly breakdown
      monthlyProgress: {
        monthName: format(now, "MMMM yyyy"),
        totalMinutes: totalMonthlyMinutes,
        totalHours: totalMonthlyHours,
        formattedTotalTime: formatMinutes(totalMonthlyMinutes),
        activeStudyDaysCount: activeDaysSet.size,
        monthlyGoalPercent,
        sessionsCount: monthSessions.length,
        subjectBreakdown: Object.values(monthlySubjectMap).map((item) => ({
          ...item,
          hours: Number((item.minutes / 60).toFixed(1)),
          formattedTime: formatMinutes(item.minutes),
          percentage: totalMonthlyMinutes > 0 ? Math.round((item.minutes / totalMonthlyMinutes) * 100) : 0,
        })),
      },
      weakTopics,
      dueRevisions,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    return NextResponse.json({ error: "Failed to load dashboard data" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import prisma from "@/lib/prisma";
import { SYSTEM_ACHIEVEMENTS, evaluateAndUnlockAchievements } from "@/lib/achievements";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Ensure achievements are up to date with real data
    await evaluateAndUnlockAchievements(user.id);

    // Fetch all achievements and user unlocked achievements
    const [allAchievements, userAchievements] = await Promise.all([
      prisma.achievement.findMany({ orderBy: { targetValue: "asc" } }),
      prisma.userAchievement.findMany({
        where: { userId: user.id },
        include: { achievement: true },
      }),
    ]);

    const unlockedMap = new Map(
      userAchievements.map((ua) => [ua.achievement.code, ua.unlockedAt])
    );

    // Compute progress stats for locked achievements
    const [sessions, completedTopicsCount] = await Promise.all([
      prisma.studySession.findMany({
        where: { userId: user.id },
        select: { durationMinutes: true },
      }),
      prisma.topic.count({
        where: { userId: user.id, status: "COMPLETED" },
      }),
    ]);

    const totalMinutes = sessions.reduce((sum, s) => sum + s.durationMinutes, 0);
    const totalHours = Math.round(totalMinutes / 60);
    const totalSessions = sessions.length;

    const formatted = allAchievements.map((ach) => {
      const isUnlocked = unlockedMap.has(ach.code);
      const unlockedAt = unlockedMap.get(ach.code) || null;

      let currentProgress = 0;
      if (ach.category === "HOURS") currentProgress = totalHours;
      else if (ach.category === "SESSIONS") currentProgress = totalSessions;
      else if (ach.category === "TOPICS") currentProgress = completedTopicsCount;

      const progressPercent = isUnlocked
        ? 100
        : Math.min(100, Math.round((currentProgress / ach.targetValue) * 100));

      return {
        id: ach.id,
        code: ach.code,
        title: ach.title,
        description: ach.description,
        icon: ach.icon,
        category: ach.category,
        targetValue: ach.targetValue,
        isUnlocked,
        unlockedAt,
        currentProgress,
        progressPercent,
      };
    });

    return NextResponse.json({
      achievements: formatted,
      totalUnlocked: userAchievements.length,
      totalAvailable: allAchievements.length,
    });
  } catch (error) {
    console.error("Achievements GET error:", error);
    return NextResponse.json({ error: "Failed to fetch achievements" }, { status: 500 });
  }
}

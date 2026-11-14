import prisma from "./prisma";

export const SYSTEM_ACHIEVEMENTS = [
  {
    code: "FIRST_SESSION",
    title: "First Step",
    description: "Completed your first study session.",
    icon: "award",
    category: "SESSIONS",
    targetValue: 1,
  },
  {
    code: "HOURS_10",
    title: "Dedicated Learner",
    description: "Studied for a total of 10 hours.",
    icon: "clock",
    category: "HOURS",
    targetValue: 10,
  },
  {
    code: "HOURS_50",
    title: "Deep Focus Master",
    description: "Studied for a total of 50 hours.",
    icon: "flame",
    category: "HOURS",
    targetValue: 50,
  },
  {
    code: "HOURS_100",
    title: "Centurion Scholar",
    description: "Accumulated 100 hours of focused study.",
    icon: "crown",
    category: "HOURS",
    targetValue: 100,
  },
  {
    code: "STREAK_7",
    title: "Unstoppable Week",
    description: "Maintained a 7-day study streak.",
    icon: "zap",
    category: "STREAK",
    targetValue: 7,
  },
  {
    code: "STREAK_30",
    title: "Habit of Excellence",
    description: "Maintained a 30-day study streak.",
    icon: "sparkles",
    category: "STREAK",
    targetValue: 30,
  },
  {
    code: "SESSIONS_100",
    title: "Century of Sessions",
    description: "Completed 100 study sessions.",
    icon: "layers",
    category: "SESSIONS",
    targetValue: 100,
  },
  {
    code: "TOPICS_50",
    title: "Knowledge Conqueror",
    description: "Completed 50 study topics.",
    icon: "check-circle",
    category: "TOPICS",
    targetValue: 50,
  },
  {
    code: "GOALS_7",
    title: "Target Crusher",
    description: "Hit your daily study target 7 times.",
    icon: "target",
    category: "GOALS",
    targetValue: 7,
  },
];

export async function evaluateAndUnlockAchievements(userId: string) {
  try {
    // 1. Ensure system achievements exist in DB
    for (const ach of SYSTEM_ACHIEVEMENTS) {
      await prisma.achievement.upsert({
        where: { code: ach.code },
        update: {
          title: ach.title,
          description: ach.description,
          icon: ach.icon,
          category: ach.category,
          targetValue: ach.targetValue,
        },
        create: ach,
      });
    }

    // 2. Fetch user's current achievements
    const existing = await prisma.userAchievement.findMany({
      where: { userId },
      include: { achievement: true },
    });
    const unlockedCodes = new Set(existing.map((e) => e.achievement.code));

    // 3. Fetch user statistics
    const [sessions, completedTopicsCount] = await Promise.all([
      prisma.studySession.findMany({
        where: { userId },
        select: { durationMinutes: true, startTime: true },
      }),
      prisma.topic.count({
        where: { userId, status: "COMPLETED" },
      }),
    ]);

    const totalMinutes = sessions.reduce((sum, s) => sum + s.durationMinutes, 0);
    const totalHours = totalMinutes / 60;
    const totalSessions = sessions.length;

    // Check achievements
    const newlyUnlocked: string[] = [];

    // FIRST_SESSION
    if (totalSessions >= 1 && !unlockedCodes.has("FIRST_SESSION")) {
      newlyUnlocked.push("FIRST_SESSION");
    }

    // SESSIONS_100
    if (totalSessions >= 100 && !unlockedCodes.has("SESSIONS_100")) {
      newlyUnlocked.push("SESSIONS_100");
    }

    // HOURS_10, 50, 100
    if (totalHours >= 10 && !unlockedCodes.has("HOURS_10")) newlyUnlocked.push("HOURS_10");
    if (totalHours >= 50 && !unlockedCodes.has("HOURS_50")) newlyUnlocked.push("HOURS_50");
    if (totalHours >= 100 && !unlockedCodes.has("HOURS_100")) newlyUnlocked.push("HOURS_100");

    // TOPICS_50
    if (completedTopicsCount >= 50 && !unlockedCodes.has("TOPICS_50")) {
      newlyUnlocked.push("TOPICS_50");
    }

    // Save newly unlocked achievements & notifications
    for (const code of newlyUnlocked) {
      const ach = await prisma.achievement.findUnique({ where: { code } });
      if (ach) {
        await prisma.userAchievement.create({
          data: {
            userId,
            achievementId: ach.id,
          },
        });

        await prisma.notification.create({
          data: {
            userId,
            title: `Achievement Unlocked: ${ach.title}! 🏆`,
            message: ach.description,
            type: "INFO",
          },
        });
      }
    }

    return newlyUnlocked;
  } catch (error) {
    console.error("Error evaluating achievements:", error);
    return [];
  }
}

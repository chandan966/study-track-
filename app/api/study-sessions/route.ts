import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import prisma from "@/lib/prisma";
import { studySessionSchema } from "@/lib/validations";
import { evaluateAndUnlockAchievements } from "@/lib/achievements";
import { startOfDay, endOfDay } from "date-fns";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const subjectId = searchParams.get("subjectId");
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : 50;

    const where: any = { userId: user.id };
    if (subjectId) where.subjectId = subjectId;

    const sessions = await prisma.studySession.findMany({
      where,
      include: {
        subject: { select: { id: true, name: true, color: true } },
        topic: { select: { id: true, name: true } },
      },
      orderBy: { startTime: "desc" },
      take: limit,
    });

    return NextResponse.json(sessions);
  } catch (error) {
    console.error("Study sessions GET error:", error);
    return NextResponse.json({ error: "Failed to fetch study sessions" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const result = studySessionSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    // Verify subject ownership
    const subject = await prisma.subject.findFirst({
      where: { id: result.data.subjectId, userId: user.id },
    });

    if (!subject) {
      return NextResponse.json({ error: "Subject not found or unauthorized" }, { status: 404 });
    }

    // Verify topic if provided
    if (result.data.topicId) {
      const topic = await prisma.topic.findFirst({
        where: { id: result.data.topicId, userId: user.id },
      });
      if (!topic) {
        return NextResponse.json({ error: "Topic not found" }, { status: 404 });
      }
    }

    const startTime = new Date(result.data.startTime);
    const endTime = new Date(result.data.endTime);

    // Save study session
    const session = await prisma.studySession.create({
      data: {
        userId: user.id,
        subjectId: result.data.subjectId,
        topicId: result.data.topicId,
        mode: result.data.mode,
        durationMinutes: result.data.durationMinutes,
        durationSeconds: result.data.durationSeconds,
        startTime,
        endTime,
        whatStudied: result.data.whatStudied,
        whatLearned: result.data.whatLearned,
        whatUnderstood: result.data.whatUnderstood,
        whatNotUnderstood: result.data.whatNotUnderstood,
        difficulty: result.data.difficulty,
        personalNotes: result.data.personalNotes,
      },
      include: {
        subject: { select: { id: true, name: true, color: true } },
        topic: { select: { id: true, name: true } },
      },
    });

    // Check daily goal notification
    const todayStart = startOfDay(startTime);
    const todayEnd = endOfDay(startTime);

    const userProfile = await prisma.user.findUnique({
      where: { id: user.id },
      select: { dailyGoalMinutes: true },
    });

    const dailyGoalMinutes = userProfile?.dailyGoalMinutes || 360;

    const todaySessions = await prisma.studySession.findMany({
      where: {
        userId: user.id,
        startTime: { gte: todayStart, lte: todayEnd },
      },
      select: { durationMinutes: true },
    });

    const totalTodayMinutes = todaySessions.reduce((sum, s) => sum + s.durationMinutes, 0);

    if (totalTodayMinutes >= dailyGoalMinutes) {
      // Check if goal notification already created today
      const existingNotif = await prisma.notification.findFirst({
        where: {
          userId: user.id,
          type: "GOAL",
          createdAt: { gte: todayStart, lte: todayEnd },
        },
      });

      if (!existingNotif) {
        await prisma.notification.create({
          data: {
            userId: user.id,
            title: "Daily Goal Completed! 🎉",
            message: `Congratulations! You reached your goal of ${Math.round(dailyGoalMinutes / 60)} hours of study today.`,
            type: "GOAL",
          },
        });
      }
    }

    // Evaluate and unlock achievements asynchronously
    const unlockedAchievements = await evaluateAndUnlockAchievements(user.id);

    return NextResponse.json(
      {
        session,
        unlockedAchievements,
        isGoalCompleted: totalTodayMinutes >= dailyGoalMinutes,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Study session POST error:", error);
    return NextResponse.json({ error: "Failed to record study session" }, { status: 500 });
  }
}

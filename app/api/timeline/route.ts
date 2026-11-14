import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import prisma from "@/lib/prisma";
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, format } from "date-fns";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const filter = searchParams.get("filter") || "all"; // today, week, month, all
    const subjectId = searchParams.get("subjectId");

    const now = new Date();
    const where: any = { userId: user.id };

    if (subjectId) {
      where.subjectId = subjectId;
    }

    if (filter === "today") {
      where.startTime = { gte: startOfDay(now), lte: endOfDay(now) };
    } else if (filter === "week") {
      where.startTime = { gte: startOfWeek(now, { weekStartsOn: 1 }), lte: endOfWeek(now, { weekStartsOn: 1 }) };
    } else if (filter === "month") {
      where.startTime = { gte: startOfMonth(now), lte: endOfMonth(now) };
    }

    const sessions = await prisma.studySession.findMany({
      where,
      include: {
        subject: { select: { id: true, name: true, color: true } },
        topic: { select: { id: true, name: true } },
      },
      orderBy: { startTime: "desc" },
    });

    // Group sessions by day for nice visual timeline groupings
    const grouped: Record<string, typeof sessions> = {};
    sessions.forEach((s) => {
      const dayKey = format(s.startTime, "yyyy-MM-dd");
      if (!grouped[dayKey]) {
        grouped[dayKey] = [];
      }
      grouped[dayKey].push(s);
    });

    const timelineData = Object.keys(grouped).map((dayKey) => {
      const items = grouped[dayKey];
      const totalDayMinutes = items.reduce((acc, curr) => acc + curr.durationMinutes, 0);
      return {
        dateKey: dayKey,
        formattedDate: format(new Date(dayKey), "EEEE, dd MMMM yyyy"),
        totalMinutes: totalDayMinutes,
        sessions: items.map((item) => ({
          id: item.id,
          time: format(item.startTime, "hh:mm a"),
          endTime: format(item.endTime, "hh:mm a"),
          subjectName: item.subject.name,
          subjectColor: item.subject.color,
          topicName: item.topic?.name || "General Study",
          durationMinutes: item.durationMinutes,
          difficulty: item.difficulty,
          whatStudied: item.whatStudied,
          whatLearned: item.whatLearned,
          personalNotes: item.personalNotes,
          mode: item.mode,
        })),
      };
    });

    return NextResponse.json(timelineData);
  } catch (error) {
    console.error("Timeline GET error:", error);
    return NextResponse.json({ error: "Failed to fetch timeline" }, { status: 500 });
  }
}

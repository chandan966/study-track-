import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import prisma from "@/lib/prisma";
import { subjectSchema } from "@/lib/validations";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const subjects = await prisma.subject.findMany({
      where: { userId: user.id },
      include: {
        topics: {
          select: { id: true, name: true, status: true, understanding: true },
        },
        studySessions: {
          select: { durationMinutes: true },
        },
        tasks: {
          select: { id: true, status: true },
        },
        notes: {
          select: { id: true },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    const formatted = subjects.map((sub) => {
      const totalMinutes = sub.studySessions.reduce((acc, s) => acc + s.durationMinutes, 0);
      const completedTopics = sub.topics.filter((t) => t.status === "COMPLETED").length;
      const totalTopics = sub.topics.length;
      const avgUnderstanding =
        totalTopics > 0
          ? Math.round(sub.topics.reduce((acc, t) => acc + t.understanding, 0) / totalTopics)
          : 0;

      return {
        id: sub.id,
        name: sub.name,
        description: sub.description,
        color: sub.color,
        icon: sub.icon,
        targetHours: sub.targetHours,
        isArchived: sub.isArchived,
        totalStudyMinutes: totalMinutes,
        sessionsCount: sub.studySessions.length,
        totalTopics,
        completedTopics,
        pendingTopics: totalTopics - completedTopics,
        averageUnderstanding: avgUnderstanding,
        notesCount: sub.notes.length,
        tasksCount: sub.tasks.length,
      };
    });

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Subjects GET error:", error);
    return NextResponse.json({ error: "Failed to fetch subjects" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const result = subjectSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const subject = await prisma.subject.create({
      data: {
        ...result.data,
        userId: user.id,
      },
    });

    return NextResponse.json(subject, { status: 201 });
  } catch (error) {
    console.error("Subjects POST error:", error);
    return NextResponse.json({ error: "Failed to create subject" }, { status: 500 });
  }
}

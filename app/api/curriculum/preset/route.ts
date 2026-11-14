import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import prisma from "@/lib/prisma";
import { EXAM_PRESETS } from "@/lib/curriculumTemplates";

export const dynamic = "force-dynamic";

export async function GET() {
  // Returns the list of all available presets for UI preview
  return NextResponse.json(
    EXAM_PRESETS.map((p) => ({
      id: p.id,
      title: p.title,
      subtitle: p.subtitle,
      badge: p.badge,
      badgeColor: p.badgeColor,
      subjectCount: p.subjects.length,
      topicCount: p.subjects.reduce((sum, s) => sum + s.topics.length, 0),
      subjects: p.subjects.map((s) => ({
        name: s.name,
        color: s.color,
        targetHours: s.targetHours,
        topicCount: s.topics.length,
      })),
    }))
  );
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { examId, clearExisting } = body;

    const preset = EXAM_PRESETS.find((p) => p.id === examId);
    if (!preset) {
      return NextResponse.json({ error: "Invalid exam preset selected" }, { status: 400 });
    }

    // Optionally clear existing subjects if user explicitly requests clean replacement
    if (clearExisting) {
      await prisma.topic.deleteMany({ where: { userId: user.id } });
      await prisma.subject.deleteMany({ where: { userId: user.id } });
    }

    let subjectsAddedCount = 0;
    let topicsAddedCount = 0;

    for (const subTpl of preset.subjects) {
      // Check if subject already exists for this user
      let subject = await prisma.subject.findFirst({
        where: { userId: user.id, name: subTpl.name },
      });

      if (!subject) {
        subject = await prisma.subject.create({
          data: {
            userId: user.id,
            name: subTpl.name,
            description: subTpl.description,
            color: subTpl.color,
            icon: subTpl.icon,
            targetHours: subTpl.targetHours,
          },
        });
        subjectsAddedCount += 1;
      }

      // Add topics under this subject
      for (const topTpl of subTpl.topics) {
        const existingTopic = await prisma.topic.findFirst({
          where: { userId: user.id, subjectId: subject.id, name: topTpl.name },
        });

        if (!existingTopic) {
          await prisma.topic.create({
            data: {
              userId: user.id,
              subjectId: subject.id,
              name: topTpl.name,
              description: topTpl.description,
              difficulty: topTpl.difficulty,
              understanding: topTpl.understanding,
              status: topTpl.understanding >= 80 ? "COMPLETED" : topTpl.understanding > 0 ? "IN_PROGRESS" : "NOT_STARTED",
            },
          });
          topicsAddedCount += 1;
        }
      }
    }

    // Create a congratulatory notification in the student's account
    await prisma.notification.create({
      data: {
        userId: user.id,
        title: `Curriculum Loaded: ${preset.title}! 📚`,
        message: `Successfully loaded ${subjectsAddedCount} subjects and ${topicsAddedCount} official syllabus topics for ${preset.title}. Ready to study!`,
        type: "INFO",
      },
    });

    return NextResponse.json({
      success: true,
      message: `Successfully loaded curriculum for ${preset.title}!`,
      examTitle: preset.title,
      subjectsAddedCount,
      topicsAddedCount,
    });
  } catch (error) {
    console.error("Exam preset POST error:", error);
    return NextResponse.json({ error: "Failed to load exam curriculum" }, { status: 500 });
  }
}

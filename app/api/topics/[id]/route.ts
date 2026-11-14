import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import prisma from "@/lib/prisma";
import { topicSchema } from "@/lib/validations";

export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const topic = await prisma.topic.findFirst({
      where: { id: params.id, userId: user.id },
      include: {
        subject: { select: { id: true, name: true, color: true } },
        studySessions: {
          orderBy: { startTime: "desc" },
          take: 10,
        },
        notes: true,
        revisions: {
          orderBy: { scheduledFor: "asc" },
        },
      },
    });

    if (!topic) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 });
    }

    return NextResponse.json(topic);
  } catch (error) {
    console.error("Topic detail GET error:", error);
    return NextResponse.json({ error: "Failed to fetch topic" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const existing = await prisma.topic.findFirst({
      where: { id: params.id, userId: user.id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 });
    }

    const body = await req.json();
    const result = topicSchema.partial().safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const updated = await prisma.topic.update({
      where: { id: params.id },
      data: {
        name: result.data.name ?? existing.name,
        description: result.data.description !== undefined ? result.data.description : existing.description,
        status: result.data.status ?? existing.status,
        understanding: result.data.understanding !== undefined ? result.data.understanding : existing.understanding,
        difficulty: result.data.difficulty ?? existing.difficulty,
        revisionDate:
          result.data.revisionDate !== undefined
            ? result.data.revisionDate
              ? new Date(result.data.revisionDate)
              : null
            : existing.revisionDate,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Topic PUT error:", error);
    return NextResponse.json({ error: "Failed to update topic" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const existing = await prisma.topic.findFirst({
      where: { id: params.id, userId: user.id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 });
    }

    await prisma.topic.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Topic deleted successfully" });
  } catch (error) {
    console.error("Topic DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete topic" }, { status: 500 });
  }
}

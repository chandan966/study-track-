import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import prisma from "@/lib/prisma";
import { subjectSchema } from "@/lib/validations";

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

    const subject = await prisma.subject.findFirst({
      where: { id: params.id, userId: user.id },
      include: {
        topics: {
          orderBy: { createdAt: "desc" },
        },
        studySessions: {
          orderBy: { startTime: "desc" },
          take: 10,
          include: { topic: { select: { name: true } } },
        },
        notes: {
          orderBy: { updatedAt: "desc" },
        },
        tasks: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!subject) {
      return NextResponse.json({ error: "Subject not found" }, { status: 404 });
    }

    const totalMinutes = subject.studySessions.reduce((acc, s) => acc + s.durationMinutes, 0);

    return NextResponse.json({
      ...subject,
      totalStudyMinutes: totalMinutes,
      completedTopicsCount: subject.topics.filter((t) => t.status === "COMPLETED").length,
      totalTopicsCount: subject.topics.length,
    });
  } catch (error) {
    console.error("Subject GET detail error:", error);
    return NextResponse.json({ error: "Failed to fetch subject" }, { status: 500 });
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

    const existing = await prisma.subject.findFirst({
      where: { id: params.id, userId: user.id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Subject not found" }, { status: 404 });
    }

    const body = await req.json();
    const result = subjectSchema.partial().safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const updated = await prisma.subject.update({
      where: { id: params.id },
      data: {
        name: result.data.name ?? existing.name,
        description: result.data.description !== undefined ? result.data.description : existing.description,
        color: result.data.color ?? existing.color,
        icon: result.data.icon ?? existing.icon,
        targetHours: result.data.targetHours ?? existing.targetHours,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Subject PUT error:", error);
    return NextResponse.json({ error: "Failed to update subject" }, { status: 500 });
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

    const existing = await prisma.subject.findFirst({
      where: { id: params.id, userId: user.id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Subject not found" }, { status: 404 });
    }

    await prisma.subject.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Subject deleted successfully" });
  } catch (error) {
    console.error("Subject DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete subject" }, { status: 500 });
  }
}

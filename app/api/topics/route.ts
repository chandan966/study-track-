import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import prisma from "@/lib/prisma";
import { topicSchema } from "@/lib/validations";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const subjectId = searchParams.get("subjectId");
    const weakOnly = searchParams.get("weak") === "true";

    const where: any = { userId: user.id };
    if (subjectId) where.subjectId = subjectId;
    if (weakOnly) where.understanding = { lt: 50 };

    const topics = await prisma.topic.findMany({
      where,
      include: {
        subject: { select: { id: true, name: true, color: true } },
        _count: { select: { studySessions: true, notes: true, revisions: true } },
      },
      orderBy: [{ understanding: "asc" }, { updatedAt: "desc" }],
    });

    return NextResponse.json(topics);
  } catch (error) {
    console.error("Topics GET error:", error);
    return NextResponse.json({ error: "Failed to fetch topics" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const result = topicSchema.safeParse(body);

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

    const topic = await prisma.topic.create({
      data: {
        name: result.data.name,
        description: result.data.description,
        status: result.data.status,
        understanding: result.data.understanding,
        difficulty: result.data.difficulty,
        revisionDate: result.data.revisionDate ? new Date(result.data.revisionDate) : null,
        subjectId: result.data.subjectId,
        userId: user.id,
      },
    });

    return NextResponse.json(topic, { status: 201 });
  } catch (error) {
    console.error("Topics POST error:", error);
    return NextResponse.json({ error: "Failed to create topic" }, { status: 500 });
  }
}

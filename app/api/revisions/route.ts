import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { addDays } from "date-fns";

export const dynamic = "force-dynamic";

const revisionSchema = z.object({
  topicId: z.string().min(1, "Topic is required"),
  intervalDays: z.number().min(1).default(1),
  scheduledFor: z.string().optional(),
  notes: z.string().optional().nullable(),
});

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const revisions = await prisma.revision.findMany({
      where: { userId: user.id },
      include: {
        topic: {
          include: {
            subject: { select: { id: true, name: true, color: true } },
          },
        },
      },
      orderBy: [
        { isCompleted: "asc" },
        { scheduledFor: "asc" },
      ],
    });

    return NextResponse.json(revisions);
  } catch (error) {
    console.error("Revisions GET error:", error);
    return NextResponse.json({ error: "Failed to fetch revisions" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const result = revisionSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const topic = await prisma.topic.findFirst({
      where: { id: result.data.topicId, userId: user.id },
    });

    if (!topic) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 });
    }

    const scheduledDate = result.data.scheduledFor
      ? new Date(result.data.scheduledFor)
      : addDays(new Date(), result.data.intervalDays);

    const revision = await prisma.revision.create({
      data: {
        userId: user.id,
        topicId: result.data.topicId,
        intervalDays: result.data.intervalDays,
        scheduledFor: scheduledDate,
        notes: result.data.notes,
      },
      include: {
        topic: {
          include: {
            subject: { select: { id: true, name: true, color: true } },
          },
        },
      },
    });

    return NextResponse.json(revision, { status: 201 });
  } catch (error) {
    console.error("Revisions POST error:", error);
    return NextResponse.json({ error: "Failed to schedule revision" }, { status: 500 });
  }
}

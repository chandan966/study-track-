import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import prisma from "@/lib/prisma";
import { taskSchema } from "@/lib/validations";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const subjectId = searchParams.get("subjectId");
    const status = searchParams.get("status");

    const where: any = { userId: user.id };
    if (subjectId) where.subjectId = subjectId;
    if (status) where.status = status;

    const tasks = await prisma.task.findMany({
      where,
      include: {
        subject: { select: { id: true, name: true, color: true } },
      },
      orderBy: [
        { status: "asc" }, // PENDING first
        { dueDate: "asc" },
        { createdAt: "desc" },
      ],
    });

    return NextResponse.json(tasks);
  } catch (error) {
    console.error("Tasks GET error:", error);
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const result = taskSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    if (result.data.subjectId) {
      const subject = await prisma.subject.findFirst({
        where: { id: result.data.subjectId, userId: user.id },
      });
      if (!subject) {
        return NextResponse.json({ error: "Subject not found" }, { status: 404 });
      }
    }

    const task = await prisma.task.create({
      data: {
        title: result.data.title,
        description: result.data.description,
        subjectId: result.data.subjectId,
        dueDate: result.data.dueDate ? new Date(result.data.dueDate) : null,
        priority: result.data.priority,
        status: result.data.status,
        isRecurring: result.data.isRecurring,
        userId: user.id,
      },
      include: {
        subject: { select: { id: true, name: true, color: true } },
      },
    });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error("Tasks POST error:", error);
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
  }
}

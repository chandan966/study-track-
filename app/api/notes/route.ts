import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import prisma from "@/lib/prisma";
import { noteSchema } from "@/lib/validations";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const subjectId = searchParams.get("subjectId");
    const tag = searchParams.get("tag");

    const where: any = { userId: user.id };
    if (subjectId) where.subjectId = subjectId;

    if (tag) {
      where.tags = { contains: tag, mode: "insensitive" };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
        { tags: { contains: search, mode: "insensitive" } },
      ];
    }

    const notes = await prisma.studyNote.findMany({
      where,
      include: {
        subject: { select: { id: true, name: true, color: true } },
        topic: { select: { id: true, name: true } },
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json(notes);
  } catch (error) {
    console.error("Notes GET error:", error);
    return NextResponse.json({ error: "Failed to fetch notes" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const result = noteSchema.safeParse(body);

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

    const note = await prisma.studyNote.create({
      data: {
        title: result.data.title,
        content: result.data.content,
        subjectId: result.data.subjectId,
        topicId: result.data.topicId,
        tags: result.data.tags,
        userId: user.id,
      },
      include: {
        subject: { select: { id: true, name: true, color: true } },
        topic: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json(note, { status: 201 });
  } catch (error) {
    console.error("Notes POST error:", error);
    return NextResponse.json({ error: "Failed to create note" }, { status: 500 });
  }
}

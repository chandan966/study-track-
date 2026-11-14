import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const existing = await prisma.revision.findFirst({
      where: { id: params.id, userId: user.id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Revision not found" }, { status: 404 });
    }

    const body = await req.json();
    const isCompleted = body.isCompleted !== undefined ? Boolean(body.isCompleted) : true;

    const updated = await prisma.revision.update({
      where: { id: params.id },
      data: {
        isCompleted,
        completedAt: isCompleted ? new Date() : null,
      },
      include: {
        topic: {
          include: {
            subject: { select: { id: true, name: true, color: true } },
          },
        },
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Revision PUT error:", error);
    return NextResponse.json({ error: "Failed to update revision" }, { status: 500 });
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

    const existing = await prisma.revision.findFirst({
      where: { id: params.id, userId: user.id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Revision not found" }, { status: 404 });
    }

    await prisma.revision.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Revision deleted successfully" });
  } catch (error) {
    console.error("Revision DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete revision" }, { status: 500 });
  }
}

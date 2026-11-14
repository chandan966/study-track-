import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import prisma from "@/lib/prisma";
import { profileSchema } from "@/lib/validations";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profile = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        name: true,
        email: true,
        studentId: true,
        image: true,
        college: true,
        course: true,
        branch: true,
        academicYear: true,
        semester: true,
        dailyGoalMinutes: true,
        preferredStudyHours: true,
        soundEnabled: true,
        notificationsEnabled: true,
        theme: true,
        createdAt: true,
      },
    });

    return NextResponse.json(profile);
  } catch (error) {
    console.error("Profile GET error:", error);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const result = profileSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: result.data.name,
        college: result.data.college,
        course: result.data.course,
        branch: result.data.branch,
        academicYear: result.data.academicYear,
        semester: result.data.semester,
        dailyGoalMinutes: result.data.dailyGoalMinutes,
        preferredStudyHours: result.data.preferredStudyHours,
        soundEnabled: body.soundEnabled !== undefined ? Boolean(body.soundEnabled) : undefined,
        notificationsEnabled: body.notificationsEnabled !== undefined ? Boolean(body.notificationsEnabled) : undefined,
        theme: body.theme || undefined,
      },
      select: {
        id: true,
        name: true,
        email: true,
        college: true,
        course: true,
        branch: true,
        academicYear: true,
        semester: true,
        dailyGoalMinutes: true,
        preferredStudyHours: true,
        soundEnabled: true,
        notificationsEnabled: true,
        theme: true,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Profile PUT error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}

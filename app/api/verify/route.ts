import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { format } from "date-fns";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const rawId = searchParams.get("id");

    if (!rawId || rawId.trim().length === 0) {
      return NextResponse.json(
        { error: "Certificate ID is required for verification." },
        { status: 400 }
      );
    }

    const cleanId = rawId.trim();

    // Search in persistent StudyCertificate table
    const cert = await prisma.studyCertificate.findFirst({
      where: {
        certificateId: {
          equals: cleanId,
        },
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            college: true,
            course: true,
            branch: true,
            academicYear: true,
            semester: true,
          },
        },
      },
    });

    if (!cert) {
      return NextResponse.json(
        {
          isValid: false,
          message: "No certificate found with this Certificate ID / HASH.",
          searchedId: cleanId,
        },
        { status: 404 }
      );
    }

    let subjects: any[] = [];
    try {
      subjects = JSON.parse(cert.subjectSnapshot || "[]");
    } catch {
      subjects = [];
    }

    const totalHours = Math.floor(cert.totalMinutes / 60);
    const totalRemainingMinutes = cert.totalMinutes % 60;
    const targetHours = Math.floor(cert.targetMinutes / 60);
    const targetRemainingMinutes = cert.targetMinutes % 60;

    return NextResponse.json({
      isValid: true,
      status: "AUTHENTICATED_AND_VERIFIED",
      certificateId: cert.certificateId,
      type: cert.type,
      periodLabel: cert.periodLabel,
      studentName: cert.studentName || cert.user.name,
      studentEmail: cert.studentEmail || cert.user.email,
      course: cert.course || cert.user.course || "SSC CGL / Govt Exam & Tech",
      college: cert.college || cert.user.college || "University / Institute",
      academicYear: cert.user.academicYear || "Final Year",
      semester: cert.user.semester || "Semester I",
      totalStudyMinutes: cert.totalMinutes,
      totalStudyFormatted: `${totalHours}h ${totalRemainingMinutes}m`,
      targetGoalFormatted: `${targetHours}h ${targetRemainingMinutes}m`,
      goalPercentage: cert.goalPercentage,
      grade: cert.grade,
      gradeLabel: cert.gradeLabel,
      sessionCount: cert.sessionCount,
      tasksCompletedCount: cert.tasksCompleted,
      subjects,
      issuedAt: format(cert.createdAt, "dd MMMM yyyy, hh:mm a"),
      authenticity: {
        seal: "STUDYTRACK VERIFIED ACADEMIC RECORD",
        ledgerStatus: "GENUINE_AND_ACTIVE",
        officer: "Dr. A. Verma (Dean of Academic Progress)",
        verificationHash: cert.certificateId,
      },
    });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { error: "Internal error processing certificate verification." },
      { status: 500 }
    );
  }
}

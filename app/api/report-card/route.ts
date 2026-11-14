import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import prisma from "@/lib/prisma";
import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  format,
  parseISO,
} from "date-fns";
import { calculateStreaks } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const type = (searchParams.get("type") || "daily") as "daily" | "weekly" | "monthly";
    const rawDate = searchParams.get("date");
    const targetDate = rawDate ? parseISO(rawDate) : new Date();

    let startDate: Date;
    let endDate: Date;
    let periodLabel: string;

    if (type === "weekly") {
      startDate = startOfWeek(targetDate, { weekStartsOn: 1 });
      endDate = endOfWeek(targetDate, { weekStartsOn: 1 });
      periodLabel = `Week of ${format(startDate, "dd MMM yyyy")} – ${format(endDate, "dd MMM yyyy")}`;
    } else if (type === "monthly") {
      startDate = startOfMonth(targetDate);
      endDate = endOfMonth(targetDate);
      periodLabel = format(targetDate, "MMMM yyyy");
    } else {
      startDate = startOfDay(targetDate);
      endDate = endOfDay(targetDate);
      periodLabel = format(targetDate, "EEEE, dd MMMM yyyy");
    }

    // Fetch user profile with academic details
    const userProfile = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        college: true,
        course: true,
        branch: true,
        academicYear: true,
        semester: true,
        dailyGoalMinutes: true,
      },
    });

    const dailyGoal = userProfile?.dailyGoalMinutes || 360;

    // Fetch study sessions in date range
    const sessions = await prisma.studySession.findMany({
      where: {
        userId: user.id,
        startTime: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        subject: {
          select: { id: true, name: true, color: true },
        },
        topic: {
          select: { id: true, name: true, understanding: true, difficulty: true },
        },
      },
      orderBy: { startTime: "asc" },
    });

    // Calculate streak across all sessions
    const allUserSessions = await prisma.studySession.findMany({
      where: { userId: user.id },
      select: { startTime: true, durationMinutes: true },
      orderBy: { startTime: "asc" },
    });
    const { currentStreak } = calculateStreaks(allUserSessions, dailyGoal);

    // Fetch completed tasks in date range
    const completedTasks = await prisma.task.findMany({
      where: {
        userId: user.id,
        status: "COMPLETED",
        updatedAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        subject: { select: { name: true } },
      },
      orderBy: { updatedAt: "desc" },
    });

    // Total study duration
    const totalDuration = sessions.reduce((acc, s) => acc + s.durationMinutes, 0);

    // Subject breakdown
    const subjectMap: Record<
      string,
      { name: string; color: string; duration: number; sessionCount: number; topics: Set<string> }
    > = {};

    sessions.forEach((s) => {
      const subName = s.subject?.name || "General";
      const subColor = s.subject?.color || "#EC4899";
      if (!subjectMap[subName]) {
        subjectMap[subName] = {
          name: subName,
          color: subColor,
          duration: 0,
          sessionCount: 0,
          topics: new Set<string>(),
        };
      }
      subjectMap[subName].duration += s.durationMinutes;
      subjectMap[subName].sessionCount += 1;
      if (s.topic?.name) {
        subjectMap[subName].topics.add(s.topic.name);
      }
    });

    const subjectBreakdown = Object.values(subjectMap).map((item) => ({
      name: item.name,
      color: item.color,
      duration: item.duration,
      percentage: totalDuration > 0 ? Math.round((item.duration / totalDuration) * 100) : 0,
      sessionCount: item.sessionCount,
      uniqueTopicsCount: item.topics.size,
    }));

    // Target Goal Calculation
    let targetGoalMinutes = dailyGoal;
    if (type === "weekly") {
      targetGoalMinutes = dailyGoal * 7;
    } else if (type === "monthly") {
      const daysInMonth = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0).getDate();
      targetGoalMinutes = dailyGoal * daysInMonth;
    }

    const goalPercentage = targetGoalMinutes > 0 ? Math.round((totalDuration / targetGoalMinutes) * 100) : 0;

    // Academic Grade Determination
    let grade = "C";
    let gradeLabel = "Satisfactory";
    let remarks = "Study goals are partially achieved. Maintain consistency to boost curriculum retention.";
    let gradeColor = "text-amber-600 bg-amber-50 border-amber-200";

    if (goalPercentage >= 100) {
      grade = "A+";
      gradeLabel = "Outstanding (Distinction)";
      remarks = "Exceptional academic commitment! Daily study targets achieved with complete syllabus focus.";
      gradeColor = "text-emerald-700 bg-emerald-50 border-emerald-300";
    } else if (goalPercentage >= 80) {
      grade = "A";
      gradeLabel = "Excellent";
      remarks = "Superb study velocity and strong mastery of topics demonstrated across sessions.";
      gradeColor = "text-pink-700 bg-pink-50 border-pink-300";
    } else if (goalPercentage >= 60) {
      grade = "B+";
      gradeLabel = "Very Good";
      remarks = "Solid study discipline. Keep pacing ahead to maximize deep conceptual understanding.";
      gradeColor = "text-indigo-700 bg-indigo-50 border-indigo-300";
    } else if (goalPercentage >= 40) {
      grade = "B";
      gradeLabel = "Good Progress";
      remarks = "Fair progress logged. Dedicate more focused pomodoro blocks to meet total target hours.";
      gradeColor = "text-blue-700 bg-blue-50 border-blue-300";
    }

    // Check if a certificate is already recorded for this user, type, and period
    let existingCert = await prisma.studyCertificate.findFirst({
      where: {
        userId: user.id,
        type,
        periodLabel,
      },
    });

    let certificateId = existingCert?.certificateId;

    if (!certificateId) {
      const sanitizedName = (userProfile?.name || "STUDENT").toUpperCase().replace(/[^A-Z]/g, "").slice(0, 4);
      const dateStamp = format(targetDate, "yyyyMMdd");
      const randomHash = Math.random().toString(36).substring(2, 6).toUpperCase();
      certificateId = `ST-REC-${dateStamp}-${sanitizedName}-${randomHash}`;
    }

    // Upsert the persistent certificate in the database for public verification
    await prisma.studyCertificate.upsert({
      where: { certificateId },
      update: {
        totalMinutes: totalDuration,
        targetMinutes: targetGoalMinutes,
        goalPercentage,
        grade,
        gradeLabel,
        sessionCount: sessions.length,
        tasksCompleted: completedTasks.length,
        subjectSnapshot: JSON.stringify(subjectBreakdown),
        studentName: userProfile?.name || "Student Aspirant",
        studentEmail: userProfile?.email || "",
        course: userProfile?.course || "SSC CGL / Govt Exam & Tech",
        college: userProfile?.college || "University / Institute",
      },
      create: {
        certificateId,
        userId: user.id,
        type,
        periodLabel,
        studentName: userProfile?.name || "Student Aspirant",
        studentEmail: userProfile?.email || "",
        course: userProfile?.course || "SSC CGL / Govt Exam & Tech",
        college: userProfile?.college || "University / Institute",
        totalMinutes: totalDuration,
        targetMinutes: targetGoalMinutes,
        goalPercentage,
        grade,
        gradeLabel,
        sessionCount: sessions.length,
        tasksCompleted: completedTasks.length,
        subjectSnapshot: JSON.stringify(subjectBreakdown),
      },
    });

    return NextResponse.json({
      type,
      periodLabel,
      generatedAt: format(new Date(), "dd MMMM yyyy, hh:mm a"),
      certificateId,
      student: {
        name: userProfile?.name || "Student Aspirant",
        email: userProfile?.email || "",
        college: userProfile?.college || "University / Institute",
        course: userProfile?.course || "Academic Program",
        branch: userProfile?.branch || "General Studies",
        academicYear: userProfile?.academicYear || "2026",
        semester: userProfile?.semester || "Semester I",
        streak: currentStreak || 1,
      },
      performance: {
        totalStudyMinutes: totalDuration,
        totalStudyFormatted: `${Math.floor(totalDuration / 60)}h ${totalDuration % 60}m`,
        targetGoalMinutes,
        targetGoalFormatted: `${Math.floor(targetGoalMinutes / 60)}h ${targetGoalMinutes % 60}m`,
        goalPercentage,
        grade,
        gradeLabel,
        gradeColor,
        remarks,
        sessionCount: sessions.length,
        tasksCompletedCount: completedTasks.length,
      },
      subjectBreakdown,
      sessions: sessions.map((s) => ({
        id: s.id,
        time: format(s.startTime, "hh:mm a"),
        durationFormatted: `${Math.floor(s.durationMinutes / 60)}h ${s.durationMinutes % 60}m`,
        durationMinutes: s.durationMinutes,
        subjectName: s.subject?.name || "General",
        subjectColor: s.subject?.color || "#EC4899",
        topicName: s.topic?.name || "General Study",
        difficulty: s.difficulty,
        notes: s.personalNotes,
        learned: s.whatLearned,
        understood: s.whatUnderstood,
        notUnderstood: s.whatNotUnderstood,
      })),
      completedTasks: completedTasks.map((t) => ({
        id: t.id,
        title: t.title,
        subject: t.subject?.name || "General",
      })),
      verification: {
        seal: "STUDYTRACK OFFICIAL ACADEMIC BOARD",
        issuer: "StudyTrack Platform Verification Service",
        officer: "Chandan Ghanghav (CEO, StudyTrack Platform)",
        digitalSignStatus: "VERIFIED_AUTHENTIC",
        isAuthentic: true,
      },
    });
  } catch (error) {
    console.error("Report Card Generation Error:", error);
    return NextResponse.json(
      { error: "Failed to generate study report card" },
      { status: 500 }
    );
  }
}

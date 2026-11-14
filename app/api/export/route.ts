import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import prisma from "@/lib/prisma";
import { format } from "date-fns";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sessions = await prisma.studySession.findMany({
      where: { userId: user.id },
      include: {
        subject: { select: { name: true } },
        topic: { select: { name: true, understanding: true } },
      },
      orderBy: { startTime: "desc" },
    });

    // Generate CSV content
    const headers = [
      "Date",
      "Start Time",
      "End Time",
      "Subject",
      "Topic",
      "Duration (Minutes)",
      "Session Mode",
      "Difficulty",
      "Topic Understanding (%)",
      "What Studied",
      "What Learned",
      "Personal Notes",
    ];

    const escapeCsv = (str: string | null | undefined) => {
      if (!str) return '""';
      const clean = str.replace(/"/g, '""').replace(/\r?\n/g, " ");
      return `"${clean}"`;
    };

    const rows = sessions.map((s) => [
      format(s.startTime, "yyyy-MM-dd"),
      format(s.startTime, "hh:mm a"),
      format(s.endTime, "hh:mm a"),
      escapeCsv(s.subject.name),
      escapeCsv(s.topic?.name || "General"),
      s.durationMinutes,
      s.mode,
      s.difficulty || "MEDIUM",
      s.topic?.understanding ?? "N/A",
      escapeCsv(s.whatStudied),
      escapeCsv(s.whatLearned),
      escapeCsv(s.personalNotes),
    ]);

    const csvString = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    return new Response(csvString, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="studytrack-history-${format(new Date(), "yyyy-MM-dd")}.csv"`,
      },
    });
  } catch (error) {
    console.error("Export GET error:", error);
    return NextResponse.json({ error: "Failed to export data" }, { status: 500 });
  }
}

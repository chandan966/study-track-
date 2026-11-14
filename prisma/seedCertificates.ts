import prisma from "../lib/prisma";

async function main() {
  const user = await prisma.user.findFirst();
  if (!user) {
    console.log("No user found");
    return;
  }

  const cert = await prisma.studyCertificate.upsert({
    where: { certificateId: "ST-REC-20261114-CHAN-FM71" },
    update: {},
    create: {
      certificateId: "ST-REC-20261114-CHAN-FM71",
      userId: user.id,
      type: "daily",
      periodLabel: "14 November 2026",
      studentName: user.name,
      studentEmail: user.email,
      course: "SSC CGL / Govt Exam & Tech Aspirant",
      college: "Delhi University / National Institute",
      totalMinutes: 335,
      targetMinutes: 360,
      goalPercentage: 93,
      grade: "A+",
      gradeLabel: "Outstanding (Distinction)",
      sessionCount: 4,
      tasksCompleted: 5,
      subjectSnapshot: JSON.stringify([
        {
          name: "Quantitative Aptitude",
          color: "#EC4899",
          duration: 90,
          percentage: 27,
          sessionCount: 1,
          uniqueTopicsCount: 1,
        },
        {
          name: "General Intelligence & Reasoning",
          color: "#DB2777",
          duration: 75,
          percentage: 22,
          sessionCount: 1,
          uniqueTopicsCount: 1,
        },
        {
          name: "English Language & Comprehension",
          color: "#F472B6",
          duration: 80,
          percentage: 24,
          sessionCount: 1,
          uniqueTopicsCount: 1,
        },
        {
          name: "General Studies & Awareness",
          color: "#BE185D",
          duration: 90,
          percentage: 27,
          sessionCount: 1,
          uniqueTopicsCount: 1,
        },
      ]),
    },
  });

  console.log("Successfully seeded certificate:", cert.certificateId);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
